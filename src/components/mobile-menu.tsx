"use client";

import { useEffect, useId, useState } from "react";
import { usePathname } from "next/navigation";
import { LanguageSwitcher } from "@/components/language-switcher";
import type { ProjectsMenuData } from "@/components/projects-menu";
import { SiteNav } from "@/components/site-nav";
import { brand, ui, type SiteLocale } from "@/lib/site-data";

/**
 * Phone / tablet navigation: a single menu button in the header opens a
 * full-screen panel with the routes, the corporate routes and RO · RU · EN.
 * Escape closes, route change closes, body scroll is locked while open.
 */
export function MobileMenu({ locale, projects }: { locale: SiteLocale; projects?: Omit<ProjectsMenuData, "label" | "active"> }) {
  const pathname = usePathname();
  const [openOn, setOpenOn] = useState<string | null>(null);
  const open = openOn === pathname;
  const panelId = useId();

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpenOn(null);
    };
    document.addEventListener("keydown", onKey);
    document.body.classList.add("menu-open");
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.classList.remove("menu-open");
    };
  }, [open]);

  return (
    <div className={`menu${open ? " is-open" : ""}`}>
      <button
        type="button"
        className="menu__button"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? ui.closeMenu[locale] : ui.openMenu[locale]}
        onClick={() => setOpenOn((current) => (current === pathname ? null : pathname))}
      >
        <span className="menu__icon" aria-hidden="true">
          <i />
          <i />
        </span>
      </button>

      <div id={panelId} className="menu__panel" hidden={!open}>
        <div className="shell menu__inner">
          <div>
            <SiteNav locale={locale} variant="mobile" projects={projects} />
            <SiteNav locale={locale} variant="secondary-mobile" secondary />
          </div>
          <div className="menu__foot">
            <LanguageSwitcher locale={locale} variant="mobile" />
            <span className="menu__positioning">{brand.positioning[locale]}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
