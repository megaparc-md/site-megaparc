"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { StageChip, type Ctx } from "@/components/commercial-desk/cards";
import { clientTitle, dayRelative, localeLabel, staffName, stamp } from "@/components/commercial-desk/labels";
import {
  acceptConversation, assignConversation, clock, noteConversation, replyConversation, setConversationStatus, waitingConversations,
  type ChatStatus, type DemoConversation, type DeskState,
} from "@/components/visit-planner/store";
import { commit } from "@/components/visit-planner/use-store";
import { toZoned } from "@/lib/visits/engine";

/**
 * COMMERCIAL DESK — THE COMMERCIAL CHAT (OWNER «VISIT PLANNER & COMMERCIAL DESK V2» §3, 2026-11-27). The cabinet is the main
 * workplace of the commercial department: the dialogues of the site's window (and of visitors who continued in Telegram) with their
 * history, the assigned operator, the time of the last answer and the status; a viewing is planned straight from a dialogue; the
 * client card, the internal comments, the next action and the history of the negotiations are one step away. The statuses are the
 * server's own (new · in work · viewing · negotiation · closed). OWNER DEMO: test dialogues, nothing is sent to anybody.
 */
export const chatStatusLabel: Record<ChatStatus, string> = { new: "Новое", progress: "В работе", viewing: "Просмотр", negotiation: "Переговоры", closed: "Закрыто" };
const channelLabel = { site: "Чат на сайте", telegram: "Telegram клиента", desk: "Commercial Desk" } as const;
const FILTERS = [["waiting", "Ждут ответа"], ["mine", "Мои"], ["open", "Все открытые"], ["closed", "Закрытые"]] as const;
type Filter = (typeof FILTERS)[number][0];

const titleOf = (state: DeskState, talk: DemoConversation) => {
  const client = state.clients.find((item) => item.id === talk.clientId);
  return client ? clientTitle(client) : `Посетитель · ${talk.code}`;
};
const clockOf = (state: DeskState, ms: number, today: string) => { const z = toZoned(ms, state.config.timezone); return z.date === today ? z.time : `${dayRelative(z.date, today)}, ${z.time}`; };

export function ChatStatusChip({ status }: { status: ChatStatus }) {
  return <span className={`cd-chip is-chat-${status}`}>{chatStatusLabel[status]}</span>;
}

export function Chat({ ctx, selected, onSelect }: { ctx: Ctx; selected: string | null; onSelect: (id: string | null) => void }) {
  const { state, actor } = ctx;
  const [filter, setFilter] = useState<Filter>("waiting");
  const today = toZoned(ctx.now, state.config.timezone).date;
  const waiting = waitingConversations(state);
  const lists: Record<Filter, DemoConversation[]> = {
    waiting,
    mine: state.conversations.filter((talk) => talk.assigneeId === actor.id && talk.status !== "closed"),
    open: state.conversations.filter((talk) => talk.status !== "closed"),
    closed: state.conversations.filter((talk) => talk.status === "closed"),
  };
  const list = [...lists[filter]].sort((a, b) => Math.max(b.lastVisitorAt, b.lastManagerAt ?? 0) - Math.max(a.lastVisitorAt, a.lastManagerAt ?? 0));
  const talk = state.conversations.find((item) => item.id === selected) ?? null;
  return (
    <>
      <header className="cd-head">
        <div>
          <p className="cd-label">Коммерческий чат</p>
          <h1 className="cd-title">Диалоги с клиентами</h1>
          <p className="cd-lead">Окно на сайте и Telegram клиента — в одном месте: кто отвечает, когда ответили, что дальше.</p>
        </div>
      </header>
      <div className={`cd-chat${talk ? " has-talk" : ""}`}>
        <aside className="cd-chat__list" aria-label="Диалоги">
          <div className="cd-tabs" role="tablist">{FILTERS.map(([key, label]) => <button key={key} type="button" role="tab" aria-selected={filter === key} className={filter === key ? "is-on" : ""} onClick={() => setFilter(key)}>{label} · {lists[key].length}</button>)}</div>
          {list.length ? (
            <ul className="cd-talks">
              {list.map((item) => {
                const last = [...state.messages].reverse().find((message) => message.conversationId === item.id && message.direction !== "system");
                const unanswered = waiting.includes(item);
                return (
                  <li key={item.id}>
                    <button type="button" className={`cd-talk${item.id === selected ? " is-on" : ""}${unanswered ? " is-waiting" : ""}`} onClick={() => onSelect(item.id)} aria-current={item.id === selected ? "true" : undefined}>
                      <span className="cd-talk__top"><b>{titleOf(state, item)}</b><span>{clockOf(state, Math.max(item.lastVisitorAt, item.lastManagerAt ?? 0), today)}</span></span>
                      <span className="cd-talk__text">{last ? `${last.direction === "manager" ? "Вы: " : ""}${last.body}` : "—"}</span>
                      <span className="cd-talk__meta"><ChatStatusChip status={item.status} /><span>{item.assigneeId ? staffName(state, item.assigneeId) : "Оператор не назначен"}</span></span>
                    </button>
                  </li>
                );
              })}
            </ul>
          ) : <p className="cd-empty">Здесь диалогов нет.</p>}
        </aside>
        <section className="cd-chat__pane" aria-label="Диалог">
          {talk ? <Conversation key={talk.id} ctx={ctx} talk={talk} today={today} onBack={() => onSelect(null)} /> : <p className="cd-chat__none">Выберите диалог слева.</p>}
        </section>
      </div>
    </>
  );
}

