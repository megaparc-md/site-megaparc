import { CapitalBase } from "@/components/leasing-experience/capital-base";
import { DecisionNav, type Portal } from "@/components/leasing-experience/decision-nav";
import { DecisionSheet, decisionKicker, decisionTitle } from "@/components/leasing-experience/decision-zone";
import { LgDrawer } from "@/components/leasing-experience/drawer";
import { FormatLens } from "@/components/leasing-experience/format-lens";
import { LeasingHero } from "@/components/leasing-experience/hero";
import { LocationMotion } from "@/components/leasing-experience/location-motion";
import { templateOffer } from "@/components/leasing-experience/offer";
import { EconomicsGlyph, LgPhoto, ownerPreview, ui } from "@/components/leasing-experience/parts";
import { PhotoGallery, PhotoStory, galleryTitle } from "@/components/leasing-experience/photo-story";
import { PlansScene } from "@/components/leasing-experience/plans";
import { Reasons } from "@/components/leasing-experience/reasons";
import { ReadinessSheet, TechSheet } from "@/components/leasing-experience/sheets";
import { StickyCta } from "@/components/leasing-experience/sticky-cta";
import { SummaryCards } from "@/components/leasing-experience/summary";
import { ViewingScene } from "@/components/leasing-experience/viewing";
import { DecisionBar } from "@/components/leasing-toolkit/decision-bar";
import { DigitalDossier, QrHandoff } from "@/components/leasing-toolkit/digital-dossier";
import { precheckCopy } from "@/components/leasing-toolkit/precheck-copy";
import { BookViewing, PreCheck } from "@/components/leasing-toolkit/tools";
import { m20Toolkit, toolkitCopy } from "@/data/moscova-20-toolkit";
import { R3Trust } from "@/components/r3";
import { PageShell } from "@/components/page-shell";
import type { ProjectEntry } from "@/content/source";
import type { LeasingExperience } from "@/data/leasing-experience-model";
import type { AvailableSpace } from "@/data/leasing-inventory";
import { toolVisible } from "@/data/tenant-intelligence";
import { localePath, type Localized, type SiteLocale } from "@/lib/site-data";

/**
 * THE LEASING PROPERTY TEMPLATE — OWNER «LEASING TEMPLATE LOCK · MOSCOVA 20 = EXACT MASTER TEMPLATE» (2026-11-10).
 * One page system, four datasets (src/data/leasing-experience-*.ts): Moscova 20 is the master configuration, Moscova 9,
 * Dacia 31 and Creangă 78 render exactly the same scenes in exactly the same order — only the data changes. A scene whose
 * data is not confirmed keeps its place and shows its honest state («Планы предоставляются по запросу», «Подтверждается
 * совместно с техническим директором и архитектором», factual location only) — it is never dropped.
 *
 * Order (the Moscova 20 page as approved, art direction 2026-11-09): HERO → architectural navigation (01 location ·
 * 02 plans · 03 technical readiness · 04 decision) → summary cards → statement → «Какой бизнес вы рассматриваете?» →
 * location → photographs → plans and areas → the dark technical scene → Technical Director + Architect · e-Cadastru →
 * the viewing; phones add the sticky action; the detail lives in the drawers (technical characteristics · photographs ·
 * readiness · the decision tool). The property carrying the Digital Leasing Toolkit (Moscova 20) adds the digital property
 * dossier after the summary cards (Leasing Pack · PDF · plans · QR drawer) and the three-action decision bar.
 *
 * The status, the hero figure and the actions come from the offer (./offer.ts): the published unit record (Moscova 20,
 * Moscova 9) or the property (Dacia 31 on request, Creangă 78 fully let → the waiting list).
 */

