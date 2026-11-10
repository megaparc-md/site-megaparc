import Link from "next/link";
import type { CSSProperties } from "react";
import { CareersMoment } from "@/components/careers-moment";
import { ConceptImage, DemoMark, Opening } from "@/components/experience";
import { PageShell } from "@/components/page-shell";
import { ArtImage } from "@/components/primitives";
import { Button, Icon } from "@/components/ui";
import { company, contactLinks, cultureStatement, roleStories } from "@/data/demo-content";
import { formatDate, listProjects, listVacancies } from "@/content/source";
import { departmentLabel, employerBrand } from "@/lib/careers";
import { DirectContact } from "@/components/direct-contact";
import { isProductionEdition, localePath, type SiteLocale } from "@/lib/site-data";

/**
 * CAREERS — emotional contrast to the institutional pages (2026-10-07).
 * The candidate's real question — "what will I actually work on?" — is
 * answered with the real properties and projects first, then four pillars in a
 * walking rhythm, then role stories (DEMO: work described, never a person),
 * then the real Rabota.md vacancies as a clean list.
 */
const copy = {
  ro: {
    workLabel: "La ce veți lucra",
    workTitle: "Pe obiecte și proiecte pe care le puteți vizita mâine.",
    workLines: {
      "dacia-31": "Pregătirea clădirii pentru un nou utilizator din 2027: audit, instalații, planificare.",
      "moscova-9": "Lucrul cu un brand-chiriaș: fațadă, logistică, exploatare.",
      "moscova-20": "Lansarea spațiului pentru un nou format din august 2026.",
      "creanga-78": "Exploatarea unei clădiri cu mulți chiriași.",
      vatra: "Construcție: calitate, buget, grafic.",
      "drochia": "Evaluarea terenului: urbanism, concepte, economie.",
    } as Record<string, string>,
    pillars: [
      ["Echipă", "Achiziții, finanțe, dezvoltare, construcție, închiriere și exploatare stau la aceeași masă. O decizie bună are nevoie de toate."],
      ["Responsabilitate pe proiect", "Fiecare proiect are un om care răspunde de el — de buget, de termene și de calitatea care rămâne după predare."],
      ["Dezvoltare profesională", "Lucrați pe toată durata de viață a unui obiect: de la analiză la construcție și exploatare. Asta formează specialiști compleți."],
      ["Teren + birou", "O parte a zilei pe șantier sau în clădire, o parte la calcule și decizii. Rezultatul se vede pe stradă, nu doar în raport."],
    ],
    pillarsLabel: "Cum se lucrează la MEGAPARC",
    storiesLabel: "Roluri — cum arată munca",
    storiesTitle: "Patru roluri, descrise prin ce faceți, nu prin titluri.",
    storiesNote: "Patru roluri tipice: ce fac și de ce răspund.",
    owns: "Răspundeți de",
    positionsLabel: "Posturi deschise",
    positionsTitle: (n: number) => `${String(n).padStart(2, "0")} posturi deschise acum.`,
    view: "Vezi postul",
    viewAll: "Vezi toate posturile",
    applyLabel: "Candidatură",
    applyTitle: "Nu ați găsit rolul potrivit?",
    applyText: "Trimiteți un CV și spuneți-ne direcția care vă interesează. Ne întoarcem la el când apare un rol potrivit.",
    applyCta: "Trimite CV-ul",
  },
  ru: {
    workLabel: "Над чем вы будете работать",
    workTitle: "На объектах и проектах, которые можно увидеть завтра.",
    workLines: {
      "dacia-31": "Подготовка здания к новому пользователю с 2027 года: аудит, инженерия, планировки.",
      "moscova-9": "Работа с брендом-арендатором: фасад, логистика, эксплуатация.",
      "moscova-20": "Запуск помещения под новый формат с августа 2026 года.",
      "creanga-78": "Здание, где много арендаторов: обслуживание и сервис.",
      vatra: "Строительство: качество, бюджет, график.",
      "drochia": "Оценка участка: градостроительство, концепции, экономика.",
    } as Record<string, string>,
    pillars: [
      ["Команда", "Приобретения, финансы, девелопмент, строительство, аренда и эксплуатация — за одним столом. Хорошему решению нужны все."],
      ["Ответственность за проект", "У каждого проекта есть человек, который за него отвечает: за бюджет, сроки и качество, которое остаётся после сдачи."],
      ["Профессиональный рост", "Вы видите весь путь объекта — от анализа до стройки и эксплуатации. Так вырастают специалисты широкого профиля."],
      ["Объект + офис", "Часть дня — на площадке или в здании, часть — над расчётами и решениями. Результат виден на улице, а не только в отчёте."],
    ],
    pillarsLabel: "Как работают в MEGAPARC",
    storiesLabel: "Роли — как выглядит работа",
    storiesTitle: "Четыре роли — о работе, а не о должностях.",
    storiesNote: "Четыре типичные роли: чем заняты и за что отвечают.",
    owns: "Вы отвечаете за",
    positionsLabel: "Открытые вакансии",
    positionsTitle: (n: number) => `${String(n).padStart(2, "0")} открытых вакансий.`,
    view: "Смотреть вакансию",
    viewAll: "Смотреть все вакансии",
    applyLabel: "Отклик",
    applyTitle: "Не нашли свою роль?",
    applyText: "Отправьте резюме и укажите интересующее направление. Мы вернёмся к нему, когда появится подходящая позиция.",
    applyCta: "Отправить резюме",
  },
  en: {
    workLabel: "What you will work on",
    workTitle: "On properties and projects you could visit tomorrow.",
    workLines: {
      "dacia-31": "Preparing the building for a new occupier from 2027: audit, services, layouts.",
      "moscova-9": "Working with a brand tenant: facade, logistics, operations.",
      "moscova-20": "Launching the space for a new format from August 2026.",
      "creanga-78": "Running a multi-tenant building.",
      vatra: "Construction: quality, budget, schedule.",
      "drochia": "Assessing the site: planning, concepts, economics.",
    } as Record<string, string>,
    pillars: [
      ["Team", "Acquisitions, finance, development, construction, leasing and operations at one table. A good decision needs all of them."],
      ["Project responsibility", "Every project has a person accountable for it — for budget, schedule and the quality that stays after handover."],
      ["Career development", "You work across a property's whole life: from analysis to construction and operation. That is how all-round specialists grow."],
      ["Field + office", "Part of the day on site or in the building, part on numbers and decisions. The result shows on the street, not only in a report."],
    ],
    pillarsLabel: "How work is done at MEGAPARC",
    storiesLabel: "Roles — what the work looks like",
    storiesTitle: "Four roles, described by what you do, not by titles.",
    storiesNote: "Four typical roles: what they do and what they answer for.",
    owns: "You own",
    positionsLabel: "Open vacancies",
    positionsTitle: (n: number) => `${String(n).padStart(2, "0")} open vacancies right now.`,
    view: "View the role",
    viewAll: "See all vacancies",
    applyLabel: "Application",
    applyTitle: "Didn't find your role?",
    applyText: "Send a CV and tell us which area interests you. We come back to it when a suitable role opens.",
    applyCta: "Send a CV",
  },
};

