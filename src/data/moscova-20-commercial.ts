import type { AreaLevel } from "@/data/leasing-inventory";
import { publicAsset, type Localized, type SiteLocale } from "@/lib/site-data";

/**
 * MOSCOVA 20 · COMMERCIAL TERMS — the single source of the published rental rates (OWNER DECISION, mandate R6 «COMMERCIAL
 * PRICING & PREMIUM LEASING OFFER» and R7 «PREMIUM LEASING EXPERIENCE», 2026-11-12, with the addendum «Ежегодная индексация
 * арендной платы»). This supersedes, for Moscova 20 only, the earlier rule «no rent, price or payment term anywhere».
 *
 * APPROVED (OWNER_CONFIRMED): the two unit rates — ground floor € 25 / m² / month, lower ground € 15 / m² / month, VAT excluded —
 * and the indexation wording below. Nothing else:
 *   · the areas are never typed here — they are read from the unit record M20-01 (src/data/leasing-inventory.ts → breakdown);
 *   · the monthly figure is a PRELIMINARY CALCULATION on the full area of the two levels without the terrace; the charging basis
 *     is provisional until the OWNER confirms it — it is always shown with that wording, never as a contractual price;
 *   · the terrace has NO approved commercial regime: it is shown apart, never with a zero rate and never as free;
 *   · OWNER «CORRECTIVE PASS R8» §02 + the R8 GO correction (2026-11-13) add, OWNER_CONFIRMED: a security deposit equal to 3 months
 *     of base rent; utilities paid at actual charges; an additional 15 % of the utility cost for the administration and maintenance of
 *     the engineering networks (that maintenance is covered by this fee only — never charged twice); other operating expenses defined
 *     by the lease. The deposit is stated in months only — no amount is calculated or published;
 *   · lease term, rent-free period, fixed service-charge or utility figures, a percentage of annual increase — not approved, not
 *     invented, not shown (the lease-terms rows of the dataset keep them TO_CONFIRM / unpublished).
 * The existing economics calculator is untouched: its rent is still the visitor's own assumption, never pre-filled from here.
 */
export type RateLevel = "ground" | "lower";

export const m20Commercial = {
  project: "moscova-20",
  decision: "OWNER R6 / R7 · 2026-11-12",
  currency: "EUR",
  /** € per m² per month, VAT excluded — OWNER_CONFIRMED */
  rates: { ground: 25, lower: 15 } satisfies Record<RateLevel, number>,
  /** PROVISIONAL until the OWNER confirms the charging area: the full area of each level (the unit record), the terrace not charged in the calculation */
  basis: "FULL_FLOOR_AREA_PROVISIONAL" as const,
  /** the terrace: commercial regime not approved */
  terrace: "TO_CONFIRM" as const,
  /** OWNER «CORRECTIVE PASS R8» §02 (2026-11-13) — OWNER_CONFIRMED */
  deposit: { months: 3 },
  /** % of the utility cost charged for the administration and maintenance of the engineering networks — OWNER_CONFIRMED (R8 GO correction) */
  fee: { percentOfUtilities: 15 },
  /**
   * THE COMMERCIAL OFFER (the commercial brochure R2). `published: true` since the «FINAL OWNER GO · FULL PRODUCTION RELEASE
   * AUTHORIZED» (2026-11-12): both editions link to the PDFs and scripts/package-production.mjs keeps the files. While it was
   * `false` the production edition showed no link (the action fell back to the direct contact) and the files were stripped.
   */
  offer: {
    published: true, // FINAL OWNER GO · FULL PRODUCTION RELEASE AUTHORIZED (2026-11-12)
    // OWNER «CORRECTIVE PASS R8» §05 (2026-11-13): the brochure redesigned in full (R3, ten pages) with the deposit and the expense
    // regime. The R2 files stay in place (the live production links them) until the release of this pass replaces the link.
    version: "M20-CO-2026-11 R3",
    updated: "13.11.2026",
    pages: 10,
    file: {
      ro: publicAsset("/assets/leasing/moscova-20/offer/r3/moscova-20-commercial-offer-ro-r3.pdf"),
      ru: publicAsset("/assets/leasing/moscova-20/offer/r3/moscova-20-commercial-offer-ru-r3.pdf"),
      en: publicAsset("/assets/leasing/moscova-20/offer/r3/moscova-20-commercial-offer-en-r3.pdf"),
    } satisfies Localized,
  },
} as const;

