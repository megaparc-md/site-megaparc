import Link from "next/link";
import { LgPhoto, ui } from "@/components/leasing-experience/parts";
import { Icon } from "@/components/ui";
import { availabilityLabel, availabilityOf, formatArea, viewingEnabled, type ProjectEntry } from "@/content/source";
import type { LeasingExperience } from "@/data/leasing-experience-model";
import type { AvailableSpace } from "@/data/leasing-inventory";
import { localePath, type SiteLocale } from "@/lib/site-data";

/**
 * SCENE 01 — HERO · DESIRE (OWNER compact brief §2; final viewing pass: only the
 * name, the line, the place, the area, the status, «Капитальная база уже готова.
 * Пространство адаптируется под ваш формат.», ЗАПРОСИТЬ ПРОСМОТР and ПОСМОТРЕТЬ
 * ПЛАНЫ). The building carries the first
 * screen: a crop of the real facade frame (glazing, terrace, steps and ramp,
 * pavement) without the neighbouring building's lettering, inside the shell
 * (never upscaled past ~6 %). Above it, one compact line of text: the name and
 * the positioning, then the place, the marketed area, the status (all from the
 * unit record), the capital-base line and two actions. Phones: the photograph
 * first (4:3 crop), then Moscova 20 · area · status · action.
 */
export function LeasingHero({ x, unit, project, locale }: { x: LeasingExperience; unit: AvailableSpace; project: ProjectEntry; locale: SiteLocale }) {
  const state = availabilityOf(unit).key;
  const open = viewingEnabled(unit);
  return (
    <section className="lg-hero" aria-labelledby="lg-hero-title">
      <div className="xp-shell lg-hero__text">
        <Link href={localePath(locale, "/leasing")} className="pp2-back lg-hero__back"><Icon name="left" /> {ui.leasing[locale]}</Link>
        <h1 className="lg-hero__h1" id="lg-hero-title">
          <span className="lg-hero__name">{project.name}</span>
          <span className="lg-hero__title">{x.hero.title[locale]}</span>
        </h1>
        <div className="lg-hero__offer">
          <p className="lg-hero__place">{x.hero.place[locale]}</p>
          <p className="lg-hero__area"><strong>{formatArea(unit.area, locale)}</strong> <span>{x.hero.offer[locale]}</span></p>
          <p className={`lg-hero__status is-${state}`}><i aria-hidden="true" />{availabilityLabel(unit, locale)}</p>
        </div>
        <p className="lg-hero__support">{x.hero.support[locale]}</p>
        <div className="lg-hero__actions">
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
      <figure className="xp-shell lg-hero__media">
        <LgPhoto photo={x.photos[x.hero.photo]} phone={x.photos[x.hero.phonePhoto]} locale={locale} priority sizes="(min-width: 1440px) 1360px, 100vw" className="lg-hero__photo" />
      </figure>
    </section>
  );
}
