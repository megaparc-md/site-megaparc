import type { Localized } from "@/lib/site-data";

/**
 * OPERATOR PROOF REGISTRY — OWNER «OPERATOR PROOF SYSTEM» correction (2026-11-11). The structured list of tenant / operator
 * brands MEGAPARC may name publicly as proof of operating buildings. RULE: a logo visible in a property photograph is NOT
 * evidence of an operator relationship — only OWNER confirmation, lease / internal property records or other verified project
 * data qualify. A property is shown under a brand only when the OWNER confirmed the assignment. Nothing here states a lease
 * term, rent, turnover, exclusivity or partnership. No public block renders this registry yet (none exists in the site): the
 * data is kept ready for the operator proof block when the OWNER mandates it; the OWNER review table lives in
 * docs/OWNER_INPUT_OPERATORS.md.
 */
export type OperatorEvidence = "OWNER_CONFIRMED" | "PROPERTY_RECORD" | "PHOTOGRAPH_ONLY";
export type OperatorEntry = {
  key: string;
  name: string;
  /** OWNER-confirmed property assignment (slug + public name) — null until the OWNER confirms it; never inferred from a photograph */
  property: { slug: string; name: Localized } | null;
  evidence: OperatorEvidence;
  /** publicly approved as an operator proof entry (brand, and the property when assigned) */
  publish: boolean;
  source: string;
};

export const operatorRegistry: OperatorEntry[] = [
  // OWNER-confirmed current candidates (2026-11-11) — brand only until the property assignment is confirmed
  { key: "linella", name: "Linella", property: null, evidence: "OWNER_CONFIRMED", publish: true, source: "OWNER «OPERATOR PROOF SYSTEM» 2026-11-11 — property assignment not yet confirmed (the Creangă 78 photograph is not evidence)" },
  { key: "local", name: "Local", property: null, evidence: "OWNER_CONFIRMED", publish: true, source: "OWNER «OPERATOR PROOF SYSTEM» 2026-11-11 — property assignment not yet confirmed" },
  { key: "stapanul-mesei", name: "Stăpânul Mesei", property: null, evidence: "OWNER_CONFIRMED", publish: true, source: "OWNER «OPERATOR PROOF SYSTEM» 2026-11-11 — property assignment not yet confirmed" },
  { key: "sinsay", name: "Sinsay", property: { slug: "dacia-31", name: { ro: "Dacia 31", ru: "Dacia 31", en: "Dacia 31" } }, evidence: "OWNER_CONFIRMED", publish: true, source: "OWNER «OPERATOR PROOF SYSTEM» 2026-11-11 — «Sinsay · Dacia 31»" },
  // OWNER UPDATE 2026-11-11: «Alco Market · Moscova 20» — OWNER-confirmed operator at Moscova 20; property-specific proof allowed on the
  // Moscova 20 page. Never implies that Alco Market occupies the marketed 625,7 m² unit (M20-01) — the relationship is stated only at the
  // level the OWNER confirmed: an operator of the property.
  { key: "alco-market", name: "Alco Market", property: { slug: "moscova-20", name: { ro: "Moscova 20", ru: "Moscova 20", en: "Moscova 20" } }, evidence: "OWNER_CONFIRMED", publish: true, source: "OWNER «OPERATOR PROOF SYSTEM — UPDATE» 2026-11-11 — «Alco Market · Moscova 20»; not linked to the marketed unit" },
  // visible in the Creangă 78 photographs only — removed from public operator proof by the OWNER (2026-11-11); photographs stay as they are
  { key: "andys-pizza", name: "Andy’s Pizza", property: null, evidence: "PHOTOGRAPH_ONLY", publish: false, source: "OWNER «OPERATOR PROOF SYSTEM» 2026-11-11 — photographic presence is not a verified operator relationship" },
  { key: "farmacia-familiei", name: "Farmacia Familiei", property: null, evidence: "PHOTOGRAPH_ONLY", publish: false, source: "OWNER «OPERATOR PROOF SYSTEM» 2026-11-11 — photographic presence is not a verified operator relationship" },
];

/** The OWNER-confirmed public set in OWNER order: Linella · Local · Stăpânul Mesei · Sinsay · Dacia 31 · Alco Market · Moscova 20. */
export const publicOperators = operatorRegistry.filter((entry) => entry.publish && entry.evidence !== "PHOTOGRAPH_ONLY");
