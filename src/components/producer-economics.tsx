"use client";

import { useId, useMemo, useState } from "react";
import { NumberInput, numberOf, type NumberFormat } from "@/components/number-input";
import { calcProducer, producerExample, type ProducerInputs } from "@/lib/producer-retail-math";
import type { SiteLocale } from "@/lib/site-data";

/**
 * «ПРОДАЖИ ЧЕРЕЗ ТОРГОВУЮ СЕТЬ VS СОБСТВЕННЫЙ МАГАЗИН» — the UX prototype of the CFO model (OWNER «PRODUCER DIRECT RETAIL STRATEGY
 * R10», 2026-11-13, §04). OWNER PREVIEW ONLY: the route is internal (noindex, stripped from the production artifact by
 * scripts/package-production.mjs) until the methodology and the calculations are verified (docs/finance/PRODUCER_RETAIL_CFO_MODEL.md,
 * scripts/qa-producer-model.mjs). The existing Moscova 20 calculator is a different tool and is not touched.
 *
 * Five answers, each marked as PROFIT or CASH so the two are never blended: 01 the margin through the chain · 02 the store's
 * operating profit (and the company's incremental profit after cannibalisation) · 03 the change in working capital · 04 the
 * break-even revenue · 05 the payback. Every field is a NumberInput (canonical state, localized grouping while typing); an answer
 * appears only when its own inputs exist. Nothing is stored or sent.
 */

type Key = keyof ProducerInputs;
type Field = { key: Key; label: string; unit: string; hint?: string; format: NumberFormat };

const money: NumberFormat = { group: true, decimals: 2 };
const pct: NumberFormat = { group: false, decimals: 2, maxInt: 3 };
const days: NumberFormat = { group: false, decimals: 0, maxInt: 3 };
const monthsFmt: NumberFormat = { group: false, decimals: 0, maxInt: 2 };

