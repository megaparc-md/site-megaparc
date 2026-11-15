/**
 * CURRENCY SWITCH MDL / EUR for the calculators (OWNER «CALCULATOR CURRENCY R1», 2026-11-15) — pure, no React.
 *
 * A currency switch re-expresses money; it never changes a calculation:
 *   · every money field remembers the value AS TYPED and the currency it was typed in ({ v, c }); switching the display only shows a
 *     converted copy — MDL → EUR → MDL returns exactly what was typed, however often it is switched (no rounding drift);
 *   · a value typed in EUR (e.g. a contractual rent in euros) stays euros: its MDL equivalent follows the rate; a value typed in MDL stays
 *     lei: its euro equivalent follows the rate;
 *   · the calculator computes in its own base currency (the producer model in EUR, the point economics in MDL) with the formulas
 *     unchanged; money results are converted for display — the models are linear in money, so the result in the other currency equals
 *     a calculation made in that currency (checked by scripts/qa-currency.mjs);
 *   · the rate is the official NBM reference rate of its date (src/data/nbm-rate.ts) or a rate the visitor types for a scenario — it
 *     converts; it is not an analysis of exchange-rate risk.
 */

export type Currency = "MDL" | "EUR";
export type Money = { v: string; c: Currency };

const isNum = (n: number) => Number.isFinite(n);

/** a canonical value («1200000.5») as a number, or null when empty */
export function valueOf(canonical: string): number | null {
  if (!canonical || canonical === ".") return null;
  const n = Number(canonical);
  return isNum(n) ? n : null;
}

/** an amount from one currency to another; rate = MDL for 1 EUR */
export function convert(x: number, from: Currency, to: Currency, rate: number): number {
  if (from === to) return x;
  return from === "EUR" ? x * rate : x / rate;
}

/** a number as a canonical field value, at most two decimals, no trailing zeros («20157.4», «1200») */
export function canonical(x: number): string {
  if (!isNum(x)) return "";
  const s = (Math.round(x * 100) / 100).toFixed(2);
  return s.replace(/\.?0+$/, "");
}

/** what the field shows in the display currency: the typed value itself in its own currency, a converted copy otherwise */
export function shown(m: Money, display: Currency, rate: number): string {
  if (m.c === display) return m.v;
  const x = valueOf(m.v);
  return x === null ? "" : canonical(convert(x, m.c, display, rate));
}

/** the field's amount in the calculator's base currency, at full precision (never from the rounded display copy) */
export function amountIn(m: Money, base: Currency, rate: number): number | null {
  const x = valueOf(m.v);
  return x === null ? null : convert(x, m.c, base, rate);
}

/** a rate typed by the visitor (canonical), or null when it is not a usable rate */
export function rateOf(canonicalRate: string): number | null {
  const n = valueOf(canonicalRate);
  return n !== null && n > 0 ? n : null;
}
