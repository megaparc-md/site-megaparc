import type { Metadata } from "next";
import { NewRequestScreen } from "@/components/tenant-demo/screens";

/** Tenant cabinet OWNER demo — Создать обращение (synthetic data; noindex; not in production). */
export const metadata: Metadata = { title: "Создать обращение" };

export default function Page() {
  return <NewRequestScreen />;
}
