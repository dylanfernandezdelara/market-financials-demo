"use client";

import { useCallback, useState } from "react";

export default function ResearchHubPage() {
  const [symbolInput, setSymbolInput] = useState("");

  const handleExportCsv = useCallback(() => {
    const params = new URLSearchParams({ type: "research" });
    if (symbolInput.trim()) {
      params.set("symbol", symbolInput.trim());
    }
    const link = document.createElement("a");
    link.href = `/api/export?${params.toString()}`;
    link.download = `research-${symbolInput.trim().toUpperCase() || "all"}.csv`;
    link.click();
  }, [symbolInput]);

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900">Research hub</h1>
          <p className="mt-2 text-sm text-neutral-600">
            Filings, transcripts, and third-party notes in one stream.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={symbolInput}
            onChange={(e) => setSymbolInput(e.target.value)}
            placeholder="Symbol (optional)"
            className="w-32 rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-700 placeholder:text-neutral-400"
          />
          <button
            type="button"
            className="rounded-lg border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50"
            onClick={handleExportCsv}
          >
            Export CSV
          </button>
        </div>
      </div>
      <div className="mt-8 h-48 animate-pulse rounded-xl bg-neutral-100" />
    </div>
  );
}
