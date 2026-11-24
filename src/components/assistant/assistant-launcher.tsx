"use client";

import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState, type ComponentType } from "react";
import { GOTO_KEY, openAnchor } from "@/components/assistant/anchors";
import type { AssistantPanelProps } from "@/components/assistant/assistant-panel";
import type { AssistantCopy } from "@/components/assistant/copy";
import { contextOf } from "@/components/assistant/engine";
import type { AssistantData } from "@/components/assistant/types";
import { neutralPath, type Localized } from "@/lib/site-data";
import { track } from "@/lib/track";

/**
 * MEGAPARC COMMERCIAL ASSISTANT — the launcher (OWNER «INTELLIGENT COMMERCIAL ASSISTANT», 2026-11-24).
 *
 * The only part of the assistant every page carries: one button in the lower right corner. The panel, the scenarios and
 * their copy load on the first opening (for the page's language only).
 *
 * «Не перекрывать калькуляторы, меню и основные CTA» is behaviour, not a z-index:
 *   — the button rises above whatever is fixed to the bottom edge (the phone viewing bar, the decision bar, the preview mark);
 *   — it never lies over a form control, a calculator, a table or a button-like action of the page: it takes the nearest
 *     free place just above the corner, and steps aside altogether only when there is none;
 *   — it is absent while the page owns the screen: the mobile menu, a drawer or a dialog, the language entrance.
 * Nothing of this depends on a page's markup beyond those generic selectors, so a new calculator is protected by default.
 */

const label: Localized = { ro: "Asistent", ru: "Помощник", en: "Assistant" };
const openLabel: Localized = { ro: "Deschideți asistentul MEGAPARC", ru: "Открыть помощника MEGAPARC", en: "Open the MEGAPARC assistant" };

/** fixed to the bottom edge of the viewport: the button sits above them */
const BARS = ".lg-sticky, .lp-bar, .xp-preview, [data-assistant-clear]";
/** places of the button, in px above its corner: the first free one is taken */
const SLOTS = [0, 76, 152, 228];
/** clearance kept between the button and protected content, px */
const CLEAR = 6;
/** bars that slide in by a transform when they get the class «is-on» (their box is off screen until the slide ends) */
const SLIDING = ".lg-sticky, .lp-bar";
/** content the button never lies over */
const PROTECTED = 'input, select, textarea, button, label, summary, form, table, [role="button"], [role="slider"], [role="tab"], [role="radio"], [role="switch"], [contenteditable="true"], .btn, [class*="btn"], [class*="cta"], [class*="calc"], [data-assistant-avoid]';

type Loaded = { Panel: ComponentType<AssistantPanelProps>; copy: AssistantCopy };

