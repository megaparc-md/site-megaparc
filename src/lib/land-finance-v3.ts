/**
 * LAND DEVELOPMENT MODEL 3.0 — the financial engine of the land calculator (OWNER «FINANCIAL CORRECTION MANDATE · LAND DEVELOPMENT
 * CALCULATOR 3.0 · Independent Codex Audit Remediation», 2026-11-24). Pure functions, no imports, no UI, no site data: every figure comes
 * from the visitor's inputs or from a labelled demonstration preset.
 *
 * Specification: docs/finance/LAND_DEVELOPMENT_MODEL_V3.md (section numbers below refer to it). Tax rules and their legal sources:
 * docs/finance/LAND_TAX_METHODOLOGY_MD.md. Independent checks: scripts/qa-land-finance-v3.mjs (hand cases incl. every Codex control
 * example, invariants, edge cases) and the month-by-month reconciliation with the independent Excel model
 * (MEGAPARC_LAND_DEVELOPMENT_MODEL_V3.xlsx, built from the specification without this file).
 *
 * The 2.1 engine (src/lib/land-finance.ts) is kept unchanged for the reproducibility of the audit of 92a43eb8.
 */

export const ENGINE_VERSION = "3.0.0";
export const MODEL_NAME = "Land Development Model 3.0";

export type ModelKey = "sale" | "hold" | "bts";
export type LossMode = "free" | "equal";
export type AdvanceMethod = "none" | "current" | "prior";
export type DrawOrder = "prorata" | "equityFirst";
export type Amort = "bullet" | "annuity" | "linear";
export type VatFunding = "equity" | "facility";

type N = number | null;

export type Inputs = {
  model: ModelKey;
  // timing (§1)
  startYear: N; startMonth: N; preMonths: N; buildMonths: N;
  // site and building
  siteArea: N; coverage: N; floors: N; gbaManual: N; efficiency: N;
  // development costs (excl. VAT)
  hard: N; design: N; networks: N; landscaping: N; permits: N; contingency: N;
  // land
  landMarket: N; includeLand: boolean; landCost: N; landBook: N; landTaxBasis: N; landShare: N;
  // A · sale
  price: N; salesMonths: N; commission: N;
  // B · hold, C · bts
  rent: N; occupancy: N; leaseUp: N; opex: N; indexation: N; holdYears: N; exitYield: N; exitCosts: N;
  leaseYears: N; target: N; breakYear: N; voidMonths: N; reletPct: N; breakFee: N;
  // discounting
  discount: N;
  // profit tax
  taxRate: N; depYears: N; bookDepYears: N; lossYears: N; lossMode: LossMode | null; capGainInclusion: N; interestRateCap: N;
  advanceMethod: AdvanceMethod | null; capitalizeInterest: boolean;
  // VAT
  vatOn: boolean; vatRate: N; vatRecoverable: N; vatOnRent: boolean; vatOnSale: boolean; vatRefund: boolean; vatRefundLag: N; vatFunding: VatFunding;
  // property taxes
  landTaxAnnual: N; buildingTaxRate: N; propertyTaxMonths: number[];
  // financing
  ltc: N; interest: N; fee: N; drawOrder: DrawOrder; graceMonths: N; amort: Amort; amortYears: N;
  refi: boolean; refiMonth: N; refiLtv: N; refiRate: N; refiCap: N; refiAmortYears: N;
};

export type NumKey = { [K in keyof Inputs]: Inputs[K] extends N ? K : never }[keyof Inputs];

export const emptyInputs = (model: ModelKey, siteArea: number | null = null): Inputs => ({
  model, startYear: null, startMonth: null, preMonths: null, buildMonths: null,
  siteArea, coverage: null, floors: null, gbaManual: null, efficiency: null,
  hard: null, design: null, networks: null, landscaping: null, permits: null, contingency: null,
  landMarket: null, includeLand: true, landCost: null, landBook: null, landTaxBasis: null, landShare: null,
  price: null, salesMonths: null, commission: null,
  rent: null, occupancy: null, leaseUp: null, opex: null, indexation: null, holdYears: null, exitYield: null, exitCosts: null,
  leaseYears: null, target: null, breakYear: null, voidMonths: null, reletPct: null, breakFee: null,
  discount: null,
  taxRate: null, depYears: null, bookDepYears: null, lossYears: null, lossMode: null, capGainInclusion: null, interestRateCap: null, advanceMethod: null, capitalizeInterest: true,
  vatOn: false, vatRate: null, vatRecoverable: null, vatOnRent: true, vatOnSale: true, vatRefund: false, vatRefundLag: null, vatFunding: "equity",
  landTaxAnnual: null, buildingTaxRate: null, propertyTaxMonths: [],
  ltc: null, interest: null, fee: null, drawOrder: "prorata", graceMonths: null, amort: "bullet", amortYears: null,
  refi: false, refiMonth: null, refiLtv: null, refiRate: null, refiCap: null, refiAmortYears: null,
});

// ------------------------------------------------------------------ validation (§1) ------------------------------------------------------------------

const BASE_REQUIRED: NumKey[] = ["siteArea", "efficiency", "hard", "buildMonths", "startYear", "startMonth"];
const REQUIRED: Record<ModelKey, NumKey[]> = {
  sale: [...BASE_REQUIRED, "discount", "price", "salesMonths"],
  hold: [...BASE_REQUIRED, "discount", "rent", "occupancy", "holdYears", "exitYield"],
  bts: [...BASE_REQUIRED, "leaseYears", "target", "exitYield"],
};
/** above zero when required (a 0 % discount, target or tax rate is a valid choice) */
const POSITIVE = new Set<NumKey>(["siteArea", "efficiency", "hard", "buildMonths", "price", "salesMonths", "rent", "occupancy", "holdYears", "exitYield", "leaseYears"]);
const LIMITS: Partial<Record<NumKey, [number, number]>> = {
  coverage: [0, 100], floors: [0, 40], efficiency: [1, 100], design: [0, 100], contingency: [0, 100],
  preMonths: [0, 120], buildMonths: [1, 120], salesMonths: [1, 240], leaseUp: [0, 120],
  ltc: [0, 95], interest: [0, 50], discount: [0, 50], commission: [0, 50],
  occupancy: [0, 100], opex: [0, 100], indexation: [0, 30], holdYears: [1, 40], exitYield: [0.5, 40], exitCosts: [0, 50],
  leaseYears: [1, 40], target: [0, 50], breakYear: [0, 40], voidMonths: [0, 120], reletPct: [0, 200], breakFee: [0, 120],
  taxRate: [0, 60], depYears: [1, 100], bookDepYears: [1, 100], lossYears: [0, 20], capGainInclusion: [0, 100], interestRateCap: [0, 50],
  vatRate: [0, 30], vatRecoverable: [0, 100], vatRefundLag: [0, 36], buildingTaxRate: [0, 5], fee: [0, 10], graceMonths: [0, 120],
  amortYears: [1, 40], refiLtv: [0, 95], refiRate: [0, 50], refiCap: [0.5, 40], refiAmortYears: [1, 40], refiMonth: [0, 480],
  landShare: [0, 100], startMonth: [1, 12], startYear: [2000, 2100], landMarket: [0, 1e12], landTaxBasis: [0, 1e12], landBook: [0, 1e12], landTaxAnnual: [0, 1e10],
};

export type IssueKey = NumKey | "gba" | "break" | "refi" | "lossMode" | "advanceMethod";
export type Issue = { key: IssueKey; kind: "missing" | "range" };

const isNum = (x: unknown): x is number => typeof x === "number" && Number.isFinite(x);
const v = (x: N | undefined) => (isNum(x) ? x : 0);

