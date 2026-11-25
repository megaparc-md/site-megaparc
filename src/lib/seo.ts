import type { Metadata } from "next";
import { getClosedVacancy, getProject, getSpace, getVacancy, leasingExperienceForSpace, spaceArea } from "@/content/source";
import { vacancyCopy } from "@/data/careers-copy";
import type { Vacancy } from "@/lib/careers";
import { creangaProfile, demoContentPresent } from "@/data/demo-content";
import { brand, isPreviewBuild, localePath, locales, type Localized, type SiteLocale } from "@/lib/site-data";

/**
 * SEO metadata — plain, search-oriented and factual (editorial source: RU).
 * Business model (OWNER correction 2026-10-08): MEGAPARC buys real estate and
 * land, develops its own projects and leases its own commercial space. No
 * asset-management service wording anywhere in titles or descriptions.
 * This module must never import src/lib/public-financial-metrics.ts:
 * temporary review-only figures stay out of titles, descriptions, Open Graph
 * and structured data by construction.
 *
 * Robots: GitHub Pages OWNER preview (GITHUB_PAGES=true) is noindex, nofollow;
 * so is ANY build that still carries demo content (src/data/demo-content.ts).
 * Internal review routes (brand system, CMS workflow) are always noindex.
 * Production megaparc.md is index, follow only after OWNER approval and a
 * passing `npm run gate:production`.
 */

/** Canonical origin — OWNER "PRODUCTION V1" (2026-11-09) §8: https://www.megaparc.md. */
export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.megaparc.md").replace(/\/$/, "");

export const robotsPolicy: NonNullable<Metadata["robots"]> = isPreviewBuild || demoContentPresent
  ? { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } }
  : { index: true, follow: true };

const ogLocale: Record<SiteLocale, string> = { ro: "ro_MD", ru: "ru_RU", en: "en_GB" };
const hreflang: Record<SiteLocale, string> = { ro: "ro-MD", ru: "ru", en: "en" };

type PageCopy = { title: Localized; description: Localized };

