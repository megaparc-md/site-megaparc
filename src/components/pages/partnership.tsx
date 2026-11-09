import Link from "next/link";
import { InvestQA } from "@/components/invest-qa";
import type { CSSProperties } from "react";
import { DirectionsLine } from "@/components/business-stage";
import { ConceptDisclosure, ConceptImage, Ledger, MaskTitle } from "@/components/experience";
import { PageShell } from "@/components/page-shell";
import { ProjectFacts, ProjectStatus, storyLine } from "@/components/project-facts";
import { ArtImage } from "@/components/primitives";
import { SiteMap } from "@/components/site-map";
import { Button, Icon } from "@/components/ui";
import { getProject, kindLabel, listLand, listProjects, publicSpaces } from "@/content/source";
import { caseStudy, caseStudyPublished, daciaDevelopment, drochiaProfile, occupancyOf, portfolioFigures, vatraProfile } from "@/data/demo-content";
import { developmentStages } from "@/lib/business";
import { localePath, type SiteLocale } from "@/lib/site-data";

/**
 * INVESTMENT PARTNERSHIP — the proof page for investors, banks and capital
 * partners. Approved copy (OWNER trust copy patch 2026-10-09) and sequence are
 * unchanged; OWNER "PREMIUM PHASE 2" (2026-10-09) rebuilt the reading:
 * hero on a development scene of real scale (concept, DEMO) → real assets as
 * one major building and three supporting ones, photography first → the
 * Moscova 9 case as an investment story in three chapters (the eight governed
 * stages on one progression line) → how value is created → current
 * development → what we consider and the six disciplines of the check, set as
 * typography → how a project is reviewed → discuss an opportunity.
 * Language rule: no regulated or public investment product — "investment
 * partnership", "opportunity", "discuss"; no returns, prices or promises.
 */
