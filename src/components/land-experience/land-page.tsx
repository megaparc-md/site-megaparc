import Link from "next/link";
import "@/app/land-experience.css";
import "@/app/land-r3.css";
import { c, confidenceCopy, directionsWord, mailCopy, natureCopy, registerCopy, roleCopy } from "@/components/land-experience/copy";
import { r3 } from "@/components/land-experience/copy-r3";
import { LandExplorer } from "@/components/land-experience/explorer";
import { ReadinessRegister, ScenarioSelector } from "@/components/land-experience/interactive";
import { DevelopmentModel } from "@/components/land-experience/model";
import { CadastreVerify } from "@/components/leasing/cadastre-verify";
import { PageShell } from "@/components/page-shell";
import { R3Label } from "@/components/r3";
import { Icon } from "@/components/ui";
import { formatArea, type ProjectEntry } from "@/content/source";
import { company, contactLinks } from "@/data/demo-content";
import { publicView, type LandAsset, type MarketChart, type Param, type ParamGroup, type ReadinessItem, type Register } from "@/data/land/model";
import { moduleVisible } from "@/data/land/registry";
import { eCadastruPortal } from "@/data/property-trust";
import { isProductionEdition, localePath, numberLocale, publicAsset, type SiteLocale } from "@/lib/site-data";

/**
 * THE LAND DEVELOPMENT & INVESTMENT EXPERIENCE — master template of the MEGAPARC land portfolio (OWNER STRATEGIC MANDATE «DROCHIA ·
 * DEVELOPMENT & INVESTMENT EXPERIENCE», 2026-11-23; R2 «Commercial Simplification & Financial Integrity»; R3 «Premium Commercial Art
 * Direction», 2026-11-24). One component for every land asset: the page reads only the LandAsset configuration.
 *
 * R3 — the page first makes the investor want the site, then gives the tools to check it:
 * HERO (full-bleed: the aerial photograph when it exists, until then the dark editorial map of the town with a soft approximate glow;
 * the name, «20 000 м² для новых возможностей», the large key figures, three actions; the aerial / film / 360° slots) → WHY (the verified
 * arguments as large figures) → 01 Location Explorer (unchanged tool; approximate area only) → 02 market in figures (large numbers,
 * bar charts; sources and limits folded) → 03 scenarios (the concept architecture of each format, captioned as concept) →
 * 04 investment model (Calculator 2.1 untouched) → 05 partnership «У нас есть земля. У вас — идея.» (Build-to-Suit and joint development
 * lead) → 06 site data and readiness (compact; passport and register folded) → 07 Developer Pack → the closing conversation.
 * Location rule (production hotfix + R3 §4): no site pin, no boundary, no radius, no exact distance from the site, no coordinate link.
 */

const dateOf = (iso: string | null) => (iso ? iso.split("-").reverse().join(".") : "—");
const REG: Register[] = ["DOCUMENTED", "VERIFYING", "TO_OBTAIN", "NOT_APPLICABLE"];
const FIRST_STEPS = ["extract", "plan", "certificate", "pug", "tu-power", "topo"];
/** the market figures shown large (the rest stays in the folded sources) */
const BIG_FIGURES = ["population-town", "population-district", "wage", "employees"];

