import type { Localized, SiteLocale } from "@/lib/site-data";

/**
 * MEGAPARC BUSINESS MODEL — OWNER correction 2026-10-08 ("CRITICAL BUSINESS
 * MODEL CORRECTION"). Authoritative public model:
 *
 *   ACQUIRE → DEVELOP / REDEVELOP / REVITALISE → LEASE OUR OWN REAL ESTATE →
 *   OPERATE OUR OWN PROPERTY AS OWNER → HOLD OR SELL → REINVEST
 *
 * MEGAPARC is NOT a third-party asset manager. It buys existing real estate
 * and land, develops its own projects, renovates and repositions property it
 * owns, leases its own commercial space, operates its own buildings, may sell
 * an asset when that is the right decision, and reinvests.
 * Internal operating work is described as PROPERTY OPERATIONS / LEASING &
 * OPERATIONS of owned property — never as an asset-management service.
 * Not every asset is for sale; the sale step is a decision, not an offer.
 */

export type Titled = { title: Localized; text: Localized };

/** The three public verbs — the first thing every visitor reads. */
export const verbs: Record<SiteLocale, [string, string, string]> = {
  ro: ["Cumpărăm.", "Dezvoltăm.", "Închiriem."],
  ru: ["Покупаем.", "Развиваем.", "Сдаём в аренду."],
  en: ["We acquire.", "We develop.", "We lease."],
};

/** Short positioning line (header menu, footer, metadata) — the three business directions. */
export const positioning: Localized = {
  ro: "Investiții · Dezvoltare · Închiriere",
  ru: "Инвестиции · Девелопмент · Аренда",
  en: "Investment · Development · Leasing",
};

/** The three directions as display lines (footer, About hero). */
export const directionLines: Record<SiteLocale, [string, string, string]> = {
  ro: ["Investiții.", "Dezvoltare.", "Închiriere."],
  ru: ["Инвестиции.", "Девелопмент.", "Аренда."],
  en: ["Investment.", "Development.", "Leasing."],
};

/** The model in one sentence (OWNER wording, adapted per language). */
export const businessStatement: Localized = {
  ro: "MEGAPARC investește în imobiliare și terenuri, dezvoltă proiecte proprii și închiriază spații comerciale.",
  ru: "MEGAPARC инвестирует в недвижимость и землю, развивает собственные проекты и сдаёт коммерческие площади в аренду.",
  en: "MEGAPARC invests in real estate and land, develops its own projects and leases commercial space.",
};

/**
 * THREE BUSINESS DIRECTIONS — OWNER brief 2026-10-08 ("BUSINESS MODEL + PREMIUM
 * COLOR SYSTEM RESET"). The public business level: investment · development ·
 * leasing. The six-step lifecycle (acquire … reinvest) is no longer a public
 * presentation; hold-or-sell and reinvestment live only as supporting copy.
 */
export type DirectionKey = "investment" | "development" | "leasing";
export type Direction = { key: DirectionKey; no: string; title: Localized; statement: Localized; text: Localized; short: Localized };

