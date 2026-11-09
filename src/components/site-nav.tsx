"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ProjectsAccordion, ProjectsMenu, type ProjectsMenuData } from "@/components/projects-menu";
import { localePath, navigation, secondaryNavigation, ui, type SiteLocale } from "@/lib/site-data";

/**
 * Primary navigation with route-aware active state.
 * Used by the header (desktop + mobile panel) and the footer.
 * `secondary` renders the secondary routes (History) that stay out of the primary bar.
 */
export function SiteNav({
  locale,
  variant = "desktop",
  secondary = false,
  projects,
}: {
  locale: SiteLocale;
  variant?: "desktop" | "mobile" | "footer" | "secondary-mobile";
  secondary?: boolean;
  /** the projects dropdown (OWNER preview edition only) */
  projects?: Omit<ProjectsMenuData, "label" | "active">;
}) {
  const pathname = usePathname();
  const items = secondary ? secondaryNavigation[locale] : navigation[locale];
  const label = secondary ? ui.secondaryNavigation[locale] : variant === "mobile" ? ui.mobileNavigation[locale] : ui.navigation[locale];

  return (
    <nav className={`site-nav site-nav--${variant}`} aria-label={label}>
      {items.map((item) => {
        const href = localePath(locale, item.path);
        const normalized = pathname.replace(/\/$/, "") || "/";
        // Home is active only on itself; other items also cover their sub-routes and `also` prefixes.
        const prefixes = item.path === "/" ? [] : [href, ...(item.also ?? []).map((path) => localePath(locale, path))];
        const active = normalized === href || prefixes.some((prefix) => normalized === prefix || normalized.startsWith(`${prefix}/`));
        if (projects && item.path === "/projects" && (variant === "desktop" || variant === "mobile")) {
          const data = { ...projects, label: item.label, active };
          return variant === "desktop" ? <ProjectsMenu key={item.path} data={data} /> : <ProjectsAccordion key={item.path} data={data} />;
        }
        return (
          <Link key={item.path} href={href} aria-current={active ? "page" : undefined}>
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
