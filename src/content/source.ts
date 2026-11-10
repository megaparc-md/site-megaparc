import { assetProfiles, creangaProfile, daciaDevelopment, drochiaProfile, occupancyOf, projectNow, publicLand, tenantFit, vatraProfile, type DataPoint, type OperatingSlug } from "@/data/demo-content";
import { leasingExperiences } from "@/data/leasing-experience";
import { spaces, type AvailableSpace, type SpaceField, type SpaceProject, type SpaceStatus } from "@/data/leasing-inventory";
import { developmentProjects, portfolioAssets, type AssetMedia, type DevelopmentProject, type PortfolioAsset } from "@/lib/assets";
import { openVacancies, type Vacancy } from "@/lib/careers";
import type { Localized, SiteLocale } from "@/lib/site-data";

/**
 * CONTENT SOURCE — the one read API every page uses for CMS-managed content
 * (OWNER correction 2026-10-08, "CMS / WORDPRESS REQUIREMENT").
 *
 * Today the records live in the repository (src/data/leasing-inventory.ts,
 * src/lib/assets.ts, src/lib/careers.ts). In production they come from
 * WordPress (headless) through the same three collections:
 *   PROJECT          → listProjects() / getProject()
 *   AVAILABLE SPACE  → publicSpaces / spacesFor() / getSpace()
 *   VACANCY          → listVacancies()
 * Pages never read the raw data files directly, so replacing this module's
 * internals with WordPress REST / GraphQL calls changes no page.
 * docs/CMS_ARCHITECTURE.md maps every field to its WordPress field.
 *
 * Publication rules enforced here, not in the pages:
 *  - an Available space is published only while its status is AVAILABLE_NOW,
 *    AVAILABLE_FROM_DATE or (switch `showReservedUnits`) RESERVED — LEASED,
 *    HIDDEN and TO_CONFIRM are never published;
 *  - a Vacancy is published only while its status is "open";
 *  - "for sale" appears only on projects whose forSale flag is set.
 */

/* ------------------------------------------------------------------ */
/* Formatting (server side — client components receive strings)        */
/* ------------------------------------------------------------------ */

const intl: Record<SiteLocale, string> = { ro: "ro-RO", ru: "ru-RU", en: "en-GB" };

export function formatArea(m2: number, locale: SiteLocale) {
  const n = m2.toLocaleString(intl[locale], { maximumFractionDigits: 2 }).replace(/\s/g, " ");
  return `${n} ${locale === "ru" ? "м²" : "m²"}`;
}

/** Documented level areas keep both decimals as measured (293,70 m², not 293,7) — OWNER Moscova 20 mandate §4. */
export function formatAreaExact(m2: number, locale: SiteLocale) {
  if (Number.isInteger(m2)) return formatArea(m2, locale);
  const nb = " ";
  const n = m2.toLocaleString(intl[locale], { minimumFractionDigits: 2, maximumFractionDigits: 2 }).replace(/\s/g, nb);
  return `${n}${nb}${locale === "ru" ? "м²" : "m²"}`;
}

export function formatAreaRange(min: number | undefined, max: number, locale: SiteLocale) {
  if (!min || min === max) return formatArea(max, locale);
  const a = min.toLocaleString(intl[locale], { maximumFractionDigits: 2 }).replace(/\s/g, " ");
  return `${a}–${formatArea(max, locale)}`;
}

export function formatDate(iso: string, locale: SiteLocale) {
  return new Intl.DateTimeFormat(intl[locale], { day: "numeric", month: "long", year: "numeric" }).format(new Date(`${iso}T12:00:00Z`)).replace(/\s?г\.$/, "");
}

/** Build date (static export) — availability is evaluated against it. */
export const today = new Date().toISOString().slice(0, 10);

/* ------------------------------------------------------------------ */
/* AVAILABLE SPACE                                                      */
/* ------------------------------------------------------------------ */

/**
 * Business rule (OWNER 2026-11-06): RESERVED units stay visible, labelled, with a
 * waitlist action instead of a viewing. Set to false to hide reserved units from
 * every public view — one switch, no page edits.
 */
