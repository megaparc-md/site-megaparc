import type { Localized } from "@/lib/site-data";

/**
 * MEGAPARC — BUSINESS CHRONICLE (OWNER correction 2026-10-08, "HISTORY —
 * REBUILD EDITORIALLY"). Built from the OWNER source document "Draft text"
 * (Cronică de Business, RO) — not from a generic competencies narrative.
 *
 * HIERARCHY (never collapsed into one founding date):
 *   BUSINESS ORIGINS 1991 → GROUP / INVESTMENT PLATFORM 1995 → MEGAPARC 2005 →
 *   (international and diversified group 2006–2016) → STRATEGIC CONSOLIDATION
 *   2017–2020 → REAL-ESTATE FOCUS 2020 → TODAY
 *   1991 = business origins of the founders · 1995 = group investment
 *   structure (SINCE 1995) · 2005 = MEGAPARC founded · 2020 = real-estate focus.
 *   Never "MEGAPARC founded in 1991 / 1995".
 *
 * CLAIMS: superlatives and unverifiable statements of the source ("first
 * modern supermarket", "first leasing company", "first of its kind",
 * "revolutionised", "changed the rules of the market", "one of the few
 * factories", sustainability / ethical-production claims, CEFTA in 1992,
 * "35-year record", "global markets") are kept OUT of public copy and listed
 * for verification in docs/HISTORY_EDITORIAL.md. The founder's name in the
 * source's leadership text is not published (no team / leadership section).
 *
 * WORDING: editorial draft for OWNER approval (RU master; RO and EN are full
 * adaptations). Group businesses are group history — never presented as
 * current MEGAPARC assets or presence.
 */

export type HistoryScope = "group" | "megaparc";
export type EraKey = "origins" | "group" | "megaparc" | "world" | "consolidation" | "focus" | "today";
export type Sector = "retail" | "manufacturing" | "logistics" | "wine" | "investment" | "realestate" | "pharma" | "finance" | "agro" | "legal" | "horeca" | "energy" | "industry" | "ventures" | "consolidation" | "trade" | "focus";
export type HistoryImageKey = string;

export type HistoryEntry = {
  id: string;
  year: string;
  era: EraKey;
  sector: Sector;
  scope: HistoryScope;
  /** Proper name exactly as in the source (no translation). */
  name: string;
  place: Localized;
  title: Localized;
  text: Localized;
  /** Original material the OWNER is asked for; shown as an "awaiting original" archive frame. */
  archive?: Localized;
};

export type Era = {
  key: EraKey;
  no: string;
  range: string;
  scope: HistoryScope | "both";
  label: Localized;
  title: Localized;
  lead: Localized;
  image?: HistoryImageKey;
  map?: "region" | "world";
  close?: Localized;
};

const L = (ro: string, ru: string, en: string): Localized => ({ ro, ru, en });

/** Business direction — one professional taxonomy for every episode (final history correction 2026-10-08). */
export const sectorLabel: Record<Sector, Localized> = {
  retail: L("Comerț cu amănuntul", "Розничная торговля", "Retail"),
  manufacturing: L("Producție", "Производство", "Manufacturing"),
  logistics: L("Logistică", "Логистика", "Logistics"),
  wine: L("Comerț internațional", "Международная торговля", "International trade"),
  investment: L("Investiții", "Инвестиции", "Investment"),
  realestate: L("Imobiliare", "Недвижимость", "Real estate"),
  pharma: L("Distribuție farmaceutică", "Фармацевтическая дистрибуция", "Pharmaceutical distribution"),
  finance: L("Servicii financiare", "Финансовые услуги", "Financial services"),
  agro: L("Agrobusiness", "Агробизнес", "Agribusiness"),
  legal: L("Servicii juridice", "Юридические услуги", "Legal services"),
  horeca: L("Restaurante", "Ресторанный бизнес", "Hospitality"),
  energy: L("Energie", "Энергетика", "Energy"),
  industry: L("Proiecte industriale", "Промышленные проекты", "Industrial projects"),
  ventures: L("Investiții în start-up-uri", "Венчурные инвестиции", "Venture investment"),
  consolidation: L("Restructurare", "Реструктуризация", "Restructuring"),
  trade: L("Comerț internațional", "Международная торговля", "International trade"),
  focus: L("Imobiliare", "Недвижимость", "Real estate"),
};

/* ------------------------------------------------------------------ */
/* Eras                                                                 */
/* ------------------------------------------------------------------ */

