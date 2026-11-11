import Link from "next/link";
import { CabinetHeading, CabinetShell, StatusMark } from "@/components/tenant-demo/cabinet-shell";
import { DemoAction } from "@/components/tenant-demo/demo-action";
import { DocumentsTable } from "@/components/tenant-demo/documents-table";
import { RequestForm } from "@/components/tenant-demo/request-form";
import { company, contactLinks } from "@/data/demo-content";
import {
  demoContacts, demoDocCategories, demoDocuments, demoHistory, demoHref, demoInvoice, demoInvoiceTotal, demoMeta, demoMeters, demoProperty,
  demoRequestCategories, demoRequests, demoStatuses, demoStory, mdl,
} from "@/data/tenant-cabinet-demo";

/**
 * TENANT CABINET · OWNER DEMO — the screens (OWNER «COMPLETE THE MISSING TENANT CABINET OWNER DEMO», 2026-11-11). Property
 * service, not a SaaS panel: one serif figure per screen, rows and hairlines, a burgundy micro-accent only where the tenant has
 * to act. All data synthetic (src/data/tenant-cabinet-demo.ts); downloads and the request form are prototypes that never send.
 */
const N = " ";
const demoNote = `Демо-данные. Суммы, документы и${N}обращения вымышлены: это не${N}условия аренды Moscova 20 и${N}не${N}данные реального арендатора.`;
const count = (status: string) => demoRequests.filter((r) => r.status === status).length;

