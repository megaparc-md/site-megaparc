import { T } from "@/data/leasing-experience-model";
import type { Distance, MarketIndicator } from "@/data/land/model";

/**
 * DROCHIA LOCATION MARKET RESEARCH — the public layer of the desk research of 2026-11-23 (OWNER «DROCHIA · DEVELOPMENT & INVESTMENT
 * EXPERIENCE» §6). The full internal record — every source, date, method, confidence, the data gaps and the asking-price listing sample —
 * is docs/research/DROCHIA_LOCATION_MARKET_RESEARCH.md. Rules kept here:
 *   · facts, the sources' own estimates and our assumptions are kept apart (`nature`); confidence per indicator;
 *   · NO vehicle or pedestrian traffic is published — no count exists for R7, R12 or bd. Independenței;
 *   · asking prices and rents from listings are NOT published (small sample, asking prices, LOW confidence) — internal record only;
 *   · third-party chains are named only as facts of the town's retail offer (their own store locators), never as operators of the site;
 *   · the population of the catchment is not estimated — only official figures of the town and the district.
 * R2 (2026-11-23, docs/research/DROCHIA_CLAIMS_VERIFICATION_R2.md): «no hypermarkets» is withdrawn (Linella's own store list labels its
 * Mitropolit Varlaam 1 store «Hypermarket») — the page names the chains present and the chains absent, each from the chain's own site;
 * the FEZ line adds the Soroca subzone; the industrial parks line is new (13 parks at 31.12.2025, MDED); the road distances are
 * recomputed from the corrected site point (≤ 0,2 km change).
 */

const NB = String.fromCharCode(160);
const BNS_GEO = "https://statistica.gov.md/files/files/serii_de_timp/recensamant_2024/date_finale/Anexa_Caracteristici_Geografice_RPL2024_en.xlsx";
const BNS_DEMO = "https://statistica.gov.md/files/files/serii_de_timp/recensamant_2024/date_finale/Anexa_Caracteristici_Demografice_RPL2024_en.xlsx";
const STATBANK = "https://statbank.statistica.md/";
const PASSPORT = "https://drochia.md/wp-content/uploads/2026/04/PASAPORTUL-Drochia-—-site.pdf";
const census = T("recensământ (BNS)", "перепись (НБС)", "census (NBS)");
const register = T("serie statistică oficială (BNS)", "официальный статистический ряд (НБС)", "official statistical series (NBS)");
const doc = T("document oficial", "официальный документ", "official document");
const osrm = T("Estimare a rutării OSRM pe rețeaua OpenStreetMap, de la punctul aproximativ al terenului; nu este o măsurătoare oficială.", "Оценка маршрутизатора OSRM по дорогам OpenStreetMap от ориентировочной точки участка; не официальное измерение.", "An OSRM routing estimate on the OpenStreetMap road network from the approximate site point; not an official measurement.");
const MDED_PARKS = "https://mded.gov.md/wp-content/uploads/2026/06/Raport-functionarea-PI-anul-2025-fin-pdf.pdf";

