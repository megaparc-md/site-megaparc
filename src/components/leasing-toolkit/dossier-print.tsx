import { templateOffer } from "@/components/leasing-experience/offer";
import { SiteMap } from "@/components/site-map";
import { formatAreaExact, getProject, getSpace } from "@/content/source";
import { company } from "@/data/demo-content";
import { publishable } from "@/data/leasing-experience-model";
import { moscova20Experience as x } from "@/data/leasing-experience-moscova-20";
import { m20Toolkit, toolkitCopy } from "@/data/moscova-20-toolkit";
import { cadastreNumbers, eCadastruPortal } from "@/data/property-trust";
import { localePath, publicAsset, type SiteLocale } from "@/lib/site-data";

/**
 * LEASING DOSSIER — the A4 source of the PDF (OWNER toolkit mandate §7–§10, 2026-11-11). Ten pages: cover · 01 property ·
 * 02 key facts · 03 space · 04 plans (ground) · 05 plans (lower ground) · 06 technical · 07 access and logistics · 08 location ·
 * 09 trust + next step (QR). Printed to PDF by scripts/moscova-20-dossier.mjs (headless Chrome, A4, no margins); the route is
 * internal (noindex, removed from the production artifact by scripts/package-production.mjs). Every URL in the PDF is the
 * production canonical. Facts come from the approved dataset only; «Updated: DD.MM.YYYY» and the version on every page.
 */
