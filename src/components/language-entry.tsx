import { brand, localePath, locales, publicAsset, type SiteLocale } from "@/lib/site-data";
import "@/app/language-entry.css";

/**
 * PREMIUM BRAND ENTRANCE — variant A (OWNER «PREMIUM BRAND ENTRANCE + CORPORATE ARC REFINEMENT», 2026-11-20; OWNER FINAL GO «PREMIUM
 * ENTRANCE A + CORPORATE ARCS A»; OWNER RESPONSE TO CODEX AUDIT, 2026-11-20). The first visit to the bare root address opens on a quiet
 * dark screen: the approved logo for a dark ground (with its slogan) and the three languages. The choice is remembered; a later visit to
 * the bare root opens the chosen language at once. Variant B and the review switches of the preview were not chosen — not in the code.
 *
 * The whole behaviour is ONE inline script (`entranceGate` below, serialised into the page) that runs before the first paint — it does
 * not wait for React or for any Next.js chunk. If the chunks fail to load, the entrance still works (choice, keyboard, Escape, inert);
 * without JavaScript at all nothing happens and the root opens the Romanian site as before (the layer is hidden by CSS by default).
 *
 * The rules (OWNER decision on the referrer, 2026-11-20 — an empty `document.referrer` cannot be told apart from a direct visit):
 *   · first visit to the bare root (no query string, no fragment, no remembered language, no referrer) → the entrance. A link from
 *     another site that sends no referrer (an app, many mail clients, a site with a no-referrer policy) looks exactly like this — a new
 *     visitor may then see the entrance; that is accepted;
 *   · a remembered language + the bare root without a referrer → that language at once (`location.replace` — no history entry); the page
 *     stays unpainted meanwhile and is shown again after 4 s should the navigation not happen;
 *   · the root with a query string or a fragment (campaigns, QR codes, anchors) → no entrance and no redirect, ever;
 *   · an external referrer → the page as linked: no entrance, no redirect;
 *   · a page of this site as the referrer (the header language switcher) → that language is remembered;
 *   · a direct visit to /ru/ or /en/ → that address is the choice and is remembered;
 *   · every other page (properties, leasing, QR targets …) never carries the script — they open as linked.
 * No guessing of the source: no user-agent test, no fingerprinting. Crawlers fetch the same HTML as before (content, canonical and
 * hreflang in the server HTML; the layer hidden by default CSS); a crawler that renders JavaScript has no stored language and is never
 * redirected.
 */
const KEY = "megaparc:lang";
const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const copy = {
  title: "Alegeți limba · Выберите язык · Choose your language",
  langs: "Limba · Язык · Language",
};

/**
 * The inline script. It is serialised with `Function.prototype.toString`, so it may use only its parameters and browser globals —
 * never a module-scope name — and only syntax a browser runs as written (no spread, no `for … of`, nothing that needs a helper).
 */
