"use client";

import { useRef, useState, type FormEvent } from "react";
import { Icon } from "@/components/ui";
import type { SiteLocale } from "@/lib/site-data";

/**
 * VIEWING REQUEST — a short qualification form (OWNER Moscova 20 mandate §29):
 * company / brand · what you plan to open · required area · target opening
 * date · launch budget (optional, private) · critical technical requirements ·
 * name · telephone · e-mail · comment. Four required fields, nothing more.
 *
 * PREVIEW RULE (as every form of the prototype): nothing is sent — no fetch,
 * no mailto, no storage. Submission validates and shows a local summary that
 * names the OWNER-confirmed public mailbox. A RESERVED unit turns the form
 * into a waitlist request (same fields, different wording).
 */

type Mode = "viewing" | "waitlist";
const T = {
  ro: {
    company: "Companie / brand", opening: "Ce plănuiți să deschideți?", openingPh: "de ex. showroom de mobilier", area: "Suprafața necesară", areaPh: "tot spațiul sau ≈ 300 m²", date: "Data dorită a deschiderii", datePh: "de ex. martie 2027", budget: "Bugetul planificat al lansării", budgetHint: "Opțional. Îl vede doar echipa de închiriere.", tech: "Cerințe tehnice importante", techPh: "putere, hotă, depozitare…", name: "Nume", phone: "Telefon", email: "E-mail", comment: "Comentariu",
    consent: "Sunt de acord ca datele mele să fie folosite pentru a răspunde la această cerere.",
    send: { viewing: "Solicită o vizionare", waitlist: "Anunțați-mă dacă se eliberează" },
    required: "obligatoriu", note: "Răspundem după o primă verificare a formatului.",
    errors: { required: "Completați acest câmp.", email: "Introduceți o adresă de e-mail validă.", consent: "Este necesar acordul pentru a răspunde.", summary: "Verificați câmpurile marcate:" },
    done: { kicker: "Previzualizare · nimic nu a fost trimis", title: { viewing: "Cererea de vizionare este pregătită.", waitlist: "Cererea este pregătită." }, text: (to: string) => `În versiunea de lucru cererea ajunge la ${to}. Verificăm formatul și revenim cu o propunere de vizionare.`, summary: "Rezumat", edit: "Modifică" },
  },
  ru: {
    company: "Компания / бренд", opening: "Что вы планируете открыть?", openingPh: "например, шоурум мебели", area: "Требуемая площадь", areaPh: "всё помещение или ≈ 300 м²", date: "Желаемая дата открытия", datePh: "например, март 2027", budget: "Планируемый бюджет запуска", budgetHint: "Необязательно. Видит только команда аренды.", tech: "Важные технические требования", techPh: "мощность, вытяжка, склад…", name: "Имя", phone: "Телефон", email: "E-mail", comment: "Комментарий",
    consent: "Согласен(на) на использование моих данных для ответа на этот запрос.",
    send: { viewing: "Запросить просмотр", waitlist: "Сообщить, если освободится" },
    required: "обязательно", note: "Ответим после первичной проверки формата.",
    errors: { required: "Заполните это поле.", email: "Введите корректный e-mail.", consent: "Нужно согласие, чтобы мы могли ответить.", summary: "Проверьте отмеченные поля:" },
    done: { kicker: "Превью · ничего не отправлено", title: { viewing: "Запрос на просмотр подготовлен.", waitlist: "Запрос подготовлен." }, text: (to: string) => `В рабочей версии запрос попадёт на ${to}. Проверим формат и предложим время просмотра.`, summary: "Сводка запроса", edit: "Изменить" },
  },
  en: {
    company: "Company / brand", opening: "What do you plan to open?", openingPh: "e.g. a furniture showroom", area: "Required area", areaPh: "the whole space or ≈ 300 m²", date: "Target opening date", datePh: "e.g. March 2027", budget: "Planned launch budget", budgetHint: "Optional. Seen only by the leasing team.", tech: "Critical technical requirements", techPh: "power, extraction, storage…", name: "Name", phone: "Telephone", email: "E-mail", comment: "Comment",
    consent: "I agree that my data may be used to answer this request.",
    send: { viewing: "Request a viewing", waitlist: "Tell me if it frees up" },
    required: "required", note: "We reply after a first check of your format.",
    errors: { required: "Please fill in this field.", email: "Please enter a valid e-mail.", consent: "We need your consent to reply.", summary: "Please check the marked fields:" },
    done: { kicker: "Preview · nothing was sent", title: { viewing: "Your viewing request is ready.", waitlist: "Your request is ready." }, text: (to: string) => `In the working version this request goes to ${to}. We check the format and propose a viewing time.`, summary: "Summary", edit: "Edit" },
  },
};

