"use client";

import { numberLocale, type SiteLocale } from "@/lib/site-data";
import { useEffect, useRef } from "react";

/**
 * Renders the final formatted number in static HTML, then (once, on first
 * entry into view) counts up to it. Skipped entirely under reduced motion.
 */
export function CountUp({ value, locale, pad = 0 }: { value: number; locale: string; pad?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const format = (n: number) => {
    const s = new Intl.NumberFormat(numberLocale(locale as SiteLocale)).format(n);
    return pad ? s.padStart(pad, "0") : s;
  };

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let frame = 0;
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        observer.disconnect();
        const start = performance.now();
        const duration = 1400;
        const tick = (now: number) => {
          const t = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - t, 3);
          node.textContent = format(Math.round(value * eased));
          if (t < 1) frame = requestAnimationFrame(tick);
        };
        node.textContent = format(0);
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );
    observer.observe(node);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
    // format depends only on locale/pad, which are stable for a rendered page
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, locale, pad]);

  return <span ref={ref}>{format(value)}</span>;
}
