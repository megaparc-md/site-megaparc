"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { Icon } from "@/components/ui";

/**
 * DACIA 31 — THE INTERACTIVE FLOOR NAVIGATOR (OWNER addendum «DACIA 31 · ARCHITECTURAL PLANS», 2026-11-23).
 * The five levels of the OWNER architectural plans: the drawing's own walls, openings and columns as a quiet vector layer (one static SVG per
 * level, loaded when the level opens; no dimension lines, axes or tables), the rooms as a light interactive layer coloured by status in
 * neutral tones (free · occupied · to be confirmed · service · not offered), two directions (offices and cabinets · large commercial floors),
 * the room card (area by the plan's schedule, purpose, level, photographs, status, commercial terms when they exist), the list of the
 * level's offered rooms, the original PDF, and zoom / pan that work with a finger (pinch, drag, double tap, the + / − buttons). The technical
 * floor is shown, never offered. Strings arrive localised from the server.
 */

export type NavRoom = { id: string; no: string; title: string; kindLabel: string; area: string | null; note: string | null; status: "free" | "occupied" | "to-confirm" | "service" | "not-offered"; scenario: "office" | "commercial" | null; poly: string | null; at: [number, number] | null; big: boolean; viewHref: string | null; offerHref: string | null };
export type NavLevel = { key: string; label: string; drawing: string; pdf: string; svg: string; offered: boolean; note: string | null; heights: string | null; viewBox: [number, number, number, number]; rooms: NavRoom[] };
export type NavCopy = {
  levels: string; directions: string; all: string; office: string; commercial: string;
  status: Record<NavRoom["status"], string>;
  choose: string; area: string; purpose: string; level: string; photos: string; photosValue: string; statusLabel: string; terms: string; termsValue: string; heights: string;
  view: string; offer: string; occupiedNote: string; notOffered: string;
  zoomIn: string; zoomOut: string; reset: string; pdf: string; listTitle: string; listEmpty: string; count: string; hint: string;
};

type Z = { k: number; x: number; y: number };
const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

