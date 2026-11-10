import type { CSSProperties, ReactNode } from "react";
import { SectionIndex } from "@/components/primitives";
import { Icon } from "@/components/ui";
import { locationMaps } from "@/data/location-maps";
import { googleDirectionsUrl, googleMapsUrl, type MapLocation } from "@/lib/assets";
import { publicAsset, type Localized, type SiteLocale } from "@/lib/site-data";

const copy = {
  label: { ro: "Amplasare", ru: "Расположение", en: "Location" },
  open: { ro: "Deschide în Google Maps", ru: "Открыть в Google Maps", en: "Open in Google Maps" },
  route: { ro: "Construiește ruta", ru: "Построить маршрут", en: "Get directions" },
  newTab: { ro: "se deschide într-o filă nouă", ru: "откроется в новой вкладке", en: "opens in a new tab" },
  stops: { ro: "Stații de transport public", ru: "Остановки транспорта", en: "Public transport stops" },
  // OWNER Moscova 20 micro-fix (2026-11-09), applied by the leasing template to every map: a straight-line radius — never walking minutes until real routes are calculated
  walk: { ro: "Rază de {m} m în linie dreaptă", ru: "Радиус {m} м по прямой", en: "{m} m radius in a straight line" },
  map: { ro: "Hartă: amplasarea obiectului", ru: "Карта: расположение объекта", en: "Map: where the property is" },
} satisfies Record<string, Localized>;

/**
 * Premium location module (OWNER brief 2026-10-08, "LOCATION / ACCESSIBILITY MAP
 * CORRECTION" — reusable on every property page). A light editorial map built
 * from OpenStreetMap data (scripts/location-maps.mjs): warm ground, thin streets,
 * the property as the only red element, street names, transit stops, a 300 m
 * walking ring and a scale. Navigation is handed to Google Maps through deep
 * links built only from confirmed addresses. Without map data (a project whose
 * location is not public) the slot shows the property photograph instead.
 */
const NB = " ";

export function LocationSection({
  locale,
  no,
  mapKey,
  name,
  place,
  area,
  text,
  points,
  map,
  fallback,
}: {
  locale: SiteLocale;
  no: string;
  /** Key in src/data/location-maps.ts (the project slug). */
  mapKey?: string;
  /** Property name on the map pin. */
  name: string;
  /** District or place, e.g. "Рышкань". */
  place: string;
  /** City / country line. */
  area: string;
  text: string;
  points: Localized[];
  map: MapLocation | null;
  /** Rendered in the map slot when there is no map (e.g. the property photograph). */
  fallback?: ReactNode;
}) {
  const data = mapKey ? locationMaps[mapKey] : undefined;
  return (
    <section className="loc" aria-label={copy.label[locale]}>
      <div className="shell">
        <SectionIndex no={no}>{copy.label[locale]}</SectionIndex>
        <div className="loc__grid">
          <div className="loc__copy" data-reveal>
            <h2 className="loc__place">{place}</h2>
            <p className="loc__area">{area}</p>
            <p className="loc__text">{text}</p>
            {points.length ? (
              <ul className="loc__points">
                {points.map((point) => (
                  <li key={point.en}>{point[locale]}</li>
                ))}
              </ul>
            ) : null}
            {map ? (
              <div className="loc__actions">
                <span className="loc__address">{map.address}</span>
                <div className="loc__buttons">
                  <a className="btn btn--solid" href={googleDirectionsUrl(map)} target="_blank" rel="noopener noreferrer">
                    <span>{copy.route[locale]}</span>
                    <Icon name="up-right" />
                    <span className="sr-only"> ({copy.newTab[locale]})</span>
                  </a>
                  <a className="tlink" href={googleMapsUrl(map)} target="_blank" rel="noopener noreferrer">
                    <span>{copy.open[locale]}</span>
                    <Icon name="up-right" />
                    <span className="sr-only"> ({copy.newTab[locale]})</span>
                  </a>
                </div>
              </div>
            ) : null}
          </div>
          {data ? (
            <LocationMap locale={locale} mapKey={mapKey!} name={name} place={place} />
          ) : fallback ? (
            <figure className="loc__figure loc__figure--photo" data-reveal>{fallback}</figure>
          ) : null}
        </div>
      </div>
    </section>
  );
}

/**
 * The light editorial OSM map on its own (reused by the leasing experience,
 * src/components/leasing-experience). Renders nothing without map data.
 */
export function LocationMap({ locale, mapKey, name, place, className = "" }: { locale: SiteLocale; mapKey: string; name: string; place: string; className?: string }) {
  const data = locationMaps[mapKey];
  if (!data) return null;
  const unit = locale === "ru" ? "м" : "m";
  return (
    <figure className={`loc__figure ${className}`.trim()} data-reveal>
      <div className="loc__map" role="img" aria-label={`${copy.map[locale]} — ${name}, ${place}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={publicAsset(data.src)} alt="" loading="lazy" decoding="async" />
        {data.labels.map((label) => (
          <span key={label.text} className={`loc__street${label.frontage ? " is-frontage" : ""}`} style={{ "--x": `${label.x}%`, "--y": `${label.y}%`, "--a": `${label.angle}deg` } as CSSProperties} aria-hidden="true">
            {label.text}
          </span>
        ))}
        <span className="loc__ring-label" style={{ "--x": `${data.ring.label.x}%`, "--y": `${data.ring.label.y}%` } as CSSProperties} aria-hidden="true">{data.ring.meters}{NB}{unit}</span>
        <span className="loc__pin" aria-hidden="true" />
        <span className="loc__name" aria-hidden="true">{name}</span>
        <span className="loc__scale" style={{ "--w": `${data.scale.width}%` } as CSSProperties} aria-hidden="true"><i />{data.scale.meters}{NB}{unit}</span>
        <span className="loc__credit">© OpenStreetMap</span>
      </div>
      <figcaption className="loc__legend">
        {data.stops ? <span className="loc__key loc__key--stop">{copy.stops[locale]}</span> : null}
        <span className="loc__key loc__key--ring">{copy.walk[locale].replace("{m}", data.ring.meters >= 1000 && locale !== "en" ? data.ring.meters.toLocaleString(locale === "ru" ? "ru-RU" : "ro-RO").replace(/\s/g, "\u00a0") : data.ring.meters.toLocaleString("en-GB"))}</span>
      </figcaption>
    </figure>
  );
}
