import { DirectContact } from "@/components/direct-contact";
import { EnquiryForm, type FormOptions, type Subject } from "@/components/enquiry-form";
import { OwnerCompass } from "@/components/owner-compass";
import { getProject, listProjects, listVacancies, publicSpaces } from "@/content/source";
import { acquisitionProcess, company, leasingProcess } from "@/data/demo-content";
import { acquisitionTypes } from "@/lib/business";
import { departmentLabel, type Department } from "@/lib/careers";
import { areaBands, needOrder, needs, uses } from "@/lib/leasing";
import { isProductionEdition, localePath, type Localized, type SiteLocale } from "@/lib/site-data";

/**
 * Server wrappers that turn journey data into the props of the client journey
 * components — the owner compass (Offer a property) and the enquiry form
 * (Offer a property, Contact). OWNER correction 2026-10-08: no
 * asset-management intent, no investment subject; the lease form can name
 * the exact space.
 */

/* ---------------------------------------------------------------- */
/* Owner compass — "I have a property or land"                        */
/* ---------------------------------------------------------------- */

export type OwnerIntent = "sell" | "joint" | "unsure";

export const ownerIntents: { key: OwnerIntent; label: Localized; thinking: Localized; assess: Localized[] }[] = [
  {
    key: "sell",
    label: { ro: "Să vând", ru: "Продать", en: "Sell" },
    thinking: { ro: "Ne uităm la ce poate deveni obiectul în mâinile noastre — de aici vine o ofertă argumentată, nu o cifră aruncată.", ru: "Смотрим, чем объект может стать у нас, — поэтому предлагаем обоснованную цену, а не случайную цифру.", en: "We look at what the property could become in our hands — that is where a reasoned offer comes from, not a random figure." },
    assess: [{ ro: "Situația juridică", ru: "Юридический статус", en: "Legal status" }, { ro: "Starea tehnică", ru: "Техническое состояние", en: "Technical condition" }, { ro: "Potențialul locației", ru: "Потенциал локации", en: "Location potential" }],
  },
  {
    key: "joint",
    label: { ro: "Dezvoltare împreună", ru: "Совместное развитие", en: "Develop together" },
    thinking: { ro: "Proprietarul aduce terenul sau clădirea, MEGAPARC aduce conceptul, finanțarea și construcția — iar obiectul rămâne în proprietatea MEGAPARC sau comună, după acord.", ru: "Собственник вносит землю или здание, MEGAPARC — концепцию, финансирование и строительство; объект остаётся у MEGAPARC или в совместной собственности — по договорённости.", en: "The owner brings the land or building, MEGAPARC brings the concept, financing and construction — and the property stays with MEGAPARC or is owned jointly, as agreed." },
    assess: [{ ro: "Scara posibilă", ru: "Возможный масштаб", en: "Possible scale" }, { ro: "Cererea chiriașilor în zonă", ru: "Спрос арендаторов в районе", en: "Tenant demand in the area" }, { ro: "Urbanism și autorizații", ru: "Градостроительство и разрешения", en: "Planning and permits" }],
  },
  {
    key: "unsure",
    label: { ro: "Încă nu știu", ru: "Пока не знаю", en: "Not sure yet" },
    thinking: { ro: "Cel mai des începem exact de aici. O primă evaluare arată ce variantă are sens — vânzare sau dezvoltare împreună.", ru: "Чаще всего разговор начинается именно так. Оценка покажет, что разумнее: продажа или совместное развитие.", en: "Most conversations start right here. A first assessment shows which option makes sense — a sale or developing together." },
    assess: [{ ro: "Ce aveți", ru: "Что у вас есть", en: "What you have" }, { ro: "Ce vă doriți", ru: "Чего вы хотите", en: "What you want" }, { ro: "Ce permite piața", ru: "Что позволяет рынок", en: "What the market allows" }],
  },
];

const compassCopy: Record<SiteLocale, { have: string; consider: string; thinking: string; assess: string; proof: string; submit: string; proofTitle: string; proofText: string; proofCta: string }> = {
  ro: { have: "Ce aveți?", consider: "Ce luați în calcul?", thinking: "Cum privim lucrurile", assess: "Ce verificăm mai întâi", proof: "Exemplu real", submit: "Trimite obiectul", proofTitle: "Drochia, 2,0 ha.", proofText: "Un teren al MEGAPARC la intrarea în oraș, cu două fronturi stradale — trei concepte se evaluează în paralel.", proofCta: "Vezi proiectul" },
  ru: { have: "Что у вас есть?", consider: "Что вы рассматриваете?", thinking: "Как мы на это смотрим", assess: "Что проверяем в первую очередь", proof: "Реальный пример", submit: "Отправить объект", proofTitle: "Drochia, 2,0 га.", proofText: "Участок MEGAPARC на въезде в город выходит на две дороги. Сейчас параллельно оцениваем три концепции.", proofCta: "Смотреть проект" },
  en: { have: "What do you have?", consider: "What are you considering?", thinking: "How we see it", assess: "What we check first", proof: "A real example", submit: "Send the property", proofTitle: "Drochia, 2.0 ha.", proofText: "MEGAPARC's own site at the town entrance with two road fronts — three concepts are assessed in parallel.", proofCta: "View the project" },
};

