import Link from "next/link";
import { PropertyTrust } from "@/components/leasing/property-trust";
import type { CSSProperties } from "react";
import { DemoLegend, DemoMark, Opening, Val } from "@/components/experience";
import { AvailabilityChip, SpaceImage, UnitCard, labelOfUse, viewingHref } from "@/components/leasing/unit-card";
import { UnitPlan } from "@/components/leasing/unit-plan";
import { PageShell } from "@/components/page-shell";
import { Button, Icon, TextLink } from "@/components/ui";
import { LeasingPropertyTemplate } from "@/components/leasing-experience/property-template";
import { availabilityCopy, availabilityOf, formatDate, spaceArea, getProject, isDemoField, leasingExperienceForSpace, publicSpaces, sortSpaces } from "@/content/source";
import { leasingProcess, tenantFit, shown } from "@/data/demo-content";
import type { AvailableSpace, SpaceField } from "@/data/leasing-inventory";
import { fitCopy, leasingSteps, needOrder, needs, noPrice, uses } from "@/lib/leasing";
import { localePath, type Localized, type SiteLocale } from "@/lib/site-data";

/**
 * UNIT PAGE — one available space, every field a tenant needs (OWNER correction
 * 2026-10-08, "LEASING INVENTORY"): property · unit · available area · floor ·
 * use · availability date · status · key features · parking · entrance ·
 * visibility · deliveries (from the property's capabilities, TRUST & PROOF
 * PASS 2026-10-09) · technical features · plan · photos · call to action.
 * Generated only for published spaces: a space set to LEASED in the CMS has no
 * page (and no card, no count).
 */
const t = {
  back: { ro: "Închiriere", ru: "Аренда", en: "Leasing" },
  viewing: { ro: "Solicită o vizionare", ru: "Запросить просмотр", en: "Request a viewing" },
  waitlist: { ro: "Anunțați-mă dacă se eliberează", ru: "Сообщить, если освободится", en: "Tell me if it frees up" },
  fits: { ro: "Se potrivește afacerii mele?", ru: "Подходит ли моему бизнесу?", en: "Does it fit my business?" },
  dataLabel: { ro: "Datele spațiului", ru: "О помещении", en: "The space in figures" },
  property: { ro: "Obiect", ru: "Объект", en: "Property" },
  unit: { ro: "Spațiu", ru: "Помещение", en: "Unit" },
  area: { ro: "Suprafață disponibilă", ru: "Площадь", en: "Available area" },
  floor: { ro: "Etaj", ru: "Этаж", en: "Floor" },
  use: { ro: "Destinație", ru: "Назначение", en: "Use" },
  date: { ro: "Disponibil din", ru: "Свободно с", en: "Available from" },
  status: { ro: "Status", ru: "Статус", en: "Status" },
  parking: { ro: "Parcare", ru: "Парковка", en: "Parking" },
  entrance: { ro: "Intrare", ru: "Вход", en: "Entrance" },
  visibility: { ro: "Vizibilitate", ru: "Видимость", en: "Visibility" },
  delivery: { ro: "Livrări", ru: "Доставка и разгрузка", en: "Deliveries" },
  power: { ro: "Putere electrică", ru: "Электрическая мощность", en: "Power" },
  ventilation: { ro: "Ventilație", ru: "Вентиляция", en: "Ventilation" },
  height: { ro: "Înălțime", ru: "Высота", en: "Ceiling height" },
  condition: { ro: "Stare", ru: "Состояние", en: "Condition" },
  now: { ro: "Acum", ru: "Сейчас", en: "Now" },
  free: { ro: "Liber", ru: "Свободно", en: "Available" },
  featuresLabel: { ro: "Ce contează aici", ru: "Главное о помещении", en: "Key features" },
  techLabel: { ro: "Tehnic", ru: "Техника", en: "Technical" },
  fitLabel: { ro: "Cui i se potrivește", ru: "Кому подходит", en: "Who it fits" },
  fitTitle: { ro: "Cum răspunde spațiul nevoilor unei afaceri.", ru: "Что это помещение даёт бизнесу.", en: "How the space answers a business's needs." },
  planLabel: { ro: "Plan", ru: "План", en: "Plan" },
  photosLabel: { ro: "Fotografii", ru: "Фотографии", en: "Photographs" },
  terms: { ro: "Condiții", ru: "Условия", en: "Terms" },
  processLabel: { ro: "Cum închiriem", ru: "Как мы сдаём", en: "How we lease" },
  reply: { ro: "Răspuns", ru: "Ответ", en: "Reply" },
  viewingTime: { ro: "Vizionare", ru: "Просмотр", en: "Viewing" },
  moreLabel: { ro: "Alte spații libere", ru: "Другие свободные помещения", en: "Other available spaces" },
  projectLink: { ro: "Despre clădire", ru: "О здании", en: "About the building" },
  updated: { ro: "Actualizat", ru: "Обновлено", en: "Updated" },
  closeTitle: { ro: "Vedeți spațiul cu ochii dumneavoastră.", ru: "Посмотрите помещение вживую.", en: "See the space for yourself." },
  closeText: { ro: "Spuneți-ne ce deschideți și ce este critic — pregătim vizionarea cu răspunsurile tehnice la îndemână.", ru: "Расскажите, что вы открываете и что для вас важно, — к просмотру подготовим ответы на технические вопросы.", en: "Tell us what you are opening and what is critical — we prepare the viewing with the technical answers at hand." },
} satisfies Record<string, Localized>;

