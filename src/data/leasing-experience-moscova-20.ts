import { T, type Evidence, type LeasingExperience, type Photo, type PlanZone, type Pt } from "@/data/leasing-experience-model";
import { publicAsset } from "@/lib/site-data";

/**
 * MOSCOVA 20 · M20-01 — content of the leasing page (OWNER "GOLD STANDARD",
 * 2026-11-06, recomposed by "COMPACT PREMIUM LEASING EXPERIENCE · CONVERSION TO
 * VIEWING", 2026-11-06). Status, dates, marketed / useful area and the level
 * breakdown are NOT here: they live in the unit record
 * (src/data/leasing-inventory.ts → moscova-20-corner), the single source; a
 * "{area}" token in a text is replaced by the marketed area of that record.
 *
 * Sources (internal, never shown):
 *   OWNER — the mandates of 2026-11-06 (confirmed data, public location wording,
 *           confirmed / to-confirm split; the compact brief's capital-base lists)
 *   DOC   — Moscova_20_Commercial_Offer_RU.pdf (access, logistics, finish);
 *           Certificat contabil rețele exterioare (30.09.2026); the architectural
 *           plans Plan_0.000 (Anexa 2) and Plan_-2.950 / -3.300 (Anexa 1),
 *           project 15/19 SA, Variant 1, arch. A. Novicov, 06.21 — room schedule
 *           and geometry of the plan scheme
 *   PHOTO — the twelve OWNER photographs of 16.10.2026 + the portfolio aerial
 *   HIST  — the historical Rîșcani market study (background only)
 * The commercial offer's rate and its 50 kVA figure are NOT used.
 */

const OWNER = "OWNER mandate 2026-11-06";
const COMPACT = "OWNER compact brief 2026-11-06";
const OFFER = "Commercial offer Moscova 20 (RU, 2026) — confirmed by the OWNER mandate";
const PHOTO = "OWNER photographs 16.10.2026 — current condition";
const NET = "Certificat contabil — rețele tehnico-edilitare exterioare, 30.09.2026";
const PLANS = "Plan_0.000 (Anexa 2) and Plan_-2.950 / -3.300 (Anexa 1), Moscova 20 Variant 1, project 15/19 SA, arch. A. Novicov, 06.21 — OWNER files";
const fact = (text: ReturnType<typeof T>, evidence: Evidence, source: string) => ({ text, evidence, source });

const dir = "/assets/leasing/moscova-20";
const photo = (id: string, width: number, height: number, alt: ReturnType<typeof T>, extra: Partial<Photo> = {}): Photo => ({
  id,
  src: publicAsset(`${dir}/${id}.webp`),
  small: publicAsset(`${dir}/${id}-sm.webp`),
  width,
  height,
  alt,
  evidence: "OWNER_CONFIRMED",
  source: PHOTO,
  ...extra,
});

const photos: Record<string, Photo> = {
  // the hero crops of the facade frame: crop only — the neighbouring building's lettering is outside both boxes
  facadeWide: photo("m20-facade-wide", 1278, 709, T("Moscova 20: vitrina continuă, terasa cu scări și rampă, trotuarul bulevardului", "Moscova 20: сплошное остекление, терраса с лестницей и пандусом, тротуар бульвара", "Moscova 20: continuous glazing, the terrace with steps and a ramp, the boulevard pavement"), { position: "50% 42%" }),
  facadePhone: photo("m20-facade-phone", 945, 709, T("Moscova 20: intrarea cu scări și rampă și vitrina", "Moscova 20: вход с лестницей и пандусом, витрина", "Moscova 20: the entrance with steps and a ramp, the shop window"), { position: "50% 55%" }),
  frontage: photo("m20-frontage", 1278, 959, T("Moscova 20 de sus: fațada vitrată, intrarea cu scări și rampă, trotuarul și bulevardul", "Moscova 20 сверху: остеклённый фасад, вход с лестницей и пандусом, тротуар и бульвар", "Moscova 20 from above: the glazed frontage, the entrance with steps and ramp, the pavement and the boulevard")),
  context: photo("m20-context", 1278, 959, T("Bulevardul Moscova, blocurile de locuit și obiectul pe prima linie", "Бульвар Москова, жилой массив и объект на первой линии", "Moscova Boulevard, the housing blocks and the property on the first line")),
  entrance: photo("m20-entrance", 1600, 1066, T("Intrarea: scări, rampă și ușa de sticlă", "Вход: лестница, пандус и стеклянная дверь", "The entrance: steps, ramp and the glass door")),
  groundHall: photo("m20-ground-hall", 1600, 1066, T("Parterul astăzi: gresie, pereți vopsiți, calorifere, climatizare tip casetă, trasee de ventilație", "1-й этаж сегодня: плитка, окрашенные стены, радиаторы, кассетный кондиционер, трассы вентиляции", "The ground floor today: tiles, painted walls, radiators, cassette air-conditioning, ventilation ducts")),
  groundGlazing: photo("m20-ground-glazing", 1600, 1066, T("Parterul de-a lungul vitrinei: calorifere sub geam și golul scării spre demisol", "1-й этаж вдоль витрины: радиаторы под остеклением и проём лестницы в цоколь", "The ground floor along the glazing: radiators under the windows and the stair opening to the lower ground")),
  stairs: photo("m20-stairs", 1600, 1066, T("Scara interioară dintre parter și demisol", "Внутренняя лестница между 1-м этажом и цоколем", "The internal staircase between the ground floor and the lower ground")),
  lowerHall: photo("m20-lower-hall", 1600, 1066, T("Demisolul: o sală lungă cu pardoseală finisată și climatizare", "Цоколь: длинный зал с готовым полом и кондиционированием", "The lower ground: a long hall with a finished floor and air-conditioning")),
  lowerFinish: photo("m20-lower-finish", 1600, 1066, T("Demisolul: pardoseala finisată, scara, calorifere, indicatoare de ieșire", "Цоколь: готовый пол, лестница, радиаторы, указатели выходов", "The lower ground: finished floor, staircase, radiators, exit signs")),
  lowerService: photo("m20-lower-service", 1600, 1066, T("Demisolul: sala cu stâlpi și zonele de serviciu", "Цоколь: зал с колоннами и служебные зоны", "The lower ground: the hall with columns and the service areas")),
  engineering: photo("m20-engineering", 1600, 1066, T("Trasee de ventilație, indicator de ieșire și scara în demisol", "Трассы вентиляции, указатель выхода и лестница в цоколе", "Ventilation ducts, an exit sign and the staircase in the lower ground")),
  lowerStairs: photo("m20-lower-stairs", 1600, 1066, T("Demisolul gol, pregătit pentru conceptul chiriașului", "Пустой цоколь, готовый к концепции арендатора", "The empty lower ground, ready for the tenant's concept")),
  approach: photo("m20-approach", 1278, 959, T("Cum se ajunge: trotuarul, scările și rampa spre intrare", "Как подойти: тротуар, лестница и пандус к входу", "How you arrive: the pavement, the steps and the ramp to the entrance")),
};

