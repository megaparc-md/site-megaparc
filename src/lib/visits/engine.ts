/**
 * MEGAPARC VISIT PLANNER — the scheduling engine (OWNER «VISIT PLANNER & COMMERCIAL DESK V1», 2026-11-27).
 *
 * One pure module, no imports, no browser or server API except Intl: the same code decides availability in the OWNER preview
 * (a demonstration store in the visitor's own browser) and — in the next stage — inside the server (the Cloudflare Worker of the
 * Commercial Assistant, with D1 as the store). Nothing here knows where the data lives.
 *
 * Rules the engine holds:
 *   · every instant is stored as UTC milliseconds; a calendar date and a wall-clock time exist only in the property's time zone
 *     (Europe/Chisinau) and are converted with the zone's real offset of that day (summer / winter time);
 *   · an interval is offered only when the property's viewing hours, a free employee who shows this property, no holiday, no time
 *     off, no manual block, the buffer around the employee's other visits, the minimum notice and the booking horizon all agree;
 *   · a request holds its interval from the moment it is received (status «requested») — two visitors never get the same employee
 *     or the same property at the same time; `book()` re-checks availability at the moment of writing (the server repeats the same
 *     check inside one transaction, with a unique lock per resource and time bucket);
 *   · the schedule parameters are data (ScheduleConfig), never constants of the code — the OWNER approves the values.
 */

/* ------------------------------------------------------------------ */
/* Time                                                                 */
/* ------------------------------------------------------------------ */

export const VISIT_TZ = "Europe/Chisinau";

/** a calendar date in the property's time zone, «2026-11-30» */
export type LocalDate = string;
/** a wall-clock time in the property's time zone, «09:30» */
export type LocalTime = string;
/** ISO weekday: 1 Monday … 7 Sunday */
export type Weekday = 1 | 2 | 3 | 4 | 5 | 6 | 7;
export type Interval = { from: LocalTime; to: LocalTime };

const MINUTE = 60_000;
const formatters = new Map<string, Intl.DateTimeFormat>();

