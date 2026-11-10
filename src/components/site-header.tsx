import Link from "next/link";
import { LanguageSwitcher } from "@/components/language-switcher";
import { MobileMenu } from "@/components/mobile-menu";
import type { MenuProject, ProjectsMenuData } from "@/components/projects-menu";
import { SiteNav } from "@/components/site-nav";
import { getProject } from "@/content/source";
import { projectState } from "@/components/r3";
import { developmentPortfolio, itemHref, landPortfolio, leasingProjects, portfolioCategories } from "@/lib/portfolio";
import { brand, localePath, ui, type SiteLocale } from "@/lib/site-data";

const allProjects = { ro: "Toate proiectele →", ru: "Все проекты →", en: "All projects →" } as const;

/**
 * The projects dropdown data — R3.3 §5 (OWNER 2026-11-10): the three portfolio categories in OWNER order. Leasing buildings
 * carry their real photograph and their own derived status; land and development items are compact (their page, or their
 * category on the Projects page). OWNER «FINAL R3.1» §14 / §43 keeps the dropdown on production.
 */
function projectsMenu(locale: SiteLocale): Omit<ProjectsMenuData, "label" | "active"> {
  const [leasing, land, development] = portfolioCategories;
  const items: MenuProject[] = [
    ...leasingProjects().map((project) => {
      const state = projectState(project, locale);
      return { slug: project.slug, name: project.name, href: localePath(locale, `/projects/${project.slug}`), image: project.media?.card ?? null, descriptor: project.format[locale], status: state.text, tone: state.tone, group: leasing.label[locale] };
    }),
    ...landPortfolio.map((plot) => ({ slug: plot.slug, name: plot.name[locale], href: itemHref(locale, plot.page, land.anchor), image: null, descriptor: land.label[locale], status: plot.area?.[locale] ?? "", tone: "quiet", group: land.label[locale], compact: true })),
    ...developmentPortfolio().map((item) => ({ slug: item.slug, name: item.name, href: itemHref(locale, item.page, development.anchor), image: item.page ? getProject(item.page)?.media?.card ?? null : null, descriptor: development.label[locale], status: "", tone: "quiet", group: development.label[locale], compact: true })),
  ];
  return { href: localePath(locale, "/projects"), allLabel: allProjects[locale], items };
}

export function Brand({ locale, href, light = false }: { locale: SiteLocale; href?: string; light?: boolean }) {
  return (
    <Link className={`brand${light ? " brand--light" : ""}`} href={href ?? localePath(locale, "/")} aria-label={`${brand.name} — ${ui.home[locale]}`}>
      <span className="brand__name">{brand.wordmark}</span>
      <span className="brand__rule" aria-hidden="true" />
    </Link>
  );
}

/**
 * Header (OWNER "SITEWIDE R3" §12): wordmark left; the five primary routes; a quieter utility group
 * (Offer a property · Careers); RO · RU · EN at the far edge. Phone: logo + menu button only.
 */
export function SiteHeader({ locale }: { locale: SiteLocale; variant?: "overlay" | "solid" }) {
  const menu = projectsMenu(locale);
  return (
    <header className="hdr">
      <div className="shell hdr__inner">
        <Brand locale={locale} />
        <div className="hdr__right">
          <SiteNav locale={locale} projects={menu} />
          <SiteNav locale={locale} variant="utility" group="utility" />
          <LanguageSwitcher locale={locale} />
          <MobileMenu locale={locale} projects={menu} />
        </div>
      </div>
    </header>
  );
}
