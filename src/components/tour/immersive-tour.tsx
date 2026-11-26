"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { Icon } from "@/components/ui";
import { UtilityIcon } from "@/components/utility-icons";
import { track } from "@/lib/track";

/**
 * THE IMMERSIVE TOUR OF MOSCOVA 20 (OWNER «MOSCOVA 20 IMMERSIVE EXPERIENCE R1», 2026-11-26) — the photographer's interactive 360° package,
 * served from this origin as an immutable vendor module, presented as a visit of the property and not as a widget:
 *
 * - CLICK-TO-LOAD: the stage first shows a real photograph of the property with the 360° mark; the package's document (and with it the
 *   first scene, ≈ 10 MB in HD) is requested only after the visitor's action — the iframe does not exist before.
 * - ONE STAGE, NO LAYOUT SHIFT: the cover and the running tour share one box of a fixed aspect ratio (16 : 9 on wide screens, 4 : 3 on
 *   tablets, 3 : 4 on phones, never a fixed 640 px); the «loading» state covers the package's own blank start until its first scene is built.
 * - LANGUAGE: the package starts in Russian by itself (`setLang('ru')` after its first scene is fetched) and reads no parameter. On the same
 *   origin the page uses the package's public `setLang`: when the tour has already initialised at `load`, it is switched once; otherwise the
 *   package's own first `setLang` call is intercepted exactly once and receives the page's language. Event-driven — no timer, no polling —
 *   and the package's own RO · RU · EN switch keeps working. Cross-origin or a changed package → the tour simply keeps its own language.
 * - SCENES: the current scene is read from the package's title element (a MutationObserver — the package writes `#NN` into its own
 *   location on every change); the nine scenes under the stage open the tour at a scene, or move the running tour with the package's
 *   public `go`. Every use of the package's surface is feature-detected; the vendor files are never modified.
 * - FULL SCREEN: the stage itself goes full screen (the tour fills it under a slim MEGAPARC bar with the scene counter and the exit); where
 *   the Fullscreen API is unavailable (iPhone Safari) the tour opens on its own page instead. Focus returns to the control afterwards.
 * - SHARE: Telegram · WhatsApp · e‑mail (built on click) · copy — the direct HTTPS link of the tour, never a price.
 * - EVENTS: internal only (src/lib/track.ts) — virtual_tour_start · virtual_tour_scene · virtual_tour_open_fullscreen · virtual_tour_share ·
 *   virtual_tour_viewing_cta.
 */

export type TourSceneView = { id: string; title: string; level: string };
export type TourCopy = {
  start: string; fullscreen: string; exitFullscreen: string; after: string; loading: string; openPage: string; scenes: string; scenesHint: string;
  share: string; shareText: string; copy: string; copied: string; email: string; next: string; offer: string; plans: string; terms: string; contact: string;
  region: string; frame: string; sceneOf: string;
};
export type TourCtas = { viewing: string; offer: string; plans: string; terms: string; contact: string };

type Phase = "idle" | "loading" | "on";
/** the package's public surface this page relies on — read-only, feature-detected on every use */
type TourWindow = Window & { setLang?: (lang: string) => void; go?: (scene: string) => unknown };

