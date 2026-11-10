import Link from "next/link";
import type { CSSProperties } from "react";
import { viewingHref } from "@/components/leasing/unit-card";
import { UnitPlan } from "@/components/leasing/unit-plan";
import { LocationSection } from "@/components/location-section";
import { PageShell } from "@/components/page-shell";
import { storyLine } from "@/components/project-facts";
import { ArtImage } from "@/components/primitives";
import { Figure, NB, R3Button, R3Label, R3Link, R3Trust, viewableNow } from "@/components/r3";
import { Icon } from "@/components/ui";
import { LeasingExperiencePage } from "@/components/leasing-experience/experience-page";
import { availabilityLabel, availabilityOf, formatAreaRange, formatDate, isDemoField, leasingExperienceFor, nextProject, propertyOccupancy, spacesFor, type ProjectEntry } from "@/content/source";
import { assetProfiles, company, contactLinks, creangaProfile, occupancyOf, tenantFit, type Requirement } from "@/data/demo-content";
import type { AvailableSpace } from "@/data/leasing-inventory";
import type { AssetSlug } from "@/lib/assets";
import { operations } from "@/lib/business";
import { needs as needCopy } from "@/lib/leasing";
import { localePath, type SiteLocale } from "@/lib/site-data";

/**
 * OPERATING PROPERTY PAGE — SITEWIDE R3 §5 (OWNER 2026-11-09). One template, three compositions driven by the
 * status model (never by hand):
 *  - ACTIVE LEASING ASSET (a unit available now, or several units) — Dacia 31: the building at full bleed, the
 *    property, the available space(s) with their blocks / floor plates (any number of units), adaptability,
 *    access, technical capability, location, the trust system, the viewing.
 *  - UPCOMING OPPORTUNITY (every unit available from a date) — Moscova 9: the date as the headline, the
 *    location, the plan evidence, technical readiness (confirmed values only), the trust system, early interest.
 *  - OPERATING ASSET, FULLY LET — Creangă 78: institutional proof (long-term ownership, operating discipline,
 *    100 % occupancy derived from the register, asset quality); no leasing CTA is fabricated. Its 960 px
 *    photograph is never enlarged.
 * Moscova 20 keeps its DESIGN FROZEN leasing experience while its unit is published.
 * Only confirmed values are published; DEMO profile values never render.
 */
