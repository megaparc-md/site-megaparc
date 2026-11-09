import Link from "next/link";
import { BusinessStage } from "@/components/business-stage";
import { MaskTitle } from "@/components/experience";
import { PageShell } from "@/components/page-shell";
import { ArtImage } from "@/components/primitives";
import { Button, Icon } from "@/components/ui";
import { getProject, listProjects } from "@/content/source";
import { portfolioFigures } from "@/data/demo-content";
import { businessStatement, directionLines, geography, operations, principles } from "@/lib/business";
import { eras, teaserImage } from "@/lib/history";
import { brand, localePath, publicAsset, type SiteLocale } from "@/lib/site-data";

/**
 * ABOUT — who we are · what we own · how we think · where we come from ·
 * where we are going (OWNER brief "PREMIUM REAL ESTATE EXPERIENCE REBUILD",
 * 2026-10-09). The business model is unchanged (OWNER correction 2026-10-08):
 * MEGAPARC invests in, develops and leases its own real estate; it is not a
 * third-party asset manager. No team or leadership section. The company
 * history has its own page (/history); About hands over to it.
 */
const N = " ";
const copy = {
  ro: {
    label: "Despre companie",
    lead: "Compania a fost fondată în 2005 și lucrează doar cu obiectele proprii — de la cumpărare la închiriere și întreținere.",
    heritage: [["1991", "Originile afacerii fondatorilor"], ["1995", "Structura de investiții a grupului"], ["2005", "Este fondată MEGAPARC"], ["2020", "Imobiliarele — activitatea principală"]],
    whoLabel: "Cine suntem",
    stageMore: "Proiectele MEGAPARC",
    ownLabel: "Ce deținem",
    ownTitle: "Clădiri și terenuri proprii.",
    figOperating: "obiecte în funcțiune",
    figArea: "suprafața obiectelor în funcțiune",
    figDevelopment: "proiecte de dezvoltare",
    figLand: "terenuri",
    ownLink: "Toate proiectele",
    opsLink: "Spații libere",
    thinkLabel: "Cum gândim",
    thinkTitle: "Patru reguli de proprietar.",
    fromLabel: "De unde venim",
    fromTitle: "O cronică ce începe în 1991.",
    fromText: "Comerț, producție, logistică, finanțe, agrobusiness și proiecte internaționale — înainte ca imobiliarele să devină activitatea principală.",
    fromCta: "Citiți cronica",
    goingLabel: "Încotro mergem",
    goingTitle: "Mai departe — proiecte proprii și obiecte noi.",
    goingText: "VATRA este un proiect propriu în realizare. La Dacia 31 planificăm trei clădiri de ≈ 1.600 m². Drochia Gateway este un teren propriu de 2,0 ha la intrarea în oraș, cu concept în evaluare.",
    goingOffer: "Propuneți un obiect sau un teren",
    goingDev: "Proiectele de dezvoltare",
    closeLabel: "Mai departe",
    closeTitle: "Ce vă interesează?",
    routes: [["Proiectele noastre", "/projects"], ["Spații libere", "/leasing#available"], ["Parteneriat investițional", "/partnership"], ["Propuneți un obiect sau un teren", "/offer"], ["Vezi posturile", "/careers#positions"]],
  },
  ru: {
    label: "О компании",
    lead: `Компания основана в${N}2005 году и${N}работает только со своими объектами${N}— от${N}покупки до${N}аренды и${N}обслуживания.`,
    heritage: [["1991", "Истоки бизнеса основателей"], ["1995", "Инвестиционная структура группы"], ["2005", "Основана MEGAPARC"], ["2020", `Недвижимость${N}— главное дело`]],
    whoLabel: "Кто мы",
    stageMore: "Проекты MEGAPARC",
    ownLabel: "Чем владеем",
    ownTitle: `Собственные здания и${N}земля.`,
    figOperating: "действующих объекта",
    figArea: "площадь действующих объектов",
    figDevelopment: "проекта развития",
    figLand: "земли",
    ownLink: "Все проекты",
    opsLink: "Свободные помещения",
    thinkLabel: "Как мы думаем",
    thinkTitle: "Четыре правила собственника.",
    fromLabel: "Откуда мы",
    fromTitle: `Хроника, которая начинается в${N}1991${N}году.`,
    fromText: `Розница, производство, логистика, финансы, агробизнес и${N}международные проекты${N}— до${N}того, как недвижимость стала главным делом.`,
    fromCta: "Читать хронику",
    goingLabel: "Куда идём",
    goingTitle: `Дальше${N}— собственные проекты и${N}новые объекты.`,
    goingText: `VATRA уже в${N}работе. На${N}Dacia${N}31 планируем три здания по${N}≈${N}1${N}600${N}м². Drochia Gateway${N}— наш участок 2,0${N}га на${N}въезде в${N}город; концепцию сейчас оцениваем.`,
    goingOffer: `Предложить объект или${N}землю`,
    goingDev: "Проекты развития",
    closeLabel: "Дальше",
    closeTitle: "Что вас интересует?",
    routes: [["Наши проекты", "/projects"], ["Свободные помещения", "/leasing#available"], ["Инвестиционное партнёрство", "/partnership"], [`Предложить объект или${N}землю`, "/offer"], ["Смотреть вакансии", "/careers#positions"]],
  },
  en: {
    label: "About",
    lead: "Founded in 2005, the company works only with its own properties — from purchase to leasing and upkeep.",
    heritage: [["1991", "The founders' business origins"], ["1995", "The group's investment structure"], ["2005", "MEGAPARC is founded"], ["2020", "Real estate — the core business"]],
    whoLabel: "Who we are",
    stageMore: "MEGAPARC projects",
    ownLabel: "What we own",
    ownTitle: "Our own buildings and land.",
    figOperating: "operating properties",
    figArea: "operating property area",
    figDevelopment: "development projects",
    figLand: "of land",
    ownLink: "All projects",
    opsLink: "Available spaces",
    thinkLabel: "How we think",
    thinkTitle: "Four owner's rules.",
    fromLabel: "Where we come from",
    fromTitle: "A chronicle that begins in 1991.",
    fromText: "Retail, manufacturing, logistics, finance, agribusiness and international projects — before real estate became the core business.",
    fromCta: "Read the chronicle",
    goingLabel: "Where we are going",
    goingTitle: "Next: our own projects and new properties.",
    goingText: "VATRA is our own project in delivery. At Dacia 31 we are planning three buildings of ≈ 1,600 m². Drochia Gateway is our own 2.0 ha site at the town entrance, with a concept under evaluation.",
    goingOffer: "Offer a property or land",
    goingDev: "Development projects",
    closeLabel: "Next",
    closeTitle: "What are you interested in?",
    routes: [["Our projects", "/projects"], ["Available spaces", "/leasing#available"], ["Investment partnership", "/partnership"], ["Offer a property or land", "/offer"], ["See vacancies", "/careers#positions"]],
  },
} as const;

