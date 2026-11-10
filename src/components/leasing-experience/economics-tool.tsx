"use client";

import { useId, useMemo, useState, type ChangeEvent, type MouseEvent } from "react";
import { economicsCopy, type PresetKey } from "@/components/leasing-experience/economics-copy";
import type { EconomicsHandoff } from "@/components/leasing-experience/viewing-form";
import { isProductionEdition, type SiteLocale } from "@/lib/site-data";

/**
 * «ПРОВЕРИТЬ ЭКОНОМИКУ ТОЧКИ» (OWNER addendum "TENANT ECONOMICS & DECISION
 * TOOL", 2026-11-06) — a reverse calculation, never a profit forecast: from the
 * tenant's own ticket, revenue target and conversion to the sales and the
 * customer flow the model needs. Quick mode on top; the extended calculation
 * (fixed costs, launch CAPEX) behind a reveal; a thin sensitivity line for
 * conversion 5 / 10 / 15 / 20 %; a comparison with the location that names the
 * data class and never puts the two numbers side by side as a match.
 * No account, nothing stored, nothing sent: «Получить расчёт с презентацией
 * объекта» hands the lines to the viewing form on this page.
 */

export type TrafficSummary = { status: "MODELLED" | "MEASURED" | "VERIFIED"; pedestrians: string | null; vehicles: string | null; date: string | null } | null;
type Example = { ticket: number; revenue: number; conversion: number; days: number };

const presets: PresetKey[] = ["retail", "showroom", "services", "center"];
const num = (value: string) => {
  const n = Number(value.replace(/\s| /g, "").replace(",", "."));
  return Number.isFinite(n) && n > 0 ? n : null;
};

