import { LanguageEntryControls } from "@/components/language-entry-controls";
import { ArtImage } from "@/components/primitives";
import { getProject } from "@/content/source";
import { directions } from "@/lib/business";
import { brand, isProductionEdition, localePath, locales, type SiteLocale } from "@/lib/site-data";
import "@/app/language-entry.css";

/**
 * PREMIUM LANGUAGE ENTRY (OWNER «PREMIUM LANGUAGE ENTRY EXPERIENCE», 2026-11-12) — CONCEPT, OWNER PREVIEW ONLY (never in the
 * production edition). The first direct visit to the home page offers the three languages once; the choice is remembered; every
 * later visit opens the site without the screen. Direct links to properties, the Leasing Pack and the QR are never touched — the
 * component exists on the home pages only. The header language switcher stays exactly as it is.
 *
 * How it stays out of the way of loading:
 *   · the layer is in the server HTML, hidden by CSS; a few lines of inline script, run before the first paint, decide whether it is
 *     shown (`<html data-entry>`), so nothing flashes and nothing waits for hydration;
 *   · the layer is `position: fixed` — it can never shift the layout (no CLS);
 *   · the home page renders, loads and stays crawlable underneath; without JavaScript the layer simply never appears;
 *   · the cinematic variant shows the same photograph as the home hero (already requested with priority) — no extra download.
 *
 * Decision of the inline script on a home page (locale L):
 *   came from inside the site (the language switcher)      → remember L, show nothing;
 *   a language is remembered                                → show nothing; the root opens in the remembered language;
 *   direct visit to /ru or /en                              → that link is the choice: remember L, show nothing;
 *   first direct visit to the root                          → show the choice.
 * Two variants for the OWNER review: «overlay» (compact, the page stays visible and usable — the default) and «cinema» (a full
 * welcome screen). On the preview «?entry=overlay», «?entry=cinema» force a variant and «?entry=reset» forgets the choice.
 */
const KEY = "megaparc:lang";
const NBSP = String.fromCharCode(160);
const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const copy = {
  label: "Limba · Язык · Language",
  aria: "Alegeți limba · Выберите язык · Choose your language",
  close: "Închide · Закрыть · Close",
  go: { ro: "Continuă în română", ru: "Продолжить на русском", en: "Continue in English" } satisfies Record<SiteLocale, string>,
};

export function LanguageEntry({ locale }: { locale: SiteLocale }) {
  if (isProductionEdition) return null;
  const script = `(function(){try{var k=${JSON.stringify(KEY)},L=${JSON.stringify(locale)},d=document.documentElement,s=localStorage.getItem(k),r=document.referrer,q=/[?&]entry=(overlay|cinema|reset)/.exec(location.search),f=q&&q[1];if(f==="reset"){localStorage.removeItem(k);s=null;f=null}if(f){if(L==="ro")d.setAttribute("data-entry",f);return}if(r&&r.indexOf(location.origin)===0){localStorage.setItem(k,L);return}if(s){if(L==="ro"&&s!=="ro"&&!location.search)location.replace(${JSON.stringify(base)}+"/"+s+"/");return}if(L!=="ro"){localStorage.setItem(k,L);return}d.setAttribute("data-entry","overlay")}catch(e){}})()`;
  const hero = getProject("dacia-31");
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: script }} />
      {locale === "ro" ? (
        <div className="le" id="language-entry" role="dialog" aria-label={copy.aria} data-key={KEY}>
          {/* cinema only: the real MEGAPARC architecture — the same frame as the home hero (lazy: it is requested only when shown) */}
          {hero?.media ? (
            <figure className="le__photo" aria-hidden="true">
              <ArtImage media={hero.media} alt="" sizes="100vw" position="52% 54%" />
            </figure>
          ) : null}
          <div className="le__panel">
            <p className="le__brand" aria-hidden="true">MEGAPARC<i /></p>
            <p className="le__label">{copy.label}</p>
            <ul className="le__list">
              {locales.map((l) => (
                <li key={l}>
                  <a className="le__lang" href={`${base}${localePath(l, "/")}`.replace(/\/?$/, "/")} hrefLang={l} lang={l} data-lang={l}>
                    <span className="le__code" aria-hidden="true">{l.toUpperCase()}</span>
                    <span className="le__name">{brand.languageNames[l]}</span>
                    <span className="le__line">{directions.map((direction) => direction.title[l]).join(`${NBSP}· `)}</span>
                    <span className="le__go">{copy.go[l]}</span>
                  </a>
                </li>
              ))}
            </ul>
            <button type="button" className="le__close" aria-label={copy.close} data-close>
              <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false"><path d="M5 5l14 14M19 5L5 19" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
            </button>
          </div>
          <LanguageEntryControls storageKey={KEY} current={locale} />
        </div>
      ) : null}
    </>
  );
}
