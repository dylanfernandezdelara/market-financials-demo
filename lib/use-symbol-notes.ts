"use client";

import { useCallback, useSyncExternalStore } from "react";
import type { SymbolNote } from "@/types/finance";

const STORAGE_KEY = "symbol-notes";

let listeners: Array<() => void> = [];

function emitChange() {
  for (const listener of listeners) {
    listener();
  }
}

function subscribe(listener: () => void) {
  listeners = [...listeners, listener];
  return () => {
    listeners = listeners.filter((l) => l !== listener);
  };
}

function getSnapshot(): string {
  return globalThis.localStorage?.getItem(STORAGE_KEY) ?? "[]";
}

function getServerSnapshot(): string {
  return "[]";
}

function readNotes(): SymbolNote[] {
  try {
    return JSON.parse(getSnapshot()) as SymbolNote[];
  } catch {
    return [];
  }
}

function writeNotes(notes: SymbolNote[]) {
  globalThis.localStorage?.setItem(STORAGE_KEY, JSON.stringify(notes));
  emitChange();
}

export function useSymbolNotes(symbol?: string) {
  const raw = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const notes: SymbolNote[] = (() => {
    try {
      const parsed = JSON.parse(raw) as SymbolNote[];
      return symbol
        ? parsed.filter((n) => n.symbol === symbol)
        : parsed;
    } catch {
      return [];
    }
  })();

  const addNote = useCallback(
    (noteSymbol: string, content: string) => {
      const all = readNotes();
      const note: SymbolNote = {
        id: `${noteSymbol}-${Date.now()}`,
        symbol: noteSymbol,
        content,
        createdAt: new Date().toISOString(),
      };
      writeNotes([note, ...all]);
    },
    [],
  );

  const deleteNote = useCallback((id: string) => {
    const all = readNotes();
    writeNotes(all.filter((n) => n.id !== id));
  }, []);

  return { notes, addNote, deleteNote } as const;
}
