"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { CurrencyBar, currencyReportLines, useFx } from "@/components/currency-bar";
import { NumberInput, type NumberFormat } from "@/components/number-input";
import { T } from "@/data/leasing-experience-model";
import type { ModelPreset } from "@/data/land/model";
import { amountIn, convert, shown, type Currency } from "@/lib/currency";
import { breakEven, btsAnalysis, emptyInputs, maxLandValue, quarterly, run, sensitivity, variantOf, type InputKey, type Inputs, type ModelKey, type Summary, type VariantKey } from "@/lib/land-finance";
import { numberLocale, type Localized, type SiteLocale } from "@/lib/site-data";

/**
 * DEVELOPMENT CALCULATOR 2.0 (§10–§11) — the interface of src/lib/land-finance.ts. The only pre-filled value is the published site area;
 * a demonstration example loads only on request and is labelled on screen until the visitor changes a figure. Results: the project
 * without financing and the equity view apart, the land's economic value apart from the cash invested, the cost lines apart, the monthly
 * flows as a quarterly chart, realistic / optimistic / pessimistic, the sensitivity and the break-even point. Not a valuation, not an
 * offer, not a forecast — and never MEGAPARC's own figures.
 *
 * R2 (OWNER «DROCHIA MASTER TEMPLATE R2», 2026-11-23): the return WITH the land at its market (economic) value, the return on the
 * ADDITIONAL investment in construction (the same flows without the land line), the equity return, the MAXIMUM land value at the hurdle
 * rate (src/lib/land-finance.ts maxLandValue), the minimum BTS rent; MDL | EUR with the existing NBM mechanism (src/lib/currency.ts,
 * src/lib/nbm.ts, CurrencyBar — every money field keeps the value as typed and its currency, the engine computes in EUR, the results are
 * re-expressed; the demonstration values are euros); every field still holding a demonstration value carries a «демо» tag; the
 * calculation is sent from the visitor's own mail app or copied, exactly as on Moscova 20 — nothing is stored or sent by the site.
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
    landValue: L("Valoarea de piață (economică) a terenului", "Рыночная (экономическая) стоимость земли", "Market (economic) value of the land"),
    preMonths: L("Termenul proiectării și autorizării", "Срок проектирования и разрешений", "Design and permitting period"), buildMonths: L("Termenul construcției", "Срок строительства", "Construction period"), salesMonths: L("Perioada vânzărilor", "Период продаж", "Sales period"), leaseUp: L("Ocupare până la nivelul stabil", "Выход на стабильное заполнение", "Lease-up to stabilised occupancy"),
    price: L("Preț de vânzare", "Цена продажи", "Sale price"), commission: L("Costuri de vânzare", "Затраты на продажу", "Sales costs"),
    rent: L("Chirie", "Арендная ставка", "Rent"), occupancy: L("Ocupare stabilă", "Стабильное заполнение", "Stabilised occupancy"), opex: L("Costuri operaționale nerecuperabile", "Невозмещаемые операционные расходы", "Non-recoverable operating costs"), indexation: L("Indexare anuală", "Ежегодная индексация", "Annual indexation"), holdYears: L("Perioada de deținere", "Срок владения", "Hold period"), exitYield: L("Randament la ieșire", "Доходность на выходе (exit yield)", "Exit yield"), exitCosts: L("Costuri la ieșire", "Затраты на выходе", "Exit costs"),
    leaseYears: L("Durata contractului", "Срок договора", "Lease term"), target: L("Randamentul cerut de proprietar", "Требуемая доходность собственника", "Owner's required return"), rentBts: L("Chiria propusă (opțional)", "Предлагаемая ставка (необязательно)", "Proposed rent (optional)"),
    breakYear: L("Chiriașul pleacă după", "Арендатор уходит через", "The tenant leaves after"), voidMonths: L("Perioadă fără chiriaș", "Простой без арендатора", "Void period"), reletPct: L("Chiria la relocare", "Ставка при повторной сдаче", "Re-letting rent"), breakFee: L("Compensație la plecare", "Компенсация при уходе", "Termination fee"),
    ltc: L("Credit · din costurile de dezvoltare", "Кредит · доля от затрат на девелопмент", "Loan · share of the development cost"), interest: L("Dobânda anuală", "Ставка кредита, годовая", "Loan interest, annual"), tax: L("Impozit pe profit (ipoteză)", "Налог на прибыль (допущение)", "Profit tax (assumption)"), discount: L("Rata de actualizare pentru NPV", "Ставка дисконтирования для NPV", "Discount rate for NPV"),
  } as Record<string, Localized | Record<ModelKey, Localized>>,
  hints: {
    siteArea: L("datele publicate MEGAPARC", "опубликованные данные MEGAPARC", "MEGAPARC's published data"), coverage: L("nu este POT — POT se verifică", "не POT — POT проверяется", "not POT — POT is being verified"), floors: L("nu este regimul de înălțime", "не регламент высотности", "not the height limit"), gbaManual: L("înlocuiește ocuparea × nivelurile", "заменяет застройку × этажность", "replaces coverage × floors"),
    landValue: L("valoarea terenului deja deținut, dacă o includeți — nu este o evaluare MEGAPARC", "стоимость уже принадлежащего участка, если учитываете — это не оценка MEGAPARC", "the value of the land already owned, if you include it — not a MEGAPARC valuation"), contingency: L("o dată, pe cele cinci linii de mai sus", "один раз, на пять строк выше", "once, on the five lines above"), design: L("din construcție", "от строительства", "of construction"),
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
  r2: {
    demoTag: L("demo", "демо", "demo"),
    demoFields: L("Câmpurile cu valori demonstrative sunt marcate «demo».", "Поля с демонстрационными значениями отмечены «демо».", "Fields holding demonstration values are tagged «demo»."),
    landTitle: L("Terenul și randamentul", "Земля и доходность", "Land and return"),
    irrLand: L("Randamentul proiectului cu valoarea de piață a terenului (IRR)", "Доходность проекта с учётом рыночной стоимости земли (IRR)", "Project return with the land at market value (IRR)"),
    noLand: L("valoarea terenului nu este introdusă", "стоимость земли не задана", "land value not entered"),
    irrBuild: L("Randamentul investițiilor suplimentare în construcție (fără valoarea terenului)", "Доходность дополнительных инвестиций в строительство (без стоимости земли)", "Return on the additional investment in construction (without the land value)"),
    npvBuild: L("NPV al investițiilor suplimentare", "NPV дополнительных инвестиций", "NPV of the additional investment"),
    maxLand: L("Valoarea maximă admisibilă a terenului la randamentul de", "Максимально допустимая стоимость земли при доходности", "Maximum land value at a return of"),
    below: L("proiectul nu atinge rata nici cu terenul la zero", "проект не достигает нормы даже при нулевой стоимости земли", "the project misses the rate even with free land"),
    needRent: L("introduceți chiria propusă", "укажите предлагаемую ставку", "enter the proposed rent"),
    landOnce: L("Terenul se ia în calcul o singură dată: valoarea economică a terenului deja deținut — aport la luna 0; investițiile în bani — doar construcția și costurile.", "Земля учитывается один раз: экономическая стоимость уже принадлежащего участка — вклад в месяц 0; денежные вложения — только строительство и затраты.", "The land is counted once: the economic value of the land already owned is the contribution at month 0; the cash invested is the construction and the costs only."),
    moreDetails: L("Detaliile calculului: costuri, fluxuri, scenarii, sensibilitate", "Подробности расчёта: затраты, потоки, сценарии, чувствительность", "Calculation details: costs, flows, scenarios, sensitivity"),
    lessDetails: L("Ascundeți detaliile calculului", "Свернуть подробности расчёта", "Hide the calculation details"),
    send: {
      mail: L("Trimiteți calculul prin e-mail", "Отправить расчёт по e‑mail", "Send the calculation by e-mail"),
      copy: L("Copiați calculul", "Скопировать расчёт", "Copy the calculation"),
      note: L("Se deschide aplicația dumneavoastră de e-mail cu o scrisoare pregătită către MEGAPARC — verificați-o și trimiteți-o singur; destinatarul poate fi schimbat. Dacă aplicația nu s-a deschis sau textul e incomplet, copiați calculul.", "Откроется ваше почтовое приложение с готовым письмом в MEGAPARC — проверьте его и отправьте сами, адресата можно изменить. Если приложение не открылось или текст неполный, скопируйте расчёт.", "Your own mail app opens with a ready message to MEGAPARC — check it and send it yourself; the recipient can be changed. If the app did not open or the text is incomplete, copy the calculation."),
      copied: L("Calculul a fost copiat — inserați-l într-o scrisoare sau un mesaj.", "Расчёт скопирован — вставьте его в письмо или мессенджер.", "The calculation is copied — paste it into an e-mail or a message."),
      manual: L("Copierea automată nu a reușit — selectați textul de mai jos și copiați-l.", "Скопировать автоматически не удалось — выделите текст ниже и скопируйте его.", "Automatic copy failed — select the text below and copy it."),
      subject: L("{place} — calculul dezvoltării", "{place} — расчёт девелопмента", "{place} — development calculation"),
      title: L("{place} — calculul dezvoltării (modelul 2.0)", "{place} — расчёт девелопмента (модель 2.0)", "{place} — development calculation (model 2.0)"),
      source: L("Calculatorul MEGAPARC", "Калькулятор MEGAPARC", "MEGAPARC calculator"),
      date: L("data calculului", "дата расчёта", "date of calculation"),
      intro: L("Calcul ilustrativ pe ipotezele introduse — nu este o evaluare, o ofertă sau o recomandare de investiții.", "Иллюстративный расчёт по введённым допущениям — не оценка, не предложение и не инвестиционная рекомендация.", "An illustrative calculation on the entered assumptions — not a valuation, an offer or an investment recommendation."),
      model: L("Model", "Модель", "Model"),
      results: L("REZULTATE (fără TVA)", "РЕЗУЛЬТАТЫ (без НДС)", "RESULTS (excl. VAT)"),
      inputs: L("DATE INTRODUSE", "ИСХОДНЫЕ ДАННЫЕ", "INPUTS"),
      notes: L("REZERVE", "ОГОВОРКИ", "NOTES"),
    },
  },
  disclaimer: L("Calcul ilustrativ pe ipotezele vizitatorului sau pe un exemplu demonstrativ marcat. Nu este o evaluare, o ofertă, o prognoză a proiectului sau o recomandare de investiții. Toate sumele — fără TVA; impozitul este simplificat (fără amortizare și reportarea pierderilor). Parametrii de construire ai terenului (destinația, POT, CUT, înălțimea, rețelele) nu sunt stabiliți.", "Иллюстративный расчёт на допущениях посетителя или на отмеченном демонстрационном примере. Не оценка, не предложение, не прогноз проекта и не инвестиционная рекомендация. Все суммы — без НДС; налог упрощён (без амортизации и переноса убытков). Параметры застройки участка (назначение, POT, CUT, высотность, сети) не определены.", "An illustrative calculation on the visitor's assumptions or a labelled demonstration example. Not a valuation, an offer, a project forecast or an investment recommendation. All amounts excl. VAT; the tax is simplified (no depreciation, no loss carry-forward). The site's development parameters (use, POT, CUT, height, utilities) are not established."),
  method: L("Metodologie: fluxuri lunare; IRR anualizat (1 + m)^12 − 1; NPV la rata efectivă lunară; terenul — aport la luna 0, niciodată în CAPEX și nici deducere fiscală.", "Методика: помесячные потоки; IRR в годовом выражении (1 + m)^12 − 1; NPV по эффективной месячной ставке; земля — вклад в месяц 0, никогда не в CAPEX и не налоговый вычет.", "Method: monthly flows; IRR annualised (1 + m)^12 − 1; NPV at the effective monthly rate; land — a contribution at month 0, never in CAPEX and never a tax deduction."),
};

type UnitKey = "m2" | "pct" | "x" | "eurm2" | "eur" | "mo" | "yr" | "eurm2m";
type Field = { key: InputKey; unit: UnitKey; fmt: NumberFormat; hint?: Localized };
const moneyFmt: NumberFormat = { group: true, decimals: 0, maxInt: 12 };
const rate: NumberFormat = { group: false, decimals: 2, maxInt: 3 };
const area: NumberFormat = { group: true, decimals: 0, maxInt: 9 };
const whole: NumberFormat = { group: false, decimals: 0, maxInt: 3 };
const price: NumberFormat = { group: true, decimals: 2, maxInt: 7 };

const KEYS: InputKey[] = ["siteArea", "coverage", "floors", "gbaManual", "efficiency", "hard", "design", "networks", "landscaping", "permits", "contingency", "landValue", "preMonths", "buildMonths", "ltc", "interest", "tax", "discount", "price", "salesMonths", "commission", "rent", "occupancy", "leaseUp", "opex", "indexation", "holdYears", "exitYield", "exitCosts", "leaseYears", "target", "breakYear", "voidMonths", "reletPct", "breakFee"];
/** the money inputs: kept as typed with the currency they were typed in (src/lib/currency.ts); the engine reads them in EUR */
const MONEY = new Set<InputKey>(["hard", "networks", "landscaping", "permits", "landValue", "price", "rent"]);
type State = Record<InputKey, string>;
const toCanon = (x: number | undefined) => (x === undefined ? "" : String(x));
const parse = (s: string) => (s === "" || s === "." ? null : Number.isFinite(Number(s)) ? Number(s) : null);

