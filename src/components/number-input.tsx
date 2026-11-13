"use client";

import { useLayoutEffect, useRef, type ChangeEvent, type ClipboardEvent, type FocusEvent } from "react";
import type { SiteLocale } from "@/lib/site-data";

/**
 * NUMBER INPUT with live digit grouping (OWNER R9 addendum «Форматирование чисел во всех калькуляторах», 2026-11-13 — «финансовые
 * поля должны быть такими же удобными и надёжными, как в качественном банковском приложении»).
 *
 * The state of a field is CANONICAL — digits with at most one «.» («1250000.5»): unambiguous, so the calculators read exactly the number
 * the visitor sees (`numberOf`). The field shows it localised: RU / RO «1 250 000,5» (no-break space groups, decimal comma — the site's
 * own number style), EN «1,250,000.5». Grouping only where it helps (`group`): money yes; percent, days, people, m² no.
 *
 *   · typing: an edit is read as a diff against the shown value — digits are kept, a typed «,» or «.» is the decimal mark (whatever the
 *     keyboard or device locale offers), anything else is ignored; the caret stays after the same digit it followed (never jumps to the end);
 *   · Backspace / Delete on a group separator removes the neighbouring digit (the separator itself is not content);
 *   · paste (Excel, Google Sheets, a PDF, a message): the clipboard text is parsed on its own — currency signs and units dropped, spaces,
 *     no-break spaces, apostrophes and repeated marks read as grouping, the later of «.» / «,» as the decimal mark, one mark followed by
 *     exactly three digits as grouping («1,500» · «1.500» → 1 500) — and inserted at the selection;
 *   · limits: up to `decimals` digits after the mark (0 = whole numbers), up to `maxInt` digits before it; an edit beyond them is refused,
 *     a pasted value with more decimals is rounded to `decimals` (currency cents) — nothing else is ever rounded;
 *   · on blur: leading zeros and a dangling decimal mark are tidied («007» → «7», «12,» → «12»), the value is unchanged.
 * Mobile keyboards: `inputMode="decimal"` (digits + the decimal key) or `numeric` for whole numbers.
 */
export type NumberFormat = { group: boolean; decimals: number; maxInt?: number };

const GROUP: Record<SiteLocale, string> = { ru: " ", ro: " ", en: "," };
const DECIMAL: Record<SiteLocale, string> = { ru: ",", ro: ",", en: "." };

/** canonical → the shown value */
export function formatNumber(canonical: string, locale: SiteLocale, group: boolean): string {
  if (!canonical) return "";
  const [int, dec] = canonical.split(".");
  const grouped = group ? int.replace(/\B(?=(\d{3})+(?!\d))/g, GROUP[locale]) : int;
  return dec !== undefined ? `${grouped}${DECIMAL[locale]}${dec}` : grouped;
}

/** canonical → a positive number, or null (an empty field, «.» alone or zero give null — the calculators' existing rule) */
export function numberOf(canonical: string): number | null {
  if (!canonical || canonical === ".") return null;
  const n = Number(canonical);
  return Number.isFinite(n) && n > 0 ? n : null;
}

/** a part of the SHOWN value → canonical (our own format only: digits, the locale's decimal mark, group separators) */
function canonOf(shown: string, locale: SiteLocale): string {
  let out = "";
  for (const ch of shown) {
    if (ch >= "0" && ch <= "9") out += ch;
    else if (ch === DECIMAL[locale]) out += ".";
  }
  return out;
}

