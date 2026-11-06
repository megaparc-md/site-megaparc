import { LgHead, LgPhoto, LgSection } from "@/components/leasing-experience/parts";
import { publishable, type CostState, type LeasingExperience } from "@/data/leasing-experience-model";
import type { Localized, SiteLocale } from "@/lib/site-data";

/**
 * CAPITAL BASE (section 02) and CAPEX READINESS (section 12) — OWNER Moscova 20
 * mandate §6–9, §15. The capital base answers "what is already paid for"; the
 * readiness ladder answers the CEO / CFO question "how much more before
 * opening?" without inventing a single number.
 */

export function CapitalBase({ x, locale }: { x: LeasingExperience; locale: SiteLocale }) {
  const c = x.capex;
  const ready = c.ready.filter((item) => publishable(item.evidence));
  return (
    <LgSection id="capex" tone="white" labelledBy="lg-capex-title" className="lg-capex">
      <div className="lg-capex__lead">
        <figure className="lg-fig lg-capex__main" data-reveal>
          <LgPhoto photo={x.photos[c.photo]} locale={locale} ratio="3 / 2" sizes="(min-width: 1024px) 58vw, 100vw" />
          <figcaption>{c.photoCaption[locale]}</figcaption>
        </figure>
        <div className="lg-capex__copy">
          <LgHead heading={c} locale={locale} id="lg-capex-title" />
          <div className="lg-capex__body" data-reveal>
            {c.body.map((line) => (
              <p key={line.en}>{line[locale]}</p>
            ))}
            <p className="lg-capex__note">{c.note[locale]}</p>
          </div>
        </div>
      </div>
      <div className="lg-capex__lists">
        <div className="lg-capex__ready" data-reveal>
          <h3 className="lg-label">{c.readyTitle[locale]}</h3>
          <ul className="lg-ticks">
            {ready.map((item) => (
              <li key={item.text.en}>{item.text[locale]}</li>
            ))}
          </ul>
        </div>
        <div className="lg-capex__tenant" data-reveal>
          <h3 className="lg-label">{c.tenantTitle[locale]}</h3>
          <ul className="lg-dashes">
            {c.tenant.map((item) => (
              <li key={item.text.en}>{item.text[locale]}</li>
            ))}
          </ul>
        </div>
        <figure className="lg-fig lg-capex__second" data-reveal>
          <LgPhoto photo={x.photos[c.secondPhoto]} locale={locale} ratio="4 / 5" sizes="(min-width: 1024px) 24vw, 100vw" />
          <figcaption>{c.secondCaption[locale]}</figcaption>
        </figure>
      </div>
    </LgSection>
  );
}

const stateCopy: Record<CostState, Localized> = {
  done: { ro: "În mare parte executat", ru: "В основном выполнено", en: "Largely done" },
  concept: { ro: "După concept", ru: "По концепции", en: "By concept" },
  tenant: { ro: "Chiriașul", ru: "Арендатор", en: "Tenant" },
  "if-needed": { ro: "Dacă e nevoie", ru: "Если требуется", en: "If needed" },
};

export function CapexReadiness({ x, locale }: { x: LeasingExperience; locale: SiteLocale }) {
  const o = x.opening;
  return (
    <LgSection id="opening" tone="white" labelledBy="lg-opening-title" className="lg-opening">
      <LgHead heading={o} locale={locale} id="lg-opening-title" layout="split" />
      <ol className="lg-ladder" data-reveal>
        {o.rows.map((row) => (
          <li key={row.key} className={`lg-ladder__step is-${row.state}`}>
            <span className="lg-ladder__state">{stateCopy[row.state][locale]}</span>
            <h3>{row.label[locale]}</h3>
            <p>{row.note[locale]}</p>
          </li>
        ))}
      </ol>
    </LgSection>
  );
}
