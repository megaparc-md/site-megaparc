import type { SiteLocale } from "@/lib/site-data";

/**
 * MEGAPARC COMMERCIAL ASSISTANT — shared types (OWNER «INTELLIGENT COMMERCIAL ASSISTANT», 2026-11-24).
 *
 * Three layers, each replaceable without touching the others (docs/ASSISTANT_ARCHITECTURE.md):
 *   1. DATA      — `AssistantData`: what the assistant may state. Built on the server from the one content source
 *                  (src/content/source.ts → later WordPress), so a status changed in the register changes every answer.
 *   2. TRANSPORT — `AssistantTransport`: who answers. Today `localTransport` (the guided scenarios, in the browser, nothing
 *                  sent anywhere). Later a server endpoint (AI + knowledge base + operator hand-off) behind the same interface.
 *   3. UI        — the launcher and the panel: they render `Reply` objects and know nothing about where they came from.
 */

/** A building of the leasing portfolio with an active offer — status and area are the register's own strings. */
export type AssistantOffer = {
  slug: string;
  name: string;
  /** localised page path (without the base path — rendered through next/link) */
  href: string;
  /** the status line of the header menu, the Projects page and the property page — derived, never typed */
  status: string;
  tone: "now" | "soon";
  /** the published unit's area in m², or null when the offer is «area and timing on request» */
  unitArea: number | null;
  /** the unit ids whose /leasing/<id> page belongs to this building */
  unitIds: string[];
};

/** `unitIds`: unit pages of the building that a build still publishes (an older register) — they belong to its context too */
export type AssistantFullyLet = { slug: string; name: string; href: string; status: string; unitIds: string[] };

/** `model`: the plot's page publishes a project calculator in this edition; without it the page offers a consultation instead */
export type AssistantLand = { slug: string; name: string; area: string | null; href: string; hasPage: boolean; model: boolean };

export type AssistantContacts = {
  email: string;
  emailHref: string;
  mobile: string;
  mobileHref: string;
  landline: string;
  landlineHref: string;
};

export type AssistantData = {
  locale: SiteLocale;
  offers: AssistantOffer[];
  fullyLet: AssistantFullyLet[];
  land: AssistantLand[];
  contacts: AssistantContacts;
  /** the Moscova 20 commercial proposal of the language (a published PDF) or null */
  m20Offer: string | null;
  /** the Visit Planner (OWNER «VISIT PLANNER & COMMERCIAL DESK V1», stage 1): the properties a date and time can be chosen for, and the
   *  label of that action — absent where the planner is not offered (the production edition) */
  planner?: { slugs: string[]; label: string } | null;
};

/* ------------------------------------------------------------------ */
/* Conversation                                                         */
/* ------------------------------------------------------------------ */

/** Where the visitor is — derived from the URL (locale + route), never from tracking. */
export type AssistantContext = {
  key: "home" | "leasing" | "projects" | "offer-property" | "fully-let" | "land" | "development" | "pack" | "invest" | "offer" | "contact" | "calculator" | "company" | "other";
  /** the building or the plot of the page, when it has one */
  slug: string | null;
  name: string | null;
  /** locale-neutral route of the page («/projects/moscova-20») */
  path: string;
};

export type AssistantAction =
  /** a page of the site; `hash` lists candidate anchors — the first one that exists on the page is opened (a section or a drawer) */
  | { kind: "route"; label: string; path: string; hash?: string[]; primary?: boolean; /** another language edition of the same route */ locale?: SiteLocale }
  /** a letter the visitor sends from their own mail app — the site sends nothing */
  | { kind: "mail"; label: string; subject: string; body: string[]; primary?: boolean }
  | { kind: "tel"; label: string; href: string; primary?: boolean }
  | { kind: "file"; label: string; href: string; meta?: string; primary?: boolean };

export type AssistantCard = { title: string; meta: string; status?: string; tone?: "now" | "soon" | "full" | "quiet"; note?: string; action?: AssistantAction };

export type AssistantChip = { label: string; node: string; set?: Record<string, string> };

export type AssistantReply = {
  text: string[];
  cards?: AssistantCard[];
  actions?: AssistantAction[];
  chips?: AssistantChip[];
  /** a quiet line under the answer: a limit of the answer, a disclaimer */
  note?: string;
};

export type AssistantAnswers = Record<string, string>;

/** A file of the live conversation: `id` is the server message that holds it (null while it is being sent). */
export type AssistantFile = { id: number | null; name: string; mime: string; size: number; image: boolean };

/**
 * The thread. Guided turns (`visitor` without `live`, `assistant`) never leave the browser. Live turns belong to the
 * conversation with the managers: the visitor's own messages (with their delivery state), an employee's messages, and
 * the lines of the service itself («the office is closed», «the conversation was closed»).
 */
export type AssistantTurn =
  | { from: "visitor"; text: string; at?: number; live?: { key: string; id: number | null; state: "sending" | "sent" | "pending" | "failed"; channel: "site" | "telegram"; file?: AssistantFile } }
  | { from: "assistant"; reply: AssistantReply; at?: number; opening?: boolean }
  | { from: "manager"; id: number; text: string; author: string | null; file?: AssistantFile; at: number }
  | { from: "system"; id: number | null; code: string };

/**
 * The transport contract. `localTransport` implements it in the browser; the future server transport implements the same two
 * calls over HTTPS (POST <endpoint>/reply) — the API keys, the knowledge base and the operator channel live on that server,
 * never in this bundle.
 */
export type AssistantRequest =
  | { type: "open" }
  | { type: "chip"; node: string }
  | { type: "text"; text: string };

export type AssistantTransport = {
  /** true when a human or an AI is really behind the channel — the UI words its status line from this, never from wishes */
  readonly live: boolean;
  reply(request: AssistantRequest, context: AssistantContext, answers: AssistantAnswers, data: AssistantData): Promise<AssistantReply> | AssistantReply;
};
