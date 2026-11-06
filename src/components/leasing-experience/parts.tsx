import type { CSSProperties, ReactNode } from "react";
import type { Heading, Photo, Shot } from "@/data/leasing-experience-model";
import type { Localized, SiteLocale } from "@/lib/site-data";

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
  presentation: { ro: "Primește prezentarea obiectului", ru: "Получить презентацию объекта", en: "Get the property presentation" },
  plansGet: { ro: "Primește planurile", ru: "Получить планы", en: "Get the plans" },
  plansSee: { ro: "Vezi planurile", ru: "Смотреть планы", en: "See the plans" },
  fitCheck: { ro: "Verificați dacă obiectul se potrivește", ru: "Проверить, подходит ли объект", en: "Check whether it fits" },
  waitlist: { ro: "Anunțați-mă dacă se eliberează", ru: "Сообщить, если освободится", en: "Tell me if it frees up" },
  leasing: { ro: "Închiriere", ru: "Аренда", en: "Leasing" },
  chapters: { ro: "Capitolele paginii", ru: "Разделы страницы", en: "Page chapters" },
  chTech: { ro: "Caracteristici tehnice", ru: "Технические характеристики", en: "Technical data" },
  chLocation: { ro: "Locație și acces", ru: "Локация и доступ", en: "Location and access" },
  chPlans: { ro: "Planuri și suprafețe", ru: "Планы и площади", en: "Plans and areas" },
  chReadiness: { ro: "Pregătire pentru lansare", ru: "Готовность к запуску", en: "Ready to open" },
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
} satisfies Record<string, Localized>;

/** Replaces the "{area}" token with the marketed area read from the unit record. */
export const withArea = (text: string, area: string) => text.replace("{area}", area);

/** A real photograph: 640–820 px and full-size sources, cover crop with an optional art-directed zoom, lazy unless it is the hero. */
export function LgPhoto({ photo, locale, shot, sizes = "100vw", priority = false, className = "", ratio, phone }: { photo: Photo; locale: SiteLocale; shot?: Shot; sizes?: string; priority?: boolean; className?: string; ratio?: string; phone?: Photo }) {
  const position = shot?.position ?? photo.position;
  const style = { ...(ratio ? { "--lg-ratio": ratio } : {}), ...(position ? { "--lg-pos": position } : {}), ...(shot?.zoom ? { "--lg-zoom": String(shot.zoom) } : {}) } as CSSProperties;
  // a zoomed crop always draws from the full-size file so it stays above 1× at its size
  const srcSet = shot?.zoom ? `${photo.src} ${photo.width}w` : `${photo.small} 820w, ${photo.src} ${photo.width}w`;
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
