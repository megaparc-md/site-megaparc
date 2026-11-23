import type { CSSProperties } from "react";
import Link from "next/link";
import { Accent } from "@/components/accent";
import { LgPhoto, ui } from "@/components/leasing-experience/parts";
import { LocationMap } from "@/components/location-section";
import { PageShell } from "@/components/page-shell";
import { Icon } from "@/components/ui";
import { availabilityOf, formatArea, formatDate, getProject, isDemoField, publicSpaces, sortSpaces, type ProjectEntry } from "@/content/source";
import { company, contactLinks } from "@/data/demo-content";
import { dacia31Catalog, catalogVisible } from "@/data/dacia-31-spaces";
import type { LeasingExperience } from "@/data/leasing-experience-model";
import { mailHref } from "@/lib/contact-mail";
import { localePath, type Localized, type SiteLocale } from "@/lib/site-data";

/**
 * THE OPERATING-PROPERTY PAGE — OWNER «PROPERTY COMMERCIAL EXPERIENCE 2026» Part A (2026-11-23).
 * Creangă 78 and Moscova 9 are let: the page is short and premium — the photograph, the name and the address, the status
 * «Сдан в аренду», the confirmed key facts, a short description, the gallery (real photographs, never the hero frame again), the
 * location, and the way to the spaces MEGAPARC has free now. No business scenarios, no calculators, no offer to lease an occupied
 * space. A confirmed future vacancy (Moscova 9: the ground floor from 1 January 2027) is shown apart, with its confirmed date only.
 * URL, metadata (projectMetadata), the property facts and its history are unchanged; the leasing dataset stays in the repository.
 */

const copy = {
  back: { ro: "Proiecte", ru: "Проекты", en: "Projects" },
  facts: { ro: "Date confirmate", ru: "Подтверждённые данные", en: "Confirmed facts" },
  gallery: { ro: "Imobilul astăzi", ru: "Объект сегодня", en: "The property today" },
  location: { ro: "Locația", ru: "Локация", en: "Location" },
  route: { ro: "Planificați traseul", ru: "Построить маршрут", en: "Get directions" },
  free: { ro: "Spații MEGAPARC disponibile acum", ru: "Свободные помещения MEGAPARC", en: "MEGAPARC spaces available now" },
  freeLead: {
    ro: "Acest imobil este închiriat. Iată ce poate fi închiriat acum în alte proprietăți MEGAPARC.",
    ru: "Этот объект сдан в аренду. Вот что можно арендовать сейчас в других объектах MEGAPARC.",
    en: "This property is let. Here is what can be leased now in other MEGAPARC properties.",
  },
  all: { ro: "Toate spațiile disponibile", ru: "Все свободные помещения", en: "All available spaces" },
  see: { ro: "Vedeți obiectul", ru: "Смотреть объект", en: "View the property" },
  count: { ro: "spații libere: ", ru: "свободных помещений: ", en: "free spaces: " },
  now: { ro: "Disponibil acum", ru: "Свободно сейчас", en: "Available now" },
  soon: { ro: "Disponibil de la", ru: "Освобождается", en: "Available from" },
  contact: { ro: "Întrebări despre imobil", ru: "Вопросы об объекте", en: "Questions about the property" },
  contactLead: { ro: "Scrieți-ne sau sunați — vă răspundem direct.", ru: "Напишите или позвоните — ответим напрямую.", en: "Write or call — we answer directly." },
  d31: { ro: "Birouri, cabinete și suprafețe comerciale mari", ru: "Офисы, кабинеты и крупные коммерческие площади", en: "Offices, cabinets and large commercial floors" },
} satisfies Record<string, Localized>;

type Free = { key: string; name: string; href: string; what: string; status: string };

