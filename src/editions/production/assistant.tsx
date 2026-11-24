import type { SiteLocale } from "@/lib/site-data";

/**
 * Production edition: the commercial assistant is an OWNER-preview prototype (OWNER «INTELLIGENT COMMERCIAL ASSISTANT»,
 * 2026-11-24 — «Production пока не публиковать»). next.config.ts resolves `@/components/assistant/assistant` to this file, so
 * the launcher, the panel, the scenarios, their copy and their stylesheet never reach the production artifact.
 */
export function Assistant({ locale }: { locale: SiteLocale }) {
  void locale;
  return null;
}
