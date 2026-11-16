import snapshot from "../../public/data/nbm-eur-mdl.json";
import { isNbmRecord, type NbmRecord } from "@/lib/nbm";

/**
 * The NBM EUR / MDL record a build carries (OWNER «AUTOMATIC NBM FX», 2026-11-16) — public/data/nbm-eur-mdl.json, written by
 * scripts/nbm-rate.mjs. It is only the first value of the calculators: when the page loads they read the live file
 * /data/nbm-eur-mdl.json (kept current by the scheduled workflow) and use it when it is newer (src/lib/nbm.ts).
 */
if (!isNbmRecord(snapshot)) throw new Error("public/data/nbm-eur-mdl.json is not a valid NBM rate record — run node scripts/nbm-rate.mjs");
export const nbmSnapshot: NbmRecord = snapshot;