export const showReservedUnits = true;
/** Statuses that are published (the CMS prototype receives this list as a prop). */
export const publishedStatuses: readonly SpaceStatus[] = ["AVAILABLE_NOW", "AVAILABLE_FROM_DATE", ...(showReservedUnits ? (["RESERVED"] as const) : [])];
/** Every status in CMS order — the WordPress select lists them in this order. */
export const spaceStatuses: readonly SpaceStatus[] = ["AVAILABLE_NOW", "AVAILABLE_FROM_DATE", "RESERVED", "LEASED", "HIDDEN", "TO_CONFIRM"];

/**
 * Everything a tenant may see — the ONE list every public view derives from
 * (Home, Leasing, Projects, property pages, counts, forms). LEASED, HIDDEN and
 * TO_CONFIRM records stay in the CMS and are never published.
 */
export const publicSpaces: AvailableSpace[] = spaces.filter((space) => publishedStatuses.includes(space.status));

/** Every record, including leased ones — only the internal CMS workflow prototype reads this. */
export const allSpacesForCmsPrototype: AvailableSpace[] = spaces;

export function getSpace(id: string) {
  return publicSpaces.find((space) => space.id === id);
}

export function spacesFor(project: string) {
  return publicSpaces.filter((space) => space.project === project);
}

export type Availability = { key: "now" | "soon" | "reserved"; date: string | null };

export function availabilityOf(space: AvailableSpace): Availability {
  if (space.status === "RESERVED") return { key: "reserved", date: null };
  if (space.status === "AVAILABLE_FROM_DATE" && space.availableFrom && space.availableFrom > today) return { key: "soon", date: space.availableFrom };
  return { key: "now", date: null };
}

/** Viewing action allowed: published, not reserved (a reserved unit gets the waitlist), CMS switch on. */
export function viewingEnabled(space: AvailableSpace) {
  return space.status !== "RESERVED" && space.ctaEnabled !== false && publicSpaces.includes(space);
}

/**
 * Property occupancy DERIVED from the unit register (OWNER CMS brief 2026-11-06 —
 * nobody types "100 %" by hand): occupied = the OWNER-confirmed occupied area of
 * the property (area let outside the unit register) + every LEASED unit, capped
 * at the total. When the last available unit of a property becomes LEASED the
 * property reads «Занят на 100 %» everywhere (1 m² rounding tolerance: unit areas
 * are documented to two decimals, property totals to the metre).
 */
export function propertyOccupancy(slug: OperatingSlug) {
  const base = occupancyOf(slug);
  const leased = spaces.filter((space) => space.project === slug && space.status === "LEASED").reduce((sum, space) => sum + space.area, 0);
  const occupied = Math.min(base.total, base.occupied + leased);
  const fullyLet = occupied >= base.total - 1 && spacesFor(slug).length === 0;
  return { total: base.total, occupied, vacancy: Math.max(0, base.total - occupied), percent: fullyLet ? 100 : (occupied / base.total) * 100, fullyLet, available: spacesFor(slug).length };
}

/** Counts every public view shows — derived, never typed (Home, Leasing, History, company facts). */
export function leasingCounts() {
  return {
    published: publicSpaces.length,
    availableNow: publicSpaces.filter((space) => availabilityOf(space).key === "now").length,
    reserved: publicSpaces.filter((space) => space.status === "RESERVED").length,
    propertiesWithAvailability: new Set(publicSpaces.map((space) => space.project)).size,
  };
}

/* ------------------------------------------------------------------ */
/* LEASING EXPERIENCE (gold standard — Moscova 20 only for now)          */
/* ------------------------------------------------------------------ */

/**
 * The tenant-decision page for a published unit (OWNER "MOSCOVA 20 GOLD
 * STANDARD", 2026-11-06). Returned only while the unit is published: when the
 * unit becomes LEASED / HIDDEN / TO_CONFIRM the property falls back to its
 * regular page (and, if nothing is left to let, reads «Занят на 100 %»).
 */
/**
 * OWNER «LEASING TEMPLATE LOCK» (2026-11-10): every leasing object renders the one template from its dataset; the unit is
 * the published record that drives the status (Moscova 20, Moscova 9) or null for a property-level offer (Dacia 31,
 * Creangă 78) — and null too when the dataset's unit stops being published (LEASED / HIDDEN / TO_CONFIRM): the page then
 * reads its status from the property (fully let → the waiting list).
 */
