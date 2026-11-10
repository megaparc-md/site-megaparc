import Link from "next/link";
import type { CSSProperties } from "react";
import { DevelopmentCalculator } from "@/components/land/development-calculator";
import { CadastreVerify } from "@/components/leasing/cadastre-verify";
import { LocationMap } from "@/components/location-section";
import { PageShell } from "@/components/page-shell";
import { Figure, R3Label } from "@/components/r3";
import { Icon } from "@/components/ui";
import { formatArea, type ProjectEntry } from "@/content/source";
import { company, contactLinks } from "@/data/demo-content";
import { T } from "@/data/leasing-experience-model";
import type { DueStatus, LandOpportunity } from "@/data/land-model";
import { eCadastruPortal } from "@/data/property-trust";
import { googleDirectionsUrl, googleMapsUrl } from "@/lib/assets";
import { localePath, type Localized, type SiteLocale } from "@/lib/site-data";

/**
 * THE LAND DEVELOPMENT OPPORTUNITY TEMPLATE — OWNER «MEGAPARC · LAND DEVELOPMENT OPPORTUNITIES · DROCHIA = MASTER
 * TEMPLATE» (2026-11-10). Drochia is the first dataset (src/data/land-drochia.ts); after OWNER review the same template
 * renders Hîncești, Orhei, Florilor 32/2 and Chișinău — only the data changes.
 *
 * Not a listing: MEGAPARC turns land into a structured development opportunity. Order: HERO (the opportunity, the
 * facts, «Request the development pack» · «Discuss the site») → 01 the site today → 02 what creates its potential →
 * 03 development potential (confirmed vs. to verify, never blended) → 04 scenarios for initial evaluation (with the
 * disclaimer) → 05 development readiness (CONFIRMED · TO VERIFY · REQUIRED · NOT AVAILABLE) → 06 infrastructure →
 * 07 access and location → 08 cadastre (e-Cadastru: copy + open the portal) → 09 the development scenario calculator
 * (illustrative) → how MEGAPARC creates value → ways to structure the deal → the development pack → Technical
 * Director + Architect. Only verified facts are values; everything else is a status.
 */

const statusCopy: Record<DueStatus, Localized> = {
  CONFIRMED: T("Confirmat", "Подтверждено", "Confirmed"),
  TO_VERIFY: T("De verificat", "Проверяется", "To verify"),
  REQUIRED: T("Necesar", "Требуется", "Required"),
  NOT_AVAILABLE: T("Lipsește", "Нет", "Not available"),
};

