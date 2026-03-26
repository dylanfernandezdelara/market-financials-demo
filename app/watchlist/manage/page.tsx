import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { WatchlistManager } from "@/components/watchlist/watchlist-manager";
import { getSearchUniverse } from "@/lib/market-data";
import { buildWatchlistEntries } from "@/lib/market-data";

export default async function WatchlistManagePage() {
  const [searchOptions, watchlistEntries] = await Promise.all([
    getSearchUniverse(),
    buildWatchlistEntries(),
  ]);

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <Link
        href="/"
        className="mb-4 inline-flex items-center gap-1 text-sm text-neutral-500 transition-colors hover:text-neutral-900"
      >
        <ArrowLeft className="size-3.5" />
        Back to dashboard
      </Link>
      <h1 className="text-2xl font-semibold text-neutral-900">Manage watchlist</h1>
      <p className="mt-2 text-sm text-neutral-600">
        Search for symbols and add them to your watchlist.
      </p>
      <div className="mt-8">
        <WatchlistManager searchOptions={searchOptions} initialEntries={watchlistEntries} />
      </div>
    </div>
  );
}