const portalCopy = {
  location: { label: { ro: "Locație\nși flux", ru: "Локация\nи поток", en: "Location\nand flow" }, word: { ro: "Cum trăiește adresa", ru: "Как живёт адрес", en: "How the address lives" } },
  plans: { label: { ro: "Planurile\nspațiului", ru: "Планы\nпомещения", en: "Space\nplans" }, word: { ro: "Cum funcționează spațiul", ru: "Как работает пространство", en: "How the space works" } },
  ready: { label: { ro: "Pregătirea\ntehnică", ru: "Техническая\nготовность", en: "Technical\nreadiness" }, word: { ro: "Ce este deja gata", ru: "Что уже готово", en: "What is already in place" } },
  economics: { label: { ro: "Economia\npunctului", ru: "Экономика\nточки", en: "Unit\neconomics" }, word: { ro: "Câți clienți îi trebuie modelului dumneavoastră", ru: "Сколько клиентов требуется вашей модели", en: "How many customers your model needs" } },
  launch: { label: { ro: "Pregătire\npentru lansare", ru: "Готовность\nк запуску", en: "Ready\nto open" }, word: { ro: "Din ce se compune lansarea", ru: "Из чего складывается запуск", en: "What opening involves" } },
} satisfies Record<string, { label: Localized; word: Localized }>;

/** The decision tool is shown where it is approved (src/data/tenant-intelligence.ts); the waiting list needs no approval — it holds no figure. */
export const decisionOn = (x: LeasingExperience) => (x.decision.kind === "waitlist" ? true : toolVisible(`${x.project}.${x.decision.kind === "office" ? "office-tool" : "economics-tool"}`, ownerPreview));

