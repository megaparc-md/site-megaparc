"use client";

import { useId, useMemo, useState, type ChangeEvent, type MouseEvent } from "react";
import { economicsCopy, type PresetKey } from "@/components/leasing-experience/economics-copy";
import { calcEconomics, parseAmount, parsePercent } from "@/components/leasing-experience/economics-math";
import type { EconomicsHandoff } from "@/components/leasing-experience/viewing-form";
import { toolkitCopy } from "@/data/moscova-20-toolkit";
import { isProductionEdition, type SiteLocale } from "@/lib/site-data";

/**
 * «ПРОВЕРИТЬ ЭКОНОМИКУ ТОЧКИ» — a reverse calculation, never a profit forecast (OWNER addendum "TENANT ECONOMICS &
 * DECISION TOOL", 2026-11-06), rebuilt as a two-level decision instrument (OWNER UX correction «REBUILD POINT
 * ECONOMICS CALCULATOR», 2026-11-10):
 *   LEVEL 1 · quick check — four fields (ticket · margin / revenue · conversion), the visitors a day the model needs as
 *            the one large number, sales per month / day beside it, the 5 · 10 · 15 · 20 % sensitivity, the plain
 *            conclusion, «Сравнить с локацией», the viewing action;
 *   LEVEL 2 · «Расширенный расчёт» behind a disclosure — working days, rent (the visitor's own assumption — never a
 *            published term), fixed costs and launch CAPEX → break-even revenue · break-even visitors · operating
 *            result · CAPEX payback in months.
 * Arithmetic in economics-math.ts. No account, nothing stored, nothing sent.
 */

export type TrafficSummary = { status: "MODELLED" | "MEASURED" | "VERIFIED"; pedestrians: string | null; vehicles: string | null; date: string | null } | null;
type Example = { ticket: number; revenue: number; conversion: number; days: number };

const presets: PresetKey[] = ["retail", "showroom", "services", "center"];
const fixedKeys = ["rent", "opex", "payroll", "utilities", "marketing", "other"] as const;
type Key = "ticket" | "revenue" | "margin" | "conversion" | "days" | (typeof fixedKeys)[number] | "capex";

