/**
 * LIGHT STATEMENT + STRONG ACCENT (OWNER «TYPOGRAPHY ALIGNMENT WITH FINMENTOR», 2026-11-12): a display statement is set in
 * Manrope 300 and its closing word(s) in Manrope 700 — «Базовая инфраструктура уже **готова.**», «Адрес — часть **бизнес‑модели.**».
 * Presentation only: the text is the approved copy, unchanged; the accent is the last `words` word(s) (a no-break space keeps a
 * short preposition with its word, so the accent never starts with a hanging particle).
 */
export function Accent({ text, words = 1 }: { text: string; words?: number }) {
  const parts = text.trim().split(" ");
  if (parts.length <= words) return <strong className="t-accent">{text}</strong>;
  return (
    <>
      {parts.slice(0, -words).join(" ")} <strong className="t-accent">{parts.slice(-words).join(" ")}</strong>
    </>
  );
}

/** A multi-line display title: the accent closes the last line. */
export function accentLast(lines: string[], index: number, line: string) {
  return index === lines.length - 1 ? <Accent text={line} /> : line;
}
