import Link from "next/link";
import { DirectContact } from "@/components/direct-contact";
import { LgDrawer } from "@/components/leasing-experience/drawer";
import { templateOffer } from "@/components/leasing-experience/offer";
import { LgPhoto, ui } from "@/components/leasing-experience/parts";
import { SheetPan } from "@/components/leasing-experience/sheet-pan";
import { PackActions, QrLanding, type PackAction } from "@/components/leasing-toolkit/pack-actions";
import { PlanLayers, type LayerItem, type LayerKey, type LayerLevel } from "@/components/leasing-toolkit/plan-layers";
import { ShareProperty } from "@/components/leasing-toolkit/share-property";
import { BookViewing, PreCheck } from "@/components/leasing-toolkit/tools";
import { PageShell } from "@/components/page-shell";
import { TenantEntry } from "@/components/tenant-entry";
import { formatAreaExact, getProject, getSpace } from "@/content/source";
import { publishable, type PlanMarkKind, type ZoneKind } from "@/data/leasing-experience-model";
import { moscova20Experience as x } from "@/data/leasing-experience-moscova-20";
import { m20Toolkit, toolkitCopy } from "@/data/moscova-20-toolkit";
import { cadastreNumbers, eCadastruPortal } from "@/data/property-trust";
import { localePath, type SiteLocale } from "@/lib/site-data";

/**
 * DIGITAL LEASING PACK — the compact hub of the Moscova 20 toolkit (OWNER mandate §3, 2026-11-11): a digital property passport,
 * quick on a phone after the QR scan. OWNER «LEASING PACK / DOSSIER CORRECTIONS» §2 (2026-11-11) — a fast decision hub:
 * 01 the four quick facts (passport figures, read from the approved dataset, never typed again) · 02 the actions (plans · dossier ·
 * technical check · viewing · e-Cadastru · share) · 03 the interactive plan layer · 04 the property with the detailed infrastructure
 * folded (secondary, nothing removed) · 05 contacts · the QR for the same page · the virtual-tour slot (nothing while the URL is null).
 * Rows and hairlines, not a dashboard. The pre-check, the viewing request and the share flow live in drawers.
 */
