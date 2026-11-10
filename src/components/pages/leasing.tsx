import Link from "next/link";
import { MaskTitle, Val } from "@/components/experience";
import { TenantAdvisor, type AdvisorCopy } from "@/components/leasing/tenant-advisor";
import { SpaceImage, viewingHref } from "@/components/leasing/unit-card";
import { PageShell } from "@/components/page-shell";
import { trustCopy } from "@/components/leasing/property-trust";
import { Figure, NB, R3Button, R3Label, R3Link, tel, viewableNow } from "@/components/r3";
import { Icon } from "@/components/ui";
import { availabilityLabel, availabilityOf, formatAreaRange, getProject, publicSpaces, sortSpaces } from "@/content/source";
import { company, contactLinks, leasingProcess, shown } from "@/data/demo-content";
import { cadastreNumbers } from "@/data/property-trust";
import type { AvailableSpace } from "@/data/leasing-inventory";
import { areaBands, leasingSteps, needOrder, needs, noPrice, uses } from "@/lib/leasing";
import { localePath, type SiteLocale } from "@/lib/site-data";

/**
 * LEASING — a top-level product, not a subsection (OWNER correction 2026-10-08).
 * OWNER "PREMIUM PHASE 2" (2026-10-09): desire first, filter second. The opening
 * is the first available space as a property opportunity — a large photograph
 * of the real building beside the statement, the unit, its area, floor, status,
 * its confirmed advantages and one action (Запросить просмотр). The minimal
 * filters (use · area · building) and the inventory follow; then the tenant
 * advisor, the buildings with space (only when there is more than one), the
 * process and the waiting list. Only published spaces (available or reserved)
 * appear — a space marked LEASED in the CMS disappears everywhere.
 */
