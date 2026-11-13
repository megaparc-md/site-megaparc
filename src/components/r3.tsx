import Link from "next/link";
import type { ReactNode } from "react";
import { CadastreVerify } from "@/components/leasing/cadastre-verify";
import { trustCopy, trustItems } from "@/components/leasing/property-trust";
import { Icon } from "@/components/ui";
import { availabilityOf, getProject, kindLabel, propertyOccupancy, spaceStatusLine, spacesFor, type ProjectEntry } from "@/content/source";
import { leasingOnRequest } from "@/lib/portfolio";
import { company, contactLinks, drochiaProfile, occupancyOf, type OperatingSlug } from "@/data/demo-content";
import { holdOrSell, lifecycle, reinvestment } from "@/lib/business";
import type { AvailableSpace } from "@/data/leasing-inventory";
import { cadastreNumbers, eCadastruPortal, premisesCadastre } from "@/data/property-trust";
import { registeredData } from "@/data/registered";
import { localePath, type Localized, type SiteLocale } from "@/lib/site-data";

/**
 * SITEWIDE R3 — shared building blocks of the premium rebuild (OWNER "SITEWIDE R3", 2026-11-09).
 * Quiet architectural authority: fewer, larger elements; typography + image before any box.
 * Styles: src/app/r3.css (class prefix `r3-`). No card component lives here on purpose.
 */

/** A real no-break space (U+00A0) — R3.2 found the R3 constant was a plain space, so RU prepositions and dates still hung. */
export const NB = " ";

/** A telephone number never breaks between its digit groups («+373 78 803 / 010» on phones). */
export const tel = (value: string) => value.replace(/ /g, NB);

/** Locale path with an optional ?query and #hash ("/contact?subject=lease#occupier"). */
export function r3Href(locale: SiteLocale, value: string) {
  const [pathQuery, hash] = value.split("#");
  const [path, query] = pathQuery.split("?");
  return `${localePath(locale, path)}${query ? `?${query}` : ""}${hash ? `#${hash}` : ""}`;
}

/** The one text-link form of R3: label + arrow that moves on hover. */
export function R3Link({ href, children, tone = "dark", className = "", external = false, large = false }: { href: string; children: ReactNode; tone?: "dark" | "light"; className?: string; external?: boolean; large?: boolean }) {
  const cls = `r3-link r3-link--${tone}${large ? " r3-link--lg" : ""} ${className}`.trim();
  const inner = (
    <>
      <span>{children}</span>
      <Icon name={external ? "up-right" : "arrow"} size={large ? 20 : 16} />
    </>
  );
  return external ? <a className={cls} href={href} target="_blank" rel="noopener noreferrer">{inner}</a> : <Link className={cls} href={href}>{inner}</Link>;
}

/** The one restrained button of R3 — at most one per scene. */
export function R3Button({ href, children, tone = "dark" }: { href: string; children: ReactNode; tone?: "dark" | "light" }) {
  return (
    <Link className={`r3-btn r3-btn--${tone}`} href={href}>
      <span>{children}</span>
      <Icon size={16} />
    </Link>
  );
}

/** A small uppercase label — used sparingly (OWNER R3 §11: fewer small labels). */
export function R3Label({ children, tone = "dark" }: { children: ReactNode; tone?: "dark" | "light" }) {
  return <p className={`r3-label r3-label--${tone}`}>{children}</p>;
}

const fullyLet: Localized = { ro: "Ocupat 100 %", ru: `Занят на${NB}100${NB}%`, en: "100% occupied" };

