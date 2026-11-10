import { publicAsset, type Localized, type SiteLocale } from "@/lib/site-data";

/**
 * Public asset and project data — editorial profiles.
 *
 * Commercial proposals are FACT, TECHNICAL and COMMERCIAL REFERENCE sources
 * only. Their structure and tenant-specific language are not reproduced here.
 * OWNER decision: NO PUBLIC RENTAL PRICES. No €/m², rent, asking price,
 * deposits, first/last month or payment terms are stored in this file.
 * Internal financial indicators are never stored here.
 * Editorial source language: Russian (OWNER_EDITORIAL_COPY_BRIEF.md).
 * Governance: docs/ASSET_EDITORIAL_SYSTEM.md, docs/CLAUDE_CONTENT_REVIEW.md.
 */

export type AssetSlug = "dacia-31" | "moscova-9" | "moscova-20" | "creanga-78";

export type Fact = { label: Localized; value: Localized };

/** Approved public address used for Google Maps deep links. Only set when the address is confirmed. */
export type MapLocation = { address: string; query: string };

export function googleMapsUrl(location: MapLocation) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location.query)}`;
}

export function googleDirectionsUrl(location: MapLocation) {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(location.query)}`;
}

/** Confirmed availability facts only. Never a price. */
export type AssetAvailability = {
  headline: Localized;
  area: Localized;
  from?: Localized;
};

export type AssetMedia = {
  /** Largest master derivative. */
  src: string;
  /** Card / grid derivative. */
  card: string;
  /** Portrait crop for phone heroes. */
  mobile: string;
  /** Wide editorial crop (21:9). */
  wide: string;
  /** Upright crop (3:4) for tall cards — art-directed per photograph (scripts/photo-grade.mjs). */
  portrait: string;
  position?: string;
};

export type PortfolioAsset = {
  slug: AssetSlug;
  name: string;
  district: Localized;
  city: Localized;
  media: AssetMedia | null;
  status: Localized;
  /** Short positioning line used in lists and metadata. */
  positioning: Localized;
  /** The property in one plain sentence. */
  headline: Localized;
  /** Short editorial line. */
  narrative: Localized;
  use: Localized;
  /** Who the property suits. */
  audience: Localized;
  lead: Localized;
  /** About the property — what it is, why the location, how it can work. */
  story: Record<SiteLocale, string[]>;
  keyFacts: Fact[];
  location: Localized;
  connectivity: Localized[];
  map: MapLocation | null;
  building: { text: Localized; programme: Fact[]; features: Localized[] };
  operatingLogic: { text: Localized; points: Localized[] };
  character: Localized;
  relevance: Localized;
  availability: AssetAvailability | null;
  /** Conditions attached to technical claims (audit, estimates). */
  caveat: Localized | null;
};

const operating: Localized = { ro: "Obiect în funcțiune", ru: "Действующий объект", en: "Operating property" };

function media(folder: string, base: string, position?: string): AssetMedia {
  return {
    src: publicAsset(`/assets/${folder}/${base}.webp`),
    card: publicAsset(`/assets/${folder}/${base}-card.webp`),
    mobile: publicAsset(`/assets/${folder}/${base}-mobile.webp`),
    wide: publicAsset(`/assets/${folder}/${base}-wide.webp`),
    portrait: publicAsset(`/assets/${folder}/${base}-portrait.webp`),
    position,
  };
}

