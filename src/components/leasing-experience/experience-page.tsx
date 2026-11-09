import { CapitalBase } from "@/components/leasing-experience/capital-base";
import { DecisionNav, type Portal } from "@/components/leasing-experience/decision-nav";
import { LgDrawer } from "@/components/leasing-experience/drawer";
import { economicsCopy } from "@/components/leasing-experience/economics-copy";
import { EconomicsTool } from "@/components/leasing-experience/economics-tool";
import { FormatLens } from "@/components/leasing-experience/format-lens";
import { LeasingHero } from "@/components/leasing-experience/hero";
import { LocationMotion } from "@/components/leasing-experience/location-motion";
import { EconomicsGlyph, LgPhoto, ownerPreview, ui } from "@/components/leasing-experience/parts";
import { PhotoStory } from "@/components/leasing-experience/photo-story";
import { PlanSvg, PlansScene } from "@/components/leasing-experience/plans";
import { Reasons } from "@/components/leasing-experience/reasons";
import { ReadinessSheet, TechSheet } from "@/components/leasing-experience/sheets";
import { StickyCta } from "@/components/leasing-experience/sticky-cta";
import { ViewingScene } from "@/components/leasing-experience/viewing";
import { PageShell } from "@/components/page-shell";
import { availabilityLabel, formatArea, viewingEnabled, type ProjectEntry } from "@/content/source";
import type { LeasingExperience } from "@/data/leasing-experience-model";
import type { AvailableSpace } from "@/data/leasing-inventory";
import { economicsExample, locationTraffic, sensitivityRates, toolVisible, trafficVisible } from "@/data/tenant-intelligence";
import type { Localized, SiteLocale } from "@/lib/site-data";

/**
 * MOSCOVA 20 · FINAL ART DIRECTION & VISUAL CONVERSION (OWNER 2026-11-09) on
 * top of the final viewing conversion of 2026-11-06 — a visual pass only: the
 * data, the status model, the CMS architecture, the traffic model, the
 * economics formulas, the facts and the terms are unchanged. One KPI — a viewing
 * request. Rhythm (§7): LIGHT hero + PHOTO → GRAPHITE architectural navigation →
 * LIGHT statement + one strong interior → the business lens → LIGHT location as
 * a progressive hero scene → PHOTO cinematic sequence → PLAN → DARK capital base
 * → LIGHT final viewing. Order follows the tenant's path (handoff §14): interest
 * → «это может подойти моему бизнесу» → location proof → the space → plans and
 * technique → lower risk → «хочу увидеть сам». The DOM order is the reading
 * order on every width; phones add the sticky viewing bar.
 *
 * Rendered by /projects/moscova-20 and /leasing/moscova-20-corner while the
 * unit is published (src/content/source.ts → leasingExperienceFor); status,
 * areas and the viewing action are read from the unit record.
 */

const portalCopy = {
  location: { label: { ro: "Locație\nși flux", ru: "Локация\nи поток", en: "Location\nand flow" }, word: { ro: "Cum trăiește adresa", ru: "Как живёт адрес", en: "How the address lives" } },
  plans: { label: { ro: "Planurile\nspațiului", ru: "Планы\nпомещения", en: "Space\nplans" }, word: { ro: "Cum funcționează spațiul", ru: "Как работает пространство", en: "How the space works" } },
  ready: { label: { ro: "Pregătirea\ntehnică", ru: "Техническая\nготовность", en: "Technical\nreadiness" }, word: { ro: "Ce este deja gata", ru: "Что уже готово", en: "What is already in place" } },
  economics: { label: { ro: "Economia\npunctului", ru: "Экономика\nточки", en: "Unit\neconomics" }, word: { ro: "Câți clienți îi trebuie modelului dumneavoastră", ru: "Сколько клиентов требуется вашей модели", en: "How many customers your model needs" } },
  launch: { label: { ro: "Pregătire\npentru lansare", ru: "Готовность\nк запуску", en: "Ready\nto open" }, word: { ro: "Din ce se compune lansarea", ru: "Из чего складывается запуск", en: "What opening involves" } },
} satisfies Record<string, { label: Localized; word: Localized }>;

export function LeasingExperiencePage({ locale, project, unit, experience: x }: { locale: SiteLocale; project: ProjectEntry; unit: AvailableSpace; experience: LeasingExperience }) {
  const open = viewingEnabled(unit);
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

  const ground = x.plans.levels.find((level) => level.key === "ground");
  const photo = (key: string) => (x.photos[key] ? <LgPhoto photo={x.photos[key]} locale={locale} sizes="(min-width: 1024px) 22vw, 30vw" className="lg-portal__photo" /> : null);
  const fourth = economicsOn
    ? { key: "economics", href: "#economics", drawer: "economics", visual: <EconomicsGlyph className="lg-portal__glyph" />, ...portalCopy.economics }
    : { key: "launch", href: "#readiness", drawer: "readiness", visual: photo("groundHall"), ...portalCopy.launch };
  const portals: Portal[] = [
    { key: "location", href: "#location", visual: photo(x.motion.visibility.photo), ...portalCopy.location },
    { key: "plans", href: "#plans", visual: ground ? <PlanSvg level={ground} other={undefined} locale={locale} decor /> : null, ...portalCopy.plans },
    { key: "ready", href: "#capex", visual: photo("engineering"), ...portalCopy.ready },
    fourth,
  ].map((portal, i) => ({ key: portal.key, no: String(i + 1).padStart(2, "0"), label: portal.label[locale], word: portal.word[locale], href: portal.href, drawer: "drawer" in portal ? portal.drawer : undefined, visual: portal.visual }));

  return (
    <PageShell locale={locale} experience mainClassName="lg-page">
      <LeasingHero x={x} unit={unit} project={project} locale={locale} />
      <DecisionNav portals={portals} label={ui.chapters[locale]} cta={open ? ui.viewing[locale] : ui.waitlist[locale]} status={availabilityLabel(unit, locale)} />
      <Reasons x={x} unit={unit} locale={locale} />
      <FormatLens x={x} unit={unit} locale={locale} />
      <LocationMotion x={x} unit={unit} project={project} locale={locale} />
      <PhotoStory x={x} locale={locale} />
      <PlansScene x={x} unit={unit} locale={locale} />
      <CapitalBase x={x} locale={locale} />
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
