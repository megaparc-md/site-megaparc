import { T } from "@/data/leasing-experience-model";
import type { DealStructure, DevelopmentScenario, Distance, ExplorerData, LandAsset, LocationLayer, MarketIndicator, MediaSlot, ModelPreset, PackDocument, Param, ReadinessItem, Register, Role } from "@/data/land/model";
import type { Localized } from "@/lib/site-data";

/**
 * THE UNIVERSAL LAND TEMPLATE — the standard rows of every MEGAPARC land asset (OWNER «DROCHIA MASTER TEMPLATE R2» §7, 2026-11-23).
 * A new site (Hîncești, Orhei, Florilor 32/2 …) is ONE configuration file that calls createLandAsset() with its facts, its context
 * (town, roads, station, address) and only the rows it knows better than the defaults — the page, the calculator, the PDF, the data
 * passport and the Excel are not touched. Every default is a status, never a value: an unknown parameter is `null` with «необходимо
 * получить»; nothing here invents a fact. Drochia (src/data/land/drochia.ts) is built with this factory and its published data are
 * proven unchanged by scripts/land-asset-dump.mjs.
 */

type L = Localized;
const NB = String.fromCharCode(160);

/** what the standard texts need to know about the place */
export type SiteContext = {
  /** the town in the genitive / attributive form: RO «Drochia» · RU «Дрокии» · EN «Drochia» (PUG of …, the … town hall) */
  townGen: L;
  /** how the shoot sees the roads: RO «ambele fronturi» · RU «оба выхода к дорогам» · EN «both road fronts» */
  roads: L;
  /** where the panorama is taken from: RO «de pe bulevardul …» · RU «с бульвара …» · EN «from … Boulevard» */
  frontageFrom: L;
  /** the nearest railway station by name: RO «gara Drochia» · RU «станция Дрокия» · EN «Drochia station» */
  station: L;
  /** the short address of the explorer's site layer */
  addressShort: L;
  /** where the map point comes from — a short source label and the sentence under the site layer (never «a boundary») */
  pointSource: L;
  pointNote: L;
  explorer: ExplorerData;
  /** the date of the desk market research (dd.mm.yyyy) or null while none exists */
  researchDate: string | null;
};

const day = (iso: string) => iso.split("-").reverse().join(".");
const word = (n: number): L => {
  const ro = ["", "Un", "Două", "Trei", "Patru", "Cinci", "Șase"][n] ?? String(n);
  const ru = ["", "Один", "Два", "Три", "Четыре", "Пять", "Шесть"][n] ?? String(n);
  const en = ["", "One", "Two", "Three", "Four", "Five", "Six"][n] ?? String(n);
  return { ro, ru, en };
};

