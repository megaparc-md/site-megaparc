/**
 * Privacy-safe internal events (OWNER «DIGITAL LEASING TOOLKIT» §31, 2026-11-11). The project has no analytics vendor and this
 * mandate installs none: an event is a DOM CustomEvent on `window` («megaparc:event») plus a small in-memory log, so a future
 * approved analytics layer can subscribe without touching the components. Nothing is sent anywhere; no personal data is logged.
 */
export type TrackDetail = { name: string; at: number; page: string; meta?: Record<string, string | number | boolean> };

declare global {
  interface Window {
    __megaparcEvents?: TrackDetail[];
  }
}

export function track(name: string, meta?: TrackDetail["meta"]) {
  if (typeof window === "undefined") return;
  const detail: TrackDetail = { name, at: Date.now(), page: window.location.pathname, ...(meta ? { meta } : {}) };
  (window.__megaparcEvents ??= []).push(detail);
  if (window.__megaparcEvents.length > 200) window.__megaparcEvents.shift();
  window.dispatchEvent(new CustomEvent<TrackDetail>("megaparc:event", { detail }));
}
