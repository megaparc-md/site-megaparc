import type { Localized, SiteLocale } from "@/lib/site-data";

/**
 * Careers — vacancies as CMS records (OWNER correction 2026-10-08: content type
 * VACANCY — title · location · department · short description · full
 * description · status · source link · published date; docs/CMS_ARCHITECTURE.md).
 *
 * Current public roles are sourced from the official SRL MEGAPARC employer
 * profile on Rabota.md and are intentionally summarised rather than copied;
 * the full description stays on the source page (full: null) until HR writes
 * one in the CMS. Only status "open" is published. Candidate personal data
 * must never be sent to analytics; no application backend is wired here.
 */

export type Department = "leadership" | "development" | "leasing-operations" | "operations" | "legal";

export type Vacancy = {
  slug: string;
  title: Localized;
  department: Department;
  location: Localized;
  /** Short description (card). */
  summary: Localized;
  /** Full description written in the CMS; null = read it on the source page. */
  full: Localized | null;
  status: "open" | "closed";
  /** External source / application page. */
  externalUrl: string;
  /** ISO date of publication; null = not recorded (the source page holds it). */
  publishedAt: string | null;
};

export const departmentLabel: Record<Department, Localized> = {
  leadership: { ro: "Conducere", ru: "Руководство", en: "Leadership" },
  development: { ro: "Dezvoltare și construcții", ru: "Девелопмент и строительство", en: "Development and construction" },
  "leasing-operations": { ro: "Închiriere și exploatare", ru: "Аренда и эксплуатация", en: "Leasing and operations" },
  operations: { ro: "Exploatare tehnică", ru: "Техническая эксплуатация", en: "Technical operations" },
  legal: { ro: "Juridic", ru: "Юридический отдел", en: "Legal" },
};

export const vacancies: Vacancy[] = [
  {
    slug: "ceo",
    title: { ro: "CEO", ru: "CEO / Генеральный директор", en: "CEO" },
    department: "leadership",
    location: { ro: "Chișinău", ru: "Кишинэу", en: "Chișinău" },
    summary: {
      ro: "Conducerea strategică a companiei, coordonarea funcțiilor-cheie, dezvoltarea proiectelor și identificarea noilor obiecte de cumpărat.",
      ru: "Стратегическое управление компанией, координация ключевых функций, развитие проектов и поиск новых объектов для покупки.",
      en: "Strategic leadership of the company, coordination of key functions, development of the projects and the search for new properties to buy.",
    },
    full: null,
    status: "open",
    publishedAt: null,
    externalUrl: "https://www.rabota.md/ro/locuri-de-munca/ceo/47060",
  },
  {
    slug: "leasing-operations-development-manager",
    title: {
      ro: "Manager închiriere, exploatare și dezvoltare a obiectelor grupului",
      ru: "Менеджер по аренде, эксплуатации и развитию объектов группы",
      en: "Leasing, Operations & Development Manager",
    },
    department: "leasing-operations",
    location: { ro: "Chișinău", ru: "Кишинэу", en: "Chișinău" },
    summary: {
      ro: "Închirierea spațiilor comerciale proprii, relația cu chiriașii, monitorizarea încasărilor și dezvoltarea obiectelor grupului.",
      ru: "Аренда собственных коммерческих площадей, работа с арендаторами, контроль поступлений и развитие объектов группы.",
      en: "Leasing the group's own commercial space, tenant relationships, collections monitoring and developing the group's properties.",
    },
    full: null,
    status: "open",
    publishedAt: null,
    externalUrl: "https://www.rabota.md/ro/locuri-de-munca/manager-administrare-dezvoltare-si-gestiunea-activelor-holdingului/50074",
  },
  {
    slug: "head-construction-department",
    title: { ro: "Șef Departament Construcții", ru: "Руководитель строительного департамента", en: "Head of Construction Department" },
    department: "development",
    location: { ro: "Chișinău", ru: "Кишинэу", en: "Chișinău" },
    summary: {
      ro: "Conducerea departamentului de construcții, coordonarea echipei tehnice, subcontractorilor și progresului proiectelor.",
      ru: "Руководство строительным департаментом, координация технической команды, подрядчиков и хода проектов.",
      en: "Leadership of the construction department, technical team, subcontractors and project delivery progress.",
    },
    full: null,
    status: "open",
    publishedAt: null,
    externalUrl: "https://www.rabota.md/ro/locuri-de-munca/sef-departament-in-constructii/59219",
  },
  {
    slug: "construction-project-manager",
    title: { ro: "Manager de proiect în construcții", ru: "Менеджер строительных проектов", en: "Construction Project Manager" },
    department: "development",
    location: { ro: "Chișinău · Botanica", ru: "Кишинэу · Ботаника", en: "Chișinău · Botanica" },
    summary: {
      ro: "Coordonarea proiectelor de la documentația permisivă până la recepție: echipe, buget, grafic, calitate și documentație tehnică.",
      ru: "Координация проекта от разрешительной документации до приёмки: команды, бюджет, график, качество и техническая документация.",
      en: "Construction delivery from permitting through handover: teams, budget, schedule, quality and technical documentation.",
    },
    full: null,
    status: "open",
    publishedAt: null,
    externalUrl: "https://www.rabota.md/ro/locuri-de-munca/manager-de-proiect-in-constructii/56156",
  },
  {
    slug: "chief-engineer",
    title: { ro: "Inginer-șef", ru: "Главный инженер", en: "Chief Engineer" },
    department: "operations",
    location: { ro: "Chișinău", ru: "Кишинэу", en: "Chișinău" },
    summary: {
      ro: "Mentenanța tehnică a clădirilor și instalațiilor, rețele inginerești, bugete, furnizori și lucrări de reparații.",
      ru: "Техническая эксплуатация зданий и инженерных систем, бюджеты, подрядчики и организация ремонтных работ.",
      en: "Technical maintenance of buildings and engineering systems, budgets, service providers and repair programmes.",
    },
    full: null,
    status: "open",
    publishedAt: null,
    externalUrl: "https://www.rabota.md/ro/locuri-de-munca/inginer-sef/83579",
  },
  {
    slug: "legal-counsel",
    title: { ro: "Jurisconsult", ru: "Юрисконсульт", en: "Legal Counsel" },
    department: "legal",
    location: { ro: "Chișinău · Botanica", ru: "Кишинэу · Ботаника", en: "Chișinău · Botanica" },
    summary: {
      ro: "Suport juridic pentru activitatea operațională și dezvoltarea imobiliară, contracte, conformitate și relația cu autoritățile.",
      ru: "Юридическое сопровождение операционной деятельности и девелопмента, договоры, комплаенс и взаимодействие с органами власти.",
      en: "Legal support for operations and real-estate development, contracts, compliance and public-authority matters.",
    },
    full: null,
    status: "open",
    publishedAt: null,
    externalUrl: "https://www.rabota.md/ro/locuri-de-munca/jurisconsult/38947",
  },
  {
    slug: "construction-maintenance-worker",
    title: {
      ro: "Muncitor în construcții – întreținere și reparații",
      ru: "Рабочий по строительству, обслуживанию и ремонту",
      en: "Construction Maintenance & Repairs Worker",
    },
    department: "operations",
    location: { ro: "Chișinău · Botanica", ru: "Кишинэу · Ботаника", en: "Chișinău · Botanica" },
    summary: {
      ro: "Lucrări curente de întreținere și reparații în clădiri și spații administrative, inclusiv lucrări tehnice și de finisare.",
      ru: "Текущие работы по обслуживанию и ремонту зданий и административных помещений, включая технические и отделочные работы.",
      en: "Day-to-day maintenance and repair works across buildings and administrative spaces, including technical and finishing works.",
    },
    full: null,
    status: "open",
    publishedAt: null,
    externalUrl: "https://www.rabota.md/ro/locuri-de-munca/muncitor-in-constructii-intretinere-si-reparatii/74002",
  },
];

