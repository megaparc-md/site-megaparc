import Link from "next/link";
import { MaskTitle } from "@/components/experience";
import { PageShell } from "@/components/page-shell";
import { ArtImage } from "@/components/primitives";
import { storyLine } from "@/components/project-facts";
import { Figure, R3Label, projectState } from "@/components/r3";
import { SiteMap } from "@/components/site-map";
import { Icon } from "@/components/ui";
import { getProject, type ProjectEntry } from "@/content/source";
import { portfolioFigures } from "@/data/demo-content";
import { developmentPortfolio, itemHref, landPortfolio, portfolioCategories, portfolioCounts, waitlistHref, waitlistLabel } from "@/lib/portfolio";
import { localePath, type SiteLocale } from "@/lib/site-data";

/**
 * PROJECTS — R3.3 «STRICT OWNER CORRECTION» §5–§6 (2026-11-10). The portfolio in the three OWNER categories, readable at
 * once: A · LEASING (Moscova 20 · Creangă 78 · Moscova 9 · Dacia 31 — strong photographs large, weak ones small) ·
 * B · LAND FOR DEVELOPMENT (Hîncești · Drochia · Orhei · Chișinău · Florilor 32/2, the light map) · C · PROJECTS UNDER
 * DEVELOPMENT / CONSTRUCTION (VATRA · Vasile Lupu 48/3, the one dark chapter). Statuses derived; nothing invented.
 */
const copy = {
  ro: {
    label: "Proiecte", title: ["Imobiliarele", "MEGAPARC."],
    lead: "Portofoliul în trei părți: clădiri în închiriere, terenuri pentru dezvoltare și proiecte proprii în lucru.",
    open: "Vezi obiectul", openProject: "Vezi proiectul", ofLand: "teren", landTotal: "Suprafață confirmată",
    landNote: "Suprafața terenului din Chișinău se publică după confirmare.", mapLabel: "Hartă: amplasarea terenului Drochia Gateway",
    discuss: "Discutăm proiectul", count: { leasing: "clădiri", land: "terenuri", development: "proiecte" },
    closeKicker: "Pasul următor", routes: [["Spații disponibile", "/leasing#available"], ["Investiții și parteneriat", "/partnership"], ["Propuneți un obiect sau un teren", "/offer"], ["Despre MEGAPARC", "/about"]],
  },
  ru: {
    label: "Проекты", title: ["Недвижимость", "MEGAPARC."],
    lead: "Портфель из трёх частей: объекты в аренде, земля для развития и собственные проекты в работе.",
    open: "Смотреть объект", openProject: "Открыть проект", ofLand: "земли", landTotal: "Подтверждённая площадь",
    landNote: "Площадь участка в Кишинёве публикуем после подтверждения.", mapLabel: "Карта: расположение участка Drochia Gateway",
    discuss: "Обсудить проект", count: { leasing: "объекта", land: "участков", development: "проекта" },
    closeKicker: "Следующий шаг", routes: [["Свободные помещения", "/leasing#available"], ["Инвестиции и партнёрство", "/partnership"], ["Предложить объект или землю", "/offer"], ["О компании", "/about"]],
  },
  en: {
    label: "Projects", title: ["MEGAPARC", "real estate."],
    lead: "The portfolio in three parts: buildings for lease, land for development and our own projects in progress.",
    open: "View the property", openProject: "View the project", ofLand: "of land", landTotal: "Confirmed area",
    landNote: "The Chișinău plot area is published once confirmed.", mapLabel: "Map: where the Drochia Gateway site is",
    discuss: "Discuss the project", count: { leasing: "buildings", land: "plots", development: "projects" },
    closeKicker: "Next step", routes: [["Available spaces", "/leasing#available"], ["Investment and partnership", "/partnership"], ["Offer a property or land", "/offer"], ["About MEGAPARC", "/about"]],
  },
} as const;

