"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation";

type ImportCsvPanelProps = {
  onImported?: () => void;
};

export function ImportCsvPanel({ onImported }: ImportCsvPanelProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  function handleFileChange() {
    if (!inputRef.current?.files?.length) return;
    // Mock: in a real app this would parse and persist the CSV.
    // After "import", refresh server data so the holdings table updates.
    inputRef.current.value = "";
    router.refresh();
    onImported?.();
  }

  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-4">
      <p className="text-sm font-medium text-neutral-900">Import positions</p>
      <input
        ref={inputRef}
        type="file"
        accept=".csv"
        className="mt-2 text-sm"
        onChange={handleFileChange}
      />
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
