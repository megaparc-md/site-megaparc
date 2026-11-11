import { templateOffer } from "@/components/leasing-experience/offer";
import { SiteMap } from "@/components/site-map";
import { UtilityIcon } from "@/components/utility-icons";
import { formatAreaExact, getProject, getSpace } from "@/content/source";
import { assetOccupancy, company, contactLinks } from "@/data/demo-content";
import { publishable } from "@/data/leasing-experience-model";
import { moscova20Experience as x } from "@/data/leasing-experience-moscova-20";
import { m20Toolkit, toolkitCopy } from "@/data/moscova-20-toolkit";
import { cadastreNumbers, eCadastruPortal } from "@/data/property-trust";
import { localePath, publicAsset, type SiteLocale } from "@/lib/site-data";
import "@/app/dossier-r2.css";

/**
 * LEASING DOSSIER R2 — the A4 source of the PDF (OWNER «MOSCOVA 20 PREMIUM LEASING DOSSIER R2», 2026-11-11): a design pass on
 * the factually approved dossier. FEWER · LARGER · STRONGER — ten pages with an editorial rhythm: 01 cover (photograph · statement) ·
 * 02 photo page · 03 key figures · 04 area hierarchy · 05–06 the official plans (dominant, never redrawn) · 07 engineering
 * specification · 08 readiness · 09 logistics + address · 10 the decision page (viewing · feasibility · contacts · share · QR).
 * Every fact is read from the approved dataset (unit record, passport, cadastral registry); nothing is typed here. Every URL,
 * e-mail, telephone, share action and plan reference is a real absolute link → URI annotations in the PDF. Printed by
 * scripts/moscova-20-dossier.mjs (headless Chrome, A4); the route is internal and never in the production artifact; the R2
 * files are OWNER-preview candidates (`-r2.pdf`) until the OWNER replaces the live dossier.
 */
const ORIGIN = "https://www.megaparc.md";
const intl: Record<SiteLocale, string> = { ro: "ro-RO", ru: "ru-RU", en: "en-GB" };
const metres = (m: number, locale: SiteLocale) => m.toLocaleString(intl[locale], { minimumFractionDigits: 1, maximumFractionDigits: 1 });
const R2 = (name: string) => publicAsset(`/assets/leasing/moscova-20/dossier/r2/${name}.jpg`);
const PAGES = 10;

