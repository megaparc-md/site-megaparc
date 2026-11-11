"use client";

import { useEffect } from "react";
import { Icon } from "@/components/ui";
import { track } from "@/lib/track";

/**
 * The actions of the Digital Leasing Pack and the QR landing counter. Each row is a plain link — to a page anchor, the PDF, the
 * official portal or a drawer (data-drawer is picked up by LgDrawer) — with its internal event (src/lib/track.ts). Rows, not cards:
 * hairlines, a label, one line of meta, the arrow.
 */
export type PackAction = { key: string; label: string; meta: string; href: string; event?: string; drawer?: string; external?: boolean; download?: boolean };

export function PackActions({ items }: { items: PackAction[] }) {
  return (
    <ul className="lp-actions">
      {items.map((item) => (
        <li key={item.key}>
          <a
            className="lp-action"
            href={item.href}
            {...(item.drawer ? { "data-drawer": item.drawer, "aria-haspopup": "dialog" as const } : {})}
            {...(item.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            {...(item.download ? { download: "" } : {})}
            onClick={item.event ? () => track(item.event!, { from: "pack" }) : undefined}
          >
            <span className="lp-action__label">{item.label}</span>
            <span className="lp-action__meta">{item.meta}</span>
            <Icon name={item.external ? "up-right" : "arrow"} size={18} />
          </a>
        </li>
      ))}
    </ul>
  );
}

/** Counts an arrival from the printed / on-screen QR code (`?src=qr`) — nothing else. */
export function QrLanding() {
  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("src") === "qr") track("m20_qr_landing");
  }, []);
  return null;
}
