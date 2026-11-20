import type { CSSProperties } from "react";
import { LanguageEntryControls } from "@/components/language-entry-controls";
import { brand, isProductionEdition, localePath, locales, publicAsset, type SiteLocale } from "@/lib/site-data";
import "@/app/language-entry.css";

/**
 * PREMIUM BRAND ENTRANCE (OWNER «PREMIUM BRAND ENTRANCE + CORPORATE ARC REFINEMENT», 2026-11-20; it replaces the two concepts of the
 * «PREMIUM LANGUAGE ENTRY EXPERIENCE» of 2026-11-12) — OWNER PREVIEW ONLY: never in the production edition until an OWNER GO.
 *
 * Two variants for the OWNER's choice:
 *   A · «entrance» — the first direct visit to the root address opens on a quiet dark screen: the approved logo for a dark ground
 *       (with its slogan) and the three languages. The visitor chooses; the choice is remembered; later visits open the site at once.
 *   B · «direct»   — the site opens at once; the brand and the language choice are a slim dark band at the foot of the first screen,
 *       which never blocks the page.
 *
 * What never happens (the mandate's §5–§6):
 *   · no entrance on a direct link — the component exists on the home pages only, and even there a query string or a fragment
 *     (campaign links, QR codes, anchors) and an arrival from another site (a search engine, a mail client) open the page as linked;
 *   · no redirect a crawler can follow — crawlers have no stored choice and are never shown the layer (the page they index is the page);
 *     the only redirect is `location.replace` for a returning visitor whose remembered language is not the root's, so the browser
 *     history gains no entry and Back / Forward behave as before;
 *   · no flash of the wrong language — the decision is a few lines of inline script that run before the first paint; while a
 *     returning visitor is being sent to their language the page stays unpainted;
 *   · no dependence on JavaScript — without it the layer is never shown and the root opens the Romanian site as today;
 *   · no layout shift — the layer is `position: fixed`; nothing in the page moves when it appears or leaves.
 *
 * The inline script on a home page of locale L:
 *   «?entry=a | b» (preview)          → show that variant on the root (review switch);  «?entry=reset» forgets the choice first;
 *   came from inside the site          → remember L (the header language switcher is a choice), show nothing;
 *   a language is remembered           → show nothing; the root opens the remembered language (replace), other pages stay;
 *   a direct visit to /ru or /en       → that link is the choice: remember L, show nothing;
 *   the root with a query / fragment, from another site, or a crawler → show nothing, remember nothing;
 *   the first direct visit to the root → the entrance (variant A — the OWNER's preference).
 */
const KEY = "megaparc:lang";
const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const BOTS = "bot|crawl|spider|slurp|bingpreview|facebookexternalhit|embedly|whatsapp|telegram";

const copy = {
  title: "Alegeți limba · Выберите язык · Choose your language",
  langs: "Limba · Язык · Language",
  close: "Închide · Закрыть · Close",
};

export function LanguageEntry({ locale }: { locale: SiteLocale }) {
  if (isProductionEdition) return null;
  const script = `(function(){try{var k=${JSON.stringify(KEY)},L=${JSON.stringify(locale)},B=${JSON.stringify(base)},d=document.documentElement,w=location,s=null,r=document.referrer,q=/[?&]entry=(a|b|reset)(?:&|$)/.exec(w.search),f=q&&q[1],put=function(v){try{localStorage.setItem(k,v)}catch(e){}};try{s=localStorage.getItem(k)}catch(e){}if(f==="reset"){try{localStorage.removeItem(k)}catch(e){}s=null;f="a"}if(f){if(L==="ro")d.setAttribute("data-entry",f==="b"?"direct":"entrance");return}if(r&&r.indexOf(w.origin+B+"/")===0){put(L);return}if(s){if(L==="ro"&&s!=="ro"&&!w.search&&!w.hash&&(s==="ru"||s==="en")){d.setAttribute("data-entry","redirect");w.replace(B+"/"+s+"/")}return}if(L!=="ro"){put(L);return}if(w.search||w.hash||r||new RegExp(${JSON.stringify(BOTS)},"i").test(navigator.userAgent))return;d.setAttribute("data-entry","entrance")}catch(e){}})()`;
  const href = (l: SiteLocale) => `${base}${localePath(l, "/")}`.replace(/\/?$/, "/");
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: script }} />
      {locale === "ro" ? (
        <div className="le" id="language-entry" role="dialog" aria-modal="true" aria-labelledby="language-entry-title" tabIndex={-1} data-key={KEY}>
          <div className="le__stage">
            {/* the approved logo for a dark ground, with its slogan — the approved vector file, never typed or redrawn */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="le__logo" src={publicAsset("/brand/megaparc-logo-on-dark.svg")} alt="Megaparc — We build the Future" lang="en" width={1121} height={319} decoding="async" />
            {/* variant B: the compact approved logo (the header's file), white on the dark band */}
            <span className="le__mark" aria-hidden="true" style={{ "--brand-logo": `url("${publicAsset("/brand/megaparc-logo-compact.svg")}")` } as CSSProperties} />
            <i className="le__rule" aria-hidden="true" />
            <h2 className="le__title" id="language-entry-title">{copy.title}</h2>
            <nav className="le__langs" aria-label={copy.langs}>
              {locales.map((l) => (
                <a key={l} className="le__lang" href={href(l)} hrefLang={l} lang={l} data-lang={l}>
                  {brand.languageNames[l]}
                </a>
              ))}
            </nav>
            <button type="button" className="le__close" aria-label={copy.close} data-close>
              <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" focusable="false"><path d="M5 5l14 14M19 5L5 19" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
            </button>
          </div>
          <LanguageEntryControls storageKey={KEY} current={locale} />
        </div>
      ) : null}
    </>
  );
}
