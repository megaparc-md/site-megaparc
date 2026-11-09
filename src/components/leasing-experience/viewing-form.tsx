"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { Icon } from "@/components/ui";
import type { SiteLocale } from "@/lib/site-data";

/**
 * VIEWING REQUEST — light entry first (OWNER "FINAL ART DIRECTION & VISUAL
 * CONVERSION PASS", 2026-11-09, §22): name · company · telephone or e-mail →
 * «СВЯЖИТЕСЬ СО МНОЙ». The qualifying form of the compact brief (type of
 * business · area wanted · planned opening date · what is critical for the
 * space) stays as the variant behind «Добавить детали для подготовки просмотра»;
 * with the details open, «Вид бизнеса» is required again and the action names
 * the intent. Four intents share it — a private viewing, the commercial proposal
 * (a UI action: no price or term is shown, §23), the property presentation, the
 * plans — chosen here or by any link on the page carrying data-intent. A
 * RESERVED unit turns the viewing into a waitlist request. The format chosen in
 * the lens fills «Вид бизнеса»; the economics tool can hand its calculation over
 * ("lg:economics"): it is shown above the fields and joins the summary.
 *
 * PREVIEW RULE (as every form of the prototype): nothing is sent — no fetch, no
 * mailto, no storage. Submission validates and shows a local summary that names
 * the OWNER-confirmed public mailbox.
 */

