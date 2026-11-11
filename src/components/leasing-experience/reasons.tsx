import type { CSSProperties } from "react";
import type { TemplateOffer } from "@/components/leasing-experience/offer";
import { LgPhoto, withArea } from "@/components/leasing-experience/parts";
import { T, type LeasingExperience } from "@/data/leasing-experience-model";
import type { SiteLocale } from "@/lib/site-data";

/**
 * STATEMENT ON ONE STRONG INTERIOR (OWNER "FINAL ART DIRECTION & VISUAL
 * CONVERSION PASS", 2026-11-09, §12 + §24 «one strong photo»): «625,7 м². /
 * Два уровня. / Одна концепция.» set as architecture on the interior where both
 * levels meet at the stair (the area and the number of levels read from the
 * unit record). Card & air pass (same day): the three reasons gave way to the
 * summary cards right after the navigation, so this scene is the photograph
 * and the statement only.
 */

const copy = {
  levels: (n: number, locale: SiteLocale) =>
    locale === "ru" ? (n === 2 ? "Два уровня." : `${n} уровня.`) : locale === "ro" ? (n === 2 ? "Două niveluri." : `${n} niveluri.`) : n === 2 ? "Two levels." : `${n} levels.`,
  concept: T("Un singur concept.", "Одна концепция.", "One concept."),
};

export function Reasons({ x, offer, locale }: { x: LeasingExperience; offer: TemplateOffer; locale: SiteLocale }) {
  const levels = offer.breakdown.filter((level) => level.key !== "terrace").length || 2;
  // a dataset's own statement («{area}» = the hero figure); the master reads it from the unit record
  const lines = x.statement ? x.statement.lines.map((line) => withArea(line[locale], offer.figure)) : [`${offer.figure}.`, copy.levels(levels, locale), copy.concept[locale]];
  // OWNER photography replacement 2026-11-11: the OWNER-approved lower-ground frame with the staircase (two levels, one concept) where the dataset has it
  const photo = x.statement ? (x.statement.photo ? x.photos[x.statement.photo] : undefined) : (x.photos.intLowerStairHall ?? x.photos.lowerFinish);
  return (
    <section className="lg-statement" aria-labelledby="lg-statement-title">
      <div className="xp-shell lg-statement__head">
        <h2 className="xp-mask lg-statement__title lg-display" id="lg-statement-title" data-reveal>
          {lines.map((line, i) => (
            <span key={line} className="xp-mask__line"><span style={{ "--i": i } as CSSProperties}>{line}</span></span>
          ))}
        </h2>
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
