import Link from "next/link";
import type { ReactNode } from "react";
import { demoHref, demoMeta, demoNav, type DemoSection } from "@/data/tenant-cabinet-demo";

/**
 * TENANT CABINET · OWNER DEMO — the frame (OWNER «COMPLETE THE MISSING TENANT CABINET OWNER DEMO», 2026-11-11): the demo band
 * «OWNER DEMO · NOT FOR PUBLIC USE» on every screen, a quiet property-service header (MEGAPARC · Кабинет арендатора · the demo
 * tenant and the property), the six-section navigation (desktop: one hairline row; phone: a 3 × 2 grid, no scrolling) and the
 * page. No site header / footer, no language switcher, no link from the public site to here. Server component.
 */
export function CabinetShell({ active, children }: { active: DemoSection; children: ReactNode }) {
  return (
    <div className="tc" lang="ru">
      <p className="tc-band" role="note">
        <strong>{demoMeta.marker}</strong>
        <span>{demoMeta.note}</span>
      </p>
      <header className="tc-head">
        <div className="tc-shell tc-head__grid">
          <Link className="tc-brand" href={demoHref("/")}>
            <span className="tc-brand__mark">MEGAPARC</span>
            <span className="tc-brand__product">{demoMeta.product}</span>
          </Link>
          <p className="tc-who">
            <span className="tc-who__tenant">{demoMeta.tenant}</span>
            <span className="tc-who__property">{demoMeta.property} · {demoMeta.unit}</span>
          </p>
        </div>
        <nav className="tc-shell tc-nav" aria-label="Разделы кабинета">
          {demoNav.map((item) => (
            <Link key={item.key} href={demoHref(item.path)} className="tc-nav__item" aria-current={item.key === active ? "page" : undefined}>
              {item.label}
            </Link>
          ))}
        </nav>
      </header>
      <main className="tc-main">{children}</main>
      <footer className="tc-foot">
        <div className="tc-shell tc-foot__grid">
          <span>{demoMeta.marker} · {demoMeta.tenant} — вымышленная компания; все суммы, документы и{" "}обращения — демо.</span>
          <Link href="/ru/">← {demoMeta.site}</Link>
        </div>
      </footer>
    </div>
  );
}

/** a page heading inside the cabinet: small label, serif title, one optional line */
export function CabinetHeading({ label, title, lead, children }: { label: string; title: string; lead?: string; children?: ReactNode }) {
  return (
    <div className="tc-heading">
      <div>
        <p className="tc-label">{label}</p>
        <h1 className="tc-title">{title}</h1>
        {lead ? <p className="tc-lead">{lead}</p> : null}
      </div>
      {children ? <div className="tc-heading__aside">{children}</div> : null}
    </div>
  );
}

/** the monochrome status mark — shade and weight, never a colour code (burgundy only where the tenant must act) */
export function StatusMark({ status }: { status: string }) {
  const tone = status === "Выполнено" || status === "Оплачено" ? "done" : status === "Ожидает арендатора" || status === "К оплате" ? "act" : status === "В работе" ? "work" : "new";
  return <span className={`tc-status is-${tone}`}>{status}</span>;
}
