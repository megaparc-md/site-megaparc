import { ToolSwitch } from "@/components/leasing-experience/tool-switch";
import { dacia31District, districtVisible } from "@/data/dacia-31-district";
import type { SiteLocale } from "@/lib/site-data";

/**
 * DISTRICT ANALYTICS — OWNER «PROPERTY COMMERCIAL EXPERIENCE 2026» Part B (2026-11-23), Dacia 31. Interactive, without decorative images:
 * five tabs (residents · transport · surroundings · who it suits · development), each fact as a figure + label + note, with its source,
 * date and confidence. Data: src/data/dacia-31-district.ts (desk research, docs/research/DACIA_31_LOCATION_RESEARCH.md). OWNER preview
 * until the facts are approved. No traffic figure, no rent, no occupier, no superlative.
 */
const fmtDate = (iso: string, locale: SiteLocale) => new Intl.DateTimeFormat(locale === "en" ? "en-GB" : locale === "ru" ? "ru-RU" : "ro-RO", { day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date(`${iso}T12:00:00Z`));

export function DistrictAnalytics({ project, locale }: { project: string; locale: SiteLocale }) {
  if (project !== "dacia-31" || !districtVisible()) return null;
  const d = dacia31District;
  return (
    <section id="district" className="lg-sec lg-sec--white da-sec" aria-labelledby="da-title" data-as-of={d.asOf}>
      <div className="xp-shell">
        <div className="da-head">
          <p className="lg-label">{d.kicker[locale]}</p>
          <h2 className="da-title" id="da-title">{d.title[locale]}</h2>
          <p className="da-lead">{d.lead[locale]}</p>
        </div>
        <ToolSwitch
          label={d.kicker[locale]}
          tools={d.tabs.map((tab) => ({ key: `da-${tab.key}`, label: tab.tab[locale], note: tab.title[locale] }))}
          panes={d.tabs.map((tab) => (
            <div key={tab.key} className="da-pane">
              <ul className="da-facts">
                {tab.facts.map((fact) => (
                  <li key={fact.key} className="da-fact">
                    <strong className="da-fact__value">{fact.value[locale]}</strong>
                    <span className="da-fact__label">{fact.label[locale]}</span>
                    {fact.note ? <span className="da-fact__note">{fact.note[locale]}</span> : null}
                    <span className="da-fact__meta">
                      <i className={`da-dot is-${fact.confidence}`} aria-hidden="true" />
                      {d.confidence[fact.confidence][locale]} · {d.sourceLabel[locale]}: {fact.source[locale]} · {fmtDate(fact.date, locale)}
                    </span>
                  </li>
                ))}
              </ul>
              {tab.foot ? <p className="da-foot">{tab.foot[locale]}</p> : null}
            </div>
          ))}
        />
        <p className="da-note">{d.note[locale]}</p>
      </div>
    </section>
  );
}
