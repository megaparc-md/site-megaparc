"use client";

import { useEffect, useState } from "react";
import { track } from "@/lib/track";

/**
 * STICKY DECISION BAR (OWNER toolkit mandate §26): once the hero has scrolled away, a restrained bottom bar with at most three
 * actions — Plans · Dossier · Book a viewing — on desktop and on phones; it steps aside while the viewing scene is on screen.
 * Replaces the one-action phone bar on the property that carries the toolkit. Never obstructs content; keyboard reachable only
 * while shown.
 */
export function DecisionBar({ name, meta, plans, dossier, dossierHref, book }: { name: string; meta: string; plans: string; dossier: string; dossierHref: string; book: string }) {
  const [heroGone, setHeroGone] = useState(false);
  const [atForm, setAtForm] = useState(false);

  useEffect(() => {
    const hero = document.querySelector(".lg-hero");
    const viewing = document.getElementById("viewing");
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.target === hero) setHeroGone(!entry.isIntersecting);
        if (entry.target === viewing) setAtForm(entry.isIntersecting);
      });
    });
    if (hero) observer.observe(hero);
    if (viewing) observer.observe(viewing);
    return () => observer.disconnect();
  }, []);

  const on = heroGone && !atForm;
  useEffect(() => {
    document.documentElement.classList.toggle("lg-sticky-on", on);
    return () => document.documentElement.classList.remove("lg-sticky-on");
  }, [on]);
  const tab = on ? 0 : -1;

  return (
    <div className={`lp-bar${on ? " is-on" : ""}`} aria-hidden={!on}>
      <p className="lp-bar__meta"><strong>{name}</strong><span>{meta}</span></p>
      <div className="lp-bar__actions">
        <a className="lp-bar__link" href="#plans" tabIndex={tab} onClick={() => track("m20_plan_open", { from: "bar" })}>{plans}</a>
        <a className="lp-bar__link" href={dossierHref} download="" tabIndex={tab} onClick={() => track("m20_dossier_download", { from: "bar" })}>{dossier}</a>
        <a className="btn lp-bar__btn" href="#book" data-drawer="book" aria-haspopup="dialog" tabIndex={tab} onClick={() => track("m20_viewing_start", { from: "bar" })}><span>{book}</span></a>
      </div>
    </div>
  );
}
