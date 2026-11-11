"use client";

import { useRef, useState, type FormEvent } from "react";
import { Icon } from "@/components/ui";
import { track } from "@/lib/track";
import type { SiteLocale } from "@/lib/site-data";

/**
 * VIEWING REQUEST (OWNER toolkit mandate §18–20) — a focused drawer, not the Contact page: preferred day · time window (morning /
 * afternoon / other — no fake calendar slots) · name · phone · company (optional) · comment (optional). The wording is always
 * «Запрос на просмотр», never «Просмотр подтверждён»: no scheduling backend exists. PREVIEW RULE: nothing is sent; the production
 * edition renders DirectContact instead (next.config.ts alias → src/editions/production).
 */
const T = {
  ro: {
    intro: "Alegeți ziua și intervalul care vă convin — confirmăm ora personal.", day: "Ziua preferată", window: "Intervalul preferat", windows: { morning: "Dimineața", afternoon: "După-amiaza", other: "Alt interval" },
    name: "Nume", phone: "Telefon", company: "Companie (opțional)", comment: "Comentariu (opțional)", commentPh: "de ex. veniți doi, vă interesează demisolul",
    consent: "Sunt de acord ca datele mele să fie folosite pentru a răspunde la această cerere.", send: "Trimite cererea de vizionare", required: "obligatoriu",
    errors: { required: "Completați acest câmp.", phone: "Introduceți un număr de telefon valid.", consent: "Este necesar acordul pentru a răspunde.", summary: "Verificați câmpurile marcate:" },
    done: { kicker: "Previzualizare · nimic nu a fost trimis", title: "Cerere de vizionare", text: "Cererea este pregătită: confirmăm ziua și ora personal — telefonic sau prin e‑mail. Nu este o confirmare automată.", summary: "Detaliile cererii", again: "O nouă cerere" },
  },
  ru: {
    intro: "Выберите удобный день и время — точный час подтвердим лично.", day: "Удобный день", window: "Удобное время", windows: { morning: "Утром", afternoon: "Днём", other: "Другое время" },
    name: "Имя", phone: "Телефон", company: "Компания (необязательно)", comment: "Комментарий (необязательно)", commentPh: "например, приедем вдвоём, интересует цоколь",
    consent: "Согласен(на) на использование моих данных для ответа на этот запрос.", send: "Отправить запрос на просмотр", required: "обязательно",
    errors: { required: "Заполните это поле.", phone: "Укажите корректный номер телефона.", consent: "Нужно согласие, чтобы мы могли ответить.", summary: "Проверьте отмеченные поля:" },
    done: { kicker: "Превью · ничего не отправлено", title: "Запрос на просмотр", text: "Запрос подготовлен: день и час подтвердим лично — по телефону или e‑mail. Это не автоматическое подтверждение.", summary: "Детали запроса", again: "Новый запрос" },
  },
  en: {
    intro: "Choose the day and time window that suit you — we confirm the exact time personally.", day: "Preferred day", window: "Preferred time window", windows: { morning: "Morning", afternoon: "Afternoon", other: "Other" },
    name: "Name", phone: "Phone", company: "Company (optional)", comment: "Comment (optional)", commentPh: "e.g. two of us, interested in the lower ground",
    consent: "I agree that my data may be used to answer this request.", send: "Send the viewing request", required: "required",
    errors: { required: "Please fill in this field.", phone: "Enter a valid phone number.", consent: "We need your consent to reply.", summary: "Please check the marked fields:" },
    done: { kicker: "Preview · nothing was sent", title: "Viewing request", text: "Your request is ready: we confirm the day and time personally — by phone or e-mail. This is not an automatic confirmation.", summary: "Request details", again: "New request" },
  },
};

type Row = { label: string; value: string };

