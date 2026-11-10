import type { Localized } from "@/lib/site-data";

/**
 * PHOTO DIRECTION — how every MEGAPARC property must be photographed
 * (OWNER decision, kept by the correction of 2026-10-08: "The OWNER wants the
 * concept website to show exactly HOW EACH PROPERTY SHOULD BE SHOT").
 *
 * Sixteen shots per property. Each shot: purpose · camera position ·
 * composition · time of day · light · people · what must be visible · what
 * must be avoided · desktop crop · mobile crop.
 *
 *  - The project pages show this as a storyboard while the build carries demo
 *    content (preview only): real photographs where they exist, a framed shot
 *    card where the photograph is still to be made.
 *  - scripts/photo-shotlist.mjs writes the photographer brief
 *    docs/PROPERTY_PHOTO_SHOT_LIST.md from this file (English, with the
 *    property-specific "must show" lines).
 *
 * No runtime imports (loaded by Node for the generator).
 */

export type ShotKey = "hero" | "facade34" | "frontal" | "context" | "access" | "parking" | "entrance" | "human" | "tenant" | "interior" | "detail" | "drone" | "evening" | "mobile" | "unit" | "plan";
export type People = "yes" | "no" | "optional";

export type Shot = {
  key: ShotKey;
  no: string;
  name: string;
  label: Localized;
  purpose: Localized;
  camera: string;
  composition: Localized;
  time: Localized;
  light: Localized;
  people: People;
  peopleNote: Localized;
  avoid: Localized;
  desktop: string;
  mobile: string;
  /** Frame proportion of the storyboard card (width / height). */
  ratio: number;
};

const L = (ro: string, ru: string, en: string): Localized => ({ ro, ru, en });

