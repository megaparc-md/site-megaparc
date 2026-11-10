import type { CSSProperties } from "react";
import { LgPhoto, ui } from "@/components/leasing-experience/parts";
import { Icon } from "@/components/ui";
import { publishable, type LeasingExperience } from "@/data/leasing-experience-model";
import type { SiteLocale } from "@/lib/site-data";

/**
 * SCENE — CAPITAL BASE · the one truly dark scene (OWNER "FINAL ART DIRECTION
 * & VISUAL CONVERSION PASS", 2026-11-09, §20): graphite, one large real
 * interior that stays bright — the photograph is the argument, never dimmed
 * under a gradient — «Вкладывайте в свой бизнес. / Не в базовое восстановление.»,
 * then УЖЕ ГОТОВО and ПОД ВАШ БИЗНЕС in a few words each. Never "zero CAPEX".
 * The detail (what we still confirm, what opening involves, the technical rows)
 * is one tap away in the drawers. Card & air pass (2026-11-09, §11): the two
 * lists as two premium cards under the headline — УЖЕ ГОТОВО light, ПОД ВАШ
 * БИЗНЕС dark — five short words each.
 */
export function CapitalBase({ x, locale }: { x: LeasingExperience; locale: SiteLocale }) {
  const c = x.capex;
  return (
    <section id="capex" className={`lg-capex${c.photo ? "" : " lg-capex--nomedia"}`} aria-labelledby="lg-capex-title">
      <div className="xp-shell lg-capex__grid">
        <header className="lg-capex__head">
          <p className="pm-kicker" data-reveal>{c.kicker[locale]}</p>
          <h2 className="xp-mask lg-display lg-capex__title" id="lg-capex-title" data-reveal>
            {c.title[locale].split("\n").map((line, i) => (
              <span key={line} className="xp-mask__line"><span style={{ "--i": i } as CSSProperties}>{line}</span></span>
            ))}
          </h2>
          {c.lead ? <p className="lg-capex__lead" data-reveal>{c.lead[locale]}</p> : null}
        </header>
        {/* the photograph is the argument; a dataset without a second real photograph keeps the scene without one — never a repeat */}
        {c.photo && x.photos[c.photo] ? (
          <figure className="lg-capex__media" data-reveal>
            <LgPhoto photo={x.photos[c.photo]} locale={locale} sizes="(min-width: 1024px) 58vw, 100vw" className="lg-capex__photo" />
          </figure>
        ) : null}
        <div className="lg-capex__lists">
          <div className="lg-card lg-capex__col is-ready" data-reveal>
            <h3 className="lg-capex__label">{c.readyTitle[locale]}</h3>
            <ul className="lg-capex__words is-ready">
              {c.ready.filter((item) => publishable(item.evidence)).map((item) => (
                <li key={item.text.en}>{item.text[locale]}</li>
              ))}
            </ul>
          </div>
          <div className="lg-card lg-capex__col is-tenant" data-reveal>
            <h3 className="lg-capex__label">{c.tenantTitle[locale]}</h3>
            <ul className="lg-capex__words is-tenant">
              {c.tenant.map((item) => (
                <li key={item.text.en}>{item.text[locale]}</li>
              ))}
            </ul>
          </div>
          <p className="lg-capex__more" data-reveal>
            <a className="pm-link" href="#readiness" data-drawer="readiness" aria-haspopup="dialog"><span>{ui.chReadiness[locale]}</span><Icon /></a>
            <a className="pm-link" href="#tech" data-drawer="tech" aria-haspopup="dialog"><span>{ui.chTech[locale]}</span><Icon /></a>
          </p>
        </div>
      </div>
    </section>
  );
}
