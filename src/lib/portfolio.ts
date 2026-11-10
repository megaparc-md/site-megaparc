import { getProject, spacesFor, type ProjectEntry } from "@/content/source";
import { landRecords } from "@/data/demo-content";
import { localePath, type Localized, type SiteLocale } from "@/lib/site-data";

/**
 * PORTFOLIO STRUCTURE — OWNER «R3.3 STRICT OWNER CORRECTION» §5 (2026-11-10). One source for every listing
 * (Projects, Leasing, the header dropdown, the footer, Home, History): three categories, OWNER order.
 *   A · LEASING — Moscova 20 · Creangă 78 · Moscova 9 · Dacia 31 (each with its own status — never copied)
 *   B · LAND FOR DEVELOPMENT — Hîncești · Drochia · Orhei · Chișinău · Florilor 32/2 (never mixed with operating assets)
 *   C · PROJECTS UNDER DEVELOPMENT / CONSTRUCTION — VATRA · Vasile Lupu 48/3 (never presented as leasing)
 * Only OWNER-confirmed values are shown; a missing value is an OWNER INPUT (docs/OWNER_INPUTS_R3.md), never invented.
 */
export type PortfolioKey = "leasing" | "land" | "development";

export const portfolioCategories: { key: PortfolioKey; anchor: string; label: Localized; title: Localized; lead: Localized }[] = [
  {
    key: "leasing",
    anchor: "leasing",
    label: { ro: "Închiriere", ru: "Аренда", en: "Leasing" },
    title: { ro: "Clădiri MEGAPARC în închiriere.", ru: "Объекты MEGAPARC в аренде.", en: "MEGAPARC buildings for lease." },
    lead: { ro: "Clădiri în funcțiune, în proprietatea companiei — fiecare cu statutul ei actual.", ru: "Действующие здания в собственности компании — у каждого свой актуальный статус.", en: "Operating buildings owned by the company — each with its own current status." },
  },
  {
    key: "land",
    anchor: "land",
    label: { ro: "Terenuri pentru dezvoltare", ru: "Земля для развития", en: "Land for development" },
    title: { ro: "Terenuri pentru proiectele următoare.", ru: "Земля для следующих проектов.", en: "Land for the next projects." },
    lead: { ro: "Terenuri în proprietatea MEGAPARC. Planurile pentru fiecare teren se publică după aprobare.", ru: "Участки в собственности MEGAPARC. Планы по каждому участку публикуем после утверждения.", en: "Plots owned by MEGAPARC. Plans for each plot are published once approved." },
  },
  {
    key: "development",
    anchor: "development",
    label: { ro: "Proiecte în dezvoltare și construcție", ru: "Проекты в разработке и строительстве", en: "Projects under development and construction" },
    title: { ro: "Proiecte proprii în lucru.", ru: "Собственные проекты в работе.", en: "Our own projects in progress." },
    lead: { ro: "Proiectele nu se oferă spre închiriere până la confirmare.", ru: "Проекты не предлагаются в аренду до подтверждения.", en: "Projects are not offered for lease until confirmed." },
  },
];

/** A · LEASING — OWNER order. */
export const leasingSlugs = ["moscova-20", "creanga-78", "moscova-9", "dacia-31"] as const;
export const leasingProjects = (): ProjectEntry[] => leasingSlugs.map((slug) => getProject(slug)!).filter(Boolean);

/**
 * Leasing status where no unit is published and the building is not fully let. Dacia 31 (OWNER R3 / R3.1 / R3.2: an
 * active leasing asset with a viewing) — the draft offer «5 223 m² from 1 January 2027» is not OWNER-confirmed
 * (OWNER data 2026-10-09: unpublished until confirmed; R3.3 §7: «Do not assume 01.01.2027 applies to Dacia 31»), so
 * area and timing are «on request» until the OWNER confirms them.
 */
