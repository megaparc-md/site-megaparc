import Link from "next/link";
import { Fragment } from "react";
import { HeroFigures, MaskTitle } from "@/components/experience";
import { HistoryMap } from "@/components/history-map";
import { PageShell } from "@/components/page-shell";
import { ArtImage } from "@/components/primitives";
import { ProjectStatus } from "@/components/project-facts";
import { Icon } from "@/components/ui";
import { getProject, listProjects, publicSpaces } from "@/content/source";
import { portfolioFigures } from "@/data/demo-content";
import { chapters, entries, episodeImage, episodePlace, heritage, historyCopy, historyHeroImage, interludeImage, internationalPlaces, sectorLabel, type Chapter, type ChapterKey, type HistoryEntry } from "@/lib/history";
import { localePath, publicAsset, type SiteLocale } from "@/lib/site-data";

/**
 * HISTORY — a premium editorial documentary (OWNER brief "PREMIUM REAL ESTATE
 * EXPERIENCE REBUILD", 2026-10-09). The chronology, chapters, episodes and
 * images are unchanged (src/lib/history.ts); only the reading changes.
 *
 * Opening: the archive photograph breaks the grid; the four heritage years are
 * the anchors into the chronicle. Every chapter has its own format — a
 * two-image spread, a staggered pair, a magazine page, an alternating essay,
 * the map, a portrait strip — so the page reads as a documentary, not a list.
 * 2005 is the strong break (the year at display size); 2020 is a full-bleed
 * moment on a real MEGAPARC building; today is in full colour.
 * Motion stays restrained: image reveals and one slow archive interlude.
 */

/** Current properties in colour — Creangă 78 joins with its real photograph (OWNER 2026-10-09). */
const todaySlugs = ["dacia-31", "moscova-9", "moscova-20", "creanga-78", "vatra"];
const byId = (id: string) => entries.find((entry) => entry.id === id)!;
/** Heritage year → the chapter it opens. */
const anchor: Record<string, ChapterKey> = { "1991": "origins", "1995": "group", "2005": "megaparc", "2020": "focus" };
type Format = "spread" | "stagger" | "magazine" | "essay" | "strip" | "three";
const format: Partial<Record<ChapterKey, Format>> = { origins: "spread", group: "stagger", finance: "magazine", expansion: "essay", international: "three", consolidation: "strip" };

function EpisodeImage({ entry, locale, sizes, eager = false }: { entry: HistoryEntry; locale: SiteLocale; sizes: string; eager?: boolean }) {
  const image = episodeImage[entry.id];
  // production edition: no period image (OWNER "PRODUCTION V1" §3) — the episode keeps its text, never an invented picture
  if (!image) return null;
  if (image.kind === "asset") {
    const project = getProject(image.slug)!;
    return <ArtImage media={project.media!} alt={`${project.name} — ${entry.title[locale]}`} sizes={sizes} />;
  }
  return (
    <picture>
      <source media="(min-width: 721px)" srcSet={`${publicAsset(`/assets/history/${image.key}-card.webp`)} 900w, ${publicAsset(`/assets/history/${image.key}.webp`)} 1800w`} sizes={sizes} />
      <img src={publicAsset(`/assets/history/${image.key}-card.webp`)} alt="" loading={eager ? "eager" : "lazy"} decoding="async" />
    </picture>
  );
}

function Meta({ entry, locale }: { entry: HistoryEntry; locale: SiteLocale }) {
  return (
    <p className="hc-ep__meta">
      <span>{entry.year}</span>
      <span>{sectorLabel[entry.sector][locale]}</span>
      <span>{episodePlace[entry.id][locale]}</span>
    </p>
  );
}