const copy = {
  ro: {
    label: "Închiriere",
    heroTitle: ["Găsiți locul", "pentru afacerea dumneavoastră."],
    offerSpace: "Vezi spațiul",
    offerMore: "Toate spațiile libere",
    building: "Clădirea",
    noneTitle: "Acum toate spațiile sunt închiriate.",    title: "Spații pentru afaceri.",
    lead: "Spațiile libere din clădirile MEGAPARC — cu planuri, caracteristici și statut actualizat.",
    spaces: ["spațiu", "spații", "spații"],
    now: "libere acum",
    boardLabel: "Liber acum",
    boardAll: "Toate spațiile",
    buildings: ["obiect", "obiecte", "obiecte"],
    shortcutArea: "Spații de",
    shortcutFood: "Pentru cafenea sau restaurant",
    shortcutAll: "Toate spațiile",
    availableLabel: "Acum se închiriază",
    availableTitle: "Ce este liber — cu toate datele.",
    advisorLabel: "Ce deschideți?",
    advisorTitle: "Spuneți-ne ce trebuie să facă spațiul. Vă arătăm ce se potrivește și de ce.",
    buildingsLabel: "Clădirile",
    buildingsTitle: "Unde sunt spațiile.",
    spacesIn: (n: number) => (n === 1 ? "1 spațiu" : `${n} spații`),
    processLabel: "Cum închiriem",
    processTitle: "Cinci pași, de la cerere la deschidere.",
    areaLabel: "Suprafață",
    floorLabel: "Nivel",
    statusLabel: "Statut",
    viewingCta: "Solicită o vizionare",
    reply: "Răspuns",
    viewing: "Vizionare",
    closeLabel: "N-ați găsit?",
    closeTitle: "Spuneți-ne ce căutați. Vă anunțăm când se eliberează.",
    routes: [["Lăsați o cerere de spațiu", "/contact?subject=lease#occupier"], ["Toate proiectele", "/projects"], ["Propuneți un obiect sau un teren", "/offer"]],
  },
  ru: {
    label: "Аренда",
    heroTitle: ["Найдите место", "для\u00a0вашего бизнеса."],
    offerSpace: "Смотреть помещение",
    offerMore: "Все свободные помещения",
    building: "Здание",
    noneTitle: "Сейчас все помещения сданы.",    title: "Помещения для бизнеса.",
    lead: "Свободные площади в объектах MEGAPARC — с планами, характеристиками и актуальным статусом.",
    spaces: ["помещение", "помещения", "помещений"],
    now: "свободно сейчас",
    boardLabel: "Свободно сейчас",
    boardAll: "Все помещения",
    buildings: ["объект", "объекта", "объектов"],
    shortcutArea: "Помещения",
    shortcutFood: "Для кафе и ресторана",
    shortcutAll: "Все помещения",
    availableLabel: "Сейчас сдаётся",
    availableTitle: "Всё, что свободно, — с полными данными.",
    advisorLabel: "Что вы открываете?",
    advisorTitle: "Расскажите о своём бизнесе — покажем, что подходит и почему.",
    buildingsLabel: "Здания",
    buildingsTitle: "Где находятся помещения.",
    spacesIn: (n: number) => (n === 1 ? "1 помещение" : n < 5 ? `${n} помещения` : `${n} помещений`),
    processLabel: "Как мы сдаём",
    processTitle: "Пять шагов — от запроса до открытия.",
    areaLabel: "Площадь",
    floorLabel: "Этаж",
    statusLabel: "Статус",
    viewingCta: "Запросить просмотр",
    reply: "Ответ",
    viewing: "Просмотр",
    closeLabel: "Не нашли?",
    closeTitle: "Расскажите, что ищете. Сообщим, когда освободится.",
    routes: [["Оставить запрос на помещение", "/contact?subject=lease#occupier"], ["Все проекты", "/projects"], ["Предложить объект или землю", "/offer"]],
  },
  en: {
    label: "Leasing",
    heroTitle: ["Find the place", "for your business."],
    offerSpace: "View the space",
    offerMore: "All available spaces",
    building: "Building",
    noneTitle: "All spaces are leased right now.",    title: "Space for business.",
    lead: "Available space in MEGAPARC properties — with plans, specifications and up-to-date status.",
    spaces: ["space", "spaces", "spaces"],
    now: "available now",
    boardLabel: "Available now",
    boardAll: "All spaces",
    buildings: ["property", "properties", "properties"],
    shortcutArea: "Spaces:",
    shortcutFood: "For a café or restaurant",
    shortcutAll: "All spaces",
    availableLabel: "Available now",
    availableTitle: "What is free — with every detail.",
    advisorLabel: "What are you opening?",
    advisorTitle: "Tell us what the space must do. We show what fits and why.",
    buildingsLabel: "The buildings",
    buildingsTitle: "Where the spaces are.",
    spacesIn: (n: number) => (n === 1 ? "1 space" : `${n} spaces`),
    processLabel: "How we lease",
    processTitle: "Five steps, from request to opening.",
    areaLabel: "Area",
    floorLabel: "Level",
    statusLabel: "Status",
    viewingCta: "Request a viewing",
    reply: "Reply",
    viewing: "Viewing",
    closeLabel: "Nothing yet?",
    closeTitle: "Tell us what you are looking for — we'll let you know.",
    routes: [["Leave a space request", "/contact?subject=lease#occupier"], ["All projects", "/projects"], ["Offer a property or land", "/offer"]],
  },
} as const;


