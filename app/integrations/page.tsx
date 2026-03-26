"use client";

import { useState } from "react";

export default function IntegrationsPage() {
  const [brokerStatus, setBrokerStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function connectBroker() {
    setLoading(true);
    try {
      const res = await fetch("/api/integrations/sync", { method: "POST" });
      const data = await res.json();
      setBrokerStatus(data.status ?? "pending");
    } catch {
      setBrokerStatus("error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="text-2xl font-semibold text-neutral-900">Integrations</h1>
      <p className="mt-2 text-sm text-neutral-600">Connect brokerage and data feeds.</p>
      <ul className="mt-6 space-y-3 text-sm">
        <li className="flex items-center justify-between rounded-lg border border-neutral-200 px-4 py-3">
          <span>Broker sync</span>
          {brokerStatus ? (
            <span className="text-emerald-600 capitalize">{brokerStatus}</span>
          ) : (
            <button
              type="button"
              disabled={loading}
              onClick={connectBroker}
              className="rounded-lg border border-neutral-300 bg-white px-3 py-1.5 text-sm font-medium hover:bg-neutral-50 disabled:opacity-50"
            >
              {loading ? "Connecting…" : "Connect"}
            </button>
          )}
        </li>
        <li className="flex justify-between rounded-lg border border-neutral-200 px-4 py-3">
          <span>News wire</span>
          <span className="text-neutral-400">Not connected</span>
        </li>
      </ul>
    </div>
  );
}
