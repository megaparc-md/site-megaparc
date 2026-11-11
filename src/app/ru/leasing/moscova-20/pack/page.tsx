import type { Metadata } from "next";
import { LeasingPackPage } from "@/components/leasing-toolkit/leasing-pack";
import { packMetadata } from "@/lib/seo";

/** Moscova 20 · Digital Leasing Pack — the QR landing and the compact decision hub (OWNER toolkit mandate 2026-11-11). */
export const metadata: Metadata = packMetadata("ru");

export default function Page() {
  return <LeasingPackPage locale="ru" />;
}