const advisorCopy: Record<SiteLocale, AdvisorCopy> = {
  ro: { stepUse: "Ce deschideți?", stepNeeds: "Ce contează pentru afacere?", stepArea: "Ce suprafață?", typical: "Pentru „{type}” contează de obicei punctele marcate cu roșu.", anyArea: "Nu contează", result: "Recomandare", more: "Alte variante", why: "De ce se potrivește", check: "De verificat împreună", quality: { strong: "Potrivire puternică", good: "Potrivire bună", partial: "Potrivire parțială" }, useFits: "Spațiul este gândit pentru: {type}", useMiss: "", areaFits: "Suprafața se încadrează", areaMiss: "", reserved: "Spațiul este rezervat — vă anunțăm dacă se eliberează", details: "Vezi spațiul", viewing: "Solicită o vizionare", emptyTitle: "Acum nu avem un spațiu potrivit.", emptyText: "Lăsați cerințele — vă scriem când se eliberează un spațiu sau apare un obiect nou.", emptyCta: "Lasă o cerere", demo: "Datele acestui spațiu sunt demonstrative." },
  ru: { stepUse: "Что вы открываете?", stepNeeds: "Что важно для бизнеса?", stepArea: "Какая площадь?", typical: "Для формата «{type}» обычно важны пункты, отмеченные красным.", anyArea: "Неважно", result: "Рекомендация", more: "Ещё варианты", why: "Почему подходит", check: "Что проверить вместе", quality: { strong: "Сильное совпадение", good: "Хорошее совпадение", partial: "Частичное совпадение" }, useFits: "Подходит для формата «{type}»", useMiss: "", areaFits: "Площадь подходит", areaMiss: "", reserved: "Помещение забронировано — сообщим, если освободится", details: "Смотреть помещение", viewing: "Запросить просмотр", emptyTitle: "Сейчас подходящего помещения нет.", emptyText: "Опишите требования — напишем, когда освободится помещение или появится новый объект.", emptyCta: "Оставить запрос", demo: "Данные этого помещения — демонстрационные." },
  en: { stepUse: "What are you opening?", stepNeeds: "What matters for the business?", stepArea: "How much space?", typical: "For “{type}”, the points marked in red usually matter most.", anyArea: "Doesn't matter", result: "Recommendation", more: "Other options", why: "Why it fits", check: "To check together", quality: { strong: "Strong fit", good: "Good fit", partial: "Partial fit" }, useFits: "The space is designed for: {type}", useMiss: "", areaFits: "The area fits", areaMiss: "", reserved: "The space is reserved — we tell you if it frees up", details: "View the space", viewing: "Request a viewing", emptyTitle: "We have no suitable space right now.", emptyText: "Describe your requirements — we write when a space frees up or a new property arrives.", emptyCta: "Leave a request", demo: "This space's data is a demonstration." },
};

/** Each published space as an editorial row (image + the facts that decide a viewing). Filterable: `data-space`. */
function SpaceRow({ space, locale, index, c, compact = false }: { space: AvailableSpace; locale: SiteLocale; index: number; c: { viewingCta: string; earlyCta: string; offerSpace: string }; compact?: boolean }) {
  const p = (path: string) => localePath(locale, path);
  const project = getProject(space.project)!;
  const a = availabilityOf(space);
  return (
    <article className={`r3-space${index % 2 && !compact ? " r3-space--flip" : ""}${compact ? " r32-space--compact" : ""}`} data-space={space.id} data-reveal>
      <Link href={p(`/leasing/${space.id}`)} className="r3-space__media" tabIndex={-1} aria-hidden="true">
        <SpaceImage photo={space.photos[0]} space={space} locale={locale} sizes="(min-width: 1024px) 58vw, 100vw" priority={index === 0} />
      </Link>
      <div className="r3-space__copy">
        <p className="r3-space__where"><Link href={p(`/projects/${project.slug}`)}>{project.name}</Link><span>{project.district[locale]}</span></p>
        <h3 className="r3-space__unit"><Link href={p(`/leasing/${space.id}`)}>{space.unit[locale]}</Link></h3>
        <p className="r3-space__area"><Figure value={formatAreaRange(space.areaMin, space.area, locale)} /></p>
        <p className={`r3-state is-${a.key === "now" ? "now" : a.key === "soon" ? "soon" : "quiet"}`}>{availabilityLabel(space, locale)}</p>
        <p className="r3-space__line">{space.headline[locale]}</p>
        <div className="r3-actions">
          <R3Button href={viewingHref(locale, space)}>{viewableNow(space) ? c.viewingCta : c.earlyCta}</R3Button>
          <R3Link href={p(`/leasing/${space.id}`)}>{c.offerSpace}</R3Link>
        </div>
      </div>
    </article>
  );
}

