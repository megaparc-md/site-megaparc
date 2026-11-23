import Link from "next/link";
import "@/app/land-experience.css";
import { c, confidenceCopy, directionsWord, mailCopy, natureCopy, registerCopy, roleCopy } from "@/components/land-experience/copy";
import { LandExplorer } from "@/components/land-experience/explorer";
import { MediaStage, ReadinessRegister, ScenarioSelector } from "@/components/land-experience/interactive";
import { DevelopmentModel } from "@/components/land-experience/model";
import { CadastreVerify } from "@/components/leasing/cadastre-verify";
import { PageShell } from "@/components/page-shell";
import { Figure, R3Label } from "@/components/r3";
import { Icon } from "@/components/ui";
import { formatArea, type ProjectEntry } from "@/content/source";
import { company, contactLinks } from "@/data/demo-content";
import { publicView, type LandAsset, type Param, type ParamGroup, type ReadinessItem, type Register } from "@/data/land/model";
import { moduleVisible } from "@/data/land/registry";
import { eCadastruPortal } from "@/data/property-trust";
import { isProductionEdition, localePath, numberLocale, publicAsset, type SiteLocale } from "@/lib/site-data";

/**
 * THE LAND DEVELOPMENT & INVESTMENT EXPERIENCE — master template of the MEGAPARC land portfolio (OWNER STRATEGIC MANDATE «DROCHIA ·
 * DEVELOPMENT & INVESTMENT EXPERIENCE», 2026-11-23; R2 «Commercial Simplification & Financial Integrity», same day). One component for
 * every land asset: the page reads only the LandAsset configuration (src/data/land/<slug>.ts, built with createLandAsset).
 *
 * R2 order — the page sells the opportunity first, the technical report is one click away: HERO (positioning, the published facts, the
 * site map, three actions) → WHY THIS SITE (verified arguments) → section navigation → 01 Location Explorer → 02 market research (the
 * conclusion and the figures; the detailed results open on demand) → 03 development scenarios (the details fold on phones) →
 * 04 Development Calculator 2.0 → 05 deal structures (the priority formats lead) → 06 site data and readiness (a compact summary; the
 * full technical passport and the readiness register open on demand) → 07 Developer Pack → 08 technical assessment. Nothing of R1 is
 * removed — every row, layer, indicator and check is still on the page. The OWNER preview shows the whole architecture (empty slots
 * included); the public edition renders only approved modules (§15).
 */

const dateOf = (iso: string | null) => (iso ? iso.split("-").reverse().join(".") : "—");
const REG: Register[] = ["DOCUMENTED", "VERIFYING", "TO_OBTAIN", "NOT_APPLICABLE"];
/** the first steps of the register, in the order a developer needs them (title → planning → utilities); the rest stays in the register */
const FIRST_STEPS = ["extract", "plan", "certificate", "pug", "tu-power", "topo"];

/** the site on the explorer's own OpenStreetMap base (the same frame as the explorer and the Developer Pack — one point everywhere) */
function SiteMap({ asset, locale }: { asset: LandAsset; locale: SiteLocale }) {
  const { frame, site } = asset.explorer;
  return (
    <svg className="lx-hmap" viewBox={`0 0 ${frame.w} ${frame.h}`} preserveAspectRatio="xMidYMid slice" role="img" aria-label={`${asset.name} · ${asset.geo.point[locale]}`}>
      <image href={publicAsset(asset.explorer.base)} x="0" y="0" width={frame.w} height={frame.h} preserveAspectRatio="xMidYMid slice" />
      <g transform={`translate(${site.x} ${site.y})`}>
        <circle r="34" className="lx-ex__site-halo" />
        <circle r="12" className="lx-ex__site-dot" />
        <text y="-46" textAnchor="middle" className="lx-ex__site-name">{asset.name}</text>
      </g>
    </svg>
  );
}

