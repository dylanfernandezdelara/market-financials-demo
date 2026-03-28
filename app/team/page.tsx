"use client";

import { useState } from "react";

type Invite = {
  id: string;
  email: string;
  role: string;
  status: "pending" | "accepted";
};

export default function TeamPage() {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("viewer");
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [invites, setInvites] = useState<Invite[]>([]);

  function validate(value: string): string | null {
    if (!value.trim()) return "Email is required.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()))
      return "Enter a valid email address.";
    if (invites.some((i) => i.email === value.trim()))
      return "This email has already been invited.";
    return null;
  }

  async function handleInvite() {
    const msg = validate(email);
    if (msg) {
      setError(msg);
      return;
    }
    setError(null);
    setSending(true);
    try {
      const res = await fetch("/api/team/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), role }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Failed to send invite.");
        return;
      }
      setInvites((prev) => [
        ...prev,
        {
          id: `${data.inviteId as string}_${Date.now()}`,
          email: email.trim(),
          role,
          status: "pending",
        },
      ]);
      setEmail("");
      setRole("viewer");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSending(false);
    }
  }

  async function handleResend(invite: Invite) {
    try {
      await fetch("/api/team/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: invite.email, role: invite.role }),
      });
    } catch {
      /* best-effort */
    }
  }

  function handleRevoke(id: string) {
    setInvites((prev) => prev.filter((i) => i.id !== id));
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-10">
      <h1 className="text-2xl font-semibold text-neutral-900">Team</h1>
      <p className="mt-2 text-sm text-neutral-600">
        Invite collaborators to shared workspaces.
      </p>

      {/* Invite form */}
      <div className="mt-6 space-y-3">
        <label className="block text-sm font-medium text-neutral-700">
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (error) setError(null);
            }}
            placeholder="colleague@example.com"
            className="mt-1 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm"
          />
        </label>
        <label className="block text-sm font-medium text-neutral-700">
          Role
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="mt-1 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm"
          >
            <option value="viewer">Viewer</option>
            <option value="editor">Editor</option>
            <option value="admin">Admin</option>
          </select>
        </label>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="button"
          disabled={sending}
          onClick={handleInvite}
          className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
        >
          {sending ? "Sending\u2026" : "Invite member"}
        </button>
      </div>

      {/* Invite list */}
      {invites.length > 0 && (
        <div className="mt-10">
          <h2 className="text-lg font-medium text-neutral-900">Invites</h2>
          <ul className="mt-3 divide-y divide-neutral-100">
            {invites.map((inv) => (
              <li
                key={inv.id}
                className="flex items-center justify-between py-3"
              >
                <div>
                  <p className="text-sm font-medium text-neutral-800">
                    {inv.email}
                  </p>
                  <p className="text-xs text-neutral-500">
                    {inv.role} &middot;{" "}
                    <span
                      className={
                        inv.status === "accepted"
                          ? "text-emerald-600"
                          : "text-amber-600"
                      }
                    >
                      {inv.status}
                    </span>
                  </p>
                </div>
                <div className="flex gap-2">
                  {inv.status === "pending" && (
                    <>
                      <button
                        type="button"
                        onClick={() => handleResend(inv)}
                        className="rounded border border-neutral-200 px-2 py-1 text-xs font-medium text-neutral-700"
                      >
                        Resend
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRevoke(inv.id)}
                        className="rounded border border-red-200 px-2 py-1 text-xs font-medium text-red-600"
                      >
                        Revoke
                      </button>
                    </>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
