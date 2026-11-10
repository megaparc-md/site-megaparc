/**
 * REGISTERED PROPERTY DATA — OWNER «R3.3.1 VISUAL COMPLETION MANDATE» (2026-11-10), from the OWNER's tax / cadastral
 * records. REGISTERED area is the area of the registered premises — never the leasable or available area, never a
 * vacancy. Shown in the property pages' «02 · Пространство и данные» section, apart from the leasing information.
 */
export type RegisteredPremise = { cadastral: string; area: number };
export type RegisteredRecord = { area: number; premises: RegisteredPremise[]; source: string };

export const registeredData: Partial<Record<string, RegisteredRecord>> = {
  "moscova-9": { area: 2561.3, premises: [], source: "OWNER tax records (R3.3.1 §6) — registered property area, not the 1st-floor leasable area" },
  "dacia-31": {
    area: 5537.6,
    premises: [
      { cadastral: "0100110.137.01.002", area: 217.2 },
      { cadastral: "0100110.137.01.003", area: 307.7 },
      { cadastral: "0100110.137.01.005", area: 1128.5 },
      { cadastral: "0100110.137.01.006", area: 1012.0 },
      { cadastral: "0100110.137.01.012", area: 1387.5 },
      { cadastral: "0100110.137.01.013", area: 1167.3 },
      { cadastral: "0100110.137.01.014", area: 67.6 },
      { cadastral: "0100110.137.01.015", area: 249.8 },
    ],
    source: "OWNER tax records (R3.3.1 §7) — eight registered MEGAPARC premises, 5 537,6 m² in total; not a confirmed available leasing area",
  },
  "creanga-78": { area: 2158.3, premises: [{ cadastral: "0100514.140.01.120", area: 2158.3 }], source: "OWNER record (R3.3.1 §8) — cadastral number and registered area" },
};
