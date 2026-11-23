"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { NumberInput, type NumberFormat } from "@/components/number-input";
import { T } from "@/data/leasing-experience-model";
import type { ModelPreset } from "@/data/land/model";
import { breakEven, btsAnalysis, emptyInputs, quarterly, run, sensitivity, variantOf, type InputKey, type Inputs, type ModelKey, type Summary, type VariantKey } from "@/lib/land-finance";
import { numberLocale, type Localized, type SiteLocale } from "@/lib/site-data";

/**
 * DEVELOPMENT CALCULATOR 2.0 (§10–§11) — the interface of src/lib/land-finance.ts. The only pre-filled value is the published site area;
 * a demonstration example loads only on request and is labelled on screen until the visitor changes a figure. Results: the project
 * without financing and the equity view apart, the land's economic value apart from the cash invested, the cost lines apart, the monthly
 * flows as a quarterly chart, realistic / optimistic / pessimistic, the sensitivity and the break-even point. Not a valuation, not an
 * offer, not a forecast — and never MEGAPARC's own figures.
 */

const L = (ro: string, ru: string, en: string) => T(ro, ru, en);
const t = {
  models: { sale: L("A · Construire și vânzare", "A · Строительство и продажа", "A · Build and sell"), hold: L("B · Construire și închiriere", "B · Строительство и аренда", "B · Build and lease"), bts: L("C · Build-to-Suit", "C · Build-to-Suit", "C · Build-to-Suit") } as Record<ModelKey, Localized>,
  modelLine: { sale: L("Construiți, vindeți spațiile, încasările după finalizare.", "Строите, продаёте площади, поступления после ввода.", "Build, sell the space, receipts after completion."), hold: L("Construiți și păstrați: chirie, ocupare, valoarea la ieșire.", "Строите и держите: аренда, заполнение, стоимость на выходе.", "Build and hold: rent, occupancy, the exit value."), bts: L("Construiți pentru un chiriaș: chiria minimă pentru randamentul cerut.", "Строите под арендатора: минимальная ставка для требуемой доходности.", "Build for one tenant: the minimum rent for the required return.") } as Record<ModelKey, Localized>,
  label: L("Model de dezvoltare 2.0", "Модель девелопмента 2.0", "Development model 2.0"),
  demo: L("Exemplu demonstrativ", "Демонстрационный пример", "Demonstration example"),
  clear: L("Goliți", "Очистить", "Clear"),
  demoNote: L("Valori demonstrative — nu sunt datele terenului, nu sunt o evaluare de piață și nu sunt o recomandare. Înlocuiți-le cu ale dumneavoastră.", "Демонстрационные значения — не данные участка, не рыночная оценка и не рекомендация. Замените своими.", "Demonstration values — not site data, not a market valuation and not a recommendation. Replace them with your own."),
  groups: { site: L("Teren și clădire", "Участок и здание", "Site and building"), cost: L("Costuri de dezvoltare · fără TVA", "Затраты на девелопмент · без НДС", "Development costs · excl. VAT"), land: L("Terenul", "Земля", "Land"), time: L("Termene", "Сроки", "Schedule"), exit: { sale: L("Vânzare", "Продажа", "Sale"), hold: L("Închiriere și ieșire", "Аренда и выход", "Leasing and exit"), bts: L("Contractul build-to-suit", "Договор build-to-suit", "The build-to-suit lease") } as Record<ModelKey, Localized>, early: L("Încetare anticipată", "Досрочное прекращение аренды", "Early termination"), finance: L("Finanțare, impozite, actualizare", "Финансирование, налоги, дисконтирование", "Financing, tax, discounting") },
  f: {
    siteArea: L("Suprafața terenului", "Площадь участка", "Site area"), coverage: L("Ocuparea terenului (ipoteză)", "Застройка участка (допущение)", "Site coverage (assumption)"), floors: L("Niveluri (ipoteză)", "Этажность (допущение)", "Floors (assumption)"), gbaManual: L("Suprafața clădirii GBA — manual", "Площадь здания GBA — вручную", "Gross building area GBA — manual"), efficiency: { sale: L("Ponderea suprafeței vândute", "Доля продаваемой площади", "Sellable share"), hold: L("Ponderea suprafeței închiriabile", "Доля арендуемой площади", "Leasable share"), bts: L("Ponderea suprafeței închiriate", "Доля арендуемой площади", "Leasable share") } as Record<ModelKey, Localized>,
    hard: L("Construcție", "Строительство", "Construction"), design: L("Proiectare", "Проектирование", "Design"), networks: L("Rețele externe", "Внешние инженерные сети", "External networks"), landscaping: L("Amenajare", "Благоустройство", "Landscaping and site works"), permits: L("Autorizații și avize", "Разрешения и согласования", "Permits and approvals"), contingency: L("Rezervă", "Резерв", "Contingency"),
    landValue: L("Valoarea economică a terenului", "Экономическая стоимость земли", "Economic value of the land"),
    preMonths: L("Termenul proiectării și autorizării", "Срок проектирования и разрешений", "Design and permitting period"), buildMonths: L("Termenul construcției", "Срок строительства", "Construction period"), salesMonths: L("Perioada vânzărilor", "Период продаж", "Sales period"), leaseUp: L("Ocupare până la nivelul stabil", "Выход на стабильное заполнение", "Lease-up to stabilised occupancy"),
    price: L("Preț de vânzare", "Цена продажи", "Sale price"), commission: L("Costuri de vânzare", "Затраты на продажу", "Sales costs"),
    rent: L("Chirie", "Арендная ставка", "Rent"), occupancy: L("Ocupare stabilă", "Стабильное заполнение", "Stabilised occupancy"), opex: L("Costuri operaționale nerecuperabile", "Невозмещаемые операционные расходы", "Non-recoverable operating costs"), indexation: L("Indexare anuală", "Ежегодная индексация", "Annual indexation"), holdYears: L("Perioada de deținere", "Срок владения", "Hold period"), exitYield: L("Randament la ieșire", "Доходность на выходе (exit yield)", "Exit yield"), exitCosts: L("Costuri la ieșire", "Затраты на выходе", "Exit costs"),
    leaseYears: L("Durata contractului", "Срок договора", "Lease term"), target: L("Randamentul cerut de proprietar", "Требуемая доходность собственника", "Owner's required return"), rentBts: L("Chiria propusă (opțional)", "Предлагаемая ставка (необязательно)", "Proposed rent (optional)"),
    breakYear: L("Chiriașul pleacă după", "Арендатор уходит через", "The tenant leaves after"), voidMonths: L("Perioadă fără chiriaș", "Простой без арендатора", "Void period"), reletPct: L("Chiria la relocare", "Ставка при повторной сдаче", "Re-letting rent"), breakFee: L("Compensație la plecare", "Компенсация при уходе", "Termination fee"),
    ltc: L("Credit · din costurile de dezvoltare", "Кредит · доля от затрат на девелопмент", "Loan · share of the development cost"), interest: L("Dobânda anuală", "Ставка кредита, годовая", "Loan interest, annual"), tax: L("Impozit pe profit (ipoteză)", "Налог на прибыль (допущение)", "Profit tax (assumption)"), discount: L("Rata de actualizare pentru NPV", "Ставка дисконтирования для NPV", "Discount rate for NPV"),
  } as Record<string, Localized | Record<ModelKey, Localized>>,
  hints: {
    siteArea: L("datele publicate MEGAPARC", "опубликованные данные MEGAPARC", "MEGAPARC's published data"), coverage: L("nu este POT — POT se verifică", "не POT — POT проверяется", "not POT — POT is being verified"), floors: L("nu este regimul de înălțime", "не регламент высотности", "not the height limit"), gbaManual: L("înlocuiește ocuparea × nivelurile", "заменяет застройку × этажность", "replaces coverage × floors"),
    landValue: L("dacă îl includeți — nu este o evaluare MEGAPARC", "если учитываете — это не оценка MEGAPARC", "if you include it — not a MEGAPARC valuation"), contingency: L("o dată, pe cele cinci linii de mai sus", "один раз, на пять строк выше", "once, on the five lines above"), design: L("din construcție", "от строительства", "of construction"),
    rentBts: L("gol = se folosește chiria minimă", "пусто — используется минимальная ставка", "empty = the minimum rent is used"), breakFee: L("luni de chirie", "месяцев аренды", "months of rent"), opexBts: L("în BTS chiriașul plătește de regulă exploatarea", "в BTS эксплуатацию обычно оплачивает арендатор", "in BTS the tenant usually pays the operation"),
  },
  includeLand: L("Includ terenul ca aport în proiect", "Учитывать землю как вклад в проект", "Include the land as a contribution to the project"),
  advanced: L("Parametri avansați", "Расширенные параметры", "Advanced parameters"),
  u: { m2: L("m²", "м²", "m²"), pct: L("%", "%", "%"), x: L("×", "×", "×"), eurm2: L("€/m²", "€/м²", "€/m²"), eur: L("€", "€", "€"), mo: L("luni", "мес.", "months"), yr: L("ani", "лет", "years"), eurm2m: L("€/m²·lună", "€/м²·мес.", "€/m²·month") },
  empty: L("Completați ipotezele — rezultatul apare aici.", "Заполните допущения — результат появится здесь.", "Fill in the assumptions — the result appears here."),
  emptyDemo: L("Sau deschideți un exemplu demonstrativ marcat și înlocuiți cifrele cu ale dumneavoastră.", "Или откройте отмеченный демонстрационный пример и замените цифры своими.", "Or open a labelled demonstration example and replace the figures with your own."),
  more: L("și încă", "и ещё", "and"),
  missing: L("Lipsesc", "Не хватает", "Missing"),
  range: L("Verificați valoarea", "Проверьте значение", "Check the value"),
  gba: L("GBA (ocupare × niveluri sau manual)", "GBA (застройка × этажность или вручную)", "GBA (coverage × floors or manual)"),
  breakRange: L("încetarea trebuie să fie înainte de sfârșitul contractului", "уход арендатора — раньше окончания договора", "the break must come before the lease ends"),
  out: {
    profit: L("Profit după finanțare și impozit", "Прибыль после финансирования и налога", "Profit after financing and tax"), irrProject: L("IRR al proiectului · fără finanțare", "IRR проекта · без финансирования", "Project IRR · unlevered"), irrEquity: L("IRR al capitalului propriu", "IRR собственного капитала", "Equity IRR"), npv: L("NPV al proiectului", "NPV проекта", "Project NPV"),
    roi: L("ROI · pe costul total", "ROI · на полную стоимость", "ROI · on the full cost"), margin: L("Marja pe venit", "Маржа к выручке", "Margin on revenue"), peak: L("Necesarul maxim de capital propriu", "Пиковая потребность в капитале", "Peak equity requirement"), payback: L("Recuperare", "Окупаемость", "Payback"), irrCash: L("IRR pe banii investiți · fără teren", "IRR денежных вложений · без земли", "IRR on cash invested · without land"),
    noi: L("NOI stabilizat, anual", "Стабилизированный NOI, в год", "Stabilised NOI, per year"), yoc: L("Yield on Cost", "Yield on Cost", "Yield on Cost"), terminal: L("Valoarea reziduală la ieșire", "Остаточная стоимость на выходе", "Residual value at exit"), simple: L("Recuperare simplă", "Простая окупаемость", "Simple payback"),
    minRent: L("Chiria minimă necesară", "Минимально необходимая ставка", "Minimum required rent"), atRent: L("La chiria", "При ставке", "At the rent"), investment: L("Investiția inițială", "Первоначальные инвестиции", "Initial investment"), early: L("Cu încetare anticipată", "При досрочном прекращении", "With early termination"), full: L("Pe tot termenul", "На весь срок", "Full term"), rentYear: L("Chiria anului 1", "Аренда за 1-й год", "Year-1 rent"),
    notDefined: L("nu se determină", "не определяется", "not defined"), months: L("luni de la start", "мес. от старта", "months from the start"), yearsOpen: L("ani de la deschidere", "лет от открытия", "years from opening"), notWithin: L("nu în perioada modelului", "не в периоде модели", "not within the model period"),
  },
  costs: { title: L("Structura costurilor — fiecare linie o dată", "Структура затрат — каждая строка один раз", "Cost structure — each line once"), hard: L("Construcție", "Строительство", "Construction"), design: L("Proiectare", "Проектирование", "Design"), networks: L("Rețele externe", "Внешние сети", "External networks"), landscaping: L("Amenajare", "Благоустройство", "Landscaping"), permits: L("Autorizații", "Разрешения", "Permits"), contingency: L("Rezervă", "Резерв", "Contingency"), cash: L("Investiții în bani", "Денежные инвестиции", "Cash invested"), land: L("Valoarea economică a terenului", "Экономическая стоимость земли", "Economic value of the land"), economic: L("Baza economică a proiectului", "Экономическая база проекта", "Economic base of the project"), interest: L("Dobânzi", "Проценты по кредиту", "Interest"), saleCosts: { sale: L("Costuri de vânzare", "Затраты на продажу", "Sales costs"), hold: L("Exploatare și costuri la ieșire", "Эксплуатация и затраты на выходе", "Operating and exit costs"), bts: L("Exploatare și costuri la ieșire", "Эксплуатация и затраты на выходе", "Operating and exit costs") } as Record<ModelKey, Localized>, tax: L("Impozite", "Налоги", "Tax"), revenue: { sale: L("Venit din vânzări", "Выручка от продаж", "Sales revenue"), hold: L("Chirii pe perioada deținerii", "Аренда за срок владения", "Rent over the hold"), bts: L("Chirii pe durata contractului", "Аренда за срок договора", "Rent over the lease") } as Record<ModelKey, Localized>, gba: L("Suprafața clădirii (GBA)", "Площадь здания (GBA)", "Gross building area (GBA)"), net: { sale: L("Suprafața vândută", "Продаваемая площадь", "Sellable area"), hold: L("Suprafața închiriabilă", "Арендуемая площадь", "Leasable area"), bts: L("Suprafața închiriabilă", "Арендуемая площадь", "Leasable area") } as Record<ModelKey, Localized> },
  chart: { title: L("Fluxul de numerar al proiectului, pe trimestre", "Денежный поток проекта по кварталам", "The project's cash flow by quarter"), in: L("Încasări", "Поступления", "Inflows"), outflow: L("Plăți", "Платежи", "Outflows"), cum: L("Cumulat", "Накопленный итог", "Cumulative"), table: L("Tabelul fluxurilor", "Таблица потоков", "Flow table"), q: L("Trim.", "Кв.", "Q") },
  variants: { title: L("Trei scenarii", "Три сценария", "Three scenarios"), realistic: L("Realist", "Реалистичный", "Realistic"), optimistic: L("Optimist", "Оптимистичный", "Optimistic"), pessimistic: L("Pesimist", "Пессимистичный", "Pessimistic"), note: L("Realist = ipotezele dumneavoastră. Optimist: venit +10 %, construcție −5 %, termen −2 luni. Pesimist: venit −10 %, construcție +10 %, termen +3 luni.", "Реалистичный — ваши допущения. Оптимистичный: выручка +10 %, строительство −5 %, срок −2 мес. Пессимистичный: выручка −10 %, строительство +10 %, срок +3 мес.", "Realistic = your assumptions. Optimistic: revenue +10%, construction −5%, schedule −2 months. Pessimistic: revenue −10%, construction +10%, schedule +3 months.") },
  sens: { title: L("Sensibilitate", "Чувствительность", "Sensitivity"), capex: L("Costul construcției ±10 %", "Стоимость строительства ±10 %", "Construction cost ±10%"), revenue: { sale: L("Prețul de vânzare ±10 %", "Цена продажи ±10 %", "Sale price ±10%"), hold: L("Chiria ±10 %", "Арендная ставка ±10 %", "Rent ±10%"), bts: L("Chiria ±10 %", "Арендная ставка ±10 %", "Rent ±10%") } as Record<ModelKey, Localized>, time: L("Termenul construcției ±3 luni", "Срок строительства ±3 мес.", "Construction time ±3 months"), low: L("Mai favorabil", "Лучше", "Better"), high: L("Mai puțin favorabil", "Хуже", "Worse"), minRentLow: L("Chiria minimă", "Минимальная ставка", "Minimum rent") },
  be: { title: L("Pragul de rentabilitate", "Точка безубыточности", "Break-even point"), priceNpv: L("Prețul la care NPV = 0", "Цена, при которой NPV = 0", "Price at which NPV = 0"), priceProfit: L("Prețul la care profitul = 0", "Цена, при которой прибыль = 0", "Price at which profit = 0"), rentNpv: L("Chiria la care NPV = 0", "Ставка, при которой NPV = 0", "Rent at which NPV = 0"), occNpv: L("Ocuparea la care NPV = 0", "Заполнение, при котором NPV = 0", "Occupancy at which NPV = 0"), btsNote: L("În BTS chiria minimă este chiar pragul: NPV = 0 la randamentul cerut.", "В BTS минимальная ставка и есть точка безубыточности: NPV = 0 при требуемой доходности.", "In BTS the minimum rent is the break-even: NPV = 0 at the required return."), none: L("nu se atinge în interval", "не достигается в диапазоне", "not reached in range") },
  disclaimer: L("Calcul ilustrativ pe ipotezele vizitatorului sau pe un exemplu demonstrativ marcat. Nu este o evaluare, o ofertă, o prognoză a proiectului sau o recomandare de investiții. Toate sumele — fără TVA; impozitul este simplificat (fără amortizare și reportarea pierderilor). Parametrii de construire ai terenului (destinația, POT, CUT, înălțimea, rețelele) nu sunt stabiliți.", "Иллюстративный расчёт на допущениях посетителя или на отмеченном демонстрационном примере. Не оценка, не предложение, не прогноз проекта и не инвестиционная рекомендация. Все суммы — без НДС; налог упрощён (без амортизации и переноса убытков). Параметры застройки участка (назначение, POT, CUT, высотность, сети) не определены.", "An illustrative calculation on the visitor's assumptions or a labelled demonstration example. Not a valuation, an offer, a project forecast or an investment recommendation. All amounts excl. VAT; the tax is simplified (no depreciation, no loss carry-forward). The site's development parameters (use, POT, CUT, height, utilities) are not established."),
  method: L("Metodologie: fluxuri lunare; IRR anualizat (1 + m)^12 − 1; NPV la rata efectivă lunară; terenul — aport la luna 0, niciodată în CAPEX.", "Методика: помесячные потоки; IRR в годовом выражении (1 + m)^12 − 1; NPV по эффективной месячной ставке; земля — вклад в месяц 0, никогда не в CAPEX.", "Method: monthly flows; IRR annualised (1 + m)^12 − 1; NPV at the effective monthly rate; land — a contribution at month 0, never in CAPEX."),
};