const c = {
  back: T("Proiecte", "Проекты", "Projects"),
  area: T("Suprafață", "Площадь", "Area"),
  cadastre: T("Cadastru", "Кадастр", "Cadastre"),
  status: T("Statut", "Статус", "Status"),
  pack: T("Solicitați pachetul pentru dezvoltator", "Запросить пакет для девелопера", "Request the development pack"),
  discuss: T("Discutați terenul", "Обсудить участок", "Discuss the site"),
  p1: T("01 · Terenul astăzi", "01 · Участок сегодня", "01 · The site today"),
  p2: T("02 · Potențial", "02 · Потенциал", "02 · Potential"),
  p3: T("03 · Potențialul de dezvoltare", "03 · Потенциал девелопмента", "03 · Development potential"),
  p3title: T("Ce este confirmat — și ce rămâne de verificat.", "Что подтверждено — и что предстоит проверить.", "What is confirmed — and what remains to be verified."),
  confirmed: T("Confirmat · fapt", "Подтверждено · факт", "Confirmed · fact"),
  verify: T("De verificat · nu este un fapt", "Проверяется · не факт", "To verify · not a fact"),
  p4: T("04 · Scenarii", "04 · Сценарии", "04 · Scenarios"),
  verifyFor: T("De verificat", "Проверить", "To verify"),
  p5: T("05 · Gradul de pregătire", "05 · Готовность к девелопменту", "05 · Development readiness"),
  p5title: T("Unde se află terenul pe drumul spre proiect.", "Где участок на пути к проекту.", "Where the site stands on the way to a project."),
  p6: T("06 · Infrastructură", "06 · Инженерная инфраструктура", "06 · Infrastructure"),
  p6title: T("Rețele și acces.", "Сети и подъезд.", "Utilities and access."),
  p6lead: T("Capacitățile de racordare nu sunt inventate: unde nu sunt confirmate, se verifică.", "Мощности подключения не придумываем: где не подтверждены — проверяются.", "Connection capacities are never invented: where unconfirmed, they are verified."),
  p7: T("07 · Acces și amplasare", "07 · Доступ и расположение", "07 · Access and location"),
  near: T("Aproape · raza de 300 m", "Рядом · радиус 300 м", "Close · 300 m radius"),
  town: T("Orașul · raza de 1 km", "Город · радиус 1 км", "The town · 1 km radius"),
  route: T("Construiește ruta", "Построить маршрут", "Get directions"),
  openMap: T("Deschide în Google Maps", "Открыть в Google Maps", "Open in Google Maps"),
  p8: T("08 · Cadastru și planul terenului", "08 · Кадастр и план участка", "08 · Cadastre and site plan"),
  p8title: T("Datele care se verifică oficial.", "Данные, которые проверяются официально.", "Data verified officially."),
  registered: T("Suprafața înregistrată", "Зарегистрированная площадь", "Registered area"),
  boundary: T("Planul cu limitele terenului — în pachetul pentru dezvoltator, după verificarea planului cadastral. Nu desenăm limite neconfirmate.", "План участка с границами — в пакете для девелопера, после проверки кадастрового плана. Неподтверждённые границы не рисуем.", "The site plan with the boundary is in the development pack, once the cadastral plan is verified. Unconfirmed boundaries are never drawn."),
  p9: T("09 · Scenariul de dezvoltare", "09 · Сценарий девелопмента", "09 · Development scenario"),
  p9title: T("Verificați scenariul pe ipotezele dumneavoastră.", "Проверьте сценарий на своих допущениях.", "Test a scenario on your own assumptions."),
  p9lead: T("Un instrument de decizie, nu o evaluare: rezultatul se schimbă cu fiecare ipoteză.", "Инструмент для решения, а не оценка: результат меняется с каждым допущением.", "A decision tool, not a valuation: the result changes with every assumption."),
  value: T("Cum creează MEGAPARC valoare", "Как MEGAPARC создаёт стоимость", "How MEGAPARC creates value"),
  valueTitle: T("MEGAPARC creează valoare ducând terenul spre un obiect comercial în funcțiune.", "MEGAPARC создаёт стоимость, проводя землю к работающему коммерческому объекту.", "MEGAPARC creates value by moving land toward a working commercial asset."),
  here: T("terenul este aici", "участок здесь", "the site is here"),
  deal: T("Structura tranzacției", "Структура сделки", "Deal structure"),
  dealTitle: T("Moduri de a structura oportunitatea.", "Как можно структурировать возможность.", "Ways to structure the opportunity."),
  dealNote: T("Structurile se negociază separat pentru fiecare proiect și nu sunt disponibile automat pentru orice teren.", "Структура согласуется отдельно для каждого проекта и не доступна автоматически для любого участка.", "Structures are negotiated project by project and are not automatically available for every site."),
  packLabel: T("Pachetul pentru dezvoltator", "Пакет для девелопера", "Development pack"),
  packTitle: T("Documentele pentru o decizie — într-un singur pachet.", "Документы для решения — в одном пакете.", "The documents for a decision — in one pack."),
  ready: T("Disponibil", "Есть", "Available"),
  preparing: T("Se pregătește", "Готовим", "In preparation"),
  packNote: T("Pachetul se completează pe măsură ce verificările avansează; vă trimitem ce există deja.", "Пакет дополняется по мере проверок; отправим то, что уже готово.", "The pack grows as the checks progress; we send what is already ready."),
  teamLabel: T("Evaluarea tehnică", "Техническая оценка", "Technical assessment"),
  teamTitle: T("Prima evaluare a terenului — cu directorul tehnic și arhitectul MEGAPARC.", "Первичная оценка участка — с техническим директором и архитектором MEGAPARC.", "The first assessment of the site — with MEGAPARC's Technical Director and Architect."),
  teamLead: T("Mai întâi verificăm fezabilitatea tehnică — apoi discutăm structura.", "Сначала проверяем техническую реализуемость — затем обсуждаем структуру.", "Technical feasibility first — then the structure."),
  teamNote: T("Evaluarea ajută decizia; nu înlocuiește autorizațiile și avizele, care se obțin separat.", "Оценка помогает решению и не заменяет разрешений и согласований, которые оформляются отдельно.", "The assessment supports the decision; it does not replace permits and approvals, which are obtained separately."),
  call: T("Sunați", "Позвонить", "Call"),
};