export const shots: Shot[] = [
  { key: "hero", no: "01", name: "HERO", label: L("Cadru principal", "Главный кадр", "Hero"), purpose: L("Primul cadru al paginii proiectului și al colecției.", "Первый кадр страницы проекта и коллекции.", "The opening frame of the project page and the collection."), camera: "24–35 mm · eye level 1.6–2 m, or 6–10 m from a facing building", composition: L("Clădirea întreagă cu strada; clădirea pe treimea dreaptă; cer vizibil.", "Здание целиком вместе с улицей; здание на правой трети; видно небо.", "The whole building with its street; building on the right third; sky visible."), time: L("Dimineața 8–10 sau după-amiaza 16–18", "Утро 8–10 или вторая половина дня 16–18", "Morning 8–10 h or late afternoon 16–18 h"), light: L("Soare jos pe fațada principală; cer acoperit luminos ca rezervă", "Низкое солнце по главному фасаду; светлая облачность как запасной вариант", "Low sun raking the main facade; bright overcast as fallback"), people: "yes", peopleNote: L("Mici, în mers, nu pozează", "Небольшие фигуры, в движении, не позируют", "Small, walking, not posing"), avoid: L("Mașini parcate în prim-plan, sigle fără acord", "Припаркованные машины на переднем плане, логотипы без согласия", "Parked cars in the foreground, logos without consent"), desktop: "16:9 and 21:9", mobile: "9:16 with the entrance in frame", ratio: 16 / 9 },
  { key: "facade34", no: "02", name: "FACADE 3/4", label: L("Fațadă 3/4", "Фасад 3/4", "Facade 3/4"), purpose: L("Volumul și materialele — cadrul de arhitectură.", "Объём и материалы — архитектурный кадр.", "Volume and materials — the architecture shot."), camera: "24–35 mm shift lens, verticals corrected · 1.6 m", composition: L("Colțul clădirii la 30–45° față de aparat.", "Угол здания под 30–45° к камере.", "The building's corner at 30–45° to the camera."), time: L("Când soarele bate la 30–45° pe fațadă", "Когда солнце под 30–45° к фасаду", "When the sun is at 30–45° to the facade"), light: L("Soare direct, umbre moi", "Прямое солнце, мягкие тени", "Direct sun, soft shadows"), people: "optional", peopleNote: L("O siluetă pentru scară", "Одна фигура для масштаба", "One figure for scale"), avoid: L("Distorsiune de unghi larg", "Искажения широкоугольника", "Wide-angle distortion"), desktop: "3:2", mobile: "4:5", ratio: 3 / 2 },
  { key: "frontal", no: "03", name: "FRONTAL FACADE", label: L("Fațadă frontală", "Фронтальный фасад", "Frontal facade"), purpose: L("Înregistrare curată, ortogonală, a fațadei.", "Чистая ортогональная фиксация фасада.", "A clean orthogonal record of the street facade."), camera: "35–50 mm, centred, verticals corrected · half the facade height (pole or lift)", composition: L("Simetric, fațada umple cadrul.", "Симметрично, фасад заполняет кадр.", "Symmetric, the facade fills the frame."), time: L("Cer acoperit luminos", "Светлая облачность", "Bright overcast"), light: L("Lumină uniformă, fără umbre dure", "Ровный свет, без жёстких теней", "Even daylight, no hard shadows"), people: "no", peopleNote: L("Fără oameni", "Без людей", "No people"), avoid: L("Perspective înclinate", "Заваленные вертикали", "Converging verticals"), desktop: "21:9", mobile: "4:5 (centre)", ratio: 21 / 9 },
  { key: "context", no: "04", name: "URBAN CONTEXT", label: L("Context urban", "Городской контекст", "Urban context"), purpose: L("Explică locul: străzi, vecini, flux.", "Объясняет место: улицы, соседи, поток.", "Explains the location: streets, neighbours, flow."), camera: "35–50 mm from across the street or a raised point · 4–10 m", composition: L("Clădirea în strada ei; vecinii și traficul se citesc.", "Здание в своей улице; соседи и трафик читаются.", "The building in its street; neighbours and traffic readable."), time: L("Dimineața într-o zi lucrătoare (flux real)", "Утро буднего дня (реальный поток)", "Weekday morning (real flow)"), light: L("Zi, cer vizibil", "День, видно небо", "Daylight, sky visible"), people: "yes", peopleNote: L("Trafic natural", "Естественный трафик", "Natural traffic"), avoid: L("Stradă goală", "Пустая улица", "An empty street"), desktop: "21:9", mobile: "4:5", ratio: 21 / 9 },
  { key: "access", no: "05", name: "ACCESS", label: L("Acces", "Подъезд", "Access"), purpose: L("Cum se ajunge: drumuri, viraje, transport public.", "Как добраться: дороги, повороты, транспорт.", "How you arrive: roads, turns, public transport."), camera: "24–35 mm · 1.6 m or 3–6 m", composition: L("Drumul de acces duce privirea spre clădire.", "Подъездная дорога ведёт взгляд к зданию.", "The approach road leads the eye to the building."), time: L("Zi lucrătoare", "Будний день", "Weekday"), light: L("Zi", "День", "Daylight"), people: "optional", peopleNote: L("Opțional", "По желанию", "Optional"), avoid: L("Indicatoare de trafic care acoperă clădirea", "Дорожные знаки, закрывающие здание", "Road signs covering the building"), desktop: "3:2", mobile: "4:5", ratio: 3 / 2 },
  { key: "parking", no: "06", name: "PARKING", label: L("Parcare", "Парковка", "Parking"), purpose: L("Răspunde chiriașului: clienții și echipa au unde parca?", "Ответ арендатору: где парковаться клиентам и команде?", "Answers the tenant: can customers and staff park?"), camera: "24–35 mm · 3–6 m", composition: L("Locurile, intrarea, distanța până la ușă.", "Места, въезд, расстояние до входа.", "The spaces, the entry, the distance to the door."), time: L("Zi lucrătoare, program de lucru", "Будний день, рабочее время", "Weekday, business hours"), light: L("Zi", "День", "Daylight"), people: "optional", peopleNote: L("Opțional", "По желанию", "Optional"), avoid: L("Numere de înmatriculare lizibile", "Читаемые номера машин", "Readable number plates"), desktop: "3:2", mobile: "4:5", ratio: 3 / 2 },
  { key: "entrance", no: "07", name: "ENTRANCE", label: L("Intrare", "Вход", "Entrance"), purpose: L("Sosirea și zona pentru firmă.", "Прибытие и зона вывески.", "Arrival and the signage zone."), camera: "28–35 mm · 1.6 m, portrait", composition: L("Ușa și banda pentru firmă.", "Дверь и полоса под вывеску.", "The door and the signage band."), time: L("Dimineața", "Утро", "Morning"), light: L("Zi, luminile de la intrare aprinse", "День, свет у входа включён", "Daylight, entrance lights on"), people: "yes", peopleNote: L("O persoană care intră", "Один человек входит", "One person entering"), avoid: L("Afișe temporare, uși deschise cu dezordine", "Временные объявления, беспорядок у двери", "Temporary notices, clutter at the door"), desktop: "4:5", mobile: "4:5", ratio: 4 / 5 },
  { key: "human", no: "08", name: "HUMAN SCALE", label: L("Scara umană", "Человеческий масштаб", "Human scale"), purpose: L("Clădirea cu oameni la dimensiunea lor reală.", "Здание и люди в реальном масштабе.", "The building with people at their real size."), camera: "50–85 mm · 1.4–1.6 m", composition: L("Oameni în planul mijlociu, clădirea în spate.", "Люди на среднем плане, здание за ними.", "People in the middle ground, the building behind."), time: L("Dimineața sau la prânz", "Утро или обед", "Morning or lunchtime"), light: L("Zi", "День", "Daylight"), people: "yes", peopleNote: L("Utilizatori reali, natural; acord scris", "Реальные люди, естественно; письменное согласие", "Real users, natural; written consent"), avoid: L("Pozare, aspect de stoc", "Позирование, «стоковый» вид", "Posing, a stock look"), desktop: "3:2", mobile: "4:5", ratio: 3 / 2 },
  { key: "tenant", no: "09", name: "TENANT ACTIVITY", label: L("Activitatea chiriașilor", "Жизнь арендаторов", "Tenant activity"), purpose: L("Obiectul care lucrează ca o afacere.", "Объект, работающий как бизнес.", "The property working as a business."), camera: "35–50 mm · 1.6 m", composition: L("Activitate reală; sigle nelizibile fără acord.", "Реальная работа; логотипы не читаются без согласия.", "Real activity; logos unreadable unless permitted."), time: L("În programul de lucru", "В часы работы", "Opening hours"), light: L("Zi și lumină interioară", "Дневной и внутренний свет", "Mixed daylight and interior"), people: "yes", peopleNote: L("Doar cu acordul scris al chiriașului", "Только с письменного согласия арендатора", "Only with the tenant's written consent"), avoid: L("Sigle fără permisiune", "Логотипы без разрешения", "Logos without permission"), desktop: "3:2", mobile: "4:5", ratio: 3 / 2 },
  { key: "interior", no: "10", name: "INTERIOR", label: L("Interior", "Интерьер", "Interior"), purpose: L("Spațiul în sine: suprafață, lumină, înălțime.", "Само пространство: площадь, свет, высота.", "The space itself: floor, light, height."), camera: "16–24 mm, verticals corrected · 1.2–1.4 m", composition: L("Adâncimea camerei, ferestre, tavan.", "Глубина помещения, окна, потолок.", "Depth of the room, windows, ceiling."), time: L("Ziua (bracketing pentru ferestre)", "День (брекетинг для окон)", "Daytime (bracket the windows)"), light: L("Zi + toate luminile aprinse", "День + весь свет включён", "Daylight + all lights on"), people: "optional", peopleNote: L("Una–două persoane", "Один–два человека", "One or two figures"), avoid: L("Ferestre arse, cabluri, dezordine", "Пересвеченные окна, провода, беспорядок", "Blown windows, cables, clutter"), desktop: "3:2", mobile: "4:5", ratio: 3 / 2 },
  { key: "detail", no: "11", name: "DETAIL", label: L("Detaliu", "Деталь", "Detail"), purpose: L("Calitatea materialelor: vitraj, îmbinări, placare.", "Качество материалов: остекление, стыки, облицовка.", "Material quality: glazing, joints, cladding."), camera: "85–135 mm · any height", composition: L("Decupaj abstract, ritmic.", "Абстрактный ритмичный кадр.", "An abstract, rhythmic crop."), time: L("Lumină razantă", "Скользящий свет", "Raking light"), light: L("Soare jos sau cer acoperit clar", "Низкое солнце или ясная облачность", "Low sun or crisp overcast"), people: "no", peopleNote: L("Fără oameni", "Без людей", "No people"), avoid: L("Defecte nerezolvate puse în evidență", "Неустранённые дефекты в фокусе", "Unrepaired defects in focus"), desktop: "4:5 / 1:1", mobile: "1:1", ratio: 4 / 5 },
  { key: "drone", no: "12", name: "DRONE", label: L("Dronă", "Дрон", "Drone"), purpose: L("Terenul, drumurile și cartierul într-o imagine.", "Участок, дороги и район в одном кадре.", "Plot, roads and district in one image."), camera: "Drone, 24 mm equiv., oblique 30–45° · 40–90 m (licensed operator, permits)", composition: L("Conturul terenului și drumurile.", "Контур участка и дороги.", "The plot outline and the roads."), time: L("Dimineața", "Утро", "Morning"), light: L("Soarele în spatele aparatului", "Солнце за камерой", "Sun behind the camera"), people: "no", peopleNote: L("Fără persoane identificabile", "Без узнаваемых людей", "No identifiable people"), avoid: L("Curțile private ale vecinilor", "Частные дворы соседей", "Neighbours' private yards"), desktop: "21:9", mobile: "4:5", ratio: 21 / 9 },
  { key: "evening", no: "13", name: "EVENING", label: L("Seara", "Вечер", "Evening"), purpose: L("Un singur cadru de seară: fațadă luminată și viață.", "Один вечерний кадр: подсвеченный фасад и жизнь.", "One evening frame: a lit facade and life."), camera: "24–35 mm on a tripod · 1.6 m", composition: L("Ca în cadrul principal.", "Как в главном кадре.", "As in the hero."), time: L("15–25 de minute după apus", "15–25 минут после заката", "15–25 min after sunset"), light: L("Cer echilibrat + toate luminile clădirii", "Сбалансированное небо + весь свет здания", "Balanced sky + all building lights"), people: "optional", peopleNote: L("Opțional", "По желанию", "Optional"), avoid: L("Noapte neagră, ferestre stinse", "Чёрная ночь, тёмные окна", "Black night, dark windows"), desktop: "16:9", mobile: "9:16", ratio: 16 / 9 },
  { key: "mobile", no: "14", name: "MOBILE VERTICAL", label: L("Vertical pentru telefon", "Вертикаль для телефона", "Mobile vertical"), purpose: L("Cadru nativ pentru telefon, nu un decupaj.", "Родной кадр для телефона, а не кроп.", "A native phone hero, not a crop."), camera: "24–28 mm · 1.6 m, portrait 9:16", composition: L("Intrarea + toată înălțimea clădirii.", "Вход + вся высота здания.", "The entrance + the building's full height."), time: L("Ca în cadrul principal", "Как в главном кадре", "As the hero"), light: L("Ca în cadrul principal", "Как в главном кадре", "As the hero"), people: "yes", peopleNote: L("Mici", "Небольшие фигуры", "Small"), avoid: L("Vârful clădirii tăiat", "Обрезанный верх здания", "Cutting off the top"), desktop: "—", mobile: "9:16 (1080 × 1920 min.)", ratio: 9 / 16 },
  { key: "unit", no: "15", name: "AVAILABLE UNIT", label: L("Spațiul liber", "Свободное помещение", "Available unit"), purpose: L("Fiecare spațiu liber, așa cum îl va vedea chiriașul.", "Каждое свободное помещение таким, каким его увидит арендатор.", "Each vacant space as the tenant will see it."), camera: "16–24 mm · 1.3 m, from the door and from the far corner", composition: L("Două cadre: de la ușă și înapoi spre ferestre.", "Два кадра: от двери и обратно к окнам.", "Two frames: from the door, and back towards the windows."), time: L("Ziua", "День", "Daytime"), light: L("Zi + toate luminile; curat și gol", "День + весь свет; чисто и пусто", "Daylight + all lights; clean and empty"), people: "no", peopleNote: L("Fără oameni", "Без людей", "No people"), avoid: L("Dezordine, firma chiriașului anterior", "Беспорядок, вывески прежнего арендатора", "Clutter, the previous tenant's branding"), desktop: "3:2", mobile: "4:5", ratio: 3 / 2 },
  { key: "plan", no: "16", name: "FLOOR PLAN SUPPORT", label: L("Pentru plan", "Под планировку", "Floor-plan support"), purpose: L("Cadre care fac planul ușor de citit: intrarea, colțurile, instalațiile.", "Кадры, которые делают план понятным: вход, углы, инженерия.", "Frames that make the plan readable: entrance, corners, services."), camera: "24 mm · 1.6 m, positions marked on the plan", composition: L("Un cadru pentru fiecare punct de pe plan, numerotat.", "Один кадр на каждую точку плана, с номером.", "One numbered frame per plan reference point."), time: L("Ziua", "День", "Daytime"), light: L("Uniformă", "Ровный", "Even"), people: "no", peopleNote: L("Fără oameni", "Без людей", "No people"), avoid: L("Cadre care nu pot fi găsite pe plan", "Кадры, которые нельзя найти на плане", "Frames that cannot be located on the plan"), desktop: "3:2", mobile: "4:5", ratio: 3 / 2 },
];

