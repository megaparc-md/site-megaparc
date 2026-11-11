import Link from "next/link";
import { MaskTitle } from "@/components/experience";
import { PageShell } from "@/components/page-shell";
import { ArtImage } from "@/components/primitives";
import { Figure, NB, R3Label, R3Link, ValueSequence, projectState, r3Href, viewableNow } from "@/components/r3";
import { Icon } from "@/components/ui";
import { getProject, spaceArea, spacesFor } from "@/content/source";
import { itemHref, leasingOnRequest, leasingProjects, portfolioCategories, portfolioCounts, waitlistHref, waitlistLabel } from "@/lib/portfolio";
import { company, contactLinks, portfolioFigures } from "@/data/demo-content";
import { businessStatement, positioning } from "@/lib/business";
import { noPrice } from "@/lib/leasing";
import { historyCopy, teaserImage } from "@/lib/history";
import { localePath, publicAsset, type SiteLocale } from "@/lib/site-data";

/**
 * HOME — R3.2 «REFERENCE-LED ART DIRECTION» (OWNER 2026-11-10). Seven deliberate editorial scenes:
 * FINMENTOR editorial discipline (one idea per scene, the claim followed by its evidence) · Yellow Tree investment
 * authority · Inamstro real-estate scale (buildings are the content) · Moscova 20 decision depth (derived statuses).
 *   01 hero — one architectural composition: positioning line, the approved headline, the OWNER business sentence,
 *      two quiet typographic paths (Investment · Leasing);
 *   02 positioning — one large statement, then the confirmed evidence (10 939 m² · 04 · 5,05 ha · group years);
 *   03 projects — one large scene (Dacia 31) → one secondary (Moscova 20) → one large scene (VATRA), the rest as an index;
 *   04 investment — Acquire · Develop · Operate · Reinvest as one typographic sequence on real projects;
 *   05 leasing — what can be leased now, and what comes next, read from the status model;
 *   06 history — one large year, the short story (an archival frame only where approved);
 *   07 two direct actions.
 * Strong photograph = large, weak photograph = small (Moscova 9, Creangă 78), rejected photograph = never.
 */
