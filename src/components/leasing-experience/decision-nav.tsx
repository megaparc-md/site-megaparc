"use client";

import { useEffect, useState, type MouseEvent } from "react";

/**
 * FAST DECISION BAR (OWNER "FINAL VIEWING CONVERSION PASS", 2026-11-06) — right
 * after the hero, and only there: ЛОКАЦИЯ И ПОТОК · ПЛАНЫ · ТЕХНИЧЕСКИЕ
 * ХАРАКТЕРИСТИКИ · ГОТОВНОСТЬ К ЗАПУСКУ + ЗАПРОСИТЬ ПРОСМОТР. Each item either
 * scrolls to its scene or opens its drawer (data-drawer, handled by LgDrawer).
 * Desktop: sticky under the header, the chapter on screen underlined in
 * burgundy. Phones: one quiet horizontal rail; the sticky action is the bottom bar.
 * Plain anchors without JavaScript.
 */

export type Chapter = { key: string; label: string; href: string; drawer?: string };

export function DecisionNav({ chapters, label, cta }: { chapters: Chapter[]; label: string; cta: string }) {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const targets = chapters.filter((chapter) => !chapter.drawer).map((chapter) => document.getElementById(chapter.href.slice(1))).filter(Boolean) as HTMLElement[];
    const seen = new Map<string, number>();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => seen.set(entry.target.id, entry.isIntersecting ? entry.intersectionRatio : 0));
        let best: string | null = null;
        let ratio = 0;
        for (const [id, value] of seen) {
          if (value > ratio) {
            ratio = value;
            best = id;
          }
        }
        setActive(ratio > 0.08 ? best : null);
      },
      { threshold: [0, 0.08, 0.25, 0.5, 0.75], rootMargin: "-20% 0px -30% 0px" },
    );
    targets.forEach((target) => observer.observe(target));
    return () => observer.disconnect();
  }, [chapters]);

  const go = (event: MouseEvent<HTMLAnchorElement>, chapter: Chapter) => {
    if (chapter.drawer) return; // LgDrawer opens it
    event.preventDefault();
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.getElementById(chapter.href.slice(1))?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    history.replaceState(null, "", chapter.href);
  };

  return (
    <nav className="lg-dnav" aria-label={label}>
      <div className="xp-shell lg-dnav__inner">
        <ul className="lg-dnav__list">
          {chapters.map((chapter) => {
            const on = !chapter.drawer && active === chapter.href.slice(1);
            return (
              <li key={chapter.key}>
                <a href={chapter.href} className={`lg-dnav__link${on ? " is-active" : ""}${chapter.drawer ? " is-drawer" : ""}`} aria-current={on ? "true" : undefined} aria-haspopup={chapter.drawer ? "dialog" : undefined} data-drawer={chapter.drawer} onClick={(event) => go(event, chapter)}>
                  {chapter.label}
                </a>
              </li>
            );
          })}
        </ul>
        <a className="btn lg-dnav__cta" href="#viewing" data-intent="viewing"><span>{cta}</span></a>
      </div>
    </nav>
  );
}
