"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type ReactNode } from "react";

/**
 * DECISION PANEL — the commercial tool of the page (OWNER compact brief §5):
 * one block, six answers. The tabs switch the content and crossfade the media;
 * nothing grows into new long sections. Content and media are rendered on the
 * server (data only); this component only chooses which one is visible.
 * Keyboard: arrows / Home / End move between tabs (WAI-ARIA tabs pattern).
 * Opened from the decision navigation via the "lg:tab" event or a #tab hash.
 */
export function DecisionPanel({ tabs, panes, medias, label }: { tabs: { key: string; label: string }[]; panes: ReactNode[]; medias: ReactNode[]; label: string }) {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  const select = useCallback(
    (index: number, focus = false) => {
      setActive(index);
      if (focus) refs.current[index]?.focus();
      window.dispatchEvent(new CustomEvent("lg:tab-changed", { detail: tabs[index].key }));
    },
    [tabs],
  );

  useEffect(() => {
    const byKey = (key: string) => tabs.findIndex((tab) => tab.key === key);
    const fromHash = byKey(window.location.hash.slice(1));
    if (fromHash >= 0) {
      // a deep link (#location, #readiness …) opens its tab once, after hydration
      window.requestAnimationFrame(() => {
        select(fromHash);
        document.getElementById("decision")?.scrollIntoView({ block: "start" });
      });
    }
    const onTab = (event: Event) => {
      const index = byKey(String((event as CustomEvent).detail));
      if (index >= 0) select(index);
    };
    // any plain link to #readiness, #location … elsewhere on the page opens its tab
    const onHash = () => {
      const index = byKey(window.location.hash.slice(1));
      if (index < 0) return;
      select(index);
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      document.getElementById("decision")?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    };
    window.addEventListener("lg:tab", onTab);
    window.addEventListener("hashchange", onHash);
    return () => {
      window.removeEventListener("lg:tab", onTab);
      window.removeEventListener("hashchange", onHash);
    };
  }, [tabs, select]);

  const onKey = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const last = tabs.length - 1;
    const next = event.key === "ArrowRight" || event.key === "ArrowDown" ? (index === last ? 0 : index + 1) : event.key === "ArrowLeft" || event.key === "ArrowUp" ? (index === 0 ? last : index - 1) : event.key === "Home" ? 0 : event.key === "End" ? last : null;
    if (next === null) return;
    event.preventDefault();
    select(next, true);
  };

  return (
    <div className="lg-panel" style={{ "--n": tabs.length, "--i": active } as CSSProperties}>
      <div className="lg-panel__tabs" role="tablist" aria-label={label}>
        {tabs.map((tab, index) => (
          <button
            key={tab.key}
            ref={(element) => {
              refs.current[index] = element;
            }}
            type="button"
            role="tab"
            id={`lg-tab-${tab.key}`}
            aria-controls={`lg-pane-${tab.key}`}
            aria-selected={index === active}
            tabIndex={index === active ? 0 : -1}
            className={`lg-panel__tab${index === active ? " is-active" : ""}`}
            onClick={() => select(index)}
            onKeyDown={(event) => onKey(event, index)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="lg-panel__grid">
        <div className="lg-panel__media">
          {medias.map((media, index) => (
            <div key={tabs[index].key} className={`lg-panel__shot${index === active ? " is-on" : ""}`} aria-hidden={index !== active}>
              {media}
            </div>
          ))}
        </div>
        <div className="lg-panel__body">
          {panes.map((pane, index) => (
            <div key={tabs[index].key} role="tabpanel" id={`lg-pane-${tabs[index].key}`} aria-labelledby={`lg-tab-${tabs[index].key}`} hidden={index !== active} tabIndex={0} className="lg-panel__pane">
              {pane}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
