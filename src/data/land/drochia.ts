import { T } from "@/data/leasing-experience-model";
import { drochiaExplorer } from "@/data/land/drochia-explorer";
import { drochiaMarket } from "@/data/land/drochia-market";
import type { DevelopmentScenario, LandAsset } from "@/data/land/model";
import { createLandAsset } from "@/data/land/scaffold";
import { registeredData } from "@/data/registered";

/**
 * DROCHIA — the first dataset of the Land Asset Data Model v2 (OWNER STRATEGIC MANDATE «DROCHIA · DEVELOPMENT & INVESTMENT EXPERIENCE»,
 * 2026-11-23). The page reads only this configuration (src/components/land-experience/*). Since R2 (§7) it is built with the universal
 * factory createLandAsset (src/data/land/scaffold.ts): the standard media, layers, passport, readiness, deals and pack rows come from
 * the template and only the facts Drochia knows better are given here — Hîncești, Orhei and Florilor 32/2 are one such file each.
 *
 * Current published data (§4 — published, NOT a substitute for checking the cadastral documents): 20 000 m² · cadastral number
 * 3601104.441 · bd. Independenței 65, Drochia · frontage on two roads · concept under evaluation (OWNER tax records, LAND brief
 * 2026-11-10; OWNER data 2026-10-09). Everything else is a status: nothing about zoning, permitted use, POT, CUT, height, setbacks,
 * utilities or capacities is known — those rows are null with «необходимо получить». No photograph of the site exists yet: the media
 * slots are empty (never a foreign or generated image presented as the site). MEGAPARC's own figures (land value, internal study areas,
 * target returns) are never stored here.
 */

const NB = String.fromCharCode(160);
const TAX = "OWNER: налоговые записи, 10.11.2026 — опубликованные данные";
const DATA = "OWNER data 2026-10-09 — confirmed";
const day = drochiaExplorer.fetched.split("-").reverse().join(".");
/** the public labels of the sources (the internal provenance stays in `provenance`, never rendered) */
const SRC = {
  tax: T("Date MEGAPARC (evidențe fiscale), publicate", "Данные MEGAPARC (налоговые записи), опубликованы", "MEGAPARC data (tax records), published"),
  data: T("Date MEGAPARC", "Данные MEGAPARC", "MEGAPARC data"),
  osm: T(`OpenStreetMap · ${day}`, `OpenStreetMap · ${day}`, `OpenStreetMap · ${day}`),
};
const reg = registeredData.drochia!;

/** the facts Drochia knows better than the standard rows (src/data/land/scaffold.ts) */
const passportKnown = {
  area: { value: { n: reg.area, unit: "m2" as const }, status: "VERIFYING" as const, source: SRC.tax, provenance: TAX, checked: "2026-11-10" },
  ownership: { value: { text: T("MEGAPARC", "MEGAPARC", "MEGAPARC") }, status: "VERIFYING" as const, source: SRC.data, provenance: DATA, checked: "2026-10-09" },
  frontage: { value: { text: T("Două fronturi stradale; lungimea — după plan", "Выход на две дороги; длина фронта — по плану", "Frontage on two roads; the length — from the plan") }, status: "VERIFYING" as const, source: SRC.data, provenance: DATA, checked: "2026-10-09" },
};
const readinessKnown = {
  extract: { status: "VERIFYING" as const, evidence: T(`Număr, suprafață și proprietar din evidențele fiscale MEGAPARC: 3601104.441 · 20${NB}000 m²`, `Номер, площадь и собственник из налоговых записей MEGAPARC: 3601104.441 · 20${NB}000 м²`, `Number, area and owner from MEGAPARC's tax records: 3601104.441 · 20,000 m²`), checked: "2026-11-10" },
  road: { evidence: T("Două fronturi stradale (date MEGAPARC); în OSM o parte a bulevardului are restricție pentru camioane", "Выход на две дороги (данные MEGAPARC); в OSM часть бульвара отмечена ограничением для грузовиков", "Frontage on two roads (MEGAPARC data); in OSM part of the boulevard carries a truck restriction") },
};

