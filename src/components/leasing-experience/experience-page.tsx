import { AreaBreakdown, AreaScheme } from "@/components/leasing-experience/area-breakdown";
import { CampaignFilm } from "@/components/leasing-experience/campaign";
import { CapexReadiness, CapitalBase } from "@/components/leasing-experience/capex-readiness";
import { DecisionChecks, LeaseTerms, ViewingJourney } from "@/components/leasing-experience/decision";
import { LeasingHero } from "@/components/leasing-experience/hero";
import { LocationIntelligence } from "@/components/leasing-experience/location-intelligence";
import { PhotoStory } from "@/components/leasing-experience/photo-story";
import { AccessAndLogistics, ConfirmedVsToConfirm, EngineeringReadiness } from "@/components/leasing-experience/readiness";
import { TenantFit } from "@/components/leasing-experience/tenant-fit";
import { ViewingSection } from "@/components/leasing-experience/viewing";
import { PageShell } from "@/components/page-shell";
import type { ProjectEntry } from "@/content/source";
import type { LeasingExperience } from "@/data/leasing-experience-model";
import type { AvailableSpace } from "@/data/leasing-inventory";
import type { SiteLocale } from "@/lib/site-data";

/**
 * MOSCOVA 20 · GOLD STANDARD COMMERCIAL LEASING EXPERIENCE (OWNER 2026-11-06)
 * — a digital leasing adviser, not a listing. One page answers the tenant's
 * decision: why consider it · does it fit my business · what is ready · what
 * capital work I do not repeat · what I adapt · what is confirmed · what is
 * still checked · how to arrange a viewing.
 *
 * Desktop order (brief §4):
 *   01 hero · 02 capital base · 03 tenant fit · 04 location · 05 areas ·
 *   06 photo story · 07 access · 08 engineering · 09 confirmed / to confirm ·
 *   10 area scheme · 11 lease terms · 12 cost of opening · 13 decision checks ·
 *   14 film / campaign · 15 viewing · 16 what happens next
 * Phones (brief §20) re-sequence the same sections in CSS (leasing-experience.css):
 *   hero → capital base → fit → areas → photos → engineering → access →
 *   location → confirmed → scheme → cost of opening → terms → checks →
 *   viewing → next → film.
 *
 * Rendered by /projects/moscova-20 and /leasing/moscova-20-corner while the
 * unit is published (src/content/source.ts → leasingExperienceFor); the
 * property URL is canonical. Facts: unit record (status, areas) +
 * src/data/leasing-experience-moscova-20.ts (everything else).
 */
export function LeasingExperiencePage({ locale, project, unit, experience: x }: { locale: SiteLocale; project: ProjectEntry; unit: AvailableSpace; experience: LeasingExperience }) {
  return (
    <PageShell locale={locale} experience mainClassName="lg-page">
      <LeasingHero x={x} unit={unit} project={project} locale={locale} />
      <CapitalBase x={x} locale={locale} />
      <TenantFit x={x} locale={locale} />
      <LocationIntelligence x={x} locale={locale} name={project.name} place={x.hero.place[locale]} map={project.asset?.map ?? null} />
      <AreaBreakdown x={x} unit={unit} locale={locale} />
      <PhotoStory x={x} locale={locale} />
      <AccessAndLogistics x={x} locale={locale} />
      <EngineeringReadiness x={x} locale={locale} />
      <ConfirmedVsToConfirm x={x} locale={locale} />
      <AreaScheme x={x} unit={unit} locale={locale} />
      <LeaseTerms x={x} locale={locale} />
      <CapexReadiness x={x} locale={locale} />
      <DecisionChecks x={x} locale={locale} />
      <CampaignFilm x={x} locale={locale} />
      <ViewingSection x={x} unit={unit} project={project} locale={locale} />
      <ViewingJourney x={x} locale={locale} />
    </PageShell>
  );
}
