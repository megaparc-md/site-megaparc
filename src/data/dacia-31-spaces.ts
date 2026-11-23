/**
 * DACIA 31 — THE PUBLIC SWITCH OF THE FLOOR PLANS (OWNER «COMMERCIAL DEVELOPMENT REVIEW», 2026-11-23).
 *
 * This file is public (src/ is mirrored to the public preview repository): it holds NO lease-register data — no register numbers, areas,
 * statuses, totals or file names. The register, the reconciliation and the open questions live only in the private master workbook
 * DACIA_31_MASTER_DATA.xlsx (docs/qa/2026-11-23-property-commercial-experience/, private repository) and are never rendered.
 *
 * Public data structure: src/data/dacia-31-plans.ts (generated) — plan geometry, the plans' schedule areas, purpose and, per room,
 * availability ONLY when a responsible employee has confirmed it in the master workbook (none today → «статус уточняется»).
 * Never publish an unconfirmed availability, a rate that is not approved, or anything from the register.
 */
export const dacia31Public = {
  /** the OWNER switch for the production edition; the OWNER preview shows the plans already */
  ownerApproved: false,
};

/** the floor plans are shown where the OWNER approved them, or on the OWNER preview */
export const catalogVisible = () => dacia31Public.ownerApproved || (process.env.NEXT_PUBLIC_SITE_EDITION ?? "production") !== "production";