export const openVacancies = vacancies.filter((vacancy) => vacancy.status === "open");

/** Employer copy — plain, verifiable, no invented culture or benefit claims. */
export const employerBrand = {
  kicker: { ro: "Cariere", ru: "Вакансии", en: "Careers" } satisfies Localized,
  direction: {
    ro: ["Lucrați cu noi."],
    ru: ["Работайте с нами."],
    en: ["Work with us."],
  } as Record<SiteLocale, string[]>,
  lead: {
    ro: "MEGAPARC cumpără, dezvoltă și închiriază imobiliare proprii. Căutăm oameni care vor să lucreze cu clădiri și proiecte reale.",
    ru: "MEGAPARC покупает, развивает и сдаёт в аренду собственную недвижимость. Мы ищем людей, которые хотят работать с реальными зданиями и проектами.",
    en: "MEGAPARC buys, develops and leases its own real estate. We are looking for people who want to work on real buildings and projects.",
  } satisfies Localized,
  why: {
    kicker: { ro: "De ce MEGAPARC", ru: "Почему MEGAPARC", en: "Why MEGAPARC" } satisfies Localized,
    title: {
      ro: "Obiecte și proiecte reale.",
      ru: "Реальные объекты и проекты.",
      en: "Real properties and projects.",
    } satisfies Localized,
    points: [
      { title: { ro: "Lucru cu obiecte reale", ru: "Работа с реальными объектами", en: "Work on real properties" }, text: { ro: "Clădiri în funcțiune, șantiere și proiecte noi, nu sarcini abstracte.", ru: "Действующие здания, стройки и новые проекты, а не абстрактные задачи.", en: "Operating buildings, construction sites and new projects, not abstract tasks." } },
      { title: { ro: "O echipă cu mai multe direcții", ru: "Команда нескольких направлений", en: "A team across disciplines" }, text: { ro: "Achiziții, finanțe, dezvoltare, construcție, închiriere și exploatare lucrează împreună.", ru: "Приобретения, финансы, девелопмент, строительство, аренда и эксплуатация работают вместе.", en: "Acquisitions, finance, development, construction, leasing and operations work together." } },
      { title: { ro: "Responsabilitate pentru rezultat", ru: "Ответственность за результат", en: "Accountability for results" }, text: { ro: "Fiecare specialist vede rezultatul muncii sale în starea obiectului și în cifrele lui.", ru: "Каждый специалист видит результат своей работы в состоянии объекта и его показателях.", en: "Every specialist sees the result of their work in the condition and performance of the property." } },
    ] as { title: Localized; text: Localized }[],
  },
  how: {
    kicker: { ro: "Cum lucrăm", ru: "Как мы работаем", en: "How we work" } satisfies Localized,
    themes: [
      { title: { ro: "Funcția înaintea formei", ru: "Функция прежде формы", en: "Function before form" }, text: { ro: "Mai întâi decidem cum va fi folosit obiectul, apoi cum arată.", ru: "Сначала решаем, как объект будет использоваться, потом — как он выглядит.", en: "First we decide how a building will be used, then how it looks." } },
      { title: { ro: "Calculăm economia", ru: "Считаем экономику", en: "We run the numbers" }, text: { ro: "Deciziile se bazează pe calcule, nu pe presupuneri.", ru: "Решения опираются на расчёты, а не на предположения.", en: "Decisions rest on calculations, not assumptions." } },
      { title: { ro: "Răspundem de rezultat", ru: "Отвечаем за результат", en: "We own the outcome" }, text: { ro: "În spatele fiecărei decizii stă un om concret.", ru: "За каждым решением стоит конкретный человек.", en: "There is a named person behind every decision." } },
      { title: { ro: "Construim pentru mult timp", ru: "Строим надолго", en: "We build to last" }, text: { ro: "Calitatea construcției și a exploatării contează mai mult decât viteza.", ru: "Качество строительства и эксплуатации важнее скорости.", en: "Build and operating quality matter more than speed." } },
      { title: { ro: "Lucrăm împreună", ru: "Работаем вместе", en: "We work together" }, text: { ro: "Finanțele, proiectarea, construcția, închirierea și exploatarea rezolvă sarcinile împreună.", ru: "Финансы, проектирование, строительство, аренда и эксплуатация решают задачи совместно.", en: "Finance, design, construction, leasing and operations solve problems together." } },
    ] as { title: Localized; text: Localized }[],
  },
  areas: {
    kicker: { ro: "Direcții", ru: "Направления", en: "Areas" } satisfies Localized,
    title: { ro: "Unde avem nevoie de specialiști", ru: "Где нужны специалисты", en: "Where we need people" } satisfies Localized,
  },
  positions: {
    kicker: { ro: "Posturi deschise", ru: "Открытые вакансии", en: "Open vacancies" } satisfies Localized,
    sourceNote: {
      ro: "Posturi publicate de SRL MEGAPARC pe Rabota.md. Detaliile și aplicarea se deschid pe site-ul sursă.",
      ru: "Вакансии опубликованы на Rabota.md — там же подробности и отклик.",
      en: "Roles published by SRL MEGAPARC on Rabota.md. Full details and applications open on the source site.",
    } satisfies Localized,
    viewRole: { ro: "Vezi postul", ru: "Смотреть вакансию", en: "View role" } satisfies Localized,
    allRoles: { ro: "Toate posturile pe Rabota.md", ru: "Все вакансии на Rabota.md", en: "All roles on Rabota.md" } satisfies Localized,
    allRolesUrl: "https://www.rabota.md/ro/companies/imc-group",
    emptyTitle: {
      ro: "Momentan nu există posturi deschise.",
      ru: "Открытых вакансий сейчас нет.",
      en: "There are no open vacancies at the moment.",
    } satisfies Localized,
    emptyText: {
      ro: "Puteți trimite un CV prin pagina de contact. Îl vom lua în considerare când apar posturi potrivite.",
      ru: "Вы можете отправить резюме через страницу контактов. Мы вернёмся к нему, когда появятся подходящие позиции.",
      en: "You can send a CV through the contact page. We will come back to it when a suitable role opens.",
    } satisfies Localized,
  },
  apply: {
    kicker: { ro: "Candidatură", ru: "Отклик", en: "Application" } satisfies Localized,
    title: { ro: "Lucrați cu noi.", ru: "Работайте с нами.", en: "Work with us." } satisfies Localized,
    text: {
      ro: "Trimiteți un CV și indicați direcția care vă interesează. Datele personale ale candidaților sunt folosite doar pentru recrutare.",
      ru: "Отправьте резюме и укажите интересующее направление. Персональные данные кандидатов используются только для подбора персонала.",
      en: "Send a CV and tell us which area interests you. Candidate personal data is used for recruitment only.",
    } satisfies Localized,
    cta: { ro: "Trimite CV-ul", ru: "Отправить резюме", en: "Send a CV" } satisfies Localized,
  },
};