export function LeasingPropertyTemplate({ locale, project, unit, experience: x }: { locale: SiteLocale; project: ProjectEntry; unit: AvailableSpace | null; experience: LeasingExperience }) {
  const offer = templateOffer(x, unit, project.name, locale);
  const decision = decisionOn(x);
  const own = x.portals ?? {};
  const toolkit = x.project === m20Toolkit.project;
  // the digital property dossier (OWNER «MAKE MOSCOVA 20 DIGITAL TOOLS DISCOVERABLE», 2026-11-11): the language's pack, PDF and QR
  const sc = toolkitCopy.service;
  const packPath = `${localePath(locale, m20Toolkit.packPath)}/`;
  const packUrl = `https://www.megaparc.md${packPath}`;
  const dossierCopy = {
    label: sc.label[locale], title: sc.title[locale], lead: sc.lead[locale], pack: sc.pack[locale], pdf: sc.pdf[locale],
    pdfMeta: toolkitCopy.pack.dossierMeta[locale].replace("{pages}", String(m20Toolkit.dossier.pages)).replace("{version}", m20Toolkit.dossier.version),
    plans: sc.plans[locale], plansMeta: toolkitCopy.pack.plansMeta[locale], qr: sc.qr[locale],
  };

  const ground = x.plans.levels.find((level) => level.key === "ground");
  const photo = (key: string | undefined) => (key && x.photos[key] ? <LgPhoto photo={x.photos[key]} locale={locale} sizes="(min-width: 1024px) 22vw, 30vw" className="lg-portal__photo" /> : null);
  const fourth = decision
    ? { key: x.decision.kind === "economics" ? "economics" : `economics is-${x.decision.kind}`, href: "#economics", drawer: "economics", visual: <EconomicsGlyph className="lg-portal__glyph" />, ...(own.decision ?? portalCopy.economics) }
    : { key: "launch", href: "#readiness", drawer: "readiness", visual: photo(x.photos.intGroundHall ? "intGroundHall" : "groundHall"), ...portalCopy.launch };
  const portals: Portal[] = [
    { key: "location", href: "#location", visual: photo(x.motion.visibility?.photo), ...(own.location ?? portalCopy.location) },
    // the OWNER drawing itself (plan replacement pass 2026-11-09), never a redrawn plan
    { key: "plans", href: "#plans", visual: ground?.drawing ? photo(ground.drawing.photo) : null, ...(own.plans ?? portalCopy.plans) },
    // OWNER photography replacement 2026-11-11: the OWNER-approved engineering frame where the dataset has it
    { key: "ready", href: "#capex", visual: photo(x.photos.intLowerExit ? "intLowerExit" : x.photos.engineering ? "engineering" : undefined), ...(own.ready ?? portalCopy.ready) },
    fourth,
  ].map((portal, i) => ({ key: portal.key, no: String(i + 1).padStart(2, "0"), label: portal.label[locale], word: portal.word[locale], href: portal.href, drawer: "drawer" in portal ? portal.drawer : undefined, visual: portal.visual }));

  return (
    <PageShell locale={locale} experience mainClassName={`lg-page lg-page--${x.project}`}>
      <LeasingHero x={x} offer={offer} project={project} locale={locale} />
      <DecisionNav portals={portals} label={ui.chapters[locale]} cta={offer.primary} status={offer.status} />
      <SummaryCards x={x} offer={offer} locale={locale} />
      {/* the digital property dossier — only on the property that carries the Digital Leasing Toolkit */}
      {toolkit ? <DigitalDossier copy={dossierCopy} packHref={packPath} pdfHref={m20Toolkit.dossier.file[locale]} plansHref="#plans" /> : null}
      <Reasons x={x} offer={offer} locale={locale} />
      <FormatLens x={x} offer={offer} locale={locale} />
      <LocationMotion x={x} offer={offer} project={project} locale={locale} decision={decision} />
      <PhotoStory x={x} locale={locale} />
      <PlansScene x={x} offer={offer} locale={locale} />
      <CapitalBase x={x} locale={locale} />
      {/* OWNER overnight release §5 / §6: Technical Director + Architect · official e-Cadastru verification — the same component on every object */}
      <R3Trust slug={project.slug} locale={locale} tone="stone" verify />
      <ViewingScene x={x} offer={offer} project={project} locale={locale} />
      {/* Digital Leasing Toolkit (OWNER 2026-11-11): on the property that carries it, the three-action decision bar replaces the one-action phone bar */}
      {toolkit ? (
        <DecisionBar name={project.name} meta={`${offer.figure} · ${offer.status}`} plans={toolkitCopy.bar.plans[locale]} dossier={toolkitCopy.bar.dossier[locale]} dossierHref={m20Toolkit.dossier.file[locale]} book={toolkitCopy.bar.book[locale]} />
      ) : (
        <StickyCta name={project.name} meta={`${offer.figure} · ${offer.status}`} label={offer.primary} />
      )}
      {toolkit ? (
        <>
          <LgDrawer id="precheck" title={precheckCopy.title[locale]} kicker={project.name} closeLabel={ui.close[locale]}>
            <PreCheck locale={locale} />
          </LgDrawer>
          <LgDrawer id="book" title={toolkitCopy.pack.book[locale]} kicker={project.name} closeLabel={ui.close[locale]}>
            <BookViewing locale={locale} unitLabel={offer.unitLabel} />
          </LgDrawer>
          <LgDrawer id="qr" title={sc.qrTitle[locale]} kicker={project.name} closeLabel={ui.close[locale]}>
            <QrHandoff qr={m20Toolkit.qr.svg} url={packUrl} text={sc.qrText[locale]} copyLabel={toolkitCopy.share.copy[locale]} copied={sc.copied[locale]} />
          </LgDrawer>
        </>
      ) : null}
      <LgDrawer id="tech" title={x.drawers.tech.title[locale]} kicker={project.name} closeLabel={ui.close[locale]} className={x.passport ? "is-passport" : undefined}>
        <TechSheet x={x} offer={offer} project={project} locale={locale} />
      </LgDrawer>
      <LgDrawer id="gallery" title={galleryTitle[locale]} kicker={project.name} closeLabel={ui.close[locale]} wide>
        <PhotoGallery x={x} locale={locale} />
      </LgDrawer>
      <LgDrawer id="readiness" title={x.drawers.readiness.title[locale]} kicker={project.name} closeLabel={ui.close[locale]}>
        <ReadinessSheet x={x} locale={locale} offer={offer} />
      </LgDrawer>
      {decision ? (
        <LgDrawer id="economics" title={decisionTitle(x, locale)} kicker={decisionKicker(x, project.name, locale)} closeLabel={ui.close[locale]} wide className={x.decision.kind === "economics" ? "is-calc" : undefined}>
          <DecisionSheet x={x} offer={offer} project={project} locale={locale} />
        </LgDrawer>
      ) : null}
    </PageShell>
  );
}
