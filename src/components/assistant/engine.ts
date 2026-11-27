import type { AssistantAction, AssistantAnswers, AssistantCard, AssistantChip, AssistantContext, AssistantData, AssistantOffer, AssistantReply, AssistantRequest, AssistantTransport } from "@/components/assistant/types";
import type { AssistantCopy } from "@/components/assistant/copy";

/**
 * MEGAPARC COMMERCIAL ASSISTANT — the scenario engine (OWNER «INTELLIGENT COMMERCIAL ASSISTANT», 2026-11-24).
 *
 * Pure functions, no DOM, no network: (request, page context, the visitor's answers, the portfolio data) → a reply.
 * This is the LOCAL transport of the prototype and, later, the deterministic layer that stays UNDER the AI consultant:
 *   — the guided scenarios keep working when the AI endpoint is unreachable;
 *   — the guardrails below are code, not a prompt: a question about rates, terms or returns is answered by a fixed,
 *     OWNER-safe reply and a link to the published section — a language model is never asked to produce those figures.
 *
 * What the engine may state comes only from `AssistantData` (the leasing register and the portfolio structure, computed on
 * the server) and from the copy. It contains no rate, no yield, no availability of its own.
 */

/* ------------------------------------------------------------------ */
/* Page context                                                         */
/* ------------------------------------------------------------------ */

/** The properties with their own tool set on the page (drawers and sections the assistant can open). */
const UNIT_TOOLS = "moscova-20";
const PICKER = "dacia-31";

export function contextOf(path: string, data: AssistantData): AssistantContext {
  const parts = path.split("/").filter(Boolean);
  const base = { slug: null, name: null, path } as const;
  if (!parts.length) return { key: "home", ...base };
  const [section, id, sub] = parts;
  if (section === "projects" || section === "leasing") {
    if (!id) return { key: section === "leasing" ? "leasing" : "projects", ...base };
    const offer = data.offers.find((item) => item.slug === id || item.unitIds.includes(id));
    if (offer) return { key: sub === "pack" ? "pack" : "offer-property", slug: offer.slug, name: offer.name, path };
    const full = data.fullyLet.find((item) => item.slug === id || item.unitIds.includes(id));
    if (full) return { key: "fully-let", slug: full.slug, name: full.name, path };
    const plot = data.land.find((item) => item.slug === id && item.hasPage);
    if (plot) return { key: "land", slug: plot.slug, name: plot.name, path };
    return { key: section === "projects" ? "development" : "leasing", ...base };
  }
  if (section === "partnership") return { key: "invest", ...base };
  if (section === "offer") return { key: "offer", ...base };
  if (section === "contact") return { key: "contact", ...base };
  if (section === "producer-economics") return { key: "calculator", ...base };
  if (section === "about" || section === "history" || section === "careers") return { key: "company", ...base };
  return { key: "other", ...base };
}

/* ------------------------------------------------------------------ */
/* Free text → scenario (deterministic; the AI consultant replaces only this step)                                       */
/* ------------------------------------------------------------------ */

const normalise = (text: string) =>
  text
    .toLowerCase()
    .replace(/ё/g, "е")
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/\s+/g, " ")
    .trim();

const LETTER = /[\p{L}\p{N}]/u;
/** `word` begins a word of `text` (both normalised); a keyword without letters («€») is matched anywhere */
function matches(text: string, word: string) {
  const w = normalise(word);
  if (!w) return false;
  if (!LETTER.test(w)) return text.includes(w);
  let from = text.indexOf(w);
  while (from !== -1) {
    if (from === 0 || !LETTER.test(text.charAt(from - 1))) return true;
    from = text.indexOf(w, from + 1);
  }
  return false;
}

/** Names a visitor may type for a building or a plot — matched against the register to decide what may be said about it. */
const ALIASES: Record<string, string[]> = {
  "moscova-20": ["moscova 20", "москова 20", "москва 20", "moscow 20"],
  "moscova-9": ["moscova 9", "москова 9", "москва 9", "moscow 9"],
  "dacia-31": ["dacia", "дачия", "дачиа", "дачии"],
  "creanga-78": ["creanga", "крянг", "крянга"],
  drochia: ["drochia", "дроки", "дрокия"],
};

