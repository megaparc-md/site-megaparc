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
const PHOTO = "OWNER photographs 16.10.2026 — current condition";
const NET = "Certificat contabil — rețele tehnico-edilitare exterioare, 30.09.2026";
const PLANS = "Plan_0.000 (Anexa 2) and Plan_-2.950 / -3.300 (Anexa 1), Moscova 20 Variant 1, project 15/19 SA, arch. A. Novicov, 06.21 — OWNER files";
// OWNER «MOSCOVA 20 — OWNER TECHNICAL DATA UPDATE» (2026-11-10): heating, HVAC per level, sanitary rooms, 4 exits, 15 parking spaces,
// loading from both sides, lighting connection points, illuminated signage by a separate design
const TECH = "OWNER technical data update 2026-11-10";
// OWNER «FINAL TECHNICAL CORRECTIONS» (2026-11-10): heating = Termoelectrica · security = Justar · sanitary = 3 toilets + a separate cleaning-inventory room
const TECH_FINAL = "OWNER final technical corrections 2026-11-10";
const READINESS = "OWNER readiness block correction 2026-11-10 — concept-dependent fit-out items";
const SCENARIO = "Possible organisation — generic zones on a real photograph (OWNER final viewing pass 2026-11-06); never a tenant layout";
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
  // OWNER «MOSCOVA 20 — MAIN LEASING IMAGE» (2026-11-10): the OWNER-approved processed photograph of the same entrance («Chirie» sign removed) — the primary exterior frame
  entranceProcessed: photo("m20-entrance-processed", 1600, 900, T("Intrarea Moscova 20: vitrina, ușa de sticlă, scările și rampa de acces", "Вход Moscova 20: витрина, стеклянная дверь, лестница и пандус", "The Moscova 20 entrance: the shop window, the glass door, the steps and the access ramp"), { position: "18% 62%", source: "OWNER-approved processed photograph 2026-11-10 (the m20-entrance frame retouched: «Chirie» sign removed)" }),
  groundHall: photo("m20-ground-hall", 1600, 1066, T("Parterul astăzi: gresie, pereți vopsiți, calorifere, climatizare tip casetă, trasee de ventilație", "1-й этаж сегодня: плитка, окрашенные стены, радиаторы, кассетный кондиционер, трассы вентиляции", "The ground floor today: tiles, painted walls, radiators, cassette air-conditioning, ventilation ducts")),
  groundGlazing: photo("m20-ground-glazing", 1600, 1066, T("Parterul de-a lungul vitrinei: calorifere sub geam și golul scării spre demisol", "1-й этаж вдоль витрины: радиаторы под остеклением и проём лестницы в цоколь", "The ground floor along the glazing: radiators under the windows and the stair opening to the lower ground")),
  stairs: photo("m20-stairs", 1600, 1066, T("Scara interioară dintre parter și demisol", "Внутренняя лестница между 1-м этажом и цоколем", "The internal staircase between the ground floor and the lower ground")),
  lowerHall: photo("m20-lower-hall", 1600, 1066, T("Demisolul: o sală lungă cu pardoseală finisată și climatizare", "Цоколь: длинный зал с готовым полом и кондиционированием", "The lower ground: a long hall with a finished floor and air-conditioning")),
  lowerFinish: photo("m20-lower-finish", 1600, 1066, T("Demisolul: pardoseala finisată, scara, calorifere, indicatoare de ieșire", "Цоколь: готовый пол, лестница, радиаторы, указатели выходов", "The lower ground: finished floor, staircase, radiators, exit signs")),
  lowerService: photo("m20-lower-service", 1600, 1066, T("Demisolul: sala cu stâlpi și zonele de serviciu", "Цоколь: зал с колоннами и служебные зоны", "The lower ground: the hall with columns and the service areas")),
  engineering: photo("m20-engineering", 1600, 1066, T("Trasee de ventilație, indicator de ieșire și scara în demisol", "Трассы вентиляции, указатель выхода и лестница в цоколе", "Ventilation ducts, an exit sign and the staircase in the lower ground")),
  lowerStairs: photo("m20-lower-stairs", 1600, 1066, T("Demisolul gol, pregătit pentru conceptul chiriașului", "Пустой цоколь, готовый к концепции арендатора", "The empty lower ground, ready for the tenant's concept")),
  approach: photo("m20-approach", 1278, 959, T("Cum se ajunge: trotuarul, scările și rampa spre intrare", "Как подойти: тротуар, лестница и пандус к входу", "How you arrive: the pavement, the steps and the ramp to the entrance")),
  // OWNER plan replacement pass 2026-11-09: crops of the OWNER PDFs (rotated to reading orientation, 2.4 px / pt;
  // geometry unchanged) — Plan_0.000_Moscova_20_Variant_1 (1).pdf and Plan_-2.950_-3.300_Moscova_20_Variant_1.pdf
  planGround: photo("m20-plan-ground", 3199, 3005, T("Planul parterului, cota +0,000, scara 1:100 — anexa nr. 2 la contractul de locațiune", "План 1-го этажа, отметка +0,000, М 1:100 — приложение № 2 к договору аренды", "Ground floor plan, level +0.000, scale 1:100 — annex no. 2 to the lease agreement"), { smallWidth: 1400, evidence: "DOCUMENT_CONFIRMED", source: PLANS }),
  planLower: photo("m20-plan-lower", 2647, 1735, T("Planul demisolului, cotele −2,950 / −3,300, scara 1:100 — anexa nr. 1 la contractul de locațiune", "План цоколя, отметки −2,950 / −3,300, М 1:100 — приложение № 1 к договору аренды", "Lower ground plan, levels −2.950 / −3.300, scale 1:100 — annex no. 1 to the lease agreement"), { smallWidth: 1400, evidence: "DOCUMENT_CONFIRMED", source: PLANS }),
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