/** the spaces MEGAPARC has free elsewhere — derived from the register (and the Dacia 31 catalogue where it is shown), never typed */
function freeElsewhere(slug: string, locale: SiteLocale): Free[] {
  const units: Free[] = sortSpaces(publicSpaces.filter((space) => space.project !== slug)).map((space) => {
    const a = availabilityOf(space);
    const project = getProject(space.project);
    return {
      key: space.id,
      name: project?.name ?? space.project,
      href: `${localePath(locale, `/projects/${space.project}`)}/`,
      // an area that is not confirmed is never shown (Moscova 9: the ground floor, area on request)
      what: isDemoField(space, "area") ? space.unit[locale] : `${space.unit[locale]} · ${formatArea(space.area, locale)}`,
      status: a.key === "soon" && a.date ? `${copy.soon[locale]} ${formatDate(a.date, locale)}` : copy.now[locale],
    };
  });
  if (slug !== "dacia-31" && catalogVisible()) {
    const free = dacia31Catalog.spaces.filter((space) => space.status === "AVAILABLE_NOW");
    if (free.length) units.push({ key: "dacia-31", name: "Dacia 31", href: `${localePath(locale, "/projects/dacia-31")}/`, what: `${copy.d31[locale]} · ${copy.count[locale]}${free.length}`, status: copy.now[locale] });
  }
  // the property's own confirmed future vacancy is shown in its own block, never in this list
  return units;
}

