"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { Icon } from "@/components/ui";
import type { SiteLocale } from "@/lib/site-data";

/**
 * VIEWING REQUEST — a short form (OWNER compact brief §12): company / brand ·
 * type of business · area wanted · planned opening date · what is critical for
 * the space · name · telephone or e-mail. Three intents share it — a private
 * viewing, the property presentation, the plans — chosen here or by any link on
 * the page carrying data-intent. A RESERVED unit turns the viewing into a
 * waitlist request.
 *
 * PREVIEW RULE (as every form of the prototype): nothing is sent — no fetch, no
 * mailto, no storage. Submission validates and shows a local summary that names
 * the OWNER-confirmed public mailbox.
 */

type Intent = "viewing" | "presentation" | "plans";
type Mode = "viewing" | "waitlist";
const T = {
  ro: {
    intents: { viewing: "Vizionare", presentation: "Prezentarea obiectului", plans: "Planurile" },
    intentLabel: "Ce doriți să primiți",
    company: "Companie / brand", business: "Tipul afacerii", businessPh: "de ex. showroom de mobilier", area: "Suprafața dorită", areaPh: "tot spațiul sau ≈ 300 m²", date: "Data planificată a deschiderii", datePh: "de ex. martie 2027", critical: "Ce este critic pentru spațiu?", criticalPh: "putere, hotă, depozitare, program…", name: "Nume", contact: "Telefon sau e-mail",
    consent: "Sunt de acord ca datele mele să fie folosite pentru a răspunde la această cerere.",
    send: { viewing: "Solicită o vizionare", waitlist: "Anunțați-mă dacă se eliberează", presentation: "Primește prezentarea", plans: "Primește planurile" },
    required: "obligatoriu", note: "Răspundem după o primă verificare a formatului.",
    errors: { required: "Completați acest câmp.", contact: "Introduceți un telefon sau un e-mail valid.", consent: "Este necesar acordul pentru a răspunde.", summary: "Verificați câmpurile marcate:" },
    done: { kicker: "Previzualizare · nimic nu a fost trimis", title: { viewing: "Cererea de vizionare este pregătită.", waitlist: "Cererea este pregătită.", presentation: "Cererea de prezentare este pregătită.", plans: "Cererea de planuri este pregătită." }, text: (to: string) => `În versiunea de lucru cererea ajunge la ${to}. Verificăm formatul și revenim.`, summary: "Rezumat", edit: "Modifică" },
  },
  ru: {
    intents: { viewing: "Просмотр", presentation: "Презентация объекта", plans: "Планы" },
    intentLabel: "Что вам нужно",
    company: "Компания / бренд", business: "Вид бизнеса", businessPh: "например, шоурум мебели", area: "Желаемая площадь", areaPh: "всё помещение или ≈ 300 м²", date: "Планируемая дата открытия", datePh: "например, март 2027", critical: "Что критично для помещения?", criticalPh: "мощность, вытяжка, склад, часы работы…", name: "Имя", contact: "Телефон или e-mail",
    consent: "Согласен(на) на использование моих данных для ответа на этот запрос.",
    send: { viewing: "Запросить просмотр", waitlist: "Сообщить, если освободится", presentation: "Получить презентацию", plans: "Получить планы" },
    required: "обязательно", note: "Ответим после первичной проверки формата.",
    errors: { required: "Заполните это поле.", contact: "Укажите телефон или корректный e-mail.", consent: "Нужно согласие, чтобы мы могли ответить.", summary: "Проверьте отмеченные поля:" },
    done: { kicker: "Превью · ничего не отправлено", title: { viewing: "Запрос на просмотр подготовлен.", waitlist: "Запрос подготовлен.", presentation: "Запрос презентации подготовлен.", plans: "Запрос планов подготовлен." }, text: (to: string) => `В рабочей версии запрос попадёт на ${to}. Проверим формат и ответим.`, summary: "Сводка запроса", edit: "Изменить" },
  },
  en: {
    intents: { viewing: "Viewing", presentation: "Property presentation", plans: "Plans" },
    intentLabel: "What you need",
    company: "Company / brand", business: "Type of business", businessPh: "e.g. a furniture showroom", area: "Area wanted", areaPh: "the whole space or ≈ 300 m²", date: "Planned opening date", datePh: "e.g. March 2027", critical: "What is critical for the space?", criticalPh: "power, extraction, storage, hours…", name: "Name", contact: "Telephone or e-mail",
    consent: "I agree that my data may be used to answer this request.",
    send: { viewing: "Request a viewing", waitlist: "Tell me if it frees up", presentation: "Get the presentation", plans: "Get the plans" },
    required: "required", note: "We reply after a first check of your format.",
    errors: { required: "Please fill in this field.", contact: "Please enter a telephone or a valid e-mail.", consent: "We need your consent to reply.", summary: "Please check the marked fields:" },
    done: { kicker: "Preview · nothing was sent", title: { viewing: "Your viewing request is ready.", waitlist: "Your request is ready.", presentation: "Your presentation request is ready.", plans: "Your plans request is ready." }, text: (to: string) => `In the working version this request goes to ${to}. We check the format and reply.`, summary: "Summary", edit: "Edit" },
  },
};

