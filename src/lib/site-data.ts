export type SiteLocale = "ro" | "ru" | "en";
export const locales: SiteLocale[] = ["ro", "ru", "en"];
export const defaultLocale: SiteLocale = "ro";

const publicBasePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/**
 * Site edition (release/2026-11-09-production-v1, OWNER "PRODUCTION V1"): this release branch builds the
 * PRODUCTION edition by default — confirmed content only, no DEMO values, no concept visuals except the two
 * OWNER-approved illustrations, no preview tools. The OWNER preview edition needs NEXT_PUBLIC_SITE_EDITION=preview.
 * Data modules read the same variable directly (they also load in Node for `npm run gate:production`).
 */
export const isProductionEdition = (process.env.NEXT_PUBLIC_SITE_EDITION ?? "production") === "production";

/** True for a static export (GitHub Pages — the OWNER preview and the production artifact alike). */
export const isStaticExport = process.env.GITHUB_PAGES === "true";

/** True on the GitHub Pages OWNER approval preview. */
export const isPreviewBuild = isStaticExport && !isProductionEdition;

/** Prefixes a public asset path with the GitHub Pages base path when present. */
export function publicAsset(path: string) {
  if (!path.startsWith("/")) return path;
  return `${publicBasePath}${path}`;
}

/** Maps a locale-neutral route to its localised path. */
export function localePath(locale: SiteLocale, path: string) {
  if (locale === "ro") return path;
  return path === "/" ? `/${locale}` : `/${locale}${path}`;
}

/** Strips a locale prefix and returns the locale-neutral route. */
export function neutralPath(pathname: string) {
  const clean = pathname.replace(/\/$/, "") || "/";
  const match = clean.match(/^\/(ru|en)(?=\/|$)/);
  if (!match) return { locale: "ro" as SiteLocale, path: clean };
  return { locale: match[1] as SiteLocale, path: clean.slice(match[0].length) || "/" };
}

export type Localized = Record<SiteLocale, string>;

/* ------------------------------------------------------------------ */
/* Brand                                                                */
/* ------------------------------------------------------------------ */

export const brand = {
  name: "MEGAPARC",
  wordmark: "Megaparc",
  /** Business positioning (OWNER brief 2026-10-08): investment · development · leasing — localised. */
  positioning: { ro: "Investiții · Dezvoltare · Închiriere", ru: "Инвестиции · Девелопмент · Аренда", en: "Investment · Development · Leasing" } satisfies Localized,
  /** OWNER-approved group heritage marker (group investment structure, 1995). Kept in English in every locale. 1991 = business origins; 2005 = MEGAPARC founded. */
  since: "Since 1995",
  tagline: { ro: "Construim viitorul", ru: "Строим будущее", en: "We build the future" } satisfies Localized,
  city: { ro: "Chișinău · Republica Moldova", ru: "Кишинёв · Республика Молдова", en: "Chișinău · Republic of Moldova" } satisfies Localized,
  languageNames: { ro: "Română", ru: "Русский", en: "English" } satisfies Localized,
};

/* ------------------------------------------------------------------ */
/* Navigation                                                           */
/* ------------------------------------------------------------------ */

/** `also`: further route prefixes that mark the item active (History lives under About). */
export type NavItem = { label: string; path: string; also?: string[] };

/**
 * Primary navigation — OWNER "SITEWIDE R3" §12 (2026-11-09): PROJECTS · LEASING · INVESTMENT · ABOUT · CONTACT.
 * The logo is the way home. Investment = the investment & partnership page (/partnership, URL unchanged).
 * Secondary routes (Offer a property · Careers) stay in the header as a quieter utility group
 * (OWNER 2026-10-08: Careers in the top navigation) without competing with the primary five.
 */
export const navigation: Record<SiteLocale, NavItem[]> = {
  ro: [
    { label: "Proiecte", path: "/projects" },
    { label: "Închiriere", path: "/leasing" },
    { label: "Investiții", path: "/partnership", also: ["/offer"] },
    { label: "Despre noi", path: "/about", also: ["/history"] },
    { label: "Contact", path: "/contact" },
  ],
  ru: [
    { label: "Проекты", path: "/projects" },
    { label: "Аренда", path: "/leasing" },
    { label: "Инвестиции", path: "/partnership", also: ["/offer"] },
    { label: "О компании", path: "/about", also: ["/history"] },
    { label: "Контакты", path: "/contact" },
  ],
  en: [
    { label: "Projects", path: "/projects" },
    { label: "Leasing", path: "/leasing" },
    { label: "Investment", path: "/partnership", also: ["/offer"] },
    { label: "About", path: "/about", also: ["/history"] },
    { label: "Contact", path: "/contact" },
  ],
};

