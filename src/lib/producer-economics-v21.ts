/**
 * PRODUCER CFO MODEL v2.2 — «Торговые сети, собственный магазин или оба канала». v2.1 (OWNER «FINAL 2-DAY DELIVERY MANDATE» §06,
 * 2026-11-14) corrected after the independent Codex NO-GO (OWNER «CALCULATOR V2.1 · FINANCIAL NO-GO» + «FINANCIAL REMEDIATION»,
 * 2026-11-15). Specification: docs/finance/PRODUCER_RETAIL_CFO_MODEL_V2_2_SPEC.md. Verified against the independent day-by-day
 * ledger scripts/finance/producer-v22-reference.mjs (no shared code) and the Codex control figures by scripts/qa-producer-v22.mjs.
 *
 * A steady month, euros. Shelf price and average check are entered as the buyer sees them (with VAT by default) and converted net;
 * every other amount is net of VAT (B2B). The result of a channel is its OPERATING CONTRIBUTION — before the company's overheads,
 * depreciation, financing, interest and tax (never called EBITDA). Profit and money are kept apart:
 *   · MONEY AT OPENING = CAPEX + preparation + deposit + initial stock — never reduced by money that arrives later;
 *   · the chain receivable is released only as the chain actually pays: deliveries of a month are paid D days later, so the cash of
 *     every month after opening is modelled (120 months) and the release falls into the months it is collected;
 *   · PEAK FUNDING = the deepest point of the cumulative cash (the external financing the plan needs);
 *   · PAYBACK of all start money = the month the cumulative cash returns to zero;
 *   · the COST OF MONEY is the company's annual cost of capital (a loan rate or the return it requires — one rate; no loan is modelled).
 *     It never touches the operating contribution. As ONE effective monthly rate, (1 + r)^(1/12) − 1, it prices the money tied in
 *     receivables, stock and deposit (a monthly figure for information, never subtracted from anything) and discounts the monthly cash
 *     for the payback «with the cost of money». The two are never added together.
 *   · the release of the receivable is read from the monthly schedule: it is complete at the end of the month in which the running
 *     sum of its monthly part reaches the full amount (the store's ramp-up delays it as much as the payment term does);
 *   · a steady month of exactly zero keeps a finite funding need and has no payback; only a negative steady month makes the need grow.
 * The combined channel (chains + store) nets the chain volume the store takes away out of the chain's revenue and contribution; a store
 * that would take more units than the chains sell is an IMPOSSIBLE scenario — no result, no payback.
 * An empty field is «not stated»: an answer exists only with its own data.
 */

export const MONTH_DAYS = 365 / 12;
export const HORIZON_MONTHS = 120;

export type VatMode = "gross" | "net";

export type ProducerInputsV21 = {
  // the product and the chains (per month)
  chainUnits: number | null; // Qa
  listPrice: number | null; // pa, net
  unitCost: number | null; // c, net
  discounts: number | null; // d, %
  bonuses: number | null; // b, %
  chainFees: number | null; // Fa, € / month
  chainLogistics: number | null; // la, % of list shipments
  paymentDays: number | null; // D
  costOfMoney: number | null; // r, % a year
  // the own store (per month)
  vatMode: VatMode;
  vatRate: number | null; // v, %
  shelfPrice: number | null; // pb, as entered (gross or net by vatMode)
  buyersPerDay: number | null; // N
  averageCheck: number | null; // T, as entered
  openDays: number | null; // W
  rent: number | null; // A, net
  utilities: number | null; // U, net
  utilitiesFee: number | null; // f, %
  staff: number | null; // P
  marketing: number | null; // Mk
  otherCosts: number | null; // O
  storeDelivery: number | null; // Lb, € / month
  acquiring: number | null; // a, % of the card turnover WITH VAT
  losses: number | null; // w, % of the cost of goods sold
  stockDays: number | null; // I
  cannibalisation: number | null; // γ, %
  // the start
  capex: number | null;
  depositMonths: number | null; // n
  preparationMonths: number | null; // Mp
  rampMonths: number | null; // Mr
};

const isSet = (x: number | null | undefined): x is number => typeof x === "number" && Number.isFinite(x);
/** the annual cost of money as its effective monthly rate — the one rate of the model: it discounts the cash and prices the tied money */
export const monthlyRate = (annualPct: number) => (1 + annualPct / 100) ** (1 / 12) - 1;
/** a steady month within half a cent of zero is zero (the cash then neither returns nor grows the need) */
const CENT = 0.005;
const trendOf = (steady: number): "positive" | "zero" | "negative" => (steady > CENT ? "positive" : steady < -CENT ? "negative" : "zero");
const orZero = (x: number | null | undefined) => (isSet(x) ? x : 0);
const pct = (x: number) => x / 100;

