"use client";

import { useRef } from "react";

export function ImportCsvPanel() {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-4">
      <p className="text-sm font-medium text-neutral-900">Import positions</p>
      <input ref={inputRef} type="file" accept=".csv" className="mt-2 text-sm" />
      <button
        type="button"
        className="mt-3 rounded-lg bg-neutral-900 px-3 py-1.5 text-sm text-white"
        onClick={() => inputRef.current?.click()}
      >
        Choose file
      </button>
    </div>
  );
}
