import Link from "next/link";
import { PropertyTrust } from "@/components/leasing/property-trust";
import type { CSSProperties } from "react";
import { viewingHref } from "@/components/leasing/unit-card";
import { UnitPlan } from "@/components/leasing/unit-plan";
import { LocationSection } from "@/components/location-section";
import { PageShell } from "@/components/page-shell";
import { ProjectStatus, storyLine } from "@/components/project-facts";
import { ArtImage } from "@/components/primitives";
import { Button, Icon } from "@/components/ui";
import { LeasingExperiencePage } from "@/components/leasing-experience/experience-page";
import { availabilityLabel, availabilityOf, formatAreaRange, isDemoField, leasingExperienceFor, nextProject, propertyOccupancy, spacesFor, type ProjectEntry } from "@/content/source";
import { assetProfiles, creangaProfile, tenantFit, type Requirement } from "@/data/demo-content";
import type { AssetSlug } from "@/lib/assets";
import { needs as needCopy } from "@/lib/leasing";
import { localePath, type Localized, type SiteLocale } from "@/lib/site-data";

/**
 * OPERATING PROPERTY PAGE — a digital property tour (OWNER "PREMIUM PHASE 2",
 * 2026-10-09): hero (the building, then name · city / district · total area ·
 * status — no box over the photograph) → identity → street / context → key
 * facts → entrance · access · parking → location (light OSM map) → gallery
 * (only real photography — none beyond the hero yet, so it is not shown) →
 * the available unit, if any, set apart from the property → its plan →
 * technical information → close.
 * Only confirmed values are published; DEMO profile values (land, parking
 * counts, years, levers) never render. A fully occupied building (Moscova 9,
 * Creangă 78) carries no leasing language, no viewing and no availability
 * action — its story, architecture, location, operation and current status.
 * Dacia 31 has no public offer and no published occupancy: no availability
 * statement at all. Moscova 20: the property (704 m²) and the available unit
 * (625,7 m²) are separate blocks.
 */
const N = " ";
const copy = {
  back: { ro: "Proiecte", ru: "Проекты", en: "Projects" },
  place: { ro: "Oraș · cartier", ru: "Город · район", en: "City · district" },
  area: { ro: "Suprafața totală", ru: "Общая площадь", en: "Total area" },
  format: { ro: "Format", ru: "Формат", en: "Format" },
  status: { ro: "Statut", ru: "Статус", en: "Status" },
  identityLabel: { ro: "Obiectul", ru: "Объект", en: "The property" },
  contextLabel: { ro: "Strada și împrejurimile", ru: "Улица и окружение", en: "Street and surroundings" },
  factsLabel: { ro: "Date cheie", ru: "Ключевые факты", en: "Key facts" },
  levels: { ro: "Niveluri", ru: "Уровни", en: "Levels" },
  accessLabel: { ro: "Intrare · acces · parcare", ru: "Вход · доступ · парковка", en: "Entrance · access · parking" },
  accessTitle: { ro: "Cum se ajunge și cum se intră.", ru: `Как подъехать и${N}войти.`, en: "How you arrive and walk in." },
  techLabel: { ro: "Informații tehnice", ru: "Техническая информация", en: "Technical information" },
  unitLabel: { ro: "Spațiu liber în clădire", ru: "Свободное помещение в здании", en: "Available space in the building" },
  unitOpen: { ro: "Vezi spațiul", ru: "Смотреть помещение", en: "View the space" },
  viewing: { ro: "Solicită o vizionare", ru: "Запросить просмотр", en: "Request a viewing" },
  planLabel: { ro: "Plan", ru: "План", en: "Plan" },
  occupied: { ro: "ocupat", ru: "занято", en: "occupied" },
  closeLabel: { ro: "Mai departe", ru: "Дальше", en: "Next" },
  closeViewing: { ro: "Vedeți spațiul cu ochii dumneavoastră.", ru: "Посмотрите помещение вживую.", en: "See the space for yourself." },
  closeAsk: { ro: "Întrebați despre această clădire.", ru: `Вопрос об${N}этом здании?`, en: "A question about this building?" },
  closeFull: { ro: "Clădirea este închiriată integral.", ru: "Здание сдано полностью.", en: "The building is fully let." },
  seeSpaces: { ro: "Vedeți spațiile disponibile", ru: "Смотреть свободные помещения", en: "See available spaces" },
  ask: { ro: "Scrieți-ne despre obiect", ru: "Написать об объекте", en: "Write about the property" },
  nextLabel: { ro: "Următorul proiect", ru: "Следующий проект", en: "Next project" },
  allProjects: { ro: "Toate proiectele", ru: "Все проекты", en: "All projects" },
  partnership: { ro: "Parteneriat investițional", ru: "Инвестиционное партнёрство", en: "Investment partnership" },
} satisfies Record<string, Localized>;

