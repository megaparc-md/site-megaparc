import dataset from "@/data/vacancies.json";
import { publicAsset, type Localized, type SiteLocale } from "@/lib/site-data";

/**
 * CAREERS — vacancies as CMS records (OWNER «MEGAPARC CAREERS — PREMIUM EMPLOYER BRAND & WORDPRESS CMS», 2026-11-25).
 *
 * ONE source: src/data/vacancies.json (schema «megaparc-vacancies/1»). Today the file is the repository seed written from the
 * nine OWNER source documents; with WordPress connected, scripts/cms-vacancies-pull.mjs replaces it with the validated export of
 * the MEGAPARC CMS plugin (content type mp_vacancy) before the build — the same file, the same shape, so no page changes.
 * The file committed in the repository is the last known good snapshot: when the CMS cannot be reached the site is built from it.
 *
 * A vacancy is ONE record with three language versions; numbers (pay, order, dates) are stored once.
 * Published: `vacancies` = open vacancies only. `closed` = vacancies that were public and are now paused or closed — a short
 * record (title, direction) so that an address that was shared keeps answering with «the vacancy is closed» instead of an error.
 * Drafts and archived vacancies never leave WordPress.
 *
 * Candidate personal data is never sent to analytics; no application backend is wired — the candidate writes from their own
 * mail to the HR address of the vacancy.
 */

export type VacancyCategory = "management" | "construction" | "commercial" | "legal" | "operations";
export type Pay = {
  /** false = the pay is not shown on the site (the CMS switch «Показывать оплату»). */
  visible: boolean;
  /** fixed = one amount · from = «от» · range = min–max · individual = discussed individually (payNote says how). */
  type: "fixed" | "from" | "range" | "individual";
  amount: number | null;
  min: number | null;
  max: number | null;
  currency: string;
  basis: "net" | "gross" | null;
  /** «в месяц» is printed only where the source states it. */
  period: "month" | null;
  /** the amount applies to the probation period. */
  probation: boolean;
};
export type VacancyText = {
  title: string;
  /** R2: the short title of a list card (the full official title stays on the vacancy page); absent → the title. */
  shortTitle?: string | null;
  /** R2: the theme of the role — the heading of the scene «the role in focus» on the vacancy page; absent → the direction. */
  theme?: string | null;
  summary: string;
  intro: string;
  role: string[];
  responsibilities: { title: string; items: string[] }[];
  requirements: { must: string[]; skills: string[]; plus: string[] };
  kpi: { intro: string; items: string[] } | null;
  offer: string[];
  apply: string[];
  seo: { title: string; description: string };
};
export type Vacancy = {
  /** stable id — never changes after creation. */
  id: string;
  /** one address for the three languages (as for projects), so the language switch keeps the page. */
  slug: string;
  category: VacancyCategory;
  status: "open";
  order: number;
  featured: boolean;
  employment: "full-time" | "part-time" | null;
  workMode: "on-site" | "hybrid" | "remote" | null;
  location: Localized | null;
  publishedAt: string | null;
  closesAt: string | null;
  hrEmail: string;
  pay: Pay;
  payNote: Localized | null;
  bonus: Localized | null;
  compensation: Localized | null;
  /** the mail subject exactly as HR expects it (the wording of the source announcement); null = the Romanian title. */
  applySubject: string | null;
  /** R2: the real MEGAPARC photograph of the vacancy page (a key of `careerScenes`); absent → the direction's photograph. */
  scene?: CareerSceneKey | null;
  i18n: Record<SiteLocale, VacancyText>;
};
export type ClosedVacancy = { id: string; slug: string; status: "paused" | "closed"; category: VacancyCategory; title: Localized };

/* ------------------------------------------------------------------ */
/* Typesetting — applied once, when the dataset is read                  */
/* ------------------------------------------------------------------ */

