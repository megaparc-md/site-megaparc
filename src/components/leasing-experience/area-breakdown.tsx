import type { CSSProperties } from "react";
import { LgHead, LgSection, ui } from "@/components/leasing-experience/parts";
import { formatArea, formatAreaExact } from "@/content/source";
import type { LeasingExperience } from "@/data/leasing-experience-model";
import type { AreaLevel, AvailableSpace } from "@/data/leasing-inventory";
import type { Localized, SiteLocale } from "@/lib/site-data";

/**
 * AREA BREAKDOWN (section 05) and AREA SCHEME (section 10) — OWNER mandate
 * §15–17 / brief §10–11. Every number comes from the unit record
 * (src/data/leasing-inventory.ts → usefulArea, breakdown), the single source.
 *   Breakdown: two headline figures of different weight, then the levels on
 *   one proportional band — never a table of equal numbers.
 *   Scheme: a schematic section through the levels (never called a plan),
 *   with the documented level marks and the caption the OWNER requires.
 */

const fmtHeight = (m: number, locale: SiteLocale) => `${m.toLocaleString(locale === "ru" ? "ru-RU" : locale === "ro" ? "ro-RO" : "en-GB")}${" "}${locale === "ru" ? "м" : "m"}`;

function levelLine(level: AreaLevel, locale: SiteLocale) {
  const parts: string[] = [];
  if (level.useful) parts.push(`${ui.useful[locale]} ${formatAreaExact(level.useful, locale)}`);
  if (level.height) parts.push(`${ui.height[locale]} ${level.heightEvidence === "APPROXIMATE" ? `${ui.approx[locale]} ` : ""}${fmtHeight(level.height, locale)}`);
  return parts;
}

export function AreaBreakdown({ x, unit, locale }: { x: LeasingExperience; unit: AvailableSpace; locale: SiteLocale }) {
  const a = x.area;
  const levels = unit.breakdown ?? [];
  const total = levels.reduce((sum, level) => sum + level.area, 0) || unit.area;
  return (
    <LgSection id="area" tone="paper" labelledBy="lg-area-title" className="lg-area">
      <LgHead heading={a} locale={locale} id="lg-area-title" />
      <div className="lg-area__figures" data-reveal>
        <p className="lg-area__main">
          <strong>{formatArea(unit.area, locale)}</strong>
          <span>{ui.offered[locale]}</span>
        </p>
        {unit.usefulArea ? (
          <p className="lg-area__useful">
            <strong>{formatArea(unit.usefulArea, locale)}</strong>
            <span>{ui.usefulTotal[locale]}</span>
          </p>
        ) : null}
      </div>
      {levels.length ? (
        <div className="lg-band" data-reveal>
          <div className="lg-band__bar" aria-hidden="true">
            {levels.map((level) => (
              <span key={level.key} className={`lg-band__seg is-${level.key}`} style={{ "--w": `${(level.area / total) * 100}%` } as CSSProperties} />
            ))}
          </div>
          <ol className="lg-band__levels">
            {levels.map((level) => (
              <li key={level.key} className={`is-${level.key}`} style={{ "--w": `${(level.area / total) * 100}%` } as CSSProperties}>
                <h3>{level.label[locale]}</h3>
                <p className="lg-band__area">{formatAreaExact(level.area, locale)}</p>
                {levelLine(level, locale).map((line) => (
                  <p key={line} className="lg-band__meta">{line}</p>
                ))}
              </li>
            ))}
          </ol>
        </div>
      ) : null}
      <div className="lg-area__notes" data-reveal>
        <p>{a.propertyLine[locale]}</p>
        <p>{a.levelsLine[locale]}</p>
        <p className="lg-area__option">
          <span>{a.groundOnly.text[locale]}</span>
          <span className="lg-area__status">{ui.status[locale]}: {a.groundOnly.evidence === "TO_CONFIRM" ? ui.toConfirm[locale] : ""}</span>
        </p>
      </div>
    </LgSection>
  );
}

const schemeCopy = {
  street: { ro: "Nivelul străzii · intrare: scări și rampă", ru: "Уровень улицы · вход: лестница и пандус", en: "Street level · entrance: steps and ramp" },
  stair: { ro: "Scară interioară între niveluri", ru: "Внутренняя лестница между уровнями", en: "Internal staircase between the levels" },
  label: { ro: "Schema suprafețelor — secțiune schematică prin niveluri", ru: "Схема площадей — схематический разрез по уровням", en: "Area scheme — a schematic section through the levels" },
} satisfies Record<string, Localized>;

/**
 * Schematic section built in HTML (readable at 390 px — no microscopic SVG
 * labels): the terrace in front of the entrance, the ground floor above street
 * level, the lower ground below it, the internal staircase between them. Floor
 * widths are proportional to their areas; nothing else is implied.
 */
export function AreaScheme({ x, unit, locale }: { x: LeasingExperience; unit: AvailableSpace; locale: SiteLocale }) {
  const s = x.scheme;
  const levels = unit.breakdown ?? [];
  const ground = levels.find((level) => level.key === "ground");
  const lower = levels.find((level) => level.key === "lower");
  const terrace = levels.find((level) => level.key === "terrace");
  if (!ground || !lower) return null;
  const widest = Math.max(ground.area, lower.area);
  const box = (level: AreaLevel, mark: string | undefined) => (
    <div className={"lg-sect__box is-" + level.key} style={{ "--w": (level.area / widest) * 100 + "%" } as CSSProperties}>
      <h3>{level.label[locale]}</h3>
      <p className="lg-sect__area">{formatAreaExact(level.area, locale)}</p>
      {levelLine(level, locale).map((line) => (
        <p key={line} className="lg-sect__meta">{line}</p>
      ))}
      {mark ? <span className="lg-sect__mark">{mark}</span> : null}
    </div>
  );
  return (
    <LgSection id="scheme" tone="white" labelledBy="lg-scheme-title" className="lg-scheme">
      <LgHead heading={s} locale={locale} id="lg-scheme-title" layout="split" />
      <figure className="lg-sect" data-reveal aria-label={schemeCopy.label[locale]}>
        <div className="lg-sect__drawing">
          <div className="lg-sect__front">
            {terrace ? (
              <div className="lg-sect__terrace">
                <h3>{terrace.label[locale]}</h3>
                <p className="lg-sect__area">{formatAreaExact(terrace.area, locale)}</p>
              </div>
            ) : null}
          </div>
          <div className="lg-sect__floors">
            {box(ground, s.marks?.ground)}
            <div className="lg-sect__grade"><span>{schemeCopy.street[locale]}</span></div>
            {box(lower, s.marks?.lower)}
            <svg className="lg-sect__stair" viewBox="0 0 40 60" aria-hidden="true" focusable="false" preserveAspectRatio="none">
              <path d="M2 2 H9 V12 H16 V22 H23 V32 H30 V42 H38 V58" />
            </svg>
          </div>
        </div>
        <figcaption>
          <p className="lg-sect__legend"><i aria-hidden="true" />{schemeCopy.stair[locale]}</p>
          <p>{s.note[locale]}</p>
          <p className="lg-sect__plans">{s.plans.text[locale]}</p>
        </figcaption>
      </figure>
    </LgSection>
  );
}
