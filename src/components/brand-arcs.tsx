/**
 * The brand arcs (OWNER «APPROVED BRAND ALIGNMENT», 2026-11-18; Brand Guidelines, page «Brand Graphics»): the red, silver and graphite
 * bands of the approved business cards and letterhead — the guidelines' own geometry (a 90 × 50 card). Never deformed (the viewBox keeps
 * the proportion), never recoloured, never over text: placed at the bottom of a surface, once on a page, decorative only.
 *
 * Composition A «Controlled Crop» (OWNER FINAL GO «PREMIUM ENTRANCE A + CORPORATE ARCS A», 2026-11-20). The first crop
 * (viewBox 30 28 60 22) cut the red band by the left edge of the drawing — a vertical end in the middle of the dark section, read as a
 * random edge. Now the drawing is cut along the horizontal the red band's upper edge touches (y = 46,25 at x = 25,3) and starts there:
 * the red band rises out of the section's bottom edge from nothing, the graphite line and the silver band follow from the same edge,
 * and all three leave by the right edge — no end of a band is ever visible inside the section. Compositions B (contained) and C (fine
 * lines) were reviewed and not chosen (record docs/qa/2026-11-20-premium-entrance-arcs/).
 */
type P = number[][];
const band = (a: P, b: P) => `M${a[0].join(" ")} C${a[1].join(" ")} ${a[2].join(" ")} ${a[3].join(" ")} L${b[0].join(" ")} C${b[1].join(" ")} ${b[2].join(" ")} ${b[3].join(" ")} Z`;
const GRAPHITE = band([[31, 47.4], [52, 46.9], [73, 42], [90, 29.4]], [[90, 29.95], [73, 42.6], [52, 47.5], [31, 47.95]]);
const RED = band([[-1, 44.8], [30, 48], [62, 47], [91, 31.2]], [[91, 38], [66, 50.8], [32, 52.2], [-1, 48.8]]);
const SILVER = band([[30, 51], [54, 50.6], [75, 47.4], [91, 39.2]], [[91, 43], [77, 50.2], [60, 53], [40, 53]]);

export function BrandArcs({ className = "" }: { className?: string }) {
  return (
    <svg className={`brand-arcs ${className}`.trim()} viewBox="25.3 29 64.7 17.25" aria-hidden="true" focusable="false">
      <path d={GRAPHITE} fill="#545454" />
      <path d={RED} fill="#cb0102" />
      <path d={SILVER} fill="#c2c7c5" />
    </svg>
  );
}
