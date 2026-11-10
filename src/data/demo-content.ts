import type { Localized } from "@/lib/site-data";

/**
 * DEMO / PLACEHOLDER CONTENT REGISTRY — full-experience prototype (2026-10-07),
 * corrected for the OWNER business model of 2026-10-08 (acquire · develop ·
 * lease own real estate; no third-party asset management, no team section).
 *
 * OWNER brief "MEGAPARC — FULL EXPERIENCE PROTOTYPE · VISUAL FINAL WITH DEMO /
 * PLACEHOLDER DATA" + addendum "AI / FICTIONAL CONCEPT PHOTOGRAPHY".
 *
 * ABSOLUTE DATA SAFETY RULE: invented data is never silently converted into a
 * MEGAPARC fact. Every value the prototype shows that is not an approved fact
 * lives here, once, with
 *   key · group · page · field · value (RO / RU / EN) · status · futureSource
 * Status:
 *   CONFIRMED   — approved fact; mirrors src/lib/assets.ts / strategy.ts (listed so
 *                 each page's register shows what is real next to what is not)
 *   PROVISIONAL — used on the site before, not yet signed off by the OWNER
 *   DEMO        — invented for the approval preview; must be replaced before production
 *
 * Images: every concept photograph (`cv-*`, scripts/brand-imagery.mjs) is
 * status DEMO · type CONCEPT_VISUAL · futureReplacement REAL_MEGAPARC_PHOTO, and
 * every placement is listed in `imageUses`. A placement with scope
 * PROPERTY_DIRECTION stands in for a photograph of a named MEGAPARC property and
 * always shows the label PHOTO DIRECTION · CONCEPT; it may never reach production.
 *
 * docs/DEMO_DATA_REGISTER.md and docs/DEMO_IMAGE_REGISTER.md are generated from
 * this file (`npm run demo:register`); `npm run gate:production` fails while any
 * DEMO value or concept visual remains. This file has no runtime imports so the
 * generator can load it with Node's type stripping. Leasing inventory records
 * live in src/data/leasing-inventory.ts and join the register from there.
 */

export type DataStatus = "CONFIRMED" | "PROVISIONAL" | "DEMO";
export type DemoGroup = "COMPANY" | "PROJECTS" | "DEVELOPMENT" | "LEASING" | "ACQUISITIONS" | "CAREERS" | "CONTACT";

export type DataPoint = {
  key: string;
  group: DemoGroup;
  page: string;
  field: string;
  value: Localized;
  status: DataStatus;
  futureSource: string;
};

const points: DataPoint[] = [];

/**
 * Site edition — read directly: this module also loads in Node for `npm run gate:production`.
 * release/2026-11-09-production-v1 builds the PRODUCTION edition unless NEXT_PUBLIC_SITE_EDITION=preview.
 */
export const productionEdition = (process.env.NEXT_PUBLIC_SITE_EDITION ?? "production") === "production";

/**
 * Production edition (OWNER "PRODUCTION V1": confirmed content only): a DEMO value is not part of the production
 * dataset — it is never registered and carries no real text. Should a component still print one, this sentinel
 * appears in the export and `scripts/qa-production.mjs` fails the build.
 */
export const DEMO_OMITTED = "__DEMO_OMITTED__";

function point(status: DataStatus, key: string, group: DemoGroup, page: string, field: string, value: Localized | string, futureSource: string): DataPoint {
  if (status === "DEMO" && productionEdition) return { key, group, page, field, value: { ro: DEMO_OMITTED, ru: DEMO_OMITTED, en: DEMO_OMITTED }, status, futureSource };
  const entry: DataPoint = { key, group, page, field, value: typeof value === "string" ? { ro: value, ru: value, en: value } : value, status, futureSource };
  points.push(entry);
  return entry;
}

/** A DataPoint that may be published in this edition (production: everything but DEMO). */
export const shown = (entry: DataPoint | null | undefined): entry is DataPoint => !!entry && !(productionEdition && entry.status === "DEMO");
const demo = (key: string, group: DemoGroup, page: string, field: string, value: Localized | string, futureSource: string) => point("DEMO", key, group, page, field, value, futureSource);
const confirmed = (key: string, group: DemoGroup, page: string, field: string, value: Localized | string, futureSource = "Confirmed — src/lib/assets.ts") => point("CONFIRMED", key, group, page, field, value, futureSource);
const provisional = (key: string, group: DemoGroup, page: string, field: string, value: Localized | string, futureSource: string) => point("PROVISIONAL", key, group, page, field, value, futureSource);

/* ------------------------------------------------------------------ */
/* COMPANY · CONTACT                                                    */
/* ------------------------------------------------------------------ */

/** Clickable forms of the public contacts. */
export const contactLinks = { email: "mailto:receptie@imc.md", mobile: "tel:+37378803010", landline: "tel:+37322882035" } as const;

export const company = {
  legalName: provisional("company.legalName", "COMPANY", "Contact · Footer", "Legal entity", "MEGAPARC SRL", "OWNER — legal entity name and IDNO"),
  city: confirmed("company.city", "COMPANY", "Contact", "Office city", { ro: "Chișinău, Republica Moldova", ru: "Кишинёв, Республика Молдова", en: "Chișinău, Republic of Moldova" }, "Confirmed — src/lib/site-data.ts"),
  hours: demo("company.hours", "CONTACT", "Contact", "Office hours", { ro: "Luni – vineri · 9:00 – 18:00", ru: "Пн – пт · 9:00 – 18:00", en: "Mon – Fri · 9:00 – 18:00" }, "OWNER — office hours"),
  /** OWNER-confirmed public contacts (2026-10-09): one general mailbox until department mailboxes are supplied. */
  email: confirmed("contact.email", "CONTACT", "Contact · Footer · Forms", "Public e-mail", "receptie@imc.md", "OWNER 2026-10-09 — general public contact"),
  mobile: confirmed("contact.phone.mobile", "CONTACT", "Contact · Footer", "Mobile telephone", "+373 78 803 010", "OWNER 2026-10-09"),
  landline: confirmed("contact.phone.landline", "CONTACT", "Contact · Footer", "Landline", "+373 22 882 035", "OWNER 2026-10-09"),
  responseTime: demo("contact.response", "CONTACT", "Contact", "First reply", { ro: "Răspuns în 2 zile lucrătoare", ru: "Ответ в течение 2 рабочих дней", en: "Reply within 2 working days" }, "OWNER — service standard"),
};

/* ------------------------------------------------------------------ */
/* OWNER-CONFIRMED ASSET DATA (2026-10-09)                               */
/* ------------------------------------------------------------------ */

const NB = "\u00a0";
const group = (n: number, sep: string) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, sep);
/** m² in the three editions: 5.541 m² · 5 541 м² · 5,541 m². */
export const m2 = (n: number): Localized => ({ ro: `${group(n, ".")} m²`, ru: `${group(n, NB)}${NB}м²`, en: `${group(n, ",")} m²` });
const pct = (v: number): Localized => { const t = (Math.round(v * 10) / 10).toFixed(1).replace(/\.0$/, ""); return { ro: `${t.replace(".", ",")} %`, ru: `${t.replace(".", ",")}${NB}%`, en: `${t}%` }; };
/** Hectares with the square metres in brackets: 0,847 га · 8 470 м². */
const ha = (m: number): Localized => { const r = m / 10000; const v = Number.isInteger(r) ? r.toFixed(1) : String(r); const loc = { ro: v.replace(".", ","), ru: v.replace(".", ","), en: v }; return { ro: `${loc.ro} ha · ${m2(m).ro}`, ru: `${loc.ru}${NB}га · ${m2(m).ru}`, en: `${loc.en} ha · ${m2(m).en}` }; };

export type OperatingSlug = "dacia-31" | "moscova-9" | "moscova-20" | "creanga-78";

/**
 * OWNER-confirmed occupancy record (2026-10-09). Separate concepts, never
 * interchangeable: total property area · occupied area · occupancy (derived) ·
 * physical vacancy (derived). Physical vacancy is NOT marketed availability —
 * the public offer (area, date, status) lives in the leasing inventory
 * (src/data/leasing-inventory.ts → public_available_area / date / status).
 */
export const assetOccupancy: Record<OperatingSlug, { total: number; occupied: number }> = {
  "dacia-31": { total: 5541, occupied: 551 },
  "moscova-9": { total: 2536, occupied: 2536 },
  "moscova-20": { total: 704, occupied: 78 },
  "creanga-78": { total: 2158, occupied: 2158 },
};
export const occupancyOf = (slug: OperatingSlug) => {
  const { total, occupied } = assetOccupancy[slug];
  return { total, occupied, vacancy: total - occupied, percent: (occupied / total) * 100, fullyLet: occupied >= total };
};
/** Sum of the four total property areas — NOT a GLA (no uniform methodology confirmed yet). */
export const operatingArea = Object.values(assetOccupancy).reduce((sum, a) => sum + a.total, 0);

const occupancyPoints = (slug: OperatingSlug) => {
  const o = occupancyOf(slug);
  const src = "OWNER 2026-10-09";
  return {
    area: confirmed(`asset.${slug}.area`, "PROJECTS", P(slug), "Total property area", m2(o.total), src),
    occupied: confirmed(`asset.${slug}.occupied`, "PROJECTS", P(slug), "Occupied area", m2(o.occupied), o.fullyLet ? `${src} — 100 % occupied` : src),
    occupancy: confirmed(`asset.${slug}.occupancy`, "PROJECTS", P(slug), "Occupancy (derived)", pct(o.percent), `${src} — derived`),
    vacancy: confirmed(`asset.${slug}.vacancy`, "PROJECTS", P(slug), "Physical vacancy (derived; not marketed availability)", m2(o.vacancy), `${src} — derived`),
  };
};

