import { accentLast } from "@/components/accent";
import { templateOffer } from "@/components/leasing-experience/offer";
import { SiteMap } from "@/components/site-map";
import { UtilityIcon } from "@/components/utility-icons";
import { formatAreaExact, getProject, getSpace } from "@/content/source";
import { company, contactLinks } from "@/data/demo-content";
import { publishable } from "@/data/leasing-experience-model";
import { moscova20Experience as x } from "@/data/leasing-experience-moscova-20";
import { commercialCopy as c, euro, m20Commercial, perMonth, rateParts, rentCalculation } from "@/data/moscova-20-commercial";
import { offerCopy as o } from "@/data/moscova-20-offer";
import { m20Toolkit, toolkitCopy } from "@/data/moscova-20-toolkit";
import { cadastreNumbers, eCadastruPortal } from "@/data/property-trust";
import { locationTraffic } from "@/data/tenant-intelligence";
import { localePath, publicAsset, type SiteLocale } from "@/lib/site-data";
import "@/app/offer-r2.css";

/**
 * COMMERCIAL OFFER · BROCHURE R2 — the A4 source of the PDF (OWNER mandates R6 «PREMIUM COMMERCIAL OFFER PDF» and R7 «COMMERCIAL
 * BROCHURE R2», 2026-11-12): one document, an architectural editorial with commercial clarity. Nine pages:
 *   01 cover · 02 the opportunity · 03 property & space · 04 commercial terms · 05 the ground-floor plan · 06 the lower-ground plan
 *   and the terrace · 07 technical readiness · 08 location · 09 the next step.
 * (R7 names eight pages and allows dedicated plan pages where legibility needs them — the two official drawings each take a page.)
 * Every fact is read from the approved data: the unit record (areas, heights), the passport (technical facts and cards), the
 * commercial module (the two approved rates, the preliminary calculation, the indexation wording), the cadastral registry. Real
 * OWNER photographs of Moscova 20 only; the official drawings are never redrawn. Every URL, e-mail and telephone is a real absolute
 * link (URI annotations in the PDF). Printed by scripts/moscova-20-dossier.mjs --route offer-print; the route is internal and never
 * in the production artifact; the files are OWNER-review candidates until an OWNER GO.
 */
