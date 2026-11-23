import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LandPackPrint } from "@/components/land-experience/pack-print";
import { landAssetFor, landAssets } from "@/data/land/registry";
import { buildMetadata } from "@/lib/seo";

/**
 * Internal A4-landscape source of a land site's Developer Pack (OWNER «DROCHIA · DEVELOPMENT & INVESTMENT EXPERIENCE» §13; one route for
 * every land asset since R2 §7 — a new site gets its PDF from its configuration alone). Printed by scripts/land-pack-print.mjs; noindex;
 * removed from the production artifact (document-print).
 */
export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(landAssets).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const name = landAssetFor(slug)?.name ?? slug;
  return buildMetadata("ro", `/document-print/developer-pack/${slug}`, { title: { ro: `${name} — Developer Pack (sursă de tipar)`, ru: `${name} — Developer Pack (источник для печати)`, en: `${name} — Developer Pack (print source)` }, description: { ro: "Sursa internă a PDF-ului.", ru: "Внутренний источник PDF.", en: "Internal source of the PDF." } }, { noindex: true });
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const asset = landAssetFor(slug);
  if (!asset) notFound();
  return <LandPackPrint locale="ro" asset={asset} />;
}