export function leasingExperienceFor(projectSlug: string) {
  const experience = leasingExperiences[projectSlug];
  if (!experience) return null;
  const unit = experience.unitId ? spacesFor(projectSlug).find((space) => space.id === experience.unitId) ?? null : null;
  return { unit, experience };
}

/** A published unit with its own template (its /leasing/<id> page is the project page) — never a duplicate route. */
export function leasingExperienceForSpace(spaceId: string) {
  const unit = getSpace(spaceId);
  if (!unit || !publicSpaces.includes(unit)) return null;
  const experience = Object.values(leasingExperiences).find((item) => item.unitId === unit.id);
  return experience ? { unit, experience } : null;
}

/** Public order: available now, then soon (by date), then reserved; within a group records built on confirmed facts lead, then by area. */
export function sortSpaces(list: AvailableSpace[]) {
  const rank = (space: AvailableSpace) => ({ now: 0, soon: 1, reserved: 2 })[availabilityOf(space).key];
  const demo = (space: AvailableSpace) => (space.dataStatus === "DEMO" ? 1 : 0);
  return [...list].sort((a, b) => rank(a) - rank(b) || demo(a) - demo(b) || (a.availableFrom ?? "").localeCompare(b.availableFrom ?? "") || a.area - b.area);
}

/** "7 spaces" in each language (RU needs three forms). */
export function spacesCount(n: number, locale: SiteLocale) {
  if (locale === "ru") {
    const m10 = n % 10;
    const m100 = n % 100;
    const form = m10 === 1 && m100 !== 11 ? "помещение" : m10 >= 2 && m10 <= 4 && (m100 < 10 || m100 >= 20) ? "помещения" : "помещений";
    return `${n} ${form}`;
  }
  if (locale === "ro") return n === 1 ? "1 spațiu" : `${n} spații`;
  return n === 1 ? "1 space" : `${n} spaces`;
}

/** True when the field is not a confirmed fact (the page shows the DEMO ring). */
export function isDemoField(space: AvailableSpace, field: SpaceField) {
  return space.dataStatus !== "CONFIRMED" && !space.confirmed.includes(field);
}

/** The unit area, only when confirmed (R3.3 data gate: the Moscova 9 1st-floor area is not) — never a guessed figure. */
export function spaceArea(space: AvailableSpace, locale: SiteLocale): string | null {
  return isDemoField(space, "area") ? null : formatAreaRange(space.areaMin, space.area, locale);
}

/** The unit status line: availability, then the area when it is confirmed. */
export function spaceStatusLine(space: AvailableSpace, locale: SiteLocale) {
  return [availabilityLabel(space, locale), spaceArea(space, locale)].filter(Boolean).join(" · ");
}

export const availabilityCopy = {
  now: { ro: "Liber acum", ru: "Свободно сейчас", en: "Available now" } satisfies Localized,
  soon: { ro: "Liber din", ru: "Свободно с", en: "Available from" } satisfies Localized,
  reserved: { ro: "Rezervat", ru: "Забронировано", en: "Reserved" } satisfies Localized,
  leased: { ro: "Închiriat", ru: "Сдано", en: "Leased" } satisfies Localized,
};

export function availabilityLabel(space: AvailableSpace, locale: SiteLocale) {
  const a = availabilityOf(space);
  if (a.key === "soon" && a.date) return `${availabilityCopy.soon[locale]} ${formatDate(a.date, locale)}`;
  return availabilityCopy[a.key][locale];
}

/* ------------------------------------------------------------------ */
/* PROJECT                                                              */
/* ------------------------------------------------------------------ */

export type ProjectKind = "operating" | "development" | "land";