export type ChainChannel = {
  revenue: number; gross: number; contribution: number; unitContribution: number;
  breakEvenUnits: number | null; receivables: number | null; marginPct: number | null;
  /** the monthly cost of the money tied in the receivable at the cost of money — information, never subtracted */
  tiedCost: number | null;
};
export type StoreChannel = {
  priceNet: number; checkNet: number; revenue: number; units: number; gross: number; fixed: number; acquiringCost: number;
  contribution: number; perEuro: number; unitContribution: number; marginPct: number | null;
  breakEvenBuyers: number | null; stock: number | null; deposit: number | null; preparation: number;
};
/** the money of a scenario that opens the store: what it needs at opening, how deep the cash goes, when it comes back */
export type CashPlan = {
  /** CAPEX + preparation + deposit + initial stock — the money needed on the opening day */
  startCash: number;
  /** the steady month of the scenario: «positive» returns the money, «zero» holds it (finite need, no payback), «negative» keeps
   *  taking money for as long as the plan runs */
  trend: "positive" | "zero" | "negative";
  /** the deepest point of the cumulative cash, start included — the financing the plan needs (≥ startCash); null only when the steady
   *  month is negative: the need then keeps growing over the horizon and no single figure describes it */
  peakFunding: number | null;
  /** the month of the deepest point (0 = the opening day); null with peakFunding */
  peakMonth: number | null;
  /** the receivable the chains still pay after opening for deliveries before the change, over the first D days */
  released: number;
  /** the month by whose end the cash flow has brought the whole released receivable — read from the monthly schedule itself (the
   *  store's ramp-up and the payment delay both shape it); null when there is nothing to release or it is not complete within 120 months */
  releaseFullMonth: number | null;
  /** payback of CAPEX + preparation from the operating increment; null = not within 10 years */
  paybackInvestment: number | null;
  /** payback of all start money from the cumulative cash; null = not within 10 years */
  paybackAll: number | null;
  /** the same with the monthly cash discounted at the cost of money; null = not within 10 years or no rate stated */
  paybackDiscounted: number | null;
  /** the monthly cost of the money tied in receivables, stock and deposit in the steady month, at the same effective monthly rate the
   *  discounting uses — information, never subtracted */
  tiedCost: number | null;
  /** the incremental cash of months 1 … 120 after opening (the start is month 0) */
  monthly: number[];
};
export type Combined = {
  lostUnits: number; lostRevenue: number; lostChain: number; increment: number;
  /** revenue of the company with both channels: the chains' revenue less the volume the store takes away, plus the store's */
  revenue: number | null;
  company: number | null; marginPct: number | null; breakEvenBuyers: number | null; workingCapital: number | null;
  cash: CashPlan | null;
};
export type StoreOnly = { change: number; cash: CashPlan | null };
export type ResultV21 = {
  chain: ChainChannel | null; store: StoreChannel | null; combined: Combined | null; storeOnly: StoreOnly | null;
  /** the store would take more units from the chains than they sell: no combined result, no payback, nothing to copy or send */
  impossible: boolean;
};

function chainOf(i: ProducerInputsV21): ChainChannel | null {
  const { chainUnits: Qa, listPrice: pa, unitCost: c, discounts, bonuses } = i;
  if (!isSet(Qa) || !isSet(pa) || !isSet(c) || !isSet(discounts) || !isSet(bonuses) || Qa <= 0 || pa <= 0) return null;
  const d = pct(discounts), b = pct(bonuses), la = pct(orZero(i.chainLogistics)), fees = orZero(i.chainFees);
  const atList = Qa * pa;
  const revenue = atList * (1 - d - b);
  const gross = revenue - Qa * c;
  const contribution = gross - fees - atList * la;
  const unitContribution = pa * (1 - d - b - la) - c;
  const receivables = isSet(i.paymentDays) ? (atList * (1 - d) * i.paymentDays) / MONTH_DAYS : null;
  return {
    revenue, gross, contribution, unitContribution,
    breakEvenUnits: unitContribution > 0 ? fees / unitContribution : null,
    receivables,
    marginPct: revenue > 0 ? (contribution / revenue) * 100 : null,
    tiedCost: receivables !== null && isSet(i.costOfMoney) ? receivables * monthlyRate(i.costOfMoney) : null,
  };
}

