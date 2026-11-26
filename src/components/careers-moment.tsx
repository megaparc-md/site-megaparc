import { MaskTitle } from "@/components/experience";
import { Icon } from "@/components/ui";
import { getProject } from "@/content/source";
import { careersCopy } from "@/data/careers-copy";
import { publicAsset, type SiteLocale } from "@/lib/site-data";

/**
 * CAREERS HERO — R2 (OWNER «MEGAPARC CAREERS R2», 2026-11-25 · §3, §6, §7).
 * A light editorial split, the same in both editions: the statement, one sentence and the way to the vacancies on ivory, a real
 * MEGAPARC building at full height beside it. Under the action, the index of the professional directions with their counts — a
 * candidate reaches the filtered list from the first screen without scrolling the whole page.
 * R1 stood on the temporary concept film (DEMO · CONCEPT_VIDEO) in the preview edition: R2 never shows it (OWNER R2 §2 — no DEMO
 * film). The photograph is Dacia 31 — the strongest real exterior (OWNER R3.3.1) — until an approved MEGAPARC careers shoot exists
 * (docs/careers/PHOTO_VIDEO_BRIEF.md). No text sits on the photograph.
 */
export type HeroDirection = { key: string; label: string; count: number };

const hero = {
  band640: publicAsset("/assets/careers/dacia-31-band-640.webp"),
  band800: publicAsset("/assets/careers/dacia-31-band-800.webp"),
  band960: publicAsset("/assets/careers/dacia-31-band-960.webp"),
  wide1200: publicAsset("/assets/careers/dacia-31-wide-1200.webp"),
  portrait760: publicAsset("/assets/careers/dacia-31-portrait-760.webp"),
};

export function CareersHero({ locale, href, count, directions }: { locale: SiteLocale; href: string; count: string | null; directions: HeroDirection[] }) {
  const c = careersCopy.hero;
  const property = getProject("dacia-31");
  return (
    <section className="cr-hero" id="careers-hero">
      <div className="cr-hero__grid">
        <div className="cr-hero__copy">
          <p className="cr-hero__eyebrow">
            <span>{careersCopy.label[locale]}</span>
            {count ? <span className="cr-hero__count">{count}</span> : null}
          </p>
          <MaskTitle as="h1" className="cr-hero__title" lines={[...c.title[locale]]} />
          <p className="cr-hero__text">{c.text[locale]}</p>
          <div className="cr-hero__actions">
            <a className="r3-btn r3-btn--dark cr-hero__cta" href={href}>
              <span>{c.cta[locale]}</span>
              <Icon name="down" size={16} />
            </a>
          </div>
          {directions.length > 1 ? (
            <nav className="cr-index" aria-label={c.index[locale]}>
              <p className="cr-index__label">{c.index[locale]}</p>
              <ul>
                {directions.map((item) => (
                  <li key={item.key}>
                    <a href={href} data-cr-direction={item.key}>
                      <span className="cr-index__name">{item.label}</span>
                      <span className="cr-index__n" aria-hidden="true">{String(item.count).padStart(2, "0")}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ) : null}
        </div>
        {property?.media ? (
          <figure className="cr-hero__media">
            {/* art-directed per screen: the upright crop beside the copy (desktop), the 21 : 9 band (tablet), the 4 : 3 frame as a band (phone) */}
            {/* light derivatives of the same approved frame for this placement (public/assets/careers — crop and compression only):
                the phone band was the page's LCP at 456 KB (Lighthouse mobile, R2); R3 adds the 800 px cut of the same window
                (77 KB instead of 113 KB for phones up to 2× density — a 3× phone still takes the 960 px file) */}
            {/* R3 (Codex P2): the hero is the page's LCP — announced in <head> (React hoists these links) with exactly the sets of the
                <picture> below, one per screen range, so the browser fetches the one frame it will paint, early, and never a second one;
                decoded synchronously (no decoding="async" on the LCP image) */}
            <link rel="preload" as="image" media="(max-width: 719px)" imageSrcSet={`${hero.band640} 640w, ${hero.band800} 800w, ${hero.band960} 960w`} imageSizes="100vw" fetchPriority="high" />
            <link rel="preload" as="image" media="(min-width: 720px) and (max-width: 1023px)" imageSrcSet={`${hero.wide1200} 1200w, ${property.media.wide} 2200w`} imageSizes="100vw" fetchPriority="high" />
            <link rel="preload" as="image" media="(min-width: 1024px)" imageSrcSet={`${hero.portrait760} 760w, ${property.media.portrait} 1100w`} imageSizes="40vw" fetchPriority="high" />
            <picture>
              <source media="(min-width: 1024px)" srcSet={`${hero.portrait760} 760w, ${property.media.portrait} 1100w`} sizes="40vw" />
              <source media="(min-width: 720px)" srcSet={`${hero.wide1200} 1200w, ${property.media.wide} 2200w`} sizes="100vw" />
              <img src={hero.band960} srcSet={`${hero.band640} 640w, ${hero.band800} 800w, ${hero.band960} 960w`} sizes="100vw" alt={c.photoAlt[locale]} width={960} height={540} fetchPriority="high" style={{ objectPosition: "50% 46%" }} />
            </picture>
            <figcaption className="cr-hero__caption">{property.name} · {property.city[locale]}</figcaption>
          </figure>
        ) : null}
      </div>
    </section>
  );
}
