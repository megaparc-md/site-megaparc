import Link from "next/link";
import { CopyEmail } from "@/components/careers/apply-tools";
import { VacancyList, type VacancyFilter, type VacancyRow } from "@/components/careers/vacancy-list";
import { CareersHero } from "@/components/careers-moment";
import { PageShell } from "@/components/page-shell";
import { ArtImage } from "@/components/primitives";
import { Figure, R3Label, R3Link } from "@/components/r3";
import { Icon } from "@/components/ui";
import { getProject, kindLabel, listVacancies } from "@/content/source";
import { careersCopy } from "@/data/careers-copy";
import { portfolioFigures } from "@/data/demo-content";
import { categoryLabel, categoryLine, employmentLabel, hrEmail, openCategories, payOf, vacancyCount } from "@/lib/careers";
import { localePath, type SiteLocale } from "@/lib/site-data";

/**
 * CAREERS — the employer-brand page (OWNER «MEGAPARC CAREERS — PREMIUM EMPLOYER BRAND & WORDPRESS CMS», 2026-11-25).
 * Eight scenes: hero · manifesto · MEGAPARC as an employer · professional directions · open vacancies · real projects ·
 * how to apply · closing. Everything about vacancies — the count, the directions, the filter, the rows — is derived from the
 * one list of open vacancies (src/content/source.ts ← src/data/vacancies.json ← WordPress): nothing is typed twice.
 * Facts only: the figures come from the site's confirmed portfolio data; no team portraits, testimonials or culture claims.
 * The same page in both editions; only the hero image differs (the concept film never reaches production).
 */

/** Year MEGAPARC was founded (heritage hierarchy, OWNER 2026-10-08) — «more than 20 years» is derived from it. */
const FOUNDED = 2005;
/** Real MEGAPARC properties shown in «Real projects. Real contribution.» — photographs and names from the project register. */
const featured = ["dacia-31", "vatra", "moscova-20"] as const;

