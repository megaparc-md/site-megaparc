import Link from "next/link";
import type { ReactNode } from "react";
import { PageShell } from "@/components/page-shell";
import { R3Label } from "@/components/r3";
import { Icon } from "@/components/ui";
import { privacyCopy, privacyFacts, privacyReady, privacyVersion, setFact } from "@/lib/candidate-privacy";
import { localePath, type SiteLocale } from "@/lib/site-data";

/**
 * CANDIDATE PRIVACY NOTICE — /careers/privacy/ in RO / RU / EN (Codex P1-02). The general text is the site's own; every legal fact
 * comes from src/data/candidate-privacy.json. A missing fact is shown — on the OWNER preview only — as a marked gap
 * (`data-cr-pending`), never filled with a guess; production builds the page only when the notice is approved and complete
 * (package-production removes the route otherwise, qa-production checks both states).
 */
export function CandidatePrivacyPage({ locale }: { locale: SiteLocale }) {
  const c = privacyCopy;
  const f = privacyFacts;
  const s = c.sections;
  const gap = (key: keyof typeof c.factLabels): ReactNode => (
    <mark className="cr-pending" data-cr-pending={key}>[{c.pending[locale]}: {c.factLabels[key][locale]}]</mark>
  );
  const text = (value: { ro: string; ru: string; en: string } | null, key: keyof typeof c.factLabels) => (value ? setFact(value)![locale] : gap(key));
  const rows: [string, ReactNode][] = [
    [s.who[locale], (
      <>
        <p>{text(f.controller, "controller")} · {c.idno[locale]} {f.idno ?? gap("idno")} · {text(f.address, "address")}</p>
        <p>{c.requests[locale]} {f.contact ? <a href={`mailto:${f.contact}`}>{f.contact}</a> : gap("contact")}</p>
        <p>{f.dpo == null ? gap("dpo") : f.dpo === "none" ? c.dpoNone[locale] : <>{c.dpoContact[locale]} {f.dpo}</>}</p>
      </>
    )],
    [s.what[locale], <p key="what">{c.what[locale]}</p>],
    [s.why[locale], <p key="why">{c.why[locale]}</p>],
    [s.basis[locale], <p key="basis">{text(f.legalBasis, "legalBasis")}</p>],
    [s.access[locale], <p key="access">{text(f.recipients, "recipients")}</p>],
    [s.transfers[locale], <p key="transfers">{text(f.transfers, "transfers")}</p>],
    [s.retention[locale], <p key="retention">{text(f.retention, "retention")}</p>],
    [s.reserve[locale], <p key="reserve">{text(f.reserve, "reserve")}</p>],
    [s.automated[locale], <p key="automated">{text(f.automated, "automated")}</p>],
    [s.rights[locale], (
      <>
        <p>{c.rights[locale]}</p>
        <p>{c.requests[locale]} {f.contact ? <a href={`mailto:${f.contact}`}>{f.contact}</a> : gap("contact")}</p>
      </>
    )],
    [s.complaint[locale], <p key="complaint">{c.complaint[locale]}</p>],
    [s.provide[locale], <p key="provide">{c.provide[locale]}</p>],
  ];
  return (
    <PageShell locale={locale} mainClassName="r3-page r4-page cr-page cr-privacy">
        <section className="r3-sec r3-sec--ivory">
          <div className="r3-shell cr-privacy__shell">
            <nav className="cr-crumbs" aria-label={c.label[locale]}>
              <Link href={localePath(locale, "/careers")}><Icon name="left" size={14} className="cr-crumbs__back" />{c.back[locale]}</Link>
            </nav>
            <R3Label>{c.label[locale]}</R3Label>
            <h1 className="cr-privacy__title">{c.title[locale]}</h1>
            <p className="r3-lead cr-privacy__lead">{c.lead[locale]}</p>
            {!privacyReady ? <p className="cr-privacy__draft" role="note">{c.draft[locale]}</p> : null}
            <dl className="cr-privacy__list">
              {rows.map(([title, body]) => (
                <div key={title} className="cr-privacy__row"><dt>{title}</dt><dd>{body}</dd></div>
              ))}
            </dl>
            <p className="cr-privacy__law">{c.law[locale]}{privacyVersion ? <> · {c.version[locale]} {privacyVersion}</> : null}</p>
          </div>
        </section>
    </PageShell>
  );
}
