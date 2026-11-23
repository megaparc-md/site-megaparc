import type { ReactNode } from "react";
import { RouteTransition } from "@/components/route-transition";
import { publicAsset, type SiteLocale } from "@/lib/site-data";

/**
 * TYPOGRAPHY — MANROPE (OWNER «MEGAPARC TYPOGRAPHY ALIGNMENT WITH FINMENTOR», 2026-11-12).
 * One family for the whole public site, the same self-hosted Manrope 4.505 strategy as FINMENTOR: five static weights
 * (300 · 400 · 500 · 600 · 700; Latin, Latin Extended, Cyrillic in each file) under /fonts/manrope-4.505/ (SIL OFL 1.1, OFL.txt
 * beside the files), `font-display: swap`, the first-view weights preloaded (300 · 400 · 600 · 700; 500 loads on demand), and a
 * metric-compatible «Manrope Fallback» face over local Arial (FINMENTOR's values) so the swap does not shift the layout.
 * No request to Google Fonts. Source Serif 4 and Geist are retired (the R3.1 «serif + sans» rule is superseded).
 * The stack and the roles live in globals.css (`--font`) and type.css.
 */
const WEIGHTS = [300, 400, 500, 600, 700] as const;
const PRELOAD = [300, 400, 600, 700] as const;
const file = (weight: number) => publicAsset(`/fonts/manrope-4.505/Manrope-${weight}.woff2`);

/** FINMENTOR brand tokens: Arial metrics adjusted per weight (regular Arial up to 500, Arial Bold from 600) */
const FALLBACK: Record<(typeof WEIGHTS)[number], { local: string; size: string; ascent: string; descent: string }> = {
  300: { local: 'local("Arial"),local("ArialMT")', size: "102.62%", ascent: "103.88%", descent: "29.24%" },
  400: { local: 'local("Arial"),local("ArialMT")', size: "104.55%", ascent: "101.96%", descent: "28.69%" },
  500: { local: 'local("Arial"),local("ArialMT")', size: "106.52%", ascent: "100.08%", descent: "28.16%" },
  600: { local: 'local("Arial Bold"),local("Arial-BoldMT")', size: "100.59%", ascent: "105.98%", descent: "29.82%" },
  700: { local: 'local("Arial Bold"),local("Arial-BoldMT")', size: "102.38%", ascent: "104.12%", descent: "29.30%" },
};

const fontFaces = WEIGHTS.map(
  (w) =>
    `@font-face{font-family:"Manrope";font-style:normal;font-weight:${w};font-display:swap;src:url("${file(w)}") format("woff2")}` +
    `@font-face{font-family:"Manrope Fallback";font-style:normal;font-weight:${w};src:${FALLBACK[w].local};size-adjust:${FALLBACK[w].size};ascent-override:${FALLBACK[w].ascent};descent-override:${FALLBACK[w].descent};line-gap-override:0.00%}`,
).join("");

/**
 * Shared <html> document for the three locale root layouts.
 * Each locale tree has its own root layout, so the static HTML carries the
 * correct `lang` before any JavaScript runs.
 */
export function RootDocument({ locale, children }: { locale: SiteLocale; children: ReactNode }) {
  return (
    <html lang={locale} className="antialiased">
      {/* App Router root layout: a real <head> is correct here (the lint rule targets the Pages Router) */}
      {/* eslint-disable-next-line @next/next/no-head-element */}
      <head>
        {PRELOAD.map((w) => (
          <link key={w} rel="preload" href={file(w)} as="font" type="font/woff2" crossOrigin="anonymous" />
        ))}
        <style dangerouslySetInnerHTML={{ __html: fontFaces }} />
      </head>
      <body>
        <RouteTransition />
        {children}
      </body>
    </html>
  );
}