export function EconomicsTool({ locale, property, example, rates, traffic, visitLabel }: { locale: SiteLocale; property: string; example: Example; rates: number[]; traffic: TrafficSummary; /** the status of the unit decides the visit action (a RESERVED unit → the waitlist) */ visitLabel?: string }) {
  const t = economicsCopy[locale];
  const uid = useId();
  const nf = useMemo(() => new Intl.NumberFormat(locale === "ru" ? "ru-RU" : locale === "ro" ? "ro-RO" : "en-GB", { maximumFractionDigits: 0 }), [locale]);
  const nf1 = useMemo(() => new Intl.NumberFormat(locale === "ru" ? "ru-RU" : locale === "ro" ? "ro-RO" : "en-GB", { maximumFractionDigits: 1, minimumFractionDigits: 1 }), [locale]);
  const f = (n: number) => nf.format(Math.round(n));

  const [preset, setPreset] = useState<PresetKey>("retail");
  const [isExample, setIsExample] = useState(false);
  const [v, setV] = useState<Record<Key, string>>({ ticket: "", revenue: "", margin: "", conversion: "", days: String(example.days), rent: "", opex: "", payroll: "", utilities: "", marketing: "", other: "", capex: "" });
  const [compare, setCompare] = useState(false);
  const p = t.presets[preset];

  const set = (key: Key) => (event: ChangeEvent<HTMLInputElement>) => {
    setV((old) => ({ ...old, [key]: event.target.value }));
    setIsExample(false);
  };
  const loadExample = () => {
    // plain digits — the visitor sees the figure exactly as it is parsed, in every locale (RO groups thousands with a dot)
    setV((old) => ({ ...old, ticket: String(example.ticket), revenue: String(example.revenue), conversion: String(example.conversion), days: String(example.days) }));
    setIsExample(true);
  };
  const clear = () => {
    setV((old) => ({ ...old, ticket: "", revenue: "", margin: "", conversion: "" }));
    setIsExample(false);
    setCompare(false);
  };

  const r = calcEconomics(
    {
      ticket: parseAmount(v.ticket),
      revenue: parseAmount(v.revenue),
      margin: parsePercent(v.margin),
      conversion: parsePercent(v.conversion),
      days: parseAmount(v.days) ?? example.days,
      fixed: fixedKeys.map((key) => parseAmount(v[key])),
      capex: parseAmount(v.capex),
    },
    rates,
  );
  const conversion = parsePercent(v.conversion);
  const days = parseAmount(v.days) ?? example.days;

  const handoff = (event: MouseEvent<HTMLButtonElement>) => {
    const revenue = parseAmount(v.revenue);
    const ticket = parseAmount(v.ticket);
    const detail: EconomicsHandoff = {
      business: p.label,
      lines: [
        ...(revenue ? [{ label: t.lines.revenue, value: `${f(revenue)} ${t.units.mdl}` }] : []),
        ...(ticket ? [{ label: t.lines.ticket, value: `${f(ticket)} ${t.units.mdl}` }] : []),
        ...(conversion ? [{ label: t.lines.conversion, value: `${conversion} ${t.units.pct}` }] : []),
        ...(r.visitors ? [{ label: t.lines.visitors, value: `${t.approx} ${f(r.visitors)} · ${p.focal(r.visitors)}` }] : []),
      ],
    };
    window.dispatchEvent(new CustomEvent("lg:economics", { detail }));
    (event.currentTarget.closest("dialog") as HTMLDialogElement | null)?.close();
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.requestAnimationFrame(() => document.getElementById("lg-form")?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" }));
  };

  const field = (key: Key, label: string, unit: string, hint?: string) => (
    <div className="lg-calc__field">
      <label className="lg-calc__label" htmlFor={`${uid}-${key}`}>{label}</label>
      <span className="lg-calc__control">
        <input className="lg-calc__input" id={`${uid}-${key}`} type="text" inputMode="decimal" autoComplete="off" value={v[key]} onChange={set(key)} aria-describedby={hint ? `${uid}-${key}-hint` : undefined} />
        <span className="lg-calc__unit" aria-hidden="true">{unit}</span>
      </span>
      {hint ? <span className="lg-calc__hint" id={`${uid}-${key}-hint`}>{hint}</span> : null}
    </div>
  );

  return (
    <div className="lg-calc">
      <header className="lg-calc__head">
        <h3 className="lg-calc__title">{t.title}</h3>
        <p className="lg-calc__principle">{t.principle}</p>
      </header>

      <div className="lg-calc__bar">
        <div className="lg-calc__presets" role="group" aria-label={t.presetsLabel}>
          {presets.map((key) => (
            <button key={key} type="button" aria-pressed={preset === key} className={preset === key ? "is-on" : undefined} onClick={() => setPreset(key)}>
              {t.presets[key].label}
            </button>
          ))}
        </div>
        <div className="lg-calc__tools">
          <button type="button" className="lg-calc__link" onClick={loadExample}>{t.example}</button>
          <button type="button" className="lg-calc__link is-quiet" onClick={clear}>{t.clear}</button>
        </div>
      </div>
      {isExample ? <p className="lg-calc__example">{t.exampleNote.replace("Moscova 20", property)}</p> : null}

      {/* LEVEL 1 — quick check */}
      <div className="lg-calc__fields">
        {field("ticket", t.inputs.ticket, t.units.mdl, p.ticket)}
        {field("margin", t.inputs.margin, t.units.pct)}
        {field("revenue", t.inputs.revenue, t.units.mdl)}
        {field("conversion", t.inputs.conversion, t.units.pct, p.conversion)}
      </div>

      <div className={`lg-calc__result${r.visitors ? " is-ready" : ""}`} aria-live="polite">
        <div className="lg-calc__focalblock">
          <p className="lg-calc__focal">
            {r.visitors ? <span className="lg-calc__approx">{t.approx}</span> : null}
            <span className="lg-calc__focalnum">{r.visitors ? f(r.visitors) : "—"}</span>
          </p>
          <p className="lg-calc__focallabel">{p.focal(r.visitors ?? 0)}</p>
        </div>
        <dl className="lg-calc__secondary">
          <div>
            <dt>{t.outputs.perMonth}</dt>
            <dd className="lg-calc__month">{r.perMonth ? f(r.perMonth) : "—"}</dd>
          </div>
          <div>
            <dt>{t.outputs.perDay}</dt>
            <dd className="lg-calc__day">{r.perDay ? `${t.approx} ${f(r.perDay)}` : "—"}</dd>
          </div>
        </dl>
        <p className="lg-calc__days">{r.perMonth ? t.daysNote(days) : t.empty}</p>
      </div>

      {r.perDay ? (
        <div className="lg-calc__sens">
          <p className="lg-calc__senslabel">{t.sensitivity}</p>
          <ol>
            {r.sensitivity.map((item) => (
              <li key={item.rate} className={conversion === item.rate ? "is-on" : undefined}>
                <span className="lg-calc__rate">{item.rate} {t.units.pct}</span>
                <strong>{item.visitors ? `${t.approx} ${f(item.visitors)}` : "—"}</strong>
              </li>
            ))}
          </ol>
          <p className="lg-calc__sensunit">{t.sensitivityUnit}</p>
        </div>
      ) : null}

      {r.visitors ? (
        <div className="lg-calc__conclusion">
          <p className="lg-calc__need">{t.need(r.visitors, f(r.visitors))}</p>
          {!compare ? (
            <button type="button" className="lg-calc__link is-arrow" onClick={() => setCompare(true)} aria-expanded={false}>{t.compare} →</button>
          ) : (
            <div className="lg-calc__location">
              {traffic && (traffic.pedestrians || traffic.vehicles) ? (
                <>
                  <p className="lg-calc__locstatus">{t.status[traffic.status]}{traffic.date ? ` · ${traffic.date}` : ""}</p>
                  <p className="lg-calc__ranges">
                    {traffic.pedestrians ? <span><strong>{traffic.pedestrians}</strong> {t.figures.pedestrians}</span> : null}
                    {traffic.vehicles ? <span><strong>{traffic.vehicles}</strong> {t.figures.vehicles}</span> : null}
                  </p>
                  <p>{t.compareText(f(r.visitors))}</p>
                </>
              ) : (
                <p>{t.compareNone}</p>
              )}
              <a className="pm-link" href="#lg-form" data-intent="viewing"><span>{t.discuss}</span></a>
            </div>
          )}
        </div>
      ) : null}

      {/* the viewing action right after the result — never lost after a long form */}
      <div className="lg-calc__actions">
        <a className="btn" href="#lg-form" data-intent="viewing"><span>{visitLabel ?? t.visit(property)}</span></a>
        {/* production has no form backend (DirectContact): the calculation is not handed to a form there */}
        {isProductionEdition ? null : <button type="button" className="btn btn--ghost" onClick={handoff}><span>{t.handoff}</span></button>}
        {/* Digital Leasing Toolkit (OWNER 2026-11-11 §28): contextual navigation only — the formulas above are unchanged */}
        <a className="pm-link lg-calc__precheck" href="#precheck" data-drawer="precheck" aria-haspopup="dialog"><span>{toolkitCopy.economics.precheck[locale]}</span></a>
      </div>

      {/* LEVEL 2 — advanced economics */}
      <details className="lg-calc__adv">
        <summary>
          <span className="lg-calc__advtitle">{t.advanced} →</span>
          <span className="lg-calc__advlead">{t.advLead}</span>
        </summary>
        <div className="lg-calc__fields is-adv">
          {field("days", t.adv.days, t.units.days)}
          {field("rent", t.adv.rent, t.units.mdl, t.rentHint)}
          {field("opex", t.adv.opex, t.units.mdlMonth)}
          {field("payroll", t.adv.payroll, t.units.mdlMonth)}
          {field("utilities", t.adv.utilities, t.units.mdlMonth)}
          {field("marketing", t.adv.marketing, t.units.mdlMonth)}
          {field("other", t.adv.other, t.units.mdlMonth)}
          {field("capex", t.adv.capex, t.units.mdl)}
        </div>
        <div className="lg-calc__advresult" aria-live="polite">
          {r.advanced === "need-margin" ? (
            <p className="lg-calc__advnote">{t.needMargin}</p>
          ) : r.advanced === "need-fixed" ? (
            <p className="lg-calc__advnote">{t.needFixed}</p>
          ) : (
            <dl className="lg-calc__advout">
              <div>
                <dt>{t.advOut.beRevenue}</dt>
                <dd>{r.beRevenue ? f(r.beRevenue) : "—"}<span>{t.units.mdlMonth}</span></dd>
              </div>
              <div>
                <dt>{t.advOut.beVisitors}</dt>
                <dd>{r.beVisitors ? `${t.approx} ${f(r.beVisitors)}` : "—"}<span>{t.perDayShort}</span></dd>
              </div>
              <div>
                <dt>{t.advOut.result}</dt>
                <dd className={r.result !== null && r.result < 0 ? "is-negative" : undefined}>{r.result !== null ? `${r.result < 0 ? "−" : ""}${f(Math.abs(r.result))}` : "—"}<span>{t.units.mdlMonth}</span></dd>
              </div>
              <div>
                <dt>{t.advOut.payback}</dt>
                {r.paybackBlocked ? (
                  <dd className="is-note">{t.noPayback}</dd>
                ) : (
                  <dd>{r.payback ? `${t.approx} ${nf1.format(r.payback)}` : "—"}<span>{t.units.months}</span></dd>
                )}
              </div>
            </dl>
          )}
        </div>
      </details>

      <footer className="lg-calc__foot">
        <p className="lg-calc__closing">{t.closing}</p>
        {t.disclaimer.map((line) => (
          <p key={line} className="lg-calc__disclaimer">{line}</p>
        ))}
      </footer>
    </div>
  );
}
