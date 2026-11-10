import type { Metadata } from "next";
import { getProject, getSpace, leasingExperienceForSpace, spaceArea } from "@/content/source";
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
      ro: "MEGAPARC — investiții, dezvoltare și închiriere de imobiliare comerciale",
      ru: "MEGAPARC — инвестиции, девелопмент и аренда коммерческой недвижимости",
      en: "MEGAPARC — commercial real estate investment, development and leasing",
    },
    description: {
      ro: "MEGAPARC investește în imobiliare și terenuri, dezvoltă proiecte proprii și închiriază spații comerciale în Chișinău. Vedeți spațiile libere acum.",
      ru: "MEGAPARC инвестирует в недвижимость и землю, развивает собственные проекты и сдаёт коммерческие площади в Кишинёве. Смотрите, что сдаётся сейчас.",
      en: "MEGAPARC invests in real estate and land, develops its own projects and leases commercial space in Chișinău. See what is available now.",
    },
  },
  about: {
    title: { ro: "Despre MEGAPARC — investiții, dezvoltare, închiriere", ru: "О компании MEGAPARC — инвестиции, девелопмент, аренда", en: "About MEGAPARC — investment, development, leasing" },
    description: {
      ro: "MEGAPARC achiziționează obiecte comerciale și terenuri, dezvoltă și reconstruiește proiecte proprii și închiriază spații în clădirile sale. Fondată în 2005.",
      ru: "MEGAPARC приобретает коммерческие объекты и землю, строит и реконструирует собственные проекты и сдаёт площади в своих зданиях. Основана в 2005 году.",
      en: "MEGAPARC acquires commercial property and land, builds and redevelops its own projects and leases space in its own buildings. Founded in 2005.",
    },
  },
  history: {
    title: { ro: "Istoric — cronica grupului și a MEGAPARC", ru: "История — хроника группы и MEGAPARC", en: "History — the chronicle of the group and MEGAPARC" },
    description: {
      ro: "Din 1991: comerț, producție, logistică, finanțe, agrobusiness, proiecte internaționale. MEGAPARC, fondată în 2005; imobiliarele — focus din 2020.",
      ru: "С 1991 года: розница, производство, логистика, финансы, агробизнес, международные проекты. MEGAPARC основана в 2005 году; с 2020‑го — фокус на недвижимости.",
      en: "Since 1991: retail, manufacturing, logistics, finance, agribusiness, international projects. MEGAPARC founded in 2005; real estate the focus since 2020.",
    },
  },
  projects: {
    title: { ro: "Proiecte MEGAPARC — obiecte, dezvoltare, terenuri", ru: "Проекты MEGAPARC — объекты, девелопмент, земля", en: "MEGAPARC projects — properties, development, land" },
    description: {
      ro: "Obiectele comerciale MEGAPARC din Chișinău, proiectul VATRA și terenul Drochia: Dacia 31, Moscova 9, Moscova 20, Creangă 78.",
      ru: "Коммерческие объекты MEGAPARC в Кишинёве, проект VATRA и участок Drochia: Dacia 31, Moscova 9, Moscova 20, Creangă 78.",
      en: "MEGAPARC's commercial properties in Chișinău, the VATRA project and the Drochia site: Dacia 31, Moscova 9, Moscova 20, Creangă 78.",
    },
  },
  leasing: {
    title: { ro: "Închiriere spații comerciale în Chișinău — MEGAPARC", ru: "Аренда коммерческих помещений в Кишинёве — MEGAPARC", en: "Commercial space to let in Chișinău — MEGAPARC" },
    description: {
      ro: "Spații libere acum: retail, birouri, showroom, servicii, clinici, HoReCa. Suprafață, etaj, acces, parcare și plan pentru fiecare spațiu.",
      ru: "Что сдаётся сейчас: торговля, офисы, шоурумы, сервисы, клиники, HoReCa. Площадь, этаж, вход, парковка и план по каждому помещению.",
      en: "What is available now: retail, offices, showrooms, services, clinics, food and drink. Area, floor, access, parking and plan for every space.",
    },
  },
  partnership: {
    title: { ro: "Parteneriat investițional — MEGAPARC", ru: "Инвестиционное партнёрство — MEGAPARC", en: "Investment partnership — MEGAPARC" },
    description: {
      ro: "Pentru investitori, bănci și parteneri: activele MEGAPARC, studiul de caz Moscova 9, proiectele de dezvoltare, criteriile de selecție, verificarea investițională și etapele analizei unui proiect.",
      ru: "Для инвесторов, банков и партнёров: действующие активы MEGAPARC, кейс Moscova 9, проекты развития, критерии отбора, инвестиционная проверка и порядок рассмотрения проекта.",
      en: "For investors, banks and partners: MEGAPARC's operating assets, the Moscova 9 case study, development projects, selection criteria, investment due diligence and how a project is reviewed.",
    },
  },
  offer: {
    title: { ro: "Propuneți un obiect sau un teren — MEGAPARC cumpără", ru: "Предложите объект или землю — MEGAPARC покупает", en: "Offer a property or land — MEGAPARC buys" },
    description: {
      ro: "MEGAPARC cumpără clădiri comerciale, clădiri de renovat și terenuri pentru dezvoltare. Trimiteți obiectul — primiți o primă evaluare.",
      ru: "MEGAPARC покупает коммерческие здания, здания под реконструкцию и землю под развитие. Отправьте объект — получите первичную оценку.",
      en: "MEGAPARC buys commercial buildings, buildings to renovate and land for development. Send us the property — get a first assessment.",
    },
  },
  careers: {
    title: { ro: "Cariere — posturi deschise la MEGAPARC", ru: "Вакансии MEGAPARC", en: "Careers — open vacancies at MEGAPARC" },
    description: {
      ro: "Posturi deschise la MEGAPARC: dezvoltare și construcții, închiriere și exploatare, juridic, conducere.",
      ru: "Открытые вакансии MEGAPARC: девелопмент и строительство, аренда и эксплуатация, юридический отдел, руководство.",
      en: "Open vacancies at MEGAPARC: development and construction, leasing and operations, legal, leadership.",
    },
  },
  contact: {
    title: { ro: "Contact — MEGAPARC", ru: "Контакты — MEGAPARC", en: "Contact — MEGAPARC" },
    description: {
      ro: "Contactați MEGAPARC: închiriere, parteneriat investițional, propunerea unui obiect sau teren, carieră, întrebări generale.",
      ru: "Связаться с MEGAPARC: аренда, инвестиционное партнёрство, предложение объекта или земли, вакансии, общие вопросы.",
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

export function buildMetadata(locale: SiteLocale, path: string, copy: PageCopy, options?: { noindex?: boolean; image?: string }): Metadata {
  const languages: Record<string, string> = {};
  for (const l of locales) languages[hreflang[l]] = localePath(l, path);
  languages["x-default"] = localePath("ro", path);
  const title = copy.title[locale];
  const description = copy.description[locale];
  const image = options?.image ? metaPath(options.image) : ogImage;
  return {
    title: { absolute: title },
    description,
    robots: options?.noindex ? { index: false, follow: false } : robotsPolicy,
    alternates: { canonical: localePath(locale, path), languages },
    openGraph: { title, description, type: "website", locale: ogLocale[locale], siteName: brand.name, url: localePath(locale, path), images: [image] },
    twitter: { card: "summary_large_image", title, description, images: [image] },
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
  return buildMetadata(locale, `/projects/${project.slug}`, { title, description }, { image: project.media?.wide });
}

export function spaceMetadata(locale: SiteLocale, id: string): Metadata {
  const space = getSpace(id);
  if (!space) return {};
  const project = getProject(space.project)!;
  const title = Object.fromEntries((["ro", "ru", "en"] as SiteLocale[]).map((l) => [l, `${[project.name, spaceArea(space, l)].filter(Boolean).join(" · ")} — ${space.unit[l]} · MEGAPARC`])) as Localized;
  // A unit with a gold-standard leasing experience renders the same page as its property: the property URL is canonical (OWNER 2026-11-06).
  const path = leasingExperienceForSpace(space.id) ? `/projects/${project.slug}` : `/leasing/${space.id}`;
  return buildMetadata(locale, path, { title, description: space.headline }, { image: project.media?.wide });
}
