"use client";

import { useEffect, useMemo, useRef, useState, type FormEvent, type ReactNode } from "react";
import { clientTitle, dayLong, dayRelative, localeLabel, propertyLabel, sourceLabel, stageLabel, stageOrder, staffName, stamp, statusLabel, whenOf } from "@/components/commercial-desk/labels";
import { CALENDAR_WEEKS, Calendar, SlotList, mondayOf } from "@/components/visit-planner/calendar";
import {
  addNote, assignVisit, clock, cancelVisit, confirmVisit, declineVisit, keepApart, linkConversation, mergeClients, moveVisit, recordResult, registerClient, requestVisit, sendOffer, setNextAction, setStage, snapshotOf, transferClient, verifyLink,
  type DemoClient, type DemoEnquiry, type DemoVisit, type DeskState, type Locale,
} from "@/components/visit-planner/store";
import { commit } from "@/components/visit-planner/use-store";
import { addDays, canDo, fromZoned, openDays, slotsForDate, toZoned, type DealStage, type LocalDate, type Permission, type Slot, type Staff, type VisitSource } from "@/lib/visits/engine";

/**
 * COMMERCIAL DESK — the cards (OWNER «VISIT PLANNER & COMMERCIAL DESK V1», stage 1): a visit, a client, a new visit. Every action
 * goes through the store (and so through the engine); what a role may not do is not offered — in the server the same table is
 * enforced on every request, the cabinet only mirrors it. Internal comments carry the mark «только для сотрудников» and never
 * reach the visitor's page.
 */
export type Ctx = { state: DeskState; now: number; actor: Staff; may: (permission: Permission) => boolean; open: (target: { visit?: string; client?: string; create?: string; chat?: string } | null) => void };

const calendarLabels = { prev: "Предыдущий месяц", next: "Следующий месяц", open: "есть свободное время", none: "нет свободного времени", today: "сегодня" };
const slotLabels = { morning: "Утро", afternoon: "День" };

