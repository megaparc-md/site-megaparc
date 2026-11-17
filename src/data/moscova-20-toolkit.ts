import { publicAsset, type Localized } from "@/lib/site-data";

/**
 * MOSCOVA 20 · DIGITAL LEASING TOOLKIT (OWNER «PREMIUM DIGITAL LEASING TOOLKIT» mandate, 2026-11-11) — the service layer
 * around the approved property page: the Digital Leasing Pack (a compact hub, the QR landing), the PDF dossier, the QR
 * asset, the interactive plan layer, the technical concept pre-check, the viewing request, the share flow and the
 * virtual-tour slot. Facts are never typed here: the pack reads the approved dataset (src/data/leasing-experience-moscova-20.ts
 * passport cards, the unit record, the cadastral registry). This file holds routes, versions, labels and wiring only.
 */

export const m20Toolkit = {
  project: "moscova-20",
  /** the Digital Leasing Pack route (site-relative, before the locale prefix) — the permanent QR destination on the production origin */
  packPath: "/leasing/moscova-20/pack",
  /** the QR encodes the production canonical URL only (never a preview or github.io URL); `src=qr` lets the landing count QR arrivals */
  qrDestination: "https://www.megaparc.md/leasing/moscova-20/pack/?src=qr",
  qr: {
    svg: publicAsset("/assets/leasing/moscova-20/pack/moscova-20-leasing-pack-qr.svg"),
    png: publicAsset("/assets/leasing/moscova-20/pack/moscova-20-leasing-pack-qr.png"),
    // OWNER R4.1 visual review P1 (2026-11-14): each language opens its own Pack — the RU and EN codes no longer open the RO Pack.
    // The RO file is the physical QR already in circulation and stays as it is (scripts/moscova-20-qr.mjs).
    byLocale: {
      ro: publicAsset("/assets/leasing/moscova-20/pack/moscova-20-leasing-pack-qr.svg"),
      ru: publicAsset("/assets/leasing/moscova-20/pack/moscova-20-leasing-pack-qr-ru.svg"),
      en: publicAsset("/assets/leasing/moscova-20/pack/moscova-20-leasing-pack-qr-en.svg"),
    },
  },
  // ARCHIVE ONLY (OWNER «COMMERCIAL PRESENTATION RESET» + addendum, 2026-11-13): the R1 leasing dossier is no longer linked from any page —
  // its wording is outdated («Кишинёв», «коммерческие условия обсуждаются после …», «Записаться на просмотр») and the one commercial
  // presentation is the offer (R4 until the OWNER GO on R5). The files stay at these URLs for links and printouts already sent.
  dossier: {
    version: "M20-LP-2026-11",
    /** displayed as «Обновлено: DD.MM.YYYY» */
    updated: "12.11.2026",
    pages: 10,
    file: {
      ro: publicAsset("/assets/leasing/moscova-20/dossier/moscova-20-leasing-dossier-ro.pdf"),
      ru: publicAsset("/assets/leasing/moscova-20/dossier/moscova-20-leasing-dossier-ru.pdf"),
      en: publicAsset("/assets/leasing/moscova-20/dossier/moscova-20-leasing-dossier-en.pdf"),
    } satisfies Localized,
  },
  /** 3D / 360 tour: nothing public renders while null; any provider URL (Matterport, a 360 panorama, another approved provider) plugs in here */
  virtualTourUrl: null as string | null,
  /** privacy-safe internal events (src/lib/track.ts) — no vendor is loaded for them */
  events: ["m20_dossier_download", "m20_plan_open", "m20_ecadastru_open", "m20_technical_check_start", "m20_technical_check_submit", "m20_viewing_start", "m20_viewing_submit", "m20_share", "m20_qr_landing", "m20_pack_open", "m20_qr_open"] as const,
} as const;

export type ToolkitEvent = (typeof m20Toolkit.events)[number];

