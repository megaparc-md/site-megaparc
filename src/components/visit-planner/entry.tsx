import Link from "next/link";
import { visitCopy } from "@/components/visit-planner/copy";
import { visitHref, type VisitEntrySource } from "@/components/visit-planner/href";
import { Icon } from "@/components/ui";
import { proposedSchedule } from "@/data/visit-planner";
import type { SiteLocale } from "@/lib/site-data";
import "./visit-entry.css";

/**
 * The way into the planner from a place that used to carry a viewing form (the Leasing Pack drawer): one statement, one action.
 * Renders nothing where the planner is not offered — the caller keeps what it showed before. Server component, no script.
 */
export function VisitEntry({ locale, slug, source = "site", unitLabel }: { locale: SiteLocale; slug: string; source?: VisitEntrySource; unitLabel?: string }) {
  const href = visitHref(locale, slug, source);
  if (!href) return null;
  const t = visitCopy[locale].entry;
  return (
    <div className="vp-entry">
      {unitLabel ? <p className="vp-entry__unit">{unitLabel}</p> : null}
      <p className="vp-entry__title">{t.title}</p>
      <p className="vp-entry__text">{t.text}</p>
      <Link className="btn vp-entry__btn" href={href}><span>{t.cta}</span><Icon /></Link>
      <p className="vp-entry__meta">{t.meta.replace("{n}", String(proposedSchedule.visitMinutes))} · {t.demo}</p>
    </div>
  );
}