const ORIGIN = "https://www.megaparc.md";
const PAGES = m20Commercial.offer.pages;
const intl: Record<SiteLocale, string> = { ro: "ro-RO", ru: "ru-RU", en: "en-GB" };
/** the print derivative of an OWNER photograph or official drawing (scripts/moscova-20-offer-assets.mjs) — same frame, JPEG for a light PDF */
const printSrc = (id: string) => publicAsset(`/assets/leasing/moscova-20/offer/r2/img/${id}.jpg`);
const metres = (m: number, locale: SiteLocale) => m.toLocaleString(intl[locale], { minimumFractionDigits: 1, maximumFractionDigits: 1 });

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
  const floors = offer.breakdown.filter((level) => level.height);
  const heights = `${floors.some((l) => l.heightEvidence === "APPROXIMATE") ? "≈ " : ""}${floors.map((l) => metres(l.height!, locale)).join(" / ")}`;
  const facts = passport.facts.filter((fact) => publishable(fact.evidence));
  const cards = (passport.ready.cards ?? []).filter((card) => publishable(card.evidence));
  const levels = x.plans.levels.filter((level) => level.drawing);
  const points = x.location.points.filter((p) => publishable(p.evidence));
  const traffic = locationTraffic[x.project];
  const mailto = `${contactLinks.email}?subject=${encodeURIComponent(o.mailSubject[locale])}`;
  const photo = (key: string) => x.photos[key];
  const titleLines = x.hero.title[locale].split("\n");

  const foot = (n: number) => (
    <footer className="o2-foot">
      <span>{r.footerMark[locale]}</span>
      <span>{m20Commercial.offer.version} · {m20Commercial.offer.updated} · {n} / {PAGES}</span>
    </footer>
  );
  const head = (n: number, kicker: string, title: string) => (
    <header className="o2-head">
      <p className="o2-kicker"><b>{String(n).padStart(2, "0")}</b>{kicker}</p>
      <h2 className="o2-title">{title.split("\n").map((line, i, all) => <span key={line}>{accentLast(all, i, line)}</span>)}</h2>
    </header>
  );
  const img = (key: string, className: string) => (
    <figure className={`o2-img ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={printSrc(photo(key).id)} alt={photo(key).alt[locale]} style={photo(key).position ? { objectPosition: photo(key).position } : undefined} />
    </figure>
  );

  return (
    <main className="o2" lang={locale}>
      {/* 01 · COVER — the architecture first, then one editorial block on ivory */}
      <section className="o2-page o2-cover">
        {img("entranceProcessed", "o2-cover__photo")}
        <div className="o2-cover__body">
          <p className="o2-kicker">{o.kicker[locale]}</p>
          <h1 className="o2-cover__name">Moscova 20</h1>
          <p className="o2-cover__statement">{titleLines.map((line, i, all) => <span key={line}>{accentLast(all, i, line)} </span>)}</p>
          <div className="o2-cover__row">
            <p className="o2-cover__figure"><strong>{offer.figure.replace(/\s*(м²|m²)$/, "")}</strong><span>{sq}</span></p>
            <p className="o2-cover__meta"><b>{x.hero.offer[locale]}</b>{o.coverLevels[locale]}<br />{o.coverPlace[locale]}</p>
          </div>
          <div className="o2-cover__brand">
            <span className="o2-brand">MEGAPARC<i /></span>
            <span>{m20Commercial.offer.version} · {m20Commercial.offer.updated}</span>
          </div>
        </div>
      </section>

      {/* 02 · THE OPPORTUNITY — why this address */}
      <section className="o2-page">
        {head(2, o.opportunity.kicker[locale], o.opportunity.title[locale])}
        {img("context", "o2-wide")}
        <p className="o2-caption">{photo("context").alt[locale]}</p>
        <ol className="o2-why">
          {c.why.items.map((item, i) => (
            <li key={item.key}><b>{String(i + 1).padStart(2, "0")}</b><div><h3>{item.title[locale]}</h3><p>{item.text[locale]}</p></div></li>
          ))}
        </ol>
        <div className="o2-split">
          <div>
            <p className="o2-label">{d.sections.location[locale]}</p>
            <p className="o2-lead">{x.address[locale]}. {x.location.lead[locale]}</p>
          </div>
          <div>
            <p className="o2-label">{d.sections.access[locale]}</p>
            <p className="o2-lead">{x.access.find((a) => a.key === "customer")?.value[locale]}</p>
          </div>
        </div>
        {foot(2)}
      </section>

      {/* 03 · PROPERTY & SPACE — the area schedule and the real interiors */}
      <section className="o2-page">
        {head(3, o.space.kicker[locale], `${offer.figure}.\n${o.space.statement[locale]}`)}
        <div className="o2-duo">
          {img("intGroundHall", "o2-duo__main")}
          <div className="o2-duo__side">
            {img("intLowerWide", "o2-duo__small")}
            {img("intGroundGlazing", "o2-duo__small")}
          </div>
        </div>
        <table className="o2-schedule">
          <thead><tr><th>{d.level[locale]}</th><th>{d.gross[locale]}</th><th>{d.useful[locale]}</th><th>{d.height[locale]}</th></tr></thead>
          <tbody>
            {offer.breakdown.map((level) => (
              <tr key={level.key}>
                <th>{level.label[locale]}</th>
                <td>{area(level.area)}</td>
                <td>{level.useful ? area(level.useful) : "—"}</td>
                <td>{level.height ? `${level.heightEvidence === "APPROXIMATE" ? "≈ " : ""}${metres(level.height, locale)} ${m}` : "—"}</td>
              </tr>
            ))}
            <tr className="is-total"><th>{o.space.total[locale]}</th><td>{offer.figure}</td><td>{offer.usefulArea ? area(offer.usefulArea) : "—"}</td><td /></tr>
          </tbody>
        </table>
        <p className="o2-note">{x.area.propertyLine[locale]} {x.plans.note[locale]}</p>
        {img("intLowerDepth", "o2-band o2-band--foot")}
        {foot(3)}
      </section>

      {/* 04 · COMMERCIAL TERMS — the two approved rates, the preliminary calculation, the caveats, the indexation */}
      <section className="o2-page o2-terms">
        {head(4, c.kicker[locale], c.title[locale])}
        <div className="o2-rates">
          {calc.lines.map((line) => {
            const rate = rateParts(line.rate, locale);
            return (
              <div key={line.key} className="o2-rate">
                <p className="o2-label">{line.label}</p>
                <p className="o2-rate__figure"><strong>{rate.figure}</strong><span>{rate.unit}</span></p>
                <p className="o2-rate__vat">{c.vatInline[locale]}</p>
              </div>
            );
          })}
        </div>
        <p className="o2-label o2-label--brand">{c.calcTitle[locale]}</p>
        <table className="o2-calc">
          <thead><tr><th>{d.level[locale]}</th><th>{c.area[locale]}</th><th>{c.rate[locale]}</th><th>{c.monthly[locale]}</th></tr></thead>
          <tbody>
            {calc.lines.map((line) => (
              <tr key={line.key}><th>{line.label}</th><td>{area(line.area)}</td><td>{rateParts(line.rate, locale).figure}</td><td>{euro(line.monthly, locale)}</td></tr>
            ))}
            {calc.terrace ? <tr className="is-quiet"><th>{calc.terrace.label}</th><td>{area(calc.terrace.area)}</td><td colSpan={2}>{c.terraceShort[locale]}</td></tr> : null}
          </tbody>
        </table>
        <div className="o2-total">
          <div>
            <p className="o2-label o2-label--brand">{c.total[locale]}</p>
            <p className="o2-total__figure"><strong>{euro(calc.monthly, locale)}</strong><span>{perMonth[locale]} · {c.vatInline[locale]}</span></p>
          </div>
          <div>
            <p className="o2-label">{c.annual[locale]}</p>
            <p className="o2-total__annual">{euro(calc.annual, locale)} <span>{c.vatInline[locale]}</span></p>
          </div>
        </div>
        <ul className="o2-notes">
          <li>{c.basisNote[locale]}</li>
          <li>{c.vatNote[locale]}</li>
          {calc.terrace ? <li>{c.terraceNote[locale]}</li> : null}
        </ul>
        <div className="o2-index">
          <p className="o2-label">{c.indexationTitle[locale]}</p>
          <p>{c.indexation[locale]}</p>
        </div>
        {foot(4)}
      </section>

      {/* 05 · 06 · THE OFFICIAL PLANS — each drawing on its own page, never redrawn, with the room schedule */}
      {levels.map((level, i) => {
        const drawing = photo(level.drawing!.photo);
        const br = offer.breakdown.find((b) => b.key === level.key);
        const pdf = `${ORIGIN}${level.drawing!.pdf.replace(/^.*?\/assets/, "/assets")}`;
        return (
          <section key={level.key} className={`o2-page o2-planpage is-${level.key}`}>
            {head(5 + i, `${toolkitCopy.dossier.sections.plans[locale]} · ${locale === "en" ? level.mark.replace(/,/g, ".") : level.mark}`, level.label[locale])}
            {br ? <p className="o2-plan__facts">{area(br.area)} {r.total[locale]}{br.useful ? ` · ${area(br.useful)} ${r.commercial[locale]}` : ""}{br.height ? ` · ${r.height[locale]} ${br.heightEvidence === "APPROXIMATE" ? "≈ " : ""}${metres(br.height, locale)} ${m}` : ""}</p> : null}
            <figure className="o2-plan">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={printSrc(drawing.id)} alt={drawing.alt[locale]} />
            </figure>
            <p className="o2-caption">{r.planLegend[locale]} · <a href={pdf}>{r.openPlan[locale]}</a></p>
            <p className="o2-label">{o.schedule[locale]}</p>
            <ul className="o2-rooms">
              {level.zones.map((zone) => (
                <li key={zone.key}><b>{zone.no ?? "·"}</b><span>{zone.label[locale]}</span><i>{zone.area ? area(zone.area) : ""}</i></li>
              ))}
            </ul>
            {level.key === "lower" ? img("intLowerColumns", "o2-band o2-band--foot") : null}
            {foot(5 + i)}
          </section>
        );
      })}

      {/* 07 · TECHNICAL READINESS — confirmed characteristics only */}
      <section className="o2-page">
        {head(7, d.sections.technical[locale], o.technical.title[locale])}
        <div className="o2-figs">
          {facts.map((fact) => (
            <div key={fact.key} className="o2-fig">
              <p className="o2-fig__value">{fact.figure === "heights" ? heights : fact.figure[locale]}<span>{fact.unit[locale]}</span></p>
              <p className="o2-fig__label">{(fact.name ?? fact.label)[locale]}</p>
            </div>
          ))}
        </div>
        <dl className="o2-cards">
          {cards.map((card) => (
            <div key={card.key}><dt>{card.title[locale]}</dt><dd><b>{card.value[locale]}</b>{card.text[locale]}</dd></div>
          ))}
        </dl>
        {img("intLowerExit", "o2-band")}
        <p className="o2-principle">{d.support[locale]}</p>
        {foot(7)}
      </section>

      {/* 08 · LOCATION — the address on the map, the confirmed arguments; no traffic or demographic figure */}
      <section className="o2-page">
        {head(8, d.sections.location[locale], `${r.district[locale]}.\n${r.crossing[locale]}`)}
        <div className="o2-loc">
          <div className="o2-loc__map"><SiteMap slug={project.slug} name={project.name} label={x.address[locale]} /></div>
          <div className="o2-loc__copy">
            <p className="o2-lead">{x.address[locale]}. {x.location.lead[locale]}</p>
            <ul className="o2-points">
              {points.map((p) => <li key={p.text.en}>{p.text.en === "A highly visible frontage" ? d.facade[locale] : p.text[locale]}</li>)}
            </ul>
            {traffic?.transportRoutes ? <p className="o2-transit"><b>{traffic.transportRoutes}</b>{o.location.routes[locale]}</p> : null}
          </div>
        </div>
        {img("intLowerStairHall", "o2-band o2-band--tall")}
        <p className="o2-caption">{photo("intLowerStairHall").alt[locale]}</p>
        {foot(8)}
      </section>

      {/* 09 · THE NEXT STEP — one photograph, two actions, the contacts once, the QR */}
      <section className="o2-page o2-final">
        {img("intStairDetail", "o2-final__photo")}
        <div className="o2-final__body">
          <p className="o2-kicker">{d.sections.next[locale]}</p>
          <h2 className="o2-final__title">{accentLast([r.finalTitle[locale]], 0, r.finalTitle[locale])}</h2>
          <p className="o2-lead o2-lead--wide">{r.finalSupport[locale]}</p>
          <div className="o2-cta">
            <a className="o2-cta__primary" href={`${packUrl}#book`}>{r.ctaPrimary[locale]}</a>
            <a className="o2-cta__secondary" href={`${packUrl}#precheck`}>{o.technical.consult[locale]}</a>
          </div>
          <div className="o2-final__grid">
            <ul className="o2-contacts">
              <li><a href={contactLinks.mobile}><UtilityIcon name="phone" size={13} />{company.mobile.value[locale]}</a></li>
              <li><a href={contactLinks.landline}><UtilityIcon name="phone" size={13} />{company.landline.value[locale]}</a></li>
              <li><a href={mailto}><UtilityIcon name="mail" size={13} />{company.email.value[locale]}</a></li>
              <li><a href={propertyUrl}><UtilityIcon name="link" size={13} />{r.site[locale]}</a></li>
              <li className="is-quiet">e‑Cadastru · <a href={eCadastruPortal}>{number}</a></li>
            </ul>
            <div className="o2-qr">
              <a href={packUrl}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={m20Toolkit.qr.svg} alt="QR" />
              </a>
              <p><b>{r.qrCaption[locale]}</b><a href={packUrl}>{new URL(packUrl).host}{new URL(packUrl).pathname}</a></p>
            </div>
          </div>
        </div>
        {foot(9)}
      </section>
    </main>
  );
}
