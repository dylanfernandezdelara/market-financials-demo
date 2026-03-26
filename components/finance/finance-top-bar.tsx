import Link from "next/link";
import { NotificationBell } from "@/components/features/notification-bell";
import { ShareButton } from "@/components/features/share-button";
import { SymbolSearch } from "@/components/symbol-search";
import type { SearchResult } from "@/types/finance";

type FinanceTopBarProps = {
  searchOptions: SearchResult[];
};

export function FinanceTopBar({ searchOptions }: FinanceTopBarProps) {
  return (
    <div className="border-b border-[#ebebeb] bg-white px-4 py-4 sm:px-6">
      <div className="mx-auto flex max-w-[960px] flex-col gap-4 lg:grid lg:grid-cols-[auto_minmax(0,1fr)_auto] lg:items-center lg:gap-6">
        <h1 className="text-[17px] font-semibold tracking-tight text-[#1a1a1a]">
          Market
        </h1>
        <div className="flex justify-center lg:order-none">
          <div className="w-full max-w-xl">
            <SymbolSearch options={searchOptions} variant="header" />
          </div>
        </div>
        <div className="flex items-center justify-end gap-2 lg:justify-end">
          <NotificationBell />
          <ShareButton />
          <Link
            href="/insights"
            className="rounded-lg px-3 py-2 text-[13px] font-medium text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
          >
            Insights
          </Link>
          <Link
            href="/settings"
            className="rounded-lg px-3 py-2 text-[13px] font-medium text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
          >
            Settings
          </Link>
          <Link
            href="/portfolio"
            className="rounded-lg px-3 py-2 text-[13px] font-medium text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
          >
            Portfolio
          </Link>
        </div>
      </div>
    </div>
  );
}