// built from the code point on purpose: a literal no-break space is invisible in review and was lost more than once
const NB = String.fromCharCode(160);
const NBH = String.fromCharCode(8209);
const short = "в|с|к|у|о|и|а|я|на|по|до|за|из|от|не|ни|но|для|при|без|над|под|про|об|во|со|ко|В|С|К|У|О|И|А|Я|На|По|До|За|Из|От|Не|Ни|Но|Для|При|Без|Над|Под|Про|Об|Во|Со";
const shortRe = new RegExp(`(^|[\\s(«—])(${short}) `, "g");

/** RU: no hanging prepositions or single letters; every language: a dash never starts a line, a number keeps its unit. */
export function typeset(text: string, locale: SiteLocale) {
  let out = text
    .replace(/ — /g, `${NB}— `)
    .replace(/ – /g, `${NB}– `)
    .replace(/(\d) (\d{3})(?!\d)/g, `$1${NB}$2`)
    .replace(/(\d) (MDL|лет|года|год|ani|years|%)(?=[\s.,;:)»]|$)/g, `$1${NB}$2`)
    .replace(/(категории|categoria|Category|category) B\b/g, `$1${NB}B`);
  if (locale === "ru") {
    out = out.replace(/(\d)-(летн\S*)/g, `$1${NBH}$2`);
    for (let i = 0; i < 2; i++) out = out.replace(shortRe, `$1$2${NB}`);
  }
  return out;
}

const set = <T,>(value: T, locale: SiteLocale): T => {
  if (typeof value === "string") return typeset(value, locale) as T;
  if (Array.isArray(value)) return value.map((item) => set(item, locale)) as T;
  if (value && typeof value === "object") return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, set(item, locale)])) as T;
  return value;
};
const localized = (value: Localized | null): Localized | null => (value ? { ro: typeset(value.ro, "ro"), ru: typeset(value.ru, "ru"), en: typeset(value.en, "en") } : null);

type RawVacancy = Omit<Vacancy, "status" | "featured" | "location" | "publishedAt" | "closesAt" | "hrEmail"> & Partial<Pick<Vacancy, "featured" | "location" | "publishedAt" | "closesAt" | "hrEmail">> & { status?: string };
const raw = dataset as unknown as { schema: string; generated: string | null; source: string | null; hrEmail: string; location: Localized | null; vacancies: RawVacancy[]; closed?: ClosedVacancy[] };

/** The default HR address of the dataset (a vacancy may carry its own). */
export const hrEmail = raw.hrEmail;

/** Open vacancies in the order HR set (the CMS field «Порядок»), then by title. */
export const openVacancies: Vacancy[] = raw.vacancies
  .filter((vacancy) => (vacancy.status ?? "open") === "open")
  .map((vacancy) => ({
    ...vacancy,
    status: "open" as const,
    featured: vacancy.featured ?? false,
    location: localized(vacancy.location ?? raw.location),
    publishedAt: vacancy.publishedAt ?? null,
    closesAt: vacancy.closesAt ?? null,
    hrEmail: vacancy.hrEmail ?? raw.hrEmail,
    payNote: localized(vacancy.payNote),
    bonus: localized(vacancy.bonus),
    compensation: localized(vacancy.compensation),
    i18n: { ro: set(vacancy.i18n.ro, "ro"), ru: set(vacancy.i18n.ru, "ru"), en: set(vacancy.i18n.en, "en") },
  }))
  .sort((a, b) => a.order - b.order || a.i18n.ro.title.localeCompare(b.i18n.ro.title));

/** Paused and closed vacancies that keep their address (never listed, never offered, no application). */
export const closedVacancies: ClosedVacancy[] = (raw.closed ?? []).filter((item) => !openVacancies.some((open) => open.slug === item.slug));

/* ------------------------------------------------------------------ */
/* Professional directions                                              */
/* ------------------------------------------------------------------ */

export const categoryOrder: VacancyCategory[] = ["management", "construction", "commercial", "legal", "operations"];

