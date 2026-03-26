"use client";

import { useEffect, useState } from "react";

type Row = { id: string; values: number[] };

const PAGE_SIZE = 20;

/** Map a metric id like "rollingMetric042" to its source slice file. */
function sliceForMetric(id: string): string | null {
  const m = id.match(/(\d+)$/);
  if (!m) return null;
  const num = parseInt(m[1], 10);
  const idx = Math.ceil(num / 30);
  return `slice-${String(idx).padStart(2, "0")}`;
}

/** Validate the API response contains a rows array of the expected shape. */
function validateResponse(data: unknown): Row[] {
  if (
    typeof data !== "object" ||
    data === null ||
    !Array.isArray((data as Record<string, unknown>).rows)
  ) {
    throw new Error("Invalid response: missing rows array");
  }
  const rows = (data as Record<string, unknown>).rows as unknown[];
  for (const r of rows) {
    if (
      typeof r !== "object" ||
      r === null ||
      typeof (r as Record<string, unknown>).id !== "string" ||
      !Array.isArray((r as Record<string, unknown>).values)
    ) {
      throw new Error("Invalid response: malformed row entry");
    }
  }
  return rows as Row[];
}

export default function InsightsExplorerPage() {
  const [rows, setRows] = useState<Row[] | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [fetchKey, setFetchKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/insights")
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((j: unknown) => {
        if (!cancelled) {
          setRows(validateResponse(j));
          setPage(0);
          setErr(null);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setRows(null);
          setErr("Unable to load");
        }
      });
    return () => { cancelled = true; };
  }, [fetchKey]);

  const totalPages = rows ? Math.ceil(rows.length / PAGE_SIZE) : 0;
  const pageRows = rows ? rows.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE) : [];

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <h1 className="text-2xl font-semibold text-neutral-900">Insight explorer</h1>
      <p className="mt-2 text-sm text-neutral-600">Batch metric outputs for validation.</p>
      {err ? (
        <div className="mt-4 flex items-center gap-3">
          <p className="text-sm text-red-600">{err}</p>
          <button
            onClick={() => setFetchKey((k) => k + 1)}
            className="rounded bg-neutral-800 px-3 py-1 text-xs text-white hover:bg-neutral-700"
          >
            Retry
          </button>
        </div>
      ) : null}
      <p className="mt-4 text-sm text-neutral-500">
        Rows loaded: {rows ? rows.length : "—"}
      </p>
      <div className="mt-6 max-h-96 overflow-auto rounded-lg border border-neutral-200 bg-white text-xs font-mono">
        {pageRows.map((r) => {
          const slice = sliceForMetric(r.id);
          return (
            <div key={r.id} className="flex items-center gap-2 border-b border-neutral-100 px-2 py-1">
              <span className="flex-1">
                {r.id}: {r.values.map((v) => v.toFixed(2)).join(", ")}
              </span>
              {slice ? (
                <span className="shrink-0 rounded bg-neutral-100 px-1.5 py-0.5 text-[10px] text-neutral-500">
                  {slice}
                </span>
              ) : null}
            </div>
          );
        })}
      </div>
      {totalPages > 1 ? (
        <div className="mt-3 flex items-center gap-2 text-xs text-neutral-600">
          <button
            disabled={page === 0}
            onClick={() => setPage((p) => p - 1)}
            className="rounded border border-neutral-300 px-2 py-0.5 disabled:opacity-40"
          >
            Prev
          </button>
          <span>
            Page {page + 1} of {totalPages}
          </span>
          <button
            disabled={page >= totalPages - 1}
            onClick={() => setPage((p) => p + 1)}
            className="rounded border border-neutral-300 px-2 py-0.5 disabled:opacity-40"
          >
            Next
          </button>
        </div>
      ) : null}
    </div>
  );
}
