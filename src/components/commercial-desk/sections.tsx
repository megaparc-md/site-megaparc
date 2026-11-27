"use client";

import { useMemo, useState, type CSSProperties, type FormEvent, type ReactNode } from "react";
import { StageChip, StatusChip, type Ctx } from "@/components/commercial-desk/cards";
import { clientTitle, dayLong, dayNumeric, dayRelative, dayShort, minutesLabel, percent, propertyLabel, roleLabel, sourceLabel, stageLabel, staffName, stamp, statusLabel, weekdayLabel, whenOf } from "@/components/commercial-desk/labels";
import { addBlock, clock, confirmVisit, removeBlock, resetState, snapshotOf, updateConfig, updateStaff, type DemoVisit, type DeskState } from "@/components/visit-planner/store";
import { commit } from "@/components/visit-planner/use-store";
import { addDays, analytics, fromMinutes, isHoliday, onTimeOff, slotsForDate, toMinutes, toZoned, weekdayOf, type DealStage, type Interval, type LocalDate, type Weekday } from "@/lib/visits/engine";

/**
 * COMMERCIAL DESK — the sections (OWNER «VISIT PLANNER & COMMERCIAL DESK V1», stage 1). Rows and hairlines, the tone of a
 * property-service cabinet — never a SaaS dashboard. Every list is derived from the one record; nothing is typed twice.
 */
const todayOf = (ctx: Ctx) => toZoned(ctx.now, ctx.state.config.timezone).date;
const byStart = (a: DemoVisit, b: DemoVisit) => a.startUtc - b.startUtc;

function VisitRow({ ctx, visit, quick = false }: { ctx: Ctx; visit: DemoVisit; quick?: boolean }) {
  const { state } = ctx;
  const client = state.clients.find((item) => item.id === visit.clientId);
  const when = whenOf(state, visit);
  return (
    <li className="cd-line">
      <button type="button" className="cd-row" onClick={() => ctx.open({ visit: visit.id })}>
        <span className="cd-row__time"><b>{when.time}</b><span>{dayRelative(when.date, todayOf(ctx))}</span></span>
        <span className="cd-row__main">{client ? clientTitle(client) : "—"}</span>
        <span className="cd-row__meta">{propertyLabel[visit.propertyId] ?? visit.propertyId} · {staffName(state, visit.staffId)} · {visit.ref}</span>
        <StatusChip status={visit.status} />
      </button>
      {quick && visit.status === "requested" && ctx.may("visit.confirm") ? <button type="button" className="btn vp-btn cd-line__quick" onClick={() => commit(confirmVisit(state, visit.id, ctx.actor.id, clock()))}><span>Подтвердить</span></button> : null}
    </li>
  );
}

function Empty({ text }: { text: string }) {
  return <p className="cd-empty">{text}</p>;
}

function Head({ label, title, lead, children }: { label: string; title: string; lead?: string; children?: ReactNode }) {
  return (
    <header className="cd-head">
      <div>
        <p className="cd-label">{label}</p>
        <h1 className="cd-title">{title}</h1>
        {lead ? <p className="cd-lead">{lead}</p> : null}
      </div>
      {children ? <div className="cd-head__aside">{children}</div> : null}
    </header>
  );
}