export function DevelopmentModel({ locale, siteArea, presets, mailto, place }: { locale: SiteLocale; siteArea: number; presets: ModelPreset[]; /** the OWNER-confirmed address, passed by the server page */ mailto: string; place: string }) {
  const uid = useId();
  const root = useRef<HTMLDivElement>(null);
  const blank = (): State => Object.fromEntries(KEYS.map((k) => [k, k === "siteArea" ? String(siteArea) : ""])) as State;
  const [model, setModel] = useState<ModelKey>("sale");
  const [v, setV] = useState<State>(blank);
  /** the currency each money field was typed in */
  const [cur, setCur] = useState<Partial<Record<InputKey, Currency>>>({});
  const [display, setDisplay] = useState<Currency>("EUR");
  const [includeLand, setIncludeLand] = useState(true);
  const [demo, setDemo] = useState<string | null>(null);
  /** the inputs still holding a demonstration value (cleared one by one as the visitor types) */
  const [demoKeys, setDemoKeys] = useState<Set<InputKey>>(new Set());
  // phones open with the detailed tables folded (the key results stay visible). The results render only after the visitor's first
  // input, never in the server HTML, so reading the screen width here cannot cause a hydration mismatch.
  const [more, setMore] = useState(() => typeof window === "undefined" || !window.matchMedia("(max-width: 719.98px)").matches);
  const started = demoKeys.size > 0 || KEYS.some((k) => k !== "siteArea" && v[k] !== "");
  const fx = useFx(started);
  const R = fx.rate;
  const nf = useMemo(() => new Intl.NumberFormat(numberLocale(locale), { maximumFractionDigits: 0 }), [locale]);
  const pf = useMemo(() => new Intl.NumberFormat(numberLocale(locale), { minimumFractionDigits: 1, maximumFractionDigits: 1 }), [locale]);
  const rf = useMemo(() => new Intl.NumberFormat(numberLocale(locale), { minimumFractionDigits: 2, maximumFractionDigits: 2 }), [locale]);
  const sym = display === "EUR" ? "€" : "MDL";
  const m2 = locale === "ru" ? "м²" : "m²";
  /** an engine amount (EUR) in the display currency */
  const toDisplay = (x: number) => convert(x, "EUR", display, R);
  const cash = (x: number) => `${x < 0 ? "−" : ""}${nf.format(Math.abs(Math.round(toDisplay(x))))} ${sym}`;
  const pct = (x: number | null) => (x === null ? t.out.notDefined[locale] : `${x < 0 ? "−" : ""}${pf.format(Math.abs(x * 100))} %`);
  const unitRent = display === "EUR" ? (locale === "ru" ? "€/м²·мес." : locale === "ro" ? "€/m²·lună" : "€/m²·month") : (locale === "ru" ? "MDL/м²·мес." : locale === "ro" ? "MDL/m²·lună" : "MDL/m²·month");
  const unitPrice = `${sym}/${m2}`;
  const perM2 = (x: number) => rf.format(toDisplay(x));
  const unitText = (u: UnitKey) => (u === "eurm2" ? unitPrice : u === "eur" ? sym : u === "eurm2m" ? unitRent : t.u[u][locale]);

  const load = (preset: ModelPreset) => {
    setModel(preset.model);
    setV({ ...blank(), ...Object.fromEntries(Object.entries(preset.values).map(([k, x]) => [k, toCanon(x)])) } as State);
    // the demonstration values are euros: they stay euros under the switch (re-expressed, never re-typed)
    setCur(Object.fromEntries(Object.keys(preset.values).filter((k) => MONEY.has(k as InputKey)).map((k) => [k, "EUR"])) as Partial<Record<InputKey, Currency>>);
    setIncludeLand(true);
    setDemo(preset.key);
    setDemoKeys(new Set(Object.keys(preset.values) as InputKey[]));
  };
  // a scenario card asks for its model and example (src/components/land-experience/interactive.tsx)
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
    for (const k of KEYS) (i as Record<InputKey, number | null>)[k] = MONEY.has(k) ? amountIn({ v: v[k], c: cur[k] ?? display }, "EUR", R) : parse(v[k]);
    i.includeLand = includeLand;
    return i;
  }, [v, cur, display, R, model, includeLand]);
  const result = useMemo(() => run(inputs), [inputs]);
  const bts = useMemo(() => (model === "bts" ? btsAnalysis(inputs) : null), [inputs, model]);
  const residual = useMemo(() => maxLandValue(inputs), [inputs]);
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
  const isDemo = demoKeys.size > 0;
  const landGiven = includeLand && (inputs.landValue ?? 0) > 0;

  const set = (key: InputKey) => (canonical: string) => {
    setV((old) => ({ ...old, [key]: canonical }));
    if (MONEY.has(key)) setCur((old) => ({ ...old, [key]: display }));
    setDemoKeys((old) => { if (!old.has(key)) return old; const next = new Set(old); next.delete(key); return next; });
  };
  const label = (key: InputKey) => {
    const l = t.f[key === "rent" && model === "bts" ? "rentBts" : key];
    return (("ro" in (l as object)) ? (l as Localized) : (l as Record<ModelKey, Localized>)[model])[locale];
  };
  const fieldValue = (key: InputKey) => (MONEY.has(key) ? shown({ v: v[key], c: cur[key] ?? display }, display, R) : v[key]);
  const field = ({ key, unit, fmt, hint }: Field) => (
    <div className={`lx-field${demoKeys.has(key) ? " is-demo" : ""}`} key={key}>
      <label htmlFor={`${uid}-${key}`}>{label(key)}{demoKeys.has(key) ? <em className="lx-field__demo">{t.r2.demoTag[locale]}</em> : null}</label>
      <span className={`lx-field__box${!result.ok && result.issues.some((x) => x.key === key && x.kind === "range") ? " is-bad" : ""}`}>
        <NumberInput id={`${uid}-${key}`} className="lx-field__input" value={fieldValue(key)} onValueChange={set(key)} locale={locale} format={fmt} describedBy={hint ? `${uid}-${key}-h` : undefined} />
        <span aria-hidden="true">{unitText(unit)}</span>
      </span>
      {hint ? <span className="lx-field__hint" id={`${uid}-${key}-h`}>{hint[locale]}</span> : null}
    </div>
  );
  const siteFields: Field[] = [{ key: "siteArea", unit: "m2", fmt: area, hint: t.hints.siteArea }, { key: "coverage", unit: "pct", fmt: rate, hint: t.hints.coverage }, { key: "floors", unit: "x", fmt: rate, hint: t.hints.floors }, { key: "gbaManual", unit: "m2", fmt: area, hint: t.hints.gbaManual }, { key: "efficiency", unit: "pct", fmt: rate }];
  const costFields: Field[] = [{ key: "hard", unit: "eurm2", fmt: price }, { key: "design", unit: "pct", fmt: rate, hint: t.hints.design }, { key: "networks", unit: "eur", fmt: moneyFmt }, { key: "landscaping", unit: "eur", fmt: moneyFmt }, { key: "permits", unit: "eur", fmt: moneyFmt }, { key: "contingency", unit: "pct", fmt: rate, hint: t.hints.contingency }];
  const timeFields: Field[] = [{ key: "preMonths", unit: "mo", fmt: whole }, { key: "buildMonths", unit: "mo", fmt: whole }, ...(model === "sale" ? [{ key: "salesMonths", unit: "mo", fmt: whole } as Field] : model === "hold" ? [{ key: "leaseUp", unit: "mo", fmt: whole } as Field] : [])];
  const exitFields: Record<ModelKey, Field[]> = {
    sale: [{ key: "price", unit: "eurm2", fmt: price }, { key: "commission", unit: "pct", fmt: rate }],
    hold: [{ key: "rent", unit: "eurm2m", fmt: price }, { key: "occupancy", unit: "pct", fmt: rate }, { key: "opex", unit: "pct", fmt: rate }, { key: "indexation", unit: "pct", fmt: rate }, { key: "holdYears", unit: "yr", fmt: whole }, { key: "exitYield", unit: "pct", fmt: rate }, { key: "exitCosts", unit: "pct", fmt: rate }],
    bts: [{ key: "leaseYears", unit: "yr", fmt: whole }, { key: "indexation", unit: "pct", fmt: rate }, { key: "target", unit: "pct", fmt: rate }, { key: "opex", unit: "pct", fmt: rate, hint: t.hints.opexBts }, { key: "exitYield", unit: "pct", fmt: rate }, { key: "exitCosts", unit: "pct", fmt: rate }, { key: "rent", unit: "eurm2m", fmt: price, hint: t.hints.rentBts }],
  };
  const earlyFields: Field[] = [{ key: "breakYear", unit: "yr", fmt: whole }, { key: "voidMonths", unit: "mo", fmt: whole }, { key: "reletPct", unit: "pct", fmt: rate }, { key: "breakFee", unit: "mo", fmt: whole, hint: t.hints.breakFee }];
  const financeFields: Field[] = [{ key: "ltc", unit: "pct", fmt: rate }, { key: "interest", unit: "pct", fmt: rate }, { key: "tax", unit: "pct", fmt: rate }, ...(model !== "bts" ? [{ key: "discount", unit: "pct", fmt: rate } as Field] : [])];
  const issues = result.ok ? [] : result.issues;
  const issueLabel = (key: string) => (key === "gba" ? t.gba[locale] : key === "break" ? t.breakRange[locale] : label(key as InputKey));
  const presetList = presets.filter((p) => p.model === model);
  const hurdleText = residual.hurdle !== null ? `${pf.format(residual.hurdle)} %` : "—";
  const residualText = residual.value === null ? (model === "bts" ? t.r2.needRent[locale] : "—") : residual.belowHurdle ? t.r2.below[locale] : cash(residual.value);

  // the calculation as text — for the visitor's own mail app and the clipboard (no personal data, no internal value; the demonstration flagged)
  const report = shownSummary && ledger && ledger.ok ? (() => {
    const s = shownSummary;
    // built only in the browser (a result exists only after an input): the page address and the date of the calculation
    const pageUrl = typeof window === "undefined" ? "" : window.location.href.split("#")[0];
    const today = new Date().toLocaleDateString("ru-RU");
    const lines: string[] = [t.r2.send.title[locale].replace("{place}", place), `${t.r2.send.source[locale]} · ${t.r2.send.date[locale]} ${today}`, pageUrl, t.r2.send.intro[locale], ...currencyReportLines(locale, display, fx), `${t.r2.send.model[locale]}: ${t.models[model][locale]}`];
    if (isDemo) lines.push(t.demoNote[locale]);
    lines.push("", t.r2.send.results[locale]);
    const row = (k: string, x: string) => lines.push(`- ${k}: ${x}`);
    if (model === "bts" && bts?.minRent != null) row(t.out.minRent[locale], `${perM2(bts.minRent)} ${unitRent}`);
    row(t.r2.irrLand[locale] + (landGiven ? "" : ` (${t.r2.noLand[locale]})`), pct(s.irrProject));
    row(t.r2.irrBuild[locale], `${pct(s.irrCash)} · NPV ${cash(s.npvCash)}`);
    row(t.out.irrEquity[locale], pct(s.irrEquity));
    row(t.out.npv[locale], cash(s.npv));
    row(`${t.r2.maxLand[locale]} ${hurdleText}`, residualText);
    if (s.noiStabilised) row(t.out.noi[locale], `${cash(s.noiStabilised)} · ${t.out.yoc[locale]} ${pct(s.yieldOnCost)}`);
    row(t.out.profit[locale], cash(s.profit));
    row(t.out.roi[locale], pct(s.roi));
    row(t.costs.cash[locale], cash(s.costs.cash));
    row(t.costs.land[locale], cash(s.costs.land));
    row(t.costs.interest[locale], cash(s.costs.interest));
    row(t.costs.tax[locale], cash(s.costs.tax));
    row(t.costs.revenue[model][locale], cash(s.revenue));
    if (extras && model !== "bts") lines.push(`- ${t.variants.title[locale]} (IRR): ${extras.variants.map((x) => `${t.variants[x.k][locale]} ${x.r?.ok ? pct(x.r.summary.irrProject) : "—"}`).join(" · ")}`);
    lines.push("", t.r2.send.inputs[locale]);
    for (const k of KEYS) {
      const val = MONEY.has(k) ? amountIn({ v: v[k], c: cur[k] ?? display }, display, R) : parse(v[k]);
      if (val === null || (model !== "bts" && ["leaseYears", "target", "breakYear", "voidMonths", "reletPct", "breakFee"].includes(k)) || (model !== "sale" && ["price", "salesMonths", "commission"].includes(k)) || (model === "sale" && ["rent", "occupancy", "leaseUp", "opex", "indexation", "holdYears", "exitYield", "exitCosts"].includes(k))) continue;
      const u = [...siteFields, ...costFields, ...timeFields, ...exitFields[model], ...earlyFields, ...financeFields, { key: "landValue", unit: "eur" } as Field].find((f) => f.key === k)?.unit;
      lines.push(`- ${label(k)}: ${MONEY.has(k) ? rf.format(val).replace(/,00$/, "").replace(/\.00$/, "") : rf.format(val).replace(/[.,]00$/, "")}${u ? ` ${unitText(u)}` : ""}${demoKeys.has(k) ? ` (${t.r2.demoTag[locale]})` : ""}`);
    }
    lines.push("", t.r2.send.notes[locale], `- ${t.disclaimer[locale]}`, `- ${t.method[locale]}`, `- ${t.r2.landOnce[locale]}`);
    return lines.join("\n");
  })() : null;
  const enc = (text: string) => encodeURIComponent(text).replace(/[!'()*]/g, (ch) => `%${ch.charCodeAt(0).toString(16).toUpperCase()}`);
  const mailHref = report ? `${mailto}?subject=${enc(t.r2.send.subject[locale].replace("{place}", place))}&body=${enc(report.replace(/\n/g, "\r\n"))}` : "";
  const [copied, setCopied] = useState<{ text: string; ok: boolean } | null>(null);
  const copyReport = () => {
    if (!report) return;
    const text = report;
    const bySelection = () => {
      const ta = document.createElement("textarea");
      ta.value = text; ta.setAttribute("readonly", ""); ta.style.position = "fixed"; ta.style.top = "0"; ta.style.opacity = "0";
      document.body.appendChild(ta); ta.select();
      let ok = false;
      try { ok = document.execCommand("copy"); } catch { ok = false; }
      ta.remove();
      setCopied({ text, ok });
    };
    if (navigator.clipboard?.writeText) navigator.clipboard.writeText(text).then(() => setCopied({ text, ok: true }), bySelection);
    else bySelection();
  };
  const copyNow = copied && copied.text === report ? copied : null;

  return (
    <div className="lx-model" ref={root}>
      <div className="lx-model__head">
        <div className="lx-model__tabs" role="tablist" aria-label={t.label[locale]}>
          {(["sale", "hold", "bts"] as ModelKey[]).map((m) => (
            <button key={m} type="button" role="tab" aria-selected={model === m} className={model === m ? "is-on" : undefined} onClick={() => { setModel(m); setDemo(null); setDemoKeys(new Set()); }}>
              <span>{t.models[m][locale]}</span>
              <em>{t.modelLine[m][locale]}</em>
            </button>
          ))}
        </div>
        <CurrencyBar locale={locale} currency={display} onCurrency={setDisplay} fx={fx} className="lx-model__cur" />
        <div className="lx-model__tools">
          {presetList.map((p) => <button key={p.key} type="button" className={`lx-model__demo${demo === p.key && isDemo ? " is-on" : ""}`} onClick={() => load(p)}>{t.demo[locale]} · {p.label[locale]}</button>)}
          <button type="button" className="lx-model__clear" onClick={() => { setV(blank()); setCur({}); setDemo(null); setDemoKeys(new Set()); }}>{t.clear[locale]}</button>
        </div>
        {isDemo ? <p className="lx-model__demo-note" role="status">{t.demoNote[locale]} {t.r2.demoFields[locale]}</p> : null}
      </div>

      <div className="lx-model__grid">
        <div className="lx-model__inputs">
          <fieldset className="lx-group"><legend>{t.groups.site[locale]}</legend><div className="lx-group__grid">{siteFields.map(field)}</div></fieldset>
          <fieldset className="lx-group"><legend>{t.groups.cost[locale]}</legend><div className="lx-group__grid">{costFields.map(field)}</div></fieldset>
          <fieldset className="lx-group">
            <legend>{t.groups.land[locale]}</legend>
            <div className="lx-group__grid">
              {field({ key: "landValue", unit: "eur", fmt: moneyFmt, hint: t.hints.landValue })}
              <label className="lx-check"><input type="checkbox" checked={includeLand} onChange={(e) => setIncludeLand(e.target.checked)} /><span>{t.includeLand[locale]}</span></label>
            </div>
            <p className="lx-group__note">{t.r2.landOnce[locale]}</p>
          </fieldset>
          <fieldset className="lx-group"><legend>{t.groups.time[locale]}</legend><div className="lx-group__grid">{timeFields.map(field)}</div></fieldset>
          <fieldset className="lx-group"><legend>{t.groups.exit[model][locale]}</legend><div className="lx-group__grid">{exitFields[model].map(field)}</div></fieldset>
          {model === "bts" ? <fieldset className="lx-group"><legend>{t.groups.early[locale]}</legend><div className="lx-group__grid">{earlyFields.map(field)}</div></fieldset> : null}
          <details className="lx-group lx-group--fold" open={isDemo || undefined}>
            <summary>{t.groups.finance[locale]} · {t.advanced[locale]}</summary>
            <div className="lx-group__grid">{financeFields.map(field)}</div>
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
            <>
              <Results
                locale={locale}
                model={model}
                s={shownSummary}
                ledger={ledger.ledger}
                bts={bts}
                extras={extras}
                fmt={{ eur: cash, pct, nf, pf, rf, unitRent, unitPrice, perM2, sym, toDisplay }}
                demo={isDemo}
                land={{ given: landGiven, residualText, hurdleText }}
                more={more}
                onMore={() => setMore((x) => !x)}
              />
              {report ? (
                <section className="lx-send" aria-label={t.r2.send.mail[locale]}>
                  <div className="lx-send__actions">
                    <a className="lx-btn lx-btn--dark" href={mailHref}><span>{t.r2.send.mail[locale]}</span></a>
                    <button type="button" className="lx-btn lx-btn--ghost" onClick={copyReport}><span>{t.r2.send.copy[locale]}</span></button>
                  </div>
                  <p className="lx-send__note">{t.r2.send.note[locale]}</p>
                  <p className="lx-send__status" role="status">{copyNow ? (copyNow.ok ? t.r2.send.copied[locale] : t.r2.send.manual[locale]) : ""}</p>
                  {copyNow && !copyNow.ok ? <textarea className="lx-send__text" readOnly value={report} aria-label={t.r2.send.copy[locale]} onFocus={(e) => e.currentTarget.select()} /> : null}
                </section>
              ) : null}
            </>
          )}
          <p className="lx-out__disclaimer">{t.disclaimer[locale]}</p>
          <p className="lx-out__method">{t.method[locale]}</p>
        </div>
      </div>
    </div>
  );
}

