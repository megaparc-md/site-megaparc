import { PlanNavigator, type NavCopy, type NavLevel, type NavRoom } from "@/components/plan-navigator";
import { formatAreaExact } from "@/content/source";
import { catalogVisible } from "@/data/dacia-31-spaces";
import { dacia31PlanLevels, type PlanRoom } from "@/data/dacia-31-plans";
import { mailHref } from "@/lib/contact-mail";
import Link from "next/link";
import { isProductionEdition, publicAsset, type Localized, type SiteLocale } from "@/lib/site-data";

/**
 * DACIA 31 — THE FLOOR-BY-FLOOR SCENE (OWNER addendum «DACIA 31 · ARCHITECTURAL PLANS», 2026-11-23). The server half: the levels and rooms of
 * the generated plan data (src/data/dacia-31-plans.ts, from the five OWNER PDFs), localised; the room status comes from the lease register
 * (occupied · free · to be confirmed — never a tenant name), the area from the plan's own room schedule (a figure drawn differently in the
 * drawing is said to be confirmed, never corrected), the two requests of a room as the confirmed e-mail with its name, level and area.
 * The technical floor is shown and never offered. OWNER preview until the OWNER confirms the data (`dacia31Catalog.ownerApproved`).
 */

const N = " ";
const t = {
  kicker: { ro: "Planuri pe niveluri", ru: "Поэтажные планы", en: "Floor plans" },
  title: { ro: "Alegeți spațiul pe plan.", ru: `Выберите помещение на${N}плане.`, en: "Choose a space on the plan." },
  lead: {
    ro: "Planurile arhitecturale reale ale celor cinci niveluri. Două direcții: birouri și cabinete — și suprafețe comerciale mari. Statutul fiecărui spațiu — în culori neutre.",
    ru: `Реальные архитектурные планы пяти уровней. Два направления: офисы и${N}кабинеты${N}— и${N}крупные коммерческие площади. Статус каждого помещения${N}— нейтральным цветом.`,
    en: "The real architectural plans of the five levels. Two directions: offices and cabinets — and large commercial floors. The status of every space in neutral colours.",
  },
  levels: { ro: "Nivelul", ru: "Уровень", en: "Level" },
  directions: { ro: "Direcția", ru: "Направление", en: "Direction" },
  all: { ro: "Toate", ru: "Все", en: "All" },
  office: { ro: "Birouri și cabinete", ru: `Офисы и${N}кабинеты`, en: "Offices and cabinets" },
  commercial: { ro: "Suprafețe comerciale mari", ru: "Крупные коммерческие площади", en: "Large commercial floors" },
  free: { ro: "Liber", ru: "Свободно", en: "Free" },
  occupied: { ro: "Ocupat", ru: "Занято", en: "Occupied" },
  confirm: { ro: "Se confirmă", ru: "Уточняется", en: "To be confirmed" },
  service: { ro: "Spații comune și tehnice", ru: "Общие и технические помещения", en: "Common and technical rooms" },
  notOfferedStatus: { ro: "Nu se închiriază", ru: "Не сдаётся", en: "Not for lease" },
  choose: { ro: "Atingeți un spațiu pe plan sau alegeți-l din listă.", ru: `Нажмите на${N}помещение на${N}плане или выберите его в${N}списке.`, en: "Tap a space on the plan or choose it from the list." },
  area: { ro: "Suprafață", ru: "Площадь", en: "Area" },
  purpose: { ro: "Destinație", ru: "Назначение", en: "Use" },
  level: { ro: "Nivel", ru: "Уровень", en: "Level" },
  photos: { ro: "Fotografii", ru: "Фотографии", en: "Photographs" },
  photosValue: { ro: "Fotografiile spațiului — la vizionare", ru: `Фото помещения${N}— на${N}просмотре`, en: "Photographs of the space — at the viewing" },
  status: { ro: "Statut", ru: "Статус", en: "Status" },
  terms: { ro: "Condiții comerciale", ru: "Коммерческие условия", en: "Commercial terms" },
  termsValue: { ro: "La cerere — după verificarea formatului", ru: `По${N}запросу${N}— после проверки формата`, en: "On request — after the format check" },
  heights: { ro: "Înălțimi", ru: "Высоты", en: "Heights" },
  view: { ro: "Solicitați o vizionare", ru: "Запросить просмотр", en: "Request a viewing" },
  offer: { ro: "Solicitați o ofertă", ru: "Запросить предложение", en: "Request an offer" },
  occupiedNote: { ro: "Spațiul este ocupat.", ru: "Помещение занято.", en: "The space is occupied." },
  notOffered: { ro: "Nivelul tehnic nu se închiriază.", ru: "Технический этаж не сдаётся.", en: "The technical floor is not for lease." },
  zoomIn: { ro: "Mărire", ru: "Увеличить", en: "Zoom in" },
  zoomOut: { ro: "Micșorare", ru: "Уменьшить", en: "Zoom out" },
  reset: { ro: "Întregul plan", ru: "Весь план", en: "Whole plan" },
  pdf: { ro: "Deschideți desenul original (PDF)", ru: "Открыть оригинальный чертёж (PDF)", en: "Open the original drawing (PDF)" },
  listTitle: { ro: "Spații pe acest nivel", ru: "Помещения уровня", en: "Spaces on this level" },
  listEmpty: { ro: "Pe acest nivel nu sunt spații în direcția aleasă.", ru: `На${N}этом уровне нет помещений выбранного направления.`, en: "No space of the chosen direction on this level." },
  count: { ro: "{n}", ru: "{n}", en: "{n}" },
  hint: { ro: "Mărire: două degete, dublă atingere sau butoanele +/−.", ru: `Масштаб: два пальца, двойное касание или кнопки +/−.`, en: "Zoom: two fingers, a double tap or the +/− buttons." },
  variant: { ro: "variantă de amenajare open space 1", ru: "вариант планировки open space 1", en: "layout variant open space 1" },
  restOfFloor: { ro: "restul nivelului nu intră în ofertă", ru: `остальная часть этажа не${N}входит в${N}предложение`, en: "the rest of the floor is not part of the offer" },
  technical: { ro: "nu se închiriază", ru: "не сдаётся", en: "not for lease" },
  drawnNote: { ro: "Pe desen — {v}; suprafața se confirmă.", ru: `На${N}чертеже${N}— {v}; площадь уточняется.`, en: "The drawing shows {v}; the area is being confirmed." },
  sharedNote: { ro: "Pe desen birourile 023–025 sunt un singur spațiu de {v}; suprafața se confirmă.", ru: `На${N}чертеже офисы 023–025 показаны одним пространством {v}; площадь уточняется.`, en: "The drawing shows offices 023–025 as one space of {v}; the area is being confirmed." },
  confirmNote: { ro: "Statutul și suprafața se confirmă.", ru: "Статус и площадь уточняются.", en: "The status and the area are being confirmed." },
  terraceNote: { ro: "Nu intră în suprafața totală a nivelului; condițiile se stabilesc.", ru: `Не${N}входит в${N}общую площадь уровня; условия уточняются.`, en: "Not included in the level total; terms to be set." },
  unscheduled: { ro: "Nu figurează în borderoul planului.", ru: `Нет в${N}экспликации плана.`, en: "Not in the plan's room schedule." },
  kind: {
    office: { ro: "Birou", ru: "Офис", en: "Office" },
    hall: { ro: "Sală polivalentă — comerț, servicii, showroom", ru: `Универсальный зал${N}— торговля, услуги, шоурум`, en: "Multi-purpose hall — retail, services, showroom" },
    storage: { ro: "Depozitare", ru: "Склад", en: "Storage" },
    terrace: { ro: "Terasă", ru: "Терраса", en: "Terrace" },
    other: { ro: "Spațiu", ru: "Помещение", en: "Space" },
  },
  viewSubject: { ro: "Vizionare", ru: "Просмотр помещения", en: "Viewing" },
  offerSubject: { ro: "Ofertă individuală", ru: "Индивидуальное предложение", en: "Individual offer" },
} as const;