export const eras: Era[] = [
  {
    key: "origins",
    no: "I",
    range: "1991–1994",
    scope: "group",
    label: L("Originile", "Истоки", "Origins"),
    title: L("Un magazin, o fabrică, un port.", "Магазин, фабрика, порт.", "A shop, a factory, a port."),
    lead: L(
      "Primii ani ai economiei de piață. Fondatorii încep cu ce lipsea atunci: comerț cu aprovizionare proprie, producție și logistică.",
      "Первые годы рыночной экономики. Основатели начинают с того, чего тогда не хватало: торговли с собственными поставками, производства и логистики.",
      "The first years of the market economy. The founders start with what was missing: retail with its own supply, manufacturing and logistics.",
    ),
    image: "era-retail",
    map: "region",
  },
  {
    key: "group",
    no: "II",
    range: "1995–2004",
    scope: "group",
    label: L("Grupul", "Группа", "The group"),
    title: L("O structură de investiții. Și primele imobiliare.", "Инвестиционная структура. И первая недвижимость.", "An investment structure. And the first real estate."),
    lead: L(
      "În 1995 afacerile fondatorilor sunt reunite într-o structură de investiții a grupului, care coordonează direcțiile și atrage capital. În același an, în portofoliu apar imobiliarele.",
      "В 1995 году бизнесы основателей объединяет инвестиционная структура группы: она координирует направления и привлекает капитал. В том же году в портфеле появляется недвижимость.",
      "In 1995 the founders' businesses are brought together under the group's investment structure, which coordinates them and raises capital. The same year, real estate enters the portfolio.",
    ),
    image: "era-sugar",
    close: L(
      "La mijlocul anilor 2000, afacerile ajunse la maturitate sunt vândute. Capitalul este liber pentru pasul următor.",
      "К середине 2000‑х зрелые бизнесы группы проданы. Капитал свободен для следующего шага.",
      "By the mid-2000s the group's mature businesses have been sold. Capital is free for the next step.",
    ),
  },
  {
    key: "megaparc",
    no: "III",
    range: "2005",
    scope: "megaparc",
    label: L("MEGAPARC", "MEGAPARC", "MEGAPARC"),
    title: L("Este fondată MEGAPARC.", "Основана MEGAPARC.", "MEGAPARC is founded."),
    lead: L(
      "După vânzarea afacerilor mature, grupul face doi pași: relansează comerțul și fondează o companie imobiliară.",
      "После продажи зрелых бизнесов группа делает два шага: перезапускает розницу и основывает компанию недвижимости.",
      "After selling its mature businesses, the group takes two steps: it relaunches retail and founds a real-estate company.",
    ),
  },
  {
    key: "world",
    no: "IV",
    range: "2006–2016",
    scope: "group",
    label: L("Extindere", "Расширение", "Expansion"),
    title: L("Direcții noi.", "Новые направления.", "New lines of business."),
    lead: L(
      "Grupul se extinde — în domenii noi și pe piețe noi: consultanță juridică, HoReCa, energie, industrie și logistică în Africa și Orientul Mijlociu, sprijin pentru antreprenori.",
      "Группа расширяется — в новые отрасли и на новые рынки: юридическая практика, HoReCa, энергетика, промышленность и логистика в Африке и на Ближнем Востоке, поддержка предпринимателей.",
      "The group expands — into new industries and new markets: legal advisory, HoReCa, energy, industry and logistics in Africa and the Middle East, support for entrepreneurs.",
    ),
    image: "era-energy",
    map: "world",
  },
  {
    key: "consolidation",
    no: "V",
    range: "2017–2020",
    scope: "group",
    label: L("Consolidarea", "Консолидация", "Consolidation"),
    title: L("Mai puține direcții. Mai mult focus.", "Меньше направлений. Больше фокуса.", "Fewer lines of business. More focus."),
    lead: L(
      "Grupul transferă afacerile mature și vinde activele necore. Ultimele proiecte de comerț și logistică leagă China, România și Europa de Est.",
      "Группа передаёт зрелые бизнесы и продаёт непрофильные активы. Последние торговые и логистические проекты связывают Китай, Румынию и Восточную Европу.",
      "The group hands over its mature businesses and sells non-core assets. The last trade and logistics projects link China, Romania and Eastern Europe.",
    ),
    image: "era-distribution",
  },
  {
    key: "focus",
    no: "VI",
    range: "2020",
    scope: "megaparc",
    label: L("Focus", "Фокус", "Focus"),
    title: L("Imobiliarele devin activitatea principală.", "Недвижимость становится главным делом.", "Real estate becomes the core business."),
    lead: L(
      "În 2020 grupul iese din logistica internațională și din comerț. Rămân imobiliarele — iar centrul lor este MEGAPARC.",
      "В 2020 году группа выходит из международной логистики и розницы. Остаётся недвижимость — и её центр, MEGAPARC.",
      "In 2020 the group exits international logistics and retail. What remains is real estate — with MEGAPARC at its centre.",
    ),
  },
  {
    key: "today",
    no: "VII",
    range: "",
    scope: "megaparc",
    label: L("Astăzi", "Сегодня", "Today"),
    title: L("Cumpărăm. Dezvoltăm. Închiriem.", "Покупаем. Развиваем. Сдаём в аренду.", "We acquire. We develop. We lease."),
    lead: L(
      "MEGAPARC cumpără imobiliare și terenuri, dezvoltă proiecte proprii și închiriază spațiile comerciale din clădirile sale. Obiectele în funcțiune sunt în Chișinău; proiectele de dezvoltare — VATRA și Drochia Gateway.",
      "MEGAPARC покупает недвижимость и землю, развивает собственные проекты и сдаёт в аренду коммерческие площади в своих зданиях. Действующие объекты — в Кишинёве; проекты развития — VATRA и Drochia Gateway.",
      "MEGAPARC buys real estate and land, develops its own projects and leases the commercial space in its buildings. Its operating properties are in Chișinău; its development projects are VATRA and Drochia Gateway.",
    ),
  },
];

/* ------------------------------------------------------------------ */
/* Entries — the chronicle                                              */
/* ------------------------------------------------------------------ */

