import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./tenant-cabinet.css";

/**
 * TENANT CABINET · OWNER DEMO — hidden on the live domain (OWNER «PUBLISH HIDDEN TENANT CABINET DEMO ON LIVE DOMAIN» + consolidated
 * GO, 2026-11-11): https://www.megaparc.md/owner-demo/tenant-cabinet/ is reachable by its direct URL only. noindex · nofollow ·
 * noarchive · nosnippet; no canonical, no hreflang, no Open Graph, no Twitter card; not in the sitemap, robots.txt, the navigation,
 * the footer or any public page. The production gate allows exactly this route tree (scripts/qa-production.mjs → hiddenDemoPages) and
 * fails on any other owner / demo route or on demo data outside it. Synthetic data only; the public tenant entry stays off
 * (src/data/tenant-cabinet.ts `enabled: false`). The cabinet content is Russian (`lang="ru"` on its frame).
 */
export const metadata: Metadata = {
  title: { default: "Кабинет арендатора · OWNER DEMO · MEGAPARC", template: "%s · Кабинет арендатора · OWNER DEMO" },
  description: "OWNER DEMO · NOT FOR PUBLIC USE — прототип кабинета арендатора MEGAPARC на демо-данных.",
  robots: { index: false, follow: false, noarchive: true, nosnippet: true, googleBot: { index: false, follow: false, noarchive: true, nosnippet: true } },
  alternates: { canonical: null, languages: {} },
  openGraph: null,
  twitter: null,
};

export default function TenantCabinetDemoLayout({ children }: { children: ReactNode }) {
  return children;
}
