import Link from "next/link";
import { accentLast } from "@/components/accent";
import { LgPhoto } from "@/components/leasing-experience/parts";
import { R3Label } from "@/components/r3";
import { Icon } from "@/components/ui";
import { spaceArea, spacesFor } from "@/content/source";
import { company, contactLinks } from "@/data/demo-content";
import { moscova20Experience } from "@/data/leasing-experience-moscova-20";
import { consultCopy, consultHref, producerBlock as c } from "@/data/producer-retail";
import { isProductionEdition, localePath, type SiteLocale } from "@/lib/site-data";

/**
 * LEASING · «ДЛЯ ПРОИЗВОДИТЕЛЕЙ И БРЕНДОВ» (OWNER «PRODUCER DIRECT RETAIL STRATEGY R10», 2026-11-13, §02 / §05 / §06).
 * A light editorial scene of the Leasing page: the statement «Ваш продукт. Ваша полка. Ваш покупатель.» and its lead, the six
 * advantages of a manufacturer's own store as one numbered typographic sequence (hairlines, not a card grid), the balancing line
 * (an own store is not always more profitable — compared on the producer's figures), then ONE expressive card: Moscova 20 as the
 * concrete example — the OWNER-approved entrance photograph beside a graphite panel with the scenario link and the consultation
 * action. MEGAPARC appears as the owner and landlord of the premises, never as the operator of the store or a financial adviser.
 * The area is read from the unit record M20-01; the action is the confirmed e-mail with the subject (no form, nothing «sent»).
 */
export function ProducerRetail({ locale }: { locale: SiteLocale }) {
  const unit = spacesFor("moscova-20")[0] ?? null;
  const area = unit ? spaceArea(unit, locale) : null;
  const photo = moscova20Experience.photos.entranceProcessed;
  // three short sentences — one per line, the accent on the buyer (src/lib/emphasis.ts)
  const lines = c.title[locale].split(/(?<=\.)\s+/);
  const scenario = `${localePath(locale, "/projects/moscova-20")}/?format=producer#format`;
  return (
    <section className="r3-sec r3-sec--paper r10-prod" id="producers" aria-labelledby="r10-prod-title">
      <div className="r3-shell">
        <div className="r10-prod__head" data-reveal>
          <R3Label>{c.label[locale]}</R3Label>
          <h2 className="r3-title r10-prod__title" id="r10-prod-title">{lines.map((line, i) => <span key={line} className="r10-prod__line">{accentLast(lines, i, line)}</span>)}</h2>
          <p className="r3-lead r10-prod__lead">{c.lead[locale]}</p>
        </div>

        <ol className="r10-prod__list" data-reveal>
          {c.advantages.map((item, i) => (
            <li key={item.title.en} className="r10-prod__item">
              <span className="r10-prod__no">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="r10-prod__name">{item.title[locale]}</h3>
              <p className="r10-prod__text">{item.text[locale]}</p>
            </li>
          ))}
        </ol>
        <p className="r10-prod__balance" data-reveal>{c.balance[locale]}</p>

        {/* the one expressive card — the concrete example on a real MEGAPARC property */}
        {unit && area ? (
          <article className="r10-example" data-reveal>
            <Link href={scenario} className="r10-example__media" tabIndex={-1} aria-hidden="true">
              <LgPhoto photo={photo} locale={locale} sizes="(min-width: 1024px) 56vw, 100vw" className="r10-example__photo" />
            </Link>
            <div className="r10-example__panel">
              <p className="r10-example__label">{c.exampleLabel[locale]}</p>
              <p className="r10-example__text">{c.exampleText[locale].replace("{area}", area)}</p>
              <Link className="r10-example__link" href={scenario}><span>{c.exampleLink[locale]}</span><Icon size={18} /></Link>
              <div className="r10-example__actions">
                <a className="btn btn--light r10-example__cta" href={consultHref(locale)} data-intent="producer-store"><span>{consultCopy.cta[locale]}</span><Icon name="up-right" /></a>
                <p className="r10-example__note">
                  {consultCopy.note[locale]} <a href={contactLinks.mobile}>{company.mobile.value[locale]}</a> · <a href={contactLinks.landline}>{company.landline.value[locale]}</a>
                </p>
              </div>
            </div>
          </article>
        ) : null}

        <div className="r10-prod__foot" data-reveal>
          <p className="r10-prod__role">{c.role[locale]}</p>
          {/* the CFO-model prototype is OWNER preview only until its methodology is verified (R10 §04) */}
          {isProductionEdition ? null : <Link className="r10-prod__proto" href={`${localePath(locale, "/producer-economics")}/`}>{c.prototype[locale]}</Link>}
        </div>
      </div>
    </section>
  );
}