function Episode({ entry, locale, sizes }: { entry: HistoryEntry; locale: SiteLocale; sizes: string }) {
  return (
    <li className={`hc-ep${episodeImage[entry.id] ? "" : " hc-ep--text"}`} data-reveal>
      {episodeImage[entry.id] ? (
        <figure className="hc-ep__media">
          <EpisodeImage entry={entry} locale={locale} sizes={sizes} />
        </figure>
      ) : null}
      <div className="hc-ep__body">
        <Meta entry={entry} locale={locale} />
        <h3 className="hc-ep__title">{entry.title[locale]}</h3>
        <p className="hc-ep__text">{entry.text[locale]}</p>
      </div>
    </li>
  );
}

function ChapterHead({ chapter, locale }: { chapter: Chapter; locale: SiteLocale }) {
  return (
    <header className="hc2-head" data-reveal>
      <p className="hc2-head__meta">
        <span>{historyCopy.chapter[locale]} {chapter.no}</span>
        <span>{chapter.label[locale]}</span>
      </p>
      <p className="hc2-head__range">{chapter.range}</p>
      <h2 className="hc2-head__title">{chapter.title[locale]}</h2>
      <p className="hc2-head__lead">{chapter.lead[locale]}</p>
    </header>
  );
}

const sizesFor: Record<Format, string[]> = {
  spread: ["(min-width: 1024px) 58vw, 100vw", "(min-width: 1024px) 38vw, 100vw", "(min-width: 1024px) 25vw, 50vw"],
  stagger: ["(min-width: 720px) 50vw, 100vw"],
  magazine: ["(min-width: 1024px) 58vw, 100vw", "(min-width: 1024px) 20vw, 50vw"],
  essay: ["(min-width: 1024px) 58vw, 100vw"],
  strip: ["(min-width: 1024px) 33vw, 100vw"],
  three: ["(min-width: 1024px) 33vw, (min-width: 720px) 50vw, 100vw"],
};

function Episodes({ ids, locale, kind }: { ids: string[]; locale: SiteLocale; kind: Format }) {
  const sizes = sizesFor[kind];
  const pick = (index: number) => sizes[Math.min(index, sizes.length - 1)];
  return (
    // a chapter whose episodes carry no image (production edition) reads as one quiet editorial list
    <ol className={`hc-eps hc2-eps hc2-eps--${ids.some((id) => episodeImage[id]) ? kind : "text"}`}>
      {ids.map((id, index) => (
        <Episode key={id} entry={byId(id)} locale={locale} sizes={pick(kind === "spread" ? index : index === 0 ? 0 : 1)} />
      ))}
    </ol>
  );
}

