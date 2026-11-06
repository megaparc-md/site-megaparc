import type { CSSProperties } from "react";
import { CmsPrototype, type CmsCopy } from "@/components/cms-prototype";
import { Opening } from "@/components/experience";
import { PageShell } from "@/components/page-shell";
import { allSpacesForCmsPrototype, formatAreaRange, formatDate, getProject, publishedStatuses, spaceStatuses, today } from "@/content/source";
import { uses } from "@/lib/leasing";
import type { SiteLocale } from "@/lib/site-data";

/**
 * HOW THE SITE IS UPDATED — internal CMS workflow prototype (noindex, not in
 * the navigation). OWNER correction 2026-10-08: "Prototype / document exactly
 * how an employee will work" — journey G: a MEGAPARC employee changes a space
 * from AVAILABLE to LEASED without touching code. Architecture:
 * docs/CMS_ARCHITECTURE.md.
 */
const copy = {
  ro: {
    label: "Prototip intern · CMS",
    title: "Cum actualizează un angajat site-ul — fără cod.",
    lead: "Așa va arăta ecranul din WordPress. Alegeți un spațiu, schimbați statutul și apăsați „Actualizează” — în dreapta vedeți ce se schimbă pe site.",
    path: ["WordPress", "Închiriere", "Moscova 20", "M20-01", "Status", "Actualizează"],
    afterLabel: "Ce se întâmplă după „Actualizează”",
    after: [["WordPress salvează înregistrarea", "Statutul spațiului devine „Închiriat”."], ["Site-ul primește semnalul", "WordPress anunță automat site-ul că s-a schimbat conținutul."], ["Pagina se reface", "Spațiul dispare din „Acum se închiriază”, de pe pagina clădirii și din numărători."], ["Gata", "În câteva secunde sau un minut, în funcție de găzduire."]],
    never: "Fără Git, fără VS Code, fără cod, fără publicare manuală.",
    tasksLabel: "Alte sarcini, același principiu",
    tasks: [["Un spațiu nou", "Închiriere → Adaugă → completați câmpurile → Publică"], ["Fotografii și plan", "Spațiul → Fotografii / Plan → încărcați → Actualizează"], ["Un post nou", "Cariere → Adaugă → Publică; „Închis” îl scoate de pe site"], ["Stadiul unui proiect", "Proiecte → VATRA → Etapă → Actualizează"]],
  },
  ru: {
    label: "Внутренний прототип · CMS",
    title: "Как сотрудник обновляет сайт — без кода.",
    lead: "Так будет выглядеть экран в WordPress. Выберите помещение, смените статус и нажмите «Обновить» — справа видно, что меняется на сайте.",
    path: ["WordPress", "Аренда", "Moscova 20", "M20-01", "Статус", "Обновить"],
    afterLabel: "Что происходит после «Обновить»",
    after: [["WordPress сохраняет запись", "Статус помещения становится «Сдано»."], ["Сайт получает сигнал", "WordPress автоматически сообщает сайту, что запись изменилась."], ["Страница пересобирается", "Помещение исчезает из «Сейчас сдаётся», со страницы здания и из счётчиков."], ["Готово", "Через несколько секунд или минуту — зависит от хостинга."]],
    never: "Без Git, без VS Code, без кода, без ручной публикации.",
    tasksLabel: "Другие задачи — тот же принцип",
    tasks: [["Новое помещение", "Аренда → Добавить → заполнить поля → Опубликовать"], ["Фото и план", "Помещение → Фото / План → загрузить → Обновить"], ["Новая вакансия", "Вакансии → Добавить → Опубликовать; «Закрыта» убирает её с сайта"], ["Стадия проекта", "Проекты → VATRA → Стадия → Обновить"]],
  },
  en: {
    label: "Internal prototype · CMS",
    title: "How an employee updates the site — without code.",
    lead: "This is what the WordPress screen will look like. Pick a space, change its status and press “Update” — on the right you see what changes on the site.",
    path: ["WordPress", "Leasing", "Moscova 20", "M20-01", "Status", "Update"],
    afterLabel: "What happens after “Update”",
    after: [["WordPress saves the record", "The space's status becomes “Leased”."], ["The site gets the signal", "WordPress tells the site automatically that content has changed."], ["The page is rebuilt", "The space disappears from “Available now”, from the building page and from every count."], ["Done", "Within seconds or a minute, depending on hosting."]],
    never: "No Git, no VS Code, no code, no manual deployment.",
    tasksLabel: "Other tasks, same principle",
    tasks: [["A new space", "Leasing → Add new → fill in the fields → Publish"], ["Photos and plan", "Space → Photos / Plan → upload → Update"], ["A new vacancy", "Careers → Add new → Publish; “Closed” takes it off the site"], ["A project's stage", "Projects → VATRA → Stage → Update"]],
  },
} as const;

