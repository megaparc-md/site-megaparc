import Link from "next/link";
import { InvestInputs } from "@/components/invest-qa";
import type { CSSProperties } from "react";
import { ConceptImage, MaskTitle, Opening, hasConceptImage } from "@/components/experience";
import { EnquiryFormBlock } from "@/components/journey-blocks";
import { PageShell } from "@/components/page-shell";
import { ArtImage } from "@/components/primitives";
import { Button, Icon, TextLink } from "@/components/ui";
import { getProject } from "@/content/source";
import { acquisitionTypes, geography } from "@/lib/business";
import { localePath, type SiteLocale } from "@/lib/site-data";

const N = " ";

/**
 * OFFER A PROPERTY — MEGAPARC buys real estate and land (OWNER correction
 * 2026-10-08; journey C: "I have land for sale — can I understand that
 * MEGAPARC buys / develops land and submit it?").
 * What we buy → what we check → the owner compass (sell · develop together ·
 * not sure) → a real example → the process → the form (property subject only).
 * Nothing here offers to manage someone else's property.
 */
const copy = {
  ro: {
    label: "Propune un obiect",
    title: ["Propuneți un imobil", "sau un teren."],
    lead: "Analizăm proiecte în care putem crea valoare prin investiție, dezvoltare și exploatare ulterioară.",
    send: "Trimite obiectul",
    how: "Ce verificăm",
    buyLabel: "Ce cumpărăm",
    buyTitle: "Patru tipuri de obiecte.",
    checkLabel: "Ce verificăm",
    checkTitle: "Șase întrebări înainte de orice ofertă.",
    compassLabel: "Situația dumneavoastră",
    compassTitle: "Ce aveți — și ce verificăm mai întâi.",
    processLabel: "Cum decurge",
    processTitle: "De la primul mesaj la decizie.",
    steps: [["Trimiteți obiectul", "Adresa, suprafața, documentele pe care le aveți."], ["Prima discuție", "Vă sună persoana care evaluează obiectul."], ["Vizita și documentele", "Pe obiect; materialele se schimbă sub acord de confidențialitate."], ["Evaluarea", "Juridic, tehnic, piață — și ce poate deveni obiectul."], ["Decizia", "O ofertă argumentată sau un răspuns clar."]],
    reply: "Primul răspuns",
    mailbox: "Propunerile ajung la",
    formLabel: "Formular",
    formTitle: "Descrieți obiectul.",
    closeLabel: "Altceva?",
    closeTitle: "Dacă întrebarea e alta.",
    routes: [["Spații libere", "/leasing#available"], ["Proiectele noastre", "/projects"], ["Parteneriat investițional", "/partnership"], ["Vezi posturile", "/careers#positions"]],
  },
  ru: {
    label: "Предложить объект",
    title: ["Предложите объект", "или земельный участок."],
    lead: `Мы рассматриваем проекты, где можем создать стоимость через инвестиции, развитие и${N}последующую эксплуатацию.`,
    send: "Отправить объект",
    how: "Что мы проверяем",
    buyLabel: "Что покупаем",
    buyTitle: "Четыре типа объектов.",
    checkLabel: "Что проверяем",
    checkTitle: "Шесть вопросов до любого предложения.",
    compassLabel: "Ваша ситуация",
    compassTitle: `Что у вас есть — и что мы проверим в первую очередь.`,
    processLabel: "Как это происходит",
    processTitle: "От первого сообщения до решения.",
    steps: [["Отправьте объект", "Адрес, площадь, документы, которые есть."], ["Первый разговор", "Звонит тот, кто оценивает объект."], ["Выезд и документы", "На объекте; материалы — под соглашение о конфиденциальности."], ["Оценка", "Право, техника, рынок — и чем объект может стать."], ["Решение", "Аргументированное предложение или ясный ответ."]],
    reply: "Первый ответ",
    mailbox: "Предложения получает",
    formLabel: "Форма",
    formTitle: "Опишите объект.",
    closeLabel: "Другое?",
    closeTitle: "Если вопрос другой.",
    routes: [["Свободные помещения", "/leasing#available"], ["Наши проекты", "/projects"], ["Инвестиционное партнёрство", "/partnership"], ["Смотреть вакансии", "/careers#positions"]],
  },
  en: {
    label: "Offer a property",
    title: ["Offer a property", "or a land plot."],
    lead: "We consider projects where we can create value through investment, development and subsequent operation.",
    send: "Send the property",
    how: "What we check",
    buyLabel: "What we buy",
    buyTitle: "Four kinds of property.",
    checkLabel: "What we check",
    checkTitle: "Six questions before any offer.",
    compassLabel: "Your situation",
    compassTitle: "What you have — and what we check first.",
    processLabel: "How it works",
    processTitle: "From the first message to a decision.",
    steps: [["Send the property", "Address, area, the documents you have."], ["A first call", "From the person who assesses the property."], ["Site visit and documents", "On site; materials exchanged under a confidentiality agreement."], ["Assessment", "Legal, technical, market — and what the property could become."], ["Decision", "A reasoned offer or a clear answer."]],
    reply: "First reply",
    mailbox: "Offers go to",
    formLabel: "Form",
    formTitle: "Describe the property.",
    closeLabel: "Something else?",
    closeTitle: "If your question is a different one.",
    routes: [["Available spaces", "/leasing#available"], ["Our projects", "/projects"], ["Investment partnership", "/partnership"], ["See vacancies", "/careers#positions"]],
  },
} as const;