export function Drawer({ title, kicker, onClose, children }: { title: string; kicker?: string; onClose: () => void; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    ref.current?.focus();
    const onKey = (event: KeyboardEvent) => { if (event.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    document.documentElement.classList.add("cd-locked");
    return () => { document.removeEventListener("keydown", onKey); document.documentElement.classList.remove("cd-locked"); previous?.focus?.(); };
  }, [onClose]);
  return (
    <div className="cd-drawer" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <div className="cd-drawer__panel" role="dialog" aria-modal="true" aria-label={title} tabIndex={-1} ref={ref}>
        <header className="cd-drawer__head">
          <div>
            {kicker ? <p className="cd-label">{kicker}</p> : null}
            <h2 className="cd-drawer__title">{title}</h2>
          </div>
          <button type="button" className="cd-x" onClick={onClose} aria-label="Закрыть"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" /></svg></button>
        </header>
        <div className="cd-drawer__body">{children}</div>
      </div>
    </div>
  );
}

export function StatusChip({ status }: { status: DemoVisit["status"] }) {
  return <span className={`cd-chip is-${status}`}>{statusLabel[status]}</span>;
}

export function StageChip({ stage }: { stage: DealStage }) {
  return <span className={`cd-chip is-stage-${stage}`}>{stageLabel[stage]}</span>;
}

/** choose a free interval — the same calendar as the visitor's, with the employee's rules (no minimum notice, no horizon) */
function SlotPicker({ ctx, propertyId, ignoreVisitId, staffId, value, onChange }: { ctx: Ctx; propertyId: string; ignoreVisitId?: string; staffId?: string; value: Slot | null; onChange: (slot: Slot | null) => void }) {
  const { state, now } = ctx;
  const today = toZoned(now, state.config.timezone).date;
  const last = addDays(today, 120);
  const options = useMemo(() => ({ internal: true, ignoreVisitId, staffId: staffId || undefined }), [ignoreVisitId, staffId]);
  const snapshot = useMemo(() => snapshotOf(state), [state]);
  const [start, setStart] = useState<LocalDate>(mondayOf(value?.date ?? today));
  const [date, setDate] = useState<LocalDate | null>(value?.date ?? null);
  const open = useMemo(() => openDays(snapshot, propertyId, start, CALENDAR_WEEKS * 7, now, options), [snapshot, propertyId, start, now, options]);
  const slots = useMemo(() => (date ? slotsForDate(snapshot, propertyId, date, now, options) : []), [snapshot, propertyId, date, now, options]);
  return (
    <div className="cd-picker">
      <Calendar start={start} today={today} last={last} open={open} selected={date} intl="ru-RU" labels={calendarLabels} onStart={setStart} onSelect={(next) => { setDate(next); onChange(null); }} />
      {date ? (slots.length ? <SlotList slots={slots} selected={value?.startUtc ?? null} onSelect={onChange} labels={slotLabels} /> : <p className="cd-muted">На этот день свободного времени нет.</p>) : <p className="cd-muted">Выберите день — покажем свободное время.</p>}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* A visit                                                              */
/* ------------------------------------------------------------------ */

export function VisitCard({ ctx, visit }: { ctx: Ctx; visit: DemoVisit }) {
  const { state, actor, may } = ctx;
  const client = state.clients.find((item) => item.id === visit.clientId) as DemoClient;
  const when = whenOf(state, visit);
  const today = toZoned(ctx.now, state.config.timezone).date;
  const [panel, setPanel] = useState<"move" | "decline" | "cancel" | "result" | null>(null);
  const [slot, setSlot] = useState<Slot | null>(null);
  const [text, setText] = useState("");
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const conductors = state.staff.filter((person) => person.conducts && person.active && person.properties.includes(visit.propertyId));
  const events = state.events.filter((event) => event.visitId === visit.id).sort((a, b) => b.at - a.at);
  const at = clock;
  const close = () => { setPanel(null); setText(""); setSlot(null); setError(""); };

  const move = () => {
    if (!slot) return;
    const result = moveVisit(state, visit.id, slot.startUtc, actor.id, at());
    if (!result.ok) return setError("Это время уже занято — выберите другое.");
    commit(result.state);
    close();
  };
  const assign = (staffId: string) => {
    const result = assignVisit(state, visit.id, staffId, actor.id, at());
    if (!result.ok) return setError("Этот сотрудник занят в это время.");
    setError("");
    commit(result.state);
  };

  return (
    <Drawer title={`${propertyLabel[visit.propertyId] ?? visit.propertyId} · ${dayRelative(when.date, today)}, ${when.time}`} kicker={`Визит ${visit.ref}`} onClose={() => ctx.open(null)}>
      <div className="cd-card__top"><StatusChip status={visit.status} />{visit.movedFrom ? <span className="cd-muted">время изменено</span> : null}</div>
      <dl className="cd-facts">
        <div><dt>Дата и время</dt><dd>{dayLong(when.date)}, {when.time}–{when.end} <span className="cd-muted">по Кишинэу</span></dd></div>
        <div><dt>Клиент</dt><dd><button type="button" className="cd-link" onClick={() => ctx.open({ client: client.id })}>{clientTitle(client)}</button></dd></div>
        <div><dt>Контакты</dt><dd>{client.phone}{client.email ? ` · ${client.email}` : ""} · {localeLabel[visit.locale]}</dd></div>
        <div><dt>Источник</dt><dd>{sourceLabel[visit.source]}</dd></div>
        <div>
          <dt>Ответственный</dt>
          <dd>
            {may("visit.assign") && canDo(visit.status, "assign") ? (
              <select className="cd-select" value={visit.staffId ?? ""} onChange={(event) => assign(event.target.value)} aria-label="Ответственный сотрудник">
                {conductors.map((person) => <option key={person.id} value={person.id}>{person.name}</option>)}
              </select>
            ) : staffName(state, visit.staffId)}
          </dd>
        </div>
        {visit.clientNote ? <div><dt>Пожелания клиента</dt><dd>{visit.clientNote}</dd></div> : null}
        {visit.clientMessage ? <div><dt>Сообщено клиенту</dt><dd>{visit.clientMessage}</dd></div> : null}
        {visit.result ? <div><dt>Результат просмотра <span className="cd-internal">только для сотрудников</span></dt><dd>{visit.result}</dd></div> : null}
      </dl>
      {error ? <p className="cd-error" role="alert">{error}</p> : null}

      {panel === null ? (
        <div className="cd-actions">
          {may("visit.confirm") && canDo(visit.status, "confirm") ? <button type="button" className="btn vp-btn" onClick={() => commit(confirmVisit(state, visit.id, actor.id, at()))}><span>Подтвердить</span></button> : null}
          {may("visit.result") && canDo(visit.status, "complete") && visit.startUtc <= ctx.now ? <button type="button" className="btn vp-btn" onClick={() => setPanel("result")}><span>Зафиксировать результат</span></button> : null}
          {may("visit.reschedule") && canDo(visit.status, "reschedule") ? <button type="button" className="btn btn--ghost vp-btn" onClick={() => setPanel("move")}><span>Перенести</span></button> : null}
          {may("visit.confirm") && canDo(visit.status, "decline") ? <button type="button" className="btn btn--ghost vp-btn" onClick={() => setPanel("decline")}><span>Отклонить</span></button> : null}
          {may("visit.cancel") && visit.status === "confirmed" ? <button type="button" className="btn btn--ghost vp-btn" onClick={() => setPanel("cancel")}><span>Отменить</span></button> : null}
          {may("visit.result") && canDo(visit.status, "complete") && visit.startUtc > ctx.now ? <button type="button" className="cd-link" onClick={() => setPanel("result")}>Результат просмотра</button> : null}
        </div>
      ) : null}

      {panel === "move" ? (
        <section className="cd-panel" aria-label="Перенос визита">
          <p className="cd-panel__title">Перенос визита</p>
          <SlotPicker ctx={ctx} propertyId={visit.propertyId} ignoreVisitId={visit.id} value={slot} onChange={setSlot} />
          <p className="cd-muted">Клиент увидит новое время на странице запроса; уведомление уйдёт по согласованному каналу.</p>
          <div className="cd-actions"><button type="button" className="btn vp-btn" disabled={!slot} onClick={move}><span>Перенести{slot ? ` на ${slot.time}` : ""}</span></button><button type="button" className="cd-link" onClick={close}>Не переносить</button></div>
        </section>
      ) : null}
      {panel === "decline" || panel === "cancel" ? (
        <section className="cd-panel" aria-label={panel === "decline" ? "Отклонить запрос" : "Отменить визит"}>
          <p className="cd-panel__title">{panel === "decline" ? "Отклонить запрос" : "Отменить визит"}</p>
          <label className="cd-field"><span>Сообщение клиенту <em>увидит клиент</em></span><textarea rows={3} value={text} onChange={(event) => setText(event.target.value)} placeholder="Например: в это время в помещении идут работы, предлагаем выбрать другой день." /></label>
          <div className="cd-actions">
            <button type="button" className="btn vp-btn" onClick={() => { commit(panel === "decline" ? declineVisit(state, visit.id, actor.id, text.trim(), at()) : cancelVisit(state, visit.id, actor.id, text.trim(), at())); close(); }}><span>{panel === "decline" ? "Отклонить" : "Отменить визит"}</span></button>
            <button type="button" className="cd-link" onClick={close}>Назад</button>
          </div>
        </section>
      ) : null}
      {panel === "result" ? (
        <section className="cd-panel" aria-label="Результат просмотра">
          <p className="cd-panel__title">Результат просмотра <span className="cd-internal">только для сотрудников</span></p>
          <label className="cd-field"><span>Что произошло и о чём договорились</span><textarea rows={3} value={text} onChange={(event) => setText(event.target.value)} placeholder="Например: интересуют оба уровня, просили коммерческое предложение." /></label>
          <div className="cd-actions">
            <button type="button" className="btn vp-btn" onClick={() => { commit(recordResult(state, visit.id, "completed", text.trim(), actor.id, at())); close(); }}><span>Просмотр состоялся</span></button>
            <button type="button" className="btn btn--ghost vp-btn" onClick={() => { commit(recordResult(state, visit.id, "no_show", text.trim(), actor.id, at())); close(); }}><span>Клиент не пришёл</span></button>
            <button type="button" className="cd-link" onClick={close}>Назад</button>
          </div>
        </section>
      ) : null}

      <Responsibility state={state} visit={visit} client={client} />

      <TelegramPreview state={state} visit={visit} />

      <section className="cd-block">
        <h3 className="cd-block__title">Внутренние комментарии <span className="cd-internal">только для сотрудников</span></h3>
        {may("note.write") ? (
          <form className="cd-note" onSubmit={(event: FormEvent) => { event.preventDefault(); if (!note.trim()) return; commit(addNote(state, client.id, visit.id, note.trim(), actor.id, at())); setNote(""); }}>
            <textarea rows={2} value={note} onChange={(event) => setNote(event.target.value)} placeholder="Комментарий увидят только сотрудники" aria-label="Внутренний комментарий" />
            <button type="submit" className="btn btn--ghost vp-btn"><span>Добавить</span></button>
          </form>
        ) : null}
        <Timeline state={state} events={events} />
      </section>
    </Drawer>
  );
}

/** the responsibility for a visit — read from the journal of actions, never typed: who took the request, confirmed, conducts, moved, cancelled, recorded the result */
function Responsibility({ state, visit, client }: { state: DeskState; visit: DemoVisit; client: DemoClient }) {
  const events = state.events.filter((event) => event.visitId === visit.id);
  const last = (kinds: string[]) => [...events].reverse().find((event) => kinds.includes(event.kind)) ?? null;
  const who = (event: DeskState["events"][number] | null) => (event ? `${staffName(state, event.actor)} · ${stamp(state, event.at)}` : "—");
  const talk = state.conversations.find((item) => item.id === visit.conversationId) ?? null;
  const rows: [string, string][] = [
    ["Обращение принял", talk?.acceptedBy ? `${staffName(state, talk.acceptedBy)}${talk.acceptedAt ? ` · ${stamp(state, talk.acceptedAt)}` : ""}` : who(last(["request"]))],
    ["Просмотр подтвердил", who(last(["confirm"]))],
    ["Просмотр проводит", staffName(state, visit.staffId)],
    ["Перенёс", who(last(["move"]))],
    ["Отменил / отклонил", who(last(["cancel", "decline"]))],
    ["Результат зафиксировал", who(last(["result", "no_show"]))],
    ["Отвечает за переговоры", staffName(state, client.ownerId)],
  ];
  return (
    <section className="cd-block">
      <h3 className="cd-block__title">Ответственность</h3>
      <dl className="cd-resp">{rows.filter(([, value]) => value !== "—").map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
    </section>
  );
}

/** what the responsible employee receives in Telegram: the minimum — never the client's telephone, e-mail or comment */
function TelegramPreview({ state, visit }: { state: DeskState; visit: DemoVisit }) {
  const when = whenOf(state, visit);
  return (
    <details className="cd-tg">
      <summary>Уведомление в Telegram — как его получит ответственный</summary>
      <div className="cd-tg__msg" aria-label="Пример уведомления">
        <p><b>{visit.status === "requested" ? "Новая заявка на просмотр" : `Визит · ${statusLabel[visit.status].toLowerCase()}`}</b></p>
        <p>Объект: {propertyLabel[visit.propertyId] ?? visit.propertyId}<br />Дата и время: {dayLong(when.date)}, {when.time}–{when.end}<br />Номер: {visit.ref}<br />Статус: {statusLabel[visit.status]}</p>
        <p className="cd-tg__link">Открыть карточку визита → защищённая ссылка (вход сотрудника)</p>
        <div className="cd-tg__keys" aria-hidden="true"><span>Подтвердить</span><span>Перенести</span><span>Отклонить</span><span>Назначить</span><span>Карточка клиента</span></div>
      </div>
      <p className="cd-muted">Имя, телефон, e-mail и пожелания клиента в Telegram не передаются — только в карточке после входа. Нажатие кнопки проверяется на сервере по списку сотрудников и их ролям.</p>
    </details>
  );
}

function Timeline({ state, events }: { state: DeskState; events: DeskState["events"] }) {
  if (!events.length) return <p className="cd-muted">Записей пока нет.</p>;
  return (
    <ol className="cd-timeline">
      {events.map((event) => (
        <li key={event.id} className={event.internal ? "is-internal" : ""}>
          <p className="cd-timeline__meta">{stamp(state, event.at)} · {staffName(state, event.actor)}{event.internal ? <span className="cd-internal">внутреннее</span> : null}</p>
          <p className="cd-timeline__text">{event.text}</p>
        </li>
      ))}
    </ol>
  );
}

/* ------------------------------------------------------------------ */
/* A client                                                             */
/* ------------------------------------------------------------------ */

export function ClientCard({ ctx, client }: { ctx: Ctx; client: DemoClient }) {
  const { state, actor, may } = ctx;
  const today = toZoned(ctx.now, state.config.timezone).date;
  const visits = state.visits.filter((visit) => visit.clientId === client.id).sort((a, b) => b.startUtc - a.startUtc);
  const offers = state.offers.filter((offer) => offer.clientId === client.id).sort((a, b) => b.at - a.at);
  const events = state.events.filter((event) => event.clientId === client.id).sort((a, b) => b.at - a.at);
  const [note, setNote] = useState("");
  const [next, setNext] = useState(client.nextAction?.text ?? "");
  const [due, setDue] = useState<LocalDate>(client.nextAction ? toZoned(client.nextAction.dueUtc, state.config.timezone).date : addDays(today, 1));
  const [lost, setLost] = useState("");
  const [closing, setClosing] = useState(false);
  const [moving, setMoving] = useState(false);
  const [target, setTarget] = useState("");
  const [reason, setReason] = useState("");
  const at = clock;
  const edit = may("client.edit");
  const talks = state.conversations.filter((item) => item.clientId === client.id);
  const twin = client.duplicateOf ? state.clients.find((item) => item.id === client.duplicateOf?.clientId) ?? null : null;
  const conductors = state.staff.filter((person) => person.conducts && person.active);
  const closed = client.stage === "won" || client.stage === "lost";

  return (
    <Drawer title={client.name} kicker={client.company || "Клиент"} onClose={() => ctx.open(null)}>
      <div className="cd-card__top"><StageChip stage={client.stage} /><span className="cd-muted">{propertyLabel[client.propertyId] ?? client.propertyId}</span></div>
      <dl className="cd-facts">
        <div><dt>Контакты</dt><dd>{client.phone || "—"}{client.email ? ` · ${client.email}` : ""}</dd></div>
        <div><dt>Язык общения</dt><dd>{localeLabel[client.locale]}</dd></div>
        <div><dt>Источник обращения</dt><dd>{sourceLabel[client.source]}</dd></div>
        <div>
          <dt>Ответственный за переговоры</dt>
          <dd>{staffName(state, client.ownerId)}{may("client.transfer") && !closed ? <> · <button type="button" className="cd-link" onClick={() => { setMoving(!moving); setTarget(""); }}>{client.ownerId ? "Передать клиента" : "Назначить ответственного"}</button></> : null}</dd>
        </div>
        <div>
          <dt>Этап переговоров</dt>
          <dd>
            {edit && !closed ? (
              <select className="cd-select" value={client.stage} onChange={(event) => commit(setStage(state, client.id, event.target.value as DealStage, "", actor.id, at()))} aria-label="Этап переговоров">
                {stageOrder.filter((stage) => stage !== "won" && stage !== "lost").map((stage) => <option key={stage} value={stage}>{stageLabel[stage]}</option>)}
              </select>
            ) : <>{stageLabel[client.stage]}{client.lostReason ? ` — ${client.lostReason}` : ""}</>}
          </dd>
        </div>
        {client.needs ? <div><dt>Потребности клиента <span className="cd-internal">только для сотрудников</span></dt><dd>{client.needs}</dd></div> : null}
      </dl>

      {twin ? (
        <section className="cd-panel cd-panel--mark" aria-label="Возможный дубликат">
          <p className="cd-panel__title">Возможный дубликат</p>
          <p className="cd-muted">{client.duplicateOf?.by === "phone" ? "Телефон" : "E-mail"} этой заявки уже есть в карточке «{clientTitle(twin)}». Клиент мог указать чужой контакт, поэтому заявка получила свою карточку: записи объединяет только сотрудник.</p>
          <div className="cd-actions">
            {may("client.merge") ? <button type="button" className="btn vp-btn" onClick={() => { commit(mergeClients(state, client.id, twin.id, actor.id, at())); ctx.open({ client: twin.id }); }}><span>Объединить с той карточкой</span></button> : null}
            {may("client.merge") ? <button type="button" className="btn btn--ghost vp-btn" onClick={() => commit(keepApart(state, client.id, actor.id, at()))}><span>Это разные клиенты</span></button> : null}
            <button type="button" className="cd-link" onClick={() => ctx.open({ client: twin.id })}>Открыть ту карточку</button>
          </div>
        </section>
      ) : null}

      {moving ? (
        <section className="cd-panel" aria-label="Передача клиента">
          <p className="cd-panel__title">{client.ownerId ? "Передача клиента другому сотруднику" : "Ответственный за клиента"}</p>
          <label className="cd-field"><span>Кому</span>
            <select className="cd-select" value={target} onChange={(event) => setTarget(event.target.value)}>
              <option value="" disabled>Выберите сотрудника</option>
              {conductors.filter((person) => person.id !== client.ownerId).map((person) => <option key={person.id} value={person.id}>{person.name}</option>)}
            </select>
          </label>
          <label className="cd-field"><span>Комментарий к передаче <em>только для сотрудников</em></span><textarea rows={2} value={reason} onChange={(event) => setReason(event.target.value)} placeholder="Например: клиент ведёт переговоры по объекту коллеги" /></label>
          <p className="cd-muted">История визитов, переписки, комментариев и предложений остаётся в карточке; передача записывается в журнал — от кого, кому и когда. Открытые диалоги клиента переходят новому ответственному.</p>
          <div className="cd-actions"><button type="button" className="btn vp-btn" disabled={!target} onClick={() => { commit(transferClient(state, client.id, target, reason.trim(), actor.id, at())); setMoving(false); setReason(""); }}><span>{client.ownerId ? "Передать" : "Назначить"}</span></button><button type="button" className="cd-link" onClick={() => setMoving(false)}>Отмена</button></div>
        </section>
      ) : null}

      {talks.length ? (
        <section className="cd-block">
          <h3 className="cd-block__title">Переписка</h3>
          <ul className="cd-rows">{talks.map((talk) => <li key={talk.id}><button type="button" className="cd-row" onClick={() => ctx.open({ chat: talk.id })}><span className="cd-row__main">Диалог {talk.code} · {talk.pageName}</span><span className="cd-row__meta">Оператор: {staffName(state, talk.assigneeId)} · последний ответ: {talk.lastManagerAt ? stamp(state, talk.lastManagerAt) : "ещё не было"}</span></button></li>)}</ul>
        </section>
      ) : null}

      <section className="cd-block">
        <h3 className="cd-block__title">Каналы и связь записей</h3>
        <ul className="cd-links">
          {client.links.map((link, index) => (
            <li key={`${link.channel}-${index}`}>
              <span>{sourceLabel[link.channel]} <span className="cd-muted">· {link.label}</span></span>
              {link.verified ? <span className="cd-ok">связь подтверждена</span> : may("client.merge") ? <button type="button" className="cd-link" onClick={() => commit(verifyLink(state, client.id, index, actor.id, at()))}>Подтвердить связь</button> : <span className="cd-warn">ждёт подтверждения</span>}
            </li>
          ))}
        </ul>
        <p className="cd-muted">Заявка с сайта всегда получает свою карточку. Если её телефон или e-mail уже есть у другого клиента, карточки объединяет сотрудник — никогда сама система.</p>
      </section>

      <section className="cd-block">
        <h3 className="cd-block__title">Следующее действие</h3>
        {edit && !closed ? (
          <form className="cd-next" onSubmit={(event: FormEvent) => { event.preventDefault(); commit(setNextAction(state, client.id, next.trim(), next.trim() ? fromZoned(due, "10:00", state.config.timezone) : null, actor.id, at())); }}>
            <input type="text" value={next} onChange={(event) => setNext(event.target.value)} placeholder="Например: позвонить по предложению" aria-label="Следующее действие" />
            <input type="date" value={due} min={today} onChange={(event) => setDue(event.target.value)} aria-label="Срок" />
            <button type="submit" className="btn btn--ghost vp-btn"><span>Сохранить</span></button>
          </form>
        ) : <p className="cd-muted">{client.nextAction ? `${client.nextAction.text} · ${dayRelative(toZoned(client.nextAction.dueUtc, state.config.timezone).date, today)}` : "Не назначено."}</p>}
      </section>

      <section className="cd-block">
        <h3 className="cd-block__title">Визиты</h3>
        {visits.length ? (
          <ul className="cd-rows">
            {visits.map((visit) => { const when = whenOf(state, visit); return (
              <li key={visit.id}><button type="button" className="cd-row" onClick={() => ctx.open({ visit: visit.id })}><span className="cd-row__main">{dayRelative(when.date, today)}, {when.time}</span><span className="cd-row__meta">{visit.ref} · {staffName(state, visit.staffId)}</span><StatusChip status={visit.status} /></button></li>
            ); })}
          </ul>
        ) : <p className="cd-muted">Визитов пока нет.</p>}
        {may("visit.create") && !closed ? <button type="button" className="btn btn--ghost vp-btn" onClick={() => ctx.open({ create: client.id })}><span>Запланировать визит</span></button> : null}
      </section>

      <section className="cd-block">
        <h3 className="cd-block__title">Коммерческие предложения</h3>
        {offers.length ? <ul className="cd-rows">{offers.map((offer) => <li key={offer.id} className="cd-row is-static"><span className="cd-row__main">{offer.title}</span><span className="cd-row__meta">{stamp(state, offer.at)} · {staffName(state, offer.by)} · {offer.note}</span></li>)}</ul> : <p className="cd-muted">Предложения не отправлялись.</p>}
        {may("offer.send") && !closed ? <button type="button" className="btn btn--ghost vp-btn" onClick={() => commit(sendOffer(state, client.id, "Moscova 20 — Коммерческое предложение", "Отмечено в кабинете (демо — письмо не отправляется).", actor.id, at()))}><span>Отправить коммерческое предложение</span></button> : null}
      </section>

      {may("deal.close") && !closed ? (
        <section className="cd-block">
          <h3 className="cd-block__title">Завершение переговоров</h3>
          {closing ? (
            <div className="cd-panel">
              <label className="cd-field"><span>Причина, если договор не заключён</span><input type="text" value={lost} onChange={(event) => setLost(event.target.value)} placeholder="Например: выбрали другое помещение" /></label>
              <div className="cd-actions">
                <button type="button" className="btn vp-btn" onClick={() => { commit(setStage(state, client.id, "won", "", actor.id, at())); setClosing(false); }}><span>Договор аренды заключён</span></button>
                <button type="button" className="btn btn--ghost vp-btn" onClick={() => { commit(setStage(state, client.id, "lost", lost.trim(), actor.id, at())); setClosing(false); }}><span>Завершить без договора</span></button>
                <button type="button" className="cd-link" onClick={() => setClosing(false)}>Назад</button>
              </div>
            </div>
          ) : <button type="button" className="btn btn--ghost vp-btn" onClick={() => setClosing(true)}><span>Зафиксировать завершение переговоров</span></button>}
        </section>
      ) : null}

      <section className="cd-block">
        <h3 className="cd-block__title">История взаимодействий</h3>
        {may("note.write") ? (
          <form className="cd-note" onSubmit={(event: FormEvent) => { event.preventDefault(); if (!note.trim()) return; commit(addNote(state, client.id, null, note.trim(), actor.id, at())); setNote(""); }}>
            <textarea rows={2} value={note} onChange={(event) => setNote(event.target.value)} placeholder="Внутренний комментарий — увидят только сотрудники" aria-label="Внутренний комментарий" />
            <button type="submit" className="btn btn--ghost vp-btn"><span>Добавить</span></button>
          </form>
        ) : null}
        <Timeline state={state} events={events} />
      </section>
    </Drawer>
  );
}

/* ------------------------------------------------------------------ */
/* A new visit / a new client                                           */
/* ------------------------------------------------------------------ */

const manualSources: VisitSource[] = ["phone", "assistant", "telegram", "desk"];

export function NewVisit({ ctx, preset }: { ctx: Ctx; /** a client id, a telephone enquiry («q-…»), a dialogue («k-…», «k-…:client» for the card alone) or «new» */ preset: string }) {
  const { state, actor } = ctx;
  const [presetId, mode] = preset.split(":");
  const enquiry: DemoEnquiry | null = state.enquiries.find((item) => item.id === presetId) ?? null;
  const talk = state.conversations.find((item) => item.id === presetId) ?? null;
  const presetClient = state.clients.find((item) => item.id === (talk?.clientId ?? enquiry?.clientId ?? presetId)) ?? null;
  const firstLine = talk ? state.messages.find((message) => message.conversationId === talk.id && message.direction === "visitor")?.body ?? "" : "";
  const [clientId, setClientId] = useState<string>(presetClient?.id ?? "");
  const [source, setSource] = useState<VisitSource>(talk ? (talk.channel === "telegram" ? "telegram" : "assistant") : enquiry?.channel ?? (presetClient ? "desk" : "phone"));
  const [language, setLanguage] = useState<Locale>(talk?.locale ?? enquiry?.locale ?? presetClient?.locale ?? "ru");
  const [staffId, setStaffId] = useState("");
  const [slot, setSlot] = useState<Slot | null>(null);
  const [withVisit, setWithVisit] = useState(mode !== "client");
  const [error, setError] = useState("");
  const propertyId = talk?.propertyId ?? enquiry?.propertyId ?? presetClient?.propertyId ?? "moscova-20";
  const conductors = state.staff.filter((person) => person.conducts && person.active && person.properties.includes(propertyId));

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const get = (name: string) => String(data.get(name) ?? "").trim();
    const now = clock();
    let working = state;
    let id = clientId;
    if (!id) {
      if (get("name").length < 2 || (!get("phone") && !get("email"))) return setError("Укажите имя и телефон или e-mail клиента.");
      const registered = registerClient(working, { name: get("name"), company: get("company"), phone: get("phone"), email: get("email"), needs: get("needs"), source, locale: language, propertyId, enquiryId: enquiry?.id }, actor.id, now);
      working = registered.state;
      id = registered.clientId;
    } else if (enquiry) {
      working = { ...working, enquiries: working.enquiries.map((item) => (item.id === enquiry.id ? { ...item, handled: true, clientId: id } : item)) };
    }
    if (talk) working = linkConversation(working, talk.id, id, actor.id, now);
    if (withVisit) {
      if (!slot) return setError("Выберите день и время визита.");
      const client = working.clients.find((item) => item.id === id) as DemoClient;
      const result = requestVisit(working, { propertyId, startUtc: slot.startUtc, name: client.name, company: client.company, phone: client.phone, email: client.email, note: get("note"), locale: client.locale, source, by: actor.id, clientId: id, staffId: staffId || null, conversationId: talk?.id ?? null }, now);
      if (!result.ok) return setError(result.reason === "staff_busy" ? "Этот сотрудник занят в это время." : "Это время уже занято — выберите другое.");
      commit(result.state);
      return ctx.open({ visit: result.visit.id });
    }
    commit(working);
    ctx.open({ client: id });
  };

  return (
    <Drawer title={withVisit ? "Новый визит" : "Новый клиент"} kicker={talk ? `Из диалога ${talk.code}` : enquiry ? enquiry.title : "Создаёт сотрудник"} onClose={() => ctx.open(null)}>
      <form className="cd-form" onSubmit={onSubmit} noValidate>
        {talk && firstLine ? <p className="cd-quote">{firstLine}</p> : enquiry ? <p className="cd-quote">{enquiry.excerpt}</p> : null}
        <fieldset className="cd-fieldset">
          <legend>Клиент</legend>
          <label className="cd-field"><span>Карточка клиента</span>
            <select className="cd-select" value={clientId} onChange={(event) => setClientId(event.target.value)}>
              <option value="">Новый клиент</option>
              {state.clients.map((item) => <option key={item.id} value={item.id}>{clientTitle(item)}</option>)}
            </select>
          </label>
          {!clientId ? (
            <div className="cd-grid2">
              <label className="cd-field"><span>Имя и фамилия</span><input name="name" type="text" autoComplete="off" /></label>
              <label className="cd-field"><span>Компания / бренд</span><input name="company" type="text" autoComplete="off" /></label>
              <label className="cd-field"><span>Телефон</span><input name="phone" type="tel" autoComplete="off" /></label>
              <label className="cd-field"><span>E-mail</span><input name="email" type="email" autoComplete="off" /></label>
              <label className="cd-field"><span>Язык общения</span><select className="cd-select" value={language} onChange={(event) => setLanguage(event.target.value as Locale)}>{(["ro", "ru", "en"] as const).map((item) => <option key={item} value={item}>{localeLabel[item]}</option>)}</select></label>
              <label className="cd-field cd-grid2__full"><span>Потребности клиента <em>только для сотрудников</em></span><textarea name="needs" rows={2} /></label>
              <p className="cd-muted cd-grid2__full">Если телефон или e-mail уже есть в базе, новая карточка не создаётся — обращение добавляется к существующей.</p>
            </div>
          ) : null}
          <label className="cd-field"><span>Источник обращения</span>
            <select className="cd-select" value={source} onChange={(event) => setSource(event.target.value as VisitSource)}>{manualSources.map((item) => <option key={item} value={item}>{sourceLabel[item]}</option>)}</select>
          </label>
        </fieldset>
        <label className="cd-check"><input type="checkbox" checked={withVisit} onChange={(event) => setWithVisit(event.target.checked)} /><span>Сразу назначить визит</span></label>
        {withVisit ? (
          <fieldset className="cd-fieldset">
            <legend>Визит · {propertyLabel[propertyId] ?? propertyId}</legend>
            <label className="cd-field"><span>Кто проводит</span>
              <select className="cd-select" value={staffId} onChange={(event) => { setStaffId(event.target.value); setSlot(null); }}>
                <option value="">Любой свободный сотрудник</option>
                {conductors.map((person) => <option key={person.id} value={person.id}>{person.name}</option>)}
              </select>
            </label>
            <SlotPicker ctx={ctx} propertyId={propertyId} staffId={staffId} value={slot} onChange={setSlot} />
            <label className="cd-field"><span>Пожелания клиента</span><textarea name="note" rows={2} /></label>
            <p className="cd-muted">Визит, созданный сотрудником, сразу подтверждён — минимальный срок записи для сотрудника не действует.</p>
          </fieldset>
        ) : null}
        {error ? <p className="cd-error" role="alert">{error}</p> : null}
        <div className="cd-actions"><button type="submit" className="btn vp-btn"><span>{withVisit ? "Создать визит" : "Сохранить клиента"}</span></button><button type="button" className="cd-link" onClick={() => ctx.open(null)}>Отмена</button></div>
      </form>
    </Drawer>
  );
}
