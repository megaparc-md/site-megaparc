import type { CSSProperties, ReactNode } from "react";
import { Accent } from "@/components/accent";
import { templateOffer } from "@/components/leasing-experience/offer";
import { pathOf } from "@/components/leasing-experience/photo-scene";
import { MapSvg } from "@/components/leasing-experience/transport-map";
import { SiteMap } from "@/components/site-map";
import { UtilityIcon } from "@/components/utility-icons";
import { formatAreaExact, getProject, getSpace } from "@/content/source";
import { company, contactLinks } from "@/data/demo-content";
import { publishable, type VisibilityMark } from "@/data/leasing-experience-model";
import { moscova20Experience as x } from "@/data/leasing-experience-moscova-20";
import { commercialCopy as c, euro, m20Commercial, perMonth, rateParts, rentCalculation } from "@/data/moscova-20-commercial";
import { offerCopy as o } from "@/data/moscova-20-offer";
import { m20Toolkit, toolkitCopy } from "@/data/moscova-20-toolkit";
import { moscova20Transport } from "@/data/moscova-20-transport";
import { cadastreNumbers, eCadastruPortal } from "@/data/property-trust";
import { toolVisible } from "@/data/tenant-intelligence";
import { localePath, publicAsset, type SiteLocale } from "@/lib/site-data";
import "@/app/offer-r4.css";

/**
 * COMMERCIAL OFFER · BROCHURE R4 — the A4 LANDSCAPE source of the PDF (OWNER R9 «PREMIUM COMMERCIAL PRESENTATION & VISUAL CORRECTIONS»
 * §04 + «PDF R4 · ART DIRECTION UPDATE — PREMIUM EDITORIAL REFERENCE», 2026-11-13). Premium Editorial Real Estate Brochure: the
 * architecture large, one idea per page, bold Manrope (light display, the registered accent in 700), colour as rhythm — ivory, white
 * plan sheets, one graphite engineering scene, stone for the scenarios, burgundy for the money and the invitation. Ten pages:
 *   01 cover (the entrance full bleed, the name, the thesis, 625,7 m²) · 02 the opportunity (the annotated aerial, three arguments) ·
 *   03 the space (two levels in photographs, the terrace apart) · 04 commercial terms (two rates, the preliminary month, the deposit,
 *   the expense regime, indexation) · 05 · 06 the official plans, large and never redrawn · 07 the engineering base (figures as an
 *   infographic, graphite) · 08 the location (the map, ≈ 140 m to the stop, the routes, the district with the status of the plan) ·
 *   09 use scenarios (the five formats as an editorial index) · 10 the invitation (viewing, contacts, QR).
 * Every fact is read from the approved data (the unit record, the passport, the commercial module, the transport layer, the growth
 * layer, the cadastral registry) — this file only lays them out. Real OWNER photographs only; the official drawings are the
 * OWNER's PDFs rasterised at full resolution. Every URL, e-mail and telephone is an absolute link (URI annotations in the PDF).
 * Printed by scripts/moscova-20-dossier.mjs --route offer-print --dir offer/r4 --name moscova-20-commercial-offer --suffix r4.
 * The R3 brochure stays as static files for rollback (public/assets/leasing/moscova-20/offer/r3/); its source is in git (61bb933).
 */
const ORIGIN = "https://www.megaparc.md";
const PAGES = m20Commercial.offer.pages;
// written as an escape on purpose: a literal no-break space is invisible in review and is lost when a file is rewritten
const N = " ";
const intl: Record<SiteLocale, string> = { ro: "ro-RO", ru: "ru-RU", en: "en-GB" };
/** the print derivative of an OWNER photograph or official drawing (scripts/moscova-20-offer-assets.mjs) — same frame, JPEG */
const printSrc = (id: string) => publicAsset(`/assets/leasing/moscova-20/offer/r4/img/${id}.jpg`);
const metres = (m: number, locale: SiteLocale) => m.toLocaleString(intl[locale], { minimumFractionDigits: 1, maximumFractionDigits: 1 });
const unitOf = (figure: string) => figure.replace(/\s*(м²|m²)$/, "");

