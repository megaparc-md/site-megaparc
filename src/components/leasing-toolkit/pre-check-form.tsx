"use client";

import { useRef, useState, type FormEvent } from "react";
import { Icon } from "@/components/ui";
import { track } from "@/lib/track";
import type { SiteLocale } from "@/lib/site-data";

/**
 * TECHNICAL CONCEPT PRE-CHECK (OWNER toolkit mandate §14–17) — «Проверить, подходит ли помещение моему формату»: at most eight
 * compact inputs (business type · area · power · extraction · goods loading · signage · a short concept · contact). The result is
 * never «suitable / not suitable»: «Мы проверим техническую реализуемость вашей концепции.» — the Technical Director and the
 * Architect, no automatic guarantee. PREVIEW RULE: nothing is sent (no fetch, no mailto, no storage) — the request is summarised
 * locally; the production edition renders DirectContact instead (next.config.ts alias → src/editions/production).
 */
const T = {
  ro: {
    intro: "Spuneți-ne pe scurt ce planificați — verificăm dacă infrastructura spațiului corespunde formatului dumneavoastră.",
    type: "Tipul afacerii", types: ["Retail", "Showroom", "Servicii", "Medical / wellness", "Birou", "Alimentație / alt concept", "Altceva"],
    area: "Suprafața necesară", areaUnit: "m²", power: "Puterea electrică necesară", powerUnit: "kW", unknown: "nu știu",
    extraction: "Aveți nevoie de hotă?", loading: "Aveți nevoie de descărcare de marfă?", signage: "Aveți nevoie de firmă pe fațadă?",
    yes: "Da", no: "Nu", unsure: "Nu sunt sigur",
    concept: "Conceptul pe scurt (opțional)", conceptPh: "de ex. clinică stomatologică cu 4 cabinete",
    name: "Nume", contact: "Telefon sau e‑mail", consent: "Sunt de acord ca datele mele să fie folosite pentru a răspunde la această cerere.",
    send: "Trimite la verificare", required: "obligatoriu",
    errors: { required: "Completați acest câmp.", contact: "Introduceți un telefon sau un e‑mail valid.", consent: "Este necesar acordul pentru a răspunde.", summary: "Verificați câmpurile marcate:" },
    done: { kicker: "Previzualizare · nimic nu a fost trimis", title: "Vom verifica fezabilitatea tehnică a conceptului dumneavoastră.", principle: "Mai întâi verificăm fezabilitatea tehnică — apoi discutăm condițiile comerciale.", team: "Directorul tehnic și arhitectul MEGAPARC analizează cerințele și vă contactează cu întrebări concrete — fără garanții automate.", summary: "Rezumatul cererii", again: "O nouă verificare" },
  },
  ru: {
    intro: "Коротко расскажите, что вы планируете, — проверим, соответствует ли инфраструктура помещения вашему формату.",
    type: "Вид бизнеса", types: ["Ритейл", "Шоурум", "Сервис", "Медицина / wellness", "Офис", "Общепит / другой формат", "Другое"],
    area: "Нужная площадь", areaUnit: "м²", power: "Нужная электрическая мощность", powerUnit: "кВт", unknown: "не знаю",
    extraction: "Нужна вытяжка?", loading: "Нужна разгрузка товара?", signage: "Нужна вывеска на фасаде?",
    yes: "Да", no: "Нет", unsure: "Не знаю",
    concept: "Концепция коротко (необязательно)", conceptPh: "например, стоматология на 4 кабинета",
    name: "Имя", contact: "Телефон или e‑mail", consent: "Согласен(на) на использование моих данных для ответа на этот запрос.",
    send: "Отправить на проверку", required: "обязательно",
    errors: { required: "Заполните это поле.", contact: "Укажите телефон или корректный e‑mail.", consent: "Нужно согласие, чтобы мы могли ответить.", summary: "Проверьте отмеченные поля:" },
    done: { kicker: "Превью · ничего не отправлено", title: "Мы проверим техническую реализуемость вашей концепции.", principle: "Сначала проверяем техническую реализуемость — затем обсуждаем коммерческие условия.", team: "Технический директор и архитектор MEGAPARC разберут требования и свяжутся с вами с конкретными вопросами — без автоматических гарантий.", summary: "Сводка запроса", again: "Новая проверка" },
  },
  en: {
    intro: "Tell us briefly what you are planning — we check whether the infrastructure of the premises matches your format.",
    type: "Business type", types: ["Retail", "Showroom", "Services", "Medical / wellness", "Office", "Food / other concept", "Other"],
    area: "Required area", areaUnit: "m²", power: "Required electrical power", powerUnit: "kW", unknown: "not sure",
    extraction: "Extraction required?", loading: "Goods loading required?", signage: "Facade signage required?",
    yes: "Yes", no: "No", unsure: "Unsure",
    concept: "Short concept description (optional)", conceptPh: "e.g. a dental clinic with 4 rooms",
    name: "Name", contact: "Phone or e-mail", consent: "I agree that my data may be used to answer this request.",
    send: "Send for the check", required: "required",
    errors: { required: "Please fill in this field.", contact: "Enter a valid phone or e-mail.", consent: "We need your consent to reply.", summary: "Please check the marked fields:" },
    done: { kicker: "Preview · nothing was sent", title: "We will check the technical feasibility of your concept.", principle: "First we check technical feasibility — then we discuss commercial terms.", team: "MEGAPARC's Technical Director and Architect review the requirements and come back with specific questions — no automatic guarantees.", summary: "Request summary", again: "New check" },
  },
};

