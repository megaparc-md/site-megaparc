import { LgHead, LgSection, ui } from "@/components/leasing-experience/parts";
import type { FitLevel, LeasingExperience } from "@/data/leasing-experience-model";
import type { Localized, SiteLocale } from "@/lib/site-data";

/**
 * TENANT FIT (section 03) — OWNER mandate §10 / brief §8. An editorial
 * compatibility system: per business format the verdict, why it may fit and
 * what must be checked. No icons, no cards, never "suits everyone"; a format
 * that needs technical verification says so in the verdict itself.
 */

const verdict: Record<FitLevel, Localized> = {
  strong: { ro: "Se potrivește bine", ru: "Хорошо подходит", en: "A strong fit" },
  good: { ro: "Se potrivește", ru: "Подходит", en: "A fit" },
  check: { ro: "Necesită verificare tehnică", ru: "Требует технической проверки", en: "Needs a technical check" },
};

export function TenantFit({ x, locale }: { x: LeasingExperience; locale: SiteLocale }) {
  const f = x.fit;
  return (
    <LgSection id="fit" tone="warm" labelledBy="lg-fit-title" className="lg-fit">
      <LgHead heading={f} locale={locale} id="lg-fit-title" layout="split" />
      <ol className="lg-fit__rows">
        {f.rows.map((row) => (
          <li key={row.key} className={`lg-fit__row is-${row.level}`} data-reveal>
            <div className="lg-fit__use">
              <h3>{row.use[locale]}</h3>
              <p className="lg-fit__verdict">{verdict[row.level][locale]}</p>
            </div>
            <div className="lg-fit__col">
              <p className="lg-label">{ui.why[locale]}</p>
              <ul>
                {row.reasons.map((reason) => (
                  <li key={reason.en}>{reason[locale]}</li>
                ))}
              </ul>
            </div>
            <div className="lg-fit__col lg-fit__col--check">
              <p className="lg-label">{ui.check[locale]}</p>
              <ul>
                {row.checks.map((check) => (
                  <li key={check.en}>{check[locale]}</li>
                ))}
              </ul>
              {row.note ? <p className="lg-fit__note">{row.note[locale]}</p> : null}
            </div>
          </li>
        ))}
      </ol>
    </LgSection>
  );
}
