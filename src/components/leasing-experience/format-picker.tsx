"use client";

import { useRef, useState, type KeyboardEvent, type ReactNode } from "react";

/**
 * FORMAT PICKER — the editorial selector of the business lens (OWNER "FINAL ART
 * DIRECTION & VISUAL CONVERSION PASS", 2026-11-09, §13): four formats set as a
 * numbered list of large words beside the scene (desktop; a 2 × 2 grid of words
 * on phones) — the chosen one in ink with its burgundy number and rule, the
 * others quiet. Switching changes the interior photograph, the zoning drawn on
 * it, the main question and the supporting proof — one format at a time, the new
 * scene fading in. The choice is announced ("lg:format") so the viewing form can
 * carry it into «Вид бизнеса». WAI-ARIA tabs (vertical on desktop); panes are
 * rendered on the server.
 */
export function FormatPicker({ formats, panes, label }: { formats: { key: string; no: string; label: string }[]; panes: ReactNode[]; label: string }) {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

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
      <div className="lg-lens__tabs" role="tablist" aria-label={label} aria-orientation="vertical">
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
          </button>
        ))}
      </div>
      <div className="lg-lens__panes">
        {panes.map((pane, index) => (
          <div key={formats[index].key} role="tabpanel" id={`lg-formatpane-${formats[index].key}`} aria-labelledby={`lg-format-${formats[index].key}`} hidden={index !== active} className="lg-lens__pane">
            {pane}
          </div>
        ))}
      </div>
    </div>
  );
}
