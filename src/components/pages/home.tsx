import Link from "next/link";
import { ConceptDisclosure, ConceptImage, MaskTitle } from "@/components/experience";
import { PageShell } from "@/components/page-shell";
import { ArtImage } from "@/components/primitives";
import { Figure, NB, R3Label, R3Link, projectState, r3Href } from "@/components/r3";
import { Icon } from "@/components/ui";
import { formatAreaRange, getProject, listProjects, publicSpaces, sortSpaces, availabilityLabel, availabilityOf, propertyOccupancy } from "@/content/source";
import { company, contactLinks, drochiaProfile, portfolioFigures } from "@/data/demo-content";
import { businessStatement, holdOrSell, lifecycle, reinvestment } from "@/lib/business";
import { historyCopy, teaserImage } from "@/lib/history";
import { localePath, publicAsset, type SiteLocale } from "@/lib/site-data";

/**
 * HOME — SITEWIDE R3 (OWNER "VISUAL NO-GO → PREMIUM REBUILD", 2026-11-09). Seven scenes, not a chain of widgets:
 * 01 hero (one architectural image, the approved headline, two paths) → 02 two businesses as architectural
 * portals → 03 scale in oversized type → 04 an editorial property sequence (one dominant, one secondary, the
 * rest as a typographic index) → 05 how value is created as one line narrative on real projects → 06 heritage
 * (one archival image, a large year) → 07 two direct actions. Every status is derived from the content source.
 * The hero image is the OWNER-approved illustration (ILLUSTRATIVE_APPROVED, disclosed).
 */