function Conversation({ ctx, talk, today, onBack }: { ctx: Ctx; talk: DemoConversation; today: string; onBack: () => void }) {
  const { state, actor, may } = ctx;
  const [text, setText] = useState("");
  const [internal, setInternal] = useState(false);
  const thread = useRef<HTMLDivElement>(null);
  const client = state.clients.find((item) => item.id === talk.clientId) ?? null;
  const messages = state.messages.filter((message) => message.conversationId === talk.id);
  const notes = state.events.filter((event) => event.conversationId === talk.id && event.kind === "note");
  const feed = [...messages.map((message) => ({ at: message.at, message, note: null as null | (typeof notes)[number] })), ...notes.map((note) => ({ at: note.at, message: null as null | (typeof messages)[number], note }))].sort((a, b) => a.at - b.at);
  const visits = state.visits.filter((visit) => visit.conversationId === talk.id || (client && visit.clientId === client.id));
  const operators = state.staff.filter((person) => person.active && person.role !== "management");
  const canReply = may("chat.reply");
  const count = feed.length;
  useEffect(() => { const box = thread.current; if (box) box.scrollTop = box.scrollHeight; }, [count]);

  const send = (event: FormEvent) => {
    event.preventDefault();
    const body = text.trim();
    if (!body) return;
    commit(internal ? noteConversation(state, talk.id, body, actor.id, clock()) : replyConversation(state, talk.id, body, actor.id, clock()));
    setText("");
  };

  return (
    <div className="cd-conv">
      <header className="cd-conv__head">
        <button type="button" className="cd-link cd-conv__back" onClick={onBack}>← Диалоги</button>
        <div className="cd-conv__title">
          <h2>{client ? clientTitle(client) : `Посетитель · ${talk.code}`}</h2>
          <p>{talk.pageName} · {channelLabel[talk.channel]} · {localeLabel[talk.locale]} · диалог {talk.code}</p>
        </div>
        <div className="cd-conv__tools">
          {may("chat.assign") ? (
            <label className="cd-conv__field"><span>Оператор</span>
              <select className="cd-select" value={talk.assigneeId ?? ""} onChange={(event) => commit(assignConversation(state, talk.id, event.target.value, actor.id, clock()))}>
                <option value="" disabled>Не назначен</option>
                {operators.map((person) => <option key={person.id} value={person.id}>{person.name}</option>)}
              </select>
            </label>
          ) : <p className="cd-conv__field"><span>Оператор</span><b>{talk.assigneeId ? staffName(state, talk.assigneeId) : "Не назначен"}</b></p>}
          {canReply ? (
            <label className="cd-conv__field"><span>Статус</span>
              <select className="cd-select" value={talk.status} onChange={(event) => commit(setConversationStatus(state, talk.id, event.target.value as ChatStatus, actor.id, clock()))}>
                {(Object.keys(chatStatusLabel) as ChatStatus[]).map((status) => <option key={status} value={status}>{chatStatusLabel[status]}</option>)}
              </select>
            </label>
          ) : <p className="cd-conv__field"><span>Статус</span><b>{chatStatusLabel[talk.status]}</b></p>}
        </div>
      </header>

      <div className="cd-conv__facts">
        <p><span>Принял обращение</span><b>{talk.acceptedBy ? `${staffName(state, talk.acceptedBy)} · ${talk.acceptedAt ? clockOf(state, talk.acceptedAt, today) : ""}` : "пока никто"}</b></p>
        <p><span>Последнее сообщение клиента</span><b>{clockOf(state, talk.lastVisitorAt, today)}</b></p>
        <p><span>Последний ответ</span><b className={talk.lastManagerAt === null || talk.lastManagerAt < talk.lastVisitorAt ? "is-late" : ""}>{talk.lastManagerAt ? clockOf(state, talk.lastManagerAt, today) : "ответа ещё не было"}</b></p>
      </div>

      <div className="cd-conv__actions">
        {canReply && !talk.assigneeId ? <button type="button" className="btn vp-btn" onClick={() => commit(acceptConversation(state, talk.id, actor.id, clock()))}><span>Принять обращение</span></button> : null}
        {may("visit.create") ? <button type="button" className={`btn vp-btn${talk.assigneeId ? "" : " btn--ghost"}`} onClick={() => ctx.open({ create: talk.id })}><span>Назначить визит</span></button> : null}
        {client ? <button type="button" className="btn btn--ghost vp-btn" onClick={() => ctx.open({ client: client.id })}><span>Карточка клиента</span></button> : may("visit.create") ? <button type="button" className="btn btn--ghost vp-btn" onClick={() => ctx.open({ create: `${talk.id}:client` })}><span>Создать карточку клиента</span></button> : null}
      </div>

      <div className="cd-conv__thread" ref={thread} role="log" aria-label="Переписка">
        {feed.map(({ message, note }) => message ? (
          <div key={message.id} className={`cd-msg is-${message.direction}`}>
            {message.direction === "system" ? <p className="cd-msg__system">{message.body} · {clockOf(state, message.at, today)}</p> : (
              <>
                <p className="cd-msg__meta">{message.direction === "visitor" ? "Клиент" : staffName(state, message.staffId)} · {clockOf(state, message.at, today)}{message.direction === "manager" ? ` · ${message.via === "telegram" ? "из Telegram" : "из кабинета"}` : ""}</p>
                <p className="cd-msg__body">{message.body}</p>
              </>
            )}
          </div>
        ) : note ? (
          <div key={note.id} className="cd-msg is-note">
            <p className="cd-msg__meta">{staffName(state, note.actor)} · {clockOf(state, note.at, today)} <span className="cd-internal">только для сотрудников</span></p>
            <p className="cd-msg__body">{note.text}</p>
          </div>
        ) : null)}
      </div>

      {canReply ? (
        <form className={`cd-reply${internal ? " is-internal" : ""}`} onSubmit={send}>
          <textarea rows={2} value={text} onChange={(event) => setText(event.target.value)} placeholder={internal ? "Внутренний комментарий — клиент его не увидит" : talk.status === "closed" ? "Ответ откроет диалог снова" : "Ответ клиенту"} aria-label={internal ? "Внутренний комментарий" : "Ответ клиенту"} onKeyDown={(event) => { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); event.currentTarget.form?.requestSubmit(); } }} />
          <div className="cd-reply__row">
            <label className="cd-check"><input type="checkbox" checked={internal} onChange={(event) => setInternal(event.target.checked)} /><span>Внутренний комментарий</span></label>
            <button type="submit" className="btn vp-btn"><span>{internal ? "Сохранить комментарий" : "Ответить"}</span></button>
          </div>
          <p className="cd-muted">Демо: ответ никуда не отправляется. В рабочей версии клиент получает его в окне сайта (и в Telegram, если продолжил там), копия уходит в тему группы.</p>
        </form>
      ) : <p className="cd-banner">Эта роль читает переписку, но не отвечает клиентам.</p>}

      <div className="cd-conv__side">
        <section>
          <h3 className="cd-block__title">Клиент и переговоры</h3>
          {client ? (
            <>
              <p className="cd-conv__line"><StageChip stage={client.stage} /> <span>Ответственный: {staffName(state, client.ownerId)}</span></p>
              <p className="cd-conv__line"><span>Следующее действие:</span> <b>{client.nextAction ? `${client.nextAction.text} · ${dayRelative(toZoned(client.nextAction.dueUtc, state.config.timezone).date, today)}` : "не назначено"}</b></p>
              <button type="button" className="cd-link" onClick={() => ctx.open({ client: client.id })}>История переговоров и следующее действие →</button>
            </>
          ) : <p className="cd-muted">Карточки клиента ещё нет: она появится при назначении визита или создаётся вручную — одна на клиента для чата, визитов и переговоров.</p>}
        </section>
        <section>
          <h3 className="cd-block__title">Визиты</h3>
          {visits.length ? <ul className="cd-rows cd-rows--tight">{visits.map((visit) => { const z = toZoned(visit.startUtc, state.config.timezone); return <li key={visit.id}><button type="button" className="cd-row" onClick={() => ctx.open({ visit: visit.id })}><span className="cd-row__main">{dayRelative(z.date, today)}, {z.time}</span><span className="cd-row__meta">{visit.ref} · {staffName(state, visit.staffId)}</span></button></li>; })}</ul> : <p className="cd-muted">Визитов по этому диалогу нет.</p>}
        </section>
      </div>
      <p className="cd-muted cd-conv__stamp">Диалог начат {stamp(state, talk.createdAt)}.</p>
    </div>
  );
}
