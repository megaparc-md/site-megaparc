import type { GrowthCopy } from "@/data/leasing-experience-model";
import { moscova20Catchment } from "@/data/moscova-20-catchment";
import type { SiteLocale } from "@/lib/site-data";

/**
 * DISTRICT GROWTH LAYER (OWNER addendum «RÎȘCANI DEVELOPMENT RESEARCH», 2026-11-12) — a map of its own: the projects that change
 * the district around Moscova 20, never mixed with the public-transport stops. Base = the streets and parks of the surroundings map
 * (same projection: 1000 × 1000 units = 2 700 m, the address point at the centre), the 400 / 800 m straight-line radii as a calm
 * background, then:
 *   · the plot of the former Mezon plant as an area (its OSM outline) — a plan, not a building site: a burgundy hatch, no fill;
 *   · the numbered points of the other verified projects, by status (planned · built · announced).
 * Only what the research could verify is drawn (docs/research/RISCANI_DEVELOPMENT_2026.md); unverified OSM construction tags are not.
 * Two crops of the same geography: `wide` (tablets, desktop) and `tall` (phones).
 */

const C = { lat: 47.0568696, lon: 28.8667886 }; // the address point of the surroundings map (scripts/moscova-20-catchment-map.mjs)
const rad = (d: number) => (d * Math.PI) / 180;
const at = (lat: number, lon: number): [number, number] => {
  const c = moscova20Catchment;
  const x = c.size / 2 + (((lon - C.lon) * Math.cos(rad(C.lat)) * 111320) / c.span) * c.size;
  const y = c.size / 2 - (((lat - C.lat) * 111195) / c.span) * c.size;
  return [Math.round(x * 10) / 10, Math.round(y * 10) / 10];
};

const CROP = { wide: [200, 200, 600, 600], tall: [262, 278, 344, 400] } as const;

function MapSvg({ copy, name, locale, crop }: { copy: GrowthCopy; name: string; locale: SiteLocale; crop: "wide" | "tall" }) {
  const c = moscova20Catchment;
  const mid = c.size / 2;
  const [x, y, w, h] = CROP[crop];
  const rings = c.rings.filter((ring) => ring.m <= 800);
  return (
    <svg className={`lg-catch__svg lg-grow__svg is-${crop}`} viewBox={`${x} ${y} ${w} ${h}`} role="img" aria-label={copy.aria[locale]}>
      <defs>
        <pattern id={`lg-grow-hatch-${crop}`} width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="7" className="lg-grow__hatch" />
        </pattern>
      </defs>
      <rect x="0" y="0" width={c.size} height={c.size} className="lg-catch__ground" />
      <path d={c.parks} className="lg-catch__park" />
      <path d={c.roads.local} className="lg-catch__road is-local" />
      <path d={c.roads.minor} className="lg-catch__road is-minor" />
      <path d={c.roads.major} className="lg-catch__road is-major-case" />
      <path d={c.roads.major} className="lg-catch__road is-major" />
      {rings.map((ring, i) => (
        <circle key={ring.m} cx={mid} cy={mid} r={ring.r} className={`lg-catch__ring lg-grow__ring is-${i}`} />
      ))}
      {rings.map((ring) => {
        // the label sits on the ring where no project is drawn: to the south-east
        const a = crop === "tall" ? Math.PI / 2 + 0.25 : Math.PI / 4;
        return <text key={ring.m} x={mid + ring.r * Math.cos(a) + 6} y={mid + ring.r * Math.sin(a) + (crop === "tall" ? -8 : 16)} className="lg-catch__ringlabel lg-grow__ringlabel">{`≈ ${ring.m} ${locale === "ru" ? "м" : "m"}`}</text>;
      })}

      {/* the plan area */}
      <path d={copy.zone.path} className="lg-grow__zone" fill={`url(#lg-grow-hatch-${crop})`} />

      {/* the numbered projects */}
      {copy.projects.map((project, i) => {
        const [px, py] = project.at ?? at(project.lat, project.lon);
        return (
          <g key={project.key} transform={`translate(${px} ${py})`}>
            <g className={`lg-grow__pin is-${project.status}`}>
              <circle r="12" />
              <text y="0.6" textAnchor="middle">{i + 1}</text>
            </g>
          </g>
        );
      })}

      {/* Moscova 20 */}
      <circle cx={mid} cy={mid} r="17" className="lg-catch__halo lg-grow__halo" />
      <circle cx={mid} cy={mid} r="7.5" className="lg-catch__here lg-grow__here" />
      {crop === "tall" ? <text x={mid} y={mid + 38} textAnchor="middle" className="lg-catch__name lg-grow__name">{name}</text> : <text x={mid + 17} y={mid + 24} className="lg-catch__name lg-grow__name">{name}</text>}
    </svg>
  );
}

export function GrowthMap({ copy, name, locale }: { copy: GrowthCopy; name: string; locale: SiteLocale }) {
  return (
    <figure className="lg-catch lg-grow">
      <MapSvg copy={copy} name={name} locale={locale} crop="wide" />
      <MapSvg copy={copy} name={name} locale={locale} crop="tall" />
    </figure>
  );
}

/** «Район развивается. Возможности растут.» — the premium card beside the layer: the plan opposite, its status, what is already built, what it means. */
export function GrowthBrief({ copy, locale }: { copy: GrowthCopy; locale: SiteLocale }) {
  return (
    <div className="lg-growth">
      <p className="lg-growth__kicker">{copy.kicker[locale]}</p>
      <p className="lg-growth__title">{copy.title[locale]}</p>
      <p className="lg-growth__lead">{copy.lead[locale]}</p>
      <dl className="lg-growth__figs">
        {copy.facts.map((fact) => (
          <div key={fact.key}>
            <dd>{fact.value[locale]}</dd>
            <dt>{fact.label[locale]}</dt>
          </div>
        ))}
      </dl>
      <ol className="lg-growth__list">
        {copy.projects.map((project, i) => (
          <li key={project.key} className={`is-${project.status}`}>
            <b>{i + 1}</b>
            <span><strong>{project.name[locale]}</strong> <em>{copy.status[project.status][locale]}</em><br />{project.text[locale]}</span>
          </li>
        ))}
      </ol>
      <p className="lg-growth__state"><b>{copy.stateLabel[locale]}</b> {copy.state[locale]}</p>
      <p className="lg-growth__balance"><b>{copy.balanceLabel[locale]}</b> {copy.balance[locale]}</p>
      <p className="lg-growth__note">{copy.note[locale]}</p>
    </div>
  );
}
