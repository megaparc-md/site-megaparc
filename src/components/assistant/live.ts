import type { SiteLocale } from "@/lib/site-data";

/**
 * MEGAPARC COMMERCIAL ASSISTANT — the live channel (OWNER «TELEGRAM FIRST · TWO-WAY COMMUNICATION», 2026-11-24).
 *
 *   this chat window  ⇄  the assistant server (server/assistant — a Cloudflare Worker)  ⇄  the managers' Telegram group
 *
 * The site stays static. The window knows one public address — `NEXT_PUBLIC_ASSISTANT_ENDPOINT` — and nothing secret:
 * the bot's token and every key live on the server. Without the address the assistant works exactly as the guided
 * prototype did (no live chat is offered or implied).
 *
 * A conversation belongs to this browser: its id and its secret token are kept in localStorage, so the dialogue is there
 * again after a reload or the next visit. The visitor can erase it from the server at any time.
 */
export const LIVE_ENDPOINT = (process.env.NEXT_PUBLIC_ASSISTANT_ENDPOINT ?? "").replace(/\/+$/, "");
export const liveConfigured = LIVE_ENDPOINT.length > 0;

export type LiveStatus = { live: boolean; open: boolean | null; telegram: string | null; challenge: boolean; maxFile: number; maxText: number; retentionDays: number };
export type LiveFile = { name: string; mime: string; size: number };
export type LiveMessage = {
  id: number;
  from: "visitor" | "manager" | "system";
  kind: "text" | "photo" | "document" | "event";
  text: string;
  file: LiveFile | null;
  author: string | null;
  channel: "site" | "telegram";
  clientId: string | null;
  delivery: "pending" | "done" | "failed";
  at: number;
};
export type LiveState = { status: "open" | "closed"; manager: string | null; open: boolean | null; telegram: string | null; linked: boolean };
export type LiveSession = { id: string; token: string; seen: number };
export type LivePage = { path: string; name: string | null; url: string; key: string };

export class LiveError extends Error {
  constructor(
    public status: number,
    public code: string,
  ) {
    super(code);
  }
}

const KEY = "mca:live:v1";

export function loadSession(): LiveSession | null {
  try {
    const value = JSON.parse(window.localStorage.getItem(KEY) ?? "null") as LiveSession | null;
    return value && typeof value.id === "string" && typeof value.token === "string" ? { ...value, seen: Number(value.seen) || 0 } : null;
  } catch {
    return null;
  }
}

export function saveSession(session: LiveSession | null): void {
  try {
    if (session) window.localStorage.setItem(KEY, JSON.stringify(session));
    else window.localStorage.removeItem(KEY);
  } catch {
    /* storage blocked: the conversation lives for this page only */
  }
}

export const newClientId = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;

async function call<T>(path: string, init: RequestInit & { token?: string } = {}): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${LIVE_ENDPOINT}${path}`, { ...init, headers: { ...(init.body && !(init.body instanceof FormData) ? { "Content-Type": "application/json" } : {}), ...(init.token ? { Authorization: `Bearer ${init.token}` } : {}), ...(init.headers ?? {}) }, credentials: "omit" });
  } catch {
    throw new LiveError(0, "offline");
  }
  const data = (await response.json().catch(() => null)) as (T & { error?: string }) | null;
  if (!response.ok) throw new LiveError(response.status, data?.error ?? "server");
  return data as T;
}

let statusCache: Promise<LiveStatus> | null = null;
/** Is the chat connected to the managers, and are they in working hours (null = no hours are stated). */
export function liveStatus(fresh = false): Promise<LiveStatus> {
  if (!statusCache || fresh)
    statusCache = call<LiveStatus>("/v1/status").catch((error) => {
      statusCache = null;
      throw error;
    });
  return statusCache;
}

export const openConversation = (input: { locale: SiteLocale; page: LivePage; scenario: string[]; text: string; clientId: string }) =>
  call<{ id: string; token: string; code: string; messages: LiveMessage[]; state: LiveState }>("/v1/conversations", { method: "POST", body: JSON.stringify({ ...input, website: "" }) });

export const sendText = (session: LiveSession, input: { text: string; clientId: string; page: LivePage }) =>
  call<{ message: LiveMessage }>(`/v1/conversations/${session.id}/messages`, { method: "POST", token: session.token, body: JSON.stringify(input) });

export function sendFile(session: LiveSession, file: File, clientId: string) {
  const form = new FormData();
  form.set("file", file);
  form.set("clientId", clientId);
  return call<{ message: LiveMessage }>(`/v1/conversations/${session.id}/files`, { method: "POST", token: session.token, body: form });
}

export const fetchEvents = (session: LiveSession, after: number) =>
  call<{ messages: LiveMessage[]; unsettled: { id: number; delivery: "pending" | "failed" }[]; state: LiveState }>(`/v1/conversations/${session.id}/events?after=${after}`, { token: session.token });

/** A file of the conversation as a blob (the token travels in a header, never in an address). */
export async function fetchFile(session: LiveSession, messageId: number): Promise<Blob> {
  let response: Response;
  try {
    response = await fetch(`${LIVE_ENDPOINT}/v1/conversations/${session.id}/files/${messageId}`, { headers: { Authorization: `Bearer ${session.token}` }, credentials: "omit" });
  } catch {
    throw new LiveError(0, "offline");
  }
  if (!response.ok) throw new LiveError(response.status, "file_unavailable");
  return response.blob();
}

export const telegramLink = (session: LiveSession) => call<{ url: string }>(`/v1/conversations/${session.id}/telegram`, { method: "POST", token: session.token });

export const eraseConversation = (session: LiveSession) => call<{ deleted: boolean }>(`/v1/conversations/${session.id}`, { method: "DELETE", token: session.token });

export const formatSize = (bytes: number) => (bytes >= 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(1)} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB`);
