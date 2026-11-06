import { LgHead, LgPhoto } from "@/components/leasing-experience/parts";
import type { LeasingExperience, PhotoChapter } from "@/data/leasing-experience-model";
import type { SiteLocale } from "@/lib/site-data";

/**
 * REAL PHOTO STORY (section 06) — OWNER mandate §20–21 / brief §7. Eight
 * chapters of the OWNER photographs in the order a visitor meets the place:
 * city → facade → entrance and terrace → ground floor → staircase → lower
 * ground → engineering → service areas. Large photographic moments in four
 * formats (wide · pair · inset · full), never a thumbnail grid. The frames show
 * the current condition — graded for colour and exposure only.
 */

type Group = { kind: "single"; chapter: PhotoChapter } | { kind: "pair"; chapters: [PhotoChapter, PhotoChapter] };

function group(chapters: PhotoChapter[]): Group[] {
  const out: Group[] = [];
  for (let i = 0; i < chapters.length; i++) {
    const chapter = chapters[i];
    const next = chapters[i + 1];
    if (chapter.layout === "pair-left" && next?.layout === "pair-right") {
      out.push({ kind: "pair", chapters: [chapter, next] });
      i++;
    } else out.push({ kind: "single", chapter });
  }
  return out;
}

function Caption({ chapter, locale }: { chapter: PhotoChapter; locale: SiteLocale }) {
  return (
    <figcaption className="lg-story__cap">
      <span className="lg-story__no">{chapter.no}</span>
      <span className="lg-story__label">{chapter.label[locale]}</span>
      <span className="lg-story__text">{chapter.caption[locale]}</span>
    </figcaption>
  );
}

export function PhotoStory({ x, locale }: { x: LeasingExperience; locale: SiteLocale }) {
  const s = x.story;
  return (
    <section id="photos" className="lg-sec lg-sec--white lg-story" aria-labelledby="lg-story-title">
      <div className="xp-shell">
        <LgHead heading={s} locale={locale} id="lg-story-title" layout="split" />
      </div>
      <div className="lg-story__flow">
        {group(s.chapters).map((g) =>
          g.kind === "pair" ? (
            <div key={g.chapters[0].no} className="xp-shell lg-story__pair">
              {g.chapters.map((chapter, i) => (
                <figure key={chapter.no} className={`lg-story__fig is-pair is-${i ? "right" : "left"}`} data-reveal>
                  <LgPhoto photo={x.photos[chapter.photo]} locale={locale} ratio={i ? "4 / 5" : "4 / 3"} sizes="(min-width: 1024px) 45vw, 100vw" />
                  <Caption chapter={chapter} locale={locale} />
                </figure>
              ))}
            </div>
          ) : g.chapter.layout === "inset" ? (
            <div key={g.chapter.no} className="xp-shell lg-story__inset">
              <figure className="lg-story__fig is-inset" data-reveal>
                <LgPhoto photo={x.photos[g.chapter.photo]} locale={locale} ratio="4 / 5" sizes="(min-width: 1024px) 34vw, 100vw" />
                <Caption chapter={g.chapter} locale={locale} />
              </figure>
            </div>
          ) : (
            <div key={g.chapter.no} className={g.chapter.layout === "full" ? "lg-story__full" : "xp-shell"}>
              <figure className={`lg-story__fig is-${g.chapter.layout}`} data-reveal>
                <LgPhoto photo={x.photos[g.chapter.photo]} locale={locale} ratio={g.chapter.layout === "full" ? "21 / 9" : "16 / 9"} sizes={g.chapter.layout === "full" ? "(min-width: 1600px) 1600px, 100vw" : "(min-width: 1440px) 1360px, 100vw"} />
                <Caption chapter={g.chapter} locale={locale} />
              </figure>
            </div>
          ),
        )}
      </div>
    </section>
  );
}
