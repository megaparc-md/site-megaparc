import { LgHead, LgPhoto } from "@/components/leasing-experience/parts";
import type { LeasingExperience } from "@/data/leasing-experience-model";
import type { SiteLocale } from "@/lib/site-data";

/**
 * SCENE 06 — CURATED PHOTO STORY (OWNER compact brief §9): five frames, not a
 * gallery — one cinematic landscape, three verticals (one a detail crop), one
 * full-width. Each answers a tenant's question in one line. Real photographs,
 * graded for colour and exposure only.
 */
export function PhotoStory({ x, locale }: { x: LeasingExperience; locale: SiteLocale }) {
  const s = x.story;
  const cinematic = s.frames.filter((frame) => frame.layout === "cinematic");
  const verticals = s.frames.filter((frame) => frame.layout === "vertical");
  const full = s.frames.filter((frame) => frame.layout === "full");
  const caption = (frame: (typeof s.frames)[number]) => (
    <figcaption className="lg-story__cap">
      <span className="lg-story__label">{frame.label[locale]}</span>
      <span className="lg-story__text">{frame.caption[locale]}</span>
    </figcaption>
  );
  return (
    <section id="photos" className="lg-sec lg-sec--white lg-story" aria-labelledby="lg-story-title">
      <div className="xp-shell">
        <LgHead heading={s} locale={locale} id="lg-story-title" layout="split" />
        {cinematic.map((frame) => (
          <figure key={frame.key} className="lg-story__fig is-cinematic" data-reveal>
            <LgPhoto photo={x.photos[frame.shot.photo]} shot={frame.shot} locale={locale} ratio="21 / 9" sizes="(min-width: 1440px) 1360px, 100vw" />
            {caption(frame)}
          </figure>
        ))}
        <div className="lg-story__row">
          {verticals.map((frame) => (
            <figure key={frame.key} className="lg-story__fig is-vertical" data-reveal>
              <LgPhoto photo={x.photos[frame.shot.photo]} shot={frame.shot} locale={locale} ratio="4 / 5" sizes="(min-width: 1024px) 30vw, 100vw" />
              {caption(frame)}
            </figure>
          ))}
        </div>
      </div>
      {full.map((frame) => (
        <figure key={frame.key} className="lg-story__fig is-full" data-reveal>
          <LgPhoto photo={x.photos[frame.shot.photo]} shot={frame.shot} locale={locale} ratio="12 / 5" sizes="(min-width: 1600px) 1600px, 100vw" />
          <div className="xp-shell">{caption(frame)}</div>
        </figure>
      ))}
    </section>
  );
}
