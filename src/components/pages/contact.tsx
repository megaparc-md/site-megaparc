import Link from "next/link";
import { DemoLegend, Val } from "@/components/experience";
import { EnquiryFormBlock } from "@/components/journey-blocks";
import { PageShell } from "@/components/page-shell";
import { company, contactLinks, leasingProcess, shown } from "@/data/demo-content";
import { Icon } from "@/components/ui";
import { localePath, type SiteLocale } from "@/lib/site-data";

/**
 * CONTACT — start with the right conversation (OWNER "PREMIUM PHASE 2",
 * 2026-10-09). The first screen: one statement, the OWNER-confirmed contacts
 * set large and clickable (mailto / tel), and the five routes — leasing ·
 * investment partnership · offer a property or land · vacancies · general
 * question — as calm full-width rows. The form follows, adapting to its
 * subject, with the details and what happens next. Department mailboxes are
 * not published until the OWNER supplies them.
 */
const copy = {
  ro: {
    label: "Contact",
    title: "Începeți cu discuția potrivită.",
    lead: "Alegeți direcția — sau scrieți-ne mai jos.",
    routes: [["Închiriere", "Găsiți un spațiu", "/leasing#available"], ["Parteneriat investițional", "Discutăm o oportunitate", "#partnership"], ["Propuneți un obiect sau un teren", "Trimiteți informațiile", "/offer#form"], ["Cariere", "Vezi posturile", "/careers#positions"], ["Întrebare generală", "Scrieți-ne", "#question"]],
    formLabel: "Scrieți-ne",
    formTitle: "Sau descrieți sarcina — răspunde echipa potrivită.",
    details: "Date de contact",
    company: "Companie",
    office: "Birou",
    email: "E-mail",
    mobile: "Mobil",
    landline: "Telefon",
    hours: "Program",
    nextLabel: "Ce urmează",
    next: [["Citim solicitarea", "O persoană din echipa responsabilă, nu un robot."], ["Vă răspundem", "Cu întrebări concrete sau o primă propunere."], ["Ne întâlnim", "Pe obiect, la birou sau online — cum vă este comod."]],
  },
  ru: {
    label: "Контакты",
    title: "Начните с\u00a0нужного разговора.",
    lead: "Выберите направление — или опишите задачу в форме ниже.",
    routes: [["Аренда", "Найти помещение", "/leasing#available"], ["Инвестиционное партнёрство", "Обсудить возможность", "#partnership"], ["Предложить объект или землю", "Отправить информацию", "/offer#form"], ["Вакансии", "Смотреть вакансии", "/careers#positions"], ["Общий вопрос", "Написать нам", "#question"]],
    formLabel: "Написать нам",
    formTitle: "Или опишите задачу — ответит нужная команда.",
    details: "Контактные данные",
    company: "Компания",
    office: "Офис",
    email: "E-mail",
    mobile: "Мобильный",
    landline: "Телефон",
    hours: "Часы работы",
    nextLabel: "Что будет дальше",
    next: [["Читаем запрос", "Его читает человек из ответственной команды, а не робот."], ["Отвечаем", "С конкретными вопросами или первым предложением."], ["Встречаемся", "На объекте, в офисе или онлайн — как вам удобно."]],
  },
  en: {
    label: "Contact",
    title: "Start with the right conversation.",
    lead: "Choose a route — or write to us below.",
    routes: [["Leasing", "Find a space", "/leasing#available"], ["Investment partnership", "Discuss an opportunity", "#partnership"], ["Offer a property or land", "Send the details", "/offer#form"], ["Careers", "See vacancies", "/careers#positions"], ["General question", "Write to us", "#question"]],
    formLabel: "Write to us",
    formTitle: "Or describe the task — the right team replies.",
    details: "Contact details",
    company: "Company",
    office: "Office",
    email: "E-mail",
    mobile: "Mobile",
    landline: "Telephone",
    hours: "Hours",
    nextLabel: "What happens next",
    next: [["We read your request", "A person from the team responsible, not a robot."], ["We reply", "With specific questions or a first proposal."], ["We meet", "On site, at the office or online — as suits you."]],
  },
} as const;

export function ContactPage({ locale }: { locale: SiteLocale }) {
  const c = copy[locale];
  // production edition: unconfirmed working hours are not published (OWNER "PRODUCTION V1" §3 Contacts)
  const rows = ([
    [c.company, company.legalName],
    [c.office, company.city],
    [c.hours, company.hours],
  ] as const).filter(([, point]) => shown(point));
  const direct = [
    [c.email, company.email, contactLinks.email],
    [c.mobile, company.mobile, contactLinks.mobile],
    [c.landline, company.landline, contactLinks.landline],
  ] as const;

  return (
    <PageShell locale={locale} experience mainClassName="xp-contact">
      <section className="ct2-hero">
        <div className="xp-shell ct2-hero__grid">
          <div className="ct2-hero__copy">
            <p className="pm-kicker" data-reveal>{c.label}</p>
            <h1 className="ct2-hero__title" data-reveal>{c.title}</h1>
            <p className="ct2-hero__lead" data-reveal>{c.lead}</p>
            <ul className="ct2-direct" data-reveal>
              {direct.map(([label, point, href]) => (
                <li key={href}>
                  <span>{label}</span>
                  <a href={href} aria-label={`${label}: ${point.value[locale]}`}>{point.value[locale]}</a>
                </li>
              ))}
            </ul>
          </div>
          <nav className="ct2-routes" aria-label={c.label} data-reveal>
            {c.routes.map(([label, action, href]) => {
              const [path, hash] = href.split("#");
              return (
                <Link key={label} href={path ? `${localePath(locale, path)}${hash ? `#${hash}` : ""}` : `#${hash}`}>
                  <span className="ct2-routes__label">{label}</span>
                  <span className="ct2-routes__action">{action}</span>
                  <Icon name="arrow" size={18} />
                </Link>
              );
            })}
          </nav>
        </div>
      </section>

      <section className="xp-sec xp-sec--warm xp-contact__form" id="write">
        <div className="xp-shell">
          <div className="pm-head" data-reveal>
            <p className="pm-kicker">{c.formLabel}</p>
            <h2 className="pm-h2">{c.formTitle}</h2>
          </div>
        </div>
        <div className="xp-shell xp-contact__grid">
          <EnquiryFormBlock locale={locale} />
          <aside className="xp-contact__aside">
            <p className="xp-label">{c.details}</p>
            <dl className="xp-details">
              {direct.map(([label, point, href]) => (
                <div key={href}>
                  <dt>{label}</dt>
                  <dd><a className="xp-details__link" href={href}>{point.value[locale]}</a></dd>
                </div>
              ))}
              {rows.map(([label, point]) => (
                <div key={label}>
                  <dt>{label}</dt>
                  <dd><Val point={point} locale={locale} /></dd>
                </div>
              ))}
            </dl>
            <DemoLegend locale={locale} />
            <p className="xp-label xp-label--gap">{c.nextLabel}</p>
            <ol className="xp-process xp-process--stack">
              {c.next.map(([title, text], index) => (
                <li key={title}>
                  <h3>{title}</h3>
                  <p>{text}{index === 1 && shown(leasingProcess.reply) ? <> <Val point={leasingProcess.reply} locale={locale} /></> : null}</p>
                </li>
              ))}
            </ol>
          </aside>
        </div>
      </section>
    </PageShell>
  );
}