export const directions: Direction[] = [
  {
    key: "investment",
    no: "01",
    title: { ro: "Investiții imobiliare", ru: "Инвестиции в недвижимость", en: "Real estate investment" },
    statement: { ro: "Căutăm potențialul în imobiliare.", ru: "Ищем потенциал в недвижимости.", en: "We look for potential in real estate." },
    text: {
      ro: "Achiziționăm imobile comerciale și terenuri în care vedem potențial de dezvoltare și de creștere a valorii pe termen lung.",
      ru: "Приобретаем коммерческие объекты и\u00a0земельные участки, в\u00a0которых видим возможности для\u00a0развития и\u00a0роста стоимости в\u00a0долгосрочной перспективе.",
      en: "We acquire commercial property and land where we see room for development and long-term value.",
    },
    short: {
      ro: "Achiziționăm obiecte comerciale și terenuri cu potențial de dezvoltare.",
      ru: "Приобретаем коммерческие объекты и земельные участки с потенциалом развития.",
      en: "We acquire commercial property and land with development potential.",
    },
  },
  {
    key: "development",
    no: "02",
    title: { ro: "Dezvoltare", ru: "Девелопмент", en: "Development" },
    statement: { ro: "Transformăm potențialul în proiecte care funcționează.", ru: "Превращаем потенциал в работающий проект.", en: "We turn potential into projects that work." },
    text: {
      ro: "Construim, reconstruim și adaptăm imobilele la nevoile reale ale pieței.",
      ru: "Строим, реконструируем и адаптируем недвижимость под реальные потребности рынка.",
      en: "We build, redevelop and adapt property to what the market really needs.",
    },
    short: {
      ro: "Construim proiecte noi, reconstruim clădiri existente și punem în valoare potențialul imobilelor.",
      ru: "Строим новые проекты, реконструируем существующие здания и раскрываем потенциал недвижимости.",
      en: "We build new projects, redevelop existing buildings and unlock the potential of property.",
    },
  },
  {
    key: "leasing",
    no: "03",
    title: { ro: "Închiriere", ru: "Аренда", en: "Leasing" },
    statement: { ro: "Spații în care funcționează afacerile.", ru: "Пространства, в которых работает бизнес.", en: "Spaces where businesses operate." },
    text: {
      ro: "Închiriem spații comerciale în imobilele MEGAPARC și creăm condiții pentru activitatea pe termen lung a chiriașilor.",
      ru: "Сдаём коммерческие площади в объектах MEGAPARC и создаём условия для долгосрочной работы арендаторов.",
      en: "We lease commercial space in MEGAPARC properties and create the conditions for tenants to stay for the long term.",
    },
    short: {
      ro: "Creăm spații comerciale pentru afaceri și închiriem suprafețe în obiectele MEGAPARC.",
      ru: "Создаём коммерческие пространства для бизнеса и сдаём площади в объектах MEGAPARC.",
      en: "We create commercial space for business and lease it in MEGAPARC properties.",
    },
  },
];

/** Supporting logic — never a fourth business line. Public wording names the further strategy, not "hold or sell" (OWNER trust copy patch 2026-10-09). */
export const holdOrSell: Localized = {
  ro: "Strategia pentru fiecare imobil o stabilim în funcție de profilul chiriașilor, de potențialul acestuia și de condițiile pieței.",
  ru: "Стратегию по\u00a0каждому объекту определяем с\u00a0учётом профиля аренды, потенциала объекта и\u00a0ситуации на\u00a0рынке.",
  en: "We set each property's strategy based on its tenant profile, its potential and market conditions.",
};

export const reinvestment: Localized = {
  ro: "Capitalul obținut îl reinvestim în proiectele existente și în proiecte noi.",
  ru: "Полученный капитал вкладываем в\u00a0развитие действующих объектов и\u00a0в\u00a0новые проекты.",
  en: "Capital released is put back into existing and new projects.",
};

export type LifecycleStage = { key: "acquire" | "develop" | "lease" | "operate" | "decide" | "reinvest"; title: Localized; short: Localized; text: Localized };

/**
 * Lifecycle of an owned asset. The order is the model; "decide" = hold or sell.
 * `short` is the one-line subtitle under each verb (OWNER microcopy addendum
 * 2026-10-08: short, natural, never technical); `text` is the supporting
 * sentence shown with the active stage. Stage 04 keeps the key "operate" but
 * reads «Поддерживаем» — the owner looks after its buildings and tenants.
 */
