import type { CSSProperties } from "react";
import { formatAreaExact } from "@/content/source";
import { T, publishable, type LeasingExperience } from "@/data/leasing-experience-model";
import type { AvailableSpace } from "@/data/leasing-inventory";
import type { SiteLocale } from "@/lib/site-data";

/**
 * SUMMARY CARDS (OWNER "PREMIUM CARD SYSTEM & AIR PASS", 2026-11-09, §7) —
 * three compact cards right after the navigation: ГОТОВНОСТЬ · ВИДИМОСТЬ ·
 * ЭТАЖНОСТЬ. No new facts: each card repeats an existing confirmed line —
 * readiness from the capital base («Основные капитальные работы уже
 * выполнены.»), visibility from the first-line wording of the photographs and
 * the confirmed glazing argument of the lens, the levels and their areas from
 * the unit record (M20-01).
 */

const copy = {
  readiness: { label: T("Pregătire", "Готовность", "Readiness"), title: T("Baza capitală este gata", "Капитальная база готова", "The capital base is in place") },
  visibility: { label: T("Vizibilitate", "Видимость", "Visibility"), title: T("Prima linie", "Первая линия", "First line") },
  levels: { label: T("Niveluri", "Этажность", "Levels"), title: (n: number, locale: SiteLocale) => (locale === "ru" ? `${n} уровня` : locale === "ro" ? `${n} niveluri` : `${n} levels`) },
};

export function SummaryCards({ x, unit, locale }: { x: LeasingExperience; unit: AvailableSpace; locale: SiteLocale }) {
  const floors = (unit.breakdown ?? []).filter((level) => level.key !== "terrace");
  const glazing = x.lens.formats.find((format) => format.key === "retail")?.evidence.find((item) => item.ref === "photos" && publishable(item.evidence));
  const cards = [
    { key: "readiness", label: copy.readiness.label[locale], title: copy.readiness.title[locale], text: x.capex.lead?.[locale] ?? "" },
    { key: "visibility", label: copy.visibility.label[locale], title: copy.visibility.title[locale], text: glazing?.text[locale] ?? "" },
    { key: "levels", label: copy.levels.label[locale], title: copy.levels.title(floors.length, locale), text: floors.map((level) => `${level.label[locale]} ${formatAreaExact(level.area, locale)}`).join(" · ") },
  ];
  return (
    <section className="lg-summary" aria-label={x.reasons.label[locale]}>
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
