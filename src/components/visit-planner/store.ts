import { demoStaff, proposedSchedule } from "@/data/visit-planner";
import {
  addDays, book, canDo, fromZoned, isHoliday, matchClient, slotsForDate, toZoned, weekdayOf,
  type Block, type DealStage, type LocalDate, type ScheduleConfig, type ScheduleSnapshot, type Staff, type VisitSource, type VisitStatus,
} from "@/lib/visits/engine";

/**
 * VISIT PLANNER — THE DEMONSTRATION STORE (OWNER «VISIT PLANNER & COMMERCIAL DESK V1», stage 1, 2026-11-27).
 *
 * The OWNER preview has no server: the visitor's planner and the employees' cabinet read and write ONE record kept in this
 * browser's localStorage, so a request made in the planner appears in the cabinet on the same device and an employee's action
 * (confirm, move, cancel) is seen on the visitor's status page. Nothing leaves the browser; every client, visit and comment in the
 * seed is invented and marked «ТЕСТ». The shapes mirror the server tables of docs/VISIT_PLANNER_ARCHITECTURE.md, and every change
 * goes through the same engine (src/lib/visits/engine.ts) the server will use — availability is never typed, always computed.
 */

export type Locale = "ro" | "ru" | "en";

export type DemoVisit = {
  id: string;
  /** the number the visitor and the employees quote */
  ref: string;
  /** the visitor's key to the status page (the server stores only its hash) */
  token: string;
  propertyId: string;
  clientId: string;
  staffId: string | null;
  startUtc: number;
  endUtc: number;
  status: VisitStatus;
  source: VisitSource;
  locale: Locale;
  createdAt: number;
  updatedAt: number;
  /** the first action of an employee on the request */
  firstResponseAt: number | null;
  cancelledBy: "client" | "staff" | null;
  /** what the visitor is told about a change (never an internal comment) */
  clientMessage: string;
  /** the visitor's own comment */
  clientNote: string;
  /** the outcome of the viewing — internal */
  result: string;
  /** the previous start when an employee moved the visit — the visitor is told the time changed */
  movedFrom: number | null;
};

export type DemoClient = {
  id: string;
  name: string;
  company: string;
  phone: string;
  email: string;
  locale: Locale;
  propertyId: string;
  source: VisitSource;
  stage: DealStage;
  /** the responsible employee */
  ownerId: string | null;
  needs: string;
  nextAction: { text: string; dueUtc: number } | null;
  createdAt: number;
  lostReason: string;
  /** the channels this record is known by; a link is «verified» only after the contact was confirmed */
  links: { channel: VisitSource; label: string; verified: boolean }[];
};

export type EventKind = "request" | "confirm" | "decline" | "move" | "cancel" | "assign" | "result" | "no_show" | "note" | "offer" | "stage" | "next" | "client" | "link" | "schedule" | "message";

export type DemoEvent = {
  id: string;
  at: number;
  /** an employee id, «client» or «system» */
  actor: string;
  clientId: string | null;
  visitId: string | null;
  kind: EventKind;
  text: string;
  /** internal: never shown to the visitor */
  internal: boolean;
};

export type DemoOffer = { id: string; clientId: string; at: number; by: string; title: string; note: string };

/** an enquiry that arrived by chat, Telegram or telephone and has no visit yet */
export type DemoEnquiry = { id: string; channel: VisitSource; at: number; title: string; excerpt: string; locale: Locale; propertyId: string; clientId: string | null; handled: boolean };

export type DeskState = {
  v: number;
  seedDay: LocalDate;
  config: ScheduleConfig;
  staff: Staff[];
  blocks: Block[];
  clients: DemoClient[];
  visits: DemoVisit[];
  events: DemoEvent[];
  offers: DemoOffer[];
  enquiries: DemoEnquiry[];
  seq: number;
};

const KEY = "megaparc:visit-demo:v1";
const VERSION = 6;
const CHANGED = "megaparc:visit-demo:changed";
const HOUR = 3_600_000;
const DAY = 24 * HOUR;

/** the instant of an action (a visitor's or an employee's) — read at the moment of the action, never while rendering */
export const clock = () => Date.now();

