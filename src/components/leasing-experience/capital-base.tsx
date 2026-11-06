import { LgPhoto, ui } from "@/components/leasing-experience/parts";
import { Icon } from "@/components/ui";
import { publishable, type LeasingExperience } from "@/data/leasing-experience-model";
import type { SiteLocale } from "@/lib/site-data";

/**
 * SCENE 04 — CAPITAL READINESS · PROOF with emotion (OWNER "FINAL VIEWING
 * CONVERSION PASS", 2026-11-06): one large real interior, «Вкладывайте в свой
 * бизнес. / Не в базовое восстановление помещения.», «Основные капитальные
 * работы уже выполнены.», then УЖЕ ГОТОВО (five) and ПОД ВАШ БИЗНЕС (five) —
 * on the photograph on wide screens, below it on phones. Never "zero CAPEX".
 * The detail (what we still confirm, what opening involves, terms) is one tap
 * away in the readiness drawer.
 */
export function CapitalBase({ x, locale }: { x: LeasingExperience; locale: SiteLocale }) {
  const c = x.capex;
  return (
    <section id="capex" className="lg-capex" aria-labelledby="lg-capex-title">
      <div className="lg-capex__stage">
        <LgPhoto photo={x.photos[c.photo]} locale={locale} sizes="(min-width: 1600px) 1600px, 100vw" className="lg-capex__photo" />
        <div className="xp-shell lg-capex__over">
          <header className="lg-capex__head" data-reveal>
            <p className="pm-kicker">{c.kicker[locale]}</p>
            <h2 className="lg-capex__title" id="lg-capex-title">{c.title[locale]}</h2>
            {c.lead ? <p className="lg-capex__lead">{c.lead[locale]}</p> : null}
          </header>
          <div className="lg-capex__lists" data-reveal>
            <div className="lg-capex__col is-ready">
              <h3 className="lg-label">{c.readyTitle[locale]}</h3>
              <ul className="lg-ticks">
                {c.ready.filter((item) => publishable(item.evidence)).map((item) => (
                  <li key={item.text.en}>{item.text[locale]}</li>
                ))}
              </ul>
            </div>
            <div className="lg-capex__col is-tenant">
              <h3 className="lg-label">{c.tenantTitle[locale]}</h3>
              <ul className="lg-dashes">
                {c.tenant.map((item) => (
                  <li key={item.text.en}>{item.text[locale]}</li>
                ))}
              </ul>
            </div>
            <a className="pm-link lg-capex__more" href="#readiness" data-drawer="readiness" aria-haspopup="dialog"><span>{ui.chReadiness[locale]}</span><Icon /></a>
          </div>
        </div>
      </div>
    </section>
  );
}
