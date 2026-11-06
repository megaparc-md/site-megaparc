import { LgPhoto, ui } from "@/components/leasing-experience/parts";
import { Icon } from "@/components/ui";
import { publishable, type LeasingExperience } from "@/data/leasing-experience-model";
import type { SiteLocale } from "@/lib/site-data";

/**
 * SCENE 05 — «ВЫ НАЧИНАЕТЕ НЕ С БЕТОННОЙ КОРОБКИ» (OWNER compact brief §1, §8):
 * the capital base as a feeling first — one large real interior photograph with
 * the line on it — then two short lists: done / for your business. Never "zero
 * CAPEX": the tenant's money goes into the concept, equipment and brand.
 */
export function CapitalBase({ x, locale }: { x: LeasingExperience; locale: SiteLocale }) {
  const c = x.capex;
  return (
    <section id="capex" className="lg-capex" aria-labelledby="lg-capex-title">
      <figure className="lg-capex__stage">
        <LgPhoto photo={x.photos[c.photo]} locale={locale} sizes="(min-width: 1600px) 1600px, 100vw" className="lg-capex__photo" />
        <figcaption className="lg-capex__over" data-reveal>
          <p className="pm-kicker">{c.kicker[locale]}</p>
          <h2 className="lg-capex__title" id="lg-capex-title">{c.title[locale]}</h2>
          {c.lead ? <p className="lg-capex__lead">{c.lead[locale]}</p> : null}
        </figcaption>
      </figure>
      <div className="xp-shell lg-capex__lists">
        <p className="lg-capex__body" data-reveal>{c.body[locale]}</p>
        <div className="lg-capex__col is-ready" data-reveal>
          <h3 className="lg-label">{c.readyTitle[locale]}</h3>
          <ul className="lg-ticks">
            {c.ready.filter((item) => publishable(item.evidence)).map((item) => (
              <li key={item.text.en}>{item.text[locale]}</li>
            ))}
          </ul>
        </div>
        <div className="lg-capex__col is-tenant" data-reveal>
          <h3 className="lg-label">{c.tenantTitle[locale]}</h3>
          <ul className="lg-dashes">
            {c.tenant.map((item) => (
              <li key={item.text.en}>{item.text[locale]}</li>
            ))}
          </ul>
          <a className="pm-link lg-capex__more" href="#readiness" data-tab="readiness"><span>{ui.chReadiness[locale]}</span><Icon /></a>
        </div>
      </div>
    </section>
  );
}