const copy = {
  ro: {
    heroTitle: ["Imobiliare comerciale —", "de la investiție", "la obiectul care funcționează."],
    heroSub: "MEGAPARC investește în imobiliare — și închiriază obiectele comerciale pe care le deține.",
    invest: "Investiții",
    investNote: "Imobile, terenuri, parteneriat",
    lease: "Închiriere",
    leaseNow: "Liber acum",
    investVerbs: ["Achiziționăm", "Dezvoltăm", "Deținem", "Reinvestim"],
    investText: "Investim capital în active reale — și răspundem de rezultat.",
    investLink: "Investiții și parteneriat",
    leaseVerbs: ["Exploatăm", "Adaptăm", "Închiriem"],
    leaseText: "Spații comerciale în clădirile noastre — cu suport tehnic înainte de semnarea contractului.",
    leaseLink: "Spații disponibile",
    scaleLabel: "Scara",
    area: "suprafața obiectelor în funcțiune",
    operating: "obiecte în funcțiune",
    land: "terenuri pentru dezvoltare",
    years: "ani de experiență a grupului",
    assetsLabel: "Proiecte",
    assetsTitle: "Imobiliarele MEGAPARC.",
    open: "Vezi obiectul",
    all: "Toate proiectele",
    valueLabel: "Cum se creează valoarea",
    valueTitle: "De la teren la clădirea care funcționează.",
    stations: ["Imobil sau teren", "Dezvoltare", "Obiect în funcțiune", "Deținere pe termen lung · ieșire strategică"],
    historyLabel: "Istoric",
    historyCta: "Citiți istoria",
    historyRule: "MEGAPARC a fost fondată în 2005. Anii de dinainte sunt istoria grupului.",
    nextLabel: "Pasul următor",
    owner: "Am un imobil sau un teren",
    ownerNote: "Analizăm vânzarea sau dezvoltarea comună a imobilului.",
    tenant: "Am nevoie de un spațiu comercial",
    tenantNote: "Spații în clădirile noastre — cu suport tehnic înainte de contract.",
  },
  ru: {
    heroTitle: [`Коммерческая недвижимость${NB}—`, `от${NB}инвестиции`, `до${NB}работающего объекта.`],
    heroSub: `MEGAPARC инвестирует в${NB}недвижимость${NB}— и${NB}сдаёт в${NB}аренду собственные коммерческие объекты.`,
    invest: "Инвестиции",
    investNote: `Объекты, земля, партнёрство`,
    lease: "Аренда",
    leaseNow: "Свободно сейчас",
    investVerbs: ["Приобретаем", "Развиваем", "Владеем", "Реинвестируем"],
    investText: `Вкладываем капитал в${NB}реальные объекты${NB}— и${NB}отвечаем за${NB}результат.`,
    investLink: `Инвестиции и${NB}партнёрство`,
    leaseVerbs: ["Эксплуатируем", "Адаптируем", `Сдаём в${NB}аренду`],
    leaseText: `Коммерческие помещения в${NB}наших зданиях${NB}— с${NB}технической поддержкой до${NB}подписания договора.`,
    leaseLink: "Свободные помещения",
    scaleLabel: "Масштаб",
    area: "площадь действующих объектов",
    operating: "действующих объекта",
    land: "земли под развитие",
    years: "лет опыта группы",
    assetsLabel: "Проекты",
    assetsTitle: "Недвижимость MEGAPARC.",
    open: "Смотреть объект",
    all: "Все проекты",
    valueLabel: "Как создаётся стоимость",
    valueTitle: `От${NB}участка до${NB}работающего здания.`,
    stations: [`Объект или участок`, "Девелопмент", "Действующий объект", `Долгосрочное владение · стратегический выход`],
    historyLabel: "История",
    historyCta: "Читать историю",
    historyRule: `MEGAPARC основана в${NB}2005${NB}году. Годы до${NB}этого${NB}— история группы.`,
    nextLabel: "Следующий шаг",
    owner: `У${NB}меня есть объект или${NB}земля`,
    ownerNote: `Рассмотрим продажу или совместное развитие недвижимости.`,
    tenant: `Мне нужно коммерческое помещение`,
    tenantNote: `Помещения в${NB}наших зданиях${NB}— с${NB}технической поддержкой до${NB}договора.`,
  },
  en: {
    heroTitle: ["Commercial real estate —", "from investment", "to a working property."],
    heroSub: "MEGAPARC invests in real estate — and leases the commercial properties it owns.",
    invest: "Investment",
    investNote: "Property, land, partnership",
    lease: "Leasing",
    leaseNow: "Available now",
    investVerbs: ["Acquire", "Develop", "Own", "Reinvest"],
    investText: "We put capital into real assets — and stay responsible for the result.",
    investLink: "Investment and partnership",
    leaseVerbs: ["Operate", "Adapt", "Lease"],
    leaseText: "Commercial space in our own buildings — with technical support before you sign.",
    leaseLink: "Available spaces",
    scaleLabel: "Scale",
    area: "operating property area",
    operating: "operating properties",
    land: "land for development",
    years: "years of the group's experience",
    assetsLabel: "Projects",
    assetsTitle: "MEGAPARC real estate.",
    open: "View the property",
    all: "All projects",
    valueLabel: "How value is created",
    valueTitle: "From a plot of land to a working building.",
    stations: ["Property or land", "Development", "Operating property", "Long-term ownership · strategic exit"],
    historyLabel: "History",
    historyCta: "Read the history",
    historyRule: "MEGAPARC was founded in 2005. The years before are the group's history.",
    nextLabel: "Next step",
    owner: "I have a property or land",
    ownerNote: "We consider a sale or a joint development of the property.",
    tenant: "I need commercial space",
    tenantNote: "Space in our own buildings — with technical support before the lease.",
  },
} as const;

const groupYears = Math.floor((2026 - 1991) / 5) * 5;
const stage = (key: string) => lifecycle.find((item) => item.key === key)!;

