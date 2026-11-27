import { visitCta, visitPlannerOpen, visitProperties, visitRoute } from "@/data/visit-planner";
import { localePath, publicAsset, type SiteLocale } from "@/lib/site-data";

export type VisitEntrySource = "site" | "tour" | "assistant" | "terms";

/** is the planner offered for this property (the registry and the edition; the caller adds the unit's own «viewing allowed» rule) */
export const plannerFor = (slug: string | null | undefined): slug is string => Boolean(slug) && visitPlannerOpen && visitProperties.includes(slug as string);

/** the label of a viewing action: the one main call to action where the planner is offered for the property, the caller's own wording elsewhere */
export const viewingCta = (locale: SiteLocale, slug: string | null | undefined, fallback: string): string => (plannerFor(slug) ? visitCta[locale] : fallback);

/** the planner of a property for next/link (the base path and the trailing slash are added by the router); null where the planner is not offered */
export function visitHref(locale: SiteLocale, slug: string | null | undefined, source: VisitEntrySource = "site"): string | null {
  return plannerFor(slug) ? `${localePath(locale, visitRoute(slug))}?src=${source}` : null;
}

/** the same address for a plain anchor (the tour's own panel): the base path and the trailing slash written out */
export function visitUrl(locale: SiteLocale, slug: string | null | undefined, source: VisitEntrySource = "site"): string | null {
  return plannerFor(slug) ? `${publicAsset(localePath(locale, visitRoute(slug)))}/?src=${source}` : null;
}
