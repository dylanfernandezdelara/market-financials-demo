"use client";

import { useState, useCallback, useRef } from "react";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface SyncResult {
  provider: string;
  status: "completed" | "failed";
  startedAt: string;
  completedAt: string | null;
  lastSuccess: string | null;
  retryCount: number;
  error: string | null;
}

interface ActivityEntry {
  id: number;
  provider: string;
  status: "completed" | "failed";
  timestamp: string;
  error: string | null;
}

type ProviderKey = "broker" | "news-wire";

interface ProviderState {
  connected: boolean;
  syncStatus: "idle" | "syncing" | "completed" | "failed";
  lastSuccess: string | null;
  retryCount: number;
  error: string | null;
}

interface CredentialForm {
  apiKey: string;
  apiSecret: string;
}

interface ProviderSettings {
  autoSync: boolean;
  syncInterval: string;
}

/* ------------------------------------------------------------------ */
/*  Defaults                                                           */
/* ------------------------------------------------------------------ */

const defaultProviderState = (): ProviderState => ({
  connected: false,
  syncStatus: "idle",
  lastSuccess: null,
  retryCount: 0,
  error: null,
});

const defaultCredentials = (): CredentialForm => ({
  apiKey: "",
  apiSecret: "",
});

const defaultSettings = (): ProviderSettings => ({
  autoSync: false,
  syncInterval: "15",
});

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function IntegrationsPage() {
  // FDL-761: Persist connected/disconnected state
  const [providers, setProviders] = useState<Record<ProviderKey, ProviderState>>({
    broker: defaultProviderState(),
    "news-wire": defaultProviderState(),
  });

  // FDL-762: Credential / OAuth placeholder forms per provider
  const [credentials, setCredentials] = useState<Record<ProviderKey, CredentialForm>>({
    broker: defaultCredentials(),
    "news-wire": defaultCredentials(),
  });

  // FDL-764: Provider-specific settings panels
  const [settings, setSettings] = useState<Record<ProviderKey, ProviderSettings>>({
    broker: defaultSettings(),
    "news-wire": defaultSettings(),
  });

  // FDL-763: Sync history / activity log
  const [activityLog, setActivityLog] = useState<ActivityEntry[]>([]);
  const nextIdRef = useRef(1);

  // UI panel toggles
  const [expandedProvider, setExpandedProvider] = useState<ProviderKey | null>(null);

  /* ---- helpers --------------------------------------------------- */

  const pushActivity = useCallback(
    (provider: string, status: "completed" | "failed", error: string | null) => {
      const id = nextIdRef.current++;
      setActivityLog((log) => [
        { id, provider, status, timestamp: new Date().toISOString(), error },
        ...log,
      ]);
    },
    [],
  );

  // FDL-755 & FDL-761: Connect / disconnect action
  const toggleConnection = useCallback((key: ProviderKey) => {
    setProviders((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        connected: !prev[key].connected,
        syncStatus: !prev[key].connected ? prev[key].syncStatus : "idle",
        error: !prev[key].connected ? prev[key].error : null,
      },
    }));
  }, []);

  // FDL-757 & FDL-760: Manual sync trigger with retry support
  const triggerSync = useCallback(
    async (key: ProviderKey, retry = false) => {
      setProviders((prev) => ({
        ...prev,
        [key]: { ...prev[key], syncStatus: "syncing", error: null },
      }));

      try {
        const res = await fetch("/api/integrations/sync", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ provider: key, retry }),
        });

        const data: SyncResult = await res.json();

        setProviders((prev) => {
          if (!prev[key].connected) return prev;
          return {
            ...prev,
            [key]: {
              ...prev[key],
              syncStatus: data.status,
              lastSuccess: data.lastSuccess,
              retryCount: data.retryCount,
              error: data.error,
            },
          };
        });

        pushActivity(key, data.status, data.error);
      } catch {
        setProviders((prev) => {
          if (!prev[key].connected) return prev;
          return {
            ...prev,
            [key]: {
              ...prev[key],
              syncStatus: "failed",
              error: "Network error",
              retryCount: prev[key].retryCount + 1,
            },
          };
        });
        pushActivity(key, "failed", "Network error");
      }
    },
    [pushActivity],
  );

  /* ---- render helpers -------------------------------------------- */

  const providerLabel: Record<ProviderKey, string> = {
    broker: "Broker sync",
    "news-wire": "News wire",
  };

  const statusBadge = (s: ProviderState) => {
    if (!s.connected) return <span className="text-neutral-400">Not connected</span>;
    switch (s.syncStatus) {
      case "syncing":
        return <span className="text-amber-600">Syncing…</span>;
      case "completed":
        return <span className="text-emerald-600">Synced</span>;
      case "failed":
        return <span className="text-red-600">Failed</span>;
      default:
        return <span className="text-sky-600">Connected</span>;
    }
  };

  const formatTs = (iso: string | null) =>
    iso ? new Date(iso).toLocaleString() : "—";

  /* ---- render ---------------------------------------------------- */

  const providerKeys: ProviderKey[] = ["broker", "news-wire"];

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="text-2xl font-semibold text-neutral-900">Integrations</h1>
      <p className="mt-2 text-sm text-neutral-600">Connect brokerage and data feeds.</p>

      {/* ---- Provider list ---------------------------------------- */}
      <ul className="mt-6 space-y-3 text-sm" data-testid="integrations-list">
        {providerKeys.map((key) => {
          const state = providers[key];
          const isExpanded = expandedProvider === key;

          return (
            <li
              key={key}
              className="rounded-lg border border-neutral-200"
              data-testid={`provider-${key}`}
            >
              {/* Header row */}
              <div className="flex items-center justify-between px-4 py-3">
                <button
                  type="button"
                  className="font-medium text-neutral-900 hover:underline"
                  onClick={() => setExpandedProvider(isExpanded ? null : key)}
                  data-testid={`toggle-${key}`}
                >
                  {providerLabel[key]}
                </button>

                <div className="flex items-center gap-3">
                  {/* FDL-756: Sync status badge */}
                  {statusBadge(state)}

                  {/* FDL-755 / FDL-761: Connect / disconnect */}
                  <button
                    type="button"
                    className={
                      state.connected
                        ? "rounded-lg border border-neutral-300 px-3 py-1 text-xs text-neutral-600"
                        : "rounded-lg bg-neutral-900 px-3 py-1 text-xs text-white"
                    }
                    onClick={() => toggleConnection(key)}
                    data-testid={`connect-${key}`}
                  >
                    {state.connected ? "Disconnect" : "Connect"}
                  </button>
                </div>
              </div>

              {/* Expanded panel */}
              {isExpanded && (
                <div className="border-t border-neutral-100 px-4 py-4 space-y-4">
                  {/* FDL-760: Error + retry banner */}
                  {state.syncStatus === "failed" && state.error && (
                    <div
                      className="flex items-center justify-between rounded-md bg-red-50 px-3 py-2 text-xs text-red-700"
                      data-testid={`error-${key}`}
                    >
                      <span>
                        {state.error}
                        {state.retryCount > 0 && ` (retries: ${state.retryCount})`}
                      </span>
                      <button
                        type="button"
                        className="ml-3 rounded bg-red-600 px-2 py-0.5 text-white"
                        onClick={() => triggerSync(key, true)}
                        data-testid={`retry-${key}`}
                      >
                        Retry
                      </button>
                    </div>
                  )}

                  {/* FDL-757: Manual sync trigger */}
                  {state.connected && (
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        className="rounded-lg bg-neutral-900 px-3 py-1 text-xs text-white disabled:opacity-50"
                        disabled={state.syncStatus === "syncing"}
                        onClick={() => triggerSync(key)}
                        data-testid={`sync-${key}`}
                      >
                        {state.syncStatus === "syncing" ? "Syncing…" : "Sync now"}
                      </button>
                      {state.lastSuccess && (
                        <span className="text-xs text-neutral-500">
                          Last success: {formatTs(state.lastSuccess)}
                        </span>
                      )}
                    </div>
                  )}

                  {/* FDL-762: Credential / OAuth placeholder form */}
                  <details className="text-xs" data-testid={`credentials-${key}`}>
                    <summary className="cursor-pointer font-medium text-neutral-700">
                      Credentials
                    </summary>
                    <div className="mt-2 space-y-2">
                      <label className="block">
                        API Key
                        <input
                          type="text"
                          value={credentials[key].apiKey}
                          onChange={(e) =>
                            setCredentials((prev) => ({
                              ...prev,
                              [key]: { ...prev[key], apiKey: e.target.value },
                            }))
                          }
                          className="mt-1 w-full rounded-md border border-neutral-200 px-2 py-1"
                          placeholder="Enter API key"
                          data-testid={`apikey-${key}`}
                        />
                      </label>
                      <label className="block">
                        API Secret
                        <input
                          type="password"
                          value={credentials[key].apiSecret}
                          onChange={(e) =>
                            setCredentials((prev) => ({
                              ...prev,
                              [key]: { ...prev[key], apiSecret: e.target.value },
                            }))
                          }
                          className="mt-1 w-full rounded-md border border-neutral-200 px-2 py-1"
                          placeholder="Enter API secret"
                          data-testid={`apisecret-${key}`}
                        />
                      </label>
                    </div>
                  </details>

                  {/* FDL-764: Provider-specific settings panel */}
                  <details className="text-xs" data-testid={`settings-${key}`}>
                    <summary className="cursor-pointer font-medium text-neutral-700">
                      Settings
                    </summary>
                    <div className="mt-2 space-y-2">
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={settings[key].autoSync}
                          onChange={(e) =>
                            setSettings((prev) => ({
                              ...prev,
                              [key]: { ...prev[key], autoSync: e.target.checked },
                            }))
                          }
                          data-testid={`autosync-${key}`}
                        />
                        Auto-sync enabled
                      </label>
                      <label className="block">
                        Sync interval (minutes)
                        <input
                          type="number"
                          min="1"
                          value={settings[key].syncInterval}
                          onChange={(e) =>
                            setSettings((prev) => ({
                              ...prev,
                              [key]: { ...prev[key], syncInterval: e.target.value },
                            }))
                          }
                          className="mt-1 w-20 rounded-md border border-neutral-200 px-2 py-1"
                          data-testid={`interval-${key}`}
                        />
                      </label>
                    </div>
                  </details>
                </div>
              )}
            </li>
          );
        })}
      </ul>

      {/* FDL-763: Sync history / activity log */}
      <section className="mt-10" data-testid="activity-log">
        <h2 className="text-lg font-semibold text-neutral-900">Sync activity</h2>
        {activityLog.length === 0 ? (
          <p className="mt-2 text-sm text-neutral-500">No sync activity yet.</p>
        ) : (
          <ul className="mt-3 space-y-2 text-xs">
            {activityLog.map((entry) => (
              <li
                key={entry.id}
                className="flex items-center justify-between rounded-md border border-neutral-100 px-3 py-2"
              >
                <span className="font-medium text-neutral-800">
                  {providerLabel[entry.provider as ProviderKey] ?? entry.provider}
                </span>
                <span
                  className={
                    entry.status === "completed" ? "text-emerald-600" : "text-red-600"
                  }
                >
                  {entry.status}
                </span>
                <span className="text-neutral-400">{formatTs(entry.timestamp)}</span>
                {entry.error && (
                  <span className="text-red-500">{entry.error}</span>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
