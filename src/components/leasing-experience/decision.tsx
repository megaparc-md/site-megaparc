import { LgHead, LgSection, ui } from "@/components/leasing-experience/parts";
import { publishable, type LeasingExperience } from "@/data/leasing-experience-model";
import type { SiteLocale } from "@/lib/site-data";

/**
 * LEASE TERMS (section 11), DECISION CHECKS (section 13) and VIEWING JOURNEY
 * (section 16) — OWNER mandate §25, §27–28, §30 / brief §14, §16, §18.
 *   LeaseTerms renders a commercial value only once the OWNER confirms it
 *   (today: none — the old offer's rate is never stored); the topics the
 *   proposal answers are listed without values.
 *   DecisionChecks is the landlord's checklist: what is known, what we verify.
 *   ViewingJourney: six steps, no fixed timeline.
 */

export function LeaseTerms({ x, locale }: { x: LeasingExperience; locale: SiteLocale }) {
  const t = x.terms;
  // confirmed AND approved for the public site — today none (no public rent or payment terms)
  const confirmed = t.rows.filter((row) => row.value && row.publish && publishable(row.evidence));
  return (
    <LgSection id="terms" tone="warm" labelledBy="lg-terms-title" className="lg-terms">
      <div className="lg-terms__grid">
        <LgHead heading={t} locale={locale} id="lg-terms-title" />
        <div className="lg-terms__body" data-reveal>
          {confirmed.length ? (
            <dl className="lg-tech">
              {confirmed.map((row) => (
                <div key={row.key} className="lg-tech__row is-ready">
                  <dt>{row.label[locale]}</dt>
                  <dd><span className="lg-tech__value">{row.value![locale]}</span></dd>
                </div>
              ))}
            </dl>
          ) : null}
          <ul className="lg-terms__covers">
            {t.covers.map((topic) => (
              <li key={topic.en}>{topic[locale]}</li>
            ))}
          </ul>
          <p className="lg-terms__pending">{t.pending[locale]}</p>
        </div>
      </div>
    </LgSection>
  );
}

export function DecisionChecks({ x, locale }: { x: LeasingExperience; locale: SiteLocale }) {
  const c = x.checks;
  return (
    <LgSection id="checks" tone="paper" labelledBy="lg-checks-title" className="lg-checks">
      <LgHead heading={c} locale={locale} id="lg-checks-title" layout="split" />
      <div className="lg-checks__head" aria-hidden="true">
        <span />
        <span>{ui.known[locale]}</span>
        <span>{ui.verify[locale]}</span>
      </div>
      <ol className="lg-checks__rows">
        {c.rows.map((row) => (
          <li key={row.key} className="lg-checks__row" data-reveal>
            <h3>{row.anchor ? <a href={`#${row.anchor}`}>{row.topic[locale]}</a> : row.topic[locale]}</h3>
            <div className="lg-checks__cell">
              <p className="lg-label">{ui.known[locale]}</p>
              <p>{row.known ? row.known[locale] : "—"}</p>
            </div>
            <div className="lg-checks__cell is-verify">
              <p className="lg-label">{ui.verify[locale]}</p>
              <p>{row.check[locale]}</p>
            </div>
          </li>
        ))}
      </ol>
    </LgSection>
  );
}

export function ViewingJourney({ x, locale }: { x: LeasingExperience; locale: SiteLocale }) {
  const j = x.journey;
  return (
    <LgSection id="next" tone="stone" labelledBy="lg-next-title" className="lg-journey">
      <LgHead heading={j} locale={locale} id="lg-next-title" layout="split" />
      <ol className="lg-journey__steps" data-reveal>
        {j.steps.map((step, i) => (
          <li key={step.title.en}>
            <span className="lg-journey__no">{String(i + 1).padStart(2, "0")}</span>
            <h3>{step.title[locale]}</h3>
            <p>{step.text[locale]}</p>
          </li>
        ))}
      </ol>
      <p className="lg-journey__note" data-reveal>{j.note[locale]}</p>
    </LgSection>
  );
}
