import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { MoversPanel } from "@/components/finance/movers-panel";
import { getMarketMovers, getSearchUniverse } from "@/lib/market-data";

export const metadata: Metadata = {
  title: "Movers · Market Dashboard",
  description: "Top gainers, losers, and most active stocks in today's session.",
};

export default async function MoversPage() {
  const [movers, searchOptions] = await Promise.all([
    getMarketMovers(),
    getSearchUniverse(),
  ]);

  return (
    <SiteHeader searchOptions={searchOptions}>
      <div className="pb-10">
        <nav className="flex flex-wrap items-center gap-1 text-[13px] text-neutral-500">
          <Link href="/" className="hover:text-neutral-900">
            Market
          </Link>
          <ChevronRight className="size-3.5 shrink-0 text-neutral-400" aria-hidden />
          <span className="font-medium text-neutral-900">Movers</span>
        </nav>

        <h1 className="mt-6 text-2xl font-semibold tracking-tight text-neutral-900">
          Market movers
        </h1>
        <p className="mt-1.5 text-[14px] text-neutral-600">
          Top gainers, losers, and most active stocks.
        </p>

        <div className="mt-8">
          <MoversPanel movers={movers} showSeeAll={false} />
        </div>
      </div>
    </SiteHeader>
  );
}
