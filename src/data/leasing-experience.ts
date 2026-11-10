import type { LeasingExperience } from "@/data/leasing-experience-model";
import { creanga78Experience } from "@/data/leasing-experience-creanga-78";
import { dacia31Experience } from "@/data/leasing-experience-dacia-31";
import { moscova20Experience } from "@/data/leasing-experience-moscova-20";
import { moscova9Experience } from "@/data/leasing-experience-moscova-9";

/**
 * Leasing datasets by property — OWNER «LEASING TEMPLATE LOCK» (2026-11-10): one template
 * (src/components/leasing-experience/property-template.tsx), four datasets; Moscova 20 is the master configuration.
 * The unit record (status) decides how each page reads its offer (src/content/source.ts). Model:
 * src/data/leasing-experience-model.ts.
 */
export const leasingExperiences: Record<string, LeasingExperience> = {
  [moscova20Experience.project]: moscova20Experience,
  [moscova9Experience.project]: moscova9Experience,
  [dacia31Experience.project]: dacia31Experience,
  [creanga78Experience.project]: creanga78Experience,
};