export const entries: HistoryEntry[] = [
  // I · ORIGINS
  {
    id: "negruzzi",
    year: "1991",
    era: "origins",
    sector: "retail",
    scope: "group",
    name: "Bd. Negruzzi",
    place: L("Chișinău", "Кишинёв", "Chișinău"),
    title: L("Supermarketul de pe bulevardul Negruzzi", "Супермаркет на бульваре Негруцци", "The supermarket on Negruzzi Boulevard"),
    text: L(
      "Primul proiect al fondatorilor. Aprovizionarea a trebuit construită de la zero — într-o economie care abia trecea de la comerțul de stat la cel de piață.",
      "Первый проект основателей. Поставки приходилось выстраивать с нуля — в экономике, которая только переходила от государственной торговли к рыночной.",
      "The founders' first project. Supply had to be built from scratch — in an economy only just moving from state trade to a market.",
    ),
    archive: L("Fațada și sala supermarketului, începutul anilor 1990", "Фасад и торговый зал супермаркета, начало 1990‑х", "The supermarket's facade and floor, early 1990s"),
  },
  {
    id: "modelier",
    year: "1991",
    era: "origins",
    sector: "manufacturing",
    scope: "group",
    name: "Modelier",
    place: L("Republica Moldova", "Молдова", "Moldova"),
    title: L("Fabrica de confecții Modelier", "Швейная фабрика Modelier", "The Modelier garment factory"),
    text: L(
      "Producție proprie de îmbrăcăminte, cu accent pe echipamente moderne și pe croirea economică a materialului.",
      "Собственное производство одежды — со ставкой на современное оборудование и экономный раскрой материала.",
      "In-house garment production, built on modern equipment and economical cutting of material.",
    ),
    archive: L("Atelierul Modelier, utilaje, etichete", "Цех Modelier, оборудование, этикетки", "The Modelier workshop, machines, labels"),
  },
  {
    id: "romitech",
    year: "1991",
    era: "origins",
    sector: "logistics",
    scope: "group",
    name: "Romitech",
    place: L("Portul Brăila, România", "Порт Брэила, Румыния", "Port of Brăila, Romania"),
    title: L("Romitech — hub în portul Brăila", "Romitech — хаб в порту Брэила", "Romitech — a hub in the port of Brăila"),
    text: L(
      "Primul proiect al grupului în afara Moldovei: transbordarea mărfurilor generale, legând rutele de pe Dunăre de transportul rutier și feroviar.",
      "Первый проект группы за пределами Молдовы: перевалка генеральных грузов, связка дунайских маршрутов с автомобильными и железнодорожными.",
      "The group's first project outside Moldova: transhipment of general cargo, linking Danube routes with road and rail.",
    ),
    archive: L("Cheiul și depozitele Romitech de la Brăila", "Причал и склады Romitech в Брэиле", "Romitech's quay and warehouses in Brăila"),
  },
  {
    id: "brp",
    year: "1992",
    era: "origins",
    sector: "wine",
    scope: "group",
    name: "BRP",
    place: L("Republica Moldova", "Молдова", "Moldova"),
    title: L("BRP — echipamente pentru vinificație", "BRP — оборудование для виноделия", "BRP — winemaking equipment"),
    text: L(
      "Import de echipamente și materiale pentru filtrarea, fermentarea și prelucrarea vinului — și un canal prin care vinul moldovenesc ajungea pe piețele externe.",
      "Импорт оборудования и материалов для фильтрации, ферментации и обработки вина — и канал, по которому молдавское вино уходило на внешние рынки.",
      "Importing equipment and materials for filtering, fermenting and processing wine — and a channel that took Moldovan wine to foreign markets.",
    ),
  },
  {
    id: "mi-gross",
    year: "1993",
    era: "origins",
    sector: "retail",
    scope: "group",
    name: "Mi-Gross",
    place: L("Republica Moldova", "Молдова", "Moldova"),
    title: L("Rețeaua de supermarketuri Mi-Gross", "Сеть супермаркетов Mi-Gross", "The Mi-Gross supermarket chain"),
    text: L(
      "Format de discount: rotație rapidă a stocurilor și costuri operaționale mici, pentru prețuri accesibile.",
      "Формат дискаунтера: быстрый оборот товара и низкие операционные расходы — ради доступных цен.",
      "A discount format: fast stock rotation and low operating costs, for affordable prices.",
    ),
    archive: L("Magazin Mi-Gross, anii 1990", "Магазин Mi-Gross, 1990‑е", "A Mi-Gross store, 1990s"),
  },
  {
    id: "arcona",
    year: "1993",
    era: "origins",
    sector: "manufacturing",
    scope: "group",
    name: "Arcona",
    place: L("Republica Moldova", "Молдова", "Moldova"),
    title: L("Fabrica de articole din piele Arcona", "Фабрика кожаных изделий Arcona", "The Arcona leather-goods factory"),
    text: L(
      "Articole și accesorii din piele — de la prelucrarea materiei prime la produsul finit.",
      "Изделия и аксессуары из кожи — от обработки сырья до готового продукта.",
      "Leather goods and accessories — from processing the raw hide to the finished product.",
    ),
  },
  // II · GROUP
  {
    id: "holding",
    year: "1995",
    era: "group",
    sector: "investment",
    scope: "group",
    name: "",
    place: L("Chișinău", "Кишинёв", "Chișinău"),
    title: L("Se formează structura de investiții a grupului", "Создана инвестиционная структура группы", "The group's investment structure is formed"),
    text: L(
      "Un centru care coordonează toate direcțiile de afaceri și atrage capital strategic. Din acest an se numără istoria grupului.",
      "Центр, который координирует все направления бизнеса и привлекает стратегический капитал. С этого года отсчитывается история группы.",
      "A centre that coordinates every line of business and raises strategic capital. The group's history is counted from this year.",
    ),
  },
  {
    id: "ym-capitol",
    year: "1995",
    era: "group",
    sector: "realestate",
    scope: "group",
    name: "Y.M. Capitol",
    place: L("Chișinău", "Кишинёв", "Chișinău"),
    title: L("Y.M. Capitol — prima direcție imobiliară", "Y.M. Capitol — первое направление недвижимости", "Y.M. Capitol — the first real-estate line"),
    text: L(
      "Terenuri în punctele-cheie ale orașului, spații de birouri și comerciale.",
      "Участки в узловых точках города, офисные и торговые помещения.",
      "Plots at the city's key junctions, office and retail space.",
    ),
  },
  {
    id: "green-hills",
    year: "1995",
    era: "group",
    sector: "retail",
    scope: "group",
    name: "Green Hills Market",
    place: L("Republica Moldova", "Молдова", "Moldova"),
    title: L("Rețeaua Green Hills Market", "Сеть Green Hills Market", "The Green Hills Market chain"),
    text: L(
      "Supermarketuri de format mare și tehnologii care abia intrau pe piață: coduri de bare, depozitare frigorifică centralizată, programe de fidelizare.",
      "Супермаркеты крупного формата и технологии, которые тогда только приходили на рынок: штрихкоды, централизованные холодильные склады, программы лояльности.",
      "Large-format supermarkets and technologies just reaching the market: barcodes, centralised cold storage, loyalty programmes.",
    ),
    archive: L("Magazin Green Hills Market, anii 1990", "Магазин Green Hills Market, 1990‑е", "A Green Hills Market store, 1990s"),
  },
  {
    id: "farmatrade",
    year: "1995",
    era: "group",
    sector: "pharma",
    scope: "group",
    name: "Farmatrade",
    place: L("Republica Moldova", "Молдова", "Moldova"),
    title: L("Farmatrade — distribuție farmaceutică", "Farmatrade — фармацевтическая дистрибуция", "Farmatrade — pharmaceutical distribution"),
    text: L(
      "Import de medicamente și echipamente medicale, depozite autorizate.",
      "Импорт лекарств и медицинского оборудования, лицензированные склады.",
      "Importing medicines and medical equipment, licensed warehouses.",
    ),
  },
  {
    id: "imc-leasing",
    year: "1996",
    era: "group",
    sector: "finance",
    scope: "group",
    name: "IMC Leasing",
    place: L("Republica Moldova", "Молдова", "Moldova"),
    title: L("IMC Leasing — leasing financiar", "IMC Leasing — финансовый лизинг", "IMC Leasing — financial leasing"),
    text: L(
      "Leasing pentru automobile și echipamente industriale — în anii în care creditul bancar pentru afaceri era greu accesibil.",
      "Лизинг автомобилей и промышленного оборудования — в годы, когда банковский кредит для бизнеса был труднодоступен.",
      "Leasing for vehicles and industrial equipment — in years when bank credit for business was hard to get.",
    ),
  },
  {
    id: "soiuz-agros",
    year: "1997",
    era: "group",
    sector: "agro",
    scope: "group",
    name: "Soiuz Agros-Intex",
    place: L("Republica Moldova", "Молдова", "Moldova"),
    title: L("Soiuz Agros‑Intex — sistem agricol integrat", "Soiuz Agros‑Intex — агробизнес полного цикла", "Soiuz Agros‑Intex — an integrated farm system"),
    text: L(
      "Tot ce îi trebuie fermierului, într-un singur sistem: semințe și îngrășăminte, colectarea recoltei, logistica exportului de cereale.",
      "Всё для фермера в одной системе: семена и удобрения, сбор урожая, логистика экспорта зерна.",
      "Everything a farmer needs in one system: seed and fertiliser, harvest collection, grain-export logistics.",
    ),
  },
  {
    id: "inseko",
    year: "1997",
    era: "group",
    sector: "agro",
    scope: "group",
    name: "Inseko",
    place: L("Ucraina", "Украина", "Ukraine"),
    title: L("Inseko — zahăr, ciclu complet", "Inseko — от свёклы до сахара", "Inseko — sugar, full cycle"),
    text: L(
      "Cultivarea sfeclei de zahăr, procesarea industrială și vânzarea zahărului.",
      "Выращивание сахарной свёклы, промышленная переработка и продажа сахара.",
      "Growing sugar beet, industrial processing and selling the sugar.",
    ),
  },
  // III · MEGAPARC
  {
    id: "megaparc",
    year: "2005",
    era: "megaparc",
    sector: "realestate",
    scope: "megaparc",
    name: "MEGAPARC",
    place: L("Chișinău", "Кишинёв", "Chișinău"),
    title: L("MEGAPARC", "MEGAPARC", "MEGAPARC"),
    text: L(
      "Compania cumpără clădiri comerciale degradate și le transformă în spații moderne, gata de închiriat — ceea ce astăzi se numește dezvoltare brownfield.",
      "Компания покупает коммерческие здания в плохом состоянии и превращает их в современные пространства, готовые к аренде, — то, что сегодня называют brownfield-девелопментом.",
      "The company buys run-down commercial buildings and turns them into modern spaces ready to lease — what is now called brownfield development.",
    ),
  },
  {
    id: "imc-market",
    year: "2005",
    era: "megaparc",
    sector: "retail",
    scope: "group",
    name: "IMC Market",
    place: L("Republica Moldova", "Молдова", "Moldova"),
    title: L("IMC Market — comerțul revine", "IMC Market — розница возвращается", "IMC Market — retail returns"),
    text: L(
      "O nouă rețea de magazine de proximitate, construită pe experiența rețelelor anterioare.",
      "Новая сеть магазинов у дома, построенная на опыте прежних сетей.",
      "A new chain of neighbourhood stores, built on the experience of the earlier chains.",
    ),
  },
  // IV · WORLD
  {
    id: "imc-legal",
    year: "2006",
    era: "world",
    sector: "legal",
    scope: "group",
    name: "IMC Legal Advisors",
    place: L("Chișinău", "Кишинёв", "Chișinău"),
    title: L("IMC Legal Advisors", "IMC Legal Advisors", "IMC Legal Advisors"),
    text: L(
      "Asistență juridică pentru tranzacții complexe și gestionarea riscurilor — pentru portofoliul propriu și pentru parteneri externi.",
      "Юридическое сопровождение сложных сделок и управление рисками — для собственного портфеля и внешних партнёров.",
      "Legal support for complex transactions and risk control — for the group's own portfolio and for outside partners.",
    ),
  },
  {
    id: "flying-pig",
    year: "2006",
    era: "world",
    sector: "horeca",
    scope: "group",
    name: "Flying Pig",
    place: L("Chișinău", "Кишинёв", "Chișinău"),
    title: L("Flying Pig", "Flying Pig", "Flying Pig"),
    text: L("O berărie în stil bavarez și un restaurant BBQ.", "Пивоварня в баварском стиле и BBQ-ресторан.", "A Bavarian-style brewery and a BBQ restaurant."),
  },
  {
    id: "valahia",
    year: "2007",
    era: "world",
    sector: "energy",
    scope: "group",
    name: "Valahia",
    place: L("Irak", "Ирак", "Iraq"),
    title: L("Valahia — proiect energetic", "Valahia — энергетический проект", "Valahia — an energy project"),
    text: L("Explorare petrolieră și prospecțiuni geologice.", "Нефтеразведка и геологические изыскания.", "Oil exploration and geological prospecting."),
  },
  {
    id: "west-africa",
    year: "2007",
    era: "world",
    sector: "industry",
    scope: "group",
    name: "West Africa",
    place: L("Africa de Vest", "Западная Африка", "West Africa"),
    title: L("Proiecte industriale în Africa de Vest", "Промышленные проекты в Западной Африке", "Industrial projects in West Africa"),
    text: L(
      "Construcții industriale și rafinare a țițeiului — pe baza relațiilor comerciale cu parteneri din Orientul Mijlociu.",
      "Промышленное строительство и нефтепереработка — на основе торговых связей с партнёрами с Ближнего Востока.",
      "Industrial construction and crude refining — building on trade relationships with Middle Eastern partners.",
    ),
  },
  {
    id: "sdc-senegal",
    year: "2007",
    era: "world",
    sector: "logistics",
    scope: "group",
    name: "Distribution Center Senegal",
    place: L("Dakar, Senegal", "Дакар, Сенегал", "Dakar, Senegal"),
    title: L("Distribution Center Senegal", "Distribution Center Senegal", "Distribution Center Senegal"),
    text: L(
      "Un hub logistic pentru mărfuri generale la Dakar: un coridor comercial între Turcia, regiunea noastră și Africa de Vest.",
      "Логистический хаб для генеральных грузов в Дакаре: торговый коридор между Турцией, нашим регионом и Западной Африкой.",
      "A general-cargo logistics hub in Dakar: a trade corridor between Turkey, our region and West Africa.",
    ),
  },
  {
    id: "estate-industry",
    year: "2014",
    era: "world",
    sector: "ventures",
    scope: "group",
    name: "Estate Industry Group",
    place: L("Republica Moldova", "Молдова", "Moldova"),
    title: L("Estate Industry Group", "Estate Industry Group", "Estate Industry Group"),
    text: L(
      "Sprijin pentru startup-uri: nu doar capital, ci și experiență — în imobiliare și logistică.",
      "Поддержка стартапов: не только капитал, но и опыт — в недвижимости и логистике.",
      "Support for start-ups: not only capital but experience — in real estate and logistics.",
    ),
  },
  // V · CONSOLIDATION
  {
    id: "transfer",
    year: "2017–2018",
    era: "consolidation",
    sector: "consolidation",
    scope: "group",
    name: "",
    place: L("Grupul", "Группа", "The group"),
    title: L("Transferul afacerilor", "Передача бизнесов", "Handing over the businesses"),
    text: L(
      "Restructurarea activelor, transferul conducerii operaționale, vânzarea direcțiilor necore — capitalul se eliberează pentru ceva nou.",
      "Реструктуризация активов, передача операционного управления, продажа непрофильных направлений — капитал освобождается для нового.",
      "Restructuring the assets, handing over operational management, selling non-core lines — capital is freed for something new.",
    ),
  },
  {
    id: "china",
    year: "2019",
    era: "consolidation",
    sector: "trade",
    scope: "group",
    name: "China",
    place: L("China → Europa de Est", "Китай → Восточная Европа", "China → Eastern Europe"),
    title: L("Aprovizionare din China", "Поставки из Китая", "Supply from China"),
    text: L(
      "Negocieri și contracte cu producători din China; fluxuri de mărfuri spre piețele din Europa de Est.",
      "Переговоры и контракты с производителями в Китае; товарные потоки на рынки Восточной Европы.",
      "Negotiations and contracts with manufacturers in China; goods flows to Eastern European markets.",
    ),
  },
  {
    id: "romania-logistics",
    year: "2020",
    era: "consolidation",
    sector: "logistics",
    scope: "group",
    name: "Romania",
    place: L("România", "Румыния", "Romania"),
    title: L("Logistică de tranzit în România", "Транзитная логистика в Румынии", "Transit logistics in Romania"),
    text: L(
      "Depozite de tranzit: mărfurile din Asia se întâlnesc cu distribuția regională.",
      "Склады для транзита: грузы из Азии встречаются с региональной дистрибуцией.",
      "Transit warehouses where goods from Asia meet regional distribution.",
    ),
  },
  // VI · FOCUS
  {
    id: "focus-2020",
    year: "2020",
    era: "focus",
    sector: "focus",
    scope: "megaparc",
    name: "MEGAPARC",
    place: L("Republica Moldova", "Молдова", "Moldova"),
    title: L("Decizia din 2020", "Решение 2020 года", "The 2020 decision"),
    text: L(
      "Ieșirea din logistica internațională și din comerț. Resursele grupului se concentrează pe imobiliare.",
      "Выход из международной логистики и розницы. Ресурсы группы сосредоточены на недвижимости.",
      "An exit from international logistics and retail. The group's resources are concentrated on real estate.",
    ),
  },
];

