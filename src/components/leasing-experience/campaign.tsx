import { LgPhoto, ui } from "@/components/leasing-experience/parts";
import { Icon } from "@/components/ui";
import type { LeasingExperience } from "@/data/leasing-experience-model";
import type { SiteLocale } from "@/lib/site-data";

/**
 * FILM / CAMPAIGN MODULE (section 14) — OWNER mandate §2, §22–23 / brief §19.
 * The one dark scene of the page and its single emotional line:
 * emotion → property page → evidence → viewing. The film «Ваш следующий шаг»
 * does not exist yet (`campaign.film` = null), so nothing pretends to be one:
 * no play button, no autoplay, no stock footage — the module shows a real
 * photograph of the empty space. When a real film is registered, the same slot
 * renders it poster-first with native controls (preload none, never autoplay).
 * The action leads to the fit check, never to a generic contact.
 */
export function CampaignFilm({ x, locale }: { x: LeasingExperience; locale: SiteLocale }) {
  const c = x.campaign;
  return (
    <section id="film" className="lg-film" aria-labelledby="lg-film-title">
      <div className="lg-film__grid">
        <figure className="lg-film__media" data-reveal>
          {c.film ? (
            <video className="lg-film__video" controls preload="none" playsInline poster={c.film.poster} aria-label={c.film.title[locale]}>
              <source src={c.film.src} type="video/mp4" />
            </video>
          ) : (
            <LgPhoto photo={x.photos[c.photo]} locale={locale} ratio="3 / 2" sizes="(min-width: 1024px) 58vw, 100vw" />
          )}
        </figure>
        <div className="lg-film__copy" data-reveal>
          <p className="pm-kicker">{c.kicker[locale]}</p>
          <h2 className="lg-film__title" id="lg-film-title">{c.title[locale]}</h2>
          <p className="lg-film__line">{c.line[locale]}</p>
          <p className="lg-film__lead">{c.lead[locale]}</p>
          {c.film ? <p className="lg-film__meta">{ui.watch[locale]} · {c.film.duration}</p> : null}
          <a className="pm-link pm-link--light" href="#fit">
            <span>{c.cta[locale]}</span>
            <Icon name="arrow" />
          </a>
        </div>
      </div>
    </section>
  );
}