export function CareersPage({ locale }: { locale: SiteLocale }) {
  const c = careersCopy;
  const p = (path: string) => localePath(locale, path);
  const vacancies = listVacancies();
  const groups = openCategories();
  const years = Math.floor((new Date().getFullYear() - FOUNDED) / 10) * 10;

  const rows: VacancyRow[] = vacancies.map((vacancy) => ({
    slug: vacancy.slug,
    href: p(`/careers/${vacancy.slug}`),
    title: vacancy.i18n[locale].title,
    category: vacancy.category,
    categoryLabel: categoryLabel[vacancy.category][locale],
    summary: vacancy.i18n[locale].summary,
    meta: [vacancy.employment ? employmentLabel[vacancy.employment][locale] : null, vacancy.location?.[locale] ?? null].filter(Boolean) as string[],
    pay: payOf(vacancy, locale)?.line ?? null,
  }));
  const filters: VacancyFilter[] = groups.map((group) => ({ key: group.category, label: categoryLabel[group.category][locale], count: vacancyCount(group.vacancies.length, locale) }));
  const projects = featured.map((slug) => getProject(slug)).filter((project) => project?.media);

  return (
    <PageShell locale={locale} variant="overlay" experience mainClassName="r3-page r4-page cr-page">
      {/* 01 — cinematic hero */}
      <CareersHero locale={locale} href="#positions" count={vacancies.length ? vacancyCount(vacancies.length, locale) : null} />

      {/* 02 — employer manifesto */}
      <section className="r3-sec r3-sec--ivory cr-manifesto" id="manifesto">
        <div className="r3-shell cr-manifesto__grid">
          <div data-reveal>
            <R3Label>{c.manifesto.label[locale]}</R3Label>
            <h2 className="r3-title cr-manifesto__title">{c.manifesto.title[locale]}</h2>
          </div>
          <div className="cr-manifesto__copy" data-reveal>
            <p className="r3-statement">{c.manifesto.lead[locale]}</p>
            {c.manifesto.body[locale].map((text) => <p key={text} className="r3-lead">{text}</p>)}
          </div>
        </div>
      </section>

      {/* 03 — MEGAPARC as an employer: confirmed facts */}
      <section className="r3-sec r3-sec--paper cr-employer" id="employer">
        <div className="r3-shell">
          <div className="r3-head r3-head--split" data-reveal>
            <R3Label>{c.employer.label[locale]}</R3Label>
            <h2 className="r3-title">{c.employer.title[locale]}</h2>
          </div>
          <dl className="cr-figs" data-reveal>
            <div><dd><span className="r3-fig"><span className="r3-fig__n">{years}</span><span className="r3-fig__u">+</span></span></dd><dt>{c.employer.figures.years[locale]}</dt></div>
            <div><dd>{portfolioFigures.operating.value[locale]}</dd><dt>{c.employer.figures.operating[locale]}</dt></div>
            <div><dd><Figure value={portfolioFigures.area.value[locale]} /></dd><dt>{c.employer.figures.area[locale]}</dt></div>
            <div><dd><Figure value={portfolioFigures.land.value[locale]} /></dd><dt>{c.employer.figures.land[locale]}</dt></div>
          </dl>
          <ol className="cr-points">
            {c.employer.points.map((point) => (
              <li key={point.title.en} data-reveal>
                <h3>{point.title[locale]}</h3>
                <p>{point.text[locale]}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 04 — professional directions, derived from the open vacancies */}
      {groups.length ? (
        <section className="r3-sec r3-sec--ink cr-directions" id="directions">
          <div className="r3-shell">
            <div className="r3-head r3-head--light r3-head--split" data-reveal>
              <R3Label tone="light">{c.directions.label[locale]}</R3Label>
              <h2 className="r3-title">{c.directions.title[locale]}</h2>
            </div>
            <ol className="cr-dirs">
              {groups.map((group) => (
                <li key={group.category} data-reveal>
                  <a href="#positions" data-cr-direction={group.category} aria-label={`${categoryLabel[group.category][locale]} — ${c.directions.show[locale]}`}>
                    <span className="cr-dirs__name">{categoryLabel[group.category][locale]}</span>
                    <span className="cr-dirs__line">{categoryLine[group.category][locale]}</span>
                    <span className="cr-dirs__roles">{group.vacancies.map((vacancy) => vacancy.i18n[locale].title).join(" · ")}</span>
                    <span className="cr-dirs__count" aria-hidden="true">{String(group.vacancies.length).padStart(2, "0")}<Icon size={18} /></span>
                  </a>
                </li>
              ))}
            </ol>
          </div>
        </section>
      ) : null}

      {/* 05 — open vacancies */}
      <section className="r3-sec r3-sec--ivory cr-positions" id="positions">
        <div className="r3-shell">
          <div className="r3-head r3-head--split" data-reveal>
            <R3Label>{c.positions.label[locale]}</R3Label>
            <h2 className="r3-title">{c.positions.title[locale]}</h2>
            <p className="r3-lead">{c.positions.text[locale]}</p>
          </div>
          {vacancies.length ? (
            <VacancyList rows={rows} filters={filters} copy={{ all: c.positions.all[locale], allCount: vacancyCount(vacancies.length, locale), filter: c.positions.filter[locale], more: c.positions.more[locale] }} />
          ) : (
            <div className="cr-empty" data-reveal>
              <p className="r3-statement">{c.positions.emptyTitle[locale]}</p>
              <p className="r3-lead">{c.positions.emptyText[locale]}</p>
              <p className="cr-empty__mail"><a className="r3-link r3-link--dark r3-link--lg" href={`mailto:${hrEmail}`}><span data-cr-email>{hrEmail}</span><Icon name="up-right" size={20} /></a></p>
            </div>
          )}
        </div>
      </section>

      {/* 06 — real projects, real contribution */}
      <section className="r3-sec r3-sec--stone cr-projects" id="projects">
        <div className="r3-shell">
          <div className="r3-head r3-head--split" data-reveal>
            <R3Label>{c.projects.label[locale]}</R3Label>
            <h2 className="r3-title">{c.projects.title[locale]}</h2>
            <p className="r3-lead">{c.projects.text[locale]}</p>
          </div>
          <ul className="cr-work">
            {projects.map((project, index) => (
              <li key={project!.slug} data-reveal>
                <Link href={p(`/projects/${project!.slug}`)}>
                  <figure className="cr-work__media">
                    <ArtImage media={project!.media!} variant={index === 0 ? "master" : "card"} alt={`${project!.name} — ${kindLabel[project!.kind][locale]}`} sizes={index === 0 ? "(min-width: 1024px) 58vw, 100vw" : "(min-width: 1024px) 28vw, 100vw"} />
                  </figure>
                  <span className="cr-work__name">{project!.name}</span>
                  <span className="cr-work__meta">{kindLabel[project!.kind][locale]} · {project!.city[locale]}</span>
                </Link>
              </li>
            ))}
          </ul>
          <div className="r3-actions"><R3Link href={p("/projects")} large>{c.projects.cta[locale]}</R3Link></div>
        </div>
      </section>

      {/* 07 — how to apply */}
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

      {/* 08 — closing */}
      <section className="r3-sec r3-sec--ivory cr-closing" id="next">
        <div className="r3-shell cr-closing__grid" data-reveal>
          <h2 className="cr-closing__title">{c.closing.title[locale]}</h2>
          <div>
            <p className="r3-lead">{c.closing.text[locale]}</p>
            <div className="r3-actions">
              <a className="r3-btn r3-btn--dark" href="#positions"><span>{c.closing.cta[locale]}</span><Icon size={16} /></a>
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