const copy = {
  ru: {
    badge: "Прототип · методология на проверке · не опубликовано",
    title: "Продажи через торговую сеть vs Собственный магазин",
    lead: "Компактная модель для финансового директора производителя: пять ответов на ваших данных. Прибыль и деньги считаются раздельно.",
    principle: "Модель для первичной оценки. Не прогноз продаж и не финансовая, налоговая или инвестиционная рекомендация. MEGAPARC — собственник и арендодатель помещения, не оператор магазина.",
    example: "Пример производителя", reset: "Сбросить",
    exampleNote: "Пример: условный производитель — цифры не являются рыночными данными. Аренда — предварительный расчёт Moscova 20 без НДС, депозит — 3 месяца базовой аренды, к коммунальным услугам добавлено 15 % за администрирование и обслуживание инженерных сетей.",
    groups: ["Продукт и торговая сеть", "Собственный магазин", "Запуск"],
    m20: "Подставить предварительный расчёт Moscova 20",
    eur: "€", perMonth: "€ / мес", pctList: "% от прайса", pct: "%", pctYear: "% годовых", pctRevenue: "% выручки", pctUtilities: "% от коммунальных", daysUnit: "дней", monthsRent: "мес. аренды",
    fields: {
      chainShipments: ["Отгрузки в торговые сети, в месяц", "по отпускному прайсу, без НДС"],
      costRatio: ["Себестоимость продукции", ""],
      chainDiscounts: ["Скидки и промо в накладной", ""],
      chainBonuses: ["Ретро‑бонусы", "выплачиваются после накладной"],
      chainFees: ["Листинг, маркетинговые платежи, логистика", ""],
      chainDays: ["Отсрочка платежа сети", ""],
      costOfMoney: ["Стоимость денег", "ставка кредита или альтернативная доходность"],
      storeRevenue: ["Плановая выручка магазина, в месяц", "без НДС"],
      retailMarkup: ["Розничная цена выше прайса на", ""],
      rent: ["Аренда, в месяц", "базовая аренда, без НДС"],
      utilities: ["Коммунальные услуги", "по фактическим начислениям"],
      utilitiesFee: ["Администрирование и обслуживание инженерных сетей", "Moscova 20: 15 %"],
      staff: ["Персонал с налогами", ""],
      marketing: ["Маркетинг магазина", ""],
      opex: ["Прочие операционные расходы", "охрана, связь, касса и ПО, уборка, обслуживание, страхование"],
      acquiring: ["Эквайринг и кассовые расходы", ""],
      inventoryDays: ["Запас продукции для магазина", "в днях себестоимости"],
      cannibalisation: ["Каннибализация", "доля покупок магазина, которые иначе были бы сделаны в сети; 0 % — все продажи новые"],
      capex: ["Первоначальные инвестиции", "адаптация помещения, оборудование, вывеска — без запаса"],
      depositMonths: ["Гарантийный депозит", "Moscova 20: 3 месяца базовой аренды · возвращается"],
    } as Record<Key, [string, string]>,
    profit: "Прибыль", cash: "Деньги",
    q: [
      "Какую маржу вы получаете через торговую сеть?",
      "Какую операционную прибыль может дать собственный магазин?",
      "Как изменится оборотный капитал?",
      "Какой оборот нужен для безубыточности?",
      "Через какой срок окупятся вложения?",
    ],
    need: [
      "Нужны отгрузки, себестоимость, скидки и ретро‑бонусы.",
      "Нужны выручка, наценка, себестоимость и расходы магазина.",
      "Нужны запас в днях, отсрочка сети и каннибализация (0 %, если все продажи новые).",
      "Нужны выручка, наценка, себестоимость и расходы магазина.",
      "Нужны инвестиции, депозит, запас и каннибализация.",
    ],
    perMonthShort: "в месяц",
    chain: { pctNet: (v: string) => `${v} % чистой выручки`, kept: "Из 100 € прайса после скидок и бонусов остаётся", margin100: "Маржа на 100 € прайса после себестоимости", waiting: "Деньги в ожидании оплаты сети", delay: "Стоимость отсрочки — в маржу не входит" },
    store: { gross: "Валовая прибыль", fixed: "Постоянные расходы", acquiring: "Эквайринг", lost: "Маржа сети, которую заменяет магазин", incremental: "Прирост прибыли компании", per100: (price: string, margin: string) => `Товар на 100 € прайса продаётся в магазине за ${price} €; до постоянных расходов остаётся ${margin} €.` },
    wc: { tied: "связано", released: "высвобождается", inventory: "Запас магазина", receivables: "Из дебиторской задолженности сети", deposit: "Гарантийный депозит · возвращается", note: (d: string) => `Деньги магазина поступают в день продажи (эквайринг — 1–2 банковских дня); оплата сети — через ${d} дней.` },
    be: { store: "Безубыточность магазина", company: "С учётом каннибализации", safety: "Запас прочности плана", never: "не достигается при этой каннибализации" },
    pb: { months: (m: string) => `≈ ${m} мес.`, capex: "Окупаемость инвестиций", all: "Возврат всех денег старта", start: "Деньги на старте", none: "нет окупаемости при этом результате", note: "Депозит возвращается в конце аренды. Период выхода на плановую выручку удлиняет срок." },
    split: { title: "Прибыль и деньги — раздельно", profit: ["Прибыль магазина", "Минус маржа сети на заменённом объёме", "Прирост прибыли компании"], cash: ["Инвестиции", "Депозит", "Изменение оборотного капитала", "Деньги на старте"], monthly: "Ежемесячный денежный поток ≈ прирост прибыли (до налога, без амортизации)." },
    sens: { title: "Если выручка будет другой", revenue: "Выручка", operating: "Прибыль магазина", incremental: "Прирост прибыли компании", payback: "Возврат денег старта", plan: "план" },
    foot: ["Все суммы — в евро, без НДС, в установившемся месяце. Налог на прибыль, амортизация и проценты не учитываются; период выхода на плановую выручку не моделируется.", "Ставки, депозит и порядок коммунальных платежей Moscova 20 — в коммерческих условиях объекта; расчёт аренды предварительный."],
  },
  ro: {
    badge: "Prototip · metodologie în verificare · nepublicat",
    title: "Vânzări prin rețeaua comercială vs Magazin propriu",
    lead: "Un model compact pentru directorul financiar al producătorului: cinci răspunsuri pe datele dumneavoastră. Profitul și banii se calculează separat.",
    principle: "Model pentru o evaluare inițială. Nu este o prognoză a vânzărilor și nici o recomandare financiară, fiscală sau investițională. MEGAPARC este proprietarul și locatorul spațiului, nu operatorul magazinului.",
    example: "Exemplu de producător", reset: "Resetează",
    exampleNote: "Exemplu: un producător convențional — cifrele nu sunt date de piață. Chiria — calculul preliminar Moscova 20 fără TVA, garanția — 3 luni de chirie de bază, la utilități se adaugă 15 % pentru administrarea și întreținerea rețelelor inginerești.",
    groups: ["Produsul și rețeaua comercială", "Magazinul propriu", "Lansarea"],
    m20: "Introduceți calculul preliminar Moscova 20",
    eur: "€", perMonth: "€ / lună", pctList: "% din preț", pct: "%", pctYear: "% pe an", pctRevenue: "% din venituri", pctUtilities: "% din utilități", daysUnit: "zile", monthsRent: "luni de chirie",
    fields: {
      chainShipments: ["Livrări către rețele, pe lună", "la prețul de livrare, fără TVA"],
      costRatio: ["Costul produselor", ""],
      chainDiscounts: ["Reduceri și promoții pe factură", ""],
      chainBonuses: ["Bonusuri retroactive", "plătite după factură"],
      chainFees: ["Listare, plăți de marketing, logistică", ""],
      chainDays: ["Termenul de plată al rețelei", ""],
      costOfMoney: ["Costul banilor", "dobânda creditului sau randamentul alternativ"],
      storeRevenue: ["Venitul planificat al magazinului, pe lună", "fără TVA"],
      retailMarkup: ["Prețul cu amănuntul peste prețul de livrare cu", ""],
      rent: ["Chiria, pe lună", "chiria de bază, fără TVA"],
      utilities: ["Utilități", "la consumul efectiv"],
      utilitiesFee: ["Administrarea și întreținerea rețelelor inginerești", "Moscova 20: 15 %"],
      staff: ["Personal, cu taxe", ""],
      marketing: ["Marketingul magazinului", ""],
      opex: ["Alte cheltuieli operaționale", "pază, comunicații, casă și software, curățenie, întreținere, asigurare"],
      acquiring: ["Acquiring și cheltuieli de casă", ""],
      inventoryDays: ["Stoc de produse pentru magazin", "în zile de cost"],
      cannibalisation: ["Canibalizare", "partea cumpărăturilor din magazin care altfel s-ar fi făcut în rețea; 0 % — toate vânzările sunt noi"],
      capex: ["Investiția inițială", "adaptarea spațiului, echipamente, firmă — fără stoc"],
      depositMonths: ["Garanția locativă", "Moscova 20: 3 luni de chirie de bază · se restituie"],
    } as Record<Key, [string, string]>,
    profit: "Profit", cash: "Bani",
    q: [
      "Ce marjă obțineți prin rețeaua comercială?",
      "Ce profit operațional poate aduce magazinul propriu?",
      "Cum se schimbă capitalul de lucru?",
      "Ce rulaj este necesar pentru pragul de rentabilitate?",
      "În cât timp se recuperează investiția?",
    ],
    need: [
      "Sunt necesare livrările, costul, reducerile și bonusurile retroactive.",
      "Sunt necesare venitul, adaosul, costul și cheltuielile magazinului.",
      "Sunt necesare stocul în zile, termenul de plată și canibalizarea (0 %, dacă toate vânzările sunt noi).",
      "Sunt necesare venitul, adaosul, costul și cheltuielile magazinului.",
      "Sunt necesare investiția, garanția, stocul și canibalizarea.",
    ],
    perMonthShort: "pe lună",
    chain: { pctNet: (v: string) => `${v} % din venitul net`, kept: "Din 100 € de preț rămân după reduceri și bonusuri", margin100: "Marja la 100 € de preț după cost", waiting: "Bani care așteaptă plata rețelei", delay: "Costul amânării — nu intră în marjă" },
    store: { gross: "Profit brut", fixed: "Cheltuieli fixe", acquiring: "Acquiring", lost: "Marja rețelei înlocuită de magazin", incremental: "Creșterea profitului companiei", per100: (price: string, margin: string) => `Marfa de 100 € la prețul de livrare se vinde în magazin cu ${price} €; înainte de cheltuielile fixe rămân ${margin} €.` },
    wc: { tied: "imobilizat", released: "eliberat", inventory: "Stocul magazinului", receivables: "Din creanțele rețelei", deposit: "Garanția locativă · se restituie", note: (d: string) => `Banii magazinului vin în ziua vânzării (acquiring — 1–2 zile bancare); plata rețelei — după ${d} zile.` },
    be: { store: "Pragul de rentabilitate al magazinului", company: "Cu canibalizarea", safety: "Marja de siguranță a planului", never: "nu se atinge la această canibalizare" },
    pb: { months: (m: string) => `≈ ${m} luni`, capex: "Recuperarea investiției", all: "Recuperarea tuturor banilor de start", start: "Banii de start", none: "fără recuperare la acest rezultat", note: "Garanția se restituie la sfârșitul chiriei. Perioada până la venitul planificat prelungește termenul." },
    split: { title: "Profitul și banii — separat", profit: ["Profitul magazinului", "Minus marja rețelei pe volumul înlocuit", "Creșterea profitului companiei"], cash: ["Investiția", "Garanția", "Schimbarea capitalului de lucru", "Banii de start"], monthly: "Fluxul lunar de numerar ≈ creșterea profitului (înainte de impozit, fără amortizare)." },
    sens: { title: "Dacă venitul va fi altul", revenue: "Venit", operating: "Profitul magazinului", incremental: "Creșterea profitului companiei", payback: "Recuperarea banilor de start", plan: "plan" },
    foot: ["Toate sumele — în euro, fără TVA, într-o lună stabilă. Impozitul pe profit, amortizarea și dobânzile nu sunt incluse; perioada până la venitul planificat nu este modelată.", "Tarifele, garanția și regimul utilităților Moscova 20 — în condițiile comerciale ale obiectului; calculul chiriei este preliminar."],
  },
  en: {
    badge: "Prototype · methodology under review · not published",
    title: "Selling through a retail chain vs Your own store",
    lead: "A compact model for the manufacturer's CFO: five answers on your own figures. Profit and cash are calculated separately.",
    principle: "A model for a first assessment. Not a sales forecast and not financial, tax or investment advice. MEGAPARC is the owner and landlord of the premises, not the operator of the store.",
    example: "Example manufacturer", reset: "Reset",
    exampleNote: "Example: a notional manufacturer — the figures are not market data. Rent — the Moscova 20 preliminary calculation excl. VAT, deposit — 3 months of base rent, 15 % added to utilities for the administration and maintenance of the engineering networks.",
    groups: ["Product and retail chain", "Your own store", "Launch"],
    m20: "Insert the Moscova 20 preliminary calculation",
    eur: "€", perMonth: "€ / month", pctList: "% of list price", pct: "%", pctYear: "% a year", pctRevenue: "% of revenue", pctUtilities: "% of utilities", daysUnit: "days", monthsRent: "months of rent",
    fields: {
      chainShipments: ["Shipments to retail chains, per month", "at the list (supply) price, excl. VAT"],
      costRatio: ["Cost of goods", ""],
      chainDiscounts: ["On-invoice discounts and promotions", ""],
      chainBonuses: ["Retro-bonuses", "paid after the invoice"],
      chainFees: ["Listing, marketing payments, logistics", ""],
      chainDays: ["Chain payment term", ""],
      costOfMoney: ["Cost of money", "loan rate or alternative return"],
      storeRevenue: ["Planned store revenue, per month", "excl. VAT"],
      retailMarkup: ["Retail price above the list price by", ""],
      rent: ["Rent, per month", "base rent, excl. VAT"],
      utilities: ["Utilities", "at actual charges"],
      utilitiesFee: ["Administration and maintenance of the engineering networks", "Moscova 20: 15 %"],
      staff: ["Staff including payroll taxes", ""],
      marketing: ["Store marketing", ""],
      opex: ["Other operating costs", "security, telecoms, till and software, cleaning, maintenance, insurance"],
      acquiring: ["Card acquiring and till costs", ""],
      inventoryDays: ["Product stock for the store", "in days of cost of goods"],
      cannibalisation: ["Cannibalisation", "the share of store purchases that would otherwise be made in a chain; 0 % — every sale is new"],
      capex: ["Initial investment", "fit-out, equipment, signage — stock excluded"],
      depositMonths: ["Security deposit", "Moscova 20: 3 months of base rent · returned"],
    } as Record<Key, [string, string]>,
    profit: "Profit", cash: "Cash",
    q: [
      "What margin do you earn through the retail chain?",
      "What operating profit can your own store deliver?",
      "How does working capital change?",
      "What revenue is needed to break even?",
      "How long until the investment pays back?",
    ],
    need: [
      "Needs shipments, cost of goods, discounts and retro-bonuses.",
      "Needs revenue, markup, cost of goods and store costs.",
      "Needs stock in days, the chain payment term and cannibalisation (0 % if every sale is new).",
      "Needs revenue, markup, cost of goods and store costs.",
      "Needs the investment, the deposit, stock and cannibalisation.",
    ],
    perMonthShort: "a month",
    chain: { pctNet: (v: string) => `${v} % of net revenue`, kept: "Kept from €100 of list price after discounts and bonuses", margin100: "Margin on €100 of list price after cost", waiting: "Money waiting for the chain's payment", delay: "Cost of the delay — not in the margin" },
    store: { gross: "Gross profit", fixed: "Fixed costs", acquiring: "Acquiring", lost: "Chain margin the store replaces", incremental: "Company's incremental profit", per100: (price: string, margin: string) => `Goods worth €100 at list price sell in the store for €${price}; €${margin} remains before fixed costs.` },
    wc: { tied: "tied up", released: "released", inventory: "Store stock", receivables: "From the chain receivables", deposit: "Security deposit · returned", note: (d: string) => `Store money arrives on the day of sale (acquiring — 1–2 banking days); the chain pays after ${d} days.` },
    be: { store: "Store break-even", company: "After cannibalisation", safety: "Safety margin of the plan", never: "not reached at this cannibalisation" },
    pb: { months: (m: string) => `≈ ${m} months`, capex: "Investment payback", all: "Return of all start-up cash", start: "Cash at the start", none: "no payback at this result", note: "The deposit is returned at the end of the lease. A ramp-up to the planned revenue lengthens the period." },
    split: { title: "Profit and cash — kept apart", profit: ["Store profit", "Less the chain margin on the replaced volume", "Company's incremental profit"], cash: ["Investment", "Deposit", "Change in working capital", "Cash at the start"], monthly: "Monthly cash flow ≈ incremental profit (before tax, no depreciation)." },
    sens: { title: "If revenue turns out different", revenue: "Revenue", operating: "Store profit", incremental: "Company's incremental profit", payback: "Return of start-up cash", plan: "plan" },
    foot: ["All amounts in euros, excl. VAT, in a steady month. Income tax, depreciation and interest are not included; the ramp-up to planned revenue is not modelled.", "The Moscova 20 rates, deposit and utilities terms are in the property's commercial terms; the rent calculation is preliminary."],
  },
} as const;