export const snapshotOf = (state: DeskState): ScheduleSnapshot => ({ config: state.config, staff: state.staff, blocks: state.blocks, visits: state.visits });

const uid = (prefix: string) => `${prefix}-${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36).slice(-4)}`;
const tokenOf = () => Array.from({ length: 4 }, () => Math.random().toString(36).slice(2, 8)).join("");
const refOf = (seq: number) => `TEST-V-${String(seq).padStart(4, "0")}`;

/* ------------------------------------------------------------------ */
/* Seed — invented, marked «ТЕСТ», placed around today                  */
/* ------------------------------------------------------------------ */

const isWorkday = (config: ScheduleConfig, date: LocalDate) => Boolean(config.week[weekdayOf(date)]?.length) && !isHoliday(config, date);

/** the n-th working day after (n > 0) or before (n < 0) a date; n = 0 → the date itself if it is a working day, else the next one */
function workday(config: ScheduleConfig, from: LocalDate, n: number): LocalDate {
  let date = from;
  if (n === 0) { while (!isWorkday(config, date)) date = addDays(date, 1); return date; }
  const step = n > 0 ? 1 : -1;
  for (let left = Math.abs(n); left > 0;) { date = addDays(date, step); if (isWorkday(config, date)) left -= 1; }
  return date;
}