export function AboutPage({ locale }: { locale: SiteLocale }) {
  const c = copy[locale];
  const p = (path: string) => localePath(locale, path);
  const moscova9 = getProject("moscova-9")!;
  const moscova20 = getProject("moscova-20")!;
  const vatra = getProject("vatra")!;
  const ribbon = eras.filter((era) => era.range);
  const developmentCount = listProjects().filter((project) => project.kind === "development").length;

  return (
    <PageShell locale={locale} experience>
      {/* WHO WE ARE — three directions in one statement */}
      <section className="ab2-hero">
        <div className="xp-shell ab2-hero__grid">
          <p className="pm-kicker" data-reveal>{c.label}</p>
          <MaskTitle as="h1" className="ab2-hero__title" lines={[...directionLines[locale]]} />
          <p className="ab2-hero__lead" data-reveal>{businessStatement[locale]} {c.lead}</p>
          <dl className="ab2-heritage" data-reveal>
            {c.heritage.map(([year, text]) => (
              <div key={year} className={year === "2005" ? "is-megaparc" : undefined}>
                <dt>{year}</dt>
                <dd>{text}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* the three directions — pinned three-scene stage on desktop (OWNER signature moment) */}
      <section className="ab2-stage" id="directions">
        <BusinessStage locale={locale} label={<><span className="xp-eyebrow__no">{brand.name}</span><span>{c.whoLabel}</span></>} more={{ href: p("/projects"), text: c.stageMore }} />
      </section>

      {/* WHAT WE OWN — real buildings, confirmed figures, owner operations */}
      <section className="ab2-own" id="own">
        <div className="xp-shell pm-head pm-head--split" data-reveal>
          <p className="pm-kicker">{c.ownLabel}</p>
          <h2 className="pm-h2">{c.ownTitle}</h2>
          <dl className="ab2-figs">
            <div><dt>{c.figOperating}</dt><dd>{portfolioFigures.operating.value[locale]}</dd></div>
            <div><dt>{c.figArea}</dt><dd>{portfolioFigures.area.value[locale]}</dd></div>
            <div><dt>{c.figDevelopment}</dt><dd>{String(developmentCount).padStart(2, "0")}</dd></div>
            <div><dt>{c.figLand}</dt><dd>{portfolioFigures.land.value[locale]}</dd></div>
          </dl>
        </div>
        <Link href={p(`/projects/${moscova9.slug}`)} className="ab2-own__media al-reveal" tabIndex={-1} aria-hidden="true" data-reveal>
          <ArtImage media={moscova9.media!} variant="wide" alt="" sizes="100vw" />
        </Link>
        <div className="xp-shell ab2-ops">
          <figure className="ab2-ops__media" data-reveal>
            <ArtImage media={moscova20.media!} variant="portrait" alt={`${moscova20.name} — ${moscova20.format[locale]}`} sizes="(min-width: 1024px) 34vw, 100vw" />
          </figure>
          <div className="ab2-ops__copy" data-reveal>
            <p className="pm-kicker">{operations.label[locale]}</p>
            <h3 className="ab2-ops__title">{operations.title[locale]}</h3>
            <p className="ab2-ops__text">{operations.text[locale]}</p>
            <ul className="ab2-ops__points">
              {operations.points.map((point) => (
                <li key={point.en}>{point[locale]}</li>
              ))}
            </ul>
            <div className="pm-actions">
              <Link className="pm-link" href={p("/projects")}>{c.ownLink}<Icon /></Link>
              <Link className="pm-link pm-link--quiet" href={`${p("/leasing")}#available`}>{c.opsLink}<Icon /></Link>
            </div>
          </div>
        </div>
      </section>

      {/* HOW WE THINK — four owner's rules, as statements */}
      <section className="pm-sec pm-sec--warm" id="principles">
        <div className="xp-shell">
          <div className="pm-head" data-reveal>
            <p className="pm-kicker">{c.thinkLabel}</p>
            <h2 className="pm-h2">{c.thinkTitle}</h2>
          </div>
          <ul className="ab2-rules">
            {principles.map((item) => (
              <li key={item.title.en} data-reveal>
                <h3>{item.title[locale]}</h3>
                <p>{item.text[locale]}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* WHERE WE COME FROM — hand over to the chronicle */}
      <section className="hs-teaser hs-teaser--about pm-history">
        <div className="xp-shell hs-teaser__grid">
          <div className="hs-teaser__copy" data-reveal>
            <p className="pm-kicker">{c.fromLabel}</p>
            <h2 className="hs-teaser__title">{c.fromTitle}</h2>
            <p className="hs-teaser__lead">{c.fromText}</p>
            <ol className="hs-teaser__ribbon hs-teaser__ribbon--all" aria-label={c.fromLabel}>
              {ribbon.map((era) => (
                <li key={era.key} className={era.scope === "megaparc" ? "is-megaparc" : undefined}>
                  <span>{era.range}</span>
                  <small>{era.label[locale]}</small>
                </li>
              ))}
            </ol>
            <Link className="pm-link" href={p("/history")}>{c.fromCta}<Icon /></Link>
          </div>
          {/* production edition: the period photograph is a placeholder for the group archive — not published */}
          {teaserImage.about ? (
            <figure className="hs-teaser__figure" data-reveal>
              <picture>
                <source media="(min-width: 721px)" srcSet={publicAsset(`/assets/history/${teaserImage.about}.webp`)} />
                <img src={publicAsset(`/assets/history/${teaserImage.about}-mobile.webp`)} alt="" loading="lazy" decoding="async" />
              </picture>
            </figure>
          ) : null}
        </div>
      </section>

      {/* WHERE WE ARE GOING — development, land, new properties */}
      <section className="pm-sec pm-sec--ink" id="going">
        <div className="xp-shell ab2-going">
          <div className="ab2-going__copy" data-reveal>
            <p className="pm-kicker">{c.goingLabel}</p>
            <h2 className="pm-h2">{c.goingTitle}</h2>
            <p className="pm-head__lead">{c.goingText}</p>
            <p className="pm-head__lead">{geography.text[locale]}</p>
            <div className="pm-actions">
              <Button href={p("/offer")} variant="light">{c.goingOffer}</Button>
              <Link className="pm-link pm-link--light" href={`${p("/projects")}#development`}>{c.goingDev}<Icon /></Link>
            </div>
          </div>
          <Link href={p(`/projects/${vatra.slug}`)} className="ab2-going__media al-reveal" data-reveal aria-label={vatra.name}>
            <ArtImage media={vatra.media!} variant="card" alt="" sizes="(min-width: 1024px) 40vw, 100vw" />
            <span className="ab2-going__name">{vatra.name}</span>
          </Link>
        </div>
      </section>

      {/* CLOSE — calm */}
      <section className="pm-close">
        <div className="xp-shell pm-close__grid">
          <div data-reveal>
            <p className="pm-kicker">{c.closeLabel}</p>
            <h2 className="pm-close__title">{c.closeTitle}</h2>
          </div>
          <nav className="pm-close__routes" aria-label={c.closeLabel} data-reveal>
            {c.routes.map(([label, path]) => {
              const [route, hash] = path.split("#");
              return (
                <Link key={path} href={`${p(route)}${hash ? `#${hash}` : ""}`}>
                  <span>{label}</span>
                  <Icon name="arrow" size={18} />
                </Link>
              );
            })}
          </nav>
        </div>
      </section>
    </PageShell>
  );
}