/* ------------------------------------------------------------------ */
/* Period images (third-party archive, CC0) — internal provenance only,   */
/* never shown on the page; placeholders for the group's own archive.    */
/* ------------------------------------------------------------------ */

export const historyImages: Record<HistoryImageKey, { year: string; subject: Localized; page: string }> = {
  "era-retail": { year: "1967", subject: L("supermarket", "супермаркет", "supermarket"), page: "https://commons.wikimedia.org/wiki/File:Lelystad_bijna_gereed._De_supermarkt,_Bestanddeelnr_920-7407.jpg" },
  "era-port": { year: "1946", subject: L("macarale de port", "портовые краны", "port cranes"), page: "https://commons.wikimedia.org/wiki/File:Havenkranen,_Bestanddeelnr_901-7559.jpg" },
  "era-bottling": { year: "1959", subject: L("îmbuteliere", "розлив", "bottling"), page: "https://commons.wikimedia.org/wiki/File:Flessen_vullen_bij_wijnhandel_Richard_Scheid,_Bestanddeelnr_254-4238.jpg" },
  "era-sugar": { year: "1982", subject: L("campania sfeclei de zahăr", "сезон сахарной свёклы", "sugar-beet campaign"), page: "https://commons.wikimedia.org/wiki/File:Suikerbietencampagne,_Halfweg,_Bestanddeelnr_932-3141.jpg" },
  "era-energy": { year: "1955", subject: L("terminal petrolier", "нефтяной терминал", "oil terminal"), page: "https://commons.wikimedia.org/wiki/File:Geen_bijschrift_Olie_terminal._Pijpleidingen_en_afsluiters,_Bestanddeelnr_143-0980.tif" },
  "era-construction": { year: "1950s", subject: L("construcție", "стройка", "construction"), page: "https://commons.wikimedia.org/wiki/File:Uitbreiding_woningbouw_Slotermeer_West,_Bestanddeelnr_905-2614.jpg" },
  "era-distribution": { year: "1971", subject: L("centru de distribuție", "распределительный центр", "distribution centre"), page: "https://commons.wikimedia.org/wiki/File:Distributiecentrum_op_het_Amstel_industriegebied_te_Amsterdam,_Bestanddeelnr_924-5661.jpg" },
  "ep-modelier": { year: "1950s", subject: L("atelier de confecții", "швейный цех", "garment workshop"), page: "https://commons.wikimedia.org/wiki/File:De_administratie-afdeling_van_overhemdenbedrijf_Kerko_met_zicht_op_het_naaiateli,_Bestanddeelnr_254-2948.jpg" },
  "ep-mi-gross": { year: "1950s", subject: L("supermarket", "супермаркет", "supermarket"), page: "https://commons.wikimedia.org/wiki/File:Supermarkt_in_Willemstad,_Bestanddeelnr_252-2951.jpg" },
  "ep-arcona": { year: "1940s", subject: L("atelier de cusut", "пошивочная мастерская", "sewing workshop"), page: "https://commons.wikimedia.org/wiki/File:Naaiatelier_in_Volendam,_Bestanddeelnr_903-8917.jpg" },
  "ep-holding": { year: "1960s", subject: L("bursa de valori", "фондовая биржа", "stock exchange"), page: "https://commons.wikimedia.org/wiki/File:Opdracht_Effectenbeurs_van_Dissel,_de_Effectenbeurs,_interieur,_Bestanddeelnr_919-4230.jpg" },
  "ep-ym-capitol": { year: "1970s", subject: L("centru comercial", "торговый центр", "shopping centre"), page: "https://commons.wikimedia.org/wiki/File:Overzicht_van_het_winkelcentrum,_Bestanddeelnr_925-5600.jpg" },
  "ep-green-hills": { year: "1970s", subject: L("supermarket", "супермаркет", "supermarket"), page: "https://commons.wikimedia.org/wiki/File:Supermarkt_(zuivel-afdeling),_Bestanddeelnr_930-9941.jpg" },
  "ep-farmatrade": { year: "1970s", subject: L("farmacie", "аптека", "pharmacy"), page: "https://commons.wikimedia.org/wiki/File:Apotheek,_Bestanddeelnr_930-2798.jpg" },
  "ep-imc-leasing": { year: "1960s", subject: L("flotă de camioane", "парк грузовиков", "truck fleet"), page: "https://commons.wikimedia.org/wiki/File:Verkeer,_vrachtwagens,_Bestanddeelnr_920-0298.jpg" },
  "ep-soiuz-agros": { year: "1950s", subject: L("arat cu tractorul", "вспашка", "ploughing"), page: "https://commons.wikimedia.org/wiki/File:Grondbewerking,_machines,_werktuigen,_Ploegen,_Tractors,_Bestanddeelnr_253-4740.jpg" },
  "ep-imc-market": { year: "1970s", subject: L("magazin", "магазин", "shop"), page: "https://commons.wikimedia.org/wiki/File:Melkboer_(Schieveen)_in_winkel,_Bestanddeelnr_926-3447.jpg" },
  "ep-imc-legal": { year: "1940s", subject: L("rafturi cu cărți", "книжные полки", "bookshelves"), page: "https://commons.wikimedia.org/wiki/File:Kisten_met_boeken,_Bestanddeelnr_95-2-3.jpg" },
  "ep-flying-pig": { year: "1950s", subject: L("restaurant", "ресторан", "restaurant"), page: "https://commons.wikimedia.org/wiki/File:Rehovot_Weizmann_Institute_interieur_van_het_restaurant,_Bestanddeelnr_255-3887.jpg" },
  "ep-west-africa": { year: "1940s", subject: L("construcția unei fabrici", "строительство завода", "factory under construction"), page: "https://commons.wikimedia.org/wiki/File:Bouw_Fabriek_de_Cirkel_te_Zwanenburg,_Bestanddeelnr_904-4813.jpg" },
  "ep-estate-industry": { year: "1940s", subject: L("hală industrială", "заводской цех", "factory hall"), page: "https://commons.wikimedia.org/wiki/File:Fabriekshal_zonder_dak,_Bestanddeelnr_10779.jpg" },
  "ep-transfer": { year: "1980s", subject: L("arhivă de documente", "архив документов", "document archive"), page: "https://commons.wikimedia.org/wiki/File:Begin_proces_in_ABP-affaire_tegen_Masson_dossiers_ABP-zaak,_Bestanddeelnr_933-7986.jpg" },
  "ep-china": { year: "1970s", subject: L("terminal de containere", "контейнерный терминал", "container terminal"), page: "https://commons.wikimedia.org/wiki/File:Verhardingen,_containers,_haven,_West,_Bestanddeelnr_164-1244.jpg" },
  "ep-romania-logistics": { year: "1970s", subject: L("camioane", "грузовики", "trucks"), page: "https://commons.wikimedia.org/wiki/File:Vrachtwagens,_Bestanddeelnr_169-1269.jpg" },
};