/** one bar chart of the research: one measure, one axis, direct labels, the values also as a table (dataviz rules) */
function BarChart({ chart, locale }: { chart: MarketChart; locale: SiteLocale }) {
  const nf = new Intl.NumberFormat(numberLocale(locale), { maximumFractionDigits: 1 });
  const max = Math.max(...chart.bars.map((b) => b.value));
  const rowH = 48, labelW = 0, w = 360, top = 4, room = 92; // viewBox units ≈ CSS px at a 360 px column: the type stays legible
  const h = top + chart.bars.length * rowH;
  return (
    <figure className="r3x-chart" data-reveal>
      <figcaption className="r3x-chart__title">{chart.title[locale]}<span>{chart.unit[locale]}</span></figcaption>
      <svg className="r3x-chart__svg" viewBox={`0 0 ${w} ${h}`} role="img" aria-label={`${chart.title[locale]}: ${chart.bars.map((b) => `${b.label[locale]} ${nf.format(b.value)}`).join(", ")} ${chart.unit[locale]}`}>
        {chart.bars.map((b, i) => {
          const y = top + i * rowH;
          const bw = Math.max(6, ((w - labelW - room) * b.value) / max);
          return (
            <g key={b.label.en}>
              <title>{`${b.label[locale]}: ${nf.format(b.value)} ${chart.unit[locale]}`}</title>
              <text className="r3x-chart__label" x={labelW} y={y + 12}>{b.label[locale]}</text>
              <rect className={`r3x-chart__track`} x={labelW} y={y + 20} width={w - labelW - room} height="14" rx="4" />
              <rect className={`r3x-chart__bar${b.highlight ? " is-hl" : ""}`} x={labelW} y={y + 20} width={bw} height="14" rx="4" />
              <text className="r3x-chart__value" x={labelW + bw + 8} y={y + 32}>{nf.format(b.value)}</text>
            </g>
          );
        })}
      </svg>
      <p className="r3x-chart__src">{chart.source} · {chart.refDate}{chart.note ? ` · ${chart.note[locale]}` : ""}</p>
    </figure>
  );
}

