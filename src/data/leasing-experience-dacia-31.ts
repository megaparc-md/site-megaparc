import { catalogVisible, publicCatalog } from "@/data/dacia-31-spaces";
import { T, type LeasingExperience } from "@/data/leasing-experience-model";
import { OWNER_TEAM, contactsLine, fact, portfolioPhoto, sharedCost, sharedDrawers, sharedLens, sharedMotion, sharedPlans, sharedStory, sharedTenantScope, sharedTerms, teamRow } from "@/data/leasing-experience-shared";

/**
 * DACIA 31 — dataset of the leasing template, repositioned by the OWNER «PROPERTY COMMERCIAL EXPERIENCE 2026» Part B (2026-11-23):
 * a MULTI-TENANT commercial building — offices, cabinets and large commercial floors — never positioned as a building for one company
 * only. Two scenarios: A · offices and cabinets (the catalogue with area, level, availability, possible use, a viewing request, the filter
 * by area and status) and B · large commercial floors (available area, one or several tenants — division shown only once technically
 * confirmed —, retail and service formats, engineering, entrances, parking, unloading, an individual offer request).
 *
 * The catalogue comes from the OWNER lease register (src/data/dacia-31-spaces.ts — free spaces only, no tenant data); it is PRELIMINARY
 * and shown on the OWNER preview until the OWNER confirms it (`dacia31Catalog.ownerApproved`). Without it the production edition keeps the
 * property-level state «площадь и сроки — по запросу» and the hero figure is the registered area of the eight premises (5 537,6 m², OWNER
 * tax records) — labelled as registered. The register area and the registered area are never shown side by side or added up.
 * No rate anywhere. No traffic figure (none is published without a field count); the district facts come from the location research
 * (docs/research/DACIA_31_LOCATION_RESEARCH.md) with their sources.
 *
 * Sources (internal): the OWNER lease register 23.11.2026 · OWNER tax records R3.3.1 §7 · the confirmed capabilities of the asset
 * (tenantFit: entrance, visibility, ground, power and ventilation notes, flexibility) · the asset copy (src/lib/assets.ts) · one OWNER
 * photograph.
 */

const OWNER = "OWNER — confirmed capability (src/data/demo-content.ts tenantFit)";
const ASSET = "src/lib/assets.ts — Dacia 31 asset record (OWNER copy)";
const REG = "OWNER lease register «INFORMAȚIA CHIRIA DACIA 31» (23.11.2026) — preliminary";

const catalog = catalogVisible() && publicCatalog().length > 0;
const free = publicCatalog();
const freeArea = Math.round(free.reduce((sum, space) => sum + space.area, 0) * 100) / 100;
const offices = free.filter((space) => space.scenario === "office").length;
const floors = free.filter((space) => space.scenario === "commercial").length;
const n = (value: number) => String(value);