export function PlanNavigator({ levels, copy, initial }: { levels: NavLevel[]; copy: NavCopy; initial: string }) {
  const [levelKey, setLevelKey] = useState(initial);
  const [dir, setDir] = useState<"all" | "office" | "commercial">("all");
  const [selected, setSelected] = useState<string | null>(null);
  const [z, setZ] = useState<Z>({ k: 1, x: 0, y: 0 });
  const stage = useRef<HTMLDivElement | null>(null);
  const level = levels.find((item) => item.key === levelKey) ?? levels[0];
  const room = level.rooms.find((item) => item.id === selected) ?? null;
  const [, , vw, vh] = level.viewBox;
  // labels keep a readable size whatever the sheet's scale (≈ 13–15 px on a 1 000 px wide plan)
  const fs = Math.round(vw / 64);

  const pickDir = (d: typeof dir) => {
    setDir(d);
    setSelected(null);
    // a direction opens the level where it lives
    if (d === "office" && !level.rooms.some((r) => r.scenario === "office")) setLevelKey(levels.find((l) => l.rooms.some((r) => r.scenario === "office"))?.key ?? levelKey);
    if (d === "commercial" && !level.rooms.some((r) => r.scenario === "commercial")) setLevelKey(levels.find((l) => l.rooms.some((r) => r.scenario === "commercial"))?.key ?? levelKey);
  };
  const pickLevel = (key: string) => { setLevelKey(key); setSelected(null); setZ({ k: 1, x: 0, y: 0 }); };
  const shown = (r: NavRoom) => dir === "all" || r.scenario === dir;
  const offered = useMemo(() => level.rooms.filter((r) => (r.status === "free" || r.status === "to-confirm") && r.scenario && shown(r)), [level, dir]); // eslint-disable-line react-hooks/exhaustive-deps

  // zoom / pan — pinch, drag, double tap, buttons; ctrl + wheel (trackpad pinch) only, so the page keeps scrolling
  const zoomAt = useCallback((factor: number, cx?: number, cy?: number) => {
    const el = stage.current; if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = cx ?? rect.width / 2, py = cy ?? rect.height / 2;
    setZ((cur) => {
      const k = clamp(cur.k * factor, 1, 6);
      const f = k / cur.k;
      const x = px - (px - cur.x) * f, y = py - (py - cur.y) * f;
      return k === 1 ? { k: 1, x: 0, y: 0 } : { k, x: clamp(x, rect.width * (1 - k), 0), y: clamp(y, rect.height * (1 - k), 0) };
    });
  }, []);
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const drag = useRef<{ moved: number; pinch: number }>({ moved: 0, pinch: 0 });
  const lastTap = useRef(0);
  const onDown = (e: ReactPointerEvent<HTMLDivElement>) => { if ((e.target as Element).closest("button")) return; /* the zoom buttons keep their own click */ (e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId); pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY }); drag.current.moved = 0; };
  const onMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const prev = pointers.current.get(e.pointerId); if (!prev) return;
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    const el = stage.current; if (!el) return;
    const rect = el.getBoundingClientRect();
    if (pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()];
      const dist = Math.hypot(a.x - b.x, a.y - b.y);
      if (drag.current.pinch) zoomAt(dist / drag.current.pinch, (a.x + b.x) / 2 - rect.left, (a.y + b.y) / 2 - rect.top);
      drag.current.pinch = dist; drag.current.moved += 10;
      return;
    }
    const dx = e.clientX - prev.x, dy = e.clientY - prev.y;
    drag.current.moved += Math.abs(dx) + Math.abs(dy);
    setZ((cur) => (cur.k === 1 ? cur : { ...cur, x: clamp(cur.x + dx, rect.width * (1 - cur.k), 0), y: clamp(cur.y + dy, rect.height * (1 - cur.k), 0) }));
  };
  const onUp = (e: ReactPointerEvent<HTMLDivElement>) => {
    pointers.current.delete(e.pointerId);
    if (pointers.current.size < 2) drag.current.pinch = 0;
    if (drag.current.moved > 6) return;
    // a tap: a room, or a double tap to zoom
    const target = (e.target as Element).closest("[data-room]");
    const now = Date.now();
    if (!target && now - lastTap.current < 320) { const rect = stage.current!.getBoundingClientRect(); zoomAt(2, e.clientX - rect.left, e.clientY - rect.top); }
    lastTap.current = now;
    if (target) setSelected(target.getAttribute("data-room"));
  };
  useEffect(() => {
    const el = stage.current; if (!el) return;
    const wheel = (e: WheelEvent) => { if (!e.ctrlKey && !e.metaKey) return; e.preventDefault(); const rect = el.getBoundingClientRect(); zoomAt(e.deltaY < 0 ? 1.15 : 1 / 1.15, e.clientX - rect.left, e.clientY - rect.top); };
    el.addEventListener("wheel", wheel, { passive: false });
    return () => el.removeEventListener("wheel", wheel);
  }, [zoomAt]);

  const label = (r: NavRoom) => (r.status === "service" || r.status === "not-offered" ? null : r.no);
  const counts = { free: 0, occupied: 0, "to-confirm": 0 } as Record<string, number>;
  for (const r of level.rooms) if (r.status in counts && r.scenario && shown(r)) counts[r.status] += 1;

  return (
    <div className="pn">
      <div className="pn-bar">
        <div className="pn-levels" role="group" aria-label={copy.levels}>
          {levels.map((item) => (
            <button key={item.key} type="button" className={`pn-chip${item.key === level.key ? " is-on" : ""}${item.offered ? "" : " is-muted"}`} aria-pressed={item.key === level.key} onClick={() => pickLevel(item.key)}>{item.label}</button>
          ))}
        </div>
        <div className="pn-dirs" role="group" aria-label={copy.directions}>
          {(["all", "office", "commercial"] as const).map((key) => (
            <button key={key} type="button" className={`pn-chip${dir === key ? " is-on" : ""}`} aria-pressed={dir === key} onClick={() => pickDir(key)}>{key === "all" ? copy.all : copy[key]}</button>
          ))}
        </div>
      </div>

      <div className="pn-body">
        <figure className="pn-figure">
          <div className="pn-stage" ref={stage} style={{ aspectRatio: `${vw} / ${vh}` }} onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp}>
            <div className="pn-zoom" style={{ transform: `translate(${z.x}px, ${z.y}px) scale(${z.k})` }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="pn-arch" src={level.svg} alt="" draggable={false} key={level.svg} />
              <svg className="pn-rooms" viewBox={level.viewBox.join(" ")} preserveAspectRatio="xMidYMid meet" aria-hidden="true">
                <defs>
                  <pattern id="pn-hatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="6" height="6" fill="#efefef" /><line x1="0" y1="0" x2="0" y2="6" stroke="#bdbdbd" strokeWidth="1.4" /></pattern>
                </defs>
                {level.rooms.map((r) => r.poly ? (
                  <polygon key={r.id} data-room={r.status === "service" || r.status === "not-offered" ? undefined : r.id} points={r.poly} className={`pn-room is-${r.status}${shown(r) ? "" : " is-dim"}${r.id === selected ? " is-selected" : ""}`} />
                ) : null)}
                {level.rooms.map((r) => r.at && label(r) ? (
                  <text key={`t-${r.id}`} x={r.at[0]} y={r.at[1] + fs * 0.35} style={{ fontSize: fs }} className={`pn-no is-${r.status}${r.id === selected ? " is-selected" : ""}${shown(r) ? "" : " is-dim"}`} textAnchor="middle">{r.no}{r.big && r.area ? <tspan x={r.at[0]} dy={fs * 1.15} className="pn-area">{r.area}</tspan> : null}</text>
                ) : null)}
              </svg>
            </div>
            <div className="pn-tools">
              <button type="button" className="pn-tool" onClick={() => zoomAt(1.5)} aria-label={copy.zoomIn}>+</button>
              <button type="button" className="pn-tool" onClick={() => zoomAt(1 / 1.5)} aria-label={copy.zoomOut}>−</button>
              <button type="button" className="pn-tool is-reset" onClick={() => setZ({ k: 1, x: 0, y: 0 })} aria-label={copy.reset}>⟲</button>
            </div>
          </div>
          <figcaption className="pn-caption">
            <ul className="pn-legend">
              {(["free", "occupied", "to-confirm"] as const).map((s) => (
                <li key={s}><i className={`pn-swatch is-${s}`} aria-hidden="true" />{copy.status[s]}{level.offered ? ` · ${counts[s]}` : ""}</li>
              ))}
              <li><i className="pn-swatch is-service" aria-hidden="true" />{copy.status.service}</li>
            </ul>
            <p className="pn-drawing">{level.drawing}{level.note ? ` · ${level.note}` : ""}</p>
            <p className="pn-hint">{copy.hint}</p>
            <a className="pm-link pn-pdf" href={level.pdf} target="_blank" rel="noopener"><span>{copy.pdf}</span><Icon name="up-right" /></a>
          </figcaption>
        </figure>

        <aside className="pn-side" aria-live="polite">
          {room ? (
            <div className={`pn-card is-${room.status}`}>
              <p className="pn-card__status"><i className={`pn-swatch is-${room.status}`} aria-hidden="true" />{copy.status[room.status]}</p>
              <h3 className="pn-card__title">{room.title}</h3>
              <dl className="pn-card__rows">
                <div><dt>{copy.area}</dt><dd>{room.area ?? "—"}{room.note ? <span className="pn-card__note">{room.note}</span> : null}</dd></div>
                <div><dt>{copy.purpose}</dt><dd>{room.kindLabel}</dd></div>
                <div><dt>{copy.level}</dt><dd>{level.label}</dd></div>
                {level.heights ? <div><dt>{copy.heights}</dt><dd>{level.heights}</dd></div> : null}
                <div><dt>{copy.photos}</dt><dd>{copy.photosValue}</dd></div>
                <div><dt>{copy.terms}</dt><dd>{copy.termsValue}</dd></div>
              </dl>
              {room.viewHref ? (
                <div className="pn-card__actions">
                  <a className="btn" href={room.viewHref} data-intent="viewing" data-space={room.id}><span>{copy.view}</span><Icon /></a>
                  {room.offerHref ? <a className="pm-link" href={room.offerHref} data-intent="individual-offer" data-space={room.id}><span>{copy.offer}</span><Icon /></a> : null}
                </div>
              ) : <p className="pn-card__quiet">{room.status === "occupied" ? copy.occupiedNote : copy.notOffered}</p>}
            </div>
          ) : (
            <p className="pn-choose">{level.offered ? copy.choose : copy.notOffered}</p>
          )}
          {level.offered ? (
            <div className="pn-list">
              <p className="lg-label">{copy.listTitle} · {copy.count.replace("{n}", String(offered.length))}</p>
              {offered.length ? (
                <ul>
                  {offered.map((r) => (
                    <li key={r.id}>
                      <button type="button" className={`pn-item is-${r.status}${r.id === selected ? " is-on" : ""}`} onClick={() => setSelected(r.id)} aria-pressed={r.id === selected}>
                        <i className={`pn-swatch is-${r.status}`} aria-hidden="true" />
                        <span className="pn-item__title">{r.title}</span>
                        <span className="pn-item__area">{r.area ?? copy.status["to-confirm"]}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              ) : <p className="pn-list__empty">{copy.listEmpty}</p>}
            </div>
          ) : null}
        </aside>
      </div>
    </div>
  );
}
