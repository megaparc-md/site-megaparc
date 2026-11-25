import { typeset } from "@/lib/careers";
import type { Localized, SiteLocale } from "@/lib/site-data";

/**
 * CAREERS — the employer-brand copy of the careers page and the labels of a vacancy page
 * (OWNER «MEGAPARC CAREERS — PREMIUM EMPLOYER BRAND & WORDPRESS CMS», 2026-11-25).
 *
 * Headings, the hero, the manifesto (RU) and the closing are the OWNER's wording; RO and EN are written as equal versions, not
 * literal translations. RO addresses the candidate with «tu», as the OWNER's own RO lines do («Creează alături de noi…»).
 * No HR clichés, no promise that is not confirmed for every position (training, promotion, bonuses, flexible hours), no reply
 * deadline, no number of interview stages. MEGAPARC buys, builds, develops and leases ITS OWN real estate — never a third-party manager.
 */
const L = (ro: string, ru: string, en: string): Localized => ({ ro: typeset(ro, "ro"), ru: typeset(ru, "ru"), en: typeset(en, "en") });
const lines = (ro: string[], ru: string[], en: string[]): Record<SiteLocale, string[]> => ({ ro: ro.map((t) => typeset(t, "ro")), ru: ru.map((t) => typeset(t, "ru")), en: en.map((t) => typeset(t, "en")) });

