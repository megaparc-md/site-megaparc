"use client";

import { useState } from "react";
import { Icon } from "@/components/ui";

/**
 * A READY-MADE HOSTED TOUR (OWNER «MOSCOVA 20 MEDIA INTEGRATION», 2026-11-23): when the photographer delivers the nine-point tour as a hosted
 * player instead of nine panorama files, it plugs in here — the same place in «Адрес — часть бизнес-модели», a poster and «Открыть
 * виртуальный тур», the iframe loads only on the visitor's click (no third-party request before), full screen allowed.
 */
export function EmbedTour({ url, title, open, caption }: { url: string; title: string; open: string; caption: string }) {
  const [on, setOn] = useState(false);
  return on ? (
    <div className="tour-embed">
      <iframe src={url} title={title} allow="fullscreen; xr-spatial-tracking; gyroscope; accelerometer" allowFullScreen loading="lazy" referrerPolicy="strict-origin-when-cross-origin" />
    </div>
  ) : (
    <figure className="tour-poster">
      <button type="button" className="tour-poster__btn" onClick={() => setOn(true)} aria-label={`${open} — ${title}`}>
        <span className="tour-poster__mock" aria-hidden="true"><span>360°</span></span>
        <span className="tour-poster__play"><Icon /> {open}</span>
      </button>
      <figcaption className="lg-stage__caption">{caption}</figcaption>
    </figure>
  );
}
