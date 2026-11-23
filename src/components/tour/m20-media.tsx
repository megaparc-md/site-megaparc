import { EmbedTour } from "@/components/tour/embed-tour";
import { PromoFilm, type FilmView } from "@/components/tour/promo-film";
import { VirtualTour } from "@/components/tour/virtual-tour";
import { m20Film, m20Tour, mediaPreview, tourPreviewCopy, tourPreviewScenes, tourScenes, type FilmVersion, type TourLevel, type TourScene } from "@/data/moscova-20-media";
import { Icon } from "@/components/ui";
import { publicAsset, type SiteLocale } from "@/lib/site-data";

/**
 * MOSCOVA 20 — THE PROMO FILM AND THE 360° TOUR (OWNER «PROPERTY COMMERCIAL EXPERIENCE 2026» Parts C–D + OWNER CLARIFICATION «Video &
 * Virtual Tour Integration» + OWNER «MOSCOVA 20 MEDIA INTEGRATION · OWNER VISUAL REVIEW», 2026-11-23). Placement decided by the OWNER: the
 * film right after the first screen; the tour in tab 01 «Адрес» of «Адрес — часть бизнес-модели» instead of the drawn aerial (the four other
 * tabs, the map and the analytics unchanged). The public site renders each only when its final material is delivered and approved
 * (src/data/moscova-20-media.ts). The OWNER preview shows the final composition before that: the player frame marked «ожидается финальный
 * файл» and the 360° interface on neutral generated placeholders marked «Демонстрация интерфейса» — never presented as the real film or tour.
 */

const subtitleLabel: Record<SiteLocale, string> = { ro: "Română", ru: "Русский", en: "English" };

const filmView = (version: FilmVersion, locale: SiteLocale): FilmView => ({
  landscape: version.landscape.map((s) => ({ src: publicAsset(s.src), type: s.type })),
  portrait: version.portrait.map((s) => ({ src: publicAsset(s.src), type: s.type })),
  poster: { landscape: publicAsset(version.poster.landscape), portrait: publicAsset(version.poster.portrait || version.poster.landscape) },
  subtitles: (Object.entries(version.subtitles) as [SiteLocale, string][]).map(([lang, src]) => ({ src: publicAsset(src), lang, label: subtitleLabel[lang], on: lang === locale && m20Film.subtitlesOnByDefault[locale] })),
});

export function M20Film({ locale }: { locale: SiteLocale }) {
  const c = m20Film.copy;
  const ready = m20Film.ownerApproved && m20Film.status === "DELIVERED";
  const first = m20Film.byLocale[locale];
  // the page language's version first; EN (chooser) also offers the other voice-over
  const order = (m20Film.chooser[locale] ? [first, first === "ro" ? "ru" : "ro"] : [first]) as ("ro" | "ru")[];
  const versions = ready ? order.flatMap((key) => { const version = m20Film.versions[key]; return version ? [{ key, label: c.languages[key][locale], film: filmView(version, locale) }] : []; }) : [];
  if (!versions.length && !mediaPreview) return null;
  return (
    <section id="film" className="lg-sec lg-sec--white film-sec" aria-labelledby="film-title">
      <div className="xp-shell">
        <p className="lg-label">{c.kicker[locale]}</p>
        <h2 className="film-sec__title" id="film-title">{c.title[locale]}</h2>
        {versions.length ? (
          <PromoFilm versions={versions} chooserLabel={c.language[locale]} title={c.title[locale]} play={c.play[locale]} duration={c.duration[locale]} note={[c.enNote[locale], c.conceptNote[locale]].filter(Boolean).join(" ")} />
        ) : (
          /* OWNER preview only: the finished frame of the player until the final file arrives — no film, nothing plays */
          <div className="film is-pending">
            <div className="film__poster is-pending" role="img" aria-label={`${c.title[locale]} — ${c.pendingBadge[locale]}`}>
              <span className="film__badge">{c.pendingBadge[locale]}</span>
              <span className="film__mark" aria-hidden="true"><i /></span>
              <span className="film__play is-off" aria-hidden="true"><Icon /> {c.play[locale]}</span>
              <span className="film__duration">{c.duration[locale]}</span>
              <span className="film__bar" aria-hidden="true" />
            </div>
            {m20Film.chooser[locale] ? (
              <div className="film__langs" role="group" aria-label={c.language[locale]}>
                <span className="lg-label">{c.language[locale]}</span>
                {order.map((key, i) => <span key={key} className={`film__lang${i === 0 ? " is-on" : ""}`}>{c.languages[key][locale]}</span>)}
              </div>
            ) : null}
            <p className="film__note">{c.pendingText[locale]}</p>
          </div>
        )}
      </div>
    </section>
  );
}

const near: Record<SiteLocale, string> = { ro: "Alături", ru: "Рядом", en: "Nearby" };

const sceneView = (scene: TourScene, locale: SiteLocale, asset: (src: string) => string) => ({
  id: scene.id,
  no: scene.no,
  level: scene.level,
  levelLabel: m20Tour.levels[scene.level][locale],
  title: scene.title[locale],
  caption: scene.caption[locale],
  full: asset(scene.files!.full),
  medium: asset(scene.files!.medium),
  poster: scene.files!.poster ? asset(scene.files!.poster) : "",
  start: scene.start,
  links: scene.links.map((link) => ({ to: link.to, label: link.label[locale], yaw: link.yaw, pitch: link.pitch })),
  info: scene.info.map((item) => ({ key: item.key, label: item.label[locale], text: item.text[locale], yaw: item.yaw, pitch: item.pitch })),
});

/**
 * The tour for tab 01 «Адрес» of the location explorer: the nine delivered and approved panoramas in our own viewer, or a ready-made hosted
 * tour (`m20Tour.embed`), or — on the OWNER preview only — the interface demonstration. null on the public site until one of the first two
 * exists (the aerial stays there).
 */
export function m20TourNode(locale: SiteLocale) {
  const c = m20Tour.copy;
  const list = m20Tour.scenes.map((scene) => ({ no: scene.no, title: scene.title[locale] }));
  const real = tourScenes();
  const demo = real.length ? [] : tourPreviewScenes();
  const scenes = real.length ? real : demo;
  const levels = (Object.keys(m20Tour.levels) as TourLevel[]).map((key) => ({ key, label: m20Tour.levels[key][locale] }));
  if (scenes.length) {
    const view = scenes.map((scene) => sceneView(scene, locale, (src) => (src.startsWith("placeholder:") ? src : publicAsset(src))));
    const copy = {
      kicker: c.kicker[locale], start: (demo.length ? tourPreviewCopy.start : c.start)[locale], scenes: c.scenes[locale], fullscreen: c.fullscreen[locale], plans: c.plans[locale], hint: c.hint[locale], loading: c.loading[locale], noGl: c.noGl[locale], near: near[locale], prev: c.prev[locale], next: c.next[locale], levels,
      ...(demo.length ? { banner: tourPreviewCopy.banner[locale], placeholder: tourPreviewCopy.placeholder[locale] } : {}),
    };
    return { scenes: view.length, demo: demo.length > 0, caption: c.kicker[locale], node: <VirtualTour scenes={view} plansHref="#plans" copy={copy} />, list };
  }
  if (m20Tour.ownerApproved && m20Tour.embed) {
    return { scenes: m20Tour.scenes.length, demo: false, caption: c.kicker[locale], node: <EmbedTour url={m20Tour.embed.url} title={c.kicker[locale]} open={tourPreviewCopy.embed[locale]} caption={m20Tour.scenes[0].caption[locale]} />, list };
  }
  return null;
}