export function AssistantLauncher({ data }: { data: AssistantData }) {
  const pathname = usePathname();
  const { path } = neutralPath(pathname ?? "/");
  const context = contextOf(path, data);
  const [open, setOpen] = useState(false);
  const [loaded, setLoaded] = useState<Loaded | null>(null);
  const [aside, setAside] = useState(false);
  const [lift, setLift] = useState(0);
  const [slot, setSlot] = useState(0);
  const button = useRef<HTMLButtonElement>(null);
  const loading = useRef(false);
  /** the place the button holds now (px above the corner; null = aside) — kept across re-runs of the watcher */
  const place = useRef<number | null>(0);

  const show = useCallback(() => {
    track("assistant_open", { context: context.key });
    if (loaded) {
      setOpen(true);
      return;
    }
    if (loading.current) return;
    loading.current = true;
    Promise.all([import("@/components/assistant/assistant-panel"), import("@/components/assistant/copy").then((m) => m.loadCopy(data.locale))])
      .then(([panel, copy]) => {
        setLoaded({ Panel: panel.AssistantPanel, copy });
        setOpen(true);
      })
      .finally(() => {
        loading.current = false;
      });
  }, [context.key, data.locale, loaded]);

  const close = useCallback((refocus = true) => {
    setOpen(false);
    if (refocus) requestAnimationFrame(() => button.current?.focus({ preventScroll: true }));
  }, []);

  /* an action of the assistant that led to another page: open its section or drawer once the page is there */
  useEffect(() => {
    let raw: string | null = null;
    try {
      raw = window.sessionStorage.getItem(GOTO_KEY);
    } catch {
      return;
    }
    if (!raw) return;
    let target: { path: string; hash: string[] } | null = null;
    try {
      target = JSON.parse(raw) as { path: string; hash: string[] };
    } catch {
      target = null;
    }
    const forget = () => {
      try {
        window.sessionStorage.removeItem(GOTO_KEY);
      } catch {
        /* storage blocked: nothing to forget */
      }
    };
    if (!target || target.path !== path) {
      // another page was reached instead (a manual navigation): the request is stale
      if (target && target.path !== path) forget();
      return;
    }
    let tries = 0;
    const timer = window.setInterval(() => {
      tries += 1;
      if (openAnchor(target!.hash) || tries > 12) {
        window.clearInterval(timer);
        forget();
      }
    }, 250);
    return () => window.clearInterval(timer);
  }, [path]);

  /* keep out of the way of the page */
  useEffect(() => {
    const el = button.current;
    if (!el || open) return;
    let frame = 0;
    let timer = 0;
    /** the slot on screen and the slot wanted: 0 = the corner, n = n px above it, null = no free place */
    let shown: number | null = place.current;
    let wanted: number | null = shown;
    const measure = () => {
      frame = 0;
      const html = document.documentElement;
      const vh = window.innerHeight;
      const vw = html.clientWidth;
      const owned = document.body.classList.contains("menu-open") || html.hasAttribute("data-entry") || html.classList.contains("lg-drawer-open") || Boolean(document.querySelector("dialog[open]"));
      const width = el.offsetWidth;
      const height = el.offsetHeight;
      const margin = vw < 640 ? 16 : 24;
      const right = vw - margin;
      // above everything fixed near the bottom edge — the bars may be stacked (the preview mark above the phone viewing bar),
      // so the place is raised until the button's box is clear of each of them
      const bars = Array.from(document.querySelectorAll<HTMLElement>(BARS))
        .map((bar) => {
          const r = bar.getBoundingClientRect();
          // a bar that slides in from under the edge is counted where it will stand, from the moment it is switched on —
          // the button is out of its way before the bar arrives, not after
          if (bar.matches(SLIDING)) return bar.classList.contains("is-on") ? { left: r.left, right: r.right, top: vh - bar.offsetHeight, bottom: vh, width: r.width, height: bar.offsetHeight } : null;
          return { left: r.left, right: r.right, top: r.top, bottom: r.bottom, width: r.width, height: r.height };
        })
        .filter((r): r is NonNullable<typeof r> => r !== null && r.width > 0 && r.height > 0 && r.top < vh && r.bottom > vh * 0.6 && r.right > right - width);
      let up = 0;
      for (let pass = 0; pass <= bars.length; pass += 1) {
        const bottom = vh - margin - up;
        const blocking = bars.filter((r) => r.top < bottom + 8 && r.bottom > bottom - height - 8);
        if (!blocking.length) break;
        up = vh - Math.min(...blocking.map((r) => r.top)) - margin + 8;
      }
      up = Math.max(0, up);
      setLift((current) => (Math.abs(current - up) < 1 ? current : Math.round(up)));
      const covered = (slot: number) => {
        const bottom = vh - margin - up - slot;
        if (bottom - height < 96) return true; // never up into the header
        // a grid across the box and a clearance around it (a point every ≤ 16 × 12 px): a small control, or the edge of an
        // action that the box would only graze, is seen too
        const x0 = right - width - CLEAR;
        const x1 = Math.min(vw - 1, right + CLEAR);
        const y0 = bottom - height - CLEAR;
        const y1 = Math.min(vh - 1, bottom + CLEAR);
        const columns = Math.max(2, Math.ceil((x1 - x0) / 16));
        const rows = Math.max(2, Math.ceil((y1 - y0) / 12));
        const points: [number, number][] = [];
        for (let i = 0; i <= columns; i += 1) for (let j = 0; j <= rows; j += 1) points.push([x0 + (i * (x1 - x0)) / columns, y0 + (j * (y1 - y0)) / rows]);
        return points.some(([x, y]) =>
          document.elementsFromPoint(x, y).some((node) => {
            if (node === html || node === document.body || node.closest(".mca") || node.closest(BARS)) return false;
            return Boolean(node.closest(PROTECTED));
          }),
        );
      };
      // the corner first; if the page has an action or a control there, the nearest free place above it; otherwise aside
      const free = owned ? undefined : SLOTS.find((slot) => !covered(slot));
      const best = free === undefined ? null : free;
      if (best === wanted) return;
      wanted = best;
      window.clearTimeout(timer);
      if (best === shown) {
        // back to the place it already holds — or still no free place at all (then it stays aside)
        setAside(best === null);
        return;
      }
      // a change of place is a short fade, never a slide across the page
      setAside(true);
      if (best === null) {
        shown = place.current = null;
        return;
      }
      timer = window.setTimeout(() => {
        shown = place.current = best;
        setSlot(best);
        setAside(false);
      }, 200);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };
    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    const observer = new MutationObserver(schedule);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class", "data-entry"] });
    observer.observe(document.body, { attributes: true, attributeFilter: ["class"] });
    // a bar switched on or off: measure in the same frame, not at the next tick
    document.querySelectorAll(BARS).forEach((bar) => observer.observe(bar, { attributes: true, attributeFilter: ["class"] }));
    // content that moves without a scroll (a block revealed, a format switched, a disclosure opened, a bar sliding in)
    const tick = window.setInterval(schedule, 250);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.clearTimeout(timer);
      window.clearInterval(tick);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      observer.disconnect();
    };
  }, [open, path]);

  const Panel = loaded?.Panel;
  return (
    <div className="mca" data-open={open ? "" : undefined} style={{ "--mca-lift": `${lift}px`, "--mca-slot": `${slot}px` } as React.CSSProperties}>
      <button ref={button} type="button" className="mca-launch" aria-label={openLabel[data.locale]} aria-haspopup="dialog" aria-expanded={open} data-aside={aside || open ? "" : undefined} tabIndex={aside || open ? -1 : 0} onClick={show}>
        <svg className="mca-launch__icon" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false">
          <path d="M4.5 5.5h15v10.25h-8.4L7 19.25v-3.5H4.5z" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
          <path d="M8.25 9.4h7.5M8.25 12.1h4.6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
        <span className="mca-launch__label">{label[data.locale]}</span>
      </button>
      {open && Panel && loaded ? <Panel data={data} copy={loaded.copy} context={context} onClose={close} /> : null}
    </div>
  );
}
