import { T, type LeasingExperience } from "@/data/leasing-experience-model";
import { OWNER_TEAM, contactsLine, fact, portfolioPhoto, sharedCost, sharedDrawers, sharedLens, sharedMotion, sharedPlans, sharedStory, sharedTenantScope, sharedTerms, teamRow } from "@/data/leasing-experience-shared";

/**
 * MOSCOVA 9 — dataset of the leasing template (OWNER «LEASING TEMPLATE LOCK», 2026-11-10; the Moscova 20 master structure).
 * The status (1st floor from 1 January 2027) is read from the unit record M9-01; its area (1 289,93 m²) and zone scheme are
 * NOT confirmed and never shown — the hero figure is the registered property area (2 561,3 m², OWNER tax records), labelled
 * as registered. No traffic figure, no plan, no cadastral number (its format is being verified).
 *
 * Sources (internal): OWNER FACT 2026-11-09 (1st floor from 2027-01-01) · OWNER tax records R3.3.1 §6 (registered area) ·
 * the confirmed capabilities and keyFacts of the asset (src/data/demo-content.ts tenantFit, src/lib/assets.ts) · the OWNER
 * portfolio photograph (one real frame).
 */

const OWNER = "OWNER 2026-10-09 / overnight brief 2026-11-09 — confirmed capability";
const ASSET = "src/lib/assets.ts — Moscova 9 asset record (OWNER copy)";

