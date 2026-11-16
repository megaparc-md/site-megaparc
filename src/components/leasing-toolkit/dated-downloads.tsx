"use client";

import { useEffect, useSyncExternalStore } from "react";
import { chisinauToday, nbmDisplayDate } from "@/lib/nbm";
import type { SiteLocale } from "@/lib/site-data";

/**
 * THE DATE OF A DOWNLOAD (OWNER «PDF DATE», 2026-11-16). The commercial proposal is a static file (it cannot be re-dated at each download);
 * its footer carries the date it was generated (src/components/leasing-toolkit/generated-date.tsx). The site adds the date of the
 * download where the browser knows it: beside the Leasing Pack button («Актуальная версия на DD.MM.YYYY») and in the name of the saved
 * file — MEGAPARC-Moscova-20-RU-DD.MM.YYYY.pdf — while its URL stays MEGAPARC-Moscova-20-RU.pdf. Today = the calendar date in Chișinău.
 */
export const currentVersionCopy: Record<SiteLocale, (date: string) => string> = {
  ro: (date) => `Versiune actualizată la ${date}`,
  ru: (date) => `Актуальная версия на ${date}`,
  en: (date) => `Current version as of ${date}`,
};

const noSubscription = () => () => {};
/** today in Chișinău as DD.MM.YYYY — null in the server render (a static page has no "today") */
export function useToday(): string | null {
  const iso = useSyncExternalStore(noSubscription, chisinauToday, () => null);
  return iso ? nbmDisplayDate(iso) : null;
}

/** the saved name of a commercial proposal file of `href` on `date` — MEGAPARC-Moscova-20-RU.pdf → MEGAPARC-Moscova-20-RU-16.11.2026.pdf */
export function datedName(href: string, date: string): string | null {
  const name = decodeURIComponent(href.split(/[?#]/)[0].split("/").pop() ?? "");
  return /^MEGAPARC-Moscova-20-(RO|RU|EN)\.pdf$/.test(name) ? name.replace(/\.pdf$/, `-${date}.pdf`) : null;
}

/** Every download link of the commercial proposal on the page gets the dated file name (mounted once by the page shell). */
export function DatedDownloadNames() {
  const today = useToday();
  useEffect(() => {
    if (!today) return;
    const apply = () => {
      for (const a of document.querySelectorAll<HTMLAnchorElement>('a[download][href*="/MEGAPARC-Moscova-20-"]')) {
        const name = datedName(a.getAttribute("href") ?? "", today);
        if (name && a.getAttribute("download") !== name) a.setAttribute("download", name);
      }
    };
    apply();
    // drawers and client sections render their links later
    const observer = new MutationObserver(apply);
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [today]);
  return null;
}