type Fmt = { eur: (x: number) => string; pct: (x: number | null) => string; nf: Intl.NumberFormat; pf: Intl.NumberFormat; rf: Intl.NumberFormat; unitRent: string; unitPrice: string; perM2: (x: number) => string; sym: string; toDisplay: (x: number) => number };

function Results({ locale, model, s, ledger, bts, extras, fmt, demo, land, more, onMore }: { locale: SiteLocale; model: ModelKey; s: Summary; ledger: import("@/lib/land-finance").Ledger; bts: ReturnType<typeof btsAnalysis> | null; extras: { variants: { k: VariantKey; r: ReturnType<typeof run> | null; b: ReturnType<typeof btsAnalysis> | null }[]; sens: ReturnType<typeof sensitivity>; be: ReturnType<typeof breakEven> } | null; fmt: Fmt; demo: boolean; land: { given: boolean; residualText: string; hurdleText: string }; more: boolean; onMore: () => void }) {
  const { eur, pct, nf, unitRent, unitPrice, perM2 } = fmt;
  const payback = model === "sale" ? (s.paybackMonths === null ? t.out.notWithin[locale] : `${s.paybackMonths} ${t.out.months[locale]}`) : s.paybackMonths === null ? t.out.notWithin[locale] : `${fmt.pf.format((s.paybackMonths - ledger.completion) / 12)} ${t.out.yearsOpen[locale]}`;
  const kpis: { k: string; label: string; value: string; accent?: boolean }[] =
    model === "sale"
      ? [{ k: "profit", label: t.out.profit[locale], value: eur(s.profit), accent: true }, { k: "irr", label: t.out.irrProject[locale], value: pct(s.irrProject) }, { k: "eq", label: t.out.irrEquity[locale], value: pct(s.irrEquity) }, { k: "npv", label: t.out.npv[locale], value: eur(s.npv) }]
      : model === "hold"
        ? [{ k: "noi", label: t.out.noi[locale], value: eur(s.noiStabilised ?? 0), accent: true }, { k: "yoc", label: t.out.yoc[locale], value: pct(s.yieldOnCost) }, { k: "irr", label: t.out.irrProject[locale], value: pct(s.irrProject) }, { k: "npv", label: t.out.npv[locale], value: eur(s.npv) }]
        : [{ k: "min", label: t.out.minRent[locale], value: bts?.minRent !== null && bts?.minRent !== undefined ? `${perM2(bts.minRent)} ${unitRent}` : t.out.notDefined[locale], accent: true }, { k: "irr", label: `${t.out.irrProject[locale]} · ${t.out.atRent[locale]} ${bts?.rent ? perM2(bts.rent) : "—"}`, value: pct(s.irrProject) }, { k: "inv", label: t.out.investment[locale], value: eur(s.costs.economic) }, { k: "yoc", label: t.out.yoc[locale], value: pct(s.yieldOnCost) }];
  const secondary: { label: string; value: string }[] =
    model === "sale"
      ? [{ label: t.out.roi[locale], value: pct(s.roi) }, { label: t.out.margin[locale], value: pct(s.marginOnRevenue) }, { label: t.out.peak[locale], value: eur(s.peakEquity) }, { label: t.out.payback[locale], value: payback }]
      : model === "hold"
        ? [{ label: t.out.irrEquity[locale], value: pct(s.irrEquity) }, { label: t.out.terminal[locale], value: eur(s.terminalValue ?? 0) }, { label: t.out.payback[locale], value: payback }, { label: t.out.simple[locale], value: s.simplePaybackYears === null ? t.out.notDefined[locale] : `${fmt.pf.format(s.simplePaybackYears)} ${t.u.yr[locale]}` }, { label: t.out.profit[locale], value: eur(s.profit) }]
        : [{ label: t.out.rentYear[locale], value: eur((bts?.rent ?? 0) * s.net * 12) }, { label: t.out.npv[locale], value: eur(s.npv) }, { label: t.out.irrEquity[locale], value: pct(s.irrEquity) }, { label: t.out.terminal[locale], value: eur(s.terminalValue ?? 0) }, { label: t.out.peak[locale], value: eur(s.peakEquity) }];
  const q = quarterly(ledger);
  const costRows: [string, number][] = [
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

      <div className="lx-out__card lx-out__land">
        <p className="lx-out__h">{t.r2.landTitle[locale]}</p>
        <dl className="lx-costs">
          <div className="is-sum"><dt>{t.r2.irrLand[locale]}{land.given ? "" : <span className="lx-out__muted"> · {t.r2.noLand[locale]}</span>}</dt><dd>{pct(s.irrProject)}</dd></div>
          <div className="is-sum"><dt>{t.r2.irrBuild[locale]}</dt><dd>{pct(s.irrCash)}</dd></div>
          <div><dt>{t.r2.npvBuild[locale]}</dt><dd>{eur(s.npvCash)}</dd></div>
          <div className="is-sum"><dt>{t.out.irrEquity[locale]}</dt><dd>{pct(s.irrEquity)}</dd></div>
          <div className="is-sum is-wrap"><dt>{t.r2.maxLand[locale]} {land.hurdleText}</dt><dd>{land.residualText}</dd></div>
        </dl>
        <p className="lx-note">{t.r2.landOnce[locale]}</p>
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

      <button type="button" className="lx-out__more" aria-expanded={more} onClick={onMore}>{more ? t.r2.lessDetails[locale] : t.r2.moreDetails[locale]}</button>
      {more ? (
        <>
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
                        <tr><th>{t.out.minRent[locale]}</th>{extras.variants.map((x) => <td key={x.k}>{x.b?.minRent != null ? perM2(x.b.minRent) : "—"}</td>)}</tr>
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
                        const better = row.key === "revenue" ? row.high : row.low;
                        const worse = row.key === "revenue" ? row.low : row.high;
                        if (model === "bts") return <tr key={row.key}><th>{name} · {t.sens.minRentLow[locale]}</th><td>{row.lowBts != null ? perM2(row.lowBts) : "—"}</td><td>{row.highBts != null ? perM2(row.highBts) : "—"}</td></tr>;
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
                      <div><dt>{t.be.priceNpv[locale]}</dt><dd>{extras.be.priceNpv != null ? `${perM2(extras.be.priceNpv)} ${unitPrice}` : t.be.none[locale]}</dd></div>
                      <div><dt>{t.be.priceProfit[locale]}</dt><dd>{extras.be.priceProfit != null ? `${perM2(extras.be.priceProfit)} ${unitPrice}` : t.be.none[locale]}</dd></div>
                    </>
                  ) : model === "hold" ? (
                    <>
                      <div><dt>{t.be.rentNpv[locale]}</dt><dd>{extras.be.rentNpv != null ? `${perM2(extras.be.rentNpv)} ${unitRent}` : t.be.none[locale]}</dd></div>
                      <div><dt>{t.be.occNpv[locale]}</dt><dd>{extras.be.occupancyNpv != null ? `${fmt.pf.format(extras.be.occupancyNpv)} %` : t.be.none[locale]}</dd></div>
                    </>
                  ) : (
                    <div className="is-note"><dt>{t.be.btsNote[locale]}</dt><dd>{bts?.minRent != null ? `${perM2(bts.minRent)} ${unitRent}` : t.be.none[locale]}</dd></div>
                  )}
                </dl>
              </div>
            </>
          ) : null}
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
