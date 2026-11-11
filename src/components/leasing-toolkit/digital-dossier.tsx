"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/ui";
import { UtilityIcon } from "@/components/utility-icons";
import { track } from "@/lib/track";

/**
 * DIGITAL PROPERTY DOSSIER — the service block of the Moscova 20 property page (OWNER «MAKE MOSCOVA 20 DIGITAL TOOLS
 * DISCOVERABLE», 2026-11-11). Navigation only: one primary action (the language's Leasing Pack), two secondary rows (the
 * language's PDF presentation, the plans scene of this page) and one quiet utility (the QR, in a compact drawer — never a large
 * QR on the page; on a phone it stays the last, quietest line). No fact is typed here: every label, URL and meta line comes from
 * src/data/moscova-20-toolkit.ts through the property template. Internal events only (src/lib/track.ts).
 */
export type DossierCopy = { label: string; title: string; lead: string; pack: string; pdf: string; pdfMeta: string; plans: string; plansMeta: string; qr: string };

export function DigitalDossier({ copy, packHref, pdfHref, plansHref }: { copy: DossierCopy; packHref: string; pdfHref: string; plansHref: string }) {
  return (
    <section className="lt-dossier" id="digital-dossier" aria-labelledby="lt-dossier-title">
      <div className="xp-shell lt-dossier__grid">
        <div className="lt-dossier__head">
          <p className="lt-dossier__label">{copy.label}</p>
          <h2 className="lt-dossier__title" id="lt-dossier-title">{copy.title}</h2>
          <p className="lt-dossier__lead">{copy.lead}</p>
        </div>
        <div className="lt-dossier__actions">
          <Link className="btn lt-dossier__primary" href={packHref} onClick={() => track("m20_pack_open", { from: "property" })}>
            <span>{copy.pack}</span>
            <Icon size={16} />
          </Link>
          <ul className="lt-dossier__rows">
            <li>
              <a className="lt-dossier__row" href={pdfHref} download="" onClick={() => track("m20_dossier_download", { from: "property" })}>
                <span className="lt-dossier__row-label">{copy.pdf}</span>
                <span className="lt-dossier__row-meta">{copy.pdfMeta}</span>
                <UtilityIcon name="download" size={18} />
              </a>
            </li>
            <li>
              <a className="lt-dossier__row" href={plansHref} onClick={() => track("m20_plan_open", { from: "property" })}>
                <span className="lt-dossier__row-label">{copy.plans}</span>
                <span className="lt-dossier__row-meta">{copy.plansMeta}</span>
                <Icon size={18} />
              </a>
            </li>
          </ul>
          <a className="lt-dossier__qr" href="#qr" data-drawer="qr" aria-haspopup="dialog" onClick={() => track("m20_qr_open", { from: "property" })}>
            <UtilityIcon name="qr" size={14} />
            <span>{copy.qr}</span>
          </a>
        </div>
      </div>
    </section>
  );
}

/** The compact QR drawer: the QR (production canonical, src=qr), the short production URL of the language's pack, copy link. */
export function QrHandoff({ qr, url, text, copyLabel, copied }: { qr: string; url: string; text: string; copyLabel: string; copied: string }) {
  const [toast, setToast] = useState<string | null>(null);
  const timer = useRef<number | null>(null);
  useEffect(() => () => { if (timer.current) window.clearTimeout(timer.current); }, []);
  const copy = async () => {
    let message = copied;
    try {
      await navigator.clipboard.writeText(url);
      track("m20_share", { channel: "copy", from: "qr" });
    } catch {
      // clipboard blocked: the link stays visible and selectable
      message = url;
    }
    setToast(message);
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setToast(null), 2600);
  };
  return (
    <div className="lt-qr">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="lt-qr__img" src={qr} alt="QR · Moscova 20 Leasing Pack" width={176} height={176} loading="lazy" />
      <p className="lt-qr__text">{text}</p>
      <p className="lt-qr__url"><a href={url}>{url.replace(/^https?:\/\//, "").replace(/\/$/, "")}</a></p>
      <button type="button" className="btn btn--ghost lt-qr__copy" onClick={copy}><span>{copyLabel}</span></button>
      <p className="lp-toast" role="status" aria-live="polite" data-on={toast ? "true" : "false"}>{toast ?? ""}</p>
    </div>
  );
}
