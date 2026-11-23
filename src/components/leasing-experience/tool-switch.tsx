"use client";

import { useRef, useState, type KeyboardEvent, type ReactNode } from "react";

/**
 * TWO TOOLS, ONE DRAWER — OWNER «PROPERTY COMMERCIAL EXPERIENCE 2026» Part B (2026-11-23). Dacia 31 offers two real formats, so
 * its decision drawer holds two calculations: the office scenario (how much space a team needs) for offices and cabinets, and the
 * reverse economics of a point for the large retail and service floors. Never the retail calculator for an office. WAI-ARIA tabs,
 * both panes rendered on the server; the inactive pane is out of the flow (display: none — never two panes in one grid cell).
 */
export function ToolSwitch({ label, tools, panes }: { label: string; tools: { key: string; label: string; note: string }[]; panes: ReactNode[] }) {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const onKey = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const last = tools.length - 1;
    const next = event.key === "ArrowRight" || event.key === "ArrowDown" ? (index === last ? 0 : index + 1) : event.key === "ArrowLeft" || event.key === "ArrowUp" ? (index === 0 ? last : index - 1) : null;
    if (next === null) return;
    event.preventDefault();
    setActive(next);
    refs.current[next]?.focus();
  };
  return (
    <div className="lg-tools">
      <div className="lg-tools__tabs" role="tablist" aria-label={label}>
        {tools.map((tool, index) => (
          <button
            key={tool.key}
            ref={(element) => {
              refs.current[index] = element;
            }}
            type="button"
            role="tab"
            id={`lg-tool-${tool.key}`}
            aria-controls={`lg-toolpane-${tool.key}`}
            aria-selected={index === active}
            tabIndex={index === active ? 0 : -1}
            className={`lg-tools__tab${index === active ? " is-active" : ""}`}
            onClick={() => setActive(index)}
            onKeyDown={(event) => onKey(event, index)}
          >
            <strong>{tool.label}</strong>
            <span>{tool.note}</span>
          </button>
        ))}
      </div>
      {panes.map((pane, index) => (
        <div key={tools[index].key} role="tabpanel" id={`lg-toolpane-${tools[index].key}`} aria-labelledby={`lg-tool-${tools[index].key}`} hidden={index !== active} className="lg-tools__pane">
          {pane}
        </div>
      ))}
    </div>
  );
}
