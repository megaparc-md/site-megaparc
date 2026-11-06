import type { CSSProperties, ReactNode } from "react";
import { LgHead, LgSection, ui } from "@/components/leasing-experience/parts";
import { PlanViewer } from "@/components/leasing-experience/plan-viewer";
import { Icon } from "@/components/ui";
import { formatArea, formatAreaExact } from "@/content/source";
import type { LeasingExperience, PlanLevel, PlanMark, Pt } from "@/data/leasing-experience-model";
import type { AreaLevel, AvailableSpace } from "@/data/leasing-inventory";
import type { Localized, SiteLocale } from "@/lib/site-data";

/**
 * SCENE 05 — PLANS AND AREAS · DETAIL (OWNER compact brief §7; final viewing
 * pass: 1-й этаж · Цоколь · Общая схема, a large plan and three or four figures
 * by default, the room schedule behind «Показать экспликацию»): a product, not a table.
 * Two plan schemes traced from the architectural plans (rooms, stairs,
 * entrances, columns — no tenant layout) on one common scale, so the stair
 * cores stay in place when the level changes; zones light up on hover / tap
 * together with their line in the legend. Beside the plan: three or four
 * figures of the level (from the unit record), the legend, the caveat, «Получить
 * планы». Third view: the section through both levels.
 */

const VIEW = { x: -700, y: -16200, w: 32700, h: 33700 };
const path = (shape: Pt[]) => `M${shape.map(([x, y]) => `${x} ${y}`).join(" L")} Z`;
const centre = (shape: Pt[]): Pt => {
  const xs = shape.map((p) => p[0]);
  const ys = shape.map((p) => p[1]);
  return [(Math.min(...xs) + Math.max(...xs)) / 2, (Math.min(...ys) + Math.max(...ys)) / 2];
};
const fmtHeight = (m: number, locale: SiteLocale) => `${m.toLocaleString(locale === "ru" ? "ru-RU" : locale === "ro" ? "ro-RO" : "en-GB")} ${locale === "ru" ? "м" : "m"}`;

const copy = {
  street: { ro: "Trotuar · Bd. Moscova", ru: "Тротуар · бул. Москова", en: "Pavement · Moscova Blvd" },
  level: { ro: "Nivelul", ru: "Уровень", en: "Level" },
  total: { ro: "Suprafața nivelului", ru: "Площадь уровня", en: "Level area" },
  planLabel: { ro: "Schema planului", ru: "План-схема", en: "Plan scheme" },
  legend: { ro: "Încăperi", ru: "Помещения", en: "Rooms" },
  entrances: { ro: "Intrări", ru: "Входы", en: "Entrances" },
  views: { ro: "Niveluri", ru: "Уровни", en: "Levels" },
  sectionLabel: { ro: "Secțiune schematică prin niveluri", ru: "Схематический разрез по уровням", en: "A schematic section through the levels" },
  streetLevel: { ro: "Nivelul străzii · intrare: scări și rampă", ru: "Уровень улицы · вход: лестница и пандус", en: "Street level · entrance: steps and a ramp" },
  stairs: { ro: "Scări între niveluri", ru: "Лестницы между уровнями", en: "Stairs between the levels" },
  showSchedule: { ro: "Arată explicația încăperilor", ru: "Показать экспликацию", en: "Show the room schedule" },
  hideSchedule: { ro: "Ascunde explicația încăperilor", ru: "Скрыть экспликацию", en: "Hide the room schedule" },
} satisfies Record<string, Localized>;

function Arrow({ mark }: { mark: PlanMark }) {
  const [x, y] = mark.at;
  const d = mark.dir === "up" ? `M${x} ${y - 760} L${x + 520} ${y + 140} L${x - 520} ${y + 140} Z` : `M${x} ${y + 760} L${x + 520} ${y - 140} L${x - 520} ${y - 140} Z`;
  return <path className={`lg-plan__arrow is-${mark.kind}`} d={d} />;
}

