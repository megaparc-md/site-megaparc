import Link from "next/link";
import { accentLast } from "@/components/accent";
import { DirectContact } from "@/components/direct-contact";
import { LgDrawer } from "@/components/leasing-experience/drawer";
import { templateOffer } from "@/components/leasing-experience/offer";
import { LgPhoto, ui } from "@/components/leasing-experience/parts";
import { SheetPan } from "@/components/leasing-experience/sheet-pan";
import { InfraCards } from "@/components/leasing-experience/tech-passport";
import { CommercialTerms, HeroRates, offerLink } from "@/components/leasing-toolkit/commercial-terms";
import { PackActions, QrLanding, type PackAction } from "@/components/leasing-toolkit/pack-actions";
import { PlanLayers, type LayerItem, type LayerKey, type LayerLevel } from "@/components/leasing-toolkit/plan-layers";
import { precheckCopy } from "@/components/leasing-toolkit/precheck-copy";
import { ShareProperty } from "@/components/leasing-toolkit/share-property";
import { BookViewing, PreCheck } from "@/components/leasing-toolkit/tools";
import { PageShell } from "@/components/page-shell";
import { TenantEntry } from "@/components/tenant-entry";
import { Icon } from "@/components/ui";
import { formatAreaExact, getProject, getSpace } from "@/content/source";
import { publishable, type PlanMarkKind, type ZoneKind } from "@/data/leasing-experience-model";
import { moscova20Experience as x } from "@/data/leasing-experience-moscova-20";
import { commercialCopy, m20Commercial } from "@/data/moscova-20-commercial";
import { packCopy as p } from "@/data/moscova-20-pack";
import { m20Toolkit, toolkitCopy } from "@/data/moscova-20-toolkit";
import { cadastreNumbers, eCadastruPortal } from "@/data/property-trust";
import { brand, localePath, locales, ui as siteUi, type SiteLocale } from "@/lib/site-data";

/**
 * DIGITAL LEASING PACK — the premium leasing experience of Moscova 20 (OWNER mandate R7 «PREMIUM LEASING EXPERIENCE», 2026-11-12;
 * a redesign of the 2026-11-11 hub, which read as a list of technical actions). Six scenes, phone first:
 *   01 HERO — the architecture large, the name, 625,7 м² offered, the two approved rates, the availability, one action;
 *   02 WHY MOSCOVA 20 — three concise advantages;
 *   03 COMMERCIAL TERMS — the two levels and the terrace apart, the preliminary calculation with its wording, the indexation;
 *   04 EXPLORE THE PROPERTY — real photographs, the official plans (the interactive layer), the technical highlights, the detailed
 *      infrastructure folded;
 *   05 DOWNLOADS — the commercial brochure (where it is available for this edition), the two official plans, the technical dossier;
 *   06 NEXT STEP — a viewing request and the direct contact with MEGAPARC; no fake online submission. e-Cadastru, share and the QR
 *      stay as quiet utilities.
 * One call to action per purpose: the viewing at the start and at the end, the brochure in Downloads only. Facts are never typed
 * here: the unit record, the passport, the commercial module and the cadastral registry feed every figure. The pre-check, the
 * viewing request and the share flow live in drawers (ids kept: #precheck · #book · #share — the PDFs and the QR link to them).
 */
const ORIGIN = "https://www.megaparc.md";
const NBSP = String.fromCharCode(160);
const intl: Record<SiteLocale, string> = { ro: "ro-RO", ru: "ru-RU", en: "en-GB" };
const metres = (m: number, locale: SiteLocale) => m.toLocaleString(intl[locale], { minimumFractionDigits: 1, maximumFractionDigits: 1 });
const planCopy = {
  title: { ro: "Planul spațiului", ru: "План помещения", en: "Premises plan" },
  note: { ro: "Anexă la contractul de locațiune · Sc. 1:100", ru: "Приложение к договору аренды · М 1:100", en: "Lease agreement annex · Scale 1:100" },
};
/** which layer a documented room or mark belongs to (the dataset's zone kinds, never new geometry) */
const zoneLayers: Record<ZoneKind, Exclude<LayerKey, "all">[]> = { sales: [], aux: ["logistics"], wc: ["sanitary"], tech: ["technical"], corridor: ["access", "logistics"], terrace: ["access"], ramp: ["access", "logistics"], stair: ["circulation"] };
const markLayers: Record<PlanMarkKind, Exclude<LayerKey, "all">[]> = { customer: ["access"], service: ["access", "logistics"], street: ["access"] };

