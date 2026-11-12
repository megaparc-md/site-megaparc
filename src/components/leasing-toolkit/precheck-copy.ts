import type { Localized } from "@/lib/site-data";

/**
 * Wording that DESCRIBES the technical pre-check — PREVIEW EDITION: the eight-input form exists here (pre-check-form.tsx), so the
 * labels may speak about questions and a request. The production edition has no form backend and renders the direct contacts:
 * next.config.ts aliases this module to src/editions/production/precheck-copy.ts, whose wording never mentions questions, a
 * questionnaire or a submission (OWNER «MOSCOVA 20 PRODUCTION CONSISTENCY HOTFIX», 2026-11-12). One shape, two editions — the
 * preview strings never reach the production bundle.
 */
export const precheckCopy: {
  /** the drawer title and the pack action label */
  title: Localized;
  /** the small line under the pack action */
  meta: Localized;
  /** the contextual link in the economics tool */
  action: Localized;
  /** production only: the heading and the note of the direct-contact block */
  directTitle: Localized | null;
  directNote: Localized | null;
} = {
  title: { ro: "Verificarea tehnică a conceptului", ru: "Техническая проверка концепции", en: "Technical concept check" },
  meta: { ro: "8 întrebări scurte · analizează directorul tehnic și arhitectul", ru: "8 коротких вопросов · разбирают технический директор и архитектор", en: "8 short questions · reviewed by the Technical Director and the Architect" },
  action: { ro: "Solicită verificarea tehnică", ru: "Запросить техническую проверку", en: "Request the technical check" },
  directTitle: null,
  directNote: null,
};