/* ---------- Сегодня ---------- */
export function Today({ ctx }: { ctx: Ctx }) {
  const { state } = ctx;
  const today = todayOf(ctx);
  const day = state.visits.filter((visit) => whenOf(state, visit).date === today && ["requested", "confirmed", "completed", "no_show"].includes(visit.status)).sort(byStart);
  const requests = state.visits.filter((visit) => visit.status === "requested").sort(byStart);
  const enquiries = state.enquiries.filter((item) => !item.handled);
  const due = state.clients.filter((client) => client.nextAction && toZoned(client.nextAction.dueUtc, state.config.timezone).date <= today).sort((a, b) => (a.nextAction?.dueUtc ?? 0) - (b.nextAction?.dueUtc ?? 0));
  const awaiting = state.visits.filter((visit) => visit.status === "confirmed" && visit.endUtc < ctx.now);
  return (
    <>
      <Head label="Сегодня" title={dayLong(today)} lead="Что требует решения сейчас и что запланировано на день.">
        {ctx.may("visit.create") ? <button type="button" className="btn vp-btn" onClick={() => ctx.open({ create: "new" })}><span>Новый визит</span></button> : null}
      </Head>
      <ul className="cd-kpis">
        <li><b>{requests.length}</b><span>заявок ждут подтверждения</span></li>
        <li><b>{day.length}</b><span>визитов сегодня</span></li>
        <li><b>{enquiries.length}</b><span>обращений без визита</span></li>
        <li><b>{due.length}</b><span>действий к сроку</span></li>
      </ul>
      <div className="cd-cols">
        <section className="cd-block">
          <h2 className="cd-block__title">Расписание дня</h2>
          {day.length ? <ul className="cd-rows">{day.map((visit) => <VisitRow key={visit.id} ctx={ctx} visit={visit} />)}</ul> : <Empty text="На сегодня визитов нет." />}
          {awaiting.length ? (
            <>
              <h2 className="cd-block__title">Ждут результата просмотра</h2>
              <ul className="cd-rows">{awaiting.map((visit) => <VisitRow key={visit.id} ctx={ctx} visit={visit} />)}</ul>
            </>
          ) : null}
        </section>
        <section className="cd-block">
          <h2 className="cd-block__title">Требуют решения</h2>
          {requests.length ? <ul className="cd-rows">{requests.map((visit) => <VisitRow key={visit.id} ctx={ctx} visit={visit} quick />)}</ul> : <Empty text="Новых заявок нет." />}
          <h2 className="cd-block__title">Следующие действия</h2>
          {due.length ? (
            <ul className="cd-rows">
              {due.map((client) => (
                <li key={client.id} className="cd-line"><button type="button" className="cd-row" onClick={() => ctx.open({ client: client.id })}><span className="cd-row__main">{client.nextAction?.text}</span><span className="cd-row__meta">{clientTitle(client)} · {dayRelative(toZoned(client.nextAction?.dueUtc ?? 0, state.config.timezone).date, today)} · {staffName(state, client.ownerId)}</span></button></li>
              ))}
            </ul>
          ) : <Empty text="К сегодняшнему дню действий нет." />}
        </section>
      </div>
    </>
  );
}

