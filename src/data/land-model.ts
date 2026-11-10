import type { Localized } from "@/lib/site-data";

/**
 * LAND DEVELOPMENT OPPORTUNITY — the content model of the land master template (OWNER «MEGAPARC · LAND DEVELOPMENT
 * OPPORTUNITIES · DROCHIA = MASTER TEMPLATE», 2026-11-10). Drochia is the first dataset; Hîncești, Orhei, Florilor 32/2
 * and Chișinău will fill the same fields after OWNER review. Template: src/components/land/land-template.tsx.
 *
 * Rule: only verified facts are values. Everything else is a STATUS (to verify · required · not available) or an
 * illustrative input the visitor types — never zoning, permitted use, POT, CUT, height, utility capacity, GBA, value,
 * rent, price or IRR presented as a site fact.
 */

export type DueStatus = "CONFIRMED" | "TO_VERIFY" | "REQUIRED" | "NOT_AVAILABLE";

export type LandFact = { key: string; label: Localized; value: Localized; status: DueStatus; note?: Localized; source: string };
export type LandFactor = { key: string; fact: Localized; why: Localized; source: string };
export type DueItem = { key: string; label: Localized; status: DueStatus; note: Localized; source: string };
export type Scenario = { key: string; title: Localized; text: Localized; verify: Localized; source: string };
export type PackItem = { key: string; label: Localized; state: "ready" | "preparing"; /** internal only — never rendered */ missing?: boolean };

export type LandOpportunity = {
  slug: string;
  name: string;
  kind: "land" | "redevelopment";
  /** m² of land (cadastral / registered) */
  area: number;
  /** registered existing construction, m² (Florilor 32/2) */
  construction?: number;
  place: Localized;
  address: Localized | null;
  /** cadastral parcels (one or more); empty with `cadastrePending` while a number is being verified */
  parcels: { number: string; area: number }[];
  cadastrePending?: boolean;
  status: Localized;
  hero: { kicker: Localized; statement: Localized; lead: Localized };
  /** the OSM maps of the site (src/data/location-maps.ts keys): close context and the town / regional context */
  maps: { site: string; region?: string; caption: Localized };
  today: { title: Localized; facts: LandFact[] };
  potential: { title: Localized; lead: Localized; factors: LandFactor[] };
  development: { confirmed: LandFact[]; verify: Localized[] };
  scenarios: { title: Localized; lead: Localized; items: Scenario[]; disclaimer: Localized };
  readiness: DueItem[];
  utilities: DueItem[];
  location: { title: Localized; text: Localized; points: Localized[] };
  pack: PackItem[];
};
