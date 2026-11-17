import { T, type LeasingExperience } from "@/data/leasing-experience-model";
import { OWNER_TEAM, contactsLine, fact, portfolioPhoto, sharedCost, sharedDrawers, sharedLens, sharedMotion, sharedPlans, sharedStory, sharedTenantScope, sharedTerms, teamRow } from "@/data/leasing-experience-shared";

/**
 * DACIA 31 — dataset of the leasing template (OWNER «LEASING TEMPLATE LOCK», 2026-11-10; the Moscova 20 master structure).
 * No published unit: the property reads «Сдаётся в аренду · площадь и сроки — по запросу» (R3.3 data gate — the draft
 * «5 223 m² from 1 January 2027» record and its floor plates are NOT confirmed and never shown). The hero figure is the
 * registered area of the eight premises (5 537,6 m², OWNER tax records) — never called available. No traffic figure, no
 * plan; the cadastral block lists the eight verified numbers. The decision zone is the office scenario (a whole-building
 * office), never compared with the registered area.
 *
 * Sources (internal): OWNER tax records R3.3.1 §7 · the confirmed capabilities of the asset (tenantFit: entrance,
 * visibility, ground, power and ventilation notes, flexibility) · the asset copy (src/lib/assets.ts) · one OWNER photograph.
 */

const OWNER = "OWNER — confirmed capability (src/data/demo-content.ts tenantFit)";
const ASSET = "src/lib/assets.ts — Dacia 31 asset record (OWNER copy)";

