"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Icon } from "@/components/ui";

/**
 * OPEN VACANCIES — the list with a quiet filter by professional direction (OWNER «MEGAPARC CAREERS», 2026-11-25 · block 05).
 * Rows and hairlines, not a job-board grid; the filter is text options, shown only when there is more than one direction.
 * Every string is prepared on the server; this component only chooses which rows are shown.
 * A link elsewhere on the page with `data-cr-direction="<key>"` (block 04) sets the filter and lets the anchor scroll here.
 * Without JavaScript the whole list is shown.
 */
export type VacancyRow = { slug: string; href: string; title: string; category: string; categoryLabel: string; summary: string; meta: string[]; pay: string | null };
export type VacancyFilter = { key: string; label: string; count: string };

export function VacancyList({ rows, filters, copy }: { rows: VacancyRow[]; filters: VacancyFilter[]; copy: { all: string; allCount: string; filter: string; more: string } }) {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const link = (event.target as Element | null)?.closest?.("[data-cr-direction]");
      const key = link?.getAttribute("data-cr-direction");
      if (key && filters.some((item) => item.key === key)) setActive(key);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [filters]);

  const shown = active ? rows.filter((row) => row.category === active) : rows;
  const count = active ? filters.find((item) => item.key === active)?.count ?? copy.allCount : copy.allCount;

  return (
    <div className="cr-list">
      <div className="cr-list__bar">
        <p className="cr-list__count" aria-live="polite">{count}</p>
        {filters.length > 1 ? (
          <div className="cr-filter" role="group" aria-label={copy.filter}>
            <button type="button" className="cr-filter__opt" aria-pressed={active === null} onClick={() => setActive(null)}>{copy.all}</button>
            {filters.map((item) => (
              <button key={item.key} type="button" className="cr-filter__opt" aria-pressed={active === item.key} onClick={() => setActive(item.key)}>{item.label}</button>
            ))}
          </div>
        ) : null}
      </div>
      <ul className="cr-vacancies">
        {shown.map((row) => (
          <li key={row.slug}>
            <Link className="cr-vacancy" href={row.href}>
              <span className="cr-vacancy__dir">{row.categoryLabel}</span>
              <h3 className="cr-vacancy__title">{row.title}</h3>
              <p className="cr-vacancy__summary">{row.summary}</p>
              <span className="cr-vacancy__terms">
                {row.pay ? <strong>{row.pay}</strong> : null}
                {row.meta.map((item) => <span key={item}>{item}</span>)}
              </span>
              <span className="cr-vacancy__more">{copy.more}<Icon size={16} /></span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