// ── OVERVIEW ───────────────────────────────────────────────────────────────────────────────────────────────────────────────
export function OverviewScreen() {
  const open = demoRequests.filter((r) => r.status !== "Выполнено");
  const fresh = demoDocuments.filter((d) => d.fresh);
  const tiles = [
    { key: "finance", label: "Финансы", line: `К оплате ${mdl(demoInvoiceTotal)} · до${N}${demoInvoice.due}`, href: demoHref("/finance"), act: true },
    { key: "documents", label: "Документы", line: `${fresh.length}${N}новых · всего ${demoDocuments.length}`, href: demoHref("/documents") },
    { key: "requests", label: "Обращения", line: `${count("В работе")}${N}в работе · ${count("Ожидает арендатора")}${N}ожидает вас`, href: demoHref("/requests"), act: count("Ожидает арендатора") > 0 },
    { key: "utilities", label: "Коммунальные", line: `${demoMeters.current} · показания учтены`, href: demoHref("/utilities") },
    { key: "property", label: "Мой объект", line: `DEMO-01 · 1‑й этаж · договор действует`, href: demoHref("/property") },
    { key: "contacts", label: "Контакты", line: `${demoContacts.length}${N}службы объекта`, href: demoHref("/contacts") },
  ];
  return (
    <CabinetShell active="overview">
      <section className="tc-shell tc-hero" aria-labelledby="tc-hero-title">
        <div className="tc-hero__id">
          <p className="tc-label">{demoMeta.tenant} · {demoMeta.contract}</p>
          <h1 className="tc-hero__title" id="tc-hero-title">{demoMeta.property}</h1>
          <p className="tc-lead">{demoMeta.address}</p>
          <p className="tc-hero__unit">{demoMeta.unit}</p>
        </div>
        <div className="tc-pay" aria-label="Текущий платёж">
          <dl className="tc-pay__grid">
            <div className="tc-pay__amount"><dt>К оплате</dt><dd>{mdl(demoInvoiceTotal)}</dd></div>
            <div><dt>До</dt><dd className="tc-pay__date">{demoInvoice.due}</dd></div>
            <div><dt>Статус</dt><dd><StatusMark status={demoInvoice.status} /></dd></div>
          </dl>
          <div className="tc-pay__actions">
            <DemoAction className="btn">Скачать счёт</DemoAction>
            <Link className="tc-link" href={demoHref("/finance")}>Финансы →</Link>
          </div>
          <p className="tc-pay__note">Счёт {demoInvoice.number} · демо-сумма</p>
        </div>
      </section>

      <section className="tc-shell tc-sec" aria-labelledby="tc-services">
        <h2 className="tc-h2" id="tc-services">Сервисы объекта</h2>
        <ul className="tc-tiles">
          {tiles.map((tile) => (
            <li key={tile.key}>
              <Link className={`tc-tile${tile.act ? " is-act" : ""}`} href={tile.href}>
                <span className="tc-tile__label">{tile.label}</span>
                <span className="tc-tile__line">{tile.line}</span>
                <span className="tc-tile__arrow" aria-hidden="true">→</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="tc-shell tc-sec tc-two">
        <div>
          <div className="tc-sec__head"><h2 className="tc-h2">Открытые обращения</h2><Link className="tc-link" href={demoHref("/requests/new")}>Создать обращение</Link></div>
          <ul className="tc-rows">
            {open.slice(0, 3).map((r) => (
              <li key={r.number} className="tc-row">
                <span className="tc-row__main"><span className="tc-row__title">{r.title}</span><span className="tc-row__meta">{r.number} · {r.category} · {r.owner}</span></span>
                <StatusMark status={r.status} />
              </li>
            ))}
          </ul>
          <Link className="tc-link tc-more" href={demoHref("/requests")}>Все обращения →</Link>
        </div>
        <div>
          <div className="tc-sec__head"><h2 className="tc-h2">Новые документы</h2></div>
          <ul className="tc-rows">
            {fresh.map((d) => (
              <li key={d.title} className="tc-row">
                <span className="tc-row__main"><span className="tc-row__title">{d.title}</span><span className="tc-row__meta">{d.type} · {d.date} · {d.format}</span></span>
              </li>
            ))}
          </ul>
          <Link className="tc-link tc-more" href={demoHref("/documents")}>Все документы →</Link>
        </div>
      </section>

      <section className="tc-story" aria-labelledby="tc-story-title">
        <div className="tc-shell">
          <p className="tc-label" id="tc-story-title">Цифровые отношения с{N}MEGAPARC</p>
          <ol className="tc-story__list">
            {demoStory.map((step) => (
              <li key={step.no} className={step.path ? "" : "is-here"}>
                <span className="tc-story__no">{step.no}</span>
                <span className="tc-story__title">{step.path ? <Link href={step.path}>{step.title}</Link> : step.title}</span>
                <span className="tc-story__text">{step.text}</span>
                {step.path ? null : <span className="tc-story__here">вы здесь</span>}
              </li>
            ))}
          </ol>
        </div>
      </section>
    </CabinetShell>
  );
}

// ── FINANCE ────────────────────────────────────────────────────────────────────────────────────────────────────────────────
export function FinanceScreen() {
  return (
    <CabinetShell active="finance">
      <section className="tc-shell tc-sec tc-sec--first">
        <CabinetHeading label={`${demoMeta.property} · DEMO-01`} title="Финансы" lead={`Счета и${N}начисления по${N}помещению. Все суммы — демо.`} />
        <dl className="tc-facts">
          <div className="is-lead"><dt>Текущий баланс</dt><dd>{mdl(demoInvoiceTotal)}<small>к оплате до{N}{demoInvoice.due}</small></dd></div>
          <div><dt>Переплата</dt><dd>{mdl(0)}</dd></div>
          <div><dt>Следующий счёт</dt><dd>01.01.2027<small>демо</small></dd></div>
        </dl>
      </section>

      <section className="tc-shell tc-sec" aria-labelledby="tc-invoice">
        <div className="tc-invoice">
          <div className="tc-invoice__head">
            <div>
              <p className="tc-label">Текущий счёт</p>
              <h2 className="tc-h2" id="tc-invoice">Счёт № {demoInvoice.number}</h2>
              <p className="tc-row__meta">{demoInvoice.period} · выставлен {demoInvoice.issued} · оплатить до{N}{demoInvoice.due}</p>
            </div>
            <StatusMark status={demoInvoice.status} />
          </div>
          <table className="tc-table tc-table--lines">
            <caption className="sr-only">Начисления по счёту {demoInvoice.number}</caption>
            <thead><tr><th scope="col">Начисление</th><th scope="col" className="is-num">Сумма</th></tr></thead>
            <tbody>
              {demoInvoice.lines.map((line) => (
                <tr key={line.key}><th scope="row">{line.label}<small>{line.note}</small></th><td className="is-num" data-label="Сумма">{mdl(line.amount)}</td></tr>
              ))}
            </tbody>
            <tfoot><tr><th scope="row">Итого к оплате</th><td className="is-num" data-label="Итого">{mdl(demoInvoiceTotal)}</td></tr></tfoot>
          </table>
          <div className="tc-pay__actions">
            <DemoAction className="btn">Скачать счёт</DemoAction>
            <a className="tc-link" href="#history">История начислений ↓</a>
          </div>
        </div>
      </section>

      <section className="tc-shell tc-sec" id="history" aria-labelledby="tc-history">
        <h2 className="tc-h2" id="tc-history">История начислений</h2>
        <table className="tc-table tc-table--stack">
          <caption className="sr-only">История начислений, демо</caption>
          <thead><tr><th scope="col">Период</th><th scope="col">Счёт</th><th scope="col" className="is-num">Аренда</th><th scope="col" className="is-num">Коммунальные</th><th scope="col" className="is-num">Прочие</th><th scope="col" className="is-num">Итого</th><th scope="col">Оплата</th></tr></thead>
          <tbody>
            {demoHistory.map((row) => (
              <tr key={row.invoice}>
                <th scope="row">{row.period}</th>
                <td data-label="Счёт">{row.invoice}</td>
                <td className="is-num" data-label="Аренда">{mdl(row.rent)}</td>
                <td className="is-num" data-label="Коммунальные">{mdl(row.utilities)}</td>
                <td className="is-num" data-label="Прочие">{mdl(row.other)}</td>
                <td className="is-num is-strong" data-label="Итого">{mdl(row.total)}</td>
                <td data-label="Оплата"><span className="tc-paid"><StatusMark status="Оплачено" /><span className="tc-row__meta">{row.paid}</span></span></td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="tc-note">{demoNote}</p>
      </section>
    </CabinetShell>
  );
}

// ── DOCUMENTS ──────────────────────────────────────────────────────────────────────────────────────────────────────────────
export function DocumentsScreen() {
  return (
    <CabinetShell active="documents">
      <section className="tc-shell tc-sec tc-sec--first">
        <CabinetHeading label={`${demoMeta.property} · ${demoMeta.contract}`} title="Документы" lead={`Договор, соглашения, счета, акты и${N}правила объекта в${N}одном месте.`} />
        <DocumentsTable documents={demoDocuments} categories={[...demoDocCategories]} />
        <p className="tc-note">{`Демо-документы: файлы в${N}прототипе не${N}формируются, реальных договоров здесь нет.`}</p>
      </section>
    </CabinetShell>
  );
}

// ── REQUESTS ───────────────────────────────────────────────────────────────────────────────────────────────────────────────
export function RequestsScreen() {
  return (
    <CabinetShell active="requests">
      <section className="tc-shell tc-sec tc-sec--first">
        <CabinetHeading label={`${demoMeta.property} · сервисная служба`} title="Обращения" lead={`Неисправность, доступ, парковка или${N}вопрос по${N}объекту — с${N}понятным статусом и${N}ответственной службой.`}>
          <Link className="btn" href={demoHref("/requests/new")}>Создать обращение</Link>
        </CabinetHeading>
        <ul className="tc-legend" aria-label="Статусы обращений">
          {demoStatuses.map((status) => (
            <li key={status}><StatusMark status={status} /><span className="tc-legend__n">{count(status)}</span></li>
          ))}
        </ul>
        <ul className="tc-requests">
          {demoRequests.map((r) => (
            <li key={r.number}>
              <details className="tc-request" open={r.status === "В работе"}>
                <summary>
                  <span className="tc-row__main">
                    <span className="tc-row__title">{r.title}</span>
                    <span className="tc-row__meta">{r.number} · {r.category} · создано {r.created} · ответственный: {r.owner}</span>
                  </span>
                  <StatusMark status={r.status} />
                </summary>
                <ol className="tc-steps">
                  {r.steps.map((step) => (
                    <li key={`${step.date}-${step.status}`}><span className="tc-steps__date">{step.date}</span><StatusMark status={step.status} /><span className="tc-steps__text">{step.text}</span></li>
                  ))}
                </ol>
              </details>
            </li>
          ))}
        </ul>
        <p className="tc-note">{`Ответственный — служба объекта, не${N}сотрудник. Обращения и${N}даты — демо.`}</p>
      </section>
    </CabinetShell>
  );
}

export function NewRequestScreen() {
  return (
    <CabinetShell active="requests">
      <section className="tc-shell tc-sec tc-sec--first">
        <CabinetHeading label={`${demoMeta.property} · обращения`} title="Создать обращение" lead={`Опишите, что случилось, и${N}приложите фото — так служба быстрее поймёт задачу.`} />
        <RequestForm categories={[...demoRequestCategories]} back={demoHref("/requests")} />
      </section>
    </CabinetShell>
  );
}

// ── UTILITIES ──────────────────────────────────────────────────────────────────────────────────────────────────────────────
const num = (n: number) => n.toLocaleString("ru-RU").replace(/\s/g, N);
export function UtilitiesScreen() {
  return (
    <CabinetShell active="utilities">
      <section className="tc-shell tc-sec tc-sec--first">
        <CabinetHeading label={`${demoMeta.property} · DEMO-01`} title="Коммунальные и показания" lead={`Показания счётчиков за${N}два последних периода.`} />
        <table className="tc-table tc-table--stack tc-table--meters">
          <caption className="sr-only">Показания счётчиков, демо</caption>
          <thead><tr><th scope="col">Ресурс</th><th scope="col" className="is-num">{demoMeters.previous}</th><th scope="col" className="is-num">{demoMeters.current}</th><th scope="col" className="is-num">Изменение</th></tr></thead>
          <tbody>
            {demoMeters.rows.map((row) => {
              const diff = Math.round((row.current - row.previous) * 10) / 10;
              const pct = ((row.current - row.previous) / row.previous) * 100;
              return (
                <tr key={row.key}>
                  <th scope="row">{row.label}{row.note ? <small>{row.note}</small> : null}</th>
                  <td className="is-num" data-label={demoMeters.previous}>{num(row.previous)}{N}{row.unit}</td>
                  <td className="is-num is-strong" data-label={demoMeters.current}>{num(row.current)}{N}{row.unit}</td>
                  <td className="is-num" data-label="Изменение">{diff > 0 ? "+" : ""}{num(diff)}{N}{row.unit} · {pct > 0 ? "+" : ""}{pct.toFixed(1).replace(".", ",")}{N}%</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <p className="tc-note">{`Показания — демо. В${N}рабочей версии их вносит техническая служба или арендатор по${N}фото счётчика; начисления попадают в${N}счёт следующего месяца.`}</p>
      </section>
    </CabinetShell>
  );
}

// ── PROPERTY ───────────────────────────────────────────────────────────────────────────────────────────────────────────────
export function PropertyScreen() {
  return (
    <CabinetShell active="property">
      <section className="tc-shell tc-sec tc-sec--first">
        <CabinetHeading label={demoMeta.tenant} title="Мой объект" lead={demoMeta.address} />
        <dl className="tc-sheet">
          {demoProperty.rows.map((row) => (
            <div key={row.label}><dt>{row.label}</dt><dd>{row.value}{row.note ? <small>{row.note}</small> : null}</dd></div>
          ))}
        </dl>
        <p className="tc-note">{`Экономика договора — ставка, сроки и${N}условия — в${N}демо не${N}показывается.`}</p>
      </section>
      <section className="tc-shell tc-sec tc-two">
        <div>
          <h2 className="tc-h2">Техническая информация</h2>
          <dl className="tc-sheet tc-sheet--compact">
            {demoProperty.technical.map((row) => (
              <div key={row.label}><dt>{row.label}</dt><dd>{row.value}</dd></div>
            ))}
          </dl>
        </div>
        <div>
          <div className="tc-sec__head"><h2 className="tc-h2">Сервисные контакты</h2><Link className="tc-link" href={demoHref("/contacts")}>Все контакты →</Link></div>
          <ul className="tc-rows">
            {demoContacts.map((c) => (
              <li key={c.key} className="tc-row"><span className="tc-row__main"><span className="tc-row__title">{c.role}</span><span className="tc-row__meta">{c.text}</span></span></li>
            ))}
          </ul>
        </div>
      </section>
    </CabinetShell>
  );
}

// ── CONTACTS ───────────────────────────────────────────────────────────────────────────────────────────────────────────────
export function ContactsScreen() {
  const email = company.email.value.ru;
  return (
    <CabinetShell active="contacts">
      <section className="tc-shell tc-sec tc-sec--first">
        <CabinetHeading label={`${demoMeta.property} · службы объекта`} title="Контакты" lead={`Роли, а${N}не${N}имена: обращение попадает в${N}нужную службу.`} />
        <ul className="tc-contacts">
          {demoContacts.map((c) => (
            <li key={c.key} className={`tc-contact${c.key === "emergency" ? " is-emergency" : ""}`}>
              <h2 className="tc-contact__role">{c.role}</h2>
              <p className="tc-contact__text">{c.text}</p>
              <p className="tc-contact__links">
                {c.key === "emergency" ? (
                  <>
                    <a href={contactLinks.mobile}>{company.mobile.value.ru}</a>
                    <a href={contactLinks.landline}>{company.landline.value.ru}</a>
                  </>
                ) : (
                  <>
                    <a href={contactLinks.email}>{email}</a>
                    <a href={contactLinks.mobile}>{company.mobile.value.ru}</a>
                  </>
                )}
              </p>
            </li>
          ))}
        </ul>
        <p className="tc-note">{`В${N}демо все роли ведут на${N}общие публичные контакты MEGAPARC. Прямые линии служб и${N}аварийный номер — после запуска кабинета.`}</p>
      </section>
    </CabinetShell>
  );
}
