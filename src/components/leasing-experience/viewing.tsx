import { LgHead, LgSection } from "@/components/leasing-experience/parts";
import { ViewingForm } from "@/components/leasing-experience/viewing-form";
import { formatArea, viewingEnabled, type ProjectEntry } from "@/content/source";
import { company, contactLinks } from "@/data/demo-content";
import type { LeasingExperience } from "@/data/leasing-experience-model";
import type { AvailableSpace } from "@/data/leasing-inventory";
import type { SiteLocale } from "@/lib/site-data";

/**
 * REQUEST A VIEWING (section 15) — OWNER mandate §29 / brief §17. The campaign
 * idea in the title once («Ваш следующий адрес — это бизнес-решение.»), the
 * short qualification form beside it, the confirmed public contacts visible
 * without opening anything. A RESERVED unit turns the form into a waitlist.
 */
export function ViewingSection({ x, unit, project, locale }: { x: LeasingExperience; unit: AvailableSpace; project: ProjectEntry; locale: SiteLocale }) {
  const v = x.viewing;
  const label = `${project.name} · ${unit.unit[locale]} · ${formatArea(unit.area, locale)}`;
  return (
    <LgSection id="viewing" tone="warm" labelledBy="lg-viewing-title" className="lg-viewing">
      <div className="lg-viewing__grid">
        <div className="lg-viewing__copy">
          <LgHead heading={v} locale={locale} id="lg-viewing-title" />
          <div className="lg-viewing__contacts" data-reveal>
            <p className="lg-label">{v.contactsLine[locale]}</p>
            <a href={contactLinks.mobile}>{company.mobile.value[locale]}</a>
            <a href={contactLinks.landline}>{company.landline.value[locale]}</a>
            <a href={contactLinks.email}>{company.email.value[locale]}</a>
          </div>
        </div>
        <div className="xp-form lg-viewing__form" data-reveal>
          <ViewingForm locale={locale} mode={viewingEnabled(unit) ? "viewing" : "waitlist"} unitLabel={label} mailbox={company.email.value[locale]} />
        </div>
      </div>
    </LgSection>
  );
}
