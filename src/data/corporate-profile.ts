import { publicAsset, type Localized } from "@/lib/site-data";

/**
 * MEGAPARC · CORPORATE PROFILE 2026 (OWNER «AUTONOMOUS WEEKEND MANDATE · COMMERCIAL BRAND PACK 2026» §9, 2026-11-20) — the presentation
 * PDF for tenants, partners, investors, banks and suppliers, RO / RU / EN. This file holds the document's name, its headings and the
 * connecting lines only. Every fact is read from the site's own sources (src/lib/business.ts, src/lib/history.ts, src/lib/portfolio.ts,
 * src/data/demo-content.ts, the property datasets, src/data/moscova-20-commercial.ts), exactly as the pages show them — no yield,
 * value, occupancy rate, tenant count, investment volume or unverified area is added. The vision and the mission are the approved
 * texts of Brand Guidelines 2026 v1.0.1, p. 3 (OWNER A8; RO verbatim, RU / EN translated with the same meaning).
 */
const N = "\u00a0";
export const corporateProfile = {
  /** the document's name — the PDF title, the download card */
  name: { ro: "MEGAPARC — Profil corporativ 2026", ru: `MEGAPARC${N}— Корпоративный профиль 2026`, en: "MEGAPARC — Corporate Profile 2026" },
  title: { ro: "Profil\ncorporativ", ru: "Корпоративный\nпрофиль", en: "Corporate\nProfile" },
  year: "2026",
  pages: 12,
  /** the download on the About page (one quiet row in the existing composition) */
  card: {
    label: { ro: "Profil corporativ", ru: "Корпоративный профиль", en: "Corporate profile" },
    title: { ro: "MEGAPARC — Profil corporativ 2026", ru: `MEGAPARC${N}— Корпоративный профиль 2026`, en: "MEGAPARC — Corporate Profile 2026" },
    text: {
      ro: "Compania, direcțiile, istoria și portofoliul — într-un singur document pentru chiriași, parteneri, investitori și bănci.",
      ru: `Компания, направления, история и${N}портфель${N}— в${N}одном документе для${N}арендаторов, партнёров, инвесторов и${N}банков.`,
      en: "The company, its lines of business, history and portfolio — in one document for tenants, partners, investors and banks.",
    },
    cta: { ro: "Descărcați profilul corporativ", ru: "Скачать корпоративный профиль", en: "Download the corporate profile" },
    meta: { ro: "PDF · {pages} pagini · română", ru: "PDF · {pages} страниц · русский", en: "PDF · {pages} pages · English" },
  },
  file: {
    ro: publicAsset("/assets/documents/MEGAPARC-Corporate-Profile-2026-RO.pdf"),
    ru: publicAsset("/assets/documents/MEGAPARC-Corporate-Profile-2026-RU.pdf"),
    en: publicAsset("/assets/documents/MEGAPARC-Corporate-Profile-2026-EN.pdf"),
  } satisfies Localized,
  footer: { ro: "MEGAPARC · Profil corporativ 2026", ru: "MEGAPARC · Корпоративный профиль 2026", en: "MEGAPARC · Corporate Profile 2026" },
  sections: {
    about: { ro: "Despre companie", ru: "О\u00a0компании", en: "About the company" },
    directions: { ro: "Direcții", ru: "Направления", en: "Lines of business" },
    history: { ro: "Istorie", ru: "История", en: "History" },
    portfolio: { ro: "Portofoliu", ru: "Портфель", en: "Portfolio" },
    property: { ro: "Imobil în exploatare", ru: "Действующий объект", en: "Operating property" },
    development: { ro: "Dezvoltarea proiectelor", ru: "Развитие проектов", en: "Project development" },
    tenants: { ro: "Lucrul cu chiriașii", ru: "Работа с\u00a0арендаторами", en: "Working with tenants" },
    contacts: { ro: "Contacte", ru: "Контакты", en: "Contacts" },
  },
  about: {
    title: { ro: "Investiții.\nDezvoltare.\nÎnchiriere.", ru: "Инвестиции.\nДевелопмент.\nАренда.", en: "Investment.\nDevelopment.\nLeasing." },
    lead: {
      ro: "Compania a fost fondată în 2005 și lucrează doar cu propriile imobile — de la achiziție la închiriere și exploatare.",
      ru: `Компания основана в${N}2005${N}году и${N}работает только со${N}своими объектами${N}— от${N}покупки до${N}аренды и${N}эксплуатации.`,
      en: "Founded in 2005, the company works only with its own properties — from acquisition to leasing and operation.",
    },
    visionLabel: { ro: "Viziunea", ru: "Видение", en: "Vision" },
    vision: {
      ro: "Să devenim un investitor și dezvoltator de referință la nivel regional, recunoscut pentru proiecte solide, sustenabile și bine gândite, care contribuie la dezvoltarea economică și la creșterea calității vieții.",
      ru: `Стать инвестором и${N}девелопером, на${N}которого ориентируются в${N}регионе,${N}— известным надёжными, устойчивыми и${N}продуманными проектами, которые способствуют развитию экономики и${N}повышению качества жизни.`,
      en: "To become a benchmark investor and developer in the region, recognised for solid, sustainable and well-conceived projects that contribute to economic development and a better quality of life.",
    },
    missionLabel: { ro: "Misiunea", ru: "Миссия", en: "Mission" },
    mission: {
      ro: "Misiunea noastră este să investim responsabil în proprietăți imobiliare, să dezvoltăm proiecte proprii și să oferim spații comerciale funcționale, creând valoare durabilă pentru parteneri și comunitate.",
      ru: `Наша миссия${N}— ответственно инвестировать в${N}недвижимость, развивать собственные проекты и${N}предлагать функциональные коммерческие пространства, создавая долгосрочную ценность для${N}партнёров и${N}общества.`,
      en: "Our mission is to invest responsibly in real estate, develop our own projects and offer functional commercial space, creating lasting value for our partners and the community.",
    },
    photoCaption: { ro: "Dacia 31 · Chișinău", ru: `Dacia${N}31 · Кишинэу`, en: "Dacia 31 · Chișinău" },
  },
  directions: {
    title: { ro: "Trei direcții,\nun singur proprietar.", ru: "Три направления,\nодин собственник.", en: "Three lines of business,\none owner." },
  },
  history: {
    megaparc: { ro: "MEGAPARC", ru: "MEGAPARC", en: "MEGAPARC" },
    group: { ro: "Grupul", ru: "Группа", en: "The group" },
  },
  portfolio: {
    title: { ro: "Clădiri și terenuri proprii.", ru: `Собственные здания и${N}земля.`, en: "Our own buildings and land." },
    operating: { ro: "imobile în exploatare", ru: "действующих объекта", en: "operating properties" },
    area: { ro: "suprafața imobilelor în exploatare", ru: "площадь действующих объектов", en: "operating property area" },
    land: { ro: "terenuri", ru: "земли", en: "of land" },
    projects: { ro: "proiecte de dezvoltare", ru: "проекта развития", en: "development projects" },
    leasing: { ro: "Imobile în exploatare", ru: "Действующие объекты", en: "Operating properties" },
    landTitle: { ro: "Terenuri pentru dezvoltare", ru: "Земля под\u00a0развитие", en: "Land for development" },
    devTitle: { ro: "Proiecte de dezvoltare", ru: "Проекты развития", en: "Development projects" },
    areaNote: {
      ro: "Suprafața imobilelor în exploatare — cifra internă publicată de MEGAPARC; nu este o suprafață cadastrală.",
      ru: `Площадь действующих объектов${N}— внутренний показатель MEGAPARC, а${N}не${N}кадастровая площадь.`,
      en: "Operating property area — MEGAPARC's internal published figure, not a cadastral area.",
    },
    onRequest: { ro: "parametrii terenului se verifică", ru: `параметры участка уточняются`, en: "the plot parameters are under verification" },
  },
  property: {
    area: { ro: "Suprafața imobilului", ru: "Площадь объекта", en: "Property area" },
    offered: { ro: "Oferit spre închiriere", ru: "Предлагается в\u00a0аренду", en: "Offered for lease" },
    status: { ro: "Statut", ru: "Статус", en: "Status" },
    registered: { ro: "Suprafață înregistrată", ru: "Зарегистрированная площадь", en: "Registered area" },
    address: { ro: "Adresa", ru: "Адрес", en: "Address" },
    rates: { ro: "Tarife de închiriere", ru: "Ставки аренды", en: "Rental rates" },
    proposal: { ro: "Oferta comercială completă — pe site, în Leasing Pack.", ru: `Полное коммерческое предложение${N}— на${N}сайте, в${N}Leasing Pack.`, en: "The full commercial leasing proposal — on the website, in the Leasing Pack." },
  },
  development: {
    title: { ro: "De la teren — la un imobil care funcționează.", ru: `От${N}участка${N}— к${N}работающему объекту.`, en: "From a site to a working property." },
    stagesLabel: { ro: "Etapele proiectului", ru: "Этапы проекта", en: "Project stages" },
    whatLabel: { ro: "Ce achiziționăm", ru: "Что\u00a0приобретаем", en: "What we acquire" },
    criteriaLabel: { ro: "Ce verificăm", ru: "Что\u00a0проверяем", en: "What we check" },
    vatraCaption: { ro: "VATRA · proiect în implementare", ru: "VATRA · проект в\u00a0реализации", en: "VATRA · project in progress" },
  },
  tenants: {
    principlesLabel: { ro: "Patru reguli de proprietar", ru: "Четыре правила собственника", en: "Four ownership principles" },
  },
  contacts: {
    title: { ro: "Să discutăm\nproiectul dumneavoastră.", ru: "Обсудим\nваш проект.", en: "Let's discuss\nyour project." },
    lead: {
      ro: "Închiriere, investiții și parteneriat, propunerea unui imobil sau a unui teren — scrieți-ne sau sunați.",
      ru: `Аренда, инвестиционное партнёрство, предложение объекта или${N}земли${N}— напишите или${N}позвоните нам.`,
      en: "Leasing, investment partnership, offering a property or land — write to us or call.",
    },
    site: { ro: "www.megaparc.md", ru: "www.megaparc.md", en: "www.megaparc.md" },
    qr: { ro: "Despre MEGAPARC pe site", ru: "О\u00a0компании на\u00a0сайте", en: "About MEGAPARC online" },
  },
} as const;
