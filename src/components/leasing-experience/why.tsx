import { LgHead, LgPhoto, LgSection, withArea } from "@/components/leasing-experience/parts";
import { formatArea } from "@/content/source";
import type { LeasingExperience } from "@/data/leasing-experience-model";
import type { AvailableSpace } from "@/data/leasing-inventory";
import type { SiteLocale } from "@/lib/site-data";

/**
 * SCENE 02 — WHY CONSIDER IT (OWNER compact brief §4): three proofs, each with
 * a real photograph (a detail of the finished floor and stair, the depth of the
 * hall, the boulevard). No icons, one sentence each. The area is read from the
 * unit record.
 */
export function WhyConsider({ x, unit, locale }: { x: LeasingExperience; unit: AvailableSpace; locale: SiteLocale }) {
  const area = formatArea(unit.area, locale);
  return (
    <LgSection id="why" tone="white" labelledBy="lg-why-title" className="lg-why">
      <LgHead heading={x.why} locale={locale} id="lg-why-title" layout="split" />
      <ol className="lg-why__list">
        {x.why.items.map((item) => (
          <li key={item.key} className="lg-why__item" data-reveal>
            <LgPhoto photo={x.photos[item.shot.photo]} shot={item.shot} locale={locale} ratio="4 / 3" sizes="(min-width: 1024px) 30vw, 100vw" />
            <h3>{item.title[locale]}</h3>
            <p>{withArea(item.text[locale], area)}</p>
          </li>
        ))}
      </ol>
    </LgSection>
  );
}
