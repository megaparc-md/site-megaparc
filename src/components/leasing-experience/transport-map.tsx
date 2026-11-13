import type { TransitCopy } from "@/data/leasing-experience-model";
import { moscova20Transport, type TransportStop } from "@/data/moscova-20-transport";
import type { SiteLocale } from "@/lib/site-data";

/**
 * TRANSPORT MAP (OWNER «LOCATION VISUAL INTELLIGENCE R4», 2026-11-12, §02–§03) — geography first.
 *
 * Everything on the map is an OSM coordinate projected to metres from the customer entrance (the generated layer
 * src/data/moscova-20-transport.ts); nothing is placed by eye. Hierarchy:
 *   1 · Moscova 20 — the premises as a building, the name, the entrance point;
 *   2 · the nearest confirmed stop — the only filled burgundy symbol, with its own walking distance and time;
 *   3 · the real walking route from the entrance — a thin burgundy line (the route to the opposite direction: a quiet dotted line);
 *   4 · the other stops — small outlined symbols with their names and their own distances;
 *   5 · a calm straight-line ring (≈ 250 m from the entrance) — background, never an isochrone.
 * No unnamed squares: a stop is shown only with a name and a reason. Two crops of the same geography: `wide` (4 : 3, desktop and
 * tablets) and `tall` (2 : 3, phones) — the phone map is its own composition, not the desktop map scaled down.
 */

const fill = (template: string, m: number, min: number | null) => template.replace("{m}", String(Math.round(m / 10) * 10)).replace("{min}", String(min ?? ""));

/** where the name of a stop sits, by crop: dx / dy in metres from the symbol, the text anchor */
type Place = { dx: number; dy: number; anchor: "start" | "end" | "middle" };
const PLACE: Record<string, { wide: Place; tall: Place }> = {
  "matei-basarab-near": { wide: { dx: 17, dy: -3, anchor: "start" }, tall: { dx: 17, dy: -3, anchor: "start" } },
  "matei-basarab-far": { wide: { dx: -15, dy: -2, anchor: "end" }, tall: { dx: 0, dy: 26, anchor: "middle" } },
  "studentilor-near": { wide: { dx: 15, dy: -2, anchor: "start" }, tall: { dx: 15, dy: -2, anchor: "start" } },
  "studentilor-far": { wide: { dx: -15, dy: -2, anchor: "end" }, tall: { dx: -15, dy: -2, anchor: "end" } },
};

/** a small bus pictogram centred on 0,0 (≈ 9 × 10 units) — the body is `fg`, the windscreen is cut in `cut` */
function BusGlyph({ fg, cut, scale = 1 }: { fg: string; cut: string; scale?: number }) {
  return (
    <g transform={`scale(${scale})`}>
      <rect x="-4.4" y="-5" width="8.8" height="9" rx="1.7" fill={fg} />
      <rect x="-3.1" y="-3.6" width="6.2" height="3.5" rx=".6" fill={cut} />
      <rect x="-3.6" y="3.4" width="2" height="1.9" rx=".5" fill={fg} />
      <rect x="1.6" y="3.4" width="2" height="1.9" rx=".5" fill={fg} />
      <rect x="-3.2" y="1.2" width="1.5" height="1" rx=".4" fill={cut} />
      <rect x="1.7" y="1.2" width="1.5" height="1" rx=".4" fill={cut} />
    </g>
  );
}

function Stop({ stop, name, sub, crop }: { stop: TransportStop; name: string; sub: string; crop: "wide" | "tall" }) {
  const nearest = stop.role === "nearest";
  const place = PLACE[stop.key]?.[crop] ?? { dx: 15, dy: -2, anchor: "start" as const };
  return (
    <g className={`lg-tr__stop is-${stop.role}`} transform={`translate(${stop.x} ${stop.y})`}>
      {nearest ? <circle r="17" className="lg-tr__stop-halo" /> : null}
      <circle r={nearest ? 11 : 8.2} className="lg-tr__stop-dot" />
      <BusGlyph fg={nearest ? "#fff" : "#1c1d21"} cut={nearest ? "#74202f" : "#fff"} scale={nearest ? 1.08 : 0.86} />
      <text className="lg-tr__stop-name" x={place.dx} y={place.dy} textAnchor={place.anchor}>{name}</text>
      <text className="lg-tr__stop-sub" x={place.dx} y={place.dy + (crop === "tall" ? 17 : 15)} textAnchor={place.anchor}>{sub}</text>
    </g>
  );
}

