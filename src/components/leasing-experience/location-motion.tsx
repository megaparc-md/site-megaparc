import type { ReactNode } from "react";
import { LocationStage } from "@/components/leasing-experience/location-stage";
import { OpenFrom } from "@/components/leasing-experience/open-from";
import { LgHead, ownerPreview, ui } from "@/components/leasing-experience/parts";
import { PhotoScene, pathOf } from "@/components/leasing-experience/photo-scene";
import { LocationMap } from "@/components/location-section";
import { Icon } from "@/components/ui";
import { viewingEnabled, type ProjectEntry } from "@/content/source";
import { publishable, type LeasingExperience, type Pt, type VisibilityMark } from "@/data/leasing-experience-model";
import type { AvailableSpace } from "@/data/leasing-inventory";
import { moscova20Catchment, type CatchmentCategory } from "@/data/moscova-20-catchment";
import { locationTraffic, toolVisible, trafficVisible, type LocationTraffic } from "@/data/tenant-intelligence";
import { googleDirectionsUrl, googleMapsUrl } from "@/lib/assets";
import type { Localized, SiteLocale } from "@/lib/site-data";

/**
 * SCENE 02 — «ЛОКАЦИЯ В ДВИЖЕНИИ» · PROOF, the visual centre (OWNER "LOCATION
 * INTELLIGENCE + VIEWING CONVERSION PASS" and "FINAL VIEWING CONVERSION PASS",
 * 2026-11-06). The address as movement: the surroundings map (≈ 5 / 10 / 15 min
 * walk, OSM points by category), how the property is seen from the boulevard
 * (confirmed elements on the real aerial), the PRELIMINARY MEGAPARC LOCATION
 * MODEL and the rhythm of the day, the ecosystem in four groups, then the
 * verdict and the action. Wording rule: activity «вокруг локации», never
 * «станут вашими покупателями».
 *
 * Gating (src/data/tenant-intelligence.ts): the model, the map, the visibility
 * marks and the economics link render only in the OWNER preview until the
 * OWNER approves them; a production build shows the OSM location module, the
 * plain aerial and the ecosystem copy.
 */

const copy = {
  stage: { ro: "Vederi ale locației", ru: "Виды локации", en: "Location views" },
  filters: { ro: "Straturi ale hărții", ru: "Слои карты", en: "Map layers" },
  cat: {
    education: { ro: "Educație", ru: "Образование", en: "Education" },
    transport: { ro: "Transport", ru: "Транспорт", en: "Transport" },
    grocery: { ro: "Alimentare", ru: "Продукты", en: "Groceries" },
    pharmacy: { ro: "Farmacii", ru: "Аптеки", en: "Pharmacies" },
    services: { ro: "Servicii", ru: "Услуги", en: "Services" },
    roads: { ro: "Artere principale", ru: "Магистрали", en: "Main roads" },
  } satisfies Record<CatchmentCategory | "roads", Localized>,
  minutes: { ro: "min", ru: "мин", en: "min" },
  walk: { ro: "pe jos", ru: "пешком", en: "walk" },
  figure: {
    vehicles: { label: { ro: "Automobile", ru: "Автомобили", en: "Vehicles" }, unit: { ro: "auto / zi", ru: "авто / сутки", en: "vehicles / day" } },
    pedestrians: { label: { ro: "Pietoni", ru: "Пешеходы", en: "Pedestrians" }, unit: { ro: "deplasări / zi", ru: "перемещений / сутки", en: "movements / day" } },
    transit: { label: { ro: "Transport public", ru: "Общественный транспорт", en: "Public transport" }, unit: { ro: "rute", ru: "маршрутов", en: "routes" } },
    peak: { label: { ro: "Vârf", ru: "Пик", en: "Peak" }, unit: { ro: "seara", ru: "вечером", en: "in the evening" } },
  },
  status: {
    MODELLED: { ro: "Model preliminar MEGAPARC", ru: "Предварительная модель MEGAPARC", en: "Preliminary MEGAPARC model" },
    MEASURED: { ro: "Numărătoare pe teren MEGAPARC", ru: "Полевой замер MEGAPARC", en: "MEGAPARC field count" },
    VERIFIED: { ro: "Date verificate", ru: "Проверенные данные", en: "Verified data" },
  },
  series: {
    auto: { ro: "Auto", ru: "Авто", en: "Vehicles" },
    pedestrian: { ro: "Pietoni", ru: "Пешеходы", en: "Pedestrians" },
    transit: { ro: "Transport public", ru: "Транспорт", en: "Transit" },
  },
  peakBand: { ro: "vârf", ru: "пик", en: "peak" },
  hour: {
    morning: { ro: "dimineața: activitate constantă", ru: "утро: устойчивая активность", en: "morning: steady activity" },
    day: { ro: "ziua: activitate medie", ru: "день: средняя активность", en: "daytime: medium activity" },
    peak: { ro: "seara: vârf", ru: "вечер: пик", en: "evening: peak" },
    late: { ro: "seara târziu: scădere", ru: "поздний вечер: спад", en: "late evening: easing" },
  },
  chartLabel: { ro: "Ritmul zilei 08–20 după modelul preliminar: dimineața constant, ziua mediu, seara vârf între 16 și 19. Fără valori.", ru: "Ритм дня 08–20 по предварительной модели: утром устойчиво, днём средне, вечером пик с 16 до 19. Без значений.", en: "The day's rhythm 08–20 in the preliminary model: steady in the morning, medium in the day, a peak from 16 to 19. No values." },
} as const;

