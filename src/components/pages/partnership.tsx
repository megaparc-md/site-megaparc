import Link from "next/link";
import { ConceptDisclosure, ConceptImage, MaskTitle } from "@/components/experience";
import { investConsidered, investInputs, investQuestions } from "@/components/invest-qa";
import { PageShell } from "@/components/page-shell";
import { ArtImage } from "@/components/primitives";
import { Figure, NB, R3Button, R3Label, R3Link, projectState, r3Href } from "@/components/r3";
import { Icon } from "@/components/ui";
import { getProject, listProjects } from "@/content/source";
import { assetProfiles, company, contactLinks, daciaDevelopment, drochiaProfile, portfolioFigures, publicLand } from "@/data/demo-content";
import { acquisitionTypes, geography, holdOrSell, lifecycle, operations, reinvestment } from "@/lib/business";
import { localePath, type SiteLocale } from "@/lib/site-data";

/**
 * INVESTMENT — SITEWIDE R3 §3 + §4 (OWNER 2026-11-09). Investment is as important as Leasing: MEGAPARC deploys
 * capital into real assets and stays responsible for the result. Audience: owners of property and land,
 * investors, banks, institutional and development partners.
 * Hero → ACQUIRE · DEVELOP · OPERATE · REINVEST as four large scenes on real MEGAPARC assets → what MEGAPARC
 * considers → what the owner / partner brings → what MEGAPARC brings → evidence (the owned portfolio) → submit.
 * One strong question per scene; no process cards, no returns, no investment metrics, no finance illustrations.
 * Language rule (OWNER 2026-10-08): no impression of a regulated or public investment product.
 */