export const moscova20Experience: LeasingExperience = {
  unitId: "moscova-20-corner",
  project: "moscova-20",
  address: T("Bd. Moscova 20", "бул. Москова, 20", "20 Moscova Blvd"),
  photos,
  // the master configuration of the leasing template (OWNER «LEASING TEMPLATE LOCK», 2026-11-10): the decision zone is the full calculator
  decision: {
    kind: "economics",
    teaser: {
      title: T("De câți clienți pe zi are nevoie afacerea dumneavoastră?", "Сколько клиентов в день нужно вашему бизнесу?", "How many customers a day does your business need?"),
      text: T("Verificați-vă modelul înainte de a decide asupra locației.", "Проверьте свою модель до того, как принимать решение по локации.", "Check your model before you decide on the location."),
    },
  },

  hero: {
    // OWNER «MOSCOVA 20 — REPLACE PRIMARY HERO PHOTO» (2026-11-10): the OWNER-approved processed exterior (entrance, glazing, stairs,
    // ramp, no «Chirie» sign) is the primary hero image — the same image as the Leasing cover; focal 18 % 62 % keeps the door and the ramp
    // (the interior hall stays in the gallery). The R3.1 rejection concerned the elevated facade frames, not this ground-level entrance.
    photo: "entranceProcessed",
    phonePhoto: "entranceProcessed",
    title: T("Spațiu pentru următorul pas al afacerii dumneavoastră.", "Пространство для следующего шага вашего бизнеса.", "Space for your business's next step."),
    place: T("Chișinău · Rîșcani", "Кишинёв · Рышкань", "Chișinău · Rîșcani"),
    offer: T("oferiți în chirie", "предлагается в аренду", "offered for lease"),
    // OWNER copy correction 2026-11-10 (capex / tenant investment): replaces «Капитальная база уже готова.» — the core capital works are done,
    // the tenant invests primarily in adapting the space to its format (never zero investment, never fit-out included)
    support: T("Lucrările capitale de bază sunt deja realizate — investiția chiriașului va fi necesară în primul rând pentru adaptarea spațiului la propriul format.", "Базовые капитальные работы уже выполнены — инвестиции арендатора потребуются прежде всего для адаптации пространства под собственный формат.", "The core capital works are already complete — the tenant’s investment will be needed primarily to adapt the space to its own format."),
  },

  reasons: {
    label: T("Trei motive pentru o vizionare", "Три причины для просмотра", "Three reasons for a viewing"),
    items: [
      { key: "location", no: "01", label: T("Locație", "Локация", "Location"), text: T("Context urban activ.", "Активный городской контекст.", "An active city setting.") },
      { key: "base", no: "02", label: T("Lucrări de bază", "Базовые работы", "Core works"), text: T("Lucrările capitale de bază sunt deja realizate.", "Базовые капитальные работы уже выполнены.", "The core capital works are already complete.") },
      { key: "flex", no: "03", label: T("Flexibilitate", "Гибкость", "Flexibility"), text: T("Spațiul se adaptează formatului afacerii după verificarea tehnică.", "Пространство адаптируется под формат бизнеса после технической проверки.", "The space adapts to the business format after a technical check.") },
    ],
  },

  motion: {
    kicker: T("Locația în mișcare", "Локация в движении", "Location in motion"),
    // OWNER art direction 2026-11-09 §12: the statement of the location scene; the earlier title stays as its line
    title: T("Adresa face parte din modelul de afaceri.", "Адрес — часть бизнес-модели.", "The address is part of the business model."),
    lead: T("Adresa nu este un punct pe hartă. Este mișcarea din jurul afacerii dumneavoastră.", "Адрес — это не точка на карте. Это движение вокруг вашего бизнеса.", "An address is not a point on a map. It is the movement around your business."),
    ecosystemTitle: T("Ce creează activitate regulată în jurul locației", "Что создаёт регулярную активность вокруг локации", "What creates regular activity around the location"),
    ecosystem: [
      { key: "residential", category: "residential", title: T("Cartier rezidențial", "Жилой район", "Residential district"), text: T("Un public local constant pe parcursul zilei.", "Постоянная локальная аудитория в течение дня.", "A steady local audience throughout the day.") },
      { key: "education", category: "education", title: T("Educație", "Образование", "Education"), text: T("Școlile și grădinițele formează trasee zilnice regulate.", "Школы и детские учреждения формируют регулярные ежедневные маршруты.", "Schools and kindergartens create regular daily routes.") },
      { key: "transport", category: "transport", title: T("Transport", "Транспорт", "Transport"), text: T("Rutele urbane asigură accesul angajaților și al clienților.", "Городские маршруты обеспечивают доступ сотрудников и клиентов.", "City routes give staff and customers access.") },
      { key: "services", category: "services", title: T("Servicii zilnice", "Ежедневные сервисы", "Everyday services"), text: T("Alimentarele, farmaciile, serviciile și magazinele formează deja obiceiul de a veni în cartier.", "Продукты, аптеки, услуги и торговые точки уже формируют привычку посещения района.", "Groceries, pharmacies, services and shops already make the district a daily habit.") },
    ],
    modelTitle: T("Analiză preliminară a locației · scenariu modelat", "Предварительный анализ локации · моделируемый сценарий", "Preliminary location analysis · modelled scenario"),
    modelCaption: T("Model preliminar MEGAPARC · indicatorii necesită confirmare prin numărătoare pe teren.", "Предварительная модель MEGAPARC · показатели требуют подтверждения полевым замером.", "Preliminary MEGAPARC model · the figures require confirmation by a field count."),
    rhythmTitle: T("Cum trăiește locația", "Как живёт локация", "How the location lives"),
    rhythmNote: T("Ritmul zilei după model: dimineața — constant, ziua — mediu, seara — vârf. Fără valori exacte până la numărătoare.", "Ритм дня по модели: утром — устойчиво, днём — средне, вечером — пик. Без точных значений до замера.", "The day's rhythm in the model: steady in the morning, medium in the day, a peak in the evening. No exact values before the count."),
    mapTab: T("Împrejurimi", "Окружение", "Surroundings"),
    // OWNER micro-fix 2026-11-09: straight-line radii, not pedestrian isochrones — no «пешая доступность», no minutes until real walking routes are calculated
    mapCaption: T("Raze orientative ale împrejurimilor: ≈ 400 / 800 / 1 200 m în linie dreaptă. Datele împrejurimilor © OpenStreetMap.", "Ориентировочные радиусы окружения: ≈ 400 / 800 / 1 200 м по прямой. Данные окружения © OpenStreetMap.", "Approximate surroundings radii: ≈ 400 / 800 / 1,200 m in a straight line. Surroundings data © OpenStreetMap."),
    visibilityTab: T("Cum se vede obiectul", "Как виден объект", "How it is seen"),
    visibility: {
      photo: "context",
      caption: T("Fotografie aeriană reală; sunt marcate doar elementele confirmate.", "Реальное аэрофото; отмечены только подтверждённые элементы.", "A real aerial photograph; only confirmed elements are marked."),
      marks: [
        { key: "object", kind: "object", label: T("Moscova 20", "Moscova 20", "Moscova 20"), shape: [[432, 372], [468, 350], [806, 416], [801, 548], [592, 506], [432, 428]], at: [520, 318], evidence: "OWNER_CONFIRMED", source: PHOTO },
        { key: "glazing", kind: "glazing", label: T("Vitrina spre bulevard", "Витрина к бульвару", "Shop window to the boulevard"), shape: [[596, 508], [792, 550]], at: [480, 470], evidence: "OWNER_CONFIRMED", source: PHOTO },
        { key: "entrance", kind: "entrance", label: T("Intrarea clienților: scări și rampă", "Вход для клиентов: лестница и пандус", "Customer entrance: steps and a ramp"), shape: [[742, 640], [748, 566]], at: [790, 610], evidence: "OWNER_CONFIRMED", source: `${OWNER} §4, §7 · ${PHOTO}` },
        { key: "pavement", kind: "pavement", label: T("Trotuarul bulevardului — accesul pietonal", "Тротуар бульвара — пешеходный подход", "The boulevard pavement — pedestrian approach"), shape: [[318, 500], [1000, 706]], at: [905, 742], evidence: "OWNER_CONFIRMED", source: PHOTO },
        { key: "road", kind: "road", label: T("Bulevardul Moscova · circulație în ambele sensuri", "Бульвар Москова · движение в обе стороны", "Moscova Boulevard · traffic both ways"), shape: [[70, 712], [640, 948]], at: [150, 805], evidence: "DOCUMENT_CONFIRMED", source: `${PHOTO} · OSM: Bulevardul Moscova, primary, 6 lanes (docs/research)` },
      ],
    },
    verdict: {
      title: T("Această locație merită verificată pentru afacerea dumneavoastră.", "Эта локация заслуживает проверки для вашего бизнеса.", "This location deserves a check for your business."),
      text: T("Mișcarea din jurul obiectului creează potențial comercial. Cât de potrivit este pentru modelul dumneavoastră — verificăm împreună.", "Движение вокруг объекта создаёт коммерческий потенциал. Насколько он подходит именно вашей модели — проверим вместе.", "The movement around the property creates commercial potential. How well it suits your model is something we check together."),
    },
    cta: {
      title: T("Se potrivește acest flux afacerii dumneavoastră?", "Подходит ли этот поток именно вашему бизнесу?", "Does this flow suit your business?"),
      text: T("Spuneți-ne cum funcționează formatul dumneavoastră. La vizionare ne concentrăm pe caracteristicile obiectului și ale locației care contează pentru modelul dumneavoastră.", "Расскажите, как работает ваш формат. На просмотре мы сосредоточимся на тех характеристиках объекта и локации, которые имеют значение именно для вашей модели.", "Tell us how your format works. At the viewing we focus on the features of the property and the location that matter for your model."),
    },
  },

  drawers: {
    // OWNER «TECHNICAL READINESS — OWNER REDESIGN» (2026-11-10): the drawer is the tenant technical passport
    tech: { title: T("Pregătirea tehnică", "Техническая готовность", "Technical readiness"), lead: T("Infrastructura de bază a obiectului este deja realizată. Înainte de adaptarea spațiului verificăm cerințele afacerii concrete.", "Базовая инфраструктура объекта уже создана. Перед адаптацией помещения проверяем требования конкретного бизнеса.", "The building’s core infrastructure is already in place. Before the space is adapted, we check the requirements of the specific business.") },
    readiness: { title: T("Pregătire pentru lansare", "Готовность к запуску", "Ready to open"), lead: T("Ce mai clarificăm pentru afacerea dumneavoastră și din ce se compune lansarea.", "Что ещё уточняем под ваш бизнес и из чего складывается запуск.", "What we still confirm for your business and what opening involves.") },
  },

  // TENANT TECHNICAL PASSPORT — every value repeats a confirmed record (this file, the OWNER technical data update
  // 2026-11-10, the unit's level breakdown); nothing new is stated. Open points live in docs/OWNER_INPUTS_R3.md §F, never here:
  //  · heating = Termoelectrica · security = Justar · sanitary = 3 toilets + a separate cleaning-inventory room (OWNER final, resolved)
  //  · 4 exits total; 3 specifically described by OWNER — 4th exit role/location TO_CONFIRM
  //  · parking: 15 spaces only — not exclusive, reserved, free or 24/7 unless confirmed
  //  · «Alco Market» — relationship to Moscova 20 not documented: OWNER_TO_CONFIRM, not published
  passport: {
    facts: [
      { key: "power", figure: T("38", "38", "38"), unit: T("kW", "кВт", "kW"), label: T("alimentare trifazată, conform documentelor", "3‑фазное электроснабжение по документам", "three-phase supply, documented"), evidence: "DOCUMENT_CONFIRMED", source: `${OWNER} §4 · ${NET}` },
      { key: "heights", figure: "heights", unit: T("m", "м", "m"), label: { ro: "înălțimea încăperilor · parter / demisol", ru: "высота помещений · 1‑й этаж / цоколь", en: "clear height · ground floor / lower ground" }, evidence: "APPROXIMATE", source: "Unit record M20-01 · plans Anexa 1 / 2" },
      { key: "exits", figure: T("4", "4", "4"), unit: T("ieșiri", "выхода", "exits"), label: { ro: "dintre care 2 spre bulevard și 1 spre curte", ru: "в том числе 2 к бульвару и 1 во двор", en: "including 2 to the boulevard and 1 to the courtyard" }, evidence: "OWNER_CONFIRMED", source: TECH },
      { key: "sanitary", figure: T("3", "3", "3"), unit: T("grupuri sanitare", "санузла", "toilets"), label: T("și o încăpere pentru inventarul de curățenie", "и помещение для уборочного инвентаря", "and a cleaning-inventory room"), evidence: "OWNER_CONFIRMED", source: TECH },
    ],
    sides: {
      title: T("Două laturi: bulevardul și curtea", "Две стороны: бульвар и двор", "Two sides: the boulevard and the courtyard"),
      core: T("Moscova 20 · parter + demisol", "Moscova 20 · 1‑й этаж + цоколь", "Moscova 20 · ground + lower ground"),
      sides: [
        { key: "boulevard", name: T("Bulevardul Moscova", "Бульвар Москова", "Moscova Boulevard"), items: [T("intrare directă pentru clienți — scări și rampă", "прямой вход для клиентов — лестница и пандус", "direct customer entrance — steps and a ramp"), T("2 ieșiri", "2 выхода", "2 exits"), T("primirea mărfii", "приём товара", "goods delivery")], evidence: "OWNER_CONFIRMED", source: `${TECH} · ${OWNER} §4, §7 · ${PHOTO}` },
        { key: "courtyard", name: T("Curtea", "Двор", "Courtyard"), items: [T("1 ieșire", "1 выход", "1 exit"), T("rampă de descărcare", "разгрузочная рампа", "a loading ramp"), T("primirea mărfii", "приём товара", "goods delivery")], evidence: "OWNER_CONFIRMED", source: `${TECH} · ${PLANS}` },
      ],
      caption: T("Schemă de direcții, fără scară.", "Схема направлений, не в масштабе.", "A diagram of directions, not to scale."),
    },
    groups: [
      {
        key: "engineering",
        title: T("Inginerie", "Инженерия", "Engineering"),
        items: [
          { key: "power", title: T("Alimentare electrică", "Электроснабжение", "Power supply"), value: T("3 faze · 38 kW conform documentelor", "3 фазы · 38 кВт по документам", "3 phases · 38 kW, documented"), note: T("Dacă puterea este suficientă se verifică după cerințele formatului concret.", "Достаточность мощности проверяется под требования конкретного формата.", "Whether the capacity is enough is checked against the needs of the specific format."), evidence: "DOCUMENT_CONFIRMED", source: `${OWNER} §4 · ${NET}` },
          { key: "heating", title: T("Încălzire", "Отопление", "Heating"), value: T("Termoelectrica", "Termoelectrica", "Termoelectrica"), note: T("Încălzire centralizată, calorifere pe ambele niveluri.", "Централизованное отопление, радиаторы на обоих уровнях.", "Central heating, radiators on both levels."), evidence: "OWNER_CONFIRMED", source: `${TECH_FINAL} · ${OWNER} §4 · ${PHOTO} · ${NET}` },
          { key: "ac-ground", title: T("Climatizare · parter", "Кондиционирование · 1‑й этаж", "Air-conditioning · ground floor"), value: T("Sisteme split", "Сплит-системы", "Split systems"), evidence: "OWNER_CONFIRMED", source: TECH },
          { key: "ac-lower", title: T("Climatizare · demisol", "Кондиционирование · цоколь", "Air-conditioning · lower ground"), value: T("Sistem de climatizare pe canale", "Канальная система кондиционирования", "A ducted air-conditioning system"), evidence: "OWNER_CONFIRMED", source: TECH },
          { key: "ventilation", title: T("Ventilație", "Вентиляция", "Ventilation"), value: T("Prevăzută în infrastructura tehnică", "Предусмотрена в составе технической инфраструктуры", "Provided for in the technical infrastructure"), evidence: "OWNER_CONFIRMED", source: TECH },
          { key: "extraction", title: T("Hotă", "Вытяжка", "Extraction"), value: T("După conceptul chiriașului", "Под концепцию арендатора", "To the tenant’s concept"), note: T("Cerințele pentru hotă se evaluează după conceptul comercial concret — împreună cu directorul tehnic și arhitectul. Restaurant, bucătărie sau producție — doar după verificarea tehnică.", "Требования к вытяжке оцениваются под конкретную коммерческую концепцию — вместе с техническим директором и архитектором. Ресторан, кухня или производство — только после технической проверки.", "Extraction requirements are assessed for the specific commercial concept — with the Technical Director and the Architect. A restaurant, kitchen or production only after a technical review."), evidence: "OWNER_CONFIRMED", source: TECH },
          { key: "water", title: T("Apă și canalizare", "Вода и канализация", "Water and drainage"), value: T("Conectate", "Подключены", "Connected"), evidence: "DOCUMENT_CONFIRMED", source: `${OWNER} §4 · ${NET}` },
          { key: "internet", title: T("Internet și curenți slabi", "Интернет и слаботочные сети", "Internet and low-voltage networks"), value: T("Traseele există", "Трассы предусмотрены", "Routes in place"), note: T("Furnizorul și configurația le alege chiriașul.", "Провайдера и конфигурацию арендатор определяет сам.", "The tenant chooses the provider and the configuration."), evidence: "OWNER_CONFIRMED", source: `${OWNER} §4, §18` },
        ],
      },
      {
        key: "logistics",
        title: T("Logistică", "Логистика", "Logistics"),
        items: [
          { key: "loading", title: T("Primirea mărfii", "Приём товара", "Goods delivery"), value: T("Dinspre bulevard și dinspre curte", "Со стороны бульвара и со стороны двора", "From the boulevard and from the courtyard"), evidence: "OWNER_CONFIRMED", source: TECH },
          { key: "ramp", title: T("Rampă", "Рампа", "Ramp"), value: T("Rampă de descărcare în curte", "Разгрузочная рампа во дворе", "A loading ramp in the courtyard"), evidence: "OWNER_CONFIRMED", source: `${TECH} · ${PLANS}` },
          { key: "buffer", title: T("Zona intermediară", "Промежуточная зона", "Intermediate area"), value: T("Zonă intermediară de descărcare", "Промежуточная зона разгрузки", "An intermediate loading area"), evidence: "OWNER_CONFIRMED", source: TECH },
          { key: "storage", title: T("Depozitarea mărfii", "Хранение товара", "Goods storage"), value: T("În zona comercială și în zona intermediară de descărcare", "В торговой зоне и в промежуточной зоне разгрузки", "In the trading zone and in the intermediate loading area"), evidence: "OWNER_CONFIRMED", source: TECH },
        ],
        note: T("Primirea și depozitarea mărfii sunt integrate în funcționarea spațiului comercial.", "Приём и хранение товара встроены в работу самого торгового помещения.", "Goods handling and storage are part of how the commercial space itself works."),
      },
      {
        key: "access",
        title: T("Acces", "Доступ", "Access"),
        items: [
          { key: "exits", title: T("Ieșiri", "Выходы", "Exits"), value: T("4 ieșiri", "4 выхода", "4 exits"), note: T("Dintre care 2 spre bulevard și 1 spre curte.", "В том числе 2 к бульвару и 1 во двор.", "Including 2 to the boulevard and 1 to the courtyard."), evidence: "OWNER_CONFIRMED", source: TECH },
          { key: "customer", title: T("Clienții", "Клиенты", "Customers"), value: T("Intrare directă dinspre bulevard", "Прямой вход с бульвара", "A direct entrance from the boulevard"), note: T("Din trotuar, prin terasă: scări și rampă.", "С тротуара через террасу: лестница и пандус.", "From the pavement through the terrace: steps and a ramp."), evidence: "OWNER_CONFIRMED", source: `${TECH} · ${OWNER} §4, §7 · ${PHOTO} · ${PLANS}` },
          { key: "parking", title: T("Parcare", "Парковка", "Parking"), value: T("15 locuri de parcare", "15 парковочных мест", "15 parking spaces"), evidence: "OWNER_CONFIRMED", source: TECH },
          { key: "fire", title: T("Securitate la incendiu", "Пожарная безопасность", "Fire safety"), value: T("Ieșiri în mai multe direcții", "Выходы в нескольких направлениях", "Exits in several directions"), note: T("Cerințele finale de securitate la incendiu se evaluează după conceptul chiriașului și cerințele tehnice aplicabile.", "Итоговые требования пожарной безопасности оцениваются под концепцию арендатора и применимые технические требования.", "Final fire-safety requirements are assessed against the tenant’s concept and the applicable technical requirements."), evidence: "OWNER_CONFIRMED", source: TECH },
          { key: "security", title: T("Pază", "Охрана", "Security"), value: T("Justar", "Justar", "Justar"), evidence: "OWNER_CONFIRMED", source: TECH_FINAL },
        ],
      },
      {
        key: "sanitary",
        title: T("Spații sanitare", "Санитарные помещения", "Sanitary rooms"),
        items: [
          { key: "toilets", title: T("Grupuri sanitare", "Санузлы", "Toilets"), value: T("3 grupuri sanitare", "3 санузла", "3 toilets"), evidence: "OWNER_CONFIRMED", source: TECH },
          { key: "cleaning", title: T("Inventar de curățenie", "Уборочный инвентарь", "Cleaning inventory"), value: T("Încăpere separată pentru inventarul de curățenie", "Отдельное помещение для уборочного инвентаря", "A separate cleaning-inventory room"), evidence: "OWNER_CONFIRMED", source: TECH },
        ],
      },
      {
        key: "fitout",
        title: T("Pregătire pentru amenajare", "Подготовка к отделке", "Ready for fit-out"),
        items: [
          { key: "lighting", title: T("Iluminat", "Освещение", "Lighting"), value: T("Puncte de racord pentru corpuri de iluminat", "Выводы под светильники", "Connection points for luminaires"), note: T("Pregătite pentru montarea corpurilor de iluminat după nivelul de iluminare cerut de viitorul concept comercial.", "Подготовлены для установки светильников с учётом требуемого уровня освещённости будущей коммерческой концепции.", "Prepared for fixture installation to the illumination level the future commercial concept requires."), evidence: "OWNER_CONFIRMED", source: TECH },
          { key: "signage", title: T("Firmă", "Вывеска", "Signage"), value: T("Firmă luminoasă sau panou luminos pe fațadă", "Световая вывеска или световая панель на фасаде", "An illuminated sign or light panel on the facade"), note: T("Posibilă după un proiect separat aprobat — împreună cu arhitectul și directorul tehnic.", "Возможна по отдельному согласованному проекту — вместе с архитектором и техническим директором.", "Possible under a separate approved design — with the Architect and the Technical Director."), evidence: "OWNER_CONFIRMED", source: TECH },
          { key: "support", title: T("Suport tehnic", "Техническая поддержка", "Technical support"), value: T("Directorul tehnic și arhitectul MEGAPARC", "Технический директор и архитектор MEGAPARC", "MEGAPARC’s Technical Director and Architect"), note: T("Evaluăm adaptarea înainte de angajamentele comerciale.", "Оцениваем адаптацию до коммерческих обязательств.", "We assess the adaptation before any commercial commitment."), evidence: "OWNER_CONFIRMED", source: `${OWNER} · R3 trust system` },
        ],
      },
    ],
    levelsTitle: T("Niveluri și înălțimi", "Уровни и высоты", "Levels and heights"),
    ready: {
      title: T("Ce există deja în obiect", "Что уже есть в объекте", "What is already in the building"),
      items: [
        T("alimentare electrică trifazată", "трёхфазное электроснабжение", "three-phase power"),
        T("încălzire", "отопление", "heating"),
        T("climatizare pe ambele niveluri", "кондиционирование на обоих уровнях", "air-conditioning on both levels"),
        T("sistem de ventilație", "вентиляционная система", "a ventilation system"),
        T("apă și canalizare", "вода и канализация", "water and drainage"),
        T("3 grupuri sanitare și inventar de curățenie", "3 санузла и уборочный инвентарь", "3 toilets and a cleaning-inventory room"),
        T("4 ieșiri", "4 выхода", "4 exits"),
        T("intrare cu scări și rampă", "вход с лестницей и пандусом", "an entrance with steps and a ramp"),
        T("primirea mărfii din ambele laturi", "приём товара с двух сторон", "goods delivery from both sides"),
        T("15 locuri de parcare", "15 парковочных мест", "15 parking spaces"),
        T("puncte de racord pentru iluminat", "выводы под светильники", "lighting connection points"),
        T("trasee pentru curenți slabi", "трассы для слаботочных сетей", "low-voltage routes"),
      ],
    },
    capex: T("Lucrările capitale de bază sunt deja realizate — investiția chiriașului va fi necesară în primul rând pentru adaptarea spațiului la propriul format.", "Базовые капитальные работы уже выполнены — инвестиции арендатора потребуются прежде всего для адаптации пространства под собственный формат.", "The core capital works are already complete — the tenant’s investment will be needed primarily to adapt the space to its own format."),
    check: {
      title: T("Ce verificăm pentru formatul dumneavoastră", "Что проверим под ваш формат", "What we check for your format"),
      lead: T("Directorul tehnic și arhitectul MEGAPARC verifică în ce măsură infrastructura existentă corespunde cerințelor afacerii dumneavoastră și ce adaptări vor fi necesare — înainte de angajamentele comerciale.", "Технический директор и архитектор MEGAPARC проверят, насколько существующая инфраструктура соответствует требованиям вашего бизнеса и какие адаптации потребуются, — до коммерческих обязательств.", "MEGAPARC’s Technical Director and Architect check how well the existing infrastructure meets the needs of your business and which adaptations will be required — before any commercial commitment."),
      items: [
        T("puterea electrică necesară", "необходимая электрическая мощность", "the electrical capacity you need"),
        T("ventilația, climatizarea și hota", "вентиляция, кондиционирование и вытяжка", "ventilation, air-conditioning and extraction"),
        T("amplasarea echipamentelor", "размещение оборудования", "where equipment goes"),
        T("configurația intrărilor", "конфигурация входов", "the entrance configuration"),
        T("traseele clienților și ale mărfii", "маршруты клиентов и товара", "customer and goods routes"),
        T("zonarea", "зонирование", "zoning"),
        T("firma luminoasă și fațada", "световая вывеска и фасад", "the illuminated sign and the facade"),
        T("internetul și curenții slabi", "интернет и слаботочная инфраструктура", "internet and low-voltage infrastructure"),
        T("cerințele pentru spațiile sanitare", "требования к санитарным помещениям", "sanitary-room requirements"),
        T("cerințele speciale ale activității concrete", "специальные требования конкретного вида деятельности", "the special requirements of your specific activity"),
      ],
    },
    principle: T("Mai întâi verificăm fezabilitatea tehnică — apoi discutăm condițiile comerciale.", "Сначала проверяем техническую реализуемость — затем обсуждаем коммерческие условия.", "First we check technical feasibility — then we discuss commercial terms."),
  },

  specs: [
    { key: "power", label: T("Alimentare electrică", "Электроснабжение", "Power"), value: T("3 faze · 38 kW conform documentelor", "3 фазы · 38 кВт по документам", "3 phases · 38 kW documented"), state: "ready", evidence: "DOCUMENT_CONFIRMED", source: `${OWNER} §4 · ${NET}` },
    { key: "ventilation", label: T("Ventilație și climatizare", "Вентиляция и кондиционирование", "Ventilation and air-conditioning"), value: T("Parter — sisteme split · demisol — climatizare pe canale · ventilație prevăzută", "1-й этаж — сплит-системы · цоколь — канальное кондиционирование · вентиляция предусмотрена", "Ground floor — split systems · lower ground — ducted air-conditioning · ventilation provided for"), state: "ready", evidence: "OWNER_CONFIRMED", source: TECH },
    { key: "extraction", label: T("Hotă", "Вытяжка", "Extraction"), value: T("Se evaluează după conceptul comercial concret", "Оценивается под конкретную коммерческую концепцию", "Assessed for the specific commercial concept"), state: "confirm", evidence: "OWNER_CONFIRMED", source: TECH },
  ],

  location: {
    lead: T("Intersecția bulevardului Moscova cu strada Matei Basarab, sectorul Rîșcani.", "Пересечение бульвара Москова и улицы Матей Басараб, сектор Рышкань.", "The intersection of Moscova Boulevard and Matei Basarab Street, Rîșcani district."),
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
    { key: "service", label: T("Intrarea de serviciu", "Служебный вход", "Service entrance"), value: T("Din curte: rampă de descărcare.", "Со стороны двора: разгрузочная рампа.", "From the courtyard: a loading ramp."), state: "ready", evidence: "OWNER_CONFIRMED", source: `${TECH} · ${PLANS}` },
    { key: "delivery", label: T("Primirea și depozitarea mărfii", "Приём и хранение товара", "Goods delivery and storage"), value: T("Primirea mărfii dinspre bulevard și dinspre curte; depozitarea — în zona comercială și în zona intermediară de descărcare.", "Приём товара со стороны бульвара и двора; хранение — в торговой зоне и в промежуточной зоне разгрузки.", "Goods arrive from the boulevard and from the courtyard; storage is in the trading zone and the intermediate loading area."), state: "ready", evidence: "OWNER_CONFIRMED", source: TECH },
    { key: "parking", label: T("Parcare", "Парковка", "Parking"), value: T("15 locuri de parcare.", "15 парковочных мест.", "15 parking spaces."), state: "ready", evidence: "OWNER_CONFIRMED", source: `${TECH} — not exclusive / reserved / free / 24-7 unless confirmed` },
    { key: "signage", label: T("Firmă", "Вывеска", "Signage"), value: T("Firmă luminoasă sau panou luminos — după un proiect separat aprobat.", "Световая вывеска или световая панель — по отдельному согласованному проекту.", "An illuminated sign or light panel — under a separate approved design."), state: "confirm", evidence: "OWNER_CONFIRMED", source: TECH },
    { key: "exits", label: T("Ieșiri", "Выходы", "Exits"), value: T("4 ieșiri, dintre care 2 spre bulevard și 1 spre curte.", "4 выхода, в том числе 2 к бульвару и 1 во двор.", "4 exits, including 2 to the boulevard and 1 to the courtyard."), state: "ready", evidence: "OWNER_CONFIRMED", source: `${TECH} — 4 exits total; 3 specifically described by OWNER — 4th exit role/location TO_CONFIRM` },
  ],

  engineering: {
    rows: [
      { key: "power", label: T("Alimentare electrică", "Электроснабжение", "Power"), value: T("3 faze · 38 kW conform documentelor", "3 фазы · 38 кВт по документам", "3 phases · 38 kW documented"), state: "ready", evidence: "DOCUMENT_CONFIRMED", source: `${OWNER} §4 · ${NET}` },
      { key: "reserve", label: T("Rezervă de putere", "Резерв мощности", "Power reserve"), value: T("Se clarifică pentru formatul dumneavoastră", "Уточняется под ваш формат", "Confirmed for your format"), state: "confirm", evidence: "TO_CONFIRM", source: `${OWNER} §19` },
      { key: "heating", label: T("Încălzire", "Отопление", "Heating"), value: T("Termoelectrica; calorifere pe ambele niveluri", "Termoelectrica; радиаторы на обоих уровнях", "Termoelectrica; radiators on both levels"), state: "ready", evidence: "OWNER_CONFIRMED", source: `${TECH_FINAL} · ${OWNER} §4 · ${PHOTO} · ${NET}` },
      { key: "ventilation", label: T("Ventilație și climatizare", "Вентиляция и кондиционирование", "Ventilation and air-conditioning"), value: T("Parter — sisteme split; demisol — climatizare pe canale; ventilație prevăzută", "1-й этаж — сплит-системы; цоколь — канальное кондиционирование; вентиляция предусмотрена", "Ground floor — split systems; lower ground — ducted air-conditioning; ventilation provided for"), state: "ready", evidence: "OWNER_CONFIRMED", source: TECH },
      { key: "extraction", label: T("Hotă", "Вытяжка", "Extraction"), value: T("Se evaluează după conceptul comercial concret", "Оценивается под конкретную коммерческую концепцию", "Assessed for the specific commercial concept"), state: "confirm", evidence: "OWNER_CONFIRMED", source: TECH },
      { key: "water", label: T("Apă și canalizare", "Водоснабжение и канализация", "Water and sewer"), value: T("Conectate: 3 grupuri sanitare", "Подключены: 3 санузла", "Connected: 3 toilets"), state: "ready", evidence: "OWNER_CONFIRMED", source: `${OWNER} §4 · ${NET} · ${TECH} · ${TECH_FINAL}` },
      { key: "cleaning", label: T("Inventar de curățenie", "Уборочный инвентарь", "Cleaning inventory"), value: T("Încăpere separată pentru inventarul de curățenie", "Отдельное помещение для уборочного инвентаря", "A separate cleaning-inventory room"), state: "ready", evidence: "OWNER_CONFIRMED", source: TECH },
      { key: "internet", label: T("Curenți slabi și internet", "Слаботочные сети и интернет", "Low-current and internet"), value: T("Traseele există; internetul îl conectează chiriașul", "Трассы есть; интернет арендатор подключает сам", "Routes in place; the tenant connects the internet"), state: "tenant", evidence: "OWNER_CONFIRMED", source: `${OWNER} §4, §18` },
      { key: "fire", label: T("Siguranță la incendiu", "Пожарная безопасность", "Fire safety"), value: T("Ieșiri în mai multe direcții: 2 spre bulevard, 1 spre curte", "Выходы в нескольких направлениях: 2 к бульвару, 1 во двор", "Exits in several directions: 2 to the boulevard, 1 to the courtyard"), state: "ready", evidence: "OWNER_CONFIRMED", source: TECH },
      { key: "security", label: T("Pază", "Охрана", "Security"), value: T("Justar", "Justar", "Justar"), state: "ready", evidence: "OWNER_CONFIRMED", source: TECH_FINAL },
      { key: "lighting", label: T("Iluminat", "Освещение", "Lighting"), value: T("Puncte de racord pregătite pentru nivelul de iluminare cerut de concept", "Выводы под светильники подготовлены под требуемый уровень освещённости концепции", "Connection points prepared for the illumination level the concept requires"), state: "ready", evidence: "OWNER_CONFIRMED", source: TECH },
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
    pending: T("Condițiile comerciale se transmit după o primă verificare a formatului afacerii.", "Коммерческие условия предоставляются после первичной проверки формата бизнеса.", "Commercial terms are provided after a first check of the business format."),
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
        tab: T("Parter", "1-й этаж", "Ground floor"),
        label: T("Parter", "1-й этаж", "Ground floor"),
        // level mark as on the drawing «Plan parter, cota +0.000» (OWNER plan replacement pass 2026-11-09)
        mark: "+0,000",
        drawing: { photo: "planGround", pdf: publicAsset(`${dir}/plans/moscova-20-plan-parter-0000.pdf`) },
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
        tab: T("Demisol", "Цоколь", "Lower ground"),
        label: T("Demisol", "Цоколь", "Lower ground"),
        // level marks as on the drawing «Plan cota −2.950, −3.300» (the auxiliary rooms sit at −3,300)
        mark: "−2,950 / −3,300",
        drawing: { photo: "planLower", pdf: publicAsset(`${dir}/plans/moscova-20-plan-demisol-2950-3300.pdf`) },
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
    // OWNER plan replacement pass 2026-11-09: the drawings themselves are shown — never «схема»
    note: T("Planurile — anexele nr. 1 și nr. 2 la contractul de locațiune, scara 1:100; suprafețele — conform borderourilor de pe planuri.", "Планы — приложения № 1 и № 2 к договору аренды, масштаб 1:100; площади — по экспликации на чертежах.", "The plans are annexes no. 1 and no. 2 to the lease agreement, scale 1:100; the areas follow the room schedules on the drawings."),
    source: PLANS,
    marks: { ground: "+0,000", lower: "−2,950 / −3,300", evidence: "DOCUMENT_CONFIRMED", source: PLANS },
  },

  // OWNER «MOSCOVA 20 — REWRITE THE BASIC WORKS / READINESS BLOCK» (2026-11-10): one idea — the premises already have the
  // base infrastructure; the tenant invests in its own format, not in starting the property from zero. PROPERTY BASE (what
  // the premises provide) and TENANT FIT-OUT (what depends on the concept) never mix; never turnkey, never «no further cost».
  capex: {
    kicker: T("Infrastructura de bază este pregătită", "Базовая инфраструктура уже готова", "The base infrastructure is in place"),
    title: T("Investiți în afacerea dumneavoastră,\nnu în pregătirea spațiului.", "Вкладывайте в свой бизнес,\nа не в подготовку помещения.", "Invest in your business,\nnot in preparing the premises."),
    lead: T("Sistemele inginerești principale și infrastructura de bază sunt deja prevăzute. Vă rămâne să adaptați spațiul la formatul afacerii, să instalați echipamentele și mobilierul și să amenajați interiorul.", "Основные инженерные системы и базовая инфраструктура уже предусмотрены. Вам остаётся адаптировать пространство под формат бизнеса, установить оборудование, мебель и оформить интерьер.", "The main building systems and the base infrastructure are already in place. What remains is to adapt the space to your business format, install equipment and furniture, and fit out the interior."),
    photo: "lowerHall",
    readyTitle: T("Deja prevăzut", "Уже предусмотрено", "Already provided"),
    ready: [
      fact(T("Suprafețe de finisaj de bază", "Базовые отделочные поверхности", "Base finished surfaces"), "OWNER_CONFIRMED", `${COMPACT} §1 · ${PHOTO}`),
      fact(T("Infrastructura inginerească", "Инженерная инфраструктура", "Engineering infrastructure"), "OWNER_CONFIRMED", `${COMPACT} §1 · ${OWNER} §4 · ${TECH}`),
      fact(T("Încălzire", "Отопление", "Heating"), "OWNER_CONFIRMED", `${OWNER} §4 · ${TECH_FINAL}`),
      fact(T("Ventilație și climatizare", "Вентиляция и кондиционирование", "Ventilation and air-conditioning"), "OWNER_CONFIRMED", TECH),
      fact(T("3 grupuri sanitare", "3 санузла", "3 toilets"), "OWNER_CONFIRMED", `${TECH} · ${TECH_FINAL}`),
      fact(T("Cameră pentru inventarul de curățenie", "Комната уборочного инвентаря", "A cleaning-inventory room"), "OWNER_CONFIRMED", `${TECH} · ${TECH_FINAL}`),
      fact(T("Scări și intrări", "Лестницы и входные группы", "Stairs and entrances"), "OWNER_CONFIRMED", `${COMPACT} §1 · ${PHOTO} · ${PLANS}`),
      fact(T("Puncte de racord pentru iluminat", "Точки подключения освещения", "Lighting connection points"), "OWNER_CONFIRMED", TECH),
      fact(T("Zonă de descărcare", "Зона загрузки", "A loading area"), "OWNER_CONFIRMED", TECH),
      fact(T("Rampă dinspre curte", "Рампа со стороны двора", "A courtyard-side ramp"), "OWNER_CONFIRMED", `${TECH} · ${PLANS}`),
    ],
    tenantTitle: T("Se adaptează formatului dumneavoastră", "Адаптируется под ваш формат", "Adapted to your format"),
    // concept-dependent items — never a statement of who pays for or performs the fit-out
    tenant: [
      fact(T("Planificarea și zonarea", "Планировка и зонирование", "Layout and zoning"), "OWNER_CONFIRMED", READINESS),
      fact(T("Echipamente comerciale sau de servicii", "Торговое или сервисное оборудование", "Retail or service equipment"), "OWNER_CONFIRMED", READINESS),
      fact(T("Mobilier și interior", "Мебель и интерьер", "Furniture and interior"), "OWNER_CONFIRMED", READINESS),
      fact(T("Iluminat și corpuri de iluminat", "Освещение и светильники", "Lighting and fixtures"), "OWNER_CONFIRMED", READINESS),
      fact(T("Hotă pentru conceptul concret", "Вытяжка под конкретную концепцию", "Extraction for the specific concept"), "OWNER_CONFIRMED", READINESS),
      fact(T("Amplasarea echipamentelor", "Размещение оборудования", "Equipment placement"), "OWNER_CONFIRMED", READINESS),
      fact(T("Firmă și panou luminos după un proiect de design separat", "Вывеска и световое панно по отдельному дизайн-проекту", "Signage and a light panel under a separate design project"), "OWNER_CONFIRMED", READINESS),
    ],
    principle: {
      text: T("Mai întâi verificăm fezabilitatea tehnică a conceptului dumneavoastră — apoi discutăm condițiile comerciale.", "Сначала проверяем техническую реализуемость вашей концепции — затем обсуждаем коммерческие условия.", "First we check the technical feasibility of your concept — then we discuss commercial terms."),
      by: T("Directorul tehnic și arhitectul MEGAPARC vă evaluează conceptul înainte de semnarea contractului.", "Технический директор и архитектор MEGAPARC оценивают вашу концепцию до подписания договора.", "MEGAPARC’s Technical Director and Architect review your concept before the lease is signed."),
    },
  },

  story: {
    kicker: T("Fotografii", "Фотографии", "Photographs"),
    title: T("Spațiul așa cum este astăzi.", "Пространство таким, какое оно есть сегодня.", "The space as it is today."),
    // OWNER «PHOTO SECTION» copy fix (2026-11-10): authenticity of the premises as the base for the tenant concept — no word on processing
    lead: T("Spațiu real. Stare reală. Baza pentru conceptul dumneavoastră.", "Реальное пространство. Реальное состояние. Основа для вашей концепции.", "Real space. Real condition. The base for your concept."),
    // OWNER art direction 2026-11-09 §11 + card & air pass §15: the four best first — ADDRESS · LIGHT · SPACE · CONNECTION — then ARRIVAL · READY BASE in «Смотреть все фотографии» (crops only)
    frames: [
      // R3.2 §17 (OWNER 2026-11-10): the elevated frontage frame belongs to the rejected aerial set (roof plane cut, the
      // facade running off the frame, neighbour lettering) — never a large tile; the address is shown at street level
      { key: "address", no: "01", shot: { photo: "entranceProcessed", position: "24% 60%" }, label: T("Adresa", "Адрес", "Address"), caption: T("Prima linie a bulevardului Moscova: intrarea din trotuar — scări, rampă, ușă de sticlă.", "Первая линия бульвара Москова: вход с тротуара — лестница, пандус, стеклянная дверь.", "The first line of Moscova Boulevard: the entrance from the pavement — steps, a ramp, a glass door.") },
      { key: "light", no: "02", shot: { photo: "groundGlazing", position: "40% 45%" }, label: T("Lumina", "Свет", "Light"), caption: T("Vitrina continuă spre bulevard: sala se vede de pe trotuar.", "Сплошное остекление к бульвару: зал виден с тротуара.", "Continuous glazing to the boulevard: the hall is visible from the pavement.") },
      { key: "space", no: "03", shot: { photo: "groundHall", position: "50% 52%" }, label: T("Spațiul", "Пространство", "Space"), caption: T("Săli deschise cu stâlpi pe o rețea regulată.", "Открытые залы с колоннами по регулярной сетке.", "Open halls with columns on a regular grid.") },
      { key: "connection", no: "04", shot: { photo: "stairs", position: "64% 55%" }, label: T("Legătura", "Связь уровней", "Connection"), caption: T("Scara interioară leagă parterul de demisol.", "Внутренняя лестница соединяет 1-й этаж и цоколь.", "The internal staircase joins the ground floor and the lower ground.") },
      { key: "lower", no: "05", shot: { photo: "lowerHall", position: "50% 55%" }, label: T("Demisolul", "Цоколь", "Lower ground"), caption: T("Demisolul: o sală lungă cu pardoseală finisată și climatizare.", "Цоколь: длинный зал с готовым полом и кондиционированием.", "The lower ground: a long hall with a finished floor and air-conditioning.") },
      { key: "base", no: "06", shot: { photo: "engineering", position: "52% 36%", zoom: 1.3 }, label: T("Inginerie", "Инженерия", "Engineering"), caption: T("Trasee de ventilație, încălzire, ieșiri marcate — deja pe loc.", "Воздуховоды, отопление, указатели выходов — уже на месте.", "Ducts, heating, marked exits — already in place.") },
    ],
  },

  lens: {
    kicker: T("Formatul dumneavoastră", "Ваш формат", "Your format"),
    title: T("Ce afacere luați în considerare?", "Какой бизнес вы рассматриваете?", "Which business are you considering?"),
    lead: T("Același spațiu poate fi privit diferit — în funcție de formatul dumneavoastră, de traseul clienților și de cerințele operaționale. Alegeți varianta ca să vedeți la ce merită să fiți atenți tocmai în cazul dumneavoastră.", "Одно и то же помещение можно рассматривать по-разному — в зависимости от вашего формата, клиентского сценария и операционных требований. Выберите вариант, чтобы увидеть, на что стоит обратить внимание именно в вашем случае.", "The same space can be read in different ways — depending on your format, your client journey and your operating requirements. Choose an option to see what deserves attention in your case."),
    evidenceTitle: T("De ce se poate potrivi formatul", "Почему формат может подойти", "Why the format may fit"),
    checksTitle: T("Ce este important de verificat înainte de decizie", "Что важно проверить до принятия решения", "What to check before you decide"),
    scenarioNote: T("Scenariu posibil de organizare", "Возможный сценарий организации", "A possible way to organise it"),
    honesty: T("Dacă obiectul se potrivește ca locație și format, următorul pas este verificarea fezabilității tehnice a scenariului dumneavoastră.", "Если объект подходит по локации и формату, следующим шагом проверим техническую реализуемость вашего сценария.", "If the property suits you in location and format, the next step is to check the technical feasibility of your scenario."),
    regulated: T("Pentru formatele reglementate — clinici, servicii medicale, alimentație publică și alte activități — se verifică suplimentar cerințele tehnice speciale și cele de autorizare.", "Для регулируемых форматов — клиники, медицинских услуг, общепита и других видов деятельности — дополнительно проверяются специальные технические и разрешительные требования.", "For regulated formats — clinics, medical services, food service and other activities — special technical and permit requirements are checked as well."),
    formats: [
      {
        key: "retail",
        label: T("Retail", "Ритейл", "Retail"),
        question: T("Mă vor observa?", "Увидят ли меня?", "Will they notice me?"),
        evidence: [
          { title: T("Vitrina se vede din stradă", "Витрина просматривается с улицы", "The shop window is seen from the street"), text: T("Vitrina continuă face punctul de vânzare vizibil dinspre bulevard.", "Сплошное остекление помогает сделать торговую точку заметной со стороны бульвара.", "Continuous glazing makes the shop visible from the boulevard."), ref: "photos", evidence: "OWNER_CONFIRMED", source: PHOTO },
          { title: T("Intrarea este clară pentru client", "Вход понятен клиенту", "The entrance is clear to customers"), text: T("Traseul de pe trotuar până în spațiu se citește ușor, fără un parcurs complicat prin clădire.", "Маршрут от тротуара к помещению считывается без сложного прохода через здание.", "The route from the pavement into the space reads at a glance, with no complicated path through the building."), ref: "tech", evidence: "OWNER_CONFIRMED", source: `${OWNER} §4 · ${PHOTO}` },
          { title: T("Cartier rezidențial format", "Сформированный жилой район", "An established residential district"), text: T("Împrejurimile creează un public local constant pentru cumpărături și servicii zilnice.", "Окружение создаёт постоянную локальную аудиторию для повседневных покупок и сервисов.", "The surroundings create a steady local audience for everyday shopping and services."), ref: "location", evidence: "OWNER_CONFIRMED", source: `${OWNER} §12` },
          { title: T("Transport public în apropiere", "Общественный транспорт рядом", "Public transport close by"), text: T("Stațiile și rutele simplifică accesul pentru cumpărători și personal.", "Остановки и маршруты упрощают доступ покупателям и персоналу.", "Stops and routes make access easy for shoppers and staff."), ref: "location", evidence: "OWNER_CONFIRMED", source: `${OWNER} §12 · 8 routes at stops within 350 m — current OSM research` },
        ],
        checks: [
          T("formatul și dimensiunile firmei", "формат и размеры вывески", "the signage format and size"),
          T("vizibilitatea vitrinei și a intrării", "заметность витрины и входа", "how visible the window and entrance are"),
          T("traseul clientului de pe trotuar", "маршрут клиента с тротуара", "the customer's route from the pavement"),
          T("accesul transportului de marfă", "подъезд грузового транспорта", "delivery vehicle access"),
          T("orele de descărcare", "часы разгрузки", "unloading hours"),
          T("programul de lucru", "режим работы", "opening hours"),
          T("conformitatea spațiului cu cerințele formatului", "соответствие помещения требованиям формата", "how the space meets the format's requirements"),
        ],
        closing: T("Dacă locația și formatul se potrivesc, următorul pas este verificarea tehnică și comercială a scenariului de funcționare.", "Если локация и формат совпадают, следующим шагом становится техническая и коммерческая проверка сценария работы.", "If the location and the format match, the next step is a technical and commercial check of how the business will run."),
        overlay: {
          photo: "groundGlazing",
          evidence: "DEMO",
          source: SCENARIO,
          zones: [
            { label: T("Vitrina", "Витрина", "Shop window"), shape: [[262, 168], [838, 330], [838, 712], [262, 800]], at: [520, 470] },
            { label: T("Sala principală", "Основной зал", "Main hall"), shape: [[0, 905], [600, 868], [1000, 790], [1600, 812], [1600, 1066], [0, 1066]], at: [1040, 940] },
            { label: T("Zona de serviciu · demisol", "Подсобная зона · цоколь", "Back of house · lower ground"), shape: [[338, 808], [770, 772], [850, 792], [604, 862]], at: [600, 822] },
          ],
        },
      },
      {
        key: "showroom",
        label: T("Showroom", "Шоурум", "Showroom"),
        question: T("Se poate prezenta bine produsul aici?", "Можно ли здесь хорошо показать продукт?", "Can the product be shown well here?"),
        evidence: [
          { title: T("Spațiul se citește deschis", "Пространство читается открыто", "The space reads as open"), text: T("Planul deschis permite o prezentare clară a produsului.", "Открытая планировка позволяет выстроить понятную презентацию продукта.", "The open layout allows a clear presentation of the product."), ref: "photos", evidence: "OWNER_CONFIRMED", source: PHOTO },
          { title: T("Există potențial de zonare", "Есть потенциал для зонирования", "There is room for zoning"), text: T("Expoziția, consultanța și partea auxiliară se pot separa.", "Можно разделить экспозицию, консультационную и вспомогательную части.", "Display, consultation and support areas can be kept apart."), ref: "plans", evidence: "DOCUMENT_CONFIRMED", source: PLANS },
          { title: T("Traseu comod pentru client", "Удобный клиентский маршрут", "A comfortable client route"), text: T("Intrarea și logica interioară permit un scenariu de vizită coerent.", "Вход и внутренняя логика помещения позволяют организовать последовательный сценарий визита.", "The entrance and the inner logic of the space allow a coherent visit sequence."), ref: "tech", evidence: "OWNER_CONFIRMED", source: `${OWNER} §4 · ${PLANS}` },
          { title: T("Locația se potrivește vizitelor țintite", "Локация подходит для целевых визитов", "The location suits planned visits"), text: T("Spațiul poate primi atât vizite programate, cât și fluxul natural de clienți.", "Объект можно использовать и для посещений по записи, и для естественного клиентского потока.", "The property can serve both appointments and the natural flow of customers."), ref: "location", evidence: "OWNER_CONFIRMED", source: `${OWNER} §12` },
        ],
        checks: [
          T("traseul clientului", "клиентский маршрут", "the client route"),
          T("calitatea luminii naturale", "качество естественного света", "the quality of daylight"),
          T("posibilitatea de a organiza expoziția", "возможность организации экспозиции", "how the display can be organised"),
          T("zonarea spațiului", "зонирование помещения", "the zoning of the space"),
          T("locul pentru zona de discuții / consultanță", "место для переговорной / консультационной зоны", "room for a meeting / consultation area"),
          T("comoditatea accesului auto", "удобство подъезда", "how easy it is to drive up"),
          T("cerințele tehnice ale formatului", "технические требования формата", "the format's technical requirements"),
        ],
        closing: T("Pentru un showroom contează nu doar spațiul, ci și felul în care clientul intră, se mișcă prin el și percepe produsul.", "Для шоурума важно не только само помещение, но и то, как клиент входит, двигается по нему и воспринимает продукт.", "For a showroom, what matters is not only the space but how the client enters, moves through it and experiences the product."),
        overlay: {
          photo: "lowerHall",
          evidence: "DEMO",
          source: SCENARIO,
          zones: [
            { label: T("Expoziție", "Экспозиция", "Display"), shape: [[300, 1010], [1340, 1010], [1120, 712], [530, 712]], at: [830, 880] },
            { label: T("Zona clienților", "Клиентская зона", "Client area"), shape: [[540, 700], [1110, 700], [1035, 620], [640, 620]], at: [835, 655] },
            { label: T("Zona de serviciu", "Подсобная зона", "Back of house"), shape: [[655, 606], [1020, 606], [985, 568], [705, 568]], at: [840, 585] },
          ],
        },
      },
      {
        key: "service",
        label: T("Servicii pentru clienți", "Клиентский сервис", "Client service"),
        question: T("Le este comod clienților să ajungă aici?", "Удобно ли клиентам добираться сюда?", "Is it easy for clients to get here?"),
        evidence: [
          { title: T("Transport public în apropiere", "Общественный транспорт рядом", "Public transport close by"), text: T("Stațiile și rutele se află în imediata apropiere a obiectului.", "Остановки и маршруты находятся в непосредственной близости от объекта.", "Stops and routes are right next to the property."), ref: "location", evidence: "OWNER_CONFIRMED", source: `${OWNER} §12 · 8 routes at stops within 350 m — current OSM research (OWNER micro-fix 2026-11-09)` },
          { title: T("Cartier rezidențial format", "Сформированный жилой район", "An established residential district"), text: T("Un public local constant susține serviciile de cerere zilnică.", "Постоянная локальная аудитория поддерживает сервисные форматы повседневного спроса.", "A steady local audience supports everyday service formats."), ref: "location", evidence: "OWNER_CONFIRMED", source: `${OWNER} §12` },
          { title: T("O intrare clară", "Понятный вход", "A clear entrance"), text: T("Traseul din stradă până în spațiu poate fi simplu și evident pentru client.", "Маршрут от улицы до помещения можно сделать простым и очевидным для клиента.", "The route from the street into the space can be simple and obvious for clients."), ref: "tech", evidence: "OWNER_CONFIRMED", source: `${OWNER} §4 · ${PHOTO}` },
          { title: T("Partea clienților și cea de serviciu se pot separa", "Можно разделить клиентскую и служебную части", "Client and service areas can be separated"), text: T("Primul nivel se potrivește pentru primirea vizitatorilor, cel inferior — pentru funcțiile auxiliare.", "Первый уровень подходит для приёма посетителей, нижний — для вспомогательных функций.", "The first level suits visitor reception, the lower one the support functions."), ref: "plans", evidence: "DOCUMENT_CONFIRMED", source: PLANS },
        ],
        checks: [
          T("accesul cu automobilul și cu transportul public", "доступность на автомобиле и общественном транспорте", "access by car and by public transport"),
          T("comoditatea intrării și a traseului clientului", "удобство входа и клиентского маршрута", "the entrance and the client route"),
          T("posibilitatea de a amplasa firma și semnalizarea", "возможность размещения вывески и навигации", "room for signage and wayfinding"),
          T("programul de lucru și accesul", "режим работы и доступ", "opening hours and access"),
          T("internetul și infrastructura de curenți slabi", "интернет и слаботочная инфраструктура", "internet and low-current infrastructure"),
          T("conformitatea cu cerințele activității concrete", "соответствие требованиям конкретного вида деятельности", "how the space meets the requirements of your specific activity"),
        ],
        closing: T("Dacă obiectul corespunde modelului dumneavoastră, următorul pas este verificarea fezabilității tehnice a scenariului înainte de semnarea contractului.", "Если объект соответствует вашей модели, следующим шагом нужно проверить техническую реализуемость сценария до подписания договора.", "If the property fits your model, the next step is to check the technical feasibility of your scenario before signing."),
        overlay: {
          photo: "lowerStairs",
          evidence: "DEMO",
          source: SCENARIO,
          zones: [
            { label: T("Recepție", "Ресепшн", "Reception"), shape: [[860, 650], [1150, 650], [1205, 805], [880, 822]], at: [1020, 735] },
            { label: T("Zona clienților", "Клиентская зона", "Client area"), shape: [[0, 808], [830, 790], [985, 1066], [0, 1066]], at: [420, 925] },
            { label: T("Zona de serviciu", "Служебная зона", "Service area"), shape: [[330, 566], [646, 562], [664, 604], [318, 610]], at: [490, 586] },
          ],
        },
      },
      {
        key: "office",
        label: T("Birou · centru pentru clienți", "Офис · клиентский центр", "Office · customer centre"),
        // set by hand: the automatic typesetting glued «и для команды,» into one unbreakable run that broke mid-word in the narrow question column
        question: { ro: "Se potrivește spațiul și pentru echipă, și pentru clienți?", ru: "Подходит ли пространство и для команды, и для клиентов?", en: "Does the space work for the team and for clients alike?" },
        evidence: [
          { title: T("Spațiul se poate împărți pe funcții", "Пространство можно разделить по функциям", "The space can be divided by function"), text: T("Există potențial pentru zone de lucru, pentru clienți și auxiliare.", "Есть потенциал для организации рабочих, клиентских и вспомогательных зон.", "There is room to organise work, client and support areas."), ref: "plans", evidence: "DOCUMENT_CONFIRMED", source: PLANS },
          { title: T("Partea pentru clienți poate funcționa separat", "Клиентская часть может работать отдельно", "The client area can work on its own"), text: T("Primirea vizitatorilor se poate separa de munca internă a echipei.", "Это позволяет отделить приём посетителей от внутренней работы команды.", "Visitor reception can be kept apart from the team's internal work."), ref: "plans", evidence: "DOCUMENT_CONFIRMED", source: PLANS },
          { title: T("Potrivit pentru formatul de consultanță", "Подходит для консультационного формата", "Suited to a consultation format"), text: T("Spațiul poate găzdui întâlniri, consultații și munca zilnică a angajaților.", "Помещение можно использовать для встреч, консультаций и постоянной работы сотрудников.", "The space can host meetings, consultations and the daily work of staff."), ref: "tech", evidence: "OWNER_CONFIRMED", source: `${OWNER} §4 · ${PLANS}` },
          { title: T("Lucrările capitale de bază sunt deja realizate", "Базовые капитальные работы уже выполнены", "The core capital works are already complete"), text: T("Investiția chiriașului va fi necesară în primul rând pentru adaptarea spațiului la propriul format.", "Инвестиции арендатора потребуются прежде всего для адаптации пространства под собственный формат.", "The tenant's investment will be needed primarily to adapt the space to its own format."), ref: "capex", evidence: "OWNER_CONFIRMED", source: "OWNER copy correction 2026-11-10 (capex / tenant investment)" },
        ],
        checks: [
          T("separarea zonei pentru clienți de zona de lucru", "разделение клиентской и рабочей зон", "separating the client and work areas"),
          T("numărul și formatul locurilor de muncă", "количество и формат рабочих мест", "the number and type of workplaces"),
          T("zona de discuții / consultanță", "переговорная / консультационная зона", "a meeting / consultation area"),
          T("internetul și infrastructura de curenți slabi", "интернет и слаботочная инфраструктура", "internet and low-current infrastructure"),
          T("regimul de acces pentru angajați și clienți", "режим доступа сотрудников и клиентов", "access rules for staff and clients"),
          T("cerințele inginerești ale scenariului de birou", "инженерные требования офисного сценария", "the engineering requirements of an office scenario"),
        ],
        closing: T("Înainte de lansarea biroului verificăm planul, cerințele inginerești și traseele angajaților și ale clienților.", "Перед запуском офиса проверяем планировку, инженерные требования и сценарий движения сотрудников и клиентов.", "Before the office opens, we check the layout, the engineering requirements and how staff and clients will move through the space."),
        overlay: {
          photo: "lowerService",
          evidence: "DEMO",
          source: SCENARIO,
          zones: [
            { label: T("Zona clienților", "Клиентская зона", "Client area"), shape: [[620, 562], [1000, 552], [1078, 650], [612, 662]], at: [840, 606] },
            { label: T("Zona de lucru", "Рабочая зона", "Work area"), shape: [[0, 700], [1380, 690], [1450, 1066], [0, 1066]], at: [640, 880] },
            { label: T("Zona de serviciu", "Служебная зона", "Service area"), shape: [[1040, 540], [1342, 506], [1372, 622], [1082, 600]], at: [1210, 566] },
          ],
        },
      },
    ],
  },

  viewing: {
    kicker: T("Vizionare", "Просмотр", "Viewing"),
    // OWNER art direction 2026-11-09 §21: the statement, then «Посмотрите пространство лично.» on its own line, then the supporting line
    // card & air pass 2026-11-09 §17: «Посмотрите Moscova 20 лично.»
    title: T("Nu decideți după fotografii.\nVedeți Moscova 20 personal.", "Не решайте по фотографиям.\nПосмотрите Moscova 20 лично.", "Don't decide from photographs.\nSee Moscova 20 in person."),
    lead: T("Clarificăm din timp formatul afacerii dumneavoastră și pregătim pentru vizionare datele care contează tocmai pentru decizia dumneavoastră.", "Мы заранее уточним формат вашего бизнеса и подготовим к просмотру данные, которые имеют значение именно для вашего решения.", "We clarify your business format beforehand and prepare for the viewing the data that matters for your decision specifically."),
    steps: [
      { title: T("Înainte", "До просмотра", "Before"), text: T("formatul, cerințele tehnice, suprafața, termenul deschiderii", "формат, технические требования, площадь, срок открытия", "format, technical requirements, area, opening date") },
      { title: T("La vizionare", "На просмотре", "At the viewing"), text: T("spațiul, intrările, punctele inginerești, planurile, accesul", "пространство, входы, инженерные точки, планы, доступ", "the space, entrances, engineering points, plans, access") },
      { title: T("După", "После", "After"), text: T("cerințele tehnice verificate, apoi condițiile comerciale", "проверенные технические требования, затем коммерческие условия", "the technical requirements checked, then the commercial terms") },
    ],
    // OWNER R3.1 §5: the approach crop belongs to the rejected facade shot — the ground-level entrance photograph instead
    photo: "entrance",
    contactsLine: T("Sau direct:", "Или напрямую:", "Or directly:"),
    // the film «Ваш следующий шаг» plugs in here when it exists — poster first, plays on request, never autoplay
    film: null,
  },
};