export const pageSeo = {
  home: {
    title: {
      ro: "MEGAPARC — investiții imobiliare, dezvoltare și închiriere de spații comerciale",
      ru: "MEGAPARC\u00a0— инвестиции, девелопмент и\u00a0аренда коммерческой недвижимости",
      en: "MEGAPARC — commercial real estate investment, development and leasing",
    },
    description: {
      ro: "MEGAPARC investește în imobile și terenuri, dezvoltă proiecte proprii și închiriază spații comerciale în Chișinău. Vedeți spațiile disponibile acum.",
      ru: "MEGAPARC инвестирует в недвижимость и землю, развивает собственные проекты и сдаёт коммерческие площади в Кишинэу. Смотрите, что сдаётся сейчас.",
      en: "MEGAPARC invests in real estate and land, develops its own projects and leases commercial space in Chișinău. See what is available now.",
    },
  },
  about: {
    title: { ro: "Despre MEGAPARC — investiții, dezvoltare, închiriere", ru: "О\u00a0компании MEGAPARC\u00a0— инвестиции, девелопмент, аренда", en: "About MEGAPARC — investment, development, leasing" },
    description: {
      ro: "MEGAPARC achiziționează imobile comerciale și terenuri, dezvoltă proiecte proprii, reconstruiește clădirile sale și închiriază spații în ele. Fondată în 2005.",
      ru: "MEGAPARC приобретает коммерческие объекты и\u00a0землю, строит собственные проекты, реконструирует свои здания и\u00a0сдаёт в\u00a0них площади в\u00a0аренду. Основана в\u00a02005\u00a0году.",
      en: "MEGAPARC acquires commercial property and land, builds and redevelops its own projects and leases space in its own buildings. Founded in 2005.",
    },
  },
  history: {
    title: { ro: "Istoric — cronica grupului și a MEGAPARC", ru: "История — хроника группы и MEGAPARC", en: "History — the chronicle of the group and MEGAPARC" },
    description: {
      ro: "Din 1991: comerț, producție, logistică, finanțe, agrobusiness, proiecte internaționale. MEGAPARC, fondată în 2005; din 2020\u00a0— accentul pe imobiliare.",
      ru: "С\u00a01991\u00a0года: розница, производство, логистика, финансы, агробизнес, международные проекты. MEGAPARC основана в\u00a02005\u00a0году; с\u00a02020\u2011го\u00a0— фокус на\u00a0недвижимости.",
      en: "Since 1991: retail, manufacturing, logistics, finance, agribusiness, international projects. MEGAPARC was founded in 2005; real estate has been the focus since 2020.",
    },
  },
  projects: {
    title: { ro: "Proiecte MEGAPARC\u00a0— proprietăți, dezvoltare, terenuri", ru: "Проекты MEGAPARC — объекты, девелопмент, земля", en: "MEGAPARC projects — properties, development, land" },
    description: {
      ro: "Proprietățile comerciale MEGAPARC din Chișinău (Dacia 31, Moscova 9, Moscova 20, Creangă 78), proiectul VATRA și terenul Drochia.",
      ru: "Коммерческие объекты MEGAPARC в\u00a0Кишинэу (Dacia\u00a031, Moscova\u00a09, Moscova\u00a020, Creangă\u00a078), проект VATRA и\u00a0участок Drochia.",
      en: "MEGAPARC's commercial properties in Chișinău — Dacia 31, Moscova 9, Moscova 20, Creangă 78 — the VATRA project and the Drochia site.",
    },
  },
  leasing: {
    title: { ro: "Închiriere spații comerciale în Chișinău — MEGAPARC", ru: "Аренда коммерческих помещений в Кишинэу — MEGAPARC", en: "Commercial space to let in Chișinău — MEGAPARC" },
    description: {
      ro: "Spații comerciale disponibile ale MEGAPARC în Chișinău: suprafață, etaj, acces, status și date tehnice. Vizionare direct cu proprietarul.",
      ru: "Свободные коммерческие помещения MEGAPARC в\u00a0Кишинэу: площадь, этаж, вход, статус и\u00a0технические данные. Просмотр\u00a0— напрямую у\u00a0собственника.",
      en: "Available commercial space from MEGAPARC in Chișinău: area, floor, access, status and technical details. Viewings directly with the owner.",
    },
  },
  partnership: {
    title: { ro: "Parteneriat investițional — MEGAPARC", ru: "Инвестиционное партнёрство\u00a0— MEGAPARC", en: "Investment partnership — MEGAPARC" },
    description: {
      ro: "Pentru investitori, bănci și parteneri: ce analizează MEGAPARC, ce aduce fiecare parte, imobilele în exploatare și proiectele de dezvoltare.",
      ru: "Для\u00a0инвесторов, банков и\u00a0партнёров: что рассматривает MEGAPARC, что вносит каждая сторона, действующие объекты и\u00a0проекты развития.",
      en: "For investors, banks and partners: what MEGAPARC considers, what each side brings, our operating properties and development projects.",
    },
  },
  offer: {
    title: { ro: "Propuneți un imobil sau un teren\u00a0— MEGAPARC cumpără", ru: "Предложите объект или землю — MEGAPARC покупает", en: "Offer a property or land — MEGAPARC buys" },
    description: {
      ro: "MEGAPARC cumpără clădiri comerciale, clădiri de renovat și terenuri pentru dezvoltare. Trimiteți datele imobilului\u00a0— primiți o primă evaluare.",
      ru: "MEGAPARC покупает коммерческие здания, здания под\u00a0реконструкцию и\u00a0землю под\u00a0развитие. Пришлите информацию об\u00a0объекте\u00a0— получите первичную оценку.",
      en: "MEGAPARC buys commercial buildings, buildings to renovate and land for development. Send us the property details\u00a0— get a first assessment.",
    },
  },
  careers: {
    title: { ro: "Cariere la MEGAPARC — posturi vacante în Chișinău", ru: "Работа в MEGAPARC — открытые вакансии в Кишинэу", en: "Careers at MEGAPARC — open positions in Chișinău" },
    description: {
      ro: "Posturi vacante la MEGAPARC: management, construcții și inginerie, dezvoltare comercială, juridic, exploatare. Responsabilități, cerințe, remunerare și modul de aplicare.",
      ru: "Открытые вакансии MEGAPARC: управление, строительство и инженерия, коммерческое развитие, право, эксплуатация. Задачи, требования, оплата и порядок отклика.",
      en: "Open positions at MEGAPARC: management, construction and engineering, commercial development, legal, operations. Responsibilities, requirements, pay and how to apply.",
    },
  },
  contact: {
    title: { ro: "Contact — MEGAPARC", ru: "Контакты\u00a0— MEGAPARC", en: "Contact — MEGAPARC" },
    description: {
      ro: "Contactați MEGAPARC: închiriere, parteneriat investițional, propunerea unui imobil sau teren, cariere, întrebări generale.",
      ru: "Связаться с\u00a0MEGAPARC: аренда, инвестиционное партнёрство, предложение объекта или земли, вакансии, общие вопросы.",
      en: "Contact MEGAPARC: leasing, investment partnership, offering a property or land, careers, general questions.",
    },
  },
  brandSystem: {
    title: { ro: "Brand System — revizuire internă", ru: "Brand System — внутренний обзор", en: "Brand System — internal review" },
    description: {
      ro: "Pagină internă de revizuire a sistemului de brand MEGAPARC.",
      ru: "Внутренняя страница обзора бренд-системы MEGAPARC.",
      en: "Internal review page for the MEGAPARC brand system.",
    },
  },
  cmsWorkflow: {
    title: { ro: "Cum se actualizează site-ul — prototip CMS (intern)", ru: "Как обновляется сайт — прототип CMS (внутренний)", en: "How the site is updated — CMS prototype (internal)" },
    description: {
      ro: "Prototip intern: cum un angajat MEGAPARC schimbă statutul unui spațiu în WordPress fără cod.",
      ru: "Внутренний прототип: как сотрудник MEGAPARC меняет статус помещения в WordPress без кода.",
      en: "Internal prototype: how a MEGAPARC employee changes a space's status in WordPress without code.",
    },
  },
} satisfies Record<string, PageCopy>;

