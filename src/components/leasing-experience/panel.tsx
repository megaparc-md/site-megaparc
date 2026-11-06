import { Fragment, type ReactNode } from "react";
import { DecisionPanel } from "@/components/leasing-experience/decision-panel";
import { LgHead, LgPhoto, LgSection, ui } from "@/components/leasing-experience/parts";
import { SectionScheme } from "@/components/leasing-experience/plans";
import { LocationMap } from "@/components/location-section";
import { Icon } from "@/components/ui";
import { formatArea, formatAreaExact, type ProjectEntry } from "@/content/source";
import { publishable, type CostState, type LeasingExperience, type PanelMedia, type PanelTab, type TechRow } from "@/data/leasing-experience-model";
import type { AvailableSpace } from "@/data/leasing-inventory";
import { googleDirectionsUrl, googleMapsUrl } from "@/lib/assets";
import type { Localized, SiteLocale } from "@/lib/site-data";

/**
 * SCENE 03 — THE DECISION PANEL (OWNER compact brief §5–6): technical data ·
 * location and movement · areas · engineering · access · readiness. Replaces
 * eight earlier sections (location, areas, access, engineering, confirmed / to
 * confirm, lease terms, cost of opening, decision checks). Only what matters,
 * unknowns marked «Уточняется»; areas and heights read from the unit record.
 */

type Row = { key: string; label: string; value: string; state?: TechRow["state"]; big?: boolean };
const visible = (row: TechRow) => publishable(row.evidence) || row.state === "confirm";
const fmtHeight = (m: number, locale: SiteLocale) => `${m.toLocaleString(locale === "ru" ? "ru-RU" : locale === "ro" ? "ro-RO" : "en-GB")} ${locale === "ru" ? "м" : "m"}`;
const toRow = (row: TechRow, locale: SiteLocale): Row => ({ key: row.key, label: row.label[locale], value: row.value[locale], state: row.state });
/** A value that already says it is being confirmed needs no second «Уточняется». */
const says = /уточня|clarific|confirm/i;
/** «1-й этаж + цоколь»: names after the first one read in lower case inside a sentence (RU / RO). */
const joined = (names: string[], locale: SiteLocale) => names.map((name, i) => (i && locale !== "en" ? name.charAt(0).toLocaleLowerCase(locale) + name.slice(1) : name));

const costCopy: Record<CostState, Localized> = {
  done: { ro: "în mare parte executat", ru: "в основном выполнено", en: "largely done" },
  concept: { ro: "după concept", ru: "по концепции", en: "by concept" },
  tenant: { ro: "chiriașul", ru: "арендатор", en: "tenant" },
  "if-needed": { ro: "dacă e nevoie", ru: "если требуется", en: "if needed" },
};

/** Key / value rows: only uncertain rows carry a word («Уточняется», «Арендатор») — a value in place speaks for itself. */
function Rows({ rows, locale, columns = false }: { rows: Row[]; locale: SiteLocale; columns?: boolean }) {
  return (
    <dl className={`lg-keys${columns ? " lg-keys--cols" : ""}`}>
      {rows.map((row) => (
        <div key={row.key} className={`lg-keys__row is-${row.state ?? "ready"}${row.big ? " is-big" : ""}`}>
          <dt>{row.label}</dt>
          <dd>
            <span>{row.value}</span>
            {row.state === "confirm" && !says.test(row.value) ? <em>{ui.toConfirm[locale]}</em> : row.state === "tenant" ? <em>{ui.tenant[locale]}</em> : null}
          </dd>
        </div>
      ))}
    </dl>
  );
}

function Big({ items }: { items: { label: string; value: string; accent?: boolean }[] }) {
  return (
    <div className="lg-big">
      {items.map((item) => (
        <p key={item.label} className={item.accent ? "is-accent" : undefined}>
          <strong>{item.value}</strong>
          <span>{item.label}</span>
        </p>
      ))}
    </div>
  );
}