const copy = {
  back: { ro: "Proiecte", ru: "Проекты", en: "Projects" },
  totalArea: { ro: "Suprafața totală", ru: "Общая площадь", en: "Total area" },
  format: { ro: "Format", ru: "Формат", en: "Format" },
  place: { ro: "Amplasare", ru: "Расположение", en: "Location" },
  propertyLabel: { ro: "Obiectul", ru: "Объект", en: "The property" },
  spaceLabel: { ro: "Spațiu disponibil", ru: "Свободная площадь", en: "Available space" },
  spacesLabel: { ro: "Spații disponibile", ru: "Свободные площади", en: "Available spaces" },
  blocks: { ro: "Niveluri și suprafețe", ru: "Уровни и площади", en: "Levels and areas" },
  zones: { ro: "Zonele spațiului", ru: "Зоны помещения", en: "Zones of the space" },
  planCaveat: { ro: "Schema suprafețelor — nu este un plan măsurat.", ru: "Схема площадей — не обмерный план.", en: "Area scheme — not a measured plan." },
  accessLabel: { ro: "Acces · adaptare · tehnică", ru: "Доступ · адаптация · техника", en: "Access · adaptation · technical" },
  accessTitle: { ro: "Ce este confirmat despre clădire.", ru: `Что подтверждено по${NB}зданию.`, en: "What is confirmed about the building." },
  viewing: { ro: "Solicită o vizionare", ru: "Запросить просмотр", en: "Request a viewing" },
  early: { ro: "Anunțați interesul din timp", ru: "Заявить интерес заранее", en: "Register early interest" },
  unitOpen: { ro: "Vezi spațiul", ru: "Смотреть помещение", en: "View the space" },
  call: { ro: "Sunați", ru: "Позвонить", en: "Call" },
  upcomingLabel: { ro: "Oportunitate în curând", ru: "Скоро освобождается", en: "Coming up" },
  planEarly: { ro: "Planificați din timp următoarea locație.", ru: `Запланируйте следующую локацию заранее.`, en: "Plan your next location early." },
  discussEarly: { ro: "Discutați înainte de eliberare", ru: "Обсудить до освобождения", en: "Discuss before it is released" },
  seeSpaces: { ro: "Vedeți suprafețele", ru: "Смотреть площади", en: "See the spaces" },
  upcoming: (unit: string, date: string, locale: SiteLocale) =>
    locale === "ru" ? `${unit}${NB}— с${NB}${date}.` : locale === "ro" ? `${unit} — din ${date}.` : `${unit} — from ${date}.`,
  earlyTitle: { ro: "Rezervați primul pas acum.", ru: `Займите очередь на${NB}просмотр заранее.`, en: "Take the first step now." },
  earlyText: {
    ro: "Spațiul se eliberează la data indicată. Lăsați o cerere — vă contactăm pentru vizionare și verificarea tehnică a formatului dumneavoastră.",
    ru: `Площадь освобождается к${NB}указанной дате. Оставьте заявку${NB}— свяжемся для просмотра и${NB}технической проверки вашего формата.`,
    en: "The space becomes free on the date shown. Leave a request — we will contact you for a viewing and a technical check of your format.",
  },
  viewTitle: { ro: "Vedeți clădirea cu ochii dumneavoastră.", ru: `Посмотрите здание лично.`, en: "See the building for yourself." },
  proofLabel: { ro: "Obiect în funcțiune", ru: "Действующий объект", en: "Operating property" },
  occupied: { ro: "ocupat", ru: "занято", en: "occupied" },
  ownership: { ro: "în proprietatea MEGAPARC", ru: "в собственности MEGAPARC", en: "owned by MEGAPARC" },
  ownershipTitle: { ro: "Proprietate pe termen lung.", ru: "Долгосрочное владение.", en: "Long-term ownership." },
  disciplineTitle: { ro: "Disciplina exploatării.", ru: "Дисциплина эксплуатации.", en: "Operating discipline." },
  stabilityTitle: { ro: "Clădire ocupată integral.", ru: "Здание занято полностью.", en: "A fully let building." },
  stabilityText: {
    ro: "Ocuparea se calculează din registrul spațiilor, nu se scrie de mână: nici un spațiu din clădire nu este oferit public.",
    ru: `Заполненность считается по${NB}реестру помещений, а${NB}не${NB}вписывается вручную: ни${NB}одно помещение в${NB}здании не${NB}предлагается публично.`,
    en: "Occupancy is derived from the space register, never typed by hand: no space in the building is publicly offered.",
  },
  closeLabel: { ro: "Mai departe", ru: "Дальше", en: "Next" },
  closeFull: { ro: "Clădirea este închiriată integral.", ru: "Здание сдано полностью.", en: "The building is fully let." },
  otherSpaces: { ro: "Spații disponibile în alte clădiri", ru: `Свободные помещения в${NB}других зданиях`, en: "Available space in other buildings" },
  ownershipText: {
    ro: "Clădirea rămâne în proprietatea MEGAPARC și lucrează ca parte a portofoliului companiei.",
    ru: `Здание остаётся в${NB}собственности MEGAPARC и${NB}работает как часть портфеля компании.`,
    en: "The building stays in MEGAPARC ownership and works as part of the company portfolio.",
  },
  allProjects: { ro: "Toate proiectele", ru: "Все проекты", en: "All projects" },
  next: { ro: "Următorul proiect", ru: "Следующий проект", en: "Next project" },
  investment: { ro: "Investiții și parteneriat", ru: "Инвестиции и партнёрство", en: "Investment and partnership" },
  ask: { ro: "Scrieți-ne despre obiect", ru: "Написать об объекте", en: "Write about the property" },
} as const;

/** Hero framing per property: the whole building, its frontage and the street. */
const heroPosition: Partial<Record<AssetSlug, string>> = { "moscova-9": "50% 62%", "dacia-31": "50% 56%" };
const accessKeys: Requirement[] = ["entrance", "visibility", "delivery", "parking", "flexible", "power", "ventilation", "ground"];
/** Leasing-flexibility notes read as an offer — not shown for a fully let building. */
const offerKeys: Requirement[] = ["flexible"];
const OMITTED = "__DEMO_OMITTED__";

