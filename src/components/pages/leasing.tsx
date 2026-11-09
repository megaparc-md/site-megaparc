import Link from "next/link";
import { MaskTitle, Val } from "@/components/experience";
import { LeasingInventory, type InventoryCopy } from "@/components/leasing/inventory";
import { TenantAdvisor, type AdvisorCopy } from "@/components/leasing/tenant-advisor";
import { SpaceImage, viewingHref } from "@/components/leasing/unit-card";
import { PageShell } from "@/components/page-shell";
import { ArtImage } from "@/components/primitives";
import { Figure, R3Button, R3Label, R3Link, R3Trust, viewableNow } from "@/components/r3";
import { Icon } from "@/components/ui";
import { availabilityLabel, availabilityOf, formatAreaRange, getProject, listProjects, publicSpaces, sortSpaces, spacesFor } from "@/content/source";
import { leasingProcess, shown } from "@/data/demo-content";
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

const inventoryCopy: Record<SiteLocale, InventoryCopy> = {
  ro: { label: "Filtre", use: "Ce deschideți?", area: "Ce suprafață vă trebuie?", project: "Clădirea", all: "Toate", anyArea: "Oricare", allProjects: "Toate clădirile", nowOnly: "Doar libere acum", found: ["spațiu găsit", "spații găsite", "spații găsite"], reset: "Resetează filtrele", emptyTitle: "Acum nu avem exact acest spațiu.", emptyText: "Lăsați o cerere — vă scriem când se eliberează un spațiu potrivit.", emptyCta: "Lasă o cerere" },
  ru: { label: "Фильтры", use: "Что вы открываете?", area: "Какая площадь нужна?", project: "Здание", all: "Все", anyArea: "Любая", allProjects: "Все здания", nowOnly: "Только свободные сейчас", found: ["помещение", "помещения", "помещений"], reset: "Сбросить фильтры", emptyTitle: "Сейчас именно такого помещения нет.", emptyText: "Оставьте запрос — напишем, когда освободится подходящее помещение.", emptyCta: "Оставить запрос" },
  en: { label: "Filters", use: "What are you opening?", area: "How much space do you need?", project: "Building", all: "All", anyArea: "Any", allProjects: "All buildings", nowOnly: "Available now only", found: ["space", "spaces", "spaces"], reset: "Reset filters", emptyTitle: "We don't have exactly this space right now.", emptyText: "Leave a request — we write when a suitable space frees up.", emptyCta: "Leave a request" },
};

const advisorCopy: Record<SiteLocale, AdvisorCopy> = {
  ro: { stepUse: "Ce deschideți?", stepNeeds: "Ce contează pentru afacere?", stepArea: "Ce suprafață?", typical: "Pentru „{type}” contează de obicei punctele marcate cu roșu.", anyArea: "Nu contează", result: "Recomandare", more: "Alte variante", why: "De ce se potrivește", check: "De verificat împreună", quality: { strong: "Potrivire puternică", good: "Potrivire bună", partial: "Potrivire parțială" }, useFits: "Spațiul este gândit pentru: {type}", useMiss: "", areaFits: "Suprafața se încadrează", areaMiss: "", reserved: "Spațiul este rezervat — vă anunțăm dacă se eliberează", details: "Vezi spațiul", viewing: "Solicită o vizionare", emptyTitle: "Acum nu avem un spațiu potrivit.", emptyText: "Lăsați cerințele — vă scriem când se eliberează un spațiu sau apare un obiect nou.", emptyCta: "Lasă o cerere", demo: "Datele acestui spațiu sunt demonstrative." },
  ru: { stepUse: "Что вы открываете?", stepNeeds: "Что важно для бизнеса?", stepArea: "Какая площадь?", typical: "Для формата «{type}» обычно важны пункты, отмеченные красным.", anyArea: "Неважно", result: "Рекомендация", more: "Ещё варианты", why: "Почему подходит", check: "Что проверить вместе", quality: { strong: "Сильное совпадение", good: "Хорошее совпадение", partial: "Частичное совпадение" }, useFits: "Подходит для формата «{type}»", useMiss: "", areaFits: "Площадь подходит", areaMiss: "", reserved: "Помещение забронировано — сообщим, если освободится", details: "Смотреть помещение", viewing: "Запросить просмотр", emptyTitle: "Сейчас подходящего помещения нет.", emptyText: "Опишите требования — напишем, когда освободится помещение или появится новый объект.", emptyCta: "Оставить запрос", demo: "Данные этого помещения — демонстрационные." },
  en: { stepUse: "What are you opening?", stepNeeds: "What matters for the business?", stepArea: "How much space?", typical: "For “{type}”, the points marked in red usually matter most.", anyArea: "Doesn't matter", result: "Recommendation", more: "Other options", why: "Why it fits", check: "To check together", quality: { strong: "Strong fit", good: "Good fit", partial: "Partial fit" }, useFits: "The space is designed for: {type}", useMiss: "", areaFits: "The area fits", areaMiss: "", reserved: "The space is reserved — we tell you if it frees up", details: "View the space", viewing: "Request a viewing", emptyTitle: "We have no suitable space right now.", emptyText: "Describe your requirements — we write when a space frees up or a new property arrives.", emptyCta: "Leave a request", demo: "This space's data is a demonstration." },
};

