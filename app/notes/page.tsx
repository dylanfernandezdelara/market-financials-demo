"use client";

import { useState, useCallback, useRef } from "react";
import Link from "next/link";

interface Note {
  id: string;
  symbol: string;
  content: string;
  updatedAt: number;
}

const STORAGE_KEY = "market-notes";

function loadNotes(): Note[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Note[]) : [];
  } catch {
    return [];
  }
}

function saveNotes(notes: Note[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
}

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>(() => loadNotes());
  const [activeId, setActiveId] = useState<string | null>(() => {
    const stored = loadNotes();
    return stored.length > 0 ? stored[0].id : null;
  });
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [symbolFilter, setSymbolFilter] = useState("");
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const persist = useCallback(
    (next: Note[]) => {
      setNotes(next);
      saveNotes(next);
      setSaveStatus("Saved");
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
      saveTimerRef.current = setTimeout(() => setSaveStatus(null), 1500);
    },
    [],
  );

  const activeNote = notes.find((n) => n.id === activeId) ?? null;

  const filteredNotes = symbolFilter
    ? notes.filter(
        (n) =>
          n.symbol.toLowerCase().includes(symbolFilter.toLowerCase()) ||
          n.content.toLowerCase().includes(symbolFilter.toLowerCase()),
      )
    : notes;

  function createNote() {
    const note: Note = {
      id: crypto.randomUUID(),
      symbol: "",
      content: "",
      updatedAt: Date.now(),
    };
    const next = [note, ...notes];
    persist(next);
    setActiveId(note.id);
  }

  function updateNote(id: string, patch: Partial<Pick<Note, "content" | "symbol">>) {
    const next = notes.map((n) =>
      n.id === id ? { ...n, ...patch, updatedAt: Date.now() } : n,
    );
    persist(next);
  }

  function deleteNote(id: string) {
    const next = notes.filter((n) => n.id !== id);
    persist(next);
    if (activeId === id) setActiveId(next[0]?.id ?? null);
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900">Notes</h1>
          <p className="mt-1 text-sm text-neutral-500">
            Capture trade ideas and link them to symbols or your portfolio.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {saveStatus && (
            <span className="text-xs text-emerald-600">{saveStatus}</span>
          )}
          <button
            type="button"
            onClick={createNote}
            className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white"
          >
            New note
          </button>
        </div>
      </div>

      <div className="mt-4">
        <input
          type="text"
          value={symbolFilter}
          onChange={(e) => setSymbolFilter(e.target.value)}
          placeholder="Filter by symbol or keyword…"
          className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm"
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[280px_1fr]">
        {/* Note list */}
        <div className="space-y-2 overflow-y-auto lg:max-h-[520px]">
          {filteredNotes.length === 0 && (
            <p className="text-sm text-neutral-400">
              {notes.length === 0
                ? "No notes yet — create one to get started."
                : "No matching notes."}
            </p>
          )}
          {filteredNotes.map((note) => (
            <button
              key={note.id}
              type="button"
              onClick={() => setActiveId(note.id)}
              className={`w-full rounded-lg border px-3 py-3 text-left text-sm transition-colors ${
                note.id === activeId
                  ? "border-neutral-400 bg-white"
                  : "border-neutral-200 bg-neutral-50 hover:bg-white"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-semibold text-neutral-900">
                  {note.symbol || "—"}
                </span>
                <span className="text-[11px] text-neutral-400">
                  {new Date(note.updatedAt).toLocaleDateString()}
                </span>
              </div>
              <p className="mt-1 line-clamp-2 text-neutral-600">
                {note.content || "Empty note"}
              </p>
            </button>
          ))}
        </div>

        {/* Editor */}
        {activeNote ? (
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <label className="text-sm font-medium text-neutral-700">
                Symbol
                <input
                  type="text"
                  value={activeNote.symbol}
                  onChange={(e) =>
                    updateNote(activeNote.id, {
                      symbol: e.target.value.toUpperCase(),
                    })
                  }
                  placeholder="e.g. AAPL"
                  className="ml-2 w-28 rounded-lg border border-neutral-200 px-2 py-1 font-mono text-sm"
                />
              </label>
              <button
                type="button"
                onClick={() => deleteNote(activeNote.id)}
                className="ml-auto text-sm text-red-500 hover:text-red-700"
              >
                Delete
              </button>
            </div>
            <textarea
              className="min-h-[320px] w-full rounded-lg border border-neutral-200 p-3 text-sm"
              placeholder="Jot thesis bullets…"
              value={activeNote.content}
              onChange={(e) =>
                updateNote(activeNote.id, { content: e.target.value })
              }
            />
          </div>
        ) : (
          <div className="flex min-h-[200px] items-center justify-center rounded-lg border border-dashed border-neutral-300 text-sm text-neutral-400">
            Select or create a note
          </div>
        )}
      </div>

      <p className="mt-6 text-sm text-neutral-500">
        <Link href="/portfolio" className="text-neutral-900 underline">
          Back to portfolio
        </Link>
      </p>
    </div>
  );
}
