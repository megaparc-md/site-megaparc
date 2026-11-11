"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { UtilityIcon } from "@/components/utility-icons";
import { toolkitCopy } from "@/data/moscova-20-toolkit";
import { track } from "@/lib/track";
import type { SiteLocale } from "@/lib/site-data";

/**
 * SHARE WITH PARTNER (OWNER toolkit mandate §21–23 · «PREMIUM LEASING DOSSIER R2» §14–§22, 2026-11-11): one restrained utility
 * row of real line icons — native share where the browser offers one, copy link, e-mail, Telegram, WhatsApp. Desktop shows icon +
 * short label, phones the compact icon treatment; every control keeps its accessible name. The copy action answers with a small
 * inline «Ссылка скопирована» next to the row (no large toast). The text carries the property name, the place and two verified
 * facts — never a price; the URL is the production Leasing Pack. No login, no social-media footer.
 */
export function ShareProperty({ url, locale, compact = false }: { url: string; locale: SiteLocale; compact?: boolean }) {
  const c = toolkitCopy.share;
  const text = `${c.text[locale]} ${url}`;
  // the native share sheet exists only in some browsers: read it as an external store (false on the server, no hydration mismatch)
  const native = useSyncExternalStore(() => () => {}, () => typeof navigator.share === "function", () => false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const timer = useRef<number | null>(null);

  useEffect(() => () => { if (timer.current) window.clearTimeout(timer.current); }, []);

  const say = (message: string) => {
    setFeedback(message);
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setFeedback(null), 2600);
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      say(toolkitCopy.r2.copied[locale]);
      track("m20_share", { channel: "copy" });
    } catch {
      // clipboard blocked: the link stays visible and selectable below
      say(url);
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

  return (
    <div className={`lp-share${compact ? " is-compact" : ""}`}>
      <ul className="lp-share__row" aria-label={c.title[locale]}>
        {native ? (
          <li><button type="button" className="lp-share__item" onClick={share} aria-label={c.native[locale]}><UtilityIcon name="share" /><span>{c.native[locale]}</span></button></li>
        ) : null}
        <li><button type="button" className="lp-share__item" onClick={copy} aria-label={c.copy[locale]}><UtilityIcon name="link" /><span>{c.copy[locale]}</span></button></li>
        {/* the e-mail share opens the visitor's own mail client with no address: built on click, so the static HTML carries no mailto that could read as a published contact */}
        <li><button type="button" className="lp-share__item" onClick={() => { track("m20_share", { channel: "email" }); window.location.href = `mailto:?subject=${subject}&body=${body}`; }} aria-label={c.email[locale]}><UtilityIcon name="mail" /><span>{c.email[locale]}</span></button></li>
        <li><a className="lp-share__item" href={`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(c.text[locale])}`} target="_blank" rel="noopener noreferrer" aria-label="Telegram" onClick={() => track("m20_share", { channel: "telegram" })}><UtilityIcon name="telegram" /><span>Telegram</span></a></li>
        <li><a className="lp-share__item" href={`https://wa.me/?text=${body}`} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" onClick={() => track("m20_share", { channel: "whatsapp" })}><UtilityIcon name="whatsapp" /><span>WhatsApp</span></a></li>
      </ul>
      <p className="lp-share__url"><a href={url}>{url.replace(/^https?:\/\//, "")}</a><span className="lp-share__feedback" role="status" aria-live="polite" data-on={feedback ? "true" : "false"}>{feedback ?? ""}</span></p>
    </div>
  );
}
