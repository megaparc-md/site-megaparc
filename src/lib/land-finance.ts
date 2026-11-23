/**
 * LAND DEVELOPMENT MODEL 2.0 — the financial engine of the land calculator (OWNER STRATEGIC MANDATE «DROCHIA · DEVELOPMENT & INVESTMENT
 * EXPERIENCE» §10–§11, 2026-11-23). Pure functions, no UI, no site data: every figure comes from the visitor's inputs or from a labelled
 * demonstration preset. Methodology: docs/finance/LAND_DEVELOPMENT_MODEL_V2.md; independent check: scripts/qa-land-finance.mjs (a second
 * ledger written from the methodology, never this module's own logic).
 *
 * Three models on one monthly cash-flow ledger (month 0 = the start of the project):
 *   A · sale  — build and sell: receipts spread over the sales period after completion;
 *   B · hold  — build and lease long term: lease-up to the stabilised occupancy, annual indexation, exit at the end of the hold;
 *   C · bts   — build-to-suit: one tenant from completion for the lease term; the minimum rent that meets the owner's required return,
 *               and an early-termination scenario.
 *
 * Separation (§11), each counted exactly once:
 *   · LAND = the economic value of the owned asset contributed at month 0 — part of the project's economic base, NEVER a cash outflow of
 *     the «cash invested» view and never inside CAPEX;
 *   · CASH INVESTED = construction + design + external networks + landscaping + permits + contingency (the contingency is charged once,
 *     on those five lines; never on land, financing or tax);
 *   · FINANCING = a loan of `ltc` % of each month's development cost, interest at one effective monthly rate (1 + r)^(1/12) − 1, rolled up
 *     during construction; A repays from the sales receipts, B / C pay interest from operations and repay at the exit;
 *   · TAX = a simplified profit tax (no depreciation, no loss carry-forward): A on the realised profit; B / C on the monthly operating
 *     result and on the exit gain; the unlevered view taxes the result before interest, the equity view after it. Since 2.1 (R2) the
 *     land's market value is NOT a tax deduction: the economic value of an owned asset is an opportunity cost, not a deductible expense
 *     (the deductible book value is MEGAPARC-internal and not modelled) — so the land enters the flows exactly once, at month 0, and the
 *     cash flows (the return on the additional investment) never depend on it;
 *   · REVENUE and OPERATING COSTS (sales commission · non-recoverable operating costs · exit costs) apart.
 * IRR and NPV are read from the dated monthly flows (never a profit formula); the monthly IRR is annualised (1 + m)^12 − 1; NPV discounts
 * with the same effective monthly rate. An IRR that has no sign change of the NPV in the search range is «not defined» (null), never
 * forced. Every amount is excluding VAT.
 */

export type ModelKey = "sale" | "hold" | "bts";

export type Inputs = {
  model: ModelKey;
  // site and building
  siteArea: number | null;
  coverage: number | null;
  floors: number | null;
  gbaManual: number | null;
  efficiency: number | null;
  // development costs (excl. VAT)
  hard: number | null;
  design: number | null;
  networks: number | null;
  landscaping: number | null;
  permits: number | null;
  contingency: number | null;
  // land
  landValue: number | null;
  includeLand: boolean;
  // schedule
  preMonths: number | null;
  buildMonths: number | null;
  // financing, tax, discount
  ltc: number | null;
  interest: number | null;
  tax: number | null;
  discount: number | null;
  // A · sale
  price: number | null;
  salesMonths: number | null;
  commission: number | null;
  // B · hold and C · bts
  rent: number | null;
  occupancy: number | null;
  leaseUp: number | null;
  opex: number | null;
  indexation: number | null;
  holdYears: number | null;
  exitYield: number | null;
  exitCosts: number | null;
  // C · bts
  leaseYears: number | null;
  target: number | null;
  breakYear: number | null;
  voidMonths: number | null;
  reletPct: number | null;
  breakFee: number | null;
};