/** the chain contribution of one unit — the chain terms only, the volume is not needed (for cannibalisation) */
export function chainUnitContribution(i: ProducerInputsV21): number | null {
  if (!isSet(i.listPrice) || !isSet(i.unitCost) || !isSet(i.discounts) || !isSet(i.bonuses)) return null;
  return i.listPrice * (1 - pct(i.discounts) - pct(i.bonuses) - pct(orZero(i.chainLogistics))) - i.unitCost;
}

function storeOf(i: ProducerInputsV21): StoreChannel | null {
  const { shelfPrice, buyersPerDay: N, averageCheck, openDays: W, unitCost: c, vatRate } = i;
  if (!isSet(vatRate) || !isSet(shelfPrice) || !isSet(N) || !isSet(averageCheck) || !isSet(W) || !isSet(c)) return null;
  if (shelfPrice <= 0 || averageCheck <= 0 || W <= 0 || N < 0) return null;
  if (!isSet(i.rent) && !isSet(i.staff)) return null; // a store without rent and staff is not a store
  const vat = pct(vatRate);
  const toNet = i.vatMode === "gross" ? 1 / (1 + vat) : 1;
  const priceNet = shelfPrice * toNet;
  const checkNet = averageCheck * toNet;
  const w = pct(orZero(i.losses)), a = pct(orZero(i.acquiring));
  const revenue = N * checkNet * W;
  const units = revenue / priceNet;
  const gross = revenue - units * c * (1 + w);
  const fixed = orZero(i.rent) + orZero(i.utilities) * (1 + pct(orZero(i.utilitiesFee))) + orZero(i.staff) + orZero(i.marketing) + orZero(i.otherCosts) + orZero(i.storeDelivery);
  const acquiringCost = a * revenue * (1 + vat);
  const contribution = gross - acquiringCost - fixed;
  const perEuro = 1 - (c / priceNet) * (1 + w) - a * (1 + vat);
  const preparation = orZero(i.preparationMonths) * (orZero(i.rent) + orZero(i.utilities) * (1 + pct(orZero(i.utilitiesFee))) + orZero(i.staff));
  return {
    priceNet, checkNet, revenue, units, gross, fixed, acquiringCost, contribution, perEuro,
    unitContribution: priceNet * (1 - a * (1 + vat)) - c * (1 + w),
    marginPct: revenue > 0 ? (contribution / revenue) * 100 : null,
    breakEvenBuyers: perEuro > 0 ? fixed / (perEuro * checkNet * W) : null,
    stock: isSet(i.stockDays) ? ((units * c) / MONTH_DAYS) * i.stockDays : null,
    deposit: isSet(i.depositMonths) && isSet(i.rent) ? i.depositMonths * i.rent : null,
    preparation,
  };
}

/** the share of month `j`'s deliveries (spread evenly over the month) that the chain pays within month `k`, with a lag of `lag` months */
function paidShare(j: number, k: number, lag: number): number {
  const from = Math.max(j - 1 + lag, k - 1), to = Math.min(j + lag, k);
  return to > from ? to - from : 0;
}

/**
 * the receipts the chain no longer pays in months 1 … H, when the units delivered to it in month j fall by lost(j) (j ≥ 1): each month's
 * deliveries are paid `lag` months later, so the loss of cash starts only after the lag — the money for the deliveries made before the
 * opening still arrives (that is the «released receivable»)
 */
function lostReceipts(lost: (j: number) => number, invoice: number, lag: number): number[] {
  const out: number[] = [];
  for (let k = 1; k <= HORIZON_MONTHS; k++) {
    let sum = 0;
    for (let j = Math.max(1, Math.floor(k - lag)); j <= k; j++) sum += lost(j) * paidShare(j, k, lag);
    out.push(sum * invoice);
  }
  return out;
}

/** the fractional month at which a running sum, starting at −start, first reaches zero; 0 if nothing to return; null if not within H */
function paybackOf(start: number, monthly: number[], discount = 0): number | null {
  if (!(start > 0)) return 0;
  const q = 1 + discount;
  let balance = -start;
  for (let k = 1; k <= monthly.length; k++) {
    const flow = monthly[k - 1] / q ** k;
    if (flow > 0 && balance + flow >= 0) return k - 1 + -balance / flow;
    balance += flow;
  }
  return null;
}

/** the deepest point of the cumulative cash (start included) and its month */
function peakOf(start: number, monthly: number[]): { peak: number; month: number } {
  let balance = -start, peak = start, month = 0;
  monthly.forEach((flow, idx) => {
    balance += flow;
    if (-balance > peak) { peak = -balance; month = idx + 1; }
  });
  return { peak, month };
}



