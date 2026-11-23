import { T, type LeasingExperience } from "@/data/leasing-experience-model";
import { OWNER_TEAM, contactsLine, fact, portfolioPhoto, sharedCost, sharedDrawers, sharedLens, sharedMotion, sharedPlans, sharedStory, sharedTerms, teamRow } from "@/data/leasing-experience-shared";

/**
 * CREANGĂ 78 — dataset of the leasing template (OWNER «LEASING TEMPLATE LOCK», 2026-11-10; the Moscova 20 master structure).
 * An operating asset, 100 % occupied (derived from the unit register), available area 0 m²: every scene stays, the actions
 * are the waiting list and the future availability; no current leasing economics while the building is fully let. The
 * district (Buiucani) is not confirmed and never shown. Cadastral number 0100514.140.01.120 · registered area 2 158,3 m²
 * (e-Cadastru). No technical value is confirmed — every technical topic reads «Подтверждается совместно с техническим
 * директором и архитектором». One OWNER photograph (960 px), shown at its size.
 */

const OWNER = "OWNER 2026-10-09 — operating property, 100 % occupied (derived from the unit register)";
const CAD = "OWNER record R3.3.1 §8 — cadastral number and registered area (e-Cadastru)";
const OSM = "OpenStreetMap — the streets around the property on the location map (src/data/location-maps.ts)";

