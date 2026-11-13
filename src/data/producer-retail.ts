import { T } from "@/data/leasing-experience-model";
import { contactLinks } from "@/data/demo-content";
import type { Localized, SiteLocale } from "@/lib/site-data";

/**
 * PRODUCER DIRECT RETAIL (OWNER «MEGAPARC — PRODUCER DIRECT RETAIL STRATEGY R10», 2026-11-13). One source for the copy of
 *   · the Leasing block «Для производителей и брендов» — six advantages of a manufacturer's own store (§02);
 *   · the strengthening of the fifth Moscova 20 format «Фирменный магазин производителя» — three advantages, the use of the two
 *     levels within the technical constraints, the link to the R8 commercial terms (§03; the scenario is not duplicated);
 *   · the consultation action «Оценить экономику собственного магазина» (§05) — the OWNER-confirmed e-mail with the subject and a
 *     short template that keep the producer-store context; no form, nothing «sent», no confirmation.
 * Tone: professional and balanced — no accusation of retail chains, never a promise that an own store is more profitable; MEGAPARC
 * is the owner and landlord of the premises, never the operator of the store or a financial adviser.
 */

export const producerBlock = {
  label: T("Pentru producători și branduri", "Для производителей и брендов", "For Manufacturers & Brands"),
  title: T("Produsul dumneavoastră. Raftul dumneavoastră. Cumpărătorul dumneavoastră.", "Ваш продукт. Ваша полка. Ваш покупатель.", "Your product. Your shelf. Your customer."),
  lead: T(
    "Un magazin propriu este un canal direct de la producție la cumpărător: mai mult control asupra prețului, sortimentului și banilor. MEGAPARC oferă spații pentru acest format și verifică împreună cu dumneavoastră fezabilitatea lor tehnică.",
    "Собственный магазин — прямой канал от производства к покупателю: больше контроля над ценой, ассортиментом и деньгами. MEGAPARC предлагает помещения для такого формата и вместе с вами проверяет их техническую реализуемость.",
    "A store of your own is a direct channel from production to the customer: more control over price, range and cash. MEGAPARC offers premises for this format and checks their technical feasibility with you.",
  ),
  advantages: [
    {
      title: T("Prețul și marja proprii", "Своя цена и своя маржа", "Your own price and margin"),
      text: T("Prețul de vânzare cu amănuntul și adaosul le stabiliți dumneavoastră — fără intermediar între producție și cumpărător.", "Розничную цену и наценку устанавливаете вы — без посредника между производством и покупателем.", "You set the retail price and the markup — with no intermediary between production and the customer."),
    },
    {
      title: T("Expunere fără aprobări", "Выкладка без согласований", "Display without approvals"),
      text: T("Sortimentul, expunerea și prezentarea produsului le decide brandul, nu negocierea cu rețeaua comercială.", "Ассортимент, выкладку и подачу продукта определяет бренд, а не согласование с торговой сетью.", "The brand decides the range, the display and how the product is presented — not a negotiation with a retail chain."),
    },
    {
      title: T("Libertatea de a testa produse noi", "Свобода тестировать новинки", "Freedom to test new products"),
      text: T("Un produs sau un SKU nou ajunge imediat pe raft — cererea se verifică pe cumpărători reali.", "Новый продукт или SKU выходит на полку сразу — спрос проверяется на реальных покупателях.", "A new product or SKU goes on the shelf at once — demand is tested on real customers."),
    },
    {
      title: T("Brandul și clienții proprii", "Свой бренд и своя клиентская база", "Your brand, your customer base"),
      text: T("Contact direct cu cumpărătorul: feedback, programe de fidelitate, date proprii despre cerere.", "Прямой контакт с покупателем: обратная связь, программы лояльности, собственные данные о спросе.", "Direct contact with the buyer: feedback, loyalty programmes, your own demand data."),
    },
    {
      title: T("Banii de la cumpărător — imediat", "Деньги от покупателя — сразу", "Cash from the customer, at once"),
      text: T("Plata vine în ziua vânzării, nu după amânarea de plată din contractul de livrare.", "Оплата поступает в день продажи, а не после отсрочки платежа по договору поставки.", "Payment arrives on the day of the sale, not after the payment term of a supply contract."),
    },
    {
      title: T("Mai puțină dependență de condițiile rețelelor", "Меньше зависимости от условий сетей", "Less dependence on chain terms"),
      text: T(
        "Un canal propriu reduce ponderea bonusurilor retroactive, a taxelor de listare și a schimbărilor de politică comercială a rețelelor în economia dumneavoastră.",
        "Собственный канал снижает долю ретро‑бонусов, платы за листинг и изменений коммерческой политики сетей в вашей экономике.",
        "Your own channel reduces the weight of retro-bonuses, listing fees and changes in chains' commercial policy in your economics.",
      ),
    },
  ],
  balance: T(
    "Un magazin propriu nu înlocuiește rețelele comerciale și nu este întotdeauna mai profitabil decât vânzarea prin ele: rezultatul depinde de marja dumneavoastră, de fluxul de cumpărători și de costurile punctului. De aceea, cele două canale se compară pe cifrele dumneavoastră.",
    "Собственный магазин не заменяет торговые сети и не всегда выгоднее продаж через них: результат зависит от вашей маржи, потока покупателей и расходов на точку. Поэтому два канала сравниваются на ваших цифрах.",
    "A store of your own does not replace retail chains and is not always more profitable than selling through them: the result depends on your margin, footfall and the costs of the outlet. That is why the two channels are compared on your figures.",
  ),
  exampleLabel: T("Exemplu · Moscova 20", "Пример · Moscova 20", "Example · Moscova 20"),
  /** {area} — the marketed area read from the unit record M20-01, never typed here */
  exampleText: T(
    "{area} pe bulevardul Moscova: vitrine spre bulevard, intrare directă de pe trotuar, două niveluri și intrare de serviciu din curte pentru livrări.",
    "{area} на бульваре Москова: витрины на бульвар, прямой вход с тротуара, два уровня и служебный вход со двора для поставок.",
    "{area} on Moscova Boulevard: glazing to the boulevard, a direct entrance from the pavement, two levels and a service entrance from the courtyard for deliveries.",
  ),
  exampleLink: T("Vezi scenariul „Magazin de firmă al producătorului”", "Смотреть сценарий «Фирменный магазин производителя»", "See the “Manufacturer's Own Store” scenario"),
  role: T(
    "MEGAPARC este proprietarul și locatorul spațiilor. Magazinul îl conduce producătorul; decizia financiară vă aparține.",
    "MEGAPARC — собственник и арендодатель помещений. Магазином управляет производитель; финансовое решение остаётся за вами.",
    "MEGAPARC owns and leases the premises. The store is run by the manufacturer; the financial decision is yours.",
  ),
  /** OWNER preview only — the CFO-model prototype is not published until its methodology is verified (R10 §04) */
  prototype: T("Prototipul modelului CFO · OWNER preview", "Прототип CFO‑модели · OWNER preview", "CFO model prototype · OWNER preview"),
};