export type ProjectEntry = {
  slug: string;
  name: string;
  kind: ProjectKind;
  /** income = operating property page · development = VATRA / Drochia template · programme = a development record with an OWNER-confirmed programme only (Dacia 31 · Development). */
  /** land = the land development opportunity template (OWNER «LAND DEVELOPMENT OPPORTUNITIES», 2026-11-10; Drochia first) */
  template: "income" | "development" | "programme" | "land";
  /** CMS flag "for sale" — false for every project today (not every asset is for sale). */
  forSale: boolean;
  district: Localized;
  city: Localized;
  /** Format / type line. */
  format: Localized;
  formatDemo: boolean;
  /** The reason to care, one line. */
  line: Localized;
  /** What MEGAPARC is doing on the project now (governed point). */
  now: DataPoint;
  media: AssetMedia | null;
  /** Registered concept placement when no approved photograph exists. */
  conceptUse?: string;
  /** Two facts for cards. */
  facts: { label: Localized; point: DataPoint }[];
  /** Card facts line (final craft pass): place · size · status — read without opening the page. */
  card: { place: Localized; size: Localized; sizeDemo: boolean; status: Localized };
  /**
   * Editorial card composition (OWNER "PROJECT CARD TYPOGRAPHY FIX", 2026-10-09):
   * name · meta · headline · status · scope · two actions. Set only for Dacia 31
   * for now; cards without it keep the standard composition. CMS: "Заголовок
   * карточки" + "Что сдаётся" (e.g. «Всё здание»).
   */
  editorial?: { headline: Localized; scope: Localized };
  asset?: PortfolioAsset;
  development?: DevelopmentProject;
  /** OWNER-confirmed programme of a development record without a stage, timeline or design yet. */
  programme?: { buildings: DataPoint; each: DataPoint; total: DataPoint; related: string };
};

const label = {
  area: { ro: "Suprafață", ru: "Площадь", en: "Area" } satisfies Localized,
  site: { ro: "Teren", ru: "Участок", en: "Site" } satisfies Localized,
  stage: { ro: "Etapă", ru: "Стадия", en: "Stage" } satisfies Localized,
  status: { ro: "Status", ru: "Статус", en: "Status" } satisfies Localized,
};

const cardStatus = {
  operating: { ro: "Clădire în funcțiune", ru: "Действующий объект", en: "Operating property" },
  development: { ro: "Etapa: realizare", ru: "Стадия: реализация", en: "Stage: delivery" },
  programme: { ro: "Proiect de dezvoltare", ru: "Проект развития", en: "Development project" },
  land: { ro: "Teren", ru: "Земельный участок", en: "Land plot" },
} satisfies Record<string, Localized>;

/** Public kind labels (OWNER 2026-10-09): operating property · development project · land plot. */
export const kindLabel: Record<ProjectKind, Localized> = {
  operating: { ro: "Obiect în funcțiune", ru: "Действующий объект", en: "Operating property" },
  development: { ro: "Proiect de dezvoltare", ru: "Проект развития", en: "Development project" },
  land: { ro: "Teren", ru: "Земельный участок", en: "Land plot" },
};

const asset = (slug: SpaceProject) => portfolioAssets.find((a) => a.slug === slug)!;
const dev = (slug: string) => developmentProjects.find((p) => p.slug === slug)!;

const operatingEntry = (slug: SpaceProject): ProjectEntry => {
  const a = asset(slug);
  const profile = assetProfiles[slug];
  const isCreanga = slug === "creanga-78";
  return {
    slug,
    name: a.name,
    kind: "operating",
    template: "income",
    forSale: false,
    district: isCreanga ? creangaProfile.district.value : a.district,
    city: a.city,
    format: profile.format.value,
    formatDemo: profile.format.status === "DEMO",
    line: tenantFit[slug].reason,
    now: projectNow[slug],
    media: a.media,
    facts: [{ label: label.area, point: profile.area }],
    card: { place: a.city, size: profile.area.value, sizeDemo: profile.area.status === "DEMO", status: cardStatus.operating },
    asset: a,
  };
};