/** The aerial with the R8 annotation, cropped to the marks for a large landscape frame — one SVG, vector-sharp marks. */
function Aerial({ marks, name, locale, crop }: { marks: VisibilityMark[]; name: string; locale: SiteLocale; crop: [number, number, number, number] }) {
  const v = x.motion.visibility!;
  const photo = x.photos[v.photo];
  const { width: w, height: h } = photo;
  const object = marks.find((mark) => mark.kind === "object");
  const outside = object ? `M0 0 H${w} V${h} H0 Z ${pathOf(object.shape)}` : "";
  return (
    <svg className="o4-aerial" viewBox={crop.join(" ")} preserveAspectRatio="xMidYMid slice" role="img" aria-label={photo.alt[locale]}>
      <image href={printSrc(photo.id)} x="0" y="0" width={w} height={h} preserveAspectRatio="none" />
      {object ? <path d={outside} fillRule="evenodd" fill="rgba(22, 23, 26, .38)" /> : null}
      {object ? <path d={pathOf(object.shape)} fill="rgba(245, 242, 236, .1)" stroke="#f5f2ec" strokeWidth="2.6" strokeLinejoin="miter" /> : null}
      {object?.edge ? <path d={pathOf(object.edge, false)} fill="none" stroke="rgba(245, 242, 236, .6)" strokeWidth="1.5" /> : null}
      {marks.map((mark) => mark.pin ? (
        <g key={mark.key}>
          <path d={pathOf([mark.pin, mark.at], false)} stroke="rgba(245, 242, 236, .92)" strokeWidth="1.6" fill="none" />
          <circle cx={mark.pin[0]} cy={mark.pin[1]} r={mark.kind === "object" ? 6.5 : 4.6} fill={mark.kind === "object" ? "#74202f" : "#f5f2ec"} stroke={mark.kind === "object" ? "#f5f2ec" : "none"} strokeWidth="2" />
        </g>
      ) : null)}
      {marks.map((mark, i) => (
        <g key={mark.key}>
          <circle cx={mark.at[0]} cy={mark.at[1]} r="17" fill={mark.kind === "object" ? "#74202f" : "rgba(20, 21, 24, .86)"} stroke="#f5f2ec" strokeWidth="1.6" />
          <text x={mark.at[0]} y={mark.at[1] + 5.6} textAnchor="middle" fill="#fff" fontSize="16" fontWeight="700" fontFamily="Manrope, Arial, sans-serif">{i + 1}</text>
        </g>
      ))}
      {object ? <text x={object.at[0] + 30} y={object.at[1] + 6.5} fill="#f5f2ec" fontSize="20" fontWeight="700" letterSpacing="4" fontFamily="Manrope, Arial, sans-serif">{name.toUpperCase()}</text> : null}
    </svg>
  );
}

