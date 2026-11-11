import type { Metadata } from "next";
import { DossierPrintPage } from "@/components/leasing-toolkit/dossier-print";
import { dossierPrintMetadata } from "@/lib/seo";

/** Internal A4 source of the Moscova 20 PDF dossier — printed by scripts/moscova-20-dossier.mjs; noindex; not in the production artifact. */
export const metadata: Metadata = dossierPrintMetadata("en");

export default function Page() {
  return <DossierPrintPage locale="en" />;
}