export function EconomicsTool({ locale, property, example, rates, traffic, visitLabel }: { locale: SiteLocale; property: string; example: Example; rates: number[]; traffic: TrafficSummary; /** the status of the unit decides the visit action (a RESERVED unit → the waitlist) */ visitLabel?: string }) {
  const t = economicsCopy[locale];
  const uid = useId();
  const nf = useMemo(() => new Intl.NumberFormat(locale === "ru" ? "ru-RU" : locale === "ro" ? "ro-RO" : "en-GB", { maximumFractionDigits: 0 }), [locale]);
  const f = (n: number) => nf.format(Math.round(n));

  const [preset, setPreset] = useState<PresetKey>("retail");
  const [isExample, setIsExample] = useState(false);
  const [v, setV] = useState<Record<string, string>>({ ticket: "", margin: "", revenue: "", conversion: "", days: String(example.days), rent: "", opex: "", payroll: "", utilities: "", marketing: "", other: "", capex: "", payback: "" });
  const [compare, setCompare] = useState(false);
  const p = t.presets[preset];

  const set = (key: string) => (event: ChangeEvent<HTMLInputElement>) => {
    setV((old) => ({ ...old, [key]: event.target.value }));
    setIsExample(false);
  };
  const loadExample = () => {
    setV((old) => ({ ...old, ticket: nf.format(example.ticket), revenue: nf.format(example.revenue), conversion: String(example.conversion), days: String(example.days) }));
    setIsExample(true);
  };
  const clear = () => {
    setV((old) => ({ ...old, ticket: "", margin: "", revenue: "", conversion: "" }));
    setIsExample(false);
    setCompare(false);
  };

  // quick mode (OWNER addendum §20): revenue / ticket → per month → per day → / conversion
  const ticket = num(v.ticket);
  const revenue = num(v.revenue);
  const conversion = num(v.conversion);
  const margin = num(v.margin);
  const days = num(v.days) ?? example.days;
  const perMonth = ticket && revenue ? revenue / ticket : null;
  const perDay = perMonth ? perMonth / days : null;
  const visitors = perDay && conversion ? perDay / (conversion / 100) : null;

  // extended (§22): fixed costs and the CAPEX recovery target → break-even and the flow the model needs
  const fixedKeys = ["rent", "opex", "payroll", "utilities", "marketing", "other"];
  const fixed = fixedKeys.reduce((sum, key) => sum + (num(v[key]) ?? 0), 0);
  const capexMonthly = num(v.capex) && num(v.payback) ? num(v.capex)! / num(v.payback)! : 0;
  const gross = fixed + capexMonthly;
  const m = margin ? margin / 100 : null;
  const beSales = m && ticket && fixed ? fixed / m / ticket : null;
  const needTx = m && ticket && gross ? gross / m / ticket / days : null;
  const needFlow = needTx && conversion ? needTx / (conversion / 100) : null;

  const handoff = (event: MouseEvent<HTMLButtonElement>) => {
    const detail: EconomicsHandoff = {
      business: p.label,
      lines: [
        ...(revenue ? [{ label: t.lines.revenue, value: `${f(revenue)} ${t.units.mdl}` }] : []),
        ...(ticket ? [{ label: t.lines.ticket, value: `${f(ticket)} ${t.units.mdl}` }] : []),
        ...(conversion ? [{ label: t.lines.conversion, value: `${conversion} ${t.units.pct}` }] : []),
        ...(visitors ? [{ label: t.lines.visitors, value: `${t.approx} ${f(visitors)} · ${p.visitors.toLowerCase()}` }] : []),
      ],
    };
    window.dispatchEvent(new CustomEvent("lg:economics", { detail }));
    (event.currentTarget.closest("dialog") as HTMLDialogElement | null)?.close();
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.requestAnimationFrame(() => document.getElementById("lg-form")?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" }));
  };

  const field = (key: string, label: string, unit: string, hint?: string) => (
    <div className="lg-eco-tool__field">
      <label htmlFor={`${uid}-${key}`}>{label}</label>
      <span className="lg-eco-tool__input">
        <input id={`${uid}-${key}`} type="text" inputMode="decimal" autoComplete="off" value={v[key]} onChange={set(key)} aria-describedby={hint ? `${uid}-${key}-hint` : undefined} />
        <span aria-hidden="true">{unit}</span>
      </span>
      {hint ? <span className="lg-eco-tool__hint" id={`${uid}-${key}-hint`}>{hint}</span> : null}
    </div>
  );

  return (
    <div className="lg-eco-tool">
      <p className="lg-eco-tool__sub">{t.sub}</p>
      <p className="lg-eco-tool__principle">{t.principle}</p>

      <div className="lg-eco-tool__bar">
        <div className="lg-eco-tool__presets" role="group" aria-label={t.presetsLabel}>
          {presets.map((key) => (
            <button key={key} type="button" aria-pressed={preset === key} className={preset === key ? "is-on" : undefined} onClick={() => setPreset(key)}>
              {t.presets[key].label}
            </button>
          ))}
        </div>
        <div className="lg-eco-tool__tools">
          <button type="button" className="lg-eco-tool__link" onClick={loadExample}>{t.example}</button>
          <button type="button" className="lg-eco-tool__link is-quiet" onClick={clear}>{t.clear}</button>
        </div>
      </div>
      {isExample ? <p className="lg-eco-tool__example">{t.exampleNote.replace("Moscova 20", property)}</p> : null}

      <div className="lg-eco-tool__grid">
        {field("ticket", t.inputs.ticket, t.units.mdl, p.ticket)}
        {field("margin", t.inputs.margin, t.units.pct)}
        {field("revenue", t.inputs.revenue, t.units.mdl)}
        {field("conversion", t.inputs.conversion, t.units.pct, p.conversion)}
      </div>

      <dl className="lg-eco-tool__out" aria-live="polite">
        <div>
          <dt>{t.outputs.perMonth}</dt>
          <dd>{perMonth ? f(perMonth) : "—"}</dd>
        </div>
        <div>
          <dt>{t.outputs.perDay}</dt>
          <dd>{perDay ? `${t.approx} ${f(perDay)}` : "—"}</dd>
        </div>
        <div className="is-accent">
          <dt>{p.visitors}</dt>
          <dd>{visitors ? `${t.approx} ${f(visitors)}` : "—"}</dd>
        </div>
      </dl>
      <p className="lg-eco-tool__days">{perMonth ? t.daysNote(days) : t.empty}</p>

      {perDay ? (
        <div className="lg-eco-tool__sens">
          <p className="lg-label">{t.sensitivity}</p>
          <ol>
            {rates.map((rate) => (
              <li key={rate} className={conversion === rate ? "is-on" : undefined}>
                <span>{rate} {t.units.pct}</span>
                <strong>{t.approx} {f(perDay / (rate / 100))}</strong>
                <em>{t.sensitivityUnit}</em>
              </li>
            ))}
          </ol>
        </div>
      ) : null}

      {visitors ? (
        <div className="lg-eco-tool__compare">
          <p className="lg-eco-tool__need">{t.need(f(visitors))}</p>
          {!compare ? (
            <button type="button" className="lg-eco-tool__link is-arrow" onClick={() => setCompare(true)} aria-expanded={false}>{t.compare} →</button>
          ) : (
            <div className="lg-eco-tool__location">
              {traffic && (traffic.pedestrians || traffic.vehicles) ? (
                <>
                  <p className="lg-label">{t.status[traffic.status]}{traffic.date ? ` · ${traffic.date}` : ""}</p>
                  <p className="lg-eco-tool__ranges">
                    {traffic.pedestrians ? <span><strong>{traffic.pedestrians}</strong> {t.figures.pedestrians}</span> : null}
                    {traffic.vehicles ? <span><strong>{traffic.vehicles}</strong> {t.figures.vehicles}</span> : null}
                  </p>
                  <p>{t.compareText(f(visitors))}</p>
                </>
              ) : (
                <p>{t.compareNone}</p>
              )}
              <a className="pm-link" href="#lg-form" data-intent="viewing"><span>{t.discuss}</span></a>
            </div>
          )}
        </div>
      ) : null}

      <details className="lg-eco-tool__adv">
        <summary>{t.advanced} →</summary>
        <div className="lg-eco-tool__grid is-adv">
          {field("days", t.adv.days, t.units.days)}
          {field("rent", t.adv.rent, t.units.mdl, t.rentHint)}
          {field("opex", t.adv.opex, t.units.mdl)}
          {field("payroll", t.adv.payroll, t.units.mdl)}
          {field("utilities", t.adv.utilities, t.units.mdl)}
          {field("marketing", t.adv.marketing, t.units.mdl)}
          {field("other", t.adv.other, t.units.mdl)}
          {field("capex", t.adv.capex, t.units.mdl)}
          {field("payback", t.adv.payback, t.units.months)}
        </div>
        {fixed || capexMonthly ? (
          m && ticket ? (
            <dl className="lg-eco-tool__advout">
              {beSales ? <div><dt>{t.advOut.beSales}</dt><dd>{f(beSales)}</dd></div> : null}
              {needTx ? <div><dt>{t.advOut.transactions}</dt><dd>{t.approx} {f(needTx)}</dd></div> : null}
              {needFlow ? <div><dt>{t.advOut.flow}</dt><dd>{t.approx} {f(needFlow)}</dd></div> : null}
              <div><dt>{t.advOut.gross}</dt><dd>{f(gross)} {t.units.mdl}</dd></div>
              {capexMonthly ? <div><dt>{t.advOut.capexTarget}</dt><dd>{f(capexMonthly)} {t.units.mdl}</dd></div> : null}
            </dl>
          ) : (
            <p className="lg-eco-tool__days">{t.needMargin}</p>
          )
        ) : null}
      </details>

      <div className="lg-eco-tool__close">
        <p className="lg-eco-tool__closing">{t.closing}</p>
        <p className="lg-eco-tool__disclaimer">{t.disclaimer}</p>
        <div className="lg-eco-tool__actions">
          {/* production has no form backend (DirectContact): the calculation is not handed to a form there */}
          {isProductionEdition ? null : <button type="button" className="btn" onClick={handoff}><span>{t.handoff}</span></button>}
          <a className="btn btn--ghost" href="#lg-form" data-intent="viewing"><span>{visitLabel ?? t.visit(property)}</span></a>
        </div>
      </div>
    </div>
  );
}