/* ------------------------------------------------------------------ */
/* Page copy                                                            */
/* ------------------------------------------------------------------ */

export const historyCopy = {
  kicker: L("Istoria grupului", "История группы", "Group history"),
  title: { ro: ["Peste trei decenii", "de antreprenoriat."], ru: ["Более трёх десятилетий", "предпринимательства."], en: ["Over three decades", "of enterprise."] },
  lead: L(
    "De la comerț și producție — la finanțare, proiecte internaționale și imobiliare. Experiența acumulată în domenii și țări diferite a format, în timp, ceea ce este astăzi MEGAPARC.",
    "От торговли и производства — к финансированию, международным проектам и недвижимости. Опыт, накопленный в разных отраслях и странах, со временем сформировал то, чем сегодня является MEGAPARC.",
    "From retail and manufacturing to finance, international projects and real estate. Experience gathered across industries and countries shaped, over time, what MEGAPARC is today.",
  ),
  index: L("Capitole", "Главы", "Chapters"),
  chapter: L("Capitolul", "Глава", "Chapter"),
  linesTitle: L("Două linii ale aceleiași istorii.", "Две линии одной истории.", "Two lines of one story."),
  linesText: L(
    "Grupul înseamnă antreprenorii și companiile cu care totul a început în 1991; în 1995 i-a reunit o structură de investiții. MEGAPARC este compania imobiliară fondată de grup în 2005. Din 2020, imobiliarele sunt activitatea principală a grupului, iar MEGAPARC — centrul ei.",
    "Группа — это предприниматели и компании, с которых всё началось в 1991 году; в 1995‑м их объединила инвестиционная структура. MEGAPARC — компания недвижимости, которую группа основала в 2005 году. С 2020 года недвижимость — главное дело группы, а MEGAPARC — его центр.",
    "The group is the entrepreneurs and companies with which it all began in 1991; in 1995 an investment structure brought them together. MEGAPARC is the real-estate company the group founded in 2005. Since 2020 real estate has been the group's core business, with MEGAPARC at its centre.",
  ),
  lineGroup: L("Grupul · din 1991", "Группа · с 1991", "The group · since 1991"),
  lineHolding: L("Structura de investiții · 1995", "Инвестиционная структура · 1995", "Investment structure · 1995"),
  lineMegaparc: L("MEGAPARC · din 2005", "MEGAPARC · с 2005", "MEGAPARC · since 2005"),
  lineFocus: L("Focus pe imobiliare · din 2020", "Фокус на недвижимости · с 2020", "Real-estate focus · since 2020"),
  rule: L(
    "MEGAPARC a fost fondată în 2005. Anii de dinainte sunt istoria grupului.",
    "MEGAPARC основана в 2005 году. Годы до этого — история группы.",
    "MEGAPARC was founded in 2005. The years before are the group's history.",
  ),
  scopeGroup: L("Istoria grupului", "История группы", "Group history"),
  scopeMegaparc: L("MEGAPARC", "MEGAPARC", "MEGAPARC"),
  mapRegion: L(
    "Unde a început: Chișinău și portul Brăila. Harta arată istoria grupului, nu prezența actuală a MEGAPARC.",
    "Где всё началось: Кишинёв и порт Брэила. Карта показывает историю группы, а не текущее присутствие MEGAPARC.",
    "Where it began: Chișinău and the port of Brăila. The map shows the group's history, not MEGAPARC's current presence.",
  ),
  mapWorld: L(
    "Țările în care a lucrat grupul între 1991 și 2020. Astăzi toate obiectele MEGAPARC sunt în Republica Moldova.",
    "Страны, где работала группа с 1991 по 2020 год. Сегодня все объекты MEGAPARC — в Республике Молдова.",
    "The countries where the group worked between 1991 and 2020. Today every MEGAPARC property is in the Republic of Moldova.",
  ),
  places: {
    chisinau: L("Chișinău", "Кишинёв", "Chișinău"),
    braila: L("Brăila", "Брэила", "Brăila"),
    ukraine: L("Ucraina", "Украина", "Ukraine"),
    romania: L("România", "Румыния", "Romania"),
    turkey: L("Turcia", "Турция", "Turkey"),
    iraq: L("Irak", "Ирак", "Iraq"),
    dakar: L("Dakar, Senegal", "Дакар, Сенегал", "Dakar, Senegal"),
    china: L("China", "Китай", "China"),
    blackSea: L("Marea Neagră", "Чёрное море", "Black Sea"),
  },
  megaparcStatement: {
    ro: ["Să cumperi clădirea pe care n-o vrea nimeni.", "Să faci din ea un loc unde oamenii vor să vină."],
    ru: ["Купить здание, которое никому не нужно.", "Сделать из него место, куда хотят приходить."],
    en: ["Buy the building nobody wants.", "Make it a place people want to come to."],
  },
  focusStatement: {
    ro: ["Multe domenii au rămas în urmă.", "A rămas unul — imobiliarele."],
    ru: ["Много отраслей позади.", "Осталась одна — недвижимость."],
    en: ["Many industries behind us.", "One remains — real estate."],
  },
  todayLinks: [
    ["/projects", L("Toate proiectele", "Все проекты", "All projects")],
    ["/leasing#available", L("Spații libere", "Свободные помещения", "Available spaces")],
    ["/partnership", L("Parteneriat investițional", "Инвестиционное партнёрство", "Investment partnership")],
    ["/offer", L("Propuneți un obiect sau un teren", "Предложить объект или землю", "Offer a property or land")],
  ] as [string, Localized][],
  /** The end transition (TRUST & PROOF PASS 2026-10-09): history → MEGAPARC → real estate → today → current projects. */
  todayChain: [
    ["#origins", L("Istoria grupului", "История группы", "The group's history")],
    ["#megaparc", L("MEGAPARC", "MEGAPARC", "MEGAPARC")],
    ["#focus", L("Imobiliare", "Недвижимость", "Real estate")],
    ["#today", L("Astăzi", "Сегодня", "Today")],
    ["#today-projects", L("Proiectele actuale", "Текущие проекты", "Current projects")],
  ] as [string, Localized][],
  todayFigures: {
    operating: L("obiecte în funcțiune", "действующих объекта", "operating properties"),
    development: L("proiecte de dezvoltare", "проекта развития", "development projects"),
    area: L("suprafața obiectelor în funcțiune", "площадь действующих объектов", "operating property area"),
    spaces: L("spații libere", "свободные помещения", "available spaces"),
  },
  indexTitle: L("Toată cronica, pe o pagină.", "Вся хроника на одной странице.", "The whole chronicle on one page."),
  indexAll: L("Toate", "Все", "All"),
  closeTitle: L("Experiența multor domenii — într-o singură afacere.", "Опыт многих отраслей — в одном деле.", "The experience of many industries — in one business."),
};

