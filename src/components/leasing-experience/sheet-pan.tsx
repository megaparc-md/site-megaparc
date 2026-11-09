"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * SHEET PAN — the scrollable frame of an architectural drawing on phones and
 * tablets (OWNER plan replacement pass, 2026-11-09, §2): the sheet keeps a
 * legible scale and pans sideways; on first render it is scrolled so the
 * premises (not an empty corner of the sheet) are in view. Desktop shows the
 * whole drawing and has nothing to scroll.
 */
export function SheetPan({ start, label, children }: { start: number; label: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    // a level that is not shown yet has no size: place it the first time it gets one (and once its image has loaded)
    let placed = false;
    const place = () => {
      const room = node.scrollWidth - node.clientWidth;
      if (placed || room <= 0) return;
      node.scrollLeft = Math.round(room * start);
      placed = true;
    };
    place();
    const img = node.querySelector("img");
    if (img && !img.complete) img.addEventListener("load", place, { once: true });
    const observer = new ResizeObserver(place);
    observer.observe(node);
    return () => observer.disconnect();
  }, [start]);
  return (
    <div ref={ref} className="lg-drawing__sheet" tabIndex={0} role="region" aria-label={label}>
      {children}
    </div>
  );
}
