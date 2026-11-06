import { LgPhoto, ui } from "@/components/leasing-experience/parts";
import { ViewingForm } from "@/components/leasing-experience/viewing-form";
import { Icon } from "@/components/ui";
import { formatArea, viewingEnabled, type ProjectEntry } from "@/content/source";
import { company, contactLinks } from "@/data/demo-content";
import type { LeasingExperience } from "@/data/leasing-experience-model";
import type { AvailableSpace } from "@/data/leasing-inventory";
import type { SiteLocale } from "@/lib/site-data";

/**
 * SCENE 07 — THE VIEWING · CONVERSION (OWNER "FINAL VIEWING CONVERSION PASS",
 * 2026-11-06): «Не решайте по фотографиям.» + «Посмотрите пространство лично…»,
 * ЗАПРОСИТЬ ИНДИВИДУАЛЬНЫЙ ПРОСМОТР · ПОЛУЧИТЬ ПРЕЗЕНТАЦИЮ and the short form;
 * then before / at / after in one line each, the only public line on terms and
 * the confirmed contacts (under the photograph on wide screens; phones skip the
 * photograph — the entrance is in the photo sequence). When a real film exists it takes the photograph's place,
 * poster first, native controls, never autoplay.
 */
export function ViewingScene({ x, unit, project, locale }: { x: LeasingExperience; unit: AvailableSpace; project: ProjectEntry; locale: SiteLocale }) {
  const v = x.viewing;
  const open = viewingEnabled(unit);
  const label = `${project.name} · ${unit.unit[locale]} · ${formatArea(unit.area, locale)}`;
  return (
    <section id="viewing" className="lg-sec lg-sec--stone lg-viewing" aria-labelledby="lg-viewing-title">
      <div className="xp-shell lg-viewing__grid">
        <figure className="lg-viewing__media" data-reveal>
          {v.film ? (
            <video className="lg-viewing__video" controls preload="none" playsInline poster={v.film.poster} aria-label={v.film.title[locale]}>
              <source src={v.film.src} type="video/mp4" />
            </video>
          ) : (
            <LgPhoto photo={x.photos[v.photo]} locale={locale} ratio="4 / 5" sizes="(min-width: 1024px) 40vw, 100vw" />
          )}
        </figure>
        <div className="lg-viewing__copy">
          <header className="lg-head" data-reveal>
            <p className="pm-kicker">{v.kicker[locale]}</p>
            <h2 className="lg-head__title lg-viewing__title" id="lg-viewing-title">{v.title[locale]}</h2>
            {v.lead ? <p className="lg-head__lead">{v.lead[locale]}</p> : null}
          </header>
          <div className="lg-viewing__actions" data-reveal>
            <a className="btn" href="#lg-form" data-intent="viewing"><span>{open ? ui.viewingPersonal[locale] : ui.waitlist[locale]}</span><Icon /></a>
            <a className="btn btn--ghost" href="#lg-form" data-intent="presentation"><span>{ui.presentation[locale]}</span><Icon /></a>
          </div>
          <div className="xp-form lg-viewing__form" data-reveal>
            <ViewingForm locale={locale} mode={open ? "viewing" : "waitlist"} unitLabel={label} mailbox={company.email.value[locale]} property={project.name} />
          </div>
        </div>
        <aside className="lg-viewing__aside">
          <dl className="lg-steps" data-reveal>
            {v.steps.map((step) => (
              <div key={step.title.en}>
                <dt>{step.title[locale]}</dt>
                <dd>{step.text[locale]}</dd>
              </div>
            ))}
          </dl>
          <p className="lg-viewing__terms" data-reveal>{x.terms.pending[locale]}</p>
          <div className="lg-viewing__contacts" data-reveal>
            <p className="lg-label">{v.contactsLine[locale]}</p>
            <a href={contactLinks.email}>{company.email.value[locale]}</a>
            <a href={contactLinks.mobile}>{company.mobile.value[locale]}</a>
            <a href={contactLinks.landline}>{company.landline.value[locale]}</a>
          </div>
        </aside>
      </div>
    </section>
  );
}
