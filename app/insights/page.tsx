"use client";

import { useEffect, useState } from "react";

type Row = { id: string; values: number[] };

export default function InsightsExplorerPage() {
  const [rows, setRows] = useState<Row[] | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/insights")
      .then((r) => r.json())
      .then((j) => setRows(j.rows as Row[]))
      .catch(() => setErr("Unable to load"));
  }, []);

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <h1 className="text-2xl font-semibold text-neutral-900">Insight explorer</h1>
      <p className="mt-2 text-sm text-neutral-600">Batch metric outputs for validation.</p>
      {err ? <p className="mt-4 text-sm text-red-600">{err}</p> : null}
      {!err && !rows ? (
        <div className="mt-6 space-y-3">
          <div className="h-4 w-32 animate-pulse rounded bg-neutral-200" />
          <div className="overflow-hidden rounded-lg border border-neutral-200 bg-white">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="border-b border-neutral-100 px-2 py-1">
                <div className="h-3.5 w-full animate-pulse rounded bg-neutral-100" />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <>
          <p className="mt-4 text-sm text-neutral-500">
            Rows loaded: {rows ? rows.length : "—"}
          </p>
          <div className="mt-6 max-h-96 overflow-auto rounded-lg border border-neutral-200 bg-white text-xs font-mono">
            {rows?.slice(0, 12).map((r) => (
              <div key={r.id} className="border-b border-neutral-100 px-2 py-1">
                {r.id}: {r.values.map((v) => v.toFixed(2)).join(", ")}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
