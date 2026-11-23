"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * PANORAMA VIEWER — OWNER «PROPERTY COMMERCIAL EXPERIENCE 2026» Part D (2026-11-23). A small self-hosted WebGL 2 viewer for
 * equirectangular 2 : 1 panoramas (no library, no service, no licence fee; docs/…/TOUR_VIEWER_COMPARISON.md). One full-screen triangle,
 * the fragment shader turns each pixel into a ray and samples the panorama with explicit gradients (no seam at the 0° / 360° join, mipmaps
 * for a calm image when zoomed out). Drag (mouse / touch / pen) turns the view, the wheel or a pinch zooms (field of view 35–100°), the
 * arrow keys and + / − work from the keyboard. Hotspots are HTML buttons projected each frame: a navigation link (a physically connected
 * place) or an information point. Panoramas load only when their scene opens; a device that cannot draw 8K gets the 4K file.
 */

export type ViewerLink = { key: string; label: string; yaw: number; pitch: number; kind: "nav" | "info"; text?: string };

const VERT = `#version 300 es
in vec2 p; out vec2 v; void main() { v = p; gl_Position = vec4(p, 0.0, 1.0); }`;
const FRAG = `#version 300 es
precision highp float;
in vec2 v; out vec4 o;
uniform sampler2D tex; uniform float yaw, pitch, tanHalf, aspect;
const float PI = 3.14159265358979;
void main() {
  vec3 d = normalize(vec3(v.x * tanHalf * aspect, v.y * tanHalf, -1.0));
  float cp = cos(pitch), sp = sin(pitch);
  d = vec3(d.x, d.y * cp - d.z * sp, d.y * sp + d.z * cp);
  float cy = cos(yaw), sy = sin(yaw);
  d = vec3(d.x * cy - d.z * sy, d.y, d.x * sy + d.z * cy);
  vec2 uv = vec2(atan(d.x, -d.z) / (2.0 * PI) + 0.5, 0.5 - asin(clamp(d.y, -1.0, 1.0)) / PI);
  vec2 dx = dFdx(uv), dy = dFdy(uv);
  dx.x -= sign(dx.x) * step(0.5, abs(dx.x));
  dy.x -= sign(dy.x) * step(0.5, abs(dy.x));
  o = textureGrad(tex, uv, dx, dy);
}`;

const rad = (deg: number) => (deg * Math.PI) / 180;
const clamp = (x: number, a: number, b: number) => Math.min(b, Math.max(a, x));

type View = { yaw: number; pitch: number; fov: number };

