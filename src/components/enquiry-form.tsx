"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { Icon } from "@/components/ui";
import type { SiteLocale } from "@/lib/site-data";

/**
 * Enquiry form — four subjects, each asking what qualifies the request
 * (OWNER addendum: "the form should produce a QUALIFIED LEAD"). OWNER
 * correction 2026-10-08: lease (with the exact space) · offer a property or
 * land · careers · partnership / other. No investment-management subject.
 *
 * PREVIEW RULE: nothing is sent anywhere. Submission validates, then shows a
 * local confirmation with the summary of the request. No fetch, no mailto, no
 * storage. The confirmation names the OWNER-confirmed public mailbox
 * (receptie@imc.md, src/data/demo-content.ts → company.email).
 */

export type Subject = "lease" | "partnership" | "property" | "careers" | "general";
type Option = { value: string; label: string };
/** A visual group of choices inside one field (OWNER «FINAL POLISH» §9): the same input name, the same values. */
export type ChoiceGroup = { label: string; values: string[] };
type Field =
  | { name: string; label: string; kind: "text" | "email" | "tel" | "url" | "month"; required?: boolean; placeholder?: string; half?: boolean; hint?: string }
  | { name: string; label: string; kind: "select"; options: Option[]; required?: boolean; half?: boolean; hint?: string }
  | { name: string; label: string; kind: "radio" | "checks"; options: Option[]; required?: boolean; hint?: string; groups?: ChoiceGroup[] }
  | { name: string; label: string; kind: "textarea"; required?: boolean; placeholder?: string; hint?: string }
  | { name: string; label: string; kind: "file"; accept?: string; multiple?: boolean; required?: boolean; hint?: string };

export type FormOptions = {
  properties: Option[];
  spaces: Option[];
  businessTypes: Option[];
  areas: Option[];
  districts: Option[];
  requirements: Option[];
  requirementGroups?: ChoiceGroup[];
  ownerAssets: Option[];
  ownerIntents: Option[];
  partnerCategories: Option[];
  vacancies: Option[];
  disciplines: Option[];
  mailboxes: Record<Subject, string>;
  reply: Record<Subject, string>;
};

// Order = the tabs: leasing · investment partnership · offer a property · careers · general question (OWNER brief 2026-10-08).
const anchors: Record<Subject, string> = { lease: "occupier", partnership: "partnership", property: "opportunity", careers: "careers", general: "question" };