export type LandRecord = { slug: string; name: Localized; area: number | null; published: boolean; project?: string; point: DataPoint };
/** Land plots (OWNER 2026-10-09; R3.3 §5 2026-11-10: Hîncești and Chișinău are listed publicly by name — their areas are OWNER inputs, never totalled). No project concepts are invented. */
export const landRecords: LandRecord[] = [
  { slug: "drochia-gateway", name: { ro: "Drochia Gateway", ru: "Drochia Gateway", en: "Drochia Gateway" }, area: 20000, published: true, project: "drochia-gateway", point: confirmed("land.drochia.area", "DEVELOPMENT", "Land · Drochia Gateway", "Land area", ha(20000), "Confirmed — same parcel as dev.drochia.site") },
  { slug: "florilor-32-2", name: { ro: "Florilor 32/2", ru: "Florilor 32/2", en: "Florilor 32/2" }, area: 8470, published: true, point: confirmed("land.florilor-32-2.area", "DEVELOPMENT", "Land · Florilor 32/2", "Land area", ha(8470), "OWNER 2026-10-09") },
  { slug: "orhei", name: { ro: "Orhei", ru: "Орхей", en: "Orhei" }, area: 22000, published: true, point: confirmed("land.orhei.area", "DEVELOPMENT", "Land · Orhei", "Land area", ha(22000), "OWNER 2026-10-09") },
  { slug: "hincesti", name: { ro: "Hîncești", ru: "Хынчешты", en: "Hîncești" }, area: null, published: true, point: confirmed("land.hincesti.exists", "DEVELOPMENT", "Land · Hîncești", "Land plot listed by name — area pending", "—", "OWNER 2026-10-09 (exists) · R3.3 §5 (listed) — area to be supplied") },
  { slug: "chisinau", name: { ro: "Chișinău", ru: "Кишинёв", en: "Chișinău" }, area: null, published: true, point: confirmed("land.chisinau.exists", "DEVELOPMENT", "Land · Chișinău", "Land plot listed by name — area pending", "—", "OWNER R3.3 §5 (2026-11-10) — address and area to be supplied") },
];
export const publicLand = landRecords.filter((plot) => plot.published && plot.area);
export const landTotal = publicLand.reduce((sum, plot) => sum + (plot.area ?? 0), 0);
/** Headline figure rounded to two decimals (5,05 га); the exact total is landTotalExact (5,047 га · 50 470 м²). */
/** «+» while a listed plot has no confirmed area yet (Hîncești, Chișinău — R3.3): the total is a minimum, never a guess. */
export const landTotalPending = landRecords.some((plot) => plot.published && !plot.area);
export const landTotalLabel: Localized = (() => { const t = (Math.round((landTotal / 10000) * 100) / 100).toFixed(2); const plus = landTotalPending ? "+" : ""; return { ro: `${t.replace(".", ",")}${plus} ha`, ru: `${t.replace(".", ",")}${plus}${NB}га`, en: `${t}${plus} ha` }; })();
export const landTotalExact: Localized = ha(landTotal);

/** Dacia 31 · Development — a separate record from the operating Dacia 31 building (OWNER 2026-10-09). No timeline, CAPEX, use mix, permits or completion date until supplied. */
export const daciaDevelopment = {
  buildings: confirmed("dev.dacia-31.buildings", "DEVELOPMENT", "Development · Dacia 31", "Buildings", "3", "OWNER 2026-10-09"),
  each: confirmed("dev.dacia-31.each", "DEVELOPMENT", "Development · Dacia 31", "Planned area per building", { ro: "≈ 1.600 m²", ru: `≈ 1${NB}600${NB}м²`, en: "≈ 1,600 m²" }, "OWNER 2026-10-09 — approximately / planned"),
  total: confirmed("dev.dacia-31.total", "DEVELOPMENT", "Development · Dacia 31", "Planned total area", { ro: "≈ 4.800 m²", ru: `≈ 4${NB}800${NB}м²`, en: "≈ 4,800 m²" }, "OWNER 2026-10-09 — derived 3 × 1 600 m²"),
};

/* ------------------------------------------------------------------ */
/* PORTFOLIO — headline figures                                         */
/* ------------------------------------------------------------------ */

/**
 * Headline figures (OWNER 2026-10-09). "area" is the sum of the four total
 * property areas — published as «площадь действующих объектов», never as GLA.
 * "land" totals the published land plots only (Hîncești excluded until its
 * area is supplied). The earlier DEMO GLA, tenant count and occupancy rows are
 * retired.
 */
export const portfolioFigures = {
  operating: confirmed("portfolio.operating", "PROJECTS", "Home · Portfolio", "Operating properties", "04", "Confirmed — count of src/lib/assets.ts"),
  area: confirmed("portfolio.area", "PROJECTS", "Home · Partnership · History", "Operating property area (not GLA)", m2(operatingArea), "OWNER 2026-10-09 — sum of total property areas"),
  land: confirmed("portfolio.land", "PROJECTS", "Home · Projects", "Land plots", landTotalLabel, "OWNER 2026-10-09 — Drochia 2.0 ha + Florilor 32/2 0.847 ha + Orhei 2.2 ha"),
};

/* ------------------------------------------------------------------ */
/* PORTFOLIO — property profiles                                        */
/* ------------------------------------------------------------------ */

export type AssetCategory = "office" | "retail" | "mixed";

export type AssetProfile = {
  category: AssetCategory;
  format: DataPoint;
  /** total_property_area (OWNER 2026-10-09). */
  area: DataPoint;
  /** occupied_area. */
  occupied: DataPoint;
  /** occupancy_percent (derived). */
  occupancy: DataPoint;
  /** physical_vacancy_area (derived) — not marketed availability. */
  vacancy: DataPoint;
  land: DataPoint;
  parking: DataPoint;
  /** DEMO tenant counts are internal only; Creangă 78 has none (no count invented). */
  tenants?: DataPoint;
  acquired: DataPoint;
  repositioned: DataPoint;
  /** Public offer summary — absent when no offer is confirmed (Dacia 31, OWNER 2026-10-09). */
  availability?: DataPoint;
  /** Forward-looking value-creation levers (analysis, not a record of past works). */
  levers: { title: DataPoint; text: Localized }[];
};

const P = (slug: string) => `Projects · ${slug}`;

function lever(key: string, slug: string, title: Localized, text: Localized) {
  return { title: demo(`asset.${slug}.lever.${key}`, "PROJECTS", P(slug), "Value-creation lever", title, "OWNER — asset business plan"), text };
}