type Field = { key: InputKey; unit: keyof typeof t.u; fmt: NumberFormat; hint?: Localized; label?: Localized };
const money: NumberFormat = { group: true, decimals: 0, maxInt: 12 };
const rate: NumberFormat = { group: false, decimals: 2, maxInt: 3 };
const area: NumberFormat = { group: true, decimals: 0, maxInt: 9 };
const whole: NumberFormat = { group: false, decimals: 0, maxInt: 3 };
const price: NumberFormat = { group: true, decimals: 2, maxInt: 7 };

const KEYS: InputKey[] = ["siteArea", "coverage", "floors", "gbaManual", "efficiency", "hard", "design", "networks", "landscaping", "permits", "contingency", "landValue", "preMonths", "buildMonths", "ltc", "interest", "tax", "discount", "price", "salesMonths", "commission", "rent", "occupancy", "leaseUp", "opex", "indexation", "holdYears", "exitYield", "exitCosts", "leaseYears", "target", "breakYear", "voidMonths", "reletPct", "breakFee"];
type State = Record<InputKey, string>;
const toCanon = (x: number | undefined) => (x === undefined ? "" : String(x));
const parse = (s: string) => (s === "" || s === "." ? null : Number.isFinite(Number(s)) ? Number(s) : null);

export function DevelopmentModel({ locale, siteArea, presets }: { locale: SiteLocale; siteArea: number; presets: ModelPreset[] }) {
  const uid = useId();
  const root = useRef<HTMLDivElement>(null);
  const blank = (): State => Object.fromEntries(KEYS.map((k) => [k, k === "siteArea" ? String(siteArea) : ""])) as State;
  const [model, setModel] = useState<ModelKey>("sale");
  const [v, setV] = useState<State>(blank);
  const [includeLand, setIncludeLand] = useState(true);
  const [demo, setDemo] = useState<string | null>(null);
  const nf = useMemo(() => new Intl.NumberFormat(numberLocale(locale), { maximumFractionDigits: 0 }), [locale]);
  const pf = useMemo(() => new Intl.NumberFormat(numberLocale(locale), { minimumFractionDigits: 1, maximumFractionDigits: 1 }), [locale]);
  const rf = useMemo(() => new Intl.NumberFormat(numberLocale(locale), { minimumFractionDigits: 2, maximumFractionDigits: 2 }), [locale]);
  const eur = (x: number) => `${x < 0 ? "−" : ""}${nf.format(Math.abs(Math.round(x)))} €`;
  const pct = (x: number | null) => (x === null ? t.out.notDefined[locale] : `${x < 0 ? "−" : ""}${pf.format(Math.abs(x * 100))} %`);
  const unitRent = locale === "ru" ? "€/м²·мес." : locale === "ro" ? "€/m²·lună" : "€/m²·month";
  const unitPrice = locale === "ru" ? "€/м²" : "€/m²";

  const load = (preset: ModelPreset) => {
    setModel(preset.model);
    setV({ ...blank(), ...Object.fromEntries(Object.entries(preset.values).map(([k, x]) => [k, toCanon(x)])) } as State);
    setIncludeLand(true);
    setDemo(preset.key);
  };
  // a scenario card asks for its model and example (src/components/land-experience/scenarios.tsx)
  useEffect(() => {
    const on = (event: Event) => {
      const detail = (event as CustomEvent<{ preset: string }>).detail;
      const preset = presets.find((p) => p.key === detail?.preset);
      if (preset) {
        load(preset);
        root.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    };
    window.addEventListener("lx:scenario", on);
    return () => window.removeEventListener("lx:scenario", on);
  });

  const inputs: Inputs = useMemo(() => {
    const i = emptyInputs(model, null);
    for (const k of KEYS) (i as Record<InputKey, number | null>)[k] = parse(v[k]);
    i.includeLand = includeLand;
    return i;
  }, [v, model, includeLand]);
  const result = useMemo(() => run(inputs), [inputs]);
  const bts = useMemo(() => (model === "bts" ? btsAnalysis(inputs) : null), [inputs, model]);
  const extras = useMemo(() => {
    if (!result.ok) return null;
    return {
      variants: (["realistic", "optimistic", "pessimistic"] as VariantKey[]).map((k) => ({ k, r: model === "bts" ? null : run(variantOf(inputs, k)), b: model === "bts" ? btsAnalysis(variantOf(inputs, k)) : null })),
      sens: sensitivity(inputs),
      be: breakEven(inputs),
    };
  }, [inputs, result.ok, model]);
  const shownSummary: Summary | null = model === "bts" ? bts?.full ?? null : result.ok ? result.summary : null;
  const ledger = model === "bts" ? (bts?.rent ? run({ ...inputs, discount: inputs.target }, { rentOverride: bts.rent }) : null) : result;

  const set = (key: InputKey) => (canonical: string) => { setV((old) => ({ ...old, [key]: canonical })); setDemo(null); };
  const label = (key: InputKey) => {
    const l = t.f[key === "rent" && model === "bts" ? "rentBts" : key];
    return (("ro" in (l as object)) ? (l as Localized) : (l as Record<ModelKey, Localized>)[model])[locale];
  };
  const field = ({ key, unit, fmt, hint }: Field) => (
    <div className="lx-field" key={key}>
      <label htmlFor={`${uid}-${key}`}>{label(key)}</label>
      <span className={`lx-field__box${!result.ok && result.issues.some((x) => x.key === key && x.kind === "range") ? " is-bad" : ""}`}>
        <NumberInput id={`${uid}-${key}`} className="lx-field__input" value={v[key]} onValueChange={set(key)} locale={locale} format={fmt} describedBy={hint ? `${uid}-${key}-h` : undefined} />
        <span aria-hidden="true">{t.u[unit][locale]}</span>
      </span>
      {hint ? <span className="lx-field__hint" id={`${uid}-${key}-h`}>{hint[locale]}</span> : null}
    </div>
  );
  const exitFields: Record<ModelKey, Field[]> = {
    sale: [{ key: "price", unit: "eurm2", fmt: price }, { key: "commission", unit: "pct", fmt: rate }],
    hold: [{ key: "rent", unit: "eurm2m", fmt: price }, { key: "occupancy", unit: "pct", fmt: rate }, { key: "opex", unit: "pct", fmt: rate }, { key: "indexation", unit: "pct", fmt: rate }, { key: "holdYears", unit: "yr", fmt: whole }, { key: "exitYield", unit: "pct", fmt: rate }, { key: "exitCosts", unit: "pct", fmt: rate }],
    bts: [{ key: "leaseYears", unit: "yr", fmt: whole }, { key: "indexation", unit: "pct", fmt: rate }, { key: "target", unit: "pct", fmt: rate }, { key: "opex", unit: "pct", fmt: rate, hint: t.hints.opexBts }, { key: "exitYield", unit: "pct", fmt: rate }, { key: "exitCosts", unit: "pct", fmt: rate }, { key: "rent", unit: "eurm2m", fmt: price, hint: t.hints.rentBts }],
  };
  const issues = result.ok ? [] : result.issues;
  const issueLabel = (key: string) => (key === "gba" ? t.gba[locale] : key === "break" ? t.breakRange[locale] : label(key as InputKey));
  const presetList = presets.filter((p) => p.model === model);

  return (
    <div className="lx-model" ref={root}>
      <div className="lx-model__head">
        <div className="lx-model__tabs" role="tablist" aria-label={t.label[locale]}>
          {(["sale", "hold", "bts"] as ModelKey[]).map((m) => (
            <button key={m} type="button" role="tab" aria-selected={model === m} className={model === m ? "is-on" : undefined} onClick={() => { setModel(m); setDemo(null); }}>
              <span>{t.models[m][locale]}</span>
              <em>{t.modelLine[m][locale]}</em>
            </button>
          ))}
        </div>
        <div className="lx-model__tools">
          {presetList.map((p) => <button key={p.key} type="button" className={`lx-model__demo${demo === p.key ? " is-on" : ""}`} onClick={() => load(p)}>{t.demo[locale]} · {p.label[locale]}</button>)}
          <button type="button" className="lx-model__clear" onClick={() => { setV(blank()); setDemo(null); }}>{t.clear[locale]}</button>
        </div>
        {demo ? <p className="lx-model__demo-note" role="status">{t.demoNote[locale]}</p> : null}
      </div>

      <div className="lx-model__grid">
        <div className="lx-model__inputs">
          <fieldset className="lx-group">
            <legend>{t.groups.site[locale]}</legend>
            <div className="lx-group__grid">
              {[{ key: "siteArea", unit: "m2", fmt: area, hint: t.hints.siteArea }, { key: "coverage", unit: "pct", fmt: rate, hint: t.hints.coverage }, { key: "floors", unit: "x", fmt: rate, hint: t.hints.floors }, { key: "gbaManual", unit: "m2", fmt: area, hint: t.hints.gbaManual }, { key: "efficiency", unit: "pct", fmt: rate }].map((x) => field(x as Field))}
            </div>
          </fieldset>
          <fieldset className="lx-group">
            <legend>{t.groups.cost[locale]}</legend>
            <div className="lx-group__grid">
              {[{ key: "hard", unit: "eurm2", fmt: price }, { key: "design", unit: "pct", fmt: rate, hint: t.hints.design }, { key: "networks", unit: "eur", fmt: money }, { key: "landscaping", unit: "eur", fmt: money }, { key: "permits", unit: "eur", fmt: money }, { key: "contingency", unit: "pct", fmt: rate, hint: t.hints.contingency }].map((x) => field(x as Field))}
            </div>
          </fieldset>
          <fieldset className="lx-group">
            <legend>{t.groups.land[locale]}</legend>
            <div className="lx-group__grid">
              {field({ key: "landValue", unit: "eur", fmt: money, hint: t.hints.landValue })}
              <label className="lx-check"><input type="checkbox" checked={includeLand} onChange={(e) => { setIncludeLand(e.target.checked); setDemo(null); }} /><span>{t.includeLand[locale]}</span></label>
            </div>
          </fieldset>
          <fieldset className="lx-group">
            <legend>{t.groups.time[locale]}</legend>
            <div className="lx-group__grid">
              {field({ key: "preMonths", unit: "mo", fmt: whole })}
              {field({ key: "buildMonths", unit: "mo", fmt: whole })}
              {model === "sale" ? field({ key: "salesMonths", unit: "mo", fmt: whole }) : model === "hold" ? field({ key: "leaseUp", unit: "mo", fmt: whole }) : null}
            </div>
          </fieldset>
          <fieldset className="lx-group">
            <legend>{t.groups.exit[model][locale]}</legend>
            <div className="lx-group__grid">{exitFields[model].map(field)}</div>
          </fieldset>
          {model === "bts" ? (
            <fieldset className="lx-group">
              <legend>{t.groups.early[locale]}</legend>
              <div className="lx-group__grid">
                {field({ key: "breakYear", unit: "yr", fmt: whole })}
                {field({ key: "voidMonths", unit: "mo", fmt: whole })}
                {field({ key: "reletPct", unit: "pct", fmt: rate })}
                {field({ key: "breakFee", unit: "mo", fmt: whole, hint: t.hints.breakFee })}
              </div>
            </fieldset>
          ) : null}
          <details className="lx-group lx-group--fold" open={Boolean(demo) || undefined}>
            <summary>{t.groups.finance[locale]} · {t.advanced[locale]}</summary>
            <div className="lx-group__grid">
              {field({ key: "ltc", unit: "pct", fmt: rate })}
              {field({ key: "interest", unit: "pct", fmt: rate })}
              {field({ key: "tax", unit: "pct", fmt: rate })}
              {model !== "bts" ? field({ key: "discount", unit: "pct", fmt: rate }) : null}
            </div>
          </details>
        </div>

        <div className="lx-model__out" aria-live="polite">
          {!shownSummary || !ledger || !ledger.ok ? (
            <div className="lx-out__empty">
              <p className="lx-out__label">{t.label[locale]}</p>
              <p className="lx-out__empty-t">{model === "bts" && result.ok && bts && bts.minRent === null ? t.be.none[locale] : t.empty[locale]}</p>
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
            <Results
              locale={locale}
              model={model}
              s={shownSummary}
              ledger={ledger.ledger}
              bts={bts}
              extras={extras}
              fmt={{ eur, pct, nf, pf, rf, unitRent, unitPrice }}
              demo={Boolean(demo)}
            />
          )}
          <p className="lx-out__disclaimer">{t.disclaimer[locale]}</p>
          <p className="lx-out__method">{t.method[locale]}</p>
        </div>
      </div>
    </div>
  );
}

type Fmt = { eur: (x: number) => string; pct: (x: number | null) => string; nf: Intl.NumberFormat; pf: Intl.NumberFormat; rf: Intl.NumberFormat; unitRent: string; unitPrice: string };

function Results({ locale, model, s, ledger, bts, extras, fmt, demo }: { locale: SiteLocale; model: ModelKey; s: Summary; ledger: import("@/lib/land-finance").Ledger; bts: ReturnType<typeof btsAnalysis> | null; extras: { variants: { k: VariantKey; r: ReturnType<typeof run> | null; b: ReturnType<typeof btsAnalysis> | null }[]; sens: ReturnType<typeof sensitivity>; be: ReturnType<typeof breakEven> } | null; fmt: Fmt; demo: boolean }) {
  const { eur, pct, nf, rf, unitRent, unitPrice } = fmt;
  const payback = model === "sale" ? (s.paybackMonths === null ? t.out.notWithin[locale] : `${s.paybackMonths} ${t.out.months[locale]}`) : s.paybackMonths === null ? t.out.notWithin[locale] : `${fmt.pf.format((s.paybackMonths - ledger.completion) / 12)} ${t.out.yearsOpen[locale]}`;
  const kpis: { k: string; label: string; value: string; accent?: boolean }[] =
    model === "sale"
      ? [{ k: "profit", label: t.out.profit[locale], value: eur(s.profit), accent: true }, { k: "irr", label: t.out.irrProject[locale], value: pct(s.irrProject) }, { k: "eq", label: t.out.irrEquity[locale], value: pct(s.irrEquity) }, { k: "npv", label: t.out.npv[locale], value: eur(s.npv) }]
      : model === "hold"
        ? [{ k: "noi", label: t.out.noi[locale], value: eur(s.noiStabilised ?? 0), accent: true }, { k: "yoc", label: t.out.yoc[locale], value: pct(s.yieldOnCost) }, { k: "irr", label: t.out.irrProject[locale], value: pct(s.irrProject) }, { k: "npv", label: t.out.npv[locale], value: eur(s.npv) }]
        : [{ k: "min", label: t.out.minRent[locale], value: bts?.minRent !== null && bts?.minRent !== undefined ? `${rf.format(bts.minRent)} ${unitRent}` : t.out.notDefined[locale], accent: true }, { k: "irr", label: `${t.out.irrProject[locale]} · ${t.out.atRent[locale]} ${bts?.rent ? rf.format(bts.rent) : "—"}`, value: pct(s.irrProject) }, { k: "inv", label: t.out.investment[locale], value: eur(s.costs.economic) }, { k: "yoc", label: t.out.yoc[locale], value: pct(s.yieldOnCost) }];
  const secondary: { label: string; value: string }[] =
    model === "sale"
      ? [{ label: t.out.roi[locale], value: pct(s.roi) }, { label: t.out.margin[locale], value: pct(s.marginOnRevenue) }, { label: t.out.peak[locale], value: eur(s.peakEquity) }, { label: t.out.payback[locale], value: payback }, { label: t.out.irrCash[locale], value: pct(s.irrCash) }]
      : model === "hold"
        ? [{ label: t.out.irrEquity[locale], value: pct(s.irrEquity) }, { label: t.out.terminal[locale], value: eur(s.terminalValue ?? 0) }, { label: t.out.payback[locale], value: payback }, { label: t.out.simple[locale], value: s.simplePaybackYears === null ? t.out.notDefined[locale] : `${fmt.pf.format(s.simplePaybackYears)} ${t.u.yr[locale]}` }, { label: t.out.profit[locale], value: eur(s.profit) }, { label: t.out.irrCash[locale], value: pct(s.irrCash) }]
        : [{ label: t.out.rentYear[locale], value: eur((bts?.rent ?? 0) * s.net * 12) }, { label: t.out.npv[locale], value: eur(s.npv) }, { label: t.out.irrEquity[locale], value: pct(s.irrEquity) }, { label: t.out.terminal[locale], value: eur(s.terminalValue ?? 0) }, { label: t.out.peak[locale], value: eur(s.peakEquity) }];
  const q = quarterly(ledger);
  const costRows: [string, number, boolean?][] = [
    [t.costs.hard[locale], s.costs.hard], [t.costs.design[locale], s.costs.design], [t.costs.networks[locale], s.costs.networks], [t.costs.landscaping[locale], s.costs.landscaping], [t.costs.permits[locale], s.costs.permits], [t.costs.contingency[locale], s.costs.contingency],
  ];
  return (
    <div className="lx-out">
      <div className="lx-out__kpis">
        <p className="lx-out__label">{t.label[locale]} · {t.models[model][locale]}{demo ? ` · ${t.demo[locale]}` : ""}</p>
        <dl className="lx-out__grid">
          {kpis.map((x) => <div key={x.k} className={x.accent ? "is-accent" : undefined}><dt>{x.label}</dt><dd>{x.value}</dd></div>)}
        </dl>
        <dl className="lx-out__sec">{secondary.map((x) => <div key={x.label}><dt>{x.label}</dt><dd>{x.value}</dd></div>)}</dl>
      </div>

      {model === "bts" && bts?.early && bts.full ? (
        <div className="lx-out__card">
          <p className="lx-out__h">{t.groups.early[locale]}</p>
          <table className="lx-table">
            <thead><tr><th /><th>{t.out.full[locale]}</th><th>{t.out.early[locale]}</th></tr></thead>
            <tbody>
              <tr><th>{t.out.irrProject[locale]}</th><td>{pct(bts.full.irrProject)}</td><td>{pct(bts.early.irrProject)}</td></tr>
              <tr><th>{t.out.npv[locale]}</th><td>{eur(bts.full.npv)}</td><td>{eur(bts.early.npv)}</td></tr>
            </tbody>
          </table>
        </div>
      ) : null}

      <div className="lx-out__card">
        <p className="lx-out__h">{t.costs.title[locale]}</p>
        <dl className="lx-costs">
          <div className="is-area"><dt>{t.costs.gba[locale]}</dt><dd>{nf.format(Math.round(s.gba))}{" "}{t.u.m2[locale]}</dd></div>
          <div className="is-area"><dt>{t.costs.net[model][locale]}</dt><dd>{nf.format(Math.round(s.net))}{" "}{t.u.m2[locale]}</dd></div>
          {costRows.map(([l, x]) => <div key={l}><dt>{l}</dt><dd>{eur(x)}</dd></div>)}
          <div className="is-sum"><dt>{t.costs.cash[locale]}</dt><dd>{eur(s.costs.cash)}</dd></div>
          <div><dt>{t.costs.land[locale]}</dt><dd>{eur(s.costs.land)}</dd></div>
          <div className="is-sum"><dt>{t.costs.economic[locale]}</dt><dd>{eur(s.costs.economic)}</dd></div>
          <div><dt>{t.costs.interest[locale]}</dt><dd>{eur(s.costs.interest)}</dd></div>
          <div><dt>{t.costs.saleCosts[model][locale]}</dt><dd>{eur(s.costs.saleCosts)}</dd></div>
          <div><dt>{t.costs.tax[locale]}</dt><dd>{eur(s.costs.tax)}</dd></div>
          <div className="is-sum"><dt>{t.costs.revenue[model][locale]}</dt><dd>{eur(s.revenue)}</dd></div>
        </dl>
      </div>

      <div className="lx-out__card">
        <p className="lx-out__h">{t.chart.title[locale]}</p>
        <FlowChart q={q} locale={locale} eur={eur} />
        <details className="lx-out__fold">
          <summary>{t.chart.table[locale]}</summary>
          <div className="lx-table__scroll">
            <table className="lx-table lx-table--flows">
              <thead><tr><th>{t.chart.q[locale]}</th><th>{t.chart.in[locale]}</th><th>{t.chart.outflow[locale]}</th><th>{t.chart.cum[locale]}</th></tr></thead>
              <tbody>{q.map((r) => <tr key={r.q}><th>{r.q + 1}</th><td>{eur(r.inflow)}</td><td>{eur(-r.outflow)}</td><td>{eur(r.cumulative)}</td></tr>)}</tbody>
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
                  {model === "bts" ? (
                    <tr><th>{t.out.minRent[locale]}</th>{extras.variants.map((x) => <td key={x.k}>{x.b?.minRent != null ? `${rf.format(x.b.minRent)}` : "—"}</td>)}</tr>
                  ) : (
                    <>
                      <tr><th>{t.out.irrProject[locale]}</th>{extras.variants.map((x) => <td key={x.k}>{x.r?.ok ? pct(x.r.summary.irrProject) : "—"}</td>)}</tr>
                      <tr><th>{t.out.npv[locale]}</th>{extras.variants.map((x) => <td key={x.k}>{x.r?.ok ? eur(x.r.summary.npv) : "—"}</td>)}</tr>
                      <tr><th>{t.out.profit[locale]}</th>{extras.variants.map((x) => <td key={x.k}>{x.r?.ok ? eur(x.r.summary.profit) : "—"}</td>)}</tr>
                    </>
                  )}
                </tbody>
              </table>
            </div>
            <p className="lx-note">{t.variants.note[locale]}{model === "bts" ? ` (${unitRent})` : ""}</p>
          </div>

          <div className="lx-out__card">
            <p className="lx-out__h">{t.sens.title[locale]}</p>
            <div className="lx-table__scroll">
              <table className="lx-table">
                <thead><tr><th /><th>{t.sens.low[locale]}</th><th>{t.sens.high[locale]}</th></tr></thead>
                <tbody>
                  {extras.sens.filter((row) => !(model === "bts" && row.key === "revenue")).map((row) => {
                    const name = row.key === "capex" ? t.sens.capex[locale] : row.key === "time" ? t.sens.time[locale] : t.sens.revenue[model][locale];
                    // «better» = lower cost / higher revenue / shorter time; for revenue the high end is the better one
                    const better = row.key === "revenue" ? row.high : row.low;
                    const worse = row.key === "revenue" ? row.low : row.high;
                    if (model === "bts") return <tr key={row.key}><th>{name} · {t.sens.minRentLow[locale]}</th><td>{row.lowBts != null ? rf.format(row.lowBts) : "—"}</td><td>{row.highBts != null ? rf.format(row.highBts) : "—"}</td></tr>;
                    return <tr key={row.key}><th>{name}</th><td>{better ? `${pct(better.irrProject)} · ${eur(better.npv)}` : "—"}</td><td>{worse ? `${pct(worse.irrProject)} · ${eur(worse.npv)}` : "—"}</td></tr>;
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="lx-out__card">
            <p className="lx-out__h">{t.be.title[locale]}</p>
            <dl className="lx-costs">
              {model === "sale" ? (
                <>
                  <div><dt>{t.be.priceNpv[locale]}</dt><dd>{extras.be.priceNpv != null ? `${rf.format(extras.be.priceNpv)} ${unitPrice}` : t.be.none[locale]}</dd></div>
                  <div><dt>{t.be.priceProfit[locale]}</dt><dd>{extras.be.priceProfit != null ? `${rf.format(extras.be.priceProfit)} ${unitPrice}` : t.be.none[locale]}</dd></div>
                </>
              ) : model === "hold" ? (
                <>
                  <div><dt>{t.be.rentNpv[locale]}</dt><dd>{extras.be.rentNpv != null ? `${rf.format(extras.be.rentNpv)} ${unitRent}` : t.be.none[locale]}</dd></div>
                  <div><dt>{t.be.occNpv[locale]}</dt><dd>{extras.be.occupancyNpv != null ? `${fmt.pf.format(extras.be.occupancyNpv)} %` : t.be.none[locale]}</dd></div>
                </>
              ) : (
                <div className="is-note"><dt>{t.be.btsNote[locale]}</dt><dd>{bts?.minRent != null ? `${rf.format(bts.minRent)} ${unitRent}` : t.be.none[locale]}</dd></div>
              )}
            </dl>
          </div>
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

