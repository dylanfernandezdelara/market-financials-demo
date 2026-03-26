import Link from "next/link";
import { WorkspaceSharePanel } from "@/components/features/workspace-share-panel";

export default function WatchlistManagePage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900">Manage watchlists</h1>
          <p className="mt-2 text-sm text-neutral-600">Create lists and reorder symbols.</p>
        </div>
        <WorkspaceSharePanel resourceType="watchlist" />
      </div>
      <div className="mt-6 text-sm text-neutral-500">Primary list · 6 symbols</div>
      <Link href="/" className="mt-6 inline-block text-sm underline">
        Edit on dashboard
      </Link>
    </div>
  );
}