export function IncomeProjectPage({ locale, project }: { locale: SiteLocale; project: ProjectEntry }) {
  // Gold-standard leasing experience (OWNER 2026-11-06, Moscova 20 only — DESIGN FROZEN): shown while
  // its unit is published; LEASED / HIDDEN / TO_CONFIRM falls back to the page below.
  const experience = leasingExperienceFor(project.slug);
  if (experience) return <LeasingExperiencePage locale={locale} project={project} unit={experience.unit} experience={experience.experience} />;
  return <IncomePropertyPage locale={locale} project={project} />;
}

function UnitBlocks({ unit, locale, name }: { unit: AvailableSpace; locale: SiteLocale; name: string }) {
  const plan = unit.plan;
  if (plan.kind === "stack") {
    const max = Math.max(...plan.levels.map((level) => level.m2));
    return (
      <div className="r3-blocks">
        <p className="r3-blocks__label">{copy.blocks[locale]}</p>
        <ol className="r3-stack">
          {plan.levels.map((level) => (
            <li key={level.label.en} style={{ "--w": `${Math.round((level.m2 / max) * 100)}%` } as CSSProperties}>
              <span className="r3-stack__bar" aria-hidden="true" />
              <span className="r3-stack__name">{level.label[locale]}</span>
              <span className="r3-stack__area"><Figure value={formatAreaRange(undefined, level.m2, locale)} /></span>
            </li>
          ))}
        </ol>
        {plan.note ? <p className="r3-note">{plan.note[locale]}</p> : null}
      </div>
    );
  }
  return (
    <div className="r3-blocks">
      <p className="r3-blocks__label">{copy.zones[locale]}</p>
      {plan.kind === "zones" ? (
        <ul className="r3-zones">
          {plan.zones.map((zone) => (
            <li key={zone.label.en} className={`is-${zone.tone}`}>
              <span>{zone.label[locale]}</span>
              <Figure value={formatAreaRange(undefined, zone.m2, locale)} />
            </li>
          ))}
        </ul>
      ) : null}
      <div className="r3-blocks__plan">
        <UnitPlan plan={plan} locale={locale} demo={isDemoField(unit, "plan")} title={`${name} — ${unit.unit[locale]}`} uid={`r3-${unit.id}`} />
        <p className="r3-note">{copy.planCaveat[locale]}</p>
      </div>
    </div>
  );
}

