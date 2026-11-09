import Link from "next/link";
import { TechSupport } from "@/components/leasing/property-trust";
import type { CSSProperties } from "react";
import { DemoMark, MaskTitle, Val } from "@/components/experience";
import { LeasingInventory, type InventoryCopy } from "@/components/leasing/inventory";
import { TenantAdvisor, type AdvisorCopy } from "@/components/leasing/tenant-advisor";
import { SpaceImage, UnitCard, viewingHref } from "@/components/leasing/unit-card";
import { PageShell } from "@/components/page-shell";
import { ArtImage } from "@/components/primitives";
import { Button, Icon } from "@/components/ui";
import { availabilityLabel, availabilityOf, formatArea, formatAreaRange, getProject, listProjects, publicSpaces, sortSpaces, spacesFor } from "@/content/source";
import { leasingProcess, shown } from "@/data/demo-content";
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

export function LeasingPage({ locale }: { locale: SiteLocale }) {
  const c = copy[locale];
  const p = (path: string) => localePath(locale, path);
  const list = sortSpaces(publicSpaces);
  const withSpace = listProjects().filter((project) => spacesFor(project.slug).length);
  /** The opening offer: the first published space in public order (available now first). */
  const lead = list[0] ?? null;
  const leadProject = lead ? getProject(lead.project) ?? null : null;

  return (
    <PageShell locale={locale} experience mainClassName="lx-page">
      {/* HERO — desire first: the first available space as a property opportunity, before any filter */}
      <section className={`lx2-hero${lead ? "" : " lx2-hero--none"}`}>
        {lead && leadProject ? (
          <Link href={p(`/leasing/${lead.id}`)} className="lx2-hero__media" tabIndex={-1} aria-hidden="true">
            {/* the real building; on wide screens the frame is held to its left part, clear of the temporary lettering on the glazing */}
            <ArtImage media={leadProject.media!} alt="" priority sizes="(min-width: 1024px) 50vw, 100vw" position="0% 50%" />
          </Link>
        ) : null}
        <div className="lx2-hero__copy">
          <p className="pm-kicker" data-reveal>{c.label}</p>
          <MaskTitle as="h1" className="lx2-hero__title" lines={[...c.heroTitle]} />
          {lead && leadProject ? (
            <div className="lx2-offer" data-reveal>
              <p className="lx2-offer__where">
                <Link href={p(`/projects/${leadProject.slug}`)}>{leadProject.name}</Link>
                <span>{leadProject.district[locale]}</span>
              </p>
              <p className="lx2-offer__unit">{lead.unit[locale]}</p>
              <dl className="lx2-offer__facts">
                <div><dt className="sr-only">{c.areaLabel}</dt><dd className="lx2-offer__area">{formatAreaRange(lead.areaMin, lead.area, locale)}</dd></div>
                {/* the floor is shown once: when the unit name already carries it, it is not repeated */}
                {lead.unit[locale].includes(lead.floorLabel[locale]) ? null : <div><dt className="sr-only">{c.floorLabel}</dt><dd>{lead.floorLabel[locale]}</dd></div>}
                <div><dt className="sr-only">{c.statusLabel}</dt><dd className={`lx2-offer__status is-${availabilityOf(lead).key}`}>{availabilityLabel(lead, locale)}</dd></div>
              </dl>
              {lead.confirmed.includes("highlights") && lead.highlights.length ? (
                <ul className="lx2-offer__points">
                  {lead.highlights.slice(0, 4).map((point) => (
                    <li key={point.en}>{point[locale]}</li>
                  ))}
                </ul>
              ) : null}
              <div className="pm-actions">
                <Button href={viewingHref(locale, lead)}>{c.viewingCta}</Button>
                <Link className="pm-link" href={p(`/leasing/${lead.id}`)}>{c.offerSpace}<Icon /></Link>
              </div>
              <a className="lx2-offer__more" href="#available">{c.offerMore} · {String(list.length).padStart(2, "0")}<Icon name="down" /></a>
            </div>
          ) : (
            <div className="lx2-offer" data-reveal>
              <p className="lx2-offer__unit">{c.noneTitle}</p>
              <div className="pm-actions">
                <Button href={`${p("/contact")}?subject=lease#occupier`}>{c.routes[0][0]}</Button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* AVAILABLE NOW — inventory */}
      <section className="xp-sec lx-available" id="available">
        <div className="xp-shell">
          <div className="pm-head pm-head--split" data-reveal>
            <p className="pm-kicker">{c.availableLabel}</p>
            <h2 className="pm-h2">{c.availableTitle}</h2>
            <p className="pm-head__lead">{noPrice[locale]}</p>
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
              <UnitCard key={space.id} space={space} locale={locale} priority={i < 2} />
            ))}
          </LeasingInventory>
        </div>
      </section>

      {/* TENANT ADVISOR */}
      <section className="xp-sec xp-sec--warm" id="advisor">
        <div className="xp-shell">
          <div className="pm-head pm-head--split" data-reveal>
            <p className="pm-kicker">{c.advisorLabel}</p>
            <h2 className="pm-h2">{c.advisorTitle}</h2>
          </div>
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
      </section>

      {/* BUILDINGS WITH SPACE — only when there is more than one (a single building is already the opening) */}
      {withSpace.length > 1 ? (
      <section className="xp-sec">
        <div className="xp-shell">
          <div className="pm-head" data-reveal>
            <p className="pm-kicker">{c.buildingsLabel}</p>
            <h2 className="pm-h2">{c.buildingsTitle}</h2>
          </div>
          <ul className="lx-buildings">
            {withSpace.map((project) => {
              const own = spacesFor(project.slug);
              return (
                <li key={project.slug} data-reveal>
                  <Link href={p(`/projects/${project.slug}`)}>
                    <figure className="xp-fig" style={{ "--ratio": "4 / 3" } as CSSProperties}>
                      <SpaceImage photo={own[0].photos[0]} space={own[0]} locale={locale} sizes="(min-width: 1024px) 25vw, 50vw" />
                    </figure>
                    <span className="lx-buildings__name">{project.name}</span>
                    <span className="lx-buildings__meta">
                      {project.district[locale]} · {c.spacesIn(own.length)} · {own.map((s) => formatArea(s.area, locale)).join(", ")}
                      {own.some((s) => s.dataStatus === "DEMO") ? <DemoMark /> : null}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </section>
      ) : null}

      {/* TECHNICAL SUPPORT — a MEGAPARC advantage on every leasing route (OWNER overnight release §6) */}
      <section className="tr-sec" id="technical-support">
        <div className="xp-shell tr-grid tr-grid--single">
          <TechSupport locale={locale} />
        </div>
      </section>

      {/* PROCESS */}
      <section className="xp-sec xp-sec--stone">
        <div className="xp-shell">
          <div className="pm-head pm-head--split" data-reveal>
            <p className="pm-kicker">{c.processLabel}</p>
            <h2 className="pm-h2">{c.processTitle}</h2>
            <p className="pm-head__lead">{noPrice[locale]}</p>
          </div>
          <ol className="xp-process" style={{ "--n": leasingSteps.length } as CSSProperties} data-reveal>
            {leasingSteps.map((step) => (
              <li key={step.title.en}>
                <h3>{step.title[locale]}</h3>
                <p>{step.text[locale]}</p>
              </li>
            ))}
          </ol>
          {/* production edition: the reply / viewing times are DEMO promises — not published (OWNER "PRODUCTION V1" §3) */}
          {shown(leasingProcess.reply) || shown(leasingProcess.viewing) ? (
            <dl className="lx-facts" data-reveal>
              {shown(leasingProcess.reply) ? <div><dt>{c.reply}</dt><dd><Val point={leasingProcess.reply} locale={locale} /></dd></div> : null}
              {shown(leasingProcess.viewing) ? <div><dt>{c.viewing}</dt><dd><Val point={leasingProcess.viewing} locale={locale} /></dd></div> : null}
            </dl>
          ) : null}
        </div>
      </section>

      {/* CLOSE — waiting list */}
      <section className="pm-close">
        <div className="xp-shell pm-close__grid">
          <div data-reveal>
            <p className="pm-kicker">{c.closeLabel}</p>
            <h2 className="pm-close__title lx2-close__title">{c.closeTitle}</h2>
          </div>
          <nav className="pm-close__routes" aria-label={c.closeLabel} data-reveal>
            {c.routes.map(([label, href]) => {
              const [path, hash] = href.split("#");
              const [route, query] = path.split("?");
              return (
                <Link key={label} href={`${p(route)}${query ? `?${query}` : ""}${hash ? `#${hash}` : ""}`}>
                  <span>{label}</span>
                  <Icon name="arrow" size={18} />
                </Link>
              );
            })}
          </nav>
        </div>
      </section>
    </PageShell>
  );
}