const T = {
  ro: {
    subjects: { lease: "Închiriere", partnership: "Parteneriat investițional", property: "Propuneți un obiect sau un teren", careers: "Cariere", general: "Întrebare generală" },
    intro: {
      lease: "Spuneți-ne ce trebuie să facă spațiul pentru afacerea dumneavoastră. Verificăm spațiile libere și vă recomandăm variantele potrivite.",
      property: "Descrieți obiectul sau terenul și ce luați în calcul. Primiți o primă evaluare, nu un formular automat.",
      partnership: "Câteva rânduri despre organizație și proiectul care vă interesează sunt suficiente pentru o primă discuție. Condițiile se discută individual.",
      general: "Scrieți-ne întrebarea — o direcționăm către persoana potrivită.",
      careers: "Indicați direcția sau postul și un link spre CV. Datele candidaților se folosesc doar pentru recrutare.",
    },
    groups: { business: "Despre afacere", need: "Ce vă trebuie", asset: "Despre obiect", org: "Despre organizație", role: "Despre rol", contact: "Date de contact" },
    f: {
      company: "Companie / afacere", opening: "Ce deschideți?", openingDetail: "În câteva cuvinte", openingPh: "de ex. cabinet stomatologic, cafenea de specialitate", area: "Suprafața necesară", location: "Zona preferată", property: "Obiect de interes", date: "Data dorită de deschidere", critical: "Ce este critic?", other: "Altceva",
      have: "Ce aveți?", country: "Țara", city: "Orașul", size: "Suprafața", sizePh: "de ex. 1,5 ha sau 2.400 m²", consider: "Ce luați în calcul?", materials: "Link spre materiale (opțional)", materialsHint: "Planuri, fotografii, extras cadastral — prin Drive, Dropbox etc.",
      organisation: "Organizația", kind: "Tipul organizației", interest: "Ce vă interesează?", ticket: "Volumul orientativ", category: "Categoria", proposal: "Ce propuneți?", where: "Unde (oraș / regiune)",
      discipline: "Direcția", role: "Postul", cv: "Link spre CV (opțional dacă atașați fișierul)", cvPh: "https://…",
      question: "Întrebarea dumneavoastră", name: "Nume și prenume", email: "E-mail", phone: "Telefon (opțional)", message: "Mesaj (opțional)", consent: "Sunt de acord ca datele mele să fie folosite pentru a răspunde la această solicitare.",
      any: "Oricare", anyProperty: "Orice obiect potrivit", choose: "Alegeți", space: "Spațiul", anySpace: "Orice spațiu potrivit",
      price: "Preț orientativ (opțional)", status: "Calitatea dumneavoastră", statuses: ["Proprietar", "Broker autorizat", "Consultant", "Altceva"], description: "Descriere scurtă", documents: "Documente (opțional)", docsHint: "În previzualizare fișierele nu se încarcă — rămân pe dispozitivul dumneavoastră.", company2: "Companie (opțional)", role2: "Rolul dumneavoastră", cvFile: "CV (fișier)", cvEither: "Adăugați un fișier sau un link spre CV.",
    },
    openRole: "Candidatură spontană",
    send: "Trimite solicitarea", sending: "Se verifică…",
    errors: { required: "Completați acest câmp.", email: "Introduceți o adresă de e-mail validă.", consent: "Este necesar acordul pentru a răspunde.", summary: "Verificați câmpurile marcate:" },
    done: { kicker: "Previzualizare · nimic nu a fost trimis", title: "Solicitarea este pregătită.", text: (to: string, reply: string) => `În versiunea de lucru, solicitarea ajunge la ${to} (adresă demonstrativă). ${reply}.`, summary: "Rezumatul solicitării", edit: "Modifică", fresh: "O nouă solicitare" },
    required: "obligatoriu",
  },
  ru: {
    subjects: { lease: "Аренда", partnership: "Инвестиционное партнёрство", property: "Предложить объект или землю", careers: "Вакансии", general: "Общий вопрос" },
    intro: {
      lease: "Расскажите о своём бизнесе — подберём подходящие помещения из свободных.",
      property: "Опишите объект или участок и что вы рассматриваете. Ответит человек, а не автоответчик.",
      partnership: "Нескольких строк об организации и интересующем проекте достаточно для первого разговора. Условия обсуждаются индивидуально.",
      general: "Напишите вопрос — передадим его тому, кто ответит по существу.",
      careers: "Укажите направление или вакансию и ссылку на резюме. Данные кандидатов используются только для подбора.",
    },
    groups: { business: "О бизнесе", need: "Что нужно", asset: "Об объекте", org: "Об организации", role: "О позиции", contact: "Контактные данные" },
    f: {
      company: "Компания / бизнес", opening: "Что вы открываете?", openingDetail: "В нескольких словах", openingPh: "например, стоматология, кофейня, шоурум мебели", area: "Нужная площадь", location: "Предпочтительный район", property: "Интересующий объект", date: "Желаемая дата открытия", critical: "Что критично?", other: "Другое",
      have: "Что у вас есть?", country: "Страна", city: "Город", size: "Площадь", sizePh: "например, 1,5 га или 2 400 м²", consider: "Что вы рассматриваете?", materials: "Ссылка на материалы (необязательно)", materialsHint: "Планы, фото, выписка из кадастра — через Drive, Dropbox и т. п.",
      organisation: "Организация", kind: "Тип организации", interest: "Что вас интересует?", ticket: "Ориентировочный объём", category: "Категория", proposal: "Что вы предлагаете?", where: "Где (город / регион)",
      discipline: "Направление", role: "Вакансия", cv: "Ссылка на резюме (если нет файла)", cvPh: "https://…",
      question: "Ваш вопрос", name: "Имя и фамилия", email: "E-mail", phone: "Телефон (необязательно)", message: "Сообщение (необязательно)", consent: "Согласен(на) на использование моих данных для ответа на этот запрос.",
      any: "Любой", anyProperty: "Любой подходящий объект", choose: "Выберите", space: "Помещение", anySpace: "Любое подходящее помещение",
      price: "Ориентировочная цена (необязательно)", status: "Ваша роль", statuses: ["Собственник", "Уполномоченный брокер", "Консультант", "Другое"], description: "Краткое описание", documents: "Документы (необязательно)", docsHint: "В превью файлы не загружаются — они остаются на вашем устройстве.", company2: "Компания (необязательно)", role2: "Ваша роль", cvFile: "Резюме (файл)", cvEither: "Добавьте файл или ссылку на резюме.",
    },
    openRole: "Инициативный отклик",
    send: "Отправить запрос", sending: "Проверяем…",
    errors: { required: "Заполните это поле.", email: "Введите корректный e-mail.", consent: "Нужно согласие, чтобы мы могли ответить.", summary: "Проверьте отмеченные поля:" },
    done: { kicker: "Превью · ничего не отправлено", title: "Запрос подготовлен.", text: (to: string, reply: string) => `В рабочей версии запрос попадёт на ${to} (демонстрационный адрес). ${reply}.`, summary: "Сводка запроса", edit: "Изменить", fresh: "Новый запрос" },
    required: "обязательно",
  },
  en: {
    subjects: { lease: "Leasing", partnership: "Investment partnership", property: "Offer a property or land", careers: "Careers", general: "General question" },
    intro: {
      lease: "Tell us what the space needs to do for your business. We will check the available spaces and recommend suitable options.",
      property: "Describe the property or land and what you are considering. You get a first assessment, not an automatic reply.",
      partnership: "A few lines about your organisation and the project you are interested in are enough for a first conversation. Terms are discussed individually.",
      general: "Write your question — we pass it to the person who can answer it properly.",
      careers: "Name the area or role and add a link to your CV. Candidate data is used for recruitment only.",
    },
    groups: { business: "About the business", need: "What you need", asset: "About the property", org: "About the organisation", role: "About the role", contact: "Contact details" },
    f: {
      company: "Company / business", opening: "What are you opening?", openingDetail: "In a few words", openingPh: "e.g. dental practice, specialty coffee, furniture showroom", area: "Required area", location: "Preferred area", property: "Property of interest", date: "Target opening date", critical: "What is critical?", other: "Other",
      have: "What do you have?", country: "Country", city: "City", size: "Size", sizePh: "e.g. 1.5 ha or 2,400 m²", consider: "What are you considering?", materials: "Link to materials (optional)", materialsHint: "Plans, photos, cadastral extract — via Drive, Dropbox, etc.",
      organisation: "Organisation", kind: "Type of organisation", interest: "What interests you?", ticket: "Indicative size", category: "Category", proposal: "What do you propose?", where: "Where (city / region)",
      discipline: "Area", role: "Role", cv: "Link to your CV (if no file)", cvPh: "https://…",
      question: "Your question", name: "Full name", email: "E-mail", phone: "Telephone (optional)", message: "Message (optional)", consent: "I agree that my data may be used to answer this request.",
      any: "Any", anyProperty: "Any suitable property", choose: "Choose", space: "Space", anySpace: "Any suitable space",
      price: "Indicative price (optional)", status: "Your position", statuses: ["Owner", "Authorised broker", "Adviser", "Other"], description: "Short description", documents: "Documents (optional)", docsHint: "In the preview files are not uploaded — they stay on your device.", company2: "Company (optional)", role2: "Your role", cvFile: "CV (file)", cvEither: "Add a file or a link to your CV.",
    },
    openRole: "Open application",
    send: "Send the request", sending: "Checking…",
    errors: { required: "Please fill in this field.", email: "Please enter a valid e-mail.", consent: "We need your consent to reply.", summary: "Please check the marked fields:" },
    done: { kicker: "Preview · nothing was sent", title: "Your request is ready.", text: (to: string, reply: string) => `In the working version this request goes to ${to} (demonstration address). ${reply}.`, summary: "Request summary", edit: "Edit", fresh: "New request" },
    required: "required",
  },
};

