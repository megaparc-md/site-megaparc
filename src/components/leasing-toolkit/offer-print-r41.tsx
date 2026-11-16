import type { ReactNode } from "react";
import { Accent } from "@/components/accent";
import { templateOffer } from "@/components/leasing-experience/offer";
import { pathOf } from "@/components/leasing-experience/photo-scene";
import { MapSvg } from "@/components/leasing-experience/transport-map";
import { SiteMap } from "@/components/site-map";
import { GeneratedDate } from "@/components/leasing-toolkit/generated-date";
import { UtilityIcon } from "@/components/utility-icons";
import { formatAreaExact, getProject, getSpace } from "@/content/source";
import { company, contactLinks } from "@/data/demo-content";
import { publishable, type VisibilityMark } from "@/data/leasing-experience-model";
import { moscova20Experience as x } from "@/data/leasing-experience-moscova-20";
import { commercialCopy as c, euro, individualOfferHref, m20Commercial, perMonth, rateParts, rentCalculation } from "@/data/moscova-20-commercial";
import { offerCopy as o } from "@/data/moscova-20-offer";
import { offerR41 as v } from "@/data/moscova-20-offer-r41";
import { m20Toolkit, toolkitCopy } from "@/data/moscova-20-toolkit";
import { moscova20Transport } from "@/data/moscova-20-transport";
import { cadastreNumbers, eCadastruPortal, premisesCadastre } from "@/data/property-trust";
import { toolVisible } from "@/data/tenant-intelligence";
import { localePath, publicAsset, type SiteLocale } from "@/lib/site-data";
import "@/app/offer-r41.css";

/**
 * MOSCOVA 20 · COMMERCIAL PRESENTATION R4.1 — the A4 LANDSCAPE source of the one public commercial PDF (OWNER «2-DAY FINISH TO IDEAL
 * STANDARD» + «FINAL 2-DAY DELIVERY MANDATE» + «R4.1 как кандидат», 2026-11-14). A design rework of R4 in the approved Architectural
 * Editorial style — not a re-skin: every page has its own composition, the architecture is large, nothing informative is set below
 * 7 pt, no frame repeats, no stair is the subject of a page, no accidental void. Eleven pages since the OWNER readability rule (body 10 pt, captions ≥ 8,5 pt — the terms take two pages):
 *   01 cover · 02 the address (the aerial cropped clear of the neighbours' lettering, three arguments, the five marks) · 03 the space
 *   (the ground floor along the shopfront full height, 625,7 m², the two levels, the terrace apart) · 04 commercial terms (the two
 *   rates, the preliminary month, deposit, utilities, 15 %, terrace, indexation, the individual offer) · 05 · 06 the official plans ·
 *   07 the engineering base (graphite) · 08 the location · 09 use scenarios · 10 the invitation.
 * Facts are read from the approved data, exactly as in R4 (offer-print.tsx stays for reprints of R4). Printed by
 * scripts/moscova-20-dossier.mjs --route offer-print/r41 --dir offer/r4-1 --name moscova-20-commercial-presentation --suffix r4-1.
 */
const ORIGIN = "https://www.megaparc.md";
// an escape on purpose: a literal no-break space is invisible in review and is lost when a file is rewritten
const N = " ";
const intl: Record<SiteLocale, string> = { ro: "ro-RO", ru: "ru-RU", en: "en-GB" };
const printSrc = (id: string) => publicAsset(`/assets/leasing/moscova-20/offer/r4/img/${id}.jpg`);
const metres = (m: number, locale: SiteLocale) => m.toLocaleString(intl[locale], { minimumFractionDigits: 1, maximumFractionDigits: 1 });
const unitOf = (figure: string) => figure.replace(/\s*(м²|m²)$/, "");

