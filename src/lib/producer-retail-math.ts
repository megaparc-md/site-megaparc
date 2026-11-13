/**
 * PRODUCER DIRECT RETAIL — the CFO model «Продажи через торговую сеть vs Собственный магазин» (OWNER «PRODUCER DIRECT RETAIL
 * STRATEGY R10», 2026-11-13, §04). Methodology: docs/finance/PRODUCER_RETAIL_CFO_MODEL.md; verified by scripts/qa-producer-model.mjs.
 *
 * A steady month, every amount in one currency and excluding VAT. Profit (P&L) and cash are kept apart: the payment delay of a chain
 * does not change the margin, it ties up money; inventory and the deposit are money, not costs. No depreciation, interest or income
 * tax (an operating result before them); no ramp-up (the month the store reaches its planned revenue).
 *
 * The comparison is made in LIST-PRICE terms: the producer's list (supply) price is the common yardstick. A store revenue R at a
 * retail price m % above the list price carries R / (1 + m) of goods at list price; their cost is k % of that.
 *
 * Cannibalisation γ: the share of the store's sales that the same buyers would otherwise have bought in a chain. The chain
 * contribution on that volume (list price less discounts, retro-bonuses and cost) is given up; the chain's fixed payments are not
 * (they do not fall with a part of the volume). The cash side releases the chain receivables on that volume.
 *
 * Every input may be missing (null): an answer is computed only when its own inputs exist — never from a guessed default.
 */

export const DAYS_PER_MONTH = 365 / 12;

export type ProducerInputs = {
  // 01 · the product and the chain channel (per month)
  chainShipments: number | null; // shipments to chains at the list price, excl. VAT
  costRatio: number | null; // cost of goods, % of the list price
  chainDiscounts: number | null; // on-invoice discounts and promotions, % of the list price
  chainBonuses: number | null; // retro-bonuses, % of the list price (settled after the invoice)
  chainFees: number | null; // fixed payments: listing, marketing, logistics to the chain, per month
  chainDays: number | null; // payment delay, days
  costOfMoney: number | null; // % a year — the price of the money tied up
  // 02 · the own store (per month)
  storeRevenue: number | null; // planned store revenue, excl. VAT
  retailMarkup: number | null; // the store's retail price above the list price, %
  rent: number | null; // base rent (Moscova 20: the visitor may insert the preliminary calculation)
  utilities: number | null; // at actual charges
  utilitiesFee: number | null; // % added to the utilities (Moscova 20: 15 — administration and maintenance of the engineering networks)
  opex: number | null; // other operating costs: security, IT and till, cleaning, maintenance, insurance
  staff: number | null; // staff including payroll taxes
  marketing: number | null;
  acquiring: number | null; // card acquiring and till costs, % of revenue
  inventoryDays: number | null; // stock held for the store, days of its cost of goods
  cannibalisation: number | null; // %
  // 03 · the launch (one-off)
  capex: number | null; // fit-out, equipment, signage, opening stock excluded
  depositMonths: number | null; // returnable deposit in months of base rent (Moscova 20: 3)
};

const n = (value: number | null | undefined) => (typeof value === "number" && Number.isFinite(value) ? value : null);
const share = (value: number | null) => (value === null ? null : value / 100);
const all = (...values: (number | null)[]) => values.every((value) => value !== null);

export type ChainResult = {
  /** net revenue: list price less discounts and retro-bonuses, less the fixed payments */
  net: number;
  cogs: number;
  /** gross margin of the chain channel, after every payment to the chain */
  margin: number;
  marginPct: number | null; // of the net revenue
  /** per 100 of list price: what the producer keeps after discounts and bonuses, and after the cost of goods (before fixed payments) */
  per100: { net: number; margin: number };
  /** money waiting for the chain's payment (the invoiced amount, after on-invoice discounts) */
  receivables: number | null;
  /** what the delay costs at the stated price of money, per month — informational, not in the margin */
  delayCost: number | null;
};

export type StoreResult = {
  listEquivalent: number;
  cogs: number;
  gross: number;
  grossPct: number;
  variable: number; // acquiring
  fixed: number; // rent + utilities (with the fee) + other + staff + marketing
  utilitiesTotal: number;
  /** the store's own operating profit (before depreciation, interest and income tax) */
  operating: number;
  /** the chain contribution given up on the cannibalised volume */
  lostChain: number | null;
  /** what the company gains per month: the store's profit less the chain contribution it replaces */
  incremental: number | null;
  /** per 100 of list price sold in the store: retail price, margin after cost and acquiring (before fixed costs) */
  per100: { price: number; margin: number };
};

