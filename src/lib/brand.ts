import type { Localized } from "@/lib/site-data";

/**
 * MEGAPARC Brand Book 2.0 — verbal identity, messaging architecture and the
 * documented visual system, as data. Governance: docs/BRAND_BOOK_2_0.md.
 *
 * The production logo is not redrawn here. The text lock-up in the header
 * remains provisional until the OWNER supplies the production SVG.
 *
 * OWNER correction 2026-10-08: the model is ACQUIRE · DEVELOP · LEASE own real
 * estate (then operate, hold or sell, reinvest). MEGAPARC is not a third-party
 * asset manager — no "asset management" line anywhere in the brand register.
 */

export const brandLayers = {
  /** Emotional, future-facing brand idea (unchanged). */
  statement: { ro: "Construim viitorul.", ru: "Строим будущее.", en: "We build the future." } satisfies Localized,
  /** Owner philosophy. */
  strategicIdea: {
    ro: "Imobiliare proprii, construite și exploatate pentru mult timp",
    ru: "Собственная недвижимость, построенная и эксплуатируемая надолго",
    en: "Our own real estate, built and run for the long term",
  } satisfies Localized,
  /** Business model — three directions (OWNER brief 2026-10-08). Hold or sell and reinvestment are supporting logic. */
  model: {
    ro: "Investiții imobiliare · Dezvoltare · Închiriere",
    ru: "Инвестиции в недвижимость · Девелопмент · Аренда",
    en: "Real estate investment · Development · Leasing",
  } satisfies Localized,
  /** Positioning. */
  platform: {
    ro: "Cumpărăm, dezvoltăm și închiriem imobiliare comerciale proprii",
    ru: "Покупаем, развиваем и сдаём в аренду собственную коммерческую недвижимость",
    en: "We acquire, develop and lease our own commercial real estate",
  } satisfies Localized,
  /** Geography (OWNER addendum 2026-09-26). Current portfolio in Moldova; offers from other countries considered. */
  mandate: {
    ro: "Toate obiectele actuale sunt în Republica Moldova. Analizăm și propuneri din alte țări.",
    ru: "Все текущие объекты — в Республике Молдова. Рассматриваем и предложения из других стран.",
    en: "All current properties are in the Republic of Moldova. We also consider offers from other countries.",
  } satisfies Localized,
  /** Capabilities line, localised. */
  capabilities: {
    ro: "Cumpărăm · Dezvoltăm · Închiriem",
    ru: "Покупаем · Развиваем · Сдаём в аренду",
    en: "Acquire · Develop · Lease",
  } satisfies Localized,
};

/** Signature red brand moment — four words, one per line. */
export const signatureWords: Record<"ro" | "ru" | "en", string[]> = {
  ro: ["Investiții.", "Dezvoltare.", "Închiriere."],
  ru: ["Инвестиции.", "Девелопмент.", "Аренда."],
  en: ["Investment.", "Development.", "Leasing."],
};

export const brandEssence = {
  title: { ro: "Esența brandului", ru: "Суть бренда", en: "Brand essence" } satisfies Localized,
  text: {
    ro: "MEGAPARC își construiește și își exploatează singură clădirile, pe termen lung. Nu clădiri predate, ci obiecte care funcționează.",
    ru: "MEGAPARC сама строит и эксплуатирует свои здания — надолго. Не сданные здания, а работающие объекты.",
    en: "MEGAPARC builds and runs its own buildings, for the long term. Not buildings handed over, but properties that work.",
  } satisfies Localized,
  words: {
    ro: ["Profesionist", "Arhitectural", "Consecvent", "Pe termen lung", "Proprietar"],
    ru: ["Профессиональный", "Архитектурный", "Последовательный", "Долгосрочный", "Собственник"],
    en: ["Professional", "Architectural", "Consistent", "Long-term", "Owner-minded"],
  } as Record<"ro" | "ru" | "en", string[]>,
};

/* ------------------------------------------------------------------ */
/* Colour system 2.0                                                    */
/* ------------------------------------------------------------------ */

export type BrandColour = {
  name: string;
  role: Localized;
  hex: string;
  rgb: string;
  token: string;
  /** core = existing identity; supporting = neutral scale; proposed = BRAND BOOK 2.0 PROPOSED */
  status: "core" | "supporting" | "proposed";
  onDark?: boolean;
};

