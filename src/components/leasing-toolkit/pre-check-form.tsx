"use client";

import { useRef, useState, type FormEvent } from "react";
import { Icon } from "@/components/ui";
import { track } from "@/lib/track";
import type { SiteLocale } from "@/lib/site-data";

/**
 * TECHNICAL CONCEPT PRE-CHECK (OWNER toolkit mandate §14–17; rebuilt by the OWNER mandate «CLOSE REMAINING MOSCOVA 20 CODEX
 * FINDINGS», 2026-11-11, Part C) — exactly EIGHT inputs:
 *   1 business format (food service, medical, beauty / health, production and other regulated activity are separate options —
 *     never buried in «Other») · 2 required area · 3 level preference · 4 electrical power (with an explicit «not sure») ·
 *   5 technical requirements (one structured multi-select: extraction · additional ventilation · water · sewerage · increased
 *     electrical load · special equipment / loads · goods delivery) · 6 a short note (equipment, approvals, anything else) ·
 *   7 name · 8 phone or e-mail.   (+ the consent checkbox, which is not a question.)
 * The result is a REQUEST FOR A TECHNICAL FEASIBILITY REVIEW — never «suitable / not suitable», no automatic verdict.
 * PREVIEW RULE: nothing is sent (no fetch, no mailto, no storage) — the request is summarised locally and the visitor is pointed
 * to the confirmed contacts; no delivery is claimed. The production edition renders DirectContact instead (next.config.ts alias
 * → src/editions/production).
 */
const T = {
  ro: {
    intro: "Spuneți-ne pe scurt ce planificați. Directorul tehnic și arhitectul MEGAPARC verifică fezabilitatea tehnică — fără un verdict automat.",
    type: "Formatul afacerii",
    types: ["Retail", "Showroom", "Servicii pentru clienți", "Birou / centru pentru clienți", "Alimentație publică / bucătărie", "Medical / clinică", "Frumusețe / sănătate", "Producție / atelier", "Altă activitate reglementată", "Altceva"],
    area: "Suprafața necesară", areaUnit: "m²",
    level: "Nivelul preferat", levels: ["Fără preferință", "Parter", "Demisol", "Ambele niveluri"],
    power: "Puterea electrică necesară", powers: ["Nu știu încă", "până la 15 kW", "15–38 kW", "peste 38 kW"],
    needs: "Cerințe tehnice", needsHint: "Bifați tot ce contează pentru formatul dumneavoastră.",
    needItems: ["Hotă (bucătărie / proces)", "Ventilație suplimentară", "Puncte de apă", "Canalizare", "Sarcină electrică mărită", "Echipamente speciale / sarcini", "Livrare de marfă"],
    concept: "Conceptul și cerințele speciale (opțional)", conceptPh: "de ex. clinică stomatologică cu 4 cabinete; echipamente, avize sau autorizații necesare",
    name: "Nume", contact: "Telefon sau e‑mail", consent: "Sunt de acord ca datele mele să fie folosite pentru a răspunde la această cerere.",
    send: "Pregătește cererea", required: "obligatoriu",
    errors: { required: "Completați acest câmp.", contact: "Introduceți un telefon sau un e‑mail valid.", consent: "Este necesar acordul pentru a răspunde.", summary: "Verificați câmpurile marcate:" },
    done: { kicker: "Previzualizare · nimic nu a fost trimis", title: "Pentru verificarea tehnică, contactați MEGAPARC la datele de contact indicate.", principle: "Mai întâi verificăm fezabilitatea tehnică — apoi discutăm condițiile comerciale.", team: "Cererea nu este transmisă automat. Trimiteți rezumatul de mai jos prin e‑mail sau telefonic — directorul tehnic și arhitectul MEGAPARC analizează cerințele; nu există un verdict automat.", summary: "Rezumatul cererii de verificare tehnică", again: "O cerere nouă", none: "nimic bifat" },
  },
  ru: {
    intro: "Коротко расскажите, что вы планируете. Технический директор и архитектор MEGAPARC проверяют техническую реализуемость — без автоматического вердикта.",
    type: "Формат бизнеса",
    types: ["Ритейл", "Шоурум", "Клиентский сервис", "Офис / клиентский центр", "Общепит / кухня", "Медицина / клиника", "Красота / здоровье", "Производство / мастерская", "Другая регулируемая деятельность", "Другое"],
    area: "Нужная площадь", areaUnit: "м²",
    level: "Предпочтительный уровень", levels: ["Не важно", "1‑й этаж", "Цоколь", "Оба уровня"],
    power: "Нужная электрическая мощность", powers: ["Пока не знаю", "до 15 кВт", "15–38 кВт", "более 38 кВт"],
    needs: "Технические требования", needsHint: "Отметьте всё, что важно для вашего формата.",
    needItems: ["Вытяжка (кухня / технология)", "Дополнительная вентиляция", "Точки воды", "Канализация", "Повышенная электрическая нагрузка", "Специальное оборудование / нагрузки", "Разгрузка товара"],
    concept: "Концепция и особые требования (необязательно)", conceptPh: "например, стоматология на 4 кабинета; оборудование, необходимые разрешения или согласования",
    name: "Имя", contact: "Телефон или e‑mail", consent: "Согласен(на) на использование моих данных для ответа на этот запрос.",
    send: "Подготовить запрос", required: "обязательно",
    errors: { required: "Заполните это поле.", contact: "Укажите телефон или корректный e‑mail.", consent: "Нужно согласие, чтобы мы могли ответить.", summary: "Проверьте отмеченные поля:" },
    done: { kicker: "Превью · ничего не отправлено", title: "Для технической проверки свяжитесь с MEGAPARC по указанным контактам.", principle: "Сначала проверяем техническую реализуемость — затем обсуждаем коммерческие условия.", team: "Запрос не передаётся автоматически. Передайте сводку ниже по e‑mail или телефону — технический директор и архитектор MEGAPARC разберут требования; автоматического решения о пригодности нет.", summary: "Сводка запроса на техническую проверку", again: "Новый запрос", none: "ничего не отмечено" },
  },
  en: {
    intro: "Tell us briefly what you are planning. MEGAPARC's Technical Director and Architect review technical feasibility — there is no automatic verdict.",
    type: "Business format",
    types: ["Retail", "Showroom", "Client services", "Office / customer centre", "Food service / kitchen", "Medical / clinic", "Beauty / health", "Production / workshop", "Other regulated activity", "Other"],
    area: "Required area", areaUnit: "m²",
    level: "Preferred level", levels: ["No preference", "Ground floor", "Lower ground", "Both levels"],
    power: "Required electrical power", powers: ["Not sure yet", "up to 15 kW", "15–38 kW", "over 38 kW"],
    needs: "Technical requirements", needsHint: "Tick everything that matters for your format.",
    needItems: ["Extraction (kitchen / process)", "Additional ventilation", "Water points", "Sewerage", "Increased electrical load", "Special equipment / loads", "Goods delivery"],
    concept: "Concept and special requirements (optional)", conceptPh: "e.g. a dental clinic with 4 rooms; equipment, permits or approvals you need",
    name: "Name", contact: "Phone or e-mail", consent: "I agree that my data may be used to answer this request.",
    send: "Prepare the request", required: "required",
    errors: { required: "Please fill in this field.", contact: "Enter a valid phone or e-mail.", consent: "We need your consent to reply.", summary: "Please check the marked fields:" },
    done: { kicker: "Preview · nothing was sent", title: "For the technical review, contact MEGAPARC using the contact details shown.", principle: "First we check technical feasibility — then we discuss commercial terms.", team: "The request is not transmitted automatically. Pass the summary below on by e-mail or telephone — MEGAPARC's Technical Director and Architect review the requirements; there is no automatic suitability decision.", summary: "Technical review request summary", again: "New request", none: "nothing ticked" },
  },
};

