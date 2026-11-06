"use client";

import { useCallback, useEffect, useRef, type ReactNode } from "react";

/**
 * PREMIUM DRAWER (OWNER "FINAL VIEWING CONVERSION PASS" + "TENANT ECONOMICS &
 * DECISION TOOL", 2026-11-06) — the detail level of the page lives here, out of
 * the reading flow: technical characteristics, readiness, the economics tool.
 * A native modal <dialog>: focus stays inside, Esc and the backdrop close it,
 * focus returns to the trigger. A side panel on desktop, a full-height sheet on
 * phones. Opened by any element carrying data-drawer="<id>" or by the #<id> hash.
 * Content is rendered on the server and passed in.
 */
export function LgDrawer({ id, title, kicker, closeLabel, wide = false, children }: { id: string; title: string; kicker?: string; closeLabel: string; wide?: boolean; children: ReactNode }) {
  const ref = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLElement | null>(null);

  const open = useCallback((from: HTMLElement | null) => {
    const dialog = ref.current;
    if (!dialog || dialog.open) return;
    trigger.current = from;
    dialog.showModal();
    document.documentElement.classList.add("lg-drawer-open");
    dialog.querySelector<HTMLElement>(".lg-drawer__body")?.scrollTo({ top: 0 });
  }, []);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    const onClick = (event: MouseEvent) => {
      const link = (event.target as Element | null)?.closest?.(`[data-drawer="${id}"]`) as HTMLElement | null;
      if (!link) return;
      event.preventDefault();
      open(link);
    };
    const onHash = () => {
      if (window.location.hash === `#${id}`) open(null);
    };
    let leaving = false;
    const onClose = () => {
      document.documentElement.classList.remove("lg-drawer-open");
      if (window.location.hash === `#${id}`) history.replaceState(null, "", window.location.pathname + window.location.search);
      // back to the trigger — unless a link inside the drawer is taking the visitor elsewhere on the page
      if (!leaving) trigger.current?.focus?.({ preventScroll: true });
      leaving = false;
    };
    // a click on the backdrop (the dialog box itself, outside the panel) closes it; so does an in-page link inside it
    const onBackdrop = (event: MouseEvent) => {
      if (event.target === dialog) {
        dialog.close();
        return;
      }
      const link = (event.target as Element | null)?.closest?.('a[href^="#"]');
      if (link && !link.hasAttribute("data-drawer")) {
        leaving = true;
        dialog.close();
      }
    };
    document.addEventListener("click", onClick);
    window.addEventListener("hashchange", onHash);
    dialog.addEventListener("close", onClose);
    dialog.addEventListener("click", onBackdrop);
    onHash();
    return () => {
      document.removeEventListener("click", onClick);
      window.removeEventListener("hashchange", onHash);
      dialog.removeEventListener("close", onClose);
      dialog.removeEventListener("click", onBackdrop);
    };
  }, [id, open]);

  return (
    <dialog ref={ref} id={`lg-drawer-${id}`} className={`lg-drawer${wide ? " is-wide" : ""}`} aria-labelledby={`lg-drawer-${id}-title`}>
      <div className="lg-drawer__panel">
        <header className="lg-drawer__head">
          <div>
            {kicker ? <p className="pm-kicker">{kicker}</p> : null}
            <h2 className="lg-drawer__title" id={`lg-drawer-${id}-title`}>{title}</h2>
          </div>
          <button type="button" className="lg-drawer__close" onClick={() => ref.current?.close()}>
            <span className="sr-only">{closeLabel}</span>
            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M5 5 19 19M19 5 5 19" /></svg>
          </button>
        </header>
        <div className="lg-drawer__body">{children}</div>
      </div>
    </dialog>
  );
}