function Row({ label, value, demo }: { label: string; value: string; demo?: boolean }) {
  if (demo) return null; // §29: invented values are not published
  return (
    <div className="lx-data__row">
      <dt>{label}</dt>
      <dd>{value}{demo ? <DemoMark /> : null}</dd>
    </div>
  );
}

export function UnitPage({ locale, space }: { locale: SiteLocale; space: AvailableSpace }) {
  // OWNER «LEASING TEMPLATE LOCK» (2026-11-10): a unit whose property has a leasing dataset opens the shared
  // leasing template (canonical: the project page); every other unit keeps this template.
  const experience = leasingExperienceForSpace(space.id);
  if (experience) return <LeasingPropertyTemplate locale={locale} project={getProject(space.project)!} unit={experience.unit} experience={experience.experience} />;
  return <UnitTemplate locale={locale} space={space} />;
}

function UnitTemplate({ locale, space }: { locale: SiteLocale; space: AvailableSpace }) {
  const p = (path: string) => localePath(locale, path);
  const project = getProject(space.project)!;
  const viewing = viewingHref(locale, space);
  const demo = (field: SpaceField) => isDemoField(space, field);
  const more = space.photos.slice(1);
  const others = sortSpaces(publicSpaces.filter((s) => s.id !== space.id)).sort((a, b) => Number(b.project === space.project) - Number(a.project === space.project)).slice(0, 3);
  const reserved = space.status === "RESERVED";
  const when = availabilityOf(space);
  const useList = space.uses.map((key) => labelOfUse(key, locale)).join(" · ");
  const delivery = tenantFit[space.project].capabilities?.delivery;
  const anyDemo = space.dataStatus !== "CONFIRMED" && space.confirmed.length < 13;

  return (
    <PageShell locale={locale} experience mainClassName="lx-unit">
      {/* HEADER — the space in one screen */}
      <section className="lx-unit__head">
        <div className="xp-shell lx-unit__grid">
          <div className="lx-unit__intro" data-reveal>
            <nav className="lx-unit__crumbs" aria-label={t.back[locale]}>
              <Link href={p("/leasing")} className="back-link"><Icon name="left" /> {t.back[locale]}</Link>
              <span>/</span>
              <Link href={p(`/projects/${project.slug}`)}>{project.name}</Link>
              <span>/</span>
              <span>{space.code}</span>
            </nav>
            <AvailabilityChip space={space} locale={locale} />
            <h1 className="lx-unit__title">
              <span>{project.name}</span>
              {space.unit[locale]}
            </h1>
            {spaceArea(space, locale) ? <p className="lx-unit__area">{spaceArea(space, locale)}</p> : null}
            <p className="lx-unit__headline">{space.headline[locale]}</p>
            <div className="xp-actions">
              <Button href={viewing}>{reserved ? t.waitlist[locale] : t.viewing[locale]}</Button>
              <TextLink href={`${p("/leasing")}?use=${space.uses[0]}#advisor`}>{t.fits[locale]}</TextLink>
            </div>
          </div>
          <div className="lx-unit__media" data-reveal>
            <figure className="xp-fig lx-unit__main">
              <SpaceImage photo={space.photos[0]} space={space} locale={locale} sizes="(min-width: 1024px) 55vw, 100vw" priority />
            </figure>
          </div>
        </div>
      </section>

      {/* DATA — every field */}
      <section className="xp-sec xp-sec--warm">
        <div className="xp-shell lx-unit__split">
          <div data-reveal>
            <p className="xp-eyebrow"><span className="xp-eyebrow__no">01</span><span>{t.dataLabel[locale]}</span></p>
            <dl className="lx-data">
              <Row label={t.property[locale]} value={`${project.name} · ${project.district[locale]}`} />
              <Row label={t.unit[locale]} value={`${space.unit[locale]} · ${space.code}`} />
              {spaceArea(space, locale) ? <Row label={t.area[locale]} value={spaceArea(space, locale)!} /> : null}
              <Row label={t.floor[locale]} value={space.floorLabel[locale]} demo={demo("floor")} />
              <Row label={t.use[locale]} value={useList} demo={demo("uses")} />
              <Row label={t.date[locale]} value={when.key === "soon" && when.date ? formatDate(when.date, locale) : t.now[locale]} demo={demo("availableFrom")} />
              <Row label={t.status[locale]} value={reserved ? availabilityCopy.reserved[locale] : t.free[locale]} />
              <Row label={t.parking[locale]} value={space.parking[locale]} demo={demo("parking")} />
              <Row label={t.entrance[locale]} value={space.entrance[locale]} demo={demo("entrance")} />
              <Row label={t.visibility[locale]} value={space.visibility[locale]} demo={demo("visibility")} />
              {delivery ? <Row label={t.delivery[locale]} value={delivery.note[locale]} demo={delivery.status === "DEMO"} /> : null}
            </dl>
            <p className="lx-data__updated">{t.updated[locale]}: {space.updated.split("-").reverse().join(".")} · {space.code}</p>
          </div>
          <div data-reveal>
            <p className="xp-label">{t.featuresLabel[locale]}</p>
            <ol className="xp-numbered">
              {space.highlights.map((line) => (
                <li key={line.en}><h3>{line[locale]}{demo("highlights") ? <DemoMark /> : null}</h3></li>
              ))}
            </ol>
            <p className="xp-label xp-label--gap">{t.techLabel[locale]}</p>
            <dl className="lx-data lx-data--tech">
              <Row label={t.power[locale]} value={space.technical.power[locale]} demo={demo("power")} />
              <Row label={t.ventilation[locale]} value={space.technical.ventilation[locale]} demo={demo("ventilation")} />
              <Row label={t.height[locale]} value={space.technical.height[locale]} demo={demo("height")} />
              <Row label={t.condition[locale]} value={space.technical.condition[locale]} demo={demo("condition")} />
            </dl>
            {anyDemo ? <DemoLegend locale={locale} /> : null}
          </div>
        </div>
      </section>

      {/* PLAN + PHOTOS — the photographs after the hero frame (it is never repeated) */}
      <section className="xp-sec">
        <div className={`xp-shell lx-unit__split lx-unit__split--plan${more.length ? "" : " lx-unit__split--single"}`}>
          <div data-reveal>
            <p className="xp-eyebrow xp-eyebrow--gap"><span className="xp-eyebrow__no">02</span><span>{t.planLabel[locale]}</span></p>
            {demo("plan") ? null : <UnitPlan plan={space.plan} locale={locale} demo={false} title={`${project.name} — ${space.unit[locale]}`} uid={space.id} />}
          </div>
          {more.length ? (
            <div data-reveal>
              <p className="xp-eyebrow xp-eyebrow--gap"><span className="xp-eyebrow__no">03</span><span>{t.photosLabel[locale]}</span></p>
              <div className={`lx-unit__photos${more.length === 2 ? " lx-unit__photos--pair" : ""}`}>
                {more.map((photo, i) => (
                  <figure key={i} className="xp-fig" style={{ "--ratio": more.length === 2 ? "4 / 5" : i === 0 ? "3 / 2" : "4 / 3" } as CSSProperties}>
                    <SpaceImage photo={photo} space={space} locale={locale} sizes="(min-width: 1024px) 30vw, 100vw" />
                  </figure>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </section>

      {/* WHO IT FITS — all ten needs */}
      <section className="xp-sec xp-sec--warm">
        <div className="xp-shell">
          <Opening no="04" label={t.fitLabel[locale]} title={t.fitTitle[locale]} lead={useList} className="xp-opening--split" />
          <ul className="lx-unit__uses" data-reveal>
            {uses.filter((u) => space.uses.includes(u.key)).map((u) => (
              <li key={u.key}><strong>{u.label[locale]}</strong><span>{u.goal[locale]}</span></li>
            ))}
          </ul>
          <div className="xp-cap xp-cap--two" data-reveal>
            {needOrder.map((key) => (
              <div key={key} className="xp-cap__row">
                <span className="xp-cap__label">{needs[key].label[locale]}</span>
                <span className={`xp-cap__level xp-cap__level--${space.fit[key]}`}>
                  {fitCopy[space.fit[key]][locale]}
                  <i aria-hidden="true"><b /><b /><b /></i>
                </span>
                <p className="xp-cap__note">{needs[key].why[locale]}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TECHNICAL SUPPORT + OFFICIAL VERIFICATION (OWNER overnight release §6) */}
      <PropertyTrust slug={space.project} locale={locale} />

      {/* PROCESS */}
      <section className="xp-sec xp-sec--stone xp-sec--tight">
        <div className="xp-shell">
          <p className="xp-eyebrow xp-eyebrow--gap" data-reveal><span className="xp-eyebrow__no">05</span><span>{t.processLabel[locale]}</span></p>
          <ol className="xp-process" style={{ "--n": leasingSteps.length } as CSSProperties} data-reveal>
            {leasingSteps.map((step) => (
              <li key={step.title.en}>
                <h3>{step.title[locale]}</h3>
                <p>{step.text[locale]}</p>
              </li>
            ))}
          </ol>
          <dl className="lx-facts" data-reveal>
            {shown(leasingProcess.reply) ? <div><dt>{t.reply[locale]}</dt><dd><Val point={leasingProcess.reply} locale={locale} /></dd></div> : null}
            {shown(leasingProcess.viewing) ? <div><dt>{t.viewingTime[locale]}</dt><dd><Val point={leasingProcess.viewing} locale={locale} /></dd></div> : null}
            <div><dt>{t.terms[locale]}</dt><dd>{noPrice[locale]}</dd></div>
          </dl>
        </div>
      </section>

      {/* MORE */}
      {others.length ? (
        <section className="xp-sec">
          <div className="xp-shell">
            <div className="lx-unit__more-head" data-reveal>
              <p className="xp-eyebrow"><span className="xp-eyebrow__no">06</span><span>{t.moreLabel[locale]}</span></p>
              <TextLink href={p(`/projects/${project.slug}`)}>{t.projectLink[locale]} · {project.name}</TextLink>
            </div>
            <div className="lx-rail">
              {others.map((other) => (
                <UnitCard key={other.id} space={other} locale={locale} compact />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* CLOSE */}
      <section className="xp-sec xp-sec--ink">
        <div className="xp-shell xp-close">
          <div data-reveal>
            <p className="xp-eyebrow"><span className="xp-eyebrow__no">07</span><span>{project.name} · {space.code}</span></p>
            <h2 className="xp-close__title">{t.closeTitle[locale]}</h2>
            <p className="xp-lead xp-lead--gap xp-lead--light">{t.closeText[locale]}</p>
          </div>
          <div className="xp-actions" data-reveal>
            <Button href={viewing} variant="light">{reserved ? t.waitlist[locale] : t.viewing[locale]}</Button>
            <TextLink href={p("/leasing")} className="tlink--light">{t.back[locale]}</TextLink>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
