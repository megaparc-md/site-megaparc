"use client";

import { useEffect, useState } from "react";

/**
 * MOBILE STICKY ACTION (OWNER compact brief §13): a 60 px bar at the bottom of
 * the phone screen once the hero has scrolled away; it steps aside while the
 * viewing scene is on screen. Phones only (CSS); the PREVIEW marker moves up
 * while the bar is shown. The label follows the unit status (viewing or
 * waitlist) — passed in, never decided here.
 */
export function StickyCta({ name, meta, label }: { name: string; meta: string; label: string }) {
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

  return (
    <div className={`lg-sticky${on ? " is-on" : ""}`} aria-hidden={!on}>
      <p className="lg-sticky__meta"><strong>{name}</strong><span>{meta}</span></p>
      <a className="btn lg-sticky__btn" href="#viewing" data-intent="viewing" tabIndex={on ? 0 : -1}><span>{label}</span></a>
    </div>
  );
}