export function seedState(nowMs: number): DeskState {
  const config: ScheduleConfig = JSON.parse(JSON.stringify(proposedSchedule));
  const today = toZoned(nowMs, config.timezone).date;
  // the second demonstration manager is away for three working days next week — time off is seen in the calendar
  const offFrom = workday(config, today, 6);
  const staff: Staff[] = demoStaff.map((person) => (person.id === "s-m2" ? { ...person, timeOff: [{ from: offFrom, to: workday(config, offFrom, 2), reason: "Отпуск (демо)" }] } : { ...person }));
  const state: DeskState = { v: VERSION, seedDay: today, config, staff, blocks: [], clients: [], visits: [], events: [], offers: [], enquiries: [], seq: 0 };
  const M = "moscova-20";
  const at = (date: LocalDate, time: string) => fromZoned(date, time, config.timezone) as number;
  const len = config.visitMinutes * 60_000;

  const client = (name: string, company: string, n: number, source: VisitSource, stage: DealStage, ownerId: string | null, needs: string, createdAt: number, locale: Locale = "ru"): DemoClient => {
    const record: DemoClient = {
      id: `c-${n}`, name, company, phone: `+373 00 000 0${String(n).padStart(2, "0")}`, email: `test${n}@example.com`, locale, propertyId: M, source, stage, ownerId, needs,
      nextAction: null, createdAt, lostReason: "", links: [{ channel: source, label: source === "phone" ? "звонок" : source === "telegram" ? "Telegram · тема ТЕСТ" : source === "assistant" ? "чат на сайте · ТЕСТ" : "форма записи", verified: source !== "phone" }],
    };
    state.clients.push(record);
    return record;
  };
  const visit = (owner: DemoClient, date: LocalDate, time: string, status: VisitStatus, staffId: string | null, createdAt: number, extra: Partial<DemoVisit> = {}): DemoVisit => {
    state.seq += 1;
    const startUtc = at(date, time);
    const record: DemoVisit = {
      id: `v-${state.seq}`, ref: refOf(state.seq), token: `demo${state.seq}${"x".repeat(12)}`, propertyId: M, clientId: owner.id, staffId, startUtc, endUtc: startUtc + len, status,
      source: owner.source, locale: owner.locale, createdAt, updatedAt: createdAt, firstResponseAt: status === "requested" ? null : createdAt + (12 + ((state.seq * 17) % 70)) * 60_000, cancelledBy: null, clientMessage: "", clientNote: "", result: "", movedFrom: null, ...extra,
    };
    state.visits.push(record);
    state.events.push({ id: `e-${state.events.length + 1}`, at: createdAt, actor: owner.source === "phone" || owner.source === "desk" ? "s-op" : "client", clientId: owner.id, visitId: record.id, kind: "request", text: `Запрос на просмотр · ${record.ref}`, internal: false });
    return record;
  };
  const log = (atMs: number, actor: string, clientId: string, visitId: string | null, kind: EventKind, text: string, internal = true) => state.events.push({ id: `e-${state.events.length + 1}`, at: atMs, actor, clientId, visitId, kind, text, internal });

  const d = (n: number) => workday(config, today, n);
  // today or the next working day: two confirmed viewings
  const c1 = client("ТЕСТ · Анна Пример", "Кофейня «Пример»", 1, "site", "visit_planned", "s-m1", "Кофейня с посадкой, интересует первый этаж и терраса.", nowMs - 3 * DAY);
  const v1 = visit(c1, d(0), "15:00", "confirmed", "s-m1", nowMs - 3 * DAY, { clientNote: "Приедем вдвоём." });
  log(v1.createdAt + 40 * 60_000, "s-m1", c1.id, v1.id, "confirm", "Просмотр подтверждён.", false);
  const c2 = client("ТЕСТ · Виктор Образец", "Шоурум мебели", 2, "tour", "visit_planned", "s-m2", "Шоурум, важны витрины и высота.", nowMs - 2 * DAY, "ro");
  const v2 = visit(c2, d(1), "10:00", "confirmed", "s-m2", nowMs - 2 * DAY);
  log(v2.createdAt + 25 * 60_000, "s-m2", c2.id, v2.id, "confirm", "Просмотр подтверждён.", false);
  // new requests waiting for an employee
  const c3 = client("ТЕСТ · Мария Демо", "Аптечная сеть", 3, "assistant", "new", null, "Аптека, нужен вход без подъёма по этажам — проверить.", nowMs - 5 * HOUR);
  visit(c3, d(2), "11:00", "requested", "s-m1", nowMs - 5 * HOUR, { clientNote: "Нужна консультация по электрической мощности." });
  const c4 = client("ТЕСТ · John Sample", "Retail brand", 4, "terms", "new", null, "Fashion retail, both levels.", nowMs - 2 * HOUR, "en");
  visit(c4, d(3), "14:00", "requested", "s-m1", nowMs - 2 * HOUR);
  // held viewings and what followed
  const c5 = client("ТЕСТ · Игорь Пробный", "Производитель · фирменный магазин", 5, "site", "offer_sent", "s-m1", "Фирменный магазин производителя, склад на нижнем уровне.", nowMs - 12 * DAY);
  const v5 = visit(c5, d(-4), "11:00", "completed", "s-m1", nowMs - 12 * DAY, { result: "Просмотр состоялся. Интересуют оба уровня, просили коммерческое предложение." });
  log(v5.startUtc + 2 * HOUR, "s-m1", c5.id, v5.id, "result", "Просмотр состоялся. Интересуют оба уровня, просили коммерческое предложение.");
  state.offers.push({ id: "o-1", clientId: c5.id, at: v5.startUtc + DAY, by: "s-m1", title: "Moscova 20 — Коммерческое предложение", note: "Отправлено на e-mail (демо)." });
  log(v5.startUtc + DAY, "s-m1", c5.id, null, "offer", "Отправлено коммерческое предложение: Moscova 20 — Коммерческое предложение.");
  c5.nextAction = { text: "Позвонить по коммерческому предложению", dueUtc: at(d(1), "11:00") };
  const c6 = client("ТЕСТ · Елена Тестовая", "Клиентский сервис", 6, "telegram", "negotiation", "s-m2", "Клиентский центр, 12 рабочих мест + зона приёма.", nowMs - 20 * DAY);
  const v6 = visit(c6, d(-9), "10:00", "completed", "s-m2", nowMs - 20 * DAY, { result: "Просмотр состоялся, обсуждаем планировку." });
  log(v6.startUtc + 3 * HOUR, "s-m2", c6.id, v6.id, "result", "Просмотр состоялся, обсуждаем планировку.");
  state.offers.push({ id: "o-2", clientId: c6.id, at: v6.startUtc + 2 * DAY, by: "s-m2", title: "Moscova 20 — Коммерческое предложение", note: "Передано на встрече (демо)." });
  log(v6.startUtc + 2 * DAY, "s-m2", c6.id, null, "offer", "Отправлено коммерческое предложение.");
  c6.nextAction = { text: "Техническая проверка концепции с техническим директором", dueUtc: at(d(2), "15:00") };
  const c7 = client("ТЕСТ · Пётр Условный", "Ритейл одежды", 7, "site", "won", "s-m1", "Магазин одежды.", nowMs - 27 * DAY);
  const v7 = visit(c7, d(-15), "14:00", "completed", "s-m1", nowMs - 27 * DAY, { result: "Просмотр состоялся." });
  log(v7.startUtc + DAY, "s-m1", c7.id, v7.id, "result", "Просмотр состоялся.");
  state.offers.push({ id: "o-3", clientId: c7.id, at: v7.startUtc + 2 * DAY, by: "s-m1", title: "Moscova 20 — Коммерческое предложение", note: "Отправлено (демо)." });
  log(v7.startUtc + 9 * DAY, "s-m1", c7.id, null, "stage", "Переговоры завершены: договор аренды (демо-запись, не реальная сделка).");
  // a no-show and a cancellation
  const c8 = client("ТЕСТ · Ольга Модель", "Салон", 8, "assistant", "new", "s-m2", "Салон красоты, 150–200 м².", nowMs - 8 * DAY);
  const v8 = visit(c8, d(-3), "16:00", "no_show", "s-m2", nowMs - 8 * DAY);
  log(v8.startUtc + HOUR, "s-m2", c8.id, v8.id, "no_show", "Клиент не пришёл, на звонок не ответил.");
  c8.nextAction = { text: "Перезвонить и предложить другое время", dueUtc: at(d(0), "12:00") };
  const c9 = client("ТЕСТ · Сергей Вариант", "Офис продаж", 9, "tour", "lost", "s-m1", "Офис продаж.", nowMs - 6 * DAY);
  const v9 = visit(c9, d(-1), "12:00", "cancelled", "s-m1", nowMs - 6 * DAY, { cancelledBy: "client", clientMessage: "" });
  log(v9.createdAt + DAY, "client", c9.id, v9.id, "cancel", "Клиент отменил запрос.", false);
  c9.lostReason = "Выбрали другое помещение (демо).";
  // enquiries that have no visit yet — a telephone call and two conversations
  const c10 = client("ТЕСТ · Звонок", "", 10, "phone", "new", null, "Звонок: спрашивали про парковку и время просмотра.", nowMs - 90 * 60_000);
  state.enquiries.push(
    { id: "q-1", channel: "phone", at: nowMs - 90 * 60_000, title: "ТЕСТ · звонок на общий номер", excerpt: "Просили перезвонить и предложить время просмотра.", locale: "ru", propertyId: M, clientId: c10.id, handled: false },
    { id: "q-2", channel: "assistant", at: nowMs - 55 * 60_000, title: "ТЕСТ · диалог в чате на сайте", excerpt: "«Можно посмотреть помещение на следующей неделе?»", locale: "ru", propertyId: M, clientId: null, handled: false },
    { id: "q-3", channel: "telegram", at: nowMs - 20 * 60_000, title: "ТЕСТ · тема в Telegram-группе", excerpt: "«Vrem să vedem spațiul joi după-amiază.»", locale: "ro", propertyId: M, clientId: null, handled: false },
  );
  // a manual block: works in the premises on a morning next week
  state.blocks.push({ id: "b-1", propertyId: M, staffId: null, date: d(4), from: "09:00", to: "11:00", reason: "Работы в помещении (демо)" });
  state.events.sort((a, b) => a.at - b.at);
  return state;
}

