/**
 * TENANT INTELLIGENCE — the location model and the decision tools of the leasing
 * page (OWNER "LOCATION INTELLIGENCE + VIEWING CONVERSION PASS" and "TENANT
 * ECONOMICS & DECISION TOOL", 2026-11-06). Moscova 20 only.
 *
 * Alias-free on purpose (type imports only): scripts/demo-register.mjs --check
 * loads this file with Node's type stripping, so the production gate reads the
 * same record the page renders.
 *
 * TRAFFIC STATUS
 *   MODELLED  PRELIMINARY MEGAPARC LOCATION MODEL — a desk estimate from the
 *             OWNER brief. Never called official, confirmed or measured.
 *   MEASURED  MEGAPARC LOCATION COUNT — a field count
 *             (docs/MOSCOVA_20_LOCATION_MEASUREMENT_PLAN.md), with its date and method.
 *   VERIFIED  a verified external dataset, with its source.
 * Replacing the model by a count is a data-only change: status, figures, date,
 * method, source. The page labels each class differently and never mixes them.
 *
 * RENDER RULE (trafficVisible / toolVisible)
 *   a MODELLED record or an unapproved tool renders only in the OWNER preview
 *   (GitHub Pages build, or `next dev`) — never in a production build until
 *   `ownerApproved` is set by the OWNER.
 * PRODUCTION GATE
 *   `npm run gate:production` fails while a MODELLED record has publishTraffic on
 *   without ownerApproved, and while any tool below is unapproved.
 */

export type TrafficStatus = "MODELLED" | "MEASURED" | "VERIFIED";

/** One hour of the modelled day: relative level 0–1 per mode — the rhythm of the street, never a count. */
export type HourLevel = { hour: number; auto: number; pedestrian: number; transit: number };

export type LocationTraffic = {
  property: string;
  trafficStatus: TrafficStatus;
  /** vehicles per day — a range, never a single figure */
  vehicleLow: number | null;
  vehicleHigh: number | null;
  /** pedestrian movements per day in front of the property — a range */
  pedestrianLow: number | null;
  pedestrianHigh: number | null;
  /** "16:00–19:00" */
  peakPeriod: string | null;
  /** public transport routes — a researched fact, not a model estimate: the routes at stops within 350 m in the current OpenStreetMap research (never a field count) */
  transportRoutes: string | null;
  measurementDate: string | null;
  measurementMethod: string | null;
  source: string;
  publishTraffic: boolean;
  /** where publishTraffic applies: the OWNER preview only, or the public site once approved */
  publishScope: "OWNER_PREVIEW" | "PUBLIC";
  ownerApproved: boolean;
  /** the shape of a working day 08–20 (morning steady · day medium · evening peak) */
  dayProfile: HourLevel[];
};

const day = (rows: [number, number, number, number][]): HourLevel[] => rows.map(([hour, auto, pedestrian, transit]) => ({ hour, auto, pedestrian, transit }));

/** Site edition, read directly (this module also loads in Node for the production gate). */
const productionEdition = (process.env.NEXT_PUBLIC_SITE_EDITION ?? "production") === "production";

