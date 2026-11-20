"use client";

import { useEffect } from "react";

/**
 * The behaviour of the brand entrance (OWNER «PREMIUM BRAND ENTRANCE», 2026-11-20 — preview). The layer itself is shown by the inline
 * script before the first paint; this component wires the controls once the page is interactive, so nothing depends on it for the
 * first render — the three languages are plain links and work before hydration and without it:
 *   · a language link stores the choice; another language opens with `location.replace` (the entrance leaves no entry in the browser
 *     history — Back returns to where the visitor came from, never to the entrance); the root's own language fades the layer away
 *     without a navigation; a modified click (new tab, new window) is left to the browser;
 *   · A «entrance» (a modal first screen): focus moves to the layer; Tab and Shift+Tab move among the three languages and nowhere
 *     else — the dialog moves the focus itself, because Safari's Tab skips links by default and would otherwise leave for a button of
 *     the page behind; everything outside the layer is `inert` while it is open (keyboard and screen readers alike); the page behind
 *     does not scroll; Escape continues in the root's language;
 *   · B «direct» (a slim band): no focus is taken and nothing is trapped — the page stays fully usable; the close button and Escape
 *     keep the current language;
 *   · a page restored from the back / forward cache re-reads the stored choice, so a layer that was open never comes back.
 */
export function LanguageEntryControls({ storageKey, current }: { storageKey: string; current: string }) {
  useEffect(() => {
    const root = document.documentElement;
    const layer = document.getElementById("language-entry");
    if (!layer) return;
    const variant = () => root.getAttribute("data-entry");
    const remember = (lang: string) => { try { localStorage.setItem(storageKey, lang); } catch { /* storage blocked: the choice simply is not remembered */ } };
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let timer = 0;
    // A: everything outside the layer is inert while the entrance is open — the siblings of the layer and of each of its ancestors
    const inerted: Element[] = [];
    const setInert = () => {
      for (let node: Element | null = layer; node && node !== document.body && node.parentElement; node = node.parentElement) {
        for (const sibling of [...node.parentElement.children]) {
          if (sibling !== node && sibling.tagName !== "SCRIPT" && sibling.tagName !== "STYLE" && !sibling.hasAttribute("inert")) { sibling.setAttribute("inert", ""); inerted.push(sibling); }
        }
      }
    };
    const clearInert = () => { inerted.splice(0).forEach((el) => el.removeAttribute("inert")); };
    const close = () => {
      if (!variant()) return;
      clearInert();
      if (reduced) { root.removeAttribute("data-entry"); return; }
      root.setAttribute("data-entry-leaving", "");
      timer = window.setTimeout(() => { root.removeAttribute("data-entry"); root.removeAttribute("data-entry-leaving"); }, 380);
    };
    const links = [...layer.querySelectorAll<HTMLAnchorElement>("[data-lang]")];
    const onLink = (event: MouseEvent) => {
      const link = event.currentTarget as HTMLAnchorElement;
      const lang = link.dataset.lang ?? current;
      remember(lang);
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      if (lang === current) close();
      else window.location.replace(link.href);
    };
    links.forEach((link) => link.addEventListener("click", onLink));
    const closer = layer.querySelector<HTMLButtonElement>("[data-close]");
    const onClose = () => { remember(current); close(); };
    closer?.addEventListener("click", onClose);
    const onKey = (event: KeyboardEvent) => {
      const v = variant();
      if (v !== "entrance" && v !== "direct") return;
      if (event.key === "Escape") { onClose(); return; }
      if (event.key === "Tab" && v === "entrance" && links.length && !event.ctrlKey && !event.metaKey) {
        event.preventDefault();
        const at = links.indexOf(document.activeElement as HTMLAnchorElement);
        const next = at < 0 ? (event.shiftKey ? links.length - 1 : 0) : (at + (event.shiftKey ? links.length - 1 : 1)) % links.length;
        links[next].focus();
      }
    };
    document.addEventListener("keydown", onKey);
    // a page restored from the back / forward cache: the stored choice decides again
    const onShow = (event: PageTransitionEvent) => {
      if (!event.persisted || !variant()) return;
      let stored: string | null = null;
      try { stored = localStorage.getItem(storageKey); } catch { /* no storage */ }
      if (stored && stored !== current && (stored === "ru" || stored === "en")) window.location.replace(links.find((l) => l.dataset.lang === stored)?.href ?? window.location.href);
      else if (stored) { clearInert(); root.removeAttribute("data-entry"); }
    };
    window.addEventListener("pageshow", onShow);
    if (variant() === "entrance") { setInert(); layer.focus({ preventScroll: true }); }
    return () => {
      window.clearTimeout(timer);
      clearInert();
      links.forEach((link) => link.removeEventListener("click", onLink));
      closer?.removeEventListener("click", onClose);
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("pageshow", onShow);
    };
  }, [storageKey, current]);
  return null;
}