export type PropertyBrief = {
  slug: "dacia-31" | "moscova-9" | "moscova-20" | "creanga-78" | "vatra" | "drochia";
  name: string;
  status: string;
  mood: Localized;
  avoid: Localized;
  /** Shots that do not apply (a site without a building, a project without tenants). */
  notApplicable: ShotKey[];
  /** Shots the current OWNER photographs already cover reasonably (kept, processed for the preview). */
  covered: ShotKey[];
  /** What must be visible, per shot (English — photographer brief). */
  mustShow: Partial<Record<ShotKey, string>>;
};

export const propertyBriefs: PropertyBrief[] = [
  {
    slug: "dacia-31",
    name: "Dacia 31",
    status: "Operating property · stand-alone office building · whole building available from 1 January 2027 (confirmed).",
    mood: L("Calm, corporativ, sigur: o clădire, o companie, numele ei pe fațadă. Lumină de dimineață pe bd. Dacia.", "Спокойно, корпоративно, уверенно: одно здание, одна компания, её имя на фасаде. Утренний свет на бул. Дачия.", "Calm, corporate, confident: one building, one company, its name on the facade. Morning light on Bd. Dacia."),
    avoid: L("Firma ocupantului actual fără acord; mașini în prim-plan; cer gri de iarnă.", "Вывеска нынешнего пользователя без согласия; машины на переднем плане; серое зимнее небо.", "The current occupier's branding without consent; cars in the foreground; a grey winter sky."),
    notApplicable: [],
    covered: ["hero"],
    mustShow: {
      hero: "Whole building, main facade and entrance, open sky; the Dacia / Traian / Decebal arteries as context",
      facade34: "Building volume, glazed zones, the 4+ entrances",
      frontal: "The facade where a company name could go",
      context: "Botanica arteries, the pedestrian promenade, cafés and services nearby",
      access: "Approach from Bd. Dacia, the turn into the plot",
      parking: "On-plot parking and vehicle access (≈60 spaces — to confirm)",
      entrance: "Main entrance and access-control point",
      human: "People arriving on foot from the promenade",
      tenant: "Only with the current occupier's consent — otherwise skip",
      interior: "A large open floor (1st or 2nd floor, 1,138–1,770 m²) and the lobby",
      detail: "Glazing, cladding, building-services outlets",
      drone: "Plot outline, four sides, distance to the arteries",
      evening: "Lit floors suggesting a working headquarters",
      mobile: "Entrance + the full height of the building",
      unit: "Each floor empty and lit, from the core towards the windows (after the current lease ends)",
      plan: "Core, stairs, each entrance — numbered to the stacking plan",
    },
  },
  {
    slug: "moscova-9",
    name: "Moscova 9",
    status: "Operating property · stand-alone retail building on Moscova Boulevard · whole or in part (confirmed).",
    mood: L("Energie de retail cu reținere: fațadă lungă pe prima linie, două intrări, curte de serviciu separată.", "Энергия ритейла со сдержанностью: длинный фасад первой линии, два входа, отдельный служебный двор.", "Retail energy with restraint: a long first-line frontage, two entrances, a separate service yard."),
    avoid: L("Sigla chiriașului actual fără permisiune; bannere temporare; trafic care acoperă fațada.", "Логотип нынешнего арендатора без разрешения; временные баннеры; трафик, закрывающий фасад.", "The current tenant's logo without permission; temporary banners; traffic hiding the frontage."),
    notApplicable: [],
    covered: ["hero"],
    mustShow: {
      hero: "The full length of the frontage from the boulevard, both customer entrances",
      facade34: "Frontage length and depth of the building",
      frontal: "The signage band across the whole facade",
      context: "Boulevard flow, parking along the road, the dense residential district",
      access: "Arrival along Bd. Moscova from both directions",
      parking: "Parking along the boulevard; the service yard behind",
      entrance: "Each customer entrance",
      human: "Pedestrians passing and entering",
      tenant: "Sales floor in use — tenant consent required",
      interior: "The 737 m² main sales floor, empty and lit",
      detail: "Shopfront glazing, canopy, signage fixings",
      drone: "Plot, boulevard, service access at the rear",
      evening: "The lit frontage on the boulevard",
      mobile: "One entrance + the height of the frontage",
      unit: "Sales floor from each entrance; the unloading zone (69 m²) with the ramp",
      plan: "Sales floor corners, unloading door, support rooms — numbered to the zone plan",
    },
  },
  {
    slug: "moscova-20",
    name: "Moscova 20",
    status: "Operating property 704 m² · the first-line unit M20-01 (625.7 m²) is on offer — status from the unit record.",
    mood: L("Viața zilnică a cartierului: prima linie, vitrina spre bulevard, terasa, oamenii care trec.", "Ежедневная жизнь района: первая линия, витрина к бульвару, терраса, прохожие.", "Neighbourhood daily life: the first line, the window to the boulevard, the terrace, people walking by."),
    avoid: L("Aspect de stradă goală; firma chiriașului actual fără acord; cabluri peste fațadă.", "Пустая улица; вывеска нынешнего арендатора без согласия; провода через фасад.", "An empty-street look; the current tenant's branding without consent; overhead wires across the facade."),
    notApplicable: [],
    covered: ["hero"],
    mustShow: {
      hero: "Moscova 20 on Moscova Boulevard, the panoramic window to the boulevard",
      facade34: "The volume and the terrace",
      frontal: "Each street elevation, with the signage zone",
      context: "Public transport stop, dense housing, shops around",
      access: "Approach on foot from the transport stop",
      parking: "Dedicated parking nearby and its distance to the door",
      entrance: "The customer entrance through the terrace; separately the service access with ramp",
      human: "The daily pedestrian flow past the window (no figure — new count required)",
      tenant: "Only with consent — otherwise a staged café / shop use with the OWNER's approval",
      interior: "Ground floor (240.96 m²) and lower ground (293.70 m²), empty and lit",
      detail: "Window frames, terrace edge, signage band",
      drone: "The boulevard frontage, the terrace",
      evening: "The lit shop window",
      mobile: "Customer entrance + building height",
      unit: "From the entrance door into the space; from the back towards the windows; the stair to the lower ground",
      plan: "Entrance, stair, service door, terrace — numbered to the stacking plan",
    },
  },
  {
    slug: "creanga-78",
    name: "Creangă 78",
    status: "Operating property · no approved public data or photography yet. Every value in the preview is DEMO; the preview uses a labelled concept image.",
    mood: L("Mai întâi confirmăm clădirea (adresă, destinație, suprafață). Până atunci: o clădire urbană îngrijită, cu viață la stradă.", "Сначала подтверждаем здание (адрес, назначение, площадь). До тех пор: ухоженное городское здание с жизнью у улицы.", "Confirm the building first (address, use, area). Until then: a well-kept city building with life at street level."),
    avoid: L("Orice imagine înainte de confirmarea MEGAPARC; siglele chiriașilor fără permisiune.", "Любые съёмки до подтверждения MEGAPARC; логотипы арендаторов без разрешения.", "Any image before MEGAPARC confirms the property; tenants' logos without permission."),
    notApplicable: [],
    covered: [],
    mustShow: {
      hero: "The building and its street front with ground-floor activity",
      facade34: "The building volume and the street-level units",
      frontal: "The street elevation with the entrance board",
      context: "The district: offices, institutions, housing, transport",
      access: "Approach from the nearest main street",
      parking: "On-plot parking and its entry",
      entrance: "Shared lobby entrance; separately each street-front unit",
      human: "People entering the lobby and the ground-floor services",
      tenant: "Ground-floor services in use — consent required",
      interior: "The lobby and a typical office floor",
      detail: "Entrance board, lobby finishes",
      drone: "Plot, parking, the street front",
      evening: "Lit lobby and offices",
      mobile: "Entrance + building height",
      unit: "Each vacant unit (101, 204, 305 …) from the door and towards the windows",
      plan: "Each unit's door, windows and the core — numbered to the floor plans",
    },
  },
  {
    slug: "vatra",
    name: "VATRA",
    status: "Development project · stage 05 Delivery (confirmed). Real OWNER aerial imagery exists. Final architecture is not shown before approval.",
    mood: L("Progres și grijă: un șantier real care avansează, oameni la lucru, lumină de dimineață.", "Прогресс и аккуратность: реальная площадка, которая движется вперёд, люди за работой, утренний свет.", "Progress and care: a real site moving forward, people at work, morning light."),
    avoid: L("Practici nesigure, șantier neîngrijit, oameni fără echipament de protecție, randări prezentate ca fotografii.", "Небезопасная работа, неубранная площадка, люди без СИЗ, рендеры под видом фото.", "Unsafe practice, an untidy site, people without PPE, renders presented as photographs."),
    notApplicable: ["frontal", "tenant", "unit"],
    covered: ["hero", "drone"],
    mustShow: {
      hero: "The site in progress from the same point every quarter",
      facade34: "The most advanced structure, from a corner",
      context: "The site's surroundings and access road",
      access: "The site entrance and the access road",
      parking: "Future parking area / site logistics",
      entrance: "The site gate with its information board",
      human: "Construction team at work, PPE on",
      interior: "Completed interiors only when a building is finished",
      detail: "Reinforcement, formwork, material samples",
      drone: "The whole site from the same position every quarter (progress series)",
      evening: "Only when the first building is lit",
      mobile: "Site gate + the tallest structure",
      plan: "Site plan reference points (gate, buildings, roads) — numbered",
    },
  },
  {
    slug: "drochia",
    name: "Drochia",
    status: "Development land · 2.0 ha, Bd. Independenței 65, Drochia · CONCEPT · UNDER EVALUATION (confirmed). No building is approved.",
    mood: L("Potențial și deschidere: terenul la intrarea în oraș, ambele fronturi stradale, cer larg.", "Потенциал и простор: участок на въезде в город, оба фронта к дорогам, широкое небо.", "Potential and openness: the land at the town entrance, both road fronts, wide sky."),
    avoid: L("Orice clădire nemarcată ca viziune ilustrativă; identificatori cadastrali; proprietatea privată a vecinilor.", "Любые здания без пометки «иллюстративное видение»; кадастровые номера; частная собственность соседей.", "Any building visual not labelled illustrative vision; cadastral identifiers; neighbours' private property."),
    notApplicable: ["facade34", "frontal", "tenant", "interior", "detail", "unit"],
    covered: [],
    mustShow: {
      hero: "The land from the entrance road, both road fronts, wide sky",
      context: "The town entrance, the traffic heading into Drochia",
      access: "Each road front and possible separate accesses for customers and freight",
      parking: "Where parking could go (land only)",
      entrance: "The town-entrance position as seen by arriving traffic",
      human: "Optional: a site visit by the MEGAPARC team (no third parties)",
      drone: "The 2.0 ha outline, both road fronts, the town entrance",
      evening: "Optional: the road at dusk with traffic lights",
      mobile: "The road front + sky",
      plan: "Corners of the plot and each road front — numbered to the site diagram",
    },
  },
];
