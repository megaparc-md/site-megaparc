import type { Localized } from "@/lib/site-data";

/**
 * PRODUCTION EDITION (OWNER «MOSCOVA 20 PRODUCTION CONSISTENCY HOTFIX», 2026-11-12) — next.config.ts aliases
 * @/components/leasing-toolkit/precheck-copy to this file. Production V1 has no form backend, so the technical pre-check is a
 * DIRECT CONTACT here: the wording describes exactly that — never «8 вопросов», a questionnaire, a submission or «заявка
 * отправлена». The eight-input form and its wording stay in the preview edition until a real delivery workflow exists.
 */
const NB = String.fromCharCode(160);

export const precheckCopy: {
  title: Localized;
  meta: Localized;
  action: Localized;
  directTitle: Localized | null;
  directNote: Localized | null;
} = {
  title: { ro: "Verificarea tehnică a conceptului", ru: "Техническая проверка концепции", en: "Technical concept review" },
  meta: { ro: "contact direct cu MEGAPARC", ru: `прямой контакт с${NB}MEGAPARC`, en: "direct contact with MEGAPARC" },
  action: { ro: "Contact pentru verificare tehnică", ru: "Связаться для технической проверки", en: "Contact us for a technical review" },
  directTitle: { ro: "Contact pentru verificare tehnică", ru: "Связаться для технической проверки", en: "Contact us for a technical review" },
  directNote: {
    ro: "Descrieți formatul dvs. — directorul tehnic și arhitectul MEGAPARC vă pot ajuta să evaluați cerințele pentru spațiu.",
    ru: `Опишите ваш формат${NB}— технический директор и${NB}архитектор MEGAPARC помогут оценить требования помещения.`,
    en: "Describe your business format and MEGAPARC’s technical director and architect can help assess the space requirements.",
  },
};
