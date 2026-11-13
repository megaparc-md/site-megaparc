"use client";

import { useId, useMemo, useState } from "react";
import { NumberInput, numberOf, type NumberFormat } from "@/components/number-input";
import { calcProducer, producerExample, scenarioShifts, type ProducerInputs } from "@/lib/producer-retail-math";
import type { SiteLocale } from "@/lib/site-data";

/**
 * «ТОРГОВАЯ СЕТЬ ИЛИ СОБСТВЕННЫЙ МАГАЗИН: ЧТО ВЫГОДНЕЕ ПРОИЗВОДИТЕЛЮ?» — the CFO calculator v2 (OWNER MASTER MANDATE «R10 RELEASE + BRAND
 * ICON + PRODUCER ECONOMICS + LEASING GROWTH», 2026-11-13, §3). OWNER PREVIEW ONLY until the methodology is verified (Release B):
 * internal route, aliased to an empty stub in the production edition (next.config.ts), stripped by scripts/package-production.mjs.
 *
 * Two scenarios on screen — A · retail chains, B · the own store — on the same result rows; then «what changes for the company»
 * (after cannibalisation), the pessimistic / realistic / optimistic switch, a plain comparison bar and a neutral management
 * conclusion generated from the results. Every field is a NumberInput (thousands and millions grouped while typing). Specification:
 * docs/finance/PRODUCER_RETAIL_CFO_MODEL_V2_SPEC.md. Nothing is stored or sent. The Moscova 20 Quick / Advanced calculator is untouched.
 */

type Key = keyof ProducerInputs;
type Scenario = keyof typeof scenarioShifts;
type Field = { key: Key; label: string; unit: string; hint?: string; format: NumberFormat };

const money: NumberFormat = { group: true, decimals: 2 };
const units: NumberFormat = { group: true, decimals: 0 };
const pct: NumberFormat = { group: false, decimals: 2, maxInt: 3 };
const whole: NumberFormat = { group: false, decimals: 0, maxInt: 3 };

