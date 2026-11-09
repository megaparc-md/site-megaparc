"use client";

import { useEffect, useRef, useState, type CSSProperties, type MouseEvent, type ReactNode } from "react";

/**
 * ARCHITECTURAL NAVIGATION (OWNER "FINAL ART DIRECTION & VISUAL CONVERSION
 * PASS", 2026-11-09, §5–6) — four portals right after the hero, one of the main
 * visual elements of the page, plus the viewing action on its own:
 *   01 ЛОКАЦИЯ И ПОТОК · 02 ПЛАНЫ ПОМЕЩЕНИЯ · 03 ТЕХНИЧЕСКАЯ ГОТОВНОСТЬ ·
 *   04 ЭКОНОМИКА ТОЧКИ (production: ГОТОВНОСТЬ К ЗАПУСКУ — the tool is OWNER-preview only)
 * Desktop: four tall editorial panels on graphite; hover / focus brings the
 * panel's own background forward (aerial · plan fragment · engineering · a
 * restrained data drawing), shows one supporting phrase, draws the line, lights
 * the number. Phones: a vertical stack of four large rows (never a carousel),
 * the phrase always visible. Each portal scrolls to its scene or opens its
 * drawer (data-drawer, handled by LgDrawer).
 *
 * Once the portals have scrolled away, a slim bar (desktop only) keeps the four
 * chapters and the viewing action under the header — the section on screen is
 * underlined; it steps aside while the viewing scene is on screen. Plain anchors
 * work without JavaScript.
 */

export type Portal = { key: string; no: string; label: string; word: string; href: string; drawer?: string; visual: ReactNode };

const Arrow = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M4 12h15M13 6l6 6-6 6" /></svg>
);

export function DecisionNav({ portals, label, cta, status }: { portals: Portal[]; label: string; cta: string; status: string }) {
  const [active, setActive] = useState<string | null>(null);
  const [bar, setBar] = useState(false);
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const node = root.current;
    const viewing = document.getElementById("viewing");
    let past = false;
    let atViewing = false;
    const sync = () => setBar(past && !atViewing);
    const edge = new IntersectionObserver(([entry]) => {
      past = !entry.isIntersecting && entry.boundingClientRect.top < 0;
      sync();
    });
    const end = new IntersectionObserver(([entry]) => {
      atViewing = entry.isIntersecting;
      sync();
    }, { rootMargin: "0px 0px -40% 0px" });
    if (node) edge.observe(node);
    if (viewing) end.observe(viewing);

    const targets = portals.filter((p) => !p.drawer).map((p) => document.getElementById(p.href.slice(1))).filter(Boolean) as HTMLElement[];
    const seen = new Map<string, number>();
    const chapters = new IntersectionObserver(
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
        setActive(ratio > 0.04 ? best : null);
      },
      { threshold: [0, 0.04, 0.2, 0.4, 0.6], rootMargin: "-20% 0px -30% 0px" },
    );
    targets.forEach((target) => chapters.observe(target));
    return () => {
      edge.disconnect();
      end.disconnect();
      chapters.disconnect();
    };
  }, [portals]);

  const go = (event: MouseEvent<HTMLAnchorElement>, portal: Portal) => {
    if (portal.drawer) return; // LgDrawer opens it
    event.preventDefault();
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.getElementById(portal.href.slice(1))?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    history.replaceState(null, "", portal.href);
  };

  return (
    <>
      <nav className="lg-portals" aria-label={label} ref={root}>
        <div className="xp-shell lg-portals__inner">
          <ol className="lg-portals__list">
            {portals.map((portal, i) => (
              <li key={portal.key} className="lg-portals__item" style={{ "--i": i } as CSSProperties}>
                <a href={portal.href} className={`lg-portal is-${portal.key}`} data-drawer={portal.drawer} aria-haspopup={portal.drawer ? "dialog" : undefined} onClick={(event) => go(event, portal)}>
                  <span className="lg-portal__visual" aria-hidden="true">{portal.visual}</span>
                  <span className="lg-portal__no">{portal.no}</span>
                  <span className="lg-portal__label">{portal.label}</span>
                  <span className="lg-portal__word">{portal.word}</span>
                  <span className="lg-portal__arrow"><Arrow /></span>
                </a>
              </li>
            ))}
          </ol>
          <a className="lg-portals__cta" href="#viewing" data-intent="viewing">
            <span className="lg-portals__status"><i aria-hidden="true" />{status}</span>
            <span className="lg-portals__ctalabel">{cta}</span>
            <span className="lg-portal__arrow"><Arrow /></span>
          </a>
        </div>
      </nav>
      <div className={`lg-bar${bar ? " is-on" : ""}`} inert={!bar}>
        <div className="xp-shell lg-bar__inner">
          <ul className="lg-bar__list">
            {portals.map((portal) => {
              const on = !portal.drawer && active === portal.href.slice(1);
              return (
                <li key={portal.key}>
                  <a href={portal.href} className={`lg-bar__link${on ? " is-active" : ""}`} aria-current={on ? "true" : undefined} data-drawer={portal.drawer} aria-haspopup={portal.drawer ? "dialog" : undefined} onClick={(event) => go(event, portal)}>
                    <b>{portal.no}</b>
                    {portal.label.replace(/\n/g, " ")}
                  </a>
                </li>
              );
            })}
          </ul>
          <a className="btn lg-bar__cta" href="#viewing" data-intent="viewing"><span>{cta}</span></a>
        </div>
      </div>
    </>
  );
}