export const portfolioAssets: PortfolioAsset[] = [
  {
    slug: "dacia-31",
    name: "Dacia 31",
    district: { ro: "Botanica", ru: "Ботаника", en: "Botanica" },
    city: { ro: "Chișinău", ru: "Кишинёв", en: "Chișinău" },
    media: media("portfolio", "dacia-31", "50% 56%"),
    status: operating,
    positioning: { ro: "Clădire de birouri independentă", ru: "Отдельное офисное здание", en: "Stand-alone office building" },
    headline: {
      ro: "O clădire separată pentru o singură companie.",
      ru: "Отдельное здание для одной компании.",
      en: "A stand-alone building for one company.",
    },
    narrative: {
      ro: "O clădire pentru întreaga companie.",
      ru: "Одно здание для всей компании.",
      en: "One building for the whole company.",
    },
    use: { ro: "Birouri · sediu central", ru: "Офисы · штаб-квартира", en: "Offices · headquarters" },
    audience: {
      ro: "Companiilor care au nevoie de o clădire proprie pentru sediu: organizații din tehnologie, servicii sau administrație, cu mai multe departamente.",
      ru: "Компаниям, которым нужно отдельное здание под собственный офис: технологические, сервисные и административные организации с несколькими подразделениями.",
      en: "Companies that need a building of their own for their offices: technology, services or administrative organisations with several departments.",
    },
    lead: {
      ro: "Clădire independentă de 5.541 m² în sectorul Botanica, pentru o singură organizație. Control unic al accesului, suprafețe mari, infrastructură inginerească existentă și o fațadă vizibilă.",
      ru: "Отдельно стоящее здание площадью 5 541 м² в секторе Ботаника для одной компании. Единый контроль доступа, крупные площади, готовая инженерная инфраструктура и заметный фасад.",
      en: "A 5,541 m² stand-alone building in Botanica for a single organisation. Single access control, large floor areas, existing building services and a prominent facade.",
    },
    story: {
      ro: [
        "Dacia 31 nu este un etaj într-un centru de afaceri, ci o clădire separată. Compania primește intrare proprie, control unic al accesului și o fațadă pe care își poate afișa numele.",
        "Suprafețele mari, distribuite pe patru niveluri principale și un etaj tehnic, permit ca toate departamentele companiei să lucreze în același obiect și ca spațiul să fie reorganizat pe măsură ce compania crește.",
        "Infrastructura inginerească a clădirii există deja: rețele și instalații, tubulatură de aer, trasee de alimentare electrică și curenți slabi. Capacitățile exacte se stabilesc printr-un audit tehnic și se adaptează la cerințele utilizatorului.",
      ],
      ru: [
        "Dacia 31 — не этаж в бизнес-центре, а отдельное здание. Компания получает собственный вход, единый контроль доступа и фасад, на котором может разместить своё название.",
        "Четыре больших уровня и технический этаж: все подразделения — в одном здании, а пространство можно перестраивать по мере роста.",
        "Инженерия в здании уже есть: сети, воздуховоды, трассы электроснабжения и слаботочных систем. Точные мощности покажет технический аудит — их адаптируют под пользователя.",
      ],
      en: [
        "Dacia 31 is not a floor in a business centre. It is a separate building: the company gets its own entrance, single access control and a facade that can carry its name.",
        "Large floor areas across four main levels and a technical floor allow every department of the company to work in one building and the space to be reorganised as the company grows.",
        "The building's services are already in place: utilities and systems, ductwork, power and low-voltage cabling routes. Exact capacities are established by a technical audit and adapted to the occupier's requirements.",
      ],
    },
    keyFacts: [
      { label: { ro: "Suprafața totală a obiectului", ru: "Общая площадь объекта", en: "Total property area" }, value: { ro: "5.541 m²", ru: "5 541 м²", en: "5,541 m²" } },
      { label: { ro: "Format", ru: "Формат", en: "Format" }, value: { ro: "Clădire independentă", ru: "Отдельно стоящее здание", en: "Stand-alone building" } },
      { label: { ro: "Niveluri", ru: "Уровни", en: "Levels" }, value: { ro: "Demisol + 3 etaje + etaj tehnic", ru: "Цоколь + 3 этажа + технический", en: "Lower ground + 3 floors + technical" } },
      { label: { ro: "Accese / circulații", ru: "Входы / коммуникации", en: "Entrances / circulation" }, value: { ro: "4+ posibilități", ru: "4+ варианта", en: "4+ possibilities" } },
    ],
    location: {
      ro: "Botanica este intrarea în Chișinău dinspre aeroport. Clădirea se află lângă arterele Dacia, Traian și Decebal, aproape de o alee pietonală largă, restaurante, cafenele și servicii.",
      ru: "Ботаника — въезд в Кишинёв со стороны аэропорта. Здание расположено у магистралей Дачия, Траян и Дечебал, рядом с широкой пешеходной аллеей, ресторанами, кафе и сервисами.",
      en: "Botanica is the entrance to Chișinău from the airport. The building sits by the Dacia, Traian and Decebal arteries, close to a wide pedestrian promenade, restaurants, cafés and services.",
    },
    connectivity: [
      { ro: "Botanica, intrarea în Chișinău dinspre aeroport", ru: "Ботаника — въезд в Кишинёв со стороны аэропорта", en: "Botanica, the entrance to Chișinău from the airport" },
      { ro: "Arterele urbane Dacia, Traian și Decebal", ru: "Городские магистрали Дачия, Траян и Дечебал", en: "Dacia, Traian and Decebal urban arteries" },
      { ro: "Alee pietonală largă", ru: "Широкая пешеходная аллея", en: "Wide pedestrian promenade" },
      { ro: "Restaurante, cafenele și servicii în apropiere", ru: "Рестораны, кафе и сервисы рядом", en: "Restaurants, cafés and services nearby" },
    ],
    map: { address: "Bd. Dacia 31, Chișinău", query: "Bd. Dacia 31, Chișinău, Moldova" },
    building: {
      text: {
        ro: "Pe fiecare nivel: zone de lucru deschise și spații auxiliare, zone vitrate, suprafețe mari și mai multe variante de intrare și circulație. Structura pe etaje permite organizarea departamentelor pe niveluri sau pe funcții.",
        ru: "На каждом уровне — открытые рабочие зоны и вспомогательные помещения, остеклённые зоны, крупные площади и несколько вариантов входов и коммуникаций. Поэтажная структура позволяет разместить подразделения по этажам или по функциям.",
        en: "On every level: open work areas and support rooms, glazed zones, large floor areas and several entrance and circulation options. The floor structure allows departments to be arranged by level or by function.",
      },
      programme: [
        { label: { ro: "Demisol", ru: "Цокольный этаж", en: "Lower ground floor" }, value: { ro: "1.041 m²", ru: "1 041 м²", en: "1,041 m²" } },
        { label: { ro: "Etajul 1", ru: "1‑й этаж", en: "1st floor" }, value: { ro: "1.138 m²", ru: "1 138 м²", en: "1,138 m²" } },
        { label: { ro: "Etajul 2", ru: "2‑й этаж", en: "2nd floor" }, value: { ro: "1.770 m²", ru: "1 770 м²", en: "1,770 m²" } },
        { label: { ro: "Etajul 3", ru: "3‑й этаж", en: "3rd floor" }, value: { ro: "1.014 m²", ru: "1 014 м²", en: "1,014 m²" } },
        { label: { ro: "Etaj tehnic", ru: "Технический этаж", en: "Technical floor" }, value: { ro: "260 m²", ru: "260 м²", en: "260 m²" } },
      ],
      features: [
        { ro: "Suprafețe mari, pe mai multe niveluri", ru: "Крупные площади на нескольких уровнях", en: "Large floor areas across several levels" },
        { ro: "Zone deschise, zone vitrate și spații auxiliare", ru: "Открытые, остеклённые и вспомогательные зоны", en: "Open, glazed and support areas" },
        { ro: "4+ variante de circulație și acces", ru: "4+ варианта коммуникаций и входов", en: "4+ circulation and entrance options" },
        { ro: "Rețele și instalații existente ale clădirii", ru: "Существующие инженерные сети и системы здания", en: "Existing utilities and building services" },
        { ro: "Tubulatură și distribuție a aerului existente", ru: "Существующие воздуховоды и распределение воздуха", en: "Existing ductwork and air distribution" },
        { ro: "Trasee de alimentare electrică și curenți slabi", ru: "Трассы электроснабжения и слаботочных систем", en: "Power and low-voltage cabling routes" },
      ],
    },
    operatingLogic: {
      text: {
        ro: "Clădirea funcționează ca un întreg: o singură companie, numele propriu pe fațadă, control unic al accesului și al securității, distribuție liberă a echipelor pe etaje.",
        ru: "Здание работает как единое целое: одна компания, собственное название на фасаде, единый контроль доступа и безопасности, свободное распределение команд по этажам.",
        en: "The building works as one whole: a single company, its own name on the facade, single control of access and security, teams arranged freely across the floors.",
      },
      points: [
        { ro: "Sediul central al unei singure companii", ru: "Штаб-квартира одной компании", en: "Headquarters of a single company" },
        { ro: "Numele propriu pe fațadă și control al accesului", ru: "Собственное название на фасаде и контроль доступа", en: "Own name on the facade and control of access" },
        { ro: "Creștere în aceeași clădire, fără relocare", ru: "Рост в том же здании без переезда", en: "Growth in the same building, without relocating" },
      ],
    },
    character: {
      ro: "Principalul avantaj este independența: clădirea nu împarte holul, fațada sau adresa cu alți chiriași. O singură organizație o poate ocupa în întregime.",
      ru: "Главное преимущество — самостоятельность: здание не делит холл, фасад или адрес с другими арендаторами. Его может занять одна организация целиком.",
      en: "The main advantage is independence: the building shares no lobby, facade or address with other tenants. One organisation can occupy it in full.",
    },
    relevance: {
      ro: "Suprafețele mari și infrastructura existentă permit reorganizarea spațiului fără a modifica clădirea, pe măsură ce structura companiei se schimbă.",
      ru: "Крупные площади и готовая инженерная инфраструктура позволяют перестраивать пространство без изменения здания — по мере того как меняется структура компании.",
      en: "Large floor areas and existing services allow the space to be reorganised without altering the building as the company's structure changes.",
    },
    availability: {
      headline: {
        ro: "5.223 m² sunt disponibili de la 1 ianuarie 2027 pentru sediul unei singure companii.",
        ru: "5 223 м² доступны с 1 января 2027 года для размещения одной компании.",
        en: "5,223 m² are available from 1 January 2027 for a single company's headquarters.",
      },
      area: { ro: "5.223 m²", ru: "5 223 м²", en: "5,223 m²" },
      from: { ro: "1 ianuarie 2027", ru: "1 января 2027", en: "1 January 2027" },
    },
    caveat: {
      ro: "Capacitățile tehnice și redundanța instalațiilor fac obiectul unui audit tehnic.",
      ru: "Мощности и резервирование инженерных систем уточнит технический аудит.",
      en: "Technical capacities and the redundancy of building services are subject to a technical audit.",
    },
  },
  {
    slug: "moscova-9",
    name: "Moscova 9",
    district: { ro: "Rîșcani", ru: "Рышкань", en: "Rîșcani" },
    city: { ro: "Chișinău", ru: "Кишинёв", en: "Chișinău" },
    media: media("portfolio", "moscova-9", "50% 50%"),
    status: operating,
    positioning: { ro: "Obiect comercial independent", ru: "Отдельно стоящий торговый объект", en: "Stand-alone retail building" },
    headline: {
      ro: "Un obiect comercial independent pe prima linie a bulevardului.",
      ru: "Отдельно стоящий торговый объект на первой линии бульвара.",
      en: "A stand-alone retail building on the boulevard's first line.",
    },
    narrative: {
      ro: "Fațadă proprie, firmă proprie, intrare proprie.",
      ru: "Собственный фасад, собственная вывеска, собственный вход.",
      en: "Its own facade, its own signage, its own entrance.",
    },
    use: { ro: "Comerț · format independent", ru: "Торговля · отдельно стоящий формат", en: "Retail · stand-alone format" },
    audience: {
      ro: "Brandurilor de retail care preferă o adresă proprie pe bulevard în locul unui spațiu într-un centru comercial: magazin flagship, showroom sau comerț specializat.",
      ru: "Ритейл-брендам, которым нужен собственный адрес на бульваре вместо места в торговом центре: флагманский магазин, шоурум или специализированная торговля.",
      en: "Retail brands that want their own boulevard address instead of a unit in a shopping centre: a flagship store, a showroom or specialist retail.",
    },
    lead: {
      ro: "Obiect comercial independent pe bulevardul Moscova, în afara centrelor comerciale: fațadă lungă, două intrări pentru clienți și zonă separată de descărcare.",
      ru: "Отдельно стоящий торговый объект на бульваре Москова, вне торговых центров: протяжённый фасад, два входа для покупателей и отдельная зона разгрузки.",
      en: "A stand-alone retail property on Moscova Boulevard, outside shopping centres: a long frontage, two customer entrances and a separate unloading zone.",
    },
    story: {
      ro: [
        "Într-un centru comercial, un brand închiriază un spațiu. La Moscova 9, brandul primește o clădire separată: fațadă și firmă proprii, intrare proprie și propria organizare a sălii de vânzare, în cadrul tehnic și juridic convenit.",
        "Sala principală de vânzare de 737,07 m² este completată de o zonă de descărcare cu rampă și de spații pentru stoc, logistică, birou și pază. Marfa și clienții circulă pe trasee diferite.",
        "Bulevardul aduce un flux constant de mașini și pietoni, parcare de-a lungul drumului și un cartier rezidențial dens în jur. Fațada lungă de pe prima linie se vede bine din stradă.",
      ],
      ru: [
        "В торговом центре бренд арендует секцию. На Moscova 9 бренд получает отдельное здание: собственное оформление фасада и вывески, свой вход и свой торговый зал — в рамках согласованных технических и юридических условий.",
        "Основной торговый зал площадью 737,07 м² дополнен зоной разгрузки с рампой и помещениями для склада, логистики, офиса и охраны. Товар и покупатели не пересекаются.",
        "Бульвар даёт постоянный поток автомобилей и пешеходов, парковку вдоль дороги и плотный жилой район вокруг. Протяжённый фасад на первой линии хорошо виден с улицы.",
      ],
      en: [
        "In a shopping centre a brand rents a unit. At Moscova 9 the brand gets a separate building: its own facade and signage, its own entrance and its own layout of the sales floor, within the agreed technical and legal framework.",
        "The main sales floor of 737.07 m² is complemented by an unloading zone with a ramp and rooms for stock, logistics, office and security. Goods and customers move along different routes.",
        "The boulevard brings a steady flow of cars and pedestrians, parking along the road and a dense residential district around it. The long first-line frontage is clearly visible from the street.",
      ],
    },
    keyFacts: [
      { label: { ro: "Sală principală de vânzare", ru: "Основной торговый зал", en: "Main sales floor" }, value: { ro: "737,07 m²", ru: "737,07 м²", en: "737.07 m²" } },
      { label: { ro: "Zonă de descărcare", ru: "Зона разгрузки", en: "Loading zone" }, value: { ro: "69,46 m² · rampă", ru: "69,46 м² · рампа", en: "69.46 m² · ramp" } },
      { label: { ro: "Intrări clienți", ru: "Входы для покупателей", en: "Customer entrances" }, value: { ro: "2, dinspre bulevard", ru: "2, с бульвара", en: "2, from the boulevard" } },
    ],
    location: {
      ro: "Sectorul Rîșcani, bulevardul Moscova: flux constant de mașini și pietoni, parcare de-a lungul bulevardului și un cartier rezidențial dens. Fațada lungă se vede bine de pe prima linie.",
      ru: "Сектор Рышкань, бульвар Москова: постоянный автомобильный и пешеходный поток, парковка вдоль бульвара и плотный жилой район. Протяжённый фасад хорошо виден с первой линии.",
      en: "Rîșcani district, Moscova Boulevard: a steady flow of cars and pedestrians, parking along the boulevard and a dense residential district. The long frontage is clearly visible from the first line.",
    },
    connectivity: [
      { ro: "Rîșcani, front la bulevardul Moscova", ru: "Рышкань, фасад на бульвар Москова", en: "Rîșcani, frontage on Moscova Boulevard" },
      { ro: "Flux constant de mașini și pietoni", ru: "Постоянный автомобильный и пешеходный поток", en: "Steady flow of cars and pedestrians" },
      { ro: "Parcare de-a lungul bulevardului", ru: "Парковка вдоль бульвара", en: "Parking along the boulevard" },
      { ro: "Cartier rezidențial dens", ru: "Плотный жилой район", en: "Dense residential district" },
    ],
    map: { address: "Bd. Moscova 9, Chișinău", query: "Bd. Moscova 9, Chișinău, Moldova" },
    building: {
      text: {
        ro: "Clădire independentă, în afara centrelor comerciale. Sala principală de vânzare, zona de descărcare cu rampă și spațiile auxiliare formează un singur circuit de lucru.",
        ru: "Отдельно стоящее здание вне торговых центров. Основной торговый зал, зона разгрузки с рампой и вспомогательные помещения образуют единый рабочий контур.",
        en: "A stand-alone building outside shopping centres. The main sales floor, the unloading zone with ramp and the support rooms form one working circuit.",
      },
      programme: [],
      features: [
        { ro: "Fațadă lungă la bulevard, vizibilă de pe prima linie", ru: "Протяжённый фасад на бульвар, видимость с первой линии", en: "Long boulevard frontage, visible from the first line" },
        { ro: "Două intrări pentru clienți", ru: "Два входа для покупателей", en: "Two customer entrances" },
        { ro: "Zonă de descărcare cu rampă", ru: "Зона разгрузки с рампой", en: "Unloading zone with ramp" },
        { ro: "Spații auxiliare: logistică, stoc, birou, pază", ru: "Вспомогательные помещения: логистика, склад, офис, охрана", en: "Support rooms: logistics, stock, office, security" },
        { ro: "Parcare de-a lungul bulevardului", ru: "Парковка вдоль бульвара", en: "Parking along the boulevard" },
      ],
    },
    operatingLogic: {
      text: {
        ro: "Clienții intră dinspre bulevard, marfa intră prin rampă. Fluxurile nu se intersectează, iar brandul își stabilește formatul, programul și organizarea sălii în cadrul condițiilor convenite.",
        ru: "Покупатели входят с бульвара, товары поступают через рампу. Потоки не пересекаются, а бренд определяет формат, режим работы и организацию зала в рамках согласованных условий.",
        en: "Customers enter from the boulevard, goods arrive via the ramp. The flows never cross, and the brand sets its format, hours and floor layout within the agreed conditions.",
      },
      points: [
        { ro: "Fluxul clienților separat de fluxul de marfă", ru: "Поток покупателей отделён от товарного", en: "Customer flow separate from goods flow" },
        { ro: "Închiriere integrală sau a unei părți convenite", ru: "Аренда целиком или согласованной частью", en: "Lease as a whole or as an agreed part" },
        { ro: "Formatul îl stabilește brandul: flagship, showroom, comerț specializat", ru: "Формат задаёт бренд: флагман, шоурум, специализированная торговля", en: "Format set by the brand: flagship, showroom, specialist retail" },
      ],
    },
    character: {
      ro: "Principalul avantaj este independența față de centrele comerciale: brandul își amenajează fațada și firma, își organizează intrarea și sala de vânzare, în cadrul tehnic și juridic convenit.",
      ru: "Главное преимущество — независимость от торговых центров: бренд сам оформляет фасад и вывеску, организует вход и торговый зал в рамках согласованных технических и юридических условий.",
      en: "The main advantage is independence from shopping centres: the brand designs its own facade and signage and organises its entrance and sales floor within the agreed technical and legal framework.",
    },
    relevance: {
      ro: "O clădire separată pe prima linie a bulevardului rămâne căutată indiferent de formatul comercial.",
      ru: "Отдельное здание на первой линии бульвара остаётся востребованным при любом торговом формате.",
      en: "A separate building on the boulevard's first line stays in demand whatever the retail format.",
    },
    availability: null, // OWNER 2026-10-09: 100 % occupied
    caveat: null,
  },
  {
    slug: "moscova-20",
    name: "Moscova 20",
    district: { ro: "Rîșcani", ru: "Рышкань", en: "Rîșcani" },
    city: { ro: "Chișinău", ru: "Кишинёв", en: "Chișinău" },
    // OWNER R3.1 §5 (2026-11-09): the elevated facade shot (portfolio/moscova-20 and its m20-facade / m20-approach crops)
    // is OWNER_REJECTED_FOR_LARGE_FORMAT — the property is represented by its real ground-floor hall (OWNER photograph).
    media: media("portfolio", "moscova-20-hall", "50% 55%"),
    status: operating,
    positioning: { ro: "Spațiu comercial pe prima linie", ru: "Торговое помещение первой линии", en: "First-line retail space" },
    headline: {
      ro: "Spațiu comercial pe prima linie, pe bulevardul Moscova.",
      ru: "Торговое помещение первой линии на бульваре Москова.",
      en: "A first-line retail space on Moscova Boulevard.",
    },
    narrative: {
      ro: "Vitrină spre bulevard, flux zilnic al cartierului.",
      ru: "Витрина к бульвару и ежедневный поток района.",
      en: "A shop window to the boulevard and the neighbourhood's daily flow.",
    },
    use: { ro: "Comerț · servicii · prima linie", ru: "Торговля · услуги · первая линия", en: "Retail · services · first line" },
    audience: {
      ro: "Retailului alimentar, operatorilor de servicii, farmaciilor și showroom-urilor care lucrează cu fluxul zilnic al locuitorilor din cartier.",
      ru: "Продуктовому ритейлу, сервисным операторам, аптекам и шоурумам, которые работают на ежедневном потоке жителей района.",
      en: "Food retailers, service operators, pharmacies and showrooms that work with the daily flow of the neighbourhood's residents.",
    },
    lead: {
      ro: "Spațiu comercial de 625,7 m² la intersecția bulevardului Moscova cu strada Matei Basarab: fațadă panoramică, intrare pentru clienți și acces separat de serviciu.",
      ru: "Торговое помещение площадью 625,7 м² на пересечении бульвара Москова и улицы Матей Басараб: панорамный фасад, вход для покупателей и отдельный служебный доступ.",
      en: "A 625.7 m² retail space at the intersection of Moscova Boulevard and Matei Basarab Street: a panoramic frontage, a customer entrance and separate service access.",
    },
    story: {
      ro: [
        "Moscova 20 se află pe bulevardul pe care locuitorii cartierului îl parcurg zilnic: transport public în apropiere, blocuri dense, magazine și servicii, parcare dedicată.",
        "Fațada panoramică transformă spațiul într-o vitrină continuă. Intrarea pentru clienți și accesul separat de serviciu, cu rampă, despart aprovizionarea de clienți.",
        "Spațiul ocupă parterul și demisolul: 458,86 m² suprafață netă de vânzare și o terasă. Se potrivește pentru retail alimentar, servicii, showroom sau comerț specializat.",
      ],
      ru: [
        "Moscova 20 стоит на бульваре, по которому жители района проходят ежедневно: рядом общественный транспорт, плотная жилая застройка, магазины и сервисы, выделенная парковка.",
        "Панорамный фасад превращает помещение в сплошную витрину. Вход для покупателей и отдельный служебный доступ с рампой разводят покупателей и товар.",
        "Помещение занимает первый и цокольный этажи: чистая торговая площадь 458,86 м² и терраса. Подходит для продуктового ритейла, услуг, шоурума или специализированной торговли.",
      ],
      en: [
        "Moscova 20 stands on the boulevard the neighbourhood's residents walk every day: public transport close by, dense housing, shops and services, dedicated parking.",
        "The panoramic frontage turns the space into a continuous shop window. The customer entrance and the separate service access with ramp keep deliveries and customers apart.",
        "The space occupies the ground and lower-ground floors: 458.86 m² of net sales area and a terrace. It suits food retail, services, a showroom or specialist retail.",
      ],
    },
    keyFacts: [
      { label: { ro: "Spațiu comercial", ru: "Торговое помещение", en: "Retail premises" }, value: { ro: "625,7 m²", ru: "625,7 м²", en: "625.7 m²" } },
      { label: { ro: "Suprafață netă de vânzare", ru: "Чистая торговая площадь", en: "Net sales area" }, value: { ro: "458,86 m²", ru: "458,86 м²", en: "458.86 m²" } },
      { label: { ro: "Alimentare electrică", ru: "Электроснабжение", en: "Power supply" }, value: { ro: "3 faze · 38 kW (documente)", ru: "3 фазы · 38 кВт (по документам)", en: "3 phases · 38 kW (documented)" } },
    ],
    location: {
      ro: "Sectorul Rîșcani, intersecția bulevardului Moscova cu strada Matei Basarab: transport public în apropiere, zonă rezidențială densă, magazine și servicii în jur, parcare dedicată.",
      ru: "Сектор Рышкань, пересечение бульвара Москова и улицы Матей Басараб: общественный транспорт рядом, плотная жилая застройка, магазины и сервисы вокруг, выделенная парковка.",
      en: "Rîșcani district, at the intersection of Moscova Boulevard and Matei Basarab Street: public transport close by, dense housing, shops and services around, dedicated parking.",
    },
    connectivity: [
      { ro: "Intersecția bd. Moscova cu str. Matei Basarab", ru: "Пересечение бул. Москова и ул. Матей Басараб", en: "Intersection of Moscova Boulevard and Matei Basarab Street" },
      { ro: "Poziție pe prima linie", ru: "Положение на первой линии", en: "First-line position" },
      { ro: "Transport public în apropiere", ru: "Общественный транспорт рядом", en: "Public transport close by" },
      { ro: "Cartier rezidențial dens și parcare", ru: "Плотная жилая застройка и парковка", en: "Dense housing and parking" },
    ],
    map: { address: "Bd. Moscova 20, Chișinău", query: "Bd. Moscova 20, Chișinău, Moldova" },
    building: {
      text: {
        ro: "Parter și demisol, terasă, fațadă panoramică. Trasee existente de ventilație, utilități și curenți slabi; alimentare electrică de 3 faze, 38 kW conform documentelor.",
        ru: "Первый и цокольный этажи, терраса, панорамный фасад. Существующие трассы вентиляции, инженерных сетей и слаботочных систем; электроснабжение 3 фазы, 38 кВт по документам.",
        en: "Ground and lower-ground floors, terrace, panoramic frontage. Existing ventilation, utility and low-voltage routes; 3-phase power, 38 kW documented.",
      },
      programme: [
        { label: { ro: "Parter", ru: "Первый этаж", en: "Ground floor" }, value: { ro: "240,96 m² · vânzare 195,46 m²", ru: "240,96 м² · торговая 195,46 м²", en: "240.96 m² · sales 195.46 m²" } },
        { label: { ro: "Demisol", ru: "Цокольный этаж", en: "Lower ground" }, value: { ro: "293,70 m² · vânzare 263,40 m²", ru: "293,70 м² · торговая 263,40 м²", en: "293.70 m² · sales 263.40 m²" } },
        { label: { ro: "Terasă", ru: "Терраса", en: "Terrace" }, value: { ro: "91,03 m²", ru: "91,03 м²", en: "91.03 m²" } },
        { label: { ro: "Înălțime utilă", ru: "Высота помещений", en: "Ceiling height" }, value: { ro: "parter cca. 2,64 m · demisol cca. 2,67 m", ru: "1‑й этаж ок. 2,64 м · цоколь ок. 2,67 м", en: "ground approx. 2.64 m · lower ground approx. 2.67 m" } },
      ],
      features: [
        { ro: "Fațadă panoramică cu loc pentru firmă", ru: "Панорамный фасад с местом для вывески", en: "Panoramic frontage with room for signage" },
        { ro: "Intrare pentru clienți și acces separat de serviciu cu rampă", ru: "Вход для покупателей и отдельный служебный доступ с рампой", en: "Customer entrance and separate service access with ramp" },
        { ro: "Parter și demisol", ru: "Первый и цокольный этажи", en: "Ground and lower-ground floors" },
        { ro: "Terasă", ru: "Терраса", en: "Terrace" },
        { ro: "Trasee de ventilație, utilități și curenți slabi", ru: "Трассы вентиляции, инженерных сетей и слаботочных систем", en: "Ventilation, utility and low-voltage routes" },
      ],
    },
    operatingLogic: {
      text: {
        ro: "Spațiul lucrează cu fluxul zilnic al cartierului: clienții intră din stradă, marfa intră prin rampă, terasa se deschide spre stradă.",
        ru: "Помещение работает на ежедневном потоке района: покупатели входят с улицы, товары поступают через рампу, терраса выходит на улицу.",
        en: "The space works with the neighbourhood's daily flow: customers enter from the street, goods arrive via the ramp, the terrace opens onto the street.",
      },
      points: [
        { ro: "Retail alimentar, servicii, showroom sau comerț specializat", ru: "Продуктовый ритейл, услуги, шоурум или специализированная торговля", en: "Food retail, services, showroom or specialist retail" },
        { ro: "Fluxul de marfă separat de cel al clienților", ru: "Товарный поток отделён от покупательского", en: "Goods flow separate from customer flow" },
        { ro: "Pregătit pentru ocupare și amenajare în identitatea brandului", ru: "Готово к заселению и оформлению под бренд", en: "Ready for occupation and brand fit-out" },
      ],
    },
    character: {
      ro: "Spațiu comercial pe prima linie, cu vitrină continuă spre bulevard, intrare prin terasă, acces separat de serviciu și parcare în apropiere.",
      ru: "Торговое помещение первой линии со сплошной витриной к бульвару, входом через террасу, отдельным служебным доступом и парковкой рядом.",
      en: "A first-line retail space with a continuous shop window to the boulevard, an entrance through the terrace, separate service access and parking close by.",
    },
    relevance: {
      ro: "Fluxul zilnic și prima linie își păstrează valoarea indiferent de format. Spațiul poate fi adaptat la ceea ce are nevoie cartierul.",
      ru: "Ежедневный поток и первая линия сохраняют ценность при любом формате. Помещение можно адаптировать под то, что нужно району.",
      en: "The daily flow and the first-line position keep their value whatever the format. The space can be adapted to what the neighbourhood needs.",
    },
    // status, area and date of the unit on offer live only in the unit record M20-01 (src/data/leasing-inventory.ts) — OWNER 2026-11-06
    availability: null,
    // the pedestrian estimate and the ≈ 50 kVA figure are retired (OWNER Moscova 20 mandate 2026-11-06 §4, §12)
    caveat: {
      ro: "Înălțimile libere sunt aproximative. Hota se confirmă pentru formatul concret.",
      ru: "Высота помещений — ориентировочная. Вытяжка подтверждается под конкретный формат.",
      en: "Clear heights are approximate. Extraction is confirmed for the specific format.",
    },
  },
  {
    slug: "creanga-78",
    name: "Creangă 78",
    district: { ro: "Chișinău", ru: "Кишинёв", en: "Chișinău" },
    city: { ro: "Chișinău", ru: "Кишинёв", en: "Chișinău" },
    media: media("portfolio", "creanga-78", "64% 50%"),
    status: operating,
    positioning: operating,
    headline: { ro: "Un obiect în funcțiune în Chișinău.", ru: "Действующий объект в Кишинёве.", en: "An operating property in Chișinău." },
    narrative: { ro: "Informațiile publice vor fi completate.", ru: "Публичная информация будет дополнена.", en: "Public information will be added." },
    use: { ro: "Comercial", ru: "Коммерческий", en: "Commercial" },
    audience: { ro: "", ru: "", en: "" },
    lead: {
      ro: "Obiect MEGAPARC în funcțiune, în Chișinău. Informațiile publice detaliate vor fi publicate după aprobarea datelor și a fotografiilor.",
      ru: "Действующий объект MEGAPARC в Кишинёве. Подробная публичная информация будет опубликована после утверждения данных и фотографий.",
      en: "An operating MEGAPARC property in Chișinău. Detailed public information will be published once the data and photography are approved.",
    },
    story: {
      ro: ["Creangă 78 este un obiect MEGAPARC în funcțiune. Datele despre localizare, clădire și destinație vor fi publicate pe măsură ce sunt aprobate."],
      ru: ["Creangă 78 — действующий объект MEGAPARC. Сведения о расположении, здании и назначении будут опубликованы по мере утверждения."],
      en: ["Creangă 78 is an operating MEGAPARC property. Details on location, building and use will be published as they are approved."],
    },
    keyFacts: [],
    location: {
      ro: "Chișinău. Informații despre localizare și acces sunt disponibile la cerere.",
      ru: "Кишинёв. Информация о расположении и доступе предоставляется по запросу.",
      en: "Chișinău. Location and access information is available on request.",
    },
    connectivity: [],
    map: null,
    building: { text: { ro: "", ru: "", en: "" }, programme: [], features: [] },
    operatingLogic: { text: { ro: "", ru: "", en: "" }, points: [] },
    character: { ro: "", ru: "", en: "" },
    relevance: { ro: "", ru: "", en: "" },
    availability: null,
    caveat: null,
  },
];

