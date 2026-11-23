/**
 * The brand arcs (OWNER «APPROVED BRAND ALIGNMENT», 2026-11-18; Brand Guidelines, page «Brand Graphics»): the red, silver and graphite
 * bands of the approved business cards and letterhead — the guidelines' own geometry (a 90 × 50 card), cropped to the right part of the
 * card bottom so the bands rise from the lower edge and leave by the right one, as on the card. Never deformed (the viewBox keeps the
 * proportion), never recoloured, never over text: placed at the bottom of a surface, once on a page, decorative only.
 */
const band = (a: number[][], b: number[][]) => `M${a[0].join(" ")} C${a[1].join(" ")} ${a[2].join(" ")} ${a[3].join(" ")} L${b[0].join(" ")} C${b[1].join(" ")} ${b[2].join(" ")} ${b[3].join(" ")} Z`;
const GRAPHITE = band([[31, 47.4], [52, 46.9], [73, 42], [90, 29.4]], [[90, 29.95], [73, 42.6], [52, 47.5], [31, 47.95]]);
const RED = band([[-1, 44.8], [30, 48], [62, 47], [91, 31.2]], [[91, 38], [66, 50.8], [32, 52.2], [-1, 48.8]]);
const SILVER = band([[30, 51], [54, 50.6], [75, 47.4], [91, 39.2]], [[91, 43], [77, 50.2], [60, 53], [40, 53]]);

export function BrandArcs({ className = "" }: { className?: string }) {
  return (
    <svg className={`brand-arcs ${className}`.trim()} viewBox="30 28 60 22" aria-hidden="true" focusable="false">
      <path d={GRAPHITE} fill="#545454" />
      <path d={RED} fill="#cb0102" />
      <path d={SILVER} fill="#c2c7c5" />
    </svg>
  );
}
