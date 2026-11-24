"use client";

import { useDeferredValue, useEffect, useId, useMemo, useRef, useState } from "react";
import { CurrencyBar, currencyReportLines, useFx } from "@/components/currency-bar";
import { mc as t } from "@/components/land-experience/model-copy";
import { NumberInput, type NumberFormat } from "@/components/number-input";
import { nbmSnapshot } from "@/data/nbm-rate";
import type { ModelPreset } from "@/data/land/model";
import { amountIn, convert, shown, type Currency } from "@/lib/currency";
import {
  breakEven, emptyInputs, ENGINE_VERSION, matrix, MODEL_NAME, purchaseMax, quarterly, run, sensitivity, variantOf,
  type AdvanceMethod, type Amort, type DrawOrder, type Inputs, type IrrResult, type IssueKey, type Ledger, type LossMode, type ModelKey, type NoteKey, type NumKey, type Result, type Summary, type VariantKey, type VatFunding,
} from "@/lib/land-finance-v3";
import { numberLocale, type Localized, type SiteLocale } from "@/lib/site-data";
import "@/app/land-model-v3.css";

/**
 * DEVELOPMENT CALCULATOR 3.0 — the interface of src/lib/land-finance-v3.ts (OWNER «FINANCIAL CORRECTION MANDATE · LAND DEVELOPMENT
 * CALCULATOR 3.0», 2026-11-24). Two levels on the one verified engine:
 *   · BASIC — the minimum fields of a commercial screening; VAT, the loan, the real-estate tax and the professional tax parameters are not
 *     applied (the statutory defaults are used) and the limits are stated next to the results;
 *   · PROFESSIONAL — the land's tax basis and book value, the profit tax with depreciation, losses, the interest limit and the payment
 *     calendar, VAT with the refund, the real-estate tax, the loan (fee, draws, grace, amortisation, refinancing), the debt metrics,
 *     scenarios, the sensitivity and the two-factor NPV matrix.
 * Pre-filled values: the published site area; the statutory defaults (tagged «по закону», each with its article); the start date
 * (tagged «допущение»). A demonstration example loads only on request; every field still holding a demonstration value keeps its «демо»
 * tag across the model switches until the visitor changes it or accepts the values (Codex P1). The report carries everything needed to
 * reproduce the calculation (Codex P1). Nothing is stored or sent by the site.
 */

type Mode = "basic" | "pro";
type State = Record<NumKey, string>;
type Flags = { includeLand: boolean; capitalizeInterest: boolean; vatOn: boolean; vatOnRent: boolean; vatOnSale: boolean; vatRefund: boolean; refi: boolean };
type Enums = { lossMode: LossMode; advanceMethod: AdvanceMethod; drawOrder: DrawOrder; amort: Amort; vatFunding: VatFunding };
type UnitKey = "m2" | "pct" | "x" | "eurm2" | "eur" | "mo" | "yr" | "eurm2m" | "eurYr" | "pctYr" | "year" | "month";
type Field = { key: NumKey; unit: UnitKey; fmt: NumberFormat; hint?: string };

const money: NumberFormat = { group: true, decimals: 0, maxInt: 12 };
const rate: NumberFormat = { group: false, decimals: 2, maxInt: 3 };
const areaF: NumberFormat = { group: true, decimals: 0, maxInt: 9 };
const whole: NumberFormat = { group: false, decimals: 0, maxInt: 4 };
const priceF: NumberFormat = { group: true, decimals: 2, maxInt: 7 };

const NUM_KEYS: NumKey[] = [
  "startYear", "startMonth", "preMonths", "buildMonths", "siteArea", "coverage", "floors", "gbaManual", "efficiency", "hard", "design", "networks", "landscaping", "permits", "contingency",
  "landMarket", "landCost", "landBook", "landTaxBasis", "landShare", "price", "salesMonths", "commission", "rent", "occupancy", "leaseUp", "opex", "indexation", "holdYears", "exitYield", "exitCosts",
  "leaseYears", "target", "breakYear", "voidMonths", "reletPct", "breakFee", "discount", "taxRate", "depYears", "bookDepYears", "lossYears", "capGainInclusion", "interestRateCap",
  "vatRate", "vatRecoverable", "vatRefundLag", "landTaxAnnual", "buildingTaxRate", "ltc", "interest", "fee", "graceMonths", "amortYears", "refiMonth", "refiLtv", "refiRate", "refiCap", "refiAmortYears",
];
/** the money inputs: kept as typed with their currency (src/lib/currency.ts); the engine reads them in EUR */
const MONEY = new Set<NumKey>(["hard", "networks", "landscaping", "permits", "landMarket", "landCost", "landBook", "landTaxBasis", "price", "rent", "landTaxAnnual"]);
/** the statutory defaults (docs/finance/LAND_TAX_METHODOLOGY_MD.md) — pre-filled and tagged until changed */
const LEGAL: Partial<Record<NumKey, number>> = { taxRate: 12, lossYears: 5, depYears: 40, capGainInclusion: 100, vatRate: 20, vatRefundLag: 2, buildingTaxRate: 0.3 };
const LEGAL_PT_MONTHS = "9";
/** the default start: the January after the build's NBM record (deterministic for the server and the browser) */
const START_YEAR = Number(String(nbmSnapshot.date).slice(0, 4)) + 1;

const parse = (s: string) => (s === "" || s === "." ? null : Number.isFinite(Number(s)) ? Number(s) : null);
const toCanon = (x: number | undefined) => (x === undefined ? "" : String(x));
const BASIC_SET = new Set<NumKey>(["startYear", "startMonth", "preMonths", "buildMonths", "siteArea", "coverage", "floors", "gbaManual", "efficiency", "hard", "design", "networks", "landscaping", "permits", "contingency", "landMarket", "price", "salesMonths", "commission", "rent", "occupancy", "leaseUp", "opex", "indexation", "holdYears", "exitYield", "exitCosts", "leaseYears", "target", "discount", "taxRate"]);

