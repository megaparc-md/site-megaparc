import type { ReactNode } from "react";
import { LgHead, LgPhoto, LgSection, splitArea, ui } from "@/components/leasing-experience/parts";
import { PlanViewer } from "@/components/leasing-experience/plan-viewer";
import { SheetPan } from "@/components/leasing-experience/sheet-pan";
import { Icon } from "@/components/ui";
import { formatArea, formatAreaExact } from "@/content/source";
import type { LeasingExperience, PlanLevel } from "@/data/leasing-experience-model";
import type { TemplateOffer } from "@/components/leasing-experience/offer";
import { registeredData } from "@/data/registered";
import type { Localized, SiteLocale } from "@/lib/site-data";

/**
 * SCENE — PLANS AND AREAS · the OWNER's architectural drawings (OWNER "PLAN
 * REPLACEMENT PASS", 2026-11-09). The redrawn plan schemes and the section
 * diagram are gone: each level shows the authoritative drawing — a crop of the
 * OWNER PDF (Plan_0.000 · Anexa 2 and Plan_-2.950 / -3.300 · Anexa 1, project
 * 15/19 SA, scale 1:100), rotated to its reading orientation, geometry, walls,
 * columns, stairs, doors, sanitary rooms and dimensions untouched — inside an
 * architectural-dossier frame: «План помещения · Приложение к договору аренды ·
 * М 1:100», the level mark, «Открыть полный план» (the original PDF). The level
 * switches are KPI cards (total · commercial, read from the unit record); the
 * commercial total and the terrace stay as fixed KPIs. Phones pan the drawing
 * sideways so its text stays legible.
 */

// level marks are stored with a decimal comma (as in RU / RO); English reads a decimal point
const markOf = (mark: string, locale: SiteLocale) => (locale === "en" ? mark.replace(/,/g, ".") : mark);
/**
 * The drawing's real rendered width, for `sizes` (leasing-experience.css §08 plans + --xp-shell in experience.css):
 * phones — shell 100% − 2.5rem, frame border 2 px, the sheet drawn at 230 % (ground) / 200 % (lower);
 * tablets — shell 100% − 4rem, 150 % / 135 %; desktop — the 8.6 / 12 stage column of min(100% − 6rem, 1360 px)
 * less the 3vw column gap and the 2 px border (941 px once the shell reaches 1360 px).
 */
const sheetScale = { ground: { phone: 2.3, tablet: 1.5 }, lower: { phone: 2, tablet: 1.35 } } as const;
const sizesOf = (key: PlanLevel["key"]) =>
  [
    "(min-width: 1456px) 941px",
    "(min-width: 1024px) calc((97vw - 96px) * 0.7167 - 2px)",
    `(min-width: 720px) calc((100vw - 66px) * ${sheetScale[key].tablet})`,
    `calc((100vw - 42px) * ${sheetScale[key].phone})`,
  ].join(", ");
const fmtHeight = (m: number, locale: SiteLocale) => `${m.toLocaleString(locale === "ru" ? "ru-RU" : locale === "ro" ? "ro-RO" : "en-GB", { minimumFractionDigits: 1, maximumFractionDigits: 1 })} ${locale === "ru" ? "м" : "m"}`;

const copy = {
  views: { ro: "Niveluri", ru: "Уровни", en: "Levels" },
  total: { ro: "totală", ru: "общая", en: "total" },
  commercial: { ro: "comercială", ru: "коммерческая", en: "commercial" },
  commercialTotal: { ro: "Suprafață comercială", ru: "Коммерческая площадь", en: "Commercial area" },
  planTitle: { ro: "Planul spațiului", ru: "План помещения", en: "Premises plan" },
  planNote: { ro: "Anexă la contractul de locațiune · Sc. 1:100", ru: "Приложение к договору аренды · М 1:100", en: "Lease agreement annex · Scale 1:100" },
  openFull: { ro: "Deschide planul complet", ru: "Открыть полный план", en: "Open full plan" },
  swipe: { ro: "Glisați pe plan pentru detalii", ru: "Проведите по плану, чтобы рассмотреть детали", en: "Swipe the plan to see the details" },
  legend: { ro: "Încăperi", ru: "Помещения", en: "Rooms" },
  entrances: { ro: "Intrări", ru: "Входы", en: "Entrances" },
  stairs: { ro: "Scări între niveluri", ru: "Лестницы между уровнями", en: "Stairs between the levels" },
  showSchedule: { ro: "Arată explicația încăperilor", ru: "Показать экспликацию", en: "Show the room schedule" },
  hideSchedule: { ro: "Ascunde explicația încăperilor", ru: "Скрыть экспликацию", en: "Hide the room schedule" },
  // no approved drawing (OWNER «LEASING TEMPLATE LOCK» §2): the same frame, «Планы предоставляются по запросу», the confirmed floor logic and registered premises
  onRequestShort: { ro: "La cerere", ru: "По запросу", en: "On request" },
  registered: { ro: "înregistrată", ru: "зарегистрированная", en: "registered" },
  registeredNote: { ro: "Suprafața spațiilor înregistrate (date cadastrale / fiscale) — nu este suprafața disponibilă pentru închiriere.", ru: "Площадь зарегистрированных помещений (кадастр / налоговый учёт) — это не свободная площадь для аренды.", en: "The area of the registered premises (cadastral / tax records) — not the area available for lease." },
  floors: { ro: "Niveluri și spațiu", ru: "Уровни и помещение", en: "Levels and space" },
} satisfies Record<string, Localized>;

