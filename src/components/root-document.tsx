import { Geist, Source_Serif_4 } from "next/font/google";
import type { ReactNode } from "react";
import { RouteTransition } from "@/components/route-transition";
import type { SiteLocale } from "@/lib/site-data";

/**
 * Brand Guidelines 2025 specify Canva Sans for headline and body.
 * No licensed Canva Sans webfont is in the repository, so `--font` in
 * globals.css lists "Canva Sans" first and falls back to Geist Sans, then
 * Arial / Helvetica. When the licensed file is supplied, register it here.
 */
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "latin-ext", "cyrillic"],
});

/**
 * Editorial serif (OWNER R3.1 «SERIF + SANS», 2026-11-09): Source Serif 4 — variable weight + optical size, so
 * display sizes get the refined display cut and small sizes the text cut; complete Cyrillic (incl. extended),
 * Romanian comma-below ș / ț. One serif + one sans only (Geist stays the sans). docs/DESIGN_SYSTEM.md §26.
 */
const sourceSerif = Source_Serif_4({
  variable: "--font-serif",
  subsets: ["latin", "latin-ext", "cyrillic", "cyrillic-ext"],
  axes: ["opsz"],
  display: "swap",
});

/**
 * Shared <html> document for the three locale root layouts.
 * Each locale tree has its own root layout, so the static HTML carries the
 * correct `lang` before any JavaScript runs.
 */
export function RootDocument({ locale, children }: { locale: SiteLocale; children: ReactNode }) {
  return (
    <html lang={locale} className={`${geistSans.variable} ${sourceSerif.variable} antialiased`}>
      <body>
        <RouteTransition />
        {children}
      </body>
    </html>
  );
}
