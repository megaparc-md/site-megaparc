"use client";

import { useEffect, useState } from "react";

/**
 * Small client pieces of the application path (OWNER «MEGAPARC CAREERS», 2026-11-25 · §7 G):
 * · CopyEmail — copies the HR address (for candidates whose device has no mail application set up); the address itself stays a
 *   plain mailto link beside it, so nothing depends on JavaScript;
 * · VacancySticky — on phones, a compact bar with the apply action once the hero has scrolled away; it steps aside while the
 *   «how to apply» scene is on screen. It reuses the phone bar of the leasing pages (`lg-sticky`), which the assistant launcher
 *   and the preview marker already make room for.
 * Nothing is sent by the site: the action opens the candidate's own mail.
 */
export function CopyEmail({ email, label, done }: { email: string; label: string; done: string }) {
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 2400);
    return () => window.clearTimeout(timer);
  }, [copied]);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
    } catch {
      // clipboard not available (insecure context, permissions): select the address so it can be copied by hand
      const node = document.querySelector<HTMLElement>("[data-cr-email]");
      if (node) window.getSelection()?.selectAllChildren(node);
    }
  };
  return (
    <button type="button" className="cr-copy" onClick={copy}>
      <span aria-live="polite">{copied ? done : label}</span>
    </button>
  );
}

export function VacancySticky({ title, meta, label, href }: { title: string; meta: string | null; label: string; href: string }) {
  const [heroGone, setHeroGone] = useState(false);
  const [atApply, setAtApply] = useState(false);

  useEffect(() => {
    const hero = document.querySelector(".cr-vhero");
    const apply = document.getElementById("apply");
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.target === hero) setHeroGone(!entry.isIntersecting);
        if (entry.target === apply) setAtApply(entry.isIntersecting);
      });
    });
    if (hero) observer.observe(hero);
    if (apply) observer.observe(apply);
    return () => observer.disconnect();
  }, []);

  const on = heroGone && !atApply;
  useEffect(() => {
    document.documentElement.classList.toggle("lg-sticky-on", on);
    return () => document.documentElement.classList.remove("lg-sticky-on");
  }, [on]);

  return (
    <div className={`lg-sticky cr-sticky${on ? " is-on" : ""}`} aria-hidden={!on}>
      <p className="lg-sticky__meta"><strong>{title}</strong>{meta ? <span>{meta}</span> : null}</p>
      <a className="btn lg-sticky__btn" href={href} tabIndex={on ? 0 : -1}><span>{label}</span></a>
    </div>
  );
}
