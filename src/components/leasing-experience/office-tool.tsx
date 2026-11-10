"use client";

import { useId, useMemo, useState, type ChangeEvent } from "react";
import type { SiteLocale } from "@/lib/site-data";

/**
 * TENANT SCENARIO · OFFICE (OWNER «LEASING TEMPLATE LOCK» §9, 2026-11-10) — the decision zone of a whole-building office
 * (Dacia 31): how much space the tenant's own team needs — workplaces × area per workplace + the shared part (meeting
 * rooms, reception, circulation). A calculation on the tenant's figures only: never a property characteristic, never an
 * offer of area (the area and timing of the building are given on request), no rent, no forecast. The example loads only
 * on request and is labelled «Пример расчёта». Same parts and classes as the economics tool.
 */

type Example = { people: number; perSeat: number; shared: number };

const copy = {
  ru: {
    sub: "Сценарий арендатора — расчёт на ваших данных.",
    principle: "Сколько площади нужно вашей команде: рабочие места × площадь на место + общая часть (переговорные, приёмная, коммуникации).",
    example: "Пример расчёта",
    clear: "Очистить",
    exampleNote: (property: string) => `Пример расчёта — условные цифры, не характеристика ${property} и не предложение площади.`,
    people: "Сотрудников в офисе",
    perSeat: "Площадь на рабочее место",
    shared: "Общая часть",
    sharedHint: "переговорные, приёмная, кухня, коридоры",
    units: { people: "чел.", m2: "м²", pct: "%" },
    workspace: "Рабочие места",
    common: "Общая часть",
    total: "Ориентировочная площадь для команды",
    approx: "≈",
    empty: "Введите численность команды и площадь на место — расчёт появится здесь.",
    closing: "Площадь и сроки {p} подтверждаем индивидуально, после просмотра.",
    disclaimer: "Это не характеристика здания и не предложение площади: расчёт показывает только потребность вашей команды.",
    visit: "Запросить просмотр",
  },
  ro: {
    sub: "Scenariul chiriașului — un calcul pe datele dumneavoastră.",
    principle: "De câtă suprafață are nevoie echipa dumneavoastră: locuri de muncă × suprafața pe loc + partea comună (săli de ședințe, recepție, circulații).",
    example: "Exemplu de calcul",
    clear: "Golește",
    exampleNote: (property: string) => `Exemplu de calcul — cifre convenționale, nu o caracteristică a ${property} și nu o ofertă de suprafață.`,
    people: "Angajați în birou",
    perSeat: "Suprafață pe loc de muncă",
    shared: "Partea comună",
    sharedHint: "săli de ședințe, recepție, bucătărie, coridoare",
    units: { people: "pers.", m2: "m²", pct: "%" },
    workspace: "Locuri de muncă",
    common: "Partea comună",
    total: "Suprafața orientativă pentru echipă",
    approx: "≈",
    empty: "Introduceți numărul de angajați și suprafața pe loc — calculul apare aici.",
    closing: "Suprafața și termenul la {p} se confirmă individual, după vizionare.",
    disclaimer: "Nu este o caracteristică a clădirii și nici o ofertă de suprafață: calculul arată doar nevoia echipei dumneavoastră.",
    visit: "Solicită o vizionare",
  },
  en: {
    sub: "Tenant scenario — a calculation on your own figures.",
    principle: "How much space your team needs: workplaces × area per workplace + the shared part (meeting rooms, reception, circulation).",
    example: "Sample calculation",
    clear: "Clear",
    exampleNote: (property: string) => `Sample calculation — illustrative figures, not a characteristic of ${property} and not an offer of area.`,
    people: "Staff in the office",
    perSeat: "Area per workplace",
    shared: "Shared part",
    sharedHint: "meeting rooms, reception, kitchen, corridors",
    units: { people: "people", m2: "m²", pct: "%" },
    workspace: "Workplaces",
    common: "Shared part",
    total: "Indicative area for the team",
    approx: "≈",
    empty: "Enter the team size and the area per workplace — the result appears here.",
    closing: "The area and timing at {p} are confirmed individually, after a viewing.",
    disclaimer: "Not a characteristic of the building and not an offer of area: the result shows only what your team needs.",
    visit: "Request a viewing",
  },
} as const;

