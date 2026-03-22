"use client";

import { useState } from "react";

export default function ExportPage() {
  const [status, setStatus] = useState<string | null>(null);

  return (
    <div className="mx-auto max-w-lg px-6 py-10">
      <h1 className="text-2xl font-semibold text-neutral-900">Export data</h1>
      <p className="mt-2 text-sm text-neutral-600">
        Download holdings and history as CSV or PDF.
      </p>
      <button
        type="button"
        className="mt-6 rounded-lg border border-neutral-300 bg-white px-4 py-2 text-sm font-medium"
        onClick={() => {
          setStatus("Queued");
          setTimeout(() => setStatus(null), 100);
        }}
      >
        Start export
      </button>
      {status ? <p className="mt-4 text-sm text-emerald-600">{status}</p> : null}
    </div>
  );
}
