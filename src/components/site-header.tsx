import Link from "next/link";
import { LanguageSwitcher } from "@/components/language-switcher";
import { MobileMenu } from "@/components/mobile-menu";
import type { ProjectsMenuData } from "@/components/projects-menu";
import { SiteNav } from "@/components/site-nav";
import { availabilityLabel, availabilityOf, formatAreaRange, getProject, kindLabel, propertyOccupancy, spacesFor } from "@/content/source";
import type { OperatingSlug } from "@/data/demo-content";
import { brand, isProductionEdition, localePath, ui, type SiteLocale } from "@/lib/site-data";

const menuOrder = ["dacia-31", "moscova-9", "moscova-20", "creanga-78", "vatra", "drochia-gateway"];
const allProjects = { ro: "Toate proiectele →", ru: "Все проекты →", en: "All projects →" } as const;
const fullyLetLabel = { ro: "Ocupat 100 %", ru: "Занят на 100 %", en: "100% occupied" } as const;

/** The projects dropdown data (OWNER preview edition only until OWNER review): real images, confirmed descriptors, derived status. */
function projectsMenu(locale: SiteLocale): Omit<ProjectsMenuData, "label" | "active"> | undefined {
  if (isProductionEdition) return undefined;
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
 * Compact sticky header: wordmark left, menu right.
 * Phone: 72px, logo + menu button only (languages live inside the menu).
 * Desktop: 88px, uppercase navigation right, RO · RU · EN at the far edge.
 */
export function SiteHeader({ locale }: { locale: SiteLocale; variant?: "overlay" | "solid" }) {
  const menu = projectsMenu(locale);
  return (
    <header className="hdr">
      <div className="shell hdr__inner">
        <Brand locale={locale} />
        <div className="hdr__right">
          <SiteNav locale={locale} projects={menu} />
          <LanguageSwitcher locale={locale} />
          <MobileMenu locale={locale} projects={menu} />
        </div>
      </div>
    </header>
  );
}