/* ------------------------------------------------------------------ */
/* Persistence                                                          */
/* ------------------------------------------------------------------ */

export function loadState(nowMs: number): DeskState {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as DeskState;
      if (parsed && parsed.v === VERSION && Array.isArray(parsed.visits)) return parsed;
    }
  } catch { /* a blocked or broken storage: the demonstration starts from the seed */ }
  const fresh = seedState(nowMs);
  saveState(fresh);
  return fresh;
}

export function saveState(state: DeskState) {
  try { window.localStorage.setItem(KEY, JSON.stringify(state)); } catch { /* a blocked storage: the page keeps its in-memory record */ }
  window.dispatchEvent(new Event(CHANGED));
}

export function resetState(nowMs: number): DeskState {
  const fresh = seedState(nowMs);
  saveState(fresh);
  return fresh;
}

/** the other tab (the planner ↔ the cabinet) or this tab changed the record */
export function onStateChange(listener: () => void) {
  const storage = (event: StorageEvent) => { if (event.key === KEY) listener(); };
  window.addEventListener("storage", storage);
  window.addEventListener(CHANGED, listener);
  return () => { window.removeEventListener("storage", storage); window.removeEventListener(CHANGED, listener); };
}

/* ------------------------------------------------------------------ */
/* Changes — every one goes through the engine and leaves a trace       */
/* ------------------------------------------------------------------ */

