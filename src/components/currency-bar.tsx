"use client";

import { useEffect, useId, useRef, useState, useSyncExternalStore } from "react";
import { NumberInput, type NumberFormat } from "@/components/number-input";
import { nbmSnapshot } from "@/data/nbm-rate";
import { rateOf, type Currency } from "@/lib/currency";
import { chisinauToday, isNewerRecord, isTodaysRate, loadNbmRecord, nbmDisplayDate, type NbmRecord } from "@/lib/nbm";
import type { SiteLocale } from "@/lib/site-data";
import "@/app/currency.css";

/**
 * The compact currency switch of the calculators (OWNER «CALCULATOR CURRENCY R1», 2026-11-15; the rate since OWNER «AUTOMATIC NBM FX»,
 * 2026-11-16): MDL | EUR, the official NBM rate read when the page loads (src/lib/nbm.ts — the same record for both calculators) and a
 * field to set another rate for a scenario. Logic in src/lib/currency.ts; nothing here calculates.
 */
export const currencyCopy = {
  ru: {
    label: "Валюта расчёта",
    rateLabel: "Курс",
    official: (date: string) => `официальный курс НБМ на ${date} · обновляется автоматически`,
    latest: (date: string) => `последний опубликованный курс НБМ — на ${date}`,
    manual: "Курс задан вручную",
    empty: (date: string) => `поле курса пустое — применяется официальный курс НБМ на ${date}`,
    restore: "Вернуть курс НБМ",
    offer: (date: string, rate: string) => `Опубликован курс НБМ на ${date}: 1 EUR = ${rate} MDL`,
    apply: "Применить",
    note: "Суммы пересчитываются по курсу; формулы расчёта не меняются.",
    typed: (x: string) => `введено: ${x}`,
    reportCurrency: "Валюта расчёта", reportRate: "Курс",
    reportOfficial: (date: string) => `источник: НБМ, официальный курс на ${date}`,
    reportManual: "ручной сценарий (курс задан вручную)",
  },
  ro: {
    label: "Moneda calculului",
    rateLabel: "Curs",
    official: (date: string) => `cursul oficial BNM din ${date} · actualizat automat`,
    latest: (date: string) => `ultimul curs oficial BNM publicat — din ${date}`,
    manual: "Curs stabilit manual",
    empty: (date: string) => `câmpul cursului este gol — se aplică cursul oficial BNM din ${date}`,
    restore: "Reveniți la cursul BNM",
    offer: (date: string, rate: string) => `A fost publicat cursul BNM din ${date}: 1 EUR = ${rate} MDL`,
    apply: "Aplicați",
    note: "Sumele se recalculează la curs; formulele calculului nu se schimbă.",
    typed: (x: string) => `introdus: ${x}`,
    reportCurrency: "Moneda calculului", reportRate: "Curs",
    reportOfficial: (date: string) => `sursa: BNM, cursul oficial din ${date}`,
    reportManual: "scenariu manual (curs stabilit manual)",
  },
  en: {
    label: "Calculation currency",
    rateLabel: "Rate",
    official: (date: string) => `official NBM rate of ${date} · updated automatically`,
    latest: (date: string) => `latest published NBM rate — of ${date}`,
    manual: "Rate set manually",
    empty: (date: string) => `the rate field is empty — the official NBM rate of ${date} applies`,
    restore: "Back to the NBM rate",
    offer: (date: string, rate: string) => `NBM rate of ${date} published: 1 EUR = ${rate} MDL`,
    apply: "Apply",
    note: "Amounts are converted at the rate; the formulas do not change.",
    typed: (x: string) => `entered as ${x}`,
    reportCurrency: "Calculation currency", reportRate: "Rate",
    reportOfficial: (date: string) => `source: NBM, official rate of ${date}`,
    reportManual: "manual scenario (rate set manually)",
  },
} satisfies Record<SiteLocale, Record<string, unknown>>;

const noSubscription = () => () => {};
const rateFormat: NumberFormat = { group: false, decimals: 4, maxInt: 3 };
const rateText = (rate: number, locale: SiteLocale) => (locale === "en" ? rate.toFixed(4) : rate.toFixed(4).replace(".", ","));

/** The rate of a calculator: the official NBM record (read when the page loads) or a rate the visitor types for a scenario. */
export type Fx = {
  /** the official record the calculation uses */
  record: NbmRecord;
  /** the rate in use — the visitor's scenario rate or the official one */
  rate: number;
  /** what the rate field shows (canonical) */
  text: string;
  /** a valid rate typed by the visitor is in use (an empty or invalid field is NOT a manual state — Codex P2, 2026-11-24) */
  manual: boolean;
  /** the field holds no valid rate: the official rate applies and the interface says so */
  empty: boolean;
  setText: (canonical: string) => void;
  restore: () => void;
  /** a newer official record that arrived after the visitor started a calculation on the official rate — applied only on request */
  offer: NbmRecord | null;
  applyOffer: () => void;
};

