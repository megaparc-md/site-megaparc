"use client";

import Link from "next/link";
import { useMemo, useRef, useState, type FormEvent } from "react";
import { CALENDAR_WEEKS, Calendar, SlotList, formatDay, mondayOf } from "@/components/visit-planner/calendar";
import { dateLocale, visitCopy, type VisitCopy } from "@/components/visit-planner/copy";
import { cancelVisit, clock, firstOpenDate, moveVisit, requestVisit, snapshotOf, visitByToken, type DemoVisit, type DeskState, type Locale } from "@/components/visit-planner/store";
import { commit, setAddress, useDeskState, useNow, useQuery } from "@/components/visit-planner/use-store";
import { addDays, icsEvent, isConfirmedForClient, openDays, slotsForDate, toZoned, type LocalDate, type Slot, type VisitSource } from "@/lib/visits/engine";
import { track } from "@/lib/track";
import type { PlannerProperty } from "@/components/visit-planner/types";

/**
 * VISIT PLANNER — the visitor's side (OWNER «VISIT PLANNER & COMMERCIAL DESK V1», stage 1, 2026-11-27).
 * One page: the property on the left (its own photograph and facts), the booking on the right — date → time → contact → request —
 * and, once a request exists, its status page (the address carries the request's key). Only intervals the engine returns can be
 * chosen; a request is never called «confirmed» before an employee confirmed it; the calendar file is offered only for a confirmed
 * visit. OWNER PREVIEW: the record lives in this browser (labelled), nothing is sent.
 */

const SOURCES: VisitSource[] = ["site", "tour", "assistant", "terms"];
const fill = (text: string, values: Record<string, string | number>) => text.replace(/\{(\w+)\}/g, (_, key: string) => String(values[key] ?? ""));