/** Each published space as an editorial row (image + the facts that decide a viewing). Filterable: `data-space`. */
function SpaceRow({ space, locale, index, c }: { space: AvailableSpace; locale: SiteLocale; index: number; c: { viewingCta: string; earlyCta: string; offerSpace: string } }) {
  const p = (path: string) => localePath(locale, path);
  const project = getProject(space.project)!;
  const a = availabilityOf(space);
  return (
    <article className={`r3-space${index % 2 ? " r3-space--flip" : ""}`} data-space={space.id} data-reveal>
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
  ro: { earlyCta: "Anunțați interesul din timp", stepsLabel: "Cum închiriem", advisorOpen: "Alegeți spațiul după formatul afacerii" },
  ru: { earlyCta: "Заявить интерес заранее", stepsLabel: "Как мы сдаём", advisorOpen: "Подобрать помещение под формат бизнеса" },
  en: { earlyCta: "Register early interest", stepsLabel: "How we lease", advisorOpen: "Match a space to your business format" },
} as const;

export function LeasingPage({ locale }: { locale: SiteLocale }) {
  const c = { ...copy[locale], ...r3Copy[locale] };
  const p = (path: string) => localePath(locale, path);
  const list = sortSpaces(publicSpaces);
  const withSpace = listProjects().filter((project) => spacesFor(project.slug).length);
  /** The opening offer: the first published space in public order (available now first). */
  const lead = list[0] ?? null;
  const leadProject = lead ? getProject(lead.project) ?? null : null;
  const linkTo = (value: string) => {
    const [pathQuery, hash] = value.split("#");
    const [route, query] = pathQuery.split("?");
    return `${p(route)}${query ? `?${query}` : ""}${hash ? `#${hash}` : ""}`;
  };

  return (
    <PageShell locale={locale} experience mainClassName="r3-page r3-leasing lx-page">
      {/* HERO — desire first: the first available space, large, before any filter */}
      <section className={`r3-lhero${lead ? "" : " r3-lhero--none"}`}>
        {lead && leadProject ? (
          <Link href={p(`/leasing/${lead.id}`)} className="r3-lhero__media" tabIndex={-1} aria-hidden="true">
            {/* the real building; the frame is held to its left part, clear of the temporary lettering on the glazing */}
            <ArtImage media={leadProject.media!} alt="" priority sizes="(min-width: 1024px) 58vw, 100vw" position="0% 50%" />
          </Link>
        ) : null}
        <div className="r3-lhero__copy">
          <R3Label>{c.label}</R3Label>
          <MaskTitle as="h1" className="r3-lhero__title" lines={[...c.heroTitle]} />
          {lead && leadProject ? (
            <div className="r3-lhero__offer" data-reveal>
              <p className="r3-space__where"><Link href={p(`/projects/${leadProject.slug}`)}>{leadProject.name}</Link><span>{leadProject.district[locale]}</span></p>
              <p className="r3-lhero__unit">{lead.unit[locale]}</p>
              <p className="r3-lhero__area"><Figure value={formatAreaRange(lead.areaMin, lead.area, locale)} /></p>
              <p className={`r3-state is-${availabilityOf(lead).key === "now" ? "now" : "soon"}`}>{availabilityLabel(lead, locale)}</p>
              <div className="r3-actions">
                <R3Button href={viewingHref(locale, lead)}>{c.viewingCta}</R3Button>
                <R3Link href={p(`/leasing/${lead.id}`)}>{c.offerSpace}</R3Link>
              </div>
              <a className="r3-lhero__more" href="#available">{c.offerMore} · {String(list.length).padStart(2, "0")}<Icon name="down" size={14} /></a>
            </div>
          ) : (
            <div className="r3-lhero__offer" data-reveal>
              <p className="r3-lhero__unit">{c.noneTitle}</p>
              <div className="r3-actions"><R3Button href={`${p("/contact")}?subject=lease#occupier`}>{c.routes[0][0]}</R3Button></div>
            </div>
          )}
        </div>
      </section>

      {/* AVAILABLE — every published space as an editorial row; three quiet filters above */}
      <section className="r3-sec r3-sec--ivory r3-avail" id="available">
        <div className="r3-shell">
          <div className="r3-head r3-head--split" data-reveal>
            <R3Label>{c.availableLabel}</R3Label>
            <h2 className="r3-title">{c.availableTitle}</h2>
            <p className="r3-lead">{noPrice[locale]}</p>
          </div>
          <LeasingInventory
            locale={locale}
            items={list.map((s) => ({ id: s.id, uses: s.uses, area: s.area, areaMin: s.areaMin ?? s.area, project: s.project, avail: availabilityOf(s).key }))}
            uses={uses.map((u) => ({ key: u.key, label: u.label[locale] }))}
            bands={areaBands.map((b) => ({ key: b.key, label: b.label[locale], min: b.min, max: b.max }))}
            projects={withSpace.map((project) => ({ key: project.slug, label: project.name }))}
            copy={inventoryCopy[locale]}
            contactHref={`${p("/contact")}?subject=lease#occupier`}
          >
            {list.map((space, i) => (
              <SpaceRow key={space.id} space={space} locale={locale} index={i} c={c} />
            ))}
          </LeasingInventory>
        </div>
      </section>

      {/* TRUST — technical feasibility first, then commercial terms (the cadastral verification lives on each property) */}
      <R3Trust locale={locale} tone="paper" />

      {/* TENANT ADVISOR — kept, folded: one question opens it */}
      <section className="r3-sec r3-sec--ivory r3-advisor" id="advisor">
        <div className="r3-shell">
          <details className="r3-fold">
            <summary>
              <span className="r3-label">{c.advisorLabel}</span>
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
