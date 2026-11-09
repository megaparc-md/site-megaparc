import Link from "next/link";
import { HeroDoors, HomePortals } from "@/components/home-portals";
import { ConceptDisclosure, ConceptImage, HeroFigures, Ledger, MaskTitle, hasConceptImage } from "@/components/experience";
import { SpaceImage, UnitCard, viewingHref } from "@/components/leasing/unit-card";
import { PageShell } from "@/components/page-shell";
import { ArtImage } from "@/components/primitives";
import { Button, Icon } from "@/components/ui";
import { formatAreaRange, getProject, listProjects, listVacancies, publicSpaces, sortSpaces } from "@/content/source";
import { caseStudyPublished, company, contactLinks, daciaDevelopment, drochiaProfile, portfolioFigures, vatraProfile } from "@/data/demo-content";
import { CareersMoment } from "@/components/careers-moment";
import { ProjectFacts, ProjectStatus } from "@/components/project-facts";
import { eras, historyCopy, teaserImage } from "@/lib/history";
import { isProductionEdition, localePath, publicAsset, type SiteLocale } from "@/lib/site-data";

/**
 * HOME — premium experience rebuild (OWNER brief "PREMIUM REAL ESTATE EXPERIENCE
 * REBUILD", 2026-10-09). The first screen sells MEGAPARC the brand: a concept
 * architectural photograph (registered DEMO · CONCEPT_VISUAL, never captioned
 * or presented as a MEGAPARC asset) under deliberate typography — the business
 * statement apart from the heritage proof, one primary action. Real MEGAPARC
 * property begins on the second screen, as proof.
 * Rhythm: cinematic hero → real property, full bleed → light editorial
 * (directions) → available space → dark development → history → investment
 * partnership → careers film → calm contact close.
 */
