import { T } from "@/data/leasing-experience-model";
import { drochiaExplorer } from "@/data/land/drochia-explorer";
import { drochiaMarket } from "@/data/land/drochia-market";
import type { DevelopmentScenario, LandAsset, LocationLayer, MediaSlot, Param, ReadinessItem } from "@/data/land/model";
import { registeredData } from "@/data/registered";

/**
 * DROCHIA — the first dataset of the Land Asset Data Model v2 (OWNER STRATEGIC MANDATE «DROCHIA · DEVELOPMENT & INVESTMENT EXPERIENCE»,
 * 2026-11-23). The page reads only this configuration (src/components/land-experience/*); Hîncești, Orhei and Florilor 32/2 get their
 * own file of the same shape.
 *
 * Current published data (§4 — published, NOT a substitute for checking the cadastral documents): 20 000 m² · cadastral number
 * 3601104.441 · bd. Independenței 65, Drochia · frontage on two roads · concept under evaluation (OWNER tax records, LAND brief
 * 2026-11-10; OWNER data 2026-10-09). Everything else is a status: nothing about zoning, permitted use, POT, CUT, height, setbacks,
 * utilities or capacities is known — those rows are null with «необходимо получить». No photograph of the site exists yet: the media
 * slots are empty (never a foreign or generated image presented as the site). MEGAPARC's own figures (land value, internal study areas,
 * target returns) are never stored here.
 */

const NB = String.fromCharCode(160);
const TAX = "OWNER: налоговые записи (бриф LAND §3, 10.11.2026) — опубликованные данные";
const DATA = "OWNER data 2026-10-09 (src/data/demo-content.ts drochiaProfile — confirmed)";
const day = drochiaExplorer.fetched.split("-").reverse().join(".");
/** the public labels of the sources (the internal provenance stays in `provenance`, never rendered) */
const SRC = {
  tax: T("Date MEGAPARC (evidențe fiscale), publicate", "Данные MEGAPARC (налоговые записи), опубликованы", "MEGAPARC data (tax records), published"),
  data: T("Date MEGAPARC", "Данные MEGAPARC", "MEGAPARC data"),
  osm: T(`OpenStreetMap · ${day}`, `OpenStreetMap · ${day}`, `OpenStreetMap · ${day}`),
};
const reg = registeredData.drochia!;

const media: MediaSlot[] = [
  { key: "panorama", kind: "photo", src: null, label: T("Fotografia panoramică a terenului", "Панорамная фотография участка", "Panoramic photograph of the site"), brief: T("Cadru larg de la nivelul ochilor de pe bulevardul Independenței, lumină de zi, ambele fronturi vizibile.", "Широкий кадр с уровня глаз с бульвара Индепенденцей, дневной свет, видны оба выхода к дорогам.", "A wide eye-level frame from Independenței Boulevard in daylight, both road fronts visible.") },
  { key: "film", kind: "video", src: null, label: T("Film de prezentare", "Рекламный ролик", "Promotional film"), brief: T("15–30 s, dronă și sol: terenul, accesele, orașul în jur; fără sunet obligatoriu, 16 : 9 și 9 : 16.", "15–30 с, дрон и съёмка с земли: участок, подъезды, город вокруг; без обязательного звука, 16 : 9 и 9 : 16.", "15–30 s, drone and ground: the site, the access roads, the town around; no sound required, 16 : 9 and 9 : 16.") },
  { key: "tour360", kind: "pano", src: null, label: T("Vizită interactivă 360°", "Интерактивный осмотр 360°", "Interactive 360° tour"), brief: T("3–5 puncte sferice pe teren și unul aerian; legate de punctele de pe hartă.", "3–5 сферических точек на участке и одна с воздуха; привязаны к точкам на карте.", "3–5 spherical points on the site and one aerial, linked to the points on the map.") },
  { key: "aerial", kind: "photo", src: null, label: T("Fotografie aeriană", "Аэрофотосъёмка", "Aerial photograph"), brief: T("Vedere oblică și verticală la 80–120 m, după trasarea limitelor pe teren.", "Перспективный и вертикальный кадры с 80–120 м, после выноса границ на местности.", "Oblique and vertical frames from 80–120 m, after the boundary is staked out on the ground.") },
  { key: "orthophoto", kind: "photo", src: null, label: T("Ortofotoplan", "Ортофотоплан", "Orthophoto"), brief: T("Ortofotoplan geo-referențiat al terenului și al vecinătății (pentru stratul satelit).", "Геопривязанный ортофотоплан участка и окружения (для спутникового слоя).", "A georeferenced orthophoto of the site and its surroundings (for the satellite layer).") },
  { key: "plan", kind: "drawing", src: null, label: T("Planul cadastral cu limitele", "Кадастровый план с границами", "Cadastral plan with the boundary"), brief: T("Planul cadastral oficial sau coordonatele verificate ale limitelor.", "Официальный кадастровый план или проверенные координаты границ.", "The official cadastral plan or the verified boundary coordinates.") },
  { key: "masterplan", kind: "drawing", src: null, label: T("Plan general al conceptului", "Генеральный план концепции", "Concept masterplan"), brief: T("După verificarea urbanistică — de la arhitectul MEGAPARC.", "После градостроительной проверки — от архитектора MEGAPARC.", "After the planning check — from MEGAPARC's architect.") },
  { key: "renders", kind: "photo", src: null, label: T("Vizualizări arhitecturale și 3D", "Архитектурные визуализации и 3D", "Architectural visualisations and 3D"), brief: T("Doar pentru un concept aprobat; marcate ca vizualizări, niciodată ca fotografie.", "Только для утверждённой концепции; подписываются как визуализации, никогда как фотография.", "Only for an approved concept; always captioned as visualisations, never as a photograph.") },
];