const inputsTitle: Record<SiteLocale, string> = { ro: "Ce informații sunt utile?", ru: "Какая информация полезна?", en: "What information is useful?" };

export function OfferPage({ locale }: { locale: SiteLocale }) {
  const c = copy[locale];
  const p = (path: string) => localePath(locale, path);

  return (
    <PageShell locale={locale} variant="overlay" experience mainClassName="of-page">
      {/* HERO */}
      <section className="xp-hero xp-hero--page" data-xp-hero>
        <div className="xp-hero__media">
          <div className="xp-hero__frame is-active">
            <ArtImage media={getProject("vatra")!.media!} alt="" priority position="50% 62%" />
          </div>
        </div>
        <div className="xp-hero__veil" aria-hidden="true" />
        <div className="xp-shell xp-hero__copy">
          <span className="xp-flag xp-flag--light">{c.label}</span>
          <MaskTitle as="h1" className="xp-hero__title" lines={[...c.title]} />
          <p className="xp-hero__lead">{c.lead}</p>
          <div className="xp-actions">
            <Button href="#form" variant="light">{c.send}</Button>
            <TextLink href="#check" className="tlink--light">{c.how}</TextLink>
          </div>
        </div>
      </section>

      {/* WHAT WE BUY */}
      <section className="xp-sec">
        <div className="xp-shell">
          <Opening no="01" label={c.buyLabel} title={c.buyTitle} lead={geography.text[locale]} className="xp-opening--split" />
          <div className="of-buy">
            <ol className="of-buy__list">
              {acquisitionTypes.map((type, index) => (
                <li key={type.key} data-reveal>
                  <span className="of-buy__no">{String(index + 1).padStart(2, "0")}</span>
                  <h3>{type.title[locale]}</h3>
                  <p>{type.text[locale]}</p>
                </li>
              ))}
            </ol>
            {/* production edition: no concept visual here (OWNER "PRODUCTION V1" §3) — the frame is not rendered */}
            {hasConceptImage("offer.land") ? (
              <figure className="xp-fig of-buy__figure" style={{ "--ratio": "4 / 5" } as CSSProperties} data-reveal>
                <ConceptImage id="offer.land" locale={locale} sizes="(min-width: 1024px) 40vw, 100vw" />
              </figure>
            ) : null}
          </div>
        </div>
      </section>

      {/* USEFUL MATERIALS — the practical checklist (OWNER overnight release §14); no invented criteria, no process steps */}
      <section className="xp-sec xp-sec--stone iq-sec" id="check">
        <div className="xp-shell iq-row iq-row--solo">
          <h2 className="iq-q">{inputsTitle[locale]}</h2>
          <div className="iq-a">
            <InvestInputs locale={locale} />
          </div>
        </div>
      </section>

      {/* FORM */}
      <section className="xp-sec xp-sec--warm" id="form">
        <div className="xp-shell">
          <Opening no="05" label={c.formLabel} title={c.formTitle} />
          <EnquiryFormBlock locale={locale} initial="property" only={["property"]} />
        </div>
      </section>

      {/* CLOSE */}
      <section className="xp-sec xp-sec--ink">
        <div className="xp-shell xp-close">
          <div data-reveal>
            <p className="xp-eyebrow"><span className="xp-eyebrow__no">06</span><span>{c.closeLabel}</span></p>
            <h2 className="xp-close__title">{c.closeTitle}</h2>
          </div>
          <nav className="xp-close__routes" aria-label={c.closeLabel} data-reveal>
            {c.routes.map(([label, path]) => (
              <Link key={path} href={p(path)}>
                {label}
                <Icon name="arrow" size={18} />
              </Link>
            ))}
          </nav>
        </div>
      </section>
    </PageShell>
  );
}