function zoneParts(ms: number, tz: string): { date: LocalDate; time: LocalTime } {
  let f = formatters.get(tz);
  if (!f) {
    f = new Intl.DateTimeFormat("en-CA", { timeZone: tz, hourCycle: "h23", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" });
    formatters.set(tz, f);
  }
  const p: Record<string, string> = {};
  for (const part of f.formatToParts(ms)) p[part.type] = part.value;
  return { date: `${p.year}-${p.month}-${p.day}`, time: `${p.hour === "24" ? "00" : p.hour}:${p.minute}` };
}

const pad = (n: number) => String(n).padStart(2, "0");
export const toMinutes = (time: LocalTime) => { const [h, m] = time.split(":").map(Number); return h * 60 + m; };
export const fromMinutes = (minutes: number): LocalTime => `${pad(Math.floor(minutes / 60))}:${pad(minutes % 60)}`;

export function weekdayOf(date: LocalDate): Weekday {
  const [y, m, d] = date.split("-").map(Number);
  const day = new Date(Date.UTC(y, m - 1, d)).getUTCDay();
  return (day === 0 ? 7 : day) as Weekday;
}

export function addDays(date: LocalDate, days: number): LocalDate {
  const [y, m, d] = date.split("-").map(Number);
  const next = new Date(Date.UTC(y, m - 1, d + days));
  return `${next.getUTCFullYear()}-${pad(next.getUTCMonth() + 1)}-${pad(next.getUTCDate())}`;
}

/** whole days from `a` to `b` (b − a) */
export function daysBetween(a: LocalDate, b: LocalDate): number {
  const at = (date: LocalDate) => { const [y, m, d] = date.split("-").map(Number); return Date.UTC(y, m - 1, d); };
  return Math.round((at(b) - at(a)) / 86_400_000);
}

/** the calendar date, wall-clock time and weekday of an instant in the zone */
export function toZoned(ms: number, tz: string = VISIT_TZ): { date: LocalDate; time: LocalTime; weekday: Weekday } {
  const p = zoneParts(ms, tz);
  return { ...p, weekday: weekdayOf(p.date) };
}

/**
 * The instant of a wall-clock time on a calendar date in the zone — with the offset that is really in force that day.
 * Returns null for a time that does not exist (the hour skipped when summer time starts).
 */
export function fromZoned(date: LocalDate, time: LocalTime, tz: string = VISIT_TZ): number | null {
  const [y, m, d] = date.split("-").map(Number);
  const [hh, mm] = time.split(":").map(Number);
  const asUtc = Date.UTC(y, m - 1, d, hh, mm);
  const offsetAt = (ms: number) => {
    const p = zoneParts(ms, tz);
    const [Y, M, D] = p.date.split("-").map(Number);
    const [H, Mi] = p.time.split(":").map(Number);
    return Date.UTC(Y, M - 1, D, H, Mi) - ms;
  };
  let ms = asUtc - offsetAt(asUtc);
  ms = asUtc - offsetAt(ms);
  const back = zoneParts(ms, tz);
  return back.date === date && back.time === time ? ms : null;
}

/* ------------------------------------------------------------------ */
/* Schedule data                                                        */
/* ------------------------------------------------------------------ */

export type WeekHours = Partial<Record<Weekday, Interval[]>>;

/** The parameters of the schedule — data the OWNER approves; the engine has no default of its own. */
export type ScheduleConfig = {
  timezone: string;
  /** the length of one viewing, minutes */
  visitMinutes: number;
  /** the grid of start times, minutes (60 → 09:00, 10:00 …) */
  stepMinutes: number;
  /** free time kept before and after every visit of the same employee, minutes */
  bufferMinutes: number;
  /** the earliest a visitor can book: now + this many hours */
  minNoticeHours: number;
  /** the latest a visitor can book: today + this many days */
  horizonDays: number;
  /** the hours in which viewings are held (per weekday) */
  week: WeekHours;
  /** non-working days */
  holidays: { date: LocalDate; name: string }[];
  /** the property itself is a limited resource: viewings held at the same time */
  propertyCapacity: number;
  /** viewings one employee takes a day (0 = no limit) */
  maxPerEmployeePerDay: number;
};

export type StaffRole = "administrator" | "manager" | "operator" | "management";

export type Staff = {
  id: string;
  /** what the visitor and the cabinet show — a role label, never a private name in the demonstration */
  name: string;
  role: StaffRole;
  /** shows properties to visitors (an operator or the management does not) */
  conducts: boolean;
  active: boolean;
  /** the properties this employee shows */
  properties: string[];
  /** the employee's own hours; absent weekday → the property's hours */
  week?: WeekHours;
  timeOff: { from: LocalDate; to: LocalDate; reason: string }[];
};

/** a manual block of time: one employee (staffId) or the whole property (staffId null) */
export type Block = { id: string; propertyId: string | null; staffId: string | null; date: LocalDate; from: LocalTime; to: LocalTime; reason: string };

export type VisitStatus = "requested" | "confirmed" | "completed" | "no_show" | "cancelled" | "declined";
export type VisitSource = "site" | "tour" | "assistant" | "telegram" | "phone" | "terms" | "desk";

/** what the availability check needs to know about a visit */
export type BusyVisit = { id: string; propertyId: string; staffId: string | null; startUtc: number; endUtc: number; status: VisitStatus };

export type ScheduleSnapshot = { config: ScheduleConfig; staff: Staff[]; blocks: Block[]; visits: BusyVisit[] };

export type Slot = {
  date: LocalDate;
  time: LocalTime;
  endTime: LocalTime;
  startUtc: number;
  endUtc: number;
  /** the employees who are free for this interval, the least loaded that day first */
  staffIds: string[];
};

/** a visit in one of these states holds its interval */
export const HOLDING: VisitStatus[] = ["requested", "confirmed"];
const holds = (visit: BusyVisit) => HOLDING.includes(visit.status);

const overlap = (aFrom: number, aTo: number, bFrom: number, bTo: number) => aFrom < bTo && bFrom < aTo;

/** intersection of two sets of intervals (minutes of the day) */
function intersect(a: Interval[], b: Interval[]): Interval[] {
  const out: Interval[] = [];
  for (const x of a) for (const y of b) {
    const from = Math.max(toMinutes(x.from), toMinutes(y.from));
    const to = Math.min(toMinutes(x.to), toMinutes(y.to));
    if (to > from) out.push({ from: fromMinutes(from), to: fromMinutes(to) });
  }
  return out;
}

export const isHoliday = (config: ScheduleConfig, date: LocalDate) => config.holidays.find((holiday) => holiday.date === date) ?? null;

export const onTimeOff = (person: Staff, date: LocalDate) => person.timeOff.some((off) => off.from <= date && date <= off.to);

/** the hours an employee can show a property on a date — the property's viewing hours cut by the employee's own */
export function staffHours(config: ScheduleConfig, person: Staff, date: LocalDate): Interval[] {
  const day = weekdayOf(date);
  const property = config.week[day] ?? [];
  if (!person.active || !person.conducts || onTimeOff(person, date)) return [];
  const own = person.week?.[day];
  return own ? intersect(property, own) : property;
}

export type SlotOptions = {
  /** leave this visit out of the conflicts (moving it to another time) */
  ignoreVisitId?: string;
  /** only this employee */
  staffId?: string;
  /** an employee books by hand: the minimum notice and the horizon do not apply (the past still does) */
  internal?: boolean;
};

/**
 * The intervals that can really be booked for a property on a date. Empty when the date is a holiday, outside the horizon,
 * a day without viewing hours, or when every employee is busy, away or blocked.
 */
export function slotsForDate(snapshot: ScheduleSnapshot, propertyId: string, date: LocalDate, nowMs: number, options: SlotOptions = {}): Slot[] {
  const { config } = snapshot;
  const tz = config.timezone;
  const today = toZoned(nowMs, tz).date;
  if (date < today) return [];
  if (!options.internal && daysBetween(today, date) > config.horizonDays) return [];
  if (isHoliday(config, date)) return [];
  const earliest = options.internal ? nowMs : nowMs + config.minNoticeHours * 60 * MINUTE;
  const buffer = config.bufferMinutes * MINUTE;
  const visits = snapshot.visits.filter((visit) => holds(visit) && visit.id !== options.ignoreVisitId);
  const people = snapshot.staff.filter((person) => person.properties.includes(propertyId) && (!options.staffId || person.id === options.staffId));

  // the zone's offset of this day, read once at noon (a switch of the clock happens at night): every start after 05:00 is computed
  // from it without asking the zone again — a range of days stays cheap for the server
  const [yy, mo, dd] = date.split("-").map(Number);
  const noonUtc = fromZoned(date, "12:00", tz);
  const dayOffset = noonUtc === null ? null : Date.UTC(yy, mo - 1, dd, 12, 0) - noonUtc;
  const startOf = (minute: number): number | null => (dayOffset !== null && minute >= 300 ? Date.UTC(yy, mo - 1, dd, 0, minute) - dayOffset : fromZoned(date, fromMinutes(minute), tz));
  const dayFrom = noonUtc === null ? 0 : noonUtc - 12 * 60 * MINUTE;
  const dayTo = noonUtc === null ? 0 : noonUtc + 12 * 60 * MINUTE;
  // only the visits that can touch this day are looked at for its intervals (the buffer included): a long list of visits costs once a day, not once an interval
  const near = noonUtc === null ? visits : visits.filter((visit) => visit.endUtc + buffer > dayFrom && visit.startUtc - buffer < dayTo);
  const loads = new Map<string, number>();
  for (const visit of near) if (visit.staffId && (noonUtc === null ? toZoned(visit.startUtc, tz).date === date : visit.startUtc >= dayFrom && visit.startUtc < dayTo)) loads.set(visit.staffId, (loads.get(visit.staffId) ?? 0) + 1);
  const dayLoad = (staffId: string) => loads.get(staffId) ?? 0;
  const byStart = new Map<number, Slot>();
  for (const person of people) {
    if (config.maxPerEmployeePerDay > 0 && dayLoad(person.id) >= config.maxPerEmployeePerDay) continue;
    for (const hours of staffHours(config, person, date)) {
      const last = toMinutes(hours.to) - config.visitMinutes;
      for (let minute = toMinutes(hours.from); minute <= last; minute += config.stepMinutes) {
        const time = fromMinutes(minute);
        const startUtc = startOf(minute);
        if (startUtc === null || startUtc < earliest) continue;
        const endUtc = startUtc + config.visitMinutes * MINUTE;
        // the employee: other visits with the buffer around them, and the manual blocks
        if (near.some((visit) => visit.staffId === person.id && overlap(startUtc - buffer, endUtc + buffer, visit.startUtc, visit.endUtc))) continue;
        const blocked = snapshot.blocks.some((block) => {
          if (block.date !== date) return false;
          const mine = block.staffId === person.id || (block.staffId === null && (block.propertyId === null || block.propertyId === propertyId));
          return mine && overlap(minute, minute + config.visitMinutes, toMinutes(block.from), toMinutes(block.to));
        });
        if (blocked) continue;
        // the property: no more viewings at once than it can hold
        const together = near.filter((visit) => visit.propertyId === propertyId && overlap(startUtc, endUtc, visit.startUtc, visit.endUtc)).length;
        if (together >= config.propertyCapacity) continue;
        const slot = byStart.get(startUtc) ?? { date, time, endTime: fromMinutes(minute + config.visitMinutes), startUtc, endUtc, staffIds: [] };
        slot.staffIds.push(person.id);
        byStart.set(startUtc, slot);
      }
    }
  }
  const slots = [...byStart.values()].sort((a, b) => a.startUtc - b.startUtc);
  for (const slot of slots) slot.staffIds.sort((a, b) => dayLoad(a) - dayLoad(b) || a.localeCompare(b));
  return slots;
}

/** the number of bookable intervals per date, from `from` for `days` days — what the calendar shows as open days */
export function openDays(snapshot: ScheduleSnapshot, propertyId: string, from: LocalDate, days: number, nowMs: number, options: SlotOptions = {}): Record<LocalDate, number> {
  const out: Record<LocalDate, number> = {};
  for (let i = 0; i < days; i += 1) {
    const date = addDays(from, i);
    out[date] = slotsForDate(snapshot, propertyId, date, nowMs, options).length;
  }
  return out;
}

export type BookRequest = { propertyId: string; startUtc: number; staffId?: string | null; ignoreVisitId?: string; internal?: boolean };
export type BookResult = { ok: true; slot: Slot; staffId: string } | { ok: false; reason: "slot_taken" | "staff_busy" };

/**
 * The check made at the moment of writing: is the interval still free, and who takes it. The caller writes the visit only on
 * `ok` — in the server this runs inside the transaction that also inserts the lock rows.
 */
export function book(snapshot: ScheduleSnapshot, request: BookRequest, nowMs: number): BookResult {
  const date = toZoned(request.startUtc, snapshot.config.timezone).date;
  const slots = slotsForDate(snapshot, request.propertyId, date, nowMs, { ignoreVisitId: request.ignoreVisitId, internal: request.internal });
  const slot = slots.find((item) => item.startUtc === request.startUtc);
  if (!slot) return { ok: false, reason: "slot_taken" };
  if (request.staffId) return slot.staffIds.includes(request.staffId) ? { ok: true, slot, staffId: request.staffId } : { ok: false, reason: "staff_busy" };
  return { ok: true, slot, staffId: slot.staffIds[0] };
}

/**
 * The lock keys of a visit for the server store: one per resource and grid bucket it covers (the employee's keys include the
 * buffer before the visit, so two visits of one employee collide exactly when the gap between them is shorter than the buffer). A UNIQUE index on the key makes a
 * second writer fail even if two requests pass the check at the same instant. The grid step, the visit length and the buffer must be
 * multiples of the bucket.
 */
export function lockKeys(config: ScheduleConfig, visit: { propertyId: string; staffId: string | null; startUtc: number; endUtc: number }, bucketMinutes = 15): string[] {
  const bucket = bucketMinutes * MINUTE;
  const keys: string[] = [];
  const cover = (prefix: string, from: number, to: number) => {
    for (let t = Math.floor(from / bucket) * bucket; t < to; t += bucket) keys.push(`${prefix}:${t / bucket}`);
  };
  if (config.propertyCapacity === 1) cover(`p:${visit.propertyId}`, visit.startUtc, visit.endUtc);
  if (visit.staffId) cover(`s:${visit.staffId}`, visit.startUtc - config.bufferMinutes * MINUTE, visit.endUtc);
  return keys;
}

/* ------------------------------------------------------------------ */
/* The life of a visit                                                  */
/* ------------------------------------------------------------------ */

export type VisitAction = "confirm" | "decline" | "reschedule" | "cancel" | "assign" | "complete" | "no_show" | "reopen";

/** which action is possible from which status, and where it leads (reschedule and assign keep the status) */
export const TRANSITIONS: Record<VisitAction, { from: VisitStatus[]; to: VisitStatus | null }> = {
  confirm: { from: ["requested"], to: "confirmed" },
  decline: { from: ["requested"], to: "declined" },
  reschedule: { from: ["requested", "confirmed"], to: null },
  assign: { from: ["requested", "confirmed"], to: null },
  cancel: { from: ["requested", "confirmed"], to: "cancelled" },
  complete: { from: ["confirmed"], to: "completed" },
  no_show: { from: ["confirmed"], to: "no_show" },
  reopen: { from: ["completed", "no_show"], to: "confirmed" },
};

export const canDo = (status: VisitStatus, action: VisitAction) => TRANSITIONS[action].from.includes(status);

/** the visitor is told «confirmed» only in this state — never while the request waits for an employee */
export const isConfirmedForClient = (status: VisitStatus) => status === "confirmed" || status === "completed";

/* ------------------------------------------------------------------ */
/* Access                                                               */
/* ------------------------------------------------------------------ */

export type Permission =
  | "visit.read" | "visit.create" | "visit.confirm" | "visit.reschedule" | "visit.cancel" | "visit.assign" | "visit.result"
  | "client.read" | "client.edit" | "client.merge" | "client.erase" | "note.write" | "offer.send" | "deal.close"
  | "schedule.edit" | "availability.edit" | "staff.manage" | "analytics.read" | "analytics.export" | "audit.read"
  | "chat.read" | "chat.reply" | "chat.assign" | "client.transfer";

const ALL: Permission[] = [
  "visit.read", "visit.create", "visit.confirm", "visit.reschedule", "visit.cancel", "visit.assign", "visit.result",
  "client.read", "client.edit", "client.merge", "client.erase", "note.write", "offer.send", "deal.close",
  "schedule.edit", "availability.edit", "staff.manage", "analytics.read", "analytics.export", "audit.read",
  "chat.read", "chat.reply", "chat.assign", "client.transfer",
];

/**
 * The server is the only place this table is enforced; the cabinet reads it to hide what a role cannot do.
 * OWNER «VISIT PLANNER & COMMERCIAL DESK V2» (2026-11-27): the parameters of the planner are changed by the ADMINISTRATOR only
 * (`schedule.edit`); holidays belong to them; time off, an employee's own hours and manual blocks are set apart (`availability.edit`);
 * the head of the department (`management`) reads everything, including the full history of actions, and changes nothing.
 */
export const PERMISSIONS: Record<StaffRole, Permission[]> = {
  administrator: ALL,
  manager: ALL.filter((p) => !["staff.manage", "client.erase", "audit.read", "schedule.edit"].includes(p)),
  operator: ["visit.read", "visit.create", "visit.reschedule", "visit.cancel", "client.read", "client.edit", "note.write", "chat.read", "chat.reply"],
  management: ["visit.read", "client.read", "chat.read", "analytics.read", "analytics.export", "audit.read"],
};

export const can = (role: StaffRole, permission: Permission) => PERMISSIONS[role].includes(permission);

/* ------------------------------------------------------------------ */
/* One client, many channels                                            */
/* ------------------------------------------------------------------ */

/** digits of a telephone in one form: «+373 78 803 010», «078803010», «0037378803010» → «37378803010» */
export function normalisePhone(raw: string): string {
  let digits = raw.replace(/\D+/g, "");
  if (digits.startsWith("00")) digits = digits.slice(2);
  if (digits.length === 9 && digits.startsWith("0")) digits = `373${digits.slice(1)}`;
  else if (digits.length === 8) digits = `373${digits}`;
  return digits;
}

export const normaliseEmail = (raw: string) => raw.trim().toLowerCase();

export type ContactKeys = { phone?: string; email?: string };

/**
 * A candidate for «the same client»: the same telephone or the same e-mail after normalisation. A match is only a proposal —
 * records are joined when the contact is verified (a code sent to it) or an employee confirms the link; never silently.
 */
export function matchClient<T extends { id: string; phone: string; email: string }>(clients: T[], keys: ContactKeys): { client: T; by: "phone" | "email" } | null {
  const phone = keys.phone ? normalisePhone(keys.phone) : "";
  const email = keys.email ? normaliseEmail(keys.email) : "";
  for (const client of clients) {
    if (phone.length >= 8 && normalisePhone(client.phone) === phone) return { client, by: "phone" };
    if (email && normaliseEmail(client.email) === email) return { client, by: "email" };
  }
  return null;
}

/* ------------------------------------------------------------------ */
/* Calendar file for the visitor                                        */
/* ------------------------------------------------------------------ */

const icsStamp = (ms: number) => new Date(ms).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
const icsText = (text: string) => text.replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/([,;])/g, "\\$1");

/** an iCalendar event (UTC instants, so every calendar shows the visitor's own local time) — offered only for a confirmed visit */
export function icsEvent(event: { uid: string; startUtc: number; endUtc: number; title: string; location: string; description: string; url?: string; stampUtc: number }): string {
  const lines = [
    "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//MEGAPARC//Visit Planner//EN", "CALSCALE:GREGORIAN", "METHOD:PUBLISH",
    "BEGIN:VEVENT", `UID:${event.uid}`, `DTSTAMP:${icsStamp(event.stampUtc)}`, `DTSTART:${icsStamp(event.startUtc)}`, `DTEND:${icsStamp(event.endUtc)}`,
    `SUMMARY:${icsText(event.title)}`, `LOCATION:${icsText(event.location)}`, `DESCRIPTION:${icsText(event.description)}`,
    ...(event.url ? [`URL:${event.url}`] : []),
    "BEGIN:VALARM", "TRIGGER:-PT2H", "ACTION:DISPLAY", `DESCRIPTION:${icsText(event.title)}`, "END:VALARM",
    "END:VEVENT", "END:VCALENDAR",
  ];
  return lines.join("\r\n");
}

/** several events as one calendar — the read-only subscription of an employee (their confirmed viewings) */
export function icsCalendar(name: string, events: { uid: string; startUtc: number; endUtc: number; title: string; location: string; description: string; stampUtc: number; sequence?: number }[]): string {
  const lines = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//MEGAPARC//Visit Planner//EN", "CALSCALE:GREGORIAN", "METHOD:PUBLISH", `X-WR-CALNAME:${icsText(name)}`, "X-WR-TIMEZONE:Europe/Chisinau"];
  for (const event of events) {
    lines.push("BEGIN:VEVENT", `UID:${event.uid}`, `SEQUENCE:${event.sequence ?? 0}`, `DTSTAMP:${icsStamp(event.stampUtc)}`, `DTSTART:${icsStamp(event.startUtc)}`, `DTEND:${icsStamp(event.endUtc)}`, `SUMMARY:${icsText(event.title)}`, `LOCATION:${icsText(event.location)}`, `DESCRIPTION:${icsText(event.description)}`, "END:VEVENT");
  }
  lines.push("END:VCALENDAR");
  return lines.join("\r\n");
}

/* ------------------------------------------------------------------ */
/* Management figures                                                   */
/* ------------------------------------------------------------------ */

export type DealStage = "new" | "visit_planned" | "visited" | "offer_sent" | "negotiation" | "won" | "lost";

export type AnalyticsVisit = { propertyId: string; staffId: string | null; status: VisitStatus; source: VisitSource; createdAt: number; firstResponseAt: number | null; startUtc: number };
export type AnalyticsClient = { propertyId: string; ownerId: string | null; stage: DealStage; source: VisitSource; createdAt: number; offers: number };

export type Analytics = {
  enquiries: number;
  planned: number;
  confirmed: number;
  held: number;
  cancelled: number;
  noShow: number;
  offers: number;
  leases: number;
  /** leases ÷ enquiries, 0…1 */
  conversion: number;
  /** median minutes from a request to the first action of an employee; null when nothing was answered */
  responseMinutes: number | null;
  byProperty: Record<string, { enquiries: number; held: number; leases: number }>;
  byStaff: Record<string, { visits: number; held: number; leases: number; responseMinutes: number | null }>;
  bySource: Record<string, number>;
};

const median = (values: number[]) => {
  if (!values.length) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
};

/** the figures of a period [fromUtc, toUtc): enquiries and visits by the moment they were created */
export function analytics(visits: AnalyticsVisit[], clients: AnalyticsClient[], fromUtc: number, toUtc: number): Analytics {
  const inRange = (at: number) => at >= fromUtc && at < toUtc;
  const v = visits.filter((visit) => inRange(visit.createdAt));
  const c = clients.filter((client) => inRange(client.createdAt));
  const response = (list: AnalyticsVisit[]) => {
    const value = median(list.filter((visit) => visit.firstResponseAt !== null).map((visit) => ((visit.firstResponseAt as number) - visit.createdAt) / MINUTE));
    return value === null ? null : Math.round(value);
  };
  const leases = c.filter((client) => client.stage === "won").length;
  const out: Analytics = {
    enquiries: c.length,
    planned: v.length,
    confirmed: v.filter((visit) => ["confirmed", "completed", "no_show"].includes(visit.status)).length,
    held: v.filter((visit) => visit.status === "completed").length,
    cancelled: v.filter((visit) => visit.status === "cancelled" || visit.status === "declined").length,
    noShow: v.filter((visit) => visit.status === "no_show").length,
    offers: c.reduce((sum, client) => sum + client.offers, 0),
    leases,
    conversion: c.length ? leases / c.length : 0,
    responseMinutes: response(v),
    byProperty: {},
    byStaff: {},
    bySource: {},
  };
  for (const client of c) {
    const row = (out.byProperty[client.propertyId] ??= { enquiries: 0, held: 0, leases: 0 });
    row.enquiries += 1;
    if (client.stage === "won") row.leases += 1;
    out.bySource[client.source] = (out.bySource[client.source] ?? 0) + 1;
    if (client.ownerId && client.stage === "won") (out.byStaff[client.ownerId] ??= { visits: 0, held: 0, leases: 0, responseMinutes: null }).leases += 1;
  }
  for (const visit of v) {
    if (visit.status === "completed") (out.byProperty[visit.propertyId] ??= { enquiries: 0, held: 0, leases: 0 }).held += 1;
    if (!visit.staffId) continue;
    const row = (out.byStaff[visit.staffId] ??= { visits: 0, held: 0, leases: 0, responseMinutes: null });
    row.visits += 1;
    if (visit.status === "completed") row.held += 1;
  }
  for (const staffId of Object.keys(out.byStaff)) out.byStaff[staffId].responseMinutes = response(v.filter((visit) => visit.staffId === staffId));
  return out;
}