const copy = {
  ro: {
    label: "Investiții și parteneriat",
    title: ["Investiții", "în active reale."],
    lead: "MEGAPARC investește capital în imobile și terenuri — și rămâne responsabilă de rezultat: de la achiziție la clădirea care funcționează.",
    audience: "Pentru proprietari de imobile și terenuri, investitori, bănci și parteneri de dezvoltare.",
    discuss: "Discutăm o oportunitate",
    offer: "Propuneți un obiect sau un teren",
    acquire: "Achiziționăm",
    acquireTitle: "Imobile existente și terenuri.",
    develop: "Dezvoltăm",
    developTitle: "Construcție, reconstrucție, repoziționare.",
    operate: "Exploatăm",
    reinvest: "Reinvestim",
    reinvestTitle: "Disciplina capitalului și oportunitățile următoare.",
    landLabel: "Terenuri pentru proiectele următoare",
    stage: "Etapă",
    programme: "3 clădiri",
    considerLabel: "Ce analizează MEGAPARC",
    bringsLabel: "Parteneriat",
    partnerBrings: "Ce aduce proprietarul sau partenerul",
    partnerExtra: "Investitori, bănci și parteneri financiari — participarea sau finanțarea unui proiect concret; condițiile se discută individual.",
    megaparcBrings: "Ce aduce MEGAPARC",
    brings: [
      "Evaluarea inițială din șase perspective: economie, drept, tehnică, dezvoltare, închiriere, exploatare.",
      "Capital și decizia proprietarului care rămâne cu obiectul.",
      "Dezvoltare: proiectare, construcție, reconstrucție.",
      "Directorul tehnic și arhitectul companiei.",
      "Închiriere și exploatare cu echipa proprie.",
    ],
    evidenceLabel: "Dovada",
    evidenceTitle: "Ce deținem astăzi.",
    operating: "obiecte în funcțiune",
    area: "suprafața obiectelor în funcțiune",
    land: "terenuri",
    dev: "proiecte de dezvoltare",
    submitLabel: "Pasul următor",
    submitTitle: "Aveți un obiect, un teren sau un proiect?",
    note: "MEGAPARC nu oferă produse de investiții publice. Fiecare parteneriat se discută separat, pentru un proiect concret.",
    coop: "Constructori și proiectanți — scrieți despre colaborare",
  },
  ru: {
    label: `Инвестиции и${NB}партнёрство`,
    title: ["Инвестиции", `в${NB}реальные объекты.`],
    lead: `MEGAPARC вкладывает капитал в${NB}недвижимость и${NB}землю${NB}— и${NB}отвечает за${NB}результат: от${NB}покупки до${NB}работающего здания.`,
    audience: `Для собственников недвижимости и${NB}земли, инвесторов, банков и${NB}партнёров по${NB}девелопменту.`,
    discuss: "Обсудить возможность",
    offer: `Предложить объект или${NB}землю`,
    acquire: "Приобретаем",
    acquireTitle: `Существующие здания и${NB}земля.`,
    develop: "Развиваем",
    developTitle: `Строительство, реконструкция, новая функция.`,
    operate: "Эксплуатируем",
    reinvest: "Реинвестируем",
    reinvestTitle: `Дисциплина капитала и${NB}следующие возможности.`,
    landLabel: `Земля под следующие проекты`,
    stage: "Стадия",
    programme: "3 здания",
    considerLabel: "Что рассматривает MEGAPARC",
    bringsLabel: "Партнёрство",
    partnerBrings: `Что приносит собственник или${NB}партнёр`,
    partnerExtra: `Инвесторы, банки и${NB}финансовые партнёры${NB}— участие или финансирование конкретного проекта; условия обсуждаются индивидуально.`,
    megaparcBrings: "Что приносит MEGAPARC",
    brings: [
      `Первичную оценку с${NB}шести сторон: экономика, право, техника, девелопмент, аренда, эксплуатация.`,
      `Капитал и${NB}решение собственника, который остаётся с${NB}объектом.`,
      `Девелопмент: проектирование, строительство, реконструкция.`,
      `Технического директора и${NB}архитектора компании.`,
      `Аренду и${NB}эксплуатацию собственной командой.`,
    ],
    evidenceLabel: "Подтверждение",
    evidenceTitle: `Чем мы владеем сегодня.`,
    operating: "действующих объекта",
    area: "площадь действующих объектов",
    land: "земли",
    dev: "проекта развития",
    submitLabel: "Следующий шаг",
    submitTitle: `Есть объект, участок или${NB}проект?`,
    note: `MEGAPARC не${NB}предлагает публичных инвестиционных продуктов. Каждое партнёрство обсуждается отдельно, по${NB}конкретному проекту.`,
    coop: `Подрядчики и${NB}проектировщики${NB}— написать о${NB}сотрудничестве`,
  },
  en: {
    label: "Investment and partnership",
    title: ["Investment", "in real assets."],
    lead: "MEGAPARC puts capital into real estate and land — and stays responsible for the result: from the purchase to a working building.",
    audience: "For owners of property and land, investors, banks and development partners.",
    discuss: "Discuss an opportunity",
    offer: "Offer a property or land",
    acquire: "Acquire",
    acquireTitle: "Existing buildings and land.",
    develop: "Develop",
    developTitle: "Construction, redevelopment, repositioning.",
    operate: "Operate",
    reinvest: "Reinvest",
    reinvestTitle: "Capital discipline and the next opportunities.",
    landLabel: "Land for the next projects",
    stage: "Stage",
    programme: "3 buildings",
    considerLabel: "What MEGAPARC considers",
    bringsLabel: "Partnership",
    partnerBrings: "What the owner or partner brings",
    partnerExtra: "Investors, banks and financial partners — taking part in, or financing, a specific project; terms are discussed individually.",
    megaparcBrings: "What MEGAPARC brings",
    brings: [
      "An initial assessment from six sides: economics, legal, technical, development, leasing, operations.",
      "Capital, and the decision of an owner who stays with the property.",
      "Development: design, construction, redevelopment.",
      "The company's Technical Director and Architect.",
      "Leasing and operations by our own team.",
    ],
    evidenceLabel: "Evidence",
    evidenceTitle: "What we own today.",
    operating: "operating properties",
    area: "operating property area",
    land: "of land",
    dev: "development projects",
    submitLabel: "Next step",
    submitTitle: "Do you have a property, a site or a project?",
    note: "MEGAPARC does not offer public investment products. Every partnership is discussed separately, around a specific project.",
    coop: "Contractors and designers — write about cooperation",
  },
} as const;