const N = " ";
const copy = {
  ro: {
    scroll: "Derulează",
    heroTitle: ["Imobiliare comerciale —", "de la investiție", "la obiectul care funcționează."],
    heroStatement: "MEGAPARC investește în imobiliare și terenuri, dezvoltă proiecte proprii și închiriază spații comerciale.",
    heritage: [["1991", "Începe istoria antreprenorială a grupului"], ["2005", "Este fondată MEGAPARC"]],
    ctaPartner: "Parteneriat investițional",
    ctaSpace: "Spații libere",
    ctaOffer: "Propuneți un obiect sau un teren",
    proofKicker: "Imobiliarele MEGAPARC",
    proofTitle: "Clădiri proprii în Chișinău.",
    proofLead: "Obiectele în funcțiune ale companiei: clădiri de birouri și comerciale cu o suprafață totală de",
    openProperty: "Vezi obiectul",
    projectsAll: "Toate proiectele",
    dirKicker: "Cum lucrăm",
    dirTitle: "Investim. Dezvoltăm. Închiriem.",
    dirLinks: { investment: "Parteneriat investițional", development: "Proiectele de dezvoltare", leasing: "Spații libere" },
    availableKicker: "Liber acum",
    availableTitle: "Spații libere în clădirile noastre.",
    availableAll: "Toate spațiile",
    viewing: "Solicită o vizionare",
    devKicker: "Dezvoltare",
    devTitle: "Construim proiecte proprii. Și cumpărăm teren pentru următoarele.",
    devText: "VATRA este un proiect propriu în realizare. La Dacia 31 planificăm trei clădiri de ≈ 1.600 m². Drochia Gateway este un teren propriu de 2,0 ha la intrarea în oraș, cu concept în evaluare.",
    devCta: "Proiectele de dezvoltare",
    stage: "Etapă",
    historyKicker: "Istoric",
    historyCta: "Citiți cronica",
    partnerKicker: "Parteneriat investițional",
    partnerTitle: "Experiență confirmată de obiecte.",
    partnerCta: "Discutăm o oportunitate",
    partnerCase: "Studiu de caz · Moscova 9",
    proof: { years: "ani de experiență a grupului", founded: "este fondată MEGAPARC", operating: "obiecte în funcțiune", area: "suprafața obiectelor în funcțiune", land: "terenuri" },
    closeKicker: "Contact",
    closeTitle: "Alegeți pasul următor.",
    closeRoutes: [["Solicită o vizionare", "/contact?subject=lease#occupier"], ["Discutăm o oportunitate", "/contact?subject=partnership#partnership"], ["Propuneți un obiect sau un teren", "/offer"], ["Vezi posturile", "/careers#positions"], ["Întrebare generală", "/contact#question"]],
  },
  ru: {
    scroll: "Листайте",
    heroTitle: [`Коммерческая недвижимость${N}—`, `от${N}инвестиции`, `до${N}работающего объекта.`],
    heroStatement: `MEGAPARC инвестирует в${N}недвижимость и${N}землю, развивает собственные проекты и${N}сдаёт коммерческие площади.`,
    heritage: [["1991", `Начало предпринимательской истории группы`], ["2005", "Основана MEGAPARC"]],
    ctaPartner: "Инвестиционное партнёрство",
    ctaSpace: "Свободные помещения",
    ctaOffer: `Предложить объект или${N}землю`,
    proofKicker: "Недвижимость MEGAPARC",
    proofTitle: `Собственные здания в${N}Кишинёве.`,
    proofLead: `Действующие объекты компании: офисные и${N}торговые здания общей площадью`,
    openProperty: "Смотреть объект",
    projectsAll: "Все проекты",
    dirKicker: "Как мы работаем",
    dirTitle: `Инвестируем. Развиваем. Сдаём в${N}аренду.`,
    dirLinks: { investment: "Инвестиционное партнёрство", development: "Проекты развития", leasing: "Свободные помещения" },
    availableKicker: "Свободно сейчас",
    availableTitle: `Свободные помещения в${N}наших зданиях.`,
    availableAll: "Все помещения",
    viewing: "Запросить просмотр",
    devKicker: "Развитие",
    devTitle: `Строим собственные проекты. И${N}покупаем землю для следующих.`,
    devText: `VATRA уже в${N}работе. На${N}Dacia${N}31 планируем три здания по${N}≈${N}1${N}600${N}м². Drochia Gateway${N}— наш участок 2,0${N}га на${N}въезде в${N}город; концепцию сейчас оцениваем.`,
    devCta: "Проекты развития",
    stage: "Стадия",
    historyKicker: "История",
    historyCta: "Читать хронику",
    partnerKicker: "Инвестиционное партнёрство",
    partnerTitle: "Опыт, подтверждённый объектами.",
    partnerCta: "Обсудить возможность",
    partnerCase: "Кейс · Moscova 9",
    proof: { years: "лет опыта группы", founded: "основана MEGAPARC", operating: "действующих объекта", area: "площадь действующих объектов", land: "земельные участки" },
    closeKicker: "Контакты",
    closeTitle: "Выберите следующий шаг.",
    closeRoutes: [["Запросить просмотр", "/contact?subject=lease#occupier"], ["Обсудить возможность", "/contact?subject=partnership#partnership"], [`Предложить объект или${N}землю`, "/offer"], ["Смотреть вакансии", "/careers#positions"], ["Общий вопрос", "/contact#question"]],
  },
  en: {
    scroll: "Scroll",
    heroTitle: ["Commercial real estate —", "from investment", "to a working property."],
    heroStatement: "MEGAPARC invests in real estate and land, develops its own projects and leases commercial space.",
    heritage: [["1991", "The group's entrepreneurial history begins"], ["2005", "MEGAPARC is founded"]],
    ctaPartner: "Investment partnership",
    ctaSpace: "Available spaces",
    ctaOffer: "Offer a property or land",
    proofKicker: "MEGAPARC real estate",
    proofTitle: "Our own buildings in Chișinău.",
    proofLead: "The company's operating properties: office and retail buildings with a total area of",
    openProperty: "View the property",
    projectsAll: "All projects",
    dirKicker: "How we work",
    dirTitle: "We invest. We develop. We lease.",
    dirLinks: { investment: "Investment partnership", development: "Development projects", leasing: "Available spaces" },
    availableKicker: "Available now",
    availableTitle: "Free space in our buildings.",
    availableAll: "All spaces",
    viewing: "Request a viewing",
    devKicker: "Development",
    devTitle: "We build our own projects. And buy land for the next ones.",
    devText: "VATRA is our own project in delivery. At Dacia 31 we are planning three buildings of ≈ 1,600 m². Drochia Gateway is our own 2.0 ha site at the town entrance, with a concept under evaluation.",
    devCta: "Development projects",
    stage: "Stage",
    historyKicker: "History",
    historyCta: "Read the chronicle",
    partnerKicker: "Investment partnership",
    partnerTitle: "Experience proven by property.",
    partnerCta: "Discuss an opportunity",
    partnerCase: "Case study · Moscova 9",
    proof: { years: "years of the group's experience", founded: "MEGAPARC founded", operating: "operating properties", area: "operating property area", land: "land plots" },
    closeKicker: "Contact",
    closeTitle: "Choose the next step.",
    closeRoutes: [["Request a viewing", "/contact?subject=lease#occupier"], ["Discuss an opportunity", "/contact?subject=partnership#partnership"], ["Offer a property or land", "/offer"], ["See vacancies", "/careers#positions"], ["General question", "/contact#question"]],
  },
} as const;

