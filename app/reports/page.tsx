"use client";

import { useState } from "react";

type ReportStatus = "idle" | "loading" | "success" | "error";

export default function ReportsPage() {
  const [status, setStatus] = useState<ReportStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleGenerate() {
    setStatus("loading");
    setErrorMessage(null);

    try {
      const res = await fetch("/api/reports");
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error ?? `Report generation failed (${res.status})`);
      }
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setErrorMessage(
        err instanceof Error ? err.message : "An unexpected error occurred while generating the report.",
      );
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="text-2xl font-semibold text-neutral-900">Reports</h1>
      <p className="mt-2 text-sm text-neutral-600">Monthly performance and tax lots.</p>

      <button
        type="button"
        disabled={status === "loading"}
        className="mt-6 rounded-lg border border-neutral-300 bg-white px-4 py-2 text-sm font-medium disabled:opacity-50"
        onClick={handleGenerate}
      >
        {status === "loading" ? "Generating\u2026" : "Generate report"}
      </button>

      {status === "success" && (
        <p className="mt-4 text-sm text-emerald-600">Report generated successfully.</p>
      )}

      {status === "error" && (
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
          <p className="text-sm font-medium text-red-800">Report generation failed</p>
          {errorMessage && <p className="mt-1 text-sm text-red-600">{errorMessage}</p>}
          <button
            type="button"
            className="mt-2 text-sm font-medium text-red-700 underline"
            onClick={handleGenerate}
          >
            Retry
          </button>
        </div>
      )}
    </div>
  );
}
