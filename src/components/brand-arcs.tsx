import { isProductionEdition } from "@/lib/site-data";

/**
 * The brand arcs (OWNER «APPROVED BRAND ALIGNMENT», 2026-11-18; Brand Guidelines, page «Brand Graphics»): the red, silver and graphite
 * bands of the approved business cards and letterhead — the guidelines' own geometry (a 90 × 50 card). Never deformed (the viewBox keeps
 * the proportion), never recoloured, never over text: placed at the bottom of a surface, once on a page, decorative only.
 *
 * OWNER «CORPORATE ARC REFINEMENT» (2026-11-20): the first crop (viewBox 30 28 60 22) cut the red band by the left edge of the drawing
 * — a vertical end in the middle of the dark section, read as a random edge. Three compositions of the same approved curves:
 *   A · controlled crop — the drawing is cut along the horizontal the red band's upper edge touches (y = 46,25 at x = 25,3), and starts
 *       there: the red band rises out of the section's bottom edge from nothing, the graphite line and the silver band follow from the
 *       same edge, and all three leave by the right edge. No end of a band is ever visible inside the section.
 *   B · contained accent — the whole stroke inside the section with margins; its two ends dissolve (a mask, no visible cut).
 *   C · minimal lines — the same three curves as fine lines (the bands' centre lines, the graphite line as it is), compact, rising from
 *       the bottom edge and leaving by the right one. A derivative of the approved graphic — to be accepted by the OWNER as brand use.
 */
type P = number[][];
const curve = (p: P) => `M${p[0].join(" ")} C${p[1].join(" ")} ${p[2].join(" ")} ${p[3].join(" ")}`;
const band = (a: P, b: P) => `${curve(a)} L${b[0].join(" ")} C${b[1].join(" ")} ${b[2].join(" ")} ${b[3].join(" ")} Z`;
const GRAPHITE = band([[31, 47.4], [52, 46.9], [73, 42], [90, 29.4]], [[90, 29.95], [73, 42.6], [52, 47.5], [31, 47.95]]);
const RED = band([[-1, 44.8], [30, 48], [62, 47], [91, 31.2]], [[91, 38], [66, 50.8], [32, 52.2], [-1, 48.8]]);
const SILVER = band([[30, 51], [54, 50.6], [75, 47.4], [91, 39.2]], [[91, 43], [77, 50.2], [60, 53], [40, 53]]);
// the centre lines of the red and the silver bands (the mean of each band's two edges)
const RED_LINE = curve([[-1, 46.8], [31, 50.1], [64, 48.9], [91, 34.6]]);
const SILVER_LINE = curve([[35, 52], [57, 51.8], [76, 48.8], [91, 41.1]]);

export type ArcsVariant = "a" | "b" | "c";
/** the composition shown when no review switch is set — and the only one the production edition renders */
export const ARCS_DEFAULT: ArcsVariant = "a";

function Bands() {
  return (
    <>
      <path d={GRAPHITE} fill="#545454" />
      <path d={RED} fill="#cb0102" />
      <path d={SILVER} fill="#c2c7c5" />
    </>
  );
}

function Arcs({ variant, className }: { variant: ArcsVariant; className: string }) {
  const cls = `brand-arcs brand-arcs--${variant} ${className}`.trim();
  if (variant === "a") return <svg className={cls} viewBox="25.3 29 64.7 17.25" aria-hidden="true" focusable="false"><Bands /></svg>;
  if (variant === "b") {
    return (
      <svg className={cls} viewBox="25.3 29 64.7 24.3" aria-hidden="true" focusable="false">
        <defs>
          <linearGradient id="brand-arcs-ends" gradientUnits="userSpaceOnUse" x1="25.3" y1="0" x2="90" y2="0">
            <stop offset="0" stopColor="#fff" stopOpacity="0" />
            <stop offset=".3" stopColor="#fff" stopOpacity="1" />
            <stop offset=".8" stopColor="#fff" stopOpacity="1" />
            <stop offset="1" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
          <mask id="brand-arcs-fade" maskUnits="userSpaceOnUse" x="25.3" y="29" width="64.7" height="24.3"><rect x="25.3" y="29" width="64.7" height="24.3" fill="url(#brand-arcs-ends)" /></mask>
        </defs>
        <g mask="url(#brand-arcs-fade)"><Bands /></g>
      </svg>
    );
  }
  return (
    <svg className={cls} viewBox="44 29 46 17.25" aria-hidden="true" focusable="false" fill="none">
      <path d={GRAPHITE} fill="#545454" />
      <path d={RED_LINE} stroke="#cb0102" strokeWidth="2" vectorEffect="non-scaling-stroke" />
      <path d={SILVER_LINE} stroke="#c2c7c5" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

/**
 * The arcs of a section. The production edition renders the default composition only. The OWNER preview renders the three and shows
 * one: «?arcs=a | b | c» chooses a composition for the review, «?arcs=none» shows the section without the arcs (the alternative the
 * mandate asks to show, never applied without an OWNER GO); a few lines of inline script set `<html data-arcs>` before the first paint.
 */
export function BrandArcs({ className = "" }: { className?: string }) {
  if (isProductionEdition) return <Arcs variant={ARCS_DEFAULT} className={className} />;
  const script = `(function(){try{var m=/[?&]arcs=(a|b|c|none)(?:&|$)/.exec(location.search);if(m)document.documentElement.setAttribute("data-arcs",m[1])}catch(e){}})()`;
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: script }} />
      {(["a", "b", "c"] as const).map((variant) => <Arcs key={variant} variant={variant} className={`${className} ${variant === ARCS_DEFAULT ? "is-default" : ""}`} />)}
    </>
  );
}
