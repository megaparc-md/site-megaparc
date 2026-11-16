"use client";

import { useSyncExternalStore } from "react";
import { chisinauToday, nbmDisplayDate } from "@/lib/nbm";
import type { SiteLocale } from "@/lib/site-data";

/**
 * THE DATE OF A PRINTED DOCUMENT (OWNER «PDF DATE», 2026-11-16) — the commercial proposal PDF is a static file: it cannot change at each
 * download, and it never pretends to. Its footer carries the date the file was generated, inserted automatically when the print source
 * is opened for printing (the calendar date in Chișinău, read in the browser) — never typed by hand. On the site, the Leasing Pack shows
 * the date of the download beside the button and the saved file carries it in its name (src/components/leasing-toolkit/dated-downloads.tsx).
 */
export const generatedCopy: Record<SiteLocale, string> = { ro: "Generat", ru: "Сформировано", en: "Generated" };

const noSubscription = () => () => {};

export function GeneratedDate({ locale }: { locale: SiteLocale }) {
  // the server render has no date (the print source is a static page): the browser that prints it writes today's
  const today = useSyncExternalStore(noSubscription, chisinauToday, () => null);
  return <span className="r41-generated" suppressHydrationWarning>{today ? `${generatedCopy[locale]} ${nbmDisplayDate(today)}` : null}</span>;
}
