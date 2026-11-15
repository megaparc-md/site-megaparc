import { PageShell } from "@/components/page-shell";
import { ProducerEconomicsV21 } from "@/components/producer-economics-v21";
import { spacesFor } from "@/content/source";
import { contactLinks } from "@/data/demo-content";
import { m20Commercial, rentCalculation } from "@/data/moscova-20-commercial";
import type { SiteLocale } from "@/lib/site-data";

/**
 * The producer CFO calculator page — v2.1 since the OWNER «FINAL 2-DAY DELIVERY MANDATE» §06 (2026-11-14); v1 (OWNER R10 §04, 2026-11-13) stays in producer-economics.tsx — internal: noindex, OWNER preview only, removed from the production
 * artifact. The Moscova 20 figures it can insert on request are read from the published terms (the preliminary rent of the unit
 * record M20-01, the deposit in months, the 15 % of utilities) — never typed again and never pre-filled.
 */
export function ProducerEconomicsPage({ locale }: { locale: SiteLocale }) {
  const unit = spacesFor("moscova-20")[0] ?? null;
  const rent = unit ? rentCalculation(unit.breakdown ?? [], locale).monthly : 0;
  return (
    <PageShell locale={locale} mainClassName="r3-page pe-page">
      <section className="r3-sec r3-sec--ivory pe-sec">
        <div className="r3-shell">
          <ProducerEconomicsV21 locale={locale} m20={{ rent, depositMonths: m20Commercial.deposit.months, feePercent: m20Commercial.fee.percentOfUtilities }} mailto={contactLinks.email} />
        </div>
      </section>
    </PageShell>
  );
}