/* ------------------------------------------------------------------ */
/* Chapters — final history correction (OWNER brief 2026-10-08)          */
/* ------------------------------------------------------------------ */

export type ChapterKey = "origins" | "group" | "finance" | "megaparc" | "expansion" | "international" | "consolidation" | "focus" | "today";
export type Chapter = {
  key: ChapterKey;
  no: string;
  /** Years as shown in the chapter label; empty for today (the current year is used). */
  range: string;
  label: Localized;
  title: Localized;
  lead: Localized;
  /** Episodes (entry ids) in reading order. */
  ids: string[];
  /** Visual tone: archive → expansion → international → MEGAPARC → focus → today. */
  tone: "archive" | "expansion" | "international" | "megaparc" | "focus" | "today";
};

export const chapters: Chapter[] = [
  {
    key: "origins",
    no: "01",
    range: "1991–1994",
    label: L("Originile afacerii", "Истоки бизнеса", "Business origins"),
    title: L("Comerț, producție, port.", "Торговля, производство, порт.", "Retail, manufacturing, a port."),
    lead: L(
      "Primii ani ai economiei de piață. Fondatorii pornesc de la ce lipsea atunci: magazine cu aprovizionare proprie, producție și logistică.",
      "Первые годы рыночной экономики. Основатели начинают с того, чего тогда не хватало: магазинов с собственными поставками, производства и логистики.",
      "The first years of the market economy. The founders start with what was missing: shops with their own supply, manufacturing and logistics.",
    ),
    ids: ["negruzzi", "modelier", "romitech", "brp", "mi-gross", "arcona"],
    tone: "archive",
  },
  {
    key: "group",
    no: "02",
    range: "1995",
    label: L("Grupul", "Группа", "The group"),
    title: L("Structura de investiții a grupului.", "Инвестиционная структура группы.", "The group's investment structure."),
    lead: L(
      "În 1995 afacerile fondatorilor sunt reunite într-o structură de investiții care le coordonează și atrage capital. În același an în portofoliu apar primele imobile.",
      "В 1995 году бизнесы основателей объединяет инвестиционная структура: она координирует направления и привлекает капитал. В том же году в портфеле появляется первая недвижимость.",
      "In 1995 the founders' businesses come together in an investment structure that coordinates them and raises capital. The same year the first real estate enters the portfolio.",
    ),
    ids: ["holding", "ym-capitol", "green-hills", "farmatrade"],
    tone: "archive",
  },
  {
    key: "finance",
    no: "03",
    range: "1996–1997",
    label: L("Finanțe și agrobusiness", "Финансы и агробизнес", "Finance and agribusiness"),
    title: L("Leasing, cereale, zahăr.", "Лизинг, зерно, сахар.", "Leasing, grain, sugar."),
    lead: L(
      "Grupul intră în serviciile financiare și în agrobusiness: leasing de echipamente pentru companii, ciclul complet al cerealelor în Moldova și producția de zahăr în Ucraina.",
      "Группа выходит в финансовые услуги и агробизнес: лизинг техники для предприятий, полный цикл зерна в Молдове и производство сахара в Украине.",
      "The group moves into financial services and agribusiness: equipment leasing for companies, the full grain cycle in Moldova and sugar production in Ukraine.",
    ),
    ids: ["imc-leasing", "soiuz-agros", "inseko"],
    tone: "archive",
  },
  {
    key: "megaparc",
    no: "04",
    range: "2005",
    label: L("MEGAPARC", "MEGAPARC", "MEGAPARC"),
    title: L("Apare MEGAPARC.", "Появляется MEGAPARC.", "MEGAPARC is founded."),
    lead: L(
      "Imobiliarele devin o direcție de afaceri separată. Compania începe să lucreze cu obiecte comerciale: le cumpără, le renovează, le dezvoltă și le închiriază.",
      "Недвижимость становится отдельным направлением бизнеса. Компания начинает работать с коммерческими объектами: приобретать, обновлять, развивать и сдавать их в аренду.",
      "Real estate becomes a business line of its own. The company starts working with commercial property: buying, renovating, developing and leasing it.",
    ),
    ids: ["megaparc", "imc-market"],
    tone: "megaparc",
  },
  {
    key: "expansion",
    no: "05",
    range: "2006–2016",
    label: L("Extindere", "Расширение", "Expansion"),
    title: L("Direcții noi.", "Новые направления.", "New lines of business."),
    lead: L(
      "Practică juridică, restaurante, investiții în start-up-uri — grupul crește în Moldova și, în paralel, iese pe piețe externe.",
      "Юридическая практика, ресторанный бизнес, инвестиции в стартапы — группа растёт в Молдове и параллельно выходит на внешние рынки.",
      "Legal practice, restaurants, start-up investment — the group grows in Moldova and, in parallel, moves into foreign markets.",
    ),
    ids: ["imc-legal", "flying-pig", "estate-industry"],
    tone: "expansion",
  },
  {
    key: "international",
    no: "06",
    range: "1991–2020",
    label: L("Experiență internațională", "Международный опыт", "International experience"),
    title: L("Dincolo de Moldova.", "За пределами Молдовы.", "Beyond Moldova."),
    lead: L(
      "Portul Brăila, zahărul în Ucraina, explorarea petrolieră în Irak, industria și logistica în Africa de Vest, aprovizionarea din China — grupul a lucrat acolo unde existau cerere și parteneri.",
      "Порт Брэила, сахар в Украине, нефтеразведка в Ираке, промышленность и логистика в Западной Африке, поставки из Китая — группа работала там, где были спрос и партнёры.",
      "The port of Brăila, sugar in Ukraine, oil exploration in Iraq, industry and logistics in West Africa, supply from China — the group worked wherever there was demand and partners.",
    ),
    ids: ["valahia", "west-africa", "sdc-senegal"],
    tone: "international",
  },
  {
    key: "consolidation",
    no: "07",
    range: "2017–2020",
    label: L("Consolidare", "Консолидация", "Consolidation"),
    title: L("Mai puține direcții, mai mult focus.", "Меньше направлений, больше фокуса.", "Fewer lines, more focus."),
    lead: L(
      "Grupul transferă afacerile mature și vinde activele necore. Ultimele proiecte comerciale și logistice leagă China, România și Europa de Est.",
      "Группа передаёт зрелые бизнесы и продаёт непрофильные активы. Последние торговые и логистические проекты связывают Китай, Румынию и Восточную Европу.",
      "The group hands over its mature businesses and sells non-core assets. The last trading and logistics projects link China, Romania and Eastern Europe.",
    ),
    ids: ["transfer", "china", "romania-logistics"],
    tone: "expansion",
  },
  {
    key: "focus",
    no: "08",
    range: "2020",
    label: L("Focus pe imobiliare", "Фокус на недвижимости", "Real-estate focus"),
    title: L("Imobiliarele devin activitatea principală.", "Недвижимость становится главным делом.", "Real estate becomes the core business."),
    lead: L(
      "În 2020 grupul iese din logistica internațională și din comerț. Rămâne imobiliarul — și centrul lui, MEGAPARC.",
      "В 2020 году группа выходит из международной логистики и розницы. Остаётся недвижимость — и её центр, MEGAPARC.",
      "In 2020 the group leaves international logistics and retail. Real estate remains — with MEGAPARC at its centre.",
    ),
    ids: ["focus-2020"],
    tone: "focus",
  },
  {
    key: "today",
    no: "09",
    range: "",
    label: L("Astăzi", "Сегодня", "Today"),
    title: L("MEGAPARC astăzi.", "MEGAPARC сегодня.", "MEGAPARC today."),
    lead: L(
      "MEGAPARC cumpără imobile și terenuri, dezvoltă proiecte proprii și închiriază spații comerciale în clădirile sale. Obiectele în funcțiune sunt în Chișinău; proiectele de dezvoltare — VATRA și Drochia Gateway.",
      "MEGAPARC приобретает недвижимость и землю, развивает собственные проекты и сдаёт в аренду коммерческие площади в своих зданиях. Действующие объекты — в Кишинёве; проекты развития — VATRA и Drochia Gateway.",
      "MEGAPARC acquires real estate and land, develops its own projects and leases commercial space in its buildings. The operating properties are in Chișinău; the development projects are VATRA and Drochia Gateway.",
    ),
    ids: [],
    tone: "today",
  },
];