const clone = (state: DeskState): DeskState => JSON.parse(JSON.stringify(state));
const push = (state: DeskState, event: Omit<DemoEvent, "id">) => { state.events.push({ ...event, id: uid("e") }); };

export type RequestInput = {
  propertyId: string; startUtc: number; name: string; company: string; phone: string; email: string; note: string; locale: Locale; source: VisitSource;
  /** an employee creates the visit by hand */
  by?: string; clientId?: string; staffId?: string | null;
};

export type ChangeResult = { ok: true; state: DeskState; visit: DemoVisit; matched?: "phone" | "email" } | { ok: false; reason: "slot_taken" | "staff_busy" | "not_allowed" };

/** a new request: the interval is re-checked at the moment of writing, the client is matched by telephone / e-mail, the visit is «requested» */
export function requestVisit(current: DeskState, input: RequestInput, nowMs: number): ChangeResult {
  const state = clone(current);
  const internal = Boolean(input.by);
  const check = book(snapshotOf(state), { propertyId: input.propertyId, startUtc: input.startUtc, staffId: input.staffId ?? undefined, internal }, nowMs);
  if (!check.ok) return { ok: false, reason: check.reason };
  let client = input.clientId ? state.clients.find((item) => item.id === input.clientId) ?? null : null;
  let matched: "phone" | "email" | undefined;
  if (!client) {
    const match = matchClient(state.clients, { phone: input.phone, email: input.email });
    if (match) {
      client = match.client;
      matched = match.by;
      // the same contact through another channel: the link is recorded as unverified until an employee confirms it
      if (!client.links.some((link) => link.channel === input.source)) client.links.push({ channel: input.source, label: "совпадение по " + (match.by === "phone" ? "телефону" : "e-mail"), verified: false });
      push(state, { at: nowMs, actor: "system", clientId: client.id, visitId: null, kind: "link", text: `Новое обращение совпало с этой карточкой по ${match.by === "phone" ? "телефону" : "e-mail"} — связь ждёт подтверждения сотрудником.`, internal: true });
    }
  }
  if (!client) {
    client = {
      id: uid("c"), name: input.name, company: input.company, phone: input.phone, email: input.email, locale: input.locale, propertyId: input.propertyId, source: input.source, stage: "new",
      ownerId: null, needs: "", nextAction: null, createdAt: nowMs, lostReason: "", links: [{ channel: input.source, label: internal ? "создано сотрудником" : "форма записи", verified: !internal }],
    };
    state.clients.push(client);
  }
  if (["new", "lost"].includes(client.stage)) client.stage = "visit_planned";
  state.seq += 1;
  const visit: DemoVisit = {
    id: uid("v"), ref: refOf(state.seq), token: tokenOf(), propertyId: input.propertyId, clientId: client.id, staffId: check.staffId, startUtc: check.slot.startUtc, endUtc: check.slot.endUtc,
    status: internal ? "confirmed" : "requested", source: input.source, locale: input.locale, createdAt: nowMs, updatedAt: nowMs, firstResponseAt: internal ? nowMs : null, cancelledBy: null,
    clientMessage: "", clientNote: input.note, result: "", movedFrom: null,
  };
  state.visits.push(visit);
  if (internal && !client.ownerId) client.ownerId = input.by === "s-op" || input.by === "s-admin" ? check.staffId : input.by ?? check.staffId;
  push(state, { at: nowMs, actor: input.by ?? "client", clientId: client.id, visitId: visit.id, kind: "request", text: internal ? `Визит создан сотрудником и подтверждён · ${visit.ref}` : `Запрос на просмотр · ${visit.ref}`, internal: false });
  return { ok: true, state, visit, matched };
}

