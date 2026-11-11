import Link from "next/link";
import type { CSSProperties } from "react";
import { ConceptImage, DemoMark, Ledger, MaskTitle, Opening, Val, hasConceptImage } from "@/components/experience";
import { LocationSection } from "@/components/location-section";
import { PageShell } from "@/components/page-shell";
import { ProjectStatus } from "@/components/project-facts";
import { ArtImage } from "@/components/primitives";
import { Button, Icon, TextLink } from "@/components/ui";
import { nextProject, type ProjectEntry } from "@/content/source";
import { drochiaProfile, vatraProfile, type DataPoint } from "@/data/demo-content";
import { developmentStages } from "@/lib/business";
import { localePath, type Localized, type SiteLocale } from "@/lib/site-data";

/**
 * DEVELOPMENT / LAND PAGE (OWNER correction 2026-10-08): concept → site →
 * current status → development story → masterplan → current reality →
 * future vision → timeline → gallery → contact.
 * VATRA: real aerial photograph, programme figures DEMO, final architecture is
 * never shown before approval (masterplan frame awaits the approved scheme).
 * Drochia: own land, CONCEPT · UNDER EVALUATION, an illustrative zoning
 * diagram explicitly labelled "not an approved scheme".
 */
const copy = {
  back: { ro: "Proiecte", ru: "Проекты", en: "Projects" },
  conceptLabel: { ro: "Conceptul", ru: "Концепция", en: "Concept" },
  siteLabel: { ro: "Terenul", ru: "Участок", en: "The site" },
  statusLabel: { ro: "Stadiul actual", ru: "Текущий статус", en: "Current status" },
  statusTitle: { ro: "Unde se află acum proiectul.", ru: "Где сейчас проект.", en: "Where the project stands now." },
  storyLabel: { ro: "Povestea proiectului", ru: "История проекта", en: "Development story" },
  masterLabel: { ro: "Masterplan", ru: "Мастерплан", en: "Masterplan" },
  masterPending: { ro: "Publicăm masterplanul după aprobare.", ru: "Мастерплан опубликуем после утверждения.", en: "The masterplan will be published once approved." },
  realityLabel: { ro: "Realitatea de azi", ru: "Сейчас на площадке", en: "Current reality" },
  visionLabel: { ro: "Viziunea", ru: "Видение", en: "Future vision" },
  visionNote: { ro: "Viziune — nu arhitectură aprobată.", ru: "Видение — не утверждённая архитектура.", en: "A vision — not approved architecture." },
  timelineLabel: { ro: "Calendar", ru: "Таймлайн", en: "Timeline" },
  galleryLabel: { ro: "Galerie", ru: "Галерея", en: "Gallery" },
  site: { ro: "Teren", ru: "Участок", en: "Site" },
  programme: { ro: "Program", ru: "Программа", en: "Programme" },
  gba: { ro: "Suprafață construită", ru: "Площадь застройки", en: "Gross building area" },
  stage: { ro: "Etapa", ru: "Стадия", en: "Stage" },
  fronts: { ro: "Fronturi stradale", ru: "Фронты к дорогам", en: "Road fronts" },
  potential: { ro: "Potențial construit", ru: "Потенциал застройки", en: "Potential built area" },
  status: { ro: "Status", ru: "Статус", en: "Status" },
  now: { ro: "Acum", ru: "Сейчас", en: "Now" },
  started: { ro: "Începutul lucrărilor", ru: "Начало работ", en: "Works started" },
  completion: { ro: "Finalizare", ru: "Завершение", en: "Completion" },
  acquiredLand: { ro: "Terenul în proprietatea MEGAPARC", ru: "Земля в собственности MEGAPARC", en: "Land owned by MEGAPARC" },
  evaluation: { ro: "Evaluarea conceptelor", ru: "Оценка концепций", en: "Concept evaluation" },
  decision: { ro: "Decizie privind conceptul", ru: "Решение по концепции", en: "Concept decision" },
  team: { ro: "Pe șantier", ru: "На площадке", en: "On site" },
  teamText: { ro: "Calitatea se controlează pe șantier, nu în prezentări: echipa urmărește lucrările, bugetul și graficul în fiecare săptămână.", ru: "Качество проверяем на площадке, а не в презентациях: каждую неделю — работы, бюджет и график.", en: "Quality is controlled on site, not in presentations: the team follows works, budget and schedule every week." },
  closeTitle: { ro: "Discutăm proiectul — sau terenul dumneavoastră.", ru: "Обсудим проект — или ваш участок.", en: "Let's talk about the project — or your land." },
  discuss: { ro: "Discutăm o oportunitate", ru: "Обсудить возможность", en: "Discuss an opportunity" },
  land: { ro: "Propuneți un obiect sau un teren", ru: "Предложить объект или землю", en: "Offer a property or land" },
  next: { ro: "Următorul proiect", ru: "Следующий проект", en: "Next project" },
  planTitle: { ro: "Cum poate funcționa terenul.", ru: "Как может работать участок.", en: "How the site could work." },
  planLabel: { ro: "Schemă ilustrativă — neaprobată", ru: "Иллюстративная схема — не утверждена", en: "Illustrative scheme — not approved" },
  planRetail: { ro: "Comerț — față", ru: "Торговля — фронт", en: "Retail — front" },
  planLogistics: { ro: "Logistică — spate", ru: "Логистика — тыл", en: "Logistics — rear" },
  planRoad: { ro: "Drum de acces", ru: "Подъездная дорога", en: "Access road" },
  planEntry: { ro: "Intrarea în oraș", ru: "Въезд в город", en: "Town entrance" },
} satisfies Record<string, Localized>;

