import type { CSSProperties } from "react";
import { LgPhoto } from "@/components/leasing-experience/parts";
import { pathOf } from "@/components/leasing-experience/photo-scene";
import type { Photo, Pt, VisibilityMark } from "@/data/leasing-experience-model";
import type { SiteLocale } from "@/lib/site-data";

/**
 * ARCHITECTURAL AERIAL — OWNER «CORRECTIVE PASS R8» §01 (2026-11-13), redrawn from scratch over R4.
 * The real photograph, untouched; the annotation lives in the photograph's own pixel space and follows its architecture:
 *   · the volume of the premises is traced along its real edges — the back and front roof edges, the right corner, the plinth line
 *     and the left end — as one clean hexagon with a hairline ivory perimeter and the roof edge as a fainter inner line, so the box
 *     reads as architecture, never as a free-hand outline (a visual indication of the premises in the frame, never a cadastral boundary);
 *   · the surroundings step back: a soft graphite veil and, where the browser supports it, a desaturation through a masked backdrop
 *     filter — the building keeps its own colour and light;
 *   · one marker system: a point feature (the premises, the shopfronts, the entrance) carries a small pin on the feature and a hairline
 *     leader to its numbered badge; an area (the pavement, the boulevard) carries the badge alone; the shopfront frontage is an
 *     architect's dimension line in front of the plinth;
 *   · the name sits beside badge 1 over a calm, dark neighbouring roof — never over the architecture of the premises or a neighbour's sign;
 *     the wording of the five marks stays in the legend beside the picture.
 * Never: a red quadrangle, glow, thick arrows, plates of text, a free-hand contour. The meaning of the five marks and every fact are unchanged.
 */

/** a short tick across a line end — an architect's dimension end */
const tick = (a: Pt, b: Pt, size = 9) => {
  const ang = Math.atan2(b[1] - a[1], b[0] - a[0]) + Math.PI / 2;
  const dx = size * Math.cos(ang), dy = size * Math.sin(ang);
  return `M${(a[0] - dx).toFixed(1)} ${(a[1] - dy).toFixed(1)} L${(a[0] + dx).toFixed(1)} ${(a[1] + dy).toFixed(1)}`;
};
const pct = ([x, y]: Pt, w: number, h: number) => ({ left: `${(x / w) * 100}%`, top: `${(y / h) * 100}%` }) as CSSProperties;

export function AerialAnnotation({ photo, marks, name, caption, locale }: { photo: Photo; marks: VisibilityMark[]; name: string; caption: string; locale: SiteLocale }) {
  const { width: w, height: h } = photo;
  const object = marks.find((mark) => mark.kind === "object");
  const frame = `M0 0 H${w} V${h} H0 Z`;
  const outside = object ? `${frame} ${pathOf(object.shape)}` : "";
  // the desaturation layer: the same «frame minus premises» as a mask, scaled with the picture
  const mask = object ? `url("data:image/svg+xml,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${w} ${h}' preserveAspectRatio='none'><path fill-rule='evenodd' d='${outside}'/></svg>`)}")` : undefined;
  return (
    <figure className="lg-vis lg-air">
      <span className="lg-scene lg-air__scene">
        <LgPhoto photo={photo} locale={locale} ratio={`${w} / ${h}`} sizes="(min-width: 1024px) 64vw, 100vw" className="lg-scene__photo" />
        {mask ? <span className="lg-air__veil" style={{ WebkitMaskImage: mask, maskImage: mask } as CSSProperties} aria-hidden="true" /> : null}
        <svg className="lg-scene__draw lg-air__draw" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" aria-hidden="true" focusable="false">
          {object ? <path className="lg-air__dim" d={outside} fillRule="evenodd" /> : null}
          {object ? <path className="lg-air__volume" d={pathOf(object.shape)} /> : null}
          {object?.edge ? <path className="lg-air__edge" d={pathOf(object.edge, false)} /> : null}
          {marks.map((mark) => {
            if (mark.kind !== "glazing" || mark.shape.length < 2) return null;
            const pts = mark.shape, first = pts[0], last = pts[pts.length - 1];
            return <path key={mark.key} className="lg-air__dimension" d={`${pathOf(pts, false)} ${tick(first, pts[1])} ${tick(last, pts[pts.length - 2])}`} />;
          })}
          {marks.map((mark) => mark.pin ? (
            <g key={mark.key} className={`lg-air__pin is-${mark.kind}`}>
              <path d={pathOf([mark.pin, mark.at], false)} />
              <circle cx={mark.pin[0]} cy={mark.pin[1]} r={mark.kind === "object" ? 4.5 : 3.2} />
            </g>
          ) : null)}
        </svg>
        <span className="lg-air__marks" aria-hidden="true">
          {object ? <span className="lg-air__name" style={pct(object.at, w, h)}>{name}</span> : null}
          {marks.map((mark, i) => (
            <b key={mark.key} className={`lg-air__no is-${mark.kind}`} style={pct(mark.at, w, h)}>{i + 1}</b>
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