export const creanga78Experience: LeasingExperience = {
  unitId: null,
  project: "creanga-78",
  address: T("Str. Ion Creangă 78", "ул. Иона Крянгэ, 78", "78 Ion Creangă St"),
  photos: {
    // OWNER «CREANGĂ 78 — OWNER PHOTOGRAPHY UPDATE» (2026-11-11): two OWNER-approved frontage photographs, used as supplied
    // (scripts/creanga-78-frontage.mjs) — the operating asset with its tenants' signs, customers and parking; no contractual claim
    building: portfolioPhoto("c78-building", "creanga-78-frontage-01", 1448, 1086, T("Fațada comercială Creangă 78 cu operatori în activitate: intrarea cu scări, rampa și parcarea din fața clădirii", "Коммерческий фасад Creangă 78 с действующими арендаторами: вход с лестницей, пандус и парковка перед зданием", "The Creangă 78 commercial frontage with operating tenants: the entrance steps, the ramp and the parking in front of the building"), "50% 55%"),
    buildingPhone: portfolioPhoto("c78-building-phone", "creanga-78-frontage-01-mobile", 869, 1086, T("Creangă 78: intrarea și fațada comercială", "Creangă 78: вход и коммерческий фасад", "Creangă 78: the entrance and the commercial frontage")),
    frontage: portfolioPhoto("c78-frontage", "creanga-78-frontage-02", 1672, 941, T("Imobilul comercial în exploatare Creangă 78: fațada dinspre parcare, intrarea și trecerea de pietoni", "Действующий коммерческий объект Creangă 78: фасад со стороны парковки, вход и пешеходный переход", "The operating Creangă 78 commercial property: the frontage from the parking side, the entrance and the crossing"), "50% 55%"),
  },
  ownerInput: ["operating detail", "interior (when a space frees up)", "context"],

  hero: {
    photo: "building",
    phonePhoto: "buildingPhone",
    title: T("Un imobil în exploatare, închiriat integral.", "Действующий объект, занятый полностью.", "An operating property, fully let."),
    place: T("Chișinău", "Кишинэу", "Chișinău"),
    offer: T("conform registrului · disponibil 0 m²", "площадь по реестру · свободно 0 м²", "registered area · 0 m² available"),
    support: T("Trimiteți o cerere — vă anunțăm când se eliberează un spațiu.", "Напишите нам — сообщим, когда освободится помещение.", "Write to us — we'll let you know when a space becomes available."),
  },
  cta: {
    primary: T("Înscrieți-vă pe lista de așteptare", "Встать в лист ожидания", "Join the waiting list"),
    secondary: { label: T("Discutați disponibilitatea viitoare", "Узнать, когда освободится помещение", "Discuss future availability"), href: "#viewing" },
  },
  figure: 2158.3,
  portals: {
    location: { label: T("Locație\nși acces", "Локация\nи доступ", "Location\nand access"), word: T("Unde se află imobilul", "Где находится объект", "Where the property is") },
    ready: { label: T("Imobil\nîn exploatare", "Действующий\nобъект", "Operating\nproperty"), word: T("Ce este confirmat", "Что подтверждено", "What is confirmed") },
    decision: { label: T("Lista\nde așteptare", "Лист\nожидания", "Waiting\nlist"), word: T("Când se eliberează un spațiu", "Когда освободится помещение", "When a space becomes available") },
  },
  summary: [
    { key: "occupancy", label: T("Ocupare", "Заполняемость", "Occupancy"), title: T("Ocupat 100 %", "Занят на 100 %", "100% occupied"), text: T("Nu sunt spații disponibile acum — suprafața disponibilă este 0 m².", "Свободных помещений сейчас нет — свободная площадь 0 м².", "No space is available right now (0 m²).") },
    { key: "area", label: T("Suprafață", "Площадь", "Area"), title: T("{area} înregistrați", "{area} зарегистрировано", "{area} registered"), text: T("Suprafața înregistrată conform e‑Cadastru.", "Зарегистрированная площадь по данным e‑Cadastru.", "The registered area per e‑Cadastru.") },
    { key: "cadastre", label: T("Cadastru", "Кадастр", "Cadastre"), title: T("0100514.140.01.120", "0100514.140.01.120", "0100514.140.01.120"), text: T("Numărul se poate verifica pe portalul oficial e\u2011Cadastru.", "Номер можно проверить на официальном портале e\u2011Cadastru.", "The number can be checked on the official e\u2011Cadastru portal.") },
  ],
  statement: { lines: [T("{area}.", "{area}.", "{area}."), T("Ocupat 100 %.", "Занят на 100 %.", "100% occupied."), T("Lista de așteptare este deschisă.", "Лист ожидания открыт.", "The waiting list is open.")], photo: null },
  decision: {
    kind: "waitlist",
    teaser: {
      title: T("Când se eliberează un spațiu?", "Когда освободится помещение?", "When will a space become available?"),
      text: T("Comunicați-ne formatul și suprafața de care aveți nevoie — vă anunțăm când se eliberează un spațiu.", "Укажите формат и нужную площадь — сообщим, когда освободится помещение.", "Tell us your format and the area you need — we'll let you know when a space becomes available."),
    },
  },

  reasons: {
    label: T("Ce este confirmat", "Что подтверждено", "What is confirmed"),
    items: [
      { key: "operating", no: "01", label: T("În exploatare", "Действует", "Operating"), text: T("Obiect MEGAPARC ocupat 100 %.", "Объект MEGAPARC занят на 100 %.", "A MEGAPARC property, 100% occupied.") },
      { key: "cadastre", no: "02", label: T("Cadastru", "Кадастр", "Cadastre"), text: T("Numărul se verifică în e‑Cadastru.", "Номер проверяется в e‑Cadastru.", "The number is checked in e‑Cadastru.") },
      { key: "waitlist", no: "03", label: T("Lista de așteptare", "Лист ожидания", "Waiting list"), text: T("Vă anunțăm când se eliberează un spațiu.", "Сообщим, когда освободится помещение.", "We'll let you know when a space becomes available.") },
    ],
  },

  motion: {
    kicker: T("Locația", "Локация", "Location"),
    title: T("Strada Ion Creangă, Chișinău.", "Улица Иона Крянгэ, Кишинэу.", "Ion Creangă Street, Chișinău."),
    lead: T("Imobil comercial în exploatare pe strada Ion Creangă. Pe hartă — stațiile de transport public din apropiere (OpenStreetMap).", "Действующий коммерческий объект на улице Иона Крянгэ. На карте — ближайшие остановки общественного транспорта (OpenStreetMap).", "An operating commercial property on Ion Creangă Street. The map shows the nearby public transport stops (OpenStreetMap)."),
    ...sharedMotion,
    ecosystem: [
      { key: "street", category: "services", title: T("Strada Ion Creangă", "Улица Иона Крянгэ", "Ion Creangă Street"), text: T("Fațada clădirii dă spre stradă (OpenStreetMap).", "Фасад объекта выходит на улицу (OpenStreetMap).", "The property's facade faces the street (OpenStreetMap).") },
      { key: "streets", category: "residential", title: T("Străzile din jur", "Соседние улицы", "Neighbouring streets"), text: T("Ion Pelivan, Doina și Ion Aldea-Teodorovici — pe hartă.", "Иона Пеливана, Дойны и Иона Алдя-Теодоровича — на карте.", "Ion Pelivan, Doina and Ion Aldea-Teodorovici — on the map.") },
    ],
    addressText: T("Str. Ion Creangă 78, Chișinău.", "Ул. Иона Крянгэ, 78, Кишинэу.", "78 Ion Creangă St, Chișinău."),
    visibility: null,
    verdict: {
      title: T("Imobilul este în exploatare — spațiile sunt închiriate.", "Объект работает — помещения заняты.", "The property is in operation — its spaces are let."),
      text: T("Dacă adresa vi se potrivește, trimiteți o cerere: când se eliberează un spațiu, verificăm mai întâi formatul dumneavoastră.", "Если вам подходит этот адрес, напишите нам: когда освободится помещение, сначала проверим ваш формат.", "If the address suits you, write to us: when a space becomes available, we'll check your format first."),
    },
    cta: {
      title: T("Doriți un spațiu aici când se eliberează?", "Хотите арендовать здесь, когда освободится помещение?", "Want a space here when one becomes available?"),
      text: T("Spuneți-ne formatul și suprafața de care aveți nevoie — vă contactăm când se eliberează un spațiu.", "Расскажите о формате и нужной площади — свяжемся, когда освободится помещение.", "Tell us your format and the area you need — we contact you when a space becomes available."),
    },
  },

  drawers: sharedDrawers,
  specs: [],
  location: {
    lead: T("Strada Ion Creangă, Chișinău.", "Улица Иона Крянгэ, Кишинэу.", "Ion Creangă Street, Chișinău."),
    points: [fact(T("Strada Ion Creangă", "Улица Иона Крянгэ", "Ion Creangă Street"), "DOCUMENT_CONFIRMED", OSM)],
    metrics: [],
    internal: [],
    internalNote: "No traffic or demographic figure for Creangă 78; the district is not confirmed and is not shown.",
  },
  area: {
    propertyLine: T("Suprafața înregistrată — 2\u00a0158,3 m² (număr cadastral 0100514.140.01.120); suprafața disponibilă — 0 m².", "Зарегистрированная площадь — 2 158,3 м² (кадастровый номер 0100514.140.01.120); свободная площадь — 0 м².", "The registered area is 2,158.3 m² (cadastral number 0100514.140.01.120); the available area is 0 m²."),
    groundOnly: null,
  },
  access: [teamRow("entrance", T("Intrare", "Вход", "Entrance")), teamRow("parking", T("Parcare", "Парковка", "Parking")), teamRow("delivery", T("Acces pentru livrări", "Подъезд для доставки", "Delivery access"))],
  engineering: {
    rows: [teamRow("power", T("Alimentare electrică", "Электроснабжение", "Power")), teamRow("ventilation", T("Ventilație", "Вентиляция", "Ventilation")), teamRow("heating", T("Încălzire", "Отопление", "Heating")), teamRow("water", T("Apă și canalizare", "Водоснабжение и канализация", "Water and drainage"))],
    note: T("Când se eliberează un spațiu, parametrii pentru formatul dumneavoastră se confirmă împreună cu directorul tehnic și arhitectul MEGAPARC.", "Когда помещение освободится, параметры под ваш формат подтвердим вместе с техническим директором и архитектором MEGAPARC.", "When a space becomes available, the parameters for your format will be confirmed together with MEGAPARC's Technical Director and Architect."),
  },
  readiness: {
    confirmTitle: T("Clarificăm când se eliberează un spațiu", "Уточним, когда освободится помещение", "We confirm when a space becomes available"),
    confirm: [
      fact(T("Suprafața și data eliberării", "Площадь и срок освобождения", "The area and the availability date"), "TO_CONFIRM", OWNER_TEAM),
      fact(T("Puterea electrică pentru formatul dumneavoastră", "Электрическая мощность под ваш формат", "Power for your format"), "TO_CONFIRM", OWNER_TEAM),
      fact(T("Ventilația", "Вентиляция", "Ventilation"), "TO_CONFIRM", OWNER_TEAM),
      fact(T("Accesul pentru livrări", "Подъезд для доставки", "Delivery access"), "TO_CONFIRM", OWNER_TEAM),
      fact(T("Autorizații pentru activitatea dumneavoastră", "Разрешения под ваш вид деятельности", "Permits for your activity"), "TO_CONFIRM", OWNER_TEAM),
    ],
    costTitle: T("Ce presupune lansarea", "Из чего складывается запуск", "What opening involves"),
    cost: sharedCost,
  },
  terms: sharedTerms,

  plans: {
    ...sharedPlans,
    levels: [],
    note: T("Când se eliberează un spațiu, îi pregătim planul pentru vizionare — nu publicăm o schemă neconfirmată.", "Когда помещение освободится, подготовим его план к просмотру — неподтверждённую схему не публикуем.", "When a space becomes available, we'll prepare its plan for the viewing — we don't publish an unconfirmed layout."),
    source: OWNER_TEAM,
    marks: null,
    onRequest: {
      tab: T("Imobilul", "Объект", "Property"),
      title: T("Planul spațiului", "План помещения", "Space plan"),
      text: T("Când se eliberează un spațiu, îi pregătim planul pentru vizionare.", "Когда помещение освободится, подготовим его план к просмотру.", "When a space becomes available, we'll prepare its plan for the viewing."),
      floors: [T("Nu sunt spații disponibile acum — suprafața disponibilă 0 m²", "Свободных помещений сейчас нет — свободная площадь 0 м²", "No space is available right now (0 m²)")],
    },
  },

  capex: {
    kicker: T("Imobil în exploatare", "Действующий объект", "Operating property"),
    title: T("Imobilul este în exploatare.\nSpațiile sunt închiriate.", "Объект работает.\nПомещения заняты.", "The property is operating.\nIts spaces are let."),
    lead: T("Ocupat 100 % — nu sunt spații disponibile acum. Când se eliberează unul, verificăm mai întâi formatul dumneavoastră.", "Занят на 100 % — свободных помещений сейчас нет. Когда помещение освободится, сначала проверим ваш формат.", "100% occupied — no space is available right now. When one becomes available, we'll check your format first."),
    photo: null,
    readyTitle: T("Confirmat", "Подтверждено", "Confirmed"),
    ready: [
      fact(T("Proprietate MEGAPARC", "Собственность MEGAPARC", "A MEGAPARC property"), "OWNER_CONFIRMED", OWNER),
      fact(T("Ocupat 100 %", "Занят на 100 %", "100% occupied"), "OWNER_CONFIRMED", OWNER),
      fact(T("Număr cadastral 0100514.140.01.120", "Кадастровый номер 0100514.140.01.120", "Cadastral number 0100514.140.01.120"), "DOCUMENT_CONFIRMED", CAD),
      fact(T("Suprafață înregistrată 2\u00a0158,3 m²", "Зарегистрированная площадь 2 158,3 м²", "Registered area 2,158.3 m²"), "DOCUMENT_CONFIRMED", CAD),
    ],
    tenantTitle: T("Verificăm pentru formatul dumneavoastră", "Проверим под ваш формат", "We'll check for your format"),
    tenant: [
      fact(T("Suprafața", "Площадь", "The area"), "OWNER_CONFIRMED", OWNER_TEAM),
      fact(T("Termenul", "Сроки", "The timing"), "OWNER_CONFIRMED", OWNER_TEAM),
      fact(T("Puterea", "Мощность", "Power"), "OWNER_CONFIRMED", OWNER_TEAM),
      fact(T("Ventilația", "Вентиляция", "Ventilation"), "OWNER_CONFIRMED", OWNER_TEAM),
      fact(T("Autorizațiile", "Разрешения", "Permits"), "OWNER_CONFIRMED", OWNER_TEAM),
    ],
  },

  story: {
    ...sharedStory,
    title: T("Imobilul așa cum este astăzi.", "Объект таким, какой он есть сегодня.", "The property as it is today."),
    // two OWNER frames (2026-11-11): the shared lead speaks of one photograph — here it is plural
    lead: T("Fotografii reale ale imobilului în exploatare — arhitectura fără schimbări.", "Реальные фотографии действующего объекта — архитектура без изменений.", "Real photographs of the operating property — the architecture unchanged."),
    frames: [
      { key: "address", no: "01", shot: { photo: "building", position: "50% 55%" }, label: T("Imobilul", "Объект", "The property"), caption: T("Fațada de la stradă: intrarea cu scări și parcarea din fața clădirii.", "Фасад с улицы: вход с лестницей и парковка перед зданием.", "The street facade: the entrance with steps and parking in front of the building.") },
      { key: "frontage", no: "02", shot: { photo: "frontage", position: "50% 55%" }, label: T("Fațada comercială", "Коммерческий фасад", "Commercial frontage"), caption: T("Imobil comercial MEGAPARC în exploatare.", "Действующий коммерческий объект MEGAPARC.", "An operating MEGAPARC commercial property.") },
    ],
  },

  lens: {
    ...sharedLens,
    noPhoto: T("Organizarea posibilă o arătăm pe plan, când se eliberează un spațiu.", "Возможную организацию покажем на плане, когда помещение освободится.", "We'll show a possible organisation on the plan when a space becomes available."),
    formats: [
      {
        key: "commercial",
        label: T("Format comercial", "Коммерческий формат", "Commercial format"),
        question: T("Se va potrivi imobilul când se eliberează un spațiu?", "Подойдёт ли объект, когда освободится помещение?", "Will the property suit you when a space becomes available?"),
        evidence: [
          { text: T("Imobil MEGAPARC în exploatare, ocupat 100 %.", "Действующий объект MEGAPARC, занят на 100 %.", "An operating MEGAPARC property, 100% occupied."), ref: "capex", evidence: "OWNER_CONFIRMED", source: OWNER },
          { text: T("Numărul cadastral se poate verifica pe portalul oficial e\u2011Cadastru.", "Кадастровый номер можно проверить на официальном портале e\u2011Cadastru.", "The cadastral number can be checked on the official e\u2011Cadastru portal."), ref: "tech", evidence: "DOCUMENT_CONFIRMED", source: CAD },
          { text: T("Strada Ion Creangă și stațiile de transport din apropiere — pe hartă.", "Улица Иона Крянгэ и остановки транспорта рядом — на карте.", "Ion Creangă Street and the nearby transport stops — on the map."), ref: "location", evidence: "DOCUMENT_CONFIRMED", source: OSM },
        ],
        checks: [T("suprafața și data eliberării", "площадь и срок освобождения", "the area and the availability date"), T("puterea și ventilația pentru formatul dumneavoastră", "мощность и вентиляция под ваш формат", "power and ventilation for your format"), T("autorizațiile pentru activitatea dumneavoastră", "разрешения под ваш вид деятельности", "permits for your activity")],
        closing: sharedLens.honesty,
        overlay: null,
      },
    ],
  },

  viewing: {
    kicker: T("Lista de așteptare", "Лист ожидания", "Waiting list"),
    title: T("Spațiile sunt închiriate.\nÎnscrieți-vă pe lista de așteptare.", "Помещения заняты.\nВстаньте в лист ожидания.", "The spaces are let.\nJoin the waiting list."),
    lead: T("Comunicați-ne formatul și suprafața de care aveți nevoie — vă anunțăm când se eliberează un spațiu și verificăm mai întâi formatul dumneavoastră.", "Укажите формат и нужную площадь — когда помещение освободится, мы сообщим и сначала проверим ваш формат.", "Tell us your format and the area you need — we'll let you know when a space becomes available and check your format first."),
    steps: [
      { title: T("Acum", "Сейчас", "Now"), text: T("formatul, suprafața necesară, data dorită", "формат, нужная площадь, желаемые сроки", "the format, the area you need, the timing you want") },
      { title: T("Când se eliberează", "Когда освободится", "When it becomes available"), text: T("vă anunțăm și vă arătăm spațiul", "сообщим и покажем помещение", "we'll let you know and show you the space") },
      { title: T("După", "После", "After"), text: T("verificarea cerințelor tehnice, apoi condițiile comerciale", "проверка технических требований, затем коммерческие условия", "a check of the technical requirements, then the commercial terms") },
    ],
    photo: null,
    contactsLine,
    film: null,
    second: { label: T("Discutați disponibilitatea viitoare", "Узнать, когда освободится помещение", "Discuss future availability"), meta: T("Nu sunt spații disponibile acum", "Свободных помещений сейчас нет", "No space is available right now"), intent: "viewing" },
  },
};