export function PanoViewer({ src, fallbackSrc, start, links, onLink, loadingText, noGlText, hint, placeholderText }: { src: string; fallbackSrc: string; start: View; links: ViewerLink[]; onLink: (key: string) => void; loadingText: string; noGlText: string; hint: string; /** the label of the generated placeholder sphere (OWNER preview interface demonstration) */ placeholderText?: string }) {
  const wrap = useRef<HTMLDivElement | null>(null);
  const canvas = useRef<HTMLCanvasElement | null>(null);
  const view = useRef<View>({ ...start });
  const gl = useRef<{ ctx: WebGL2RenderingContext; prog: WebGLProgram; tex: WebGLTexture; u: Record<string, WebGLUniformLocation | null> } | null>(null);
  const spots = useRef<(HTMLButtonElement | null)[]>([]);
  const frame = useRef(0);
  const [state, setState] = useState<"loading" | "ready" | "nogl">("loading");

  const draw = useCallback(() => {
    frame.current = 0;
    const g = gl.current, c = canvas.current;
    if (!g || !c) return;
    const { ctx, u } = g;
    const w = c.clientWidth, h = c.clientHeight, dpr = Math.min(window.devicePixelRatio || 1, 2);
    if (c.width !== Math.round(w * dpr) || c.height !== Math.round(h * dpr)) { c.width = Math.round(w * dpr); c.height = Math.round(h * dpr); }
    ctx.viewport(0, 0, c.width, c.height);
    const { yaw, pitch, fov } = view.current;
    const tanHalf = Math.tan(rad(fov) / 2), aspect = w / Math.max(1, h);
    ctx.uniform1f(u.yaw, rad(yaw)); ctx.uniform1f(u.pitch, rad(pitch)); ctx.uniform1f(u.tanHalf, tanHalf); ctx.uniform1f(u.aspect, aspect);
    ctx.drawArrays(ctx.TRIANGLES, 0, 3);
    // project the hotspots: world direction → camera space (inverse yaw, then inverse pitch)
    links.forEach((link, i) => {
      const el = spots.current[i];
      if (!el) return;
      const ly = rad(link.yaw), lp = rad(link.pitch);
      let x = Math.cos(lp) * Math.sin(ly), y = Math.sin(lp), z = -Math.cos(lp) * Math.cos(ly);
      const cy = Math.cos(-rad(yaw)), sy = Math.sin(-rad(yaw));
      [x, z] = [x * cy - z * sy, x * sy + z * cy];
      const cp = Math.cos(-rad(pitch)), sp = Math.sin(-rad(pitch));
      [y, z] = [y * cp - z * sp, y * sp + z * cp];
      if (z >= -0.05) { el.style.visibility = "hidden"; return; }
      const sx = x / -z / (tanHalf * aspect), sy2 = y / -z / tanHalf;
      if (Math.abs(sx) > 1.1 || Math.abs(sy2) > 1.1) { el.style.visibility = "hidden"; return; }
      el.style.visibility = "visible";
      el.style.transform = `translate(${((sx + 1) / 2) * w}px, ${((1 - sy2) / 2) * h}px)`;
    });
  }, [links]);

  const schedule = useCallback(() => { if (!frame.current) frame.current = window.requestAnimationFrame(draw); }, [draw]);

  // WebGL setup + the panorama (on demand: this effect runs only when the viewer is opened on a scene)
  useEffect(() => {
    const c = canvas.current;
    if (!c) return;
    const ctx = c.getContext("webgl2", { antialias: false, alpha: false, preserveDrawingBuffer: false });
    if (!ctx) { setState("nogl"); return; }
    const sh = (type: number, text: string) => { const s = ctx.createShader(type)!; ctx.shaderSource(s, text); ctx.compileShader(s); return s; };
    const prog = ctx.createProgram()!;
    ctx.attachShader(prog, sh(ctx.VERTEX_SHADER, VERT)); ctx.attachShader(prog, sh(ctx.FRAGMENT_SHADER, FRAG)); ctx.linkProgram(prog);
    if (!ctx.getProgramParameter(prog, ctx.LINK_STATUS)) { setState("nogl"); return; }
    ctx.useProgram(prog);
    const buf = ctx.createBuffer(); ctx.bindBuffer(ctx.ARRAY_BUFFER, buf); ctx.bufferData(ctx.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), ctx.STATIC_DRAW);
    const loc = ctx.getAttribLocation(prog, "p"); ctx.enableVertexAttribArray(loc); ctx.vertexAttribPointer(loc, 2, ctx.FLOAT, false, 0, 0);
    const tex = ctx.createTexture()!;
    const u = Object.fromEntries(["tex", "yaw", "pitch", "tanHalf", "aspect"].map((name) => [name, ctx.getUniformLocation(prog, name)]));
    gl.current = { ctx, prog, tex, u };
    const max = ctx.getParameter(ctx.MAX_TEXTURE_SIZE) as number;
    const big = max >= 8192 && window.matchMedia("(min-width: 1024px)").matches;
    let cancelled = false;
    const upload = (source: TexImageSource) => {
      ctx.bindTexture(ctx.TEXTURE_2D, tex);
      ctx.pixelStorei(ctx.UNPACK_FLIP_Y_WEBGL, false);
      ctx.texImage2D(ctx.TEXTURE_2D, 0, ctx.RGBA, ctx.RGBA, ctx.UNSIGNED_BYTE, source);
      ctx.generateMipmap(ctx.TEXTURE_2D);
      ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_MIN_FILTER, ctx.LINEAR_MIPMAP_LINEAR);
      ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_MAG_FILTER, ctx.LINEAR);
      ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_WRAP_S, ctx.REPEAT);
      ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_WRAP_T, ctx.CLAMP_TO_EDGE);
      ctx.uniform1i(u.tex, 0);
      setState("ready");
      schedule();
    };
    // OWNER preview interface demonstration: a neutral generated sphere (no photograph, no imitation of the premises), plainly labelled
    if (src.startsWith("placeholder:")) {
      const c = document.createElement("canvas"); c.width = 4096; c.height = 2048;
      const g = c.getContext("2d")!;
      const sky = g.createLinearGradient(0, 0, 0, 2048); sky.addColorStop(0, "#e9e7e3"); sky.addColorStop(0.5, "#f4f3f1"); sky.addColorStop(0.5, "#d9d6d1"); sky.addColorStop(1, "#bdb9b3");
      g.fillStyle = sky; g.fillRect(0, 0, 4096, 2048);
      g.strokeStyle = "rgba(34,34,34,.10)"; g.lineWidth = 2;
      for (let x = 0; x <= 4096; x += 4096 / 24) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, 2048); g.stroke(); }
      for (let y = 0; y <= 2048; y += 2048 / 12) { g.beginPath(); g.moveTo(0, y); g.lineTo(4096, y); g.stroke(); }
      g.strokeStyle = "rgba(34,34,34,.28)"; g.lineWidth = 3; g.beginPath(); g.moveTo(0, 1024); g.lineTo(4096, 1024); g.stroke();
      // the label: line 1 «ПАНОРАМА ОЖИДАЕТСЯ», line 2 the scene (number · title), repeated four times around the sphere
      const [first, second] = (placeholderText ?? "").split("\n");
      g.fillStyle = "rgba(34,34,34,.55)"; g.textAlign = "center"; g.font = "600 64px Manrope, Arial, sans-serif";
      for (let k = 0; k < 4; k++) g.fillText(first ?? "", 512 + k * 1024, 960);
      g.font = "500 44px Manrope, Arial, sans-serif"; g.fillStyle = "rgba(34,34,34,.45)";
      for (let k = 0; k < 4; k++) g.fillText(second ?? src.slice("placeholder:".length), 512 + k * 1024, 1100);
      upload(c);
      return () => { cancelled = true; if (frame.current) window.cancelAnimationFrame(frame.current); ctx.deleteTexture(tex); ctx.deleteProgram(prog); ctx.deleteBuffer(buf); gl.current = null; };
    }
    const img = new Image();
    img.decoding = "async";
    img.onload = () => {
      if (cancelled) return;
      ctx.bindTexture(ctx.TEXTURE_2D, tex);
      ctx.pixelStorei(ctx.UNPACK_FLIP_Y_WEBGL, false);
      ctx.texImage2D(ctx.TEXTURE_2D, 0, ctx.RGBA, ctx.RGBA, ctx.UNSIGNED_BYTE, img);
      ctx.generateMipmap(ctx.TEXTURE_2D);
      ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_MIN_FILTER, ctx.LINEAR_MIPMAP_LINEAR);
      ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_MAG_FILTER, ctx.LINEAR);
      ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_WRAP_S, ctx.REPEAT);
      ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_WRAP_T, ctx.CLAMP_TO_EDGE);
      const aniso = ctx.getExtension("EXT_texture_filter_anisotropic");
      if (aniso) ctx.texParameterf(ctx.TEXTURE_2D, aniso.TEXTURE_MAX_ANISOTROPY_EXT, Math.min(8, ctx.getParameter(aniso.MAX_TEXTURE_MAX_ANISOTROPY_EXT)));
      ctx.uniform1i(u.tex, 0);
      setState("ready");
      schedule();
    };
    img.onerror = () => { if (!cancelled) setState("nogl"); };
    img.src = big ? src : fallbackSrc;
    return () => {
      cancelled = true;
      if (frame.current) window.cancelAnimationFrame(frame.current);
      ctx.deleteTexture(tex); ctx.deleteProgram(prog); ctx.deleteBuffer(buf);
      gl.current = null;
    };
  }, [src, fallbackSrc, schedule, placeholderText]);

  useEffect(() => { view.current = { ...start }; schedule(); }, [start, schedule]);

  // interaction: drag, pinch, wheel, keys, resize
  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const pts = new Map<number, { x: number; y: number }>();
    let pinch = 0;
    const down = (e: PointerEvent) => { if ((e.target as HTMLElement).closest("button")) return; el.setPointerCapture(e.pointerId); pts.set(e.pointerId, { x: e.clientX, y: e.clientY }); };
    const move = (e: PointerEvent) => {
      const prev = pts.get(e.pointerId);
      if (!prev) return;
      const h = el.clientHeight || 1;
      if (pts.size === 1) {
        const k = view.current.fov / h;
        view.current.yaw = (view.current.yaw - (e.clientX - prev.x) * k + 360) % 360;
        view.current.pitch = clamp(view.current.pitch + (e.clientY - prev.y) * k, -85, 85);
      }
      pts.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (pts.size === 2) {
        const [a, b] = [...pts.values()];
        const dist = Math.hypot(a.x - b.x, a.y - b.y);
        if (pinch) view.current.fov = clamp(view.current.fov * (pinch / dist), 35, 100);
        pinch = dist;
      }
      schedule();
    };
    const up = (e: PointerEvent) => { pts.delete(e.pointerId); if (pts.size < 2) pinch = 0; };
    const wheel = (e: WheelEvent) => { e.preventDefault(); view.current.fov = clamp(view.current.fov + e.deltaY * 0.04, 35, 100); schedule(); };
    const key = (e: KeyboardEvent) => {
      const step = e.shiftKey ? 15 : 5;
      const v = view.current;
      if (e.key === "ArrowLeft") v.yaw = (v.yaw - step + 360) % 360;
      else if (e.key === "ArrowRight") v.yaw = (v.yaw + step) % 360;
      else if (e.key === "ArrowUp") v.pitch = clamp(v.pitch + step, -85, 85);
      else if (e.key === "ArrowDown") v.pitch = clamp(v.pitch - step, -85, 85);
      else if (e.key === "+" || e.key === "=") v.fov = clamp(v.fov - 5, 35, 100);
      else if (e.key === "-") v.fov = clamp(v.fov + 5, 35, 100);
      else return;
      e.preventDefault();
      schedule();
    };
    const ro = new ResizeObserver(schedule);
    el.addEventListener("pointerdown", down); el.addEventListener("pointermove", move); el.addEventListener("pointerup", up); el.addEventListener("pointercancel", up);
    el.addEventListener("wheel", wheel, { passive: false }); el.addEventListener("keydown", key);
    ro.observe(el);
    return () => {
      el.removeEventListener("pointerdown", down); el.removeEventListener("pointermove", move); el.removeEventListener("pointerup", up); el.removeEventListener("pointercancel", up);
      el.removeEventListener("wheel", wheel); el.removeEventListener("keydown", key);
      ro.disconnect();
    };
  }, [schedule]);

  return (
    <div className={`pano is-${state}`} ref={wrap} tabIndex={0} aria-label={hint}>
      <canvas className="pano__canvas" ref={canvas} />
      {links.map((link, i) => (
        <button
          key={link.key}
          ref={(node) => {
            spots.current[i] = node;
          }}
          type="button"
          className={`pano__spot is-${link.kind}`}
          onClick={() => (link.kind === "nav" ? onLink(link.key) : undefined)}
          aria-label={link.text ? `${link.label}: ${link.text}` : link.label}
        >
          <i aria-hidden="true" />
          <span>{link.label}</span>
        </button>
      ))}
      {state === "loading" ? <p className="pano__state" role="status">{loadingText}</p> : null}
      {state === "nogl" ? <p className="pano__state is-error" role="status">{noGlText}</p> : null}
      <p className="pano__hint" aria-hidden="true">{hint}</p>
    </div>
  );
}
