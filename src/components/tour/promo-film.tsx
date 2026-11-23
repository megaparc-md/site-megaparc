"use client";

import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/ui";

/**
 * THE PROMO FILM — OWNER «PROPERTY COMMERCIAL EXPERIENCE 2026» Part C + «MOSCOVA 20 MEDIA INTEGRATION» (2026-11-23). Poster first (a real
 * frame), the film starts only when the visitor presses play — no autoplay, no sound on its own; `preload="none"` so nothing downloads
 * before. The landscape version on wide screens, the portrait one on narrow portrait phones; the language version and the subtitles come
 * from the page language, and where more than one version is offered (EN: the RO and RU voice-overs, English subtitles) a version switch
 * sits under the player. Full screen through the player's own control. Off-screen the film pauses. Reduced motion changes nothing — the
 * film never moves by itself.
 */

export type FilmView = { landscape: { src: string; type: string }[]; portrait: { src: string; type: string }[]; poster: { landscape: string; portrait: string }; subtitles: { src: string; lang: string; label: string; on: boolean }[] };
export type FilmChoice = { key: string; label: string; film: FilmView };

export function PromoFilm({ versions, chooserLabel, title, play, duration, note }: { versions: FilmChoice[]; chooserLabel: string; title: string; play: string; duration: string; note: string }) {
  const [started, setStarted] = useState(false);
  const [portrait, setPortrait] = useState(false);
  const [current, setCurrent] = useState(versions[0]?.key ?? "");
  const video = useRef<HTMLVideoElement | null>(null);
  const box = useRef<HTMLDivElement | null>(null);
  const film = (versions.find((item) => item.key === current) ?? versions[0]).film;

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 719px) and (orientation: portrait)");
    const set = () => setPortrait(mq.matches && film.portrait.length > 0);
    set();
    mq.addEventListener("change", set);
    return () => mq.removeEventListener("change", set);
  }, [film.portrait.length]);

  useEffect(() => {
    if (!started || !box.current) return;
    const io = new IntersectionObserver(([entry]) => { if (!entry.isIntersecting) video.current?.pause(); }, { threshold: 0.2 });
    io.observe(box.current);
    void video.current?.play().catch(() => {});
    return () => io.disconnect();
  }, [started, current]);

  const sources = portrait ? film.portrait : film.landscape;
  const poster = portrait ? film.poster.portrait : film.poster.landscape;
  return (
    <div className={`film${portrait ? " is-portrait" : ""}`} ref={box}>
      {started ? (
        <video ref={video} className="film__video" controls playsInline preload="metadata" poster={poster} key={`${current}-${portrait ? "p" : "l"}`}>
          {sources.map((source) => <source key={source.src} src={source.src} type={source.type} />)}
          {film.subtitles.map((track) => <track key={track.src} kind="subtitles" src={track.src} srcLang={track.lang} label={track.label} default={track.on} />)}
        </video>
      ) : (
        <button type="button" className="film__poster" onClick={() => setStarted(true)} aria-label={`${play} — ${title}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={poster} alt="" loading="lazy" decoding="async" />
          <span className="film__play"><Icon /> {play}</span>
          <span className="film__duration">{duration}</span>
        </button>
      )}
      {versions.length > 1 ? (
        <div className="film__langs" role="group" aria-label={chooserLabel}>
          <span className="lg-label">{chooserLabel}</span>
          {versions.map((item) => (
            <button key={item.key} type="button" className={`film__lang${item.key === current ? " is-on" : ""}`} aria-pressed={item.key === current} onClick={() => setCurrent(item.key)}>{item.label}</button>
          ))}
        </div>
      ) : null}
      {note ? <p className="film__note">{note}</p> : null}
    </div>
  );
}
