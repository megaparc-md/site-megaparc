/**
 * PRODUCER DIRECT RETAIL — the CFO model v2 «Торговая сеть или собственный магазин: что выгоднее производителю?» (OWNER MASTER
 * MANDATE «R10 RELEASE + BRAND ICON + PRODUCER ECONOMICS + LEASING GROWTH», 2026-11-13, §3). Specification:
 * docs/finance/PRODUCER_RETAIL_CFO_MODEL_V2_SPEC.md; verified by scripts/qa-producer-model.mjs (independent hand calculation).
 *
 * Two channels side by side on the same rows — A · retail chains, B · the own store — then the company view (with the store against
 * without it). A steady month, every amount excluding VAT, in euros. The production cost per unit `c` is the same in both channels
 * (the store receives the goods at cost — no transfer markup, so no margin is counted twice); every cost line belongs to exactly one
 * channel. EBITDA = the channel's contribution before depreciation, interest and income tax; the operating cash flow of a steady
 * month equals it; working capital and the start-up money are one-off and shown apart. A missing input (null) means «not stated»:
 * an answer exists only when its own inputs do — nothing is pre-filled in favour of the store.
 */

export const DAYS_PER_MONTH = 365 / 12;

export type ProducerInputs = {
  // A · retail chains (per month)
  chainUnits: number | null; // Qa
  chainPrice: number | null; // pa — list (supply) price per unit
  unitCost: number | null; // c — production cost per unit (both channels)
  chainDiscounts: number | null; // d, % of list — on the invoice
  chainBonuses: number | null; // b, % of list — retro-bonuses
  chainFees: number | null; // Fa — marketing and listing payments, € / month
  chainLogistics: number | null; // la, % of shipments at list price
  chainDays: number | null; // D — payment delay
  costOfMoney: number | null; // r, % a year
  // B · the own store (per month)
  retailPrice: number | null; // pb — per unit
  buyersPerDay: number | null; // N
  ticket: number | null; // T — average ticket, €
  openDays: number | null; // W
  rent: number | null; // A
  utilities: number | null; // U — at actual charges
  utilitiesFee: number | null; // f, % (Moscova 20: 15)
  staff: number | null; // P — salaries with taxes
  marketing: number | null; // Mk
  acquiring: number | null; // a, % of revenue
  losses: number | null; // w, % of the cost of goods sold
  opex: number | null; // O — other operating costs
  storeLogistics: number | null; // Ls — deliveries to the store, € / month (independent review: the chain carried logistics, the store did not)
  inventoryDays: number | null; // I
  cannibalisation: number | null; // γ, % of store units
  capex: number | null;
  depositMonths: number | null; // n (Moscova 20: 3)
};

export type ScenarioShift = { buyers: number; cannibalisation: number }; // multiplier · percentage points
export const scenarioShifts: Record<"pessimistic" | "realistic" | "optimistic", ScenarioShift> = {
  pessimistic: { buyers: 0.75, cannibalisation: 10 },
  realistic: { buyers: 1, cannibalisation: 0 },
  optimistic: { buyers: 1.2, cannibalisation: -10 },
};

const num = (v: number | null | undefined) => (typeof v === "number" && Number.isFinite(v) ? v : null);
const pct = (v: number | null | undefined) => { const x = num(v); return x === null ? null : x / 100; };
const has = (...v: (number | null)[]) => v.every((x) => x !== null);
const months = (amount: number | null, perMonth: number | null) => (amount !== null && perMonth !== null && perMonth > 0 ? amount / perMonth : null);

export type ChainResult = {
  revenue: number; gross: number; ebitda: number; margin: number | null;
  unitContribution: number; breakEvenUnits: number | null;
  workingCapital: number | null; delayCost: number | null; cashFlow: number;
};
export type StoreResult = {
  revenue: number; units: number; cogs: number; losses: number; gross: number; acquiring: number; fixed: number; utilitiesTotal: number;
  ebitda: number; margin: number | null; contribution: number;
  breakEvenRevenue: number | null; breakEvenBuyers: number | null;
  inventory: number | null; deposit: number | null; workingCapital: number | null; cashFlow: number;
};
export type CompanyResult = {
  lostChain: number; incremental: number;
  /** chain receivables freed on the replaced volume — a LATER inflow (about D days after the sales move), never netted into the start */
  released: number | null;
  /** the gross money of the start: CAPEX + deposit + stock (independent review: the release comes later and runs the wrong way when netted) */
  startCash: number | null;
  /** simple payback of the steady month: start-up cash / incremental EBITDA (no ramp-up, no pre-opening costs, before tax) */
  payback: number | null; breakEvenBuyers: number | null; safety: number | null;
};
export type ProducerResult = { chain: ChainResult | null; store: StoreResult | null; company: CompanyResult | null };

export function chainOf(i: ProducerInputs): ChainResult | null {
  const Q = num(i.chainUnits), p = num(i.chainPrice), c = num(i.unitCost), d = pct(i.chainDiscounts), b = pct(i.chainBonuses);
  if (!has(Q, p, c, d, b) || Q! <= 0 || p! <= 0) return null;
  const la = pct(i.chainLogistics) ?? 0, F = num(i.chainFees) ?? 0;
  const list = Q! * p!;
  const revenue = list * (1 - d! - b!);
  const gross = revenue - Q! * c!;
  const ebitda = gross - F - list * la;
  const unitContribution = p! * (1 - d! - b! - la) - c!;
  const D = num(i.chainDays), r = pct(i.costOfMoney);
  const workingCapital = D === null ? null : list * (1 - d!) * (D / DAYS_PER_MONTH);
  return {
    revenue, gross, ebitda, margin: revenue > 0 ? ebitda / revenue : null,
    unitContribution, breakEvenUnits: unitContribution > 0 ? F / unitContribution : null,
    workingCapital, delayCost: workingCapital !== null && r !== null ? (workingCapital * r) / 12 : null, cashFlow: ebitda,
  };
}

