"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * One group of the technical passport as a disclosure (OWNER «TECHNICAL READINESS — OWNER REDESIGN» §12): open on
 * desktop and tablet, folded on phones so the drawer is not one long list. The four key facts, what is already in
 * place, what we check and the principle never fold. Rendered open on the server (no script = everything visible);
 * the drawer is closed at load, so folding on a phone is never seen as a jump.
 */
export function PassportFold({ summary, preview, children }: { summary: ReactNode; preview: string; children: ReactNode }) {
  const ref = useRef<HTMLDetailsElement>(null);
  useEffect(() => {
    if (ref.current && window.matchMedia("(max-width: 719px)").matches) ref.current.open = false;
  }, []);
  return (
    <details ref={ref} className="lg-pass__group" open>
      <summary className="lg-pass__summary">
        <span className="lg-pass__gtitle">{summary}</span>
        <span className="lg-pass__preview">{preview}</span>
        <svg className="lg-pass__chev" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="m6 9 6 6 6-6" /></svg>
      </summary>
      {children}
    </details>
  );
}
