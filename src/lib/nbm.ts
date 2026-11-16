import { publicAsset } from "@/lib/site-data";

/**
 * THE NBM RATE RECORD on the page (OWNER «AUTOMATIC NBM FX», 2026-11-16). The two calculators read one static file when the page loads —
 * /data/nbm-eur-mdl.json, kept current by the scheduled workflow of the production repository (scripts/nbm-rate.mjs) — and both use the
 * same official rate of the same date. The record a build carries (src/data/nbm-rate.ts) is only the first value before the file is read.
 * A fetched record is used only when it is valid and not older than the one in hand; the page never calls a rate "today's" unless its
 * date is today in Europe/Chisinau and its last check succeeded.
 */
export type NbmRecord = {
  schema: "megaparc-nbm-rate/1";
  base: "EUR";
  quote: "MDL";
  /** MDL for 1 EUR */
  rate: number;
  /** the date the NBM rate is in force, ISO */
  date: string;
  source: string;
  publisher?: string;
  fetchedAt: string;
  /** ok · unavailable (the NBM could not be reached at the last check) · rejected (its last answer was not accepted) */
  status: "ok" | "unavailable" | "rejected";
  statusAt?: string;
  note?: string | null;
};

export const NBM_TZ = "Europe/Chisinau";
export const NBM_FILE = "/data/nbm-eur-mdl.json";

export function isNbmRecord(x: unknown): x is NbmRecord {
  const r = x as Partial<NbmRecord> | null;
  return !!r && r.schema === "megaparc-nbm-rate/1" && r.base === "EUR" && r.quote === "MDL" && typeof r.rate === "number" && r.rate > 10 && r.rate < 40
    && typeof r.date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(r.date) && typeof r.source === "string" && r.source.startsWith("https://www.bnm.md/")
    && (r.status === "ok" || r.status === "unavailable" || r.status === "rejected");
}

/** the calendar date in Chișinău, ISO */
export function chisinauToday(now = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: NBM_TZ, year: "numeric", month: "2-digit", day: "2-digit" }).format(now);
}

/** 2026-11-16 → 16.11.2026 */
export const nbmDisplayDate = (iso: string) => iso.split("-").reverse().join(".");

/** b is newer than a: a later date of the rate, or the same date checked later */
export const isNewerRecord = (b: NbmRecord, a: NbmRecord) => b.date > a.date || (b.date === a.date && (b.fetchedAt > a.fetchedAt || (b.statusAt ?? "") > (a.statusAt ?? "")));

/** the rate of TODAY in Chișinău, confirmed at the last check — otherwise the page names it the latest published rate of its date */
export const isTodaysRate = (r: NbmRecord, today: string) => r.date === today && r.status === "ok";

// one request per page, shared by every calculator on it
let loading: Promise<NbmRecord | null> | null = null;
export function loadNbmRecord(): Promise<NbmRecord | null> {
  if (!loading) {
    loading = fetch(publicAsset(NBM_FILE), { cache: "no-cache" })
      .then((res) => (res.ok ? res.json() : null))
      .then((json: unknown) => (isNbmRecord(json) ? json : null))
      .catch(() => null);
  }
  return loading;
}
