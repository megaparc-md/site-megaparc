import type { ReactNode } from "react";
import "@/app/land-pack-print.css";
import { c, confidenceCopy, natureCopy, registerCopy, roleCopy } from "@/components/land-experience/copy";
import { T } from "@/data/leasing-experience-model";
import { company } from "@/data/demo-content";
import { publicView, type LandAsset, type ParamGroup } from "@/data/land/model";
import { formatArea } from "@/content/source";
import { numberLocale, publicAsset, type SiteLocale } from "@/lib/site-data";

/**
 * DEVELOPER PACK — the PDF architecture (OWNER «DROCHIA · DEVELOPMENT & INVESTMENT EXPERIENCE» §13, 2026-11-23). One A4-landscape document
 * per language printed from the SAME LandAsset configuration as the page (internal route /document-print/developer-pack/<slug>/, noindex,
 * removed from the production artifact by scripts/package-production.mjs; printed by scripts/land-pack-print.mjs).
 *
 * A section is printed only when its material exists (`pack[].state === "ready"` or data on the asset): never an empty page, never a link to
 * a missing document, never an invented figure. Today: cover · the site (published facts) · technical passport · readiness register ·
 * location · market research · development scenarios · deal structures · contacts. Waiting: photographs, the boundary plan, concepts,
 * commercial terms — they join automatically when the configuration carries them.
 */

const p = {
  title: T("Developer Pack", "Developer Pack", "Developer Pack"),
  version: "DP-DR-2026-11 · OWNER PREVIEW",
  generated: T("Generat", "Сформировано", "Generated"),
  site: T("Terenul", "Участок", "The site"),
  passport: T("Pașaportul tehnic", "Технический паспорт", "Technical passport"),
  readiness: T("Registrul de pregătire", "Реестр готовности", "Readiness register"),
  location: T("Amplasare și acces", "Расположение и подъезды", "Location and access"),
  market: T("Studiul pieței", "Исследование рынка", "Market research"),
  scenarios: T("Scenarii de dezvoltare", "Сценарии развития", "Development scenarios"),
  deals: T("Structuri ale tranzacției", "Структуры сделки", "Deal structures"),
  contacts: T("Contacte", "Контакты", "Contacts"),
  next: T("Următorul pas", "Следующий шаг", "Next step"),
  nextText: T("Prima evaluare a terenului — cu directorul tehnic și arhitectul MEGAPARC. Mai întâi verificăm fezabilitatea tehnică — apoi discutăm structura.", "Первичная оценка участка — с техническим директором и архитектором MEGAPARC. Сначала проверяем техническую реализуемость — затем обсуждаем структуру.", "The first assessment of the site — with MEGAPARC's Technical Director and Architect. Technical feasibility first — then the structure."),
  infra: T("infrastructură și planificare", "инфраструктура и планирование", "infrastructure and planning"),
  inPack: T("În acest pachet", "В этом пакете", "In this pack"),
  pending: T("Se pregătesc", "Готовятся", "In preparation"),
  distances: T("Distanțe rutiere (estimare OSRM)", "Расстояния по дорогам (оценка OSRM)", "Road distances (OSRM estimate)"),
  disclaimer: T("Document de lucru pe baza datelor publicate MEGAPARC și a surselor indicate. Nu este o ofertă, o evaluare sau o confirmare a destinației permise; parametrii de construire ai terenului se verifică.", "Рабочий документ на основе опубликованных данных MEGAPARC и указанных источников. Не оферта, не оценка и не подтверждение разрешённого использования; параметры застройки участка проверяются.", "A working document based on MEGAPARC's published data and the sources named. Not an offer, a valuation or a confirmation of the permitted use; the site's development parameters are being verified."),
};