export const categoryLabel: Record<VacancyCategory, Localized> = {
  management: { ro: "Strategie și management", ru: "Стратегия и управление", en: "Strategy & Management" },
  construction: { ro: "Construcții și inginerie", ru: "Строительство и инженерия", en: "Construction & Engineering" },
  commercial: { ro: "Dezvoltare comercială și marketing", ru: "Коммерческое развитие и маркетинг", en: "Commercial Development & Marketing" },
  legal: { ro: "Suport juridic", ru: "Юридическое сопровождение", en: "Legal" },
  operations: { ro: "Exploatare și operațiuni", ru: "Эксплуатация и операционная деятельность", en: "Operations & Facilities" },
};

/** What each direction does at MEGAPARC — one factual line. */
export const categoryLine: Record<VacancyCategory, Localized> = {
  management: localized({
    ro: "Strategia companiei, obiectivele departamentelor și deciziile investiționale.",
    ru: "Стратегия компании, цели департаментов и инвестиционные решения.",
    en: "Company strategy, departmental objectives and investment decisions.",
  })!,
  construction: localized({
    ro: "Proiecte de la documentația permisivă până la recepție; clădiri și instalații care funcționează fiabil.",
    ru: "Проекты от разрешительной документации до приёмки; надёжная работа зданий и инженерных систем.",
    en: "Projects from permits to handover; buildings and engineering systems that work reliably.",
  })!,
  commercial: localized({
    ro: "Închirierea spațiilor proprii, relația cu chiriașii și promovarea proprietăților.",
    ru: "Аренда собственных площадей, отношения с арендаторами и продвижение объектов.",
    en: "Leasing our own space, tenant relationships and the promotion of our properties.",
  })!,
  legal: localized({
    ro: "Contracte, conformitate cu legislația și protejarea intereselor companiei.",
    ru: "Договоры, соответствие законодательству и защита интересов компании.",
    en: "Contracts, legal compliance and protection of the company's interests.",
  })!,
  operations: localized({
    ro: "Funcționarea de zi cu zi a clădirilor și a companiei: exploatare, aprovizionare, întreținere și reparații.",
    ru: "Ежедневная работа зданий и компании: эксплуатация, снабжение, обслуживание и ремонт.",
    en: "The day-to-day running of the buildings and the company: operations, procurement, maintenance and repairs.",
  })!,
};

/** Directions that have at least one open vacancy, in the fixed order, with their vacancies — derived, never typed. */
export function openCategories() {
  return categoryOrder
    .map((category) => ({ category, vacancies: openVacancies.filter((vacancy) => vacancy.category === category) }))
    .filter((group) => group.vacancies.length > 0);
}

/* ------------------------------------------------------------------ */
/* Scenes — real MEGAPARC photographs for the careers pages (R2)        */
/* ------------------------------------------------------------------ */

/**
 * R2 (OWNER «MEGAPARC CAREERS R2», 2026-11-25 · §6): every vacancy page carries one real photograph of a MEGAPARC property —
 * OWNER-supplied frames already published on the site (portfolio, the VATRA aerial set, the Moscova 20 OWNER-approved interior set).
 * A photograph illustrates the company's property — never the place of work of the vacancy, never people of MEGAPARC.
 * Never one of the frames rejected for large formats (m20-facade*, m20-approach, m20-frontage, portfolio/moscova-20*), and never a frame
 * dominated by tenants' signage (the Creangă 78 frontages carry large third-party brand signs — brand safety lock, OWNER 2026-11-11).
 * HR chooses the scene in WordPress from this fixed list; a new frame needs a code release.
 */