const stage = (key: string) => lifecycle.find((item) => item.key === key)!;
const operatingOrder = ["dacia-31", "moscova-9", "creanga-78", "moscova-20"] as const;

export function PartnershipPage({ locale }: { locale: SiteLocale }) {
  const c = copy[locale];
  const q = investQuestions;
  const p = (path: string) => localePath(locale, path);
  const m9 = getProject("moscova-9")!;
  const vatra = getProject("vatra")!;
  const dacia = getProject("dacia-31")!;
  const daciaDev = getProject("dacia-31-development")!;
  const drochia = getProject("drochia-gateway")!;
  const development = listProjects().filter((project) => project.kind === "development");
  const discussHref = r3Href(locale, "/contact?subject=partnership#partnership");

  return (
    <PageShell locale={locale} variant="overlay" experience mainClassName="r3-page r3-invest">
      {/* HERO — capital at work (OWNER-approved illustration, disclosed) */}
      <section className="r3-hero r3-hero--invest" data-xp-hero>
        <div className="r3-hero__media" aria-hidden="true">
          <ConceptImage id="partnership.hero" locale={locale} priority sizes="100vw" />
        </div>
        <div className="r3-hero__veil" aria-hidden="true" />
        <ConceptDisclosure id="partnership.hero" locale={locale} />
        <div className="r3-shell r3-hero__inner">
          <R3Label tone="light">{c.label}</R3Label>
          <MaskTitle as="h1" className="r3-display r3-hero__title" lines={[...c.title]} />
          <div className="r3-hero__base">
            <p className="r3-hero__lead">{c.lead}</p>
            <div className="r3-actions">
              <R3Button href={discussHref} tone="light">{c.discuss}</R3Button>
              <R3Link href={p("/offer")} tone="light">{c.offer}</R3Link>
            </div>
          </div>
          <p className="r3-hero__aside">{c.audience}</p>
        </div>
      </section>

      {/* ACQUIRE — existing property and land */}
      <section className="r3-sec r3-sec--ivory r3-chapter r3-chapter--acquire" id="acquire">
        <div className="r3-shell r3-chapter__verbrow" data-reveal><h2 className="r3-verb">{c.acquire}</h2></div>
        <div className="r3-chapter__split">
          <Link href={p(`/projects/${m9.slug}`)} className="r3-chapter__media" tabIndex={-1} aria-hidden="true" data-reveal>
            <ArtImage media={m9.media!} variant="portrait" alt="" sizes="(min-width: 1024px) 58vw, 100vw" position="50% 55%" />
          </Link>
          <div className="r3-chapter__copy" data-reveal>
            <p className="r3-statement">{c.acquireTitle}</p>
            <p className="r3-lead">{stage("acquire").text[locale]}</p>
          </div>
        </div>
        <ol className="r3-shell r3-types" data-reveal>
          {acquisitionTypes.map((type) => (
            <li key={type.key}>
              <h3>{type.title[locale]}</h3>
              <p>{type.text[locale]}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* DEVELOP — construction, redevelopment, repositioning */}
      <section className="r3-sec r3-sec--paper r3-chapter r3-chapter--develop" id="develop">
        <div className="r3-shell r3-chapter__head" data-reveal>
          <h2 className="r3-verb">{c.develop}</h2>
          <p className="r3-statement">{c.developTitle}</p>
        </div>
        <Link href={p(`/projects/${vatra.slug}`)} className="r3-wide" data-reveal>
          <figure className="r3-wide__media">
            <ArtImage media={vatra.media!} variant="wide" alt={`${vatra.name} — ${vatra.format[locale]}`} sizes="100vw" position="50% 60%" />
          </figure>
          <span className="r3-wide__caption">{vatra.name} · {vatra.card.status[locale]}</span>
        </Link>
        <div className="r3-shell r3-proofs" data-reveal>
          <p className="r3-lead">{stage("develop").text[locale]}</p>
          <ul>
            {development.map((project) => (
              <li key={project.slug}>
                <Link href={p(`/projects/${project.slug}`)}>
                  <span className="r3-proofs__name">{project.name}</span>
                  <span className="r3-proofs__meta">
                    {project.slug === daciaDev.slug ? `${c.programme} × ${daciaDevelopment.each.value[locale]} · ${daciaDevelopment.total.value[locale]}` : projectState(project, locale).text}
                  </span>
                </Link>
              </li>
            ))}
            <li>
              <Link href={p(`/projects/${drochia.slug}`)}>
                <span className="r3-proofs__name">{drochia.name}</span>
                <span className="r3-proofs__meta">{drochiaProfile.site.value[locale]} · {drochiaProfile.status.value[locale]}</span>
              </Link>
            </li>
          </ul>
        </div>
      </section>

      {/* OPERATE — our own assets, run by our own team */}
      <section className="r3-sec r3-sec--ivory r3-chapter r3-chapter--operate" id="operate">
        <div className="r3-shell r3-chapter__verbrow" data-reveal><h2 className="r3-verb">{c.operate}</h2></div>
        <div className="r3-chapter__split r3-chapter__split--flip">
          <Link href={p(`/projects/${dacia.slug}`)} className="r3-chapter__media" tabIndex={-1} aria-hidden="true" data-reveal>
            <ArtImage media={dacia.media!} alt="" sizes="(min-width: 1024px) 58vw, 100vw" position="50% 56%" />
          </Link>
          <div className="r3-chapter__copy" data-reveal>
            <p className="r3-statement">{operations.title[locale]}</p>
            <p className="r3-lead">{operations.text[locale]}</p>
            <ul className="r3-ticks">
              {operations.points.map((point) => (
                <li key={point.en}>{point[locale]}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* REINVEST — capital discipline and the next opportunities */}
      <section className="r3-sec r3-sec--ink r3-chapter r3-chapter--reinvest" id="reinvest">
        <div className="r3-shell r3-reinvest">
          <h2 className="r3-verb r3-reinvest__verb" data-reveal>{c.reinvest}</h2>
          <p className="r3-statement" data-reveal>{c.reinvestTitle}</p>
          <div className="r3-reinvest__text" data-reveal>
            <p className="r3-lead">{reinvestment[locale]} {holdOrSell[locale]}</p>
            <p className="r3-lead">{geography.text[locale]}</p>
          </div>
          <div className="r3-reinvest__land" data-reveal>
            <p className="r3-label r3-label--light">{c.landLabel}</p>
            <p className="r3-reinvest__total"><Figure value={portfolioFigures.land.value[locale]} /></p>
            <ul>
              {publicLand.map((plot) => (
                <li key={plot.slug}>
                  {plot.project ? <Link href={p(`/projects/${plot.project}`)}>{plot.name[locale]}</Link> : <span>{plot.name[locale]}</span>}
                  <span>{plot.point.value[locale]}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* WHAT MEGAPARC CONSIDERS — one question */}
      <section className="r3-sec r3-sec--ivory r3-question" id="consider">
        <div className="r3-shell">
          <div className="r3-question__head" data-reveal>
            <R3Label>{c.considerLabel}</R3Label>
            <h2 className="r3-title">{q.consider[locale]}</h2>
            <p className="r3-lead">{q.considerLine[locale]}</p>
          </div>
          <ul className="r3-biglist" data-reveal>
            {investConsidered.map((item) => (
              <li key={item.en}>{item[locale]}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* WHAT EACH SIDE BRINGS — owner / partner · MEGAPARC */}
      <section className="r3-sec r3-sec--paper r3-brings" id="partnership">
        <div className="r3-shell">
          <R3Label>{c.bringsLabel}</R3Label>
          <div className="r3-brings__grid">
            <div className="r3-brings__col" data-reveal>
              <h2 className="r3-brings__title">{c.partnerBrings}</h2>
              <p className="r3-lead">{q.inputsNote[locale]}</p>
              <ul className="r3-brings__list">
                {investInputs.map((item) => (
                  <li key={item.en}>{item[locale]}</li>
                ))}
              </ul>
              <p className="r3-note r3-brings__extra">{c.partnerExtra}</p>
            </div>
            <div className="r3-brings__col r3-brings__col--mp" data-reveal>
              <h2 className="r3-brings__title">{c.megaparcBrings}</h2>
              <p className="r3-lead">{q.assessLine[locale]}</p>
              <ol className="r3-brings__list r3-brings__list--mp">
                {c.brings.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* EVIDENCE — the owned portfolio, the sum that proves it */}
      <section className="r3-sec r3-sec--ivory r3-evidence" id="evidence">
        <div className="r3-shell">
          <div className="r3-head r3-head--split" data-reveal>
            <R3Label>{c.evidenceLabel}</R3Label>
            <h2 className="r3-title">{c.evidenceTitle}</h2>
            <dl className="r3-evidence__figs">
              <div><dt>{c.operating}</dt><dd>{portfolioFigures.operating.value[locale]}</dd></div>
              <div><dt>{c.land}</dt><dd><Figure value={portfolioFigures.land.value[locale]} /></dd></div>
              <div><dt>{c.dev}</dt><dd>{String(listProjects().filter((project) => project.kind !== "operating").length).padStart(2, "0")}</dd></div>
            </dl>
          </div>
          <ol className="r3-ledger" data-reveal>
            {operatingOrder.map((slug) => {
              const project = getProject(slug)!;
              const state = projectState(project, locale);
              return (
                <li key={slug}>
                  <Link href={p(`/projects/${slug}`)}>
                    <span className="r3-ledger__name">{project.name}</span>
                    <span className="r3-ledger__meta">{project.format[locale]} · <span className={`is-${state.tone}`}>{state.text}</span></span>
                    <span className="r3-ledger__area"><Figure value={assetProfiles[slug].area.value[locale]} /></span>
                  </Link>
                </li>
              );
            })}
            <li className="r3-ledger__sum">
              <span className="r3-ledger__name">{c.area}</span>
              <span className="r3-ledger__area"><Figure value={portfolioFigures.area.value[locale]} /></span>
            </li>
          </ol>
        </div>
      </section>

      {/* SUBMIT — the opportunity */}
      <section className="r3-sec r3-sec--stone r3-next r3-submit" id="next">
        <div className="r3-shell">
          <R3Label>{c.submitLabel}</R3Label>
          <h2 className="r3-title r3-submit__title">{c.submitTitle}</h2>
          <div className="r3-next__grid">
            <Link className="r3-next__action" href={p("/offer")} data-reveal>
              <span className="r3-next__title">{c.offer}</span>
              <span className="r3-next__note">{q.nextLine[locale]}</span>
              <Icon size={28} />
            </Link>
            <Link className="r3-next__action" href={discussHref} data-reveal>
              <span className="r3-next__title">{c.discuss}</span>
              <span className="r3-next__note">{c.partnerExtra}</span>
              <Icon size={28} />
            </Link>
          </div>
          <ul className="r3-next__contacts">
            <li><a href={contactLinks.email}>{company.email.value[locale]}</a></li>
            <li><a href={contactLinks.mobile}>{company.mobile.value[locale]}</a></li>
            <li><a href={contactLinks.landline}>{company.landline.value[locale]}</a></li>
            <li><Link href={r3Href(locale, "/contact#question")}>{c.coop}</Link></li>
          </ul>
          <p className="r3-note r3-submit__note">{c.note}</p>
        </div>
      </section>
    </PageShell>
  );
}
