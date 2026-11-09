"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * SEQUENCE RAIL — the photo sequence as one horizontal row that snaps frame by
 * frame (01 · address → 06 · possibility). Swipe on phones, arrows or the
 * keyboard; the counter shows the first frame in view. Without JavaScript it is
 * a plain scrollable row. From 1024 px the same list is laid out as the
 * editorial sequence (leasing-experience.css) and the arrows step aside.
 */
export function SequenceRail({ items, labels, classes = [] }: { items: ReactNode[]; labels: { prev: string; next: string; of: string }; classes?: string[] }) {
  const rail = useRef<HTMLOListElement>(null);
  const [index, setIndex] = useState(0);
  const [atEnd, setAtEnd] = useState(false);

  useEffect(() => {
    const node = rail.current;
    if (!node) return;
    let frame = 0;
    const measure = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const first = node.children[0] as HTMLElement | undefined;
        const second = node.children[1] as HTMLElement | undefined;
        if (!first) return;
        const step = second ? second.offsetLeft - first.offsetLeft : first.offsetWidth;
        setIndex(Math.max(0, Math.min(items.length - 1, Math.round(node.scrollLeft / step))));
        setAtEnd(node.scrollLeft + node.clientWidth >= node.scrollWidth - 4);
      });
    };
    measure();
    node.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("resize", measure);
    return () => {
      cancelAnimationFrame(frame);
      node.removeEventListener("scroll", measure);
      window.removeEventListener("resize", measure);
    };
  }, [items.length]);

  const go = (step: number) => {
    const node = rail.current;
    if (!node) return;
    const next = Math.max(0, Math.min(items.length - 1, index + step));
    const first = node.children[0] as HTMLElement | undefined;
    const target = node.children[next] as HTMLElement | undefined;
    if (!first || !target) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    node.scrollTo({ left: target.offsetLeft - first.offsetLeft, behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <div className="lg-seq">
      <ol className="lg-seq__rail" ref={rail} tabIndex={0} aria-label={labels.of}>
        {items.map((item, i) => (
          <li key={i} className={`lg-seq__item ${classes[i] ?? ""}`.trim()}>{item}</li>
        ))}
      </ol>
      <div className="lg-seq__nav">
        <p className="lg-seq__count" aria-live="polite">{String(index + 1).padStart(2, "0")} <span>/ {String(items.length).padStart(2, "0")}</span></p>
        <button type="button" className="lg-seq__btn" onClick={() => go(-1)} disabled={index === 0} aria-label={labels.prev}>
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M15 5 8 12l7 7" /></svg>
        </button>
        <button type="button" className="lg-seq__btn" onClick={() => go(1)} disabled={atEnd || index === items.length - 1} aria-label={labels.next}>
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="m9 5 7 7-7 7" /></svg>
        </button>
      </div>
    </div>
  );
}
