"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * OPEN FROM — progressive disclosure by width: a <details> that is open on wide
 * screens and folds on phones after hydration (the server renders it open, so
 * nothing is hidden without JavaScript). Used for the rhythm of the day in the
 * location scene, which phones read on request.
 */
export function OpenFrom({ min, summary, className = "", children }: { min: number; summary: ReactNode; className?: string; children: ReactNode }) {
  const ref = useRef<HTMLDetailsElement>(null);
  useEffect(() => {
    const node = ref.current;
    if (node && !window.matchMedia(`(min-width: ${min}px)`).matches) node.open = false;
  }, [min]);
  return (
    <details ref={ref} className={`lg-open ${className}`.trim()} open>
      <summary>{summary}</summary>
      {children}
    </details>
  );
}
