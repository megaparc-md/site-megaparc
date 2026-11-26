import Link from "next/link";
import { CopyEmail } from "@/components/careers/apply-tools";
import { PrivacyNote } from "@/components/careers/privacy-note";
import { VacancyList, type VacancyGroup } from "@/components/careers/vacancy-list";
import { CareersHero } from "@/components/careers-moment";
import { PageShell } from "@/components/page-shell";
import { ArtImage } from "@/components/primitives";
import { Figure, R3Label, R3Link } from "@/components/r3";
import { Icon } from "@/components/ui";
import { getProject, kindLabel, listVacancies } from "@/content/source";
import { careersCopy } from "@/data/careers-copy";
import { portfolioFigures } from "@/data/demo-content";
import { careerScenes, categoryLabel, categoryLine, employmentLabel, hrEmail, openCategories, payOf, shortTitleOf, vacancyCount, type CareerScene, type VacancyCategory } from "@/lib/careers";
import { localePath, type SiteLocale } from "@/lib/site-data";

/**
 * CAREERS — the employer-brand page, R2 (OWNER «MEGAPARC CAREERS R2 — EMPLOYER BRAND EXCELLENCE», 2026-11-25).
 * Six scenes, each with one job: 01 hero (the promise, the way to the vacancies, the index of directions) · 02 open vacancies,
 * grouped by direction, right after the hero · 03 why MEGAPARC (the five advantages of the OWNER brief + the confirmed figures,
 * on a real operating building) · 04 where the work happens (real property, each linked to the directions with open vacancies) ·
 * 05 a statement band on a real development photograph · 06 how to apply (the last, practical scene).
 * Everything about vacancies — the count, the directions, the groups — is derived from the one list of open vacancies
 * (src/content/source.ts ← src/data/vacancies.json ← WordPress): nothing is typed twice.
 * Facts only: figures from the site's confirmed portfolio data; real MEGAPARC photographs only; no team portraits, testimonials,
 * culture claims or corporate events. The same page in both editions.
 */

/** Year MEGAPARC was founded (heritage hierarchy, OWNER 2026-10-08) — «more than 20 years» is derived from it. */
const FOUNDED = 2005;
/** Real MEGAPARC property in «Where the work happens» and the directions whose work it involves (by the kind of property). */
const workplaces: { slug: string; directions: VacancyCategory[] }[] = [
  { slug: "vatra", directions: ["construction", "legal"] },
  { slug: "moscova-9", directions: ["operations", "commercial"] },
  { slug: "moscova-20", directions: ["commercial", "construction"] },
];

function SceneImage({ scene, locale, sizes, className = "" }: { scene: CareerScene; locale: SiteLocale; sizes: string; className?: string }) {
  return (
    <figure className={`cr-scene ${className}`.trim()}>
      <img src={scene.src} srcSet={`${scene.small} ${scene.smallWidth}w, ${scene.src} ${scene.width}w`} sizes={sizes} width={scene.width} height={scene.height} alt={scene.alt[locale]} loading="lazy" decoding="async" style={scene.position ? { objectPosition: scene.position } : undefined} />
      <figcaption>{scene.caption[locale]}</figcaption>
    </figure>
  );
}

