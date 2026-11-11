import { DirectContact } from "@/components/direct-contact";
import { PreCheckForm } from "@/components/leasing-toolkit/pre-check-form";
import { ViewingRequest } from "@/components/leasing-toolkit/viewing-request";
import { company } from "@/data/demo-content";
import { isProductionEdition, type Localized, type SiteLocale } from "@/lib/site-data";

/**
 * The two decision tools of the toolkit in their edition-safe form: the preview edition renders the local forms (nothing is sent),
 * the production edition renders the OWNER-confirmed direct contacts — never a form that cannot send, never a false confirmation
 * (OWNER «PRODUCTION V1» §7 applied to the toolkit, mandate §17 · §20).
 */
const productionNote: Record<"precheck" | "book", Localized> = {
  precheck: {
    ro: "Pentru verificarea tehnică a conceptului, contactați MEGAPARC la datele de contact indicate — directorul tehnic și arhitectul MEGAPARC verifică fezabilitatea tehnică a conceptului înainte de convenirea condițiilor comerciale.",
    ru: "Для технической проверки концепции свяжитесь с MEGAPARC по указанным контактам — технический директор и архитектор MEGAPARC проверяют техническую реализуемость концепции до согласования коммерческих условий.",
    en: "For the technical concept review, contact MEGAPARC using the contact details shown — MEGAPARC's Technical Director and Architect check the technical feasibility of the concept before commercial terms are agreed.",
  },
  book: {
    ro: "Cererea de vizionare se trimite deocamdată direct — scrieți-ne sau sunați și propuneți ziua și intervalul; confirmăm ora personal.",
    ru: "Запрос на просмотр пока отправляют напрямую — напишите или позвоните и предложите день и время; точный час подтвердим лично.",
    en: "For now a viewing request is sent directly — write or call and suggest a day and time window; we confirm the exact time personally.",
  },
};

export function PreCheck({ locale }: { locale: SiteLocale }) {
  if (isProductionEdition) return <DirectContact locale={locale} subject="lease" note={productionNote.precheck[locale]} />;
  return <PreCheckForm locale={locale} mailbox={company.email.value[locale]} phones={[company.mobile.value[locale], company.landline.value[locale]]} />;
}

export function BookViewing({ locale, unitLabel }: { locale: SiteLocale; unitLabel: string }) {
  if (isProductionEdition) return <DirectContact locale={locale} subject="viewing" context={unitLabel} note={productionNote.book[locale]} />;
  return <ViewingRequest locale={locale} unitLabel={unitLabel} mailbox={company.email.value[locale]} />;
}