const r3Copy = {
  ro: {
    earlyCta: "Anunțați interesul din timp", stepsLabel: "Cum închiriem", advisorOpen: "Alegeți spațiul după formatul afacerii",
    question: ["Ce puteți", "închiria."],
    nowTitle: "Se poate vedea acum", soonTitle: "În curând",
    soonNote: "Clădirea este ocupată până la data indicată — planificați locația din timp.",
    count: (now: number, soon: number) => `${now} ${now === 1 ? "ofertă se poate vedea" : "oferte se pot vedea"} acum · ${soon} în curând`,
  },
  ru: {
    earlyCta: "Заявить интерес заранее", stepsLabel: "Как мы сдаём", advisorOpen: "Подобрать помещение под формат бизнеса",
    question: ["Что можно", "арендовать."],
    nowTitle: "Можно посмотреть сейчас", soonTitle: "Скоро",
    soonNote: "Здание занято до указанной даты — планируйте локацию заранее.",
    count: (now: number, soon: number) => `${now} ${now === 1 ? "предложение можно посмотреть" : "предложения можно посмотреть"} сейчас · ${soon} скоро`,
  },
  en: {
    earlyCta: "Register early interest", stepsLabel: "How we lease", advisorOpen: "Match a space to your business format",
    question: ["What you", "can lease."],
    nowTitle: "Can be viewed now", soonTitle: "Coming up",
    soonNote: "The building is occupied until the date shown — plan the location early.",
    count: (now: number, soon: number) => `${now} ${now === 1 ? "offer" : "offers"} to view now · ${soon} coming up`,
  },
} as const;

/**
 * WHY LEASE WITH MEGAPARC — R3.2 §14 (OWNER 2026-11-10). Claim → evidence only: the technical team (Technical Director +
 * Architect), feasibility before commercial terms, the owner directly, verifiable data (confirmed areas and statuses; the
 * architectural plans and the cadastral number where the OWNER approved them). No permit or design service is promised.
 */
const whyCopy = {
  label: { ro: "De ce MEGAPARC", ru: "Почему MEGAPARC", en: "Why MEGAPARC" },
  title: { ro: "De ce să închiriați de la MEGAPARC.", ru: `Почему арендовать у${NB}MEGAPARC.`, en: "Why lease from MEGAPARC." },
  team: { ro: "Directorul tehnic și arhitectul", ru: `Технический директор и${NB}архитектор`, en: "The Technical Director and the Architect" },
  feasibility: { ro: "Mai întâi tehnica, apoi condițiile", ru: `Сначала техника, потом условия`, en: "Technical first, terms second" },
  owner: { ro: "Direct cu proprietarul", ru: "Напрямую с собственником", en: "Directly with the owner" },
  ownerText: { ro: "Spațiul îl discutați cu MEGAPARC — proprietarul clădirii.", ru: `Помещение вы обсуждаете с${NB}MEGAPARC${NB}— владельцем здания.`, en: "You discuss the space with MEGAPARC — the owner of the building." },
  data: { ro: "Date verificabile", ru: "Проверяемые данные", en: "Verifiable data" },
  dataText: (names: string, locale: SiteLocale) =>
    locale === "ru"
      ? `Подтверждённые площади и${NB}статус каждого помещения; по${NB}${names}${NB}— архитектурные планы и${NB}кадастровый номер для официальной проверки в${NB}e‑Cadastru.`
      : locale === "ro"
        ? `Suprafețe confirmate și statutul fiecărui spațiu; pentru ${names} — planurile arhitecturale și numărul cadastral pentru verificarea oficială în e‑Cadastru.`
        : `Confirmed areas and the status of every space; for ${names} — the architectural plans and the cadastral number for official verification in e‑Cadastru.`,
} as const;