export const assetProfiles: Record<"dacia-31" | "moscova-9" | "moscova-20" | "creanga-78", AssetProfile> = {
  "dacia-31": {
    category: "office",
    format: confirmed("asset.dacia-31.format", "PROJECTS", P("dacia-31"), "Format", { ro: "Clădire de birouri independentă", ru: "Отдельное офисное здание", en: "Stand-alone office building" }),
    ...occupancyPoints("dacia-31"),
    land: demo("asset.dacia-31.land", "PROJECTS", P("dacia-31"), "Land plot", { ro: "0,42 ha", ru: "0,42 га", en: "0.42 ha" }, "OWNER — cadastre extract"),
    parking: demo("asset.dacia-31.parking", "PROJECTS", P("dacia-31"), "Parking", { ro: "60 locuri", ru: "60 мест", en: "60 spaces" }, "OWNER — site plan"),
    tenants: demo("asset.dacia-31.tenants", "PROJECTS", P("dacia-31"), "Tenants", { ro: "1 · un singur utilizator", ru: "1 · единый пользователь", en: "1 · single occupier" }, "OWNER — current lease schedule"),
    acquired: demo("asset.dacia-31.acquired", "PROJECTS", P("dacia-31"), "Acquired", "2007", "OWNER — acquisition date"),
    repositioned: demo("asset.dacia-31.repositioned", "PROJECTS", P("dacia-31"), "Repositioned", "2021", "OWNER — last major works"),
    levers: [
      lever("single-occupier", "dacia-31", { ro: "Un sediu pentru o singură companie", ru: "Штаб-квартира для одной компании", en: "A headquarters for one company" }, { ro: "Pregătim clădirea pentru următorul utilizator unic din 2027: acces propriu, nume pe fațadă, etaje organizate pe funcții.", ru: "Готовим здание к следующему единому пользователю с 2027 года: собственный вход, название на фасаде, этажи под функции компании.", en: "Preparing the building for its next single occupier from 2027: own entrance, name on the facade, floors arranged by function." }),
      lever("services", "dacia-31", { ro: "Audit tehnic și modernizarea instalațiilor", ru: "Технический аудит и обновление инженерии", en: "Technical audit and services upgrade" }, { ro: "Capacitățile reale și redundanța se confirmă prin audit, apoi se adaptează la cerințele utilizatorului.", ru: "Реальные мощности и резервирование подтверждаются аудитом и адаптируются под требования пользователя.", en: "Actual capacities and redundancy are confirmed by audit and then adapted to the occupier's requirements." }),
      lever("efficiency", "dacia-31", { ro: "Costuri de exploatare mai mici", ru: "Ниже расходы на эксплуатацию", en: "Lower operating costs" }, { ro: "Iluminat, ventilație și dispecerizare — măsuri care reduc consumul fără a schimba clădirea.", ru: "Освещение, вентиляция и диспетчеризация — меры, которые снижают потребление без перестройки здания.", en: "Lighting, ventilation and building controls — measures that cut consumption without rebuilding." }),
    ],
  },
  "moscova-9": {
    category: "retail",
    format: confirmed("asset.moscova-9.format", "PROJECTS", P("moscova-9"), "Format", { ro: "Obiect comercial independent", ru: "Отдельно стоящий торговый объект", en: "Stand-alone retail building" }),
    ...occupancyPoints("moscova-9"),
    land: demo("asset.moscova-9.land", "PROJECTS", P("moscova-9"), "Land plot", { ro: "0,31 ha", ru: "0,31 га", en: "0.31 ha" }, "OWNER — cadastre extract"),
    parking: demo("asset.moscova-9.parking", "PROJECTS", P("moscova-9"), "Parking", { ro: "25 de locuri de-a lungul bulevardului", ru: "25 мест вдоль бульвара", en: "25 spaces along the boulevard" }, "OWNER — site plan (parking along the boulevard is confirmed, the count is not)"),
    tenants: demo("asset.moscova-9.tenants", "PROJECTS", P("moscova-9"), "Tenants", { ro: "1 chiriaș", ru: "1 арендатор", en: "1 tenant" }, "OWNER — current lease schedule"),
    acquired: demo("asset.moscova-9.acquired", "PROJECTS", P("moscova-9"), "Acquired", "2006", "OWNER — acquisition date"),
    repositioned: demo("asset.moscova-9.repositioned", "PROJECTS", P("moscova-9"), "Repositioned", "2019", "OWNER — last major works"),
    availability: confirmed("asset.moscova-9.availability", "LEASING", P("moscova-9"), "Availability", { ro: "Fără spații libere · ocupat 100 %", ru: `Свободных помещений нет · занят на 100 %`, en: "No space available · 100% occupied" }, "OWNER 2026-10-09"),
    levers: [
      lever("frontage", "moscova-9", { ro: "Fațada ca vitrină a brandului", ru: "Фасад как витрина бренда", en: "The facade as a brand window" }, { ro: "Fațada lungă de pe prima linie poate purta identitatea completă a unui brand — firmă, vitrine, iluminat.", ru: "Протяжённый фасад первой линии может нести полную идентичность бренда — вывеска, витрины, подсветка.", en: "The long first-line frontage can carry a brand's full identity — signage, windows, lighting." }),
      lever("split", "moscova-9", { ro: "Integral sau în două blocuri", ru: "Целиком или двумя блоками", en: "Whole or as two units" }, { ro: "Două intrări pentru clienți permit închirierea către un singur brand sau împărțirea în două spații independente.", ru: "Два входа для покупателей позволяют сдать объект одному бренду или разделить его на два независимых помещения.", en: "Two customer entrances allow one brand to take the whole or the space to be split into two independent units." }),
      lever("logistics", "moscova-9", { ro: "Logistică separată de clienți", ru: "Логистика отдельно от покупателей", en: "Logistics apart from customers" }, { ro: "Rampa și spațiile auxiliare păstrează fluxul de marfă în spatele clădirii.", ru: "Рампа и вспомогательные помещения держат товарный поток за зданием.", en: "The ramp and support rooms keep the goods flow behind the building." }),
    ],
  },
  "moscova-20": {
    category: "retail",
    format: confirmed("asset.moscova-20.format", "PROJECTS", P("moscova-20"), "Format", { ro: "Spațiu comercial pe prima linie", ru: "Торговое помещение первой линии", en: "First-line retail space" }),
    ...occupancyPoints("moscova-20"),
    land: demo("asset.moscova-20.land", "PROJECTS", P("moscova-20"), "Land plot", { ro: "Spațiu în clădire", ru: "Помещение в здании", en: "Premises within a building" }, "OWNER — title / cadastre"),
    parking: demo("asset.moscova-20.parking", "PROJECTS", P("moscova-20"), "Parking", { ro: "12 locuri dedicate", ru: "12 выделенных мест", en: "12 dedicated spaces" }, "OWNER — site plan (dedicated parking is confirmed, the count is not)"),
    tenants: demo("asset.moscova-20.tenants", "PROJECTS", P("moscova-20"), "Tenants", { ro: "1 chiriaș", ru: "1 арендатор", en: "1 tenant" }, "OWNER — current lease schedule"),
    acquired: demo("asset.moscova-20.acquired", "PROJECTS", P("moscova-20"), "Acquired", "2011", "OWNER — acquisition date"),
    repositioned: demo("asset.moscova-20.repositioned", "PROJECTS", P("moscova-20"), "Repositioned", "2023", "OWNER — last major works"),
    // availability: not stored here — derived from the unit record M20-01 (OWNER 2026-11-06, one source of truth)
    levers: [
      lever("corner", "moscova-20", { ro: "Colțul ca punct de reper", ru: "Угол как ориентир района", en: "The corner as a landmark" }, { ro: "Vitrina continuă pe două străzi transformă spațiul într-un reper zilnic al cartierului.", ru: "Сплошная витрина на две улицы делает помещение ежедневным ориентиром района.", en: "A continuous window on two streets makes the space a daily landmark for the neighbourhood." }),
      lever("terrace", "moscova-20", { ro: "Terasa activează strada", ru: "Терраса оживляет улицу", en: "The terrace activates the street" }, { ro: "Pentru cafenea, servicii sau retail alimentar terasa prelungește spațiul în exterior.", ru: "Для кафе, сервисов или продуктового ритейла терраса продолжает помещение на улицу.", en: "For a café, services or food retail the terrace extends the space outdoors." }),
      lever("fitout", "moscova-20", { ro: "Gata pentru amenajarea brandului", ru: "Готово к оформлению под бренд", en: "Ready for brand fit-out" }, { ro: "Trasee existente de ventilație și utilități scurtează amenajarea noului chiriaș.", ru: "Существующие трассы вентиляции и инженерии сокращают срок отделки для нового арендатора.", en: "Existing ventilation and utility routes shorten the new tenant's fit-out." }),
    ],
  },
  "creanga-78": {
    category: "mixed",
    format: confirmed("asset.creanga-78.format", "PROJECTS", P("creanga-78"), "Format", { ro: "Imobil comercial", ru: "Коммерческий объект", en: "Commercial property" }, "OWNER 2026-10-09 — operating commercial property; detailed format pending"),
    ...occupancyPoints("creanga-78"),
    land: demo("asset.creanga-78.land", "PROJECTS", P("creanga-78"), "Land plot", { ro: "0,28 ha", ru: "0,28 га", en: "0.28 ha" }, "OWNER — cadastre extract"),
    parking: demo("asset.creanga-78.parking", "PROJECTS", P("creanga-78"), "Parking", { ro: "40 de locuri", ru: "40 мест", en: "40 spaces" }, "OWNER — site plan"),
    acquired: demo("asset.creanga-78.acquired", "PROJECTS", P("creanga-78"), "Acquired", "2014", "OWNER — acquisition date"),
    repositioned: demo("asset.creanga-78.repositioned", "PROJECTS", P("creanga-78"), "Repositioned", "2022", "OWNER — last major works"),
    availability: confirmed("asset.creanga-78.availability", "LEASING", P("creanga-78"), "Availability", { ro: "Fără spații libere · ocupat 100 %", ru: `Свободных помещений нет · занят на 100 %`, en: "No space available · 100% occupied" }, "OWNER 2026-10-09"),
    levers: [],
  },
};

/** Creangă 78: OWNER-confirmed area and occupancy (2026-10-09); district and location text stay DEMO; the earlier DEMO multi-tenant office profile is retired. */
export const creangaProfile = {
  district: demo("asset.creanga-78.district", "PROJECTS", P("creanga-78"), "District", { ro: "Buiucani", ru: "Буюкань", en: "Buiucani" }, "OWNER — confirmed address"),
  lead: confirmed("asset.creanga-78.lead", "PROJECTS", P("creanga-78"), "Lead", { ro: "Creangă 78 este un obiect comercial MEGAPARC în funcțiune din Chișinău, cu o suprafață de 2.158 m². Obiectul este ocupat 100 %.", ru: `Creangă 78 — действующий коммерческий объект MEGAPARC в Кишинёве площадью 2 158 м². Объект занят на 100 %.`, en: "Creangă 78 is an operating MEGAPARC commercial property in Chișinău, with a total area of 2,158 m². It is 100% occupied." }, "OWNER 2026-10-09"),
  narrative: confirmed("asset.creanga-78.narrative", "PROJECTS", P("creanga-78"), "Narrative", { ro: "Un obiect în funcțiune, ocupat integral.", ru: "Действующий объект, занятый полностью.", en: "An operating property, fully let." }, "OWNER 2026-10-09"),
  location: demo("asset.creanga-78.location", "PROJECTS", P("creanga-78"), "Location text", { ro: "Un cartier consolidat din Chișinău, cu birouri, instituții, locuințe și transport public în apropiere.", ru: "Сложившийся район Кишинёва: офисы, учреждения, жильё и общественный транспорт рядом.", en: "An established Chișinău district with offices, institutions, housing and public transport nearby." }, "OWNER — confirmed address and access"),
};

/* ------------------------------------------------------------------ */
/* LEASING — tenant fit (space matching, property decision pages)      */
/* ------------------------------------------------------------------ */

export type BusinessType = "retail" | "office" | "showroom" | "services" | "clinic" | "fnb";
export type Requirement = "visibility" | "ground" | "parking" | "entrance" | "power" | "ventilation" | "delivery" | "flexible";
export type FitLevel = "strong" | "possible" | "limited";

export type Capability = { level: FitLevel; note: Localized; status: DataStatus };

export type TenantFit = {
  /** Reason to care — leads the property everywhere (before any number). */
  reason: Localized;
  bestFor: BusinessType[];
  /** Business types that are plausible but not stated in approved copy. */
  bestForStatus: DataStatus;
  why: Localized[];
  /** null when a property's capability profile is retired (Creangă 78, OWNER 2026-10-09). */
  capabilities: Record<Requirement, Capability> | null;
  /** Leasable range in m² used by the matcher (whole building = one value). */
  area: { min: number; max: number; status: DataStatus; note?: Localized };
  /** ISO date the space can be occupied; null = on request / now. */
  from: string | null;
  district: Localized;
};

const fitPoint = (slug: string, field: string, value: Localized | string, status: DataStatus, source: string) => point(status, `fit.${slug}.${field}`, "LEASING", `Projects · ${slug} · Leasing`, field, value, source);

function cap(slug: string, key: Requirement, level: FitLevel, note: Localized, status: DataStatus): Capability {
  fitPoint(slug, `capability.${key}`, { ro: `${level} — ${note.ro}`, ru: `${level} — ${note.ru}`, en: `${level} — ${note.en}` }, status, status === "DEMO" ? "OWNER — technical passport / site survey" : "Confirmed — src/lib/assets.ts");
  return { level, note, status };
}

