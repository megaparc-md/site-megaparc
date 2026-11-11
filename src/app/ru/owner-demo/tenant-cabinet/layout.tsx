import type { Metadata } from "next";
import type { ReactNode } from "react";
// imported through the alias so the production edition can swap it for an empty file (next.config.ts → productionStubs)
import "@/app/ru/owner-demo/tenant-cabinet/tenant-cabinet.css";

/**
 * TENANT CABINET · OWNER DEMO (OWNER «COMPLETE THE MISSING TENANT CABINET OWNER DEMO», 2026-11-11) — a non-public prototype on
 * synthetic data. noindex · nofollow; no canonical, no hreflang, no Open Graph; not in the sitemap, the navigation or the footer;
 * removed from the production artifact by scripts/package-production.mjs (internal route «owner-demo») and asserted absent by
 * scripts/qa-production.mjs. The public tenant entry stays off (src/data/tenant-cabinet.ts `enabled: false`).
 */
export const metadata: Metadata = {
  title: { default: "Кабинет арендатора · OWNER DEMO · MEGAPARC", template: "%s · Кабинет арендатора · OWNER DEMO" },
  description: "OWNER DEMO · NOT FOR PUBLIC USE — прототип кабинета арендатора MEGAPARC на демо-данных.",
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
  alternates: { canonical: null, languages: {} },
  openGraph: null,
  twitter: null,
};

export default function TenantCabinetDemoLayout({ children }: { children: ReactNode }) {
  return children;
}
