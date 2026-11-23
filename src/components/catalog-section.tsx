import { SpaceCatalog, type FinderCopy, type FinderLevel, type FinderSpace } from "@/components/space-catalog";
import { formatAreaExact, formatDate } from "@/content/source";
import { catalogCopy, dacia31Catalog, publicCatalog, type CatalogLevel } from "@/data/dacia-31-spaces";
import { mailHref } from "@/lib/contact-mail";
import type { Localized, SiteLocale } from "@/lib/site-data";

/**
 * THE DACIA 31 CATALOGUE SCENE — OWNER «PROPERTY COMMERCIAL EXPERIENCE 2026» Part B (2026-11-23). The server half of the space
 * finder: it reads the catalogue (src/data/dacia-31-spaces.ts — free spaces only, no tenant data), localises every string and builds
 * the two requests of each card (a viewing · an individual offer) as the confirmed e-mail with the space's code and area. Shown where
 * the OWNER approved the catalogue or on the OWNER preview; otherwise nothing renders and the page keeps «площадь и сроки — по запросу».
 */

const N = " ";
const t = {
  kicker: { ro: "Ce se poate închiria", ru: "Что можно арендовать", en: "What can be leased" },
  title: { ro: "Spații libere în Dacia 31.", ru: `Свободные помещения в${N}Dacia${N}31.`, en: "Free spaces at Dacia 31." },
  lead: {
    ro: "Două scenarii într-o singură clădire: birouri și cabinete pentru echipe și servicii — și suprafețe comerciale mari pentru comerț, servicii sau showroom. Alegeți nivelul, scenariul sau suprafața.",
    ru: `Два сценария в${N}одном здании: офисы и${N}кабинеты для команд и${N}услуг${N}— и${N}крупные коммерческие площади для торговли, сервиса или шоурума. Выберите уровень, сценарий или площадь.`,
    en: "Two scenarios in one building: offices and cabinets for teams and services — and large commercial floors for retail, services or a showroom. Choose a level, a scenario or an area.",
  },
  scenarioLabel: { ro: "Scenariu", ru: "Сценарий", en: "Scenario" },
  all: { ro: "Toate", ru: "Все", en: "All" },
  areaLabel: { ro: "Suprafață", ru: "Площадь", en: "Area" },
  statusLabel: { ro: "Disponibilitate", ru: "Доступность", en: "Availability" },
  now: { ro: "Liber acum", ru: "Свободно сейчас", en: "Free now" },
  soon: { ro: "Se eliberează", ru: "Освобождается", en: "Becoming free" },
  levelsLabel: { ro: "Nivel", ru: "Уровень", en: "Level" },
  levelsNote: { ro: "Schemă a nivelurilor, nu la scară. Planurile — la vizionare.", ru: `Схема уровней, не${N}в${N}масштабе. Планы${N}— на${N}просмотре.`, en: "A schematic of the levels, not to scale. The plans — at the viewing." },
  uses: { ro: "Se poate verifica pentru", ru: "Можно проверить под", en: "Can be checked for" },
  view: { ro: "Solicitați o vizionare", ru: "Запросить просмотр", en: "Request a viewing" },
  offer: { ro: "Solicitați o ofertă individuală", ru: "Запросить индивидуальное предложение", en: "Request an individual offer" },
  found: { ro: "Spații găsite: {n}", ru: "Найдено помещений: {n}", en: "Spaces found: {n}" },
  none: { ro: "Niciun spațiu nu corespunde filtrului.", ru: "Под этот фильтр помещений нет.", en: "No space matches this filter." },
  reset: { ro: "Resetați filtrul", ru: "Сбросить фильтр", en: "Reset the filter" },
  note: {
    ro: "Suprafețe conform registrului de închiriere, preliminar — se confirmă la vizionare. Condițiile comerciale — după verificarea formatului.",
    ru: `Площади по${N}реестру аренды, предварительно${N}— подтверждаются на${N}просмотре. Коммерческие условия${N}— после проверки формата.`,
    en: "Areas per the lease register, preliminary — confirmed at the viewing. Commercial terms — after the format check.",
  },
  free: { ro: "liber", ru: "свободно", en: "free" },
  viewSubject: { ro: "Vizionare", ru: "Просмотр помещения", en: "Viewing" },
  offerSubject: { ro: "Ofertă individuală", ru: "Индивидуальное предложение", en: "Individual offer" },
  spaces: { ro: "spații", ru: "пом.", en: "spaces" },
} satisfies Record<string, Localized>;

const bands = [
  { key: "s", label: { ro: "până la 100 m²", ru: `до${N}100${N}м²`, en: "up to 100 m²" }, min: 0, max: 100 },
  { key: "m", label: { ro: "100–500 m²", ru: `100–500${N}м²`, en: "100–500 m²" }, min: 100, max: 500 },
  { key: "l", label: { ro: "de la 500 m²", ru: `от${N}500${N}м²`, en: "500 m² and more" }, min: 500, max: Number.POSITIVE_INFINITY },
];

const levelOrder: CatalogLevel[] = ["level2", "ground", "lower", "unknown"];

