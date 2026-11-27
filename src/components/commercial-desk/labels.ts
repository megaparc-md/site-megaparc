import type { DemoClient, DemoVisit, DeskState } from "@/components/visit-planner/store";
import { addDays, toZoned, type DealStage, type LocalDate, type StaffRole, type VisitSource, type VisitStatus } from "@/lib/visits/engine";

/** COMMERCIAL DESK — the employees' wording (Russian, like the tenant cabinet demonstration) and the formatters of the cabinet. */
export const statusLabel: Record<VisitStatus, string> = { requested: "Ждёт подтверждения", confirmed: "Подтверждён", completed: "Состоялся", no_show: "Неявка", cancelled: "Отменён", declined: "Отклонён" };
export const stageLabel: Record<DealStage, string> = { new: "Новое обращение", visit_planned: "Просмотр назначен", visited: "Просмотр состоялся", offer_sent: "Предложение отправлено", negotiation: "Переговоры", won: "Договор аренды", lost: "Без договора" };
export const stageOrder: DealStage[] = ["new", "visit_planned", "visited", "offer_sent", "negotiation", "won", "lost"];
export const sourceLabel: Record<VisitSource, string> = { site: "Сайт · запись на просмотр", tour: "Тур 360°", assistant: "Чат на сайте", telegram: "Telegram", phone: "Звонок", terms: "Коммерческие условия", desk: "Создано сотрудником" };
export const roleLabel: Record<StaffRole, string> = { administrator: "Администратор", manager: "Коммерческий менеджер", operator: "Оператор", management: "Руководство · только чтение" };
export const localeLabel = { ro: "Română", ru: "Русский", en: "English" } as const;
export const propertyLabel: Record<string, string> = { "moscova-20": "Moscova 20" };
export const weekdayLabel = ["", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота", "Воскресенье"];

const utc = (date: LocalDate) => { const [y, m, d] = date.split("-").map(Number); return Date.UTC(y, m - 1, d); };
const fmt = (options: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat("ru-RU", { ...options, timeZone: "UTC" });
const short = fmt({ weekday: "short", day: "numeric", month: "long" });
const long = fmt({ weekday: "long", day: "numeric", month: "long" });
const numeric = fmt({ day: "2-digit", month: "2-digit", year: "numeric" });

export const dayShort = (date: LocalDate) => short.format(utc(date));
export const dayLong = (date: LocalDate) => { const text = long.format(utc(date)); return text.charAt(0).toUpperCase() + text.slice(1); };
export const dayNumeric = (date: LocalDate) => numeric.format(utc(date));

/** «сегодня», «завтра», «вчера» or the short date — in the property's time zone */
export function dayRelative(date: LocalDate, today: LocalDate) {
  if (date === today) return "сегодня";
  if (date === addDays(today, 1)) return "завтра";
  if (date === addDays(today, -1)) return "вчера";
  return dayShort(date);
}

export const whenOf = (state: DeskState, visit: DemoVisit) => {
  const start = toZoned(visit.startUtc, state.config.timezone);
  return { date: start.date, time: start.time, end: toZoned(visit.endUtc, state.config.timezone).time };
};

/** an instant as «27.11.2026, 10:42» in the property's time zone */
export const stamp = (state: DeskState, ms: number) => { const z = toZoned(ms, state.config.timezone); return `${dayNumeric(z.date)}, ${z.time}`; };

export const staffName = (state: DeskState, id: string | null) => (id === "client" ? "Клиент" : id === "system" ? "Система" : state.staff.find((person) => person.id === id)?.name ?? "Не назначен");
export const clientTitle = (client: DemoClient) => (client.company ? `${client.name} · ${client.company}` : client.name);
export const percent = (value: number) => `${Math.round(value * 100)} %`;
export const minutesLabel = (value: number | null) => (value === null ? "—" : value < 90 ? `${value} мин` : `${(value / 60).toFixed(1).replace(".", ",")} ч`);
