import { LgHead, LgSection } from "@/components/leasing-experience/parts";
import { LocationMap } from "@/components/location-section";
import { Icon } from "@/components/ui";
import { publishable, type LeasingExperience } from "@/data/leasing-experience-model";
import { googleDirectionsUrl, googleMapsUrl, type MapLocation } from "@/lib/assets";
import type { Localized, SiteLocale } from "@/lib/site-data";

/**
 * LOCATION INTELLIGENCE (section 04) — OWNER mandate §12–14 / brief §9.
 * Public: the confirmed wording of the place and the light OSM map. Metrics are
 * CMS-ready fields that render only with a new, dated value; the historical
 * Rîșcani study stays internal (`internal`, never rendered) — no 2026 figure is
 * ever derived from it.
 */

const copy = {
  route: { ro: "Construiește ruta", ru: "Построить маршрут", en: "Get directions" },
  open: { ro: "Deschide în Google Maps", ru: "Открыть в Google Maps", en: "Open in Google Maps" },
  asOf: { ro: "date din", ru: "данные на", en: "as of" },
} satisfies Record<string, Localized>;

export function LocationIntelligence({ x, locale, name, place, map }: { x: LeasingExperience; locale: SiteLocale; name: string; place: string; map: MapLocation | null }) {
  const l = x.location;
  const points = l.points.filter((point) => publishable(point.evidence));
  // §13: only measured, dated values are ever shown — today the list is empty by design
  const metrics = l.metrics.filter((metric) => metric.value && metric.asOf && publishable(metric.evidence));
  return (
    <LgSection id="location" tone="white" labelledBy="lg-location-title" className="lg-location">
      <div className="lg-location__grid">
        <div className="lg-location__map">
          <LocationMap locale={locale} mapKey={x.project} name={name} place={place} className="lg-location__figure" />
        </div>
        <div className="lg-location__copy">
          <LgHead heading={l} locale={locale} id="lg-location-title" />
          <ul className="lg-points" data-reveal>
            {points.map((point) => (
              <li key={point.text.en}>{point.text[locale]}</li>
            ))}
          </ul>
          {metrics.length ? (
            <dl className="lg-metrics" data-reveal>
              {metrics.map((metric) => (
                <div key={metric.key}>
                  <dt>{metric.label[locale]}</dt>
                  <dd>{metric.value![locale]}<small>{copy.asOf[locale]} {metric.asOf}</small></dd>
                </div>
              ))}
            </dl>
          ) : null}
          {map ? (
            <div className="pm-actions lg-location__actions" data-reveal>
              <a className="pm-link" href={googleDirectionsUrl(map)} target="_blank" rel="noopener noreferrer">
                <span>{copy.route[locale]}</span>
                <Icon name="up-right" />
              </a>
              <a className="pm-link pm-link--quiet" href={googleMapsUrl(map)} target="_blank" rel="noopener noreferrer">
                <span>{copy.open[locale]}</span>
                <Icon name="up-right" />
              </a>
            </div>
          ) : null}
        </div>
      </div>
    </LgSection>
  );
}
