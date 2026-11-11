import type { Metadata } from "next";
import { DocumentsScreen } from "@/components/tenant-demo/screens";

/** Tenant cabinet OWNER demo — Документы (synthetic data; noindex; not in production). */
export const metadata: Metadata = { title: "Документы" };

export default function Page() {
  return <DocumentsScreen />;
}