const fmt = (n: number, locale: SiteLocale) => n.toLocaleString(locale === "ru" ? "ru-RU" : locale === "ro" ? "ro-RO" : "en-GB");
const range = (low: number | null, high: number | null, locale: SiteLocale) => (low !== null && high !== null ? `${fmt(low, locale)}–${fmt(high, locale)}` : null);

/* ------------------------------------------------------------ catchment map */

function CatchmentMap({ name, locale, caption }: { name: string; locale: SiteLocale; caption: string }) {
  const c = moscova20Catchment;
  const mid = c.size / 2;
  const cats = Object.keys(c.pois) as CatchmentCategory[];
  return (
    <figure className="lg-catch">
      <svg className="lg-catch__svg" viewBox="60 60 880 880" role="img" aria-label={`${name} — ${caption}`}>
        <rect x="0" y="0" width={c.size} height={c.size} className="lg-catch__ground" />
        <path d={c.parks} className="lg-catch__park" />
        <path d={c.roads.local} className="lg-catch__road is-local" />
        <path d={c.roads.minor} className="lg-catch__road is-minor" />
        <path d={c.roads.major} className="lg-catch__road is-major-case" />
        <path d={c.roads.major} className="lg-catch__road is-major" />
        {c.rings.map((ring, i) => (
          <circle key={ring.m} cx={mid} cy={mid} r={ring.r} className={`lg-catch__ring is-${i}`} />
        ))}
        {cats.map((cat) => (
          <g key={cat} className={`lg-catch__poi is-${cat}`}>
            {c.pois[cat].map(([x, y]) => (cat === "transport" ? <rect key={`${x}-${y}`} x={x - 5} y={y - 5} width="10" height="10" /> : <circle key={`${x}-${y}`} cx={x} cy={y} r="5.5" />))}
          </g>
        ))}
        {c.rings.map((ring) => {
          const a = Math.PI / 4;
          const x = mid + ring.r * Math.cos(a);
          const y = mid - ring.r * Math.sin(a);
          return (
            <text key={ring.m} x={x + 8} y={y - 8} className="lg-catch__ringlabel">{`≈ ${ring.minutes} ${copy.minutes[locale]}`}</text>
          );
        })}
        <circle cx={mid} cy={mid} r="26" className="lg-catch__halo" />
        <circle cx={mid} cy={mid} r="11" className="lg-catch__here" />
        <text x={mid + 24} y={mid + 40} className="lg-catch__name">{name}</text>
      </svg>
      <figcaption className="lg-stage__caption">{caption}</figcaption>
    </figure>
  );
}

