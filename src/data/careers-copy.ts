import { typeset } from "@/lib/careers";
import type { Localized, SiteLocale } from "@/lib/site-data";

/**
 * CAREERS — the employer-brand copy of the careers page and the labels of a vacancy page
 * (OWNER «MEGAPARC CAREERS — PREMIUM EMPLOYER BRAND & WORDPRESS CMS», 2026-11-25; R2 «EMPLOYER BRAND EXCELLENCE», 2026-11-25).
 *
 * R2 structure — every scene has one job, no meaning is said twice:
 *   hero (the promise + the way to the vacancies) → open vacancies (find a role fast) → why MEGAPARC (the five advantages + the
 *   confirmed figures) → where the work happens (real property, linked to the directions) → how to apply → closing band.
 * The R1 manifesto, the six employer points and the separate dark «directions» scene are folded into these scenes.
 *
 * RU is the master; RO and EN carry the same idea in their own words (OWNER R2 §4: RO «Construim împreună. Rezultatele se văd.»,
 * EN «Build something that lasts.»). RO addresses the candidate with «tu», as the OWNER's own RO lines do.
 * No HR clichés, no promise that is not confirmed for every position (training, promotion, insurance, events, bonuses, flexible
 * hours), no reply deadline. MEGAPARC buys, builds, develops and leases ITS OWN real estate — never a third-party manager.
 */
const L = (ro: string, ru: string, en: string): Localized => ({ ro: typeset(ro, "ro"), ru: typeset(ru, "ru"), en: typeset(en, "en") });
const lines = (ro: string[], ru: string[], en: string[]): Record<SiteLocale, string[]> => ({ ro: ro.map((t) => typeset(t, "ro")), ru: ru.map((t) => typeset(t, "ru")), en: en.map((t) => typeset(t, "en")) });

