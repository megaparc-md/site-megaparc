import { FormatPicker } from "@/components/leasing-experience/format-picker";
import { LgHead, ui } from "@/components/leasing-experience/parts";
import { PhotoScene, pathOf } from "@/components/leasing-experience/photo-scene";
import { Icon } from "@/components/ui";
import { viewingEnabled } from "@/content/source";
import { publishable, type LeasingExperience, type LensFormat, type LensRef } from "@/data/leasing-experience-model";
import type { AvailableSpace } from "@/data/leasing-inventory";
import type { SiteLocale } from "@/lib/site-data";

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

function Pane({ x, format, locale, open }: { x: LeasingExperience; format: LensFormat; locale: SiteLocale; open: boolean }) {
  const l = x.lens;
  const o = format.overlay;
  const photo = x.photos[o.photo];
  return (
    <div className="lg-lens__grid">
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
      <div className="lg-lens__ask">
        <p className="lg-lens__question">{format.question[locale]}</p>
        <a className="btn" href="#viewing" data-intent="viewing" data-format={format.label[locale]}><span>{open ? ui.viewingPersonal[locale] : ui.waitlist[locale]}</span><Icon /></a>
        <div className="lg-lens__checkwrap">
          <p className="lg-label">{l.checksTitle[locale]}</p>
          <ul className="lg-circles lg-lens__checks">
            {format.checks.map((check) => (
              <li key={check.en}>{check[locale]}</li>
            ))}
          </ul>
        </div>
      </div>
      <div className="lg-lens__proof">
        <p className="lg-label">{l.evidenceTitle[locale]}</p>
        <ul className="lg-lens__cards">
          {format.evidence.filter((item) => publishable(item.evidence)).map((item, i) => (
            <li key={item.text.en} className="lg-card lg-lens__card">
              <span className="lg-card__no">{String(i + 1).padStart(2, "0")}</span>
              <span className="lg-lens__cardtext">{item.text[locale]}</span>
              <a href={target[item.ref].href} data-drawer={target[item.ref].drawer} className="lg-lens__see" aria-label={`${ui.see[locale]}: ${item.text[locale]}`}>{ui.see[locale]}</a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function FormatLens({ x, unit, locale }: { x: LeasingExperience; unit: AvailableSpace; locale: SiteLocale }) {
  const l = x.lens;
  const open = viewingEnabled(unit);
  return (
    <section id="format" className="lg-sec lg-sec--white lg-lens" aria-labelledby="lg-format-title">
      <div className="xp-shell">
        <LgHead heading={l} locale={locale} id="lg-format-title" layout="split" />
        <FormatPicker
          label={l.title[locale]}
          formats={l.formats.map((format, i) => ({ key: format.key, no: String(i + 1).padStart(2, "0"), label: format.label[locale] }))}
          panes={l.formats.map((format) => <Pane key={format.key} x={x} format={format} locale={locale} open={open} />)}
        />
        <div className="lg-lens__foot" data-reveal>
          <p className="lg-lens__honesty">{l.honesty[locale]}</p>
          <p className="lg-lens__regulated">{l.regulated[locale]}</p>
        </div>
      </div>
    </section>
  );
}
