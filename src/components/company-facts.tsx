import { CountUp } from "@/components/count-up";
import { DemoLegend } from "@/components/experience";
import { Head, Section, TextLink } from "@/components/ui";
import { listLand, listProjects, publicSpaces } from "@/content/source";
import { portfolioFigures } from "@/data/demo-content";
import { portfolioAssets } from "@/lib/assets";
import { signatureWords } from "@/lib/brand";
import { scaleMetrics } from "@/lib/metrics";
import { brand, localePath, type SiteLocale } from "@/lib/site-data";

/**
 * COMPANY FACTS — editorial fact board (final visual pass 2026-09-27), moved to
 * About and re-anchored by the OWNER correction of 2026-10-08:
 *   row 1  1991 business origins (burgundy, wide; 1995 group investment
 *          structure in its text) · 2005 MEGAPARC founded (black, red numeral) ·
 *          2020 real-estate focus (graphite)
 *   row 2  04 operating properties · 02 development projects · 20 000+ m² land
 *   row 2b lettable area (DEMO) · spaces available now (live from the content source)
 *   row 3  the one burgundy field: Investment · Development · Leasing (OWNER brief 2026-10-08)
 * Every year, count and area comes from the shared data modules; "35+ / 20+"
 * are derived from the 1991 and 2005 anchors, rounded down to a multiple of five.
 */

const anchors = { origins: "1991", holding: "1995", established: "2005", focus: "2020" };

const copy = {
  ro: {
    id: "fapte",
    kicker: "MEGAPARC în fapte",
    title: (origins: number, mp: number, focus: string) => [`${origins}+ ani de experiență antreprenorială.`, `${mp}+ ani MEGAPARC.`, `Imobiliarele — activitatea principală din ${focus}.`],
    years: (n: number) => `${n}+ ani`,
    originsScope: "Originile afacerii",
    originsTitle: "Primele afaceri ale fondatorilor",
    originsText: `Comerț, producție, logistică. ${anchors.holding} — structura de investiții a grupului.`,
    establishedTitle: "Este fondată MEGAPARC",
    establishedText: "Cumpărarea clădirilor comerciale și transformarea lor în spații de închiriat.",
    focusTitle: "Imobiliarele devin activitatea principală",
    focusText: "Investiții, dezvoltare și închiriere — în imobiliare proprii.",
    portfolio: "Proiecte",
    development: "Dezvoltare",
    operatingTitle: "imobile în exploatare",
    projectsTitle: "proiecte de dezvoltare",
    landTitle: "terenuri",
    model: "Modelul nostru",
    with: "Lucrăm cu",
    partners: ["chiriași", "proprietari de clădiri și terenuri", "constructori", "arhitecți", "bănci"],
    cta: "Cronica completă",
    indicators: "Închiriere",
    gla: "suprafața imobilelor în exploatare",
    spaces: "spații disponibile",
  },
  ru: {
    id: "fakty",
    kicker: "MEGAPARC в фактах",
    title: (origins: number, mp: number, focus: string) => [`${origins}+ лет предпринимательского опыта.`, `${mp}+ лет MEGAPARC.`, `Недвижимость — главное дело с ${focus} года.`],
    years: (n: number) => `${n}+ лет`,
    originsScope: "Истоки бизнеса",
    originsTitle: "Первые компании основателей",
    originsText: `Розница, производство, логистика. ${anchors.holding} — инвестиционная структура группы.`,
    establishedTitle: "Основана MEGAPARC",
    establishedText: "Покупка коммерческих зданий и превращение их в пространства для аренды.",
    focusTitle: "Недвижимость становится главным делом",
    focusText: "Инвестиции, девелопмент и аренда собственной недвижимости.",
    portfolio: "Проекты",
    development: "Развитие",
    operatingTitle: "действующих объекта",
    projectsTitle: "проекта развития",
    landTitle: "земельные участки",
    model: "Наша модель",
    with: "Работаем с",
    partners: ["арендаторами", "владельцами зданий и земли", "подрядчиками", "архитекторами", "банками"],
    cta: "Вся хроника",
    indicators: "Аренда",
    gla: "площадь действующих объектов",
    spaces: "свободные помещения",
  },
  en: {
    id: "facts",
    kicker: "MEGAPARC in facts",
    title: (origins: number, mp: number, focus: string) => [`${origins}+ years of entrepreneurial experience.`, `${mp}+ years of MEGAPARC.`, `Real estate as the core business since ${focus}.`],
    years: (n: number) => `${n}+ years`,
    originsScope: "Business origins",
    originsTitle: "The founders' first businesses",
    originsText: `Retail, manufacturing, logistics. ${anchors.holding} — the group's investment structure.`,
    establishedTitle: "MEGAPARC is founded",
    establishedText: "Buying commercial buildings and turning them into space to lease.",
    focusTitle: "Real estate becomes the core business",
    focusText: "Investment, development and leasing of our own real estate.",
    portfolio: "Projects",
    development: "Development",
    operatingTitle: "operating properties",
    projectsTitle: "development projects",
    landTitle: "land plots",
    model: "Our model",
    with: "We work with",
    partners: ["tenants", "owners of buildings and land", "contractors", "architects", "banks"],
    cta: "The full chronicle",
    indicators: "Leasing",
    gla: "operating property area",
    spaces: "available spaces",
  },
} as const;

/** Whole years since an anchor, rounded down to a multiple of five ("35+"). */
function yearsSince(year: string) {
  const elapsed = new Date().getFullYear() - Number(year);
  return Math.max(5, Math.floor(elapsed / 5) * 5);
}

