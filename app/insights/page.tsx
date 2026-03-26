"use client";

import { useCallback, useEffect, useState } from "react";

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

  const handleExportCsv = useCallback(() => {
    const link = document.createElement("a");
    link.href = "/api/export?type=insights";
    link.download = "insights.csv";
    link.click();
  }, []);

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900">Insight explorer</h1>
          <p className="mt-2 text-sm text-neutral-600">Batch metric outputs for validation.</p>
        </div>
        <button
          type="button"
          disabled={!rows || rows.length === 0}
          className="rounded-lg border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-50"
          onClick={handleExportCsv}
        >
          Export CSV
        </button>
      </div>
      {err ? <p className="mt-4 text-sm text-red-600">{err}</p> : null}
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
    </div>
  );
}
