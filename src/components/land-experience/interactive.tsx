"use client";

import { useState, type ReactNode } from "react";
import { Icon } from "@/components/ui";
import { c, registerCopy, roleCopy } from "@/components/land-experience/copy";
import type { DevelopmentScenario, MediaSlot, ReadinessItem, Register } from "@/data/land/model";
import type { SiteLocale } from "@/lib/site-data";

/** HERO MEDIA STAGE (§4) — the map now; the panorama, the film and the 360° tour when the real files exist. The OWNER preview shows the
 * reserved slots with their brief; the public page shows only what exists. Never a foreign or generated image presented as the site. */
export function MediaStage({ locale, map, slots, preview }: { locale: SiteLocale; map: ReactNode; slots: MediaSlot[]; preview: boolean }) {
  const visible = slots.filter((s) => (s.key === "panorama" || s.key === "film" || s.key === "tour360") && (s.src || preview));
  const [active, setActive] = useState<string>("map");
  const slot = visible.find((s) => s.key === active);
  return (
    <div className="lx-media">
      {visible.length ? (
        <div className="lx-media__tabs" role="tablist" aria-label={c.media.label[locale]}>
          <button type="button" role="tab" aria-selected={active === "map"} className={active === "map" ? "is-on" : undefined} onClick={() => setActive("map")}>{c.media.map[locale]}</button>
          {visible.map((s) => (
            <button key={s.key} type="button" role="tab" aria-selected={active === s.key} className={`${active === s.key ? "is-on" : ""}${s.src ? "" : " is-empty"}`.trim() || undefined} onClick={() => setActive(s.key)}>{s.label[locale]}</button>
          ))}
        </div>
      ) : null}
      <div className="lx-media__view">
        {active === "map" || !slot ? map : slot.src ? (
          slot.kind === "video" ? <video className="lx-media__video" src={slot.src} poster={slot.poster ?? undefined} muted loop playsInline controls preload="none" /> : slot.kind === "pano" ? <a className="lx-media__tour" href={slot.src}>{slot.label[locale]}</a> : (
            // eslint-disable-next-line @next/next/no-img-element -- the OWNER's own material in a static export
            <img className="lx-media__img" src={slot.src} alt={slot.caption?.[locale] ?? slot.label[locale]} />
          )
        ) : (
          <div className="lx-media__slot" role="note">
            <p className="lx-media__slot-k">{c.media.slot[locale]}</p>
            <p className="lx-media__slot-t">{slot.label[locale]}</p>
            <p className="lx-media__slot-x"><span>{c.media.expected[locale]}:</span> {slot.brief[locale]}</p>
            <p className="lx-media__slot-n">{c.media.honest[locale]}</p>
          </div>
        )}
      </div>
    </div>
  );
}

