import type { CSSProperties, ReactNode } from "react";
import type { Heading, Photo, Shot } from "@/data/leasing-experience-model";
import { isPreviewBuild, isProductionEdition, type Localized, type SiteLocale } from "@/lib/site-data";

/**
 * Shared parts of the leasing experience (OWNER "MOSCOVA 20 · COMPACT PREMIUM
 * LEASING EXPERIENCE", 2026-11-06). Design only: every fact arrives as data
 * from src/data/leasing-experience-*.ts and src/data/leasing-inventory.ts.
 */

/** Interface vocabulary — words, never property facts. */
export const ui = {
  viewing: { ro: "Solicită o vizionare", ru: "Запросить просмотр", en: "Request a viewing" },
  checkForMe: { ro: "Verificați Moscova 20 pentru afacerea mea", ru: "Проверить Moscova 20 для моего бизнеса", en: "Check Moscova 20 for my business" },
  viewingPersonal: { ro: "Solicită o vizionare individuală", ru: "Запросить индивидуальный просмотр", en: "Request a private viewing" },
  presentation: { ro: "Primește prezentarea", ru: "Получить презентацию", en: "Get the presentation" },
  plansGet: { ro: "Primește planurile", ru: "Получить планы", en: "Get the plans" },
  plansSee: { ro: "Vezi planurile", ru: "Посмотреть планы", en: "See the plans" },
  waitlist: { ro: "Anunțați-mă dacă se eliberează", ru: "Сообщить, если освободится", en: "Tell me if it frees up" },
  leasing: { ro: "Închiriere", ru: "Аренда", en: "Leasing" },
  chapters: { ro: "Decizia rapidă", ru: "Быстрое решение", en: "Quick decision" },
  chTech: { ro: "Caracteristici tehnice", ru: "Технические характеристики", en: "Technical characteristics" },
  chLocation: { ro: "Locație și flux", ru: "Локация и поток", en: "Location and flow" },
  chPlans: { ro: "Planuri", ru: "Планы", en: "Plans" },
  chReadiness: { ro: "Pregătire pentru lansare", ru: "Готовность к запуску", en: "Ready to open" },
  economics: { ro: "Verificați economia punctului", ru: "Проверить экономику точки", en: "Check the unit economics" },
  close: { ro: "Închide", ru: "Закрыть", en: "Close" },
  see: { ro: "vezi", ru: "смотреть", en: "see" },
  ready: { ro: "Există", ru: "Есть", en: "In place" },
  tenant: { ro: "Chiriașul", ru: "Арендатор", en: "Tenant" },
  toConfirm: { ro: "Se clarifică", ru: "Уточняется", en: "To be confirmed" },
  approx: { ro: "cca.", ru: "ок.", en: "approx." },
  offered: { ro: "Suprafața oferită", ru: "Предлагаемая площадь", en: "Area offered" },
  useful: { ro: "Suprafața utilă", ru: "Полезная площадь", en: "Useful area" },
  usefulShort: { ro: "utilă", ru: "полезная", en: "useful" },
  levels: { ro: "Niveluri", ru: "Уровни", en: "Levels" },
  heights: { ro: "Înălțimea încăperilor", ru: "Высота помещений", en: "Clear height" },
  terrace: { ro: "terasă", ru: "терраса", en: "terrace" },
  parking: { ro: "Parcare", ru: "Парковка", en: "Parking" },
  route: { ro: "Construiește ruta", ru: "Построить маршрут", en: "Get directions" },
  openMap: { ro: "Deschide în Google Maps", ru: "Открыть в Google Maps", en: "Open in Google Maps" },
  status: { ro: "Status", ru: "Статус", en: "Status" },
  contacts: { ro: "Contacte", ru: "Контакты", en: "Contacts" },
  film: { ro: "Filmul", ru: "Фильм", en: "The film" },
  // OWNER "FINAL ART DIRECTION & VISUAL CONVERSION PASS" (2026-11-09): UI actions only — never a price or a term
  offer: { ro: "Primește oferta comercială", ru: "Получить коммерческое предложение", en: "Get the commercial proposal" },
  call: { ro: "Sunați", ru: "Позвонить", en: "Call" },
  plansFull: { ro: "Primește planurile complete", ru: "Получить полные планы", en: "Get the full plans" },
  economicsGo: { ro: "Verificați economia", ru: "Проверить экономику", en: "Check the economics" },
} satisfies Record<string, Localized>;

/** Splits a formatted area («625,7 м²») into the figure and the unit, so the figure can be set as display type. */
export const splitArea = (area: string) => {
  const at = area.search(/[\s ](?=\S+$)/);
  return at < 0 ? { figure: area, unit: "" } : { figure: area.slice(0, at), unit: area.slice(at + 1) };
};