export type CashResult = {
  inventory: number | null;
  releasedReceivables: number | null;
  /** + money tied up / − money released */
  workingCapital: number | null;
  deposit: number | null;
  capex: number | null;
  /** money needed at the start: CAPEX + deposit + the change in working capital */
  startCash: number | null;
};

export type BreakEvenResult = {
  /** contribution margin of a unit of store revenue: 1 − cost share − acquiring */
  contribution: number;
  /** the store's own break-even revenue per month */
  store: number | null;
  /** the break-even revenue after the cannibalised chain contribution (null: never reached at this cannibalisation) */
  company: number | null;
  /** how far the plan is above (+) or below (−) the company break-even, % of the plan */
  safety: number | null;
};

export type PaybackResult = {
  /** months to earn back the CAPEX from the monthly incremental profit (null: no payback at a non-positive result) */
  capex: number | null;
  /** months to earn back all the money of the start — CAPEX, deposit, working capital (the deposit is returned at the end of the lease) */
  allCash: number | null;
};

export type SensitivityRow = { factor: number; revenue: number; operating: number; incremental: number | null; payback: number | null };

export type ProducerResult = {
  chain: ChainResult | null;
  store: StoreResult | null;
  cash: CashResult;
  breakEven: BreakEvenResult | null;
  payback: PaybackResult | null;
  sensitivity: SensitivityRow[];
  /** missing groups — what the visitor still has to enter for each answer */
  missing: { chain: boolean; store: boolean; cash: boolean; payback: boolean };
};

function chainOf(i: ProducerInputs): ChainResult | null {
  const S = n(i.chainShipments), k = share(n(i.costRatio)), d = share(n(i.chainDiscounts)), b = share(n(i.chainBonuses));
  if (!all(S, k, d, b) || S! <= 0) return null;
  const fees = n(i.chainFees) ?? 0;
  const net = S! * (1 - d! - b!) - fees;
  const cogs = S! * k!;
  const margin = net - cogs;
  const days = n(i.chainDays);
  const receivables = days === null ? null : S! * (1 - d!) * (days / DAYS_PER_MONTH);
  const r = share(n(i.costOfMoney));
  return {
    net,
    cogs,
    margin,
    marginPct: net > 0 ? (margin / net) * 100 : null,
    per100: { net: 100 * (1 - d! - b!), margin: 100 * (1 - d! - b! - k!) },
    receivables,
    delayCost: receivables !== null && r !== null ? (receivables * r) / 12 : null,
  };
}

/** the chain contribution per unit of list price (discounts, bonuses and cost; the fixed payments stay) — null without the chain terms */
function chainUnitContribution(i: ProducerInputs) {
  const k = share(n(i.costRatio)), d = share(n(i.chainDiscounts)), b = share(n(i.chainBonuses));
  return all(k, d, b) ? 1 - d! - b! - k! : null;
}

function fixedOf(i: ProducerInputs) {
  const utilities = n(i.utilities) ?? 0;
  const utilitiesTotal = utilities * (1 + (share(n(i.utilitiesFee)) ?? 0));
  const fixed = (n(i.rent) ?? 0) + utilitiesTotal + (n(i.opex) ?? 0) + (n(i.staff) ?? 0) + (n(i.marketing) ?? 0);
  return { fixed, utilitiesTotal };
}

function storeAt(i: ProducerInputs, revenue: number) {
  const k = share(n(i.costRatio))!, m = share(n(i.retailMarkup))!, acq = share(n(i.acquiring)) ?? 0;
  const listEquivalent = revenue / (1 + m);
  const cogs = listEquivalent * k;
  const gross = revenue - cogs;
  const variable = revenue * acq;
  const { fixed, utilitiesTotal } = fixedOf(i);
  const operating = gross - variable - fixed;
  const unit = chainUnitContribution(i);
  const g = share(n(i.cannibalisation));
  const lostChain = g === null ? null : unit === null ? (g === 0 ? 0 : null) : g * listEquivalent * unit;
  return { listEquivalent, cogs, gross, variable, fixed, utilitiesTotal, operating, lostChain, incremental: lostChain === null ? null : operating - lostChain };
}

