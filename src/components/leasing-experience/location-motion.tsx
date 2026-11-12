import { accentLast } from "@/components/accent";
import { AerialAnnotation, AerialLegend } from "@/components/leasing-experience/aerial-annotation";
import type { CSSProperties } from "react";
import { LocationExplorer, type ExplorerOption } from "@/components/leasing-experience/location-stage";
import { decisionTitle } from "@/components/leasing-experience/decision-zone";
import { GrowthBrief, GrowthMap } from "@/components/leasing-experience/growth-map";
import type { TemplateOffer } from "@/components/leasing-experience/offer";
import { EconomicsGlyph, ownerPreview, ui } from "@/components/leasing-experience/parts";
import { PhotoScene } from "@/components/leasing-experience/photo-scene";
import { TransitBrief, TransportMap } from "@/components/leasing-experience/transport-map";
import { LocationMap } from "@/components/location-section";
import { Icon } from "@/components/ui";
import type { ProjectEntry } from "@/content/source";
import { T, publishable, type LeasingExperience } from "@/data/leasing-experience-model";
import { moscova20Catchment, type CatchmentCategory } from "@/data/moscova-20-catchment";
import { locationTraffic, toolVisible, trafficVisible, type LocationTraffic } from "@/data/tenant-intelligence";
import { googleDirectionsUrl, googleMapsUrl } from "@/lib/assets";
import type { Localized, SiteLocale } from "@/lib/site-data";

/**
 * SCENE — «ЛОКАЦИЯ В ДВИЖЕНИИ» as a hero scene with progressive reveal (OWNER
 * "FINAL ART DIRECTION & VISUAL CONVERSION PASS", 2026-11-09, §15–16; content
 * from "LOCATION INTELLIGENCE + VIEWING CONVERSION PASS", 2026-11-06). Never the
 * whole data set at once:
 *   1 · ADDRESS — the large real aerial with only Moscova 20, the boulevard, the
 *       entrance and the main movement drawn in turn, beside the statement
 *       «Адрес — часть бизнес-модели.»;
 *   2 · SURROUNDINGS — the straight-line radii and OSM points by category, the four
 *       groups of everyday activity;
 *   3 · RHYTHM — the PRELIMINARY MEGAPARC LOCATION MODEL as one editorial line
 *       08 → 20 (auto · pedestrians · transport), the 16–19 peak in burgundy;
 * then the verdict, the actions and — OWNER preview — the closed state of the
 * economics tool. Wording rule: activity «вокруг локации», never «станут вашими
 * покупателями».
 *
 * Card & air pass (OWNER "PREMIUM CARD SYSTEM & AIR PASS", 2026-11-09, §9):
 * the steps became one LocationExplorer — the large visual on the left, the
 * cards АДРЕС · ОКРУЖЕНИЕ · ТРАНСПОРТ · РИТМ ДНЯ on the right, the economics
 * entry as a premium card beside the verdict.
 *
 * Gating (src/data/tenant-intelligence.ts): the model, the map, the visibility
 * marks and the economics entry render only in the OWNER preview until the
 * OWNER approves them; a production build shows the OSM location module, the
 * plain aerial and the ecosystem copy.
 */