export const leasingOnRequest: Partial<Record<string, Localized>> = {
  "dacia-31": { ro: "Se închiriază · suprafața și termenul — la cerere", ru: "Сдаётся в аренду · площадь и сроки — по запросу", en: "For lease · area and timing on request" },
};

/** A fully let building in the leasing portfolio keeps a waiting list (OWNER 2026-10-09: «only fully let and a waitlist»). */
export const waitlistLabel: Localized = { ro: "Înscrieți-vă pe lista de așteptare", ru: "Встать в лист ожидания", en: "Join the waiting list" };
export const waitlistHref = (locale: SiteLocale, slug: string) => `${localePath(locale, "/contact")}?subject=lease&property=${slug}#occupier`;
export const viewingPropertyHref = (locale: SiteLocale, slug: string) => `${localePath(locale, "/contact")}?subject=lease&property=${slug}#occupier`;

export const hasPublishedOffer = (slug: string) => spacesFor(slug).length > 0;

/** B · LAND FOR DEVELOPMENT — OWNER order; areas only where OWNER-confirmed (landRecords). */
export type LandItem = { slug: string; name: Localized; place: Localized | null; area: Localized | null; page: string | null };
const landArea = (slug: string): Localized | null => {
  const record = landRecords.find((plot) => plot.slug === slug);
  return record && record.area ? record.point.value : null;
};
export const landPortfolio: LandItem[] = [
  { slug: "hincesti", name: { ro: "Hîncești", ru: "Хынчешты", en: "Hîncești" }, place: { ro: "Hîncești", ru: "Хынчешты", en: "Hîncești" }, area: landArea("hincesti"), page: null },
  { slug: "drochia-gateway", name: { ro: "Drochia Gateway", ru: "Drochia Gateway", en: "Drochia Gateway" }, place: { ro: "Drochia", ru: "Дрокия", en: "Drochia" }, area: landArea("drochia-gateway"), page: "drochia-gateway" },
  { slug: "orhei", name: { ro: "Orhei", ru: "Орхей", en: "Orhei" }, place: { ro: "Orhei", ru: "Орхей", en: "Orhei" }, area: landArea("orhei"), page: null },
  { slug: "chisinau", name: { ro: "Chișinău", ru: "Кишинёв", en: "Chișinău" }, place: { ro: "Chișinău", ru: "Кишинёв", en: "Chișinău" }, area: null, page: null },
  { slug: "florilor-32-2", name: { ro: "Florilor 32/2", ru: "Florilor 32/2", en: "Florilor 32/2" }, place: null, area: landArea("florilor-32-2"), page: null },
];
export const landWithoutArea = landPortfolio.filter((plot) => !plot.area).length;

/** C · PROJECTS UNDER DEVELOPMENT / CONSTRUCTION — OWNER order. Vasile Lupu 48/3: name and category only (OWNER R3.3). */
export type DevelopmentItem = { slug: string; name: string; status: Localized; page: string | null };
export const developmentPortfolio = (): DevelopmentItem[] => {
  const vatra = getProject("vatra");
  return [
    ...(vatra ? [{ slug: vatra.slug, name: vatra.name, status: vatra.card.status, page: vatra.slug }] : []),
    // OWNER tax data (R3.3.1 §14): the plot and the registered existing building — never read as the future project's GBA
    { slug: "vasile-lupu-48-3", name: "Vasile Lupu 48/3", status: { ro: "Teren 1 000 m² · construcție existentă înregistrată 172,1 m²", ru: "Участок 1 000 м² · зарегистрированная существующая постройка 172,1 м²", en: "Plot 1,000 m² · registered existing building 172.1 m²" }, page: null },
  ];
};

/** Where an item without its own page links to: its category on the Projects page. */
export const itemHref = (locale: SiteLocale, page: string | null, anchor: string) => (page ? localePath(locale, `/projects/${page}`) : `${localePath(locale, "/projects")}#${anchor}`);

export const portfolioCounts = () => ({ leasing: leasingSlugs.length, land: landPortfolio.length, development: developmentPortfolio().length });
