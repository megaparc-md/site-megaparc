import type { Metadata } from "next";
import { visitMetadata, visitParams } from "@/components/visit-planner/meta";
import { VisitPage } from "@/components/visit-planner/visit-page";

/** Visit Planner · one property (OWNER «VISIT PLANNER & COMMERCIAL DESK V1», stage 1 — OWNER preview; noindex; removed from the production artifact). */
export const dynamicParams = false;
export function generateStaticParams() {
  return visitParams();
}

export async function generateMetadata({ params }: { params: Promise<{ property: string }> }): Promise<Metadata> {
  return visitMetadata("ru", (await params).property);
}

export default async function Page({ params }: { params: Promise<{ property: string }> }) {
  return <VisitPage slug={(await params).property} locale="ru" />;
}
