import Link from "next/link";
import { LanguageSwitcher } from "@/components/language-switcher";
import { MobileMenu } from "@/components/mobile-menu";
import type { ProjectsMenuData } from "@/components/projects-menu";
import { SiteNav } from "@/components/site-nav";
import { availabilityLabel, availabilityOf, formatAreaRange, getProject, kindLabel, propertyOccupancy, spacesFor } from "@/content/source";
import type { OperatingSlug } from "@/data/demo-content";
import { brand, localePath, ui, type SiteLocale } from "@/lib/site-data";

const menuOrder = ["dacia-31", "moscova-9", "moscova-20", "creanga-78", "vatra", "drochia-gateway"];
const allProjects = { ro: "Toate proiectele →", ru: "Все проекты →", en: "All projects →" } as const;
const fullyLetLabel = { ro: "Ocupat 100 %", ru: "Занят на 100 %", en: "100% occupied" } as const;

/**
 * The projects dropdown data: real images, confirmed descriptors, status derived from the register. Preview-only until
 * the OWNER review; OWNER «FINAL R3.1» §14 / §43 (2026-11-09) keeps it and accepts it on production — both editions.
 */
function projectsMenu(locale: SiteLocale): Omit<ProjectsMenuData, "label" | "active"> {
  const items = menuOrder.flatMap((slug) => {
    const project = getProject(slug);
    if (!project) return [];
    let status = kindLabel[project.kind][locale];
    let tone: string = project.kind;
    if (project.kind === "operating") {
      const spaces = spacesFor(project.slug);
      if (spaces.length) {
        status = spaces.map((space) => `${availabilityLabel(space, locale)} · ${formatAreaRange(space.areaMin, space.area, locale)}`).join(" · ");
        tone = spaces.some((space) => availabilityOf(space).key === "now") ? "now" : "soon";
      } else if (propertyOccupancy(project.slug as OperatingSlug).fullyLet) {
        status = `${kindLabel.operating[locale]} · ${fullyLetLabel[locale]}`;
        tone = "full";
      }
    }
    return [{ slug, name: project.name, href: localePath(locale, `/projects/${slug}`), image: project.media?.card ?? null, descriptor: project.format[locale], status, tone }];
  });
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
