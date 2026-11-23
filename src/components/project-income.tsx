import { LeasingPropertyTemplate } from "@/components/leasing-experience/property-template";
import { OperatingPropertyPage } from "@/components/operating-property";
import { leasingExperienceFor, type ProjectEntry } from "@/content/source";
import type { SiteLocale } from "@/lib/site-data";

/**
 * THE LEASING OBJECTS — OWNER «LEASING TEMPLATE LOCK · MOSCOVA 20 = EXACT MASTER TEMPLATE» (2026-11-10): Moscova 20,
 * Moscova 9, Dacia 31 and Creangă 78 render one shared template (src/components/leasing-experience/property-template.tsx)
 * from their datasets (src/data/leasing-experience-*.ts) — no independently maintained page architectures. The unit
 * record or the property decides the status (src/content/source.ts → leasingExperienceFor).
 */
export function IncomeProjectPage({ locale, project }: { locale: SiteLocale; project: ProjectEntry }) {
  const template = leasingExperienceFor(project.slug);
  if (!template) throw new Error(`No leasing dataset for ${project.slug} — every leasing object renders the shared template`);
  // OWNER «PROPERTY COMMERCIAL EXPERIENCE 2026» Part A (2026-11-23): a let property (Creangă 78, Moscova 9) renders the short page of an
  // operating property — the CMS field «Формат страницы»; its leasing dataset stays complete for the day a space frees up
  if (template.experience.presentation === "operating") return <OperatingPropertyPage locale={locale} project={project} x={template.experience} />;
  return <LeasingPropertyTemplate locale={locale} project={project} unit={template.unit} experience={template.experience} />;
}
