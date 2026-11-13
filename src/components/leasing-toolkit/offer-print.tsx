import type { CSSProperties } from "react";
import { accentLast } from "@/components/accent";
import { templateOffer } from "@/components/leasing-experience/offer";
import { pathOf } from "@/components/leasing-experience/photo-scene";
import { SiteMap } from "@/components/site-map";
import { UtilityIcon } from "@/components/utility-icons";
import { formatAreaExact, getProject, getSpace } from "@/content/source";
import { company, contactLinks } from "@/data/demo-content";
import { publishable, type Pt, type VisibilityMark } from "@/data/leasing-experience-model";
import { moscova20Experience as x } from "@/data/leasing-experience-moscova-20";
import { commercialCopy as c, euro, m20Commercial, perMonth, rateParts, rentCalculation } from "@/data/moscova-20-commercial";
import { offerCopy as o } from "@/data/moscova-20-offer";
import { m20Toolkit, toolkitCopy } from "@/data/moscova-20-toolkit";
import { moscova20Transport } from "@/data/moscova-20-transport";
import { cadastreNumbers, eCadastruPortal } from "@/data/property-trust";
import { localePath, publicAsset, type SiteLocale } from "@/lib/site-data";
import "@/app/offer-r3.css";

/**
 * COMMERCIAL OFFER · BROCHURE R3 — the A4 source of the PDF (OWNER «CORRECTIVE PASS · VISUAL & COMMERCIAL REWORK», 2026-11-13, §05:
 * «не частичная правка — полноценный redesign»). An institutional commercial real-estate brochure on the MEGAPARC palette — warm
 * paper, stone, sand, blush, burgundy, oxblood, graphite — with the architecture large and the figures leading. Ten pages:
 *   01 cover (photograph + burgundy panel: name, area, the two rates) · 02 the address (the annotated aerial, the five marks, three
 *   reasons) · 03 the space (interiors, the three levels, what is offered) · 04 commercial terms (rates, the preliminary total, the
 *   deposit, the expense regime, indexation) · 05 · 06 the official plans · 07 technical readiness (key facts + the infrastructure
 *   cards) · 08 location (map, the nearest stop, the routes) · 09 use scenarios (the five formats) · 10 the next step.
 * Every fact is read from the approved data: the unit record, the passport, the commercial module, the transport research layer,
 * the cadastral registry; the aerial marks are the same records as the website's annotation. Real OWNER photographs only; the
 * official drawings are never redrawn. Every URL, e-mail and telephone is a real absolute link (URI annotations in the PDF).
 * Printed by scripts/moscova-20-dossier.mjs --route offer-print --dir offer/r3 --name moscova-20-commercial-offer --suffix r3.
 */
const ORIGIN = "https://www.megaparc.md";
const PAGES = m20Commercial.offer.pages;
const N = " ";
const intl: Record<SiteLocale, string> = { ro: "ro-RO", ru: "ru-RU", en: "en-GB" };
/** the print derivative of an OWNER photograph or official drawing (scripts/moscova-20-offer-assets.mjs) — same frame, JPEG for a light PDF */
const printSrc = (id: string) => publicAsset(`/assets/leasing/moscova-20/offer/r2/img/${id}.jpg`);
const metres = (m: number, locale: SiteLocale) => m.toLocaleString(intl[locale], { minimumFractionDigits: 1, maximumFractionDigits: 1 });
const tick = (a: Pt, b: Pt, size = 9) => {
  const ang = Math.atan2(b[1] - a[1], b[0] - a[0]) + Math.PI / 2;
  const dx = size * Math.cos(ang), dy = size * Math.sin(ang);
  return `M${(a[0] - dx).toFixed(1)} ${(a[1] - dy).toFixed(1)} L${(a[0] + dx).toFixed(1)} ${(a[1] + dy).toFixed(1)}`;
};

