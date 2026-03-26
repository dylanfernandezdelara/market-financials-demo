export type Watchlist = {
  id: string;
  name: string;
  symbols: string[];
};

let nextId = 1;

const store: Map<string, Watchlist> = new Map([
  ["primary", { id: "primary", name: "Primary", symbols: ["AAPL", "MSFT"] }],
]);

function generateId(): string {
  return `wl_${nextId++}`;
}

export function getAllWatchlists(): Watchlist[] {
  return Array.from(store.values());
}

export function getWatchlist(id: string): Watchlist | undefined {
  return store.get(id);
}

export function createWatchlist(name: string, symbols: string[]): Watchlist {
  const id = generateId();
  const unique = [...new Set(symbols.map((s) => s.toUpperCase()))];
  const watchlist: Watchlist = { id, name, symbols: unique };
  store.set(id, watchlist);
  return watchlist;
}

export function updateWatchlist(
  id: string,
  updates: { name?: string; symbols?: string[] },
): Watchlist | undefined {
  const existing = store.get(id);
  if (!existing) return undefined;

  const updated: Watchlist = {
    ...existing,
    ...(updates.name !== undefined ? { name: updates.name } : {}),
    ...(updates.symbols !== undefined
      ? { symbols: [...new Set(updates.symbols.map((s) => s.toUpperCase()))] }
      : {}),
  };
  store.set(id, updated);
  return updated;
}

export function deleteWatchlist(id: string): boolean {
  return store.delete(id);
}
