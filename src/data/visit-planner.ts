import type { ScheduleConfig, Staff } from "@/lib/visits/engine";
import { VISIT_TZ } from "@/lib/visits/engine";

/**
 * MEGAPARC VISIT PLANNER — the registry (OWNER «VISIT PLANNER & COMMERCIAL DESK V1», 2026-11-27).
 *
 * STAGE 1 = OWNER PREVIEW ONLY. The planner and the Commercial Desk exist in the preview edition and work on a demonstration store
 * in the visitor's own browser (labelled test data, nothing is sent, nothing is collected). The production edition renders none of
 * it: `visitPlannerOpen` is false there, every entry falls back to what production shows today (the direct contacts), the routes
 * are removed from the artifact (scripts/package-production.mjs) and the production gate fails on them.
 *
 * A real booking — the server, the employees' accounts, the calendar, notifications, personal data — starts only after the
 * architecture (docs/VISIT_PLANNER_ARCHITECTURE.md) is approved, the privacy wording is legally approved and a separate OWNER GO.
 */
const edition = process.env.NEXT_PUBLIC_SITE_EDITION ?? "production";

/** the planner is offered to visitors — preview edition only in stage 1 */
export const visitPlannerOpen = edition !== "production";

/**
 * The properties a viewing can be planned for. Stage 1: Moscova 20. A property joins by adding its slug here — its name, address,
 * area, status, photographs and map links are read from the property record (never typed again), and the planner opens only while
 * the property has a published unit with the viewing action allowed (a let or reserved unit closes it without a code change).
 */
export const visitProperties: readonly string[] = ["moscova-20"];

/**
 * THE ONE MAIN CALL TO ACTION (OWNER «VISIT PLANNER & COMMERCIAL DESK V2» §2, 2026-11-27) — used wherever a viewing can be planned;
 * the visitor's own action stays «a request» until an employee confirms it.
 */
export const visitCta = { ru: "Запланировать просмотр", ro: "Programați o vizită", en: "Schedule a viewing" } as const;

/** the locale-neutral route of a property's planner */
export const visitRoute = (slug: string) => `/visit/${slug}`;

/** where the employees' cabinet demonstration lives (preview only; root route, Russian) */
export const deskRoute = "/owner-demo/commercial-desk";

const day = [{ from: "09:00", to: "13:00" }, { from: "14:00", to: "17:00" }];

/**
 * THE SCHEDULE — THE INITIAL PARAMETERS ACCEPTED BY THE OWNER («VISIT PLANNER & COMMERCIAL DESK V2» §1, 2026-11-27). They are the
 * first values of the data, never constants of the code: the administrator changes every one of them in the Commercial Desk (in the
 * server they live in the database); holidays, time off and an employee's own hours are set apart.
 *   · Monday–Friday, 09:00–13:00 and 14:00–17:00, Europe/Chisinau; weekends by individual arrangement (an employee books by hand);
 *   · one viewing 45 minutes, 15 minutes free around every visit of the same employee; starts on the hour (the grid is a setting too);
 *   · a visitor books not earlier than 3 hours ahead and not later than 30 days ahead;
 *   · one viewing at a time in a property;
 *   · the public holidays of the Republic of Moldova — the dates below are a draft to be confirmed for each year.
 */
export const proposedSchedule: ScheduleConfig = {
  timezone: VISIT_TZ,
  visitMinutes: 45,
  stepMinutes: 60,
  bufferMinutes: 15,
  minNoticeHours: 3,
  horizonDays: 30,
  week: { 1: day, 2: day, 3: day, 4: day, 5: day },
  holidays: [
    { date: "2026-12-25", name: "Рождество (по новому стилю)" },
    { date: "2027-01-01", name: "Новый год" },
    { date: "2027-01-07", name: "Рождество (по старому стилю)" },
    { date: "2027-01-08", name: "Рождество (по старому стилю), второй день" },
    { date: "2027-03-08", name: "Международный женский день" },
    { date: "2027-05-03", name: "Пасха, второй день" },
    { date: "2027-05-10", name: "Радоница (Paștele Blajinilor)" },
    { date: "2027-06-01", name: "День защиты детей" },
    { date: "2027-08-27", name: "День независимости" },
    { date: "2027-08-31", name: "День языка (Limba noastră)" },
  ],
  propertyCapacity: 1,
  maxPerEmployeePerDay: 0,
};

/**
 * DEMONSTRATION STAFF — roles, never people: no employee name, telephone or account is published or invented. The real roster
 * (who shows which property, who confirms requests) is an OWNER input.
 */
export const demoStaff: Staff[] = [
  { id: "s-admin", name: "Администратор · демо", role: "administrator", conducts: false, active: true, properties: [], timeOff: [] },
  { id: "s-m1", name: "Менеджер по аренде · демо 1", role: "manager", conducts: true, active: true, properties: ["moscova-20"], timeOff: [] },
  { id: "s-m2", name: "Менеджер по аренде · демо 2", role: "manager", conducts: true, active: true, properties: ["moscova-20"], timeOff: [] },
  { id: "s-op", name: "Оператор · демо", role: "operator", conducts: false, active: true, properties: [], timeOff: [] },
  { id: "s-mgmt", name: "Руководство · демо", role: "management", conducts: false, active: true, properties: [], timeOff: [] },
];