export function VisitPlanner({ locale, property }: { locale: Locale; property: PlannerProperty }) {
  const t = visitCopy[locale];
  const state = useDeskState();
  const now = useNow();
  const query = useQuery();
  const params = useMemo(() => new URLSearchParams(query), [query]);
  const token = params.get("r");
  const source = (SOURCES.find((item) => item === params.get("src")) ?? "site") as VisitSource;
  const visit = state && token ? visitByToken(state, token) : null;
  const [moving, setMoving] = useState(false);

  return (
    <div className="vp">
      <div className="vp-shell">
        <PropertyPanel t={t} property={property} minutes={state?.config.visitMinutes ?? null} />
        <div className="vp-flow">
          <p className="vp-demo" role="note">
            <strong>{t.demo.mark}</strong>
            <span>{t.demo.text}</span>
            {property.deskPath ? <Link href={property.deskPath} className="vp-demo__link">{t.demo.desk} →</Link> : null}
          </p>
          {!state || !now ? (
            <div className="vp-wait" aria-hidden="true"><span /><span /><span /></div>
          ) : token && !visit ? (
            <Missing t={t} onAgain={() => setAddress({ query: { r: null } })} />
          ) : visit && !moving ? (
            <Status t={t} locale={locale} state={state} visit={visit} property={property} now={now} onMove={() => setMoving(true)} onAgain={() => setAddress({ query: { r: null } })} />
          ) : (
            <Booking key={visit?.id ?? "new"} t={t} locale={locale} state={state} now={now} property={property} source={source} moving={visit} onKeep={() => setMoving(false)} onDone={(next) => { setMoving(false); setAddress({ query: { r: next.token } }); window.requestAnimationFrame(() => { const flow = document.querySelector(".vp-flow"); flow?.scrollIntoView({ block: "start" }); document.getElementById("vp-status-h")?.focus({ preventScroll: true }); }); }} />
          )}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* The property — its own photograph and facts                          */
/* ------------------------------------------------------------------ */

function PropertyPanel({ t, property, minutes }: { t: VisitCopy; property: PlannerProperty; minutes: number | null }) {
  const { photo } = property;
  return (
    <aside className="vp-property" aria-label={property.name}>
      <figure className="vp-property__photo">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={photo.src} srcSet={`${photo.small} 820w, ${photo.src} ${photo.width}w`} sizes="(min-width: 1024px) 42vw, 100vw" width={photo.width} height={photo.height} alt={photo.alt} style={photo.position ? { objectPosition: photo.position } : undefined} fetchPriority="high" decoding="async" />
      </figure>
      <div className="vp-property__body">
        <p className="vp-kicker">{t.kicker}</p>
        <h1 className="vp-property__name">{property.name}</h1>
        <p className="vp-property__place">{property.address} · {property.place}</p>
        {property.area ? <p className="vp-property__area"><b>{property.area}</b> <span>{t.offered}</span> · <span>{property.status}</span></p> : <p className="vp-property__area"><span>{property.status}</span></p>}
        <p className="vp-property__lead">{t.lead}</p>
        <dl className="vp-property__facts">
          {minutes ? <div><dt>{t.facts.durationLabel}</dt><dd>{fill(t.facts.duration, { n: minutes })}</dd></div> : null}
          <div><dt>{t.facts.withLabel}</dt><dd>{t.facts.with}</dd></div>
          <div><dt>{t.facts.levelsLabel}</dt><dd>{t.facts.levels}</dd></div>
        </dl>
        <ul className="vp-property__links">
          {property.tourPath ? <li><Link href={property.tourPath}>{t.tour}</Link></li> : null}
          {property.routeUrl ? <li><a href={property.routeUrl} target="_blank" rel="noopener noreferrer">{t.route}</a></li> : null}
          {property.mapUrl ? <li><a href={property.mapUrl} target="_blank" rel="noopener noreferrer">{t.map}</a></li> : null}
          <li><Link href={property.pagePath}>{t.property}</Link></li>
        </ul>
      </div>
    </aside>
  );
}

/* ------------------------------------------------------------------ */
/* Booking: date → time → contact                                       */
/* ------------------------------------------------------------------ */

function Booking({ t, locale, state, now, property, source, moving, onKeep, onDone }: {
  t: VisitCopy; locale: Locale; state: DeskState; now: number; property: PlannerProperty; source: VisitSource; moving: DemoVisit | null; onKeep: () => void; onDone: (visit: DemoVisit) => void;
}) {
  const intl = dateLocale(locale);
  const config = state.config;
  const today = toZoned(now, config.timezone).date;
  const last = addDays(today, config.horizonDays);
  const options = useMemo(() => (moving ? { ignoreVisitId: moving.id } : {}), [moving]);
  const snapshot = useMemo(() => snapshotOf(state), [state]);
  const first = useMemo(() => firstOpenDate(state, property.slug, now), [state, property.slug, now]);
  const [startView, setStartView] = useState<LocalDate | null>(null);
  const [datePick, setDate] = useState<LocalDate | null>(null);
  const [startPick, setStart] = useState<number | null>(null);
  const [language, setLanguage] = useState<Locale>(locale);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const errorRef = useRef<HTMLDivElement>(null);
  const start = startView ?? mondayOf(today);
  const open = useMemo(() => openDays(snapshot, property.slug, start, CALENDAR_WEEKS * 7, now, options), [snapshot, property.slug, start, now, options]);
  const date = datePick && (open[datePick] ?? 0) > 0 ? datePick : null;
  const slots: Slot[] = useMemo(() => (date ? slotsForDate(snapshot, property.slug, date, now, options) : []), [snapshot, property.slug, date, now, options]);
  const slot = slots.find((item) => item.startUtc === startPick) ?? null;
  const id = (name: string) => `vp-${name}`;

  const pickDate = (next: LocalDate) => { setDate(next); setStart(null); track("visit_date", { property: property.slug }); };
  const pickSlot = (next: Slot) => { setStart(next.startUtc); setErrors((current) => ({ ...current, slot: "" })); track("visit_slot", { property: property.slug }); };
  const fail = (found: Record<string, string>) => { setErrors(found); window.requestAnimationFrame(() => errorRef.current?.focus()); };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const get = (name: string) => String(data.get(name) ?? "").trim();
    const found: Record<string, string> = {};
    if (!slot) found.slot = t.form.errors.slot;
    if (moving) {
      if (!slot) return fail(found);
      const moved = moveVisit(state, moving.id, slot.startUtc, "client", clock());
      if (!moved.ok) { setStart(null); return fail({ slot: t.form.errors.taken }); }
      commit(moved.state);
      track("visit_move", { property: property.slug });
      return onDone(moved.visit);
    }
    if (get("name").length < 2) found.name = t.form.errors.name;
    if (!/^\+?[\d\s()-]{7,}$/.test(get("phone"))) found.phone = t.form.errors.phone;
    if (get("email") && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(get("email"))) found.email = t.form.errors.email;
    if (!data.get("consent")) found.consent = t.form.errors.consent;
    if (Object.keys(found).length || !slot) return fail(found);
    const result = requestVisit(state, { propertyId: property.slug, startUtc: slot.startUtc, name: get("name"), company: get("company"), phone: get("phone"), email: get("email"), note: get("note"), locale: language, source }, clock());
    if (!result.ok) { setStart(null); return fail({ slot: t.form.errors.taken }); }
    commit(result.state);
    track("visit_request", { property: property.slug, source });
    onDone(result.visit);
  };

  const errorKeys = Object.keys(errors).filter((key) => errors[key]);
  return (
    <form className="vp-form" noValidate onSubmit={onSubmit}>
      {moving ? <p className="vp-moving" role="status">{t.status.moving}</p> : null}
      {errorKeys.length ? (
        <div className="vp-errors" ref={errorRef} tabIndex={-1} role="alert">
          <p>{t.form.errors.summary}</p>
          <ul>{errorKeys.map((key) => <li key={key}><a href={`#${id(key === "slot" ? "date" : key)}`}>{errors[key]}</a></li>)}</ul>
        </div>
      ) : null}

      <section className="vp-step" id={id("date")} aria-labelledby={id("date-h")}>
        <h2 className="vp-step__title" id={id("date-h")}><span className="vp-step__n">01</span>{t.steps.date}</h2>
        {first ? (
          <>
            <Calendar start={start} today={today} last={last} open={open} selected={date} intl={intl} labels={t.calendar} onStart={setStartView} onSelect={pickDate} />
            <p className="vp-note">{t.calendar.legend}</p>
          </>
        ) : (
          <p className="vp-empty">{fill(t.calendar.empty, { n: config.horizonDays })}</p>
        )}
      </section>

      <section className="vp-step" id={id("time")} aria-labelledby={id("time-h")}>
        <h2 className="vp-step__title" id={id("time-h")}><span className="vp-step__n">02</span>{t.steps.time}</h2>
        {!date ? <p className="vp-empty">{t.slots.pick}</p> : slots.length ? <SlotList slots={slots} selected={slot?.startUtc ?? null} onSelect={pickSlot} labels={t.slots} /> : <p className="vp-empty">{t.slots.none}</p>}
        <p className={`vp-chosen${slot ? " is-set" : ""}`} aria-live="polite">
          {slot && date ? <><span>{t.slots.selected}</span><b>{formatDay(date, intl)} · {slot.time}–{slot.endTime}</b><span>{t.slots.zone}</span></> : null}
        </p>
      </section>

      {moving ? (
        <div className="vp-submit">
          <button type="submit" className="btn vp-btn" disabled={!slot}><span>{t.status.moveSubmit}</span></button>
          <button type="button" className="vp-text" onClick={onKeep}>{t.status.keep}</button>
        </div>
      ) : (
        <section className="vp-step" aria-labelledby={id("contact-h")}>
          <h2 className="vp-step__title" id={id("contact-h")}><span className="vp-step__n">03</span>{t.steps.contact}</h2>
          <div className="vp-fields">
            <Field id={id("name")} name="name" label={t.form.name} required autoComplete="name" error={errors.name} />
            <Field id={id("phone")} name="phone" label={t.form.phone} required type="tel" autoComplete="tel" error={errors.phone} />
            <Field id={id("email")} name="email" label={t.form.email} hint={t.form.optional} type="email" autoComplete="email" error={errors.email} />
            <Field id={id("company")} name="company" label={t.form.company} hint={t.form.optional} autoComplete="organization" />
            <div className="vp-field vp-field--full">
              <label htmlFor={id("note")}>{t.form.note} <span className="vp-field__hint">{t.form.optional}</span></label>
              <textarea id={id("note")} name="note" rows={3} maxLength={600} placeholder={t.form.notePh} />
            </div>
            <fieldset className="vp-field vp-field--full vp-lang">
              <legend>{t.form.language}</legend>
              <div className="vp-lang__row">
                {(["ro", "ru", "en"] as const).map((item) => (
                  <label key={item} className={`vp-lang__item${language === item ? " is-on" : ""}`}>
                    <input type="radio" name="language" value={item} checked={language === item} onChange={() => setLanguage(item)} />
                    <span>{t.languages[item]}</span>
                  </label>
                ))}
              </div>
            </fieldset>
          </div>
          <label className="vp-consent" id={id("consent")}>
            <input type="checkbox" name="consent" aria-invalid={errors.consent ? true : undefined} />
            <span>{t.form.consent}</span>
          </label>
          <div className="vp-submit">
            <button type="submit" className="btn vp-btn"><span>{t.form.submit}</span></button>
            <p className="vp-note">{t.form.after}</p>
          </div>
        </section>
      )}
    </form>
  );
}

function Field({ id, name, label, hint, required, type = "text", autoComplete, error }: { id: string; name: string; label: string; hint?: string; required?: boolean; type?: string; autoComplete?: string; error?: string }) {
  return (
    <div className={`vp-field${error ? " has-error" : ""}`}>
      <label htmlFor={id}>{label}{required ? <span className="vp-field__req" aria-hidden="true"> *</span> : hint ? <span className="vp-field__hint"> {hint}</span> : null}</label>
      <input id={id} name={name} type={type} autoComplete={autoComplete} required={required} aria-invalid={error ? true : undefined} aria-describedby={error ? `${id}-e` : undefined} />
      {error ? <p className="vp-field__error" id={`${id}-e`}>{error}</p> : null}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* The status page of a request                                         */
/* ------------------------------------------------------------------ */

function Status({ t, locale, state, visit, property, now, onMove, onAgain }: { t: VisitCopy; locale: Locale; state: DeskState; visit: DemoVisit; property: PlannerProperty; now: number; onMove: () => void; onAgain: () => void }) {
  const intl = dateLocale(locale);
  const [asking, setAsking] = useState(false);
  const zoned = toZoned(visit.startUtc, state.config.timezone);
  const end = toZoned(visit.endUtc, state.config.timezone).time;
  const s = t.status;
  const view = visit.status === "cancelled" ? (visit.cancelledBy === "staff" ? s.cancelledStaff : s.cancelledClient) : s[visit.status];
  const confirmed = isConfirmedForClient(visit.status);
  const active = visit.status === "requested" || visit.status === "confirmed";
  const upcoming = active && visit.startUtc > now;

  const download = () => {
    const text = icsEvent({
      uid: `${visit.ref}@megaparc.md`, startUtc: visit.startUtc, endUtc: visit.endUtc, stampUtc: clock(),
      title: fill(s.icsTitle, { name: property.name }), location: `${property.address}, ${property.place}`, description: fill(s.icsText, { name: property.name, ref: visit.ref }), url: property.mapUrl ?? undefined,
    });
    const url = URL.createObjectURL(new Blob([text], { type: "text/calendar;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `MEGAPARC-${property.slug}-${zoned.date}.ics`;
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 2000);
    track("visit_ics", { property: property.slug });
  };

  return (
    <section className={`vp-status is-${visit.status}`} aria-labelledby="vp-status-h">
      <p className={`vp-mark is-${visit.status}`}>{view.mark}</p>
      <h2 className="vp-status__title" id="vp-status-h" tabIndex={-1}>{view.title}</h2>
      <p className="vp-status__text">{view.text}</p>
      {visit.movedFrom && visit.status === "confirmed" ? <p className="vp-status__moved" role="status">{s.moved}</p> : null}
      {visit.clientMessage ? <p className="vp-status__message"><span>{s.message}</span>{visit.clientMessage}</p> : null}

      {active || visit.status === "completed" ? (
        <ol className="vp-line" aria-label={view.mark}>
          {[s.line.received, s.line.confirm, s.line.visit].map((label, index) => {
            const done = index === 0 || (index === 1 && confirmed) || (index === 2 && visit.status === "completed");
            const next = !done && (index === 1 || confirmed);
            return <li key={label} className={done ? "is-done" : next ? "is-next" : ""}><span className="vp-line__dot" aria-hidden="true" />{label}</li>;
          })}
        </ol>
      ) : null}

      <dl className="vp-ticket">
        <div className="vp-ticket__when"><dt>{s.when}</dt><dd><b>{formatDay(zoned.date, intl)}</b><span>{zoned.time}–{end} · {t.slots.zone}</span></dd></div>
        <div><dt>{s.where}</dt><dd><b>{property.name}</b><span>{property.address} · {property.place}</span></dd></div>
        <div><dt>{s.ref}</dt><dd><b className="vp-ticket__ref">{visit.ref}</b></dd></div>
        <div><dt>{s.who}</dt><dd><span>{s.manager}</span></dd></div>
      </dl>

      {upcoming ? (
        <div className="vp-actions">
          {confirmed ? <button type="button" className="btn vp-btn" onClick={download}><span>{s.ics}</span></button> : <p className="vp-note vp-actions__wait">{s.icsWait}</p>}
          {property.routeUrl ? <a className="btn btn--ghost vp-btn" href={property.routeUrl} target="_blank" rel="noopener noreferrer"><span>{t.route}</span></a> : null}
          {property.tourPath ? <Link className="btn btn--ghost vp-btn" href={property.tourPath}><span>{t.tour}</span></Link> : null}
        </div>
      ) : null}

      <div className="vp-manage">
        {upcoming && !asking ? (
          <>
            <button type="button" className="vp-text" onClick={onMove}>{s.move}</button>
            <button type="button" className="vp-text" onClick={() => setAsking(true)}>{s.cancel}</button>
          </>
        ) : null}
        {upcoming && asking ? (
          <div className="vp-ask" role="group" aria-label={s.cancelAsk}>
            <p>{s.cancelAsk}</p>
            <button type="button" className="btn vp-btn" onClick={() => { commit(cancelVisit(state, visit.id, "client", "", clock())); setAsking(false); track("visit_cancel", { property: property.slug }); }}><span>{s.yes}</span></button>
            <button type="button" className="vp-text" onClick={() => setAsking(false)}>{s.no}</button>
          </div>
        ) : null}
        {!upcoming ? <button type="button" className="btn vp-btn" onClick={onAgain}><span>{s.again}</span></button> : null}
      </div>
    </section>
  );
}

function Missing({ t, onAgain }: { t: VisitCopy; onAgain: () => void }) {
  return (
    <section className="vp-status">
      <p className="vp-status__text">{t.status.notFound}</p>
      <div className="vp-manage"><button type="button" className="btn vp-btn" onClick={onAgain}><span>{t.status.again}</span></button></div>
    </section>
  );
}