const journey = [
  { key: "land", label: T("Teren", "Земля", "Land") },
  { key: "concept", label: T("Concept", "Концепция", "Concept") },
  { key: "development", label: T("Dezvoltare", "Девелопмент", "Development") },
  { key: "lease", label: T("Închiriere / vânzare", "Аренда / продажа", "Leasing / sale") },
  { key: "asset", label: T("Obiect în funcțiune", "Работающий объект", "Operating asset") },
  { key: "reinvest", label: T("Reinvestire", "Реинвестиции", "Reinvestment") },
];

const deals = [
  { key: "sale", no: "01", title: T("Vânzare", "Продажа", "Sale"), text: T("Dezvoltatorul achiziționează terenul.", "Девелопер приобретает участок.", "The developer acquires the site.") },
  { key: "joint", no: "02", title: T("Dezvoltare comună", "Совместный девелопмент", "Joint development"), text: T("MEGAPARC aduce terenul sau activele, iar părțile convin structura proiectului.", "MEGAPARC вносит землю или активы, стороны согласуют структуру проекта.", "MEGAPARC contributes the land or assets and the parties agree the project structure.") },
  { key: "exchange", no: "03", title: T("Teren contra spații finalizate", "Земля в обмен на готовые площади", "Land against completed real estate"), text: T("O parte din valoarea terenului se poate schimba pe spații comerciale finalizate, printr-o structură negociată separat.", "Часть стоимости земли может быть обменена на готовые коммерческие помещения по отдельно согласованной структуре.", "Part of the land value may be exchanged for completed commercial premises under a separately negotiated structure.") },
];

const team = [
  T("restricțiile urbanistice", "градостроительные ограничения", "planning constraints"),
  T("configurația terenului", "конфигурация участка", "site configuration"),
  T("accesele", "подъезды", "access"),
  T("rețelele", "инженерные сети", "utilities"),
  T("fezabilitatea tehnică", "техническая реализуемость", "technical feasibility"),
  T("conceptul preliminar", "предварительная концепция", "preliminary concept"),
  T("amplasarea clădirilor", "размещение зданий", "building placement"),
  T("ipotezele de dezvoltare", "допущения девелопмента", "development assumptions"),
];

function Status({ status, locale }: { status: DueStatus; locale: SiteLocale }) {
  return <span className={`ld-status is-${status.toLowerCase().replace("_", "-")}`}>{statusCopy[status][locale]}</span>;
}

