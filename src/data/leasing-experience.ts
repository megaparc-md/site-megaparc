import type { LeasingExperience } from "@/data/leasing-experience-model";
import { moscova20Experience } from "@/data/leasing-experience-moscova-20";

/** Leasing experiences by unit id — the unit record (status) decides whether the page is published (src/content/source.ts). Model: src/data/leasing-experience-model.ts. */
export const leasingExperiences: Record<string, LeasingExperience> = {
  [moscova20Experience.unitId]: moscova20Experience,
};