const ribbon = ["1991", "1995", "2005", "2020"];
const groupYears = Math.floor((2026 - 1991) / 5) * 5;

export function HomePage({ locale }: { locale: SiteLocale }) {
  const c = copy[locale];
  const p = (path: string) => localePath(locale, path);
  const href = (value: string) => {
    const [pathQuery, hash] = value.split("#");
    const [path, query] = pathQuery.split("?");
    return `${p(path)}${query ? `?${query}` : ""}${hash ? `#${hash}` : ""}`;
  };
  const spaces = sortSpaces(publicSpaces);
  const projects = listProjects();
  const feature = getProject("dacia-31")!;
  const stories = ["moscova-9", "creanga-78"].map((slug) => getProject(slug)!);
  const vatra = getProject("vatra")!;
  const drochia = getProject("drochia-gateway")!;
  const daciaDev = getProject("dacia-31-development")!;
  const vacancies = listVacancies();
  const single = spaces.length === 1 ? spaces[0] : null;
  const singleProject = single ? getProject(single.project)! : null;

  return (
    <PageShell locale={locale} variant="overlay" experience>
      {/* 1 HERO — the brand: concept architecture, deliberate typography, one primary action */}
      <section className="pm-hero" id="home" data-xp-hero>
        <div className="pm-hero__media" aria-hidden="true">
          <ConceptImage id="home.hero" locale={locale} priority sizes="100vw" />
        </div>
        <div className="pm-hero__veil" aria-hidden="true" />
        <ConceptDisclosure id="home.hero" locale={locale} />
        <div className="xp-shell pm-hero__inner">
          <MaskTitle as="h1" className="pm-hero__title" lines={[...c.heroTitle]} />
          {/* the statement, then the two MEGAPARC directions on the first screen (OWNER overnight release §2 / §3) */}
          <p className="pm-hero__statement hm2-hero__statement">{c.heroStatement}</p>
          <HeroDoors locale={locale} />
        </div>
        <a className="pm-hero__cue" href="#directions">{c.scroll}<Icon name="down" /></a>
      </section>

      {/* 2 TWO ENGINES — investment & partnership · leasing of MEGAPARC's own property, at photographic scale */}
      <HomePortals locale={locale} />

      {/* 3 REAL MEGAPARC — proof: one dominant building full bleed, two supporting stories */}
      <section className="pm-proof" id="proof">
        <div className="xp-shell pm-head" data-reveal>
          <p className="pm-kicker">{c.proofKicker}</p>
          <h2 className="pm-h2">{c.proofTitle}</h2>
          <p className="pm-head__lead">{c.proofLead} {portfolioFigures.area.value[locale]}.</p>
        </div>
        <Link href={p(`/projects/${feature.slug}`)} className="pm-feature al-reveal" data-reveal>
          <figure className="pm-feature__media">
            <ArtImage media={feature.media!} variant="wide" alt={`${feature.name} — ${feature.format[locale]}`} sizes="100vw" position="50% 50%" />
          </figure>
          <span className="xp-shell pm-feature__caption">
            <span className="pm-feature__name">{feature.name}</span>
            <ProjectFacts project={feature} locale={locale} className="pj-facts--light" />
            {feature.editorial ? <span className="pm-feature__line">{feature.editorial.headline[locale]}</span> : null}
            <span className="pm-more pm-more--light">{c.openProperty}<Icon /></span>
          </span>
        </Link>
        <div className="xp-shell pm-stories">
          {stories.map((project, index) => (
            <Link key={project.slug} href={p(`/projects/${project.slug}`)} className={`pm-story pm-story--${index === 0 ? "major" : "minor"}`} data-reveal>
              <figure className="pm-story__media al-hover">
                <ArtImage media={project.media!} variant="card" alt={`${project.name} — ${project.format[locale]}`} sizes={index === 0 ? "(min-width: 1024px) 58vw, 100vw" : "(min-width: 1024px) 36vw, 100vw"} />
              </figure>
              <span className="pm-story__name">{project.name}</span>
              <ProjectFacts project={project} locale={locale} />
              <span className="pm-story__line">{project.line[locale]}</span>
              <ProjectStatus project={project} locale={locale} as="span" />
              <span className="pm-more">{c.openProperty}<Icon /></span>
            </Link>
          ))}
        </div>
        <div className="xp-shell pm-proof__foot" data-reveal>
          <Link className="pm-link" href={p("/projects")}>{c.projectsAll} · {String(projects.length).padStart(2, "0")}<Icon /></Link>
        </div>
      </section>

      {/* 4 AVAILABLE SPACE — the commercial offer, as a place */}
      {spaces.length ? (
        <section className="pm-sec pm-sec--warm" id="available">
          <div className="xp-shell">
            {single && singleProject ? (
              <div className="pm-offer" data-reveal>
                <figure className="pm-offer__media al-reveal">
                  <SpaceImage photo={single.photos[0]} space={single} locale={locale} sizes="(min-width: 1024px) 60vw, 100vw" />
                </figure>
                <div className="pm-offer__copy">
                  <p className="pm-kicker">{c.availableKicker}</p>
                  <h2 className="pm-h2">{single.unit[locale]}</h2>
                  <p className="pm-offer__meta">{singleProject.name} · {singleProject.district[locale]} · {formatAreaRange(single.areaMin, single.area, locale)}</p>
                  <p className="pm-offer__line">{single.headline[locale]}</p>
                  <div className="pm-actions pm-actions--dark">
                    <Button href={viewingHref(locale, single)}>{c.viewing}</Button>
                    <Link className="pm-link" href={`${p("/leasing")}#available`}>{c.availableAll}<Icon /></Link>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className="pm-head pm-head--split" data-reveal>
                  <p className="pm-kicker">{c.availableKicker}</p>
                  <h2 className="pm-h2">{c.availableTitle}</h2>
                </div>
                <div className="lx-rail lx-rail--home">
                  {spaces.slice(0, 4).map((space, i) => (
                    <UnitCard key={space.id} space={space} locale={locale} compact priority={i === 0} />
                  ))}
                </div>
                <div className="pm-proof__foot" data-reveal>
                  <Link className="pm-link" href={`${p("/leasing")}#available`}>{c.availableAll}<Icon /></Link>
                </div>
              </>
            )}
          </div>
        </section>
      ) : null}

      {/* 5 DEVELOPMENT — the dark signature moment */}
      <section className="pm-sec pm-sec--ink" id="development">
        <div className="xp-shell">
          <div className="pm-head pm-head--split pm-head--dark" data-reveal>
            <p className="pm-kicker">{c.devKicker}</p>
            <h2 className="pm-h2">{c.devTitle}</h2>
            <p className="pm-head__lead">{c.devText}</p>
          </div>
          <div className="pm-dev">
            <Link href={p(`/projects/${vatra.slug}`)} className="pm-dev__main al-reveal" data-reveal>
              <figure className="pm-dev__media">
                <ArtImage media={vatra.media!} variant="wide" alt={`${vatra.name} — ${vatra.format[locale]}`} sizes="(min-width: 1024px) 66vw, 100vw" />
              </figure>
              <span className="pm-dev__name">{vatra.name}</span>
              <Ledger locale={locale} tone="dark" className="xp-ledger--pair" items={[
                { label: c.stage, point: vatraProfile.stage },
              ]} />
            </Link>
            <div className="pm-dev__side" data-reveal>
              <Link href={p(`/projects/${daciaDev.slug}`)} className="pm-dev__item">
                <span className="pm-dev__kind">{daciaDev.card.status[locale]}</span>
                <span className="pm-dev__title">{daciaDev.name}</span>
                <span className="pm-dev__value">{daciaDevelopment.buildings.value[locale]} × {daciaDevelopment.each.value[locale]} · {daciaDevelopment.total.value[locale]}</span>
              </Link>
              <Link href={p(`/projects/${drochia.slug}`)} className="pm-dev__item">
                <span className="pm-dev__kind">{drochia.card.status[locale]}</span>
                <span className="pm-dev__title">{drochia.name}</span>
                <span className="pm-dev__value">{drochiaProfile.site.value[locale]} · {drochiaProfile.status.value[locale]}</span>
              </Link>
              <Link className="pm-link pm-link--light" href={`${p("/projects")}#development`}>{c.devCta}<Icon /></Link>
            </div>
          </div>
        </div>
      </section>

      {/* 6 HISTORY — archive */}
      <section className="hs-teaser pm-history" id="history">
        <div className="xp-shell hs-teaser__grid">
          <div className="hs-teaser__copy" data-reveal>
            <p className="pm-kicker">{c.historyKicker}</p>
            <h2 className="hs-teaser__title">{historyCopy.title[locale].join(" ")}</h2>
            <p className="hs-teaser__lead">{historyCopy.lead[locale]}</p>
            <ol className="hs-teaser__ribbon" aria-label={c.historyKicker}>
              {ribbon.map((year) => {
                const era = eras.find((item) => item.range.startsWith(year)) ?? eras.find((item) => item.range === year)!;
                return (
                  <li key={year} className={era.scope === "megaparc" ? "is-megaparc" : undefined}>
                    <span>{year}</span>
                    <small>{era.label[locale]}</small>
                  </li>
                );
              })}
            </ol>
            <Link className="pm-link" href={p("/history")}>{c.historyCta}<Icon /></Link>
          </div>
          {/* production edition: the period photograph is a placeholder for the group archive — not published */}
          {teaserImage.home ? (
            <figure className="hs-teaser__figure al-reveal" data-reveal>
              <picture>
                <source media="(min-width: 721px)" srcSet={publicAsset(`/assets/history/${teaserImage.home}.webp`)} />
                <img src={publicAsset(`/assets/history/${teaserImage.home}-mobile.webp`)} alt="" loading="lazy" decoding="async" />
              </picture>
            </figure>
          ) : null}
        </div>
      </section>

      {/* 7 INVESTMENT PARTNERSHIP — figures over a full-bleed scene, one investor action */}
      <section className="hm-proof" id="partnership">
        {/* production edition: no concept visual here (OWNER "PRODUCTION V1" §3) — the frame is not rendered */}
        {hasConceptImage("home.proof") ? (
          <figure className="hm-proof__media" aria-hidden="true">
            <ConceptImage id="home.proof" locale={locale} sizes="100vw" />
          </figure>
        ) : null}
        <div className="xp-shell hm-proof__copy">
          <p className="pm-kicker pm-kicker--light" data-reveal>{c.partnerKicker}</p>
          <h2 className="hm-proof__title" data-reveal>{c.partnerTitle}</h2>
          <div data-reveal>
            <HeroFigures className="hm-proof__figures" items={[
              { value: `${groupYears}+`, label: c.proof.years },
              { value: "2005", label: c.proof.founded },
              { value: portfolioFigures.operating.value[locale], label: c.proof.operating },
              { value: portfolioFigures.area.value[locale], label: c.proof.area },
              { value: portfolioFigures.land.value[locale], label: c.proof.land },
            ]} />
          </div>
          <div className="pm-actions" data-reveal>
            <Button href={href("/contact?subject=partnership#partnership")} variant="light">{c.partnerCta}</Button>
            {caseStudyPublished() ? <Link className="pm-link pm-link--light" href={`${p("/partnership")}#case`}>{c.partnerCase}<Icon /></Link> : null}
          </div>
        </div>
      </section>

      {/* 8 PEOPLE — careers film (preview edition only: the film is concept footage, OWNER "PRODUCTION V1" §3) */}
      {isProductionEdition ? null : <CareersMoment locale={locale} variant="section" href={`${p("/careers")}#positions`} count={vacancies.length} />}

      {/* 9 CALM CONTACT CLOSE — the next step and the confirmed contacts */}
      <section className="pm-close" id="next">
        <div className="xp-shell pm-close__grid">
          <div data-reveal>
            <p className="pm-kicker">{c.closeKicker}</p>
            <h2 className="pm-close__title">{c.closeTitle}</h2>
            <ul className="pm-close__contacts">
              <li><a href={contactLinks.email}>{company.email.value[locale]}</a></li>
              <li><a href={contactLinks.mobile}>{company.mobile.value[locale]}</a></li>
              <li><a href={contactLinks.landline}>{company.landline.value[locale]}</a></li>
            </ul>
          </div>
          <nav className="pm-close__routes" aria-label={c.closeKicker} data-reveal>
            {c.closeRoutes.map(([label, value]) => (
              <Link key={label} href={href(value)}>
                <span>{label}</span>
                <Icon name="arrow" size={18} />
              </Link>
            ))}
          </nav>
        </div>
      </section>
    </PageShell>
  );
}