function entranceGate(key: string, current: string, basePath: string) {
  const d = document.documentElement;
  const w = window.location;
  const referrer = document.referrer;
  const read = () => { try { return window.localStorage.getItem(key); } catch { return null; } };
  const remember = (lang: string) => { try { window.localStorage.setItem(key, lang); } catch { /* storage blocked: the choice is simply not remembered */ } };
  const stored = read();
  // a page of this site as the referrer: the visitor chose this language (the header language switcher)
  if (referrer && referrer.indexOf(w.origin + basePath + "/") === 0) { remember(current); return; }
  if (stored) {
    // a remembered language: only the bare root without a referrer is sent on; every other address stays as linked
    if (current === "ro" && (stored === "ru" || stored === "en") && !w.search && !w.hash && !referrer) {
      d.setAttribute("data-entry", "redirect");
      window.setTimeout(() => d.removeAttribute("data-entry"), 4000);
      w.replace(basePath + "/" + stored + "/");
    }
    return;
  }
  // a direct visit to /ru/ or /en/: that address is the choice
  if (current !== "ro") { remember(current); return; }
  // the root with a query string, a fragment or an external referrer: the page as linked
  if (w.search || w.hash || referrer) return;
  // the first visit to the bare root: the entrance — only when its stylesheet is there (without it the layer would be plain content
  // in the page and must not trap anything)
  d.setAttribute("data-entry", "entrance");
  if (window.getComputedStyle(d).overflowY !== "hidden") { d.removeAttribute("data-entry"); return; }

  const isOpen = () => d.getAttribute("data-entry") === "entrance";
  const layer = () => document.getElementById("language-entry");
  const links = () => { const l = layer(); return l ? Array.prototype.slice.call(l.querySelectorAll("a[data-lang]")) as HTMLAnchorElement[] : []; };
  const inerted: Element[] = [];
  const clearInert = () => { while (inerted.length) (inerted.pop() as Element).removeAttribute("inert"); };
  const close = () => {
    if (!isOpen()) return;
    clearInert();
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { d.removeAttribute("data-entry"); return; }
    d.setAttribute("data-entry-leaving", "");
    window.setTimeout(() => { d.removeAttribute("data-entry"); d.removeAttribute("data-entry-leaving"); }, 380);
  };
  // a language: remembered; the root's own language closes the layer, another one opens with replace (the entrance leaves no history
  // entry); a modified click (new tab, new window) is left to the browser. Plain links underneath — they work even before this runs.
  document.addEventListener("click", (event) => {
    if (!isOpen()) return;
    const target = event.target as Element | null;
    const link = target && target.closest ? target.closest("#language-entry a[data-lang]") as HTMLAnchorElement | null : null;
    if (!link) return;
    const lang = link.getAttribute("data-lang") || current;
    remember(lang);
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    if (lang === current) close();
    else w.replace(link.href);
  });
  // the keyboard: Escape continues in the root's language; Tab and Shift+Tab move among the three languages and nowhere else (the dialog
  // moves the focus itself — Safari's Tab skips links by default)
  document.addEventListener("keydown", (event) => {
    if (!isOpen()) return;
    if (event.key === "Escape") { remember(current); close(); return; }
    if (event.key !== "Tab" || event.ctrlKey || event.metaKey) return;
    const all = links();
    if (!all.length) return;
    event.preventDefault();
    const at = all.indexOf(document.activeElement as HTMLAnchorElement);
    const next = at < 0 ? (event.shiftKey ? all.length - 1 : 0) : (at + (event.shiftKey ? all.length - 1 : 1)) % all.length;
    all[next].focus();
  });
  // once the document is parsed: everything outside the layer is inert (keyboard and screen readers stay in the dialog), the focus moves
  // to the dialog
  const setup = () => {
    const l = layer();
    if (!l || !isOpen()) return;
    for (let node: Element = l; node !== document.body && node.parentElement; node = node.parentElement) {
      const siblings = node.parentElement.children;
      for (let i = 0; i < siblings.length; i++) {
        const sibling = siblings[i];
        if (sibling !== node && sibling.tagName !== "SCRIPT" && sibling.tagName !== "STYLE" && !sibling.hasAttribute("inert")) { sibling.setAttribute("inert", ""); inerted.push(sibling); }
      }
    }
    l.focus({ preventScroll: true });
  };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", setup);
  else setup();
  // a page restored from the back / forward cache: the stored choice decides again, so an open layer never comes back
  window.addEventListener("pageshow", (event) => {
    if (!event.persisted || !d.hasAttribute("data-entry")) return;
    const now = read();
    if (now && now !== current && (now === "ru" || now === "en")) w.replace(basePath + "/" + now + "/");
    else if (now) { clearInert(); d.removeAttribute("data-entry"); d.removeAttribute("data-entry-leaving"); }
  });
}

export function LanguageEntry({ locale }: { locale: SiteLocale }) {
  const script = `(${entranceGate.toString()})(${JSON.stringify(KEY)},${JSON.stringify(locale)},${JSON.stringify(base)})`;
  const href = (l: SiteLocale) => `${base}${localePath(l, "/")}`.replace(/\/?$/, "/");
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: script }} />
      {locale === "ro" ? (
        <div className="le" id="language-entry" role="dialog" aria-modal="true" aria-labelledby="language-entry-title" tabIndex={-1}>
          <div className="le__stage">
            {/* the approved logo for a dark ground, with its slogan — the approved vector file (the footer's), never typed or redrawn */}
            {/* eslint-disable-next-line @next/next/no-img-element -- a static vector logo, no optimisation to gain */}
            <img className="le__logo" src={publicAsset("/brand/megaparc-logo-on-dark.svg")} alt="Megaparc — We build the Future" lang="en" width={1121} height={319} decoding="async" />
            <i className="le__rule" aria-hidden="true" />
            <h2 className="le__title" id="language-entry-title">{copy.title}</h2>
            <nav className="le__langs" aria-label={copy.langs}>
              {locales.map((l) => (
                <a key={l} className="le__lang" href={href(l)} hrefLang={l} lang={l} data-lang={l}>
                  {brand.languageNames[l]}
                </a>
              ))}
            </nav>
          </div>
        </div>
      ) : null}
    </>
  );
}