/** Moscova 20: the property itself (704 m², OWNER-confirmed) — kept apart from the 625,7 m² unit on offer. */
const propertyLine: Partial<Record<AssetSlug, Localized>> = {
  "moscova-20": {
    ro: "Obiect comercial de 704 m² la colțul bulevardului Moscova cu strada Matei Basarab — pe prima linie.",
    ru: `Торговый объект площадью 704${N}м² на${N}углу бульвара Москова и${N}улицы Матей Басараб${N}— на${N}первой линии.`,
    en: "A 704 m² retail property on the corner of Moscova Boulevard and Matei Basarab Street — on the first line.",
  },
};
/** Story paragraphs addressed to a prospective tenant — hidden while the building is fully let; unit paragraphs go to the unit block. */
const pitchParagraphs: Partial<Record<AssetSlug, number[]>> = { "moscova-9": [0] };
const unitParagraphs: Partial<Record<AssetSlug, number[]>> = { "moscova-20": [2] };
/** Hero framing per property: the whole building, its frontage and the street. */
const heroPosition: Partial<Record<AssetSlug, string>> = { "moscova-9": "50% 60%", "dacia-31": "50% 56%", "moscova-20": "50% 70%" };
const accessKeys: Requirement[] = ["entrance", "visibility", "delivery", "parking"];
const techKeys: Requirement[] = ["ground", "power", "ventilation", "flexible"];
/** Leasing-flexibility notes read as an offer — not shown for a fully let building. */
const offerKeys: Requirement[] = ["flexible"];

