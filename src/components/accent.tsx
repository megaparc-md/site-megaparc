import { emphasisRange } from "@/lib/emphasis";

/**
 * LIGHT STATEMENT + ONE MEANINGFUL ACCENT (typography: OWNER «TYPOGRAPHY ALIGNMENT WITH FINMENTOR», 2026-11-12; emphasis: OWNER
 * «SEMANTIC TYPOGRAPHY & EDITORIAL EMPHASIS», 2026-11-12). A display statement is set in Manrope 300; the phrase that carries its
 * main idea — and only that phrase — is set in Manrope 700. Which phrase, if any, is an editorial decision recorded in
 * src/lib/emphasis.ts: «Пространство для **следующего шага** вашего бизнеса.», «Адрес — **часть бизнес‑модели.**». A statement
 * that is not in the register stays calm — the last word is never marked mechanically.
 * Presentation only: the text is the approved copy, unchanged.
 *
 * `statement` is the whole statement when `text` is one of its lines (multi-line titles); the accent then appears in the line
 * that contains the phrase, wherever that line is.
 */
export function Accent({ text, statement }: { text: string; statement?: string }) {
  const range = emphasisRange(text, statement ?? text);
  if (!range) return <>{text}</>;
  const [start, end] = range;
  return (
    <>
      {text.slice(0, start)}
      <strong className="t-accent">{text.slice(start, end)}</strong>
      {text.slice(end)}
    </>
  );
}

/** One line of a multi-line display title — the accent falls where the register puts it, in whichever line holds the phrase. */
export function accentLast(lines: string[], index: number, line: string) {
  void index; // kept in the signature: every call site maps over the lines
  return <Accent text={line} statement={lines.join(" ")} />;
}