export type PageId = keyof typeof pageSeo;

const internal: PageId[] = ["brandSystem", "cmsWorkflow"];

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const metaPath = (src: string) => (basePath && src.startsWith(basePath) ? src.slice(basePath.length) : src);
const ogImage = "/assets/portfolio/dacia-31-wide.webp";

/** an Open Graph image with its dimensions, alt text and type — what messengers and social networks read to draw the link card */
type ShareImage = { url: string; width: number; height: number; alt: string; type: string };

/**
 * The Moscova 20 share card (OWNER «FINAL 2-DAY DELIVERY MANDATE» §05, 2026-11-14): 1200 × 630 JPEG per language
 * (scripts/moscova-20-share-card.mjs) for the property page, its unit page and the Digital Leasing Pack — JPEG because WebP is not
 * shown by every messenger; the dimensions and the alt text travel with it.
 */
function m20ShareImage(locale: SiteLocale): ShareImage {
  const alt: Localized = { ro: "Moscova 20 — spațiu comercial de 625,7 m² pe bulevardul Moscova, Chișinău", ru: "Moscova\u00a020\u00a0— коммерческое помещение 625,7\u00a0м² на\u00a0бульваре Москова, Кишинэу", en: "Moscova 20 — a 625.7 m² commercial space on Moscova Boulevard, Chișinău" };
  return { url: `/assets/leasing/moscova-20/share/moscova-20-share-${locale}.jpg`, width: 1200, height: 630, alt: alt[locale], type: "image/jpeg" };
}

export function buildMetadata(locale: SiteLocale, path: string, copy: PageCopy, options?: { noindex?: boolean; image?: string | ShareImage }): Metadata {
  const languages: Record<string, string> = {};
  for (const l of locales) languages[hreflang[l]] = localePath(l, path);
  languages["x-default"] = localePath("ro", path);
  const title = copy.title[locale];
  const description = copy.description[locale];
  const given = options?.image;
  const image = typeof given === "object" ? { ...given, url: metaPath(given.url) } : given ? metaPath(given) : ogImage;
  return {
    title: { absolute: title },
    description,
    robots: options?.noindex ? { index: false, follow: false } : robotsPolicy,
    alternates: { canonical: localePath(locale, path), languages },
    openGraph: { title, description, type: "website", locale: ogLocale[locale], siteName: brand.name, url: localePath(locale, path), images: [image] },
    twitter: { card: "summary_large_image", title, description, images: [typeof image === "object" ? { url: image.url, alt: image.alt } : image] },
  };
}

export function pageMetadata(locale: SiteLocale, id: PageId, path: string) {
  return buildMetadata(locale, path, pageSeo[id], { noindex: internal.includes(id) });
}

export function projectMetadata(locale: SiteLocale, slug: string): Metadata {
  const project = getProject(slug);
  if (!project) return {};
  const title: Localized = {
    ro: `${project.name} — ${project.format.ro} · MEGAPARC`,
    ru: `${project.name} — ${project.format.ru} · MEGAPARC`,
    en: `${project.name} — ${project.format.en} · MEGAPARC`,
  };
  const description = project.slug === "creanga-78" ? creangaProfile.lead.value : project.asset?.lead ?? project.development?.lead ?? project.line;
  return buildMetadata(locale, `/projects/${project.slug}`, { title, description }, { image: project.slug === "moscova-20" ? m20ShareImage(locale) : project.media?.wide });
}

