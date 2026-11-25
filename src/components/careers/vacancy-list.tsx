"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Icon } from "@/components/ui";

/**
 * OPEN VACANCIES — R2 (OWNER «MEGAPARC CAREERS R2», 2026-11-25 · §7).
 * The vacancies grouped by professional direction (the R1 dark «directions» scene is folded in here: a group header carries the
 * direction, its one factual line and its count). A quiet text filter above shows one direction at a time.
 * A card: the short title (the full official title is on the vacancy page) · the pay as the one strong figure with its qualifiers
 * kept apart («от», нетто, в месяц, на испытательный срок) · employment and place · one summary line · the way in.
 * Every string is prepared on the server; this component only chooses which groups are shown.
 * A link elsewhere on the page with `data-cr-direction="<key>"` (the hero index, the projects scene) sets the filter and lets the
 * anchor scroll here. Without JavaScript every group is shown.
 */
export type VacancyRow = {
  slug: string;
  href: string;
  title: string;
  fullTitle: string;
  summary: string;
  meta: string[];
  pay: { prefix: string | null; figure: string; terms: string } | null;
  payNote: string | null;
};
export type VacancyGroup = { key: string; label: string; line: string; count: string; rows: VacancyRow[] };

export function VacancyList({ groups, copy }: { groups: VacancyGroup[]; copy: { all: string; allCount: string; filter: string; more: string } }) {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const link = (event.target as Element | null)?.closest?.("[data-cr-direction]");
      const key = link?.getAttribute("data-cr-direction");
      if (key && groups.some((item) => item.key === key)) setActive(key);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [groups]);

  const shown = active ? groups.filter((group) => group.key === active) : groups;
  const count = active ? groups.find((group) => group.key === active)?.count ?? copy.allCount : copy.allCount;

  return (
    <div className="cr-list">
      <div className="cr-list__bar">
        <p className="cr-list__count" aria-live="polite">{count}</p>
        {groups.length > 1 ? (
          <div className="cr-filter" role="group" aria-label={copy.filter}>
            <button type="button" className="cr-filter__opt" aria-pressed={active === null} onClick={() => setActive(null)}>{copy.all}</button>
            {groups.map((group) => (
              <button key={group.key} type="button" className="cr-filter__opt" aria-pressed={active === group.key} onClick={() => setActive(group.key)}>{group.label}</button>
            ))}
          </div>
        ) : null}
      </div>
      {shown.map((group) => (
        <section key={group.key} className="cr-group" aria-labelledby={`cr-group-${group.key}`}>
          <header className="cr-group__head">
            <h3 className="cr-group__name" id={`cr-group-${group.key}`}>{group.label}</h3>
            <p className="cr-group__line">{group.line}</p>
            <span className="cr-group__count">{group.count}</span>
          </header>
          <ul className="cr-vacancies">
            {group.rows.map((row) => (
              <li key={row.slug}>
                <Link className="cr-vacancy" href={row.href} title={row.fullTitle !== row.title ? row.fullTitle : undefined}>
                  <h4 className="cr-vacancy__title">{row.title}</h4>
                  <p className="cr-vacancy__summary">{row.summary}</p>
                  <span className="cr-vacancy__pay">
                    {row.pay ? (
                      <>
                        <strong className="cr-vacancy__figure">{row.pay.prefix ? <span className="cr-vacancy__prefix">{row.pay.prefix} </span> : null}{row.pay.figure}</strong>
                        <span className="cr-vacancy__qual">{row.pay.terms}</span>
                      </>
                    ) : row.payNote ? <span className="cr-vacancy__note">{row.payNote}</span> : null}
                    {row.meta.length ? <span className="cr-vacancy__meta">{row.meta.join(" · ")}</span> : null}
                  </span>
                  <span className="cr-vacancy__more">{copy.more}<Icon size={16} /></span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
