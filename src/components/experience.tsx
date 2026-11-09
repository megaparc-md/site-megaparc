import type { CSSProperties, ReactNode } from "react";
import { ArtImage } from "@/components/primitives";
import { conceptVisuals, demoContentPresent, imageUse, type DataPoint, type VisualKey } from "@/data/demo-content";
import { getAsset, type AssetMedia } from "@/lib/assets";
import { publicAsset, type Localized, type SiteLocale } from "@/lib/site-data";

/**
 * Experience system — shared building blocks of the full-experience prototype
 * (2026-10-07). Class prefix `xp-`, tokens and rules in globals.css section
 * "EXPERIENCE SYSTEM". Everything here is server-rendered; behaviour lives in
 * ExperienceMotion and the small client journey components.
 */

/* ---------------------------------------------------------------- */
/* Media                                                              */
/* ---------------------------------------------------------------- */

/** Concept visual as an art-directed media object (portrait-only visuals reuse the master on phones). */
export function conceptMedia(key: VisualKey, position?: string): AssetMedia {
  const src = publicAsset(`/assets/brand/${key}.webp`);
  const mobile = conceptVisuals[key].mobile ? publicAsset(`/assets/brand/${key}-mobile.webp`) : src;
  return { src, card: src, wide: src, portrait: src, mobile, position };
}

/** Real MEGAPARC photograph of a portfolio property. */
export function assetMedia(slug: string): AssetMedia | null {
  return getAsset(slug)?.media ?? null;
}

export const photoDirectionLabel = "Photo direction · Concept";

/** Small label carried by every concept image that stands in for a named property. */
/**
 * Public pages carry no production notation (OWNER acceptance brief 2026-10-08):
 * the label is kept as a component so internal pages can opt in, but renders
 * nothing; the register (docs/DEMO_IMAGE_REGISTER.md) and the production gate
 * keep the status. The one public signal is the PREVIEW · DEMO DATA marker.
 */
export function PhotoLabel(props: { className?: string }) {
  void props;
  void photoDirectionLabel;
  return null;
}

/**
 * A registered concept-image placement (src/data/demo-content.ts → imageUses).
 * PROPERTY_DIRECTION placements always show PHOTO DIRECTION · CONCEPT.
 */
export function ConceptImage({ id, locale, priority = false, depth, sizes, className = "" }: { id: string; locale: SiteLocale; priority?: boolean; depth?: number; sizes?: string; className?: string }) {
  const use = imageUse(id);
  // production edition: a DEMO placement has no image — the placement renders nothing
  if (!use) return null;
  // art-directed heroes: one intentional crop per breakpoint, never one generic object-position (OWNER overnight release §3)
  if (use.art) {
    const art = [[1920, 1600], [1440, 1200], [1024, 900], [768, 720]] as const;
    return (
      <picture>
        {art.map(([bp, min]) => <source key={bp} media={`(min-width: ${min}px)`} srcSet={publicAsset(`/assets/brand/${use.visual}-${bp}.webp`)} />)}
        <img src={publicAsset(`/assets/brand/${use.visual}-390.webp`)} alt={use.alt[locale]} className={`is-art ${className}`.trim()} loading={priority ? "eager" : "lazy"} fetchPriority={priority ? "high" : undefined} decoding="async" />
      </picture>
    );
  }
  const media = conceptMedia(use.visual, use.position);
  return (
    <>
      <ArtImage media={media} alt={use.alt[locale]} priority={priority} depth={depth} sizes={sizes} className={className} />
      {use.scope === "PROPERTY_DIRECTION" ? <PhotoLabel /> : null}
    </>
  );
}

/** True when this edition carries an image for the placement (production: approved illustrations only). */
export function hasConceptImage(id: string) {
  return imageUse(id) !== null;
}

/**
 * The quiet disclosure of an OWNER-approved illustration (ILLUSTRATIVE_APPROVED, OWNER "PRODUCTION V1" §2):
 * «Концептуальное изображение» — small, outside the aria-hidden media so it is read, never a warning badge.
 */
export function ConceptDisclosure({ id, locale, className = "" }: { id: string; locale: SiteLocale; className?: string }) {
  const use = imageUse(id);
  if (use?.evidence !== "ILLUSTRATIVE_APPROVED" || !use.disclosure) return null;
  return <p className={`xp-disclosure ${className}`.trim()}>{use.disclosure[locale]}</p>;
}

export function isPropertyDirection(id: string) {
  return imageUse(id)?.scope === "PROPERTY_DIRECTION";
}

/* ---------------------------------------------------------------- */
/* Typography                                                         */
/* ---------------------------------------------------------------- */

/** Display heading revealed line by line behind a mask (reduced motion: static). */
export function MaskTitle({ lines, as: Tag = "h2", className = "" }: { lines: ReactNode[]; as?: "h1" | "h2" | "h3" | "p"; className?: string }) {
  return (
    <Tag className={`xp-mask ${className}`.trim()} data-reveal>
      {lines.map((line, index) => (
        <span key={index} className="xp-mask__line" style={{ "--i": index } as CSSProperties}>
          <span>{line}</span>
        </span>
      ))}
    </Tag>
  );
}

