/**
 * Shared in-memory persistence layer for alerts and watchlists.
 *
 * Both the API route handlers and the server-side data helpers read from /
 * write to the same module-level state so that mutations performed through the
 * API are immediately visible to pages that call the data helpers.
 *
 * Because the store lives in module scope it persists for the lifetime of the
 * server process — comparable to an in-memory database.  A real deployment
 * would swap this for a proper database; the API surface stays the same.
 */

import { watchlistSymbols } from "@/lib/mock-data";

// ---------------------------------------------------------------------------
// Alert types & store
// ---------------------------------------------------------------------------

export type AlertRule = {
  id: string;
  symbol: string;
  targetPrice: number;
  direction: "above" | "below";
  createdAt: string;
};

let alertRules: AlertRule[] = [];

let alertSeq = 1;

function nextAlertId(): string {
  return `alert-${alertSeq++}`;
}

export function getAlerts(): AlertRule[] {
  return alertRules;
}

export function addAlert(
  rule: Omit<AlertRule, "id" | "createdAt">,
): AlertRule {
  const entry: AlertRule = {
    ...rule,
    id: nextAlertId(),
    createdAt: new Date().toISOString(),
  };
  alertRules = [...alertRules, entry];
  return entry;
}

export function removeAlert(id: string): boolean {
  const before = alertRules.length;
  alertRules = alertRules.filter((rule) => rule.id !== id);
  return alertRules.length < before;
}

export function clearAlerts(): number {
  const count = alertRules.length;
  alertRules = [];
  return count;
}

// ---------------------------------------------------------------------------
// Watchlist types & store
// ---------------------------------------------------------------------------

export type WatchlistList = {
  id: string;
  name: string;
  symbols: string[];
};

let watchlists: WatchlistList[] = [
  { id: "primary", name: "Primary", symbols: [...watchlistSymbols] },
];

let wlSeq = 1;

function nextWatchlistId(): string {
  return `wl-${wlSeq++}`;
}

export function getWatchlists(): WatchlistList[] {
  return watchlists;
}

export function getWatchlistSymbols(): string[] {
  const primary = watchlists.find((wl) => wl.id === "primary");
  return primary ? primary.symbols : [];
}

export function addWatchlist(name: string, symbols: string[]): WatchlistList {
  const entry: WatchlistList = { id: nextWatchlistId(), name, symbols };
  watchlists = [...watchlists, entry];
  return entry;
}

export function updateWatchlist(
  id: string,
  patch: { name?: string; symbols?: string[] },
): WatchlistList | null {
  const idx = watchlists.findIndex((wl) => wl.id === id);
  if (idx === -1) return null;
  const updated: WatchlistList = {
    ...watchlists[idx],
    ...(patch.name !== undefined ? { name: patch.name } : {}),
    ...(patch.symbols !== undefined ? { symbols: patch.symbols } : {}),
  };
  watchlists = watchlists.map((wl, i) => (i === idx ? updated : wl));
  return updated;
}
