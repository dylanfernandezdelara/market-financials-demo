import Link from "next/link";
import { SymbolSearch } from "@/components/symbol-search";
import { getSearchUniverse } from "@/lib/market-data";

export default async function NotFound() {
  const searchOptions = await getSearchUniverse();

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col items-center justify-center bg-[#fafafa] px-4 text-center">
      <div className="rounded-[32px] border border-neutral-200 bg-white p-10 shadow-sm">
        <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-neutral-500">
          Not found
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-neutral-950">
          We could not find that page.
        </h1>
        <p className="mt-4 text-base leading-7 text-neutral-600">
          That symbol is not in the current coverage universe. Try searching for another ticker
          below, or head back to the markets dashboard.
        </p>
        <div className="mx-auto mt-6 max-w-md">
          <SymbolSearch options={searchOptions} variant="toolbar" />
        </div>
        <Link
          href="/"
          className="mt-4 inline-flex rounded-full bg-neutral-950 px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-neutral-800"
        >
          Return to markets
        </Link>
      </div>
    </main>
  );
}