export const tenantFit: Record<"dacia-31" | "moscova-9" | "moscova-20" | "creanga-78", TenantFit> = {
  "dacia-31": {
    reason: { ro: "Pentru o companie care vrea o clădire proprie — și numele ei pe fațadă.", ru: "Для компании, которой нужно своё здание — и своё имя на фасаде.", en: "For a company that wants a building of its own — with its name on the facade." },
    bestFor: ["office"],
    bestForStatus: "CONFIRMED",
    why: [
      { ro: "Toate departamentele sub un singur acoperiș", ru: "Все подразделения под одной крышей", en: "Every department under one roof" },
      { ro: "Intrare proprie și control unic al accesului", ru: "Собственный вход и единый контроль доступа", en: "Own entrance and single access control" },
      { ro: "Fațadă vizibilă pe arterele Dacia, Traian, Decebal", ru: "Заметный фасад у магистралей Дачия, Траян, Дечебал", en: "A visible facade on the Dacia, Traian and Decebal arteries" },
      { ro: "Suprafețe mari, reorganizabile fără a modifica clădirea", ru: "Крупные площади, которые можно перестраивать без изменения здания", en: "Large floors that can be re-planned without altering the building" },
    ],
    capabilities: {
      visibility: cap("dacia-31", "visibility", "strong", { ro: "Fațadă vizibilă, la intrarea în oraș dinspre aeroport", ru: "Заметный фасад на въезде в город со стороны аэропорта", en: "A visible facade at the city's airport entrance" }, "CONFIRMED"),
      ground: cap("dacia-31", "ground", "strong", { ro: "Clădire întreagă, cu acces de la nivelul solului", ru: "Здание целиком, вход с уровня земли", en: "Whole building with access at street level" }, "CONFIRMED"),
      parking: cap("dacia-31", "parking", "strong", { ro: "Aproximativ 60 de locuri pe teren", ru: "Около 60 мест на участке", en: "About 60 spaces on the plot" }, "DEMO"),
      entrance: cap("dacia-31", "entrance", "strong", { ro: "Intrare proprie, 4+ variante de acces", ru: "Собственный вход · 4+ варианта доступа", en: "Own entrance, 4+ entrance options" }, "CONFIRMED"),
      power: cap("dacia-31", "power", "possible", { ro: "Rețele existente; capacitatea se confirmă prin audit", ru: "Сети есть; мощность подтверждается аудитом", en: "Services in place; capacity confirmed by audit" }, "CONFIRMED"),
      ventilation: cap("dacia-31", "ventilation", "possible", { ro: "Tubulatură existentă; adaptare la utilizator", ru: "Воздуховоды есть; адаптация под пользователя", en: "Ductwork in place; adapted to the occupier" }, "CONFIRMED"),
      delivery: cap("dacia-31", "delivery", "possible", { ro: "Acces auto pe teren pentru livrări", ru: "Подъезд по участку для доставки", en: "Vehicle access on the plot for deliveries" }, "DEMO"),
      flexible: cap("dacia-31", "flexible", "strong", { ro: "Etaje mari, organizare pe niveluri sau pe funcții", ru: "Крупные этажи, размещение по уровням или функциям", en: "Large floors, arranged by level or by function" }, "CONFIRMED"),
    },
    area: { min: 5223, max: 5223, status: "CONFIRMED", note: { ro: "Se închiriază ca întreg", ru: "Сдаётся целиком", en: "Leased as a whole" } },
    from: "2027-01-01",
    district: { ro: "Botanica", ru: "Ботаника", en: "Botanica" },
  },
  "moscova-9": {
    reason: { ro: "Pentru un brand care vrea propria clădire pe bulevard, nu un loc într-un centru comercial.", ru: "Для бренда, которому нужен свой дом на бульваре, а не секция в торговом центре.", en: "For a brand that wants its own building on the boulevard, not a unit in a mall." },
    bestFor: ["retail", "showroom"],
    bestForStatus: "CONFIRMED",
    why: [
      { ro: "Fațadă lungă pe prima linie a bulevardului", ru: "Протяжённый фасад на первой линии бульвара", en: "A long first-line boulevard frontage" },
      { ro: "Două intrări pentru clienți", ru: "Два входа для покупателей", en: "Two customer entrances" },
      { ro: "Rampă și zonă de descărcare separate", ru: "Отдельная рампа и зона разгрузки", en: "Separate ramp and unloading zone" },
      { ro: "Integral sau parțial", ru: "Целиком или частью", en: "Whole or in part" },
    ],
    capabilities: {
      visibility: cap("moscova-9", "visibility", "strong", { ro: "Fațadă lungă, vizibilă de pe prima linie", ru: "Протяжённый фасад, виден с первой линии", en: "Long frontage, visible from the first line" }, "CONFIRMED"),
      ground: cap("moscova-9", "ground", "strong", { ro: "Sală de vânzare de 737 m² la nivelul străzii", ru: "Торговый зал 737 м² на уровне улицы", en: "A 737 m² sales floor at street level" }, "CONFIRMED"),
      parking: cap("moscova-9", "parking", "possible", { ro: "Parcare de-a lungul bulevardului", ru: "Парковка вдоль бульвара", en: "Parking along the boulevard" }, "CONFIRMED"),
      entrance: cap("moscova-9", "entrance", "strong", { ro: "Clădire independentă, două intrări proprii", ru: "Отдельное здание, два собственных входа", en: "Stand-alone building, two own entrances" }, "CONFIRMED"),
      power: cap("moscova-9", "power", "possible", { ro: "Capacitatea se confirmă pentru formatul ales", ru: "Мощность уточняется под формат", en: "Capacity to be confirmed for the chosen format" }, "DEMO"),
      ventilation: cap("moscova-9", "ventilation", "possible", { ro: "Ventilație de retail; adaptare la format", ru: "Торговая вентиляция; адаптация под формат", en: "Retail ventilation; adapted to the format" }, "DEMO"),
      delivery: cap("moscova-9", "delivery", "strong", { ro: "Rampă, 69 m² de descărcare, flux separat", ru: "Рампа, 69 м² разгрузки, отдельный поток", en: "Ramp, 69 m² unloading, separate flow" }, "CONFIRMED"),
      flexible: cap("moscova-9", "flexible", "strong", { ro: "Integral sau o parte convenită", ru: "Целиком или согласованной частью", en: "Whole or an agreed part" }, "CONFIRMED"),
    },
    area: { min: 400, max: 1290, status: "DEMO", note: { ro: "Partea minimă se stabilește la cerere", ru: "Минимальная часть определяется по запросу", en: "Minimum part agreed on request" } },
    from: null,
    district: { ro: "Rîșcani", ru: "Рышкань", en: "Rîșcani" },
  },
  "moscova-20": {
    reason: { ro: "Pentru o afacere care trăiește din fluxul zilnic al cartierului — vitrină de colț, prima linie.", ru: "Для бизнеса, который живёт ежедневным потоком района: угловая витрина, первая линия.", en: "For a business that lives on the neighbourhood's daily flow — a corner window on the first line." },
    bestFor: ["retail", "services", "clinic", "fnb", "showroom"],
    bestForStatus: "DEMO",
    why: [
      { ro: "Colț vizibil, vitrină continuă pe două străzi", ru: "Заметный угол, сплошная витрина на две улицы", en: "A visible corner, a continuous window on two streets" },
      { ro: "Scară interioară între niveluri", ru: "Внутренняя лестница между уровнями", en: "An internal staircase between levels" },
      { ro: "Intrare pentru clienți și acces de serviciu separat", ru: "Вход для покупателей и отдельный служебный доступ", en: "Customer entrance and separate service access" },
      { ro: "Terasă și parcare dedicată", ru: "Терраса и выделенная парковка", en: "A terrace and dedicated parking" },
    ],
    capabilities: {
      visibility: cap("moscova-20", "visibility", "strong", { ro: "Colț, fațadă panoramică, prima linie", ru: "Угол, панорамный фасад, первая линия", en: "Corner, panoramic frontage, first line" }, "CONFIRMED"),
      ground: cap("moscova-20", "ground", "strong", { ro: "Parter 240,96 m² + demisol 293,70 m²", ru: "1‑й этаж 240,96 м² + цоколь 293,70 м²", en: "Ground 240.96 m² + lower ground 293.70 m²" }, "CONFIRMED"),
      parking: cap("moscova-20", "parking", "possible", { ro: "Parcare dedicată în apropiere", ru: "Выделенная парковка рядом", en: "Dedicated parking nearby" }, "CONFIRMED"),
      entrance: cap("moscova-20", "entrance", "strong", { ro: "Intrare de la colț + acces de serviciu cu rampă", ru: "Вход с угла + служебный доступ с рампой", en: "Corner entrance + service access with ramp" }, "CONFIRMED"),
      power: cap("moscova-20", "power", "possible", { ro: "3 faze · 38 kW conform documentelor", ru: "3 фазы · 38 кВт по документам", en: "3 phases · 38 kW documented" }, "CONFIRMED"),
      ventilation: cap("moscova-20", "ventilation", "possible", { ro: "Trasee de ventilație existente", ru: "Существующие трассы вентиляции", en: "Existing ventilation routes" }, "CONFIRMED"),
      delivery: cap("moscova-20", "delivery", "strong", { ro: "Acces de serviciu separat, cu rampă", ru: "Отдельный служебный доступ с рампой", en: "Separate service access with ramp" }, "CONFIRMED"),
      flexible: cap("moscova-20", "flexible", "possible", { ro: "Două niveluri; parterul separat — de confirmat", ru: "Два уровня; первый этаж отдельно — уточняется", en: "Two levels; ground floor alone — to be confirmed" }, "DEMO"),
    },
    area: { min: 241, max: 626, status: "DEMO", note: { ro: "Parterul separat (240,96 m²) — de confirmat", ru: "Первый этаж отдельно (240,96 м²) — уточняется", en: "Ground floor alone (240.96 m²) — to be confirmed" } },
    from: "2026-08-17",
    district: { ro: "Rîșcani", ru: "Рышкань", en: "Rîșcani" },
  },
  "creanga-78": {
    reason: { ro: "Obiect comercial MEGAPARC în funcțiune.", ru: "Действующий коммерческий объект MEGAPARC.", en: "An operating MEGAPARC commercial property." },
    bestFor: [],
    bestForStatus: "CONFIRMED",
    why: [],
    /** Retired with the DEMO multi-tenant profile (OWNER 2026-10-09): no capability claims until the OWNER supplies them. */
    capabilities: null,
    area: { min: 0, max: 0, status: "CONFIRMED", note: { ro: "Ocupat 100 %", ru: "Занят на 100 %", en: "100% occupied" } },
    from: null,
    district: { ro: "Buiucani", ru: "Буюкань", en: "Buiucani" },
  },
};

