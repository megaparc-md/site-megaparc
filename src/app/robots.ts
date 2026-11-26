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
  // the Moscova 20 tour package (OWNER «MOSCOVA 20 IMMERSIVE EXPERIENCE R1», 2026-11-26) is reached from the property page and by its direct
  // link; it is not a page of the site (no site chrome, one language in its title), so crawlers are not sent into its 196 MB of panoramas
  return { rules: { userAgent: "*", allow: "/", disallow: "/Moscova20_3D_tour_site/" }, sitemap: `${siteUrl}/sitemap.xml`, host: siteUrl };
}