const layers: LocationLayer[] = [
  { key: "site", state: "ready", source: T("Adresa geocodată (OpenStreetMap)", "Геокодированный адрес (OpenStreetMap)", "Geocoded address (OpenStreetMap)"), label: T("Amplasare", "Расположение", "Location"), title: T("Terenul în oraș", "Участок в городе", "The site in the town"), text: T(`Bd. Independenței 65 — la ≈${NB}${drochiaExplorer.town.distance}${NB}m în linie dreaptă de centrul orașului (OSM). Punctul este adresa geocodată, nu limita terenului.`, `Бул. Индепенденцей, 65 — около ${drochiaExplorer.town.distance}${NB}м по прямой от центра города (OSM). Точка — геокодированный адрес, не граница участка.`, `65 Independenței Blvd — about ${drochiaExplorer.town.distance}${NB}m in a straight line from the town centre (OSM). The point is the geocoded address, not the site boundary.`) },
  { key: "boundary", state: "pending", source: T("Se așteaptă planul cadastral sau coordonatele verificate", "Ожидается кадастровый план или проверенные координаты", "Awaiting the cadastral plan or verified coordinates"), label: T("Limite cadastrale", "Кадастровые границы", "Cadastral boundary"), title: T("Limitele — după planul oficial", "Границы — только по официальному плану", "The boundary — from the official plan only"), text: T("Limitele se trasează după planul cadastral oficial sau după coordonatele verificate. Până atunci nu desenăm nicio limită aproximativă.", "Границы наносятся по официальному кадастровому плану или проверенным координатам. До этого мы не рисуем приблизительных границ.", "The boundary is drawn from the official cadastral plan or verified coordinates. Until then we draw no approximate outline.") },
  { key: "access", state: "ready", source: T(`OpenStreetMap · ${day} · rutare OSRM (estimare)`, `OpenStreetMap · ${day} · маршрутизация OSRM (оценка)`, `OpenStreetMap · ${day} · OSRM routing (estimate)`), label: T("Acces și transport", "Подъезды и транспорт", "Access and transport"), title: T("Drumuri, gară, legături", "Дороги, станция, связи", "Roads, station, links"), text: T("Drumurile naționale și locale după numerotarea din OpenStreetMap, gara Drochia și distanțele rutiere estimate până la centrele economice.", "Национальные и местные дороги по нумерации OpenStreetMap, станция Дрокия и оценочные расстояния по дорогам до экономических центров.", "National and local roads by their OpenStreetMap numbering, Drochia station and estimated road distances to the economic centres.") },
  { key: "context", state: "ready", source: SRC.osm, label: T("Împrejurimi", "Окружение", "Surroundings"), title: T("Ce este în jurul terenului", "Что вокруг участка", "What surrounds the site"), text: T("Clădirile, străzile, zonele verzi și apa din jurul adresei — conform OpenStreetMap.", "Здания, улицы, зелёные зоны и вода вокруг адреса — по данным OpenStreetMap.", "Buildings, streets, green areas and water around the address — from OpenStreetMap.") },
  { key: "commerce", state: "ready", source: SRC.osm, label: T("Infrastructură comercială", "Коммерческая инфраструктура", "Commercial infrastructure"), title: T("Comerț și servicii în oraș", "Торговля и услуги в городе", "Retail and services in the town"), text: T("Supermarketuri, piața, magazine de bricolaj și electronice, stații de carburant, bănci și farmacii — punctele din OpenStreetMap, distanțe în linie dreaptă.", "Супермаркеты, рынок, магазины стройматериалов и электроники, АЗС, банки и аптеки — точки OpenStreetMap, расстояния по прямой.", "Supermarkets, the market, DIY and electronics stores, fuel stations, banks and pharmacies — OpenStreetMap points, straight-line distances.") },
  { key: "residential", state: "ready", source: T(`OpenStreetMap · ${day} · Recensământul 2024 (BNS)`, `OpenStreetMap · ${day} · Перепись населения 2024 (НБС)`, `OpenStreetMap · ${day} · 2024 Census (NBS)`), label: T("Zone rezidențiale și populație", "Жилые районы и население", "Residential areas and population"), title: T("Unde locuiesc oamenii", "Где живут люди", "Where people live"), text: T("Zonele rezidențiale, școlile și grădinițele (OSM) și populația orașului și a raionului după datele oficiale.", "Жилые зоны, школы и детские сады (OSM) и население города и района по официальным данным.", "Residential zones, schools and kindergartens (OSM) and the population of the town and the district from official data.") },
  { key: "utilities", state: "ready", source: T(`OpenStreetMap · ${day} — un reper, nu condiții tehnice`, `OpenStreetMap · ${day} — ориентир, не технические условия`, `OpenStreetMap · ${day} — a reference, not technical conditions`), label: T("Rețele inginerești", "Инженерные сети", "Utility networks"), title: T("Rețelele vizibile pe hartă", "Сети, видимые на карте", "Networks visible on the map"), text: T("Liniile electrice, posturile de transformare și obiectele de apă din OpenStreetMap — un reper, nu condiții tehnice. Capacitățile de racordare se verifică la operatori.", "ЛЭП, подстанции и объекты водоснабжения из OpenStreetMap — ориентир, а не технические условия. Мощности подключения проверяются у операторов сетей.", "Power lines, substations and water facilities from OpenStreetMap — a reference, not technical conditions. Connection capacities are verified with the network operators.") },
  { key: "potential", state: "ready", source: SRC.osm, label: T("Posibilități de dezvoltare", "Возможности развития", "Development potential"), title: T("Unde se concentrează funcțiile comerciale și de producție", "Где в городе торговля и производство", "Where trade and production concentrate"), text: T("Zonele de producție și comerț ale orașului și drumurile principale — contextul scenariilor. Nu este un regulament urbanistic: destinația permisă a terenului se verifică.", "Производственные и торговые зоны города и главные дороги — контекст сценариев. Это не градостроительный регламент: разрешённое использование участка проверяется.", "The town's production and trade zones and the main roads — the context of the scenarios. Not a planning regulation: the site's permitted use is being verified.") },
];

