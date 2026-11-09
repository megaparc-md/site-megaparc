import { LgPhoto, ui } from "@/components/leasing-experience/parts";
import { ViewingForm } from "@/components/leasing-experience/viewing-form";
import { Icon } from "@/components/ui";
import { formatArea, viewingEnabled, type ProjectEntry } from "@/content/source";
import { company, contactLinks } from "@/data/demo-content";
import type { LeasingExperience } from "@/data/leasing-experience-model";
import type { AvailableSpace } from "@/data/leasing-inventory";
import type { SiteLocale } from "@/lib/site-data";

/**
 * SCENE — THE VIEWING · the culmination (OWNER "FINAL ART DIRECTION & VISUAL
 * CONVERSION PASS", 2026-11-09, §21–23): «Не решайте по фотографиям.» as the
 * last display statement, «Посмотрите пространство лично.», one supporting line,
 * three actions — ЗАПРОСИТЬ ИНДИВИДУАЛЬНЫЙ ПРОСМОТР · ПОЛУЧИТЬ КОММЕРЧЕСКОЕ
 * ПРЕДЛОЖЕНИЕ (a UI action only: no price, deposit, term or service charge is
 * published) · ПОЗВОНИТЬ — then the light form (name · company · telephone /
 * e-mail → «Свяжитесь со мной»; the qualifying fields on request), before / at
 * / after, the one public line on terms and the confirmed contacts. When a real
 * film exists it takes the photograph's place, poster first, never autoplay.
 */
export function ViewingScene({ x, unit, project, locale }: { x: LeasingExperience; unit: AvailableSpace; project: ProjectEntry; locale: SiteLocale }) {
  const v = x.viewing;
  const open = viewingEnabled(unit);
  const label = `${project.name} · ${unit.unit[locale]} · ${formatArea(unit.area, locale)}`;
  const [title, sub] = v.title[locale].split("\n");
  return (
    <section id="viewing" className="lg-viewing" aria-labelledby="lg-viewing-title">
      <div className="xp-shell">
        <header className="lg-viewing__head">
          <p className="pm-kicker" data-reveal>{v.kicker[locale]}</p>
          <h2 className="lg-viewing__title" id="lg-viewing-title" data-reveal>
            <span className="lg-display lg-viewing__statement">{title}</span>
            {sub ? <span className="lg-viewing__sub">{sub}</span> : null}
          </h2>
          {v.lead ? <p className="lg-viewing__lead" data-reveal>{v.lead[locale]}</p> : null}
          <div className="lg-viewing__actions" data-reveal>
            <a className="btn" href="#lg-form" data-intent="viewing"><span>{open ? ui.viewingPersonal[locale] : ui.waitlist[locale]}</span><Icon /></a>
            <a className="btn btn--ghost" href="#lg-form" data-intent="offer"><span>{ui.offer[locale]}</span><Icon /></a>
            <a className="pm-link" href={contactLinks.mobile}><span>{ui.call[locale]}</span><Icon /></a>
          </div>
        </header>
        <div className="lg-viewing__grid">
          <figure className="lg-viewing__media" data-reveal>
            {v.film ? (
              <video className="lg-viewing__video" controls preload="none" playsInline poster={v.film.poster} aria-label={v.film.title[locale]}>
                <source src={v.film.src} type="video/mp4" />
              </video>
            ) : (
              <LgPhoto photo={x.photos[v.photo]} locale={locale} ratio="4 / 5" sizes="(min-width: 1024px) 34vw, 100vw" />
            )}
          </figure>
          <div className="xp-form lg-viewing__form" data-reveal>
            <ViewingForm locale={locale} mode={open ? "viewing" : "waitlist"} unitLabel={label} mailbox={company.email.value[locale]} property={project.name} />
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
      </div>
    </section>
  );
}
