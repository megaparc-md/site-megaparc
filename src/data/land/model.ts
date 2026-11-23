import type { Localized } from "@/lib/site-data";

/**
 * LAND ASSET DATA MODEL v2 — the universal content model of a MEGAPARC land asset (OWNER STRATEGIC MANDATE «DROCHIA · DEVELOPMENT &
 * INVESTMENT EXPERIENCE · Master Template for MEGAPARC Land Portfolio», 2026-11-23, §14). Drochia is the first dataset
 * (src/data/land/drochia.ts); Hîncești, Orhei, Florilor 32/2 and the next sites are a new configuration + their materials — the page
 * (src/components/land-experience/*) is never rewritten for a site.
 *
 * Rules (§15): an unknown value is `null` with a status — never 0, never an invented figure, never a drawn boundary. Every parameter
 * carries its value, unit, source, date of check, status and the role responsible for confirming it. Public and internal data are
 * separated: a field with `public: false` and every `internal` block never leave the server (`publicView()` strips them before any
 * client component receives the asset); MEGAPARC's confidential figures are never stored here at all — only in the private record.
 *
 * WordPress (later, not connected by this mandate): one custom post type «land_asset» with the ACF groups listed in
 * docs/land/CMS_LAND_ASSET_MODEL.md — the field names below are the ACF field names.
 */

/** The four statuses of the Development Readiness Register (§9). */
export type Register = "DOCUMENTED" | "VERIFYING" | "TO_OBTAIN" | "NOT_APPLICABLE";

/** Who confirms a parameter (roles only — never a name, OWNER rule «No Team / Leadership section»). */
export type Role = "owner" | "lawyer" | "cadastral" | "surveyor" | "geologist" | "technical-director" | "architect" | "utilities" | "commercial" | "finance" | "marketing";

export type Unit = "m2" | "ha" | "m" | "pct" | "floors" | "count" | "kw" | "none";

/** A value: a number with its unit, a localised text, or null (unknown — shown as its status, never as 0). */
export type Value = { n: number; unit: Unit } | { text: Localized } | null;

export type ParamGroup = "land" | "geometry" | "planning" | "utilities";

/** One row of the technical passport (§8). */
export type Param = {
  key: string;
  group: ParamGroup;
  label: Localized;
  value: Value;
  status: Register;
  /** the public label of where the value comes from; null while nothing is received */
  source: Localized | null;
  /** the internal provenance (file, brief, record) — never rendered, stripped by publicView() */
  provenance?: string;
  /** ISO date of the last check; null while nothing is checked */
  checked: string | null;
  owner: Role;
  /** the document that confirms it (what has to be obtained) */
  document: Localized;
  note?: Localized;
  public: boolean;
};

/** One line of the Development Readiness Register (§9) — what is known and what has to be checked; never a score. */
export type ReadinessItem = {
  key: string;
  category: "title" | "planning" | "technical" | "commercial" | "materials";
  label: Localized;
  status: Register;
  /** the document or data behind the status — null while nothing exists yet */
  evidence: Localized | null;
  next: Localized;
  owner: Role;
  checked: string | null;
  public: boolean;
};

/** A media slot (§4): empty until the OWNER supplies the real material — never a foreign or generated image presented as the site. */
export type MediaSlot = {
  key: "panorama" | "film" | "tour360" | "aerial" | "orthophoto" | "plan" | "masterplan" | "renders";
  kind: "photo" | "video" | "pano" | "drawing";
  label: Localized;
  /** null = not supplied yet; the public page shows nothing, the OWNER preview shows the reserved slot */
  src: string | null;
  poster?: string | null;
  caption?: Localized;
  /** what is expected from the shoot / the architect */
  brief: Localized;
};

/** The eight layers of the Location Explorer (§5). */
export type LayerKey = "site" | "boundary" | "access" | "context" | "commerce" | "residential" | "utilities" | "potential";
export type LocationLayer = {
  key: LayerKey;
  label: Localized;
  title: Localized;
  text: Localized;
  /** ready = drawn from verified / sourced data · pending = the layer waits for a document (shown as its status, never drawn) */
  state: "ready" | "pending";
  source: Localized;
};

export type Confidence = "HIGH" | "MEDIUM" | "LOW";
/** FACT = sourced · ESTIMATE = a source's own estimate · ASSUMPTION = ours, labelled (§6) */
export type Nature = "FACT" | "ESTIMATE" | "ASSUMPTION";
export type MarketIndicator = {
  key: string;
  label: Localized;
  value: Localized;
  refDate: string;
  source: string;
  url: string | null;
  method: Localized;
  confidence: Confidence;
  nature: Nature;
  public: boolean;
  /** figure = a short number shown large (the explanation in `note`) · text = a fact sentence shown in the register */
  display: "figure" | "text";
  note?: Localized;
};

export type ScenarioKey = "retail-park" | "logistics" | "production" | "mixed";
export type ModelKey = "sale" | "hold" | "bts";
export type DevelopmentScenario = {
  key: ScenarioKey;
  title: Localized;
  line: Localized;
  audience: Localized[];
  logic: Localized;
  siteNeeds: Localized[];
  access: Localized;
  utilities: Localized[];
  checks: Localized[];
  risks: Localized[];
  /** the calculator model that fits the scenario first, and its demonstration preset */
  model: ModelKey;
  preset: string;
  /** reserved for the architect's visualisations / masterplan / 3D concept — null until they exist; never generated */
  visual: string | null;
};