const lawyer = "lawyer" as const, cadastral = "cadastral" as const, surveyor = "surveyor" as const, geologist = "geologist" as const, architect = "architect" as const, utilities = "utilities" as const;
const extract = T("Extras din Registrul bunurilor imobile", "Выписка из Реестра недвижимого имущества", "Extract from the Real Estate Register");
const cadPlan = T("Planul cadastral", "Кадастровый план", "Cadastral plan");
const urban = T("Certificat de urbanism informativ · PUG Drochia", "Градостроительный сертификат (информативный) · PUG Дрокии", "Informative planning certificate · Drochia general urban plan");
const tu = T("Condiții tehnice ale operatorului rețelei", "Технические условия оператора сети", "Technical conditions of the network operator");
const toObtain = (key: string, group: Param["group"], label: ReturnType<typeof T>, owner: Param["owner"], document: ReturnType<typeof T>, note?: ReturnType<typeof T>): Param => ({ key, group, label, value: null, status: "TO_OBTAIN", source: null, checked: null, owner, document, note, public: true });

const passport: Param[] = [
  { key: "area", group: "land", label: T("Suprafața cadastrală", "Кадастровая площадь", "Cadastral area"), value: { n: reg.area, unit: "m2" }, status: "VERIFYING", source: SRC.tax, provenance: TAX, checked: "2026-11-10", owner: cadastral, document: extract, public: true },
  toObtain("designation", "land", T("Destinația terenului", "Назначение земли", "Land category"), cadastral, extract),
  { key: "ownership", group: "land", label: T("Dreptul de proprietate", "Право собственности", "Ownership"), value: { text: T("MEGAPARC", "MEGAPARC", "MEGAPARC") }, status: "VERIFYING", source: SRC.data, provenance: DATA, checked: "2026-10-09", owner: lawyer, document: extract, public: true },
  toObtain("encumbrances", "land", T("Grevări (ipotecă, sechestru, locațiune)", "Обременения (ипотека, арест, аренда)", "Encumbrances (mortgage, attachment, lease)"), lawyer, extract),
  toObtain("servitudes", "land", T("Servituți", "Сервитуты", "Easements"), lawyer, T("Extras din Registru · planul cadastral", "Выписка из Реестра · кадастровый план", "Register extract · cadastral plan")),
  toObtain("geometry", "geometry", T("Geometria terenului", "Геометрия участка", "Site geometry"), cadastral, cadPlan),
  toObtain("dimensions", "geometry", T("Dimensiunile terenului", "Размеры участка", "Site dimensions"), cadastral, cadPlan),
  { key: "frontage", group: "geometry", label: T("Front la drum", "Фасад вдоль дороги", "Road frontage"), value: { text: T("Două fronturi stradale; lungimea — după plan", "Выход на две дороги; длина фронта — по плану", "Frontage on two roads; the length — from the plan") }, status: "VERIFYING", source: SRC.data, provenance: DATA, checked: "2026-10-09", owner: cadastral, document: cadPlan, public: true },
  toObtain("relief", "geometry", T("Relief", "Рельеф", "Topography"), surveyor, T("Ridicare topografică", "Топографическая съёмка", "Topographic survey")),
  toObtain("geology", "geometry", T("Geologie", "Геология", "Geology"), geologist, T("Studiu geotehnic", "Инженерно-геологические изыскания", "Geotechnical study")),
  toObtain("structures", "geometry", T("Construcții existente", "Существующие постройки", "Existing structures"), cadastral, T("Extras din Registru · inspecție pe teren", "Выписка из Реестра · осмотр участка", "Register extract · site inspection")),
  toObtain("pot", "planning", T("POT · procentul de ocupare a terenului", "POT · процент застройки участка", "POT · site coverage ratio"), architect, urban),
  toObtain("cut", "planning", T("CUT · coeficientul de utilizare a terenului", "CUT · коэффициент использования участка", "CUT · floor area ratio"), architect, urban),
  toObtain("height", "planning", T("Regimul de înălțime", "Допустимая высотность", "Height limit"), architect, urban),
  toObtain("setbacks", "planning", T("Retrageri", "Отступы", "Setbacks"), architect, urban),
  toObtain("parking", "planning", T("Cerințe de parcare", "Требования к парковке", "Parking requirements"), architect, urban),
  toObtain("entries", "planning", T("Accese și ieșiri", "Въезды и выезды", "Entries and exits"), architect, T("Avizul administratorului drumului", "Согласование владельца дороги", "Approval of the road authority")),
  toObtain("power", "utilities", T("Electricitate", "Электричество", "Electricity"), utilities, tu, T("Liniile vizibile pe harta OSM nu confirmă posibilitatea de racordare.", "ЛЭП на карте OSM не подтверждают возможность подключения.", "Power lines on the OSM map do not confirm a connection.")),
  toObtain("water", "utilities", T("Apă", "Вода", "Water"), utilities, tu),
  toObtain("sewer", "utilities", T("Canalizare", "Канализация", "Sewerage"), utilities, tu),
  toObtain("gas", "utilities", T("Gaz", "Газ", "Gas"), utilities, tu),
  toObtain("storm", "utilities", T("Canalizare pluvială", "Ливневая канализация", "Stormwater"), utilities, tu),
  toObtain("telecom", "utilities", T("Telecomunicații", "Связь", "Telecom"), utilities, tu),
];

