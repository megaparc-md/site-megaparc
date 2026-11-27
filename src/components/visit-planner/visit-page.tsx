import { DirectContact } from "@/components/direct-contact";
import { PageShell } from "@/components/page-shell";
import { visitCopy } from "@/components/visit-planner/copy";
import { VisitPlanner } from "@/components/visit-planner/planner";
import type { PlannerProperty } from "@/components/visit-planner/types";
import { availabilityLabel, getProject, leasingExperienceFor, spaceArea, viewingEnabled } from "@/content/source";
import { m20TourLive } from "@/data/moscova-20-media";
import { deskRoute, visitPlannerOpen, visitProperties } from "@/data/visit-planner";
import { googleDirectionsUrl, googleMapsUrl } from "@/lib/assets";
import { localePath, type SiteLocale } from "@/lib/site-data";
import "./visit-planner.css";

/**
 * VISIT PLANNER — the page of one property (OWNER «VISIT PLANNER & COMMERCIAL DESK V1», stage 1, 2026-11-27). Server component: it
 * reads the property record — the name, the address, the area and the status of the published unit, the OWNER photograph, the map
 * links, the tour — and hands the planner one view model; nothing about the property is typed here. The planner is offered only
 * while the property has a published unit with the viewing action allowed (the same rule as every «request a viewing» button);
 * otherwise, and in the production edition, the page shows the confirmed direct contacts.
 */
export function plannerProperty(slug: string, locale: SiteLocale): PlannerProperty | null {
  if (!visitPlannerOpen || !visitProperties.includes(slug)) return null;
  const project = getProject(slug);
  const found = leasingExperienceFor(slug);
  if (!project || !found?.unit || !viewingEnabled(found.unit)) return null;
  const { unit, experience } = found;
  const photo = experience.photos[experience.hero.phonePhoto ?? experience.hero.photo] ?? experience.photos[experience.hero.photo];
  if (!photo) return null;
  const map = project.asset?.map ?? null;
  const tour = slug === "moscova-20" ? m20TourLive() : null;
  // the tour on a page of its own exists since R4; an earlier tour record (the preview source) has no such page — then no link
  const tourPage = tour && "page" in tour && typeof tour.page === "string" ? tour.page : null;
  return {
    slug,
    name: project.name,
    address: experience.address[locale],
    place: experience.hero.place[locale],
    area: spaceArea(unit, locale),
    status: availabilityLabel(unit, locale),
    photo: { src: photo.src, small: photo.small, width: photo.width, height: photo.height, alt: photo.alt[locale], position: photo.position },
    mapUrl: map ? googleMapsUrl(map) : null,
    routeUrl: map ? googleDirectionsUrl(map) : null,
    tourPath: tourPage ? localePath(locale, tourPage) : null,
    pagePath: localePath(locale, `/projects/${slug}`),
    deskPath: deskRoute,
  };
}

export function VisitPage({ slug, locale }: { slug: string; locale: SiteLocale }) {
  const property = plannerProperty(slug, locale);
  const t = visitCopy[locale];
  return (
    <PageShell locale={locale} footerStatement={false} mainClassName="vp-main">
      {property ? (
        <VisitPlanner locale={locale} property={property} />
      ) : (
        <section className="vp-closed">
          <div className="xp-shell">
            <h1 className="vp-closed__title">{t.closed.title}</h1>
            <p className="vp-closed__text">{t.closed.text}</p>
            <DirectContact locale={locale} subject="viewing" context={getProject(slug)?.name ?? ""} />
          </div>
        </section>
      )}
    </PageShell>
  );
}