/* ------------------------------------------------------------ day rhythm */

function DayRhythm({ traffic, locale }: { traffic: LocationTraffic; locale: SiteLocale }) {
  const W = 640, H = 212, X0 = 30, X1 = 548, Y0 = 182, YH = 148;
  const hours = traffic.dayProfile;
  const first = hours[0].hour;
  const last = hours[hours.length - 1].hour;
  const x = (hour: number) => X0 + ((hour - first) / (last - first)) * (X1 - X0);
  const y = (level: number) => Y0 - level * YH;
  const line = (key: "auto" | "pedestrian" | "transit") => hours.map((h, i) => `${i ? "L" : "M"}${x(h.hour).toFixed(1)} ${y(h[key]).toFixed(1)}`).join("");
  const [p0, p1] = (traffic.peakPeriod ?? "16:00–19:00").split("–").map((part) => Number(part.slice(0, 2)));
  // direct labels at the right edge, kept at least 15 units apart
  const ends = (["auto", "pedestrian", "transit"] as const).map((key) => ({ key, y: y(hours[hours.length - 1][key]) })).sort((a, b) => a.y - b.y);
  for (let i = 1; i < ends.length; i++) if (ends[i].y - ends[i - 1].y < 15) ends[i].y = ends[i - 1].y + 15;
  const word = (hour: number) => (hour < 10 ? copy.hour.morning : hour >= p0 && hour < p1 ? copy.hour.peak : hour >= p1 ? copy.hour.late : copy.hour.day)[locale];
  return (
    <figure className="lg-rhythm">
      <ul className="lg-rhythm__legend">
        {(["auto", "pedestrian", "transit"] as const).map((key) => (
          <li key={key} className={`is-${key}`}><i aria-hidden="true" />{copy.series[key][locale]}</li>
        ))}
      </ul>
      <svg viewBox={`0 0 ${W} ${H}`} className="lg-rhythm__svg" role="img" aria-label={copy.chartLabel[locale]}>
        <rect x={x(p0)} y={Y0 - YH - 14} width={x(p1) - x(p0)} height={YH + 14} className="lg-rhythm__peak" />
        <text x={(x(p0) + x(p1)) / 2} y={Y0 - YH - 20} textAnchor="middle" className="lg-rhythm__peaklabel">{`${copy.peakBand[locale]} ${traffic.peakPeriod ?? ""}`}</text>
        <line x1={X0} x2={X1} y1={Y0} y2={Y0} className="lg-rhythm__base" />
        {hours.filter((h) => h.hour % 2 === 0).map((h) => (
          <text key={h.hour} x={x(h.hour)} y={Y0 + 20} textAnchor="middle" className="lg-rhythm__tick">{String(h.hour).padStart(2, "0")}</text>
        ))}
        <path d={line("transit")} className="lg-rhythm__line is-transit" />
        <path d={line("pedestrian")} className="lg-rhythm__line is-pedestrian" />
        <path d={line("auto")} className="lg-rhythm__line is-auto" />
        {ends.map((end) => (
          <text key={end.key} x={X1 + 10} y={end.y + 4} className={`lg-rhythm__end is-${end.key}`}>{copy.series[end.key][locale]}</text>
        ))}
        {hours.map((h, i) => {
          const left = i ? (x(hours[i - 1].hour) + x(h.hour)) / 2 : X0;
          const right = i < hours.length - 1 ? (x(h.hour) + x(hours[i + 1].hour)) / 2 : X1;
          return (
            <rect key={h.hour} x={left} y={Y0 - YH - 14} width={right - left} height={YH + 34} className="lg-rhythm__hit">
              <title>{`${String(h.hour).padStart(2, "0")}:00 — ${word(h.hour)}`}</title>
            </rect>
          );
        })}
      </svg>
    </figure>
  );
}

/* ------------------------------------------------------------ visibility */