const r = (key: string, category: ReadinessItem["category"], label: ReturnType<typeof T>, status: ReadinessItem["status"], evidence: ReturnType<typeof T> | null, next: ReturnType<typeof T>, owner: ReadinessItem["owner"], checked: string | null = null): ReadinessItem => ({ key, category, label, status, evidence, next, owner, checked, public: true });

const readiness: ReadinessItem[] = [
  r("acquisition", "title", T("Achiziția terenului", "Приобретение участка", "Acquisition of the site"), "NOT_APPLICABLE", T("Terenul este deja proprietatea MEGAPARC", "Участок уже в собственности MEGAPARC", "The site is already owned by MEGAPARC"), T("—", "—", "—"), "owner"),
  r("extract", "title", T("Extras din Registrul bunurilor imobile", "Выписка из Реестра недвижимого имущества", "Real Estate Register extract"), "VERIFYING", T(`Număr, suprafață și proprietar din evidențele fiscale MEGAPARC: 3601104.441 · 20${NB}000 m²`, `Номер, площадь и собственник из налоговых записей MEGAPARC: 3601104.441 · 20${NB}000 м²`, `Number, area and owner from MEGAPARC's tax records: 3601104.441 · 20,000 m²`), T("Atașăm extrasul actual din Registru", "Приложить актуальную выписку из Реестра", "Attach the current Register extract"), "lawyer", "2026-11-10"),
  r("plan", "title", T("Planul cadastral", "Кадастровый план", "Cadastral plan"), "TO_OBTAIN", null, T("Obținerea planului de la ASP / inginerul cadastral", "Получить план в ASP / у кадастрового инженера", "Obtain the plan from ASP / a cadastral engineer"), "cadastral"),
  r("coords", "title", T("Coordonatele limitelor", "Координаты границ", "Boundary coordinates"), "TO_OBTAIN", null, T("Coordonatele verificate — apoi limita pe hartă", "Проверенные координаты — затем граница на карте", "Verified coordinates — then the boundary on the map"), "cadastral"),
  r("burdens", "title", T("Grevări și servituți", "Обременения и сервитуты", "Encumbrances and easements"), "TO_OBTAIN", null, T("Verificare juridică după extras", "Юридическая проверка по выписке", "Legal check against the extract"), "lawyer"),
  r("pug", "planning", T("PUG și zonificarea", "PUG и зонирование", "General urban plan and zoning"), "TO_OBTAIN", null, T("Solicitarea extrasului din PUG Drochia la primărie", "Запросить выкопировку из PUG Дрокии в примэрии", "Request the general-plan extract from the Drochia town hall"), "architect"),
  r("certificate", "planning", T("Certificat de urbanism informativ", "Градостроительный сертификат (информативный)", "Informative planning certificate"), "TO_OBTAIN", null, T("Depunerea cererii la primăria Drochia", "Подать заявку в примэрию Дрокии", "Apply to the Drochia town hall"), "architect"),
  r("use", "planning", T("Destinația permisă", "Разрешённое использование", "Permitted use"), "TO_OBTAIN", null, T("Rezultă din certificat și PUG", "Следует из сертификата и PUG", "Follows from the certificate and the general plan"), "architect"),
  r("parameters", "planning", T("POT · CUT · înălțime · retrageri", "POT · CUT · высотность · отступы", "POT · CUT · height · setbacks"), "TO_OBTAIN", null, T("Din certificat; apoi capacitatea reală a terenului", "Из сертификата; затем реальная ёмкость участка", "From the certificate; then the site's real capacity"), "architect"),
  r("road", "planning", T("Accese de la drum", "Подъезды с дороги", "Road access"), "TO_OBTAIN", T("Două fronturi stradale (date MEGAPARC); în OSM o parte a bulevardului are restricție pentru camioane", "Выход на две дороги (данные MEGAPARC); в OSM часть бульвара отмечена ограничением для грузовиков", "Frontage on two roads (MEGAPARC data); in OSM part of the boulevard carries a truck restriction"), T("Schema acceselor, restricțiile de tonaj și avizul administratorului drumului", "Схема подъездов, ограничения тоннажа и согласование с владельцем дороги", "The access scheme, weight restrictions and the road authority's approval"), "technical-director"),
  r("topo", "technical", T("Ridicare topografică", "Топографическая съёмка", "Topographic survey"), "TO_OBTAIN", null, T("Comandarea ridicării topografice", "Заказать топосъёмку", "Commission the survey"), "surveyor"),
  r("geotech", "technical", T("Studiu geotehnic", "Инженерно-геологические изыскания", "Geotechnical study"), "TO_OBTAIN", null, T("Foraje și raport geotehnic", "Скважины и геологический отчёт", "Boreholes and a geotechnical report"), "geologist"),
  r("tu-power", "technical", T("Condiții tehnice · electricitate", "Технические условия · электричество", "Technical conditions · electricity"), "TO_OBTAIN", null, T("Cererea către operatorul de distribuție, cu puterea scenariului", "Запрос оператору распределения с мощностью сценария", "Request to the distribution operator with the scenario's load"), "utilities"),
  r("tu-water", "technical", T("Condiții tehnice · apă și canalizare", "Технические условия · вода и канализация", "Technical conditions · water and sewerage"), "TO_OBTAIN", null, T("Cererea către operatorul local de apă", "Запрос местному водоканалу", "Request to the local water operator"), "utilities"),
  r("tu-gas", "technical", T("Condiții tehnice · gaz", "Технические условия · газ", "Technical conditions · gas"), "TO_OBTAIN", null, T("Doar dacă scenariul are nevoie de gaz", "Только если сценарию нужен газ", "Only if the scenario needs gas"), "utilities"),
  r("tu-storm", "technical", T("Ape pluviale și telecomunicații", "Ливнёвка и связь", "Stormwater and telecom"), "TO_OBTAIN", null, T("Soluția de colectare și racordurile de comunicații", "Решение по отводу стоков и подключение связи", "The drainage solution and the telecom connections"), "utilities"),
  r("environment", "technical", T("Restricții de mediu", "Экологические ограничения", "Environmental constraints"), "TO_OBTAIN", null, T("Verificarea zonelor de protecție și a cerințelor de mediu", "Проверить охранные зоны и экологические требования", "Check protection zones and environmental requirements"), "technical-director"),
  r("market", "commercial", T("Studiul pieței locației", "Исследование рынка локации", "Location market research"), "VERIFYING", T("Studiu de birou din 23.11.2026, cu surse și grad de încredere", "Кабинетное исследование от 23.11.2026 с источниками и достоверностью", "Desk research of 23.11.2026, with sources and confidence"), T("Validare pe teren: oferte, chiriași, operatori", "Проверка на месте: предложения, арендаторы, операторы", "Field validation: offers, tenants, operators"), "commercial", "2026-11-23"),
  r("maps", "materials", T("Hărți de amplasare", "Карты расположения", "Location maps"), "DOCUMENTED", T(`Straturi OpenStreetMap din ${drochiaExplorer.fetched}`, `Слои OpenStreetMap от ${drochiaExplorer.fetched.split("-").reverse().join(".")}`, `OpenStreetMap layers of ${drochiaExplorer.fetched}`), T("Actualizare la fiecare verificare", "Обновлять при каждой проверке", "Refresh at every check"), "marketing", drochiaExplorer.fetched),
  r("concept", "commercial", T("Conceptul de dezvoltare", "Концепция развития", "Development concept"), "TO_OBTAIN", T("Patru scenarii pentru evaluarea inițială", "Четыре сценария для первичной оценки", "Four scenarios for initial evaluation"), T("După certificat și condițiile tehnice", "После сертификата и технических условий", "After the certificate and the technical conditions"), "architect"),
  r("model", "commercial", T("Model financiar pe un scenariu concret", "Финансовая модель конкретного сценария", "Financial model of a specific scenario"), "TO_OBTAIN", T("Instrumentul de pe pagină — pe ipotezele vizitatorului", "Инструмент на странице — на допущениях посетителя", "The tool on this page — on the visitor's assumptions"), T("Se elaborează cu partenerul, după concept", "Строится с партнёром после концепции", "Built with the partner after the concept"), "finance"),
  r("deal", "commercial", T("Structura tranzacției", "Структура сделки", "Deal structure"), "TO_OBTAIN", T("Cinci formate posibile, niciunul convenit", "Пять возможных форматов, ни один не согласован", "Five possible formats, none agreed"), T("Decizia MEGAPARC privind formatele admise", "Решение MEGAPARC о допустимых форматах", "MEGAPARC's decision on the admissible formats"), "owner"),
  r("photos", "materials", T("Fotografii ale terenului", "Фотографии участка", "Site photographs"), "TO_OBTAIN", null, T("Filmare de zi, ambele fronturi", "Дневная съёмка, оба выхода к дорогам", "A daylight shoot, both road fronts"), "marketing"),
  r("aerial", "materials", T("Fotografie aeriană și panoramă", "Аэросъёмка и панорама", "Aerial photograph and panorama"), "TO_OBTAIN", null, T("După trasarea limitelor pe teren", "После выноса границ на местности", "After the boundary is staked out"), "marketing"),
  r("film", "materials", T("Film de prezentare", "Рекламный ролик", "Promotional film"), "TO_OBTAIN", null, T("Brief în pașaportul de date", "Бриф — в паспорте сбора данных", "Brief in the data passport"), "marketing"),
  r("tour", "materials", T("Vizită 360°", "Осмотр 360°", "360° tour"), "TO_OBTAIN", null, T("3–5 puncte sferice + unul aerian", "3–5 сферических точек + одна с воздуха", "3–5 spherical points + one aerial"), "marketing"),
];

