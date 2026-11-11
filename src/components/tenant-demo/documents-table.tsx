"use client";

import { useState } from "react";
import { DemoAction } from "@/components/tenant-demo/demo-action";
type DemoDoc = { title: string; date: string; type: string; format: string; fresh?: boolean };

/**
 * The documents of the OWNER demo: quiet text filters (never CRM pills), one row per document — title · date · type · download.
 * The rows come from the server component as props, so the synthetic list never sits in a client bundle.
 */
export function DocumentsTable({ documents, categories }: { documents: DemoDoc[]; categories: string[] }) {
  const [filter, setFilter] = useState<string>("all");
  const rows = filter === "all" ? documents : documents.filter((d) => d.type === filter);
  const options: { key: string; label: string; n: number }[] = [
    { key: "all", label: "Все", n: documents.length },
    ...categories.map((c) => ({ key: c, label: c, n: documents.filter((d) => d.type === c).length })),
  ];
  return (
    <>
      <div className="tc-filter" role="group" aria-label="Категория документов">
        {options.map((o) => (
          <button key={o.key} type="button" className="tc-filter__item" aria-pressed={filter === o.key} onClick={() => setFilter(o.key)}>
            {o.label}<span className="tc-filter__n">{o.n}</span>
          </button>
        ))}
      </div>
      <table className="tc-table tc-table--stack tc-table--docs">
        <caption className="sr-only">Документы, демо</caption>
        <thead><tr><th scope="col">Документ</th><th scope="col">Дата</th><th scope="col">Тип</th><th scope="col"><span className="sr-only">Действие</span></th></tr></thead>
        <tbody>
          {rows.map((d) => (
            <tr key={d.title}>
              <th scope="row">{d.title}{d.fresh ? <small className="tc-new">новый</small> : null}</th>
              <td data-label="Дата">{d.date}</td>
              <td data-label="Тип">{d.type} · {d.format}</td>
              <td className="is-action"><DemoAction className="tc-link">Скачать</DemoAction></td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
