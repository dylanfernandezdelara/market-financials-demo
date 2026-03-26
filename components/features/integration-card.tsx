"use client";

import { useState } from "react";

type PermissionScope = {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
};

type Integration = {
  id: string;
  name: string;
  description: string;
  connected: boolean;
  connectedAt: string | null;
  scopes: PermissionScope[];
};

export function IntegrationCard({ integration }: { integration: Integration }) {
  const [connected, setConnected] = useState(integration.connected);
  const [scopes, setScopes] = useState(integration.scopes);
  const [revokeConfirm, setRevokeConfirm] = useState(false);

  function toggleScope(scopeId: string) {
    setScopes((prev) =>
      prev.map((s) => (s.id === scopeId ? { ...s, enabled: !s.enabled } : s)),
    );
  }

  function handleRevoke() {
    setConnected(false);
    setRevokeConfirm(false);
    setScopes((prev) => prev.map((s) => ({ ...s, enabled: false })));
  }

  return (
    <div className="rounded-lg border border-neutral-200 bg-white">
      <div className="flex items-center justify-between px-4 py-3">
        <div>
          <p className="text-sm font-medium text-neutral-900">
            {integration.name}
          </p>
          <p className="text-xs text-neutral-500">{integration.description}</p>
        </div>
        {connected ? (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
            <span className="size-1.5 rounded-full bg-emerald-500" />
            Connected
          </span>
        ) : (
          <button
            type="button"
            className="rounded-lg bg-neutral-900 px-3 py-1.5 text-xs font-medium text-white"
            onClick={() => setConnected(true)}
          >
            Connect
          </button>
        )}
      </div>

      {connected && (
        <>
          <div className="border-t border-neutral-100 px-4 py-3">
            <p className="text-xs font-medium uppercase tracking-wide text-neutral-400">
              Permission scopes
            </p>
            <ul className="mt-2 space-y-2">
              {scopes.map((scope) => (
                <li key={scope.id} className="flex items-start gap-3">
                  <button
                    type="button"
                    role="switch"
                    aria-checked={scope.enabled}
                    className={`relative mt-0.5 inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full transition-colors ${
                      scope.enabled ? "bg-emerald-500" : "bg-neutral-200"
                    }`}
                    onClick={() => toggleScope(scope.id)}
                  >
                    <span
                      className={`pointer-events-none inline-block size-4 translate-y-0.5 rounded-full bg-white shadow ring-0 transition-transform ${
                        scope.enabled ? "translate-x-4" : "translate-x-0.5"
                      }`}
                    />
                  </button>
                  <div className="min-w-0">
                    <p className="text-sm text-neutral-900">{scope.label}</p>
                    <p className="text-xs text-neutral-500">
                      {scope.description}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="border-t border-neutral-100 px-4 py-3">
            {integration.connectedAt && (
              <p className="mb-2 text-xs text-neutral-400">
                Connected {integration.connectedAt}
              </p>
            )}
            {revokeConfirm ? (
              <div className="flex items-center gap-2">
                <span className="text-xs text-neutral-600">
                  Revoke access?
                </span>
                <button
                  type="button"
                  className="rounded-lg bg-red-600 px-3 py-1 text-xs font-medium text-white"
                  onClick={handleRevoke}
                >
                  Confirm
                </button>
                <button
                  type="button"
                  className="rounded-lg border border-neutral-200 px-3 py-1 text-xs font-medium text-neutral-700"
                  onClick={() => setRevokeConfirm(false)}
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                type="button"
                className="text-xs font-medium text-red-600 hover:text-red-700"
                onClick={() => setRevokeConfirm(true)}
              >
                Revoke access
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