export function storeOf(i: ProducerInputs, buyersFactor = 1): StoreResult | null {
  const pb = num(i.retailPrice), N = num(i.buyersPerDay), T = num(i.ticket), W = num(i.openDays), c = num(i.unitCost);
  if (!has(pb, N, T, W, c) || pb! <= 0 || T! <= 0 || W! <= 0) return null;
  if (num(i.rent) === null && num(i.staff) === null) return null; // a store without costs is not a store
  const w = pct(i.losses) ?? 0, a = pct(i.acquiring) ?? 0;
  const revenue = N! * buyersFactor * T! * W!;
  const units = revenue / pb!;
  const cogs = units * c!;
  const losses = cogs * w;
  const gross = revenue - cogs - losses;
  const acquiring = revenue * a;
  const utilitiesTotal = (num(i.utilities) ?? 0) * (1 + (pct(i.utilitiesFee) ?? 0));
  const fixed = (num(i.rent) ?? 0) + utilitiesTotal + (num(i.staff) ?? 0) + (num(i.marketing) ?? 0) + (num(i.opex) ?? 0) + (num(i.storeLogistics) ?? 0);
  const ebitda = gross - acquiring - fixed;
  const contribution = 1 - (c! / pb!) * (1 + w) - a;
  const breakEvenRevenue = contribution > 0 ? fixed / contribution : null;
  const I = num(i.inventoryDays);
  const inventory = I === null ? null : (cogs / DAYS_PER_MONTH) * I;
  const rent = num(i.rent), n = num(i.depositMonths);
  const deposit = rent !== null && n !== null ? rent * n : null;
  return {
    revenue, units, cogs, losses, gross, acquiring, fixed, utilitiesTotal, ebitda, margin: revenue > 0 ? ebitda / revenue : null, contribution,
    breakEvenRevenue, breakEvenBuyers: breakEvenRevenue !== null ? breakEvenRevenue / (T! * W!) : null,
    inventory, deposit, workingCapital: inventory, cashFlow: ebitda,
  };
}

export function companyOf(i: ProducerInputs, chain: ChainResult | null, store: StoreResult | null, cannibalisationShift = 0, buyersFactor = 1): CompanyResult | null {
  if (!store) return null;
  const g0 = num(i.cannibalisation);
  if (g0 === null) return null;
  const g = Math.min(100, Math.max(0, g0 + cannibalisationShift)) / 100;
  // without the chain terms only γ = 0 can be compared
  if (!chain && g > 0) return null;
  const ua = chain ? chain.unitContribution : 0;
  const lostChain = g * store.units * ua;
  const incremental = store.ebitda - lostChain;
  const p = num(i.chainPrice), d = pct(i.chainDiscounts), D = num(i.chainDays);
  const released = g === 0 ? 0 : p !== null && d !== null && D !== null ? g * store.units * p * (1 - d) * (D / DAYS_PER_MONTH) : null;
  const capex = num(i.capex);
  const startCash = capex !== null && store.inventory !== null ? capex + (store.deposit ?? 0) + store.inventory : null;
  const pb = num(i.retailPrice)!, T = num(i.ticket)!, W = num(i.openDays)!;
  const netContribution = store.contribution - (g * ua) / pb;
  const beRevenue = netContribution > 0 ? store.fixed / netContribution : null;
  const breakEvenBuyers = beRevenue !== null ? beRevenue / (T * W) : null;
  // the plan of this scenario (buyers a day × the scenario factor) — found by the independent check of the formulas
  const plan = num(i.buyersPerDay)! * buyersFactor;
  return { lostChain, incremental, released, startCash, payback: months(startCash, incremental), breakEvenBuyers, safety: breakEvenBuyers !== null && plan > 0 ? (plan - breakEvenBuyers) / plan : null };
}

export function calcProducer(i: ProducerInputs, shift: ScenarioShift = scenarioShifts.realistic): ProducerResult {
  const chain = chainOf(i);
  const store = storeOf(i, shift.buyers);
  return { chain, store, company: companyOf(i, chain, store, shift.cannibalisation, shift.buyers) };
}

/** a notional manufacturer (never market data); the rent is the Moscova 20 preliminary calculation, inserted by name */
export const producerExample: ProducerInputs = {
  chainUnits: 20000, chainPrice: 3, unitCost: 1.65, chainDiscounts: 8, chainBonuses: 6, chainFees: 1500, chainLogistics: 2, chainDays: 60, costOfMoney: 12,
  retailPrice: 4.05, buyersPerDay: 220, ticket: 9, openDays: 30, rent: 10429.5, utilities: 1200, utilitiesFee: 15, staff: 9000, marketing: 2000,
  acquiring: 1.5, losses: 2, opex: 1500, storeLogistics: 880, inventoryDays: 30, cannibalisation: 30, capex: 120000, depositMonths: 3,
};
