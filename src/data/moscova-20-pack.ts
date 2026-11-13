import type { Localized } from "@/lib/site-data";

/**
 * MOSCOVA 20 · DIGITAL LEASING PACK — the headings added by the R7 redesign (OWNER «PREMIUM LEASING EXPERIENCE», 2026-11-12).
 * Labels only; every fact comes from the approved data.
 */
const N = " ";
export const packCopy = {
  explore: { ro: "Explorați proprietatea", ru: "Посмотрите объект", en: "Explore the property" },
  technical: { ro: "Caracteristici tehnice", ru: "Технические характеристики", en: "Technical highlights" },
  allPhotos: { ro: "Toate fotografiile — pe pagina obiectului", ru: `Все фотографии${N}— на${N}странице объекта`, en: "All photographs — on the property page" },
  downloads: { ro: "Documente", ru: "Документы", en: "Downloads" },
  brochure: { ro: "Ofertă comercială", ru: "Коммерческое предложение", en: "Commercial brochure" },
  officialPlan: { ro: "Plan oficial", ru: "Официальный план", en: "Official floor plan" },
  planMeta: { ro: "PDF · Sc. 1:100 · anexă la contractul de locațiune", ru: `PDF · М${N}1:100 · приложение к${N}договору аренды`, en: "PDF · scale 1:100 · lease agreement annex" },
  dossier: { ro: "Dosar tehnic al obiectului", ru: "Техническое досье объекта", en: "Technical dossier" },
} satisfies Record<string, Localized>;