export function gbaOf(i: Inputs): number | null {
  if (isNum(i.gbaManual) && i.gbaManual > 0) return i.gbaManual;
  if (isNum(i.siteArea) && isNum(i.coverage) && isNum(i.floors) && i.siteArea > 0 && i.coverage > 0 && i.floors > 0) return i.siteArea * (i.coverage / 100) * i.floors;
  return null;
}

export function validate(i: Inputs): Issue[] {
  const issues: Issue[] = [];
  const need = (k: NumKey) => { const x = i[k] as N; if (!isNum(x) || (POSITIVE.has(k) && !(x > 0))) issues.push({ key: k, kind: "missing" }); };
  REQUIRED[i.model].forEach(need);
  if (gbaOf(i) === null) issues.push({ key: "gba", kind: "missing" });
  if (isNum(i.taxRate)) {
    need("lossYears");
    if (!i.lossMode) issues.push({ key: "lossMode", kind: "missing" });
    if (!i.advanceMethod) issues.push({ key: "advanceMethod", kind: "missing" });
  }
  if (v(i.ltc) > 0) { need("interest"); if (i.amort !== "bullet" && i.model !== "sale") need("amortYears"); }
  if (i.refi && i.model !== "sale") { need("refiMonth"); need("refiLtv"); need("refiRate"); need("refiCap"); if (i.amort !== "bullet") need("refiAmortYears"); }
  for (const [key, [min, max]] of Object.entries(LIMITS) as [NumKey, [number, number]][]) {
    const x = i[key] as N;
    if (isNum(x) && (x < min || x > max)) issues.push({ key, kind: "range" });
  }
  if (i.model === "bts" && isNum(i.breakYear) && i.breakYear > 0 && isNum(i.leaseYears) && i.breakYear >= i.leaseYears) issues.push({ key: "break", kind: "range" });
  if (i.refi && i.model !== "sale" && isNum(i.refiMonth)) {
    const H = Math.round(v(i.model === "hold" ? i.holdYears : i.leaseYears) * 12);
    if (Math.round(i.refiMonth) >= H - 1) issues.push({ key: "refi", kind: "range" });
  }
  return issues;
}

/** the parameters the visitor left empty and how the model treated them (§11) — they travel into the report */
export type NoteKey = "preTax" | "noDep" | "landBasisZero" | "landBookZero" | "landShareZero" | "capGain100" | "noPropertyTax" | "noVat" | "vatLapse" | "vatRate20";
export function notesOf(i: Inputs): NoteKey[] {
  const n: NoteKey[] = [];
  const tax = isNum(i.taxRate);
  if (!tax) n.push("preTax");
  if (tax && i.model !== "sale" && !isNum(i.depYears)) n.push("noDep");
  if (tax && !isNum(i.landTaxBasis)) n.push("landBasisZero");
  if (!isNum(i.landBook)) n.push("landBookZero");
  if (!isNum(i.landShare) && ((tax && i.model !== "sale" && isNum(i.capGainInclusion) && i.capGainInclusion < 100) || (i.vatOn && i.vatOnSale))) n.push("landShareZero");
  if (tax && i.model !== "sale" && !isNum(i.capGainInclusion)) n.push("capGain100");
  if (!isNum(i.landTaxAnnual) && !isNum(i.buildingTaxRate)) n.push("noPropertyTax");
  if (!i.vatOn) n.push("noVat");
  if (i.vatOn && !i.vatRefund) n.push("vatLapse");
  if (i.vatOn && !isNum(i.vatRate)) n.push("vatRate20");
  return n;
}

// ------------------------------------------------------------------ IRR (§12) ------------------------------------------------------------------

export type IrrResult =
  | { kind: "unique"; monthly: number; annual: number; plausible: boolean }
  | { kind: "multiple"; annual: number[]; nonNegative: number | null }
  | { kind: "none-proven" }
  | { kind: "none-found" };

/**
 * IRR analysis of monthly flows. P(x) = Σ cf[t]·x^t with x = 1/(1+m). Descartes: the number of positive roots is at most the number of
 * sign changes s, with the same parity. s = 0 → no IRR exists; s = 1 → exactly one root, found by bisection on ln x inside the Cauchy
 * bounds (any value, flagged when implausible); s ≥ 2 → a fine scan of the bounds, sign changes refined, local minima of |P| refined
 * (close or double roots); several roots are listed and never chosen between. When several roots exist, `nonNegative` carries the
 * unique non-negative IRR only when its uniqueness is PROVEN by Norström's criterion (the cumulative cash flow changes sign exactly once,
 * S_n ≠ 0 — Norström 1972, «A sufficient condition for a unique nonnegative internal rate of return») and the scan found exactly one root
 * with m ≥ 0; the NPV stays the decision criterion and the interface shows the other roots (the calendar tax paid after the exit gives
 * every profitable B / C project a second, negative-rate root).
 */