const num = (value: string) => {
  const n = Number(value.replace(/[\s ]/g, "").replace(",", "."));
  return Number.isFinite(n) && n > 0 ? n : null;
};

export function OfficeTool({ locale, property, example, visitLabel }: { locale: SiteLocale; property: string; example: Example; visitLabel?: string }) {
  const t = copy[locale];
  const uid = useId();
  const nf = useMemo(() => new Intl.NumberFormat(locale === "ru" ? "ru-RU" : locale === "ro" ? "ro-RO" : "en-GB", { maximumFractionDigits: 0 }), [locale]);
  const f = (n: number) => nf.format(Math.round(n));
  const [v, setV] = useState<Record<"people" | "perSeat" | "shared", string>>({ people: "", perSeat: "", shared: "" });
  const [isExample, setIsExample] = useState(false);
  const set = (key: keyof typeof v) => (event: ChangeEvent<HTMLInputElement>) => {
    setV((old) => ({ ...old, [key]: event.target.value }));
    setIsExample(false);
  };

  const people = num(v.people);
  const perSeat = num(v.perSeat);
  const shared = num(v.shared) ?? 0;
  const workspace = people && perSeat ? people * perSeat : null;
  const common = workspace ? (workspace * shared) / 100 : null;
  const total = workspace ? workspace + (common ?? 0) : null;

  const field = (key: keyof typeof v, label: string, unit: string, hint?: string) => (
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
    <div className="lg-eco-tool lg-office-tool">
      <p className="lg-eco-tool__sub">{t.sub}</p>
      <p className="lg-eco-tool__principle">{t.principle}</p>
      <div className="lg-eco-tool__bar">
        <div className="lg-eco-tool__tools">
          <button type="button" className="lg-eco-tool__link" onClick={() => { setV({ people: String(example.people), perSeat: String(example.perSeat), shared: String(example.shared) }); setIsExample(true); }}>{t.example}</button>
          <button type="button" className="lg-eco-tool__link is-quiet" onClick={() => { setV({ people: "", perSeat: "", shared: "" }); setIsExample(false); }}>{t.clear}</button>
        </div>
      </div>
      {isExample ? <p className="lg-eco-tool__example">{t.exampleNote(property)}</p> : null}

      <div className="lg-eco-tool__grid">
        {field("people", t.people, t.units.people)}
        {field("perSeat", t.perSeat, t.units.m2)}
        {field("shared", t.shared, t.units.pct, t.sharedHint)}
      </div>

      <dl className="lg-eco-tool__out" aria-live="polite">
        <div>
          <dt>{t.workspace}</dt>
          <dd>{workspace ? `${f(workspace)} ${t.units.m2}` : "—"}</dd>
        </div>
        <div>
          <dt>{t.common}</dt>
          <dd>{common ? `${f(common)} ${t.units.m2}` : "—"}</dd>
        </div>
        <div className="is-accent">
          <dt>{t.total}</dt>
          <dd>{total ? `${t.approx} ${f(total)} ${t.units.m2}` : "—"}</dd>
        </div>
      </dl>
      {total ? null : <p className="lg-eco-tool__days">{t.empty}</p>}

      <div className="lg-eco-tool__close">
        <p className="lg-eco-tool__closing">{t.closing.replace("{p}", property)}</p>
        <p className="lg-eco-tool__disclaimer">{t.disclaimer}</p>
        <div className="lg-eco-tool__actions">
          <a className="btn" href="#lg-form" data-intent="viewing"><span>{visitLabel ?? t.visit}</span></a>
        </div>
      </div>
    </div>
  );
}