/** The aerial with the R8 annotation — cropped below the neighbouring buildings' lettering (y ≥ 300 of the 1278 × 959 frame). */
function Aerial({ marks, name, locale }: { marks: VisibilityMark[]; name: string; locale: SiteLocale }) {
  const vis = x.motion.visibility!;
  const photo = x.photos[vis.photo];
  const { width: w, height: h } = photo;
  const object = marks.find((mark) => mark.kind === "object");
  const outside = object ? `M0 0 H${w} V${h} H0 Z ${pathOf(object.shape)}` : "";
  return (
    <svg className="r41-aerial" viewBox="150 300 840 643" preserveAspectRatio="xMidYMid slice" role="img" aria-label={photo.alt[locale]}>
      <image href={printSrc(photo.id)} x="0" y="0" width={w} height={h} preserveAspectRatio="none" />
      {object ? <path d={outside} fillRule="evenodd" fill="rgba(22, 23, 26, .42)" /> : null}
      {object ? <path d={pathOf(object.shape)} fill="rgba(245, 242, 236, .1)" stroke="#f5f2ec" strokeWidth="2.4" strokeLinejoin="miter" /> : null}
      {object?.edge ? <path d={pathOf(object.edge, false)} fill="none" stroke="rgba(245, 242, 236, .6)" strokeWidth="1.4" /> : null}
      {marks.map((mark) => mark.pin ? (
        <g key={mark.key}>
          <path d={pathOf([mark.pin, mark.at], false)} stroke="rgba(245, 242, 236, .92)" strokeWidth="1.5" fill="none" />
          <circle cx={mark.pin[0]} cy={mark.pin[1]} r={mark.kind === "object" ? 6 : 4.4} fill={mark.kind === "object" ? "#74202f" : "#f5f2ec"} stroke={mark.kind === "object" ? "#f5f2ec" : "none"} strokeWidth="2" />
        </g>
      ) : null)}
      {marks.map((mark, i) => (
        <g key={mark.key}>
          <circle cx={mark.at[0]} cy={mark.at[1]} r="16" fill={mark.kind === "object" ? "#74202f" : "rgba(20, 21, 24, .88)"} stroke="#f5f2ec" strokeWidth="1.5" />
          <text x={mark.at[0]} y={mark.at[1] + 5.4} textAnchor="middle" fill="#fff" fontSize="15" fontWeight="700" fontFamily="Manrope, Arial, sans-serif">{i + 1}</text>
        </g>
      ))}
      {object ? <text x={object.at[0] + 28} y={object.at[1] + 6} fill="#f5f2ec" fontSize="19" fontWeight="700" letterSpacing="4" fontFamily="Manrope, Arial, sans-serif">{name.toUpperCase()}</text> : null}
    </svg>
  );
}

