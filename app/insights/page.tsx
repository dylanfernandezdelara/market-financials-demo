"use client";

import { useDeferredValue, useEffect, useState } from "react";

type Row = { id: string; values: number[] };

export default function InsightsExplorerPage() {
  const [rows, setRows] = useState<Row[] | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);

  useEffect(() => {
    fetch("/api/insights")
      .then((r) => r.json())
      .then((j) => setRows(j.rows as Row[]))
      .catch(() => setErr("Unable to load"));
  }, []);

  const normalizedQuery = deferredQuery.trim().toLowerCase();
  const filtered = rows
    ? rows.filter((r) => r.id.toLowerCase().includes(normalizedQuery))
    : null;

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <h1 className="text-2xl font-semibold text-neutral-900">Insight explorer</h1>
      <p className="mt-2 text-sm text-neutral-600">Batch metric outputs for validation.</p>
      {err ? <p className="mt-4 text-sm text-red-600">{err}</p> : null}
      <div className="mt-4">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Filter by metric ID…"
          className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900 outline-none placeholder:text-neutral-400 focus:border-neutral-400"
        />
      </div>
      <p className="mt-3 text-sm text-neutral-500">
        Showing {filtered ? filtered.length : "—"} of {rows ? rows.length : "—"} metrics
      </p>
      <div className="mt-4 max-h-96 overflow-auto rounded-lg border border-neutral-200 bg-white text-xs font-mono">
        {filtered?.map((r) => (
          <div key={r.id} className="border-b border-neutral-100 px-2 py-1">
            {r.id}: {r.values.map((v) => v.toFixed(2)).join(", ")}
          </div>
        ))}
      </div>
    </div>
  );
}
