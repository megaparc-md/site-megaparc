"use client";

import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/ui";

/**
 * THE PROMO FILM — OWNER «PROPERTY COMMERCIAL EXPERIENCE 2026» Part C (2026-11-23). Poster first (a real frame), the film starts only when
 * the visitor presses play — no autoplay, no sound on its own; `preload="none"` so nothing downloads before. The landscape version on wide
 * screens, the portrait one on narrow portrait phones; the language version and the subtitles come from the page language (EN: the RO
 * voice-over with English subtitles on). Off-screen the film pauses. Reduced motion changes nothing — the film never moves by itself.
 */

export type FilmView = { landscape: { src: string; type: string }[]; portrait: { src: string; type: string }[]; poster: { landscape: string; portrait: string }; subtitles: { src: string; lang: string; label: string; on: boolean }[] };

export function PromoFilm({ film, title, play, duration, note }: { film: FilmView; title: string; play: string; duration: string; note: string }) {
  const [started, setStarted] = useState(false);
  const [portrait, setPortrait] = useState(false);
  const video = useRef<HTMLVideoElement | null>(null);
  const box = useRef<HTMLDivElement | null>(null);

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
  }, [started]);

  const sources = portrait ? film.portrait : film.landscape;
  const poster = portrait ? film.poster.portrait : film.poster.landscape;
  return (
    <div className={`film${portrait ? " is-portrait" : ""}`} ref={box}>
      {started ? (
        <video ref={video} className="film__video" controls playsInline preload="metadata" poster={poster} key={portrait ? "p" : "l"}>
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
      {note ? <p className="film__note">{note}</p> : null}
    </div>
  );
}