export const emptyInputs = (model: ModelKey, siteArea: number | null): Inputs => ({
  model, siteArea, coverage: null, floors: null, gbaManual: null, efficiency: null,
  hard: null, design: null, networks: null, landscaping: null, permits: null, contingency: null,
  landValue: null, includeLand: true, preMonths: null, buildMonths: null,
  ltc: null, interest: null, tax: null, discount: null,
  price: null, salesMonths: null, commission: null,
  rent: null, occupancy: null, leaseUp: null, opex: null, indexation: null, holdYears: null, exitYield: null, exitCosts: null,
  leaseYears: null, target: null, breakYear: null, voidMonths: null, reletPct: null, breakFee: null,
});

export type InputKey = Exclude<keyof Inputs, "model" | "includeLand">;

/** required inputs per model (an optional one is read as 0: networks, landscaping, permits, contingency, land, financing, tax, …) */
const REQUIRED: Record<ModelKey, InputKey[]> = {
  sale: ["siteArea", "efficiency", "hard", "buildMonths", "discount", "price", "salesMonths"],
  hold: ["siteArea", "efficiency", "hard", "buildMonths", "discount", "rent", "occupancy", "holdYears", "exitYield"],
  bts: ["siteArea", "efficiency", "hard", "buildMonths", "leaseYears", "target", "exitYield"],
};

/** inputs that must be above zero when required (a 0 % discount or required return is a valid choice) */
const POSITIVE = new Set<InputKey>(["siteArea", "efficiency", "hard", "buildMonths", "price", "salesMonths", "rent", "occupancy", "holdYears", "exitYield", "leaseYears"]);

/** plausibility limits — a value outside is reported, never silently clamped */
const LIMITS: Partial<Record<InputKey, [number, number]>> = {
  coverage: [0, 100], floors: [0, 40], efficiency: [1, 100], design: [0, 100], contingency: [0, 100],
  preMonths: [0, 120], buildMonths: [1, 120], salesMonths: [1, 240], leaseUp: [0, 120],
  ltc: [0, 95], interest: [0, 50], tax: [0, 60], discount: [0, 50], commission: [0, 50],
  occupancy: [0, 100], opex: [0, 100], indexation: [0, 30], holdYears: [1, 40], exitYield: [0.5, 40], exitCosts: [0, 50],
  leaseYears: [1, 40], target: [0, 50], breakYear: [0, 40], voidMonths: [0, 120], reletPct: [0, 200], breakFee: [0, 120],
};

export type Issue = { key: InputKey | "gba" | "break"; kind: "missing" | "range" };

export type Ledger = {
  model: ModelKey;
  months: number;
  completion: number;
  /** per month, positive = inflow */
  land: number[];
  devCost: number[];
  revenue: number[];
  saleCosts: number[];
  noi: number[];
  terminal: number[];
  taxUnlevered: number[];
  taxLevered: number[];
  draw: number[];
  interestPaid: number[];
  repay: number[];
  unlevered: number[];
  levered: number[];
  cash: number[];
  interestTotal: number;
};

export type Summary = {
  gba: number;
  net: number;
  costs: { hard: number; design: number; networks: number; landscaping: number; permits: number; contingency: number; cash: number; land: number; economic: number; interest: number; saleCosts: number; tax: number };
  revenue: number;
  /** after tax, after financing */
  profit: number;
  profitUnlevered: number;
  roi: number | null;
  marginOnRevenue: number | null;
  irrProject: number | null;
  irrCash: number | null;
  irrEquity: number | null;
  npv: number;
  npvEquity: number;
  /** NPV of the cash flows without the land line — the return on the ADDITIONAL investment in construction (R2) */
  npvCash: number;
  peakEquity: number;
  paybackMonths: number | null;
  noiStabilised: number | null;
  yieldOnCost: number | null;
  terminalValue: number | null;
  simplePaybackYears: number | null;
};

export type Result = { ok: true; inputs: Inputs; ledger: Ledger; summary: Summary } | { ok: false; issues: Issue[] };

const v = (x: number | null | undefined) => (x === null || x === undefined || !Number.isFinite(x) ? 0 : x);
export const monthlyRate = (annualPct: number) => Math.pow(1 + annualPct / 100, 1 / 12) - 1;
const sum = (a: number[]) => a.reduce((s, x) => s + x, 0);

export function npvOf(flows: number[], annualPct: number): number {
  const d = monthlyRate(annualPct);
  return flows.reduce((s, cf, t) => s + cf / Math.pow(1 + d, t), 0);
}

