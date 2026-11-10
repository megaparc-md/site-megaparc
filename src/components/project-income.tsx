import Link from "next/link";
import type { CSSProperties } from "react";
import { viewingHref } from "@/components/leasing/unit-card";
import { UnitPlan } from "@/components/leasing/unit-plan";
import { LocationSection } from "@/components/location-section";
import { PageShell } from "@/components/page-shell";
import { storyLine } from "@/components/project-facts";
import { ArtImage } from "@/components/primitives";
import { Figure, NB, R3Button, R3Label, R3Link, R3Trust, tel } from "@/components/r3";
import { Icon } from "@/components/ui";
import { LeasingExperiencePage } from "@/components/leasing-experience/experience-page";
import { availabilityLabel, availabilityOf, formatAreaRange, formatDate, isDemoField, spaceArea, spaceStatusLine, leasingExperienceFor, nextProject, propertyOccupancy, spacesFor, type ProjectEntry } from "@/content/source";
import { assetProfiles, company, contactLinks, creangaProfile, occupancyOf, tenantFit, type Requirement } from "@/data/demo-content";
import type { AvailableSpace } from "@/data/leasing-inventory";
import type { AssetSlug } from "@/lib/assets";
import { operations } from "@/lib/business";
import { needs as needCopy } from "@/lib/leasing";
import { leasingOnRequest, viewingPropertyHref, waitlistHref, waitlistLabel } from "@/lib/portfolio";
import { cadastreNumbers, eCadastruPortal } from "@/data/property-trust";
import { registeredData } from "@/data/registered";
import { EconomicsTool } from "@/components/leasing-experience/economics-tool";
import { economicsExample, sensitivityRates } from "@/data/tenant-intelligence";
import { uses as useCopy } from "@/lib/leasing";
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
  // the date never breaks inside («с 1 / января» left a hanging «с 1» — RU typesetting §5)
  upcoming: (unit: string, date: string, locale: SiteLocale) => {
    const d = date.replace(/ /g, NB);
    return locale === "ru" ? `${unit}${NB}— с${NB}${d}.` : locale === "ro" ? `${unit} — din ${d}.` : `${unit} — from ${d}.`;
  },
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
  // R3.3.1 / «LEASING OBJECTS · MOSCOVA 20 STANDARD» — one decision system: 01 property · 02 space · 03 location · 04 technical
  part1: { ro: "01 · Obiectul", ru: "01 · Объект", en: "01 · The property" },
  part2: { ro: "02 · Spațiul", ru: "02 · Пространство", en: "02 · The space" },
  part4: { ro: "04 · Tehnică și decizie", ru: "04 · Техника и решение", en: "04 · Technical and decision" },
  status: { ro: "Statut", ru: "Статус", en: "Status" },
  registered: { ro: "Suprafață înregistrată", ru: "Зарегистрированная площадь", en: "Registered area" },
  registeredNote: { ro: "Suprafața spațiilor înregistrate (date cadastrale / fiscale) — nu este suprafața disponibilă pentru închiriere.", ru: `Площадь зарегистрированных помещений (кадастр / налоговый учёт)${NB}— это не${NB}свободная площадь для аренды.`, en: "The area of the registered premises (cadastral / tax records) — not the area available for lease." },
  leasable: { ro: "Suprafață disponibilă", ru: "Свободная площадь", en: "Available area" },
  onRequestShort: { ro: "la cerere", ru: "по запросу", en: "on request" },
  noneFree: { ro: "nu există — ocupat 100 %", ru: `нет${NB}— занято на${NB}100${NB}%`, en: "none — 100% occupied" },
  cadastral: { ro: "Număr cadastral", ru: "Кадастровый номер", en: "Cadastral number" },
  cadastralMany: (n: number, locale: SiteLocale) => (locale === "ru" ? `${n}${NB}зарегистрированных помещений${NB}— список в${NB}разделе 02` : locale === "ro" ? `${n} spații înregistrate — lista în secțiunea 02` : `${n} registered premises — listed in section 02`),
  cadastralLater: { ro: "se publică după verificarea formatului", ru: "публикуем после проверки формата", en: "published once the format is verified" },
  ownedBy: { ro: "Proprietar și administrator", ru: "Собственник и управление", en: "Owner and operator" },
  ownedValue: { ro: "MEGAPARC", ru: "MEGAPARC", en: "MEGAPARC" },
  premisesTitle: { ro: "Spațiile înregistrate", ru: "Зарегистрированные помещения", en: "Registered premises" },
  total: { ro: "Total", ru: "Итого", en: "Total" },
  verifyPortal: { ro: "Verificați numerele în e‑Cadastru ↗", ru: "Проверить номера в e‑Cadastru ↗", en: "Verify the numbers in e‑Cadastru ↗" },
  planTitle: { ro: "Plan / amenajare", ru: "План / планировка", en: "Plan / layout" },
  planOnRequest: { ro: "Disponibil la cerere", ru: "Предоставляется по запросу", en: "Available on request" },
  planText: { ro: "Planul se pregătește pentru vizionare și pentru verificarea tehnică a formatului dumneavoastră — nu publicăm o schemă neconfirmată.", ru: `План подготовим к${NB}просмотру и${NB}технической проверке вашего формата${NB}— неподтверждённую схему не${NB}публикуем.`, en: "We prepare the plan for the viewing and the technical check of your format — an unconfirmed scheme is not published." },
  planCta: { ro: "Solicitați planul", ru: "Запросить план", en: "Request the plan" },
  formats: { ro: "Formate potrivite", ru: "Подходящие форматы", en: "Suitable formats" },
  requestTitle: { ro: "Suprafața și termenul — la cerere", ru: `Площадь и${NB}сроки${NB}— по${NB}запросу`, en: "Area and timing on request" },
  requestText: { ro: "Clădirea se închiriază; suprafața și termenul exact se confirmă individual, după o vizionare.", ru: `Здание сдаётся в${NB}аренду; точную площадь и${NB}сроки подтверждаем индивидуально, после просмотра.`, en: "The building is for lease; the exact area and timing are confirmed individually, after a viewing." },
  fullTitle: { ro: "Nu sunt spații libere acum", ru: `Свободных помещений сейчас нет`, en: "No space is free right now" },
  fullText: { ro: "Clădirea este închiriată integral. Lăsați o cerere — vă anunțăm când se eliberează un spațiu.", ru: `Здание занято полностью. Оставьте заявку${NB}— сообщим, когда освободится помещение.`, en: "The building is fully let. Leave a request — we tell you when a space frees up." },
  techCta: { ro: "Discutați cerințele tehnice", ru: "Обсудить технические требования", en: "Discuss technical requirements" },
  futureCta: { ro: "Discutați disponibilitatea viitoare", ru: "Обсудить будущую доступность", en: "Discuss future availability" },
  scenarioLabel: { ro: "Scenariul chiriașului", ru: "Сценарий арендатора", en: "Tenant scenario" },
  scenarioTitle: { ro: "Câți clienți pe zi îi trebuie afacerii dumneavoastră?", ru: `Сколько клиентов в${NB}день нужно вашему бизнесу?`, en: "How many customers a day does your business need?" },
  scenarioNote: { ro: "Scenariul chiriașului — un calcul invers pe datele dumneavoastră, nu o caracteristică a obiectului și nu o prognoză.", ru: `Сценарий арендатора${NB}— обратный расчёт на${NB}ваших данных, а${NB}не${NB}характеристика объекта и${NB}не${NB}прогноз.`, en: "Tenant scenario — a reverse calculation on your own figures, not a property fact and not a forecast." },
  locationCreanga: { ro: "Obiect comercial în funcțiune pe strada Ion Creangă din Chișinău. Pe hartă — stațiile de transport public din apropiere (OpenStreetMap).", ru: `Действующий коммерческий объект на${NB}улице Иона Крянгэ в${NB}Кишинёве. На${NB}карте${NB}— ближайшие остановки общественного транспорта (OpenStreetMap).`, en: "An operating commercial property on Ion Creangă Street in Chișinău. The map shows the nearby public transport stops (OpenStreetMap)." },
  // R3.3 §4 — the Moscova 20 decision logic on every property: what is confirmed, what we check together
  decideTitle: { ro: "Ce este confirmat — și ce verificăm împreună.", ru: `Что подтверждено${NB}— и${NB}что проверим вместе.`, en: "What is confirmed — and what we check together." },
  confirmedLabel: { ro: "Confirmat", ru: "Подтверждено", en: "Confirmed" },
  checkLabel: { ro: "Verificăm împreună, înainte de contract", ru: `Проверим вместе до${NB}договора`, en: "We check together before the lease" },
  checkArea: { ro: "Suprafața exactă a spațiului", ru: "Точная площадь помещения", en: "The exact area of the space" },
  checkTerms: { ro: "Suprafața oferită și termenul de disponibilitate", ru: "Предлагаемая площадь и срок доступности", en: "The area offered and the availability date" },
  checkCadastre: { ro: "Numărul cadastral — la cerere, pentru verificarea în e‑Cadastru", ru: `Кадастровый номер${NB}— по${NB}запросу, для проверки в${NB}e‑Cadastru`, en: "The cadastral number — on request, for verification in e‑Cadastru" },
  checkNote: { ro: "Directorul tehnic și arhitectul MEGAPARC evaluează aceste puncte pentru formatul dumneavoastră.", ru: `Технический директор и${NB}архитектор MEGAPARC оценят эти пункты под${NB}ваш формат.`, en: "MEGAPARC's Technical Director and Architect assess these points for your format." },
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
  /** R3.3: a leasing building without a confirmed offer — «for lease · area and timing on request» (Dacia 31) */
  const onRequest = !units.length && !fullyLet ? leasingOnRequest[slug] ?? null : null;
  const mode: "lease" | "upcoming" | "full" | "request" | "plain" = fullyLet ? "full" : upcoming ? "upcoming" : units.length ? "lease" : onRequest ? "request" : "plain";
  /** A district is shown only when confirmed (Creangă 78's district is not yet). */
  const district = isCreanga && creangaProfile.district.status === "DEMO" ? null : project.district[locale];
  const placeLine = [asset.city[locale], district].filter(Boolean).join(" · ");
  const narrative = isCreanga ? creangaProfile.narrative.value[locale] : asset.narrative[locale];
  const lead = isCreanga ? creangaProfile.lead.value[locale] : fullyLet ? storyLine[slug][locale] : asset.lead[locale];
  const story = isCreanga ? [] : asset.story[locale].filter((_, index) => !(fullyLet && index === 0 && slug === "moscova-9"));
  const caps = fit.capabilities;
  const confirmedCap = (key: Requirement) => (caps && caps[key].status !== "DEMO" && !(fullyLet && offerKeys.includes(key)) ? caps[key] : null);
  const access = accessKeys.map((key) => ({ key, cap: confirmedCap(key) })).filter((row) => row.cap);
  // the total area and the format are already shown from the profile — never twice (R3.2 review: Dacia 31 listed «Формат» twice)
  const keyFacts = asset.keyFacts.filter((fact) => !/^(Общая площадь|Total|Suprafața totală)/.test(fact.label[locale]) && fact.label[locale] !== copy.format[locale]);
  const first = units[0] ?? null;
  const firstDate = first && availabilityOf(first).date ? formatDate(availabilityOf(first).date!, locale) : null;
  const viewingAction = first ? (mode === "upcoming" ? copy.early[locale] : copy.viewing[locale]) : onRequest ? copy.viewing[locale] : null;
  const viewHref = first ? viewingHref(locale, first) : viewingPropertyHref(locale, slug);
  const statusLine = first ? spaceStatusLine(first, locale) : fullyLet ? `${copy.proofLabel[locale]} · 100${NB}% ${copy.occupied[locale]}` : onRequest ? onRequest[locale] : project.card.status[locale];

  const hero = slug === "dacia-31" ? "bleed" : isCreanga ? "contained" : "stacked";
  /** registered premises from the OWNER records (R3.3.1) — registered area, never the available area */
  const registered = registeredData[slug] ?? null;
  /** suitable formats: the unit's confirmed uses, or the building's own proposition (Dacia 31: one company's office) */
  const formats: string[] = first && first.confirmed.includes("uses") ? first.uses.map((key) => useCopy.find((u) => u.key === key)?.label[locale]).filter((v): v is string => Boolean(v)) : onRequest && project.editorial ? [project.editorial.headline[locale].replace(/\.$/, "")] : [];
  /** What a tenant still needs before a lease — unconfirmed topics as checks, never as values (R3.3 §4). */
  const checks: string[] = mode === "full" ? [] : [
    ...accessKeys.filter((key) => !confirmedCap(key)).map((key) => needCopy[key].label[locale]),
    ...(first && isDemoField(first, "area") ? [copy.checkArea[locale]] : []),
    ...(onRequest ? [copy.checkTerms[locale]] : []),
    ...(cadastreNumbers[slug] ? [] : [copy.checkCadastre[locale]]),
  ];

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
                {viewingAction ? <R3Button href={viewHref} tone="light">{viewingAction}</R3Button> : null}
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
            <p className={`r3-state r331-phero__status is-${mode === "full" ? "full" : "soon"}`}>{statusLine}</p>
            <div className="r3-actions r331-phero__acts">
              {viewingAction ? <R3Button href={viewHref}>{viewingAction}</R3Button> : fullyLet ? <R3Button href={waitlistHref(locale, slug)}>{waitlistLabel[locale]}</R3Button> : null}
              {mode === "upcoming" ? <a className="r3-link r3-link--dark" href={contactLinks.email}><span>{copy.techCta[locale]}</span><Icon size={16} /></a> : fullyLet ? <Link className="r3-link r3-link--dark" href={`${p("/contact")}?subject=lease&property=${slug}#occupier`}><span>{copy.futureCta[locale]}</span><Icon size={16} /></Link> : null}
            </div>
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
              {/* the hero already says «Запланируйте следующую локацию заранее.» — the scene names the unit and the date once */}
              <h2 className="r3-upcoming__title">{copy.upcoming(first.unit[locale], firstDate, locale)}</h2>
              {spaceArea(first, locale) ? <p className="r3-upcoming__area"><Figure value={spaceArea(first, locale)!} /></p> : null}
              <p className="r3-lead">{first.headline[locale]}</p>
              <div className="r3-actions">
                <R3Button href={viewingHref(locale, first)} tone="light">{copy.early[locale]}</R3Button>
                <a className="r3-link r3-link--light" href={contactLinks.mobile}><span>{copy.discussEarly[locale]} · {tel(company.mobile.value[locale])}</span><Icon size={16} /></a>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {/* THE PROPERTY — what the building is */}
      <section className="r3-sec r3-sec--ivory r3-pid">
        <div className="r3-shell r3-pid__grid">
          <div data-reveal>
            <R3Label>{copy.part1[locale]}</R3Label>
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
              <div><dt>{copy.status[locale]}</dt><dd>{statusLine}</dd></div>
              {registered ? <div><dt>{copy.registered[locale]}</dt><dd>{formatAreaRange(undefined, registered.area, locale)}</dd></div> : null}
              <div><dt>{copy.leasable[locale]}</dt><dd>{first && spaceArea(first, locale) ? spaceArea(first, locale) : fullyLet ? copy.noneFree[locale] : copy.onRequestShort[locale]}</dd></div>
              <div><dt>{copy.cadastral[locale]}</dt><dd>{cadastreNumbers[slug] ?? (registered && registered.premises.length > 1 ? copy.cadastralMany(registered.premises.length, locale) : copy.cadastralLater[locale])}</dd></div>
              <div><dt>{copy.ownedBy[locale]}</dt><dd>{copy.ownedValue[locale]}</dd></div>
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

      {/* 02 · SPACE — the offer (or its honest absence), the plan / layout block, the registered premises; never an empty column */}
      <section className="r3-sec r3-sec--paper r3-units r331-space" id="available">
        <div className="r3-shell">
          <R3Label>{copy.part2[locale]}</R3Label>
          <div className="r331-space__grid">
            <article className="r3-unit r331-space__offer" data-reveal>
              <div className="r3-unit__copy">
                {first ? (
                  <>
                    <h2 className="r3-unit__name">{first.unit[locale]}</h2>
                    {spaceArea(first, locale) ? <p className="r3-unit__area"><Figure value={spaceArea(first, locale)!} /></p> : null}
                    <p className={`r3-state is-${availabilityOf(first).key === "now" ? "now" : "soon"}`}>{availabilityLabel(first, locale)}</p>
                    <p className="r3-unit__floor">{first.floorLabel[locale]}</p>
                    {first.confirmed.includes("highlights") && first.highlights.length ? <ul className="r3-ticks">{first.highlights.map((point) => <li key={point.en}>{point[locale]}</li>)}</ul> : null}
                  </>
                ) : onRequest ? (
                  <>
                    <h2 className="r3-unit__name">{copy.requestTitle[locale]}</h2>
                    <p className="r3-state is-soon">{onRequest[locale]}</p>
                    <p className="r3-unit__floor">{copy.requestText[locale]}</p>
                  </>
                ) : (
                  <>
                    <h2 className="r3-unit__name">{copy.fullTitle[locale]}</h2>
                    <p className="r3-state is-full">{statusLine}</p>
                    <p className="r3-unit__floor">{copy.fullText[locale]}</p>
                  </>
                )}
                {formats.length ? <p className="r331-formats"><span>{copy.formats[locale]}</span> {formats.join(" · ")}</p> : null}
                <div className="r3-actions">
                  {viewingAction ? <R3Button href={viewHref}>{viewingAction}</R3Button> : fullyLet ? <R3Button href={waitlistHref(locale, slug)}>{waitlistLabel[locale]}</R3Button> : null}
                  {first ? <R3Link href={p(`/leasing/${first.id}`)}>{copy.unitOpen[locale]}</R3Link> : null}
                </div>
              </div>
            </article>
            {first && !isDemoField(first, "plan") ? (
              <div data-reveal><UnitBlocks unit={first} locale={locale} name={asset.name} /></div>
            ) : (
              <div className="r331-plan" data-reveal>
                <p className="r331-plan__title">{copy.planTitle[locale]}</p>
                <p className="r331-plan__status">{copy.planOnRequest[locale]}</p>
                <p className="r331-plan__text">{copy.planText[locale]}</p>
                <a className="r3-link r3-link--dark" href={contactLinks.email}><span>{copy.planCta[locale]}</span><Icon size={16} /></a>
              </div>
            )}
          </div>
          {registered ? (
            <div className="r331-reg" data-reveal>
              <p className="r33-decide__label">{copy.premisesTitle[locale]}</p>
              {registered.premises.length > 1 ? (
                <ol className="r331-reg__list">
                  {registered.premises.map((premise) => (
                    <li key={premise.cadastral}><span className="r331-reg__no">{premise.cadastral}</span><Figure value={formatAreaRange(undefined, premise.area, locale)} /></li>
                  ))}
                </ol>
              ) : null}
              <p className="r331-reg__total"><span>{registered.premises.length > 1 ? copy.total[locale] : registered.premises.length === 1 ? `${copy.cadastral[locale]} ${registered.premises[0].cadastral}` : copy.registered[locale]}</span><Figure value={formatAreaRange(undefined, registered.area, locale)} /></p>
              <p className="r3-note">{copy.registeredNote[locale]}</p>
              {registered.premises.length > 1 ? <a className="r3-link r3-link--dark" href={eCadastruPortal} target="_blank" rel="noopener noreferrer"><span>{copy.verifyPortal[locale]}</span></a> : null}
            </div>
          ) : null}
          {asset.caveat ? <p className="r3-note r3-units__caveat">{asset.caveat[locale]}</p> : null}
        </div>
      </section>

      {/* TENANT SCENARIO — a retail first floor (Moscova 9): the reverse calculation, labelled; never a property fact */}
      {first && first.uses.includes("retail") ? (
        <section className="r3-sec r3-sec--ivory r331-scenario">
          <div className="r3-shell">
            <div className="r3-head r3-head--split" data-reveal>
              <R3Label>{copy.scenarioLabel[locale]}</R3Label>
              <h2 className="r3-title">{copy.scenarioTitle[locale]}</h2>
              <p className="r3-lead">{copy.scenarioNote[locale]}</p>
            </div>
            <div className="lg-page r331-scenario__tool" data-reveal>
              <EconomicsTool locale={locale} property={asset.name} example={economicsExample} rates={sensitivityRates} traffic={null} visitLabel={viewingAction ?? undefined} />
            </div>
          </div>
        </section>
      ) : null}

      {/* DECISION PANEL (R3.3 §4, the Moscova 20 standard): what is confirmed · what we check together — no value is invented */}
      {access.length || checks.length ? (
        <section className="r3-sec r3-sec--ivory r3-caps r33-decide">
          <div className="r3-shell">
            <div className="r3-head r3-head--split" data-reveal>
              <R3Label>{copy.part4[locale]}</R3Label>
              <h2 className="r3-title">{checks.length ? copy.decideTitle[locale] : copy.accessTitle[locale]}</h2>
              {first && first.technical.power[locale] !== OMITTED && first.confirmed.includes("power") ? <p className="r3-lead">{first.technical.power[locale]}</p> : null}
            </div>
            <div className={`r33-decide__grid${checks.length ? "" : " r33-decide__grid--single"}`}>
              {access.length ? (
                <div data-reveal>
                  <p className="r33-decide__label">{copy.confirmedLabel[locale]}</p>
                  <dl className="r3-rows">
                    {access.map(({ key, cap }) => (
                      <div key={key}>
                        <dt>{needCopy[key].label[locale]}</dt>
                        <dd>{cap!.note[locale]}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              ) : null}
              {checks.length ? (
                <div className="r33-decide__checks" data-reveal>
                  <p className="r33-decide__label">{copy.checkLabel[locale]}</p>
                  <ul className="r33-decide__list">
                    {checks.map((check) => <li key={check}>{check}</li>)}
                  </ul>
                  <p className="r3-note">{copy.checkNote[locale]}</p>
                </div>
              ) : null}
            </div>
          </div>
        </section>
      ) : null}

      {/* LOCATION — the light editorial map */}
      <div className="r3-loc">
        <LocationSection locale={locale} no="03" mapKey={slug} name={asset.name} place={district ?? asset.city[locale]} area={district ? asset.city[locale] : ""} text={isCreanga ? copy.locationCreanga[locale] : asset.location[locale]} points={asset.connectivity} map={asset.map} />
      </div>

      {/* TRUST — technical feasibility first; e-Cadastru where the OWNER approved the number */}
      <R3Trust slug={slug} locale={locale} tone="stone" />

      {/* CLOSE — a viewing / early interest where a unit is offered; a fully let building has no leasing action */}
      <section className="r3-sec r3-sec--ivory r3-pclose" id="lg-form">
        <div className="r3-shell r3-pclose__grid">
          <div data-reveal>
            <R3Label>{asset.name}</R3Label>
            <h2 className="r3-title">{mode === "upcoming" ? copy.earlyTitle[locale] : first || onRequest ? copy.viewTitle[locale] : fullyLet ? copy.closeFull[locale] : copy.ask[locale]}</h2>
            {mode === "upcoming" ? <p className="r3-lead">{copy.earlyText[locale]}</p> : null}
            <div className="r3-actions">
              {viewingAction ? <R3Button href={viewHref}>{viewingAction}</R3Button> : fullyLet ? <R3Button href={waitlistHref(locale, slug)}>{waitlistLabel[locale]}</R3Button> : <R3Button href={`${p("/contact")}?subject=general&property=${slug}#question`}>{copy.ask[locale]}</R3Button>}
              {mode === "upcoming" ? <a className="r3-link r3-link--dark" href={contactLinks.email}><span>{copy.techCta[locale]}</span><Icon size={16} /></a> : fullyLet ? <Link className="r3-link r3-link--dark" href={`${p("/contact")}?subject=lease&property=${slug}#occupier`}><span>{copy.futureCta[locale]}</span><Icon size={16} /></Link> : null}
              {first || onRequest || fullyLet ? <a className="r3-link r3-link--dark" href={contactLinks.mobile}><span>{copy.call[locale]} · {tel(company.mobile.value[locale])}</span><Icon size={16} /></a> : null}
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

