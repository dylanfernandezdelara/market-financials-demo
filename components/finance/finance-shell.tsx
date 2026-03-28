import type { ReactNode } from "react";
import { FinanceMarketTabs } from "@/components/finance/finance-market-tabs";
import { FinanceTopBar } from "@/components/finance/finance-top-bar";
import { CommandPalette } from "@/components/features/command-palette";
import type { SearchResult } from "@/types/finance";

type FinanceShellProps = {
  searchOptions: SearchResult[];
  children: ReactNode;
  /** When false, hides the Crypto / Earnings / … strip (e.g. symbol detail pages). */
  showMarketTabs?: boolean;
  contentMaxWidthClass?: string;
};

export function FinanceShell({
  searchOptions,
  children,
  showMarketTabs = true,
  contentMaxWidthClass = "max-w-[960px]",
}: FinanceShellProps) {
  return (
    <div className="flex min-h-screen bg-white text-[#1a1a1a]">
      <div className="flex min-w-0 flex-1 flex-col bg-white">
        <FinanceTopBar searchOptions={searchOptions} />
        {showMarketTabs ? <FinanceMarketTabs /> : null}
        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
          <div className={`mx-auto w-full flex-1 px-6 py-6 ${contentMaxWidthClass}`}>
            {children}
          </div>
          <footer className="border-t border-neutral-200 bg-white px-6 py-4 text-center text-xs text-neutral-500">
            © 2026 Market Financials Demo. All rights reserved.
          </footer>
        </div>
      </div>
      <CommandPalette options={searchOptions} />
    </div>
  );
}