export const locationTraffic: Record<string, LocationTraffic> = {
  "moscova-20": {
    property: "moscova-20",
    trafficStatus: "MODELLED",
    vehicleLow: 18000,
    vehicleHigh: 26000,
    pedestrianLow: 1300,
    pedestrianHigh: 2300,
    peakPeriod: "16:00–19:00",
    // OWNER micro-fix 2026-11-09: 8 routes — current OSM research (docs/research/MOSCOVA_20_LOCATION_RESEARCH.md), stops within a 350 m radius; a researched fact, NOT a field count and NOT a traffic estimate (replaces the model's «10+»)
    transportRoutes: "8",
    measurementDate: null,
    measurementMethod: null,
    source: "Vehicles, pedestrians, peak and the day profile: OWNER brief «LOCATION INTELLIGENCE + VIEWING CONVERSION PASS», 2026-11-06 — PRELIMINARY MEGAPARC LOCATION MODEL (desk estimate, awaiting the field count). Public transport routes: 8 — current OpenStreetMap research (docs/research), stops within a 350 m radius; a researched fact, not a field count and not a model estimate (OWNER micro-fix 2026-11-09).",
    // production edition: the preliminary model is never published (OWNER "PRODUCTION V1" §4)
    publishTraffic: !productionEdition,
    publishScope: "OWNER_PREVIEW",
    ownerApproved: false,
    dayProfile: day([
      [8, 0.74, 0.6, 0.86],
      [9, 0.7, 0.54, 0.76],
      [10, 0.58, 0.44, 0.52],
      [11, 0.55, 0.47, 0.46],
      [12, 0.58, 0.57, 0.5],
      [13, 0.6, 0.6, 0.52],
      [14, 0.58, 0.52, 0.5],
      [15, 0.64, 0.6, 0.6],
      [16, 0.82, 0.8, 0.82],
      [17, 0.95, 0.92, 0.97],
      [18, 1, 1, 1],
      [19, 0.86, 0.82, 0.78],
      [20, 0.66, 0.6, 0.55],
    ]),
  },
};

/**
 * Decision modules that stay in the OWNER preview until the OWNER approves them
 * for the public site. Each one is a row of the production gate.
 */
export type PreviewTool = { key: string; property: string; label: string; publishScope: "OWNER_PREVIEW" | "PUBLIC"; ownerApproved: boolean; note: string };

// production edition: none of the OWNER-preview decision tools is part of the build (OWNER "PRODUCTION V1" §4)
export const previewTools: PreviewTool[] = productionEdition ? [] : [
  { key: "moscova-20.location-model", property: "moscova-20", label: "Preliminary MEGAPARC location model — figures + «Как живёт локация» day rhythm", publishScope: "OWNER_PREVIEW", ownerApproved: false, note: "Ranges from the OWNER brief; replaced by MEGAPARC LOCATION COUNT" },
  { key: "moscova-20.catchment-map", property: "moscova-20", label: "Catchment map ≈ 5 / 10 / 15 min walk (OSM points, straight-line radii)", publishScope: "OWNER_PREVIEW", ownerApproved: false, note: "OSM research not yet field-checked; radii are not isochrones" },
  { key: "moscova-20.visibility-study", property: "moscova-20", label: "Visibility study on the aerial photograph (boulevard · object · customer entrance · pavement)", publishScope: "OWNER_PREVIEW", ownerApproved: false, note: "Confirmed elements only; public transport direction not drawn (unconfirmed in the frame)" },
  { key: "moscova-20.economics-tool", property: "moscova-20", label: "Tenant economics tool «Проверить экономику точки» (reverse calculation)", publishScope: "OWNER_PREVIEW", ownerApproved: false, note: "Formulas, wording and the example need OWNER approval; no rent is ever pre-filled" },
];

/**
 * «ПРИМЕР РАСЧЁТА» of the economics tool — DEMO numbers from the OWNER addendum,
 * never a characteristic of Moscova 20: 800 MDL × 1 500 sales = 1 200 000 MDL a
 * month → ≈ 50 sales a day over 30 days → ≈ 333 visitors a day at 15 %.
 */
export const economicsExample = { ticket: 800, revenue: 1200000, conversion: 15, days: 30, evidence: "DEMO" as const, source: "OWNER addendum «TENANT ECONOMICS & DECISION TOOL», 2026-11-06 §21" };

/** Conversion rates of the sensitivity line (OWNER addendum §28). */
export const sensitivityRates = [5, 10, 15, 20];

export const trafficVisible = (traffic: LocationTraffic | undefined, ownerPreview: boolean): traffic is LocationTraffic =>
  Boolean(traffic && traffic.publishTraffic && (traffic.ownerApproved || (traffic.trafficStatus !== "MODELLED" && traffic.publishScope === "PUBLIC") || ownerPreview));

export const toolVisible = (key: string, ownerPreview: boolean) => {
  const tool = previewTools.find((item) => item.key === key);
  return Boolean(tool && (tool.ownerApproved || ownerPreview));
};