/* ------------------------------------------------------------------ */
/* Plan scheme — traced from the architectural plans (mm, axis 1 / A/1)  */
/* ------------------------------------------------------------------ */

const rect = (x1: number, y1: number, x2: number, y2: number): Pt[] => [[x1, y1], [x2, y1], [x2, y2], [x1, y2]];
const zone = (key: string, no: string | null, kind: PlanZone["kind"], label: ReturnType<typeof T>, area: number | null, shape: Pt[], at?: Pt): PlanZone => ({ key, no, kind, label, area, shape, evidence: "DOCUMENT_CONFIRMED", ...(at ? { at } : {}) });
// the two stair cores sit in the same place on both levels
const stairWest: Pt[] = [[12650, 6000], [14600, 6000], [14600, 8700], [17900, 8700], [17900, 10600], [12650, 10600]];
const stairEast = rect(29900, 5900, 31300, 10500);
const stairLabel = T("Scară între niveluri", "Лестница между уровнями", "Stair between the levels");
const grid = (rows: number[], cols: number[]) => rows.flatMap((y) => cols.map((x) => [x, y] as Pt));
// scenario outlines: the halls without the stair cores (generic zones of the format lens — never a tenant layout)
const groundHall: Pt[] = [[12650, 0], [29800, 0], [29800, 10600], [17900, 10600], [17900, 8700], [14600, 8700], [14600, 6000], [12650, 6000]];
const lowerEast: Pt[] = [[12650, 0], [29800, 0], [29800, 10600], [17900, 10600], [17900, 8700], [14600, 8700], [14600, 6000], [12650, 6000]];
const lowerHall: Pt[] = [[0, 0], [29800, 0], [29800, 10600], [17900, 10600], [17900, 8700], [14600, 8700], [14600, 6000], [12650, 6000], [12650, 5600], [0, 5600]];