export function intentOf(text: string, data: AssistantData, copy: AssistantCopy): string {
  const t = normalise(text);
  if (!t) return "menu";
  // a word is matched from its beginning («ставк» → «ставка», «ставки»), never inside another word («центр» is not «цена»)
  const has = (words: string[]) => words.some((word) => matches(t, word));
  // guardrails first: figures the assistant never produces
  const returns = has(copy.intents.returns);
  const terms = has(copy.intents.terms);
  // «сколько стоит и какая доходность?» — both guarded topics in one question get both answers
  if (returns && terms) return "figures";
  if (returns) return "returns";
  if (terms) return "terms";
  const named = Object.keys(ALIASES).find((slug) => ALIASES[slug].some((alias) => matches(t, alias)));
  if (named && data.fullyLet.some((item) => item.slug === named)) return `let:${named}`;
  if (has(copy.intents.viewing)) return named && data.offers.some((item) => item.slug === named) ? `viewing:${named}` : "viewing";
  if (has(copy.intents.calc)) return "calc";
  if (named && data.offers.some((item) => item.slug === named)) return `property:${named}`;
  if (named && data.land.some((item) => item.slug === named)) return "land";
  if (has(copy.intents.land)) return "land";
  if (has(copy.intents.invest)) return "invest";
  if (has(copy.intents.rent)) return "rent";
  if (has(copy.intents.careers)) return "careers";
  if (has(copy.intents.manager)) return "manager";
  if (has(copy.intents.hello)) return "start";
  return "fallback";
}

/* ------------------------------------------------------------------ */
/* Replies                                                              */
/* ------------------------------------------------------------------ */

const MENU = ["rent", "land", "calc", "viewing", "invest", "manager"] as const;

/**
 * A typed message always gets a way to reach a person with the visitor's own words: when the ready answer carries no letter
 * with the text, one is added — «open an e-mail with this message». The letter is opened in the visitor's mail app; the site
 * sends nothing and never says a message was sent.
 */
export function buildReply(node: string, context: AssistantContext, answers: AssistantAnswers, data: AssistantData, copy: AssistantCopy, question?: string): AssistantReply {
  const reply = compose(node, context, answers, data, copy, question);
  if (!question) return reply;
  const line = copy.mail.question(question);
  if (reply.actions?.some((action) => action.kind === "mail" && action.body.includes(line))) return reply;
  const letter: AssistantAction = { kind: "mail", label: copy.actions.sendText, subject: copy.subject.question, body: [copy.mail.hello, "", copy.mail.context(copy.subject.page(context.name ?? context.path)), line, "", ...copy.mail.fields, "", copy.mail.sent] };
  return { ...reply, actions: [...(reply.actions ?? []), letter] };
}