const copy = {
  ro: {
    heroTitle: ["Imobiliare comerciale —", "de la investiție", "la obiectul care funcționează."],
    invest: "Investiții",
    lease: "Închiriere",
    statement: "Investim capital în active reale — și rămânem responsabili de rezultatul lor.",
    statementNote: "Clădirile și terenurile rămân în proprietatea MEGAPARC: le dezvoltăm, le exploatăm și le închiriem singuri.",
    area: "suprafața obiectelor în funcțiune",
    operating: "obiecte în funcțiune",
    land: "terenuri pentru dezvoltare",
    years: "ani de experiență a grupului",
    assetsLabel: "Proiecte",
    assetsTitle: "Imobiliarele MEGAPARC.",
    open: "Vezi obiectul",
    openProject: "Vezi proiectul",
    all: "Toate proiectele",
    valueLabel: "Investiții",
    valueTitle: "De la teren la clădirea care funcționează.",
    valueLink: "Investiții și parteneriat",
    leaseLabel: "Închiriere",
    leaseTitle: "Ce se poate închiria.",
    nowTitle: "Se poate vedea acum",
    soonTitle: "În curând",
    leaseAll: "Toate spațiile disponibile",
    historyLabel: "Istoric",
    historyCta: "Citiți istoria",
    historyRule: "MEGAPARC a fost fondată în 2005. Anii de dinainte sunt istoria grupului.",
    nextLabel: "Pasul următor",
    owner: "Am un imobil sau un teren",
    ownerNote: "Analizăm vânzarea sau dezvoltarea comună a imobilului.",
    tenant: "Am nevoie de un spațiu comercial",
    tenantNote: "Spații în clădirile noastre — cu suport tehnic înainte de contract.",
    partnership: "Discutăm un parteneriat",
  },
  ru: {
    heroTitle: [`Коммерческая недвижимость${NB}—`, `от${NB}инвестиции`, `до${NB}работающего объекта.`],
    invest: "Инвестиции",
    lease: "Аренда",
    statement: `Мы вкладываем капитал в${NB}реальные объекты${NB}— и${NB}остаёмся ответственными за${NB}их результат.`,
    statementNote: `Здания и${NB}земля остаются в${NB}собственности MEGAPARC: мы${NB}их развиваем, эксплуатируем и${NB}сдаём в${NB}аренду сами.`,
    area: "площадь действующих объектов",
    operating: "действующих объекта",
    land: "земли под развитие",
    years: "лет опыта группы",
    assetsLabel: "Проекты",
    assetsTitle: "Недвижимость MEGAPARC.",
    open: "Смотреть объект",
    openProject: "Открыть проект",
    all: "Все проекты",
    valueLabel: "Инвестиции",
    valueTitle: `От${NB}участка до${NB}работающего здания.`,
    valueLink: `Инвестиции и${NB}партнёрство`,
    leaseLabel: "Аренда",
    leaseTitle: `Что можно арендовать.`,
    nowTitle: "Можно посмотреть сейчас",
    soonTitle: "Скоро",
    leaseAll: "Все свободные помещения",
    historyLabel: "История",
    historyCta: "Читать историю",
    historyRule: `MEGAPARC основана в${NB}2005${NB}году. Годы до${NB}этого${NB}— история группы.`,
    nextLabel: "Следующий шаг",
    owner: `У${NB}меня есть объект или${NB}земля`,
    ownerNote: `Рассмотрим продажу или совместное развитие недвижимости.`,
    tenant: `Мне нужно коммерческое помещение`,
    tenantNote: `Помещения в${NB}наших зданиях${NB}— с${NB}технической поддержкой до${NB}договора.`,
    partnership: "Обсудить партнёрство",
  },
  en: {
    heroTitle: ["Commercial real estate —", "from investment", "to a working property."],
    invest: "Investment",
    lease: "Leasing",
    statement: "We put capital into real assets — and remain responsible for how they perform.",
    statementNote: "The buildings and land stay in MEGAPARC ownership: we develop, operate and lease them ourselves.",
    area: "operating property area",
    operating: "operating properties",
    land: "land for development",
    years: "years of the group's experience",
    assetsLabel: "Projects",
    assetsTitle: "MEGAPARC real estate.",
    open: "View the property",
    openProject: "View the project",
    all: "All projects",
    valueLabel: "Investment",
    valueTitle: "From a plot of land to a working building.",
    valueLink: "Investment and partnership",
    leaseLabel: "Leasing",
    leaseTitle: "What you can lease.",
    nowTitle: "Can be viewed now",
    soonTitle: "Coming up",
    leaseAll: "All available spaces",
    historyLabel: "History",
    historyCta: "Read the history",
    historyRule: "MEGAPARC was founded in 2005. The years before are the group's history.",
    nextLabel: "Next step",
    owner: "I have a property or land",
    ownerNote: "We consider a sale or a joint development of the property.",
    tenant: "I need commercial space",
    tenantNote: "Space in our own buildings — with technical support before the lease.",
    partnership: "Discuss a partnership",
  },
} as const;

const groupYears = Math.floor((2026 - 1991) / 5) * 5;

