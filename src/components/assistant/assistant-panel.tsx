"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent, type MouseEvent } from "react";
import { GOTO_KEY, anchorExists, openAnchor } from "@/components/assistant/anchors";
import { tie, type AssistantCopy } from "@/components/assistant/copy";
import { intentOf, localTransport } from "@/components/assistant/engine";
import type { AssistantAction, AssistantAnswers, AssistantChip, AssistantContext, AssistantData, AssistantReply, AssistantRequest, AssistantTurn } from "@/components/assistant/types";
import { brand, localePath, locales, publicAsset, type Localized, type SiteLocale } from "@/lib/site-data";
import { track } from "@/lib/track";

/**
 * MEGAPARC COMMERCIAL ASSISTANT — the panel (OWNER «INTELLIGENT COMMERCIAL ASSISTANT», 2026-11-24).
 *
 * A conversation made of replies: a short text, optional cards (a building, a plot, a calculator), actions and the next
 * choices. The panel renders what the transport returns and knows nothing about where a reply came from — today the local
 * scenarios (engine.ts), later a server endpoint with the AI consultant, the knowledge base and the operator hand-off.
 *
 * Honest by construction:
 *   — the status line is worded from `transport.live` (false today): no operator, no AI, and the panel says so;
 *   — nothing is sent: a request is a letter in the visitor's own mail app (subject and context filled in) or a telephone call;
 *   — no typing indicator, no «online», no invented waiting time.
 *
 * A side panel on wide screens (the page stays usable beside it); a full-height sheet on phones (a modal: the focus stays
 * inside and the page behind does not scroll). Escape closes it; the focus returns to the launcher.
 */
export type AssistantPanelProps = { data: AssistantData; copy: AssistantCopy; context: AssistantContext; onClose: (refocus?: boolean) => void };

type Stored = { path: string; turns: AssistantTurn[]; answers: AssistantAnswers };

const storageKey = (locale: SiteLocale) => `mca:v1:${locale}`;
const MAX_TURNS = 40;

/** «Continue in …» — offered once, when the browser's language is another language of the site */
const continueIn: Localized = { ro: "Continuați în română", ru: "Продолжить на русском", en: "Continue in English" };

