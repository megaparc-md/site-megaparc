import Link from "next/link";
import { CopyEmail, VacancySticky } from "@/components/careers/apply-tools";
import { PageShell } from "@/components/page-shell";
import { R3Label, R3Link } from "@/components/r3";
import { Icon } from "@/components/ui";
import { relatedVacancies } from "@/content/source";
import { careersCopy, vacancyCopy } from "@/data/careers-copy";
import { applyHref, applySubject, categoryLabel, employmentLabel, payOf, sceneOf, shortTitleOf, themeOf, workModeLabel, type ClosedVacancy, type Vacancy } from "@/lib/careers";
import { vacancyJsonLd } from "@/lib/seo";
import { localePath, type SiteLocale } from "@/lib/site-data";

/**
 * A VACANCY — its own page in RO / RU / EN (OWNER «MEGAPARC CAREERS», 2026-11-25 · §7):
 * A hero (direction · title · the motivating line · key terms · pay · apply) → B your role → C your tasks (grouped) →
 * D what we expect (required · professional skills · an advantage — never mixed) → E how results are measured (only where the
 * source lists indicators) → F what MEGAPARC offers (the pay with every qualifier kept apart: «from», NET, per month, probation;
 * bonuses and reimbursements separately) → G how to apply (the HR address, the mail subject, the notes) → H other open vacancies.
 * Every word comes from the vacancy record (src/data/vacancies.json ← WordPress); nothing is hidden behind a toggle.
 * The apply action opens the candidate's own mail with the subject HR expects — the site sends nothing.
 */