const scenarios: DevelopmentScenario[] = [
  {
    key: "retail-park", model: "hold", preset: "retail", visual: null,
    title: T("Parc comercial", "Торговый комплекс · Retail Park", "Retail park"),
    line: T("Mai mulți chiriași în jurul unei parcări comune.", "Несколько арендаторов вокруг общей парковки.", "Several tenants around a shared car park."),
    audience: [T("Locuitorii orașului și ai raionului", "Жители города и района", "Residents of the town and the district"), T("Rețele de alimentare, bricolaj, electronice, farmacii", "Сети: продукты, стройматериалы, электроника, аптеки", "Chains: food, DIY, electronics, pharmacies"), T("Servicii locale", "Местные услуги", "Local services")],
    logic: T("Un chiriaș-ancoră aduce fluxul, formatele mici îl folosesc. Venitul — din chiria pe termen lung.", "Якорный арендатор формирует поток, малые форматы его используют. Доход — долгосрочная аренда.", "An anchor tenant brings the flow, smaller formats use it. The income — long-term rent."),
    siteNeeds: [T("Vizibilitate de la drum", "Видимость с дороги", "Visibility from the road"), T("Acces comod pentru autoturisme", "Удобный въезд для легковых машин", "Easy car access"), T("Parcare la sol", "Наземная парковка", "Surface parking"), T("Zonă de descărcare pentru ancoră", "Зона разгрузки для якоря", "A loading area for the anchor")],
    access: T("Cele două fronturi permit separarea cumpărătorilor de accesul de marfă — schema se verifică.", "Два выхода к дорогам позволяют развести покупателей и грузовой подъезд — схема проверяется.", "The two road fronts allow shoppers and deliveries to be separated — the scheme is being verified."),
    utilities: [T("Electricitate pentru suprafețe comerciale și frig", "Электричество под торговлю и холодильное оборудование", "Power for retail and refrigeration"), T("Apă și canalizare", "Вода и канализация", "Water and sewerage"), T("Canalizare pluvială pentru parcare", "Ливнёвка для парковки", "Stormwater drainage for the car park")],
    checks: [T("Destinația permisă", "Разрешённое использование", "Permitted use"), T("POT, CUT, cerințele de parcare", "POT, CUT, требования к парковке", "POT, CUT, parking requirements"), T("Accesele și avizul drumului", "Подъезды и согласование дороги", "Access and the road approval"), T("Interesul chiriașilor-ancoră", "Интерес якорных арендаторов", "Anchor tenants' interest")],
    risks: [T("Dependența de chiriașul-ancoră", "Зависимость от якорного арендатора", "Dependence on the anchor tenant"), T("Concurența magazinelor existente", "Конкуренция действующих магазинов", "Competition from existing stores"), T("Durata ocupării", "Срок заполнения", "Time to lease up")],
  },
  {
    key: "logistics", model: "bts", preset: "warehouse", visual: null,
    title: T("Logistică și depozitare", "Логистический или складской комплекс", "Logistics or warehouse"),
    line: T("Spațiu de depozitare pentru un operator concret sau pentru închiriere.", "Склад под конкретного оператора или в аренду.", "A warehouse for a specific operator or to lease."),
    audience: [T("Distribuitori pentru nordul Moldovei", "Дистрибьюторы на север Молдовы", "Distributors serving northern Moldova"), T("Sectorul agricol — păstrare", "Агросектор — хранение", "Agriculture — storage"), T("Curierat și comerț online", "Курьерские службы и онлайн-торговля", "Couriers and online retail"), T("Producători", "Производители", "Manufacturers")],
    logic: T("Clădire de depozitare cu înălțime mare și rampe; build-to-suit pentru un operator sau închiriere în module.", "Склад с высокими потолками и доками; build-to-suit под оператора или аренда модулями.", "A high-bay warehouse with docks; build-to-suit for an operator or leased in modules."),
    siteNeeds: [T("Acces și întoarcere pentru camioane", "Подъезд и разворот фур", "Truck access and turning"), T("Platformă de manevră", "Площадка для манёвров", "A manoeuvring yard"), T("Relief plan, sol portant", "Ровный рельеф, несущий грунт", "Flat ground, bearing soil")],
    access: T("Legătura cu drumurile naționale și cu gara Drochia — distanțele în studiul locației.", "Связь с национальными дорогами и станцией Дрокия — расстояния в исследовании локации.", "Links to the national roads and Drochia station — distances in the location research."),
    utilities: [T("Electricitate pentru iluminat, echipamente, frig la nevoie", "Электричество: освещение, оборудование, холод при необходимости", "Power: lighting, equipment, refrigeration if needed"), T("Apă pentru stingerea incendiilor", "Пожарное водоснабжение", "Fire-fighting water"), T("Canalizare pluvială", "Ливнёвка", "Stormwater drainage")],
    checks: [T("Restricția pentru camioane pe bulevard (marcată în OSM) — se verifică", "Ограничение для грузовиков на бульваре (отмечено в OSM) — проверяется", "The truck restriction on the boulevard (tagged in OSM) — being verified"), T("Admisibilitatea funcției de depozitare lângă locuințe", "Допустимость склада рядом с жильём", "Whether storage is admissible near housing"), T("Traficul de camioane și zgomotul", "Грузовое движение и шум", "Truck traffic and noise"), T("Sarcina pe drumuri", "Нагрузка на дороги", "Road loads"), T("Geologia pentru pardoseli", "Геология под полы", "Geology for the floor slabs")],
    risks: [T("Cererea regională — de confirmat", "Региональный спрос — требует подтверждения", "Regional demand — to be confirmed"), T("Căutarea îndelungată a chiriașului fără BTS", "Долгий поиск арендатора без BTS", "A long search for a tenant without BTS"), T("Cerințele de securitate la incendiu", "Требования пожарной безопасности", "Fire-safety requirements")],
  },
  {
    key: "production", model: "hold", preset: "production", visual: null,
    title: T("Format de producție și comerț", "Производственно-коммерческий формат", "Production and trade"),
    line: T("Module flexibile: producție plus showroom sau birou.", "Гибкие блоки: производство плюс шоурум или офис.", "Flexible units: production plus a showroom or office."),
    audience: [T("Producători locali — alimentar, materiale de construcții, ateliere", "Местные производители — пищевые, стройматериалы, мастерские", "Local producers — food, building materials, workshops"), T("Companii de servicii", "Сервисные компании", "Service companies")],
    logic: T("Blocuri modulare de închiriat firmelor mici și mijlocii; fiecare chiriaș — producție și front comercial.", "Модульные блоки в аренду малому и среднему бизнесу: у каждого — производство и коммерческий фронт.", "Modular units leased to small and mid-size firms: each with production and a commercial front."),
    siteNeeds: [T("Grilă modulară", "Модульная сетка", "A modular grid"), T("Accese separate", "Раздельные въезды", "Separate entries"), T("Platforme deschise", "Открытые площадки", "Open yards")],
    access: T("Accesul de marfă și cel al clienților separate.", "Грузовой и клиентский подъезды разведены.", "Freight and customer access kept apart."),
    utilities: [T("Putere electrică sporită", "Повышенная электрическая мощность", "Higher electrical capacity"), T("Apă și canalizare", "Вода и канализация", "Water and sewerage"), T("Gaz — dacă procesul o cere", "Газ — если этого требует процесс", "Gas — if the process requires it")],
    checks: [T("Cerințe de mediu și sanitare", "Экологические и санитарные требования", "Environmental and sanitary requirements"), T("Zone de protecție sanitară", "Санитарно-защитные зоны", "Sanitary protection zones"), T("Capacitatea rețelelor", "Мощности сетей", "Network capacities")],
    risks: [T("Capacitatea rețelelor", "Мощности сетей", "Network capacities"), T("Specificul chiriașilor", "Специфика арендаторов", "Tenant specifics"), T("Ocupare mai lentă", "Более длинное заполнение", "A slower lease-up")],
  },
  {
    key: "mixed", model: "sale", preset: "mixed", visual: null,
    title: T("Complex comercial mixt", "Смешанный коммерческий комплекс", "Mixed commercial complex"),
    line: T("Comerț spre drum, depozitare și producție în spate.", "Торговля по фронту дороги, склад и производство в глубине.", "Retail along the road, storage and production at the rear."),
    audience: [T("Comerț și servicii", "Торговля и услуги", "Retail and services"), T("Depozitare mică", "Небольшие склады", "Small storage"), T("Cumpărători de spații comerciale", "Покупатели коммерческих помещений", "Buyers of commercial premises")],
    logic: T("Realizare pe etape; o parte a spațiilor se poate vinde, o parte se poate închiria.", "Поэтапная реализация: часть помещений можно продать, часть — сдать в аренду.", "Phased delivery: part of the premises can be sold, part leased."),
    siteNeeds: [T("Configurația terenului", "Конфигурация участка", "Site configuration"), T("Separarea fluxurilor", "Разделение потоков", "Separated flows"), T("Etapizare", "Этапность", "Phasing")],
    access: T("Frontul spre drum pentru comerț, accesul de serviciu din al doilea drum — se verifică.", "Фронт дороги — для торговли, служебный подъезд со второй дороги — проверяется.", "The road front for retail, the service access from the second road — being verified."),
    utilities: [T("Rețele pentru funcții diferite", "Сети под разные функции", "Networks for different uses"), T("Contorizare separată", "Раздельный учёт", "Separate metering")],
    checks: [T("Regimul urbanistic pentru funcțiuni mixte", "Градостроительный режим для смешанных функций", "The planning regime for mixed uses"), T("Configurația și accesele", "Конфигурация и подъезды", "Configuration and access"), T("Cererea pentru vânzare", "Спрос на продажу", "Demand for sale")],
    risks: [T("Complexitatea conceptului", "Сложность концепции", "A complex concept"), T("Ritmuri diferite de vânzare și ocupare", "Разные сроки продажи и заполнения", "Different sale and lease-up timing")],
  },
];

