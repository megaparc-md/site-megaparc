"use client";

import { useEffect, useRef, useState, type KeyboardEvent, type ReactNode, type SyntheticEvent } from "react";

/**
 * PLAN VIEWER — the level switch of the plans scene: Уровень 1 · Уровень 2 ·
 * Общая схема. The plans share one scale, so they crossfade in place. A zone
 * and its legend line light up together on hover, focus or tap (any element
 * carrying data-zone). Plans and legends are rendered on the server.
 */
export function PlanViewer({ tabs, views, sides, label }: { tabs: { key: string; label: string }[]; views: ReactNode[]; sides: ReactNode[]; label: string }) {
  const [active, setActive] = useState(0);
  const [hot, setHot] = useState<string | null>(null);
  const root = useRef<HTMLDivElement>(null);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    const node = root.current;
    if (!node) return;
    node.querySelectorAll(".is-hot").forEach((element) => element.classList.remove("is-hot"));
    if (hot) node.querySelectorAll(`[data-zone="${hot}"]`).forEach((element) => element.classList.add("is-hot"));
  }, [hot, active]);

  const zoneOf = (event: SyntheticEvent) => (event.target as Element).closest?.("[data-zone]")?.getAttribute("data-zone") ?? null;
  const onKey = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const last = tabs.length - 1;
    const next = event.key === "ArrowRight" ? (index === last ? 0 : index + 1) : event.key === "ArrowLeft" ? (index === 0 ? last : index - 1) : null;
    if (next === null) return;
    event.preventDefault();
    setActive(next);
    refs.current[next]?.focus();
  };

  return (
    <div
      className="lg-planview"
      ref={root}
      onMouseOver={(event) => setHot(zoneOf(event))}
      onMouseLeave={() => setHot(null)}
      onFocus={(event) => setHot(zoneOf(event))}
      onBlur={() => setHot(null)}
      onClick={(event) => {
        const zone = zoneOf(event);
        if (zone) setHot(zone);
      }}
    >
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
            className={`lg-planview__tab${index === active ? " is-active" : ""}`}
            onClick={() => setActive(index)}
            onKeyDown={(event) => onKey(event, index)}
          >
            {tab.label}
          </button>
        ))}
      </div>
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
