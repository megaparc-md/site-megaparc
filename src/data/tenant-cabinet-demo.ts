/**
 * TENANT CABINET · OWNER DEMO — synthetic data only (OWNER «COMPLETE THE MISSING TENANT CABINET OWNER DEMO», 2026-11-11).
 *
 * Everything here is invented for the non-public OWNER demo at /ru/owner-demo/tenant-cabinet/ (noindex, not in the sitemap,
 * navigation or footer; removed from the production artifact by scripts/package-production.mjs). The tenant «DEMO TENANT SRL»
 * does not exist; the unit «DEMO-01», every amount, invoice, document, request and meter reading is a placeholder. None of it is
 * a balance, invoice, lease term, rent, debt, personal contact or bank detail of any real tenant, and none of it is a commercial
 * term of Moscova 20. The only real data used are the public MEGAPARC contacts (src/data/demo-content.ts → contactLinks) and the
 * public, confirmed description of the building (address, access sides, heating). The public entry stays off: src/data/tenant-cabinet.ts
 * `enabled: false`.
 */

const N = " ";
/** money in the demo — always MDL, thin grouping with no-break spaces */
export const mdl = (n: number) => `${n.toLocaleString("ru-RU").replace(/\s/g, N)}${N}MDL`;

export const demoBase = "/ru/owner-demo/tenant-cabinet";

export const demoMeta = {
  marker: "OWNER DEMO · NOT FOR PUBLIC USE",
  note: `Прототип на${N}демо-данных · ничего не${N}отправляется · срез на${N}01.12.2026`,
  product: "Кабинет арендатора",
  tenant: "DEMO TENANT SRL",
  contract: "Договор DEMO-2026-001",
  property: "Moscova 20",
  address: `бул.${N}Москова, 20 · Кишинёв, сектор Рышкань`,
  unit: `Помещение DEMO-01 · 1‑й этаж`,
  site: "Сайт MEGAPARC",
} as const;

export type DemoSection = "overview" | "finance" | "documents" | "requests" | "utilities" | "property" | "contacts";

/** the cabinet navigation — six sections (contacts are reached from the overview and the property page) */
export const demoNav: { key: Exclude<DemoSection, "contacts">; label: string; path: string }[] = [
  { key: "overview", label: "Обзор", path: "/" },
  { key: "finance", label: "Финансы", path: "/finance" },
  { key: "documents", label: "Документы", path: "/documents" },
  { key: "requests", label: "Обращения", path: "/requests" },
  { key: "utilities", label: "Коммунальные", path: "/utilities" },
  { key: "property", label: "Объект", path: "/property" },
];
export const demoHref = (path: string) => `${demoBase}${path === "/" ? "" : path}/`;

// ── FINANCE ────────────────────────────────────────────────────────────────────────────────────────────────────────────────
export const demoInvoice = {
  number: "DEMO-INV-2026-12",
  period: "Декабрь 2026",
  issued: "01.12.2026",
  due: "15.12.2026",
  status: "К оплате",
  lines: [
    { key: "rent", label: "Аренда", note: "Помещение DEMO-01 · декабрь 2026", amount: 36000 },
    { key: "utilities", label: "Коммунальные услуги", note: "Электроэнергия, вода, отопление · ноябрь 2026", amount: 5450 },
    { key: "other", label: "Прочие начисления", note: "Обслуживание общей территории · декабрь 2026", amount: 900 },
  ],
};
export const demoInvoiceTotal = demoInvoice.lines.reduce((sum, line) => sum + line.amount, 0); // 42 350

export const demoHistory = [
  { period: "Ноябрь 2026", invoice: "DEMO-INV-2026-11", rent: 36000, utilities: 4980, other: 900, paid: "08.11.2026" },
  { period: "Октябрь 2026", invoice: "DEMO-INV-2026-10", rent: 36000, utilities: 3870, other: 900, paid: "10.10.2026" },
  { period: "Сентябрь 2026", invoice: "DEMO-INV-2026-09", rent: 36000, utilities: 3410, other: 900, paid: "12.09.2026" },
  { period: "Август 2026", invoice: "DEMO-INV-2026-08", rent: 36000, utilities: 3620, other: 900, paid: "11.08.2026" },
  { period: "Июль 2026", invoice: "DEMO-INV-2026-07", rent: 36000, utilities: 3750, other: 900, paid: "14.07.2026" },
].map((row) => ({ ...row, total: row.rent + row.utilities + row.other }));