function IncomePropertyPage({ locale, project }: { locale: SiteLocale; project: ProjectEntry }) {
  const asset = project.asset!;
  const slug = asset.slug;
  const next = nextProject(project.slug);
  const p = (path: string) => localePath(locale, path);
  const fit = tenantFit[slug];
  const profile = assetProfiles[slug];
  const isCreanga = slug === "creanga-78";
  /** Derived from the unit register (OWNER CMS brief 2026-11-06) — never typed by hand. */
  const occupancy = propertyOccupancy(slug);
  const units = spacesFor(slug);
  const fullyLet = occupancy.fullyLet && units.length === 0;
  /** Upcoming opportunity: every offer starts on a future date AND the building is physically occupied today (Moscova 9) —
   *  a building that can be visited now (Dacia 31, 551 of 5 541 m² occupied) is an active leasing asset with a viewing. */
  const occupiedNow = occupancyOf(slug).occupied >= occupancyOf(slug).total - 1;
  const upcoming = units.length > 0 && units.every((unit) => availabilityOf(unit).key === "soon") && occupiedNow;
  const mode: "lease" | "upcoming" | "full" | "plain" = fullyLet ? "full" : upcoming ? "upcoming" : units.length ? "lease" : "plain";
  /** A district is shown only when confirmed (Creangă 78's district is not yet). */
  const district = isCreanga && creangaProfile.district.status === "DEMO" ? null : project.district[locale];
  const placeLine = [asset.city[locale], district].filter(Boolean).join(" · ");
  const narrative = isCreanga ? creangaProfile.narrative.value[locale] : asset.narrative[locale];
  const lead = isCreanga ? creangaProfile.lead.value[locale] : fullyLet ? storyLine[slug][locale] : asset.lead[locale];
  const story = isCreanga ? [] : asset.story[locale].filter((_, index) => !(fullyLet && index === 0 && slug === "moscova-9"));
  const caps = fit.capabilities;
  const confirmedCap = (key: Requirement) => (caps && caps[key].status !== "DEMO" && !(fullyLet && offerKeys.includes(key)) ? caps[key] : null);
  const access = accessKeys.map((key) => ({ key, cap: confirmedCap(key) })).filter((row) => row.cap);
  const keyFacts = asset.keyFacts.filter((fact) => !/^(Общая площадь|Total|Suprafața totală)/.test(fact.label[locale]));
  const first = units[0] ?? null;
  const firstDate = first && availabilityOf(first).date ? formatDate(availabilityOf(first).date!, locale) : null;
  const viewingAction = first ? (mode === "upcoming" ? copy.early[locale] : copy.viewing[locale]) : null;
  const statusLine = first ? `${availabilityLabel(first, locale)} · ${formatAreaRange(first.areaMin, first.area, locale)}` : fullyLet ? `${copy.proofLabel[locale]} · 100${NB}% ${copy.occupied[locale]}` : project.card.status[locale];

  const hero = slug === "dacia-31" ? "bleed" : isCreanga ? "contained" : "stacked";

  return (
    <PageShell locale={locale} variant={hero === "bleed" ? "overlay" : "solid"} experience mainClassName={`r3-page r3-prop r3-prop--${mode}`}>
      {/* HERO — the building first, the facts beside it, never a box over the photograph */}
      {hero === "bleed" ? (
        <section className="r3-hero r3-hero--prop" data-xp-hero>
          <div className="r3-hero__media" aria-hidden="true">
            <ArtImage media={asset.media!} alt="" priority sizes="100vw" position={heroPosition[slug]} />
          </div>
          <div className="r3-hero__veil" aria-hidden="true" />
          <div className="r3-shell r3-hero__inner">
            <Link href={p("/projects")} className="r3-back r3-back--light"><Icon name="left" size={14} /> {copy.back[locale]}</Link>
            <h1 className="r3-display r3-prop__name">{asset.name}</h1>
            <div className="r3-hero__base">
              <p className="r3-hero__lead">{project.editorial?.headline[locale] ?? narrative}</p>
              <div className="r3-prop__heroacts">
                <p className={`r3-state r3-state--light is-${mode === "lease" ? "now" : "soon"}`}>{statusLine}</p>
                {first && viewingAction ? <R3Button href={viewingHref(locale, first)} tone="light">{viewingAction}</R3Button> : null}
                {first ? <a className="r3-link r3-link--light" href="#available"><span>{copy.seeSpaces[locale]}</span><Icon name="down" size={16} /></a> : null}
              </div>
            </div>
          </div>
        </section>
      ) : (
        <section className={`r3-phero r3-phero--${hero}${mode === "upcoming" ? " r3-phero--soft" : ""}`}>
          <div className="r3-shell r3-phero__head" data-reveal>
            <Link href={p("/projects")} className="r3-back"><Icon name="left" size={14} /> {copy.back[locale]}</Link>
            <h1 className="r3-display r3-prop__name">{asset.name}</h1>
            {mode === "upcoming" ? <p className="r3-phero__lead">{copy.planEarly[locale]}</p> : null}
            <dl className="r3-phero__facts">
              <div><dt>{copy.place[locale]}</dt><dd>{placeLine}</dd></div>
              <div><dt>{copy.totalArea[locale]}</dt><dd>{profile.area.value[locale]}</dd></div>
              <div><dt>{copy.format[locale]}</dt><dd>{profile.format.value[locale]}</dd></div>
            </dl>
          </div>
          <figure className="r3-phero__media" data-reveal>
            <ArtImage media={asset.media!} variant={isCreanga ? "card" : "wide"} alt={`${asset.name} — ${asset.positioning[locale]}`} priority sizes={isCreanga ? "(min-width: 1024px) 50vw, 100vw" : "100vw"} position={heroPosition[slug]} />
          </figure>
          {isCreanga && fullyLet ? (
            <div className="r3-phero__proof" data-reveal>
              <p className="r3-phero__big"><Figure value="100 %" /></p>
              <p className="r3-phero__bigl">{copy.occupied[locale]} · {copy.ownership[locale]}</p>
            </div>
          ) : null}
        </section>
      )}

      {/* UPCOMING — the date is the headline (Moscova 9) */}
      {mode === "upcoming" && first && firstDate ? (
        <section className="r3-sec r3-sec--ink r3-upcoming">
          <div className="r3-shell r3-upcoming__grid">
            <div data-reveal>
              <R3Label tone="light">{copy.upcomingLabel[locale]}</R3Label>
              <p className="r3-upcoming__date">{firstDate}</p>
            </div>
            <div className="r3-upcoming__copy" data-reveal>
              <h2 className="r3-upcoming__title">{copy.planEarly[locale]}</h2>
              <p className="r3-statement">{copy.upcoming(first.unit[locale], firstDate, locale)}</p>
              <p className="r3-upcoming__area"><Figure value={formatAreaRange(first.areaMin, first.area, locale)} /></p>
              <p className="r3-lead">{first.headline[locale]}</p>
              <div className="r3-actions">
                <R3Button href={viewingHref(locale, first)} tone="light">{copy.early[locale]}</R3Button>
                <a className="r3-link r3-link--light" href={contactLinks.mobile}><span>{copy.discussEarly[locale]} · {company.mobile.value[locale]}</span><Icon size={16} /></a>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {/* THE PROPERTY — what the building is */}
      <section className="r3-sec r3-sec--ivory r3-pid">
        <div className="r3-shell r3-pid__grid">
          <div data-reveal>
            <R3Label>{copy.propertyLabel[locale]}</R3Label>
            <h2 className="r3-title">{narrative}</h2>
          </div>
          <div className="r3-pid__text" data-reveal>
            <p className="r3-pid__lead">{lead}</p>
            {story.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            <dl className="r3-pid__facts">
              <div className="is-lead"><dt>{copy.totalArea[locale]}</dt><dd><Figure value={profile.area.value[locale]} /></dd></div>
              {hero === "bleed" ? <div><dt>{copy.place[locale]}</dt><dd>{placeLine}</dd></div> : null}
              {hero === "bleed" ? <div><dt>{copy.format[locale]}</dt><dd>{profile.format.value[locale]}</dd></div> : null}
              {keyFacts.map((fact) => <div key={fact.label.en}><dt>{fact.label[locale]}</dt><dd>{fact.value[locale]}</dd></div>)}
            </dl>
          </div>
        </div>
      </section>

      {/* FULLY LET — institutional proof: ownership · discipline · stability · quality (no leasing CTA) */}
      {mode === "full" ? (
        <section className="r3-sec r3-sec--paper r3-proof">
          <div className="r3-shell">
            <ol className="r3-proof__list">
              <li data-reveal>
                <h3>{copy.ownershipTitle[locale]}</h3>
                <p className="r3-proof__fig"><Figure value={profile.area.value[locale]} /></p>
                <p>{copy.ownershipText[locale]}</p>
              </li>
              <li data-reveal>
                <h3>{copy.stabilityTitle[locale]}</h3>
                <p className="r3-proof__fig"><Figure value="100 %" /></p>
                <p>{copy.stabilityText[locale]}</p>
              </li>
              <li data-reveal>
                <h3>{copy.disciplineTitle[locale]}</h3>
                <p>{operations.text[locale]}</p>
                <ul className="r3-ticks">{operations.points.map((point) => <li key={point.en}>{point[locale]}</li>)}</ul>
              </li>
            </ol>
          </div>
        </section>
      ) : null}

      {/* AVAILABLE SPACE(S) — any number of units, each with its blocks / zones; set apart from the property */}
      {units.length ? (
        <section className="r3-sec r3-sec--paper r3-units" id="available">
          <div className="r3-shell">
            <R3Label>{units.length > 1 ? copy.spacesLabel[locale] : copy.spaceLabel[locale]}</R3Label>
            {units.map((unit) => {
              const a = availabilityOf(unit);
              return (
                <article key={unit.id} className="r3-unit" data-reveal>
                  <div className="r3-unit__copy">
                    <h2 className="r3-unit__name">{unit.unit[locale]}</h2>
                    <p className="r3-unit__area"><Figure value={formatAreaRange(unit.areaMin, unit.area, locale)} /></p>
                    <p className={`r3-state is-${a.key === "now" ? "now" : "soon"}`}>{availabilityLabel(unit, locale)}</p>
                    <p className="r3-unit__floor">{unit.floorLabel[locale]}</p>
                    {unit.confirmed.includes("highlights") && unit.highlights.length ? (
                      <ul className="r3-ticks">{unit.highlights.map((point) => <li key={point.en}>{point[locale]}</li>)}</ul>
                    ) : null}
                    <div className="r3-actions">
                      <R3Button href={viewingHref(locale, unit)}>{viewableNow(unit) ? copy.viewing[locale] : copy.early[locale]}</R3Button>
                      <R3Link href={p(`/leasing/${unit.id}`)}>{copy.unitOpen[locale]}</R3Link>
                    </div>
                  </div>
                  <UnitBlocks unit={unit} locale={locale} name={asset.name} />
                </article>
              );
            })}
            {asset.caveat ? <p className="r3-note r3-units__caveat">{asset.caveat[locale]}</p> : null}
          </div>
        </section>
      ) : null}

      {/* ACCESS · ADAPTATION · TECHNICAL — confirmed capabilities only */}
      {access.length ? (
        <section className="r3-sec r3-sec--ivory r3-caps">
          <div className="r3-shell">
            <div className="r3-head r3-head--split" data-reveal>
              <R3Label>{copy.accessLabel[locale]}</R3Label>
              <h2 className="r3-title">{copy.accessTitle[locale]}</h2>
              {first && first.technical.power[locale] !== OMITTED && first.confirmed.includes("power") ? <p className="r3-lead">{first.technical.power[locale]}</p> : null}
            </div>
            <dl className="r3-rows">
              {access.map(({ key, cap }) => (
                <div key={key} data-reveal>
                  <dt>{needCopy[key].label[locale]}</dt>
                  <dd>{cap!.note[locale]}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>
      ) : null}

      {/* LOCATION — the light editorial map */}
      <div className="r3-loc">
        <LocationSection locale={locale} no="" mapKey={slug} name={asset.name} place={district ?? asset.city[locale]} area={district ? asset.city[locale] : ""} text={isCreanga ? "" : asset.location[locale]} points={asset.connectivity} map={asset.map} />
      </div>

      {/* TRUST — technical feasibility first; e-Cadastru where the OWNER approved the number */}
      {units.length ? <R3Trust slug={slug} locale={locale} tone="stone" /> : null}

      {/* CLOSE — a viewing / early interest where a unit is offered; a fully let building has no leasing action */}
      <section className="r3-sec r3-sec--ivory r3-pclose">
        <div className="r3-shell r3-pclose__grid">
          <div data-reveal>
            <R3Label>{asset.name}</R3Label>
            <h2 className="r3-title">{mode === "upcoming" ? copy.earlyTitle[locale] : first ? copy.viewTitle[locale] : fullyLet ? copy.closeFull[locale] : copy.ask[locale]}</h2>
            {mode === "upcoming" ? <p className="r3-lead">{copy.earlyText[locale]}</p> : null}
            <div className="r3-actions">
              {first && viewingAction ? <R3Button href={viewingHref(locale, first)}>{viewingAction}</R3Button> : fullyLet ? <R3Button href={p("/projects")}>{copy.allProjects[locale]}</R3Button> : <R3Button href={`${p("/contact")}?subject=general&property=${slug}#question`}>{copy.ask[locale]}</R3Button>}
              {first ? <a className="r3-link r3-link--dark" href={contactLinks.mobile}><span>{copy.call[locale]} · {company.mobile.value[locale]}</span><Icon size={16} /></a> : null}
            </div>
          </div>
          <nav className="r3-routes__list r3-routes__list--side" aria-label={copy.closeLabel[locale]} data-reveal>
            <Link href={p(`/projects/${next.slug}`)}><span>{copy.next[locale]} · {next.name}</span><Icon size={20} /></Link>
            {fullyLet ? <Link href={`${p("/leasing")}#available`}><span>{copy.otherSpaces[locale]}</span><Icon size={20} /></Link> : <Link href={p("/projects")}><span>{copy.allProjects[locale]}</span><Icon size={20} /></Link>}
            <Link href={p("/partnership")}><span>{copy.investment[locale]}</span><Icon size={20} /></Link>
          </nav>
        </div>
      </section>
    </PageShell>
  );
}

