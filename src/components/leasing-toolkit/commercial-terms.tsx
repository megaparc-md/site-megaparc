import { Icon } from "@/components/ui";
import { UtilityIcon } from "@/components/utility-icons";
import { formatAreaExact } from "@/content/source";
import type { AreaLevel } from "@/data/leasing-inventory";
import { commercialCopy as c, euro, m20Commercial, perMonth, rateParts, rentCalculation, type RateLevel } from "@/data/moscova-20-commercial";
import { isProductionEdition, type SiteLocale } from "@/lib/site-data";

/**
 * COMMERCIAL TERMS of Moscova 20 (OWNER mandates R6 / R7, 2026-11-12) — every figure comes from src/data/moscova-20-commercial.ts
 * (the two approved rates) and from the unit record (the areas); nothing is typed here.
 *   · HeroRates — the two rates beside the area in the hero: figure first, the unit quieter, «Без НДС» once;
 *   · CommercialTerms — the block of the digital property dossier and of the Leasing Pack: the two levels as tone cards
 *     (rate · area · per month), the terrace apart (no rate, never «free»), the preliminary total with its wording, the deposit and
 *     the expense regime (OWNER «CORRECTIVE PASS R8» §02, 2026-11-13), the caveats, the indexation paragraph and one action — the
 *     commercial offer. Colours: src/app/r8.css.
 * The offer link: the accepted PDF where it is published; in the OWNER preview — the review candidate, marked as a draft; in the
 * production edition before the OWNER GO — the direct contact (`fallbackHref`), never a dead link.
 */
export function offerLink(locale: SiteLocale, fallbackHref: string): { href: string; pdf: boolean; draft: boolean } {
  const { offer } = m20Commercial;
  if (offer.published) return { href: offer.file[locale], pdf: true, draft: false };
  if (!isProductionEdition) return { href: offer.file[locale], pdf: true, draft: true };
  return { href: fallbackHref, pdf: false, draft: false };
}

export function HeroRates({ locale, className = "" }: { locale: SiteLocale; className?: string }) {
  const levels = Object.keys(m20Commercial.rates) as RateLevel[];
  return (
    <div className={`ct-hero ${className}`.trim()}>
      <dl className="ct-hero__rates" aria-label={c.ratesLabel[locale]}>
        {levels.map((key) => {
          const rate = rateParts(m20Commercial.rates[key], locale);
          return (
            <div key={key} className="ct-hero__rate">
              <dt>{c.level[key][locale]}</dt>
              <dd><strong>{rate.figure}</strong><span>{rate.unit}</span></dd>
            </div>
          );
        })}
      </dl>
      <p className="ct-hero__vat">{c.vat[locale]}</p>
    </div>
  );
}

export function CommercialTerms({ breakdown, locale, fallbackHref, id = "commercial", tone = "paper", heading = "h2", action = true }: { breakdown: AreaLevel[]; locale: SiteLocale; fallbackHref: string; id?: string; tone?: "paper" | "ivory"; heading?: "h2" | "h3"; action?: boolean }) {
  const calc = rentCalculation(breakdown, locale);
  if (!calc.lines.length) return null;
  const link = offerLink(locale, fallbackHref);
  const H = heading;
  return (
    <section className={`ct ct--${tone}`} id={id} aria-labelledby={`${id}-title`}>
      <div className="xp-shell ct__shell">
        <header className="ct__head">
          <p className="ct__kicker">{c.kicker[locale]}</p>
          <H className="ct__title" id={`${id}-title`}>{c.title[locale]}</H>
          <p className="ct__vat">{c.vat[locale]}</p>
        </header>

        {/* the two charged levels and, apart, the terrace — R8: tone cards (ground floor burgundy · lower ground stone · terrace paper) */}
        <div className="ct__levels">
          {calc.lines.map((line) => {
            const rate = rateParts(line.rate, locale);
            return (
              <article key={line.key} className={`ct-level is-${line.key}`}>
                <h3 className="ct-level__name">{line.label}</h3>
                <p className="ct-level__rate"><strong>{rate.figure}</strong><span>{rate.unit}</span></p>
                <dl className="ct-level__rows">
                  <div><dt>{c.area[locale]}</dt><dd>{formatAreaExact(line.area, locale)}</dd></div>
                  <div><dt>{c.monthly[locale]}</dt><dd>{euro(line.monthly, locale)}</dd></div>
                </dl>
              </article>
            );
          })}
          {calc.terrace ? (
            <article className="ct-level is-terrace">
              <h3 className="ct-level__name">{calc.terrace.label}</h3>
              <p className="ct-level__pending">{c.terraceShort[locale]}</p>
              <dl className="ct-level__rows">
                <div><dt>{c.area[locale]}</dt><dd>{formatAreaExact(calc.terrace.area, locale)}</dd></div>
              </dl>
            </article>
          ) : null}
        </div>

        {/* the preliminary total — a calculation, never a contractual price */}
        <div className="ct__total">
          <p className="ct__total-label">{c.total[locale]}</p>
          <p className="ct__total-figure"><strong>{euro(calc.monthly, locale)}</strong><span>{perMonth[locale]} · {c.vatInline[locale]}</span></p>
          <p className="ct__sum" aria-hidden="true">{calc.lines.map((line) => euro(line.monthly, locale)).join(" + ")}</p>
        </div>

        {/* OWNER «CORRECTIVE PASS R8» §02 (2026-11-13): the deposit and the expense regime — three cards, wording from the commercial module */}
        <div className="ct__terms" aria-label={c.termsTitle[locale]}>
          <article className="ct-term is-deposit">
            <h3 className="ct-term__label">{c.depositLabel[locale]}</h3>
            <p className="ct-term__figure"><strong>{c.depositFigure[locale]}</strong><span>{c.depositUnit[locale]}</span></p>
          </article>
          <article className="ct-term is-utilities">
            <h3 className="ct-term__label">{c.utilitiesLabel[locale]}</h3>
            <p className="ct-term__figure is-text"><strong>{c.utilitiesShort[locale]}</strong></p>
            <p className="ct-term__text">{c.otherExpenses[locale]}</p>
          </article>
          <article className="ct-term is-fee">
            <h3 className="ct-term__label">{c.feeLabel[locale]}</h3>
            <p className="ct-term__figure"><strong>{c.feeFigure[locale]}</strong><span>{c.feeUnit[locale]}</span></p>
          </article>
        </div>

        <div className="ct__notes">
          <p>{c.basisNote[locale]}</p>
          <p>{c.vatNote[locale]}</p>
          {calc.terrace ? <p>{c.terraceNote[locale]}</p> : null}
        </div>

        <div className="ct__index">
          <p className="ct__index-title">{c.indexationTitle[locale]}</p>
          <p>{c.indexation[locale]}</p>
        </div>

        {action ? (
          <p className="ct__action">
            <a className="btn" href={link.href} {...(link.pdf ? { download: "" } : { "data-intent": "offer" })}>
              <span>{c.offerCta[locale]}</span>
              {link.pdf ? <UtilityIcon name="download" size={16} /> : <Icon size={16} />}
            </a>
            <span className="ct__action-meta">{link.pdf ? c.offerMeta[locale].replace("{pages}", String(m20Commercial.offer.pages)) : c.offerContactMeta[locale]}{link.draft ? ` · ${c.candidate[locale]}` : ""}</span>
          </p>
        ) : null}
      </div>
    </section>
  );
}