export function irrAnalysis(flows: number[]): IrrResult {
  let lo0 = 0, hi0 = flows.length - 1;
  while (lo0 <= hi0 && flows[lo0] === 0) lo0++;
  while (hi0 >= lo0 && flows[hi0] === 0) hi0--;
  if (lo0 > hi0) return { kind: "none-proven" };
  const a = flows.slice(lo0, hi0 + 1); // a[0] ≠ 0, a[n] ≠ 0
  const n = a.length - 1;
  let s = 0, prev = 0;
  for (const x of a) { if (x === 0) continue; const sg = Math.sign(x); if (prev && sg !== prev) s++; prev = sg; }
  if (s === 0 || n === 0) return { kind: "none-proven" };
  // Cauchy bounds of the positive roots
  let mHi = 0, mLo = 0;
  for (let t = 0; t < n; t++) mHi = Math.max(mHi, Math.abs(a[t] / a[n]));
  for (let t = 1; t <= n; t++) mLo = Math.max(mLo, Math.abs(a[t] / a[0]));
  const uMax = Math.log(1 + mHi) + 1e-9, uMin = -Math.log(1 + mLo) - 1e-9;
  // f(u): the sign of P(e^u) without overflow — P(x) for x ≤ 1, the reversed polynomial in 1/x for x > 1 (same sign); `ratio` = |f| / Σ|terms|
  const evalU = (u: number): { f: number; ratio: number } => {
    let f = 0, sc = 0;
    if (u <= 0) { const x = Math.exp(u); for (let t = n; t >= 0; t--) { f = f * x + a[t]; sc = sc * x + Math.abs(a[t]); } }
    else { const y = Math.exp(-u); for (let t = 0; t <= n; t++) { f = f * y + a[t]; sc = sc * y + Math.abs(a[t]); } }
    return { f, ratio: sc > 0 ? Math.abs(f) / sc : 0 };
  };
  const bisect = (ua: number, ub: number, fa: number): number => {
    let lo = ua, hi = ub, flo = fa;
    for (let k = 0; k < 400 && hi - lo > 1e-15 * Math.max(1, Math.abs(lo)); k++) {
      const mid = (lo + hi) / 2;
      const fm = evalU(mid).f;
      if (fm === 0) return mid;
      if (Math.sign(fm) === Math.sign(flo)) { lo = mid; flo = fm; } else hi = mid;
    }
    return (lo + hi) / 2;
  };
  const toAnnual = (u: number) => Math.exp(-12 * u) - 1; // (1 + m)^12 − 1 with 1 + m = 1/x = e^(−u)
  const toMonthly = (u: number) => Math.exp(-u) - 1;
  if (s === 1) {
    const fa = evalU(uMin).f, fb = evalU(uMax).f;
    if (fa === 0) return unique(uMin);
    if (fb === 0) return unique(uMax);
    if (Math.sign(fa) === Math.sign(fb)) return { kind: "none-found" }; // cannot happen with exact arithmetic (one root inside the bounds)
    return unique(bisect(uMin, uMax, fa));
  }
  function unique(u: number): IrrResult {
    const annual = toAnnual(u);
    return { kind: "unique", monthly: toMonthly(u), annual, plausible: annual > -0.99 && annual < 10 };
  }
  // s ≥ 2: scan
  const K = 4000; // close roots inside one step are caught by the local-minimum refinement below
  const step = (uMax - uMin) / K;
  const roots: number[] = [];
  let p = evalU(uMin), pp = p;
  const ratios: number[] = [p.ratio];
  for (let k = 1; k <= K; k++) {
    const u = uMin + k * step;
    const c = evalU(u);
    if (c.f === 0) roots.push(u);
    else if (p.f !== 0 && Math.sign(c.f) !== Math.sign(p.f)) roots.push(bisect(u - step, u, p.f));
    else if (k >= 2 && p.ratio < pp.ratio && p.ratio < c.ratio && p.ratio < 1e-6) {
      // a local minimum of |P| without a sign change: two close roots or a double root — look closer
      const ua = u - 2 * step, ub = u;
      const sub = 2000, h = (ub - ua) / sub;
      let q = evalU(ua), found = false, best = { u: ua, r: q.ratio };
      for (let j = 1; j <= sub; j++) {
        const uu = ua + j * h, cc = evalU(uu);
        if (cc.ratio < best.r) best = { u: uu, r: cc.ratio };
        if (q.f !== 0 && cc.f !== 0 && Math.sign(cc.f) !== Math.sign(q.f)) { roots.push(bisect(uu - h, uu, q.f)); found = true; }
        q = cc;
      }
      if (!found && best.r < 1e-12) roots.push(best.u); // a tangent (double) root
    }
    ratios.push(c.ratio);
    pp = p; p = c;
  }
  const uniq = [...new Set(roots.map((u) => Math.round(u * 1e10) / 1e10))].sort((x, y) => x - y);
  if (!uniq.length) return { kind: "none-found" };
  if (uniq.length === 1) return unique(uniq[0]);
  let cum = 0, cs = 0, cp = 0;
  for (const x of a) { cum += x; if (cum === 0) continue; const sg = Math.sign(cum); if (cp && sg !== cp) cs++; cp = sg; }
  const nonNeg = uniq.filter((u) => u <= 0); // m ≥ 0 ⇔ x ≤ 1 ⇔ u ≤ 0
  const norstrom = cs === 1 && cum !== 0;
  return { kind: "multiple", annual: uniq.map(toAnnual).sort((x, y) => x - y), nonNegative: norstrom && nonNeg.length === 1 ? toAnnual(nonNeg[0]) : null };
}

/** the annual IRR when it exists and is unique, else null */
export const irrOf = (flows: number[]): number | null => { const r = irrAnalysis(flows); return r.kind === "unique" ? r.annual : null; };
/** the IRR the interface may show: the unique one, or the proven unique non-negative one (always with the multiple-root warning) */
export const irrShown = (r: IrrResult): number | null => (r.kind === "unique" ? r.annual : r.kind === "multiple" ? r.nonNegative : null);

export const monthlyEffective = (annualPct: number) => Math.pow(1 + annualPct / 100, 1 / 12) - 1;
export function npvOf(flows: number[], annualPct: number): number {
  const d = monthlyEffective(annualPct);
  let s = 0, f = 1;
  for (let t = 0; t < flows.length; t++) { s += flows[t] / f; f *= 1 + d; }
  return s;
}

/** the first month at which the cumulative sum is ≥ 0 after it has been negative (0 if it never is; null if it never recovers) — §9 */
export function paybackOf(flows: number[]): number | null {
  let cum = 0, neg = false;
  const tol = 1e-6;
  for (let t = 0; t < flows.length; t++) {
    cum += flows[t];
    if (cum < -tol) neg = true;
    else if (neg) return t;
  }
  return neg ? null : 0;
}

// ------------------------------------------------------------------ the ledger (§2–§8) ------------------------------------------------------------------

export type Opts = {
  /** C · the rent to apply (the proposed rent or a solver's trial) */
  rentOverride?: number;
  /** C · the early-termination scenario */
  earlyBreak?: boolean;
  /** the operating variant: no exit value, no exit cost, no exit VAT, no exit gain (the operating payback, §9) */
  noExit?: boolean;
  /** the land valued as a purchase: the price becomes the applied land value, the tax basis and the book value (§10) */
  purchase?: number;
};

const LINES = ["year", "month", "dev", "permitsAt", "inVAT", "nonRec", "D", "outVAT", "used", "payable", "refund", "cred", "vatCash", "rev", "com", "gross", "opexC", "opIn", "netExit", "landTaxA", "bldTaxA", "ptCash", "dep_U", "dep_L", "cogs_U", "cogs_L", "intExp", "feeExp", "TI_U", "TI_L", "taxCash_U", "taxCash_L", "draw", "acc", "intPaid", "prin", "prinSched", "fee", "bal", "refiNew", "drawV", "accV", "intPaidV", "repV", "balV", "U", "CF", "Lv"] as const;
export type LineKey = (typeof LINES)[number];
export const MONTHLY_LINES = LINES;
export type Monthly = Record<LineKey, number[]>;

export type Annual = { year: number; TIy_U: number; TIy_L: number; lossUsed_U: number; lossUsed_L: number; lossCarried_U: number; lossCarried_L: number; lossLapsed_U: number; lossLapsed_L: number; intDisallowed: number; tax_U: number; tax_L: number; taxPaid_U: number; taxPaid_L: number; acctProfit: number; cashFlowL: number };

export type Ledger = {
  model: ModelKey;
  C: number; E: number; N: number; S: number; H: number;
  GBA: number; NET: number; CASH: number; NONREC: number; LANDAPP: number;
  costs: { hard: number; design: number; networks: number; landscaping: number; permits: number; contingency: number };
  m: Monthly;
  annual: Annual[];
  TV: number; NOI_TV: number; NOI_Y1: number | null; NOI_stab: number | null; NOI_next: number | null; s: number | null;
  BASE_U: number; BASE_L: number; CAPINT: number; RTV_U: number | null; RTV_L: number | null; LOAN: number; feeAmt: number; refiAt: number | null;
  /** the applied rent (C: the proposed rent or the trial) */
  rent: number;
};

const yearOf = (sy: number, sm: number, t: number) => sy + Math.floor((sm - 1 + t) / 12);
const monthOf = (sm: number, t: number) => ((sm - 1 + t) % 12) + 1;
const idxOf = (sy: number, sm: number, y: number, mm: number) => (y - sy) * 12 + (mm - sm);

