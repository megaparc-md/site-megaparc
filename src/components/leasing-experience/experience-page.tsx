import { CapitalBase } from "@/components/leasing-experience/capital-base";
import { DecisionNav, type Chapter } from "@/components/leasing-experience/decision-nav";
import { LgDrawer } from "@/components/leasing-experience/drawer";
import { economicsCopy } from "@/components/leasing-experience/economics-copy";
import { EconomicsTool } from "@/components/leasing-experience/economics-tool";
import { FormatLens } from "@/components/leasing-experience/format-lens";
import { LeasingHero } from "@/components/leasing-experience/hero";
import { LocationMotion } from "@/components/leasing-experience/location-motion";
import { ownerPreview, ui } from "@/components/leasing-experience/parts";
import { PhotoStory } from "@/components/leasing-experience/photo-story";
import { PlansScene } from "@/components/leasing-experience/plans";
import { Reasons } from "@/components/leasing-experience/reasons";
import { ReadinessSheet, TechSheet } from "@/components/leasing-experience/sheets";
import { StickyCta } from "@/components/leasing-experience/sticky-cta";
import { ViewingScene } from "@/components/leasing-experience/viewing";
import { PageShell } from "@/components/page-shell";
import { availabilityLabel, formatArea, viewingEnabled, type ProjectEntry } from "@/content/source";
import type { LeasingExperience } from "@/data/leasing-experience-model";
import type { AvailableSpace } from "@/data/leasing-inventory";
import { economicsExample, locationTraffic, sensitivityRates, toolVisible, trafficVisible } from "@/data/tenant-intelligence";
import type { SiteLocale } from "@/lib/site-data";

/**
 * MOSCOVA 20 · FINAL VIEWING CONVERSION (OWNER 2026-11-06: "FINAL VIEWING
 * CONVERSION PASS" + "LOCATION INTELLIGENCE + VIEWING CONVERSION PASS" +
 * "TENANT ECONOMICS & DECISION TOOL"). One KPI — a viewing request — and three
 * levels: DESIRE (hero, decision bar, three reasons) → PROOF (location in motion,
 * the format lens, the capital base) → DETAIL (plans, the photo sequence; the
 * technical characteristics, readiness and the economics tool in drawers) →
 * the viewing. Phones add the sticky viewing bar. The DOM order is the reading
 * order on every width.
 *
 * Rendered by /projects/moscova-20 and /leasing/moscova-20-corner while the
 * unit is published (src/content/source.ts → leasingExperienceFor); status,
 * areas and the viewing action are read from the unit record.
 */
export function LeasingExperiencePage({ locale, project, unit, experience: x }: { locale: SiteLocale; project: ProjectEntry; unit: AvailableSpace; experience: LeasingExperience }) {
  const open = viewingEnabled(unit);
  const chapters: Chapter[] = [
    { key: "location", label: ui.chLocation[locale], href: "#location" },
    { key: "plans", label: ui.chPlans[locale], href: "#plans" },
    { key: "tech", label: ui.chTech[locale], href: "#tech", drawer: "tech" },
    { key: "readiness", label: ui.chReadiness[locale], href: "#capex" },
  ];
  const traffic = locationTraffic[x.project];
  const economicsOn = toolVisible(`${x.project}.economics-tool`, ownerPreview);
  const trafficOn = trafficVisible(traffic, ownerPreview);
  const fmt = (n: number) => n.toLocaleString(locale === "ru" ? "ru-RU" : locale === "ro" ? "ro-RO" : "en-GB");
  const summary =
    trafficOn && traffic
      ? {
          status: traffic.trafficStatus,
          pedestrians: traffic.pedestrianLow !== null && traffic.pedestrianHigh !== null ? `${fmt(traffic.pedestrianLow)}–${fmt(traffic.pedestrianHigh)}` : null,
          vehicles: traffic.vehicleLow !== null && traffic.vehicleHigh !== null ? `${fmt(traffic.vehicleLow)}–${fmt(traffic.vehicleHigh)}` : null,
          date: traffic.measurementDate,
        }
      : null;
  return (
    <PageShell locale={locale} experience mainClassName="lg-page">
      <LeasingHero x={x} unit={unit} project={project} locale={locale} />
      <DecisionNav chapters={chapters} label={ui.chapters[locale]} cta={open ? ui.viewing[locale] : ui.waitlist[locale]} />
      <Reasons x={x} locale={locale} />
      <LocationMotion x={x} unit={unit} project={project} locale={locale} />
      <FormatLens x={x} unit={unit} locale={locale} />
      <CapitalBase x={x} locale={locale} />
      <PlansScene x={x} unit={unit} locale={locale} />
      <PhotoStory x={x} locale={locale} />
      <ViewingScene x={x} unit={unit} project={project} locale={locale} />
      <StickyCta name={project.name} meta={`${formatArea(unit.area, locale)} · ${availabilityLabel(unit, locale)}`} label={open ? ui.viewing[locale] : ui.waitlist[locale]} />
      <LgDrawer id="tech" title={x.drawers.tech.title[locale]} kicker={project.name} closeLabel={ui.close[locale]}>
        <TechSheet x={x} unit={unit} project={project} locale={locale} />
      </LgDrawer>
      <LgDrawer id="readiness" title={x.drawers.readiness.title[locale]} kicker={project.name} closeLabel={ui.close[locale]}>
        <ReadinessSheet x={x} locale={locale} open={open} />
      </LgDrawer>
      {economicsOn ? (
        <LgDrawer id="economics" title={ui.economics[locale]} kicker={economicsCopy[locale].kicker} closeLabel={ui.close[locale]} wide>
          <EconomicsTool locale={locale} property={project.name} example={economicsExample} rates={sensitivityRates} traffic={summary} visitLabel={open ? undefined : ui.waitlist[locale]} />
        </LgDrawer>
      ) : null}
    </PageShell>
  );
}