/** DEVELOPMENT SCENARIOS (§7) — one format at a time; «model this scenario» loads its labelled demonstration example into the calculator. */
export function ScenarioSelector({ locale, scenarios, preview }: { locale: SiteLocale; scenarios: DevelopmentScenario[]; preview: boolean }) {
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState(false);
  const s = scenarios[active];
  const list = (items: { ro: string; ru: string; en: string }[]) => <ul className="lx-scen__list">{items.map((x) => <li key={x.en}>{x[locale]}</li>)}</ul>;
  return (
    <div className="lx-scen">
      <p className="lx-scen__ask">{c.scenAsk[locale]}</p>
      <div className="lx-scen__tabs" role="tablist" aria-label={c.scenAsk[locale]}>
        {scenarios.map((x, i) => (
          <button key={x.key} type="button" role="tab" id={`lx-scen-${x.key}`} aria-controls="lx-scen-panel" aria-selected={i === active} className={`lx-scen__tab${i === active ? " is-on" : ""}`} onClick={() => setActive(i)}>
            <span className="lx-scen__no">{String(i + 1).padStart(2, "0")}</span>
            <span className="lx-scen__name">{x.title[locale]}</span>
            <span className="lx-scen__line">{x.line[locale]}</span>
            <span className="lx-scen__chev" aria-hidden="true"><Icon size={16} /></span>
          </button>
        ))}
      </div>
      <div className="lx-scen__panel" role="tabpanel" id="lx-scen-panel" aria-labelledby={`lx-scen-${s.key}`}>
        <div className="lx-scen__lead">
          <h3 className="lx-scen__title">{s.title[locale]}</h3>
          <p className="lx-scen__logic"><span>{c.logic[locale]}</span>{s.logic[locale]}</p>
          <button type="button" className="lx-btn lx-btn--dark" onClick={() => window.dispatchEvent(new CustomEvent("lx:scenario", { detail: { preset: s.preset } }))}><span>{c.calcThis[locale]}</span><Icon size={16} /></button>
        </div>
        {/* R2 §1: on phones the audience and the checks stay, the rest folds (wide screens always show all six — land-experience.css) */}
        <dl className={`lx-scen__grid${open ? " is-open" : ""}`} id="lx-scen-grid">
          <div><dt>{c.audience[locale]}</dt><dd>{list(s.audience)}</dd></div>
          <div className="is-check"><dt>{c.checks[locale]}</dt><dd>{list(s.checks)}</dd></div>
          <div className="is-extra"><dt>{c.needs[locale]}</dt><dd>{list(s.siteNeeds)}</dd></div>
          <div className="is-extra"><dt>{c.access[locale]}</dt><dd><p>{s.access[locale]}</p></dd></div>
          <div className="is-extra"><dt>{c.utilities[locale]}</dt><dd>{list(s.utilities)}</dd></div>
          <div className="is-extra is-risk"><dt>{c.risks[locale]}</dt><dd>{list(s.risks)}</dd></div>
        </dl>
        <button type="button" className="lx-scen__more" aria-expanded={open} aria-controls="lx-scen-grid" onClick={() => setOpen(!open)}><span>{(open ? c.scenLess : c.scenMore)[locale]}</span><Icon name="down" size={14} /></button>
        {/* eslint-disable-next-line @next/next/no-img-element -- the architect's visual, a static export */}
        {s.visual ? <img className="lx-scen__visual" src={s.visual} alt={s.title[locale]} /> : preview ? <p className="lx-scen__slot">{c.visualSlot[locale]}</p> : null}
      </div>
    </div>
  );
}

const ORDER: Register[] = ["DOCUMENTED", "VERIFYING", "TO_OBTAIN", "NOT_APPLICABLE"];

/** DEVELOPMENT READINESS REGISTER (§9) — filter by status; a register, never a score. */
export function ReadinessRegister({ locale, items }: { locale: SiteLocale; items: ReadinessItem[] }) {
  const [filter, setFilter] = useState<Register | null>(null);
  const shown = items.filter((x) => !filter || x.status === filter);
  const cats = (["title", "planning", "technical", "commercial", "materials"] as const).filter((k) => shown.some((x) => x.category === k));
  const date = (iso: string | null) => (iso ? iso.split("-").reverse().join(".") : "—");
  return (
    <div className="lx-ready">
      <div className="lx-ready__filters" role="group" aria-label={c.col.status[locale]}>
        <button type="button" aria-pressed={filter === null} className={filter === null ? "is-on" : undefined} onClick={() => setFilter(null)}>{c.all[locale]} <em>{items.length}</em></button>
        {ORDER.map((st) => (
          <button key={st} type="button" aria-pressed={filter === st} className={`is-${st.toLowerCase()}${filter === st ? " is-on" : ""}`} onClick={() => setFilter(filter === st ? null : st)}>
            <i aria-hidden="true" />{registerCopy[st][locale]} <em>{items.filter((x) => x.status === st).length}</em>
          </button>
        ))}
      </div>
      {cats.map((cat) => (
        <section key={cat} className="lx-ready__cat" aria-label={c.categories[cat][locale]}>
          <h3 className="lx-ready__cat-t">{c.categories[cat][locale]}</h3>
          <ol className="lx-ready__list">
            {shown.filter((x) => x.category === cat).map((x) => (
              <li key={x.key} className={`lx-ready__item is-${x.status.toLowerCase()}`}>
                <div className="lx-ready__main">
                  <span className="lx-ready__label">{x.label[locale]}</span>
                  <span className={`lx-status is-${x.status.toLowerCase()}`}><i aria-hidden="true" />{registerCopy[x.status][locale]}</span>
                  {x.evidence ? <span className="lx-ready__evidence"><b>{c.evidence[locale]}:</b> {x.evidence[locale]}</span> : null}
                </div>
                <p className="lx-ready__next"><span>{c.next[locale]}</span>{x.next[locale]}</p>
                <p className="lx-ready__who"><span>{c.col.who[locale]}</span>{roleCopy[x.owner][locale]}{x.checked ? ` · ${date(x.checked)}` : ""}</p>
              </li>
            ))}
          </ol>
        </section>
      ))}
    </div>
  );
}
