import { T, type Evidence, type LeasingExperience, type Photo } from "@/data/leasing-experience-model";
import { publicAsset } from "@/lib/site-data";

/**
 * MOSCOVA 20 · M20-01 — content of the gold-standard leasing page
 * (OWNER mandate 2026-11-06). Status, dates, marketed / useful area and the
 * level breakdown are NOT here: they live in the unit record
 * (src/data/leasing-inventory.ts → moscova-20-corner), the single source.
 *
 * Sources (internal, never shown):
 *   OWNER — the mandate of 2026-11-06 (§3–4 confirmed data, §12 public
 *           location wording, §18–19 confirmed / to-confirm split)
 *   DOC   — Moscova_20_Commercial_Offer_RU.pdf (access, logistics, finish);
 *           Certificat contabil rețele exterioare (30.09.2026: external power,
 *           water, sewer, heating networks); architectural plans 0.000 / −2.950
 *   PHOTO — the twelve OWNER photographs of 16.10.2026 (current condition)
 *   HIST  — the historical Rîșcani market study (background only, §12–14)
 * The commercial offer's rate and its 50 kVA power figure are NOT
 * used: the rate is not confirmed as current (§25), the power figure conflicts
 * with the documented 38 kW (§4).
 */

const OWNER = "OWNER mandate 2026-11-06";
const OFFER = "Commercial offer Moscova 20 (RU, 2026) — confirmed by the OWNER mandate";
const PHOTO = "OWNER photographs 16.10.2026 — current condition";
const NET = "Certificat contabil — rețele tehnico-edilitare exterioare, 30.09.2026";
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
  frontage: photo("m20-frontage", 1278, 959, T("Moscova 20 de sus: fațada vitrată, intrarea cu scări și rampă, trotuarul și bulevardul", "Moscova 20 сверху: остеклённый фасад, вход с лестницей и пандусом, тротуар и бульвар", "Moscova 20 from above: the glazed frontage, the entrance with steps and ramp, the pavement and the boulevard"), { mobile: publicAsset(`${dir}/m20-frontage-mobile.webp`), position: "50% 62%" }),
  context: photo("m20-context", 1278, 959, T("Bulevardul Moscova, blocurile de locuit și obiectul pe prima linie", "Бульвар Москова, жилой массив и объект на первой линии", "Moscova Boulevard, the housing blocks and the property on the first line")),
  facade: photo("m20-facade", 1278, 959, T("Fațada: vitrina continuă și banda de fațadă deasupra ei", "Фасад: сплошная витрина и фасадная полоса над ней", "The facade: the continuous shop window and the fascia above it"), { position: "50% 60%" }),
  entrance: photo("m20-entrance", 1600, 1066, T("Intrarea: scări, rampă și ușa de sticlă", "Вход: лестница, пандус и стеклянная дверь", "The entrance: steps, ramp and the glass door")),
  groundHall: photo("m20-ground-hall", 1600, 1066, T("Parterul astăzi: gresie, pereți vopsiți, calorifere, climatizare tip casetă, trasee de ventilație", "1-й этаж сегодня: плитка, окрашенные стены, радиаторы, кассетный кондиционер, трассы вентиляции", "The ground floor today: tiles, painted walls, radiators, cassette air-conditioning, ventilation ducts")),
  groundGlazing: photo("m20-ground-glazing", 1600, 1066, T("Parterul de-a lungul vitrinei: calorifere sub geam și golul scării spre demisol", "1-й этаж вдоль витрины: радиаторы под остеклением и проём лестницы в цоколь", "The ground floor along the glazing: radiators under the windows and the stair opening to the lower ground")),
  stairs: photo("m20-stairs", 1600, 1066, T("Scara interioară dintre parter și demisol", "Внутренняя лестница между 1-м этажом и цоколем", "The internal staircase between the ground floor and the lower ground")),
  lowerHall: photo("m20-lower-hall", 1600, 1066, T("Demisolul: o sală lungă cu pardoseală finisată și climatizare", "Цоколь: длинный зал с готовым полом и кондиционированием", "The lower ground: a long hall with a finished floor and air-conditioning")),
  lowerFinish: photo("m20-lower-finish", 1600, 1066, T("Demisolul: aceeași finisare, calorifere, indicatoare de ieșire", "Цоколь: та же отделка, радиаторы, указатели выходов", "The lower ground: the same finish, radiators, exit signs")),
  lowerService: photo("m20-lower-service", 1600, 1066, T("Demisolul: spațiu de depozitare și zone de serviciu", "Цоколь: место для склада и служебных зон", "The lower ground: room for storage and service areas")),
  engineering: photo("m20-engineering", 1600, 1066, T("Trasee de ventilație, indicator de ieșire și scara de evacuare în demisol", "Трассы вентиляции, указатель выхода и лестница в цоколе", "Ventilation ducts, an exit sign and the staircase in the lower ground")),
  lowerStairs: photo("m20-lower-stairs", 1600, 1066, T("Demisolul gol, pregătit pentru conceptul chiriașului", "Пустой цоколь, готовый к концепции арендатора", "The empty lower ground, ready for the tenant's concept")),
  approach: photo("m20-approach", 1278, 959, T("Cum se ajunge: trotuarul, scările și rampa spre intrare", "Как подойти: тротуар, лестница и пандус к входу", "How you arrive: the pavement, the steps and the ramp to the entrance"), { position: "40% 60%" }),
};