export const drochiaAsset: LandAsset = createLandAsset({
  id: "land-drochia",
  slug: "drochia",
  name: "Drochia",
  kind: "land",
  updated: "2026-11-23",
  geo: { lat: drochiaExplorer.site.lat, lon: drochiaExplorer.site.lon, point: T("Punctul — poziția aproximativă a terenului după harta cadastrală; coordonatele se verifică de inginerul cadastral", "Точка — ориентировочное положение участка по кадастровой карте; координаты уточняет кадастровый инженер", "The point — the site's approximate position from the cadastral map; the cadastral engineer verifies the coordinates"), boundary: null },
  place: T("Drochia", "Дрокия", "Drochia"),
  address: T("Bd. Independenței 65, Drochia", "Бул. Индепенденцей, 65, Дрокия", "65 Independenței Blvd, Drochia"),
  parcels: reg.premises.map((p) => ({ number: p.cadastral, area: p.area })),
  area: reg.area,
  status: T("Conceptul este în evaluare", "Концепция на стадии оценки", "Concept under evaluation"),
  hero: {
    kicker: T("Teren · Drochia", "Земля · Дрокия", "Land · Drochia"),
    positioning: T("Teren cu potențial de dezvoltare", "Земельный участок с потенциалом девелопмента", "A land plot with development potential"),
    statement: T("Nu doar un teren. O oportunitate de dezvoltare.", "Не просто участок. Возможность для девелопмента.", "Not just land. A development opportunity."),
    lead: T(
      `2${NB}ha pe bulevardul Independenței — teren propriu MEGAPARC, cu ieșire la două drumuri. Aici sunt datele terenului, studiul locației, scenariile de dezvoltare și modelul investițional — ca decizia să se ia mai repede.`,
      `2${NB}га на бульваре Индепенденцей — собственная земля MEGAPARC с выходом на две дороги. Здесь собраны данные участка, исследование локации, сценарии развития и инвестиционная модель — чтобы решение принималось быстрее.`,
      `2${NB}ha on Independenței Boulevard — MEGAPARC's own land with frontage on two roads. The site data, the location research, the development scenarios and the investment model are here — so the decision can be made faster.`,
    ),
    published: T("Date publicate MEGAPARC; nu înlocuiesc verificarea documentelor cadastrale.", "Опубликованные данные MEGAPARC; они не заменяют проверку кадастровых документов.", "MEGAPARC's published data; they do not replace checking the cadastral documents."),
  },
  // R2 §1 — why this site: verified facts only (docs/research/DROCHIA_CLAIMS_VERIFICATION_R2.md); no forecast, no superlative, no tenant
  arguments: [
    { key: "owned", nature: "FACT", title: T("Terenul este deja în proprietate", "Земля уже в собственности", "The land is already owned"), text: T("Terenul aparține MEGAPARC: proiectul nu așteaptă o tranzacție cu terenul.", "Участок принадлежит MEGAPARC: проект не ждёт сделки по земле.", "The site belongs to MEGAPARC: the project does not wait for a land deal."), source: T("Date MEGAPARC · extrasul din Registru se pregătește", "Данные MEGAPARC · выписка из Реестра готовится", "MEGAPARC data · the Register extract is being prepared") },
    { key: "roads", nature: "FACT", title: T(`2${NB}ha cu ieșire la două drumuri`, `2${NB}га с выходом на две дороги`, `2${NB}ha with frontage on two roads`), text: T("Bulevardul Independenței și un al doilea drum; schema acceselor se verifică.", "Бульвар Индепенденцей и вторая дорога; схема подъездов проверяется.", "Independenței Boulevard and a second road; the access scheme is being verified."), source: T("Date MEGAPARC", "Данные MEGAPARC", "MEGAPARC data") },
    { key: "formats", nature: "FACT", title: T("Fără formate mari în oraș", "Крупных форматов в городе нет", "No large formats in the town"), text: T(`Kaufland, METRO, Supraten și Maximum lipsesc din oraș; cele mai apropiate sunt la Bălți, la circa 40–43${NB}km pe drum.`, `Kaufland, METRO, Supraten и Maximum в городе нет; ближайшие — в Бэлць, около 40–43${NB}км по дороге.`, "Kaufland, METRO, Supraten and Maximum are not in the town; the nearest are in Bălți, about 40–43 km by road."), source: T("Site-urile rețelelor · 23.11.2026", "Сайты сетей · 23.11.2026", "The chains' sites · 23.11.2026") },
    { key: "hub", nature: "FACT", title: T("Centru raional pe R7 și R12", "Районный центр на трассах R7 и R12", "A district centre on the R7 and R12"), text: T(`12${NB}939 de locuitori în oraș și 53${NB}738 în raion (recensământul 2024); drumurile naționale R7 și R12 și calea ferată trec prin oraș.`, `12${NB}939 жителей в городе и 53${NB}738 в районе (перепись 2024 года); через город проходят национальные дороги R7 и R12 и железная дорога.`, "12,939 residents in the town and 53,738 in the district (2024 census); the R7 and R12 national roads and the railway cross the town."), source: T("BNS · HG 1468/2016", "НБС · ПП 1468/2016", "NBS · GD 1468/2016") },
  ],
  facts: [
    { key: "area", label: T("Suprafață", "Площадь", "Area"), value: T(`20${NB}000 m²`, `20${NB}000 м²`, "20,000 m²"), status: "VERIFYING", provenance: TAX },
    { key: "cadastre", label: T("Număr cadastral", "Кадастровый номер", "Cadastral number"), value: T("3601104.441", "3601104.441", "3601104.441"), status: "VERIFYING", provenance: TAX },
    { key: "address", label: T("Adresă", "Адрес", "Address"), value: T("Bd. Independenței 65, Drochia", "Бул. Индепенденцей, 65, Дрокия", "65 Independenței Blvd, Drochia"), status: "VERIFYING", provenance: TAX },
    { key: "roads", label: T("Acces", "Выход к дорогам", "Road access"), value: T("Două drumuri", "Две дороги", "Two roads"), status: "VERIFYING", provenance: DATA },
    { key: "concept", label: T("Concept", "Концепция развития", "Concept"), value: T("În evaluare", "На стадии оценки", "Under evaluation"), status: "VERIFYING", provenance: DATA },
  ],
  distances: drochiaMarket.distances,
  market: drochiaMarket.market,
  scenarios,
  presets: [
    { key: "retail", model: "hold", label: T("Parc comercial · închiriere", "Торговый комплекс · аренда", "Retail park · lease"), values: { coverage: 30, floors: 1, efficiency: 92, hard: 550, design: 7, networks: 250000, landscaping: 300000, permits: 40000, contingency: 7, preMonths: 9, buildMonths: 12, rent: 9, occupancy: 90, leaseUp: 12, opex: 8, indexation: 2, holdYears: 10, exitYield: 10, exitCosts: 2, ltc: 50, interest: 9, tax: 12, discount: 11 } },
    { key: "warehouse", model: "bts", label: T("Spațiu de depozitare · build-to-suit", "Склад · build-to-suit", "Warehouse · build-to-suit"), values: { coverage: 40, floors: 1, efficiency: 95, hard: 420, design: 6, networks: 200000, landscaping: 150000, permits: 30000, contingency: 6, preMonths: 6, buildMonths: 10, leaseYears: 10, indexation: 2, target: 10, opex: 3, exitYield: 10, exitCosts: 2, breakYear: 5, voidMonths: 9, reletPct: 85, breakFee: 6, ltc: 50, interest: 9, tax: 12, discount: 10 } },
    { key: "production", model: "hold", label: T("Producție și comerț · închiriere", "Производство и торговля · аренда", "Production and trade · lease"), values: { coverage: 35, floors: 1, efficiency: 90, hard: 480, design: 7, networks: 300000, landscaping: 150000, permits: 30000, contingency: 7, preMonths: 8, buildMonths: 12, rent: 6, occupancy: 85, leaseUp: 18, opex: 8, indexation: 2, holdYears: 10, exitYield: 11, exitCosts: 2, ltc: 50, interest: 9, tax: 12, discount: 12 } },
    { key: "mixed", model: "sale", label: T("Complex mixt · vânzare", "Смешанный комплекс · продажа", "Mixed complex · sale"), values: { coverage: 30, floors: 2, efficiency: 85, hard: 600, design: 8, networks: 250000, landscaping: 200000, permits: 40000, contingency: 7, preMonths: 9, buildMonths: 15, price: 1000, salesMonths: 18, commission: 3, ltc: 50, interest: 9, tax: 12, discount: 12 } },
  ],
  approvals: { experience: false, explorer: false, market: false, scenarios: false, model: false, deals: false, pack: false },
  context: {
    townGen: T("Drochia", "Дрокии", "Drochia"),
    roads: T("ambele fronturi", "оба выхода к дорогам", "both road fronts"),
    frontageFrom: T("de pe bulevardul Independenței", "с бульвара Индепенденцей", "from Independenței Boulevard"),
    station: T("gara Drochia", "станция Дрокия", "Drochia station"),
    addressShort: T("Bd. Independenței 65", "Бул. Индепенденцей, 65", "65 Independenței Blvd"),
    // R2: the point is the parcel's approximate position on the cadastral map (at the town-entrance roundabout), no longer the OSM geocode of the address
    pointSource: T("Poziție aproximativă după harta cadastrală", "Ориентировочное положение по кадастровой карте", "Approximate position from the cadastral map"),
    pointNote: T("Punctul este poziția aproximativă a terenului, nu limita lui; coordonatele se verifică de inginerul cadastral.", "Точка — ориентировочное положение участка, а не его граница; координаты уточняет кадастровый инженер.", "The point is the site's approximate position, not its boundary; the cadastral engineer verifies the coordinates."),
    explorer: drochiaExplorer,
    researchDate: "23.11.2026",
  },
  // OWNER R2 §4: internal priority — Build-to-Suit and joint development lead; the other three are discussed individually
  overrides: { passport: passportKnown, readiness: readinessKnown, deals: { "build-to-suit": { priority: "primary" }, "joint-development": { priority: "primary" } } },
});
