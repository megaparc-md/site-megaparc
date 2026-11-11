import type { Metadata } from "next";
import { ContactsScreen } from "@/components/tenant-demo/screens";

/** Tenant cabinet OWNER demo — Контакты (synthetic data; noindex; not in production). */
export const metadata: Metadata = { title: "Контакты" };

export default function Page() {
  return <ContactsScreen />;
}
