import type { Metadata } from "next";
import { Icon } from "@/components/ui";
import Link from "next/link";
import { RootDocument } from "@/components/root-document";
import { brand, localePath, locales, ui } from "@/lib/site-data";
import "./globals.css";
// the 404 page's own brand roles — never import brand.css here: a stylesheet shared with the locale layouts moves into the first CSS chunk
// and loses its place as the last stylesheet of every page (OWNER «BRAND ALIGNMENT R2», 2026-11-19)
import "./brand-404.css";

/**
 * Global 404 for URLs that match no locale tree. It bypasses the locale root
 * layouts, so it renders its own document. Romanian is the primary language;
 * the Russian and English lines carry their own lang attribute.
 */
export const metadata: Metadata = {
  title: "404 — MEGAPARC",
  robots: { index: false },
};

export default function GlobalNotFound() {
  return (
    <RootDocument locale="ro">
      <main className="not-found ink">
        <div className="shell not-found__inner">
          <span className="label label--red">404 / {brand.name}</span>
          <h1>
            {locales.map((locale, index) => (
              <span key={locale} lang={locale} className={index === 0 ? undefined : "muted-light"}>
                {ui.page404[locale]}
              </span>
            ))}
          </h1>
          <div className="not-found__actions">
            {locales.map((locale) => (
              <Link key={locale} className="arrow-link arrow-link--inverse" href={localePath(locale, "/")} lang={locale} hrefLang={locale}>
                <span>{ui.back404[locale]}</span>
                <Icon name="arrow" className="arrow-link__icon" />
              </Link>
            ))}
          </div>
        </div>
      </main>
    </RootDocument>
  );
}
