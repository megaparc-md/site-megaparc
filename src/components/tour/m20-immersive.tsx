import { LgPhoto } from "@/components/leasing-experience/parts";
import { ImmersiveTour } from "@/components/tour/immersive-tour";
import { visitUrl } from "@/components/visit-planner/href";
import type { LeasingExperience } from "@/data/leasing-experience-model";
import { individualOfferHref } from "@/data/moscova-20-commercial";
import { m20TourLive, type VendorSceneLevel } from "@/data/moscova-20-media";
import { siteUrl } from "@/lib/seo";
import { localePath, publicAsset, type SiteLocale } from "@/lib/site-data";

/**
 * MOSCOVA 20 — THE IMMERSIVE 360° VISIT ON THE PROPERTY PAGE (OWNER «MOSCOVA 20 IMMERSIVE EXPERIENCE R1», 2026-11-26).
 *
 * The photographer's interactive tour, served from this origin as an immutable vendor module (src/data/moscova-20-media.ts → m20TourVendor),
 * presented as a visit of the property: the section #tour after the main presentation (hero · film · navigation · summary cards) and before
 * the detail (dossier, commercial terms, formats, location, plans) — the OWNER statement RO / RU / EN, the facts of the package, the stage
 * (src/components/tour/immersive-tour.tsx: click-to-load, language hand-over, scenes, full screen, share, the next step). Two compact entry
 * points lead here: one quiet line on the first screen and the 360° mark of tab 01 «Адрес — как виден объект». Everything renders only while
 * the package is delivered (m20TourVendor.delivered) — otherwise nothing, and tab 01 keeps its «in preparation» composition.
 */
export function M20ImmersiveTour({ locale, x }: { locale: SiteLocale; x: LeasingExperience }) {
  const live = m20TourLive();
  const cover = live ? x.photos[live.cover.photo] : undefined;
  if (!live || !cover) return null;
  const c = live.copy;
  const t = (key: Exclude<keyof typeof c, "facts">) => c[key][locale];
  const levels = (Object.keys(live.levels) as VendorSceneLevel[]).map((key) => ({ key, label: live.levels[key][locale] }));
  return (
    <section id="tour" className="lg-sec lg-sec--paper tour-sec" aria-labelledby="tour-title">
      <div className="xp-shell">
        <header className="tour-sec__head">
          <div>
            <p className="lg-label">{t("kicker")}</p>
            <h2 className="tour-sec__title" id="tour-title">{t("title")}</h2>
          </div>
          <p className="tour-sec__lead">{t("lead")}</p>
          <ul className="tour-sec__facts" aria-label={t("kicker")}>{c.facts.map((fact, i) => <li key={i}>{fact[locale]}</li>)}</ul>
        </header>
        <ImmersiveTour
          src={publicAsset(live.path)}
          directUrl={`${siteUrl}${live.path}`}
          lang={locale}
          name="Moscova 20"
          startScene={live.startScene}
          scenes={live.scenes.map((scene) => ({ id: scene.id, title: scene.title[locale], level: scene.level }))}
          levels={levels}
          cover={<LgPhoto photo={cover} shot={{ photo: live.cover.photo, position: live.cover.position }} locale={locale} sizes="(min-width: 1280px) 1200px, 100vw" />}
          copy={{
            start: t("start"), fullscreen: t("fullscreen"), exitFullscreen: t("exitFullscreen"), after: t("after"), loading: t("loading"), openPage: t("openPage"),
            scenes: t("scenes"), scenesHint: t("scenesHint"), share: t("share"), shareText: t("shareText"), copy: t("copy"), copied: t("copied"), email: t("email"),
            next: t("next"), offer: t("offer"), plans: t("plans"), terms: t("terms"), contact: t("contact"), region: t("region"), frame: t("frame"), sceneOf: t("sceneOf"),
          }}
          // the existing routes of the page — the viewing scene, the confirmed e-mail with its subject, the plans, the commercial terms, the contact page
          ctas={{ viewing: visitUrl(locale, x.project, "tour") ?? "#viewing", offer: individualOfferHref(locale), plans: "#plans", terms: "#commercial", contact: localePath(locale, "/contact") }}
        />
      </div>
    </section>
  );
}

/** the compact entry of the first screen — null while the package is not delivered */
export const m20TourHeroLink = (project: string, locale: SiteLocale) => {
  const live = project === "moscova-20" ? m20TourLive() : null;
  return live ? { href: "#tour", label: live.copy.heroLink[locale] } : null;
};

/** tab 01 of «Адрес — часть бизнес-модели»: the mark on the clean aerial becomes the way into the tour; the nine real scenes as text */
export const m20TourTab = (project: string, locale: SiteLocale) => {
  const live = project === "moscova-20" ? m20TourLive() : null;
  return live
    ? { href: "#tour", label: live.copy.tabLink[locale], text: live.copy.tabText[locale], points: live.scenes.map((scene, i) => ({ no: String(i + 1), title: scene.title[locale] })) }
    : null;
};