export function CompanyFacts({ locale, tone = "light" }: { locale: SiteLocale; tone?: "dark" | "light" }) {
  const light = tone === "light";
  const c = copy[locale];
  const metrics = scaleMetrics();
  const operating = metrics.find((metric) => metric.key === "operating");
  const projects = metrics.find((metric) => metric.key === "projects");
  const land = metrics.find((metric) => metric.key === "land");
  const city = portfolioAssets[0]?.city[locale];
  const projectNames = listProjects().filter((project) => project.kind === "development").map((project) => project.name).join(" · ");
  const landProject = listLand().map((plot) => plot.name[locale]).join(" · ");
  const originYears = yearsSince(anchors.origins);
  const megaparcYears = yearsSince(anchors.established);
  const titleLines = c.title(originYears, megaparcYears, anchors.focus);

  return (
    <Section tone={light ? "paper" : "ink"} id={c.id} className={`keyfacts${light ? " keyfacts--light" : ""}`} label={c.kicker}>
      <div className="shell">
        <Head kicker={c.kicker} title={<>{titleLines[0]}<br />{titleLines[1]}<br />{titleLines[2]}</>} />

        <ul className="kf">
          <li className="kf__card kf__card--burgundy kf__card--heritage kf__card--wide" data-reveal>
            <span className="kf__scope">{c.originsScope} · {c.years(originYears)}</span>
            <span className="kf__value kf__value--xl">{anchors.origins}</span>
            <div className="kf__body">
              <span className="kf__title">{c.originsTitle}</span>
              <p className="kf__text">{c.originsText}</p>
            </div>
          </li>

          <li className="kf__card kf__card--black kf__card--est" data-reveal>
            <span className="kf__scope">{brand.name}<span className="kf__scope-extra"> · {c.years(megaparcYears)}</span></span>
            <span className="kf__value kf__value--lg kf__value--red">{anchors.established}</span>
            <div className="kf__body">
              <span className="kf__title">{c.establishedTitle}</span>
              <p className="kf__text">{c.establishedText}</p>
            </div>
          </li>

          <li className="kf__card kf__card--graphite kf__card--focus" data-reveal>
            <span className="kf__scope">{brand.name}</span>
            <span className="kf__value kf__value--lg">{anchors.focus}</span>
            <div className="kf__body">
              <span className="kf__title">{c.focusTitle}</span>
              <p className="kf__text">{c.focusText}</p>
            </div>
          </li>

          {operating ? (
            <li className={`kf__card ${light ? "kf__card--paper" : "kf__card--black"} kf__card--count`} data-reveal>
              <span className="kf__scope">{c.portfolio}</span>
              <span className="kf__value kf__value--lg"><CountUp value={operating.value} locale={locale} pad={operating.pad} /></span>
              <div className="kf__body">
                <span className="kf__title kf__title--caps">{c.operatingTitle}</span>
                <p className="kf__text">{city}</p>
              </div>
            </li>
          ) : null}

          {projects ? (
            <li className={`kf__card ${light ? "kf__card--paper" : "kf__card--graphite"} kf__card--count`} data-reveal>
              <span className="kf__scope">{c.development}</span>
              <span className="kf__value kf__value--lg"><CountUp value={projects.value} locale={locale} pad={projects.pad} /></span>
              <div className="kf__body">
                <span className="kf__title kf__title--caps">{c.projectsTitle}</span>
                <p className="kf__text">{projectNames}</p>
              </div>
            </li>
          ) : null}

          {land ? (
            <li className={`kf__card ${light ? "kf__card--stone" : "kf__card--deep"} kf__card--land kf__card--wide`} data-reveal>
              <span className="kf__scope">{c.development}</span>
              <span className="kf__value kf__value--land">
                <CountUp value={land.value} locale={locale} />
                {land.plus ? <b>+</b> : null}
                {land.unit ? <small>{land.unit[locale]}</small> : null}
              </span>
              <div className="kf__body">
                <span className="kf__title kf__title--caps">{c.landTitle}</span>
                <p className="kf__text">{[land.secondary?.[locale], landProject].filter(Boolean).join(" · ")}</p>
              </div>
            </li>
          ) : null}

          {light ? (
            <>
              <li className="kf__card kf__card--paper kf__card--demo kf__card--demo-lead" data-reveal>
                <span className="kf__scope">{c.indicators}</span>
                <span className="kf__value kf__value--lg">{portfolioFigures.area.value[locale]}</span>
                <div className="kf__body"><span className="kf__title kf__title--caps">{c.gla}</span></div>
              </li>
              <li className="kf__card kf__card--paper kf__card--demo" data-reveal>
                <span className="kf__scope">{c.indicators}</span>
                <span className="kf__value kf__value--lg">{String(publicSpaces.length).padStart(2, "0")}</span>
                <div className="kf__body"><span className="kf__title kf__title--caps">{c.spaces}</span></div>
              </li>
            </>
          ) : null}

          <li className="kf__card kf__card--red kf__card--model" data-reveal>
            <span className="kf__scope">{c.model}</span>
            <p className="kf__words" aria-label={signatureWords[locale].join(" ")}>
              {signatureWords[locale].map((word) => (
                <span key={word}>{word}</span>
              ))}
            </p>
          </li>
        </ul>

        <div className="kf__foot" data-reveal>
          <span className="kf__with">{c.with}</span>
          <ul className="kf__list">
            {c.partners.map((partner) => (
              <li key={partner}>{partner}</li>
            ))}
          </ul>
          <TextLink href={localePath(locale, "/history")} className={light ? undefined : "tlink--light"}>{c.cta}</TextLink>
        </div>
        {light ? <DemoLegend locale={locale} /> : null}
      </div>
    </Section>
  );
}
