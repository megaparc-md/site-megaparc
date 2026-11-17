import type { Localized } from "@/lib/site-data";

/**
 * MOSCOVA 20 · COMMERCIAL PRESENTATION R4.1 — the wording that exists only in this PDF (OWNER «MOSCOVA 20 · 2-DAY FINISH TO IDEAL
 * STANDARD» + «OWNER FINAL 2-DAY DELIVERY MANDATE», 2026-11-14). Headings, short photo captions and the document's identity only:
 * the version, the date and the page count are m20Commercial.offer (one source with every button of the site); every fact is read from the unit record, the passport, the commercial module and the approved dataset, exactly as in R4.
 * The captions say what the OWNER photograph shows (taken from its approved alt text) — never a claim about use or condition.
 */
const N = " "; // an escape on purpose: a literal no-break space is invisible in review
export const offerR41 = {
  /** the cover line (set in capitals by the CSS) — OWNER «BRAND FINAL ACCEPTANCE · DECISION» (2026-11-16): КОММЕРЧЕСКОЕ ПРЕДЛОЖЕНИЕ · АРЕНДА /
   * OFERTĂ COMERCIALĂ · ÎNCHIRIERE / COMMERCIAL LEASING PROPOSAL — the document's approved name, never «презентация» */
  kicker: { ro: "Ofertă comercială · închiriere", ru: "Коммерческое предложение · аренда", en: "Commercial leasing proposal" },
  /** the PDF's own title (the tab of a PDF viewer) = the document name on every button of the site and the Pack (commercialCopy.offerTitle) */
  title: { ro: "Moscova 20 — Ofertă comercială", ru: "Moscova 20 — Коммерческое предложение", en: "Moscova 20 — Commercial Leasing Proposal" },
  coverLevels: { ro: `Parter + demisol`, ru: `1‑й этаж + цоколь`, en: "Ground floor + lower ground" },
  captions: {
    space: { ro: "Parter · vitrina spre bulevard", ru: `1‑й этаж · витрина на${N}бульвар`, en: "Ground floor · the boulevard shopfront" },
    tech: { ro: "Demisol · trasee de ventilație, unitate split, calorifere", ru: "Цоколь · воздуховоды, сплит‑система, радиаторы", en: "Lower ground · ventilation ducts, a split unit, radiators" },
    formats: { ro: "Parter · sala deschisă", ru: "1‑й этаж · открытый зал", en: "Ground floor · the open hall" },
    final: { ro: "Demisol · sala cu stâlpi", ru: "Цоколь · зал с колоннами", en: "Lower ground · the hall with columns" },
  },
  conditionsTitle: { ro: "Garanție, cheltuieli,\nindexare.", ru: "Депозит, расходы,\nиндексация.", en: "Deposit, expenses,\nindexation." },
  /** the next step on the terms page — the individual offer goes to the confirmed e-mail (OWNER «PDF R5 ADDENDUM» §5) */
  individualLead: {
    ro: "Pentru formatul și suprafața dumneavoastră pregătim o ofertă individuală.",
    ru: `Под ваш формат и${N}нужную площадь подготовим индивидуальное предложение.`,
    en: "We'll prepare an individual offer for your format and the space you need.",
  },
  // OWNER R4.1 visual review P2 (2026-11-14): the official drawings are shown reduced — the scale belongs to the original; measure on the PDF
  planLegend: {
    ro: `Desen oficial · anexă la contractul de locațiune, nerefăcut. Scara 1:100 se referă la desenul original; aici imaginea este micșorată — pentru măsurători, planul oficial în PDF.`,
    ru: `Официальный чертёж · приложение к${N}договору аренды, без${N}перерисовки. Масштаб 1:100${N}— у${N}оригинального чертежа; здесь изображение уменьшено. Для${N}измерений${N}— официальный план в${N}PDF.`,
    en: "Official drawing · lease agreement annex, not redrawn. The 1:100 scale refers to the original drawing; it is reduced here — for measurements, use the official PDF plan.",
  },
  // OWNER R4.1 visual review P2 (2026-11-14): the district in one factual line and its status — the existing location leads the page;
  // planned development is never presented as a guaranteed source of footfall (facts: docs/research/RISCANI_DEVELOPMENT_2026.md)
  growth: {
    label: { ro: "Dezvoltarea cartierului", ru: "Развитие района", en: "District development" },
    text: {
      ro: "Vizavi, peste bulevard, se află fosta uzină „Mezon”: pentru teritoriu a fost elaborat un proiect de plan urbanistic zonal (locuințe, comerț, birouri).",
      ru: `Напротив, через бульвар,${N}— бывший завод «Мезон»: для территории разработан проект зонального плана (жильё, торговля, офисы).`,
      en: "Across the boulevard lies the former Mezon plant: a draft zonal plan has been prepared for the site (housing, retail, offices).",
    },
    status: {
      ro: "Statut: proiect. Aprobarea de către Consiliul Municipal nu a fost publicată; autorizații de construire și termene nu există. Nu îl considerăm o sursă de trafic.",
      ru: `Статус: проект. Утверждение Муниципальным советом не${N}опубликовано; разрешений на${N}строительство и${N}сроков нет. Мы не${N}рассматриваем его как источник трафика.`,
      en: "Status: a draft. Approval by the Municipal Council has not been published; there are no building permits or dates. We do not treat it as a source of footfall.",
    },
  },
} satisfies Record<string, unknown> & { kicker: Localized };
