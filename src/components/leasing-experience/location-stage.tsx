"use client";

import { useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { Icon } from "@/components/ui";

/**
 * LOCATION EXPLORER (OWNER "PREMIUM CARD SYSTEM & AIR PASS", 2026-11-09, §9 · OWNER «REAL PREMIUM ART-DIRECTION PASS», 2026-11-11, §10–§15) —
 * «Локация в движении» as a premium interactive product: one large visual on the left, the control zone on the right. The control
 * zone explains itself before any interaction: the question «Что влияет на эту локацию?», the line «Выберите аспект — карта покажет
 * соответствующий слой.», then four numbered controls (АДРЕС · ОКРУЖЕНИЕ · ТРАНСПОРТ · РИТМ ДНЯ — the last two only where the
 * catchment map and the preliminary model are shown) with a chevron, hover, focus and an inverted burgundy active state. The stage
 * carries a quiet status bar «Сейчас на карте: …» so the visitor sees what changed. Choosing a control switches the main visual
 * (the real aerial with the confirmed marks · the surroundings map · the same map with the transport layer brought forward · the
 * rhythm of the day) and the short detail under the controls — never map + aerial + POI + traffic + paragraphs at once. The category
 * filters of the map stay with the surroundings control. Phones: the controls come BEFORE the map (2 × 2), the status bar stays on
 * the map. WAI-ARIA tabs (vertical); visuals and details are rendered on the server.
 */

export type ExplorerOption = { key: string; label: string; title: string; visual: string; cat?: string; detail?: ReactNode };
export type ExplorerCopy = { question: string; hint: string; now: string; active: string };

export function LocationExplorer({ options, visuals, filters, label, filterLabel, copy }: { options: ExplorerOption[]; visuals: { key: string; node: ReactNode }[]; filters: { key: string; label: string }[]; label: string; filterLabel: string; copy?: ExplorerCopy }) {
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
    <div className="lg-explorer lg-stage" data-cat={cat ?? undefined} data-view={option.visual}>
      {/* the control zone — the question, the instruction, the four controls */}
      <div className="lg-explorer__controls">
        {copy ? (
          <header className="lg-explorer__ask" id="lg-explore-ask">
            <p className="lg-explorer__question">{copy.question}</p>
            <p className="lg-explorer__hint">{copy.hint}</p>
          </header>
        ) : null}
        <div className="lg-explorer__cards" role="tablist" aria-label={label} aria-orientation="vertical" aria-describedby={copy ? "lg-explore-ask" : undefined}>
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
              className={`lg-explorer__card${index === active ? " is-active" : ""}`}
              onClick={() => select(index)}
              onKeyDown={(event) => onKey(event, index)}
            >
              <span className="lg-explorer__no">{String(index + 1).padStart(2, "0")}</span>
              <span className="lg-explorer__name">{item.label}</span>
              <span className="lg-explorer__title">{item.title}</span>
              <span className="lg-explorer__chev" aria-hidden="true"><Icon size={18} /></span>
            </button>
          ))}
        </div>
      </div>

      {/* the stage — the status bar names the layer, then the visual */}
      <div className="lg-explorer__stage">
        {copy ? (
          <p className="lg-explorer__status" aria-live="polite">
            <span className="lg-explorer__status-key">{copy.now}</span>
            <b><i aria-hidden="true" />{String(active + 1).padStart(2, "0")} · {option.label}</b>
          </p>
        ) : null}
        {visuals.map((visual) => (
          <div key={visual.key} className={`lg-explorer__view is-${visual.key}${visual.key === option.visual ? " is-on" : ""}`} aria-hidden={visual.key !== option.visual}>
            {visual.node}
          </div>
        ))}
      </div>

      {/* the detail of the chosen aspect */}
      <div className="lg-explorer__detail" role="tabpanel" id="lg-explore-panel" aria-labelledby={`lg-explore-${option.key}`}>
        <p className="lg-explorer__lead"><span className="lg-explorer__lead-no">{String(active + 1).padStart(2, "0")}</span>{option.title}</p>
        {option.detail}
        {option.visual === "map" && !option.cat && filters.length ? (
          <div className="lg-stage__filters" role="group" aria-label={filterLabel}>
            <span className="lg-stage__filters-label">{filterLabel}</span>
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
  );
}
