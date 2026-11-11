import { R3Label } from "@/components/r3";
import { productionOperators } from "@/data/operators";
import type { Localized, SiteLocale } from "@/lib/site-data";

/**
 * OPERATOR PROOF — the public band of operator brands in MEGAPARC buildings (OWNER «OPERATOR PROOF SYSTEM» + «THIRD-PARTY
 * BRAND SAFETY LOCK», 2026-11-11). It reads `productionOperators` only: a brand appears when the OWNER verified the relationship,
 * written brand permission is recorded AND the OWNER switched public display on. Today that set is empty, so the component
 * returns null everywhere it is placed — no gap, no placeholder, no typographic stand-in. The composition proposed for the OWNER
 * is the non-public concept in docs/qa/2026-11-11-operator-proof-concept/ (private repository). Nothing here ever states a lease
 * term, rent, turnover, exclusivity or partnership; a property is named under a brand only when the OWNER assigned it.
 */
const copy = {
  label: { ro: "Operatori în clădirile MEGAPARC", ru: "Операторы в зданиях MEGAPARC", en: "Operators in MEGAPARC buildings" },
  title: {
    ro: "Mărci care operează în proprietățile noastre.",
    ru: "Бренды, которые работают в наших зданиях.",
    en: "Brands operating in our buildings.",
  },
  note: {
    ro: "Operatori confirmați de proprietar. Fără condiții comerciale, fără declarații de parteneriat.",
    ru: "Операторы подтверждены собственником. Без коммерческих условий и заявлений о партнёрстве.",
    en: "Operators confirmed by the owner. No commercial terms, no partnership claims.",
  },
} satisfies Record<string, Localized>;

export function OperatorProof({ locale, tone = "ivory" }: { locale: SiteLocale; tone?: "ivory" | "paper" }) {
  if (!productionOperators.length) return null;
  return (
    <section className={`r3-sec r3-sec--${tone} op-proof`} id="operators" aria-labelledby="operators-title">
      <div className="r3-shell op-proof__grid">
        <div className="op-proof__head" data-reveal>
          <R3Label>{copy.label[locale]}</R3Label>
          <h2 className="r3-title op-proof__title" id="operators-title">{copy.title[locale]}</h2>
          <p className="r3-note">{copy.note[locale]}</p>
        </div>
        <ul className="op-proof__list" data-reveal>
          {productionOperators.map((entry) => (
            <li key={entry.key} className="op-proof__item">
              {entry.logo ? (
                // eslint-disable-next-line @next/next/no-img-element -- permitted brand file, fixed box, no optimisation pass
                <img className="op-proof__logo" src={entry.logo} alt={entry.name} loading="lazy" decoding="async" />
              ) : (
                <span className="op-proof__name">{entry.name}</span>
              )}
              {entry.property ? <small className="op-proof__where">{entry.property.name[locale]}</small> : null}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
