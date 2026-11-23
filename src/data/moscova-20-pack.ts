import type { Localized } from "@/lib/site-data";

/**
 * MOSCOVA 20 · DIGITAL LEASING PACK — the headings added by the R7 redesign (OWNER «PREMIUM LEASING EXPERIENCE», 2026-11-12).
 * Labels only; every fact comes from the approved data.
 */
const N = " ";
export const packCopy = {
  explore: { ro: "Explorați proprietatea", ru: "Посмотрите объект", en: "Explore the property" },
  technical: { ro: "Caracteristici tehnice", ru: "Технические характеристики", en: "Technical highlights" },
  allPhotos: { ro: "Toate fotografiile — pe pagina imobilului", ru: `Все фотографии${N}— на${N}странице объекта`, en: "All photographs — on the property page" },
  downloads: { ro: "Documente", ru: "Документы", en: "Downloads" },
  // OWNER «2-DAY FINISH» + «FINAL 2-DAY DELIVERY MANDATE» (2026-11-14): one public commercial document, one name everywhere
  // OWNER «PREMIUM DOCUMENT NAMES» (2026-11-16): the card names the document (commercialCopy.offerTitle) — this label is kept for the
  // print sources only
  brochure: { ro: "Ofertă comercială", ru: "Коммерческое предложение", en: "Commercial Leasing Proposal" },
  // §05: the document kit — the current commercial proposal of the language and the two official plans in one ZIP; nothing older inside
  // (+ the branded technical sheet, file 04 — OWNER «COMMERCIAL BRAND PACK 2026», 2026-11-20)
  kit: { ro: "Descărcați documentele", ru: "Скачать комплект документов", en: "Download the document kit" },
  kitMeta: { ro: "ZIP · oferta comercială + 2 planuri oficiale + fișa tehnică · {size}", ru: `ZIP · коммерческое предложение + 2${N}официальных плана + технический паспорт · {size}`, en: `ZIP · commercial leasing proposal + 2 official plans + technical sheet · {size}` },
  // OWNER «DARK GREY FINAL REVIEW» (2026-11-23): the branded technical sheet as its own download beside the plans (it is also file 04 of
  // the kit); the title = the PDF’s own title, the pages of the B1 sheet (six)
  technicalTitle: { ro: "Moscova 20 — Fișă tehnică", ru: `Moscova${N}20${N}— Технический паспорт`, en: "Moscova 20 — Technical Sheet" },
  // §03: the two premises cadastral numbers, one quiet row beside the property number (OWNER R9 addendum wording)
  premises: { ro: "Numerele cadastrale ale spațiilor", ru: "Кадастровые номера помещений", en: "Cadastral numbers of the premises" },
  officialPlan: { ro: "Plan oficial", ru: "Официальный план", en: "Official floor plan" },
  planMeta: { ro: "PDF · Sc. 1:100 · anexă la contractul de locațiune", ru: `PDF · М${N}1:100 · приложение к${N}договору аренды`, en: "PDF · scale 1:100 · lease agreement annex" },
  dossier: { ro: "Dosar tehnic al obiectului", ru: "Техническое досье объекта", en: "Technical dossier" },
} satisfies Record<string, Localized>;
