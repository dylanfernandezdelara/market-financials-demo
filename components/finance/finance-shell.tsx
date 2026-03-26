import type { ReactNode } from "react";
import { FinanceMarketTabs } from "@/components/finance/finance-market-tabs";
import { FinanceTopBar } from "@/components/finance/finance-top-bar";
import type { SearchResult } from "@/types/finance";

type FinanceShellProps = {
  searchOptions: SearchResult[];
  recentSymbols?: SearchResult[];
  watchlistShortcuts?: SearchResult[];
  children: ReactNode;
  /** When false, hides the Crypto / Earnings / … strip (e.g. symbol detail pages). */
  showMarketTabs?: boolean;
  contentMaxWidthClass?: string;
};

export function FinanceShell({
  searchOptions,
  recentSymbols,
  watchlistShortcuts,
  children,
  showMarketTabs = true,
  contentMaxWidthClass = "max-w-[960px]",
}: FinanceShellProps) {
  return (
    <div className="flex min-h-screen bg-white text-[#1a1a1a]">
      <div className="flex min-w-0 flex-1 flex-col bg-white">
        <FinanceTopBar
          searchOptions={searchOptions}
          recentSymbols={recentSymbols}
          watchlistShortcuts={watchlistShortcuts}
        />
        {showMarketTabs ? <FinanceMarketTabs /> : null}
        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
          <div className={`mx-auto w-full flex-1 px-6 py-6 ${contentMaxWidthClass}`}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