type Found = { state: DeskState; visit: DemoVisit; client: DemoClient } | null;
const find = (current: DeskState, visitId: string): Found => {
  const state = clone(current);
  const visit = state.visits.find((item) => item.id === visitId);
  const client = visit ? state.clients.find((item) => item.id === visit.clientId) : undefined;
  return visit && client ? { state, visit, client } : null;
};
const touch = (visit: DemoVisit, nowMs: number, staff: boolean) => { visit.updatedAt = nowMs; if (staff && visit.firstResponseAt === null) visit.firstResponseAt = nowMs; };

export function confirmVisit(current: DeskState, visitId: string, by: string, nowMs: number): DeskState {
  const found = find(current, visitId);
  if (!found || !canDo(found.visit.status, "confirm")) return current;
  const { state, visit, client } = found;
  visit.status = "confirmed";
  visit.clientMessage = "";
  touch(visit, nowMs, true);
  if (!client.ownerId) client.ownerId = visit.staffId;
  push(state, { at: nowMs, actor: by, clientId: client.id, visitId, kind: "confirm", text: "Просмотр подтверждён.", internal: false });
  return state;
}

export function declineVisit(current: DeskState, visitId: string, by: string, message: string, nowMs: number): DeskState {
  const found = find(current, visitId);
  if (!found || !canDo(found.visit.status, "decline")) return current;
  const { state, visit, client } = found;
  visit.status = "declined";
  visit.clientMessage = message;
  touch(visit, nowMs, true);
  if (client.stage === "visit_planned") client.stage = "new";
  push(state, { at: nowMs, actor: by, clientId: client.id, visitId, kind: "decline", text: `Запрос отклонён${message ? `: ${message}` : "."}`, internal: false });
  return state;
}

/** move a visit: by an employee → stays confirmed (the visitor is told the time changed); by the visitor → waits for confirmation again */
export function moveVisit(current: DeskState, visitId: string, startUtc: number, by: string, nowMs: number, staffId?: string | null): ChangeResult {
  const found = find(current, visitId);
  if (!found || !canDo(found.visit.status, "reschedule")) return { ok: false, reason: "not_allowed" };
  const { state, visit, client } = found;
  const staff = by !== "client";
  const check = book(snapshotOf(state), { propertyId: visit.propertyId, startUtc, staffId: staffId ?? undefined, ignoreVisitId: visit.id, internal: staff }, nowMs);
  if (!check.ok) return { ok: false, reason: check.reason };
  visit.movedFrom = visit.startUtc;
  visit.startUtc = check.slot.startUtc;
  visit.endUtc = check.slot.endUtc;
  visit.staffId = check.staffId;
  visit.status = staff ? "confirmed" : "requested";
  touch(visit, nowMs, staff);
  push(state, { at: nowMs, actor: by, clientId: client.id, visitId, kind: "move", text: staff ? "Визит перенесён сотрудником." : "Клиент попросил другое время — ждёт подтверждения.", internal: false });
  return { ok: true, state, visit };
}

export function cancelVisit(current: DeskState, visitId: string, by: string, message: string, nowMs: number): DeskState {
  const found = find(current, visitId);
  if (!found || !canDo(found.visit.status, "cancel")) return current;
  const { state, visit, client } = found;
  const staff = by !== "client";
  visit.status = "cancelled";
  visit.cancelledBy = staff ? "staff" : "client";
  visit.clientMessage = staff ? message : "";
  touch(visit, nowMs, staff);
  if (client.stage === "visit_planned") client.stage = "new";
  push(state, { at: nowMs, actor: by, clientId: client.id, visitId, kind: "cancel", text: staff ? `Визит отменён сотрудником${message ? `: ${message}` : "."}` : "Клиент отменил запрос.", internal: false });
  return state;
}