// ---------------------------------------------------------------------------------------------------------------- media
export function standardMedia(ctx: SiteContext, over: Partial<Record<MediaSlot["key"], Partial<MediaSlot>>> = {}): MediaSlot[] {
  const rows: MediaSlot[] = [
    { key: "panorama", kind: "photo", src: null, label: T("Fotografia panoramică a terenului", "Панорамная фотография участка", "Panoramic photograph of the site"), brief: T(`Cadru larg de la nivelul ochilor ${ctx.frontageFrom.ro}, lumină de zi, ${ctx.roads.ro} vizibile.`, `Широкий кадр с уровня глаз ${ctx.frontageFrom.ru}, дневной свет, видны ${ctx.roads.ru}.`, `A wide eye-level frame ${ctx.frontageFrom.en} in daylight, ${ctx.roads.en} visible.`) },
    { key: "film", kind: "video", src: null, label: T("Film de prezentare", "Рекламный ролик", "Promotional film"), brief: T("15–30 s, dronă și sol: terenul, accesele, orașul în jur; fără sunet obligatoriu, 16 : 9 și 9 : 16.", "15–30 с, дрон и съёмка с земли: участок, подъезды, город вокруг; без обязательного звука, 16 : 9 и 9 : 16.", "15–30 s, drone and ground: the site, the access roads, the town around; no sound required, 16 : 9 and 9 : 16.") },
    { key: "tour360", kind: "pano", src: null, label: T("Vizită interactivă 360°", "Интерактивный осмотр 360°", "Interactive 360° tour"), brief: T("3–5 puncte sferice pe teren și unul aerian; legate de punctele de pe hartă.", "3–5 сферических точек на участке и одна с воздуха; привязаны к точкам на карте.", "3–5 spherical points on the site and one aerial, linked to the points on the map.") },
    { key: "aerial", kind: "photo", src: null, label: T("Fotografie aeriană", "Аэрофотосъёмка", "Aerial photograph"), brief: T("Vedere oblică și verticală la 80–120 m, după trasarea limitelor pe teren.", "Перспективный и вертикальный кадры с 80–120 м, после выноса границ на местности.", "Oblique and vertical frames from 80–120 m, after the boundary is staked out on the ground.") },
    { key: "orthophoto", kind: "photo", src: null, label: T("Ortofotoplan", "Ортофотоплан", "Orthophoto"), brief: T("Ortofotoplan geo-referențiat al terenului și al vecinătății (pentru stratul satelit).", "Геопривязанный ортофотоплан участка и окружения (для спутникового слоя).", "A georeferenced orthophoto of the site and its surroundings (for the satellite layer).") },
    { key: "plan", kind: "drawing", src: null, label: T("Planul cadastral cu limitele", "Кадастровый план с границами", "Cadastral plan with the boundary"), brief: T("Planul cadastral oficial sau coordonatele verificate ale limitelor.", "Официальный кадастровый план или проверенные координаты границ.", "The official cadastral plan or the verified boundary coordinates.") },
    { key: "masterplan", kind: "drawing", src: null, label: T("Plan general al conceptului", "Генеральный план концепции", "Concept masterplan"), brief: T("După verificarea urbanistică — de la arhitectul MEGAPARC.", "После градостроительной проверки — от архитектора MEGAPARC.", "After the planning check — from MEGAPARC's architect.") },
    { key: "renders", kind: "photo", src: null, label: T("Vizualizări arhitecturale și 3D", "Архитектурные визуализации и 3D", "Architectural visualisations and 3D"), brief: T("Doar pentru un concept aprobat; marcate ca vizualizări, niciodată ca fotografie.", "Только для утверждённой концепции; подписываются как визуализации, никогда как фотография.", "Only for an approved concept; always captioned as visualisations, never as a photograph.") },
  ];
  return rows.map((m) => ({ ...m, ...(over[m.key] ?? {}) }));
}

