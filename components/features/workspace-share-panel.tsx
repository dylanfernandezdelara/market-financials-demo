"use client";

import { useState } from "react";
import { Link2, Share2, Users } from "lucide-react";

type Permission = "view" | "edit";

type Collaborator = {
  email: string;
  permission: Permission;
};

type WorkspaceSharePanelProps = {
  resourceType: "watchlist" | "notes" | "report";
};

const MOCK_COLLABORATORS: Collaborator[] = [
  { email: "alice@example.com", permission: "edit" },
  { email: "bob@example.com", permission: "view" },
];

export function WorkspaceSharePanel({ resourceType }: WorkspaceSharePanelProps) {
  const [open, setOpen] = useState(false);
  const [collaborators] = useState<Collaborator[]>(MOCK_COLLABORATORS);
  const [inviteEmail, setInviteEmail] = useState("");
  const [invitePermission, setInvitePermission] = useState<Permission>("view");
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleInvite = () => {
    if (!inviteEmail.trim()) return;
    setInviteEmail("");
    setInvitePermission("view");
  };

  return (
    <div>
      <button
        type="button"
        className="inline-flex items-center gap-2 rounded-lg border border-neutral-200 px-3 py-1.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
        onClick={() => setOpen(!open)}
      >
        <Share2 className="size-4" />
        Share {resourceType}
      </button>

      {open ? (
        <div className="mt-3 rounded-xl border border-neutral-200 bg-white p-5 shadow-lg">
          <h3 className="text-sm font-semibold text-neutral-900">
            Share this {resourceType}
          </h3>
          <p className="mt-1 text-xs text-neutral-500">
            Invite teammates to collaborate on this workspace.
          </p>

          <div className="mt-4 flex gap-2">
            <input
              type="email"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              placeholder="Email address"
              className="flex-1 rounded-lg border border-neutral-200 px-3 py-1.5 text-sm"
            />
            <select
              value={invitePermission}
              onChange={(e) => setInvitePermission(e.target.value as Permission)}
              className="rounded-lg border border-neutral-200 px-2 py-1.5 text-sm text-neutral-700"
            >
              <option value="view">Can view</option>
              <option value="edit">Can edit</option>
            </select>
            <button
              type="button"
              onClick={handleInvite}
              className="rounded-lg bg-neutral-900 px-3 py-1.5 text-sm font-medium text-white"
            >
              Invite
            </button>
          </div>

          <div className="mt-4 space-y-2">
            <div className="flex items-center gap-2 text-xs font-medium text-neutral-500">
              <Users className="size-3.5" />
              Collaborators
            </div>
            <ul className="space-y-1">
              {collaborators.map((c) => (
                <li
                  key={c.email}
                  className="flex items-center justify-between rounded-lg border border-neutral-100 px-3 py-2 text-sm"
                >
                  <span className="text-neutral-700">{c.email}</span>
                  <span className="text-xs text-neutral-400">
                    {c.permission === "edit" ? "Can edit" : "Can view"}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <button
            type="button"
            onClick={handleCopyLink}
            className="mt-4 inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-neutral-700"
          >
            <Link2 className="size-4" />
            {copied ? "Link copied!" : "Copy share link"}
          </button>
        </div>
      ) : null}
    </div>
  );
}
