import { T, type CostRow, type Fact, type LeasingExperience, type Photo, type TechRow } from "@/data/leasing-experience-model";
import { publicAsset } from "@/lib/site-data";

/**
 * SHARED PARTS OF THE LEASING DATASETS — OWNER «LEASING TEMPLATE LOCK» (2026-11-10). The words every dataset says the
 * same way (the drawers, the one public line on terms, the tenant's own scope, the «confirmed with the Technical
 * Director and the Architect» state). Moscova 20 keeps its own master record; Moscova 9, Dacia 31 and Creangă 78 use
 * these so the copy is written once. Property facts never live here.
 */

export const OWNER_TEAM = "OWNER «LEASING TEMPLATE LOCK» §2 (2026-11-10) — missing technical data stays a state, never a value";

/** A real OWNER photograph from the portfolio library — the one file at its own width (no crop presented as a second photograph). */
export const portfolioPhoto = (id: string, file: string, width: number, height: number, alt: ReturnType<typeof T>, position?: string): Photo => ({
  id,
  src: publicAsset(`/assets/portfolio/${file}.webp`),
  small: publicAsset(`/assets/portfolio/${file}.webp`),
  smallWidth: width,
  width,
  height,
  alt,
  ...(position ? { position } : {}),
  evidence: "OWNER_CONFIRMED",
  source: "OWNER photograph — portfolio library (src/lib/assets.ts media)",
});

/** «Подтверждается совместно с техническим директором и архитектором» — the brief's wording for a technical value not yet confirmed. */
export const withTeam = T("Se confirmă împreună cu directorul tehnic și arhitectul", "Подтверждается совместно с техническим директором и архитектором", "Confirmed together with the Technical Director and the Architect");
export const teamRow = (key: string, label: ReturnType<typeof T>): TechRow => ({ key, label, value: withTeam, state: "confirm", evidence: "TO_CONFIRM", source: OWNER_TEAM });

export const fact = (text: ReturnType<typeof T>, evidence: Fact["evidence"], source: string): Fact => ({ text, evidence, source });

export const sharedDrawers: LeasingExperience["drawers"] = {
  tech: { title: T("Caracteristici tehnice", "Технические характеристики", "Technical characteristics"), lead: T("Doar parametrii importanți. Ce nu este confirmat este marcat ca atare.", "Только важные параметры. Неподтверждённое так и отмечено.", "Only the parameters that matter. Anything unconfirmed is marked as such.") },
  readiness: { title: T("Pregătire pentru lansare", "Готовность к запуску", "Ready to open"), lead: T("Ce mai clarificăm pentru afacerea dumneavoastră și din ce se compune lansarea.", "Что ещё уточняем под ваш бизнес и из чего складывается запуск.", "What we still confirm for your business and what opening involves.") },
};

/** The one public line on terms — topics only, never values (AGENTS.md: no public rent or payment terms). */
export const sharedTerms: LeasingExperience["terms"] = {
  title: T("Condiții de închiriere", "Условия аренды", "Lease terms"),
  pending: T("Condițiile comerciale se transmit după o primă verificare a formatului afacerii.", "Коммерческие условия предоставляются после первичной проверки формата бизнеса.", "Commercial terms are provided after a first check of the business format."),
  covers: [T("chiria", "ставка", "rent"), T("TVA și utilitățile", "НДС и коммунальные платежи", "VAT and utilities"), T("cheltuielile de exploatare", "эксплуатационные расходы", "service costs"), T("perioada de amenajare", "период на отделку", "fit-out period"), T("indexarea", "индексация", "indexation"), T("durata contractului", "срок договора", "lease term"), T("firma", "вывеска", "signage"), T("starea la predare", "состояние при передаче", "handover condition")],
  rows: [],
};

/** What opening involves — the tenant's own scope; no statement about the building's capital works (confirmed only for Moscova 20). */
export const sharedCost: CostRow[] = [
  { key: "fitout", label: T("Amenajare pentru concept", "Отделка под концепцию", "Fit-out for the concept"), state: "concept", note: T("După concept", "По концепции", "By concept") },
  { key: "equipment", label: T("Echipamente", "Оборудование", "Equipment"), state: "tenant", note: T("Chiriașul", "Арендатор", "Tenant") },
  { key: "branding", label: T("Branding și firmă", "Брендинг и вывеска", "Branding and signage"), state: "tenant", note: T("Chiriașul", "Арендатор", "Tenant") },
  { key: "engineering", label: T("Inginerie specială", "Специальная инженерия", "Special engineering"), state: "if-needed", note: T("Dacă formatul o cere", "Если требует формат", "If the format needs it") },
  { key: "it", label: T("IT și comunicații", "IT и связь", "IT and communications"), state: "tenant", note: T("Chiriașul", "Арендатор", "Tenant") },
];

