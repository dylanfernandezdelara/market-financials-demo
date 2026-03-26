"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type Format = "csv" | "pdf";

type ExportState =
  | { phase: "idle" }
  | { phase: "queued" }
  | { phase: "polling" }
  | { phase: "ready"; url: string }
  | { phase: "error"; message: string };

export default function ExportPage() {
  const [format, setFormat] = useState<Format>("csv");
  const [state, setState] = useState<ExportState>({ phase: "idle" });
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const mountedRef = useRef(true);

  const clearPoll = useCallback(() => {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      clearPoll();
    };
  }, [clearPoll]);

  const startExport = async () => {
    setState({ phase: "queued" });

    try {
      const res = await fetch(`/api/export?format=${format}`, {
        method: "POST",
      });

      if (!mountedRef.current) return;

      if (res.status === 501) {
        const body = (await res.json()) as { error?: string };
        setState({
          phase: "error",
          message:
            body.error === "unsupported"
              ? `PDF export is not supported yet. Please choose CSV instead.`
              : "Export failed — unsupported format.",
        });
        return;
      }

      if (!res.ok) {
        setState({ phase: "error", message: `Export failed (${res.status}).` });
        return;
      }

      const body = (await res.json()) as { url?: string; ready?: boolean };

      if (body.ready && body.url) {
        setState({ phase: "ready", url: body.url });
        return;
      }

      if (!mountedRef.current) return;
      setState({ phase: "polling" });

      clearPoll();
      pollRef.current = setInterval(async () => {
        try {
          const poll = await fetch(`/api/export?format=${format}`, {
            method: "POST",
          });
          if (!poll.ok) return;
          const data = (await poll.json()) as { url?: string; ready?: boolean };
          if (data.ready && data.url) {
            clearPoll();
            setState({ phase: "ready", url: data.url });
          }
        } catch {
          /* keep polling */
        }
      }, 2000);
    } catch {
      setState({ phase: "error", message: "Network error — please try again." });
    }
  };

  const busy = state.phase === "queued" || state.phase === "polling";

  return (
    <div className="mx-auto max-w-lg px-6 py-10">
      <h1 className="text-2xl font-semibold text-neutral-900">Export data</h1>
      <p className="mt-2 text-sm text-neutral-600">
        Download holdings and history as CSV or PDF.
      </p>

      <fieldset className="mt-6 flex gap-4">
        <legend className="sr-only">Export format</legend>
        {(["csv", "pdf"] as const).map((f) => (
          <label
            key={f}
            className={`cursor-pointer rounded-lg border px-4 py-2 text-sm font-medium transition ${
              format === f
                ? "border-neutral-900 bg-neutral-900 text-white"
                : "border-neutral-300 bg-white text-neutral-700"
            }`}
          >
            <input
              type="radio"
              name="format"
              value={f}
              checked={format === f}
              onChange={() => setFormat(f)}
              className="sr-only"
            />
            {f.toUpperCase()}
          </label>
        ))}
      </fieldset>

      <button
        type="button"
        disabled={busy}
        className="mt-4 rounded-lg border border-neutral-300 bg-white px-4 py-2 text-sm font-medium disabled:opacity-50"
        onClick={startExport}
      >
        {busy ? "Exporting\u2026" : "Start export"}
      </button>

      {state.phase === "queued" && (
        <p className="mt-4 text-sm text-neutral-500">Queued — starting export\u2026</p>
      )}
      {state.phase === "polling" && (
        <p className="mt-4 text-sm text-neutral-500">Processing — waiting for file\u2026</p>
      )}
      {state.phase === "ready" && (
        <p className="mt-4 text-sm text-emerald-600">
          Export ready —{" "}
          <a
            href={state.url}
            download
            className="underline underline-offset-2"
          >
            Download file
          </a>
        </p>
      )}
      {state.phase === "error" && (
        <p className="mt-4 text-sm text-red-600">{state.message}</p>
      )}
    </div>
  );
}