const N = " ";
const copy = {
  ro: {
    label: "Parteneriat",
    title: ["Parteneriat", "investițional."],
    lead: "Pentru investitori, bănci și parteneri interesați de proiecte în imobiliare comerciale: achiziția, dezvoltarea și închirierea obiectelor proprii MEGAPARC.",
    cta: "Discutăm o oportunitate",
    projects: "Proiectele",
    assetsLabel: "Imobile proprii",
    assetsTitle: "Activele MEGAPARC în funcțiune.",
    record: { years: "ani de experiență a grupului", founded: "este fondată MEGAPARC", operating: "obiecte în funcțiune", development: "proiecte de dezvoltare", area: "suprafața obiectelor în funcțiune" },
    open: "Vezi obiectul",
    caseLabel: "Studiu de caz",
    caseTitle: "Moscova 9 · logica creării valorii.",
    caseLead: "De la punctul de plecare la strategia ulterioară.",
    caseOpen: "Vezi Moscova 9",
    caseSpace: "Spațiul disponibil",
    chapters: ["Obiectul și oportunitatea", "Decizia și lucrările", "Astăzi și mai departe"],
    highlights: { area: "suprafața obiectului", occupied: "ocupat" },
    mapLabel: "Hartă: Moscova 9 pe bulevardul Moscova",
    valueLabel: "Cum se creează valoarea",
    valueTitle: "Trei direcții de creare a valorii.",
    devLabel: "Dezvoltare",
    landPlots: "Terenuri",
    devTitle: "Proiectele de dezvoltare în curs.",
    devLead: "Fiecare proiect trece prin aceleași șase etape; mai jos — unde se află astăzi.",
    stage: "Etapă",
    site: "Teren",
    completion: "Finalizare",
    status: "Statut",
    lookLabel: "Ce analizăm și cum evaluăm",
    lookTitle: "Criterii de selecție și verificare investițională.",
    lookTypes: "Ce analizăm",
    lookChecks: "Cum evaluăm",
    checks: [
      ["Economie", "Cererea, viitorii chiriași, costurile și termenele — calculate înainte de decizie."],
      ["Juridic", "Drepturile asupra terenului și clădirii, restricțiile, documentația de autorizare."],
      ["Tehnic", "Structura, instalațiile, puterile și starea clădirii."],
      ["Dezvoltare", "Ce poate deveni obiectul: funcție, suprafață, etape și costul lucrărilor."],
      ["Închiriere", "Cine va închiria, ce formate cere zona, cât de repede se va ocupa obiectul."],
      ["Exploatare", "Cum va funcționa clădirea ani la rând: întreținere, costuri, calitate."],
    ],
    talkLabel: "Parteneriat și finanțare",
    talkTitle: "Etapele analizei unui proiect.",
    note: "MEGAPARC nu oferă produse de investiții publice. Fiecare parteneriat se discută separat, pentru un proiect concret.",
    partners: [
      ["Investitori", "Participare la un proiect concret MEGAPARC; condițiile se discută individual.", "/contact?subject=partnership#partnership"],
      ["Bănci și parteneri financiari", "Finanțarea achiziției și dezvoltării obiectelor proprii.", "/contact?subject=partnership#partnership"],
      ["Proprietari de imobile și terenuri", "Vânzare sau dezvoltare comună a imobilului.", "/offer"],
    ],
    coop: { title: "Constructori și proiectanți", text: "Lucru pe șantierele noastre: proiectare, construcție, inginerie.", cta: "Scrieți despre colaborare", to: "/contact#question" },
    closeLabel: "Contact",
    closeTitle: "Discutăm o oportunitate.",
    routes: [["Discutați o oportunitate", "/contact?subject=partnership#partnership"], ["Propuneți un obiect sau un teren", "/offer"], ["Proiectele", "/projects"], ["Istoricul grupului", "/history"]],
  },
  ru: {
    label: "Партнёрство",
    title: ["Инвестиционное", "партнёрство."],
    lead: `Для инвесторов, банков и${N}партнёров, которым интересны проекты в${N}коммерческой недвижимости: приобретение, девелопмент и${N}аренда собственных объектов MEGAPARC.`,
    cta: "Обсудить возможность",
    projects: "Проекты",
    assetsLabel: "Собственная недвижимость",
    assetsTitle: "Действующие активы MEGAPARC.",
    record: { years: "лет опыта группы", founded: "основана MEGAPARC", operating: "действующих объекта", development: "проекта развития", area: "площадь действующих объектов" },
    open: "Открыть объект",
    caseLabel: "Кейс",
    caseTitle: `Moscova${N}9${N}· логика создания стоимости.`,
    caseLead: `От исходной точки до${N}дальнейшей стратегии.`,
    caseOpen: "Открыть Moscova 9",
    caseSpace: "Свободное помещение",
    chapters: [`Объект и${N}возможность`, `Решение и${N}работы`, `Сегодня и${N}дальше`],
    highlights: { area: "площадь объекта", occupied: "занято" },
    mapLabel: "Карта: Moscova 9 на бульваре Москова",
    valueLabel: "Как создаётся стоимость",
    valueTitle: "Три направления создания стоимости.",
    devLabel: "Развитие",
    landPlots: "Земельные участки",
    devTitle: "Текущие проекты развития.",
    devLead: `Каждый проект проходит одни и${N}те${N}же шесть стадий; ниже — где они сейчас.`,
    stage: "Стадия",
    site: "Участок",
    completion: "Завершение",
    status: "Статус",
    lookLabel: `Что рассматриваем и${N}как оцениваем`,
    lookTitle: `Критерии отбора и${N}инвестиционная проверка.`,
    lookTypes: "Что рассматриваем",
    lookChecks: "Как оцениваем",
    checks: [
      ["Экономика", `Спрос, будущие арендаторы, затраты и${N}сроки считаем до${N}решения.`],
      ["Право", `Права на${N}землю и${N}здание, ограничения, разрешительная документация.`],
      ["Техника", `Конструкции, инженерные системы, мощности и${N}состояние здания.`],
      ["Девелопмент", `Чем может стать объект: функция, площадь, этапы и${N}стоимость работ.`],
      ["Аренда", `Кто будет арендовать, какие форматы нужны району, как быстро заполнится объект.`],
      ["Эксплуатация", `Как здание будет работать годами: обслуживание, расходы, качество.`],
    ],
    talkLabel: "Партнёрство и финансирование",
    talkTitle: "Порядок рассмотрения проекта.",
    note: `MEGAPARC не${N}предлагает публичных инвестиционных продуктов. Каждое партнёрство обсуждается отдельно, по${N}конкретному проекту.`,
    partners: [
      ["Инвесторы", `Участие в${N}конкретном проекте MEGAPARC; условия обсуждаются индивидуально.`, "/contact?subject=partnership#partnership"],
      [`Банки и${N}финансовые партнёры`, `Финансирование приобретения и${N}девелопмента собственных объектов.`, "/contact?subject=partnership#partnership"],
      [`Собственники недвижимости и${N}земли`, `Продажа или совместное развитие недвижимости.`, "/offer"],
    ],
    coop: { title: `Подрядчики и${N}проектировщики`, text: `Работа на${N}наших площадках: проектирование, строительство, инженерия.`, cta: `Написать о${N}сотрудничестве`, to: "/contact#question" },
    closeLabel: "Контакты",
    closeTitle: "Обсудим возможность.",
    routes: [["Обсудить возможность", "/contact?subject=partnership#partnership"], [`Предложить объект или${N}землю`, "/offer"], ["Проекты", "/projects"], ["История группы", "/history"]],
  },
  en: {
    label: "Partnership",
    title: ["Investment", "partnership."],
    lead: "For investors, banks and partners interested in commercial real estate projects: the acquisition, development and leasing of MEGAPARC's own properties.",
    cta: "Discuss an opportunity",
    projects: "Projects",
    assetsLabel: "Our own real estate",
    assetsTitle: "MEGAPARC's operating assets.",
    record: { years: "years of the group's experience", founded: "MEGAPARC founded", operating: "operating properties", development: "development projects", area: "operating property area" },
    open: "View the property",
    caseLabel: "Case study",
    caseTitle: "Moscova 9 · the logic of value creation.",
    caseLead: "From the starting point to the further strategy.",
    caseOpen: "View Moscova 9",
    caseSpace: "The available space",
    chapters: ["The building and the opportunity", "The decision and the works", "Today and next"],
    highlights: { area: "property area", occupied: "occupied" },
    mapLabel: "Map: Moscova 9 on Moscova Boulevard",
    valueLabel: "How value is created",
    valueTitle: "Three directions of value creation.",
    devLabel: "Development",
    landPlots: "Land plots",
    devTitle: "Current development projects.",
    devLead: "Every project goes through the same six stages; below — where each stands today.",
    stage: "Stage",
    site: "Site",
    completion: "Completion",
    status: "Status",
    lookLabel: "What we consider and how we evaluate",
    lookTitle: "Selection criteria and investment due diligence.",
    lookTypes: "What we consider",
    lookChecks: "How we evaluate",
    checks: [
      ["Economics", "Demand, future tenants, costs and timing — worked out before the decision."],
      ["Legal", "Title to land and building, restrictions, permits."],
      ["Technical", "Structure, building services, power and condition."],
      ["Development", "What the property can become: use, area, phases and cost of works."],
      ["Leasing", "Who will lease, which formats the area needs, how fast the property fills."],
      ["Operations", "How the building will run for years: upkeep, costs, quality."],
    ],
    talkLabel: "Partnership and financing",
    talkTitle: "How a project is reviewed.",
    note: "MEGAPARC does not offer public investment products. Every partnership is discussed separately, around a specific project.",
    partners: [
      ["Investors", "Taking part in a specific MEGAPARC project; terms are discussed individually.", "/contact?subject=partnership#partnership"],
      ["Banks and financial partners", "Financing the acquisition and development of our own properties.", "/contact?subject=partnership#partnership"],
      ["Owners of real estate and land", "Sale or joint development of real estate.", "/offer"],
    ],
    coop: { title: "Contractors and designers", text: "Work on our sites: design, construction, engineering.", cta: "Write about cooperation", to: "/contact#question" },
    closeLabel: "Contact",
    closeTitle: "Let's discuss an opportunity.",
    routes: [["Discuss an opportunity", "/contact?subject=partnership#partnership"], ["Offer a property or land", "/offer"], ["Projects", "/projects"], ["The group's history", "/history"]],
  },
} as const;