export const moscova20Experience: LeasingExperience = {
  unitId: "moscova-20-corner",
  project: "moscova-20",
  address: T("Bd. Moscova 20", "бул. Москова, 20", "20 Moscova Blvd"),
  photos,

  hero: {
    photo: "facadeWide",
    phonePhoto: "facadePhone",
    title: T("Spațiu pentru următorul pas al afacerii dumneavoastră.", "Пространство для следующего шага вашего бизнеса.", "Space for your business's next step."),
    place: T("Chișinău · Rîșcani", "Кишинёв · Рышкань", "Chișinău · Rîșcani"),
    offer: T("oferiți în chirie", "предлагается в аренду", "offered for lease"),
    support: T("Baza capitală principală este deja gata — spațiul poate fi adaptat formatului afacerii dumneavoastră.", "Основная капитальная база уже готова — пространство можно адаптировать под формат вашего бизнеса.", "The main capital base is already in place — the space can be adapted to your business format."),
  },

  why: {
    kicker: T("De ce merită", "Почему стоит рассмотреть", "Why consider it"),
    title: T("Trei argumente pentru o vizionare.", "Три аргумента в пользу просмотра.", "Three reasons to arrange a viewing."),
    items: [
      { key: "base", title: T("Baza gata", "Готовая база", "A ready base"), text: T("Principalele lucrări capitale sunt deja executate.", "Основные капитальные работы уже выполнены.", "The main capital works are already done."), shot: { photo: "lowerFinish", position: "24% 78%", zoom: 1.45 } },
      { key: "space", title: T("Spațiul", "Пространство", "The space"), text: T("{area} care pot fi adaptați conceptului concret.", "{area} с возможностью адаптации под конкретную концепцию.", "{area} that can be adapted to a specific concept."), shot: { photo: "lowerService", position: "50% 60%" } },
      { key: "address", title: T("Adresa", "Адрес", "The address"), text: T("Bd. Moscova 20 · Rîșcani · Chișinău — prima linie a bulevardului.", "бул. Москова, 20 · Рышкань · Кишинёв — первая линия бульвара.", "20 Moscova Blvd · Rîșcani · Chișinău — the boulevard's first line."), shot: { photo: "context", position: "50% 88%" } },
    ],
  },

  panel: {
    kicker: T("Răspunsuri", "Ответы на ваши вопросы", "Your questions answered"),
    title: T("Tot ce contează pentru decizie — într-un singur loc.", "Всё, что важно для решения, — в одном месте.", "Everything that matters for the decision — in one place."),
    tabs: [
      { key: "tech", label: T("Caracteristici tehnice", "Технические характеристики", "Technical data"), lead: T("Doar parametrii importanți. Ce nu este confirmat este marcat ca atare.", "Только важные параметры. Неподтверждённое так и отмечено.", "Only the parameters that matter. Anything unconfirmed is marked as such."), media: { kind: "photo", shot: { photo: "lowerStairs", position: "60% 50%" } } },
      { key: "location", label: T("Locația și circulația", "Локация и движение", "Location and movement"), lead: T("Intersecția bulevardului Moscova cu strada Matei Basarab, sectorul Rîșcani.", "Пересечение бульвара Москова и улицы Матей Басараб, сектор Рышкань.", "The corner of Moscova Boulevard and Matei Basarab Street, Rîșcani district."), media: { kind: "map" } },
      { key: "areas", label: T("Suprafețe", "Площади", "Areas"), lead: T("Două niveluri legate prin scări interioare și o terasă la intrare.", "Два уровня, связанные внутренними лестницами, и терраса у входа.", "Two levels joined by internal stairs, and a terrace at the entrance."), media: { kind: "scheme" } },
      { key: "engineering", label: T("Inginerie", "Инженерия", "Engineering"), lead: T("Ce există deja și ce se confirmă pentru formatul dumneavoastră.", "Что уже есть и что подтверждаем под ваш формат.", "What is in place and what we confirm for your format."), media: { kind: "photo", shot: { photo: "engineering", position: "50% 40%" } } },
      { key: "access", label: T("Acces", "Доступ", "Access"), lead: T("Cum vine clientul și cum sosește marfa.", "Как приходит клиент и как приезжает товар.", "How customers arrive and how goods come in."), media: { kind: "photo", shot: { photo: "approach", position: "45% 100%" } } },
      { key: "readiness", label: T("Pregătire", "Готовность", "Readiness"), lead: T("Ce mai clarificăm pentru afacerea dumneavoastră și din ce se compune lansarea.", "Что ещё уточняем под ваш бизнес и из чего складывается запуск.", "What we still confirm for your business and what opening involves."), media: { kind: "photo", shot: { photo: "groundGlazing", position: "40% 55%" } } },
    ],
  },

  specs: [
    { key: "power", label: T("Alimentare electrică", "Электроснабжение", "Power"), value: T("3 faze · 38 kW conform documentelor", "3 фазы · 38 кВт по документам", "3 phases · 38 kW documented"), state: "ready", evidence: "DOCUMENT_CONFIRMED", source: `${OWNER} §4 · ${NET}` },
    { key: "ventilation", label: T("Ventilație și climatizare", "Вентиляция и кондиционирование", "Ventilation and air-conditioning"), value: T("Sistem existent", "Существующая система", "Existing system"), state: "ready", evidence: "DOCUMENT_CONFIRMED", source: `${OWNER} §4 · ${PHOTO}` },
    { key: "extraction", label: T("Hotă", "Вытяжка", "Extraction"), value: T("Se clarifică pentru formatul concret", "Уточняется под конкретный формат", "Confirmed for the specific format"), state: "confirm", evidence: "TO_CONFIRM", source: `${OWNER} §4, §18 — conflicting source data` },
  ],

  location: {
    lead: T("Intersecția bulevardului Moscova cu strada Matei Basarab, sectorul Rîșcani.", "Пересечение бульвара Москова и улицы Матей Басараб, сектор Рышкань.", "The corner of Moscova Boulevard and Matei Basarab Street, Rîșcani district."),
    points: [
      fact(T("Cartier rezidențial dens", "Плотный жилой район", "A dense residential district"), "OWNER_CONFIRMED", `${OWNER} §12 — public wording; background: historical Rîșcani study`),
      fact(T("Artera principală de transport a sectorului", "Основная транспортная артерия района", "The district's main traffic artery"), "OWNER_CONFIRMED", `${OWNER} §12`),
      fact(T("Mediu comercial format", "Сформировавшаяся коммерческая среда", "An established commercial environment"), "OWNER_CONFIRMED", `${OWNER} §12`),
      fact(T("Transport public în apropiere", "Общественный транспорт рядом", "Public transport close by"), "OWNER_CONFIRMED", `${OWNER} §12`),
      fact(T("Vizibilitate ridicată a fațadei", "Высокая визуальная заметность фасада", "A highly visible frontage"), "OWNER_CONFIRMED", `${OWNER} §12`),
    ],
    // CMS-ready (§13): filled only with new, dated measurements — null values never render
    metrics: [
      { key: "vehicles", label: T("Trafic auto", "Автомобильный поток", "Vehicle traffic"), value: null, evidence: "TO_CONFIRM", source: "New count required", asOf: null },
      { key: "pedestrians", label: T("Trafic pietonal", "Пешеходный поток", "Pedestrian traffic"), value: null, evidence: "TO_CONFIRM", source: "New count required", asOf: null },
      { key: "catchment", label: T("Populație în zona de influență", "Население зоны охвата", "Population catchment"), value: null, evidence: "TO_CONFIRM", source: "New demographic data required", asOf: null },
      { key: "stops", label: T("Stații de transport public", "Остановки общественного транспорта", "Public transport stops"), value: null, evidence: "TO_CONFIRM", source: "Verified stop list required", asOf: null },
      { key: "parking", label: T("Parcare", "Парковка", "Parking"), value: null, evidence: "TO_CONFIRM", source: "OWNER — site plan / number of spaces", asOf: null },
      { key: "drive", label: T("Zonă la distanță auto", "Зона доступности на автомобиле", "Drive-time catchment"), value: null, evidence: "TO_CONFIRM", source: "Isochrone study required", asOf: null },
      { key: "walk", label: T("Zonă pietonală", "Пешеходная зона охвата", "Walking catchment"), value: null, evidence: "TO_CONFIRM", source: "Isochrone study required", asOf: null },
      { key: "anchors", label: T("Ancore din apropiere", "Якоря поблизости", "Nearby anchors"), value: null, evidence: "TO_CONFIRM", source: "Verified list required", asOf: null },
    ],
    // §12–14: background evidence only — never rendered as a current metric
    internal: [
      { key: "artery", text: "Bd. Moscova considered the main traffic artery of the district.", evidence: "HISTORICAL_ANALYSIS", source: "Historical Rîșcani market study", publish: false },
      { key: "stop", text: "A public transport stop and an intersection located close by.", evidence: "HISTORICAL_ANALYSIS", source: "Historical Rîșcani market study", publish: false },
      { key: "population", text: "Dense residential population estimated within the surrounding area.", evidence: "HISTORICAL_ANALYSIS", source: "Historical Rîșcani market study", publish: false },
      { key: "vehicles", text: "≈ 45,000 vehicles / day (historical traffic estimate).", evidence: "HISTORICAL_ANALYSIS", source: "Historical Rîșcani market study", publish: false },
      { key: "pedestrians", text: "≈ 5,000 pedestrians / day (estimate in the commercial offer) — removed from public pages 2026-11-06.", evidence: "HISTORICAL_ANALYSIS", source: "Commercial offer Moscova 20", publish: false },
    ],
    internalNote: "CURRENT TRAFFIC / DEMOGRAPHY requires new validation before any figure is published.",
  },

  area: {
    propertyLine: T("Obiectul întreg — 704 m²; 78 m² sunt deja ocupați.", "Объект целиком — 704 м²; 78 м² уже заняты.", "The whole property is 704 m²; 78 m² are already occupied."),
    // never marketed as confirmed — the page adds «уточняется» from the evidence class
    groundOnly: fact(T("Închirierea doar a parterului", "Аренда только 1-го этажа", "Leasing the ground floor alone"), "TO_CONFIRM", `${OWNER} §17`),
  },

  access: [
    { key: "customer", label: T("Intrarea clienților", "Вход для клиентов", "Customer entrance"), value: T("Intrare separată din stradă, prin terasă: scări și rampă.", "Отдельный вход с улицы через террасу: лестница и пандус.", "A separate street entrance through the terrace: steps and a ramp."), state: "ready", evidence: "OWNER_CONFIRMED", source: `${OWNER} §4, §7 · ${PHOTO} · ${PLANS}` },
    { key: "service", label: T("Intrarea de serviciu", "Служебный вход", "Service entrance"), value: T("Separată, din spate: rampă și coridor — marfa nu se intersectează cu clienții.", "Отдельный, с тыльной стороны: пандус и коридор — товар не пересекается с покупателями.", "Separate, at the back: a ramp and a corridor — goods do not cross the customers' path."), state: "ready", evidence: "DOCUMENT_CONFIRMED", source: `${OFFER} · ${PLANS}` },
    { key: "delivery", label: T("Descărcare și depozitare", "Разгрузка и склад", "Unloading and storage"), value: T("Depozitarea se poate organiza la demisol. Accesul transportului de marfă și orele de descărcare — se clarifică.", "Склад можно организовать в цоколе. Подъезд грузового транспорта и часы разгрузки — уточняются.", "Storage can sit in the lower ground. Delivery vehicle access and unloading hours — to be confirmed."), state: "confirm", evidence: "DOCUMENT_CONFIRMED", source: `${OFFER} — vehicle access TO_CONFIRM` },
    { key: "parking", label: T("Parcare", "Парковка", "Parking"), value: T("Zonă de parcare dedicată lângă obiect; numărul de locuri se clarifică.", "Выделенная парковочная зона у объекта; количество мест уточняется.", "A dedicated parking area by the property; the number of spaces to be confirmed."), state: "ready", evidence: "OWNER_CONFIRMED", source: "OWNER 2026-10-09 (dedicated parking confirmed; count not)" },
    { key: "signage", label: T("Firmă", "Вывеска", "Signage"), value: T("Loc pe fațadă există; formatul, dimensiunile și aprobarea — se clarifică.", "Место на фасаде есть; формат, размеры и согласование — уточняются.", "There is room on the facade; format, size and approval — to be confirmed."), state: "confirm", evidence: "DOCUMENT_CONFIRMED", source: `${OFFER} — format TO_CONFIRM (${OWNER} §19)` },
    { key: "exits", label: T("Ieșiri", "Выходы", "Exits"), value: T("3 ieșiri, conform documentelor.", "3 выхода по документам.", "3 exits, documented."), state: "ready", evidence: "DOCUMENT_CONFIRMED", source: `${OWNER} §4` },
  ],

  engineering: {
    rows: [
      { key: "power", label: T("Alimentare electrică", "Электроснабжение", "Power"), value: T("3 faze · 38 kW conform documentelor", "3 фазы · 38 кВт по документам", "3 phases · 38 kW documented"), state: "ready", evidence: "DOCUMENT_CONFIRMED", source: `${OWNER} §4 · ${NET}` },
      { key: "reserve", label: T("Rezervă de putere", "Резерв мощности", "Power reserve"), value: T("Se clarifică pentru formatul dumneavoastră", "Уточняется под ваш формат", "Confirmed for your format"), state: "confirm", evidence: "TO_CONFIRM", source: `${OWNER} §19` },
      { key: "heating", label: T("Încălzire", "Отопление", "Heating"), value: T("Centralizată; calorifere pe ambele niveluri", "Централизованное; радиаторы на обоих уровнях", "Central; radiators on both levels"), state: "ready", evidence: "OWNER_CONFIRMED", source: `${OWNER} §4 · ${PHOTO} · ${NET}` },
      { key: "ventilation", label: T("Ventilație și climatizare", "Вентиляция и кондиционирование", "Ventilation and air-conditioning"), value: T("Sistem existent: trasee de aer, aparate de climatizare", "Существующая система: воздуховоды, кондиционеры", "Existing system: ducts, air-conditioning units"), state: "ready", evidence: "DOCUMENT_CONFIRMED", source: `${OWNER} §4 · ${PHOTO}` },
      { key: "extraction", label: T("Hotă", "Вытяжка", "Extraction"), value: T("Se clarifică pentru formatul concret", "Уточняется под конкретный формат", "Confirmed for the specific format"), state: "confirm", evidence: "TO_CONFIRM", source: `${OWNER} §4, §18 — conflicting source data` },
      { key: "water", label: T("Apă și canalizare", "Водоснабжение и канализация", "Water and sewer"), value: T("Conectate: 3 grupuri sanitare și duș", "Подключены: 3 санузла и душевая", "Connected: 3 washrooms and a shower"), state: "ready", evidence: "DOCUMENT_CONFIRMED", source: `${OWNER} §4 · ${NET}` },
      { key: "internet", label: T("Curenți slabi și internet", "Слаботочные сети и интернет", "Low-current and internet"), value: T("Traseele există; internetul îl conectează chiriașul", "Трассы есть; интернет арендатор подключает сам", "Routes in place; the tenant connects the internet"), state: "tenant", evidence: "OWNER_CONFIRMED", source: `${OWNER} §4, §18` },
      { key: "fire", label: T("Siguranță la incendiu", "Пожарная безопасность", "Fire safety"), value: T("3 ieșiri, indicatoare de ieșire", "3 выхода, указатели выходов", "3 exits, exit signs"), state: "ready", evidence: "DOCUMENT_CONFIRMED", source: `${OWNER} §4 · ${PHOTO}` },
      { key: "security", label: T("Pază", "Охрана", "Security"), value: T("Sistem de pază existent", "Существующая система охраны", "An existing security system"), state: "ready", evidence: "DOCUMENT_CONFIRMED", source: `${OWNER} §4` },
      { key: "lighting", label: T("Iluminat", "Освещение", "Lighting"), value: T("Ieșiri de cablu pentru corpuri de iluminat; dotarea se clarifică", "Выводы под светильники есть; комплектация уточняется", "Cable leads for luminaires in place; fittings to be confirmed"), state: "confirm", evidence: "TO_CONFIRM", source: `${PHOTO} — luminaires not installed` },
    ],
    note: T("Pentru cafenea sau restaurant, hota și puterea se confirmă pentru conceptul concret.", "Для кафе или ресторана вытяжку и мощность подтверждаем под конкретную концепцию.", "For a café or restaurant, extraction and power are confirmed for the specific concept."),
  },

  readiness: {
    confirmTitle: T("Clarificăm pentru afacerea dumneavoastră", "Уточняем под ваш бизнес", "We confirm for your business"),
    confirm: [
      fact(T("Hota", "Вытяжка", "Extraction"), "TO_CONFIRM", OWNER),
      fact(T("Rezerva de putere", "Резерв мощности", "Power reserve"), "TO_CONFIRM", OWNER),
      fact(T("Formatul firmei", "Формат вывески", "Signage format"), "TO_CONFIRM", OWNER),
      fact(T("Închirierea doar a parterului", "Аренда только 1-го этажа", "Ground floor alone"), "TO_CONFIRM", OWNER),
      fact(T("Compatibilitatea tehnică cu formatul dumneavoastră", "Техническая совместимость с вашим форматом", "Technical fit with your format"), "TO_CONFIRM", OWNER),
      fact(T("Programul de lucru", "Режим работы", "Opening hours"), "TO_CONFIRM", OWNER),
      fact(T("Regulile terasei", "Правила использования террасы", "Terrace rules"), "TO_CONFIRM", OWNER),
      fact(T("Autorizații pentru activitatea dumneavoastră", "Разрешения под ваш вид деятельности", "Permits for your activity"), "TO_CONFIRM", OWNER),
      fact(T("Dotarea cu corpuri de iluminat", "Комплектация освещения", "Lighting fittings"), "TO_CONFIRM", PHOTO),
    ],
    costTitle: T("Din ce se compune lansarea", "Из чего складывается запуск", "What opening involves"),
    cost: [
      { key: "capital", label: T("Lucrări capitale de construcție", "Капитальные строительные работы", "Capital building works"), state: "done", note: T("În mare parte executate", "В основном выполнены", "Largely done") },
      { key: "fitout", label: T("Amenajare pentru concept", "Отделка под концепцию", "Fit-out for the concept"), state: "concept", note: T("După concept", "По концепции", "By concept") },
      { key: "equipment", label: T("Echipamente", "Оборудование", "Equipment"), state: "tenant", note: T("Chiriașul", "Арендатор", "Tenant") },
      { key: "branding", label: T("Branding și firmă", "Брендинг и вывеска", "Branding and signage"), state: "tenant", note: T("Chiriașul", "Арендатор", "Tenant") },
      { key: "engineering", label: T("Inginerie specială", "Специальная инженерия", "Special engineering"), state: "if-needed", note: T("Dacă formatul o cere", "Если требует формат", "If the format needs it") },
      { key: "it", label: T("IT și comunicații", "IT и связь", "IT and communications"), state: "tenant", note: T("Chiriașul", "Арендатор", "Tenant") },
    ],
  },

  terms: {
    title: T("Condiții de închiriere", "Условия аренды", "Lease terms"),
    pending: T("Chiria și condițiile le transmitem în oferta comercială, după o primă verificare a formatului; pe site nu se publică.", "Ставку и условия передаём в коммерческом предложении после первичной проверки формата; на сайте они не публикуются.", "We send the rent and terms in a commercial proposal after a first check of your format; they are not published on the website."),
    // what the proposal answers — topics only, never values (AGENTS.md: no public rent or payment terms)
    covers: [T("chiria", "ставка", "rent"), T("TVA și utilitățile", "НДС и коммунальные платежи", "VAT and utilities"), T("cheltuielile de exploatare", "эксплуатационные расходы", "service costs"), T("perioada de amenajare", "период на отделку", "fit-out period"), T("indexarea", "индексация", "indexation"), T("durata contractului", "срок договора", "lease term"), T("firma", "вывеска", "signage"), T("starea la predare", "состояние при передаче", "handover condition")],
    // structured, rendered only when the OWNER confirms a value AND approves it for publication
    rows: [
      { key: "rent", label: T("Chiria", "Ставка аренды", "Rent"), value: null, evidence: "TO_CONFIRM", source: "The 2026 offer states a rate — not confirmed as current; never stored here", publish: false },
      { key: "vat", label: T("TVA", "НДС", "VAT"), value: null, evidence: "TO_CONFIRM", source: "Offer says incl. VAT, mandate says excl. VAT — conflicting", publish: false },
      { key: "utilities", label: T("Utilități", "Коммунальные платежи", "Utilities"), value: null, evidence: "TO_CONFIRM", source: OWNER, publish: false },
      { key: "service", label: T("Cheltuieli de exploatare", "Эксплуатационные расходы", "Service charge"), value: null, evidence: "TO_CONFIRM", source: OWNER, publish: false },
      { key: "security", label: T("Pază și întreținere", "Охрана и обслуживание", "Security and maintenance"), value: null, evidence: "TO_CONFIRM", source: OWNER, publish: false },
      { key: "fitout", label: T("Perioada de amenajare · vacanța de chirie", "Период на отделку · арендные каникулы", "Fit-out period · rent-free"), value: null, evidence: "TO_CONFIRM", source: "Mentioned in the offer — not confirmed", publish: false },
      { key: "deposit", label: T("Garanție", "Депозит или гарантия", "Deposit or guarantee"), value: null, evidence: "TO_CONFIRM", source: OWNER, publish: false },
      { key: "indexation", label: T("Indexare", "Индексация", "Indexation"), value: null, evidence: "TO_CONFIRM", source: OWNER, publish: false },
      { key: "term", label: T("Durata minimă", "Минимальный срок", "Minimum term"), value: null, evidence: "TO_CONFIRM", source: "The 2026 offer states a minimum term — not confirmed as current", publish: false },
      { key: "handover", label: T("Starea la predare", "Состояние при передаче", "Handover condition"), value: null, evidence: "TO_CONFIRM", source: OWNER, publish: false },
      { key: "signage", label: T("Firma", "Вывеска", "Signage"), value: null, evidence: "TO_CONFIRM", source: `${OWNER} §19`, publish: false },
    ],
  },

  plans: {
    kicker: T("Planuri și suprafețe", "Планы и площади", "Plans and areas"),
    title: T("Cum sunt organizați {area}.", "Как устроены {area}.", "How the {area} are organised."),
    levels: [
      {
        key: "ground",
        tab: T("Nivelul 1 · parter", "Уровень 1 · 1-й этаж", "Level 1 · ground floor"),
        label: T("Parter", "1-й этаж", "Ground floor"),
        mark: "±0,000",
        zones: [
          zone("hall-ground", "1", "sales", T("Sală comercială", "Торговый зал", "Sales hall"), 195.46, rect(12650, 0, 29800, 10600), [22200, 3600]),
          zone("corridor", "2", "corridor", T("Coridor · intrare de serviciu", "Коридор · служебный вход", "Corridor · service entrance"), 30.5, rect(24400, -12800, 27700, 0), [25300, -9600]),
          zone("wc-ground", "3", "wc", T("Grupuri sanitare și încăperi auxiliare", "Санузлы и подсобные помещения", "Washrooms and utility rooms"), 6.5, rect(26100, -6600, 27700, -2800), [26900, -4700]),
          zone("ramp", "4", "ramp", T("Rampa intrării de serviciu", "Пандус служебного входа", "Service entrance ramp"), 8.5, rect(24400, -15100, 27700, -12800), [26050, -13950]),
          zone("terrace", "5", "terrace", T("Terasă", "Терраса", "Terrace"), 91.03, rect(12650, 10800, 31400, 16000), [16200, 13500]),
          zone("stair-west-g", null, "stair", stairLabel, null, stairWest),
          zone("stair-east-g", null, "stair", stairLabel, null, stairEast),
        ],
        marks: [
          { key: "customer", kind: "customer", label: T("Intrarea clienților", "Вход для клиентов", "Customer entrance"), at: [21700, 10700], dir: "up" },
          { key: "street", kind: "street", label: T("Din trotuar: scări și rampă", "С тротуара: лестница и пандус", "From the pavement: steps and a ramp"), at: [21700, 16300], dir: "up" },
          { key: "service", kind: "service", label: T("Intrarea de serviciu", "Служебный вход", "Service entrance"), at: [26050, -15400], dir: "down" },
        ],
        columns: grid([0, 5600, 10600], [12650, 17900, 23700, 29800]),
      },
      {
        key: "lower",
        tab: T("Nivelul 2 · demisol", "Уровень 2 · цоколь", "Level 2 · lower ground"),
        label: T("Demisol", "Цоколь", "Lower ground"),
        mark: "−2,950",
        zones: [
          zone("hall-lower", "1", "sales", T("Sală comercială", "Торговый зал", "Sales hall"), 263.4, [[0, 0], [29800, 0], [29800, 10600], [12650, 10600], [12650, 5600], [0, 5600]], [8000, 2800]),
          zone("aux-lower", "2", "aux", T("Încăpere auxiliară", "Вспомогательное помещение", "Auxiliary room"), 20.97, rect(24800, -4600, 29100, -500), [26950, -2550]),
          zone("tech-lower", "3", "tech", T("Încăpere tehnică", "Техническое помещение", "Technical room"), 6.59, rect(22800, -4600, 24800, -500), [23800, -2550]),
          zone("wc-lower", "4", "wc", T("Grup sanitar", "Санузел", "Washroom"), 2.74, rect(29100, -4600, 30600, -2800), [29850, -3700]),
          zone("stair-west-l", null, "stair", stairLabel, null, stairWest),
          zone("stair-east-l", null, "stair", stairLabel, null, stairEast),
        ],
        marks: [],
        columns: [...grid([0, 5600], [0, 5950, 11900, 17900, 23700, 29800]), ...grid([10600], [12650, 17900, 23700, 29800])],
      },
    ],
    schemeTab: T("Schema generală", "Общая схема", "Overview"),
    note: T("Schema arată distribuția suprafețelor și nu înlocuiește planul arhitectural măsurat. Trasată după planurile arhitecturale ale nivelurilor.", "Схема показывает распределение площадей и не заменяет обмерный архитектурный план. Построена по архитектурным планам уровней.", "The scheme shows how the areas are distributed and does not replace a measured architectural plan. Traced from the architectural plans of both levels."),
    source: PLANS,
    marks: { ground: "±0,000", lower: "−2,950", evidence: "DOCUMENT_CONFIRMED", source: PLANS },
  },

  capex: {
    kicker: T("Baza capitală", "Капитальная база", "Capital base"),
    title: T("Investiți în afacerea dumneavoastră. Nu în refacerea de bază a spațiului.", "Вкладывайте в свой бизнес. Не в базовое восстановление помещения.", "Invest in your business. Not in restoring the space."),
    lead: T("Principalele lucrări capitale ale spațiului sunt deja executate.", "Основные капитальные работы по пространству уже выполнены.", "The main capital works on the space are already done."),
    body: T("Investiția dumneavoastră se concentrează pe brand, echipamente, mobilier, interior și adaptarea specializată.", "Ваши инвестиции концентрируются на бренде, оборудовании, мебели, интерьере и специализированной адаптации.", "Your investment concentrates on the brand, equipment, furniture, interior and specialised adaptation."),
    photo: "groundHall",
    readyTitle: T("Gata", "Готово", "Done"),
    ready: [
      fact(T("Suprafețe de bază: pardoseli, pereți, tavane", "Базовые поверхности: полы, стены, потолки", "Base surfaces: floors, walls, ceilings"), "OWNER_CONFIRMED", `${COMPACT} §1 · ${PHOTO}`),
      fact(T("Infrastructura inginerească existentă", "Существующая инженерная инфраструктура", "The existing engineering infrastructure"), "DOCUMENT_CONFIRMED", `${COMPACT} §1 · ${OWNER} §4`),
      fact(T("Scările dintre niveluri", "Лестницы между уровнями", "The stairs between the levels"), "OWNER_CONFIRMED", `${COMPACT} §1 · ${PHOTO} · ${PLANS}`),
      fact(T("Vitrina panoramică", "Панорамное остекление", "The panoramic glazing"), "OWNER_CONFIRMED", `${COMPACT} §1 · ${PHOTO}`),
      fact(T("Intrarea: scări și rampă", "Входная группа: лестница и пандус", "The entrance: steps and a ramp"), "OWNER_CONFIRMED", `${COMPACT} §1 · ${PHOTO}`),
      fact(T("Finisajul existent al încăperilor", "Существующая отделка помещений", "The existing finish of the rooms"), "OWNER_CONFIRMED", `${COMPACT} §1 · ${PHOTO}`),
    ],
    tenantTitle: T("Pentru afacerea dumneavoastră", "Под ваш бизнес", "For your business"),
    tenant: [
      fact(T("Brandul", "Бренд", "The brand"), "OWNER_CONFIRMED", "OWNER conversion brief 2026-11-06 §11"),
      fact(T("Echipamente", "Оборудование", "Equipment"), "OWNER_CONFIRMED", "OWNER conversion brief 2026-11-06 §11"),
      fact(T("Mobilier", "Мебель", "Furniture"), "OWNER_CONFIRMED", "OWNER conversion brief 2026-11-06 §11"),
      fact(T("Interiorul", "Интерьер", "The interior"), "OWNER_CONFIRMED", "OWNER conversion brief 2026-11-06 §11"),
      fact(T("Adaptarea specializată pentru format", "Специализированная адаптация под формат", "Specialised adaptation to the format"), "OWNER_CONFIRMED", "OWNER conversion brief 2026-11-06 §11"),
    ],
  },

  story: {
    kicker: T("Fotografii", "Фотографии", "Photographs"),
    title: T("Spațiul așa cum este astăzi.", "Пространство таким, какое оно есть сегодня.", "The space as it is today."),
    lead: T("Fotografii reale, finisajele fără retuș.", "Реальные фотографии, отделка без ретуши.", "Real photographs, the finish not retouched."),
    frames: [
      { key: "facade", shot: { photo: "frontage", position: "50% 92%" }, layout: "cinematic", label: T("Fațada și vitrina", "Фасад и витрина", "Facade and shop window"), caption: T("Vitrina continuă spre bulevard: spațiul se vede de pe trotuar.", "Сплошное остекление к бульвару: пространство видно с тротуара.", "Continuous glazing to the boulevard: the space is visible from the pavement.") },
      { key: "stairs", shot: { photo: "stairs", position: "62% 55%" }, layout: "vertical", label: T("Legătura nivelurilor", "Связь уровней", "Between the levels"), caption: T("Scara interioară leagă parterul de demisol.", "Внутренняя лестница соединяет 1-й этаж и цоколь.", "The internal staircase joins the ground floor and the lower ground.") },
      { key: "glazing", shot: { photo: "groundGlazing", position: "30% 50%" }, layout: "vertical", label: T("Parterul", "1-й этаж", "Ground floor"), caption: T("Sala de-a lungul vitrinei: lumină naturală, calorifere sub geam.", "Зал вдоль витрины: дневной свет, радиаторы под остеклением.", "The hall along the glazing: daylight, radiators under the windows.") },
      { key: "engineering", shot: { photo: "engineering", position: "52% 32%", zoom: 1.4 }, layout: "vertical", label: T("Ingineria", "Инженерия", "Engineering"), caption: T("Trasee de ventilație și indicatoare de ieșire — deja pe loc.", "Воздуховоды и указатели выходов — уже на месте.", "Ducts and exit signs — already in place.") },
      { key: "lower", shot: { photo: "lowerHall", position: "50% 55%" }, layout: "full", label: T("Demisolul", "Цоколь", "Lower ground"), caption: T("Al doilea nivel: o sală lungă cu pardoseală finisată și climatizare.", "Второй уровень: длинный зал с готовым полом и кондиционированием.", "The second level: a long hall with a finished floor and air-conditioning.") },
    ],
  },

  lens: {
    kicker: T("Formatul dumneavoastră", "Ваш формат", "Your format"),
    title: T("Ce afacere luați în considerare?", "Какой бизнес вы рассматриваете?", "Which business are you considering?"),
    lead: T("Vă dăm fapte, ca să puteți evalua potențialul locului pentru afacerea dumneavoastră.", "Мы даём вам факты, чтобы вы могли оценить потенциал точки именно для вашего бизнеса.", "We give you facts so you can judge the location's potential for your own business."),
    evidenceTitle: T("Ce spune în favoarea", "Что говорит в пользу", "What speaks for it"),
    checksTitle: T("Ce verificăm împreună", "Что проверим вместе", "What we check together"),
    scenarioNote: T("Scenariu posibil de organizare", "Возможный сценарий организации", "A possible way to organise it"),
    honesty: T("Dacă obiectul nu corespunde modelului dumneavoastră, e mai bine să aflați asta înainte de semnarea contractului.", "Если объект не соответствует вашей модели — лучше понять это до подписания договора.", "If the property does not match your model, it is better to know before signing."),
    regulated: T("Restaurant, clinică, servicii medicale și alte activități reglementate — doar după verificarea tehnică a ingineriei.", "Ресторан, клиника, медицинские услуги и другие регулируемые форматы — только после технической проверки инженерии.", "Restaurants, clinics, medical services and other regulated uses — only after a technical check of the engineering."),
    formats: [
      {
        key: "retail",
        label: T("Retail", "Ритейл", "Retail"),
        question: T("Mă vor observa clienții?", "Увидят ли меня мои клиенты?", "Will my customers notice me?"),
        evidence: [
          { text: T("Vitrină continuă spre bulevard — sala se vede de pe trotuar.", "Сплошное остекление к бульвару — зал виден с тротуара.", "Continuous glazing to the boulevard — the hall is visible from the pavement."), ref: "photos", evidence: "OWNER_CONFIRMED", source: PHOTO },
          { text: T("Prima linie a bulevardului Moscova, la colțul cu strada Matei Basarab.", "Первая линия бульвара Москова, угол с улицей Матей Басараб.", "The first line of Moscova Boulevard, at the corner of Matei Basarab Street."), ref: "location", evidence: "OWNER_CONFIRMED", source: `${OWNER} §12` },
          { text: T("Cartier rezidențial dens și mediu comercial format.", "Плотный жилой район и сформировавшаяся коммерческая среда.", "A dense residential district and an established commercial environment."), ref: "location", evidence: "OWNER_CONFIRMED", source: `${OWNER} §12` },
          { text: T("Transport public în apropiere.", "Общественный транспорт рядом.", "Public transport close by."), ref: "location", evidence: "OWNER_CONFIRMED", source: `${OWNER} §12` },
          { text: T("Intrare separată din stradă, prin terasă: scări și rampă.", "Отдельный вход с улицы через террасу: лестница и пандус.", "A separate street entrance through the terrace: steps and a ramp."), ref: "access", evidence: "OWNER_CONFIRMED", source: `${OWNER} §4 · ${PHOTO}` },
          { text: T("Sala la parter, depozitarea se poate organiza la demisol.", "Торговый зал на 1-м этаже, склад можно организовать в цоколе.", "The sales hall on the ground floor; storage can sit in the lower ground."), ref: "plans", evidence: "DOCUMENT_CONFIRMED", source: PLANS },
        ],
        checks: [T("formatul și dimensiunile firmei", "формат и размеры вывески", "signage format and size"), T("accesul transportului de marfă și orele de descărcare", "подъезд грузового транспорта и часы разгрузки", "delivery vehicle access and unloading hours"), T("programul de lucru", "режим работы", "opening hours")],
        scenario: [
          { label: T("Vitrina și intrarea", "Витрина и вход", "Shop window and entrance"), level: "ground", shape: rect(17900, 7600, 29800, 10600) },
          { label: T("Sala comercială", "Торговый зал", "Sales hall"), level: "ground", shape: [[12650, 0], [29800, 0], [29800, 7600], [17900, 7600], [17900, 8700], [14600, 8700], [14600, 6000], [12650, 6000]] },
          { label: T("Al doilea nivel comercial", "Второй торговый уровень", "Second sales level"), level: "lower", shape: lowerEast },
          { label: T("Depozitare și încăperi auxiliare", "Склад и подсобная часть", "Storage and back of house"), level: "lower", shape: rect(0, 0, 12650, 5600) },
        ],
      },
      {
        key: "showroom",
        label: T("Showroom", "Шоурум", "Showroom"),
        question: T("Poate spațiul să-mi arate produsul?", "Сможет ли пространство показать мой продукт?", "Can the space show my product?"),
        evidence: [
          { text: T("Două niveluri legate prin scări interioare.", "Два уровня, связанные внутренними лестницами.", "Two levels joined by internal stairs."), ref: "plans", evidence: "DOCUMENT_CONFIRMED", source: PLANS },
          { text: T("Săli deschise cu stâlpi pe o rețea regulată.", "Открытые залы с колоннами по регулярной сетке.", "Open halls with columns on a regular grid."), ref: "plans", evidence: "DOCUMENT_CONFIRMED", source: PLANS },
          { text: T("Lumină naturală prin vitrina panoramică a parterului.", "Дневной свет через панорамное остекление 1-го этажа.", "Daylight through the ground floor's panoramic glazing."), ref: "photos", evidence: "OWNER_CONFIRMED", source: PHOTO },
          { text: T("Intrare de serviciu separată, din spate — marfa nu trece prin sală.", "Отдельный служебный вход с тыльной стороны — товар не идёт через зал.", "A separate service entrance at the back — goods do not cross the hall."), ref: "access", evidence: "DOCUMENT_CONFIRMED", source: `${OFFER} · ${PLANS}` },
          { text: T("Înălțimea încăperilor — cca. 2,64 și 2,67 m.", "Высота помещений — ок. 2,64 и 2,67 м.", "Clear heights — approx. 2.64 and 2.67 m."), ref: "tech", evidence: "APPROXIMATE", source: `${OWNER} §4` },
        ],
        checks: [T("iluminatul expoziției — dotarea se clarifică", "освещение экспозиции — комплектация уточняется", "display lighting — fittings to be confirmed"), T("descărcarea mărfii voluminoase", "разгрузка крупногабаритного товара", "unloading of large goods"), T("formatul firmei", "формат вывески", "signage format")],
        scenario: [
          { label: T("Expoziție la vitrină", "Экспозиция у витрины", "Display at the window"), level: "ground", shape: groundHall },
          { label: T("Expoziție și negocieri", "Экспозиция и переговорная", "Display and meeting area"), level: "lower", shape: lowerEast },
          { label: T("Spațiu de depozitare a mărfii", "Склад товара", "Stock room"), level: "lower", shape: rect(0, 0, 12650, 5600) },
        ],
      },
      {
        key: "service",
        label: T("Servicii pentru clienți", "Клиентский сервис", "Client service"),
        question: T("Le va fi comod clienților să vină și să folosească serviciul?", "Будет ли клиенту удобно приехать и пользоваться услугой?", "Will clients find it easy to come and use the service?"),
        evidence: [
          { text: T("Transport public în apropiere; bulevardul este artera principală a sectorului.", "Общественный транспорт рядом; бульвар — основная транспортная артерия района.", "Public transport close by; the boulevard is the district's main artery."), ref: "location", evidence: "OWNER_CONFIRMED", source: `${OWNER} §12` },
          { text: T("Intrare din stradă prin terasă: scări și rampă.", "Вход с улицы через террасу: лестница и пандус.", "Entrance from the street through the terrace: steps and a ramp."), ref: "access", evidence: "OWNER_CONFIRMED", source: `${OWNER} §4 · ${PHOTO}` },
          { text: T("Zonă de parcare dedicată lângă obiect (numărul de locuri se clarifică).", "Выделенная парковочная зона у объекта (количество мест уточняется).", "A dedicated parking area by the property (number of spaces to be confirmed)."), ref: "location", evidence: "OWNER_CONFIRMED", source: "OWNER 2026-10-09" },
          { text: T("Primirea clienților la parter, partea de serviciu — la demisol.", "Приём клиентов на 1-м этаже, служебная часть — в цоколе.", "Client reception on the ground floor, the back office in the lower ground."), ref: "plans", evidence: "DOCUMENT_CONFIRMED", source: PLANS },
          { text: T("3 grupuri sanitare și duș, încălzire centralizată, climatizare.", "3 санузла и душевая, централизованное отопление, кондиционирование.", "3 washrooms and a shower, central heating, air-conditioning."), ref: "engineering", evidence: "DOCUMENT_CONFIRMED", source: `${OWNER} §4` },
        ],
        checks: [T("programul de lucru", "режим работы", "opening hours"), T("autorizațiile pentru activitatea dumneavoastră", "разрешения под ваш вид деятельности", "permits for your activity"), T("internetul și rețelele de curenți slabi — conectare individuală", "интернет и слаботочные сети — подключение индивидуально", "internet and low-current networks — connected individually")],
        scenario: [
          { label: T("Recepție și așteptare", "Ресепшн и ожидание", "Reception and waiting"), level: "ground", shape: rect(17900, 6400, 29800, 10600) },
          { label: T("Zona de servire", "Зона обслуживания", "Service area"), level: "ground", shape: [[12650, 0], [29800, 0], [29800, 6400], [17900, 6400], [17900, 8700], [14600, 8700], [14600, 6000], [12650, 6000]] },
          { label: T("Cabinete și partea de serviciu", "Кабинеты и служебная часть", "Rooms and back office"), level: "lower", shape: lowerHall },
        ],
      },
      {
        key: "office",
        label: T("Birou · centru pentru clienți", "Офис · клиентский центр", "Office · customer centre"),
        question: T("Se potrivește adresa și pentru echipă, și pentru clienți?", "Подходит ли адрес для команды и клиентов одновременно?", "Does the address work for the team and for clients at the same time?"),
        evidence: [
          { text: T("Se poate împărți: zona clienților la parter, locurile de muncă și partea de serviciu — la demisol.", "Можно разделить: клиентская зона на 1-м этаже, рабочие места и служебная часть — в цоколе.", "It can be split: the client area on the ground floor, workplaces and back office in the lower ground."), ref: "plans", evidence: "DOCUMENT_CONFIRMED", source: PLANS },
          { text: T("Intrare de serviciu separată, din spate.", "Отдельный служебный вход с тыльной стороны.", "A separate service entrance at the back."), ref: "access", evidence: "DOCUMENT_CONFIRMED", source: `${OFFER} · ${PLANS}` },
          { text: T("Transport public în apropiere — pentru angajați și clienți.", "Общественный транспорт рядом — для сотрудников и клиентов.", "Public transport close by — for staff and clients."), ref: "location", evidence: "OWNER_CONFIRMED", source: `${OWNER} §12` },
          { text: T("3 faze · 38 kW conform documentelor; climatizare; pază.", "3 фазы · 38 кВт по документам; кондиционирование; охрана.", "3 phases · 38 kW documented; air-conditioning; security."), ref: "engineering", evidence: "DOCUMENT_CONFIRMED", source: `${OWNER} §4 · ${NET}` },
        ],
        checks: [T("rezerva de putere pentru echipamente", "резерв мощности под оборудование", "power reserve for equipment"), T("internetul și rețelele de curenți slabi", "интернет и слаботочные сети", "internet and low-current networks"), T("numărul de locuri de muncă pentru procesul dumneavoastră", "количество рабочих мест под ваш процесс", "the number of workplaces for your process")],
        scenario: [
          { label: T("Zona clienților", "Клиентская зона", "Client area"), level: "ground", shape: rect(17900, 5600, 29800, 10600) },
          { label: T("Săli de negocieri", "Переговорные", "Meeting rooms"), level: "ground", shape: [[12650, 0], [29800, 0], [29800, 5600], [17900, 5600], [17900, 8700], [14600, 8700], [14600, 6000], [12650, 6000]] },
          { label: T("Locuri de muncă", "Рабочие места", "Workplaces"), level: "lower", shape: lowerHall },
        ],
      },
    ],
  },

  viewing: {
    kicker: T("Vizionare", "Просмотр", "Viewing"),
    title: T("Următorul pas — să vedeți spațiul personal.", "Следующий шаг — увидеть пространство лично.", "The next step is to see the space in person."),
    lead: T("Spuneți-ne cum funcționează afacerea dumneavoastră. Vă ajutăm să verificați dacă Moscova 20 i se potrivește.", "Расскажите, как работает ваш бизнес. Мы поможем проверить, соответствует ли ему Moscova 20.", "Tell us how your business works. We will help you check whether Moscova 20 fits it."),
    steps: [
      { title: T("Înainte de vizionare", "До просмотра", "Before the viewing"), lead: T("Clarificăm:", "Мы уточним:", "We clarify:"), items: [T("formatul afacerii", "формат бизнеса", "the business format"), T("cerințele tehnice cheie", "ключевые технические требования", "the key technical requirements"), T("suprafața necesară", "необходимую площадь", "the area needed"), T("termenul deschiderii", "срок открытия", "the opening date")] },
      { title: T("La vizionare", "На просмотре", "At the viewing"), lead: T("Arătăm:", "Покажем:", "We show:"), items: [T("spațiul", "пространство", "the space"), T("intrările", "входы", "the entrances"), T("punctele inginerești", "инженерные точки", "the engineering points"), T("planurile", "планы", "the plans"), T("accesul", "доступ", "access")] },
      { title: T("După vizionare", "После просмотра", "After the viewing"), lead: T("Dacă obiectul se potrivește:", "Если объект подходит:", "If the property fits:"), items: [T("fixăm întrebările", "фиксируем вопросы", "we record the questions"), T("verificăm cerințele tehnice", "проверяем технические требования", "we check the technical requirements"), T("trecem la condițiile comerciale", "переходим к коммерческим условиям", "we move on to the commercial terms")] },
    ],
    photo: "entrance",
    contactsLine: T("Sau direct:", "Или напрямую:", "Or directly:"),
    // the film «Ваш следующий шаг» plugs in here when it exists — poster first, plays on request, never autoplay
    film: null,
  },
};
