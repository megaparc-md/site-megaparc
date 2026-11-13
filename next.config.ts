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
  // Digital Leasing Toolkit (OWNER 2026-11-11): the pre-check and viewing-request forms follow the same rule
  "@/components/leasing-toolkit/pre-check-form": "./src/editions/production/pre-check-form.tsx",
  "@/components/leasing-toolkit/viewing-request": "./src/editions/production/viewing-request.tsx",
  // OWNER «PRODUCTION CONSISTENCY HOTFIX» (2026-11-12): the wording that describes the pre-check — production has no form, so it says «direct contact»
  "@/components/leasing-toolkit/precheck-copy": "./src/editions/production/precheck-copy.ts",
  // OWNER R10 §04 (2026-11-13): the CFO-model prototype is OWNER preview only until its methodology is verified
  "@/components/producer-economics": "./src/editions/production/producer-economics.tsx",
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
