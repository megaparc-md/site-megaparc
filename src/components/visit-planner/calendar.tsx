"use client";

import { addDays, weekdayOf, type LocalDate, type Slot } from "@/lib/visits/engine";

/**
 * The calendar and the list of intervals — shared by the visitor's planner and the employees' cabinet. Both only DISPLAY what the
 * engine computed: a day can be chosen when `open[date] > 0`, an interval exists only when the engine returned it.
 * The calendar is a run of whole weeks from a Monday (six by default): the visitor's booking horizon fits one view, so the days that
 * can be booked are seen at once — a month grid would open on the empty end of the current month.
 */
const utc = (date: LocalDate) => { const [y, m, d] = date.split("-").map(Number); return Date.UTC(y, m - 1, d); };
const cap = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);

/** the Monday of the week of a date */
export const mondayOf = (date: LocalDate): LocalDate => addDays(date, 1 - weekdayOf(date));
export const CALENDAR_WEEKS = 6;

export const formatDay = (date: LocalDate, intl: string, options: Intl.DateTimeFormatOptions = { weekday: "long", day: "numeric", month: "long" }) =>
  cap(new Intl.DateTimeFormat(intl, { ...options, timeZone: "UTC" }).format(utc(date)));
const monthName = (date: LocalDate, intl: string, year: boolean) => new Intl.DateTimeFormat(intl, { month: "long", ...(year ? { year: "numeric" } : {}), timeZone: "UTC" }).format(utc(date)).replace(/\s*г\.$/, "");
const monthShort = (date: LocalDate, intl: string) => new Intl.DateTimeFormat(intl, { month: "short", timeZone: "UTC" }).format(utc(date)).replace(/\.$/, "");
const weekdayNames = (intl: string) => Array.from({ length: 7 }, (_, i) => new Intl.DateTimeFormat(intl, { weekday: "short", timeZone: "UTC" }).format(Date.UTC(2024, 0, 1 + i)));

/** «Ноябрь — декабрь 2026», «Декабрь 2026 — январь 2027», «Декабрь 2026» */
function rangeTitle(first: LocalDate, last: LocalDate, intl: string) {
  if (first.slice(0, 7) === last.slice(0, 7)) return cap(monthName(first, intl, true));
  return `${cap(monthName(first, intl, first.slice(0, 4) !== last.slice(0, 4)))} — ${monthName(last, intl, true)}`;
}

export type CalendarLabels = { prev: string; next: string; open: string; none: string; today: string };

export function Calendar({ start, weeks = CALENDAR_WEEKS, today, last, open, selected, intl, labels, onStart, onSelect }: {
  /** the Monday the view starts on */ start: LocalDate; weeks?: number; today: LocalDate; /** the last date that can be chosen */ last: LocalDate;
  open: Record<LocalDate, number>; selected: LocalDate | null; intl: string; labels: CalendarLabels; onStart: (start: LocalDate) => void; onSelect: (date: LocalDate) => void;
}) {
  const cells = Array.from({ length: weeks * 7 }, (_, i) => addDays(start, i));
  const end = cells[cells.length - 1];
  const canPrev = start > mondayOf(today);
  const canNext = end < last;
  const shift = (weeks - 2) * 7;
  return (
    <div className="vp-cal">
      <div className="vp-cal__head">
        <p className="vp-cal__month" aria-live="polite">{rangeTitle(start < today ? today : start, end > last ? last : end, intl)}</p>
        {canPrev || canNext ? (
          <div className="vp-cal__nav">
            <button type="button" className="vp-cal__arrow" onClick={() => onStart(addDays(start, -shift) < mondayOf(today) ? mondayOf(today) : addDays(start, -shift))} disabled={!canPrev} aria-label={labels.prev}><Arrow back /></button>
            <button type="button" className="vp-cal__arrow" onClick={() => onStart(addDays(start, shift))} disabled={!canNext} aria-label={labels.next}><Arrow /></button>
          </div>
        ) : null}
      </div>
      <div className="vp-cal__week" aria-hidden="true">{weekdayNames(intl).map((name) => <span key={name}>{name}</span>)}</div>
      <div className="vp-cal__grid">
        {cells.map((date, index) => {
          const isOpen = (open[date] ?? 0) > 0 && date >= today && date <= last;
          const name = `${formatDay(date, intl)}${date === today ? `, ${labels.today}` : ""} — ${isOpen ? labels.open : labels.none}`;
          const newMonth = index === 0 || date.endsWith("-01");
          return (
            <button key={date} type="button" className={`vp-day${isOpen ? " is-open" : ""}${date === selected ? " is-selected" : ""}${date === today ? " is-today" : ""}${date < today ? " is-past" : ""}`} disabled={!isOpen} aria-pressed={date === selected} aria-label={name} onClick={() => onSelect(date)}>
              {newMonth ? <span className="vp-day__month" aria-hidden="true">{monthShort(date, intl)}</span> : null}
              <span className="vp-day__n">{Number(date.slice(8))}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function SlotList({ slots, selected, onSelect, labels }: { slots: Slot[]; selected: number | null; onSelect: (slot: Slot) => void; labels: { morning: string; afternoon: string } }) {
  const groups = [{ key: "am", label: labels.morning, items: slots.filter((slot) => slot.time < "13:00") }, { key: "pm", label: labels.afternoon, items: slots.filter((slot) => slot.time >= "13:00") }].filter((group) => group.items.length);
  return (
    <div className="vp-slots">
      {groups.map((group) => (
        <div key={group.key} className="vp-slots__group">
          <p className="vp-slots__label">{group.label}</p>
          <div className="vp-slots__list">
            {group.items.map((slot) => (
              <button key={slot.startUtc} type="button" className={`vp-slot${slot.startUtc === selected ? " is-selected" : ""}`} aria-pressed={slot.startUtc === selected} onClick={() => onSelect(slot)}>
                <span className="vp-slot__time">{slot.time}</span>
                <span className="vp-slot__end">– {slot.endTime}</span>
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function Arrow({ back = false }: { back?: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={back ? "M19 12H5m7-7-7 7 7 7" : "M5 12h14m-7-7 7 7-7 7"} />
    </svg>
  );
}
