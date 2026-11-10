import Link from "next/link";
import { MaskTitle } from "@/components/experience";
import { PageShell } from "@/components/page-shell";
import { ArtImage } from "@/components/primitives";
import { Figure, NB, R3Label, R3Link, projectState } from "@/components/r3";
import { Icon } from "@/components/ui";
import { getProject } from "@/content/source";
import { developmentPortfolio } from "@/lib/portfolio";
import { assetProfiles, portfolioFigures } from "@/data/demo-content";
import { businessStatement, directions, geography, operations, principles } from "@/lib/business";
import { localePath, publicAsset, type SiteLocale } from "@/lib/site-data";

/**
 * ABOUT — SITEWIDE R3 §13 (OWNER 2026-11-09): who we are today · what we own · how we work · what we invest in.
 * It does not repeat History (where the business came from lives on /history; About hands over in one line).
 * MEGAPARC invests in, develops and leases its own real estate — never a third-party asset manager.
 * No team or leadership section.
 */
const copy = {
  ro: {
    label: "Despre noi",
    title: ["Investiții.", "Dezvoltare.", "Închiriere."],
    lead: "Compania a fost fondată în 2005 și lucrează doar cu obiectele sale — de la achiziție la închiriere și întreținere.",
    ownLabel: "Ce deținem",
    ownTitle: "Clădiri și terenuri proprii.",
    operating: "obiecte în funcțiune",
    area: "suprafața obiectelor în funcțiune",
    land: "terenuri",
    projects: "proiecte de dezvoltare",
    howLabel: "Cum lucrăm",
    howTitle: "Patru reguli de proprietar.",
    teamLine: "Fiecare clădire are în spate echipa proprie: directorul tehnic, arhitectul, închirierea și exploatarea.",
    opsAlt: "Moscova 20 · parterul pregătit pentru chiriaș",
    opsLink: "Suport tehnic pentru chiriaș",
    investLabel: "În ce investim",
    investTitle: "Trei direcții, un singur proprietar.",
    links: { investment: "Investiții și parteneriat", development: "Proiectele de dezvoltare", leasing: "Spații disponibile" },
    fromLabel: "De unde venim",
    fromLine: "MEGAPARC a fost fondată în 2005. Istoria grupului începe în 1991.",
    fromCta: "Citiți istoria",
    routesLabel: "Mai departe",
    routes: [["Proiectele", "/projects"], ["Spații disponibile", "/leasing#available"], ["Investiții și parteneriat", "/partnership"], ["Cariere", "/careers"]],
  },
  ru: {
    label: "О компании",
    title: ["Инвестиции.", "Девелопмент.", "Аренда."],
    lead: `Компания основана в${NB}2005${NB}году и${NB}работает только со${NB}своими объектами${NB}— от${NB}покупки до${NB}аренды и${NB}обслуживания.`,
    ownLabel: "Чем владеем",
    ownTitle: `Собственные здания и${NB}земля.`,
    operating: "действующих объекта",
    area: "площадь действующих объектов",
    land: "земли",
    projects: "проекта развития",
    howLabel: "Как мы работаем",
    howTitle: "Четыре правила собственника.",
    teamLine: `За${NB}каждым зданием${NB}— своя команда: технический директор, архитектор, аренда и${NB}эксплуатация.`,
    opsAlt: `Moscova 20 · первый этаж, подготовленный для арендатора`,
    opsLink: "Техническая поддержка арендатора",
    investLabel: "Во что инвестируем",
    investTitle: `Три направления, один собственник.`,
    links: { investment: `Инвестиции и${NB}партнёрство`, development: "Проекты развития", leasing: "Свободные помещения" },
    fromLabel: "Откуда мы",
    fromLine: `MEGAPARC основана в${NB}2005${NB}году. История группы начинается в${NB}1991-м.`,
    fromCta: "Читать историю",
    routesLabel: "Дальше",
    routes: [["Проекты", "/projects"], ["Свободные помещения", "/leasing#available"], [`Инвестиции и${NB}партнёрство`, "/partnership"], ["Вакансии", "/careers"]],
  },
  en: {
    label: "About",
    title: ["Investment.", "Development.", "Leasing."],
    lead: "Founded in 2005, the company works only with its own properties — from purchase to leasing and upkeep.",
    ownLabel: "What we own",
    ownTitle: "Our own buildings and land.",
    operating: "operating properties",
    area: "operating property area",
    land: "of land",
    projects: "development projects",
    howLabel: "How we work",
    howTitle: "Four owner's rules.",
    teamLine: "Behind every building is our own team: the Technical Director, the Architect, leasing and operations.",
    opsAlt: "Moscova 20 · the ground floor prepared for a tenant",
    opsLink: "Technical support for tenants",
    investLabel: "What we invest in",
    investTitle: "Three directions, one owner.",
    links: { investment: "Investment and partnership", development: "Development projects", leasing: "Available spaces" },
    fromLabel: "Where we come from",
    fromLine: "MEGAPARC was founded in 2005. The group's history begins in 1991.",
    fromCta: "Read the history",
    routesLabel: "Next",
    routes: [["Projects", "/projects"], ["Available spaces", "/leasing#available"], ["Investment and partnership", "/partnership"], ["Careers", "/careers"]],
  },
} as const;

