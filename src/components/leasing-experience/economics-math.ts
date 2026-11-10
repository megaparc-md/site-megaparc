/**
 * The arithmetic of «Проверить экономику точки» — pure, no React, so it can be verified in isolation
 * (OWNER UX correction «REBUILD POINT ECONOMICS CALCULATOR», 2026-11-10, §21–22).
 *
 * QUICK CHECK — unchanged since the OWNER addendum of 2026-11-06:
 *   sales per month   = target revenue / average ticket
 *   sales per day     = sales per month / working days
 *   visitors per day  = sales per day / conversion
 *   sensitivity(rate) = sales per day / rate               (5 · 10 · 15 · 20 %)
 *
 * ADVANCED — as specified by the OWNER on 2026-11-10 (§12–15), replacing the earlier «CAPEX recovery target» logic
 * (CAPEX ÷ a payback period typed by the visitor, added to the gross profit the model needs):
 *   fixed costs          = rent + operating expenses + payroll + utilities + marketing + other fixed costs
 *   gross profit         = revenue × gross margin
 *   break-even revenue   = fixed costs / gross margin
 *   break-even visitors  = break-even revenue / ticket / working days / conversion
 *   operating result     = gross profit − fixed costs
 *   CAPEX payback        = CAPEX / operating result, in MONTHS — only while the operating result is positive
 * Without a gross margin nothing of the advanced part is calculated (no fake profitability).
 */

export type EconomicsInput = {
  ticket: number | null;
  revenue: number | null;
  /** % */
  margin: number | null;
  /** % */
  conversion: number | null;
  days: number;
  fixed: (number | null)[];
  capex: number | null;
};

export type EconomicsResult = {
  perMonth: number | null;
  perDay: number | null;
  visitors: number | null;
  sensitivity: { rate: number; visitors: number | null }[];
  fixedTotal: number;
  grossProfit: number | null;
  beRevenue: number | null;
  beVisitors: number | null;
  result: number | null;
  /** months */
  payback: number | null;
  /** CAPEX entered while the operating result is zero or negative — the payback is not calculated */
  paybackBlocked: boolean;
  advanced: "need-margin" | "need-fixed" | "ready";
};

export function calcEconomics(input: EconomicsInput, rates: number[]): EconomicsResult {
  const { ticket, revenue, margin, conversion, days, fixed, capex } = input;
  const perMonth = ticket && revenue ? revenue / ticket : null;
  const perDay = perMonth ? perMonth / days : null;
  const visitors = perDay && conversion ? perDay / (conversion / 100) : null;
  const sensitivity = rates.map((rate) => ({ rate, visitors: perDay ? perDay / (rate / 100) : null }));

  const fixedTotal = fixed.reduce<number>((sum, value) => sum + (value ?? 0), 0);
  const gm = margin ? margin / 100 : null;
  const grossProfit = revenue && gm ? revenue * gm : null;
  const beRevenue = gm && fixedTotal > 0 ? fixedTotal / gm : null;
  const beVisitors = beRevenue && ticket && conversion ? beRevenue / ticket / days / (conversion / 100) : null;
  const result = grossProfit !== null && fixedTotal > 0 ? grossProfit - fixedTotal : null;
  const payback = capex && result !== null && result > 0 ? capex / result : null;
  const paybackBlocked = Boolean(capex) && result !== null && result <= 0;
  const advanced = !gm ? "need-margin" : fixedTotal > 0 ? "ready" : "need-fixed";

  return { perMonth, perDay, visitors, sensitivity, fixedTotal, grossProfit, beRevenue, beVisitors, result, payback, paybackBlocked, advanced };
}

/**
 * A positive number from a typed value, or null. Grouping and decimal marks follow what the visitor typed, not the locale:
 * «1 200 000» · «1.200.000» · «1,200,000» → 1 200 000; «12,5» · «12.5» → 12,5; «1.200.000,50» → 1 200 000,5.
 * (Before 2026-11-10 a dot was always a decimal point, so the Romanian example «1.200.000» produced no result.)
 */
export const parseAmount = (value: string) => {
  let v = value.replace(/[\s   ]/g, "");
  const dot = v.lastIndexOf(".");
  const comma = v.lastIndexOf(",");
  if (dot >= 0 && comma >= 0) {
    // both present — the later one is the decimal mark, the other groups thousands
    v = dot > comma ? v.replace(/,/g, "") : v.replace(/\./g, "").replace(",", ".");
  } else if (dot >= 0 || comma >= 0) {
    const mark = dot >= 0 ? "." : ",";
    const parts = v.split(mark);
    // repeated marks, or one mark followed by exactly three digits (1.200 · 12,000) → grouping; otherwise a decimal mark
    const grouping = parts.every((p) => /^\d+$/.test(p)) && (parts.length > 2 || (parts.length === 2 && parts[1].length === 3 && parts[0].length > 0));
    v = grouping ? parts.join("") : parts.join(".");
  }
  const n = Number(v);
  return Number.isFinite(n) && n > 0 ? n : null;
};
/** A percentage between 0 and 100, or null. */
export const parsePercent = (value: string) => {
  const n = parseAmount(value);
  return n !== null && n <= 100 ? n : null;
};
