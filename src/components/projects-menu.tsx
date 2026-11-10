"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";

/**
 * PROJECTS DROPDOWN — the header's compact architectural mega-menu (OWNER brief "HEADER / NAVIGATION SYSTEM",
 * 2026-11-09); accepted for production by OWNER «FINAL R3.1» §14 / §43.
 * Desktop: opens on hover (short close delay), click and keyboard focus; Escape and a click outside close it;
 * aria-expanded / aria-controls; arrow keys move through the list. Left: the projects; right: the selected
 * project's real photograph, name, confirmed descriptor and derived status. Mobile: an accordion, no hover.
 */
export type MenuProject = { slug: string; name: string; href: string; image: string | null; descriptor: string; status: string; tone: string };
export type ProjectsMenuData = { label: string; href: string; allLabel: string; items: MenuProject[]; active: boolean };

export function ProjectsMenu({ data }: { data: ProjectsMenuData }) {
  const [open, setOpenState] = useState(false);
  // the live open state for handlers that run before React re-renders (hover / focus + click in the same frame — a tap)
  const openRef = useRef(false);
  const setOpen = (value: boolean) => { openRef.current = value; setOpenState(value); };
  const [current, setCurrent] = useState(0);
  const root = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const timer = useRef<number | undefined>(undefined);
  // Escape returns focus to the toggle — that focus must not reopen the panel
  const suppressFocus = useRef(false);
  const id = useId();
  const panelId = `pmenu-${id.replace(/:/g, "")}`;

  useEffect(() => {
    if (!open) return;
    const onDown = (event: MouseEvent) => { if (root.current && !root.current.contains(event.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  // when the panel was just opened by hover or by the focus a click gives the button, that same click must not close it
  // (R3.2: read through openRef — a tap fires mouseenter and click before the re-render, so `open` was still false)
  const openedAt = useRef(0);
  const show = () => { window.clearTimeout(timer.current); if (!openRef.current) openedAt.current = Date.now(); setOpen(true); };
  const onToggle = () => {
    if (openRef.current && Date.now() - openedAt.current < 600) return;
    if (!openRef.current) openedAt.current = Date.now();
    setOpen(!openRef.current);
  };
  const hideSoon = () => { window.clearTimeout(timer.current); timer.current = window.setTimeout(() => setOpen(false), 220); };
  const links = () => Array.from(root.current?.querySelectorAll<HTMLAnchorElement>(".pmenu__list a, .pmenu__all") ?? []);
  const onKey = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      window.clearTimeout(timer.current);
      setOpen(false);
      // only a focus that actually moves back to the toggle is suppressed (an already focused toggle fires no focus event)
      if (document.activeElement !== button.current) { suppressFocus.current = true; button.current?.focus(); }
      return;
    }
    if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
    event.preventDefault();
    setOpen(true);
    const all = links();
    const index = all.indexOf(document.activeElement as HTMLAnchorElement);
    const next = event.key === "ArrowDown" ? (index + 1) % all.length : (index <= 0 ? all.length - 1 : index - 1);
    window.requestAnimationFrame(() => all[next]?.focus());
  };
  const item = data.items[current];

  return (
    <div ref={root} className={`pmenu${open ? " is-open" : ""}`} onMouseEnter={show} onMouseLeave={hideSoon} onKeyDown={onKey}>
      <button
        ref={button}
        type="button"
        className="pmenu__toggle"
        aria-expanded={open}
        aria-controls={panelId}
        aria-current={data.active ? "page" : undefined}
        onClick={onToggle}
        onFocus={() => { if (suppressFocus.current) { suppressFocus.current = false; return; } show(); }}
      >
        {data.label}
        <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true"><path d="M1.5 3.5 5 7l3.5-3.5" fill="none" stroke="currentColor" strokeWidth="1.4" /></svg>
      </button>
      <div id={panelId} className="pmenu__panel" hidden={!open} onFocus={show} onBlur={(event) => { if (!root.current?.contains(event.relatedTarget as Node)) hideSoon(); }}>
        <div className="pmenu__grid">
          <ul className="pmenu__list">
            {data.items.map((project, index) => (
              <li key={project.slug}>
                <Link href={project.href} className={index === current ? "is-current" : undefined} onMouseEnter={() => setCurrent(index)} onFocus={() => setCurrent(index)} onClick={() => setOpen(false)}>
                  <span className="pmenu__name">{project.name}</span>
                  <span className={`pmenu__status is-${project.tone}`}>{project.status}</span>
                </Link>
              </li>
            ))}
          </ul>
          <div className="pmenu__preview" aria-hidden="true">
            {item?.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={item.slug} src={item.image} alt="" loading="lazy" decoding="async" />
            ) : (
              <span className="pmenu__type">{item?.name}</span>
            )}
            <span className="pmenu__caption">
              <b>{item?.name}</b>
              <span>{item?.descriptor}</span>
            </span>
          </div>
        </div>
        <Link className="pmenu__all" href={data.href} onClick={() => setOpen(false)}>{data.allLabel}</Link>
      </div>
    </div>
  );
}

/** Mobile: the same projects as an accordion — every link visible once opened, no hover dependence. */
export function ProjectsAccordion({ data }: { data: ProjectsMenuData }) {
  const [open, setOpen] = useState(false);
  const id = useId();
  const panelId = `pacc-${id.replace(/:/g, "")}`;
  return (
    <div className={`pacc${open ? " is-open" : ""}`}>
      <button type="button" className="pacc__toggle" aria-expanded={open} aria-controls={panelId} aria-current={data.active ? "page" : undefined} onClick={() => setOpen((value) => !value)}>
        {data.label}
        <svg width="12" height="12" viewBox="0 0 10 10" aria-hidden="true"><path d="M1.5 3.5 5 7l3.5-3.5" fill="none" stroke="currentColor" strokeWidth="1.4" /></svg>
      </button>
      <ul id={panelId} className="pacc__list" hidden={!open}>
        {data.items.map((project) => (
          <li key={project.slug}>
            <Link href={project.href}><span>{project.name}</span><small className={`is-${project.tone}`}>{project.status}</small></Link>
          </li>
        ))}
        <li><Link className="pacc__all" href={data.href}>{data.allLabel}</Link></li>
      </ul>
    </div>
  );
}
