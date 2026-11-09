import Link from "next/link";
import type { ReactNode } from "react";
import { CadastreVerify } from "@/components/leasing/cadastre-verify";
import { trustCopy, trustItems } from "@/components/leasing/property-trust";
import { Icon } from "@/components/ui";
import { availabilityLabel, availabilityOf, formatAreaRange, kindLabel, propertyOccupancy, spacesFor, type ProjectEntry } from "@/content/source";
import { company, contactLinks, occupancyOf, type OperatingSlug } from "@/data/demo-content";
import type { AvailableSpace } from "@/data/leasing-inventory";
import { cadastreNumbers, eCadastruPortal } from "@/data/property-trust";
import { localePath, type Localized, type SiteLocale } from "@/lib/site-data";

/**
 * SITEWIDE R3 — shared building blocks of the premium rebuild (OWNER "SITEWIDE R3", 2026-11-09).
 * Quiet architectural authority: fewer, larger elements; typography + image before any box.
 * Styles: src/app/r3.css (class prefix `r3-`). No card component lives here on purpose.
 */

export const NB = " ";

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
      return { text: `${availabilityLabel(first, locale)} · ${formatAreaRange(first.areaMin, first.area, locale)}`, tone: availabilityOf(first).key === "now" ? "now" : "soon" };
    }
    if (propertyOccupancy(project.slug as OperatingSlug).fullyLet) return { text: `${kindLabel.operating[locale]} · ${fullyLet[locale]}`, tone: "full" };
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
export function R3Trust({ slug, locale, tone = "paper", id = "technical-support" }: { slug?: string; locale: SiteLocale; tone?: "paper" | "ivory" | "stone"; id?: string }) {
  const number = slug ? cadastreNumbers[slug] : undefined;
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
            <a className="r3-link r3-link--dark" href={contactLinks.mobile}><span>{trustCopy.call[locale]} · {company.mobile.value[locale]}</span><Icon size={16} /></a>
          </div>
          <p className="r3-note">{trustCopy.note[locale]}</p>
        </div>
        {number ? (
          <div className="r3-trust__cad" data-reveal>
            <CadastreVerify number={number} portal={eCadastruPortal} locale={locale} />
          </div>
        ) : null}
      </div>
    </section>
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
