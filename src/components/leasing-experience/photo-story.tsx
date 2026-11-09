import type { CSSProperties } from "react";
import { LgHead, LgPhoto } from "@/components/leasing-experience/parts";
import { SequenceRail } from "@/components/leasing-experience/sequence-rail";
import { T, type LeasingExperience } from "@/data/leasing-experience-model";
import type { Localized, SiteLocale } from "@/lib/site-data";

/**
 * SCENE — THE PHOTO SEQUENCE as a cinematic sequence, not a gallery (OWNER
 * "FINAL ART DIRECTION & VISUAL CONVERSION PASS", 2026-11-09, §11):
 *   01 ADDRESS · 02 ARRIVAL · 03 SPACE · 04 LIGHT · 05 CONNECTION · 06 READY BASE
 * at different scales on wide screens — 60 / 40, a full-width panorama, one
 * near-full-screen scene (the glazing, with the statement «Ваш бренд виден до
 * того, как клиент войдёт.»), a vertical crop and a detail crop. Phones keep a
 * swipe row frame by frame. Real photographs (grade v3, scripts/moscova-20-photos.mjs):
 * exposure, white balance, shadows / highlights, local contrast, noise and
 * sharpness corrected — architecture, engineering and condition unchanged.
 */
const nav = {
  prev: { ro: "Cadrul anterior", ru: "Предыдущий кадр", en: "Previous frame" },
  next: { ro: "Cadrul următor", ru: "Следующий кадр", en: "Next frame" },
  of: { ro: "Secvența fotografiilor", ru: "Фотопоследовательность", en: "Photo sequence" },
} satisfies Record<string, Localized>;

const statement = T("Brandul dumneavoastră se vede înainte ca clientul să intre.", "Ваш бренд виден до того, как клиент войдёт.", "Your brand is seen before the customer walks in.");

export function PhotoStory({ x, locale }: { x: LeasingExperience; locale: SiteLocale }) {
  const s = x.story;
  return (
    <section id="photos" className="lg-sec lg-sec--white lg-story" aria-labelledby="lg-story-title">
      <div className="xp-shell">
        <LgHead heading={s} locale={locale} id="lg-story-title" layout="split" />
      </div>
      <div className="lg-story__wrap">
        <SequenceRail
          labels={{ prev: nav.prev[locale], next: nav.next[locale], of: nav.of[locale] }}
          classes={s.frames.map((frame) => `is-${frame.key}`)}
          items={s.frames.map((frame, i) => {
            const isLight = frame.key === "light";
            return (
              <figure key={frame.key} className={`lg-story__fig${isLight ? " is-statement" : ""}`} data-reveal style={{ "--i": i % 2 } as CSSProperties}>
                <LgPhoto photo={x.photos[frame.shot.photo]} shot={frame.shot} locale={locale} sizes={isLight ? "(min-width: 1440px) 1360px, 100vw" : "(min-width: 1024px) 60vw, 84vw"} />
                {isLight ? <p className="lg-story__statement lg-display">{statement[locale]}</p> : null}
                <figcaption className="lg-story__cap">
                  <span className="lg-story__label"><b>{frame.no}</b> · {frame.label[locale]}</span>
                  <span className="lg-story__text">{frame.caption[locale]}</span>
                </figcaption>
              </figure>
            );
          })}
        />
      </div>
    </section>
  );
}