export const dacia31Experience: LeasingExperience = {
  unitId: null,
  project: "dacia-31",
  address: T("Bd. Dacia 31", "бул. Дачия, 31", "31 Dacia Blvd"),
  photos: {
    building: portfolioPhoto("d31-building", "dacia-31", 2200, 1467, T("Dacia 31: clădirea întreagă, scara de acces, aleea pietonală și parcarea de-a lungul bulevardului", "Dacia 31: здание целиком, лестница к входу, пешеходная аллея и парковка вдоль бульвара", "Dacia 31: the whole building, the entrance steps, the pedestrian promenade and parking along the boulevard"), "50% 56%"),
    buildingPhone: portfolioPhoto("d31-building-phone", "dacia-31-mobile", 1000, 1250, T("Dacia 31: clădirea întreagă și scara de acces", "Dacia 31: здание целиком и лестница к входу", "Dacia 31: the whole building and the entrance steps")),
  },
  ownerInput: ["facade 3/4", "entrance", "interior floor plates", "technical spaces", "parking / access", "context at street level"],

  hero: {
    photo: "building",
    phonePhoto: "buildingPhone",
    title: T("O clădire separată pentru o singură companie.", "Отдельное здание для одной компании.", "A separate building for one company."),
    place: T("Chișinău · Botanica", "Кишинэу · Ботаника", "Chișinău · Botanica"),
    offer: T("conform registrului · 8 spații", "площадь по реестру · 8 помещений", "registered area · 8 premises"),
    support: T("Suprafața și data disponibilității — la cerere, după vizionare.", "Площадь и сроки аренды — по запросу, после просмотра.", "The area and timing of the lease are given on request, after a viewing."),
  },
  cta: {
    primary: T("Solicită o vizionare", "Запросить просмотр", "Request a viewing"),
    secondary: { label: T("Solicitați planurile", "Запросить планы", "Request the plans"), href: "#plans" },
  },
  figure: 5537.6,
  portals: {
    location: { label: T("Locație\nși acces", "Локация\nи доступ", "Location\nand access"), word: T("Unde se află clădirea", "Где находится здание", "Where the building is") },
    decision: { label: T("Scenariul\nbiroului", "Расчёт\nплощади", "Office\nscenario"), word: T("Câtă suprafață îi trebuie echipei", "Сколько площади нужно команде", "How much space the team needs") },
  },
  summary: [
    { key: "readiness", label: T("Pregătire", "Готовность", "Readiness"), title: T("Vizionare la cerere", "Просмотр по запросу", "Viewing on request"), text: T("Clădirea se închiriază; suprafața și termenul se confirmă individual, după vizionare.", "Здание сдаётся в аренду; площадь и сроки подтверждаем индивидуально, после просмотра.", "The building is for lease; the area and timing are confirmed individually, after a viewing.") },
    { key: "visibility", label: T("Vizibilitate", "Видимость", "Visibility"), title: T("Fațadă vizibilă", "Заметный фасад", "A visible facade"), text: T("La intrarea în oraș dinspre aeroport.", "На въезде в город со стороны аэропорта.", "On the main approach from the airport.") },
    { key: "area", label: T("Suprafață", "Площадь", "Area"), title: T("8 spații înregistrate", "8 зарегистрированных помещений", "8 registered premises"), text: T("Suprafața înregistrată — nu este suprafața disponibilă pentru închiriere.", "Зарегистрированная площадь — это не свободная площадь для аренды.", "The registered area — not the area available for lease.") },
  ],
  statement: { lines: [T("{area}.", "{area}.", "{area}."), T("O clădire.", "Одно здание.", "One building."), T("O singură companie.", "Одна компания.", "One company.")], photo: null },
  decision: {
    kind: "office",
    teaser: {
      title: T("De câtă suprafață are nevoie echipa dumneavoastră?", "Сколько площади нужно вашей команде?", "How much space does your team need?"),
      text: T("Calculați pe datele dumneavoastră înainte de vizionare.", "Посчитайте на своих данных до просмотра.", "Calculate it on your own figures before the viewing."),
    },
  },

  reasons: {
    label: T("Trei motive pentru o vizionare", "Три причины для просмотра", "Three reasons for a viewing"),
    items: [
      { key: "own", no: "01", label: T("Clădire proprie", "Своё здание", "A stand-alone building"), text: T("Fără hol, fațadă sau adresă comune cu alți chiriași.", "Без общего холла, фасада и адреса с другими арендаторами.", "No lobby, facade or address shared with other tenants.") },
      { key: "access", no: "02", label: T("Acces centralizat", "Единый доступ", "Single access control"), text: T("Intrare proprie, 4+ variante de acces.", "Собственный вход, 4+ варианта доступа.", "Own entrance, 4+ access options.") },
      { key: "floors", no: "03", label: T("Etaje mari", "Просторные этажи", "Large floors"), text: T("Organizare pe niveluri sau pe funcții.", "Размещение по уровням или функциям.", "Arranged by level or by function.") },
    ],
  },

  motion: {
    kicker: T("Locația", "Локация", "Location"),
    title: T("Intrarea în oraș dinspre aeroport.", "Въезд в город со стороны аэропорта.", "The main approach from the airport."),
    lead: T("Botanica este poarta de intrare în Chișinău dinspre aeroport. Clădirea se află lângă arterele Dacia, Traian și Decebal, aproape de o alee pietonală largă, restaurante, cafenele și servicii.", "Ботаника — въезд в Кишинэу со стороны аэропорта. Здание расположено у магистралей Дачия, Траян и Дечебал, рядом с широкой пешеходной аллеей, ресторанами, кафе и услугами.", "Botanica is the gateway to Chișinău from the airport. The building stands near the Dacia, Traian and Decebal boulevards, close to a wide pedestrian promenade, restaurants, cafés and services."),
    ...sharedMotion,
    ecosystem: [
      { key: "arteries", category: "services", title: T("Arterele Dacia, Traian și Decebal", "Магистрали Дачия, Траян и Дечебал", "The Dacia, Traian and Decebal boulevards"), text: T("Acces auto direct din oraș.", "Прямой автомобильный доступ из города.", "Direct access by car from the city.") },
      { key: "promenade", category: "residential", title: T("Alee pietonală largă", "Широкая пешеходная аллея", "A wide pedestrian promenade"), text: T("Chiar în fața clădirii.", "Прямо перед зданием.", "Right in front of the building.") },
      { key: "services", category: "services", title: T("Restaurante, cafenele și servicii", "Рестораны, кафе и услуги", "Restaurants, cafés and services"), text: T("În apropiere — pentru echipa dumneavoastră.", "Рядом — для вашей команды.", "Close by — for your team.") },
    ],
    addressText: T("Bd. Dacia 31, sectorul Botanica — lângă arterele Dacia, Traian și Decebal.", "Бул. Дачия, 31, сектор Ботаника — у магистралей Дачия, Траян и Дечебал.", "31 Dacia Blvd, Botanica district — by the Dacia, Traian and Decebal boulevards."),
    visibility: null,
    verdict: {
      title: T("Această adresă merită verificată pentru compania dumneavoastră.", "Этот адрес заслуживает проверки для вашей компании.", "This address is worth checking for your company."),
      text: T("Clădirea se află lângă arterele principale ale sectorului. Cât de potrivită este pentru compania dumneavoastră — verificăm împreună, la vizionare.", "Здание стоит у главных магистралей сектора. Насколько оно подходит вашей компании — проверим вместе на просмотре.", "The building stands by the district's main roads. How well it suits your company is something we'll check together at the viewing."),
    },
    cta: {
      title: T("Se potrivește această adresă echipei dumneavoastră?", "Подходит ли этот адрес вашей команде?", "Does this address suit your team?"),
      text: T("Spuneți-ne cum este organizată compania — pregătim vizionarea pe ce contează pentru dumneavoastră.", "Расскажите, как устроена ваша компания, — подготовим просмотр под то, что важно именно вам.", "Tell us how your company is organised — we'll prepare the viewing around what matters to you."),
    },
  },

  drawers: sharedDrawers,
  specs: [],
  location: {
    lead: T("Sectorul Botanica, lângă arterele Dacia, Traian și Decebal.", "Сектор Ботаника, у магистралей Дачия, Траян и Дечебал.", "Botanica district, by the Dacia, Traian and Decebal boulevards."),
    points: [
      fact(T("Botanica, intrarea în Chișinău dinspre aeroport", "Ботаника — въезд в Кишинэу со стороны аэропорта", "Botanica, the gateway to Chișinău from the airport"), "OWNER_CONFIRMED", ASSET),
      fact(T("Arterele urbane Dacia, Traian și Decebal", "Городские магистрали Дачия, Траян и Дечебал", "Dacia, Traian and Decebal urban main roads"), "OWNER_CONFIRMED", ASSET),
      fact(T("Alee pietonală largă", "Широкая пешеходная аллея", "Wide pedestrian promenade"), "OWNER_CONFIRMED", ASSET),
      fact(T("Restaurante, cafenele și servicii în apropiere", "Рестораны, кафе и услуги рядом", "Restaurants, cafés and services nearby"), "OWNER_CONFIRMED", ASSET),
    ],
    metrics: [],
    internal: [],
    internalNote: "No traffic or demographic figure for Dacia 31 — none is published without a field count.",
  },
  area: {
    propertyLine: T("Suprafața înregistrată — 5.537,6 m² în 8 spații; nu este suprafața disponibilă. Suprafața și data disponibilității — la cerere.", "Зарегистрированная площадь — 5 537,6 м² в 8 помещениях; это не свободная площадь. Площадь и сроки аренды — по запросу.", "The registered area is 5,537.6 m² in 8 premises — not the available area. The area and timing of the lease are given on request."),
    groundOnly: null,
  },
  access: [
    { key: "entrance", label: T("Intrare", "Вход", "Entrance"), value: T("Intrare proprie · 4+ variante de acces.", "Собственный вход · 4+ варианта доступа.", "Dedicated entrance · 4+ access options."), state: "ready", evidence: "OWNER_CONFIRMED", source: OWNER },
    { key: "ground", label: T("Acces", "Доступ", "Access"), value: T("Clădire întreagă, intrare de la nivelul solului.", "Здание целиком, вход с уровня земли.", "The whole building, access at street level."), state: "ready", evidence: "OWNER_CONFIRMED", source: OWNER },
    { key: "visibility", label: T("Vizibilitate", "Видимость", "Visibility"), value: T("Fațadă vizibilă la intrarea în oraș dinspre aeroport.", "Заметный фасад на въезде в город со стороны аэропорта.", "A visible facade on the main approach from the airport."), state: "ready", evidence: "OWNER_CONFIRMED", source: OWNER },
    { key: "flexible", label: T("Organizare", "Планировка", "Layout"), value: T("Etaje mari, organizare pe niveluri sau pe funcții.", "Просторные этажи, размещение по уровням или функциям.", "Large floor plates, configurable by floor or by function."), state: "ready", evidence: "OWNER_CONFIRMED", source: OWNER },
    teamRow("parking", T("Parcare", "Парковка", "Parking")),
    teamRow("delivery", T("Acces pentru livrări", "Подъезд для доставки", "Delivery access")),
  ],
  engineering: {
    rows: [
      { key: "power", label: T("Alimentare electrică", "Электроснабжение", "Power"), value: T("Rețele existente; capacitatea se confirmă prin audit", "Сети есть; мощность подтверждается аудитом", "Services in place; capacity to be confirmed by audit"), state: "ready", evidence: "OWNER_CONFIRMED", source: OWNER },
      { key: "ventilation", label: T("Ventilație", "Вентиляция", "Ventilation"), value: T("Tubulatură existentă; adaptare la utilizator", "Воздуховоды есть; адаптация под арендатора", "Ductwork in place; adaptable to the tenant"), state: "ready", evidence: "OWNER_CONFIRMED", source: OWNER },
      teamRow("heating", T("Încălzire", "Отопление", "Heating")),
      teamRow("water", T("Apă și canalizare", "Водоснабжение и канализация", "Water and drainage")),
    ],
    note: T("Capacitățile tehnice și redundanța instalațiilor fac obiectul unui audit tehnic.", "Мощности и резервирование инженерных систем уточнит технический аудит.", "Technical capacities and the redundancy of building services are subject to a technical audit."),
  },
  readiness: {
    confirmTitle: T("Clarificăm pentru compania dumneavoastră", "Уточняем под вашу компанию", "We confirm for your company"),
    confirm: [
      fact(T("Suprafața și data disponibilității", "Площадь и сроки аренды", "The area and timing of the lease"), "TO_CONFIRM", OWNER_TEAM),
      fact(T("Puterea și redundanța — prin audit tehnic", "Мощность и резервирование — по техническому аудиту", "Power and redundancy — subject to a technical audit"), "TO_CONFIRM", OWNER_TEAM),
      fact(T("Parcarea — numărul de locuri", "Парковка — количество мест", "Parking — the number of spaces"), "TO_CONFIRM", OWNER_TEAM),
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
    note: T("Planurile etajelor le pregătim pentru vizionare și pentru verificarea tehnică a cerințelor dumneavoastră — nu publicăm o schemă neconfirmată.", "Поэтажные планы подготовим к просмотру и технической проверке ваших требований — неподтверждённую схему не публикуем.", "We'll prepare the floor plans for the viewing and the technical check of your requirements — we don't publish an unconfirmed layout."),
    source: OWNER_TEAM,
    marks: null,
    onRequest: {
      tab: T("Clădirea", "Здание", "Building"),
      title: T("Planurile etajelor", "Поэтажные планы", "Floor plans"),
      text: T("Le pregătim pentru vizionare și pentru verificarea tehnică a cerințelor dumneavoastră.", "Подготовим к просмотру и технической проверке ваших требований.", "We'll prepare them for the viewing and the technical check of your requirements."),
      floors: [T("Demisol + 3 etaje + etaj tehnic", "Цоколь + 3 этажа + технический этаж", "Lower ground + 3 floors + technical floor"), T("Suprafața și termenul — la cerere", "Площадь и сроки — по запросу", "Area and timing — on request")],
    },
  },

  capex: {
    kicker: T("Ce există deja", "Что уже есть", "What is in place"),
    title: T("O clădire întreagă.\nAdaptarea — după auditul tehnic.", "Здание целиком.\nАдаптация — после технического аудита.", "A whole building.\nAdaptation after the technical audit."),
    lead: T("Intrarea proprie, etajele mari și rețelele inginerești ale clădirii există deja; capacitățile exacte le stabilește auditul tehnic.", "Собственный вход, просторные этажи и инженерные сети здания уже есть; точные мощности покажет технический аудит.", "The dedicated entrance, the large floor plates and the building services are already in place; the technical audit will set the exact capacities."),
    photo: null,
    readyTitle: T("Deja există", "Уже есть", "Already in place"),
    ready: [
      fact(T("Intrare proprie", "Собственный вход", "Own entrance"), "OWNER_CONFIRMED", OWNER),
      fact(T("Etaje mari", "Просторные этажи", "Large floors"), "OWNER_CONFIRMED", OWNER),
      fact(T("Rețele inginerești", "Инженерные сети", "Building services"), "OWNER_CONFIRMED", OWNER),
      fact(T("Tubulatură de aer", "Воздуховоды", "Ductwork"), "OWNER_CONFIRMED", OWNER),
      fact(T("Fațadă vizibilă", "Заметный фасад", "A visible facade"), "OWNER_CONFIRMED", OWNER),
    ],
    tenantTitle: T("Pentru compania dumneavoastră", "Под вашу компанию", "For your company"),
    tenant: sharedTenantScope,
  },

  story: {
    ...sharedStory,
    title: T("Clădirea așa cum este astăzi.", "Здание таким, какое оно есть сегодня.", "The building as it is today."),
    frames: [
      { key: "address", no: "01", shot: { photo: "building", position: "50% 56%" }, label: T("Clădirea", "Здание", "The building"), caption: T("Clădirea întreagă: scara de acces, aleea pietonală și parcarea de-a lungul bulevardului.", "Здание целиком: лестница к входу, пешеходная аллея и парковка вдоль бульвара.", "The whole building: the entrance steps, the pedestrian promenade and parking along the boulevard.") },
    ],
  },

  lens: {
    ...sharedLens,
    noPhoto: T("Amplasarea posibilă a departamentelor o arătăm pe planurile etajelor, la vizionare.", "Возможное размещение подразделений покажем на поэтажных планах на просмотре.", "We'll show a possible arrangement of the departments on the floor plans at the viewing."),
    formats: [
      {
        key: "headquarters",
        label: T("Sediu central", "Штаб-квартира", "Headquarters"),
        question: T("Încape toată compania într-o singură clădire?", "Поместится ли вся компания в одном здании?", "Does the whole company fit in one building?"),
        evidence: [
          { text: T("O clădire întreagă — pentru o singură companie.", "Здание целиком — для одной компании.", "A whole building — for one company."), ref: "tech", evidence: "OWNER_CONFIRMED", source: OWNER },
          { text: T("Intrare proprie și control centralizat al accesului.", "Собственный вход и единый контроль доступа.", "A dedicated entrance and a single access-control system."), ref: "tech", evidence: "OWNER_CONFIRMED", source: OWNER },
          { text: T("Etaje mari: organizare pe niveluri sau pe funcții.", "Просторные этажи: размещение по уровням или функциям.", "Large floor plates, configurable by floor or by function."), ref: "plans", evidence: "OWNER_CONFIRMED", source: OWNER },
          { text: T("Fațadă vizibilă — numele companiei pe clădire.", "Заметный фасад — название компании на здании.", "A visible facade — the company's name on the building."), ref: "photos", evidence: "OWNER_CONFIRMED", source: ASSET },
        ],
        checks: [T("suprafața și data disponibilității", "площадь и сроки аренды", "the area and timing of the lease"), T("puterea și redundanța — prin audit tehnic", "мощность и резервирование по техническому аудиту", "power and redundancy subject to a technical audit"), T("numărul de locuri de muncă pentru procesul dumneavoastră", "количество рабочих мест под ваш процесс", "the number of workplaces you need")],
        closing: sharedLens.honesty,
        overlay: null,
      },
    ],
  },

  viewing: {
    kicker: T("Vizionare", "Просмотр", "Viewing"),
    title: T("Nu decideți după fotografii.\nVedeți Dacia 31 personal.", "Не решайте по фотографиям.\nПосмотрите Dacia 31 лично.", "Don't decide on photographs alone.\nSee Dacia 31 in person."),
    lead: T("Clarificăm din timp cum este organizată compania dumneavoastră și pregătim pentru vizionare datele care contează pentru decizie.", "Заранее уточним, как устроена ваша компания, и подготовим к просмотру данные, которые важны для решения.", "We'll find out in advance how your company is organised and prepare the information that matters for the decision."),
    steps: [
      { title: T("Înainte", "До просмотра", "Before"), text: T("echipa, suprafața necesară, cerințele tehnice, data mutării", "команда, нужная площадь, технические требования, срок переезда", "the team, the area you need, technical requirements, move-in date") },
      { title: T("La vizionare", "На просмотре", "At the viewing"), text: T("clădirea, intrările, etajele, punctele de racord, accesul", "здание, входы, этажи, точки подключения, доступ", "the building, entrances, floors, service connection points, access") },
      { title: T("După", "После", "After"), text: T("auditul tehnic pentru cerințele dumneavoastră, apoi suprafața, data disponibilității și condițiile comerciale", "технический аудит под ваши требования, затем площадь, сроки и коммерческие условия", "the technical audit for your requirements, then the area, timing and commercial terms") },
    ],
    photo: null,
    contactsLine,
    film: null,
  },
};
