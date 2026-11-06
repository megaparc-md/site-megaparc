import { FormatPicker } from "@/components/leasing-experience/format-picker";
import { LgHead, LgSection, ui } from "@/components/leasing-experience/parts";
import { Icon } from "@/components/ui";
import { viewingEnabled } from "@/content/source";
import { publishable, type LeasingExperience, type LensFormat, type LensRef, type PlanLevel, type Pt } from "@/data/leasing-experience-model";
import type { AvailableSpace } from "@/data/leasing-inventory";
import type { Localized, SiteLocale } from "@/lib/site-data";

/**
 * SCENE 03 — «КАКОЙ БИЗНЕС ВЫ РАССМАТРИВАЕТЕ?» (OWNER "TENANT PSYCHOLOGY /
 * CONVERSION INTELLIGENCE PASS", 2026-11-06, §4, §13, §15). One editorial
 * selector, four formats. The facts do not change — their order and reading do:
 * the format's main question, the evidence that answers it (each line points to
 * where it is shown), what is checked together, and a possible organisation of
 * the space drawn as generic zones on the real plan, always captioned
 * «Возможный сценарий организации». No brands, no completed interior.
 */

const href: Record<LensRef, string> = { tech: "#tech", location: "#location", areas: "#areas", engineering: "#engineering", access: "#access", readiness: "#readiness", plans: "#plans", photos: "#photos", capex: "#capex" };
const seeCopy: Localized = { ro: "vezi", ru: "смотреть", en: "see" };
const path = (shape: Pt[]) => `M${shape.map(([x, y]) => `${x} ${y}`).join(" L")} Z`;
const centre = (shape: Pt[]): Pt => {
  const xs = shape.map((p) => p[0]);
  const ys = shape.map((p) => p[1]);
  return [(Math.min(...xs) + Math.max(...xs)) / 2, (Math.min(...ys) + Math.max(...ys)) / 2];
};
/** Both levels on one scale: the lower ground spans the full width; the ground floor is narrower. */
const BOX: Record<PlanLevel["key"], [number, number, number, number]> = { ground: [12100, -900, 19800, 12400], lower: [-600, -900, 32400, 12400] };

function ScenarioPlan({ level, zones, locale, offset }: { level: PlanLevel; zones: { label: Localized; shape: Pt[]; no: number }[]; locale: SiteLocale; offset: number }) {
  const [x, y, w, h] = BOX[level.key];
  return (
    <figure className={`lg-lens__plan is-${level.key}`} style={{ width: `${(w / BOX.lower[2]) * 100}%` }}>
      <svg viewBox={`${x} ${y} ${w} ${h}`} role="img" aria-label={`${level.label[locale]} — ${zones.map((zone) => zone.label[locale]).join(", ")}`}>
        {level.zones.filter((zone) => zone.kind === "sales").map((zone) => <path key={zone.key} d={path(zone.shape)} className="lg-lens__hall" />)}
        {zones.map((zone, i) => <path key={zone.no} d={path(zone.shape)} className={`lg-lens__zone is-${(i + offset) % 4}`} />)}
        {level.zones.filter((zone) => zone.kind === "stair").map((zone) => <path key={zone.key} d={path(zone.shape)} className="lg-lens__stair" />)}
        {zones.map((zone) => {
          const [cx, cy] = centre(zone.shape);
          return (
            <g key={zone.no} className="lg-lens__no">
              <circle cx={cx} cy={cy} r="820" />
              <text x={cx} y={cy} dy="0.36em" textAnchor="middle">{zone.no}</text>
            </g>
          );
        })}
      </svg>
      <figcaption>{level.label[locale]}</figcaption>
    </figure>
  );
}

function Pane({ x, format, locale, open }: { x: LeasingExperience; format: LensFormat; locale: SiteLocale; open: boolean }) {
  const l = x.lens;
  let no = 0;
  const byLevel = (key: PlanLevel["key"]) => format.scenario.filter((zone) => zone.level === key).map((zone) => ({ ...zone, no: ++no }));
  const ground = byLevel("ground");
  const lower = byLevel("lower");
  const levels = x.plans.levels;
  const all = [...ground, ...lower];
  return (
    <div className="lg-lens__grid">
      <div className="lg-lens__visual">
        <p className="lg-label lg-lens__note">{l.scenarioNote[locale]}</p>
        <div className="lg-lens__plans">
          {ground.length ? <ScenarioPlan level={levels.find((level) => level.key === "ground")!} zones={ground} locale={locale} offset={0} /> : null}
          {lower.length ? <ScenarioPlan level={levels.find((level) => level.key === "lower")!} zones={lower} locale={locale} offset={ground.length} /> : null}
        </div>
        <ol className="lg-lens__legend">
          {all.map((zone, i) => (
            <li key={zone.no}><span className={`lg-lens__swatch is-${i % 4}`} aria-hidden="true">{zone.no}</span>{zone.label[locale]}</li>
          ))}
        </ol>
      </div>
      <div className="lg-lens__copy">
        <p className="lg-lens__question">{format.question[locale]}</p>
        <p className="lg-label">{l.evidenceTitle[locale]}</p>
        <ul className="lg-lens__evidence">
          {format.evidence.filter((item) => publishable(item.evidence)).map((item) => (
            <li key={item.text.en}>
              <span>{item.text[locale]}</span>
              <a href={href[item.ref]} className="lg-lens__see" aria-label={`${seeCopy[locale]}: ${item.text[locale]}`}>{seeCopy[locale]}</a>
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
    <LgSection id="format" tone="warm" labelledBy="lg-format-title" className="lg-lens">
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
