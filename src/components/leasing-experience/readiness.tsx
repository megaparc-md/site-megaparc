import { LgHead, LgPhoto, LgSection } from "@/components/leasing-experience/parts";
import { publishable, type LeasingExperience, type TechRow, type TechState } from "@/data/leasing-experience-model";
import type { Localized, SiteLocale } from "@/lib/site-data";

/**
 * ACCESS AND LOGISTICS (section 07), ENGINEERING READINESS (section 08) and
 * CONFIRMED VS TO CONFIRM (section 09) — OWNER mandate §11, §18–19 / brief
 * §12–13. Each row says plainly whether something is in place today, stays
 * with the tenant, or is confirmed for the tenant's format. Conflicting
 * sources (extraction) are never shown as ready.
 */

/** The readiness word beside a value; a measured fact (clear height) carries none. */
const stateCopy: Record<TechState, Localized | null> = {
  ready: { ro: "Există", ru: "Есть", en: "In place" },
  tenant: { ro: "Chiriașul", ru: "Арендатор", en: "Tenant" },
  confirm: { ro: "Se clarifică", ru: "Уточняем", en: "To confirm" },
  fact: null,
};

/** A row renders when its value is publishable or it is honestly marked as being confirmed. */
const visible = (row: TechRow) => publishable(row.evidence) || row.state === "confirm";

function TechList({ rows, locale, className = "" }: { rows: TechRow[]; locale: SiteLocale; className?: string }) {
  return (
    <dl className={`lg-tech ${className}`.trim()}>
      {rows.map((row) => {
        const state = stateCopy[row.state];
        return (
          <div key={row.key} className={`lg-tech__row is-${row.state}`}>
            <dt>{row.label[locale]}</dt>
            <dd>
              <span className="lg-tech__value">{row.value[locale]}</span>
              {state ? <span className="lg-tech__state">{state[locale]}</span> : null}
            </dd>
          </div>
        );
      })}
    </dl>
  );
}

export function AccessAndLogistics({ x, locale }: { x: LeasingExperience; locale: SiteLocale }) {
  const a = x.access;
  return (
    <LgSection id="access" tone="warm" labelledBy="lg-access-title" className="lg-access">
      <div className="lg-access__grid">
        <figure className="lg-fig lg-access__media" data-reveal>
          <LgPhoto photo={x.photos[a.photo]} locale={locale} ratio="4 / 3" sizes="(min-width: 1024px) 40vw, 100vw" />
          <figcaption>{a.photoCaption[locale]}</figcaption>
        </figure>
        <div className="lg-access__copy">
          <LgHead heading={a} locale={locale} id="lg-access-title" />
          <div data-reveal>
            <TechList rows={a.rows.filter(visible)} locale={locale} />
          </div>
        </div>
      </div>
    </LgSection>
  );
}

export function EngineeringReadiness({ x, locale }: { x: LeasingExperience; locale: SiteLocale }) {
  const e = x.engineering;
  // two lists read top to bottom, column by column (an odd count leaves the gap at the end, not mid-page)
  const rows = e.rows.filter(visible);
  const half = Math.ceil(rows.length / 2);
  return (
    <LgSection id="engineering" tone="white" labelledBy="lg-engineering-title" className="lg-engineering">
      <LgHead heading={e} locale={locale} id="lg-engineering-title" layout="split" />
      <div className="lg-tech-cols" data-reveal>
        <TechList rows={rows.slice(0, half)} locale={locale} />
        <TechList rows={rows.slice(half)} locale={locale} />
      </div>
      <p className="lg-engineering__note" data-reveal>{e.note[locale]}</p>
    </LgSection>
  );
}

export function ConfirmedVsToConfirm({ x, locale }: { x: LeasingExperience; locale: SiteLocale }) {
  const l = x.ledger;
  const known = l.known.filter((item) => publishable(item.evidence));
  return (
    <LgSection id="known" tone="paper" labelledBy="lg-known-title" className="lg-known">
      <LgHead heading={l} locale={locale} id="lg-known-title" />
      <div className="lg-known__grid">
        <div className="lg-known__col is-known" data-reveal>
          <h3><span>{l.knownTitle[locale]}</span><small>{known.length}</small></h3>
          <ul>
            {known.map((item) => (
              <li key={item.text.en}>{item.text[locale]}</li>
            ))}
          </ul>
        </div>
        <div className="lg-known__col is-confirm" data-reveal>
          <h3><span>{l.confirmTitle[locale]}</span><small>{l.confirm.length}</small></h3>
          <ul>
            {l.confirm.map((item) => (
              <li key={item.text.en}>{item.text[locale]}</li>
            ))}
          </ul>
        </div>
      </div>
    </LgSection>
  );
}
