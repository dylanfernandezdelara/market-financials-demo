"use client";

import Link from "next/link";
import { StickyNote, Trash2 } from "lucide-react";
import { useSymbolNotes } from "@/lib/use-symbol-notes";

export default function NotesPage() {
  const { notes, deleteNote } = useSymbolNotes();

  const grouped = new Map<string, typeof notes>();
  for (const note of notes) {
    const existing = grouped.get(note.symbol) ?? [];
    existing.push(note);
    grouped.set(note.symbol, existing);
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-10">
      <div className="flex items-center gap-2">
        <StickyNote className="size-5 text-neutral-500" strokeWidth={1.75} />
        <h1 className="text-2xl font-semibold text-neutral-900">Notes</h1>
      </div>

      {notes.length === 0 ? (
        <p className="mt-6 text-[14px] text-neutral-500">
          No notes yet. Visit a{" "}
          <Link href="/" className="text-neutral-800 underline underline-offset-2">
            stock detail
          </Link>{" "}
          page to add symbol-centric notes.
        </p>
      ) : (
        <div className="mt-8 space-y-8">
          {Array.from(grouped.entries()).map(([symbol, symbolNotes]) => (
            <section key={symbol}>
              <div className="flex items-center gap-2">
                <Link
                  href={`/stocks/${symbol}`}
                  className="text-[17px] font-semibold text-[#1a1a1a] hover:underline"
                >
                  {symbol}
                </Link>
                <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-[11px] font-medium text-neutral-500">
                  {symbolNotes.length}
                </span>
              </div>
              <ul className="mt-3 space-y-3 border-l border-[#e5e5e5] pl-4">
                {symbolNotes.map((note) => (
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
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
