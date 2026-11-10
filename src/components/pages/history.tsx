import Link from "next/link";
import { MaskTitle } from "@/components/experience";
import { PageShell } from "@/components/page-shell";
import { ArtImage } from "@/components/primitives";
import { NB, R3Label, R3Link, projectState } from "@/components/r3";
import { Icon } from "@/components/ui";
import { getProject } from "@/content/source";
import { itemHref, leasingProjects, portfolioCategories, portfolioCounts } from "@/lib/portfolio";
import { chapters, entries, episodeImage, episodePlace, heritage, historyCopy, historyHeroImage, illustrativeLabel, internationalPlaces, sectorLabel, type Chapter, type ChapterKey, type HistoryEntry } from "@/lib/history";
import { localePath, publicAsset, type Localized, type SiteLocale } from "@/lib/site-data";

/**
 * HISTORY — SITEWIDE R3 §7 (OWNER 2026-11-09): the approved retro direction at editorial-archive scale.
 * Each era is a chapter, not a timeline item: a very large year (1991 · 1995 · 2005 · 2020 monumental, the
 * intermediate periods smaller), one large archival photograph (60–100 % of the width), a documentary caption
 * (chapter, years — never a source or a claim about what the frame shows), the chapter's episodes as an
 * editorial register in which the group's companies carry real weight (names only from the OWNER source
 * «Draft text»; unverified superlatives held back — docs/HISTORY_EDITORIAL.md). Fewer images per viewport,
 * generous whitespace, no film filters, no scrapbook.
 * Production edition: the period photographs are not approved — chapters read as typography; the real
 * MEGAPARC photographs (2005, 2020, today) stay.
 */
const copy = {
  ro: { index: "Capitole", today: "Proiectele MEGAPARC astăzi", projects: "Toate proiectele", about: "Despre MEGAPARC astăzi", register: "Companiile grupului", registerTitle: "Afacerile pe care s-a construit experiența.", registerNote: "Afacerile grupului sunt istoria grupului — nu active actuale ale MEGAPARC.", places: "Unde a lucrat grupul", closeLabel: "Astăzi", closeTitle: "Istoria continuă în proiectele de azi." },
  ru: { index: "Главы", today: "Проекты MEGAPARC сегодня", projects: "Все проекты", about: "О MEGAPARC сегодня", register: "Компании группы", registerTitle: `Бизнесы, на${NB}которых вырос опыт.`, registerNote: `Бизнесы группы${NB}— это история группы, а${NB}не${NB}текущие активы MEGAPARC.`, places: "Где работала группа", closeLabel: "Сегодня", closeTitle: `История продолжается в${NB}сегодняшних проектах.` },
  en: { index: "Chapters", today: "MEGAPARC projects today", projects: "All projects", about: "About MEGAPARC today", register: "The group's companies", registerTitle: "The businesses the experience was built on.", registerNote: "The group's businesses are the group's history — not current MEGAPARC assets.", places: "Where the group worked", closeLabel: "Today", closeTitle: "The history continues in today's projects." },
} satisfies Record<SiteLocale, Record<string, string>>;

/** A real MEGAPARC photograph in a chapter frame is today's photograph — said so, never dated into the past. */
const assetCaption: Localized = { ro: "imobil MEGAPARC, fotografie actuală", ru: "объект MEGAPARC, фото сегодня", en: "a MEGAPARC property, photographed today" };

const placeName: Record<string, Localized> = {
  romania: { ro: "România", ru: "Румыния", en: "Romania" },
  ukraine: { ro: "Ucraina", ru: "Украина", en: "Ukraine" },
  iraq: { ro: "Irak", ru: "Ирак", en: "Iraq" },
  dakar: { ro: "Dakar, Senegal", ru: "Дакар, Сенегал", en: "Dakar, Senegal" },
  china: { ro: "China", ru: "Китай", en: "China" },
};

/** The four monumental years and the chapter each one opens. */
const monumental: Partial<Record<ChapterKey, string>> = { origins: "1991", group: "1995", megaparc: "2005", focus: "2020" };
/** One photograph per chapter: the lead episode's frame (archive frames exist in the preview edition only). */
const leadEpisode: Partial<Record<ChapterKey, string>> = { origins: "negruzzi", group: "ym-capitol", finance: "inseko", megaparc: "megaparc", expansion: "estate-industry", international: "valahia", consolidation: "china", focus: "focus-2020" };
/** Episodes that name a place or an unnamed structure, not a company — kept out of the register. */
const notCompanies = new Set(["negruzzi", "holding", "west-africa", "transfer", "china", "romania-logistics", "focus-2020"]);

const byId = (id: string) => entries.find((entry) => entry.id === id)!;

function Frame({ id, sizes, priority = false, className = "" }: { id?: string; sizes: string; priority?: boolean; className?: string }) {
  const image = id ? episodeImage[id] : undefined;
  if (!image) return null;
  if (image.kind === "asset") {
    const project = getProject(image.slug);
    if (!project?.media) return null;
    return <ArtImage media={project.media} alt={`${project.name}`} sizes={sizes} priority={priority} className={className} />;
  }
  return (
    <picture>
      <source media="(min-width: 721px)" srcSet={publicAsset(`/assets/history/${image.key}.webp`)} />
      <img src={publicAsset(`/assets/history/${image.key}-mobile.webp`)} alt="" loading={priority ? "eager" : "lazy"} decoding="async" className={className} />
    </picture>
  );
}

