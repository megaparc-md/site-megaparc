import type { Localized } from "@/lib/site-data";

/**
 * DACIA 31 — DISTRICT ANALYTICS (OWNER «PROPERTY COMMERCIAL EXPERIENCE 2026» Part B, 2026-11-23). Desk research, sourced and dated, with a
 * confidence level per fact: docs/research/DACIA_31_LOCATION_RESEARCH.md (raw data kept with the research). Only what the research's §9
 * allows on a leasing page: no vehicle or pedestrian figure (none is published), no rent or «market rate», no occupier or brand, no
 * step-free claim, no superlative, no travel time, no plan measure presented as works. Competing supply stays internal (research §5).
 * Shown on the OWNER preview until the OWNER approves the facts (`ownerApproved`); stop distances are published only after the on-site walk.
 */

export type Confidence = "high" | "medium";
export type DistrictFact = { key: string; value: Localized; label: Localized; note?: Localized; /** a short public citation in the page language (the full reference is in the research record) */ source: Localized; date: string; confidence: Confidence };
export type DistrictTab = { key: string; tab: Localized; title: Localized; facts: DistrictFact[]; foot?: Localized };

const L = (ro: string, ru: string, en: string): Localized => ({ ro, ru, en });
const N = " ";
const BNS_POP = L("BNS, recensământul 2024, tab. 11", "НБС, перепись 2024, табл. 11", "BNS, 2024 census, Table 11");
const BNS_HOUSING = L("BNS, recensământul 2024, clădiri rezidențiale, tab. 10.5 / 10.14", "НБС, перепись 2024, жилые здания, табл. 10.5 / 10.14", "BNS, 2024 census, residential buildings, Tables 10.5 / 10.14");
const ROUTES = L("RTEC, Parcul Urban de Autobuze, OpenStreetMap", "RTEC, Parcul Urban de Autobuze, OpenStreetMap", "RTEC, Parcul Urban de Autobuze, OpenStreetMap");
const OSM = L("OpenStreetMap", "OpenStreetMap", "OpenStreetMap");
const PMUD = L("Primăria Chișinău, planul de mobilitate", "Примэрия Кишинэу, план мобильности", "Chișinău City Hall, mobility plan");