export function LandPackPrint({ locale, asset: full }: { locale: SiteLocale; asset: LandAsset }) {
  const asset = publicView(full);
  const L = (x: { ro: string; ru: string; en: string }) => x[locale];
  const m2 = formatArea(asset.area, locale);
  const ha = `${(asset.area / 10000).toLocaleString(numberLocale(locale), { minimumFractionDigits: 1 })}${locale === "ru" ? " га" : " ha"}`;
  const date = asset.updated.split("-").reverse().join(".");
  const ready = asset.pack.filter((d) => d.state === "ready");
  const waiting = asset.pack.filter((d) => d.state === "preparing");
  const pages: { key: string; node: ReactNode }[] = [];
  const value = (v: (typeof asset.passport)[number]["value"]) => (!v ? "—" : "text" in v ? L(v.text) : `${v.n.toLocaleString(numberLocale(locale))}${v.unit === "m2" ? (locale === "ru" ? " м²" : " m²") : ""}`);

  pages.push({
    key: "cover",
    node: (
      <div className="lp-cover">
        <div className="lp-cover__text">
          {/* eslint-disable-next-line @next/next/no-img-element -- the approved vector logo in a print source */}
          <img className="lp-logo" src={publicAsset("/brand/megaparc-logo-compact.svg")} alt="MEGAPARC" />
          <p className="lp-kicker">{L(p.title)} · {L(asset.hero.kicker)}</p>
          <h1 className="lp-name">{asset.name}</h1>
          <p className="lp-pos">{L(asset.hero.positioning)}</p>
          <dl className="lp-facts">
            {asset.facts.map((f) => <div key={f.key}><dt>{L(f.label)}</dt><dd>{L(f.value)}</dd></div>)}
          </dl>
          <p className="lp-small">{L(asset.hero.published)}</p>
        </div>
        <div className="lp-cover__map" style={{ backgroundImage: `url(${publicAsset(asset.explorer.base)})` }} aria-hidden="true"><i /></div>
      </div>
    ),
  });
  pages.push({
    key: "contents",
    node: (
      <div className="lp-two">
        <div>
          <p className="lp-kicker">{L(p.site)}</p>
          <h2 className="lp-h2">{L(asset.hero.statement)}</h2>
          <p className="lp-lead">{L(asset.hero.lead)}</p>
          <p className="lp-big">{ha}<span>{m2}</span></p>
        </div>
        <div>
          <p className="lp-label">{L(p.inPack)}</p>
          <ul className="lp-list">{ready.map((d) => <li key={d.key}>{L(d.label)}</li>)}</ul>
          <p className="lp-label">{L(p.pending)}</p>
          <ul className="lp-list is-muted">{waiting.map((d) => <li key={d.key}>{L(d.label)}</li>)}</ul>
        </div>
      </div>
    ),
  });
  pages.push({
    key: "passport",
    node: (
      <div>
        <p className="lp-kicker">{L(p.passport)}</p>
        <div className="lp-grid2">
          {(["land", "geometry", "planning", "utilities"] as ParamGroup[]).map((g) => (
            <table key={g} className="lp-table">
              <caption>{L(c.groups[g])}</caption>
              <tbody>
                {asset.passport.filter((x) => x.group === g).map((x) => (
                  <tr key={x.key}><th>{L(x.label)}</th><td>{value(x.value)}</td><td className={`lp-st is-${x.status.toLowerCase()}`}>{L(registerCopy[x.status])}</td></tr>
                ))}
              </tbody>
            </table>
          ))}
        </div>
      </div>
    ),
  });
  // the register fills as many pages as it needs (14 rows a page) — a page never overflows into the footer
  const ROWS = 14;
  for (let start = 0; start < asset.readiness.length; start += ROWS) {
    const part = asset.readiness.slice(start, start + ROWS);
    pages.push({
      key: `readiness-${start / ROWS + 1}`,
      node: (
        <div>
          <p className="lp-kicker">{L(p.readiness)}{asset.readiness.length > ROWS ? ` · ${start / ROWS + 1} / ${Math.ceil(asset.readiness.length / ROWS)}` : ""}</p>
          <table className="lp-table lp-table--wide">
            <tbody>
              {part.map((r) => (
                <tr key={r.key}><th>{L(r.label)}</th><td className={`lp-st is-${r.status.toLowerCase()}`}>{L(registerCopy[r.status])}</td><td>{L(r.next)}</td><td>{L(roleCopy[r.owner])}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      ),
    });
  }
  pages.push({
    key: "location",
    node: (
      <div className="lp-two lp-two--map">
        <div className="lp-map" style={{ backgroundImage: `url(${publicAsset(asset.explorer.base)})` }} aria-hidden="true"><i /></div>
        <div>
          <p className="lp-kicker">{L(p.location)}</p>
          <p className="lp-lead">{L(asset.address)} · {L(asset.geo.point)}</p>
          {asset.distances.length ? (
            <>
              <p className="lp-label">{L(p.distances)}</p>
              <dl className="lp-rows">{asset.distances.map((d) => <div key={d.key}><dt>{L(d.to)}</dt><dd>≈{" "}{Math.round(d.km)}{" "}{locale === "ru" ? "км" : "km"}</dd></div>)}</dl>
            </>
          ) : null}
          <p className="lp-small">{L(asset.layers.find((l) => l.key === "boundary")!.text)}</p>
          <p className="lp-small">{asset.explorer.source} · {asset.explorer.fetched.split("-").reverse().join(".")}</p>
        </div>
      </div>
    ),
  });
  const figures = asset.market.indicators.filter((i) => i.display === "figure");
  const facts = asset.market.indicators.filter((i) => i.display === "text");
  if (facts.length) {
    pages.push({
      key: "market-facts",
      node: (
        <div>
          <p className="lp-kicker">{L(p.market)} · {L(p.infra)}</p>
          <div className="lp-ind lp-ind--facts">
            {facts.map((i) => (
              <div key={i.key} className="lp-ind__item is-text">
                <span className="lp-label">{L(i.label)}</span>
                <span className="lp-ind__v">{L(i.value)}</span>
                <span className="lp-src">{L(natureCopy[i.nature])} · {i.source} · {i.refDate} · {L(confidenceCopy[i.confidence])}</span>
              </div>
            ))}
          </div>
          <p className="lp-small">{L(c.gapsText)}</p>
        </div>
      ),
    });
  }
  if (figures.length) {
    pages.splice(pages.length - (facts.length ? 1 : 0), 0, {
      key: "market",
      node: (
        <div>
          <p className="lp-kicker">{L(p.market)}</p>
          <p className="lp-lead lp-lead--wide">{L(asset.market.summary)}</p>
          <div className="lp-ind">
            {figures.map((i) => (
              <div key={i.key} className={`lp-ind__item is-${i.display}`}>
                <span className="lp-label">{L(i.label)}</span>
                <span className="lp-ind__v">{L(i.value)}</span>
                {i.note ? <span className="lp-small">{L(i.note)}</span> : null}
                <span className="lp-src">{L(natureCopy[i.nature])} · {i.source} · {i.refDate} · {L(confidenceCopy[i.confidence])}</span>
              </div>
            ))}
          </div>
        </div>
      ),
    });
  }
  pages.push({
    key: "scenarios",
    node: (
      <div>
        <p className="lp-kicker">{L(p.scenarios)}</p>
        <div className="lp-scen">
          {asset.scenarios.map((s, i) => (
            <div key={s.key} className="lp-scen__item">
              <span className="lp-no">{String(i + 1).padStart(2, "0")}</span>
              <h3>{L(s.title)}</h3>
              <p>{L(s.logic)}</p>
              <p className="lp-label">{L(c.checks)}</p>
              <ul className="lp-list">{s.checks.map((x) => <li key={x.en}>{L(x)}</li>)}</ul>
              <p className="lp-label">{L(c.risks)}</p>
              <ul className="lp-list">{s.risks.map((x) => <li key={x.en}>{L(x)}</li>)}</ul>
            </div>
          ))}
        </div>
        <p className="lp-small">{L(c.scenDisclaimer)}</p>
      </div>
    ),
  });
  pages.push({
    key: "deals",
    node: (
      <div>
        <p className="lp-kicker">{L(p.deals)}</p>
        <div className="lp-deals">
          {/* R2 §4: the priority formats first and marked; the others «discussed individually» — never a term */}
          {[...asset.deals.filter((d) => d.enabled && d.priority === "primary"), ...asset.deals.filter((d) => d.enabled && d.priority !== "primary")].map((d, i) => (
            <div key={d.key} className={d.priority === "primary" ? "is-primary" : undefined}>
              <span className="lp-no">{String(i + 1).padStart(2, "0")} · {L(d.agreed ? c.agreed : d.priority === "primary" ? c.possible : c.dealIndividual)}</span>
              <h3>{L(d.title)}</h3>
              <p>{L(d.text)}</p>
            </div>
          ))}
        </div>
        <p className="lp-small">{L(c.dealNote)}</p>
      </div>
    ),
  });
  pages.push({
    key: "contacts",
    node: (
      <div className="lp-final">
        <p className="lp-kicker">{L(p.next)}</p>
        <h2 className="lp-h2">{L(p.nextText)}</h2>
        <dl className="lp-rows lp-rows--contacts">
          <div><dt>E-mail</dt><dd>{company.email.value[locale]}</dd></div>
          <div><dt>{locale === "ru" ? "Телефон" : locale === "ro" ? "Telefon" : "Phone"}</dt><dd>{company.mobile.value[locale]} · {company.landline.value[locale]}</dd></div>
          <div><dt>Web</dt><dd>www.megaparc.md{locale === "ro" ? "" : `/${locale}`}/projects/{asset.slug}/</dd></div>
        </dl>
        <p className="lp-small">{L(p.disclaimer)}</p>
      </div>
    ),
  });

  return (
    <main className="lp-doc" lang={locale}>
      {pages.map((page, i) => (
        <section key={page.key} className={`lp-page lp-page--${page.key}`}>
          <div className="lp-body">{page.node}</div>
          <footer className="lp-foot"><span>MEGAPARC · {asset.name} · {L(p.title)}</span><span>{p.version} · {L(p.generated)} <span className="lp-gen" data-generated={date}>{date}</span> · {i + 1} / {pages.length}</span></footer>
        </section>
      ))}
    </main>
  );
}
