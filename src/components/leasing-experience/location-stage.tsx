"use client";

import { useRef, useState, type KeyboardEvent, type ReactNode } from "react";

/**
 * LOCATION EXPLORER (OWNER "PREMIUM CARD SYSTEM & AIR PASS", 2026-11-09, §9) —
 * «Локация в движении» as a premium interactive product: one large visual on
 * the left, a short stack of cards on the right (АДРЕС · ОКРУЖЕНИЕ · ТРАНСПОРТ ·
 * РИТМ ДНЯ — the last two only where the catchment map and the preliminary
 * model are shown). Choosing a card changes the main visual (the real aerial
 * with the confirmed marks · the surroundings map · the same map with the
 * transport layer brought forward · the rhythm of the day) and the short detail
 * under the cards — never map + aerial + POI + traffic + paragraphs at once.
 * The category filters of the map stay with the surroundings card.
 * WAI-ARIA tabs (vertical); visuals and details are rendered on the server.
 */

export type ExplorerOption = { key: string; label: string; title: string; visual: string; cat?: string; detail?: ReactNode };

export function LocationExplorer({ options, visuals, filters, label, filterLabel }: { options: ExplorerOption[]; visuals: { key: string; node: ReactNode }[]; filters: { key: string; label: string }[]; label: string; filterLabel: string }) {
  const [active, setActive] = useState(0);
  const [filter, setFilter] = useState<string | null>(null);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const option = options[active];
  const cat = option.cat ?? (option.visual === "map" ? filter : null);

  const select = (index: number, focus = false) => {
    setActive(index);
    setFilter(null);
    if (focus) refs.current[index]?.focus();
  };
  const onKey = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const last = options.length - 1;
    const forward = event.key === "ArrowDown" || event.key === "ArrowRight";
    const back = event.key === "ArrowUp" || event.key === "ArrowLeft";
    const next = forward ? (index === last ? 0 : index + 1) : back ? (index === 0 ? last : index - 1) : null;
    if (next === null) return;
    event.preventDefault();
    select(next, true);
  };

  return (
    <div className="lg-explorer lg-stage" data-cat={cat ?? undefined}>
      <div className="lg-explorer__stage">
        {visuals.map((visual) => (
          <div key={visual.key} className={`lg-explorer__view is-${visual.key}${visual.key === option.visual ? " is-on" : ""}`} aria-hidden={visual.key !== option.visual}>
            {visual.node}
          </div>
        ))}
      </div>
      <div className="lg-explorer__side">
        <div className="lg-explorer__cards" role="tablist" aria-label={label} aria-orientation="vertical">
          {options.map((item, index) => (
            <button
              key={item.key}
              ref={(element) => {
                refs.current[index] = element;
              }}
              type="button"
              role="tab"
              id={`lg-explore-${item.key}`}
              aria-controls="lg-explore-panel"
              aria-selected={index === active}
              tabIndex={index === active ? 0 : -1}
              className={`lg-card lg-explorer__card${index === active ? " is-active" : ""}`}
              onClick={() => select(index)}
              onKeyDown={(event) => onKey(event, index)}
            >
              <span className="lg-card__label"><span>{String(index + 1).padStart(2, "0")}</span>{item.label}</span>
              <span className="lg-explorer__title">{item.title}</span>
            </button>
          ))}
        </div>
        <div className="lg-explorer__detail" role="tabpanel" id="lg-explore-panel" aria-labelledby={`lg-explore-${option.key}`}>
          {/* phones and tablets show the cards as labels only; the chosen card's line opens the panel */}
          <p className="lg-explorer__lead">{option.title}</p>
          {option.detail}
          {option.visual === "map" && !option.cat && filters.length ? (
            <div className="lg-stage__filters" role="group" aria-label={filterLabel}>
              {filters.map((item) => (
                <button key={item.key} type="button" className={`lg-stage__filter is-${item.key}${filter === item.key ? " is-on" : ""}`} aria-pressed={filter === item.key} onClick={() => setFilter(filter === item.key ? null : item.key)}>
                  <i aria-hidden="true" />
                  {item.label}
                </button>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
