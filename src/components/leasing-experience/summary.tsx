import type { CSSProperties } from "react";
import { formatAreaExact } from "@/content/source";
import { withArea } from "@/components/leasing-experience/parts";
import { T, publishable, type LeasingExperience } from "@/data/leasing-experience-model";
import type { TemplateOffer } from "@/components/leasing-experience/offer";
import type { SiteLocale } from "@/lib/site-data";

/**
 * SUMMARY CARDS (OWNER "PREMIUM CARD SYSTEM & AIR PASS", 2026-11-09, §7) —
 * three compact cards right after the navigation: ГОТОВНОСТЬ · ВИДИМОСТЬ ·
 * ЭТАЖНОСТЬ. No new facts: each card repeats an existing confirmed line —
 * readiness — the core capital works and the tenant's adaptation (OWNER copy
 * correction 2026-11-10), visibility from the first-line wording of the photographs and
 * the confirmed glazing argument of the lens, the levels and their areas from
 * the unit record (M20-01).
 */

/** the decisive phrase of the readiness explanation, set strong (OWNER art-direction pass §7) */
const emphasis: Record<SiteLocale, string[]> = {
  ru: ["адаптации помещения под собственный формат"],
  ro: ["adaptarea spațiului la propriul format"],
  en: ["adapting the premises to its own format"],
};

const copy = {
  // OWNER copy correction 2026-11-10 (capex / tenant investment): the core capital works are done; the tenant invests primarily in adapting the space
  readiness: { label: T("Pregătire", "Готовность", "Readiness"), title: T("Infrastructura de bază este pregătită", "Базовая инфраструктура уже готова", "Base infrastructure in place"), text: T("Investiția chiriașului vizează în primul rând adaptarea spațiului la propriul format.", "Инвестиции арендатора — прежде всего в адаптацию пространства под свой формат.", "The tenant’s investment goes primarily into adapting the space to its format.") },
  visibility: { label: T("Vizibilitate", "Видимость", "Visibility"), title: T("Prima linie", "Первая линия", "First line") },
  levels: { label: T("Niveluri", "Этажность", "Levels"), title: (n: number, locale: SiteLocale) => (locale === "ru" ? `${n} уровня` : locale === "ro" ? `${n} niveluri` : `${n} levels`) },
};

export function SummaryCards({ x, offer, locale }: { x: LeasingExperience; offer: TemplateOffer; locale: SiteLocale }) {
  const floors = offer.breakdown.filter((level) => level.key !== "terrace");
  const glazing = x.lens.formats.find((format) => format.key === "retail")?.evidence.find((item) => item.ref === "photos" && publishable(item.evidence));
  // a dataset with its own confirmed lines (Moscova 9 · Dacia 31 · Creangă 78) — the master computes them from the unit record
  const cards = x.summary ? x.summary.map((card) => ({ key: card.key, label: card.label[locale], title: withArea(card.title[locale], offer.figure), text: withArea(card.text[locale], offer.figure) })) : [
    { key: "readiness", label: copy.readiness.label[locale], title: copy.readiness.title[locale], text: copy.readiness.text[locale] },
    { key: "visibility", label: copy.visibility.label[locale], title: copy.visibility.title[locale], text: glazing?.text[locale] ?? "" },
    { key: "levels", label: copy.levels.label[locale], title: copy.levels.title(floors.length, locale), text: floors.map((level) => `${level.label[locale]} ${formatAreaExact(level.area, locale)}`).join(" · ") },
  ];
  // OWNER «REAL PREMIUM ART-DIRECTION PASS» §7 (2026-11-11): a two-line hero support = the readiness statement scene — the key thought
  // dominant on the left, the explanation on the right with its decisive phrase strong; never another paragraph in a content column
  const [statement, explanation] = x.hero.support[locale].split("\n");
  // the RU copy carries no-break spaces (typesetting rule): match the phrase space-insensitively, then slice the original text
  const plain = explanation ? explanation.replace(/ /g, " ") : "";
  const phrase = emphasis[locale].find((p) => plain.includes(p));
  const at = phrase ? plain.indexOf(phrase) : -1;
  const parts = explanation && phrase && at >= 0 ? [explanation.slice(0, at), explanation.slice(at, at + phrase.length), explanation.slice(at + phrase.length)] : null;
  return (
    <section className="lg-summary" aria-label={x.reasons.label[locale]}>
      {explanation ? (
        <div className="xp-shell lg-ready" data-reveal>
          <p className="lg-ready__statement">{statement}</p>
          <p className="lg-ready__support">
            {parts ? <>{parts[0]}<strong>{parts[1]}</strong>{parts[2]}</> : explanation}
          </p>
        </div>
      ) : null}
      <ul className="xp-shell lg-summary__list">
        {cards.map((card, i) => (
          <li key={card.key} className={`lg-card lg-summary__card is-${card.key}`} data-reveal style={{ "--i": i } as CSSProperties}>
            <p className="lg-card__label"><span>{String(i + 1).padStart(2, "0")}</span>{card.label}</p>
            <p className="lg-summary__title">{card.title}</p>
            {card.text ? <p className="lg-summary__text">{card.text}</p> : null}
          </li>
        ))}
      </ul>
    </section>
  );
}