export function LeasingPackPage({ locale }: { locale: SiteLocale }) {
  const c = toolkitCopy.pack;
  const r = toolkitCopy.r2;
  const project = getProject(m20Toolkit.project)!;
  const unit = getSpace("moscova-20-corner") ?? null;
  const offer = templateOffer(x, unit, project.name, locale);
  const passport = x.passport!;
  const number = cadastreNumbers[m20Toolkit.project]!;
  const packUrl = `${ORIGIN}${localePath(locale, m20Toolkit.packPath)}/`;
  const propertyPath = localePath(locale, `/projects/${project.slug}`);
  const unitLabel = unit ? offer.unitLabel.replace(unit.unit[locale], c.unit[locale]) : offer.unitLabel;
  const [areaFigure, areaUnit] = [offer.figure.replace(/\s*(м²|m²)$/, ""), locale === "ru" ? "м²" : "m²"];
  const brochure = offerLink(locale, "#pack-next");

  // the four key facts of the passport (the clear heights from the unit record, as on the property page)
  const keys = passport.facts.filter((fact) => publishable(fact.evidence)).map((fact) => {
    const floors = offer.breakdown.filter((level) => level.height);
    const figure = fact.figure === "heights" ? (floors.length ? `${floors.some((l) => l.heightEvidence === "APPROXIMATE") ? "≈ " : ""}${floors.map((l) => metres(l.height!, locale)).join(" / ")}` : null) : fact.figure[locale];
    return figure ? { key: fact.key, name: (fact.name ?? fact.label)[locale], figure, unit: fact.unit[locale], why: fact.name ? fact.label[locale] : null } : null;
  }).filter((k): k is NonNullable<typeof k> => k !== null);
  const cards = (passport.ready.cards ?? []).filter((card) => publishable(card.evidence));

  // the plan layer: the official drawings and the documented rooms / marks of each level
  const levels: LayerLevel[] = x.plans.levels.filter((level) => level.drawing).map((level) => {
    const photo = x.photos[level.drawing!.photo];
    const items: LayerItem[] = [
      ...level.zones.map((zone) => ({ key: zone.key, no: zone.no, label: zone.label[locale], area: zone.area ? formatAreaExact(zone.area, locale) : null, layers: zoneLayers[zone.kind] as LayerKey[] })),
      ...level.marks.map((mark) => ({ key: mark.key, no: null, label: mark.label[locale], area: null, layers: markLayers[mark.kind] as LayerKey[] })),
    ];
    return {
      key: level.key,
      label: level.label[locale],
      mark: locale === "en" ? level.mark.replace(/,/g, ".") : level.mark,
      pdf: level.drawing!.pdf,
      items,
      drawing: (
        <figure className="lg-drawing">
          <figcaption className="lg-drawing__head">
            <span className="lg-drawing__title">{planCopy.title[locale]}</span>
            <span className="lg-drawing__note">{planCopy.note[locale]}</span>
            <span className="lg-drawing__mark">{level.label[locale]} · {locale === "en" ? level.mark.replace(/,/g, ".") : level.mark}</span>
          </figcaption>
          <SheetPan start={0.5} label={photo.alt[locale]}>
            <LgPhoto photo={photo} locale={locale} ratio={`${photo.width} / ${photo.height}`} sizes="(min-width: 1024px) 58vw, 100vw" className="lg-drawing__img" />
          </SheetPan>
        </figure>
      ),
    };
  });
  const byKey = (key: string) => cards.find((card) => card.key === key);
  const line = (key: string) => { const card = byKey(key); return card ? `${card.value[locale]} — ${card.text[locale]}` : null; };
  const stairs = x.plans.levels[0]?.zones.find((zone) => zone.kind === "stair")?.label[locale];
  const heightsKey = keys.find((k) => k.key === "heights");
  const exitsKey = keys.find((k) => k.key === "exits");
  const facts: Record<Exclude<LayerKey, "all">, string[]> = {
    access: [line("access"), exitsKey ? `${exitsKey.figure} ${exitsKey.unit} — ${exitsKey.why}` : null].filter((s): s is string => Boolean(s)),
    logistics: [line("logistics")].filter((s): s is string => Boolean(s)),
    sanitary: [line("sanitary")].filter((s): s is string => Boolean(s)),
    circulation: [stairs, heightsKey ? `${heightsKey.name}: ${heightsKey.figure} ${heightsKey.unit} — ${heightsKey.why}` : null].filter((s): s is string => Boolean(s)),
    technical: [line("electricity"), line("heating"), line("climate")].filter((s): s is string => Boolean(s)),
  };
  const pc = toolkitCopy.plans;
  const layerCopy = { layers: pc.layers[locale], onPlan: pc.onPlan[locale], noneOnLevel: pc.noneOnLevel[locale], facts: pc.facts[locale], official: pc.official[locale], note: pc.note[locale], names: { all: pc.all[locale], access: pc.access[locale], logistics: pc.logistics[locale], sanitary: pc.sanitary[locale], circulation: pc.circulation[locale], technical: pc.technical[locale] } };

  // 05 · downloads: the brochure only where a file exists for this edition; the official plans; the technical dossier
  const downloads: PackAction[] = [
    ...(brochure.pdf ? [{ key: "brochure", label: p.brochure[locale], meta: `${commercialCopy.offerMeta[locale].replace("{pages}", String(m20Commercial.offer.pages))}${brochure.draft ? ` · ${commercialCopy.candidate[locale]}` : ""}`, href: brochure.href, event: "m20_dossier_download" as const, download: true }] : []),
    ...x.plans.levels.filter((level) => level.drawing).map((level) => ({ key: `plan-${level.key}`, label: `${p.officialPlan[locale]} · ${level.label[locale]}`, meta: p.planMeta[locale], href: level.drawing!.pdf, event: "m20_plan_open" as const, external: true })),
    // OWNER «COMMERCIAL PRESENTATION RESET» + addendum (2026-11-13): one commercial presentation (the brochure above); the old leasing
    // dossier (R1, outdated wording) is no longer offered — its files stay at their URLs for links already sent; full technical data lives in this pack
  ];
  // 06 · quiet utilities
  const utilities: PackAction[] = [
    { key: "precheck", label: precheckCopy.title[locale], meta: precheckCopy.meta[locale], href: "#precheck", drawer: "precheck", event: "m20_technical_check_start" },
    { key: "cadastre", label: c.cadastre[locale], meta: c.cadastreMeta[locale].replace("{n}", number), href: eCadastruPortal, event: "m20_ecadastru_open", external: true },
    { key: "share", label: c.share[locale], meta: c.shareMeta[locale], href: "#share", drawer: "share" },
  ];
  const gallery = ["intGroundHall", "intGroundGlazing", "intLowerWide"].filter((key) => x.photos[key]);
  const titleLines = x.hero.title[locale].split("\n");

  return (
    <PageShell locale={locale} experience mainClassName="lp-page lpx">
      <QrLanding />

      {/* 01 · HERO */}
      <header className="lpx-hero">
        <div className="lp-shell lpx-hero__grid">
          <div className="lpx-hero__text">
            {/* OWNER 2026-11-11 (QR language): the physical QR opens the RO pack — RU / EN are one tap away in the first viewport */}
            <nav className="lp-lang" aria-label={siteUi.languages[locale]}>
              {locales.map((l) => l === locale
                ? <span key={l} className="is-active" aria-current="true" lang={l} title={brand.languageNames[l]}>{l.toUpperCase()}</span>
                : <Link key={l} href={`${localePath(l, m20Toolkit.packPath)}/`} hrefLang={l} lang={l} title={brand.languageNames[l]}>{l.toUpperCase()}</Link>)}
            </nav>
            <p className="lp-kicker">{c.kicker[locale]}</p>
            <h1 className="lpx-hero__name">{c.title[locale]}</h1>
            <p className="lpx-hero__statement">{titleLines.map((text, i, all) => <span key={text}>{accentLast(all, i, text)} </span>)}</p>
            <div className="lpx-hero__offer">
              <p className="lpx-hero__area"><strong>{areaFigure}</strong><span>{areaUnit}</span></p>
              <p className="lpx-hero__offered">{x.hero.offer[locale]}<br />{c.levelsLine[locale]}{NBSP}· {project.city[locale]}</p>
              <p className={`lpx-hero__status is-${offer.state}`}><i aria-hidden="true" />{offer.status}</p>
            </div>
            <HeroRates locale={locale} className="lpx-hero__rates" />
            <p className="lpx-hero__actions">
              <a className="btn" href="#book" data-drawer="book" aria-haspopup="dialog"><span>{c.book[locale]}</span><Icon size={16} /></a>
              <a className="pm-link" href="#pack-terms"><span>{commercialCopy.title[locale]}</span><Icon size={16} /></a>
            </p>
          </div>
          <figure className="lpx-hero__media"><LgPhoto photo={x.photos[x.hero.photo]} phone={x.photos[x.hero.phonePhoto]} locale={locale} priority sizes="(min-width: 1024px) 56vw, 100vw" /></figure>
        </div>
      </header>

      {/* 02 · WHY MOSCOVA 20 */}
      <section className="lpx-sec lpx-why" aria-labelledby="lpx-why">
        <div className="lp-shell">
          <div className="lpx-head"><span className="lp-no">02</span><h2 className="lpx-h2" id="lpx-why">{commercialCopy.why.title[locale]}</h2></div>
          <ol className="lpx-why__list">
            {commercialCopy.why.items.map((item, i) => (
              <li key={item.key}><b>{String(i + 1).padStart(2, "0")}</b><h3>{item.title[locale]}</h3><p>{item.text[locale]}</p></li>
            ))}
          </ol>
        </div>
      </section>

      {/* 03 · COMMERCIAL TERMS — the brochure itself is offered once, in Downloads */}
      <CommercialTerms breakdown={offer.breakdown} locale={locale} fallbackHref="#pack-next" id="pack-terms" tone="paper" action={false} />

      {/* 04 · EXPLORE THE PROPERTY — photographs · plans · technical highlights */}
      <section className="lpx-sec" id="pack-explore" aria-labelledby="lpx-explore">
        <div className="lp-shell">
          <div className="lpx-head"><span className="lp-no">04</span><h2 className="lpx-h2" id="lpx-explore">{p.explore[locale]}</h2></div>
          <div className="lpx-gallery">
            {gallery.map((key, i) => (
              <figure key={key} className={`lpx-gallery__item is-${i}`}><LgPhoto photo={x.photos[key]} locale={locale} ratio="3 / 2" sizes="(min-width: 900px) 40vw, 100vw" /></figure>
            ))}
          </div>
          <p className="lp-meta lpx-gallery__more"><Link href={`${propertyPath}/#photos`}>{p.allPhotos[locale]} →</Link></p>
        </div>
        <div className="lp-shell lpx-block" id="pack-plans">
          <h3 className="lpx-h3">{pc.title[locale]}</h3>
          <p className="lp-lead lpx-block__lead">{pc.lead[locale]}</p>
          <PlanLayers levels={levels} facts={facts} copy={layerCopy} />
        </div>
        <div className="lp-shell lpx-block">
          <h3 className="lpx-h3">{p.technical[locale]}</h3>
          <dl className="lp-keys">
            {keys.map((k) => (
              <div key={k.key} className="lp-key" data-key={k.key}>
                <dt>{k.name}</dt>
                <dd className="lp-key__fig">{k.figure}<span>{k.unit}</span></dd>
                {k.why ? <dd className="lp-key__why">{k.why}</dd> : null}
              </div>
            ))}
          </dl>
          {/* OWNER «CORRECTIVE PASS R8» §03–§04 (2026-11-13): the infrastructure as the same colour cards as the technical drawer — open, not folded */}
          <div className="lpx-infra">
            <h4 className="lpx-infra__title">{x.passport?.ready.title[locale]}</h4>
            <InfraCards cards={cards} locale={locale} />
            <dl className="lp-rows lpx-infra__rows">
              <div><dt>{ui.status[locale]}</dt><dd>{offer.status}</dd></div>
              <div><dt>e‑Cadastru</dt><dd>{number}</dd></div>
            </dl>
          </div>
          <p className="lp-meta"><Link href={propertyPath}>{c.page[locale]} →</Link></p>
        </div>
      </section>

      {/* virtual tour — nothing renders while no real tour exists */}
      {m20Toolkit.virtualTourUrl ? (
        <section className="lpx-sec" aria-label={c.tourTitle[locale]}>
          <div className="lp-shell"><p className="lp-label">{c.tourTitle[locale]}</p><a className="btn" href={m20Toolkit.virtualTourUrl} target="_blank" rel="noopener noreferrer"><span>{c.tourOpen[locale]}</span></a></div>
        </section>
      ) : null}

      {/* 05 · DOWNLOADS */}
      <section className="lpx-sec lpx-sec--paper" id="pack-downloads" aria-labelledby="lpx-downloads">
        <div className="lp-shell">
          <div className="lpx-head"><span className="lp-no">05</span><h2 className="lpx-h2" id="lpx-downloads">{p.downloads[locale]}</h2></div>
          <PackActions items={downloads} />
        </div>
      </section>

      {/* 06 · NEXT STEP — a viewing request and the direct contact; never a fake submission */}
      <section className="lpx-sec lpx-next" id="pack-next" aria-labelledby="lpx-next">
        <div className="lp-shell lpx-next__grid">
          <div>
            <div className="lpx-head"><span className="lp-no">06</span><p className="lp-kicker">{toolkitCopy.dossier.sections.next[locale]}</p></div>
            <h2 className="lpx-next__title" id="lpx-next">{accentLast([r.finalTitle[locale]], 0, r.finalTitle[locale])}</h2>
            <p className="lp-lead">{r.finalSupport[locale]}</p>
            <p className="lpx-next__actions">
              <a className="btn" href="#book" data-drawer="book" aria-haspopup="dialog"><span>{c.book[locale]}</span><Icon size={16} /></a>
            </p>
            <DirectContact locale={locale} subject="lease" title={null} note={null} context={unitLabel} />
            {/* secondary service entry for existing tenants (OWNER «TENANT CABINET ENTRY», 2026-11-11) — nothing until the cabinet exists */}
            <TenantEntry locale={locale} className="lp-meta" />
          </div>
          <aside className="lpx-next__aside">
            <PackActions items={utilities} />
            <p className="lp-label">{c.qrTitle[locale]}</p>
            <div className="lp-qr">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={m20Toolkit.qr.svg} alt="QR · Moscova 20 Leasing Pack" width={112} height={112} loading="lazy" />
              <p>{c.qrText[locale]}<br /><a href={packUrl}>{packUrl.replace(/^https?:\/\//, "")}</a></p>
            </div>
            <p className="lp-meta">{c.updated[locale]}: {m20Commercial.offer.updated} · {m20Commercial.offer.version}</p>
          </aside>
        </div>
      </section>

      <LgDrawer id="precheck" title={precheckCopy.title[locale]} kicker={project.name} closeLabel={ui.close[locale]}>
        <PreCheck locale={locale} />
      </LgDrawer>
      <LgDrawer id="book" title={c.book[locale]} kicker={project.name} closeLabel={ui.close[locale]}>
        <BookViewing locale={locale} unitLabel={unitLabel} />
      </LgDrawer>
      <LgDrawer id="share" title={toolkitCopy.share.title[locale]} kicker={project.name} closeLabel={ui.close[locale]}>
        <ShareProperty url={packUrl} locale={locale} />
      </LgDrawer>
    </PageShell>
  );
}
