"use client";

import { useState } from "react";

type ExportStatus = "idle" | "loading" | "success" | "error";

export default function ExportPage() {
  const [status, setStatus] = useState<ExportStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleExport() {
    setStatus("loading");
    setErrorMessage(null);

    try {
      const res = await fetch("/api/export", { method: "POST" });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error ?? `Export failed (${res.status})`);
      }
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setErrorMessage(
        err instanceof Error ? err.message : "An unexpected error occurred while exporting data.",
      );
    }
  }

  return (
    <div className="mx-auto max-w-lg px-6 py-10">
      <h1 className="text-2xl font-semibold text-neutral-900">Export data</h1>
      <p className="mt-2 text-sm text-neutral-600">
        Download holdings and history as CSV or PDF.
      </p>
      <button
        type="button"
        disabled={status === "loading"}
        className="mt-6 rounded-lg border border-neutral-300 bg-white px-4 py-2 text-sm font-medium disabled:opacity-50"
        onClick={handleExport}
      >
        {status === "loading" ? "Exporting\u2026" : "Start export"}
      </button>

      {status === "success" && (
        <p className="mt-4 text-sm text-emerald-600">Export ready for download.</p>
      )}

      {status === "error" && (
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
          <p className="text-sm font-medium text-red-800">Export failed</p>
          {errorMessage && <p className="mt-1 text-sm text-red-600">{errorMessage}</p>}
          <button
            type="button"
            className="mt-2 text-sm font-medium text-red-700 underline"
            onClick={handleExport}
          >
            Retry
          </button>
        </div>
      )}
    </div>
  );
}