export function OfferPrintPage({ locale }: { locale: SiteLocale }) {
  const r = toolkitCopy.r2;
  const d = toolkitCopy.dossier;
  const project = getProject(m20Toolkit.project)!;
  const unit = getSpace("moscova-20-corner") ?? null;
  const offer = templateOffer(x, unit, project.name, locale);
  const calc = rentCalculation(offer.breakdown, locale);
  const passport = x.passport!;
  const number = cadastreNumbers[m20Toolkit.project]!;
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
  // the district-growth layer is public only where the website shows it (the production rule — this document is sent to anyone)
  const growth = x.motion.growth && toolVisible(`${x.project}.district-growth`, false) ? x.motion.growth : null;
  const formats = x.lens?.formats ?? [];
  const mailto = `${contactLinks.email}?subject=${encodeURIComponent(o.mailSubject[locale])}`;
  const photo = (key: string) => x.photos[key];
  const rate = (key: "ground" | "lower") => rateParts(m20Commercial.rates[key], locale);
  const why = c.why.items;
  /** street names never break inside: «бул. Москова», «ул. Матей Басараб», «bd. Moscova», «str. Matei Basarab», «Moscova Blvd» */
  const street = (s: string) => s.replace(/(^|[\s(])(бул\.|ул\.|bd\.|Bd\.|str\.) /g, `$1$2${N}`).replace(/(Матей|Matei) (Басараб|Basarab)/g, `$1${N}$2`).replace(/(Moscova|Москова) (Blvd|St)/g, `$1${N}$2`).replace(/(Москова|Moscova),? (20)/g, (m) => m.replace(/ /g, N));
  const access = card("access");

  const foot = (n: number, tone: "light" | "dark" = "light") => (
    <footer className={`o4-foot is-${tone}`}>
      <span>{r.footerMark[locale]}</span>
      <span>{m20Commercial.offer.version} · {m20Commercial.offer.updated} · {n}{N}/{N}{PAGES}</span>
    </footer>
  );
  const kicker = (n: number, label: string, tone = "") => <p className={`o4-kicker ${tone}`.trim()}><b>{String(n).padStart(2, "0")}</b><span>{label}</span></p>;
  /** a display statement in light Manrope with the accent the editorial register gives it (src/lib/emphasis.ts) — never a mechanical last word */
  const statement = (text: string, className = "o4-h2") => {
    const lines = text.split("\n");
    return <h2 className={className}>{lines.map((line, i) => <span key={i}><Accent text={line} statement={lines.join(" ")} />{i < lines.length - 1 ? " " : ""}</span>)}</h2>;
  };
  const img = (key: string, className: string, style?: CSSProperties): ReactNode => (
    <figure className={`o4-img ${className}`} style={style}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={printSrc(photo(key).id)} alt={photo(key).alt[locale]} />
    </figure>
  );
  const big = (figure: string, unit: string, className = "o4-num") => <p className={className}><strong>{figure}</strong><span>{unit}</span></p>;

  return (
    <main className="o4" lang={locale}>
      {/* 01 · COVER — the entrance full bleed; the name, the thesis, the area; nothing else */}
      <section className="o4-page o4-cover">
        {/* the entrance frame with the type's legibility shade baked into the print derivative (scripts/moscova-20-offer-assets.mjs) */}
        <figure className="o4-img o4-cover__photo">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={printSrc(`${photo("entranceProcessed").id}-cover`)} alt={photo("entranceProcessed").alt[locale]} />
        </figure>
        <header className="o4-cover__top">
          <span className="o4-brand">MEGAPARC<i /></span>
          <span className="o4-cover__kicker">{o.kicker[locale]}</span>
        </header>
        <div className="o4-cover__body">
          <h1 className="o4-cover__name">{project.name}</h1>
          <p className="o4-cover__thesis"><Accent text={x.hero.title[locale]} /></p>
          <div className="o4-cover__facts">
            {big(unitOf(offer.figure), sq, "o4-num o4-cover__area")}
            <p className="o4-cover__meta">
              <span>{x.hero.offer[locale]}</span>
              <span className={`o4-status is-${offer.state}`}><i aria-hidden="true" />{offer.status}</span>
            </p>
          </div>
        </div>
        <footer className="o4-cover__foot">
          <span>{o.coverPlace[locale]}</span>
          <span>{m20Commercial.offer.version} · {m20Commercial.offer.updated}</span>
        </footer>
      </section>

      {/* 02 · THE OPPORTUNITY — one statement, three arguments; the annotated aerial carries the page */}
      <section className="o4-page o4-opp">
        <div className="o4-opp__copy">
          {kicker(2, o.opportunity.kicker[locale])}
          {statement(o.opportunity.title[locale])}
          {img("intGroundGlazing", "o4-opp__inset")}
          <ol className="o4-args">
            {[
              { key: "glazing", title: why[0].title[locale], text: why[0].text[locale] },
              { key: "entrance", title: o.r4.entranceTitle[locale], text: access?.text[locale] ?? "" },
              { key: "district", title: why[1].title[locale], text: why[1].text[locale] },
            ].filter((item) => item.text).map((item, i) => (
              <li key={item.key}><b>{String(i + 1).padStart(2, "0")}</b><h3>{item.title}</h3><p>{item.text}</p></li>
            ))}
          </ol>
        </div>
        <figure className="o4-opp__photo">
          <Aerial marks={marks} name={project.name} locale={locale} crop={[110, 150, 940, 775]} />
        </figure>
        <div className="o4-opp__legend">
          <ol aria-label={o.aerialLegend[locale]}>
            {marks.map((mark, i) => <li key={mark.key} className={i === 0 ? "is-object" : undefined}><b>{i + 1}</b><span>{mark.label[locale]}</span></li>)}
          </ol>
          <p className="o4-caption">{x.motion.visibility?.caption[locale]}</p>
        </div>
        {foot(2)}
      </section>

      {/* 03 · THE SPACE — two levels in photographs with their figures; the terrace apart; what is offered */}
      <section className="o4-page o4-space">
        <header className="o4-space__head">
          {kicker(3, o.space.kicker[locale])}
          {statement(o.space.statement[locale])}
          <p className="o4-lead">{why[2].text[locale]}</p>
        </header>
        <div className="o4-space__total">
          <p className="o4-label">{o.space.total[locale]}</p>
          {big(unitOf(offer.figure), sq, "o4-num o4-num--xl")}
          {offer.usefulArea ? <p className="o4-small">{area(offer.usefulArea)} · {r.commercial[locale]}</p> : null}
          {calc.terrace ? <p className="o4-space__terrace"><b>{calc.terrace.label} · {area(calc.terrace.area)}</b><span>{c.terraceShort[locale]} · {c.terraceNote[locale].split(";")[1]?.trim() ?? ""}</span></p> : null}
        </div>
        <div className="o4-space__levels">
          {offer.breakdown.filter((level) => level.key !== "terrace").map((level) => {
            const shot = level.key === "ground" ? "intGroundHall" : level.key === "lower" ? "intLowerDepth" : null;
            // the terrace has no photograph of its own: it is a figure plate on stone (dashed — its terms are still to be confirmed),
            // never an empty frame that reads as a missing image
            if (!shot) {
              return (
                <article key={level.key} className={`o4-level o4-level--plate is-${level.key}`}>
                  <p className="o4-label">{level.label[locale]}</p>
                  {big(unitOf(area(level.area)), sq, "o4-num o4-num--l")}
                  <p className="o4-small">{c.terraceShort[locale]}</p>
                  <p className="o4-caption">{c.terraceNote[locale].split(";")[1]?.trim() ?? ""}</p>
                </article>
              );
            }
            return (
              <article key={level.key} className={`o4-level is-${level.key}`}>
                {img(shot, "o4-level__photo")}
                <div className="o4-level__copy">
                  <p className="o4-label">{level.label[locale]}</p>
                  {big(unitOf(area(level.area)), sq, "o4-num o4-num--l")}
                  <dl className="o4-pairs">
                    {level.useful ? <div><dt>{d.useful[locale]}</dt><dd>{area(level.useful)}</dd></div> : null}
                    {level.height ? <div><dt>{d.height[locale]}</dt><dd>{height(level.height, level.heightEvidence === "APPROXIMATE")}</dd></div> : null}
                  </dl>
                </div>
              </article>
            );
          })}
        </div>
        {foot(3)}
      </section>

      {/* 04 · COMMERCIAL TERMS — two rates as display figures, the preliminary month in burgundy, the terms as one quiet sheet */}
      <section className="o4-page o4-terms">
        <div className="o4-terms__rates">
          {kicker(4, c.kicker[locale])}
          {statement(c.title[locale])}
          <div className="o4-rates">
            {calc.lines.map((line) => {
              const parts = rateParts(line.rate, locale);
              return (
                <article key={line.key} className={`o4-rate is-${line.key}`}>
                  <p className="o4-label">{line.label}</p>
                  <p className="o4-rate__figure"><strong>{parts.figure}</strong><span>{parts.unit}<em>{c.vatInline[locale]}</em></span></p>
                  <p className="o4-rate__calc">{area(line.area)} × {parts.figure} = <b>{euro(line.monthly, locale)}</b> {perMonth[locale]}</p>
                </article>
              );
            })}
          </div>
        </div>
        <div className="o4-terms__sheet">
          <div className="o4-total">
            <p className="o4-label">{c.total[locale]}</p>
            <p className="o4-total__figure"><strong>{euro(calc.monthly, locale)}</strong><span>{perMonth[locale]} · {c.vatInline[locale]}</span></p>
            <p className="o4-total__sum">{calc.lines.map((line) => euro(line.monthly, locale)).join(" + ")} = {euro(calc.monthly, locale)}</p>
            <p className="o4-total__annual">{c.annual[locale]} — <b>{euro(calc.annual, locale)}</b> {c.vatInline[locale]}</p>
          </div>
          <dl className="o4-conditions">
            <div><dt>{c.depositLabel[locale]}</dt><dd><strong>{c.depositFigure[locale]}</strong> {c.depositUnit[locale]}</dd></div>
            <div><dt>{c.utilitiesLabel[locale]}</dt><dd><strong>{c.utilitiesShort[locale]}</strong><span>{c.otherExpenses[locale]}</span></dd></div>
            <div><dt>{c.feeLabel[locale]}</dt><dd><strong>{c.feeFigure[locale]}</strong> {c.feeUnit[locale]}<span>{o.r4.feeOnce[locale]}</span></dd></div>
            {calc.terrace ? <div><dt>{calc.terrace.label} · {area(calc.terrace.area)}</dt><dd><strong>{c.terraceShort[locale]}</strong></dd></div> : null}
            <div className="is-index"><dt>{c.indexationTitle[locale]}</dt><dd><span>{c.indexation[locale]}</span></dd></div>
          </dl>
        </div>
        <p className="o4-notes o4-terms__notes">{c.basisNote[locale]} {c.vatNote[locale]}</p>
        {foot(4)}
      </section>

      {/* 05 · 06 · THE OFFICIAL PLANS — the drawings large on white, never redrawn; the level, its figures and the room schedule beside */}
      {levels.map((level, i) => {
        const drawing = photo(level.drawing!.photo);
        const br = offer.breakdown.find((b) => b.key === level.key);
        const pdf = `${ORIGIN}${level.drawing!.pdf.replace(/^.*?\/assets/, "/assets")}`;
        const mark = locale === "en" ? level.mark.replace(/,/g, ".") : level.mark;
        const key = level.key === "lower" ? "lower" : "ground";
        return (
          <section key={level.key} className={`o4-page o4-plan is-${level.key}`}>
            <figure className="o4-plan__drawing">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={printSrc(drawing.id)} alt={drawing.alt[locale]} />
            </figure>
            <aside className="o4-plan__info">
              {kicker(5 + i, `${d.sections.plans[locale]} · ${mark}`)}
              <h2 className="o4-h2 o4-h2--plan">{level.label[locale]}</h2>
              {br ? (
                <dl className="o4-planfacts">
                  <div className="is-lead"><dt>{r.total[locale]}</dt><dd>{big(unitOf(area(br.area)), sq, "o4-num o4-num--l")}</dd></div>
                  {br.useful ? <div><dt>{r.commercial[locale]}</dt><dd>{area(br.useful)}</dd></div> : null}
                  {br.height ? <div><dt>{r.height[locale]}</dt><dd>{height(br.height, br.heightEvidence === "APPROXIMATE")}</dd></div> : null}
                </dl>
              ) : null}
              <p className="o4-label o4-label--rule">{o.schedule[locale]}</p>
              <ul className="o4-rooms">
                {level.zones.filter((zone) => zone.no).map((zone) => (
                  <li key={zone.key}><b>{zone.no}</b><span>{zone.label[locale]}</span><i>{zone.area ? area(zone.area) : ""}</i></li>
                ))}
              </ul>
              <p className="o4-caption o4-plan__legend">{r.planLegend[locale]}<br /><a href={pdf}>{r.openPlan[locale]} ↗</a></p>
              <div className="o4-plan__rate">
                <p className="o4-label">{c.rate[locale]} · {level.label[locale]}</p>
                <p className="o4-plan__ratefig"><strong>{rate(key).figure}</strong><span>{rate(key).unit}<em>{c.vatInline[locale]}</em></span></p>
              </div>
            </aside>
            {foot(5 + i)}
          </section>
        );
      })}

      {/* 07 · THE ENGINEERING BASE — figures as an infographic on graphite, the engineering photograph as the edge of the page */}
      <section className="o4-page o4-tech">
        {img("intLowerExit", "o4-tech__photo")}
        <div className="o4-tech__body">
          {kicker(7, d.sections.technical[locale], "is-dark")}
          {statement(o.technical.title[locale], "o4-h2 is-dark")}
          <dl className="o4-tech__figs">
            {facts.map((fact) => (
              <div key={fact.key} className={`is-${fact.key}`}>
                <dt>{(fact.name ?? fact.label)[locale]}</dt>
                <dd>
                  <span className="o4-tech__num">{fact.figure === "heights" ? heights : fact.figure[locale]}<i>{fact.unit[locale]}</i></span>
                  <span className="o4-tech__why">{fact.label[locale]}</span>
                </dd>
              </div>
            ))}
            {card("parking") ? (
              <div className="is-parking">
                <dt>{card("parking")!.title[locale]}</dt>
                <dd><span className="o4-tech__num">{card("parking")!.value[locale].replace(/\D+$/, "")}<i>{card("parking")!.value[locale].replace(/^\d+\s*/, "")}</i></span><span className="o4-tech__why">{card("parking")!.text[locale]}</span></dd>
              </div>
            ) : null}
          </dl>
          <ul className="o4-tech__list">
            {["heating", "climate", "logistics", "fitout"].map((k) => card(k)).filter(Boolean).map((item) => (
              <li key={item!.key}><span className="o4-label">{item!.title[locale]}</span><b>{item!.value[locale]}</b><span>{item!.lead ? item!.lead[locale] : item!.text[locale]}</span></li>
            ))}
          </ul>
          <p className="o4-tech__principle">{d.support[locale]}</p>
        </div>
        {foot(7, "dark")}
      </section>

      {/* 08 · THE LOCATION — the map large, ≈ 140 m to the stop, the verified routes, the district with the status of the plan */}
      <section className="o4-page o4-loc">
        {/* the website's transport map (R4): OSM geography in metres from the customer entrance — the stops, the walking route, the ring */}
        <figure className="o4-loc__map">
          {transit ? <MapSvg copy={transit} name={project.name} locale={locale} crop="wide" /> : <SiteMap slug={project.slug} name={project.name} label={x.address[locale]} />}
        </figure>
        <div className="o4-loc__copy">
          {kicker(8, d.sections.location[locale])}
          {statement(`${r.district[locale]}.\n${street(r.crossing[locale])}`, "o4-h2 o4-h2--loc")}
          <p className="o4-lead o4-loc__lead">{street(`${x.address[locale]}. ${x.location.lead[locale]} ${d.facade[locale]}.`)}</p>
          {walk ? (
            <div className="o4-walk">
              <p className="o4-walk__figure">{walk[0]}</p>
              <p className="o4-walk__text">{walk[1]}</p>
              <p className="o4-caption">{transit!.estimate[locale]}</p>
            </div>
          ) : null}
          {transit ? (
            <dl className="o4-routes">
              {transit.routes.map((route) => <div key={route.mode}><dt>{route.label[locale]}</dt><dd>{route.refs.join(`,${N}`)}</dd></div>)}
            </dl>
          ) : null}
        </div>
        <div className="o4-loc__district">
          {growth ? (
            <div className="o4-growth">
              <p className="o4-label">{growth.kicker[locale]}</p>
              <p className="o4-growth__title"><Accent text={growth.title[locale]} /></p>
              <p className="o4-small">{growth.lead[locale]}</p>
              <p className="o4-caption"><b>{growth.stateLabel[locale]}</b> {growth.state[locale]}</p>
            </div>
          ) : null}
        </div>
        {foot(8)}
      </section>

      {/* 09 · USE SCENARIOS — the five formats as an editorial index beside a tall interior: scenarios, never a confirmation of suitability */}
      <section className="o4-page o4-formats">
        {img("intLowerWide", "o4-formats__photo")}
        <div className="o4-formats__body">
          {kicker(9, o.scenarios.kicker[locale])}
          {statement(o.scenarios.title[locale])}
          {x.lens?.lead ? <p className="o4-lead">{x.lens.lead[locale].split(/(?<=\.)\s/)[0]}</p> : null}
          <ol className="o4-index">
            {formats.map((format, i) => {
              const ev = format.evidence.filter((e) => publishable(e.evidence))[0];
              return (
                <li key={format.key}>
                  <b>{String(i + 1).padStart(2, "0")}</b>
                  <div><h3>{format.label[locale]}</h3><p className="o4-index__q">{format.question[locale]}</p></div>
                  {ev ? <p className="o4-index__ev">{ev.title ? <strong>{ev.title[locale]}. </strong> : null}{ev.text[locale]}</p> : null}
                </li>
              );
            })}
          </ol>
          <p className="o4-notes">{x.lens?.honesty[locale]} {x.lens?.regulated[locale]}</p>
        </div>
        {foot(9)}
      </section>

      {/* 10 · THE INVITATION — burgundy panel: one thesis, the viewing, the contacts once, the QR; the architecture beside */}
      <section className="o4-page o4-final">
        <div className="o4-final__panel">
          {kicker(10, d.sections.next[locale], "is-dark")}
          {statement(r.finalTitle[locale].replace(/Moscova\s+20/, `Moscova${N}20`), "o4-final__title")}
          <p className="o4-final__lead">{r.finalSupport[locale]}</p>
          <div className="o4-cta">
            <a className="o4-cta__primary" href={`${packUrl}#book`}>{r.ctaPrimary[locale]}<span aria-hidden="true">→</span></a>
            <a className="o4-cta__secondary" href={`${packUrl}#precheck`}>{o.technical.consult[locale]}<span aria-hidden="true">→</span></a>
          </div>
          <div className="o4-final__grid">
            <ul className="o4-contacts">
              <li><a href={contactLinks.mobile}><UtilityIcon name="phone" size={12} />{company.mobile.value[locale]}</a></li>
              <li><a href={contactLinks.landline}><UtilityIcon name="phone" size={12} />{company.landline.value[locale]}</a></li>
              <li><a href={mailto}><UtilityIcon name="mail" size={12} />{company.email.value[locale]}</a></li>
              <li><a href={propertyUrl}><UtilityIcon name="link" size={12} />{r.site[locale]}</a></li>
              <li className="is-quiet">e‑Cadastru · <a href={eCadastruPortal}>{number}</a></li>
            </ul>
            <div className="o4-qr">
              <a href={packUrl}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={m20Toolkit.qr.svg} alt="QR" />
              </a>
              <p><b>{r.qrCaption[locale]}</b><a href={packUrl}>{`${new URL(packUrl).host}${new URL(packUrl).pathname}`.split("/").map((part, i, all) => <span key={i}>{part}{i < all.length - 1 ? <>/<wbr /></> : null}</span>)}</a></p>
            </div>
          </div>
        </div>
        {img("intStairDetail", "o4-final__photo")}
        {foot(10, "dark")}
      </section>
    </main>
  );
}