/**
 * A restrained data drawing for the economics entry (portal 04 and the closed state of the tool):
 * how the visitors a model needs fall as conversion rises — a shape, never figures (the tool's
 * example is DEMO and is not a Moscova 20 characteristic).
 */
export function EconomicsGlyph({ className = "" }: { className?: string }) {
  const pts = [0.05, 0.08, 0.11, 0.14, 0.17, 0.2].map((c, i) => [40 + i * 64, 24 + (0.05 / c) * 150] as const);
  const curve = `M${pts.map(([x, y]) => `${x} ${y.toFixed(1)}`).join(" L")}`;
  return (
    <svg className={`lg-glyph ${className}`.trim()} viewBox="0 0 400 200" aria-hidden="true" focusable="false" preserveAspectRatio="xMidYMid meet">
      {[40, 104, 168, 232, 296, 360].map((x) => <line key={x} x1={x} x2={x} y1="16" y2="184" className="lg-glyph__grid" />)}
      <line x1="40" x2="360" y1="184" y2="184" className="lg-glyph__base" />
      <path d={curve} className="lg-glyph__line" pathLength={1} />
      {pts.map(([x, y], i) => <circle key={x} cx={x} cy={y} r={i === 2 ? 5 : 3} className={i === 2 ? "lg-glyph__dot is-on" : "lg-glyph__dot"} />)}
    </svg>
  );
}

/**
 * The OWNER preview (GitHub Pages build) and `next dev` show the decision modules
 * still awaiting OWNER approval (src/data/tenant-intelligence.ts); a production
 * build never does. Decided on the server — client bundles cannot read it.
 */
export const ownerPreview = isPreviewBuild || (process.env.NODE_ENV === "development" && !isProductionEdition);

/** Replaces the "{area}" token with the marketed area read from the unit record. */
export const withArea = (text: string, area: string) => text.replace("{area}", area);

/** A real photograph: 640–820 px and full-size sources, cover crop with an optional art-directed zoom, lazy unless it is the hero. */
export function LgPhoto({ photo, locale, shot, sizes = "100vw", priority = false, className = "", ratio, phone }: { photo: Photo; locale: SiteLocale; shot?: Shot; sizes?: string; priority?: boolean; className?: string; ratio?: string; phone?: Photo }) {
  const position = shot?.position ?? photo.position;
  const style = { ...(ratio ? { "--lg-ratio": ratio } : {}), ...(position ? { "--lg-pos": position } : {}), ...(shot?.zoom ? { "--lg-zoom": String(shot.zoom) } : {}) } as CSSProperties;
  // a zoomed crop always draws from the full-size file so it stays above 1× at its size
  const srcSet = shot?.zoom ? `${photo.src} ${photo.width}w` : `${photo.small} ${photo.smallWidth ?? 820}w, ${photo.src} ${photo.width}w`;
  const img = (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={photo.src} srcSet={srcSet} sizes={sizes} width={photo.width} height={photo.height} alt={photo.alt[locale]} loading={priority ? "eager" : "lazy"} fetchPriority={priority ? "high" : undefined} decoding="async" />
  );
  return (
    <span className={`lg-photo${shot?.zoom ? " is-zoomed" : ""} ${className}`.trim()} style={style}>
      {phone ? (
        <picture>
          <source media="(max-width: 719px)" srcSet={`${phone.small} 640w, ${phone.src} ${phone.width}w`} sizes="100vw" />
          {img}
        </picture>
      ) : (
        img
      )}
    </span>
  );
}

/** Section opening: burgundy kicker line, an editorial title, an optional lead. */
export function LgHead({ heading, locale, id, area, layout = "stack", children }: { heading: Heading; locale: SiteLocale; id?: string; area?: string; layout?: "stack" | "split"; children?: ReactNode }) {
  return (
    <header className={`lg-head lg-head--${layout}`} data-reveal>
      <p className="pm-kicker">{heading.kicker[locale]}</p>
      <h2 className="lg-head__title" id={id}>{area ? withArea(heading.title[locale], area) : heading.title[locale]}</h2>
      {heading.lead ? <p className="lg-head__lead">{heading.lead[locale]}</p> : null}
      {children}
    </header>
  );
}

/** Section wrapper with the tone used by the page rhythm. */
export function LgSection({ id, tone = "white", labelledBy, className = "", children }: { id?: string; tone?: "white" | "warm" | "paper" | "stone"; labelledBy?: string; className?: string; children: ReactNode }) {
  return (
    <section id={id} className={`lg-sec lg-sec--${tone} ${className}`.trim()} aria-labelledby={labelledBy}>
      <div className="xp-shell">{children}</div>
    </section>
  );
}