/**
 * annualised IRR of monthly flows, or null when it is not defined. The NPV is scanned over monthly rates from −30 % to +100 % (annual
 * −98,6 % … +409 500 %); every sign change is refined by bisection; when the flows have more than one root, the investment-type root
 * (NPV falling as the rate rises) closest to zero is returned — the convention of a project that spends first and earns later.
 */
export function irrOf(flows: number[]): number | null {
  if (!flows.some((x) => x > 0) || !flows.some((x) => x < 0)) return null;
  const f = (m: number) => flows.reduce((s, cf, t) => s + cf / Math.pow(1 + m, t), 0);
  const roots: { m: number; falling: boolean }[] = [];
  const step = 0.0025;
  let a = -0.3, fa = f(a);
  for (let b = a + step; b <= 1.0000001; b += step) {
    const fb = f(b);
    if (Number.isFinite(fa) && Number.isFinite(fb) && (fa === 0 || fa * fb < 0)) {
      let lo = a, hi = b, flo = fa;
      for (let k = 0; k < 100 && hi - lo > 1e-13; k++) {
        const mid = (lo + hi) / 2;
        const fm = f(mid);
        if (flo * fm <= 0) hi = mid; else { lo = mid; flo = fm; }
      }
      roots.push({ m: (lo + hi) / 2, falling: fa > fb });
    }
    a = b; fa = fb;
  }
  if (!roots.length) return null;
  const pool = roots.some((r) => r.falling) ? roots.filter((r) => r.falling) : roots;
  const best = pool.reduce((x, y) => (Math.abs(y.m) < Math.abs(x.m) ? y : x));
  return Math.pow(1 + best.m, 12) - 1;
}

export function gbaOf(i: Inputs): number | null {
  if (i.gbaManual !== null && i.gbaManual > 0) return i.gbaManual;
  if (i.siteArea && i.coverage && i.floors) return i.siteArea * (i.coverage / 100) * i.floors;
  return null;
}

export function validate(i: Inputs): Issue[] {
  const issues: Issue[] = [];
  for (const key of REQUIRED[i.model]) if (i[key] === null || (POSITIVE.has(key) && !(Number(i[key]) > 0))) issues.push({ key, kind: "missing" });
  if (gbaOf(i) === null) issues.push({ key: "gba", kind: "missing" });
  for (const [key, [min, max]] of Object.entries(LIMITS) as [InputKey, [number, number]][]) {
    const x = i[key];
    if (x !== null && (x < min || x > max)) issues.push({ key, kind: "range" });
  }
  if (i.model === "bts" && i.breakYear && i.leaseYears && i.breakYear >= i.leaseYears) issues.push({ key: "break", kind: "range" });
  return issues;
}