/** Demonstration assumptions of the development model — always labelled «демонстрационные», never site data or a market valuation. */
export type ModelPreset = { key: string; model: ModelKey; label: Localized; values: Record<string, number> };

export type DealKey = "land-sale" | "joint-development" | "build-to-suit" | "land-for-space" | "ground-lease";
export type DealStructure = {
  key: DealKey;
  /** the configuration switch of the site (§12) */
  enabled: boolean;
  /** false until MEGAPARC confirms the format for this site — then the page stops calling it «possible» */
  agreed: boolean;
  /**
   * MEGAPARC's internal priority for this site (OWNER «DROCHIA MASTER TEMPLATE R2» §4): «primary» formats lead the deal section,
   * «individual» ones are shown as «обсуждается индивидуально». It orders the page; it never publishes a term, a price or a commitment.
   */
  priority: "primary" | "individual";
  title: Localized;
  text: Localized;
  suits: Localized;
};

export type PackDocument = {
  key: string;
  section: "offer" | "passport" | "cadastre" | "boundary" | "maps" | "photos" | "technical" | "market" | "concepts" | "terms" | "contacts";
  label: Localized;
  /** ready = the page / the PDF can show it now · preparing = being prepared · na = not applicable to the site */
  state: "ready" | "preparing" | "na";
  /** a published file per language — null until it exists (never a link to a missing document) */
  file: Localized | null;
  owner: Role;
};

export type ExplorerPoint = { kind: string; x: number; y: number; name: string | null; osm: string; brand: string | null; tag: string };
export type ExplorerData = {
  slug: string;
  frame: { w: number; h: number; metersPerUnit: number; span: { w: number; h: number } };
  site: { x: number; y: number; lat: number; lon: number };
  town: { name: string; x: number; y: number; distance: number };
  base: string;
  fetched: string;
  source: string;
  roads: { ref: string | null; name: string | null; cls: string; d: string; label: { x: number; y: number; angle: number } | null }[];
  rail: string;
  zones: { residential: string; production: string; trade: string };
  points: ExplorerPoint[];
  power: { d: string; voltage: string | null; minor: boolean }[];
  places: { name: string; kind: string; x: number; y: number }[];
};

/** A road distance from the routing research (§6) — an estimate of the routing engine, never a measured or official figure. */
export type Distance = { key: string; to: Localized; km: number; source: string; method: Localized };

/** Module switches: what the PUBLIC (production) edition may render; the OWNER preview always shows the full architecture. */
export type Approvals = {
  /** the v2 experience as the public page — until then production keeps the current page (src/components/land/land-template.tsx) */
  experience: boolean;
  explorer: boolean;
  market: boolean;
  scenarios: boolean;
  model: boolean;
  deals: boolean;
  pack: boolean;
};

export type LandAsset = {
  /** stable identifier (CMS post id later) */
  id: string;
  slug: string;
  name: string;
  kind: "land" | "redevelopment";
  /** ISO date of the dataset's last update */
  updated: string;
  geo: {
    lat: number;
    lon: number;
    /** how the point was obtained — never a surveyed boundary */
    point: Localized;
    /** the cadastral boundary as [lon, lat] pairs — only from the official plan or verified coordinates; null until then */
    boundary: { coords: [number, number][]; source: string; checked: string } | null;
  };
  place: Localized;
  /** the town in the genitive / attributive form (RU «Дрокии») — the template's titles, map labels and e-mails read it, never a literal name */
  townGen: Localized;
  address: Localized;
  /** cadastral parcels (OWNER published data until the extract is checked) */
  parcels: { number: string; area: number }[];
  area: number;
  status: Localized;
  hero: { kicker: Localized; positioning: Localized; statement: Localized; lead: Localized; published: Localized };
  /**
   * WHY THIS SITE (OWNER R2 §1 «главная страница должна продавать инвестиционную возможность»): three or four short arguments right
   * under the first screen. Each one is a verified fact (source in `source`), never a forecast, a superlative or a tenant's interest.
   */
  arguments: { key: string; title: Localized; text: Localized; nature: Nature; source: Localized }[];
  media: MediaSlot[];
  /** the published current facts of the first screen and their status (§4: published data, not a substitute for the cadastral check) */
  facts: { key: string; label: Localized; value: Localized; status: Register; provenance?: string }[];
  layers: LocationLayer[];
  explorer: ExplorerData;
  distances: Distance[];
  market: { summary: Localized; indicators: MarketIndicator[]; record: string; checked: string };
  scenarios: DevelopmentScenario[];
  passport: Param[];
  readiness: ReadinessItem[];
  presets: ModelPreset[];
  deals: DealStructure[];
  pack: PackDocument[];
  approvals: Approvals;
  /** internal notes for the team — never rendered, stripped by publicView() */
  internal?: { notes: string[] };
};

/** The client-safe view: only public rows, no internal block (§14 «разделение публичных и внутренних данных»). */
export function publicView(asset: LandAsset): LandAsset {
  return {
    ...asset,
    passport: asset.passport.filter((p) => p.public).map((p) => ({ ...p, provenance: undefined })),
    facts: asset.facts.map((f) => ({ ...f, provenance: undefined })),
    readiness: asset.readiness.filter((r) => r.public),
    market: { ...asset.market, indicators: asset.market.indicators.filter((i) => i.public) },
    internal: undefined,
  };
}
