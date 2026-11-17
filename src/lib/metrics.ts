import { landRecords, landTotal, operatingArea } from "@/data/demo-content";
import { portfolioAssets } from "@/lib/assets";
import type { Localized } from "@/lib/site-data";

/**
 * Institutional scale metrics — single data source for the homepage
 * "MEGAPARC at scale" section. Methodology: docs/PORTFOLIO_SCALE_METRICS.md.
 *
 * A metric set to `null` is not rendered. Never hardcode these values in JSX.
 */
export const portfolioMetrics = {
  /**
   * Area of the four operating properties (m², OWNER 2026-10-09): 5 541 + 2 158 +
   * 2 536 + 704 = 10 939 m². A sum of total property areas — never called GLA.
   */
  totalAssetArea: operatingArea as number | null,
  /**
   * Land plots (m², OWNER 2026-10-09): Drochia 20 000 + Florilor 32/2 8 470 +
   * Orhei 22 000 = 50 470 m². Published as a minimum ("+") because Hîncești
   * exists but its area is not supplied yet.
   */
  developmentLandArea: landTotal as number | null,
  developmentLandIsMinimum: landRecords.some((plot) => plot.area === null),
  operatingAssets: portfolioAssets.length,
  /** VATRA + Dacia 31 · Development (land plots are counted as land, not as projects). */
  developmentProjects: 2,
  heritageSince: 1995,
};

export type ScaleMetric = {
  key: string;
  value: number;
  /** Two-digit padding for small counts (04, 02). */
  pad?: number;
  plus?: boolean;
  unit?: Localized;
  secondary?: Localized;
  label: Localized;
};

const m2: Localized = { ro: "m²", ru: "м²", en: "m²" };

/** Only non-null metrics are returned, in display order. */
export function scaleMetrics(): ScaleMetric[] {
  const list: (ScaleMetric | null)[] = [
    portfolioMetrics.totalAssetArea === null
      ? null
      : {
          key: "total",
          value: portfolioMetrics.totalAssetArea,
          plus: false,
          unit: m2,
          label: { ro: "Suprafața imobilelor în exploatare", ru: "Площадь действующих объектов", en: "Operating property area" },
        },
    portfolioMetrics.developmentLandArea === null
      ? null
      : {
          key: "land",
          value: portfolioMetrics.developmentLandArea,
          plus: portfolioMetrics.developmentLandIsMinimum,
          unit: m2,
          secondary: {
            ro: `${(portfolioMetrics.developmentLandArea / 10000).toFixed(2).replace(".", ",")} ha`,
            ru: `${(portfolioMetrics.developmentLandArea / 10000).toFixed(2).replace(".", ",")} га`,
            en: `${(portfolioMetrics.developmentLandArea / 10000).toFixed(2)} ha`,
          },
          label: { ro: "Terenuri", ru: "Земельные участки", en: "Land plots" },
        },
    {
      key: "operating",
      value: portfolioMetrics.operatingAssets,
      pad: 2,
      label: { ro: "Imobile în exploatare", ru: "Действующие объекты", en: "Operating properties" },
    },
    {
      key: "projects",
      value: portfolioMetrics.developmentProjects,
      pad: 2,
      label: { ro: "Proiecte de dezvoltare", ru: "Проекты развития", en: "Development projects" },
    },
  ];
  return list.filter((item): item is ScaleMetric => item !== null);
}