const scenarios: DevelopmentScenario[] = [
  {
    key: "retail-park", model: "hold", preset: "retail", visual: null,
    title: T("Parc comercial", "Торговый комплекс · Retail Park", "Retail park"),
    line: T("Mai mulți chiriași în jurul unei parcări comune.", "Несколько арендаторов вокруг общей парковки.", "Several tenants around a shared car park."),
    audience: [T("Locuitorii orașului și ai raionului", "Жители города и района", "Residents of the town and the district"), T("Rețele de alimentare, bricolaj, electronice, farmacii", "Сети: продукты, стройматериалы, электроника, аптеки", "Chains: food, DIY, electronics, pharmacies"), T("Servicii locale", "Местные услуги", "Local services")],
    logic: T("Un chiriaș-ancoră aduce fluxul, formatele mici îl folosesc. Venitul — din chiria pe termen lung.", "Якорный арендатор формирует поток, малые форматы его используют. Доход — долгосрочная аренда.", "An anchor tenant brings the flow, smaller formats use it. The income — long-term rent."),
    siteNeeds: [T("Vizibilitate de la drum", "Видимость с дороги", "Visibility from the road"), T("Acces comod pentru autoturisme", "Удобный въезд для легковых машин", "Easy car access"), T("Parcare la sol", "Наземная парковка", "Surface parking"), T("Zonă de descărcare pentru ancoră", "Зона разгрузки для якоря", "A loading area for the anchor")],
    access: T("Cele două fronturi permit separarea cumpărătorilor de accesul de marfă — schema se verifică.", "Два выхода к дорогам позволяют развести покупателей и грузовой подъезд — схема проверяется.", "The two road fronts allow shoppers and deliveries to be separated — the scheme is being verified."),
    utilities: [T("Electricitate pentru suprafețe comerciale și frig", "Электричество под торговлю и холодильное оборудование", "Power for retail and refrigeration"), T("Apă și canalizare", "Вода и канализация", "Water and sewerage"), T("Canalizare pluvială pentru parcare", "Ливнёвка для парковки", "Stormwater drainage for the car park")],
    checks: [T("Destinația permisă", "Разрешённое использование", "Permitted use"), T("POT, CUT, cerințele de parcare", "POT, CUT, требования к парковке", "POT, CUT, parking requirements"), T("Accesele și avizul drumului", "Подъезды и согласование дороги", "Access and the road approval"), T("Interesul chiriașilor-ancoră", "Интерес якорных арендаторов", "Anchor tenants' interest")],
    risks: [T("Dependența de chiriașul-ancoră", "Зависимость от якорного арендатора", "Dependence on the anchor tenant"), T("Concurența magazinelor existente", "Конкуренция действующих магазинов", "Competition from existing stores"), T("Durata ocupării", "Срок заполнения", "Time to lease up")],
  },
  {
    key: "logistics", model: "bts", preset: "warehouse", visual: null,
    title: T("Logistică și depozitare", "Логистический или складской комплекс", "Logistics or warehouse"),
    line: T("Spațiu de depozitare pentru un operator concret sau pentru închiriere.", "Склад под конкретного оператора или в аренду.", "A warehouse for a specific operator or to lease."),
    audience: [T("Distribuitori pentru nordul Moldovei", "Дистрибьюторы на север Молдовы", "Distributors serving northern Moldova"), T("Sectorul agricol — păstrare", "Агросектор — хранение", "Agriculture — storage"), T("Curierat și comerț online", "Курьерские службы и онлайн-торговля", "Couriers and online retail"), T("Producători", "Производители", "Manufacturers")],
    logic: T("Clădire de depozitare cu înălțime mare și rampe; build-to-suit pentru un operator sau închiriere în module.", "Склад с высокими потолками и доками; build-to-suit под оператора или аренда модулями.", "A high-bay warehouse with docks; build-to-suit for an operator or leased in modules."),
    siteNeeds: [T("Acces și întoarcere pentru camioane", "Подъезд и разворот фур", "Truck access and turning"), T("Platformă de manevră", "Площадка для манёвров", "A manoeuvring yard"), T("Relief plan, sol portant", "Ровный рельеф, несущий грунт", "Flat ground, bearing soil")],
    access: T("Legătura cu drumurile naționale și cu gara Drochia — distanțele în studiul locației.", "Связь с национальными дорогами и станцией Дрокия — расстояния в исследовании локации.", "Links to the national roads and Drochia station — distances in the location research."),
    utilities: [T("Electricitate pentru iluminat, echipamente, frig la nevoie", "Электричество: освещение, оборудование, холод при необходимости", "Power: lighting, equipment, refrigeration if needed"), T("Apă pentru stingerea incendiilor", "Пожарное водоснабжение", "Fire-fighting water"), T("Canalizare pluvială", "Ливнёвка", "Stormwater drainage")],
    checks: [T("Restricția pentru camioane pe bulevard (marcată în OSM) — se verifică", "Ограничение для грузовиков на бульваре (отмечено в OSM) — проверяется", "The truck restriction on the boulevard (tagged in OSM) — being verified"), T("Admisibilitatea funcției de depozitare lângă locuințe", "Допустимость склада рядом с жильём", "Whether storage is admissible near housing"), T("Traficul de camioane și zgomotul", "Грузовое движение и шум", "Truck traffic and noise"), T("Sarcina pe drumuri", "Нагрузка на дороги", "Road loads"), T("Geologia pentru pardoseli", "Геология под полы", "Geology for the floor slabs")],
    risks: [T("Cererea regională — de confirmat", "Региональный спрос — требует подтверждения", "Regional demand — to be confirmed"), T("Căutarea îndelungată a chiriașului fără BTS", "Долгий поиск арендатора без BTS", "A long search for a tenant without BTS"), T("Cerințele de securitate la incendiu", "Требования пожарной безопасности", "Fire-safety requirements")],
  },
  {
    key: "production", model: "hold", preset: "production", visual: null,
    title: T("Format de producție și comerț", "Производственно-коммерческий формат", "Production and trade"),
    line: T("Module flexibile: producție plus showroom sau birou.", "Гибкие блоки: производство плюс шоурум или офис.", "Flexible units: production plus a showroom or office."),
    audience: [T("Producători locali — alimentar, materiale de construcții, ateliere", "Местные производители — пищевые, стройматериалы, мастерские", "Local producers — food, building materials, workshops"), T("Companii de servicii", "Сервисные компании", "Service companies")],
    logic: T("Blocuri modulare de închiriat firmelor mici și mijlocii; fiecare chiriaș — producție și front comercial.", "Модульные блоки в аренду малому и среднему бизнесу: у каждого — производство и коммерческий фронт.", "Modular units leased to small and mid-size firms: each with production and a commercial front."),
    siteNeeds: [T("Grilă modulară", "Модульная сетка", "A modular grid"), T("Accese separate", "Раздельные въезды", "Separate entries"), T("Platforme deschise", "Открытые площадки", "Open yards")],
    access: T("Accesul de marfă și cel al clienților separate.", "Грузовой и клиентский подъезды разведены.", "Freight and customer access kept apart."),
    utilities: [T("Putere electrică sporită", "Повышенная электрическая мощность", "Higher electrical capacity"), T("Apă și canalizare", "Вода и канализация", "Water and sewerage"), T("Gaz — dacă procesul o cere", "Газ — если этого требует процесс", "Gas — if the process requires it")],
    checks: [T("Cerințe de mediu și sanitare", "Экологические и санитарные требования", "Environmental and sanitary requirements"), T("Zone de protecție sanitară", "Санитарно-защитные зоны", "Sanitary protection zones"), T("Capacitatea rețelelor", "Мощности сетей", "Network capacities")],
    risks: [T("Capacitatea rețelelor", "Мощности сетей", "Network capacities"), T("Specificul chiriașilor", "Специфика арендаторов", "Tenant specifics"), T("Ocupare mai lentă", "Более длинное заполнение", "A slower lease-up")],
  },
  {
    key: "mixed", model: "sale", preset: "mixed", visual: null,
    title: T("Complex comercial mixt", "Смешанный коммерческий комплекс", "Mixed commercial complex"),
    line: T("Comerț spre drum, depozitare și producție în spate.", "Торговля по фронту дороги, склад и производство в глубине.", "Retail along the road, storage and production at the rear."),
    audience: [T("Comerț și servicii", "Торговля и услуги", "Retail and services"), T("Depozitare mică", "Небольшие склады", "Small storage"), T("Cumpărători de spații comerciale", "Покупатели коммерческих помещений", "Buyers of commercial premises")],
    logic: T("Realizare pe etape; o parte a spațiilor se poate vinde, o parte se poate închiria.", "Поэтапная реализация: часть помещений можно продать, часть — сдать в аренду.", "Phased delivery: part of the premises can be sold, part leased."),
    siteNeeds: [T("Configurația terenului", "Конфигурация участка", "Site configuration"), T("Separarea fluxurilor", "Разделение потоков", "Separated flows"), T("Etapizare", "Этапность", "Phasing")],
    access: T("Frontul spre drum pentru comerț, accesul de serviciu din al doilea drum — se verifică.", "Фронт дороги — для торговли, служебный подъезд со второй дороги — проверяется.", "The road front for retail, the service access from the second road — being verified."),
    utilities: [T("Rețele pentru funcții diferite", "Сети под разные функции", "Networks for different uses"), T("Contorizare separată", "Раздельный учёт", "Separate metering")],
    checks: [T("Regimul urbanistic pentru funcțiuni mixte", "Градостроительный режим для смешанных функций", "The planning regime for mixed uses"), T("Configurația și accesele", "Конфигурация и подъезды", "Configuration and access"), T("Cererea pentru vânzare", "Спрос на продажу", "Demand for sale")],
    risks: [T("Complexitatea conceptului", "Сложность концепции", "A complex concept"), T("Ritmuri diferite de vânzare și ocupare", "Разные сроки продажи и заполнения", "Different sale and lease-up timing")],
  },
];