function LeasingWhy({ locale }: { locale: SiteLocale }) {
  const names = Object.keys(cadastreNumbers).map((slug) => getProject(slug)?.name).filter(Boolean).join(", ");
  const reasons = [
    { title: whyCopy.team[locale], text: trustCopy.lead[locale] },
    { title: whyCopy.feasibility[locale], text: trustCopy.principle[locale] },
    { title: whyCopy.owner[locale], text: whyCopy.ownerText[locale] },
    { title: whyCopy.data[locale], text: whyCopy.dataText(names, locale) },
  ];
  return (
    <section className="r3-sec r3-sec--paper r32-why" id="technical-support">
      <div className="r3-shell">
        <div className="r3-head" data-reveal>
          <R3Label>{whyCopy.label[locale]}</R3Label>
          <h2 className="r3-title">{whyCopy.title[locale]}</h2>
        </div>
        <ol className="r32-why__list" data-reveal>
          {reasons.map((reason) => (
            <li key={reason.title}>
              <h3>{reason.title}</h3>
              <p>{reason.text}</p>
            </li>
          ))}
        </ol>
        <div className="r3-actions" data-reveal>
          <a className="r3-btn r3-btn--dark" href={contactLinks.email}><span>{trustCopy.discuss[locale]}</span><Icon size={16} /></a>
          <a className="r3-link r3-link--dark" href={contactLinks.mobile}><span>{trustCopy.call[locale]} · {tel(company.mobile.value[locale])}</span><Icon size={16} /></a>
        </div>
        <p className="r3-note r32-why__note">{trustCopy.note[locale]}</p>
      </div>
    </section>
  );
}

