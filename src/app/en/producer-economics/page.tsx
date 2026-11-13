import type { Metadata } from "next";
import { ProducerEconomicsPage } from "@/components/pages/producer-economics";
import { producerEconomicsMetadata } from "@/lib/seo";

/** Internal CFO-model prototype (OWNER R10 §04) — noindex; OWNER preview only; not in the production artifact. */
export const metadata: Metadata = producerEconomicsMetadata("en");

export default function Page() {
  return <ProducerEconomicsPage locale="en" />;
}