export function VacancyPage({ locale, vacancy }: { locale: SiteLocale; vacancy: Vacancy }) {
  const c = vacancyCopy;
  const t = vacancy.i18n[locale];
  const p = (path: string) => localePath(locale, path);
  const pay = payOf(vacancy, locale);
  const mail = applyHref(vacancy, locale);
  const related = relatedVacancies(vacancy);
  const scene = sceneOf(vacancy);
  // R2: employment and the work mode on rows of their own (R1 joined them with « · », which broke awkwardly on phones)
  const facts = [
    [c.facts.direction[locale], categoryLabel[vacancy.category][locale]],
    vacancy.employment ? [c.facts.employment[locale], employmentLabel[vacancy.employment][locale]] : null,
    vacancy.workMode ? [c.facts.mode[locale], workModeLabel[vacancy.workMode][locale]] : null,
    vacancy.location ? [c.facts.location[locale], vacancy.location[locale]] : null,
  ].filter(Boolean) as [string, string][];
  const requirements = [
    [c.must[locale], t.requirements.must, "must"],
    [c.skills[locale], t.requirements.skills, "skills"],
    [c.plus[locale], t.requirements.plus, "plus"],
  ].filter(([, items]) => (items as string[]).length > 0) as [string, string[], string][];

  return (
    <PageShell locale={locale} mainClassName="r3-page r4-page cr-page cr-vacancy-page">
      {vacancyJsonLd(vacancy, locale).map((data, index) => (
        <script key={index} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />
      ))}

      {/* A — hero */}
      <section className="r3-sec r3-sec--ivory cr-vhero">
        <div className="r3-shell">
          <nav className="cr-crumbs" aria-label={careersCopy.label[locale]}>
            <Link href={p("/careers")}><Icon name="left" size={14} className="cr-crumbs__back" />{careersCopy.label[locale]}</Link>
            <span className="cr-crumbs__sep" aria-hidden="true">/</span>
            <span className="cr-crumbs__here" aria-current="page">{t.title}</span>
          </nav>
          <div className="cr-vhero__grid">
            <div>
              <R3Label>{categoryLabel[vacancy.category][locale]}</R3Label>
              <h1 className="cr-vhero__title">{t.title}</h1>
              <p className="cr-vhero__intro">{t.intro}</p>
            </div>
            <aside className="cr-vhero__side" aria-label={c.conditions[locale]}>
              {pay ? (
                <div className="cr-pay">
                  <p className="cr-pay__label">{c.facts.pay[locale]}</p>
                  {pay.figure ? (
                    <p className="cr-pay__figure">
                      {pay.prefix ? <span className="cr-pay__prefix">{pay.prefix}</span> : null}
                      <span className="cr-pay__n">{pay.figure}</span>
                    </p>
                  ) : null}
                  {pay.figure ? <p className="cr-pay__terms">{[...pay.terms, pay.probation].filter(Boolean).join(" · ")}</p> : <p className="cr-pay__note">{pay.line}</p>}
                </div>
              ) : null}
              <dl className="cr-vfacts">
                {facts.map(([label, value]) => (
                  <div key={label}><dt>{label}</dt><dd>{value}</dd></div>
                ))}
              </dl>
              <div className="cr-vhero__actions">
                <a className="r3-btn r3-btn--dark" href={mail}><span>{c.apply[locale]}</span><Icon size={16} /></a>
                <a className="r3-link r3-link--dark" href="#apply"><span>{c.how[locale]}</span><Icon name="down" size={16} /></a>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* B — the role in focus (R2): the theme of the role, its description and one real MEGAPARC photograph — every page its own */}
      <section className="r3-sec r3-sec--paper cr-focus" id="role">
        <div className="r3-shell cr-focus__grid">
          <figure className="cr-scene cr-focus__media">
            <img src={scene.src} srcSet={`${scene.small} ${scene.smallWidth}w, ${scene.src} ${scene.width}w`} sizes="(min-width: 1024px) 50vw, 100vw" width={scene.width} height={scene.height} alt={scene.alt[locale]} loading="lazy" decoding="async" style={scene.position ? { objectPosition: scene.position } : undefined} />
            <figcaption>{scene.caption[locale]}</figcaption>
          </figure>
          <div className="cr-focus__copy">
            <R3Label>{c.focus[locale]}</R3Label>
            <h2 className="cr-focus__theme">{themeOf(vacancy, locale)}</h2>
            <div className="cr-role__copy">
              {t.role.map((text, index) => <p key={text} className={index === 0 ? "cr-role__first" : "r3-lead"}>{text}</p>)}
            </div>
          </div>
        </div>
      </section>

      {/* C — your tasks */}
      <section className="r3-sec r3-sec--ivory cr-tasks" id="tasks">
        <div className="r3-shell">
          <div className="r3-head"><R3Label>{c.tasks[locale]}</R3Label></div>
          <ol className="cr-groups">
            {t.responsibilities.map((group, index) => (
              <li key={group.title}>
                <span className="cr-groups__no" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                <h2 className="cr-groups__title">{group.title}</h2>
                <ul className="cr-bullets">{group.items.map((item) => <li key={item}>{item}</li>)}</ul>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* D — what we expect */}
      <section className="r3-sec r3-sec--paper cr-expect" id="requirements">
        <div className="r3-shell">
          <div className="r3-head"><R3Label>{c.expect[locale]}</R3Label></div>
          <div className={`cr-cols cr-cols--${requirements.length}`}>
            {requirements.map(([title, items, key]) => (
              <div key={key} className={`cr-col cr-col--${key}`}>
                <h2 className="cr-col__title">{title}</h2>
                <ul className="cr-bullets">{items.map((item) => <li key={item}>{item}</li>)}</ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* E — how results are measured (only where the source lists indicators) */}
      {t.kpi ? (
        <section className="r3-sec r3-sec--ivory cr-kpi" id="results">
          <div className="r3-shell cr-two">
            <div>
              <R3Label>{c.kpi[locale]}</R3Label>
              <p className="r3-lead">{t.kpi.intro}</p>
            </div>
            <ol className="cr-kpis">{t.kpi.items.map((item, index) => <li key={item}><span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span><p>{item}</p></li>)}</ol>
          </div>
        </section>
      ) : null}

      {/* F — what MEGAPARC offers */}
      <section className="r3-sec r3-sec--ink cr-offer" id="offer">
        <div className="r3-shell cr-two">
          <div>
            <R3Label tone="light">{c.offer[locale]}</R3Label>
            {pay ? (
              <div className="cr-pay cr-pay--light">
                <p className="cr-pay__label">{c.pay[locale]}</p>
                {pay.figure ? (
                  <>
                    <p className="cr-pay__figure cr-pay__figure--lg">
                      {pay.prefix ? <span className="cr-pay__prefix">{pay.prefix}</span> : null}
                      <span className="cr-pay__n">{pay.figure}</span>
                    </p>
                    <p className="cr-pay__terms">{[...pay.terms, pay.probation].filter(Boolean).join(" · ")}</p>
                  </>
                ) : <p className="cr-pay__note cr-pay__note--lg">{pay.line}</p>}
              </div>
            ) : null}
          </div>
          <div className="cr-offer__list">
            {vacancy.bonus ? <div className="cr-term"><h2>{c.bonus[locale]}</h2><p>{vacancy.bonus[locale]}</p></div> : null}
            {vacancy.compensation ? <div className="cr-term"><h2>{c.compensation[locale]}</h2><p>{vacancy.compensation[locale]}</p></div> : null}
            <div className="cr-term">
              <h2>{c.conditions[locale]}</h2>
              <ul className="cr-bullets cr-bullets--light">{t.offer.map((item) => <li key={item}>{item}</li>)}</ul>
            </div>
          </div>
        </div>
      </section>

      {/* G — how to apply */}
      <section className="r3-sec r3-sec--ivory cr-apply cr-apply--vacancy" id="apply">
        <div className="r3-shell cr-two">
          <div>
            <R3Label>{c.how[locale]}</R3Label>
            <p className="r3-statement">{c.howText[locale]}</p>
            <div className="r3-actions">
              <a className="r3-btn r3-btn--dark" href={mail}><span>{c.applyLong[locale]}</span><Icon size={16} /></a>
            </div>
          </div>
          <div>
            <dl className="cr-applyfacts">
              <div>
                <dt>{c.email[locale]}</dt>
                <dd className="cr-mail__row">
                  <a className="cr-mail__address" href={`mailto:${vacancy.hrEmail}`}><span data-cr-email>{vacancy.hrEmail}</span></a>
                  <CopyEmail email={vacancy.hrEmail} label={careersCopy.apply.copy[locale]} done={careersCopy.apply.copied[locale]} />
                </dd>
              </div>
              <div>
                <dt>{c.subject[locale]}</dt>
                <dd lang="ro">{applySubject(vacancy)}</dd>
              </div>
            </dl>
            <ul className="cr-bullets cr-notes">{t.apply.map((item) => <li key={item}>{item}</li>)}</ul>
          </div>
        </div>
      </section>

      {/* H — other opportunities (open vacancies only) */}
      <section className="r3-sec r3-sec--stone cr-other" id="other">
        <div className="r3-shell">
          <div className="r3-head"><R3Label>{c.other[locale]}</R3Label></div>
          {related.length ? (
            <ul className="cr-vacancies cr-vacancies--compact">
              {related.map((item) => (
                <li key={item.slug}>
                  <Link className="cr-vacancy" href={p(`/careers/${item.slug}`)}>
                    <span className="cr-vacancy__dir">{categoryLabel[item.category][locale]}</span>
                    <h3 className="cr-vacancy__title">{shortTitleOf(item, locale)}</h3>
                    <p className="cr-vacancy__summary">{item.i18n[locale].summary}</p>
                    <span className="cr-vacancy__more">{careersCopy.positions.more[locale]}<Icon size={16} /></span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : null}
          <div className="r3-actions"><R3Link href={`${p("/careers")}#positions`} large>{c.back[locale]}</R3Link></div>
        </div>
      </section>

      <VacancySticky title={shortTitleOf(vacancy, locale)} meta={pay?.line ?? null} label={c.apply[locale]} href={mail} />
    </PageShell>
  );
}

/** A vacancy that was public and is now paused or closed: its address stays, with no application and no structured data. */
export function ClosedVacancyPage({ locale, vacancy }: { locale: SiteLocale; vacancy: ClosedVacancy }) {
  const c = vacancyCopy;
  const paused = vacancy.status === "paused";
  return (
    <PageShell locale={locale} mainClassName="r3-page r4-page cr-page cr-vacancy-page">
      <section className="r3-sec r3-sec--ivory cr-vhero cr-vhero--closed">
        <div className="r3-shell">
          <nav className="cr-crumbs" aria-label={careersCopy.label[locale]}>
            <Link href={localePath(locale, "/careers")}>{careersCopy.label[locale]}</Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page">{vacancy.title[locale]}</span>
          </nav>
          <R3Label>{(paused ? c.pausedLabel : c.closedLabel)[locale]}</R3Label>
          <h1 className="cr-vhero__title">{vacancy.title[locale]}</h1>
          <p className="r3-statement">{(paused ? c.pausedTitle : c.closedTitle)[locale]}</p>
          <p className="r3-lead">{(paused ? c.pausedText : c.closedText)[locale]}</p>
          <div className="r3-actions"><R3Link href={`${localePath(locale, "/careers")}#positions`} large>{c.back[locale]}</R3Link></div>
        </div>
      </section>
    </PageShell>
  );
}
