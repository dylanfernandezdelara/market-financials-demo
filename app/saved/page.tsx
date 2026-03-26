"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import type { SavedLayout } from "@/types/finance";

export default function SavedLayoutsPage() {
  const [layouts, setLayouts] = useState<SavedLayout[]>([]);
  const [defaultLayoutId, setDefaultLayoutId] = useState<string>("default");
  const [newName, setNewName] = useState("");

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      fetch("/api/user/layouts"),
      fetch("/api/user/preferences"),
    ])
      .then(async ([layoutsRes, prefsRes]) => {
        const layoutsData = await layoutsRes.json();
        const prefsData = await prefsRes.json();
        if (!cancelled) {
          setLayouts(layoutsData.layouts ?? []);
          setDefaultLayoutId(prefsData.defaultLayoutId ?? "default");
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = newName.trim();
    if (!trimmed) return;
    const res = await fetch("/api/user/layouts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: trimmed, widgets: [] }),
    });
    if (res.ok) {
      const created: SavedLayout = await res.json();
      setLayouts((prev) => [...prev, created]);
      setNewName("");
    }
  }

  async function handleDelete(id: string) {
    const res = await fetch(`/api/user/layouts?id=${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
    if (res.ok) {
      setLayouts((prev) => prev.filter((l) => l.id !== id));
    }
  }

  async function handleSetDefault(id: string) {
    const res = await fetch("/api/user/preferences", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ defaultLayoutId: id }),
    });
    if (res.ok) {
      setDefaultLayoutId(id);
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="text-2xl font-semibold text-neutral-900">Saved layouts</h1>
      <p className="mt-2 text-sm text-neutral-600">
        Reuse dashboard arrangements across devices.
      </p>

      <ul className="mt-6 space-y-3">
        {layouts.map((layout) => (
          <li
            key={layout.id}
            className="flex items-center justify-between rounded-lg border border-neutral-200 bg-white px-4 py-3"
          >
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-neutral-900">{layout.name}</span>
              {layout.id === defaultLayoutId && (
                <span className="rounded bg-neutral-100 px-1.5 py-0.5 text-xs text-neutral-500">
                  default
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {layout.id !== defaultLayoutId && (
                <button
                  onClick={() => handleSetDefault(layout.id)}
                  className="text-xs text-neutral-500 underline hover:text-neutral-700"
                >
                  Set as default
                </button>
              )}
              {layout.id !== "default" && (
                <button
                  onClick={() => handleDelete(layout.id)}
                  className="text-xs text-red-500 underline hover:text-red-700"
                >
                  Delete
                </button>
              )}
            </div>
          </li>
        ))}
        {layouts.length === 0 && (
          <li className="rounded-lg border border-neutral-200 bg-white p-4 text-sm text-neutral-500">
            No saved layouts yet.
          </li>
        )}
      </ul>

      <form onSubmit={handleCreate} className="mt-6 flex items-center gap-3">
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="New layout name"
          className="flex-1 rounded-lg border border-neutral-200 px-3 py-2 text-sm"
        />
        <button
          type="submit"
          className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white"
        >
          Save layout
        </button>
      </form>

      <Link href="/settings" className="mt-6 inline-block text-sm text-neutral-400 underline">
        Manage in settings
      </Link>
    </div>
  );
}
