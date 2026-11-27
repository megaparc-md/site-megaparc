"use client";

import { useSyncExternalStore } from "react";
import { loadState, onStateChange, saveState, type DeskState } from "@/components/visit-planner/store";

/**
 * The demonstration record, the clock and the page address as external stores — the planner and the cabinet render from them and
 * never copy them into component state, so a change made in another tab (an employee confirms a request) is seen at once.
 */
const KEY = "megaparc:visit-demo:v1";
let cachedRaw: string | null = null;
let cachedState: DeskState | null = null;

function readState(): DeskState | null {
  let raw: string | null = null;
  try { raw = window.localStorage.getItem(KEY); } catch { raw = null; }
  // a blocked storage reads as null: the record then lives in memory for the life of the page
  if (cachedState && (raw === cachedRaw || raw === null)) return cachedState;
  const state = loadState(Date.now());
  try { cachedRaw = window.localStorage.getItem(KEY); } catch { cachedRaw = null; }
  cachedState = state;
  return cachedState;
}

/** the demonstration record of this browser; null while the page is still server HTML */
export function useDeskState(): DeskState | null {
  return useSyncExternalStore(onStateChange, readState, () => null);
}

/** write a new record: storage first, then every open view is told */
export function commit(next: DeskState) {
  cachedState = next;
  cachedRaw = JSON.stringify(next);
  saveState(next);
}

let nowCache = 0;
const tickers = new Set<() => void>();
let timer: number | null = null;

function subscribeClock(listener: () => void) {
  tickers.add(listener);
  if (timer === null) timer = window.setInterval(() => { nowCache = Date.now(); tickers.forEach((tick) => tick()); }, 30_000);
  return () => {
    tickers.delete(listener);
    if (!tickers.size && timer !== null) { window.clearInterval(timer); timer = null; }
  };
}

/** the current instant, refreshed twice a minute (0 while the page is still server HTML) */
export function useNow(): number {
  return useSyncExternalStore(subscribeClock, () => { if (!nowCache) nowCache = Date.now(); return nowCache; }, () => 0);
}

const ADDRESS = "megaparc:visit-address";

function subscribeAddress(listener: () => void) {
  window.addEventListener("popstate", listener);
  window.addEventListener("hashchange", listener);
  window.addEventListener(ADDRESS, listener);
  return () => { window.removeEventListener("popstate", listener); window.removeEventListener("hashchange", listener); window.removeEventListener(ADDRESS, listener); };
}

/** the query string of the page («?r=…&src=tour»); empty in server HTML */
export function useQuery(): string {
  return useSyncExternalStore(subscribeAddress, () => window.location.search, () => "");
}

/** the fragment of the page («#calendar»); empty in server HTML */
export function useHash(): string {
  return useSyncExternalStore(subscribeAddress, () => window.location.hash, () => "");
}

/** change the query or the fragment without a navigation */
export function setAddress(update: { query?: Record<string, string | null>; hash?: string }) {
  const url = new URL(window.location.href);
  for (const [key, value] of Object.entries(update.query ?? {})) { if (value === null) url.searchParams.delete(key); else url.searchParams.set(key, value); }
  if (update.hash !== undefined) url.hash = update.hash;
  window.history.replaceState(null, "", url);
  window.dispatchEvent(new Event(ADDRESS));
}