/** The drawing of one level in its dossier frame. */
function Drawing({ x, level, locale }: { x: LeasingExperience; level: PlanLevel; locale: SiteLocale }) {
  const d = level.drawing;
  const photo = d ? x.photos[d.photo] : undefined;
  if (!d || !photo) return null;
  return (
    <figure className="lg-drawing">
      <figcaption className="lg-drawing__head">
        <span className="lg-drawing__title">{copy.planTitle[locale]}</span>
        <span className="lg-drawing__note">{copy.planNote[locale]}</span>
        <span className="lg-drawing__mark">{level.label[locale]} · {markOf(level.mark, locale)}</span>
      </figcaption>
      {/* phones pan the sheet; it opens on the premises (ground: the hall under the service wing; lower: the hall) */}
      <SheetPan start={level.key === "ground" ? 0.55 : 0.5} label={photo.alt[locale]}>
        <LgPhoto photo={photo} locale={locale} ratio={`${photo.width} / ${photo.height}`} sizes={sizesOf(level.key)} className="lg-drawing__img" />
      </SheetPan>
      <p className="lg-drawing__foot">
        <span className="lg-drawing__hint">{copy.swipe[locale]}</span>
        <a className="pm-link" href={d.pdf} target="_blank" rel="noopener noreferrer"><span>{copy.openFull[locale]}</span><Icon name="up-right" /></a>
      </p>
    </figure>
  );
}

