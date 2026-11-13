import { PageShell } from "@/components/page-shell";
import { ProducerEconomics } from "@/components/producer-economics";
import { spacesFor } from "@/content/source";
import { m20Commercial, rentCalculation } from "@/data/moscova-20-commercial";
import type { SiteLocale } from "@/lib/site-data";

/**
 * The CFO-model prototype page (OWNER R10 §04, 2026-11-13) — internal: noindex, OWNER preview only, removed from the production
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
          <ProducerEconomics locale={locale} m20={{ rent, depositMonths: m20Commercial.deposit.months, feePercent: m20Commercial.fee.percentOfUtilities }} />
        </div>
      </section>
    </PageShell>
  );
}
