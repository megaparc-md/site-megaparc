import type { Locale } from "@/components/visit-planner/store";

/**
 * VISIT PLANNER — the visitor's wording, RO / RU / EN (OWNER «VISIT PLANNER & COMMERCIAL DESK V1», 2026-11-27).
 * Rules: a request is «a request» until an employee confirms it — «confirmed» is said only for a confirmed visit; no price, term or
 * availability promise; the property's facts come from the property record, never from this file. RU / RO typography (no hanging
 * short words, a dash never starts a line) is applied by `tidy` to every string.
 */
const NB = String.fromCharCode(160);
const short = { ru: "в|во|на|и|с|со|к|о|об|у|по|за|из|от|до|не|ни|а|но|для|или|же|бы|ли|это|вы|мы|я|он|при|без|под|над", ro: "și|la|de|în|cu|pe|o|un|a|e|să|ce|nu|vă|se|ne|le|al|ai|din|sau|ca|mai|prin|până|este" };

function tidy(text: string, locale: Locale): string {
  if (locale === "en") return text;
  const words = new RegExp(`(^|[\\s(«„])(${short[locale]})\\s`, "giu");
  // twice: two short words in a row
  return text.replace(words, `$1$2${NB}`).replace(words, `$1$2${NB}`).replace(/\s—/g, `${NB}—`);
}

