"use client";

import { useRef, useState, type KeyboardEvent, type ReactNode } from "react";

/**
 * PLAN VIEWER — the level switch of the plans scene. Since the OWNER plan
 * replacement pass (2026-11-09) each level shows the authoritative drawing
 * (a crop of the OWNER's architectural PDF, lease-agreement annex, 1:100) and
 * each switch is a KPI card: the level, its mark, the total and the commercial
 * area. `extra` holds the KPIs that do not switch (commercial total, terrace).
 * WAI-ARIA tabs; drawings, cards and side panels are rendered on the server.
 */
export function PlanViewer({ tabs, views, sides, label, extra }: { tabs: { key: string; label: string; body?: ReactNode }[]; views: ReactNode[]; sides: ReactNode[]; label: string; extra?: ReactNode }) {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  const onKey = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const last = tabs.length - 1;
    const forward = event.key === "ArrowRight" || event.key === "ArrowDown";
    const back = event.key === "ArrowLeft" || event.key === "ArrowUp";
    const next = forward ? (index === last ? 0 : index + 1) : back ? (index === 0 ? last : index - 1) : null;
    if (next === null) return;
    event.preventDefault();
    setActive(next);
    refs.current[next]?.focus();
  };

  return (
    <div className="lg-planview">
      <div className="lg-planview__tabs" role="tablist" aria-label={label}>
        {tabs.map((tab, index) => (
          <button
            key={tab.key}
            ref={(element) => {
              refs.current[index] = element;
            }}
            type="button"
            role="tab"
            id={`lg-level-${tab.key}`}
            aria-controls={`lg-levelpane-${tab.key}`}
            aria-selected={index === active}
            tabIndex={index === active ? 0 : -1}
            className={`lg-planview__tab${tab.body ? " lg-card lg-kpi" : ""}${index === active ? " is-active" : ""}`}
            onClick={() => setActive(index)}
            onKeyDown={(event) => onKey(event, index)}
          >
            {tab.body ?? tab.label}
          </button>
        ))}
      </div>
      {extra ? <div className="lg-planview__extra">{extra}</div> : null}
      <div className="lg-planview__grid">
        <div className="lg-planview__stage">
          {views.map((view, index) => (
            <div key={tabs[index].key} className={`lg-planview__view is-${tabs[index].key}${index === active ? " is-on" : ""}`} aria-hidden={index !== active}>
              {view}
            </div>
          ))}
        </div>
        <div className="lg-planview__side">
          {sides.map((side, index) => (
            <div key={tabs[index].key} role="tabpanel" id={`lg-levelpane-${tabs[index].key}`} aria-labelledby={`lg-level-${tabs[index].key}`} hidden={index !== active}>
              {side}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