export type CareerScene = { src: string; small: string; smallWidth: number; width: number; height: number; position?: string; alt: Localized; caption: Localized };
const scene = (src: string, small: string, smallWidth: number, width: number, height: number, alt: Localized, caption: Localized, position?: string): CareerScene => ({
  src: publicAsset(src), small: publicAsset(small), smallWidth, width, height, alt: localized(alt)!, caption: localized(caption)!, position,
});
export const careerScenes = {
  "dacia-31": scene("/assets/portfolio/dacia-31.webp", "/assets/portfolio/dacia-31-card.webp", 1400, 2200, 1467,
    { ro: "Dacia 31 — clădire MEGAPARC în Chișinău, vedere de sus", ru: "Dacia 31 — здание MEGAPARC в Кишинэу, вид сверху", en: "Dacia 31 — a MEGAPARC building in Chișinău, seen from above" },
    { ro: "Dacia 31 · imobil în exploatare · Chișinău", ru: "Dacia 31 · действующий объект · Кишинэу", en: "Dacia 31 · operating property · Chișinău" }, "50% 46%"),
  "vatra-overview": scene("/assets/development/vatra-aerial-overview-02.webp", "/assets/development/vatra-aerial-overview-02-card.webp", 1365, 1536, 1024,
    { ro: "VATRA de sus — proiectul de dezvoltare MEGAPARC lângă lac", ru: "VATRA сверху — проект развития MEGAPARC у озера", en: "VATRA from above — a MEGAPARC development project by the lake" },
    { ro: "VATRA · proiect de dezvoltare", ru: "VATRA · проект развития", en: "VATRA · development project" }),
  "vatra-shoreline": scene("/assets/development/vatra-aerial-shoreline-01.webp", "/assets/development/vatra-aerial-shoreline-01-card.webp", 1365, 1536, 1024,
    { ro: "VATRA — malul lacului, clădirile proiectului și drumul de acces", ru: "VATRA — берег озера, постройки проекта и подъездная дорога", en: "VATRA — the lake shore, the project's buildings and the access road" },
    { ro: "VATRA · proiect de dezvoltare", ru: "VATRA · проект развития", en: "VATRA · development project" }),
  "m20-engineering": scene("/assets/leasing/moscova-20/m20-int-lower-depth.webp", "/assets/leasing/moscova-20/m20-int-lower-depth-sm.webp", 820, 1536, 1024,
    { ro: "Demisolul Moscova 20: trasee de ventilație, unitate split și calorifere", ru: "Цоколь Moscova 20: воздуховоды, сплит-система и радиаторы", en: "Moscova 20 lower ground: ducts, a split unit and radiators" },
    { ro: "Moscova 20 · instalațiile clădirii", ru: "Moscova 20 · инженерные системы", en: "Moscova 20 · building services" }),
  "m20-entrance": scene("/assets/leasing/moscova-20/m20-entrance-processed.webp", "/assets/leasing/moscova-20/m20-entrance-processed-sm.webp", 820, 1600, 900,
    { ro: "Intrarea Moscova 20: vitrina, ușa de sticlă, scările și rampa de acces", ru: "Вход Moscova 20: витрина, стеклянная дверь, лестница и пандус", en: "The Moscova 20 entrance: the shop window, the glass door, the steps and the access ramp" },
    { ro: "Moscova 20 · spațiu comercial", ru: "Moscova 20 · коммерческое помещение", en: "Moscova 20 · commercial space" }, "18% 62%"),
  "m20-ground-hall": scene("/assets/leasing/moscova-20/m20-int-ground-hall.webp", "/assets/leasing/moscova-20/m20-int-ground-hall-sm.webp", 820, 1536, 1024,
    { ro: "Parterul Moscova 20: sala deschisă, climatizare și trasee de ventilație", ru: "1-й этаж Moscova 20: открытый зал, кондиционер и воздуховоды", en: "Moscova 20 ground floor: the open hall, air-conditioning and ducts" },
    { ro: "Moscova 20 · parter", ru: "Moscova 20 · 1-й этаж", en: "Moscova 20 · ground floor" }),
  "moscova-9": scene("/assets/portfolio/moscova-9.webp", "/assets/portfolio/moscova-9-card.webp", 1125, 1439, 959,
    { ro: "Moscova 9 — clădire MEGAPARC în Chișinău", ru: "Moscova 9 — здание MEGAPARC в Кишинэу", en: "Moscova 9 — a MEGAPARC building in Chișinău" },
    { ro: "Moscova 9 · imobil în exploatare · Chișinău", ru: "Moscova 9 · действующий объект · Кишинэу", en: "Moscova 9 · operating property · Chișinău" }),
  "m20-glazing": scene("/assets/leasing/moscova-20/m20-int-ground-glazing.webp", "/assets/leasing/moscova-20/m20-int-ground-glazing-sm.webp", 820, 1536, 1024,
    { ro: "Parterul Moscova 20: vitrina spre bulevard și golul scării cu balustradă", ru: "1-й этаж Moscova 20: витрина к бульвару и проём лестницы с ограждением", en: "Moscova 20 ground floor: the glazing to the boulevard and the stair opening with its railing" },
    { ro: "Moscova 20 · parter", ru: "Moscova 20 · 1-й этаж", en: "Moscova 20 · ground floor" }),
  "m20-stair": scene("/assets/leasing/moscova-20/m20-int-stair-detail.webp", "/assets/leasing/moscova-20/m20-int-stair-detail-sm.webp", 820, 1536, 1024,
    { ro: "Scara dintre nivelurile spațiului comercial Moscova 20", ru: "Лестница между уровнями коммерческого помещения Moscova 20", en: "The staircase between the levels of the Moscova 20 commercial premises" },
    { ro: "Moscova 20 · scara dintre niveluri", ru: "Moscova 20 · лестница между уровнями", en: "Moscova 20 · staircase between levels" }),
} satisfies Record<string, CareerScene>;
export type CareerSceneKey = keyof typeof careerScenes;
export const careerSceneKeys = Object.keys(careerScenes) as CareerSceneKey[];