type FieldName = "company" | "opening" | "area" | "date" | "budget" | "tech" | "name" | "phone" | "email" | "comment";
const fields: { name: FieldName; kind: "text" | "tel" | "email" | "textarea"; required?: boolean; full?: boolean; ph?: "openingPh" | "areaPh" | "datePh" | "techPh"; hint?: "budgetHint"; auto?: string }[] = [
  { name: "company", kind: "text", required: true, auto: "organization" },
  { name: "opening", kind: "text", required: true, ph: "openingPh" },
  { name: "area", kind: "text", ph: "areaPh" },
  { name: "date", kind: "text", ph: "datePh" },
  { name: "budget", kind: "text", hint: "budgetHint" },
  { name: "tech", kind: "text", ph: "techPh" },
  { name: "name", kind: "text", required: true, auto: "name" },
  { name: "phone", kind: "tel", required: true, auto: "tel" },
  { name: "email", kind: "email", auto: "email" },
  { name: "comment", kind: "textarea", full: true },
];

export function ViewingForm({ locale, mode, unitLabel, mailbox }: { locale: SiteLocale; mode: Mode; unitLabel: string; mailbox: string }) {
  const t = T[locale];
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [done, setDone] = useState<{ label: string; value: string }[] | null>(null);
  const summaryRef = useRef<HTMLDivElement>(null);
  const doneRef = useRef<HTMLDivElement>(null);
  const id = (name: string) => `lg-view-${name}`;

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const value = (name: string) => String(data.get(name) ?? "").trim();
    const found: Record<string, string> = {};
    fields.forEach((field) => {
      if (field.required && !value(field.name)) found[field.name] = t.errors.required;
    });
    if (value("email") && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value("email"))) found.email = t.errors.email;
    if (!data.get("consent")) found.consent = t.errors.consent;
    setErrors(found);
    if (Object.keys(found).length) {
      window.requestAnimationFrame(() => summaryRef.current?.focus());
      return;
    }
    setDone([{ label: "", value: unitLabel }, ...fields.filter((field) => value(field.name)).map((field) => ({ label: t[field.name], value: value(field.name) }))]);
    window.requestAnimationFrame(() => doneRef.current?.focus());
  };

  const describe = (name: string) => (errors[name] ? { "aria-invalid": true as const, "aria-describedby": `${id(name)}-error` } : {});

  if (done) {
    return (
      <div className="xp-form__done lg-form__done" ref={doneRef} tabIndex={-1}>
        <p className="xp-form__done-kicker">{t.done.kicker}</p>
        <h3>{t.done.title[mode]}</h3>
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
    <form className="xp-form__body lg-form" noValidate onSubmit={onSubmit}>
      <p className="lg-form__unit">{unitLabel}</p>
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
              <textarea id={id(field.name)} name={field.name} rows={3} {...describe(field.name)} />
            ) : (
              <input id={id(field.name)} name={field.name} type={field.kind} required={field.required} placeholder={field.ph ? t[field.ph] : undefined} autoComplete={field.auto} {...describe(field.name)} />
            )}
            {field.hint ? <p className="xp-form__hint">{t[field.hint]}</p> : null}
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
        <button type="submit" className="btn"><span>{t.send[mode]}</span><Icon /></button>
        <p className="xp-form__note">* {t.required} · {t.note}</p>
      </div>
    </form>
  );
}