/** free text from the clipboard → canonical, or null when it holds no number */
export function parsePasted(text: string): string | null {
  let v = text.replace(/[\s   '’`]/g, "").replace(/[^\d.,]/g, "");
  if (!/\d/.test(v)) return null;
  const dot = v.lastIndexOf(".");
  const comma = v.lastIndexOf(",");
  if (dot >= 0 && comma >= 0) {
    v = dot > comma ? v.replace(/,/g, "") : v.replace(/\./g, "").replace(",", ".");
  } else if (dot >= 0 || comma >= 0) {
    const mark = dot >= 0 ? "." : ",";
    const parts = v.split(mark);
    // a real thousands grouping: a first group of 1–3 digits, then groups of exactly 3 («1.200.000», «12,000», «1.500»); a single mark
    // after a longer run of digits is a decimal mark («1250000.505»)
    const grouping = parts.every((p) => /^\d+$/.test(p)) && parts[0].length <= 3 && parts.slice(1).every((p) => p.length === 3);
    v = grouping ? parts.join("") : parts.length === 2 ? `${parts[0]}.${parts[1]}` : parts.join("");
  }
  return v;
}

/** the index in the shown value right after the k-th significant character (digit or decimal mark) */
function indexAfter(shown: string, k: number, locale: SiteLocale): number {
  if (k <= 0) return 0;
  let seen = 0;
  for (let i = 0; i < shown.length; i++) {
    const ch = shown[i];
    if ((ch >= "0" && ch <= "9") || ch === DECIMAL[locale]) {
      seen++;
      if (seen === k) return i + 1;
    }
  }
  return shown.length;
}

function valid(canonical: string, fmt: NumberFormat): boolean {
  const marks = (canonical.match(/\./g) ?? []).length;
  if (marks > 1) return false;
  if (marks === 1 && fmt.decimals === 0) return false;
  const [int, dec = ""] = canonical.split(".");
  if (dec.length > fmt.decimals) return false;
  if (int.replace(/^0+(?=\d)/, "").length > (fmt.maxInt ?? 12)) return false;
  return true;
}

/** a pasted canonical value fitted to the field: currency cents rounded to `decimals`, whole-number fields keep the integer part only when it is exact */
function fitPasted(canonical: string, fmt: NumberFormat): string | null {
  const [int, dec] = canonical.split(".");
  if (dec === undefined || dec.length <= fmt.decimals) return canonical;
  const n = Number(canonical);
  if (!Number.isFinite(n)) return null;
  if (fmt.decimals === 0) return Number.isInteger(n) ? String(n) : null;
  const fixed = n.toFixed(fmt.decimals);
  return fixed.replace(/\.?0+$/, (m) => (m.startsWith(".") ? "" : m)) || int;
}

function tidy(canonical: string): string {
  if (!canonical) return canonical;
  const [rawInt, rawDec] = canonical.split(".");
  let int = rawInt.replace(/^0+(?=\d)/, "");
  const dec = rawDec === "" ? undefined : rawDec;
  if (int === "" && dec !== undefined) int = "0";
  return dec !== undefined ? `${int}.${dec}` : int;
}

export function NumberInput({ value, onValueChange, locale, format, className, id, describedBy, label }: {
  /** canonical: digits with at most one «.» */
  value: string;
  onValueChange: (canonical: string) => void;
  locale: SiteLocale;
  format: NumberFormat;
  className?: string;
  id?: string;
  describedBy?: string;
  label?: string;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const caret = useRef<number | null>(null);
  const shown = formatNumber(value, locale, format.group);

  // after React has written the new value, the caret goes where the edit left it
  useLayoutEffect(() => {
    const el = ref.current;
    if (el && caret.current !== null && document.activeElement === el) {
      el.setSelectionRange(caret.current, caret.current);
    }
    caret.current = null;
  });

  const commit = (el: HTMLInputElement, next: string, at: number) => {
    const nextShown = formatNumber(next, locale, format.group);
    const pos = indexAfter(nextShown, at, locale);
    // the DOM gets the formatted value and the caret at once (React then finds it already equal); the layout effect repeats the caret
    el.value = nextShown;
    el.setSelectionRange(pos, pos);
    caret.current = pos;
    if (next !== value) onValueChange(next);
  };
  const refuse = (el: HTMLInputElement, at: number) => {
    el.value = shown;
    el.setSelectionRange(at, at);
    caret.current = at;
  };

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    const el = event.target;
    const raw = el.value;
    const prev = shown;
    const inputType = (event.nativeEvent as InputEvent).inputType ?? "";
    let p = 0;
    while (p < prev.length && p < raw.length && prev[p] === raw[p]) p++;
    let s = 0;
    while (s < prev.length - p && s < raw.length - p && prev[prev.length - 1 - s] === raw[raw.length - 1 - s]) s++;
    const removed = prev.slice(p, prev.length - s);
    const inserted = raw.slice(p, raw.length - s);
    let head = canonOf(prev.slice(0, p), locale);
    let tail = canonOf(prev.slice(prev.length - s), locale);
    // a group separator alone was deleted: the visitor meant the digit beside it
    if (!inserted && removed && canonOf(removed, locale) === "") {
      if (inputType === "deleteContentForward") tail = tail.slice(1);
      else head = head.slice(0, -1);
    }
    let insertedCanon = "";
    if (inserted.length > 1 && /\d.*[.,\s '’]|[.,\s '’].*\d/.test(inserted)) {
      // autofill, drag-and-drop, a programmatic fill: read it as a pasted value
      const pasted = parsePasted(inserted);
      insertedCanon = pasted ? fitPasted(pasted, format) ?? "" : "";
    } else {
      for (const ch of inserted) {
        if (ch >= "0" && ch <= "9") insertedCanon += ch;
        else if ((ch === "," || ch === ".") && format.decimals > 0) insertedCanon += ".";
      }
    }
    const next = head + insertedCanon + tail;
    if (!valid(next, format)) return refuse(el, p);
    commit(el, next, head.length + insertedCanon.length);
  };

  const onPaste = (event: ClipboardEvent<HTMLInputElement>) => {
    const el = event.currentTarget;
    const text = event.clipboardData.getData("text/plain");
    event.preventDefault();
    const parsed = parsePasted(text);
    const fitted = parsed ? fitPasted(parsed, format) : null;
    if (fitted === null) return;
    const start = el.selectionStart ?? shown.length;
    const end = el.selectionEnd ?? start;
    const head = canonOf(shown.slice(0, start), locale);
    const tail = canonOf(shown.slice(end), locale);
    const next = head + fitted + tail;
    if (!valid(next, format)) {
      // a full replacement that is valid on its own (the common «select all, paste» case) still goes through
      if (valid(fitted, format) && head === "" && tail === "") return commit(el, fitted, fitted.length);
      return refuse(el, start);
    }
    commit(el, next, head.length + fitted.length);
  };

  const onBlur = (event: FocusEvent<HTMLInputElement>) => {
    const next = tidy(value);
    if (next !== value) {
      event.currentTarget.value = formatNumber(next, locale, format.group);
      onValueChange(next);
    }
  };

  return (
    <input
      ref={ref}
      className={className}
      id={id}
      type="text"
      inputMode={format.decimals > 0 ? "decimal" : "numeric"}
      autoComplete="off"
      autoCorrect="off"
      spellCheck={false}
      enterKeyHint="done"
      aria-label={label}
      aria-describedby={describedBy}
      value={shown}
      onChange={onChange}
      onPaste={onPaste}
      onBlur={onBlur}
    />
  );
}
