import type { Metadata } from "next";
import { OfferPrintPage } from "@/components/leasing-toolkit/offer-print";
import { offerPrintMetadata } from "@/lib/seo";

/** Internal A4-landscape source of the Moscova 20 commercial offer (brochure R4, OWNER R9) — printed by scripts/moscova-20-dossier.mjs --route offer-print; noindex; not in the production artifact. */
export const metadata: Metadata = offerPrintMetadata("ro");

export default function Page() {
  return <OfferPrintPage locale="ro" />;
}