export const careersCopy = {
  label: L("Cariere", "Вакансии", "Careers"),

  /* 01 — hero: the promise and the shortest way to the vacancies */
  hero: {
    title: lines(["Construim împreună.", "Rezultatele se văd."], ["Работа,", "результат которой видно."], ["Build something", "that lasts."]),
    text: L(
      "MEGAPARC cumpără, construiește și dezvoltă imobile proprii și le închiriază. Aici, experiența ta devine decizii, iar deciziile devin clădiri care funcționează ani la rând.",
      "MEGAPARC покупает, строит и развивает собственную недвижимость и сдаёт её в аренду. Здесь ваш опыт становится решениями, а решения — зданиями, которые работают годами.",
      "MEGAPARC buys, builds and develops its own property and leases it to businesses. Here, your expertise turns into decisions — and decisions into buildings that serve for years.",
    ),
    cta: L("Vezi posturile vacante", "Смотреть вакансии", "View open positions"),
    index: L("Direcții", "Направления", "Areas"),
    photoAlt: L("Dacia 31 — clădire MEGAPARC în Chișinău", "Dacia 31 — здание MEGAPARC в Кишинэу", "Dacia 31 — a MEGAPARC building in Chișinău"),
  },

  /* 02 — open vacancies */
  positions: {
    label: L("Posturi vacante", "Открытые вакансии", "Open positions"),
    title: L("Găsește-ți rolul.", "Найдите свою роль.", "Find your role."),
    text: L(
      "Alege o direcție sau deschide un post. Pentru a aplica, este suficient un e-mail.",
      "Выберите направление или откройте вакансию. Чтобы откликнуться, достаточно одного письма.",
      "Choose an area or open a role. Applying takes a single e-mail.",
    ),
    all: L("Toate", "Все", "All"),
    filter: L("Direcție profesională", "Профессиональное направление", "Professional area"),
    more: L("Vezi postul", "Открыть вакансию", "View role"),
    emptyTitle: L("Momentan nu avem posturi vacante.", "Сейчас открытых вакансий нет.", "There are no open positions right now."),
    emptyText: L(
      "Posturile noi apar pe măsură ce proiectele se dezvoltă. Dacă experiența ta ține de domeniul imobiliar, de construcții sau de exploatarea clădirilor, trimite CV-ul la adresa de mai jos — revenim la el când se deschide un post potrivit.",
      "Новые позиции появляются по мере развития проектов. Если ваш опыт связан с недвижимостью, строительством или эксплуатацией зданий, направьте резюме на адрес ниже — мы вернёмся к нему, когда откроется подходящая вакансия.",
      "New positions open as the projects develop. If your background is in real estate, construction or building operations, send your CV to the address below and we will come back to it when a suitable role opens.",
    ),
  },

  /* 03 — why MEGAPARC: the five advantages (OWNER R2 §5) and the confirmed figures */
  why: {
    label: L("De ce MEGAPARC", "Почему MEGAPARC", "Why MEGAPARC"),
    title: L("Deținem ceea ce construim.", "Мы владеем тем, что строим.", "We own what we build."),
    lead: L(
      "De aceea calitatea muncii se vede în clădire — astăzi și peste ani.",
      "Поэтому качество работы видно в самом здании — сегодня и через годы.",
      "So the quality of the work shows in the building itself — today and years from now.",
    ),
    points: [
      {
        title: L("Rezultate vizibile", "Видимый результат", "Results you can see"),
        text: L(
          "Clădiri, șantiere și terenuri reale ale MEGAPARC. Rezultatul muncii tale este un loc pe care îl poți vedea, nu un rând dintr-un raport.",
          "Реальные здания, стройплощадки и земля MEGAPARC. Результат работы — место, которое можно увидеть, а не строка в отчёте.",
          "Real MEGAPARC buildings, sites and land. What you deliver is a place you can walk into, not a line in a report.",
        ),
      },
      {
        title: L("Amploare profesională", "Профессиональный масштаб", "Professional scope"),
        text: L(
          "Construcție, dezvoltare și exploatare imobiliară — sarcini în care se întâlnesc ingineria, dreptul, finanțele și activitatea comercială. Gradul de implicare depinde de post.",
          "Строительство, развитие и эксплуатация недвижимости — задачи, где сходятся инженерия, право, финансы и коммерция. Глубина участия зависит от должности.",
          "Construction, development and building operations — work where engineering, law, finance and leasing meet. How deeply you are involved depends on the role.",
        ),
      },
      {
        title: L("Perspectivă pe termen lung", "Долгосрочная перспектива", "A long-term horizon"),
        text: L(
          "MEGAPARC activează pe piață de peste 20 de ani — din 2005 — și își dezvoltă propriile proiecte. Aici se planifică pe ani înainte.",
          "MEGAPARC работает на рынке более 20 лет — с 2005 года — и развивает собственные проекты. Здесь планируют на годы вперёд.",
          "MEGAPARC has been in the market for more than 20 years — since 2005 — and develops its own projects. Plans here are made years ahead.",
        ),
      },
      {
        title: L("Responsabilitate profesională", "Профессиональная ответственность", "Ownership of the outcome"),
        text: L(
          "Deciziile specialiștilor influențează direct calitatea clădirilor și felul în care se dezvoltă proprietățile. Contribuția fiecăruia se vede.",
          "Решения специалистов прямо влияют на качество зданий и на то, как развиваются объекты. Вклад каждого заметен.",
          "Specialists' decisions shape the quality of the buildings and the way the properties develop. Every contribution shows.",
        ),
      },
      {
        title: L("Condiții transparente", "Прозрачные условия", "Clear terms"),
        text: L(
          "Responsabilitățile, cerințele și remunerarea sunt descrise în fiecare post — înainte să aplici.",
          "Задачи, требования и вознаграждение указаны в каждой вакансии — ещё до отклика.",
          "Every role sets out its responsibilities, requirements and pay before you apply.",
        ),
      },
    ],
    figures: {
      years: L("de ani pe piața Republicii Moldova", "лет на рынке Республики Молдова", "years in the Moldovan market"),
      operating: L("imobile în exploatare", "действующих объекта", "operating properties"),
      area: L("suprafața imobilelor în exploatare", "площадь действующих объектов", "area of the operating properties"),
      land: L("terenuri pentru dezvoltare", "земли для развития", "of land for development"),
    },
  },

  /* 04 — where the work happens: real property, linked to the directions that have open vacancies */
  projects: {
    label: L("Unde se lucrează", "Где идёт работа", "Where the work happens"),
    title: L("Fiecare post ține de proiecte reale.", "Каждая вакансия связана с реальными объектами.", "Every role is tied to real property."),
    text: L(
      "Proiectele de dezvoltare cer expertiză în construcții și inginerie; clădirile în exploatare — administrare, închiriere și rigoare juridică.",
      "Проекты развития требуют строительной и инженерной экспертизы, действующие объекты — эксплуатации, аренды и правовой точности.",
      "Development projects call for construction and engineering expertise; operating buildings for operations, leasing and legal precision.",
    ),
    work: {
      vatra: L("Proiect de dezvoltare: construcție, soluții inginerești, documentație de autorizare.", "Проект развития: строительство, инженерные решения, разрешительная документация.", "Development project: construction, engineering solutions, permits."),
      "moscova-9": L("Imobil în exploatare: exploatare, relația cu chiriașii, întreținere tehnică.", "Действующий объект: эксплуатация, работа с арендаторами, техническое обслуживание.", "Operating property: building operations, tenant relationships, maintenance."),
      "moscova-20": L("Imobil în exploatare: spații comerciale, închiriere, instalații.", "Действующий объект: коммерческие площади, аренда, инженерные системы.", "Operating property: commercial space, leasing, building services."),
    } as Record<string, Localized>,
    roles: L("Posturi", "Вакансии", "Roles"),
    cta: L("Toate proiectele MEGAPARC", "Все проекты MEGAPARC", "All MEGAPARC projects"),
  },

  /* 05 — how to apply */
  apply: {
    label: L("Candidatură", "Отклик", "Application"),
    title: L("Cum aplici.", "Как откликнуться.", "How to apply."),
    steps: lines(
      ["Alege postul și citește condițiile.", "Trimite un CV detaliat, cu subiectul e-mailului indicat în post.", "Dacă experiența ta corespunde, echipa HR te contactează pentru pașii următori."],
      ["Выберите вакансию и прочитайте условия.", "Отправьте подробное резюме с темой письма, указанной в вакансии.", "Если опыт подходит, HR свяжется с вами и расскажет о следующих шагах."],
      ["Choose a role and read the terms.", "Send a detailed CV, using the e-mail subject given in the role.", "If your experience is a match, HR will contact you about the next steps."],
    ),
    emailLabel: L("CV-ul — la adresa", "Резюме — на адрес", "Send your CV to"),
    copy: L("Copiază adresa", "Скопировать адрес", "Copy address"),
    copied: L("Adresa a fost copiată", "Адрес скопирован", "Address copied"),
  },

  /* 06 — closing band on a real photograph */
  closing: {
    title: lines(["Experiența ta.", "Următorul nostru proiect."], ["Ваш опыт.", "Наш следующий проект."], ["Your expertise.", "Our next project."]),
    cta: L("Vezi posturile vacante", "Смотреть вакансии", "View open positions"),
  },
};