export const dacia31District = {
  ownerApproved: false,
  asOf: "2026-11-23",
  kicker: L("Analitica zonei", "Аналитика района", "District analytics"),
  title: L("Botanica: cine este în jur.", `Ботаника: кто вокруг.`, "Botanica: who is around."),
  lead: L(
    "Fapte despre sector și împrejurimi — fiecare cu sursa și data. Fără estimări de trafic: niciun calcul publicat nu există pentru acest segment.",
    `Факты о${N}секторе и${N}окружении${N}— каждый с${N}источником и${N}датой. Без оценок трафика: опубликованного подсчёта для${N}этого участка нет.`,
    "Facts about the district and the surroundings — each with its source and date. No traffic estimates: no published count exists for this stretch.",
  ),
  confidence: { high: L("încredere înaltă", "высокая достоверность", "high confidence"), medium: L("încredere medie", "средняя достоверность", "medium confidence") } satisfies Record<Confidence, Localized>,
  sourceLabel: L("Sursa", "Источник", "Source"),
  tabs: [
    {
      key: "people",
      tab: L("Locuitori", "Жители", "Residents"),
      title: L("Cel mai populat sector al orașului.", `Самый населённый сектор города.`, "The most populous sector of the city."),
      facts: [
        { key: "population", value: L("144 824", `144${N}824`, "144,824"), label: L("locuitori în Botanica", "жителей в Ботанике", "residents in Botanica"), note: L("Recensământul 2024 (08.04.2024), partea urbană a sectorului; cel mai mare dintre cele cinci sectoare ale orașului.", `Перепись 2024 (08.04.2024), городская часть сектора; больше, чем в${N}любом из${N}пяти секторов города.`, "2024 census (08.04.2024), the city part of the sector; the largest of the city's five sectors."), source: BNS_POP, date: "2025-07-15", confidence: "high" },
        { key: "blocks", value: L("891", "891", "891"), label: L("blocuri de locuințe", "многоквартирный дом", "apartment blocks"), note: L("Dintre ele 390 au 9 etaje sau mai multe.", `Из${N}них 390${N}— девять этажей и${N}выше.`, "Of them, 390 have nine floors or more."), source: BNS_HOUSING, date: "2026-04-30", confidence: "high" },
      ],
    },
    {
      key: "transit",
      tab: L("Transport", "Транспорт", "Transport"),
      title: L("Transport public pe ambele părți ale bulevardului.", `Общественный транспорт по${N}обе стороны бульвара.`, "Public transport on both sides of the boulevard."),
      facts: [
        { key: "trolley", value: L("22 · 30 · 38", "22 · 30 · 38", "22 · 30 · 38"), label: L("troleibuze", "троллейбусы", "trolleybuses"), note: L("Ruta 38 — doar spre centru. Ruta 30 leagă stația de aeroport.", `Маршрут 38${N}— только в${N}сторону центра. Маршрут 30 связывает остановку с${N}аэропортом.`, "Route 38 runs towards the centre only. Route 30 links the stop with the airport."), source: ROUTES, date: "2026-11-23", confidence: "high" },
        { key: "bus", value: L("5 · 23 · 33 · 44 · 49 · 65", "5 · 23 · 33 · 44 · 49 · 65", "5 · 23 · 33 · 44 · 49 · 65"), label: L("autobuze", "автобусы", "buses"), note: L("Rute confirmate de cel puțin două surse independente; rutele se pot schimba.", `Маршруты подтверждены не${N}менее чем двумя независимыми источниками; маршруты могут меняться.`, "Routes confirmed by at least two independent sources; routes may change."), source: ROUTES, date: "2026-11-23", confidence: "high" },
        { key: "airport", value: L("≈ 8 km", "≈ 8 км", "≈ 8 km"), label: L("până la aeroport pe bd. Dacia", "до аэропорта по бул. Дачия", "to the airport along Dacia Blvd"), note: L("Bulevardul Dacia este drumul spre Aeroportul Internațional Chișinău.", `Бульвар Дачия${N}— дорога к${N}Международному аэропорту Кишинэу.`, "Dacia Boulevard is the road to Chișinău International Airport."), source: L("OpenStreetMap; adresa aeroportului — bd. Dacia 80/3", "OpenStreetMap; адрес аэропорта — бул. Дачия, 80/3", "OpenStreetMap; airport address — 80/3 Dacia Blvd"), date: "2026-11-23", confidence: "medium" },
      ],
      foot: L("Stațiile cele mai apropiate — la câteva sute de metri, pe ambele părți ale bulevardului; distanța exactă o măsurăm la fața locului.", `Ближайшие остановки${N}— в${N}нескольких сотнях метров, по${N}обе стороны бульвара; точное расстояние измерим на${N}месте.`, "The nearest stops are a few hundred metres away, on both sides of the boulevard; the exact distance is measured on site."),
    },
    {
      key: "around",
      tab: L("Împrejurimi", "Окружение", "Surroundings"),
      title: L("Infrastructura de zi cu zi — la un kilometru.", `Повседневная инфраструктура${N}— в${N}пределах километра.`, "Everyday infrastructure — within a kilometre."),
      facts: [
        { key: "retail", value: L("7", "7", "7"), label: L("centre comerciale", "торговых центров", "shopping centres"), note: L("Și 23 de supermarketuri, două piețe — în raza de ≈ 1 km.", `И${N}23 супермаркета, два рынка${N}— в${N}радиусе ≈ 1${N}км.`, "And 23 supermarkets and two markets — within ≈ 1 km."), source: OSM, date: "2026-11-23", confidence: "medium" },
        { key: "health", value: L("9", "9", "9"), label: L("clinici", "клиник", "clinics"), note: L("Și 14 cabinete stomatologice, centrul medicilor de familie nr. 3 — în raza de ≈ 1 km.", `И${N}14 стоматологий, центр семейных врачей №${N}3${N}— в${N}радиусе ≈ 1${N}км.`, "And 14 dental practices and family-medicine centre no. 3 — within ≈ 1 km."), source: OSM, date: "2026-11-23", confidence: "medium" },
        { key: "education", value: L("14", "14", "14"), label: L("școli", "школ", "schools"), note: L("Și 14 grădinițe, colegii și campusul Botanica al UTM.", `И${N}14 детских садов, колледжи и${N}кампус UTM в${N}Ботанике.`, "And 14 kindergartens, colleges and the UTM Botanica campus."), source: OSM, date: "2026-11-23", confidence: "medium" },
        { key: "public", value: L("≈ 1 km", "≈ 1 км", "≈ 1 km"), label: L("instanțe, pretura, oficiul de documentare", "суды, претура, отдел документирования", "courts, the sector administration, the documents office"), note: L("Clienți constanți pentru juriști, notari și traducători.", `Постоянный поток клиентов для${N}юристов, нотариусов и${N}переводчиков.`, "A steady client base for lawyers, notaries and translators."), source: OSM, date: "2026-11-23", confidence: "medium" },
      ],
    },
    {
      key: "segments",
      tab: L("Pentru cine", "Для кого", "Who it suits"),
      title: L("Ipoteze de format, legate de fapte.", `Гипотезы формата, привязанные к${N}фактам.`, "Format hypotheses tied to the facts."),
      facts: [
        { key: "medical", value: L("Cabinete medicale", "Медицинские кабинеты", "Medical cabinets"), label: L("o populație mare și un grup de servicii medicale în jur", "большое население и медицинский кластер рядом", "a large population and a health cluster around"), source: L("cercetarea MEGAPARC (BNS + OpenStreetMap)", "исследование MEGAPARC (НБС + OpenStreetMap)", "MEGAPARC research (BNS + OpenStreetMap)"), date: "2026-11-23", confidence: "medium" },
        { key: "legal", value: L("Juriști · notari · contabili", "Юристы · нотариусы · бухгалтеры", "Lawyers · notaries · accountants"), label: L("instanțele și administrația sectorului în apropiere", "суды и администрация сектора рядом", "the courts and the sector administration nearby"), source: L("cercetarea MEGAPARC", "исследование MEGAPARC", "MEGAPARC research"), date: "2026-11-23", confidence: "medium" },
        { key: "education", value: L("Centre educaționale", "Учебные центры", "Education centres"), label: L("școli, grădinițe și colegii în jur", "школы, сады и колледжи вокруг", "schools, kindergartens and colleges around"), source: L("cercetarea MEGAPARC", "исследование MEGAPARC", "MEGAPARC research"), date: "2026-11-23", confidence: "medium" },
        { key: "showroom", value: L("Showroom · servicii", "Шоурум · услуги", "Showroom · services"), label: L("suprafețele mari pe drumul spre aeroport", "крупные площади на дороге к аэропорту", "large floors on the airport road"), source: L("cercetarea MEGAPARC", "исследование MEGAPARC", "MEGAPARC research"), date: "2026-11-23", confidence: "medium" },
      ],
      foot: L("Ipoteze pentru o primă evaluare — nu o confirmare că spațiul se potrivește unei activități.", `Гипотезы для${N}первой оценки${N}— не${N}подтверждение того, что помещение подходит конкретной деятельности.`, "Hypotheses for a first evaluation — not a confirmation that a space suits an activity."),
    },
    {
      key: "growth",
      tab: L("Dezvoltare", "Развитие", "Development"),
      title: L("Ce prevede planul de mobilitate.", `Что предусматривает план мобильности.`, "What the mobility plan provides for."),
      facts: [
        { key: "pmud", value: L("23.03.2026", "23.03.2026", "23.03.2026"), label: L("aprobat Planul de mobilitate urbană durabilă", "утверждён План устойчивой городской мобильности", "the Sustainable Urban Mobility Plan approved"), note: L("Planul numește bd. Dacia una dintre arterele principale ale sudului orașului și propune reabilitarea lui și benzi pentru transportul public — măsuri propuse, nu lucrări în curs.", `План называет бул. Дачия одной из${N}главных магистралей юга города и${N}предлагает его реабилитацию и${N}полосы для${N}общественного транспорта${N}— это предложения плана, а${N}не${N}начатые работы.`, "The plan names Dacia Blvd one of the main arteries of the city's south and proposes its rehabilitation and public-transport lanes — proposed measures, not works under way."), source: PMUD, date: "2026-03-27", confidence: "high" },
      ],
    },
  ] as DistrictTab[],
  note: L(
    "Cercetare de birou, 23.11.2026: BNS, Primăria Chișinău, RTEC, Parcul Urban de Autobuze, OpenStreetMap. Distanțele și vizibilitatea se verifică la fața locului.",
    `Кабинетное исследование, 23.11.2026: НБС, Примэрия Кишинэу, RTEC, Parcul Urban de Autobuze, OpenStreetMap. Расстояния и${N}видимость проверяются на${N}месте.`,
    "Desk research, 23.11.2026: BNS, Chișinău City Hall, RTEC, Parcul Urban de Autobuze, OpenStreetMap. Distances and visibility are checked on site.",
  ),
};

export const districtVisible = () => dacia31District.ownerApproved || (process.env.NEXT_PUBLIC_SITE_EDITION ?? "production") !== "production";