export function ledgerOf(i: Inputs, o: Opts = {}): Ledger {
  const sy = Math.round(v(i.startYear)), sm = Math.round(v(i.startMonth)) || 1;
  const GBA = gbaOf(i)!;
  const NET = GBA * (v(i.efficiency) / 100);
  const HARD = GBA * v(i.hard);
  const DESIGN = HARD * (v(i.design) / 100);
  const networks = v(i.networks), landscaping = v(i.landscaping), permits = v(i.permits);
  const CONT = (HARD + DESIGN + networks + landscaping + permits) * (v(i.contingency) / 100);
  const CASH = HARD + DESIGN + networks + landscaping + permits + CONT;
  const pre = Math.max(0, Math.round(v(i.preMonths)));
  const build = Math.max(1, Math.round(v(i.buildMonths)));
  const C = pre + build;
  const sale = i.model === "sale", bts = i.model === "bts";
  const S = sale ? Math.max(1, Math.round(v(i.salesMonths))) : 0;
  const H = sale ? 0 : Math.round(v(bts ? i.leaseYears : i.holdYears) * 12);
  const E = sale ? C + S - 1 : C + H - 1;
  const Yexit = yearOf(sy, sm, E);
  const N = idxOf(sy, sm, Yexit + 1, 3) + 1;
  const z = () => new Array<number>(N).fill(0);
  const m = Object.fromEntries(LINES.map((k) => [k, z()])) as Monthly;
  for (let t = 0; t < N; t++) { m.year[t] = yearOf(sy, sm, t); m.month[t] = monthOf(sm, t); }

  const purchase = o.purchase;
  const LANDAPP = purchase !== undefined ? purchase : i.includeLand ? v(i.landMarket) : 0;
  const landBasis = purchase !== undefined ? purchase : v(i.landTaxBasis);
  const landBook = purchase !== undefined ? purchase : v(i.landBook);
  const share = v(i.landShare) / 100;

  // §2 development cost
  const preSpan = Math.max(1, pre);
  for (let t = 0; t < preSpan; t++) m.dev[t] += DESIGN / preSpan;
  m.dev[Math.max(0, pre - 1)] += permits;
  m.permitsAt[Math.max(0, pre - 1)] += permits;
  const works = HARD + networks + landscaping + CONT;
  for (let t = pre; t < C; t++) m.dev[t] += works / build;

  // §4 revenue and operations
  const rent = o.rentOverride ?? v(i.rent);
  const idx = v(i.indexation) / 100, opex = v(i.opex) / 100;
  const stab = bts ? 1 : v(i.occupancy) / 100;
  const leaseUp = bts ? 0 : Math.max(0, Math.round(v(i.leaseUp)));
  const kb = bts && o.earlyBreak && v(i.breakYear) > 0 ? Math.round(v(i.breakYear) * 12) : null;
  const voidM = Math.max(0, Math.round(v(i.voidMonths)));
  const relet = v(i.reletPct) / 100;
  const factor = (k: number) => Math.pow(1 + idx, Math.floor(k / 12));
  const occ = (k: number) => {
    if (kb !== null && k >= kb) return k < kb + voidM ? 0 : relet;
    return leaseUp > 0 ? stab * Math.min(1, (k + 1) / leaseUp) : stab;
  };
  const occF = kb !== null ? relet : stab;
  const noiAt = (k: number) => NET * rent * factor(k) * occ(k) * (1 - opex); // without the termination fee
  let TV = 0, NOI_TV = 0, exitCost = 0;
  const feeRev = z();
  if (sale) {
    for (let t = C; t <= E; t++) { m.rev[t] = (NET * v(i.price)) / S; m.com[t] = m.rev[t] * (v(i.commission) / 100); m.opIn[t] = m.rev[t] - m.com[t]; }
  } else {
    for (let t = C; t <= E; t++) {
      const k = t - C;
      let g = NET * rent * factor(k) * occ(k);
      if (kb !== null && k === kb) { feeRev[t] = NET * rent * factor(kb) * v(i.breakFee); g += feeRev[t]; }
      m.gross[t] = g;
      m.opexC[t] = (g - feeRev[t]) * opex;
      m.opIn[t] = g - m.opexC[t];
    }
    for (let k = H; k < H + 12; k++) NOI_TV += NET * rent * factor(k) * occF * (1 - opex);
    if (!o.noExit) {
      TV = NOI_TV / (v(i.exitYield) / 100);
      exitCost = TV * (v(i.exitCosts) / 100);
      m.netExit[E] = TV - exitCost;
    }
  }

  // §5 VAT
  const vr = i.vatOn ? (isNum(i.vatRate) ? i.vatRate : 20) / 100 : 0; // art. 96: 20 % when the field is empty (labelled)
  const rec = isNum(i.vatRecoverable) ? i.vatRecoverable / 100 : 1;
  const lag = Math.max(0, Math.round(v(i.vatRefundLag)));
  let cred = 0, cumRecPrev = 0;
  const cumD = z();
  for (let t = 0; t < N; t++) {
    if (i.vatOn) {
      m.inVAT[t] = vr * (m.dev[t] - m.permitsAt[t]);
      m.nonRec[t] = m.inVAT[t] * (1 - rec);
      m.D[t] = m.inVAT[t] - m.nonRec[t];
      if (sale) m.outVAT[t] = i.vatOnSale ? vr * m.rev[t] * (1 - share) : 0;
      else m.outVAT[t] = (i.vatOnRent ? vr * m.gross[t] : 0) + (t === E && i.vatOnSale && !o.noExit ? vr * TV * (1 - share) : 0);
    }
    const avail = cred + m.D[t];
    m.used[t] = Math.min(avail, m.outVAT[t]);
    m.payable[t] = m.outVAT[t] - m.used[t];
    const rem = avail - m.used[t];
    cumD[t] = (t > 0 ? cumD[t - 1] : 0) + m.D[t];
    if (i.vatOn && i.vatRefund) {
      // art. 101^1: the capital-investment VAT of a building is refunded only after commissioning (t ≥ C + lag)
      const eligible = (t - lag >= 0 ? cumD[t - lag] : 0) - cumRecPrev - m.used[t];
      m.refund[t] = t === N - 1 ? rem : t >= C + lag ? Math.max(0, Math.min(rem, eligible)) : 0;
    }
    cred = rem - m.refund[t];
    m.cred[t] = cred;
    cumRecPrev += m.used[t] + m.refund[t];
    m.vatCash[t] = -m.inVAT[t] + m.outVAT[t] - (t > 0 ? m.payable[t - 1] : 0) - (t === N - 1 ? m.payable[t] : 0) + m.refund[t];
  }
  const NONREC = m.nonRec.reduce((s2, x) => s2 + x, 0);

  // §7 financing
  const ltc = v(i.ltc) / 100;
  const FUND = m.dev.map((x, t) => x + m.nonRec[t]);
  const FUNDTOT = FUND.reduce((s2, x) => s2 + x, 0);
  const LOAN = ltc * FUNDTOT;
  const rL0 = v(i.interest) / 100 / 12;
  const rRefi = v(i.refiRate) / 100 / 12;
  const refiAt = !sale && i.refi && isNum(i.refiMonth) ? C + Math.round(i.refiMonth) : null;
  const AS = C + Math.max(0, Math.round(v(i.graceMonths)));
  let bal = 0, cumFund = 0, cumDraw = 0, feeAmt = 0, firstDraw = true;
  let sched: { from: number; n: number; P: number; B0: number; r: number } | null = null;
  const mkSched = (from: number, B0: number, years: number, r: number) => {
    const n = Math.max(1, Math.round(years * 12));
    const P = i.amort === "annuity" ? (r > 0 ? (B0 * r) / (1 - Math.pow(1 + r, -n)) : B0 / n) : B0 / n;
    return { from, n, P, B0, r };
  };
  for (let t = 0; t < N; t++) {
    const r = refiAt !== null && t > refiAt ? rRefi : rL0;
    const open = bal;
    const acc = open * r;
    m.acc[t] = acc;
    if (sale || t < C) bal = open + acc;
    else { m.intPaid[t] = acc; bal = open; }
    cumFund += FUND[t];
    const draw = i.drawOrder === "equityFirst" ? Math.min(FUND[t], Math.max(0, cumFund - (1 - ltc) * FUNDTOT) - cumDraw) : ltc * FUND[t];
    m.draw[t] = Math.max(0, draw);
    cumDraw += m.draw[t];
    if (m.draw[t] > 0 && firstDraw) { firstDraw = false; feeAmt = (v(i.fee) / 100) * LOAN; m.fee[t] = feeAmt; m.feeExp[t] = feeAmt; }
    bal += m.draw[t];
    if (t <= E) {
      if (sale) {
        if (t >= C) { const p = Math.min(bal, Math.max(0, m.rev[t] - m.com[t])); m.prin[t] += p; m.prinSched[t] += p; bal -= p; }
      } else if (t >= C) {
        if (i.amort !== "bullet") {
          if (sched === null && t >= AS && (refiAt === null || t <= refiAt)) sched = mkSched(t, bal, v(i.amortYears), rL0);
          if (sched !== null && t >= sched.from) {
            const p = Math.min(bal, i.amort === "annuity" ? Math.max(0, sched.P - acc) : sched.B0 / sched.n);
            m.prin[t] += p; m.prinSched[t] += p; bal -= p;
          }
        }
        if (refiAt !== null && t === refiAt) {
          // refinancing: the old balance repaid, the new loan drawn; amortisation restarts from the next month at the new rate
          const fwd = (() => { let x = 0; for (let k = t + 1 - C; k <= t + 12 - C; k++) x += noiAt(k); return x; })();
          const newLoan = (v(i.refiLtv) / 100) * (fwd / (v(i.refiCap) / 100));
          m.prin[t] += bal; bal = 0;
          m.refiNew[t] = newLoan; bal = newLoan;
          sched = i.amort === "bullet" ? null : mkSched(t + 1, newLoan, v(i.refiAmortYears), rRefi);
        }
      }
      if (t === E && bal > 0) { m.prin[t] += bal; bal = 0; }
    }
    m.bal[t] = bal;
  }
  // VAT facility (§5)
  let balV = 0;
  const facility = i.vatOn && i.vatFunding === "facility";
  for (let t = 0; t < N; t++) {
    const accV = balV * rL0;
    m.accV[t] = accV;
    if (t < C) balV += accV; else m.intPaidV[t] = accV;
    if (facility && t < C) { m.drawV[t] = m.D[t]; balV += m.D[t]; }
    if (facility) { const rp = Math.min(balV, m.used[t] + m.refund[t]); m.repV[t] = rp; balV -= rp; }
    if (t === E && balV > 0) { m.repV[t] += balV; balV = 0; }
    m.balV[t] = balV;
  }
  let CAPINT = 0;
  for (let t = 0; t < C && t < N; t++) CAPINT += m.acc[t] + m.accV[t];
  for (let t = 0; t < N; t++) m.intExp[t] = t < C && i.capitalizeInterest ? 0 : m.acc[t] + m.accV[t];

  // §6.1 property taxes
  const BASE_U = CASH + NONREC;
  const BASE_L = BASE_U + (i.capitalizeInterest ? CAPINT : 0);
  for (let t = 0; t < N; t++) {
    if (t <= E) m.landTaxA[t] = v(i.landTaxAnnual) / 12;
    if (t >= C && t <= E) m.bldTaxA[t] = ((v(i.buildingTaxRate) / 100) * BASE_U) / 12 * (sale ? 1 - (t - C) / S : 1);
  }
  const years: number[] = [];
  for (let y = m.year[0]; y <= m.year[N - 1]; y++) years.push(y);
  const months = i.propertyTaxMonths.length ? i.propertyTaxMonths : [12];
  for (const y of years) {
    let accrued = 0;
    for (let t = 0; t < N; t++) if (m.year[t] === y) accrued += m.landTaxA[t] + m.bldTaxA[t];
    if (!accrued) continue;
    for (const mm of months) m.ptCash[Math.min(N - 1, Math.max(0, idxOf(sy, sm, y, mm)))] += accrued / months.length;
  }

  // §6.2 depreciation / cost of sales
  const dep = (base: number, line: number[], life: N) => {
    if (sale || !isNum(life) || life <= 0) return base;
    const per = base / (12 * life);
    let cum = 0;
    for (let t = C; t <= E; t++) { const d2 = Math.min(per, base - cum); line[t] = d2; cum += d2; }
    return base - cum;
  };
  const RTV_U = sale ? null : dep(BASE_U, m.dep_U, i.depYears);
  const RTV_L = sale ? null : dep(BASE_L, m.dep_L, i.depYears);
  const revTot = m.rev.reduce((s2, x) => s2 + x, 0);
  if (sale && revTot > 0) for (let t = C; t <= E; t++) { m.cogs_U[t] = ((landBasis + BASE_U) * m.rev[t]) / revTot; m.cogs_L[t] = ((landBasis + BASE_L) * m.rev[t]) / revTot; }

  // §6.3 monthly taxable result
  const incl = isNum(i.capGainInclusion) ? i.capGainInclusion / 100 : 1;
  const exitTI = (rtv: number) => {
    const P = TV - exitCost, Pl = P * share, Pb = P - Pl;
    const gl = Pl - landBasis, gb = Pb - rtv;
    return (gl > 0 ? gl * incl : 0) + gb;
  };
  const intShare = isNum(i.interestRateCap) && v(i.interest) > 0 ? Math.min(1, i.interestRateCap / v(i.interest)) : 1;
  const intDis = z();
  for (let t = 0; t < N; t++) {
    intDis[t] = m.intExp[t] * (1 - intShare);
    const fin = m.intExp[t] * intShare + m.feeExp[t];
    if (sale) {
      m.TI_U[t] = m.rev[t] - m.com[t] - m.cogs_U[t] - m.landTaxA[t] - m.bldTaxA[t];
      m.TI_L[t] = m.rev[t] - m.com[t] - m.cogs_L[t] - m.landTaxA[t] - m.bldTaxA[t] - fin;
    } else {
      const op = m.gross[t] - m.opexC[t] - m.landTaxA[t] - m.bldTaxA[t];
      m.TI_U[t] = op - m.dep_U[t] + (t === E && !o.noExit ? exitTI(RTV_U!) : 0);
      m.TI_L[t] = op - m.dep_L[t] - fin + (t === E && !o.noExit ? exitTI(RTV_L!) : 0);
    }
  }

  // §6.4–§6.6 annual tax, losses, payment calendar
  const rate = isNum(i.taxRate) ? i.taxRate / 100 : 0;
  const lossYears = Math.max(0, Math.round(v(i.lossYears)));
  const annualOf = (TI: number[], levered: boolean) => {
    const out: { y: number; TIy: number; used: number; carried: number; lapsed: number; disallowed: number; tax: number }[] = [];
    const vint: { y: number; amount: number; left: number }[] = [];
    for (const y of years) {
      let TIy = 0, disallowed = 0;
      for (let t = 0; t < N; t++) if (m.year[t] === y) { TIy += TI[t]; if (levered) disallowed += intDis[t]; }
      let used = 0, lapsed = 0;
      if (i.lossMode === "equal") {
        let allowance = 0;
        for (const vv of vint) if (y >= vv.y + 1 && y <= vv.y + lossYears) allowance += vv.amount / lossYears;
        used = Math.min(allowance, Math.max(0, TIy));
        lapsed = allowance - used;
        for (const vv of vint) if (y >= vv.y + 1 && y <= vv.y + lossYears) vv.left -= vv.amount / lossYears;
      } else {
        for (const vv of vint) if (vv.left > 0 && y > vv.y + lossYears) { lapsed += vv.left; vv.left = 0; }
        let need = Math.max(0, TIy);
        for (const vv of vint) { if (need <= 0) break; if (vv.left <= 0) continue; const u2 = Math.min(vv.left, need); vv.left -= u2; need -= u2; used += u2; }
      }
      if (TIy < 0 && lossYears > 0) vint.push({ y, amount: -TIy, left: -TIy });
      // losses still usable in a later year (a vintage whose last year is y is not carried — it lapses unless used)
      const carried = vint.reduce((s2, vv) => s2 + (vv.y + lossYears > y ? Math.max(0, vv.left) : 0), 0);
      const tax = rate * (Math.max(0, TIy) - used);
      out.push({ y, TIy, used, carried, lapsed, disallowed, tax });
    }
    return out;
  };
  const AU = annualOf(m.TI_U, false), AL = annualOf(m.TI_L, true);
  const schedule = (A: typeof AU, line: number[]) => {
    const at = (y: number, mm: number) => Math.min(N - 1, Math.max(0, idxOf(sy, sm, y, mm)));
    const method = i.advanceMethod ?? "none";
    const taxOf = (y: number) => A.find((r) => r.y === y)?.tax ?? 0;
    for (const r of A) {
      if (!r.tax && method !== "prior") continue;
      if (method === "none") line[at(r.y + 1, 3)] += r.tax;
      else if (method === "current") for (const q of [3, 6, 9, 12]) line[at(r.y, q)] += r.tax / 4;
      else {
        const adv = r.y <= Yexit ? taxOf(r.y - 1) / 4 : 0;
        if (adv) for (const q of [3, 6, 9, 12]) line[at(r.y, q)] += adv;
        const settle = r.tax - 4 * adv;
        if (settle) line[at(r.y + 1, 3)] += settle;
      }
    }
  };
  if (rate > 0) { schedule(AU, m.taxCash_U); schedule(AL, m.taxCash_L); }

  // §8 cash flows
  for (let t = 0; t < N; t++) {
    const common = -m.dev[t] + m.opIn[t] + m.netExit[t] - m.ptCash[t] + m.vatCash[t];
    m.U[t] = (t === 0 ? -LANDAPP : 0) + common - m.taxCash_U[t];
    m.CF[t] = m.U[t] + (t === 0 ? LANDAPP : 0);
    m.Lv[t] = (t === 0 ? -LANDAPP : 0) + common - m.taxCash_L[t] + m.draw[t] - m.intPaid[t] - m.prin[t] - m.fee[t] + m.refiNew[t] + m.drawV[t] - m.intPaidV[t] - m.repV[t];
  }

  // accounting view (§14) — levered, book values
  const bookLife = isNum(i.bookDepYears) ? i.bookDepYears : i.depYears;
  const bookDep = z();
  const NBV = sale ? null : dep(BASE_L, bookDep, bookLife);
  const annual: Annual[] = years.map((y, k) => {
    let acct = 0, cashL = 0, paidU = 0, paidL = 0;
    for (let t = 0; t < N; t++) {
      if (m.year[t] !== y) continue;
      cashL += m.Lv[t]; paidU += m.taxCash_U[t]; paidL += m.taxCash_L[t];
      const fin = m.intExp[t] + m.feeExp[t]; // the accounting view expenses the whole interest
      if (sale) acct += m.rev[t] - m.com[t] - (revTot > 0 ? ((landBook + BASE_L) * m.rev[t]) / revTot : 0) - m.landTaxA[t] - m.bldTaxA[t] - fin;
      else acct += m.gross[t] - m.opexC[t] - m.landTaxA[t] - m.bldTaxA[t] - bookDep[t] - fin + (t === E && !o.noExit ? TV - exitCost - landBook - (NBV ?? 0) : 0);
    }
    acct -= AL[k].tax;
    return {
      year: y, TIy_U: AU[k].TIy, TIy_L: AL[k].TIy, lossUsed_U: AU[k].used, lossUsed_L: AL[k].used, lossCarried_U: AU[k].carried, lossCarried_L: AL[k].carried,
      lossLapsed_U: AU[k].lapsed, lossLapsed_L: AL[k].lapsed, intDisallowed: AL[k].disallowed, tax_U: AU[k].tax, tax_L: AL[k].tax, taxPaid_U: paidU, taxPaid_L: paidL, acctProfit: acct, cashFlowL: cashL,
    };
  });

  // NOI metrics (§4)
  let NOI_Y1: number | null = null, NOI_stab: number | null = null, NOI_next: number | null = null, s: number | null = null;
  if (!sale) {
    NOI_Y1 = 0;
    for (let k = 0; k < 12; k++) NOI_Y1 += C + k <= E ? m.opIn[C + k] : noiAt(k);
    const ks = bts ? 0 : Math.max(leaseUp, 1) - 1;
    s = C + ks;
    NOI_stab = 12 * noiAt(ks);
    NOI_next = 0;
    for (let k = ks + 1; k <= ks + 12; k++) NOI_next += noiAt(k);
  }

  return {
    model: i.model, C, E, N, S, H, GBA, NET, CASH, NONREC, LANDAPP,
    costs: { hard: HARD, design: DESIGN, networks, landscaping, permits, contingency: CONT },
    m, annual, TV, NOI_TV, NOI_Y1, NOI_stab, NOI_next, s, BASE_U, BASE_L, CAPINT, RTV_U, RTV_L, LOAN, feeAmt, refiAt, rent,
  };
}

