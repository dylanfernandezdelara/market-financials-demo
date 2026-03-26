import { cacheLife } from "next/cache";
import Link from "next/link";

export default async function WatchlistManagePage() {
  "use cache";
  cacheLife("max");
  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="text-2xl font-semibold text-neutral-900">Manage watchlists</h1>
      <p className="mt-2 text-sm text-neutral-600">Create lists and reorder symbols.</p>
      <div className="mt-6 text-sm text-neutral-500">Primary list · 6 symbols</div>
      <Link href="/" className="mt-6 inline-block text-sm underline">
        Edit on dashboard
      </Link>
    </div>
  );
}