const copy = {
  filters: { ro: "Straturi ale hărții", ru: "Слои карты", en: "Map layers" },
  // OWNER «REAL PREMIUM ART-DIRECTION PASS» §10–§12 (2026-11-11): the control zone explains itself — the question, the instruction, the status line
  explorer: {
    question: { ro: "Ce influențează această locație?", ru: "Что влияет на эту локацию?", en: "What shapes this location?" },
    hint: { ro: "Alegeți un aspect — harta arată stratul corespunzător.", ru: "Выберите аспект — карта покажет соответствующий слой.", en: "Choose an aspect — the map shows the matching layer." },
    active: { ro: "Activ", ru: "Активно", en: "Active" },
    now: { ro: "Acum pe hartă", ru: "Сейчас на карте", en: "Now on the map" },
  },
  option: {
    address: { ro: "Adresa", ru: "Адрес", en: "Address" },
    rhythm: { ro: "Ritmul zilei", ru: "Ритм дня", en: "Rhythm of the day" },
  },
  cat: {
    education: { ro: "Educație", ru: "Образование", en: "Education" },
    transport: { ro: "Transport", ru: "Транспорт", en: "Transport" },
    grocery: { ro: "Alimentare", ru: "Продукты", en: "Groceries" },
    pharmacy: { ro: "Farmacii", ru: "Аптеки", en: "Pharmacies" },
    services: { ro: "Servicii", ru: "Услуги", en: "Services" },
    roads: { ro: "Artere principale", ru: "Магистрали", en: "Main roads" },
  } satisfies Record<CatchmentCategory | "roads", Localized>,
  metres: { ro: "m", ru: "м", en: "m" },
  figure: {
    vehicles: { label: { ro: "Automobile", ru: "Автомобили", en: "Vehicles" }, unit: { ro: "auto / zi", ru: "авто / сутки", en: "vehicles / day" } },
    pedestrians: { label: { ro: "Pietoni", ru: "Пешеходы", en: "Pedestrians" }, unit: { ro: "deplasări / zi", ru: "перемещений / сутки", en: "movements / day" } },
    // a researched OSM fact, not a model figure (OWNER micro-fix 2026-11-09)
    transit: { label: { ro: "Transport public", ru: "Общественный транспорт", en: "Public transport" }, unit: { ro: "rute conform datelor actuale OpenStreetMap", ru: "маршрутов по текущим данным OpenStreetMap", en: "routes per current OpenStreetMap data" } },
    // OWNER OVERRIDE «LOCATION METRICS» (2026-11-12): 16:00–19:00 is an estimated period of higher activity, not a measured peak
    peak: { label: { ro: "Vârf", ru: "Пик", en: "Peak" }, unit: { ro: "perioadă estimată de activitate sporită", ru: "оценочный период повышенной активности", en: "estimated period of higher activity" } },
  },
  status: {
    MODELLED: { ro: "Analiză preliminară a locației · scenariu modelat", ru: "Предварительный анализ локации · моделируемый сценарий", en: "Preliminary location analysis · modelled scenario" },
    MEASURED: { ro: "Numărătoare pe teren MEGAPARC", ru: "Полевой замер MEGAPARC", en: "MEGAPARC field count" },
    VERIFIED: { ro: "Date verificate", ru: "Проверенные данные", en: "Verified data" },
  },
  series: {
    auto: { ro: "Auto", ru: "Авто", en: "Auto" },
    pedestrian: { ro: "Pietoni", ru: "Пешеходы", en: "Pedestrians" },
    transit: { ro: "Transport", ru: "Транспорт", en: "Transport" },
  },
  peakBand: { ro: "vârf", ru: "пик", en: "peak" },
  hour: {
    morning: { ro: "dimineața: activitate constantă", ru: "утро: устойчивая активность", en: "morning: steady activity" },
    day: { ro: "ziua: activitate medie", ru: "день: средняя активность", en: "daytime: medium activity" },
    peak: { ro: "seara: vârf", ru: "вечер: пик", en: "evening: peak" },
    late: { ro: "seara târziu: scădere", ru: "поздний вечер: спад", en: "late evening: easing" },
  },
  chartLabel: { ro: "Ritmul zilei 08–20 după modelul preliminar: dimineața constant, ziua mediu, seara vârf între 16 și 19. Fără valori.", ru: "Ритм дня 08–20 по предварительной модели: утром устойчиво, днём средне, вечером пик с 16 до 19. Без значений.", en: "The day's rhythm 08–20 in the preliminary model: steady in the morning, medium in the day, a peak from 16 to 19. No values." },
  // the closed state of the decision tool (OWNER §19): its title and text come from the dataset (x.decision.teaser); the action word by kind
  go: { office: T("Calculați suprafața", "Посчитать площадь", "Calculate the area") },
} as const;

const fmt = (n: number, locale: SiteLocale) => n.toLocaleString(locale === "ru" ? "ru-RU" : locale === "ro" ? "ro-RO" : "en-GB");
const range = (low: number | null, high: number | null, locale: SiteLocale) => (low !== null && high !== null ? `${fmt(low, locale)}–${fmt(high, locale)}` : null);

/* ------------------------------------------------------------ catchment map */

