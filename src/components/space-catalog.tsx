"use client";

import { useMemo, useState } from "react";
import { Icon } from "@/components/ui";

/**
 * SPACE FINDER + FLOOR NAVIGATOR — OWNER «PROPERTY COMMERCIAL EXPERIENCE 2026» Part B (2026-11-23), Dacia 31.
 * Two scenarios in one building: A · offices and cabinets (catalogue, area, floor, availability, possible use, viewing request; the
 * filter by area and status) and B · large commercial floors (available area, one or several tenants — division only after the
 * technical check, retail and service formats, an individual offer request). The level stack on the left is the floor navigator: a
 * schematic of the levels the register names (never a drawing, never to scale) with the free area of each; choosing a level filters
 * the cards. Only spaces that are free are ever in the list — an occupied office or cabinet never appears, a «busy → free» record stays
 * out until its date is confirmed. No rent anywhere. Strings arrive localised from the server.
 */

export type FinderSpace = {
  id: string;
  code: string;
  scenario: "office" | "commercial";
  level: string;
  levelLabel: string;
  area: number;
  areaText: string;
  unit: string;
  status: "now" | "soon";
  statusText: string;
  uses: string;
  divisible: string | null;
  viewHref: string;
  offerHref: string;
};
export type FinderLevel = { key: string; label: string; freeText: string; count: number; /** the free area of the level relative to the largest one (0–1) — the bar */ share: number };
export type FinderCopy = {
  scenarioLabel: string;
  all: string;
  scenarios: { office: string; commercial: string };
  areaLabel: string;
  areas: { key: string; label: string; min: number; max: number }[];
  statusLabel: string;
  statuses: { now: string; soon: string };
  levelsLabel: string;
  levelsNote: string;
  allLevels: string;
  uses: string;
  view: string;
  offer: string;
  found: string;
  none: string;
  reset: string;
  note: string;
};

export function SpaceCatalog({ spaces, levels, copy }: { spaces: FinderSpace[]; levels: FinderLevel[]; copy: FinderCopy }) {
  const [scenario, setScenario] = useState<"all" | "office" | "commercial">("all");
  const [area, setArea] = useState("any");
  const [status, setStatus] = useState<"all" | "now" | "soon">("all");
  const [level, setLevel] = useState("all");
  const band = copy.areas.find((item) => item.key === area);
  const list = useMemo(
    () => spaces.filter((space) => (scenario === "all" || space.scenario === scenario) && (!band || (space.area >= band.min && space.area < band.max)) && (status === "all" || space.status === status) && (level === "all" || space.level === level)),
    [spaces, scenario, band, status, level],
  );
  const reset = () => { setScenario("all"); setArea("any"); setStatus("all"); setLevel("all"); };
  const soonCount = spaces.filter((space) => space.status === "soon").length;

  return (
    <div className="sc">
      <aside className="sc-nav" aria-label={copy.levelsLabel}>
        <p className="lg-label">{copy.levelsLabel}</p>
        <ol className="sc-stack">
          {levels.map((item) => (
            <li key={item.key}>
              <button type="button" className={`sc-level${level === item.key ? " is-on" : ""}`} aria-pressed={level === item.key} onClick={() => setLevel(level === item.key ? "all" : item.key)}>
                <span className="sc-level__name">{item.label}</span>
                <span className="sc-level__free">{item.freeText}</span>
                <span className="sc-level__bar" aria-hidden="true"><i style={{ width: `${Math.max(6, Math.round(item.share * 100))}%` }} /></span>
              </button>
            </li>
          ))}
        </ol>
        <p className="sc-nav__note">{copy.levelsNote}</p>
      </aside>

      <div className="sc-main">
        <div className="sc-filters" role="group" aria-label={copy.scenarioLabel}>
          <fieldset className="sc-filter">
            <legend className="lg-label">{copy.scenarioLabel}</legend>
            <div className="sc-chips">
              {(["all", "office", "commercial"] as const).map((key) => (
                <button key={key} type="button" className={`sc-chip${scenario === key ? " is-on" : ""}`} aria-pressed={scenario === key} onClick={() => setScenario(key)}>
                  {key === "all" ? copy.all : copy.scenarios[key]}
                </button>
              ))}
            </div>
          </fieldset>
          <fieldset className="sc-filter">
            <legend className="lg-label">{copy.areaLabel}</legend>
            <div className="sc-chips">
              {[{ key: "any", label: copy.all }, ...copy.areas].map((item) => (
                <button key={item.key} type="button" className={`sc-chip${area === item.key ? " is-on" : ""}`} aria-pressed={area === item.key} onClick={() => setArea(item.key)}>
                  {item.label}
                </button>
              ))}
            </div>
          </fieldset>
          <fieldset className="sc-filter">
            <legend className="lg-label">{copy.statusLabel}</legend>
            <div className="sc-chips">
              {(["all", "now", "soon"] as const).map((key) => (
                <button key={key} type="button" className={`sc-chip${status === key ? " is-on" : ""}`} aria-pressed={status === key} disabled={key === "soon" && soonCount === 0} onClick={() => setStatus(key)}>
                  {key === "all" ? copy.all : copy.statuses[key]}
                </button>
              ))}
            </div>
          </fieldset>
        </div>

        <p className="sc-found" aria-live="polite">{copy.found.replace("{n}", String(list.length))}</p>
        {list.length ? (
          <ul className="sc-list">
            {list.map((space) => (
              <li key={space.id} className={`sc-card is-${space.scenario}`}>
                <div className="sc-card__head">
                  <span className="sc-card__status"><i aria-hidden="true" />{space.statusText}</span>
                  <span className="sc-card__code">{space.code}</span>
                </div>
                <p className="sc-card__unit">{space.unit}</p>
                <p className="sc-card__area">{space.areaText}</p>
                <dl className="sc-card__rows">
                  <div><dt>{copy.levelsLabel}</dt><dd>{space.levelLabel}</dd></div>
                  <div><dt>{copy.uses}</dt><dd>{space.uses}</dd></div>
                </dl>
                {space.divisible ? <p className="sc-card__divisible">{space.divisible}</p> : null}
                <div className="sc-card__actions">
                  <a className="btn" href={space.viewHref} data-intent="viewing" data-space={space.code}><span>{copy.view}</span><Icon /></a>
                  <a className="pm-link" href={space.offerHref} data-intent="individual-offer" data-space={space.code}><span>{copy.offer}</span><Icon /></a>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="sc-empty">
            <p>{copy.none}</p>
            <button type="button" className="pm-link" onClick={reset}><span>{copy.reset}</span><Icon /></button>
          </div>
        )}
        <p className="sc-note">{copy.note}</p>
      </div>
    </div>
  );
}