export const lifecycle: LifecycleStage[] = [
  {
    key: "acquire",
    title: { ro: "Cumpărăm", ru: "Покупаем", en: "Acquire" },
    short: { ro: "Clădiri și terenuri", ru: "Здания и землю", en: "Buildings and land" },
    text: {
      ro: "Clădiri comerciale\u00a0— în exploatare sau care au nevoie de o nouă viață\u00a0— și terenuri pentru dezvoltare.",
      ru: "Коммерческие здания — действующие и те, которым нужна новая жизнь, — и участки под развитие.",
      en: "Commercial buildings\u00a0— operating ones and ones that need a new life\u00a0— and land for development.",
    },
  },
  {
    key: "develop",
    title: { ro: "Dezvoltăm", ru: "Развиваем", en: "Develop" },
    short: { ro: "Construim, reconstruim, regândim", ru: "Строим, реконструируем, переосмысливаем", en: "Build, rebuild, reimagine" },
    text: {
      ro: "Construim proiecte proprii, renovăm clădirile noastre și le dăm funcții noi.",
      ru: "Строим собственные проекты, реконструируем и перепрофилируем свои здания.",
      en: "We build our own projects and renovate and reposition the buildings we own.",
    },
  },
  {
    key: "lease",
    title: { ro: "Închiriem", ru: "Сдаём в аренду", en: "Lease" },
    short: { ro: "Spații pentru afaceri", ru: "Помещения для бизнеса", en: "Space for business" },
    text: {
      ro: "Spații pentru comerț, birouri și servicii în clădirile noastre.",
      ru: "Торговые, офисные и сервисные помещения в наших зданиях.",
      en: "Retail, office and service space in our own buildings.",
    },
  },
  {
    key: "operate",
    title: { ro: "Avem grijă", ru: "Поддерживаем", en: "Look after" },
    short: { ro: "De clădiri și de chiriași", ru: "Качество зданий и комфорт арендаторов", en: "Building quality and tenant comfort" },
    text: {
      ro: "Ne ocupăm singuri de clădirile noastre: întreținere, relația cu chiriașii, investiții în îmbunătățiri.",
      ru: "Сами обслуживаем свои здания, работаем с арендаторами и вкладываем в улучшения.",
      en: "We look after our buildings ourselves: maintenance, tenants, investment in improvements.",
    },
  },
  {
    key: "decide",
    title: { ro: "Păstrăm sau vindem", ru: "Держим или продаём", en: "Hold or sell" },
    short: { ro: "În funcție de strategia obiectului", ru: "Исходя из стратегии объекта", en: "Guided by each asset's strategy" },
    text: {
      ro: "Majoritatea obiectelor le păstrăm pe termen lung. Vindem atunci când strategia o cere.",
      ru: "Большинство объектов держим долго. Продаём, когда этого требует стратегия.",
      en: "Most assets we hold for the long term. We sell when the strategy calls for it.",
    },
  },
  {
    key: "reinvest",
    title: { ro: "Reinvestim", ru: "Реинвестируем", en: "Reinvest" },
    short: { ro: "În proiecte noi", ru: "В новые проекты", en: "In new projects" },
    text: {
      ro: "Capitalul lucrează din nou — în clădiri, terenuri și proiecte noi.",
      ru: "Капитал снова работает — в новых зданиях, участках и проектах.",
      en: "Capital goes to work again — in new buildings, land and projects.",
    },
  },
];