// ------------------------------------------------------------------ results (§9) ------------------------------------------------------------------

export type Paybacks = { cashOp: number | null; cashExit: number | null; econOp: number | null; econExit: number | null };
export type Summary = {
  hurdle: number;
  NPV_U: number; NPV_CF: number; NPV_L: number;
  irrU: IrrResult; irrCF: IrrResult; irrL: IrrResult;
  /** strict: the unique IRR only (null when not unique) */
  IRR_U: number | null; IRR_CF: number | null; IRR_L: number | null;
  /** shown: the unique IRR or the proven unique non-negative IRR (with the warning) */
  IRR_U_nn: number | null; IRR_CF_nn: number | null; IRR_L_nn: number | null;
  peakFunding: number; peakEquity: number;
  pb: Paybacks;
  profitL: number; revenue: number; taxAccrued_U: number; taxAccrued_L: number; taxPaid_U: number; taxPaid_L: number;
  interestTotal: number; propertyTax: number; vatIn: number; vatOut: number; vatRefunded: number; vatLapsed: number; peakVat: number;
  YoC: number | null; YoC_cash: number | null;
  DSCRmin: number | null; dscr: { year: number; noi: number; ds: number; dscr: number | null }[]; LTV_stab: number | null; LTV_exit: number | null; debtYield: number | null;
  shortfallMonths: number; shortfallSum: number;
  landMax: { value: number | null; below: boolean };
};
export type Result = { ok: true; inputs: Inputs; ledger: Ledger; summary: Summary; notes: NoteKey[] } | { ok: false; issues: Issue[] };

