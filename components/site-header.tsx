import type { ReactNode } from "react";
import { FinanceShell } from "@/components/finance/finance-shell";
import type { SearchResult } from "@/types/finance";

type SiteHeaderProps = {
  searchOptions: SearchResult[];
  children: ReactNode;
  showMarketTabs?: boolean;
  contentMaxWidthClass?: string;
};

/** App chrome: top bar + optional market tabs. */
export function SiteHeader({
  searchOptions,
  children,
  showMarketTabs = true,
  contentMaxWidthClass,
}: SiteHeaderProps) {
  return (
    <FinanceShell
      searchOptions={searchOptions}
      showMarketTabs={showMarketTabs}
      contentMaxWidthClass={contentMaxWidthClass}
    >
      {children}
    </FinanceShell>
  );
}
