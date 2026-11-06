import { CapitalBase } from "@/components/leasing-experience/capital-base";
import { DecisionNav, type Chapter } from "@/components/leasing-experience/decision-nav";
import { FormatLens } from "@/components/leasing-experience/format-lens";
import { LeasingHero } from "@/components/leasing-experience/hero";
import { DecisionPanelScene } from "@/components/leasing-experience/panel";
import { ui } from "@/components/leasing-experience/parts";
import { PhotoStory } from "@/components/leasing-experience/photo-story";
import { PlansScene } from "@/components/leasing-experience/plans";
import { StickyCta } from "@/components/leasing-experience/sticky-cta";
import { ViewingScene } from "@/components/leasing-experience/viewing";
import { WhyConsider } from "@/components/leasing-experience/why";
import { PageShell } from "@/components/page-shell";
import { availabilityLabel, formatArea, viewingEnabled, type ProjectEntry } from "@/content/source";
import type { LeasingExperience } from "@/data/leasing-experience-model";
import type { AvailableSpace } from "@/data/leasing-inventory";
import type { SiteLocale } from "@/lib/site-data";

/**
 * MOSCOVA 20 · COMPACT PREMIUM LEASING EXPERIENCE (OWNER 2026-11-06,
 * "CONVERSION TO VIEWING") — eight scenes instead of sixteen sections:
 *   01 hero (+ decision navigation)  02 why consider it  03 «какой бизнес вы
 *   рассматриваете?» (format lens — OWNER conversion pass)  04 decision panel
 *   (technical · location · areas · engineering · access · readiness)
 *   05 plans and areas  06 capital base  07 photo story  08 viewing (+ the
 *   before / at / after steps, the form); phones add a sticky viewing bar.
 * Progressive disclosure: hero → reasons → choose your concern → evidence → viewing.
 * The DOM order is the reading order on every width.
 *
 * Rendered by /projects/moscova-20 and /leasing/moscova-20-corner while the
 * unit is published (src/content/source.ts → leasingExperienceFor); status,
 * areas and the viewing action are read from the unit record.
 */
export function LeasingExperiencePage({ locale, project, unit, experience: x }: { locale: SiteLocale; project: ProjectEntry; unit: AvailableSpace; experience: LeasingExperience }) {
  const open = viewingEnabled(unit);
  const chapters: Chapter[] = [
    { key: "tech", label: ui.chTech[locale], target: "decision", tab: "tech" },
    { key: "location", label: ui.chLocation[locale], target: "decision", tab: "location" },
    { key: "plans", label: ui.chPlans[locale], target: "plans" },
    { key: "readiness", label: ui.chReadiness[locale], target: "decision", tab: "readiness" },
  ];
  return (
    <PageShell locale={locale} experience mainClassName="lg-page">
      <LeasingHero x={x} unit={unit} project={project} locale={locale} />
      <DecisionNav chapters={chapters} label={ui.chapters[locale]} cta={open ? ui.viewing[locale] : ui.waitlist[locale]} />
      <WhyConsider x={x} unit={unit} locale={locale} />
      <FormatLens x={x} unit={unit} locale={locale} />
      <DecisionPanelScene x={x} unit={unit} project={project} locale={locale} />
      <PlansScene x={x} unit={unit} locale={locale} />
      <CapitalBase x={x} locale={locale} />
      <PhotoStory x={x} locale={locale} />
      <ViewingScene x={x} unit={unit} project={project} locale={locale} />
      <StickyCta name={project.name} meta={`${formatArea(unit.area, locale)} · ${availabilityLabel(unit, locale)}`} label={open ? ui.viewing[locale] : ui.waitlist[locale]} />
    </PageShell>
  );
}