/** Location in one format: CITY, COUNTRY when the city is confirmed, otherwise COUNTRY. */
export const episodePlace: Record<string, Localized> = {
  negruzzi: L("Chișinău, Moldova", "Кишинёв, Молдова", "Chișinău, Moldova"),
  modelier: L("Moldova", "Молдова", "Moldova"),
  romitech: L("Brăila, România", "Брэила, Румыния", "Brăila, Romania"),
  brp: L("Moldova", "Молдова", "Moldova"),
  "mi-gross": L("Moldova", "Молдова", "Moldova"),
  arcona: L("Moldova", "Молдова", "Moldova"),
  holding: L("Chișinău, Moldova", "Кишинёв, Молдова", "Chișinău, Moldova"),
  "ym-capitol": L("Chișinău, Moldova", "Кишинёв, Молдова", "Chișinău, Moldova"),
  "green-hills": L("Moldova", "Молдова", "Moldova"),
  farmatrade: L("Moldova", "Молдова", "Moldova"),
  "imc-leasing": L("Moldova", "Молдова", "Moldova"),
  "soiuz-agros": L("Moldova", "Молдова", "Moldova"),
  inseko: L("Ucraina", "Украина", "Ukraine"),
  megaparc: L("Chișinău, Moldova", "Кишинёв, Молдова", "Chișinău, Moldova"),
  "imc-market": L("Moldova", "Молдова", "Moldova"),
  "imc-legal": L("Chișinău, Moldova", "Кишинёв, Молдова", "Chișinău, Moldova"),
  "flying-pig": L("Chișinău, Moldova", "Кишинёв, Молдова", "Chișinău, Moldova"),
  valahia: L("Irak", "Ирак", "Iraq"),
  "west-africa": L("Africa de Vest", "Западная Африка", "West Africa"),
  "sdc-senegal": L("Dakar, Senegal", "Дакар, Сенегал", "Dakar, Senegal"),
  "estate-industry": L("Moldova", "Молдова", "Moldova"),
  transfer: L("Moldova", "Молдова", "Moldova"),
  china: L("China — Europa de Est", "Китай — Восточная Европа", "China — Eastern Europe"),
  "romania-logistics": L("România", "Румыния", "Romania"),
  "focus-2020": L("Moldova", "Молдова", "Moldova"),
};