const vision: Record<string, Localized> = {
  vatra: {
    ro: "Un cartier de locuințe joase cu spații publice, gândit pentru o viață lungă și pentru o exploatare simplă. Clădirile rămân la MEGAPARC după finalizare sau intră în etapa următoare — prin decizia companiei.",
    ru: "Малоэтажный квартал с общественными пространствами, рассчитанный на долгую жизнь и простую эксплуатацию. После завершения здания остаются у MEGAPARC — или проект переходит на следующий этап.",
    en: "A low-rise neighbourhood with public spaces, designed for a long life and simple operation. Once complete, the buildings stay with MEGAPARC or move to the next stage — as the company decides.",
  },
  "drochia": {
    ro: "O poartă comercială și logistică pentru oraș și regiune: comerț în față, spre drum, logistică în spate, cu accese separate. Una din trei direcții va fi aleasă după verificări.",
    ru: "Торговые и логистические ворота города и региона: торговля спереди, к дороге, логистика сзади, с раздельными подъездами. Одно из трёх направлений будет выбрано после проверок.",
    en: "A retail and logistics site for the town and the region: retail at the front facing the road, logistics at the rear, with separate access. One of three directions will be chosen after review.",
  },
};

function SitePlan({ locale }: { locale: SiteLocale }) {
  return (
    <figure className="xp-plan" aria-label={copy.planLabel[locale]}>
      <span className="xp-plan__label">{copy.planLabel[locale]}</span>
      <svg viewBox="0 0 400 300" role="img" aria-hidden="true">
        <defs>
          <pattern id="drochia-hatch" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="8" stroke="currentColor" strokeOpacity=".18" strokeWidth="2" />
          </pattern>
        </defs>
        <path d="M0 236 L400 214" stroke="currentColor" strokeOpacity=".35" strokeWidth="14" fill="none" />
        <path d="M58 300 L92 0" stroke="currentColor" strokeOpacity=".22" strokeWidth="10" fill="none" />
        <polygon points="104,62 352,48 360,198 112,210" fill="url(#drochia-hatch)" stroke="currentColor" strokeWidth="1.5" />
        <polygon points="114,150 356,140 360,198 112,210" fill="#74202f" fillOpacity=".14" stroke="#74202f" strokeWidth="1.2" />
        <polygon points="106,68 350,56 354,120 110,128" fill="currentColor" fillOpacity=".07" stroke="currentColor" strokeOpacity=".5" strokeDasharray="4 4" />
        <text x="236" y="182" textAnchor="middle" fontSize="11" fill="#74202f" fontWeight="600">{copy.planRetail[locale].toUpperCase()}</text>
        <text x="230" y="96" textAnchor="middle" fontSize="11" fill="currentColor" fillOpacity=".7" fontWeight="600">{copy.planLogistics[locale].toUpperCase()}</text>
        <text x="300" y="246" textAnchor="middle" fontSize="10" fill="currentColor" fillOpacity=".6">{copy.planEntry[locale]} →</text>
        <text x="40" y="40" fontSize="10" fill="currentColor" fillOpacity=".6" transform="rotate(-83 40 40)">{copy.planRoad[locale]}</text>
        <text x="352" y="38" textAnchor="end" fontSize="10" fill="currentColor" fillOpacity=".6">2,0 ha</text>
      </svg>
    </figure>
  );
}

