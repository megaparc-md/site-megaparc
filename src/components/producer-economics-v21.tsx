"use client";

import { useId, useMemo, useState } from "react";
import { NumberInput, type NumberFormat } from "@/components/number-input";
import { calcV21, EMPTY_V21, EXAMPLE_V21, scenarioOf, SCENARIOS_V21, type ProducerInputsV21, type VatMode } from "@/lib/producer-economics-v21";
import type { SiteLocale } from "@/lib/site-data";
import { CurrencyBar, currencyCopy, currencyReportLines, useFx } from "@/components/currency-bar";
import { amountIn, convert, shown, type Currency } from "@/lib/currency";
import "@/app/producer-v21.css";

/**
 * PRODUCER CFO CALCULATOR v2.1 — «Торговые сети, собственный магазин или оба канала» (OWNER «FINAL 2-DAY DELIVERY MANDATE» §06,
 * 2026-11-14). Model: src/lib/producer-economics-v21.ts (spec docs/finance/PRODUCER_RETAIL_CFO_MODEL_V2_1_SPEC.md, verified
 * against the independent reference by scripts/qa-producer-v21.mjs). The visual system of the R10 prototype (pe-* in r10.css);
 * the VAT switch, the three-column comparison and the verdict in producer-v21.css. Every field a NumberInput (grouping while typing);
 * an answer appears only with its own inputs; nothing is stored or sent by the site — «Отправить расчёт по email» only opens the
 * visitor's own mail app with the calculation, «Скопировать расчёт» copies it. MEGAPARC is the owner and landlord, never the store operator.
 */

type NumKey = Exclude<keyof ProducerInputsV21, "vatMode">;
type Field = { key: NumKey; unit: string; format: NumberFormat };
const money: NumberFormat = { group: true, decimals: 2 };
const units: NumberFormat = { group: true, decimals: 0 };
const pct: NumberFormat = { group: false, decimals: 2, maxInt: 3 };
const days: NumberFormat = { group: false, decimals: 0, maxInt: 3 };
const monthsFormat: NumberFormat = { group: false, decimals: 0, maxInt: 2 };