/** Utility routes — header (quiet group), mobile menu and footer: offer a property, careers. */
export const utilityNavigation: Record<SiteLocale, NavItem[]> = {
  ro: [{ label: "Propuneți un obiect", path: "/offer" }, { label: "Cariere", path: "/careers" }],
  ru: [{ label: "Предложить объект", path: "/offer" }, { label: "Вакансии", path: "/careers" }],
  en: [{ label: "Offer a property", path: "/offer" }, { label: "Careers", path: "/careers" }],
};

/** Secondary routes (mobile menu, footer): the company history. */
export const secondaryNavigation: Record<SiteLocale, NavItem[]> = {
  ro: [{ label: "Istoric", path: "/history" }],
  ru: [{ label: "История", path: "/history" }],
  en: [{ label: "History", path: "/history" }],
};

export const ui = {
  menu: { ro: "Meniu", ru: "Меню", en: "Menu" },
  closeMenu: { ro: "Închide meniul", ru: "Закрыть меню", en: "Close menu" },
  openMenu: { ro: "Deschide meniul", ru: "Открыть меню", en: "Open menu" },
  languages: { ro: "Limbi", ru: "Языки", en: "Languages" },
  navigation: { ro: "Navigație principală", ru: "Основная навигация", en: "Primary navigation" },
  mobileNavigation: { ro: "Navigație mobilă", ru: "Мобильная навигация", en: "Mobile navigation" },
  secondaryNavigation: { ro: "Navigație secundară", ru: "Дополнительная навигация", en: "Secondary navigation" },
  home: { ro: "Acasă", ru: "Главная", en: "Home" },
  exploreAsset: { ro: "Vezi obiectul", ru: "Открыть объект", en: "View property" },
  exploreProject: { ro: "Vezi proiectul", ru: "Открыть проект", en: "View project" },
  photoPending: { ro: "Fotografie în pregătire", ru: "Фотография готовится", en: "Photography in preparation" },
  onRequest: { ro: "Informații suplimentare la cerere", ru: "Дополнительная информация по запросу", en: "Additional information on request" },
  location: { ro: "Localizare", ru: "Расположение", en: "Location" },
  status: { ro: "Status", ru: "Статус", en: "Status" },
  use: { ro: "Destinație", ru: "Назначение", en: "Use" },
  availability: { ro: "Disponibilitate", ru: "Доступность", en: "Availability" },
  totalArea: { ro: "Suprafață", ru: "Площадь", en: "Area" },
  availableFrom: { ro: "Disponibil din", ru: "Доступно с", en: "Available from" },
  nextAsset: { ro: "Următorul obiect", ru: "Следующий объект", en: "Next property" },
  nextProject: { ro: "Următorul proiect", ru: "Следующий проект", en: "Next project" },
  allAssets: { ro: "Toate obiectele", ru: "Все объекты", en: "All properties" },
  scroll: { ro: "Derulează", ru: "Листайте", en: "Scroll" },
  requestDetails: { ro: "Solicită detalii", ru: "Запросить детали", en: "Request details" },
  discussAsset: { ro: "Discută despre acest obiect", ru: "Обсудить объект", en: "Discuss this property" },
  discussProject: { ro: "Discută despre proiect", ru: "Обсудить проект", en: "Discuss the project" },
  contactUs: { ro: "Contactează-ne", ru: "Связаться с нами", en: "Contact us" },
  viewProjects: { ro: "Vezi proiectele", ru: "Смотреть проекты", en: "View the projects" },
  concept: { ro: "Concept în discuție", ru: "Концепция", en: "Concept" },
  siteArea: { ro: "Suprafața terenului", ru: "Площадь участка", en: "Site area" },
  developer: { ro: "Dezvoltator", ru: "Девелопер", en: "Developer" },
  stage: { ro: "Etapă", ru: "Стадия", en: "Stage" },
  page404: { ro: "Pagina nu există.", ru: "Страница не найдена.", en: "Page not found." },
  back404: { ro: "Înapoi la MEGAPARC", ru: "Вернуться на MEGAPARC", en: "Back to MEGAPARC" },
} satisfies Record<string, Localized>;