/** kept for the callers of v2.1: the fractional month in which a cumulative monthly stream covers `amount`; null if not within ten years */
export function paybackMonths(amount: number, monthly: (month: number) => number): number | null {
  return paybackOf(amount, Array.from({ length: HORIZON_MONTHS }, (_, k) => monthly(k + 1)));
}

export function calcV21(i: ProducerInputsV21): ResultV21 {
  const chain = chainOf(i);
  const store = storeOf(i);
  if (!store) return { chain, store, combined: null, storeOnly: null, impossible: false };
  const ramp = (month: number) => (orZero(i.rampMonths) > 0 ? Math.min(1, month / (i.rampMonths as number)) : 1);
  const months = Array.from({ length: HORIZON_MONTHS }, (_, k) => k + 1);
  const investment = isSet(i.capex) ? i.capex + store.preparation : null;
  const deposit = store.deposit ?? 0;
  // the money of the opening day — never reduced by money that arrives later
  const startCash = investment !== null && store.stock !== null ? investment + deposit + store.stock : null;
  const storeCash = (k: number) => store.perEuro * store.revenue * ramp(k) - store.fixed;
  const lag = isSet(i.paymentDays) ? i.paymentDays / MONTH_DAYS : null;
  const r = isSet(i.costOfMoney) ? i.costOfMoney : null;
  // chain cash per unit: the invoice (list less on-invoice discounts) is paid after D days; the unit's cost, logistics and retro-bonus
  // are money of the delivery month
  const invoice = isSet(i.listPrice) && isSet(i.discounts) ? i.listPrice * (1 - pct(i.discounts)) : null;
  const unitCash = isSet(i.listPrice) && isSet(i.unitCost) && isSet(i.bonuses) ? i.unitCost + i.listPrice * (pct(orZero(i.chainLogistics)) + pct(i.bonuses)) : null;

  // releaseFlow: the receivable part of each month's cash (the invoice value of the units no longer delivered less the chain payments that
  // no longer arrive); its running sum is the receivable released so far
  const plan = (monthly: number[], operating: number[], released: number, releaseFlow: number[], tied: number | null, steady: number): CashPlan | null => {
    if (startCash === null || investment === null) return null;
    const { peak, month } = peakOf(startCash, monthly);
    const trend = trendOf(steady);
    let releaseFullMonth: number | null = null;
    if (released > CENT) {
      let sum = 0;
      for (let k = 1; k <= releaseFlow.length && releaseFullMonth === null; k++) {
        sum += releaseFlow[k - 1];
        if (sum >= released - Math.max(CENT, released * 1e-9)) releaseFullMonth = k;
      }
    }
    return {
      startCash, trend, peakFunding: trend === "negative" ? null : peak, peakMonth: trend === "negative" ? null : month, released, releaseFullMonth,
      // no payback when the steady month adds nothing: cash that comes back only from receivables the chains still pay is the release
      // of working capital, not a return on the start money
      paybackInvestment: trend === "positive" ? paybackOf(investment, operating) : null,
      paybackAll: trend === "positive" ? paybackOf(startCash, monthly) : null,
      paybackDiscounted: trend === "positive" && r !== null ? paybackOf(startCash, monthly, monthlyRate(r)) : null,
      tiedCost: tied,
      monthly,
    };
  };

  let combined: Combined | null = null;
  let impossible = false;
  const g = isSet(i.cannibalisation) ? pct(i.cannibalisation) : null;
  const unit = chainUnitContribution(i);
  if (g !== null && (g === 0 || (unit !== null && chain !== null))) {
    const lostUnits = g * store.units;
    if (chain && lostUnits > (i.chainUnits as number) + 1e-9) impossible = true;
    else {
      const lostChain = g === 0 ? 0 : lostUnits * (unit as number);
      const lostRevenue = g === 0 ? 0 : lostUnits * (i.listPrice as number) * (1 - pct(i.discounts as number) - pct(i.bonuses as number));
      const increment = store.contribution - lostChain;
      const perEuro = store.perEuro - (g === 0 ? 0 : (g * (unit as number)) / store.priceNet);
      const operating = months.map((k) => perEuro * store.revenue * ramp(k) - store.fixed);
      // cash: the store's month, the chain costs no longer spent (at once), the chain receipts no longer received (after D days)
      let monthly: number[] | null = null, released = 0, releaseFlow: number[] = months.map(() => 0);
      if (g === 0) monthly = months.map(storeCash);
      else if (lag !== null && invoice !== null && unitCash !== null) {
        const lost = (j: number) => lostUnits * ramp(j);
        const missing = lostReceipts(lost, invoice, lag);
        monthly = months.map((k) => storeCash(k) + lost(k) * unitCash - missing[k - 1]);
        releaseFlow = months.map((k) => lost(k) * invoice - missing[k - 1]);
        released = lostUnits * invoice * lag;
      }
      const company = chain ? chain.contribution + increment : null;
      const revenue = chain ? chain.revenue - lostRevenue + store.revenue : null;
      const workingCapital = chain && chain.receivables !== null && store.stock !== null ? chain.receivables - released + store.stock : null;
      combined = {
        lostUnits, lostRevenue, lostChain, increment, revenue, company,
        marginPct: company !== null && revenue !== null && revenue > 0 ? (company / revenue) * 100 : null,
        breakEvenBuyers: perEuro > 0 ? store.fixed / (perEuro * store.checkNet * (i.openDays as number)) : null,
        workingCapital,
        cash: monthly ? plan(monthly, operating, released, releaseFlow, workingCapital !== null && r !== null ? (workingCapital + deposit) * monthlyRate(r) : null, increment) : null,
      };
    }
  }

  let storeOnly: StoreOnly | null = null;
  if (chain) {
    const change = store.contribution - chain.contribution;
    const operating = months.map((k) => storeCash(k) - chain.contribution);
    let cash: CashPlan | null = null;
    if (lag !== null && invoice !== null && unitCash !== null) {
      // the chains are no longer supplied from the opening: their costs and fees stop at once, their payments stop D days later
      const Qa = i.chainUnits as number;
      const missing = lostReceipts(() => Qa, invoice, lag);
      const monthly = months.map((k) => storeCash(k) + Qa * unitCash + orZero(i.chainFees) - missing[k - 1]);
      cash = plan(monthly, operating, Qa * invoice * lag, months.map((k) => Qa * invoice - missing[k - 1]), store.stock !== null && r !== null ? (store.stock + deposit) * monthlyRate(r) : null, change);
    }
    storeOnly = { change, cash };
  }
  return { chain, store, combined, storeOnly, impossible };
}