export function ViewingRequest({ locale, unitLabel, mailbox }: { locale: SiteLocale; unitLabel: string; mailbox: string }) {
  const t = T[locale];
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [done, setDone] = useState<Row[] | null>(null);
  const started = useRef(false);
  const summaryRef = useRef<HTMLDivElement>(null);
  const id = (n: string) => `lp-vr-${n}`;
  const today = new Date().toISOString().slice(0, 10);
  const start = () => { if (!started.current) { started.current = true; track("m20_viewing_start", { from: "form" }); } };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const get = (n: string) => String(data.get(n) ?? "").trim();
    const found: Record<string, string> = {};
    if (!get("day")) found.day = t.errors.required;
    if (!get("name")) found.name = t.errors.required;
    if (!/^\+?[\d\s()-]{7,}$/.test(get("phone"))) found.phone = t.errors.phone;
    if (!data.get("consent")) found.consent = t.errors.consent;
    setErrors(found);
    if (Object.keys(found).length) { window.requestAnimationFrame(() => summaryRef.current?.focus()); return; }
    const w = get("window") as keyof typeof t.windows;
    setDone([
      { label: unitLabel, value: "" },
      { label: t.day, value: get("day") },
      { label: t.window, value: t.windows[w] ?? t.windows.other },
      { label: t.name, value: get("name") },
      { label: t.phone, value: get("phone") },
      ...(get("company") ? [{ label: t.company, value: get("company") }] : []),
      ...(get("comment") ? [{ label: t.comment, value: get("comment") }] : []),
    ]);
    track("m20_viewing_submit", { window: w });
  };

  if (done) {
    return (
      <div className="lp-done" tabIndex={-1}>
        <p className="lp-done__kicker">{t.done.kicker}</p>
        <p className="lp-done__title">{t.done.title}</p>
        <p className="lp-done__text">{t.done.text} <span className="lp-done__mail">{mailbox}</span></p>
        <p className="lp-label">{t.done.summary}</p>
        <dl className="lp-summary">
          {done.filter((row) => row.value).map((row) => (<div key={row.label}><dt>{row.label}</dt><dd>{row.value}</dd></div>))}
        </dl>
        <button type="button" className="btn btn--ghost" onClick={() => setDone(null)}><span>{t.done.again}</span></button>
      </div>
    );
  }

  return (
    <form className="xp-form lp-form" noValidate onSubmit={onSubmit} onFocusCapture={start}>
      <p className="lp-form__unit">{unitLabel}</p>
      <p className="lp-form__intro">{t.intro}</p>
      {Object.keys(errors).length ? (
        <div className="xp-form__errors" ref={summaryRef} tabIndex={-1} role="alert">
          <p>{t.errors.summary}</p>
          <ul>{Object.keys(errors).map((n) => <li key={n}><a href={`#${id(n)}`}>{n === "consent" ? t.consent : n === "day" ? t.day : n === "name" ? t.name : t.phone}</a></li>)}</ul>
        </div>
      ) : null}
      <div className="xp-form__grid">
        <div className="xp-form__field">
          <label htmlFor={id("day")}>{t.day}<span className="xp-form__req" aria-hidden="true"> *</span></label>
          <input id={id("day")} name="day" type="date" min={today} required aria-invalid={errors.day ? true : undefined} />
          {errors.day ? <p className="xp-form__error">{errors.day}</p> : null}
        </div>
        <fieldset className="xp-form__field xp-form__choices lp-triple">
          <legend>{t.window}</legend>
          <div className="xp-choice-row">
            {(["morning", "afternoon", "other"] as const).map((w) => (
              <label key={w} className="xp-choice"><input type="radio" name="window" value={w} defaultChecked={w === "morning"} /><span>{t.windows[w]}</span></label>
            ))}
          </div>
        </fieldset>
        <div className="xp-form__field">
          <label htmlFor={id("name")}>{t.name}<span className="xp-form__req" aria-hidden="true"> *</span></label>
          <input id={id("name")} name="name" type="text" autoComplete="name" required aria-invalid={errors.name ? true : undefined} />
          {errors.name ? <p className="xp-form__error">{errors.name}</p> : null}
        </div>
        <div className="xp-form__field">
          <label htmlFor={id("phone")}>{t.phone}<span className="xp-form__req" aria-hidden="true"> *</span></label>
          <input id={id("phone")} name="phone" type="tel" autoComplete="tel" required aria-invalid={errors.phone ? true : undefined} />
          {errors.phone ? <p className="xp-form__error">{errors.phone}</p> : null}
        </div>
        <div className="xp-form__field">
          <label htmlFor={id("company")}>{t.company}</label>
          <input id={id("company")} name="company" type="text" autoComplete="organization" />
        </div>
        <div className="xp-form__field xp-form__field--full">
          <label htmlFor={id("comment")}>{t.comment}</label>
          <textarea id={id("comment")} name="comment" rows={3} placeholder={t.commentPh} />
        </div>
      </div>
      <label className="xp-form__consent" id={id("consent")}>
        <input type="checkbox" name="consent" aria-invalid={errors.consent ? true : undefined} />
        <span className="xp-need__box" aria-hidden="true" />
        <span>{t.consent}</span>
      </label>
      {errors.consent ? <p className="xp-form__error">{errors.consent}</p> : null}
      <div className="xp-form__submit">
        <button type="submit" className="btn"><span>{t.send}</span><Icon /></button>
        <p className="xp-form__note">* {t.required}</p>
      </div>
    </form>
  );
}