export function PlansScene({ x, offer, locale }: { x: LeasingExperience; offer: TemplateOffer; locale: SiteLocale }) {
  const p = x.plans;
  const breakdown = offer.breakdown;
  const byKey = (key: string) => breakdown.find((level) => level.key === key);
  const terrace = byKey("terrace");
  const levels = p.levels.filter((level) => level.drawing);

  // the level switches: total and commercial area of the level, from the unit record
  const tabs = levels.map((level, i) => {
    const data = byKey(level.key);
    const total = data ? splitArea(formatAreaExact(data.area, locale)) : null;
    return {
      key: level.key,
      label: `${level.label[locale]} · ${markOf(level.mark, locale)}`,
      body: (
        <>
          <span className="lg-kpi__head"><b>{String(i + 1).padStart(2, "0")}</b>{level.label[locale]} · {markOf(level.mark, locale)}</span>
          {total ? (
            <span className="lg-kpi__figure"><strong>{total.figure}</strong><span className="lg-kpi__unit">{total.unit}</span><em>{copy.total[locale]}</em></span>
          ) : null}
          {data?.useful ? <span className="lg-kpi__sub">{formatAreaExact(data.useful, locale)} {copy.commercial[locale]}</span> : null}
        </>
      ),
    };
  });

  // the KPIs that do not switch: commercial total and terrace
  const fixed = [
    ...(offer.usefulArea ? [{ key: "commercial", label: copy.commercialTotal[locale], value: splitArea(formatArea(offer.usefulArea, locale)) }] : []),
    ...(terrace ? [{ key: "terrace", label: terrace.label[locale], value: splitArea(formatAreaExact(terrace.area, locale)) }] : []),
  ];
  const extra = (
    <>
      <dl className="lg-planview__fixed">
        {fixed.map((item) => (
          <div key={item.key} className="lg-card lg-fixedkpi">
            <dt>{item.label}</dt>
            <dd><strong>{item.value.figure}</strong><span>{item.value.unit}</span></dd>
          </div>
        ))}
      </dl>
      <p className="lg-plans__line">{x.area.propertyLine[locale]}</p>
      {x.area.groundOnly ? <p className="lg-plans__line">{x.area.groundOnly.text[locale]} — <span className="lg-plans__status">{ui.toConfirm[locale].toLowerCase()}</span></p> : null}
    </>
  );

  const side = (level: PlanLevel): ReactNode => {
    const data = byKey(level.key);
    return (
      <>
        {data?.height ? (
          <dl className="lg-figs">
            <div>
              <dt>{ui.heights[locale]}</dt>
              <dd>{`${data.heightEvidence === "APPROXIMATE" ? `${ui.approx[locale]} ` : ""}${fmtHeight(data.height, locale)}`}</dd>
            </div>
          </dl>
        ) : null}
        <details className="lg-plans__schedule">
          <summary className="pm-link"><span className="is-show">{copy.showSchedule[locale]}</span><span className="is-hide">{copy.hideSchedule[locale]}</span><Icon name="down" /></summary>
          <p className="lg-label">{copy.legend[locale]}</p>
          <ul className="lg-legend">
            {level.zones.filter((zone) => zone.no).map((zone) => (
              <li key={zone.key}>
                <span className="lg-legend__no">{zone.no}</span>
                <span className="lg-legend__name">{zone.label[locale]}</span>
                {zone.area ? <span className="lg-legend__area">{formatAreaExact(zone.area, locale)}</span> : null}
              </li>
            ))}
          </ul>
          {level.marks.filter((mark) => mark.kind !== "street").length ? (
            <ul className="lg-legend lg-legend--marks" aria-label={copy.entrances[locale]}>
              {level.marks.filter((mark) => mark.kind !== "street").map((mark) => (
                <li key={mark.key}><span className={`lg-legend__arrow is-${mark.kind}`} aria-hidden="true" /><span className="lg-legend__name">{mark.label[locale]}</span></li>
              ))}
            </ul>
          ) : null}
        </details>
      </>
    );
  };

  const req = !levels.length ? p.onRequest ?? null : null;
  const reg = registeredData[x.project] ?? null;
  const regFigure = reg ? splitArea(formatArea(reg.area, locale)) : null;
  const requestTab = req
    ? {
        key: "request",
        label: req.tab[locale],
        body: (
          <>
            <span className="lg-kpi__head"><b>01</b>{req.tab[locale]}</span>
            {regFigure ? <span className="lg-kpi__figure"><strong>{regFigure.figure}</strong><span className="lg-kpi__unit">{regFigure.unit}</span><em>{copy.registered[locale]}</em></span> : null}
          </>
        ),
      }
    : null;
  const requestView = req ? (
    <figure className="lg-drawing lg-drawing--request">
      <figcaption className="lg-drawing__head">
        <span className="lg-drawing__title">{req.title[locale]}</span>
        <span className="lg-drawing__note">{copy.onRequestShort[locale]}</span>
      </figcaption>
      <div className="lg-request">
        <p className="lg-request__status">{req.text[locale]}</p>
        <a className="btn" href="#lg-form" data-intent="plans"><span>{ui.plansGet[locale]}</span><Icon /></a>
      </div>
    </figure>
  ) : null;
  const requestSide = req ? (
    <div>
      <p className="lg-label">{copy.floors[locale]}</p>
      <ul className="lg-plans__floors">
        {req.floors.map((floor) => <li key={floor.en}>{floor[locale]}</li>)}
      </ul>
      {reg ? <p className="lg-plans__regnote">{copy.registeredNote[locale]}</p> : null}
    </div>
  ) : null;
  const requestExtra = req ? (
    <>
      <p className="lg-plans__line">{x.area.propertyLine[locale]}</p>
    </>
  ) : null;

  return (
    <LgSection id="plans" tone="white" labelledBy="lg-plans-title" className={`lg-plans${req ? " lg-plans--request" : ""}`}>
      <LgHead heading={p} locale={locale} id="lg-plans-title" area={offer.figure} layout="split" />
      <PlanViewer
        tabs={requestTab ? [requestTab] : tabs}
        views={requestView ? [requestView] : levels.map((level) => <Drawing key={level.key} x={x} level={level} locale={locale} />)}
        sides={requestSide ? [requestSide] : levels.map((level) => <div key={level.key}>{side(level)}</div>)}
        label={copy.views[locale]}
        extra={requestExtra ?? extra}
      />
      <div className="lg-plans__foot" data-reveal>
        <p className="lg-plans__note">{p.note[locale]}</p>
        <p className="lg-plans__actions">
          <a className="pm-link" href="#tech" data-drawer="tech" aria-haspopup="dialog"><span>{ui.chTech[locale]}</span><Icon /></a>
          <a className="btn" href="#viewing" data-intent="plans"><span>{req ? ui.plansGet[locale] : ui.plansFull[locale]}</span><Icon /></a>
        </p>
      </div>
    </LgSection>
  );
}