const indicators: MarketIndicator[] = [
  { key: "population-town", public: true, nature: "FACT", confidence: "HIGH", refDate: "08.04.2024", source: "BNS · RPL2024", url: BNS_GEO, method: census,
    label: T("Populația orașului Drochia", "Население города Дрокия", "Population of Drochia town"), display: "figure", value: T(`12${NB}939`, `12${NB}939`, "12,939"), note: T("locuitori · recensământul din 8 aprilie 2024", "жителей · перепись 8 апреля 2024 года", "residents · census of 8 April 2024") },
  { key: "population-district", public: true, nature: "FACT", confidence: "HIGH", refDate: "08.04.2024", source: "BNS · RPL2024", url: BNS_GEO, method: census,
    label: T("Populația raionului Drochia", "Население Дрокийского района", "Population of Drochia district"), display: "figure", value: T(`53${NB}738`, `53${NB}738`, "53,738"), note: T(`−23,9${NB}% față de 2014 (70${NB}574)`, `−23,9${NB}% к 2014 году (70${NB}574)`, "−23.9% vs 2014 (70,574)") },
  { key: "population-estimate", public: true, nature: "FACT", confidence: "HIGH", refDate: "01.01.2026", source: "BNS statbank · POP010500", url: STATBANK, method: register,
    label: T("Orașul · estimare oficială", "Город · официальная оценка", "The town · official estimate"), display: "figure", value: T(`12${NB}502`, `12${NB}502`, "12,502"), note: T(`la 1 ianuarie 2026 · raionul — 52${NB}098`, `на 1 января 2026 года · район — 52${NB}098`, "on 1 January 2026 · the district — 52,098") },
  { key: "age", public: true, nature: "FACT", confidence: "HIGH", refDate: "08.04.2024", source: "BNS · RPL2024", url: BNS_DEMO, method: census,
    label: T("Orașul · vârsta activă 15–64 ani", "Город · 15–64 года", "The town · aged 15–64"), display: "figure", value: T(`59,5${NB}%`, `59,5${NB}%`, "59.5%"), note: T(`0–14 ani — 18,6${NB}% · 65+ — 21,8${NB}%`, `0–14 лет — 18,6${NB}% · 65+ — 21,8${NB}%`, "0–14 — 18.6% · 65+ — 21.8%") },
  { key: "wage", public: true, nature: "FACT", confidence: "HIGH", refDate: "2025", source: "BNS statbank · SAL010400", url: STATBANK, method: register,
    label: T("Salariul mediu brut în raion", "Средняя зарплата брутто в районе", "Average gross wage in the district"), display: "figure", value: T(`12${NB}128 MDL`, `12${NB}128 MDL`, "MDL 12,128"), note: T(`pe lună, 2025 · 77,8${NB}% din media pe țară`, `в месяц, 2025 год · 77,8${NB}% от среднего по стране`, "a month, 2025 · 77.8% of the national average") },
  { key: "employees", public: true, nature: "FACT", confidence: "HIGH", refDate: "31.12.2025", source: "BNS statbank · SAL020300", url: STATBANK, method: register,
    label: T("Salariați în raion", "Наёмные работники в районе", "Employees in the district"), display: "figure", value: T(`10${NB}164`, `10${NB}164`, "10,164"), note: T("la 31 decembrie 2025", "на 31 декабря 2025 года", "on 31 December 2025") },
  { key: "turnover", public: true, nature: "FACT", confidence: "HIGH", refDate: "2024", source: "BNS statbank · ANT020150", url: STATBANK, method: register,
    label: T("Cifra de afaceri a întreprinderilor din raion", "Оборот предприятий района", "Turnover of the district's enterprises"), display: "text", value: T(`comerț 2${NB}860,4 mil. MDL · industria prelucrătoare 2${NB}433,5 mil. MDL`, `торговля 2${NB}860,4 млн MDL · обрабатывающая промышленность 2${NB}433,5 млн MDL`, "trade MDL 2,860.4 m · manufacturing MDL 2,433.5 m") },
  { key: "harvest", public: true, nature: "FACT", confidence: "HIGH", refDate: "2025", source: "BNS statbank · AGR020600", url: STATBANK, method: register,
    label: T("Recolta raionului", "Урожай района", "The district's harvest"), display: "text", value: T(`cereale 165${NB}982 t · floarea-soarelui 53${NB}189 t · sfeclă de zahăr 48${NB}385 t`, `зерновые 165${NB}982 т · подсолнечник 53${NB}189 т · сахарная свёкла 48${NB}385 т`, "cereals 165,982 t · sunflower 53,189 t · sugar beet 48,385 t") },
  { key: "roads", public: true, nature: "FACT", confidence: "HIGH", refDate: "2016 · 2026", source: "HG 1468/2016 · Pașaportul raionului Drochia", url: PASSPORT, method: doc,
    label: T("Drumuri naționale prin oraș", "Национальные дороги через город", "National roads through the town"), display: "text", value: T("R7 (R14 – Drochia – Costești – frontiera cu România) · R12 (R8 – Dondușeni – Drochia – Pelinia – M5)", "R7 (R14 – Дрокия – Костешть – граница с Румынией) · R12 (R8 – Дондюшень – Дрокия – Пелиния – M5)", "R7 (R14 – Drochia – Costești – Romanian border) · R12 (R8 – Dondușeni – Drochia – Pelinia – M5)") },
  { key: "bypass", public: true, nature: "FACT", confidence: "HIGH", refDate: "15.07.2026", source: "Guvernul RM · MIDR", url: null, method: doc,
    label: T("Ocolirea orașului pe R7", "Объезд города по R7", "The R7 bypass of the town"), display: "text", value: T("Guvernul a inițiat procedura de utilitate publică; traseul față de teren nu este publicat", "Правительство начало процедуру общественной полезности; трасса относительно участка не опубликована", "The Government started the public-utility procedure; the route relative to the site is not published") },
  { key: "rail", public: true, nature: "FACT", confidence: "MEDIUM", refDate: "28.03.2026", source: "IPN · CFM", url: "https://ipn.md/en/the-railway-embankments-in-causeni-drochia-and-cimislia-have-been-repaired/", method: T("presă, cu referire la CFM", "пресса со ссылкой на CFM", "press, citing CFM"),
    label: T("Gara Drochia · marfă", "Станция Дрокия · грузы", "Drochia station · freight"), display: "text", value: T("Platforma de descărcare a mărfurilor în vrac — reparată și în funcțiune", "Платформа выгрузки сыпучих грузов отремонтирована и работает", "The bulk-cargo unloading platform is repaired and in operation") },
  { key: "fez", public: true, nature: "FACT", confidence: "HIGH", refDate: "2025", source: "Invest Moldova · MDED", url: "https://invest.gov.md/en/invest_region/drochia-2/", method: doc,
    label: T("Zone economice libere", "Свободные экономические зоны", "Free economic zones"), display: "text", value: T(`Nicio subzonă de zonă economică liberă în raionul Drochia; cele mai apropiate — la Bălți (ZEL «Bălți») și la Soroca (ZEL «Ungheni-Business»), la circa 42–43${NB}km pe drum`, `Подзон свободных экономических зон в Дрокийском районе нет; ближайшие — в Бэлць (СЭЗ «Бэлць») и в Сороке (СЭЗ «Унгень-Бизнес»), около 42–43${NB}км по дороге`, "No free-economic-zone subzone in Drochia district; the nearest are in Bălți (FEZ «Bălți») and Soroca (FEZ «Ungheni-Business»), about 42–43 km by road") },
  { key: "parks", public: true, nature: "FACT", confidence: "HIGH", refDate: "31.12.2025", source: "MDED · Invest Moldova", url: MDED_PARKS, method: doc,
    label: T("Parcuri industriale în apropiere", "Индустриальные парки рядом", "Industrial parks nearby"), display: "text", value: T(`Parcul industrial privat «Bioenergagro» (13,49${NB}ha), în s. Țarigrad, la circa 5${NB}km — unul dintre cele 13 parcuri ale țării la sfârșitul anului 2025; celelalte cele mai apropiate — «Răut» (Bălți), Glodeni, Edineț, la circa 42–54${NB}km pe drum`, `Частный индустриальный парк «Bioenergagro» (13,49${NB}га) в с. Цариград, около 5${NB}км — один из 13 индустриальных парков страны на конец 2025 года; другие ближайшие — «Răut» (Бэлць), Глодень, Единец, около 42–54${NB}км по дороге`, "The private «Bioenergagro» industrial park (13.49 ha) in Țarigrad village, about 5 km away — one of the country's 13 industrial parks at the end of 2025; the other nearest are «Răut» (Bălți), Glodeni and Edineț, about 42–54 km by road") },
  { key: "retail", public: true, nature: "FACT", confidence: "HIGH", refDate: "23.11.2026", source: "linella.md · mylocal.md · enter.online · darwin.md · ff.md · hippocrates.md · felicia.md", url: null, method: T("verificare pe site-urile rețelelor", "проверка по сайтам сетей", "check on the chains' own sites"),
    label: T("Rețele naționale în oraș", "Национальные сети в городе", "National chains in the town"), display: "text", value: T("Alimentar: Linella — 3 magazine, Local — 1 · electronice: Enter, Darwin · farmacii: Farmacia Familiei — 5, Hippocrates — 4, Felicia — 3", "Продукты: Linella — 3 магазина, Local — 1 · электроника: Enter, Darwin · аптеки: Farmacia Familiei — 5, Hippocrates — 4, Felicia — 3", "Food: Linella — 3 stores, Local — 1 · electronics: Enter, Darwin · pharmacies: Farmacia Familiei — 5, Hippocrates — 4, Felicia — 3") },
  { key: "retail-absent", public: true, nature: "FACT", confidence: "MEDIUM", refDate: "23.11.2026", source: "kaufland.md · metro.md · supraten.md · maximum.md", url: null, method: T("listele de magazine ale rețelelor (METRO — după surse secundare)", "списки магазинов сетей (METRO — по вторичным источникам)", "the chains' store lists (METRO — from secondary sources)"),
    label: T("Formate mari", "Крупные форматы", "Large formats"), display: "text", value: T(`Magazinele Kaufland, METRO Cash & Carry, Supraten și Maximum nu sunt în oraș; cele mai apropiate Kaufland, METRO și Maximum — la Bălți, la circa 40–43${NB}km pe drum`, `Магазинов Kaufland, METRO Cash & Carry, Supraten и Maximum в городе нет; ближайшие Kaufland, METRO и Maximum — в Бэлць, около 40–43${NB}км по дороге`, "There are no Kaufland, METRO Cash & Carry, Supraten or Maximum stores in the town; the nearest Kaufland, METRO and Maximum are in Bălți, about 40–43 km by road") },
  { key: "grain", public: true, nature: "FACT", confidence: "HIGH", refDate: "2013–2023", source: "ANSA · dataset.gov.md", url: null, method: T("registru (înregistrare, nu capacitate)", "реестр (регистрация, не мощность)", "register (registration, not capacity)"),
    label: T("Depozite de cereale înregistrate", "Зарегистрированные зерновые склады", "Registered grain stores"), display: "text", value: T("17 în raion, dintre care 7 în oraș", "17 в районе, из них 7 в городе", "17 in the district, 7 of them in the town") },
  { key: "pug", public: true, nature: "FACT", confidence: "MEDIUM", refDate: "2004 · 2023", source: "Primăria Drochia", url: "https://primariadrochia.md/proiecte-de-decizii-anul-2023/", method: doc,
    label: T("Planul urbanistic general", "Генеральный план города (PUG)", "General urban plan"), display: "text", value: T("Din 2004; actualizarea propusă în 2023 — o versiune nouă aprobată nu a fost găsită", "С 2004 года; актуализация предложена в 2023 году — утверждённой новой редакции не найдено", "From 2004; an update was proposed in 2023 — no approved new version was found") },
];

