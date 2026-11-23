"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { PanoViewer, type ViewerLink } from "@/components/tour/pano-viewer";
import { Icon } from "@/components/ui";

/**
 * THE 360° TOUR — OWNER «PROPERTY COMMERCIAL EXPERIENCE 2026» Part D + OWNER CLARIFICATION «Video & Virtual Tour Integration» (2026-11-23).
 * Placed in «Адрес — часть бизнес-модели» instead of the drawn aerial: the address view shows the poster of scene 01 (the district from
 * above) and «Начать тур 360°»; the tour then runs inline — 360° rotation, zoom, the links to the physically connected neighbours (in the
 * panorama where their position is known, always in the «Рядом» bar), «Назад / Далее» along the nine scenes in order (district → building →
 * entrance → both levels → storage → the unloading ramp), the level selector, the list of the nine scenes, the captions in the page
 * language, full screen (Escape leaves it), mouse and touch, the link to the plans. A panorama loads only when its scene opens; nothing
 * loads before the visitor starts the tour. Strings arrive localised from the server; rendered only for a complete, approved tour.
 */

export type TourSceneView = { id: string; no: string; level: string; levelLabel: string; title: string; caption: string; full: string; medium: string; poster: string; start: { yaw: number; pitch: number; fov: number }; links: { to: string; label: string; yaw: number | null; pitch: number | null }[]; info: { key: string; label: string; text: string; yaw: number | null; pitch: number | null }[] };
export type TourCopy = { kicker: string; start: string; scenes: string; fullscreen: string; plans: string; hint: string; loading: string; noGl: string; near: string; prev: string; next: string; levels: { key: string; label: string }[]; /** OWNER preview interface demonstration: the always-visible mark and the placeholder label (never on the public site) */ banner?: string; placeholder?: string };

export function VirtualTour({ scenes, copy, plansHref }: { scenes: TourSceneView[]; copy: TourCopy; plansHref: string }) {
  const [started, setStarted] = useState(false);
  const [current, setCurrent] = useState(scenes[0]?.id ?? "");
  const box = useRef<HTMLDivElement | null>(null);
  const index = Math.max(0, scenes.findIndex((item) => item.id === current));
  const scene = scenes[index];

  const links: ViewerLink[] = useMemo(
    () => (scene ? [
      ...scene.links.flatMap((link) => (link.yaw === null || link.pitch === null ? [] : [{ key: link.to, label: link.label, yaw: link.yaw, pitch: link.pitch, kind: "nav" as const }])),
      ...scene.info.flatMap((item) => (item.yaw === null || item.pitch === null ? [] : [{ key: item.key, label: item.label, text: item.text, yaw: item.yaw, pitch: item.pitch, kind: "info" as const }])),
    ] : []),
    [scene],
  );
  const go = useCallback((id: string) => setCurrent(id), []);
  useEffect(() => { if (started) box.current?.querySelector<HTMLElement>(".pano")?.focus(); }, [started, current]);
  if (!scene) return null;
  const fullscreen = () => { const el = box.current; if (!el) return; if (document.fullscreenElement) void document.exitFullscreen(); else void el.requestFullscreen?.().catch(() => {}); };
  const prev = scenes[index - 1], next = scenes[index + 1];

  if (!started) {
    return (
      <figure className="tour-poster">
        <button type="button" className="tour-poster__btn" onClick={() => setStarted(true)} aria-label={`${copy.start} — ${scene.title}`}>
          {scene.poster ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={scene.poster} alt="" loading="lazy" decoding="async" />
          ) : (
            <span className="tour-poster__mock" aria-hidden="true"><span>360°</span></span>
          )}
          {copy.banner ? <span className="tour-banner">{copy.banner}</span> : null}
          <span className="tour-poster__play"><Icon /> {copy.start}</span>
          <span className="tour-poster__count">{copy.kicker} · {scenes.length}</span>
        </button>
        <figcaption className="lg-stage__caption">{scene.caption}</figcaption>
      </figure>
    );
  }

  return (
    <div className="tour-stage" ref={box} role="region" aria-label={`${copy.kicker} · ${scene.no} · ${scene.title}`}>
      <div className="tour-stage__bar">
        <p className="tour-stage__title"><span>{scene.no}</span> {scene.title}</p>
        <div className="tour-stage__tools">
          <a className="tour-btn" href={plansHref}>{copy.plans}</a>
          <button type="button" className="tour-btn" onClick={fullscreen}>{copy.fullscreen}</button>
        </div>
      </div>
      {copy.banner ? <p className="tour-banner is-stage">{copy.banner}</p> : null}
      <PanoViewer key={scene.id} src={scene.full} fallbackSrc={scene.medium} start={scene.start} links={links} onLink={go} loadingText={copy.loading} noGlText={copy.noGl} hint={copy.hint} placeholderText={copy.placeholder ? `${copy.placeholder}\n${scene.no} · ${scene.title}` : undefined} />
      <div className="tour-stage__foot">
        <p className="tour-stage__caption">{scene.caption}</p>
        <div className="tour-seq">
          <button type="button" className="tour-btn" disabled={!prev} onClick={() => prev && go(prev.id)}><Icon name="left" /> {copy.prev}{prev ? ` · ${prev.no}` : ""}</button>
          <button type="button" className="tour-btn is-next" disabled={!next} onClick={() => next && go(next.id)}>{copy.next}{next ? ` · ${next.no} ${next.title}` : ""} <Icon /></button>
        </div>
        {scene.links.length ? (
          <div className="tour-near">
            <span className="lg-label">{copy.near}</span>
            {scene.links.map((link) => (
              <button key={link.to} type="button" className="tour-btn" onClick={() => go(link.to)}>{link.label} <Icon /></button>
            ))}
          </div>
        ) : null}
        <div className="tour-levels" role="group" aria-label={copy.scenes}>
          {copy.levels.map((level) => {
            const first = scenes.find((item) => item.level === level.key);
            return first ? (
              <button key={level.key} type="button" className={`tour-btn${scene.level === level.key ? " is-on" : ""}`} aria-pressed={scene.level === level.key} onClick={() => go(first.id)}>{level.label}</button>
            ) : null;
          })}
        </div>
        <ol className="tour-strip" aria-label={copy.scenes}>
          {scenes.map((item) => (
            <li key={item.id}>
              <button type="button" className={`tour-btn${item.id === scene.id ? " is-on" : ""}`} aria-current={item.id === scene.id ? "true" : undefined} onClick={() => go(item.id)}>
                <b>{item.no}</b> {item.title}
              </button>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