export function assignVisit(current: DeskState, visitId: string, staffId: string, by: string, nowMs: number): ChangeResult {
  const found = find(current, visitId);
  if (!found || !canDo(found.visit.status, "assign")) return { ok: false, reason: "not_allowed" };
  const { state, visit, client } = found;
  const check = book(snapshotOf(state), { propertyId: visit.propertyId, startUtc: visit.startUtc, staffId, ignoreVisitId: visit.id, internal: true }, Math.min(nowMs, visit.startUtc));
  if (!check.ok) return { ok: false, reason: "staff_busy" };
  visit.staffId = staffId;
  client.ownerId = staffId;
  touch(visit, nowMs, true);
  push(state, { at: nowMs, actor: by, clientId: client.id, visitId, kind: "assign", text: `Ответственный: ${state.staff.find((person) => person.id === staffId)?.name ?? staffId}.`, internal: true });
  return { ok: true, state, visit };
}

export function recordResult(current: DeskState, visitId: string, outcome: "completed" | "no_show", text: string, by: string, nowMs: number): DeskState {
  const found = find(current, visitId);
  if (!found || !canDo(found.visit.status, outcome === "completed" ? "complete" : "no_show")) return current;
  const { state, visit, client } = found;
  visit.status = outcome;
  visit.result = text;
  touch(visit, nowMs, true);
  if (outcome === "completed" && ["new", "visit_planned"].includes(client.stage)) client.stage = "visited";
  if (outcome === "no_show" && client.stage === "visit_planned") client.stage = "new";
  push(state, { at: nowMs, actor: by, clientId: client.id, visitId, kind: outcome === "completed" ? "result" : "no_show", text: text || (outcome === "completed" ? "Просмотр состоялся." : "Клиент не пришёл."), internal: true });
  return state;
}

const withClient = (current: DeskState, clientId: string, change: (state: DeskState, client: DemoClient) => void): DeskState => {
  const state = clone(current);
  const client = state.clients.find((item) => item.id === clientId);
  if (!client) return current;
  change(state, client);
  return state;
};

export const addNote = (current: DeskState, clientId: string, visitId: string | null, text: string, by: string, nowMs: number) =>
  withClient(current, clientId, (state, client) => push(state, { at: nowMs, actor: by, clientId: client.id, visitId, kind: "note", text, internal: true }));

export const setNextAction = (current: DeskState, clientId: string, text: string, dueUtc: number | null, by: string, nowMs: number) =>
  withClient(current, clientId, (state, client) => {
    client.nextAction = text && dueUtc ? { text, dueUtc } : null;
    push(state, { at: nowMs, actor: by, clientId: client.id, visitId: null, kind: "next", text: client.nextAction ? `Следующее действие: ${text}` : "Следующее действие снято.", internal: true });
  });

export const sendOffer = (current: DeskState, clientId: string, title: string, note: string, by: string, nowMs: number) =>
  withClient(current, clientId, (state, client) => {
    state.offers.push({ id: uid("o"), clientId, at: nowMs, by, title, note });
    if (["new", "visit_planned", "visited"].includes(client.stage)) client.stage = "offer_sent";
    push(state, { at: nowMs, actor: by, clientId, visitId: null, kind: "offer", text: `Отправлено коммерческое предложение: ${title}.`, internal: true });
  });

export const setStage = (current: DeskState, clientId: string, stage: DealStage, reason: string, by: string, nowMs: number) =>
  withClient(current, clientId, (state, client) => {
    client.stage = stage;
    client.lostReason = stage === "lost" ? reason : "";
    if (stage === "won" || stage === "lost") client.nextAction = null;
    push(state, { at: nowMs, actor: by, clientId, visitId: null, kind: "stage", text: stage === "won" ? "Переговоры завершены: договор аренды." : stage === "lost" ? `Переговоры завершены без договора${reason ? `: ${reason}` : "."}` : `Этап: ${stage}.`, internal: true });
  });

export const setOwner = (current: DeskState, clientId: string, staffId: string, by: string, nowMs: number) =>
  withClient(current, clientId, (state, client) => {
    client.ownerId = staffId;
    push(state, { at: nowMs, actor: by, clientId, visitId: null, kind: "assign", text: `Ответственный за клиента: ${state.staff.find((person) => person.id === staffId)?.name ?? staffId}.`, internal: true });
  });

export const verifyLink = (current: DeskState, clientId: string, index: number, by: string, nowMs: number) =>
  withClient(current, clientId, (state, client) => {
    if (!client.links[index]) return;
    client.links[index].verified = true;
    push(state, { at: nowMs, actor: by, clientId, visitId: null, kind: "link", text: "Связь записей подтверждена сотрудником.", internal: true });
  });