export function getAsset(slug: string) {
  return portfolioAssets.find((asset) => asset.slug === slug);
}

export function getNextAsset(slug: AssetSlug) {
  const index = portfolioAssets.findIndex((asset) => asset.slug === slug);
  return portfolioAssets[(index + 1) % portfolioAssets.length];
}

/** Assets with a confirmed, currently marketed availability (facts only, no prices). */
export const availableAssets = portfolioAssets.filter((asset) => asset.availability !== null);

/* ------------------------------------------------------------------ */
/* Development                                                          */
/* ------------------------------------------------------------------ */

export type ProjectSlug = "vatra" | "drochia-gateway";

export type DevelopmentProject = {
  slug: ProjectSlug;
  name: string;
  place: Localized;
  map: MapLocation | null;
  connectivity: Localized[];
  location: Localized | null;
  media: AssetMedia | null;
  status: Localized;
  kind: Localized;
  /** Stage in the development process (index into strategy.developmentNarrative.stages). */
  stage: number;
  headline: Localized;
  lead: Localized;
  intro: Localized;
  facts: Fact[];
  sections: { title: Localized; text: Localized; items?: Localized[] }[];
  /** Mandatory disclaimer for concepts. */
  disclaimer: Localized | null;
  statement: Localized;
};

export const developmentProjects: DevelopmentProject[] = [
  {
    slug: "vatra",
    name: "VATRA",
    place: { ro: "Republica Moldova", ru: "Республика Молдова", en: "Republic of Moldova" },
    map: null,
    connectivity: [],
    location: null,
    media: media("development", "vatra", "50% 62%"),
    status: { ro: "Proiect în dezvoltare", ru: "Проект в работе", en: "Project in development" },
    kind: { ro: "Dezvoltare", ru: "Девелопмент", en: "Development" },
    stage: 4,
    headline: { ro: "Un amplasament în lucru.", ru: "Площадка в работе.", en: "A site under way." },
    lead: {
      ro: "Proiect propriu MEGAPARC — de la teren până la un cartier care funcționează.",
      ru: "Собственный проект MEGAPARC — от участка до работающего квартала.",
      en: "MEGAPARC's own project — from the land to a working neighbourhood.",
    },
    intro: {
      ro: "VATRA este privit de la început din perspectiva utilizării și a valorii pe termen lung. Dezvoltarea nu se încheie la punerea în funcțiune: după aceea, obiectul intră în faza de exploatare sau în următoarea etapă de investiție, prin decizia MEGAPARC.",
      ru: "VATRA с самого начала проектируется под реальное использование и долгий срок службы. Завершение стройки — не конец: дальше MEGAPARC оставляет объект у себя или переходит к следующему этапу.",
      en: "VATRA is viewed from the outset in terms of use and long-term value. Development does not end at commissioning: after it, the property enters its operating or next investment phase, as MEGAPARC decides.",
    },
    facts: [],
    sections: [
      {
        title: { ro: "De la amplasament la obiect", ru: "От площадки к объекту", en: "From site to building" },
        text: {
          ro: "De la concept la o viață lungă a clădirii.",
          ru: "От концепции до долгой жизни здания.",
          en: "From concept to a long life for the building.",
        },
        items: [
          { ro: "Concept — destinația, scara și economia proiectului", ru: "Концепция — назначение, масштаб и экономика проекта", en: "Concept — the use, the scale and the economics of the project" },
          { ro: "Planificare — proiectare, autorizații și pregătirea construcției", ru: "Планирование — проектирование, разрешения и подготовка к строительству", en: "Planning — design, permits and preparation for construction" },
          { ro: "Execuție — construcție, controlul calității și al costurilor", ru: "Реализация — строительство, контроль качества и затрат", en: "Delivery — construction, quality and cost control" },
          { ro: "Exploatare — faza de exploatare sau următoarea etapă de investiție, prin decizia MEGAPARC", ru: "Эксплуатация — фаза эксплуатации или следующий инвестиционный этап по решению MEGAPARC", en: "Operation — the operating or next investment phase, as MEGAPARC decides" },
        ],
      },
    ],
    disclaimer: {
      ro: "Imaginile prezintă stadiul real al amplasamentului. Arhitectura finală nu este prezentată public înainte de aprobare.",
      ru: "На фото — площадка как она есть. Архитектуру покажем после утверждения.",
      en: "Imagery shows the real state of the site. Final architecture is not shown publicly before approval.",
    },
    statement: { ro: "Construim pentru o exploatare îndelungată.", ru: "Строим, чтобы служило долго.", en: "We build for long-term use." },
  },
  {
    slug: "drochia-gateway",
    name: "Drochia Gateway",
    place: { ro: "Drochia", ru: "Дрокия", en: "Drochia" },
    map: { address: "Bd. Independenței 65, Drochia", query: "Bd. Independenței 65, Drochia, Moldova" },
    location: {
      ro: "Teren la intrarea în oraș: vizibil de pe drum și orientat spre traficul care intră în Drochia.",
      ru: "Участок на въезде в город: хорошо виден с дороги и обращён к транспорту, въезжающему в Дрокию.",
      en: "A site at the entrance to the town: clearly visible from the road and facing the traffic entering Drochia.",
    },
    connectivity: [
      { ro: "Două fronturi stradale", ru: "Два фронта к дорогам", en: "Two road fronts" },
      { ro: "Vizibilitate la intrarea în oraș", ru: "Видимость на въезде в город", en: "Visibility at the entrance to the town" },
      { ro: "Orientat spre traficul care intră în oraș", ru: "Виден всем, кто въезжает в город", en: "Facing the incoming traffic" },
      { ro: "Posibilitatea unor accese separate pentru clienți și marfă", ru: "Можно развести подъезды для покупателей и грузов", en: "Potential for separate customer and freight access" },
    ],
    media: null,
    status: { ro: "Concept de dezvoltare", ru: "Концепция развития", en: "Development concept" },
    kind: { ro: "Teren de dezvoltare", ru: "Площадка под развитие", en: "Development site" },
    stage: 2,
    headline: { ro: "Un teren de dezvoltare la intrarea în oraș.", ru: "Участок под развитие на въезде в город.", en: "A development site at the entrance to the town." },
    lead: {
      ro: "Teren de 2,0 ha în Drochia, analizat pentru dezvoltare comercială, logistică sau mixtă.",
      ru: "Участок 2,0 га в Дрокии — под торговлю, логистику или смешанный формат.",
      en: "A 2.0 ha site in Drochia, under consideration for commercial, logistics or mixed-use development.",
    },
    intro: {
      ro: "Terenul de pe bd. Independenței 65 (20.000 m²) are două fronturi stradale și se vede bine de pe drumul care intră în oraș. Sunt posibile accese separate pentru clienți și pentru transportul de marfă. MEGAPARC analizează concepte de format comercial, logistic și mixt.",
      ru: "Участок 20 000 м² на бул. Индепенденцей, 65 выходит на две дороги и хорошо виден с трассы на въезде в город. Подъезды для покупателей и грузовиков можно развести. MEGAPARC рассматривает торговый, логистический и смешанный форматы.",
      en: "The site at Bd. Independenței 65 (20,000 m²) has two road fronts and is clearly visible from the road into the town. Separate access for customers and freight is possible. MEGAPARC is considering retail, logistics and mixed-use concepts.",
    },
    facts: [
      { label: { ro: "Suprafața terenului", ru: "Площадь участка", en: "Site area" }, value: { ro: "2,0 ha · 20.000 m²", ru: "2,0 га · 20 000 м²", en: "2.0 ha · 20,000 m²" } },
      { label: { ro: "Adresă", ru: "Адрес", en: "Address" }, value: { ro: "Bd. Independenței 65, Drochia", ru: "Бул. Индепенденцей 65, Дрокия", en: "Bd. Independenței 65, Drochia" } },
      { label: { ro: "Fronturi stradale", ru: "Фронты к дорогам", en: "Road fronts" }, value: { ro: "2", ru: "2", en: "2" } },
      { label: { ro: "Dezvoltator", ru: "Девелопер", en: "Developer" }, value: { ro: "MEGAPARC SRL", ru: "MEGAPARC SRL", en: "MEGAPARC SRL" } },
    ],
    sections: [
      {
        title: { ro: "Concepte analizate", ru: "Рассматриваемые концепции", en: "Concepts under consideration" },
        text: {
          ro: "Trei concepte sunt evaluate în paralel.",
          ru: "Три концепции оцениваются параллельно.",
          en: "Three concepts are assessed in parallel.",
        },
        items: [
          { ro: "Retail park — comerț de proximitate și materiale de construcție pentru regiune", ru: "Ритейл-парк — торговля шаговой доступности и строительные материалы для региона", en: "Retail park — local retail and building materials for the region" },
          { ro: "Logistică — distribuție, lanț frigorific, hub regional", ru: "Логистика — дистрибуция, холодовая цепь, региональный хаб", en: "Logistics — distribution, cold chain, regional hub" },
          { ro: "Format mixt — comerț în față, logistică în spate, pe același teren", ru: "Смешанный формат — торговля спереди, логистика сзади, на одной площадке", en: "Mixed format — retail at the front, logistics at the rear, on one site" },
        ],
      },
    ],
    disclaimer: {
      ro: "Concept. Parametrii sunt supuși verificărilor urbanistice, inginerești și comerciale.",
      ru: "Это концепция: параметры ещё пройдут градостроительную, инженерную и коммерческую проверку.",
      en: "Concept. Parameters are subject to planning, engineering and commercial review.",
    },
    statement: { ro: "Un teren la intrarea în oraș, cu potențial de dezvoltare.", ru: "Ворота города — для торговли и логистики.", en: "A site at the entrance to the town, with development potential." },
  },
];

export function getProject(slug: string) {
  return developmentProjects.find((project) => project.slug === slug);
}

export function getNextProject(slug: ProjectSlug) {
  return developmentProjects[(developmentProjects.findIndex((project) => project.slug === slug) + 1) % developmentProjects.length];
}
