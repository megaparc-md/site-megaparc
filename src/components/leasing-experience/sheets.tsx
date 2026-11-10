import { ui } from "@/components/leasing-experience/parts";
import { Icon } from "@/components/ui";
import { formatAreaExact, type ProjectEntry } from "@/content/source";
import { publishable, type CostState, type LeasingExperience, type TechRow } from "@/data/leasing-experience-model";
import type { TemplateOffer } from "@/components/leasing-experience/offer";
import { TechPassport } from "@/components/leasing-experience/tech-passport";
import { googleDirectionsUrl } from "@/lib/assets";
import type { Localized, SiteLocale } from "@/lib/site-data";

/**
 * DRAWER SHEETS — the DETAIL level (OWNER "FINAL VIEWING CONVERSION PASS",
 * 2026-11-06): «Технические характеристики →» (areas · levels · heights ·
 * power · heating · ventilation · water · washrooms · exits, then engineering
 * and access in full) and «Готовность к запуску» (what we still confirm, what
 * opening involves, the one public line on terms). Nothing of the earlier
 * decision panel is dropped — it moved here, out of the reading flow. Only
 * uncertain rows carry a word («Уточняется», «Арендатор»).
 */

type Row = { key: string; label: string; value: string; state?: TechRow["state"] };
const visible = (row: TechRow) => publishable(row.evidence) || row.state === "confirm";
const toRow = (row: TechRow, locale: SiteLocale): Row => ({ key: row.key, label: row.label[locale], value: row.value[locale], state: row.state });
const says = /уточня|подтвержда|clarific|confirm/i;
const joined = (names: string[], locale: SiteLocale) => names.map((name, i) => (i && locale !== "en" ? name.charAt(0).toLocaleLowerCase(locale) + name.slice(1) : name));
const fmtHeight = (m: number, locale: SiteLocale) => `${m.toLocaleString(locale === "ru" ? "ru-RU" : locale === "ro" ? "ro-RO" : "en-GB")} ${locale === "ru" ? "м" : "m"}`;

const copy = {
  areas: { ro: "Suprafețe și niveluri", ru: "Площади и уровни", en: "Areas and levels" },
  engineering: { ro: "Inginerie", ru: "Инженерия", en: "Engineering" },
  access: { ro: "Acces", ru: "Доступ", en: "Access" },
  levelsN: { ro: "niveluri", ru: "уровня", en: "levels" },
  power: { ro: "alimentare conform documentelor", ru: "электроснабжение по документам", en: "power supply, documented" },
  documented: { ro: "conform documentelor", ru: "по документам", en: "documented" },
  confirm: { ro: "Clarificăm pentru afacerea dumneavoastră", ru: "Уточняем под ваш бизнес", en: "We confirm for your business" },
  cost: { ro: "Din ce se compune lansarea", ru: "Из чего складывается запуск", en: "What opening involves" },
  covers: { ro: "Oferta comercială răspunde la", ru: "В коммерческом предложении", en: "The commercial proposal covers" },
} satisfies Record<string, Localized>;

const costCopy: Record<CostState, Localized> = {
  done: { ro: "în mare parte executat", ru: "в основном выполнено", en: "largely done" },
  concept: { ro: "după concept", ru: "по концепции", en: "by concept" },
  tenant: { ro: "chiriașul", ru: "арендатор", en: "tenant" },
  "if-needed": { ro: "dacă e nevoie", ru: "если требуется", en: "if needed" },
};

