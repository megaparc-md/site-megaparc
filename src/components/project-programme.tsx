import Link from "next/link";
import { HeroFigures, Ledger, Opening } from "@/components/experience";
import { PageShell } from "@/components/page-shell";
import { ProjectFacts } from "@/components/project-facts";
import { Button, Icon, TextLink } from "@/components/ui";
import { getProject, kindLabel, nextProject, type ProjectEntry } from "@/content/source";
import { brand, localePath, type Localized, type SiteLocale } from "@/lib/site-data";

/**
 * PROGRAMME PAGE — a development record that has an OWNER-confirmed programme
 * and nothing else yet (OWNER 2026-10-09: Dacia 31 · Development, 3 buildings of
 * ≈ 1 600 m², ≈ 4 800 m² planned). Separate from the operating Dacia 31
 * building. No stage, timeline, CAPEX, use mix, permits, completion date,
 * imagery or architecture is shown until the OWNER supplies them.
 */
const copy = {
  back: { ro: "Proiecte", ru: "Проекты", en: "Projects" },
  buildings: { ro: "clădiri", ru: "здания", en: "buildings" },
  each: { ro: "fiecare clădire (planificat)", ru: "каждое здание (план)", en: "each building (planned)" },
  total: { ro: "suprafață planificată", ru: "планируемая площадь", en: "planned area" },
  knownLabel: { ro: "Ce este confirmat", ru: "Что подтверждено", en: "What is confirmed" },
  knownTitle: { ro: "Programul proiectului.", ru: "Программа проекта.", en: "The project's programme." },
  buildingsLabel: { ro: "Clădiri", ru: "Здания", en: "Buildings" },
  eachLabel: { ro: "Suprafață per clădire", ru: "Площадь каждого здания", en: "Area per building" },
  totalLabel: { ro: "Suprafață planificată", ru: "Планируемая площадь", en: "Planned area" },
  relatedLabel: { ro: "Clădirea existentă", ru: "Действующее здание", en: "The existing building" },
  relatedText: {
    ro: "Proiect separat de clădirea de birouri Dacia 31 aflată în exploatare.",
    ru: "Отдельный проект\u00a0— не\u00a0действующее офисное здание Dacia\u00a031.",
    en: "A separate project from the operating Dacia 31 office building.",
  },
  pending: {
    ro: "Etapa, calendarul, destinația și arhitectura le publicăm după aprobare.",
    ru: "Стадию, сроки, назначение и архитектуру опубликуем после утверждения.",
    en: "The stage, timeline, use and architecture will be published once approved.",
  },
  openRelated: { ro: "Vedeți clădirea Dacia 31", ru: "Смотреть здание Dacia\u00a031", en: "View the Dacia 31 building" },
  closeTitle: { ro: "Discutați proiectul — sau terenul dumneavoastră.", ru: "Обсудим проект — или ваш участок.", en: "Let's talk about the project — or your land." },
  discuss: { ro: "Discutați o oportunitate", ru: "Обсудить возможность", en: "Discuss an opportunity" },
  land: { ro: "Propuneți un imobil sau un teren", ru: "Предложить объект или землю", en: "Offer a property or land" },
  next: { ro: "Următorul proiect", ru: "Следующий проект", en: "Next project" },
} satisfies Record<string, Localized>;

export function ProgrammeProjectPage({ locale, project }: { locale: SiteLocale; project: ProjectEntry }) {
  const programme = project.programme!;
  const related = getProject(programme.related)!;
  const next = nextProject(project.slug);
  const p = (path: string) => localePath(locale, path);

  return (
    <PageShell locale={locale} experience mainClassName="xp-project">
      {/* HERO — statement + the confirmed programme as figures (no imagery until approved) */}
      <section className="xp-pagehero xp-sh">
        <div className="xp-shell xp-sh__grid">
          <p className="xp-eyebrow xp-sh__eyebrow" data-reveal>
            <Link href={p("/projects")} className="back-link"><Icon name="left" /> {copy.back[locale]}</Link>
            <span className="xp-eyebrow__no">{brand.name}</span><span>{kindLabel.development[locale]}</span>
          </p>
          <h1 className="xp-display-title xp-sh__title" data-reveal>{project.name}</h1>
          <p className="xp-pagehero__lead xp-sh__lead" data-reveal>{project.line[locale]}</p>
          <div className="xp-sh__aside" data-reveal>
            <HeroFigures className="xp-figures--caps pg-figures" items={[
              { value: programme.buildings.value[locale], label: copy.buildings[locale] },
              { value: programme.each.value[locale], label: copy.each[locale] },
              { value: programme.total.value[locale], label: copy.total[locale] },
            ]} />
          </div>
        </div>
      </section>

      {/* 01 WHAT IS CONFIRMED — and what is published later */}
      <section className="xp-sec xp-sec--warm">
        <div className="xp-shell">
          <Opening no="01" label={copy.knownLabel[locale]} title={copy.knownTitle[locale]} lead={copy.pending[locale]} className="xp-opening--split" />
          <div className="xp-split xp-split--text">
            <div data-reveal>
              <Ledger locale={locale} items={[
                { label: copy.buildingsLabel[locale], point: programme.buildings },
                { label: copy.eachLabel[locale], point: programme.each },
                { label: copy.totalLabel[locale], point: programme.total },
              ]} />
            </div>
            <div className="pg-related" data-reveal>
              <p className="xp-label">{copy.relatedLabel[locale]}</p>
              <p className="pg-related__name">{related.name}</p>
              <ProjectFacts project={related} locale={locale} />
              <p className="pg-related__text">{copy.relatedText[locale]}</p>
              <TextLink href={p(`/projects/${related.slug}`)}>{copy.openRelated[locale]}</TextLink>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section className="xp-sec xp-sec--stone">
        <div className="xp-shell xp-close">
          <div data-reveal>
            <p className="xp-eyebrow"><span className="xp-eyebrow__no">02</span><span>{project.name}</span></p>
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
