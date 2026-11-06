import type { LeasingExperience } from "@/data/leasing-experience-model";
import type { SiteLocale } from "@/lib/site-data";

/**
 * THREE REASONS (OWNER "LOCATION INTELLIGENCE + VIEWING CONVERSION PASS",
 * 2026-11-06): visible at once, right after the decision bar — 01 location ·
 * 02 ready base · 03 flexibility. One line each; the scenes below prove them.
 */
export function Reasons({ x, locale }: { x: LeasingExperience; locale: SiteLocale }) {
  return (
    <section className="lg-reasons" aria-label={x.reasons.label[locale]}>
      <ol className="xp-shell lg-reasons__list">
        {x.reasons.items.map((item) => (
          <li key={item.key} className="lg-reasons__item" data-reveal>
            <p className="lg-reasons__label"><span>{item.no}</span>{item.label[locale]}</p>
            <p className="lg-reasons__text">{item.text[locale]}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
