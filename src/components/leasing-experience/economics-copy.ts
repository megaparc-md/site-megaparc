import type { SiteLocale } from "@/lib/site-data";

/**
 * Words of the economics tool «Проверить экономику точки» (OWNER addendum
 * "TENANT ECONOMICS & DECISION TOOL", 2026-11-06). Interface vocabulary only —
 * no property fact, no rent, no forecast. Banned and absent: «мы рассчитаем
 * вашу прибыль», «точка окупится», «гарантированный доход», «ожидаемая прибыль
 * Moscova 20».
 */

export type PresetKey = "retail" | "showroom" | "services" | "center";
type Preset = { label: string; ticket: string; conversion: string; visitors: string };

type Copy = {
  kicker: string; sub: string; principle: string; presetsLabel: string; presets: Record<PresetKey, Preset>;
  example: string; exampleNote: string; clear: string;
  inputs: { ticket: string; margin: string; revenue: string; conversion: string };
  units: { mdl: string; pct: string; days: string; months: string };
  outputs: { perMonth: string; perDay: string };
  daysNote: (days: number) => string; empty: string;
  sensitivity: string; sensitivityUnit: string;
  need: (n: string) => string; compare: string;
  status: { MODELLED: string; MEASURED: string; VERIFIED: string };
  figures: { pedestrians: string; vehicles: string };
  compareText: (n: string) => string; compareNone: string; discuss: string;
  advanced: string;
  adv: { days: string; rent: string; opex: string; payroll: string; utilities: string; marketing: string; other: string; capex: string; payback: string };
  rentHint: string; perMonth: string;
  advOut: { beSales: string; transactions: string; flow: string; gross: string; capexTarget: string };
  needMargin: string;
  closing: string; disclaimer: string; handoff: string; visit: (name: string) => string;
  lines: { business: string; revenue: string; visitors: string; conversion: string; ticket: string };
  approx: string;
};

