import { economicsCopy } from "@/components/leasing-experience/economics-copy";
import { EconomicsTool } from "@/components/leasing-experience/economics-tool";
import type { TemplateOffer } from "@/components/leasing-experience/offer";
import { OfficeTool } from "@/components/leasing-experience/office-tool";
import { ownerPreview, ui } from "@/components/leasing-experience/parts";
import { Icon } from "@/components/ui";
import type { ProjectEntry } from "@/content/source";
import { T, type LeasingExperience } from "@/data/leasing-experience-model";
import { economicsExample, locationTraffic, officeExample, sensitivityRates, trafficVisible } from "@/data/tenant-intelligence";
import type { Localized, SiteLocale } from "@/lib/site-data";

/**
 * THE DECISION ZONE of the leasing template (OWNER «LEASING TEMPLATE LOCK» §9, 2026-11-10) — the same place on every
 * page (portal 04 · the card beside the location verdict · the drawer), the tool chosen by the dataset:
 *   economics  the reverse calculation «Проверить экономику точки» (Moscova 20 with its labelled location model;
 *              Moscova 9 on the visitor's own figures, no location data)
 *   office     the office scenario — how much space the tenant's team needs (Dacia 31, a whole-building office)
 *   waitlist   the future-tenant block — no leasing economics while the building is 100 % occupied (Creangă 78)
 */

const copy = {
  office: T("Scenariul biroului", "Сценарий офиса", "Office scenario"),
  waitlist: T("Când se eliberează un spațiu", "Когда освободится помещение", "When a space frees up"),
  waitLead: T(
    "Clădirea este ocupată integral. Lista de așteptare vă ține aproape: aflați primii că se eliberează un spațiu potrivit formatului dumneavoastră.",
    "Здание занято полностью. Лист ожидания держит вас рядом: вы узнаете, когда освободится помещение под ваш формат.",
    "The building is fully let. The waiting list keeps you close: you hear when a space for your format frees up.",
  ),
  steps: [
    { title: T("Lăsați o cerere", "Оставьте заявку", "Leave a request"), text: T("formatul, suprafața de care aveți nevoie, termenul dorit", "формат, нужная площадь, желаемые сроки", "the format, the area you need, the timing you want") },
    { title: T("Vă anunțăm", "Мы сообщим", "We let you know"), text: T("când se eliberează un spațiu potrivit — și vi-l arătăm", "когда освободится подходящее помещение, — и покажем его", "when a suitable space frees up — and show it to you") },
    { title: T("Verificăm formatul", "Проверим формат", "We check the format"), text: T("mai întâi tehnic, cu directorul tehnic și arhitectul — apoi condițiile comerciale", "сначала технически, с техническим директором и архитектором, — затем коммерческие условия", "technically first, with the Technical Director and the Architect — then the commercial terms") },
  ],
} satisfies Record<string, Localized | { title: Localized; text: Localized }[]>;

export const decisionTitle = (x: LeasingExperience, locale: SiteLocale) => (x.decision.kind === "economics" ? ui.economics[locale] : x.decision.kind === "office" ? copy.office[locale] : copy.waitlist[locale]);
export const decisionKicker = (x: LeasingExperience, name: string, locale: SiteLocale) => (x.decision.kind === "economics" ? economicsCopy[locale].kicker : name);

export function DecisionSheet({ x, offer, project, locale }: { x: LeasingExperience; offer: TemplateOffer; project: ProjectEntry; locale: SiteLocale }) {
  // the status decides the visit action: a property-level story or a reserved unit names its own action
  const visitLabel = x.cta || !offer.open ? offer.primary : undefined;
  if (x.decision.kind === "economics") {
    const traffic = locationTraffic[x.project];
    const fmt = (n: number) => n.toLocaleString(locale === "ru" ? "ru-RU" : locale === "ro" ? "ro-RO" : "en-GB");
    const summary = trafficVisible(traffic, ownerPreview)
      ? {
          status: traffic.trafficStatus,
          pedestrians: traffic.pedestrianLow !== null && traffic.pedestrianHigh !== null ? `${fmt(traffic.pedestrianLow)}–${fmt(traffic.pedestrianHigh)}` : null,
          vehicles: traffic.vehicleLow !== null && traffic.vehicleHigh !== null ? `${fmt(traffic.vehicleLow)}–${fmt(traffic.vehicleHigh)}` : null,
          date: traffic.measurementDate,
        }
      : null;
    return <EconomicsTool locale={locale} property={project.name} example={economicsExample} rates={sensitivityRates} traffic={summary} visitLabel={visitLabel} />;
  }
  if (x.decision.kind === "office") return <OfficeTool locale={locale} property={project.name} example={officeExample} visitLabel={visitLabel} />;
  return (
    <div className="lg-sheet lg-waitlist">
      <p className="lg-sheet__lead">{copy.waitLead[locale]}</p>
      <ol className="lg-waitlist__steps">
        {copy.steps.map((step, i) => (
          <li key={step.title.en} className="lg-card">
            <span className="lg-card__no">{String(i + 1).padStart(2, "0")}</span>
            <strong>{step.title[locale]}</strong>
            <span>{step.text[locale]}</span>
          </li>
        ))}
      </ol>
      <p className="lg-sheet__links">
        <a className="btn" href="#lg-form" data-intent="viewing"><span>{offer.primary}</span><Icon /></a>
      </p>
    </div>
  );
}
