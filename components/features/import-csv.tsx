"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Download, Upload, AlertCircle, CheckCircle2 } from "lucide-react";

type ImportStatus =
  | { kind: "idle" }
  | { kind: "success"; count: number }
  | { kind: "error"; messages: string[] };

const EXPECTED_HEADERS = ["symbol", "shares", "averagecost"] as const;

const SAMPLE_CSV = [
  "symbol,shares,averageCost",
  "AAPL,10,174.50",
  "MSFT,5,410.00",
  "GOOGL,8,168.25",
].join("\n");

function parseCsv(text: string): { rows: Record<string, string>[]; errors: string[] } {
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length === 0) {
    return { rows: [], errors: ["File is empty"] };
  }

  const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());
  const missing = EXPECTED_HEADERS.filter((h) => !headers.includes(h));

  if (missing.length > 0) {
    return { rows: [], errors: [`Missing required column(s): ${missing.join(", ")}`] };
  }

  const errors: string[] = [];
  const rows: Record<string, string>[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(",").map((v) => v.trim());
    if (values.length !== headers.length) {
      errors.push(`Row ${i}: expected ${headers.length} columns but got ${values.length}`);
      continue;
    }
    const row: Record<string, string> = {};
    headers.forEach((header, idx) => {
      row[header] = values[idx];
    });
    rows.push(row);
  }

  return { rows, errors };
}

function validateRows(
  rows: Record<string, string>[],
): { holdings: { symbol: string; shares: number; averageCost: number }[]; errors: string[] } {
  const errors: string[] = [];
  const holdings: { symbol: string; shares: number; averageCost: number }[] = [];

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const symbol = (row.symbol ?? "").trim().toUpperCase();
    const shares = Number(row.shares);
    const averageCost = Number(row.averagecost);

    if (!symbol) {
      errors.push(`Row ${i + 1}: symbol is empty`);
      continue;
    }
    if (!/^[A-Z]{1,5}$/.test(symbol)) {
      errors.push(`Row ${i + 1}: "${symbol}" is not a valid ticker symbol`);
      continue;
    }
    if (!Number.isFinite(shares) || shares <= 0) {
      errors.push(`Row ${i + 1}: shares must be a positive number`);
      continue;
    }
    if (!Number.isFinite(averageCost) || averageCost <= 0) {
      errors.push(`Row ${i + 1}: averageCost must be a positive number`);
      continue;
    }

    holdings.push({ symbol, shares, averageCost });
  }

  return { holdings, errors };
}

export function ImportCsvPanel() {
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const [status, setStatus] = useState<ImportStatus>({ kind: "idle" });
  const [loading, setLoading] = useState(false);

  function downloadTemplate() {
    const blob = new Blob([SAMPLE_CSV], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "portfolio-import-template.csv";
    anchor.click();
    URL.revokeObjectURL(url);
  }

  async function handleFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setStatus({ kind: "idle" });
    setLoading(true);

    try {
      const text = await file.text();
      const { rows, errors: parseErrors } = parseCsv(text);

      if (parseErrors.length > 0) {
        setStatus({ kind: "error", messages: parseErrors });
        return;
      }

      if (rows.length === 0) {
        setStatus({ kind: "error", messages: ["No data rows found after the header"] });
        return;
      }

      const { holdings, errors: validationErrors } = validateRows(rows);

      if (validationErrors.length > 0) {
        setStatus({ kind: "error", messages: validationErrors });
        return;
      }

      const response = await fetch("/api/portfolio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(holdings),
      });

      if (!response.ok) {
        const data = (await response.json()) as { error?: string; details?: string[] };
        setStatus({
          kind: "error",
          messages: data.details ?? [data.error ?? "Import failed"],
        });
        return;
      }

      const data = (await response.json()) as { imported: number };
      setStatus({ kind: "success", count: data.imported });
      router.refresh();
    } catch {
      setStatus({ kind: "error", messages: ["Failed to read or upload the file"] });
    } finally {
      setLoading(false);
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  }

  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-4">
      <p className="text-sm font-medium text-neutral-900">Import positions</p>
      <p className="mt-1 text-xs text-neutral-500">
        Upload a CSV with columns: <span className="font-mono">symbol</span>,{" "}
        <span className="font-mono">shares</span>,{" "}
        <span className="font-mono">averageCost</span>
      </p>

      <input
        ref={inputRef}
        type="file"
        accept=".csv"
        className="sr-only"
        onChange={handleFile}
      />

      <div className="mt-3 flex items-center gap-2">
        <button
          type="button"
          disabled={loading}
          className="inline-flex items-center gap-1.5 rounded-lg bg-neutral-900 px-3 py-1.5 text-sm text-white disabled:opacity-50"
          onClick={() => inputRef.current?.click()}
        >
          <Upload className="size-3.5" />
          {loading ? "Importing\u2026" : "Choose file"}
        </button>
        <button
          type="button"
          className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-sm text-neutral-700 hover:bg-neutral-50"
          onClick={downloadTemplate}
        >
          <Download className="size-3.5" />
          Download template
        </button>
      </div>

      {status.kind === "success" && (
        <div className="mt-3 flex items-start gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
          <CheckCircle2 className="mt-0.5 size-4 shrink-0" />
          <span>
            Successfully imported {status.count} position{status.count !== 1 ? "s" : ""}.
          </span>
        </div>
      )}

      {status.kind === "error" && (
        <div className="mt-3 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
          <AlertCircle className="mt-0.5 size-4 shrink-0" />
          <div>
            {status.messages.map((msg, idx) => (
              <p key={idx}>{msg}</p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
