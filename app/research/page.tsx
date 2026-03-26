"use client";

import { useEffect, useState } from "react";

type ResearchSummary = {
  symbol: string;
  bullets: string[];
  asOf: string;
};

export default function ResearchHubPage() {
  const [summary, setSummary] = useState<ResearchSummary | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/research/summary")
      .then((r) => {
        if (!r.ok) throw new Error(r.statusText);
        return r.json();
      })
      .then((j) => setSummary(j as ResearchSummary))
      .catch(() => setErr("Unable to load research summary"));
  }, []);

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <h1 className="text-2xl font-semibold text-neutral-900">Research hub</h1>
      <p className="mt-2 text-sm text-neutral-600">
        Filings, transcripts, and third-party notes in one stream.
      </p>
      {err ? <p className="mt-4 text-sm text-red-600">{err}</p> : null}
      {summary ? (
        <div className="mt-8 rounded-xl border border-neutral-200 bg-white p-6">
          <div className="flex items-baseline justify-between">
            <h2 className="text-lg font-semibold text-neutral-900">
              {summary.symbol || "Market"} Summary
            </h2>
            <span className="text-xs text-neutral-500">
              {new Date(summary.asOf).toLocaleString()}
            </span>
          </div>
          {summary.bullets.length > 0 ? (
            <ul className="mt-4 list-disc space-y-1 pl-5 text-sm text-neutral-700">
              {summary.bullets.map((bullet, i) => (
                <li key={i}>{bullet}</li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-sm text-neutral-500">
              No research bullets available yet.
            </p>
          )}
        </div>
      ) : !err ? (
        <div className="mt-8 h-48 animate-pulse rounded-xl bg-neutral-100" />
      ) : null}
    </div>
  );
}