const enc = (text: string) => encodeURIComponent(text).replace(/[!'()*]/g, (ch) => `%${ch.charCodeAt(0).toString(16).toUpperCase()}`);

function restore(locale: SiteLocale): Stored | null {
  try {
    const raw = window.sessionStorage.getItem(storageKey(locale));
    if (!raw) return null;
    const value = JSON.parse(raw) as Stored;
    return Array.isArray(value.turns) && value.turns.length ? value : null;
  } catch {
    return null;
  }
}

export function AssistantPanel({ data, copy, context, onClose }: AssistantPanelProps) {
  const locale = data.locale;
  const router = useRouter();
  const transport = useMemo(() => localTransport(copy), [copy]);
  const ui = copy.ui;
  const panel = useRef<HTMLElement>(null);
  const thread = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const last = useRef<HTMLDivElement>(null);
  const [text, setText] = useState("");
  const [state, setState] = useState<{ turns: AssistantTurn[]; answers: AssistantAnswers }>({ turns: [], answers: {} });
  const [ready, setReady] = useState(false);
  const [sheet, setSheet] = useState(false);
  const fromThread = useRef(false);

  /* --- the first reply, or the conversation of this visit continued on the page the visitor is on now */
  useEffect(() => {
    let cancelled = false;
    const stored = restore(locale);
    const begin = async () => {
      const reply = await transport.reply({ type: "open" }, context, stored?.answers ?? {}, data);
      if (cancelled) return;
      if (stored && stored.path === context.path) setState({ turns: stored.turns, answers: stored.answers });
      else if (stored) setState({ turns: [...stored.turns, { from: "assistant" as const, reply }].slice(-MAX_TURNS), answers: stored.answers });
      else {
        const preferred = (navigator.languages?.[0] ?? navigator.language ?? "").slice(0, 2).toLowerCase() as SiteLocale;
        const other = locales.includes(preferred) && preferred !== locale ? preferred : null;
        const first: AssistantReply = other ? { ...reply, actions: [...(reply.actions ?? []), { kind: "route", label: continueIn[other], path: context.path, locale: other }] } : reply;
        setState({ turns: [{ from: "assistant", reply: first }], answers: {} });
      }
      setReady(true);
    };
    void begin();
    return () => {
      cancelled = true;
    };
    // the conversation is rebuilt only when the panel opens (the panel unmounts on close and on a route change)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      window.sessionStorage.setItem(storageKey(locale), JSON.stringify({ path: context.path, turns: state.turns, answers: state.answers } satisfies Stored));
    } catch {
      /* storage blocked: the conversation simply does not survive a navigation */
    }
  }, [ready, state, locale, context.path]);

  /* --- phone sheet: a modal — the page behind does not scroll */
  useEffect(() => {
    const query = window.matchMedia("(max-width: 639.98px)");
    const apply = () => setSheet(query.matches);
    apply();
    query.addEventListener("change", apply);
    return () => query.removeEventListener("change", apply);
  }, []);
  useEffect(() => {
    if (!sheet) return;
    document.documentElement.classList.add("mca-lock");
    // a modal: the rest of the page is inert while the sheet covers it (the header, the content, the footer — never the assistant)
    const root = panel.current?.closest(".mca") ?? null;
    const others = root?.parentElement ? Array.from(root.parentElement.children).filter((node): node is HTMLElement => node instanceof HTMLElement && node !== root && !node.hasAttribute("inert")) : [];
    others.forEach((node) => node.setAttribute("inert", ""));
    return () => {
      document.documentElement.classList.remove("mca-lock");
      others.forEach((node) => node.removeAttribute("inert"));
    };
  }, [sheet]);

  /* --- focus: into the panel on opening; Escape closes; Tab moves among the panel's own controls */
  useEffect(() => {
    panel.current?.focus({ preventScroll: true });
  }, []);
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const box = panel.current;
      if (!box) return;
      if (event.key === "Escape") {
        event.stopPropagation();
        onClose();
        return;
      }
      const active = document.activeElement;
      if (event.key !== "Tab" || event.altKey || event.ctrlKey || event.metaKey || !(active instanceof Node) || !box.contains(active)) return;
      // The panel moves Tab itself: its actions are links, and Safari's Tab skips links by default — a keyboard user would
      // never reach «open the letter» or «call». On a phone the sheet is a modal and Tab wraps; beside the page it leaves
      // the panel at either end, as in any other part of the page.
      const items = Array.from(box.querySelectorAll<HTMLElement>("a[href], button:not([disabled]), input:not([disabled])")).filter((node) => node.offsetParent !== null);
      if (!items.length) return;
      const index = items.indexOf(active as HTMLElement);
      let next: number;
      if (index !== -1) next = index + (event.shiftKey ? -1 : 1);
      else {
        // the focus is on the panel or on an answer: the first control after it (or the last one before it)
        const after = items.findIndex((node) => Boolean(active.compareDocumentPosition(node) & Node.DOCUMENT_POSITION_FOLLOWING) && !active.contains(node));
        const inside = items.findIndex((node) => active.contains(node));
        const forward = inside !== -1 ? inside : after === -1 ? items.length : after;
        next = event.shiftKey ? forward - 1 : forward;
      }
      if (next < 0 || next >= items.length) {
        if (!sheet) return;
        next = next < 0 ? items.length - 1 : 0;
      }
      event.preventDefault();
      items[next].focus();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose, sheet]);

  /* --- a new reply: bring its beginning into view; a choice made in the thread moves the focus to the answer */
  const count = state.turns.length;
  useEffect(() => {
    const box = thread.current;
    const node = last.current;
    if (!box || !node) return;
    box.scrollTop = Math.max(0, node.offsetTop - 12);
    if (fromThread.current) node.focus({ preventScroll: true });
    fromThread.current = false;
  }, [count]);

  const ask = useCallback(
    async (request: AssistantRequest, said: string, set?: Record<string, string>) => {
      const answers = set ? { ...state.answers, ...set } : state.answers;
      const reply = await transport.reply(request, context, answers, data);
      setState((current) => ({ turns: [...current.turns, { from: "visitor" as const, text: said }, { from: "assistant" as const, reply }].slice(-MAX_TURNS), answers }));
    },
    [context, data, state.answers, transport],
  );

  const choose = (chip: AssistantChip) => {
    fromThread.current = true;
    track("assistant_chip", { node: chip.node });
    void ask({ type: "chip", node: chip.node }, chip.label, chip.set);
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const said = text.trim().slice(0, 400);
    if (!said) return;
    // the topic only — the visitor's words are never logged
    track("assistant_text", { intent: intentOf(said, data, copy) });
    setText("");
    void ask({ type: "text", text: said }, said);
  };

  const restart = async () => {
    try {
      window.sessionStorage.removeItem(storageKey(locale));
    } catch {
      /* storage blocked */
    }
    const reply = await transport.reply({ type: "open" }, context, {}, data);
    fromThread.current = true;
    setState({ turns: [{ from: "assistant", reply }], answers: {} });
  };

  /* --- actions */
  const go = (action: Extract<AssistantAction, { kind: "route" }>) => (event: MouseEvent<HTMLAnchorElement>) => {
    track("assistant_action", { kind: "route", path: action.path });
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
    event.preventDefault();
    const target = action.locale ?? locale;
    const samePage = action.path === context.path && target === locale;
    onClose(false);
    if (samePage) {
      if (action.hash?.length) window.setTimeout(() => openAnchor(action.hash!), 60);
      else window.scrollTo({ top: 0 });
      return;
    }
    if (action.hash?.length) {
      try {
        window.sessionStorage.setItem(GOTO_KEY, JSON.stringify({ path: action.path, hash: action.hash }));
      } catch {
        /* storage blocked: the page opens at its top */
      }
    }
    router.push(localePath(target, action.path));
  };

  const mailHref = (action: Extract<AssistantAction, { kind: "mail" }>) => `${data.contacts.emailHref}?subject=${enc(action.subject)}&body=${enc(action.body.join("\r\n"))}`;

  /** an action that points at a section of THIS page is shown only when the section exists here */
  const usable = (action: AssistantAction) => !(action.kind === "route" && action.path === context.path && (action.locale ?? locale) === locale && action.hash?.length && !anchorExists(action.hash));

  const renderAction = (action: AssistantAction, key: string, quiet = false) => {
    const tone = `mca-act${action.primary && !quiet ? " mca-act--primary" : ""}${quiet ? " mca-act--quiet" : ""}`;
    if (action.kind === "route") {
      const href = `${localePath(action.locale ?? locale, action.path)}${action.hash?.length ? `#${action.hash[0]}` : ""}`;
      return (
        <Link key={key} className={tone} data-kind="route" data-path={action.path} data-hash={action.hash?.join(" ")} href={href} hrefLang={action.locale} onClick={go(action)} prefetch={false}>
          <span>{tie(action.label)}</span>
          <Arrow />
        </Link>
      );
    }
    if (action.kind === "mail")
      return (
        <a key={key} className={tone} data-kind="mail" href={mailHref(action)} onClick={() => track("assistant_action", { kind: "mail" })}>
          <span>{tie(action.label)}</span>
          <Arrow out />
        </a>
      );
    if (action.kind === "tel")
      return (
        <a key={key} className={tone} data-kind="tel" href={action.href} onClick={() => track("assistant_action", { kind: "tel" })}>
          <span>{action.label}</span>
          <Arrow out />
        </a>
      );
    return (
      <a key={key} className={tone} data-kind="file" href={action.href} download="" onClick={() => track("assistant_action", { kind: "file" })}>
        <span>
          {tie(action.label)}
          {action.meta ? <small className="mca-act__meta"> · {action.meta}</small> : null}
        </span>
        <Arrow down />
      </a>
    );
  };

  const lastAssistant = state.turns.reduce((index, turn, i) => (turn.from === "assistant" ? i : index), -1);

  return (
    <section ref={panel} className="mca-panel" role="dialog" aria-modal={sheet} aria-labelledby="mca-title" tabIndex={-1} lang={locale}>
      <header className="mca-head">
        <div className="mca-head__id">
          <span className="mca-head__logo" aria-hidden="true" style={{ "--mca-logo": `url("${publicAsset("/brand/megaparc-logo-compact.svg")}")` } as React.CSSProperties} />
          <p className="mca-head__title" id="mca-title">
            <span className="mca-sr">{brand.name} · </span>
            {ui.title.replace(/\s*MEGAPARC\s*/, "") || ui.title}
          </p>
          <p className="mca-head__context">{context.name ? `${ui.here}: ${context.name}` : ui.kicker}</p>
        </div>
        <button type="button" className="mca-head__close" aria-label={ui.close} onClick={() => onClose()}>
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false">
            <path d="M6 6l12 12M18 6 6 18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </button>
      </header>

      <div className="mca-status" role="note" aria-label={ui.statusLabel}>
        <span className="mca-status__dot" aria-hidden="true" />
        <p className="mca-status__text">{tie(ui.status)}</p>
        <button type="button" className="mca-status__restart" onClick={() => void restart()}>
          {ui.restart}
        </button>
      </div>

      <div ref={thread} className="mca-thread" role="log" aria-label={ui.thread} aria-live="polite">
        {state.turns.map((turn, index) => {
          if (turn.from === "visitor")
            return (
              <div key={index} className="mca-msg mca-msg--visitor">
                <span className="mca-sr">{ui.visitor}: </span>
                <p>{turn.text}</p>
              </div>
            );
          const reply = turn.reply;
          const current = index === lastAssistant;
          const actions = (reply.actions ?? []).filter(usable);
          return (
            <div key={index} ref={current ? last : undefined} className="mca-msg mca-msg--assistant" tabIndex={-1}>
              <span className="mca-sr">{ui.assistant}: </span>
              <div className="mca-bubble">
                {reply.text.map((line, i) => (
                  <p key={i}>{tie(line)}</p>
                ))}
              </div>
              {reply.cards?.length ? (
                <ul className="mca-cards">
                  {reply.cards.map((card, i) => (
                    <li key={i} className="mca-card" data-tone={card.tone}>
                      <p className="mca-card__title">{card.title}</p>
                      <p className="mca-card__meta">
                        {card.tone === "now" || card.tone === "soon" ? <span className="mca-card__dot" aria-hidden="true" /> : null}
                        {card.meta}
                      </p>
                      {card.note ? <p className="mca-card__note">{tie(card.note)}</p> : null}
                      {card.action && usable(card.action) ? renderAction(card.action, `c${i}`, true) : null}
                    </li>
                  ))}
                </ul>
              ) : null}
              {actions.length ? (
                <div className="mca-acts">
                  {actions.map((action, i) => renderAction(action, `a${i}`))}
                  {actions.some((action) => action.kind === "mail") ? <p className="mca-hint">{tie(ui.mailHint)}</p> : null}
                </div>
              ) : null}
              {reply.note ? <p className="mca-note">{tie(reply.note)}</p> : null}
              {current && reply.chips?.length ? (
                <div className="mca-chips" data-layout={reply.chips.some((chip) => chip.label.length > 16) ? "list" : "wrap"}>
                  {reply.chips.map((chip, i) => (
                    <button key={i} type="button" className="mca-chip" data-node={chip.node} onClick={() => choose(chip)}>
                      <span>{chip.label}</span>
                      <Arrow />
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
          );
        })}
      </div>

      <form className="mca-form" onSubmit={submit}>
        <label className="mca-sr" htmlFor="mca-input">
          {ui.placeholder}
        </label>
        <input ref={input} id="mca-input" className="mca-form__input" type="text" inputMode="text" autoComplete="off" enterKeyHint="send" maxLength={400} placeholder={ui.placeholder} value={text} onChange={(event) => setText(event.target.value)} />
        <button type="submit" className="mca-form__send" aria-label={ui.send} disabled={!text.trim()}>
          <Arrow />
        </button>
      </form>

      <footer className="mca-foot">
        <p className="mca-foot__note">{tie(ui.inputNote)}</p>
        <a className="mca-foot__tel" href={data.contacts.mobileHref} onClick={() => track("assistant_action", { kind: "tel" })}>
          {data.contacts.mobile}
        </a>
        <nav className="mca-foot__lang" aria-label={ui.languages}>
          {locales.map((item) =>
            item === locale ? (
              <span key={item} aria-current="true">
                {item.toUpperCase()}
              </span>
            ) : (
              <Link key={item} href={localePath(item, context.path)} hrefLang={item} lang={item} prefetch={false} aria-label={brand.languageNames[item]}>
                {item.toUpperCase()}
              </Link>
            ),
          )}
        </nav>
      </footer>
    </section>
  );
}

function Arrow({ out = false, down = false }: { out?: boolean; down?: boolean }) {
  return (
    <svg className="mca-arrow" viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" focusable="false">
      <path d={down ? "M12 5v13m-6-6 6 6 6-6" : out ? "M7 17 17 7M8 7h9v9" : "M5 12h14m-7-7 7 7-7 7"} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
