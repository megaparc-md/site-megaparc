"use client";

import { useMemo, useState } from "react";
import type { SpaceStatus } from "@/data/leasing-inventory";

/**
 * CMS WORKFLOW PROTOTYPE (internal, noindex) — OWNER correction 2026-10-08,
 * "NO-CODE BUSINESS WORKFLOW". A mock of the WordPress screen a MEGAPARC
 * employee will use, next to a live mock of the public "Available now" list:
 *   WordPress → Leasing → Moscova 20 → M20-01 → Status → one of the six OWNER
 *   statuses (2026-11-06) → Update → the site reflects the change.
 * The status list and the published subset come from src/content/source.ts as
 * props (one rule, no copy here). Nothing is saved: state lives in this component.
 */

export type CmsStatus = SpaceStatus;
export type CmsRecord = { id: string; code: string; project: string; unit: string; area: string; floor: string; uses: string; from: string; status: CmsStatus; updated: string };

/** CSS-safe slug of a status ("AVAILABLE_NOW" → "available-now"). */
const slug = (status: CmsStatus) => status.toLowerCase().replace(/_/g, "-");

export type CmsCopy = {
  menu: string[];
  menuActive: number;
  listTitle: string;
  addNew: string;
  columns: [string, string, string, string, string];
  status: Record<CmsStatus, string>;
  editTitle: string;
  fields: { project: string; unit: string; floor: string; area: string; uses: string; from: string; status: string; photos: string; plan: string };
  photosValue: string;
  planValue: string;
  update: string;
  back: string;
  saved: string;
  savedLeased: string;
  siteTitle: string;
  /** "{n}" is replaced by the number of published spaces (props must stay serialisable). */
  siteCount: string;
  siteEmpty: string;
  hidden: string;
  hint: string;
};

export function CmsPrototype({ records, copy, initial, statuses, publishedStatuses }: { records: CmsRecord[]; copy: CmsCopy; initial: string; statuses: readonly CmsStatus[]; publishedStatuses: readonly CmsStatus[] }) {
  const [data, setData] = useState(records);
  const [open, setOpen] = useState<string | null>(initial);
  const [draft, setDraft] = useState<CmsStatus | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const current = data.find((record) => record.id === open) ?? null;
  const isPublished = (status: CmsStatus) => publishedStatuses.includes(status);
  const published = useMemo(() => data.filter((record) => publishedStatuses.includes(record.status)), [data, publishedStatuses]);

  const choose = (id: string) => {
    setOpen(id);
    setDraft(null);
    setNotice(null);
  };
  const update = () => {
    if (!current || !draft) return;
    setData((list) => list.map((record) => (record.id === current.id ? { ...record, status: draft, updated: "→ " + new Date().toLocaleTimeString().slice(0, 5) } : record)));
    setNotice(isPublished(draft) ? copy.saved : copy.savedLeased);
    setDraft(null);
  };

  return (
    <div className="cms">
      <div className="cms__admin" aria-label="WordPress">
        <div className="cms__bar"><span className="cms__wp" aria-hidden="true">W</span> MEGAPARC · WordPress</div>
        <div className="cms__body">
          <nav className="cms__menu" aria-label="WordPress">
            {copy.menu.map((item, i) => (
              <span key={item} className={i === copy.menuActive ? "is-active" : undefined}>{item}</span>
            ))}
          </nav>
          <div className="cms__main">
            {current ? (
              <div className="cms__edit">
                <button type="button" className="cms__back" onClick={() => choose("")}>← {copy.back}</button>
                <h3>{copy.editTitle}: {current.project} · {current.code}</h3>
                <dl className="cms__fields">
                  <div><dt>{copy.fields.project}</dt><dd>{current.project}</dd></div>
                  <div><dt>{copy.fields.unit}</dt><dd>{current.unit}</dd></div>
                  <div><dt>{copy.fields.floor}</dt><dd>{current.floor}</dd></div>
                  <div><dt>{copy.fields.area}</dt><dd>{current.area}</dd></div>
                  <div><dt>{copy.fields.uses}</dt><dd>{current.uses}</dd></div>
                  <div><dt>{copy.fields.from}</dt><dd>{current.from}</dd></div>
                  <div><dt>{copy.fields.photos}</dt><dd>{copy.photosValue}</dd></div>
                  <div><dt>{copy.fields.plan}</dt><dd>{copy.planValue}</dd></div>
                </dl>
                <fieldset className="cms__status">
                  <legend>{copy.fields.status}</legend>
                  {statuses.map((status) => (
                    <label key={status} className={`cms__radio cms__radio--${slug(status)}`}>
                      <input type="radio" name="cms-status" value={status} checked={(draft ?? current.status) === status} onChange={() => setDraft(status)} />
                      <span>{copy.status[status]}</span>
                    </label>
                  ))}
                </fieldset>
                <button type="button" className="cms__update" onClick={update} disabled={!draft || draft === current.status}>{copy.update}</button>
                {notice ? <p className="cms__notice" role="status">{notice}</p> : <p className="cms__hint">{copy.hint}</p>}
              </div>
            ) : (
              <div className="cms__list">
                <div className="cms__list-head">
                  <h3>{copy.listTitle}</h3>
                  <span className="cms__add">{copy.addNew}</span>
                </div>
                <table>
                  <thead>
                    <tr>{copy.columns.map((col) => <th key={col} scope="col">{col}</th>)}</tr>
                  </thead>
                  <tbody>
                    {data.map((record) => (
                      <tr key={record.id}>
                        <td><button type="button" onClick={() => choose(record.id)}>{record.code} · {record.unit}</button></td>
                        <td>{record.project}</td>
                        <td>{record.area}</td>
                        <td><span className={`cms__pill cms__pill--${slug(record.status)}`}>{copy.status[record.status]}</span></td>
                        <td>{record.updated}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="cms__site" aria-live="polite">
        <p className="cms__site-label">megaparc.md / leasing</p>
        <h3>{copy.siteTitle}</h3>
        <p className="cms__site-count">{copy.siteCount.replace("{n}", String(published.length).padStart(2, "0"))}</p>
        <ul>
          {data.map((record) => (
            <li key={record.id} className={`cms__card${isPublished(record.status) ? "" : " is-gone"}${record.id === open ? " is-focus" : ""}`} aria-hidden={!isPublished(record.status)}>
              <span className="cms__card-code">{record.code}</span>
              <span className="cms__card-name">{record.project}</span>
              <span className="cms__card-meta">{record.area} · {record.floor}</span>
              <span className={`cms__pill cms__pill--${slug(record.status)}`}>{copy.status[record.status]}</span>
            </li>
          ))}
        </ul>
        {published.length ? null : <p>{copy.siteEmpty}</p>}
        <p className="cms__site-note">{copy.hidden}</p>
      </div>
    </div>
  );
}