export const moscova9Experience: LeasingExperience = {
  unitId: "moscova-9-building",
  project: "moscova-9",
  address: T("Bd. Moscova 9", "бул. Москова, 9", "9 Moscova Blvd"),
  photos: {
    building: portfolioPhoto("m9-building", "moscova-9", 1439, 959, T("Moscova 9 de sus: fațada lungă pe prima linie a bulevardului, trotuarul și parcarea de-a lungul drumului", "Moscova 9 сверху: протяжённый фасад на первой линии бульвара, тротуар и парковка вдоль дороги", "Moscova 9 from above: the long frontage on the boulevard, the pavement and parking along the road"), "50% 62%"),
    buildingPhone: portfolioPhoto("m9-building-phone", "moscova-9-mobile", 729, 911, T("Moscova 9: fațada pe prima linie a bulevardului", "Moscova 9: фасад на первой линии бульвара", "Moscova 9: the boulevard frontage")),
  },
  ownerInput: ["street-level frontage", "both customer entrances", "the 1st-floor hall once vacated (2027)", "unloading ramp", "detail", "dusk / context"],

  hero: {
    photo: "building",
    phonePhoto: "buildingPhone",
    title: T("Planificați din timp următoarea locație.", "Запланируйте следующую локацию заранее.", "Plan your next location early."),
    place: T("Chișinău · Rîșcani", "Кишинёв · Рышкань", "Chișinău · Rîșcani"),
    // short, like the master «предлагается в аренду» (the 1st-floor area on request is said by the support line, the summary and the plans)
    offer: T("suprafața clădirii, conform registrului", "площадь здания по реестру", "registered building area"),
    support: T("O clădire independentă pe prima linie a bulevardului — se eliberează etajul 1.", "Отдельное здание на первой линии бульвара — освобождается 1-й этаж.", "A stand-alone building directly on the boulevard — the 1st floor is becoming available."),
  },
  cta: {
    primary: T("Anunțați interesul din timp", "Заявить интерес заранее", "Register interest early"),
    secondary: { label: T("Discutați cerințele tehnice", "Обсудить технические требования", "Discuss technical requirements"), href: "#technical-support" },
  },
  figure: 2561.3,
  summary: [
    { key: "readiness", label: T("Pregătire", "Готовность", "Readiness"), title: T("De la 1 ianuarie 2027", "С 1 января 2027", "From 1 January 2027"), text: T("Etajul 1 se eliberează la această dată — cererea se poate lăsa din timp.", "1-й этаж освобождается к этой дате — заявку можно оставить заранее.", "The 1st floor frees up on this date — the request can be left early.") },
    { key: "visibility", label: T("Vizibilitate", "Видимость", "Visibility"), title: T("Prima linie", "Первая линия", "Boulevard frontage"), text: T("Fațadă lungă, vizibilă de pe prima linie.", "Протяжённый фасад, виден с первой линии.", "A long frontage, clearly visible from the boulevard.") },
    { key: "area", label: T("Suprafață", "Площадь", "Area"), title: T("{area} înregistrați", "{area} зарегистрировано", "{area} registered"), text: T("Suprafața înregistrată a clădirii; suprafața etajului 1 — la cerere.", "Зарегистрированная площадь здания; площадь 1-го этажа — по запросу.", "The registered building area; the 1st-floor area on request.") },
  ],
  statement: { lines: [T("{area}.", "{area}.", "{area}."), T("O clădire independentă.", "Отдельное здание.", "A stand-alone building."), T("Prima linie a bulevardului.", "Первая линия бульвара.", "Directly on the boulevard.")], photo: null },
  decision: {
    kind: "economics",
    teaser: {
      title: T("De câți clienți pe zi are nevoie afacerea dumneavoastră?", "Сколько клиентов в день нужно вашему бизнесу?", "How many customers a day does your business need?"),
      text: T("Verificați-vă modelul pe datele proprii înainte ca etajul 1 să se elibereze.", "Проверьте свою модель на своих данных до того, как освободится 1-й этаж.", "Check your model on your own figures before the 1st floor frees up."),
    },
  },

  reasons: {
    label: T("Trei motive pentru o vizionare", "Три причины для просмотра", "Three reasons for a viewing"),
    items: [
      { key: "location", no: "01", label: T("Locație", "Локация", "Location"), text: T("Prima linie a bulevardului Moscova.", "Первая линия бульвара Москова.", "Directly on Moscova Boulevard.") },
      { key: "own", no: "02", label: T("Clădire proprie", "Своё здание", "Own building"), text: T("Fațadă, firmă și intrare proprii.", "Собственный фасад, вывеска и вход.", "Its own facade, signage and entrance.") },
      { key: "flows", no: "03", label: T("Fluxuri separate", "Раздельные потоки", "Separate flows"), text: T("Clienții — dinspre bulevard, marfa — prin rampă.", "Покупатели — с бульвара, товар — через рампу.", "Customers from the boulevard, goods via the ramp.") },
    ],
  },

  motion: {
    kicker: T("Locația în mișcare", "Локация в движении", "Location in motion"),
    title: T("Adresa este prima linie a bulevardului.", "Адрес — первая линия бульвара.", "An address directly on the boulevard."),
    lead: T("Sectorul Rîșcani, bulevardul Moscova: flux constant de mașini și pietoni, parcare de-a lungul bulevardului și un cartier rezidențial dens.", "Сектор Рышкань, бульвар Москова: постоянный автомобильный и пешеходный поток, парковка вдоль бульвара и плотный жилой район.", "Rîșcani district, Moscova Boulevard: a steady flow of cars and pedestrians, parking along the boulevard and a dense residential district."),
    ...sharedMotion,
    ecosystem: [
      { key: "boulevard", category: "services", title: T("Bulevardul Moscova", "Бульвар Москова", "Moscova Boulevard"), text: T("Flux constant de mașini și pietoni.", "Постоянный автомобильный и пешеходный поток.", "A steady flow of cars and pedestrians.") },
      { key: "residential", category: "residential", title: T("Cartier rezidențial dens", "Плотный жилой район", "Dense residential district"), text: T("Un public local constant.", "Постоянная локальная аудитория.", "A steady local audience.") },
      { key: "parking", category: "services", title: T("Parcare", "Парковка", "Parking"), text: T("De-a lungul bulevardului.", "Вдоль бульвара.", "Along the boulevard.") },
    ],
    addressText: T("Bd. Moscova 9, sectorul Rîșcani — fațada pe prima linie a bulevardului.", "Бул. Москова, 9, сектор Рышкань — фасад на первой линии бульвара.", "9 Moscova Blvd, Rîșcani district — the frontage directly on the boulevard."),
    visibility: null,
    verdict: {
      title: T("Această locație merită verificată pentru afacerea dumneavoastră.", "Эта локация заслуживает проверки для вашего бизнеса.", "This location deserves a check for your business."),
      text: T("Fluxul de pe bulevard creează potențial comercial. Cât de potrivit este pentru modelul dumneavoastră — verificăm împreună, înainte ca etajul 1 să se elibereze.", "Поток на бульваре создаёт коммерческий потенциал. Насколько он подходит именно вашей модели — проверим вместе, до того как освободится 1-й этаж.", "The flow on the boulevard creates commercial potential. How well it suits your model is something we check together, before the 1st floor frees up."),
    },
    cta: {
      title: T("Se potrivește această adresă afacerii dumneavoastră?", "Подходит ли этот адрес вашему бизнесу?", "Does this address suit your business?"),
      text: T("Spuneți-ne cum funcționează formatul dumneavoastră — pregătim vizionarea pe ce contează pentru modelul dumneavoastră.", "Расскажите, как работает ваш формат, — подготовим просмотр под то, что важно для вашей модели.", "Tell us how your format works — we prepare the viewing around what matters for your model."),
    },
  },

  drawers: sharedDrawers,
  specs: [],
  location: {
    lead: T("Bulevardul Moscova, sectorul Rîșcani.", "Бульвар Москова, сектор Рышкань.", "Moscova Boulevard, Rîșcani district."),
    points: [
      fact(T("Front la bulevardul Moscova", "Фасад на бульвар Москова", "Frontage on Moscova Boulevard"), "OWNER_CONFIRMED", ASSET),
      fact(T("Flux constant de mașini și pietoni", "Постоянный автомобильный и пешеходный поток", "Steady flow of cars and pedestrians"), "OWNER_CONFIRMED", ASSET),
      fact(T("Parcare de-a lungul bulevardului", "Парковка вдоль бульвара", "Parking along the boulevard"), "OWNER_CONFIRMED", OWNER),
      fact(T("Cartier rezidențial dens", "Плотный жилой район", "Dense residential district"), "OWNER_CONFIRMED", ASSET),
    ],
    metrics: [],
    internal: [],
    internalNote: "No traffic or demographic figure for Moscova 9 — none is published without a field count.",
  },
  area: {
    propertyLine: T("Suprafața înregistrată a clădirii — 2.561,3 m²; suprafața etajului 1 pentru închiriere — la cerere.", "Зарегистрированная площадь здания — 2 561,3 м²; площадь 1-го этажа к аренде — по запросу.", "The registered building area is 2,561.3 m²; the 1st-floor area for lease is given on request."),
    groundOnly: null,
  },
  access: [
    { key: "customer", label: T("Intrări pentru clienți", "Входы для покупателей", "Customer entrances"), value: T("Două, dinspre bulevard.", "Два, с бульвара.", "Two, from the boulevard."), state: "ready", evidence: "OWNER_CONFIRMED", source: OWNER },
    { key: "delivery", label: T("Descărcare", "Разгрузка", "Unloading"), value: T("Rampă și zonă de descărcare de 69,46 m², flux separat.", "Рампа и зона разгрузки 69,46 м², отдельный поток.", "A ramp and a 69.46 m² unloading zone, a separate flow."), state: "ready", evidence: "OWNER_CONFIRMED", source: OWNER },
    { key: "parking", label: T("Parcare", "Парковка", "Parking"), value: T("De-a lungul bulevardului.", "Вдоль бульвара.", "Along the boulevard."), state: "ready", evidence: "OWNER_CONFIRMED", source: OWNER },
    { key: "hall", label: T("Sala principală a clădirii", "Основной торговый зал здания", "The building's main sales floor"), value: T("737,07 m², la nivelul străzii.", "737,07 м², на уровне улицы.", "737.07 m², at street level."), state: "fact", evidence: "OWNER_CONFIRMED", source: ASSET },
    teamRow("signage", T("Firmă", "Вывеска", "Signage")),
  ],
  engineering: {
    rows: [teamRow("power", T("Alimentare electrică", "Электроснабжение", "Power")), teamRow("ventilation", T("Ventilație", "Вентиляция", "Ventilation")), teamRow("heating", T("Încălzire", "Отопление", "Heating")), teamRow("water", T("Apă și canalizare", "Водоснабжение и канализация", "Water and sewer"))],
    note: T("Parametrii inginerești se confirmă pentru formatul dumneavoastră împreună cu directorul tehnic și arhitectul MEGAPARC.", "Инженерные параметры подтверждаем под ваш формат вместе с техническим директором и архитектором MEGAPARC.", "The engineering parameters are confirmed for your format together with MEGAPARC's Technical Director and Architect."),
  },
  readiness: {
    confirmTitle: T("Clarificăm pentru afacerea dumneavoastră", "Уточняем под ваш бизнес", "We confirm for your business"),
    confirm: [
      fact(T("Suprafața etajului 1 pentru închiriere", "Площадь 1-го этажа к аренде", "The 1st-floor area for lease"), "TO_CONFIRM", OWNER_TEAM),
      fact(T("Puterea electrică pentru formatul dumneavoastră", "Электрическая мощность под ваш формат", "Power for your format"), "TO_CONFIRM", OWNER_TEAM),
      fact(T("Ventilația", "Вентиляция", "Ventilation"), "TO_CONFIRM", OWNER_TEAM),
      fact(T("Formatul firmei", "Формат вывески", "Signage format"), "TO_CONFIRM", OWNER_TEAM),
      fact(T("Numărul cadastral — în curs de verificare", "Кадастровый номер — проверяется", "The cadastral number — being verified"), "TO_CONFIRM", OWNER_TEAM),
      fact(T("Autorizații pentru activitatea dumneavoastră", "Разрешения под ваш вид деятельности", "Permits for your activity"), "TO_CONFIRM", OWNER_TEAM),
    ],
    costTitle: T("Din ce se compune lansarea", "Из чего складывается запуск", "What opening involves"),
    cost: sharedCost,
  },
  terms: sharedTerms,

  plans: {
    ...sharedPlans,
    levels: [],
    note: T("Planul etajului 1 îl pregătim pentru vizionare și pentru verificarea tehnică a formatului dumneavoastră — nu publicăm o schemă neconfirmată.", "План 1-го этажа подготовим к просмотру и технической проверке вашего формата — неподтверждённую схему не публикуем.", "We prepare the 1st-floor plan for the viewing and the technical check of your format — an unconfirmed scheme is not published."),
    source: OWNER_TEAM,
    marks: null,
    onRequest: {
      tab: T("Etajul 1", "1-й этаж", "1st floor"),
      title: T("Planul etajului 1", "План 1-го этажа", "1st-floor plan"),
      text: T("Îl pregătim pentru vizionare și pentru verificarea tehnică a formatului dumneavoastră.", "Подготовим к просмотру и технической проверке вашего формата.", "We prepare it for the viewing and the technical check of your format."),
      floors: [T("Etajul 1 — se eliberează la 1 ianuarie 2027", "1-й этаж — освобождается 1 января 2027", "1st floor — frees up on 1 January 2027"), T("Suprafața etajului 1 — la cerere", "Площадь 1-го этажа — по запросу", "The 1st-floor area — on request")],
    },
  },

  capex: {
    kicker: T("Ce există deja", "Что уже есть", "What is in place"),
    title: T("Clădire proprie.\nAdaptarea — după verificarea tehnică.", "Собственное здание.\nАдаптация — после технической проверки.", "A building of its own.\nAdaptation after the technical check."),
    lead: T("Intrările, descărcarea și parcarea sunt deja pe loc; formatul dumneavoastră îl verificăm tehnic înainte de contract.", "Входы, разгрузка и парковка уже на месте; ваш формат проверим технически до договора.", "The entrances, unloading and parking are already in place; your format is checked technically before the lease."),
    photo: null,
    readyTitle: T("Deja există", "Уже есть", "Already in place"),
    ready: [
      fact(T("Două intrări din bulevard", "Два входа с бульвара", "Two entrances from the boulevard"), "OWNER_CONFIRMED", OWNER),
      fact(T("Rampă de descărcare", "Рампа для разгрузки", "An unloading ramp"), "OWNER_CONFIRMED", OWNER),
      fact(T("Sală la nivelul străzii", "Зал на уровне улицы", "A street-level hall"), "OWNER_CONFIRMED", OWNER),
      fact(T("Parcare de-a lungul bulevardului", "Парковка вдоль бульвара", "Parking along the boulevard"), "OWNER_CONFIRMED", OWNER),
      fact(T("Flux separat pentru marfă", "Отдельный поток товаров", "A separate goods flow"), "OWNER_CONFIRMED", ASSET),
    ],
    tenantTitle: T("Pentru afacerea dumneavoastră", "Под ваш бизнес", "For your business"),
    tenant: sharedTenantScope,
  },

  story: {
    ...sharedStory,
    title: T("Clădirea așa cum este astăzi.", "Здание таким, какое оно есть сегодня.", "The building as it is today."),
    frames: [
      { key: "address", no: "01", shot: { photo: "building", position: "50% 62%" }, label: T("Adresa", "Адрес", "Address"), caption: T("Prima linie a bulevardului Moscova: fațada lungă, trotuarul și parcarea de-a lungul drumului.", "Первая линия бульвара Москова: протяжённый фасад, тротуар и парковка вдоль дороги.", "Directly on Moscova Boulevard: the long frontage, the pavement and parking along the road.") },
    ],
  },

  lens: {
    ...sharedLens,
    noPhoto: T("Organizarea posibilă o arătăm pe planul etajului 1, la vizionare.", "Возможную организацию покажем на плане 1-го этажа на просмотре.", "We show a possible organisation on the 1st-floor plan at the viewing."),
    formats: [
      {
        key: "retail",
        label: T("Retail", "Ритейл", "Retail"),
        question: T("Mă vor observa?", "Увидят ли меня?", "Will they notice me?"),
        evidence: [
          { text: T("Fațadă lungă pe prima linie a bulevardului.", "Протяжённый фасад на первой линии бульвара.", "A long frontage directly on the boulevard."), ref: "photos", evidence: "OWNER_CONFIRMED", source: OWNER },
          { text: T("Două intrări pentru clienți, dinspre bulevard.", "Два входа для покупателей с бульвара.", "Two customer entrances from the boulevard."), ref: "tech", evidence: "OWNER_CONFIRMED", source: OWNER },
          { text: T("Flux constant de mașini și pietoni pe bulevard.", "Постоянный автомобильный и пешеходный поток на бульваре.", "A steady flow of cars and pedestrians on the boulevard."), ref: "location", evidence: "OWNER_CONFIRMED", source: ASSET },
          { text: T("Cartier rezidențial dens în jur.", "Вокруг — плотный жилой район.", "A dense residential district around."), ref: "location", evidence: "OWNER_CONFIRMED", source: ASSET },
        ],
        checks: [T("suprafața etajului 1 pentru formatul dumneavoastră", "площадь 1-го этажа под ваш формат", "the 1st-floor area for your format"), T("puterea electrică și ventilația", "мощность и вентиляция", "power and ventilation"), T("formatul și dimensiunile firmei", "формат и размеры вывески", "signage format and size")],
        closing: sharedLens.honesty,
        overlay: null,
      },
      {
        key: "showroom",
        label: T("Showroom", "Шоурум", "Showroom"),
        question: T("Vor putea clienții să ajungă comod?", "Смогут ли клиенты удобно приехать?", "Can customers get here easily?"),
        evidence: [
          { text: T("Parcare de-a lungul bulevardului.", "Парковка вдоль бульвара.", "Parking along the boulevard."), ref: "tech", evidence: "OWNER_CONFIRMED", source: OWNER },
          { text: T("Rampă și zonă de descărcare separate — marfa nu se intersectează cu clienții.", "Отдельная рампа и зона разгрузки — товар не пересекается с покупателями.", "A separate ramp and unloading zone — goods never cross the customers' path."), ref: "tech", evidence: "OWNER_CONFIRMED", source: OWNER },
          { text: T("Clădire independentă, în afara centrelor comerciale — fațadă și firmă proprii.", "Отдельное здание вне торговых центров — собственный фасад и вывеска.", "A stand-alone building outside the malls — its own facade and signage."), ref: "photos", evidence: "OWNER_CONFIRMED", source: ASSET },
        ],
        checks: [T("descărcarea mărfii voluminoase", "разгрузка крупногабаритного товара", "unloading of large goods"), T("iluminatul expoziției", "освещение экспозиции", "display lighting"), T("formatul firmei", "формат вывески", "signage format")],
        closing: sharedLens.honesty,
        overlay: null,
      },
    ],
  },

  viewing: {
    kicker: T("Interes din timp", "Ранний интерес", "Early interest"),
    title: T("Nu decideți după fotografii.\nRezervați din timp vizionarea Moscova 9.", "Не решайте по фотографиям.\nЗаймите очередь на просмотр Moscova 9.", "Don't decide from photographs.\nQueue early for a viewing of Moscova 9."),
    lead: T("Etajul 1 se eliberează la 1 ianuarie 2027. Lăsați o cerere — revenim pentru vizionare și pentru verificarea tehnică a formatului dumneavoastră.", "1-й этаж освобождается 1 января 2027. Оставьте заявку — свяжемся для просмотра и технической проверки вашего формата.", "The 1st floor frees up on 1 January 2027. Leave a request — we come back for the viewing and the technical check of your format."),
    steps: [
      { title: T("Înainte", "До просмотра", "Before"), text: T("formatul, cerințele tehnice, suprafața necesară, termenul deschiderii", "формат, технические требования, нужная площадь, срок открытия", "format, technical requirements, the area you need, opening date") },
      { title: T("La vizionare", "На просмотре", "At the viewing"), text: T("clădirea, intrările, descărcarea, punctele inginerești, accesul", "здание, входы, разгрузка, инженерные точки, доступ", "the building, entrances, unloading, engineering points, access") },
      { title: T("După", "После", "After"), text: T("cerințele tehnice verificate, apoi condițiile comerciale", "проверенные технические требования, затем коммерческие условия", "the technical requirements checked, then the commercial terms") },
    ],
    photo: null,
    contactsLine,
    film: null,
    second: { label: T("Discutați cerințele tehnice", "Обсудить технические требования", "Discuss technical requirements"), meta: T("Directorul tehnic și arhitectul MEGAPARC", "Технический директор и архитектор MEGAPARC", "MEGAPARC's Technical Director and Architect"), intent: "viewing" },
  },
};
