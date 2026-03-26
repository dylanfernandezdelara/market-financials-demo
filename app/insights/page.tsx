"use client";

import { useCallback, useEffect, useState } from "react";

type Row = { id: string; values: number[] };

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export default function InsightsExplorerPage() {
  const [rows, setRows] = useState<Row[] | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    fetch("/api/insights")
      .then((r) => r.json())
      .then((j) => setRows(j.rows as Row[]))
      .catch(() => setErr("Unable to load"));
  }, []);

  const handleExport = useCallback(async (format: "csv" | "json") => {
    setDownloading(true);
    try {
      const res = await fetch(`/api/insights/export?format=${format}`);
      if (!res.ok) throw new Error("Export failed");
      const blob = await res.blob();
      const ext = format === "json" ? "json" : "csv";
      downloadBlob(blob, `insights.${ext}`);
    } catch {
      setErr("Export failed");
    } finally {
      setDownloading(false);
    }
  }, []);

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <h1 className="text-2xl font-semibold text-neutral-900">Insight explorer</h1>
      <p className="mt-2 text-sm text-neutral-600">Batch metric outputs for validation.</p>
      {err ? <p className="mt-4 text-sm text-red-600">{err}</p> : null}
      <div className="mt-4 flex items-center gap-4">
        <p className="text-sm text-neutral-500">
          Rows loaded: {rows ? rows.length : "—"}
        </p>
        {rows ? (
          <div className="flex gap-2">
            <button
              type="button"
              disabled={downloading}
              className="rounded-lg border border-neutral-300 bg-white px-3 py-1.5 text-xs font-medium text-neutral-700 hover:bg-neutral-50 disabled:opacity-50"
              onClick={() => handleExport("csv")}
            >
              Export CSV
            </button>
            <button
              type="button"
              disabled={downloading}
              className="rounded-lg border border-neutral-300 bg-white px-3 py-1.5 text-xs font-medium text-neutral-700 hover:bg-neutral-50 disabled:opacity-50"
              onClick={() => handleExport("json")}
            >
              Export JSON
            </button>
          </div>
        ) : null}
      </div>
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