// ---------------------------------------------------------------------------------------------------------------- explorer layers
export function standardLayers(ctx: SiteContext, over: Partial<Record<LocationLayer["key"], Partial<LocationLayer>>> = {}): LocationLayer[] {
  const d = day(ctx.explorer.fetched);
  const osm = T(`OpenStreetMap · ${d}`, `OpenStreetMap · ${d}`, `OpenStreetMap · ${d}`);
  const m = ctx.explorer.town.distance;
  // under 1 km in metres, from 1 km in kilometres with one decimal (RO / RU comma, EN point)
  const km = (sep: string) => (m / 1000).toFixed(1).replace(".", sep);
  const far = { ro: m < 1000 ? `${m}${NB}m` : `${km(",")}${NB}km`, ru: m < 1000 ? `${m}${NB}м` : `${km(",")}${NB}км`, en: m < 1000 ? `${m}${NB}m` : `${km(".")}${NB}km` };
  const rows: LocationLayer[] = [
    { key: "site", state: "ready", source: ctx.pointSource, label: T("Amplasare", "Расположение", "Location"), title: T("Terenul în oraș", "Участок в городе", "The site in the town"), text: T(`${ctx.addressShort.ro} — la ≈${NB}${far.ro} în linie dreaptă de centrul orașului (OSM). ${ctx.pointNote.ro}`, `${ctx.addressShort.ru} — около ${far.ru} по прямой от центра города (OSM). ${ctx.pointNote.ru}`, `${ctx.addressShort.en} — about ${far.en} in a straight line from the town centre (OSM). ${ctx.pointNote.en}`) },
    { key: "boundary", state: "pending", source: T("Se așteaptă planul cadastral sau coordonatele verificate", "Ожидается кадастровый план или проверенные координаты", "Awaiting the cadastral plan or verified coordinates"), label: T("Limite cadastrale", "Кадастровые границы", "Cadastral boundary"), title: T("Limitele — după planul oficial", "Границы — только по официальному плану", "The boundary — from the official plan only"), text: T("Limitele se trasează după planul cadastral oficial sau după coordonatele verificate. Până atunci nu desenăm nicio limită aproximativă.", "Границы наносятся по официальному кадастровому плану или проверенным координатам. До этого мы не рисуем приблизительных границ.", "The boundary is drawn from the official cadastral plan or verified coordinates. Until then we draw no approximate outline.") },
    { key: "access", state: "ready", source: T(`OpenStreetMap · ${d} · rutare OSRM (estimare)`, `OpenStreetMap · ${d} · маршрутизация OSRM (оценка)`, `OpenStreetMap · ${d} · OSRM routing (estimate)`), label: T("Acces și transport", "Подъезды и транспорт", "Access and transport"), title: T("Drumuri, gară, legături", "Дороги, станция, связи", "Roads, station, links"), text: T(`Drumurile naționale și locale după numerotarea din OpenStreetMap, ${ctx.station.ro} și distanțele rutiere estimate până la centrele economice.`, `Национальные и местные дороги по нумерации OpenStreetMap, ${ctx.station.ru} и оценочные расстояния по дорогам до экономических центров.`, `National and local roads by their OpenStreetMap numbering, ${ctx.station.en} and estimated road distances to the economic centres.`) },
    { key: "context", state: "ready", source: osm, label: T("Împrejurimi", "Окружение", "Surroundings"), title: T("Ce este în jurul terenului", "Что вокруг участка", "What surrounds the site"), text: T("Clădirile, străzile, zonele verzi și apa din jurul adresei — conform OpenStreetMap.", "Здания, улицы, зелёные зоны и вода вокруг адреса — по данным OpenStreetMap.", "Buildings, streets, green areas and water around the address — from OpenStreetMap.") },
    { key: "commerce", state: "ready", source: osm, label: T("Infrastructură comercială", "Коммерческая инфраструктура", "Commercial infrastructure"), title: T("Comerț și servicii în oraș", "Торговля и услуги в городе", "Retail and services in the town"), text: T("Supermarketuri, piața, magazine de bricolaj și electronice, stații de carburant, bănci și farmacii — punctele din OpenStreetMap, distanțe în linie dreaptă.", "Супермаркеты, рынок, магазины стройматериалов и электроники, АЗС, банки и аптеки — точки OpenStreetMap, расстояния по прямой.", "Supermarkets, the market, DIY and electronics stores, fuel stations, banks and pharmacies — OpenStreetMap points, straight-line distances.") },
    { key: "residential", state: "ready", source: T(`OpenStreetMap · ${d} · Recensământul 2024 (BNS)`, `OpenStreetMap · ${d} · Перепись населения 2024 (НБС)`, `OpenStreetMap · ${d} · 2024 Census (NBS)`), label: T("Zone rezidențiale și populație", "Жилые районы и население", "Residential areas and population"), title: T("Unde locuiesc oamenii", "Где живут люди", "Where people live"), text: T("Zonele rezidențiale, școlile și grădinițele (OSM) și populația orașului și a raionului după datele oficiale.", "Жилые зоны, школы и детские сады (OSM) и население города и района по официальным данным.", "Residential zones, schools and kindergartens (OSM) and the population of the town and the district from official data.") },
    { key: "utilities", state: "ready", source: T(`OpenStreetMap · ${d} — un reper, nu condiții tehnice`, `OpenStreetMap · ${d} — ориентир, не технические условия`, `OpenStreetMap · ${d} — a reference, not technical conditions`), label: T("Rețele inginerești", "Инженерные сети", "Utility networks"), title: T("Rețelele vizibile pe hartă", "Сети, видимые на карте", "Networks visible on the map"), text: T("Liniile electrice, posturile de transformare și obiectele de apă din OpenStreetMap — un reper, nu condiții tehnice. Capacitățile de racordare se verifică la operatori.", "ЛЭП, подстанции и объекты водоснабжения из OpenStreetMap — ориентир, а не технические условия. Мощности подключения проверяются у операторов сетей.", "Power lines, substations and water facilities from OpenStreetMap — a reference, not technical conditions. Connection capacities are verified with the network operators.") },
    { key: "potential", state: "ready", source: osm, label: T("Posibilități de dezvoltare", "Возможности развития", "Development potential"), title: T("Unde se concentrează funcțiile comerciale și de producție", "Где в городе торговля и производство", "Where trade and production concentrate"), text: T("Zonele de producție și comerț ale orașului și drumurile principale — contextul scenariilor. Nu este un regulament urbanistic: destinația permisă a terenului se verifică.", "Производственные и торговые зоны города и главные дороги — контекст сценариев. Это не градостроительный регламент: разрешённое использование участка проверяется.", "The town's production and trade zones and the main roads — the context of the scenarios. Not a planning regulation: the site's permitted use is being verified.") },
  ];
  return rows.map((l) => ({ ...l, ...(over[l.key] ?? {}) }));
}