/** Commercial process shown on every property page and in the leasing journey. */
export const leasingProcess = {
  reply: demo("leasing.reply", "LEASING", "Leasing · Projects · Contact", "Response to a leasing request", { ro: "Răspuns în 2 zile lucrătoare", ru: "Ответ в течение 2 рабочих дней", en: "Reply within 2 working days" }, "OWNER — service standard"),
  viewing: demo("leasing.viewing", "LEASING", "Leasing · Projects", "Viewing", { ro: "Vizionare în aceeași săptămână", ru: "Просмотр — в ту же неделю", en: "Viewing within the same week" }, "OWNER — service standard"),
};

/** Offer a property — the owner's first answer (service standard, DEMO until the OWNER sets it). */
export const acquisitionProcess = {
  reply: demo("acquisitions.reply", "ACQUISITIONS", "Offer a property", "First reply to a property or land offer", { ro: "în 10 zile lucrătoare", ru: "в течение 10 рабочих дней", en: "within 10 working days" }, "OWNER — service standard"),
};

/**
 * WHAT MEGAPARC IS DOING NOW — one line per project card and page (OWNER brief
 * "TRUST & PROOF PASS": every project answers what · where · stage · why ·
 * available · what MEGAPARC is doing). Lines that only restate a confirmed
 * availability or stage are CONFIRMED; the rest are DEMO.
 */
const NOW = (slug: string, value: Localized, status: "CONFIRMED" | "DEMO", source = "OWNER — confirm the current action on the property") =>
  status === "CONFIRMED" ? confirmed(`project.${slug}.now`, "PROJECTS", `Project · ${slug}`, "What MEGAPARC is doing now", value) : demo(`project.${slug}.now`, "PROJECTS", `Project · ${slug}`, "What MEGAPARC is doing now", value, source);

export const projectNow: Record<string, DataPoint> = {
  "moscova-9": NOW("moscova-9", { ro: "Obiectul este ocupat 100 %.", ru: `Объект занят на 100 %.`, en: "The property is 100% occupied." }, "CONFIRMED"),
  "dacia-31": NOW("dacia-31", { ro: "Clădire de birouri în proprietatea MEGAPARC.", ru: "Офисное здание в собственности MEGAPARC.", en: "An office building owned by MEGAPARC." }, "CONFIRMED"),
  "moscova-20": NOW("moscova-20", { ro: "Închiriem spațiul comercial de colț de pe prima linie.", ru: "Сдаём угловое коммерческое пространство на первой линии.", en: "Leasing the first-line corner commercial space." }, "CONFIRMED"),
  "creanga-78": NOW("creanga-78", { ro: "Obiectul este ocupat 100 %.", ru: `Объект занят на 100 %.`, en: "The property is 100% occupied." }, "CONFIRMED"),
  "dacia-31-development": NOW("dacia-31-development", { ro: "Planificăm 3 clădiri de ≈ 1.600 m² fiecare.", ru: `Планируем 3 здания по ≈ 1 600 м².`, en: "Planning 3 buildings of ≈ 1,600 m² each." }, "CONFIRMED"),
  vatra: NOW("vatra", { ro: "Construim: etapa 05 din 06 — realizare.", ru: `Строим: стадия 05 из 06 — реализация.`, en: "Building: stage 05 of 06 — delivery." }, "CONFIRMED"),
  "drochia-gateway": NOW("drochia-gateway", { ro: "Evaluăm conceptul terenului de 2,0 ha.", ru: `Оцениваем концепцию участка 2,0 га.`, en: "Evaluating the concept for the 2.0 ha site." }, "CONFIRMED"),
};

/* ------------------------------------------------------------------ */
/* CASE STUDY + PARTNERSHIP PROCESS (OWNER brief "TRUST & PROOF PASS")   */
/* ------------------------------------------------------------------ */

/**
 * One case study on an existing MEGAPARC asset — Moscova 9. Every stage is a
 * governed point: confirmed facts come from src/lib/assets.ts and the
 * availability record; the decision year, the scope of works, the latest works
 * year and the next option are DEMO until the OWNER confirms them. No financial
 * figures: the case demonstrates discipline, execution and value creation.
 */
export type CaseStage = { key: string; label: Localized; text: DataPoint };
const C = (key: string, field: string, value: Localized, status: "CONFIRMED" | "DEMO", futureSource = "OWNER — confirm the case-study stage") =>
  status === "CONFIRMED" ? confirmed(`case.moscova-9.${key}`, "PROJECTS", "Partnership · case study", field, value) : demo(`case.moscova-9.${key}`, "PROJECTS", "Partnership · case study", field, value, futureSource);

export const caseStudy: { slug: "moscova-9"; stages: CaseStage[] } = {
  slug: "moscova-9",
  stages: [
    {
      key: "start",
      label: { ro: "Punctul de plecare", ru: "Исходная точка", en: "Starting point" },
      text: C("start", "Starting point", {
        ro: "O clădire comercială independentă pe prima linie a bulevardului Moscova, în afara centrelor comerciale: suprafața obiectului 2.536 m², sala principală de 737,07 m², zonă de descărcare cu rampă, două intrări dinspre bulevard.",
        ru: "Отдельно стоящее торговое здание на первой линии бульвара Москова, вне торговых центров: площадь объекта 2 536 м², основной зал 737,07 м², зона разгрузки с рампой, два входа с бульвара.",
        en: "A stand-alone retail building on the first line of Moscova Boulevard, outside the malls: a total property area of 2,536 m², a 737.07 m² main hall, a loading zone with a ramp, two entrances from the boulevard.",
      }, "CONFIRMED"),
    },
    {
      key: "opportunity",
      label: { ro: "Oportunitatea", ru: "Возможность", en: "The opportunity" },
      text: C("opportunity", "Opportunity", {
        ro: "Fațadă și intrare proprii pe un bulevard cu flux constant — un format pe care centrele comerciale nu îl oferă.",
        ru: "Собственный фасад и вход на бульваре с постоянным потоком — формат, которого не дают торговые центры.",
        en: "Its own facade and entrance on a boulevard with a steady flow — a format the malls do not offer.",
      }, "CONFIRMED"),
    },
    {
      key: "decision",
      label: { ro: "Decizia MEGAPARC", ru: "Решение MEGAPARC", en: "MEGAPARC's decision" },
      text: C("decision", "Decision", {
        ro: "Achiziția clădirii în întregime, pentru a răspunde ca proprietar de fațadă, intrări și logistică.",
        ru: "Приобрести здание целиком, чтобы как собственник отвечать за фасад, входы и логистику.",
        en: "Acquire the whole building, so as to be responsible, as owner, for its facade, entrances and logistics.",
      }, "DEMO", "OWNER — acquisition year (asset.moscova-9.acquired)"),
    },
    {
      key: "capex",
      label: { ro: "Investiții", ru: "Инвестиции", en: "Investment" },
      text: C("capex", "Investment / capex", {
        ro: "Renovarea fațadei, a instalațiilor și a zonei de descărcare. Parametrii investiției se prezintă în cadrul discutării unui proiect concret.",
        ru: "Обновление фасада, инженерных систем и зоны разгрузки. Параметры инвестиций раскрываются в рамках обсуждения конкретного проекта.",
        en: "Renewal of the facade, building services and the loading zone. Investment parameters are disclosed when a specific project is discussed.",
      }, "DEMO", "OWNER — scope of works (no figures published)"),
    },
    {
      key: "reposition",
      label: { ro: "Repoziționare", ru: "Репозиционирование", en: "Repositioning" },
      text: C("reposition", "Development / repositioning", {
        ro: "Clădirea a fost adusă la formatul unui magazin independent: sală deschisă, rampă, spații auxiliare.",
        ru: "Здание приведено к формату отдельно стоящего магазина: открытый зал, рампа, вспомогательные помещения.",
        en: "The building was brought to the format of a stand-alone store: an open hall, a ramp, support rooms.",
      }, "DEMO", "OWNER — latest major works (asset.moscova-9.repositioned)"),
    },
    {
      key: "leasing",
      label: { ro: "Închiriere", ru: "Аренда", en: "Leasing" },
      text: C("leasing", "Leasing", {
        ro: "Obiectul este închiriat; fluxul clienților este separat de cel al mărfurilor.",
        ru: "Объект сдан в аренду; поток покупателей отделён от товарного.",
        en: "The property is leased; the customer flow is kept apart from the goods flow.",
      }, "CONFIRMED", "OWNER 2026-10-09 — 100 % occupied"),
    },
    {
      key: "status",
      label: { ro: "Statutul actual", ru: "Текущий статус", en: "Current status" },
      text: C("status", "Current status", {
        ro: "Obiectul este ocupat 100 %.",
        ru: "Объект занят на 100 %.",
        en: "The property is 100% occupied.",
      }, "CONFIRMED", "OWNER 2026-10-09"),
    },
    {
      key: "strategy",
      label: { ro: "Strategia ulterioară", ru: "Дальнейшая стратегия", en: "Further strategy" },
      text: C("strategy", "Further strategy", {
        ro: "Decizia ulterioară se ia în funcție de profilul închirierii, potențialul obiectului și condițiile pieței.",
        ru: "Дальнейшее решение определяется исходя из профиля аренды, потенциала объекта и рыночных условий.",
        en: "The further decision depends on the leasing profile, the property's potential and market conditions.",
      }, "DEMO", "OWNER — strategy for Moscova 9"),
    },
  ],
};

/** How a partnership conversation starts — a process statement, DEMO until the OWNER confirms it. */
/** The case is published only when every stage is (production edition: its DEMO stages are not — the whole case is omitted). */
export const caseStudyPublished = (): boolean => caseStudy.stages.every((stage) => shown(stage.text));