/** What MEGAPARC buys — the Offer a property page and its form. */
export const acquisitionTypes: { key: "operating" | "redevelop" | "land" | "project"; title: Localized; text: Localized }[] = [
  {
    key: "operating",
    title: { ro: "Clădiri comerciale în exploatare", ru: "Действующие коммерческие здания", en: "Operating commercial buildings" },
    text: { ro: "Retail, birouri, servicii\u00a0— clădiri care funcționează deja sau ar putea funcționa mai bine.", ru: "Торговля, офисы, сфера услуг\u00a0— здания, которые уже работают или могут работать лучше.", en: "Retail, offices, services\u00a0— buildings that already perform or could perform better." },
  },
  {
    key: "redevelop",
    title: { ro: "Clădiri de renovat sau repoziționat", ru: "Здания под реконструкцию", en: "Buildings to renovate or reposition" },
    text: { ro: "Clădiri vechi sau goale, cu locație bună, care merită o nouă funcție.", ru: "Старые или пустующие здания в хорошем месте, которым нужна новая функция.", en: "Old or empty buildings in a good location that deserve a new use." },
  },
  {
    key: "land",
    title: { ro: "Terenuri pentru dezvoltare", ru: "Земля под развитие", en: "Land for development" },
    text: { ro: "Terenuri în oraș sau la intrarea în oraș, cu acces și potențial clar.", ru: "Участки в городе или на въезде в город — с подъездом и понятным потенциалом.", en: "Plots in the city or on its approaches, with road access and clear potential." },
  },
  {
    key: "project",
    title: { ro: "Proiecte începute", ru: "Начатые проекты", en: "Projects already started" },
    text: { ro: "Proiecte cu autorizații sau construcție începută, care au nevoie de un proprietar nou.", ru: "Проекты с разрешениями или начатым строительством, которым нужен новый владелец.", en: "Projects with permits or construction under way that need a new owner." },
  },
];

/** What MEGAPARC checks first when an owner offers a property or land. */
export const acquisitionCriteria: Localized[] = [
  { ro: "Locația și accesul", ru: "Локация и подъезд", en: "Location and access" },
  { ro: "Situația juridică clară", ru: "Чистая юридическая ситуация", en: "A clear legal position" },
  { ro: "Starea tehnică", ru: "Техническое состояние", en: "Technical condition" },
  { ro: "Cererea chiriașilor în zonă", ru: "Спрос арендаторов в районе", en: "Tenant demand in the area" },
  { ro: "Ce poate deveni imobilul", ru: "Чем объект может стать", en: "What the property could become" },
  { ro: "Prețul și termenul", ru: "Цена и сроки", en: "Price and timing" },
];

/**
 * Where MEGAPARC looks. OWNER override 2026-09-26 (global mandate) remains:
 * the verified portfolio is in Moldova; offers from other countries are
 * considered. No foreign offices, holdings, ticket sizes or allocations.
 */
export const geography = {
  label: { ro: "Unde căutăm", ru: "Где ищем", en: "Where we look" } satisfies Localized,
  text: {
    ro: "Toate imobilele noastre actuale sunt în Republica Moldova. Analizăm și propuneri din alte țări\u00a0— fiecare în parte.",
    ru: "Все наши объекты сегодня — в Молдове. Предложения из других стран тоже рассматриваем.",
    en: "All our current properties are in the Republic of Moldova. We also consider offers from other countries — each on its own merits.",
  } satisfies Localized,
};

/** Property operations of OWNED buildings (never a service to third parties). */
export const operations = {
  label: { ro: "Exploatare proprie", ru: "Собственные здания", en: "Owned property operations" } satisfies Localized,
  title: { ro: "Clădirile noastre le administrăm noi.", ru: "Своими зданиями занимаемся сами.", en: "We run our own buildings ourselves." } satisfies Localized,
  text: {
    ro: "Închirierea, relația cu chiriașii, întreținerea și investițiile în îmbunătățiri sunt asigurate de echipa MEGAPARC\u00a0— doar pentru imobilele MEGAPARC. Nu preluăm în administrare clădirile altor proprietari.",
    ru: "Аренду, обслуживание и улучшения ведёт собственная команда MEGAPARC. Здания других собственников в управление не берём.",
    en: "Leasing, tenant relationships, maintenance and investment in improvements are handled by the MEGAPARC team\u00a0— for MEGAPARC buildings only. We do not manage buildings for other owners.",
  } satisfies Localized,
  points: [
    { ro: "Închiriere și relația cu chiriașii", ru: "Аренда и работа с арендаторами", en: "Leasing and tenant relationships" },
    { ro: "Întreținere și exploatare tehnică", ru: "Обслуживание и инженерные системы", en: "Maintenance and technical operations" },
    { ro: "Renovare și amenajare pentru chiriași", ru: "Ремонт и подготовка помещений под арендаторов", en: "Renovation and fit-out for tenants" },
    { ro: "Planul fiecărei clădiri pe ani", ru: "План по каждому зданию на годы вперёд", en: "A plan for each building, years ahead" },
  ] as Localized[],
};