export function LandExperiencePage({ locale, project, asset: full }: { locale: SiteLocale; project: ProjectEntry; asset: LandAsset }) {
  const preview = !isProductionEdition;
  const asset = publicView(full);
  const p = (path: string) => localePath(locale, path);
  const show = (k: Parameters<typeof moduleVisible>[1]) => moduleVisible(full, k, preview);
  const nf = new Intl.NumberFormat(numberLocale(locale), { maximumFractionDigits: 1 });
  const ha = `${(asset.area / 10000).toLocaleString(numberLocale(locale), { minimumFractionDigits: 1, maximumFractionDigits: 3 })}${locale === "ru" ? " га" : " ha"}`;
  const m2 = formatArea(asset.area, locale);
  const discuss = `${p("/contact")}?subject=partnership&property=${asset.slug}`;
  const media = (k: string) => asset.media.find((m) => m.key === k) ?? null;
  const aerial = media("aerial")?.src ?? null, film = media("film")?.src ?? null, tour = media("tour360")?.src ?? null;
  const heroImage = aerial ? publicAsset(aerial) : publicAsset(`/assets/land/${asset.slug}/hero-dark.webp`);
  const number = asset.parcels[0]?.number;
  const fill = (s: string) => s.replaceAll("{name}", asset.name).replaceAll("{address}", asset.address[locale]).replaceAll("{place}", asset.place[locale]);
  const mail = (m: (typeof mailCopy)["pack"]) => `${contactLinks.email}?subject=${encodeURIComponent(fill(m.subject[locale]))}&body=${encodeURIComponent(fill(m.body[locale]))}`;
  const value = (prm: Param) => {
    if (!prm.value) return null;
    if ("text" in prm.value) return prm.value.text[locale];
    const unit = { m2: locale === "ru" ? "м²" : "m²", ha: locale === "ru" ? "га" : "ha", m: locale === "ru" ? "м" : "m", pct: "%", floors: "", count: "", kw: locale === "ru" ? "кВт" : "kW", none: "" }[prm.value.unit];
    return `${nf.format(prm.value.n)}${unit ? ` ${unit}` : ""}`;
  };
  const nav = [
    show("explorer") && ["explorer", c.nav.explorer], show("market") && ["market", c.nav.market], show("scenarios") && ["scenarios", c.nav.scenarios],
    show("model") && ["model", c.nav.model], show("deals") && ["deals", c.nav.deals], ["technical", c.nav.technical], show("pack") && ["pack", c.nav.pack],
  ].filter(Boolean) as [string, { ro: string; ru: string; en: string }][];

  const known = asset.passport.filter((x) => x.value);
  const count = <T extends { status: Register }>(rows: T[]) => REG.map((st) => [st, rows.filter((x) => x.status === st).length] as const).filter(([, n]) => n > 0);
  const firstSteps = FIRST_STEPS.map((k) => asset.readiness.find((r) => r.key === k)).filter((r): r is ReadinessItem => !!r && r.status === "TO_OBTAIN");
  const textFacts = asset.market.indicators.filter((i) => i.display === "text");
  const figures = BIG_FIGURES.map((k) => asset.market.indicators.find((i) => i.key === k)).filter((i): i is NonNullable<typeof i> => !!i);
  const otherFigures = asset.market.indicators.filter((i) => i.display === "figure" && !BIG_FIGURES.includes(i.key));
  const primary = asset.deals.filter((d) => d.enabled && d.priority === "primary");
  const others = asset.deals.filter((d) => d.enabled && d.priority !== "primary");
  // the road fronts come from the configuration (the figure of the «roads» argument), never typed in the template
  const roadsFigure = asset.arguments.find((x) => x.key === "roads")?.figure?.[locale] ?? null;
  const kpis: [string, string][] = [
    [m2, r3.kpi.area[locale]],
    ...(roadsFigure ? [[roadsFigure, r3.kpi.roads[locale]] as [string, string]] : []),
    [String(asset.scenarios.length), r3.kpi.scenarios[locale]],
    [String(asset.deals.filter((d) => d.enabled).length), r3.kpi.deals[locale]],
  ];

  return (
    <PageShell locale={locale} variant="overlay" experience mainClassName={`lx-page r3x-page lx-page--${asset.slug}`}>
      {/* HERO — full bleed: the aerial photograph when it exists; until then the dark editorial map with a soft approximate glow */}
      <section className={`r3x-hero${aerial ? " has-photo" : " is-map"}`} aria-labelledby="lx-title">
        <div className="r3x-hero__bg" aria-hidden="true">
          {/* eslint-disable-next-line @next/next/no-img-element -- static export */}
          <img className="r3x-hero__img" src={heroImage} alt="" decoding="async" fetchPriority="high" />
          {aerial ? null : <span className="r3x-hero__glow" />}
          <span className="r3x-hero__shade" />
        </div>
        <div className="r3-shell r3x-hero__inner">
          <Link href={p("/projects")} className="r3x-back"><Icon name="left" size={14} /> {c.back[locale]}</Link>
          <p className="r3x-kicker">{`${r3.heroKicker[locale]} · ${asset.place[locale]}`.replaceAll(" · ", "\u00a0· ")}</p>
          <h1 className="r3x-hero__name" id="lx-title">{asset.name}</h1>
          <p className="r3x-hero__statement">{asset.hero.statement[locale]}</p>
          <p className="r3x-hero__lead">{asset.hero.lead[locale]}</p>
          <div className="r3x-actions">
            <Link className="r3x-btn r3x-btn--light" href={discuss}><span>{c.discuss[locale]}</span><Icon size={16} /></Link>
            <a className="r3x-btn r3x-btn--ghost" href="#model"><span>{c.evaluate[locale]}</span><Icon size={16} /></a>
            <a className="r3x-link" href="#explorer"><span>{c.explore[locale]}</span><Icon size={16} /></a>
          </div>
          <dl className="r3x-kpis">
            {kpis.map(([v, l]) => <div key={l}><dt>{l}</dt><dd>{v}</dd></div>)}
          </dl>
          <p className="r3x-hero__note"><i aria-hidden="true" />{asset.hero.published[locale]} {aerial ? "" : r3.mapCaption[locale]}</p>
          {film || tour ? (
            <p className="r3x-media">
              {film ? <a className="r3x-media__item is-on" href={publicAsset(film)}>{r3.media.film[locale]} · {r3.media.watch[locale]}</a> : null}
              {tour ? <a className="r3x-media__item is-on" href={tour}>{r3.media.tour[locale]}</a> : null}
            </p>
          ) : preview ? (
            <p className="r3x-media" aria-label={r3.media.title[locale]}>
              {(["aerial", "film", "tour"] as const).map((k) => <span key={k} className="r3x-media__item">{r3.media[k][locale]} · {r3.media.soon[locale]}</span>)}
            </p>
          ) : null}
        </div>
        {preview ? <p className="r3-shell r3x-preview">{c.preview[locale]}</p> : null}
      </section>

      {/* WHY — the verified arguments as large figures */}
      {asset.arguments.length ? (
        <section className="r3x-why" aria-label={r3.why.kicker[locale]}>
          <div className="r3-shell">
            <ul className="r3x-why__list">
              {asset.arguments.map((a, i) => (
                <li key={a.key} className="r3x-why__item" data-reveal style={{ transitionDelay: `${i * 80}ms` }}>
                  {a.figure ? <p className="r3x-why__fig">{a.figure[locale]}</p> : null}
                  <p className="r3x-why__title">{a.title[locale]}</p>
                  <p className="r3x-why__text">{a.text[locale]}</p>
                  <p className="r3x-why__src"><b className={`lx-chip is-${a.nature.toLowerCase()}`}>{natureCopy[a.nature][locale]}</b>{a.source[locale]}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      <nav className="lx-nav" aria-label={c.navLabel[locale]}>
        <div className="r3-shell lx-nav__row">{nav.map(([id, label], i) => <a key={id} href={`#${id}`}><span>{String(i + 1).padStart(2, "0")}</span>{label[locale]}</a>)}</div>
      </nav>

      {/* 01 · LOCATION EXPLORER — the tool unchanged; an approximate area, no pin, no radius, no distance from the site */}
      {show("explorer") ? (
        <section className="r3-sec r3-sec--ivory lx-sec r3x-sec" id="explorer">
          <div className="r3-shell">
            <div className="r3x-head" data-reveal>
              <R3Label>{c.p1[locale]}</R3Label>
              <h2 className="r3x-title">{c.p1title[locale]}</h2>
              <p className="r3x-lead">{c.p1lead[locale]}</p>
            </div>
            <LandExplorer locale={locale} name={asset.name} townGen={asset.townGen} areaLabel={c.areaLabel[locale]} data={{ ...asset.explorer, base: publicAsset(asset.explorer.base) }} layers={asset.layers} distances={asset.distances} indicators={asset.market.indicators} boundary={asset.geo.boundary?.coords ?? null} tour={tour} preview={preview} />
          </div>
        </section>
      ) : null}

      {/* 02 · MARKET IN FIGURES — large numbers, bar charts; the sources and the limits folded */}
      {show("market") ? (
        <section className="r3-sec r3-sec--paper lx-sec r3x-sec r3x-market" id="market">
          <div className="r3-shell">
            <div className="r3x-head" data-reveal>
              <R3Label>{r3.market.kicker[locale]}</R3Label>
              <h2 className="r3x-title">{fill(r3.market.title[locale])}</h2>
              <p className="r3x-lead">{asset.market.summary[locale]}</p>
            </div>
            <dl className="r3x-figs">
              {figures.map((i) => (
                <div key={i.key} data-reveal>
                  <dt>{i.label[locale]}</dt>
                  <dd>{i.value[locale]}</dd>
                  {i.note ? <span>{i.note[locale]}</span> : null}
                </div>
              ))}
            </dl>
            {asset.market.charts?.length ? (
              <div className="r3x-charts">{asset.market.charts.map((ch) => <BarChart key={ch.key} chart={ch} locale={locale} />)}</div>
            ) : null}
            <details className="lx-fold r3x-fold">
              <summary><span>{r3.market.sources[locale]}</span><em>{asset.market.indicators.length} {c.researchCount[locale]}</em></summary>
              <dl className="lx-mfacts">
                {[...figures, ...otherFigures, ...textFacts].map((i) => (
                  <div key={i.key}>
                    <dt>{i.label[locale]}</dt>
                    <dd>
                      <span className="lx-mfacts__text">{i.value[locale]}{i.note ? ` · ${i.note[locale]}` : ""}</span>
                      <span className="lx-ind__src"><b className={`lx-chip is-${i.nature.toLowerCase()}`}>{natureCopy[i.nature][locale]}</b>{i.url ? <a href={i.url} target="_blank" rel="noopener noreferrer">{i.source}</a> : i.source} · {i.refDate} · {i.method[locale]} · {confidenceCopy[i.confidence][locale]}</span>
                    </dd>
                  </div>
                ))}
              </dl>
              <p className="lx-fold__lead">{c.gaps[locale]}: {c.gapsText[locale]}</p>
              <p><a className="lx-link" href={mail(mailCopy.research)}><span>{c.detail[locale]}</span><Icon size={16} /></a></p>
            </details>
          </div>
        </section>
      ) : null}

      {/* 03 · DEVELOPMENT SCENARIOS — the concept architecture of each format (captioned as concept, never the site or a project) */}
      {show("scenarios") ? (
        <section className="r3-sec lx-sec r3x-sec r3x-scen" id="scenarios">
          <div className="r3-shell">
            <div className="r3x-head r3x-head--light" data-reveal>
              <R3Label tone="light">{r3.scenarios.kicker[locale]}</R3Label>
              <h2 className="r3x-title">{c.p3title[locale].replace("{n}", directionsWord(asset.scenarios.length, locale))}</h2>
              <p className="r3x-lead">{c.p3lead[locale]}</p>
            </div>
            <ScenarioSelector locale={locale} scenarios={asset.scenarios.map((s) => ({ ...s, concept: s.concept ? publicAsset(s.concept) : null }))} preview={preview} conceptCaption={r3.scenarios.concept[locale]} />
            <p className="r3x-disclaimer" data-reveal>{c.scenDisclaimer[locale]}</p>
          </div>
        </section>
      ) : null}

      {/* 04 · INVESTMENT MODEL — Development Calculator 2.1 untouched (independent audit); only the section around it is composed */}
      {show("model") ? (
        <section className="r3-sec r3-sec--paper lx-sec lx-modelsec r3x-sec r3x-model" id="model" data-visitor-model="land">
          <div className="r3-shell">
            <div className="r3x-head" data-reveal>
              <R3Label>{r3.model.kicker[locale]}</R3Label>
              <h2 className="r3x-title">{c.p6title[locale]}</h2>
              <p className="r3x-lead">{c.p6lead[locale]}</p>
            </div>
            <DevelopmentModel locale={locale} siteArea={asset.area} presets={asset.presets} mailto={contactLinks.email} place={asset.name} />
          </div>
        </section>
      ) : null}

      {/* 05 · PARTNERSHIP — «We have the land. You have the idea.»: the priority formats lead; never a term, a price or a commitment */}
      {show("deals") ? (
        <section className="r3-sec lx-sec r3x-sec r3x-partner lx-deals" id="deals">
          <div className="r3-shell">
            <div className="r3x-head" data-reveal>
              <R3Label>{r3.partner.kicker[locale]}</R3Label>
              <h2 className="r3x-title r3x-title--xl">{r3.partner.title[locale]}</h2>
              <p className="r3x-lead">{r3.partner.lead[locale]}</p>
            </div>
            {primary.length ? (
              <ol className="r3x-deals lx-deals__list--primary">
                {primary.map((d, i) => (
                  <li key={d.key} className={`r3x-deal lx-deals__item is-primary${i === 0 ? " is-dark" : ""}`} data-reveal>
                    <p className="r3x-deal__k"><span>{String(i + 1).padStart(2, "0")}</span>{r3.partner.priority[locale]}</p>
                    <h3 className="r3x-deal__title lx-deals__title">{d.title[locale]}</h3>
                    <p className="r3x-deal__text">{d.text[locale]}</p>
                    {r3.partner.flows[d.key] ? (
                      <ol className="r3x-flow" aria-label={d.title[locale]}>
                        {r3.partner.flows[d.key]!.map((step, k) => <li key={k}><span>{String(k + 1).padStart(2, "0")}</span>{step[locale]}</li>)}
                      </ol>
                    ) : null}
                    <p className="r3x-deal__suits"><b>{c.suits[locale]}:</b> {d.suits[locale]}</p>
                    <span className={`lx-chip ${d.agreed ? "is-fact" : "is-estimate"}`}>{(d.agreed ? c.agreed : c.possible)[locale]}</span>
                    <Link className="r3x-link" href={discuss}><span>{r3.partner.discuss[locale]}</span><Icon size={16} /></Link>
                  </li>
                ))}
              </ol>
            ) : null}
            {others.length ? (
              <>
                <p className="lx-deals__k">{(primary.length ? c.dealOthers : c.p7title)[locale]}</p>
                <ul className="lx-deals__rows r3x-rows">
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
            <p className="r3x-disclaimer" data-reveal>{c.dealNote[locale]}</p>
          </div>
        </section>
      ) : null}

      {/* 06 · SITE DATA AND READINESS — the summary; the full technical passport and the readiness register open on demand */}
      <section className="r3-sec r3-sec--paper lx-sec lx-tech r3x-sec" id="technical">
        <div className="r3-shell">
          <div className="r3x-head" data-reveal>
            <R3Label>{c.pTech[locale]}</R3Label>
            <h2 className="r3x-title">{c.pTechTitle[locale]}</h2>
            <p className="r3x-lead">{c.pTechLead[locale]}</p>
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
        <section className="r3-sec lx-sec lx-pack r3x-pack" id="pack">
          <div className="r3-shell lx-pack__grid">
            <div data-reveal>
              <R3Label tone="light">{c.p8[locale]}</R3Label>
              <h2 className="r3x-title">{c.p8title[locale]}</h2>
              <p className="r3x-lead">{c.p8lead[locale]}</p>
              <div className="r3x-actions">
                <a className="r3x-btn r3x-btn--light" href={mail(mailCopy.pack)}><span>{c.requestPack[locale]}</span><Icon size={16} /></a>
                <a className="r3x-link" href={contactLinks.mobile}><span>{c.call[locale]} · {company.mobile.value[locale]}</span><Icon size={16} /></a>
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

      {/* THE CLOSING CONVERSATION — Technical Director + Architect; no promised approvals */}
      <section className="r3-sec r3x-sec r3x-cta" id="technical-support">
        <div className="r3-shell r3x-cta__grid">
          <div data-reveal>
            <R3Label>{c.p9[locale]}</R3Label>
            <h2 className="r3x-title r3x-title--xl">{r3.cta.title[locale]}</h2>
            <p className="r3x-lead">{r3.cta.lead[locale]}</p>
            <div className="r3x-actions">
              <Link className="r3x-btn r3x-btn--dark" href={discuss}><span>{c.discuss[locale]}</span><Icon size={16} /></Link>
              <a className="r3x-link r3x-link--dark" href={contactLinks.email}><span>{company.email.value[locale]}</span><Icon size={16} /></a>
            </div>
          </div>
          <div data-reveal>
            <p className="r3-trust__principle">{c.p9lead[locale]}</p>
            <ol className="r3-trust__list lx-team__list">{c.team.map((x) => <li key={x.en}>{x[locale]}</li>)}</ol>
            <p className="r3-note">{c.p9note[locale]}</p>
            <p className="lx-updated">{project.name} · {dateOf(asset.updated)} · {ha}</p>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