/** One status line per project, derived from the status model (never typed): offer · date · fully let · stage. */
export function projectState(project: ProjectEntry, locale: SiteLocale): { text: string; tone: "now" | "soon" | "full" | "quiet" } {
  if (project.kind === "operating") {
    const own = spacesFor(project.slug);
    if (own.length) {
      const first = own[0];
      return { text: spaceStatusLine(first, locale), tone: availabilityOf(first).key === "now" ? "now" : "soon" };
    }
    if (propertyOccupancy(project.slug as OperatingSlug).fullyLet) return { text: `${kindLabel.operating[locale]} · ${fullyLet[locale]}`, tone: "full" };
    // R3.3: a leasing building without a confirmed offer (Dacia 31) — «for lease · area and timing on request»
    const onRequest = leasingOnRequest[project.slug];
    if (onRequest) return { text: onRequest[locale], tone: "soon" };
    return { text: kindLabel.operating[locale], tone: "quiet" };
  }
  return { text: project.card.status[locale], tone: "quiet" };
}

/**
 * LEASING TRUST SYSTEM — editorial form (OWNER R3 §6): technical feasibility first (Technical Director +
 * Architect; the RU core line «Сначала проверяем техническую реализуемость — затем обсуждаем коммерческие
 * условия.»), then the official e-Cadastru verification where the OWNER approved the cadastral number
 * (copy + open the portal; no invented deep link). No permit or design service is promised.
 */
export function R3Trust({ slug, locale, tone = "paper", id = "technical-support", verify = false }: { slug?: string; locale: SiteLocale; tone?: "paper" | "ivory" | "stone"; id?: string; /** the leasing template (OWNER «LEASING TEMPLATE LOCK» §11): the verification block always shows — one number, the registered premises, or «проверяется» */ verify?: boolean }) {
  const number = slug ? cadastreNumbers[slug] : undefined;
  const reg = slug ? registeredData[slug] : undefined;
  const fmt = (m2: number) => `${m2.toLocaleString(locale === "ru" ? "ru-RU" : locale === "ro" ? "ro-RO" : "en-GB", { minimumFractionDigits: 1, maximumFractionDigits: 2 }).replace(/\s/g, "\u00a0")}\u00a0${locale === "ru" ? "м²" : "m²"}`;
  const many = !number && reg && reg.premises.length > 1 ? reg.premises.map((premise) => ({ cadastral: premise.cadastral, area: fmt(premise.area) })) : null;
  const cadastre = number ? (
    <CadastreVerify number={number} premises={slug ? premisesCadastre[slug] : undefined} portal={eCadastruPortal} locale={locale} />
  ) : many ? (
    <CadastreVerify numbers={many} total={fmt(reg!.area)} portal={eCadastruPortal} locale={locale} />
  ) : verify ? (
    <CadastreVerify pending portal={eCadastruPortal} locale={locale} />
  ) : null;
  return (
    <section className={`r3-sec r3-sec--${tone} r3-trust`} id={id}>
      <div className="r3-shell">
        <div className="r3-trust__head" data-reveal>
          <R3Label>{trustCopy.label[locale]}</R3Label>
          <h2 className="r3-title r3-trust__title">{trustCopy.title[locale]}</h2>
          <p className="r3-lead">{trustCopy.lead[locale]}</p>
        </div>
        <p className="r3-trust__principle" data-reveal>{trustCopy.principle[locale]}</p>
        <div className="r3-trust__body" data-reveal>
          <p className="r3-trust__sub">{trustCopy.checks[locale]}</p>
          <ol className="r3-trust__list">
            {trustItems.map((item) => (
              <li key={item.en}>{item[locale]}</li>
            ))}
          </ol>
          <div className="r3-actions">
            <a className="r3-btn r3-btn--dark" href={contactLinks.email}><span>{trustCopy.discuss[locale]}</span><Icon size={16} /></a>
            <a className="r3-link r3-link--dark" href={contactLinks.mobile}><span>{trustCopy.call[locale]} · {tel(company.mobile.value[locale])}</span><Icon size={16} /></a>
          </div>
          <p className="r3-note">{trustCopy.note[locale]}</p>
        </div>
        {cadastre ? (
          <div className="r3-trust__cad" data-reveal>
            {cadastre}
          </div>
        ) : null}
      </div>
    </section>
  );
}