function Rows({ rows, locale }: { rows: Row[]; locale: SiteLocale }) {
  return (
    <dl className="lg-keys">
      {rows.map((row) => (
        <div key={row.key} className={`lg-keys__row is-${row.state ?? "ready"}`}>
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

export function TechSheet({ x, offer, project, locale }: { x: LeasingExperience; offer: TemplateOffer; project: ProjectEntry; locale: SiteLocale }) {
  // the tenant technical passport where the dataset has one (Moscova 20, OWNER 2026-11-10); the row list otherwise
  if (x.passport) return <TechPassport x={x} passport={x.passport} offer={offer} locale={locale} />;
  const levels = offer.breakdown;
  const floors = levels.filter((level) => level.key !== "terrace");
  const heights = floors.filter((level) => level.height);
  const power = x.engineering.rows.find((row) => row.key === "power" && publishable(row.evidence));
  const kw = power?.value.en.match(/(\d+)\s*kW/)?.[1];
  const map = project.asset?.map ?? null;
  // fact cards first (OWNER card & air pass §13): power · the two clear heights · exits — all read from the records
  const exits = x.access.find((row) => row.key === "exits" && publishable(row.evidence))?.value[locale].match(/^(\d+)[\s ]+([^\s,.]+)/);
  const big = [
    ...(kw ? [{ label: copy.power[locale], value: `${kw} ${locale === "ru" ? "кВт" : "kW"}` }] : []),
    ...heights.map((level) => ({ label: level.label[locale], value: `${level.heightEvidence === "APPROXIMATE" ? "≈ " : ""}${fmtHeight(level.height!, locale)}` })),
    ...(exits ? [{ label: copy.documented[locale], value: `${exits[1]} ${exits[2]}` }] : []),
  ];
  return (
    <div className="lg-sheet">
      <p className="lg-sheet__lead">{x.drawers.tech.lead[locale]}</p>
      {big.length ? <dl className="lg-sheet__big lg-facts">
        {big.map((item) => (
          <div key={item.label} className="lg-card lg-fact">
            <dt>{item.label}</dt>
            <dd>{item.value}</dd>
          </div>
        ))}
      </dl> : null}
      <section className="lg-sheet__part">
        <h3 className="lg-label">{copy.areas[locale]}</h3>
        <Rows
          locale={locale}
          rows={[
            ...levels.map((level) => ({ key: level.key, label: level.label[locale], value: `${formatAreaExact(level.area, locale)}${level.useful ? ` · ${ui.usefulShort[locale]} ${formatAreaExact(level.useful, locale)}` : ""}` })),
            ...(heights.length ? [{ key: "heights", label: ui.heights[locale], value: heights.map((level, i) => `${joined(heights.map((item) => item.label[locale]), locale)[i]} ${level.heightEvidence === "APPROXIMATE" ? `${ui.approx[locale]} ` : ""}${fmtHeight(level.height!, locale)}`).join(" · "), state: "fact" as const }] : []),
            { key: "property", label: project.name, value: x.area.propertyLine[locale], state: "fact" as const },
            ...(x.area.groundOnly ? [{ key: "ground-only", label: x.area.groundOnly.text[locale], value: ui.toConfirm[locale], state: "confirm" as const }] : []),
          ]}
        />
      </section>
      <section className="lg-sheet__part">
        <h3 className="lg-label">{copy.engineering[locale]}</h3>
        <Rows locale={locale} rows={x.engineering.rows.filter(visible).map((row) => toRow(row, locale))} />
        <p className="lg-sheet__note">{x.engineering.note[locale]}</p>
      </section>
      <section className="lg-sheet__part">
        <h3 className="lg-label">{copy.access[locale]}</h3>
        <Rows locale={locale} rows={x.access.filter(visible).map((row) => toRow(row, locale))} />
      </section>
      <p className="lg-sheet__links">
        <a className="pm-link" href="#plans"><span>{ui.plansSee[locale]}</span><Icon name="down" /></a>
        {map ? <a className="pm-link pm-link--quiet" href={googleDirectionsUrl(map)} target="_blank" rel="noopener noreferrer"><span>{ui.route[locale]}</span><Icon name="up-right" /></a> : null}
        <a className="pm-link pm-link--quiet" href="#lg-form" data-intent="plans"><span>{ui.plansGet[locale]}</span><Icon /></a>
      </p>
    </div>
  );
}

export function ReadinessSheet({ x, locale, offer }: { x: LeasingExperience; locale: SiteLocale; offer: TemplateOffer }) {
  return (
    <div className="lg-sheet">
      <p className="lg-sheet__lead">{x.drawers.readiness.lead[locale]}</p>
      <section className="lg-sheet__part">
        <h3 className="lg-label">{copy.confirm[locale]}</h3>
        <ul className="lg-circles">
          {x.readiness.confirm.map((item) => (
            <li key={item.text.en}>{item.text[locale]}</li>
          ))}
        </ul>
      </section>
      <section className="lg-sheet__part">
        <h3 className="lg-label">{copy.cost[locale]}</h3>
        <dl className="lg-cost">
          {x.readiness.cost.map((row) => (
            <div key={row.key} className={`is-${row.state}`}>
              <dt>{row.label[locale]}</dt>
              <dd>{costCopy[row.state][locale]}</dd>
            </div>
          ))}
        </dl>
      </section>
      <section className="lg-sheet__part">
        <h3 className="lg-label">{x.terms.title[locale]}</h3>
        <p className="lg-sheet__terms">{x.terms.pending[locale]}</p>
        <p className="lg-sheet__note">{copy.covers[locale]}: {x.terms.covers.map((item) => item[locale]).join(" · ")}.</p>
        {x.terms.rows.filter((row) => row.value && row.publish && publishable(row.evidence)).length ? (
          <Rows locale={locale} rows={x.terms.rows.filter((row) => row.value && row.publish && publishable(row.evidence)).map((row) => ({ key: row.key, label: row.label[locale], value: row.value![locale] }))} />
        ) : null}
      </section>
      <p className="lg-sheet__links">
        <a className="btn" href="#lg-form" data-intent="viewing"><span>{offer.primary}</span><Icon /></a>
      </p>
    </div>
  );
}