type Intent = "viewing" | "offer" | "presentation" | "plans";
type Mode = "viewing" | "waitlist";
const T = {
  ro: {
    intents: { viewing: "Vizionare", offer: "Oferta comercială", presentation: "Prezentarea obiectului", plans: "Planurile" },
    intentLabel: "Ce doriți să primiți",
    company: "Companie / brand", business: "Tipul afacerii", businessPh: "de ex. showroom de mobilier", area: "Suprafața necesară", areaPh: "tot spațiul sau ≈ 300 m²", date: "Data planificată a deschiderii", datePh: "de ex. martie 2027", critical: "Ce este critic pentru spațiu?", criticalPh: "putere, hotă, depozitare, program…", name: "Nume", contact: "Telefon / e-mail",
    consent: "Sunt de acord ca datele mele să fie folosite pentru a răspunde la această cerere.",
    light: "Contactați-mă", more: "Adăugați detalii pentru pregătirea vizionării", less: "Ascundeți detaliile",
    send: { viewing: "Solicită o vizionare", waitlist: "Anunțați-mă dacă se eliberează", offer: "Primește oferta comercială", presentation: "Primește prezentarea", plans: "Primește planurile" },
    required: "obligatoriu", note: "Răspundem după o primă verificare a formatului.",
    errors: { required: "Completați acest câmp.", contact: "Introduceți un telefon sau un e-mail valid.", consent: "Este necesar acordul pentru a răspunde.", summary: "Verificați câmpurile marcate:" },
    done: { kicker: "Previzualizare · nimic nu a fost trimis", title: "Mulțumim.", text: { viewing: (p: string) => `Analizăm formatul dumneavoastră și vă contactăm pentru a pregăti o vizionare concretă la ${p}.`, waitlist: (p: string) => `Vă anunțăm dacă ${p} se eliberează.`, offer: (p: string) => `Analizăm formatul dumneavoastră și pregătim oferta comercială pentru ${p}.`, presentation: (p: string) => `Analizăm formatul dumneavoastră și vă trimitem prezentarea ${p}.`, plans: (p: string) => `Analizăm formatul dumneavoastră și vă trimitem planurile ${p}.` }, preview: (to: string) => `În versiunea de lucru cererea ajunge la ${to}.`, summary: "Rezumat", edit: "Modifică" },
    calc: { title: "La cerere se atașează calculul dumneavoastră", remove: "Elimină" },
  },
  ru: {
    intents: { viewing: "Просмотр", offer: "Коммерческое предложение", presentation: "Презентация объекта", plans: "Планы" },
    intentLabel: "Что вам нужно",
    company: "Компания / бренд", business: "Вид бизнеса", businessPh: "например, шоурум мебели", area: "Необходимая площадь", areaPh: "всё помещение или ≈ 300 м²", date: "Планируемая дата открытия", datePh: "например, март 2027", critical: "Что критично для помещения?", criticalPh: "мощность, вытяжка, склад, часы работы…", name: "Имя", contact: "Телефон / email",
    consent: "Согласен(на) на использование моих данных для ответа на этот запрос.",
    light: "Свяжитесь со мной", more: "Добавить детали для подготовки просмотра", less: "Скрыть детали",
    send: { viewing: "Запросить просмотр", waitlist: "Сообщить, если освободится", offer: "Получить коммерческое предложение", presentation: "Получить презентацию", plans: "Получить планы" },
    required: "обязательно", note: "Ответим после первичной проверки формата.",
    errors: { required: "Заполните это поле.", contact: "Укажите телефон или корректный e-mail.", consent: "Нужно согласие, чтобы мы могли ответить.", summary: "Проверьте отмеченные поля:" },
    done: { kicker: "Превью · ничего не отправлено", title: "Спасибо.", text: { viewing: (p: string) => `Мы изучим ваш формат и свяжемся, чтобы подготовить предметный просмотр ${p}.`, waitlist: (p: string) => `Мы сообщим, если ${p} освободится.`, offer: (p: string) => `Мы изучим ваш формат и подготовим коммерческое предложение по ${p}.`, presentation: (p: string) => `Мы изучим ваш формат и отправим презентацию ${p}.`, plans: (p: string) => `Мы изучим ваш формат и отправим планы ${p}.` }, preview: (to: string) => `В рабочей версии запрос попадёт на ${to}.`, summary: "Сводка запроса", edit: "Изменить" },
    calc: { title: "К запросу будет приложен ваш расчёт", remove: "Убрать" },
  },
  en: {
    intents: { viewing: "Viewing", offer: "Commercial proposal", presentation: "Property presentation", plans: "Plans" },
    intentLabel: "What you need",
    company: "Company / brand", business: "Type of business", businessPh: "e.g. a furniture showroom", area: "Area required", areaPh: "the whole space or ≈ 300 m²", date: "Planned opening date", datePh: "e.g. March 2027", critical: "What is critical for the space?", criticalPh: "power, extraction, storage, hours…", name: "Name", contact: "Telephone / e-mail",
    consent: "I agree that my data may be used to answer this request.",
    light: "Get in touch with me", more: "Add details to prepare the viewing", less: "Hide the details",
    send: { viewing: "Request a viewing", waitlist: "Tell me if it frees up", offer: "Get the commercial proposal", presentation: "Get the presentation", plans: "Get the plans" },
    required: "required", note: "We reply after a first check of your format.",
    errors: { required: "Please fill in this field.", contact: "Please enter a telephone or a valid e-mail.", consent: "We need your consent to reply.", summary: "Please check the marked fields:" },
    done: { kicker: "Preview · nothing was sent", title: "Thank you.", text: { viewing: (p: string) => `We will study your format and get in touch to prepare a focused viewing of ${p}.`, waitlist: (p: string) => `We will let you know if ${p} frees up.`, offer: (p: string) => `We will study your format and prepare the commercial proposal for ${p}.`, presentation: (p: string) => `We will study your format and send you the ${p} presentation.`, plans: (p: string) => `We will study your format and send you the ${p} plans.` }, preview: (to: string) => `In the working version this request goes to ${to}.`, summary: "Summary", edit: "Edit" },
    calc: { title: "Your calculation will be attached to the request", remove: "Remove" },
  },
};

type FieldName = "company" | "business" | "area" | "date" | "critical" | "name" | "contact";
type Field = { name: FieldName; kind: "text" | "textarea"; required?: boolean; full?: boolean; ph?: "businessPh" | "areaPh" | "datePh" | "criticalPh"; auto?: string };
/** the light entry (§22) */
const lightFields: Field[] = [
  { name: "name", kind: "text", required: true, auto: "name" },
  { name: "company", kind: "text", required: true, auto: "organization" },
  { name: "contact", kind: "text", required: true, auto: "email", full: true },
];
/** the qualifying variant — on request; «Вид бизнеса» is required once it is open */
const detailFields: Field[] = [
  { name: "business", kind: "text", required: true, ph: "businessPh" },
  { name: "area", kind: "text", ph: "areaPh" },
  { name: "date", kind: "text", ph: "datePh" },
  { name: "critical", kind: "textarea", full: true, ph: "criticalPh" },
];
const intents: Intent[] = ["viewing", "offer", "presentation", "plans"];

