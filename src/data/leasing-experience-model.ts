import type { Evidence } from "@/data/leasing-inventory";
import type { Localized } from "@/lib/site-data";

/**
 * LEASING EXPERIENCE MODEL — the content model of the tenant-decision page.
 * OWNER "MOSCOVA 20 · GOLD STANDARD" (2026-11-06), recomposed by
 * "MOSCOVA 20 · COMPACT PREMIUM LEASING EXPERIENCE · CONVERSION TO VIEWING"
 * (2026-11-06), then by "FINAL VIEWING CONVERSION PASS" + "LOCATION
 * INTELLIGENCE + VIEWING CONVERSION PASS" (2026-11-06): DESIRE → PROOF → DETAIL,
 * the detail behind drawers and reveals. Applied to Moscova 20 only until the
 * OWNER approves the standard. Location traffic and decision-tool gating:
 * src/data/tenant-intelligence.ts.
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
  /** Intrinsic width of `small` when it is not the default 820 px (the plan drawings: 1400 px) — the srcset descriptor. */
  smallWidth?: number;
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

/** One key fact of the technical passport: a figure (or the clear heights read from the unit's level breakdown) and its unit as separate boxes. */
export type PassportFact = { key: string; /** the card's small label (OWNER «TECHNICAL READINESS — CARDS», 2026-11-11), e.g. «Мощность» */ name?: Localized; figure: Localized | "heights"; unit: Localized; label: Localized; evidence: Evidence; source: string };
/** One infrastructure card of the passport («Инфраструктура объекта», OWNER 2026-11-11): small label · large value · short explanation. */
export type PassportCard = { key: string; title: Localized; value: Localized; text: Localized; evidence: Evidence; source: string };
/** One specification row of a passport group: term · value · an optional short explanation. */
export type PassportItem = { key: string; title: Localized; value: Localized; note?: Localized; evidence: Evidence; source: string };
/** One side of the property and what opens onto it (OWNER technical data update 2026-11-10 — directions only, never positions). */
export type PassportSide = { key: string; name: Localized; items: Localized[]; evidence: Evidence; source: string };
export type TechPassport = {
  facts: PassportFact[];
  /** the access / logistics directions: the boulevard and the courtyard, with the premises between them (a diagram of directions, not to scale) */
  sides?: { title: Localized; core: Localized; sides: PassportSide[]; caption: Localized };
  /** one specification sheet: engineering · logistics · access · sanitary · fit-out (two columns on wide screens, folded groups on phones) */
  groups: { key: string; title: Localized; items: PassportItem[]; note?: Localized }[];
  /** the unit's level breakdown (gross · useful · clear height) with the offered area against the property */
  levelsTitle: Localized;
  /** what the building already has — infrastructure cards (OWNER 2026-11-11) or, for an older dataset, a plain list */
  ready: { title: Localized; items?: Localized[]; cards?: PassportCard[] };
  capex: Localized;
  check: { title: Localized; lead: Localized; items: Localized[] };
  principle: Localized;
};

/**
 * Format lens (OWNER "TENANT PSYCHOLOGY / CONVERSION INTELLIGENCE PASS", 2026-11-06, §4):
 * the same confirmed facts, reordered and interpreted for one business format —
 * its main question, the evidence that speaks to it (each pointing to where it is
 * shown on the page), what is checked together, and a possible organisation of
 * the space drawn on the real plan (generic zones only, always captioned).
 */
export type LensRef = "location" | "tech" | "readiness" | "plans" | "photos" | "capex";
/**
 * A possible organisation drawn delicately on a real photograph (OWNER "FINAL
 * VIEWING CONVERSION PASS", 2026-11-06): generic zones only, always captioned
 * «Возможный сценарий организации». Shapes in the photograph's pixel space
 * (1600 × 1066 interiors); `at` is where the numbered marker and label sit.
 */