const pillarImages = ["careers.team", "careers.responsibility", "careers.growth", "careers.field"];

/** Projects without an approved photograph use their registered concept image (DEMO, src/data/demo-content.ts). */
const workConcept: Partial<Record<string, string>> = { "drochia": "project.drochia.road" };

/** Production careers state (OWNER "PRODUCTION V1", 2026-11-09 §3): no vacancies published, no film, no culture claims. */
const productionCopy = {
  label: { ro: "Cariere", ru: "Вакансии", en: "Careers" },
  title: { ro: "Momentan nu avem posturi vacante.", ru: "Открытых вакансий сейчас нет.", en: "There are no open positions right now." },
  contact: { ro: "Întrebări despre lucrul la MEGAPARC — prin e-mail sau telefon.", ru: "Вопросы о работе в MEGAPARC — по e‑mail или телефону.", en: "Questions about working at MEGAPARC — by e-mail or telephone." },
};

function CareersProductionPage({ locale }: { locale: SiteLocale }) {
  return (
    <PageShell locale={locale} experience>
      <section className="xp-sec xp-careers-state" id="positions">
        <div className="xp-shell xp-careers-state__grid">
          <div>
            <p className="pm-kicker" data-reveal>{productionCopy.label[locale]}</p>
            <h1 className="xp-careers-state__title" data-reveal>{productionCopy.title[locale]}</h1>
          </div>
          <div data-reveal>
            <DirectContact locale={locale} subject="careers" title={null} note={productionCopy.contact[locale]} />
          </div>
        </div>
      </section>
    </PageShell>
  );
}