export const dacia31Experience: LeasingExperience = {
  unitId: null,
  project: "dacia-31",
  catalog,
  address: T("Bd. Dacia 31", "бул. Дачия, 31", "31 Dacia Blvd"),
  photos: {
    building: portfolioPhoto("d31-building", "dacia-31", 2200, 1467, T("Dacia 31: vedere generală a clădirii, scara de acces, aleea pietonală și parcarea de-a lungul bulevardului", "Dacia 31: общий вид здания, лестница к входу, пешеходная аллея и парковка вдоль бульвара", "Dacia 31: the building, the entrance steps, the pedestrian promenade and parking along the boulevard"), "50% 56%"),
    buildingPhone: portfolioPhoto("d31-building-phone", "dacia-31-mobile", 1000, 1250, T("Dacia 31: vedere generală a clădirii și scara de acces", "Dacia 31: общий вид здания и лестница к входу", "Dacia 31: the building and the entrance steps")),
  },
  ownerInput: ["facade 3/4", "entrance", "each free space (office 23 · ground floor · lower level · level 2)", "floor plans of every level", "technical spaces", "parking / unloading", "context at street level"],

  hero: {
    photo: "building",
    phonePhoto: "buildingPhone",
    title: T("Birouri, cabinete și suprafețe comerciale mari.", "Офисы, кабинеты и крупные коммерческие площади.", "Offices, cabinets and large commercial floors."),
    place: T("Chișinău · Botanica", "Кишинэу · Ботаника", "Chișinău · Botanica"),
    offer: catalog
      ? T("liberi conform registrului de închiriere · preliminar", "свободно по реестру аренды · предварительно", "free per the lease register · preliminary")
      : T("suprafață înregistrată · 8 spații", "зарегистрированная площадь · 8 помещений", "registered area · 8 premises"),
    support: catalog
      ? T("Două scenarii într-o singură clădire: birouri și cabinete — și suprafețe mari pentru comerț și servicii.", "Два сценария в одном здании: офисы и кабинеты — и крупные площади для торговли и услуг.", "Two scenarios in one building: offices and cabinets — and large floors for retail and services.")
      : T("Suprafața și data disponibilității — la cerere, după vizionare.", "Площадь и сроки аренды — по запросу, после просмотра.", "The area and timing of the lease are given on request, after a viewing."),
  },
  cta: {
    primary: T("Solicitați o vizionare", "Запросить просмотр", "Request a viewing"),
    secondary: catalog
      ? { label: T("Vedeți spațiile libere", "Смотреть свободные помещения", "See the free spaces"), href: "#spaces" }
      : { label: T("Solicitați planurile", "Запросить планы", "Request the plans"), href: "#plans" },
  },
  figure: catalog ? freeArea : 5537.6,
  portals: {
    location: { label: T("Locație\nși acces", "Локация\nи доступ", "Location\nand access"), word: T("Botanica, bd. Dacia", "Ботаника, бул. Дачия", "Botanica, Dacia Blvd") },
    decision: { label: T("Calculul\nformatului", "Расчёт\nпод формат", "Your format\nin figures"), word: T("Birou sau comerț — cu cifrele dumneavoastră", "Офис или торговля — на ваших цифрах", "Office or retail — on your own figures") },
  },
  summary: catalog
    ? [
        { key: "readiness", label: T("Disponibilitate", "Доступность", "Availability"), title: T("Liber acum", "Свободно сейчас", "Free now"), text: T(`Conform registrului de închiriere: birouri — ${n(offices)}, suprafețe mari — ${n(floors)}.`, `По реестру аренды: офисов — ${n(offices)}, крупных площадей — ${n(floors)}.`, `Per the lease register: offices — ${n(offices)}, large floors — ${n(floors)}.`) },
        { key: "visibility", label: T("Formate", "Форматы", "Formats"), title: T("Două scenarii", "Два сценария", "Two scenarios"), text: T("Birouri și cabinete pentru echipe și servicii; suprafețe mari pentru comerț, servicii, showroom.", "Офисы и кабинеты — для команд и услуг; крупные площади — для торговли, сервиса, шоурума.", "Offices and cabinets for teams and services; large floors for retail, services, a showroom.") },
        { key: "area", label: T("Suprafață", "Площадь", "Area"), title: T("{area} liberi", "{area} свободно", "{area} free"), text: T("Conform registrului de închiriere, preliminar — nu este suprafața înregistrată a clădirii.", "По реестру аренды, предварительно — это не зарегистрированная площадь здания.", "Per the lease register, preliminary — not the registered area of the building.") },
      ]
    : [
        { key: "readiness", label: T("Pregătire", "Готовность", "Readiness"), title: T("Vizionare la cerere", "Просмотр по запросу", "Viewing on request"), text: T("Spațiile se închiriază; suprafața și data disponibilității se confirmă individual, după vizionare.", "Помещения сдаются в аренду; площадь и сроки подтверждаем индивидуально, после просмотра.", "The spaces are for lease; the area and timing are confirmed individually, after a viewing.") },
        { key: "visibility", label: T("Formate", "Форматы", "Formats"), title: T("Birouri și comerț", "Офисы и торговля", "Offices and retail"), text: T("Birouri, cabinete și suprafețe comerciale mari.", "Офисы, кабинеты и крупные коммерческие площади.", "Offices, cabinets and large commercial floors.") },
        { key: "area", label: T("Suprafață", "Площадь", "Area"), title: T("8 spații înregistrate", "8 зарегистрированных помещений", "8 registered premises"), text: T("Suprafața înregistrată — nu este suprafața disponibilă pentru închiriere.", "Зарегистрированная площадь — это не свободная площадь для аренды.", "The registered area — not the area available for lease.") },
      ],
  statement: catalog
    ? { lines: [T("{area}.", "{area}.", "{area}."), T("Birouri și cabinete.", "Офисы и кабинеты.", "Offices and cabinets."), T("Suprafețe mari pentru afaceri.", "Крупные площади для бизнеса.", "Large floors for business.")], photo: null }
    : { lines: [T("{area}.", "{area}.", "{area}."), T("O clădire.", "Одно здание.", "One building."), T("Birouri, cabinete, comerț.", "Офисы, кабинеты, торговля.", "Offices, cabinets, retail.")], photo: null },
  decision: {
    kind: "office",
    also: "economics",
    teaser: {
      title: T("Birou sau comerț — ce vă trebuie?", "Офис или торговля — что вам нужно?", "Office or retail — what do you need?"),
      text: T("Calculați suprafața pentru echipă sau economia unui punct comercial — cu cifrele dumneavoastră, înainte de vizionare.", "Посчитайте площадь для команды или экономику торговой точки — на своих цифрах, до просмотра.", "Work out the space for your team or the economics of a retail point — on your own figures, before the viewing."),
    },
  },

  reasons: {
    label: T("Trei motive pentru o vizionare", "Три причины для просмотра", "Three reasons for a viewing"),
    items: [
      { key: "two", no: "01", label: T("Două scenarii", "Два сценария", "Two scenarios"), text: T("Birouri și cabinete — și suprafețe mari în aceeași clădire.", "Офисы и кабинеты — и крупные площади в одном здании.", "Offices and cabinets — and large floors in one building.") },
      { key: "location", no: "02", label: T("Locație", "Локация", "Location"), text: T("Botanica, bd. Dacia — intrarea în oraș dinspre aeroport.", "Ботаника, бул. Дачия — въезд в город со стороны аэропорта.", "Botanica, Dacia Blvd — the approach from the airport.") },
      { key: "access", no: "03", label: T("Acces", "Доступ", "Access"), text: T("Intrare proprie, 4+ variante de acces.", "Собственный вход, 4+ варианта доступа.", "Own entrance, 4+ access options.") },
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
      { key: "services", category: "services", title: T("Restaurante, cafenele și servicii", "Рестораны, кафе и услуги", "Restaurants, cafés and services"), text: T("În apropiere — pentru echipe și clienți.", "Рядом — для команд и клиентов.", "Close by — for teams and customers.") },
    ],
    addressText: T("Bd. Dacia 31, sectorul Botanica — lângă arterele Dacia, Traian și Decebal.", "Бул. Дачия, 31, сектор Ботаника — у магистралей Дачия, Траян и Дечебал.", "31 Dacia Blvd, Botanica district — by the Dacia, Traian and Decebal boulevards."),
    visibility: null,
    verdict: {
      title: T("Această adresă merită verificată pentru afacerea dumneavoastră.", "Этот адрес стоит проверить для вашего бизнеса.", "This address is worth checking for your business."),
      text: T("Clădirea se află lângă arterele principale ale sectorului. Cât de potrivită este pentru formatul dumneavoastră — verificăm împreună, la vizionare.", "Здание стоит у главных магистралей сектора. Насколько оно подходит вашему формату — проверим вместе на просмотре.", "The building stands by the district's main roads. How well it suits your format is something we'll check together at the viewing."),
    },
    cta: {
      title: T("Se potrivește această adresă formatului dumneavoastră?", "Подходит ли этот адрес вашему формату?", "Does this address suit your format?"),
      text: T("Spuneți-ne ce căutați — birou, cabinet sau suprafață comercială — pregătim vizionarea pe ce contează pentru dumneavoastră.", "Расскажите, что ищете — офис, кабинет или торговую площадь, — подготовим просмотр под то, что важно именно вам.", "Tell us what you are looking for — an office, a cabinet or a commercial floor — and we'll prepare the viewing around what matters to you."),
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
    internalNote: "No traffic or demographic figure for Dacia 31 is published without a field count; the district research (sourced, dated, with confidence) is in docs/research/DACIA_31_LOCATION_RESEARCH.md.",
  },
  area: {
    propertyLine: catalog
      ? T("Spațiile libere — conform registrului de închiriere (preliminar). Suprafața înregistrată a clădirii (5 537,6 m² în 8 spații) este o altă mărime — nu se adună și nu se compară.", "Свободные помещения — по реестру аренды (предварительно). Зарегистрированная площадь здания (5 537,6 м² в 8 помещениях) — другая величина: не складывается и не сравнивается.", "The free spaces are given per the lease register (preliminary). The registered area of the building (5,537.6 m² in 8 premises) is a different measure — never added or compared.")
      : T("Suprafața înregistrată — 5 537,6 m² în 8 spații; nu este suprafața disponibilă. Suprafața și data disponibilității — la cerere.", "Зарегистрированная площадь — 5 537,6 м² в 8 помещениях; это не свободная площадь. Площадь и сроки аренды — по запросу.", "The registered area is 5,537.6 m² in 8 premises — not the available area. The area and timing of the lease are given on request."),
    groundOnly: null,
  },
  access: [
    { key: "entrance", label: T("Intrare", "Вход", "Entrance"), value: T("Intrare proprie · 4+ variante de acces.", "Собственный вход · 4+ варианта доступа.", "Dedicated entrance · 4+ access options."), state: "ready", evidence: "OWNER_CONFIRMED", source: OWNER },
    { key: "ground", label: T("Acces", "Доступ", "Access"), value: T("Clădire independentă; accesul fără bariere se verifică în cadrul auditului tehnic.", "Отдельное здание; безбарьерный доступ уточнит технический аудит.", "A stand-alone building; step-free access to be confirmed by the technical audit."), state: "ready", evidence: "OWNER_CONFIRMED", source: OWNER },
    { key: "visibility", label: T("Vizibilitate", "Видимость", "Visibility"), value: T("Fațadă vizibilă la intrarea în oraș dinspre aeroport.", "Заметный фасад на въезде в город со стороны аэропорта.", "A visible facade on the main approach from the airport."), state: "ready", evidence: "OWNER_CONFIRMED", source: OWNER },
    { key: "flexible", label: T("Organizare", "Планировка", "Layout"), value: T("Etaje mari; împărțirea suprafețelor mari — după verificarea tehnică.", "Просторные этажи; деление крупных площадей — после технической проверки.", "Large floor plates; division of the large floors after the technical check."), state: "ready", evidence: "OWNER_CONFIRMED", source: OWNER },
    teamRow("parking", T("Parcare", "Парковка", "Parking")),
    teamRow("delivery", T("Acces pentru livrări și descărcare", "Подъезд для доставки и разгрузка", "Delivery access and unloading")),
  ],
  engineering: {
    rows: [
      { key: "power", label: T("Alimentare electrică", "Электроснабжение", "Power"), value: T("Rețele existente; capacitatea se confirmă prin audit", "Сети есть; мощность подтверждается аудитом", "Services in place; capacity to be confirmed by audit"), state: "ready", evidence: "OWNER_CONFIRMED", source: OWNER },
      { key: "ventilation", label: T("Ventilație", "Вентиляция", "Ventilation"), value: T("Tubulatură existentă; adaptare la utilizator", "Воздуховоды есть; адаптация под арендатора", "Ductwork in place; adaptable to the tenant"), state: "ready", evidence: "OWNER_CONFIRMED", source: OWNER },
      teamRow("heating", T("Încălzire", "Отопление", "Heating")),
      teamRow("water", T("Apă și canalizare", "Водоснабжение и канализация", "Water and drainage")),
    ],
    note: T("Capacitățile tehnice și redundanța instalațiilor fac obiectul unui audit tehnic; limitele tehnice pentru comerț și servicii (sarcini, extracție, descărcare) — pentru formatul concret.", "Мощности и резервирование инженерных систем уточнит технический аудит; технические ограничения для торговли и услуг (нагрузки, вытяжка, разгрузка) — под конкретный формат.", "Technical capacities and the redundancy of building services are subject to a technical audit; the technical limits for retail and services (loads, extraction, unloading) are set for the specific format."),
  },
  readiness: {
    confirmTitle: T("Clarificăm pentru afacerea dumneavoastră", "Уточняем под ваш бизнес", "We confirm for your business"),
    confirm: [
      fact(T("Statutul și suprafața spațiului ales", "Статус и площадь выбранного помещения", "The status and area of the chosen space"), "TO_CONFIRM", OWNER_TEAM),
      fact(T("Împărțirea suprafețelor mari — după verificarea tehnică", "Деление крупных площадей — после технической проверки", "Division of the large floors — after the technical check"), "TO_CONFIRM", OWNER_TEAM),
      fact(T("Puterea și redundanța — prin audit tehnic", "Мощность и резервирование — по техническому аудиту", "Power and redundancy — subject to a technical audit"), "TO_CONFIRM", OWNER_TEAM),
      fact(T("Parcarea — numărul de locuri", "Парковка — количество мест", "Parking — the number of spaces"), "TO_CONFIRM", OWNER_TEAM),
      fact(T("Accesul pentru livrări și descărcare", "Подъезд для доставки и разгрузка", "Delivery access and unloading"), "TO_CONFIRM", OWNER_TEAM),
      fact(T("Autorizații pentru activitatea dumneavoastră", "Разрешения под ваш вид деятельности", "Permits for your activity"), "TO_CONFIRM", OWNER_TEAM),
    ],
    costTitle: T("Ce presupune lansarea", "Из чего складывается запуск", "What opening involves"),
    cost: sharedCost,
  },
  terms: sharedTerms,

  plans: {
    ...sharedPlans,
    levels: [],
    note: T("Planurile nivelurilor le pregătim pentru vizionare și pentru verificarea tehnică a formatului dumneavoastră — nu publicăm o schemă neconfirmată.", "Поэтажные планы подготовим к просмотру и технической проверке вашего формата — неподтверждённую схему не публикуем.", "We'll prepare the floor plans for the viewing and the technical check of your format — we don't publish an unconfirmed layout."),
    source: OWNER_TEAM,
    marks: null,
    onRequest: {
      tab: T("Clădirea", "Здание", "Building"),
      title: T("Planurile etajelor", "Поэтажные планы", "Floor plans"),
      text: T("Le pregătim pentru vizionare și pentru verificarea tehnică a formatului dumneavoastră.", "Подготовим к просмотру и технической проверке вашего формата.", "We'll prepare them for the viewing and the technical check of your format."),
      floors: [T("Demisol + parter + 2 etaje + etaj tehnic", "Цоколь + 3 этажа + технический этаж", "Lower ground + ground + 2 upper floors + technical floor"), catalog ? T("Spațiile libere — în catalogul de mai sus", "Свободные помещения — в каталоге выше", "The free spaces — in the catalogue above") : T("Suprafața și data disponibilității — la cerere", "Площадь и сроки — по запросу", "Area and timing — on request")],
    },
  },

  capex: {
    kicker: T("Ce există deja", "Что уже есть", "What is in place"),
    title: T("O clădire independentă.\nAdaptarea — după auditul tehnic.", "Отдельное здание.\nАдаптация — после технического аудита.", "A stand-alone building.\nAdaptation after the technical audit."),
    lead: T("Intrarea proprie, etajele mari și rețelele inginerești ale clădirii există deja; capacitățile exacte le stabilește auditul tehnic pentru formatul dumneavoastră.", "Собственный вход, просторные этажи и инженерные сети здания уже есть; точные мощности под ваш формат покажет технический аудит.", "The dedicated entrance, the large floor plates and the building services are already in place; the technical audit sets the exact capacities for your format."),
    photo: null,
    readyTitle: T("Deja există", "Уже есть", "Already in place"),
    ready: [
      fact(T("Intrare proprie", "Собственный вход", "Dedicated entrance"), "OWNER_CONFIRMED", OWNER),
      fact(T("Etaje mari", "Просторные этажи", "Large floor plates"), "OWNER_CONFIRMED", OWNER),
      fact(T("Rețele inginerești", "Инженерные сети", "Building services"), "OWNER_CONFIRMED", OWNER),
      fact(T("Tubulatură de aer", "Воздуховоды", "Ductwork"), "OWNER_CONFIRMED", OWNER),
      fact(T("Fațadă vizibilă", "Заметный фасад", "A visible facade"), "OWNER_CONFIRMED", OWNER),
    ],
    tenantTitle: T("Pentru afacerea dumneavoastră", "Под ваш бизнес", "For your business"),
    tenant: sharedTenantScope,
  },

  story: {
    ...sharedStory,
    title: T("Clădirea așa cum este astăzi.", "Здание таким, какое оно есть сегодня.", "The building as it is today."),
    frames: [
      { key: "address", no: "01", shot: { photo: "building", position: "50% 56%" }, label: T("Clădirea", "Здание", "The building"), caption: T("Vedere generală: scara de acces, aleea pietonală și parcarea de-a lungul bulevardului.", "Вид на здание: лестница к входу, пешеходная аллея и парковка вдоль бульвара.", "The building: the entrance steps, the pedestrian promenade and parking along the boulevard.") },
    ],
  },

  lens: {
    ...sharedLens,
    noPhoto: T("Organizarea posibilă o arătăm pe planurile nivelurilor, la vizionare.", "Возможную организацию покажем на поэтажных планах на просмотре.", "We'll show a possible arrangement on the floor plans at the viewing."),
    formats: [
      {
        key: "office",
        label: T("Birou", "Офис", "Office"),
        question: T("Va fi comod pentru echipă să lucreze aici în fiecare zi?", "Удобно ли команде работать здесь каждый день?", "Will the team be comfortable working here every day?"),
        evidence: [
          { text: T("Intrare proprie și 4+ variante de acces.", "Собственный вход и 4+ варианта доступа.", "A dedicated entrance and 4+ access options."), ref: "tech", evidence: "OWNER_CONFIRMED", source: OWNER },
          { text: T("Restaurante, cafenele și servicii în apropiere.", "Рядом — рестораны, кафе и услуги.", "Restaurants, cafés and services close by."), ref: "location", evidence: "OWNER_CONFIRMED", source: ASSET },
          { text: T("Arterele Dacia, Traian și Decebal — acces auto direct.", "Магистрали Дачия, Траян и Дечебал — прямой подъезд.", "The Dacia, Traian and Decebal boulevards — direct access by car."), ref: "location", evidence: "OWNER_CONFIRMED", source: ASSET },
          ...(catalog ? [{ text: T("Un birou liber conform registrului de închiriere — în catalog.", "Свободный офис по реестру аренды — в каталоге.", "A free office per the lease register — in the catalogue."), ref: "spaces" as const, evidence: "OWNER_CONFIRMED" as const, source: REG }] : []),
        ],
        checks: [T("numărul de locuri de muncă pentru echipa dumneavoastră", "количество рабочих мест под вашу команду", "the number of workplaces your team needs"), T("puterea și rețelele de curenți slabi", "мощность и слаботочные сети", "power and low-voltage networks"), T("parcarea — numărul de locuri", "парковка — количество мест", "parking — the number of spaces")],
        closing: sharedLens.honesty,
        overlay: null,
      },
      {
        key: "cabinet",
        label: T("Cabinet", "Кабинет", "Cabinet"),
        question: T("Vă vor găsi clienții ușor?", "Легко ли клиентам вас найти?", "Will clients find you easily?"),
        evidence: [
          { text: T("Fațadă vizibilă la intrarea în oraș dinspre aeroport.", "Заметный фасад на въезде в город со стороны аэропорта.", "A visible facade on the approach from the airport."), ref: "photos", evidence: "OWNER_CONFIRMED", source: OWNER },
          { text: T("Alee pietonală largă chiar în fața clădirii.", "Широкая пешеходная аллея прямо перед зданием.", "A wide pedestrian promenade right in front of the building."), ref: "location", evidence: "OWNER_CONFIRMED", source: ASSET },
          { text: T("Cabinete mici alături de birouri, în aceeași clădire.", "Небольшие кабинеты рядом с офисами, в одном здании.", "Small cabinets beside offices, in one building."), ref: catalog ? "spaces" : "plans", evidence: "OWNER_CONFIRMED", source: REG },
        ],
        checks: [T("autorizațiile pentru activitatea dumneavoastră (pentru medicină — separat)", "разрешения под ваш вид деятельности (для медицины — отдельно)", "permits for your activity (medicine — separately)"), T("cerințele sanitare și apa în cabinet", "санитарные требования и вода в кабинете", "sanitary requirements and water in the cabinet"), T("indicatorul și firma — de comun acord", "указатель и вывеска — по согласованию", "the sign and signage — subject to agreement")],
        closing: sharedLens.honesty,
        overlay: null,
      },
      {
        key: "commercial",
        label: T("Comerț și servicii", "Торговля и услуги", "Retail and services"),
        question: T("Se va potrivi o suprafață mare formatului dumneavoastră?", "Подойдёт ли крупная площадь вашему формату?", "Will a large floor suit your format?"),
        evidence: [
          ...(catalog ? [{ text: T("Suprafețe mari libere pe parter, demisol și nivelul 2 — conform registrului de închiriere.", "Крупные свободные площади на 1‑м этаже, в цоколе и на уровне 2 — по реестру аренды.", "Large free floors on the ground floor, the lower level and level 2 — per the lease register."), ref: "spaces" as const, evidence: "OWNER_CONFIRMED" as const, source: REG }] : []),
          { text: T("Rețele inginerești și tubulatură de aer existente.", "Инженерные сети и воздуховоды уже есть.", "Building services and ductwork in place."), ref: "tech", evidence: "OWNER_CONFIRMED", source: OWNER },
          { text: T("Fațadă vizibilă dinspre arterele principale ale sectorului.", "Фасад заметен с главных магистралей сектора.", "A facade visible from the district's main roads."), ref: "photos", evidence: "OWNER_CONFIRMED", source: OWNER },
        ],
        checks: [T("împărțirea suprafeței — un chiriaș sau mai mulți, după verificarea tehnică", "деление площади — один или несколько арендаторов, после технической проверки", "division of the floor — one or several tenants, after the technical check"), T("descărcarea și accesul pentru livrări", "разгрузка и подъезд для доставки", "unloading and delivery access"), T("puterea, ventilația și extracția pentru formatul dumneavoastră", "мощность, вентиляция и вытяжка под ваш формат", "power, ventilation and extraction for your format")],
        closing: sharedLens.honesty,
        overlay: null,
      },
    ],
  },

  viewing: {
    kicker: T("Vizionare", "Просмотр", "Viewing"),
    title: T("Nu decideți după fotografii.\nVedeți Dacia 31 personal.", "Не решайте по фотографиям.\nПосмотрите Dacia 31 лично.", "Don't judge by photographs alone.\nSee Dacia 31 in person."),
    lead: T("Spuneți-ne ce căutați — birou, cabinet sau suprafață comercială — și pregătim pentru vizionare datele care contează pentru decizie.", "Расскажите, что ищете — офис, кабинет или торговую площадь, — и мы подготовим к просмотру данные, которые важны для решения.", "Tell us what you are looking for — an office, a cabinet or a commercial floor — and we'll prepare the information that matters for the decision."),
    steps: [
      { title: T("Înainte", "До просмотра", "Before"), text: T("formatul, suprafața necesară, cerințele tehnice, data mutării", "формат, нужная площадь, технические требования, срок переезда", "the format, the area you need, technical requirements, move-in date") },
      { title: T("La vizionare", "На просмотре", "At the viewing"), text: T("spațiile libere, intrările, nivelurile, punctele de racord, accesul și descărcarea", "свободные помещения, входы, уровни, точки подключения, доступ и разгрузка", "the free spaces, entrances, levels, service connection points, access and unloading") },
      { title: T("După", "После", "After"), text: T("verificarea tehnică pentru formatul dumneavoastră, apoi o ofertă individuală", "техническая проверка под ваш формат, затем индивидуальное предложение", "the technical check for your format, then an individual offer") },
    ],
    photo: null,
    contactsLine,
    film: null,
  },
};
