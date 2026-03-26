import Link from "next/link";

export default function TeamPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-10">
      <h1 className="text-2xl font-semibold text-neutral-900">Team</h1>
      <p className="mt-2 text-sm text-neutral-600">Invite collaborators to shared workspaces.</p>
      <button
        type="button"
        className="mt-6 rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white"
      >
        Invite member
      </button>
      <div className="mt-8 border-t border-neutral-200 pt-6">
        <Link
          href="/team/annotations"
          className="text-sm font-medium text-neutral-900 underline"
        >
          View team annotations
        </Link>
        <p className="mt-1 text-xs text-neutral-500">
          Shared comments and notes tied to stocks, portfolios, watchlists, and sectors.
        </p>
      </div>
    </div>
  );
}