export const careersCopy = {
  label: L("Cariere", "Вакансии", "Careers"),

  /* 01 — hero */
  hero: {
    title: lines(["O muncă ale cărei", "rezultate se văd."], ["Работа,", "результат которой видно."], ["Work you can see", "the results of."]),
    text: L(
      "Creează alături de noi spații în care afacerile se dezvoltă. Aici, experiența ta se transformă în decizii, deciziile în proiecte, iar proiectele devin parte din oraș.",
      "Создавайте вместе с нами пространства, в которых развивается бизнес. Здесь ваш опыт превращается в решения, решения — в проекты, а проекты становятся частью города.",
      "Create spaces where businesses grow. Here, your expertise shapes decisions, decisions become projects, and projects become part of the city.",
    ),
    cta: L("Descoperă oportunitățile", "Найти свою возможность", "Explore opportunities"),
    photoAlt: L("Dacia 31 — clădire MEGAPARC în Chișinău", "Dacia 31 — здание MEGAPARC в Кишинэу", "Dacia 31 — a MEGAPARC building in Chișinău"),
    pause: L("Oprește filmul", "Остановить видео", "Pause the film"),
    play: L("Pornește filmul", "Включить видео", "Play the film"),
  },

  /* 02 — manifesto */
  manifesto: {
    label: L("A lucra la MEGAPARC", "Работа в MEGAPARC", "Working at MEGAPARC"),
    title: L("Contribuția ta profesională devine parte din oraș.", "Ваш профессиональный вклад становится частью города.", "Your professional contribution becomes part of the city."),
    lead: L(
      "Imobiliarele înseamnă mai mult decât clădiri. În spatele fiecărui proiect realizat se află oameni — cunoștințele, deciziile și responsabilitatea lor pentru rezultat.",
      "Недвижимость — это больше, чем здания. За каждым реализованным проектом стоят люди, их знания, решения и ответственность за результат.",
      "Real estate is more than buildings. Behind every completed project are people — their knowledge, their decisions and their responsibility for the result.",
    ),
    body: lines(
      [
        "La MEGAPARC reunim specialiști din domenii diferite: de la inginerie și construcții până la finanțe, drept, activitate comercială și management strategic.",
        "Apreciem profesionalismul, inițiativa și capacitatea de a transforma sarcinile complexe în rezultate concrete.",
        "Dacă pentru tine contează să vezi rezultatul muncii tale și să participi la proiecte cu valoare pe termen lung, poate că anume aici începe următoarea ta etapă profesională.",
      ],
      [
        "В MEGAPARC мы объединяем специалистов разных направлений: от инженерии и строительства до финансов, права, коммерции и стратегического управления.",
        "Мы ценим профессионализм, инициативу и способность превращать сложные задачи в конкретные результаты.",
        "Если вам важно видеть результат своей работы и участвовать в проектах, которые имеют долгосрочную ценность, возможно, именно здесь начинается ваш следующий профессиональный этап.",
      ],
      [
        "At MEGAPARC we bring together specialists from different fields: from engineering and construction to finance, law, commercial work and strategic management.",
        "We value professionalism, initiative and the ability to turn complex tasks into concrete results.",
        "If it matters to you to see the result of your work and to take part in projects of lasting value, this may be where your next professional chapter begins.",
      ],
    ),
  },

  /* 03 — MEGAPARC as an employer: confirmed facts only (figures come from the site's one confirmed source) */
  employer: {
    label: L("MEGAPARC ca angajator", "MEGAPARC как работодатель", "MEGAPARC as an employer"),
    title: L("Proprietăți proprii. Perspectivă pe termen lung.", "Собственные объекты. Долгая перспектива.", "Our own properties. A long-term view."),
    figures: {
      years: L("de ani pe piața Republicii Moldova", "лет на рынке Республики Молдова", "years in the Republic of Moldova"),
      operating: L("imobile în exploatare", "действующих объекта", "operating properties"),
      area: L("suprafața imobilelor în exploatare", "площадь действующих объектов", "area of the operating properties"),
      land: L("terenuri pentru dezvoltare", "земли для развития", "of land for development"),
    },
    points: [
      {
        title: L("Peste 20 de ani pe piață", "Более 20 лет на рынке", "More than 20 years in the market"),
        text: L("MEGAPARC a fost fondată în 2005 și activează de atunci pe piața Republicii Moldova.", "MEGAPARC основана в 2005 году и с тех пор работает на рынке Республики Молдова.", "MEGAPARC was founded in 2005 and has worked in the Republic of Moldova ever since."),
      },
      {
        title: L("Proiecte imobiliare reale", "Реальные проекты недвижимости", "Real property projects"),
        text: L("Clădiri, șantiere și terenuri proprii — obiecte pe care le poți vedea, nu sarcini abstracte.", "Собственные здания, строительные площадки и земля — объекты, которые можно увидеть, а не абстрактные задачи.", "Our own buildings, construction sites and land — properties you can see, not abstract tasks."),
      },
      {
        title: L("Responsabilitate pentru rezultat", "Ответственность за результат", "Responsibility for the result"),
        text: L("Compania deține ceea ce construiește și închiriază, de aceea calitatea deciziilor se vede în timp.", "Компания владеет тем, что строит и сдаёт в аренду, поэтому качество решений видно годами.", "The company owns what it builds and leases, so the quality of every decision shows over the years."),
      },
      {
        title: L("Dezvoltare profesională", "Профессиональное развитие", "Professional development"),
        text: L("Lucrul cu un obiect pe toate etapele — achiziție, construcție, închiriere, exploatare — lărgește experiența profesională.", "Работа с объектом на всех стадиях — покупка, строительство, аренда, эксплуатация — расширяет профессиональный опыт.", "Working on a property at every stage — acquisition, construction, leasing, operation — broadens professional experience."),
      },
      {
        title: L("Sarcini complexe", "Комплексные задачи", "Complex tasks"),
        text: L("Ingineria, dreptul, finanțele și activitatea comercială rezolvă aceleași proiecte împreună.", "Инженерия, право, финансы и коммерция решают задачи одного проекта вместе.", "Engineering, law, finance and commercial work solve the same projects together."),
      },
      {
        title: L("Colaborare pe termen lung", "Долгосрочное сотрудничество", "Long-term cooperation"),
        text: L("Compania își dezvoltă proprietățile ani la rând și caută oameni pentru o colaborare de durată.", "Компания развивает свои объекты годами и ищет людей для долгой совместной работы.", "The company develops its properties for years and looks for people to work with for the long term."),
      },
    ],
  },

  /* 04 — professional directions (derived from the open vacancies) */
  directions: {
    label: L("Direcții profesionale", "Профессиональные направления", "Professional areas"),
    title: L("Unde este nevoie de experiența ta.", "Где нужен ваш опыт.", "Where your experience is needed."),
    show: L("Vezi posturile direcției", "Смотреть вакансии направления", "View the positions in this area"),
  },

  /* 05 — open vacancies */
  positions: {
    label: L("Posturi vacante", "Открытые вакансии", "Open positions"),
    title: L("Găsește-ți locul în MEGAPARC.", "Найдите своё место в MEGAPARC.", "Find your place at MEGAPARC."),
    text: L("Profesii diferite. Responsabilități diferite. Același angajament față de rezultate.", "Разные профессии. Разные задачи. Общая ответственность за результат.", "Different professions. Different responsibilities. A shared commitment to results."),
    all: L("Toate direcțiile", "Все направления", "All areas"),
    filter: L("Direcție profesională", "Профессиональное направление", "Professional area"),
    more: L("Detalii despre post", "Подробнее о вакансии", "View the position"),
    emptyTitle: L("Momentan nu avem posturi vacante.", "Сейчас открытых вакансий нет.", "There are no open positions right now."),
    emptyText: L(
      "Posturile noi apar pe măsură ce proiectele se dezvoltă. Dacă experiența ta ține de domeniul imobiliar, de construcții sau de exploatarea clădirilor, trimite CV-ul la adresa de mai jos — revenim la el când se deschide un post potrivit.",
      "Новые позиции появляются по мере развития проектов. Если ваш опыт связан с недвижимостью, строительством или эксплуатацией зданий, направьте резюме на адрес ниже — мы вернёмся к нему, когда откроется подходящая вакансия.",
      "New positions open as the projects develop. If your experience is in real estate, construction or building operations, send your CV to the address below — we will come back to it when a suitable position opens.",
    ),
  },

  /* 06 — real projects, real contribution */
  projects: {
    label: L("Proiecte", "Проекты", "Projects"),
    title: L("Proiecte reale. Contribuție reală.", "Реальные проекты. Реальный вклад.", "Real projects. Real contribution."),
    text: L(
      "Rezultatul muncii specialiștilor noștri sunt clădirile: le cumpărăm, le construim, le dezvoltăm și le închiriem. Acestea sunt proprietăți MEGAPARC la care echipa lucrează astăzi.",
      "Результат работы наших специалистов — здания: мы их покупаем, строим, развиваем и сдаём в аренду. Это объекты MEGAPARC, с которыми команда работает сегодня.",
      "The result of our specialists' work is buildings: we buy, build, develop and lease them. These are MEGAPARC properties the team is working on today.",
    ),
    cta: L("Descoperă proiectele noastre", "Познакомиться с нашими проектами", "Explore our projects"),
  },

  /* 07 — how to apply */
  apply: {
    label: L("Candidatură", "Отклик", "Application"),
    title: L("Cum aplici.", "Как откликнуться.", "How to apply."),
    steps: lines(
      ["Alege postul care te interesează.", "Citește condițiile și trimite un CV detaliat.", "Dacă profilul corespunde cerințelor, echipa HR te va contacta pentru următorii pași."],
      ["Выберите интересующую вакансию.", "Ознакомьтесь с условиями и направьте подробное резюме.", "При соответствии требованиям HR свяжется с вами для дальнейшего общения."],
      ["Choose the position that interests you.", "Read the terms and send a detailed CV.", "If your profile matches the requirements, HR will contact you about the next steps."],
    ),
    emailLabel: L("CV-ul — la adresa", "Резюме — на адрес", "Send your CV to"),
    copy: L("Copiază adresa", "Скопировать адрес", "Copy the address"),
    copied: L("Adresa a fost copiată", "Адрес скопирован", "Address copied"),
  },

  /* 08 — closing */
  closing: {
    title: L("Următoarea etapă a carierei tale poate începe aici.", "Ваш следующий профессиональный этап может начаться здесь.", "Your next professional chapter could begin here."),
    text: L(
      "Dacă ești pregătit să îți asumi responsabilități, să îți dezvolți competențele și să creezi rezultate vizibile, descoperă oportunitățile MEGAPARC.",
      "Если вы готовы брать ответственность, развивать свои компетенции и создавать результат, который можно увидеть, — познакомьтесь с возможностями MEGAPARC.",
      "If you are ready to take responsibility, develop your expertise and deliver results you can see, discover the opportunities at MEGAPARC.",
    ),
    cta: L("Vezi posturile vacante", "Смотреть открытые вакансии", "View open positions"),
  },
};

