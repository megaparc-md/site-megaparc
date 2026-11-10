import type { SiteLocale } from "@/lib/site-data";

/**
 * Words of the economics tool «Проверить экономику точки» (OWNER addendum "TENANT ECONOMICS & DECISION TOOL",
 * 2026-11-06; rebuilt by the OWNER UX correction «REBUILD POINT ECONOMICS CALCULATOR», 2026-11-10). Interface
 * vocabulary only — no property fact, no rent, no forecast. Banned and absent: «мы рассчитаем вашу прибыль»,
 * «точка окупится», «гарантированный доход», «ожидаемая прибыль Moscova 20».
 */

export type PresetKey = "retail" | "showroom" | "services" | "center";
/** `focal` — the words under the large number (the plural follows the number in RU / RO) */
type Preset = { label: string; ticket: string; conversion: string; focal: (n: number) => string };

type Copy = {
  kicker: string; title: string; principle: string; presetsLabel: string; presets: Record<PresetKey, Preset>;
  example: string; exampleNote: string; clear: string;
  inputs: { ticket: string; revenue: string; margin: string; conversion: string };
  units: { mdl: string; pct: string; days: string; months: string; mdlMonth: string };
  outputs: { perMonth: string; perDay: string };
  daysNote: (days: number) => string; empty: string;
  sensitivity: string; sensitivityUnit: string;
  need: (n: number, formatted: string) => string; compare: string;
  status: { MODELLED: string; MEASURED: string; VERIFIED: string };
  figures: { pedestrians: string; vehicles: string };
  compareText: (n: string) => string; compareNone: string; discuss: string;
  advanced: string; advLead: string;
  adv: { days: string; rent: string; opex: string; payroll: string; utilities: string; marketing: string; other: string; capex: string };
  rentHint: string;
  advOut: { beRevenue: string; beVisitors: string; result: string; payback: string };
  perDayShort: string;
  needMargin: string; needFixed: string; noPayback: string;
  closing: string; disclaimer: string[]; handoff: string; visit: (name: string) => string;
  lines: { business: string; revenue: string; visitors: string; conversion: string; ticket: string };
  approx: string;
};

const NB = " ";
const ruPlural = (n: number, one: string, few: string, many: string) => {
  const form = new Intl.PluralRules("ru-RU").select(Math.round(n));
  return form === "one" ? one : form === "few" ? few : many;
};
const roPlural = (n: number, one: string, many: string) => (Math.round(n) === 1 ? one : many);