/** the monthly ledger of one set of inputs (valid inputs assumed — call validate() first) */
export function ledgerOf(i: Inputs, opts: { rentOverride?: number; earlyBreak?: boolean } = {}): { ledger: Ledger; gba: number; net: number; parts: Summary["costs"]; revenueTotal: number } {
  const gba = gbaOf(i)!;
  const net = gba * (v(i.efficiency) / 100);
  const pre = Math.round(v(i.preMonths));
  const build = Math.max(1, Math.round(v(i.buildMonths)));
  const completion = pre + build;
  const hard = gba * v(i.hard);
  const design = hard * (v(i.design) / 100);
  const networks = v(i.networks);
  const landscaping = v(i.landscaping);
  const permits = v(i.permits);
  const contingency = (hard + design + networks + landscaping + permits) * (v(i.contingency) / 100);
  const cashCost = hard + design + networks + landscaping + permits + contingency;
  const land = i.includeLand ? v(i.landValue) : 0;

  let months: number;
  if (i.model === "sale") months = completion + Math.max(1, Math.round(v(i.salesMonths)));
  else if (i.model === "hold") months = completion + Math.round(v(i.holdYears) * 12);
  else months = completion + Math.round(v(i.leaseYears) * 12);
  const z = () => new Array<number>(months).fill(0);
  const L: Ledger = { model: i.model, months, completion, land: z(), devCost: z(), revenue: z(), saleCosts: z(), noi: z(), terminal: z(), taxUnlevered: z(), taxLevered: z(), draw: z(), interestPaid: z(), repay: z(), unlevered: z(), levered: z(), cash: z(), interestTotal: 0 };

  // costs in time: land at 0; design over the pre-development months (month 0 when there are none); permits at the end of the
  // pre-development period; works + networks + landscaping + contingency evenly over the construction months
  L.land[0] = land;
  const preSpan = Math.max(1, pre);
  for (let t = 0; t < preSpan; t++) L.devCost[t] += design / preSpan;
  L.devCost[Math.max(0, pre - 1)] += permits;
  const works = hard + networks + landscaping + contingency;
  for (let t = pre; t < completion; t++) L.devCost[t] += works / build;

  // revenue
  const tax = v(i.tax) / 100;
  let revenueTotal = 0;
  if (i.model === "sale") {
    const salesMonths = months - completion;
    revenueTotal = net * v(i.price);
    for (let t = completion; t < months; t++) {
      L.revenue[t] = revenueTotal / salesMonths;
      L.saleCosts[t] = L.revenue[t] * (v(i.commission) / 100);
    }
  } else {
    const rent = opts.rentOverride ?? v(i.rent);
    const idx = v(i.indexation) / 100;
    const opex = v(i.opex) / 100;
    const stab = i.model === "bts" ? 1 : v(i.occupancy) / 100;
    const leaseUp = i.model === "bts" ? 0 : Math.round(v(i.leaseUp));
    const breakAt = i.model === "bts" && opts.earlyBreak && i.breakYear ? completion + Math.round(i.breakYear * 12) : null;
    const voidMonths = Math.round(v(i.voidMonths));
    const relet = v(i.reletPct) / 100;
    for (let t = completion; t < months; t++) {
      const k = t - completion;
      const factor = Math.pow(1 + idx, Math.floor(k / 12));
      let occ = leaseUp > 0 ? stab * Math.min(1, (k + 1) / leaseUp) : stab;
      if (breakAt !== null && t >= breakAt) occ = t < breakAt + voidMonths ? 0 : relet;
      const gross = net * rent * factor * occ;
      L.revenue[t] = gross;
      L.noi[t] = gross * (1 - opex);
      L.saleCosts[t] = gross * opex;
      if (breakAt !== null && t === breakAt) {
        // the termination fee: months of the current rent, paid by the leaving tenant (no operating cost on it)
        const fee = net * rent * factor * v(i.breakFee);
        L.revenue[t] += fee;
        L.noi[t] += fee;
      }
    }
    // exit at the last month: the forward twelve months of NOI at the stabilised (or re-let) level, capitalised at the exit yield
    const years = Math.floor((months - completion) / 12);
    const fwdOcc = i.model === "bts" && opts.earlyBreak && i.breakYear ? relet : stab;
    const fwdNoi = net * rent * Math.pow(1 + idx, years) * 12 * fwdOcc * (1 - opex);
    const tv = fwdNoi / (v(i.exitYield) / 100);
    L.terminal[months - 1] = tv * (1 - v(i.exitCosts) / 100);
    L.saleCosts[months - 1] += tv * (v(i.exitCosts) / 100);
    revenueTotal = sum(L.revenue);
  }

  // financing — the loan funds ltc % of each month's development cost; interest at one effective monthly rate
  const ltc = v(i.ltc) / 100;
  const m = monthlyRate(v(i.interest));
  let balance = 0;
  let capitalised = 0;
  for (let t = 0; t < months; t++) {
    const accrued = balance * m;
    L.interestTotal += accrued;
    if (i.model === "sale" || t < completion) { balance += accrued; capitalised += accrued; }
    else L.interestPaid[t] = accrued;
    L.draw[t] = L.devCost[t] * ltc;
    balance += L.draw[t];
    if (i.model === "sale" && t >= completion) {
      const available = L.revenue[t] - L.saleCosts[t];
      const pay = Math.min(balance, Math.max(0, available));
      L.repay[t] = pay;
      balance -= pay;
    }
    if (t === months - 1 && balance > 0) { L.repay[t] += balance; balance = 0; }
  }

  // tax (simplified) — unlevered before interest, levered after it
  if (i.model === "sale") {
    // the tax on the realised profit is paid with the sales receipts, in proportion to each month's net receipt (never one lump at the
    // end, which would turn the last month negative and give the flows a second IRR)
    const netSales = sum(L.revenue) - sum(L.saleCosts);
    const gain = netSales - cashCost; // 2.1: the land's market value is not a deductible cost (see the header)
    for (let t = completion; t < months; t++) {
      const share = netSales > 0 ? (L.revenue[t] - L.saleCosts[t]) / netSales : 0;
      L.taxUnlevered[t] = tax * Math.max(0, gain) * share;
      L.taxLevered[t] = tax * Math.max(0, gain - L.interestTotal) * share;
    }
  } else {
    for (let t = completion; t < months; t++) {
      L.taxUnlevered[t] = tax * Math.max(0, L.noi[t]);
      L.taxLevered[t] = tax * Math.max(0, L.noi[t] - L.interestPaid[t]);
    }
    const exitGain = L.terminal[months - 1] - cashCost; // 2.1: no land deduction
    L.taxUnlevered[months - 1] += tax * Math.max(0, exitGain);
    L.taxLevered[months - 1] += tax * Math.max(0, exitGain - capitalised);
  }

  for (let t = 0; t < months; t++) {
    const operating = i.model === "sale" ? L.revenue[t] - L.saleCosts[t] : L.noi[t];
    L.unlevered[t] = -L.land[t] - L.devCost[t] + operating + L.terminal[t] - L.taxUnlevered[t];
    L.cash[t] = L.unlevered[t] + L.land[t];
    L.levered[t] = -L.land[t] - L.devCost[t] + operating + L.terminal[t] - L.taxLevered[t] + L.draw[t] - L.interestPaid[t] - L.repay[t];
  }
  const parts = { hard, design, networks, landscaping, permits, contingency, cash: cashCost, land, economic: cashCost + land, interest: L.interestTotal, saleCosts: sum(L.saleCosts), tax: sum(L.taxLevered) };
  return { ledger: L, gba, net, parts, revenueTotal };
}

