import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LandOpportunityPage } from "@/components/land/land-template";
import { LandExperiencePage } from "@/components/land-experience/land-page";
import { DevelopmentProjectPage } from "@/components/project-development";
import { IncomeProjectPage } from "@/components/project-income";
import { ProgrammeProjectPage } from "@/components/project-programme";
import { getProject, listProjects } from "@/content/source";
import { landOpportunities } from "@/data/land-drochia";
import { experienceVisible, landAssetFor } from "@/data/land/registry";
import { isProductionEdition } from "@/lib/site-data";
import { projectMetadata } from "@/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return listProjects().map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  return projectMetadata("en", slug);
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();
  // OWNER «DROCHIA · DEVELOPMENT & INVESTMENT EXPERIENCE» (2026-11-23): the v2 experience on the OWNER preview; the public edition keeps the
  // current page until the OWNER approves the v2 (LandAsset.approvals.experience)
  const asset = project.template === "land" ? landAssetFor(project.slug) : null;
  if (asset && experienceVisible(asset, !isProductionEdition)) return <LandExperiencePage locale="en" project={project} asset={asset} />;
  if (project.template === "land" && landOpportunities[project.slug]) return <LandOpportunityPage locale="en" project={project} land={landOpportunities[project.slug]} />;
  if (project.template === "programme") return <ProgrammeProjectPage locale="en" project={project} />;
  return project.template === "income" ? <IncomeProjectPage locale="en" project={project} /> : <DevelopmentProjectPage locale="en" project={project} />;
}
