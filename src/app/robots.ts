import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/seo";
import { isPreviewBuild, isProductionEdition } from "@/lib/site-data";

/**
 * robots.txt — OWNER "PRODUCTION V1" (2026-11-09) §8. The production edition is open to crawlers and points to
 * the sitemap on the canonical origin; any preview edition build disallows everything.
 */
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  if (!isProductionEdition || isPreviewBuild) return { rules: { userAgent: "*", disallow: "/" } };
  return { rules: { userAgent: "*", allow: "/" }, sitemap: `${siteUrl}/sitemap.xml`, host: siteUrl };
}
