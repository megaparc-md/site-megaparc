import type { Metadata } from "next";
import { LandPackPrint } from "@/components/land-experience/pack-print";
import { drochiaAsset } from "@/data/land/drochia";
import { buildMetadata } from "@/lib/seo";

/** Internal A4-landscape source of the Drochia Developer Pack (OWNER «DROCHIA · DEVELOPMENT & INVESTMENT EXPERIENCE» §13) — printed by scripts/land-pack-print.mjs; noindex; removed from the production artifact (document-print). */
export const metadata: Metadata = buildMetadata("ro", "/document-print/developer-pack/drochia", { title: { ro: "Drochia — Developer Pack (sursă de tipar)", ru: "Drochia — Developer Pack (источник для печати)", en: "Drochia — Developer Pack (print source)" }, description: { ro: "Sursa internă a PDF-ului.", ru: "Внутренний источник PDF.", en: "Internal source of the PDF." } }, { noindex: true });

export default function Page() {
  return <LandPackPrint locale="ro" asset={drochiaAsset} />;
}
