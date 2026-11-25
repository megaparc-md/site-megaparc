import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ClosedVacancyPage, VacancyPage } from "@/components/pages/vacancy";
import { getClosedVacancy, getVacancy, vacancySlugs } from "@/content/source";
import { vacancyMetadata } from "@/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return vacancySlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  return vacancyMetadata("ru", slug);
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const vacancy = getVacancy(slug);
  if (vacancy) return <VacancyPage locale="ru" vacancy={vacancy} />;
  const closed = getClosedVacancy(slug);
  if (!closed) notFound();
  return <ClosedVacancyPage locale="ru" vacancy={closed} />;
}