export function run(i: Inputs, opts: { rentOverride?: number; earlyBreak?: boolean } = {}): Result {
  const issues = validate(i);
  if (issues.length) return { ok: false, issues };
  const { ledger: L, gba, net, parts, revenueTotal } = ledgerOf(i, opts);
  const profit = sum(L.levered);
  const profitUnlevered = sum(L.unlevered);
  // ROI on the full cost of the project: cash invested + the land's economic value + interest (the sales / operating costs are inside the profit)
  const totalCost = parts.economic + parts.interest;
  let cum = 0, peak = 0;
  for (const x of L.levered) { cum += x; peak = Math.min(peak, cum); }
  let paybackMonths: number | null = null;
  cum = 0;
  for (let t = 0; t < L.months; t++) {
    cum += L.unlevered[t] - (i.model === "sale" ? 0 : L.terminal[t]);
    if (cum >= 0 && t >= L.completion) { paybackMonths = t + 1; break; }
  }
  const opex = v(i.opex) / 100;
  const stab = i.model === "bts" ? 1 : v(i.occupancy) / 100;
  const rent = opts.rentOverride ?? v(i.rent);
  const noiStabilised = i.model === "sale" ? null : net * rent * 12 * stab * (1 - opex);
  const yieldOnCost = noiStabilised !== null && parts.economic > 0 ? noiStabilised / parts.economic : null;
  const terminalValue = i.model === "sale" ? null : L.terminal[L.months - 1];
  const simplePaybackYears = noiStabilised && noiStabilised > 0 ? parts.economic / noiStabilised : null;
  return {
    ok: true,
    inputs: i,
    ledger: L,
    summary: {
      gba, net, costs: parts, revenue: revenueTotal, profit, profitUnlevered,
      roi: totalCost > 0 ? profit / totalCost : null,
      marginOnRevenue: revenueTotal > 0 ? profit / revenueTotal : null,
      irrProject: irrOf(L.unlevered), irrCash: irrOf(L.cash), irrEquity: irrOf(L.levered),
      npv: npvOf(L.unlevered, v(i.discount)), npvEquity: npvOf(L.levered, v(i.discount)), npvCash: npvOf(L.cash, v(i.discount)),
      peakEquity: -peak, paybackMonths, noiStabilised, yieldOnCost, terminalValue, simplePaybackYears,
    },
  };
}