export const drochiaAsset: LandAsset = {
  id: "land-drochia",
  slug: "drochia",
  name: "Drochia",
  kind: "land",
  updated: "2026-11-23",
  geo: { lat: drochiaExplorer.site.lat, lon: drochiaExplorer.site.lon, point: T("Punctul — adresa geocodată (OpenStreetMap)", "Точка — геокодированный адрес (OpenStreetMap)", "The point — the geocoded address (OpenStreetMap)"), boundary: null },
  place: T("Drochia", "Дрокия", "Drochia"),
  address: T("Bd. Independenței 65, Drochia", "Бул. Индепенденцей, 65, Дрокия", "65 Independenței Blvd, Drochia"),
  parcels: reg.premises.map((p) => ({ number: p.cadastral, area: p.area })),
  area: reg.area,
  status: T("Conceptul este în evaluare", "Концепция на стадии оценки", "Concept under evaluation"),
  hero: {
    kicker: T("Teren · Drochia", "Земля · Дрокия", "Land · Drochia"),
    positioning: T("Teren cu potențial de dezvoltare", "Земельный участок с потенциалом девелопмента", "A land plot with development potential"),
    statement: T("Nu doar un teren. O oportunitate de dezvoltare.", "Не просто участок. Возможность для девелопмента.", "Not just land. A development opportunity."),
    lead: T(
      `2${NB}ha pe bulevardul Independenței — teren propriu MEGAPARC, cu ieșire la două drumuri. Aici sunt datele terenului, studiul locației, scenariile de dezvoltare și modelul investițional — ca decizia să se ia mai repede.`,
      `2${NB}га на бульваре Индепенденцей — собственная земля MEGAPARC с выходом на две дороги. Здесь собраны данные участка, исследование локации, сценарии развития и инвестиционная модель — чтобы решение принималось быстрее.`,
      `2${NB}ha on Independenței Boulevard — MEGAPARC's own land with frontage on two roads. The site data, the location research, the development scenarios and the investment model are here — so the decision can be made faster.`,
    ),
    published: T("Date publicate MEGAPARC; nu înlocuiesc verificarea documentelor cadastrale.", "Опубликованные данные MEGAPARC; они не заменяют проверку кадастровых документов.", "MEGAPARC's published data; they do not replace checking the cadastral documents."),
  },
  media,
  facts: [
    { key: "area", label: T("Suprafață", "Площадь", "Area"), value: T(`20${NB}000 m²`, `20${NB}000 м²`, "20,000 m²"), status: "VERIFYING", provenance: TAX },
    { key: "cadastre", label: T("Număr cadastral", "Кадастровый номер", "Cadastral number"), value: T("3601104.441", "3601104.441", "3601104.441"), status: "VERIFYING", provenance: TAX },
    { key: "address", label: T("Adresă", "Адрес", "Address"), value: T("Bd. Independenței 65, Drochia", "Бул. Индепенденцей, 65, Дрокия", "65 Independenței Blvd, Drochia"), status: "VERIFYING", provenance: TAX },
    { key: "roads", label: T("Acces", "Выход к дорогам", "Road access"), value: T("Două drumuri", "Две дороги", "Two roads"), status: "VERIFYING", provenance: DATA },
    { key: "concept", label: T("Concept", "Концепция развития", "Concept"), value: T("În evaluare", "На стадии оценки", "Under evaluation"), status: "VERIFYING", provenance: DATA },
  ],
  layers,
  explorer: drochiaExplorer,
  distances: drochiaMarket.distances,
  market: drochiaMarket.market,
  scenarios,
  passport,
  readiness,
  presets: [
    { key: "retail", model: "hold", label: T("Parc comercial · închiriere", "Торговый комплекс · аренда", "Retail park · lease"), values: { coverage: 30, floors: 1, efficiency: 92, hard: 550, design: 7, networks: 250000, landscaping: 300000, permits: 40000, contingency: 7, preMonths: 9, buildMonths: 12, rent: 9, occupancy: 90, leaseUp: 12, opex: 8, indexation: 2, holdYears: 10, exitYield: 10, exitCosts: 2, ltc: 50, interest: 9, tax: 12, discount: 11 } },
    { key: "warehouse", model: "bts", label: T("Spațiu de depozitare · build-to-suit", "Склад · build-to-suit", "Warehouse · build-to-suit"), values: { coverage: 40, floors: 1, efficiency: 95, hard: 420, design: 6, networks: 200000, landscaping: 150000, permits: 30000, contingency: 6, preMonths: 6, buildMonths: 10, leaseYears: 10, indexation: 2, target: 10, opex: 3, exitYield: 10, exitCosts: 2, breakYear: 5, voidMonths: 9, reletPct: 85, breakFee: 6, ltc: 50, interest: 9, tax: 12, discount: 10 } },
    { key: "production", model: "hold", label: T("Producție și comerț · închiriere", "Производство и торговля · аренда", "Production and trade · lease"), values: { coverage: 35, floors: 1, efficiency: 90, hard: 480, design: 7, networks: 300000, landscaping: 150000, permits: 30000, contingency: 7, preMonths: 8, buildMonths: 12, rent: 6, occupancy: 85, leaseUp: 18, opex: 8, indexation: 2, holdYears: 10, exitYield: 11, exitCosts: 2, ltc: 50, interest: 9, tax: 12, discount: 12 } },
    { key: "mixed", model: "sale", label: T("Complex mixt · vânzare", "Смешанный комплекс · продажа", "Mixed complex · sale"), values: { coverage: 30, floors: 2, efficiency: 85, hard: 600, design: 8, networks: 250000, landscaping: 200000, permits: 40000, contingency: 7, preMonths: 9, buildMonths: 15, price: 1000, salesMonths: 18, commission: 3, ltc: 50, interest: 9, tax: 12, discount: 12 } },
  ],
  deals: [
    { key: "land-sale", enabled: true, agreed: false, title: T("Vânzarea terenului", "Продажа земли", "Land sale"), text: T("Dezvoltatorul sau utilizatorul final cumpără terenul.", "Девелопер или конечный пользователь приобретает участок.", "A developer or an end user buys the site."), suits: T("Celor care construiesc singuri, pe conceptul propriu", "Тем, кто строит сам под свою концепцию", "Those who build on their own concept") },
    { key: "joint-development", enabled: true, agreed: false, title: T("Dezvoltare comună", "Совместный девелопмент", "Joint development"), text: T("MEGAPARC aduce terenul, partenerul — capital sau competențele de dezvoltator; cotele și conducerea proiectului se convin.", "MEGAPARC вносит землю, партнёр — капитал или компетенции застройщика; доли и управление проектом согласуются.", "MEGAPARC contributes the land, the partner capital or developer expertise; shares and project governance are agreed."), suits: T("Dezvoltatorilor și investitorilor", "Девелоперам и инвесторам", "Developers and investors") },
    { key: "build-to-suit", enabled: true, agreed: false, title: T("Build-to-Suit", "Build-to-Suit", "Build-to-Suit"), text: T("MEGAPARC construiește obiectul după cerințele unui chiriaș și i-l închiriază pe termen lung.", "MEGAPARC строит объект под требования конкретного арендатора и сдаёт его в долгосрочную аренду.", "MEGAPARC builds to a specific tenant's requirements and leases the building to it long term."), suits: T("Operatorilor cu cerințe clare", "Операторам с понятными требованиями", "Operators with clear requirements") },
    { key: "land-for-space", enabled: true, agreed: false, title: T("Teren contra spații finalizate", "Земля в обмен на готовые площади", "Land for completed space"), text: T("Dezvoltatorul construiește, iar o parte din spațiile finalizate trece la MEGAPARC în locul plății pentru teren.", "Девелопер строит, а часть готовых площадей переходит MEGAPARC вместо оплаты земли.", "The developer builds, and part of the completed space passes to MEGAPARC instead of paying for the land."), suits: T("Dezvoltatorilor care economisesc capital la start", "Девелоперам, которые экономят капитал на старте", "Developers who save capital at the start") },
    { key: "ground-lease", enabled: true, agreed: false, title: T("Locațiunea terenului pe termen lung", "Долгосрочная аренда земли", "Long-term ground lease"), text: T("Terenul se dă în locațiune pe termen lung; locatarul construiește și exploatează obiectul.", "Участок передаётся в долгосрочную аренду; арендатор строит и эксплуатирует объект.", "The site is let on a long-term ground lease; the lessee builds and operates the building."), suits: T("Operatorilor care nu vor să cumpere terenul", "Операторам, которые не хотят покупать землю", "Operators who do not want to buy the land") },
  ],
  pack: [
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
  ],
  approvals: { experience: false, explorer: false, market: false, scenarios: false, model: false, deals: false, pack: false },
  internal: { notes: ["Внутренние показатели MEGAPARC (площади застройки из внутренних исследований, стоимость земли, целевая доходность) в эту конфигурацию не вносятся — только в закрытую запись OWNER."] },
};
