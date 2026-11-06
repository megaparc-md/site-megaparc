import type { CSSProperties, ReactNode } from "react";
import type { Heading, Photo } from "@/data/leasing-experience-model";
import type { Localized, SiteLocale } from "@/lib/site-data";

/**
 * Shared parts of the leasing experience modules (OWNER "MOSCOVA 20 · GOLD
 * STANDARD", 2026-11-06). Design only: every fact arrives as data from
 * src/data/leasing-experience-*.ts and src/data/leasing-inventory.ts.
 */

/** Interface vocabulary of the modules — words, never property facts. */
export const ui = {
  viewing: { ro: "Solicită o vizionare", ru: "Запросить просмотр", en: "Request a viewing" },
  waitlist: { ro: "Anunțați-mă dacă se eliberează", ru: "Сообщить, если освободится", en: "Tell me if it frees up" },
  scheme: { ro: "Vezi schema suprafețelor", ru: "Смотреть схему площадей", en: "See the area scheme" },
  leasing: { ro: "Închiriere", ru: "Аренда", en: "Leasing" },
  allSpaces: { ro: "Toate spațiile disponibile", ru: "Все свободные помещения", en: "All available spaces" },
  status: { ro: "Status", ru: "Статус", en: "Status" },
  toConfirm: { ro: "se clarifică", ru: "уточняется", en: "to be confirmed" },
  why: { ro: "De ce se poate potrivi", ru: "Почему может подойти", en: "Why it may fit" },
  check: { ro: "Ce trebuie verificat", ru: "Что проверить", en: "What to check" },
  known: { ro: "Ce se știe", ru: "Что известно", en: "What is known" },
  verify: { ro: "Ce verificăm împreună", ru: "Что проверяем вместе", en: "What we check together" },
  approx: { ro: "aprox.", ru: "ок.", en: "approx." },
  useful: { ro: "utilă", ru: "полезная", en: "useful" },
  height: { ro: "înălțime", ru: "высота", en: "height" },
  offered: { ro: "Suprafața totală oferită", ru: "Общая предлагаемая площадь", en: "Total area offered" },
  usefulTotal: { ro: "Suprafața utilă / comercială", ru: "Полезная / торговая площадь", en: "Useful / sales area" },
  contacts: { ro: "Contacte", ru: "Контакты", en: "Contacts" },
  watch: { ro: "Urmăriți filmul", ru: "Смотреть фильм", en: "Watch the film" },
} satisfies Record<string, Localized>;

/** A real photograph: 820 px and full-size sources, cover crop, lazy unless it is the hero. */
export function LgPhoto({ photo, locale, sizes = "100vw", priority = false, className = "", ratio, mobile = false }: { photo: Photo; locale: SiteLocale; sizes?: string; priority?: boolean; className?: string; ratio?: string; mobile?: boolean }) {
  const style = { ...(ratio ? { "--lg-ratio": ratio } : {}), ...(photo.position ? { "--lg-pos": photo.position } : {}) } as CSSProperties;
  const img = (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={photo.src}
      srcSet={`${photo.small} 820w, ${photo.src} ${photo.width}w`}
      sizes={sizes}
      width={photo.width}
      height={photo.height}
      alt={photo.alt[locale]}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : undefined}
      decoding="async"
    />
  );
  return (
    <span className={`lg-photo ${className}`.trim()} style={style}>
      {mobile && photo.mobile ? (
        <picture>
          <source media="(max-width: 719px)" srcSet={photo.mobile} />
          {img}
        </picture>
      ) : (
        img
      )}
    </span>
  );
}

/** Section opening: burgundy kicker line, an editorial title, an optional lead. */
export function LgHead({ heading, locale, id, tone = "light", layout = "stack", children }: { heading: Heading; locale: SiteLocale; id?: string; tone?: "light" | "dark"; layout?: "stack" | "split"; children?: ReactNode }) {
  return (
    <header className={`lg-head lg-head--${layout}${tone === "dark" ? " lg-head--dark" : ""}`} data-reveal>
      <p className="pm-kicker">{heading.kicker[locale]}</p>
      <h2 className="lg-head__title" id={id}>{heading.title[locale]}</h2>
      {heading.lead ? <p className="lg-head__lead">{heading.lead[locale]}</p> : null}
      {children}
    </header>
  );
}

/** Section wrapper with the tone used by the page rhythm. */
export function LgSection({ id, tone = "white", labelledBy, className = "", children }: { id?: string; tone?: "white" | "warm" | "paper" | "stone" | "ink"; labelledBy?: string; className?: string; children: ReactNode }) {
  return (
    <section id={id} className={`lg-sec lg-sec--${tone} ${className}`.trim()} aria-labelledby={labelledBy}>
      <div className="xp-shell">{children}</div>
    </section>
  );
}