export function HomePage({ locale }: { locale: SiteLocale }) {
  const c = copy[locale];
  const p = (path: string) => localePath(locale, path);
  const dacia = getProject("dacia-31")!;
  const m20 = getProject("moscova-20")!;
  const vatra = getProject("vatra")!;
  const leasing = leasingProjects();
  const counts = portfolioCounts();
  /** the index after the three large scenes: the other leasing buildings, then the two other categories (R3.3 §5) */
  const indexLeasing = leasing.filter((project) => project.slug !== m20.slug);
  const m20State = projectState(m20, locale);
  // R4 §13 — the leasing hierarchy from the status model: viewable now (an available unit, or a building that can be visited
  // today — Dacia 31 on request) · upcoming (occupied until a date — Moscova 9) · fully let (Creangă 78, a waiting list)
  const offers = leasing.map((project) => {
    const unit = spacesFor(project.slug)[0] ?? null;
    const state = projectState(project, locale);
    const now = unit ? viewableNow(unit) : Boolean(leasingOnRequest[project.slug]);
    return { project, unit, state, now, full: state.tone === "full" };
  });
  const offersNow = offers.filter((offer) => !offer.full && offer.now);
  const offersSoon = offers.filter((offer) => !offer.full && !offer.now);
  const offersFull = offers.filter((offer) => offer.full);
  const evidence = [
    { value: portfolioFigures.operating.value[locale], label: c.operating },
    { value: portfolioFigures.land.value[locale], label: c.land },
    { value: `${groupYears}+`, label: c.years },
  ];

  return (
    <PageShell locale={locale} variant="solid" experience mainClassName="r3-page r3-home r32-home r4-page r4-home">
      {/* 01 HERO — R3.3.1 §1: architecture leads with the typography. The strongest real MEGAPARC exterior — Dacia 31, the
          whole building in its park — in an intentional split (58 % from 1280 px; on top, 45–67 % of the viewport below);
          the frame is chosen so the building is never cut. cv-hero-plaza stays OWNER REJECTED. */}
      <section className="r3-hero r32-hero r33-hero r331-hero" id="home" data-xp-hero>
        <figure className="r331-hero__media">
          <ArtImage media={dacia.media!} alt={`${dacia.name} — ${dacia.format[locale]}, ${dacia.city[locale]}`} priority sizes="(min-width: 1280px) 58vw, 100vw" position="52% 54%" />
          <figcaption className="r331-hero__caption">{dacia.name} · {dacia.city[locale]}</figcaption>
        </figure>
        <div className="r3-shell r3-hero__inner r331-hero__copy">
          <R3Label tone="light">{positioning[locale]}</R3Label>
          <MaskTitle as="h1" className="r3-display r3-hero__title" lines={[...c.heroTitle]} />
          <div className="r3-hero__foot" data-reveal>
            <p className="r3-hero__sub">{businessStatement[locale]}</p>
            <nav className="r32-paths" aria-label={`${c.invest} · ${c.lease}`}>
              <Link href={p("/partnership")} className="r32-path">{c.invest}<Icon size={20} /></Link>
              <Link href={`${p("/leasing")}#available`} className="r32-path">{c.lease}<Icon size={20} /></Link>
            </nav>
          </div>
        </div>
      </section>

      {/* 02 POSITIONING — one statement, then its evidence (FINMENTOR: claim → proof) */}
      <section className="r3-sec r3-sec--ivory r32-position" id="position">
        <div className="r3-shell">
          <p className="r32-position__statement" data-reveal>{c.statement}</p>
          <p className="r3-lead r32-position__note" data-reveal>{c.statementNote}</p>
          <div className="r32-proof" data-reveal>
            <p className="r32-proof__lead">
              <Figure className="r32-proof__value" value={portfolioFigures.area.value[locale]} />
              <span className="r32-proof__label">{c.area}</span>
            </p>
            <dl className="r32-proof__row">
              {evidence.map((figure) => (
                <div key={figure.label}>
                  <dt>{figure.label}</dt>
                  <dd><Figure value={figure.value} /></dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* 03 PROJECTS — architecture first: one large scene → one secondary → one large scene, the rest as an index */}
      <section className="r3-sec r3-sec--ivory r3-sec--flush-top r3-assets r32-assets" id="projects">
        <div className="r3-shell r3-head" data-reveal>
          <R3Label>{c.assetsLabel}</R3Label>
          <h2 className="r3-title">{c.assetsTitle}</h2>
        </div>
        <div className="r3-shell r3-second">
          <Link href={p(`/projects/${m20.slug}`)} className="r3-second__media" data-reveal tabIndex={-1} aria-hidden="true">
            <ArtImage media={m20.media!} variant="card" alt="" sizes="(min-width: 900px) 58vw, 100vw" />
          </Link>
          <div className="r3-second__copy" data-reveal>
            <h3 className="r3-second__name"><Link href={p(`/projects/${m20.slug}`)}>{m20.name}</Link></h3>
            <p className="r3-second__line">{m20.line[locale]}</p>
            <p className={`r3-state is-${m20State.tone}`}>{m20State.text}</p>
            <R3Link href={p(`/projects/${m20.slug}`)}>{c.open}</R3Link>
          </div>
        </div>
        <Link href={p(`/projects/${vatra.slug}`)} className="r32-scene" data-reveal>
          <figure className="r32-scene__media">
            <ArtImage media={{ ...vatra.media!, mobile: vatra.media!.wide }} variant="wide" alt={`${vatra.name} — ${vatra.format[locale]}`} sizes="100vw" position="52% 58%" />
          </figure>
          <span className="r3-shell r32-scene__copy">
            <span className="r32-scene__name">{vatra.name}</span>
            <span className="r32-scene__meta">{vatra.format[locale]} · {vatra.card.status[locale]}</span>
            <span className="r3-more">{c.openProject}<Icon size={16} /></span>
          </span>
        </Link>
        <ol className="r3-shell r3-index r32-index" data-reveal>
          {indexLeasing.map((project) => {
            const state = projectState(project, locale);
            return (
              <li key={project.slug}>
                <Link href={p(`/projects/${project.slug}`)}>
                  <span className="r3-index__name">{project.name}</span>
                  <span className="r3-index__meta">{project.format[locale]}</span>
                  <span className={`r3-index__state is-${state.tone}`}>{state.text}</span>
                  {project.media ? (
                    <span className="r3-index__peek" aria-hidden="true">
                      <ArtImage media={project.media} variant="card" alt="" sizes="22rem" />
                    </span>
                  ) : null}
                  <Icon size={20} />
                </Link>
              </li>
            );
          })}
          {portfolioCategories.filter((category) => category.key !== "leasing").map((category) => (
            <li key={category.key}>
              <Link href={itemHref(locale, null, category.anchor)}>
                <span className="r3-index__name">{category.label[locale]}</span>
                <span className="r3-index__meta">{category.lead[locale]}</span>
                <span className="r3-index__state">{String(counts[category.key]).padStart(2, "0")}</span>
                <Icon size={20} />
              </Link>
            </li>
          ))}
        </ol>
        <div className="r3-shell r3-assets__foot">
          <R3Link href={p("/projects")}>{c.all} · {String(counts.leasing + counts.land + counts.development).padStart(2, "0")}</R3Link>
        </div>
      </section>

      {/* 04 INVESTMENT — one statement, then Acquire · Develop · Operate · Reinvest as one sequence on real projects */}
      <section className="r3-sec r3-sec--ink r3-value r32-value" id="value">
        <div className="r3-shell">
          <div className="r3-head r3-head--light" data-reveal>
            <R3Label tone="light">{c.valueLabel}</R3Label>
            <h2 className="r3-title">{c.valueTitle}</h2>
          </div>
          <ValueSequence locale={locale} tone="dark" />
          <div className="r32-value__foot" data-reveal>
            <R3Link href={p("/partnership")} tone="light" large>{c.valueLink}</R3Link>
          </div>
        </div>
      </section>

      {/* 05 LEASING — the leasing portfolio (R3.3 §5): four buildings, each with its own status — never copied */}
      <section className="r3-sec r3-sec--paper r32-lease" id="leasing">
        <div className="r3-shell r32-lease__grid">
          <div className="r32-lease__head" data-reveal>
            <R3Label>{c.leaseLabel}</R3Label>
            <h2 className="r3-title">{c.leaseTitle}</h2>
            <p className="r3-lead">{noPrice[locale]}</p>
            <R3Link href={`${p("/leasing")}#available`}>{c.leaseAll}</R3Link>
          </div>
          <div className="r32-lease__list">
            {/* R4 (OWNER overnight mandate §13): available now leads, upcoming follows; a fully let building never competes */}
            {[{ key: "now", items: offersNow, title: c.nowTitle }, { key: "soon", items: offersSoon, title: c.soonTitle }].map((group) =>
              group.items.length ? (
                <div key={group.key} className={`r32-lease__group r4-lease__group r4-lease__group--${group.key}`} data-reveal>
                  <p className={`r4-lease__when is-${group.key}`}>{group.title}<small>{String(group.items.length).padStart(2, "0")}</small></p>
                  <ul>
                    {group.items.map(({ project, unit, state }) => {
                      const area = unit ? spaceArea(unit, locale) : null;
                      return (
                        <li key={project.slug}>
                          <Link href={p(`/projects/${project.slug}`)} className="r32-offer">
                            <span className="r32-offer__media" aria-hidden="true">
                              {project.media ? <ArtImage media={project.media} variant="card" alt="" sizes="9rem" /> : null}
                            </span>
                            <span className="r32-offer__name">{project.name}</span>
                            <span className="r32-offer__unit">{unit ? unit.unit[locale] : project.format[locale]}{area ? <> · <Figure value={area} /></> : null}</span>
                            <span className={`r3-state is-${state.tone}`}>{state.text}</span>
                            <Icon size={20} />
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ) : null,
            )}
            {offersFull.length ? (
              <p className="r4-lease__full" data-reveal>
                {offersFull.map(({ project, state }, i) => (
                  <span key={project.slug}>{i ? " · " : ""}{project.name} — {state.text} · <Link href={waitlistHref(locale, project.slug)}>{waitlistLabel[locale]}</Link></span>
                ))}
              </p>
            ) : null}
          </div>
        </div>
      </section>

      {/* 06 HISTORY — one large year, the short story; an archival frame only where approved */}
      <section className={`r3-sec r3-sec--ivory r3-heritage r32-heritage${teaserImage.home ? "" : " r3-heritage--type"}`} id="history">
        {teaserImage.home ? (
          <figure className="r3-heritage__media" data-reveal>
            <picture>
              <source media="(min-width: 721px)" srcSet={publicAsset(`/assets/history/${teaserImage.home}.webp`)} />
              <img src={publicAsset(`/assets/history/${teaserImage.home}-mobile.webp`)} alt="" loading="lazy" decoding="async" />
            </picture>
          </figure>
        ) : null}
        <p className="r3-heritage__year" aria-hidden="true" data-reveal>1991</p>
        <div className="r3-heritage__copy" data-reveal>
          <R3Label>{c.historyLabel}</R3Label>
          <h2 className="r3-title r3-heritage__title">{historyCopy.title[locale].join(" ")}</h2>
          <p className="r3-lead">{historyCopy.lead[locale]}</p>
          <p className="r3-heritage__rule">{c.historyRule}</p>
          <R3Link href={p("/history")} large>{c.historyCta}</R3Link>
        </div>
      </section>

      {/* 07 NEXT — two direct actions, large and calm */}
      <section className="r3-sec r3-sec--stone r3-next" id="next">
        <div className="r3-shell">
          <R3Label>{c.nextLabel}</R3Label>
          <div className="r3-next__grid">
            <Link className="r3-next__action" href={p("/offer")} data-reveal>
              <span className="r3-next__title">{c.owner}</span>
              <span className="r3-next__note">{c.ownerNote}</span>
              <Icon size={28} />
            </Link>
            <Link className="r3-next__action" href={`${p("/leasing")}#available`} data-reveal>
              <span className="r3-next__title">{c.tenant}</span>
              <span className="r3-next__note">{c.tenantNote}</span>
              <Icon size={28} />
            </Link>
          </div>
          <ul className="r3-next__contacts">
            <li><a href={contactLinks.email}>{company.email.value[locale]}</a></li>
            <li><a href={contactLinks.mobile}>{company.mobile.value[locale]}</a></li>
            <li><a href={contactLinks.landline}>{company.landline.value[locale]}</a></li>
            <li><Link href={r3Href(locale, "/contact?subject=partnership#partnership")}>{c.partnership}</Link></li>
          </ul>
        </div>
      </section>
    </PageShell>
  );
}