/** Public wording of the toolkit — RU master, RO / EN adapted (never a price, a guarantee or a superlative). */
export const toolkitCopy = {
  pack: {
    kicker: { ro: "Moscova 20 · Leasing Pack", ru: "Moscova\u00a020 · Leasing Pack", en: "Moscova 20 · Leasing Pack" },
    title: { ro: "Moscova 20", ru: "Moscova\u00a020", en: "Moscova 20" },
    lead: { ro: "Planuri, date tehnice și cererea de vizionare.", ru: "Планы, технические данные и\u00a0запрос на\u00a0просмотр.", en: "Plans, technical data and a viewing request." },
    summary: { ro: "Imobilul", ru: "Объект", en: "The property" },
    facts: { ro: "Date verificate", ru: "Подтверждённые данные", en: "Verified facts" },
    actions: { ro: "Acțiuni", ru: "Действия", en: "Actions" },
    contacts: { ro: "Contacte", ru: "Контакты", en: "Contacts" },
    page: { ro: "Pagina completă a imobilului", ru: "Полная страница объекта", en: "The full property page" },
    plans: { ro: "Vedeți planurile", ru: "Смотреть планы", en: "View the plans" },
    plansMeta: { ro: "parter · demisol · plan oficial PDF", ru: "1‑й этаж · цоколь · официальный план PDF", en: "ground · lower ground · official plan PDF" },
    dossier: { ro: "Descarcă dosarul obiectului", ru: "Скачать досье объекта", en: "Download property dossier" },
    dossierMeta: { ro: "PDF · {pages} pagini · {version}", ru: "PDF · {pages} страниц · {version}", en: "PDF · {pages} pages · {version}" },
    // the technical pre-check labels live in @/components/leasing-toolkit/precheck-copy (edition-aware: the production edition has no form)
    book: { ro: "Solicitați o vizionare", ru: "Запросить просмотр", en: "Request a viewing" },
    bookMeta: { ro: "cerere de vizionare · ziua și intervalul preferat", ru: "запрос на\u00a0просмотр · удобный день и\u00a0время", en: "a viewing request · your preferred day and time window" },
    cadastre: { ro: "Deschideți e\u2011Cadastru", ru: "Открыть e‑Cadastru", en: "Open e-Cadastru" },
    cadastreMeta: { ro: "numărul cadastral {n}", ru: "кадастровый номер {n}", en: "cadastral number {n}" },
    share: { ro: "Distribuiți imobilul", ru: "Поделиться объектом", en: "Share the property" },
    shareMeta: { ro: "link · e‑mail · mesagerie", ru: "ссылка · e‑mail · мессенджеры", en: "link · e-mail · messengers" },
    qrTitle: { ro: "Deschideți pe telefon", ru: "Открыть на\u00a0телефоне", en: "Open on your phone" },
    qrText: { ro: "Același Leasing Pack — scanați codul sau folosiți linkul.", ru: "Тот же Leasing Pack\u00a0— отсканируйте код или откройте по\u00a0ссылке.", en: "The same Leasing Pack — scan the code or use the link." },
    updated: { ro: "Actualizat", ru: "Обновлено", en: "Updated" },
    tourTitle: { ro: "Tur virtual", ru: "Виртуальный тур", en: "Virtual tour" },
    tourOpen: { ro: "Deschide turul", ru: "Открыть тур", en: "Open the tour" },
    levelsLine: { ro: "parter + demisol", ru: "1‑й этаж + цоколь", en: "ground + lower ground" },
    // OWNER «LEASING PACK / DOSSIER CORRECTIONS» §1 (2026-11-11): the toolkit positions Moscova 20 for several business formats —
    // «коммерческое помещение», not «торговое». The unit record (src/data/leasing-inventory.ts) feeds the released property page and
    // is not changed here; the pack, the dossier, the share text and the pack OG use this label.
    unit: { ro: "Spațiu comercial · parter + demisol", ru: "Коммерческое помещение · 1‑й этаж + цоколь", en: "Commercial space · ground + lower ground" },
    // §2: quick facts first, then the actions; the detailed infrastructure is secondary and folded
    quick: { ro: "Date principale", ru: "Ключевые факты", en: "Key facts" },
    details: { ro: "Infrastructura obiectului — în detaliu", ru: "Инфраструктура объекта\u00a0— подробно", en: "Property infrastructure — in detail" },
    detailsMeta: { ro: "{n} poziții · status · e‑Cadastru", ru: "{n} позиций · статус · e‑Cadastru", en: "{n} items · status · e-Cadastru" },
  },
  plans: {
    title: { ro: "Planurile spațiului", ru: "Планы помещения", en: "Floor plans" },
    lead: { ro: "Planul oficial este documentul de bază pentru compartimentare și suprafețe. Stratul interactiv vă ajută să vă orientați mai repede pe plan.", ru: "Официальный план\u00a0— основной документ по\u00a0планировке и\u00a0площадям. Интерактивный слой помогает быстрее ориентироваться в\u00a0плане.", en: "The official plan is the reference document for layout and areas. The interactive layer helps you find your way around the plan faster." },
    layers: { ro: "Ce arătăm", ru: "Что показать", en: "What to show" },
    all: { ro: "Tot planul", ru: "Весь план", en: "Whole plan" },
    access: { ro: "Acces", ru: "Доступ", en: "Access" },
    logistics: { ro: "Logistică", ru: "Логистика", en: "Logistics" },
    sanitary: { ro: "Spații sanitare", ru: "Санитарные помещения", en: "Toilets and utility room" },
    circulation: { ro: "Circulația între niveluri", ru: "Связь уровней", en: "Vertical circulation" },
    technical: { ro: "Tehnic", ru: "Инженерные системы", en: "Technical" },
    onPlan: { ro: "Pe planul acestui nivel", ru: "На\u00a0плане этого уровня", en: "On this level's plan" },
    noneOnLevel: { ro: "Pe acest nivel nu există elemente documentate din această categorie — vedeți celălalt nivel.", ru: "На\u00a0плане этого уровня таких элементов нет\u00a0— смотрите другой уровень.", en: "This level has no documented elements of this category — see the other level." },
    facts: { ro: "Ce este confirmat", ru: "Что подтверждено", en: "What is confirmed" },
    official: { ro: "Descărcați planul oficial (PDF)", ru: "Скачать официальный план (PDF)", en: "Download the official plan (PDF)" },
    note: { ro: "Pozițiile exacte ale punctelor tehnice nu sunt desenate: sunt arătate la vizionare pe planul oficial.", ru: "Точное расположение точек подключения на\u00a0схеме не\u00a0показано\u00a0— его покажем на\u00a0просмотре по\u00a0официальному плану.", en: "The exact positions of service connection points are not drawn; we show them at the viewing on the official plan." },
  },
  share: {
    title: { ro: "Distribuiți Moscova 20", ru: "Поделиться Moscova\u00a020", en: "Share Moscova 20" },
    // OWNER P1 «SHARE MODAL REDESIGN» (2026-11-15): the compact share sheet — its heading, the property card, the copy action
    sheetTitle: { ro: "Distribuiți imobilul", ru: "Поделиться объектом", en: "Share the property" },
    cardPlace: { ro: "Chișinău", ru: "Кишинэу", en: "Chișinău" },
    cardMaterials: { ro: "Leasing Pack: oferta comercială, planurile, datele tehnice", ru: "Leasing Pack: коммерческое предложение, планы, технические данные", en: "Leasing Pack: commercial leasing proposal, plans, technical data" },
    via: { ro: "Trimiteți prin", ru: "Отправить через", en: "Send via" },
    copyAction: { ro: "Copiați linkul", ru: "Скопировать ссылку", en: "Copy link" },
    copiedShort: { ro: "Copiat", ru: "Скопировано", en: "Copied" },
    more: { ro: "Alte opțiuni", ru: "Ещё", en: "More" },
    native: { ro: "Distribuiți…", ru: "Поделиться…", en: "Share…" },
    copy: { ro: "Copiați linkul", ru: "Скопировать ссылку", en: "Copy the link" },
    copied: { ro: "Linkul către Moscova 20 a fost copiat.", ru: "Ссылка на\u00a0Moscova\u00a020 скопирована.", en: "The Moscova 20 link has been copied." },
    email: { ro: "E‑mail", ru: "E‑mail", en: "E-mail" },
    telegram: { ro: "Telegram", ru: "Telegram", en: "Telegram" },
    whatsapp: { ro: "WhatsApp", ru: "WhatsApp", en: "WhatsApp" },
    text: {
      ro: "Moscova 20 — spațiu comercial de 625,7 m² pe bulevardul Moscova, Chișinău (două niveluri și terasă). Planuri, date tehnice și cererea de vizionare:",
      ru: "Moscova\u00a020\u00a0— коммерческое помещение 625,7\u00a0м² на\u00a0бульваре Москова, Кишинэу (два уровня и\u00a0терраса). Планы, технические данные и\u00a0запрос на\u00a0просмотр:",
      en: "Moscova 20 — a 625.7 m² commercial space on Moscova Boulevard, Chișinău (two levels and a terrace). Plans, technical data and a viewing request:",
    },
  },
  bar: {
    plans: { ro: "Planuri", ru: "Планы", en: "Plans" },
    // OWNER «COMMERCIAL PRESENTATION RESET» §1 (2026-11-13): the bar opens the one current commercial document, never the old dossier;
    // OWNER «PREMIUM DOCUMENT NAMES» (2026-11-16): the document is the commercial proposal
    dossier: { ro: "Ofertă", ru: "Предложение", en: "Proposal" },
    book: { ro: "Solicitați o vizionare", ru: "Запросить просмотр", en: "Request a viewing" },
  },
  // OWNER «MAKE MOSCOVA 20 DIGITAL TOOLS DISCOVERABLE» (2026-11-11): the service block on the property page — one primary action
  // (the Leasing Pack), two secondary (the PDF presentation, the plans), one utility (the QR in a compact drawer)
  service: {
    label: { ro: "Dosarul digital al imobilului", ru: "Цифровое досье объекта", en: "Digital property dossier" },
    title: { ro: "Toate informațiile despre Moscova 20 — într-un singur loc", ru: "Вся информация по\u00a0Moscova\u00a020\u00a0— в\u00a0одном месте", en: "Everything on Moscova 20 — in one place" },
    lead: { ro: "Planuri, date tehnice, oferta comercială și instrumente pentru pregătirea vizionării.", ru: "Планы, технические данные, коммерческое предложение и\u00a0инструменты для\u00a0подготовки к\u00a0просмотру.", en: "Plans, technical data, the commercial leasing proposal and tools to prepare for a viewing." },
    pack: { ro: "Deschideți Leasing Pack", ru: "Открыть Leasing Pack", en: "Open the Leasing Pack" },
    // OWNER «PREMIUM DOCUMENT NAMES» (2026-11-16): one name for the one public commercial document — the same as commercialCopy.offerCta
    pdf: { ro: "Descărcați oferta comercială", ru: "Скачать коммерческое предложение", en: "Download the commercial leasing proposal" },
    plans: { ro: "Deschideți planurile", ru: "Открыть планы", en: "Open the plans" },
    qr: { ro: "Cod QR pentru telefon", ru: "QR на\u00a0телефон", en: "QR code for your phone" },
    qrTitle: { ro: "Leasing Pack pe telefon", ru: "Leasing Pack на\u00a0телефоне", en: "The Leasing Pack on your phone" },
    qrText: { ro: "Scanați codul cu camera telefonului sau copiați linkul.", ru: "Отсканируйте код камерой телефона или скопируйте ссылку.", en: "Scan the code with your phone camera or copy the link." },
    copied: { ro: "Linkul către Leasing Pack a fost copiat.", ru: "Ссылка на\u00a0Leasing Pack скопирована.", en: "The Leasing Pack link has been copied." },
  },
  dossier: {
    kicker: { ro: "Dosar de închiriere", ru: "Досье объекта", en: "Leasing dossier" },
    cover: { ro: "spațiu comercial · parter + demisol · Chișinău", ru: "коммерческое помещение · 1‑й этаж + цоколь · Кишинэу", en: "commercial premises · ground + lower ground · Chișinău" },
    // OWNER «LEASING PACK / DOSSIER CORRECTIONS» §3–§6 (2026-11-11): dossier wording. The shared dataset keeps the released
    // property page's copy; the dossier replaces these lines by key (facts unchanged — wording only).
    reasons: {
      location: { ro: "Rîșcani · intersecția bd. Moscova cu str. Matei Basarab.", ru: "Рышкань · пересечение бул. Москова и ул. Матей Басараб.", en: "Rîșcani · the intersection of Moscova Boulevard and Matei Basarab Street." },
      base: { ro: "Infrastructura inginerească principală și pregătirea de bază a spațiului sunt deja asigurate.", ru: "Основная инженерная инфраструктура и базовая подготовка помещения уже предусмотрены.", en: "The core engineering infrastructure and the basic preparation of the premises are already provided." },
    },
    /** replaces the dataset's «Высокая визуальная заметность фасада» location point (matched by its EN text in the dossier) */
    facade: { ro: "Fațada și intrarea sunt orientate spre bd. Moscova", ru: "Фасад и входная группа обращены к бул. Москова", en: "The frontage and the entrance face Moscova Boulevard" },
    capex: {
      ro: "Infrastructura inginerească principală și pregătirea de bază a spațiului sunt deja asigurate. Investiția chiriașului va fi necesară în primul rând pentru adaptarea spațiului la propriul format.",
      ru: "Основная инженерная инфраструктура и\u00a0базовая подготовка помещения уже предусмотрены. Инвестиции арендатора потребуются прежде всего для\u00a0адаптации пространства под\u00a0собственный формат.",
      en: "The core engineering infrastructure and the basic preparation of the premises are already provided. The tenant’s investment will be needed primarily to adapt the space to its own format.",
    },
    /** the technical-support principle (replaces «Оцениваем адаптацию до коммерческих обязательств.») */
    support: { ro: "Verificăm fezabilitatea tehnică a conceptului înainte de stabilirea condițiilor comerciale.", ru: "Проверяем техническую реализуемость концепции до согласования коммерческих условий.", en: "We check the technical feasibility of the concept before commercial terms are agreed." },
    sections: {
      property: { ro: "Imobilul", ru: "Объект", en: "Property" },
      facts: { ro: "Date principale", ru: "Ключевые факты", en: "Key facts" },
      space: { ro: "Spațiul", ru: "Пространство", en: "Space" },
      plans: { ro: "Planuri", ru: "Планы", en: "Plans" },
      technical: { ro: "Tehnic", ru: "Инженерные системы", en: "Technical" },
      access: { ro: "Acces și logistică", ru: "Доступ и\u00a0логистика", en: "Access and logistics" },
      location: { ro: "Locație", ru: "Локация", en: "Location" },
      trust: { ro: "Verificare", ru: "Проверка", en: "Verification" },
      next: { ro: "Pasul următor", ru: "Следующий шаг", en: "Next step" },
    },
    level: { ro: "Nivel", ru: "Уровень", en: "Level" },
    gross: { ro: "Totală", ru: "Общая", en: "Total" },
    useful: { ro: "Comercială", ru: "Коммерческая", en: "Commercial" },
    height: { ro: "Înălțime", ru: "Высота", en: "Height" },
    planNote: { ro: "Anexă la contractul de locațiune · Sc. 1:100 · desenul oficial, nerefăcut", ru: "Приложение к\u00a0договору аренды · М 1:100 · официальный чертёж, без\u00a0перерисовки", en: "Lease agreement annex · 1:100 · the official drawing, not redrawn" },
    cadastre: { ro: "Numărul cadastral se poate verifica pe portalul oficial e\u2011Cadastru", ru: "Кадастровый номер можно проверить на\u00a0официальном портале e\u2011Cadastru", en: "The cadastral number can be verified on the official e-Cadastru portal" },
    team: { ro: "Directorul tehnic și arhitectul MEGAPARC verifică fezabilitatea tehnică a conceptului dumneavoastră înainte de stabilirea condițiilor comerciale.", ru: "Технический директор и архитектор MEGAPARC проверяют техническую реализуемость вашей концепции до согласования коммерческих условий.", en: "MEGAPARC's Technical Director and Architect check the technical feasibility of your concept before commercial terms are agreed." },
    nextActions: { ro: ["Programează o vizionare", "Verificarea tehnică a conceptului", "Contact"], ru: ["Записаться на\u00a0просмотр", "Техническая проверка концепции", "Контакт"], en: ["Book a viewing", "Technical concept check", "Contact"] },
    qrLine: { ro: "Scanați pentru Digital Leasing Pack: planuri, date tehnice, vizionare.", ru: "Отсканируйте\u00a0— Digital Leasing Pack: планы, технические данные, просмотр.", en: "Scan for the Digital Leasing Pack: plans, technical data, viewing." },
    version: { ro: "Versiune", ru: "Версия", en: "Version" },
    footer: { ro: "MEGAPARC · proprietar și operator al obiectului · termenii comerciali se discută după verificarea formatului", ru: "MEGAPARC · собственник и\u00a0оператор объекта · коммерческие условия обсуждаются после проверки формата", en: "MEGAPARC · owner and operator of the property · commercial terms are discussed after the format check" },
  },
  // OWNER «MOSCOVA 20 PREMIUM LEASING DOSSIER R2» (2026-11-11) — the wording of the redesigned dossier and the icon utilities.
  // Design pass only: no new fact; every figure comes from the dataset. The R2 PDFs are OWNER-preview candidates until a GO.
  r2: {
    coverPositioning: { ro: "Spațiu comercial pe prima linie", ru: "Коммерческое помещение первой линии", en: "Boulevard-front commercial space" },
    coverPlace: { ro: "Chișinău · Rîșcani", ru: "Кишинэу · Рышкань", en: "Chișinău · Rîșcani" },
    coverLevels: { ro: "parter + demisol + terasă", ru: "1‑й этаж + цоколь + терраса", en: "ground + lower ground + terrace" },
    coverKicker: { ro: "MEGAPARC · LEASING DOSSIER", ru: "MEGAPARC · LEASING DOSSIER", en: "MEGAPARC · LEASING DOSSIER" },
    figures: { ro: "Cifre-cheie", ru: "Ключевые цифры", en: "Key figures" },
    offered: { ro: "propuși spre închiriere", ru: "предлагается в\u00a0аренду", en: "offered for lease" },
    total: { ro: "total", ru: "общая", en: "total" },
    commercial: { ro: "comercială", ru: "коммерческая", en: "commercial" },
    height: { ro: "înălțime", ru: "высота", en: "height" },
    objectTotal: { ro: "Întregul imobil", ru: "Объект целиком", en: "The whole property" },
    occupied: { ro: "ocupați", ru: "занято", en: "occupied" },
    planLegend: { ro: "Desen oficial · Anexă la contractul de locațiune · Sc. 1:100 · nerefăcut", ru: "Официальный чертёж · Приложение к\u00a0договору аренды · М 1:100 · без\u00a0перерисовки", en: "Official drawing · Lease agreement annex · 1:100 · not redrawn" },
    planSource: { ro: "Sursa — PDF-ul oficial", ru: "Источник\u00a0— официальный PDF", en: "Source — the official PDF" },
    engineeringLead: { ro: "Sistemele inginerești principale ale obiectului. Parametrii pentru formatul dumneavoastră se verifică împreună cu directorul tehnic și arhitectul.", ru: "Основные инженерные системы объекта. Параметры под\u00a0ваш формат проверяются вместе с\u00a0техническим директором и\u00a0архитектором.", en: "The property's core engineering systems. The parameters for your format are checked with the Technical Director and the Architect." },
    logisticsTitle: { ro: "Două laturi. Două fluxuri.", ru: "Две стороны. Два потока.", en: "Two sides. Two flows." },
    logisticsLead: { ro: "Clienții intră dinspre bulevard; marfa și serviciul — dinspre curte. Schemă de direcții, fără scară.", ru: "Клиенты\u00a0— с\u00a0бульвара, товар и\u00a0сервис\u00a0— со\u00a0двора. Схема направлений, не\u00a0в\u00a0масштабе.", en: "Customers from the boulevard; goods and service from the courtyard. A diagram of directions, not to scale." },
    locationTitle: { ro: "Adresa", ru: "Адрес", en: "The address" },
    district: { ro: "Rîșcani", ru: "Рышкань", en: "Rîșcani" },
    crossing: { ro: "Bd. Moscova × str. Matei Basarab", ru: "бул. Москова × ул. Матей Басараб", en: "Moscova Blvd × Matei Basarab St" },
    formatsTitle: { ro: "Formate posibile", ru: "Возможные форматы", en: "Possible formats" },
    formatsNote: { ro: "scenarii de utilizare, nu o confirmare a conformității tehnice — fiecare format se verifică separat", ru: "сценарии использования, а\u00a0не\u00a0подтверждение технической пригодности\u00a0— каждый формат проверяется отдельно", en: "use scenarios, not a confirmation of technical suitability — each format is checked separately" },
    exitsTotal: { ro: "Ieșiri confirmate în total", ru: "Подтверждённых выходов всего", en: "Confirmed exits in total" },
    openPlan: { ro: "Deschide planul oficial (PDF)", ru: "Открыть официальный план (PDF)", en: "Open the official plan (PDF)" },
    site: { ro: "Site-ul MEGAPARC · Moscova 20", ru: "Сайт MEGAPARC · Moscova\u00a020", en: "MEGAPARC website · Moscova 20" },
    openPack: { ro: "Deschide Digital Leasing Pack", ru: "Открыть Digital Leasing Pack", en: "Open Digital Leasing Pack" },
    footerMark: { ro: "MEGAPARC · MOSCOVA 20", ru: "MEGAPARC · MOSCOVA 20", en: "MEGAPARC · MOSCOVA 20" },
    finalTitle: { ro: "Vedeți Moscova 20 pe viu.", ru: "Посмотрите Moscova\u00a020 вживую.", en: "See Moscova 20 in person." },
    finalSupport: { ro: "Înainte de stabilirea condițiilor comerciale putem verifica fezabilitatea tehnică a formatului dumneavoastră.", ru: "До\u00a0согласования коммерческих условий мы можем проверить техническую реализуемость вашего формата.", en: "Before commercial terms are agreed, we can check the technical feasibility of your format." },
    ctaPrimary: { ro: "Solicitați o vizionare", ru: "Запросить просмотр", en: "Request a viewing" },
    ctaSecondary: { ro: "Verificați fezabilitatea tehnică", ru: "Проверить техническую реализуемость", en: "Check technical feasibility" },
    qrCaption: { ro: "Deschide Digital Leasing Pack", ru: "Открыть Digital Leasing Pack", en: "Open the Digital Leasing Pack" },
    mailSubject: { ro: "Moscova 20 — cerere de vizionare", ru: "Moscova\u00a020\u00a0— запрос на\u00a0просмотр", en: "Moscova 20 — viewing request" },
    web: { ro: "Pagina imobilului", ru: "Страница объекта", en: "Property page" },
    pack: { ro: "Digital Leasing Pack", ru: "Digital Leasing Pack", en: "Digital Leasing Pack" },
    shareTitle: { ro: "Trimiteți partenerului", ru: "Отправить партнёру", en: "Send to a partner" },
    copied: { ro: "Link copiat", ru: "Ссылка скопирована", en: "Link copied" },
    page: { ro: "pagina", ru: "страница", en: "page" },
  },
} as const;
