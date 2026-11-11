import type { SpaceNeed, SpaceUse } from "@/data/leasing-inventory";
import type { Localized } from "@/lib/site-data";

/**
 * Tenant-first leasing taxonomy (OWNER correction 2026-10-08, "TENANT-FIRST UX"):
 * a tenant does not need square metres, they need a property that solves a
 * business problem. "What are you opening?" → "What matters?" → recommended
 * available spaces with the reasons. Values per space live in
 * src/data/leasing-inventory.ts (fit levels with their data status).
 */

export const uses: { key: SpaceUse; label: Localized; goal: Localized; typical: SpaceNeed[] }[] = [
  { key: "retail", label: { ro: "Retail", ru: "Магазин", en: "Retail" }, goal: { ro: "Clienți din stradă", ru: "Покупатели с улицы", en: "Customers from the street" }, typical: ["visibility", "flow", "ground", "delivery", "parking"] },
  { key: "office", label: { ro: "Birou", ru: "Офис", en: "Office" }, goal: { ro: "O echipă care lucrează bine", ru: "Удобно работать всей командой", en: "A team that works well" }, typical: ["parking", "flexible", "fast", "entrance", "power"] },
  { key: "showroom", label: { ro: "Showroom", ru: "Шоурум", en: "Showroom" }, goal: { ro: "Produsul la vedere", ru: "Продукт на виду", en: "The product on show" }, typical: ["visibility", "ground", "flexible", "parking", "delivery"] },
  { key: "clinic", label: { ro: "Clinică", ru: "Клиника", en: "Clinic" }, goal: { ro: "Pacienți primiți comod", ru: "Удобный приём пациентов", en: "Patients received with ease" }, typical: ["ground", "entrance", "parking", "power", "ventilation"] },
  { key: "services", label: { ro: "Servicii", ru: "Сервис", en: "Services" }, goal: { ro: "Aproape de clienți", ru: "Рядом с клиентами", en: "Close to customers" }, typical: ["ground", "entrance", "flow", "parking", "fast"] },
  { key: "fnb", label: { ro: "Cafenea / restaurant", ru: "Кафе / ресторан", en: "Café / restaurant" }, goal: { ro: "Oaspeți zi și seară", ru: "Гости днём и вечером", en: "Guests day and evening" }, typical: ["ventilation", "power", "visibility", "flow", "delivery"] },
];

export const needs: Record<SpaceNeed, { label: Localized; why: Localized }> = {
  visibility: { label: { ro: "Vizibilitate", ru: "Видимость", en: "Visibility" }, why: { ro: "Clienții vă văd înainte să vă caute.", ru: "Клиенты видят вас раньше, чем начинают искать.", en: "Customers see you before they search for you." } },
  flow: { label: { ro: "Flux de clienți", ru: "Поток клиентов", en: "Customer flow" }, why: { ro: "Oamenii trec pe lângă ușa dumneavoastră în fiecare zi.", ru: "Люди проходят мимо вашей двери каждый день.", en: "People pass your door every day." } },
  parking: { label: { ro: "Parcare", ru: "Парковка", en: "Parking" }, why: { ro: "Clienții și echipa ajung cu mașina fără efort.", ru: "Клиентам и команде удобно приезжать на машине.", en: "Customers and staff arrive by car without effort." } },
  ground: { label: { ro: "Parter", ru: "Первый этаж", en: "Ground floor" }, why: { ro: "Intrare fără scări — pentru clienți, pacienți și marfă.", ru: "Вход без лестниц — для клиентов, пациентов и товара.", en: "Step-free entry for customers, patients and goods." } },
  entrance: { label: { ro: "Intrare separată", ru: "Отдельный вход", en: "Separate entrance" }, why: { ro: "Propria adresă, propriul program, propriul control.", ru: "Свой адрес, свой режим работы, свой контроль.", en: "Your own address, hours and control." } },
  power: { label: { ro: "Putere electrică", ru: "Электрическая мощность", en: "Power" }, why: { ro: "Echipamente de bucătărie, medicale sau tehnice fără limite.", ru: "Хватает мощности для кухни, медицинского или технического оборудования.", en: "Kitchen, medical or technical equipment without limits." } },
  ventilation: { label: { ro: "Ventilație", ru: "Вентиляция", en: "Ventilation" }, why: { ro: "Aer, climatizare și evacuare pentru activitatea dumneavoastră.", ru: "Вентиляция, климат и вытяжка под ваш формат.", en: "Air, cooling and extraction for your activity." } },
  delivery: { label: { ro: "Acces pentru livrări", ru: "Подъезд для доставки", en: "Delivery access" }, why: { ro: "Marfa intră pe alt drum decât clienții.", ru: "Товар заходит отдельно от покупателей.", en: "Goods come in by a different route from customers." } },
  flexible: { label: { ro: "Planificare flexibilă", ru: "Гибкая планировка", en: "Flexible layout" }, why: { ro: "Spațiul se schimbă când afacerea crește.", ru: "Пространство меняется, когда бизнес растёт.", en: "The space changes as the business grows." } },
  fast: { label: { ro: "Deschidere rapidă", ru: "Быстрое открытие", en: "Fast opening" }, why: { ro: "Liber acum și gata pentru amenajare.", ru: "Свободно сейчас и готово к отделке.", en: "Free now and ready for fit-out." } },
};