function storeOf(i: ProducerInputs): StoreResult | null {
  const R = n(i.storeRevenue), k = share(n(i.costRatio)), m = share(n(i.retailMarkup));
  // the fixed costs must be stated (at least the rent or the staff) — a store without costs is not a store
  if (!all(R, k, m) || R! <= 0 || m! <= -1 || (n(i.rent) === null && n(i.staff) === null)) return null;
  const s = storeAt(i, R!);
  const acq = share(n(i.acquiring)) ?? 0;
  const price = 100 * (1 + m!);
  return { ...s, grossPct: (s.gross / R!) * 100, per100: { price, margin: price - 100 * k! - price * acq } };
}

function cashOf(i: ProducerInputs, store: Pick<StoreResult, "cogs" | "listEquivalent"> | null): CashResult {
  const days = n(i.inventoryDays);
  const inventory = store && days !== null ? (store.cogs / DAYS_PER_MONTH) * days : null;
  const g = share(n(i.cannibalisation)), d = share(n(i.chainDiscounts)), delay = n(i.chainDays);
  const releasedReceivables = store && g !== null && d !== null && delay !== null ? g * store.listEquivalent * (1 - d) * (delay / DAYS_PER_MONTH) : store && g === 0 ? 0 : null;
  const workingCapital = inventory !== null && releasedReceivables !== null ? inventory - releasedReceivables : null;
  const rent = n(i.rent), months = n(i.depositMonths);
  const deposit = rent !== null && months !== null ? rent * months : null;
  const capex = n(i.capex);
  const startCash = capex !== null && workingCapital !== null ? capex + (deposit ?? 0) + workingCapital : null;
  return { inventory, releasedReceivables, workingCapital, deposit, capex, startCash };
}

function breakEvenOf(i: ProducerInputs, store: StoreResult | null): BreakEvenResult | null {
  if (!store) return null;
  const k = share(n(i.costRatio))!, m = share(n(i.retailMarkup))!, acq = share(n(i.acquiring)) ?? 0;
  const contribution = 1 - k / (1 + m) - acq;
  const storeBE = contribution > 0 ? store.fixed / contribution : null;
  const g = share(n(i.cannibalisation)), unit = chainUnitContribution(i);
  const lostPerRevenue = g === null ? null : g === 0 ? 0 : unit === null ? null : (g * unit) / (1 + m);
  const net = lostPerRevenue === null ? null : contribution - lostPerRevenue;
  const company = net !== null && net > 0 ? store.fixed / net : null;
  const R = n(i.storeRevenue)!;
  return { contribution, store: storeBE, company, safety: company !== null ? ((R - company) / R) * 100 : null };
}

const months = (amount: number | null, perMonth: number | null) => (amount !== null && perMonth !== null && perMonth > 0 ? amount / perMonth : null);

export function calcProducer(i: ProducerInputs): ProducerResult {
  const chain = chainOf(i);
  const store = storeOf(i);
  const cash = cashOf(i, store);
  const breakEven = breakEvenOf(i, store);
  const payback = store && store.incremental !== null && cash.capex !== null ? { capex: months(cash.capex, store.incremental), allCash: months(cash.startCash, store.incremental) } : null;
  const R = n(i.storeRevenue);
  const sensitivity: SensitivityRow[] = store && R !== null
    ? [0.7, 0.85, 1, 1.15].map((factor) => {
        const s = storeAt(i, R * factor);
        const c = cashOf(i, s);
        return { factor, revenue: R * factor, operating: s.operating, incremental: s.incremental, payback: n(i.capex) !== null ? months(c.startCash, s.incremental) : null };
      })
    : [];
  return {
    chain, store, cash, breakEven, payback, sensitivity,
    missing: { chain: !chain, store: !store, cash: cash.workingCapital === null, payback: !payback },
  };
}

/** the illustrative producer of the methodology (conditional figures, never market data); the rent is the Moscova 20 preliminary calculation, inserted by name */
export const producerExample: ProducerInputs = {
  chainShipments: 60000, costRatio: 55, chainDiscounts: 8, chainBonuses: 6, chainFees: 2000, chainDays: 60, costOfMoney: 12,
  storeRevenue: 60000, retailMarkup: 35, rent: 10429.5, utilities: 1200, utilitiesFee: 15, opex: 1500, staff: 9000, marketing: 2000, acquiring: 1.5,
  inventoryDays: 30, cannibalisation: 30, capex: 120000, depositMonths: 3,
};