/** The direction's photograph when a vacancy names none. */
const categoryScene: Record<VacancyCategory, CareerSceneKey> = {
  management: "dacia-31", construction: "vatra-overview", commercial: "m20-entrance", legal: "m20-stair", operations: "m20-ground-hall",
};
export const sceneOf = (vacancy: Vacancy): CareerScene => careerScenes[vacancy.scene && vacancy.scene in careerScenes ? vacancy.scene : categoryScene[vacancy.category]];
/** The short title of a list card and the theme of a role — with their fallbacks. */
export const shortTitleOf = (vacancy: Vacancy, locale: SiteLocale) => vacancy.i18n[locale].shortTitle || vacancy.i18n[locale].title;
export const themeOf = (vacancy: Vacancy, locale: SiteLocale) => vacancy.i18n[locale].theme || categoryLabel[vacancy.category][locale];

/* ------------------------------------------------------------------ */
/* Conditions — labels and the pay line                                 */
/* ------------------------------------------------------------------ */

export const employmentLabel: Record<NonNullable<Vacancy["employment"]>, Localized> = {
  "full-time": { ro: "Normă întreagă", ru: "Полная занятость", en: "Full-time" },
  "part-time": { ro: "Normă parțială", ru: "Частичная занятость", en: "Part-time" },
};

export const workModeLabel: Record<NonNullable<Vacancy["workMode"]>, Localized> = {
  "on-site": { ro: "La sediu, fără regim remote", ru: `Очный формат, без${NB}удалённой работы`, en: "On-site, no remote work" },
  hybrid: { ro: "Regim hibrid", ru: "Гибридный формат", en: "Hybrid" },
  remote: { ro: "Remote", ru: "Удалённо", en: "Remote" },
};

const amount = (value: number, locale: SiteLocale) => {
  const grouped = String(Math.round(value)).replace(/\B(?=(\d{3})+(?!\d))/g, locale === "en" ? "," : NB);
  return grouped;
};

const payWords = {
  from: { ro: "de la", ru: "от", en: "from" },
  net: { ro: "net", ru: "нетто", en: "net" },
  gross: { ro: "brut", ru: "брутто", en: "gross" },
  month: { ro: "pe lună", ru: `в${NB}месяц`, en: "per month" },
  probation: { ro: "pe perioada de probă", ru: `на${NB}испытательный срок`, en: "during the probation period" },
  individual: { ro: "Se stabilește individual", ru: "Обсуждается индивидуально", en: "Agreed individually" },
} satisfies Record<string, Localized>;