export function ImmersiveTour({ src, directUrl, lang, scenes, levels, startScene, cover, copy, ctas, name }: {
  /** the package document on this origin (base path included) */
  src: string;
  /** the shareable HTTPS address of the tour */
  directUrl: string;
  lang: "ro" | "ru" | "en";
  scenes: TourSceneView[];
  levels: { key: string; label: string }[];
  startScene: string;
  /** the real photograph of the cover, rendered by the server */
  cover: ReactNode;
  copy: TourCopy;
  ctas: TourCtas;
  name: string;
}) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [openAt, setOpenAt] = useState(startScene);
  const [current, setCurrent] = useState(startScene);
  const [fs, setFs] = useState(false);
  const [status, setStatus] = useState("");
  const [copied, setCopied] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLIFrameElement>(null);
  const fsButtonRef = useRef<HTMLButtonElement>(null);
  const observerRef = useRef<MutationObserver | null>(null);
  const timerRef = useRef<number | null>(null);
  const lastTracked = useRef<string | null>(null);
  const valid = useRef(new Set(scenes.map((scene) => scene.id)));

  useEffect(() => () => { observerRef.current?.disconnect(); if (timerRef.current) window.clearTimeout(timerRef.current); }, []);

  const start = useCallback((scene?: string) => {
    if (phase !== "idle") return;
    const at = scene && valid.current.has(scene) ? scene : startScene;
    setOpenAt(at);
    setCurrent(at);
    setPhase("loading");
    track("virtual_tour_start", { scene: at });
  }, [phase, startScene]);

  /** the package document has loaded: language sync, the scene observer, the end of the loading state (same origin only) */
  const onLoad = () => {
    const frame = frameRef.current;
    let w: TourWindow | null = null;
    let doc: Document | null = null;
    try { w = frame?.contentWindow as TourWindow | null; doc = w?.document ?? null; if (!doc?.documentElement) throw new Error("no document"); } catch { setPhase("on"); return; }
    const ready = () => setPhase("on");
    const win = w!, document_ = doc!;
    // the current scene, read from the package's own title element whenever it changes
    const title = document_.getElementById("t-scene");
    if (title && typeof MutationObserver === "function") {
      observerRef.current?.disconnect();
      const observer = new MutationObserver(() => {
        const id = (win.location.hash || "").slice(1);
        if (!valid.current.has(id)) return;
        setCurrent(id);
        if (lastTracked.current !== id) { lastTracked.current = id; track("virtual_tour_scene", { scene: id }); }
      });
      observer.observe(title, { childList: true, characterData: true, subtree: true });
      observerRef.current = observer;
    }
    const setLang = win.setLang;
    if (typeof setLang !== "function") { ready(); return; }
    // the package has initialised already (fast cache) when its thumbnail strip is filled
    const initialised = (document_.getElementById("strip")?.children.length ?? 0) > 0;
    if (initialised) {
      if (document_.documentElement.lang !== lang) setLang(lang);
      ready();
      return;
    }
    // otherwise its own first call (after the first scene is fetched) is intercepted once and receives the page's language
    win.setLang = function intercepted() { win.setLang = setLang; setLang(lang); ready(); };
  };

  const openScene = (id: string) => {
    if (phase === "idle") { start(id); return; }
    const w = frameRef.current?.contentWindow as TourWindow | null;
    try {
      if (w && typeof w.go === "function") { void w.go(id); return; }
    } catch { /* cross-origin — fall through to a reload */ }
    setOpenAt(id);
    setCurrent(id);
    if (frameRef.current) frameRef.current.src = `${src}#${id}`;
  };

  const openPage = (mode: "page" | "fallback") => {
    track("virtual_tour_open_fullscreen", { mode });
    window.open(`${directUrl}#${current}`, "_blank", "noopener");
  };
  const enterFullscreen = () => {
    const stage = stageRef.current;
    if (!stage) return;
    if (phase === "idle") start();
    if (typeof stage.requestFullscreen !== "function") { openPage("fallback"); return; }
    stage.requestFullscreen({ navigationUI: "hide" }).then(() => track("virtual_tour_open_fullscreen", { mode: "native" })).catch(() => openPage("fallback"));
  };
  const exitFullscreen = () => { if (document.fullscreenElement) void document.exitFullscreen(); };
  useEffect(() => {
    const onChange = () => {
      const on = document.fullscreenElement === stageRef.current;
      setFs(on);
      if (!on && document.fullscreenElement === null) fsButtonRef.current?.focus();
    };
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  const shareUrl = phase === "idle" ? directUrl : `${directUrl}#${current}`;
  const confirm = (message: string, ok: boolean) => {
    setStatus(message); setCopied(ok);
    if (timerRef.current) window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => { setStatus(""); setCopied(false); }, 2600);
  };
  const copyLink = async () => {
    try { await navigator.clipboard.writeText(shareUrl); confirm(copy.copied, true); track("virtual_tour_share", { channel: "copy" }); }
    catch { confirm(shareUrl, false); }
  };
  const shareWeb = (href: string, channel: string, label: string, icon: ReactNode) => (
    <a className="imt-share__btn" href={href} target="_blank" rel="noopener noreferrer" aria-label={label} title={label} onClick={() => track("virtual_tour_share", { channel })}>{icon}</a>
  );
  const text = `${copy.shareText} ${shareUrl}`;
  const index = Math.max(0, scenes.findIndex((scene) => scene.id === current)) + 1;
  const sceneOf = copy.sceneOf.replace("{n}", String(index));

  return (
    <div className={`imt is-${phase}`}>
      <div ref={stageRef} className={`imt-stage${fs ? " is-fs" : ""}`} role="region" aria-label={copy.region} aria-busy={phase === "loading"}>
        {fs ? (
          <div className="imt-fsbar">
            <span className="imt-fsbar__brand">MEGAPARC · {name}</span>
            <span className="imt-fsbar__scene">{sceneOf}</span>
            <button type="button" className="imt-fsbar__exit" onClick={exitFullscreen}>
              <span>{copy.exitFullscreen}</span>
              <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true" focusable="false"><path d="M3 3l10 10M13 3L3 13" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
            </button>
          </div>
        ) : null}
        {phase === "idle" ? (
          <>
            <button type="button" className="imt-cover" onClick={() => start()} aria-label={`${copy.start} — ${copy.region}`}>
              {cover}
              <span className="imt-cover__shade" aria-hidden="true" />
              <span className="imt-360" aria-hidden="true"><i /><b>360°</b></span>
              <span className="imt-cover__cta"><Icon /> {copy.start}</span>
            </button>
            <noscript><a className="imt-noscript" href={src}>{copy.openPage}</a></noscript>
          </>
        ) : (
          <div className="imt-frame">
            {/* data-assistant-avoid: the site's floating assistant launcher steps aside from (or hides over) the running viewer — its controls live
                inside the frame, which the launcher's own probe cannot see otherwise; the cover before the start needs nothing (its button is protected) */}
            <iframe ref={frameRef} src={`${src}#${openAt}`} title={copy.frame} allow="fullscreen; accelerometer; gyroscope" allowFullScreen referrerPolicy="same-origin" data-assistant-avoid="" onLoad={onLoad} />
            {phase === "loading" ? (
              <div className="imt-loading" role="status">
                <span className="imt-360 is-spin" aria-hidden="true"><i /><b>360°</b></span>
                <span>{copy.loading}</span>
              </div>
            ) : null}
          </div>
        )}
      </div>

      <div className="imt-bar">
        <div className="imt-scenes">
          <p className="lg-label">{copy.scenes}</p>
          <ul className="imt-scenes__list">
            {levels.map((level) => {
              const own = scenes.filter((scene) => scene.level === level.key);
              return own.length ? (
                <li key={level.key} className="imt-scenes__group">
                  <span className="imt-scenes__level">{level.label}</span>
                  {own.map((scene) => {
                    const no = scenes.findIndex((item) => item.id === scene.id) + 1;
                    const on = current === scene.id && phase !== "idle";
                    return (
                      <button key={scene.id} type="button" className={`imt-scene${on ? " is-on" : ""}`} data-scene={scene.id} aria-pressed={on} onClick={() => openScene(scene.id)}>
                        <b>{no}</b><span>{scene.title}</span>
                      </button>
                    );
                  })}
                </li>
              ) : null;
            })}
          </ul>
          <p className="imt-scenes__hint">{copy.scenesHint}</p>
        </div>
        <div className="imt-tools">
          <button ref={fsButtonRef} type="button" className="btn btn--ghost imt-tool" onClick={enterFullscreen}>
            <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true" focusable="false"><path d="M2 6V2h4M10 2h4v4M14 10v4h-4M6 14H2v-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
            <span>{copy.fullscreen}</span>
          </button>
          <a className="pm-link pm-link--quiet imt-page" href={directUrl} target="_blank" rel="noopener noreferrer" onClick={() => track("virtual_tour_open_fullscreen", { mode: "page" })}>
            <span>{copy.openPage}</span>
            <Icon name="up-right" />
          </a>
          <div className="imt-share" role="group" aria-label={copy.share}>
            <span className="imt-share__label">{copy.share}</span>
            {shareWeb(`https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(copy.shareText)}`, "telegram", "Telegram", <UtilityIcon name="telegram" size={17} />)}
            {shareWeb(`https://wa.me/?text=${encodeURIComponent(text)}`, "whatsapp", "WhatsApp", <UtilityIcon name="whatsapp" size={17} />)}
            {/* the e-mail share opens the visitor's own mail client with no address: built on click, never a published mailto */}
            <button type="button" className="imt-share__btn" aria-label={copy.email} title={copy.email} onClick={() => { track("virtual_tour_share", { channel: "email" }); window.location.assign(`mailto:?subject=${encodeURIComponent(copy.shareText)}&body=${encodeURIComponent(text)}`); }}><UtilityIcon name="mail" size={17} /></button>
            <button type="button" className={`imt-share__btn imt-share__copy${copied ? " is-done" : ""}`} onClick={copyLink} aria-label={copy.copy} title={copy.copy}><UtilityIcon name={copied ? "check" : "link"} size={17} /><span>{copied ? copy.copied : copy.copy}</span></button>
            <span className="sr-only" role="status" aria-live="polite">{status}</span>
          </div>
        </div>
      </div>

      {phase !== "idle" ? (
        <div className="imt-next">
          <p className="lg-label">{copy.next}</p>
          <a className="btn imt-next__primary" href={ctas.viewing} data-intent="viewing" onClick={() => track("virtual_tour_viewing_cta", { scene: current })}>
            <span>{copy.after}</span>
            <Icon />
          </a>
          <a className="pm-link pm-link--quiet" href={ctas.offer} onClick={() => track("virtual_tour_viewing_cta", { scene: current, action: "offer" })}><span>{copy.offer}</span><Icon /></a>
          <a className="pm-link pm-link--quiet" href={ctas.plans}><span>{copy.plans}</span><Icon /></a>
          <a className="pm-link pm-link--quiet" href={ctas.terms}><span>{copy.terms}</span><Icon /></a>
          <a className="pm-link pm-link--quiet" href={ctas.contact}><span>{copy.contact}</span><Icon /></a>
        </div>
      ) : null}
    </div>
  );
}
