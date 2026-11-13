/**
 * SEMANTIC EMPHASIS — the editorial register of bold accents (OWNER «SEMANTIC TYPOGRAPHY & EDITORIAL EMPHASIS», 2026-11-12).
 *
 * The principle: the accent marks the main idea that strengthens the commercial message — never «the last word of the sentence».
 * A statement that is not in this register carries NO accent: a calm headline is a valid composition, and one strong accent is
 * better than three weak ones. The copy itself is not stored here and is not changed: the register maps an approved statement
 * (as it is written in the datasets) to the phrase inside it that is set in Manrope 700 — or to `null` when the statement
 * stays calm on purpose.
 *
 * The same IDEA is marked in RU / RO / EN; the words and their position differ by language.
 * Every accent supports a real advantage: location · visibility · quality of the space · technical preparation · convenience for
 * customers · flexibility of use · economic sense · long-term opportunity. No abstract superlative is ever marked.
 * Audit and rationale: docs/qa/2026-11-12-semantic-emphasis/README.md.
 *
 * Matching is tolerant of typesetting: spaces of any kind are ignored in the statement key; inside a line the phrase is found
 * regardless of no-break spaces, the non-breaking hyphen and the typographic apostrophe.
 */
const register: [statement: string, emphasis: string | null][] = [
  // ---- Moscova 20 · immediate availability ----
  ["Пространство для следующего шага вашего бизнеса.", "следующего шага"], // the growth of the tenant's business, not the word «бизнеса»
  ["Spațiu pentru următorul pas al afacerii dumneavoastră.", "următorul pas"],
  ["Space for your business's next step.", "next step."],
  ["Основа для вашего бизнеса уже создана.", "уже создана."], // technical preparation: the base already exists
  ["Baza pentru afacerea dumneavoastră este deja pregătită.", "deja pregătită."],
  ["The foundation for your business is already in place.", "already in place."],
  ["625,7 м². Два уровня. Одна концепция.", "Одна концепция."], // flexibility: two levels work as one
  ["625,7 m². Două niveluri. Un singur concept.", "Un singur concept."],
  ["625.7 m². Two levels. One concept.", "One concept."],
  ["Адрес — часть бизнес-модели.", "часть бизнес-модели."], // location as an economic factor — the whole idea, not «модели»
  ["Adresa — parte din modelul de afaceri.", "parte din modelul de afaceri."],
  ["The address — part of the business model.", "part of the business model."],
  ["Вкладывайте в свой бизнес, а не в подготовку помещения.", "в свой бизнес"], // economic sense: where the tenant's money goes
  ["Investiți în afacerea dumneavoastră, nu în pregătirea spațiului.", "în afacerea dumneavoastră"],
  ["Invest in your business, not in preparing the premises.", "in your business"],

  // ---- Moscova 9 · future availability ----
  ["Запланируйте следующую локацию заранее.", "заранее."], // long-term planning — the accent was already right in RU and EN
  ["Planificați din timp următoarea locație.", "din timp"],
  ["Plan your next location early.", "early."],
  ["2 561,3 м². Отдельное здание. Первая линия бульвара.", "Отдельное здание."], // quality of the asset; the location carries the next scene
  ["2.561,3 m². O clădire independentă. Prima linie a bulevardului.", "O clădire independentă."],
  ["2,561.3 m². A stand-alone building. Directly on the boulevard.", "A stand-alone building."],
  ["Адрес — первая линия бульвара.", "первая линия бульвара."], // visibility
  ["Adresa este prima linie a bulevardului.", "prima linie a bulevardului."],
  ["An address directly on the boulevard.", "directly on the boulevard."],
  ["Собственное здание. Адаптация — после технической проверки.", "после технической проверки."], // feasibility first
  ["Clădire proprie. Adaptarea — după verificarea tehnică.", "după verificarea tehnică."],
  ["A building of its own. Adaptation after the technical check.", "after the technical check."],

  // ---- Dacia 31 · a whole building ----
  ["Отдельное здание для одной компании.", "для одной компании."], // exclusivity of use — the phrase, not «компании»
  ["O clădire separată pentru o singură companie.", "pentru o singură companie."],
  ["A separate building for one company.", "for one company."],
  ["5 537,6 м². Одно здание. Одна компания.", null], // calm: the hero has just made this point
  ["5.537,6 m². O clădire. O singură companie.", null],
  ["5,537.6 m². One building. One company.", null],
  ["Въезд в город со стороны аэропорта.", "Въезд в город"], // location
  ["Intrarea în oraș dinspre aeroport.", "Intrarea în oraș"],
  ["The city's entrance from the airport.", "The city's entrance"],
  ["Здание целиком. Адаптация — после технического аудита.", "Здание целиком."], // flexibility of use
  ["O clădire întreagă. Adaptarea — după auditul tehnic.", "O clădire întreagă."],
  ["A whole building. Adaptation after the technical audit.", "A whole building."],

  // ---- Creangă 78 · a fully let operating property ----
  ["Действующий объект, занятый полностью.", "занятый полностью."], // proof of quality
  ["Un obiect în funcțiune, ocupat integral.", "ocupat integral."],
  ["An operating property, fully let.", "fully let."],
  ["2 158,3 м². Занят на 100 %. Лист ожидания открыт.", "Лист ожидания открыт."], // the one thing a visitor can do here
  ["2.158,3 m². Ocupat 100 %. Lista de așteptare este deschisă.", "Lista de așteptare este deschisă."],
  ["2,158.3 m². 100% occupied. The waiting list is open.", "The waiting list is open."],
  ["Улица Иона Крянгэ, Кишинэу.", null], // an address — nothing to stress
  ["Strada Ion Creangă, Chișinău.", null],
  ["Ion Creangă Street, Chișinău.", null],
  ["Объект работает. Помещения заняты.", null], // calm fact; the hero and the statement already carry it
  ["Obiectul funcționează. Spațiile sunt ocupate.", null],
  ["The property operates. Its spaces are let.", null],

  // ---- the final scene of every leasing page ----
  // «Не решайте по фотографиям.» stays calm: the accent used to sit on the negation. The action — «Посмотрите Moscova 20 лично.» — is
  // the cue line under it, already set apart as a whole (600, burgundy); it needs no second accent.
  ["Не решайте по фотографиям.", null],
  ["Nu decideți după fotografii.", null],
  ["Don't decide from photographs.", null],
  ["Помещения заняты.", null],
  ["Spațiile sunt ocupate.", null],
  ["The spaces are let.", null],

  // ---- Leasing Pack · commercial offer ----
  ["Посмотрите Moscova 20 вживую.", "вживую."], // the accent was right in RU; RO and EN marked half a phrase
  ["Vedeți Moscova 20 pe viu.", "pe viu."],
  ["See Moscova 20 in person.", "in person."],
  ["Инженерная основа уже создана.", "уже создана."],
  ["Baza inginerească este deja pregătită.", "deja pregătită."],
  ["The engineering base is already in place.", "already in place."],
  ["Одно пространство — разные форматы.", "разные форматы."], // R8 brochure, use scenarios: the flexibility of the space
  ["Un spațiu — diferite formate.", "diferite formate."],
  ["One space — different formats.", "different formats."],
  // structural titles of the offer stay calm: «Коммерческие условия», «Адрес, который стоит рассмотреть.», the plan pages, the address

  // ---- Leasing · for manufacturers & brands (OWNER R10, 2026-11-13) ----
  ["Ваш продукт. Ваша полка. Ваш покупатель.", "Ваш покупатель."], // the direct relationship with the buyer — the point of an own store
  ["Produsul dumneavoastră. Raftul dumneavoastră. Cumpărătorul dumneavoastră.", "Cumpărătorul dumneavoastră."],
  ["Your product. Your shelf. Your customer.", "Your customer."],
];

const loose = (text: string) => text.replace(/[\s   ]+/g, "").replace(/‑/g, "-").replace(/[’ʼ]/g, "'");
/** one character for one character, so positions in the normalised line are positions in the original line */
const soft = (text: string) => text.replace(/[   ]/g, " ").replace(/‑/g, "-").replace(/[’ʼ]/g, "'");
const index = new Map(register.map(([statement, emphasis]) => [loose(statement), emphasis]));

/** The phrase of `statement` that carries the accent — null when the statement stays calm (or is not in the register). */
export function emphasisOf(statement: string): string | null {
  return index.get(loose(statement)) ?? null;
}

/** Where the accent of `statement` falls inside `line` (one line of that statement): [start, end) in the line's own characters. */
export function emphasisRange(line: string, statement: string): [number, number] | null {
  const phrase = emphasisOf(statement);
  if (!phrase) return null;
  const at = soft(line).indexOf(soft(phrase));
  return at < 0 ? null : [at, at + phrase.length];
}

export const emphasisRegister = register;
