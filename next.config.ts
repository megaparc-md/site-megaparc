import type { NextConfig } from "next";

const isGitHubPages = process.env.GITHUB_PAGES === "true";
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/**
 * Production edition (release/2026-11-09-production-v1 default; OWNER "PRODUCTION V1"): preview-only client modules
 * are replaced by empty stubs at build time so their code and copy never reach the artifact — the enquiry and
 * viewing forms (no form backend yet; production pages render DirectContact). The tenant economics tool ships in both
 * editions since OWNER «R3.3» §2 (2026-11-10).
 */
const productionEdition = (process.env.NEXT_PUBLIC_SITE_EDITION ?? "production") === "production";
const productionStubs = {
  "@/components/enquiry-form": "./src/editions/production/enquiry-form.tsx",
  "@/components/leasing-experience/viewing-form": "./src/editions/production/viewing-form.tsx",
};

const nextConfig: NextConfig = {
  ...(productionEdition ? { turbopack: { resolveAlias: productionStubs } } : {}),
  // Three locale root layouts (RO / RU / EN) need a global 404 for unmatched URLs.
  experimental: {
    globalNotFound: true,
  },
  ...(isGitHubPages
    ? {
        output: "export" as const,
        trailingSlash: true,
        basePath,
        images: {
          unoptimized: true,
        },
      }
    : {}),
};

export default nextConfig;
