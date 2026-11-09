"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ProjectsAccordion, ProjectsMenu, type ProjectsMenuData } from "@/components/projects-menu";
import { localePath, navigation, secondaryNavigation, ui, utilityNavigation, type NavItem, type SiteLocale } from "@/lib/site-data";

/**
 * Navigation with route-aware active state (header desktop + mobile panel).
 * `group`: primary (Projects · Leasing · Investment · About · Contact — OWNER "SITEWIDE R3" §12),
 * utility (Offer a property · Careers — quieter, never competing with the primary five) or
 * secondary (History).
 */
export function SiteNav({
  locale,
  variant = "desktop",
  group = "primary",
  projects,
}: {
  locale: SiteLocale;
  variant?: "desktop" | "mobile" | "utility" | "secondary-mobile";
  group?: "primary" | "utility" | "secondary";
  /** the projects dropdown (OWNER preview edition only) */
  projects?: Omit<ProjectsMenuData, "label" | "active">;
}) {
  const pathname = usePathname();
  const items: NavItem[] = group === "utility" ? utilityNavigation[locale] : group === "secondary" ? secondaryNavigation[locale] : navigation[locale];
  const label = group === "primary" ? (variant === "mobile" ? ui.mobileNavigation[locale] : ui.navigation[locale]) : ui.secondaryNavigation[locale];
  const normalized = pathname.replace(/\/$/, "") || "/";

  return (
    <nav className={`site-nav site-nav--${variant}`} aria-label={label}>
      {items.map((item) => {
        const href = localePath(locale, item.path);
        // an item also covers its sub-routes and its `also` prefixes (History under About, Offer under Investment)
        const prefixes = [href, ...(group === "primary" ? item.also ?? [] : []).map((path) => localePath(locale, path))];
        const active = prefixes.some((prefix) => normalized === prefix || normalized.startsWith(`${prefix}/`));
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
