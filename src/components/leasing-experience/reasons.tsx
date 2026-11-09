import type { CSSProperties } from "react";
import { LgPhoto } from "@/components/leasing-experience/parts";
import { formatArea } from "@/content/source";
import { T, type LeasingExperience } from "@/data/leasing-experience-model";
import type { AvailableSpace } from "@/data/leasing-inventory";
import type { SiteLocale } from "@/lib/site-data";

/**
 * STATEMENT · THREE REASONS (OWNER "FINAL ART DIRECTION & VISUAL CONVERSION
 * PASS", 2026-11-09, §12 + §24 «one strong photo»): the three reasons for a
 * viewing are now the scene that follows the navigation — one editorial
 * statement set as architecture, «625,7 м². / Два уровня. / Одна концепция.»
 * (the area and the number of levels read from the unit record), the three
 * reasons beside it, then one large real interior where both levels meet at
 * the stair. No new facts: the statement repeats the record; the reasons are
 * the existing lines.
 */

const copy = {
  levels: (n: number, locale: SiteLocale) =>
    locale === "ru" ? (n === 2 ? "Два уровня." : `${n} уровня.`) : locale === "ro" ? (n === 2 ? "Două niveluri." : `${n} niveluri.`) : n === 2 ? "Two levels." : `${n} levels.`,
  concept: T("Un singur concept.", "Одна концепция.", "One concept."),
};

export function Reasons({ x, unit, locale }: { x: LeasingExperience; unit: AvailableSpace; locale: SiteLocale }) {
  const levels = (unit.breakdown ?? []).filter((level) => level.key !== "terrace").length || 2;
  const lines = [`${formatArea(unit.area, locale)}.`, copy.levels(levels, locale), copy.concept[locale]];
  const photo = x.photos.lowerFinish;
  return (
    <section className="lg-statement" aria-labelledby="lg-statement-title">
      <div className="xp-shell lg-statement__head">
        <h2 className="xp-mask lg-statement__title lg-display" id="lg-statement-title" data-reveal>
          {lines.map((line, i) => (
            <span key={line} className="xp-mask__line"><span style={{ "--i": i } as CSSProperties}>{line}</span></span>
          ))}
        </h2>
        <ol className="lg-statement__reasons" aria-label={x.reasons.label[locale]}>
          {x.reasons.items.map((item, i) => (
            <li key={item.key} className="lg-statement__reason" data-reveal style={{ "--i": i } as CSSProperties}>
              <p className="lg-statement__label"><span>{item.no}</span>{item.label[locale]}</p>
              <p className="lg-statement__text">{item.text[locale]}</p>
            </li>
          ))}
        </ol>
      </div>
      {photo ? (
        <figure className="lg-statement__media" data-reveal>
          <LgPhoto photo={photo} locale={locale} sizes="(min-width: 1600px) 1600px, 100vw" className="lg-statement__photo" />
          <figcaption className="xp-shell lg-statement__caption">{photo.alt[locale]}</figcaption>
        </figure>
      ) : null}
    </section>
  );
}