type Row = { label: string; value: string };

export function PreCheckForm({ locale, mailbox, phones = [] }: { locale: SiteLocale; mailbox: string; phones?: string[] }) {
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
    const needs = data.getAll("needs").map(String);
    const rows: Row[] = [
      { label: t.type, value: get("type") },
      ...(get("area") ? [{ label: t.area, value: `${get("area")} ${t.areaUnit}` }] : []),
      { label: t.level, value: get("level") || t.levels[0] },
      { label: t.power, value: get("power") || t.powers[0] },
      { label: t.needs, value: needs.length ? needs.join(" · ") : t.done.none },
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
        <p className="lp-done__text">{t.done.team}</p>
        <p className="lp-done__text lp-done__contacts">{[mailbox, ...phones].map((item) => <span key={item} className="lp-done__mail">{item}</span>)}</p>
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
  const select = (n: string, options: string[]) => (
    <select id={id(n)} name={n} defaultValue={options[0]}>
      {options.map((o) => <option key={o} value={o}>{o}</option>)}
    </select>
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
        ), false, true)}
        {field("area", t.area, <input id={id("area")} name="area" type="number" inputMode="decimal" min={1} step={1} placeholder={t.areaUnit} />, true)}
        {field("level", t.level, select("level", t.levels), true)}
        {field("power", t.power, select("power", t.powers))}
        <fieldset className="xp-form__field xp-form__field--full xp-form__choices lp-triple lp-needs">
          <legend>{t.needs}</legend>
          <p className="lp-needs__hint">{t.needsHint}</p>
          <div className="xp-choice-row">
            {t.needItems.map((item) => (
              <label key={item} className="xp-choice"><input type="checkbox" name="needs" value={item} /><span>{item}</span></label>
            ))}
          </div>
        </fieldset>
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
