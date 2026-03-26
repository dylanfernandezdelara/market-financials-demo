import Link from "next/link";
import { Eye } from "lucide-react";
import { buildWatchlist } from "@/lib/market-data";

export default async function WatchlistManagePage() {
  const watchlist = await buildWatchlist();

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="text-2xl font-semibold text-neutral-900">Manage watchlists</h1>
      <p className="mt-2 text-sm text-neutral-600">Create lists and reorder symbols.</p>
      {watchlist.length === 0 ? (
        <div className="mt-8 flex flex-col items-center justify-center rounded-lg border border-dashed border-neutral-300 bg-neutral-50 px-6 py-12 text-center">
          <Eye className="mb-3 size-8 text-neutral-400" />
          <p className="text-sm font-medium text-neutral-700">No watchlists yet</p>
          <p className="mt-1 max-w-xs text-xs text-neutral-500">
            Head to the dashboard and add symbols to start building your first watchlist.
          </p>
          <Link href="/" className="mt-4 text-sm font-medium text-blue-600 underline">
            Go to dashboard
          </Link>
        </div>
      ) : (
        <>
          <div className="mt-6 text-sm text-neutral-500">
            Primary list · {watchlist.length} symbol{watchlist.length === 1 ? "" : "s"}
          </div>
          <Link href="/" className="mt-6 inline-block text-sm underline">
            Edit on dashboard
          </Link>
        </>
      )}
    </div>
  );
}