const ORIGIN = "https://www.megaparc.md";
const intl: Record<SiteLocale, string> = { ro: "ro-RO", ru: "ru-RU", en: "en-GB" };
const metres = (m: number, locale: SiteLocale) => m.toLocaleString(intl[locale], { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export function DossierPrintPage({ locale }: { locale: SiteLocale }) {
  const d = toolkitCopy.dossier;
  const s = d.sections;
  const project = getProject(m20Toolkit.project)!;
  const unit = getSpace("moscova-20-corner") ?? null;
  const offer = templateOffer(x, unit, project.name, locale);
  const passport = x.passport!;
  const number = cadastreNumbers[m20Toolkit.project]!;
  const packUrl = `${ORIGIN}${localePath(locale, m20Toolkit.packPath)}/`;
  const propertyUrl = `${ORIGIN}${localePath(locale, `/projects/${project.slug}`)}/`;
  const cover = x.photos[x.hero.photo];
  const cards = (passport.ready.cards ?? []).filter((card) => publishable(card.evidence));
  const floors = offer.breakdown.filter((level) => level.height);
  const keys = passport.facts.filter((fact) => publishable(fact.evidence)).map((fact) => ({
    key: fact.key,
    name: (fact.name ?? fact.label)[locale],
    figure: fact.figure === "heights" ? `${floors.some((l) => l.heightEvidence === "APPROXIMATE") ? "≈ " : ""}${floors.map((l) => metres(l.height!, locale)).join(" / ")}` : fact.figure[locale],
    unit: fact.unit[locale],
    why: fact.name ? fact.label[locale] : null,
  }));
  const meter = locale === "ru" ? "м" : "m";
  const levels = x.plans.levels.filter((level) => level.drawing);
  const foot = (
    <p className="dp-foot">
      <span>{d.footer[locale]}</span>
      <span>{toolkitCopy.pack.updated[locale]}: {m20Toolkit.dossier.updated} · {d.version[locale]} {m20Toolkit.dossier.version}</span>
    </p>
  );
  const head = (no: string, title: string) => (
    <header className="dp-head"><span className="dp-head__no">{no}</span><h2 className="dp-head__title">{title}</h2><span className="dp-head__name">Moscova 20 · MEGAPARC</span></header>
  );
  const sides = passport.sides?.sides.filter((side) => publishable(side.evidence)) ?? [];

  return (
    <main className="dp" lang={locale}>
      {/* COVER */}
      <section className="dp-page dp-page--cover">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <figure className="dp-cover__img"><img src={publicAsset("/assets/leasing/moscova-20/dossier/cover.jpg")} alt={cover.alt[locale]} /></figure>
        <div className="dp-cover__copy">
          <p className="dp-cover__kicker">{d.kicker[locale]} · MEGAPARC</p>
          <h1 className="dp-cover__title">Moscova 20</h1>
          <p className="dp-cover__sub">{d.cover[locale]} · {offer.figure}</p>
          <p className="dp-cover__meta">{toolkitCopy.pack.updated[locale]}: {m20Toolkit.dossier.updated} · {m20Toolkit.dossier.version}</p>
        </div>
      </section>

      {/* 01 · PROPERTY */}
      <section className="dp-page">
        {head("01", s.property[locale])}
        <p className="dp-statement">{x.hero.title[locale]}</p>
        <p className="dp-text">{x.address[locale]}. {x.location.lead[locale]}</p>
        <p className="dp-text">{offer.unitLabel} · {offer.status}.</p>
        <ul className="dp-list">
          {x.reasons.items.map((item) => <li key={item.key}><strong>{item.label[locale]}.</strong> {item.text[locale]}</li>)}
        </ul>
        {foot}
      </section>

      {/* 02 · KEY FACTS */}
      <section className="dp-page">
        {head("02", s.facts[locale])}
        <dl className="dp-keys">
          {keys.map((k) => (
            <div key={k.key} className="dp-key"><dt>{k.name}</dt><dd className="dp-key__fig">{k.figure}<span>{k.unit}</span></dd>{k.why ? <dd className="dp-key__why">{k.why}</dd> : null}</div>
          ))}
        </dl>
        <dl className="dp-rows">
          {cards.map((card) => <div key={card.key}><dt>{card.title[locale]}</dt><dd>{card.value[locale]}<small>{card.text[locale]}</small></dd></div>)}
        </dl>
        {foot}
      </section>

      {/* 03 · SPACE */}
      <section className="dp-page">
        {head("03", s.space[locale])}
        <p className="dp-statement">{offer.figure} · {toolkitCopy.pack.levelsLine[locale]}</p>
        <table className="dp-table">
          <thead><tr><th>{d.level[locale]}</th><th className="is-num">{d.gross[locale]}</th><th className="is-num">{d.useful[locale]}</th><th className="is-num">{d.height[locale]}</th></tr></thead>
          <tbody>
            {offer.breakdown.map((level) => (
              <tr key={level.key}><th scope="row">{level.label[locale]}</th><td className="is-num">{formatAreaExact(level.area, locale)}</td><td className="is-num">{level.useful ? formatAreaExact(level.useful, locale) : "—"}</td><td className="is-num">{level.height ? `${level.heightEvidence === "APPROXIMATE" ? "≈ " : ""}${metres(level.height, locale)} ${meter}` : "—"}</td></tr>
            ))}
          </tbody>
        </table>
        <p className="dp-text">{x.area.propertyLine[locale]}</p>
        <p className="dp-text">{x.plans.note[locale]}</p>
        {foot}
      </section>

      {/* 04 · 05 · PLANS */}
      {levels.map((level, i) => {
        const photo = x.photos[level.drawing!.photo];
        return (
          <section key={level.key} className="dp-page">
            {head(String(4 + i).padStart(2, "0"), `${s.plans[locale]} · ${level.label[locale]} · ${locale === "en" ? level.mark.replace(/,/g, ".") : level.mark}`)}
            <figure className="dp-plan">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              {/* a print-only JPEG of the 1400 px OWNER drawing derivative (Chrome keeps JPEG streams as-is — the PDF stays light); the full-resolution annex is referenced below */}
              <img src={publicAsset(`/assets/leasing/moscova-20/dossier/plan-${level.key}.jpg`)} alt={photo.alt[locale]} />
              <figcaption>{d.planNote[locale]} · {ORIGIN}{level.drawing!.pdf.replace(/^.*?\/assets/, "/assets")}</figcaption>
            </figure>
            {foot}
          </section>
        );
      })}

      {/* 06 · TECHNICAL */}
      <section className="dp-page">
        {head("06", s.technical[locale])}
        <dl className="dp-rows">
          {passport.groups.filter((g) => g.key !== "logistics" && g.key !== "access").flatMap((g) => g.items.filter((item) => publishable(item.evidence)).map((item) => (
            <div key={`${g.key}-${item.key}`}><dt>{item.title[locale]}</dt><dd>{item.value[locale]}{item.note ? <small>{item.note[locale]}</small> : null}</dd></div>
          )))}
        </dl>
        <p className="dp-text" style={{ marginTop: "5mm" }}>{passport.capex[locale]}</p>
        {foot}
      </section>

      {/* 07 · ACCESS AND LOGISTICS */}
      <section className="dp-page">
        {head("07", s.access[locale])}
        <div className="dp-two">
          {sides.map((side) => (
            <div key={side.key} className="dp-side"><h4>{side.name[locale]}</h4><ul className="dp-list">{side.items.map((item) => <li key={item.en}>{item[locale]}</li>)}</ul></div>
          ))}
        </div>
        <dl className="dp-rows" style={{ marginTop: "6mm" }}>
          {passport.groups.filter((g) => g.key === "access" || g.key === "logistics").flatMap((g) => g.items.filter((item) => publishable(item.evidence)).map((item) => (
            <div key={`${g.key}-${item.key}`}><dt>{item.title[locale]}</dt><dd>{item.value[locale]}{item.note ? <small>{item.note[locale]}</small> : null}</dd></div>
          )))}
        </dl>
        {foot}
      </section>

      {/* 08 · LOCATION */}
      <section className="dp-page">
        {head("08", s.location[locale])}
        <div className="dp-map"><SiteMap slug={project.slug} name={project.name} label={x.address[locale]} /></div>
        <p className="dp-statement" style={{ fontSize: "15pt" }}>{x.location.lead[locale]}</p>
        <ul className="dp-list">{x.location.points.filter((p) => publishable(p.evidence)).map((p) => <li key={p.text.en}>{p.text[locale]}</li>)}</ul>
        {foot}
      </section>

      {/* 09 · TRUST + NEXT STEP */}
      <section className="dp-page">
        {head("09", `${s.trust[locale]} · ${s.next[locale]}`)}
        <p className="dp-cadastre">{number}</p>
        <p className="dp-text">{d.cadastre[locale]} — <span className="dp-url">{eCadastruPortal}</span></p>
        <p className="dp-text">{d.team[locale]}</p>
        <div className="dp-next" style={{ marginTop: "8mm" }}>
          <div>
            <ol>
              {d.nextActions[locale].map((action, i) => <li key={action}><b>0{i + 1}</b>{action}</li>)}
            </ol>
            <p className="dp-contacts">{company.email.value[locale]}<br />{company.mobile.value[locale]}<br />{company.landline.value[locale]}</p>
            <p className="dp-url" style={{ marginTop: "4mm" }}>{propertyUrl}</p>
          </div>
          <div className="dp-qr">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={m20Toolkit.qr.svg} alt="QR" />
            <p>{d.qrLine[locale]}<br />{packUrl.replace(/^https?:\/\//, "")}</p>
          </div>
        </div>
        {foot}
      </section>
    </main>
  );
}