export function DevelopmentModel({ locale, siteArea, presets, mailto, place }: { locale: SiteLocale; siteArea: number; presets: ModelPreset[]; /** the OWNER-confirmed address, passed by the server page */ mailto: string; place: string }) {
  const uid = useId();
  const root = useRef<HTMLDivElement>(null);
  const blank = (): State => {
    const s = Object.fromEntries(NUM_KEYS.map((k) => [k, ""])) as State;
    s.siteArea = String(siteArea); s.startYear = String(START_YEAR); s.startMonth = "1";
    for (const [k, x] of Object.entries(LEGAL)) s[k as NumKey] = String(x);
    return s;
  };
  const freshTags = () => new Set<NumKey>(Object.keys(LEGAL) as NumKey[]);
  const [mode, setMode] = useState<Mode>("basic");
  const [model, setModel] = useState<ModelKey>("sale");
  const [v, setV] = useState<State>(blank);
  const [flags, setFlags] = useState<Flags>({ includeLand: true, capitalizeInterest: true, vatOn: false, vatOnRent: true, vatOnSale: true, vatRefund: true, refi: false });
  const [enums, setEnums] = useState<Enums>({ lossMode: "free", advanceMethod: "prior", drawOrder: "prorata", amort: "bullet", vatFunding: "equity" });
  const [ptMonths, setPtMonths] = useState(LEGAL_PT_MONTHS);
  const [cur, setCur] = useState<Partial<Record<NumKey, Currency>>>({});
  const [display, setDisplay] = useState<Currency>("EUR");
  const [demo, setDemo] = useState<string | null>(null);
  /** fields still holding a demonstration value — kept across model switches until changed or accepted (Codex P1) */
  const [demoKeys, setDemoKeys] = useState<Set<NumKey>>(new Set());
  /** fields still holding a statutory default */
  const [lawKeys, setLawKeys] = useState<Set<NumKey>>(freshTags);
  /** fields still holding the default start date */
  const [assumed, setAssumed] = useState<Set<NumKey>>(new Set<NumKey>(["startYear", "startMonth"]));
  const [more, setMore] = useState(() => typeof window === "undefined" || !window.matchMedia("(max-width: 719.98px)").matches);
  const started = demoKeys.size > 0 || NUM_KEYS.some((k) => !["siteArea", "startYear", "startMonth"].includes(k) && !(k in LEGAL) && v[k] !== "");
  const fx = useFx(started);
  const R = fx.rate;
  const nf = useMemo(() => new Intl.NumberFormat(numberLocale(locale), { maximumFractionDigits: 0 }), [locale]);
  const pf = useMemo(() => new Intl.NumberFormat(numberLocale(locale), { minimumFractionDigits: 1, maximumFractionDigits: 1 }), [locale]);
  const rf = useMemo(() => new Intl.NumberFormat(numberLocale(locale), { minimumFractionDigits: 2, maximumFractionDigits: 2 }), [locale]);
  const sym = display === "EUR" ? "€" : "MDL";
  const m2 = locale === "ru" ? "м²" : "m²";
  const toDisplay = (x: number) => convert(x, "EUR", display, R);
  const cash = (x: number) => `${x < 0 ? "−" : ""}${nf.format(Math.abs(Math.round(toDisplay(x))))} ${sym}`;
  const pct = (x: number | null) => (x === null ? t.out.notDefined[locale] : `${x < 0 ? "−" : ""}${pf.format(Math.abs(x * 100))} %`);
  const unitRent = display === "EUR" ? (locale === "ru" ? "€/м²·мес." : locale === "ro" ? "€/m²·lună" : "€/m²·month") : (locale === "ru" ? "MDL/м²·мес." : locale === "ro" ? "MDL/m²·lună" : "MDL/m²·month");
  const unitPrice = `${sym}/${m2}`;
  const perM2 = (x: number) => rf.format(toDisplay(x));
  const unitText = (u: UnitKey) => (u === "eurm2" ? unitPrice : u === "eur" ? sym : u === "eurm2m" ? unitRent : u === "eurYr" ? `${sym}/${t.u.year[locale]}` : t.u[u as "m2" | "pct" | "x" | "mo" | "yr" | "pctYr" | "year" | "month"][locale]);

  const load = (preset: ModelPreset) => {
    setModel(preset.model);
    setV({ ...blank(), ...Object.fromEntries(Object.entries(preset.values).map(([k, x]) => [k, toCanon(x)])) } as State);
    setCur(Object.fromEntries(Object.keys(preset.values).filter((k) => MONEY.has(k as NumKey)).map((k) => [k, "EUR"])) as Partial<Record<NumKey, Currency>>);
    setFlags((f) => ({ ...f, includeLand: true }));
    setDemo(preset.key);
    const keys = new Set(Object.keys(preset.values) as NumKey[]);
    setDemoKeys(keys);
    setLawKeys(new Set([...freshTags()].filter((k) => !keys.has(k))));
    setAssumed(new Set<NumKey>(["startYear", "startMonth"]));
  };
  useEffect(() => {
    const on = (event: Event) => {
      const detail = (event as CustomEvent<{ preset: string }>).detail;
      const preset = presets.find((p) => p.key === detail?.preset);
      if (preset) { load(preset); root.current?.scrollIntoView({ behavior: "smooth", block: "start" }); }
    };
    window.addEventListener("lx:scenario", on);
    return () => window.removeEventListener("lx:scenario", on);
  });

  const months = useMemo(() => ptMonths.split(/[,;\s]+/).map((x) => Math.round(Number(x))).filter((x) => x >= 1 && x <= 12), [ptMonths]);
  const inputs: Inputs = useMemo(() => {
    const i = emptyInputs(model, null);
    for (const k of NUM_KEYS) (i as Record<NumKey, number | null>)[k] = MONEY.has(k) ? amountIn({ v: v[k], c: cur[k] ?? display }, "EUR", R) : parse(v[k]);
    Object.assign(i, flags, enums, { propertyTaxMonths: months });
    if (model === "sale") i.vatRefund = false; // a building that is sold is never «in use» by the owner (art. 101^1)
    if (mode === "basic") {
      // the basic level: the professional parameters are not applied — the statutory tax defaults, no VAT, no loan, no real-estate tax
      for (const k of NUM_KEYS) if (!BASIC_SET.has(k)) (i as Record<NumKey, number | null>)[k] = null;
      Object.assign(i, { vatOn: false, refi: false, propertyTaxMonths: [], lossYears: LEGAL.lossYears, lossMode: "free", advanceMethod: "prior", depYears: LEGAL.depYears, capGainInclusion: LEGAL.capGainInclusion, capitalizeInterest: true, includeLand: flags.includeLand });
    }
    return i;
  }, [v, cur, display, R, model, flags, enums, months, mode]);
  const result: Result = useMemo(() => run(inputs), [inputs]);
  const early = useMemo(() => (model === "bts" && result.ok && (inputs.breakYear ?? 0) > 0 ? run(inputs, { earlyBreak: true, rentOverride: result.ledger.rent }) : null), [inputs, model, result]);
  const deferred = useDeferredValue(inputs);
  const heavy = mode === "pro" && more && result.ok;
  const extras = useMemo(() => {
    if (!heavy) return null;
    const r0 = run(deferred);
    if (!r0.ok) return null;
    return {
      variants: (["realistic", "optimistic", "pessimistic"] as VariantKey[]).map((k) => ({ k, r: run(variantOf(deferred, k)) })),
      sens: sensitivity(deferred),
      mx: matrix(deferred),
      be: breakEven(deferred),
      purchase: purchaseMax(deferred),
    };
  }, [deferred, heavy]);
  const isDemo = demoKeys.size > 0;
  const landApplied = result.ok ? result.ledger.LANDAPP : 0;

  const untag = (key: NumKey) => {
    const drop = (old: Set<NumKey>) => { if (!old.has(key)) return old; const next = new Set(old); next.delete(key); return next; };
    setDemoKeys(drop); setLawKeys(drop); setAssumed(drop);
  };
  const set = (key: NumKey) => (canonical: string) => {
    setV((old) => ({ ...old, [key]: canonical }));
    if (MONEY.has(key)) setCur((old) => ({ ...old, [key]: display }));
    untag(key);
  };
  const label = (key: NumKey) => {
    const l = t.f[key === "rent" && model === "bts" ? "rentBts" : key];
    return (("ro" in (l as object)) ? (l as Localized) : (l as Record<ModelKey, Localized>)[model])[locale];
  };
  const tagOf = (key: NumKey) => (demoKeys.has(key) ? t.tags.demo : lawKeys.has(key) ? t.tags.law : assumed.has(key) ? t.tags.assumption : null);
  const fieldValue = (key: NumKey) => (MONEY.has(key) ? shown({ v: v[key], c: cur[key] ?? display }, display, R) : v[key]);
  const issues = result.ok ? [] : result.issues;
  const bad = (key: NumKey) => issues.some((x) => x.key === key && x.kind === "range");
  const field = ({ key, unit, fmt, hint }: Field) => {
    const tag = tagOf(key);
    return (
      <div className={`lx-field${demoKeys.has(key) ? " is-demo" : ""}${lawKeys.has(key) ? " is-law" : ""}`} key={key}>
        <label htmlFor={`${uid}-${key}`}>{label(key)}{tag ? <em className={`lx-field__demo${demoKeys.has(key) ? "" : " lx3-tag"}`}>{tag[locale]}</em> : null}</label>
        <span className={`lx-field__box${bad(key) ? " is-bad" : ""}`}>
          <NumberInput id={`${uid}-${key}`} className="lx-field__input" value={fieldValue(key)} onValueChange={set(key)} locale={locale} format={fmt} describedBy={hint ? `${uid}-${key}-h` : undefined} />
          <span aria-hidden="true">{unitText(unit)}</span>
        </span>
        {hint ? <span className="lx-field__hint" id={`${uid}-${key}-h`}>{hint}</span> : null}
      </div>
    );
  };
  const h = (k: string) => t.hints[k]?.[locale];
  const check = (k: keyof Flags, text: Localized) => (
    <label className="lx-check lx3-check" key={k}><input type="checkbox" checked={flags[k]} onChange={(e) => setFlags((f) => ({ ...f, [k]: e.target.checked }))} /><span>{text[locale]}</span></label>
  );
  const select = <K extends keyof Enums>(k: K, options: Enums[K][]) => {
    const c = t.choices[k] as Record<string, Localized>;
    return (
      <div className="lx-field lx3-select" key={k}>
        <label htmlFor={`${uid}-${k}`}>{c.label[locale]}</label>
        <span className="lx-field__box"><select id={`${uid}-${k}`} value={enums[k]} onChange={(e) => setEnums((x) => ({ ...x, [k]: e.target.value as Enums[K] }))}>{options.map((o) => <option key={o} value={o}>{c[o][locale]}</option>)}</select></span>
      </div>
    );
  };

  const pro = mode === "pro";
  const siteFields: Field[] = [{ key: "siteArea", unit: "m2", fmt: areaF, hint: h("siteArea") }, { key: "coverage", unit: "pct", fmt: rate, hint: h("coverage") }, { key: "floors", unit: "x", fmt: rate, hint: h("floors") }, { key: "gbaManual", unit: "m2", fmt: areaF, hint: h("gbaManual") }, { key: "efficiency", unit: "pct", fmt: rate }];
  const costFields: Field[] = [{ key: "hard", unit: "eurm2", fmt: priceF }, { key: "design", unit: "pct", fmt: rate, hint: h("design") }, { key: "networks", unit: "eur", fmt: money }, { key: "landscaping", unit: "eur", fmt: money }, { key: "permits", unit: "eur", fmt: money, hint: h("permits") }, { key: "contingency", unit: "pct", fmt: rate, hint: h("contingency") }];
  const landFields: Field[] = [{ key: "landMarket", unit: "eur", fmt: money, hint: h("landMarket") }, ...(pro ? [{ key: "landTaxBasis", unit: "eur", fmt: money, hint: h("landTaxBasis") } as Field, { key: "landBook", unit: "eur", fmt: money, hint: h("landBook") } as Field, { key: "landCost", unit: "eur", fmt: money, hint: h("landCost") } as Field, { key: "landShare", unit: "pct", fmt: rate, hint: h("landShare") } as Field] : [])];
  const timeFields: Field[] = [{ key: "startYear", unit: "year", fmt: whole, hint: h("startYear") }, { key: "startMonth", unit: "month", fmt: whole }, { key: "preMonths", unit: "mo", fmt: whole }, { key: "buildMonths", unit: "mo", fmt: whole }, ...(model === "sale" ? [{ key: "salesMonths", unit: "mo", fmt: whole } as Field] : model === "hold" ? [{ key: "leaseUp", unit: "mo", fmt: whole } as Field] : [])];
  const exitFields: Record<ModelKey, Field[]> = {
    sale: [{ key: "price", unit: "eurm2", fmt: priceF }, { key: "commission", unit: "pct", fmt: rate }],
    hold: [{ key: "rent", unit: "eurm2m", fmt: priceF }, { key: "occupancy", unit: "pct", fmt: rate }, { key: "opex", unit: "pct", fmt: rate }, { key: "indexation", unit: "pct", fmt: rate }, { key: "holdYears", unit: "yr", fmt: whole }, { key: "exitYield", unit: "pct", fmt: rate }, { key: "exitCosts", unit: "pct", fmt: rate }],
    bts: [{ key: "leaseYears", unit: "yr", fmt: whole }, { key: "indexation", unit: "pct", fmt: rate }, { key: "target", unit: "pct", fmt: rate }, { key: "opex", unit: "pct", fmt: rate, hint: h("opexBts") }, { key: "exitYield", unit: "pct", fmt: rate }, { key: "exitCosts", unit: "pct", fmt: rate }, { key: "rent", unit: "eurm2m", fmt: priceF, hint: h("rentBts") }],
  };
  const earlyFields: Field[] = [{ key: "breakYear", unit: "yr", fmt: whole }, { key: "voidMonths", unit: "mo", fmt: whole }, { key: "reletPct", unit: "pct", fmt: rate }, { key: "breakFee", unit: "mo", fmt: whole, hint: h("breakFee") }];
  const taxFields: Field[] = [{ key: "taxRate", unit: "pct", fmt: rate, hint: h("taxRate") }, ...(pro ? [
    ...(model !== "sale" ? [{ key: "depYears", unit: "yr", fmt: whole, hint: h("depYears") } as Field, { key: "bookDepYears", unit: "yr", fmt: whole } as Field] : []),
    { key: "lossYears", unit: "yr", fmt: whole, hint: h("lossYears") } as Field,
    ...(model !== "sale" ? [{ key: "capGainInclusion", unit: "pct", fmt: rate, hint: h("capGainInclusion") } as Field] : []),
    { key: "interestRateCap", unit: "pctYr", fmt: rate, hint: h("interestRateCap") } as Field,
  ] : [])];
  const vatFields: Field[] = [{ key: "vatRate", unit: "pct", fmt: rate, hint: h("vatRate") }, { key: "vatRecoverable", unit: "pct", fmt: rate }, ...(model !== "sale" ? [{ key: "vatRefundLag", unit: "mo", fmt: whole, hint: h("vatRefundLag") } as Field] : [])];
  const ptFields: Field[] = [{ key: "landTaxAnnual", unit: "eurYr", fmt: money, hint: h("landTaxAnnual") }, { key: "buildingTaxRate", unit: "pctYr", fmt: rate, hint: h("buildingTaxRate") }];
  const finFields: Field[] = [{ key: "ltc", unit: "pct", fmt: rate }, { key: "interest", unit: "pctYr", fmt: rate, hint: h("interest") }, { key: "fee", unit: "pct", fmt: rate, hint: h("fee") }, ...(model !== "sale" ? [{ key: "graceMonths", unit: "mo", fmt: whole, hint: h("graceMonths") } as Field, { key: "amortYears", unit: "yr", fmt: whole } as Field] : [])];
  const refiFields: Field[] = [{ key: "refiMonth", unit: "mo", fmt: whole }, { key: "refiLtv", unit: "pct", fmt: rate }, { key: "refiRate", unit: "pctYr", fmt: rate }, { key: "refiCap", unit: "pct", fmt: rate }, { key: "refiAmortYears", unit: "yr", fmt: whole }];
  const discountFields: Field[] = model !== "bts" ? [{ key: "discount", unit: "pct", fmt: rate }] : [];

  const issueLabel = (key: IssueKey) => (key in t.issue ? t.issue[key as keyof typeof t.issue][locale] : label(key as NumKey));
  const presetList = presets.filter((p) => p.model === model);
  const s = result.ok ? result.summary : null;
  const L = result.ok ? result.ledger : null;
  const irrText = (r: IrrResult) => {
    if (r.kind === "unique") return `${pct(r.annual)}${r.plausible ? "" : ` · ${t.out.implausible[locale]}`}`;
    if (r.kind === "multiple") return r.nonNegative !== null ? `${pct(r.nonNegative)} †` : t.out.irrMulti[locale];
    return r.kind === "none-proven" ? t.out.irrNone[locale] : t.out.irrNotFound[locale];
  };
  const multiNote = (r: IrrResult[]) => {
    const m = r.find((x) => x.kind === "multiple" && x.nonNegative !== null);
    return m && m.kind === "multiple" ? t.out.irrNote[locale].replace("{roots}", m.annual.map((x) => pct(x)).join("; ")) : null;
  };
  const pbText = (pb: number | null) => (pb === null || !L ? t.out.notWithin[locale] : pb >= L.C ? `${pb} ${t.out.pbUnit[locale].replace("{c}", String(pb - L.C))}` : `${pb} ${t.u.mo[locale]}`);
  const hurdleText = s ? `${pf.format(s.hurdle)} %` : "—";
  const landMaxText = !s ? "—" : model === "bts" && !(inputs.rent && inputs.rent > 0) ? t.land.needRent[locale] : s.landMax.below ? t.land.below[locale] : cash(s.landMax.value ?? 0);
  const purchaseText = !extras ? "—" : model === "bts" && !(inputs.rent && inputs.rent > 0) ? t.land.needRent[locale] : extras.purchase.value === null ? t.be.none[locale] : extras.purchase.value === 0 ? t.land.below[locale] : `${cash(extras.purchase.value)} · ${t.be.check[locale]}`;

  // the calculation as text — for the visitor's own mail app and the clipboard: everything needed to reproduce it (Codex P1)
  const report = s && L ? (() => {
    const pageUrl = typeof window === "undefined" ? "" : window.location.href.split("#")[0];
    const today = new Date().toLocaleDateString("ru-RU");
    const lines: string[] = [t.send.title[locale].replace("{place}", place), `${t.send.source[locale]} · ${t.send.date[locale]} ${today}`, pageUrl, t.send.intro[locale],
      `${t.send.version[locale]}: ${MODEL_NAME} · engine ${ENGINE_VERSION}`, `${t.send.mode[locale]}: ${t.modes[mode][locale]}`, ...currencyReportLines(locale, display, fx), `${t.send.model[locale]}: ${t.models[model][locale]}`];
    if (isDemo) lines.push(t.demoNote[locale]);
    lines.push("", t.send.results[locale]);
    const row = (k: string, x: string) => lines.push(`- ${k}: ${x}`);
    if (model === "bts") row(t.out.minRent[locale], `${perM2(L.rent)} ${unitRent}${inputs.rent && inputs.rent > 0 ? ` (${t.out.atRent[locale]})` : ""}`);
    row(t.land.irrLand[locale], irrText(s.irrU));
    row(t.land.irrBuild[locale], `${irrText(s.irrCF)} · NPV ${cash(s.NPV_CF)}`);
    if (pro) row(t.out.irrEquity[locale], `${irrText(s.irrL)} · NPV ${cash(s.NPV_L)}`);
    row(t.out.npv[locale], cash(s.NPV_U));
    row(`${t.land.maxLand[locale]} ${hurdleText}`, landMaxText);
    if (extras) row(`${t.land.maxPurchase[locale]} ${hurdleText}`, purchaseText);
    if (L.NOI_stab !== null) { row(t.out.noiStab[locale], cash(L.NOI_stab)); row(t.out.noiY1[locale], cash(L.NOI_Y1 ?? 0)); row(t.out.noiNext[locale], cash(L.NOI_next ?? 0)); row(t.out.noiTv[locale], cash(L.NOI_TV)); row(t.out.yoc[locale], pct(s.YoC)); }
    row(pro ? t.out.profit[locale] : t.out.profitU[locale], cash(pro ? s.profitL : L.m.CF.reduce((a, x) => a + x, 0)));
    if (pro) { row(t.out.peakFunding[locale], cash(s.peakFunding)); row(t.out.peakEquity[locale], cash(s.peakEquity)); }
    for (const k of (model === "sale" ? ["cashExit", "econExit"] : ["cashOp", "cashExit", "econOp", "econExit"]) as (keyof Summary["pb"])[]) row(`${t.out.pbTitle[locale]} · ${(model === "sale" ? t.out.pbSale[k as "cashExit" | "econExit"] : t.out.pb[k])[locale]}`, pbText(s.pb[k]));
    row(t.costs.cash[locale], cash(L.CASH));
    row(t.land.applied[locale], flags.includeLand ? cash(landApplied) : t.land.off[locale]);
    row(`${t.tax.accrued[locale]} / ${t.tax.paid[locale]}`, `${cash(pro ? s.taxAccrued_L : s.taxAccrued_U)} / ${cash(pro ? s.taxPaid_L : s.taxPaid_U)}`);
    if (extras) lines.push(`- ${t.variants.title[locale]} (IRR): ${extras.variants.map((x) => `${t.variants[x.k][locale]} ${x.r.ok ? irrText(x.r.summary.irrU) : "—"}`).join(" · ")}`);
    lines.push("", t.send.inputs[locale]);
    lines.push(`- ${t.send.landFlag[locale]}: ${flags.includeLand ? t.send.yes[locale] : t.send.no[locale]}`);
    if (mode === "basic") lines.push(`- ${t.send.basicIgnored[locale]}`);
    const units: Partial<Record<NumKey, UnitKey>> = Object.fromEntries([...siteFields, ...costFields, ...landFields, ...timeFields, ...exitFields[model], ...earlyFields, ...taxFields, ...vatFields, ...ptFields, ...finFields, ...refiFields, ...discountFields].map((f) => [f.key, f.unit]));
    for (const k of NUM_KEYS) {
      const val = (inputs as Record<NumKey, number | null>)[k];
      if (!(k in units)) continue;
      if (mode === "basic" && !BASIC_SET.has(k)) continue;
      const tag = tagOf(k);
      const shownVal = val === null ? t.send.empty[locale] : MONEY.has(k) ? `${rf.format(convert(val, "EUR", display, R)).replace(/[.,]00$/, "")}` : rf.format(val).replace(/[.,]00$/, "");
      lines.push(`- ${label(k)}: ${shownVal}${val !== null && units[k] ? ` ${unitText(units[k]!)}` : ""}${tag ? ` (${tag[locale]})` : ""}`);
    }
    if (pro) {
      lines.push(`- ${t.choices.lossMode.label[locale]}: ${t.choices.lossMode[enums.lossMode][locale]}`, `- ${t.choices.advanceMethod.label[locale]}: ${t.choices.advanceMethod[enums.advanceMethod][locale]}`, `- ${t.checks.capitalizeInterest[locale]}: ${flags.capitalizeInterest ? t.send.yes[locale] : t.send.no[locale]}`);
      lines.push(`- ${t.checks.vatOn[locale]}: ${flags.vatOn ? t.send.yes[locale] : t.send.no[locale]}`);
      if (flags.vatOn) lines.push(`- ${t.checks.vatOnRent[locale]}: ${flags.vatOnRent ? t.send.yes[locale] : t.send.no[locale]} · ${t.checks.vatOnSale[locale]}: ${flags.vatOnSale ? t.send.yes[locale] : t.send.no[locale]} · ${t.checks.vatRefund[locale]}: ${inputs.vatRefund ? t.send.yes[locale] : t.send.no[locale]} · ${t.choices.vatFunding.label[locale]}: ${t.choices.vatFunding[enums.vatFunding][locale]}`);
      lines.push(`- ${t.ptMonths[locale]}: ${months.join(", ") || "—"}`);
      if ((inputs.ltc ?? 0) > 0) lines.push(`- ${t.choices.drawOrder.label[locale]}: ${t.choices.drawOrder[enums.drawOrder][locale]} · ${t.choices.amort.label[locale]}: ${t.choices.amort[enums.amort][locale]} · ${t.checks.refi[locale]}: ${flags.refi ? t.send.yes[locale] : t.send.no[locale]}`);
    }
    lines.push("", t.send.notes[locale], ...result.ok ? result.notes.map((n) => `- ${t.notes[n][locale]}`) : [], `- ${t.disclaimer[locale]}`, `- ${t.method[locale]}`, `- ${t.land.once[locale]}`);
    const mn = multiNote([s.irrU, s.irrCF, s.irrL]);
    if (mn) lines.push(`- ${mn}`);
    return lines.join("\n");
  })() : null;
  const enc = (text: string) => encodeURIComponent(text).replace(/[!'()*]/g, (ch) => `%${ch.charCodeAt(0).toString(16).toUpperCase()}`);
  const mailHref = report ? `${mailto}?subject=${enc(t.send.subject[locale].replace("{place}", place))}&body=${enc(report.replace(/\n/g, "\r\n"))}` : "";
  const [copied, setCopied] = useState<{ text: string; ok: boolean } | null>(null);
  const copyReport = () => {
    if (!report) return;
    const text = report;
    const bySelection = () => {
      const ta = document.createElement("textarea");
      ta.value = text; ta.setAttribute("readonly", ""); ta.style.position = "fixed"; ta.style.top = "0"; ta.style.opacity = "0";
      document.body.appendChild(ta); ta.select();
      let ok = false;
      try { ok = document.execCommand("copy"); } catch { ok = false; }
      ta.remove();
      setCopied({ text, ok });
    };
    if (navigator.clipboard?.writeText) navigator.clipboard.writeText(text).then(() => setCopied({ text, ok: true }), bySelection);
    else bySelection();
  };
  const copyNow = copied && copied.text === report ? copied : null;
  const clear = () => { setV(blank()); setCur({}); setDemo(null); setDemoKeys(new Set()); setLawKeys(freshTags()); setAssumed(new Set<NumKey>(["startYear", "startMonth"])); setPtMonths(LEGAL_PT_MONTHS); };
  const fmt = { cash, pct, nf, pf, rf, unitRent, unitPrice, perM2, irrText, pbText };

  return (
    <div className="lx-model lx3" ref={root}>
      <div className="lx-model__head">
        <div className="lx3-modes" role="radiogroup" aria-label={t.modes.label[locale]}>
          {(["basic", "pro"] as Mode[]).map((m) => (
            <button key={m} type="button" role="radio" aria-checked={mode === m} className={mode === m ? "is-on" : undefined} onClick={() => setMode(m)}>
              <span>{t.modes[m][locale]}</span><em>{(m === "basic" ? t.modes.basicLine : t.modes.proLine)[locale]}</em>
            </button>
          ))}
        </div>
        <div className="lx-model__tabs" role="tablist" aria-label={t.label[locale]}>
          {(["sale", "hold", "bts"] as ModelKey[]).map((m) => (
            // switching the model keeps the values and their «demo» tags (Codex P1: 2.1 dropped the tags and kept the values)
            <button key={m} type="button" role="tab" aria-selected={model === m} className={model === m ? "is-on" : undefined} onClick={() => setModel(m)}>
              <span>{t.models[m][locale]}</span>
              <em>{t.modelLine[m][locale]}</em>
            </button>
          ))}
        </div>
        <CurrencyBar locale={locale} currency={display} onCurrency={setDisplay} fx={fx} className="lx-model__cur" />
        <div className="lx-model__tools">
          {presetList.map((p) => <button key={p.key} type="button" className={`lx-model__demo${demo === p.key && isDemo ? " is-on" : ""}`} onClick={() => load(p)}>{t.demo[locale]} · {p.label[locale]}</button>)}
          {isDemo ? <button type="button" className="lx-model__clear lx3-accept" onClick={() => setDemoKeys(new Set())}>{t.accept[locale]}</button> : null}
          <button type="button" className="lx-model__clear" onClick={clear}>{t.clear[locale]}</button>
        </div>
        {isDemo ? <p className="lx-model__demo-note" role="status">{t.demoNote[locale]}</p> : null}
      </div>

      <div className="lx-model__grid">
        <div className="lx-model__inputs">
          <fieldset className="lx-group"><legend>{t.groups.site[locale]}</legend><div className="lx-group__grid">{siteFields.map(field)}</div></fieldset>
          <fieldset className="lx-group"><legend>{t.groups.cost[locale]}</legend><div className="lx-group__grid">{costFields.map(field)}</div></fieldset>
          <fieldset className="lx-group">
            <legend>{t.groups.land[locale]}</legend>
            <div className="lx-group__grid">{landFields.map(field)}{check("includeLand", t.checks.includeLand)}</div>
            <p className="lx-group__note">{t.land.once[locale]}</p>
          </fieldset>
          <fieldset className="lx-group"><legend>{t.groups.time[locale]}</legend><div className="lx-group__grid">{timeFields.map(field)}</div></fieldset>
          <fieldset className="lx-group"><legend>{t.groups.exit[model][locale]}</legend><div className="lx-group__grid">{exitFields[model].map(field)}</div></fieldset>
          {pro && model === "bts" ? <fieldset className="lx-group"><legend>{t.groups.early[locale]}</legend><div className="lx-group__grid">{earlyFields.map(field)}</div></fieldset> : null}
          {discountFields.length ? <fieldset className="lx-group"><legend>{t.groups.discount[locale]}</legend><div className="lx-group__grid">{discountFields.map(field)}</div></fieldset> : null}
          <fieldset className="lx-group">
            <legend>{t.groups.tax[locale]}</legend>
            <div className="lx-group__grid">
              {taxFields.map(field)}
              {pro ? <>{select("lossMode", ["free", "equal"])}{select("advanceMethod", ["prior", "current", "none"])}{check("capitalizeInterest", t.checks.capitalizeInterest)}</> : null}
            </div>
            {pro ? <p className="lx-group__note">{h("advanceMethod")}</p> : null}
          </fieldset>
          {pro ? (
            <>
              <fieldset className="lx-group">
                <legend>{t.groups.vat[locale]}</legend>
                <div className="lx-group__grid">{check("vatOn", t.checks.vatOn)}</div>
                {flags.vatOn ? (
                  <div className="lx-group__grid">
                    {vatFields.map(field)}
                    {model !== "sale" ? check("vatOnRent", t.checks.vatOnRent) : null}
                    {check("vatOnSale", t.checks.vatOnSale)}
                    {model !== "sale" ? check("vatRefund", t.checks.vatRefund) : null}
                    {select("vatFunding", ["equity", "facility"])}
                  </div>
                ) : null}
              </fieldset>
              <fieldset className="lx-group">
                <legend>{t.groups.ptax[locale]}</legend>
                <div className="lx-group__grid">
                  {ptFields.map(field)}
                  <div className="lx-field" key="ptMonths">
                    <label htmlFor={`${uid}-pt`}>{t.ptMonths[locale]}{ptMonths === LEGAL_PT_MONTHS ? <em className="lx-field__demo lx3-tag">{t.tags.law[locale]}</em> : null}</label>
                    <span className="lx-field__box"><input id={`${uid}-pt`} className="lx-field__input" inputMode="numeric" value={ptMonths} onChange={(e) => setPtMonths(e.target.value)} aria-describedby={`${uid}-pt-h`} /></span>
                    <span className="lx-field__hint" id={`${uid}-pt-h`}>{h("ptMonths")}</span>
                  </div>
                </div>
              </fieldset>
              <fieldset className="lx-group">
                <legend>{t.groups.finance[locale]}</legend>
                <div className="lx-group__grid">
                  {finFields.map(field)}
                  {select("drawOrder", ["prorata", "equityFirst"])}
                  {model !== "sale" ? select("amort", ["bullet", "annuity", "linear"]) : null}
                  {model !== "sale" ? check("refi", t.checks.refi) : null}
                </div>
                {model !== "sale" && flags.refi ? <div className="lx-group__grid">{refiFields.map(field)}</div> : null}
                <p className="lx-group__note">{t.fin.limits[locale]}</p>
              </fieldset>
            </>
          ) : (
            <aside className="lx3-limits">
              <p className="lx3-limits__t">{t.modes.limitsTitle[locale]}</p>
              <ul>{t.modes.limits.map((x) => <li key={x.en}>{x[locale]}</li>)}</ul>
              <button type="button" className="lx-link" onClick={() => setMode("pro")}><span>{t.modes.toPro[locale]}</span></button>
            </aside>
          )}
        </div>

        <div className="lx-model__out" aria-live="polite">
          {!s || !L ? (
            <div className="lx-out__empty">
              <p className="lx-out__label">{t.label[locale]}</p>
              <p className="lx-out__empty-t">{t.empty[locale]}</p>
              {issues.length ? (
                <ul className="lx-out__issues">
                  {issues.slice(0, 4).map((x) => <li key={`${x.key}-${x.kind}`} className={`is-${x.kind}`}><span>{x.kind === "missing" ? t.missing[locale] : t.range[locale]}:</span> {issueLabel(x.key)}</li>)}
                  {issues.length > 4 ? <li className="is-more">{t.more[locale]} {issues.length - 4}</li> : null}
                </ul>
              ) : null}
              {presetList.length ? (
                <div className="lx-out__start">
                  <p>{t.emptyDemo[locale]}</p>
                  <button type="button" className="lx-btn lx-btn--light" onClick={() => load(presetList[0])}><span>{t.demo[locale]} · {presetList[0].label[locale]}</span></button>
                </div>
              ) : null}
            </div>
          ) : (
            <>
              <Results locale={locale} model={model} mode={mode} s={s} L={L} inputs={inputs} early={early && early.ok ? early.summary : null} extras={extras} fmt={fmt} demo={isDemo} landText={{ max: landMaxText, purchase: purchaseText, hurdle: hurdleText, applied: flags.includeLand ? cash(landApplied) : t.land.off[locale] }} note={multiNote([s.irrU, s.irrCF, s.irrL])} notes={result.ok ? result.notes : []} more={more} onMore={() => setMore((x) => !x)} />
              {report ? (
                <section className="lx-send" aria-label={t.send.mail[locale]}>
                  <div className="lx-send__actions">
                    <a className="lx-btn lx-btn--dark" href={mailHref}><span>{t.send.mail[locale]}</span></a>
                    <button type="button" className="lx-btn lx-btn--ghost" onClick={copyReport}><span>{t.send.copy[locale]}</span></button>
                  </div>
                  <p className="lx-send__note">{t.send.note[locale]}</p>
                  <p className="lx-send__status" role="status">{copyNow ? (copyNow.ok ? t.send.copied[locale] : t.send.manual[locale]) : ""}</p>
                  {copyNow && !copyNow.ok ? <textarea className="lx-send__text" readOnly value={report} aria-label={t.send.copy[locale]} onFocus={(e) => e.currentTarget.select()} /> : null}
                </section>
              ) : null}
            </>
          )}
          <p className="lx-out__disclaimer">{t.disclaimer[locale]}</p>
          <p className="lx-out__method">{t.method[locale]}</p>
        </div>
      </div>
    </div>
  );
}

type Fmt = { cash: (x: number) => string; pct: (x: number | null) => string; nf: Intl.NumberFormat; pf: Intl.NumberFormat; rf: Intl.NumberFormat; unitRent: string; unitPrice: string; perM2: (x: number) => string; irrText: (r: IrrResult) => string; pbText: (pb: number | null) => string };
type Extras = { variants: { k: VariantKey; r: Result }[]; sens: ReturnType<typeof sensitivity>; mx: ReturnType<typeof matrix>; be: ReturnType<typeof breakEven>; purchase: ReturnType<typeof purchaseMax> } | null;

function Results({ locale, model, mode, s, L, inputs, early, extras, fmt, demo, landText, note, notes, more, onMore }: {
  locale: SiteLocale; model: ModelKey; mode: Mode; s: Summary; L: Ledger; inputs: Inputs; early: Summary | null; extras: Extras; fmt: Fmt; demo: boolean;
  landText: { max: string; purchase: string; hurdle: string; applied: string }; note: string | null; notes: NoteKey[]; more: boolean; onMore: () => void;
}) {
  const { cash, pct, nf, pf, unitRent, unitPrice, perM2, irrText, pbText } = fmt;
  const pro = mode === "pro";
  const m = L.m;
  const kpis: { k: string; label: string; value: string; accent?: boolean }[] =
    model === "sale"
      ? [{ k: "profit", label: pro ? t.out.profit[locale] : t.out.profitU[locale], value: cash(pro ? s.profitL : m.CF.reduce((a, x) => a + x, 0)), accent: true }, { k: "irr", label: t.out.irrProject[locale], value: irrText(s.irrU) }, { k: "npv", label: t.out.npv[locale], value: cash(s.NPV_U) }, { k: "pb", label: `${t.out.pbTitle[locale]} · ${t.out.pbSale.cashExit[locale]}`, value: pbText(s.pb.cashExit) }]
      : model === "hold"
        ? [{ k: "noi", label: t.out.noiStab[locale], value: cash(L.NOI_stab ?? 0), accent: true }, { k: "yoc", label: t.out.yoc[locale], value: pct(s.YoC) }, { k: "irr", label: t.out.irrProject[locale], value: irrText(s.irrU) }, { k: "npv", label: t.out.npv[locale], value: cash(s.NPV_U) }]
        : [{ k: "min", label: inputs.rent && inputs.rent > 0 ? `${t.out.atRent[locale]}` : t.out.minRent[locale], value: `${perM2(L.rent)} ${unitRent}`, accent: true }, { k: "irr", label: t.out.irrProject[locale], value: irrText(s.irrU) }, { k: "inv", label: t.out.investment[locale], value: cash(L.CASH + L.NONREC + L.LANDAPP) }, { k: "yoc", label: t.out.yoc[locale], value: pct(s.YoC) }];
  const secondary: { label: string; value: string }[] = [
    ...(pro ? [{ label: t.out.irrEquity[locale], value: irrText(s.irrL) }, { label: t.out.peakEquity[locale], value: cash(s.peakEquity) }] : []),
    { label: t.out.peakFunding[locale], value: cash(s.peakFunding) },
    ...(model !== "sale" ? [{ label: t.out.noiY1[locale], value: cash(L.NOI_Y1 ?? 0) }, { label: t.out.noiNext[locale], value: cash(L.NOI_next ?? 0) }, { label: t.out.terminal[locale], value: cash(L.TV) }] : []),
    ...(model === "bts" ? [{ label: t.out.rentYear[locale], value: cash(L.rent * L.NET * 12) }] : []),
  ];
  const q = quarterly(L);
  const pbKeys = (model === "sale" ? ["cashExit", "econExit"] : ["cashOp", "cashExit", "econOp", "econExit"]) as (keyof Summary["pb"])[];
  const fin = (inputs.ltc ?? 0) > 0;
  return (
    <div className="lx-out">
      <div className="lx-out__kpis">
        <p className="lx-out__label">{t.label[locale]} · {t.models[model][locale]} · {t.modes[mode][locale]}{demo ? ` · ${t.demo[locale]}` : ""}</p>
        <dl className="lx-out__grid">{kpis.map((x) => <div key={x.k} className={x.accent ? "is-accent" : undefined}><dt>{x.label}</dt><dd>{x.value}</dd></div>)}</dl>
        <dl className="lx-out__sec">{secondary.map((x) => <div key={x.label}><dt>{x.label}</dt><dd>{x.value}</dd></div>)}</dl>
        {note ? <p className="lx3-irrnote">{note}</p> : null}
      </div>

      <div className="lx-out__card lx-out__land">
        <p className="lx-out__h">{t.land.title[locale]}</p>
        <dl className="lx-costs">
          <div><dt>{t.land.applied[locale]}</dt><dd>{landText.applied}</dd></div>
          <div className="is-sum"><dt>{t.land.irrLand[locale]}</dt><dd>{irrText(s.irrU)}</dd></div>
          <div className="is-sum"><dt>{t.land.irrBuild[locale]}</dt><dd>{irrText(s.irrCF)}</dd></div>
          <div><dt>{t.land.npvBuild[locale]}</dt><dd>{cash(s.NPV_CF)}</dd></div>
          {pro ? <div className="is-sum"><dt>{t.out.irrEquity[locale]}</dt><dd>{irrText(s.irrL)}</dd></div> : null}
          <div className="is-sum is-wrap"><dt>{t.land.maxLand[locale]} {landText.hurdle}</dt><dd>{landText.max}</dd></div>
          {pro && more ? <div className="is-wrap"><dt>{t.land.maxPurchase[locale]} {landText.hurdle}</dt><dd>{landText.purchase}</dd></div> : null}
        </dl>
        <p className="lx-out__h lx3-sub">{t.out.pbTitle[locale]}</p>
        <dl className="lx-costs">{pbKeys.map((k) => <div key={k} className="is-wrap"><dt>{(model === "sale" ? t.out.pbSale[k as "cashExit" | "econExit"] : t.out.pb[k])[locale]}</dt><dd>{pbText(s.pb[k])}</dd></div>)}</dl>
        <p className="lx-note">{t.land.once[locale]}</p>
      </div>

      {notes.length ? (
        <div className="lx3-notes">
          <p className="lx3-notes__t">{t.notesTitle[locale]}</p>
          <ul>{notes.map((n) => <li key={n}>{t.notes[n][locale]}</li>)}</ul>
        </div>
      ) : null}

      {model === "bts" && early ? (
        <div className="lx-out__card">
          <p className="lx-out__h">{t.groups.early[locale]}</p>
          <table className="lx-table">
            <thead><tr><th /><th>{t.out.full[locale]}</th><th>{t.out.early[locale]}</th></tr></thead>
            <tbody>
              <tr><th>{t.out.irrProject[locale]}</th><td>{irrText(s.irrU)}</td><td>{irrText(early.irrU)}</td></tr>
              <tr><th>{t.out.npv[locale]}</th><td>{cash(s.NPV_U)}</td><td>{cash(early.NPV_U)}</td></tr>
            </tbody>
          </table>
        </div>
      ) : null}

      <button type="button" className="lx-out__more" aria-expanded={more} onClick={onMore}>{more ? t.more2.hide[locale] : t.more2.show[locale]}</button>
      {more ? (
        <>
          <div className="lx-out__card">
            <p className="lx-out__h">{t.costs.title[locale]}</p>
            <dl className="lx-costs">
              <div className="is-area"><dt>{t.costs.gba[locale]}</dt><dd>{nf.format(Math.round(L.GBA))}{" "}{t.u.m2[locale]}</dd></div>
              <div className="is-area"><dt>{t.costs.net[model][locale]}</dt><dd>{nf.format(Math.round(L.NET))}{" "}{t.u.m2[locale]}</dd></div>
              {(["hard", "design", "networks", "landscaping", "permits", "contingency"] as const).map((k) => <div key={k}><dt>{t.costs[k][locale]}</dt><dd>{cash(L.costs[k])}</dd></div>)}
              <div className="is-sum"><dt>{t.costs.cash[locale]}</dt><dd>{cash(L.CASH)}</dd></div>
              {L.NONREC ? <div><dt>{t.costs.nonrec[locale]}</dt><dd>{cash(L.NONREC)}</dd></div> : null}
              <div><dt>{t.costs.land[locale]}</dt><dd>{cash(L.LANDAPP)}</dd></div>
              <div className="is-sum"><dt>{t.costs.economic[locale]}</dt><dd>{cash(L.CASH + L.NONREC + L.LANDAPP)}</dd></div>
              <div><dt>{t.costs.propertyTax[locale]}</dt><dd>{cash(s.propertyTax)}</dd></div>
              <div><dt>{t.costs.tax[locale]}</dt><dd>{cash(pro ? s.taxPaid_L : s.taxPaid_U)}</dd></div>
              <div className="is-sum"><dt>{t.costs.revenue[model][locale]}</dt><dd>{cash(s.revenue)}</dd></div>
            </dl>
          </div>

          {pro ? (
            <div className="lx-out__card">
              <p className="lx-out__h">{t.tax.title[locale]}</p>
              <div className="lx-table__scroll">
                <table className="lx-table lx3-annual">
                  <thead><tr><th>{t.tax.year[locale]}</th><th>{t.tax.taxable[locale]}</th><th>{t.tax.lossUsed[locale]}</th><th>{t.tax.accrued[locale]}</th><th>{t.tax.paid[locale]}</th><th>{t.tax.acct[locale]}</th><th>{t.tax.cash[locale]}</th></tr></thead>
                  <tbody>{L.annual.map((a) => <tr key={a.year}><th>{a.year}</th><td>{cash(a.TIy_L)}</td><td>{cash(a.lossUsed_L)}</td><td>{cash(a.tax_L)}</td><td>{cash(a.taxPaid_L)}</td><td>{cash(a.acctProfit)}</td><td>{cash(a.cashFlowL)}</td></tr>)}</tbody>
                </table>
              </div>
              <dl className="lx-costs">
                {model !== "sale" ? <><div><dt>{t.tax.base[locale]}</dt><dd>{cash(L.BASE_L)}</dd></div><div><dt>{t.tax.rtv[locale]}</dt><dd>{cash(L.RTV_L ?? 0)}</dd></div></> : null}
                <div><dt>{t.tax.disallowed[locale]}</dt><dd>{cash(L.annual.reduce((a, x) => a + x.intDisallowed, 0))}</dd></div>
                <div><dt>{t.tax.carried[locale]}</dt><dd>{cash(L.annual[L.annual.length - 1]?.lossCarried_L ?? 0)}</dd></div>
              </dl>
              <p className="lx-note">{t.tax.note[locale]}</p>
            </div>
          ) : null}

          {pro && inputs.vatOn ? (
            <div className="lx-out__card">
              <p className="lx-out__h">{t.vat.title[locale]}</p>
              <dl className="lx-costs">
                <div><dt>{t.vat.in[locale]}</dt><dd>{cash(s.vatIn)}</dd></div>
                <div><dt>{t.vat.out[locale]}</dt><dd>{cash(s.vatOut)}</dd></div>
                <div><dt>{t.vat.refunded[locale]}</dt><dd>{cash(s.vatRefunded)}</dd></div>
                <div><dt>{t.vat.nonrec[locale]}</dt><dd>{cash(L.NONREC)}</dd></div>
                <div className="is-sum"><dt>{t.vat.peak[locale]}</dt><dd>{cash(s.peakVat)}</dd></div>
                {s.vatLapsed ? <div><dt>{t.vat.lapsed[locale]}</dt><dd>{cash(s.vatLapsed)}</dd></div> : null}
              </dl>
            </div>
          ) : null}

          {pro ? (
            <div className="lx-out__card">
              <p className="lx-out__h">{t.fin.title[locale]}</p>
              {fin ? (
                <>
                  <dl className="lx-costs">
                    <div><dt>{t.fin.loan[locale]}</dt><dd>{cash(L.LOAN)}</dd></div>
                    <div><dt>{t.fin.fee[locale]}</dt><dd>{cash(L.feeAmt)}</dd></div>
                    <div><dt>{t.fin.capint[locale]}</dt><dd>{cash(L.CAPINT)}</dd></div>
                    <div><dt>{t.fin.interest[locale]}</dt><dd>{cash(s.interestTotal)}</dd></div>
                    {model !== "sale" ? <>
                      <div className="is-sum"><dt>{t.fin.dscr[locale]}</dt><dd>{s.DSCRmin === null ? "—" : `${pf.format(s.DSCRmin)}×`}</dd></div>
                      <div><dt>{t.fin.ltvStab[locale]}</dt><dd>{pct(s.LTV_stab)}</dd></div>
                      <div><dt>{t.fin.ltvExit[locale]}</dt><dd>{pct(s.LTV_exit)}</dd></div>
                      <div><dt>{t.fin.dy[locale]}</dt><dd>{pct(s.debtYield)}</dd></div>
                    </> : null}
                  </dl>
                  <p className={`lx-note${s.shortfallMonths ? " lx3-warn" : ""}`}>{s.shortfallMonths ? t.fin.shortfall[locale].replace("{n}", String(s.shortfallMonths)).replace("{sum}", cash(s.shortfallSum)) : t.fin.noShortfall[locale]}</p>
                  <p className="lx-note">{t.fin.limits[locale]}</p>
                </>
              ) : <p className="lx-note">{t.fin.none[locale]}</p>}
            </div>
          ) : null}

          <div className="lx-out__card">
            <p className="lx-out__h">{t.chart.title[locale]}</p>
            <FlowChart q={q} locale={locale} eur={cash} />
            <details className="lx-out__fold">
              <summary>{t.chart.table[locale]}</summary>
              <div className="lx-table__scroll">
                <table className="lx-table lx-table--flows">
                  <thead><tr><th>{t.chart.q[locale]}</th><th>{t.chart.in[locale]}</th><th>{t.chart.outflow[locale]}</th><th>{t.chart.cum[locale]}</th></tr></thead>
                  <tbody>{q.map((r) => <tr key={r.q}><th>{r.q + 1}</th><td>{cash(r.inflow)}</td><td>{cash(-r.outflow)}</td><td>{cash(r.cumulative)}</td></tr>)}</tbody>
                </table>
              </div>
            </details>
          </div>

          {extras ? (
            <>
              <div className="lx-out__card">
                <p className="lx-out__h">{t.variants.title[locale]}</p>
                <div className="lx-table__scroll">
                  <table className="lx-table">
                    <thead><tr><th />{extras.variants.map((x) => <th key={x.k}>{t.variants[x.k][locale]}</th>)}</tr></thead>
                    <tbody>
                      {model === "bts" ? <tr><th>{t.out.minRent[locale]}</th>{extras.variants.map((x) => <td key={x.k}>{x.r.ok ? `${perM2(x.r.ledger.rent)}` : "—"}</td>)}</tr> : null}
                      <tr><th>{t.out.irrProject[locale]}</th>{extras.variants.map((x) => <td key={x.k}>{x.r.ok ? irrText(x.r.summary.irrU) : "—"}</td>)}</tr>
                      <tr><th>{t.out.npv[locale]}</th>{extras.variants.map((x) => <td key={x.k}>{x.r.ok ? cash(x.r.summary.NPV_U) : "—"}</td>)}</tr>
                      <tr><th>{t.out.irrEquity[locale]}</th>{extras.variants.map((x) => <td key={x.k}>{x.r.ok ? irrText(x.r.summary.irrL) : "—"}</td>)}</tr>
                    </tbody>
                  </table>
                </div>
                <p className="lx-note">{t.variants.note[locale]}{model === "bts" ? ` (${unitRent})` : ""}</p>
              </div>

              <div className="lx-out__card">
                <p className="lx-out__h">{t.sens.title[locale]}</p>
                <div className="lx-table__scroll">
                  <table className="lx-table">
                    <thead><tr><th>{model === "bts" ? t.sens.colsBts[locale] : t.sens.cols[locale]}</th><th>{t.sens.low[locale]}</th><th>{t.sens.high[locale]}</th></tr></thead>
                    <tbody>
                      {extras.sens.map((row) => {
                        const cell = (x: typeof row.low) => (model === "bts" && !(inputs.rent && inputs.rent > 0) ? (x.minRent !== null ? `${perM2(x.minRent)}` : "—") : `${x.npv === null ? "—" : cash(x.npv)} · ${pct(x.irrL)}`);
                        return <tr key={row.key}><th>{t.sens.rows[row.key][locale]}</th><td>{cell(row.low)}</td><td>{cell(row.high)}</td></tr>;
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="lx-out__card">
                <p className="lx-out__h">{model === "sale" ? t.matrix.sale[locale] : t.matrix.hold[locale]}</p>
                <div className="lx-table__scroll">
                  <table className="lx-table lx3-matrix">
                    <thead><tr><th />{extras.mx.cols.map((c) => <th key={c}>{extras.mx.colKey === "exitYield" ? `${c > 0 ? "+" : ""}${pf.format(c)} p.p.` : `${c > 0 ? "+" : ""}${c} %`}</th>)}</tr></thead>
                    <tbody>{extras.mx.rows.map((r, k) => <tr key={r}><th>{`${r > 0 ? "+" : ""}${r} %`}</th>{extras.mx.npv[k].map((x, j) => <td key={j} className={x !== null && x < 0 ? "is-neg" : r === 0 && extras.mx.cols[j] === 0 ? "is-base" : undefined}>{x === null ? "—" : cash(x)}</td>)}</tr>)}</tbody>
                  </table>
                </div>
                <p className="lx-note">{t.matrix.note[locale]}</p>
              </div>

              <div className="lx-out__card">
                <p className="lx-out__h">{t.be.title[locale]}</p>
                <dl className="lx-costs">
                  {model === "sale" ? <div><dt>{t.be.price[locale]}</dt><dd>{extras.be.price?.value != null ? `${perM2(extras.be.price.value)} ${unitPrice}` : t.be.none[locale]}</dd></div> : null}
                  {model === "hold" ? <>
                    <div><dt>{t.be.rent[locale]}</dt><dd>{extras.be.rent?.value != null ? `${perM2(extras.be.rent.value)} ${unitRent}` : t.be.none[locale]}</dd></div>
                    <div><dt>{t.be.occ[locale]}</dt><dd>{extras.be.occupancy?.value != null ? `${pf.format(extras.be.occupancy.value)} %` : t.be.none[locale]}</dd></div>
                  </> : null}
                  {model === "bts" ? <div><dt>{t.out.minRent[locale]}</dt><dd>{`${perM2(L.rent)} ${unitRent} · ${t.be.check[locale]}`}</dd></div> : null}
                </dl>
              </div>
            </>
          ) : null}
        </>
      ) : null}
    </div>
  );
}

function FlowChart({ q, locale, eur }: { q: { q: number; inflow: number; outflow: number; cumulative: number }[]; locale: SiteLocale; eur: (x: number) => string }) {
  const W = 640, H = 240, P = 28;
  const max = Math.max(1, ...q.map((r) => Math.max(r.inflow, r.outflow, Math.abs(r.cumulative))));
  const y0 = H / 2;
  const k = (H / 2 - P) / max;
  const bw = Math.max(2, (W - 2 * P) / Math.max(1, q.length) - 2);
  const x = (i: number) => P + i * ((W - 2 * P) / Math.max(1, q.length));
  const line = q.map((r, i) => `${i ? "L" : "M"}${(x(i) + bw / 2).toFixed(1)} ${(y0 - r.cumulative * k).toFixed(1)}`).join("");
  const minCum = q.reduce((m, r) => Math.min(m, r.cumulative), 0);
  const last = q[q.length - 1];
  return (
    <figure className="lx-chart">
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`${t.chart.title[locale]}: ${t.chart.cum[locale]} ${eur(last?.cumulative ?? 0)}; min ${eur(minCum)}`}>
        <line x1={P} x2={W - P} y1={y0} y2={y0} className="lx-chart__axis" />
        {q.map((r, i) => (
          <g key={r.q}>
            <title>{`${t.chart.q[locale]} ${r.q + 1}: ${t.chart.in[locale]} ${eur(r.inflow)} · ${t.chart.outflow[locale]} ${eur(-r.outflow)} · ${t.chart.cum[locale]} ${eur(r.cumulative)}`}</title>
            <rect className="lx-chart__in" x={x(i)} y={y0 - r.inflow * k} width={bw} height={Math.max(0, r.inflow * k)} />
            <rect className="lx-chart__out" x={x(i)} y={y0} width={bw} height={Math.max(0, r.outflow * k)} />
          </g>
        ))}
        <path className="lx-chart__cum" d={line} />
      </svg>
      <figcaption className="lx-chart__legend">
        <span><i className="is-in" />{t.chart.in[locale]}</span>
        <span><i className="is-out" />{t.chart.outflow[locale]}</span>
        <span><i className="is-cum" />{t.chart.cum[locale]}</span>
      </figcaption>
    </figure>
  );
}
