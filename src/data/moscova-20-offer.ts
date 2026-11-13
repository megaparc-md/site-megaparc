import type { Localized } from "@/lib/site-data";

/**
 * MOSCOVA 20 · COMMERCIAL OFFER (BROCHURE R2) — the wording that exists only in the PDF (OWNER mandates R6 / R7, 2026-11-12).
 * Facts are never typed here: the brochure reads the unit record, the passport, the commercial module and the approved dataset;
 * this file holds headings and a few connecting lines only. No price beyond the two approved rates, no promise, no superlative.
 */
const N = " ";
export const offerCopy = {
  kicker: { ro: "Ofertă comercială · închiriere", ru: "Коммерческое предложение · аренда", en: "Commercial offer · lease" },
  coverLevels: { ro: "Două niveluri și terasă · acces direct din bulevard", ru: `Два уровня и${N}терраса · прямой вход с${N}бульвара`, en: "Two levels and a terrace · direct access from the boulevard" },
  coverPlace: { ro: `Chișinău · Rîșcani · bd.${N}Moscova${N}20`, ru: `Кишинэу · Рышкань · бул.${N}Москова,${N}20`, en: `Chișinău · Rîșcani · 20${N}Moscova Blvd` },
  opportunity: {
    kicker: { ro: "Oportunitatea", ru: "Возможность", en: "The opportunity" },
    title: { ro: "O adresă care merită\nluată în considerare.", ru: "Адрес, который\nстоит рассмотреть.", en: "An address\nworth considering." },
  },
  space: {
    kicker: { ro: "Obiectul și spațiul", ru: "Объект и пространство", en: "Property & space" },
    statement: { ro: "Două niveluri. Un singur concept.", ru: "Два уровня. Одна концепция.", en: "Two levels. One concept." },
    total: { ro: "Oferit spre închiriere", ru: "Предлагается в аренду", en: "Offered for lease" },
  },
  schedule: { ro: "Explicația încăperilor", ru: "Экспликация помещений", en: "Room schedule" },
  // R3 brochure (OWNER «CORRECTIVE PASS R8» §05, 2026-11-13)
  aerialLegend: { ro: "Pe fotografia aeriană", ru: "На аэрофото", en: "On the aerial photograph" },
  scenarios: {
    kicker: { ro: "Scenarii de utilizare", ru: "Сценарии использования", en: "Use scenarios" },
    title: { ro: "Un spațiu —\ndiferite formate.", ru: `Одно пространство —\nразные форматы.`, en: "One space —\ndifferent formats." },
  },
  technical: {
    title: { ro: "Baza inginerească\neste deja pregătită.", ru: "Инженерная основа\nуже создана.", en: "The engineering base\nis already in place." },
    consult: { ro: "Consultație tehnică", ru: "Техническая консультация", en: "Technical consultation" },
  },
  location: {
    routes: { ro: " rute de transport public conform datelor actuale OpenStreetMap", ru: `${N}маршрутов общественного транспорта по${N}текущим данным OpenStreetMap`, en: " public-transport routes per current OpenStreetMap data" },
  },
  mailSubject: { ro: "Moscova 20 — ofertă comercială", ru: "Moscova 20 — коммерческое предложение", en: "Moscova 20 — commercial offer" },
} satisfies Record<string, Localized | Record<string, Localized>>;