export function DecisionPanelScene({ x, unit, project, locale }: { x: LeasingExperience; unit: AvailableSpace; project: ProjectEntry; locale: SiteLocale }) {
  const levels = unit.breakdown ?? [];
  const floors = levels.filter((level) => level.key !== "terrace");
  const terrace = levels.find((level) => level.key === "terrace");
  const heights = floors.filter((level) => level.height);
  const map = project.asset?.map ?? null;
  const areaBig = [
    { label: ui.offered[locale], value: formatArea(unit.area, locale) },
    ...(unit.usefulArea ? [{ label: ui.useful[locale], value: formatArea(unit.usefulArea, locale), accent: true }] : []),
  ];

  const panes: Record<PanelTab, ReactNode> = {
    tech: (
      <Rows
        locale={locale}
        rows={[
          { key: "offered", label: ui.offered[locale], value: formatArea(unit.area, locale), big: true },
          ...(unit.usefulArea ? [{ key: "useful", label: ui.useful[locale], value: formatArea(unit.usefulArea, locale), big: true }] : []),
          { key: "levels", label: ui.levels[locale], value: `${floors.length} · ${joined(floors.map((level) => level.label[locale]), locale).join(" + ")}${terrace ? ` · ${ui.terrace[locale]} ${formatAreaExact(terrace.area, locale)}` : ""}` },
          ...(heights.length ? [{ key: "heights", label: ui.heights[locale], value: heights.map((level, i) => `${joined(heights.map((item) => item.label[locale]), locale)[i]} ${level.heightEvidence === "APPROXIMATE" ? `${ui.approx[locale]} ` : ""}${fmtHeight(level.height!, locale)}`).join(" · "), state: "fact" as const }] : []),
          ...x.specs.filter(visible).map((row) => toRow(row, locale)),
        ]}
      />
    ),
    location: (
      <>
        <ul className="lg-points">
          {x.location.points.filter((point) => publishable(point.evidence)).map((point) => (
            <li key={point.text.en}>{point.text[locale]}</li>
          ))}
        </ul>
        <Rows locale={locale} rows={x.access.filter((row) => row.key === "parking" && visible(row)).map((row) => toRow(row, locale))} />
        {x.location.metrics.filter((metric) => metric.value && metric.asOf && publishable(metric.evidence)).length ? (
          <Rows locale={locale} rows={x.location.metrics.filter((metric) => metric.value && metric.asOf && publishable(metric.evidence)).map((metric) => ({ key: metric.key, label: metric.label[locale], value: `${metric.value![locale]} · ${metric.asOf}` }))} />
        ) : null}
        {map ? (
          <p className="lg-pane__links">
            <a className="pm-link" href={googleDirectionsUrl(map)} target="_blank" rel="noopener noreferrer"><span>{ui.route[locale]}</span><Icon name="up-right" /></a>
            <a className="pm-link pm-link--quiet" href={googleMapsUrl(map)} target="_blank" rel="noopener noreferrer"><span>{ui.openMap[locale]}</span><Icon name="up-right" /></a>
          </p>
        ) : null}
      </>
    ),
    areas: (
      <>
        <Big items={areaBig} />
        <Rows
          locale={locale}
          rows={levels.map((level) => ({ key: level.key, label: level.label[locale], value: `${formatAreaExact(level.area, locale)}${level.useful ? ` · ${ui.usefulShort[locale]} ${formatAreaExact(level.useful, locale)}` : ""}` }))}
        />
        <p className="lg-pane__note">{x.area.propertyLine[locale]}</p>
        <p className="lg-pane__note">{x.area.groundOnly.text[locale]} — <em className="lg-pane__status">{ui.toConfirm[locale].toLowerCase()}</em></p>
        <p className="lg-pane__links"><a className="pm-link" href="#plans"><span>{ui.plansSee[locale]}</span><Icon name="down" /></a></p>
      </>
    ),
    engineering: (
      <>
        <Rows locale={locale} columns rows={x.engineering.rows.filter(visible).map((row) => toRow(row, locale))} />
        <p className="lg-pane__note is-rule">{x.engineering.note[locale]}</p>
      </>
    ),
    access: <Rows locale={locale} rows={x.access.filter(visible).map((row) => toRow(row, locale))} />,
    readiness: (
      <div className="lg-ready">
        <div>
          <p className="lg-label">{x.readiness.confirmTitle[locale]}</p>
          <ul className="lg-circles">
            {x.readiness.confirm.map((item) => (
              <li key={item.text.en}>{item.text[locale]}</li>
            ))}
          </ul>
        </div>
        <div>
          <p className="lg-label">{x.readiness.costTitle[locale]}</p>
          <dl className="lg-cost">
            {x.readiness.cost.map((row) => (
              <div key={row.key} className={`is-${row.state}`}>
                <dt>{row.label[locale]}</dt>
                <dd>{costCopy[row.state][locale]}</dd>
              </div>
            ))}
          </dl>
          <p className="lg-label lg-ready__terms">{x.terms.title[locale]}</p>
          <p className="lg-pane__note">{x.terms.pending[locale]}</p>
          {x.terms.rows.filter((row) => row.value && row.publish && publishable(row.evidence)).length ? (
            <Rows locale={locale} rows={x.terms.rows.filter((row) => row.value && row.publish && publishable(row.evidence)).map((row) => ({ key: row.key, label: row.label[locale], value: row.value![locale] }))} />
          ) : null}
        </div>
      </div>
    ),
  };

  const media = (item: PanelMedia): ReactNode =>
    item.kind === "photo" ? (
      <LgPhoto photo={x.photos[item.shot.photo]} shot={item.shot} locale={locale} sizes="(min-width: 1024px) 40vw, 100vw" className="lg-panel__photo" />
    ) : item.kind === "map" ? (
      <LocationMap locale={locale} mapKey={x.project} name={project.name} place={x.hero.place[locale]} className="lg-panel__map" />
    ) : (
      <div className="lg-panel__scheme"><SectionScheme x={x} unit={unit} locale={locale} compact /></div>
    );

  const tabs = x.panel.tabs;
  return (
    <LgSection id="decision" tone="paper" labelledBy="lg-decision-title" className="lg-decision">
      <LgHead heading={x.panel} locale={locale} id="lg-decision-title" layout="split" />
      <DecisionPanel
        label={x.panel.kicker[locale]}
        tabs={tabs.map((tab) => ({ key: tab.key, label: tab.label[locale] }))}
        medias={tabs.map((tab) => <Fragment key={tab.key}>{media(tab.media)}</Fragment>)}
        panes={tabs.map((tab) => (
          <Fragment key={tab.key}>
            <p className="lg-pane__lead">{tab.lead[locale]}</p>
            {panes[tab.key]}
          </Fragment>
        ))}
      />
    </LgSection>
  );
}