export function MapSvg({ copy, name, locale, crop }: { copy: TransitCopy; name: string; locale: SiteLocale; crop: "wide" | "tall" }) {
  const t = moscova20Transport;
  const [x, y, w, h] = t.frame[crop];
  const nearest = t.stops.find((stop) => stop.role === "nearest");
  const opposite = t.stops.find((stop) => stop.role === "opposite");
  // the ring label sits on the ring where nothing else is drawn: to the east on the wide crop, at the bottom on the phone crop
  const a = crop === "tall" ? Math.PI / 2 - 0.2 : -0.36;
  const ringAt = { x: t.ring * Math.cos(a), y: t.ring * Math.sin(a) };
  return (
    <svg className={`lg-tr__svg is-${crop}`} viewBox={`${x} ${y} ${w} ${h}`} preserveAspectRatio="xMidYMid slice" role="img" aria-label={copy.aria[locale]}>
      <rect x={x} y={y} width={w} height={h} className="lg-tr__ground" />
      {t.green ? <path d={t.green} className="lg-tr__green" /> : null}
      <path d={t.buildings} className="lg-tr__building" />
      <path d={t.roads.path} className="lg-tr__road is-path" />
      <path d={t.roads.service} className="lg-tr__road is-service" />
      <path d={`${t.roads.minor}${t.roads.local}`} className="lg-tr__road is-minor-case" />
      <path d={t.roads.major} className="lg-tr__road is-major-case" />
      <path d={`${t.roads.minor}${t.roads.local}`} className="lg-tr__road is-minor" />
      <path d={t.roads.major} className="lg-tr__road is-major" />
      {copy.streets.map((street) => {
        const at = crop === "tall" && street.tall ? street.tall : street;
        return <text key={street.key} className="lg-tr__street" x={at.x} y={at.y} transform={`rotate(${street.angle} ${at.x} ${at.y})`} textAnchor="middle">{street.label[locale]}</text>;
      })}

      {/* 5 · the calm ring */}
      <circle r={t.ring} className="lg-tr__ring" />
      <text className="lg-tr__ring-label" x={ringAt.x + 7} y={ringAt.y - 7 + (crop === "tall" ? 2 : 0)}>{`≈ ${t.ring} ${locale === "ru" ? "м" : "m"}`}</text>

      {/* quiet marks of the pedestrian crossings */}
      <g className="lg-tr__crossings">
        {t.crossings.map((c) => (
          <g key={`${c.x}:${c.y}`} transform={`translate(${c.x} ${c.y})`}>
            <rect x="-4" y="-4" width="8" height="8" rx="1.4" />
            <path d="M-2 -2.3V2.3M0 -2.3V2.3M2 -2.3V2.3" />
          </g>
        ))}
      </g>

      {/* 3 · the walking routes from the entrance */}
      {opposite?.path ? <path d={opposite.path} className="lg-tr__walk is-opposite" /> : null}
      {nearest?.path ? <><path d={nearest.path} className="lg-tr__walk is-case" /><path d={nearest.path} className="lg-tr__walk is-nearest" /></> : null}

      {/* 4 · 2 · the stops */}
      {t.stops.filter((stop) => stop.role !== "nearest").map((stop) => (
        <Stop key={stop.key} stop={stop} crop={crop} name={copy.stops[stop.key]?.[locale] ?? stop.osmName} sub={stop.walkM ? fill(copy.walkShort[locale], stop.walkM, stop.walkMin) : ""} />
      ))}
      {nearest ? <Stop stop={nearest} crop={crop} name={copy.stops[nearest.key]?.[locale] ?? nearest.osmName} sub={nearest.walkM ? fill(copy.walkShort[locale], nearest.walkM, nearest.walkMin) : ""} /> : null}

      {/* 1 · Moscova 20 */}
      <circle cx="4" cy="-2" r="27" className="lg-tr__premises-halo" />
      <path d={t.premises} className="lg-tr__premises" />
      <circle r="3.4" className="lg-tr__entrance" />
      <text className="lg-tr__name" x={crop === "tall" ? 38 : 40} y="2">{name}</text>

      {/* north and scale — a map, not an illustration */}
      <g className="lg-tr__scale" transform={`translate(${x + (crop === "tall" ? 16 : 22)} ${y + h - (crop === "tall" ? 18 : 22)})`}>
        <path d="M0 -5V0H100V-5M50 -3V0" />
        <text x="50" y="-9" textAnchor="middle">100 {locale === "ru" ? "м" : "m"}</text>
      </g>
      <g className="lg-tr__north" transform={`translate(${x + w - (crop === "tall" ? 22 : 30)} ${y + h - (crop === "tall" ? 24 : 30)})`}>
        <path d="M0 -13L4.6 4L0 1.2L-4.6 4Z" />
        <text x="0" y="17" textAnchor="middle">N</text>
      </g>
    </svg>
  );
}

