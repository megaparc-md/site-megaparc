import { DirectContact } from "@/components/direct-contact";
import { PreCheckForm } from "@/components/leasing-toolkit/pre-check-form";
import { precheckCopy } from "@/components/leasing-toolkit/precheck-copy";
import { ViewingRequest } from "@/components/leasing-toolkit/viewing-request";
import { VisitEntry } from "@/components/visit-planner/entry";
import { plannerFor } from "@/components/visit-planner/href";
import { company } from "@/data/demo-content";
import { isProductionEdition, type Localized, type SiteLocale } from "@/lib/site-data";

/**
 * The two decision tools of the toolkit in their edition-safe form: the preview edition renders the local forms (nothing is sent),
 * the production edition renders the OWNER-confirmed direct contacts — never a form that cannot send, never a false confirmation
 * (OWNER «PRODUCTION V1» §7 applied to the toolkit, mandate §17 · §20).
 */
const productionNote: Record<"book", Localized> = {
  book: {
    ro: "Cererea de vizionare se trimite deocamdată direct — scrieți-ne sau sunați și propuneți ziua și intervalul; confirmăm ora personal.",
    ru: "Просмотр пока можно запросить только напрямую\u00a0— напишите или позвоните и\u00a0предложите день и\u00a0время; точное время подтвердим лично.",
    en: "For now, please request a viewing directly: e-mail or call us with a day and time window, and we'll confirm the exact time with you.",
  },
};

export function PreCheck({ locale }: { locale: SiteLocale }) {
  // production: the direct contacts under wording that describes exactly that (precheck-copy, production edition) — no questions, no submission
  if (isProductionEdition) return <DirectContact locale={locale} subject="lease" title={precheckCopy.directTitle?.[locale]} note={precheckCopy.directNote?.[locale]} />;
  return <PreCheckForm locale={locale} mailbox={company.email.value[locale]} phones={[company.mobile.value[locale], company.landline.value[locale]]} />;
}

export function BookViewing({ locale, unitLabel, project }: { locale: SiteLocale; unitLabel: string; /** the property of the pack — its planner, where one is offered */ project?: string }) {
  if (isProductionEdition) return <DirectContact locale={locale} subject="viewing" context={unitLabel} note={productionNote.book[locale]} />;
  // OWNER «VISIT PLANNER & COMMERCIAL DESK V1» (stage 1): a real date and time are chosen in the planner
  if (plannerFor(project)) return <VisitEntry locale={locale} slug={project} unitLabel={unitLabel} />;
  return <ViewingRequest locale={locale} unitLabel={unitLabel} mailbox={company.email.value[locale]} />;
}
