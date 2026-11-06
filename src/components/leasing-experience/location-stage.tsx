"use client";

import { useRef, useState, type KeyboardEvent, type ReactNode } from "react";

/**
 * LOCATION STAGE — the visual centre of «Локация в движении»: two views of the
 * same address (the surroundings map · how the property is seen from the
 * boulevard) and, under the map, quiet category filters that bring one layer
 * forward (education, transport, groceries, pharmacies, services, main roads).
 * Views are rendered on the server; this component only chooses.
 */
export function LocationStage({ tabs, views, filters, label, filterLabel }: { tabs: { key: string; label: string }[]; views: ReactNode[]; filters: { key: string; label: string }[]; label: string; filterLabel: string }) {
  const [active, setActive] = useState(0);
  const [cat, setCat] = useState<string | null>(null);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  const onKey = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const last = tabs.length - 1;
    const next = event.key === "ArrowRight" ? (index === last ? 0 : index + 1) : event.key === "ArrowLeft" ? (index === 0 ? last : index - 1) : null;
    if (next === null) return;
    event.preventDefault();
    setActive(next);
    refs.current[next]?.focus();
  };

  return (
    <div className="lg-stage" data-cat={cat ?? undefined}>
      {tabs.length > 1 ? (
        <div className="lg-stage__tabs" role="tablist" aria-label={label}>
          {tabs.map((tab, index) => (
            <button
              key={tab.key}
              ref={(element) => {
                refs.current[index] = element;
              }}
              type="button"
              role="tab"
              id={`lg-stage-${tab.key}`}
              aria-controls={`lg-stagepane-${tab.key}`}
              aria-selected={index === active}
              tabIndex={index === active ? 0 : -1}
              className={`lg-stage__tab${index === active ? " is-active" : ""}`}
              onClick={() => setActive(index)}
              onKeyDown={(event) => onKey(event, index)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      ) : null}
      {views.map((view, index) => (
        <div key={tabs[index].key} role={tabs.length > 1 ? "tabpanel" : undefined} id={`lg-stagepane-${tabs[index].key}`} aria-labelledby={tabs.length > 1 ? `lg-stage-${tabs[index].key}` : undefined} hidden={index !== active} className="lg-stage__view">
          {view}
          {index === 0 && filters.length ? (
            <div className="lg-stage__filters" role="group" aria-label={filterLabel}>
              {filters.map((filter) => (
                <button key={filter.key} type="button" className={`lg-stage__filter is-${filter.key}${cat === filter.key ? " is-on" : ""}`} aria-pressed={cat === filter.key} onClick={() => setCat(cat === filter.key ? null : filter.key)}>
                  <i aria-hidden="true" />
                  {filter.label}
                </button>
              ))}
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
}