/**
 * HOW VALUE IS CREATED — R3.2 «REFERENCE-LED» §6 scene 04 / §7 (OWNER 2026-11-10). One typographic sequence, never four
 * boxes: Acquire · Develop · Operate · Reinvest, each verb in the serif with one confirmed sentence and its proof on a
 * real MEGAPARC project (claim → evidence). Texts come from the business model (`src/lib/business.ts`); statuses are
 * derived. Used on Home (ink) and Investment (paper).
 */
const valueVerbs: Record<"acquire" | "develop" | "operate" | "reinvest", Localized> = {
  acquire: { ro: "Achiziționăm", ru: "Приобретаем", en: "Acquire" },
  develop: { ro: "Dezvoltăm", ru: "Развиваем", en: "Develop" },
  operate: { ro: "Exploatăm", ru: "Эксплуатируем", en: "Operate" },
  reinvest: { ro: "Reinvestim", ru: "Реинвестируем", en: "Reinvest" },
};

const devLabel: Localized = { ro: "proiect nou în lucru", ru: "новый проект в работе", en: "a new project in progress" };

export function ValueSequence({ locale, tone = "dark" }: { locale: SiteLocale; tone?: "dark" | "light" }) {
  const p = (path: string) => localePath(locale, path);
  const stage = (key: string) => lifecycle.find((item) => item.key === key)!;
  const drochia = getProject("drochia")!;
  const vatra = getProject("vatra")!;
  const creanga = getProject("creanga-78")!;
  const steps = [
    { verb: valueVerbs.acquire[locale], text: stage("acquire").text[locale], proof: `${drochia.name} · ${drochiaProfile.site.value[locale]}`, href: p(`/projects/${drochia.slug}`) },
    { verb: valueVerbs.develop[locale], text: stage("develop").text[locale], proof: `${vatra.name} · ${vatra.card.status[locale]}`, href: p(`/projects/${vatra.slug}`) },
    { verb: valueVerbs.operate[locale], text: stage("operate").text[locale], proof: `${creanga.name} · ${projectState(creanga, locale).text}`, href: p(`/projects/${creanga.slug}`) },
    { verb: valueVerbs.reinvest[locale], text: `${reinvestment[locale]} ${holdOrSell[locale]}`, proof: `Vasile Lupu 48/3 · ${devLabel[locale]}`, href: `${p("/projects")}#development` },
  ];
  return (
    <ol className={`r3-line r3-seq r3-seq--${tone}`} data-reveal>
      {steps.map((step, i) => (
        <li key={step.verb} className="r3-line__station" style={{ ["--i" as string]: i }}>
          <span className="r3-line__dot" aria-hidden="true" />
          <h3 className="r3-seq__verb">{step.verb}</h3>
          <p className="r3-line__text">{step.text}</p>
          <Link className="r3-line__proof" href={step.href}>{step.proof}<Icon size={14} /></Link>
        </li>
      ))}
    </ol>
  );
}

/** A figure with its unit set apart («10 939» + «м²») — a unit never overlaps a number (OWNER 2026-11-09). */
export function Figure({ value, className = "" }: { value: string; className?: string }) {
  const match = value.match(/^(.*?)[\s ]?(м²|m²|га|ha|%)$/);
  if (!match) return <span className={`r3-fig ${className}`.trim()}>{value}</span>;
  return (
    <span className={`r3-fig ${className}`.trim()}>
      <span className="r3-fig__n">{match[1]}</span>
      <span className="r3-fig__u">{match[2]}</span>
    </span>
  );
}

/**
 * The tenant action for a space: a viewing when the space is available now or its building can be visited today
 * (Dacia 31: 551 of 5 541 m² occupied, offer from 1 Jan 2027); early interest when the building is physically
 * occupied until the date (Moscova 9). Derived from the register, never typed.
 */
export function viewableNow(space: AvailableSpace) {
  if (availabilityOf(space).key === "now") return true;
  const o = occupancyOf(space.project as OperatingSlug);
  return o.occupied < o.total - 1;
}