function CatchmentMap({ name, locale, caption, transport = true }: { name: string; locale: SiteLocale; caption: string; /** false where the transport map shows the stops (OWNER R4 §02: no unnamed squares) */ transport?: boolean }) {
  const c = moscova20Catchment;
  const mid = c.size / 2;
  const cats = (Object.keys(c.pois) as CatchmentCategory[]).filter((cat) => transport || cat !== "transport");
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
          <circle key={ring.m} cx={mid} cy={mid} r={ring.r} className={`lg-catch__ring is-${i}`} style={{ "--i": i } as CSSProperties} />
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
          // straight-line radii in metres — never minutes (OWNER micro-fix 2026-11-09: not a pedestrian isochrone)
          const metres = ring.m >= 1000 ? `${Math.floor(ring.m / 1000)}${locale === "en" ? "," : " "}${String(ring.m % 1000).padStart(3, "0")}` : String(ring.m);
          return (
            <text key={ring.m} x={x + 8} y={y - 8} className="lg-catch__ringlabel">{`≈ ${metres} ${copy.metres[locale]}`}</text>
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

/** One editorial line 08 → 20: three thin series, the peak band and the parts of the lines inside it in burgundy. No values. */
function DayRhythm({ traffic, locale, narrow = false }: { traffic: LocationTraffic; locale: SiteLocale; narrow?: boolean }) {
  // two drawings of the same line: a wide one, and a narrow one for phones whose 12-unit type stays legible at 350 px
  const W = narrow ? 560 : 1200, H = narrow ? 230 : 214, X0 = 24, X1 = narrow ? 440 : 1060, Y0 = narrow ? 192 : 178, YH = narrow ? 150 : 142;
  const hours = traffic.dayProfile;
  const first = hours[0].hour;
  const last = hours[hours.length - 1].hour;
  const x = (hour: number) => X0 + ((hour - first) / (last - first)) * (X1 - X0);
  const y = (level: number) => Y0 - level * YH;
  const line = (key: "auto" | "pedestrian" | "transit") => hours.map((h, i) => `${i ? "L" : "M"}${x(h.hour).toFixed(1)} ${y(h[key]).toFixed(1)}`).join("");
  const [p0, p1] = (traffic.peakPeriod ?? "16:00–19:00").split("–").map((part) => Number(part.slice(0, 2)));
  const ends = (["auto", "pedestrian", "transit"] as const).map((key) => ({ key, y: y(hours[hours.length - 1][key]) })).sort((a, b) => a.y - b.y);
  for (let i = 1; i < ends.length; i++) if (ends[i].y - ends[i - 1].y < 18) ends[i].y = ends[i - 1].y + 18;
  const word = (hour: number) => (hour < 10 ? copy.hour.morning : hour >= p0 && hour < p1 ? copy.hour.peak : hour >= p1 ? copy.hour.late : copy.hour.day)[locale];
  const clip = narrow ? "lg-rhythm-peak-narrow" : "lg-rhythm-peak";
  return (
    <figure className={`lg-rhythm ${narrow ? "is-narrow" : "is-wide"}`}>
      <svg viewBox={`0 0 ${W} ${H}`} className="lg-rhythm__svg" role="img" aria-label={copy.chartLabel[locale]}>
        <defs>
          <clipPath id={clip}><rect x={x(p0)} y="0" width={x(p1) - x(p0)} height={H} /></clipPath>
        </defs>
        <rect x={x(p0)} y={Y0 - YH - 18} width={x(p1) - x(p0)} height={YH + 18} className="lg-rhythm__peak" />
        <text x={x(p0) + 10} y={Y0 - YH - 2} className="lg-rhythm__peaklabel">{`${copy.peakBand[locale]} ${traffic.peakPeriod ?? ""}`}</text>
        {hours.filter((h) => h.hour % 2 === 0).map((h) => (
          <g key={h.hour}>
            <line x1={x(h.hour)} x2={x(h.hour)} y1={Y0 - YH - 18} y2={Y0} className="lg-rhythm__grid" />
            <text x={x(h.hour)} y={Y0 + 28} textAnchor="middle" className="lg-rhythm__tick">{String(h.hour).padStart(2, "0")}</text>
          </g>
        ))}
        <line x1={X0} x2={X1} y1={Y0} y2={Y0} className="lg-rhythm__base" />
        {(["transit", "pedestrian", "auto"] as const).map((key) => (
          <path key={key} d={line(key)} className={`lg-rhythm__line is-${key}`} pathLength={1} />
        ))}
        <g clipPath={`url(#${clip})`}>
          {(["transit", "pedestrian", "auto"] as const).map((key) => (
            <path key={key} d={line(key)} className={`lg-rhythm__hot is-${key}`} pathLength={1} />
          ))}
        </g>
        {ends.map((end) => (
          <text key={end.key} x={X1 + 16} y={end.y + 4} className={`lg-rhythm__end is-${end.key}`}>{copy.series[end.key][locale]}</text>
        ))}
        {hours.map((h, i) => {
          const left = i ? (x(hours[i - 1].hour) + x(h.hour)) / 2 : X0;
          const right = i < hours.length - 1 ? (x(h.hour) + x(hours[i + 1].hour)) / 2 : X1;
          return (
            <rect key={h.hour} x={left} y={Y0 - YH - 18} width={right - left} height={YH + 48} className="lg-rhythm__hit">
              <title>{`${String(h.hour).padStart(2, "0")}:00 — ${word(h.hour)}`}</title>
            </rect>
          );
        })}
      </svg>
    </figure>
  );
}

/* ------------------------------------------------------------ the address on the aerial */

/** OWNER «LOCATION VISUAL INTELLIGENCE R4» §01: the aerial with the architectural annotation; the recommended variant is the default */
const aerialLegend: Record<SiteLocale, string> = { ro: "Ce este marcat pe fotografie", ru: "Что отмечено на фотографии", en: "What is marked on the photograph" };
function AddressAerial({ x, name, locale, marked }: { x: LeasingExperience; name: string; locale: SiteLocale; marked: boolean }) {
  const v = x.motion.visibility;
  if (!v) return null;
  const marks = marked ? v.marks.filter((mark) => publishable(mark.evidence)) : [];
  if (!marks.length) {
    return (
      <figure className="lg-vis">
        <PhotoScene photo={x.photos[v.photo]} locale={locale} sizes="(min-width: 1024px) 64vw, 100vw" drawing={null} labels={[]} />
        <figcaption className="lg-stage__caption">{x.photos[v.photo].alt[locale]}</figcaption>
      </figure>
    );
  }
  return <AerialAnnotation photo={x.photos[v.photo]} marks={marks} name={name} caption={v.caption[locale]} locale={locale} variant="b" />;
}

/* ------------------------------------------------------------ scene */

export function LocationMotion({ x, offer, project, locale, decision }: { x: LeasingExperience; offer: TemplateOffer; project: ProjectEntry; locale: SiteLocale; /** the decision zone is shown (property-template decisionOn) */ decision: boolean }) {
  const m = x.motion;
  const v = m.visibility;
  const traffic = locationTraffic[x.project];
  const modelOn = trafficVisible(traffic, ownerPreview) && toolVisible(`${x.project}.location-model`, ownerPreview);
  const mapOn = toolVisible(`${x.project}.catchment-map`, ownerPreview);
  const marksOn = toolVisible(`${x.project}.visibility-study`, ownerPreview);
  // OWNER «LOCATION VISUAL INTELLIGENCE R4» §02–§03: the transport map with the verified stops — OWNER preview until the visual approval
  const transit = m.transit && toolVisible(`${x.project}.transport-map`, ownerPreview) ? m.transit : null;
  // OWNER addendum «RÎȘCANI DEVELOPMENT RESEARCH»: the district-growth layer — a map of its own, OWNER preview until the facts are reviewed
  const growth = m.growth && toolVisible(`${x.project}.district-growth`, ownerPreview) ? m.growth : null;
  const economicsOn = decision;
  const map = project.asset?.map ?? null;

  const figures =
    modelOn && traffic
      ? [
          { key: "vehicles", value: range(traffic.vehicleLow, traffic.vehicleHigh, locale), ...copy.figure.vehicles },
          { key: "pedestrians", value: range(traffic.pedestrianLow, traffic.pedestrianHigh, locale), ...copy.figure.pedestrians },
          { key: "transit", value: traffic.transportRoutes, ...copy.figure.transit },
          { key: "peak", value: traffic.peakPeriod, ...copy.figure.peak },
        ].filter((figure) => figure.value)
      : [];

  const mapView = mapOn ? (
    <CatchmentMap key="map" name={project.name} locale={locale} caption={m.mapCaption[locale]} transport={!transit} />
  ) : (
    <LocationMap key="map" locale={locale} mapKey={x.project} name={project.name} place={x.hero.place[locale]} className="lg-motion__osm" />
  );

  const teaser = (
    <a className="lg-teaser" href="#economics" data-drawer="economics" aria-haspopup="dialog" data-reveal>
      <span className="lg-teaser__kicker">{decisionTitle(x, locale)}</span>
      <EconomicsGlyph className="lg-teaser__glyph" />
      <span className="lg-teaser__title">{x.decision.teaser.title[locale]}</span>
      <span className="lg-teaser__text">{x.decision.teaser.text[locale]}</span>
      <span className="lg-teaser__go">{x.decision.kind === "economics" ? ui.economicsGo[locale] : x.decision.kind === "office" ? copy.go.office[locale] : offer.primary}<Icon /></span>
    </a>
  );

  const groups = m.ecosystem;
  const transportGroup = groups.find((group) => group.category === "transport");
  const everyday = groups.filter((group) => group.category !== "transport");
  const routeLinks = map ? (
    <p className="lg-motion__links">
      <a className="pm-link" href={googleDirectionsUrl(map)} target="_blank" rel="noopener noreferrer"><span>{ui.route[locale]}</span><Icon name="up-right" /></a>
      <a className="pm-link pm-link--quiet" href={googleMapsUrl(map)} target="_blank" rel="noopener noreferrer"><span>{ui.openMap[locale]}</span><Icon name="up-right" /></a>
    </p>
  ) : null;

  const rhythmView =
    figures.length && traffic ? (
      <div className="lg-model">
        <p className="lg-label lg-model__status">{traffic.trafficStatus === "MODELLED" ? m.modelTitle?.[locale] ?? "" : copy.status[traffic.trafficStatus][locale]}{traffic.measurementDate ? ` · ${traffic.measurementDate}` : ""}</p>
        <dl className="lg-model__figs">
          {figures.map((figure) => (
            <div key={figure.key} className={`is-${figure.key}`}>
              <dt>{figure.label[locale]}</dt>
              <dd><strong>{figure.value}</strong><span>{figure.unit[locale]}</span></dd>
            </div>
          ))}
        </dl>
        {/* OWNER OVERRIDE «LOCATION METRICS» (2026-11-12): the compact note travels with the figures — estimates, never counts */}
        {traffic.trafficStatus === "MODELLED" && m.modelCaption ? <p className="lg-model__caption">{m.modelCaption[locale]}</p> : null}
        <ul className="lg-rhythm__legend">
          {(["auto", "pedestrian", "transit"] as const).map((key) => (
            <li key={key} className={`is-${key}`}><i aria-hidden="true" />{copy.series[key][locale]}</li>
          ))}
        </ul>
        <DayRhythm traffic={traffic} locale={locale} />
        <DayRhythm traffic={traffic} locale={locale} narrow />
      </div>
    ) : null;

  const options: ExplorerOption[] = [
    // no aerial photograph (Moscova 9 · Dacia 31 · Creangă 78): the address card shows the OSM location map and the address line
    { key: "address", label: copy.option.address[locale], title: m.visibilityTab[locale], visual: v ? "aerial" : "map", detail: <>{v && marksOn ? <AerialLegend marks={v.marks.filter((mark) => publishable(mark.evidence))} locale={locale} label={aerialLegend[locale]} /> : null}<p className="lg-explorer__text">{v ? (marksOn ? v.caption[locale] : x.photos[v.photo].alt[locale]) : m.addressText?.[locale] ?? ""}</p>{routeLinks}</> },
    {
      key: "around",
      label: m.mapTab[locale],
      title: everyday.map((group) => group.title[locale]).join(" · "),
      visual: "map",
      detail: (
        <ul className="lg-explorer__groups">
          {everyday.map((group) => (
            <li key={group.key}><b>{group.title[locale]}</b> {group.text[locale]}</li>
          ))}
        </ul>
      ),
    },
    ...(transit && transportGroup
      ? [{ key: "transport", label: copy.cat.transport[locale], title: transportGroup.text[locale], visual: "transit", detail: <TransitBrief copy={transit} locale={locale} />, layers: (["stops", "walk", "crossings"] as const).map((key) => ({ key, label: transit.layers[key][locale] })) }]
      : mapOn && transportGroup
      ? [{ key: "transport", label: copy.cat.transport[locale], title: transportGroup.text[locale], visual: "map", cat: "transport", detail: <p className="lg-explorer__text">{m.mapCaption[locale]}</p> }]
      : !mapOn && m.transport
        ? [{ key: "transport", label: copy.cat.transport[locale], title: m.transport.title[locale], visual: "map", detail: <p className="lg-explorer__text">{m.transport.text[locale]}</p> }]
        : []),
    ...(rhythmView && traffic
      ? [{ key: "rhythm", label: copy.option.rhythm[locale], title: `${copy.figure.peak.label[locale]} ${traffic.peakPeriod ?? ""}`.trim(), visual: "rhythm", detail: <>{traffic.trafficStatus === "MODELLED" ? null : <p className="lg-model__caption">{traffic.source}</p>}<p className="lg-model__note">{m.rhythmNote?.[locale] ?? ""}</p></> }]
      : []),
    // appended last so the approved numbering 01–04 does not move
    ...(growth ? [{ key: "growth", label: growth.tab[locale], title: growth.title[locale], visual: "growth", detail: <GrowthBrief copy={growth} locale={locale} /> }] : []),
  ];
  const visuals = [
    ...(v ? [{ key: "aerial", node: <AddressAerial x={x} name={project.name} locale={locale} marked={marksOn} /> }] : []),
    { key: "map", node: mapView },
    ...(transit ? [{ key: "transit", node: <TransportMap copy={transit} name={project.name} locale={locale} /> }] : []),
    ...(rhythmView ? [{ key: "rhythm", node: rhythmView }] : []),
    ...(growth ? [{ key: "growth", node: <GrowthMap copy={growth} name={project.name} locale={locale} /> }] : []),
  ];

  return (
    <section id="location" className="lg-motion" aria-labelledby="lg-motion-title">
      <div className="xp-shell">
        <header className="lg-motion__head" data-reveal>
          <p className="pm-kicker">{m.kicker[locale]}</p>
          <h2 className="lg-display lg-motion__title" id="lg-motion-title">
            {m.title[locale].split("\n").map((line, i, all) => <span key={line} className="lg-motion__title-line">{accentLast(all, i, line)}</span>)}
          </h2>
          {m.lead ? (
            <p className="lg-motion__lead">
              {m.lead[locale].split("\n").map((line, i, all) => (all.length > 1 ? <span key={line} className={i === 0 ? "lg-motion__lead-key" : "lg-motion__lead-more"}>{line}</span> : line))}
            </p>
          ) : null}
        </header>
        <div className="lg-motion__explorer" data-reveal>
          <LocationExplorer
            label={m.kicker[locale]}
            filterLabel={copy.filters[locale]}
            options={options}
            visuals={visuals}
            filters={mapOn ? (["education", "transport", "grocery", "pharmacy", "services", "roads"] as const).filter((key) => !transit || key !== "transport").map((key) => ({ key, label: copy.cat[key][locale] })) : []}
            copy={{ question: copy.explorer.question[locale], hint: copy.explorer.hint[locale], now: copy.explorer.now[locale], active: copy.explorer.active[locale] }}
          />
        </div>

        {/* verdict · actions · the economics entry as a premium card */}
        <div className={`lg-motion__close${economicsOn ? " has-teaser" : ""}`}>
          <div className="lg-motion__verdict" data-reveal>
            <p className="lg-motion__verdict-title">{m.verdict.title[locale]}</p>
            <p>{m.verdict.text[locale]}</p>
            <p className="lg-motion__cta-title">{m.cta.title[locale]}</p>
            <div className="lg-motion__actions">
              <a className="btn" href="#format"><span>{ui.checkForMe[locale].replace("Moscova 20", project.name)}</span><Icon /></a>
              <a className="btn btn--ghost" href="#viewing" data-intent="viewing"><span>{offer.primary}</span><Icon /></a>
            </div>
          </div>
          {economicsOn ? teaser : null}
        </div>
      </div>
    </section>
  );
}