/* ---------- Календарь ---------- */
export function WeekCalendar({ ctx }: { ctx: Ctx }) {
  const { state } = ctx;
  const today = todayOf(ctx);
  const monday = (date: LocalDate) => addDays(date, 1 - weekdayOf(date));
  const [start, setStart] = useState<LocalDate>(monday(today));
  const [staffId, setStaffId] = useState("");
  const snapshot = useMemo(() => snapshotOf(state), [state]);
  const workdays = ([1, 2, 3, 4, 5, 6, 7] as Weekday[]).filter((day) => state.config.week[day]?.length);
  const days = workdays.map((day) => addDays(start, day - 1));
  const times = useMemo(() => {
    const set = new Set<string>();
    for (const day of workdays) for (const hours of state.config.week[day] ?? []) for (let m = toMinutes(hours.from); m <= toMinutes(hours.to) - state.config.visitMinutes; m += state.config.stepMinutes) set.add(fromMinutes(m));
    return [...set].sort();
  }, [state.config, workdays]);
  const conductors = state.staff.filter((person) => person.conducts && person.active);
  const cell = (date: LocalDate, time: string) => {
    const visits = state.visits.filter((visit) => { const when = whenOf(state, visit); return when.date === date && when.time === time && ["requested", "confirmed", "completed", "no_show"].includes(visit.status) && (!staffId || visit.staffId === staffId); });
    const block = state.blocks.find((item) => item.date === date && toMinutes(item.from) <= toMinutes(time) && toMinutes(time) < toMinutes(item.to) && (!staffId || item.staffId === null || item.staffId === staffId));
    const free = slotsForDate(snapshot, "moscova-20", date, ctx.now, { internal: true, staffId: staffId || undefined }).some((slot) => slot.time === time);
    return { visits, block, free };
  };
  return (
    <>
      <Head label="Календарь" title={`${dayShort(days[0])} — ${dayShort(days[days.length - 1])}`} lead="Визиты, свободное время, блокировки и отсутствия. Время — по Кишинэу.">
        <div className="cd-tools">
          <button type="button" className="cd-nav" onClick={() => setStart(addDays(start, -7))} aria-label="Предыдущая неделя">←</button>
          <button type="button" className="cd-nav cd-nav--text" onClick={() => setStart(monday(today))}>Эта неделя</button>
          <button type="button" className="cd-nav" onClick={() => setStart(addDays(start, 7))} aria-label="Следующая неделя">→</button>
          <select className="cd-select" value={staffId} onChange={(event) => setStaffId(event.target.value)} aria-label="Сотрудник">
            <option value="">Все сотрудники</option>
            {conductors.map((person) => <option key={person.id} value={person.id}>{person.name}</option>)}
          </select>
        </div>
      </Head>
      <div className="cd-week" style={{ "--cd-days": days.length } as CSSProperties}>
        <div className="cd-week__corner" aria-hidden="true" />
        {days.map((date) => {
          const holiday = isHoliday(state.config, date);
          const away = conductors.filter((person) => onTimeOff(person, date));
          return (
            <div key={date} className={`cd-week__day${date === today ? " is-today" : ""}`}>
              <b>{dayShort(date)}</b>
              {holiday ? <span className="cd-week__note">Праздник · {holiday.name}</span> : null}
              {away.map((person) => <span key={person.id} className="cd-week__note">Отсутствует: {person.name}</span>)}
            </div>
          );
        })}
        {times.map((time) => (
          <div key={time} className="cd-week__row">
            <div className="cd-week__time">{time}</div>
            {days.map((date) => {
              const { visits, block, free } = cell(date, time);
              return (
                <div key={date} className="cd-week__cell" data-day={dayShort(date)}>
                  {visits.map((visit) => { const client = state.clients.find((item) => item.id === visit.clientId); return (
                    <button key={visit.id} type="button" className={`cd-event is-${visit.status}`} onClick={() => ctx.open({ visit: visit.id })}>
                      <b>{time} · {client?.company || client?.name}</b>
                      <span>{staffName(state, visit.staffId)} · {statusLabel[visit.status]}</span>
                    </button>
                  ); })}
                  {!visits.length && block ? <span className="cd-event is-block"><b>Закрыто</b><span>{block.reason || "блокировка"}</span></span> : null}
                  {!visits.length && !block && free && ctx.may("visit.create") ? <button type="button" className="cd-free" onClick={() => ctx.open({ create: "new" })} aria-label={`Свободно ${dayShort(date)} ${time} — создать визит`}>свободно</button> : null}
                </div>
              );
            })}
          </div>
        ))}
      </div>
      {/* phones: the same week as an agenda — a day, its visits, its closed time, what is still free */}
      <div className="cd-agenda">
        {days.map((date) => {
          const holiday = isHoliday(state.config, date);
          const cells = times.map((time) => ({ time, ...cell(date, time) }));
          const free = cells.filter((item) => !item.visits.length && !item.block && item.free).map((item) => item.time);
          return (
            <section key={date} className={`cd-agenda__day${date === today ? " is-today" : ""}`}>
              <h2>{dayLong(date)}</h2>
              {holiday ? <p className="cd-muted">Праздник · {holiday.name}</p> : null}
              {conductors.filter((person) => onTimeOff(person, date)).map((person) => <p key={person.id} className="cd-muted">Отсутствует: {person.name}</p>)}
              {cells.flatMap((item) => item.visits.map((visit) => { const client = state.clients.find((other) => other.id === visit.clientId); return (
                <button key={visit.id} type="button" className={`cd-event is-${visit.status}`} onClick={() => ctx.open({ visit: visit.id })}>
                  <b>{item.time} · {client?.company || client?.name}</b>
                  <span>{staffName(state, visit.staffId)} · {statusLabel[visit.status]}</span>
                </button>
              ); }))}
              {cells.filter((item) => !item.visits.length && item.block).map((item) => <span key={item.time} className="cd-event is-block"><b>{item.time} · закрыто</b><span>{item.block?.reason || "блокировка"}</span></span>)}
              {free.length ? <p className="cd-agenda__free">Свободно: {free.join(" · ")}</p> : !cells.some((item) => item.visits.length) ? <p className="cd-muted">Свободного времени нет.</p> : null}
            </section>
          );
        })}
      </div>
    </>
  );
}

/* ---------- Новые обращения ---------- */
export function Requests({ ctx }: { ctx: Ctx }) {
  const { state } = ctx;
  const requests = state.visits.filter((visit) => visit.status === "requested").sort(byStart);
  const enquiries = state.enquiries.filter((item) => !item.handled).sort((a, b) => b.at - a.at);
  return (
    <>
      <Head label="Новые обращения" title="Заявки и обращения" lead="Заявки с сайта ждут подтверждения; обращения из чата, Telegram и звонков — превращаются в визит или карточку клиента." />
      <section className="cd-block">
        <h2 className="cd-block__title">Заявки на просмотр · {requests.length}</h2>
        {requests.length ? <ul className="cd-rows">{requests.map((visit) => <VisitRow key={visit.id} ctx={ctx} visit={visit} quick />)}</ul> : <Empty text="Все заявки обработаны." />}
      </section>
      <section className="cd-block">
        <h2 className="cd-block__title">Обращения без визита · {enquiries.length}</h2>
        {enquiries.length ? (
          <ul className="cd-rows">
            {enquiries.map((item) => (
              <li key={item.id} className="cd-line">
                <div className="cd-row is-static">
                  <span className="cd-row__main">{item.title}</span>
                  <span className="cd-row__meta">{sourceLabel[item.channel]} · {stamp(state, item.at)} · {item.excerpt}</span>
                </div>
                {ctx.may("visit.create") ? <button type="button" className="btn btn--ghost vp-btn cd-line__quick" onClick={() => ctx.open({ create: item.id })}><span>Создать визит</span></button> : null}
              </li>
            ))}
          </ul>
        ) : <Empty text="Обращений без визита нет." />}
      </section>
    </>
  );
}