function Caption({ project, locale, open }: { project: ProjectEntry; locale: SiteLocale; open: string }) {
  const state = projectState(project, locale);
  return (
    <>
      <span className="r3-pj__meta">{project.format[locale]} · {project.city[locale]}</span>
      <span className="r3-pj__line">{storyLine[project.slug]?.[locale] ?? project.line[locale]}</span>
      <span className={`r3-state is-${state.tone}`}>{state.text}</span>
      <span className="r3-more">{open}<Icon size={16} /></span>
    </>
  );
}

export function ProjectsPage({ locale }: { locale: SiteLocale }) {
  const c = copy[locale];
  const p = (path: string) => localePath(locale, path);
  const [leasingCat, landCat, devCat] = portfolioCategories;
  const counts = portfolioCounts();
  const m20 = getProject("moscova-20")!;
  const creanga = getProject("creanga-78")!;
  const m9 = getProject("moscova-9")!;
  const dacia = getProject("dacia-31")!;
  const vatra = getProject("vatra")!;
  const drochia = getProject("drochia-gateway");
  const development = developmentPortfolio();
  const linkTo = (value: string) => {
    const [path, hash] = value.split("#");
    return `${p(path)}${hash ? `#${hash}` : ""}`;
  };

  return (
    <PageShell locale={locale} mainClassName="r3-page r3-projects r33-projects">
      {/* OPENING — the title and the three categories, readable at once */}
      <section className="r3-sec r3-sec--ivory r3-opening r3-opening--projects">
        <div className="r3-shell">
          <R3Label>{c.label}</R3Label>
          <MaskTitle as="h1" className="r3-opening__title" lines={[...c.title]} />
          <p className="r3-lead r3-opening__lead" data-reveal>{c.lead}</p>
          <nav className="r3-split r33-split" aria-label={c.label} data-reveal>
            {portfolioCategories.map((category) => (
              <a key={category.key} href={`#${category.anchor}`}>
                <span className="r3-split__label">{category.label[locale]}</span>
                <span className="r3-split__count">{String(counts[category.key]).padStart(2, "0")}</span>
                <span className="r3-split__meta">{c.count[category.key]}</span>
              </a>
            ))}
          </nav>
        </div>
      </section>

      {/* A · LEASING — OWNER order; strong photographs large (Moscova 20 interior, Dacia 31), weak ones small (Creangă 78, Moscova 9) */}
      <section className="r3-sec r3-sec--ivory r3-sec--flush-top r3-pjs" id={leasingCat.anchor} aria-label={leasingCat.label[locale]}>
        <div className="r3-shell r3-head r3-head--split r3-pjs__head" data-reveal>
          <R3Label>{leasingCat.label[locale]}</R3Label>
          <h2 className="r3-title">{leasingCat.title[locale]}</h2>
          <p className="r3-lead">{leasingCat.lead[locale]}</p>
        </div>

        <div className="r3-shell r3-second r3-second--page">
          <Link href={p(`/projects/${m20.slug}`)} className="r3-second__media" data-reveal tabIndex={-1} aria-hidden="true">
            <ArtImage media={m20.media!} variant="card" alt="" sizes="(min-width: 900px) 58vw, 100vw" />
          </Link>
          <Link href={p(`/projects/${m20.slug}`)} className="r3-second__copy r3-pj" data-reveal>
            <span className="r3-second__name">{m20.name}</span>
            <Caption project={m20} locale={locale} open={c.open} />
          </Link>
        </div>

        <ol className="r3-shell r3-compact">
          {[creanga, m9].map((project) => (
            <li key={project.slug} data-reveal>
              <Link href={p(`/projects/${project.slug}`)} className="r3-compact__row r3-pj">
                <span className="r3-compact__media">
                  <ArtImage media={project.media!} variant="card" alt="" sizes="(min-width: 900px) 22vw, 40vw" />
                </span>
                <span className="r3-compact__name">{project.name}</span>
                <span className="r3-compact__copy"><Caption project={project} locale={locale} open={c.open} /></span>
              </Link>
              {project.slug === creanga.slug ? (
                <Link className="r33-waitlist" href={waitlistHref(locale, creanga.slug)}>{waitlistLabel[locale]}<Icon size={14} /></Link>
              ) : null}
            </li>
          ))}
        </ol>

        <Link href={p(`/projects/${dacia.slug}`)} className="r3-feature r33-feature" data-reveal>
          <figure className="r3-feature__media">
            <ArtImage media={dacia.media!} alt={`${dacia.name} — ${dacia.format[locale]}`} sizes="100vw" position="50% 58%" />
          </figure>
          <span className="r3-shell r3-feature__copy">
            <span className="r3-feature__name">{dacia.name}</span>
            <span className="r3-feature__line">{dacia.editorial?.headline[locale] ?? dacia.line[locale]}</span>
            <span className="r3-feature__meta"><Caption project={dacia} locale={locale} open={c.open} /></span>
          </span>
        </Link>
      </section>

      {/* B · LAND FOR DEVELOPMENT — never mixed with operating assets */}
      <section className="r3-sec r3-sec--paper r3-land" id={landCat.anchor}>
        <div className="r3-shell r3-land__grid">
          <div data-reveal>
            <R3Label>{landCat.label[locale]}</R3Label>
            <h2 className="r3-title">{landCat.title[locale]}</h2>
            <p className="r3-lead">{landCat.lead[locale]}</p>
            <ul className="r3-land__list r33-land__list">
              {landPortfolio.map((plot) => (
                <li key={plot.slug}>
                  {plot.page ? <Link href={p(`/projects/${plot.page}`)}>{plot.name[locale]}</Link> : <span>{plot.name[locale]}</span>}
                  <span>{[plot.place && plot.place[locale] !== plot.name[locale] ? plot.place[locale] : null, plot.area?.[locale]].filter(Boolean).join(" · ")}</span>
                </li>
              ))}
            </ul>
            <p className="r3-land__total"><span>{c.landTotal}</span><Figure value={portfolioFigures.land.value[locale]} /></p>
            <p className="r3-note">{c.landNote}</p>
          </div>
          {drochia ? (
            <div className="r3-land__map" data-reveal>
              <SiteMap slug="drochia-gateway" name={drochia.name} label={c.mapLabel} />
            </div>
          ) : null}
        </div>
      </section>

      {/* C · PROJECTS UNDER DEVELOPMENT / CONSTRUCTION — the one dark chapter; never presented as leasing */}
      <section className="r3-sec r3-sec--ink r3-pjdev" id={devCat.anchor}>
        <div className="r3-shell r3-head r3-head--light r3-head--split" data-reveal>
          <R3Label tone="light">{devCat.label[locale]}</R3Label>
          <h2 className="r3-title">{devCat.title[locale]}</h2>
          <p className="r3-lead">{devCat.lead[locale]}</p>
        </div>
        <Link href={p(`/projects/${vatra.slug}`)} className="r3-wide r3-wide--dark" data-reveal>
          <figure className="r3-wide__media">
            <ArtImage media={{ ...vatra.media!, mobile: vatra.media!.wide }} variant="wide" alt={`${vatra.name} — ${vatra.format[locale]}`} sizes="100vw" position="45% 60%" />
          </figure>
        </Link>
        <div className="r3-shell r3-pjdev__grid r33-pjdev__grid">
          {development.map((item) => (
            <Link key={item.slug} href={item.page ? itemHref(locale, item.page, devCat.anchor) : `${p("/contact")}?subject=partnership#partnership`} className="r3-pjdev__item" data-reveal>
              <span className="r3-pjdev__name">{item.name}</span>
              <span className="r3-pjdev__meta">{item.status[locale]}</span>
              <span className="r3-more">{item.page ? c.openProject : c.discuss}<Icon size={16} /></span>
            </Link>
          ))}
        </div>
      </section>

      {/* NEXT */}
      <section className="r3-sec r3-sec--stone r3-routes">
        <div className="r3-shell">
          <R3Label>{c.closeKicker}</R3Label>
          <nav className="r3-routes__list" aria-label={c.closeKicker}>
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
