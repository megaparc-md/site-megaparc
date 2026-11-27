import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CommercialDesk } from "@/components/commercial-desk/desk";
import { visitPlannerOpen, visitProperties, visitRoute } from "@/data/visit-planner";
import { localePath } from "@/lib/site-data";
import "@/components/visit-planner/visit-planner.css";
import "@/components/commercial-desk/commercial-desk.css";

/**
 * COMMERCIAL DESK · OWNER DEMO — the employees' cabinet of the Visit Planner (OWNER «VISIT PLANNER & COMMERCIAL DESK V1», stage 1,
 * 2026-11-27). OWNER preview only: noindex · nofollow · noarchive · nosnippet, no canonical / hreflang / Open Graph, not in the
 * sitemap, the navigation, the footer or any public page of the production edition; scripts/package-production.mjs removes every
 * owner-demo entry except the approved tenant cabinet, and the production gate fails on this path. Test data only.
 */
export const metadata: Metadata = {
  title: "Commercial Desk · OWNER DEMO · MEGAPARC",
  description: "OWNER DEMO · NOT FOR PUBLIC USE — прототип кабинета сотрудников MEGAPARC на тестовых данных.",
  robots: { index: false, follow: false, noarchive: true, nosnippet: true, googleBot: { index: false, follow: false, noarchive: true, nosnippet: true } },
  alternates: { canonical: null, languages: {} },
  openGraph: null,
  twitter: null,
};

export default function Page() {
  if (!visitPlannerOpen) notFound();
  return <CommercialDesk plannerHref={localePath("ru", visitRoute(visitProperties[0]))} siteHref="/ru/" />;
}