/** The Moscova 20 Digital Leasing Pack (OWNER toolkit mandate 2026-11-11): public, indexable, the entrance photograph as its share image. */
export function packMetadata(locale: SiteLocale): Metadata {
  // OWNER «FINAL 2-DAY DELIVERY MANDATE» §05 (2026-11-14): the link card says what the recipient opens — never a price
  const copy: PageCopy = {
    title: { ro: "Moscova 20 · 625,7 m² pe bulevardul Moscova · Leasing Pack · MEGAPARC", ru: "Moscova\u00a020 · 625,7\u00a0м² на\u00a0бульваре Москова · Leasing Pack · MEGAPARC", en: "Moscova 20 · 625.7 m² on Moscova Boulevard · Leasing Pack · MEGAPARC" },
    description: {
      ro: "Spațiu comercial în Chișinău, parter + demisol: oferta comercială, planurile oficiale, datele tehnice și cererea de vizionare.",
      ru: "Коммерческое помещение в\u00a0Кишинэу, 1\u2011й этаж + цоколь: коммерческое предложение, официальные планы, технические данные и\u00a0запрос на\u00a0просмотр.",
      en: "A commercial space in Chișinău, ground + lower ground: the commercial leasing proposal, the official plans, the technical data and a viewing request.",
    },
  };
  return buildMetadata(locale, "/leasing/moscova-20/pack", copy, { image: m20ShareImage(locale) });
}

/** The A4 print source of the PDF dossier — internal: noindex, removed from the production artifact. */
export function dossierPrintMetadata(locale: SiteLocale): Metadata {
  return buildMetadata(locale, "/leasing/moscova-20/dossier-print", { title: { ro: "Moscova 20 — dosar (sursă de tipar)", ru: "Moscova\u00a020\u00a0— досье (источник для\u00a0печати)", en: "Moscova 20 — dossier (print source)" }, description: { ro: "Sursa internă a PDF-ului.", ru: "Внутренний источник PDF.", en: "Internal source of the PDF." } }, { noindex: true });
}

/** the internal A4 source of the commercial offer (brochure R2) — same rules as the dossier print source: noindex, never public */
export function offerPrintMetadata(locale: SiteLocale): Metadata {
  return buildMetadata(locale, "/leasing/moscova-20/offer-print", { title: { ro: "Moscova 20 — ofertă comercială (sursă de tipar)", ru: "Moscova\u00a020\u00a0— коммерческое предложение (источник для\u00a0печати)", en: "Moscova 20 — commercial offer (print source)" }, description: { ro: "Sursa internă a PDF-ului.", ru: "Внутренний источник PDF.", en: "Internal source of the PDF." } }, { noindex: true });
}

/** the CFO-model prototype (OWNER R10 §04) — internal, noindex, OWNER preview only; stripped from the production artifact */
export function producerEconomicsMetadata(locale: SiteLocale): Metadata {
  return buildMetadata(locale, "/producer-economics", { title: { ro: "Rețele comerciale, magazin propriu sau ambele canale — calculator · MEGAPARC", ru: "Торговые сети, собственный магазин или оба канала\u00a0— калькулятор · MEGAPARC", en: "Retail chains, your own store or both channels — calculator · MEGAPARC" }, description: { ro: "Comparați trei scenarii pe baza cifrelor dumneavoastră: contribuția operațională, banii de start, pragul de rentabilitate și termenul de recuperare. Evaluare preliminară, nu o prognoză.", ru: "Сравните три сценария на\u00a0своих цифрах: операционный вклад, деньги на\u00a0старте, безубыточность и\u00a0срок окупаемости. Предварительная оценка, а\u00a0не\u00a0прогноз.", en: "Compare three scenarios using your own figures: operating contribution, cash at the start, break-even and payback. A preliminary assessment, not a forecast." } });
}

export function spaceMetadata(locale: SiteLocale, id: string): Metadata {
  const space = getSpace(id);
  if (!space) return {};
  const project = getProject(space.project)!;
  const title = Object.fromEntries((["ro", "ru", "en"] as SiteLocale[]).map((l) => [l, `${[project.name, spaceArea(space, l)].filter(Boolean).join(" · ")} — ${space.unit[l]} · MEGAPARC`])) as Localized;
  // A unit with a gold-standard leasing experience renders the same page as its property: the property URL is canonical (OWNER 2026-11-06).
  const path = leasingExperienceForSpace(space.id) ? `/projects/${project.slug}` : `/leasing/${space.id}`;
  return buildMetadata(locale, path, { title, description: space.headline }, { image: project.slug === "moscova-20" ? m20ShareImage(locale) : project.media?.wide });
}

