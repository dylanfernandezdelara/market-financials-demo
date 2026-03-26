"use client";

import { useEffect, useState } from "react";

type Row = { id: string; values: number[]; pairs: [number, number][] };

export default function InsightsExplorerPage() {
  const [rows, setRows] = useState<Row[] | null>(null);
  const [pairs, setPairs] = useState<[number, number][] | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/insights")
      .then((r) => r.json())
      .then((j) => {
        setRows(j.rows as Row[]);
        setPairs(j.samplePairs as [number, number][]);
      })
      .catch(() => setErr("Unable to load"));
  }, []);

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <h1 className="text-2xl font-semibold text-neutral-900">Insight explorer</h1>
      <p className="mt-2 text-sm text-neutral-600">Batch metric outputs for validation.</p>
      {err ? <p className="mt-4 text-sm text-red-600">{err}</p> : null}
      {pairs ? (
        <div className="mt-4 rounded-lg border border-neutral-200 bg-white px-3 py-2">
          <p className="text-xs font-medium text-neutral-700">Sample pairs</p>
          <div className="mt-1 flex flex-wrap gap-2 text-xs font-mono text-neutral-600">
            {pairs.map(([a, b], i) => (
              <span key={i} className="rounded bg-neutral-100 px-1.5 py-0.5">
                ({a}, {b})
              </span>
            ))}
          </div>
        </div>
      ) : null}
      <p className="mt-4 text-sm text-neutral-500">
        Rows loaded: {rows ? rows.length : "—"}
      </p>
      <div className="mt-6 max-h-96 overflow-auto rounded-lg border border-neutral-200 bg-white text-xs font-mono">
        {rows?.slice(0, 12).map((r) => (
          <div key={r.id} className="border-b border-neutral-100 px-2 py-1">
            <span className="text-neutral-900">{r.id}: </span>
            {r.pairs.map(([a, b], i) => (
              <span key={i} className="inline-block mr-2">
                <span className="text-neutral-400">({a},{b})→</span>
                <span className="text-neutral-800">{r.values[i].toFixed(2)}</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