export function CareersPage({ locale }: { locale: SiteLocale }) {
  if (isProductionEdition) return <CareersProductionPage locale={locale} />;
  const c = copy[locale];
  const p = (path: string) => localePath(locale, path);
  const work = listProjects().map((project) => ({ key: project.slug, name: project.name, href: p(`/projects/${project.slug}`), media: project.media, concept: workConcept[project.slug] }));
  const vacancies = listVacancies();

  return (
    <PageShell locale={locale} variant="overlay" experience>
      {/* HERO — cinematic film, one statement, one action (concept footage, labelled) */}
      <CareersMoment locale={locale} variant="hero" href="#positions" />

      {/* VACANCIES — real, Rabota.md */}
      <section className="xp-sec" id="positions">
        <div className="xp-shell">
          <Opening no="01" label={c.positionsLabel} title={c.positionsTitle(vacancies.length)} className="xp-opening--split">
            <div className="xp-vacancies__top">
              <p>{employerBrand.positions.sourceNote[locale]}</p>
              <Button href={employerBrand.positions.allRolesUrl} icon="up-right" external>{c.viewAll}</Button>
            </div>
          </Opening>
          {vacancies.length ? null : (
            <div className="xp-split__copy" data-reveal>
              <h3 className="xp-split__title">{employerBrand.positions.emptyTitle[locale]}</h3>
              <p>{employerBrand.positions.emptyText[locale]}</p>
            </div>
          )}
          <ul className="xp-vacancies" data-reveal>
            {vacancies.map((vacancy) => (
              <li key={vacancy.slug} id={vacancy.slug}>
                <a href={vacancy.externalUrl} target="_blank" rel="noopener noreferrer">
                  <h3>{vacancy.title[locale]}</h3>
                  <span className="xp-vacancies__meta">{departmentLabel[vacancy.department][locale]} · {vacancy.location[locale]}{vacancy.publishedAt ? ` · ${formatDate(vacancy.publishedAt, locale)}` : ""}</span>
                  <p>{vacancy.summary[locale]}</p>
                  {vacancy.full ? <p className="xp-vacancies__full">{vacancy.full[locale]}</p> : null}
                  <span className="xp-vacancies__cta">{c.view}<Icon name="up-right" size={16} /></span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* WHAT YOU WILL WORK ON — real assets and projects */}
      <section className="xp-sec xp-sec--warm" id="work">
        <div className="xp-shell">
          <p className="xp-statement xp-culture" data-reveal>{cultureStatement.value[locale]}<DemoMark /></p>
          <Opening no="02" label={c.workLabel} title={c.workTitle} lead={employerBrand.lead[locale]} className="xp-opening--split" />
          <ul className="xp-index" data-reveal>
            {work.map((item) => (
              <li key={item.key}>
                <Link href={item.href}>
                  <figure className="xp-fig">
                    {item.media ? <ArtImage media={item.media} alt="" sizes="6rem" /> : item.concept ? <ConceptImage id={item.concept} locale={locale} sizes="6rem" /> : <span className="xp-index__mono" aria-hidden="true">{item.name.split(" ").map((w) => w[0]).join("")}</span>}
                  </figure>
                  <strong>{item.name}</strong>
                  <span>{c.workLines[item.key]}</span>
                  <Icon name="arrow" size={18} />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* FOUR PILLARS — walking rhythm */}
      <section className="xp-sec" id="how">
        <div className="xp-shell">
          <p className="xp-eyebrow xp-eyebrow--gap" data-reveal><span className="xp-eyebrow__no">03</span><span>{c.pillarsLabel}</span></p>
          <div className="xp-rhythm">
            {c.pillars.map(([title, text], i) => (
              <article key={title} className={`xp-split${i % 2 ? " xp-split--flip" : ""}`}>
                <figure className="xp-fig" style={{ "--ratio": i % 2 ? "4 / 5" : "3 / 2" } as CSSProperties} data-reveal>
                  <ConceptImage id={pillarImages[i]} locale={locale} sizes="(min-width: 1024px) 50vw, 100vw" depth={10} />
                </figure>
                <div className="xp-split__copy" data-reveal>
                  <span className="xp-trio__no">0{i + 1}</span>
                  <h2 className="xp-split__title">{title}</h2>
                  <p>{text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ROLE STORIES — DEMO */}
      <section className="xp-sec xp-sec--stone" id="roles">
        <div className="xp-shell">
          <Opening no="04" label={c.storiesLabel} title={c.storiesTitle} lead={c.storiesNote} className="xp-opening--split" />
          <div className="xp-roles" data-reveal>
            {roleStories.map((story) => (
              <article key={story.key}>
                <small>{story.where[locale]}</small>
                <h3>{story.title.value[locale]}<DemoMark /></h3>
                <p>{story.text[locale]}</p>
                <p><b>{c.owns}:</b> {story.owns[locale]}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* APPLY */}
      <section className="xp-sec xp-sec--warm" id="apply">
        <div className="xp-shell xp-close">
          <div data-reveal>
            <p className="xp-eyebrow"><span className="xp-eyebrow__no">05</span><span>{c.applyLabel}</span></p>
            <h2 className="xp-close__title">{c.applyTitle}</h2>
          </div>
          <div className="xp-split__copy" data-reveal>
            <p className="xp-lead">{c.applyText}</p>
            <p className="xp-muted"><a href={contactLinks.email}>{company.email.value[locale]}</a></p>
            <Button href={`${p("/contact")}?subject=careers#careers`}>{c.applyCta}</Button>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