export function HomePage({ locale }: { locale: SiteLocale }) {
  const c = copy[locale];
  const p = (path: string) => localePath(locale, path);
  const spaces = sortSpaces(publicSpaces);
  const now = spaces.find((space) => availabilityOf(space).key === "now") ?? spaces[0] ?? null;
  const nowProject = now ? getProject(now.project) ?? null : null;
  const dacia = getProject("dacia-31")!;
  const m20 = getProject("moscova-20")!;
  const vatra = getProject("vatra")!;
  const drochia = getProject("drochia-gateway")!;
  const creanga = getProject("creanga-78")!;
  const index = listProjects().filter((project) => project.slug !== dacia.slug && project.slug !== m20.slug);
  const daciaState = projectState(dacia, locale);
  const m20State = projectState(m20, locale);
  const creangaFull = propertyOccupancy("creanga-78").fullyLet;
  const leaseLine = now && nowProject ? `${availabilityLabel(now, locale)}: ${nowProject.name} · ${formatAreaRange(now.areaMin, now.area, locale)}` : c.leaseLink;
  const figures = [
    { value: portfolioFigures.operating.value[locale], label: c.operating },
    { value: portfolioFigures.land.value[locale], label: c.land },
    { value: `${groupYears}+`, label: c.years },
  ];
  const stations = [
    { title: c.stations[0], text: stage("acquire").text[locale], proof: `${drochia.name} · ${drochiaProfile.site.value[locale]}`, href: p(`/projects/${drochia.slug}`) },
    { title: c.stations[1], text: stage("develop").text[locale], proof: `${vatra.name} · ${vatra.card.status[locale]}`, href: p(`/projects/${vatra.slug}`) },
    { title: c.stations[2], text: stage("operate").text[locale], proof: `${dacia.name} · ${dacia.card.size[locale]}`, href: p(`/projects/${dacia.slug}`) },
    { title: c.stations[3], text: `${holdOrSell[locale]} ${reinvestment[locale]}`, proof: creangaFull ? `${creanga.name} · ${projectState(creanga, locale).text}` : `${portfolioFigures.area.value[locale]}`, href: p(`/projects/${creanga.slug}`) },
  ];

  return (
    <PageShell locale={locale} variant="overlay" experience mainClassName="r3-page r3-home">
      {/* 01 HERO — one architectural image, the headline, two paths only */}
      <section className="r3-hero" id="home" data-xp-hero>
        <div className="r3-hero__media" aria-hidden="true">
          <ConceptImage id="home.hero" locale={locale} priority sizes="100vw" />
        </div>
        <div className="r3-hero__veil" aria-hidden="true" />
        <ConceptDisclosure id="home.hero" locale={locale} />
        <div className="r3-shell r3-hero__inner">
          <MaskTitle as="h1" className="r3-display r3-hero__title" lines={[...c.heroTitle]} />
          {/* R3.1 §9: one composition — the statement, then two quiet paths inside it (no cards, no notes) */}
          <div className="r3-hero__foot" data-reveal>
            <p className="r3-hero__sub">{c.heroSub}</p>
            <nav className="r3-hero__paths" aria-label={`${c.invest} · ${c.lease}`}>
              <Link href={p("/partnership")} className="r3-path">{c.invest}<Icon size={18} /></Link>
              <Link href={`${p("/leasing")}#available`} className="r3-path" title={leaseLine}>{c.lease}<Icon size={18} /></Link>
            </nav>
          </div>
        </div>
      </section>

      {/* 02 TWO BUSINESSES — investment · operations and leasing, as two architectural portals */}
      <section className="r3-sec r3-sec--ivory r3-two" id="directions">
        <div className="r3-shell r3-two__intro" data-reveal>
          <p className="r3-statement">{businessStatement[locale]}</p>
        </div>
        <div className="r3-portals">
          <Link href={p("/partnership")} className="r3-portal" data-reveal>
            <figure className="r3-portal__media">
              <ArtImage media={{ ...vatra.media!, mobile: vatra.media!.wide }} variant="wide" alt={`${vatra.name} — ${vatra.format[locale]}`} sizes="(min-width: 900px) 50vw, 100vw" position="38% 60%" />
            </figure>
            <span className="r3-portal__veil" aria-hidden="true" />
            <span className="r3-portal__copy">
              <span className="r3-portal__title">{c.invest}</span>
              <span className="r3-portal__verbs">{c.investVerbs.map((verb) => <span key={verb}>{verb}</span>)}</span>
              <span className="r3-portal__text">{c.investText}</span>
              <span className="r3-portal__more">{c.investLink}<Icon size={16} /></span>
            </span>
          </Link>
          <Link href={`${p("/leasing")}#available`} className="r3-portal" data-reveal>
            <figure className="r3-portal__media">
              <ArtImage media={m20.media!} variant="portrait" alt={`${m20.name} — ${m20.format[locale]}`} sizes="(min-width: 900px) 50vw, 100vw" position="40% 60%" />
            </figure>
            <span className="r3-portal__veil" aria-hidden="true" />
            <span className="r3-portal__copy">
              <span className="r3-portal__title">{c.lease}</span>
              <span className="r3-portal__verbs">{c.leaseVerbs.map((verb) => <span key={verb}>{verb}</span>)}</span>
              <span className="r3-portal__text">{c.leaseText}</span>
              <span className="r3-portal__more">{c.leaseLink}<Icon size={16} /></span>
            </span>
          </Link>
        </div>
      </section>

      {/* 03 SCALE — confirmed figures as architecture, not a KPI board */}
      <section className="r3-sec r3-sec--paper r3-scale" id="scale">
        <div className="r3-shell">
          <R3Label>{c.scaleLabel}</R3Label>
          <p className="r3-scale__lead" data-reveal>
            <Figure className="r3-scale__value" value={portfolioFigures.area.value[locale]} />
            <span className="r3-scale__label">{c.area}</span>
          </p>
          <dl className="r3-scale__row" data-reveal>
            {figures.map((figure) => (
              <div key={figure.label}>
                <dt>{figure.label}</dt>
                <dd><Figure value={figure.value} /></dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* 04 SELECTED ASSETS — one dominant building, one secondary, the rest revealed as an index */}
      <section className="r3-sec r3-sec--ivory r3-assets" id="projects">
        <div className="r3-shell r3-head" data-reveal>
          <R3Label>{c.assetsLabel}</R3Label>
          <h2 className="r3-title">{c.assetsTitle}</h2>
        </div>
        <Link href={p(`/projects/${dacia.slug}`)} className="r3-feature" data-reveal>
          <figure className="r3-feature__media">
            <ArtImage media={dacia.media!} alt={`${dacia.name} — ${dacia.format[locale]}`} sizes="100vw" position="50% 58%" />
          </figure>
          <span className="r3-shell r3-feature__copy">
            <span className="r3-feature__name">{dacia.name}</span>
            <span className="r3-feature__line">{dacia.editorial?.headline[locale] ?? dacia.line[locale]}</span>
            <span className="r3-feature__meta">
              <span>{dacia.city[locale]} · {dacia.district[locale]}</span>
              <span className={`r3-state is-${daciaState.tone}`}>{daciaState.text}</span>
              <span className="r3-more">{c.open}<Icon size={16} /></span>
            </span>
          </span>
        </Link>
        <div className="r3-shell r3-second">
          <Link href={p(`/projects/${m20.slug}`)} className="r3-second__media" data-reveal tabIndex={-1} aria-hidden="true">
            <ArtImage media={m20.media!} variant="card" alt="" sizes="(min-width: 900px) 58vw, 100vw" position="50% 55%" />
          </Link>
          <div className="r3-second__copy" data-reveal>
            <h3 className="r3-second__name"><Link href={p(`/projects/${m20.slug}`)}>{m20.name}</Link></h3>
            <p className="r3-second__line">{m20.line[locale]}</p>
            <p className={`r3-state is-${m20State.tone}`}>{m20State.text}</p>
            <R3Link href={p(`/projects/${m20.slug}`)}>{c.open}</R3Link>
          </div>
        </div>
        <ol className="r3-shell r3-index" data-reveal>
          {index.map((project) => {
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
        </ol>
        <div className="r3-shell r3-assets__foot">
          <R3Link href={p("/projects")}>{c.all} · {String(listProjects().length).padStart(2, "0")}</R3Link>
        </div>
      </section>

      {/* 05 HOW VALUE IS CREATED — one visual narrative on real projects, not process cards */}
      <section className="r3-sec r3-sec--ink r3-value" id="value">
        <div className="r3-shell">
          <div className="r3-head r3-head--light" data-reveal>
            <R3Label tone="light">{c.valueLabel}</R3Label>
            <h2 className="r3-title">{c.valueTitle}</h2>
          </div>
          <ol className="r3-line" data-reveal>
            {stations.map((station, i) => (
              <li key={station.title} className="r3-line__station" style={{ ["--i" as string]: i }}>
                <span className="r3-line__dot" aria-hidden="true" />
                <h3 className="r3-line__title">{station.title}</h3>
                <p className="r3-line__text">{station.text}</p>
                <Link className="r3-line__proof" href={station.href}>{station.proof}<Icon size={14} /></Link>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 06 HERITAGE — one archival image, a large year, a short narrative */}
      <section className={`r3-sec r3-sec--paper r3-heritage${teaserImage.home ? "" : " r3-heritage--type"}`} id="history">
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

      {/* 07 OPPORTUNITY — two direct actions, large and calm */}
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
            <li><Link href={r3Href(locale, "/contact?subject=partnership#partnership")}>{locale === "ru" ? "Обсудить партнёрство" : locale === "ro" ? "Discutăm un parteneriat" : "Discuss a partnership"}</Link></li>
          </ul>
        </div>
      </section>
    </PageShell>
  );
}