type FieldName = "company" | "business" | "area" | "date" | "critical" | "name" | "contact";
const fields: { name: FieldName; kind: "text" | "textarea"; required?: boolean; full?: boolean; ph?: "businessPh" | "areaPh" | "datePh" | "criticalPh"; auto?: string }[] = [
  { name: "company", kind: "text", required: true, auto: "organization" },
  { name: "business", kind: "text", required: true, ph: "businessPh" },
  { name: "area", kind: "text", ph: "areaPh" },
  { name: "date", kind: "text", ph: "datePh" },
  { name: "critical", kind: "textarea", full: true, ph: "criticalPh" },
  { name: "name", kind: "text", required: true, auto: "name" },
  { name: "contact", kind: "text", required: true, auto: "email" },
];
const intents: Intent[] = ["viewing", "presentation", "plans"];

export function ViewingForm({ locale, mode, unitLabel, mailbox }: { locale: SiteLocale; mode: Mode; unitLabel: string; mailbox: string }) {
  const t = T[locale];
  const [intent, setIntent] = useState<Intent>("viewing");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [done, setDone] = useState<{ label: string; value: string }[] | null>(null);
  const summaryRef = useRef<HTMLDivElement>(null);
  const doneRef = useRef<HTMLDivElement>(null);
  const id = (name: string) => `lg-view-${name}`;

  // any action on the page that carries data-intent («Получить планы», «Получить презентацию») preselects it;
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
    document.addEventListener("click", onClick);
    window.addEventListener("lg:format", onFormat);
    return () => {
      document.removeEventListener("click", onClick);
      window.removeEventListener("lg:format", onFormat);
    };
  }, []);

  const label = intent === "viewing" ? t.send[mode] : t.send[intent];

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const value = (name: string) => String(data.get(name) ?? "").trim();
    const found: Record<string, string> = {};
    fields.forEach((field) => {
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
    setDone([{ label: "", value: unitLabel }, { label: t.intentLabel, value: t.intents[intent] }, ...fields.filter((field) => value(field.name)).map((field) => ({ label: t[field.name], value: value(field.name) }))]);
    window.requestAnimationFrame(() => doneRef.current?.focus());
  };

  const describe = (name: string) => (errors[name] ? { "aria-invalid": true as const, "aria-describedby": `${id(name)}-error` } : {});

  if (done) {
    return (
      <div className="xp-form__done lg-form__done" ref={doneRef} tabIndex={-1}>
        <p className="xp-form__done-kicker">{t.done.kicker}</p>
        <h3>{intent === "viewing" ? t.done.title[mode] : t.done.title[intent]}</h3>
        <p>{t.done.text(mailbox)}</p>
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
      <div className="xp-form__grid">
        {fields.map((field) => (
          <div key={field.name} className={`xp-form__field${field.full ? " xp-form__field--full" : ""}`}>
            <label htmlFor={id(field.name)}>
              {t[field.name]}
              {field.required ? <span className="xp-form__req" aria-hidden="true"> *</span> : null}
            </label>
            {field.kind === "textarea" ? (
              <textarea id={id(field.name)} name={field.name} rows={2} placeholder={field.ph ? t[field.ph] : undefined} {...describe(field.name)} />
            ) : (
              <input id={id(field.name)} name={field.name} type="text" required={field.required} placeholder={field.ph ? t[field.ph] : undefined} autoComplete={field.auto} ref={field.name === "business" ? business : undefined} onInput={field.name === "business" ? () => (autoFilled.current = false) : undefined} {...describe(field.name)} />
            )}
            {errors[field.name] ? <p className="xp-form__error" id={`${id(field.name)}-error`}>{errors[field.name]}</p> : null}
          </div>
        ))}
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