export const economicsCopy: Record<SiteLocale, Copy> = {
  ru: {
    kicker: "Экономика точки · оценка для принятия решения",
    sub: "Сколько клиентов в день потребуется именно вашему бизнесу?",
    principle: "Это не прогноз продаж. Это способ понять, какой уровень клиентской активности потребуется вашей бизнес-модели.",
    presetsLabel: "Формат",
    presets: {
      retail: { label: "Ритейл", ticket: "средняя покупка", conversion: "доля посетителей, которые покупают", visitors: "Посетителей в день" },
      showroom: { label: "Шоурум", ticket: "средняя сделка", conversion: "доля визитов, которые заканчиваются покупкой", visitors: "Визитов в день" },
      services: { label: "Услуги", ticket: "средний чек услуги", conversion: "доля обратившихся, которые становятся клиентами", visitors: "Обращений в день" },
      center: { label: "Клиентский центр", ticket: "средний доход с обращения", conversion: "доля обращений, которые приносят доход", visitors: "Обращений в день" },
    },
    example: "Пример расчёта",
    exampleNote: "Пример расчёта · условные цифры, не характеристика Moscova 20",
    clear: "Очистить",
    inputs: { ticket: "Средний чек", margin: "Валовая маржа", revenue: "Желаемая выручка в месяц", conversion: "Конверсия посетитель → покупатель" },
    units: { mdl: "MDL", pct: "%", days: "дней", months: "мес." },
    outputs: { perMonth: "Нужно продаж в месяц", perDay: "В день" },
    daysNote: (days) => `Из расчёта ${days} рабочих дней в месяц — меняется в расширенном расчёте.`,
    empty: "Введите средний чек, выручку и конверсию — или откройте пример.",
    sensitivity: "Если конверсия будет другой",
    sensitivityUnit: "в день",
    need: (n) => `Для вашей модели требуется примерно ${n} потенциальных посетителей в день.`,
    compare: "Сравнить с локацией",
    status: { MODELLED: "Предварительный анализ локации · моделируемый сценарий", MEASURED: "Полевой замер MEGAPARC", VERIFIED: "Проверенные данные" },
    figures: { pedestrians: "перемещений / сутки", vehicles: "авто / сутки" },
    compareText: (n) => `Вашей модели требуется около ${n} посетителей в день. Локация показывает определённый уровень активности, но релевантность этого потока для вашей аудитории необходимо проверить.`,
    compareNone: "Данные о потоке появятся после полевого замера MEGAPARC; релевантность потока для вашей аудитории проверим на просмотре.",
    discuss: "Обсудить мою модель на просмотре",
    advanced: "Расширенный расчёт",
    adv: { days: "Рабочих дней в месяц", rent: "Аренда", opex: "Эксплуатационные расходы", payroll: "ФОТ", utilities: "Коммунальные платежи", marketing: "Маркетинг", other: "Прочие постоянные расходы", capex: "CAPEX запуска", payback: "Срок возврата CAPEX" },
    rentHint: "ваше допущение — условия сообщаем после первичной проверки формата",
    perMonth: "в месяц",
    advOut: { beSales: "Безубыточность · продаж в месяц", transactions: "Нужно транзакций в день", flow: "Нужно клиентского потока в день", gross: "Нужно валовой прибыли в месяц", capexTarget: "Цель возврата CAPEX в месяц" },
    needMargin: "Укажите валовую маржу — без неё безубыточность не считается.",
    closing: "Локация — только одна часть экономики точки.",
    disclaimer: "Выручка зависит от продукта, цен, команды, маркетинга, конверсии, сезонности и других факторов. Расчёт не является прогнозом или гарантией финансового результата.",
    handoff: "Получить расчёт с презентацией объекта",
    visit: (name) => `Посмотреть ${name} лично`,
    lines: { business: "Формат", revenue: "Целевая выручка в месяц", visitors: "Требуемый клиентский поток", conversion: "Конверсия в расчёте", ticket: "Средний чек" },
    approx: "≈",
  },
  ro: {
    kicker: "Economia punctului · estimare pentru decizie",
    sub: "Câți clienți pe zi îi vor trebui afacerii dumneavoastră?",
    principle: "Nu este o prognoză de vânzări. Este un mod de a înțelege ce nivel de activitate a clienților îi trebuie modelului dumneavoastră de afaceri.",
    presetsLabel: "Format",
    presets: {
      retail: { label: "Retail", ticket: "cumpărătura medie", conversion: "partea vizitatorilor care cumpără", visitors: "Vizitatori pe zi" },
      showroom: { label: "Showroom", ticket: "tranzacția medie", conversion: "partea vizitelor care se încheie cu o cumpărare", visitors: "Vizite pe zi" },
      services: { label: "Servicii", ticket: "bonul mediu al serviciului", conversion: "partea solicitanților care devin clienți", visitors: "Solicitări pe zi" },
      center: { label: "Centru pentru clienți", ticket: "venitul mediu pe solicitare", conversion: "partea solicitărilor care aduc venit", visitors: "Solicitări pe zi" },
    },
    example: "Exemplu de calcul",
    exampleNote: "Exemplu de calcul · cifre convenționale, nu o caracteristică a Moscova 20",
    clear: "Golește",
    inputs: { ticket: "Bonul mediu", margin: "Marja brută", revenue: "Venitul dorit pe lună", conversion: "Conversia vizitator → cumpărător" },
    units: { mdl: "MDL", pct: "%", days: "zile", months: "luni" },
    outputs: { perMonth: "Vânzări necesare pe lună", perDay: "Pe zi" },
    daysNote: (days) => `Pe baza a ${days} zile lucrătoare pe lună — se schimbă în calculul extins.`,
    empty: "Introduceți bonul mediu, venitul și conversia — sau deschideți exemplul.",
    sensitivity: "Dacă conversia va fi alta",
    sensitivityUnit: "pe zi",
    need: (n) => `Modelului dumneavoastră îi trebuie aproximativ ${n} vizitatori potențiali pe zi.`,
    compare: "Comparați cu locația",
    status: { MODELLED: "Analiză preliminară a locației · scenariu modelat", MEASURED: "Numărătoare pe teren MEGAPARC", VERIFIED: "Date verificate" },
    figures: { pedestrians: "deplasări / zi", vehicles: "auto / zi" },
    compareText: (n) => `Modelului dumneavoastră îi trebuie circa ${n} vizitatori pe zi. Locația arată un anumit nivel de activitate, dar relevanța acestui flux pentru publicul dumneavoastră trebuie verificată.`,
    compareNone: "Datele despre flux apar după numărătoarea pe teren MEGAPARC; relevanța fluxului pentru publicul dumneavoastră o verificăm la vizionare.",
    discuss: "Discutăm modelul meu la vizionare",
    advanced: "Calcul extins",
    adv: { days: "Zile lucrătoare pe lună", rent: "Chiria", opex: "Cheltuieli de exploatare", payroll: "Salarii", utilities: "Utilități", marketing: "Marketing", other: "Alte cheltuieli fixe", capex: "CAPEX de lansare", payback: "Termenul de recuperare CAPEX" },
    rentHint: "ipoteza dumneavoastră — condițiile le comunicăm după o primă verificare a formatului",
    perMonth: "pe lună",
    advOut: { beSales: "Pragul de rentabilitate · vânzări pe lună", transactions: "Tranzacții necesare pe zi", flow: "Flux de clienți necesar pe zi", gross: "Profit brut necesar pe lună", capexTarget: "Ținta de recuperare CAPEX pe lună" },
    needMargin: "Indicați marja brută — fără ea pragul de rentabilitate nu se calculează.",
    closing: "Locația este doar o parte a economiei punctului.",
    disclaimer: "Venitul depinde de produs, prețuri, echipă, marketing, conversie, sezonalitate și alți factori. Calculul nu este o prognoză sau o garanție a rezultatului financiar.",
    handoff: "Primiți calculul împreună cu prezentarea obiectului",
    visit: (name) => `Vedeți ${name} personal`,
    lines: { business: "Format", revenue: "Venitul țintă pe lună", visitors: "Fluxul de clienți necesar", conversion: "Conversia din calcul", ticket: "Bonul mediu" },
    approx: "≈",
  },
  en: {
    kicker: "Unit economics · decision-support estimate",
    sub: "How many customers a day will your business need?",
    principle: "This is not a sales forecast. It is a way to understand what level of customer activity your business model needs.",
    presetsLabel: "Format",
    presets: {
      retail: { label: "Retail", ticket: "average purchase", conversion: "share of visitors who buy", visitors: "Visitors a day" },
      showroom: { label: "Showroom", ticket: "average deal", conversion: "share of visits that end in a purchase", visitors: "Visits a day" },
      services: { label: "Services", ticket: "average service ticket", conversion: "share of enquiries that become clients", visitors: "Enquiries a day" },
      center: { label: "Customer centre", ticket: "average income per enquiry", conversion: "share of enquiries that bring income", visitors: "Enquiries a day" },
    },
    example: "Example calculation",
    exampleNote: "Example calculation · illustrative figures, not a characteristic of Moscova 20",
    clear: "Clear",
    inputs: { ticket: "Average ticket", margin: "Gross margin", revenue: "Target revenue per month", conversion: "Conversion visitor → buyer" },
    units: { mdl: "MDL", pct: "%", days: "days", months: "months" },
    outputs: { perMonth: "Sales needed per month", perDay: "Per day" },
    daysNote: (days) => `Based on ${days} trading days a month — change it in the extended calculation.`,
    empty: "Enter the average ticket, revenue and conversion — or open the example.",
    sensitivity: "If the conversion differs",
    sensitivityUnit: "a day",
    need: (n) => `Your model needs roughly ${n} potential visitors a day.`,
    compare: "Compare with the location",
    status: { MODELLED: "Preliminary location analysis · modelled scenario", MEASURED: "MEGAPARC field count", VERIFIED: "Verified data" },
    figures: { pedestrians: "movements / day", vehicles: "vehicles / day" },
    compareText: (n) => `Your model needs about ${n} visitors a day. The location shows a certain level of activity, but how relevant this flow is to your audience has to be checked.`,
    compareNone: "Flow data will follow the MEGAPARC field count; we check how relevant the flow is to your audience at the viewing.",
    discuss: "Discuss my model at the viewing",
    advanced: "Extended calculation",
    adv: { days: "Trading days per month", rent: "Rent", opex: "Service costs", payroll: "Payroll", utilities: "Utilities", marketing: "Marketing", other: "Other fixed costs", capex: "Launch CAPEX", payback: "CAPEX payback period" },
    rentHint: "your assumption — we share the terms after a first check of your format",
    perMonth: "per month",
    advOut: { beSales: "Break-even · sales per month", transactions: "Transactions needed per day", flow: "Customer flow needed per day", gross: "Gross profit needed per month", capexTarget: "CAPEX recovery target per month" },
    needMargin: "Enter the gross margin — break-even cannot be calculated without it.",
    closing: "The location is only one part of a unit's economics.",
    disclaimer: "Revenue depends on the product, prices, team, marketing, conversion, seasonality and other factors. The calculation is not a forecast or a guarantee of any financial result.",
    handoff: "Get the calculation with the property presentation",
    visit: (name) => `See ${name} in person`,
    lines: { business: "Format", revenue: "Target revenue per month", visitors: "Customer flow needed", conversion: "Conversion used", ticket: "Average ticket" },
    approx: "≈",
  },
};