/** the root of a monotone function on [lo, hi] by bisection, or null when there is no sign change */
function solve(fn: (x: number) => number, lo: number, hi: number): number | null {
  let flo = fn(lo);
  const fhi = fn(hi);
  if (!Number.isFinite(flo) || !Number.isFinite(fhi) || flo * fhi > 0) return null;
  if (flo === 0) return lo;
  for (let k = 0; k < 120; k++) {
    const mid = (lo + hi) / 2;
    const fm = fn(mid);
    if (Math.abs(hi - lo) < 1e-6) return mid;
    if (flo * fm <= 0) hi = mid; else { lo = mid; flo = fm; }
  }
  return (lo + hi) / 2;
}

const npvAt = (i: Inputs, patch: Partial<Inputs>, opts: { rentOverride?: number; earlyBreak?: boolean } = {}) => {
  const r = run({ ...i, ...patch }, opts);
  return r.ok ? r.summary.npv : Number.NaN;
};

export type BreakEven = { priceNpv: number | null; priceProfit: number | null; rentNpv: number | null; occupancyNpv: number | null };

/** the break-even point (§11): the sale price (A) or the rent and occupancy (B) at which the project NPV is zero */
export function breakEven(i: Inputs): BreakEven {
  const out: BreakEven = { priceNpv: null, priceProfit: null, rentNpv: null, occupancyNpv: null };
  if (validate(i).length) return out;
  if (i.model === "sale") {
    out.priceNpv = solve((p) => npvAt(i, { price: p }), 0.01, 200000);
    out.priceProfit = solve((p) => { const r = run({ ...i, price: p }); return r.ok ? r.summary.profit : Number.NaN; }, 0.01, 200000);
  } else if (i.model === "hold") {
    out.rentNpv = solve((x) => npvAt(i, { rent: x }), 0.001, 5000);
    out.occupancyNpv = solve((o) => npvAt(i, { occupancy: o }), 0.01, 100);
  }
  return out;
}

export type Bts = { minRent: number | null; rent: number | null; full: Summary | null; early: Summary | null };

/**
 * R2 · THE MAXIMUM LAND VALUE at the hurdle rate (residual land value): the economic value of the land L* at which the project NPV at the
 * hurdle is zero — the discount rate for A / B, the owner's required return for C (at the proposed rent; without a proposed rent there is
 * nothing to value against, so null). The land enters only as the contribution at month 0 (undiscounted) and is no tax deduction (2.1), so
 * NPV(L) = NPV(0) − L exactly and L* = NPV(0) at the hurdle — the NPV of the additional investment. When the project misses the hurdle even
 * with free land, the answer is 0 with `belowHurdle` — never a negative land value.
 */
export type LandResidual = { value: number | null; hurdle: number | null; belowHurdle: boolean };
export function maxLandValue(i: Inputs): LandResidual {
  if (validate({ ...i, includeLand: true, landValue: 0 }).length) return { value: null, hurdle: null, belowHurdle: false };
  const bts = i.model === "bts";
  if (bts && !(i.rent && i.rent > 0)) return { value: null, hurdle: v(i.target), belowHurdle: false };
  const hurdle = bts ? v(i.target) : v(i.discount);
  const at = (L: number) => { const r = run({ ...i, includeLand: true, landValue: L, discount: hurdle }, bts ? { rentOverride: i.rent! } : {}); return r.ok ? r.summary.npv : Number.NaN; };
  const npv0 = at(0);
  if (!Number.isFinite(npv0)) return { value: null, hurdle, belowHurdle: false };
  if (npv0 <= 0) return { value: 0, hurdle, belowHurdle: true };
  return { value: npv0, hurdle, belowHurdle: false };
}

/** C · the minimum rent (per m² of leasable area per month) at which the unlevered NPV at the owner's required return is zero */
export function btsAnalysis(i: Inputs): Bts {
  if (i.model !== "bts" || validate(i).length) return { minRent: null, rent: null, full: null, early: null };
  const minRent = solve((r) => { const x = run({ ...i, discount: v(i.target) }, { rentOverride: r }); return x.ok ? x.summary.npv : Number.NaN; }, 0, 5000);
  const rent = i.rent && i.rent > 0 ? i.rent : minRent;
  if (rent === null) return { minRent, rent: null, full: null, early: null };
  const full = run({ ...i, discount: v(i.target) }, { rentOverride: rent });
  const early = i.breakYear && i.breakYear > 0 ? run({ ...i, discount: v(i.target) }, { rentOverride: rent, earlyBreak: true }) : null;
  return { minRent, rent, full: full.ok ? full.summary : null, early: early && early.ok ? early.summary : null };
}

