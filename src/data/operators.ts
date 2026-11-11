import type { Localized } from "@/lib/site-data";

/**
 * OPERATOR PROOF REGISTRY — OWNER «OPERATOR PROOF SYSTEM» correction + «THIRD-PARTY BRAND SAFETY LOCK» (2026-11-11).
 * The structured list of tenant / operator brands MEGAPARC may name publicly as proof of operating buildings.
 *
 * RULE 1 — relationship: a logo visible in a property photograph is NOT evidence of an operator relationship — only OWNER
 * confirmation, lease / internal property records or other verified project data qualify. A property is shown under a brand
 * only when the OWNER confirmed the assignment. Nothing here states a lease term, rent, turnover, exclusivity or partnership.
 *
 * RULE 2 — brand safety lock: three flags are kept SEPARATELY for every third-party brand and never derived from each other:
 *   `ownerApproved`   — the OWNER verified the relationship and approved the brand for the operator proof design;
 *   `brandPermission` — written third-party trademark / logo permission (PENDING until recorded, then APPROVED or DECLINED);
 *   `publicDisplay`   — the OWNER switch for the public site.
 * OWNER confirmation verifies the relationship; it does NOT constitute trademark / logo permission. Until written permission is
 * recorded every brand stays `brandPermission: "PENDING"` + `publicDisplay: false` — even a current tenant, even a brand whose
 * signage appears in approved property photography. Production renders a brand only when all three gates pass
 * (`productionOperators`); otherwise nothing renders — no gap, no placeholder, no typographic stand-in.
 * Documentary property photographs keep their naturally occurring storefront signage; such signage is never extracted as a logo asset.
 * Logo files live outside `public/` until permission exists (none is shipped today); the design concept for OWNER review is a
 * non-public artifact in the private repository (docs/qa/2026-11-11-operator-proof-concept/). Review table: docs/OWNER_INPUT_OPERATORS.md.
 */
export type OperatorEvidence = "OWNER_CONFIRMED" | "PROPERTY_RECORD" | "PHOTOGRAPH_ONLY";
export type BrandPermission = "PENDING" | "APPROVED" | "DECLINED";
export type OperatorEntry = {
  key: string;
  name: string;
  /** OWNER-confirmed property assignment (slug + public name) — null until the OWNER confirms it; never inferred from a photograph */
  property: { slug: string; name: Localized } | null;
  evidence: OperatorEvidence;
  /** OWNER verified the relationship and approved the brand for the operator proof design (not a logo permission) */
  ownerApproved: boolean;
  /** written third-party trademark / logo permission — recorded in docs/OWNER_INPUT_OPERATORS.md with date and document */
  brandPermission: BrandPermission;
  /** the OWNER switch for the public site; meaningless without `brandPermission: "APPROVED"` */
  publicDisplay: boolean;
  /** public logo asset under /assets/operators/ — null until a permitted file is supplied; never a crop from a photograph */
  logo: string | null;
  source: string;
};

export const operatorRegistry: OperatorEntry[] = [
  // OWNER-confirmed current candidates (2026-11-11) — brand only until the property assignment is confirmed
  { key: "linella", name: "Linella", property: null, evidence: "OWNER_CONFIRMED", ownerApproved: true, brandPermission: "PENDING", publicDisplay: false, logo: null, source: "OWNER «OPERATOR PROOF SYSTEM» 2026-11-11 — property assignment not yet confirmed (the Creangă 78 photograph is not evidence)" },
  { key: "local", name: "Local", property: null, evidence: "OWNER_CONFIRMED", ownerApproved: true, brandPermission: "PENDING", publicDisplay: false, logo: null, source: "OWNER «OPERATOR PROOF SYSTEM» 2026-11-11 — property assignment not yet confirmed" },
  { key: "stapanul-mesei", name: "Stăpânul Mesei", property: null, evidence: "OWNER_CONFIRMED", ownerApproved: true, brandPermission: "PENDING", publicDisplay: false, logo: null, source: "OWNER «OPERATOR PROOF SYSTEM» 2026-11-11 — property assignment not yet confirmed" },
  { key: "sinsay", name: "Sinsay", property: { slug: "dacia-31", name: { ro: "Dacia 31", ru: "Dacia 31", en: "Dacia 31" } }, evidence: "OWNER_CONFIRMED", ownerApproved: true, brandPermission: "PENDING", publicDisplay: false, logo: null, source: "OWNER «OPERATOR PROOF SYSTEM» 2026-11-11 — «Sinsay · Dacia 31»" },
  // OWNER UPDATE 2026-11-11: «Alco Market · Moscova 20» — OWNER-confirmed operator at Moscova 20; property-specific proof allowed on the
  // Moscova 20 page. Never implies that Alco Market occupies the marketed 625,7 m² unit (M20-01) — the relationship is stated only at the
  // level the OWNER confirmed: an operator of the property.
  { key: "alco-market", name: "Alco Market", property: { slug: "moscova-20", name: { ro: "Moscova 20", ru: "Moscova 20", en: "Moscova 20" } }, evidence: "OWNER_CONFIRMED", ownerApproved: true, brandPermission: "PENDING", publicDisplay: false, logo: null, source: "OWNER «OPERATOR PROOF SYSTEM — UPDATE» 2026-11-11 — «Alco Market · Moscova 20»; not linked to the marketed unit" },
  // visible in the Creangă 78 photographs only — removed from public operator proof by the OWNER (2026-11-11); photographs stay as they are
  { key: "andys-pizza", name: "Andy’s Pizza", property: null, evidence: "PHOTOGRAPH_ONLY", ownerApproved: false, brandPermission: "PENDING", publicDisplay: false, logo: null, source: "OWNER «OPERATOR PROOF SYSTEM» 2026-11-11 — photographic presence is not a verified operator relationship" },
  { key: "farmacia-familiei", name: "Farmacia Familiei", property: null, evidence: "PHOTOGRAPH_ONLY", ownerApproved: false, brandPermission: "PENDING", publicDisplay: false, logo: null, source: "OWNER «OPERATOR PROOF SYSTEM» 2026-11-11 — photographic presence is not a verified operator relationship" },
];

/** OWNER design candidates (relationship verified, approved for the review concept) in OWNER order — NOT a publication list. */
export const candidateOperators = operatorRegistry.filter((entry) => entry.ownerApproved && entry.evidence !== "PHOTOGRAPH_ONLY");

/** The triple gate for the public site: ownerApproved AND brandPermission APPROVED AND publicDisplay (and a permitted logo file). Empty today. */
export const productionOperators = operatorRegistry.filter(
  (entry) => entry.ownerApproved && entry.brandPermission === "APPROVED" && entry.publicDisplay && entry.evidence !== "PHOTOGRAPH_ONLY",
);
