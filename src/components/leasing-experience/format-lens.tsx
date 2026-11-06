import { FormatPicker } from "@/components/leasing-experience/format-picker";
import { LgHead, LgSection, ui } from "@/components/leasing-experience/parts";
import { PhotoScene, pathOf } from "@/components/leasing-experience/photo-scene";
import { Icon } from "@/components/ui";
import { viewingEnabled } from "@/content/source";
import { publishable, type LeasingExperience, type LensFormat, type LensRef } from "@/data/leasing-experience-model";
import type { AvailableSpace } from "@/data/leasing-inventory";
import type { SiteLocale } from "@/lib/site-data";

/**
 * SCENE 03 — «КАКОЙ БИЗНЕС ВЫ РАССМАТРИВАЕТЕ?» · PROOF (OWNER "FINAL VIEWING
 * CONVERSION PASS" + "LOCATION INTELLIGENCE …", 2026-11-06). Four formats, only
 * the chosen one shown: its question about the location and the space (Retail
 * «Увидят ли меня?», Showroom «Смогут ли клиенты удобно приехать?», Client
 * service «Удобно ли клиенту добираться?», Office «Удобен ли адрес и клиентам,
 * и команде?»), three or four arguments that point to where they are shown, two
 * or three checks, and a possible organisation drawn delicately on a real
 * photograph — generic zones, always captioned «Возможный сценарий организации».
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
          sizes="(min-width: 1024px) 55vw, 100vw"
          className="lg-lens__scene"
          drawing={o.zones.map((zone, i) => <path key={zone.label.en} d={pathOf(zone.shape)} className={`lg-zone is-${i}`} />)}
          labels={o.zones.map((zone, i) => ({ key: zone.label.en, no: String(i + 1), text: zone.label[locale], at: zone.at }))}
        />
        <figcaption className="lg-lens__caption">
          <span className="lg-label lg-lens__note">{l.scenarioNote[locale]}</span>
          <ol className="lg-scene__legend">
            {o.zones.map((zone, i) => (
              <li key={zone.label.en}><b>{i + 1}</b>{zone.label[locale]}</li>
            ))}
          </ol>
        </figcaption>
      </figure>
      <div className="lg-lens__copy">
        <p className="lg-lens__question">{format.question[locale]}</p>
        <p className="lg-label">{l.evidenceTitle[locale]}</p>
        <ul className="lg-lens__evidence">
          {format.evidence.filter((item) => publishable(item.evidence)).map((item) => (
            <li key={item.text.en}>
              <span>{item.text[locale]}</span>
              <a href={target[item.ref].href} data-drawer={target[item.ref].drawer} className="lg-lens__see" aria-label={`${ui.see[locale]}: ${item.text[locale]}`}>{ui.see[locale]}</a>
            </li>
          ))}
        </ul>
        <p className="lg-label">{l.checksTitle[locale]}</p>
        <ul className="lg-circles lg-lens__checks">
          {format.checks.map((check) => (
            <li key={check.en}>{check[locale]}</li>
          ))}
        </ul>
        <div className="lg-lens__actions">
          <a className="btn" href="#viewing" data-intent="viewing" data-format={format.label[locale]}><span>{open ? ui.viewingPersonal[locale] : ui.waitlist[locale]}</span><Icon /></a>
        </div>
      </div>
    </div>
  );
}

export function FormatLens({ x, unit, locale }: { x: LeasingExperience; unit: AvailableSpace; locale: SiteLocale }) {
  const l = x.lens;
  const open = viewingEnabled(unit);
  return (
    <LgSection id="format" tone="white" labelledBy="lg-format-title" className="lg-lens">
      <LgHead heading={l} locale={locale} id="lg-format-title" layout="split" />
      <FormatPicker
        label={l.title[locale]}
        formats={l.formats.map((format) => ({ key: format.key, label: format.label[locale] }))}
        panes={l.formats.map((format) => <Pane key={format.key} x={x} format={format} locale={locale} open={open} />)}
      />
      <div className="lg-lens__foot" data-reveal>
        <p className="lg-lens__honesty">{l.honesty[locale]}</p>
        <p className="lg-lens__regulated">{l.regulated[locale]}</p>
      </div>
    </LgSection>
  );
}
