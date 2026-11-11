import type { Metadata } from "next";
import { RequestsScreen } from "@/components/tenant-demo/screens";

/** Tenant cabinet OWNER demo — Обращения (synthetic data; noindex; not in production). */
export const metadata: Metadata = { title: "Обращения" };

export default function Page() {
  return <RequestsScreen />;
}
