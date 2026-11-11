import type { Metadata } from "next";
import { PropertyScreen } from "@/components/tenant-demo/screens";

/** Tenant cabinet OWNER demo — Мой объект (synthetic data; noindex; not in production). */
export const metadata: Metadata = { title: "Мой объект" };

export default function Page() {
  return <PropertyScreen />;
}