export const needOrder: SpaceNeed[] = ["visibility", "flow", "parking", "ground", "entrance", "power", "ventilation", "delivery", "flexible", "fast"];

/**
 * The same ten needs grouped for scanning (OWNER «FINAL POLISH» §9, 2026-11-11): location / visibility · access /
 * logistics · engineering / utilities · format / flexibility. Presentation only — the field, its values and the
 * submitted data do not change.
 */
export const needGroups: { key: string; label: Localized; needs: SpaceNeed[] }[] = [
  { key: "location", label: { ro: "Locație și vizibilitate", ru: "Локация и видимость", en: "Location and visibility" }, needs: ["visibility", "flow"] },
  { key: "access", label: { ro: "Acces și logistică", ru: "Доступ и логистика", en: "Access and logistics" }, needs: ["ground", "entrance", "parking", "delivery"] },
  { key: "engineering", label: { ro: "Inginerie și utilități", ru: "Инженерия и мощности", en: "Engineering and utilities" }, needs: ["power", "ventilation"] },
  { key: "format", label: { ro: "Format și flexibilitate", ru: "Формат и гибкость", en: "Format and flexibility" }, needs: ["flexible", "fast"] },
];

export const fitCopy = {
  strong: { ro: "Punct forte", ru: "Сильная сторона", en: "Strong" },
  possible: { ro: "Posibil", ru: "Возможно", en: "Possible" },
  limited: { ro: "Limitat", ru: "Ограничено", en: "Limited" },
} satisfies Record<string, Localized>;

/** Area bands — the first question a tenant can answer (journey A: "I need about 200 m²"). */
export const areaBands: { key: string; min: number; max: number; label: Localized }[] = [
  { key: "lt120", min: 0, max: 120, label: { ro: "până la 120 m²", ru: "до 120 м²", en: "up to 120 m²" } },
  { key: "120-300", min: 120, max: 300, label: { ro: "120–300 m²", ru: "120–300 м²", en: "120–300 m²" } },
  { key: "300-700", min: 300, max: 700, label: { ro: "300–700 m²", ru: "300–700 м²", en: "300–700 m²" } },
  { key: "700-1500", min: 700, max: 1500, label: { ro: "700–1.500 m²", ru: "700–1 500 м²", en: "700–1,500 m²" } },
  { key: "gt1500", min: 1500, max: 100000, label: { ro: "1.500+ m²", ru: "1 500+ м²", en: "1,500+ m²" } },
];

/** A space fits a band when its offered range overlaps the band. */
export const fitsBand = (band: { min: number; max: number }, area: number, areaMin?: number) => (areaMin ?? area) <= band.max && area >= band.min;

/** Commercial process — the same five steps on the leasing page and every unit page. */
export const leasingSteps: { title: Localized; text: Localized }[] = [
  { title: { ro: "Cererea", ru: "Запрос", en: "Request" }, text: { ro: "Ce deschideți, ce suprafață, ce este critic.", ru: "Что открываете, какая площадь, что критично.", en: "What you open, how much space, what is critical." } },
  { title: { ro: "Vizionarea", ru: "Просмотр", en: "Viewing" }, text: { ro: "Pe obiect, cu specialistul tehnic.", ru: "На объекте, вместе с техническим специалистом.", en: "On site, with the technical specialist." } },
  { title: { ro: "Verificare tehnică", ru: "Техническая проверка", en: "Technical check" }, text: { ro: "Putere, ventilație, acces, amenajare.", ru: "Мощность, вентиляция, доступ, отделка.", en: "Power, ventilation, access, fit-out." } },
  { title: { ro: "Propunerea", ru: "Предложение", en: "Proposal" }, text: { ro: "Condiții pentru formatul dumneavoastră — discutate direct.", ru: "Условия под ваш формат — обсуждаются напрямую.", en: "Terms for your format — discussed directly." } },
  { title: { ro: "Contract și deschidere", ru: "Договор и открытие", en: "Lease and opening" }, text: { ro: "Predarea spațiului, amenajarea, deschiderea.", ru: "Передача помещения, отделка, открытие.", en: "Handover, fit-out, opening." } },
];

export const noPrice: Localized = {
  ro: "Condițiile comerciale se discută direct și nu se publică.",
  ru: "Условия аренды обсуждаем напрямую — на сайте их нет.",
  en: "Commercial terms are discussed directly and are not published.",
};
