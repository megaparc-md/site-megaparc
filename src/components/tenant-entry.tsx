import Link from "next/link";
import { tenantCabinet } from "@/data/tenant-cabinet";
import { localePath, type SiteLocale } from "@/lib/site-data";

/**
 * The quiet tenant-cabinet entry — «Для действующих арендаторов → Войти в кабинет» — in the footer, the contact service area and
 * the Digital Leasing Pack (OWNER «TENANT CABINET ENTRY», 2026-11-11). Renders nothing while the cabinet is not operational
 * (OPTION A); never a primary CTA, never beside the main leasing action with equal weight.
 */
export function TenantEntry({ locale, className = "" }: { locale: SiteLocale; className?: string }) {
  if (!tenantCabinet.enabled) return null;
  const href = tenantCabinet.externalUrl ?? localePath(locale, tenantCabinet.path);
  const inner = (
    <>
      <span className="tenant-entry__label">{tenantCabinet.label[locale]}</span>
      <span className="tenant-entry__arrow" aria-hidden="true"> → </span>
      <span className="tenant-entry__action">{tenantCabinet.action[locale]}</span>
    </>
  );
  return (
    <p className={`tenant-entry ${className}`.trim()}>
      {tenantCabinet.externalUrl ? <a href={href} rel="noopener">{inner}</a> : <Link href={href}>{inner}</Link>}
    </p>
  );
}
