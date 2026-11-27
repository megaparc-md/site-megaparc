import Link from "next/link";
import { Icon } from "@/components/ui";
import { visitCopy } from "@/components/visit-planner/copy";
import { visitHref } from "@/components/visit-planner/href";
import { UtilityIcon } from "@/components/utility-icons";
import { formatAreaExact } from "@/content/source";
import type { AreaLevel } from "@/data/leasing-inventory";
import { commercialCopy as c, euro, individualOfferHref, m20Commercial, perMonth, rateParts, rentCalculation, type RateLevel } from "@/data/moscova-20-commercial";
import { isProductionEdition, type SiteLocale } from "@/lib/site-data";

/**
 * COMMERCIAL TERMS of Moscova 20 (OWNER mandates R6 / R7, 2026-11-12) — every figure comes from src/data/moscova-20-commercial.ts
 * (the two approved rates) and from the unit record (the areas); nothing is typed here.
 *   · HeroRates — the two rates in the Leasing Pack hero: figure first, the unit quieter, «Без НДС» once (OWNER R9 §01, 2026-11-13:
 *     never in the property-page hero — the page states the rates in «Коммерческие условия» only);
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

/** The basis of the preliminary calculation with its areas (OWNER R2 decision F): the charged levels' full area and their commercial
 *  (sales) area, summed from the unit record; the generic wording when a level has no commercial area on record. */
function basisNote(breakdown: AreaLevel[], charged: string[], locale: SiteLocale): string {
  const levels = breakdown.filter((level) => charged.includes(level.key));
  if (!levels.length || levels.some((level) => !level.useful)) return c.basisNote[locale];
  const sum = (values: number[]) => Math.round(values.reduce((a, b) => a + b, 0) * 100) / 100;
  return c.basisNoteAreas[locale]
    .replace("{levels}", formatAreaExact(sum(levels.map((level) => level.area)), locale))
    .replace("{halls}", formatAreaExact(sum(levels.map((level) => level.useful ?? 0)), locale));
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
  const planner = visitHref(locale, m20Commercial.project, "terms");
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
          <p>{basisNote(breakdown, calc.lines.map((line) => line.key), locale)}</p>
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
            {/* addendum §5 (2026-11-13): the individual offer is a conversation — the confirmed e-mail with its subject, never the same universal PDF */}
            {link.pdf ? <a className="pm-link ct__individual" href={individualOfferHref(locale)} data-intent="individual-offer"><span>{c.individualCta[locale]}</span></a> : null}
            {/* OWNER «VISIT PLANNER & COMMERCIAL DESK V1» (stage 1): from the terms straight to a date and a time — the OWNER preview only */}
            {planner ? <Link className="pm-link ct__individual" href={planner} data-visit-planner=""><span>{visitCopy[locale].entry.cta}</span></Link> : null}
          </p>
        ) : null}
      </div>
    </section>
  );
}
