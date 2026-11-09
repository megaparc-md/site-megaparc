import type { CSSProperties } from "react";
import { LgHead, LgPhoto } from "@/components/leasing-experience/parts";
import { SequenceRail } from "@/components/leasing-experience/sequence-rail";
import { Icon } from "@/components/ui";
import { T, type LeasingExperience } from "@/data/leasing-experience-model";
import type { Localized, SiteLocale } from "@/lib/site-data";

/**
 * SCENE — THE PHOTO SEQUENCE (OWNER "FINAL ART DIRECTION & VISUAL CONVERSION
 * PASS", 2026-11-09, §11; "PREMIUM CARD SYSTEM & AIR PASS", same day, §15): the
 * four best frames — 01 ADDRESS · 02 LIGHT (the glazing, with the statement «Ваш
 * бренд виден до того, как клиент войдёт.») · 03 SPACE · 04 CONNECTION — in two
 * rows of 5 / 7 and 7 / 5 columns on wide screens, a swipe row on phones; the
 * other frames (arrival, ready base) and all six together sit behind «Смотреть
 * все фотографии →» (PhotoGallery, in a drawer). Real photographs (grade v3,
 * scripts/moscova-20-photos.mjs): light and colour corrected, architecture,
 * engineering and condition unchanged.
 */
const nav = {
  prev: { ro: "Cadrul anterior", ru: "Предыдущий кадр", en: "Previous frame" },
  next: { ro: "Cadrul următor", ru: "Следующий кадр", en: "Next frame" },
  of: { ro: "Secvența fotografiilor", ru: "Фотопоследовательность", en: "Photo sequence" },
  all: { ro: "Vezi toate fotografiile", ru: "Смотреть все фотографии", en: "See all photographs" },
} satisfies Record<string, Localized>;

export const galleryTitle = nav.all;

const statement = T("Brandul dumneavoastră se vede înainte ca clientul să intre.", "Ваш бренд виден до того, как клиент войдёт.", "Your brand is seen before the customer walks in.");
const SHOWN = 4;

export function PhotoStory({ x, locale }: { x: LeasingExperience; locale: SiteLocale }) {
  const s = x.story;
  const frames = s.frames.slice(0, SHOWN);
  return (
    <section id="photos" className="lg-sec lg-sec--white lg-story" aria-labelledby="lg-story-title">
      <div className="xp-shell">
        <LgHead heading={s} locale={locale} id="lg-story-title" layout="split" />
      </div>
      <div className="lg-story__wrap">
        <SequenceRail
          labels={{ prev: nav.prev[locale], next: nav.next[locale], of: nav.of[locale] }}
          classes={frames.map((frame) => `is-${frame.key}`)}
          items={frames.map((frame, i) => {
            const isLight = frame.key === "light";
            return (
              <figure key={frame.key} className={`lg-story__fig${isLight ? " is-statement" : ""}`} data-reveal style={{ "--i": i % 2 } as CSSProperties}>
                <LgPhoto photo={x.photos[frame.shot.photo]} shot={frame.shot} locale={locale} sizes="(min-width: 1024px) 58vw, 84vw" />
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
      {s.frames.length > SHOWN ? (
        <p className="xp-shell lg-story__all">
          <a className="pm-link" href="#gallery" data-drawer="gallery" aria-haspopup="dialog"><span>{nav.all[locale]}</span><span className="lg-story__count">{s.frames.length}</span><Icon /></a>
        </p>
      ) : null}
    </section>
  );
}

/** Every frame of the sequence, with its caption — the content of the «Смотреть все фотографии» drawer. */
export function PhotoGallery({ x, locale }: { x: LeasingExperience; locale: SiteLocale }) {
  return (
    <ol className="lg-gallery">
      {x.story.frames.map((frame) => (
        <li key={frame.key}>
          <figure className="lg-gallery__fig">
            <LgPhoto photo={x.photos[frame.shot.photo]} locale={locale} ratio="3 / 2" sizes="(min-width: 720px) 22rem, 100vw" />
            <figcaption className="lg-story__cap">
              <span className="lg-story__label"><b>{frame.no}</b> · {frame.label[locale]}</span>
              <span className="lg-story__text">{frame.caption[locale]}</span>
            </figcaption>
          </figure>
        </li>
      ))}
    </ol>
  );
}