const cumMin = (x: number[]) => { let c = 0, mn = 0; for (const a of x) { c += a; mn = Math.min(mn, c); } return -mn; };

export function hurdleOf(i: Inputs) { return i.model === "bts" ? v(i.target) : v(i.discount); }

/** C · the rent the results are computed at: the proposed rent, else the minimum rent */
function appliedRent(i: Inputs): number | null {
  if (i.model !== "bts") return null;
  if (isNum(i.rent) && i.rent > 0) return i.rent;
  return minRent(i).value;
}

export function run(i: Inputs, o: Opts = {}): Result {
  const issues = validate(i);
  if (issues.length) return { ok: false, issues };
  let opts = o;
  if (i.model === "bts" && o.rentOverride === undefined) {
    const r = appliedRent(i);
    if (r === null) return { ok: false, issues: [{ key: "rent", kind: "range" }] };
    opts = { ...o, rentOverride: r };
  }
  const L = ledgerOf(i, opts);
  const m = L.m;
  const h = hurdleOf(i);
  const sum = (a: number[]) => a.reduce((s2, x) => s2 + x, 0);
  // the operating variant for the operating paybacks (B / C)
  const op = i.model === "sale" ? L : ledgerOf(i, { ...opts, noExit: true });
  const pb: Paybacks = { cashOp: paybackOf(op.m.CF), cashExit: paybackOf(m.CF), econOp: paybackOf(op.m.U), econExit: paybackOf(m.U) };
  // debt metrics (B / C)
  const dscr: Summary["dscr"] = [];
  let shortfallMonths = 0, shortfallSum = 0;
  if (i.model !== "sale") {
    for (let k = 0; k * 12 < L.H; k++) {
      let noi = 0, ds = 0;
      for (let t = L.C + 12 * k; t < L.C + 12 * k + 12 && t <= L.E; t++) { noi += m.opIn[t]; ds += m.intPaid[t] + m.prinSched[t]; }
      dscr.push({ year: k + 1, noi, ds, dscr: ds > 0 ? noi / ds : null });
    }
    for (let t = L.C; t <= L.E; t++) {
      const avail = m.opIn[t] - m.ptCash[t] - m.taxCash_L[t] + m.vatCash[t];
      const ds = m.intPaid[t] + m.prinSched[t];
      if (avail < ds - 1e-9) { shortfallMonths++; shortfallSum += ds - avail; }
    }
  }
  const dsList = dscr.filter((x) => x.dscr !== null).map((x) => x.dscr!);
  const value = (noi: number | null) => (noi !== null ? noi / (v(i.exitYield) / 100) : null);
  const balS = L.s !== null ? m.bal[L.s] : null;
  const balBeforeExit = i.model !== "sale" ? m.bal[L.E - 1] ?? 0 : 0;
  const vS = value(L.NOI_stab);
  const npvCF = npvOf(m.CF, h);
  const irrU = irrAnalysis(m.U), irrCF = irrAnalysis(m.CF), irrL = irrAnalysis(m.Lv);
  let peakVat = 0, cumV = 0;
  for (const x of m.vatCash) { cumV += x; peakVat = Math.max(peakVat, -cumV); }
  const summary: Summary = {
    hurdle: h,
    NPV_U: npvOf(m.U, h), NPV_CF: npvCF, NPV_L: npvOf(m.Lv, h),
    irrU, irrCF, irrL,
    IRR_U: irrU.kind === "unique" ? irrU.annual : null, IRR_CF: irrCF.kind === "unique" ? irrCF.annual : null, IRR_L: irrL.kind === "unique" ? irrL.annual : null,
    IRR_U_nn: irrShown(irrU), IRR_CF_nn: irrShown(irrCF), IRR_L_nn: irrShown(irrL),
    peakFunding: cumMin(m.CF), peakEquity: cumMin(m.Lv),
    pb,
    profitL: sum(m.Lv), revenue: sum(m.rev) + sum(m.gross), taxAccrued_U: sum(L.annual.map((a) => a.tax_U)), taxAccrued_L: sum(L.annual.map((a) => a.tax_L)), taxPaid_U: sum(m.taxCash_U), taxPaid_L: sum(m.taxCash_L),
    interestTotal: sum(m.acc) + sum(m.accV), propertyTax: sum(m.ptCash), vatIn: sum(m.inVAT), vatOut: sum(m.outVAT), vatRefunded: sum(m.refund), vatLapsed: i.vatOn && !i.vatRefund ? m.cred[L.N - 1] : 0, peakVat,
    YoC: L.NOI_stab !== null && L.CASH + L.NONREC + L.LANDAPP > 0 ? L.NOI_stab / (L.CASH + L.NONREC + L.LANDAPP) : null,
    YoC_cash: L.NOI_stab !== null && L.CASH + L.NONREC > 0 ? L.NOI_stab / (L.CASH + L.NONREC) : null,
    DSCRmin: dsList.length ? Math.min(...dsList) : null, dscr,
    LTV_stab: balS !== null && vS ? balS / vS : null,
    LTV_exit: i.model !== "sale" && L.TV > 0 ? balBeforeExit / L.TV : null,
    debtYield: balS && L.NOI_stab !== null ? L.NOI_stab / balS : null,
    shortfallMonths, shortfallSum,
    landMax: npvCF > 0 ? { value: npvCF, below: false } : { value: 0, below: true },
  };
  return { ok: true, inputs: i, ledger: L, summary, notes: notesOf(i) };
}

