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

export const locationTraffic: Record<string, LocationTraffic> = {
  "moscova-20": {
    property: "moscova-20",
    trafficStatus: "MODELLED",
    vehicleLow: 18000,
    vehicleHigh: 26000,
    pedestrianLow: 1300,
    pedestrianHigh: 2300,
    peakPeriod: "16:00–19:00",
    // OWNER OVERRIDE «LOCATION METRICS» (2026-11-12): KEEP the three figures — vehicles 18 000–26 000 / day, pedestrian movements 1 300–2 300 / day and the
    // 16:00–19:00 period of higher activity — as preliminary marketing estimates of the location, NOT measurements; never change the values, never present
    // them as official statistics or confirmed counts; the page carries the compact note «Оценочные показатели локации. Не являются результатами фактического
    // подсчёта транспортного и пешеходного потока.» (RO / EN in the dataset: motion.modelCaption). No separate OWNER confirmation is needed to keep them.
    // The 8 routes: kept exactly as worded, not strengthened — SOURCE CHECK PENDING until the transport research is finished.
    // OWNER micro-fix 2026-11-09: 8 routes — current OSM research (docs/research/MOSCOVA_20_LOCATION_RESEARCH.md), stops within a 350 m radius; a researched fact, NOT a field count and NOT a traffic estimate (replaces the model's «10+»)
    transportRoutes: "8",
    measurementDate: null,
    measurementMethod: null,
    source: "Vehicles, pedestrians, peak and the day profile: OWNER brief «LOCATION INTELLIGENCE + VIEWING CONVERSION PASS», 2026-11-06 — PRELIMINARY MEGAPARC LOCATION MODEL (desk estimate, awaiting the field count). Public transport routes: 8 — current OpenStreetMap research (docs/research), stops within a 350 m radius; a researched fact, not a field count and not a model estimate (OWNER micro-fix 2026-11-09).",
    // was preview-only (OWNER "PRODUCTION V1" §4); OWNER R3.3 §2 approves it for the public page, labelled as a modelled scenario
    publishTraffic: true, // OWNER «R3.3 STRICT OWNER CORRECTION» §2 (2026-11-10): restore on the public page, clearly labelled as a modelled scenario
    publishScope: "PUBLIC",
    ownerApproved: true, // OWNER R3.3 §2 — «If any metric is modelled / estimated: label it clearly» (MODELLED stays MODELLED)
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
export const previewTools: PreviewTool[] = [
  { key: "moscova-20.location-model", property: "moscova-20", label: "Preliminary MEGAPARC location model — figures + «Как живёт локация» day rhythm", publishScope: "PUBLIC", ownerApproved: true, note: "OWNER R3.3 §2 (2026-11-10) — published with decision-support labels. Ranges from the OWNER brief; replaced by MEGAPARC LOCATION COUNT" },
  { key: "moscova-20.catchment-map", property: "moscova-20", label: "Catchment map ≈ 5 / 10 / 15 min walk (OSM points, straight-line radii)", publishScope: "PUBLIC", ownerApproved: true, note: "OWNER R3.3 §2 (2026-11-10) — published with decision-support labels. OSM research not yet field-checked; radii are not isochrones" },
  { key: "moscova-20.visibility-study", property: "moscova-20", label: "Visibility study on the aerial photograph (boulevard · object · customer entrance · pavement)", publishScope: "PUBLIC", ownerApproved: true, note: "OWNER R3.3 §2 (2026-11-10) — published with decision-support labels. Confirmed elements only; public transport direction not drawn (unconfirmed in the frame)" },
  { key: "moscova-20.transport-map", property: "moscova-20", label: "Transport map with the verified stops, the walking route from the customer entrance and «От остановки — к вашему бизнесу.»", publishScope: "OWNER_PREVIEW", ownerApproved: false, note: "OWNER «LOCATION VISUAL INTELLIGENCE R4» §07 (2026-11-12) — OWNER preview only until the OWNER's visual approval; production keeps the surroundings map with the transport layer. Record: docs/research/MOSCOVA_20_TRANSPORT_R4.md" },
  { key: "moscova-20.district-growth", property: "moscova-20", label: "District-growth layer (the Mezon zonal plan opposite, built complexes, the university campus) and the card «Район развивается. Возможности растут.»", publishScope: "OWNER_PREVIEW", ownerApproved: false, note: "OWNER addendum «RÎȘCANI DEVELOPMENT RESEARCH» (2026-11-12) — OWNER preview only; the facts need the OWNER's review before any publication (no Council decision on the plan was found; see the research record for what could not be confirmed). Record: docs/research/RISCANI_DEVELOPMENT_2026.md" },
  { key: "moscova-20.economics-tool", property: "moscova-20", label: "Tenant economics tool «Проверить экономику точки» (reverse calculation)", publishScope: "PUBLIC", ownerApproved: true, note: "OWNER R3.3 §2 (2026-11-10) — published with decision-support labels. Formulas, wording and the example need OWNER approval; no rent is ever pre-filled" },
  // OWNER «LEASING TEMPLATE LOCK» §9 (2026-11-10): the same decision-support zone on every leasing object — the tool differs, no location data is used outside Moscova 20
  { key: "moscova-9.economics-tool", property: "moscova-9", label: "Tenant scenario — the same reverse calculation on the visitor’s own figures (no location data)", publishScope: "PUBLIC", ownerApproved: true, note: "OWNER «LEASING TEMPLATE LOCK» §9 (2026-11-10) — «Moscova 9: use tenant scenario block with parameters entered by user»" },
  { key: "dacia-31.office-tool", property: "dacia-31", label: "Office scenario — how much space the tenant’s team needs (workplaces × area + shared part)", publishScope: "PUBLIC", ownerApproved: true, note: "OWNER «LEASING TEMPLATE LOCK» §9 (2026-11-10) — «Dacia 31: use office / whole-building tenant scenario»; never compared with the registered area, no rent" },
];

/**
 * «ПРИМЕР РАСЧЁТА» of the economics tool — DEMO numbers from the OWNER addendum,
 * never a characteristic of Moscova 20: 800 MDL × 1 500 sales = 1 200 000 MDL a
 * month → ≈ 50 sales a day over 30 days → ≈ 333 visitors a day at 15 %.
 */
export const economicsExample = { ticket: 800, revenue: 1200000, conversion: 15, days: 30, evidence: "DEMO" as const, source: "OWNER addendum «TENANT ECONOMICS & DECISION TOOL», 2026-11-06 §21" };

/** «ПРИМЕР РАСЧЁТА» of the office scenario (Dacia 31) — illustrative numbers loaded only on request, never a property figure or an offer of area. */
export const officeExample = { people: 120, perSeat: 8, shared: 30, evidence: "DEMO" as const, source: "OWNER «LEASING TEMPLATE LOCK» §9 (2026-11-10) — sample values of the office scenario" };

/** Conversion rates of the sensitivity line (OWNER addendum §28). */
export const sensitivityRates = [5, 10, 15, 20];

export const trafficVisible = (traffic: LocationTraffic | undefined, ownerPreview: boolean): traffic is LocationTraffic =>
  Boolean(traffic && traffic.publishTraffic && (traffic.ownerApproved || (traffic.trafficStatus !== "MODELLED" && traffic.publishScope === "PUBLIC") || ownerPreview));

export const toolVisible = (key: string, ownerPreview: boolean) => {
  const tool = previewTools.find((item) => item.key === key);
  return Boolean(tool && (tool.ownerApproved || ownerPreview));
};
