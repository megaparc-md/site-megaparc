import { CadastreVerify } from "@/components/leasing/cadastre-verify";
import { Icon } from "@/components/ui";
import { company, contactLinks } from "@/data/demo-content";
import { cadastreNumbers, eCadastruPortal } from "@/data/property-trust";
import type { Localized, SiteLocale } from "@/lib/site-data";

/**
 * TECHNICAL SUPPORT + OFFICIAL VERIFICATION — the reusable leasing trust block (OWNER "OVERNIGHT RELEASE",
 * 2026-11-09 §5 / §6). MEGAPARC has a Technical Director and an Architect: before signing, the tenant can check the
 * space for their business with them. Feasibility first, commercial terms second. No approval or feasibility is
 * promised; the official e-Cadastru verification appears only where the OWNER approved the cadastral number.
 */
const copy = {
  label: { ro: "Suport tehnic pentru chiriaș", ru: "Техническая поддержка арендатора", en: "Technical support for tenants" },
  title: { ro: "Verificați spațiul pentru afacerea dumneavoastră.", ru: "Проверьте помещение под свой бизнес.", en: "Check the space for your business." },
  lead: {
    ro: "Înainte de semnarea contractului puteți discuta spațiul cu directorul tehnic și arhitectul MEGAPARC.",
    ru: "До подписания договора вы можете обсудить помещение с техническим директором и архитектором MEGAPARC.",
    en: "Before signing, you can discuss the space with MEGAPARC's Technical Director and Architect.",
  },
  checks: { ro: "Ce putem evalua împreună", ru: "Что можно оценить вместе", en: "What we can assess together" },
  principle: {
    ro: "Mai întâi verificăm fezabilitatea tehnică — apoi discutăm condițiile comerciale.",
    ru: "Сначала проверяем техническую реализуемость — затем обсуждаем коммерческие условия.",
    en: "First we check technical feasibility — then we discuss commercial terms.",
  },
  note: {
    ro: "Consultația ajută la evaluarea adaptării spațiului; nu înlocuiește autorizațiile și avizele, care se obțin separat, și nu garantează fezabilitatea.",
    ru: "Консультация помогает оценить адаптацию помещения; она не заменяет разрешений и согласований, которые оформляются отдельно, и не гарантирует реализуемость.",
    en: "The consultation helps assess how the space can be adapted; it does not replace permits and approvals, obtained separately, nor guarantee feasibility.",
  },
  discuss: { ro: "Discutați spațiul cu echipa tehnică", ru: "Обсудить помещение с технической командой", en: "Discuss the space with the technical team" },
  call: { ro: "Sunați", ru: "Позвонить", en: "Call" },
} satisfies Record<string, Localized>;

const items: Localized[] = [
  { ro: "Planificarea spațiului", ru: "Планировка", en: "Layout" },
  { ro: "Puterea electrică", ru: "Электрическая мощность", en: "Electrical power" },
  { ro: "Punctele de racordare", ru: "Точки подключения", en: "Connection points" },
  { ro: "Ventilația", ru: "Вентиляция", en: "Ventilation" },
  { ro: "Climatizarea", ru: "Кондиционирование", en: "Air-conditioning" },
  { ro: "Amplasarea echipamentelor", ru: "Размещение оборудования", en: "Equipment placement" },
  { ro: "Accesul", ru: "Доступ", en: "Access" },
  { ro: "Logistica", ru: "Логистика", en: "Logistics" },
  { ro: "Fațada și semnalistica", ru: "Фасад и вывеска", en: "Facade and signage" },
  { ro: "Adaptarea necesară", ru: "Необходимая адаптация", en: "Required adaptation" },
];

export function TechSupport({ locale }: { locale: SiteLocale }) {
  return (
    <div className="tr-tech">
      <div className="tr-tech__head">
        <p className="tr-label">{copy.label[locale]}</p>
        <h2 className="tr-tech__title">{copy.title[locale]}</h2>
        <p className="tr-tech__lead">{copy.lead[locale]}</p>
      </div>
      <div className="tr-tech__body">
        <p className="tr-tech__sub">{copy.checks[locale]}</p>
        <ul className="tr-tech__list">
          {items.map((item) => (
            <li key={item.en}>{item[locale]}</li>
          ))}
        </ul>
        <p className="tr-tech__principle">{copy.principle[locale]}</p>
        <div className="tr-tech__actions">
          <a className="btn" href={contactLinks.email}><span>{copy.discuss[locale]}</span><Icon /></a>
          <a className="pm-link" href={contactLinks.mobile}><span>{copy.call[locale]} · {company.mobile.value[locale]}</span><Icon /></a>
        </div>
        <p className="tr-tech__note">{copy.note[locale]}</p>
      </div>
    </div>
  );
}

/** The leasing trust section of a property: technical support, and the official verification when approved. */
export function PropertyTrust({ slug, locale, tone = "paper" }: { slug: string; locale: SiteLocale; tone?: "paper" | "warm" }) {
  const number = cadastreNumbers[slug];
  return (
    <section className={`tr-sec tr-sec--${tone}`} id="technical-support">
      <div className={`xp-shell tr-grid${number ? "" : " tr-grid--single"}`}>
        <TechSupport locale={locale} />
        {number ? <CadastreVerify number={number} portal={eCadastruPortal} locale={locale} /> : null}
      </div>
    </section>
  );
}
