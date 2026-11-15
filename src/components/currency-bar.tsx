"use client";

import { useId } from "react";
import { NumberInput, type NumberFormat } from "@/components/number-input";
import { nbmRate } from "@/data/nbm-rate";
import type { Currency } from "@/lib/currency";
import type { SiteLocale } from "@/lib/site-data";
import "@/app/currency.css";

/**
 * The compact currency switch of the calculators (OWNER «CALCULATOR CURRENCY R1», 2026-11-15): MDL | EUR, the official NBM rate of its
 * date and a field to set another rate for a scenario. Logic in src/lib/currency.ts; nothing here calculates.
 */
export const currencyCopy = {
  ru: {
    label: "Валюта расчёта",
    rateLabel: "Курс",
    official: (date: string) => `официальный курс НБМ на ${date}`,
    manual: "курс задан вручную для сценария",
    restore: "Вернуть курс НБМ",
    note: "Суммы пересчитываются по курсу; формулы расчёта не меняются.",
    typed: (x: string) => `введено: ${x}`,
    reportCurrency: "Валюта расчёта", reportRate: "Курс", reportManual: "задан вручную",
  },
  ro: {
    label: "Moneda calculului",
    rateLabel: "Curs",
    official: (date: string) => `cursul oficial BNM din ${date}`,
    manual: "curs stabilit manual pentru scenariu",
    restore: "Reveniți la cursul BNM",
    note: "Sumele se recalculează la curs; formulele calculului nu se schimbă.",
    typed: (x: string) => `introdus: ${x}`,
    reportCurrency: "Moneda calculului", reportRate: "Curs", reportManual: "stabilit manual",
  },
  en: {
    label: "Calculation currency",
    rateLabel: "Rate",
    official: (date: string) => `official NBM rate of ${date}`,
    manual: "rate set manually for a scenario",
    restore: "Back to the NBM rate",
    note: "Amounts are converted at the rate; the formulas do not change.",
    typed: (x: string) => `entered as ${x}`,
    reportCurrency: "Calculation currency", reportRate: "Rate", reportManual: "set manually",
  },
} satisfies Record<SiteLocale, Record<string, unknown>>;

/** the NBM date as the page shows it: DD.MM.YYYY */
export const nbmDate = nbmRate.date.split("-").reverse().join(".");
export const officialRate = String(nbmRate.eurMdl);

const rateFormat: NumberFormat = { group: false, decimals: 4, maxInt: 3 };

/** the line the e-mail / copy text carries: currency · rate · its date or «set manually» */
export function currencyReportLines(locale: SiteLocale, currency: Currency, rate: number, isOfficial: boolean): string[] {
  const t = currencyCopy[locale];
  const r = locale === "en" ? rate.toFixed(4) : rate.toFixed(4).replace(".", ",");
  return [`${t.reportCurrency}: ${currency}`, `${t.reportRate}: 1 EUR = ${r} MDL · ${isOfficial ? t.official(nbmDate) : t.reportManual}`];
}

export function CurrencyBar({ locale, currency, onCurrency, rate, onRate, className }: {
  locale: SiteLocale; currency: Currency; onCurrency: (c: Currency) => void; rate: string; onRate: (canonical: string) => void; className?: string;
}) {
  const t = currencyCopy[locale];
  const uid = useId();
  const isOfficial = Number(rate) === nbmRate.eurMdl;
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
          <NumberInput className="cur-bar__input" id={`${uid}-rate`} value={rate} onValueChange={onRate} locale={locale} format={rateFormat} describedBy={`${uid}-rate-src`} />
          <span aria-hidden="true">MDL</span>
        </span>
        <span className="cur-bar__src" id={`${uid}-rate-src`}>
          {isOfficial ? t.official(nbmDate) : t.manual}
          {isOfficial ? null : <> · <button type="button" className="cur-bar__restore" onClick={() => onRate(officialRate)}>{t.restore}</button></>}
        </span>
      </div>
      <p className="cur-bar__note">{t.note}</p>
    </div>
  );
}