type Lines = Record<NumKey, [string, string]>;
const copy = {
  ru: {
    badge: "Калькулятор производителя · предварительная оценка на ваших данных",
    title: "Торговые сети, собственный магазин или оба канала",
    lead: "Сравните три сценария на своих цифрах: операционный вклад, деньги на старте, безубыточность и срок окупаемости. Прибыль и деньги считаются раздельно.",
    principle: "Модель для первичной оценки, не прогноз продаж и не финансовая, налоговая или инвестиционная рекомендация. MEGAPARC — собственник и арендодатель помещения, не оператор магазина.",
    example: "Пример производителя", reset: "Сбросить",
    exampleNote: "Пример: условный производитель — цифры не являются рыночными данными. Аренда не подставлена: нажмите «Подставить предварительный расчёт Moscova 20» или введите свою.",
    groups: ["Продукт и торговые сети", "Собственный магазин", "Запуск"],
    m20: "Подставить предварительный расчёт Moscova 20",
    vat: { label: "Цены в магазине", gross: "с НДС", net: "без НДС", hint: "Розничную цену и средний чек вводите так, как их видит покупатель. Расчёт ведётся без НДС.", netOf: (x: string) => `без НДС: ${x}` },
    u: { eur: "€", eurMonth: "€ / мес", unitsMonth: "шт. / мес", eurUnit: "€ за шт.", pct: "%", pctYear: "% годовых", pctList: "% от прайса", pctGross: "% оборота с НДС", pctCogs: "% себестоимости", pctUtil: "% от коммунальных", days: "дней", perDay: "в день", daysMonth: "дней / мес", eurCheck: "€", monthsRent: "мес. аренды", months: "мес." },
    f: {
      chainUnits: ["Продажи через сети, в месяц", "в штуках"], listPrice: ["Отпускная цена сети за единицу", "без НДС"], unitCost: ["Себестоимость единицы", "без НДС; одна для обоих каналов"],
      discounts: ["Скидки и промо в накладной", ""], bonuses: ["Ретро‑бонусы", "выплачиваются после накладной"], chainFees: ["Листинг и маркетинг сети", "в месяц"],
      chainLogistics: ["Логистика до сети", ""], paymentDays: ["Отсрочка оплаты сети", ""], costOfMoney: ["Стоимость денег", "ставка кредита или альтернативная доходность"],
      vatRate: ["Ставка НДС", "стандартная — 20 %; для отдельных товаров действуют пониженные"], shelfPrice: ["Розничная цена единицы", "как на полке"], buyersPerDay: ["Покупателей в день", "план"],
      averageCheck: ["Средний чек", "как в чеке"], openDays: ["Дней работы в месяц", ""], rent: ["Аренда, в месяц", "базовая аренда, без НДС"],
      utilities: ["Коммунальные услуги", "по фактическим начислениям, без НДС"], utilitiesFee: ["Администрирование и обслуживание инженерных сетей", "Moscova 20: 15 % от коммунальных"],
      staff: ["Персонал с налогами", ""], marketing: ["Маркетинг магазина", ""], otherCosts: ["Прочие операционные расходы", "охрана, связь, касса и ПО, уборка, страхование"],
      storeDelivery: ["Доставка в магазин", "в месяц"], acquiring: ["Эквайринг", "комиссия банка с оплат картой"], losses: ["Потери и списания", "сроки годности, бой, брак"],
      stockDays: ["Запас для магазина", "в днях себестоимости"], cannibalisation: ["Каннибализация", "доля покупок магазина, которые иначе были бы сделаны в сети; 0 % — все продажи новые"],
      capex: ["Первоначальные инвестиции", "адаптация помещения, оборудование, вывеска — без запаса"], depositMonths: ["Гарантийный депозит", "в месяцах базовой аренды · возвращается"],
      preparationMonths: ["Месяцев подготовки до открытия", "аренда, коммунальные и персонал до первой продажи"], rampMonths: ["Месяцев до выхода на план", "выручка растёт равномерно"],
    } as Lines,
    cols: ["Только сети", "Только магазин", "Сети + магазин"],
    rows: { revenue: "Выручка без НДС", contribution: "Операционный вклад канала", margin: "Вклад, % выручки", unit: "Вклад на единицу", change: "Изменение к «только сети»", breakEven: "Безубыточность", wc: "Оборотный капитал", deposit: "Депозит · возвращается", start: "Деньги на старте", payInvest: "Окупаемость инвестиций", payAll: "Возврат всех денег старта", peak: "Пиковая потребность в деньгах", payDisc: "Окупаемость с учётом стоимости денег", tied: "Стоимость связанных денег, в месяц", cycle: "Денежный цикл" },
    perMonth: "в месяц", unitsShort: "шт. / мес", buyersShort: "покупателей в день",
    cycleChain: (d: string) => `оплата через ${d} дн.`, cycleStore: (d: string) => `деньги в день продажи · запас ${d} дн.`,
    months: (m: string) => `≈ ${m} мес.`, over60: "более 60 мес.", never: "не окупается за 10 лет", noPayback: "нет — прирост не положительный", peakNever: "растёт в течение всего горизонта — поток отрицательный", noRate: "укажите стоимость денег", impossibleCell: "недопустимый сценарий", noBreakEven: "не достигается",
    company: "Что меняется для компании", companyRows: { increment: "Прирост операционного вклада", lost: "Потерянный вклад сети", company: "Операционный вклад компании", need: "Нужно покупателей в день", plan: "по плану" },
    money: "Деньги — отдельно от прибыли", moneyRows: { capex: "Инвестиции", prep: "Подготовка до открытия", deposit: "Депозит · возвращается", stock: "Запас магазина", released: (n: string | null) => (n ? `Дебиторка сетей высвобождается постепенно; полная расчётная сумма — к концу ${n}-го месяца · деньги на старте не уменьшает` : `Дебиторка сетей высвобождается постепенно; полная расчётная сумма в горизонте 120 месяцев не достигается · деньги на старте не уменьшает`), start: "Деньги на старте", peak: "Пиковая потребность в деньгах" },
    scen: { title: "Если покупателей будет меньше или больше", cols: ["Сценарий", "Покупателей в день", "Каннибализация", "Прирост вклада", "Возврат денег старта"], names: ["Пессимистичный", "Реалистичный", "Оптимистичный"] },
    verdict: {
      plus: (e: string, inv: string, all: string) => `При этих данных магазин добавляет компании ≈ ${e} операционного вклада в месяц; инвестиции окупаются ${inv}, все деньги старта возвращаются ${all}`.replace(/\.?$/, "."),
      minus: (need: string, plan: string) => `При этих данных магазин не добавляет операционного вклада: нужно ≈ ${need} покупателей в день, по плану — ${plan}.`,
      minusNever: "При этих данных магазин не выходит на безубыточность: маржинальный доход на € выручки не покрывает потерю вклада сети.",
    },
    warn: { exceeds: (take: string, sell: string) => `Недопустимый сценарий: магазин забирает у сетей ≈ ${take} шт. в месяц, а сети продают ${sell}. Результаты, окупаемость, копирование и отправка расчёта заблокированы — уменьшите каннибализацию или проверьте продажи через сети.`, negative: "Маржинальный доход магазина отрицательный: цена без НДС, себестоимость, потери и эквайринг не оставляют вклада.", net: "Вы ввели цены без НДС. Если вы взяли их из чека или с полки, переключите на «с НДС» — иначе выручка будет завышена." },
    need: { chain: "Для канала сетей нужны продажи, цена, себестоимость, скидки и ретро‑бонусы.", store: "Для магазина нужны ставка НДС, цена, покупатели, чек, дни работы, себестоимость и аренда или персонал.", combined: "Для сравнения укажите каннибализацию (0 %, если все продажи новые)." },
    send: {
      mail: "Отправить расчёт по email", copy: "Скопировать расчёт",
      note: "Откроется ваше почтовое приложение с готовым письмом в MEGAPARC — проверьте его и отправьте сами, адресата можно изменить. Если приложение не открылось или письмо пришло неполным, скопируйте расчёт.",
      copied: "Расчёт скопирован — вставьте его в письмо или мессенджер.", manual: "Скопировать автоматически не удалось — выделите текст расчёта ниже и скопируйте его.", manualLabel: "Текст расчёта",
      subject: "Расчёт производителя: сети, свой магазин или оба канала", source: "Калькулятор производителя MEGAPARC", date: "дата расчёта",
      intro: "Предварительная оценка на введённых данных — не прогноз продаж и не финансовая, налоговая или инвестиционная рекомендация.",
      results: "РЕЗУЛЬТАТЫ (суммы в евро, без НДС)", scen: "ТРИ СЦЕНАРИЯ", inputs: "ИСХОДНЫЕ ДАННЫЕ", notes: "ОГОВОРКИ",
      scenLine: (b: string, c: string, inc: string, back: string) => `покупателей в день ${b} · каннибализация ${c} · прирост вклада ${inc} в месяц · возврат денег старта ${back}`,
    },
    foot: ["Все суммы — в евро; расчёт без НДС. Операционный вклад — до общих расходов компании, амортизации, процентов и налога. Дебиторка сети показана без НДС (консервативно).", "Деньги на старте — CAPEX, подготовка, депозит и запас на дату открытия; будущие поступления их не уменьшают. Дебиторка сетей поступает по мере оплаты, через срок отсрочки, и учтена в помесячном денежном потоке на 120 месяцев; пиковая потребность — самая глубокая точка накопленного денежного потока.", "Стоимость денег — годовая стоимость капитала компании: ставка кредита или требуемая доходность (кредит не моделируется). Операционный вклад она не уменьшает: показывает стоимость связанных денег (информационно, ни из чего не вычитается) и дисконтирует денежный поток для окупаемости с учётом стоимости денег. Депозит возвращается по окончании аренды — в горизонте 120 месяцев не возвращается.", "Ставки, депозит и порядок коммунальных платежей Moscova 20 — в коммерческих условиях объекта; расчёт аренды предварительный. Калькулятор не меняет коммерческие условия объекта."],
  },
  ro: {
    badge: "Calculatorul producătorului · evaluare preliminară pe datele dumneavoastră",
    title: "Rețele comerciale, magazin propriu sau ambele canale",
    lead: "Comparați trei scenarii pe cifrele dumneavoastră: contribuția operațională, banii de start, pragul de rentabilitate și termenul de recuperare. Profitul și banii se calculează separat.",
    principle: "Model pentru o evaluare inițială, nu o prognoză a vânzărilor și nici o recomandare financiară, fiscală sau investițională. MEGAPARC este proprietarul și locatorul spațiului, nu operatorul magazinului.",
    example: "Exemplu de producător", reset: "Resetează",
    exampleNote: "Exemplu: un producător convențional — cifrele nu sunt date de piață. Chiria nu este introdusă: apăsați «Introduceți calculul preliminar Moscova 20» sau introduceți-o pe a dumneavoastră.",
    groups: ["Produsul și rețelele comerciale", "Magazinul propriu", "Lansarea"],
    m20: "Introduceți calculul preliminar Moscova 20",
    vat: { label: "Prețurile în magazin", gross: "cu TVA", net: "fără TVA", hint: "Introduceți prețul cu amănuntul și bonul mediu așa cum le vede cumpărătorul. Calculul se face fără TVA.", netOf: (x: string) => `fără TVA: ${x}` },
    u: { eur: "€", eurMonth: "€ / lună", unitsMonth: "buc. / lună", eurUnit: "€ / buc.", pct: "%", pctYear: "% pe an", pctList: "% din preț", pctGross: "% din rulajul cu TVA", pctCogs: "% din cost", pctUtil: "% din utilități", days: "zile", perDay: "pe zi", daysMonth: "zile / lună", eurCheck: "€", monthsRent: "luni de chirie", months: "luni" },
    f: {
      chainUnits: ["Vânzări prin rețele, pe lună", "în bucăți"], listPrice: ["Prețul de livrare către rețea, pe unitate", "fără TVA"], unitCost: ["Costul unei unități", "fără TVA; același pentru ambele canale"],
      discounts: ["Reduceri și promoții pe factură", ""], bonuses: ["Bonusuri retroactive", "plătite după factură"], chainFees: ["Listare și marketingul rețelei", "pe lună"],
      chainLogistics: ["Logistica până la rețea", ""], paymentDays: ["Termenul de plată al rețelei", ""], costOfMoney: ["Costul banilor", "dobânda creditului sau randamentul alternativ"],
      vatRate: ["Cota TVA", "standard — 20 %; pentru unele mărfuri se aplică cote reduse"], shelfPrice: ["Prețul cu amănuntul al unei unități", "ca la raft"], buyersPerDay: ["Cumpărători pe zi", "plan"],
      averageCheck: ["Bonul mediu", "ca în bon"], openDays: ["Zile de lucru pe lună", ""], rent: ["Chiria, pe lună", "chiria de bază, fără TVA"],
      utilities: ["Utilități", "la consumul efectiv, fără TVA"], utilitiesFee: ["Administrarea și întreținerea rețelelor inginerești", "Moscova 20: 15 % din utilități"],
      staff: ["Personal, cu taxe", ""], marketing: ["Marketingul magazinului", ""], otherCosts: ["Alte cheltuieli operaționale", "pază, comunicații, casă și software, curățenie, asigurare"],
      storeDelivery: ["Livrarea în magazin", "pe lună"], acquiring: ["Acquiring", "comisionul băncii la plățile cu cardul"], losses: ["Pierderi și casări", "termene de valabilitate, spargeri, rebuturi"],
      stockDays: ["Stoc pentru magazin", "în zile de cost"], cannibalisation: ["Canibalizare", "partea cumpărăturilor din magazin care altfel s-ar fi făcut în rețea; 0 % — toate vânzările sunt noi"],
      capex: ["Investiția inițială", "adaptarea spațiului, echipamente, firmă — fără stoc"], depositMonths: ["Garanția locativă", "în luni de chirie de bază · se restituie"],
      preparationMonths: ["Luni de pregătire până la deschidere", "chiria, utilitățile și personalul până la prima vânzare"], rampMonths: ["Luni până la planul de vânzări", "venitul crește uniform"],
    } as Lines,
    cols: ["Doar rețele", "Doar magazin", "Rețele + magazin"],
    rows: { revenue: "Venituri fără TVA", contribution: "Contribuția operațională a canalului", margin: "Contribuția, % din venituri", unit: "Contribuția pe unitate", change: "Schimbare față de «doar rețele»", breakEven: "Prag de rentabilitate", wc: "Capital de lucru", deposit: "Garanția · se restituie", start: "Banii de start", payInvest: "Recuperarea investiției", payAll: "Recuperarea tuturor banilor de start", peak: "Necesarul maxim de bani", payDisc: "Recuperarea cu costul banilor", tied: "Costul banilor imobilizați, pe lună", cycle: "Ciclul banilor" },
    perMonth: "pe lună", unitsShort: "buc. / lună", buyersShort: "cumpărători pe zi",
    cycleChain: (d: string) => `plata după ${d} zile`, cycleStore: (d: string) => `bani în ziua vânzării · stoc ${d} zile`,
    months: (m: string) => `≈ ${m} luni`, over60: "peste 60 de luni", never: "nu se recuperează în 10 ani", noPayback: "nu — creșterea nu este pozitivă", peakNever: "crește pe tot orizontul — fluxul este negativ", noRate: "indicați costul banilor", impossibleCell: "scenariu imposibil", noBreakEven: "nu se atinge",
    company: "Ce se schimbă pentru companie", companyRows: { increment: "Creșterea contribuției operaționale", lost: "Contribuția rețelei pierdută", company: "Contribuția operațională a companiei", need: "Cumpărători necesari pe zi", plan: "conform planului" },
    money: "Banii — separat de profit", moneyRows: { capex: "Investiția", prep: "Pregătirea până la deschidere", deposit: "Garanția · se restituie", stock: "Stocul magazinului", released: (n: string | null) => (n ? `Creanțele rețelelor se eliberează treptat; suma estimată integrală — până la sfârșitul lunii ${n} · nu reduc banii de start` : `Creanțele rețelelor se eliberează treptat; suma estimată integrală nu se atinge în orizontul de 120 de luni · nu reduc banii de start`), start: "Banii de start", peak: "Necesarul maxim de bani" },
    scen: { title: "Dacă vor fi mai puțini sau mai mulți cumpărători", cols: ["Scenariu", "Cumpărători pe zi", "Canibalizare", "Creșterea contribuției", "Recuperarea banilor de start"], names: ["Pesimist", "Realist", "Optimist"] },
    verdict: {
      plus: (e: string, inv: string, all: string) => `La aceste date magazinul adaugă companiei ≈ ${e} contribuție operațională pe lună; investiția se recuperează ${inv}, toți banii de start — ${all}`.replace(/\.?$/, "."),
      minus: (need: string, plan: string) => `La aceste date magazinul nu adaugă contribuție operațională: sunt necesari ≈ ${need} cumpărători pe zi, conform planului — ${plan}.`,
      minusNever: "La aceste date magazinul nu atinge pragul de rentabilitate: marja pe € de venit nu acoperă contribuția pierdută a rețelei.",
    },
    warn: { exceeds: (take: string, sell: string) => `Scenariu imposibil: magazinul ia de la rețele ≈ ${take} buc. pe lună, iar rețelele vând ${sell}. Rezultatele, recuperarea, copierea și trimiterea calculului sunt blocate — reduceți canibalizarea sau verificați vânzările prin rețele.`, negative: "Marja magazinului este negativă: prețul fără TVA, costul, pierderile și acquiring-ul nu lasă contribuție.", net: "Ați introdus prețurile fără TVA. Dacă le-ați luat din bon sau de la raft, comutați la «cu TVA» — altfel venitul va fi supraestimat." },
    need: { chain: "Pentru canalul rețelelor sunt necesare vânzările, prețul, costul, reducerile și bonusurile retroactive.", store: "Pentru magazin sunt necesare cota TVA, prețul, cumpărătorii, bonul, zilele de lucru, costul și chiria sau personalul.", combined: "Pentru comparație indicați canibalizarea (0 %, dacă toate vânzările sunt noi)." },
    send: {
      mail: "Trimiteți calculul prin e-mail", copy: "Copiați calculul",
      note: "Se deschide aplicația dumneavoastră de e‑mail cu un mesaj pregătit către MEGAPARC — verificați‑l și trimiteți‑l dumneavoastră; destinatarul poate fi schimbat. Dacă aplicația nu s‑a deschis sau mesajul este incomplet, copiați calculul.",
      copied: "Calculul a fost copiat — inserați‑l într‑un e‑mail sau într‑un mesaj.", manual: "Copierea automată nu a reușit — selectați textul calculului de mai jos și copiați‑l.", manualLabel: "Textul calculului",
      subject: "Calculul producătorului: rețele, magazin propriu sau ambele canale", source: "Calculatorul producătorului MEGAPARC", date: "data calculului",
      intro: "Evaluare preliminară pe datele introduse — nu o prognoză a vânzărilor și nici o recomandare financiară, fiscală sau investițională.",
      results: "REZULTATE (sume în euro, fără TVA)", scen: "TREI SCENARII", inputs: "DATE DE INTRARE", notes: "MENȚIUNI",
      scenLine: (b: string, c: string, inc: string, back: string) => `cumpărători pe zi ${b} · canibalizare ${c} · creșterea contribuției ${inc} pe lună · recuperarea banilor de start ${back}`,
    },
    foot: ["Toate sumele — în euro; calculul fără TVA. Contribuția operațională — înainte de cheltuielile generale ale companiei, amortizare, dobânzi și impozit. Creanțele rețelei sunt arătate fără TVA (conservator).", "Banii de start — CAPEX, pregătirea, garanția și stocul la data deschiderii; încasările viitoare nu îi reduc. Creanțele rețelelor se încasează pe măsura plății, după termenul de amânare, și sunt incluse în fluxul de numerar lunar pe 120 de luni; necesarul maxim — punctul cel mai adânc al fluxului cumulat.", "Costul banilor — costul anual al capitalului companiei: dobânda creditului sau randamentul cerut (creditul nu este modelat). Nu reduce contribuția operațională: arată costul banilor imobilizați (informativ, nu se scade din nimic) și actualizează fluxul de numerar pentru recuperarea cu costul banilor. Garanția se restituie la încheierea contractului de închiriere — în orizontul de 120 de luni nu se restituie.", "Tarifele, garanția și regimul utilităților Moscova 20 — în condițiile comerciale ale obiectului; calculul chiriei este preliminar. Calculatorul nu schimbă condițiile comerciale ale obiectului."],
  },
  en: {
    badge: "Manufacturer's calculator · a first assessment on your own figures",
    title: "Retail chains, your own store or both channels",
    lead: "Compare three scenarios on your own figures: operating contribution, cash at the start, break-even and payback. Profit and cash are calculated separately.",
    principle: "A model for a first assessment — not a sales forecast and not financial, tax or investment advice. MEGAPARC is the owner and landlord of the premises, not the operator of the store.",
    example: "Example manufacturer", reset: "Reset",
    exampleNote: "Example: a notional manufacturer — the figures are not market data. No rent is inserted: press «Insert the Moscova 20 preliminary calculation» or enter your own.",
    groups: ["Product and retail chains", "Your own store", "Launch"],
    m20: "Insert the Moscova 20 preliminary calculation",
    vat: { label: "Store prices", gross: "incl. VAT", net: "excl. VAT", hint: "Enter the shelf price and the average receipt as the buyer sees them. The calculation is excl. VAT.", netOf: (x: string) => `excl. VAT: ${x}` },
    u: { eur: "€", eurMonth: "€ / month", unitsMonth: "units / month", eurUnit: "€ per unit", pct: "%", pctYear: "% a year", pctList: "% of list price", pctGross: "% of turnover incl. VAT", pctCogs: "% of cost of goods", pctUtil: "% of utilities", days: "days", perDay: "a day", daysMonth: "days / month", eurCheck: "€", monthsRent: "months of rent", months: "months" },
    f: {
      chainUnits: ["Sales through chains, per month", "in units"], listPrice: ["Chain list price per unit", "excl. VAT"], unitCost: ["Cost per unit", "excl. VAT; the same for both channels"],
      discounts: ["On-invoice discounts and promotions", ""], bonuses: ["Retro-bonuses", "paid after the invoice"], chainFees: ["Chain listing and marketing", "per month"],
      chainLogistics: ["Logistics to the chain", ""], paymentDays: ["Chain payment term", ""], costOfMoney: ["Cost of money", "loan rate or alternative return"],
      vatRate: ["VAT rate", "standard — 20 %; reduced rates apply to some goods"], shelfPrice: ["Retail price per unit", "as on the shelf"], buyersPerDay: ["Buyers per day", "plan"],
      averageCheck: ["Average receipt", "as on the receipt"], openDays: ["Trading days per month", ""], rent: ["Rent, per month", "base rent, excl. VAT"],
      utilities: ["Utilities", "at actual charges, excl. VAT"], utilitiesFee: ["Administration and maintenance of the engineering networks", "Moscova 20: 15 % of utilities"],
      staff: ["Staff including payroll taxes", ""], marketing: ["Store marketing", ""], otherCosts: ["Other operating costs", "security, telecoms, till and software, cleaning, insurance"],
      storeDelivery: ["Delivery to the store", "per month"], acquiring: ["Card acquiring", "the bank's fee on card payments"], losses: ["Losses and write-offs", "expiry, breakage, defects"],
      stockDays: ["Stock for the store", "in days of cost of goods"], cannibalisation: ["Cannibalisation", "the share of store purchases that would otherwise be made in a chain; 0 % — every sale is new"],
      capex: ["Initial investment", "fit-out, equipment, signage — stock excluded"], depositMonths: ["Security deposit", "in months of base rent · returned"],
      preparationMonths: ["Months of preparation before opening", "rent, utilities and staff before the first sale"], rampMonths: ["Months to reach the plan", "revenue grows evenly"],
    } as Lines,
    cols: ["Chains only", "Store only", "Chains + store"],
    rows: { revenue: "Revenue excl. VAT", contribution: "Channel operating contribution", margin: "Contribution, % of revenue", unit: "Contribution per unit", change: "Change vs «chains only»", breakEven: "Break-even", wc: "Working capital", deposit: "Deposit · returned", start: "Cash at the start", payInvest: "Investment payback", payAll: "Return of all start-up cash", peak: "Peak funding need", payDisc: "Payback with the cost of money", tied: "Cost of tied-up cash, per month", cycle: "Cash cycle" },
    perMonth: "a month", unitsShort: "units / month", buyersShort: "buyers a day",
    cycleChain: (d: string) => `paid after ${d} days`, cycleStore: (d: string) => `cash on the day of sale · stock ${d} days`,
    months: (m: string) => `≈ ${m} months`, over60: "over 60 months", never: "no payback within 10 years", noPayback: "none — the uplift is not positive", peakNever: "keeps growing over the horizon — the cash flow is negative", noRate: "state the cost of money", impossibleCell: "impossible scenario", noBreakEven: "not reached",
    company: "What changes for the company", companyRows: { increment: "Uplift of the operating contribution", lost: "Chain contribution given up", company: "Company operating contribution", need: "Buyers a day needed", plan: "planned" },
    money: "Cash — apart from profit", moneyRows: { capex: "Investment", prep: "Preparation before opening", deposit: "Deposit · returned", stock: "Store stock", released: (n: string | null) => (n ? `Chain receivables are released gradually; the full estimated amount by the end of month ${n} · they do not reduce the cash at the start` : `Chain receivables are released gradually; the full estimated amount is not reached within the 120-month horizon · they do not reduce the cash at the start`), start: "Cash at the start", peak: "Peak funding need" },
    scen: { title: "If there are fewer or more buyers", cols: ["Scenario", "Buyers a day", "Cannibalisation", "Contribution uplift", "Return of start-up cash"], names: ["Pessimistic", "Realistic", "Optimistic"] },
    verdict: {
      plus: (e: string, inv: string, all: string) => `On these figures the store adds ≈ ${e} of operating contribution a month; the investment pays back ${inv}, all start-up cash returns ${all}`.replace(/\.?$/, "."),
      minus: (need: string, plan: string) => `On these figures the store adds no operating contribution: ≈ ${need} buyers a day are needed, ${plan} are planned.`,
      minusNever: "On these figures the store does not break even: the margin per € of revenue does not cover the chain contribution given up.",
    },
    warn: { exceeds: (take: string, sell: string) => `Impossible scenario: the store takes ≈ ${take} units a month from the chains, but the chains sell ${sell}. Results, payback, copying and sending are blocked — lower the cannibalisation or check the chain sales.`, negative: "The store's contribution margin is negative: the price excl. VAT, the cost, losses and acquiring leave no contribution.", net: "You entered prices excl. VAT. If you took them from a receipt or a shelf, switch to «incl. VAT» — otherwise revenue is overstated." },
    need: { chain: "The chain channel needs sales, price, cost, discounts and retro-bonuses.", store: "The store needs the VAT rate, price, buyers, receipt, trading days, cost and rent or staff.", combined: "To compare, state cannibalisation (0 % if every sale is new)." },
    send: {
      mail: "Send the calculation by e-mail", copy: "Copy the calculation",
      note: "Your e‑mail app opens with a prepared message to MEGAPARC — check it and send it yourself; the recipient can be changed. If the app does not open or the message is incomplete, copy the calculation.",
      copied: "Calculation copied — paste it into an e-mail or a message.", manual: "Automatic copying did not work — select the calculation text below and copy it.", manualLabel: "Calculation text",
      subject: "Manufacturer's calculation: chains, own store or both channels", source: "MEGAPARC manufacturer's calculator", date: "calculated on",
      intro: "A preliminary assessment on the figures entered — not a sales forecast and not financial, tax or investment advice.",
      results: "RESULTS (amounts in euros, excl. VAT)", scen: "THREE SCENARIOS", inputs: "INPUTS", notes: "NOTES",
      scenLine: (b: string, c: string, inc: string, back: string) => `buyers a day ${b} · cannibalisation ${c} · contribution uplift ${inc} a month · return of start-up cash ${back}`,
    },
    foot: ["All amounts in euros; the calculation is excl. VAT. Operating contribution — before the company's overheads, depreciation, interest and tax. Chain receivables are shown excl. VAT (conservative).", "Cash at the start — CAPEX, preparation, deposit and stock on the opening day; money that arrives later never reduces it. Chain receivables come in as the chains pay, after the payment delay, and are part of the monthly cash flow over 120 months; the peak funding need is the deepest point of the cumulative cash.", "Cost of money — the company's annual cost of capital: a loan rate or the return it requires (no loan is modelled). It never reduces the operating contribution: it shows the cost of tied-up cash (information, never subtracted) and discounts the cash flow for the payback with the cost of money. The deposit is returned at the end of the lease — not within the 120-month horizon.", "The Moscova 20 rates, deposit and utilities terms are in the property's commercial terms; the rent calculation is preliminary. The calculator never changes the property's commercial terms."],
  },
} as const;