const N = " ";


/** «€6 024» · «€4 405,50» (RU) — «6 024 €» · «4 405,50 €» (RO) — «€6,024» · «€4,405.50» (EN); two decimals only where the amount has cents */
export function euro(amount: number, locale: SiteLocale): string {
  // grouped by hand, not by Intl: the site sets thousands with a no-break space in RU and RO («10 939 м²», «1 200 m») and Intl's ro-RO
  // would print «10.429,50»; EN keeps the comma group and the decimal point
  const cents = Math.round(amount * 100) % 100 !== 0;
  const [whole, decimals] = (cents ? amount.toFixed(2) : String(Math.round(amount))).split(".");
  const grouped = whole.replace(/\B(?=(\d{3})+(?!\d))/g, locale === "en" ? "," : N);
  const figure = decimals ? `${grouped}${locale === "en" ? "." : ","}${decimals}` : grouped;
  return locale === "ro" ? `${figure}${N}€` : `€${figure}`;
}
/** the rate in the OWNER wording: «€25/м²/мес.» · «25 €/m²/lună» · «€25/m²/month» */
export function rateText(rate: number, locale: SiteLocale): string {
  return locale === "ru" ? `€${rate}/м²/мес.` : locale === "ro" ? `${rate}${N}€/m²/lună` : `€${rate}/m²/month`;
}
/** the same rate in two parts for display: the figure and its unit */
export function rateParts(rate: number, locale: SiteLocale): { figure: string; unit: string } {
  return locale === "ru" ? { figure: `€${rate}`, unit: "/м²/мес." } : locale === "ro" ? { figure: `${rate}${N}€`, unit: "/m²/lună" } : { figure: `€${rate}`, unit: "/m²/month" };
}
export const perMonth: Localized = { ro: "/lună", ru: "/мес.", en: "/month" };

export type RentLine = { key: RateLevel; label: string; area: number; rate: number; monthly: number };
/** the preliminary calculation: full area of each charged level × its rate (areas from the unit record, never typed twice) */
export function rentCalculation(breakdown: AreaLevel[], locale: SiteLocale) {
  const lines: RentLine[] = (Object.keys(m20Commercial.rates) as RateLevel[]).flatMap((key) => {
    const level = breakdown.find((item) => item.key === key);
    if (!level) return [];
    const rate = m20Commercial.rates[key];
    return [{ key, label: commercialCopy.level[key][locale], area: level.area, rate, monthly: Math.round(level.area * rate * 100) / 100 }];
  });
  const monthly = Math.round(lines.reduce((sum, line) => sum + line.monthly, 0) * 100) / 100;
  const terrace = breakdown.find((item) => item.key === "terrace") ?? null;
  return { lines, monthly, annual: Math.round(monthly * 12 * 100) / 100, terrace: terrace ? { label: commercialCopy.level.terrace[locale], area: terrace.area } : null };
}