/* ------------------------------------------------------------------ */
/* VACANCIES (OWNER «MEGAPARC CAREERS», 2026-11-25 · §10)                */
/* ------------------------------------------------------------------ */

/** An open vacancy: its own title and description in each language, canonical + hreflang. A paused / closed one: noindex. */
export function vacancyMetadata(locale: SiteLocale, slug: string): Metadata {
  const vacancy = getVacancy(slug);
  if (vacancy) {
    const pick = (key: "title" | "description") => Object.fromEntries(locales.map((l) => [l, vacancy.i18n[l].seo[key]])) as Localized;
    return buildMetadata(locale, `/careers/${slug}`, { title: pick("title"), description: pick("description") });
  }
  const closed = getClosedVacancy(slug);
  if (!closed) return {};
  const paused = closed.status === "paused";
  const title = Object.fromEntries(locales.map((l) => [l, `${closed.title[l]} — ${(paused ? vacancyCopy.pausedLabel : vacancyCopy.closedLabel)[l]} · MEGAPARC`])) as Localized;
  return buildMetadata(locale, `/careers/${slug}`, { title, description: paused ? vacancyCopy.pausedText : vacancyCopy.closedText }, { noindex: true });
}

const absolute = (locale: SiteLocale, path: string) => `${siteUrl}${localePath(locale, path)}/`;
const plain = (text: string) => text.split(String.fromCharCode(160)).join(" ").split(String.fromCharCode(8209)).join("-");
const html = (text: string) => plain(text).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/**
 * Structured data of an open vacancy: JobPosting + BreadcrumbList — confirmed facts only.
 * · baseSalary is deliberately absent: the published amounts are NET amounts for the probation period, which schema.org cannot
 *   express — a bare figure would misstate the pay (OWNER brief §10);
 * · no street address (none is published): the place is the company's office city; · no validThrough unless HR set a closing date;
 * · employmentType only where the source states the format. A paused or closed vacancy has no structured data at all.
 */
export function vacancyJsonLd(vacancy: Vacancy, locale: SiteLocale): Record<string, unknown>[] {
  const t = vacancy.i18n[locale];
  const copy = vacancyCopy;
  const list = (items: string[]) => `<ul>${items.map((item) => `<li>${html(item)}</li>`).join("")}</ul>`;
  const description = [
    `<p>${html(t.intro)}</p>`,
    ...t.role.map((text) => `<p>${html(text)}</p>`),
    `<h3>${html(copy.tasks[locale])}</h3>`,
    ...t.responsibilities.map((group) => `<h4>${html(group.title)}</h4>${list(group.items)}`),
    `<h3>${html(copy.must[locale])}</h3>${list(t.requirements.must)}`,
    t.requirements.skills.length ? `<h3>${html(copy.skills[locale])}</h3>${list(t.requirements.skills)}` : "",
    t.requirements.plus.length ? `<h3>${html(copy.plus[locale])}</h3>${list(t.requirements.plus)}` : "",
    t.kpi ? `<h3>${html(copy.kpi[locale])}</h3><p>${html(t.kpi.intro)}</p>${list(t.kpi.items)}` : "",
    `<h3>${html(copy.offer[locale])}</h3>${list(t.offer)}`,
  ].join("");
  const url = absolute(locale, `/careers/${vacancy.slug}`);
  const job: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: plain(t.title),
    description,
    identifier: { "@type": "PropertyValue", name: brand.name, value: vacancy.id },
    hiringOrganization: { "@type": "Organization", name: brand.name, sameAs: `${siteUrl}/` },
    directApply: false,
    inLanguage: locale,
    url,
  };
  if (vacancy.publishedAt) job.datePosted = vacancy.publishedAt;
  if (vacancy.closesAt) job.validThrough = `${vacancy.closesAt}T23:59:59+02:00`;
  if (vacancy.employment) job.employmentType = vacancy.employment === "full-time" ? "FULL_TIME" : "PART_TIME";
  if (vacancy.location) job.jobLocation = { "@type": "Place", address: { "@type": "PostalAddress", addressLocality: plain(vacancy.location[locale]), addressCountry: "MD" } };
  const careers: Localized = { ro: "Cariere", ru: "Вакансии", en: "Careers" };
  const breadcrumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: brand.name, item: `${siteUrl}${locale === "ro" ? "" : `/${locale}`}/` },
      { "@type": "ListItem", position: 2, name: careers[locale], item: absolute(locale, "/careers") },
      { "@type": "ListItem", position: 3, name: plain(t.title), item: url },
    ],
  };
  return [job, breadcrumbs];
}