const km = (key: string, to: ReturnType<typeof T>, value: number): Distance => ({ key, to, km: value, source: "OSRM · OpenStreetMap · 2026-11-23", method: osrm });

export const drochiaMarket: { distances: Distance[]; market: { summary: ReturnType<typeof T>; indicators: MarketIndicator[]; record: string; checked: string } } = {
  distances: [
    km("balti", T("Bălți", "Бэлць", "Bălți"), 42.5),
    km("soroca", T("Soroca", "Сороки", "Soroca"), 43.4),
    km("chisinau", T("Chișinău", "Кишинэу", "Chișinău"), 174.0),
    km("costesti", T("PTF Costești – Stânca (România)", "КПП Костешть – Стынка (Румыния)", "Costești – Stânca crossing (Romania)"), 62.3),
    km("otaci", T("PTF Otaci – Moghiliov-Podolski (Ucraina)", "КПП Отачь – Могилёв-Подольский (Украина)", "Otaci – Mohyliv-Podilskyi crossing (Ukraine)"), 67.1),
  ],
  market: {
    summary: T(
      `Drochia este centru raional în nordul Republicii Moldova: 12${NB}939 de locuitori în oraș și 53${NB}738 în raion (recensământul din 2024). Prin oraș trec drumurile naționale R7 și R12 și calea ferată Ocnița – Bălți; Bălți este la circa 43${NB}km pe drum, Chișinău — la circa 174${NB}km. Economia raionului se sprijină pe agricultură, industria alimentară și comerț. Formatul de dezvoltare a terenului este în evaluare.`,
      `Дрокия — районный центр на севере Молдовы: 12${NB}939 жителей в городе и 53${NB}738 в районе (перепись 2024 года). Через город проходят национальные дороги R7 и R12 и железная дорога Окница – Бэлць; до Бэлць около 43${NB}км по дороге, до Кишинэу — около 174${NB}км. Экономика района держится на сельском хозяйстве, пищевой промышленности и торговле. Формат развития участка находится в стадии оценки.`,
      `Drochia is a district centre in the north of Moldova: 12,939 residents in the town and 53,738 in the district (2024 census). National roads R7 and R12 and the Ocnița – Bălți railway cross the town; Bălți is about 43 km by road, Chișinău about 174 km. The district's economy rests on agriculture, food processing and trade. The site's development format is under evaluation.`,
    ),
    indicators,
    record: "docs/research/DROCHIA_LOCATION_MARKET_RESEARCH.md",
    checked: "2026-11-23",
  },
};