function compose(node: string, context: AssistantContext, answers: AssistantAnswers, data: AssistantData, copy: AssistantCopy, question?: string): AssistantReply {
  const c = copy;
  const chip = (key: string, set?: Record<string, string>): AssistantChip => ({ label: c.chips[key] ?? key, node: key, ...(set ? { set } : {}) });
  const menu = (skip: string[] = []): AssistantChip[] => MENU.filter((key) => !skip.includes(key)).map((key) => chip(key));
  const more = chip("menu");
  const offerBy = (slug: string | null | undefined) => data.offers.find((item) => item.slug === slug);
  const plot = data.land.find((item) => item.hasPage) ?? null;
  const plotPath = plot ? `/projects/${plot.slug}` : null;
  /** the plot's economics: a calculator where the page publishes one, otherwise the consultation the page offers */
  const landCalc = () => chip(plot?.model ? "land.model" : "land.consult");
  const page = (slug: string) => `/projects/${slug}`;
  const here = c.subject.page(context.name ?? context.path);

  const mail = (label: string, subject: string, lines: string[], primary = false): AssistantAction => ({ kind: "mail", label, subject, body: [c.mail.hello, "", ...lines, "", ...c.mail.fields, "", c.mail.sent], ...(primary ? { primary } : {}) });
  const call: AssistantAction = { kind: "tel", label: c.actions.call(data.contacts.mobile), href: data.contacts.mobileHref };
  const offerCard = (offer: AssistantOffer, note?: string): AssistantCard => ({ title: offer.name, meta: offer.status, tone: offer.tone, ...(note ? { note } : {}), action: { kind: "route", label: c.actions.open(offer.name), path: page(offer.slug) } });
  const offerCards = (band?: string): AssistantCard[] =>
    data.offers.map((offer) => {
      if (offer.unitArea === null) return offerCard(offer, c.fit.onRequest);
      if (band === "s") return offerCard(offer, offer.unitArea > 300 ? c.fit.larger : c.fit.within);
      if (band === "m") return offerCard(offer, offer.unitArea > 700 ? c.fit.larger : offer.unitArea < 300 ? c.fit.smaller : c.fit.within);
      if (band === "l") return offerCard(offer, offer.unitArea < 700 ? c.fit.smaller : c.fit.within);
      return offerCard(offer);
    });

  /* --- a scenario addressed to one property: «viewing:moscova-20», «property:dacia-31», «let:moscova-9» */
  const [head, arg] = node.split(":");

  switch (head) {
    case "start": {
      if (context.key === "offer-property" || context.key === "pack") return buildReply(`property:${context.slug}`, context, answers, data, c);
      if (context.key === "fully-let") return buildReply(`let:${context.slug}`, context, answers, data, c);
      if (context.key === "land" && plot) return { text: c.start.land(plot.name, plot.area), chips: [chip("land.scenarios"), landCalc(), chip("land.pack"), chip("land.deals"), chip("land.discuss"), more] };
      if (context.key === "leasing") return { text: c.start.leasing, chips: [chip("rent"), chip("viewing"), chip("calc"), chip("manager"), more] };
      if (context.key === "invest" || context.key === "offer") return { text: c.start.invest, chips: [chip("invest"), chip("land"), chip("calc"), chip("manager"), more] };
      if (context.key === "calculator") return { text: c.start.calculator, chips: [chip("calc"), chip("rent"), chip("manager"), more] };
      if (context.key === "development") return { text: c.start.development, chips: menu() };
      return { text: c.start.generic, chips: menu() };
    }

    case "menu":
      return { text: c.menu, chips: menu() };

    /* ---------------- 1 · lease a space ---------------- */
    case "rent": {
      if (!data.offers.length) return { text: c.rent.none, actions: [mail(c.actions.write, c.subject.lease, [c.mail.context(here)], true), call], chips: menu(["rent", "viewing"]) };
      return { text: c.rent.askFormat, chips: Object.keys(c.formats).map((key) => ({ label: c.formats[key], node: "rent.area", set: { format: key } })) };
    }
    case "rent.area":
      return { text: c.rent.askArea, chips: Object.keys(c.areas).map((key) => ({ label: c.areas[key], node: "rent.result", set: { area: key } })) };
    case "rent.result": {
      const format = c.formats[answers.format] ?? c.formats.other;
      const area = c.areas[answers.area] ?? c.areas.any;
      return {
        text: c.rent.result,
        cards: offerCards(answers.area),
        actions: [mail(c.actions.sendRequest, c.subject.lease, [c.mail.format(format), c.mail.area(area)], true), call],
        chips: [chip("viewing"), chip("calc"), more],
        note: c.rent.note,
      };
    }

    /* ---------------- a property with an active offer ---------------- */
    case "property": {
      const offer = offerBy(arg);
      if (!offer) return buildReply("rent", context, answers, data, c);
      const onPage = context.slug === offer.slug;
      if (offer.slug === UNIT_TOOLS)
        return {
          text: onPage ? c.start.unit(offer.name, offer.status) : c.property.unit(offer.name, offer.status),
          ...(onPage ? {} : { actions: [{ kind: "route", label: c.actions.open(offer.name), path: page(offer.slug), primary: true } satisfies AssistantAction] }),
          chips: [chip("unit.plans"), chip("unit.terms"), chip("unit.economics"), { label: c.chips.viewing, node: `viewing:${offer.slug}` }, ...(data.m20Offer ? [chip("unit.offer")] : []), more],
        };
      if (offer.slug === PICKER)
        return {
          text: onPage ? c.start.picker(offer.name, offer.status) : c.property.picker(offer.name, offer.status),
          ...(onPage ? {} : { actions: [{ kind: "route", label: c.actions.open(offer.name), path: page(offer.slug), primary: true } satisfies AssistantAction] }),
          chips: [chip("pick"), { label: c.chips.viewing, node: `viewing:${offer.slug}` }, chip("pick.plans"), more],
        };
      return { text: c.property.generic(offer.name, offer.status), actions: [{ kind: "route", label: c.actions.open(offer.name), path: page(offer.slug), primary: true }], chips: [{ label: c.chips.viewing, node: `viewing:${offer.slug}` }, more] };
    }

    /* ---------------- a fully let building: never offered for lease ---------------- */
    case "let": {
      const building = data.fullyLet.find((item) => item.slug === arg);
      if (!building) return buildReply("rent", context, answers, data, c);
      return { text: data.offers.length ? c.let.withOffers(building.name, building.status) : c.let.noOffers(building.name, building.status), cards: offerCards(), chips: [...(data.offers.length ? [chip("viewing")] : []), chip("land"), chip("invest"), chip("manager")] };
    }

    /* ---------------- Moscova 20: the tools of the page ---------------- */
    case "unit.plans":
      return { text: c.unit.plans, actions: [{ kind: "route", label: c.actions.plans, path: page(UNIT_TOOLS), hash: ["plans"], primary: true }], chips: [chip("unit.terms"), { label: c.chips.viewing, node: `viewing:${UNIT_TOOLS}` }, more] };
    case "unit.terms":
      return {
        text: c.unit.terms,
        actions: [{ kind: "route", label: c.actions.terms, path: page(UNIT_TOOLS), hash: ["commercial"], primary: true }, ...(data.m20Offer ? [{ kind: "file", label: c.actions.offerPdf, href: data.m20Offer, meta: c.actions.pdf } satisfies AssistantAction] : [])],
        chips: [chip("unit.economics"), { label: c.chips.viewing, node: `viewing:${UNIT_TOOLS}` }, more],
      };
    case "unit.economics":
      return { text: c.unit.economics, actions: [{ kind: "route", label: c.actions.economics, path: page(UNIT_TOOLS), hash: ["economics"], primary: true }], chips: [chip("unit.terms"), { label: c.chips.viewing, node: `viewing:${UNIT_TOOLS}` }, more], note: c.notes.calc };
    case "unit.offer":
      return {
        text: c.unit.offer,
        actions: [...(data.m20Offer ? [{ kind: "file", label: c.actions.offerPdf, href: data.m20Offer, meta: c.actions.pdf, primary: true } satisfies AssistantAction] : []), { kind: "route", label: c.actions.pack, path: `/leasing/${UNIT_TOOLS}/pack` }],
        chips: [{ label: c.chips.viewing, node: `viewing:${UNIT_TOOLS}` }, more],
      };

    /* ---------------- Dacia 31: selection of a space (area and timing are «on request») ---------------- */
    case "pick":
      return { text: c.pick.askArea, chips: Object.keys(c.areas).map((key) => ({ label: c.areas[key], node: "pick.format", set: { area: key } })) };
    case "pick.format":
      return { text: c.pick.askFormat, chips: Object.keys(c.formats).map((key) => ({ label: c.formats[key], node: "pick.result", set: { format: key } })) };
    case "pick.result": {
      const offer = offerBy(PICKER);
      const name = offer?.name ?? "Dacia 31";
      return {
        text: c.pick.result(name),
        actions: [mail(c.actions.sendRequest, c.subject.pick(name), [c.mail.property(name), c.mail.area(c.areas[answers.area] ?? c.areas.any), c.mail.format(c.formats[answers.format] ?? c.formats.other)], true), call, { kind: "route", label: c.actions.buildingPlans, path: page(PICKER), hash: ["spaces", "plans"] }],
        chips: [{ label: c.chips.viewing, node: `viewing:${PICKER}` }, more],
        note: c.pick.note,
      };
    }
    case "pick.plans":
      return { text: c.pick.plans, actions: [{ kind: "route", label: c.actions.buildingPlans, path: page(PICKER), hash: ["spaces", "plans"], primary: true }], chips: [chip("pick"), { label: c.chips.viewing, node: `viewing:${PICKER}` }, more] };

    /* ---------------- 2 · land for development ---------------- */
    case "land":
      return {
        text: c.land.intro,
        cards: data.land.map((item) => ({ title: item.name, meta: item.area ?? c.land.areaPending, tone: "quiet", action: { kind: "route", label: item.hasPage ? c.actions.open(item.name) : c.actions.allLand, path: item.hasPage ? page(item.slug) : "/projects", ...(item.hasPage ? {} : { hash: ["land"] }) } })),
        chips: [...(plot ? [chip("land.scenarios"), landCalc(), chip("land.pack")] : []), chip("invest.owner"), more],
        note: c.land.note,
      };
    case "land.scenarios":
      return plotPath && plot ? { text: c.land.scenarios(plot.name), actions: [{ kind: "route", label: c.actions.scenarios, path: plotPath, hash: ["scenarios"], primary: true }], chips: [landCalc(), chip("land.pack"), more], note: c.notes.scenario } : buildReply("land", context, answers, data, c);
    case "land.consult":
      return plotPath && plot ? { text: c.land.consult(plot.name), actions: [{ kind: "route", label: c.actions.consult, path: plotPath, hash: ["model"], primary: true }], chips: [chip("land.scenarios"), chip("land.pack"), chip("land.discuss"), more] } : buildReply("land", context, answers, data, copy);
    case "land.model":
      if (plot && !plot.model) return buildReply("land.consult", context, answers, data, copy);
      return plotPath && plot ? { text: c.land.model(plot.name), actions: [{ kind: "route", label: c.actions.model, path: plotPath, hash: ["model", "scenario"], primary: true }], chips: [chip("land.scenarios"), chip("land.pack"), more], note: c.notes.calc } : buildReply("land", context, answers, data, c);
    case "land.pack":
      return plotPath && plot
        ? { text: c.land.pack(plot.name), actions: [{ kind: "route", label: c.actions.pack2, path: plotPath, hash: ["pack"], primary: true }, mail(c.actions.requestPack, c.subject.pack(plot.name), [c.mail.property(plot.name), c.mail.packLine])], chips: [chip("land.deals"), chip("land.discuss"), more] }
        : buildReply("land", context, answers, data, c);
    case "land.deals":
      return plotPath && plot ? { text: c.land.deals, actions: [{ kind: "route", label: c.actions.deals, path: plotPath, hash: ["deals", "structure"], primary: true }], chips: [chip("land.pack"), chip("land.discuss"), more] } : buildReply("land", context, answers, data, c);
    case "land.discuss": {
      const name = plot?.name ?? c.land.genericName;
      return { text: c.land.discuss, actions: [mail(c.actions.write, c.subject.land(name), [c.mail.property(name)], true), call], chips: [chip("land.pack"), more] };
    }

    /* ---------------- 3 · project economics ---------------- */
    case "calc": {
      const unit = offerBy(UNIT_TOOLS);
      const cards: AssistantCard[] = [
        ...(unit ? [{ title: c.calc.point.title, meta: c.calc.point.meta(unit.name), action: { kind: "route", label: c.actions.economics, path: page(unit.slug), hash: ["economics"] } } satisfies AssistantCard] : []),
        { title: c.calc.producer.title, meta: c.calc.producer.meta, action: { kind: "route", label: c.actions.producer, path: "/producer-economics" } },
        ...(plot && plotPath && plot.model ? [{ title: c.calc.land.title, meta: c.calc.land.meta(plot.name), action: { kind: "route", label: c.actions.model, path: plotPath, hash: ["model", "scenario"] } } satisfies AssistantCard] : []),
      ];
      return { text: c.calc.intro, cards, chips: [chip("rent"), chip("manager"), more], note: c.notes.calc };
    }

    /* ---------------- 4 · a viewing ---------------- */
    case "viewing": {
      const chosen = arg ?? (context.key === "offer-property" || context.key === "pack" ? context.slug ?? undefined : undefined);
      // OWNER «VISIT PLANNER & COMMERCIAL DESK V1» (stage 1): where the planner is offered for the property, a real date and time are one step away
      const planner: AssistantAction[] = chosen && data.planner?.slugs.includes(chosen) ? [{ kind: "route", label: data.planner.label, path: `/visit/${chosen}?src=assistant`, primary: true }] : [];
      if (chosen && offerBy(chosen)) return { text: c.viewing.askWhen(offerBy(chosen)!.name), ...(planner.length ? { actions: planner } : {}), chips: Object.keys(c.times).map((key) => ({ label: c.times[key], node: "viewing.result", set: { property: chosen, time: key } })) };
      if (!data.offers.length) return buildReply("manager", context, answers, data, c);
      return { text: c.viewing.askProperty, chips: data.offers.map((offer) => ({ label: offer.name, node: `viewing:${offer.slug}` })) };
    }
    case "viewing.result": {
      const offer = offerBy(answers.property);
      if (!offer) return buildReply("viewing", context, answers, data, c);
      return {
        text: c.viewing.result(offer.name),
        actions: [mail(c.actions.sendViewing, c.subject.viewing(offer.name), [c.mail.viewing(offer.name), c.mail.time(c.times[answers.time] ?? c.times.call)], true), call, { kind: "route", label: c.actions.viewingSection, path: page(offer.slug), hash: ["viewing"] }],
        chips: [...(offer.slug === UNIT_TOOLS ? [chip("unit.plans"), chip("unit.terms")] : []), more],
        note: c.viewing.note,
      };
    }

    /* ---------------- 5 · investment and partnership ---------------- */
    case "invest":
      return { text: c.invest.ask, chips: [chip("invest.investor"), chip("invest.owner"), chip("invest.developer"), chip("invest.contractor")] };
    case "invest.investor":
      return { text: c.invest.investor, actions: [{ kind: "route", label: c.actions.partnership, path: "/partnership", primary: true }, mail(c.actions.write, c.subject.partnership, [c.mail.context(here)])], chips: [chip("land"), chip("manager"), more], note: c.notes.invest };
    case "invest.owner":
      return { text: c.invest.owner, actions: [{ kind: "route", label: c.actions.offerProperty, path: "/offer", primary: true }, mail(c.actions.write, c.subject.property, [c.mail.context(here), ...c.mail.propertyFields])], chips: [chip("manager"), more] };
    case "invest.developer":
      return { text: c.invest.developer, ...(plot && plotPath ? { actions: [{ kind: "route", label: c.actions.deals, path: plotPath, hash: ["deals", "structure"], primary: true } satisfies AssistantAction, mail(c.actions.write, c.subject.partnership, [c.mail.context(here)])] } : { actions: [mail(c.actions.write, c.subject.partnership, [c.mail.context(here)], true)] }), chips: [chip("land"), landCalc(), more], note: c.notes.invest };
    case "invest.contractor":
      return { text: c.invest.contractor, actions: [mail(c.actions.write, c.subject.cooperation, [c.mail.context(here)], true), { kind: "route", label: c.actions.contactPage, path: "/contact" }], chips: [more] };

    /* ---------------- 6 · a manager ---------------- */
    case "manager":
      return {
        text: c.manager,
        actions: [mail(c.actions.writeContext, c.subject.question, [c.mail.context(here)], true), call, { kind: "tel", label: c.actions.call(data.contacts.landline), href: data.contacts.landlineHref }, { kind: "route", label: c.actions.contactPage, path: "/contact" }],
        chips: [more],
      };

    /* ---------------- guardrails: figures the assistant never produces ---------------- */
    case "terms": {
      const unit = offerBy(UNIT_TOOLS);
      return {
        text: unit ? c.guard.terms(unit.name) : c.guard.termsNoUnit,
        actions: [...(unit ? [{ kind: "route", label: c.actions.terms, path: page(unit.slug), hash: ["commercial"], primary: true } satisfies AssistantAction] : []), mail(c.actions.askTerms, c.subject.terms, [c.mail.context(here), ...(question ? [c.mail.question(question)] : [])], !unit)],
        chips: [chip("viewing"), chip("manager"), more],
      };
    }
    case "figures": {
      const unit = offerBy(UNIT_TOOLS);
      return {
        text: [...(unit ? c.guard.terms(unit.name) : c.guard.termsNoUnit), ...c.guard.returns],
        actions: [...(unit ? [{ kind: "route", label: c.actions.terms, path: page(unit.slug), hash: ["commercial"], primary: true } satisfies AssistantAction] : []), mail(c.actions.askTerms, c.subject.terms, [c.mail.context(here), ...(question ? [c.mail.question(question)] : [])], !unit)],
        chips: [chip("calc"), chip("viewing"), chip("manager"), more],
        note: c.notes.invest,
      };
    }
    case "returns":
      return { text: c.guard.returns, actions: [{ kind: "route", label: c.actions.partnership, path: "/partnership", primary: true }], chips: [chip("calc"), chip("manager"), more], note: c.notes.invest };

    case "careers":
      return { text: c.careers, actions: [{ kind: "route", label: c.actions.careers, path: "/careers", primary: true }], chips: [more] };

    default:
      // no ready answer and no AI behind the channel: say so, and hand the question to a person through the visitor's own mail
      return {
        text: c.fallback,
        actions: [mail(c.actions.sendQuestion, c.subject.question, [c.mail.context(here), ...(question ? [c.mail.question(question)] : [])], true), call],
        chips: menu(),
      };
  }
}

/* ------------------------------------------------------------------ */
/* The local transport                                                  */
/* ------------------------------------------------------------------ */

/**
 * The prototype's transport: the scenarios above, in the browser. `live: false` — no human and no AI is behind it, and the
 * interface says so. A chip may carry answers (`set`); the UI merges them into `answers` before calling.
 */
export function localTransport(copy: AssistantCopy): AssistantTransport {
  return {
    live: false,
    reply(request: AssistantRequest, context, answers, data) {
      if (request.type === "open") return buildReply("start", context, answers, data, copy);
      if (request.type === "chip") return buildReply(request.node, context, answers, data, copy);
      return buildReply(intentOf(request.text, data, copy), context, answers, data, copy, request.text);
    },
  };
}
