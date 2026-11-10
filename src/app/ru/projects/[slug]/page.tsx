import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LandOpportunityPage } from "@/components/land/land-template";
import { DevelopmentProjectPage } from "@/components/project-development";
import { IncomeProjectPage } from "@/components/project-income";
import { ProgrammeProjectPage } from "@/components/project-programme";
import { getProject, listProjects } from "@/content/source";
import { landOpportunities } from "@/data/land-drochia";
import { projectMetadata } from "@/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return listProjects().map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  return projectMetadata("ru", slug);
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();
  if (project.template === "land" && landOpportunities[project.slug]) return <LandOpportunityPage locale="ru" project={project} land={landOpportunities[project.slug]} />;
  if (project.template === "programme") return <ProgrammeProjectPage locale="ru" project={project} />;
  return project.template === "income" ? <IncomeProjectPage locale="ru" project={project} /> : <DevelopmentProjectPage locale="ru" project={project} />;
}