const copy = {
  ru: {
    badge: "Прототип · методология на проверке · не опубликовано",
    title: "Торговая сеть или собственный магазин: что выгоднее производителю?",
    lead: "Два канала на одних и тех же строках результата и итог для компании после каннибализации. Прибыль и деньги считаются раздельно; ни один канал не выгоднее заранее.",
    principle: "Модель для первичной оценки, не прогноз продаж и не финансовая, налоговая или инвестиционная рекомендация. MEGAPARC — собственник и арендодатель помещения, не оператор магазина.",
    example: "Пример производителя", reset: "Сбросить", m20: "Подставить предварительный расчёт Moscova 20",
    exampleNote: "Пример: условный производитель — цифры не являются рыночными данными. Аренда — предварительный расчёт Moscova 20 без НДС, депозит — 3 месяца базовой аренды, к коммунальным услугам добавлено 15 % за администрирование и обслуживание инженерных сетей.",
    scenarios: { pessimistic: "Пессимистичный", realistic: "Реалистичный", optimistic: "Оптимистичный" } as Record<Scenario, string>,
    scenarioNote: (b: string, g: string) => `Покупателей в день × ${b}; каннибализация ${g}.`,
    a: "А · Торговая сеть", b: "Б · Собственный магазин", launch: "Запуск",
    u: { eur: "€", eurMonth: "€ / мес", eurUnit: "€ / шт.", unitsMonth: "шт. / мес", pctList: "% от прайса", pct: "%", pctYear: "% годовых", pctRev: "% выручки", pctCogs: "% себестоимости", pctUtil: "% от коммунальных", days: "дней", perDay: "в день", monthsRent: "мес. аренды" },
    f: {
      chainUnits: ["Объём продаж через сети", ""], chainPrice: ["Отпускная цена", "без НДС"], unitCost: ["Себестоимость единицы", "переменная, одна для обоих каналов"],
      chainDiscounts: ["Скидки в накладной", ""], chainBonuses: ["Ретро‑бонусы", ""], chainFees: ["Маркетинговые и листинговые платежи", ""],
      chainLogistics: ["Логистика до сети", ""], chainDays: ["Отсрочка оплаты", ""], costOfMoney: ["Стоимость денег", "ставка кредита или альтернативная доходность"],
      retailPrice: ["Розничная цена", "без НДС (цена с НДС ÷ 1,2)"], buyersPerDay: ["Покупателей в день", "план"], ticket: ["Средний чек", "без НДС (чек с НДС ÷ 1,2)"], openDays: ["Дней работы в месяце", ""],
      rent: ["Аренда", "базовая, без НДС"], utilities: ["Коммунальные услуги", "по фактическим начислениям"], utilitiesFee: ["Администрирование и обслуживание инженерных сетей", "Moscova 20: 15 %"],
      staff: ["Зарплаты с налогами", ""], marketing: ["Маркетинг магазина", ""], acquiring: ["Эквайринг", ""], losses: ["Потери и списания", ""],
      opex: ["Прочие операционные расходы", "охрана, связь, касса и ПО, уборка, страхование"], storeLogistics: ["Логистика до магазина", "доставка собственной продукции, в месяц"], inventoryDays: ["Товарный запас", "в днях себестоимости"],
      cannibalisation: ["Каннибализация", "доля продаж магазина, которую иначе купили бы в сети"], capex: ["Первоначальные инвестиции", "адаптация, оборудование, вывеска"], depositMonths: ["Гарантийный депозит", "Moscova 20: 3 · возвращается"],
    } as Record<Key, [string, string]>,
    rows: { revenue: "Выручка без НДС", gross: "Валовая прибыль", ebitda: "EBITDA", margin: "EBITDA margin", breakEven: "Точка безубыточности", buyers: "Покупателей в день для безубыточности", cash: "Операционный денежный поток", wc: "Потребность в оборотном капитале", payback: "Простая окупаемость (установившийся месяц)" }, noCann: "без учёта каннибализации",
    beUnits: (v: string) => `${v} шт. / мес`, beRevenue: (v: string) => `${v} выручки`, perMonth: "в месяц", months: (m: string) => `≈ ${m} мес.`, none: "нет окупаемости", na: "—",
    wcA: "дебиторская задолженность", wcB: "запас", deposit: "Депозит (возвращается)", delay: "Стоимость отсрочки сети — в EBITDA не входит",
    company: { title: "Что меняется для компании", lost: "Вклад сети, который заменяет магазин", incremental: "Прирост EBITDA компании", released: "Позже высвобождается из дебиторки сети", start: "Деньги на старте: инвестиции, депозит, запас", payback: "Простая окупаемость", buyers: "Безубыточность компании", plan: (p: string, s: string) => `план ${p} в день · запас прочности ${s}` },
    bar: { a: "EBITDA сети", b: "EBITDA магазина", lost: "− вклад сети", delta: "Прирост компании" },
    table: { title: "Три сценария", buyers: "Покупателей в день", delta: "Прирост EBITDA", payback: "Окупаемость" },
    need: { a: "Для канала А нужны объём, отпускная цена, себестоимость, скидки и ретро‑бонусы.", b: "Для канала Б нужны розничная цена, покупатели в день, средний чек, дни работы, себестоимость и расходы магазина.", c: "Для итога компании нужны каннибализация (0 %, если все продажи новые), инвестиции и запас." },
    conclusion: "Вывод",
    verdict: {
      positive: (d: string, p: string, be: string, plan: string) => `При заданных предположениях собственный магазин добавляет компании ≈ ${d} EBITDA в месяц после каннибализации; деньги старта возвращаются за ≈ ${p} мес. Безубыточность — ${be} покупателей в день при плане ${plan}.`,
      slow: (d: string, p: string) => `Магазин прибылен (≈ ${d} в месяц после каннибализации), но деньги старта возвращаются медленно — ≈ ${p} мес. Решение зависит от стратегической ценности прямого канала.`,
      negative: (be: string, plan: string) => `При заданных предположениях собственный магазин не окупается: после каннибализации и расходов точки компания теряет EBITDA. Безубыточность — ${be} покупателей в день при плане ${plan}.`,
      never: "При заданной марже и каннибализации магазин не выходит на безубыточность ни при каком потоке покупателей.",
      pessimistic: (p: string) => `В пессимистичном сценарии: ${p}.`,
    },
    foot: ["Все суммы — в евро, без НДС, в установившемся месяце; налог на прибыль, амортизация и проценты не учитываются; период выхода на плановый поток не моделируется.", "Ставки, депозит и порядок коммунальных платежей Moscova 20 — в коммерческих условиях объекта; расчёт аренды предварительный."],
  },
  ro: {
    badge: "Prototip · metodologie în verificare · nepublicat",
    title: "Rețeaua comercială sau magazinul propriu: ce este mai avantajos pentru producător?",
    lead: "Două canale pe aceleași rânduri de rezultat și efectul pentru companie după canibalizare. Profitul și banii se calculează separat; niciun canal nu este avantajos dinainte.",
    principle: "Model pentru o evaluare inițială, nu o prognoză a vânzărilor și nici o recomandare financiară, fiscală sau investițională. MEGAPARC este proprietarul și locatorul spațiului, nu operatorul magazinului.",
    example: "Exemplu de producător", reset: "Resetează", m20: "Introduceți calculul preliminar Moscova 20",
    exampleNote: "Exemplu: un producător convențional — cifrele nu sunt date de piață. Chiria — calculul preliminar Moscova 20 fără TVA, garanția — 3 luni de chirie de bază, la utilități se adaugă 15 % pentru administrarea și întreținerea rețelelor inginerești.",
    scenarios: { pessimistic: "Pesimist", realistic: "Realist", optimistic: "Optimist" } as Record<Scenario, string>,
    scenarioNote: (b: string, g: string) => `Cumpărători pe zi × ${b}; canibalizare ${g}.`,
    a: "A · Rețeaua comercială", b: "B · Magazinul propriu", launch: "Lansarea",
    u: { eur: "€", eurMonth: "€ / lună", eurUnit: "€ / buc.", unitsMonth: "buc. / lună", pctList: "% din preț", pct: "%", pctYear: "% pe an", pctRev: "% din venit", pctCogs: "% din cost", pctUtil: "% din utilități", days: "zile", perDay: "pe zi", monthsRent: "luni de chirie" },
    f: {
      chainUnits: ["Volumul vânzărilor prin rețele", ""], chainPrice: ["Prețul de livrare", "fără TVA"], unitCost: ["Costul unitar", "variabil, același pentru ambele canale"],
      chainDiscounts: ["Reduceri pe factură", ""], chainBonuses: ["Bonusuri retroactive", ""], chainFees: ["Plăți de marketing și listare", ""],
      chainLogistics: ["Logistica până la rețea", ""], chainDays: ["Termenul de plată", ""], costOfMoney: ["Costul banilor", "dobânda creditului sau randamentul alternativ"],
      retailPrice: ["Prețul cu amănuntul", "fără TVA (prețul cu TVA ÷ 1,2)"], buyersPerDay: ["Cumpărători pe zi", "plan"], ticket: ["Bonul mediu", "fără TVA (bonul cu TVA ÷ 1,2)"], openDays: ["Zile de lucru pe lună", ""],
      rent: ["Chiria", "de bază, fără TVA"], utilities: ["Utilități", "la consumul efectiv"], utilitiesFee: ["Administrarea și întreținerea rețelelor inginerești", "Moscova 20: 15 %"],
      staff: ["Salarii cu taxe", ""], marketing: ["Marketingul magazinului", ""], acquiring: ["Acquiring", ""], losses: ["Pierderi și casări", ""],
      opex: ["Alte cheltuieli operaționale", "pază, comunicații, casă și software, curățenie, asigurare"], storeLogistics: ["Logistica până la magazin", "livrarea producției proprii, pe lună"], inventoryDays: ["Stoc de mărfuri", "în zile de cost"],
      cannibalisation: ["Canibalizare", "partea vânzărilor magazinului care altfel s-ar fi făcut în rețea"], capex: ["Investiția inițială", "adaptare, echipamente, firmă"], depositMonths: ["Garanția locativă", "Moscova 20: 3 · se restituie"],
    } as Record<Key, [string, string]>,
    rows: { revenue: "Venit fără TVA", gross: "Profit brut", ebitda: "EBITDA", margin: "Marja EBITDA", breakEven: "Pragul de rentabilitate", buyers: "Cumpărători pe zi pentru prag", cash: "Flux de numerar operațional", wc: "Necesar de capital de lucru", payback: "Recuperare simplă (lună stabilă)" }, noCann: "fără canibalizare",
    beUnits: (v: string) => `${v} buc. / lună`, beRevenue: (v: string) => `${v} venit`, perMonth: "pe lună", months: (m: string) => `≈ ${m} luni`, none: "fără recuperare", na: "—",
    wcA: "creanțe", wcB: "stoc", deposit: "Garanția (se restituie)", delay: "Costul amânării rețelei — nu intră în EBITDA",
    company: { title: "Ce se schimbă pentru companie", lost: "Contribuția rețelei înlocuită de magazin", incremental: "Creșterea EBITDA a companiei", released: "Se eliberează ulterior din creanțele rețelei", start: "Banii de start: investiție, garanție, stoc", payback: "Recuperare simplă", buyers: "Pragul companiei", plan: (p: string, s: string) => `plan ${p} pe zi · marjă de siguranță ${s}` },
    bar: { a: "EBITDA rețea", b: "EBITDA magazin", lost: "− contribuția rețelei", delta: "Creșterea companiei" },
    table: { title: "Trei scenarii", buyers: "Cumpărători pe zi", delta: "Creșterea EBITDA", payback: "Recuperare" },
    need: { a: "Pentru canalul A sunt necesare volumul, prețul de livrare, costul, reducerile și bonusurile.", b: "Pentru canalul B sunt necesare prețul cu amănuntul, cumpărătorii pe zi, bonul mediu, zilele de lucru, costul și cheltuielile magazinului.", c: "Pentru efectul asupra companiei sunt necesare canibalizarea (0 %, dacă toate vânzările sunt noi), investiția și stocul." },
    conclusion: "Concluzie",
    verdict: {
      positive: (d: string, p: string, be: string, plan: string) => `În ipotezele date, magazinul propriu adaugă companiei ≈ ${d} EBITDA pe lună după canibalizare; banii de start se recuperează în ≈ ${p} luni. Pragul — ${be} cumpărători pe zi față de planul de ${plan}.`,
      slow: (d: string, p: string) => `Magazinul este profitabil (≈ ${d} pe lună după canibalizare), dar banii de start se recuperează lent — ≈ ${p} luni. Decizia depinde de valoarea strategică a canalului direct.`,
      negative: (be: string, plan: string) => `În ipotezele date, magazinul propriu nu se recuperează: după canibalizare și costurile punctului, compania pierde EBITDA. Pragul — ${be} cumpărători pe zi față de planul de ${plan}.`,
      never: "La marja și canibalizarea date, magazinul nu atinge pragul de rentabilitate la niciun flux de cumpărători.",
      pessimistic: (p: string) => `În scenariul pesimist: ${p}.`,
    },
    foot: ["Toate sumele — în euro, fără TVA, într-o lună stabilă; impozitul pe profit, amortizarea și dobânzile nu sunt incluse; perioada până la fluxul planificat nu este modelată.", "Tarifele, garanția și regimul utilităților Moscova 20 — în condițiile comerciale ale obiectului; calculul chiriei este preliminar."],
  },
  en: {
    badge: "Prototype · methodology under review · not published",
    title: "Retail chain or your own store: which pays the manufacturer more?",
    lead: "Both channels on the same result rows, and the effect on the company after cannibalisation. Profit and cash are calculated separately; neither channel wins in advance.",
    principle: "A model for a first assessment — not a sales forecast and not financial, tax or investment advice. MEGAPARC is the owner and landlord of the premises, not the operator of the store.",
    example: "Example manufacturer", reset: "Reset", m20: "Insert the Moscova 20 preliminary calculation",
    exampleNote: "Example: a notional manufacturer — the figures are not market data. Rent — the Moscova 20 preliminary calculation excl. VAT, deposit — 3 months of base rent, 15 % added to utilities for the administration and maintenance of the engineering networks.",
    scenarios: { pessimistic: "Pessimistic", realistic: "Realistic", optimistic: "Optimistic" } as Record<Scenario, string>,
    scenarioNote: (b: string, g: string) => `Buyers a day × ${b}; cannibalisation ${g}.`,
    a: "A · Retail chain", b: "B · Your own store", launch: "Launch",
    u: { eur: "€", eurMonth: "€ / month", eurUnit: "€ / unit", unitsMonth: "units / month", pctList: "% of list", pct: "%", pctYear: "% a year", pctRev: "% of revenue", pctCogs: "% of cost of goods", pctUtil: "% of utilities", days: "days", perDay: "a day", monthsRent: "months of rent" },
    f: {
      chainUnits: ["Units sold through chains", ""], chainPrice: ["List (supply) price", "excl. VAT"], unitCost: ["Unit production cost", "variable, the same in both channels"],
      chainDiscounts: ["On-invoice discounts", ""], chainBonuses: ["Retro-bonuses", ""], chainFees: ["Marketing and listing payments", ""],
      chainLogistics: ["Logistics to the chain", ""], chainDays: ["Payment term", ""], costOfMoney: ["Cost of money", "loan rate or alternative return"],
      retailPrice: ["Retail price", "excl. VAT (a price with VAT ÷ 1.2)"], buyersPerDay: ["Buyers a day", "plan"], ticket: ["Average ticket", "excl. VAT (a ticket with VAT ÷ 1.2)"], openDays: ["Trading days a month", ""],
      rent: ["Rent", "base, excl. VAT"], utilities: ["Utilities", "at actual charges"], utilitiesFee: ["Administration and maintenance of the engineering networks", "Moscova 20: 15 %"],
      staff: ["Salaries with taxes", ""], marketing: ["Store marketing", ""], acquiring: ["Card acquiring", ""], losses: ["Losses and write-offs", ""],
      opex: ["Other operating costs", "security, telecoms, till and software, cleaning, insurance"], storeLogistics: ["Logistics to the store", "deliveries of your own products, per month"], inventoryDays: ["Stock", "in days of cost of goods"],
      cannibalisation: ["Cannibalisation", "share of store sales that would otherwise be bought in a chain"], capex: ["Initial investment", "fit-out, equipment, signage"], depositMonths: ["Security deposit", "Moscova 20: 3 · returned"],
    } as Record<Key, [string, string]>,
    rows: { revenue: "Revenue excl. VAT", gross: "Gross profit", ebitda: "EBITDA", margin: "EBITDA margin", breakEven: "Break-even", buyers: "Buyers a day to break even", cash: "Operating cash flow", wc: "Working capital need", payback: "Simple payback (steady month)" }, noCann: "before cannibalisation",
    beUnits: (v: string) => `${v} units / month`, beRevenue: (v: string) => `${v} revenue`, perMonth: "a month", months: (m: string) => `≈ ${m} months`, none: "no payback", na: "—",
    wcA: "receivables", wcB: "stock", deposit: "Deposit (returned)", delay: "Cost of the chain's payment term — not in EBITDA",
    company: { title: "What changes for the company", lost: "Chain contribution the store replaces", incremental: "Company's incremental EBITDA", released: "Released later from chain receivables", start: "Start-up cash: investment, deposit, stock", payback: "Simple payback", buyers: "Company break-even", plan: (p: string, s: string) => `plan ${p} a day · safety margin ${s}` },
    bar: { a: "Chain EBITDA", b: "Store EBITDA", lost: "− chain contribution", delta: "Company gain" },
    table: { title: "Three scenarios", buyers: "Buyers a day", delta: "Incremental EBITDA", payback: "Payback" },
    need: { a: "Channel A needs units, list price, unit cost, discounts and retro-bonuses.", b: "Channel B needs the retail price, buyers a day, average ticket, trading days, unit cost and store costs.", c: "The company view needs cannibalisation (0 % if every sale is new), the investment and the stock." },
    conclusion: "Conclusion",
    verdict: {
      positive: (d: string, p: string, be: string, plan: string) => `On these assumptions the own store adds ≈ ${d} of EBITDA a month to the company after cannibalisation; the start-up cash returns in ≈ ${p} months. Break-even is ${be} buyers a day against a plan of ${plan}.`,
      slow: (d: string, p: string) => `The store is profitable (≈ ${d} a month after cannibalisation), but the start-up cash returns slowly — ≈ ${p} months. The decision depends on the strategic value of the direct channel.`,
      negative: (be: string, plan: string) => `On these assumptions the own store does not pay back: after cannibalisation and the outlet's costs the company loses EBITDA. Break-even is ${be} buyers a day against a plan of ${plan}.`,
      never: "At this margin and cannibalisation the store never breaks even, whatever the footfall.",
      pessimistic: (p: string) => `In the pessimistic scenario: ${p}.`,
    },
    foot: ["All amounts in euros, excl. VAT, in a steady month; income tax, depreciation and interest are not included; the ramp-up to planned footfall is not modelled.", "The Moscova 20 rates, deposit and utilities terms are in the property's commercial terms; the rent calculation is preliminary."],
  },
} as const;