// ---------------------------------------------------------------------------------------------------------------- technical passport
const extractDoc = T("Extras din Registrul bunurilor imobile", "Выписка из Реестра недвижимого имущества", "Extract from the Real Estate Register");
const cadPlan = T("Planul cadastral", "Кадастровый план", "Cadastral plan");
const tu = T("Condiții tehnice ale operatorului rețelei", "Технические условия оператора сети", "Technical conditions of the network operator");
export type ParamKey = "area" | "designation" | "ownership" | "encumbrances" | "servitudes" | "geometry" | "dimensions" | "frontage" | "relief" | "geology" | "structures" | "pot" | "cut" | "height" | "setbacks" | "parking" | "entries" | "power" | "water" | "sewer" | "gas" | "storm" | "telecom";

export function standardPassport(ctx: SiteContext, known: Partial<Record<ParamKey, Partial<Param>>> = {}): Param[] {
  const urban = T(`Certificat de urbanism informativ · PUG ${ctx.townGen.ro}`, `Градостроительный сертификат (информативный) · PUG ${ctx.townGen.ru}`, `Informative planning certificate · ${ctx.townGen.en} general urban plan`);
  const row = (key: ParamKey, group: Param["group"], label: L, owner: Role, document: L, note?: L): Param => ({ key, group, label, value: null, status: "TO_OBTAIN", source: null, checked: null, owner, document, note, public: true });
  const rows: Param[] = [
    row("area", "land", T("Suprafața cadastrală", "Кадастровая площадь", "Cadastral area"), "cadastral", extractDoc),
    row("designation", "land", T("Destinația terenului", "Назначение земли", "Land category"), "cadastral", extractDoc),
    row("ownership", "land", T("Dreptul de proprietate", "Право собственности", "Ownership"), "lawyer", extractDoc),
    row("encumbrances", "land", T("Grevări (ipotecă, sechestru, locațiune)", "Обременения (ипотека, арест, аренда)", "Encumbrances (mortgage, attachment, lease)"), "lawyer", extractDoc),
    row("servitudes", "land", T("Servituți", "Сервитуты", "Easements"), "lawyer", T("Extras din Registru · planul cadastral", "Выписка из Реестра · кадастровый план", "Register extract · cadastral plan")),
    row("geometry", "geometry", T("Geometria terenului", "Геометрия участка", "Site geometry"), "cadastral", cadPlan),
    row("dimensions", "geometry", T("Dimensiunile terenului", "Размеры участка", "Site dimensions"), "cadastral", cadPlan),
    row("frontage", "geometry", T("Front la drum", "Фасад вдоль дороги", "Road frontage"), "cadastral", cadPlan),
    row("relief", "geometry", T("Relief", "Рельеф", "Topography"), "surveyor", T("Ridicare topografică", "Топографическая съёмка", "Topographic survey")),
    row("geology", "geometry", T("Geologie", "Геология", "Geology"), "geologist", T("Studiu geotehnic", "Инженерно-геологические изыскания", "Geotechnical study")),
    row("structures", "geometry", T("Construcții existente", "Существующие постройки", "Existing structures"), "cadastral", T("Extras din Registru · inspecție pe teren", "Выписка из Реестра · осмотр участка", "Register extract · site inspection")),
    row("pot", "planning", T("POT · procentul de ocupare a terenului", "POT · процент застройки участка", "POT · site coverage ratio"), "architect", urban),
    row("cut", "planning", T("CUT · coeficientul de utilizare a terenului", "CUT · коэффициент использования участка", "CUT · floor area ratio"), "architect", urban),
    row("height", "planning", T("Regimul de înălțime", "Допустимая высотность", "Height limit"), "architect", urban),
    row("setbacks", "planning", T("Retrageri", "Отступы", "Setbacks"), "architect", urban),
    row("parking", "planning", T("Cerințe de parcare", "Требования к парковке", "Parking requirements"), "architect", urban),
    row("entries", "planning", T("Accese și ieșiri", "Въезды и выезды", "Entries and exits"), "architect", T("Avizul administratorului drumului", "Согласование владельца дороги", "Approval of the road authority")),
    row("power", "utilities", T("Electricitate", "Электричество", "Electricity"), "utilities", tu, T("Liniile vizibile pe harta OSM nu confirmă posibilitatea de racordare.", "ЛЭП на карте OSM не подтверждают возможность подключения.", "Power lines on the OSM map do not confirm a connection.")),
    row("water", "utilities", T("Apă", "Вода", "Water"), "utilities", tu),
    row("sewer", "utilities", T("Canalizare", "Канализация", "Sewerage"), "utilities", tu),
    row("gas", "utilities", T("Gaz", "Газ", "Gas"), "utilities", tu),
    row("storm", "utilities", T("Canalizare pluvială", "Ливневая канализация", "Stormwater"), "utilities", tu),
    row("telecom", "utilities", T("Telecomunicații", "Связь", "Telecom"), "utilities", tu),
  ];
  return rows.map((p) => ({ ...p, ...(known[p.key as ParamKey] ?? {}) }));
}