export const partnershipProcess: DataPoint[] = [
  demo("partnership.process.1", "COMPANY", "Partnership", "Process · first contact", { ro: "Câteva rânduri despre interes sau proiect — prin formular sau e-mail.", ru: "Несколько строк об интересе или проекте — через форму или по e‑mail.", en: "A few lines about your interest or the project — through the form or by e-mail." }, "OWNER — confirm the partnership process"),
  demo("partnership.process.2", "COMPANY", "Partnership", "Process · meeting", { ro: "Întâlnire și vizită la obiecte sau la proiect.", ru: "Встреча и осмотр объектов или проекта.", en: "A meeting and a visit to the properties or the project." }, "OWNER — confirm the partnership process"),
  demo("partnership.process.3", "COMPANY", "Partnership", "Process · documents", { ro: "Documentele proiectului — drepturi, planuri, date tehnice, statutul închirierii — după un acord de confidențialitate.", ru: "Документы по проекту — права, планы, технические данные, статус аренды — после соглашения о конфиденциальности.", en: "Project documents — title, plans, technical data, leasing status — after a confidentiality agreement." }, "OWNER — confirm the partnership process"),
  demo("partnership.process.4", "COMPANY", "Partnership", "Process · terms", { ro: "Condițiile — individual, pentru proiectul concret.", ru: "Условия — индивидуально, под конкретный проект.", en: "Terms — individually, for the specific project." }, "OWNER — confirm the partnership process"),
];

/* ------------------------------------------------------------------ */
/* DEVELOPMENT                                                          */
/* ------------------------------------------------------------------ */

export const vatraProfile = {
  stage: confirmed("dev.vatra.stage", "DEVELOPMENT", "Development · VATRA", "Stage", { ro: "05 · Realizare", ru: "05 · Реализация", en: "05 · Delivery" }, "Confirmed — src/lib/assets.ts (stage index 4)"),
  site: demo("dev.vatra.site", "DEVELOPMENT", "Development · VATRA", "Site area", { ro: "4,6 ha", ru: "4,6 га", en: "4.6 ha" }, "OWNER — cadastre / project passport"),
  programme: demo("dev.vatra.programme", "DEVELOPMENT", "Development · VATRA", "Programme", { ro: "Cartier de locuințe joase și spații publice", ru: "Малоэтажный квартал и общественные пространства", en: "Low-rise neighbourhood and public spaces" }, "OWNER — approved programme"),
  gba: demo("dev.vatra.gba", "DEVELOPMENT", "Development · VATRA", "Gross building area", { ro: "≈ 9.800 m²", ru: "≈ 9 800 м²", en: "≈ 9,800 m²" }, "OWNER — approved programme"),
  start: demo("dev.vatra.start", "DEVELOPMENT", "Development · VATRA", "Works started", "2024", "OWNER — project timeline"),
  completion: demo("dev.vatra.completion", "DEVELOPMENT", "Development · VATRA", "Target completion", "2027", "OWNER — project timeline"),
};

export const drochiaProfile = {
  site: confirmed("dev.drochia.site", "DEVELOPMENT", "Development · Drochia Gateway", "Site area", { ro: "2,0 ha · 20.000 m²", ru: "2,0 га · 20 000 м²", en: "2.0 ha · 20,000 m²" }),
  fronts: confirmed("dev.drochia.fronts", "DEVELOPMENT", "Development · Drochia Gateway", "Road fronts", "2"),
  potential: demo("dev.drochia.potential", "DEVELOPMENT", "Development · Drochia Gateway", "Potential built area", { ro: "12.000–18.000 m²", ru: "12 000–18 000 м²", en: "12,000–18,000 m²" }, "OWNER — feasibility study (internal site study indicates 7,000–9,000 m² built scenarios; not published)"),
  status: confirmed("dev.drochia.status", "DEVELOPMENT", "Development · Drochia Gateway", "Status", { ro: "În evaluare", ru: "Идёт оценка", en: "Under evaluation" }),
  decision: demo("dev.drochia.decision", "DEVELOPMENT", "Development · Drochia Gateway", "Concept decision", "2027", "OWNER — project timeline"),
};

/* ------------------------------------------------------------------ */
/* CAREERS — role stories                                               */
/* ------------------------------------------------------------------ */

export const cultureStatement = demo("careers.culture", "CAREERS", "Careers", "Culture statement", { ro: "O echipă mică. Responsabilitate mare. Obiecte reale.", ru: "Небольшая команда. Высокая ответственность. Реальные объекты.", en: "A small team. High responsibility. Real properties." }, "OWNER / HR — approved employer statement");

export type RoleStory = { key: string; title: DataPoint; where: Localized; text: Localized; owns: Localized };

function role(key: string, title: Localized, where: Localized, text: Localized, owns: Localized): RoleStory {
  return { key, title: demo(`careers.role.${key}`, "CAREERS", "Careers", "Role story", title, "OWNER / HR — real role descriptions (no names, no tenure)"), where, text, owns };
}

/** Role stories describe the work, never a person: no names, no tenure, no quotes. */
export const roleStories: RoleStory[] = [
  role("site-engineer", { ro: "Inginer pe șantier", ru: "Инженер на объекте", en: "Site engineer" }, { ro: "Teren", ru: "Объект", en: "Field" }, { ro: "Ziua începe pe șantier: verificarea lucrărilor, a calității și a graficului, apoi decizii împreună cu proiectanții și antreprenorii.", ru: "День начинается на площадке: проверка работ, качества и графика, затем решения вместе с проектировщиками и подрядчиками.", en: "The day starts on site: checking works, quality and schedule, then decisions with designers and contractors." }, { ro: "Calitatea execuției · siguranța · termenele", ru: "Качество исполнения · безопасность · сроки", en: "Build quality · safety · schedule" }),
  role("leasing-manager", { ro: "Manager închiriere și exploatare", ru: "Менеджер по аренде и эксплуатации", en: "Leasing and operations manager" }, { ro: "Birou + obiect", ru: "Офис + объект", en: "Office + property" }, { ro: "Răspunde de clădirile MEGAPARC: spațiile libere, chiriașii, întreținerea și planul fiecărui obiect.", ru: "Отвечает за здания MEGAPARC: свободные помещения, арендаторы, обслуживание и план по каждому объекту.", en: "Looks after MEGAPARC's buildings: vacant space, tenants, maintenance and the plan for each property." }, { ro: "Spațiile libere · chiriașii · planul clădirii", ru: "Свободные площади · арендаторы · план здания", en: "Vacant space · tenants · the building plan" }),
  role("project-manager", { ro: "Manager de proiect", ru: "Менеджер проекта", en: "Project manager" }, { ro: "Birou + teren", ru: "Офис + объект", en: "Office + field" }, { ro: "Conduce un proiect de la concept la predare: buget, autorizații, echipe și comunicarea cu toți participanții.", ru: "Ведёт проект от концепции до сдачи: бюджет, разрешения, команды и связь между всеми участниками.", en: "Leads a project from concept to handover: budget, permits, teams and communication between everyone involved." }, { ro: "Bugetul · graficul · coordonarea", ru: "Бюджет · график · координация", en: "Budget · schedule · coordination" }),
  role("acquisitions", { ro: "Analist achiziții", ru: "Аналитик по приобретениям", en: "Acquisitions analyst" }, { ro: "Birou + vizite", ru: "Офис + выезды", en: "Office + site visits" }, { ro: "Evaluează clădirile și terenurile propuse companiei: locația, starea, piața și ce poate deveni obiectul.", ru: "Оценивает здания и землю, которые предлагают MEGAPARC: локацию, состояние, рынок и то, чем объект может стать.", en: "Assesses the buildings and land offered to the company: location, condition, market and what the property could become." }, { ro: "Vizitele · calculele · recomandarea", ru: "Выезды · расчёты · рекомендация", en: "Site visits · numbers · recommendation" }),
];

/* ------------------------------------------------------------------ */
/* IMAGES — concept visuals and every placement                         */
/* ------------------------------------------------------------------ */

export type ConceptVisual = {
  key: string;
  status: "DEMO";
  type: "CONCEPT_VISUAL";
  futureReplacement: "REAL_MEGAPARC_PHOTO";
  /** Portrait-only visuals have no separate -mobile crop. */
  mobile: boolean;
};

const visualKeys = ["cv-hero-plaza", "cv-hero-2", "cv-manage", "cv-meeting-room", "cv-cafe", "cv-field", "cv-office-light", "cv-salesfloor", "cv-office-building", "cv-inspection", "cv-plans", "cv-frame", "cv-level", "cv-entrance", "cv-loft-cafe", "cv-boutique", "cv-office-tenants", "cv-dev-frame", "cv-model", "cv-crane", "cv-rebar-crew", "cv-site-pair", "cv-scaffold-street", "cv-loft-team", "cv-drawing"] as const;
export type VisualKey = (typeof visualKeys)[number];
const portraitOnly: VisualKey[] = ["cv-cafe"];

export const conceptVisuals: Record<VisualKey, ConceptVisual> = Object.fromEntries(
  visualKeys.map((key) => [key, { key, status: "DEMO", type: "CONCEPT_VISUAL", futureReplacement: "REAL_MEGAPARC_PHOTO", mobile: !portraitOnly.includes(key) }]),
) as Record<VisualKey, ConceptVisual>;

/** BRAND = atmosphere, shown normally. PROPERTY_DIRECTION = stands in for a named property's photograph, always labelled. */
export type ImageScope = "BRAND" | "PROPERTY_DIRECTION";