export function OfferPrintR41({ locale }: { locale: SiteLocale }) {
  const r = toolkitCopy.r2;
  const d = toolkitCopy.dossier;
  const project = getProject(m20Toolkit.project)!;
  const unit = getSpace("moscova-20-corner") ?? null;
  const offer = templateOffer(x, unit, project.name, locale);
  const calc = rentCalculation(offer.breakdown, locale);
  const passport = x.passport!;
  const number = cadastreNumbers[m20Toolkit.project]!;
  const premises = premisesCadastre[m20Toolkit.project] ?? [];
  const packUrl = `${ORIGIN}${localePath(locale, m20Toolkit.packPath)}/`;
  const propertyUrl = `${ORIGIN}${localePath(locale, `/projects/${project.slug}`)}/`;
  const area = (n: number) => formatAreaExact(n, locale);
  const m = locale === "ru" ? "м" : "m";
  const sq = locale === "ru" ? "м²" : "m²";
  const height = (n: number, approx: boolean) => `${approx ? "≈ " : ""}${metres(n, locale)}${N}${m}`;
  const floors = offer.breakdown.filter((level) => level.height);
  const heights = `${floors.some((l) => l.heightEvidence === "APPROXIMATE") ? "≈ " : ""}${floors.map((l) => metres(l.height!, locale)).join(" / ")}`;
  const facts = passport.facts.filter((fact) => publishable(fact.evidence));
  const cards = (passport.ready.cards ?? []).filter((card) => publishable(card.evidence));
  const card = (key: string) => cards.find((item) => item.key === key);
  const levels = x.plans.levels.filter((level) => level.drawing);
  const marks = (x.motion.visibility?.marks ?? []).filter((mark) => publishable(mark.evidence));
  const transit = x.motion.transit;
  const nearest = moscova20Transport.stops.find((stop) => stop.role === "nearest");
  const walk = transit && nearest?.walkM ? transit.walkValue[locale].replace("{m}", String(Math.round(nearest.walkM / 10) * 10)).replace("{min}", String(nearest.walkMin ?? "")).split("|") : null;
  const growth = x.motion.growth && toolVisible(`${x.project}.district-growth`, false) ? x.motion.growth : null;
  const formats = x.lens?.formats ?? [];
  const mailto = `${contactLinks.email}?subject=${encodeURIComponent(o.mailSubject[locale])}`;
  const photo = (key: string) => x.photos[key];
  const rate = (key: "ground" | "lower") => rateParts(m20Commercial.rates[key], locale);
  const why = c.why.items;
  const street = (s: string) => s.replace(/(^|[\s(])(бул\.|ул\.|bd\.|Bd\.|str\.) /g, `$1$2${N}`).replace(/(Матей|Matei) (Басараб|Basarab)/g, `$1${N}$2`).replace(/(Moscova|Москова) (Blvd|St)/g, `$1${N}$2`).replace(/(Москова|Moscova),? (20)/g, (s2) => s2.replace(/ /g, N));
  const access = card("access");

  const foot = (n: number, tone: "light" | "dark" = "light") => (
    <footer className={`r41-foot is-${tone}`}>
      <span>{r.footerMark[locale]}</span>
      {/* OWNER «PDF DATE» (2026-11-16): the date the file is generated, inserted automatically at print — beside the document code */}
      <span>{m20Commercial.offer.version} · <GeneratedDate locale={locale} /> · {n}{N}/{N}{m20Commercial.offer.pages}</span>
    </footer>
  );
  const kicker = (n: number, label: string, tone = "") => <p className={`r41-kicker ${tone}`.trim()}><b>{String(n).padStart(2, "0")}</b><span>{label}</span></p>;
  const statement = (text: string, className = "r41-h2") => {
    const lines = text.split("\n");
    return <h2 className={className}>{lines.map((line, i) => <span key={i}><Accent text={line} statement={lines.join(" ")} />{i < lines.length - 1 ? " " : ""}</span>)}</h2>;
  };
  const img = (key: string, className: string, caption?: string): ReactNode => (
    <figure className={`r41-img ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={printSrc(photo(key).id)} alt={photo(key).alt[locale]} />
      {caption ? <figcaption className="r41-img__cap">{caption}</figcaption> : null}
    </figure>
  );
  const big = (figure: string, u: string, className = "r41-num") => <p className={className}><strong>{figure}</strong><span>{u}</span></p>;

  return (
    <main className="r41" lang={locale}>
      {/* 01 · COVER */}
      <section className="r41-page r41-cover">
        <figure className="r41-img r41-cover__photo">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={printSrc(`${photo("entranceProcessed").id}-cover`)} alt={photo("entranceProcessed").alt[locale]} />
        </figure>
        <header className="r41-cover__top">
          {/* OWNER «REGISTERED TRADEMARK» (2026-11-16): MEGAPARC® — the ® small, top right, out of the flow (the red rule unchanged) */}
          <span className="r41-brand"><span className="r41-brand__word">MEGAPARC<span className="r41-brand__reg">®</span></span><i /></span>
          <span className="r41-cover__kicker">{v.kicker[locale]}</span>
        </header>
        <div className="r41-cover__body">
          <h1 className="r41-cover__name">{project.name}</h1>
          <p className="r41-cover__thesis"><Accent text={x.hero.title[locale]} /></p>
          <div className="r41-cover__facts">
            {big(unitOf(offer.figure), sq, "r41-num r41-cover__area")}
            <dl className="r41-cover__meta">
              <div><dt>{v.coverLevels[locale]}</dt><dd>{x.hero.offer[locale]}</dd></div>
              <div><dt className={`r41-status is-${offer.state}`}><i aria-hidden="true" />{offer.status}</dt><dd>{o.coverPlace[locale]}</dd></div>
            </dl>
          </div>
        </div>
        <footer className="r41-cover__foot">
          <span>megaparc.md</span>
          <span>{m20Commercial.offer.version} · <GeneratedDate locale={locale} /></span>
        </footer>
      </section>

      {/* 02 · THE ADDRESS — the aerial large, the statement and the marks; three arguments under the photograph */}
      <section className="r41-page r41-addr">
        <div className="r41-addr__copy">
          {kicker(2, o.opportunity.kicker[locale])}
          {statement(o.opportunity.title[locale], "r41-h2 r41-h2--addr")}
          <p className="r41-lead">{o.coverPlace[locale]}</p>
          <ol className="r41-args">
            {[
              { key: "glazing", title: why[0].title[locale], text: why[0].text[locale] },
              { key: "entrance", title: o.r4.entranceTitle[locale], text: access?.text[locale] ?? "" },
              { key: "district", title: why[1].title[locale], text: why[1].text[locale] },
            ].filter((item) => item.text).map((item, i) => (
              <li key={item.key}><b>{String(i + 1).padStart(2, "0")}</b><h3>{item.title}</h3><p>{item.text}</p></li>
            ))}
          </ol>
        </div>
        <figure className="r41-addr__photo"><Aerial marks={marks} name={project.name} locale={locale} /></figure>
        <div className="r41-addr__legend">
          <ol className="r41-legend" aria-label={o.aerialLegend[locale]}>
            {marks.map((mark, i) => <li key={mark.key} className={i === 0 ? "is-object" : undefined}><b>{i + 1}</b><span>{mark.label[locale]}</span></li>)}
          </ol>
          <p className="r41-caption">{x.motion.visibility?.caption[locale]}</p>
        </div>
        {foot(2)}
      </section>

      {/* 03 · THE SPACE — the ground floor along the shopfront full height; the figures in one column */}
      <section className="r41-page r41-space">
        {img("intGroundHall", "r41-space__photo", v.captions.formats[locale])}
        <div className="r41-space__copy">
          {kicker(3, o.space.kicker[locale])}
          {statement(o.space.statement[locale].replace(". ", ".\n"), "r41-h2")}
          <p className="r41-lead">{why[2].text[locale]}</p>
          <div className="r41-space__total">
            <p className="r41-label">{o.space.total[locale]}</p>
            {big(unitOf(offer.figure), sq, "r41-num r41-num--xl")}
            {offer.usefulArea ? <p className="r41-small">{area(offer.usefulArea)} · {r.commercial[locale]}</p> : null}
          </div>
          <dl className="r41-levels">
            {offer.breakdown.filter((level) => level.key !== "terrace").map((level) => (
              <div key={level.key}>
                <dt className="r41-label">{level.label[locale]}</dt>
                <dd>
                  {big(unitOf(area(level.area)), sq, "r41-num r41-num--l")}
                  <span>{level.useful ? `${area(level.useful)} · ${r.commercial[locale]}` : null}{level.height ? ` · ${d.height[locale].toLowerCase()} ${height(level.height, level.heightEvidence === "APPROXIMATE")}` : null}</span>
                </dd>
              </div>
            ))}
            {calc.terrace ? (
              <div className="is-terrace">
                <dt className="r41-label">{calc.terrace.label}</dt>
                <dd><b>{area(calc.terrace.area)}</b><span>{c.terraceShort[locale]}</span></dd>
              </div>
            ) : null}
          </dl>
        </div>
        {foot(3)}
      </section>

      {/* 04 · RATES — the two rates and the preliminary month: one idea, large figures */}
      <section className="r41-page r41-terms">
        <div className="r41-terms__rates">
          {kicker(4, c.kicker[locale])}
          {/* statement titles end with a full stop (OWNER R4.1 visual review P3) */}
          {statement(`${c.title[locale]}.`, "r41-h2")}
          <div className="r41-rates">
            {calc.lines.map((line) => {
              const parts = rateParts(line.rate, locale);
              return (
                <article key={line.key} className={`r41-rate is-${line.key}`}>
                  <p className="r41-label">{line.label}</p>
                  <p className="r41-rate__figure"><strong>{parts.figure}</strong><span>{parts.unit}<em>{c.vatInline[locale]}</em></span></p>
                  <p className="r41-rate__calc">{area(line.area)} × {parts.figure} = <b>{euro(line.monthly, locale)}</b> {perMonth[locale]}</p>
                </article>
              );
            })}
          </div>
        </div>
        <div className="r41-terms__sheet">
          <div className="r41-total">
            <p className="r41-label">{c.total[locale]}</p>
            <p className="r41-total__figure"><strong>{euro(calc.monthly, locale)}</strong><span>{perMonth[locale]} · {c.vatInline[locale]}</span></p>
            <p className="r41-total__sum">{calc.lines.map((line) => euro(line.monthly, locale)).join(" + ")} = {euro(calc.monthly, locale)}</p>
            <p className="r41-total__annual">{c.annual[locale]} — <b>{euro(calc.annual, locale)}</b> {c.vatInline[locale]}</p>
          </div>
          {calc.terrace ? <p className="r41-terms__terrace"><b>{calc.terrace.label} · {area(calc.terrace.area)}</b><span>{c.terraceShort[locale]}</span></p> : null}
          <p className="r41-notes">{c.basisNote[locale]} {c.vatNote[locale]}</p>
        </div>
        {foot(4)}
      </section>

      {/* 05 · LEASE CONDITIONS — deposit, utilities, the 15 % fee, indexation: editorial rows, never a table; the individual offer */}
      <section className="r41-page r41-cond">
        <div className="r41-cond__head">
          {kicker(5, c.kicker[locale])}
          {statement(v.conditionsTitle[locale], "r41-h2")}
          <a className="r41-next" href={individualOfferHref(locale)}>
            <span className="r41-label">{d.sections.next[locale]}</span>
            <b>{c.individualCta[locale]}<i aria-hidden="true">→</i></b>
            <span>{v.individualLead[locale]} {company.email.value[locale]}</span>
          </a>
        </div>
        <dl className="r41-conditions">
          <div><dt>{c.depositLabel[locale]}</dt><dd><strong>{c.depositFigure[locale]}</strong> {c.depositUnit[locale]}</dd></div>
          <div><dt>{c.utilitiesLabel[locale]}</dt><dd><strong>{c.utilitiesShort[locale]}</strong><span>{c.otherExpenses[locale]}</span></dd></div>
          <div><dt>{c.feeLabel[locale]}</dt><dd><strong>{c.feeFigure[locale]}</strong> {c.feeUnit[locale]}<span>{o.r4.feeOnce[locale]}</span></dd></div>
          {calc.terrace ? <div><dt>{calc.terrace.label} · {area(calc.terrace.area)}</dt><dd><strong>{c.terraceShort[locale]}</strong></dd></div> : null}
          <div className="is-index"><dt>{c.indexationTitle[locale]}</dt><dd><span>{c.indexation[locale]}</span></dd></div>
        </dl>
        {foot(5)}
      </section>

      {/* 06 · 07 · THE OFFICIAL PLANS — the drawings large on white, never redrawn */}
      {levels.map((level, i) => {
        const drawing = photo(level.drawing!.photo);
        const br = offer.breakdown.find((b) => b.key === level.key);
        const pdf = `${ORIGIN}${level.drawing!.pdf.replace(/^.*?\/assets/, "/assets")}`;
        const mark = locale === "en" ? level.mark.replace(/,/g, ".") : level.mark;
        const key = level.key === "lower" ? "lower" : "ground";
        return (
          <section key={level.key} className={`r41-page r41-plan is-${level.key}`}>
            <figure className="r41-plan__drawing">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={printSrc(drawing.id)} alt={drawing.alt[locale]} />
            </figure>
            <aside className="r41-plan__info">
              {kicker(6 + i, `${d.sections.plans[locale]} · ${mark}`)}
              <h2 className="r41-h2 r41-h2--plan">{level.label[locale]}</h2>
              {br ? (
                <div className="r41-plan__lead">
                  {big(unitOf(area(br.area)), sq, "r41-num r41-num--l")}
                  <p className="r41-small">{br.useful ? `${area(br.useful)} · ${r.commercial[locale]}` : null}{br.height ? ` · ${height(br.height, br.heightEvidence === "APPROXIMATE")}` : null}</p>
                </div>
              ) : null}
              <p className="r41-label r41-label--rule">{o.schedule[locale]}</p>
              <ul className="r41-rooms">
                {level.zones.filter((zone) => zone.no).map((zone) => (
                  <li key={zone.key}><b>{zone.no}</b><span>{zone.label[locale]}</span><i>{zone.area ? area(zone.area) : ""}</i></li>
                ))}
              </ul>
              <div className="r41-plan__rate">
                <p className="r41-label">{c.rate[locale]}</p>
                <p className="r41-plan__ratefig"><strong>{rate(key).figure}</strong><span>{rate(key).unit}<em>{c.vatInline[locale]}</em></span></p>
              </div>
              <p className="r41-caption r41-plan__legend">{v.planLegend[locale]} <a href={pdf}>{r.openPlan[locale]} ↗</a></p>
            </aside>
            {foot(6 + i)}
          </section>
        );
      })}

      {/* 07 · THE ENGINEERING BASE — graphite; the figures as an infographic; the ducts in the photograph are the subject */}
      <section className="r41-page r41-tech">
        {img("intLowerDepth", "r41-tech__photo", v.captions.tech[locale])}
        <div className="r41-tech__body">
          {kicker(8, d.sections.technical[locale], "is-dark")}
          {statement(o.technical.title[locale], "r41-h2 is-dark")}
          <dl className="r41-tech__figs">
            {facts.map((fact) => (
              <div key={fact.key} className={`is-${fact.key}`}>
                <dt>{(fact.name ?? fact.label)[locale]}</dt>
                <dd>
                  <span className="r41-tech__num">{fact.figure === "heights" ? heights : fact.figure[locale]}<i>{fact.unit[locale]}</i></span>
                  <span className="r41-tech__why">{fact.label[locale]}</span>
                </dd>
              </div>
            ))}
            {card("parking") ? (
              <div className="is-parking">
                <dt>{card("parking")!.title[locale]}</dt>
                <dd><span className="r41-tech__num">{card("parking")!.value[locale].replace(/\D+$/, "")}<i>{card("parking")!.value[locale].replace(/^\d+\s*/, "")}</i></span><span className="r41-tech__why">{card("parking")!.text[locale]}</span></dd>
              </div>
            ) : null}
          </dl>
          <ul className="r41-tech__list">
            {["heating", "climate", "logistics", "fitout"].map((k) => card(k)).filter(Boolean).map((item) => (
              <li key={item!.key}><span className="r41-label">{item!.title[locale]}</span><b>{item!.value[locale]}</b><span>{item!.lead ? item!.lead[locale] : item!.text[locale]}</span></li>
            ))}
          </ul>
          <p className="r41-tech__principle">{d.support[locale]}</p>
        </div>
        {foot(8, "dark")}
      </section>

      {/* 08 · THE LOCATION — the map large; ≈ 140 m to the stop; the routes; the district */}
      <section className="r41-page r41-loc">
        <figure className="r41-loc__map">
          {transit ? <MapSvg copy={transit} name={project.name} locale={locale} crop="wide" /> : <SiteMap slug={project.slug} name={project.name} label={x.address[locale]} />}
        </figure>
        <div className="r41-loc__copy">
          {kicker(9, d.sections.location[locale])}
          {statement(`${r.district[locale]}.\n${street(r.crossing[locale])}.`, "r41-h2 r41-h2--loc")}
          <p className="r41-small">{street(`${x.location.lead[locale].replace(/\n/g, " ")} ${d.facade[locale]}.`)}</p>
          {walk ? (
            <div className="r41-walk">
              <p className="r41-walk__figure">{walk[0]}</p>
              <p className="r41-walk__text">{walk[1]}</p>
              <p className="r41-caption">{transit!.estimate[locale]}</p>
            </div>
          ) : null}
          {transit ? (
            <dl className="r41-routes">
              {transit.routes.map((route) => <div key={route.mode}><dt>{route.label[locale]}</dt><dd>{route.refs.join(`,${N}`)}</dd></div>)}
            </dl>
          ) : null}
        </div>
        {growth ? (
          // OWNER R4.1 visual review P2: one factual line and its status — the existing location leads the page; never a promise of footfall
          <div className="r41-growth">
            <p className="r41-label">{v.growth.label[locale]}</p>
            <p className="r41-small">{v.growth.text[locale]}</p>
            <p className="r41-caption">{v.growth.status[locale]}</p>
          </div>
        ) : null}
        {foot(9)}
      </section>

      {/* 09 · USE SCENARIOS — an editorial index beside the open hall */}
      <section className="r41-page r41-formats">
        {img("intGroundGlazing", "r41-formats__photo", v.captions.space[locale])}
        <div className="r41-formats__body">
          {kicker(10, o.scenarios.kicker[locale])}
          {statement(o.scenarios.title[locale], "r41-h2")}
          <ol className="r41-index">
            {formats.map((format, i) => {
              const ev = format.evidence.filter((e) => publishable(e.evidence))[0];
              return (
                <li key={format.key}>
                  <b>{String(i + 1).padStart(2, "0")}</b>
                  <div><h3>{format.label[locale]}</h3><p className="r41-index__q">{format.question[locale]}</p></div>
                  {ev ? <p className="r41-index__ev">{ev.title ? <strong>{ev.title[locale]}. </strong> : null}{ev.text[locale]}</p> : null}
                </li>
              );
            })}
          </ol>
          <p className="r41-notes">{x.lens?.honesty[locale]} {x.lens?.regulated[locale]}</p>
        </div>
        {foot(10)}
      </section>

      {/* 11 · THE INVITATION — burgundy; one thesis, the viewing, the contacts once, the QR; the lower-ground hall beside */}
      <section className="r41-page r41-final">
        <div className="r41-final__panel">
          {kicker(11, d.sections.next[locale], "is-dark")}
          {statement(r.finalTitle[locale].replace(/Moscova\s+20/, `Moscova${N}20`), "r41-final__title")}
          <p className="r41-final__lead">{r.finalSupport[locale]}</p>
          <div className="r41-cta">
            <a className="r41-cta__primary" href={`${packUrl}#book`}>{r.ctaPrimary[locale]}<span aria-hidden="true">→</span></a>
            <a className="r41-cta__secondary" href={`${packUrl}#precheck`}>{o.technical.consult[locale]}<span aria-hidden="true">→</span></a>
          </div>
          {x.viewing?.steps?.length ? (
            <ol className="r41-steps">
              {x.viewing.steps.map((step, i) => <li key={i}><b>{String(i + 1).padStart(2, "0")}</b><span className="r41-label">{step.title[locale]}</span><p>{step.text[locale]}</p></li>)}
            </ol>
          ) : null}
          <div className="r41-final__grid">
            <ul className="r41-contacts">
              <li><a href={contactLinks.mobile}><UtilityIcon name="phone" size={13} />{company.mobile.value[locale]}</a></li>
              <li><a href={contactLinks.landline}><UtilityIcon name="phone" size={13} />{company.landline.value[locale]}</a></li>
              <li><a href={mailto}><UtilityIcon name="mail" size={13} />{company.email.value[locale]}</a></li>
              <li><a href={propertyUrl}><UtilityIcon name="link" size={13} />{r.site[locale]}</a></li>
              <li className="is-quiet">e‑Cadastru · <a href={eCadastruPortal}>{number}</a>{premises.length ? <><br />{premises.join(" · ")}</> : null}</li>
            </ul>
            <div className="r41-qr">
              <a href={packUrl}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={m20Toolkit.qr.byLocale[locale]} alt="QR" />
              </a>
              <p><b>{r.qrCaption[locale]}</b><a href={packUrl}>{`${new URL(packUrl).host}${new URL(packUrl).pathname}`.split("/").map((part, i, all) => <span key={i}>{part}{i < all.length - 1 ? <>/<wbr /></> : null}</span>)}</a></p>
            </div>
          </div>
        </div>
        {img("intLowerColumns", "r41-final__photo", v.captions.final[locale])}
        {foot(11, "dark")}
      </section>
    </main>
  );
}
