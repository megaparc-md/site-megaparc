import type { Metadata } from "next";
import { ProducerEconomicsPage } from "@/components/pages/producer-economics";
import { producerEconomicsMetadata } from "@/lib/seo";

/** The producer calculator v2.1 — public from Release 2 (OWNER «NEXT ACTIONS 14.11» §3). */
export const metadata: Metadata = producerEconomicsMetadata("en");

export default function Page() {
  return <ProducerEconomicsPage locale="en" />;
}