// ---------------------------------------------------------------------------------------------------------------- readiness register
export type ReadinessKey = "acquisition" | "extract" | "plan" | "coords" | "burdens" | "pug" | "certificate" | "use" | "parameters" | "road" | "topo" | "geotech" | "tu-power" | "tu-water" | "tu-gas" | "tu-storm" | "environment" | "market" | "maps" | "concept" | "model" | "deal" | "photos" | "aerial" | "film" | "tour";

export function standardReadiness(ctx: SiteContext, counts: { scenarios: number; deals: number }, over: Partial<Record<ReadinessKey, Partial<ReadinessItem>>> = {}): ReadinessItem[] {
  const r = (key: ReadinessKey, category: ReadinessItem["category"], label: L, status: Register, evidence: L | null, next: L, owner: Role, checked: string | null = null): ReadinessItem => ({ key, category, label, status, evidence, next, owner, checked, public: true });
  const sc = word(counts.scenarios), dl = word(counts.deals);
  const fetched = ctx.explorer.fetched;
  const rows: ReadinessItem[] = [
    r("acquisition", "title", T("Achiziția terenului", "Приобретение участка", "Acquisition of the site"), "NOT_APPLICABLE", T("Terenul este deja proprietatea MEGAPARC", "Участок уже в собственности MEGAPARC", "The site is already owned by MEGAPARC"), T("—", "—", "—"), "owner"),
    r("extract", "title", T("Extras din Registrul bunurilor imobile", "Выписка из Реестра недвижимого имущества", "Real Estate Register extract"), "TO_OBTAIN", null, T("Atașăm extrasul actual din Registru", "Приложить актуальную выписку из Реестра", "Attach the current Register extract"), "lawyer"),
    r("plan", "title", T("Planul cadastral", "Кадастровый план", "Cadastral plan"), "TO_OBTAIN", null, T("Obținerea planului de la ASP / inginerul cadastral", "Получить план в ASP / у кадастрового инженера", "Obtain the plan from ASP / a cadastral engineer"), "cadastral"),
    r("coords", "title", T("Coordonatele limitelor", "Координаты границ", "Boundary coordinates"), "TO_OBTAIN", null, T("Coordonatele verificate — apoi limita pe hartă", "Проверенные координаты — затем граница на карте", "Verified coordinates — then the boundary on the map"), "cadastral"),
    r("burdens", "title", T("Grevări și servituți", "Обременения и сервитуты", "Encumbrances and easements"), "TO_OBTAIN", null, T("Verificare juridică după extras", "Юридическая проверка по выписке", "Legal check against the extract"), "lawyer"),
    r("pug", "planning", T("PUG și zonificarea", "PUG и зонирование", "General urban plan and zoning"), "TO_OBTAIN", null, T(`Solicitarea extrasului din PUG ${ctx.townGen.ro} la primărie`, `Запросить выкопировку из PUG ${ctx.townGen.ru} в примэрии`, `Request the general-plan extract from the ${ctx.townGen.en} town hall`), "architect"),
    r("certificate", "planning", T("Certificat de urbanism informativ", "Градостроительный сертификат (информативный)", "Informative planning certificate"), "TO_OBTAIN", null, T(`Depunerea cererii la primăria ${ctx.townGen.ro}`, `Подать заявку в примэрию ${ctx.townGen.ru}`, `Apply to the ${ctx.townGen.en} town hall`), "architect"),
    r("use", "planning", T("Destinația permisă", "Разрешённое использование", "Permitted use"), "TO_OBTAIN", null, T("Rezultă din certificat și PUG", "Следует из сертификата и PUG", "Follows from the certificate and the general plan"), "architect"),
    r("parameters", "planning", T("POT · CUT · înălțime · retrageri", "POT · CUT · высотность · отступы", "POT · CUT · height · setbacks"), "TO_OBTAIN", null, T("Din certificat; apoi capacitatea reală a terenului", "Из сертификата; затем реальная ёмкость участка", "From the certificate; then the site's real capacity"), "architect"),
    r("road", "planning", T("Accese de la drum", "Подъезды с дороги", "Road access"), "TO_OBTAIN", null, T("Schema acceselor, restricțiile de tonaj și avizul administratorului drumului", "Схема подъездов, ограничения тоннажа и согласование с владельцем дороги", "The access scheme, weight restrictions and the road authority's approval"), "technical-director"),
    r("topo", "technical", T("Ridicare topografică", "Топографическая съёмка", "Topographic survey"), "TO_OBTAIN", null, T("Comandarea ridicării topografice", "Заказать топосъёмку", "Commission the survey"), "surveyor"),
    r("geotech", "technical", T("Studiu geotehnic", "Инженерно-геологические изыскания", "Geotechnical study"), "TO_OBTAIN", null, T("Foraje și raport geotehnic", "Скважины и геологический отчёт", "Boreholes and a geotechnical report"), "geologist"),
    r("tu-power", "technical", T("Condiții tehnice · electricitate", "Технические условия · электричество", "Technical conditions · electricity"), "TO_OBTAIN", null, T("Cererea către operatorul de distribuție, cu puterea scenariului", "Запрос оператору распределения с мощностью сценария", "Request to the distribution operator with the scenario's load"), "utilities"),
    r("tu-water", "technical", T("Condiții tehnice · apă și canalizare", "Технические условия · вода и канализация", "Technical conditions · water and sewerage"), "TO_OBTAIN", null, T("Cererea către operatorul local de apă", "Запрос местному водоканалу", "Request to the local water operator"), "utilities"),
    r("tu-gas", "technical", T("Condiții tehnice · gaz", "Технические условия · газ", "Technical conditions · gas"), "TO_OBTAIN", null, T("Doar dacă scenariul are nevoie de gaz", "Только если сценарию нужен газ", "Only if the scenario needs gas"), "utilities"),
    r("tu-storm", "technical", T("Ape pluviale și telecomunicații", "Ливнёвка и связь", "Stormwater and telecom"), "TO_OBTAIN", null, T("Soluția de colectare și racordurile de comunicații", "Решение по отводу стоков и подключение связи", "The drainage solution and the telecom connections"), "utilities"),
    r("environment", "technical", T("Restricții de mediu", "Экологические ограничения", "Environmental constraints"), "TO_OBTAIN", null, T("Verificarea zonelor de protecție și a cerințelor de mediu", "Проверить охранные зоны и экологические требования", "Check protection zones and environmental requirements"), "technical-director"),
    ctx.researchDate
      ? r("market", "commercial", T("Studiul pieței locației", "Исследование рынка локации", "Location market research"), "VERIFYING", T(`Studiu de birou din ${ctx.researchDate}, cu surse și grad de încredere`, `Кабинетное исследование от ${ctx.researchDate} с источниками и достоверностью`, `Desk research of ${ctx.researchDate}, with sources and confidence`), T("Validare pe teren: oferte, chiriași, operatori", "Проверка на месте: предложения, арендаторы, операторы", "Field validation: offers, tenants, operators"), "commercial", ctx.researchDate.split(".").reverse().join("-"))
      : r("market", "commercial", T("Studiul pieței locației", "Исследование рынка локации", "Location market research"), "TO_OBTAIN", null, T("Studiu de birou cu sursă, dată, metodă și grad de încredere pentru fiecare indicator", "Кабинетное исследование: источник, дата, метод и достоверность каждого показателя", "Desk research with the source, date, method and confidence of every indicator"), "commercial"),
    r("maps", "materials", T("Hărți de amplasare", "Карты расположения", "Location maps"), "DOCUMENTED", T(`Straturi OpenStreetMap din ${fetched}`, `Слои OpenStreetMap от ${day(fetched)}`, `OpenStreetMap layers of ${fetched}`), T("Actualizare la fiecare verificare", "Обновлять при каждой проверке", "Refresh at every check"), "marketing", fetched),
    r("concept", "commercial", T("Conceptul de dezvoltare", "Концепция развития", "Development concept"), "TO_OBTAIN", T(`${sc.ro} scenarii pentru evaluarea inițială`, `${sc.ru} сценария для первичной оценки`, `${sc.en} scenarios for initial evaluation`), T("După certificat și condițiile tehnice", "После сертификата и технических условий", "After the certificate and the technical conditions"), "architect"),
    r("model", "commercial", T("Model financiar pe un scenariu concret", "Финансовая модель конкретного сценария", "Financial model of a specific scenario"), "TO_OBTAIN", T("Instrumentul de pe pagină — pe ipotezele vizitatorului", "Инструмент на странице — на допущениях посетителя", "The tool on this page — on the visitor's assumptions"), T("Se elaborează cu partenerul, după concept", "Строится с партнёром после концепции", "Built with the partner after the concept"), "finance"),
    r("deal", "commercial", T("Structura tranzacției", "Структура сделки", "Deal structure"), "TO_OBTAIN", T(`${dl.ro} formate posibile, niciunul convenit`, `${dl.ru} возможных форматов, ни один не согласован`, `${dl.en} possible formats, none agreed`), T("Decizia MEGAPARC privind formatele admise", "Решение MEGAPARC о допустимых форматах", "MEGAPARC's decision on the admissible formats"), "owner"),
    r("photos", "materials", T("Fotografii ale terenului", "Фотографии участка", "Site photographs"), "TO_OBTAIN", null, T(`Filmare de zi, ${ctx.roads.ro}`, `Дневная съёмка, ${ctx.roads.ru}`, `A daylight shoot, ${ctx.roads.en}`), "marketing"),
    r("aerial", "materials", T("Fotografie aeriană și panoramă", "Аэросъёмка и панорама", "Aerial photograph and panorama"), "TO_OBTAIN", null, T("După trasarea limitelor pe teren", "После выноса границ на местности", "After the boundary is staked out"), "marketing"),
    r("film", "materials", T("Film de prezentare", "Рекламный ролик", "Promotional film"), "TO_OBTAIN", null, T("Brief în pașaportul de date", "Бриф — в паспорте сбора данных", "Brief in the data passport"), "marketing"),
    r("tour", "materials", T("Vizită 360°", "Осмотр 360°", "360° tour"), "TO_OBTAIN", null, T("3–5 puncte sferice + unul aerian", "3–5 сферических точек + одна с воздуха", "3–5 spherical points + one aerial"), "marketing"),
  ];
  return rows.map((x) => ({ ...x, ...(over[x.key as ReadinessKey] ?? {}) }));
}