// ── DOCUMENTS ──────────────────────────────────────────────────────────────────────────────────────────────────────────────
export const demoDocCategories = ["Договор аренды", "Дополнительные соглашения", "Счета", "Акты", "Технические документы", "Правила объекта"] as const;
export type DemoDocCategory = (typeof demoDocCategories)[number];
export const demoDocuments: { title: string; date: string; type: DemoDocCategory; format: string; fresh?: boolean }[] = [
  { title: "Счёт № DEMO-INV-2026-12", date: "01.12.2026", type: "Счета", format: "PDF", fresh: true },
  { title: `Акт оказанных услуг за${N}ноябрь 2026`, date: "30.11.2026", type: "Акты", format: "PDF", fresh: true },
  { title: "Счёт № DEMO-INV-2026-11", date: "01.11.2026", type: "Счета", format: "PDF" },
  { title: `Дополнительное соглашение №${N}2 · размещение вывески`, date: "02.09.2026", type: "Дополнительные соглашения", format: "PDF" },
  { title: `Дополнительное соглашение №${N}1 · изменение реквизитов арендатора`, date: "15.06.2026", type: "Дополнительные соглашения", format: "PDF" },
  { title: `Протокол проверки электроснабжения помещения`, date: "20.03.2026", type: "Технические документы", format: "PDF" },
  { title: "Договор аренды № DEMO-2026-001", date: "01.03.2026", type: "Договор аренды", format: "PDF" },
  { title: "Акт приёма-передачи помещения DEMO-01", date: "01.03.2026", type: "Акты", format: "PDF" },
  { title: "Схема помещения DEMO-01", date: "01.03.2026", type: "Технические документы", format: "PDF" },
  { title: "Правила объекта Moscova 20", date: "01.01.2026", type: "Правила объекта", format: "PDF" },
  { title: `Порядок доступа, разгрузки и${N}парковки`, date: "01.01.2026", type: "Правила объекта", format: "PDF" },
];

// ── REQUESTS ───────────────────────────────────────────────────────────────────────────────────────────────────────────────
export const demoStatuses = ["Получено", "В работе", "Ожидает арендатора", "Выполнено"] as const;
export type DemoStatus = (typeof demoStatuses)[number];
export const demoRequestCategories = ["Электричество", "Отопление", "Вентиляция", "Вода", "Доступ", "Парковка", "Общая территория", "Повреждение", "Другое"] as const;
export const demoRequests: { number: string; title: string; category: (typeof demoRequestCategories)[number]; created: string; status: DemoStatus; owner: string; steps: { date: string; status: DemoStatus; text: string }[] }[] = [
  {
    number: "DEMO-REQ-015", title: `Подтёк на${N}потолке у${N}служебного входа`, category: "Повреждение", created: "30.11.2026", status: "Получено", owner: "Техническая служба",
    steps: [{ date: "30.11.2026", status: "Получено", text: `Обращение зарегистрировано, фото приложено. Осмотр запланирован на${N}01.12.2026.` }],
  },
  {
    number: "DEMO-REQ-014", title: `Не работает часть освещения во${N}входной зоне`, category: "Электричество", created: "28.11.2026", status: "В работе", owner: "Техническая служба",
    steps: [
      { date: "28.11.2026", status: "Получено", text: "Обращение зарегистрировано." },
      { date: "29.11.2026", status: "В работе", text: `Вход осмотрен, неисправен блок питания двух светильников. Замена запланирована на${N}03.12.2026.` },
    ],
  },
  {
    number: "DEMO-REQ-013", title: `Пропуск для поставщика на${N}разгрузку со${N}стороны двора`, category: "Доступ", created: "26.11.2026", status: "Ожидает арендатора", owner: "Управляющий объектом",
    steps: [
      { date: "26.11.2026", status: "Получено", text: "Обращение зарегистрировано." },
      { date: "27.11.2026", status: "Ожидает арендатора", text: `Укажите номер автомобиля и${N}время приезда поставщика.` },
    ],
  },
  {
    number: "DEMO-REQ-012", title: `Слабый поток воздуха в${N}цоколе`, category: "Вентиляция", created: "18.11.2026", status: "Выполнено", owner: "Техническая служба",
    steps: [
      { date: "18.11.2026", status: "Получено", text: "Обращение зарегистрировано." },
      { date: "19.11.2026", status: "В работе", text: "Проверка канальной системы." },
      { date: "20.11.2026", status: "Выполнено", text: "Фильтры очищены, поток воздуха восстановлен." },
    ],
  },
];

