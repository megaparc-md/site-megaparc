"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState, type ChangeEvent, type FormEvent, type MouseEvent, type ReactNode } from "react";
import { GOTO_KEY, anchorExists, openAnchor } from "@/components/assistant/anchors";
import { tie, type AssistantCopy } from "@/components/assistant/copy";
import { intentOf, localTransport } from "@/components/assistant/engine";
import {
  LiveError,
  eraseConversation,
  fetchEvents,
  fetchFile,
  formatSize,
  liveConfigured,
  liveStatus,
  loadSession,
  newClientId,
  openConversation,
  saveSession,
  sendFile,
  sendText,
  telegramLink,
  type LiveMessage,
  type LivePage,
  type LiveSession,
  type LiveState,
  type LiveStatus,
} from "@/components/assistant/live";
import type { AssistantAction, AssistantAnswers, AssistantChip, AssistantContext, AssistantData, AssistantFile, AssistantReply, AssistantRequest, AssistantTurn } from "@/components/assistant/types";
import { brand, localePath, locales, publicAsset, type Localized, type SiteLocale } from "@/lib/site-data";
import { track } from "@/lib/track";

/**
 * MEGAPARC COMMERCIAL ASSISTANT — the panel.
 *
 * One thread, two kinds of turns:
 *   — guided turns (OWNER «INTELLIGENT COMMERCIAL ASSISTANT», 2026-11-24): the scenarios of engine.ts — a short text, cards,
 *     actions, the next choices. They never leave the browser.
 *   — live turns (OWNER «TELEGRAM FIRST · TWO-WAY COMMUNICATION», 2026-11-24): what the visitor writes goes to MEGAPARC's
 *     managers (the assistant server → their Telegram group), and what an employee answers there appears here.
 *
 * No questionnaire stands before the first message: the visitor writes, a person answers, contacts are asked for in the talk.
 *
 * Honest by construction:
 *   — the status line says what the channel really is: a live chat only when the server reports the managers' group
 *     connected; otherwise «automatic assistant» and the letter / telephone actions;
 *   — every message of the visitor shows its real delivery state (sending · delivering · not sent — retry);
 *   — no typing indicator, no «online», no promised reply time; working hours are stated only when configured;
 *   — the visitor is told, before writing, who receives the messages and that they pass through Telegram, and can erase
 *     the conversation from the server.
 *
 * A side panel on wide screens; a full-height modal sheet on phones. Escape closes it; the focus returns to the launcher.
 */
/** `keep` = the window is only minimised: the launcher then offers to continue the conversation */
export type AssistantPanelProps = { data: AssistantData; copy: AssistantCopy; context: AssistantContext; onClose: (refocus?: boolean, keep?: boolean) => void };

type Stored = { path: string; turns: AssistantTurn[]; answers: AssistantAnswers };
type Thread = { turns: AssistantTurn[]; answers: AssistantAnswers };

const storageKey = (locale: SiteLocale) => `mca:v1:${locale}`;
/** the text typed and not sent: kept while the window is minimised (this browser tab only) */
const draftKey = (locale: SiteLocale) => `mca:v1:draft:${locale}`;
/** the field grows with the text up to this height, then scrolls */
const FIELD_MAX = 132;
const MAX_TURNS = 120;
const TEST_MODE = process.env.NEXT_PUBLIC_ASSISTANT_MODE === "test";
const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const ACCEPT = [...IMAGE_TYPES, "application/pdf", ".doc", ".docx", ".xls", ".xlsx", ".ppt", ".pptx", ".txt", ".zip"].join(",");

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

const fileOf = (m: LiveMessage): AssistantFile | undefined => (m.file ? { id: m.id, name: m.file.name, mime: m.file.mime, size: m.file.size, image: m.kind === "photo" } : undefined);
type LiveTurnState = "sending" | "sent" | "pending" | "failed";
const stateOf = (delivery: LiveMessage["delivery"]): LiveTurnState => (delivery === "done" ? "sent" : delivery === "pending" ? "pending" : "failed");
/** the clock, read in handlers and effects only (never while rendering) */
const clock = () => Date.now();

/** Brings messages of the server into the thread: each server message appears once, in the order it arrived. */
function merge(turns: AssistantTurn[], messages: LiveMessage[]): AssistantTurn[] {
  let next = turns;
  for (const m of messages) {
    if (m.from === "visitor") {
      const index = next.findIndex((turn) => turn.from === "visitor" && turn.live && (turn.live.id === m.id || (m.clientId !== null && turn.live.key === m.clientId)));
      const live = { key: m.clientId ?? `s${m.id}`, id: m.id, state: stateOf(m.delivery), channel: m.channel, ...(fileOf(m) ? { file: fileOf(m) } : {}) } as const;
      if (index === -1) next = [...next, { from: "visitor", text: m.text, at: m.at, live }];
      // the words are shown as the server stored them (normalised, cut cleanly at the limit)
      else next = next.map((turn, i) => (i === index && turn.from === "visitor" ? { ...turn, text: m.kind === "text" && m.text ? m.text : turn.text, at: turn.at ?? m.at, live: { ...live, key: turn.live?.key ?? live.key } } : turn));
    } else if (m.from === "manager") {
      if (!next.some((turn) => turn.from === "manager" && turn.id === m.id)) next = [...next, { from: "manager", id: m.id, text: m.text, author: m.author, at: m.at, ...(fileOf(m) ? { file: fileOf(m) } : {}) }];
    } else if (!next.some((turn) => turn.from === "system" && turn.id === m.id)) next = [...next, { from: "system", id: m.id, code: m.text }];
  }
  return next.length > MAX_TURNS ? next.slice(-MAX_TURNS) : next;
}