function markDrawing(mark: VisibilityMark): ReactNode {
  const [a, b] = mark.shape as [Pt, Pt];
  if (mark.kind === "object") return <path key={mark.key} d={pathOf(mark.shape)} className="lg-vis__object" />;
  if (mark.kind === "glazing") return <path key={mark.key} d={pathOf(mark.shape, false)} className="lg-vis__glazing" />;
  // arrows: a line with a head at the end (entrance) or at both ends (pavement, road)
  const head = (from: Pt, to: Pt) => {
    const ang = Math.atan2(to[1] - from[1], to[0] - from[0]);
    const s = mark.kind === "road" ? 26 : 18;
    const p1: Pt = [to[0] - s * Math.cos(ang - 0.45), to[1] - s * Math.sin(ang - 0.45)];
    const p2: Pt = [to[0] - s * Math.cos(ang + 0.45), to[1] - s * Math.sin(ang + 0.45)];
    return `M${p1[0].toFixed(1)} ${p1[1].toFixed(1)} L${to[0]} ${to[1]} L${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
  };
  const both = mark.kind !== "entrance";
  return (
    <g key={mark.key} className={`lg-vis__arrow is-${mark.kind}`}>
      <path d={`M${a[0]} ${a[1]} L${b[0]} ${b[1]}`} />
      <path d={head(a, b)} />
      {both ? <path d={head(b, a)} /> : null}
    </g>
  );
}

function VisibilityStudy({ x, locale, marked }: { x: LeasingExperience; locale: SiteLocale; marked: boolean }) {
  const v = x.motion.visibility;
  const marks = marked ? v.marks.filter((mark) => publishable(mark.evidence)) : [];
  return (
    <figure className="lg-vis">
      <PhotoScene
        photo={x.photos[v.photo]}
        locale={locale}
        sizes="(min-width: 1024px) 56vw, 100vw"
        drawing={marks.map(markDrawing)}
        labels={marks.map((mark, i) => ({ key: mark.key, no: String(i + 1), text: mark.label[locale], at: mark.at, tone: "mark" }))}
      />
      {marks.length ? (
        <ol className="lg-scene__legend">
          {marks.map((mark, i) => (
            <li key={mark.key}><b>{i + 1}</b>{mark.label[locale]}</li>
          ))}
        </ol>
      ) : null}
      <figcaption className="lg-stage__caption">{marks.length ? v.caption[locale] : x.photos[v.photo].alt[locale]}</figcaption>
    </figure>
  );
}

/* ------------------------------------------------------------ scene */

export function LocationMotion({ x, unit, project, locale }: { x: LeasingExperience; unit: AvailableSpace; project: ProjectEntry; locale: SiteLocale }) {
  const m = x.motion;
  const open = viewingEnabled(unit);
  const traffic = locationTraffic[x.project];
  const modelOn = trafficVisible(traffic, ownerPreview) && toolVisible(`${x.project}.location-model`, ownerPreview);
  const mapOn = toolVisible(`${x.project}.catchment-map`, ownerPreview);
  const marksOn = toolVisible(`${x.project}.visibility-study`, ownerPreview);
  const economicsOn = toolVisible(`${x.project}.economics-tool`, ownerPreview);
  const map = project.asset?.map ?? null;

  const views = [
    mapOn ? (
      <CatchmentMap key="map" name={project.name} locale={locale} caption={m.mapCaption[locale]} />
    ) : (
      <LocationMap key="map" locale={locale} mapKey={x.project} name={project.name} place={x.hero.place[locale]} className="lg-motion__osm" />
    ),
    <VisibilityStudy key="vis" x={x} locale={locale} marked={marksOn} />,
  ];

  const figures =
    modelOn && traffic
      ? [
          { key: "vehicles", value: range(traffic.vehicleLow, traffic.vehicleHigh, locale), ...copy.figure.vehicles },
          { key: "pedestrians", value: range(traffic.pedestrianLow, traffic.pedestrianHigh, locale), ...copy.figure.pedestrians },
          { key: "transit", value: traffic.transportRoutes, ...copy.figure.transit },
          { key: "peak", value: traffic.peakPeriod, ...copy.figure.peak },
        ].filter((figure) => figure.value)
      : [];

  const ecosystem = (
    <ul className="lg-eco">
      {m.ecosystem.map((group) => (
        <li key={group.key} className={`lg-eco__item is-${group.category}`}>
          <h3>{group.title[locale]}</h3>
          <p>{group.text[locale]}</p>
        </li>
      ))}
    </ul>
  );

  return (
    <section id="location" className="lg-sec lg-sec--paper lg-motion" aria-labelledby="lg-motion-title">
      <div className="xp-shell">
        <LgHead heading={m} locale={locale} id="lg-motion-title" layout="split" />
        <div className="lg-motion__grid">
          <div className="lg-motion__stage" data-reveal>
            <LocationStage
              label={copy.stage[locale]}
              filterLabel={copy.filters[locale]}
              tabs={[{ key: "map", label: m.mapTab[locale] }, { key: "vis", label: m.visibilityTab[locale] }]}
              views={views}
              filters={mapOn ? (["education", "transport", "grocery", "pharmacy", "services", "roads"] as const).map((key) => ({ key, label: copy.cat[key][locale] })) : []}
            />
            {map ? (
              <p className="lg-motion__links">
                <a className="pm-link" href={googleDirectionsUrl(map)} target="_blank" rel="noopener noreferrer"><span>{ui.route[locale]}</span><Icon name="up-right" /></a>
                <a className="pm-link pm-link--quiet" href={googleMapsUrl(map)} target="_blank" rel="noopener noreferrer"><span>{ui.openMap[locale]}</span><Icon name="up-right" /></a>
              </p>
            ) : null}
          </div>
          <div className="lg-motion__data">
            {figures.length && traffic ? (
              <div className="lg-model" data-reveal>
                <p className="lg-label lg-model__status">{traffic.trafficStatus === "MODELLED" ? m.modelTitle[locale] : copy.status[traffic.trafficStatus][locale]}{traffic.measurementDate ? ` · ${traffic.measurementDate}` : ""}</p>
                <dl className="lg-model__figs">
                  {figures.map((figure) => (
                    <div key={figure.key} className={`is-${figure.key}`}>
                      <dt>{figure.label[locale]}</dt>
                      <dd><strong>{figure.value}</strong><span>{figure.unit[locale]}</span></dd>
                    </div>
                  ))}
                </dl>
                <p className="lg-model__caption">{traffic.trafficStatus === "MODELLED" ? m.modelCaption[locale] : traffic.source}</p>
                <OpenFrom min={720} className="lg-model__rhythm" summary={<span className="lg-label">{m.rhythmTitle[locale]}</span>}>
                  <DayRhythm traffic={traffic} locale={locale} />
                  <p className="lg-model__note">{m.rhythmNote[locale]}</p>
                </OpenFrom>
              </div>
            ) : null}
            <div className={`lg-motion__eco${figures.length ? "" : " is-first"}`} data-reveal>
              <p className="lg-label">{m.ecosystemTitle[locale]}</p>
              {ecosystem}
            </div>
          </div>
        </div>
        <div className="lg-motion__close" data-reveal>
          <div className="lg-motion__verdict">
            <p className="lg-motion__verdict-title">{m.verdict.title[locale]}</p>
            <p>{m.verdict.text[locale]}</p>
          </div>
          <div className="lg-motion__cta">
            <p className="lg-motion__cta-title">{m.cta.title[locale]}</p>
            <p>{m.cta.text[locale]}</p>
            <div className="lg-motion__actions">
              <a className="btn" href="#format"><span>{ui.checkForMe[locale]}</span><Icon /></a>
              <a className="btn btn--ghost" href="#viewing" data-intent="viewing"><span>{open ? ui.viewing[locale] : ui.waitlist[locale]}</span><Icon /></a>
            </div>
            {economicsOn ? (
              <a className="pm-link lg-motion__economics" href="#economics" data-drawer="economics" aria-haspopup="dialog"><span>{ui.economics[locale]}</span><Icon /></a>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