const directionHref = { investment: "/partnership", development: "/projects#development", leasing: "/leasing#available" } as const;
const owned = ["dacia-31", "moscova-9", "creanga-78", "moscova-20"] as const;

export function AboutPage({ locale }: { locale: SiteLocale }) {
  const c = copy[locale];
  const p = (path: string) => localePath(locale, path);
  const dacia = getProject("dacia-31")!;
  // R3.3 §5: projects under development / construction (VATRA · Vasile Lupu 48/3)
  const developmentCount = developmentPortfolio().length;
  const linkTo = (value: string) => {
    const [path, hash] = value.split("#");
    return `${p(path)}${hash ? `#${hash}` : ""}`;
  };

  return (
    <PageShell locale={locale} mainClassName="r3-page r3-about r4-page r4-about">
      {/* WHO WE ARE TODAY — the three directions at monumental scale, the company in one sentence */}
      <section className="r3-sec r3-sec--ivory r3-opening">
        <div className="r3-shell">
          <R3Label>{c.label}</R3Label>
          <MaskTitle as="h1" className="r3-opening__title" lines={[...c.title]} />
          <div className="r3-opening__base" data-reveal>
            <p className="r3-statement">{businessStatement[locale]}</p>
            <p className="r3-lead">{c.lead}</p>
          </div>
        </div>
      </section>
      <figure className="r3-band" data-reveal>
        <ArtImage media={dacia.media!} variant="wide" alt={`${dacia.name} — ${dacia.format[locale]}`} sizes="100vw" position="50% 55%" />
        <figcaption className="r3-shell r3-band__caption">{dacia.name} · {dacia.city[locale]}</figcaption>
      </figure>

      {/* WHAT WE OWN — figures and the buildings themselves */}
      <section className="r3-sec r3-sec--ivory r3-own" id="own">
        <div className="r3-shell">
          <div className="r3-head r3-head--split" data-reveal>
            <R3Label>{c.ownLabel}</R3Label>
            <h2 className="r3-title">{c.ownTitle}</h2>
            <dl className="r3-evidence__figs">
              <div><dt>{c.area}</dt><dd><Figure value={portfolioFigures.area.value[locale]} /></dd></div>
              <div><dt>{c.land}</dt><dd><Figure value={portfolioFigures.land.value[locale]} /></dd></div>
              <div><dt>{c.projects}</dt><dd>{String(developmentCount).padStart(2, "0")}</dd></div>
            </dl>
          </div>
          <ol className="r3-ledger" data-reveal>
            {owned.map((slug) => {
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
          </ol>
          <p className="r3-own__count">{portfolioFigures.operating.value[locale]} {c.operating} · <Link href={`${p("/projects")}#development`}>{c.links.development}</Link></p>
        </div>
      </section>

      {/* HOW WE WORK — four owner's rules as statements; our own team behind the buildings */}
      <section className="r3-sec r3-sec--paper r3-rules" id="principles">
        <div className="r3-shell">
          <div className="r3-head" data-reveal>
            <R3Label>{c.howLabel}</R3Label>
            <h2 className="r3-title">{c.howTitle}</h2>
          </div>
          <ol className="r3-rules__list">
            {principles.map((rule) => (
              <li key={rule.title.en} data-reveal>
                <h3>{rule.title[locale]}</h3>
                <p>{rule.text[locale]}</p>
              </li>
            ))}
          </ol>
          <div className="r3-rules__ops" data-reveal>
            {/* a real OWNER photograph: the prepared ground floor of Moscova 20 — how an owned building is kept */}
            <figure className="r3-rules__media">
              <picture>
                <source media="(min-width: 721px)" srcSet={publicAsset("/assets/leasing/moscova-20/m20-ground-hall.webp")} />
                <img src={publicAsset("/assets/leasing/moscova-20/m20-ground-hall-sm.webp")} alt={c.opsAlt} loading="lazy" decoding="async" />
              </picture>
              <figcaption>{c.opsAlt}</figcaption>
            </figure>
            <div className="r3-rules__opscopy">
              <p className="r3-statement">{operations.title[locale]}</p>
              <p className="r3-lead">{operations.text[locale]}</p>
              <p className="r3-lead">{c.teamLine}</p>
              <R3Link href={`${p("/leasing")}#technical-support`}>{c.opsLink}</R3Link>
            </div>
          </div>
        </div>
      </section>

      {/* WHAT WE INVEST IN — three directions, each a route */}
      <section className="r3-sec r3-sec--ink r3-dirs" id="directions">
        <div className="r3-shell">
          <div className="r3-head r3-head--light r3-head--split" data-reveal>
            <R3Label tone="light">{c.investLabel}</R3Label>
            <h2 className="r3-title">{c.investTitle}</h2>
            <p className="r3-lead">{geography.text[locale]}</p>
          </div>
          <ol className="r3-dirs__list">
            {directions.map((direction) => (
              <li key={direction.key} data-reveal>
                <Link href={linkTo(directionHref[direction.key])}>
                  <span className="r3-dirs__title">{direction.title[locale]}</span>
                  <span className="r3-dirs__statement">{direction.statement[locale]}</span>
                  <span className="r3-dirs__text">{direction.text[locale]}</span>
                  <span className="r3-dirs__more">{c.links[direction.key]}<Icon size={16} /></span>
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* WHERE WE COME FROM — one line, then History has the story */}
      <section className="r3-sec r3-sec--ivory r3-from" id="history">
        <div className="r3-shell r3-from__grid" data-reveal>
          <p className="r3-from__years" aria-hidden="true"><span>1991</span><span>2005</span></p>
          <div>
            <R3Label>{c.fromLabel}</R3Label>
            <p className="r3-statement">{c.fromLine}</p>
            <div className="r3-actions"><R3Link href={p("/history")} large>{c.fromCta}</R3Link></div>
          </div>
        </div>
      </section>

      {/* NEXT */}
      <section className="r3-sec r3-sec--stone r3-routes">
        <div className="r3-shell">
          <R3Label>{c.routesLabel}</R3Label>
          <nav className="r3-routes__list" aria-label={c.routesLabel}>
            {c.routes.map(([label, value]) => (
              <Link key={value} href={linkTo(value)}>
                <span>{label}</span>
                <Icon size={22} />
              </Link>
            ))}
          </nav>
        </div>
      </section>
    </PageShell>
  );
}
