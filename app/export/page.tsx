"use client";

import { useCallback, useState } from "react";

type ExportType = "holdings" | "research" | "insights";

const exportOptions: { value: ExportType; label: string; description: string }[] = [
  { value: "holdings", label: "Holdings & history", description: "Portfolio positions and trade history" },
  { value: "research", label: "Research summaries", description: "Filings, transcripts, and third-party notes" },
  { value: "insights", label: "Insight outputs", description: "Batch metric calculations for validation" },
];

export default function ExportPage() {
  const [selected, setSelected] = useState<ExportType>("holdings");
  const [status, setStatus] = useState<string | null>(null);

  const handleExport = useCallback(() => {
    if (selected === "holdings") {
      setStatus("Queued");
      setTimeout(() => setStatus(null), 100);
      return;
    }

    const link = document.createElement("a");
    link.href = `/api/export?type=${selected}`;
    link.download = selected === "insights" ? "insights.csv" : "research-all.csv";
    link.click();
    setStatus("Downloading…");
    setTimeout(() => setStatus(null), 2000);
  }, [selected]);

  return (
    <div className="mx-auto max-w-lg px-6 py-10">
      <h1 className="text-2xl font-semibold text-neutral-900">Export data</h1>
      <p className="mt-2 text-sm text-neutral-600">
        Download holdings, research, or insight outputs as CSV.
      </p>

      <fieldset className="mt-6 space-y-3">
        <legend className="text-sm font-medium text-neutral-700">Select data to export</legend>
        {exportOptions.map((opt) => (
          <label
            key={opt.value}
            className={`flex cursor-pointer items-start gap-3 rounded-lg border px-4 py-3 transition-colors ${
              selected === opt.value
                ? "border-neutral-900 bg-neutral-50"
                : "border-neutral-200 bg-white hover:bg-neutral-50"
            }`}
          >
            <input
              type="radio"
              name="exportType"
              value={opt.value}
              checked={selected === opt.value}
              onChange={() => setSelected(opt.value)}
              className="mt-0.5"
            />
            <div>
              <span className="text-sm font-medium text-neutral-900">{opt.label}</span>
              <p className="text-xs text-neutral-500">{opt.description}</p>
            </div>
          </label>
        ))}
      </fieldset>

      <button
        type="button"
        className="mt-6 rounded-lg border border-neutral-300 bg-white px-4 py-2 text-sm font-medium transition-colors hover:bg-neutral-50"
        onClick={handleExport}
      >
        Start export
      </button>
      {status ? <p className="mt-4 text-sm text-emerald-600">{status}</p> : null}
    </div>
  );
}