const KEYS = Object.keys(EMPTY_V21).filter((k) => k !== "vatMode") as NumKey[];
/** the money fields (OWNER «CALCULATOR CURRENCY R1»): converted by the currency switch; counts, percentages, days and months never are */
const MONEY = new Set<NumKey>(["listPrice", "unitCost", "chainFees", "shelfPrice", "averageCheck", "rent", "utilities", "staff", "marketing", "otherCosts", "storeDelivery", "capex"]);
const toStrings = (i: ProducerInputsV21) => Object.fromEntries(KEYS.map((k) => [k, i[k] === null ? "" : String(i[k])])) as Record<NumKey, string>;

// mailto: the OWNER-confirmed address, passed by the server page — this is a client module, and importing @/data/demo-content here
// would ship the whole demo module (DEMO careers values) to the browser (qa-production)
export function ProducerEconomicsV21({ locale, m20, mailto }: { locale: SiteLocale; m20: { rent: number; depositMonths: number; feePercent: number }; mailto: string }) {
  const t = copy[locale];
  const uid = useId();
  const [v, setV] = useState<Record<NumKey, string>>(() => toStrings(EMPTY_V21));
  const [vatMode, setVatMode] = useState<VatMode>("gross");
  const [isExample, setIsExample] = useState(false);
  // currency (OWNER «CALCULATOR CURRENCY R1»): the model computes in EUR; every money field keeps the value as typed and the currency it
  // was typed in (src/lib/currency.ts) — the switch only re-expresses, so MDL → EUR → MDL never drifts; default EUR
  const [currency, setCurrency] = useState<Currency>("EUR");
  const [cur, setCur] = useState<Partial<Record<NumKey, Currency>>>({});
  // the rate (OWNER «AUTOMATIC NBM FX», 2026-11-16): the official NBM record read when the page loads (the same as the Moscova 20
  // calculator) or the visitor's scenario rate; once a calculation has started a newer NBM record is offered, never applied silently
  const [started, setStarted] = useState(false);
  const fx = useFx(started);
  const rate = fx.rate;
  const curOf = (k: NumKey): Currency => cur[k] ?? "EUR";
  const toDisplay = (x: number) => convert(x, "EUR", currency, rate);
  /** a label written with «€» / «euro» in the display currency */
  const uc = (text: string) => (currency === "EUR" ? text : text.replace(/€/g, "MDL").replace("в евро", "в MDL").replace("în euro", "în MDL").replace("in euros", "in MDL"));
  const tag = locale === "ru" ? "ru-RU" : locale === "ro" ? "ro-RO" : "en-GB";
  const nf0 = useMemo(() => new Intl.NumberFormat(tag, { maximumFractionDigits: 0 }), [tag]);
  const nf1 = useMemo(() => new Intl.NumberFormat(tag, { maximumFractionDigits: 1, minimumFractionDigits: 1 }), [tag]);
  const nf2 = useMemo(() => new Intl.NumberFormat(tag, { maximumFractionDigits: 2, minimumFractionDigits: 2 }), [tag]);
  // RU / RO group with a no-break space (Intl's ro-RO would print a dot)
  const grouped = (s: string) => (locale === "en" ? s : s.replace(/[\s. ](?=\d{3}(\D|$))/g, " "));
  const eur = (x0: number | null, sign = false) => {
    if (x0 === null) return "—";
    const x = toDisplay(x0);
    const s = x < 0 ? "−" : sign && x > 0 ? "+" : "";
    const n = grouped(nf0.format(Math.round(Math.abs(x))));
    return currency === "MDL" ? `${s}${n} MDL` : locale === "en" ? `${s}€${n}` : `${s}${n} €`;
  };
  // the unit never leaves its figure: «€» and «мес.» / «luni» / «months» are joined with a no-break space
  const eurCents = (x0: number) => { const x = toDisplay(x0); return currency === "MDL" ? `${grouped(nf2.format(x))} MDL` : locale === "en" ? `€${nf2.format(x)}` : `${grouped(nf2.format(x))} €`; };
  const one = (x: number | null) => (x === null ? "—" : grouped(nf1.format(x)));
  const months = (x: number | null, positive: boolean) => (!positive ? t.noPayback : x === null ? t.never : x > 60 ? t.over60 : t.months(nf1.format(x)).replace(/ /g, " "));

  // the e-mail / copy text: the inputs as entered (up to two decimals), the date of the calculation, the page in the visitor's language
  const nfIn = useMemo(() => new Intl.NumberFormat(tag, { maximumFractionDigits: 2 }), [tag]);
  const today = new Intl.DateTimeFormat(tag, { day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date());
  const pageUrl = `${(process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.megaparc.md").replace(/\/$/, "")}${locale === "ro" ? "" : `/${locale}`}/producer-economics/`;

  // zero is a statement here (0 % cannibalisation = every sale is new, no deposit, zero sales): the shared numberOf() reads 0 as «not
  // stated» for the Moscova 20 calculators, so this calculator reads the canonical value itself — an empty field stays «not stated»
  const valueOf = (canonical: string) => { if (!canonical || canonical === ".") return null; const n = Number(canonical); return Number.isFinite(n) && n >= 0 ? n : null; };
  const moneyOf = (k: NumKey) => { const x = amountIn({ v: v[k], c: curOf(k) }, "EUR", rate); return x !== null && x >= 0 ? x : null; };
  const inputs: ProducerInputsV21 = { ...EMPTY_V21, ...Object.fromEntries(KEYS.map((k) => [k, MONEY.has(k) ? moneyOf(k) : valueOf(v[k])])), vatMode };
  for (const k of ["discounts", "bonuses", "chainLogistics", "acquiring", "losses", "cannibalisation", "vatRate"] as NumKey[]) if ((inputs[k] ?? 0) > 100) inputs[k] = null;
  const r = calcV21(inputs);
  const sc = SCENARIOS_V21.map((s) => ({ s, res: calcV21(scenarioOf(inputs, s)), i: scenarioOf(inputs, s) }));

  const update = (key: NumKey) => (next: string) => {
    setV((old) => ({ ...old, [key]: next }));
    if (MONEY.has(key)) setCur((old) => ({ ...old, [key]: currency }));
    setIsExample(false);
    setStarted(true);
  };
  const fields: Field[][] = [
    [
      { key: "chainUnits", unit: t.u.unitsMonth, format: units }, { key: "listPrice", unit: t.u.eurUnit, format: money }, { key: "unitCost", unit: t.u.eurUnit, format: money },
      { key: "discounts", unit: t.u.pctList, format: pct }, { key: "bonuses", unit: t.u.pctList, format: pct }, { key: "chainFees", unit: t.u.eurMonth, format: money },
      { key: "chainLogistics", unit: t.u.pctList, format: pct }, { key: "paymentDays", unit: t.u.days, format: days }, { key: "costOfMoney", unit: t.u.pctYear, format: pct },
    ],
    [
      { key: "vatRate", unit: t.u.pct, format: pct }, { key: "shelfPrice", unit: t.u.eurUnit, format: money }, { key: "averageCheck", unit: t.u.eurCheck, format: money },
      { key: "buyersPerDay", unit: t.u.perDay, format: units }, { key: "openDays", unit: t.u.daysMonth, format: days }, { key: "rent", unit: t.u.eurMonth, format: money },
      { key: "utilities", unit: t.u.eurMonth, format: money }, { key: "utilitiesFee", unit: t.u.pctUtil, format: pct }, { key: "staff", unit: t.u.eurMonth, format: money },
      { key: "marketing", unit: t.u.eurMonth, format: money }, { key: "otherCosts", unit: t.u.eurMonth, format: money }, { key: "storeDelivery", unit: t.u.eurMonth, format: money },
      { key: "acquiring", unit: t.u.pctGross, format: pct }, { key: "losses", unit: t.u.pctCogs, format: pct }, { key: "stockDays", unit: t.u.days, format: days },
      { key: "cannibalisation", unit: t.u.pct, format: pct },
    ],
    [
      { key: "capex", unit: t.u.eur, format: money }, { key: "depositMonths", unit: t.u.monthsRent, format: monthsFormat },
      { key: "preparationMonths", unit: t.u.months, format: monthsFormat }, { key: "rampMonths", unit: t.u.months, format: monthsFormat },
    ],
  ];

  const vatRate = inputs.vatRate;
  const netHint = (key: NumKey) => {
    if (vatMode !== "gross" || vatRate === null) return null;
    const x = inputs[key];
    return typeof x === "number" ? t.vat.netOf(eurCents(x / (1 + vatRate / 100))) : null;
  };
  // a value typed in the other currency stays in it (a contractual rent in euros keeps its euros): the hint names the original
  const typedAs = (key: NumKey) => {
    if (!MONEY.has(key) || curOf(key) === currency || !v[key]) return null;
    const x = Number(v[key]);
    const text = curOf(key) === "EUR" ? (locale === "en" ? `€${nf2.format(x)}` : `${grouped(nf2.format(x))} €`) : `${grouped(nf2.format(x))} MDL`;
    return currencyCopy[locale].typed(text);
  };
  const field = (f: Field) => (
    <div className="pe-field" key={f.key}>
      <label className="pe-field__label" htmlFor={`${uid}-${f.key}`}>{t.f[f.key][0]}</label>
      <span className="pe-field__control">
        <NumberInput className="pe-field__input" id={`${uid}-${f.key}`} value={MONEY.has(f.key) ? shown({ v: v[f.key], c: curOf(f.key) }, currency, rate) : v[f.key]} onValueChange={update(f.key)} locale={locale} format={f.format} describedBy={`${uid}-${f.key}-hint`} />
        <span className="pe-field__unit" aria-hidden="true">{uc(f.unit)}</span>
      </span>
      <span className="pe-field__hint" id={`${uid}-${f.key}-hint`}>{[t.f[f.key][1], f.key === "shelfPrice" || f.key === "averageCheck" ? netHint(f.key) : null, typedAs(f.key)].filter(Boolean).join(" · ")}</span>
      {f.key === "rent" ? (
        <button type="button" className="pe-link" onClick={() => { setStarted(true); setV((old) => ({ ...old, rent: String(m20.rent), depositMonths: String(m20.depositMonths), utilitiesFee: String(m20.feePercent) })); setCur((old) => ({ ...old, rent: "EUR" })); setIsExample(false); }}>{t.m20}</button>
      ) : null}
    </div>
  );

  const ch = r.chain, st = r.store, cb = r.combined, so = r.storeOnly;
  const plan = inputs.buyersPerDay;
  // v2.2 (OWNER «FINANCIAL REMEDIATION»): a store that would take more units than the chains sell is an impossible scenario — the
  // results, the payback, the copy and the e-mail are blocked; only the reason is shown
  const blocked = r.impossible;
  const taken = st && inputs.cannibalisation !== null ? (st.units * inputs.cannibalisation) / 100 : null;
  const warnings = [
    blocked && taken !== null && inputs.chainUnits !== null ? t.warn.exceeds(grouped(nf0.format(Math.round(taken))), grouped(nf0.format(inputs.chainUnits))) : null,
    !blocked && st && st.perEuro <= 0 ? t.warn.negative : null,
    !blocked && vatMode === "net" && st ? t.warn.net : null,
  ].filter(Boolean) as string[];
  const cc = cb?.cash ?? null, sc0 = so?.cash ?? null;
  const verdict = !blocked && cb && st ? (cb.increment > 0
    ? t.verdict.plus(eur(cb.increment), months(cc?.paybackInvestment ?? null, true), months(cc?.paybackAll ?? null, true))
    : cb.breakEvenBuyers !== null && plan !== null ? t.verdict.minus(one(cb.breakEvenBuyers), one(plan)) : uc(t.verdict.minusNever)) : null;
  // the money rows: the peak is meaningless when the money never comes back; the discounted payback needs the rate
  const peakText = (c: typeof cc) => (c === null ? null : c.peakFunding === null ? t.peakNever : eur(c.peakFunding));
  const discText = (c: typeof cc, positive: boolean) => (c === null ? null : inputs.costOfMoney === null ? t.noRate : months(c.paybackDiscounted, positive));
  const releaseMonths = (c: typeof cc) => (c && c.releaseFullMonth !== null ? String(c.releaseFullMonth) : null);

  let col = 0;
  const cell = (x: string | null, cls?: string) => { const name = t.cols[col++ % 3]; return <td className={cls} data-col={name}>{x ?? "—"}</td>; };
  const neg = (x: number | null | undefined) => (typeof x === "number" && x < 0 ? "is-negative" : undefined);

  // OWNER «P1 BUG · PRODUCER CALCULATOR EMAIL» (2026-11-15): the calculation as plain text — the same figures as on the screen, results
  // first (a mail app that shortens a long message keeps them), then the money, the three scenarios, the inputs and the notes. Only the
  // visitor's own figures and the page's wording: no personal data, no internal value.
  const report = !blocked && ch && st && cb ? (() => {
    const three = (a: string, b: string, c: string) => `${t.cols[0]} ${a} · ${t.cols[1]} ${b} · ${t.cols[2]} ${c}`;
    const two = (b: string, c: string) => `${t.cols[1]} ${b} · ${t.cols[2]} ${c}`;
    const be = (x: number | null, unit: string, f: (n: number) => string) => (x !== null ? `${f(x)} ${unit}` : t.noBreakEven);
    const L: string[] = [t.title, `${t.send.source} · ${t.send.date} ${today}`, pageUrl, t.send.intro, ...currencyReportLines(locale, currency, fx), "", uc(t.send.results)];
    L.push(`${t.rows.revenue}, ${t.perMonth}: ${three(eur(ch.revenue), eur(st.revenue), eur(cb.revenue))}`);
    L.push(`${t.rows.contribution}, ${t.perMonth}: ${three(eur(ch.contribution), eur(st.contribution), eur(cb.company))}`);
    L.push(`${t.rows.change}, ${t.perMonth}: ${two(so ? eur(so.change, true) : "—", eur(cb.increment, true))}`);
    L.push(`${t.rows.breakEven}: ${three(be(ch.breakEvenUnits, t.unitsShort, (n) => grouped(nf0.format(Math.round(n)))), be(st.breakEvenBuyers, t.buyersShort, one), be(cb.breakEvenBuyers, t.buyersShort, one))}`);
    L.push(`${t.rows.start}: ${two(sc0 ? eur(sc0.startCash) : "—", cc ? eur(cc.startCash) : "—")}`);
    L.push(`${t.rows.peak}: ${two(peakText(sc0) ?? "—", peakText(cc) ?? "—")}`);
    if (inputs.capex !== null) L.push(`${t.rows.payInvest}: ${two(so && sc0 ? months(sc0.paybackInvestment, so.change > 0) : "—", cc ? months(cc.paybackInvestment, cb.increment > 0) : "—")}`);
    L.push(`${t.rows.payAll}: ${two(so && sc0 ? months(sc0.paybackAll, so.change > 0) : "—", cc ? months(cc.paybackAll, cb.increment > 0) : "—")}`);
    L.push(`${t.rows.payDisc}: ${two(so ? discText(sc0, so.change > 0) ?? "—" : "—", discText(cc, cb.increment > 0) ?? "—")}`);
    L.push(`${t.rows.tied}: ${three(ch.tiedCost !== null ? eur(ch.tiedCost) : "—", sc0?.tiedCost != null ? eur(sc0.tiedCost) : "—", cc?.tiedCost != null ? eur(cc.tiedCost) : "—")}`);
    if (verdict) L.push(verdict);
    L.push("", `${t.money}:`);
    const moneyLines: [string, string][] = [[t.moneyRows.capex, eur(inputs.capex)], [t.moneyRows.prep, eur(st.preparation)], [t.moneyRows.deposit, eur(st.deposit ?? 0)], [t.moneyRows.stock, eur(st.stock)], [t.moneyRows.start, cc ? eur(cc.startCash) : "—"]];
    if (cc && cc.released > 0) moneyLines.push([t.moneyRows.released(releaseMonths(cc)), eur(cc.released, true)]);
    moneyLines.push([t.moneyRows.peak, peakText(cc) ?? "—"]);
    for (const [k, x] of moneyLines) L.push(`- ${k}: ${x}`);
    L.push("", `${t.send.scen} · ${t.scen.title}`);
    sc.forEach(({ res, i }, k) => L.push(`- ${t.scen.names[k]}: ${res.impossible ? t.impossibleCell : t.send.scenLine(one(i.buyersPerDay), i.cannibalisation !== null ? `${nf0.format(i.cannibalisation)} %` : "—", eur(res.combined?.increment ?? null, true), res.combined?.cash ? months(res.combined.cash.paybackAll, res.combined.increment > 0) : "—")}`));
    L.push("", t.send.inputs, `${t.vat.label}: ${t.vat[vatMode]}`);
    fields.forEach((group, g) => {
      const filled = group.filter((f) => inputs[f.key] !== null);
      if (filled.length) L.push(`${t.groups[g]}:`, ...filled.map((f) => `- ${t.f[f.key][0]}: ${grouped(nfIn.format(MONEY.has(f.key) ? toDisplay(inputs[f.key] as number) : (inputs[f.key] as number)))} ${uc(f.unit)}`));
    });
    L.push("", t.send.notes, ...[t.principle, ...t.foot.map(uc), ...(isExample ? [t.exampleNote] : [])].map((x) => `- ${x}`));
    return L.join("\n");
  })() : null;
  // mailto: a real link the visitor taps (no script, no pop-up — nothing Safari can block); the OWNER-confirmed address, which the
  // visitor can change in the mail app; CRLF line breaks (RFC 6068); ! ' ( ) * encoded too
  const enc = (text: string) => encodeURIComponent(text).replace(/[!'()*]/g, (c) => `%${c.charCodeAt(0).toString(16).toUpperCase()}`);
  const mailHref = report ? `${mailto}?subject=${enc(t.send.subject)}&body=${enc(report.replace(/\n/g, "\r\n"))}` : "";
  // copy: the clipboard where the browser allows it, else the classic selection copy, else the text shown to select by hand —
  // the answer always belongs to the calculation it copied (a new figure clears it)
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
    <div className="pe pe21">
      <header className="pe__head">
        <p className="pe__badge">{t.badge}</p>
        <h1 className="pe__title">{t.title}</h1>
        <p className="pe__lead">{t.lead}</p>
        <p className="pe__principle">{t.principle}</p>
      </header>

      <div className="pe__tools">
        <button type="button" className="pe-link is-strong" onClick={() => { setV(toStrings(EXAMPLE_V21)); setCur({}); setVatMode(EXAMPLE_V21.vatMode); setIsExample(true); setStarted(true); }}>{t.example}</button>
        <button type="button" className="pe-link" onClick={() => { setV(toStrings(EMPTY_V21)); setCur({}); setCurrency("EUR"); fx.restore(); setStarted(false); setVatMode("gross"); setIsExample(false); }}>{t.reset}</button>
      </div>
      <CurrencyBar locale={locale} currency={currency} onCurrency={setCurrency} fx={fx} />
      {isExample ? <p className="pe__example">{t.exampleNote}</p> : null}

      <div className="pe__body">
        {/* a group of inputs, never a <form>: nothing is sent (qa-production — no form on a public page while forms cannot send) */}
        <div className="pe__inputs" role="group" aria-label={t.title}>
          {fields.map((group, i) => (
            <fieldset key={t.groups[i]} className="pe-group">
              <legend className="pe-group__legend"><span>{String(i + 1).padStart(2, "0")}</span>{t.groups[i]}</legend>
              {i === 1 ? (
                <div className="pe21-vat" role="radiogroup" aria-label={t.vat.label}>
                  <span className="pe21-vat__label">{t.vat.label}</span>
                  <span className="pe21-vat__seg">
                    {(["gross", "net"] as VatMode[]).map((mode) => (
                      <button key={mode} type="button" role="radio" aria-checked={vatMode === mode} className={vatMode === mode ? "is-on" : undefined} onClick={() => setVatMode(mode)}>{t.vat[mode]}</button>
                    ))}
                  </span>
                  <span className="pe21-vat__hint">{t.vat.hint}</span>
                </div>
              ) : null}
              <div className="pe-group__fields">{group.map(field)}</div>
            </fieldset>
          ))}
        </div>

        <div className="pe__results" aria-live="polite">
          {warnings.length ? <ul className="pe21-warn">{warnings.map((w) => <li key={w}>{w}</li>)}</ul> : null}
          {verdict ? <p className={`pe21-verdict ${cb && cb.increment > 0 ? "is-plus" : "is-minus"}`}>{verdict}</p> : null}

          {blocked ? null : (<section className="pe21-cmp" aria-label={t.rows.contribution}>
            <table className="pe21-cmp__table">
              <thead><tr><th scope="col"><span className="pe21-sr">{t.rows.contribution}</span></th>{t.cols.map((c, i) => <th key={c} scope="col" className={i === 2 ? "is-key" : undefined}>{c}</th>)}</tr></thead>
              <tbody>
                <tr><th scope="row">{t.rows.revenue}</th>{cell(ch ? eur(ch.revenue) : null)}{cell(st ? eur(st.revenue) : null)}{cell(cb?.revenue != null ? eur(cb.revenue) : null, "is-key")}</tr>
                <tr className="is-strong"><th scope="row">{t.rows.contribution}<span>{t.perMonth}</span></th>{cell(ch ? eur(ch.contribution) : null, neg(ch?.contribution))}{cell(st ? eur(st.contribution) : null, neg(st?.contribution))}{cell(cb?.company != null ? eur(cb.company) : null, `is-key ${neg(cb?.company) ?? ""}`)}</tr>
                <tr><th scope="row">{t.rows.margin}</th>{cell(ch?.marginPct != null ? `${one(ch.marginPct)} %` : null)}{cell(st?.marginPct != null ? `${one(st.marginPct)} %` : null)}{cell(cb?.marginPct != null ? `${one(cb.marginPct)} %` : null, "is-key")}</tr>
                <tr><th scope="row">{t.rows.unit}</th>{cell(ch ? eurCents(ch.unitContribution) : null, neg(ch?.unitContribution))}{cell(st ? eurCents(st.unitContribution) : null, neg(st?.unitContribution))}{cell(null, "is-key")}</tr>
                <tr className="is-strong"><th scope="row">{t.rows.change}<span>{t.perMonth}</span></th>{cell("—")}{cell(so ? eur(so.change, true) : null, neg(so?.change))}{cell(cb ? eur(cb.increment, true) : null, `is-key ${neg(cb?.increment) ?? ""}`)}</tr>
                <tr><th scope="row">{t.rows.breakEven}</th>{cell(ch ? (ch.breakEvenUnits !== null ? `${grouped(nf0.format(Math.round(ch.breakEvenUnits)))} ${t.unitsShort}` : t.noBreakEven) : null)}{cell(st ? (st.breakEvenBuyers !== null ? `${one(st.breakEvenBuyers)} ${t.buyersShort}` : t.noBreakEven) : null)}{cell(cb ? (cb.breakEvenBuyers !== null ? `${one(cb.breakEvenBuyers)} ${t.buyersShort}` : t.noBreakEven) : null, "is-key")}</tr>
                <tr><th scope="row">{t.rows.wc}</th>{cell(ch?.receivables != null ? eur(ch.receivables) : null)}{cell(st?.stock != null ? eur(st.stock) : null)}{cell(cb?.workingCapital != null ? eur(cb.workingCapital) : null, "is-key")}</tr>
                <tr><th scope="row">{t.rows.deposit}</th>{cell("—")}{cell(st?.deposit != null ? eur(st.deposit) : null)}{cell(st?.deposit != null ? eur(st.deposit) : null, "is-key")}</tr>
                <tr className="is-strong"><th scope="row">{t.rows.start}</th>{cell("—")}{cell(sc0 ? eur(sc0.startCash) : null)}{cell(cc ? eur(cc.startCash) : null, "is-key")}</tr>
                <tr><th scope="row">{t.rows.peak}</th>{cell("—")}{cell(peakText(sc0))}{cell(peakText(cc), "is-key")}</tr>
                <tr><th scope="row">{t.rows.payInvest}</th>{cell("—")}{cell(so && sc0 ? months(sc0.paybackInvestment, so.change > 0) : null)}{cell(cb && cc ? months(cc.paybackInvestment, cb.increment > 0) : null, "is-key")}</tr>
                <tr><th scope="row">{t.rows.payAll}</th>{cell("—")}{cell(so && sc0 ? months(sc0.paybackAll, so.change > 0) : null)}{cell(cb && cc ? months(cc.paybackAll, cb.increment > 0) : null, "is-key")}</tr>
                <tr><th scope="row">{t.rows.payDisc}</th>{cell("—")}{cell(so ? discText(sc0, so.change > 0) : null)}{cell(cb ? discText(cc, cb.increment > 0) : null, "is-key")}</tr>
                <tr><th scope="row">{t.rows.tied}</th>{cell(ch?.tiedCost != null ? eur(ch.tiedCost) : null)}{cell(sc0?.tiedCost != null ? eur(sc0.tiedCost) : null)}{cell(cc?.tiedCost != null ? eur(cc.tiedCost) : null, "is-key")}</tr>
                <tr><th scope="row">{t.rows.cycle}</th>{cell(inputs.paymentDays !== null ? t.cycleChain(nf0.format(inputs.paymentDays)) : null)}{cell(inputs.stockDays !== null ? t.cycleStore(nf0.format(inputs.stockDays)) : null)}{cell(null, "is-key")}</tr>
              </tbody>
            </table>
            {!ch ? <p className="pe-answer__need">{t.need.chain}</p> : null}
            {!st ? <p className="pe-answer__need">{t.need.store}</p> : null}
            {st && !cb ? <p className="pe-answer__need">{t.need.combined}</p> : null}
          </section>)}

          {!blocked && cb && st ? (
            <section className="pe-split" aria-label={t.company}>
              <h3 className="pe-split__title">{t.company}</h3>
              <div className="pe-split__cols">
                <dl className="pe-split__col is-profit">
                  <p className="pe-split__kind">{t.cols[2]} · {t.perMonth}</p>
                  <div><dt>{t.rows.contribution} · {t.cols[1]}</dt><dd>{eur(st.contribution)}</dd></div>
                  <div><dt>{t.companyRows.lost}</dt><dd>{eur(-cb.lostChain)}</dd></div>
                  <div className="is-total"><dt>{t.companyRows.increment}</dt><dd>{eur(cb.increment, true)}</dd></div>
                  {cb.breakEvenBuyers !== null && plan !== null ? <div><dt>{t.companyRows.need}</dt><dd>{one(cb.breakEvenBuyers)} · {t.companyRows.plan} {one(plan)}</dd></div> : null}
                </dl>
                <dl className="pe-split__col is-cash">
                  <p className="pe-split__kind">{t.money}</p>
                  <div><dt>{t.moneyRows.capex}</dt><dd>{eur(inputs.capex)}</dd></div>
                  <div><dt>{t.moneyRows.prep}</dt><dd>{eur(st.preparation)}</dd></div>
                  <div><dt>{t.moneyRows.deposit}</dt><dd>{eur(st.deposit ?? 0)}</dd></div>
                  <div><dt>{t.moneyRows.stock}</dt><dd>{eur(st.stock)}</dd></div>
                  <div className="is-total"><dt>{t.moneyRows.start}</dt><dd>{cc ? eur(cc.startCash) : "—"}</dd></div>
                  {cc && cc.released > 0 ? <div><dt>{t.moneyRows.released(releaseMonths(cc))}</dt><dd>{eur(cc.released, true)}</dd></div> : null}
                  <div><dt>{t.moneyRows.peak}</dt><dd>{peakText(cc) ?? "—"}</dd></div>
                </dl>
              </div>
            </section>
          ) : null}

          {!blocked && cb && st ? (
            <section className="pe-sens" aria-label={t.scen.title}>
              <h3 className="pe-sens__title">{t.scen.title}</h3>
              <table className="pe-sens__table pe21-scen">
                <thead><tr>{t.scen.cols.map((c) => <th key={c} scope="col">{c}</th>)}</tr></thead>
                <tbody>
                  {sc.map(({ s, res, i }, k) => (
                    <tr key={s.key} className={s.key === "realistic" ? "is-plan" : undefined}>
                      <th scope="row">{t.scen.names[k]}</th>
                      <td data-col={t.scen.cols[1]}>{one(i.buyersPerDay)}</td>
                      <td data-col={t.scen.cols[2]}>{i.cannibalisation !== null ? `${nf0.format(i.cannibalisation)} %` : "—"}</td>
                      <td data-col={t.scen.cols[3]} className={neg(res.combined?.increment)}>{res.impossible ? t.impossibleCell : eur(res.combined?.increment ?? null, true)}</td>
                      <td data-col={t.scen.cols[4]}>{res.impossible ? t.impossibleCell : res.combined?.cash ? months(res.combined.cash.paybackAll, res.combined.increment > 0) : "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          ) : null}

          {report ? (
            <section className="pe21-send" aria-label={t.send.mail}>
              <div className="pe21-send__actions">
                <a className="btn" href={mailHref}>{t.send.mail}</a>
                <button type="button" className="btn btn--ghost" onClick={copyReport}>{t.send.copy}</button>
              </div>
              <p className="pe21-send__note">{t.send.note}</p>
              <p className="pe21-send__status" role="status">{copyNow ? (copyNow.ok ? t.send.copied : t.send.manual) : ""}</p>
              {copyNow && !copyNow.ok ? <textarea className="pe21-send__text" readOnly value={report} aria-label={t.send.manualLabel} onFocus={(e) => e.currentTarget.select()} /> : null}
            </section>
          ) : null}
        </div>
      </div>

      <footer className="pe__foot">
        {t.foot.map((line) => <p key={line}>{uc(line)}</p>)}
      </footer>
    </div>
  );
}