export type NewClient = { name: string; company: string; phone: string; email: string; needs: string; source: VisitSource; locale: Locale; propertyId: string; enquiryId?: string };

/** register a client after a call or from a conversation — or return the existing record when the contact is already known */
export function registerClient(current: DeskState, input: NewClient, by: string, nowMs: number): { state: DeskState; clientId: string; existed: boolean } {
  const state = clone(current);
  const match = matchClient(state.clients, { phone: input.phone, email: input.email });
  let clientId: string;
  if (match) {
    clientId = match.client.id;
    if (!match.client.links.some((link) => link.channel === input.source)) match.client.links.push({ channel: input.source, label: "добавлено сотрудником", verified: true });
    if (input.needs) push(state, { at: nowMs, actor: by, clientId, visitId: null, kind: "note", text: input.needs, internal: true });
  } else {
    clientId = uid("c");
    state.clients.push({
      id: clientId, name: input.name, company: input.company, phone: input.phone, email: input.email, locale: input.locale, propertyId: input.propertyId, source: input.source, stage: "new",
      ownerId: state.staff.find((person) => person.id === by)?.conducts ? by : null, needs: input.needs, nextAction: null, createdAt: nowMs, lostReason: "", links: [{ channel: input.source, label: "создано сотрудником", verified: true }],
    });
    push(state, { at: nowMs, actor: by, clientId, visitId: null, kind: "client", text: "Клиент зарегистрирован сотрудником.", internal: true });
  }
  if (input.enquiryId) {
    const enquiry = state.enquiries.find((item) => item.id === input.enquiryId);
    if (enquiry) { enquiry.handled = true; enquiry.clientId = clientId; }
  }
  return { state, clientId, existed: Boolean(match) };
}

export function addBlock(current: DeskState, block: Omit<Block, "id">, by: string, nowMs: number): DeskState {
  const state = clone(current);
  state.blocks.push({ ...block, id: uid("b") });
  push(state, { at: nowMs, actor: by, clientId: null, visitId: null, kind: "schedule", text: `Время закрыто: ${block.date} ${block.from}–${block.to}${block.reason ? ` · ${block.reason}` : ""}.`, internal: true });
  return state;
}

export function removeBlock(current: DeskState, blockId: string, by: string, nowMs: number): DeskState {
  const state = clone(current);
  state.blocks = state.blocks.filter((block) => block.id !== blockId);
  push(state, { at: nowMs, actor: by, clientId: null, visitId: null, kind: "schedule", text: "Блокировка времени снята.", internal: true });
  return state;
}

export function updateConfig(current: DeskState, patch: Partial<ScheduleConfig>, by: string, nowMs: number): DeskState {
  const state = clone(current);
  state.config = { ...state.config, ...patch };
  push(state, { at: nowMs, actor: by, clientId: null, visitId: null, kind: "schedule", text: "Параметры расписания изменены.", internal: true });
  return state;
}

export function updateStaff(current: DeskState, staffId: string, patch: Partial<Staff>, by: string, nowMs: number): DeskState {
  const state = clone(current);
  state.staff = state.staff.map((person) => (person.id === staffId ? { ...person, ...patch } : person));
  push(state, { at: nowMs, actor: by, clientId: null, visitId: null, kind: "schedule", text: `Расписание сотрудника изменено: ${state.staff.find((person) => person.id === staffId)?.name ?? staffId}.`, internal: true });
  return state;
}

/** the visit a visitor's link opens — by its key, never by a guessable number */
export const visitByToken = (state: DeskState, token: string) => state.visits.find((visit) => visit.token === token) ?? null;

/** the first day with a free interval, for the planner's first view */
export function firstOpenDate(state: DeskState, propertyId: string, nowMs: number): LocalDate | null {
  const today = toZoned(nowMs, state.config.timezone).date;
  for (let i = 0; i <= state.config.horizonDays; i += 1) {
    const date = addDays(today, i);
    if (slotsForDate(snapshotOf(state), propertyId, date, nowMs).length) return date;
  }
  return null;
}
