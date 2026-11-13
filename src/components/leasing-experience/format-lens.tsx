import { FormatPicker } from "@/components/leasing-experience/format-picker";
import { LgHead, ui } from "@/components/leasing-experience/parts";
import { PhotoScene, pathOf } from "@/components/leasing-experience/photo-scene";
import { Icon } from "@/components/ui";
import type { TemplateOffer } from "@/components/leasing-experience/offer";
import { company, contactLinks } from "@/data/demo-content";
import { consultHref, producerBlock } from "@/data/producer-retail";
import Link from "next/link";
import { publishable, type LeasingExperience, type LensFormat, type LensRef } from "@/data/leasing-experience-model";
import { isProductionEdition, localePath, type SiteLocale } from "@/lib/site-data";
import { formatAreaExact } from "@/content/source";

/**
 * SCENE — «КАКОЙ БИЗНЕС ВЫ РАССМАТРИВАЕТЕ?» (content: OWNER "FINAL VIEWING
 * CONVERSION PASS" + "LOCATION INTELLIGENCE …", 2026-11-06; art direction:
 * "FINAL ART DIRECTION & VISUAL CONVERSION PASS", 2026-11-09, §13–14). An
 * editorial selector, not tabs in a white box: the four formats as large
 * numbered words beside a large real interior; the chosen format changes the
 * photograph, the delicate zoning on it (generic zones, always captioned
 * «Возможный сценарий организации» — never furniture, never a render), the main
 * question and the proof. Only one format is shown at a time.
 * Card & air pass (2026-11-09, §10): the arguments «что говорит в пользу» as
 * short evidence cards (one thesis each, with «смотреть»), the checks «что
 * проверим вместе» apart and quieter beside the question.
 */

const target: Record<LensRef, { href: string; drawer?: string }> = {
  location: { href: "#location" },
  tech: { href: "#tech", drawer: "tech" },
  readiness: { href: "#readiness", drawer: "readiness" },
  plans: { href: "#plans" },
  photos: { href: "#photos" },
  capex: { href: "#capex" },
};

/** the approximate height of a level, one decimal in the visitor's locale (≈ 3,0 · 3.0) — read from the unit record */
const height = (value: number | undefined, locale: SiteLocale) => (value ? value.toLocaleString(locale === "en" ? "en-GB" : locale === "ru" ? "ru-RU" : "ro-RO", { minimumFractionDigits: 1, maximumFractionDigits: 1 }) : "—");

