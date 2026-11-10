"use client";

import { useId, useMemo, useState, type ChangeEvent } from "react";
import type { SiteLocale } from "@/lib/site-data";

/**
 * DEVELOPMENT SCENARIO — the land equivalent of the Moscova 20 tenant calculator (OWNER «LAND DEVELOPMENT
 * OPPORTUNITIES» §9, 2026-11-10). A decision-support calculation on the visitor's own assumptions: the only
 * pre-filled value is the confirmed land area. Every result is an «illustrative development scenario» — never a
 * valuation, an official estimate, an investment recommendation or a project forecast. The sample loads only on
 * request and is labelled. No IRR is claimed: the annualised figure is a simple compounding of the margin over the
 * development period, named as such.
 */

const copy = {
  ru: {
    label: "Иллюстративный сценарий девелопмента",
    sub: "Расчёт на ваших допущениях. Подтверждена только площадь участка.",
    sample: "Пример — условные значения",
    clear: "Очистить",
    sampleNote: "Пример — условные значения, не данные участка и не рекомендация.",
    mode: { sale: "Продажа", rent: "Аренда" },
    groups: { site: "Участок и застройка", cost: "Затраты", exit: "Выход" },
    f: {
      area: "Площадь участка", coverage: "Застройка участка", floors: "Этажность (допущение)", gba: "Площадь здания (GBA) — вручную", build: "Строительство", soft: "Проектные и прочие затраты", contingency: "Резерв", land: "Стоимость земли (если учитываете)", months: "Срок реализации", finance: "Ставка финансирования", sale: "Цена продажи", efficiency: "Полезная доля площади", rent: "Арендная ставка", yield: "Ставка капитализации (exit yield)", opex: "Операционные расходы",
    },
    u: { m2: "м²", pct: "%", eurm2: "€/м²", eur: "€", months: "мес.", eurm2m: "€/м²·мес." },
    hints: { gba: "если указано — заменяет расчёт по застройке и этажности", coverage: "допущение, не POT", floors: "допущение, не высотность по регламенту" },
    o: { gba: "Площадь здания (GBA)", cost: "Полная стоимость проекта", revenue: "Выручка от продажи", noi: "Стабилизированный NOI", value: "Индикативная стоимость", margin: "Маржа девелопера", roic: "Доходность на вложенный капитал", annual: "В годовом выражении (упрощённо)" },
    empty: "Заполните допущения — результат появится здесь.",
    disclaimer: "Не оценка, не официальный расчёт, не инвестиционная рекомендация и не прогноз проекта. Параметры застройки участка не определены: градостроительный режим, POT, CUT и мощности проверяются.",
  },
  ro: {
    label: "Scenariu ilustrativ de dezvoltare",
    sub: "Un calcul pe ipotezele dumneavoastră. Confirmată este doar suprafața terenului.",
    sample: "Exemplu — valori convenționale",
    clear: "Golește",
    sampleNote: "Exemplu — valori convenționale, nu date ale terenului și nu o recomandare.",
    mode: { sale: "Vânzare", rent: "Închiriere" },
    groups: { site: "Teren și construcție", cost: "Costuri", exit: "Ieșire" },
    f: {
      area: "Suprafața terenului", coverage: "Gradul de ocupare", floors: "Număr de niveluri (ipoteză)", gba: "Suprafața clădirii (GBA) — manual", build: "Construcție", soft: "Proiectare și alte costuri", contingency: "Rezervă", land: "Valoarea terenului (dacă o includeți)", months: "Durata realizării", finance: "Rata de finanțare", sale: "Preț de vânzare", efficiency: "Ponderea suprafeței utile", rent: "Chirie", yield: "Rata de capitalizare (exit yield)", opex: "Costuri operaționale",
    },
    u: { m2: "m²", pct: "%", eurm2: "€/m²", eur: "€", months: "luni", eurm2m: "€/m²·lună" },
    hints: { gba: "dacă este completată, înlocuiește calculul după ocupare și niveluri", coverage: "ipoteză, nu POT", floors: "ipoteză, nu regimul de înălțime" },
    o: { gba: "Suprafața clădirii (GBA)", cost: "Costul total al proiectului", revenue: "Venit din vânzare", noi: "NOI stabilizat", value: "Valoare indicativă", margin: "Marja dezvoltatorului", roic: "Randamentul capitalului investit", annual: "Anualizat (simplificat)" },
    empty: "Completați ipotezele — rezultatul apare aici.",
    disclaimer: "Nu este o evaluare, un calcul oficial, o recomandare de investiție sau o prognoză a proiectului. Parametrii de construire ai terenului nu sunt stabiliți: regimul urbanistic, POT, CUT și capacitățile se verifică.",
  },
  en: {
    label: "Illustrative development scenario",
    sub: "A calculation on your own assumptions. Only the site area is confirmed.",
    sample: "Sample — illustrative values",
    clear: "Clear",
    sampleNote: "Sample — illustrative values, not site data and not a recommendation.",
    mode: { sale: "Sale", rent: "Lease" },
    groups: { site: "Site and building", cost: "Costs", exit: "Exit" },
    f: {
      area: "Site area", coverage: "Site coverage", floors: "Floors (assumption)", gba: "Gross building area (GBA) — manual", build: "Construction", soft: "Design and soft costs", contingency: "Contingency", land: "Land value (if you include it)", months: "Development period", finance: "Financing rate", sale: "Sale price", efficiency: "Net-to-gross", rent: "Rent", yield: "Exit yield", opex: "Operating costs",
    },
    u: { m2: "m²", pct: "%", eurm2: "€/m²", eur: "€", months: "months", eurm2m: "€/m²·month" },
    hints: { gba: "when filled, replaces the coverage × floors estimate", coverage: "an assumption, not POT", floors: "an assumption, not the height limit" },
    o: { gba: "Gross building area (GBA)", cost: "Total development cost", revenue: "Sales revenue", noi: "Stabilised NOI", value: "Indicative value", margin: "Developer margin", roic: "Return on invested capital", annual: "Annualised (simplified)" },
    empty: "Fill in the assumptions — the result appears here.",
    disclaimer: "Not a valuation, an official estimate, an investment recommendation or a project forecast. The site's development parameters are not established: the planning regime, POT, CUT and capacities are being verified.",
  },
} as const;