const L = (v: Localized, locale: SiteLocale) => v[locale];

function titleOf(r: PlanRoom, locale: SiteLocale) {
  if (r.kind === "office") return r.name[locale];
  if (r.kind === "hall" || r.kind === "storage" || r.kind === "terrace") return `${r.name[locale]} №${N}${r.no}`;
  return r.name[locale];
}

export function Dacia31Plans({ locale, name }: { locale: SiteLocale; name: string }) {
  if (!catalogVisible()) return null;
  const levels: NavLevel[] = dacia31PlanLevels.map((lv) => {
    const levelLabel = lv.label[locale];
    const rooms: NavRoom[] = lv.rooms.map((r) => {
      const area = r.area != null ? formatAreaExact(r.area, locale) : null;
      let note: string | null = null;
      if (r.kind === "unscheduled") note = L(t.unscheduled, locale);
      else if (r.kind === "terrace") note = L(t.terraceNote, locale);
      else if (r.drawn != null && r.area != null && Math.abs(r.drawn - r.area) > 0.006) note = (r.drawn > 60 && r.kind === "office" ? L(t.sharedNote, locale) : L(t.drawnNote, locale)).replace("{v}", formatAreaExact(r.drawn, locale));
      else if (r.status === "to-confirm") note = L(t.confirmNote, locale);
      const title = titleOf(r, locale);
      const ask = r.status === "free" || r.status === "to-confirm";
      const ref = `${name} · ${title} · ${levelLabel}${area ? ` · ${area}` : ""}`;
      const kindLabel = r.kind === "office" ? L(t.kind.office, locale) : r.kind === "hall" ? L(t.kind.hall, locale) : r.kind === "storage" ? L(t.kind.storage, locale) : r.kind === "terrace" ? L(t.kind.terrace, locale) : L(t.kind.other, locale);
      const body = {
        ro: [`Bună ziua! Mă interesează spațiul ${ref}.`, "", "Compania și domeniul de activitate:", "Formatul (birou, cabinet, comerț, servicii):", "Data dorită:", "Telefon de contact:"],
        ru: [`Здравствуйте! Интересует помещение: ${ref}.`, "", "Компания и вид деятельности:", "Формат (офис, кабинет, торговля, услуги):", "Удобная дата:", "Телефон для связи:"],
        en: [`Hello, I am interested in the space: ${ref}.`, "", "Company and line of business:", "Format (office, cabinet, retail, services):", "Preferred date:", "Contact telephone:"],
      }[locale];
      return {
        id: r.id,
        no: r.no,
        title,
        kindLabel,
        area,
        note,
        status: r.status,
        scenario: r.scenario,
        // the terrace outline is not traced reliably (it is open to the parapet) — listed, not drawn
        poly: r.poly && r.kind !== "terrace" ? r.poly.map(([x, y]) => `${x},${y}`).join(" ") : null,
        at: r.kind === "terrace" ? null : r.at,
        big: r.kind === "hall" || (r.kind === "storage" && (r.area ?? 0) > 30),
        viewHref: ask && r.scenario ? mailHref(`${name} — ${L(t.viewSubject, locale)} · ${title} · ${levelLabel}`, body) : null,
        offerHref: ask && r.scenario ? mailHref(`${name} — ${L(t.offerSubject, locale)} · ${title} · ${levelLabel}`, body) : null,
      };
    });
    const note = lv.variant ? `${L(t.variant, locale)}; ${L(t.restOfFloor, locale)}` : lv.offered ? null : L(t.technical, locale);
    return { key: lv.key, label: levelLabel, drawing: lv.drawing, pdf: publicAsset(lv.pdf), svg: publicAsset(lv.svg), offered: lv.offered, note, heights: lv.heights ? lv.heights[locale] : null, viewBox: lv.viewBox, rooms };
  });
  const copy: NavCopy = {
    levels: L(t.levels, locale), directions: L(t.directions, locale), all: L(t.all, locale), office: L(t.office, locale), commercial: L(t.commercial, locale),
    status: { free: L(t.free, locale), occupied: L(t.occupied, locale), "to-confirm": L(t.confirm, locale), service: L(t.service, locale), "not-offered": L(t.notOfferedStatus, locale) },
    choose: L(t.choose, locale), area: L(t.area, locale), purpose: L(t.purpose, locale), level: L(t.level, locale), photos: L(t.photos, locale), photosValue: L(t.photosValue, locale),
    statusLabel: L(t.status, locale), terms: L(t.terms, locale), termsValue: L(t.termsValue, locale), heights: L(t.heights, locale),
    view: L(t.view, locale), offer: L(t.offer, locale), occupiedNote: L(t.occupiedNote, locale), notOffered: L(t.notOffered, locale),
    zoomIn: L(t.zoomIn, locale), zoomOut: L(t.zoomOut, locale), reset: L(t.reset, locale), pdf: L(t.pdf, locale), listTitle: L(t.listTitle, locale), listEmpty: L(t.listEmpty, locale), count: L(t.count, locale), hint: L(t.hint, locale),
  };
  return (
    <section id="spaces" className="lg-sec lg-sec--white pn-sec" aria-labelledby="pn-title">
      <div className="xp-shell">
        <div className="sc-head">
          <p className="lg-label">{L(t.kicker, locale)}</p>
          <h2 className="sc-title" id="pn-title">{L(t.title, locale)}</h2>
          <p className="sc-lead">{L(t.lead, locale)}</p>
        </div>
        <PlanNavigator levels={levels} copy={copy} initial="l1" />
        {/* the internal reconciliation register — OWNER preview only (the route does not exist in production) */}
        {isProductionEdition ? null : <p className="pn-owner"><Link className="pm-link" href="/owner-demo/dacia-31-reconciliation/"><span>OWNER · реестр соответствия планов и реестра аренды</span></Link></p>}
      </div>
    </section>
  );
}
