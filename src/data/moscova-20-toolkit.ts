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
  },
  dossier: {
    version: "M20-LP-2026-11",
    /** displayed as «Обновлено: DD.MM.YYYY» */
    updated: "11.11.2026",
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
    kicker: { ro: "Moscova 20 · Leasing Pack", ru: "Moscova 20 · Leasing Pack", en: "Moscova 20 · Leasing Pack" },
    title: { ro: "Moscova 20", ru: "Moscova 20", en: "Moscova 20" },
    lead: { ro: "Planuri, date tehnice și cererea de vizionare.", ru: "Планы, технические данные и запрос на просмотр.", en: "Plans, technical data and a viewing request." },
    summary: { ro: "Rezumatul obiectului", ru: "Объект", en: "The property" },
    facts: { ro: "Date verificate", ru: "Подтверждённые данные", en: "Verified facts" },
    actions: { ro: "Acțiuni", ru: "Действия", en: "Actions" },
    contacts: { ro: "Contacte", ru: "Контакты", en: "Contacts" },
    page: { ro: "Pagina completă a obiectului", ru: "Полная страница объекта", en: "The full property page" },
    plans: { ro: "Vezi planurile", ru: "Посмотреть планы", en: "View the plans" },
    plansMeta: { ro: "parter · demisol · plan oficial PDF", ru: "1‑й этаж · цоколь · официальный план PDF", en: "ground · lower ground · official plan PDF" },
    dossier: { ro: "Descarcă dosarul obiectului", ru: "Скачать досье объекта", en: "Download property dossier" },
    dossierMeta: { ro: "PDF · {pages} pagini · {version}", ru: "PDF · {pages} страниц · {version}", en: "PDF · {pages} pages · {version}" },
    precheck: { ro: "Verificarea tehnică a conceptului", ru: "Техническая проверка концепции", en: "Technical concept check" },
    precheckMeta: { ro: "6–8 întrebări · răspunde directorul tehnic și arhitectul", ru: "6–8 вопросов · отвечают технический директор и архитектор", en: "6–8 questions · answered by the Technical Director and the Architect" },
    book: { ro: "Solicită o vizionare", ru: "Запросить просмотр", en: "Request a viewing" },
    bookMeta: { ro: "cerere de vizionare · ziua și intervalul preferat", ru: "запрос на просмотр · удобный день и время", en: "a viewing request · your preferred day and time window" },
    cadastre: { ro: "Deschide e‑Cadastru", ru: "Открыть e‑Cadastru", en: "Open e-Cadastru" },
    cadastreMeta: { ro: "numărul cadastral {n}", ru: "кадастровый номер {n}", en: "cadastral number {n}" },
    share: { ro: "Distribuie obiectul", ru: "Поделиться объектом", en: "Share the property" },
    shareMeta: { ro: "link · e‑mail · mesagerie", ru: "ссылка · e‑mail · мессенджеры", en: "link · e-mail · messengers" },
    qrTitle: { ro: "Deschide pe telefon", ru: "Открыть на телефоне", en: "Open on your phone" },
    qrText: { ro: "Același Leasing Pack — scanați codul sau folosiți linkul.", ru: "Тот же Leasing Pack — отсканируйте код или откройте по ссылке.", en: "The same Leasing Pack — scan the code or use the link." },
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
    details: { ro: "Infrastructura obiectului — în detaliu", ru: "Инфраструктура объекта — подробно", en: "Property infrastructure — in detail" },
    detailsMeta: { ro: "{n} poziții · status · e‑Cadastru", ru: "{n} позиций · статус · e‑Cadastru", en: "{n} items · status · e-Cadastru" },
  },
  plans: {
    title: { ro: "Planurile spațiului", ru: "Планы помещения", en: "The plans of the premises" },
    lead: { ro: "Planul oficial rămâne sursa de adevăr. Stratul interactiv doar arată ce să căutați pe plan.", ru: "Официальный план остаётся источником истины. Интерактивный слой лишь показывает, что искать на плане.", en: "The official plan stays the source of truth. The interactive layer only shows what to look for on it." },
    layers: { ro: "Ce arătăm", ru: "Что показать", en: "What to show" },
    all: { ro: "Tot planul", ru: "Весь план", en: "Whole plan" },
    access: { ro: "Acces", ru: "Доступ", en: "Access" },
    logistics: { ro: "Logistică", ru: "Логистика", en: "Logistics" },
    sanitary: { ro: "Spații sanitare", ru: "Санитарные помещения", en: "Sanitary rooms" },
    circulation: { ro: "Circulația între niveluri", ru: "Связь уровней", en: "Vertical circulation" },
    technical: { ro: "Tehnic", ru: "Инженерия", en: "Technical" },
    onPlan: { ro: "Pe planul acestui nivel", ru: "На плане этого уровня", en: "On this level's plan" },
    noneOnLevel: { ro: "Pe acest nivel nu există elemente documentate din această categorie — vedeți celălalt nivel.", ru: "На этом уровне документированных элементов этой категории нет — смотрите другой уровень.", en: "This level has no documented elements of this category — see the other level." },
    facts: { ro: "Ce este confirmat", ru: "Что подтверждено", en: "What is confirmed" },
    official: { ro: "Descarcă planul oficial (PDF)", ru: "Скачать официальный план (PDF)", en: "Download the official plan (PDF)" },
    note: { ro: "Pozițiile exacte ale punctelor tehnice nu sunt desenate: sunt arătate la vizionare pe planul oficial.", ru: "Точные позиции инженерных точек не рисуются: их показывают на просмотре по официальному плану.", en: "Exact positions of technical points are not drawn: they are shown at the viewing on the official plan." },
  },
  share: {
    title: { ro: "Distribuie Moscova 20", ru: "Поделиться Moscova 20", en: "Share Moscova 20" },
    native: { ro: "Distribuie…", ru: "Поделиться…", en: "Share…" },
    copy: { ro: "Copiază linkul", ru: "Скопировать ссылку", en: "Copy the link" },
    copied: { ro: "Linkul către Moscova 20 a fost copiat.", ru: "Ссылка на Moscova 20 скопирована.", en: "The Moscova 20 link has been copied." },
    email: { ro: "E‑mail", ru: "E‑mail", en: "E-mail" },
    telegram: { ro: "Telegram", ru: "Telegram", en: "Telegram" },
    whatsapp: { ro: "WhatsApp", ru: "WhatsApp", en: "WhatsApp" },
    text: {
      ro: "Moscova 20 — spațiu comercial de 625,7 m² pe bulevardul Moscova, Chișinău (parter + demisol). Planuri, date tehnice și cererea de vizionare:",
      ru: "Moscova 20 — коммерческое помещение 625,7 м² на бульваре Москова, Кишинёв (1‑й этаж + цоколь). Планы, технические данные и запрос на просмотр:",
      en: "Moscova 20 — a 625.7 m² commercial space on Moscova Boulevard, Chișinău (ground + lower ground). Plans, technical data and a viewing request:",
    },
  },
  bar: {
    plans: { ro: "Planuri", ru: "Планы", en: "Plans" },
    dossier: { ro: "Dosar", ru: "Досье", en: "Dossier" },
    book: { ro: "Solicită o vizionare", ru: "Запросить просмотр", en: "Request a viewing" },
  },
  economics: {
    precheck: { ro: "Solicită verificarea tehnică", ru: "Запросить техническую проверку", en: "Request the technical check" },
  },
  // OWNER «MAKE MOSCOVA 20 DIGITAL TOOLS DISCOVERABLE» (2026-11-11): the service block on the property page — one primary action
  // (the Leasing Pack), two secondary (the PDF presentation, the plans), one utility (the QR in a compact drawer)
  service: {
    label: { ro: "Dosarul digital al obiectului", ru: "Цифровое досье объекта", en: "Digital property dossier" },
    title: { ro: "Toate informațiile despre Moscova 20 — într-un singur loc", ru: "Вся информация по Moscova 20 — в одном месте", en: "Everything on Moscova 20 — in one place" },
    lead: { ro: "Planuri, date tehnice, prezentarea obiectului și instrumente pentru pregătirea vizionării.", ru: "Планы, технические данные, презентация объекта и инструменты для подготовки к просмотру.", en: "Plans, technical data, the property presentation and tools to prepare for a viewing." },
    pack: { ro: "Deschide Leasing Pack", ru: "Открыть Leasing Pack", en: "Open the Leasing Pack" },
    pdf: { ro: "Descarcă prezentarea PDF", ru: "Скачать презентацию PDF", en: "Download the PDF presentation" },
    plans: { ro: "Deschide planurile", ru: "Открыть планы", en: "Open the plans" },
    qr: { ro: "Cod QR pentru telefon", ru: "QR на телефон", en: "QR for your phone" },
    qrTitle: { ro: "Leasing Pack pe telefon", ru: "Leasing Pack на телефоне", en: "The Leasing Pack on your phone" },
    qrText: { ro: "Scanați codul cu camera telefonului sau copiați linkul.", ru: "Отсканируйте код камерой телефона или скопируйте ссылку.", en: "Scan the code with your phone camera or copy the link." },
    copied: { ro: "Linkul către Leasing Pack a fost copiat.", ru: "Ссылка на Leasing Pack скопирована.", en: "The Leasing Pack link has been copied." },
  },
  dossier: {
    kicker: { ro: "Dosar de închiriere", ru: "Досье объекта", en: "Leasing dossier" },
    cover: { ro: "spațiu comercial · parter + demisol · Chișinău", ru: "коммерческое помещение · 1‑й этаж + цоколь · Кишинёв", en: "commercial premises · ground + lower ground · Chișinău" },
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
      ru: "Основная инженерная инфраструктура и базовая подготовка помещения уже предусмотрены. Инвестиции арендатора потребуются прежде всего для адаптации пространства под собственный формат.",
      en: "The core engineering infrastructure and the basic preparation of the premises are already provided. The tenant’s investment will be needed primarily to adapt the space to its own format.",
    },
    /** the technical-support principle (replaces «Оцениваем адаптацию до коммерческих обязательств.») */
    support: { ro: "Verificăm fezabilitatea tehnică a conceptului înainte de convenirea condițiilor comerciale.", ru: "Проверяем техническую реализуемость концепции до согласования коммерческих условий.", en: "We check the technical feasibility of the concept before commercial terms are agreed." },
    sections: {
      property: { ro: "Obiectul", ru: "Объект", en: "Property" },
      facts: { ro: "Date principale", ru: "Ключевые факты", en: "Key facts" },
      space: { ro: "Spațiul", ru: "Пространство", en: "Space" },
      plans: { ro: "Planuri", ru: "Планы", en: "Plans" },
      technical: { ro: "Tehnic", ru: "Инженерия", en: "Technical" },
      access: { ro: "Acces și logistică", ru: "Доступ и логистика", en: "Access and logistics" },
      location: { ro: "Locație", ru: "Локация", en: "Location" },
      trust: { ro: "Verificare", ru: "Проверка", en: "Trust" },
      next: { ro: "Pasul următor", ru: "Следующий шаг", en: "Next step" },
    },
    level: { ro: "Nivel", ru: "Уровень", en: "Level" },
    gross: { ro: "Totală", ru: "Общая", en: "Gross" },
    useful: { ro: "Comercială", ru: "Коммерческая", en: "Commercial" },
    height: { ro: "Înălțime", ru: "Высота", en: "Height" },
    planNote: { ro: "Anexă la contractul de locațiune · Sc. 1:100 · desenul oficial, nerefăcut", ru: "Приложение к договору аренды · М 1:100 · официальный чертёж, без перерисовки", en: "Lease agreement annex · 1:100 · the official drawing, not redrawn" },
    cadastre: { ro: "Numărul cadastral se verifică în portalul oficial e‑Cadastru", ru: "Кадастровый номер проверяется в официальном портале e‑Cadastru", en: "The cadastral number can be verified in the official e-Cadastru portal" },
    team: { ro: "Directorul tehnic și arhitectul MEGAPARC verifică fezabilitatea tehnică a conceptului dumneavoastră înainte de convenirea condițiilor comerciale.", ru: "Технический директор и архитектор MEGAPARC проверяют техническую реализуемость вашей концепции до согласования коммерческих условий.", en: "MEGAPARC's Technical Director and Architect check the technical feasibility of your concept before commercial terms are agreed." },
    nextActions: { ro: ["Programează o vizionare", "Verificarea tehnică a conceptului", "Contact"], ru: ["Записаться на просмотр", "Техническая проверка концепции", "Контакт"], en: ["Book a viewing", "Technical concept check", "Contact"] },
    qrLine: { ro: "Scanați pentru Digital Leasing Pack: planuri, date tehnice, vizionare.", ru: "Отсканируйте — Digital Leasing Pack: планы, технические данные, просмотр.", en: "Scan for the Digital Leasing Pack: plans, technical data, viewing." },
    version: { ro: "Versiune", ru: "Версия", en: "Version" },
    footer: { ro: "MEGAPARC · proprietar și operator al obiectului · termenii comerciali se discută după verificarea formatului", ru: "MEGAPARC · собственник и оператор объекта · коммерческие условия обсуждаются после проверки формата", en: "MEGAPARC · owner and operator of the property · commercial terms are discussed after the format check" },
  },
  // OWNER «MOSCOVA 20 PREMIUM LEASING DOSSIER R2» (2026-11-11) — the wording of the redesigned dossier and the icon utilities.
  // Design pass only: no new fact; every figure comes from the dataset. The R2 PDFs are OWNER-preview candidates until a GO.
  r2: {
    coverPositioning: { ro: "Spațiu comercial pe prima linie", ru: "Коммерческое помещение первой линии", en: "First-line commercial space" },
    coverPlace: { ro: "Chișinău · Rîșcani", ru: "Кишинёв · Рышкань", en: "Chișinău · Rîșcani" },
    coverLevels: { ro: "parter + demisol + terasă", ru: "1‑й этаж + цоколь + терраса", en: "ground + lower ground + terrace" },
    coverKicker: { ro: "MEGAPARC · LEASING DOSSIER", ru: "MEGAPARC · LEASING DOSSIER", en: "MEGAPARC · LEASING DOSSIER" },
    figures: { ro: "Cifre-cheie", ru: "Ключевые цифры", en: "Key figures" },
    offered: { ro: "oferiți în chirie", ru: "предлагается в аренду", en: "offered for lease" },
    total: { ro: "total", ru: "общая", en: "total" },
    commercial: { ro: "comercială", ru: "коммерческая", en: "commercial" },
    height: { ro: "înălțime", ru: "высота", en: "height" },
    objectTotal: { ro: "Obiectul întreg", ru: "Объект целиком", en: "The whole property" },
    occupied: { ro: "ocupați", ru: "занято", en: "occupied" },
    planLegend: { ro: "Desen oficial · Anexă la contractul de locațiune · Sc. 1:100 · nerefăcut", ru: "Официальный чертёж · Приложение к договору аренды · М 1:100 · без перерисовки", en: "Official drawing · Lease agreement annex · 1:100 · not redrawn" },
    planSource: { ro: "Sursa — PDF-ul oficial", ru: "Источник — официальный PDF", en: "Source — the official PDF" },
    engineeringLead: { ro: "Sistemele inginerești principale ale obiectului. Parametrii pentru formatul dumneavoastră se verifică împreună cu directorul tehnic și arhitectul.", ru: "Основные инженерные системы объекта. Параметры под ваш формат проверяются вместе с техническим директором и архитектором.", en: "The property's core engineering systems. The parameters for your format are checked with the Technical Director and the Architect." },
    logisticsTitle: { ro: "Două laturi. Două fluxuri.", ru: "Две стороны. Два потока.", en: "Two sides. Two flows." },
    logisticsLead: { ro: "Clienții intră dinspre bulevard; marfa și serviciul — dinspre curte. Schemă de direcții, fără scară.", ru: "Клиенты — с бульвара, товар и сервис — со двора. Схема направлений, не в масштабе.", en: "Customers from the boulevard; goods and service from the courtyard. A diagram of directions, not to scale." },
    locationTitle: { ro: "Adresa", ru: "Адрес", en: "The address" },
    district: { ro: "Rîșcani", ru: "Рышкань", en: "Rîșcani" },
    crossing: { ro: "Bd. Moscova × str. Matei Basarab", ru: "бул. Москова × ул. Матей Басараб", en: "Moscova Blvd × Matei Basarab St" },
    formatsTitle: { ro: "Formate posibile", ru: "Возможные форматы", en: "Possible formats" },
    formatsNote: { ro: "scenarii de utilizare, nu o confirmare a conformității tehnice — fiecare format se verifică separat", ru: "сценарии использования, а не подтверждение технической пригодности — каждый формат проверяется отдельно", en: "use scenarios, not a confirmation of technical suitability — each format is checked separately" },
    exitsTotal: { ro: "Ieșiri confirmate în total", ru: "Подтверждённых выходов всего", en: "Confirmed exits in total" },
    openPlan: { ro: "Deschide planul oficial (PDF)", ru: "Открыть официальный план (PDF)", en: "Open the official plan (PDF)" },
    site: { ro: "Site-ul MEGAPARC · Moscova 20", ru: "Сайт MEGAPARC · Moscova 20", en: "MEGAPARC website · Moscova 20" },
    openPack: { ro: "Deschide Digital Leasing Pack", ru: "Открыть Digital Leasing Pack", en: "Open Digital Leasing Pack" },
    footerMark: { ro: "MEGAPARC · MOSCOVA 20", ru: "MEGAPARC · MOSCOVA 20", en: "MEGAPARC · MOSCOVA 20" },
    finalTitle: { ro: "Vedeți Moscova 20 pe viu.", ru: "Посмотрите Moscova 20 вживую.", en: "See Moscova 20 in person." },
    finalSupport: { ro: "Înainte de convenirea condițiilor comerciale putem verifica fezabilitatea tehnică a formatului dumneavoastră.", ru: "До согласования коммерческих условий мы можем проверить техническую реализуемость вашего формата.", en: "Before commercial terms are agreed we can check the technical feasibility of your format." },
    ctaPrimary: { ro: "Solicită o vizionare", ru: "Запросить просмотр", en: "Request a viewing" },
    ctaSecondary: { ro: "Verifică fezabilitatea tehnică", ru: "Проверить техническую реализуемость", en: "Check technical feasibility" },
    qrCaption: { ro: "Deschide Digital Leasing Pack", ru: "Открыть Digital Leasing Pack", en: "Open the Digital Leasing Pack" },
    mailSubject: { ro: "Moscova 20 — cerere de vizionare", ru: "Moscova 20 — запрос на просмотр", en: "Moscova 20 — viewing request" },
    web: { ro: "Pagina obiectului", ru: "Страница объекта", en: "Property page" },
    pack: { ro: "Digital Leasing Pack", ru: "Digital Leasing Pack", en: "Digital Leasing Pack" },
    shareTitle: { ro: "Trimiteți partenerului", ru: "Отправить партнёру", en: "Send to a partner" },
    copied: { ro: "Link copiat", ru: "Ссылка скопирована", en: "Link copied" },
    page: { ro: "pagina", ru: "страница", en: "page" },
  },
} as const;