/** The annotated aerial for print — the same marks as the website (R8 §01), drawn as one SVG so the PDF stays vector-sharp. */
function AerialPrint({ marks, name, locale }: { marks: VisibilityMark[]; name: string; locale: SiteLocale }) {
  const v = x.motion.visibility!;
  const photo = x.photos[v.photo];
  const { width: w, height: h } = photo;
  const object = marks.find((mark) => mark.kind === "object");
  const outside = object ? `M0 0 H${w} V${h} H0 Z ${pathOf(object.shape)}` : "";
  return (
    <figure className="o3-aerial">
      <svg viewBox={`0 0 ${w} ${h}`} role="img" aria-label={photo.alt[locale]}>
        <image href={printSrc(photo.id)} x="0" y="0" width={w} height={h} preserveAspectRatio="none" />
        {object ? <path d={outside} fillRule="evenodd" fill="rgba(24, 25, 28, .42)" /> : null}
        {object ? <path d={pathOf(object.shape)} fill="rgba(245, 242, 236, .08)" stroke="#f5f2ec" strokeWidth="2.4" strokeLinejoin="miter" /> : null}
        {object?.edge ? <path d={pathOf(object.edge, false)} fill="none" stroke="rgba(245, 242, 236, .6)" strokeWidth="1.5" /> : null}
        {marks.filter((mark) => mark.kind === "glazing" && mark.shape.length > 1).map((mark) => (
          <path key={mark.key} d={`${pathOf(mark.shape, false)} ${tick(mark.shape[0], mark.shape[1])} ${tick(mark.shape[mark.shape.length - 1], mark.shape[mark.shape.length - 2])}`} fill="none" stroke="#f5f2ec" strokeWidth="1.8" />
        ))}
        {marks.map((mark) => mark.pin ? (
          <g key={mark.key}>
            <path d={pathOf([mark.pin, mark.at], false)} stroke="rgba(245, 242, 236, .92)" strokeWidth="1.5" fill="none" />
            <circle cx={mark.pin[0]} cy={mark.pin[1]} r={mark.kind === "object" ? 6.5 : 4.6} fill={mark.kind === "object" ? "#74202f" : "#f5f2ec"} stroke={mark.kind === "object" ? "#f5f2ec" : "none"} strokeWidth="2" />
          </g>
        ) : null)}
        {marks.map((mark, i) => (
          <g key={mark.key}>
            <circle cx={mark.at[0]} cy={mark.at[1]} r="17" fill={mark.kind === "object" ? "#74202f" : "rgba(20, 21, 24, .84)"} stroke="#f5f2ec" strokeWidth="1.6" />
            <text x={mark.at[0]} y={mark.at[1] + 5.6} textAnchor="middle" fill="#fff" fontSize="16" fontWeight="700" fontFamily="Manrope, Arial, sans-serif">{i + 1}</text>
          </g>
        ))}
        {object ? <text x={object.at[0] + 30} y={object.at[1] + 6} fill="#f5f2ec" fontSize="19" fontWeight="700" letterSpacing="4" fontFamily="Manrope, Arial, sans-serif">{name.toUpperCase()}</text> : null}
      </svg>
    </figure>
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
  const height = (n: number, approx: boolean) => `${approx ? "≈ " : ""}${metres(n, locale)} ${m}`;
  const floors = offer.breakdown.filter((level) => level.height);
  const heights = `${floors.some((l) => l.heightEvidence === "APPROXIMATE") ? "≈ " : ""}${floors.map((l) => metres(l.height!, locale)).join(" / ")}`;
  const facts = passport.facts.filter((fact) => publishable(fact.evidence));
  const cards = (passport.ready.cards ?? []).filter((card) => publishable(card.evidence));
  const levels = x.plans.levels.filter((level) => level.drawing);
  const points = x.location.points.filter((p) => publishable(p.evidence));
  const marks = (x.motion.visibility?.marks ?? []).filter((mark) => publishable(mark.evidence));
  const transit = x.motion.transit;
  const nearest = moscova20Transport.stops.find((stop) => stop.role === "nearest");
  const walk = transit && nearest?.walkM ? transit.walkValue[locale].replace("{m}", String(Math.round(nearest.walkM / 10) * 10)).replace("{min}", String(nearest.walkMin ?? "")).split("|") : null;
  const formats = x.lens?.formats ?? [];
  const mailto = `${contactLinks.email}?subject=${encodeURIComponent(o.mailSubject[locale])}`;
  const photo = (key: string) => x.photos[key];
  const titleLines = x.hero.title[locale].split("\n");

  const foot = (n: number, dark = false) => (
    <footer className={`o3-foot${dark ? " is-dark" : ""}`}>
      <span>{r.footerMark[locale]}</span>
      <span>{m20Commercial.offer.version} · {m20Commercial.offer.updated} · {n} / {PAGES}</span>
    </footer>
  );
  const head = (n: number, kicker: string, title: string) => (
    <header className="o3-head">
      <p className="o3-kicker"><b>{String(n).padStart(2, "0")}</b>{kicker}</p>
      <h2 className="o3-title">{title.split("\n").map((line, i, all) => <span key={line}>{accentLast(all, i, line)}</span>)}</h2>
    </header>
  );
  const img = (key: string, className: string, style?: CSSProperties) => (
    <figure className={`o3-img ${className}`} style={style}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={printSrc(photo(key).id)} alt={photo(key).alt[locale]} style={photo(key).position ? { objectPosition: photo(key).position } : undefined} />
    </figure>
  );
  const rate = (key: "ground" | "lower") => rateParts(m20Commercial.rates[key], locale);

  return (
    <main className="o3" lang={locale}>
      {/* 01 · COVER — the architecture, then the offer on a burgundy panel */}
      <section className="o3-page o3-cover">
        {img("entranceProcessed", "o3-cover__photo")}
        <div className="o3-cover__panel">
          <p className="o3-kicker is-light">{o.kicker[locale]}</p>
          <h1 className="o3-cover__name">Moscova 20</h1>
          <p className="o3-cover__statement">{titleLines.map((line, i, all) => <span key={line}>{accentLast(all, i, line)} </span>)}</p>
          <div className="o3-cover__row">
            <div className="o3-cover__area">
              <p className="o3-cover__figure"><strong>{offer.figure.replace(/\s*(м²|m²)$/, "")}</strong><span>{sq}</span></p>
              <p className="o3-cover__meta">{x.hero.offer[locale]} · {o.coverLevels[locale]}</p>
            </div>
            <dl className="o3-cover__rates">
              {(["ground", "lower"] as const).map((key) => (
                <div key={key}><dt>{c.level[key][locale]}</dt><dd><strong>{rate(key).figure}</strong><span>{rate(key).unit}</span></dd></div>
              ))}
              <p className="o3-cover__vat">{c.vat[locale]}</p>
            </dl>
          </div>
          <div className="o3-cover__brand">
            <span className="o3-brand">MEGAPARC<i /></span>
            <span>{o.coverPlace[locale]}</span>
            <span>{m20Commercial.offer.version} · {m20Commercial.offer.updated}</span>
          </div>
        </div>
      </section>

      {/* 02 · THE ADDRESS — the annotated aerial, its five marks, three reasons */}
      <section className="o3-page">
        {head(2, o.opportunity.kicker[locale], o.opportunity.title[locale])}
        <AerialPrint marks={marks} name={project.name} locale={locale} />
        <ol className="o3-legend" aria-label={o.aerialLegend[locale]}>
          {marks.map((mark, i) => <li key={mark.key} className={i === 0 ? "is-object" : undefined}><b>{i + 1}</b><span>{mark.label[locale]}</span></li>)}
        </ol>
        <p className="o3-caption">{x.motion.visibility?.caption[locale]}</p>
        <ol className="o3-why">
          {c.why.items.map((item, i) => (
            <li key={item.key} className={`o3-tone is-${["burgundy", "stone", "graphite"][i] ?? "paper"}`}><b>{String(i + 1).padStart(2, "0")}</b><h3>{item.title[locale]}</h3><p>{item.text[locale]}</p></li>
          ))}
        </ol>
        {foot(2)}
      </section>

      {/* 03 · THE SPACE — interiors, the three levels, what is offered */}
      <section className="o3-page">
        {head(3, o.space.kicker[locale], `${offer.figure}.\n${o.space.statement[locale]}`)}
        <div className="o3-duo">
          {img("intGroundHall", "o3-duo__main")}
          <div className="o3-duo__side">
            {img("intLowerWide", "")}
            {img("intGroundGlazing", "")}
          </div>
        </div>
        <div className="o3-levels">
          {offer.breakdown.map((level, i) => (
            <article key={level.key} className={`o3-tone is-${["stone", "sand", "paper"][i] ?? "paper"}${level.key === "terrace" ? " is-dashed" : ""}`}>
              <p className="o3-label">{level.label[locale]}</p>
              <p className="o3-big">{area(level.area).replace(/\s*(м²|m²)$/, "")}<span>{sq}</span></p>
              <dl className="o3-rows">
                {level.useful ? <div><dt>{d.useful[locale]}</dt><dd>{area(level.useful)}</dd></div> : null}
                {level.height ? <div><dt>{d.height[locale]}</dt><dd>{height(level.height, level.heightEvidence === "APPROXIMATE")}</dd></div> : null}
              </dl>
            </article>
          ))}
        </div>
        <div className="o3-strip o3-tone is-burgundy">
          <p className="o3-label">{o.space.total[locale]}</p>
          <p><strong>{offer.figure}</strong>{offer.usefulArea ? <span>{area(offer.usefulArea)} · {r.commercial[locale]}</span> : null}</p>
        </div>
        <p className="o3-note">{x.area.propertyLine[locale]} {x.plans.note[locale]}</p>
        {img("intLowerDepth", "o3-band o3-grow")}
        {foot(3)}
      </section>

      {/* 04 · COMMERCIAL TERMS — rates · the preliminary total · deposit · expenses · indexation */}
      <section className="o3-page o3-terms">
        {head(4, c.kicker[locale], c.title[locale])}
        <div className="o3-rates">
          {calc.lines.map((line) => {
            const parts = rateParts(line.rate, locale);
            return (
              <article key={line.key} className={`o3-tone is-${line.key === "ground" ? "burgundy" : "stone"}`}>
                <p className="o3-label">{line.label}</p>
                <p className="o3-rate"><strong>{parts.figure}</strong><span>{parts.unit}</span></p>
                <p className="o3-rate__vat">{c.vatInline[locale]}</p>
                <dl className="o3-rows">
                  <div><dt>{c.area[locale]}</dt><dd>{area(line.area)}</dd></div>
                  <div><dt>{c.monthly[locale]}</dt><dd>{euro(line.monthly, locale)}</dd></div>
                </dl>
              </article>
            );
          })}
          {calc.terrace ? (
            <article className="o3-tone is-paper is-dashed">
              <p className="o3-label">{calc.terrace.label}</p>
              <p className="o3-pending">{c.terraceShort[locale]}</p>
              <dl className="o3-rows"><div><dt>{c.area[locale]}</dt><dd>{area(calc.terrace.area)}</dd></div></dl>
            </article>
          ) : null}
        </div>
        <div className="o3-total o3-tone is-graphite">
          <div>
            <p className="o3-label">{c.total[locale]}</p>
            <p className="o3-total__figure"><strong>{euro(calc.monthly, locale)}</strong><span>{perMonth[locale]} · {c.vatInline[locale]}</span></p>
            <p className="o3-total__sum">{calc.lines.map((line) => euro(line.monthly, locale)).join(" + ")}</p>
          </div>
          <div className="o3-total__annual">
            <p className="o3-label">{c.annual[locale]}</p>
            <p><strong>{euro(calc.annual, locale)}</strong> <span>{c.vatInline[locale]}</span></p>
          </div>
        </div>
        <div className="o3-terms3">
          <article className="o3-tone is-blush">
            <p className="o3-label">{c.depositLabel[locale]}</p>
            <p className="o3-term"><strong>{c.depositFigure[locale]}</strong><span>{c.depositUnit[locale]}</span></p>
          </article>
          <article className="o3-tone is-stone">
            <p className="o3-label">{c.utilitiesLabel[locale]}</p>
            <p className="o3-term is-text"><strong>{c.utilitiesShort[locale]}</strong></p>
            <p className="o3-small">{c.otherExpenses[locale]}</p>
          </article>
          <article className="o3-tone is-paper">
            <p className="o3-label">{c.feeLabel[locale]}</p>
            <p className="o3-term"><strong>{c.feeFigure[locale]}</strong><span>{c.feeUnit[locale]}</span></p>
          </article>
        </div>
        <div className="o3-index">
          <p className="o3-label">{c.indexationTitle[locale]}</p>
          <p>{c.indexation[locale]}</p>
        </div>
        <ul className="o3-notes">
          <li>{c.basisNote[locale]}</li>
          <li>{c.vatNote[locale]}</li>
          {calc.terrace ? <li>{c.terraceNote[locale]}</li> : null}
        </ul>
        {img("intLowerExit", "o3-band o3-grow")}
        {foot(4)}
      </section>

      {/* 05 · 06 · THE OFFICIAL PLANS — each drawing on its own page, never redrawn, with the room schedule */}
      {levels.map((level, i) => {
        const drawing = photo(level.drawing!.photo);
        const br = offer.breakdown.find((b) => b.key === level.key);
        const pdf = `${ORIGIN}${level.drawing!.pdf.replace(/^.*?\/assets/, "/assets")}`;
        const mark = locale === "en" ? level.mark.replace(/,/g, ".") : level.mark;
        return (
          <section key={level.key} className={`o3-page o3-planpage is-${level.key}`}>
            {head(5 + i, `${d.sections.plans[locale]} · ${mark}`, level.label[locale])}
            {br ? (
              <dl className="o3-planfacts">
                <div className="o3-tone is-stone"><dt>{r.total[locale]}</dt><dd>{area(br.area)}</dd></div>
                {br.useful ? <div className="o3-tone is-sand"><dt>{r.commercial[locale]}</dt><dd>{area(br.useful)}</dd></div> : null}
                {br.height ? <div className="o3-tone is-paper"><dt>{r.height[locale]}</dt><dd>{height(br.height, br.heightEvidence === "APPROXIMATE")}</dd></div> : null}
                <div className="o3-tone is-burgundy"><dt>{c.rate[locale]}</dt><dd>{rate(level.key === "lower" ? "lower" : "ground").figure}<small>{rate(level.key === "lower" ? "lower" : "ground").unit}</small></dd></div>
              </dl>
            ) : null}
            <figure className="o3-plan">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={printSrc(drawing.id)} alt={drawing.alt[locale]} />
            </figure>
            <p className="o3-caption">{r.planLegend[locale]} · <a href={pdf}>{r.openPlan[locale]}</a></p>
            <p className="o3-label o3-label--rule">{o.schedule[locale]}</p>
            <ul className="o3-rooms">
              {level.zones.map((zone) => (
                <li key={zone.key}><b>{zone.no ?? "·"}</b><span>{zone.label[locale]}</span><i>{zone.area ? area(zone.area) : ""}</i></li>
              ))}
            </ul>
            {level.key === "lower" ? img("intLowerColumns", "o3-band o3-grow") : null}
            {foot(5 + i)}
          </section>
        );
      })}

      {/* 07 · TECHNICAL READINESS — the key facts and the infrastructure cards */}
      <section className="o3-page">
        {head(7, d.sections.technical[locale], o.technical.title[locale])}
        <div className="o3-facts">
          {facts.map((fact, i) => (
            <div key={fact.key} className={`o3-tone is-${["paper", "stone", "burgundy", "graphite"][i] ?? "paper"}`}>
              <p className="o3-label">{(fact.name ?? fact.label)[locale]}</p>
              <p className="o3-fact">{fact.figure === "heights" ? heights : fact.figure[locale]}<span>{fact.unit[locale]}</span></p>
              {fact.name ? <p className="o3-small">{fact.label[locale]}</p> : null}
            </div>
          ))}
        </div>
        <p className="o3-label o3-label--rule">{passport.ready.title[locale]}</p>
        <ul className="o3-infra">
          {cards.map((card, i) => (
            <li key={card.key} data-card={card.key} className="o3-tone">
              <p className="o3-label"><b>{String(i + 1).padStart(2, "0")}</b>{card.title[locale]}</p>
              <p className="o3-infra__value">{card.value[locale]}</p>
              <p className="o3-small">{card.text[locale]}</p>
            </li>
          ))}
        </ul>
        <p className="o3-principle o3-tone is-burgundy">{d.support[locale]}</p>
        {foot(7)}
      </section>

      {/* 08 · LOCATION — the address on the map, the nearest stop, the verified routes, the confirmed arguments */}
      <section className="o3-page">
        {head(8, d.sections.location[locale], `${r.district[locale]}.\n${r.crossing[locale]}`)}
        <div className="o3-loc">
          <div className="o3-loc__map"><SiteMap slug={project.slug} name={project.name} label={x.address[locale]} /></div>
          <div className="o3-loc__copy">
            {walk ? (
              <div className="o3-walk o3-tone is-burgundy">
                <p className="o3-walk__figure">{walk[0]}</p>
                <p className="o3-walk__text">{walk[1]}</p>
                <p className="o3-walk__note">{transit!.estimate[locale]}</p>
              </div>
            ) : null}
            {transit ? (
              <dl className="o3-routes o3-tone is-stone">
                {transit.routes.map((route) => <div key={route.mode}><dt>{route.label[locale]}</dt><dd>{route.refs.join(`,${N}`)}</dd></div>)}
              </dl>
            ) : null}
          </div>
        </div>
        <p className="o3-lead">{x.address[locale]}. {x.location.lead[locale]}</p>
        <ul className="o3-points">
          {points.map((p) => <li key={p.text.en}>{p.text.en === "A highly visible frontage" ? d.facade[locale] : p.text[locale]}</li>)}
        </ul>
        {img("intLowerStairHall", "o3-band o3-grow")}
        {foot(8)}
      </section>

      {/* 09 · USE SCENARIOS — the five formats of the lens: possible scenarios, never a confirmation of suitability */}
      <section className="o3-page">
        {head(9, o.scenarios.kicker[locale], o.scenarios.title[locale])}
        {/* the first sentence only: the rest of the website lead invites a choice that a PDF cannot offer */}
        {x.lens?.lead ? <p className="o3-lead">{x.lens.lead[locale].split(/(?<=\.)\s/)[0]}</p> : null}
        <ol className="o3-formats">
          {formats.map((format, i) => {
            const evs = format.evidence.filter((e) => publishable(e.evidence)).slice(0, 2);
            return (
              <li key={format.key} className={`o3-tone is-${["burgundy", "stone", "graphite", "blush", "sand"][i] ?? "paper"}`}>
                <b>{String(i + 1).padStart(2, "0")}</b>
                <h3>{format.label[locale]}</h3>
                <p className="o3-formats__q">{format.question[locale]}</p>
                {evs.length ? <ul className="o3-formats__ev">{evs.map((ev, k) => <li key={k} className="o3-small">{ev.title ? <strong>{ev.title[locale]}. </strong> : null}{ev.text[locale]}</li>)}</ul> : null}
              </li>
            );
          })}
        </ol>
        <p className="o3-note">{x.lens?.honesty[locale]} {x.lens?.regulated[locale]}</p>
        {foot(9)}
      </section>

      {/* 10 · THE NEXT STEP — one photograph, a burgundy panel: two actions, the contacts once, the QR */}
      <section className="o3-page o3-final">
        {img("intStairDetail", "o3-final__photo")}
        <div className="o3-final__panel">
          <p className="o3-kicker is-light"><b>10</b>{d.sections.next[locale]}</p>
          <h2 className="o3-final__title">{accentLast([r.finalTitle[locale]], 0, r.finalTitle[locale])}</h2>
          <p className="o3-final__lead">{r.finalSupport[locale]}</p>
          <div className="o3-cta">
            <a className="o3-cta__primary" href={`${packUrl}#book`}>{r.ctaPrimary[locale]}</a>
            <a className="o3-cta__secondary" href={`${packUrl}#precheck`}>{o.technical.consult[locale]}</a>
          </div>
          <div className="o3-final__grid">
            <ul className="o3-contacts">
              <li><a href={contactLinks.mobile}><UtilityIcon name="phone" size={13} />{company.mobile.value[locale]}</a></li>
              <li><a href={contactLinks.landline}><UtilityIcon name="phone" size={13} />{company.landline.value[locale]}</a></li>
              <li><a href={mailto}><UtilityIcon name="mail" size={13} />{company.email.value[locale]}</a></li>
              <li><a href={propertyUrl}><UtilityIcon name="link" size={13} />{r.site[locale]}</a></li>
              <li className="is-quiet">e‑Cadastru · <a href={eCadastruPortal}>{number}</a></li>
            </ul>
            <div className="o3-qr">
              <a href={packUrl}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={m20Toolkit.qr.svg} alt="QR" />
              </a>
              <p><b>{r.qrCaption[locale]}</b><a href={packUrl}>{new URL(packUrl).host}{new URL(packUrl).pathname}</a></p>
            </div>
          </div>
        </div>
        {foot(10, true)}
      </section>
    </main>
  );
}