/**
 * One image per episode. Archive images: period photographs that stand in for
 * the group's own archive (provenance in historyImages / scripts/history-imagery.mjs,
 * never shown on the page). MEGAPARC episodes use real MEGAPARC photographs.
 */
/** Site edition, read directly (this module also loads in Node for the production gate). */
const productionEdition = (process.env.NEXT_PUBLIC_SITE_EDITION ?? "production") === "production";

const allEpisodeImages: Record<string, { kind: "archive"; key: string } | { kind: "asset"; slug: string }> = {
  negruzzi: { kind: "archive", key: "era-retail" },
  modelier: { kind: "archive", key: "ep-modelier" },
  romitech: { kind: "archive", key: "era-port" },
  brp: { kind: "archive", key: "era-bottling" },
  "mi-gross": { kind: "archive", key: "ep-mi-gross" },
  arcona: { kind: "archive", key: "ep-arcona" },
  holding: { kind: "archive", key: "ep-holding" },
  "ym-capitol": { kind: "archive", key: "ep-ym-capitol" },
  "green-hills": { kind: "archive", key: "ep-green-hills" },
  farmatrade: { kind: "archive", key: "ep-farmatrade" },
  "imc-leasing": { kind: "archive", key: "ep-imc-leasing" },
  "soiuz-agros": { kind: "archive", key: "ep-soiuz-agros" },
  inseko: { kind: "archive", key: "era-sugar" },
  megaparc: { kind: "asset", slug: "moscova-9" },
  "imc-market": { kind: "archive", key: "ep-imc-market" },
  "imc-legal": { kind: "archive", key: "ep-imc-legal" },
  "flying-pig": { kind: "archive", key: "ep-flying-pig" },
  valahia: { kind: "archive", key: "era-energy" },
  "west-africa": { kind: "archive", key: "ep-west-africa" },
  "sdc-senegal": { kind: "archive", key: "era-distribution" },
  "estate-industry": { kind: "archive", key: "ep-estate-industry" },
  transfer: { kind: "archive", key: "ep-transfer" },
  china: { kind: "archive", key: "ep-china" },
  "romania-logistics": { kind: "archive", key: "ep-romania-logistics" },
  "focus-2020": { kind: "asset", slug: "dacia-31" },
};

/**
 * Production edition (OWNER "PRODUCTION V1" §3): the period images are placeholders for the group archive and are
 * not approved for production — episodes keep their confirmed text and show no image (never an invented one).
 * The real MEGAPARC photographs (asset episodes) stay.
 */
export const episodeImage: Record<string, { kind: "archive"; key: string } | { kind: "asset"; slug: string }> = productionEdition
  ? Object.fromEntries(Object.entries(allEpisodeImages).filter(([, image]) => image.kind === "asset"))
  : allEpisodeImages;

/** The archive photograph that opens the page (a period image) — preview edition only. */
export const historyHeroImage: HistoryImageKey | null = productionEdition ? null : "era-port";

/** The period photographs of the Home and About history teasers — preview edition only. */
export const teaserImage: Record<"home" | "about", HistoryImageKey | null> = productionEdition ? { home: null, about: null } : { home: "era-port", about: "era-retail" };

/** The archive interlude before 2005 (a period image) — preview edition only. */
export const interludeImage: HistoryImageKey | null = productionEdition ? null : "era-construction";

/** Heritage dates for the opening (the agreed distinction: group · MEGAPARC · focus). */
export const heritage: { year: string; label: Localized }[] = [
  { year: "1991", label: L("Originile afacerii fondatorilor", "Истоки бизнеса основателей", "The founders' business origins") },
  { year: "1995", label: L("Structura de investiții a grupului", "Инвестиционная структура группы", "The group's investment structure") },
  { year: "2005", label: L("Este fondată MEGAPARC", "Основана MEGAPARC", "MEGAPARC is founded") },
  { year: "2020", label: L("Imobiliarele — activitatea principală", "Недвижимость — главное дело", "Real estate — the core business") },
];

/** International chapter: confirmed places with their years (owner source). */
export const internationalPlaces: { key: string; years: string }[] = [
  { key: "romania", years: "1991 · 2020" },
  { key: "ukraine", years: "1997" },
  { key: "iraq", years: "2007" },
  { key: "dakar", years: "2007" },
  { key: "china", years: "2019" },
];