export function DossierPrintPage({ locale }: { locale: SiteLocale }) {
  const d = toolkitCopy.dossier;
  const r = toolkitCopy.r2;
  const s = d.sections;
  const project = getProject(m20Toolkit.project)!;
  const unit = getSpace("moscova-20-corner") ?? null;
  const offer = templateOffer(x, unit, project.name, locale);
  const passport = x.passport!;
  const number = cadastreNumbers[m20Toolkit.project]!;
  const packUrl = `${ORIGIN}${localePath(locale, m20Toolkit.packPath)}/`;
  const propertyUrl = `${ORIGIN}${localePath(locale, `/projects/${project.slug}`)}/`;
  const meter = locale === "ru" ? "м" : "m";
  const area = (n: number) => formatAreaExact(n, locale);
  const floors = offer.breakdown.filter((level) => level.height);
  const terrace = offer.breakdown.find((level) => level.key === "terrace");
  const occupancy = assetOccupancy["moscova-20"];
  const heights = `${floors.some((l) => l.heightEvidence === "APPROXIMATE") ? "≈ " : ""}${floors.map((l) => metres(l.height!, locale)).join(" / ")}`;
  const cards = (passport.ready.cards ?? []).filter((card) => publishable(card.evidence));
  const card = (key: string) => cards.find((c) => c.key === key);
  const keyFacts = passport.facts.filter((fact) => publishable(fact.evidence));
  const fact = (key: string) => keyFacts.find((f) => f.key === key);
  const figOf = (key: string) => { const f = fact(key); return f && f.figure !== "heights" ? f.figure[locale] : ""; };
  const unitLabel = unit ? offer.unitLabel.replace(unit.unit[locale], toolkitCopy.pack.unit[locale]) : offer.unitLabel;
  const sides = passport.sides?.sides.filter((side) => publishable(side.evidence)) ?? [];
  const levels = x.plans.levels.filter((level) => level.drawing);
  const groups = Object.fromEntries(passport.groups.map((g) => [g.key, g.items.filter((item) => publishable(item.evidence))]));
  const eng = [...(groups.engineering ?? []), ...(groups.sanitary ?? []), ...(groups.fitout ?? [])];
  const itemNote = (key: string, note: Record<SiteLocale, string> | undefined) => (key === "support" ? d.support[locale] : note?.[locale] ?? null);
  const mailto = `${contactLinks.email}?subject=${encodeURIComponent(r.mailSubject[locale])}`;
  const shareText = toolkitCopy.share.text[locale];
  const telegram = `https://t.me/share/url?url=${encodeURIComponent(packUrl)}&text=${encodeURIComponent(shareText)}`;
  const whatsapp = `https://wa.me/?text=${encodeURIComponent(`${shareText} ${packUrl}`)}`;
  const pointText = (text: { en: string } & Record<SiteLocale, string>) => (text.en === "A highly visible frontage" ? d.facade[locale] : text[locale]);
  const reasonText = (key: string, fallback: string) => (key === "location" || key === "base" ? d.reasons[key][locale] : fallback);

  const foot = (n: number, light = false) => (
    <footer className={`d2-foot${light ? " is-light" : ""}`}>
      <span>MEGAPARC · Moscova 20 · {d.kicker[locale]}</span>
      <span>{toolkitCopy.pack.updated[locale]} {m20Toolkit.dossier.updated} · {m20Toolkit.dossier.version} · {n}/{PAGES}</span>
    </footer>
  );
  const head = (no: string, title: string) => (
    <header className="d2-head"><span className="d2-head__no">{no}</span><h2 className="d2-head__title">{title}</h2></header>
  );
  const figure = (value: string, unitText: string, label: string) => (
    <div className="d2-fig" key={label}>
      <p className="d2-fig__value">{value}<span>{unitText}</span></p>
      <p className="d2-fig__label">{label}</p>
    </div>
  );

  return (
    <main className="d2" lang={locale}>
      {/* 01 · COVER — one architectural photograph, one editorial block */}
      <section className="d2-page d2-cover">
        <figure className="d2-cover__photo">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={R2("cover")} alt={x.photos[x.hero.photo].alt[locale]} />
        </figure>
        <div className="d2-cover__block">
          <p className="d2-kicker">{r.coverKicker[locale]}</p>
          <h1 className="d2-cover__title">Moscova 20</h1>
          <p className="d2-cover__positioning">{r.coverPositioning[locale]}</p>
          <p className="d2-cover__figure">{offer.figure}</p>
          <p className="d2-cover__place">{r.coverPlace[locale]}</p>
          <p className="d2-cover__levels">{r.coverLevels[locale]}</p>
          <p className="d2-cover__meta">{toolkitCopy.pack.updated[locale]} {m20Toolkit.dossier.updated} · {m20Toolkit.dossier.version}</p>
        </div>
      </section>

      {/* 02 · PHOTO PAGE — a large interior and one statement */}
      <section className="d2-page d2-photo">
        <figure className="d2-photo__img">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={R2("statement")} alt={x.photos.intLowerStairHall.alt[locale]} />
        </figure>
        <div className="d2-photo__copy">
          <p className="d2-statement">{x.hero.title[locale]}</p>
          <p className="d2-lead">{x.address[locale]}. {x.location.lead[locale]}</p>
          <p className="d2-lead d2-lead--ink">{unitLabel} · {offer.status}.</p>
          <ul className="d2-reasons">
            {x.reasons.items.map((item) => <li key={item.key}><span>{item.label[locale]}</span>{reasonText(item.key, item.text[locale])}</li>)}
          </ul>
        </div>
        {foot(2)}
      </section>

      {/* 03 · KEY FIGURES — large typography, thin rules, one compact table */}
      <section className="d2-page">
        {head("03", r.figures[locale])}
        <div className="d2-figs">
          {figure(offer.figure.replace(/\s*(м²|m²)$/, ""), locale === "ru" ? "м²" : "m²", r.offered[locale])}
          {fact("power") ? figure(figOf("power"), fact("power")!.unit[locale], (fact("power")!.name ?? fact("power")!.label)[locale]) : null}
          {fact("heights") ? figure(heights, fact("heights")!.unit[locale], (fact("heights")!.name ?? fact("heights")!.label)[locale]) : null}
          {fact("exits") ? figure(figOf("exits"), fact("exits")!.unit[locale], fact("exits")!.label[locale]) : null}
          {card("parking") ? figure(card("parking")!.value[locale].replace(/\D.*$/, ""), card("parking")!.value[locale].replace(/^\d+\s*/, ""), card("parking")!.title[locale]) : null}
          {fact("sanitary") ? figure(figOf("sanitary"), fact("sanitary")!.unit[locale], fact("sanitary")!.label[locale]) : null}
        </div>
        <dl className="d2-rows d2-rows--compact">
          <div><dt>{toolkitCopy.pack.summary[locale]}</dt><dd>{x.address[locale]} · {r.coverPlace[locale]}</dd></div>
          <div><dt>{d.sections.space[locale]}</dt><dd>{toolkitCopy.pack.unit[locale]}</dd></div>
          {card("heating") ? <div><dt>{card("heating")!.title[locale]}</dt><dd>{card("heating")!.value[locale]} — {card("heating")!.text[locale]}</dd></div> : null}
          {card("climate") ? <div><dt>{card("climate")!.title[locale]}</dt><dd>{card("climate")!.value[locale]}</dd></div> : null}
          {card("access") ? <div><dt>{card("access")!.title[locale]}</dt><dd>{card("access")!.text[locale]}</dd></div> : null}
          <div><dt>e‑Cadastru</dt><dd><a href={eCadastruPortal}>{number}</a></dd></div>
        </dl>
        <figure className="d2-band">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={R2("glazing")} alt={x.photos.intGroundGlazing.alt[locale]} />
        </figure>
        {foot(3)}
      </section>

      {/* 04 · SPACE — the area hierarchy, readable in five seconds */}
      <section className="d2-page">
        {head("04", s.space[locale])}
        <div className="d2-area">
          <p className="d2-area__main">{offer.figure}</p>
          <p className="d2-area__offered">{r.offered[locale]}</p>
        </div>
        <div className="d2-levels">
          {floors.map((level) => (
            <div className="d2-level" key={level.key}>
              <p className="d2-level__name">{level.label[locale]}</p>
              <p className="d2-level__row"><span className="d2-level__num">{area(level.area)}</span><span className="d2-level__cap">{r.total[locale]}</span></p>
              <p className="d2-level__row is-commercial"><span className="d2-level__num">{level.useful ? area(level.useful) : "—"}</span><span className="d2-level__cap">{r.commercial[locale]}</span></p>
              <p className="d2-level__row is-height"><span className="d2-level__num">{level.heightEvidence === "APPROXIMATE" ? "≈ " : ""}{metres(level.height!, locale)} {meter}</span><span className="d2-level__cap">{r.height[locale]}</span></p>
            </div>
          ))}
          {terrace ? (
            <div className="d2-level is-terrace">
              <p className="d2-level__name">{terrace.label[locale]}</p>
              <p className="d2-level__row"><span className="d2-level__num">{area(terrace.area)}</span><span className="d2-level__cap">{r.total[locale]}</span></p>
            </div>
          ) : null}
        </div>
        <dl className="d2-object">
          <div><dt>{r.objectTotal[locale]}</dt><dd>{area(occupancy.total)}</dd></div>
          <div><dt>{r.occupied[locale]}</dt><dd>{area(occupancy.occupied)}</dd></div>
        </dl>
        <p className="d2-note">{x.area.propertyLine[locale]} {x.plans.note[locale]}</p>
        <figure className="d2-band d2-band--short">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={R2("depth")} alt={x.photos.intLowerDepth.alt[locale]} />
        </figure>
        {foot(4)}
      </section>

      {/* 05 · 06 · THE OFFICIAL PLANS — the drawing dominates */}
      {levels.map((level, i) => {
        const photo = x.photos[level.drawing!.photo];
        const br = offer.breakdown.find((b) => b.key === level.key);
        const pdf = `${ORIGIN}${level.drawing!.pdf.replace(/^.*?\/assets/, "/assets")}`;
        return (
          <section key={level.key} className="d2-page d2-planpage">
            <header className="d2-head d2-head--plan">
              <span className="d2-head__no">{String(5 + i).padStart(2, "0")}</span>
              <div>
                <h2 className="d2-head__title">{level.label[locale]}</h2>
                {br ? <p className="d2-plan__facts">{area(br.area)} {r.total[locale]} · {br.useful ? `${area(br.useful)} ${r.commercial[locale]}` : null}{br.height ? ` · ${br.heightEvidence === "APPROXIMATE" ? "≈ " : ""}${metres(br.height, locale)} ${meter}` : ""}</p> : null}
              </div>
              <span className="d2-head__mark">{locale === "en" ? level.mark.replace(/,/g, ".") : level.mark}</span>
            </header>
            <figure className="d2-plan">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={R2(`plan-${level.key}`)} alt={photo.alt[locale]} />
            </figure>
            <p className="d2-plan__legend"><span>{r.planLegend[locale]}</span><a href={pdf}><UtilityIcon name="plan" size={11} /> {r.planSource[locale]} · {pdf.replace(/^https?:\/\//, "")}</a></p>
            {foot(5 + i)}
          </section>
        );
      })}

      {/* 07 · ENGINEERING — a specification: statement left, facts right */}
      <section className="d2-page">
        {head("07", s.technical[locale])}
        <div className="d2-spec">
          <div className="d2-spec__left">
            <p className="d2-statement d2-statement--sm">{passport.ready.title[locale]}</p>
            <p className="d2-lead">{r.engineeringLead[locale]}</p>
            <p className="d2-spec__capex">{d.capex[locale]}</p>
          </div>
          <dl className="d2-rows d2-spec__rows">
            {eng.map((item) => (
              <div key={item.key}><dt>{item.title[locale]}</dt><dd>{item.value[locale]}{itemNote(item.key, item.note) ? <small>{itemNote(item.key, item.note)}</small> : null}</dd></div>
            ))}
          </dl>
        </div>
        {foot(7)}
      </section>

      {/* 08 · READINESS — the business benefit, two clean columns */}
      <section className="d2-page">
        {head("08", x.capex.kicker[locale])}
        <h3 className="d2-display">{x.capex.title[locale].split("\n").map((line) => <span key={line}>{line}</span>)}</h3>
        <p className="d2-lead d2-lead--wide">{d.reasons.base[locale]}</p>
        <div className="d2-cols">
          <div>
            <p className="d2-col__title">{x.capex.readyTitle[locale]}</p>
            <ul className="d2-col__list">{x.capex.ready.filter((f) => publishable(f.evidence)).map((f) => <li key={f.text.en}>{f.text[locale]}</li>)}</ul>
          </div>
          <div>
            <p className="d2-col__title is-tenant">{x.capex.tenantTitle[locale]}</p>
            <ul className="d2-col__list">{x.capex.tenant.filter((f) => publishable(f.evidence)).map((f) => <li key={f.text.en}>{f.text[locale]}</li>)}</ul>
          </div>
        </div>
        {x.capex.principle ? <p className="d2-principle">{x.capex.principle.text[locale]}<small>{x.capex.principle.by[locale]}</small></p> : null}
        {foot(8)}
      </section>

      {/* 09 · LOGISTICS + ADDRESS — two sides as a diagram of directions, the map as context */}
      <section className="d2-page">
        {head("09", `${s.access[locale]} · ${s.location[locale]}`)}
        <p className="d2-statement d2-statement--sm">{r.logisticsTitle[locale]}</p>
        <p className="d2-lead d2-lead--wide">{r.logisticsLead[locale]}</p>
        <div className="d2-sides">
          {sides[0] ? (
            <div className="d2-side"><p className="d2-side__name">{sides[0].name[locale]}</p><ul>{sides[0].items.map((item) => <li key={item.en}>{item[locale]}</li>)}</ul></div>
          ) : null}
          <div className="d2-side__core"><span>{passport.sides?.core[locale]}</span></div>
          {sides[1] ? (
            <div className="d2-side"><p className="d2-side__name">{sides[1].name[locale]}</p><ul>{sides[1].items.map((item) => <li key={item.en}>{item[locale]}</li>)}</ul></div>
          ) : null}
        </div>
        <div className="d2-loc">
          <div className="d2-loc__map"><SiteMap slug={project.slug} name={project.name} label={x.address[locale]} /></div>
          <div className="d2-loc__copy">
            <p className="d2-kicker">{r.locationTitle[locale]}</p>
            <p className="d2-loc__lead">{x.location.lead[locale]}</p>
            <ul className="d2-loc__points">{x.location.points.filter((p) => publishable(p.evidence)).map((p) => <li key={p.text.en}>{pointText(p.text)}</li>)}</ul>
          </div>
        </div>
        {foot(9)}
      </section>

      {/* 10 · THE DECISION PAGE — viewing · feasibility · contacts · share · QR */}
      <section className="d2-page d2-final">
        <p className="d2-kicker">{s.next[locale]}</p>
        <h2 className="d2-final__title">{r.finalTitle[locale]}</h2>
        <p className="d2-lead d2-lead--wide">{r.finalSupport[locale]}</p>
        <div className="d2-cta">
          <a className="d2-cta__primary" href={`${packUrl}#book`}>{r.ctaPrimary[locale]}</a>
          <a className="d2-cta__secondary" href={`${packUrl}#precheck`}>{r.ctaSecondary[locale]}</a>
        </div>
        <p className="d2-final__team">{d.team[locale]}</p>
        <div className="d2-final__grid">
          <div>
            <p className="d2-label">{toolkitCopy.pack.contacts[locale]}</p>
            <ul className="d2-contacts">
              <li><a href={contactLinks.mobile}><UtilityIcon name="phone" size={13} />{company.mobile.value[locale]}</a></li>
              <li><a href={contactLinks.landline}><UtilityIcon name="phone" size={13} />{company.landline.value[locale]}</a></li>
              <li><a href={mailto}><UtilityIcon name="mail" size={13} />{company.email.value[locale]}</a></li>
              <li><a href={propertyUrl}><UtilityIcon name="link" size={13} />{r.web[locale]} · {propertyUrl.replace(/^https?:\/\//, "")}</a></li>
            </ul>
            <p className="d2-label">{r.shareTitle[locale]}</p>
            <ul className="d2-share">
              <li><a href={telegram}><UtilityIcon name="telegram" size={14} />Telegram</a></li>
              <li><a href={whatsapp}><UtilityIcon name="whatsapp" size={14} />WhatsApp</a></li>
              <li><a href={mailto}><UtilityIcon name="mail" size={14} />{toolkitCopy.share.email[locale]}</a></li>
              <li><a href={packUrl}><UtilityIcon name="link" size={14} />{r.pack[locale]}</a></li>
            </ul>
            <p className="d2-final__cadastre">e‑Cadastru · <a href={eCadastruPortal}>{number}</a> · {d.cadastre[locale]}</p>
          </div>
          <div className="d2-qr">
            <a href={packUrl}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={m20Toolkit.qr.svg} alt="QR" />
            </a>
            <p className="d2-qr__caption"><UtilityIcon name="qr" size={12} />{r.qrCaption[locale]}</p>
            <p className="d2-qr__url"><a href={packUrl}>{packUrl.replace(/^https?:\/\//, "")}</a></p>
          </div>
        </div>
        <figure className="d2-band d2-band--final">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={R2("exit")} alt={x.photos.intLowerExit.alt[locale]} />
        </figure>
        {foot(10)}
      </section>
    </main>
  );
}