const cmsCopy: Record<SiteLocale, CmsCopy> = {
  ro: {
    menu: ["Panou", "Proiecte", "Închiriere", "Cariere", "Media", "Pagini"],
    menuActive: 2,
    listTitle: "Spații",
    addNew: "Adaugă spațiu",
    columns: ["Spațiu", "Obiect", "Suprafață", "Status", "Actualizat"],
    status: { AVAILABLE_NOW: "Liber acum", AVAILABLE_FROM_DATE: "Liber de la dată", RESERVED: "Rezervat", LEASED: "Închiriat", HIDDEN: "Ascuns", TO_CONFIRM: "De confirmat" },
    editTitle: "Editează spațiul",
    fields: { project: "Obiect", unit: "Spațiu", floor: "Etaj", area: "Suprafață", uses: "Destinație", from: "Liber din", status: "Status", photos: "Fotografii", plan: "Plan" },
    photosValue: "3 fotografii",
    planValue: "plan.pdf",
    update: "Actualizează",
    back: "Toate spațiile",
    saved: "Actualizat. Site-ul arată noul statut.",
    savedLeased: "Actualizat. Spațiul a dispărut de pe site — în WordPress rămâne, cu noul statut.",
    siteTitle: "Acum se închiriază",
    siteCount: "Pe site: {n}",
    siteEmpty: "Niciun spațiu liber.",
    hidden: "Spațiile „Închiriat”, „Ascuns” și „De confirmat” nu se publică.",
    hint: "Alegeți „Închiriat” și apăsați „Actualizează”.",
  },
  ru: {
    menu: ["Консоль", "Проекты", "Аренда", "Вакансии", "Медиафайлы", "Страницы"],
    menuActive: 2,
    listTitle: "Помещения",
    addNew: "Добавить помещение",
    columns: ["Помещение", "Объект", "Площадь", "Статус", "Обновлено"],
    status: { AVAILABLE_NOW: "Свободно сейчас", AVAILABLE_FROM_DATE: "Свободно с даты", RESERVED: "Забронировано", LEASED: "Сдано", HIDDEN: "Скрыто", TO_CONFIRM: "Уточняется" },
    editTitle: "Редактировать помещение",
    fields: { project: "Объект", unit: "Помещение", floor: "Этаж", area: "Площадь", uses: "Назначение", from: "Свободно с", status: "Статус", photos: "Фото", plan: "План" },
    photosValue: "3 фотографии",
    planValue: "plan.pdf",
    update: "Обновить",
    back: "Все помещения",
    saved: "Обновлено. Сайт показывает новый статус.",
    savedLeased: "Обновлено. Помещение исчезло с сайта — в WordPress оно остаётся с новым статусом.",
    siteTitle: "Сейчас сдаётся",
    siteCount: "На сайте: {n}",
    siteEmpty: "Свободных помещений нет.",
    hidden: "Помещения со статусом «Сдано», «Скрыто» и «Уточняется» не публикуются.",
    hint: "Выберите «Сдано» и нажмите «Обновить».",
  },
  en: {
    menu: ["Dashboard", "Projects", "Leasing", "Careers", "Media", "Pages"],
    menuActive: 2,
    listTitle: "Spaces",
    addNew: "Add new space",
    columns: ["Space", "Property", "Area", "Status", "Updated"],
    status: { AVAILABLE_NOW: "Available now", AVAILABLE_FROM_DATE: "Available from date", RESERVED: "Reserved", LEASED: "Leased", HIDDEN: "Hidden", TO_CONFIRM: "To confirm" },
    editTitle: "Edit space",
    fields: { project: "Property", unit: "Space", floor: "Floor", area: "Area", uses: "Use", from: "Available from", status: "Status", photos: "Photos", plan: "Plan" },
    photosValue: "3 photos",
    planValue: "plan.pdf",
    update: "Update",
    back: "All spaces",
    saved: "Updated. The site shows the new status.",
    savedLeased: "Updated. The space has left the site — in WordPress it stays, with its new status.",
    siteTitle: "Available now",
    siteCount: "On the site: {n}",
    siteEmpty: "No spaces available.",
    hidden: "Spaces marked “Leased”, “Hidden” or “To confirm” are not published.",
    hint: "Choose “Leased” and press “Update”.",
  },
};