/* ---------- Запланированные визиты ---------- */
export function Visits({ ctx }: { ctx: Ctx }) {
  const { state } = ctx;
  const [tab, setTab] = useState<"upcoming" | "past" | "closed">("upcoming");
  const lists = {
    upcoming: state.visits.filter((visit) => ["requested", "confirmed"].includes(visit.status) && visit.endUtc >= ctx.now).sort(byStart),
    past: state.visits.filter((visit) => ["completed", "no_show"].includes(visit.status) || (visit.status === "confirmed" && visit.endUtc < ctx.now)).sort((a, b) => b.startUtc - a.startUtc),
    closed: state.visits.filter((visit) => ["cancelled", "declined"].includes(visit.status)).sort((a, b) => b.startUtc - a.startUtc),
  };
  const tabs = [["upcoming", "Предстоящие"], ["past", "Прошедшие"], ["closed", "Отменённые"]] as const;
  return (
    <>
      <Head label="Запланированные визиты" title="Визиты">
        {ctx.may("visit.create") ? <button type="button" className="btn vp-btn" onClick={() => ctx.open({ create: "new" })}><span>Новый визит</span></button> : null}
      </Head>
      <div className="cd-tabs" role="tablist">{tabs.map(([key, label]) => <button key={key} type="button" role="tab" aria-selected={tab === key} className={tab === key ? "is-on" : ""} onClick={() => setTab(key)}>{label} · {lists[key].length}</button>)}</div>
      {lists[tab].length ? <ul className="cd-rows">{lists[tab].map((visit) => <VisitRow key={visit.id} ctx={ctx} visit={visit} quick={tab === "upcoming"} />)}</ul> : <Empty text="Здесь пока пусто." />}
    </>
  );
}

/* ---------- Клиенты ---------- */
export function Clients({ ctx }: { ctx: Ctx }) {
  const { state } = ctx;
  const [query, setQuery] = useState("");
  const today = todayOf(ctx);
  const list = state.clients.filter((client) => `${client.name} ${client.company} ${client.phone} ${client.email}`.toLowerCase().includes(query.trim().toLowerCase())).sort((a, b) => b.createdAt - a.createdAt);
  return (
    <>
      <Head label="Клиенты" title="Потенциальные арендаторы" lead="Одна карточка на клиента — где бы он ни обратился: сайт, чат, Telegram, звонок.">
        {ctx.may("visit.create") ? <button type="button" className="btn vp-btn" onClick={() => ctx.open({ create: "new" })}><span>Новый клиент</span></button> : null}
      </Head>
      <label className="cd-search"><span className="cd-label">Поиск</span><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Имя, компания, телефон или e-mail" /></label>
      {list.length ? (
        <ul className="cd-rows">
          {list.map((client) => (
            <li key={client.id} className="cd-line">
              <button type="button" className="cd-row" onClick={() => ctx.open({ client: client.id })}>
                <span className="cd-row__main">{clientTitle(client)}</span>
                <span className="cd-row__meta">{sourceLabel[client.source]} · {staffName(state, client.ownerId)}{client.nextAction ? ` · далее: ${client.nextAction.text} (${dayRelative(toZoned(client.nextAction.dueUtc, state.config.timezone).date, today)})` : ""}</span>
                <StageChip stage={client.stage} />
              </button>
            </li>
          ))}
        </ul>
      ) : <Empty text="Никого не найдено." />}
    </>
  );
}

/* ---------- Переговоры ---------- */
export function Deals({ ctx }: { ctx: Ctx }) {
  const { state } = ctx;
  const today = todayOf(ctx);
  const columns: DealStage[] = ["visit_planned", "visited", "offer_sent", "negotiation", "won", "lost"];
  return (
    <>
      <Head label="Переговоры" title="От просмотра до договора" lead="Этап меняется действиями: визит, результат просмотра, коммерческое предложение, завершение переговоров." />
      <div className="cd-board">
        {columns.map((stage) => {
          const items = state.clients.filter((client) => client.stage === stage);
          return (
            <section key={stage} className={`cd-board__col is-${stage}`}>
              <h2 className="cd-board__title">{stageLabel[stage]} <span>{items.length}</span></h2>
              {items.map((client) => (
                <button key={client.id} type="button" className="cd-deal" onClick={() => ctx.open({ client: client.id })}>
                  <b>{client.company || client.name}</b>
                  <span>{client.company ? client.name : sourceLabel[client.source]}</span>
                  <span>{staffName(state, client.ownerId)}</span>
                  {client.nextAction ? <em>Далее: {client.nextAction.text} · {dayRelative(toZoned(client.nextAction.dueUtc, state.config.timezone).date, today)}</em> : null}
                  {client.lostReason ? <em>{client.lostReason}</em> : null}
                </button>
              ))}
              {!items.length ? <p className="cd-muted">—</p> : null}
            </section>
          );
        })}
      </div>
    </>
  );
}

