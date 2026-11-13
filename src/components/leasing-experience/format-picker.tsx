"use client";

import { useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { Icon } from "@/components/ui";

/**
 * FORMAT PICKER — the premium choice interface of the business lens (OWNER "FINAL ART DIRECTION & VISUAL CONVERSION PASS",
 * 2026-11-09, §13 · OWNER «THE BUSINESS-FORMAT SELECTOR IS NOT PREMIUM ENOUGH», 2026-11-11): four formats as editorial button cards
 * beside the scene — a small burgundy ordinal, the title in Geist, a circled chevron; hover lifts the card and inks the chevron,
 * the chosen card is inverted burgundy with white type and a white chevron (never a bare left line). Phones: a 2 × 2 set of compact
 * tiles with the same states. A short instruction above the controls says what they do. Switching changes the interior photograph,
 * the zoning drawn on it, the main question and the supporting proof — one format at a time, the new scene fading in. The choice is
 * announced ("lg:format") so the viewing form can carry it into «Вид бизнеса». WAI-ARIA tabs (vertical on desktop); panes are
 * rendered on the server. The options, their names, their order and the switching logic are unchanged.
 */
export function FormatPicker({ formats, panes, label, hint }: { formats: { key: string; no: string; label: string }[]; panes: ReactNode[]; label: string; hint?: string }) {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  // OWNER R10 §02 (2026-11-13): a link may open a format directly — «?format=producer#format» from the Leasing block. The server
  // renders the first format; the requested one is chosen once after hydration (an unknown key keeps the first).
  useEffect(() => {
    const key = new URLSearchParams(window.location.search).get("format");
    const index = key ? formats.findIndex((format) => format.key === key) : -1;
    if (index <= 0) return;
    const id = window.requestAnimationFrame(() => {
      setActive(index);
      window.dispatchEvent(new CustomEvent("lg:format", { detail: formats[index].label }));
    });
    return () => window.cancelAnimationFrame(id);
    // the requested format is read once, on arrival
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const select = (index: number, focus = false) => {
    setActive(index);
    if (focus) refs.current[index]?.focus();
    window.dispatchEvent(new CustomEvent("lg:format", { detail: formats[index].label }));
  };
  const onKey = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const last = formats.length - 1;
    const forward = event.key === "ArrowRight" || event.key === "ArrowDown";
    const back = event.key === "ArrowLeft" || event.key === "ArrowUp";
    const next = forward ? (index === last ? 0 : index + 1) : back ? (index === 0 ? last : index - 1) : event.key === "Home" ? 0 : event.key === "End" ? last : null;
    if (next === null) return;
    event.preventDefault();
    select(next, true);
  };

  return (
    <div className="lg-lens__picker">
      <div className="lg-lens__controls">
        {hint ? <p className="lg-lens__hint" id="lg-format-hint">{hint}</p> : null}
        <div className="lg-lens__tabs" role="tablist" aria-label={label} aria-orientation="vertical" aria-describedby={hint ? "lg-format-hint" : undefined}>
          {formats.map((format, index) => (
            <button
              key={format.key}
              ref={(element) => {
                refs.current[index] = element;
              }}
              type="button"
              role="tab"
              id={`lg-format-${format.key}`}
              aria-controls={`lg-formatpane-${format.key}`}
              aria-selected={index === active}
              tabIndex={index === active ? 0 : -1}
              className={`lg-lens__tab${index === active ? " is-active" : ""}`}
              onClick={() => select(index)}
              onKeyDown={(event) => onKey(event, index)}
            >
              <span className="lg-lens__tabno">{format.no}</span>
              <span className="lg-lens__tablabel">{format.label}</span>
              <span className="lg-lens__tabchev" aria-hidden="true"><Icon size={16} /></span>
            </button>
          ))}
        </div>
      </div>
      <div className="lg-lens__panes">
        {panes.map((pane, index) => (
          <div key={formats[index].key} role="tabpanel" id={`lg-formatpane-${formats[index].key}`} aria-labelledby={`lg-format-${formats[index].key}`} aria-hidden={index !== active} inert={index !== active} className={`lg-lens__pane ${index === active ? "is-on" : "is-off"}`}>
            {pane}
          </div>
        ))}
      </div>
    </div>
  );
}