export function LandOpportunityPage({ locale, project, land }: { locale: SiteLocale; project: ProjectEntry; land: LandOpportunity }) {
  const p = (path: string) => localePath(locale, path);
  const ha = (m2: number) => `${(m2 / 10000).toLocaleString(locale === "ru" ? "ru-RU" : locale === "ro" ? "ro-RO" : "en-GB", { minimumFractionDigits: 1, maximumFractionDigits: 3 })}${locale === "ru" ? " га" : " ha"}`;
  const m2 = formatArea(land.area, locale);
  const map = project.development?.map ?? null;
  // the confirmed public mailbox only (no subject parameters — qa-static accepts the OWNER-confirmed contact links as they are)
  const packHref = contactLinks.email;
  const discussHref = `${p("/contact")}?subject=partnership&property=${land.slug}`;
  const primaryNumber = land.parcels[0]?.number;
  return (
    <PageShell locale={locale} experience mainClassName={`ld-page ld-page--${land.slug}`}>
      {/* HERO — the opportunity, the facts, the two actions; the site context map beside it */}
      <section className="ld-hero" aria-labelledby="ld-title">
        <div className="r3-shell ld-hero__grid">
          <div className="ld-hero__text">
            <Link href={p("/projects")} className="r3-back"><Icon name="left" size={14} /> {c.back[locale]}</Link>
            <R3Label>{land.hero.kicker[locale]}</R3Label>
            <h1 className="ld-hero__name" id="ld-title">{land.name}</h1>
            <p className="ld-hero__statement">{land.hero.statement[locale]}</p>
            <dl className="ld-hero__facts">
              <div><dt>{c.area[locale]}</dt><dd><Figure value={ha(land.area)} /><span className="ld-hero__sub">{m2}</span></dd></div>
              <div><dt>{c.cadastre[locale]}</dt><dd className="ld-hero__cad" translate="no">{primaryNumber ?? statusCopy.TO_VERIFY[locale]}</dd></div>
              <div><dt>{c.status[locale]}</dt><dd className="ld-hero__status">{land.status[locale]}</dd></div>
            </dl>
            <p className="ld-hero__lead">{land.hero.lead[locale]}</p>
            <div className="r3-actions">
              <a className="r3-btn r3-btn--dark" href="#pack"><span>{c.pack[locale]}</span><Icon size={16} /></a>
              <Link className="r3-link r3-link--dark" href={discussHref}><span>{c.discuss[locale]}</span><Icon size={16} /></Link>
            </div>
          </div>
          <div className="ld-hero__media">
            <LocationMap locale={locale} mapKey={land.maps.site} name={land.name} place={land.place[locale]} className="ld-hero__map" />
            <p className="ld-note">{land.maps.caption[locale]}</p>
          </div>
        </div>
      </section>

      {/* 01 · THE SITE TODAY — confirmed facts, large serif figures */}
      <section className="r3-sec r3-sec--ivory ld-today" id="site">
        <div className="r3-shell">
          <div className="r3-head" data-reveal>
            <R3Label>{c.p1[locale]}</R3Label>
            <h2 className="r3-title">{land.today.title[locale]}</h2>
          </div>
          <div className="ld-today__grid">
            <p className="ld-today__big" data-reveal><Figure value={ha(land.area)} /><span>{m2}</span></p>
            <dl className="ld-facts" data-reveal>
              {land.today.facts.filter((f) => f.key !== "area").map((f) => (
                <div key={f.key} className={`is-${f.status.toLowerCase().replace("_", "-")}`}>
                  <dt>{f.label[locale]}</dt>
                  <dd>{f.status === "CONFIRMED" ? <span translate={f.key === "cadastre" ? "no" : undefined}>{f.value[locale]}</span> : <Status status={f.status} locale={locale} />}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* 02 · WHAT CREATES THE SITE'S POTENTIAL — fact → why it matters for development */}
      <section className="r3-sec r3-sec--paper ld-potential" id="potential">
        <div className="r3-shell">
          <div className="r3-head r3-head--split" data-reveal>
            <R3Label>{c.p2[locale]}</R3Label>
            <h2 className="r3-title">{land.potential.title[locale]}</h2>
            <p className="r3-lead">{land.potential.lead[locale]}</p>
          </div>
          <ol className="ld-factors">
            {land.potential.factors.map((f, i) => (
              <li key={f.key} data-reveal style={{ "--i": i } as CSSProperties}>
                <span className="ld-factors__fact">{f.fact[locale]}</span>
                <span className="ld-factors__arrow" aria-hidden="true">→</span>
                <span className="ld-factors__why">{f.why[locale]}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 03 · DEVELOPMENT POTENTIAL — confirmed facts apart from what is still to verify, never blended */}
      <section className="r3-sec r3-sec--ivory ld-dev" id="development">
        <div className="r3-shell">
          <div className="r3-head" data-reveal>
            <R3Label>{c.p3[locale]}</R3Label>
            <h2 className="r3-title">{c.p3title[locale]}</h2>
          </div>
          <div className="ld-dev__grid">
            <div className="ld-dev__col is-fact" data-reveal>
              <p className="ld-dev__label">{c.confirmed[locale]}</p>
              <dl className="ld-rows">
                {land.development.confirmed.map((f) => (
                  <div key={f.key}><dt>{f.label[locale]}</dt><dd translate={f.key === "cadastre" ? "no" : undefined}>{f.value[locale]}</dd></div>
                ))}
              </dl>
            </div>
            <div className="ld-dev__col is-verify" data-reveal>
              <p className="ld-dev__label">{c.verify[locale]}</p>
              <ul className="ld-verify">
                {land.development.verify.map((v) => <li key={v.en}>{v[locale]}</li>)}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 04 · SCENARIOS FOR INITIAL EVALUATION — with the disclaimer, never an approved concept */}
      <section className="r3-sec r3-sec--paper ld-scen" id="scenarios">
        <div className="r3-shell">
          <div className="r3-head r3-head--split" data-reveal>
            <R3Label>{c.p4[locale]}</R3Label>
            <h2 className="r3-title">{land.scenarios.title[locale]}</h2>
            <p className="r3-lead">{land.scenarios.lead[locale]}</p>
          </div>
          <ol className="ld-scen__list">
            {land.scenarios.items.map((s, i) => (
              <li key={s.key} className="ld-scen__item" data-reveal>
                <span className="ld-scen__no">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="ld-scen__title">{s.title[locale]}</h3>
                <p className="ld-scen__text">{s.text[locale]}</p>
                <p className="ld-scen__verify"><span>{c.verifyFor[locale]}:</span> {s.verify[locale]}</p>
              </li>
            ))}
          </ol>
          <p className="ld-disclaimer" data-reveal>{land.scenarios.disclaimer[locale]}</p>
        </div>
      </section>

      {/* 05 · DEVELOPMENT READINESS — the due-diligence status system */}
      <section className="r3-sec r3-sec--ink ld-ready" id="readiness">
        <div className="r3-shell">
          <div className="r3-head" data-reveal>
            <R3Label>{c.p5[locale]}</R3Label>
            <h2 className="r3-title">{c.p5title[locale]}</h2>
          </div>
          <ul className="ld-legend" data-reveal>
            {(Object.keys(statusCopy) as DueStatus[]).map((s) => <li key={s}><Status status={s} locale={locale} /></li>)}
          </ul>
          <ol className="ld-ready__grid">
            {land.readiness.map((r) => (
              <li key={r.key} className={`ld-ready__item is-${r.status.toLowerCase().replace("_", "-")}`} data-reveal>
                <span className="ld-ready__label">{r.label[locale]}</span>
                <Status status={r.status} locale={locale} />
                <span className="ld-ready__note">{r.note[locale]}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 06 · INFRASTRUCTURE / UTILITIES */}
      <section className="r3-sec r3-sec--ivory ld-util" id="utilities">
        <div className="r3-shell">
          <div className="r3-head r3-head--split" data-reveal>
            <R3Label>{c.p6[locale]}</R3Label>
            <h2 className="r3-title">{c.p6title[locale]}</h2>
            <p className="r3-lead">{c.p6lead[locale]}</p>
          </div>
          <dl className="ld-util__grid">
            {land.utilities.map((u) => (
              <div key={u.key} className={`is-${u.status.toLowerCase().replace("_", "-")}`} data-reveal>
                <dt>{u.label[locale]}</dt>
                <dd><Status status={u.status} locale={locale} /><span>{u.note[locale]}</span></dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* 07 · ACCESS / LOCATION — the close map and the town map, verified OSM data only */}
      <section className="r3-sec r3-sec--paper ld-loc" id="location">
        <div className="r3-shell">
          <div className="r3-head r3-head--split" data-reveal>
            <R3Label>{c.p7[locale]}</R3Label>
            <h2 className="r3-title">{land.location.title[locale]}</h2>
            <p className="r3-lead">{land.location.text[locale]}</p>
          </div>
          <div className={`ld-loc__maps${land.maps.region ? " is-single" : ""}`}>
            {land.maps.region ? null : (
              <figure className="ld-loc__map" data-reveal>
                <figcaption className="ld-loc__cap">{c.near[locale]}</figcaption>
                <LocationMap locale={locale} mapKey={land.maps.site} name={land.name} place={land.place[locale]} />
              </figure>
            )}
            {land.maps.region ? (
              <figure className="ld-loc__map" data-reveal>
                <figcaption className="ld-loc__cap">{c.town[locale]}</figcaption>
                <LocationMap locale={locale} mapKey={land.maps.region} name={land.name} place={land.place[locale]} />
              </figure>
            ) : null}
          </div>
          <div className="ld-loc__foot" data-reveal>
            <ul className="ld-loc__points">
              {land.location.points.map((pt) => <li key={pt.en}>{pt[locale]}</li>)}
            </ul>
            {map ? (
              <p className="ld-loc__links">
                <a className="r3-link r3-link--dark" href={googleDirectionsUrl(map)} target="_blank" rel="noopener noreferrer"><span>{c.route[locale]}</span><Icon name="up-right" size={16} /></a>
                <a className="r3-link r3-link--dark" href={googleMapsUrl(map)} target="_blank" rel="noopener noreferrer"><span>{c.openMap[locale]}</span><Icon name="up-right" size={16} /></a>
              </p>
            ) : null}
            <p className="ld-note">{land.maps.caption[locale]}</p>
          </div>
        </div>
      </section>

      {/* 08 · CADASTRE — copy the number, open the official portal; no invented deep link, no invented boundary */}
      <section className="r3-sec r3-sec--stone ld-cad" id="cadastre">
        <div className="r3-shell ld-cad__grid">
          <div data-reveal>
            <R3Label>{c.p8[locale]}</R3Label>
            <h2 className="r3-title">{c.p8title[locale]}</h2>
            <p className="ld-cad__area"><span>{c.registered[locale]}</span><Figure value={m2} /></p>
            <p className="ld-note">{c.boundary[locale]}</p>
          </div>
          <div className="r3-trust__cad" data-reveal>
            {land.cadastrePending || !primaryNumber ? (
              <CadastreVerify pending portal={eCadastruPortal} locale={locale} />
            ) : land.parcels.length > 1 ? (
              <CadastreVerify numbers={land.parcels.map((parcel) => ({ cadastral: parcel.number, area: formatArea(parcel.area, locale) }))} total={m2} portal={eCadastruPortal} locale={locale} />
            ) : (
              <CadastreVerify number={primaryNumber} portal={eCadastruPortal} locale={locale} />
            )}
          </div>
        </div>
      </section>

      {/* 09 · DEVELOPMENT SCENARIO — the illustrative calculator */}
      <section className="r3-sec r3-sec--ivory ld-calcsec" id="scenario">
        <div className="r3-shell">
          <div className="r3-head r3-head--split" data-reveal>
            <R3Label>{c.p9[locale]}</R3Label>
            <h2 className="r3-title">{c.p9title[locale]}</h2>
            <p className="r3-lead">{c.p9lead[locale]}</p>
          </div>
          <div className="lg-page ld-calc__wrap" data-reveal>
            <DevelopmentCalculator locale={locale} area={land.area} />
          </div>
        </div>
      </section>

      {/* HOW MEGAPARC CREATES VALUE — one typographic journey, the site marked where it stands */}
      <section className="r3-sec r3-sec--ink ld-journey" id="value">
        <div className="r3-shell">
          <div className="r3-head" data-reveal>
            <R3Label>{c.value[locale]}</R3Label>
            <h2 className="r3-title">{c.valueTitle[locale]}</h2>
          </div>
          <ol className="ld-journey__line" data-reveal>
            {journey.map((step, i) => (
              <li key={step.key} className={i === 0 ? "is-here" : undefined}>
                <span className="ld-journey__word">{step.label[locale]}</span>
                {i === 0 ? <span className="ld-journey__here">{land.name} · {c.here[locale]}</span> : null}
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* WAYS TO STRUCTURE THE OPPORTUNITY — three OWNER-relevant routes, negotiated per project */}
      <section className="r3-sec r3-sec--paper ld-deal" id="structure">
        <div className="r3-shell">
          <div className="r3-head" data-reveal>
            <R3Label>{c.deal[locale]}</R3Label>
            <h2 className="r3-title">{c.dealTitle[locale]}</h2>
          </div>
          <ol className="ld-deal__list">
            {deals.map((d) => (
              <li key={d.key} data-reveal>
                <span className="ld-deal__no">{d.no}</span>
                <h3 className="ld-deal__title">{d.title[locale]}</h3>
                <p className="ld-deal__text">{d.text[locale]}</p>
              </li>
            ))}
          </ol>
          <p className="ld-disclaimer" data-reveal>{c.dealNote[locale]}</p>
        </div>
      </section>

      {/* THE DEVELOPMENT PACK — what is ready, what is being prepared; never a faked pack */}
      <section className="r3-sec r3-sec--ivory ld-pack" id="pack">
        <div className="r3-shell ld-pack__grid">
          <div data-reveal>
            <R3Label>{c.packLabel[locale]}</R3Label>
            <h2 className="r3-title">{c.packTitle[locale]}</h2>
            <p className="r3-lead">{c.packNote[locale]}</p>
            <div className="r3-actions">
              <a className="r3-btn r3-btn--dark" href={packHref}><span>{c.pack[locale]}</span><Icon size={16} /></a>
              <a className="r3-link r3-link--dark" href={contactLinks.mobile}><span>{c.call[locale]} · {company.mobile.value[locale]}</span><Icon size={16} /></a>
            </div>
          </div>
          <ul className="ld-pack__list" data-reveal>
            {land.pack.map((item) => (
              <li key={item.key} className={`is-${item.state}`}>
                <span>{item.label[locale]}</span>
                <em>{item.state === "ready" ? c.ready[locale] : c.preparing[locale]}</em>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* TECHNICAL DIRECTOR + ARCHITECT — the first assessment, no promised approvals */}
      <section className="r3-sec r3-sec--stone ld-team" id="technical-support">
        <div className="r3-shell">
          <div className="r3-head" data-reveal>
            <R3Label>{c.teamLabel[locale]}</R3Label>
            <h2 className="r3-title">{c.teamTitle[locale]}</h2>
          </div>
          <p className="r3-trust__principle" data-reveal>{c.teamLead[locale]}</p>
          <ol className="r3-trust__list ld-team__list" data-reveal>
            {team.map((t) => <li key={t.en}>{t[locale]}</li>)}
          </ol>
          <div className="r3-actions" data-reveal>
            <Link className="r3-btn r3-btn--dark" href={discussHref}><span>{c.discuss[locale]}</span><Icon size={16} /></Link>
            <a className="r3-link r3-link--dark" href={contactLinks.email}><span>{company.email.value[locale]}</span><Icon size={16} /></a>
          </div>
          <p className="r3-note" data-reveal>{c.teamNote[locale]}</p>
        </div>
      </section>
    </PageShell>
  );
}