/* ---------- История взаимодействий ---------- */
export function History({ ctx }: { ctx: Ctx }) {
  const { state } = ctx;
  const [only, setOnly] = useState<"all" | "client" | "staff">("all");
  const events = [...state.events].sort((a, b) => b.at - a.at).filter((event) => only === "all" || (only === "client" ? event.actor === "client" : event.actor !== "client" && event.actor !== "system")).slice(0, 120);
  return (
    <>
      <Head label="История взаимодействий" title="Журнал" lead={ctx.may("audit.read") ? "Все действия клиентов и сотрудников. Журнал действий сотрудников неизменяем." : "Действия клиентов и сотрудников по визитам и карточкам."} />
      <div className="cd-tabs" role="tablist">{([["all", "Все"], ["client", "Клиенты"], ["staff", "Сотрудники"]] as const).map(([key, label]) => <button key={key} type="button" role="tab" aria-selected={only === key} className={only === key ? "is-on" : ""} onClick={() => setOnly(key)}>{label}</button>)}</div>
      <ol className="cd-timeline cd-timeline--wide">
        {events.map((event) => {
          const client = state.clients.find((item) => item.id === event.clientId);
          return (
            <li key={event.id} className={event.internal ? "is-internal" : ""}>
              <p className="cd-timeline__meta">{stamp(state, event.at)} · {staffName(state, event.actor)}{event.internal ? <span className="cd-internal">внутреннее</span> : null}</p>
              <p className="cd-timeline__text">{event.text}{client ? <> — <button type="button" className="cd-link" onClick={() => ctx.open(event.visitId ? { visit: event.visitId } : { client: client.id })}>{clientTitle(client)}</button></> : null}</p>
            </li>
          );
        })}
      </ol>
    </>
  );
}