export type PhotoZone = { label: Localized; shape: Pt[]; at: Pt };
export type LensFormat = {
  key: "retail" | "showroom" | "service" | "office" | "headquarters" | "commercial";
  label: Localized;
  /** the format's own question about the location and the space */
  question: Localized;
  /** 3–4 arguments, each pointing to where it is shown — an optional short title above the text (OWNER copy 2026-11-10, client service) */
  evidence: { title?: Localized; text: Localized; ref: LensRef; evidence: Evidence; source: string }[];
  /** the checks made together before a decision */
  checks: Localized[];
  /** the format's own headings of the two lists (absent → the section's «Почему формат может подойти» / «Что важно проверить до принятия решения») */
  evidenceTitle?: Localized;
  checksTitle?: Localized;
  /** one closing decision-support statement of the format (OWNER «YOUR FORMAT», 2026-11-10) */
  closing?: Localized;
  /** null where no interior photograph exists — the visual keeps its frame and says the organisation is shown on the plan at the viewing */
  overlay: { photo: string; zones: PhotoZone[]; evidence: "DEMO"; source: string } | null;
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
/**
 * The authoritative drawing of a level (OWNER plan replacement pass, 2026-11-09): a crop of the OWNER's
 * architectural PDF (lease-agreement annex, 1:100) registered as a photograph, and the original PDF itself.
 */
export type PlanDrawing = { photo: string; pdf: string };
export type PlanLevel = { key: "ground" | "lower"; tab: Localized; label: Localized; mark: string; zones: PlanZone[]; marks: PlanMark[]; columns: Pt[]; drawing?: PlanDrawing };

/* ---------------------------------------------------------------- page */

/**
 * TRANSPORT (OWNER «LOCATION VISUAL INTELLIGENCE R4», 2026-11-12, §02–§03) — the wording of the transport map and of the block
 * beside it. Geometry, distances and walking times are NOT typed here: they come from the generated research layer
 * (src/data/moscova-20-transport.ts) by stop key. Routes are listed only when confirmed by at least two independent sources
 * (docs/research/MOSCOVA_20_TRANSPORT_R4.md); the two directions of one route count once.
 */
export type TransitCopy = {
  title: Localized;
  /** stop key → the public name of the stop */
  stops: Record<string, Localized>;
  labels: { nearest: Localized; nearestNote: Localized; walk: Localized; routes: Localized; access: Localized; accessValue: Localized };
  /** «≈ {m} м · около {min} минут» */
  walkValue: Localized;
  /** «≈ {m} м · {min} мин» — the short form on the map */
  walkShort: Localized;
  routes: { mode: "trolleybus" | "bus"; label: Localized; refs: string[] }[];
  /** the opposite direction: «… ≈ {m} м …» */
  opposite: Localized;
  /** the street names on the map: metres from the entrance, the angle of the street; `tall` — another anchor on the phone crop */
  streets: { key: string; label: Localized; x: number; y: number; angle: number; tall?: { x: number; y: number } }[];
  legend: { premises: Localized; nearest: Localized; other: Localized; walk: Localized; crossing: Localized; ring: Localized };
  layers: { stops: Localized; walk: Localized; crossings: Localized };
  note: Localized;
  aria: Localized;
  evidence: Evidence;
  source: string;
};

/**
 * DISTRICT GROWTH (OWNER addendum «RÎȘCANI DEVELOPMENT RESEARCH», 2026-11-12) — the projects that change the district around the
 * property: a map layer of its own (never on the transport map) and the card beside it. Only verified facts with their status;
 * figures of a draft plan are worded as the draft's figures. Record: docs/research/RISCANI_DEVELOPMENT_2026.md.
 */
export type GrowthStatus = "planned" | "built" | "announced";
export type GrowthCopy = {
  tab: Localized;
  kicker: Localized;
  title: Localized;
  lead: Localized;
  facts: { key: string; value: Localized; label: Localized }[];
  /** the plan area in the units of the surroundings map (the OSM outline of the plot) */
  zone: { path: string; source: string };
  /** `at` — a fixed anchor in map units (the centre of an area); otherwise the point is projected from lat / lon */
  projects: { key: string; status: GrowthStatus; name: Localized; text: Localized; lat: number; lon: number; at?: [number, number]; evidence: Evidence; source: string }[];
  status: Record<GrowthStatus, Localized>;
  stateLabel: Localized;
  state: Localized;
  balanceLabel: Localized;
  balance: Localized;
  note: Localized;
  aria: Localized;
};

/** The ecosystem around the address — OWNER copy; the map category it lights up (when the catchment map is shown). */
export type EcosystemGroup = { key: string; title: Localized; text: Localized; category: "residential" | "education" | "transport" | "services" };
/** A mark of the visibility study on the aerial photograph — confirmed elements only (pixel space of the photo). */
export type VisibilityMark = { key: string; kind: "object" | "entrance" | "pavement" | "road" | "glazing"; label: Localized; shape: Pt[]; at: Pt; evidence: Evidence; source: string };

/**
 * OWNER «LEASING TEMPLATE LOCK · MOSCOVA 20 = EXACT MASTER TEMPLATE» (2026-11-10): one page system, four datasets.
 * Moscova 20 is the canonical master configuration; Moscova 9, Dacia 31 and Creangă 78 fill the same fields. A field
 * that has no confirmed data keeps its section and renders its honest «по запросу» state — the structure never changes.
 */
export type CtaCopy = { primary: Localized; secondary: { label: Localized; href: string } };
/** The decision-support zone (portal 04, the teaser card, the drawer): the economics reverse calculation, the office scenario, or the waiting list. */
export type DecisionKind = "economics" | "office" | "waitlist";

export type LeasingExperience = {
  /** the published unit whose status drives the page (Moscova 20, Moscova 9) — null for a property-level offer (Dacia 31, Creangă 78) */
  unitId: string | null;
  project: string;
  address: Localized;
  photos: Record<string, Photo>;
  /** missing photograph slots of the sixteen-shot brief — internal OWNER INPUT, never rendered */
  ownerInput?: string[];

  /** SCENE 01 — DESIRE: the building first (a crop without the neighbour's lettering), the positioning line, the offer. */
  hero: { photo: string; phonePhoto: string; title: Localized; place: Localized; offer: Localized; support: Localized };
  /** fixed actions for a property-level story (early interest · viewing · waiting list); absent → read from the unit status (Moscova 20) */
  cta?: CtaCopy;
  /** the hero figure when the marketed area is not confirmed — the registered area, labelled as such by `hero.offer` */
  figure?: number;
  /** portal words where the property's story differs (absent → the Moscova 20 words) */
  portals?: Partial<Record<"location" | "plans" | "ready" | "decision", { label: Localized; word: Localized }>>;
  /** summary cards (absent → computed from the unit record, Moscova 20) */
  summary?: { key: string; label: Localized; title: Localized; text: Localized }[];
  /** the statement scene (absent → «{area}. / N уровня. / Одна концепция.» from the unit record, Moscova 20) */
  statement?: { lines: Localized[]; photo: string | null };
  decision: { kind: DecisionKind; teaser: { title: Localized; text: Localized } };

  /** Three reasons visible at once, right after the decision bar. */
  reasons: { label: Localized; items: { key: string; no: string; label: Localized; text: Localized }[] };

  /** SCENE 02 — PROOF, the visual centre: «Локация в движении». */
  motion: Heading & {
    ecosystemTitle: Localized;
    ecosystem: EcosystemGroup[];
    /** the location-model copy — only where a traffic record is shown (Moscova 20) */
    modelTitle?: Localized;
    modelCaption?: Localized;
    rhythmTitle?: Localized;
    rhythmNote?: Localized;
    mapTab: Localized;
    mapCaption: Localized;
    visibilityTab: Localized;
    /** the real aerial with the confirmed marks — null where no aerial photograph exists (the address card shows the OSM map) */
    visibility: { photo: string; caption: Localized; marks: VisibilityMark[] } | null;
    /** the address card's line when there is no aerial */
    addressText?: Localized;
    /** the transport card where the catchment map is not shown (OSM stops on the location map) */
    transport?: { title: Localized; text: Localized };
    /** the transport map with the verified stops and the block «От остановки — к вашему бизнесу.» (OWNER «LOCATION VISUAL INTELLIGENCE R4» §02–§03) */
    transit?: TransitCopy;
    /** the district-growth layer and the card «Район развивается. Возможности растут.» (OWNER addendum «RÎȘCANI DEVELOPMENT RESEARCH») */
    growth?: GrowthCopy;
    verdict: { title: Localized; text: Localized };
    cta: { title: Localized; text: Localized };
  };

  /** Technical characteristics drawer: areas, levels and heights come from the unit record; these rows add the rest. */
  drawers: { tech: { title: Localized; lead: Localized }; readiness: { title: Localized; lead: Localized } };
  /** TENANT TECHNICAL PASSPORT (OWNER «TECHNICAL READINESS — OWNER REDESIGN», 2026-11-10) — when present, the technical
   *  drawer renders it instead of the row list: four key facts → three groups → what is already in place → what we check
   *  for your format → the owner principle. Values repeat the confirmed records above (never new facts). */
  passport?: TechPassport;
  specs: TechRow[];
  location: { lead: Localized; points: Fact[]; metrics: LocationMetric[]; internal: HistoricalNote[]; internalNote: string };
  area: { propertyLine: Localized; groundOnly: Fact | null };
  access: TechRow[];
  engineering: { rows: TechRow[]; note: Localized };
  readiness: { confirmTitle: Localized; confirm: Fact[]; costTitle: Localized; cost: CostRow[] };
  /** «Коммерческие условия предоставляются после первичной проверки формата бизнеса.» — the only public line on terms. */
  terms: { title: Localized; pending: Localized; covers: Localized[]; rows: Term[] };

  /** SCENE 05 — DETAIL: plans and areas, two levels traced from the architectural plans + the section scheme; the room schedule on request. */
  plans: Heading & {
    levels: PlanLevel[];
    schemeTab: Localized;
    note: Localized;
    source: string;
    marks: { ground: string; lower: string; evidence: Evidence; source: string } | null;
    /** no approved drawing: the same plan frame with «Планы предоставляются по запросу» and the floor logic that is confirmed */
    onRequest?: { tab: Localized; title: Localized; text: Localized; floors: Localized[] };
  };

  /** SCENE 04 — PROOF with emotion: the capital base, one large photograph and two lists of five. */
  capex: Heading & {
    photo: string | null; readyTitle: Localized; ready: Fact[]; tenantTitle: Localized; tenant: Fact[];
    /** the technical-feasibility principle under the comparison, with who carries it (OWNER «READINESS BLOCK» correction, 2026-11-10) */
    principle?: { text: Localized; by: Localized };
  };

  /** SCENE 06 — DETAIL: the photo sequence 01 · address → 06 · possibility, each frame answering one question. */
  story: Heading & { frames: { key: string; no: string; shot: Shot; label: Localized; caption: Localized }[] };

  /** SCENE 03 — «Какой бизнес вы рассматриваете?»: four formats, one shown at a time. */
  lens: Heading & { formats: LensFormat[]; honesty: Localized; regulated: Localized; scenarioNote: Localized; evidenceTitle: Localized; checksTitle: Localized; /** the visual's text where no interior photograph exists yet */ noPhoto?: Localized };

  /** SCENE 07 — CONVERSION: «Не решайте по фотографиям.», two actions, the short form. The film plugs in here when it exists (poster first, never autoplay). */
  viewing: Heading & {
    photo: string | null;
    contactsLine: Localized;
    steps: { title: Localized; text: Localized }[];
    film: { src: string; poster: string; title: Localized; duration: string } | null;
    /** the second action card (absent → «Получить коммерческое предложение» + the one public line on terms) */
    second?: { label: Localized; meta: Localized; intent: string };
  };
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
