"use client";

import { useState } from "react";
import { StickyNote, Trash2 } from "lucide-react";
import { useSymbolNotes } from "@/lib/use-symbol-notes";

type StockNoteEditorProps = {
  symbol: string;
};

export function StockNoteEditor({ symbol }: StockNoteEditorProps) {
  const { notes, addNote, deleteNote } = useSymbolNotes(symbol);
  const [draft, setDraft] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = draft.trim();
    if (!trimmed) return;
    addNote(symbol, trimmed);
    setDraft("");
  }

  return (
    <section className="rounded-xl border border-[#ebebeb] bg-white p-4">
      <div className="flex items-center gap-2">
        <StickyNote className="size-4 text-neutral-500" strokeWidth={1.75} />
        <h3 className="text-[15px] font-semibold text-[#1a1a1a]">Notes</h3>
      </div>
      <form onSubmit={handleSubmit} className="mt-3">
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder={`Add a note about ${symbol}…`}
          className="w-full rounded-lg border border-neutral-200 p-2.5 text-[13px] leading-relaxed text-neutral-800 placeholder:text-neutral-400 focus:border-neutral-400 focus:outline-none"
          rows={3}
        />
        <button
          type="submit"
          disabled={!draft.trim()}
          className="mt-2 rounded-lg bg-[#1a1a1a] px-3 py-1.5 text-[12px] font-medium text-white transition-opacity disabled:opacity-40"
        >
          Save note
        </button>
      </form>

      {notes.length > 0 && (
        <ul className="mt-4 space-y-3 border-t border-[#f0f0f0] pt-4">
          {notes.map((note) => (
            <li key={note.id} className="group relative text-[13px]">
              <p className="whitespace-pre-wrap leading-relaxed text-neutral-700">
                {note.content}
              </p>
              <div className="mt-1 flex items-center gap-2">
                <time className="text-[11px] text-neutral-400">
                  {new Date(note.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                </time>
                <button
                  type="button"
                  onClick={() => deleteNote(note.id)}
                  className="inline-flex items-center gap-1 text-[11px] text-neutral-400 opacity-0 transition-opacity hover:text-red-500 group-hover:opacity-100"
                  aria-label="Delete note"
                >
                  <Trash2 className="size-3" />
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