type Copy = (typeof copy)[SiteLocale];

const blank = (): Record<Key, string> => ({
  chainShipments: "", costRatio: "", chainDiscounts: "", chainBonuses: "", chainFees: "", chainDays: "", costOfMoney: "",
  storeRevenue: "", retailMarkup: "", rent: "", utilities: "", utilitiesFee: "", opex: "", staff: "", marketing: "", acquiring: "",
  inventoryDays: "", cannibalisation: "", capex: "", depositMonths: "",
});
const fromExample = (): Record<Key, string> => Object.fromEntries(Object.entries(producerExample).map(([key, value]) => [key, value === null ? "" : String(value)])) as Record<Key, string>;

function Answer({ t, no, kind, ready, big, sub, rows, note }: { t: Copy; no: number; kind: "profit" | "cash"; ready: boolean; big: string; sub?: string; rows?: [string, string, string?][]; note?: string }) {
  return (
    <article className={`pe-answer is-${kind}${ready ? " is-ready" : ""}`}>
      <header className="pe-answer__head">
        <span className="pe-answer__no">{String(no).padStart(2, "0")}</span>
        <span className="pe-answer__kind">{kind === "profit" ? t.profit : t.cash}</span>
      </header>
      <h3 className="pe-answer__q">{t.q[no - 1]}</h3>
      <p className="pe-answer__big">{ready ? big : "—"}</p>
      {ready && sub ? <p className="pe-answer__sub">{sub}</p> : null}
      {ready && rows?.length ? (
        <dl className="pe-answer__rows">
          {rows.map(([label, value, tone]) => (
            <div key={label} className={tone ? `is-${tone}` : undefined}><dt>{label}</dt><dd>{value}</dd></div>
          ))}
        </dl>
      ) : null}
      {ready ? (note ? <p className="pe-answer__note">{note}</p> : null) : <p className="pe-answer__need">{t.need[no - 1]}</p>}
    </article>
  );
}