export function CmsWorkflowPage({ locale }: { locale: SiteLocale }) {
  const c = copy[locale];
  const records = allSpacesForCmsPrototype.map((space) => ({
    id: space.id,
    code: space.code,
    project: getProject(space.project)!.name,
    unit: space.unit[locale],
    area: formatAreaRange(space.areaMin, space.area, locale),
    floor: space.floorLabel[locale],
    uses: space.uses.map((key) => uses.find((u) => u.key === key)!.label[locale]).join(", "),
    from: space.availableFrom && space.availableFrom > today ? formatDate(space.availableFrom, locale) : "—",
    status: space.status,
    updated: space.updated.split("-").reverse().join("."),
  }));

  return (
    <PageShell locale={locale} experience mainClassName="cms-page">
      <section className="xp-pagehero">
        <div className="xp-shell xp-pagehero__grid">
          <p className="xp-eyebrow"><span className="xp-eyebrow__no">CMS</span><span>{c.label}</span></p>
          <div>
            <h1 className="xp-pagehero__title">{c.title}</h1>
            <p className="xp-pagehero__lead xp-pagehero__lead--gap">{c.lead}</p>
          </div>
          <ol className="cms-path" aria-label={c.label}>
            {c.path.map((step, i) => (
              <li key={step}><span>{String(i + 1).padStart(2, "0")}</span>{step}</li>
            ))}
          </ol>
        </div>
      </section>

      <section className="xp-sec xp-sec--flush-top xp-sec--warm">
        <div className="xp-shell">
          <CmsPrototype records={records} copy={cmsCopy[locale]} initial="moscova-20-corner" statuses={spaceStatuses} publishedStatuses={publishedStatuses} />
        </div>
      </section>

      <section className="xp-sec">
        <div className="xp-shell">
          <Opening no="01" label={c.afterLabel} title={c.never} className="xp-opening--split" />
          <ol className="xp-process" style={{ "--n": c.after.length } as CSSProperties}>
            {c.after.map(([title, text]) => (
              <li key={title}>
                <h3>{title}</h3>
                <p>{text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="xp-sec xp-sec--stone">
        <div className="xp-shell">
          <p className="xp-eyebrow xp-eyebrow--gap"><span className="xp-eyebrow__no">02</span><span>{c.tasksLabel}</span></p>
          <ul className="cms-tasks">
            {c.tasks.map(([title, path]) => (
              <li key={title}>
                <h3>{title}</h3>
                <p>{path}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </PageShell>
  );
}