type Key = "area" | "coverage" | "floors" | "gba" | "build" | "soft" | "contingency" | "land" | "months" | "finance" | "sale" | "efficiency" | "rent" | "yield" | "opex";
const SAMPLE: Partial<Record<Key, number>> = { coverage: 35, floors: 2, build: 650, soft: 10, contingency: 5, months: 18, finance: 8, sale: 1100, efficiency: 85, rent: 9, yield: 9.5, opex: 10 };

const num = (value: string) => {
  const n = Number(value.replace(/[\s ]/g, "").replace(",", "."));
  return Number.isFinite(n) && n > 0 ? n : null;
};

export function DevelopmentCalculator({ locale, area }: { locale: SiteLocale; /** the confirmed land area, m² — the only pre-filled value */ area: number }) {
  const t = copy[locale];
  const uid = useId();
  const nf = useMemo(() => new Intl.NumberFormat(locale === "ru" ? "ru-RU" : locale === "ro" ? "ro-RO" : "en-GB", { maximumFractionDigits: 0 }), [locale]);
  const pf = useMemo(() => new Intl.NumberFormat(locale === "ru" ? "ru-RU" : locale === "ro" ? "ro-RO" : "en-GB", { maximumFractionDigits: 1 }), [locale]);
  const blank = { area: String(area) } as Record<Key, string>;
  const [v, setV] = useState<Record<Key, string>>(blank);
  const [mode, setMode] = useState<"sale" | "rent">("sale");
  const [isSample, setIsSample] = useState(false);
  const set = (key: Key) => (event: ChangeEvent<HTMLInputElement>) => {
    setV((old) => ({ ...old, [key]: event.target.value }));
    setIsSample(false);
  };
  const n = (key: Key) => num(v[key] ?? "");

  // GBA: the manual figure, or land × coverage × floors (assumptions — never POT / CUT)
  const gba = n("gba") ?? (n("area") && n("coverage") && n("floors") ? n("area")! * (n("coverage")! / 100) * n("floors")! : null);
  const hard = gba && n("build") ? gba * n("build")! : null;
  const soft = hard ? hard * ((n("soft") ?? 0) / 100) : null;
  const cont = hard ? (hard + (soft ?? 0)) * ((n("contingency") ?? 0) / 100) : null;
  const base = hard ? hard + (soft ?? 0) + (cont ?? 0) : null;
  // financing on an average half drawdown over the period
  const finance = base && n("finance") && n("months") ? base * (n("finance")! / 100) * (n("months")! / 12) * 0.5 : 0;
  const cost = base ? base + finance + (n("land") ?? 0) : null;
  const net = gba ? gba * ((n("efficiency") ?? 100) / 100) : null;
  const revenue = mode === "sale" && net && n("sale") ? net * n("sale")! : null;
  const noi = mode === "rent" && net && n("rent") ? net * n("rent")! * 12 * (1 - (n("opex") ?? 0) / 100) : null;
  const value = mode === "sale" ? revenue : noi && n("yield") ? noi / (n("yield")! / 100) : null;
  const margin = value && cost ? value - cost : null;
  const roic = margin !== null && cost ? margin / cost : null;
  const annual = roic !== null && n("months") && value && cost && value > 0 ? Math.pow(value / cost, 12 / n("months")!) - 1 : null;

  const field = (key: Key, unit: string, hint?: string) => (
    <div className="lg-eco-tool__field">
      <label htmlFor={`${uid}-${key}`}>{t.f[key]}</label>
      <span className="lg-eco-tool__input">
        <input id={`${uid}-${key}`} type="text" inputMode="decimal" autoComplete="off" value={v[key] ?? ""} onChange={set(key)} aria-describedby={hint ? `${uid}-${key}-hint` : undefined} />
        <span aria-hidden="true">{unit}</span>
      </span>
      {hint ? <span className="lg-eco-tool__hint" id={`${uid}-${key}-hint`}>{hint}</span> : null}
    </div>
  );
  const eur = (x: number) => `${nf.format(Math.round(x))} €`;

  return (
    <div className="lg-eco-tool ld-calc">
      <p className="ld-calc__label">{t.label}</p>
      <p className="lg-eco-tool__sub">{t.sub}</p>
      <div className="lg-eco-tool__bar">
        <div className="lg-eco-tool__presets" role="group" aria-label={t.groups.exit}>
          {(["sale", "rent"] as const).map((key) => (
            <button key={key} type="button" aria-pressed={mode === key} className={mode === key ? "is-on" : undefined} onClick={() => setMode(key)}>{t.mode[key]}</button>
          ))}
        </div>
        <div className="lg-eco-tool__tools">
          <button type="button" className="lg-eco-tool__link" onClick={() => { setV({ ...blank, ...Object.fromEntries(Object.entries(SAMPLE).map(([k, x]) => [k, String(x)])) } as Record<Key, string>); setIsSample(true); }}>{t.sample}</button>
          <button type="button" className="lg-eco-tool__link is-quiet" onClick={() => { setV(blank); setIsSample(false); }}>{t.clear}</button>
        </div>
      </div>
      {isSample ? <p className="lg-eco-tool__example">{t.sampleNote}</p> : null}

      <div className="ld-calc__groups">
        <fieldset className="ld-calc__group">
          <legend>{t.groups.site}</legend>
          <div className="lg-eco-tool__grid">
            {field("area", t.u.m2)}
            {field("coverage", t.u.pct, t.hints.coverage)}
            {field("floors", "×", t.hints.floors)}
            {field("gba", t.u.m2, t.hints.gba)}
          </div>
        </fieldset>
        <fieldset className="ld-calc__group">
          <legend>{t.groups.cost}</legend>
          <div className="lg-eco-tool__grid">
            {field("build", t.u.eurm2)}
            {field("soft", t.u.pct)}
            {field("contingency", t.u.pct)}
            {field("months", t.u.months)}
            {field("finance", t.u.pct)}
            {field("land", t.u.eur)}
          </div>
        </fieldset>
        <fieldset className="ld-calc__group">
          <legend>{t.groups.exit} · {t.mode[mode]}</legend>
          <div className="lg-eco-tool__grid">
            {field("efficiency", t.u.pct)}
            {mode === "sale" ? field("sale", t.u.eurm2) : (
              <>
                {field("rent", t.u.eurm2m)}
                {field("opex", t.u.pct)}
                {field("yield", t.u.pct)}
              </>
            )}
          </div>
        </fieldset>
      </div>

      <div className="ld-calc__result" aria-live="polite">
        <p className="ld-calc__label">{t.label}</p>
        {cost && value ? (
          <dl className="lg-eco-tool__out ld-calc__out">
            <div><dt>{t.o.gba}</dt><dd>{gba ? `${nf.format(Math.round(gba))} ${t.u.m2}` : "—"}</dd></div>
            <div><dt>{t.o.cost}</dt><dd>{eur(cost)}</dd></div>
            <div><dt>{mode === "sale" ? t.o.revenue : t.o.noi}</dt><dd>{eur(mode === "sale" ? revenue ?? 0 : noi ?? 0)}</dd></div>
            <div><dt>{t.o.value}</dt><dd>{eur(value)}</dd></div>
            <div className="is-accent"><dt>{t.o.margin}</dt><dd>{margin !== null ? eur(margin) : "—"}</dd></div>
            <div><dt>{t.o.roic}</dt><dd>{roic !== null ? `${pf.format(roic * 100)} %` : "—"}</dd></div>
            <div><dt>{t.o.annual}</dt><dd>{annual !== null ? `${pf.format(annual * 100)} %` : "—"}</dd></div>
          </dl>
        ) : (
          <p className="lg-eco-tool__days">{t.empty}</p>
        )}
        <p className="lg-eco-tool__disclaimer">{t.disclaimer}</p>
      </div>
    </div>
  );
}