/** the three scenarios of the spec §3: buyers per day × 0,75 / 1 / 1,2 and cannibalisation +10 / 0 / −10 p. p., kept within 0–100 % */
export const SCENARIOS_V21 = [
  { key: "pessimistic", factor: 0.75, shift: 10 },
  { key: "realistic", factor: 1, shift: 0 },
  { key: "optimistic", factor: 1.2, shift: -10 },
] as const;
export function scenarioOf(i: ProducerInputsV21, s: (typeof SCENARIOS_V21)[number]): ProducerInputsV21 {
  return {
    ...i,
    buyersPerDay: isSet(i.buyersPerDay) ? i.buyersPerDay * s.factor : i.buyersPerDay,
    cannibalisation: isSet(i.cannibalisation) ? Math.min(100, Math.max(0, i.cannibalisation + s.shift)) : i.cannibalisation,
  };
}

/** the empty form: VAT shown as the standard rate (editable), prices entered as the buyer sees them; nothing else pre-filled */
export const EMPTY_V21: ProducerInputsV21 = {
  chainUnits: null, listPrice: null, unitCost: null, discounts: null, bonuses: null, chainFees: null, chainLogistics: null, paymentDays: null, costOfMoney: null,
  vatMode: "gross", vatRate: 20, shelfPrice: null, buyersPerDay: null, averageCheck: null, openDays: null, rent: null, utilities: null, utilitiesFee: null,
  staff: null, marketing: null, otherCosts: null, storeDelivery: null, acquiring: null, losses: null, stockDays: null, cannibalisation: null,
  capex: null, depositMonths: null, preparationMonths: null, rampMonths: null,
};

/** the illustrative producer (conditional figures, never market data) — the v1 example with the shelf price and check as the buyer sees them */
export const EXAMPLE_V21: ProducerInputsV21 = {
  chainUnits: 6000, listPrice: 10, unitCost: 5.5, discounts: 8, bonuses: 6, chainFees: 2000, chainLogistics: 0, paymentDays: 60, costOfMoney: 12,
  vatMode: "gross", vatRate: 20, shelfPrice: 16.2, buyersPerDay: 100, averageCheck: 24, openDays: 30, rent: null, utilities: 1200, utilitiesFee: null,
  staff: 9000, marketing: 2000, otherCosts: 1500, storeDelivery: 300, acquiring: 1.5, losses: 1, stockDays: 30, cannibalisation: 30,
  capex: 120000, depositMonths: null, preparationMonths: 2, rampMonths: 4,
};
