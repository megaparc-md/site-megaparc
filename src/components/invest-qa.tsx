import Link from "next/link";
import { DirectContact } from "@/components/direct-contact";
import { Icon } from "@/components/ui";
import { localePath, type Localized, type SiteLocale } from "@/lib/site-data";

/**
 * INVESTMENT DIRECTION — the questions a partner really asks (OWNER "OVERNIGHT RELEASE", 2026-11-09 §11–§14).
 * Editorial Q&A, deliberately not numbered (no invented process). Content only from OWNER material: what MEGAPARC
 * considers (§12), the useful inputs (§14), the six assessment disciplines and the partner audiences approved
 * earlier (premium phase 2 / trust copy patch, 2026-10-09), the legal note. No criteria or figures are invented.
 */
const N = " ";
const q = {
  consider: { ro: "Ce analizează MEGAPARC?", ru: "Что рассматривает MEGAPARC?", en: "What does MEGAPARC consider?" },
  considerLine: {
    ro: "Analizăm proiecte în care putem crea valoare prin investiție, dezvoltare și exploatare ulterioară.",
    ru: `Мы рассматриваем проекты, где можем создать стоимость через инвестиции, развитие и${N}последующую эксплуатацию.`,
    en: "We consider projects where we can create value through investment, development and subsequent operation.",
  },
  inputs: { ro: "Ce informații sunt utile?", ru: "Какая информация полезна?", en: "What information is useful?" },
  inputsNote: {
    ro: "Nu este necesar totul de la început. Cu cât sunt mai multe date inițiale, cu atât mai repede putem înțelege dacă are sens să continuăm discuția.",
    ru: `Всё сразу не${N}обязательно. Чем больше исходных данных, тем быстрее мы сможем понять, имеет ли смысл продолжать обсуждение.`,
    en: "Not everything is needed at once. The more initial data, the faster we can tell whether it makes sense to continue the discussion.",
  },
  assess: { ro: "Cum are loc evaluarea inițială?", ru: "Как проходит первичная оценка?", en: "How does the initial assessment work?" },
  assessLine: {
    ro: "Privim obiectul din șase perspective — ca pe un viitor activ propriu.",
    ru: `Мы смотрим на${N}объект с${N}шести сторон — как на${N}собственный будущий актив.`,
    en: "We look at the property from six sides — as at our own future asset.",
  },
  involve: { ro: "Ce poate include un parteneriat?", ru: "Что может включать партнёрство?", en: "What can a partnership involve?" },
  next: { ro: "Ce urmează?", ru: "Что дальше?", en: "What happens next?" },
  nextLine: {
    ro: "Scrieți-ne sau sunați — materialele despre obiect pot fi trimise prin e-mail.",
    ru: `Напишите или позвоните — материалы по${N}объекту можно прислать на${N}e‑mail.`,
    en: "Write or call — the materials on the property can be sent by e-mail.",
  },
} satisfies Record<string, Localized>;

const considered: Localized[] = [
  { ro: "Imobiliare comerciale existente", ru: "Существующая коммерческая недвижимость", en: "Existing commercial real estate" },
  { ro: "Terenuri", ru: "Земельные участки", en: "Land" },
  { ro: "Redezvoltare și reconstrucție", ru: "Редевелопмент и реконструкция", en: "Redevelopment and reconstruction" },
  { ro: "Proiecte comune", ru: "Совместные проекты", en: "Joint projects" },
  { ro: "Tranzacții imobiliare structurate", ru: "Структурированные сделки с недвижимостью", en: "Structured property opportunities" },
];

const inputs: Localized[] = [
  { ro: "Amplasarea", ru: "Расположение", en: "Location" },
  { ro: "Numărul cadastral", ru: "Кадастровый номер", en: "Cadastral number" },
  { ro: "Suprafața terenului și a clădirilor", ru: "Площадь земли и зданий", en: "Land and building area" },
  { ro: "Fotografii", ru: "Фотографии", en: "Photographs" },
  { ro: "Dreptul de proprietate", ru: "Права собственности", en: "Ownership" },
  { ro: "Utilizarea actuală", ru: "Текущее использование", en: "Current use" },
  { ro: "Prețul, dacă este stabilit", ru: "Цена, если она определена", en: "Asking price, if available" },
  { ro: "Documentația de urbanism", ru: "Градостроительная документация", en: "Planning documents" },
  { ro: "Rețelele inginerești", ru: "Инженерные сети", en: "Utilities" },
  { ro: "Chiriașii și contractele de locațiune", ru: "Арендаторы и договоры аренды", en: "Occupancy and leases" },
];

/** The useful materials — the practical checklist (Partnership and Offer). */
export function InvestInputs({ locale, title }: { locale: SiteLocale; title?: string }) {
  return (
    <div className="iq-inputs">
      {title ? <h2 className="iq-inputs__title">{title}</h2> : null}
      <ul className="iq-list iq-list--two">
        {inputs.map((item) => (
          <li key={item.en}>{item[locale]}</li>
        ))}
      </ul>
      <p className="iq-note">{q.inputsNote[locale]}</p>
    </div>
  );
}

type Partner = readonly [string, string, string];

export function InvestQA({ locale, checks, partners, coop, legal }: { locale: SiteLocale; checks: readonly (readonly [string, string])[]; partners: readonly Partner[]; coop: { title: string; text: string; cta: string; to: string }; legal: string }) {
  const p = (path: string) => localePath(locale, path);
  const href = (to: string) => (to.startsWith("/") ? p(to) : to);
  return (
    <section className="iq" id="questions">
      <div className="xp-shell">
        <div className="iq-row" data-reveal>
          <h2 className="iq-q">{q.consider[locale]}</h2>
          <div className="iq-a">
            <p className="iq-lead">{q.considerLine[locale]}</p>
            <ul className="iq-list">
              {considered.map((item) => (
                <li key={item.en}>{item[locale]}</li>
              ))}
            </ul>
          </div>
        </div>
        <div className="iq-row" data-reveal>
          <h2 className="iq-q">{q.inputs[locale]}</h2>
          <div className="iq-a">
            <InvestInputs locale={locale} />
          </div>
        </div>
        <div className="iq-row" data-reveal>
          <h2 className="iq-q">{q.assess[locale]}</h2>
          <div className="iq-a">
            <p className="iq-lead">{q.assessLine[locale]}</p>
            <dl className="iq-checks">
              {checks.map(([title, text]) => (
                <div key={title}>
                  <dt>{title}</dt>
                  <dd>{text}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
        <div className="iq-row" data-reveal>
          <h2 className="iq-q">{q.involve[locale]}</h2>
          <div className="iq-a">
            <ul className="iq-partners">
              {partners.map(([title, text, to]) => (
                <li key={title}>
                  <Link href={href(to)}>
                    <span className="iq-partners__title">{title}</span>
                    <span className="iq-partners__text">{text}</span>
                    <Icon name="arrow" size={18} />
                  </Link>
                </li>
              ))}
            </ul>
            <p className="iq-coop"><b>{coop.title}.</b> {coop.text} <Link className="pm-link" href={href(coop.to)}>{coop.cta}<Icon /></Link></p>
          </div>
        </div>
        <div className="iq-row iq-row--last" data-reveal>
          <h2 className="iq-q">{q.next[locale]}</h2>
          <div className="iq-a">
            <p className="iq-lead">{q.nextLine[locale]}</p>
            <DirectContact locale={locale} subject="partnership" title={null} note={null} />
            <p className="iq-legal">{legal}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