type Row = { label: string; value: string };

export function PreCheckForm({ locale, mailbox }: { locale: SiteLocale; mailbox: string }) {
  const t = T[locale];
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [done, setDone] = useState<Row[] | null>(null);
  const started = useRef(false);
  const summaryRef = useRef<HTMLDivElement>(null);
  const id = (n: string) => `lp-pc-${n}`;
  const start = () => { if (!started.current) { started.current = true; track("m20_technical_check_start"); } };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const get = (n: string) => String(data.get(n) ?? "").trim();
    const found: Record<string, string> = {};
    if (!get("type")) found.type = t.errors.required;
    if (!get("name")) found.name = t.errors.required;
    const contact = get("contact");
    if (!/^(\+?[\d\s()-]{7,}|[^\s@]+@[^\s@]+\.[^\s@]+)$/.test(contact)) found.contact = t.errors.contact;
    if (!data.get("consent")) found.consent = t.errors.consent;
    setErrors(found);
    if (Object.keys(found).length) { window.requestAnimationFrame(() => summaryRef.current?.focus()); return; }
    const yn = (v: string) => (v === "yes" ? t.yes : v === "no" ? t.no : t.unsure);
    const rows: Row[] = [
      { label: t.type, value: get("type") },
      ...(get("area") ? [{ label: t.area, value: `${get("area")} ${t.areaUnit}` }] : []),
      ...(get("power") ? [{ label: t.power, value: `${get("power")} ${t.powerUnit}` }] : []),
      { label: t.extraction, value: yn(get("extraction") || "unsure") },
      { label: t.loading, value: yn(get("loading") || "unsure") },
      { label: t.signage, value: yn(get("signage") || "unsure") },
      ...(get("concept") ? [{ label: t.concept, value: get("concept") }] : []),
      { label: t.name, value: get("name") },
      { label: t.contact, value: contact },
    ];
    setDone(rows);
    track("m20_technical_check_submit", { type: get("type") });
  };

  if (done) {
    return (
      <div className="lp-done" tabIndex={-1}>
        <p className="lp-done__kicker">{t.done.kicker}</p>
        <p className="lp-done__title">{t.done.title}</p>
        <p className="lp-done__principle">{t.done.principle}</p>
        <p className="lp-done__text">{t.done.team} <span className="lp-done__mail">{mailbox}</span></p>
        <p className="lp-label">{t.done.summary}</p>
        <dl className="lp-summary">
          {done.map((row) => (<div key={row.label}><dt>{row.label}</dt><dd>{row.value}</dd></div>))}
        </dl>
        <button type="button" className="btn btn--ghost" onClick={() => setDone(null)}><span>{t.done.again}</span></button>
      </div>
    );
  }

  const field = (n: string, label: string, control: React.ReactNode, half = false, required = false) => (
    <div className={`xp-form__field${half ? "" : " xp-form__field--full"}`}>
      <label htmlFor={id(n)}>{label}{required ? <span className="xp-form__req" aria-hidden="true"> *</span> : null}</label>
      {control}
      {errors[n] ? <p className="xp-form__error" id={`${id(n)}-error`}>{errors[n]}</p> : null}
    </div>
  );
  const triple = (n: string, label: string) => (
    <fieldset className="xp-form__field xp-form__field--full xp-form__choices lp-triple">
      <legend>{label}</legend>
      <div className="xp-choice-row">
        {(["yes", "no", "unsure"] as const).map((v) => (
          <label key={v} className="xp-choice"><input type="radio" name={n} value={v} defaultChecked={v === "unsure"} /><span>{v === "yes" ? t.yes : v === "no" ? t.no : t.unsure}</span></label>
        ))}
      </div>
    </fieldset>
  );

  return (
    <form className="xp-form lp-form" noValidate onSubmit={onSubmit} onFocusCapture={start}>
      <p className="lp-form__intro">{t.intro}</p>
      {Object.keys(errors).length ? (
        <div className="xp-form__errors" ref={summaryRef} tabIndex={-1} role="alert">
          <p>{t.errors.summary}</p>
          <ul>{Object.keys(errors).map((n) => <li key={n}><a href={`#${id(n)}`}>{n === "consent" ? t.consent : n === "type" ? t.type : n === "name" ? t.name : t.contact}</a></li>)}</ul>
        </div>
      ) : null}
      <div className="xp-form__grid">
        {field("type", t.type, (
          <select id={id("type")} name="type" defaultValue="" required aria-invalid={errors.type ? true : undefined}>
            <option value="" disabled>—</option>
            {t.types.map((o) => <option key={o} value={o}>{o}</option>)}
          </select>
        ), true, true)}
        {field("area", t.area, <input id={id("area")} name="area" type="number" inputMode="decimal" min={1} step={1} placeholder={t.areaUnit} />, true)}
        {field("power", t.power, <input id={id("power")} name="power" type="number" inputMode="decimal" min={1} step={1} placeholder={`${t.powerUnit} · ${t.unknown}`} />, true)}
        {triple("extraction", t.extraction)}
        {triple("loading", t.loading)}
        {triple("signage", t.signage)}
        {field("concept", t.concept, <textarea id={id("concept")} name="concept" rows={3} placeholder={t.conceptPh} />)}
        {field("name", t.name, <input id={id("name")} name="name" type="text" autoComplete="name" required aria-invalid={errors.name ? true : undefined} />, true, true)}
        {field("contact", t.contact, <input id={id("contact")} name="contact" type="text" autoComplete="tel" inputMode="email" required aria-invalid={errors.contact ? true : undefined} />, true, true)}
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