/** `formHref`: where the prefilled form lives (the Offer page itself — a full reload carries the choice into the form). */
const firstReply: Localized = { ro: "Primul răspuns", ru: "Первый ответ", en: "First reply" };

export function OwnerCompassBlock({ locale, formHref }: { locale: SiteLocale; formHref: string }) {
  const c = compassCopy[locale];
  return (
    <OwnerCompass
      assets={acquisitionTypes.map((a) => ({ key: a.key, label: a.title[locale] }))}
      intents={ownerIntents.map((i) => ({ key: i.key, label: i.label[locale], thinking: i.thinking[locale], assess: i.assess.map((x) => x[locale]) }))}
      copy={{ have: c.have, consider: c.consider, thinking: c.thinking, assess: c.assess, proof: c.proof, submit: c.submit }}
      proof={{ title: c.proofTitle, text: c.proofText, href: localePath(locale, "/projects/drochia"), cta: c.proofCta }}
      contactHref={formHref}
      reload
    />
  );
}

/* ---------------------------------------------------------------- */
/* Enquiry form                                                       */
/* ---------------------------------------------------------------- */

const partnerCategories: { key: string; label: Localized }[] = [
  { key: "contractors", label: { ro: "Constructori", ru: "Подрядчики", en: "Contractors" } },
  { key: "architects", label: { ro: "Arhitecți și proiectanți", ru: "Архитекторы и проектировщики", en: "Architects and designers" } },
  { key: "brokers", label: { ro: "Brokeri", ru: "Брокеры", en: "Brokers" } },
  { key: "banks", label: { ro: "Bănci", ru: "Банки", en: "Banks" } },
  { key: "professionals", label: { ro: "Juridic, evaluare, consultanță", ru: "Право, оценка, консалтинг", en: "Legal, valuation, advisory" } },
  { key: "other", label: { ro: "Altceva", ru: "Другое", en: "Other" } },
];

export function EnquiryFormBlock({ locale, initial, only }: { locale: SiteLocale; initial?: Subject; only?: Subject[] }) {
  // production edition: no form backend yet (n8n off) — the confirmed direct contacts instead of a form that cannot send
  if (isProductionEdition) return <DirectContact locale={locale} subject={initial ?? "general"} />;
  const districts = Array.from(new Set(listProjects().filter((p) => p.kind === "operating").map((p) => p.district[locale])));
  const departments = Array.from(new Set(listVacancies().map((v) => v.department))) as Department[];
  const options: FormOptions = {
    properties: listProjects().filter((p) => p.kind === "operating").map((p) => ({ value: p.slug, label: p.name })),
    spaces: publicSpaces.map((s) => ({ value: s.id, label: `${getProject(s.project)!.name} · ${s.code} · ${s.unit[locale]}` })),
    businessTypes: uses.map((u) => ({ value: u.key, label: u.label[locale] })),
    areas: areaBands.map((b) => ({ value: b.key, label: b.label[locale] })),
    districts: districts.map((d) => ({ value: d, label: d })),
    requirements: needOrder.map((key) => ({ value: key, label: needs[key].label[locale] })),
    ownerAssets: acquisitionTypes.map((a) => ({ value: a.key, label: a.title[locale] })),
    ownerIntents: ownerIntents.map((i) => ({ value: i.key, label: i.label[locale] })),
    partnerCategories: partnerCategories.map((p) => ({ value: p.key, label: p.label[locale] })),
    vacancies: listVacancies().map((v) => ({ value: v.slug, label: v.title[locale] })),
    disciplines: departments.map((d) => ({ value: d, label: departmentLabel[d][locale] })),
    mailboxes: {
      lease: company.email.value[locale],
      property: company.email.value[locale],
      partnership: company.email.value[locale],
      careers: company.email.value[locale],
      general: company.email.value[locale],
    },
    // One promise per route, so the form never contradicts the page it sits on.
    reply: {
      lease: leasingProcess.reply.value[locale],
      property: `${firstReply[locale]} ${acquisitionProcess.reply.value[locale]}`,
      partnership: company.responseTime.value[locale],
      careers: company.responseTime.value[locale],
      general: company.responseTime.value[locale],
    },
  };
  return <EnquiryForm locale={locale} options={options} initial={initial} only={only} />;
}