export const brandColours: BrandColour[] = [
  { name: "MEGAPARC Burgundy", role: { ro: "Accent principal de brand · cifre, reguli, stări selectate, câmpul-semnătură", ru: "Основной акцент бренда · номера, линейки, выбранные состояния, сигнатурное поле", en: "Primary brand accent · numbers, rules, selected states, the signature field" }, hex: "#74202F", rgb: "116 32 47", token: "--brand", status: "core" },
  { name: "MEGAPARC Signal Red", role: { ro: "Doar semnal mic · punct de stare, săgeată, pin, subliniere activă, logo", ru: "Только малый сигнал · точка статуса, стрелка, метка, активное подчёркивание, логотип", en: "Small signal only · status dot, arrow, pin, active underline, the logo" }, hex: "#ED1C2E", rgb: "237 28 46", token: "--signal", status: "core" },
  { name: "Carbon", role: { ro: "Câmp întunecat · text principal", ru: "Тёмное поле · основной текст", en: "Dark field · primary text" }, hex: "#111216", rgb: "17 18 22", token: "--ink", status: "core", onDark: true },
  { name: "Architectural White", role: { ro: "Fundal luminos · text pe întunecat", ru: "Светлый фон · текст на тёмном", en: "Light ground · text on dark" }, hex: "#FFFFFF", rgb: "255 255 255", token: "--white", status: "core" },
  { name: "Graphite", role: { ro: "Câmp întunecat secundar", ru: "Вторичное тёмное поле", en: "Secondary dark field" }, hex: "#1F2126", rgb: "31 33 38", token: "--graphite", status: "supporting", onDark: true },
  { name: "Warm Stone", role: { ro: "Secțiuni calde · fundaluri editoriale", ru: "Тёплые секции · редакционные фоны", en: "Warm sections · editorial grounds" }, hex: "#E4DFD5", rgb: "228 223 213", token: "--stone", status: "supporting" },
  { name: "Concrete", role: { ro: "Fundal neutru intermediar", ru: "Нейтральный промежуточный фон", en: "Intermediate neutral ground" }, hex: "#D3D0CA", rgb: "211 208 202", token: "--concrete", status: "supporting" },
  { name: "Paper / Ivory", role: { ro: "Fundal principal", ru: "Основной фон", en: "Primary ground" }, hex: "#F3F1EC", rgb: "243 241 236", token: "--paper", status: "supporting" },
  { name: "Soft Grey", role: { ro: "Text secundar · linii", ru: "Вторичный текст · линии", en: "Secondary text · rules" }, hex: "#8A8E94", rgb: "138 142 148", token: "--grey", status: "supporting" },
  { name: "Burgundy Deep", role: { ro: "Hover pe butoane · accent profund", ru: "Hover кнопок · глубокий акцент", en: "Button hover · deep accent" }, hex: "#5C1925", rgb: "92 25 37", token: "--brand-deep", status: "supporting" },
  { name: "Burgundy Tint", role: { ro: "Ton discret pe fundal deschis", ru: "Деликатный оттенок на светлом фоне", en: "Quiet tint on light grounds" }, hex: "#F3E7E8", rgb: "243 231 232", token: "--brand-tint", status: "supporting" },
];

export const gradientPolicy = {
  decorativeBrandGradients: false,
  functionalImageVeilsAllowed: true,
  alphaMasksAllowed: true,
  rule: {
    ro: "Fără gradienturi decorative de brand. Velele funcționale peste imagini și măștile alfa sunt permise.",
    ru: "Без декоративных брендовых градиентов. Функциональные затемнения изображений и альфа-маски разрешены.",
    en: "No decorative brand gradients. Functional image veils and alpha masks are allowed.",
  } satisfies Localized,
};

/* ------------------------------------------------------------------ */
/* Typography scale                                                     */
/* ------------------------------------------------------------------ */

export type TypeStyle = { name: string; token: string; className: string; use: Localized };

