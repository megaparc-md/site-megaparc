import { LgHead, LgPhoto } from "@/components/leasing-experience/parts";
import { SequenceRail } from "@/components/leasing-experience/sequence-rail";
import type { LeasingExperience } from "@/data/leasing-experience-model";
import type { Localized, SiteLocale } from "@/lib/site-data";

/**
 * SCENE 06 — PHOTO SEQUENCE · DETAIL (OWNER "FINAL VIEWING CONVERSION PASS",
 * 2026-11-06): 01 · address → 02 · arrival → 03 · space → 04 · connection →
 * 05 · ready base → 06 · possibility — one row, frame by frame, each frame
 * answering one question. Real photographs: exposure, white balance, local
 * contrast, highlights / shadows and sharpness corrected; architecture and real
 * condition unchanged (scripts/moscova-20-photos.mjs).
 */
const nav = {
  prev: { ro: "Cadrul anterior", ru: "Предыдущий кадр", en: "Previous frame" },
  next: { ro: "Cadrul următor", ru: "Следующий кадр", en: "Next frame" },
  of: { ro: "Secvența fotografiilor", ru: "Фотопоследовательность", en: "Photo sequence" },
} satisfies Record<string, Localized>;

export function PhotoStory({ x, locale }: { x: LeasingExperience; locale: SiteLocale }) {
  const s = x.story;
  return (
    <section id="photos" className="lg-sec lg-sec--white lg-story" aria-labelledby="lg-story-title">
      <div className="xp-shell">
        <LgHead heading={s} locale={locale} id="lg-story-title" layout="split" />
      </div>
      <div className="lg-story__wrap" data-reveal>
        <SequenceRail
          labels={{ prev: nav.prev[locale], next: nav.next[locale], of: nav.of[locale] }}
          items={s.frames.map((frame) => (
            <figure key={frame.key} className="lg-story__fig">
              <LgPhoto photo={x.photos[frame.shot.photo]} shot={frame.shot} locale={locale} ratio="3 / 2" sizes="(min-width: 1024px) 44vw, 84vw" />
              <figcaption className="lg-story__cap">
                <span className="lg-story__label"><b>{frame.no}</b> · {frame.label[locale]}</span>
                <span className="lg-story__text">{frame.caption[locale]}</span>
              </figcaption>
            </figure>
          ))}
        />
      </div>
    </section>
  );
}