/**
 * The pay of a vacancy as the site prints it — the figure and its qualifiers kept apart so that «from», NET / GROSS, the period and
 * the probation period can never be dropped or merged: { figure: «30 000 MDL», prefix: «от», terms: [«нетто», «в месяц»],
 * probation: «на испытательный срок» }. `null` when the pay is not shown.
 */
export function payOf(vacancy: Vacancy, locale: SiteLocale): { figure: string | null; prefix: string | null; terms: string[]; probation: string | null; note: string | null; line: string } | null {
  const pay = vacancy.pay;
  if (!pay.visible) return null;
  const note = vacancy.payNote?.[locale] ?? null;
  if (pay.type === "individual") return { figure: null, prefix: null, terms: [], probation: null, note, line: note ?? payWords.individual[locale] };
  const money = (value: number) => (locale === "en" ? `${pay.currency}${NB}${amount(value, locale)}` : `${amount(value, locale)}${NB}${pay.currency}`);
  const figure = pay.type === "range" && pay.min !== null && pay.max !== null
    ? locale === "en" ? `${pay.currency}${NB}${amount(pay.min, locale)}–${amount(pay.max, locale)}` : `${amount(pay.min, locale)}–${amount(pay.max, locale)}${NB}${pay.currency}`
    : pay.amount !== null ? money(pay.amount) : null;
  if (!figure) return null;
  const prefix = pay.type === "from" ? payWords.from[locale] : null;
  const terms = [pay.basis ? payWords[pay.basis][locale] : null, pay.period === "month" ? payWords.month[locale] : null].filter(Boolean) as string[];
  const probation = pay.probation ? payWords.probation[locale] : null;
  const line = [[prefix, figure, ...terms].filter(Boolean).join(" "), probation].filter(Boolean).join(", ");
  return { figure, prefix, terms, probation, note, line };
}

/* ------------------------------------------------------------------ */
/* Application — the candidate's own mail, prepared                      */
/* ------------------------------------------------------------------ */

/** The subject HR asked for in the announcement; where the source names none, the Romanian title of the vacancy. */
// a mail subject is plain text: the no-break characters of the typeset title are turned back into ordinary ones
const untypeset = (text: string) => text.split(NB).join(" ").split(NBH).join("-");
export const applySubject = (vacancy: Vacancy) => vacancy.applySubject ?? untypeset(vacancy.i18n.ro.title);

const greeting: Record<SiteLocale, (title: string) => string> = {
  ro: (title) => `Bună ziua,\n\nTransmit CV-ul pentru postul „${title}”.\n\n`,
  ru: (title) => `Здравствуйте!\n\nНаправляю резюме на вакансию «${title}».\n\n`,
  en: (title) => `Hello,\n\nPlease find my CV for the position “${title}”.\n\n`,
};

/** mailto: with the subject of the vacancy and a two-line opening — nothing is sent by the site. */
export function applyHref(vacancy: Vacancy, locale: SiteLocale) {
  const title = untypeset(vacancy.i18n[locale].title);
  return `mailto:${vacancy.hrEmail}?subject=${encodeURIComponent(applySubject(vacancy))}&body=${encodeURIComponent(greeting[locale](title))}`;
}

/** «9 открытых вакансий» — the count with its noun in each language (RU needs three forms). */
export function vacancyCount(n: number, locale: SiteLocale) {
  if (locale === "ru") {
    const m10 = n % 10;
    const m100 = n % 100;
    const form = m10 === 1 && m100 !== 11 ? "открытая вакансия" : m10 >= 2 && m10 <= 4 && (m100 < 10 || m100 >= 20) ? "открытые вакансии" : "открытых вакансий";
    return `${n}${NB}${form}`;
  }
  if (locale === "ro") return n === 1 ? "1 post vacant" : n < 20 ? `${n} posturi vacante` : `${n} de posturi vacante`;
  return n === 1 ? "1 open position" : `${n} open positions`;
}