/** §03 — added to the existing fifth Moscova 20 format (never a second section) */
export const producerFormat = {
  advantagesTitle: T("De ce un magazin propriu", "Почему собственный магазин", "Why a store of your own"),
  // OWNER R10 §03 — the RU wording verbatim; RO / EN adapted from the meaning
  advantages: [
    { title: T("Controlul marjei", "Контроль маржи", "Margin control"), text: T("Politică de preț proprie și posibilitatea de a gestiona adaosul comercial cu amănuntul.", "Собственная ценовая политика и возможность управлять розничной наценкой.", "Your own pricing policy and the ability to manage the retail markup.") },
    { title: T("Sortimentul propriu", "Свой ассортимент", "Your own range"), text: T("Gestionarea independentă a expunerii, a pozițiilor noi și a promovării produselor.", "Самостоятельное управление выкладкой, новыми позициями и продвижением продукции.", "Independent control of the display, new lines and product promotion.") },
    { title: T("Rulaj mai rapid al banilor", "Быстрее денежный оборот", "Faster cash turnover"), text: T("Plata directă de către cumpărători și o dependență mai mică de amânările lungi de plată ale rețelelor comerciale.", "Прямая оплата покупателями и снижение зависимости от длительных отсрочек торговых сетей.", "Direct payment by customers and less dependence on the long payment terms of retail chains.") },
  ],
  levelsTitle: T("Cum pot fi folosite cele două niveluri", "Как можно использовать два уровня", "How the two levels can be used"),
  levels: {
    ground: {
      title: T("Vitrină și vânzări", "Витрина и продажи", "Shop window and sales"),
      text: T("Vitrine spre bulevard, intrare de pe trotuar, sala de vânzare, casa și expunerea sortimentului de bază.", "Витрины на бульвар, вход с тротуара, торговый зал, касса и выкладка ключевого ассортимента.", "Glazing to the boulevard, the entrance from the pavement, the sales floor, the till and the core range on display."),
    },
    lower: {
      title: T("Sortiment și stoc", "Ассортимент и запас", "Range and stock"),
      text: T("Sortimentul complet, prezentări de produse și lucrul cu clienții angro; încăperi auxiliare pentru stocul de produse.", "Полный ассортимент, презентации продукции и работа с оптовыми клиентами; вспомогательные помещения для запаса продукции.", "The full range, product presentations and work with wholesale clients; support rooms for product stock."),
    },
  },
  /** the technical constraints — {ground} / {lower}: the approximate heights of the unit record M20-01 */
  levelsNote: T(
    "Nivelurile sunt legate prin scara interioară; livrările — prin intrarea de serviciu din curte. Înălțimea ≈ {ground} m la parter și ≈ {lower} m la demisol. Climatizare: parterul — sisteme split, demisolul — sistem cu canale. Condițiile de păstrare, regimul de temperatură, echipamentele frigorifice și evacuarea aerului se stabilesc la verificarea tehnică pentru produsul dumneavoastră.",
    "Уровни связаны внутренней лестницей; поставки — через служебный вход со двора. Высота ≈ {ground} м на первом этаже и ≈ {lower} м в цоколе. Кондиционирование: первый этаж — сплит‑системы, цоколь — канальная система. Условия хранения, температурный режим, холодильное оборудование и вытяжка определяются при технической проверке под ваш продукт.",
    "The levels are linked by the inner stair; deliveries come through the service entrance from the courtyard. Height ≈ {ground} m on the ground floor and ≈ {lower} m on the lower ground. Air conditioning: split systems on the ground floor, a ducted system on the lower ground. Storage conditions, temperature, refrigeration equipment and extraction are determined at the technical check for your product.",
  ),
  levelsCaption: T("Scenariu posibil · se precizează la verificarea tehnică", "Возможный сценарий · уточняется при технической проверке", "A possible scenario · confirmed at the technical check"),
  /** the R8 commercial terms stay where they are (#commercial) — rates, deposit, utilities + 15 %, indexation; never repeated here */
  termsLink: T("Condițiile comerciale Moscova 20: tarife, garanție, utilități și indexare", "Коммерческие условия Moscova 20: ставки, депозит, коммунальные платежи и индексация", "Moscova 20 commercial terms: rates, deposit, utilities and indexation"),
};