function Pane({ x, format, locale, offer, name }: { x: LeasingExperience; format: LensFormat; locale: SiteLocale; offer: TemplateOffer; name: string }) {
  const l = x.lens;
  const o = format.overlay;
  const photo = o ? x.photos[o.photo] : undefined;
  // OWNER R10 §03: the levels of the scenario exist only where the unit record carries them (areas and heights never typed twice)
  const levels = format.levels ? (["ground", "lower"] as const).flatMap((key) => {
    const item = format.levels!.items[key];
    const level = offer.breakdown.find((entry) => entry.key === key);
    return item && level ? [{ key, item, level }] : [];
  }) : [];
  const levelNote = format.levels ? format.levels.note[locale].replace("{ground}", height(offer.breakdown.find((e) => e.key === "ground")?.height, locale)).replace("{lower}", height(offer.breakdown.find((e) => e.key === "lower")?.height, locale)) : "";
  return (
    <div className={`lg-lens__grid${format.advantages ? " has-advantages" : ""}${levels.length ? " has-levels" : ""}`}>
      {format.advantages ? (
        <div className="r10-adv">
          <p className="lg-label">{(format.advantagesTitle ?? l.evidenceTitle)[locale]}</p>
          <ol className="r10-adv__list">
            {format.advantages.map((item, i) => (
              <li key={item.title.en} className="r10-adv__card">
                <span className="r10-adv__no">{String(i + 1).padStart(2, "0")}</span>
                <strong className="r10-adv__title">{item.title[locale]}</strong>
                <span className="r10-adv__text">{item.text[locale]}</span>
              </li>
            ))}
          </ol>
        </div>
      ) : null}
      {/* no interior photograph yet: the same frame says where the organisation is shown — never a borrowed or repeated photo */}
      {!o || !photo ? (
        <figure className="lg-lens__visual">
          <div className="lg-lens__nophoto">
            <span className="lg-lens__nophoto-label">{l.scenarioNote[locale]}</span>
            <p className="lg-lens__nophoto-text">{l.noPhoto?.[locale] ?? ""}</p>
          </div>
        </figure>
      ) : (
      <figure className="lg-lens__visual">
        <PhotoScene
          photo={photo}
          locale={locale}
          sizes="(min-width: 1024px) 66vw, 100vw"
          className="lg-lens__scene"
          drawing={o.zones.map((zone, i) => <path key={zone.label.en} d={pathOf(zone.shape)} className={`lg-zone is-${i}`} />)}
          labels={o.zones.map((zone, i) => ({ key: zone.label.en, no: String(i + 1), text: zone.label[locale], at: zone.at }))}
        />
        <figcaption className="lg-lens__caption">
          <span className="lg-lens__note">{l.scenarioNote[locale]}</span>
          <ol className="lg-scene__legend">
            {o.zones.map((zone, i) => (
              <li key={zone.label.en}><b>{i + 1}</b>{zone.label[locale]}</li>
            ))}
          </ol>
        </figcaption>
      </figure>
      )}
      <div className="lg-lens__ask">
        <p className="lg-lens__question">{format.question[locale]}</p>
        <a className="btn" href="#viewing" data-intent="viewing" data-format={format.label[locale]}><span>{x.cta || !offer.open ? offer.primary : ui.viewingPersonal[locale]}</span><Icon /></a>
        {/* OWNER R10 §05: the economics conversation — the real e-mail channel with the context in the subject; no form, nothing «sent» */}
        {format.consult ? (
          <div className="r10-consult">
            <a className="btn btn--ghost r10-consult__btn" href={consultHref(locale, name)} data-intent="producer-store"><span>{format.consult.label[locale]}</span><Icon name="up-right" /></a>
            <p className="r10-consult__note">{format.consult.note[locale]} <a href={contactLinks.mobile}>{company.mobile.value[locale]}</a> · <a href={contactLinks.landline}>{company.landline.value[locale]}</a></p>
            {/* the CFO-model prototype is OWNER preview only until its methodology is verified (R10 §04) */}
            {isProductionEdition ? null : <Link className="r10-consult__proto" href={`${localePath(locale, "/producer-economics")}/`}>{producerBlock.prototype[locale]}</Link>}
          </div>
        ) : null}
        <div className="lg-lens__checkwrap">
          <p className="lg-label">{(format.checksTitle ?? l.checksTitle)[locale]}</p>
          <ul className="lg-circles lg-lens__checks">
            {format.checks.map((check) => (
              <li key={check.en}>{check[locale]}</li>
            ))}
          </ul>
        </div>
      </div>
      <div className="lg-lens__proof">
        <p className="lg-label">{(format.evidenceTitle ?? l.evidenceTitle)[locale]}</p>
        <ul className="lg-lens__cards">
          {format.evidence.filter((item) => publishable(item.evidence)).map((item, i) => (
            <li key={item.text.en} className="lg-card lg-lens__card">
              <span className="lg-card__no">{String(i + 1).padStart(2, "0")}</span>
              <span className="lg-lens__cardtext">
                {item.title ? <strong className="lg-lens__cardtitle">{item.title[locale]}</strong> : null}
                {item.text[locale]}
              </span>
              <a href={target[item.ref].href} data-drawer={target[item.ref].drawer} className="lg-lens__see" aria-label={`${ui.see[locale]}: ${item.text[locale]}`}>{ui.see[locale]}</a>
            </li>
          ))}
        </ul>
        {format.closing && format.closingTitle ? (
          <div className="lg-lens__closing r10-closing">
            <p className="r10-closing__title">{format.closingTitle[locale]}</p>
            <p className="r10-closing__main">{format.closing[locale]}</p>
            {format.closingNote ? <p className="r10-closing__note">{format.closingNote[locale]}</p> : null}
          </div>
        ) : format.closing ? <p className="lg-lens__closing">{format.closing[locale]}</p> : null}
      </div>
      {levels.length ? (
        <div className="r10-levels">
          <div className="r10-levels__head">
            <p className="lg-label">{format.levels!.title[locale]}</p>
            <p className="r10-levels__caption">{format.levels!.caption[locale]}</p>
          </div>
          <ol className="r10-levels__list">
            {levels.map(({ key, item, level }) => (
              <li key={key} className={`r10-level is-${key}`}>
                <span className="r10-level__name">{level.label[locale]}</span>
                <span className="r10-level__area">{formatAreaExact(level.area, locale)}</span>
                <strong className="r10-level__title">{item.title[locale]}</strong>
                <span className="r10-level__text">{item.text[locale]}</span>
              </li>
            ))}
          </ol>
          <p className="r10-levels__note">{levelNote}</p>
        </div>
      ) : null}
    </div>
  );
}

/** the instruction above the format controls (OWNER selector redesign 2026-11-11) — what the buttons do, nothing about the business */
const pickHint: Record<SiteLocale, string> = {
  ro: "Alegeți formatul — scenariul de mai jos se actualizează.",
  ru: "Выберите формат — сценарий ниже обновится.",
  en: "Choose a format — the scenario below updates.",
};

export function FormatLens({ x, offer, locale, name }: { x: LeasingExperience; offer: TemplateOffer; locale: SiteLocale; name: string }) {
  const l = x.lens;
  return (
    <section id="format" className="lg-sec lg-sec--white lg-lens" aria-labelledby="lg-format-title">
      <div className="xp-shell">
        <LgHead heading={l} locale={locale} id="lg-format-title" layout="split" />
        <FormatPicker
          label={l.title[locale]}
          hint={pickHint[locale]}
          formats={l.formats.map((format, i) => ({ key: format.key, no: String(i + 1).padStart(2, "0"), label: format.label[locale] }))}
          panes={l.formats.map((format) => <Pane key={format.key} x={x} format={format} locale={locale} offer={offer} name={name} />)}
        />
        {/* the closing statement lives in each format; a dataset without per-format closings keeps the section line */}
        <div className="lg-lens__foot" data-reveal>
          {l.formats.every((format) => format.closing) ? null : <p className="lg-lens__honesty">{l.honesty[locale]}</p>}
          <p className="lg-lens__regulated">{l.regulated[locale]}</p>
        </div>
      </div>
    </section>
  );
}
