import { Icon } from "@/components/ui";
import { company, contactLinks } from "@/data/demo-content";
import type { Localized, SiteLocale } from "@/lib/site-data";

/**
 * DIRECT CONTACT — the production edition's replacement for every form (OWNER "PRODUCTION V1", 2026-11-09 §7):
 * the form backend does not exist yet and n8n stays off, so nothing may look as if it was sent. No fields, no
 * submit, no "message sent" state — the three OWNER-confirmed contacts, clickable, with the e-mail subject set
 * for the context of the page.
 */
export type DirectSubject = "lease" | "partnership" | "property" | "careers" | "general" | "viewing";

const copy = {
  title: { ro: "Scrieți-ne sau sunați.", ru: "Напишите или позвоните.", en: "Write or call." },
  note: {
    ro: "Formularul online nu primește încă solicitări — folosiți e-mailul sau telefonul.",
    ru: "Онлайн-форма пока не принимает заявки — напишите на e‑mail или позвоните.",
    en: "The online form is not accepting requests yet — please use e-mail or the telephone.",
  },
  email: { ro: "E-mail", ru: "E‑mail", en: "E-mail" },
  mobile: { ro: "Mobil", ru: "Мобильный", en: "Mobile" },
  landline: { ro: "Telefon", ru: "Телефон", en: "Telephone" },
} satisfies Record<string, Localized>;

const subjects: Record<DirectSubject, Localized> = {
  lease: { ro: "Închiriere", ru: "Аренда", en: "Leasing" },
  viewing: { ro: "Vizionare", ru: "Просмотр помещения", en: "Viewing" },
  partnership: { ro: "Parteneriat investițional", ru: "Инвестиционное партнёрство", en: "Investment partnership" },
  property: { ro: "Propunere de obiect sau teren", ru: "Предложение объекта или земли", en: "Property or land proposal" },
  careers: { ro: "Cariere", ru: "Вакансии", en: "Careers" },
  general: { ro: "Întrebare", ru: "Вопрос", en: "Question" },
};

export function DirectContact({ locale, subject = "general", context, title, note, id, className = "" }: { locale: SiteLocale; subject?: DirectSubject; context?: string; title?: string | null; note?: string | null; id?: string; className?: string }) {
  // the exact OWNER-confirmed contact links only (qa-static whitelist); the subject list documents the routing for the future form backend
  void subjects[subject];
  void context;
  const rows: [string, string, string][] = [
    [copy.email[locale], company.email.value[locale], contactLinks.email],
    [copy.mobile[locale], company.mobile.value[locale], contactLinks.mobile],
    [copy.landline[locale], company.landline.value[locale], contactLinks.landline],
  ];
  return (
    <div id={id} className={`dc ${className}`.trim()}>
      {title === null ? null : <p className="dc__title">{title ?? copy.title[locale]}</p>}
      {note === null ? null : <p className="dc__note">{note ?? copy.note[locale]}</p>}
      <ul className="dc__list">
        {rows.map(([label, value, href]) => (
          <li key={label}>
            <a className="dc__action" href={href}>
              <span className="dc__label">{label}</span>
              <span className="dc__value">{value}</span>
              <Icon name="up-right" />
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