export const typeScale: TypeStyle[] = [
  { name: "Display XXL", token: "--t-display-xxl", className: "t-display-xxl", use: { ro: "Momentul roșu, ani mari, hero", ru: "Красный момент, крупные годы, hero", en: "Red moment, large years, hero" } },
  { name: "H1", token: "--t-h1", className: "t-h1", use: { ro: "Titluri de pagină", ru: "Заголовки страниц", en: "Page titles" } },
  { name: "H2", token: "--t-h2", className: "t-h2", use: { ro: "Titluri de secțiune", ru: "Заголовки секций", en: "Section titles" } },
  { name: "H3", token: "--t-h3", className: "t-h3", use: { ro: "Titluri de bloc", ru: "Заголовки блоков", en: "Block titles" } },
  { name: "Body", token: "--t-body", className: "t-body", use: { ro: "Text editorial", ru: "Редакционный текст", en: "Editorial copy" } },
  { name: "Small", token: "--t-small", className: "t-small", use: { ro: "Note, condiții", ru: "Примечания, условия", en: "Notes, conditions" } },
  { name: "Caption", token: "--t-caption", className: "t-caption", use: { ro: "Legende foto, index", ru: "Подписи к фото, индекс", en: "Photo captions, index" } },
  { name: "Metric", token: "--t-metric", className: "t-metric", use: { ro: "Cifre de capital și scară", ru: "Цифры капитала и масштаба", en: "Capital and scale figures" } },
  { name: "Navigation", token: "--t-nav", className: "t-nav", use: { ro: "Navigație, limbi", ru: "Навигация, языки", en: "Navigation, languages" } },
  { name: "Data label", token: "--t-label", className: "t-label", use: { ro: "Etichete de date, majuscule", ru: "Метки данных, капитель", en: "Data labels, uppercase" } },
];

/** Glyph coverage sample used on the brand-system review route. */
export const glyphSample = {
  ro: "Ăă Ââ Îî Șș Țț — Chișinău · Rîșcani · Creangă",
  ru: "Ёё Жж Щщ Ыы Ъъ — Кишинэу · Рышкань · Дрокия",
  en: "€25M+ · 10,939 m² · 5.05 ha · 1995 → 2030 · 04 / 02",
};

/** Graphic devices of the identity (documented; used across sections). */
export const graphicDevices: { name: string; text: Localized }[] = [
  { name: "The Red Line", text: { ro: "O linie roșie scurtă marchează începutul, hover-ul și tranzițiile.", ru: "Короткая красная линия отмечает начало, hover и переходы.", en: "A short red line marks beginnings, hover states and transitions." } },
  { name: "Asset Grid", text: { ro: "Grilă arhitecturală asimetrică pentru active; niciodată un catalog uniform.", ru: "Асимметричная архитектурная сетка для активов; никогда не однородный каталог.", en: "An asymmetric architectural grid for assets; never a uniform catalogue." } },
  { name: "Capital Numbers", text: { ro: "Cifre mari, tabulare, cu unitate discretă: €, m², ha, +.", ru: "Крупные табличные цифры с деликатной единицей: €, м², га, +.", en: "Large tabular figures with a quiet unit: €, m², ha, +." } },
  { name: "Dark Field", text: { ro: "Secțiuni carbon pentru strategie, capital și organizație.", ru: "Карбоновые секции для стратегии, капитала и организации.", en: "Carbon sections for strategy, capital and organisation." } },
  { name: "Red Field", text: { ro: "Un singur câmp roșu pe pagină, rezervat afirmației de model.", ru: "Одно красное поле на страницу, зарезервированное для утверждения модели.", en: "One red field per page, reserved for the model statement." } },
  { name: "Architectural Crops", text: { ro: "Decupaje cinematice, orizont corect, fără decorare.", ru: "Кинематографические кадрирования, ровный горизонт, без декора.", en: "Cinematic crops, a level horizon, no decoration." } },
  { name: "Large Years", text: { ro: "1995 · 2005 · 2020 · 2030 ca ancore tipografice.", ru: "1995 · 2005 · 2020 · 2030 как типографические якоря.", en: "1995 · 2005 · 2020 · 2030 as typographic anchors." } },
  { name: "Precise Dividers", text: { ro: "Linii subțiri, index numerotat, aliniere strictă.", ru: "Тонкие линии, нумерованный индекс, строгое выравнивание.", en: "Hairlines, numbered index, strict alignment." } },
];
