import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { ConceptImage, hasConceptImage } from "@/components/experience";
import { ArtImage } from "@/components/primitives";
import { Icon } from "@/components/ui";
import { getProject } from "@/content/source";
import { directions, holdOrSell, reinvestment, type DirectionKey } from "@/lib/business";
import type { Localized, SiteLocale } from "@/lib/site-data";

/**
 * THE BUSINESS — three directions as three cinematic scenes (OWNER brief
 * 2026-10-08, "BUSINESS MODEL + PREMIUM COLOR SYSTEM RESET"). Replaces the
 * six-step lifecycle. Each scene pairs a real MEGAPARC property photograph
 * (the evidence) with a human-scale inset (people at work, registered DEMO
 * concept image) and its address.
 *
 * Desktop with motion: one pinned media stage; [data-xp-scene] (experience
 * motion) sets data-step and --xp-p from scroll; image crossfade 1.1 s, masked
 * title 0.8 s, a three-part progress line. Phones, tablets and reduced motion:
 * the three scenes stacked — image, then copy — no pinned sequence.
 */
type Scene = { key: DirectionKey; slug: string; position?: string; inset: string; caption: Localized };

const scenes: Scene[] = [
  { key: "investment", slug: "dacia-31", inset: "business.investment.inset", caption: { ro: "Dacia 31 · Chișinău", ru: "Dacia 31 · Кишинёв", en: "Dacia 31 · Chișinău" } },
  { key: "development", slug: "vatra", position: "50% 70%", inset: "business.development.inset", caption: { ro: "VATRA · proiect în lucru", ru: "VATRA · проект в работе", en: "VATRA · under way" } },
  { key: "leasing", slug: "moscova-9", inset: "business.leasing.inset", caption: { ro: "Moscova 9 · Chișinău", ru: "Moscova 9 · Кишинёв", en: "Moscova 9 · Chișinău" } },
];

function SceneImage({ scene, locale, sizes }: { scene: Scene; locale: SiteLocale; sizes: string }) {
  const project = getProject(scene.slug);
  const direction = directions.find((d) => d.key === scene.key)!;
  if (!project?.media) return null;
  return <ArtImage media={project.media} alt={`${project.name} — ${direction.title[locale].replace(/ /g, " ")}`} sizes={sizes} position={scene.position} />;
}

export function BusinessStage({ locale, label, more }: { locale: SiteLocale; label: ReactNode; more?: { href: string; text: string } }) {
  return (
    <>
    <div className="bz" data-xp-scene data-steps={scenes.length} style={{ "--steps": scenes.length } as CSSProperties}>
      <div className="bz__pin">
        <div className="bz__copy">
          <p className="xp-eyebrow bz__label">{label}</p>
          <div className="bz__scenes">
            {scenes.map((scene, index) => {
              const d = directions.find((item) => item.key === scene.key)!;
              return (
                <article key={scene.key} className="bz__scene" style={{ "--i": index } as CSSProperties}>
                  <figure className="bz__thumb" aria-hidden="true">
                    <SceneImage scene={scene} locale={locale} sizes="100vw" />
                    <figcaption>{scene.caption[locale]}</figcaption>
                  </figure>
                  <span className="bz__no">{d.no}</span>
                  <h3 className="bz__title"><span>{d.title[locale]}</span></h3>
                  <p className="bz__statement">{d.statement[locale]}</p>
                  <p className="bz__text">{d.text[locale]}</p>
                </article>
              );
            })}
          </div>
          <ol className="bz__progress" aria-hidden="true">
            {scenes.map((scene, index) => {
              const d = directions.find((item) => item.key === scene.key)!;
              return (
                <li key={scene.key} style={{ "--i": index } as CSSProperties}>
                  <span>{d.no}</span> {d.title[locale]}
                </li>
              );
            })}
          </ol>
        </div>
        <div className="bz__media" aria-hidden="true">
          {scenes.map((scene) => (
            <figure key={scene.key} className="bz__frame">
              <SceneImage scene={scene} locale={locale} sizes="(min-width: 1024px) 60vw, 100vw" />
              <span className="bz__caption">{scene.caption[locale]}</span>
              {/* production edition: no concept visual here (OWNER "PRODUCTION V1" §3) — the frame is not rendered */}
              {hasConceptImage(scene.inset) ? (
                <span className="bz__inset">
                  <ConceptImage id={scene.inset} locale={locale} sizes="(min-width: 1024px) 18vw, 40vw" />
                </span>
              ) : null}
            </figure>
          ))}
        </div>
      </div>
    </div>
      <div className="xp-shell bz__notes">
        <p>{holdOrSell[locale]}</p>
        <p>{reinvestment[locale]}</p>
        {more ? (
          <Link href={more.href} className="tlink">
            {more.text}
            <Icon name="arrow" />
          </Link>
        ) : null}
      </div>
    </>
  );
}

/**
 * The three directions as three tall image tiles (Home: "understand MEGAPARC").
 * Human-scale images — people at work — so the company never feels empty; the
 * real buildings follow in Projects. Hover: the image settles, the arrow moves.
 */
/** Three direction tiles; each leads to its own destination with a specific action (TRUST & PROOF PASS). */
export function DirectionTiles({ locale, links }: { locale: SiteLocale; links: Record<DirectionKey, { href: string; cta: string }> }) {
  const tiles: Record<DirectionKey, string> = { investment: "home.direction.investment", development: "home.direction.development", leasing: "home.direction.leasing" };
  return (
    <ul className="dt">
      {directions.map((d, index) => (
        <li key={d.key} data-reveal style={{ "--i": index } as CSSProperties}>
          <Link href={links[d.key].href} className="dt__link">
            {/* production edition: no concept visual here (OWNER "PRODUCTION V1" §3) — the frame is not rendered */}
            {hasConceptImage(tiles[d.key]) ? (
              <figure className="dt__media">
                <ConceptImage id={tiles[d.key]} locale={locale} sizes="(min-width: 1024px) 33vw, 100vw" />
              </figure>
            ) : null}
            <span className="dt__no">{d.no}</span>
            <span className="dt__title">{d.title[locale]}</span>
            <span className="dt__text">{d.short[locale]}</span>
            <span className="dt__cta">{links[d.key].cta}<Icon name="arrow" size={18} /></span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

/** The three directions as one quiet line of text (Projects, Partnership), with the supporting logic. */
export function DirectionsLine({ locale }: { locale: SiteLocale }) {
  return (
    <div className="dl">
      <ol className="dl__list">
        {directions.map((d) => (
          <li key={d.key} data-reveal>
            <span className="dl__no">{d.no}</span>
            <h3 className="dl__title">{d.title[locale]}</h3>
            <p className="dl__text">{d.short[locale]}</p>
          </li>
        ))}
      </ol>
      <div className="dl__notes" data-reveal>
        <p>{holdOrSell[locale]}</p>
        <p>{reinvestment[locale]}</p>
      </div>
    </div>
  );
}