const raw = {
  ru: {
    kicker: "Персональный просмотр",
    lead: "Выберите день и время — менеджер MEGAPARC подтвердит запрос и встретит вас у входа.",
    facts: { duration: "Около {n} минут", durationLabel: "Длительность", with: "С менеджером MEGAPARC", withLabel: "Формат", levels: "Весь объект, все уровни", levelsLabel: "Что покажем" },
    offered: "предлагается в аренду",
    tour: "Виртуальный тур 360°", map: "Открыть на карте", route: "Построить маршрут", property: "Страница объекта",
    demo: { mark: "OWNER PREVIEW · тестовые данные", text: "Расписание демонстрационное, запрос сохраняется только в этом браузере и никуда не отправляется.", desk: "Открыть Commercial Desk" },
    steps: { date: "Дата", time: "Время", contact: "Контакты" },
    calendar: { prev: "Предыдущий месяц", next: "Следующий месяц", open: "есть свободное время", none: "нет свободного времени", today: "сегодня", legend: "Доступны только дни со свободным временем. Время указано по Кишинэу.", empty: "В ближайшие {n} дней свободного времени нет. Напишите или позвоните — подберём время лично." },
    slots: { pick: "Сначала выберите день", morning: "Утро", afternoon: "День", none: "На этот день свободного времени не осталось — выберите другой.", selected: "Вы выбрали", zone: "по времени Кишинэу" },
    form: {
      name: "Имя и фамилия", company: "Компания / бренд", phone: "Телефон", email: "E-mail", note: "Комментарии и пожелания", notePh: "Например: формат бизнеса, сколько человек приедет, что важно увидеть",
      language: "Язык общения", optional: "необязательно", consent: "Согласен(на) на использование моих данных для ответа на этот запрос.",
      submit: "Отправить запрос на просмотр", after: "Это запрос, а не подтверждение: время закрепляется за вами и подтверждается менеджером.",
      errors: { slot: "Выберите день и время.", name: "Укажите имя и фамилию.", phone: "Укажите телефон, по которому можно подтвердить просмотр.", email: "Проверьте адрес e-mail.", consent: "Нужно согласие, чтобы мы могли ответить.", taken: "Это время только что заняли. Выберите другое — календарь обновлён.", summary: "Проверьте отмеченные поля" },
    },
    languages: { ro: "Română", ru: "Русский", en: "English" },
    status: {
      requested: { mark: "Ожидает подтверждения", title: "Запрос получен.", text: "Время закреплено за вами. Менеджер MEGAPARC подтвердит просмотр — до подтверждения визит не считается назначенным." },
      confirmed: { mark: "Подтверждён", title: "Просмотр подтверждён.", text: "Менеджер MEGAPARC встретит вас у входа в назначенное время." },
      moved: "Менеджер изменил время просмотра. Новое время — ниже.",
      cancelledClient: { mark: "Отменён", title: "Запрос отменён.", text: "Вы отменили запрос. Выбрать другое время можно в любой момент." },
      cancelledStaff: { mark: "Отменён", title: "Просмотр отменён.", text: "Менеджер отменил просмотр. Выберите другое время или свяжитесь с нами." },
      declined: { mark: "Не подтверждён", title: "Это время подтвердить не удалось.", text: "Выберите другое время — или свяжитесь с нами, подберём лично." },
      completed: { mark: "Состоялся", title: "Просмотр состоялся.", text: "Спасибо, что приехали. Следующий шаг — коммерческое предложение и техническая проверка вашего формата." },
      no_show: { mark: "Не состоялся", title: "Просмотр не состоялся.", text: "Выберите другое время — будем рады показать объект." },
      ref: "Номер запроса", when: "Дата и время", where: "Адрес", who: "Вас встретит", manager: "менеджер MEGAPARC", message: "Сообщение менеджера",
      line: { received: "Запрос получен", confirm: "Подтверждение менеджером", visit: "Просмотр" },
      ics: "Добавить в календарь", icsWait: "Календарная встреча появится после подтверждения.", move: "Выбрать другое время", cancel: "Отменить запрос", cancelAsk: "Отменить этот запрос на просмотр?", yes: "Да, отменить", no: "Оставить", again: "Запланировать новый просмотр",
      moving: "Выберите новое время. До подтверждения менеджером действует прежний запрос.", keep: "Оставить прежнее время", moveSubmit: "Попросить это время",
      notFound: "Запрос не найден в этом браузере. Запланируйте просмотр заново.", icsTitle: "Просмотр: {name} · MEGAPARC", icsText: "Персональный просмотр {name}. Номер запроса: {ref}.",
    },
    closed: { title: "Запись на просмотр пока недоступна.", text: "Свяжитесь с нами напрямую — предложим день и время лично." },
    entry: { title: "Выберите день и время просмотра", text: "Свободные интервалы — в календаре. Запрос подтверждает менеджер MEGAPARC.", cta: "Запланировать просмотр", meta: "Около {n} минут · с менеджером MEGAPARC", demo: "Preview · тестовые данные" },
  },
  ro: {
    kicker: "Vizionare personală",
    lead: "Alegeți ziua și ora — managerul MEGAPARC confirmă cererea și vă întâmpină la intrare.",
    facts: { duration: "Circa {n} minute", durationLabel: "Durata", with: "Cu managerul MEGAPARC", withLabel: "Formatul", levels: "Întreaga proprietate, toate nivelurile", levelsLabel: "Ce vă arătăm" },
    offered: "propuși spre închiriere",
    tour: "Tur virtual 360°", map: "Deschideți pe hartă", route: "Planificați traseul", property: "Pagina proprietății",
    demo: { mark: "OWNER PREVIEW · date de test", text: "Programul este demonstrativ, cererea se păstrează doar în acest browser și nu se trimite nicăieri.", desk: "Deschideți Commercial Desk" },
    steps: { date: "Data", time: "Ora", contact: "Contacte" },
    calendar: { prev: "Luna precedentă", next: "Luna următoare", open: "există ore libere", none: "nu există ore libere", today: "astăzi", legend: "Sunt disponibile doar zilele cu ore libere. Ora este cea a Chișinăului.", empty: "În următoarele {n} zile nu există ore libere. Scrieți-ne sau sunați — stabilim ora personal." },
    slots: { pick: "Alegeți mai întâi ziua", morning: "Dimineața", afternoon: "După-amiaza", none: "Pentru această zi nu au mai rămas ore libere — alegeți alta.", selected: "Ați ales", zone: "ora Chișinăului" },
    form: {
      name: "Nume și prenume", company: "Companie / brand", phone: "Telefon", email: "E-mail", note: "Comentarii și preferințe", notePh: "De exemplu: formatul afacerii, câte persoane veniți, ce doriți să vedeți",
      language: "Limba de comunicare", optional: "opțional", consent: "Sunt de acord ca datele mele să fie folosite pentru a răspunde la această cerere.",
      submit: "Trimiteți cererea de vizionare", after: "Aceasta este o cerere, nu o confirmare: ora vă este rezervată și este confirmată de manager.",
      errors: { slot: "Alegeți ziua și ora.", name: "Indicați numele și prenumele.", phone: "Indicați telefonul la care putem confirma vizionarea.", email: "Verificați adresa de e-mail.", consent: "Este necesar acordul pentru a vă răspunde.", taken: "Această oră tocmai a fost ocupată. Alegeți alta — calendarul este actualizat.", summary: "Verificați câmpurile marcate" },
    },
    languages: { ro: "Română", ru: "Русский", en: "English" },
    status: {
      requested: { mark: "Așteaptă confirmarea", title: "Cererea a fost primită.", text: "Ora vă este rezervată. Managerul MEGAPARC confirmă vizionarea — până la confirmare vizita nu este considerată stabilită." },
      confirmed: { mark: "Confirmată", title: "Vizionarea este confirmată.", text: "Managerul MEGAPARC vă întâmpină la intrare la ora stabilită." },
      moved: "Managerul a modificat ora vizionării. Noua oră este mai jos.",
      cancelledClient: { mark: "Anulată", title: "Cererea a fost anulată.", text: "Ați anulat cererea. Puteți alege oricând altă oră." },
      cancelledStaff: { mark: "Anulată", title: "Vizionarea a fost anulată.", text: "Managerul a anulat vizionarea. Alegeți altă oră sau contactați-ne." },
      declined: { mark: "Neconfirmată", title: "Această oră nu a putut fi confirmată.", text: "Alegeți altă oră — sau contactați-ne și o stabilim personal." },
      completed: { mark: "A avut loc", title: "Vizionarea a avut loc.", text: "Vă mulțumim că ați venit. Pasul următor — oferta comercială și verificarea tehnică a formatului dumneavoastră." },
      no_show: { mark: "Nu a avut loc", title: "Vizionarea nu a avut loc.", text: "Alegeți altă oră — vă arătăm cu plăcere proprietatea." },
      ref: "Numărul cererii", when: "Data și ora", where: "Adresa", who: "Vă întâmpină", manager: "managerul MEGAPARC", message: "Mesajul managerului",
      line: { received: "Cerere primită", confirm: "Confirmarea managerului", visit: "Vizionarea" },
      ics: "Adăugați în calendar", icsWait: "Evenimentul de calendar apare după confirmare.", move: "Alegeți altă oră", cancel: "Anulați cererea", cancelAsk: "Anulați această cerere de vizionare?", yes: "Da, anulați", no: "Păstrați", again: "Planificați o nouă vizionare",
      moving: "Alegeți noua oră. Până la confirmarea managerului rămâne valabilă cererea anterioară.", keep: "Păstrați ora anterioară", moveSubmit: "Solicitați această oră",
      notFound: "Cererea nu a fost găsită în acest browser. Planificați din nou vizionarea.", icsTitle: "Vizionare: {name} · MEGAPARC", icsText: "Vizionare personală {name}. Numărul cererii: {ref}.",
    },
    closed: { title: "Programarea vizionărilor nu este disponibilă deocamdată.", text: "Contactați-ne direct — vă propunem ziua și ora personal." },
    entry: { title: "Alegeți ziua și ora vizionării", text: "Intervalele libere sunt în calendar. Cererea este confirmată de managerul MEGAPARC.", cta: "Planificați vizionarea", meta: "Circa {n} minute · cu managerul MEGAPARC", demo: "Preview · date de test" },
  },
  en: {
    kicker: "Private viewing",
    lead: "Choose a day and a time — a MEGAPARC manager confirms your request and meets you at the entrance.",
    facts: { duration: "About {n} minutes", durationLabel: "Duration", with: "With a MEGAPARC manager", withLabel: "Format", levels: "The whole property, every level", levelsLabel: "What you see" },
    offered: "offered for lease",
    tour: "360° virtual tour", map: "Open on the map", route: "Get directions", property: "Property page",
    demo: { mark: "OWNER PREVIEW · test data", text: "The schedule is a demonstration; your request is kept in this browser only and is not sent anywhere.", desk: "Open the Commercial Desk" },
    steps: { date: "Date", time: "Time", contact: "Contact" },
    calendar: { prev: "Previous month", next: "Next month", open: "times available", none: "no times available", today: "today", legend: "Only days with free times can be chosen. Times are Chișinău time.", empty: "There are no free times in the next {n} days. Write or call us and we will arrange a time personally." },
    slots: { pick: "Choose a day first", morning: "Morning", afternoon: "Afternoon", none: "No free times are left for this day — please choose another.", selected: "You chose", zone: "Chișinău time" },
    form: {
      name: "First and last name", company: "Company / brand", phone: "Phone", email: "E-mail", note: "Comments and wishes", notePh: "For example: your business format, how many of you are coming, what matters to see",
      language: "Preferred language", optional: "optional", consent: "I agree that my data may be used to answer this request.",
      submit: "Send the viewing request", after: "This is a request, not a confirmation: the time is held for you and confirmed by a manager.",
      errors: { slot: "Choose a day and a time.", name: "Enter your first and last name.", phone: "Enter a phone number we can confirm the viewing on.", email: "Check the e-mail address.", consent: "We need your consent to reply.", taken: "This time has just been taken. Please choose another — the calendar is updated.", summary: "Please check the marked fields" },
    },
    languages: { ro: "Română", ru: "Русский", en: "English" },
    status: {
      requested: { mark: "Awaiting confirmation", title: "Request received.", text: "The time is held for you. A MEGAPARC manager will confirm the viewing — until then the visit is not yet arranged." },
      confirmed: { mark: "Confirmed", title: "Your viewing is confirmed.", text: "A MEGAPARC manager will meet you at the entrance at the agreed time." },
      moved: "The manager changed the time of the viewing. The new time is below.",
      cancelledClient: { mark: "Cancelled", title: "Request cancelled.", text: "You cancelled the request. You can choose another time whenever you like." },
      cancelledStaff: { mark: "Cancelled", title: "Viewing cancelled.", text: "The manager cancelled the viewing. Choose another time or contact us." },
      declined: { mark: "Not confirmed", title: "This time could not be confirmed.", text: "Choose another time — or contact us and we will arrange it personally." },
      completed: { mark: "Held", title: "The viewing took place.", text: "Thank you for coming. The next step is the commercial proposal and the technical check of your format." },
      no_show: { mark: "Not held", title: "The viewing did not take place.", text: "Choose another time — we will be glad to show you the property." },
      ref: "Request number", when: "Date and time", where: "Address", who: "You will be met by", manager: "a MEGAPARC manager", message: "Message from the manager",
      line: { received: "Request received", confirm: "Confirmation by a manager", visit: "Viewing" },
      ics: "Add to calendar", icsWait: "The calendar event appears once the viewing is confirmed.", move: "Choose another time", cancel: "Cancel the request", cancelAsk: "Cancel this viewing request?", yes: "Yes, cancel", no: "Keep it", again: "Plan a new viewing",
      moving: "Choose the new time. Until a manager confirms it, the earlier request stays in force.", keep: "Keep the earlier time", moveSubmit: "Ask for this time",
      notFound: "The request was not found in this browser. Please plan the viewing again.", icsTitle: "Viewing: {name} · MEGAPARC", icsText: "Private viewing of {name}. Request number: {ref}.",
    },
    closed: { title: "Viewings cannot be booked online yet.", text: "Contact us directly and we will suggest a day and a time personally." },
    entry: { title: "Choose the day and time of your viewing", text: "Free times are in the calendar. A MEGAPARC manager confirms the request.", cta: "Plan a viewing", meta: "About {n} minutes · with a MEGAPARC manager", demo: "Preview · test data" },
  },
};

export type VisitCopy = (typeof raw)["ru"];

function tidyAll<T>(value: T, locale: Locale): T {
  if (typeof value === "string") return tidy(value, locale) as T;
  if (value && typeof value === "object") return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, tidyAll(item, locale)])) as T;
  return value;
}

export const visitCopy: Record<Locale, VisitCopy> = { ru: tidyAll(raw.ru, "ru"), ro: tidyAll(raw.ro, "ro"), en: raw.en };

/** the Intl locale of dates */
export const dateLocale = (locale: Locale) => (locale === "ru" ? "ru-RU" : locale === "ro" ? "ro-RO" : "en-GB");