export type VariantKey = "realistic" | "optimistic" | "pessimistic";
/** the scenario deltas (§11) — stated on the page next to the comparison */
export const VARIANTS: Record<Exclude<VariantKey, "realistic">, { revenue: number; hard: number; build: number; ramp: number }> = {
  optimistic: { revenue: 10, hard: -5, build: -2, ramp: -2 },
  pessimistic: { revenue: -10, hard: 10, build: 3, ramp: 3 },
};

export function variantOf(i: Inputs, key: VariantKey): Inputs {
  if (key === "realistic") return i;
  const d = VARIANTS[key];
  const scale = (x: number | null, pct: number) => (x === null ? null : x * (1 + pct / 100));
  const shift = (x: number | null, by: number, min: number) => (x === null ? null : Math.max(min, x + by));
  return {
    ...i,
    price: scale(i.price, d.revenue),
    rent: scale(i.rent, d.revenue),
    hard: scale(i.hard, d.hard),
    buildMonths: shift(i.buildMonths, d.build, 1),
    salesMonths: shift(i.salesMonths, d.ramp, 1),
    leaseUp: i.leaseUp === null ? null : shift(i.leaseUp, d.ramp, 0),
  };
}

export type SensitivityRow = { key: "capex" | "revenue" | "time"; low: Summary | null; high: Summary | null; lowBts: number | null; highBts: number | null };

/** sensitivity (§11): CAPEX ±10 %, rent / price ±10 %, construction time ∓ / ± 3 months */
export function sensitivity(i: Inputs): SensitivityRow[] {
  const cases: [SensitivityRow["key"], Partial<Inputs>, Partial<Inputs>][] = [
    ["capex", { hard: v(i.hard) * 0.9 }, { hard: v(i.hard) * 1.1 }],
    ["revenue", i.model === "sale" ? { price: v(i.price) * 0.9 } : { rent: v(i.rent) * 0.9 }, i.model === "sale" ? { price: v(i.price) * 1.1 } : { rent: v(i.rent) * 1.1 }],
    ["time", { buildMonths: Math.max(1, v(i.buildMonths) - 3) }, { buildMonths: v(i.buildMonths) + 3 }],
  ];
  return cases.map(([key, low, high]) => {
    if (i.model === "bts") {
      if (key === "revenue") return { key, low: null, high: null, lowBts: null, highBts: null };
      return { key, low: null, high: null, lowBts: btsAnalysis({ ...i, ...low }).minRent, highBts: btsAnalysis({ ...i, ...high }).minRent };
    }
    const a = run({ ...i, ...low });
    const b = run({ ...i, ...high });
    return { key, low: a.ok ? a.summary : null, high: b.ok ? b.summary : null, lowBts: null, highBts: null };
  });
}

/** quarterly series for the cash-flow chart (unlevered): inflows, outflows, cumulative */
export function quarterly(L: Ledger): { q: number; inflow: number; outflow: number; cumulative: number }[] {
  const out: { q: number; inflow: number; outflow: number; cumulative: number }[] = [];
  let cum = 0;
  for (let q = 0; q * 3 < L.months; q++) {
    let inflow = 0, outflow = 0;
    for (let t = q * 3; t < Math.min(L.months, q * 3 + 3); t++) {
      // the same definition as the unlevered flow: A sales net of commission, B / C the NOI; the exit value is already net of its costs
      const operating = L.model === "sale" ? L.revenue[t] - L.saleCosts[t] : L.noi[t];
      const ins = Math.max(0, operating) + L.terminal[t];
      const outs = L.land[t] + L.devCost[t] + L.taxUnlevered[t] + Math.max(0, -operating);
      inflow += ins;
      outflow += outs;
      cum += L.unlevered[t];
    }
    out.push({ q, inflow, outflow, cumulative: cum });
  }
  return out;
}