// ------------------------------------------------------------------ solvers (§10) ------------------------------------------------------------------

export type Solved = { value: number | null; residual: number | null; reached: boolean };

/** the root of an increasing function on [lo, ∞): hi doubled until f(hi) > 0 (stop at cap), then bisection; verified by substitution */
function rootUp(f: (x: number) => number, lo: number, start: number, cap: number, tol: number): Solved {
  const flo = f(lo);
  if (!Number.isFinite(flo)) return { value: null, residual: null, reached: false };
  if (flo >= 0) return { value: lo, residual: flo, reached: true };
  let hi = Math.max(start, lo + tol), fhi = f(hi);
  while (Number.isFinite(fhi) && fhi < 0 && hi < cap) { hi *= 2; fhi = f(hi); }
  if (!Number.isFinite(fhi) || fhi < 0) return { value: null, residual: null, reached: false };
  let a = lo, b = hi;
  for (let k = 0; k < 300 && b - a > tol; k++) { const mid = (a + b) / 2; if (f(mid) < 0) a = mid; else b = mid; }
  const x = (a + b) / 2;
  return { value: x, residual: f(x), reached: true };
}

/** C · the minimum rent (€/m² leasable · month) with NPV(U) = 0 at the owner's required return — no fixed ceiling (Codex P2) */
export function minRent(i: Inputs, o: Opts = {}): Solved {
  if (i.model !== "bts" || validate({ ...i, rent: null }).length) return { value: null, residual: null, reached: false };
  const f = (r: number) => npvOf(ledgerOf(i, { ...o, rentOverride: r }).m.U, v(i.target));
  return rootUp(f, 0, 1, 1e7, 1e-9);
}

/** the maximum purchase price of a land still to be bought (the price is the outflow, the tax basis and the book value) — §10 */
export function purchaseMax(i: Inputs): Solved {
  const base = run(i);
  if (!base.ok) return { value: null, residual: null, reached: false };
  const rent = i.model === "bts" ? base.ledger.rent : undefined;
  const h = hurdleOf(i);
  const f = (P: number) => -npvOf(ledgerOf(i, { purchase: P, rentOverride: rent }).m.U, h); // −NPV increases with P
  const f0 = -f(0);
  if (f0 <= 0) return { value: 0, residual: f0, reached: true };
  const r = rootUp(f, 0, Math.max(1, f0), 1e10, 0.005);
  return r.value === null ? r : { ...r, residual: -(r.residual ?? 0) };
}

export type BreakEven = { price: Solved | null; rent: Solved | null; occupancy: Solved | null };
/** A · the sale price, B · the rent and the occupancy at which the project NPV is zero */
export function breakEven(i: Inputs): BreakEven {
  const out: BreakEven = { price: null, rent: null, occupancy: null };
  if (validate(i).length) return out;
  const h = hurdleOf(i);
  const npvWith = (patch: Partial<Inputs>) => npvOf(ledgerOf({ ...i, ...patch }).m.U, h);
  if (i.model === "sale") out.price = rootUp((p) => npvWith({ price: p }), 0, Math.max(1, v(i.price)), 1e7, 1e-6);
  if (i.model === "hold") {
    out.rent = rootUp((r) => npvWith({ rent: r }), 0, Math.max(1, v(i.rent)), 1e7, 1e-9);
    const occ = rootUp((o) => npvWith({ occupancy: o }), 0, 100, 100, 1e-7);
    out.occupancy = occ.value !== null && occ.value <= 100 ? occ : { value: null, residual: null, reached: false };
  }
  return out;
}

