import type { Evidence } from "@/data/leasing-inventory";
import type { Localized } from "@/lib/site-data";

/**
 * LEASING EXPERIENCE MODEL — the content model of the tenant-decision page.
 * OWNER "MOSCOVA 20 · GOLD STANDARD" (2026-11-06), recomposed by
 * "MOSCOVA 20 · COMPACT PREMIUM LEASING EXPERIENCE · CONVERSION TO VIEWING"
 * (2026-11-06): eight scenes instead of sixteen sections. Applied to Moscova 20
 * only until the OWNER approves the standard.
 *
 * Separation (OWNER priority clarification, 2026-11-06) — unchanged:
 *   PROPERTY          src/lib/assets.ts + assetOccupancy (name, address, total area)
 *   UNIT + STATUS     src/data/leasing-inventory.ts (marketed / useful area,
 *                     level breakdown, status, date, CTA switch) — the one source
 *                     of truth; every area figure on the page is read from it
 *   THIS FILE         everything the page says about the unit that is not a
 *                     status: proofs, technical rows, location, access,
 *                     engineering, plans (geometry from the architectural plans),
 *                     capital base, photographs, fit, the viewing scene
 *   COMPONENTS        src/components/leasing-experience/* — design only
 *
 * Every fact carries its evidence class (OWNER mandate §37). Public rule:
 * OWNER_CONFIRMED, DOCUMENT_CONFIRMED and APPROXIMATE render (approximate ones
 * say «ок.»); TO_CONFIRM renders only as «уточняется»; HISTORICAL_ANALYSIS and
 * DEMO never render. The tags themselves never appear on the page.
 *
 * CMS mapping: docs/CMS_MOSCOVA_20_MODEL.md.
 */

export type { Evidence };

export const publishable = (evidence: Evidence) => evidence === "OWNER_CONFIRMED" || evidence === "DOCUMENT_CONFIRMED" || evidence === "APPROXIMATE";

/** A fact or statement with its evidence and where it comes from. */
export type Fact = { text: Localized; evidence: Evidence; source: string };

/** A real photograph of the property (scripts/moscova-20-photos.mjs; crops only). */
export type Photo = {
  id: string;
  /** Up to 1600 px (aerials 1278 px — never upscaled beyond their placement). */
  src: string;
  /** 640–820 px derivative. */
  small: string;
  width: number;
  height: number;
  alt: Localized;
  /** object-position for cover crops. */
  position?: string;
  evidence: Evidence;
  source: string;
};

/** A placement of a photograph: which frame, how it is cropped (zoom ≤ 1.6 keeps the 1600 px sources above 1× at their size). */
export type Shot = { photo: string; position?: string; zoom?: number };

export type Heading = { kicker: Localized; title: Localized; lead?: Localized };

/** ready = in place today · tenant = the tenant's scope · confirm = confirmed for the tenant's format («Уточняется») · fact = a measured value without a state. */
export type TechState = "ready" | "tenant" | "confirm" | "fact";
export type TechRow = { key: string; label: Localized; value: Localized; state: TechState; evidence: Evidence; source: string };

/**
 * Format lens (OWNER "TENANT PSYCHOLOGY / CONVERSION INTELLIGENCE PASS", 2026-11-06, §4):
 * the same confirmed facts, reordered and interpreted for one business format —
 * its main question, the evidence that speaks to it (each pointing to where it is
 * shown on the page), what is checked together, and a possible organisation of
 * the space drawn on the real plan (generic zones only, always captioned).
 */
export type LensRef = PanelTab | "plans" | "photos" | "capex";
export type LensFormat = {
  key: "retail" | "showroom" | "service" | "office";
  label: Localized;
  question: Localized;
  evidence: { text: Localized; ref: LensRef; evidence: Evidence; source: string }[];
  checks: Localized[];
  scenario: { label: Localized; level: "ground" | "lower"; shape: Pt[] }[];
};

/**
 * Commercial term — value null until the OWNER confirms it. A value renders only
 * when it is confirmed AND `publish` is on (CMS «Публиковать на сайте», OWNER /
 * administrator only). AGENTS.md: no public rent or payment terms by default.
 */
export type Term = { key: string; label: Localized; value: Localized | null; evidence: Evidence; source: string; publish: boolean };

export type CostState = "done" | "concept" | "tenant" | "if-needed";
export type CostRow = { key: string; label: Localized; state: CostState; note: Localized };

/** Location metric — CMS-ready; null values never render (OWNER mandate §13). */
export type LocationMetric = { key: string; label: Localized; value: Localized | null; evidence: Evidence; source: string; asOf: string | null };
/** Background evidence from older studies — internal only, never rendered (§12, §14). */
export type HistoricalNote = { key: string; text: string; evidence: "HISTORICAL_ANALYSIS"; source: string; publish: false };

/* ---------------------------------------------------------------- plans */

