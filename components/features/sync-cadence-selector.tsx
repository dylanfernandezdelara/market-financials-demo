"use client";

import { useState } from "react";
import type { SyncCadence } from "@/types/finance";

const CADENCE_OPTIONS: { value: SyncCadence; label: string }[] = [
  { value: "15m", label: "Every 15 minutes" },
  { value: "1h", label: "Every hour" },
  { value: "4h", label: "Every 4 hours" },
  { value: "1d", label: "Daily" },
  { value: "manual", label: "Manual only" },
];

export function SyncCadenceSelector() {
  const [cadence, setCadence] = useState<SyncCadence>("1h");
  const [enabled, setEnabled] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleSave() {
    setSaving(true);
    setSaved(false);
    try {
      const res = await fetch("/api/integrations/cadence", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cadence, enabled }),
      });
      if (!res.ok) throw new Error("Save failed");
      setSaved(true);
    } catch {
      // save failed silently — could surface to user in future
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mt-6 rounded-lg border border-neutral-200 p-4">
      <p className="text-sm font-medium text-neutral-900">Scheduled sync cadence</p>
      <p className="mt-1 text-xs text-neutral-500">
        Choose how often connected integrations automatically sync data.
      </p>

      <div className="mt-4 flex items-center gap-3">
        <label className="flex items-center gap-2 text-sm text-neutral-700">
          <input
            type="checkbox"
            checked={enabled}
            onChange={(e) => {
              setEnabled(e.target.checked);
              setSaved(false);
            }}
            className="size-4 rounded border-neutral-300"
          />
          Enable scheduled sync
        </label>
      </div>

      <div className="mt-3">
        <label className="block text-xs font-medium text-neutral-600">
          Frequency
          <select
            value={cadence}
            onChange={(e) => {
              setCadence(e.target.value as SyncCadence);
              setSaved(false);
            }}
            disabled={!enabled}
            className="mt-1 block w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm disabled:opacity-50"
          >
            {CADENCE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <button
        type="button"
        onClick={handleSave}
        disabled={saving}
        className="mt-4 rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
      >
        {saving ? "Saving…" : "Save cadence"}
      </button>
      {saved ? <span className="ml-3 text-xs text-emerald-600">Saved</span> : null}
    </div>
  );
}