/** Labels of a vacancy page (A–H). */
export const vacancyCopy = {
  back: L("Toate posturile vacante", "Все вакансии", "All open positions"),
  facts: {
    direction: L("Direcție", "Направление", "Area"),
    format: L("Format", "Формат", "Format"),
    location: L("Locul de muncă", "Место работы", "Location"),
    pay: L("Remunerare", "Оплата", "Pay"),
  },
  apply: L("Aplică", "Откликнуться", "Apply"),
  applyLong: L("Aplică pentru acest post", "Откликнуться на вакансию", "Apply for this position"),
  role: L("Rolul tău la MEGAPARC", "Ваша роль в MEGAPARC", "Your role at MEGAPARC"),
  tasks: L("Responsabilitățile tale", "Ваши задачи", "What you will do"),
  expect: L("Ce așteptăm", "Что мы ожидаем", "What we expect"),
  must: L("Cerințe obligatorii", "Обязательные требования", "Required"),
  skills: L("Competențe profesionale", "Профессиональные компетенции", "Professional skills"),
  plus: L("Constituie un avantaj", "Будет преимуществом", "An advantage"),
  kpi: L("Cum se evaluează rezultatul", "Как оценивается результат", "How results are measured"),
  offer: L("Ce oferă MEGAPARC", "Что предлагает MEGAPARC", "What MEGAPARC offers"),
  pay: L("Remunerare", "Вознаграждение", "Remuneration"),
  bonus: L("Bonusuri", "Бонусы", "Bonuses"),
  compensation: L("Compensații", "Компенсации", "Reimbursements"),
  conditions: L("Condiții", "Условия", "Terms"),
  how: L("Cum aplici", "Как откликнуться", "How to apply"),
  howText: L(
    "Trimite un CV detaliat la adresa HR. Butonul deschide un e-mail cu subiectul deja completat.",
    "Направьте подробное резюме на адрес HR. Кнопка откроет письмо с уже заполненной темой.",
    "Send a detailed CV to the HR address. The button opens an e-mail with the subject already filled in.",
  ),
  subject: L("Subiectul e-mailului", "Тема письма", "E-mail subject"),
  email: L("Adresa HR", "Адрес HR", "HR address"),
  other: L("Alte oportunități", "Другие возможности", "Other opportunities"),
  closedLabel: L("Post închis", "Вакансия закрыта", "Position closed"),
  closedTitle: L("Acest post nu mai este disponibil.", "Эта вакансия закрыта.", "This position is closed."),
  closedText: L(
    "Selecția pentru acest post s-a încheiat. Vezi posturile vacante la MEGAPARC.",
    "Набор на эту позицию завершён. Посмотрите открытые вакансии MEGAPARC.",
    "Recruitment for this position has ended. See the open positions at MEGAPARC.",
  ),
  pausedLabel: L("Aplicările sunt suspendate", "Приём откликов приостановлен", "Applications paused"),
  pausedTitle: L("Momentan nu primim aplicări pentru acest post.", "Приём откликов на эту вакансию приостановлен.", "Applications for this position are paused."),
  pausedText: L(
    "Primirea aplicărilor pentru acest post este suspendată temporar. Vezi posturile vacante la MEGAPARC.",
    "Приём откликов на эту позицию временно приостановлен. Посмотрите открытые вакансии MEGAPARC.",
    "We are temporarily not accepting applications for this position. See the open positions at MEGAPARC.",
  ),
};
