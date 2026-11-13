import type { CSSProperties } from "react";
import { LgPhoto } from "@/components/leasing-experience/parts";
import { pathOf } from "@/components/leasing-experience/photo-scene";
import type { Photo, Pt, VisibilityMark } from "@/data/leasing-experience-model";
import type { SiteLocale } from "@/lib/site-data";

/**
 * ARCHITECTURAL AERIAL (OWNER «LOCATION VISUAL INTELLIGENCE R4», 2026-11-12, §01) — the real photograph, untouched, with a
 * restrained architectural annotation in its own pixel space. No red quadrangle, no glow, no thick arrows, no plates on the picture:
 *   · the premises are read through a translucent graphite mask with a faint burgundy tint and a hairline perimeter drawn to the
 *     perspective of the photograph (a visual indication of the building in the frame — never a cadastral boundary);
 *   · five small numbered marks; their wording lives in the legend beside the picture (AerialLegend, the explorer's detail panel),
 *     so nothing covers the architecture;
 *   · thin guides only where a direction has to be read (shopfronts, the customer entrance, the pavement, the boulevard).
 * OWNER DECISION 2026-11-12: variant B «Premium Real Estate Intelligence» is final — a slight dimming of the surroundings, the name
 * set on the roof, the fine guides of the shopfronts, the entrance and the pavement. The long guide along the boulevard is removed:
 * the boulevard carries its number only, the photograph stays clean. Never bring back the red quadrangle or plates on the picture.
 * The meaning of the five marks and every fact are unchanged.
 */

const arrow = (from: Pt, to: Pt, size = 11) => {
  const ang = Math.atan2(to[1] - from[1], to[0] - from[0]);
  const p1: Pt = [to[0] - size * Math.cos(ang - 0.42), to[1] - size * Math.sin(ang - 0.42)];
  const p2: Pt = [to[0] - size * Math.cos(ang + 0.42), to[1] - size * Math.sin(ang + 0.42)];
  return `M${p1[0].toFixed(1)} ${p1[1].toFixed(1)} L${to[0]} ${to[1]} L${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
};
/** a short tick across the end of a line — an architect's dimension end, not an arrow */
const tick = (a: Pt, b: Pt, size = 9) => {
  const ang = Math.atan2(b[1] - a[1], b[0] - a[0]) + Math.PI / 2;
  const dx = size * Math.cos(ang), dy = size * Math.sin(ang);
  return `M${(a[0] - dx).toFixed(1)} ${(a[1] - dy).toFixed(1)} L${(a[0] + dx).toFixed(1)} ${(a[1] + dy).toFixed(1)}`;
};

export function AerialAnnotation({ photo, marks, name, caption, locale }: { photo: Photo; marks: VisibilityMark[]; name: string; caption: string; locale: SiteLocale }) {
  const { width: w, height: h } = photo;
  const object = marks.find((mark) => mark.kind === "object");
  const frame = `M0 0 H${w} V${h} H0 Z`;
  return (
    <figure className="lg-vis lg-air">
      <span className="lg-scene lg-air__scene">
        <LgPhoto photo={photo} locale={locale} ratio={`${w} / ${h}`} sizes="(min-width: 1024px) 64vw, 100vw" className="lg-scene__photo" />
        <svg className="lg-scene__draw lg-air__draw" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" aria-hidden="true" focusable="false">
          {/* B: the surroundings step back a little so the building reads first (even-odd: the frame minus the premises) */}
          {object ? <path className="lg-air__dim" d={`${frame} ${pathOf(object.shape)}`} fillRule="evenodd" /> : null}
          {object ? <path className="lg-air__mask" d={pathOf(object.shape)} /> : null}
          {marks.map((mark) => {
            // the boulevard has no guide (OWNER decision 2026-11-12) — its number and the legend say what it is
            if (mark.kind === "object" || mark.kind === "road") return null;
            const pts = mark.shape;
            const first = pts[0], last = pts[pts.length - 1];
            if (mark.kind === "glazing") return (
              <g key={mark.key} className="lg-air__guide is-frontage">
                <path d={pathOf(pts, false)} />
                <path className="lg-air__tick" d={tick(first, pts[1])} />
                <path className="lg-air__tick" d={tick(last, pts[pts.length - 2])} />
              </g>
            );
            if (mark.kind === "entrance") return (
              <g key={mark.key} className="lg-air__guide is-entrance">
                <path d={pathOf(pts, false)} />
                <circle cx={last[0]} cy={last[1]} r={7} />
              </g>
            );
            return (
              <g key={mark.key} className={`lg-air__guide is-${mark.kind}`}>
                <path d={pathOf(pts, false)} />
                <path className="lg-air__head" d={arrow(pts[pts.length - 2], last)} />
                <path className="lg-air__head" d={arrow(pts[1], first)} />
              </g>
            );
          })}
        </svg>
        <span className="lg-air__marks" aria-hidden="true">
          {object ? <span className="lg-air__name" style={{ left: `${(object.at[0] / w) * 100}%`, top: `${(object.at[1] / h) * 100}%` } as CSSProperties}>{name}</span> : null}
          {marks.map((mark, i) => (
            <b key={mark.key} className={`lg-air__no is-${mark.kind}`} style={{ left: `${(mark.at[0] / w) * 100}%`, top: `${(mark.at[1] / h) * 100}%` } as CSSProperties}>{i + 1}</b>
          ))}
        </span>
      </span>
      <figcaption className="lg-stage__caption">{caption}</figcaption>
    </figure>
  );
}

/** The wording of the five marks — beside the picture (the explorer's detail panel), never on the architecture. */
export function AerialLegend({ marks, locale, label }: { marks: VisibilityMark[]; locale: SiteLocale; label: string }) {
  return (
    <ol className="lg-air__legend" aria-label={label}>
      {marks.map((mark, i) => (
        <li key={mark.key}><b>{i + 1}</b><span>{mark.label[locale]}</span></li>
      ))}
    </ol>
  );
}