const opts = (labels: string[]): Option[] => labels.map((label) => ({ value: label, label }));

function groupsFor(subject: Subject, t: (typeof T)["ro"], o: FormOptions): { title: string; fields: Field[] }[] {
  const contact: Field[] = [
    { name: "name", label: t.f.name, kind: "text", required: true, half: true },
    { name: "email", label: t.f.email, kind: "email", required: true, half: true },
    { name: "phone", label: t.f.phone, kind: "tel", half: true },
  ];
  const message: Field = { name: "message", label: t.f.message, kind: "textarea" };
  switch (subject) {
    case "lease":
      return [
        { title: t.groups.business, fields: [
          { name: "company", label: t.f.company, kind: "text", required: true, half: true },
          { name: "opening", label: t.f.opening, kind: "select", options: o.businessTypes, required: true, half: true },
          { name: "openingDetail", label: t.f.openingDetail, kind: "text", placeholder: t.f.openingPh },
        ] },
        { title: t.groups.need, fields: [
          { name: "area", label: t.f.area, kind: "select", options: o.areas, required: true, half: true },
          { name: "location", label: t.f.location, kind: "select", options: [{ value: "any", label: t.f.any }, ...o.districts], half: true },
          { name: "property", label: t.f.property, kind: "select", options: [{ value: "any", label: t.f.anyProperty }, ...o.properties], half: true },
          { name: "space", label: t.f.space, kind: "select", options: [{ value: "any", label: t.f.anySpace }, ...o.spaces], half: true },
          { name: "date", label: t.f.date, kind: "month", half: true },
          { name: "critical", label: t.f.critical, kind: "checks", options: [...o.requirements, { value: "other", label: t.f.other }], groups: o.requirementGroups },
          message,
        ] },
        { title: t.groups.contact, fields: contact },
      ];
    case "property":
      return [
        { title: t.groups.asset, fields: [
          { name: "have", label: t.f.have, kind: "radio", options: o.ownerAssets, required: true },
          { name: "country", label: t.f.country, kind: "text", required: true, half: true },
          { name: "city", label: t.f.city, kind: "text", required: true, half: true },
          { name: "size", label: t.f.size, kind: "text", required: true, placeholder: t.f.sizePh, half: true },
          { name: "price", label: t.f.price, kind: "text", half: true },
          { name: "status", label: t.f.status, kind: "select", options: opts(t.f.statuses), required: true, half: true },
          { name: "consider", label: t.f.consider, kind: "radio", options: o.ownerIntents, required: true },
          { name: "description", label: t.f.description, kind: "textarea" },
          { name: "documents", label: t.f.documents, kind: "file", multiple: true, accept: ".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx", hint: t.f.docsHint },
          { name: "materials", label: t.f.materials, kind: "url", hint: t.f.materialsHint },
        ] },
        { title: t.groups.contact, fields: [...contact, { name: "company", label: t.f.company2, kind: "text", half: true }] },
      ];
    case "partnership":
      return [
        { title: t.groups.org, fields: [
          { name: "organisation", label: t.f.organisation, kind: "text", required: true, half: true },
          { name: "role", label: t.f.role2, kind: "text", half: true },
          { name: "category", label: t.f.category, kind: "select", options: o.partnerCategories, required: true, half: true },
          { name: "proposal", label: t.f.proposal, kind: "textarea", required: true },
          { name: "where", label: t.f.where, kind: "text", half: true },
        ] },
        { title: t.groups.contact, fields: contact },
      ];
    case "general":
      return [
        { title: t.groups.contact, fields: [...contact, { name: "message", label: t.f.question, kind: "textarea", required: true }] },
      ];
    case "careers":
      return [
        { title: t.groups.role, fields: [
          { name: "discipline", label: t.f.discipline, kind: "select", options: o.disciplines, required: true, half: true },
          { name: "role", label: t.f.role, kind: "select", options: [...o.vacancies, { value: "open", label: t.openRole }], half: true },
          { name: "cvFile", label: t.f.cvFile, kind: "file", accept: ".pdf,.doc,.docx", hint: t.f.docsHint },
          { name: "cv", label: t.f.cv, kind: "url", placeholder: t.f.cvPh },
          message,
        ] },
        { title: t.groups.contact, fields: contact },
      ];
  }
}