// ---------------------------------------------------------------------------------------------------------------- deal structures
export function standardDeals(over: Partial<Record<DealStructure["key"], Partial<DealStructure>>> = {}): DealStructure[] {
  // order = MEGAPARC's general preference (R2 §4: Build-to-Suit and joint development first); the page also puts «primary» ones first
  const rows: DealStructure[] = [
    { key: "build-to-suit", enabled: true, agreed: false, priority: "individual", title: T("Build-to-Suit", "Build-to-Suit", "Build-to-Suit"), text: T("MEGAPARC construiește obiectul după cerințele unui chiriaș și i-l închiriază pe termen lung.", "MEGAPARC строит объект под требования конкретного арендатора и сдаёт его в долгосрочную аренду.", "MEGAPARC builds to a specific tenant's requirements and leases the building to it long term."), suits: T("Operatorilor cu cerințe clare", "Операторам с понятными требованиями", "Operators with clear requirements") },
    { key: "joint-development", enabled: true, agreed: false, priority: "individual", title: T("Dezvoltare comună", "Совместный девелопмент", "Joint development"), text: T("MEGAPARC aduce terenul, partenerul — capital sau competențele de dezvoltator; cotele și conducerea proiectului se convin.", "MEGAPARC вносит землю, партнёр — капитал или компетенции застройщика; доли и управление проектом согласуются.", "MEGAPARC contributes the land, the partner capital or developer expertise; shares and project governance are agreed."), suits: T("Dezvoltatorilor și investitorilor", "Девелоперам и инвесторам", "Developers and investors") },
    { key: "land-sale", enabled: true, agreed: false, priority: "individual", title: T("Vânzarea terenului", "Продажа земли", "Land sale"), text: T("Dezvoltatorul sau utilizatorul final cumpără terenul.", "Девелопер или конечный пользователь приобретает участок.", "A developer or an end user buys the site."), suits: T("Celor care construiesc singuri, pe conceptul propriu", "Тем, кто строит сам под свою концепцию", "Those who build on their own concept") },
    { key: "land-for-space", enabled: true, agreed: false, priority: "individual", title: T("Teren contra spații finalizate", "Земля в обмен на готовые площади", "Land for completed space"), text: T("Dezvoltatorul construiește, iar o parte din spațiile finalizate trece la MEGAPARC în locul plății pentru teren.", "Девелопер строит, а часть готовых площадей переходит MEGAPARC вместо оплаты земли.", "The developer builds, and part of the completed space passes to MEGAPARC instead of paying for the land."), suits: T("Dezvoltatorilor care economisesc capital la start", "Девелоперам, которые экономят капитал на старте", "Developers who save capital at the start") },
    { key: "ground-lease", enabled: true, agreed: false, priority: "individual", title: T("Locațiunea terenului pe termen lung", "Долгосрочная аренда земли", "Long-term ground lease"), text: T("Terenul se dă în locațiune pe termen lung; locatarul construiește și exploatează obiectul.", "Участок передаётся в долгосрочную аренду; арендатор строит и эксплуатирует объект.", "The site is let on a long-term ground lease; the lessee builds and operates the building."), suits: T("Operatorilor care nu vor să cumpere terenul", "Операторам, которые не хотят покупать землю", "Operators who do not want to buy the land") },
  ];
  return rows.map((d) => ({ ...d, ...(over[d.key] ?? {}) }));
}

