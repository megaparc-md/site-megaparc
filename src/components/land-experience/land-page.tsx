import Link from "next/link";
import "@/app/land-experience.css";
import { c, confidenceCopy, mailCopy, natureCopy, registerCopy, roleCopy } from "@/components/land-experience/copy";
import { LandExplorer } from "@/components/land-experience/explorer";
import { MediaStage, ReadinessRegister, ScenarioSelector } from "@/components/land-experience/interactive";
import { DevelopmentModel } from "@/components/land-experience/model";
import { CadastreVerify } from "@/components/leasing/cadastre-verify";
import { LocationMap } from "@/components/location-section";
import { PageShell } from "@/components/page-shell";
import { Figure, R3Label } from "@/components/r3";
import { Icon } from "@/components/ui";
import { formatArea, type ProjectEntry } from "@/content/source";
import { company, contactLinks } from "@/data/demo-content";
import { publicView, type LandAsset, type Param, type ParamGroup } from "@/data/land/model";
import { moduleVisible } from "@/data/land/registry";
import { eCadastruPortal } from "@/data/property-trust";
import { isProductionEdition, localePath, numberLocale, publicAsset, type SiteLocale } from "@/lib/site-data";

/**
 * THE LAND DEVELOPMENT & INVESTMENT EXPERIENCE — master template of the MEGAPARC land portfolio (OWNER STRATEGIC MANDATE «DROCHIA ·
 * DEVELOPMENT & INVESTMENT EXPERIENCE», 2026-11-23). One component for every land asset: the page reads only the LandAsset
 * configuration (src/data/land/<slug>.ts). Order: HERO (positioning, the published facts, the media stage, three actions) → section
 * navigation → 01 Location Explorer (eight layers) → 02 market research → 03 development scenarios → 04 technical passport →
 * 05 development readiness register → 06 Development Calculator 2.0 → 07 deal structures → 08 Developer Pack → 09 technical assessment.
 * The OWNER preview shows the whole architecture (empty slots included); the public edition renders only approved modules (§15).
 */

const mail = (m: { subject: { ro: string; ru: string; en: string }; body: { ro: string; ru: string; en: string } }, locale: SiteLocale) => `${contactLinks.email}?subject=${encodeURIComponent(m.subject[locale])}&body=${encodeURIComponent(m.body[locale])}`;
const dateOf = (iso: string | null) => (iso ? iso.split("-").reverse().join(".") : "—");