/** The tenant's own scope in the dark scene — the same five words as on Moscova 20. */
export const sharedTenantScope: Fact[] = [
  fact(T("Brandul", "Бренд", "The brand"), "OWNER_CONFIRMED", "OWNER final viewing conversion pass 2026-11-06 (tenant scope)"),
  fact(T("Echipamentele", "Оборудование", "Equipment"), "OWNER_CONFIRMED", "OWNER final viewing conversion pass 2026-11-06 (tenant scope)"),
  fact(T("Mobilierul", "Мебель", "Furniture"), "OWNER_CONFIRMED", "OWNER final viewing conversion pass 2026-11-06 (tenant scope)"),
  fact(T("Interiorul", "Интерьер", "The interior"), "OWNER_CONFIRMED", "OWNER final viewing conversion pass 2026-11-06 (tenant scope)"),
  fact(T("Adaptarea specializată", "Специализированная адаптация", "Specialised adaptation"), "OWNER_CONFIRMED", "OWNER final viewing conversion pass 2026-11-06 (tenant scope)"),
];

/** The section words of «Какой бизнес вы рассматриваете?» (OWNER copy 2026-11-10, as on Moscova 20). */
export const sharedLens = {
  kicker: T("Formatul dumneavoastră", "Ваш формат", "Your format"),
  title: T("Ce afacere luați în considerare?", "Какой бизнес вы рассматриваете?", "Which business are you considering?"),
  lead: T("Aceleași caracteristici ale obiectului — cerințe diferite față de spațiu. Alegeți formatul ca să vedeți la ce merită să fiți atenți tocmai în cazul dumneavoastră.", "Те же характеристики объекта — разные требования к помещению. Выберите формат, чтобы увидеть, на что стоит обратить внимание именно в вашем случае.", "The same property characteristics — different requirements for the space. Choose a format to see what deserves attention in your case."),
  evidenceTitle: T("De ce se poate potrivi formatul", "Почему формат может подойти", "Why the format may fit"),
  checksTitle: T("Ce este important de verificat înainte de decizie", "Что важно проверить до принятия решения", "What to check before you decide"),
  scenarioNote: T("Scenariu posibil de organizare", "Возможный сценарий организации", "A possible way to organise it"),
  honesty: T("Dacă obiectul se potrivește ca locație și format, următorul pas este verificarea fezabilității tehnice a scenariului dumneavoastră.", "Если объект подходит по локации и формату, следующим шагом проверим техническую реализуемость вашего сценария.", "If the property suits you in location and format, the next step is to check the technical feasibility of your scenario."),
  regulated: T("Pentru formatele reglementate — clinici, servicii medicale, alimentație publică și alte activități — se verifică suplimentar cerințele tehnice speciale și cele de autorizare.", "Для регулируемых форматов — клиники, медицинских услуг, общепита и других видов деятельности — дополнительно проверяются специальные технические и разрешительные требования.", "For regulated formats — clinics, medical services, food service and other activities — special technical and permit requirements are checked as well."),
};

export const sharedPlans = {
  kicker: T("Planuri și suprafețe", "Планы и площади", "Plans and areas"),
  title: T("Planurile se oferă la cerere.", "Планы предоставляются по запросу.", "Plans available on request."),
  schemeTab: T("Schema generală", "Общая схема", "Overview"),
};

export const sharedStory = {
  kicker: T("Fotografii", "Фотографии", "Photographs"),
  lead: T("O fotografie reală — arhitectura fără schimbări. Celelalte cadre le arătăm la vizionare.", "Реальная фотография — архитектура без изменений. Остальное покажем на просмотре.", "A real photograph — the architecture unchanged. The rest we show at the viewing."),
};

export const contactsLine = T("Sau direct:", "Или напрямую:", "Or directly:");

export const sharedMotion = {
  ecosystemTitle: T("Ce creează activitate regulată în jurul locației", "Что создаёт регулярную активность вокруг локации", "What creates regular activity around the location"),
  mapTab: T("Împrejurimi", "Окружение", "Surroundings"),
  mapCaption: T("Stațiile de transport public din apropiere — date © OpenStreetMap.", "Ближайшие остановки общественного транспорта — данные © OpenStreetMap.", "The nearby public transport stops — data © OpenStreetMap."),
  visibilityTab: T("Unde se află", "Где находится", "Where it is"),
  transport: {
    title: T("Stații de transport public în apropiere", "Остановки общественного транспорта рядом", "Public transport stops nearby"),
    text: T("Stațiile din jurul obiectului sunt marcate pe hartă (OpenStreetMap). Nu publicăm cifre de flux fără o numărătoare pe teren.", "Остановки вокруг объекта отмечены на карте (OpenStreetMap). Цифры потока без полевого замера не публикуем.", "The stops around the property are marked on the map (OpenStreetMap). No flow figures are published without a field count."),
  },
};