/** One level as SVG: the other level as a faint outline, the zones, the stairs, the columns, the numbers and the entrance arrows. */
function PlanSvg({ level, other, locale }: { level: PlanLevel; other: PlanLevel | undefined; locale: SiteLocale }) {
  const hatch = `lg-hatch-${level.key}`;
  const terrace = `lg-terrace-${level.key}`;
  return (
    <svg className="lg-plan" viewBox={`${VIEW.x} ${VIEW.y} ${VIEW.w} ${VIEW.h}`} role="img" aria-label={`${copy.planLabel[locale]} — ${level.label[locale]} ${level.mark}`}>
      <defs>
        <pattern id={hatch} patternUnits="userSpaceOnUse" width="520" height="520" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="520" className="lg-plan__hatch" />
        </pattern>
        <pattern id={terrace} patternUnits="userSpaceOnUse" width="900" height="900">
          <circle cx="450" cy="450" r="70" className="lg-plan__dot" />
        </pattern>
      </defs>
      {other ? other.zones.filter((zone) => zone.kind === "sales").map((zone) => <path key={zone.key} d={path(zone.shape)} className="lg-plan__ghost" />) : null}
      {level.zones.map((zone) => (
        <path key={zone.key} d={path(zone.shape)} data-zone={zone.kind === "stair" ? `stairs-${level.key}` : zone.key} className={`lg-plan__z is-${zone.kind}`} style={zone.kind === "stair" ? ({ fill: `url(#${hatch})` } as CSSProperties) : zone.kind === "terrace" ? ({ fill: `url(#${terrace})` } as CSSProperties) : undefined}>
          <title>{`${zone.label[locale]}${zone.area ? ` · ${formatAreaExact(zone.area, locale)}` : ""}`}</title>
        </path>
      ))}
      {level.columns.map(([x, y]) => <rect key={`${x}-${y}`} x={x - 210} y={y - 210} width="420" height="420" className="lg-plan__col" />)}
      {level.marks.map((mark) => <Arrow key={mark.key} mark={mark} />)}
      {level.zones.filter((zone) => zone.no).map((zone) => {
        const [cx, cy] = zone.at ?? centre(zone.shape);
        return (
          <g key={zone.key} className="lg-plan__no" data-zone={zone.key}>
            <circle cx={cx} cy={cy} r="720" />
            <text x={cx} y={cy} dy="0.36em" textAnchor="middle">{zone.no}</text>
          </g>
        );
      })}
      {level.key === "ground" ? <text className="lg-plan__street" x="22000" y="17150" textAnchor="middle">{copy.street[locale]}</text> : null}
    </svg>
  );
}

/** The section through both levels (HTML, readable at 390 px): terrace at street level, ground floor above the grade, lower ground below, the stairs between them. */
export function SectionScheme({ x, unit, locale, compact = false }: { x: LeasingExperience; unit: AvailableSpace; locale: SiteLocale; compact?: boolean }) {
  const levels = unit.breakdown ?? [];
  const ground = levels.find((level) => level.key === "ground");
  const lower = levels.find((level) => level.key === "lower");
  const terrace = levels.find((level) => level.key === "terrace");
  if (!ground || !lower) return null;
  const widest = Math.max(ground.area, lower.area);
  const box = (level: AreaLevel, mark: string | undefined) => (
    <div className={`lg-sect__box is-${level.key}`} style={{ "--w": `${(level.area / widest) * 100}%` } as CSSProperties}>
      <p className="lg-sect__name">{level.label[locale]}</p>
      <p className="lg-sect__area">{formatAreaExact(level.area, locale)}</p>
      {level.useful ? <p className="lg-sect__meta">{ui.usefulShort[locale]} {formatAreaExact(level.useful, locale)}</p> : null}
      {mark ? <span className="lg-sect__mark">{mark}</span> : null}
    </div>
  );
  return (
    <div className={`lg-sect${compact ? " is-compact" : ""}`} role="img" aria-label={copy.sectionLabel[locale]}>
      <div className="lg-sect__drawing">
        <div className="lg-sect__front">
          {terrace ? (
            <div className="lg-sect__terrace">
              <p className="lg-sect__name">{terrace.label[locale]}</p>
              <p className="lg-sect__area">{formatAreaExact(terrace.area, locale)}</p>
            </div>
          ) : null}
        </div>
        <div className="lg-sect__floors">
          {box(ground, x.plans.marks?.ground)}
          <div className="lg-sect__grade"><span>{copy.streetLevel[locale]}</span></div>
          {box(lower, x.plans.marks?.lower)}
          <svg className="lg-sect__stair" viewBox="0 0 40 60" aria-hidden="true" focusable="false" preserveAspectRatio="none">
            <path d="M2 2 H9 V12 H16 V22 H23 V32 H30 V42 H38 V58" />
          </svg>
        </div>
      </div>
      <p className="lg-sect__legend"><i aria-hidden="true" />{copy.stairs[locale]}</p>
    </div>
  );
}