export type ImageUse = {
  /**
   * ILLUSTRATIVE_APPROVED (OWNER "PRODUCTION V1", 2026-11-09) — explicitly approved by the OWNER, an illustration
   * only, never property evidence, always shown with its visible `disclosure`. Never used for factual data.
   * Without it the placement is DEMO (a concept visual awaiting a real MEGAPARC photograph).
   */
  evidence?: "ILLUSTRATIVE_APPROVED";
  disclosure?: Localized;
  /** One art-directed crop per breakpoint (scripts/hero-art-direction.mjs → <visual>-1920 / 1440 / 1024 / 768 / 390.webp). */
  art?: boolean;
  id: string;
  page: string;
  section: string;
  asset: string | null;
  visual: VisualKey;
  scope: ImageScope;
  purpose: string;
  priority: "HIGH" | "MEDIUM" | "LOW";
  recommendedShot: string;
  alt: Localized;
  position?: string;
};

const uses: ImageUse[] = [];
const approved: ImageUse[] = [];
function place(id: string, page: string, section: string, asset: string | null, visual: VisualKey, scope: ImageScope, purpose: string, priority: ImageUse["priority"], recommendedShot: string, alt: Localized, position?: string) {
  // production edition: a DEMO concept visual is not part of the dataset — the placement renders without it
  if (productionEdition) return;
  uses.push({ id, page, section, asset, visual, scope, purpose, priority, recommendedShot, alt, position });
}

/** The quiet disclosure every OWNER-approved illustration carries (OWNER "PRODUCTION V1" §2). */
export const conceptDisclosure: Localized = { ro: "Imagine de concept", ru: "Концептуальное изображение", en: "Concept image" };

/** An OWNER-approved illustration (ILLUSTRATIVE_APPROVED): brand scope only, no property, always disclosed — both editions. */
function illustrate(id: string, page: string, section: string, visual: VisualKey, purpose: string, recommendedShot: string, alt: Localized, position?: string) {
  approved.push({ evidence: "ILLUSTRATIVE_APPROVED", disclosure: conceptDisclosure, art: true, id, page, section, asset: null, visual, scope: "BRAND", purpose, priority: "HIGH", recommendedShot, alt, position });
}

const A = {
  balconies: { ro: "Arhitectură albă pe cer senin", ru: "Белая архитектура на фоне ясного неба", en: "White architecture against a clear sky" },
  engineer: { ro: "Inginer care verifică lucrările pe un șantier", ru: "Инженер проверяет работы на строительной площадке", en: "An engineer checking works on a building site" },
  canopy: { ro: "Copertină albă de beton în lumina zilei", ru: "Белый бетонный навес при дневном свете", en: "A white concrete canopy in daylight" },
  invest: { ro: "Doi profesioniști lucrează asupra unei propuneri", ru: "Двое специалистов работают над предложением", en: "Two professionals working through a proposal" },
  develop: { ro: "Șantier de construcții văzut de sus", ru: "Строительная площадка сверху", en: "A construction site seen from above" },
  street: { ro: "Activitate la nivelul străzii, în fața unei cafenele", ru: "Жизнь улицы у входа в кафе", en: "Street-level activity at a café entrance" },
  sky: { ro: "Fațadă de sticlă care reflectă cerul", ru: "Стеклянный фасад отражает небо", en: "A glass facade reflecting the sky" },
  rebar: { ro: "Echipă de construcții la lucru pe armătură", ru: "Строительная бригада работает с арматурой", en: "A construction crew working on reinforcement" },
  excavator: { ro: "Lucrări de terasament pe un amplasament", ru: "Земляные работы на площадке", en: "Earthworks on a site" },
  window: { ro: "Profesionist care citește lângă o fereastră luminoasă", ru: "Специалист читает у светлого окна", en: "A professional reading by a bright window" },
  hall: { ro: "Oameni care traversează un hol alb și luminos", ru: "Люди идут через светлый белый холл", en: "People walking through a bright white hall" },
  walker: { ro: "Trecător de-a lungul unui gard de șantier alb", ru: "Прохожий вдоль белого строительного ограждения", en: "A passer-by along a white site hoarding" },
  perforated: { ro: "Fațadă albă perforată și intrare", ru: "Белый перфорированный фасад и вход", en: "A perforated white facade and entrance" },
  meeting: { ro: "Sală de ședințe minimalistă în lumina zilei", ru: "Минималистичная переговорная при дневном свете", en: "A minimalist meeting room in daylight" },
  loft: { ro: "Spațiu de lucru deschis și luminos", ru: "Светлое открытое рабочее пространство", en: "A bright open-plan floor" },
  cafe: { ro: "Oameni într-o cafenea luminoasă", ru: "Люди в светлом кафе", en: "People in a bright café" },
  field: { ro: "Teren agricol deschis până la orizont", ru: "Открытое поле до горизонта", en: "Open farmland to the horizon" },
  road: { ro: "Drum regional printre câmpuri", ru: "Региональная дорога среди полей", en: "A regional road through open land" },
  storefront: { ro: "Vitrină liberă, pregătită pentru un nou chiriaș", ru: "Свободная витрина, готовая к новому арендатору", en: "A vacant shopfront ready for a new tenant" },
  salesfloor: { ro: "Sală de vânzări luminoasă", ru: "Светлый торговый зал", en: "A bright sales floor" },
  officeBuilding: { ro: "Clădire de birouri în lumina zilei", ru: "Офисное здание при дневном свете", en: "An office building in daylight" },
  inspection: { ro: "Ingineri care verifică o construcție, orașul în fundal", ru: "Инженеры осматривают объект, за ними город", en: "Engineers inspecting a structure, the city behind them" },
  plans: { ro: "Mâini care lucrează pe planul unui spațiu comercial", ru: "Работа над планом коммерческого пространства", en: "Hands working over a commercial floor plan" },
  frame: { ro: "Structură de beton în construcție, echipe la lucru", ru: "Строительство бетонного каркаса, бригады за работой", en: "A concrete frame under construction, crews at work" },
  level: { ro: "Inginer care verifică un perete cu nivela", ru: "Инженер проверяет стену уровнем", en: "An engineer checking a wall with a level" },
  entrance: { ro: "Oameni care intră printr-o ușă de sticlă", ru: "Люди входят через стеклянную дверь", en: "People walking in through a glass entrance" },
  loftCafe: { ro: "Cafenea luminoasă într-o clădire reconvertită, cu clienți", ru: "Светлое кафе в обновлённом здании, посетители", en: "A sunlit café in a converted building, with customers" },
  boutique: { ro: "Cumpărători într-un magazin luminat de vitrină", ru: "Покупатели в магазине, свет от витрины", en: "Shoppers in a shop lit from the window" },
  officeTenants: { ro: "Chiriași la lucru lângă o fațadă de sticlă cu vedere spre oraș", ru: "Арендаторы за работой у стеклянного фасада с видом на город", en: "Tenants at work by a glass facade with a city view" },
  devFrame: { ro: "Montajul carcasei metalice a unei clădiri comerciale pe un șantier mare, macarale și echipe la lucru, văzut de sus", ru: "Монтаж стального каркаса коммерческого здания на большой площадке: краны и бригады за работой, вид сверху", en: "A steel frame of a commercial building going up on a large site — cranes and crews at work, seen from above" },
  model: { ro: "Mâini cu compas și riglă deasupra unei machete", ru: "Работа с макетом генплана", en: "Hands with compass and ruler over a masterplan model" },
  heroPlaza: { ro: "Clădiri de birouri contemporane deasupra unei piețe pavate cu cărămidă, copaci și o terasă", ru: "Современные офисные здания над площадью из клинкера, деревья и терраса кафе", en: "Contemporary office buildings above a brick-paved square, trees and a café terrace" },
  crane: { ro: "Cadru de beton și macara deasupra orașului", ru: "Строящийся каркас и башенный кран над городом", en: "A concrete frame and a tower crane over the city" },
  rebarCrew: { ro: "Echipă pe o placă armată, macara, acoperișuri roșii", ru: "Бригада на армированной плите, кран, красные крыши", en: "A crew on a reinforced slab, a crane, red roofs" },
  sitePair: { ro: "Ingineri pe șantier care arată spre structură", ru: "Инженеры на площадке обсуждают конструкцию", en: "Engineers on site pointing at the structure" },
  scaffoldStreet: { ro: "Lucrător printre schele pe o stradă cu fațade de piatră", ru: "Рабочий среди лесов на улице с каменными фасадами", en: "A worker among scaffolding on a stone-facade street" },
  loftTeam: { ro: "Echipă la lucru într-un spațiu cu cărămidă și ferestre metalice", ru: "Команда за работой в лофте с кирпичом и стальными окнами", en: "A team at work in a brick loft with steel windows" },
  drawing: { ro: "Mâini care desenează pe un plan", ru: "Работа над чертежом", en: "Hands drawing on a plan" },
  officeLight: { ro: "Sală de ședințe cu ferestre înalte", ru: "Переговорная с высокими окнами", en: "A meeting room with tall windows" },
} satisfies Record<string, Localized>;