export function TransportMap({ copy, name, locale }: { copy: TransitCopy; name: string; locale: SiteLocale }) {
  return (
    <figure className="lg-tr">
      <MapSvg copy={copy} name={name} locale={locale} crop="wide" />
      <MapSvg copy={copy} name={name} locale={locale} crop="tall" />
    </figure>
  );
}

/** «От остановки — к вашему бизнесу.» — the commercial reading of the map, beside it: the nearest stop, the walk, the routes, the access. */
export function TransitBrief({ copy, locale }: { copy: TransitCopy; locale: SiteLocale }) {
  const t = moscova20Transport;
  const nearest = t.stops.find((stop) => stop.role === "nearest");
  const opposite = t.stops.find((stop) => stop.role === "opposite");
  if (!nearest || !nearest.walkM) return null;
  const [key, rest] = fill(copy.walkValue[locale], nearest.walkM, nearest.walkMin).split("|");
  const quote = (text: string) => (locale === "ru" ? `«${text}»` : locale === "ro" ? `„${text}”` : `“${text}”`);
  return (
    <div className="lg-transit">
      <p className="lg-transit__title">{copy.title[locale]}</p>
      {/* the main argument (OWNER decision 2026-11-12) and, with it, what kind of figure it is */}
      <p className="lg-transit__key"><b>{key}</b> {rest}</p>
      <p className="lg-transit__estimate">{copy.estimate[locale]}</p>
      <dl className="lg-transit__rows">
        <div>
          <dt>{copy.labels.nearest[locale]}</dt>
          <dd><strong>{quote(copy.stops[nearest.key]?.[locale] ?? nearest.osmName)}</strong><span>{copy.labels.nearestNote[locale]}</span></dd>
        </div>
        <div>
          <dt>{copy.labels.routes[locale]}</dt>
          <dd className="lg-transit__routes">
            {copy.routes.map((group) => (
              <span key={group.mode} className={`lg-transit__mode is-${group.mode}`}><i>{group.label[locale]}</i>{group.refs.map((ref) => <b key={ref}>{ref}</b>)}</span>
            ))}
          </dd>
        </div>
        <div>
          <dt>{copy.labels.access[locale]}</dt>
          <dd><strong>{copy.labels.accessValue[locale]}</strong></dd>
        </div>
      </dl>
      {opposite?.walkM ? <p className="lg-transit__opposite">{fill(copy.opposite[locale], opposite.walkM, opposite.walkMin)}</p> : null}
      <ul className="lg-transit__legend" aria-hidden="true">
        <li className="is-premises"><i />{copy.legend.premises[locale]}</li>
        <li className="is-nearest"><i />{copy.legend.nearest[locale]}</li>
        <li className="is-other"><i />{copy.legend.other[locale]}</li>
        <li className="is-walk"><i />{copy.legend.walk[locale]}</li>
        <li className="is-crossing"><i />{copy.legend.crossing[locale]}</li>
        <li className="is-ring"><i />{copy.legend.ring[locale]}</li>
      </ul>
      <p className="lg-transit__note">{copy.note[locale]}</p>
    </div>
  );
}
