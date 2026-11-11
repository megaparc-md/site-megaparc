"use client";

import { useState, type ReactNode } from "react";
import { Icon } from "@/components/ui";
import { track } from "@/lib/track";

/**
 * INTERACTIVE PLAN LAYER (OWNER toolkit mandate §11–13) — explanatory, never authoritative: the official drawing (a crop of the
 * OWNER's 1:100 annex, rendered by the server and passed in) stays the source of truth. The visitor picks a level and a category
 * — access · logistics · sanitary · vertical circulation · technical — and the documented rooms and marks of that category light
 * up in the room schedule beside the drawing, with the confirmed facts of the category. No marker is drawn on the drawing itself:
 * the dataset's positions exist only for the superseded traced scheme, not in the pixel space of the official crops, so nothing is
 * placed where the position is not documented (§12). «Download the official plan PDF» on every level.
 */
export type LayerKey = "all" | "access" | "logistics" | "sanitary" | "circulation" | "technical";
export type LayerItem = { key: string; no: string | null; label: string; area: string | null; layers: LayerKey[] };
export type LayerLevel = { key: string; label: string; mark: string; pdf: string; drawing: ReactNode; items: LayerItem[] };
export type LayerCopy = { layers: string; onPlan: string; noneOnLevel: string; facts: string; official: string; note: string; names: Record<LayerKey, string> };

export function PlanLayers({ levels, facts, copy }: { levels: LayerLevel[]; facts: Record<Exclude<LayerKey, "all">, string[]>; copy: LayerCopy }) {
  const [level, setLevel] = useState(0);
  const [layer, setLayer] = useState<LayerKey>("all");
  const current = levels[level];
  const keys: LayerKey[] = ["all", "access", "logistics", "sanitary", "circulation", "technical"];
  const shown = layer === "all" ? current.items : current.items.filter((item) => item.layers.includes(layer));

  return (
    <div className="lp-plans">
      <div className="lp-plans__tabs" role="tablist">
        {levels.map((item, i) => (
          <button key={item.key} type="button" role="tab" aria-selected={i === level} className={`lp-plans__tab${i === level ? " is-active" : ""}`} onClick={() => { setLevel(i); track("m20_plan_open", { level: item.key }); }}>
            <span>{item.label}</span><small>{item.mark}</small>
          </button>
        ))}
      </div>
      <div className="lp-plans__layers" role="group" aria-label={copy.layers}>
        <span className="lp-plans__layerslabel">{copy.layers}</span>
        {keys.map((key) => (
          <button key={key} type="button" className={`lp-chip${layer === key ? " is-on" : ""}`} aria-pressed={layer === key} onClick={() => setLayer(key)}>{copy.names[key]}</button>
        ))}
      </div>
      <div className="lp-plans__grid">
        <div className="lp-plans__stage">{current.drawing}</div>
        <aside className="lp-plans__side">
          <p className="lp-label">{copy.onPlan}</p>
          {shown.length ? (
            <ul className="lp-legend">
              {shown.map((item) => (
                <li key={item.key} className={layer !== "all" ? "is-hit" : undefined}>
                  {item.no ? <span className="lp-legend__no">{item.no}</span> : <span className="lp-legend__dot" aria-hidden="true" />}
                  <span className="lp-legend__name">{item.label}</span>
                  {item.area ? <span className="lp-legend__area">{item.area}</span> : null}
                </li>
              ))}
            </ul>
          ) : (
            <p className="lp-plans__none">{copy.noneOnLevel}</p>
          )}
          {layer !== "all" && facts[layer]?.length ? (
            <>
              <p className="lp-label">{copy.facts}</p>
              <ul className="lp-facts-list">
                {facts[layer].map((fact) => <li key={fact}>{fact}</li>)}
              </ul>
            </>
          ) : null}
          <a className="pm-link lp-plans__pdf" href={current.pdf} target="_blank" rel="noopener noreferrer" onClick={() => track("m20_plan_open", { pdf: current.key })}><span>{copy.official}</span><Icon name="up-right" /></a>
          <p className="lp-plans__note">{copy.note}</p>
        </aside>
      </div>
    </div>
  );
}
