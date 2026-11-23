"use client";

import { useMemo, useRef, useState, type KeyboardEvent, type PointerEvent as ReactPointerEvent } from "react";
import { Icon } from "@/components/ui";
import { c, natureCopy } from "@/components/land-experience/copy";
import type { Distance, ExplorerData, ExplorerPoint, LayerKey, LocationLayer, MarketIndicator } from "@/data/land/model";
import { numberLocale, type SiteLocale } from "@/lib/site-data";

/**
 * LOCATION EXPLORER (§5) — eight switchable layers over one light OpenStreetMap base: location · cadastral boundary · access and
 * transport · surroundings · commercial infrastructure · residential areas and population · utility networks · development potential.
 * Zoom (buttons, double click, Ctrl / ⌘ + wheel, pinch) and drag-pan; the satellite view and directions open Google Maps; the 360°
 * panorama button appears when the tour exists (the OWNER preview shows it as «after the shoot»). The boundary layer draws NOTHING until
 * the official plan or verified coordinates exist — it says so on the map. WAI-ARIA tabs (vertical); the nearest points are listed as text.
 */

type Props = {
  locale: SiteLocale;
  data: ExplorerData;
  layers: LocationLayer[];
  distances: Distance[];
  indicators: MarketIndicator[];
  boundary: [number, number][] | null;
  tour: string | null;
  preview: boolean;
  directions: string;
};

const MAX = 6;
const RETAIL = new Set(["retail", "market", "trade", "fuel", "service", "shop"]);