/** How MEGAPARC decides — principles carried over from the approved strategy, reworded for the owner model. */
export const principles: Titled[] = [
  { title: { ro: "Cumpărăm ce înțelegem", ru: "Покупаем то, что понимаем", en: "We buy what we understand" }, text: { ro: "Locația, clădirea, piața și riscurile — înainte de preț.", ru: "Сначала локация, здание, рынок и\u00a0риски\u00a0— потом цена.", en: "Location, building, market and risks — before price." } },
  { title: { ro: "Funcția înaintea formei", ru: "Функция прежде формы", en: "Function before form" }, text: { ro: "Mai întâi cine va folosi spațiul și cum, apoi arhitectura.", ru: "Сначала — кто и как будет пользоваться пространством, потом архитектура.", en: "First who will use the space and how, then the architecture." } },
  { title: { ro: "Construim pentru exploatare", ru: "Строим для эксплуатации", en: "We build to operate" }, text: { ro: "Exploatăm ceea ce construim, așa că o calitate bună azi înseamnă costuri mai mici mâine.", ru: "Мы сами эксплуатируем то, что строим,\u00a0— поэтому качество сегодня снижает расходы завтра.", en: "Because we run our buildings ourselves, quality today means lower costs tomorrow." } },
  { title: { ro: "Chiriașul trebuie să câștige", ru: "Арендатор должен зарабатывать", en: "The tenant must succeed" }, text: { ro: "Un spațiu bun este cel în care afacerea chiriașului funcționează bine.", ru: "Хорошее помещение\u00a0— то, в\u00a0котором бизнес арендатора приносит доход.", en: "A good space is one where the tenant's business works." } },
];

/** Development process — six stages, used on project pages (index = stage). */
export const developmentStages: { no: string; title: Localized; text: Localized }[] = [
  { no: "01", title: { ro: "Analiză", ru: "Анализ", en: "Analysis" }, text: { ro: "Teren sau clădire existentă: evaluăm locația, destinația și posibilitățile.", ru: "Участок или существующее здание: оцениваем локацию, назначение и возможности.", en: "Site or existing building: we assess location, use and possibilities." } },
  { no: "02", title: { ro: "Concept", ru: "Концепция", en: "Concept" }, text: { ro: "Stabilim destinația, scara și formatul.", ru: "Определяем назначение, масштаб и формат.", en: "We define the use, the scale and the format." } },
  { no: "03", title: { ro: "Evaluare economică", ru: "Экономическая оценка", en: "Economic assessment" }, text: { ro: "Calculăm economia proiectului și verificăm condițiile urbanistice și juridice.", ru: "Считаем экономику, проверяем градостроительные и юридические условия.", en: "We model the economics and check planning and legal conditions." } },
  { no: "04", title: { ro: "Proiectare", ru: "Проектирование", en: "Design" }, text: { ro: "Proiectăm pentru exploatare, nu doar pentru predare.", ru: "Проектируем с расчётом на эксплуатацию, а не только на сдачу.", en: "We design for operation, not just for handover." } },
  { no: "05", title: { ro: "Realizare", ru: "Реализация", en: "Delivery" }, text: { ro: "Construim și controlăm bugetul, termenele și calitatea.", ru: "Строим и контролируем бюджет, сроки и качество.", en: "We build and control budget, schedule and quality." } },
  { no: "06", title: { ro: "Închiriere și exploatare", ru: "Аренда и эксплуатация", en: "Leasing and operation" }, text: { ro: "Clădirea intră în exploatare: chiriași, întreținere, deciziile următoare.", ru: "Объект начинает работать: арендаторы, обслуживание, следующие решения.", en: "The building goes into operation: tenants, maintenance, next decisions." } },
];
