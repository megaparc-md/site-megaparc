import data from "@/data/candidate-privacy.json";
import { typeset } from "@/lib/careers";
import { isProductionEdition, type Localized, type SiteLocale } from "@/lib/site-data";

/**
 * CANDIDATE PRIVACY NOTICE (Codex P1-02 · OWNER «MEGAPARC CAREERS R3 — FINAL FIX», 2026-11-26).
 * A page /careers/privacy/ in RO / RU / EN and a short line beside every way of applying (the apply buttons, the phone bar, the HR
 * address and its copy button). The legal facts — operator, IDNO, address, contact, DPO, legal basis, retention, talent pool, recipients,
 * transfers, automated decisions — come only from src/data/candidate-privacy.json, filled by the OWNER / lawyer; nothing is invented.
 * No consent checkbox: applying is an e-mail from the candidate; a consent mechanism would need a confirmed legal basis.
 * Production renders the notice only when it is approved AND complete (`privacyReady`); the OWNER preview shows the draft with every
 * gap marked so the lawyer reviews the real page. Legal frame: Law No. 195/2024 on personal data protection (in force since 23.08.2026;
 * article references per the guidance of the National Center for Personal Data Protection — to be checked by the lawyer).
 */
type L = Localized;
type Facts = {
  controller: L | null;
  idno: string | null;
  address: L | null;
  contact: string | null;
  /** "none" = no DPO designated (stated by the OWNER / lawyer); a string = the DPO's contact; null = not supplied yet */
  dpo: string | null;
  legalBasis: L | null;
  retention: L | null;
  reserve: L | null;
  recipients: L | null;
  transfers: L | null;
  automated: L | null;
};
const notice = data as unknown as { approved: boolean; approvedBy: string | null; approvedAt: string | null; version: string | null; facts: Facts };

export const privacyFacts = notice.facts;
export const privacyVersion = notice.version;
/** the facts the OWNER / lawyer still has to supply */
export const privacyMissing = (Object.keys(notice.facts) as (keyof Facts)[]).filter((key) => notice.facts[key] == null);
/** approved by the lawyer and complete: the only state in which production shows the notice */
export const privacyReady = notice.approved && Boolean(notice.approvedAt) && Boolean(notice.version) && privacyMissing.length === 0;
/** where the notice and its short lines render: production only when ready; the OWNER preview always (draft, gaps marked) */
export const showPrivacy = privacyReady || !isProductionEdition;

// the site's typesetting (RU: no hanging short prepositions, no line starting with a dash) — like every careers text
const T = (ro: string, ru: string, en: string): L => ({ ro: typeset(ro, "ro"), ru: typeset(ru, "ru"), en: typeset(en, "en") });
/** a fact supplied by the OWNER / lawyer, typeset the same way */
export const setFact = (value: L | null): L | null => (value ? T(value.ro, value.ru, value.en) : null);
export const privacyPath = (locale: SiteLocale) => `${locale === "ro" ? "" : `/${locale}`}/careers/privacy`;