/**
 * `started`: the visitor has entered something. Until then a newer official record replaces the first one silently (the page has just
 * loaded); afterwards it never changes a calculation under the visitor's hands — it is offered («Применить»). A scenario rate typed by
 * the visitor stays until «Вернуть курс НБМ»; that action returns to the newest official record.
 */
export function useFx(started: boolean): Fx {
  const [record, setRecord] = useState<NbmRecord>(nbmSnapshot);
  const [offer, setOffer] = useState<NbmRecord | null>(null);
  const [manual, setManual] = useState<string | null>(null);
  const scenario = manual === null ? null : rateOf(manual);
  const state = useRef({ started, scenario });
  useEffect(() => { state.current = { started, scenario }; }, [started, scenario]);
  useEffect(() => {
    let live = true;
    loadNbmRecord().then((fresh) => {
      if (!live || !fresh || !isNewerRecord(fresh, nbmSnapshot)) return;
      if (state.current.started && state.current.scenario === null) setOffer(fresh);
      else setRecord(fresh);
    });
    return () => { live = false; };
  }, []);
  return {
    record,
    rate: scenario ?? record.rate,
    text: manual ?? String(record.rate),
    manual: scenario !== null,
    empty: manual !== null && scenario === null,
    setText: (canonical) => setManual(rateOf(canonical) === record.rate ? null : canonical),
    restore: () => { if (offer) { setRecord(offer); setOffer(null); } setManual(null); },
    offer,
    applyOffer: () => { if (offer) { setRecord(offer); setOffer(null); } },
  };
}

/** the lines the e-mail / copy text carries: the currency, the rate and its source — the NBM with its date, or a manual scenario */
export function currencyReportLines(locale: SiteLocale, currency: Currency, fx: Fx): string[] {
  const t = currencyCopy[locale];
  return [`${t.reportCurrency}: ${currency}`, `${t.reportRate}: 1 EUR = ${rateText(fx.rate, locale)} MDL · ${fx.manual ? t.reportManual : t.reportOfficial(nbmDisplayDate(fx.record.date))}`];
}

/** the rate line a handed-over calculation carries (Moscova 20 → the viewing request) */
export function currencyRateLine(locale: SiteLocale, fx: Fx): { label: string; value: string } {
  const t = currencyCopy[locale];
  return { label: t.reportRate, value: `1 EUR = ${rateText(fx.rate, locale)} MDL · ${fx.manual ? t.reportManual : t.reportOfficial(nbmDisplayDate(fx.record.date))}` };
}

export function CurrencyBar({ locale, currency, onCurrency, fx, className }: {
  locale: SiteLocale; currency: Currency; onCurrency: (c: Currency) => void; fx: Fx; className?: string;
}) {
  const t = currencyCopy[locale];
  const uid = useId();
  // today in Chișinău is known only in the browser: until then the line names the rate by its date (true in every case)
  const today = useSyncExternalStore(noSubscription, chisinauToday, () => null);
  const date = nbmDisplayDate(fx.record.date);
  const officialLine = today === null || isTodaysRate(fx.record, today) ? t.official(date) : t.latest(date);
  return (
    <div className={`cur-bar${className ? ` ${className}` : ""}`}>
      <div className="cur-bar__switch" role="radiogroup" aria-label={t.label}>
        <span className="cur-bar__label">{t.label}</span>
        <span className="cur-bar__seg">
          {(["MDL", "EUR"] as Currency[]).map((c) => (
            <button key={c} type="button" role="radio" aria-checked={currency === c} className={currency === c ? "is-on" : undefined} onClick={() => onCurrency(c)}>{c}</button>
          ))}
        </span>
      </div>
      <div className="cur-bar__rate">
        <label className="cur-bar__ratelabel" htmlFor={`${uid}-rate`}>{t.rateLabel}</label>
        <span className="cur-bar__ratefield">
          <span aria-hidden="true">1 EUR =</span>
          <NumberInput className="cur-bar__input" id={`${uid}-rate`} value={fx.text} onValueChange={fx.setText} locale={locale} format={rateFormat} describedBy={`${uid}-rate-src`} />
          <span aria-hidden="true">MDL</span>
        </span>
        <span className={`cur-bar__src${fx.manual ? " is-manual" : ""}`} id={`${uid}-rate-src`} aria-live="polite">
          {fx.manual ? <>{t.manual} · <button type="button" className="cur-bar__restore" onClick={fx.restore}>{t.restore}</button></> : fx.empty ? <>{t.empty(date)} · <button type="button" className="cur-bar__restore" onClick={fx.restore}>{t.restore}</button></> : officialLine}
        </span>
      </div>
      {fx.offer && !fx.manual ? (
        <p className="cur-bar__offer" role="status">
          {t.offer(nbmDisplayDate(fx.offer.date), rateText(fx.offer.rate, locale))} · <button type="button" className="cur-bar__restore" onClick={fx.applyOffer}>{t.apply}</button>
        </p>
      ) : null}
      <p className="cur-bar__note">{t.note}</p>
    </div>
  );
}
