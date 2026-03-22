"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { href: "/", label: "US Markets", flag: true },
  { href: "/#crypt", label: "Crypto" },
  { href: "/#earnings", label: "Earnings" },
  { href: "/#predictions", label: "Predictions" },
  { href: "/#screener", label: "Screener" },
  { href: "/#politicians", label: "Politicians" },
  { href: "/#watchlist", label: "Watchlist" },
] as const;

export function FinanceMarketTabs() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <div className="border-b border-[#ebebeb] bg-white px-6">
      <nav
        className="mx-auto flex max-w-[960px] flex-wrap gap-1 pb-0 pt-1"
        aria-label="Markets"
      >
        {tabs.map((tab) => {
          const active = isHome && tab.href === "/";
          return (
            <Link
              key={tab.label}
              href={tab.href}
              className={`relative inline-flex items-center gap-1.5 px-3 pb-2.5 pt-2 text-[13px] font-medium transition-colors ${
                active
                  ? "text-[#1a1a1a]"
                  : "text-neutral-500 hover:text-neutral-800"
              }`}
            >
              {"flag" in tab && tab.flag ? (
                <span className="text-[13px]" aria-hidden>
                  🇺🇸
                </span>
              ) : null}
              {tab.label}
              {active ? (
                <span className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full bg-[#1a1a1a]" />
              ) : null}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