export const economicsCopy: Record<SiteLocale, Copy> = {
  ru: {
    kicker: "Экономика точки · оценка для принятия решения",
    title: `Сколько клиентов в${NB}день потребуется именно вашему бизнесу?`,
    principle: "Это не прогноз продаж. Это способ понять, какой уровень клиентской активности потребуется вашей бизнес-модели.",
    presetsLabel: "Формат",
    presets: {
      retail: { label: "Ритейл", ticket: "средняя покупка", conversion: "доля посетителей, которые покупают", focal: (n) => `${ruPlural(n, "потенциальный посетитель", "потенциальных посетителя", "потенциальных посетителей")} в${NB}день` },
      showroom: { label: "Шоурум", ticket: "средняя сделка", conversion: "доля визитов, которые заканчиваются покупкой", focal: (n) => `${ruPlural(n, "визит", "визита", "визитов")} в${NB}день` },
      services: { label: "Услуги", ticket: "средний чек услуги", conversion: "доля обратившихся, которые становятся клиентами", focal: (n) => `${ruPlural(n, "обращение", "обращения", "обращений")} в${NB}день` },
      center: { label: "Клиентский центр", ticket: "средний доход с обращения", conversion: "доля обращений, которые приносят доход", focal: (n) => `${ruPlural(n, "обращение", "обращения", "обращений")} в${NB}день` },
    },
    example: "Пример расчёта",
    exampleNote: "Пример расчёта · условные цифры, не характеристика Moscova 20",
    clear: "Очистить",
    inputs: { ticket: "Средний чек", revenue: "Желаемая выручка в месяц", margin: "Валовая маржа", conversion: "Конверсия посетитель → покупатель" },
    units: { mdl: "MDL", pct: "%", days: "дней", months: "мес.", mdlMonth: "MDL / мес." },
    outputs: { perMonth: "Продаж в месяц", perDay: "Продаж в день" },
    daysNote: (days) => `Из расчёта ${days} рабочих дней в${NB}месяц — меняется в${NB}расширенном расчёте.`,
    empty: "Введите средний чек, выручку и конверсию — или откройте пример расчёта.",
    sensitivity: "Если конверсия будет другой",
    sensitivityUnit: `посетителей в${NB}день`,
    need: (n, f) => `Для вашей модели требуется примерно ${f} ${ruPlural(n, "потенциальный посетитель", "потенциальных посетителя", "потенциальных посетителей")} в${NB}день.`,
    compare: "Сравнить с локацией",
    status: { MODELLED: "Предварительный анализ локации · моделируемый сценарий", MEASURED: "Полевой замер MEGAPARC", VERIFIED: "Проверенные данные" },
    figures: { pedestrians: "перемещений / сутки", vehicles: "авто / сутки" },
    compareText: (n) => `Вашей модели требуется около ${n} посетителей в${NB}день. Локация показывает определённый уровень активности, но релевантность этого потока для вашей аудитории необходимо проверить.`,
    compareNone: "Данные о потоке появятся после полевого замера MEGAPARC; релевантность потока для вашей аудитории проверим на просмотре.",
    discuss: "Обсудить мою модель на просмотре",
    advanced: "Расширенный расчёт",
    advLead: "Постоянные расходы и CAPEX запуска — чтобы увидеть точку безубыточности и окупаемость.",
    adv: { days: "Рабочих дней в месяц", rent: "Аренда в месяц", opex: "Эксплуатационные расходы", payroll: "Фонд оплаты труда", utilities: "Коммунальные платежи", marketing: "Маркетинг", other: "Прочие постоянные расходы", capex: "CAPEX запуска" },
    rentHint: "Ваше допущение — коммерческие условия обсуждаются после первичной проверки формата.",
    advOut: { beRevenue: "Выручка безубыточности", beVisitors: "Посетителей для безубыточности", result: "Операционный результат (оценка)", payback: "Окупаемость CAPEX" },
    perDayShort: `в${NB}день`,
    needMargin: "Укажите валовую маржу, чтобы рассчитать точку безубыточности.",
    needFixed: "Укажите постоянные расходы — аренду, фонд оплаты труда и другие, — чтобы рассчитать точку безубыточности.",
    noPayback: "Окупаемость CAPEX не рассчитывается при отрицательном операционном результате.",
    closing: "Локация — только одна часть экономики точки.",
    disclaimer: [
      "Выручка зависит от продукта, цен, команды, маркетинга, конверсии, сезонности и других факторов.",
      "Расчёт является инструментом предварительной оценки и не является прогнозом или гарантией финансового результата.",
    ],
    handoff: "Получить расчёт с презентацией объекта",
    visit: (name) => `Посмотреть ${name} лично`,
    lines: { business: "Формат", revenue: "Целевая выручка в месяц", visitors: "Требуемый клиентский поток", conversion: "Конверсия в расчёте", ticket: "Средний чек" },
    approx: "≈",
  },
  ro: {
    kicker: "Economia punctului · estimare pentru decizie",
    title: "Câți clienți pe zi îi vor trebui afacerii dumneavoastră?",
    principle: "Nu este o prognoză de vânzări. Este un mod de a înțelege ce nivel de activitate a clienților îi trebuie modelului dumneavoastră de afaceri.",
    presetsLabel: "Format",
    presets: {
      retail: { label: "Retail", ticket: "cumpărătura medie", conversion: "partea vizitatorilor care cumpără", focal: (n) => `${roPlural(n, "vizitator potențial", "vizitatori potențiali")} pe zi` },
      showroom: { label: "Showroom", ticket: "tranzacția medie", conversion: "partea vizitelor care se încheie cu o cumpărare", focal: (n) => `${roPlural(n, "vizită", "vizite")} pe zi` },
      services: { label: "Servicii", ticket: "bonul mediu al serviciului", conversion: "partea solicitanților care devin clienți", focal: (n) => `${roPlural(n, "solicitare", "solicitări")} pe zi` },
      center: { label: "Centru pentru clienți", ticket: "venitul mediu pe solicitare", conversion: "partea solicitărilor care aduc venit", focal: (n) => `${roPlural(n, "solicitare", "solicitări")} pe zi` },
    },
    example: "Exemplu de calcul",
    exampleNote: "Exemplu de calcul · cifre convenționale, nu o caracteristică a Moscova 20",
    clear: "Golește",
    inputs: { ticket: "Bonul mediu", revenue: "Venitul dorit pe lună", margin: "Marja brută", conversion: "Conversia vizitator → cumpărător" },
    units: { mdl: "MDL", pct: "%", days: "zile", months: "luni", mdlMonth: "MDL / lună" },
    outputs: { perMonth: "Vânzări pe lună", perDay: "Vânzări pe zi" },
    daysNote: (days) => `Pe baza a ${days} zile lucrătoare pe lună — se schimbă în calculul extins.`,
    empty: "Introduceți bonul mediu, venitul și conversia — sau deschideți exemplul de calcul.",
    sensitivity: "Dacă conversia va fi alta",
    sensitivityUnit: "vizitatori pe zi",
    need: (n, f) => `Modelului dumneavoastră îi trebuie aproximativ ${f} ${roPlural(n, "vizitator potențial", "vizitatori potențiali")} pe zi.`,
    compare: "Comparați cu locația",
    status: { MODELLED: "Analiză preliminară a locației · scenariu modelat", MEASURED: "Numărătoare pe teren MEGAPARC", VERIFIED: "Date verificate" },
    figures: { pedestrians: "deplasări / zi", vehicles: "auto / zi" },
    compareText: (n) => `Modelului dumneavoastră îi trebuie circa ${n} vizitatori pe zi. Locația arată un anumit nivel de activitate, dar relevanța acestui flux pentru publicul dumneavoastră trebuie verificată.`,
    compareNone: "Datele despre flux apar după numărătoarea pe teren MEGAPARC; relevanța fluxului pentru publicul dumneavoastră o verificăm la vizionare.",
    discuss: "Discutăm modelul meu la vizionare",
    advanced: "Calcul extins",
    advLead: "Cheltuielile fixe și CAPEX-ul de lansare — pentru pragul de rentabilitate și recuperarea investiției.",
    adv: { days: "Zile lucrătoare pe lună", rent: "Chiria pe lună", opex: "Cheltuieli de exploatare", payroll: "Fondul de salarii", utilities: "Utilități", marketing: "Marketing", other: "Alte cheltuieli fixe", capex: "CAPEX de lansare" },
    rentHint: "Ipoteza dumneavoastră — condițiile comerciale se discută după o primă verificare a formatului.",
    advOut: { beRevenue: "Venitul de prag", beVisitors: "Vizitatori pentru pragul de rentabilitate", result: "Rezultat operațional (estimare)", payback: "Recuperarea CAPEX" },
    perDayShort: "pe zi",
    needMargin: "Indicați marja brută pentru a calcula pragul de rentabilitate.",
    needFixed: "Indicați cheltuielile fixe — chiria, salariile și celelalte — pentru a calcula pragul de rentabilitate.",
    noPayback: "Recuperarea CAPEX nu se calculează când rezultatul operațional este negativ.",
    closing: "Locația este doar o parte a economiei punctului.",
    disclaimer: [
      "Venitul depinde de produs, prețuri, echipă, marketing, conversie, sezonalitate și alți factori.",
      "Calculul este un instrument de evaluare preliminară și nu este o prognoză sau o garanție a rezultatului financiar.",
    ],
    handoff: "Primiți calculul împreună cu prezentarea obiectului",
    visit: (name) => `Vedeți ${name} personal`,
    lines: { business: "Format", revenue: "Venitul țintă pe lună", visitors: "Fluxul de clienți necesar", conversion: "Conversia din calcul", ticket: "Bonul mediu" },
    approx: "≈",
  },
  en: {
    kicker: "Unit economics · decision-support estimate",
    title: "How many customers a day will your business need?",
    principle: "This is not a sales forecast. It is a way to understand what level of customer activity your business model needs.",
    presetsLabel: "Format",
    presets: {
      retail: { label: "Retail", ticket: "average purchase", conversion: "share of visitors who buy", focal: (n) => (Math.round(n) === 1 ? "potential visitor a day" : "potential visitors a day") },
      showroom: { label: "Showroom", ticket: "average deal", conversion: "share of visits that end in a purchase", focal: (n) => (Math.round(n) === 1 ? "visit a day" : "visits a day") },
      services: { label: "Services", ticket: "average service ticket", conversion: "share of enquiries that become clients", focal: (n) => (Math.round(n) === 1 ? "enquiry a day" : "enquiries a day") },
      center: { label: "Customer centre", ticket: "average income per enquiry", conversion: "share of enquiries that bring income", focal: (n) => (Math.round(n) === 1 ? "enquiry a day" : "enquiries a day") },
    },
    example: "Example calculation",
    exampleNote: "Example calculation · illustrative figures, not a characteristic of Moscova 20",
    clear: "Clear",
    inputs: { ticket: "Average ticket", revenue: "Target revenue per month", margin: "Gross margin", conversion: "Conversion visitor → buyer" },
    units: { mdl: "MDL", pct: "%", days: "days", months: "months", mdlMonth: "MDL / month" },
    outputs: { perMonth: "Sales per month", perDay: "Sales per day" },
    daysNote: (days) => `Based on ${days} trading days a month — change it in the extended calculation.`,
    empty: "Enter the average ticket, revenue and conversion — or open the example calculation.",
    sensitivity: "If the conversion differs",
    sensitivityUnit: "visitors a day",
    need: (n, f) => `Your model needs roughly ${f} potential ${Math.round(n) === 1 ? "visitor" : "visitors"} a day.`,
    compare: "Compare with the location",
    status: { MODELLED: "Preliminary location analysis · modelled scenario", MEASURED: "MEGAPARC field count", VERIFIED: "Verified data" },
    figures: { pedestrians: "movements / day", vehicles: "vehicles / day" },
    compareText: (n) => `Your model needs about ${n} visitors a day. The location shows a certain level of activity, but how relevant this flow is to your audience has to be checked.`,
    compareNone: "Flow data will follow the MEGAPARC field count; we check how relevant the flow is to your audience at the viewing.",
    discuss: "Discuss my model at the viewing",
    advanced: "Extended calculation",
    advLead: "Fixed costs and launch CAPEX — to see the break-even point and the payback.",
    adv: { days: "Trading days per month", rent: "Monthly rent", opex: "Operating expenses", payroll: "Payroll", utilities: "Utilities", marketing: "Marketing", other: "Other fixed costs", capex: "Launch CAPEX" },
    rentHint: "Your assumption — commercial terms are discussed after a first check of your format.",
    advOut: { beRevenue: "Break-even revenue", beVisitors: "Break-even visitors", result: "Operating result (estimate)", payback: "CAPEX payback" },
    perDayShort: "a day",
    needMargin: "Enter the gross margin to calculate the break-even point.",
    needFixed: "Enter the fixed costs — rent, payroll and the rest — to calculate the break-even point.",
    noPayback: "CAPEX payback is not calculated while the operating result is negative.",
    closing: "The location is only one part of a unit's economics.",
    disclaimer: [
      "Revenue depends on the product, prices, team, marketing, conversion, seasonality and other factors.",
      "The calculation is a preliminary assessment tool, not a forecast or a guarantee of any financial result.",
    ],
    handoff: "Get the calculation with the property presentation",
    visit: (name) => `See ${name} in person`,
    lines: { business: "Format", revenue: "Target revenue per month", visitors: "Customer flow needed", conversion: "Conversion used", ticket: "Average ticket" },
    approx: "≈",
  },
};
