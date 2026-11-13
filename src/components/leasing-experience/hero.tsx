import { Accent } from "@/components/accent";
import type { CSSProperties } from "react";
import Link from "next/link";
import { LgPhoto, splitArea, ui } from "@/components/leasing-experience/parts";
import { Icon } from "@/components/ui";
import type { TemplateOffer } from "@/components/leasing-experience/offer";
import { HeroRates } from "@/components/leasing-toolkit/commercial-terms";
import type { ProjectEntry } from "@/content/source";
import type { LeasingExperience } from "@/data/leasing-experience-model";
import { m20Commercial } from "@/data/moscova-20-commercial";
import { localePath, type SiteLocale } from "@/lib/site-data";

/**
 * SCENE 01 — HERO · the emotional entrance (OWNER "FINAL ART DIRECTION & VISUAL
 * CONVERSION PASS", 2026-11-09, §3–4). The real facade frame carries 60–75 % of
 * the first screen: on wide screens it fills the right of the screen up to the
 * viewport edge, the type stands on warm ivory beside it — no box over the
 * building, the neighbour's lettering stays outside the crop (crop only). Only:
 * MOSCOVA 20 · «Пространство для следующего шага вашего бизнеса.» · the place ·
 * 625,7 м² as display figure · the status · the core-capital-works line (OWNER copy correction 2026-11-10) ·
 * ЗАПРОСИТЬ ПРОСМОТР / ПОСМОТРЕТЬ ПЛАНЫ. Area and status are read from the unit
 * record (M20-01). The photograph stays at ≈ 1× of its 1278 px source: the hero
 * height is capped so it is never stretched.
 *
 * Motion (CSS only, off under reduced motion): a soft mask reveal of the
 * photograph, a slow 1.00 → 1.03 scale, a few pixels of parallax (data-depth),
 * the lines and the figure rising in turn, the arrow moving on the actions.
 *
 * Card & air pass (OWNER "PREMIUM CARD SYSTEM & AIR PASS", 2026-11-09, §1–3):
 * calmer, more air between the blocks, the photograph framed inside the page
 * shell with a restrained radius, «м²» set apart from 625,7 (top right, never
 * touching the digits).
 */
export function LeasingHero({ x, offer, project, locale }: { x: LeasingExperience; offer: TemplateOffer; project: ProjectEntry; locale: SiteLocale }) {
  const area = splitArea(offer.figure);
  const supportLines = x.hero.support[locale].split("\n");
  const support = supportLines.length > 1 ? null : supportLines[0];
  return (
    <section className="lg-hero" aria-labelledby="lg-hero-title">
      <div className="xp-shell lg-hero__grid">
        <div className="lg-hero__text">
          <Link href={localePath(locale, "/leasing")} className="pp2-back lg-hero__back"><Icon name="left" /> {ui.leasing[locale]}</Link>
          <p className="lg-hero__place lg-rise" style={{ "--d": 0 } as CSSProperties}>{x.hero.place[locale]}</p>
          <h1 className="lg-hero__h1" id="lg-hero-title">
            <span className="lg-hero__name lg-rise" style={{ "--d": 1 } as CSSProperties}>{project.name}</span>
            <span className="lg-hero__title lg-rise" style={{ "--d": 2 } as CSSProperties}><Accent text={x.hero.title[locale]} /></span>
          </h1>
          <div className="lg-hero__offer lg-rise" style={{ "--d": 3 } as CSSProperties}>
            {/* the figure and its unit are two boxes side by side — the unit can never overlap the digits (OWNER card pass §1, §20) */}
            <p className="lg-hero__area">
              <strong className="lg-hero__figure">{area.figure}</strong>
              <span className="lg-hero__unit">{area.unit}</span>
            </p>
            <p className="lg-hero__offered">{x.hero.offer[locale]}</p>
            <p className={`lg-hero__status is-${offer.state}`}><i aria-hidden="true" />{offer.status}</p>
            {/* OWNER R6 §02 (2026-11-12): the two approved rates beside the area — only on the property whose rates are published */}
            {x.project === m20Commercial.project ? <HeroRates locale={locale} className="lg-hero__rates" /> : null}
          </div>
          {/* OWNER «HERO CONTENT DEDUPLICATION» (2026-11-12): one key statement — one block. A two-line support IS the readiness statement scene
              right under the hero (summary.tsx), so the hero does not repeat its first line; a one-line support is the property's own hero argument and stays. */}
          {support ? (
            <p className="lg-hero__support lg-rise" style={{ "--d": 4 } as CSSProperties}>
              {support}
            </p>
          ) : null}
          <div className={`lg-hero__actions lg-rise${support ? "" : " is-after-offer"}`} style={{ "--d": 5 } as CSSProperties}>
            <a className="btn" href="#viewing" data-intent="viewing">
              <span>{offer.primary}</span>
              <Icon />
            </a>
            <a className="pm-link" href={offer.secondary.href}>
              <span>{offer.secondary.label}</span>
              <Icon />
            </a>
          </div>
        </div>
        <figure className="lg-hero__media" data-depth="10">
          <LgPhoto photo={x.photos[x.hero.photo]} phone={x.photos[x.hero.phonePhoto]} locale={locale} priority sizes="(min-width: 1024px) 64vw, 100vw" className="lg-hero__photo" />
        </figure>
      </div>
    </section>
  );
}