/* ---------- Аналитика ---------- */
export function Analytics({ ctx }: { ctx: Ctx }) {
  const { state } = ctx;
  const [days, setDays] = useState(30);
  const from = ctx.now - days * 86_400_000;
  const data = useMemo(() => analytics(
    state.visits.map((visit) => ({ propertyId: visit.propertyId, staffId: visit.staffId, status: visit.status, source: visit.source, createdAt: visit.createdAt, firstResponseAt: visit.firstResponseAt, startUtc: visit.startUtc })),
    state.clients.map((client) => ({ propertyId: client.propertyId, ownerId: client.ownerId, stage: client.stage, source: client.source, createdAt: client.createdAt, offers: state.offers.filter((offer) => offer.clientId === client.id).length })),
    from, ctx.now + 1,
  ), [state, from, ctx.now]);
  const funnel: [string, number][] = [["Обращения", data.enquiries], ["Запланированные визиты", data.planned], ["Подтверждённые", data.confirmed], ["Состоявшиеся просмотры", data.held], ["Коммерческие предложения", data.offers], ["Договоры аренды", data.leases]];
  const top = Math.max(1, ...funnel.map(([, value]) => value));
  const exportCsv = () => {
    const rows: (string | number)[][] = [
      ["MEGAPARC · Visit Planner · управленческий отчёт (ДЕМО — тестовые данные)"], ["Период, дней", days], ["Сформировано", stamp(state, clock())], [],
      ["Показатель", "Значение"], ...funnel, ["Отмены", data.cancelled], ["Неявки", data.noShow], ["Конверсия в договор", percent(data.conversion)], ["Медиана времени реакции, мин", data.responseMinutes ?? ""], [],
      ["Объект", "Обращения", "Состоялось", "Договоры"], ...Object.entries(data.byProperty).map(([id, row]) => [propertyLabel[id] ?? id, row.enquiries, row.held, row.leases]), [],
      ["Сотрудник", "Визиты", "Состоялось", "Договоры", "Медиана реакции, мин"], ...Object.entries(data.byStaff).map(([id, row]) => [staffName(state, id), row.visits, row.held, row.leases, row.responseMinutes ?? ""]), [],
      ["Источник", "Обращения"], ...Object.entries(data.bySource).map(([id, value]) => [sourceLabel[id as keyof typeof sourceLabel] ?? id, value]),
    ];
    const csv = String.fromCharCode(0xfeff) + rows.map((row) => row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(";")).join("\r\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `MEGAPARC-visit-report-DEMO-${dayNumeric(todayOf(ctx))}.csv`;
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 2000);
  };
  return (
    <>
      <Head label="Аналитика" title="Управленческие показатели" lead="Считаются из тех же записей, что и кабинет — отдельной отчётности нет.">
        <div className="cd-tools">
          <select className="cd-select" value={days} onChange={(event) => setDays(Number(event.target.value))} aria-label="Период"><option value={7}>7 дней</option><option value={30}>30 дней</option><option value={90}>90 дней</option></select>
          {ctx.may("analytics.export") ? <button type="button" className="btn btn--ghost vp-btn" onClick={exportCsv}><span>Экспорт отчёта · CSV</span></button> : null}
        </div>
      </Head>
      <ul className="cd-kpis cd-kpis--six">
        <li><b>{data.enquiries}</b><span>обращений</span></li>
        <li><b>{data.held}</b><span>состоявшихся просмотров</span></li>
        <li><b>{data.cancelled}</b><span>отмен</span></li>
        <li><b>{data.noShow}</b><span>неявок</span></li>
        <li><b>{percent(data.conversion)}</b><span>конверсия в договор</span></li>
        <li><b>{minutesLabel(data.responseMinutes)}</b><span>медиана реакции сотрудника</span></li>
      </ul>
      <div className="cd-cols">
        <section className="cd-block">
          <h2 className="cd-block__title">Воронка</h2>
          <ul className="cd-funnel">{funnel.map(([label, value]) => <li key={label}><span>{label}</span><i style={{ width: `${(value / top) * 100}%` }} aria-hidden="true" /><b>{value}</b></li>)}</ul>
        </section>
        <section className="cd-block">
          <h2 className="cd-block__title">Источники обращений</h2>
          <table className="cd-table"><tbody>{Object.entries(data.bySource).sort((a, b) => b[1] - a[1]).map(([id, value]) => <tr key={id}><th scope="row">{sourceLabel[id as keyof typeof sourceLabel] ?? id}</th><td>{value}</td></tr>)}</tbody></table>
          <h2 className="cd-block__title">Объекты</h2>
          <table className="cd-table"><thead><tr><th scope="col">Объект</th><th scope="col">Обращения</th><th scope="col">Просмотры</th><th scope="col">Договоры</th></tr></thead><tbody>{Object.entries(data.byProperty).map(([id, row]) => <tr key={id}><th scope="row">{propertyLabel[id] ?? id}</th><td>{row.enquiries}</td><td>{row.held}</td><td>{row.leases}</td></tr>)}</tbody></table>
        </section>
      </div>
      <section className="cd-block">
        <h2 className="cd-block__title">Сотрудники</h2>
        <table className="cd-table"><thead><tr><th scope="col">Сотрудник</th><th scope="col">Визиты</th><th scope="col">Состоялось</th><th scope="col">Договоры</th><th scope="col">Медиана реакции</th></tr></thead><tbody>{Object.entries(data.byStaff).map(([id, row]) => <tr key={id}><th scope="row">{staffName(state, id)}</th><td>{row.visits}</td><td>{row.held}</td><td>{row.leases}</td><td>{minutesLabel(row.responseMinutes)}</td></tr>)}</tbody></table>
      </section>
    </>
  );
}

/* ---------- Расписание: параметры на согласование ---------- */
const hoursText = (hours: Interval[] | undefined) => (hours ?? []).map((item) => `${item.from}–${item.to}`).join(", ");
const parseHours = (text: string): Interval[] | null => {
  const out: Interval[] = [];
  for (const part of text.split(",").map((item) => item.trim()).filter(Boolean)) {
    const match = part.match(/^(\d{1,2}):(\d{2})\s*[–—-]\s*(\d{1,2}):(\d{2})$/);
    if (!match) return null;
    const from = `${match[1].padStart(2, "0")}:${match[2]}`, to = `${match[3].padStart(2, "0")}:${match[4]}`;
    if (toMinutes(to) <= toMinutes(from) || toMinutes(to) > 24 * 60) return null;
    out.push({ from, to });
  }
  return out;
};

