import { CinemaFilm } from "@/components/cinema-film";
import { MaskTitle } from "@/components/experience";
import { Button } from "@/components/ui";
import { publicAsset, type SiteLocale } from "@/lib/site-data";

/**
 * CAREERS FILM MOMENT (OWNER addendum 2026-10-08, "MICROCOPY + CAREERS VIDEO
 * CORRECTION"). Interaction principle only: a large atmospheric film, one
 * statement, one call to action. Used as a section on Home and as the hero of
 * Careers. The footage is concept video, registered in src/data/demo-content.ts
 * (videoUses); the public signal is the global PREVIEW · DEMO DATA marker.
 */

const FILM = {
  desktop: { src: "/assets/video/careers-concept.mp4", poster: "/assets/video/careers-concept-poster.webp" },
  mobile: { src: "/assets/video/careers-concept-mobile.mp4", poster: "/assets/video/careers-concept-mobile-poster.webp" },
};

const copy = {
  ro: {
    label: "Cariere",
    title: ["Aici, rezultatul", "muncii se vede."],
    home: "Clădiri, șantiere și proiecte care devin parte din oraș. Căutăm oameni gata să răspundă de rezultat împreună cu MEGAPARC.",
    page: "Clădiri, șantiere și proiecte care devin parte din oraș. Posturile deschise sunt mai jos.",
    cta: "Vedeți posturile vacante",
    pause: "Oprește filmul",
    play: "Pornește filmul",
  },
  ru: {
    label: "Вакансии",
    title: ["Работа,", "результат которой видно."],
    home: "Здания, площадки и проекты, которые становятся частью города. Ищем людей, готовых отвечать за результат вместе с MEGAPARC.",
    page: "Здания, площадки и проекты, которые становятся частью города. Открытые вакансии — ниже.",
    cta: "Смотреть вакансии",
    pause: "Остановить видео",
    play: "Включить видео",
  },
  en: {
    label: "Careers",
    title: ["Work", "you can see."],
    home: "Buildings, sites and projects that become part of the city. We are looking for people ready to own the result with MEGAPARC.",
    page: "Buildings, sites and projects that become part of the city. Open vacancies are below.",
    cta: "View vacancies",
    pause: "Pause the film",
    play: "Play the film",
  },
} satisfies Record<SiteLocale, Record<string, string | string[]>>;

const asset = (edit: { src: string; poster: string }) => ({ src: publicAsset(edit.src), poster: publicAsset(edit.poster) });

export function CareersMoment({ locale, variant, href, no, count }: { locale: SiteLocale; variant: "section" | "hero"; href: string; no?: string; count?: number }) {
  const c = copy[locale];
  const hero = variant === "hero";
  return (
    <section className={`cm${hero ? " cm--hero" : ""}`} id={hero ? "careers-hero" : "vacancies"} {...(hero ? { "data-xp-hero": "" } : {})}>
      <CinemaFilm desktop={asset(FILM.desktop)} mobile={asset(FILM.mobile)} copy={{ pause: c.pause, play: c.play }} priority={hero} />
      <span className="cm__veil" aria-hidden="true" />
      <div className="xp-shell cm__copy">
        <p className="xp-eyebrow cm__eyebrow">
          {no ? <span className="xp-eyebrow__no">{no}</span> : null}
          <span>{c.label}</span>
          {count ? <span className="cm__count">{String(count).padStart(2, "0")}</span> : null}
        </p>
        <MaskTitle as={hero ? "h1" : "h2"} className="cm__title" lines={[...c.title]} />
        <p className="cm__text">{hero ? c.page : c.home}</p>
        <div className="cm__actions">
          <Button href={href} variant="light">{c.cta}</Button>
        </div>
      </div>
    </section>
  );
}