export function catalogFigures() {
  const spaces = publicCatalog();
  return { count: spaces.length, free: spaces.reduce((sum, space) => sum + space.area, 0), offices: spaces.filter((space) => space.scenario === "office").length, floors: spaces.filter((space) => space.scenario === "commercial").length };
}

export function CatalogSection({ locale, name }: { locale: SiteLocale; name: string }) {
  const list = publicCatalog();
  if (!list.length) return null;
  const spaces: FinderSpace[] = list.map((space) => {
    const unit = space.scenario === "office" ? `${catalogCopy.unit.office[locale]} ${space.code}` : catalogCopy.unit.commercial[locale];
    const areaText = formatAreaExact(space.area, locale);
    const level = catalogCopy.level[space.level][locale];
    const ref = `${name} · ${unit} · ${level} · ${areaText}`;
    const view = {
      ro: [`Bună ziua! Aș dori să văd spațiul ${ref}.`, "", "Compania și domeniul de activitate:", "Formatul (birou, cabinet, comerț, servicii):", "Data dorită a vizionării:", "Telefon de contact:"],
      ru: [`Здравствуйте! Хочу посмотреть помещение: ${ref}.`, "", "Компания и вид деятельности:", "Формат (офис, кабинет, торговля, услуги):", "Удобная дата просмотра:", "Телефон для связи:"],
      en: [`Hello, I would like to view the space: ${ref}.`, "", "Company and line of business:", "Format (office, cabinet, retail, services):", "Preferred viewing date:", "Contact telephone:"],
    }[locale];
    const offer = {
      ro: [`Bună ziua! Vă rog să pregătiți o ofertă individuală: ${ref}.`, "", "Compania și domeniul de activitate:", "Suprafața necesară (întreg spațiul sau o parte):", "Termenul dorit de începere:", "Telefon de contact:"],
      ru: [`Здравствуйте! Прошу подготовить индивидуальное предложение: ${ref}.`, "", "Компания и вид деятельности:", "Нужная площадь (целиком или часть):", "Желаемый срок начала аренды:", "Телефон для связи:"],
      en: [`Hello, please prepare an individual offer: ${ref}.`, "", "Company and line of business:", "Space needed (the whole or a part):", "Target start date:", "Contact telephone:"],
    }[locale];
    return {
      id: space.id,
      code: space.code,
      scenario: space.scenario,
      level: space.level,
      levelLabel: level,
      area: space.area,
      areaText,
      unit,
      status: space.status === "AVAILABLE_FROM_DATE" ? "soon" : "now",
      statusText: space.status === "AVAILABLE_FROM_DATE" && space.availableFrom ? `${t.soon[locale]} · ${formatDate(space.availableFrom, locale)}` : t.now[locale],
      uses: space.uses.map((use) => catalogCopy.use[use][locale]).join(" · "),
      divisible: space.divisible ? catalogCopy.divisible[space.divisible][locale] : null,
      viewHref: mailHref(`${name} — ${t.viewSubject[locale]} · ${unit} · ${areaText}`, view),
      offerHref: mailHref(`${name} — ${t.offerSubject[locale]} · ${unit} · ${areaText}`, offer),
    };
  });
  const maxFree = Math.max(...levelOrder.map((key) => list.filter((space) => space.level === key).reduce((sum, space) => sum + space.area, 0)));
  const levels: FinderLevel[] = levelOrder.flatMap((key) => {
    const at = list.filter((space) => space.level === key);
    if (!at.length) return [];
    const free = at.reduce((sum, space) => sum + space.area, 0);
    return [{ key, label: catalogCopy.level[key][locale], freeText: `${formatAreaExact(free, locale)} ${t.free[locale]}${at.length > 1 ? ` · ${at.length} ${t.spaces[locale]}` : ""}`, count: at.length, share: maxFree ? free / maxFree : 0 }];
  });
  const copy: FinderCopy = {
    scenarioLabel: t.scenarioLabel[locale],
    all: t.all[locale],
    scenarios: { office: catalogCopy.scenario.office[locale], commercial: catalogCopy.scenario.commercial[locale] },
    areaLabel: t.areaLabel[locale],
    areas: bands.map((band) => ({ key: band.key, label: band.label[locale], min: band.min, max: band.max })),
    statusLabel: t.statusLabel[locale],
    statuses: { now: t.now[locale], soon: t.soon[locale] },
    levelsLabel: t.levelsLabel[locale],
    levelsNote: t.levelsNote[locale],
    allLevels: t.all[locale],
    uses: t.uses[locale],
    view: t.view[locale],
    offer: t.offer[locale],
    found: t.found[locale],
    none: t.none[locale],
    reset: t.reset[locale],
    note: t.note[locale],
  };
  return (
    <section id="spaces" className="lg-sec lg-sec--white sc-sec" aria-labelledby="sc-title" data-as-of={dacia31Catalog.asOf}>
      <div className="xp-shell">
        <div className="sc-head">
          <p className="lg-label">{t.kicker[locale]}</p>
          <h2 className="sc-title" id="sc-title">{t.title[locale]}</h2>
          <p className="sc-lead">{t.lead[locale]}</p>
        </div>
        <SpaceCatalog spaces={spaces} levels={levels} copy={copy} />
      </div>
    </section>
  );
}