export function IncomeProjectPage({ locale, project }: { locale: SiteLocale; project: ProjectEntry }) {
  // Gold-standard leasing experience (OWNER 2026-11-06, Moscova 20 only): shown while
  // its unit is published; LEASED / HIDDEN / TO_CONFIRM falls back to the page below.
  const experience = leasingExperienceFor(project.slug);
  if (experience) return <LeasingExperiencePage locale={locale} project={project} unit={experience.unit} experience={experience.experience} />;
  return <IncomePropertyPage locale={locale} project={project} />;
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
  const own = spacesFor(slug);
  /** 100 % occupied and nothing on the public market (OWNER 2026-10-09). */
  const fullyLet = occupancy.fullyLet && own.length === 0;
  const unit = own[0] ?? null;
  /** A district is shown only when confirmed (Creangă 78's district is not yet). */
  const district = isCreanga && creangaProfile.district.status === "DEMO" ? null : project.district[locale];
  const placeLine = [asset.city[locale], district].filter(Boolean).join(` · `);
  const narrative = isCreanga ? creangaProfile.narrative.value[locale] : asset.narrative[locale];
  const lead = propertyLine[slug]?.[locale] ?? (isCreanga ? creangaProfile.lead.value[locale] : fullyLet ? storyLine[slug][locale] : asset.lead[locale]);
  const hidden = new Set([...(fullyLet ? pitchParagraphs[slug] ?? [] : []), ...(unitParagraphs[slug] ?? [])]);
  const story = isCreanga ? [] : asset.story[locale].filter((_, index) => !hidden.has(index));
  const unitStory = (unitParagraphs[slug] ?? []).map((index) => asset.story[locale][index]).filter(Boolean);
  const caps = fit.capabilities;
  const confirmedCap = (key: Requirement) => (caps && caps[key].status !== "DEMO" && !(fullyLet && offerKeys.includes(key)) ? caps[key] : null);
  const access = accessKeys.map((key) => ({ key, cap: confirmedCap(key) })).filter((row) => row.cap);
  const tech = techKeys.map((key) => ({ key, cap: confirmedCap(key) })).filter((row) => row.cap);
  /** Moscova 20's fact list and programme describe the unit — they belong to the unit block. */
  const unitFacts = slug === "moscova-20";
  const keyFacts = unitFacts ? [] : asset.keyFacts;
  const programme = unitFacts ? [] : asset.building.programme;
  const maxLevel = Math.max(1, ...programme.map((row) => parseFloat(row.value.en.replace(/[^\d.]/g, "")) || 0));
  const statusText = fullyLet ? null : own.length ? null : project.card.status[locale];

  return (
    <PageShell locale={locale} experience mainClassName="xp-asset pp2">
      {/* HERO — the building first; identity beside it, never over it */}
      <section className={`pp2-hero${isCreanga ? " pp2-hero--contained" : ""}`}>
        <div className="xp-shell pp2-hero__head" data-reveal>
          <Link href={p("/projects")} className="pp2-back"><Icon name="left" /> {copy.back[locale]}</Link>
          <h1 className="pp2-hero__name">{asset.name}</h1>
          <dl className="pp2-hero__facts">
            <div><dt>{copy.place[locale]}</dt><dd>{placeLine}</dd></div>
            <div><dt>{copy.area[locale]}</dt><dd>{profile.area.value[locale]}</dd></div>
            <div><dt>{copy.status[locale]}</dt><dd>{statusText ?? <ProjectStatus project={project} locale={locale} as="span" />}</dd></div>
          </dl>
        </div>
        <figure className="xp-shell pp2-hero__media" data-reveal>
          <ArtImage media={asset.media!} variant={isCreanga ? "card" : "master"} alt={`${asset.name} — ${asset.positioning[locale]}`} priority sizes={isCreanga ? "(min-width: 1024px) 60rem, 100vw" : "(min-width: 1440px) 1360px, 100vw"} position={heroPosition[slug]} />
        </figure>
      </section>

      {/* IDENTITY — what the building is */}
      <section className="pm-sec pm-sec--paper pp2-id">
        <div className="xp-shell pp2-id__grid">
          <div data-reveal>
            <p className="pm-kicker">{copy.identityLabel[locale]}</p>
            <h2 className="pm-h2 pp2-id__title">{narrative}</h2>
          </div>
          <div className="pp2-id__text" data-reveal>
            <p className="pp2-id__lead">{lead}</p>
            {story.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
      </section>

      {/* STREET / CONTEXT — the frontage and what is around it (confirmed points only) */}
      {asset.connectivity.length ? (
        <section className="pm-sec pm-sec--warm pp2-context">
          <div className="xp-shell pp2-context__grid">
            <figure className="pp2-context__media al-reveal" data-reveal>
              <ArtImage media={asset.media!} variant="portrait" alt={`${asset.name} — ${copy.contextLabel[locale]}`} sizes="(min-width: 1024px) 34vw, 100vw" />
            </figure>
            <div className="pp2-context__copy" data-reveal>
              <p className="pm-kicker">{copy.contextLabel[locale]}</p>
              <ul className="pp2-points">
                {asset.connectivity.map((point) => (
                  <li key={point.en}>{point[locale]}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      ) : null}

      {/* KEY FACTS — the property in figures */}
      <section className="pm-sec pm-sec--paper pp2-facts">
        <div className="xp-shell">
          <p className="pm-kicker" data-reveal>{copy.factsLabel[locale]}</p>
          <dl className="pp2-figures" data-reveal>
            <div className="pp2-figures__lead"><dt>{copy.area[locale]}</dt><dd>{profile.area.value[locale]}</dd></div>
            {occupancy.fullyLet ? <div><dt>{copy.status[locale]}</dt><dd>100{N}%<small>{copy.occupied[locale]}</small></dd></div> : null}
            {/* the confirmed format, unless the fact list already names it */}
            {keyFacts.some((fact) => /format|формат/i.test(fact.label.en + fact.label.ru)) ? null : <div className="pp2-figures__text"><dt>{copy.format[locale]}</dt><dd>{profile.format.value[locale]}</dd></div>}
            {keyFacts.filter((fact) => !/^(Общая площадь|Total|Suprafața totală)/.test(fact.label[locale])).map((fact) => (
              <div key={fact.label.en}><dt>{fact.label[locale]}</dt><dd>{fact.value[locale]}</dd></div>
            ))}
          </dl>
          {programme.length ? (
            <div className="pp2-levels" data-reveal>
              <p className="pp2-sub">{copy.levels[locale]}</p>
              <ol>
                {[...programme].reverse().map((row) => {
                  const m2 = parseFloat(row.value.en.replace(/[^\d.]/g, "")) || 0;
                  return (
                    <li key={row.label.en} style={{ "--w": `${Math.round((m2 / maxLevel) * 100)}%` } as CSSProperties}>
                      <span className="pp2-levels__name">{row.label[locale]}</span>
                      <span className="pp2-levels__bar" aria-hidden="true" />
                      <span className="pp2-levels__value">{row.value[locale]}</span>
                    </li>
                  );
                })}
              </ol>
            </div>
          ) : null}
        </div>
      </section>

      {/* ENTRANCE · ACCESS · PARKING — confirmed only */}
      {access.length ? (
        <section className="pm-sec pm-sec--warm pp2-access">
          <div className="xp-shell">
            <div className="pm-head pm-head--split" data-reveal>
              <p className="pm-kicker">{copy.accessLabel[locale]}</p>
              <h2 className="pm-h2">{copy.accessTitle[locale]}</h2>
            </div>
            <dl className="pp2-rows">
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

      {/* LOCATION — light editorial map (the route actions only where the address is confirmed) */}
      <LocationSection locale={locale} no="" mapKey={slug} name={asset.name} place={district ?? asset.city[locale]} area={district ? asset.city[locale] : ""} text={isCreanga ? "" : asset.location[locale]} points={[]} map={asset.map} />

      {/* AVAILABLE UNIT — set apart from the property */}
      {unit ? (
        <section className="pm-sec pp2-unit" id="available">
          <div className="xp-shell pp2-unit__grid">
            <div className="pp2-unit__copy" data-reveal>
              <p className="pm-kicker">{copy.unitLabel[locale]}</p>
              <h2 className="pp2-unit__name">{unit.unit[locale]}</h2>
              <p className="pp2-unit__area">{formatAreaRange(unit.areaMin, unit.area, locale)}</p>
              <p className={`lx2-offer__status is-${availabilityOf(unit).key}`}>{availabilityLabel(unit, locale)}</p>
              {unitStory.map((paragraph) => (
                <p key={paragraph} className="pp2-unit__text">{paragraph}</p>
              ))}
              {unit.confirmed.includes("highlights") && unit.highlights.length ? (
                <ul className="lx2-offer__points">
                  {unit.highlights.map((point) => (
                    <li key={point.en}>{point[locale]}</li>
                  ))}
                </ul>
              ) : null}
              <div className="pm-actions">
                <Button href={viewingHref(locale, unit)}>{copy.viewing[locale]}</Button>
                <Link className="pm-link" href={p(`/leasing/${unit.id}`)}>{copy.unitOpen[locale]}<Icon /></Link>
              </div>
            </div>
            <div className="pp2-unit__side" data-reveal>
              {unitFacts ? (
                <dl className="pp2-unit__facts">
                  {asset.keyFacts.map((fact) => (
                    <div key={fact.label.en}><dt>{fact.label[locale]}</dt><dd>{fact.value[locale]}</dd></div>
                  ))}
                  {asset.building.programme.map((fact) => (
                    <div key={fact.label.en}><dt>{fact.label[locale]}</dt><dd>{fact.value[locale]}</dd></div>
                  ))}
                </dl>
              ) : null}
              {unit.plan ? (
                <div className="pp2-unit__plan" style={{ "--plan-max": "36rem" } as CSSProperties}>
                  <p className="pp2-sub">{copy.planLabel[locale]}</p>
                  <UnitPlan plan={unit.plan} locale={locale} demo={isDemoField(unit, "plan")} title={`${asset.name} — ${unit.unit[locale]}`} uid={`project-${unit.id}`} />
                </div>
              ) : null}
            </div>
          </div>
          {asset.caveat ? <p className="xp-shell pp2-caveat">{asset.caveat[locale]}</p> : null}
        </section>
      ) : null}

      {/* TECHNICAL SUPPORT + OFFICIAL VERIFICATION — wherever a unit is offered (OWNER overnight release §6) */}
      {unit ? <PropertyTrust slug={slug} locale={locale} /> : null}

      {/* TECHNICAL INFORMATION — confirmed only, for the whole building */}
      {!unit && tech.length >= 2 ? (
        <section className="pm-sec pm-sec--paper pp2-tech">
          <div className="xp-shell">
            <div className="pm-head pm-head--split" data-reveal>
              <p className="pm-kicker">{copy.techLabel[locale]}</p>
              {asset.caveat ? <p className="pm-head__lead">{asset.caveat[locale]}</p> : null}
            </div>
            <dl className="pp2-rows">
              {tech.map(({ key, cap }) => (
                <div key={key} data-reveal>
                  <dt>{needCopy[key].label[locale]}</dt>
                  <dd>{cap!.note[locale]}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>
      ) : null}

      {/* CLOSE — a viewing only where a unit is offered; a fully let building has no availability action */}
      <section className="pm-close">
        <div className="xp-shell pm-close__grid">
          <div data-reveal>
            <p className="pm-kicker">{asset.name}</p>
            <h2 className="pm-close__title pp2-close__title">{(unit ? copy.closeViewing : fullyLet ? copy.closeFull : copy.closeAsk)[locale]}</h2>
            {unit ? (
              <div className="pm-actions pp2-close__actions">
                <Button href={viewingHref(locale, unit)}>{copy.viewing[locale]}</Button>
              </div>
            ) : fullyLet ? (
              // a fully let building is proof of execution, not a leasing pitch: the route goes to the spaces that are offered (OWNER overnight release §9)
              <div className="pm-actions pp2-close__actions">
                <Button href={`${p("/leasing")}#available`}>{copy.seeSpaces[locale]}</Button>
              </div>
            ) : !fullyLet ? (
              <div className="pm-actions pp2-close__actions">
                <Button href={`${p("/contact")}?subject=general&property=${slug}#question`}>{copy.ask[locale]}</Button>
              </div>
            ) : null}
          </div>
          <nav className="pm-close__routes" aria-label={copy.closeLabel[locale]} data-reveal>
            <Link href={p(`/projects/${next.slug}`)}>
              <span>{copy.nextLabel[locale]} · {next.name}</span>
              <Icon name="arrow" size={18} />
            </Link>
            <Link href={p("/projects")}>
              <span>{copy.allProjects[locale]}</span>
              <Icon name="arrow" size={18} />
            </Link>
            <Link href={p("/partnership")}>
              <span>{copy.partnership[locale]}</span>
              <Icon name="arrow" size={18} />
            </Link>
          </nav>
        </div>
      </section>
    </PageShell>
  );
}