export function EnquiryForm({ locale, options, initial = "lease", only }: { locale: SiteLocale; options: FormOptions; initial?: Subject; only?: Subject[] }) {
  const t = T[locale];
  const [subject, setSubject] = useState<Subject>(initial);
  const [prefill, setPrefill] = useState<Record<string, string | string[]>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [done, setDone] = useState<{ label: string; value: string }[] | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const summaryRef = useRef<HTMLDivElement>(null);
  const doneRef = useRef<HTMLDivElement>(null);
  const groups = groupsFor(subject, t, options);
  const subjects = only ?? (Object.keys(anchors) as Subject[]);

  // Deep links: #occupier / #opportunity / #investors / #partnership / #careers and ?subject=…&property=…&type=…
  useEffect(() => {
    const read = () => {
      const hash = window.location.hash.slice(1);
      const params = new URLSearchParams(window.location.search);
      const fromHash = subjects.find((key) => anchors[key] === hash);
      const fromQuery = params.get("subject") as Subject | null;
      const next = fromHash ?? (fromQuery && subjects.includes(fromQuery) ? fromQuery : null);
      if (next) setSubject(next);
      const values: Record<string, string | string[]> = {};
      if (params.get("property")) values.property = params.get("property")!;
      if (params.get("space")) values.space = params.get("space")!;
      if (params.get("type")) values.opening = params.get("type")!;
      if (params.get("area")) values.area = params.get("area")!;
      if (params.get("needs")) values.critical = params.get("needs")!.split(",");
      if (params.get("have")) values.have = params.get("have")!;
      if (params.get("consider")) values.consider = params.get("consider")!;
      if (params.get("category")) values.category = params.get("category")!;
      if (params.get("role")) values.role = params.get("role")!;
      setPrefill(values);
    };
    read();
    window.addEventListener("hashchange", read);
    return () => window.removeEventListener("hashchange", read);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const choose = (next: Subject) => {
    setSubject(next);
    setErrors({});
    setDone(null);
    history.replaceState(null, "", `#${anchors[next]}`);
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const found: Record<string, string> = {};
    const all = groups.flatMap((group) => group.fields);
    const read = (name: string) => data.getAll(name).map((v) => (typeof v === "string" ? v : v.name)).filter(Boolean);
    all.forEach((field) => {
      const values = read(field.name);
      if (field.required && !values.length) found[field.name] = t.errors.required;
      if (field.kind === "email" && values[0] && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values[0])) found[field.name] = t.errors.email;
    });
    if (subject === "careers" && !read("cv").length && !read("cvFile").length) found.cv = t.f.cvEither;
    if (!data.get("consent")) found.consent = t.errors.consent;
    setErrors(found);
    if (Object.keys(found).length) {
      window.requestAnimationFrame(() => summaryRef.current?.focus());
      return;
    }
    const summary = all
      .map((field) => {
        const raw = read(field.name);
        if (!raw.length) return null;
        const list = "options" in field ? raw.map((v) => field.options.find((opt) => opt.value === v)?.label ?? v) : raw;
        return { label: field.label, value: list.join(", ") };
      })
      .filter((row): row is { label: string; value: string } => row !== null);
    setDone(summary);
    window.requestAnimationFrame(() => doneRef.current?.focus());
  };

  const fieldId = (name: string) => `enq-${subject}-${name}`;
  const errorFor = (name: string) => (errors[name] ? { "aria-invalid": true as const, "aria-describedby": `${fieldId(name)}-error` } : {});
  const pre = (name: string) => prefill[name];

  return (
    <div className="xp-form">
      {subjects.map((key) => (
        <span key={key} id={anchors[key]} className="xp-form__anchor" aria-hidden="true" />
      ))}
      <div className="xp-form__subjects" role="group" aria-label={t.groups.contact}>
        {subjects.map((key) => (
          <button key={key} type="button" className={`xp-form__subject${subject === key ? " is-active" : ""}`} aria-pressed={subject === key} onClick={() => choose(key)}>
            {t.subjects[key]}
          </button>
        ))}
      </div>

      {done ? (
        <div className="xp-form__done" ref={doneRef} tabIndex={-1}>
          <p className="xp-form__done-kicker">{t.done.kicker}</p>
          <h3>{t.done.title}</h3>
          <p>{t.done.text(options.mailboxes[subject], options.reply[subject])}</p>
          <p className="xp-match__label">{t.done.summary}</p>
          <dl className="xp-form__summary">
            {done.map((row) => (
              <div key={row.label}>
                <dt>{row.label}</dt>
                <dd>{row.value}</dd>
              </div>
            ))}
          </dl>
          <div className="xp-match__actions">
            <button type="button" className="btn btn--ghost" onClick={() => setDone(null)}><span>{t.done.edit}</span></button>
            <button type="button" className="tlink" onClick={() => { setDone(null); formRef.current?.reset(); setPrefill({}); }}><span>{t.done.fresh}</span><Icon /></button>
          </div>
        </div>
      ) : (
        <form ref={formRef} className="xp-form__body" noValidate onSubmit={onSubmit} key={`${subject}-${JSON.stringify(prefill)}`}>
          <p className="xp-form__intro">{t.intro[subject]}</p>
          {Object.keys(errors).length ? (
            <div className="xp-form__errors" ref={summaryRef} tabIndex={-1} role="alert">
              <p>{t.errors.summary}</p>
              <ul>
                {Object.keys(errors).map((name) => (
                  <li key={name}><a href={`#${fieldId(name)}`}>{name === "consent" ? t.errors.consent : groups.flatMap((g) => g.fields).find((f) => f.name === name)?.label}</a></li>
                ))}
              </ul>
            </div>
          ) : null}
          {groups.map((group, gi) => (
            <fieldset key={group.title} className="xp-form__group">
              <legend><span>{String(gi + 1).padStart(2, "0")}</span>{group.title}</legend>
              <div className="xp-form__grid">
                {group.fields.map((field) => {
                  const id = fieldId(field.name);
                  const label = (
                    <>
                      {field.label}
                      {field.required ? <span className="xp-form__req" aria-hidden="true"> *</span> : null}
                    </>
                  );
                  const error = errors[field.name] ? <p className="xp-form__error" id={`${id}-error`}>{errors[field.name]}</p> : null;
                  const hint = field.hint ? <p className="xp-form__hint">{field.hint}</p> : null;
                  if (field.kind === "radio" || field.kind === "checks") {
                    const preset = pre(field.name);
                    const list = Array.isArray(preset) ? preset : preset ? [preset] : [];
                    const choice = (opt: Option) => (
                      <label key={opt.value} className="xp-choice">
                        <input type={field.kind === "radio" ? "radio" : "checkbox"} name={field.name} value={opt.value} defaultChecked={list.includes(opt.value)} />
                        <span>{opt.label}</span>
                      </label>
                    );
                    // grouped presentation (OWNER «FINAL POLISH» §9): the same single field, its options arranged under four
                    // small headings; options outside every group («Другое») close the last row
                    const grouped = field.groups?.length ? field.groups : null;
                    const rest = grouped ? field.options.filter((opt) => !grouped.some((group) => group.values.includes(opt.value))) : [];
                    return (
                      <fieldset key={field.name} className="xp-form__field xp-form__field--full xp-form__choices" id={id} {...errorFor(field.name)}>
                        <legend>{label}</legend>
                        {grouped ? (
                          <div className="xp-choice-groups">
                            {grouped.map((group, index) => {
                              const options = group.values.map((value) => field.options.find((opt) => opt.value === value)).filter((opt): opt is Option => Boolean(opt));
                              const tail = index === grouped.length - 1 ? rest : [];
                              return (
                                <div key={group.label} className="xp-choice-group">
                                  <p className="xp-choice-group__title">{group.label}</p>
                                  <div className="xp-choice-row">{[...options, ...tail].map(choice)}</div>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="xp-choice-row">{field.options.map(choice)}</div>
                        )}
                        {hint}
                        {error}
                      </fieldset>
                    );
                  }
                  const full = !("half" in field) || !field.half;
                  return (
                    <div key={field.name} className={`xp-form__field${full ? " xp-form__field--full" : ""}`}>
                      <label htmlFor={id}>{label}</label>
                      {field.kind === "select" ? (
                        <select id={id} name={field.name} defaultValue={(pre(field.name) as string) ?? ""} required={field.required} {...errorFor(field.name)}>
                          <option value="" disabled={field.required}>{t.f.choose}</option>
                          {field.options.map((opt) => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                          ))}
                        </select>
                      ) : field.kind === "file" ? (
                        <input id={id} name={field.name} type="file" accept={field.accept} multiple={field.multiple} className="xp-form__file" {...errorFor(field.name)} />
                      ) : field.kind === "textarea" ? (
                        <textarea id={id} name={field.name} rows={4} placeholder={field.placeholder} required={field.required} {...errorFor(field.name)} />
                      ) : (
                        <input id={id} name={field.name} type={field.kind} placeholder={"placeholder" in field ? field.placeholder : undefined} required={field.required} autoComplete={field.kind === "email" ? "email" : field.kind === "tel" ? "tel" : field.name === "name" ? "name" : undefined} {...errorFor(field.name)} />
                      )}
                      {hint}
                      {error}
                    </div>
                  );
                })}
              </div>
            </fieldset>
          ))}
          <label className="xp-form__consent" id={fieldId("consent")}>
            <input type="checkbox" name="consent" {...errorFor("consent")} />
            <span className="xp-need__box" aria-hidden="true" />
            <span>{t.f.consent}</span>
          </label>
          {errors.consent ? <p className="xp-form__error" id={`${fieldId("consent")}-error`}>{errors.consent}</p> : null}
          <div className="xp-form__submit">
            <button type="submit" className="btn"><span>{t.send}</span><Icon /></button>
            <p className="xp-form__note">* {t.required} · {options.reply[subject]}</p>
          </div>
        </form>
      )}
    </div>
  );
}
