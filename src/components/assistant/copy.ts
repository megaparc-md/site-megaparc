import type { SiteLocale } from "@/lib/site-data";

/**
 * The assistant's wording — one object per language (copy-ru.ts is the master; RO and EN are adaptations with the same meaning,
 * RO in the polite plural). Loaded on the first opening of the panel, for the page's language only, so the pages do not carry it.
 *
 * Rules of this copy (OWNER «INTELLIGENT COMMERCIAL ASSISTANT», 2026-11-24 + the standing rules of the site):
 *   — no rate, price, yield, term or availability is written here: a status, an area or a name comes from the register;
 *   — never a working operator or a sent message: the visitor sends the letter from their own mail app, and the copy says so;
 *   — a viewing is always a «request», never a confirmed appointment;
 *   — investment wording never reads as a public investment product.
 */
export type AssistantCopy = {
  ui: {
    title: string;
    kicker: string;
    /** the honest status of the channel while no person and no AI is connected */
    status: string;
    statusLabel: string;
    placeholder: string;
    send: string;
    close: string;
    restart: string;
    visitor: string;
    assistant: string;
    thread: string;
    languages: string;
    mailHint: string;
    inputNote: string;
    here: string;
  };
  chips: Record<string, string>;
  formats: Record<string, string>;
  areas: Record<string, string>;
  times: Record<string, string>;
  start: {
    generic: string[];
    leasing: string[];
    invest: string[];
    calculator: string[];
    development: string[];
    land: (name: string, area: string | null) => string[];
    unit: (name: string, status: string) => string[];
    picker: (name: string, status: string) => string[];
  };
  property: { unit: (name: string, status: string) => string[]; picker: (name: string, status: string) => string[]; generic: (name: string, status: string) => string[] };
  menu: string[];
  rent: { none: string[]; askFormat: string[]; askArea: string[]; result: string[]; note: string };
  fit: { onRequest: string; larger: string; within: string; smaller: string };
  let: { withOffers: (name: string, status: string) => string[]; noOffers: (name: string, status: string) => string[] };
  unit: { plans: string[]; terms: string[]; economics: string[]; offer: string[] };
  pick: { askArea: string[]; askFormat: string[]; result: (name: string) => string[]; note: string; plans: string[] };
  land: { intro: string[]; areaPending: string; note: string; scenarios: (name: string) => string[]; model: (name: string) => string[]; pack: (name: string) => string[]; deals: string[]; discuss: string[]; genericName: string };
  calc: { intro: string[]; point: { title: string; meta: (name: string) => string }; producer: { title: string; meta: string }; land: { title: string; meta: (name: string) => string } };
  viewing: { askWhen: (name: string) => string[]; askProperty: string[]; result: (name: string) => string[]; note: string };
  invest: { ask: string[]; investor: string[]; owner: string[]; developer: string[]; contractor: string[] };
  manager: string[];
  guard: { terms: (name: string) => string[]; termsNoUnit: string[]; returns: string[] };
  careers: string[];
  fallback: string[];
  notes: { calc: string; scenario: string; invest: string };
  actions: {
    open: (name: string) => string;
    call: (number: string) => string;
    write: string;
    writeContext: string;
    sendRequest: string;
    sendViewing: string;
    sendQuestion: string;
    askTerms: string;
    plans: string;
    terms: string;
    economics: string;
    offerPdf: string;
    pdf: string;
    pack: string;
    buildingPlans: string;
    allLand: string;
    scenarios: string;
    model: string;
    pack2: string;
    requestPack: string;
    deals: string;
    producer: string;
    viewingSection: string;
    partnership: string;
    offerProperty: string;
    contactPage: string;
    careers: string;
  };
  subject: {
    page: (name: string) => string;
    lease: string;
    pick: (name: string) => string;
    pack: (name: string) => string;
    land: (name: string) => string;
    viewing: (name: string) => string;
    partnership: string;
    property: string;
    cooperation: string;
    question: string;
    terms: string;
  };
  mail: {
    hello: string;
    fields: string[];
    sent: string;
    context: (here: string) => string;
    format: (value: string) => string;
    area: (value: string) => string;
    property: (name: string) => string;
    packLine: string;
    viewing: (name: string) => string;
    time: (value: string) => string;
    propertyFields: string[];
    question: (text: string) => string;
  };
  /**
   * The live chat with the managers (shown only when the assistant server is configured and connected). The wording never
   * promises a reply time and never says «online»: it says who receives the message and where the answer will appear.
   */
  live: {
    status: string;
    statusClosed: string;
    with: (name: string) => string;
    manager: string;
    placeholder: string;
    attach: string;
    sent: string;
    managerReply: string[];
    events: Record<string, string>;
    states: { sending: string; pending: string; failed: string; retry: string };
    errors: Record<string, string>;
    telegram: string;
    telegramHint: string;
    download: string;
    unread: string;
    fromTelegram: string;
    privacy: { short: string; more: string; less: string; details: (days: number) => string[]; test: string; erase: string; eraseConfirm: string; eraseYes: string; eraseNo: string; erased: string };
  };
  /** words that route a typed question to a scenario (matched lower-case, without diacritics) */
  intents: Record<"returns" | "terms" | "viewing" | "calc" | "land" | "invest" | "rent" | "careers" | "manager" | "hello", string[]>;
};

export async function loadCopy(locale: SiteLocale): Promise<AssistantCopy> {
  if (locale === "ru") return (await import("@/components/assistant/copy-ru")).copy;
  if (locale === "en") return (await import("@/components/assistant/copy-en")).copy;
  return (await import("@/components/assistant/copy-ro")).copy;
}

/** A status line inside a sentence: «Свободно сейчас · 625,7 м²» → «свободно сейчас · 625,7 м²». */
export const lowerFirst = (text: string) => (text ? text.charAt(0).toLocaleLowerCase() + text.slice(1) : text);

/**
 * Typesetting of a chat line (docs/RU_MICROCOPY.md §5): a dash never starts a line and a one- or two-letter word never
 * hangs at the end of one — the space after it becomes a no-break space. Applied at render, so the copy stays readable.
 */
const NB = String.fromCharCode(160); // a no-break space — never typed literally: it is invisible in review
const SHORT_WORD = /(^|[\s(«\"„])([A-Za-zА-Яа-яЁёĂÂÎȘȚăâîșț]{1,2}) (?=\S)/g;
export function tie(text: string): string {
  return text.replace(/ (—|–) /g, `${NB}$1 `).replace(SHORT_WORD, `$1$2${NB}`);
}