/** Labels of a vacancy page (A–H). */
export const vacancyCopy = {
  back: L("Toate posturile vacante", "Все вакансии", "All open positions"),
  facts: {
    direction: L("Direcție", "Направление", "Area"),
    employment: L("Program", "Занятость", "Employment"),
    mode: L("Regim de lucru", "Формат работы", "Work mode"),
    location: L("Locul de muncă", "Место работы", "Location"),
    pay: L("Remunerare", "Оплата", "Pay"),
  },
  apply: L("Aplică", "Откликнуться", "Apply"),
  applyLong: L("Aplică pentru acest post", "Откликнуться на вакансию", "Apply for this role"),
  focus: L("Esența rolului", "Суть роли", "The role in focus"),
  role: L("Rolul tău la MEGAPARC", "Ваша роль в MEGAPARC", "Your role at MEGAPARC"),
  tasks: L("Responsabilitățile tale", "Ваши задачи", "What you will do"),
  expect: L("Ce așteptăm", "Что мы ожидаем", "What we are looking for"),
  must: L("Cerințe obligatorii", "Обязательные требования", "Essential"),
  skills: L("Competențe profesionale", "Профессиональные компетенции", "Professional skills"),
  plus: L("Constituie un avantaj", "Будет преимуществом", "Nice to have"),
  kpi: L("Cum se evaluează rezultatul", "Как оценивается результат", "How performance is measured"),
  offer: L("Ce oferă MEGAPARC", "Что предлагает MEGAPARC", "What MEGAPARC offers"),
  pay: L("Remunerare", "Вознаграждение", "Pay"),
  bonus: L("Bonusuri", "Бонусы", "Bonuses"),
  compensation: L("Compensații", "Компенсации", "Expenses"),
  conditions: L("Condiții", "Условия", "Terms"),
  how: L("Cum aplici", "Как откликнуться", "How to apply"),
  howText: L(
    "Trimite un CV detaliat la adresa HR. Butonul deschide un e-mail cu subiectul deja completat.",
    "Направьте подробное резюме на адрес HR. Кнопка откроет письмо с уже заполненной темой.",
    "Send a detailed CV to the HR address. The button opens an e-mail with the subject already filled in.",
  ),
  subject: L("Subiectul e-mailului", "Тема письма", "E-mail subject"),
  email: L("Adresa HR", "Адрес HR", "HR address"),
  other: L("Alte posturi vacante", "Другие вакансии", "Other open roles"),
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
