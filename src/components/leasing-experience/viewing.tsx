import { ui } from "@/components/leasing-experience/parts";
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
 * Card & air pass (2026-11-09, §17): more air; «Посмотрите Moscova 20 лично.»;
 * the three actions as action cards (primary dark, two light) carrying the unit,
 * the one public line on terms and the telephone; the form beside the steps,
 * without the photograph (the film slot stays).
 */
export function ViewingScene({ x, unit, project, locale }: { x: LeasingExperience; unit: AvailableSpace; project: ProjectEntry; locale: SiteLocale }) {
  const v = x.viewing;
  const open = viewingEnabled(unit);
  const label = `${project.name} · ${unit.unit[locale]} · ${formatArea(unit.area, locale)}`;
  const [title, sub] = v.title[locale].split("\n");
  return (
    <section id="viewing" className="lg-viewing" aria-labelledby="lg-viewing-title">
      <div className="xp-shell lg-viewing__shell">
        <header className="lg-viewing__head">
          <p className="pm-kicker" data-reveal>{v.kicker[locale]}</p>
          <h2 className="lg-viewing__title" id="lg-viewing-title" data-reveal>
            <span className="lg-display lg-viewing__statement">{title}</span>
            {sub ? <span className="lg-viewing__sub">{sub}</span> : null}
          </h2>
          {v.lead ? <p className="lg-viewing__lead" data-reveal>{v.lead[locale]}</p> : null}
        </header>
        {/* three actions as premium action cards: one primary, two secondary (OWNER card & air pass §17) */}
        <ul className="lg-actions" data-reveal>
          <li><a className="lg-card lg-action is-primary" href="#lg-form" data-intent="viewing"><span className="lg-action__label">{open ? ui.viewing[locale] : ui.waitlist[locale]}</span><span className="lg-action__meta">{label}</span><Icon /></a></li>
          <li><a className="lg-card lg-action" href="#lg-form" data-intent="offer"><span className="lg-action__label">{ui.offer[locale]}</span><span className="lg-action__meta">{x.terms.pending[locale]}</span><Icon /></a></li>
          <li><a className="lg-card lg-action" href={contactLinks.mobile}><span className="lg-action__label">{ui.call[locale]}</span><span className="lg-action__meta">{company.mobile.value[locale]}</span><Icon /></a></li>
        </ul>
        <div className="lg-viewing__grid">
          {v.film ? (
            <figure className="lg-viewing__media" data-reveal>
              <video className="lg-viewing__video" controls preload="none" playsInline poster={v.film.poster} aria-label={v.film.title[locale]}>
                <source src={v.film.src} type="video/mp4" />
              </video>
            </figure>
          ) : null}
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
