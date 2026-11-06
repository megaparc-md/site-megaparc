import Link from "next/link";
import { LgPhoto, ui } from "@/components/leasing-experience/parts";
import { Icon } from "@/components/ui";
import { availabilityLabel, availabilityOf, formatArea, viewingEnabled, type ProjectEntry } from "@/content/source";
import type { LeasingExperience } from "@/data/leasing-experience-model";
import type { AvailableSpace } from "@/data/leasing-inventory";
import { localePath, type SiteLocale } from "@/lib/site-data";

/**
 * HERO (section 01) — OWNER mandate §6–7 / brief §5. The real building first:
 * the facade frame shows the glazing, the entrance with steps and ramp, the
 * terrace and the street in one look. Beside it — never over it — the name,
 * the one-line identity, the marketed area, the levels, the status (from the
 * unit record), four micro-facts and two actions. No technical detail here.
 * The photograph (1278 px) is never upscaled: it fills the 60 % column on
 * desktop (≤ 1152 px at 1920) and a 4:3.4 frame on phones.
 */
export function LeasingHero({ x, unit, project, locale }: { x: LeasingExperience; unit: AvailableSpace; project: ProjectEntry; locale: SiteLocale }) {
  const photo = x.photos[x.hero.photo];
  const state = availabilityOf(unit).key;
  const open = viewingEnabled(unit);
  return (
    <section className="lg-hero" aria-labelledby="lg-hero-title">
      <figure className="lg-hero__media">
        <LgPhoto photo={photo} locale={locale} priority sizes="(min-width: 1024px) 60vw, 100vw" className="lg-hero__photo" />
      </figure>
      <div className="lg-hero__copy">
        <Link href={localePath(locale, "/leasing")} className="pp2-back lg-hero__back"><Icon name="left" /> {ui.leasing[locale]}</Link>
        <h1 className="lg-hero__h1" id="lg-hero-title">
          <span className="lg-hero__name">{project.name}</span>
          <span className="lg-hero__title">{x.hero.title[locale]}</span>
        </h1>
        <div className="lg-hero__key">
          <p className="lg-hero__area">{formatArea(unit.area, locale)}</p>
          <p className="lg-hero__levels">{unit.floorLabel[locale]}</p>
        </div>
        <p className={`lg-hero__status is-${state}`}><i aria-hidden="true" />{availabilityLabel(unit, locale)}</p>
        <ul className="lg-hero__facts">
          {unit.highlights.map((item) => (
            <li key={item.en}>{item[locale]}</li>
          ))}
        </ul>
        <div className="lg-hero__actions">
          <a className="btn" href="#viewing">
            <span>{open ? ui.viewing[locale] : ui.waitlist[locale]}</span>
            <Icon name="down" />
          </a>
          <a className="pm-link" href="#scheme">
            <span>{ui.scheme[locale]}</span>
            <Icon name="down" />
          </a>
        </div>
        <p className="lg-hero__place">{x.address[locale]} · {x.hero.place[locale]}</p>
      </div>
    </section>
  );
}