/** The address the chat offers outside working hours is a link the visitor can use at once (the text itself is unchanged). */
const MAIL = "receptie@imc.md";
const withMail = (text: string): ReactNode => {
  const parts = text.split(MAIL);
  if (parts.length === 1) return text;
  return parts.flatMap((part, index) =>
    index
      ? [
          <a key={index} className="mca-mail" href={`mailto:${MAIL}`}>
            {MAIL}
          </a>,
          part,
        ]
      : [part],
  );
};

export function AssistantPanel({ data, copy, context, onClose }: AssistantPanelProps) {
  const locale = data.locale;
  const router = useRouter();
  const transport = useMemo(() => localTransport(copy), [copy]);
  const ui = copy.ui;
  const lv = copy.live;
  const panel = useRef<HTMLElement>(null);
  const thread = useRef<HTMLDivElement>(null);
  const last = useRef<HTMLDivElement>(null);
  /** the visitor's message that the newest answer replies to: the thread scrolls to it, so the visitor sees their own words above the answer */
  const asked = useRef<HTMLDivElement>(null);
  const picker = useRef<HTMLInputElement>(null);
  const field = useRef<HTMLTextAreaElement>(null);
  // the panel exists in the browser only (it is mounted by a click), so the unsent text can be read at once
  const [text, setText] = useState(() => {
    try {
      return (window.sessionStorage.getItem(draftKey(data.locale)) ?? "").slice(0, 400);
    } catch {
      return "";
    }
  });
  /** the next choices folded away (true) or shown (false) by the visitor; null = no choice made yet */
  const [quickPref, setQuickPref] = useState<boolean | null>(null);
  const clockTime = useMemo(() => {
    const format = new Intl.DateTimeFormat(locale, { hour: "2-digit", minute: "2-digit", hourCycle: "h23" });
    return (at?: number) => (at ? format.format(at) : null);
  }, [locale]);
  const [state, setState] = useState<Thread>({ turns: [], answers: {} });
  const [ready, setReady] = useState(false);
  const [sheet, setSheet] = useState(false);
  const fromThread = useRef(false);

  /* --- the live channel */
  const [status, setStatus] = useState<LiveStatus | null>(null);
  const [liveState, setLiveState] = useState<LiveState | null>(null);
  const [session, setSessionState] = useState<LiveSession | null>(null);
  const sessionRef = useRef<LiveSession | null>(null);
  const cursor = useRef(0);
  const activity = useRef(0);
  const [notice, setNotice] = useState<string | null>(null);
  const [privacyOpen, setPrivacyOpen] = useState(false);
  /** files that were not delivered for a passing reason, kept in memory only: the visitor sends them again with one action */
  const [unsent, setUnsent] = useState<Record<string, File>>({});
  const [eraseAsk, setEraseAsk] = useState(false);
  const liveOn = Boolean(status?.live);
  // a live chat is a conversation with a person, not a menu of the site: the scenarios wait folded until asked for
  const quickHidden = quickPref ?? liveOn;

  const setSession = useCallback((value: LiveSession | null) => {
    sessionRef.current = value;
    setSessionState(value);
    saveSession(value);
  }, []);

  /** Server messages into the thread; the newest id is the cursor and the «seen» mark of the launcher's badge. */
  const absorb = useCallback((messages: LiveMessage[]) => {
    if (!messages.length) return;
    cursor.current = Math.max(cursor.current, ...messages.map((m) => m.id));
    const current = sessionRef.current;
    if (current && cursor.current > current.seen) {
      sessionRef.current = { ...current, seen: cursor.current };
      saveSession(sessionRef.current);
    }
    setState((thread) => ({ ...thread, turns: merge(thread.turns, messages) }));
  }, []);

  const pageInfo = useCallback(
    (): LivePage => ({ path: context.path, name: context.name ?? (document.title.split(/\s[|—–·]\s/)[0] || "").slice(0, 60), url: `${window.location.origin}${window.location.pathname}`, key: context.key }),
    [context.key, context.name, context.path],
  );

  /* --- the first reply, or the conversation of this visit continued on the page the visitor is on now */
  useEffect(() => {
    let cancelled = false;
    const stored = restore(locale);
    const begin = async () => {
      const reply = await transport.reply({ type: "open" }, context, stored?.answers ?? {}, data);
      if (cancelled) return;
      // a message that was still being sent when the page changed is settled by the server's history below
      const kept = (stored?.turns ?? []).map((turn) => (turn.from === "visitor" && turn.live?.state === "sending" ? { ...turn, live: { ...turn.live, state: "failed" as const } } : turn));
      if (stored && stored.path === context.path) setState({ turns: kept, answers: stored.answers });
      else if (stored) setState({ turns: [...kept, { from: "assistant" as const, reply, at: clock(), opening: true }].slice(-MAX_TURNS), answers: stored.answers });
      else {
        const preferred = (navigator.languages?.[0] ?? navigator.language ?? "").slice(0, 2).toLowerCase() as SiteLocale;
        const other = locales.includes(preferred) && preferred !== locale ? preferred : null;
        const first: AssistantReply = other ? { ...reply, actions: [...(reply.actions ?? []), { kind: "route", label: continueIn[other], path: context.path, locale: other }] } : reply;
        setState({ turns: [{ from: "assistant", reply: first, at: clock(), opening: true }], answers: {} });
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

  /* --- the unsent text survives a minimised window; the field is as tall as its text */
  useEffect(() => {
    try {
      if (text) window.sessionStorage.setItem(draftKey(locale), text);
      else window.sessionStorage.removeItem(draftKey(locale));
    } catch {
      /* storage blocked: the text lives while the window is open */
    }
    const box = field.current;
    if (!box) return;
    box.style.height = "auto";
    box.style.height = `${Math.min(box.scrollHeight, FIELD_MAX)}px`;
    box.style.overflowY = box.scrollHeight > FIELD_MAX ? "auto" : "hidden";
  }, [text, locale]);

  /** is there a conversation to come back to: something the visitor said here, or a talk with the managers on the server */
  const conversing = () => state.turns.some((turn) => turn.from === "visitor" || turn.from === "manager") || sessionRef.current !== null;
  /** «minimise» keeps the conversation AND the unsent text; the launcher then offers to continue */
  const minimise = (refocus = true) => onClose(refocus, conversing() || text.trim().length > 0);
  /** «close» hides the window and never ends the conversation (OWNER decision, 2026-11-25): only the unsent text goes */
  const shut = () => {
    try {
      window.sessionStorage.removeItem(draftKey(locale));
    } catch {
      /* storage blocked */
    }
    onClose(true, conversing());
  };
  /** «new conversation» asks first (OWNER decision, 2026-11-25) */
  const [confirmNew, setConfirmNew] = useState(false);
  const confirmYes = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (confirmNew) confirmYes.current?.focus({ preventScroll: true });
  }, [confirmNew]);
  /** Escape always reaches the newest state (the key listener is attached once): it cancels the question, else minimises */
  const onEscape = useRef<() => void>(() => undefined);
  useEffect(() => {
    onEscape.current = () => (confirmNew ? setConfirmNew(false) : minimise());
  });

  /* --- live: is the managers' group connected; the conversation of this browser, if it has one */
  useEffect(() => {
    if (!liveConfigured || !ready) return;
    let cancelled = false;
    liveStatus()
      .then((value) => {
        if (cancelled) return;
        setStatus(value);
        const saved = value.live ? loadSession() : null;
        if (!saved) return;
        sessionRef.current = saved;
        setSessionState(saved);
        activity.current = clock();
      })
      .catch(() => {
        /* the server is unreachable: the assistant stays the guided one and says nothing about a live chat */
      });
    return () => {
      cancelled = true;
    };
  }, [ready]);

  const ended = useCallback(() => {
    setSession(null);
    setLiveState(null);
    cursor.current = 0;
    setState((thread) => ({ ...thread, turns: [...thread.turns, { from: "system" as const, id: null, code: "ended" }] }));
  }, [setSession]);

  /* --- live: what arrived since the last look — quick while the talk is active, slower when it rests, never in a hidden tab */
  useEffect(() => {
    if (!session) return;
    let timer = 0;
    let stopped = false;
    // How often an open window asks for news: at once while the talk is alive, rarely once it has been quiet for long —
    // a tab left open for a day must not use up the server's daily allowance (free plan: 100 000 requests a day).
    // Opening the window, writing and an employee's answer all count as the talk being alive.
    let asked = 0;
    activity.current = clock();
    const every = () => {
      const quiet = clock() - activity.current;
      return quiet < 120_000 ? 1500 : quiet < 600_000 ? 4000 : quiet < 1_800_000 ? 15_000 : 60_000;
    };
    const tick = async () => {
      if (stopped) return;
      const current = sessionRef.current;
      if (current && !document.hidden && clock() - asked >= every() - 50) {
        asked = clock();
        try {
          const result = await fetchEvents(current, cursor.current);
          if (stopped) return;
          absorb(result.messages);
          setLiveState(result.state);
          if (result.messages.some((m) => m.from === "manager")) activity.current = clock();
          const unsettled = new Map(result.unsettled.map((item) => [item.id, item.delivery]));
          setState((thread) => {
            let changed = false;
            const turns = thread.turns.map((turn) => {
              if (turn.from !== "visitor" || !turn.live || turn.live.id === null || turn.live.state === "sending") return turn;
              const now = unsettled.get(turn.live.id);
              const next: LiveTurnState = now ? (now === "pending" ? "pending" : "failed") : turn.live.state === "pending" ? "sent" : turn.live.state;
              if (next === turn.live.state) return turn;
              changed = true;
              return { ...turn, live: { ...turn.live, state: next } };
            });
            return changed ? { ...thread, turns } : thread;
          });
        } catch (error) {
          if (error instanceof LiveError && (error.status === 401 || error.status === 410)) {
            ended();
            return;
          }
        }
      }
      timer = window.setTimeout(tick, Math.min(every(), 1500));
    };
    void tick();
    const wake = () => {
      if (!document.hidden) {
        window.clearTimeout(timer);
        asked = 0;
        void tick();
      }
    };
    document.addEventListener("visibilitychange", wake);
    return () => {
      stopped = true;
      window.clearTimeout(timer);
      document.removeEventListener("visibilitychange", wake);
    };
  }, [session, absorb, ended]);

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
        // Escape folds the window away: nothing typed is lost
        onEscape.current();
        return;
      }
      const active = document.activeElement;
      if (event.key !== "Tab" || event.altKey || event.ctrlKey || event.metaKey || !(active instanceof Node) || !box.contains(active)) return;
      // The panel moves Tab itself: its actions are links, and Safari's Tab skips links by default — a keyboard user would
      // never reach «open the letter» or «call». On a phone the sheet is a modal and Tab wraps; beside the page it leaves
      // the panel at either end, as in any other part of the page.
      const items = Array.from(box.querySelectorAll<HTMLElement>("a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]):not([type=file])")).filter((node) => node.offsetParent !== null);
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
  }, [sheet]);

  /* --- a new turn: bring its beginning into view; a choice made in the thread moves the focus to the answer */
  const count = state.turns.length;
  useEffect(() => {
    const box = thread.current;
    const node = last.current;
    if (!box || !node) return;
    box.scrollTop = Math.max(0, (asked.current ?? node).offsetTop - 12);
    if (fromThread.current) node.focus({ preventScroll: true });
    fromThread.current = false;
  }, [count]);

  const ask = useCallback(
    async (request: AssistantRequest, said: string | null, set?: Record<string, string>) => {
      const answers = set ? { ...state.answers, ...set } : state.answers;
      const reply = await transport.reply(request, context, answers, data);
      // with the managers connected, «a manager» means: write here
      const toManager: AssistantReply = liveOn && request.type === "chip" && request.node === "manager" ? { ...reply, text: lv.managerReply } : reply;
      // the typed message itself has gone to the managers: no «open an e-mail with this message» beside its ready answer
      const shown: AssistantReply = liveOn && request.type === "text" ? { ...toManager, actions: toManager.actions?.filter((action) => !(action.kind === "mail" && action.label === copy.actions.sendText)) } : toManager;
      const at = clock();
      setState((current) => ({ turns: [...current.turns, ...(said === null ? [] : [{ from: "visitor" as const, text: said, at }]), { from: "assistant" as const, reply: shown, at }].slice(-MAX_TURNS), answers }));
    },
    [context, copy.actions.sendText, data, liveOn, lv.managerReply, state.answers, transport],
  );

  const choose = (chip: AssistantChip) => {
    fromThread.current = true;
    track("assistant_chip", { node: chip.node });
    void ask({ type: "chip", node: chip.node }, chip.label, chip.set);
  };

  /* --- live: sending */
  const mark = (key: string, patch: Partial<NonNullable<Extract<AssistantTurn, { from: "visitor" }>["live"]>>) =>
    setState((current) => ({ ...current, turns: current.turns.map((turn) => (turn.from === "visitor" && turn.live?.key === key ? { ...turn, live: { ...turn.live, ...patch } } : turn)) }));

  const problem = (error: unknown) => {
    const code = error instanceof LiveError ? error.code : "server";
    setNotice(lv.errors[code] ?? lv.errors.server);
  };

  /** The guided choices made before the first message travel with it: the manager sees what the visitor was looking for. */
  const trail = () =>
    state.turns
      .filter((turn): turn is Extract<AssistantTurn, { from: "visitor" }> => turn.from === "visitor" && !turn.live)
      .map((turn) => turn.text)
      .slice(-12);

  const deliver = async (said: string, key: string, retried = false): Promise<void> => {
    setNotice(null);
    activity.current = clock();
    try {
      const current = sessionRef.current;
      if (!current) {
        const created = await openConversation({ locale, page: pageInfo(), scenario: trail(), text: said, clientId: key });
        setSession({ id: created.id, token: created.token, seen: 0 });
        setLiveState(created.state);
        absorb(created.messages);
        // said once, when the conversation starts: who has the message and where the answer will appear
        setState((thread) => ({ ...thread, turns: [...thread.turns, { from: "system" as const, id: null, code: "sent" }] }));
        track("assistant_live_open", { context: context.key });
        return;
      }
      const result = await sendText(current, { text: said, clientId: key, page: pageInfo() });
      absorb([result.message]);
    } catch (error) {
      // the conversation is gone on the server (erased, or past its term): the message starts a new one
      if (error instanceof LiveError && (error.status === 401 || error.status === 410) && !retried) {
        setSession(null);
        cursor.current = 0;
        return deliver(said, key, true);
      }
      mark(key, { state: "failed" });
      problem(error);
    }
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const said = text.trim().slice(0, liveOn ? (status?.maxText ?? 2000) : 400);
    if (!said) return;
    const intent = intentOf(said, data, copy);
    // the topic only — the visitor's words are never logged
    track("assistant_text", { intent, live: liveOn });
    setText("");
    if (!liveOn) {
      void ask({ type: "text", text: said }, said);
      return;
    }
    const key = newClientId();
    const human = state.turns.some((turn) => turn.from === "manager");
    setState((current) => ({ ...current, turns: [...current.turns, { from: "visitor" as const, text: said, at: clock(), live: { key, id: null, state: "sending" as const, channel: "site" as const } }].slice(-MAX_TURNS) }));
    // until a person has answered, a question the assistant knows (the published terms, a viewing, a calculator) also gets
    // its ready answer at once; after that the talk is between people and the assistant keeps quiet
    if (!human && !["fallback", "menu", "start"].includes(intent)) void ask({ type: "text", text: said }, null);
    void deliver(said, key);
  };

  const attach = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file || !liveOn) return;
    setNotice(null);
    if (file.size > (status?.maxFile ?? 10 * 1024 * 1024)) return void setNotice(lv.errors.file_too_large);
    const key = newClientId();
    const image = IMAGE_TYPES.includes(file.type);
    setState((current) => ({ ...current, turns: [...current.turns, { from: "visitor" as const, text: "", live: { key, id: null, state: "sending" as const, channel: "site" as const, file: { id: null, name: file.name, mime: file.type, size: file.size, image } } }].slice(-MAX_TURNS) }));
    await pushFile(file, key);
  };

  /** Sends a file of the thread (the first time, or again after a passing failure). */
  const pushFile = async (file: File, key: string) => {
    setNotice(null);
    activity.current = clock();
    try {
      let current = sessionRef.current;
      if (!current) {
        // a file opens the conversation like a message does: its name is the first line
        const created = await openConversation({ locale, page: pageInfo(), scenario: trail(), text: `📎 ${file.name}`.slice(0, 200), clientId: `${key}-t` });
        current = { id: created.id, token: created.token, seen: 0 };
        setSession(current);
        setLiveState(created.state);
        absorb(created.messages);
      }
      const result = await sendFile(current, file, key);
      absorb([result.message]);
      setUnsent((held) => {
        if (!(key in held)) return held;
        const next = { ...held };
        delete next[key];
        return next;
      });
      track("assistant_live_file", { image: IMAGE_TYPES.includes(file.type) });
    } catch (error) {
      mark(key, { state: "failed" });
      // no network, or Telegram did not take the file for a moment: it can be sent again; a refused type or size cannot
      const passing = error instanceof LiveError && (error.status === 0 || error.status >= 500);
      setUnsent((held) => {
        const next = { ...held };
        if (passing) next[key] = file;
        else delete next[key];
        return next;
      });
      problem(error);
    }
  };

  const toTelegram = async () => {
    const current = sessionRef.current;
    if (!current) return;
    // opened at once (a browser blocks a window opened after waiting), then pointed at the one-time link
    const tab = window.open("about:blank", "_blank");
    try {
      const { url } = await telegramLink(current);
      if (tab) tab.location.href = url;
      else window.location.href = url;
      track("assistant_live_telegram");
    } catch (error) {
      tab?.close();
      problem(error);
    }
  };

  const erase = async () => {
    const current = sessionRef.current;
    setEraseAsk(false);
    if (!current) return;
    try {
      await eraseConversation(current);
    } catch (error) {
      if (!(error instanceof LiveError && (error.status === 401 || error.status === 410))) return void problem(error);
    }
    setSession(null);
    setLiveState(null);
    cursor.current = 0;
    setState((thread) => ({ ...thread, turns: [...thread.turns.filter((turn) => !(turn.from === "manager" || turn.from === "system" || (turn.from === "visitor" && turn.live))), { from: "system" as const, id: null, code: "erased" }] }));
  };

  /**
   * A new conversation — only after the visitor confirmed it. The window is cleared; a talk with the managers is not erased
   * (it stays with them, in its topic) but this browser lets it go, so the next message opens a new conversation. Reopening
   * the window, a reload or another page never do this: they continue the conversation the browser holds.
   */
  const restart = async () => {
    setConfirmNew(false);
    try {
      window.sessionStorage.removeItem(storageKey(locale));
      window.sessionStorage.removeItem(draftKey(locale));
    } catch {
      /* storage blocked */
    }
    const reply = await transport.reply({ type: "open" }, context, {}, data);
    fromThread.current = true;
    if (sessionRef.current) track("assistant_live_new");
    setSession(null);
    setLiveState(null);
    setNotice(null);
    cursor.current = 0;
    setQuickPref(null);
    setText("");
    setState({ turns: [{ from: "assistant", reply, at: clock(), opening: true }], answers: {} });
  };
  /** nothing said and no talk with the managers: there is nothing to confirm */
  const askNew = () => (conversing() || text.trim().length > 0 ? setConfirmNew(true) : void restart());

  /* --- actions */
  const go = (action: Extract<AssistantAction, { kind: "route" }>) => (event: MouseEvent<HTMLAnchorElement>) => {
    track("assistant_action", { kind: "route", path: action.path });
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
    event.preventDefault();
    const target = action.locale ?? locale;
    const samePage = action.path === context.path && target === locale;
    // the page takes the screen; the conversation waits behind the launcher
    minimise(false);
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
  const lastIndex = state.turns.length - 1;
  const askedIndex = lastIndex > 0 && state.turns[lastIndex].from === "assistant" && state.turns[lastIndex - 1].from === "visitor" ? lastIndex - 1 : -1;
  const statusText = liveOn ? `${liveState?.open === false || (liveState === null && status?.open === false) ? lv.statusClosed : lv.status}${liveState?.manager ? ` ${lv.with(liveState.manager)}.` : ""}` : ui.status;
  const days = status?.retentionDays ?? 180;

  return (
    <section ref={panel} className="mca-panel" role="dialog" aria-modal={sheet} aria-labelledby="mca-title" tabIndex={-1} lang={locale} data-live={liveOn ? "" : undefined}>
      <header className="mca-head">
        <div className="mca-head__id">
          <span className="mca-head__logo" aria-hidden="true" style={{ "--mca-logo": `url("${publicAsset("/brand/megaparc-logo-compact.svg")}")` } as React.CSSProperties} />
          <p className="mca-head__title" id="mca-title">
            <span className="mca-sr">{brand.name} · </span>
            <span>{ui.title.replace(/\s*MEGAPARC\s*/, "") || ui.title}</span>
            {/* the test mode is named beside the title — always in view, whatever the thread shows */}
            {liveOn && !TEST_MODE ? null : <strong className="mca-status__tag">{ui.trial}</strong>}
          </p>
          <p className="mca-head__context">{context.name ? `${ui.here}: ${context.name}` : ui.kicker}</p>
        </div>
        <div className="mca-head__tools">
          <button type="button" className="mca-head__tool mca-status__restart" aria-label={ui.restart} title={ui.restart} aria-expanded={confirmNew} onClick={askNew}>
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false">
              <path d="M5.5 12a6.5 6.5 0 1 0 2-4.7M5.5 4.5v3.2h3.2" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button type="button" className="mca-head__tool mca-head__min" aria-label={ui.minimise} title={ui.minimise} onClick={() => minimise()}>
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false">
              <path d="M6 17.5h12" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </button>
          <button type="button" className="mca-head__tool mca-head__close" aria-label={ui.close} title={ui.close} onClick={shut}>
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false">
              <path d="M6 6l12 12M18 6 6 18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </header>

      <div className="mca-status" role="note" aria-label={ui.statusLabel}>
        <span className="mca-status__dot" aria-hidden="true" />
        <p className="mca-status__text">{withMail(tie(statusText))}</p>
      </div>

      {confirmNew ? (
        <div className="mca-confirm" role="alertdialog" aria-labelledby="mca-confirm-text">
          <p id="mca-confirm-text">{tie(session ? lv.newAsk : ui.newAsk)}</p>
          <div className="mca-confirm__acts">
            <button ref={confirmYes} type="button" className="mca-confirm__yes" data-new="yes" onClick={() => void restart()}>
              {ui.newYes}
            </button>
            <button type="button" className="mca-confirm__no" data-new="no" onClick={() => setConfirmNew(false)}>
              {ui.newNo}
            </button>
          </div>
        </div>
      ) : null}

      <div ref={thread} className="mca-thread" role="log" aria-label={ui.thread} aria-live="polite">
        {state.turns.map((turn, index) => {
          const anchor = index === lastIndex ? last : index === askedIndex ? asked : undefined;
          if (turn.from === "system")
            return (
              <div key={index} ref={anchor} className="mca-sys" data-code={turn.code} tabIndex={-1}>
                <p>{withMail(tie(lv.events[turn.code] ?? (turn.code === "sent" ? lv.sent : turn.code)))}</p>
              </div>
            );
          if (turn.from === "manager")
            return (
              <div key={index} ref={anchor} className="mca-msg mca-msg--manager" data-id={turn.id} tabIndex={-1}>
                <p className="mca-msg__who mca-msg__meta">
                  <span>{turn.author ? `${turn.author} · MEGAPARC` : lv.manager}</span>
                  {clockTime(turn.at) ? <time> · {clockTime(turn.at)}</time> : null}
                </p>
                <div className="mca-bubble">
                  {turn.file && session ? <LiveFileView file={turn.file} session={session} label={lv.download} /> : null}
                  {turn.text ? <p className="mca-pre">{turn.text}</p> : null}
                </div>
              </div>
            );
          if (turn.from === "visitor") {
            const live = turn.live;
            return (
              <div key={index} ref={anchor} className={`mca-msg mca-msg--visitor${live ? " mca-msg--live" : ""}`} data-state={live?.state} tabIndex={-1}>
                <p className="mca-msg__meta">
                  <span>{ui.visitor}</span>
                  {clockTime(turn.at) ? <time> · {clockTime(turn.at)}</time> : null}
                </p>
                <div className="mca-msg__body">
                  {live?.file ? live.file.id !== null && session ? <LiveFileView file={live.file} session={session} label={lv.download} own /> : <p className="mca-file mca-file--plain">{live.file.name}</p> : null}
                  {turn.text && !(live?.file && turn.text.startsWith("📎")) ? <p className="mca-pre">{turn.text}</p> : null}
                </div>
                {live && (live.state !== "sent" || live.channel === "telegram") ? (
                  <p className="mca-msg__state">
                    {live.channel === "telegram" ? lv.fromTelegram : live.state === "sending" ? lv.states.sending : live.state === "pending" ? lv.states.pending : lv.states.failed}
                    {live.state === "failed" && turn.text && !live.file ? (
                      <button
                        type="button"
                        className="mca-msg__retry"
                        onClick={() => {
                          mark(live.key, { state: "sending" });
                          void deliver(turn.text, live.key);
                        }}
                      >
                        {lv.states.retry}
                      </button>
                    ) : null}
                    {live.state === "failed" && live.file && unsent[live.key] ? (
                      <button
                        type="button"
                        className="mca-msg__retry"
                        data-retry="file"
                        onClick={() => {
                          mark(live.key, { state: "sending" });
                          void pushFile(unsent[live.key], live.key);
                        }}
                      >
                        {lv.states.retry}
                      </button>
                    ) : null}
                  </p>
                ) : null}
              </div>
            );
          }
          const reply = turn.reply;
          const current = index === lastAssistant && !state.turns.slice(index + 1).some((later) => later.from === "manager" || later.from === "visitor");
          const actions = (reply.actions ?? []).filter(usable);
          return (
            <div key={index} ref={anchor} className="mca-msg mca-msg--assistant" tabIndex={-1}>
              <p className="mca-msg__meta">
                <span>{ui.assistant}</span>
                {clockTime(turn.at) ? <time> · {clockTime(turn.at)}</time> : null}
              </p>
              <div className="mca-bubble">
                {reply.text.map((line, i) => (
                  <p key={i}>{tie(line)}</p>
                ))}
                {liveOn && turn.opening ? <p className="mca-bubble__invite">{tie(lv.invite)}</p> : null}
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
                <div className="mca-quick">
                  {/* a long set of choices can be folded away: the conversation keeps the room */}
                  {reply.chips.length >= 4 ? (
                    <div className="mca-quick__head">
                      <span className="mca-quick__label">{ui.quick}</span>
                      <button type="button" className="mca-quick__toggle" aria-expanded={!quickHidden} onClick={() => setQuickPref(!quickHidden)}>
                        <span>{quickHidden ? `${ui.quickShow} · ${reply.chips.length}` : ui.quickHide}</span>
                        <svg className="mca-quick__chevron" viewBox="0 0 24 24" width="14" height="14" aria-hidden="true" focusable="false">
                          <path d="m6 9.5 6 6 6-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </button>
                    </div>
                  ) : null}
                  {quickHidden && reply.chips.length >= 4 ? null : (
                    <div className="mca-chips" data-layout={reply.chips.some((chip) => chip.label.length > 16) ? "list" : "wrap"}>
                      {reply.chips.map((chip, i) => (
                        <button key={i} type="button" className="mca-chip" data-node={chip.node} onClick={() => choose(chip)}>
                          <span>{chip.label}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ) : null}
            </div>
          );
        })}
      </div>

      {liveOn ? (
        <div className="mca-privacy">
          <p className="mca-privacy__short">
            {session ? null : <>{tie(lv.privacy.short)} </>}
            <button type="button" className="mca-privacy__more" aria-expanded={privacyOpen} onClick={() => setPrivacyOpen((open) => !open)}>
              {privacyOpen ? lv.privacy.less : lv.privacy.more}
            </button>
          </p>
          {TEST_MODE ? <p className="mca-privacy__test">{tie(lv.privacy.test)}</p> : null}
          {privacyOpen ? (
            <div className="mca-privacy__details">
              {lv.privacy.details(days).map((line, i) => (
                <p key={i}>{tie(line)}</p>
              ))}
              {session ? (
                eraseAsk ? (
                  <p className="mca-privacy__erase">
                    <span>{lv.privacy.eraseConfirm}</span>
                    <button type="button" data-erase="yes" onClick={() => void erase()}>
                      {lv.privacy.eraseYes}
                    </button>
                    <button type="button" onClick={() => setEraseAsk(false)}>
                      {lv.privacy.eraseNo}
                    </button>
                  </p>
                ) : (
                  <p className="mca-privacy__erase">
                    <button type="button" data-erase="ask" onClick={() => setEraseAsk(true)}>
                      {lv.privacy.erase}
                    </button>
                  </p>
                )
              ) : null}
            </div>
          ) : null}
        </div>
      ) : null}

      {notice ? (
        <p className="mca-alert" role="alert">
          {tie(notice)}
        </p>
      ) : null}

      <form className="mca-form" onSubmit={submit}>
        <div className="mca-form__field">
        {liveOn ? (
          <>
            <input ref={picker} className="mca-sr" type="file" tabIndex={-1} aria-hidden="true" accept={ACCEPT} onChange={(event) => void attach(event)} />
            <button type="button" className="mca-form__attach" aria-label={lv.attach} title={lv.attach} onClick={() => picker.current?.click()}>
              <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false">
                <path d="M19.5 11.5 12 19a4.6 4.6 0 0 1-6.5-6.5l8-8a3.1 3.1 0 0 1 4.4 4.4l-7.8 7.8a1.6 1.6 0 0 1-2.3-2.3l7-7" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </>
        ) : null}
        <label className="mca-sr" htmlFor="mca-input">
          {liveOn ? lv.placeholder : ui.placeholder}
        </label>
        <textarea
          id="mca-input"
          ref={field}
          className="mca-form__input"
          rows={1}
          inputMode="text"
          autoComplete="off"
          enterKeyHint="send"
          maxLength={liveOn ? (status?.maxText ?? 2000) : 400}
          placeholder={liveOn ? lv.placeholder : ui.placeholder}
          value={text}
          onChange={(event) => {
            activity.current = clock();
            setText(event.target.value);
          }}
          onKeyDown={(event) => {
            // Enter sends, Shift + Enter starts a new line; never while an input method is composing a character
            if (event.key !== "Enter" || event.shiftKey || event.nativeEvent.isComposing) return;
            event.preventDefault();
            event.currentTarget.form?.requestSubmit();
          }}
        />
        <button type="submit" className="mca-form__send" aria-label={ui.send} disabled={!text.trim()}>
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false">
            <path d="M12 19V5m-6 6 6-6 6 6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        </div>
      </form>

      <footer className="mca-foot">
        {liveOn ? null : <p className="mca-foot__note">{tie(ui.inputNote)}</p>}
        {liveOn && session && liveState?.telegram && !liveState.linked ? (
          <button type="button" className="mca-foot__telegram" title={lv.telegramHint} onClick={() => void toTelegram()}>
            <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" focusable="false">
              <path d="m20.5 4.5-17 6.6 5.2 1.9 2 6 3-3.6 4.3 3.1zM8.7 13l7.3-5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
            </svg>
            <span>{lv.telegram}</span>
          </button>
        ) : null}
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

/**
 * A file of the live conversation. The bytes come through the assistant server with the conversation's token in a header:
 * a photograph is shown, a document is saved on request. Nothing is loaded from Telegram directly.
 */
function LiveFileView({ file, session, label, own = false }: { file: AssistantFile; session: LiveSession; label: string; own?: boolean }) {
  const [url, setUrl] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);
  const id = file.id;
  useEffect(() => {
    if (!file.image || id === null) return;
    let cancelled = false;
    let made: string | null = null;
    fetchFile(session, id).then(
      (blob) => {
        if (cancelled) return;
        made = URL.createObjectURL(blob);
        setUrl(made);
      },
      () => setFailed(true),
    );
    return () => {
      cancelled = true;
      if (made) URL.revokeObjectURL(made);
    };
  }, [file.image, id, session]);

  const save = async () => {
    if (id === null) return;
    try {
      const blob = await fetchFile(session, id);
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = file.name;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(link.href), 5000);
    } catch {
      setFailed(true);
    }
  };

  if (file.image && url)
    return (
      // eslint-disable-next-line @next/next/no-img-element -- a blob of the conversation, not a site asset
      <img className="mca-photo" src={url} alt={file.name} />
    );
  return (
    <button type="button" className={`mca-file${own ? " mca-file--own" : ""}`} onClick={() => void save()} disabled={failed} data-file={file.name}>
      <Arrow down />
      <span className="mca-file__name">{file.name}</span>
      <small className="mca-file__meta">
        {formatSize(file.size)} · {label}
      </small>
    </button>
  );
}

function Arrow({ out = false, down = false }: { out?: boolean; down?: boolean }) {
  return (
    <svg className="mca-arrow" viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" focusable="false">
      <path d={down ? "M12 5v13m-6-6 6 6 6-6" : out ? "M7 17 17 7M8 7h9v9" : "M5 12h14m-7-7 7 7-7 7"} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
