"use client";

import { useEffect } from "react";

/**
 * The behaviour of the language entry (OWNER «PREMIUM LANGUAGE ENTRY EXPERIENCE», 2026-11-12 — preview concept): the choice is stored,
 * the layer closes; keyboard and touch work alike. The layer itself is shown by the inline script before the first paint — this
 * component only wires the controls once the page is interactive, so nothing depends on it for the first render:
 *   · a language link stores the choice and navigates (a plain link — it works even before hydration); choosing the current
 *     language closes the layer without a navigation;
 *   · the close button and Escape keep the current language and close;
 *   · cinema (a modal welcome screen): focus moves to the first language, Tab stays inside, the page behind does not scroll;
 *   · overlay (a compact panel): no focus is taken and nothing is trapped — the page stays fully usable behind it.
 */
export function LanguageEntryControls({ storageKey, current }: { storageKey: string; current: string }) {
  useEffect(() => {
    const root = document.documentElement;
    const layer = document.getElementById("language-entry");
    const variant = root.getAttribute("data-entry");
    if (!layer || !variant) return;
    const remember = (lang: string) => { try { localStorage.setItem(storageKey, lang); } catch { /* storage blocked: the choice simply is not remembered */ } };
    const close = () => { root.removeAttribute("data-entry"); };
    const links = [...layer.querySelectorAll<HTMLAnchorElement>("[data-lang]")];
    const onLink = (event: MouseEvent) => {
      const lang = (event.currentTarget as HTMLAnchorElement).dataset.lang ?? current;
      remember(lang);
      if (lang === current) { event.preventDefault(); close(); }
    };
    links.forEach((link) => link.addEventListener("click", onLink));
    const closer = layer.querySelector<HTMLButtonElement>("[data-close]");
    const onClose = () => { remember(current); close(); };
    closer?.addEventListener("click", onClose);
    const focusable = [...links, ...(closer ? [closer] : [])];
    const onKey = (event: KeyboardEvent) => {
      if (!root.hasAttribute("data-entry")) return;
      if (event.key === "Escape") { onClose(); return; }
      if (event.key === "Tab" && variant === "cinema" && focusable.length) {
        const first = focusable[0], last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
        else if (!layer.contains(document.activeElement)) { event.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener("keydown", onKey);
    if (variant === "cinema") links[0]?.focus({ preventScroll: true });
    return () => {
      links.forEach((link) => link.removeEventListener("click", onLink));
      closer?.removeEventListener("click", onClose);
      document.removeEventListener("keydown", onKey);
    };
  }, [storageKey, current]);
  return null;
}