/** The subtitle without the company name it often starts with («Romitech — хаб…» → «Хаб…»); nothing when it only repeats the name. */
function subtitle(entry: HistoryEntry, locale: SiteLocale) {
  const title = entry.title[locale].trim();
  if (!entry.name || !title.startsWith(entry.name)) return title;
  const rest = title.slice(entry.name.length).replace(/^[\s\u00a0]*[—–-][\s\u00a0]*/, "").trim();
  return rest ? rest.charAt(0).toLocaleUpperCase(locale) + rest.slice(1) : "";
}

function Episode({ entry, locale }: { entry: HistoryEntry; locale: SiteLocale }) {
  const sub = subtitle(entry, locale);
  return (
    <li className="r3-ep" data-reveal>
      <p className="r3-ep__meta">{entry.year} · {sectorLabel[entry.sector][locale]} · {episodePlace[entry.id]?.[locale]}</p>
      <h3 className="r3-ep__name">{entry.name || entry.title[locale]}</h3>
      {entry.name && sub ? <p className="r3-ep__title">{sub}</p> : null}
      <p className="r3-ep__text">{entry.text[locale]}</p>
    </li>
  );
}

function ChapterScene({ chapter, locale, index }: { chapter: Chapter; locale: SiteLocale; index: number }) {
  const big = monumental[chapter.key];
  const lead = leadEpisode[chapter.key];
  // R3.3.1 §2 / §4: every principal era is a visual chapter — 1991 · 1995 labelled illustrations of the era (full width),
  // 2005 MEGAPARC's own building photographed today (a large inset — the photograph is not strong enough for 100 %),
  // 2020 the real Dacia 31 (full width); the intermediate periods stay text interludes
  const image = lead ? episodeImage[lead] : undefined;
  const hasFrame = Boolean(big && image);
  const imageProject = image?.kind === "asset" ? getProject(image.slug) : undefined;
  const range = chapter.range || String(new Date().getFullYear());
  const caption = image?.kind === "archive" ? `${illustrativeLabel[locale]} · ${chapter.label[locale]} · ${range}` : imageProject ? `${imageProject.name} · ${assetCaption[locale]}` : `${chapter.label[locale]} · ${range}`;
  const tone = chapter.key === "megaparc" ? "megaparc" : chapter.key === "international" ? "dark" : index % 2 ? "paper" : "ivory";
  const flip = index % 2 === 1;
  return (
    <section className={`r3-era r3-era--${tone}${big ? " r3-era--major" : " r3-era--minor"}${hasFrame ? "" : " r3-era--type"}${flip ? " r3-era--flip" : ""}`} id={chapter.key}>
      <header className="r3-shell r3-era__head">
        <p className="r3-era__year" aria-hidden="true" data-reveal>{big ?? range}</p>
        <div className="r3-era__intro" data-reveal>
          <p className="r3-era__label">{chapter.label[locale]} · {range}</p>
          <h2 className="r3-era__title"><span className="sr-only">{range}. </span>{chapter.title[locale]}</h2>
          <p className="r3-era__lead">{chapter.lead[locale]}</p>
        </div>
      </header>
      {hasFrame ? (
        <figure className={`r3-era__frame al-reveal${chapter.key === "megaparc" ? " r331-era__frame--inset" : ""}`} data-reveal>
          <Frame id={lead} sizes={chapter.key === "megaparc" ? "(min-width: 1024px) 66vw, 100vw" : "100vw"} />
          <figcaption className="r3-era__caption">{caption}</figcaption>
        </figure>
      ) : null}
      {chapter.key === "international" ? (
        <div className="r3-shell r3-era__places" data-reveal>
          <p className="r3-label r3-label--light">{copy[locale].places}</p>
          <ul>
            {internationalPlaces.map((place) => (
              <li key={place.key}><span>{placeName[place.key]?.[locale] ?? place.key}</span><small>{place.years}</small></li>
            ))}
          </ul>
        </div>
      ) : null}
      {chapter.ids.length ? (
        <ol className="r3-shell r3-eps">
          {chapter.ids.map((id) => <Episode key={id} entry={byId(id)} locale={locale} />)}
        </ol>
      ) : null}
    </section>
  );
}