/** §05 — the action and the real channel; the e-mail subject keeps the context (Leasing or Moscova 20), the body lists what to bring */
export const consultCopy = {
  cta: T("Evaluați economia magazinului propriu", "Оценить экономику собственного магазина", "Assess the economics of your own store"),
  note: T("Se deschide un e-mail către MEGAPARC cu subiectul solicitării. Sau sunați:", "Откроется письмо в MEGAPARC с темой обращения. Или позвоните:", "An e-mail to MEGAPARC opens with the subject of the request. Or call:"),
  subject: { ro: "Magazin de firmă al producătorului — evaluarea economiei", ru: "Фирменный магазин производителя — оценка экономики", en: "Manufacturer's own store — economics review" } satisfies Localized,
  body: {
    ro: ["Bună ziua! Suntem producător și dorim să evaluăm economia unui magazin propriu.", "", "Compania și categoria de produse:", "Vânzările actuale prin rețelele comerciale (pe lună, fără TVA):", "Suprafața necesară și termenul dorit de deschidere:", "Telefon de contact:"],
    ru: ["Здравствуйте! Мы производитель и хотим оценить экономику собственного магазина.", "", "Компания и категория продукции:", "Продажи через торговые сети сейчас (в месяц, без НДС):", "Нужная площадь и желаемый срок открытия:", "Телефон для связи:"],
    en: ["Hello, we are a manufacturer and would like to assess the economics of our own store.", "", "Company and product category:", "Current sales through retail chains (per month, excl. VAT):", "Space needed and target opening date:", "Contact telephone:"],
  } satisfies Record<SiteLocale, string[]>,
};

/** mailto: the OWNER-confirmed address only (qa-static allows its subject / body parameters, never another address) */
export function consultHref(locale: SiteLocale, property?: string) {
  const subject = property ? `${property} · ${consultCopy.subject[locale]}` : consultCopy.subject[locale];
  const body = consultCopy.body[locale].join("\r\n");
  // encodeURIComponent leaves ! ' ( ) * as they are — the apostrophe of «Manufacturer's» would reach the HTML as an entity
  const enc = (text: string) => encodeURIComponent(text).replace(/[!'()*]/g, (ch) => `%${ch.charCodeAt(0).toString(16).toUpperCase()}`);
  return `${contactLinks.email}?subject=${enc(subject)}&body=${enc(body)}`;
}
