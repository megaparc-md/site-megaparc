"use client";

import { useRef, useState, type KeyboardEvent, type ReactNode } from "react";

/**
 * FORMAT PICKER — the editorial selector of the format lens: four words, the
 * chosen one underlined; the pane below changes its argument. The choice is
 * announced ("lg:format") so the viewing form can carry it into «Вид бизнеса».
 * WAI-ARIA tabs; panes are rendered on the server.
 */
export function FormatPicker({ formats, panes, label }: { formats: { key: string; label: string }[]; panes: ReactNode[]; label: string }) {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  const select = (index: number, focus = false) => {
    setActive(index);
    if (focus) refs.current[index]?.focus();
    window.dispatchEvent(new CustomEvent("lg:format", { detail: formats[index].label }));
  };
  const onKey = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const last = formats.length - 1;
    const next = event.key === "ArrowRight" ? (index === last ? 0 : index + 1) : event.key === "ArrowLeft" ? (index === 0 ? last : index - 1) : event.key === "Home" ? 0 : event.key === "End" ? last : null;
    if (next === null) return;
    event.preventDefault();
    select(next, true);
  };

  return (
    <div className="lg-lens__picker">
      <div className="lg-lens__tabs" role="tablist" aria-label={label}>
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
            {format.label}
          </button>
        ))}
      </div>
      {panes.map((pane, index) => (
        <div key={formats[index].key} role="tabpanel" id={`lg-formatpane-${formats[index].key}`} aria-labelledby={`lg-format-${formats[index].key}`} hidden={index !== active} className="lg-lens__pane">
          {pane}
        </div>
      ))}
    </div>
  );
}