/** Section opening: index number, label, title, optional lead — the one heading pattern of the system. */
export function Opening({ no, label, title, lead, tone = "light", children, as = "h2", className = "" }: { no?: string; label: string; title: ReactNode; lead?: ReactNode; tone?: "light" | "dark"; children?: ReactNode; as?: "h1" | "h2"; className?: string }) {
  const Tag = as;
  return (
    <div className={`xp-opening${tone === "dark" ? " xp-opening--dark" : ""} ${className}`.trim()} data-reveal>
      <p className="xp-eyebrow">
        {no ? <span className="xp-eyebrow__no">{no}</span> : null}
        <span>{label}</span>
      </p>
      <Tag className="xp-opening__title">{title}</Tag>
      {lead ? <p className="xp-opening__lead">{lead}</p> : null}
      {children}
    </div>
  );
}

/* ---------------------------------------------------------------- */
/* Facts                                                              */
/* ---------------------------------------------------------------- */

const demoLegend: Localized = {
  ro: "Valori demonstrative pentru previzualizare — vor fi înlocuite cu date aprobate.",
  ru: "Демонстрационные значения для превью — будут заменены утверждёнными данными.",
  en: "Demonstration values for the preview — to be replaced with approved data.",
};

/**
 * Hero figures (final craft pass 2026-10-08): two to four large numerals with a
 * one-line label underneath — "07 помещений · 04 свободно сейчас · 04 объекта".
 * Lighter than a ledger: no table, no column labels above the values.
 */
export function HeroFigures({ items, className = "" }: { items: { value: ReactNode; label: string; demo?: boolean }[]; className?: string }) {
  return (
    <dl className={`xp-figures ${className}`.trim()}>
      {items.map((item) => (
        <div key={item.label} className="xp-figures__item">
          <dt>{item.label}</dt>
          <dd>
            {item.value}
            {item.demo ? <DemoMark /> : null}
          </dd>
        </div>
      ))}
    </dl>
  );
}

/** Russian / Romanian / English plural: forms = [one, few, many] (RO and EN use one / many). */
export function plural(n: number, forms: readonly [string, string, string], locale: SiteLocale) {
  if (locale === "ru") {
    const mod10 = n % 10;
    const mod100 = n % 100;
    if (mod10 === 1 && mod100 !== 11) return forms[0];
    if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return forms[1];
    return forms[2];
  }
  return n === 1 ? forms[0] : forms[2];
}

export type LedgerItem = { label: string; point?: DataPoint; value?: ReactNode; hint?: string };

/**
 * Fact ledger: label over value. DEMO points are not rendered at all (OWNER
 * premium brief 2026-10-09 §29: no invented years, parking counts, plot areas,
 * dates or technical specifications on public pages); they stay in the
 * register until the OWNER supplies the real value.
 */
export function Ledger({ items: all, locale, tone = "light", size = "md", className = "" }: { items: LedgerItem[]; locale: SiteLocale; tone?: "light" | "dark"; size?: "md" | "lg"; className?: string }) {
  const items = all.filter((item) => item.value !== undefined || (item.point && item.point.status !== "DEMO"));
  if (!items.length) return null;
  const hasDemo = false;
  return (
    <div className={`xp-ledger xp-ledger--${size}${tone === "dark" ? " xp-ledger--dark" : ""} ${className}`.trim()}>
      <dl>
        {items.map((item) => (
          <div key={item.label} className="xp-ledger__item">
            <dt>{item.label}</dt>
            <dd>
              {item.value ?? item.point?.value[locale]}
              {item.point?.status === "DEMO" ? <DemoMark /> : null}
            </dd>
            {item.hint ? <span className="xp-ledger__hint">{item.hint}</span> : null}
          </div>
        ))}
      </dl>
      {hasDemo ? <DemoLegend locale={locale} /> : null}
    </div>
  );
}

/** DEMO status stays in the register and the gate; no per-value marks on public pages (OWNER acceptance brief 2026-10-08). */
export function DemoMark() {
  return null;
}

export function DemoLegend(props: { locale: SiteLocale; className?: string }) {
  void props;
  void demoLegend;
  return null;
}

/** Inline value with its demo ring when needed. */
export function Val({ point, locale }: { point: DataPoint; locale: SiteLocale }) {
  return (
    <>
      {point.value[locale]}
      {point.status === "DEMO" ? <DemoMark /> : null}
    </>
  );
}

/* ---------------------------------------------------------------- */
/* Preview marker                                                     */
/* ---------------------------------------------------------------- */

const markerNote: Localized = {
  ro: "Previzualizare pentru aprobare. Unele cifre, texte, fotografii și video sunt demonstrative și nu reprezintă date MEGAPARC.",
  ru: "Превью для согласования. Часть цифр, текстов, фотографий и видео — демонстрационные, это не данные MEGAPARC.",
  en: "Approval preview. Some figures, texts, photographs and video are demonstrations and are not MEGAPARC data.",
};

/**
 * PREVIEW · DEMO DATA — discreet, always visible while the build carries demo
 * content. Not part of the future production site.
 */
export function PreviewMarker({ locale }: { locale: SiteLocale }) {
  if (!demoContentPresent) return null;
  return (
    <aside className="xp-preview" aria-label="Preview · Demo data">
      <span className="xp-preview__dot" aria-hidden="true" />
      <span className="xp-preview__label" lang="en">Preview · Demo data</span>
      <span className="xp-preview__note">{markerNote[locale]}</span>
    </aside>
  );
}
