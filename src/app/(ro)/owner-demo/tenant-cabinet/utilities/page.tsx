import type { Metadata } from "next";
import { UtilitiesScreen } from "@/components/tenant-demo/screens";

/** Tenant cabinet OWNER demo — Коммунальные и показания (synthetic data; noindex; not in production). */
export const metadata: Metadata = { title: "Коммунальные и показания" };

export default function Page() {
  return <UtilitiesScreen />;
}
