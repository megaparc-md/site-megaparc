import Link from "next/link";
import type { CSSProperties } from "react";
import { LanguageSwitcher } from "@/components/language-switcher";
import { MobileMenu } from "@/components/mobile-menu";
import type { MenuProject, ProjectsMenuData } from "@/components/projects-menu";
import { SiteNav } from "@/components/site-nav";
import { getProject } from "@/content/source";
import { projectState } from "@/components/r3";
import { developmentPortfolio, itemHref, landPortfolio, leasingProjects, portfolioCategories } from "@/lib/portfolio";
import { brand, localePath, publicAsset, ui, type SiteLocale } from "@/lib/site-data";

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

/**
 * The approved logo, compact version (OWNER «APPROVED BRAND ALIGNMENT», 2026-11-18; Brand Guidelines: «în antet — versiunea compactă»,
 * the logo as a vector image, never typed). The approved vector file is used as a mask filled with the current colour, so the mark
 * follows every state of the header exactly as the typed word did (dark on light, white over a photograph) — the letterforms are the
 * approved file's, never redrawn or stretched (`mask-size: contain` on the file's own aspect ratio). No ® on the graphic version until
 * the OWNER confirms it may be applied to it; no red rule — it is not part of the approved logo.
 */
export function Brand({ locale, href, light = false }: { locale: SiteLocale; href?: string; light?: boolean }) {
  return (
    <Link className={`brand${light ? " brand--light" : ""}`} href={href ?? localePath(locale, "/")} aria-label={`${brand.name} — ${ui.home[locale]}`}>
      <span className="brand__logo" aria-hidden="true" style={{ "--brand-logo": `url("${publicAsset("/brand/megaparc-logo-compact.svg")}")` } as CSSProperties} />
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
