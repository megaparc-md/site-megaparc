import type { Metadata } from "next";
import { OfferPrintR41 } from "@/components/leasing-toolkit/offer-print-r41";
import { offerR41 } from "@/data/moscova-20-offer-r41";
import { buildMetadata } from "@/lib/seo";

/** Internal A4-landscape source of the Moscova 20 commercial presentation R4.1 — printed by scripts/moscova-20-dossier.mjs --route offer-print/r41; noindex; removed from the production artifact with its parent offer-print. */
export const metadata: Metadata = buildMetadata("ru", "/leasing/moscova-20/offer-print/r41", { title: offerR41.title, description: offerR41.title }, { noindex: true });

export default function Page() {
  return <OfferPrintR41 locale="ru" />;
}