/** Millimetres, origin at axis 1 / A/1 of the architectural plans, y towards the street. */
export type Pt = [number, number];
export type ZoneKind = "sales" | "aux" | "wc" | "tech" | "corridor" | "terrace" | "ramp" | "stair";
/** A room or area of the plan — shape traced from the documented drawing; area from its room schedule (null for stairs). */
export type PlanZone = { key: string; no: string | null; kind: ZoneKind; label: Localized; area: number | null; shape: Pt[]; evidence: Evidence; /** where the number marker sits (defaults to the centre of the shape) */ at?: Pt };
export type PlanMarkKind = "customer" | "service" | "street";
/** An entrance or orientation mark: the arrow points into the unit. */
export type PlanMark = { key: string; kind: PlanMarkKind; label: Localized; at: Pt; dir: "up" | "down" };
export type PlanLevel = { key: "ground" | "lower"; tab: Localized; label: Localized; mark: string; zones: PlanZone[]; marks: PlanMark[]; columns: Pt[] };

/* ---------------------------------------------------------------- page */

export type PanelTab = "tech" | "location" | "areas" | "engineering" | "access" | "readiness";
export type PanelMedia = { kind: "photo"; shot: Shot } | { kind: "map" } | { kind: "scheme" };

export type LeasingExperience = {
  unitId: string;
  project: string;
  address: Localized;
  photos: Record<string, Photo>;

  /** SCENE 01 — the building first (a crop without the neighbour's lettering), the positioning line, the offer. */
  hero: { photo: string; phonePhoto: string; title: Localized; place: Localized; offer: Localized; support: Localized };

  /** SCENE 02 — three proofs, each with a real photograph. */
  why: Heading & { items: { key: string; title: Localized; text: Localized; shot: Shot }[] };

  /** SCENE 03 — the decision panel: one block, six answers. Rows below feed its tabs. */
  panel: Heading & { tabs: { key: PanelTab; label: Localized; lead: Localized; media: PanelMedia }[] };
  /** Technical characteristics beyond the areas (areas, levels and heights come from the unit record). */
  specs: TechRow[];
  location: { lead: Localized; points: Fact[]; metrics: LocationMetric[]; internal: HistoricalNote[]; internalNote: string };
  area: { propertyLine: Localized; groundOnly: Fact };
  access: TechRow[];
  engineering: { rows: TechRow[]; note: Localized };
  readiness: { confirmTitle: Localized; confirm: Fact[]; costTitle: Localized; cost: CostRow[] };
  terms: { title: Localized; pending: Localized; covers: Localized[]; rows: Term[] };

  /** SCENE 04 — plans and areas: two levels traced from the architectural plans + the section scheme. */
  plans: Heading & { levels: PlanLevel[]; schemeTab: Localized; note: Localized; source: string; marks: { ground: string; lower: string; evidence: Evidence; source: string } | null };

  /** SCENE 05 — the capital base, as a feeling and as two short lists. */
  capex: Heading & { photo: string; body: Localized; readyTitle: Localized; ready: Fact[]; tenantTitle: Localized; tenant: Fact[] };

  /** SCENE 06 — a curated photo story (5–7 frames), each answering a tenant's question. */
  story: Heading & { frames: { key: string; shot: Shot; layout: "cinematic" | "vertical" | "full"; label: Localized; caption: Localized }[] };

  /** SCENE 03 — «Какой бизнес вы рассматриваете?»: one selector, four formats, the page's argument re-weighted for each. */
  lens: Heading & { formats: LensFormat[]; honesty: Localized; regulated: Localized; scenarioNote: Localized; evidenceTitle: Localized; checksTitle: Localized };

  /** SCENE 08 — the viewing: one real photograph, the next step, the short form. The film plugs in here when it exists (poster first, never autoplay). */
  viewing: Heading & { photo: string; contactsLine: Localized; steps: { title: Localized; lead: Localized; items: Localized[] }[]; film: { src: string; poster: string; title: Localized; duration: string } | null };
};

/* ------------------------------------------------------------------ */
/* Typesetting (docs/RU_MICROCOPY.md §5) — applied once, at definition   */
/* ------------------------------------------------------------------ */

// written as an escape on purpose: a literal no-break space is invisible in review and was lost once
const NB = " ";
const short = "в|с|к|у|о|и|а|я|на|по|до|за|из|от|не|ни|но|для|при|без|над|под|про|об|во|со|ко|В|С|К|У|О|И|А|Я|На|По|До|За|Из|От|Не|Ни|Но|Для|При|Без|Над|Под|Про|Об|Во|Со";
const shortRe = new RegExp(`(^|[\\s(«—])(${short}) `, "g");
const units = /(\d) (м²|м|кВт|га|%|m²|m|kW|ha|фазы|faze|phases|санузла|grupuri|washrooms|выхода|ieșiri|exits)(?=[\s.,;:)·]|$)/g;

function typeset(text: string, ru: boolean) {
  // a property name never breaks between its street and its number (Moscova 20)
  let out = text.replace(/ — /g, `${NB}— `).replace(/ – /g, `${NB}– `).replace(units, `$1${NB}$2`).replace(/\b(Moscova|Dacia|Creangă) (\d+)/g, `$1${NB}$2`);
  if (ru) {
    // 1-й, 1-го: a non-breaking hyphen (JS \b does not see Cyrillic letters, so the end is a lookahead)
    out = out.replace(/(\d)-(й|го|м|я|е|х)(?=[\s.,;:)»]|$)/g, "$1‑$2");
    for (let i = 0; i < 2; i++) out = out.replace(shortRe, `$1$2${NB}`);
  }
  return out;
}

/** Localized text with the site's typesetting rules applied. */
export const T = (ro: string, ru: string, en: string): Localized => ({ ro: typeset(ro, false), ru: typeset(ru, true), en: typeset(en, false) });
