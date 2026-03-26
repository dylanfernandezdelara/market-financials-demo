"use client";

import { useState } from "react";

type SyncStatus = "idle" | "syncing" | "pending" | "error";

export function BrokerSyncCard() {
  const [status, setStatus] = useState<SyncStatus>("idle");
  const [lastSync, setLastSync] = useState<string | null>(null);

  async function handleSync() {
    setStatus("syncing");
    try {
      const res = await fetch("/api/integrations/sync", { method: "POST" });
      if (!res.ok) throw new Error("Sync request failed");
      const data = await res.json();
      setStatus(data.status === "pending" ? "pending" : "idle");
      setLastSync(new Date().toLocaleString());
    } catch {
      setStatus("error");
    }
  }

  return (
    <li className="flex items-center justify-between rounded-lg border border-neutral-200 px-4 py-3">
      <div className="text-sm">
        <span className="font-medium text-neutral-900">Broker sync</span>
        {lastSync ? (
          <p className="mt-0.5 text-xs text-neutral-500">Last sync: {lastSync}</p>
        ) : null}
      </div>
      <div className="flex items-center gap-3">
        {status === "error" ? (
          <span className="text-xs text-red-500">Sync failed</span>
        ) : status === "pending" ? (
          <span className="text-xs text-amber-600">Sync pending</span>
        ) : null}
        <button
          type="button"
          disabled={status === "syncing"}
          onClick={handleSync}
          className="rounded-lg bg-neutral-900 px-3 py-1.5 text-sm text-white disabled:opacity-50"
        >
          {status === "syncing" ? "Syncing\u2026" : "Connect"}
        </button>
      </div>
    </li>
  );
}