export function LeasingPage({ locale }: { locale: SiteLocale }) {
  const c = { ...copy[locale], ...r3Copy[locale] };
  const p = (path: string) => localePath(locale, path);
  const list = sortSpaces(publicSpaces);
  /** R3.1 §15: what can be viewed now (available now, or a building that can be visited today) · what comes later. */
  const now = list.filter((space) => viewableNow(space));
  const soon = list.filter((space) => !viewableNow(space));
  const linkTo = (value: string) => {
    const [pathQuery, hash] = value.split("#");
    const [route, query] = pathQuery.split("?");
    return `${p(route)}${query ? `?${query}` : ""}${hash ? `#${hash}` : ""}`;
  };

  return (
    <PageShell locale={locale} experience mainClassName="r3-page r3-leasing lx-page">
      {/* THE QUESTION — what can I lease? Answered right below, grouped by when it can be seen */}
      <section className="r3-sec r3-sec--ivory r3-opening r3-opening--leasing">
        <div className="r3-shell">
          <R3Label>{c.label}</R3Label>
          <MaskTitle as="h1" className="r3-opening__title" lines={[...c.question]} />
          <div className="r3-opening__base" data-reveal>
            <p className="r3-statement">{list.length ? c.count(now.length, soon.length) : c.noneTitle}</p>
            <p className="r3-lead">{noPrice[locale]}</p>
          </div>
        </div>
      </section>

      <section className="r3-sec r3-sec--ivory r3-sec--flush-top r3-avail" id="available">
        <div className="r3-shell">
          {now.length ? (
            <div className="r3-avail__group">
              <h2 className="r3-avail__title">{c.nowTitle}<span>{String(now.length).padStart(2, "0")}</span></h2>
              <div className="r3-avail__list">
                {now.map((space, i) => <SpaceRow key={space.id} space={space} locale={locale} index={i} c={c} />)}
              </div>
            </div>
          ) : null}
          {soon.length ? (
            <div className="r3-avail__group r3-avail__group--soon">
              <h2 className="r3-avail__title">{c.soonTitle}<span>{String(soon.length).padStart(2, "0")}</span></h2>
              <p className="r3-lead">{c.soonNote}</p>
              <div className="r3-avail__list">
                {soon.map((space, i) => <SpaceRow key={space.id} space={space} locale={locale} index={now.length + i} c={c} compact />)}
              </div>
            </div>
          ) : null}
          {!list.length ? (
            <div className="r3-actions"><R3Button href={`${p("/contact")}?subject=lease#occupier`}>{c.routes[0][0]}</R3Button></div>
          ) : null}
        </div>
      </section>

      {/* WHY LEASE WITH MEGAPARC (R3.2 §14) — Moscova 20-level trust: the technical team, feasibility first, the owner
          directly, verified data; the full check list and the cadastral verification live on each property page */}
      <LeasingWhy locale={locale} />

      {/* TENANT ADVISOR — kept, folded: one question opens it */}
      <section className="r3-sec r3-sec--ivory r3-advisor" id="advisor">
        <div className="r3-shell">
          <details className="r3-fold">
            <summary>
              <span className="r3-fold__title">{c.advisorOpen}</span>
              <Icon name="down" size={22} />
            </summary>
            <div className="r3-fold__body">
              <p className="r3-lead">{c.advisorTitle}</p>
              <TenantAdvisor
                items={list.map((space) => ({
                  id: space.id,
                  project: getProject(space.project)!.name,
                  unit: space.unit[locale],
                  areaLabel: formatAreaRange(space.areaMin, space.area, locale),
                  area: space.area,
                  areaMin: space.areaMin ?? space.area,
                  uses: space.uses,
                  fit: space.fit,
                  demo: space.dataStatus === "DEMO",
                  avail: availabilityOf(space).key,
                  availLabel: availabilityLabel(space, locale),
                  href: p(`/leasing/${space.id}`),
                  viewing: viewingHref(locale, space),
                  media: <SpaceImage photo={space.photos[0]} space={space} locale={locale} sizes="(min-width: 1024px) 40vw, 100vw" />,
                }))}
                uses={uses.map((u) => ({ key: u.key, label: u.label[locale], goal: u.goal[locale], typical: u.typical }))}
                needs={needOrder.map((key) => ({ key, label: needs[key].label[locale], why: needs[key].why[locale] }))}
                bands={areaBands.map((b) => ({ key: b.key, label: b.label[locale], min: b.min, max: b.max }))}
                copy={advisorCopy[locale]}
                contactHref={p("/contact")}
              />
            </div>
          </details>
        </div>
      </section>

      {/* HOW WE LEASE — one line, five stations */}
      <section className="r3-sec r3-sec--paper r3-steps-sec">
        <div className="r3-shell">
          <div className="r3-head r3-head--split" data-reveal>
            <R3Label>{c.stepsLabel}</R3Label>
            <h2 className="r3-title">{c.processTitle}</h2>
            <p className="r3-lead">{noPrice[locale]}</p>
          </div>
          <ol className="r3-steps" data-reveal>
            {leasingSteps.map((step) => (
              <li key={step.title.en}>
                <h3>{step.title[locale]}</h3>
                <p>{step.text[locale]}</p>
              </li>
            ))}
          </ol>
          {/* production edition: the reply / viewing times are DEMO promises — not published (OWNER "PRODUCTION V1" §3) */}
          {shown(leasingProcess.reply) || shown(leasingProcess.viewing) ? (
            <dl className="r3-steps__facts" data-reveal>
              {shown(leasingProcess.reply) ? <div><dt>{c.reply}</dt><dd><Val point={leasingProcess.reply} locale={locale} /></dd></div> : null}
              {shown(leasingProcess.viewing) ? <div><dt>{c.viewing}</dt><dd><Val point={leasingProcess.viewing} locale={locale} /></dd></div> : null}
            </dl>
          ) : null}
        </div>
      </section>

      {/* CLOSE — not found: leave a request */}
      <section className="r3-sec r3-sec--stone r3-routes">
        <div className="r3-shell">
          <R3Label>{c.closeLabel}</R3Label>
          <h2 className="r3-title r3-routes__title">{c.closeTitle}</h2>
          <nav className="r3-routes__list" aria-label={c.closeLabel}>
            {c.routes.map(([label, value]) => (
              <Link key={label} href={linkTo(value)}>
                <span>{label}</span>
                <Icon size={22} />
              </Link>
            ))}
          </nav>
        </div>
      </section>
    </PageShell>
  );
}
