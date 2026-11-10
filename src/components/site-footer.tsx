import Link from "next/link";
import { LanguageSwitcher } from "@/components/language-switcher";
import { projectState } from "@/components/r3";
import { developmentPortfolio, itemHref, landPortfolio, leasingProjects, portfolioCategories } from "@/lib/portfolio";
import { company, contactLinks } from "@/data/demo-content";
import { businessStatement } from "@/lib/business";
import { brand, localePath, type Localized, type SiteLocale } from "@/lib/site-data";

/**
 * INSTITUTIONAL FOOTER (OWNER "SITEWIDE R3" §14): a dark architectural ending — the company positioning,
 * then Investment · Leasing · Projects · Company · Contact, the legal line and the languages, and the
 * MEGAPARC wordmark as the last architectural line of the page. Leasing and Projects read the content
 * source, so a unit that is let or a new project changes the footer without code.
 * `statement={false}` omits WE BUILD THE FUTURE on a page that has just closed on it.
 */
const copy = {
  investment: { ro: "Investiții", ru: "Инвестиции", en: "Investment" },
  leasing: { ro: "Închiriere", ru: "Аренда", en: "Leasing" },
  projects: { ro: "Proiecte", ru: "Проекты", en: "Projects" },
  company: { ro: "Companie", ru: "Компания", en: "Company" },
  contact: { ro: "Contact", ru: "Контакты", en: "Contact" },
  language: { ro: "Limba", ru: "Язык", en: "Language" },
  legal: {
    ro: "Informațiile juridice și politica de confidențialitate — la cerere.",
    ru: "Юридическая информация и политика конфиденциальности — по запросу.",
    en: "Legal information and privacy policy — on request.",
  },
} satisfies Record<string, Localized>;

const investmentLinks: { path: string; label: Localized }[] = [
  { path: "/partnership", label: { ro: "Investiții și parteneriat", ru: "Инвестиции и партнёрство", en: "Investment and partnership" } },
  { path: "/offer", label: { ro: "Propuneți un obiect sau un teren", ru: "Предложить объект или землю", en: "Offer a property or land" } },
  { path: "/contact?subject=partnership#partnership", label: { ro: "Discutăm o oportunitate", ru: "Обсудить возможность", en: "Discuss an opportunity" } },
];
const leasingLinks: { path: string; label: Localized }[] = [
  { path: "/leasing#available", label: { ro: "Spații disponibile", ru: "Свободные помещения", en: "Available spaces" } },
  { path: "/leasing#technical-support", label: { ro: "Suport tehnic pentru chiriaș", ru: "Техническая поддержка арендатора", en: "Technical support for tenants" } },
];
const companyLinks: { path: string; label: Localized }[] = [
  { path: "/about", label: { ro: "Despre noi", ru: "О компании", en: "About" } },
  { path: "/history", label: { ro: "Istoric", ru: "История", en: "History" } },
  { path: "/careers", label: { ro: "Cariere", ru: "Вакансии", en: "Careers" } },
  { path: "/contact", label: { ro: "Contact", ru: "Контакты", en: "Contact" } },
];

function href(locale: SiteLocale, value: string) {
  const [pathQuery, hash] = value.split("#");
  const [path, query] = pathQuery.split("?");
  return `${localePath(locale, path)}${query ? `?${query}` : ""}${hash ? `#${hash}` : ""}`;
}

export function SiteFooter({ locale, statement = true }: { locale: SiteLocale; statement?: boolean }) {
  // R3.3 §5: the footer follows the three portfolio categories (leasing · land · development)
  const leasing = leasingProjects();
  const [, land, development] = portfolioCategories;
  return (
    <footer className="ftr r3-ftr">
      <div className="r3-shell r3-ftr__top">
        <p className="r3-ftr__position">{businessStatement[locale]}</p>
        {statement ? (
          <p className="r3-ftr__future">
            <span lang="en">We build the future.</span>
            {locale !== "en" ? <span>{brand.tagline[locale]}.</span> : null}
          </p>
        ) : null}
      </div>

      <div className="r3-shell r3-ftr__cols">
        <nav className="r3-ftr__col" aria-label={copy.investment[locale]}>
          <p className="r3-ftr__head">{copy.investment[locale]}</p>
          <ul>
            {investmentLinks.map((link) => (
              <li key={link.path}><Link href={href(locale, link.path)}>{link.label[locale]}</Link></li>
            ))}
          </ul>
        </nav>
        <nav className="r3-ftr__col" aria-label={copy.leasing[locale]}>
          <p className="r3-ftr__head">{copy.leasing[locale]}</p>
          <ul>
            {leasingLinks.slice(0, 1).map((link) => (
              <li key={link.path}><Link href={href(locale, link.path)}>{link.label[locale]}</Link></li>
            ))}
            {leasing.map((project) => (
              <li key={project.slug}>
                <Link href={localePath(locale, `/projects/${project.slug}`)}>{project.name}<small>{projectState(project, locale).text}</small></Link>
              </li>
            ))}
            {leasingLinks.slice(1).map((link) => (
              <li key={link.path}><Link href={href(locale, link.path)}>{link.label[locale]}</Link></li>
            ))}
          </ul>
        </nav>
        <nav className="r3-ftr__col" aria-label={copy.projects[locale]}>
          <p className="r3-ftr__head">{copy.projects[locale]}</p>
          <ul>
            <li><Link href={itemHref(locale, null, land.anchor)}>{land.label[locale]}<small>{landPortfolio.map((plot) => plot.name[locale]).join(" · ")}</small></Link></li>
            <li><Link href={itemHref(locale, null, development.anchor)}>{development.label[locale]}<small>{developmentPortfolio().map((item) => item.name).join(" · ")}</small></Link></li>
          </ul>
        </nav>
        <nav className="r3-ftr__col" aria-label={copy.company[locale]}>
          <p className="r3-ftr__head">{copy.company[locale]}</p>
          <ul>
            {companyLinks.map((link) => (
              <li key={link.path}><Link href={href(locale, link.path)}>{link.label[locale]}</Link></li>
            ))}
          </ul>
        </nav>
        <div className="r3-ftr__col r3-ftr__col--contact">
          <p className="r3-ftr__head">{copy.contact[locale]}</p>
          {/* OWNER-confirmed public contacts (2026-10-09) */}
          <ul className="r3-ftr__contacts">
            <li><a href={contactLinks.email}>{company.email.value[locale]}</a></li>
            <li><a href={contactLinks.mobile}>{company.mobile.value[locale]}</a></li>
            <li><a href={contactLinks.landline}>{company.landline.value[locale]}</a></li>
          </ul>
          <p className="r3-ftr__city">{brand.city[locale]}</p>
        </div>
      </div>

      <div className="r3-shell r3-ftr__base">
        <span>{copy.legal[locale]}</span>
        <div className="r3-ftr__lang">
          <span className="sr-only">{copy.language[locale]}</span>
          <LanguageSwitcher locale={locale} variant="footer" />
        </div>
        <span>© {new Date().getFullYear()} {brand.name}</span>
      </div>

      <p className="r3-ftr__mark" aria-hidden="true">{brand.name}</p>
    </footer>
  );
}
