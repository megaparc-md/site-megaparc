import type { Metadata } from "next";
import { OverviewScreen } from "@/components/tenant-demo/screens";

/** Tenant cabinet OWNER demo — Обзор (synthetic data; noindex; not in production). */
export const metadata: Metadata = { title: "Обзор" };

export default function Page() {
  return <OverviewScreen />;
}