export function LandExperiencePage({ locale, project, asset: full }: { locale: SiteLocale; project: ProjectEntry; asset: LandAsset }) {
  const preview = !isProductionEdition;
  const asset = publicView(full);
  const p = (path: string) => localePath(locale, path);
  const show = (k: Parameters<typeof moduleVisible>[1]) => moduleVisible(full, k, preview);
  const nf = new Intl.NumberFormat(numberLocale(locale), { maximumFractionDigits: 1 });
  const ha = `${(asset.area / 10000).toLocaleString(numberLocale(locale), { minimumFractionDigits: 1, maximumFractionDigits: 3 })}${locale === "ru" ? " га" : " ha"}`;
  const m2 = formatArea(asset.area, locale);
  const discuss = `${p("/contact")}?subject=partnership&property=${asset.slug}`;
  const directions = `https://www.google.com/maps/dir/?api=1&destination=${asset.geo.lat},${asset.geo.lon}`;
  const tour = asset.media.find((m) => m.key === "tour360")?.src ?? null;
  const number = asset.parcels[0]?.number;
  const value = (prm: Param) => {
    if (!prm.value) return null;
    if ("text" in prm.value) return prm.value.text[locale];
    const unit = { m2: locale === "ru" ? "м²" : "m²", ha: locale === "ru" ? "га" : "ha", m: locale === "ru" ? "м" : "m", pct: "%", floors: "", count: "", kw: locale === "ru" ? "кВт" : "kW", none: "" }[prm.value.unit];
    return `${nf.format(prm.value.n)}${unit ? ` ${unit}` : ""}`;
  };
  const nav = [
    show("explorer") && ["explorer", c.nav.explorer], show("market") && ["market", c.nav.market], show("scenarios") && ["scenarios", c.nav.scenarios], ["passport", c.nav.passport], ["readiness", c.nav.readiness],
    show("model") && ["model", c.nav.model], show("deals") && ["deals", c.nav.deals], show("pack") && ["pack", c.nav.pack],
  ].filter(Boolean) as [string, { ro: string; ru: string; en: string }][];

  return (
    <PageShell locale={locale} experience mainClassName={`lx-page lx-page--${asset.slug}`}>
      {/* HERO — positioning, the published facts, the media stage, the three actions */}
      <section className="lx-hero" aria-labelledby="lx-title">
        <div className="r3-shell lx-hero__grid">
          <div className="lx-hero__text">
            <Link href={p("/projects")} className="r3-back"><Icon name="left" size={14} /> {c.back[locale]}</Link>
            <R3Label>{asset.hero.kicker[locale]}</R3Label>
            <h1 className="lx-hero__name" id="lx-title">{asset.name}</h1>
            <p className="lx-hero__pos">{asset.hero.positioning[locale]}</p>
            <p className="lx-hero__statement">{asset.hero.statement[locale]}</p>
            <dl className="lx-hero__facts">
              <div className="is-area"><dt>{asset.facts[0].label[locale]}</dt><dd><Figure value={ha} /><span>{m2}</span></dd></div>
              {asset.facts.slice(1).map((f) => <div key={f.key}><dt>{f.label[locale]}</dt><dd translate={f.key === "cadastre" ? "no" : undefined}>{f.value[locale]}</dd></div>)}
            </dl>
            <p className="lx-hero__published"><i aria-hidden="true" />{asset.hero.published[locale]}</p>
            <p className="lx-hero__lead">{asset.hero.lead[locale]}</p>
            <div className="lx-actions">
              <a className="lx-btn lx-btn--dark" href="#explorer"><span>{c.explore[locale]}</span><Icon size={16} /></a>
              <a className="lx-btn lx-btn--grey" href="#model"><span>{c.evaluate[locale]}</span><Icon size={16} /></a>
              <Link className="lx-link" href={discuss}><span>{c.discuss[locale]}</span><Icon size={16} /></Link>
            </div>
          </div>
          <div className="lx-hero__media">
            <MediaStage locale={locale} preview={preview} slots={asset.media} map={<LocationMap locale={locale} mapKey={asset.slug} name={asset.name} place={asset.place[locale]} className="lx-hero__map" />} />
            <p className="lx-note">{asset.geo.point[locale]} · {asset.layers.find((l) => l.key === "boundary")?.text[locale]}</p>
          </div>
        </div>
        {preview ? <p className="r3-shell lx-preview">{c.preview[locale]}</p> : null}
      </section>

      <nav className="lx-nav" aria-label={c.navLabel[locale]}>
        <div className="r3-shell lx-nav__row">{nav.map(([id, label], i) => <a key={id} href={`#${id}`}><span>{String(i + 1).padStart(2, "0")}</span>{label[locale]}</a>)}</div>
      </nav>

      {/* 01 · LOCATION EXPLORER */}
      {show("explorer") ? (
        <section className="r3-sec r3-sec--ivory lx-sec" id="explorer">
          <div className="r3-shell">
            <div className="r3-head r3-head--split" data-reveal>
              <R3Label>{c.p1[locale]}</R3Label>
              <h2 className="r3-title">{c.p1title[locale]}</h2>
              <p className="r3-lead">{c.p1lead[locale]}</p>
            </div>
            <LandExplorer locale={locale} data={{ ...asset.explorer, base: publicAsset(asset.explorer.base) }} layers={asset.layers} distances={asset.distances} indicators={asset.market.indicators} boundary={asset.geo.boundary?.coords ?? null} tour={tour} preview={preview} directions={directions} />
          </div>
        </section>
      ) : null}

      {/* 02 · MARKET RESEARCH */}
      {show("market") ? (
        <section className="r3-sec r3-sec--paper lx-sec lx-market" id="market">
          <div className="r3-shell">
            <div className="r3-head r3-head--split" data-reveal>
              <R3Label>{c.p2[locale]}</R3Label>
              <h2 className="r3-title">{c.p2title[locale]}</h2>
              <p className="r3-lead">{c.p2lead[locale]}</p>
            </div>
            <div className="lx-market__grid">
              <div className="lx-market__conclusion" data-reveal>
                <p className="lx-market__k">{c.conclusion[locale]}</p>
                <p className="lx-market__summary">{asset.market.summary[locale]}</p>
                <div className="lx-market__gaps">
                  <p className="lx-market__k">{c.gaps[locale]}</p>
                  <p>{c.gapsText[locale]}</p>
                </div>
                <a className="lx-link" href={mail(mailCopy.research, locale)}><span>{c.detail[locale]}</span><Icon size={16} /></a>
              </div>
              <div className="lx-market__data">
                <ul className="lx-ind">
                  {asset.market.indicators.filter((i) => i.display === "figure").map((i) => (
                    <li key={i.key} className={`lx-ind__card is-${i.nature.toLowerCase()}`} data-reveal>
                      <span className="lx-ind__label">{i.label[locale]}</span>
                      <span className="lx-ind__value">{i.value[locale]}</span>
                      {i.note ? <span className="lx-ind__note">{i.note[locale]}</span> : null}
                      <span className="lx-ind__meta"><b className={`lx-chip is-${i.nature.toLowerCase()}`}>{natureCopy[i.nature][locale]}</b>{confidenceCopy[i.confidence][locale]}</span>
                      <span className="lx-ind__src">{i.url ? <a href={i.url} target="_blank" rel="noopener noreferrer">{i.source}</a> : i.source} · {i.refDate} · {i.method[locale]}</span>
                    </li>
                  ))}
                </ul>
                <dl className="lx-facts">
                  {asset.market.indicators.filter((i) => i.display === "text").map((i) => (
                    <div key={i.key} data-reveal>
                      <dt>{i.label[locale]}</dt>
                      <dd>
                        <span className="lx-facts__text">{i.value[locale]}</span>
                        <span className="lx-ind__src"><b className={`lx-chip is-${i.nature.toLowerCase()}`}>{natureCopy[i.nature][locale]}</b>{i.url ? <a href={i.url} target="_blank" rel="noopener noreferrer">{i.source}</a> : i.source} · {i.refDate} · {confidenceCopy[i.confidence][locale]}</span>
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {/* 03 · DEVELOPMENT SCENARIOS */}
      {show("scenarios") ? (
        <section className="r3-sec r3-sec--ivory lx-sec" id="scenarios">
          <div className="r3-shell">
            <div className="r3-head r3-head--split" data-reveal>
              <R3Label>{c.p3[locale]}</R3Label>
              <h2 className="r3-title">{c.p3title[locale]}</h2>
              <p className="r3-lead">{c.p3lead[locale]}</p>
            </div>
            <ScenarioSelector locale={locale} scenarios={asset.scenarios} preview={preview} />
            <p className="lx-disclaimer" data-reveal>{c.scenDisclaimer[locale]}</p>
          </div>
        </section>
      ) : null}

      {/* 04 · TECHNICAL PASSPORT */}
      <section className="r3-sec r3-sec--paper lx-sec lx-pass" id="passport">
        <div className="r3-shell">
          <div className="r3-head r3-head--split" data-reveal>
            <R3Label>{c.p4[locale]}</R3Label>
            <h2 className="r3-title">{c.p4title[locale]}</h2>
            <p className="r3-lead">{c.p4lead[locale]}</p>
          </div>
          <div className="lx-pass__groups">
            {(["land", "geometry", "planning", "utilities"] as ParamGroup[]).map((g) => (
              <section key={g} className="lx-pass__group" aria-label={c.groups[g][locale]} data-reveal>
                <h3 className="lx-pass__title">{c.groups[g][locale]}</h3>
                <table className="lx-pass__table">
                  <thead><tr><th>{c.col.param[locale]}</th><th>{c.col.value[locale]}</th><th>{c.col.status[locale]}</th><th>{c.col.source[locale]}</th><th>{c.col.doc[locale]} · {c.col.who[locale]}</th></tr></thead>
                  <tbody>
                    {asset.passport.filter((x) => x.group === g).map((x) => (
                      <tr key={x.key} className={`is-${x.status.toLowerCase()}`}>
                        <th scope="row">{x.label[locale]}</th>
                        <td className={`lx-pass__value${x.value ? "" : " is-empty"}`} data-label={c.col.value[locale]}>{value(x) ?? <span className="lx-pass__none" aria-label={registerCopy[x.status][locale]}>—</span>}</td>
                        <td data-label={c.col.status[locale]}><span className={`lx-status is-${x.status.toLowerCase()}`}><i aria-hidden="true" />{registerCopy[x.status][locale]}</span></td>
                        <td className={`lx-pass__src${x.source ? "" : " is-empty"}`} data-label={c.col.source[locale]}>{x.source ? `${x.source[locale]} · ${dateOf(x.checked)}` : "—"}</td>
                        <td className="lx-pass__doc" data-label={c.col.doc[locale]}>{x.document[locale]} · {roleCopy[x.owner][locale]}{x.note ? <span className="lx-pass__note">{x.note[locale]}</span> : null}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </section>
            ))}
          </div>
          <div className="lx-pass__cad" data-reveal>
            <p className="lx-pass__cad-area"><span>{c.facts[locale]}</span><Figure value={m2} /></p>
            {number ? <CadastreVerify number={number} portal={eCadastruPortal} locale={locale} /> : <CadastreVerify pending portal={eCadastruPortal} locale={locale} />}
          </div>
        </div>
      </section>

      {/* 05 · DEVELOPMENT READINESS REGISTER */}
      <section className="r3-sec r3-sec--ink lx-sec lx-readysec" id="readiness">
        <div className="r3-shell">
          <div className="r3-head r3-head--split r3-head--light" data-reveal>
            <R3Label tone="light">{c.p5[locale]}</R3Label>
            <h2 className="r3-title">{c.p5title[locale]}</h2>
            <p className="r3-lead">{c.p5lead[locale]}</p>
          </div>
          <ReadinessRegister locale={locale} items={asset.readiness} />
        </div>
      </section>

      {/* 06 · DEVELOPMENT CALCULATOR 2.0 */}
      {show("model") ? (
        <section className="r3-sec r3-sec--ivory lx-sec lx-modelsec" id="model" data-visitor-model="land">
          <div className="r3-shell">
            <div className="r3-head r3-head--split" data-reveal>
              <R3Label>{c.p6[locale]}</R3Label>
              <h2 className="r3-title">{c.p6title[locale]}</h2>
              <p className="r3-lead">{c.p6lead[locale]}</p>
            </div>
            <DevelopmentModel locale={locale} siteArea={asset.area} presets={asset.presets} />
          </div>
        </section>
      ) : null}

      {/* 07 · DEAL STRUCTURES */}
      {show("deals") ? (
        <section className="r3-sec r3-sec--paper lx-sec lx-deals" id="deals">
          <div className="r3-shell">
            <div className="r3-head" data-reveal>
              <R3Label>{c.p7[locale]}</R3Label>
              <h2 className="r3-title">{c.p7title[locale]}</h2>
            </div>
            <ol className="lx-deals__list">
              {asset.deals.filter((d) => d.enabled).map((d, i) => (
                <li key={d.key} className="lx-deals__item" data-reveal>
                  <span className="lx-deals__no">{String(i + 1).padStart(2, "0")}</span>
                  <span className={`lx-chip ${d.agreed ? "is-fact" : "is-estimate"}`}>{(d.agreed ? c.agreed : c.possible)[locale]}</span>
                  <h3 className="lx-deals__title">{d.title[locale]}</h3>
                  <p className="lx-deals__text">{d.text[locale]}</p>
                  <p className="lx-deals__suits"><span>{c.suits[locale]}:</span> {d.suits[locale]}</p>
                </li>
              ))}
            </ol>
            <p className="lx-disclaimer" data-reveal>{c.dealNote[locale]}</p>
          </div>
        </section>
      ) : null}

      {/* 08 · DEVELOPER PACK */}
      {show("pack") ? (
        <section className="r3-sec lx-sec lx-pack" id="pack">
          <div className="r3-shell lx-pack__grid">
            <div data-reveal>
              <R3Label tone="light">{c.p8[locale]}</R3Label>
              <h2 className="r3-title">{c.p8title[locale]}</h2>
              <p className="r3-lead">{c.p8lead[locale]}</p>
              <div className="lx-actions">
                <a className="lx-btn lx-btn--light" href={mail(mailCopy.pack, locale)}><span>{c.requestPack[locale]}</span><Icon size={16} /></a>
                <a className="lx-link lx-link--light" href={contactLinks.mobile}><span>{c.call[locale]} · {company.mobile.value[locale]}</span><Icon size={16} /></a>
              </div>
              <p className="lx-pack__pdf">{c.pdfNote[locale]}</p>
            </div>
            <ul className="lx-pack__list" data-reveal>
              {asset.pack.map((d) => (
                <li key={d.key} className={`is-${d.state}`}>
                  <span>{d.label[locale]}</span>
                  {d.file ? <a href={d.file[locale]} className="lx-pack__file">PDF</a> : <em>{(d.state === "ready" ? c.ready : d.state === "na" ? c.na : c.preparing)[locale]}</em>}
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      {/* 09 · TECHNICAL ASSESSMENT — Technical Director + Architect; no promised approvals */}
      <section className="r3-sec r3-sec--stone lx-sec lx-team" id="technical-support">
        <div className="r3-shell">
          <div className="r3-head" data-reveal>
            <R3Label>{c.p9[locale]}</R3Label>
            <h2 className="r3-title">{c.p9title[locale]}</h2>
          </div>
          <p className="r3-trust__principle" data-reveal>{c.p9lead[locale]}</p>
          <ol className="r3-trust__list lx-team__list" data-reveal>{c.team.map((x) => <li key={x.en}>{x[locale]}</li>)}</ol>
          <div className="lx-actions" data-reveal>
            <Link className="lx-btn lx-btn--dark" href={discuss}><span>{c.discuss[locale]}</span><Icon size={16} /></Link>
            <a className="lx-link" href={contactLinks.email}><span>{company.email.value[locale]}</span><Icon size={16} /></a>
          </div>
          <p className="r3-note" data-reveal>{c.p9note[locale]}</p>
          <p className="lx-updated">{project.name} · {dateOf(asset.updated)}</p>
        </div>
      </section>
    </PageShell>
  );
}
