import Link from "next/link";
import { MaskTitle } from "@/components/experience";
import { PageShell } from "@/components/page-shell";
import { ArtImage } from "@/components/primitives";
import { storyLine } from "@/components/project-facts";
import { Figure, NB, R3Label, projectState } from "@/components/r3";
import { SiteMap } from "@/components/site-map";
import { Icon } from "@/components/ui";
import { getProject, listLand, listProjects, type ProjectEntry } from "@/content/source";
import { daciaDevelopment, drochiaProfile, portfolioFigures } from "@/data/demo-content";
import { localePath, type SiteLocale } from "@/lib/site-data";

/**
 * PROJECTS — SITEWIDE R3 (OWNER 2026-11-09): an editorial property sequence, never a grid of equal cards.
 * Opening (title + four confirmed figures) → Dacia 31 dominant, full bleed → Moscova 20 secondary →
 * Moscova 9 and Creangă 78 at different scales (Creangă 78's 960 px photograph is never enlarged) →
 * development as the one dark chapter (VATRA at width, the Dacia 31 programme and Drochia Gateway as
 * typography) → land (total, plots, the light OSM map) → next step. Statuses are derived, never typed.
 */
const copy = {
  ro: {
    label: "Proiecte", title: ["Imobiliarele", "MEGAPARC."],
    lead: (area: string) => `Clădiri comerciale în funcțiune cu o suprafață totală de ${area}, proiecte de dezvoltare și terenuri — în proprietatea companiei.`,
    figOperating: "obiecte în funcțiune", figDevelopment: "proiecte de dezvoltare", figLand: "terenuri", figArea: "suprafața obiectelor în funcțiune",
    index: [["Obiecte în funcțiune", "#collection"], ["Dezvoltare", "#development"], ["Terenuri", "#land"]],
    open: "Vezi obiectul", openProject: "Vezi proiectul",
    operatingTitle: "Obiecte în funcțiune.", devTitleShort: "Dezvoltare și terenuri", ofLand: "de teren",
    devKicker: "Dezvoltare", devTitle: "Proiecte proprii — de la teren la clădirea care funcționează.",
    buildings: "3 clădiri", landKicker: "Terenuri", landTitle: "Teren pentru proiectele următoare.",
    landLead: "Terenuri în proprietatea MEGAPARC. Planurile pentru fiecare teren se publică după aprobare.", landTotal: "Total",
    mapLabel: "Hartă: amplasarea terenului Drochia Gateway",
    closeKicker: "Pasul următor", routes: [["Spații disponibile", "/leasing#available"], ["Investiții și parteneriat", "/partnership"], ["Propuneți un obiect sau un teren", "/offer"], ["Despre MEGAPARC", "/about"]],
  },
  ru: {
    label: "Проекты", title: ["Недвижимость", "MEGAPARC."],
    lead: (area: string) => `Действующие коммерческие здания общей площадью ${area}, проекты развития и${NB}земля${NB}— в${NB}собственности компании.`,
    figOperating: "действующих объекта", figDevelopment: "проекта развития", figLand: "земли", figArea: "площадь действующих объектов",
    index: [["Действующие объекты", "#collection"], ["Развитие", "#development"], ["Земля", "#land"]],
    open: "Смотреть объект", openProject: "Открыть проект",
    operatingTitle: "Действующие объекты.", devTitleShort: `Развитие и${NB}земля`, ofLand: "земли",
    devKicker: "Развитие", devTitle: `Собственные проекты${NB}— от${NB}участка до${NB}работающего здания.`,
    buildings: "3 здания", landKicker: "Земля", landTitle: `Земля для следующих проектов.`,
    landLead: `Участки в${NB}собственности MEGAPARC. Планы по${NB}каждому участку публикуем после утверждения.`, landTotal: "Всего",
    mapLabel: "Карта: расположение участка Drochia Gateway",
    closeKicker: "Следующий шаг", routes: [["Свободные помещения", "/leasing#available"], [`Инвестиции и${NB}партнёрство`, "/partnership"], [`Предложить объект или${NB}землю`, "/offer"], ["О компании", "/about"]],
  },
  en: {
    label: "Projects", title: ["MEGAPARC", "real estate."],
    lead: (area: string) => `Operating commercial buildings with a total area of ${area}, development projects and land — owned by the company.`,
    figOperating: "operating properties", figDevelopment: "development projects", figLand: "of land", figArea: "operating property area",
    index: [["Operating properties", "#collection"], ["Development", "#development"], ["Land", "#land"]],
    open: "View the property", openProject: "View the project",
    operatingTitle: "Operating properties.", devTitleShort: "Development and land", ofLand: "of land",
    devKicker: "Development", devTitle: "Our own projects — from site to a working building.",
    buildings: "3 buildings", landKicker: "Land", landTitle: "Land for the next projects.",
    landLead: "Plots owned by MEGAPARC. Plans for each plot are published once approved.", landTotal: "Total",
    mapLabel: "Map: where the Drochia Gateway site is",
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
  const all = listProjects();
  const dacia = getProject("dacia-31")!;
  const m20 = getProject("moscova-20")!;
  const m9 = getProject("moscova-9")!;
  const creanga = getProject("creanga-78")!;
  const vatra = getProject("vatra")!;
  const daciaDev = getProject("dacia-31-development")!;
  const drochia = getProject("drochia-gateway")!;
  const land = listLand();
  const developmentCount = all.filter((project) => project.kind !== "operating").length;
  const linkTo = (value: string) => {
    const [path, hash] = value.split("#");
    return `${p(path)}${hash ? `#${hash}` : ""}`;
  };

  return (
    <PageShell locale={locale} mainClassName="r3-page r3-projects">
      {/* OPENING — the title, the four confirmed figures, a quiet index */}
      <section className="r3-sec r3-sec--ivory r3-opening r3-opening--projects">
        <div className="r3-shell">
          <R3Label>{c.label}</R3Label>
          <MaskTitle as="h1" className="r3-opening__title" lines={[...c.title]} />
          <p className="r3-lead r3-opening__lead" data-reveal>{c.lead(portfolioFigures.area.value[locale])}</p>
          {/* R3.1 §13: operating assets and development are told apart at once */}
          <nav className="r3-split" aria-label={c.label} data-reveal>
            <a href="#collection">
              <span className="r3-split__label">{c.index[0][0]}</span>
              <span className="r3-split__count">{portfolioFigures.operating.value[locale]}</span>
              <span className="r3-split__meta"><Figure value={portfolioFigures.area.value[locale]} /> · {c.figArea}</span>
            </a>
            <a href="#development">
              <span className="r3-split__label">{c.devTitleShort}</span>
              <span className="r3-split__count">{String(developmentCount).padStart(2, "0")}</span>
              <span className="r3-split__meta"><Figure value={portfolioFigures.land.value[locale]} /> {c.ofLand} · {c.figDevelopment}</span>
            </a>
          </nav>
        </div>
      </section>

      {/* OPERATING — one dominant building, one secondary, then a pair at different scales */}
      <section className="r3-sec r3-sec--ivory r3-sec--flush-top r3-pjs" id="collection" aria-label={c.index[0][0]}>
        <div className="r3-shell r3-pjs__head" data-reveal>
          <h2 className="r3-title">{c.operatingTitle}</h2>
        </div>
        <Link href={p(`/projects/${dacia.slug}`)} className="r3-feature" data-reveal>
          <figure className="r3-feature__media">
            <ArtImage media={dacia.media!} alt={`${dacia.name} — ${dacia.format[locale]}`} sizes="100vw" position="50% 58%" />
          </figure>
          <span className="r3-shell r3-feature__copy">
            <span className="r3-feature__name">{dacia.name}</span>
            <span className="r3-feature__line">{dacia.editorial?.headline[locale] ?? dacia.line[locale]}</span>
            <span className="r3-feature__meta"><Caption project={dacia} locale={locale} open={c.open} /></span>
          </span>
        </Link>

        <div className="r3-shell r3-second r3-second--page">
          <Link href={p(`/projects/${m20.slug}`)} className="r3-second__media" data-reveal tabIndex={-1} aria-hidden="true">
            <ArtImage media={m20.media!} variant="card" alt="" sizes="(min-width: 900px) 58vw, 100vw" position="50% 55%" />
          </Link>
          <Link href={p(`/projects/${m20.slug}`)} className="r3-second__copy r3-pj" data-reveal>
            <span className="r3-second__name">{m20.name}</span>
            <Caption project={m20} locale={locale} open={c.open} />
          </Link>
        </div>

        <ol className="r3-shell r3-compact">
          {[m9, creanga].map((project) => (
            <li key={project.slug} data-reveal>
              <Link href={p(`/projects/${project.slug}`)} className="r3-compact__row r3-pj">
                <span className="r3-compact__media">
                  <ArtImage media={project.media!} variant="card" alt="" sizes="(min-width: 900px) 22vw, 40vw" />
                </span>
                <span className="r3-compact__name">{project.name}</span>
                <span className="r3-compact__copy"><Caption project={project} locale={locale} open={c.open} /></span>
              </Link>
            </li>
          ))}
        </ol>
      </section>

      {/* DEVELOPMENT — the one dark chapter */}
      <section className="r3-sec r3-sec--ink r3-pjdev" id="development">
        <div className="r3-shell r3-head r3-head--light r3-head--split" data-reveal>
          <R3Label tone="light">{c.devKicker}</R3Label>
          <h2 className="r3-title">{c.devTitle}</h2>
        </div>
        <Link href={p(`/projects/${vatra.slug}`)} className="r3-wide r3-wide--dark" data-reveal>
          <figure className="r3-wide__media">
            <ArtImage media={{ ...vatra.media!, mobile: vatra.media!.wide }} variant="wide" alt={`${vatra.name} — ${vatra.format[locale]}`} sizes="100vw" position="45% 60%" />
          </figure>
        </Link>
        <div className="r3-shell r3-pjdev__grid r3-pjdev__grid--tiers">
          <Link href={p(`/projects/${vatra.slug}`)} className="r3-pjdev__item" data-reveal>
            <span className="r3-pjdev__name">{vatra.name}</span>
            <span className="r3-pjdev__meta">{vatra.card.status[locale]}</span>
            <span className="r3-pjdev__text">{vatra.line[locale]}</span>
            <span className="r3-more">{c.openProject}<Icon size={16} /></span>
          </Link>
          <Link href={p(`/projects/${daciaDev.slug}`)} className="r3-pjdev__item" data-reveal>
            <span className="r3-pjdev__name">{daciaDev.name}</span>
            <span className="r3-pjdev__figure"><Figure value={daciaDevelopment.total.value[locale]} /></span>
            <span className="r3-pjdev__meta">{c.buildings} × {daciaDevelopment.each.value[locale]} · {daciaDev.card.status[locale]}</span>
            <span className="r3-more">{c.openProject}<Icon size={16} /></span>
          </Link>
          <Link href={p(`/projects/${drochia.slug}`)} className="r3-pjdev__item" data-reveal>
            <span className="r3-pjdev__name">{drochia.name}</span>
            <span className="r3-pjdev__figure"><Figure value={drochia.card.size[locale]} /></span>
            <span className="r3-pjdev__meta">{drochiaProfile.status.value[locale]}</span>
            <span className="r3-more">{c.openProject}<Icon size={16} /></span>
          </Link>
        </div>
      </section>

      {/* LAND — the total, the plots, the light map */}
      <section className="r3-sec r3-sec--paper r3-land" id="land">
        <div className="r3-shell r3-land__grid">
          <div data-reveal>
            <R3Label>{c.landKicker}</R3Label>
            <h2 className="r3-title">{c.landTitle}</h2>
            <p className="r3-lead">{c.landLead}</p>
            <p className="r3-land__total"><span>{c.landTotal}</span><Figure value={portfolioFigures.land.value[locale]} /></p>
            <ul className="r3-land__list">
              {land.map((plot) => (
                <li key={plot.slug}>
                  {plot.project ? <Link href={p(`/projects/${plot.project}`)}>{plot.name[locale]}</Link> : <span>{plot.name[locale]}</span>}
                  <span>{plot.point.value[locale]}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="r3-land__map" data-reveal>
            <SiteMap slug="drochia-gateway" name={drochia.name} label={c.mapLabel} />
          </div>
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
