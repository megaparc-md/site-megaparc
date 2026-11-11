import type { Metadata } from "next";
import { FinanceScreen } from "@/components/tenant-demo/screens";

/** Tenant cabinet OWNER demo — Финансы (synthetic data; noindex; not in production). */
export const metadata: Metadata = { title: "Финансы" };

export default function Page() {
  return <FinanceScreen />;
}