export const privacyCopy = {
  title: T("Nota de informare pentru candidați privind datele personale", "Уведомление для кандидатов о персональных данных", "Candidate privacy notice"),
  label: T("Cariere · date personale", "Вакансии · персональные данные", "Careers · personal data"),
  lead: T(
    "Cum prelucrează MEGAPARC datele personale pe care le trimiteți când aplicați pentru un post vacant.",
    "Как MEGAPARC обрабатывает персональные данные, которые вы отправляете, откликаясь на вакансию.",
    "How MEGAPARC handles the personal data you send when you apply for a vacancy.",
  ),
  draft: T(
    "PROIECT pentru verificarea juridică — nu este publicat. Pasajele marcate le completează proprietarul și juristul.",
    "ПРОЕКТ для юридической проверки — не опубликован. Отмеченные места заполняют собственник и юрист.",
    "DRAFT for legal review — not published. The marked passages are completed by the owner and the lawyer.",
  ),
  pending: T("de completat de jurist", "заполняет юрист", "to be completed by the lawyer"),
  sections: {
    who: T("Cine prelucrează datele", "Кто обрабатывает данные", "Who processes your data"),
    what: T("Ce date prelucrăm", "Какие данные мы обрабатываем", "What data we process"),
    why: T("În ce scop", "Для чего", "Why"),
    basis: T("Temeiul juridic", "Правовое основание", "Legal basis"),
    access: T("Cine are acces la date", "Кто получает доступ к данным", "Who has access"),
    transfers: T("Transfer în afara Republicii Moldova", "Передача за пределы Республики Молдова", "Transfers outside the Republic of Moldova"),
    retention: T("Cât timp păstrăm datele", "Как долго мы храним данные", "How long we keep your data"),
    reserve: T("Rezerva de candidați", "Кадровый резерв", "Talent pool"),
    automated: T("Decizii automatizate", "Автоматизированные решения", "Automated decisions"),
    rights: T("Drepturile dumneavoastră", "Ваши права", "Your rights"),
    complaint: T("Plângere", "Жалоба", "Complaint"),
    provide: T("Furnizarea datelor", "Предоставление данных", "Providing your data"),
  },
  factLabels: {
    controller: T("operatorul de date (denumirea juridică)", "оператор данных (юридическое наименование)", "the data controller (legal name)"),
    idno: T("IDNO", "IDNO", "IDNO"),
    address: T("adresa juridică", "юридический адрес", "registered address"),
    contact: T("contactul pentru întrebări și cereri privind datele personale", "контакт для вопросов и запросов о персональных данных", "the contact for questions and requests about personal data"),
    dpo: T("responsabilul cu protecția datelor — contactul sau «nu este desemnat»", "ответственный за защиту данных — контакт или «не назначен»", "the data protection officer — contact or «none designated»"),
    legalBasis: T("temeiul juridic al prelucrării", "правовое основание обработки", "the legal basis of the processing"),
    retention: T("termenul de păstrare a CV-urilor", "срок хранения резюме", "how long CVs are kept"),
    reserve: T("dacă și în ce condiții CV-ul rămâne în rezerva de candidați", "остаётся ли резюме в кадровом резерве и на каких условиях", "whether, and on what terms, a CV stays in the talent pool"),
    recipients: T("cine primește datele (inclusiv furnizorii de e-mail și IT)", "кто получает данные (в том числе почтовые и ИТ-сервисы)", "who receives the data (including e-mail and IT providers)"),
    transfers: T("transferurile în afara Republicii Moldova și garanțiile", "передача за пределы Республики Молдова и гарантии", "transfers outside the Republic of Moldova and safeguards"),
    automated: T("confirmarea că nu se iau decizii exclusiv automatizate", "подтверждение, что решения не принимаются исключительно автоматически", "confirmation that no solely automated decisions are made"),
  },
  dpoNone: T("Nu este desemnat un responsabil cu protecția datelor.", "Ответственный за защиту данных не назначен.", "No data protection officer has been designated."),
  dpoContact: T("Responsabilul cu protecția datelor:", "Ответственный за защиту данных:", "Data protection officer:"),
  idno: T("IDNO", "IDNO", "IDNO"),
  requests: T("Întrebări și cereri privind datele personale:", "Вопросы и запросы о персональных данных:", "Questions and requests about personal data:"),
  what: T(
    "Datele pe care ni le trimiteți dumneavoastră: CV-ul, scrisoarea de însoțire, datele de contact, studiile, experiența profesională și alte informații din CV. Vă rugăm să nu includeți date sensibile (starea sănătății, convingeri religioase sau politice etc.), IDNP-ul sau copii ale actelor de identitate — nu sunt necesare pentru evaluarea candidaturii.",
    "Данные, которые вы присылаете сами: резюме, сопроводительное письмо, контактные данные, образование, опыт работы и другие сведения из резюме. Пожалуйста, не указывайте чувствительные данные (здоровье, религиозные или политические убеждения и т. п.), IDNP и не прикладывайте копии документов, удостоверяющих личность, — для оценки кандидатуры они не нужны.",
    "The data you send us yourself: your CV, cover letter, contact details, education, work experience and anything else in your CV. Please do not include sensitive data (health, religious or political beliefs, etc.), your IDNP or copies of identity documents — they are not needed to assess your application.",
  ),
  why: T(
    "Evaluarea candidaturii pentru postul la care ați aplicat, contactarea dumneavoastră și organizarea interviurilor.",
    "Рассмотрение вашей кандидатуры на вакансию, на которую вы откликнулись, связь с вами и организация собеседований.",
    "To assess your application for the vacancy you applied for, to contact you and to arrange interviews.",
  ),
  rights: T(
    "Aveți dreptul de acces la datele dumneavoastră, de rectificare, de ștergere, de restricționare a prelucrării, de opoziție și la portabilitatea datelor, iar dacă prelucrarea se bazează pe consimțământ — dreptul de a-l retrage oricând, fără a afecta prelucrarea anterioară. Răspundem la cerere în cel mult o lună de la primire.",
    "Вы вправе получить доступ к своим данным, исправить или удалить их, ограничить обработку, возразить против неё и получить данные в переносимом виде; если обработка основана на согласии — отозвать его в любой момент без влияния на обработку до отзыва. Мы отвечаем на запрос не позднее чем через месяц после его получения.",
    "You have the right to access your data, to have it corrected or erased, to restrict or object to its processing and to data portability; where processing is based on consent, you may withdraw it at any time without affecting earlier processing. We answer a request within one month of receiving it.",
  ),
  complaint: T(
    "Puteți depune o plângere la Centrul Național pentru Protecția Datelor cu Caracter Personal (datepersonale.md).",
    "Вы можете подать жалобу в Национальный центр по защите персональных данных (datepersonale.md).",
    "You may lodge a complaint with the National Center for Personal Data Protection (datepersonale.md).",
  ),
  provide: T(
    "Trimiterea CV-ului este voluntară. Fără CV nu putem evalua candidatura.",
    "Отправка резюме добровольна. Без резюме мы не сможем рассмотреть вашу кандидатуру.",
    "Sending your CV is voluntary. Without a CV we cannot consider your application.",
  ),
  law: T(
    "Legea nr. 195/2024 privind protecția datelor cu caracter personal (în vigoare din 23 august 2026).",
    "Закон № 195/2024 о защите персональных данных (действует с 23 августа 2026 года).",
    "Law No. 195/2024 on personal data protection (in force since 23 August 2026).",
  ),
  version: T("Versiunea din", "Редакция от", "Version of"),
  back: T("Toate posturile vacante", "Все вакансии", "All vacancies"),
  /** the short line beside every way of applying */
  note: T(
    "Trimițând CV-ul, ne transmiți datele tale personale. Cum le prelucrăm — în {link}.",
    "Отправляя резюме, вы передаёте MEGAPARC свои персональные данные. Как мы их обрабатываем — в {link}.",
    "By sending your CV, you share your personal data with MEGAPARC. How we handle it is explained in the {link}.",
  ),
  noteLink: T("nota de informare pentru candidați", "уведомлении для кандидатов", "candidate privacy notice"),
  /** the phone bar has room for a few words only */
  short: T("Date personale", "Персональные данные", "Personal data"),
};