/** What the economics tool hands over (OWNER addendum §25): the business and the calculated lines. */
export type EconomicsHandoff = { business: string; lines: { label: string; value: string }[] };

export function ViewingForm({ locale, mode, unitLabel, mailbox, property }: { locale: SiteLocale; mode: Mode; unitLabel: string; mailbox: string; property: string }) {
  const t = T[locale];
  const [intent, setIntent] = useState<Intent>("viewing");
  const [details, setDetails] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [done, setDone] = useState<{ label: string; value: string }[] | null>(null);
  const [calc, setCalc] = useState<EconomicsHandoff | null>(null);
  const summaryRef = useRef<HTMLDivElement>(null);
  const doneRef = useRef<HTMLDivElement>(null);
  const id = (name: string) => `lg-view-${name}`;

  // any action on the page that carries data-intent («Получить планы», «Получить коммерческое предложение») preselects it;
  // the format chosen in the lens fills «Вид бизнеса» unless the visitor already typed something there
  const business = useRef<HTMLInputElement | null>(null);
  const autoFilled = useRef(false);
  useEffect(() => {
    const fill = (value: string | null) => {
      const input = business.current;
      if (!value || !input || (input.value && !autoFilled.current)) return;
      input.value = value;
      autoFilled.current = true;
    };
    const onClick = (event: MouseEvent) => {
      const link = (event.target as Element | null)?.closest?.("[data-intent], [data-format]");
      const next = link?.getAttribute("data-intent") as Intent | null;
      if (next && intents.includes(next)) setIntent(next);
      fill(link?.getAttribute("data-format") ?? null);
    };
    const onFormat = (event: Event) => fill(String((event as CustomEvent).detail));
    // «Получить расчёт с презентацией объекта»: the calculation travels with the request
    const onEconomics = (event: Event) => {
      const detail = (event as CustomEvent<EconomicsHandoff>).detail;
      setIntent("presentation");
      setCalc(detail);
      setDetails(true);
      setDone(null);
      fill(detail.business);
    };
    document.addEventListener("click", onClick);
    window.addEventListener("lg:format", onFormat);
    window.addEventListener("lg:economics", onEconomics);
    return () => {
      document.removeEventListener("click", onClick);
      window.removeEventListener("lg:format", onFormat);
      window.removeEventListener("lg:economics", onEconomics);
    };
  }, []);

  const label = intent === "viewing" && mode === "waitlist" ? t.send.waitlist : details ? (intent === "viewing" ? t.send[mode] : t.send[intent]) : t.light;
  const active = details ? [...lightFields, ...detailFields] : lightFields;

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const value = (name: string) => String(data.get(name) ?? "").trim();
    const found: Record<string, string> = {};
    active.forEach((field) => {
      if (field.required && !value(field.name)) found[field.name] = t.errors.required;
    });
    const contact = value("contact");
    if (contact && !(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact) || contact.replace(/\D/g, "").length >= 6)) found.contact = t.errors.contact;
    if (!data.get("consent")) found.consent = t.errors.consent;
    setErrors(found);
    if (Object.keys(found).length) {
      window.requestAnimationFrame(() => summaryRef.current?.focus());
      return;
    }
    // a value filled in the closed details (the lens format) still travels with the request
    const sent = [...lightFields, ...detailFields].filter((field) => value(field.name));
    setDone([{ label: "", value: unitLabel }, { label: t.intentLabel, value: t.intents[intent] }, ...sent.map((field) => ({ label: t[field.name], value: value(field.name) })), ...(calc ? calc.lines : [])]);
    window.requestAnimationFrame(() => doneRef.current?.focus());
  };

  const describe = (name: string) => (errors[name] ? { "aria-invalid": true as const, "aria-describedby": `${id(name)}-error` } : {});
  const input = (field: Field, required: boolean) => (
    <div key={field.name} className={`xp-form__field${field.full ? " xp-form__field--full" : ""}`}>
      <label htmlFor={id(field.name)}>
        {t[field.name]}
        {required ? <span className="xp-form__req" aria-hidden="true"> *</span> : null}
      </label>
      {field.kind === "textarea" ? (
        <textarea id={id(field.name)} name={field.name} rows={2} placeholder={field.ph ? t[field.ph] : undefined} {...describe(field.name)} />
      ) : (
        <input id={id(field.name)} name={field.name} type="text" required={required} placeholder={field.ph ? t[field.ph] : undefined} autoComplete={field.auto} ref={field.name === "business" ? business : undefined} onInput={field.name === "business" ? () => (autoFilled.current = false) : undefined} {...describe(field.name)} />
      )}
      {errors[field.name] ? <p className="xp-form__error" id={`${id(field.name)}-error`}>{errors[field.name]}</p> : null}
    </div>
  );

  if (done) {
    return (
      <div className="xp-form__done lg-form__done" ref={doneRef} tabIndex={-1}>
        <p className="xp-form__done-kicker">{t.done.kicker}</p>
        <h3>{t.done.title}</h3>
        <p>{(intent === "viewing" ? t.done.text[mode] : t.done.text[intent])(property)}</p>
        <p className="lg-form__preview">{t.done.preview(mailbox)}</p>
        <p className="xp-match__label">{t.done.summary}</p>
        <dl className="xp-form__summary">
          {done.map((row) => (
            <div key={row.label + row.value}>
              <dt>{row.label || "—"}</dt>
              <dd>{row.value}</dd>
            </div>
          ))}
        </dl>
        <button type="button" className="btn btn--ghost" onClick={() => setDone(null)}><span>{t.done.edit}</span></button>
      </div>
    );
  }

  return (
    <form className="xp-form__body lg-form" noValidate onSubmit={onSubmit} id="lg-form">
      <p className="lg-form__unit">{unitLabel}</p>
      <fieldset className="lg-form__intents">
        <legend>{t.intentLabel}</legend>
        {intents.map((item) => (
          <label key={item} className={`lg-form__intent${intent === item ? " is-on" : ""}`}>
            <input type="radio" name="intent" value={item} checked={intent === item} onChange={() => setIntent(item)} />
            <span>{t.intents[item]}</span>
          </label>
        ))}
      </fieldset>
      {calc ? (
        <div className="lg-form__calc">
          <p className="lg-label">{t.calc.title}</p>
          <dl>
            {calc.lines.map((line) => (
              <div key={line.label}>
                <dt>{line.label}</dt>
                <dd>{line.value}</dd>
              </div>
            ))}
          </dl>
          <button type="button" className="lg-form__calc-remove" onClick={() => setCalc(null)}>{t.calc.remove}</button>
        </div>
      ) : null}
      {Object.keys(errors).length ? (
        <div className="xp-form__errors" ref={summaryRef} tabIndex={-1} role="alert">
          <p>{t.errors.summary}</p>
          <ul>
            {Object.keys(errors).map((name) => (
              <li key={name}><a href={`#${id(name)}`}>{name === "consent" ? t.errors.consent : t[name as FieldName]}</a></li>
            ))}
          </ul>
        </div>
      ) : null}
      <div className="xp-form__grid">{lightFields.map((field) => input(field, true))}</div>
      <button type="button" className="lg-form__more" aria-expanded={details} aria-controls="lg-form-details" onClick={() => setDetails(!details)}>
        <span>{details ? t.less : t.more}</span>
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d={details ? "M5 12h14" : "M12 5v14M5 12h14"} /></svg>
      </button>
      <div className="xp-form__grid lg-form__details" id="lg-form-details" hidden={!details}>
        {detailFields.map((field) => input(field, Boolean(field.required && details)))}
      </div>
      <label className="xp-form__consent" id={id("consent")}>
        <input type="checkbox" name="consent" {...describe("consent")} />
        <span className="xp-need__box" aria-hidden="true" />
        <span>{t.consent}</span>
      </label>
      {errors.consent ? <p className="xp-form__error" id={`${id("consent")}-error`}>{errors.consent}</p> : null}
      <div className="xp-form__submit">
        <button type="submit" className="btn"><span>{label}</span><Icon /></button>
        <p className="xp-form__note">* {t.required} · {t.note}</p>
      </div>
    </form>
  );
}