export function HistoryPage({ locale }: { locale: SiteLocale }) {
  const h = historyCopy;
  const c = copy[locale];
  const p = (path: string) => localePath(locale, path);
  const anchor: Record<string, string> = { "1991": "origins", "1995": "group", "2005": "megaparc", "2020": "focus" };
  // R3.3 §5: today = the leasing buildings, then land and projects in development as categories
  const today = leasingProjects();
  const counts = portfolioCounts();
  const register = entries.filter((entry) => entry.name && !notCompanies.has(entry.id));

  return (
    <PageShell locale={locale} variant={historyHeroImage ? "overlay" : "solid"} experience mainClassName="r3-page r3-history r4-page r4-history">
      {/* OPENING — one archival frame across the whole viewport; the four years are the way in */}
      <section className={`r3-hhero${historyHeroImage ? "" : " r3-hhero--type"}`} data-xp-hero={historyHeroImage ? "" : undefined}>
        {historyHeroImage ? (
          <div className="r3-hhero__media" aria-hidden="true">
            <picture>
              <source media="(min-width: 721px)" srcSet={publicAsset(`/assets/history/${historyHeroImage}.webp`)} />
              <img src={publicAsset(`/assets/history/${historyHeroImage}-mobile.webp`)} alt="" decoding="async" fetchPriority="high" />
            </picture>
          </div>
        ) : null}
        <div className="r3-shell r3-hhero__inner">
          <R3Label tone={historyHeroImage ? "light" : "dark"}>{h.kicker[locale]}</R3Label>
          <MaskTitle as="h1" className="r3-display r3-hhero__title" lines={[...h.title[locale]]} />
          <p className="r3-hhero__lead" data-reveal>{h.lead[locale]}</p>
        </div>
      </section>

      {/* TWO LINES OF ONE STORY — the group and MEGAPARC; the four years as the chapter index */}
      <section className="r3-sec r3-sec--ivory r3-hlines">
        <div className="r3-shell">
          <div className="r3-hlines__head" data-reveal>
            <h2 className="r3-title">{h.linesTitle[locale]}</h2>
            <p className="r3-lead">{h.linesText[locale]}</p>
          </div>
          <nav aria-label={c.index}>
            <ol className="r3-hyears">
              {heritage.map((item) => (
                <li key={item.year} className={item.year === "2005" || item.year === "2020" ? "is-megaparc" : undefined} data-reveal>
                  <a href={`#${anchor[item.year]}`}>
                    <span className="r3-hyears__year">{item.year}</span>
                    <span className="r3-hyears__label">{item.label[locale]}</span>
                  </a>
                </li>
              ))}
            </ol>
          </nav>
          <p className="r3-hlines__rule" data-reveal>{h.rule[locale]}</p>
        </div>
      </section>

      {chapters.filter((chapter) => chapter.key !== "today").map((chapter, index) => (
        <ChapterScene key={chapter.key} chapter={chapter} locale={locale} index={index} />
      ))}

      {/* THE GROUP'S COMPANIES — names with editorial weight; source-supported only */}
      <section className="r3-sec r3-sec--paper r3-register" id="companies">
        <div className="r3-shell">
          <div className="r3-head r3-head--split" data-reveal>
            <R3Label>{c.register}</R3Label>
            <h2 className="r3-title">{c.registerTitle}</h2>
            <p className="r3-note">{c.registerNote}</p>
          </div>
          <ol className="r3-register__list">
            {register.map((entry) => (
              <li key={entry.id} className={entry.scope === "megaparc" ? "is-megaparc" : undefined} data-reveal>
                <span className="r3-register__name">{entry.name}</span>
                <span className="r3-register__meta">{entry.year} · {sectorLabel[entry.sector][locale]} · {episodePlace[entry.id]?.[locale]}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* TODAY — in colour: the projects the history leads to */}
      <section className="r3-sec r3-sec--ivory r3-htoday" id="today">
        <div className="r3-shell">
          <div className="r3-head r3-head--split" data-reveal>
            <R3Label>{c.closeLabel}</R3Label>
            <h2 className="r3-title">{c.closeTitle}</h2>
            <p className="r3-lead">{chapters.find((chapter) => chapter.key === "today")!.lead[locale]}</p>
          </div>
          <ol className="r3-index" data-reveal>
            {today.map((project) => {
              const state = projectState(project, locale);
              return (
                <li key={project.slug}>
                  <Link href={p(`/projects/${project.slug}`)}>
                    <span className="r3-index__name">{project.name}</span>
                    <span className="r3-index__meta">{project.format[locale]}</span>
                    <span className={`r3-index__state is-${state.tone}`}>{state.text}</span>
                    {project.media ? (
                      <span className="r3-index__peek" aria-hidden="true">
                        <ArtImage media={project.media} variant="card" alt="" sizes="22rem" />
                      </span>
                    ) : null}
                    <Icon size={20} />
                  </Link>
                </li>
              );
            })}
            {portfolioCategories.filter((category) => category.key !== "leasing").map((category) => (
              <li key={category.key}>
                <Link href={itemHref(locale, null, category.anchor)}>
                  <span className="r3-index__name">{category.label[locale]}</span>
                  <span className="r3-index__meta">{category.lead[locale]}</span>
                  <span className="r3-index__state">{String(counts[category.key]).padStart(2, "0")}</span>
                  <Icon size={20} />
                </Link>
              </li>
            ))}
          </ol>
          <div className="r3-actions">
            <R3Link href={p("/projects")}>{c.projects}</R3Link>
            <R3Link href={p("/about")}>{c.about}</R3Link>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