export function ProducerEconomics({ locale, m20 }: { locale: SiteLocale; /** the Moscova 20 preliminary rent and terms — inserted only on the visitor's request */ m20: { rent: number; depositMonths: number; feePercent: number } }) {
  const t = copy[locale];
  const uid = useId();
  const [v, setV] = useState<Record<Key, string>>(blank);
  const [isExample, setIsExample] = useState(false);
  const nf = useMemo(() => new Intl.NumberFormat(locale === "ru" ? "ru-RU" : locale === "ro" ? "ro-RO" : "en-GB", { maximumFractionDigits: 0 }), [locale]);
  const nf1 = useMemo(() => new Intl.NumberFormat(locale === "ru" ? "ru-RU" : locale === "ro" ? "ro-RO" : "en-GB", { maximumFractionDigits: 1, minimumFractionDigits: 0 }), [locale]);
  const num = (x: number) => nf.format(Math.round(Math.abs(x))).replace(/\s/g, " ");
  const eur = (x: number | null, sign = false) => {
    if (x === null) return "—";
    const s = x < 0 ? "−" : sign && x > 0 ? "+" : "";
    return locale === "en" ? `${s}€${num(x)}` : `${s}${num(x)} €`;
  };
  const p1 = (x: number | null) => (x === null ? "—" : `${x < 0 ? "−" : ""}${nf1.format(Math.abs(x))}`);
  const mo = (x: number | null) => (x === null ? null : nf.format(Math.round(x)));

  const inputs = Object.fromEntries((Object.keys(v) as Key[]).map((key) => [key, numberOf(v[key])])) as ProducerInputs;
  // percentages above 100 are not a share; the cost ratio must stay below the list price
  for (const key of ["costRatio", "chainDiscounts", "chainBonuses", "acquiring", "cannibalisation"] as Key[]) if ((inputs[key] ?? 0) > 100) inputs[key] = null;
  const r = calcProducer(inputs);

  const update = (key: Key) => (next: string) => { setV((old) => ({ ...old, [key]: next })); setIsExample(false); };
  const fields: Field[][] = [
    [
      { key: "chainShipments", label: t.fields.chainShipments[0], hint: t.fields.chainShipments[1], unit: t.perMonth, format: money },
      { key: "costRatio", label: t.fields.costRatio[0], unit: t.pctList, format: pct },
      { key: "chainDiscounts", label: t.fields.chainDiscounts[0], unit: t.pctList, format: pct },
      { key: "chainBonuses", label: t.fields.chainBonuses[0], hint: t.fields.chainBonuses[1], unit: t.pctList, format: pct },
      { key: "chainFees", label: t.fields.chainFees[0], unit: t.perMonth, format: money },
      { key: "chainDays", label: t.fields.chainDays[0], unit: t.daysUnit, format: days },
      { key: "costOfMoney", label: t.fields.costOfMoney[0], hint: t.fields.costOfMoney[1], unit: t.pctYear, format: pct },
    ],
    [
      { key: "storeRevenue", label: t.fields.storeRevenue[0], hint: t.fields.storeRevenue[1], unit: t.perMonth, format: money },
      { key: "retailMarkup", label: t.fields.retailMarkup[0], unit: t.pct, format: pct },
      { key: "rent", label: t.fields.rent[0], hint: t.fields.rent[1], unit: t.perMonth, format: money },
      { key: "utilities", label: t.fields.utilities[0], hint: t.fields.utilities[1], unit: t.perMonth, format: money },
      { key: "utilitiesFee", label: t.fields.utilitiesFee[0], hint: t.fields.utilitiesFee[1], unit: t.pctUtilities, format: pct },
      { key: "staff", label: t.fields.staff[0], unit: t.perMonth, format: money },
      { key: "marketing", label: t.fields.marketing[0], unit: t.perMonth, format: money },
      { key: "opex", label: t.fields.opex[0], hint: t.fields.opex[1], unit: t.perMonth, format: money },
      { key: "acquiring", label: t.fields.acquiring[0], unit: t.pctRevenue, format: pct },
      { key: "inventoryDays", label: t.fields.inventoryDays[0], hint: t.fields.inventoryDays[1], unit: t.daysUnit, format: days },
      { key: "cannibalisation", label: t.fields.cannibalisation[0], hint: t.fields.cannibalisation[1], unit: t.pct, format: pct },
    ],
    [
      { key: "capex", label: t.fields.capex[0], hint: t.fields.capex[1], unit: t.eur, format: money },
      { key: "depositMonths", label: t.fields.depositMonths[0], hint: t.fields.depositMonths[1], unit: t.monthsRent, format: monthsFmt },
    ],
  ];

  const field = (f: Field) => (
    <div className="pe-field" key={f.key}>
      <label className="pe-field__label" htmlFor={`${uid}-${f.key}`}>{f.label}</label>
      <span className="pe-field__control">
        <NumberInput className="pe-field__input" id={`${uid}-${f.key}`} value={v[f.key]} onValueChange={update(f.key)} locale={locale} format={f.format} describedBy={f.hint ? `${uid}-${f.key}-hint` : undefined} />
        <span className="pe-field__unit" aria-hidden="true">{f.unit}</span>
      </span>
      {f.hint ? <span className="pe-field__hint" id={`${uid}-${f.key}-hint`}>{f.hint}</span> : null}
      {f.key === "rent" ? (
        <button type="button" className="pe-link" onClick={() => { setV((old) => ({ ...old, rent: String(m20.rent), depositMonths: String(m20.depositMonths), utilitiesFee: String(m20.feePercent) })); setIsExample(false); }}>{t.m20}</button>
      ) : null}
    </div>
  );


  const ch = r.chain, st = r.store, cash = r.cash, be = r.breakEven, pb = r.payback;
  const wcReady = cash.workingCapital !== null;
  const beValue = be ? (be.company ?? (inputs.cannibalisation === null ? be.store : null)) : null;

  return (
    <div className="pe">
      <header className="pe__head">
        <p className="pe__badge">{t.badge}</p>
        <h1 className="pe__title">{t.title}</h1>
        <p className="pe__lead">{t.lead}</p>
        <p className="pe__principle">{t.principle}</p>
      </header>

      <div className="pe__tools">
        <button type="button" className="pe-link is-strong" onClick={() => { setV(fromExample()); setIsExample(true); }}>{t.example}</button>
        <button type="button" className="pe-link" onClick={() => { setV(blank()); setIsExample(false); }}>{t.reset}</button>
      </div>
      {isExample ? <p className="pe__example">{t.exampleNote}</p> : null}

      <div className="pe__body">
        <form className="pe__inputs" onSubmit={(event) => event.preventDefault()} aria-label={t.title}>
          {fields.map((group, i) => (
            <fieldset key={t.groups[i]} className="pe-group">
              <legend className="pe-group__legend"><span>{String(i + 1).padStart(2, "0")}</span>{t.groups[i]}</legend>
              <div className="pe-group__fields">{group.map(field)}</div>
            </fieldset>
          ))}
        </form>

        <div className="pe__results" aria-live="polite">
          <Answer t={t} no={1} kind="profit" ready={!!ch} big={ch ? `${eur(ch.margin)} ${t.perMonthShort}` : ""} sub={ch?.marginPct != null ? t.chain.pctNet(p1(ch.marginPct)) : undefined}
            rows={ch ? [[t.chain.kept, eur(ch.per100.net)], [t.chain.margin100, eur(ch.per100.margin)], ...(ch.receivables !== null ? [[t.chain.waiting, eur(ch.receivables), "cash"] as [string, string, string]] : []), ...(ch.delayCost !== null ? [[t.chain.delay, `${eur(ch.delayCost)} ${t.perMonthShort}`, "cash"] as [string, string, string]] : [])] : []} />
          <Answer t={t} no={2} kind="profit" ready={!!st} big={st ? `${eur(st.operating)} ${t.perMonthShort}` : ""}
            rows={st ? [[t.store.gross, `${eur(st.gross)} · ${p1(st.grossPct)} %`], [t.store.acquiring, eur(-st.variable)], [t.store.fixed, eur(-st.fixed)], ...(st.lostChain !== null ? [[t.store.lost, eur(-st.lostChain)] as [string, string]] : []), ...(st.incremental !== null ? [[t.store.incremental, `${eur(st.incremental)} ${t.perMonthShort}`, "total"] as [string, string, string]] : [])] : []}
            note={st ? t.store.per100(nf1.format(st.per100.price), nf1.format(st.per100.margin)) : undefined} />
          <Answer t={t} no={3} kind="cash" ready={wcReady} big={wcReady ? `${eur(cash.workingCapital, true)} · ${cash.workingCapital! >= 0 ? t.wc.tied : t.wc.released}` : ""}
            rows={wcReady ? [[t.wc.inventory, eur(cash.inventory, true)], [t.wc.receivables, eur(-(cash.releasedReceivables ?? 0))], ...(cash.deposit !== null ? [[t.wc.deposit, eur(cash.deposit, true)] as [string, string]] : [])] : []}
            note={wcReady && inputs.chainDays !== null ? t.wc.note(nf.format(inputs.chainDays)) : undefined} />
          <Answer t={t} no={4} kind="profit" ready={!!be && (be.store !== null || be.company !== null)} big={beValue !== null ? `${eur(beValue)} ${t.perMonthShort}` : t.be.never}
            rows={be ? [[t.be.store, be.store !== null ? eur(be.store) : "—"], [t.be.company, be.company !== null ? eur(be.company) : inputs.cannibalisation === null ? "—" : t.be.never], ...(be.safety !== null ? [[t.be.safety, `${p1(be.safety)} %`] as [string, string]] : [])] : []} />
          <Answer t={t} no={5} kind="cash" ready={!!pb} big={pb ? (pb.capex !== null ? t.pb.months(mo(pb.capex)!) : t.pb.none) : ""}
            rows={pb ? [[t.pb.start, eur(cash.startCash)], [t.pb.all, pb.allCash !== null ? t.pb.months(mo(pb.allCash)!) : t.pb.none]] : []}
            note={pb ? t.pb.note : undefined} />

          {st && st.incremental !== null && cash.startCash !== null ? (
            <section className="pe-split" aria-label={t.split.title}>
              <h3 className="pe-split__title">{t.split.title}</h3>
              <div className="pe-split__cols">
                <dl className="pe-split__col is-profit">
                  <p className="pe-split__kind">{t.profit} · {t.perMonthShort}</p>
                  <div><dt>{t.split.profit[0]}</dt><dd>{eur(st.operating)}</dd></div>
                  <div><dt>{t.split.profit[1]}</dt><dd>{eur(-(st.lostChain ?? 0))}</dd></div>
                  <div className="is-total"><dt>{t.split.profit[2]}</dt><dd>{eur(st.incremental)}</dd></div>
                </dl>
                <dl className="pe-split__col is-cash">
                  <p className="pe-split__kind">{t.cash}</p>
                  <div><dt>{t.split.cash[0]}</dt><dd>{eur(cash.capex)}</dd></div>
                  <div><dt>{t.split.cash[1]}</dt><dd>{eur(cash.deposit ?? 0)}</dd></div>
                  <div><dt>{t.split.cash[2]}</dt><dd>{eur(cash.workingCapital, true)}</dd></div>
                  <div className="is-total"><dt>{t.split.cash[3]}</dt><dd>{eur(cash.startCash)}</dd></div>
                </dl>
              </div>
              <p className="pe-split__note">{t.split.monthly}</p>
            </section>
          ) : null}

          {r.sensitivity.length && st?.incremental !== null ? (
            <section className="pe-sens" aria-label={t.sens.title}>
              <h3 className="pe-sens__title">{t.sens.title}</h3>
              <table className="pe-sens__table">
                <thead><tr><th scope="col">{t.sens.revenue}</th><th scope="col">{t.sens.operating}</th><th scope="col">{t.sens.incremental}</th><th scope="col">{t.sens.payback}</th></tr></thead>
                <tbody>
                  {r.sensitivity.map((row) => (
                    <tr key={row.factor} className={row.factor === 1 ? "is-plan" : undefined}>
                      <th scope="row">{eur(row.revenue)}<span>{row.factor === 1 ? t.sens.plan : `${row.factor > 1 ? "+" : "−"}${Math.round(Math.abs(row.factor - 1) * 100)} %`}</span></th>
                      <td className={row.operating < 0 ? "is-negative" : undefined}>{eur(row.operating)}</td>
                      <td className={row.incremental !== null && row.incremental < 0 ? "is-negative" : undefined}>{eur(row.incremental)}</td>
                      <td>{row.payback !== null ? t.pb.months(mo(row.payback)!) : "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          ) : null}
        </div>
      </div>

      <footer className="pe__foot">
        {t.foot.map((line) => <p key={line}>{line}</p>)}
      </footer>
    </div>
  );
}
