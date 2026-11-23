import type { Localized } from "@/lib/site-data";

/**
 * DACIA 31 — THE SPACE CATALOGUE (OWNER «PROPERTY COMMERCIAL EXPERIENCE 2026» Part B, 2026-11-23).
 *
 * Source: the OWNER lease register «INFORMAȚIA CHIRIA DACIA 31» (Excel, 23.11.2026), reconciled with the OWNER's preliminary figures:
 * register total 4 315,99 m² = free 2 777,71 m² (ground floor 1 166,79 · lower level 1 098,33 · level 2 432,59 · office no. 23 80)
 * + occupied 1 522,28 m² + 16 m² «busy → free» (cabinet no. 52). The figures are PRELIMINARY — not approved public data — until the
 * OWNER confirms the statuses, the use of the premises, the floors and the divisibility of the large areas.
 *
 * Data governance (OWNER, verbatim): «Не смешивать площадь реестра аренды с зарегистрированной площадью здания. Не публиковать имена
 * арендаторов, персональные данные, внутреннюю коммерческую информацию из Excel.» This module therefore holds ONLY the spaces that are
 * not let — never a tenant name, brand, contract, rent, period or occupied unit. The register area is a leasing figure («по реестру
 * аренды»); it is never added to, compared with or shown beside the registered building area (5 537,6 m², e‑Cadastru) or the total
 * property area (5 541 m²). No rate is stored here — ever.
 *
 * The shape is the WordPress content type «Свободное помещение» (docs/CMS_ARCHITECTURE.md → «Dacia 31 — catalogue»): every field is
 * one field an employee edits; a status change publishes or hides the card without code. Statuses as in src/data/leasing-inventory.ts:
 * AVAILABLE_NOW and AVAILABLE_FROM_DATE are shown; TO_CONFIRM, RESERVED-without-switch, LEASED and HIDDEN are never shown.
 */

export type CatalogScenario = "office" | "commercial";
/** The level as the register names it; the mapping to the building's floors (Demisol · Parter · Etajul 1 · Etajul 2) is confirmed with the plans. */
export type CatalogLevel = "lower" | "ground" | "level2" | "unknown";
export type CatalogStatus = "AVAILABLE_NOW" | "AVAILABLE_FROM_DATE" | "TO_CONFIRM";
export type CatalogUse = "office" | "cabinet" | "medical" | "education" | "retail" | "services" | "showroom" | "storage";

export type CatalogSpace = {
  id: string;
  /** the reference the leasing team uses on the phone (the register's own number for offices) */
  code: string;
  scenario: CatalogScenario;
  level: CatalogLevel;
  /** m² as in the lease register (two decimals) — a leasing figure, never the registered area */
  area: number;
  status: CatalogStatus;
  availableFrom: string | null;
  /** possible uses — formats the space can be checked for, never a suitability confirmation */
  uses: CatalogUse[];
  /** large areas: one or several tenants — divisibility is shown only once it is technically confirmed */
  divisible: "confirmed" | "to-confirm" | null;
  /** where the value comes from (internal; never rendered) */
  source: string;
};

const REG = "OWNER lease register «INFORMAȚIA CHIRIA DACIA 31» (Excel, 23.11.2026) — preliminary, statuses to be confirmed by the OWNER";

export const dacia31Catalog = {
  /** the OWNER switch: false → the production edition shows the property-level state «площадь и сроки — по запросу» */
  ownerApproved: false,
  asOf: "2026-11-23",
  spaces: [
    { id: "d31-ground", code: "D31-P", scenario: "commercial", level: "ground", area: 1166.79, status: "AVAILABLE_NOW", availableFrom: null, uses: ["retail", "services", "showroom"], divisible: "to-confirm", source: `${REG} — «Parter» FREE` },
    { id: "d31-lower", code: "D31-S", scenario: "commercial", level: "lower", area: 1098.33, status: "AVAILABLE_NOW", availableFrom: null, uses: ["services", "showroom", "storage"], divisible: "to-confirm", source: `${REG} — «Subsol» FREE` },
    { id: "d31-level2", code: "D31-N2", scenario: "commercial", level: "level2", area: 432.59, status: "AVAILABLE_NOW", availableFrom: null, uses: ["office", "services", "education"], divisible: "to-confirm", source: `${REG} — «Nivelul 2» FREE` },
    { id: "d31-office-23", code: "23", scenario: "office", level: "unknown", area: 80, status: "AVAILABLE_NOW", availableFrom: null, uses: ["office", "cabinet", "medical"], divisible: null, source: `${REG} — office no. 23 FREE (floor not in the register)` },
    // «busy → free» in the register: not shown until the OWNER confirms the date (never marketed as available)
    { id: "d31-cabinet-52", code: "52", scenario: "office", level: "unknown", area: 16, status: "TO_CONFIRM", availableFrom: null, uses: ["cabinet"], divisible: null, source: `${REG} — cabinet no. 52 BUSY-FREE` },
  ] as CatalogSpace[],
  /** the reconciliation of the register (internal — docs and QA only; never rendered as a public figure) */
  register: { total: 4315.99, free: 2777.71, occupied: 1522.28, pending: 16 },
};

/** shown where the OWNER approved the catalogue, or on the OWNER preview (preliminary data) */
export const catalogVisible = () => dacia31Catalog.ownerApproved || (process.env.NEXT_PUBLIC_SITE_EDITION ?? "production") !== "production";
export const publicCatalog = () => (catalogVisible() ? dacia31Catalog.spaces.filter((space) => space.status === "AVAILABLE_NOW" || space.status === "AVAILABLE_FROM_DATE") : []);

const L = (ro: string, ru: string, en: string): Localized => ({ ro, ru, en });
const N = " ";

export const catalogCopy = {
  level: {
    lower: L("Demisol", `Цокольный этаж`, "Lower ground"),
    ground: L("Parter", `1‑й этаж`, "Ground floor"),
    level2: L("Nivelul 2", `Уровень${N}2`, "Level 2"),
    unknown: L("Etajul se confirmă", "Этаж уточняется", "Floor to be confirmed"),
  } satisfies Record<CatalogLevel, Localized>,
  scenario: {
    office: L("Birouri și cabinete", `Офисы и${N}кабинеты`, "Offices and cabinets"),
    commercial: L("Suprafețe comerciale mari", "Крупные коммерческие площади", "Large commercial floors"),
  } satisfies Record<CatalogScenario, Localized>,
  unit: {
    office: L("Birou", "Офис", "Office"),
    commercial: L("Suprafață comercială", "Коммерческая площадь", "Commercial floor"),
  } satisfies Record<CatalogScenario, Localized>,
  use: {
    office: L("birou", "офис", "office"),
    cabinet: L("cabinet", "кабинет", "cabinet"),
    medical: L("cabinet medical", "медицинский кабинет", "medical practice"),
    education: L("centru educațional", "учебный центр", "education centre"),
    retail: L("comerț", "торговля", "retail"),
    services: L("servicii", "услуги", "services"),
    showroom: L("showroom", "шоурум", "showroom"),
    storage: L("depozitare auxiliară", "вспомогательное хранение", "ancillary storage"),
  } satisfies Record<CatalogUse, Localized>,
  divisible: {
    "to-confirm": L("Unul sau mai mulți chiriași — împărțirea se confirmă după verificarea tehnică", `Один или несколько арендаторов${N}— деление подтверждается после технической проверки`, "One or several tenants — division confirmed after the technical check"),
    confirmed: L("Se poate împărți", "Возможно деление", "Can be divided"),
  },
};
