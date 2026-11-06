import type { Evidence } from "@/data/leasing-inventory";
import type { Localized } from "@/lib/site-data";

/**
 * LEASING EXPERIENCE MODEL — the content model of the tenant-decision page
 * (OWNER "MOSCOVA 20 · GOLD STANDARD COMMERCIAL LEASING EXPERIENCE",
 * 2026-11-06). Applied to Moscova 20 only until the OWNER approves the
 * standard; then the same model carries every leasing page.
 *
 * Separation (OWNER priority clarification, 2026-11-06):
 *   PROPERTY          src/lib/assets.ts + assetOccupancy (name, address, total area)
 *   UNIT + STATUS     src/data/leasing-inventory.ts (marketed / useful area,
 *                     breakdown, status, date, CTA switch) — the one source of truth
 *   THIS FILE         everything the page says about the unit that is not a
 *                     status: tenant fit, capital readiness, engineering, access,
 *                     location intelligence, commercial terms, decision checks,
 *                     photographs, editorial headings
 *   COMPONENTS        src/components/leasing-experience/* — design only, no
 *                     property facts in them
 *
 * Every fact carries its evidence class (OWNER mandate §37). Public rule:
 * OWNER_CONFIRMED, DOCUMENT_CONFIRMED and APPROXIMATE render (approximate ones
 * say «ок.»); TO_CONFIRM renders only as something MEGAPARC is checking;
 * HISTORICAL_ANALYSIS and DEMO never render. The tags themselves never appear
 * on the page (only the global PREVIEW · DEMO DATA marker).
 *
 * CMS mapping: docs/CMS_MOSCOVA_20_MODEL.md.
 */

export type { Evidence };

export const publishable = (evidence: Evidence) => evidence === "OWNER_CONFIRMED" || evidence === "DOCUMENT_CONFIRMED" || evidence === "APPROXIMATE";

/** A fact or statement with its evidence and where it comes from. */
export type Fact = { text: Localized; evidence: Evidence; source: string };

/** A real photograph of the property (scripts/moscova-20-photos.mjs). */
export type Photo = {
  id: string;
  /** Up to 1600 px (aerials 1278 px — never upscaled beyond their placement). */
  src: string;
  /** 820 px derivative. */
  small: string;
  /** Optional 4:5 art-directed phone crop. */
  mobile?: string;
  width: number;
  height: number;
  alt: Localized;
  /** object-position for cover crops. */
  position?: string;
  evidence: Evidence;
  source: string;
};

export type PhotoChapter = { no: string; photo: string; label: Localized; caption: Localized; layout: "wide" | "pair-left" | "pair-right" | "full" | "inset" };

export type FitLevel = "strong" | "good" | "check";
/** One business format: why it may fit, what must be checked, an optional honest note. */
export type FitRow = { key: string; use: Localized; level: FitLevel; reasons: Localized[]; checks: Localized[]; note: Localized | null; evidence: Evidence; source: string };

/** ready = in place today · tenant = the tenant's scope · confirm = MEGAPARC confirms for the tenant's format · fact = a measured value with no readiness state (clear height). */
export type TechState = "ready" | "tenant" | "confirm" | "fact";
export type TechRow = { key: string; label: Localized; value: Localized; state: TechState; evidence: Evidence; source: string };

/**
 * Commercial term — value null until the OWNER confirms it. A value renders only
 * when it is confirmed AND `publish` is on: confirming a rate internally is not
 * the same as approving it for the public site (AGENTS.md: no public rent or
 * payment terms unless the OWNER decides otherwise). CMS: «Публиковать на
 * сайте», switchable by the OWNER / administrator role only.
 */
export type Term = { key: string; label: Localized; value: Localized | null; evidence: Evidence; source: string; publish: boolean };

export type CostState = "done" | "concept" | "tenant" | "if-needed";
export type CostRow = { key: string; label: Localized; state: CostState; note: Localized };

/** A check before the decision: what is known today (null = nothing to state yet) and what is verified for the tenant's format. */
export type CheckRow = { key: string; topic: Localized; known: Localized | null; check: Localized; anchor?: string };

/** Location metric — CMS-ready; null values never render (OWNER mandate §13). */
export type LocationMetric = { key: string; label: Localized; value: Localized | null; evidence: Evidence; source: string; asOf: string | null };
/** Background evidence from older studies — internal only, never rendered (§12, §14). */
export type HistoricalNote = { key: string; text: string; evidence: "HISTORICAL_ANALYSIS"; source: string; publish: false };

export type Heading = { kicker: Localized; title: Localized; lead?: Localized };

export type LeasingExperience = {
  unitId: string;
  project: string;
  address: Localized;
  photos: Record<string, Photo>;
  hero: { photo: string; title: Localized; place: Localized };
  capex: Heading & { body: Localized[]; note: Localized; photo: string; photoCaption: Localized; secondPhoto: string; secondCaption: Localized; readyTitle: Localized; ready: Fact[]; tenantTitle: Localized; tenant: Fact[] };
  fit: Heading & { rows: FitRow[] };
  location: Heading & { points: Fact[]; metrics: LocationMetric[]; internal: HistoricalNote[]; internalNote: string };
  area: Heading & { propertyLine: Localized; levelsLine: Localized; groundOnly: Fact };
  story: Heading & { chapters: PhotoChapter[] };
  access: Heading & { photo: string; photoCaption: Localized; rows: TechRow[] };
  engineering: Heading & { rows: TechRow[]; note: Localized };
  ledger: Heading & { knownTitle: Localized; known: Fact[]; confirmTitle: Localized; confirm: Fact[] };
  /** Level marks of the architectural drawings (e.g. ±0,000 / −2,950) — documented values only. */
  scheme: Heading & { note: Localized; plans: Fact; marks: { ground: string; lower: string; evidence: Evidence; source: string } | null };
  /** covers = the topics the commercial proposal answers (no values); rows = CMS fields, rendered only once a value is confirmed. */
  terms: Heading & { pending: Localized; covers: Localized[]; rows: Term[] };
  opening: Heading & { rows: CostRow[] };
  checks: Heading & { rows: CheckRow[] };
  /** The campaign / film module: film stays null until a real film exists — then poster first, no autoplay. */
  campaign: { kicker: Localized; title: Localized; line: Localized; lead: Localized; cta: Localized; photo: string; film: { src: string; poster: string; title: Localized; duration: string } | null };
  viewing: Heading & { contactsLine: Localized };
  journey: Heading & { steps: { title: Localized; text: Localized }[]; note: Localized };
};

/* ------------------------------------------------------------------ */
/* Typesetting (docs/RU_MICROCOPY.md §5) — applied once, at definition   */
/* ------------------------------------------------------------------ */

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
