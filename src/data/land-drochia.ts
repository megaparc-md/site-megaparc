import { T } from "@/data/leasing-experience-model";
import type { DueItem, LandOpportunity } from "@/data/land-model";

/**
 * DROCHIA — the first dataset of the land master template (OWNER «LAND DEVELOPMENT OPPORTUNITIES · DROCHIA = MASTER
 * TEMPLATE», 2026-11-10). Name «Drochia» only (the earlier name is rejected).
 *
 * Confirmed (OWNER tax records, 2026-11-10 brief §3): bd. Independenței 65 · cadastral number 3601104.441 · 2,0 ha /
 * 20 000 m². Confirmed earlier (OWNER 2026-10-09 data): two road fronts · status «under evaluation» · MEGAPARC-owned land.
 * MEGAPARC is considering retail, logistics and mixed formats (OWNER copy of the development record) — shown only as
 * scenarios for initial evaluation, never as a permitted use.
 * NOT published (nothing verified): zoning, permitted use, POT, CUT, height, setbacks, utilities and capacities,
 * buildable area, GBA, value, IRR. The map point is the geocoded address (OpenStreetMap), not a surveyed boundary.
 */

const TAX = "OWNER tax records (LAND brief §3, 2026-11-10)";
const DATA = "OWNER data 2026-10-09 (src/data/demo-content.ts drochiaProfile — confirmed)";
const COPY = "OWNER copy — development record (src/lib/assets.ts): «MEGAPARC is considering retail, logistics and mixed-use concepts»";
const OSM = "OpenStreetMap — the street network around the geocoded address (src/data/location-maps.ts)";
const BRIEF = "LAND brief §5 / §26 (2026-11-10) — not verified: a status, never a value";

const item = (key: string, label: ReturnType<typeof T>, status: DueItem["status"], note: ReturnType<typeof T>, source = BRIEF): DueItem => ({ key, label, status, note, source });
const toVerify = T("De verificat", "Проверяется", "To verify");

