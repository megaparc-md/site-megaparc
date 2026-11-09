import type { MetadataRoute } from "next";
import { leasingExperienceForSpace, listProjects, publicSpaces } from "@/content/source";
import { siteUrl } from "@/lib/seo";
import { localePath, locales, type SiteLocale } from "@/lib/site-data";

/**
 * sitemap.xml — OWNER "PRODUCTION V1" (2026-11-09) §8: every public page in RO / RU / EN with its hreflang
 * alternates, on the canonical origin. Internal review routes (brand system, CMS workflow) are not public and
 * are not listed; a unit with a leasing experience is canonical on its property page, so only that is listed.
 */
export const dynamic = "force-static";

const hreflang: Record<SiteLocale, string> = { ro: "ro-MD", ru: "ru", en: "en" };
const pages = ["/", "/about", "/history", "/projects", "/leasing", "/partnership", "/offer", "/careers", "/contact"];

// the static export uses trailing slashes — the canonical URL of every page ends with "/"
const url = (path: string) => `${siteUrl}${path === "/" ? "/" : `${path}/`}`;

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    ...pages,
    ...listProjects().map((project) => `/projects/${project.slug}`),
    ...publicSpaces.filter((space) => !leasingExperienceForSpace(space.id)).map((space) => `/leasing/${space.id}`),
  ];
  return paths.flatMap((path) =>
    locales.map((locale) => ({
      url: url(localePath(locale, path)),
      alternates: {
        languages: {
          ...Object.fromEntries(locales.map((l) => [hreflang[l], url(localePath(l, path))])),
          "x-default": url(localePath("ro", path)),
        },
      },
    })),
  );
}
