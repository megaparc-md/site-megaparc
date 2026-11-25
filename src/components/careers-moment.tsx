import { CinemaFilm } from "@/components/cinema-film";
import { MaskTitle } from "@/components/experience";
import { ArtImage } from "@/components/primitives";
import { Icon } from "@/components/ui";
import { getProject } from "@/content/source";
import { careersCopy } from "@/data/careers-copy";
import { isProductionEdition, publicAsset, type SiteLocale } from "@/lib/site-data";

/**
 * CAREERS HERO (OWNER «MEGAPARC CAREERS — PREMIUM EMPLOYER BRAND», 2026-11-25 · block 01; the film principle: OWNER addendum
 * 2026-10-08). One statement, one action, one moving image.
 *
 * The footage is still the temporary concept film (DEMO · CONCEPT_VIDEO · REPLACE_WITH_REAL_MEGAPARC_SHOOT, registered in
 * src/data/demo-content.ts): it never reaches the production edition. There the hero stands on a real photograph of a MEGAPARC
 * property — Dacia 31 — with the same statement and action; when an approved MEGAPARC film exists it replaces both.
 * Poster first, no audio, no autoplay request under reduced motion (CinemaFilm).
 */

const FILM = {
  desktop: { src: "/assets/video/careers-concept.mp4", poster: "/assets/video/careers-concept-poster.webp" },
  mobile: { src: "/assets/video/careers-concept-mobile.mp4", poster: "/assets/video/careers-concept-mobile-poster.webp" },
};

const asset = (edit: { src: string; poster: string }) => ({ src: publicAsset(edit.src), poster: publicAsset(edit.poster) });

export function CareersHero({ locale, href, count }: { locale: SiteLocale; href: string; count: string | null }) {
  const c = careersCopy.hero;
  const property = getProject("dacia-31");
  const photo = isProductionEdition ? property?.media ?? null : null;
  return (
    <section className={`cm cm--hero cr-hero${photo ? " cr-hero--photo" : ""}`} id="careers-hero" data-xp-hero="">
      {photo ? (
        <div className="cr-hero__photo">
          <ArtImage media={photo} alt={c.photoAlt[locale]} priority sizes="100vw" position="50% 46%" />
        </div>
      ) : (
        <CinemaFilm desktop={asset(FILM.desktop)} mobile={asset(FILM.mobile)} copy={{ pause: c.pause[locale], play: c.play[locale] }} priority />
      )}
      <span className="cm__veil" aria-hidden="true" />
      <div className="xp-shell cm__copy cr-hero__copy">
        <p className="xp-eyebrow cm__eyebrow">
          <span>{careersCopy.label[locale]}</span>
          {count ? <span className="cm__count">{count}</span> : null}
        </p>
        <MaskTitle as="h1" className="cm__title cr-hero__title" lines={[...c.title[locale]]} />
        <p className="cm__text cr-hero__text">{c.text[locale]}</p>
        <div className="cm__actions">
          <a className="btn btn--light cr-hero__cta" href={href}>
            <span>{c.cta[locale]}</span>
            <Icon name="down" />
          </a>
        </div>
      </div>
      {photo && property ? <p className="cr-hero__caption">{property.name} · {property.city[locale]}</p> : null}
    </section>
  );
}
