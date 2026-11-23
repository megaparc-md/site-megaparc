import type { CSSProperties, ReactNode } from "react";
import { LgPhoto } from "@/components/leasing-experience/parts";
import type { Photo, Pt } from "@/data/leasing-experience-model";
import type { SiteLocale } from "@/lib/site-data";

/**
 * PHOTO SCENE — a real photograph shown whole (its own aspect ratio, no crop) with
 * a delicate drawing on top in the photograph's pixel space: the possible
 * organisation of the format lens, the visibility study of the location scene.
 * Labels are HTML (sharp type at any width): number + text on wide screens,
 * the number alone on phones with the legend below the picture.
 */

export const pathOf = (shape: Pt[], close = true) => `M${shape.map(([x, y]) => `${x} ${y}`).join(" L")}${close ? " Z" : ""}`;

export type SceneLabel = { key: string; no?: string; text: string; at: Pt; tone?: "zone" | "mark" };

export function PhotoScene({ photo, locale, sizes, drawing, labels, className = "" }: { photo: Photo; locale: SiteLocale; sizes: string; drawing: ReactNode; labels: SceneLabel[]; className?: string }) {
  const { width: w, height: h } = photo;
  return (
    <span className={`lg-scene ${className}`.trim()}>
      <LgPhoto photo={photo} locale={locale} ratio={`${w} / ${h}`} sizes={sizes} className="lg-scene__photo" />
      <svg className="lg-scene__draw" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" aria-hidden="true" focusable="false">
        {drawing}
      </svg>
      <span className="lg-scene__labels" aria-hidden="true">
        {labels.map((label) => (
          <span key={label.key} className={`lg-scene__label is-${label.tone ?? "zone"}${label.at[0] / w > 0.56 ? " is-flip" : ""}`} style={{ left: `${(label.at[0] / w) * 100}%`, top: `${(label.at[1] / h) * 100}%` } as CSSProperties}>
            {label.no ? <b>{label.no}</b> : <i />}
            <span>{label.text}</span>
          </span>
        ))}
      </span>
    </span>
  );
}

/**
 * MARKER SCENE — OWNER «PROPERTY COMMERCIAL EXPERIENCE 2026» Part C (2026-11-23): the real photograph whole, untouched, with minimal
 * interactive markers only — no colour zones, contours, veils, leader lines or arrows drawn over the architecture. Each marker is a small
 * numbered point on the feature it names; hover or keyboard focus shows its short label, the full wording stays in the legend beside the
 * picture. Used by «Какой бизнес вы рассматриваете?» and «Адрес — часть бизнес-модели» (the earlier red zones and the drawn aerial contour
 * are retired by this mandate).
 */
export type SceneMarker = { key: string; no: string; text: string; at: Pt; strong?: boolean };

export function MarkerScene({ photo, locale, sizes, markers, className = "", label }: { photo: Photo; locale: SiteLocale; sizes: string; markers: SceneMarker[]; className?: string; label: string }) {
  const { width: w, height: h } = photo;
  return (
    <span className={`lg-scene pce-mk ${className}`.trim()}>
      <LgPhoto photo={photo} locale={locale} ratio={`${w} / ${h}`} sizes={sizes} className="lg-scene__photo" />
      <span className="pce-mk__layer" role="group" aria-label={label}>
        {markers.map((marker) => (
          <button
            key={marker.key}
            type="button"
            className={`pce-mk__pt${marker.strong ? " is-strong" : ""}${marker.at[0] / w > 0.62 ? " is-flip" : ""}${marker.at[1] / h < 0.2 ? " is-low" : ""}`}
            style={{ left: `${(marker.at[0] / w) * 100}%`, top: `${(marker.at[1] / h) * 100}%` } as CSSProperties}
            aria-label={`${marker.no} · ${marker.text}`}
          >
            <b aria-hidden="true">{marker.no}</b>
            <span className="pce-mk__tip" aria-hidden="true">{marker.text}</span>
          </button>
        ))}
      </span>
    </span>
  );
}
