import { T } from "@/data/leasing-experience-model";
import type { DealKey } from "@/data/land/model";

/**
 * The words of the R3 composition (OWNER «DROCHIA R3 · Premium Commercial Art Direction», 2026-11-24). Site-neutral: a land page reads its
 * name, place and figures from the configuration; nothing here names a site.
 */
export const r3 = {
  heroKicker: T("Teren pentru dezvoltare · MEGAPARC", "Земля под девелопмент · MEGAPARC", "Land for development · MEGAPARC"),
  mapCaption: T("Schemă OpenStreetMap · zonă orientativă, nu limita terenului", "Схема OpenStreetMap · ориентировочный район, не граница участка", "OpenStreetMap scheme · approximate area, not the site boundary"),
  kpi: {
    area: T("suprafață", "площадь", "area"),
    roads: T("ieșiri la drumuri", "выхода к дорогам", "road fronts"),
    scenarios: T("scenarii de dezvoltare", "сценария развития", "development scenarios"),
    deals: T("formate de colaborare", "форматов сотрудничества", "partnership formats"),
  },
  media: {
    title: T("Materialele terenului", "Материалы участка", "Site materials"),
    aerial: T("Fotografie aeriană", "Аэросъёмка", "Aerial photograph"),
    film: T("Film orizontal", "Горизонтальный ролик", "Horizontal film"),
    tour: T("Panoramă 360°", "Панорама 360°", "360° panorama"),
    soon: T("după filmare", "после съёмки", "after the shoot"),
    watch: T("Vizionați", "Смотреть", "Watch"),
  },
  why: {
    kicker: T("De ce acest teren", "Почему этот участок", "Why this site"),
    title: T("Argumentele — verificate.", "Аргументы — проверенные.", "The arguments — verified."),
  },
  market: {
    kicker: T("02 · Piața", "02 · Рынок", "02 · Market"),
    title: T("{place} în cifre.", "{place} в цифрах.", "{place} in figures."),
    lead: T("Cifre oficiale ale orașului și ale raionului — sursele și limitele sunt mai jos.", "Официальные цифры города и района — источники и ограничения ниже.", "Official figures of the town and the district — sources and limits below."),
    figures: T("Principalele cifre", "Главные цифры", "The key figures"),
    charts: T("Raionul în grafice", "Район в графиках", "The district in charts"),
    chains: T("Rețele în oraș", "Сети в городе", "Chains in the town"),
    sources: T("Sursele, metodele și limitele studiului", "Источники, методы и ограничения исследования", "Sources, methods and limits of the research"),
    table: T("Valorile graficului", "Значения графика", "Chart values"),
  },
  scenarios: {
    kicker: T("03 · Scenarii", "03 · Сценарии", "03 · Scenarios"),
    concept: T("Vizualizare conceptuală · nu este un proiect aprobat și nu este o fotografie a terenului", "Концептуальная визуализация · не утверждённый проект и не фотография участка", "Concept visualisation · not an approved project and not a photograph of the site"),
  },
  partner: {
    kicker: T("05 · Parteneriat", "05 · Партнёрство", "05 · Partnership"),
    title: T("Noi avem terenul. Voi — ideea.", "У нас есть земля. У вас — идея.", "We have the land. You have the idea."),
    lead: T("MEGAPARC caută parteneri pentru dezvoltarea terenului. Două formate sunt prioritare; celelalte se discută individual.", "MEGAPARC ищет партнёров для развития участка. Два формата — приоритетные, остальные обсуждаются индивидуально.", "MEGAPARC is looking for partners to develop the site. Two formats come first; the others are discussed individually."),
    priority: T("Format prioritar", "Приоритетный формат", "Priority format"),
    discuss: T("Discutați acest format", "Обсудить этот формат", "Discuss this format"),
    flows: {
      "build-to-suit": [T("Cerințele dumneavoastră", "Ваши требования", "Your requirements"), T("MEGAPARC construiește", "MEGAPARC строит", "MEGAPARC builds"), T("Locațiune pe termen lung", "Долгосрочная аренда", "Long-term lease")],
      "joint-development": [T("Terenul MEGAPARC", "Земля MEGAPARC", "MEGAPARC's land"), T("Capitalul sau expertiza partenerului", "Капитал или компетенции партнёра", "The partner's capital or expertise"), T("Proiect comun · cote convenite", "Совместный проект · доли по договорённости", "A joint project · agreed shares")],
    } as Partial<Record<DealKey, ReturnType<typeof T>[]>>,
  },
  model: {
    kicker: T("04 · Modelul investițional", "04 · Инвестиционная модель", "04 · Investment model"),
  },
  cta: {
    title: T("Să începem cu o discuție.", "Начнём с разговора.", "Let's start with a conversation."),
    lead: T("Directorul tehnic și arhitectul MEGAPARC evaluează împreună cu dumneavoastră terenul și formatul.", "Технический директор и архитектор MEGAPARC оценят участок и формат вместе с вами.", "MEGAPARC's Technical Director and Architect assess the site and the format together with you."),
  },
};