export function CareersPage({ locale }: { locale: SiteLocale }) {
  const c = careersCopy;
  const p = (path: string) => localePath(locale, path);
  const vacancies = listVacancies();
  const directions = openCategories();
  const years = Math.floor((new Date().getFullYear() - FOUNDED) / 10) * 10;
  const open = new Map(directions.map((group) => [group.category, group.vacancies.length]));

  const groups: VacancyGroup[] = directions.map((group) => ({
    key: group.category,
    label: categoryLabel[group.category][locale],
    line: categoryLine[group.category][locale],
    count: vacancyCount(group.vacancies.length, locale),
    rows: group.vacancies.map((vacancy) => {
      const pay = payOf(vacancy, locale);
      return {
        slug: vacancy.slug,
        href: p(`/careers/${vacancy.slug}`),
        title: shortTitleOf(vacancy, locale),
        fullTitle: vacancy.i18n[locale].title,
        summary: vacancy.i18n[locale].summary,
        meta: [vacancy.employment ? employmentLabel[vacancy.employment][locale] : null, vacancy.location?.[locale] ?? null].filter(Boolean) as string[],
        pay: pay?.figure ? { prefix: pay.prefix, figure: pay.figure, terms: [...pay.terms, pay.probation].filter(Boolean).join(" · ") } : null,
        payNote: pay && !pay.figure ? pay.line : null,
      };
    }),
  }));
  const projects = workplaces.map((item) => ({ ...item, project: getProject(item.slug) })).filter((item) => item.project?.media);

  return (
    <PageShell locale={locale} experience mainClassName="r3-page r4-page cr-page">
      {/* 01 — hero */}
      <CareersHero
        locale={locale}
        href="#positions"
        count={vacancies.length ? vacancyCount(vacancies.length, locale) : null}
        directions={directions.map((group) => ({ key: group.category, label: categoryLabel[group.category][locale], count: group.vacancies.length }))}
      />

      {/* 02 — open vacancies */}
      <section className="r3-sec r3-sec--paper cr-positions" id="positions">
        <div className="r3-shell">
          <div className="r3-head r3-head--split" data-reveal>
            <R3Label>{c.positions.label[locale]}</R3Label>
            <h2 className="r3-title">{c.positions.title[locale]}</h2>
            <p className="r3-lead">{c.positions.text[locale]}</p>
          </div>
          {vacancies.length ? (
            <VacancyList groups={groups} copy={{ all: c.positions.all[locale], allCount: vacancyCount(vacancies.length, locale), filter: c.positions.filter[locale], more: c.positions.more[locale] }} />
          ) : (
            <div className="cr-empty" data-reveal>
              <p className="r3-statement">{c.positions.emptyTitle[locale]}</p>
              <p className="r3-lead">{c.positions.emptyText[locale]}</p>
              <p className="cr-empty__mail"><a className="r3-link r3-link--dark r3-link--lg" href={`mailto:${hrEmail}`}><span data-cr-email>{hrEmail}</span><Icon name="up-right" size={20} /></a></p>
            </div>
          )}
        </div>
      </section>

      {/* 03 — why MEGAPARC */}
      <section className="r3-sec r3-sec--ivory cr-why" id="why">
        <div className="r3-shell">
          <div className="r3-head r3-head--split" data-reveal>
            <R3Label>{c.why.label[locale]}</R3Label>
            <h2 className="r3-title">{c.why.title[locale]}</h2>
            <p className="r3-lead">{c.why.lead[locale]}</p>
          </div>
          <div className="cr-why__grid">
            <ol className="cr-evp">
              {c.why.points.map((point, index) => (
                <li key={point.title.en} data-reveal>
                  <span className="cr-evp__no" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                  <h3 className="cr-evp__title">{point.title[locale]}</h3>
                  <p className="cr-evp__text">{point.text[locale]}</p>
                </li>
              ))}
            </ol>
            <SceneImage scene={careerScenes["m20-ground-hall"]} locale={locale} sizes="(min-width: 1024px) 40vw, 100vw" className="cr-why__media" />
          </div>
          <dl className="cr-figs" data-reveal>
            <div><dd><span className="r3-fig"><span className="r3-fig__n">{years}</span><span className="r3-fig__u">+</span></span></dd><dt>{c.why.figures.years[locale]}</dt></div>
            <div><dd>{portfolioFigures.operating.value[locale]}</dd><dt>{c.why.figures.operating[locale]}</dt></div>
            <div><dd><Figure value={portfolioFigures.area.value[locale]} /></dd><dt>{c.why.figures.area[locale]}</dt></div>
            <div><dd><Figure value={portfolioFigures.land.value[locale]} /></dd><dt>{c.why.figures.land[locale]}</dt></div>
          </dl>
        </div>
      </section>

      {/* 04 — where the work happens */}
      <section className="r3-sec r3-sec--stone cr-projects" id="projects">
        <div className="r3-shell">
          <div className="r3-head r3-head--split" data-reveal>
            <R3Label>{c.projects.label[locale]}</R3Label>
            <h2 className="r3-title">{c.projects.title[locale]}</h2>
            <p className="r3-lead">{c.projects.text[locale]}</p>
          </div>
          <ul className="cr-work">
            {projects.map(({ slug, directions: kinds, project }, index) => {
              const roles = kinds.filter((kind) => open.has(kind));
              return (
                <li key={slug} data-reveal>
                  <Link className="cr-work__link" href={p(`/projects/${slug}`)}>
                    <figure className="cr-work__media">
                      <ArtImage media={project!.media!} variant={index === 0 ? "master" : "card"} alt={`${project!.name} — ${kindLabel[project!.kind][locale]}`} sizes={index === 0 ? "(min-width: 1024px) 58vw, 100vw" : "(min-width: 1024px) 28vw, 100vw"} />
                    </figure>
                    <span className="cr-work__name">{project!.name}</span>
                    <span className="cr-work__meta">{kindLabel[project!.kind][locale]} · {project!.city[locale]}</span>
                  </Link>
                  {c.projects.work[slug] ? <p className="cr-work__line">{c.projects.work[slug][locale]}</p> : null}
                  {roles.length ? (
                    <p className="cr-work__roles">
                      <span className="cr-work__roles-label">{c.projects.roles[locale]}:</span>
                      {roles.map((kind) => (
                        <a key={kind} href="#positions" data-cr-direction={kind}>{categoryLabel[kind][locale]} <span aria-hidden="true">· {String(open.get(kind)).padStart(2, "0")}</span></a>
                      ))}
                    </p>
                  ) : null}
                </li>
              );
            })}
          </ul>
          <div className="r3-actions"><R3Link href={p("/projects")} large>{c.projects.cta[locale]}</R3Link></div>
        </div>
      </section>

      {/* 05 — a statement band on a real development photograph (between the light scenes; the dark footer never meets a dark scene) */}
      <section className="r3-sec r3-sec--ink cr-closing" id="next">
        <div className="r3-shell cr-closing__grid">
          <div className="cr-closing__copy" data-reveal>
            <h2 className="cr-closing__title">{c.closing.title[locale].map((line) => <span key={line}>{line}</span>)}</h2>
            {vacancies.length ? (
              <div className="r3-actions">
                <a className="r3-btn r3-btn--light" href="#positions"><span>{c.closing.cta[locale]}</span><Icon size={16} /></a>
              </div>
            ) : null}
          </div>
          <SceneImage scene={careerScenes["vatra-overview"]} locale={locale} sizes="(min-width: 1024px) 55vw, 100vw" className="cr-closing__media" />
        </div>
      </section>
      {/* 06 — how to apply: the practical last step before the footer */}
      <section className="r3-sec r3-sec--paper cr-apply" id="apply">
        <div className="r3-shell cr-apply__grid">
          <div data-reveal>
            <R3Label>{c.apply.label[locale]}</R3Label>
            <h2 className="r3-title">{c.apply.title[locale]}</h2>
            <div className="cr-mail">
              <p className="cr-mail__label">{c.apply.emailLabel[locale]}</p>
              <p className="cr-mail__row">
                <a className="cr-mail__address" href={`mailto:${hrEmail}`}><span data-cr-email>{hrEmail}</span></a>
                <CopyEmail email={hrEmail} label={c.apply.copy[locale]} done={c.apply.copied[locale]} />
              </p>
              <PrivacyNote locale={locale} className="cr-privacy-note--mail" />
            </div>
          </div>
          <ol className="cr-steps" data-reveal>
            {c.apply.steps[locale].map((step, index) => (
              <li key={step}>
                <span className="cr-steps__no" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                <p>{step}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

    </PageShell>
  );
}
