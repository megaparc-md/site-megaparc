"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { toolkitCopy } from "@/data/moscova-20-toolkit";
import { track } from "@/lib/track";
import type { SiteLocale } from "@/lib/site-data";

/**
 * SHARE WITH PARTNER (OWNER toolkit mandate §21–23): copy the canonical link (a short toast «Ссылка на Moscova 20 скопирована.»),
 * e-mail, Telegram, WhatsApp and the native share sheet where the browser offers one. No login, no large popup; the text carries
 * the property name, the place and two verified facts — never a price.
 */
export function ShareProperty({ url, locale, compact = false }: { url: string; locale: SiteLocale; compact?: boolean }) {
  const c = toolkitCopy.share;
  const text = `${c.text[locale]} ${url}`;
  // the native share sheet exists only in some browsers: read it as an external store (false on the server, no hydration mismatch)
  const native = useSyncExternalStore(() => () => {}, () => typeof navigator.share === "function", () => false);
  const [toast, setToast] = useState<string | null>(null);
  const timer = useRef<number | null>(null);

  useEffect(() => () => { if (timer.current) window.clearTimeout(timer.current); }, []);

  const say = (message: string) => {
    setToast(message);
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setToast(null), 2600);
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      say(c.copied[locale]);
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
      <ul className="lp-share__list">
        {native ? <li><button type="button" className="btn lp-share__btn" onClick={share}><span>{c.native[locale]}</span></button></li> : null}
        <li><button type="button" className="btn btn--ghost lp-share__btn" onClick={copy}><span>{c.copy[locale]}</span></button></li>
        {/* the e-mail share opens the visitor's own mail client with no address: built on click, so the static HTML carries no mailto that could read as a published contact */}
        <li><button type="button" className="btn btn--ghost lp-share__btn" onClick={() => { track("m20_share", { channel: "email" }); window.location.href = `mailto:?subject=${subject}&body=${body}`; }}><span>{c.email[locale]}</span></button></li>
        <li><a className="btn btn--ghost lp-share__btn" href={`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(c.text[locale])}`} target="_blank" rel="noopener noreferrer" onClick={() => track("m20_share", { channel: "telegram" })}><span>{c.telegram[locale]}</span></a></li>
        <li><a className="btn btn--ghost lp-share__btn" href={`https://wa.me/?text=${body}`} target="_blank" rel="noopener noreferrer" onClick={() => track("m20_share", { channel: "whatsapp" })}><span>{c.whatsapp[locale]}</span></a></li>
      </ul>
      <p className="lp-share__url"><a href={url}>{url.replace(/^https?:\/\//, "")}</a></p>
      <p className="lp-toast" role="status" aria-live="polite" data-on={toast ? "true" : "false"}>{toast ?? ""}</p>
    </div>
  );
}