function Figures({ items }: { items: { label: string; value: string }[] }) {
  return (
    <dl className="lg-figs">
      {items.map((item) => (
        <div key={item.label}>
          <dt>{item.label}</dt>
          <dd>{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}

export function PlansScene({ x, unit, locale }: { x: LeasingExperience; unit: AvailableSpace; locale: SiteLocale }) {
  const p = x.plans;
  const breakdown = unit.breakdown ?? [];
  const byKey = (key: string) => breakdown.find((level) => level.key === key);
  const terrace = byKey("terrace");

  const levelSide = (level: PlanLevel): ReactNode => {
    const data = byKey(level.key);
    const figures = [
      ...(data ? [{ label: copy.total[locale], value: formatAreaExact(data.area, locale) }] : []),
      ...(data?.useful ? [{ label: ui.useful[locale], value: formatAreaExact(data.useful, locale) }] : []),
      ...(data?.height ? [{ label: ui.heights[locale], value: `${data.heightEvidence === "APPROXIMATE" ? `${ui.approx[locale]} ` : ""}${fmtHeight(data.height, locale)}` }] : []),
      ...(level.key === "ground" && terrace ? [{ label: terrace.label[locale], value: formatAreaExact(terrace.area, locale) }] : []),
    ];
    return (
      <>
        <p className="lg-plans__level">{level.label[locale]} <span>{level.mark}</span></p>
        <Figures items={figures} />
        <details className="lg-plans__schedule">
          <summary className="pm-link"><span className="is-show">{copy.showSchedule[locale]}</span><span className="is-hide">{copy.hideSchedule[locale]}</span><Icon name="down" /></summary>
        <p className="lg-label">{copy.legend[locale]}</p>
        <ul className="lg-legend">
          {level.zones.filter((zone) => zone.no).map((zone) => (
            <li key={zone.key} data-zone={zone.key} tabIndex={0}>
              <span className="lg-legend__no">{zone.no}</span>
              <span className="lg-legend__name">{zone.label[locale]}</span>
              {zone.area ? <span className="lg-legend__area">{formatAreaExact(zone.area, locale)}</span> : null}
            </li>
          ))}
          <li data-zone={`stairs-${level.key}`} tabIndex={0}>
            <span className="lg-legend__hatch" aria-hidden="true" />
            <span className="lg-legend__name">{copy.stairs[locale]}</span>
          </li>
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

  const overviewSide = (
    <>
      <p className="lg-plans__level">{p.schemeTab[locale]}</p>
      <Figures
        items={[
          { label: ui.offered[locale], value: formatArea(unit.area, locale) },
          ...(unit.usefulArea ? [{ label: ui.useful[locale], value: formatArea(unit.usefulArea, locale) }] : []),
          ...(terrace ? [{ label: terrace.label[locale], value: formatAreaExact(terrace.area, locale) }] : []),
        ]}
      />
      <p className="lg-plans__line">{x.area.propertyLine[locale]}</p>
      <p className="lg-plans__line">{x.area.groundOnly.text[locale]} — <span className="lg-plans__status">{ui.toConfirm[locale].toLowerCase()}</span></p>
    </>
  );

  const tabs = [...p.levels.map((level) => ({ key: level.key, label: level.tab[locale] })), { key: "scheme", label: p.schemeTab[locale] }];
  const views = [...p.levels.map((level) => <PlanSvg key={level.key} level={level} other={p.levels.find((item) => item.key !== level.key)} locale={locale} />), <SectionScheme key="scheme" x={x} unit={unit} locale={locale} />];
  const sides = [...p.levels.map((level) => <div key={level.key}>{levelSide(level)}</div>), <div key="scheme">{overviewSide}</div>];

  return (
    <LgSection id="plans" tone="white" labelledBy="lg-plans-title" className="lg-plans">
      <LgHead heading={p} locale={locale} id="lg-plans-title" area={formatArea(unit.area, locale)} layout="split" />
      <PlanViewer tabs={tabs} views={views} sides={sides} label={copy.views[locale]} />
      <div className="lg-plans__foot" data-reveal>
        <p className="lg-plans__note">{p.note[locale]}</p>
        <p className="lg-plans__actions">
          <a className="pm-link" href="#tech" data-drawer="tech" aria-haspopup="dialog"><span>{ui.chTech[locale]}</span><Icon /></a>
          <a className="btn btn--ghost" href="#viewing" data-intent="plans"><span>{ui.plansGet[locale]}</span><Icon /></a>
        </p>
      </div>
    </LgSection>
  );
}