const groupYears = Math.floor((2026 - 1991) / 5) * 5;
/** The eight governed case stages, read as three chapters (keys from caseStudy). */
const chapterKeys = [["start", "opportunity"], ["decision", "capex", "reposition"], ["leasing", "status", "strategy"]] as const;
const roman = ["I", "II", "III"];
/** Major asset + three supporting ones (photography first). */
const majorSlug = "dacia-31";
const minorSlugs = ["moscova-9", "moscova-20", "creanga-78"];

export function PartnershipPage({ locale }: { locale: SiteLocale }) {
  const c = copy[locale];
  const p = (path: string) => localePath(locale, path);
  const href = (value: string) => {
    const [pathQuery, hash] = value.split("#");
    const [path, query] = pathQuery.split("?");
    return `${p(path)}${query ? `?${query}` : ""}${hash ? `#${hash}` : ""}`;
  };
  const projects = listProjects();
  const development = projects.filter((project) => project.kind === "development");
  const vatra = getProject("vatra")!;
  const drochia = getProject("drochia-gateway")!;
  const daciaDev = getProject("dacia-31-development")!;
  const major = getProject(majorSlug)!;
  const minors = minorSlugs.map((slug) => getProject(slug)!);
  const caseProject = getProject(caseStudy.slug)!;
  const caseSpace = publicSpaces.find((space) => space.project === caseStudy.slug);
  const caseOccupancy = occupancyOf("moscova-9");
  const stageByKey = (key: string) => caseStudy.stages.find((stage) => stage.key === key)!;
  const stageNo = (key: string) => caseStudy.stages.findIndex((stage) => stage.key === key) + 1;
  const stageOf = (slug: string) => getProject(slug)!.development!.stage;
  const discuss = href("/contact?subject=partnership#partnership");

  return (
    <PageShell locale={locale} variant="overlay" experience>
      {/* HERO — a development of real scale (concept, DEMO), the approved statement, one action */}
      <section className="pm-hero pt2-hero" data-xp-hero>
        <div className="pm-hero__media" aria-hidden="true">
          <ConceptImage id="partnership.hero" locale={locale} priority sizes="100vw" />
        </div>
        <div className="pm-hero__veil" aria-hidden="true" />
        <ConceptDisclosure id="partnership.hero" locale={locale} />
        <div className="xp-shell pm-hero__inner">
          <p className="pm-kicker pm-kicker--light">MEGAPARC · {c.label}</p>
          <MaskTitle as="h1" className="pm-hero__title pt2-hero__title" lines={[...c.title]} />
          <div className="pm-hero__base pt2-hero__base">
            <p className="pm-hero__statement">{c.lead}</p>
            <div className="pm-actions">
              <Button href={discuss} variant="light">{c.cta}</Button>
              <Link className="pm-link pm-link--light" href={p("/projects")}>{c.projects}<Icon /></Link>
            </div>
          </div>
        </div>
      </section>

      {/* REAL ASSETS — one major building, three supporting; photography first, confirmed facts second */}
      <section className="pm-sec pm-sec--paper pt2-assets" id="assets">
        <div className="xp-shell">
          <div className="pm-head pm-head--split" data-reveal>
            <p className="pm-kicker">{c.assetsLabel}</p>
            <h2 className="pm-h2">{c.assetsTitle}</h2>
            <dl className="pt2-record">
              <div><dt>{c.record.years}</dt><dd>{groupYears}+</dd></div>
              <div><dt>{c.record.founded}</dt><dd>2005</dd></div>
              <div><dt>{c.record.operating}</dt><dd>{portfolioFigures.operating.value[locale]}</dd></div>
              <div><dt>{c.record.development}</dt><dd>{String(development.length).padStart(2, "0")}</dd></div>
              <div className="pt2-record__wide"><dt>{c.record.area}</dt><dd>{portfolioFigures.area.value[locale]}</dd></div>
            </dl>
          </div>
          <article className="pt2-major" data-reveal>
            <Link href={p(`/projects/${major.slug}`)} className="pt2-major__media al-reveal" tabIndex={-1} aria-hidden="true">
              <ArtImage media={major.media!} variant="card" alt="" sizes="(min-width: 1024px) 64vw, 100vw" />
            </Link>
            <div className="pt2-major__copy">
              <h3 className="pt2-major__name"><Link href={p(`/projects/${major.slug}`)}>{major.name}</Link></h3>
              <ProjectFacts project={major} locale={locale} />
              <p className="pt2-major__line">{storyLine[major.slug][locale]}</p>
              <ProjectStatus project={major} locale={locale} />
              <Link className="pm-more" href={p(`/projects/${major.slug}`)}>{c.open}<Icon /></Link>
            </div>
          </article>
          <ul className="pt2-minor">
            {minors.map((project) => (
              <li key={project.slug} data-reveal>
                <Link href={p(`/projects/${project.slug}`)} className="pt2-minor__media al-hover" tabIndex={-1} aria-hidden="true">
                  <ArtImage media={project.media!} variant="portrait" alt="" sizes="(min-width: 1024px) 30vw, 100vw" />
                </Link>
                <h3 className="pt2-minor__name"><Link href={p(`/projects/${project.slug}`)}>{project.name}</Link></h3>
                <ProjectFacts project={project} locale={locale} />
                <ProjectStatus project={project} locale={locale} />
                <Link className="pm-more" href={p(`/projects/${project.slug}`)}>{c.open}<Icon /></Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* CASE — Moscova 9 as an investment story: the building, one progression line, three chapters.
          Production edition: the case is DEMO — omitted entirely (OWNER "PRODUCTION V1" §3). */}
      {caseStudyPublished() ? (
      <section className="pt2-case" id="case">
        <div className="xp-shell pm-head pm-head--split" data-reveal>
          <p className="pm-kicker">{c.caseLabel}</p>
          <h2 className="pm-h2">{c.caseTitle}</h2>
          <p className="pm-head__lead">{c.caseLead}</p>
        </div>
        <figure className="pt2-case__hero al-reveal" data-reveal>
          <ArtImage media={caseProject.media!} variant="wide" alt={`${caseProject.name} — ${caseProject.format[locale]}`} sizes="100vw" />
        </figure>
        <div className="xp-shell">
          <ol className="pt2-rail" aria-label={c.caseTitle} data-reveal>
            {chapterKeys.map((keys, chapter) => (
              <li key={chapter} className="pt2-rail__group">
                <span className="pt2-rail__ch">{roman[chapter]}</span>
                <ol>
                  {keys.map((key) => (
                    <li key={key} className={key === "status" ? "is-current" : undefined}>
                      <span>{String(stageNo(key)).padStart(2, "0")}</span>
                      {stageByKey(key).label[locale]}
                    </li>
                  ))}
                </ol>
              </li>
            ))}
          </ol>
          <div className="pt2-chapters">
            {/* I — the building and the opportunity: the boulevard on the map, the confirmed area */}
            <article className="pt2-ch pt2-ch--one" data-reveal>
              <header className="pt2-ch__head">
                <span className="pt2-ch__no">{roman[0]}</span>
                <h3 className="pt2-ch__title">{c.chapters[0]}</h3>
              </header>
              <figure className="pt2-ch__media pt2-ch__media--map">
                <SiteMap slug="moscova-9" name={caseProject.name} label={c.mapLabel} />
              </figure>
              <div className="pt2-ch__body">
                <p className="pt2-ch__figure">{caseProject.card.size[locale]}<span>{c.highlights.area}</span></p>
                {chapterKeys[0].map((key) => (
                  <div key={key} className="pt2-ch__stage">
                    <h4>{stageByKey(key).label[locale]}</h4>
                    <p>{stageByKey(key).text.value[locale]}</p>
                  </div>
                ))}
              </div>
            </article>
            {/* II — the decision and the works: the building itself */}
            <article className="pt2-ch pt2-ch--two" data-reveal>
              <header className="pt2-ch__head">
                <span className="pt2-ch__no">{roman[1]}</span>
                <h3 className="pt2-ch__title">{c.chapters[1]}</h3>
              </header>
              <figure className="pt2-ch__media al-reveal">
                <ArtImage media={caseProject.media!} variant="portrait" alt="" sizes="(min-width: 1024px) 34vw, 100vw" />
              </figure>
              <div className="pt2-ch__body">
                {chapterKeys[1].map((key) => (
                  <div key={key} className="pt2-ch__stage">
                    <h4>{stageByKey(key).label[locale]}</h4>
                    <p>{stageByKey(key).text.value[locale]}</p>
                  </div>
                ))}
              </div>
            </article>
            {/* III — today and next: the confirmed occupancy */}
            <article className="pt2-ch pt2-ch--three" data-reveal>
              <header className="pt2-ch__head">
                <span className="pt2-ch__no">{roman[2]}</span>
                <h3 className="pt2-ch__title">{c.chapters[2]}</h3>
              </header>
              <div className="pt2-ch__body">
                {caseOccupancy.fullyLet ? <p className="pt2-ch__figure pt2-ch__figure--lg">100{N}%<span>{c.highlights.occupied}</span></p> : null}
                {chapterKeys[2].map((key) => (
                  <div key={key} className="pt2-ch__stage">
                    <h4>{stageByKey(key).label[locale]}</h4>
                    <p>{stageByKey(key).text.value[locale]}</p>
                  </div>
                ))}
                <div className="pm-actions">
                  <Link className="pm-link" href={p(`/projects/${caseProject.slug}`)}>{c.caseOpen}<Icon /></Link>
                  {caseSpace ? <Link className="pm-link pm-link--quiet" href={p(`/leasing/${caseSpace.id}`)}>{c.caseSpace}<Icon /></Link> : null}
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>
      ) : null}

      {/* HOW VALUE IS CREATED */}
      <section className="pm-sec pm-sec--warm">
        <div className="xp-shell">
          <div className="pm-head" data-reveal>
            <p className="pm-kicker">{c.valueLabel}</p>
            <h2 className="pm-h2">{c.valueTitle}</h2>
          </div>
          <DirectionsLine locale={locale} />
        </div>
      </section>

      {/* CURRENT DEVELOPMENT — dark signature, with the six stages */}
      <section className="pm-sec pm-sec--ink pt2-dev">
        <div className="xp-shell">
          <div className="pm-head pm-head--split pm-head--dark" data-reveal>
            <p className="pm-kicker">{c.devLabel}</p>
            <h2 className="pm-h2">{c.devTitle}</h2>
            <p className="pm-head__lead">{c.devLead}</p>
          </div>
          <ol className="xp-process xp-process--stages pt-stages" style={{ "--n": developmentStages.length } as CSSProperties} data-reveal>
            {developmentStages.map((stage, index) => {
              const here = [vatra, drochia].filter((project) => stageOf(project.slug) === index);
              const current = here.length > 0;
              return (
                <li key={stage.no} className={current ? "is-current" : index < stageOf("vatra") ? "is-done" : undefined}>
                  <h3>{stage.title[locale]}</h3>
                  <p>{stage.text[locale]}</p>
                  {here.map((project) => (
                    <span key={project.slug} className="xp-scene__tag">{project.name}</span>
                  ))}
                </li>
              );
            })}
          </ol>
          <div className="pt-pipeline">
            <Link href={p(`/projects/${vatra.slug}`)} className="pt-pipe al-reveal" data-reveal>
              <figure className="xp-fig" style={{ "--ratio": "16 / 10" } as CSSProperties}>
                <ArtImage media={vatra.media!} variant="card" alt={`${vatra.name} — ${vatra.format[locale]}`} sizes="(min-width: 1024px) 50vw, 100vw" />
              </figure>
              <span className="pt-pipe__name">{vatra.name}</span>
              <Ledger locale={locale} tone="dark" className="xp-ledger--pair" items={[
                { label: c.stage, point: vatraProfile.stage },
                { label: c.site, point: vatraProfile.site },
                { label: c.completion, point: vatraProfile.completion },
              ]} />
            </Link>
            <Link href={p(`/projects/${drochia.slug}`)} className="pt-pipe pt2-pipe--map al-reveal" data-reveal>
              <figure className="pt2-pipe__map">
                <SiteMap slug="drochia-gateway" name={drochia.name} label={drochia.name} />
              </figure>
              <span className="pt-pipe__name">{drochia.name}</span>
              <Ledger locale={locale} tone="dark" className="xp-ledger--pair" items={[
                { label: c.site, point: drochiaProfile.site },
                { label: c.status, point: drochiaProfile.status },
              ]} />
            </Link>
          </div>
          {/* Also in the portfolio (OWNER 2026-10-09): Dacia 31 · Development (programme only, no stage published) and the land plots */}
          <div className="pt-more" data-reveal>
            <Link href={p(`/projects/${daciaDev.slug}`)} className="pt-more__item">
              <span className="pt-more__kind">{kindLabel.development[locale]}</span>
              <span className="pt-more__name">{daciaDev.name}</span>
              <span className="pt-more__value">{daciaDevelopment.buildings.value[locale]} × {daciaDevelopment.each.value[locale]} · {daciaDevelopment.total.value[locale]}</span>
            </Link>
            <div className="pt-more__item">
              <span className="pt-more__kind">{kindLabel.land[locale]}</span>
              <span className="pt-more__name">{c.landPlots}</span>
              <span className="pt-more__value">{listLand().map((plot) => `${plot.name[locale]} · ${plot.point.value[locale].split(" · ")[0]}`).join(" — ")}</span>
            </div>
          </div>
        </div>
      </section>

      {/* THE PARTNER'S QUESTIONS — what MEGAPARC considers, useful information, the initial assessment, what a partnership
          can involve, what happens next (OWNER overnight release §13: no invented process, no DEMO case) */}
      <InvestQA locale={locale} checks={c.checks} partners={c.partners} coop={c.coop} legal={c.note} />

      {/* DISCUSS AN OPPORTUNITY — calm close */}
      <section className="pm-close">
        <div className="xp-shell pm-close__grid">
          <div data-reveal>
            <p className="pm-kicker">{c.closeLabel}</p>
            <h2 className="pm-close__title">{c.closeTitle}</h2>
          </div>
          <nav className="pm-close__routes" aria-label={c.closeLabel} data-reveal>
            {c.routes.map(([label, to]) => (
              <Link key={label} href={href(to)}>
                <span>{label}</span>
                <Icon name="arrow" size={18} />
              </Link>
            ))}
          </nav>
        </div>
      </section>
    </PageShell>
  );
}