export function DevelopmentProjectPage({ locale, project }: { locale: SiteLocale; project: ProjectEntry }) {
  const dev = project.development!;
  const isVatra = project.slug === "vatra";
  const next = nextProject(project.slug);
  const p = (path: string) => localePath(locale, path);
  const timeline: { label: Localized; point?: DataPoint; value?: string; current?: boolean }[] = isVatra
    ? [
        { label: copy.started, point: vatraProfile.start },
        { label: copy.now, value: vatraProfile.stage.value[locale], current: true },
        { label: copy.completion, point: vatraProfile.completion },
      ]
    : [
        { label: copy.acquiredLand, value: drochiaProfile.site.value[locale] },
        { label: copy.evaluation, value: copy.now[locale], current: true },
        { label: copy.decision, point: drochiaProfile.decision },
      ];

  const steps = timeline.filter((step) => !step.point || step.point.status !== "DEMO");

  return (
    <PageShell locale={locale} variant="overlay" experience mainClassName="xp-project">
      {/* 01 CONCEPT — hero */}
      <section className="xp-hero xp-hero--page" data-xp-hero>
        <div className="xp-hero__media">
          <div className="xp-hero__frame is-active">
            {dev.media ? <ArtImage media={dev.media} alt={`${dev.name} — ${dev.status[locale]}`} priority position="50% 70%" /> : <ConceptImage id="project.drochia.hero" locale={locale} priority />}
          </div>
        </div>
        <div className="xp-hero__veil" aria-hidden="true" />
        <div className="xp-shell xp-hero__copy">
          <Link href={p("/projects")} className="back-link back-link--light"><Icon name="left" /> {copy.back[locale]}</Link>
          <span className="xp-flag xp-flag--light">{dev.status[locale]}{dev.media ? "" : ` · ${drochiaProfile.status.value[locale]}`}</span>
          <MaskTitle as="h1" className="xp-hero__title" lines={[dev.name]} />
          <p className="xp-hero__lead">{dev.lead[locale]}</p>
          <ProjectStatus project={project} locale={locale} tone="dark" />
        </div>
      </section>

      <section className="xp-sec xp-sec--warm">
        <div className="xp-shell xp-split xp-split--text">
          <div data-reveal>
            <p className="xp-eyebrow"><span className="xp-eyebrow__no">01</span><span>{copy.conceptLabel[locale]}</span></p>
            <h2 className="xp-split__title xp-split__title--gap">{dev.headline[locale]}</h2>
          </div>
          <div className="xp-prose" data-reveal>
            <p className="xp-lead">{dev.intro[locale]}</p>
            {dev.disclaimer ? <p className="xp-muted">{dev.disclaimer[locale]}</p> : null}
          </div>
        </div>
      </section>

      {/* 02 SITE */}
      {dev.location ? (
        <LocationSection locale={locale} no="02" mapKey={dev.map ? project.slug : undefined} name={dev.name} place={dev.place[locale]} area={dev.map ? dev.map.address : dev.place[locale]} text={dev.location[locale]} points={dev.connectivity} map={dev.map} fallback={dev.media ? <ArtImage media={dev.media} alt="" sizes="(min-width: 1024px) 50vw, 100vw" position="50% 62%" /> : undefined} />
      ) : null}
      <section className={`xp-sec${dev.location ? " xp-sec--warm xp-sec--flush-top" : ""}`}>
        <div className="xp-shell" data-reveal>
          {dev.location ? null : <p className="xp-eyebrow xp-eyebrow--gap"><span className="xp-eyebrow__no">02</span><span>{copy.siteLabel[locale]}</span></p>}
          <Ledger locale={locale} items={
            isVatra
              ? [
                  { label: copy.site[locale], point: vatraProfile.site },
                  { label: copy.programme[locale], point: vatraProfile.programme },
                  { label: copy.gba[locale], point: vatraProfile.gba },
                  { label: copy.stage[locale], point: vatraProfile.stage },
                ]
              : [
                  { label: copy.site[locale], point: drochiaProfile.site },
                  { label: copy.fronts[locale], point: drochiaProfile.fronts },
                  { label: copy.potential[locale], point: drochiaProfile.potential },
                  { label: copy.status[locale], point: drochiaProfile.status },
                ]
          } />
        </div>
      </section>

      {/* 03 CURRENT STATUS */}
      <section className="xp-sec">
        <div className="xp-shell">
          <Opening no="03" label={copy.statusLabel[locale]} title={copy.statusTitle[locale]} />
          <ol className="xp-process xp-process--stages" style={{ "--n": developmentStages.length } as CSSProperties} data-reveal>
            {developmentStages.map((stage, index) => (
              <li key={stage.no} className={index === dev.stage ? "is-current" : index < dev.stage ? "is-done" : undefined}>
                <h3>{stage.title[locale]}</h3>
                <p>{stage.text[locale]}</p>
                {index === dev.stage ? <span className="xp-scene__tag">{dev.name}</span> : null}
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 04 DEVELOPMENT STORY */}
      {dev.sections.map((block) => (
        <section key={block.title.en} className="xp-sec xp-sec--warm">
          <div className="xp-shell xp-split xp-split--text">
            <div data-reveal>
              <p className="xp-eyebrow"><span className="xp-eyebrow__no">04</span><span>{copy.storyLabel[locale]} · {block.title[locale]}</span></p>
              <h2 className="xp-split__title xp-split__title--gap">{block.text[locale]}</h2>
            </div>
            {block.items ? (
              <ol className="xp-numbered" data-reveal>
                {block.items.map((item) => {
                  const [head, ...rest] = item[locale].split(" — ");
                  return (
                    <li key={item.en}>
                      <h3>{head}</h3>
                      {rest.length ? <p>{rest.join(" — ")}</p> : null}
                    </li>
                  );
                })}
              </ol>
            ) : null}
          </div>
        </section>
      ))}

      {/* 05 MASTERPLAN — only once a scheme exists (VATRA's is published after approval) */}
      {isVatra ? null : (
        <section className="xp-sec">
          <div className="xp-shell xp-split xp-split--text">
            <div data-reveal>
              <p className="xp-eyebrow"><span className="xp-eyebrow__no">05</span><span>{copy.masterLabel[locale]}</span></p>
              <h2 className="xp-split__title xp-split__title--gap">{copy.planTitle[locale]}</h2>
            </div>
            <div data-reveal>
              <SitePlan locale={locale} />
            </div>
          </div>
        </section>
      )}

      {/* 05 CURRENT REALITY — VATRA's site in work (Drochia's site is told by the map above) */}
      {isVatra ? (
        <section className="xp-sec xp-sec--warm">
          <div className="xp-shell xp-split xp-split--wide">
            <figure className="xp-fig" style={{ "--ratio": "3 / 2" } as CSSProperties} data-reveal>
              <ArtImage media={dev.contextMedia ?? dev.media!} alt={`${dev.name} — ${dev.status[locale]}`} sizes="(min-width: 1024px) 60vw, 100vw" depth={10} position="50% 60%" />
            </figure>
            <div className="xp-split__copy" data-reveal>
              <p className="xp-eyebrow"><span className="xp-eyebrow__no">05</span><span>{copy.realityLabel[locale]}</span></p>
              <p className="xp-lead">{copy.teamText[locale]}</p>
              {/* production edition: no concept visual here (OWNER "PRODUCTION V1" §3) — the frame is not rendered */}
              {hasConceptImage("project.vatra.team") ? (
                <figure className="xp-fig pj-inset" style={{ "--ratio": "4 / 3" } as CSSProperties}>
                  <ConceptImage id="project.vatra.team" locale={locale} sizes="(min-width: 1024px) 30vw, 100vw" />
                </figure>
              ) : null}
            </div>
          </div>
        </section>
      ) : null}

      {/* 06 FUTURE VISION */}
      <section className="xp-sec xp-sec--ink">
        <div className="xp-shell xp-split xp-split--text">
          <div data-reveal>
            <p className="xp-eyebrow"><span className="xp-eyebrow__no">06</span><span>{copy.visionLabel[locale]}</span></p>
            <h2 className="xp-split__title xp-split__title--gap">{dev.statement[locale]}</h2>
          </div>
          <div className="xp-prose" data-reveal>
            <p className="xp-lead xp-lead--light">{vision[project.slug][locale]}{isVatra ? <DemoMark /> : null}</p>
            <p className="xp-muted">{copy.visionNote[locale]}</p>
          </div>
        </div>
      </section>

      {/* 07 TIMELINE — confirmed steps only (no invented start / completion dates) */}
      {steps.length >= 2 ? (
      <section className="xp-sec">
        <div className="xp-shell">
          <p className="xp-eyebrow xp-eyebrow--gap" data-reveal><span className="xp-eyebrow__no">07</span><span>{copy.timelineLabel[locale]}</span></p>
          <ol className="pj-timeline" data-reveal>
            {steps.map((step) => (
              <li key={step.label.en} className={step.current ? "is-current" : undefined}>
                <span className="pj-timeline__label">{step.label[locale]}</span>
                <span className="pj-timeline__value">{step.point ? <Val point={step.point} locale={locale} /> : step.value}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>
      ) : null}

      {/* 09 GALLERY — photo direction storyboard in the preview */}

      {/* 08 CONTACT */}
      <section className="xp-sec xp-sec--stone">
        <div className="xp-shell xp-close">
          <div data-reveal>
            <p className="xp-eyebrow"><span className="xp-eyebrow__no">08</span><span>{dev.name}</span></p>
            <h2 className="xp-close__title">{copy.closeTitle[locale]}</h2>
            <div className="xp-actions xp-actions--top">
              <Button href={`${p("/contact")}?subject=partnership#partnership`}>{copy.discuss[locale]}</Button>
              <TextLink href={p("/offer")}>{copy.land[locale]}</TextLink>
            </div>
          </div>
          <nav className="xp-close__routes" aria-label={copy.next[locale]} data-reveal>
            <Link href={p(`/projects/${next.slug}`)}>
              <span><small className="xp-label">{copy.next[locale]}</small><br />{next.name}</span>
              <Icon name="arrow" size={18} />
            </Link>
            <Link href={p("/projects")}>
              {copy.back[locale]}
              <Icon name="arrow" size={18} />
            </Link>
          </nav>
        </div>
      </section>
    </PageShell>
  );
}
