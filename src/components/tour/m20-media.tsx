import { PromoFilm } from "@/components/tour/promo-film";
import { VirtualTour } from "@/components/tour/virtual-tour";
import { filmVersionFor, m20Film, m20Tour, tourScenes, type TourLevel } from "@/data/moscova-20-media";
import { publicAsset, type SiteLocale } from "@/lib/site-data";

/**
 * MOSCOVA 20 — THE PROMO FILM AND THE 360° TOUR (OWNER «PROPERTY COMMERCIAL EXPERIENCE 2026» Parts C–D + OWNER CLARIFICATION «Video &
 * Virtual Tour Integration», 2026-11-23). Placement decided by the OWNER: the film right after the first screen; the tour inside «Адрес —
 * часть бизнес-модели» instead of the drawn aerial (the location, transport, surroundings and potential analytics stay). Each renders only
 * when its final material is delivered and approved (src/data/moscova-20-media.ts) — today neither renders and the working page is unchanged.
 */

const subtitleLabel: Record<SiteLocale, string> = { ro: "Română", ru: "Русский", en: "English" };

export function M20Film({ locale }: { locale: SiteLocale }) {
  const version = filmVersionFor(locale);
  if (!version) return null;
  const c = m20Film.copy;
  const film = {
    landscape: version.landscape.map((s) => ({ src: publicAsset(s.src), type: s.type })),
    portrait: version.portrait.map((s) => ({ src: publicAsset(s.src), type: s.type })),
    poster: { landscape: publicAsset(version.poster.landscape), portrait: publicAsset(version.poster.portrait || version.poster.landscape) },
    subtitles: (Object.entries(version.subtitles) as [SiteLocale, string][]).map(([lang, src]) => ({ src: publicAsset(src), lang, label: subtitleLabel[lang], on: lang === locale && m20Film.subtitlesOnByDefault[locale] })),
  };
  return (
    <section id="film" className="lg-sec lg-sec--white film-sec" aria-labelledby="film-title">
      <div className="xp-shell">
        <p className="lg-label">{c.kicker[locale]}</p>
        <h2 className="film-sec__title" id="film-title">{c.title[locale]}</h2>
        <PromoFilm film={film} title={c.title[locale]} play={c.play[locale]} duration={c.duration[locale]} note={[c.enNote[locale], c.conceptNote[locale]].filter(Boolean).join(" ")} />
      </div>
    </section>
  );
}

/** the tour for the address view of the location explorer — null until the nine panoramas are delivered and approved */
export function m20TourNode(locale: SiteLocale) {
  const scenes = tourScenes();
  if (!scenes.length) return null;
  const c = m20Tour.copy;
  const levels = (Object.keys(m20Tour.levels) as TourLevel[]).map((key) => ({ key, label: m20Tour.levels[key][locale] }));
  const near = { ro: "Alături", ru: "Рядом", en: "Nearby" }[locale];
  const view = scenes.map((scene) => ({
    id: scene.id,
    no: scene.no,
    level: scene.level,
    levelLabel: m20Tour.levels[scene.level][locale],
    title: scene.title[locale],
    caption: scene.caption[locale],
    full: publicAsset(scene.files!.full),
    medium: publicAsset(scene.files!.medium),
    poster: publicAsset(scene.files!.poster),
    start: scene.start,
    links: scene.links.map((link) => ({ to: link.to, label: link.label[locale], yaw: link.yaw, pitch: link.pitch })),
    info: scene.info.map((item) => ({ key: item.key, label: item.label[locale], text: item.text[locale], yaw: item.yaw, pitch: item.pitch })),
  }));
  return {
    scenes: view.length,
    caption: c.kicker[locale],
    node: <VirtualTour scenes={view} plansHref="#plans" copy={{ kicker: c.kicker[locale], start: c.start[locale], scenes: c.scenes[locale], fullscreen: c.fullscreen[locale], plans: c.plans[locale], hint: c.hint[locale], loading: c.loading[locale], noGl: c.noGl[locale], near, prev: c.prev[locale], next: c.next[locale], levels }} />,
    list: view.map((scene) => ({ no: scene.no, title: scene.title })),
  };
}