const ORIGIN = "https://www.megaparc.md";
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
  const project = getProject(m20Toolkit.project)!;
  const unit = getSpace("moscova-20-corner") ?? null;
  const offer = templateOffer(x, unit, project.name, locale);
  const passport = x.passport!;
  const number = cadastreNumbers[m20Toolkit.project]!;
  const packUrl = `${ORIGIN}${localePath(locale, m20Toolkit.packPath)}/`;
  const propertyPath = localePath(locale, `/projects/${project.slug}`);
  const hero = x.photos[x.hero.photo];
  // OWNER «LEASING PACK / DOSSIER CORRECTIONS» §1: the toolkit's «коммерческое помещение» in place of the unit record's label
  const unitLine = unit ? c.unit[locale] : c.levelsLine[locale];
  const unitLabel = unit ? offer.unitLabel.replace(unit.unit[locale], c.unit[locale]) : offer.unitLabel;

  // 01 · the four key facts of the passport (the clear heights from the unit record, as on the property page)
  const keys = passport.facts.filter((fact) => publishable(fact.evidence)).map((fact) => {
    const floors = offer.breakdown.filter((level) => level.height);
    const figure = fact.figure === "heights" ? (floors.length ? `${floors.some((l) => l.heightEvidence === "APPROXIMATE") ? "≈ " : ""}${floors.map((l) => metres(l.height!, locale)).join(" / ")}` : null) : fact.figure[locale];
    return figure ? { key: fact.key, name: (fact.name ?? fact.label)[locale], figure, unit: fact.unit[locale], why: fact.name ? fact.label[locale] : null } : null;
  }).filter((k): k is NonNullable<typeof k> => k !== null);
  const cards = (passport.ready.cards ?? []).filter((card) => publishable(card.evidence));

  // the actions
  const actions: PackAction[] = [
    { key: "plans", label: c.plans[locale], meta: c.plansMeta[locale], href: "#pack-plans", event: "m20_plan_open" },
    { key: "dossier", label: c.dossier[locale], meta: c.dossierMeta[locale].replace("{pages}", String(m20Toolkit.dossier.pages)).replace("{version}", m20Toolkit.dossier.version), href: m20Toolkit.dossier.file[locale], event: "m20_dossier_download", download: true },
    { key: "precheck", label: c.precheck[locale], meta: c.precheckMeta[locale], href: "#precheck", drawer: "precheck", event: "m20_technical_check_start" },
    { key: "book", label: c.book[locale], meta: c.bookMeta[locale], href: "#book", drawer: "book", event: "m20_viewing_start" },
    { key: "cadastre", label: c.cadastre[locale], meta: c.cadastreMeta[locale].replace("{n}", number), href: eCadastruPortal, event: "m20_ecadastru_open", external: true },
    { key: "share", label: c.share[locale], meta: c.shareMeta[locale], href: "#share", drawer: "share" },
  ];

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
  const facts: Record<Exclude<LayerKey, "all">, string[]> = {
    access: [line("access"), keys.find((k) => k.key === "exits") ? `${keys.find((k) => k.key === "exits")!.figure} ${keys.find((k) => k.key === "exits")!.unit} — ${keys.find((k) => k.key === "exits")!.why}` : null].filter((s): s is string => Boolean(s)),
    logistics: [line("logistics")].filter((s): s is string => Boolean(s)),
    sanitary: [line("sanitary")].filter((s): s is string => Boolean(s)),
    circulation: [stairs, heightsKey ? `${heightsKey.name}: ${heightsKey.figure} ${heightsKey.unit} — ${heightsKey.why}` : null].filter((s): s is string => Boolean(s)),
    technical: [line("electricity"), line("heating"), line("climate")].filter((s): s is string => Boolean(s)),
  };
  const pc = toolkitCopy.plans;
  const layerCopy = { layers: pc.layers[locale], onPlan: pc.onPlan[locale], noneOnLevel: pc.noneOnLevel[locale], facts: pc.facts[locale], official: pc.official[locale], note: pc.note[locale], names: { all: pc.all[locale], access: pc.access[locale], logistics: pc.logistics[locale], sanitary: pc.sanitary[locale], circulation: pc.circulation[locale], technical: pc.technical[locale] } };

  return (
    <PageShell locale={locale} experience mainClassName="lp-page">
      <QrLanding />
      <header className="lp-head">
        <div className="lp-shell lp-head__grid">
          <div>
            <p className="lp-kicker">{c.kicker[locale]}</p>
            <h1 className="lp-title">{c.title[locale]}</h1>
            <p className="lp-lead">{c.lead[locale]}</p>
            <p className="lp-status">
              <span className="lp-status__fig">{offer.figure}</span>
              <span className="lp-status__line">{unitLine} · {project.city[locale]}</span>
              <span className={`lp-status__line${offer.state === "now" ? " lp-status__now" : ""}`}>{offer.status}</span>
            </p>
          </div>
          <figure className="lp-head__media"><LgPhoto photo={hero} locale={locale} priority sizes="(min-width: 900px) 40vw, 100vw" /></figure>
        </div>
      </header>

      {/* 01 · quick facts — the four passport figures, nothing else (OWNER «LEASING PACK / DOSSIER CORRECTIONS» §2: a fast decision hub) */}
      <section className="lp-sec lp-sec--paper" aria-labelledby="lp-facts">
        <div className="lp-shell">
          <div className="lp-sec__head"><span className="lp-no">01</span><h2 className="lp-h2" id="lp-facts">{c.quick[locale]}</h2></div>
          <dl className="lp-keys">
            {keys.map((k) => (
              <div key={k.key} className="lp-key">
                <dt>{k.name}</dt>
                <dd className="lp-key__fig">{k.figure}<span>{k.unit}</span></dd>
                {k.why ? <dd className="lp-key__why">{k.why}</dd> : null}
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* 02 · actions — right after the quick facts */}
      <section className="lp-sec" aria-labelledby="lp-actions">
        <div className="lp-shell">
          <div className="lp-sec__head"><span className="lp-no">02</span><h2 className="lp-h2" id="lp-actions">{c.actions[locale]}</h2></div>
          <PackActions items={actions} />
        </div>
      </section>

      {/* 03 · the plan layer — explanatory; the official drawing and its PDF stay authoritative */}
      <section className="lp-sec lp-sec--paper" id="pack-plans" aria-labelledby="lp-plans-title">
        <div className="lp-shell">
          <div className="lp-sec__head"><span className="lp-no">03</span><h2 className="lp-h2" id="lp-plans-title">{pc.title[locale]}</h2></div>
          <p className="lp-lead" style={{ marginTop: 0, marginBottom: "1.2rem" }}>{pc.lead[locale]}</p>
          <PlanLayers levels={levels} facts={facts} copy={layerCopy} />
        </div>
      </section>

      {/* 04 · the property + the detailed infrastructure, secondary and folded (nothing removed — one level lower) */}
      <section className="lp-sec" aria-labelledby="lp-summary">
        <div className="lp-shell">
          <div className="lp-sec__head"><span className="lp-no">04</span><h2 className="lp-h2" id="lp-summary">{c.summary[locale]}</h2></div>
          <p className="lp-lead" style={{ marginTop: 0 }}>{x.hero.title[locale]}</p>
          <p className="lp-status__line">{x.address[locale]} · {x.location.lead[locale]}</p>
          <p className="lp-meta"><Link href={propertyPath}>{c.page[locale]} →</Link></p>
          <details className="lp-more">
            <summary><span>{c.details[locale]}</span><small>{c.detailsMeta[locale].replace("{n}", String(cards.length))}</small></summary>
            <dl className="lp-rows">
              {cards.map((card) => (
                <div key={card.key}><dt>{card.title[locale]}</dt><dd>{card.value[locale]}<small>{card.text[locale]}</small></dd></div>
              ))}
              <div><dt>{ui.status[locale]}</dt><dd>{offer.status}</dd></div>
              <div><dt>e‑Cadastru</dt><dd>{number}</dd></div>
            </dl>
          </details>
        </div>
      </section>

      {/* virtual tour — nothing renders while no real tour exists */}
      {m20Toolkit.virtualTourUrl ? (
        <section className="lp-sec" aria-label={c.tourTitle[locale]}>
          <div className="lp-shell"><p className="lp-label">{c.tourTitle[locale]}</p><a className="btn" href={m20Toolkit.virtualTourUrl} target="_blank" rel="noopener noreferrer"><span>{c.tourOpen[locale]}</span></a></div>
        </section>
      ) : null}

      {/* 04 · contacts + the same pack on a phone */}
      <section className="lp-sec" aria-labelledby="lp-contacts">
        <div className="lp-shell lp-aside">
          <div>
            <div className="lp-sec__head"><span className="lp-no">05</span><h2 className="lp-h2" id="lp-contacts">{c.contacts[locale]}</h2></div>
            <DirectContact locale={locale} subject="lease" title={null} note={null} context={unitLabel} />
            {/* secondary service entry for existing tenants (OWNER «TENANT CABINET ENTRY», 2026-11-11) — nothing until the cabinet exists */}
            <TenantEntry locale={locale} className="lp-meta" />
          </div>
          <div>
            <p className="lp-label">{c.qrTitle[locale]}</p>
            <div className="lp-qr">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={m20Toolkit.qr.svg} alt="QR · Moscova 20 Leasing Pack" width={112} height={112} loading="lazy" />
              <p>{c.qrText[locale]}<br /><a href={packUrl}>{packUrl.replace(/^https?:\/\//, "")}</a></p>
            </div>
            <p className="lp-meta">{c.updated[locale]}: {m20Toolkit.dossier.updated} · {m20Toolkit.dossier.version}</p>
          </div>
        </div>
      </section>

      <LgDrawer id="precheck" title={c.precheck[locale]} kicker={project.name} closeLabel={ui.close[locale]}>
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