export const drochiaLand: LandOpportunity = {
  slug: "drochia",
  name: "Drochia",
  kind: "land",
  area: 20000,
  place: T("Drochia", "Дрокия", "Drochia"),
  address: T("Bd. Independenței 65, Drochia", "Бул. Индепенденцей, 65, Дрокия", "65 Independenței Blvd, Drochia"),
  parcels: [{ number: "3601104.441", area: 20000 }],
  status: T("Oportunitate de dezvoltare", "Возможность для девелопмента", "Development opportunity"),
  hero: {
    kicker: T("Teren · Drochia", "Земля · Дрокия", "Land · Drochia"),
    statement: T("Nu doar un teren. O oportunitate de dezvoltare.", "Не просто участок. Возможность для девелопмента.", "Not just land. A development opportunity."),
    lead: T(
      "MEGAPARC reunește datele de proprietate și cadastrale, verificarea tehnică și urbanistică, logica comercială și scenariile de dezvoltare — ca un dezvoltator să înțeleagă oportunitatea mai repede.",
      "MEGAPARC собирает данные о собственности и кадастре, техническую и градостроительную проверку, коммерческую логику и сценарии развития — чтобы девелопер быстрее понял возможность.",
      "MEGAPARC brings together ownership and cadastral data, technical and planning review, commercial logic and development scenarios — so a developer understands the opportunity faster.",
    ),
  },
  maps: {
    site: "drochia",
    region: "drochia-region",
    caption: T(
      "Punctul de pe hartă este adresa geocodată (OpenStreetMap); limitele terenului se arată după verificarea planului cadastral.",
      "Точка на карте — геокодированный адрес (OpenStreetMap); границы участка покажем после проверки кадастрового плана.",
      "The point on the map is the geocoded address (OpenStreetMap); the site boundary is shown once the cadastral plan is verified.",
    ),
  },

  today: {
    title: T("Terenul astăzi.", "Участок сегодня.", "The site today."),
    facts: [
      { key: "area", label: T("Suprafața terenului", "Площадь участка", "Site area"), value: T("2,0 ha · 20.000 m²", "2,0 га · 20 000 м²", "2.0 ha · 20,000 m²"), status: "CONFIRMED", source: TAX },
      { key: "cadastre", label: T("Număr cadastral", "Кадастровый номер", "Cadastral number"), value: T("3601104.441", "3601104.441", "3601104.441"), status: "CONFIRMED", source: TAX },
      { key: "address", label: T("Adresă", "Адрес", "Address"), value: T("Bd. Independenței 65, Drochia", "Бул. Индепенденцей, 65, Дрокия", "65 Independenței Blvd, Drochia"), status: "CONFIRMED", source: TAX },
      { key: "owner", label: T("Proprietar", "Собственник", "Owner"), value: T("MEGAPARC", "MEGAPARC", "MEGAPARC"), status: "CONFIRMED", source: DATA },
      { key: "fronts", label: T("Fronturi la drumuri", "Фронты к дорогам", "Road fronts"), value: T("2", "2", "2"), status: "CONFIRMED", source: DATA },
      { key: "structures", label: T("Construcții existente", "Существующие постройки", "Existing structures"), value: toVerify, status: "TO_VERIFY", source: BRIEF },
      { key: "status", label: T("Statut", "Статус", "Status"), value: T("Conceptul este în evaluare", "Концепция в оценке", "Concept under evaluation"), status: "CONFIRMED", source: DATA },
    ],
  },

  potential: {
    title: T("Ce creează potențialul terenului.", "Что создаёт потенциал участка.", "What creates the site's potential."),
    lead: T("Faptul — și de ce contează pentru dezvoltare. Doar ce este confirmat.", "Факт — и почему он важен для девелопмента. Только подтверждённое.", "The fact — and why it matters for development. Confirmed facts only."),
    factors: [
      { key: "scale", fact: T("20.000 m²", "20 000 м²", "20,000 m²"), why: T("Scara terenului permite evaluarea mai multor scenarii de dezvoltare.", "Масштаб участка позволяет оценить несколько сценариев застройки.", "The site's scale allows several development scenarios to be evaluated."), source: TAX },
      { key: "fronts", fact: T("Două fronturi la drumuri", "Два фронта к дорогам", "Two road fronts"), why: T("Două fronturi dau opțiuni pentru accese și pentru separarea fluxurilor — schema acceselor se verifică.", "Два фронта дают варианты въездов и разделения потоков — схема подъездов проверяется.", "Two fronts give options for access and for separating flows — the access scheme is verified."), source: DATA },
      { key: "address", fact: T("Bulevardul Independenței", "Бульвар Индепенденцей", "Independenței Boulevard"), why: T("O adresă pe bulevard face orientarea și logistica mai clare.", "Адрес на бульваре делает навигацию и логистику понятнее.", "An address on the boulevard makes wayfinding and logistics clearer."), source: `${TAX} · ${OSM}` },
      { key: "owner", fact: T("Teren propriu MEGAPARC", "Собственная земля MEGAPARC", "MEGAPARC's own land"), why: T("Un singur proprietar și date cadastrale verificabile simplifică structurarea proiectului.", "Один собственник и проверяемые кадастровые данные упрощают структурирование проекта.", "One owner and verifiable cadastral data simplify structuring the project."), source: DATA },
    ],
  },

  development: {
    confirmed: [
      { key: "area", label: T("Suprafața cadastrală", "Кадастровая площадь", "Cadastral area"), value: T("20.000 m²", "20 000 м²", "20,000 m²"), status: "CONFIRMED", source: TAX },
      { key: "cadastre", label: T("Număr cadastral", "Кадастровый номер", "Cadastral number"), value: T("3601104.441", "3601104.441", "3601104.441"), status: "CONFIRMED", source: TAX },
      { key: "address", label: T("Adresă", "Адрес", "Address"), value: T("Bd. Independenței 65", "Бул. Индепенденцей, 65", "65 Independenței Blvd"), status: "CONFIRMED", source: TAX },
      { key: "fronts", label: T("Fronturi la drumuri", "Фронты к дорогам", "Road fronts"), value: T("2", "2", "2"), status: "CONFIRMED", source: DATA },
      { key: "owner", label: T("Proprietate", "Собственность", "Ownership"), value: T("MEGAPARC", "MEGAPARC", "MEGAPARC"), status: "CONFIRMED", source: DATA },
    ],
    verify: [
      T("regimul urbanistic", "градостроительный режим", "the planning regime"),
      T("destinațiile permise", "разрешённое использование", "the permitted uses"),
      T("suprafața construibilă", "площадь застройки", "the buildable area"),
      T("POT și CUT", "POT и CUT", "POT and CUT"),
      T("regimul de înălțime", "высотность", "the height limit"),
      T("retragerile", "отступы", "the setbacks"),
      T("servituțile", "сервитуты", "the servitudes"),
      T("rețelele și capacitățile de racordare", "инженерные сети и мощности подключения", "the utilities and connection capacities"),
      T("restricțiile de mediu", "экологические ограничения", "the environmental constraints"),
      T("cerințele pentru drumuri și accese", "требования к дорогам и подъездам", "the road and access requirements"),
      T("limitele terenului pe teren", "границы участка на местности", "the boundary on the ground"),
    ],
  },

  scenarios: {
    title: T("Scenarii pentru evaluarea inițială.", "Сценарии для первичной оценки.", "Scenarios for initial evaluation."),
    lead: T("Formatele pe care MEGAPARC le analizează pentru teren — un punct de plecare pentru discuție, nu o destinație aprobată.", "Форматы, которые MEGAPARC рассматривает для участка, — отправная точка для разговора, а не утверждённое назначение.", "The formats MEGAPARC is considering for the site — a starting point for the discussion, not an approved use."),
    items: [
      { key: "retail", title: T("Comerț", "Торговля", "Retail"), text: T("Comerț de proximitate și servicii pentru oraș și regiune.", "Торговля и сервисы для города и района.", "Retail and services for the town and the region."), verify: T("destinația permisă, accesele, parcarea", "разрешённое использование, подъезды, парковка", "permitted use, access, parking"), source: COPY },
      { key: "logistics", title: T("Logistică", "Логистика", "Logistics"), text: T("Depozitare și distribuție cu acces separat pentru marfă.", "Склад и дистрибуция с отдельным подъездом для грузов.", "Storage and distribution with separate freight access."), verify: T("drumurile, sarcina pe acces, rețelele", "дороги, нагрузка на подъезды, сети", "roads, access loads, utilities"), source: COPY },
      { key: "mixed", title: T("Format mixt", "Смешанный формат", "Mixed format"), text: T("Comerț spre drum, logistică în spate — pe același teren.", "Торговля со стороны дороги, логистика в глубине — на одной площадке.", "Retail facing the road, logistics at the rear — on one site."), verify: T("configurația terenului, fluxurile, regimul urbanistic", "конфигурация участка, потоки, градостроительный режим", "site configuration, flows, planning regime"), source: COPY },
    ],
    disclaimer: T(
      "Acestea nu sunt concepte urbanistice aprobate. Parametrii finali ai dezvoltării depind de verificarea urbanistică, tehnică și comercială.",
      "Это не утверждённые градостроительные концепции. Итоговые параметры застройки зависят от градостроительной, технической и коммерческой проверки.",
      "These are not approved planning concepts. Final development parameters depend on urban-planning, technical and commercial verification.",
    ),
  },

  readiness: [
    item("title", T("Titlu / proprietate", "Право собственности", "Title / ownership"), "CONFIRMED", T("Teren MEGAPARC", "Земля MEGAPARC", "MEGAPARC land"), DATA),
    item("cadastre", T("Cadastru", "Кадастр", "Cadastre"), "CONFIRMED", T("3601104.441 · 20.000 m²", "3601104.441 · 20 000 м²", "3601104.441 · 20,000 m²"), TAX),
    item("boundary", T("Limitele terenului", "Границы участка", "Boundary"), "TO_VERIFY", T("Planul cadastral se verifică", "Кадастровый план проверяется", "The cadastral plan is verified")),
    item("access", T("Acces", "Подъезд", "Access"), "TO_VERIFY", T("Două fronturi confirmate; schema acceselor se verifică", "Два фронта подтверждены; схема подъездов проверяется", "Two fronts confirmed; the access scheme is verified"), DATA),
    item("urbanism", T("Urbanism", "Градостроительство", "Urbanism"), "TO_VERIFY", T("Certificatul de urbanism — de obținut", "Градостроительный сертификат — предстоит получить", "The planning certificate — to obtain")),
    item("use", T("Destinație permisă", "Разрешённое использование", "Permitted use"), "TO_VERIFY", T("Nu este stabilită", "Не определено", "Not established")),
    item("utilities", T("Rețele", "Инженерные сети", "Utilities"), "TO_VERIFY", T("Capacitățile se verifică", "Мощности проверяются", "Capacities to be verified")),
    item("topography", T("Topografie", "Топография", "Topography"), "REQUIRED", T("Ridicarea topografică este necesară", "Нужна топографическая съёмка", "A topographic survey is required")),
    item("geology", T("Geologie", "Геология", "Geology"), "REQUIRED", T("Studiul geotehnic este necesar", "Нужны инженерно-геологические изыскания", "A geotechnical study is required")),
    item("concept", T("Concept", "Концепция", "Concept"), "NOT_AVAILABLE", T("Nu există un concept aprobat", "Утверждённой концепции нет", "No approved concept")),
    item("model", T("Model financiar", "Финансовая модель", "Financial model"), "NOT_AVAILABLE", T("Se construiește cu partenerul, pe un scenariu concret", "Строится с партнёром под конкретный сценарий", "Built with the partner for a specific scenario")),
  ],

  utilities: [
    item("power", T("Electricitate", "Электроснабжение", "Electricity"), "TO_VERIFY", T("Capacitatea se verifică", "Мощность проверяется", "Capacity to be verified")),
    item("water", T("Apă", "Водоснабжение", "Water"), "TO_VERIFY", T("Capacitatea se verifică", "Мощность проверяется", "Capacity to be verified")),
    item("sewer", T("Canalizare", "Канализация", "Sewerage"), "TO_VERIFY", T("Capacitatea se verifică", "Мощность проверяется", "Capacity to be verified")),
    item("gas", T("Gaz", "Газ", "Gas"), "TO_VERIFY", T("Capacitatea se verifică", "Мощность проверяется", "Capacity to be verified")),
    item("road", T("Acces rutier", "Подъезд", "Road access"), "CONFIRMED", T("Două fronturi la drumuri", "Два фронта к дорогам", "Two road fronts"), DATA),
    item("telecom", T("Telecomunicații", "Связь", "Telecom"), "TO_VERIFY", T("Se verifică", "Проверяется", "To be verified")),
    item("storm", T("Ape pluviale", "Ливневая канализация", "Stormwater"), "TO_VERIFY", T("Se verifică", "Проверяется", "To be verified")),
  ],

  location: {
    title: T("Acces și amplasare.", "Доступ и расположение.", "Access and location."),
    text: T(
      "Bulevardul Independenței, Drochia. Pe hărți — rețeaua de străzi în jurul adresei: aproape (raza de 300 m) și în contextul orașului (raza de 1 km), după datele OpenStreetMap.",
      "Бульвар Индепенденцей, Дрокия. На картах — улицы вокруг адреса: рядом (радиус 300 м) и в масштабе города (радиус 1 км), по данным OpenStreetMap.",
      "Independenței Boulevard, Drochia. The maps show the streets around the address: close by (a 300 m radius) and at town scale (a 1 km radius), from OpenStreetMap data.",
    ),
    points: [
      T("Adresa pe bulevardul Independenței", "Адрес на бульваре Индепенденцей", "The address on Independenței Boulevard"),
      T("Două fronturi la drumuri", "Два фронта к дорогам", "Two road fronts"),
      T("Distanțele până la rute și noduri — în pachetul pentru dezvoltator, după verificare", "Расстояния до трасс и узлов — в пакете для девелопера, после проверки", "Distances to routes and hubs — in the development pack, once verified"),
    ],
  },

  pack: [
    { key: "cadastre", label: T("Datele cadastrale", "Кадастровые данные", "Cadastral data"), state: "ready" },
    { key: "ownership", label: T("Proprietatea", "Собственность", "Ownership"), state: "ready" },
    { key: "map", label: T("Hărți de amplasare", "Карты расположения", "Location maps"), state: "ready" },
    { key: "plan", label: T("Planul terenului cu limitele", "План участка с границами", "Site plan with the boundary"), state: "preparing", missing: true },
    { key: "aerial", label: T("Fotografie aeriană", "Аэрофотосъёмка", "Aerial photography"), state: "preparing", missing: true },
    { key: "photos", label: T("Fotografii ale terenului", "Фотографии участка", "Site photographs"), state: "preparing", missing: true },
    { key: "urbanism", label: T("Date urbanistice", "Градостроительные данные", "Planning data"), state: "preparing", missing: true },
    { key: "utilities", label: T("Rețele și capacități", "Сети и мощности", "Utilities and capacities"), state: "preparing", missing: true },
    { key: "topo", label: T("Topografie", "Топосъёмка", "Topographic survey"), state: "preparing", missing: true },
    { key: "geology", label: T("Geologie", "Геология", "Geology"), state: "preparing", missing: true },
    { key: "concept", label: T("Concept și note tehnice", "Концепция и технические заметки", "Concept and technical notes"), state: "preparing", missing: true },
    { key: "scenario", label: T("Scenariu de investiție", "Инвестиционный сценарий", "Investment scenario"), state: "preparing", missing: true },
  ],
};

export const landOpportunities: Record<string, LandOpportunity> = { drochia: drochiaLand };