// ---------------------------------------------------------------------------------------------------------------- developer pack
export function standardPack(over: Partial<Record<string, Partial<PackDocument>>> = {}): PackDocument[] {
  const rows: PackDocument[] = [
    { key: "offer", section: "offer", state: "preparing", file: null, owner: "commercial", label: T("Propunerea investițională", "Инвестиционное предложение", "Investment proposal") },
    { key: "passport", section: "passport", state: "ready", file: null, owner: "technical-director", label: T("Pașaportul terenului (cu statusurile verificării)", "Паспорт участка (со статусами проверки)", "Site passport (with the check statuses)") },
    { key: "cadastre", section: "cadastre", state: "ready", file: null, owner: "cadastral", label: T("Informații cadastrale publicate", "Опубликованные кадастровые сведения", "Published cadastral information") },
    { key: "boundary", section: "boundary", state: "preparing", file: null, owner: "cadastral", label: T("Planul limitelor", "План границ", "Boundary plan") },
    { key: "maps", section: "maps", state: "ready", file: null, owner: "marketing", label: T("Hărți de amplasare", "Карты расположения", "Location maps") },
    { key: "photos", section: "photos", state: "preparing", file: null, owner: "marketing", label: T("Fotografii", "Фотографии", "Photographs") },
    { key: "technical", section: "technical", state: "preparing", file: null, owner: "technical-director", label: T("Caracteristici tehnice și condiții de racordare", "Технические характеристики и условия подключения", "Technical characteristics and connection conditions") },
    { key: "market", section: "market", state: "ready", file: null, owner: "commercial", label: T("Rezultatele studiului de piață", "Результаты исследования рынка", "Market research results") },
    { key: "concepts", section: "concepts", state: "preparing", file: null, owner: "architect", label: T("Concepte de dezvoltare", "Концепции застройки", "Development concepts") },
    { key: "terms", section: "terms", state: "preparing", file: null, owner: "owner", label: T("Condiții comerciale", "Коммерческие условия", "Commercial terms") },
    { key: "contacts", section: "contacts", state: "ready", file: null, owner: "commercial", label: T("Contacte", "Контакты", "Contacts") },
  ];
  return rows.map((d) => ({ ...d, ...(over[d.key] ?? {}) }));
}