export function LandExperiencePage({ locale, project, asset: full }: { locale: SiteLocale; project: ProjectEntry; asset: LandAsset }) {
  const preview = !isProductionEdition;
  const asset = publicView(full);
  const p = (path: string) => localePath(locale, path);
  const show = (k: Parameters<typeof moduleVisible>[1]) => moduleVisible(full, k, preview);
  const nf = new Intl.NumberFormat(numberLocale(locale), { maximumFractionDigits: 1 });
  const ha = `${(asset.area / 10000).toLocaleString(numberLocale(locale), { minimumFractionDigits: 1, maximumFractionDigits: 3 })}${locale === "ru" ? " га" : " ha"}`;
  const m2 = formatArea(asset.area, locale);
  const discuss = `${p("/contact")}?subject=partnership&property=${asset.slug}`;
  const directions = `https://www.google.com/maps/dir/?api=1&destination=${asset.geo.lat},${asset.geo.lon}`;
  const tour = asset.media.find((m) => m.key === "tour360")?.src ?? null;
  const number = asset.parcels[0]?.number;
  const fill = (s: string) => s.replaceAll("{name}", asset.name).replaceAll("{address}", asset.address[locale]).replaceAll("{place}", asset.place[locale]);
  const mail = (m: (typeof mailCopy)["pack"]) => `${contactLinks.email}?subject=${encodeURIComponent(fill(m.subject[locale]))}&body=${encodeURIComponent(fill(m.body[locale]))}`;
  const value = (prm: Param) => {
    if (!prm.value) return null;
    if ("text" in prm.value) return prm.value.text[locale];
    const unit = { m2: locale === "ru" ? "м²" : "m²", ha: locale === "ru" ? "га" : "ha", m: locale === "ru" ? "м" : "m", pct: "%", floors: "", count: "", kw: locale === "ru" ? "кВт" : "kW", none: "" }[prm.value.unit];
    return `${nf.format(prm.value.n)}${unit ? ` ${unit}` : ""}`;
  };
  const nav = [
    show("explorer") && ["explorer", c.nav.explorer], show("market") && ["market", c.nav.market], show("scenarios") && ["scenarios", c.nav.scenarios],
    show("model") && ["model", c.nav.model], show("deals") && ["deals", c.nav.deals], ["technical", c.nav.technical], show("pack") && ["pack", c.nav.pack],
  ].filter(Boolean) as [string, { ro: string; ru: string; en: string }][];

  // 06 · the compact summary of the passport and the register
  const known = asset.passport.filter((x) => x.value);
  const count = <T extends { status: Register }>(rows: T[]) => REG.map((st) => [st, rows.filter((x) => x.status === st).length] as const).filter(([, n]) => n > 0);
  const firstSteps = FIRST_STEPS.map((k) => asset.readiness.find((r) => r.key === k)).filter((r): r is ReadinessItem => !!r && r.status === "TO_OBTAIN");
  const textFacts = asset.market.indicators.filter((i) => i.display === "text");
  const primary = asset.deals.filter((d) => d.enabled && d.priority === "primary");
  const others = asset.deals.filter((d) => d.enabled && d.priority !== "primary");

  return (
    <PageShell locale={locale} experience mainClassName={`lx-page lx-page--${asset.slug}`}>
      {/* HERO — positioning, the published facts, the site map, the three actions */}
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
            <MediaStage locale={locale} preview={preview} slots={asset.media} map={<SiteMap asset={asset} locale={locale} />} />
            <p className="lx-note">{asset.geo.point[locale]} · {asset.layers.find((l) => l.key === "boundary")?.text[locale]}</p>
          </div>
        </div>
        {preview ? <p className="r3-shell lx-preview">{c.preview[locale]}</p> : null}
      </section>

      {/* WHY THIS SITE — verified arguments only */}
      {asset.arguments.length ? (
        <section className="lx-why" aria-label={c.why[locale]}>
          <div className="r3-shell">
            <ul className="lx-why__list">
              {asset.arguments.map((a) => (
                <li key={a.key} className="lx-why__item" data-reveal>
                  <p className="lx-why__title">{a.title[locale]}</p>
                  <p className="lx-why__text">{a.text[locale]}</p>
                  <p className="lx-why__src"><b className={`lx-chip is-${a.nature.toLowerCase()}`}>{natureCopy[a.nature][locale]}</b>{a.source[locale]}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

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
            <LandExplorer locale={locale} name={asset.name} townGen={asset.townGen} data={{ ...asset.explorer, base: publicAsset(asset.explorer.base) }} layers={asset.layers} distances={asset.distances} indicators={asset.market.indicators} boundary={asset.geo.boundary?.coords ?? null} tour={tour} preview={preview} directions={directions} />
          </div>
        </section>
      ) : null}

      {/* 02 · MARKET RESEARCH — the conclusion and the figures; the detailed results open on demand */}
      {show("market") ? (
        <section className="r3-sec r3-sec--paper lx-sec lx-market" id="market">
          <div className="r3-shell">
            <div className="r3-head r3-head--split" data-reveal>
              <R3Label>{c.p2[locale]}</R3Label>
              <h2 className="r3-title">{fill(c.p2title[locale])}</h2>
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
                <a className="lx-link" href={mail(mailCopy.research)}><span>{c.detail[locale]}</span><Icon size={16} /></a>
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
                {textFacts.length ? (
                  <details className="lx-fold">
                    <summary><span>{c.researchMore[locale]}</span><em>{textFacts.length} {c.researchCount[locale]}</em></summary>
                    <dl className="lx-mfacts">
                      {textFacts.map((i) => (
                        <div key={i.key}>
                          <dt>{i.label[locale]}</dt>
                          <dd>
                            <span className="lx-mfacts__text">{i.value[locale]}</span>
                            <span className="lx-ind__src"><b className={`lx-chip is-${i.nature.toLowerCase()}`}>{natureCopy[i.nature][locale]}</b>{i.url ? <a href={i.url} target="_blank" rel="noopener noreferrer">{i.source}</a> : i.source} · {i.refDate} · {confidenceCopy[i.confidence][locale]}</span>
                          </dd>
                        </div>
                      ))}
                    </dl>
                  </details>
                ) : null}
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
              <h2 className="r3-title">{c.p3title[locale].replace("{n}", directionsWord(asset.scenarios.length, locale))}</h2>
              <p className="r3-lead">{c.p3lead[locale]}</p>
            </div>
            <ScenarioSelector locale={locale} scenarios={asset.scenarios} preview={preview} />
            <p className="lx-disclaimer" data-reveal>{c.scenDisclaimer[locale]}</p>
          </div>
        </section>
      ) : null}

      {/* 04 · DEVELOPMENT CALCULATOR 2.0 */}
      {show("model") ? (
        <section className="r3-sec r3-sec--paper lx-sec lx-modelsec" id="model" data-visitor-model="land">
          <div className="r3-shell">
            <div className="r3-head r3-head--split" data-reveal>
              <R3Label>{c.p6[locale]}</R3Label>
              <h2 className="r3-title">{c.p6title[locale]}</h2>
              <p className="r3-lead">{c.p6lead[locale]}</p>
            </div>
            <DevelopmentModel locale={locale} siteArea={asset.area} presets={asset.presets} mailto={contactLinks.email} place={asset.name} />
          </div>
        </section>
      ) : null}

      {/* 05 · DEAL STRUCTURES — the priority formats lead; the others are discussed individually; never a term, a price or a commitment */}
      {show("deals") ? (
        <section className="r3-sec r3-sec--ivory lx-sec lx-deals" id="deals">
          <div className="r3-shell">
            <div className="r3-head" data-reveal>
              <R3Label>{c.p7[locale]}</R3Label>
              <h2 className="r3-title">{c.p7title[locale]}</h2>
            </div>
            {primary.length ? (
              <>
                <p className="lx-deals__k">{c.dealPrimary[locale]}</p>
                <ol className="lx-deals__list lx-deals__list--primary">
                  {primary.map((d, i) => (
                    <li key={d.key} className="lx-deals__item is-primary" data-reveal>
                      <span className="lx-deals__no">{String(i + 1).padStart(2, "0")}</span>
                      <span className={`lx-chip ${d.agreed ? "is-fact" : "is-estimate"}`}>{(d.agreed ? c.agreed : c.possible)[locale]}</span>
                      <h3 className="lx-deals__title">{d.title[locale]}</h3>
                      <p className="lx-deals__text">{d.text[locale]}</p>
                      <p className="lx-deals__suits"><span>{c.suits[locale]}:</span> {d.suits[locale]}</p>
                    </li>
                  ))}
                </ol>
              </>
            ) : null}
            {others.length ? (
              <>
                <p className="lx-deals__k">{(primary.length ? c.dealOthers : c.p7title)[locale]}</p>
                <ul className="lx-deals__rows">
                  {others.map((d) => (
                    <li key={d.key} data-reveal>
                      <h3 className="lx-deals__row-t">{d.title[locale]}</h3>
                      <p className="lx-deals__row-text">{d.text[locale]} <span>{c.suits[locale]}: {d.suits[locale]}</span></p>
                      <span className="lx-chip is-estimate">{(d.agreed ? c.agreed : c.dealIndividual)[locale]}</span>
                    </li>
                  ))}
                </ul>
              </>
            ) : null}
            <p className="lx-disclaimer" data-reveal>{c.dealNote[locale]}</p>
          </div>
        </section>
      ) : null}

      {/* 06 · SITE DATA AND READINESS — the summary; the full technical passport and the readiness register open on demand */}
      <section className="r3-sec r3-sec--paper lx-sec lx-tech" id="technical">
        <div className="r3-shell">
          <div className="r3-head r3-head--split" data-reveal>
            <R3Label>{c.pTech[locale]}</R3Label>
            <h2 className="r3-title">{c.pTechTitle[locale]}</h2>
            <p className="r3-lead">{c.pTechLead[locale]}</p>
          </div>
          <div className="lx-tech__grid" data-reveal>
            <div className="lx-tech__col">
              <p className="lx-tech__k">{c.known[locale]}</p>
              <ul className="lx-tech__known">
                {known.map((x) => (
                  <li key={x.key}><span>{x.label[locale]}</span><b>{value(x)}</b><span className={`lx-status is-${x.status.toLowerCase()}`}><i aria-hidden="true" />{registerCopy[x.status][locale]}</span></li>
                ))}
              </ul>
              {number ? <CadastreVerify number={number} portal={eCadastruPortal} locale={locale} /> : <CadastreVerify pending portal={eCadastruPortal} locale={locale} />}
            </div>
            <div className="lx-tech__col">
              <p className="lx-tech__k">{c.toGet[locale]}</p>
              <dl className="lx-tech__counts">
                <div><dt>{c.p4[locale]} · {asset.passport.length} {c.params[locale]}</dt><dd>{count(asset.passport).map(([st, n]) => <span key={st} className={`lx-status is-${st.toLowerCase()}`}><i aria-hidden="true" />{registerCopy[st][locale]} <b>{n}</b></span>)}</dd></div>
                <div><dt>{c.p5[locale]} · {asset.readiness.length} {c.steps[locale]}</dt><dd>{count(asset.readiness).map(([st, n]) => <span key={st} className={`lx-status is-${st.toLowerCase()}`}><i aria-hidden="true" />{registerCopy[st][locale]} <b>{n}</b></span>)}</dd></div>
              </dl>
              {firstSteps.length ? (
                <>
                  <p className="lx-tech__k">{c.nextSteps[locale]}</p>
                  <ol className="lx-tech__steps">{firstSteps.map((r) => <li key={r.key}><b>{r.label[locale]}</b><span>{r.next[locale]} · {roleCopy[r.owner][locale]}</span></li>)}</ol>
                </>
              ) : null}
            </div>
          </div>

          <details className="lx-fold lx-fold--wide" id="passport">
            <summary><span>{c.p4[locale]}</span><em>{asset.passport.length} {c.params[locale]}</em></summary>
            <p className="lx-fold__lead">{c.p4lead[locale]}</p>
            <div className="lx-pass__groups">
              {(["land", "geometry", "planning", "utilities"] as ParamGroup[]).map((g) => (
                <section key={g} className="lx-pass__group" aria-label={c.groups[g][locale]}>
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
          </details>

          <details className="lx-fold lx-fold--wide" id="readiness">
            <summary><span>{c.p5[locale]}</span><em>{asset.readiness.length} {c.steps[locale]}</em></summary>
            <div className="lx-readysec lx-fold__dark">
              <p className="lx-fold__lead">{c.p5lead[locale]}</p>
              <ReadinessRegister locale={locale} items={asset.readiness} />
            </div>
          </details>
        </div>
      </section>

      {/* 07 · DEVELOPER PACK */}
      {show("pack") ? (
        <section className="r3-sec lx-sec lx-pack" id="pack">
          <div className="r3-shell lx-pack__grid">
            <div data-reveal>
              <R3Label tone="light">{c.p8[locale]}</R3Label>
              <h2 className="r3-title">{c.p8title[locale]}</h2>
              <p className="r3-lead">{c.p8lead[locale]}</p>
              <div className="lx-actions">
                <a className="lx-btn lx-btn--light" href={mail(mailCopy.pack)}><span>{c.requestPack[locale]}</span><Icon size={16} /></a>
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

      {/* 08 · TECHNICAL ASSESSMENT — Technical Director + Architect; no promised approvals */}
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
