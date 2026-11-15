"use client";

import { useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import { shareBrands, type ShareBrand, type ShareBrandMark } from "@/components/leasing-toolkit/share-brands";
import { UtilityIcon } from "@/components/utility-icons";
import type { Photo } from "@/data/leasing-experience-model";
import { toolkitCopy } from "@/data/moscova-20-toolkit";
import { track } from "@/lib/track";
import type { SiteLocale } from "@/lib/site-data";

/**
 * SHARE THE PROPERTY — the compact share sheet (OWNER P1 «SHARE MODAL REDESIGN», 2026-11-15; supersedes the icon row of «PREMIUM
 * LEASING DOSSIER R2» §14–§22). Top to bottom: the property card (a real photograph, the name, the area and place, what the link
 * opens), the channels as recognisable brand marks with their names (Telegram · WhatsApp · Viber · E‑mail · Facebook · LinkedIn ·
 * the device's own share sheet where the browser offers one), and the link itself with one «Копировать ссылку» action.
 *
 * Behaviour unchanged: every channel shares the LINK to the language's Leasing Pack — never the PDFs, never a price; the e‑mail and
 * Viber actions are built on click (the static HTML carries web links only — qa-static); the copy answers inline; internal events only.
 * Not to be confused with the link card a messenger draws from the page's Open Graph data (src/lib/seo.ts → m20ShareImage).
 */
type Card = { name: string; area: string; photo?: Photo };

export function ShareProperty({ url, locale, card }: { url: string; locale: SiteLocale; card?: Card }) {
  const c = toolkitCopy.share;
  const text = `${c.text[locale]} ${url}`;
  // the native share sheet exists only in some browsers: read it as an external store (false on the server, no hydration mismatch)
  const native = useSyncExternalStore(() => () => {}, () => typeof navigator.share === "function", () => false);
  const [copied, setCopied] = useState(false);
  const [status, setStatus] = useState("");
  const timer = useRef<number | null>(null);

  useEffect(() => () => { if (timer.current) window.clearTimeout(timer.current); }, []);

  const confirm = (message: string, ok: boolean) => {
    setStatus(message);
    setCopied(ok);
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => { setStatus(""); setCopied(false); }, 2600);
  };
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      confirm(toolkitCopy.r2.copied[locale], true);
      track("m20_share", { channel: "copy" });
    } catch {
      // clipboard blocked: the link stays visible and selectable beside the button
      confirm(url, false);
    }
  };
  const share = async () => {
    try {
      await navigator.share({ title: "Moscova 20 · MEGAPARC", text: c.text[locale], url });
      track("m20_share", { channel: "native" });
    } catch {
      /* dismissed */
    }
  };
  const subject = encodeURIComponent("Moscova 20 · MEGAPARC");
  const body = encodeURIComponent(text);
  const shown = url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");

  const brand = (key: ShareBrand) => {
    const m: ShareBrandMark = shareBrands[key];
    return (
      <span className={`sh-ch__mark is-${m.kind}`} style={m.color ? { background: m.color } : undefined} aria-hidden="true">
        <svg viewBox={m.viewBox} focusable="false">{m.layers.map((l, i) => <path key={i} d={l.d} fill={l.fill} />)}</svg>
      </span>
    );
  };
  const plain = (content: ReactNode) => <span className="sh-ch__mark is-plain" aria-hidden="true">{content}</span>;
  const web = (href: string, label: string, channel: string, mark: ReactNode) => (
    <li><a className="sh-ch" href={href} target="_blank" rel="noopener noreferrer" aria-label={label} onClick={() => track("m20_share", { channel })}>{mark}<span className="sh-ch__label">{label}</span></a></li>
  );
  const action = (label: string, onClick: () => void, mark: ReactNode) => (
    <li><button type="button" className="sh-ch" onClick={onClick} aria-label={label}>{mark}<span className="sh-ch__label">{label}</span></button></li>
  );

  return (
    <div className="sh">
      {card ? (
        <div className="sh-card">
          {/* a static export: the derivative is already sized (no image optimiser) */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {card.photo ? <img className="sh-card__photo" src={card.photo.small} alt="" width={160} height={120} loading="lazy" decoding="async" /> : null}
          <div className="sh-card__text">
            <p className="sh-card__name">{card.name}</p>
            <p className="sh-card__meta">{card.area} · {c.cardPlace[locale]}</p>
            <p className="sh-card__note">{c.cardMaterials[locale]}</p>
          </div>
        </div>
      ) : null}

      <p className="sh-label">{c.via[locale]}</p>
      <ul className="sh-channels" aria-label={c.title[locale]}>
        {web(`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(c.text[locale])}`, "Telegram", "telegram", brand("telegram"))}
        {web(`https://wa.me/?text=${body}`, "WhatsApp", "whatsapp", brand("whatsapp"))}
        {/* the app scheme is built on click, like the e-mail share: the static HTML carries only web links */}
        {action("Viber", () => { track("m20_share", { channel: "viber" }); window.location.assign(`viber://forward?text=${body}`); }, brand("viber"))}
        {/* the e-mail share opens the visitor's own mail client with no address: built on click, never a published mailto */}
        {action(c.email[locale], () => { track("m20_share", { channel: "email" }); window.location.assign(`mailto:?subject=${subject}&body=${body}`); }, plain(<UtilityIcon name="mail" />))}
        {web(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, "Facebook", "facebook", brand("facebook"))}
        {web(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, "LinkedIn", "linkedin", brand("linkedin"))}
        {native ? action(c.native[locale].replace("…", ""), share, plain(<UtilityIcon name="share" />)) : null}
      </ul>

      <div className="sh-copy">
        <span className="sh-copy__url" title={url}>{shown}</span>
        <button type="button" className={`sh-copy__btn${copied ? " is-done" : ""}`} onClick={copy} aria-label={c.copy[locale]}>
          <UtilityIcon name={copied ? "check" : "link"} />
          <span>{copied ? c.copiedShort[locale] : c.copyAction[locale]}</span>
        </button>
      </div>
      <p className="lp-share__feedback sr-only" role="status" aria-live="polite">{status}</p>
    </div>
  );
}