// ---------------------------------------------------------------------------------------------------------------- the asset
export type LandSiteInput = Omit<LandAsset, "media" | "layers" | "passport" | "readiness" | "deals" | "pack" | "explorer" | "distances" | "market" | "townGen"> & {
  context: SiteContext;
  distances: Distance[];
  market: { summary: L; indicators: MarketIndicator[]; record: string; checked: string };
  scenarios: DevelopmentScenario[];
  presets: ModelPreset[];
  overrides?: {
    media?: Parameters<typeof standardMedia>[1];
    layers?: Parameters<typeof standardLayers>[1];
    passport?: Parameters<typeof standardPassport>[1];
    readiness?: Parameters<typeof standardReadiness>[2];
    deals?: Parameters<typeof standardDeals>[0];
    pack?: Parameters<typeof standardPack>[0];
  };
};

/** one land asset from its facts + context + the rows it knows better than the defaults */
export function createLandAsset(input: LandSiteInput): LandAsset {
  const { context, overrides = {}, ...rest } = input;
  const deals = standardDeals(overrides.deals);
  return {
    ...rest,
    townGen: context.townGen,
    explorer: context.explorer,
    media: standardMedia(context, overrides.media),
    layers: standardLayers(context, overrides.layers),
    passport: standardPassport(context, overrides.passport),
    readiness: standardReadiness(context, { scenarios: input.scenarios.length, deals: deals.filter((d) => d.enabled).length }, overrides.readiness),
    deals,
    pack: standardPack(overrides.pack),
  };
}