export function HistoryPage({ locale }: { locale: SiteLocale }) {
  const h = historyCopy;
  const p = (path: string) => localePath(locale, path);

  return (
    <PageShell locale={locale} experience mainClassName="hc hc2">
      {/* OPENING — the archive photograph breaks the grid; the years are the way in */}
      <section className="hc2-hero">
        <div className={`xp-shell hc2-hero__grid${historyHeroImage ? "" : " hc2-hero__grid--text"}`}>
          <div className="hc2-hero__copy">
            <p className="pm-kicker" data-reveal>{h.kicker[locale]}</p>
            <MaskTitle as="h1" className="hc2-hero__title" lines={[...h.title[locale]]} />
            <p className="hc2-hero__lead" data-reveal>{h.lead[locale]}</p>
          </div>
          {historyHeroImage ? (
            <figure className="hc2-hero__media" data-reveal>
              <picture>
                <source media="(min-width: 721px)" srcSet={publicAsset(`/assets/history/${historyHeroImage}.webp`)} />
                <img src={publicAsset(`/assets/history/${historyHeroImage}-mobile.webp`)} alt="" decoding="async" fetchPriority="high" />
              </picture>
            </figure>
          ) : null}
        </div>
        <nav className="xp-shell hc2-years" aria-label={h.index[locale]} data-reveal>
          <ol>
            {heritage.map((item) => (
              <li key={item.year} className={item.year === "2005" ? "is-megaparc" : undefined}>
                <a href={`#${anchor[item.year]}`}>
                  <span className="hc2-years__year">{item.year}</span>
                  <span className="hc2-years__label">{item.label[locale]}</span>
                </a>
              </li>
            ))}
          </ol>
        </nav>
      </section>

      {chapters.map((chapter) => {
        if (chapter.key === "megaparc") {
          const main = byId("megaparc");
          const same = byId("imc-market");
          return (
            <Fragment key={chapter.key}>
              {/* full-bleed archive pause before the company appears */}
              {interludeImage ? (
                <div className="hc-interlude hc-interlude--archive" data-xp-progress aria-hidden="true">
                  <div className="hc-interlude__media">
                    <picture>
                      <source media="(min-width: 721px)" srcSet={publicAsset(`/assets/history/${interludeImage}.webp`)} />
                      <img src={publicAsset(`/assets/history/${interludeImage}-mobile.webp`)} alt="" loading="lazy" decoding="async" />
                    </picture>
                  </div>
                </div>
              ) : null}
              {/* 2005 — the break */}
              <section className="hc-ch hc2-break" id={chapter.key}>
                <div className="xp-shell">
                  <p className="hc2-head__meta" data-reveal><span>{h.chapter[locale]} {chapter.no}</span><span>{chapter.label[locale]}</span></p>
                  <p className="hc2-break__year" data-reveal aria-hidden="true">2005</p>
                  <div className="hc2-break__grid">
                    <h2 className="hc2-break__title" data-reveal>{chapter.title[locale]}</h2>
                    <div className="hc2-break__copy" data-reveal>
                      <p className="hc2-break__lead">{chapter.lead[locale]}</p>
                      <p className="hc2-quote">
                        {h.megaparcStatement[locale].map((line) => (
                          <span key={line}>{line}</span>
                        ))}
                      </p>
                    </div>
                  </div>
                  <div className="hc2-break__story">
                    <figure className="hc2-break__media al-reveal" data-reveal>
                      <EpisodeImage entry={main} locale={locale} sizes="(min-width: 1024px) 66vw, 100vw" />
                    </figure>
                    <div className="hc2-break__text" data-reveal>
                      <Meta entry={main} locale={locale} />
                      <p className="hc-ep__text">{main.text[locale]}</p>
                    </div>
                  </div>
                  <ol className="hc-eps hc2-eps hc2-eps--aside">
                    <Episode entry={same} locale={locale} sizes="(min-width: 1024px) 33vw, 100vw" />
                  </ol>
                </div>
              </section>
            </Fragment>
          );
        }
        if (chapter.key === "international") {
          return (
            <section key={chapter.key} className="hc-ch hc-ch--international" id={chapter.key}>
              <div className="xp-shell">
                <ChapterHead chapter={chapter} locale={locale} />
                <div className="hc-world" data-reveal>
                  <HistoryMap kind="international" locale={locale} />
                  <ul className="hc-places">
                    {internationalPlaces.map((place) => (
                      <li key={place.key}>
                        <b>{historyCopy.places[place.key as keyof typeof historyCopy.places][locale]}</b>
                        <span>{place.years}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <Episodes ids={chapter.ids} locale={locale} kind="three" />
              </div>
            </section>
          );
        }
        if (chapter.key === "focus") {
          const main = byId("focus-2020");
          const dacia = getProject("dacia-31")!;
          return (
            <section key={chapter.key} className="hc2-focus" id={chapter.key}>
              <div className="hc2-focus__media" aria-hidden="true">
                <ArtImage media={dacia.media!} variant="wide" alt="" sizes="100vw" />
              </div>
              <div className="xp-shell hc2-focus__over">
                <p className="hc2-head__meta" data-reveal><span>{h.chapter[locale]} {chapter.no}</span><span>{chapter.label[locale]}</span></p>
                <p className="hc2-focus__year" data-reveal aria-hidden="true">2020</p>
                <h2 className="hc2-focus__title" data-reveal>{chapter.title[locale]}</h2>
              </div>
              <div className="xp-shell hc2-focus__grid">
                <p className="hc2-quote hc2-quote--lg" data-reveal>
                  {h.focusStatement[locale].map((line) => (
                    <span key={line}>{line}</span>
                  ))}
                </p>
                <div className="hc2-focus__copy" data-reveal>
                  <p className="hc2-head__lead">{chapter.lead[locale]}</p>
                  <Meta entry={main} locale={locale} />
                  <p className="hc-ep__text">{main.text[locale]}</p>
                </div>
              </div>
            </section>
          );
        }
        if (chapter.key === "today") {
          return (
            <section key={chapter.key} className="hc-ch hc-ch--today hc2-today" id={chapter.key}>
              <div className="xp-shell">
                <ChapterHead chapter={chapter} locale={locale} />
                <div data-reveal>
                  <HeroFigures className="hc-today__figures" items={[
                    { value: portfolioFigures.operating.value[locale], label: h.todayFigures.operating[locale] },
                    { value: String(listProjects().filter((project) => project.kind === "development").length).padStart(2, "0"), label: h.todayFigures.development[locale] },
                    { value: portfolioFigures.area.value[locale], label: h.todayFigures.area[locale] },
                    { value: String(publicSpaces.length).padStart(2, "0"), label: h.todayFigures.spaces[locale] },
                  ]} />
                </div>
                <ul className="hc-today" id="today-projects">
                  {todaySlugs.map((slug) => {
                    const project = getProject(slug)!;
                    return (
                      <li key={slug} data-reveal>
                        <Link href={p(`/projects/${slug}`)}>
                          <figure className="hc-today__media">
                            <ArtImage media={project.media!} variant="portrait" alt={`${project.name} — ${project.format[locale]}`} sizes="(min-width: 1200px) 20vw, (min-width: 720px) 33vw, 50vw" />
                          </figure>
                          <span className="hc-today__name">{project.name}</span>
                          <span className="hc-today__format">{project.format[locale]}</span>
                          <ProjectStatus project={project} locale={locale} as="span" className="hc-today__now" />
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </section>
          );
        }
        return (
          <section key={chapter.key} className={`hc-ch hc-ch--${chapter.tone} hc2-ch hc2-ch--${format[chapter.key]}`} id={chapter.key}>
            <div className="xp-shell">
              <ChapterHead chapter={chapter} locale={locale} />
              <Episodes ids={chapter.ids} locale={locale} kind={format[chapter.key] ?? "three"} />
            </div>
          </section>
        );
      })}

      {/* INDEX — the whole chronicle on one page */}
      <section className="hc-register" id="index">
        <div className="xp-shell">
          <h2 className="hc-register__title" data-reveal>{h.indexTitle[locale]}</h2>
          <ol className="hc2-register">
            {entries.map((entry) => (
              <li key={entry.id} className={entry.scope === "megaparc" ? "is-megaparc" : undefined}>
                <span className="hc2-register__year">{entry.year}</span>
                <span className="hc2-register__title">{entry.title[locale]}</span>
                <span className="hc2-register__meta">{sectorLabel[entry.sector][locale]} · {episodePlace[entry.id][locale]}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* CLOSE — calm */}
      <section className="pm-close">
        <div className="xp-shell pm-close__grid">
          <div data-reveal>
            <p className="pm-kicker">{chapters[chapters.length - 1].label[locale]}</p>
            <h2 className="pm-close__title hc2-close__title">{h.closeTitle[locale]}</h2>
          </div>
          <nav className="pm-close__routes" aria-label={h.index[locale]} data-reveal>
            {[...h.todayLinks, ["/careers#positions", { ro: "Vezi posturile", ru: "Смотреть вакансии", en: "See vacancies" }] as const].map(([path, label]) => (
              <Link key={path} href={p(path)}>
                <span>{label[locale]}</span>
                <Icon name="arrow" size={18} />
              </Link>
            ))}
          </nav>
        </div>
      </section>
    </PageShell>
  );
}