export const moscova20Experience: LeasingExperience = {
  unitId: "moscova-20-corner",
  project: "moscova-20",
  address: T("Bd. Moscova 20", "бул. Москова, 20", "20 Moscova Blvd"),
  photos,

  hero: {
    // the facade frame: glazing, entrance, steps + ramp, terrace and street read in two seconds
    photo: "facade",
    title: T("Spațiu comercial de colț pe prima linie.", "Угловое коммерческое пространство на первой линии.", "A corner commercial space on the first line."),
    place: T("Rîșcani · Chișinău", "Рышкань · Кишинёв", "Rîșcani · Chișinău"),
  },

  capex: {
    kicker: T("Starea spațiului", "Состояние помещения", "Condition"),
    title: T("Baza capitală este deja gata.", "Капитальная база уже готова.", "The capital base is already in place."),
    body: [
      T("Spațiul este renovat și are infrastructura inginerească de bază.", "Помещение отремонтировано и имеет базовую инженерную инфраструктуру.", "The space is renovated and has its basic engineering infrastructure."),
      T("Investiția principală a chiriașului nu merge în refacerea obiectului, ci în propriul concept, brand, echipamente și adaptarea specializată.", "Основные вложения арендатора — не в восстановление объекта, а в собственную концепцию, бренд, оборудование и специализированную адаптацию.", "The tenant's main investment goes not into restoring the property but into its own concept, brand, equipment and specialised adaptation."),
    ],
    note: T("Nu este un spațiu „la beton”. Volumul lucrărilor dumneavoastră depinde de concept.", "Это не помещение «в бетоне». Объём ваших работ зависит от концепции.", "This is not a bare concrete shell. The scope of your works depends on your concept."),
    photo: "groundHall",
    photoCaption: T("Parterul astăzi — fotografie reală, fără retuș al finisajelor.", "1-й этаж сегодня — реальная фотография, отделка как есть.", "The ground floor today — a real photograph, the finish as it is."),
    secondPhoto: "lowerFinish",
    secondCaption: T("Demisolul: aceeași finisare, calorifere, ieșiri marcate.", "Цоколь: та же отделка, радиаторы, обозначенные выходы.", "The lower ground: the same finish, radiators, marked exits."),
    readyTitle: T("În ce nu trebuie să investiți din nou", "Во что не нужно инвестировать заново", "What you do not have to invest in again"),
    ready: [
      fact(T("Finisaj de bază: pereți și tavane", "Базовая отделка стен и потолков", "Basic finish of walls and ceilings"), "OWNER_CONFIRMED", `${OWNER} §19 · ${PHOTO}`),
      fact(T("Pardoseli finisate pe ambele niveluri", "Готовые полы на обоих уровнях", "Finished floors on both levels"), "OWNER_CONFIRMED", `${OWNER} §19 · ${PHOTO}`),
      fact(T("Încălzire centralizată, calorifere montate", "Централизованное отопление, радиаторы установлены", "Central heating, radiators installed"), "OWNER_CONFIRMED", `${OWNER} §4 · ${PHOTO}`),
      fact(T("Ventilație și climatizare de bază", "Базовая вентиляция и кондиционирование", "Basic ventilation and air-conditioning"), "DOCUMENT_CONFIRMED", `${OWNER} §4`),
      fact(T("3 grupuri sanitare și duș", "3 санузла и душевая", "3 washrooms and a shower"), "DOCUMENT_CONFIRMED", `${OWNER} §4`),
      fact(T("Scara interioară dintre niveluri", "Внутренняя лестница между уровнями", "The internal staircase between levels"), "OWNER_CONFIRMED", `${OWNER} §4 · ${PHOTO}`),
      fact(T("Intrarea și rampa", "Входная группа и пандус", "The entrance and the ramp"), "OWNER_CONFIRMED", `${OWNER} §4 · ${PHOTO}`),
      fact(T("Alimentare electrică: 3 faze, 38 kW conform documentelor", "Электроснабжение: 3 фазы, 38 кВт по документам", "Power: 3 phases, 38 kW documented"), "DOCUMENT_CONFIRMED", `${OWNER} §4`),
      fact(T("Sistem de pază existent", "Существующая система охраны", "An existing security system"), "DOCUMENT_CONFIRMED", `${OWNER} §4`),
    ],
    tenantTitle: T("Ce rămâne în sarcina chiriașului", "Что остаётся за арендатором", "What stays with the tenant"),
    tenant: [
      fact(T("Interiorul de brand", "Фирменный интерьер", "The brand interior"), "OWNER_CONFIRMED", `${OWNER} §9`),
      fact(T("Firma — după aprobare", "Вывеска — по согласованию", "Signage — subject to approval"), "OWNER_CONFIRMED", `${OWNER} §9`),
      fact(T("Mobilier", "Мебель", "Furniture"), "OWNER_CONFIRMED", `${OWNER} §9`),
      fact(T("Echipament comercial", "Торговое оборудование", "Retail equipment"), "OWNER_CONFIRMED", `${OWNER} §9`),
      fact(T("IT și internet — conectare individuală", "IT и интернет — подключение индивидуально", "IT and internet — connected individually"), "OWNER_CONFIRMED", `${OWNER} §4, §9`),
      fact(T("Inginerie specializată pentru format", "Специализированная инженерия под формат", "Specialised engineering for the format"), "OWNER_CONFIRMED", `${OWNER} §9`),
      fact(T("Adaptarea la formatul concret", "Адаптация под конкретный формат", "Adaptation to the specific format"), "OWNER_CONFIRMED", `${OWNER} §9`),
    ],
  },

  fit: {
    kicker: T("Compatibilitatea formatelor", "Совместимость форматов", "Format fit"),
    title: T("Se potrivește Moscova 20\nafacerii dumneavoastră?", "Подойдёт ли Moscova 20\nвашему бизнесу?", "Is Moscova 20\nright for your business?"),
    lead: T("Nu spunem că spațiul se potrivește oricui. Mai jos — unde este puternic și ce trebuie verificat din timp.", "Мы не утверждаем, что помещение подходит всем. Ниже — где оно сильное и что стоит проверить заранее.", "We do not claim the space suits everyone. Below — where it is strong and what to check in advance."),
    rows: [
      {
        key: "retail",
        use: T("Retail · magazin specializat", "Ритейл · специализированный магазин", "Retail · specialist store"),
        level: "strong",
        reasons: [T("vizibilitate de pe bulevard", "видимость с бульвара", "visibility from the boulevard"), T("fațadă-vitrină", "витринный фасад", "a shop-window frontage"), T("sală la parter", "торговый зал на 1-м этаже", "a ground-floor sales floor"), T("două niveluri: sala și depozitul se pot separa", "два уровня: зал и склад можно разделить", "two levels: sales and storage can be separated")],
        checks: [T("formatul firmei", "формат вывески", "the signage format"), T("accesul transportului de marfă și orele de descărcare", "подъезд грузового транспорта и часы разгрузки", "delivery vehicle access and unloading hours")],
        note: null,
        evidence: "OWNER_CONFIRMED",
        source: `${OWNER} §10`,
      },
      {
        key: "showroom",
        use: T("Showroom", "Шоурум", "Showroom"),
        level: "strong",
        reasons: [T("spațiu pentru expoziție", "пространство для экспозиции", "room for display"), T("vitrină", "витрина", "a shop window"), T("intrare separată", "отдельный вход", "a separate entrance"), T("showroom la parter, zona de serviciu la demisol", "шоурум на 1-м этаже, служебная зона в цоколе", "showroom on the ground floor, back-of-house below")],
        checks: [T("formatul firmei", "формат вывески", "the signage format"), T("iluminatul expoziției — dotarea se clarifică", "освещение экспозиции — комплектация уточняется", "display lighting — fittings to be confirmed")],
        note: null,
        evidence: "OWNER_CONFIRMED",
        source: `${OWNER} §10`,
      },
      {
        key: "services",
        use: T("Birou pentru clienți · servicii", "Клиентский офис · сервисы", "Client office · services"),
        level: "good",
        reasons: [T("intrare separată", "отдельный вход", "a separate entrance"), T("locație urbană", "городская локация", "an urban location"), T("primire la parter", "приём клиентов на 1-м этаже", "client reception on the ground floor"), T("zonare pe două niveluri", "зонирование на двух уровнях", "zoning on two levels")],
        checks: [T("internetul și rețelele de curenți slabi — conectare individuală", "интернет и слаботочные сети — подключение индивидуально", "internet and low-current networks — connected individually"), T("zonarea pentru procesul dumneavoastră", "зонирование под ваш процесс", "zoning for your process")],
        note: null,
        evidence: "OWNER_CONFIRMED",
        source: `${OWNER} §10`,
      },
      {
        key: "fnb",
        use: T("Cafenea · restaurant", "Кафе · ресторан", "Café · restaurant"),
        level: "check",
        reasons: [T("terasă la intrare", "терраса у входа", "a terrace at the entrance"), T("vizibilitate de pe bulevard", "видимость с бульвара", "visibility from the boulevard"), T("intrare separată", "отдельный вход", "a separate entrance")],
        checks: [T("hota și evacuarea aerului", "вытяжка", "extraction"), T("puterea electrică", "электрическая мощность", "electrical power"), T("cerințele sanitare", "санитарные требования", "sanitary requirements"), T("destinația permisă", "разрешённое использование", "permitted use"), T("regulile terasei", "правила использования террасы", "terrace rules")],
        note: T("Nu declarăm potrivirea fără o verificare pentru conceptul concret.", "Не заявляем пригодность без проверки под конкретную концепцию.", "We do not claim suitability without a check for the specific concept."),
        evidence: "TO_CONFIRM",
        source: `${OWNER} §10, §18 — extraction data conflicting`,
      },
    ],
  },

  location: {
    kicker: T("Locația", "Локация", "Location"),
    title: T("Un loc care se vede.", "Место, которое видно.", "A place people see."),
    lead: T("Intersecția bulevardului Moscova cu strada Matei Basarab, sectorul Rîșcani.", "Пересечение бульвара Москова и улицы Матей Басараб, сектор Рышкань.", "The corner of Moscova Boulevard and Matei Basarab Street, Rîșcani district."),
    points: [
      fact(T("Cartier rezidențial dens", "Плотный жилой район", "A dense residential district"), "OWNER_CONFIRMED", `${OWNER} §12 — public wording; background: historical Rîșcani study`),
      fact(T("Artera principală de transport a sectorului", "Основная транспортная артерия района", "The district's main traffic artery"), "OWNER_CONFIRMED", `${OWNER} §12`),
      fact(T("Mediu comercial format", "Сформировавшаяся коммерческая среда", "An established commercial environment"), "OWNER_CONFIRMED", `${OWNER} §12`),
      fact(T("Transport public în apropiere", "Общественный транспорт рядом", "Public transport close by"), "OWNER_CONFIRMED", `${OWNER} §12`),
      fact(T("Vizibilitate ridicată", "Высокая визуальная заметность", "High visibility"), "OWNER_CONFIRMED", `${OWNER} §12`),
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
    kicker: T("Suprafețe", "Площади", "Areas"),
    title: T("Cum sunt organizați 625,7 m².", "Как устроены 625,7 м².", "How the 625.7 m² are organised."),
    propertyLine: T("Obiectul întreg — 704 m². Se oferă 625,7 m²; 78 m² sunt deja ocupați.", "Объект целиком — 704 м². Предлагается 625,7 м²; 78 м² уже заняты.", "The whole property is 704 m². On offer: 625.7 m²; 78 m² are already occupied."),
    levelsLine: T("Nivelurile sunt legate printr-o scară interioară; la intrare — rampă.", "Уровни связаны внутренней лестницей; у входа — пандус.", "The levels are linked by an internal staircase; a ramp at the entrance."),
    // §17: never marketed as confirmed — the component adds «Статус: уточняется» from the evidence class
    groundOnly: fact(T("Posibilitatea de a închiria doar parterul", "Возможность аренды только 1-го этажа", "Leasing the ground floor alone"), "TO_CONFIRM", `${OWNER} §17`),
  },

  story: {
    kicker: T("Fotografii", "Фотографии", "Photographs"),
    title: T("Spațiul așa cum este astăzi.", "Помещение таким, какое оно есть сегодня.", "The space as it is today."),
    lead: T("Fotografii reale: finisajele, ingineria și fațada — așa cum sunt.", "Реальные фотографии: отделка, инженерия и фасад — как есть.", "Real photographs: the finish, the engineering and the facade — as they are."),
    chapters: [
      { no: "01", photo: "context", layout: "wide", label: T("Orașul din jur", "Город вокруг", "The city around"), caption: T("Bulevardul Moscova, blocurile de locuit și parcarea de-a lungul fațadei.", "Бульвар Москова, жилой массив и парковка вдоль фасада.", "Moscova Boulevard, the housing blocks and parking along the frontage.") },
      { no: "02", photo: "frontage", layout: "pair-left", label: T("Fațada și vitrina", "Фасад и витрина", "Facade and shop window"), caption: T("Vitrină continuă spre stradă și banda de fațadă deasupra ei.", "Сплошное остекление вдоль улицы и фасадная полоса над ним.", "Continuous glazing to the street and the fascia above it.") },
      { no: "03", photo: "entrance", layout: "pair-right", label: T("Intrarea și terasa", "Вход и терраса", "Entrance and terrace"), caption: T("Intrare separată din stradă: scări și rampă. Terasa — 91,03 m².", "Отдельный вход с улицы: лестница и пандус. Терраса — 91,03 м².", "A separate street entrance: steps and a ramp. The terrace — 91.03 m².") },
      { no: "04", photo: "groundGlazing", layout: "wide", label: T("Parterul", "1-й этаж", "Ground floor"), caption: T("Sala de-a lungul vitrinei: calorifere sub geam, golul scării spre demisol.", "Зал вдоль витрины: радиаторы под остеклением, проём лестницы в цоколь.", "The hall along the glazing: radiators under the windows, the stair opening to the lower ground.") },
      { no: "05", photo: "stairs", layout: "inset", label: T("Legătura dintre niveluri", "Связь уровней", "Between the levels"), caption: T("Scara interioară leagă parterul de demisol.", "Внутренняя лестница соединяет 1-й этаж и цоколь.", "The internal staircase links the ground floor and the lower ground.") },
      { no: "06", photo: "lowerHall", layout: "full", label: T("Demisolul", "Цоколь", "Lower ground"), caption: T("Al doilea nivel comercial: 293,70 m², dintre care 263,40 m² utili.", "Второй торговый уровень: 293,70 м², из них полезных 263,40 м².", "The second sales level: 293.70 m², of which 263.40 m² useful.") },
      { no: "07", photo: "engineering", layout: "pair-left", label: T("Ingineria", "Инженерия", "Engineering"), caption: T("Trasee de ventilație, indicatoare de ieșire, calorifere — deja pe loc.", "Трассы вентиляции, указатели выходов, радиаторы — уже на месте.", "Ventilation ducts, exit signs, radiators — already in place.") },
      { no: "08", photo: "lowerService", layout: "pair-right", label: T("Zone de serviciu", "Служебные зоны", "Service areas"), caption: T("La demisol — loc pentru depozitare și încăperi de serviciu.", "В цоколе — место для склада и служебных помещений.", "In the lower ground — room for storage and service rooms.") },
    ],
  },

  access: {
    kicker: T("Acces și logistică", "Доступ и логистика", "Access and logistics"),
    title: T("Cum vine clientul și cum sosește marfa.", "Как приходит клиент и как приезжает товар.", "How customers arrive and how goods come in."),
    photo: "approach",
    photoCaption: T("De pe trotuar: scări și rampă spre intrare.", "С тротуара: лестница и пандус к входу.", "From the pavement: steps and a ramp to the entrance."),
    rows: [
      { key: "customer", label: T("Intrarea clienților", "Вход для клиентов", "Customer entrance"), value: T("Intrare separată din stradă; scări și rampă.", "Отдельный вход с улицы; лестница и пандус.", "A separate street entrance; steps and a ramp."), state: "ready", evidence: "OWNER_CONFIRMED", source: `${OWNER} §4, §7 · ${PHOTO}` },
      { key: "service", label: T("Acces de serviciu", "Служебный доступ", "Service access"), value: T("Acces de serviciu separat — marfa nu se intersectează cu clienții.", "Отдельный служебный доступ — товар не пересекается с покупателями.", "Separate service access — goods do not cross the customers' path."), state: "ready", evidence: "DOCUMENT_CONFIRMED", source: OFFER },
      { key: "delivery", label: T("Descărcare și depozitare", "Разгрузка и склад", "Unloading and storage"), value: T("Depozitul se poate organiza la demisol, lângă zonele de serviciu. Accesul transportului de marfă și orele de descărcare — se clarifică.", "Склад можно организовать в цоколе, рядом со служебными зонами. Подъезд грузового транспорта и часы разгрузки — уточняются.", "Storage can sit in the lower ground, next to the service areas. Access for delivery vehicles and unloading hours — to be confirmed."), state: "confirm", evidence: "DOCUMENT_CONFIRMED", source: `${OFFER} — vehicle access TO_CONFIRM` },
      { key: "parking", label: T("Parcare", "Парковка", "Parking"), value: T("Zonă de parcare dedicată lângă obiect; numărul de locuri se clarifică.", "Выделенная парковочная зона у объекта; количество мест уточняется.", "A dedicated parking area by the property; the number of spaces to be confirmed."), state: "ready", evidence: "OWNER_CONFIRMED", source: "OWNER 2026-10-09 (dedicated parking confirmed; count not)" },
      { key: "signage", label: T("Firmă", "Вывеска", "Signage"), value: T("Fațada oferă loc pentru firmă; formatul, dimensiunile și aprobarea — se clarifică.", "Фасад даёт место для вывески; формат, размеры и согласование — уточняются.", "The facade has room for signage; format, size and approval — to be confirmed."), state: "confirm", evidence: "DOCUMENT_CONFIRMED", source: `${OFFER} — format TO_CONFIRM (${OWNER} §19)` },
      { key: "exits", label: T("Ieșiri", "Выходы", "Exits"), value: T("3 ieșiri, conform documentelor.", "3 выхода по документам.", "3 exits, documented."), state: "ready", evidence: "DOCUMENT_CONFIRMED", source: `${OWNER} §4` },
    ],
  },

  engineering: {
    kicker: T("Pregătirea inginerească", "Инженерная готовность", "Engineering readiness"),
    title: T("Ce funcționează deja și ce verificăm pentru format.", "Что уже работает и что проверяем под формат.", "What already works and what we check for your format."),
    rows: [
      { key: "power", label: T("Alimentare electrică", "Электроснабжение", "Power"), value: T("3 faze · 38 kW conform documentelor", "3 фазы · 38 кВт по документам", "3 phases · 38 kW documented"), state: "ready", evidence: "DOCUMENT_CONFIRMED", source: `${OWNER} §4 · ${NET}` },
      { key: "reserve", label: T("Rezervă suplimentară de putere", "Дополнительный резерв мощности", "Additional power reserve"), value: T("Se clarifică pentru formatul dumneavoastră", "Уточняется под ваш формат", "Confirmed for your format"), state: "confirm", evidence: "TO_CONFIRM", source: `${OWNER} §19` },
      { key: "heating", label: T("Încălzire", "Отопление", "Heating"), value: T("Centralizată; calorifere pe ambele niveluri", "Централизованное; радиаторы на обоих уровнях", "Central; radiators on both levels"), state: "ready", evidence: "OWNER_CONFIRMED", source: `${OWNER} §4 · ${PHOTO} · ${NET}` },
      { key: "ventilation", label: T("Ventilație și climatizare", "Вентиляция и кондиционирование", "Ventilation and air-conditioning"), value: T("Sistem existent: trasee de aer, aparate de climatizare", "Существующая система: воздуховоды, кондиционеры", "Existing system: ducts, air-conditioning units"), state: "ready", evidence: "DOCUMENT_CONFIRMED", source: `${OWNER} §4 · ${PHOTO}` },
      { key: "extraction", label: T("Hotă / evacuare separată", "Вытяжка", "Extraction"), value: T("Necesită confirmare pentru formatul concret", "Требует подтверждения под конкретный формат", "Needs confirmation for the specific format"), state: "confirm", evidence: "TO_CONFIRM", source: `${OWNER} §4, §18 — conflicting source data` },
      { key: "water", label: T("Apă și canalizare", "Водоснабжение и канализация", "Water and sewer"), value: T("Conectate: 3 grupuri sanitare și duș", "Подключены: 3 санузла и душевая", "Connected: 3 washrooms and a shower"), state: "ready", evidence: "DOCUMENT_CONFIRMED", source: `${OWNER} §4 · ${NET}` },
      { key: "internet", label: T("Curenți slabi și internet", "Слаботочные сети и интернет", "Low-current and internet"), value: T("Traseele există; internetul îl conectează chiriașul", "Трассы есть; интернет арендатор подключает сам", "Routes in place; the tenant connects the internet"), state: "tenant", evidence: "OWNER_CONFIRMED", source: `${OWNER} §4, §18` },
      { key: "fire", label: T("Siguranță la incendiu", "Пожарная безопасность", "Fire safety"), value: T("3 ieșiri, indicatoare de ieșire", "3 выхода, указатели выходов", "3 exits, exit signs"), state: "ready", evidence: "DOCUMENT_CONFIRMED", source: `${OWNER} §4 · ${PHOTO}` },
      { key: "security", label: T("Pază", "Охрана", "Security"), value: T("Sistem de pază existent", "Существующая система охраны", "An existing security system"), state: "ready", evidence: "DOCUMENT_CONFIRMED", source: `${OWNER} §4` },
      { key: "height", label: T("Înălțime liberă", "Высота помещений", "Clear height"), value: T("parter cca. 2,64 m · demisol cca. 2,67 m", "1-й этаж ок. 2,64 м · цоколь ок. 2,67 м", "ground approx. 2.64 m · lower ground approx. 2.67 m"), state: "fact", evidence: "APPROXIMATE", source: `${OWNER} §4` },
      { key: "lighting", label: T("Iluminat", "Освещение", "Lighting"), value: T("Ieșiri de cablu pentru corpuri de iluminat; dotarea se clarifică", "Выводы под светильники есть; комплектация уточняется", "Cable leads for luminaires in place; fittings to be confirmed"), state: "confirm", evidence: "TO_CONFIRM", source: `${PHOTO} — luminaires not installed` },
    ],
    note: T("Pentru cafenea sau restaurant, hota și puterea se confirmă pentru conceptul concret.", "Для кафе или ресторана вытяжку и мощность подтверждаем под конкретную концепцию.", "For a café or restaurant, extraction and power are confirmed for the specific concept."),
  },

  ledger: {
    kicker: T("Transparența datelor", "Прозрачность данных", "What we know"),
    title: T("Ce știm deja.\nCe clarificăm pentru afacerea dumneavoastră.", "Что уже известно.\nЧто уточняем под ваш бизнес.", "What is known.\nWhat we confirm for your business."),
    knownTitle: T("Confirmat", "Подтверждено", "Confirmed"),
    known: [
      fact(T("Obiectul — 704 m²", "Объект — 704 м²", "Property — 704 m²"), "OWNER_CONFIRMED", "OWNER 2026-10-09"),
      fact(T("Suprafața oferită — 625,7 m²", "Предлагаемая площадь — 625,7 м²", "Area offered — 625.7 m²"), "OWNER_CONFIRMED", OWNER),
      fact(T("Parter 240,96 m² · demisol 293,70 m²", "1-й этаж 240,96 м² · цоколь 293,70 м²", "Ground 240.96 m² · lower ground 293.70 m²"), "OWNER_CONFIRMED", OWNER),
      fact(T("Terasă 91,03 m²", "Терраса 91,03 м²", "Terrace 91.03 m²"), "OWNER_CONFIRMED", OWNER),
      fact(T("Scară interioară", "Внутренняя лестница", "Internal staircase"), "OWNER_CONFIRMED", OWNER),
      fact(T("3 faze · 38 kW conform documentelor", "3 фазы · 38 кВт по документам", "3 phases · 38 kW documented"), "DOCUMENT_CONFIRMED", OWNER),
      fact(T("Încălzire centralizată", "Централизованное отопление", "Central heating"), "OWNER_CONFIRMED", OWNER),
      fact(T("Ventilație și climatizare de bază", "Базовая вентиляция и кондиционирование", "Basic ventilation and air-conditioning"), "DOCUMENT_CONFIRMED", OWNER),
      fact(T("3 ieșiri · rampă", "3 выхода · пандус", "3 exits · ramp"), "DOCUMENT_CONFIRMED", OWNER),
      fact(T("3 grupuri sanitare și duș", "3 санузла и душевая", "3 washrooms and a shower"), "DOCUMENT_CONFIRMED", OWNER),
      fact(T("Sistem de pază", "Система охраны", "Security system"), "DOCUMENT_CONFIRMED", OWNER),
      fact(T("Finisaje și pardoseli executate", "Выполненная отделка и полы", "Finish and floors completed"), "OWNER_CONFIRMED", OWNER),
    ],
    confirmTitle: T("Se clarifică", "Уточняем", "To confirm"),
    confirm: [
      fact(T("Hota / evacuarea", "Вытяжка", "Extraction"), "TO_CONFIRM", OWNER),
      fact(T("Rezerva suplimentară de putere", "Дополнительный резерв мощности", "Additional power reserve"), "TO_CONFIRM", OWNER),
      fact(T("Formatul firmei", "Формат вывески", "Signage format"), "TO_CONFIRM", OWNER),
      fact(T("Închirierea doar a parterului", "Аренда только 1-го этажа", "Ground floor alone"), "TO_CONFIRM", OWNER),
      fact(T("Compatibilitatea tehnică cu formatul dumneavoastră", "Техническая совместимость с вашим форматом", "Technical fit with your format"), "TO_CONFIRM", OWNER),
      fact(T("Restricții de program", "Ограничения по часам работы", "Opening-hours restrictions"), "TO_CONFIRM", OWNER),
      fact(T("Regulile de folosire a terasei", "Правила использования террасы", "Terrace use rules"), "TO_CONFIRM", OWNER),
      fact(T("Autorizații pentru activitatea dumneavoastră", "Разрешения под ваш вид деятельности", "Permits for your activity"), "TO_CONFIRM", OWNER),
      fact(T("Dotarea cu corpuri de iluminat", "Комплектация освещения", "Lighting fittings"), "TO_CONFIRM", PHOTO),
    ],
  },

  scheme: {
    kicker: T("Schema suprafețelor", "Схема площадей", "Area scheme"),
    title: T("625,7 m² pe niveluri.", "625,7 м² по уровням.", "625.7 m² by level."),
    note: T("Schema arată distribuția suprafețelor și nu înlocuiește planul arhitectural măsurat.", "Схема показывает распределение площадей и не заменяет обмерный архитектурный план.", "The scheme shows how the areas are distributed and does not replace a measured architectural plan."),
    plans: fact(T("Planurile arhitecturale ale nivelurilor — la cerere.", "Архитектурные планы уровней передаём по запросу.", "Architectural plans of both levels — on request."), "DOCUMENT_CONFIRMED", "Plan_0.000 / Plan_-2.950 Moscova 20, Variant 1 (OWNER files)"),
    marks: { ground: "±0,000", lower: "−2,950", evidence: "DOCUMENT_CONFIRMED", source: "Plan_0.000 / Plan_-2.950 Moscova 20, Variant 1 (OWNER files)" },
  },

  terms: {
    kicker: T("Condiții de închiriere", "Условия аренды", "Lease terms"),
    title: T("Condiții de închiriere.", "Условия аренды.", "Lease terms."),
    lead: T("Chiria și condițiile le transmitem în oferta comercială, după o primă verificare a formatului. Oferta acoperă:", "Ставку и условия передаём в коммерческом предложении после первичной проверки формата. В нём будут:", "We send the rent and terms in a commercial proposal after a first check of your format. It covers:"),
    pending: T("Condițiile nu se publică pe site.", "На сайте условия не публикуются.", "Terms are not published on the website."),
    // what the proposal answers — topics only, never values (§25, AGENTS.md: no public rent or payment terms)
    covers: [
      T("chiria", "ставка аренды", "the rent"),
      T("TVA și utilitățile", "НДС и коммунальные платежи", "VAT and utilities"),
      T("cheltuielile de exploatare", "эксплуатационные расходы", "service costs"),
      T("perioada de amenajare", "период на отделку", "the fit-out period"),
      T("indexarea", "индексация", "indexation"),
      T("durata contractului", "срок договора", "the lease term"),
      T("firma", "вывеска", "signage"),
      T("starea la predare", "состояние при передаче", "the handover condition"),
    ],
    // §25, §27: structured, rendered only when the OWNER confirms a value
    rows: [
      { key: "rent", label: T("Chiria", "Ставка аренды", "Rent"), value: null, evidence: "TO_CONFIRM", source: "The 2026 offer states a rate — not confirmed as current (§25); never stored here", publish: false },
      { key: "vat", label: T("TVA", "НДС", "VAT"), value: null, evidence: "TO_CONFIRM", source: "Offer says incl. VAT, mandate says excl. VAT — conflicting", publish: false },
      { key: "utilities", label: T("Utilități", "Коммунальные платежи", "Utilities"), value: null, evidence: "TO_CONFIRM", source: OWNER, publish: false },
      { key: "service", label: T("Cheltuieli de exploatare", "Эксплуатационные расходы", "Service charge"), value: null, evidence: "TO_CONFIRM", source: OWNER, publish: false },
      { key: "security", label: T("Pază și întreținere", "Охрана и обслуживание", "Security and maintenance"), value: null, evidence: "TO_CONFIRM", source: OWNER, publish: false },
      { key: "fitout", label: T("Perioada de amenajare · vacanța de chirie", "Период на отделку · арендные каникулы", "Fit-out period · rent-free"), value: null, evidence: "TO_CONFIRM", source: "Mentioned in the offer — not confirmed", publish: false },
      { key: "deposit", label: T("Depozit sau garanție", "Депозит или гарантия", "Deposit or guarantee"), value: null, evidence: "TO_CONFIRM", source: OWNER, publish: false },
      { key: "indexation", label: T("Indexare", "Индексация", "Indexation"), value: null, evidence: "TO_CONFIRM", source: OWNER, publish: false },
      { key: "term", label: T("Durata minimă", "Минимальный срок", "Minimum term"), value: null, evidence: "TO_CONFIRM", source: "The 2026 offer states a minimum term — not confirmed as current", publish: false },
      { key: "handover", label: T("Starea la predare", "Состояние при передаче", "Handover condition"), value: null, evidence: "TO_CONFIRM", source: OWNER, publish: false },
      { key: "signage", label: T("Firma", "Вывеска", "Signage"), value: null, evidence: "TO_CONFIRM", source: `${OWNER} §19`, publish: false },
    ],
  },

  opening: {
    kicker: T("Costul lansării", "Стоимость запуска", "Cost of opening"),
    title: T("Cât mai trebuie investit până la deschidere.", "Сколько ещё вложить до открытия.", "How much more to invest before opening."),
    lead: T("Nu dăm cifre — ele depind de conceptul dumneavoastră. Dar structura este clară din timp.", "Цифр не называем — они зависят от вашей концепции. Но структура понятна заранее.", "We give no figures — they depend on your concept. But the structure is clear in advance."),
    rows: [
      { key: "capital", label: T("Lucrări capitale de construcție", "Капитальные строительные работы", "Capital building works"), state: "done", note: T("În mare parte executate", "В основном уже выполнены", "Largely completed") },
      { key: "fitout", label: T("Amenajare pentru concept", "Отделка под концепцию", "Fit-out for the concept"), state: "concept", note: T("Depinde de concept", "Зависит от концепции", "Depends on the concept") },
      { key: "equipment", label: T("Echipamente", "Оборудование", "Equipment"), state: "tenant", note: T("Specifice chiriașului", "Под ваш формат", "Tenant-specific") },
      { key: "branding", label: T("Branding și firmă", "Брендинг и вывеска", "Branding and signage"), state: "tenant", note: T("Specifice chiriașului", "Под ваш бренд", "Tenant-specific") },
      { key: "engineering", label: T("Inginerie specială", "Специальная инженерия", "Special engineering"), state: "if-needed", note: T("Dacă formatul o cere", "Если её требует формат", "If the format needs it") },
      { key: "it", label: T("IT și comunicații", "IT и связь", "IT and communications"), state: "tenant", note: T("Specifice chiriașului", "Подключение индивидуально", "Tenant-specific") },
    ],
  },

  checks: {
    kicker: T("Înainte de decizie", "Перед решением", "Before you decide"),
    title: T("Ce trebuie verificat\nînainte de decizie.", "Что нужно проверить\nдо принятия решения.", "What to check\nbefore you decide."),
    lead: T("Fiecare afacere are ambițiile ei. Și întrebările ei către viitoarea adresă.", "У каждого бизнеса свои амбиции. И свои вопросы к будущему адресу.", "Every business has its ambitions. And its own questions for its next address."),
    // §16 / §28: shown as a professional landlord's checklist — what is known, what we verify together
    rows: [
      { key: "power", topic: T("Puterea", "Мощность", "Power"), known: T("3 faze, 38 kW conform documentelor.", "3 фазы, 38 кВт по документам.", "3 phases, 38 kW documented."), check: T("Dacă puterea ajunge pentru echipamentele dumneavoastră și dacă e nevoie de rezervă.", "Хватит ли мощности вашему оборудованию и нужен ли резерв.", "Whether the power covers your equipment and whether a reserve is needed."), anchor: "engineering" },
      { key: "extraction", topic: T("Hota", "Вытяжка", "Extraction"), known: T("Sursele diferă — nu o declarăm ca existentă.", "Данные источников расходятся — не заявляем её как готовую.", "The sources differ — we do not claim it as in place."), check: T("Posibilitatea hotei pentru conceptul dumneavoastră.", "Возможность вытяжки под вашу концепцию.", "Whether extraction is possible for your concept."), anchor: "engineering" },
      { key: "ventilation", topic: T("Ventilația pentru format", "Вентиляция под формат", "Ventilation for the format"), known: T("Sistem existent de ventilație și climatizare.", "Существующая система вентиляции и кондиционирования.", "An existing ventilation and air-conditioning system."), check: T("Dacă schimbul de aer ajunge pentru formatul dumneavoastră.", "Достаточен ли воздухообмен для вашего формата.", "Whether the air exchange is enough for your format."), anchor: "engineering" },
      { key: "fire", topic: T("Cerințe de incendiu", "Пожарные требования", "Fire requirements"), known: T("3 ieșiri conform documentelor, indicatoare de ieșire.", "3 выхода по документам, указатели выходов.", "3 exits documented, exit signs."), check: T("Cerințele pentru activitatea și numărul de vizitatori.", "Требования под ваш вид деятельности и число посетителей.", "The requirements for your activity and visitor numbers."), anchor: "engineering" },
      { key: "sanitary", topic: T("Cerințe sanitare", "Санитарные требования", "Sanitary requirements"), known: T("3 grupuri sanitare și duș.", "3 санузла и душевая.", "3 washrooms and a shower."), check: T("Normele pentru formatul dumneavoastră — mai ales pentru alimentație publică.", "Нормы для вашего формата — особенно для общепита.", "The norms for your format — food service above all."), anchor: "engineering" },
      { key: "signage", topic: T("Firma", "Вывеска", "Signage"), known: T("Fațada oferă loc pentru firmă.", "Фасад даёт место для вывески.", "The facade has room for signage."), check: T("Formatul, dimensiunile și aprobarea.", "Формат, размеры и согласование.", "Format, size and approval."), anchor: "access" },
      { key: "delivery", topic: T("Livrările", "Доставка", "Deliveries"), known: T("Acces de serviciu separat; depozitul se poate organiza la demisol.", "Отдельный служебный доступ; склад можно разместить в цоколе.", "Separate service access; storage can sit in the lower ground."), check: T("Accesul transportului de marfă și orele de descărcare.", "Подъезд грузового транспорта и часы разгрузки.", "Delivery vehicle access and unloading hours."), anchor: "access" },
      { key: "terrace", topic: T("Terasa", "Терраса", "Terrace"), known: T("91,03 m² la intrare.", "91,03 м² у входа.", "91.03 m² at the entrance."), check: T("Regulile de folosire pentru formatul dumneavoastră.", "Правила использования под ваш формат.", "The rules of use for your format."), anchor: "area" },
      { key: "fitout", topic: T("Amenajarea", "Отделка под концепцию", "Fit-out"), known: T("Baza capitală și ingineria de bază sunt executate.", "Капитальная база и базовая инженерия выполнены.", "The capital base and basic engineering are done."), check: T("Volumul și graficul lucrărilor pentru conceptul dumneavoastră.", "Объём и график работ под вашу концепцию.", "The scope and schedule of works for your concept."), anchor: "capex" },
      { key: "permits", topic: T("Autorizații", "Разрешения", "Permits"), known: null, check: T("Ce autorizații cere activitatea dumneavoastră.", "Какие разрешения нужны под ваш вид деятельности.", "Which permits your activity needs."), anchor: undefined },
      { key: "hours", topic: T("Programul de lucru", "Режим работы", "Opening hours"), known: null, check: T("Restricții de program pentru formatul dumneavoastră.", "Ограничения по часам работы для вашего формата.", "Opening-hours restrictions for your format."), anchor: undefined },
    ],
  },

  campaign: {
    kicker: T("Moscova 20", "Moscova 20", "Moscova 20"),
    title: T("Următorul dumneavoastră pas.", "Ваш следующий шаг.", "Your next step."),
    line: T("Orașul ține minte branduri. Nu metri pătrați.", "Город запоминает бренды. Не квадратные метры.", "A city remembers brands. Not square metres."),
    lead: T("Spațiul este gol și gata pentru conceptul dumneavoastră. Restul paginii — dovezile.", "Пространство пустое и готово к вашей концепции. Остальное на этой странице — доказательства.", "The space is empty and ready for your concept. The rest of this page is the evidence."),
    cta: T("Verificați dacă Moscova 20 se potrivește afacerii dumneavoastră", "Проверить, подходит ли Moscova 20 вашему бизнесу", "Check whether Moscova 20 suits your business"),
    photo: "lowerStairs",
    // §22: the film «Ваш следующий шаг» plugs in here when it exists — poster first, plays on request, never an autoplay banner
    film: null,
  },

  viewing: {
    kicker: T("Vizionare", "Просмотр", "Viewing"),
    title: T("Următoarea dumneavoastră adresă este o decizie de afaceri.", "Ваш следующий адрес — это бизнес-решение.", "Your next address is a business decision."),
    lead: T("Spuneți-ne ce plănuiți să deschideți. Înainte de vizionare verificăm formatul și pregătim răspunsurile tehnice.", "Расскажите, что вы планируете открыть. До просмотра проверим формат и подготовим ответы на технические вопросы.", "Tell us what you plan to open. Before the viewing we check the format and prepare the technical answers."),
    contactsLine: T("Sau sunați direct:", "Или позвоните напрямую:", "Or call directly:"),
  },

  journey: {
    kicker: T("Ce urmează", "Что дальше", "What happens next"),
    title: T("De la cerere până la predarea spațiului.", "От запроса до передачи помещения.", "From request to handover."),
    steps: [
      { title: T("Cererea", "Запрос", "Request"), text: T("Ne spuneți despre afacere și cerințe.", "Вы рассказываете о бизнесе и требованиях.", "You tell us about the business and its requirements.") },
      { title: T("Verificarea formatului", "Предварительная проверка формата", "Format pre-check"), text: T("Comparăm cerințele cu datele tehnice ale spațiului.", "Сверяем требования с техническими данными помещения.", "We compare your requirements with the technical data.") },
      { title: T("Vizionarea", "Просмотр", "Viewing"), text: T("Arătăm ambele niveluri, intrarea, accesul de serviciu și ingineria.", "Показываем оба уровня, вход, служебный доступ и инженерию.", "We show both levels, the entrance, service access and engineering.") },
      { title: T("Condiții tehnice și comerciale", "Технические и коммерческие условия", "Technical and commercial terms"), text: T("Trimitem oferta comercială și răspundem la întrebările tehnice.", "Передаём коммерческое предложение и отвечаем на технические вопросы.", "We send the commercial proposal and answer the technical questions.") },
      { title: T("Agrearea", "Согласование", "Agreement"), text: T("Agreăm condițiile, firma și graficul lucrărilor.", "Согласуем условия, вывеску и график работ.", "We agree the terms, the signage and the works schedule.") },
      { title: T("Contract și predare", "Договор и передача", "Contract and handover"), text: T("Semnăm contractul și predăm spațiul.", "Подписываем договор и передаём помещение.", "We sign the lease and hand over the space.") },
    ],
    note: T("Termenele fiecărui pas depind de format și de volumul verificării.", "Сроки каждого шага зависят от формата и объёма проверки.", "The timing of each step depends on the format and the scope of the check."),
  },
};