// ------------------------------------------------------------------ scenarios, sensitivity, matrix (§15) ------------------------------------------------------------------

export type VariantKey = "realistic" | "optimistic" | "pessimistic";
export const VARIANTS = {
  optimistic: { revenue: 10, hard: -5, build: -2, ramp: -2, exitYield: -0.25, interest: -1 },
  pessimistic: { revenue: -10, hard: 10, build: 3, ramp: 3, exitYield: 0.5, interest: 1.5 },
} as const;

export function variantOf(i: Inputs, key: VariantKey): Inputs {
  if (key === "realistic") return i;
  const d = VARIANTS[key];
  const scale = (x: N, pct: number) => (isNum(x) ? x * (1 + pct / 100) : x);
  const shift = (x: N, by: number, min: number) => (isNum(x) ? Math.max(min, x + by) : x);
  return {
    ...i,
    price: scale(i.price, d.revenue), rent: scale(i.rent, d.revenue), hard: scale(i.hard, d.hard),
    buildMonths: shift(i.buildMonths, d.build, 1), salesMonths: shift(i.salesMonths, d.ramp, 1), leaseUp: shift(i.leaseUp, d.ramp, 0),
    exitYield: shift(i.exitYield, d.exitYield, 0.5), interest: shift(i.interest, d.interest, 0),
  };
}

export type SensKey = "capex" | "land" | "rent" | "occupancy" | "time" | "price" | "exitYield" | "interest" | "ltc" | "taxBasis" | "vatLag";
export type SensRow = { key: SensKey; low: { npv: number | null; irrL: number | null; minRent: number | null }; high: { npv: number | null; irrL: number | null; minRent: number | null } };

export function sensitivity(i: Inputs): SensRow[] {
  const rows: [SensKey, Partial<Inputs>, Partial<Inputs>][] = [];
  const sc = (x: N, f: number) => (isNum(x) ? x * f : x);
  rows.push(["capex", { hard: sc(i.hard, 0.9) }, { hard: sc(i.hard, 1.1) }]);
  if (v(i.landMarket) > 0 && i.includeLand) rows.push(["land", { landMarket: sc(i.landMarket, 0.8) }, { landMarket: sc(i.landMarket, 1.2) }]);
  if (i.model !== "sale" && (i.model === "hold" || v(i.rent) > 0)) rows.push(["rent", { rent: sc(i.rent, 0.9) }, { rent: sc(i.rent, 1.1) }]);
  if (i.model === "hold") rows.push(["occupancy", { occupancy: Math.max(1, v(i.occupancy) - 5) }, { occupancy: Math.min(100, v(i.occupancy) + 5) }]);
  rows.push(["time", { buildMonths: Math.max(1, v(i.buildMonths) - 3) }, { buildMonths: v(i.buildMonths) + 3 }]);
  if (i.model === "sale") rows.push(["price", { price: sc(i.price, 0.9) }, { price: sc(i.price, 1.1) }]);
  if (i.model !== "sale") rows.push(["exitYield", { exitYield: Math.max(0.5, v(i.exitYield) - 0.5) }, { exitYield: v(i.exitYield) + 0.5 }]);
  if (v(i.ltc) > 0) {
    rows.push(["interest", { interest: Math.max(0, v(i.interest) - 2) }, { interest: v(i.interest) + 2 }]);
    rows.push(["ltc", { ltc: Math.max(0, v(i.ltc) - 10) }, { ltc: Math.min(95, v(i.ltc) + 10) }]);
  }
  if (isNum(i.taxRate) && v(i.landTaxBasis) > 0) rows.push(["taxBasis", { landTaxBasis: sc(i.landTaxBasis, 0.5) }, { landTaxBasis: sc(i.landTaxBasis, 1.5) }]);
  if (i.vatOn && i.vatRefund) rows.push(["vatLag", { vatRefundLag: Math.max(0, v(i.vatRefundLag) - 3) }, { vatRefundLag: v(i.vatRefundLag) + 3 }]);
  const one = (patch: Partial<Inputs>) => {
    const x = { ...i, ...patch };
    const okx = !validate(x).length;
    const rent = x.model === "bts" ? (isNum(x.rent) && x.rent > 0 ? x.rent : minRent(x).value) : undefined;
    if (!okx || (x.model === "bts" && rent === null)) return { npv: null, irrL: null, minRent: null };
    const L = ledgerOf(x, rent !== undefined && rent !== null ? { rentOverride: rent } : {});
    return { npv: npvOf(L.m.U, hurdleOf(x)), irrL: irrShown(irrAnalysis(L.m.Lv)), minRent: x.model === "bts" && !(isNum(i.rent) && i.rent > 0) ? rent ?? null : x.model === "bts" ? minRent(x).value : null };
  };
  return rows.map(([key, lo, hi]) => ({ key, low: one(lo), high: one(hi) }));
}

/** the project NPV only (no IRR, no operating variant) — for the matrix and the solvers */
export function npvU(i: Inputs, o: Opts = {}): number | null {
  if (validate(i).length) return null;
  let opts = o;
  if (i.model === "bts" && o.rentOverride === undefined) { const r = appliedRent(i); if (r === null) return null; opts = { ...o, rentOverride: r }; }
  return npvOf(ledgerOf(i, opts).m.U, hurdleOf(i));
}

export type Matrix = { rowKey: "rent" | "price"; colKey: "exitYield" | "hard"; rows: number[]; cols: number[]; npv: (number | null)[][] };
/** the two-factor NPV matrix (§15): B / C rent × exit yield; A price × construction cost */
export function matrix(i: Inputs): Matrix {
  const pcts = [-20, -10, 0, 10, 20];
  if (i.model === "sale") {
    const cols = [-10, -5, 0, 5, 10];
    return { rowKey: "price", colKey: "hard", rows: pcts, cols, npv: pcts.map((p) => cols.map((c) => npvU({ ...i, price: v(i.price) * (1 + p / 100), hard: v(i.hard) * (1 + c / 100) }))) };
  }
  const cols = [-1, -0.5, 0, 0.5, 1];
  const baseRent = i.model === "bts" ? (isNum(i.rent) && i.rent > 0 ? i.rent : minRent(i).value) : v(i.rent);
  return {
    rowKey: "rent", colKey: "exitYield", rows: pcts, cols,
    npv: pcts.map((p) => cols.map((c) => {
      if (baseRent === null) return null;
      const ey = v(i.exitYield) + c;
      if (ey < 0.5) return null;
      return npvU({ ...i, rent: baseRent * (1 + p / 100), exitYield: ey });
    })),
  };
}

/** quarterly series for the cash-flow chart (project view U): inflows, outflows, cumulative */
export function quarterly(L: Ledger): { q: number; inflow: number; outflow: number; cumulative: number }[] {
  const out: { q: number; inflow: number; outflow: number; cumulative: number }[] = [];
  let cum = 0;
  for (let q = 0; q * 3 < L.N; q++) {
    let inflow = 0, outflow = 0;
    for (let t = q * 3; t < Math.min(L.N, q * 3 + 3); t++) {
      const x = L.m.U[t];
      if (x >= 0) inflow += x; else outflow -= x;
      cum += x;
    }
    out.push({ q, inflow, outflow, cumulative: cum });
  }
  return out;
}