type Copy = (typeof copy)[SiteLocale];
const KEYS = Object.keys(producerExample) as Key[];
const blank = () => Object.fromEntries(KEYS.map((k) => [k, ""])) as Record<Key, string>;
const fromExample = () => Object.fromEntries(KEYS.map((k) => [k, producerExample[k] === null ? "" : String(producerExample[k])])) as Record<Key, string>;

export function ProducerEconomics({ locale, m20 }: { locale: SiteLocale; m20: { rent: number; depositMonths: number; feePercent: number } }) {
  const t: Copy = copy[locale];
  const uid = useId();
  const [v, setV] = useState<Record<Key, string>>(blank);
  const [isExample, setIsExample] = useState(false);
  const [scenario, setScenario] = useState<Scenario>("realistic");
  const tag = locale === "ru" ? "ru-RU" : locale === "ro" ? "ro-RO" : "en-GB";
  const nf = useMemo(() => new Intl.NumberFormat(tag, { maximumFractionDigits: 0 }), [tag]);
  const nf1 = useMemo(() => new Intl.NumberFormat(tag, { maximumFractionDigits: 1 }), [tag]);
  const n0 = (x: number) => nf.format(Math.round(Math.abs(x))).replace(/\s/g, " ");
  const eur = (x: number | null) => (x === null ? t.na : locale === "en" ? `${x < 0 ? "−" : ""}€${n0(x)}` : `${x < 0 ? "−" : ""}${n0(x)} €`);
  const share = (x: number | null) => (x === null ? t.na : `${x < 0 ? "−" : ""}${nf1.format(Math.abs(x * 100))} %`);
  const mo = (x: number | null) => (x === null ? t.none : t.months(nf.format(Math.round(x))));
  const count = (x: number | null) => (x === null ? t.na : nf.format(Math.ceil(x)));

  const inputs = Object.fromEntries(KEYS.map((k) => [k, numberOf(v[k])])) as ProducerInputs;
  for (const k of ["chainDiscounts", "chainBonuses", "chainLogistics", "acquiring", "losses", "cannibalisation"] as Key[]) if ((inputs[k] ?? 0) > 100) inputs[k] = null;
  const shift = scenarioShifts[scenario];
  const r = calcProducer(inputs, shift);
  const all = (Object.keys(scenarioShifts) as Scenario[]).map((s) => ({ s, r: calcProducer(inputs, scenarioShifts[s]) }));
  const { chain: A, store: B, company: C } = r;

  const update = (k: Key) => (next: string) => { setV((old) => ({ ...old, [k]: next })); setIsExample(false); };
  const field = (f: Field) => (
    <div className="pe-field" key={f.key}>
      <label className="pe-field__label" htmlFor={`${uid}-${f.key}`}>{f.label}</label>
      <span className="pe-field__control">
        <NumberInput className="pe-field__input" id={`${uid}-${f.key}`} value={v[f.key]} onValueChange={update(f.key)} locale={locale} format={f.format} describedBy={f.hint ? `${uid}-${f.key}-hint` : undefined} />
        <span className="pe-field__unit" aria-hidden="true">{f.unit}</span>
      </span>
      {f.hint ? <span className="pe-field__hint" id={`${uid}-${f.key}-hint`}>{f.hint}</span> : null}
      {f.key === "rent" ? <button type="button" className="pe-link" onClick={() => { setV((old) => ({ ...old, rent: String(m20.rent), depositMonths: String(m20.depositMonths), utilitiesFee: String(m20.feePercent) })); setIsExample(false); }}>{t.m20}</button> : null}
    </div>
  );
  const F = (key: Key, unit: string, format: NumberFormat): Field => ({ key, label: t.f[key][0], hint: t.f[key][1] || undefined, unit, format });
  const groupA: Field[] = [F("chainUnits", t.u.unitsMonth, units), F("chainPrice", t.u.eurUnit, money), F("unitCost", t.u.eurUnit, money), F("chainDiscounts", t.u.pctList, pct), F("chainBonuses", t.u.pctList, pct), F("chainFees", t.u.eurMonth, money), F("chainLogistics", t.u.pctList, pct), F("chainDays", t.u.days, whole), F("costOfMoney", t.u.pctYear, pct)];
  const groupB: Field[] = [F("retailPrice", t.u.eurUnit, money), F("buyersPerDay", t.u.perDay, units), F("ticket", t.u.eur, money), F("openDays", t.u.days, whole), F("rent", t.u.eurMonth, money), F("utilities", t.u.eurMonth, money), F("utilitiesFee", t.u.pctUtil, pct), F("staff", t.u.eurMonth, money), F("marketing", t.u.eurMonth, money), F("acquiring", t.u.pctRev, pct), F("losses", t.u.pctCogs, pct), F("opex", t.u.eurMonth, money), F("storeLogistics", t.u.eurMonth, money), F("inventoryDays", t.u.days, whole), F("cannibalisation", t.u.pct, pct)];
  const groupL: Field[] = [F("capex", t.u.eur, money), F("depositMonths", t.u.monthsRent, whole)];

  // the comparison rows — the same rows for both channels
  const rows: [string, string, string][] = [
    [t.rows.revenue, A ? eur(A.revenue) : t.na, B ? eur(B.revenue) : t.na],
    [t.rows.gross, A ? eur(A.gross) : t.na, B ? eur(B.gross) : t.na],
    [t.rows.ebitda, A ? eur(A.ebitda) : t.na, B ? eur(B.ebitda) : t.na],
    [t.rows.margin, A ? share(A.margin) : t.na, B ? share(B.margin) : t.na],
    [t.rows.breakEven, A?.breakEvenUnits != null ? t.beUnits(nf.format(Math.ceil(A.breakEvenUnits))) : t.na, B?.breakEvenRevenue != null ? t.beRevenue(eur(B.breakEvenRevenue)) : t.na],
    [t.rows.buyers, t.na, B ? count(B.breakEvenBuyers) : t.na],
    [t.rows.cash, A ? `${eur(A.cashFlow)} ${t.perMonth}` : t.na, B ? `${eur(B.cashFlow)} ${t.perMonth}` : t.na],
    [t.rows.wc, A?.workingCapital != null ? `${eur(A.workingCapital)} · ${t.wcA}` : t.na, B?.workingCapital != null ? `${eur(B.workingCapital)} · ${t.wcB}` : t.na],
    [t.rows.payback, t.na, C ? mo(C.payback) : t.na],
  ];

  // the comparison bar — EBITDA of the two channels and the company gain on one scale
  const bars = A || B ? [
    { key: "a", label: t.bar.a, value: A?.ebitda ?? null },
    { key: "b", label: t.bar.b, value: B?.ebitda ?? null },
    { key: "lost", label: t.bar.lost, value: C ? -C.lostChain : null },
    { key: "delta", label: t.bar.delta, value: C?.incremental ?? null },
  ] : [];
  const scale = Math.max(1, ...bars.map((b) => Math.abs(b.value ?? 0)));

  // the neutral management conclusion
  const plan = inputs.buyersPerDay;
  const pess = all.find((x) => x.s === "pessimistic")!.r.company;
  let verdict: string | null = null;
  if (B && C) {
    if (C.breakEvenBuyers === null) verdict = t.verdict.never;
    else if (C.incremental <= 0) verdict = t.verdict.negative(count(C.breakEvenBuyers), count(plan));
    else if (C.payback !== null && C.payback > 60) verdict = t.verdict.slow(eur(C.incremental), nf.format(Math.round(C.payback)));
    else verdict = t.verdict.positive(eur(C.incremental), C.payback !== null ? nf.format(Math.round(C.payback)) : t.na, count(C.breakEvenBuyers), count(plan));
    if (scenario !== "pessimistic" && pess) verdict += " " + t.verdict.pessimistic(pess.incremental > 0 ? `${eur(pess.incremental)} ${t.perMonth}, ${mo(pess.payback)}` : `${eur(pess.incremental)} ${t.perMonth}`);
  }

  return (
    <div className="pe pe--v2">
      <header className="pe__head">
        <p className="pe__badge">{t.badge}</p>
        <h1 className="pe__title">{t.title}</h1>
        <p className="pe__lead">{t.lead}</p>
        <p className="pe__principle">{t.principle}</p>
      </header>
      <div className="pe__tools">
        <button type="button" className="pe-link is-strong" onClick={() => { setV(fromExample()); setIsExample(true); }}>{t.example}</button>
        <button type="button" className="pe-link" onClick={() => { setV(blank()); setIsExample(false); setScenario("realistic"); }}>{t.reset}</button>
      </div>
      {isExample ? <p className="pe__example">{t.exampleNote}</p> : null}

      <form className="pe2__inputs" onSubmit={(e) => e.preventDefault()} aria-label={t.title}>
        <fieldset className="pe-group pe2__col is-a">
          <legend className="pe-group__legend">{t.a}</legend>
          <div className="pe-group__fields">{groupA.map(field)}</div>
        </fieldset>
        <fieldset className="pe-group pe2__col is-b">
          <legend className="pe-group__legend">{t.b}</legend>
          <div className="pe-group__fields">{groupB.map(field)}</div>
          <p className="pe2__sub">{t.launch}</p>
          <div className="pe-group__fields">{groupL.map(field)}</div>
        </fieldset>
      </form>

      <div className="pe2__switch" role="group" aria-label={t.table.title}>
        {(Object.keys(scenarioShifts) as Scenario[]).map((s) => (
          <button key={s} type="button" aria-pressed={scenario === s} className={scenario === s ? "is-on" : undefined} onClick={() => setScenario(s)}>{t.scenarios[s]}</button>
        ))}
        <span className="pe2__switchnote">{t.scenarioNote(nf1.format(shift.buyers), `${shift.cannibalisation > 0 ? "+" : shift.cannibalisation < 0 ? "−" : "±"}${Math.abs(shift.cannibalisation)} п. п.`.replace("п. п.", locale === "ru" ? "п. п." : locale === "ro" ? "p.p." : "pp"))}</span>
      </div>

      <section className="pe2__results" aria-live="polite">
        {verdict ? (
          <div className="pe2__verdict">
            <p className="pe2__verdictlabel">{t.conclusion}</p>
            <p className="pe2__verdicttext">{verdict}</p>
          </div>
        ) : null}
        <div className="pe-split">
          <h3 className="pe-split__title">{t.company.title}</h3>
          {C ? (
            <div className="pe-split__cols">
              <dl className="pe-split__col">
                <div><dt>{t.company.lost}</dt><dd>{eur(-C.lostChain)}</dd></div>
                <div className="is-total"><dt>{t.company.incremental}</dt><dd>{eur(C.incremental)}</dd></div>
                <div><dt>{t.company.buyers}</dt><dd>{count(C.breakEvenBuyers)}</dd></div>
              </dl>
              <dl className="pe-split__col">
                <div><dt>{t.company.released}</dt><dd>{eur(C.released)}</dd></div>
                <div className="is-total"><dt>{t.company.start}</dt><dd>{eur(C.startCash)}</dd></div>
                <div><dt>{t.company.payback}</dt><dd>{mo(C.payback)}</dd></div>
              </dl>
            </div>
          ) : <p className="pe-split__note">{t.need.c}</p>}
          {C && plan !== null && C.safety !== null ? <p className="pe-split__note">{t.company.plan(count(plan * shift.buyers), share(C.safety))}</p> : null}
        </div>

        <table className="pe2__table">
          <thead><tr><th scope="col"><span className="sr-only">—</span></th><th scope="col">{t.a}</th><th scope="col">{t.b}<span className="pe2__thnote">{t.noCann}</span></th></tr></thead>
          <tbody>
            {rows.map(([label, a, b]) => (
              <tr key={label} className={label === t.rows.ebitda ? "is-key" : undefined}><th scope="row">{label}</th><td>{a}</td><td>{b}</td></tr>
            ))}
          </tbody>
        </table>
        {!A ? <p className="pe-answer__need">{t.need.a}</p> : null}
        {!B ? <p className="pe-answer__need">{t.need.b}</p> : null}
        {A?.delayCost != null ? <p className="pe-answer__note">{t.delay}: {eur(A.delayCost)} {t.perMonth}</p> : null}
        {B?.deposit != null && inputs.depositMonths !== null ? <p className="pe-answer__note">{t.deposit}: {nf.format(inputs.depositMonths)} {t.u.monthsRent}</p> : null}

        {bars.length ? (
          <div className="pe2__bars" aria-hidden="true">
            {bars.map((b) => (
              <div key={b.key} className={`pe2__bar is-${b.key}${(b.value ?? 0) < 0 ? " is-neg" : ""}`}>
                <span className="pe2__barlabel">{b.label}</span>
                <span className="pe2__bartrack"><span className="pe2__barfill" style={{ width: `${(Math.abs(b.value ?? 0) / scale) * 50}%` }} /></span>
                <span className="pe2__barvalue">{eur(b.value)}</span>
              </div>
            ))}
          </div>
        ) : null}

        {B && C ? (
          <section className="pe-sens" aria-label={t.table.title}>
            <h3 className="pe-sens__title">{t.table.title}</h3>
            <table className="pe-sens__table">
              <thead><tr><th scope="col">{t.table.title}</th><th scope="col">{t.table.buyers}</th><th scope="col">{t.table.delta}</th><th scope="col">{t.table.payback}</th></tr></thead>
              <tbody>
                {all.map(({ s, r: x }) => (
                  <tr key={s} className={s === scenario ? "is-plan" : undefined}>
                    <th scope="row">{t.scenarios[s]}</th>
                    <td>{plan !== null ? count(plan * scenarioShifts[s].buyers) : t.na}</td>
                    <td className={x.company && x.company.incremental < 0 ? "is-negative" : undefined}>{x.company ? eur(x.company.incremental) : t.na}</td>
                    <td>{x.company ? mo(x.company.payback) : t.na}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        ) : null}

      </section>

      <footer className="pe__foot">{t.foot.map((line) => <p key={line}>{line}</p>)}</footer>
    </div>
  );
}