/** Public wording — the rates, the labels and the indexation paragraph are the OWNER's; the caveats say only what is not yet confirmed. */
export const commercialCopy = {
  title: { ro: "Condiții comerciale", ru: "Коммерческие условия", en: "Commercial Terms" },
  kicker: { ro: "Chirie", ru: "Аренда", en: "Rent" },
  level: {
    ground: { ro: "Parter", ru: "Первый этаж", en: "Ground Floor" },
    lower: { ro: "Demisol", ru: "Цоколь", en: "Lower Ground" },
    terrace: { ro: "Terasă", ru: "Терраса", en: "Terrace" },
  } satisfies Record<RateLevel | "terrace", Localized>,
  vat: { ro: "Fără TVA", ru: "Без НДС", en: "Excl. VAT" },
  vatInline: { ro: "fără TVA", ru: "без НДС", en: "excl. VAT" },
  ratesLabel: { ro: "Tarife de închiriere", ru: "Ставки аренды", en: "Rental rates" },
  area: { ro: "Suprafață", ru: "Площадь", en: "Area" },
  rate: { ro: "Tarif", ru: "Ставка", en: "Rate" },
  monthly: { ro: "Pe lună", ru: "В месяц", en: "Per month" },
  calcTitle: { ro: "Calcul preliminar al chiriei", ru: "Предварительный расчёт аренды", en: "Preliminary rent calculation" },
  total: { ro: "Total pe lună, preliminar", ru: "Итого в месяц, предварительно", en: "Monthly total, preliminary" },
  annual: { ro: "Chirie de bază pentru 12 luni, preliminar", ru: "Базовая аренда за 12 месяцев, предварительно", en: "Base rent for 12 months, preliminary" },
  terraceNote: {
    ro: "Condițiile comerciale pentru terasă urmează a fi confirmate; terasa nu este inclusă în calcul.",
    ru: `Коммерческие условия по${N}террасе уточняются; в${N}расчёт терраса не${N}включена.`,
    en: "Commercial terms for the terrace are to be confirmed; the terrace is not included in the calculation.",
  },
  terraceShort: { ro: "condițiile urmează a fi confirmate", ru: "условия уточняются", en: "terms to be confirmed" },
  basisNote: {
    ro: "Calcul preliminar: suprafața integrală a celor două niveluri, fără terasă. Baza de calcul se confirmă în oferta comercială și în contractul de locațiune.",
    ru: `Расчёт предварительный: полная площадь двух этажей, без${N}террасы. База начисления подтверждается в${N}коммерческом предложении и${N}договоре аренды.`,
    en: "A preliminary calculation: the full area of the two levels, without the terrace. The charging basis is confirmed in the commercial offer and the lease agreement.",
  },
  vatNote: {
    ro: "Tarifele nu includ TVA. Utilitățile și celelalte cheltuieli de exploatare nu sunt incluse în calcul.",
    ru: `Ставки указаны без${N}НДС. Коммунальные услуги и${N}иные эксплуатационные расходы в${N}расчёт не${N}включены.`,
    en: "Rates exclude VAT. Utilities and other operating expenses are not included in the calculation.",
  },
  // OWNER «CORRECTIVE PASS R8» §02 + the R8 GO correction (2026-11-13): utilities at actual charges; a fee of 15 % of the utility cost
  // for the administration and maintenance of the engineering networks — that maintenance is covered by the fee only, never charged a
  // second time; other operating expenses defined by the lease. RU = the OWNER's paragraph; RO / EN adapted with the same meaning.
  termsTitle: { ro: "Garanție și cheltuieli", ru: "Депозит и расходы", en: "Deposit and charges" },
  depositLabel: { ro: "Garanție locativă", ru: "Гарантийный депозит", en: "Security deposit" },
  depositFigure: { ro: `${m20Commercial.deposit.months}${N}luni`, ru: `${m20Commercial.deposit.months}${N}месяца`, en: `${m20Commercial.deposit.months}${N}months` },
  depositUnit: { ro: "de chirie de bază", ru: "базовой аренды", en: "of base rent" },
  depositTerm: {
    ro: `Echivalentă cu ${m20Commercial.deposit.months}${N}luni de chirie de bază.`,
    ru: `${m20Commercial.deposit.months}${N}месяца базовой аренды.`,
    en: `Equal to ${m20Commercial.deposit.months}${N}months’ base rent.`,
  },
  utilitiesLabel: { ro: "Utilități", ru: "Коммунальные услуги", en: "Utilities" },
  utilitiesShort: { ro: "Conform facturării efective", ru: "По фактическим начислениям", en: "At actual charges" },
  otherExpenses: {
    ro: "Alte cheltuieli de exploatare se stabilesc prin contractul de locațiune.",
    ru: `Иные эксплуатационные расходы определяются договором аренды.`,
    en: "Other operating expenses are defined in the lease agreement.",
  },
  feeLabel: { ro: "Administrarea și întreținerea rețelelor inginerești", ru: "Администрирование и обслуживание инженерных сетей", en: "Administration and engineering-network maintenance" },
  feeFigure: { ro: `${m20Commercial.fee.percentOfUtilities}${N}%`, ru: `${m20Commercial.fee.percentOfUtilities}${N}%`, en: `${m20Commercial.fee.percentOfUtilities}%` },
  feeUnit: { ro: "din costul utilităților", ru: "от стоимости коммунальных услуг", en: "of the utility costs" },
  /** the lease-terms row — the OWNER's paragraph */
  utilitiesRowLabel: { ro: "Utilități și cheltuieli de exploatare", ru: "Коммунальные и эксплуатационные расходы", en: "Utilities and operating expenses" },
  utilitiesTerm: {
    ro: `Utilitățile se achită conform facturării efective. Suplimentar se percepe ${m20Commercial.fee.percentOfUtilities}${N}% din costul utilităților pentru administrarea și întreținerea rețelelor inginerești. Alte cheltuieli de exploatare se stabilesc prin contractul de locațiune.`,
    ru: `Коммунальные услуги оплачиваются по${N}фактическим начислениям. Дополнительно взимается ${m20Commercial.fee.percentOfUtilities}${N}% от${N}стоимости коммунальных услуг за${N}администрирование и${N}обслуживание инженерных сетей. Иные эксплуатационные расходы определяются договором аренды.`,
    en: `Utilities are paid at actual charges. An additional ${m20Commercial.fee.percentOfUtilities}% of the utility cost is charged for the administration and maintenance of the engineering networks. Other operating expenses are defined in the lease agreement.`,
  },
  indexationTitle: { ro: "Indexare anuală", ru: "Ежегодная индексация", en: "Annual indexation" },
  // OWNER addendum «Ежегодная индексация арендной платы» (2026-11-12) — verbatim; no percentage of annual increase is ever added
  indexation: {
    ro: "Chiria se indexează anual în baza indicelui oficial al prețurilor de consum (IPC), publicat de Biroul Național de Statistică al Republicii Moldova (BNS). Modalitatea de indexare este stabilită în contractul de locațiune.",
    ru: `Ежегодная индексация арендной платы на${N}основании официального индекса потребительских цен (IPC), публикуемого Национальным бюро статистики Республики Молдова (BNS). Порядок индексации определяется договором аренды.`,
    en: "Rent is indexed annually based on the official Consumer Price Index (CPI) published by the National Bureau of Statistics of the Republic of Moldova (NBS). The indexation mechanism is defined in the lease agreement.",
  },
  offerCta: { ro: "Obține oferta comercială", ru: "Получить коммерческое предложение", en: "Get the Commercial Offer" },
  offerMeta: { ro: "PDF · {pages} pagini · tarife, calcul, planuri", ru: "PDF · {pages} страниц · ставки, расчёт, планы", en: "PDF · {pages} pages · rates, calculation, plans" },
  /** where no accepted PDF exists (the production edition before the OWNER GO): the action leads to the direct contact — never a dead link */
  offerContactMeta: { ro: "prin contact direct cu MEGAPARC", ru: `через прямой контакт с${N}MEGAPARC`, en: "through direct contact with MEGAPARC" },
  candidate: { ro: "Proiect pentru aprobarea OWNER", ru: "Проект на согласование OWNER", en: "Draft for OWNER approval" },
  why: {
    title: { ro: "De ce Moscova 20", ru: "Почему Moscova 20", en: "Why Moscova 20" },
    items: [
      { key: "glazing", title: { ro: "Vitrine spre bulevard", ru: "Витрины на бульвар", en: "Boulevard-facing glazing" }, text: { ro: "Vitrajul parterului este orientat spre bulevardul Moscova — brandul se vede din stradă.", ru: `Остекление первого этажа обращено к${N}бульвару Москова${N}— бренд виден с${N}улицы.`, en: "The ground-floor glazing faces Moscova Boulevard — the brand is seen from the street." } },
      { key: "district", title: { ro: "Cartier rezidențial consacrat", ru: "Сложившийся жилой район", en: "Established residential surroundings" }, text: { ro: "În jur — blocuri de locuit, școli și servicii de zi cu zi ale sectorului Rîșcani.", ru: `Вокруг${N}— жилые дома, школы и${N}ежедневные сервисы сектора Рышкань.`, en: "Around it — residential blocks, schools and everyday services of the Rîșcani sector." } },
      { key: "levels", title: { ro: "Două niveluri pentru formatul dumneavoastră", ru: "Два уровня под ваш формат", en: "Two levels adaptable to your format" }, text: { ro: "Parter și demisol: zona pentru clienți și suprafețele auxiliare într-un singur concept.", ru: `Первый этаж и${N}цоколь: клиентская зона и${N}вспомогательные площади в${N}одной концепции.`, en: "Ground floor and lower ground: the customer area and the support space in one concept." } },
    ],
  },
} as const;

/** «Первый этаж — €25/м²/мес. · Цоколь — €15/м²/мес.» — one line for the lease-terms sheet and metadata */
export function ratesLine(locale: SiteLocale): string {
  return (Object.keys(m20Commercial.rates) as RateLevel[]).map((key) => `${commercialCopy.level[key][locale]}${N}— ${rateText(m20Commercial.rates[key], locale)}`).join(" · ");
}