export const projects: ProjectEntry[] = [
  operatingEntry("moscova-9"),
  {
    ...operatingEntry("dacia-31"),
    editorial: {
      headline: { ro: "Clădire de birouri independentă pentru o singură companie.", ru: "Отдельное офисное здание для одной компании.", en: "A stand-alone office building for one company." },
      // the public offer (5 223 m² from 1 Jan 2027) is not the total property area (5 541 m², OWNER 2026-10-09) — labelled as the area offered
      scope: { ro: "Suprafață oferită", ru: "Предлагаемая площадь", en: "Area offered" },
    },
  },
  operatingEntry("moscova-20"),
  operatingEntry("creanga-78"),
  {
    slug: "vatra",
    name: "VATRA",
    kind: "development",
    template: "development",
    forSale: false,
    district: dev("vatra").place,
    city: dev("vatra").place,
    format: dev("vatra").status,
    formatDemo: false,
    line: { ro: "Un proiect propriu în realizare — de la teren la clădirea care lucrează.", ru: "Собственный проект: от участка до работающего здания.", en: "An own project in delivery — from site to a working building." },
    now: projectNow.vatra,
    media: dev("vatra").media,
    facts: [{ label: label.stage, point: vatraProfile.stage }, { label: label.site, point: vatraProfile.site }],
    card: { place: { ro: "Moldova", ru: "Молдова", en: "Moldova" }, size: vatraProfile.site.value, sizeDemo: vatraProfile.site.status === "DEMO", status: cardStatus.development },
    development: dev("vatra"),
  },
  {
    // OWNER 2026-10-09: a separate development record at Dacia 31 — never merged with the operating building
    slug: "dacia-31-development",
    name: "Dacia 31 · Development",
    kind: "development",
    template: "programme",
    forSale: false,
    district: { ro: "Chișinău", ru: "Кишинёв", en: "Chișinău" },
    city: { ro: "Chișinău", ru: "Кишинёв", en: "Chișinău" },
    format: { ro: "Proiect de dezvoltare · 3 clădiri", ru: "Проект развития · 3 здания", en: "Development project · 3 buildings" },
    formatDemo: false,
    line: { ro: "Un proiect de dezvoltare separat la Dacia 31: trei clădiri de ≈ 1.600 m² fiecare.", ru: "Отдельный проект развития на Dacia 31: три здания по ≈ 1 600 м².", en: "A separate development project at Dacia 31: three buildings of ≈ 1,600 m² each." },
    now: projectNow["dacia-31-development"],
    media: null,
    facts: [{ label: { ro: "Clădiri", ru: "Здания", en: "Buildings" }, point: daciaDevelopment.buildings }, { label: { ro: "Suprafață planificată", ru: "Планируемая площадь", en: "Planned area" }, point: daciaDevelopment.total }],
    card: { place: { ro: "Chișinău", ru: "Кишинёв", en: "Chișinău" }, size: daciaDevelopment.total.value, sizeDemo: false, status: cardStatus.programme },
    programme: { buildings: daciaDevelopment.buildings, each: daciaDevelopment.each, total: daciaDevelopment.total, related: "dacia-31" },
  },
  {
    slug: "drochia",
    name: "Drochia",
    kind: "land",
    template: "land",
    forSale: false,
    district: dev("drochia").place,
    city: dev("drochia").place,
    format: dev("drochia").kind,
    formatDemo: false,
    line: { ro: "2,0 ha la intrarea în Drochia — teren propriu, concept în evaluare.", ru: "2,0 га на въезде в Дрокию — наша земля; концепцию сейчас оцениваем.", en: "2.0 ha at the entrance to Drochia — our own land, concept under evaluation." },
    now: projectNow["drochia"],
    media: null,
    conceptUse: "development.drochia",
    facts: [{ label: label.site, point: drochiaProfile.site }, { label: label.status, point: drochiaProfile.status }],
    card: { place: dev("drochia").place, size: { ro: "2,0 ha", ru: "2,0 га", en: "2.0 ha" }, sizeDemo: drochiaProfile.site.status === "DEMO", status: cardStatus.land },
    development: dev("drochia"),
  },
];

export function listProjects() {
  return projects;
}

/** Published land plots (OWNER 2026-10-09): Drochia (its own page), Florilor 32/2, Orhei. Hîncești stays internal until its area is supplied. */
export function listLand() {
  return publicLand;
}

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}

export function nextProject(slug: string) {
  const i = projects.findIndex((project) => project.slug === slug);
  return projects[(i + 1) % projects.length];
}

/** Filter tags: kind + "leasing" while a public space exists + "sale" when flagged. */
export function projectTags(project: ProjectEntry) {
  return [project.kind, spacesFor(project.slug).length ? "leasing" : null, project.forSale ? "sale" : null].filter(Boolean) as string[];
}

/* ------------------------------------------------------------------ */
/* VACANCY                                                              */
/* ------------------------------------------------------------------ */

export function listVacancies(): Vacancy[] {
  return openVacancies;
}