// Home
// Home (OWNER briefs 2026-10-08): the hero now shows real MEGAPARC property; human scale lives in the direction tiles, the proof band and the routes.
place("home.direction.investment", "Home", "Directions · 01 investment", null, "cv-inspection", "BRAND", "Investment — people evaluating a real asset", "HIGH", "MEGAPARC team on a site visit with plans at a property", A.inspection);
place("home.direction.development", "Home", "Directions · 02 development", null, "cv-frame", "BRAND", "Development — engineering on site", "HIGH", "VATRA site: MEGAPARC engineer on site", A.frame);
place("home.direction.leasing", "Home", "Directions · 03 leasing", null, "cv-loft-cafe", "BRAND", "Leasing — tenant activity at street level", "HIGH", "People entering a MEGAPARC property", A.loftCafe);
// Home hero — a concept architectural photograph that sells the brand, never a MEGAPARC asset (OWNER premium brief 2026-10-09). Source: Unsplash, Wolfgang Weiser, Hamburg (Unsplash License).
// OWNER "PRODUCTION V1" (2026-11-09) §2A: approved for production as an illustration — disclosed «Концептуальное изображение».
// home.hero (cv-hero-plaza) — OWNER REJECTED 2026-11-10 (R3.3 §1: the building is cut at the side). Not registered; the Home hero is typography-led.
place("home.proof", "Home", "Proof · full-bleed scene", null, "cv-crane", "BRAND", "Execution — work in progress behind the figures", "MEDIUM", "VATRA construction, wide, daylight", A.crane);
place("home.route.partner", "Home", "Routes · investment partnership", null, "cv-model", "BRAND", "Partnership — a meeting over plans", "MEDIUM", "MEGAPARC meeting over drawings", A.model);
// About · the business (three scenes): real property photographs carry the scene; these insets add human scale.
place("business.investment.inset", "About", "Business · 01 investment inset", null, "cv-plans", "BRAND", "Evaluating an asset — plans and people", "HIGH", "Site inspection of a property, plans in hand", A.plans);
place("business.development.inset", "About", "Business · 02 development inset", null, "cv-level", "BRAND", "Construction work", "HIGH", "VATRA construction crew", A.level);
place("business.leasing.inset", "About", "Business · 03 leasing inset", null, "cv-entrance", "BRAND", "Tenant activity", "HIGH", "Tenant activity inside a MEGAPARC property", A.entrance);
// Pexels 2314021, Diego Pontes, Malvinas (PB), Brazil — Pexels License; provenance internal only (OWNER premium phase 2, 2026-10-09)
// OWNER "PRODUCTION V1" (2026-11-09) §2B: approved for production as an illustration — never a MEGAPARC asset or completed project.
illustrate("partnership.hero", "Partnership", "Hero", "cv-dev-frame", "Capital at work — a commercial frame going up, project scale, human scale", "MEGAPARC development site from above (drone), daylight", A.devFrame, "50% 55%");
place("home.route.owner", "Home", "Routes · offer a property or land", null, "cv-field", "BRAND", "Owner route — land", "MEDIUM", "Land at a town entrance (MEGAPARC site visit)", A.field);
// Projects
place("development.drochia", "Projects", "Collection · Drochia Gateway", "Drochia Gateway", "cv-field", "PROPERTY_DIRECTION", "Site context direction — not the site", "HIGH", "Drochia Gateway DRONE — the real site, both road fronts", A.field);
// Project pages and leasing units
place("asset.dacia-31.gallery.1", "Projects · Dacia 31", "Gallery · Leasing", "Dacia 31", "cv-office-light", "PROPERTY_DIRECTION", "Interior direction", "HIGH", "Dacia 31 INTERIOR / AVAILABLE UNIT", A.officeLight);
place("asset.dacia-31.gallery.2", "Projects · Dacia 31", "Gallery · Leasing", "Dacia 31", "cv-loft-team", "PROPERTY_DIRECTION", "Interior direction", "MEDIUM", "Dacia 31 INTERIOR — typical floor", A.loftTeam);
place("asset.moscova-9.gallery.1", "Projects · Moscova 9", "Gallery · Leasing", "Moscova 9", "cv-salesfloor", "PROPERTY_DIRECTION", "Sales-floor direction", "HIGH", "Moscova 9 AVAILABLE UNIT — sales floor", A.salesfloor);
place("asset.moscova-9.gallery.2", "Projects · Moscova 9", "Gallery · Leasing", "Moscova 9", "cv-boutique", "PROPERTY_DIRECTION", "Shopfront ready for a tenant", "MEDIUM", "Moscova 9 AVAILABLE UNIT — the frontage from the boulevard", A.boutique);
place("asset.moscova-20.gallery.1", "Projects · Moscova 20", "Gallery · Leasing", "Moscova 20", "cv-cafe", "PROPERTY_DIRECTION", "Tenant activity direction", "HIGH", "Moscova 20 TENANT ACTIVITY", A.cafe);
place("asset.moscova-20.gallery.2", "Projects · Moscova 20", "Gallery · Leasing", "Moscova 20", "cv-manage", "PROPERTY_DIRECTION", "Street corner activity direction", "MEDIUM", "Moscova 20 ENTRANCE / corner at street level", A.street);
place("project.vatra.team", "Projects · VATRA", "Current reality · on site", "VATRA", "cv-rebar-crew", "PROPERTY_DIRECTION", "Construction team direction", "MEDIUM", "VATRA HUMAN SCALE — construction team, morning", A.rebarCrew);
place("project.drochia.hero", "Projects · Drochia Gateway", "Hero", "Drochia Gateway", "cv-field", "PROPERTY_DIRECTION", "Site context direction — not the site", "HIGH", "Drochia Gateway HERO — the real site from the entrance road", A.field, "50% 62%");
place("project.drochia.road", "Projects · Drochia Gateway", "Current reality · the land", "Drochia Gateway", "cv-field", "PROPERTY_DIRECTION", "The site as it is today — open land", "HIGH", "Drochia Gateway ACCESS — approach road and visibility", A.field, "50% 78%");
// About — the owner model: acquire · develop · lease · operate use real MEGAPARC photographs; the two decisions use brand frames
// Offer a property
place("offer.land", "Offer a property", "What we buy · land", null, "cv-field", "BRAND", "Land for development", "LOW", "Open land at a town entrance", A.field);
// Careers
place("careers.team", "Careers", "Pillar · Team", null, "cv-site-pair", "BRAND", "Team", "MEDIUM", "MEGAPARC team at work", A.sitePair);
place("careers.responsibility", "Careers", "Pillar · Project responsibility", null, "cv-hero-2", "BRAND", "Responsibility on site", "MEDIUM", "MEGAPARC engineer on site", A.engineer);
place("careers.growth", "Careers", "Pillar · Career development", null, "cv-drawing", "BRAND", "Learning", "LOW", "MEGAPARC office", A.drawing);
place("careers.field", "Careers", "Pillar · Field + office", null, "cv-scaffold-street", "BRAND", "Field and office", "LOW", "MEGAPARC team between site and office", A.scaffoldStreet);

/** DEMO concept-visual placements (the production gate fails while any remains; production edition: none). */
export const imageUses: readonly ImageUse[] = uses;
/** OWNER-approved illustrations (ILLUSTRATIVE_APPROVED) — the only concept imagery the production edition carries. */
export const approvedIllustrations: readonly ImageUse[] = approved;

/* ------------------------------------------------------------------ */
/* VIDEO — concept films (OWNER addendum 2026-10-08, careers video)      */
/* ------------------------------------------------------------------ */

export type ConceptVideo = {
  key: string;
  status: "DEMO";
  type: "CONCEPT_VIDEO";
  futureReplacement: "REPLACE_WITH_REAL_MEGAPARC_SHOOT";
  files: string[];
  licence: string;
  /** Stock clips in the edit (scripts/careers-video.mjs). None shows MEGAPARC people or property. */
  credits: { id: number; author: string; shot: string }[];
};

export const conceptVideos = {
  "cv-film-careers": {
    key: "cv-film-careers",
    status: "DEMO",
    type: "CONCEPT_VIDEO",
    futureReplacement: "REPLACE_WITH_REAL_MEGAPARC_SHOOT",
    files: ["careers-concept.mp4 (1600×900)", "careers-concept-mobile.mp4 (720×1280)", "careers-concept-poster.webp", "careers-concept-mobile-poster.webp"],
    licence: "Pexels License — free use and modification, no attribution required; must not imply endorsement by the people shown",
    credits: [
      { id: 8482303, author: "Thirdman", shot: "Checking a column with a spirit level in an empty, daylit floor" },
      { id: 7646443, author: "Alena Darmel", shot: "Hands working over an architectural plan" },
      { id: 4205680, author: "Jozef Papp", shot: "Construction site from above, machinery at work" },
      { id: 7491472, author: "RDNE Stock project", shot: "A team around drawings on a table" },
      { id: 12007917, author: "manas patra", shot: "Earthworks on an open plot in daylight" },
      { id: 7651683, author: "Kindel Media", shot: "Walking through an operating office floor" },
      { id: 8965526, author: "Mikael Blomkvist", shot: "Two engineers crossing a site (vertical edit)" },
      { id: 8835657, author: "Yan Krukau", shot: "Marking up a plan at a table (vertical edit)" },
    ],
  },
} satisfies Record<string, ConceptVideo>;

export type VideoUse = { id: string; page: string; section: string; video: keyof typeof conceptVideos; purpose: string; priority: ImageUse["priority"]; recommendedShot: string };

const filmShoot =
  "MEGAPARC shoot, daylight, people natural (no staged handshakes): engineer walking through a MEGAPARC property · inspection on the VATRA site · plans on the table · team discussing drawings · measuring a building detail · machinery on site · a colleague crossing an operating building · a short building / street transition. 16:9 + 9:16, 15–20 s loop, no audio";

// production edition: no concept film (OWNER "PRODUCTION V1" §3 Careers)
export const videoUses: readonly VideoUse[] = productionEdition ? [] : [
  { id: "home.careers.film", page: "Home", section: "Vacancies · cinematic film", video: "cv-film-careers", purpose: "Atmosphere of real work behind the careers statement", priority: "HIGH", recommendedShot: filmShoot },
  { id: "careers.hero.film", page: "Careers", section: "Hero · cinematic film", video: "cv-film-careers", purpose: "Opening of the careers page — real work, one call to action", priority: "HIGH", recommendedShot: filmShoot },
];

/** Shown on the film while it is concept footage — never implies MEGAPARC people or property. */
export const conceptVideoLabel: Localized = { ro: "Video concept · nu MEGAPARC", ru: "Концепт-видео · не MEGAPARC", en: "Concept video · not MEGAPARC" };

/** A registered placement, or null when this edition carries no image there (production: DEMO placements). */
export function imageUse(id: string): ImageUse | null {
  const found = uses.find((item) => item.id === id) ?? approved.find((item) => item.id === id) ?? null;
  // the preview edition registers every placement — an unknown id there is a typo
  if (!found && !productionEdition) throw new Error(`demo-content: unknown image use "${id}"`);
  return found;
}

/* ------------------------------------------------------------------ */
/* Register                                                             */
/* ------------------------------------------------------------------ */

export const dataRegister: readonly DataPoint[] = points;

/** True while the build carries any DEMO value or concept visual: the preview marker shows and robots stay noindex. */
export const demoContentPresent = points.some((entry) => entry.status === "DEMO") || uses.length > 0 || videoUses.length > 0;
