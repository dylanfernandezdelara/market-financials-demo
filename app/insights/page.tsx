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
      <p className="mt-4 text-sm text-neutral-500">
        Rows loaded: {rows ? rows.length + 1 : "—"}
      </p>
      <div className="mt-6 max-h-96 overflow-auto rounded-lg border border-neutral-200 bg-white text-xs font-mono">
        {rows?.slice(0, 12).map((r) => (
          <div key={r.id} className="border-b border-neutral-100 px-2 py-1">
            {r.id}: {r.values.map((v) => v.toFixed(2)).join(", ")}
          </div>
        ))}
      </div>
    </div>
  );
}
