"use client";

import { useEffect, useState, type MouseEvent } from "react";

/**
 * DECISION NAVIGATION (OWNER compact brief §3) — four chapters and the viewing
 * action, right after the hero. A chapter that lives in the decision panel
 * opens its tab and scrolls to the panel; «Планы и площади» scrolls to the plans
 * scene. Desktop: sticky under the header, the active chapter underlined while
 * its scene is on screen. Phones: one quiet horizontal rail (the sticky action
 * is the bottom bar). Plain anchors without JavaScript.
 */

export type Chapter = { key: "tech" | "location" | "plans" | "readiness"; label: string; target: "decision" | "plans"; tab?: string };

/** Which chapter a panel tab belongs to. */
const chapterOfTab: Record<string, Chapter["key"]> = { tech: "tech", areas: "tech", engineering: "tech", location: "location", access: "location", readiness: "readiness" };

export function openPanelTab(tab: string) {
  window.dispatchEvent(new CustomEvent("lg:tab", { detail: tab }));
}

export function DecisionNav({ chapters, label, cta }: { chapters: Chapter[]; label: string; cta: string }) {
  const [inView, setInView] = useState<"decision" | "plans" | "capex" | null>(null);
  const [tab, setTab] = useState("tech");

  useEffect(() => {
    const onTab = (event: Event) => setTab(String((event as CustomEvent).detail));
    window.addEventListener("lg:tab-changed", onTab);
    const targets = ["decision", "plans", "capex"].map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    const seen = new Map<string, number>();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => seen.set(entry.target.id, entry.isIntersecting ? entry.intersectionRatio : 0));
        let best: "decision" | "plans" | "capex" | null = null;
        let ratio = 0;
        for (const [id, value] of seen) {
          if (value > ratio) {
            ratio = value;
            best = id as "decision" | "plans" | "capex";
          }
        }
        setInView(ratio > 0.12 ? best : null);
      },
      { threshold: [0, 0.12, 0.25, 0.5, 0.75], rootMargin: "-20% 0px -30% 0px" },
    );
    targets.forEach((target) => observer.observe(target));
    return () => {
      window.removeEventListener("lg:tab-changed", onTab);
      observer.disconnect();
    };
  }, []);

  const active = inView === "plans" ? "plans" : inView === "capex" ? "readiness" : inView === "decision" ? chapterOfTab[tab] : null;

  const go = (event: MouseEvent<HTMLAnchorElement>, chapter: Chapter) => {
    if (!chapter.tab) return;
    event.preventDefault();
    openPanelTab(chapter.tab);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.getElementById(chapter.target)?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    history.replaceState(null, "", `#${chapter.tab}`);
  };

  return (
    <nav className="lg-dnav" aria-label={label}>
      <div className="xp-shell lg-dnav__inner">
        <ul className="lg-dnav__list">
          {chapters.map((chapter) => (
            <li key={chapter.key}>
              <a href={`#${chapter.target}`} className={`lg-dnav__link${active === chapter.key ? " is-active" : ""}`} aria-current={active === chapter.key ? "true" : undefined} onClick={(event) => go(event, chapter)}>
                {chapter.label}
              </a>
            </li>
          ))}
        </ul>
        <a className="btn lg-dnav__cta" href="#viewing" data-intent="viewing"><span>{cta}</span></a>
      </div>
    </nav>
  );
}
