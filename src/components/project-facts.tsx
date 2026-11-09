import Link from "next/link";
import { viewingHref } from "@/components/leasing/unit-card";
import { TextLink } from "@/components/ui";
import { availabilityLabel, availabilityOf, formatAreaRange, formatDate, propertyOccupancy, spacesFor, type ProjectEntry } from "@/content/source";
import type { OperatingSlug } from "@/data/demo-content";
import { localePath, type Localized, type SiteLocale } from "@/lib/site-data";

/** Place · size · status — the three facts a project card answers before the page opens (final craft pass 2026-10-08). */
export function ProjectFacts({ project, locale, className = "" }: { project: ProjectEntry; locale: SiteLocale; className?: string }) {
  const { place, size, sizeDemo, status } = project.card;
  return (
    <ul className={`pj-facts ${className}`.trim()}>
      <li>{place[locale]}</li>
      {sizeDemo ? null : <li>{size[locale]}</li>}
      <li>{status[locale]}</li>
    </ul>
  );
}

const N = " ";
/** One editorial line per building, written from the confirmed format and location only. */
export const storyLine: Record<string, Localized> = {
  "dacia-31": { ro: "Clădire de birouri independentă pentru o singură companie.", ru: "Отдельное офисное здание для одной компании.", en: "A stand-alone office building for one company." },
  "moscova-9": { ro: "Obiect comercial independent pe bulevardul Moscova, în afara centrelor comerciale.", ru: `Отдельно стоящий торговый объект на${N}бульваре Москова${N}— вне торговых центров.`, en: "A stand-alone retail building on Moscova Boulevard, outside the malls." },
  "moscova-20": { ro: "Spațiu comercial de colț la intersecția bulevardului Moscova cu strada Matei Basarab.", ru: `Угловое торговое помещение на${N}пересечении бульвара Москова и${N}улицы Матей Басараб.`, en: "A corner retail space where Moscova Boulevard meets Matei Basarab Street." },
  "creanga-78": { ro: "Obiect comercial în funcțiune în Chișinău.", ru: `Действующий коммерческий объект в${N}Кишинёве.`, en: "An operating commercial property in Chișinău." },
};

const statusCopy = {
  full: { ro: "Ocupat 100 %", ru: "Занят на\u00a0100\u00a0%", en: "100% occupied" },
  free: { ro: "Liber:", ru: "Свободно:", en: "Available:" },
} as const;

/**
 * One confirmed status line for an operating property (OWNER premium brief
 * 2026-10-09: no CRM-style «Сейчас» label): fully let → «Занят на 100 %»;
 * a published space → «Свободно: 625,7 м²». Nothing when no status is
 * confirmed (Dacia 31) — occupancy is never invented.
 */
export function ProjectStatus({ project, locale, tone, as: Tag = "p", className = "" }: { project: ProjectEntry; locale: SiteLocale; tone?: "dark"; as?: "p" | "span"; className?: string }) {
  if (project.kind !== "operating") return null;
  const spaces = spacesFor(project.slug);
  const slug = project.slug as OperatingSlug;
  let text: string | null = null;
  let kind = "";
  // availability-aware (OWNER overnight release §10): «Свободно сейчас · 625,7 м²» differs visibly from «Свободно с 1 января 2027 · …»
  if (spaces.length) {
    text = spaces.map((space) => `${availabilityLabel(space, locale)} · ${formatAreaRange(space.areaMin, space.area, locale)}`).join(" · ");
    kind = spaces.some((space) => availabilityOf(space).key === "now") ? " is-open is-now" : " is-open is-soon";
  }
  // derived from the unit register (OWNER CMS brief 2026-11-06): the last unit set to LEASED turns this into «Занят на 100 %»
  else if (propertyOccupancy(slug).fullyLet) { text = statusCopy.full[locale]; kind = " is-full"; }
  if (!text) return null;
  return <Tag className={`pj-status${tone === "dark" ? " pj-status--dark" : ""}${kind} ${className}`.trim()}>{text}</Tag>;
}

const editorialCopy = {
  now: { ro: "Disponibil acum", ru: "Доступно сейчас", en: "Available now" },
  soon: { ro: "Disponibil din", ru: "Доступно с", en: "Available from" },
  reserved: { ro: "Rezervat", ru: "Забронировано", en: "Reserved" },
  open: { ro: "Vezi obiectul", ru: "Смотреть объект", en: "View the property" },
  viewing: { ro: "Solicită o vizionare", ru: "Запросить просмотр", en: "Request a viewing" },
} as const;

/**
 * Editorial project card text (OWNER "PROJECT CARD TYPOGRAPHY FIX", 2026-10-09):
 * one left edge — name · meta on one line · headline (max two lines on desktop) ·
 * small burgundy status · what is offered · two actions set apart. No «Сейчас»
 * label, no advertising line, no bordered box. Used where `project.editorial`
 * is set (Dacia 31 for now).
 */
export function ProjectEditorial({ project, locale, nameAs: Name = "h2", nameClass }: { project: ProjectEntry; locale: SiteLocale; nameAs?: "h2" | "h3"; nameClass: string }) {
  const editorial = project.editorial!;
  const href = localePath(locale, `/projects/${project.slug}`);
  const space = spacesFor(project.slug)[0];
  const when = space ? availabilityOf(space) : null;
  const status = when ? (when.key === "soon" && when.date ? `${editorialCopy.soon[locale]} ${formatDate(when.date, locale)}` : editorialCopy[when.key][locale]) : null;
  const { place, size, status: stage } = project.card;
  return (
    <div className="pj-ed">
      <Name className={`pj-ed__name ${nameClass}`}><Link href={href}>{project.name}</Link></Name>
      <p className="pj-ed__meta">
        <span>{place[locale]}</span>
        <span>{size[locale]}</span>
        <span>{stage[locale]}</span>
      </p>
      <p className="pj-ed__headline">{editorial.headline[locale]}</p>
      {space && status ? (
        <div className="pj-ed__offer">
          <p className="pj-ed__status">{status}</p>
          <p className="pj-ed__scope">{editorial.scope[locale]} · {formatAreaRange(space.areaMin, space.area, locale)}</p>
        </div>
      ) : null}
      <div className="pj-ed__actions">
        <TextLink href={href}>{editorialCopy.open[locale]}</TextLink>
        {space ? <TextLink href={viewingHref(locale, space)}>{editorialCopy.viewing[locale]}</TextLink> : null}
      </div>
    </div>
  );
}