export function OperatingPropertyPage({ locale, project, x }: { locale: SiteLocale; project: ProjectEntry; x: LeasingExperience }) {
  const op = x.operating!;
  const free = freeElsewhere(project.slug, locale);
  const future = op.future;
  const interest = future
    ? mailHref(`${project.name} — ${future.title[locale]}`, {
        ro: [`Bună ziua! Sunt interesat(ă) de ${project.name} (${future.title.ro}, de la ${formatDate(future.date, "ro")}).`, "", "Compania și domeniul de activitate:", "Suprafața necesară:", "Telefon de contact:"],
        ru: [`Здравствуйте! Интересует ${project.name} (${future.title.ru}, с ${formatDate(future.date, "ru")}).`, "", "Компания и вид деятельности:", "Нужная площадь:", "Телефон для связи:"],
        en: [`Hello, I am interested in ${project.name} (${future.title.en}, from ${formatDate(future.date, "en")}).`, "", "Company and line of business:", "Space needed:", "Contact telephone:"],
      }[locale])
    : null;
  return (
    <PageShell locale={locale} experience mainClassName={`lg-page op-page op-page--${x.project}`}>
      <section className="lg-hero op-hero" aria-labelledby="op-title">
        <div className="xp-shell lg-hero__grid">
          <div className="lg-hero__text">
            <Link href={`${localePath(locale, "/projects")}/`} className="pp2-back lg-hero__back"><Icon name="left" /> {copy.back[locale]}</Link>
            <p className="lg-hero__place lg-rise" style={{ "--d": 0 } as CSSProperties}>{x.hero.place[locale]}</p>
            <h1 className="lg-hero__h1" id="op-title">
              <span className="lg-hero__name lg-rise" style={{ "--d": 1 } as CSSProperties}>{project.name}</span>
              <span className="lg-hero__title lg-rise" style={{ "--d": 2 } as CSSProperties}><Accent text={op.title[locale]} /></span>
            </h1>
            <p className="op-hero__address lg-rise" style={{ "--d": 3 } as CSSProperties}>{x.address[locale]}</p>
            <p className="lg-hero__status op-hero__status is-full lg-rise" style={{ "--d": 3 } as CSSProperties}><i aria-hidden="true" />{op.status[locale]}</p>
            <p className="lg-hero__support op-hero__lead lg-rise" style={{ "--d": 4 } as CSSProperties}>{op.lead[locale]}</p>
            <div className="lg-hero__actions lg-rise" style={{ "--d": 5 } as CSSProperties}>
              {free.length ? <a className="btn" href="#free"><span>{copy.free[locale]}</span><Icon /></a> : null}
              {future ? <a className="pm-link" href="#future"><span>{future.link[locale]}</span><Icon /></a> : null}
            </div>
          </div>
          <figure className="lg-hero__media" data-depth="10">
            <LgPhoto photo={x.photos[x.hero.photo]} phone={x.photos[x.hero.phonePhoto]} locale={locale} priority sizes="(min-width: 1024px) 64vw, 100vw" className="lg-hero__photo" />
          </figure>
        </div>
      </section>

      <section className="lg-sec op-facts" aria-labelledby="op-facts-title">
        <div className="xp-shell">
          <p className="lg-label" id="op-facts-title">{copy.facts[locale]}</p>
          <dl className="op-facts__list">
            {op.facts.map((fact) => (
              <div key={fact.key} className="op-fact">
                <dt>{fact.label[locale]}</dt>
                <dd>
                  <strong>{fact.value[locale]}</strong>
                  {fact.note ? <span>{fact.note[locale]}</span> : null}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {future ? (
        <section id="future" className="lg-sec op-future" aria-labelledby="op-future-title">
          <div className="xp-shell op-future__grid">
            <div>
              <p className="lg-label">{future.kicker[locale]}</p>
              <h2 className="op-future__title" id="op-future-title">{future.title[locale]}</h2>
              <p className="op-future__date"><span>{copy.soon[locale]}</span> <strong>{formatDate(future.date, locale)}</strong></p>
            </div>
            <div className="op-future__side">
              <p className="op-future__text">{future.text[locale]}</p>
              {interest ? <a className="btn" href={interest} data-intent="early-interest"><span>{future.action[locale]}</span><Icon /></a> : null}
            </div>
          </div>
        </section>
      ) : null}

      {op.gallery.length ? (
        <section className="lg-sec op-gallery" aria-labelledby="op-gallery-title">
          <div className="xp-shell">
            <p className="lg-label" id="op-gallery-title">{copy.gallery[locale]}</p>
            <ul className={`op-gallery__list is-${op.gallery.length}`}>
              {op.gallery.map((item) => (
                <li key={item.photo}>
                  <figure>
                    <LgPhoto photo={x.photos[item.photo]} locale={locale} sizes="(min-width: 1024px) 50vw, 100vw" className="op-gallery__photo" />
                    <figcaption>{item.caption[locale]}</figcaption>
                  </figure>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      <section id="location" className="lg-sec op-location" aria-labelledby="op-location-title">
        <div className="xp-shell op-location__grid">
          <div>
            <p className="lg-label">{copy.location[locale]}</p>
            <h2 className="op-location__title" id="op-location-title">{x.motion.title[locale]}</h2>
            <p className="op-location__text">{x.motion.addressText?.[locale] ?? x.location.lead[locale]}</p>
          </div>
          <LocationMap locale={locale} mapKey={project.slug} name={project.name} place={x.hero.place[locale]} className="op-location__map" />
        </div>
      </section>

      {free.length ? (
        <section id="free" className="lg-sec op-free" aria-labelledby="op-free-title">
          <div className="xp-shell">
            <p className="lg-label">{ui.leasing[locale]}</p>
            <h2 className="op-free__title" id="op-free-title">{copy.free[locale]}</h2>
            <p className="op-free__lead">{copy.freeLead[locale]}</p>
            <ul className="op-free__list">
              {free.map((item) => (
                <li key={item.key}>
                  <Link href={item.href} className="op-free__card">
                    <span className="op-free__status"><i aria-hidden="true" />{item.status}</span>
                    <strong>{item.name}</strong>
                    <span>{item.what}</span>
                    <span className="op-free__see">{copy.see[locale]} <Icon /></span>
                  </Link>
                </li>
              ))}
            </ul>
            <p className="op-free__all"><Link className="pm-link" href={`${localePath(locale, "/leasing")}/`}><span>{copy.all[locale]}</span><Icon /></Link></p>
          </div>
        </section>
      ) : null}

      <section className="lg-sec op-contact" aria-labelledby="op-contact-title">
        <div className="xp-shell op-contact__grid">
          <h2 className="op-contact__title" id="op-contact-title">{copy.contact[locale]}</h2>
          <div>
            <p>{copy.contactLead[locale]}</p>
            <p className="op-contact__links">
              <a href={contactLinks.email}>{company.email.value[locale]}</a>
              <a href={contactLinks.mobile}>{company.mobile.value[locale]}</a>
              <a href={contactLinks.landline}>{company.landline.value[locale]}</a>
            </p>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