export function Schedule({ ctx }: { ctx: Ctx }) {
  const { state, actor } = ctx;
  const edit = ctx.may("schedule.edit");
  const manage = ctx.may("staff.manage");
  const today = todayOf(ctx);
  const [error, setError] = useState("");
  const at = clock;
  const number = (key: "visitMinutes" | "stepMinutes" | "bufferMinutes" | "minNoticeHours" | "horizonDays" | "propertyCapacity", label: string, unit: string, min: number, max: number, step = 1) => (
    <label className="cd-field cd-param">
      <span>{label}</span>
      <span className="cd-param__box"><input type="number" min={min} max={max} step={step} value={state.config[key]} disabled={!edit} onChange={(event) => { const value = Number(event.target.value); if (Number.isFinite(value) && value >= min && value <= max) commit(updateConfig(state, { [key]: value }, actor.id, at())); }} /><em>{unit}</em></span>
    </label>
  );
  const setHours = (day: Weekday, text: string) => {
    const parsed = parseHours(text);
    if (!parsed) return setError(`Часы «${text}» не распознаны. Формат: 09:00–13:00, 14:00–17:00.`);
    setError("");
    const week = { ...state.config.week };
    if (parsed.length) week[day] = parsed; else delete week[day];
    commit(updateConfig(state, { week }, actor.id, at()));
  };
  const addHoliday = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const date = String(data.get("date") ?? ""), name = String(data.get("name") ?? "").trim();
    if (!date) return;
    commit(updateConfig(state, { holidays: [...state.config.holidays.filter((item) => item.date !== date), { date, name: name || "Нерабочий день" }].sort((a, b) => a.date.localeCompare(b.date)) }, actor.id, at()));
    event.currentTarget.reset();
  };
  const addOff = (staffId: string) => (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const from = String(data.get("from") ?? ""), to = String(data.get("to") ?? "") || from;
    if (!from || to < from) return;
    const person = state.staff.find((item) => item.id === staffId);
    if (!person) return;
    commit(updateStaff(state, staffId, { timeOff: [...person.timeOff, { from, to, reason: String(data.get("reason") ?? "").trim() || "Отсутствие" }] }, actor.id, at()));
    event.currentTarget.reset();
  };
  const addManualBlock = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const date = String(data.get("date") ?? ""), from = String(data.get("from") ?? ""), to = String(data.get("to") ?? ""), who = String(data.get("who") ?? "");
    if (!date || !from || !to || to <= from) return setError("Укажите день и интервал блокировки (конец позже начала).");
    setError("");
    commit(addBlock(state, { propertyId: who ? null : "moscova-20", staffId: who || null, date, from, to, reason: String(data.get("reason") ?? "").trim() }, actor.id, at()));
    event.currentTarget.reset();
  };
  return (
    <>
      <Head label="Расписание" title="Параметры записи" lead="Предложение на согласование OWNER: значения хранятся как данные и меняются здесь, а не в коде. Изменение сразу видно в календаре клиента." />
      {!edit ? <p className="cd-banner">Роль «{roleLabel[actor.role]}» видит параметры, но не меняет их.</p> : null}
      {error ? <p className="cd-error" role="alert">{error}</p> : null}
      <section className="cd-block">
        <h2 className="cd-block__title">Общие параметры</h2>
        <div className="cd-params">
          {number("visitMinutes", "Длительность просмотра", "мин", 15, 180, 15)}
          {number("stepMinutes", "Шаг начала визитов", "мин", 15, 120, 15)}
          {number("bufferMinutes", "Буфер между визитами сотрудника", "мин", 0, 60, 15)}
          {number("minNoticeHours", "Минимальный срок записи", "ч", 0, 96)}
          {number("horizonDays", "Запись вперёд", "дн.", 7, 120)}
          {number("propertyCapacity", "Просмотров одновременно в объекте", "", 1, 3)}
        </div>
      </section>
      <div className="cd-cols">
        <section className="cd-block">
          <h2 className="cd-block__title">Дни и часы просмотров</h2>
          <ul className="cd-hours">
            {([1, 2, 3, 4, 5, 6, 7] as Weekday[]).map((day) => (
              <li key={day}><label><span>{weekdayLabel[day]}</span><input key={hoursText(state.config.week[day])} type="text" defaultValue={hoursText(state.config.week[day])} placeholder="выходной" disabled={!edit} onBlur={(event) => { if (event.target.value.trim() !== hoursText(state.config.week[day])) setHours(day, event.target.value); }} /></label></li>
            ))}
          </ul>
          <p className="cd-muted">Формат: 09:00–13:00, 14:00–17:00. Пустое поле — выходной.</p>
        </section>
        <section className="cd-block">
          <h2 className="cd-block__title">Праздники и нерабочие дни</h2>
          <ul className="cd-rows cd-rows--tight">
            {state.config.holidays.filter((item) => item.date >= today).map((item) => (
              <li key={item.date} className="cd-row is-static"><span className="cd-row__main">{dayNumeric(item.date)}</span><span className="cd-row__meta">{item.name}</span>{edit ? <button type="button" className="cd-link" onClick={() => commit(updateConfig(state, { holidays: state.config.holidays.filter((other) => other.date !== item.date) }, actor.id, at()))}>Убрать</button> : null}</li>
            ))}
          </ul>
          {edit ? <form className="cd-inline" onSubmit={addHoliday}><input type="date" name="date" min={today} aria-label="Дата" required /><input type="text" name="name" placeholder="Название" aria-label="Название" /><button type="submit" className="btn btn--ghost vp-btn"><span>Добавить</span></button></form> : null}
          <p className="cd-muted">Даты праздников — черновик, подтверждается на каждый год.</p>
        </section>
      </div>
      <section className="cd-block">
        <h2 className="cd-block__title">Сотрудники: кто показывает объекты, отпуска и отсутствия</h2>
        <ul className="cd-staff">
          {state.staff.map((person) => (
            <li key={person.id}>
              <div className="cd-staff__head">
                <b>{person.name}</b><span className="cd-muted">{roleLabel[person.role]}</span>
                <label className="cd-check"><input type="checkbox" checked={person.conducts} disabled={!manage} onChange={(event) => commit(updateStaff(state, person.id, { conducts: event.target.checked, properties: event.target.checked ? ["moscova-20"] : [] }, actor.id, at()))} /><span>показывает объекты</span></label>
                <label className="cd-check"><input type="checkbox" checked={person.active} disabled={!manage} onChange={(event) => commit(updateStaff(state, person.id, { active: event.target.checked }, actor.id, at()))} /><span>активен</span></label>
              </div>
              {person.conducts ? (
                <>
                  {person.timeOff.map((off, index) => <p key={`${off.from}-${index}`} className="cd-staff__off">{dayNumeric(off.from)} — {dayNumeric(off.to)} · {off.reason}{edit ? <button type="button" className="cd-link" onClick={() => commit(updateStaff(state, person.id, { timeOff: person.timeOff.filter((_, i) => i !== index) }, actor.id, at()))}>Убрать</button> : null}</p>)}
                  {edit ? <form className="cd-inline" onSubmit={addOff(person.id)}><input type="date" name="from" min={today} aria-label="Отсутствует с" required /><input type="date" name="to" min={today} aria-label="по" /><input type="text" name="reason" placeholder="Отпуск, командировка…" aria-label="Причина" /><button type="submit" className="btn btn--ghost vp-btn"><span>Добавить отсутствие</span></button></form> : null}
                </>
              ) : null}
            </li>
          ))}
        </ul>
        {!manage ? <p className="cd-muted">Состав сотрудников и их роли меняет только администратор.</p> : null}
      </section>
      <section className="cd-block">
        <h2 className="cd-block__title">Ручная блокировка времени</h2>
        <ul className="cd-rows cd-rows--tight">
          {state.blocks.filter((block) => block.date >= today).sort((a, b) => a.date.localeCompare(b.date)).map((block) => (
            <li key={block.id} className="cd-row is-static"><span className="cd-row__main">{dayNumeric(block.date)}, {block.from}–{block.to}</span><span className="cd-row__meta">{block.staffId ? staffName(state, block.staffId) : "весь объект"}{block.reason ? ` · ${block.reason}` : ""}</span>{edit ? <button type="button" className="cd-link" onClick={() => commit(removeBlock(state, block.id, actor.id, at()))}>Снять</button> : null}</li>
          ))}
        </ul>
        {edit ? (
          <form className="cd-inline" onSubmit={addManualBlock}>
            <input type="date" name="date" min={today} aria-label="День" required /><input type="time" name="from" step={900} aria-label="С" required /><input type="time" name="to" step={900} aria-label="До" required />
            <select name="who" className="cd-select" aria-label="Кого блокировать"><option value="">Весь объект</option>{state.staff.filter((person) => person.conducts).map((person) => <option key={person.id} value={person.id}>{person.name}</option>)}</select>
            <input type="text" name="reason" placeholder="Причина" aria-label="Причина" /><button type="submit" className="btn btn--ghost vp-btn"><span>Закрыть время</span></button>
          </form>
        ) : null}
      </section>
      <section className="cd-block">
        <h2 className="cd-block__title">Демонстрация</h2>
        <p className="cd-muted">Все записи кабинета — тестовые и хранятся только в этом браузере.</p>
        <button type="button" className="btn btn--ghost vp-btn" onClick={() => commit(resetState(clock()))}><span>Сбросить тестовые данные</span></button>
      </section>
    </>
  );
}

export type SectionKey = "today" | "calendar" | "requests" | "visits" | "clients" | "deals" | "history" | "analytics" | "schedule";
export const sectionCount = (state: DeskState, key: SectionKey) => (key === "requests" ? state.visits.filter((visit) => visit.status === "requested").length + state.enquiries.filter((item) => !item.handled).length : 0);
