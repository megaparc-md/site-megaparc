import type { CSSProperties } from "react";
import Link from "next/link";
import { LgPhoto, splitArea, ui } from "@/components/leasing-experience/parts";
import { Icon } from "@/components/ui";
import { availabilityLabel, availabilityOf, formatArea, viewingEnabled, type ProjectEntry } from "@/content/source";
import type { LeasingExperience } from "@/data/leasing-experience-model";
import type { AvailableSpace } from "@/data/leasing-inventory";
import { localePath, type SiteLocale } from "@/lib/site-data";

/**
 * SCENE 01 — HERO · the emotional entrance (OWNER "FINAL ART DIRECTION & VISUAL
 * CONVERSION PASS", 2026-11-09, §3–4). The real facade frame carries 60–75 % of
 * the first screen: on wide screens it fills the right of the screen up to the
 * viewport edge, the type stands on warm ivory beside it — no box over the
 * building, the neighbour's lettering stays outside the crop (crop only). Only:
 * MOSCOVA 20 · «Пространство для следующего шага вашего бизнеса.» · the place ·
 * 625,7 м² as display figure · the status · «Капитальная база уже готова.» ·
 * ЗАПРОСИТЬ ПРОСМОТР / ПОСМОТРЕТЬ ПЛАНЫ. Area and status are read from the unit
 * record (M20-01). The photograph stays at ≈ 1× of its 1278 px source: the hero
 * height is capped so it is never stretched.
 *
 * Motion (CSS only, off under reduced motion): a soft mask reveal of the
 * photograph, a slow 1.00 → 1.03 scale, a few pixels of parallax (data-depth),
 * the lines and the figure rising in turn, the arrow moving on the actions.
 */
export function LeasingHero({ x, unit, project, locale }: { x: LeasingExperience; unit: AvailableSpace; project: ProjectEntry; locale: SiteLocale }) {
  const state = availabilityOf(unit).key;
  const open = viewingEnabled(unit);
  const area = splitArea(formatArea(unit.area, locale));
  return (
    <section className="lg-hero" aria-labelledby="lg-hero-title">
      <div className="lg-hero__grid">
        <div className="lg-hero__text">
          <Link href={localePath(locale, "/leasing")} className="pp2-back lg-hero__back"><Icon name="left" /> {ui.leasing[locale]}</Link>
          <p className="lg-hero__place lg-rise" style={{ "--d": 0 } as CSSProperties}>{x.hero.place[locale]}</p>
          <h1 className="lg-hero__h1" id="lg-hero-title">
            <span className="lg-hero__name lg-rise" style={{ "--d": 1 } as CSSProperties}>{project.name}</span>
            <span className="lg-hero__title lg-rise" style={{ "--d": 2 } as CSSProperties}>{x.hero.title[locale]}</span>
          </h1>
          <div className="lg-hero__offer lg-rise" style={{ "--d": 3 } as CSSProperties}>
            <p className="lg-hero__area">
              <strong>{area.figure}</strong>
              <span className="lg-hero__unit">{area.unit}</span>
            </p>
            <p className="lg-hero__offered">{x.hero.offer[locale]}</p>
            <p className={`lg-hero__status is-${state}`}><i aria-hidden="true" />{availabilityLabel(unit, locale)}</p>
          </div>
          <p className="lg-hero__support lg-rise" style={{ "--d": 4 } as CSSProperties}>{x.hero.support[locale]}</p>
          <div className="lg-hero__actions lg-rise" style={{ "--d": 5 } as CSSProperties}>
            <a className="btn" href="#viewing" data-intent="viewing">
              <span>{open ? ui.viewing[locale] : ui.waitlist[locale]}</span>
              <Icon />
            </a>
            <a className="pm-link" href="#plans">
              <span>{ui.plansSee[locale]}</span>
              <Icon />
            </a>
          </div>
        </div>
        <figure className="lg-hero__media" data-depth="10">
          <LgPhoto photo={x.photos[x.hero.photo]} phone={x.photos[x.hero.phonePhoto]} locale={locale} priority sizes="(min-width: 1024px) 64vw, 100vw" className="lg-hero__photo" />
        </figure>
      </div>
    </section>
  );
}