export function LandExplorer({ locale, data, layers, distances, indicators, boundary, tour, preview, directions }: Props) {
  const [active, setActive] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [center, setCenter] = useState({ x: data.frame.w / 2, y: data.frame.h / 2 });
  const [hover, setHover] = useState<ExplorerPoint | null>(null);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const svg = useRef<SVGSVGElement>(null);
  const drag = useRef<{ id: number; x: number; y: number; cx: number; cy: number } | null>(null);
  const pinch = useRef<Map<number, { x: number; y: number }>>(new Map());
  const pinchStart = useRef<{ d: number; zoom: number } | null>(null);
  const layer = layers[active];
  const key: LayerKey = layer.key;
  const W = data.frame.w, H = data.frame.h;
  const mpu = data.frame.metersPerUnit;
  const nf = useMemo(() => new Intl.NumberFormat(numberLocale(locale), { maximumFractionDigits: 0 }), [locale]);
  const kmf = useMemo(() => new Intl.NumberFormat(numberLocale(locale), { maximumFractionDigits: 1, minimumFractionDigits: 0 }), [locale]);

  const w = W / zoom, h = H / zoom;
  const clampC = (x: number, y: number, z: number) => ({ x: Math.min(W - W / z / 2, Math.max(W / z / 2, x)), y: Math.min(H - H / z / 2, Math.max(H / z / 2, y)) });
  const vb = `${center.x - w / 2} ${center.y - h / 2} ${w} ${h}`;
  const s = 1 / zoom; // keeps labels and marks the same size on screen
  const setZ = (z: number, at?: { x: number; y: number }) => {
    const nz = Math.min(MAX, Math.max(1, z));
    const target = at ?? center;
    const nx = target.x + (center.x - target.x) * (zoom / nz);
    const ny = target.y + (center.y - target.y) * (zoom / nz);
    setZoom(nz);
    setCenter(clampC(nx, ny, nz));
  };
  const toMap = (clientX: number, clientY: number) => {
    const el = svg.current;
    if (!el) return center;
    const r = el.getBoundingClientRect();
    // preserveAspectRatio slice: the frame covers the box — the scale is the larger ratio
    const k = Math.max(r.width / w, r.height / h);
    return { x: center.x + (clientX - (r.left + r.width / 2)) / k, y: center.y + (clientY - (r.top + r.height / 2)) / k };
  };
  const onDown = (e: ReactPointerEvent<SVGSVGElement>) => {
    pinch.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pinch.current.size === 2) {
      const [a, b] = [...pinch.current.values()];
      pinchStart.current = { d: Math.hypot(a.x - b.x, a.y - b.y), zoom };
      drag.current = null;
      return;
    }
    if (zoom > 1) {
      drag.current = { id: e.pointerId, x: e.clientX, y: e.clientY, cx: center.x, cy: center.y };
      e.currentTarget.setPointerCapture(e.pointerId);
    }
  };
  const onMove = (e: ReactPointerEvent<SVGSVGElement>) => {
    if (pinch.current.has(e.pointerId)) pinch.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pinch.current.size === 2 && pinchStart.current) {
      const [a, b] = [...pinch.current.values()];
      const d = Math.hypot(a.x - b.x, a.y - b.y);
      setZ(pinchStart.current.zoom * (d / pinchStart.current.d), toMap((a.x + b.x) / 2, (a.y + b.y) / 2));
      return;
    }
    const d = drag.current;
    if (!d || d.id !== e.pointerId || !svg.current) return;
    const r = svg.current.getBoundingClientRect();
    const k = Math.max(r.width / w, r.height / h);
    setCenter(clampC(d.cx - (e.clientX - d.x) / k, d.cy - (e.clientY - d.y) / k, zoom));
  };
  const onUp = (e: ReactPointerEvent<SVGSVGElement>) => {
    pinch.current.delete(e.pointerId);
    if (pinch.current.size < 2) pinchStart.current = null;
    if (drag.current?.id === e.pointerId) drag.current = null;
  };
  const onKey = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const last = layers.length - 1;
    const fwd = event.key === "ArrowDown" || event.key === "ArrowRight";
    const back = event.key === "ArrowUp" || event.key === "ArrowLeft";
    const next = fwd ? (index === last ? 0 : index + 1) : back ? (index === 0 ? last : index - 1) : event.key === "Home" ? 0 : event.key === "End" ? last : null;
    if (next === null) return;
    event.preventDefault();
    setActive(next);
    tabs.current[next]?.focus();
  };

  const dist = (p: { x: number; y: number }) => Math.round(Math.hypot(p.x - data.site.x, p.y - data.site.y) * mpu);
  const within = (kinds: Set<string> | string[], m = 1000) => data.points.filter((p) => (Array.isArray(kinds) ? kinds.includes(p.kind) : kinds.has(p.kind)) && dist(p) <= m);
  const nearest = (kinds: string[], n = 6) => data.points.filter((p) => kinds.includes(p.kind) && p.name).sort((a, b) => dist(a) - dist(b)).slice(0, n);
  const ring = 1000 / mpu;
  const pointsFor: Partial<Record<LayerKey, string[]>> = {
    access: ["station", "bus", "fuel"],
    commerce: ["retail", "market", "trade", "fuel", "service", "shop"],
    residential: ["education", "health"],
    utilities: ["substation", "water"],
  };
  const shown = pointsFor[key] ? data.points.filter((p) => pointsFor[key]!.includes(p.kind)) : [];
  const fmtM = (m: number) => (m >= 1000 ? `${kmf.format(m / 1000)}${" "}${locale === "ru" ? "км" : "km"}` : `${nf.format(m)}${" "}${locale === "ru" ? "м" : "m"}`);
  const roadStroke = (cls: string) => (cls === "trunk" || cls === "primary" ? 7 : cls === "secondary" ? 5 : 3.5);
  // the cadastral boundary — drawn only from verified coordinates (geo.boundary, [lon, lat]); none exists yet, so nothing is drawn
  const R = 6371000;
  const project = ([lon, lat]: [number, number]) => [W / 2 + (((lon - data.site.lon) * Math.PI) / 180) * R * Math.cos((data.site.lat * Math.PI) / 180) / data.frame.span.w * W, H / 2 + (((data.site.lat - lat) * Math.PI) / 180) * R / data.frame.span.h * H];
  const boundaryD = boundary && boundary.length > 2 ? `${boundary.map((p, i) => `${i ? "L" : "M"}${project(p).map((n) => n.toFixed(1)).join(" ")}`).join("")}Z` : null;

  const detail = () => {
    if (key === "access") {
      return (
        <>
          {distances.length ? (
            <div className="lx-ex__block">
              <p className="lx-ex__sub">{c.distTitle[locale]}</p>
              <dl className="lx-ex__rows">
                {distances.map((d) => <div key={d.key}><dt>{d.to[locale]}</dt><dd>≈{" "}{nf.format(Math.round(d.km))}{" "}{locale === "ru" ? "км" : "km"}</dd></div>)}
              </dl>
              <p className="lx-note">{distances[0].method[locale]}</p>
            </div>
          ) : null}
          <div className="lx-ex__block">
            <p className="lx-ex__sub">{c.nearest[locale]}</p>
            <ul className="lx-ex__near">{nearest(["station", "bus", "fuel"], 4).map((p) => <li key={p.osm}><span>{p.name ?? c.kinds[p.kind][locale]}</span><em>{fmtM(dist(p))} · {c.straight[locale]}</em></li>)}</ul>
          </div>
        </>
      );
    }
    if (key === "commerce") {
      const near = within(RETAIL);
      const counts = (["retail", "market", "trade", "fuel", "service"] as const).map((k) => ({ k, n: near.filter((p) => p.kind === k).length })).filter((x) => x.n > 0);
      return (
        <>
          <div className="lx-ex__block">
            <p className="lx-ex__sub">{c.withinKm[locale]}</p>
            <dl className="lx-ex__counts">{counts.map((x) => <div key={x.k}><dt>{c.kinds[x.k][locale]}</dt><dd>{x.n}</dd></div>)}</dl>
          </div>
          <div className="lx-ex__block">
            <p className="lx-ex__sub">{c.nearest[locale]}</p>
            <ul className="lx-ex__near">{nearest(["retail", "market", "trade"], 6).map((p) => <li key={p.osm}><span>{p.name}</span><em>{fmtM(dist(p))} · {c.straight[locale]}</em></li>)}</ul>
          </div>
        </>
      );
    }
    if (key === "residential") {
      const pop = indicators.filter((i) => /population/.test(i.key)).slice(0, 3);
      return (
        <>
          {pop.length ? (
            <dl className="lx-ex__counts lx-ex__counts--big">{pop.map((i) => <div key={i.key}><dt>{i.label[locale]}</dt><dd>{i.value[locale]}{i.note ? <span className="lx-ex__src">{i.note[locale]}</span> : null}<span className="lx-ex__src">{natureCopy[i.nature][locale]} · {i.source} · {i.refDate}</span></dd></div>)}</dl>
          ) : null}
          <div className="lx-ex__block">
            <p className="lx-ex__sub">{c.withinKm[locale]}</p>
            <dl className="lx-ex__counts">{(["education", "health"] as const).map((k) => <div key={k}><dt>{c.kinds[k][locale]}</dt><dd>{within([k]).length}</dd></div>)}</dl>
          </div>
        </>
      );
    }
    if (key === "utilities") {
      const near = data.points.filter((p) => p.kind === "substation").sort((a, b) => dist(a) - dist(b))[0];
      return (
        <div className="lx-ex__block">
          {near ? <p className="lx-ex__fact"><span>{c.kinds.substation[locale]}</span><em>{fmtM(dist(near))} · {c.straight[locale]}</em></p> : null}
          <p className="lx-note">{layer.text[locale]}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="lx-ex" data-layer={key}>
      <div className="lx-ex__controls">
        <header className="lx-ex__ask" id="lx-ex-ask">
          <p className="lx-ex__question">{c.explorerAsk[locale]}</p>
          <p className="lx-ex__hint">{c.explorerHint[locale]}</p>
        </header>
        <div className="lx-ex__tabs" role="tablist" aria-orientation="vertical" aria-describedby="lx-ex-ask">
          {layers.map((item, index) => (
            <button
              key={item.key}
              ref={(el) => { tabs.current[index] = el; }}
              type="button"
              role="tab"
              id={`lx-ex-tab-${item.key}`}
              aria-controls="lx-ex-panel"
              aria-selected={index === active}
              tabIndex={index === active ? 0 : -1}
              className={`lx-ex__tab${index === active ? " is-active" : ""}${item.state === "pending" ? " is-pending" : ""}`}
              onClick={() => setActive(index)}
              onKeyDown={(e) => onKey(e, index)}
            >
              <span className="lx-ex__no">{String(index + 1).padStart(2, "0")}</span>
              <span className="lx-ex__name">{item.label[locale]}</span>
              {item.state === "pending" ? <span className="lx-ex__flag">{c.pending[locale]}</span> : null}
            </button>
          ))}
        </div>
      </div>

      <div className="lx-ex__stage">
        <p className="lx-ex__status" aria-live="polite"><span>{c.now[locale]}</span><b><i aria-hidden="true" />{String(active + 1).padStart(2, "0")} · {layer.label[locale]}</b></p>
        <svg
          ref={svg}
          className={`lx-ex__map${zoom > 1 ? " is-zoomed" : ""}`}
          viewBox={vb}
          preserveAspectRatio="xMidYMid slice"
          role="img"
          aria-label={`${layer.title[locale]} — ${c.osm[locale]}`}
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerCancel={onUp}
          onDoubleClick={(e) => setZ(zoom * 1.6, toMap(e.clientX, e.clientY))}
          onWheel={(e) => { if (e.ctrlKey || e.metaKey) { e.preventDefault(); setZ(zoom * (e.deltaY < 0 ? 1.25 : 0.8), toMap(e.clientX, e.clientY)); } }}
        >
          <image href={data.base} x="0" y="0" width={W} height={H} preserveAspectRatio="xMidYMid slice" />
          <rect className="lx-ex__veil" x="0" y="0" width={W} height={H} />
          {key === "residential" ? <path className="lx-ex__zone is-residential" d={data.zones.residential} /> : null}
          {key === "potential" ? (
            <>
              <path className="lx-ex__zone is-production" d={data.zones.production} />
              <path className="lx-ex__zone is-trade" d={data.zones.trade} />
            </>
          ) : null}
          {key === "utilities" ? data.power.map((p, i) => <path key={i} className={`lx-ex__power${p.minor ? " is-minor" : ""}`} d={p.d} style={{ strokeWidth: (p.minor ? 2.2 : 4) * s }} />) : null}
          {key === "access" || key === "potential" ? (
            <>
              {data.roads.map((r, i) => <path key={i} className={`lx-ex__road is-${r.cls}`} d={r.d} style={{ strokeWidth: roadStroke(r.cls) * Math.max(s, 0.45) }} />)}
              {key === "access" ? <path className="lx-ex__rail" d={data.rail} style={{ strokeWidth: 3.2 * s, strokeDasharray: `${9 * s} ${7 * s}` }} /> : null}
              {key === "access" ? data.roads.filter((r) => r.label && (r.ref || r.name)).map((r, i) => (
                <g key={`l${i}`} transform={`translate(${r.label!.x} ${r.label!.y})`}>
                  <text className={`lx-ex__ref${r.ref ? " is-ref" : ""}`} transform={`rotate(${r.label!.angle}) scale(${s})`} textAnchor="middle" dy="-8">{r.ref ?? r.name}</text>
                </g>
              )) : null}
            </>
          ) : null}
          {key === "commerce" || key === "residential" || key === "context" ? <circle className="lx-ex__ring" cx={data.site.x} cy={data.site.y} r={ring} style={{ strokeWidth: 2 * s, strokeDasharray: `${3 * s} ${8 * s}` }} /> : null}
          {key === "site" ? (
            <>
              <line className="lx-ex__tie" x1={data.town.x} y1={data.town.y} x2={data.site.x} y2={data.site.y} style={{ strokeWidth: 2 * s, strokeDasharray: `${5 * s} ${6 * s}` }} />
              <circle className="lx-ex__town" cx={data.town.x} cy={data.town.y} r={9 * s} />
              <text className="lx-ex__label" x={data.town.x} y={data.town.y} dy={-18 * s} textAnchor="middle" style={{ fontSize: 22 * s }}>{locale === "ru" ? "Центр Дрокии" : locale === "ro" ? "Centrul orașului" : "Town centre"}</text>
            </>
          ) : null}
          {shown.map((p) => (
            <circle
              key={p.osm}
              className={`lx-ex__pt is-${p.kind}${hover?.osm === p.osm ? " is-hover" : ""}`}
              cx={p.x}
              cy={p.y}
              r={(p.kind === "shop" ? 5 : 8) * s}
              style={{ strokeWidth: 3 * s }}
              onPointerEnter={() => setHover(p)}
              onPointerLeave={() => setHover(null)}
              onClick={() => setHover(p)}
            />
          ))}
          {key === "boundary" && boundaryD ? <path className="lx-ex__boundary" d={boundaryD} style={{ strokeWidth: 3 * s }} /> : null}
          {/* the site — the geocoded address (a point, never a boundary) */}
          <g className="lx-ex__site" transform={`translate(${data.site.x} ${data.site.y}) scale(${s})`}>
            <circle r="30" className="lx-ex__site-halo" />
            <circle r="11" className="lx-ex__site-dot" />
            <text y="-40" textAnchor="middle" className="lx-ex__site-name">Drochia</text>
          </g>
          {hover ? (
            <g transform={`translate(${hover.x} ${hover.y}) scale(${s})`} className="lx-ex__tip" pointerEvents="none">
              <text y="-18" textAnchor="middle">{hover.name ?? c.kinds[hover.kind]?.[locale]}{" · "}{fmtM(dist(hover))}</text>
            </g>
          ) : null}
        </svg>
        {key === "boundary" && !boundaryD ? (
          <div className="lx-ex__pending" role="note">
            <p className="lx-ex__pending-k">{c.pending[locale]}</p>
            <p className="lx-ex__pending-t">{layer.title[locale]}</p>
            <p className="lx-ex__pending-x">{layer.text[locale]}</p>
          </div>
        ) : null}
        <div className="lx-ex__zoom" role="group" aria-label={c.zoomIn[locale]}>
          <button type="button" onClick={() => setZ(zoom * 1.6)} aria-label={c.zoomIn[locale]} disabled={zoom >= MAX}>+</button>
          <button type="button" onClick={() => setZ(zoom / 1.6)} aria-label={c.zoomOut[locale]} disabled={zoom <= 1}>−</button>
          <button type="button" className="lx-ex__reset" onClick={() => { setZoom(1); setCenter({ x: W / 2, y: H / 2 }); }} disabled={zoom === 1}>{c.reset[locale]}</button>
        </div>
        <p className="lx-ex__credit">{data.source} · {data.fetched.split("-").reverse().join(".")}</p>
      </div>

      <div className="lx-ex__detail" role="tabpanel" id="lx-ex-panel" aria-labelledby={`lx-ex-tab-${key}`}>
        <p className="lx-ex__title"><span>{String(active + 1).padStart(2, "0")}</span>{layer.title[locale]}</p>
        {key !== "utilities" ? <p className="lx-ex__text">{layer.text[locale]}</p> : null}
        {detail()}
        <Legend layer={key} locale={locale} />
        <div className="lx-ex__links">
          <a className="lx-link" href={`https://www.google.com/maps/@${data.site.lat},${data.site.lon},17z/data=!3m1!1e3`} target="_blank" rel="noopener noreferrer"><span>{c.satellite[locale]}</span><Icon name="up-right" size={15} /></a>
          <a className="lx-link" href={directions} target="_blank" rel="noopener noreferrer"><span>{c.route[locale]}</span><Icon name="up-right" size={15} /></a>
          {tour ? <a className="lx-link" href={tour}><span>{c.tour[locale]}</span><Icon size={15} /></a> : preview ? <span className="lx-link is-off" aria-disabled="true">{c.tourSoon[locale]}</span> : null}
        </div>
        <p className="lx-note">{layer.source[locale]}</p>
      </div>
    </div>
  );
}

function Legend({ layer, locale }: { layer: LayerKey; locale: SiteLocale }) {
  const items: { k: string; label: string }[] = [{ k: "site", label: c.legend.site[locale] }];
  if (layer === "access") items.push({ k: "road", label: c.legend.road[locale] }, { k: "rail", label: c.legend.rail[locale] }, { k: "station", label: c.kinds.station[locale] }, { k: "fuel", label: c.kinds.fuel[locale] });
  if (layer === "commerce") items.push({ k: "retail", label: c.kinds.retail[locale] }, { k: "trade", label: c.kinds.trade[locale] }, { k: "service", label: c.kinds.service[locale] }, { k: "fuel", label: c.kinds.fuel[locale] }, { k: "ring", label: c.legend.ring[locale] });
  if (layer === "residential") items.push({ k: "residential", label: c.legend.residential[locale] }, { k: "education", label: c.kinds.education[locale] }, { k: "health", label: c.kinds.health[locale] });
  if (layer === "utilities") items.push({ k: "power", label: c.legend.power[locale] }, { k: "substation", label: c.kinds.substation[locale] }, { k: "water", label: c.kinds.water[locale] });
  if (layer === "potential") items.push({ k: "production", label: c.legend.production[locale] }, { k: "trade-zone", label: c.legend.trade[locale] }, { k: "road", label: c.legend.road[locale] });
  if (layer === "context") items.push({ k: "ring", label: c.legend.ring[locale] });
  return (
    <ul className="lx-ex__legend">
      {items.map((i) => <li key={i.k}><i className={`is-${i.k}`} aria-hidden="true" />{i.label}</li>)}
    </ul>
  );
}
