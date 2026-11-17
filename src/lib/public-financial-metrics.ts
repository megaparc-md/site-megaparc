import type { Localized } from "@/lib/site-data";

/**
 * Key figures — OWNER approval-preview values.
 *
 * OWNER override (2026-09-26): these four figures are authorised ONLY for the
 * founder / owner approval preview on GitHub Pages. They are temporary,
 * review-only values, tracked in docs/OWNER_DATA_TO_REPLACE.md.
 *
 * Rules enforced in code:
 * - every entry carries `temporary: true`;
 * - never hardcoded in JSX — always rendered from this module;
 * - never referenced from src/lib/seo.ts, JSON-LD, Open Graph or any
 *   structured data (see `financialMetricsPolicy`);
 * - the GitHub preview is served `noindex, nofollow` (src/lib/seo.ts).
 *
 * They must not reach production megaparc.md until replaced or approved.
 */

export type PublicFinancialMetric = {
  key: "portfolio-value" | "capital-invested" | "development-pipeline" | "contracted-rent";
  value: number;
  currency: "EUR";
  display: string;
  label: Localized;
  note: Localized;
  temporary: true;
};

export const publicFinancialMetrics: PublicFinancialMetric[] = [
  {
    key: "portfolio-value",
    value: 25_000_000,
    currency: "EUR",
    display: "€25M+",
    label: { ro: "Valoarea portofoliului", ru: "Стоимость портфеля", en: "Portfolio value" },
    note: { ro: "Imobile în exploatare și în dezvoltare", ru: "Действующие объекты и проекты развития", en: "Operating properties and development projects" },
    temporary: true,
  },
  {
    key: "capital-invested",
    value: 18_000_000,
    currency: "EUR",
    display: "€18M+",
    label: { ro: "Investiții realizate", ru: "Инвестировано", en: "Invested to date" },
    note: { ro: "Achiziții, dezvoltare și modernizare", ru: "Приобретения, девелопмент и модернизация", en: "Acquisitions, development and renewal" },
    temporary: true,
  },
  {
    key: "development-pipeline",
    value: 12_000_000,
    currency: "EUR",
    display: "€12M+",
    label: { ro: "Proiecte în lucru", ru: "Проекты в работе", en: "Projects in progress" },
    note: { ro: "Proiecte și concepte în evaluare", ru: "Проекты и концепции в проработке", en: "Projects and concepts under evaluation" },
    temporary: true,
  },
  {
    key: "contracted-rent",
    value: 2_400_000,
    currency: "EUR",
    display: "€2.4M+",
    label: { ro: "Chirie contractată pe an", ru: "Арендная плата по договорам в год", en: "Contracted rent per year" },
    note: { ro: "Venituri din chirii ale obiectelor în funcțiune", ru: "Арендные поступления действующих объектов", en: "Rental income from operating properties" },
    temporary: true,
  },
];

export const financialMetricsPolicy = {
  reviewOnly: true,
  authorisedBy: "OWNER override 2026-09-26",
  excludedFrom: ["seo", "json-ld", "open-graph", "structured-data", "production"],
  register: "docs/OWNER_DATA_TO_REPLACE.md",
} as const;

export const hasTemporaryFinancialMetrics = publicFinancialMetrics.some((metric) => metric.temporary);

export const capitalCopy = {
  kicker: { ro: "Cifre cheie", ru: "Ключевые показатели", en: "Key figures" } satisfies Localized,
  title: {
    ro: "Portofoliul în cifre.",
    ru: "Портфель в цифрах.",
    en: "The portfolio in numbers.",
  } satisfies Localized,
  text: {
    ro: "Valoarea portofoliului, investițiile realizate, proiectele în lucru și chiria contractată, în valori rotunjite.",
    ru: "Стоимость портфеля, вложенные средства, проекты в работе и арендная плата по договорам — в округлённых значениях.",
    en: "Portfolio value, invested capital, projects in progress and contracted rent, in rounded figures.",
  } satisfies Localized,
};