// ── UTILITIES ──────────────────────────────────────────────────────────────────────────────────────────────────────────────
export const demoMeters = {
  previous: "Октябрь 2026",
  current: "Ноябрь 2026",
  rows: [
    { key: "electricity", label: "Электроэнергия", unit: `кВт·ч`, previous: 2840, current: 3120, note: "" },
    { key: "water", label: "Вода", unit: `м³`, previous: 38, current: 41, note: "" },
    { key: "heating", label: "Отопление", unit: "Гкал", previous: 3.1, current: 6.8, note: `начало отопительного сезона` },
  ],
};

// ── PROPERTY ───────────────────────────────────────────────────────────────────────────────────────────────────────────────
export const demoProperty = {
  rows: [
    { label: "Объект", value: "Moscova 20", note: `бул.${N}Москова, 20 · Кишинёв, сектор Рышкань` },
    { label: "Помещение", value: "DEMO-01", note: "демо" },
    { label: "Арендуемая площадь", value: `120,0${N}м²`, note: "демо" },
    { label: "Уровень", value: "1‑й этаж", note: "демо" },
    { label: "Статус договора", value: "Действует", note: `№${N}DEMO-2026-001 · срок и${N}условия договора в${N}демо не${N}показываются` },
    { label: "Следующий платёж", value: "15.12.2026", note: "счёт DEMO-INV-2026-12" },
  ],
  // the public, confirmed description of the building — not data of the demo tenant
  technical: [
    { label: "Доступ", value: `Вход для клиентов с${N}бульвара; служебный вход и${N}разгрузочная рампа со${N}стороны двора` },
    { label: "Отопление", value: "Централизованное · Termoelectrica" },
    { label: "Учёт", value: `Счётчики электроэнергии, воды и${N}тепла (демо)` },
    { label: "Парковка", value: `При объекте; порядок пользования согласуется с${N}управляющим` },
  ],
};

// ── CONTACTS ───────────────────────────────────────────────────────────────────────────────────────────────────────────────
/** roles only — no person; in the demo every role routes to the public MEGAPARC contacts (direct service lines = OWNER INPUT) */
export const demoContacts = [
  { key: "manager", role: "Управляющий объектом", text: `Договор, доступ, пропуска, общие вопросы по${N}объекту.`, subject: "Moscova 20 · управляющий объектом" },
  { key: "accounting", role: "Бухгалтерия", text: `Счета, акты, сверка платежей.`, subject: "Moscova 20 · бухгалтерия" },
  { key: "technical", role: "Техническая служба", text: `Неисправности, инженерные системы, показания счётчиков.`, subject: "Moscova 20 · техническая служба" },
  { key: "emergency", role: "Экстренный контакт", text: `Авария: протечка, отключение электроэнергии, угроза безопасности.`, subject: "Moscova 20 · авария" },
] as const;

/** the three steps of the MEGAPARC digital relationship (OWNER story §14) */
export const demoStory = [
  { no: "01", title: "Сайт MEGAPARC", text: "Найти объект", path: "/ru/projects/" },
  { no: "02", title: "Digital Leasing", text: `Оценить объект и${N}запросить просмотр`, path: "/ru/leasing/moscova-20/pack/" },
  { no: "03", title: "Кабинет арендатора", text: `Управлять отношениями после подписания договора`, path: null },
] as const;
