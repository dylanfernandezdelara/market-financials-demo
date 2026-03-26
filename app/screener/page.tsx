import Link from "next/link";
import { ChangePill } from "@/components/ui/change-pill";
import { SectionHeader } from "@/components/ui/section-header";
import { SurfaceCard } from "@/components/ui/surface-card";
import { FinanceShell } from "@/components/finance/finance-shell";
import { getScreenerStocks, getSearchUniverse } from "@/lib/market-data";
import { formatCompactNumber, formatCurrency, formatPercent } from "@/lib/utils";

export default async function ScreenerPage() {
  const [stocks, searchOptions] = await Promise.all([
    getScreenerStocks(),
    getSearchUniverse(),
  ]);

  return (
    <FinanceShell searchOptions={searchOptions}>
      <div className="flex flex-col gap-6 pb-8">
        <SurfaceCard>
          <SectionHeader
            eyebrow="Screener"
            title="Stock screener"
            description="Browse and compare equities by key fundamentals, valuation, and momentum."
          />
          <div className="mt-5 overflow-hidden rounded-2xl border border-neutral-200">
            <table className="min-w-full divide-y divide-neutral-200 text-sm">
              <thead className="bg-neutral-50">
                <tr className="text-left text-neutral-500">
                  <th className="px-4 py-3 font-medium">Symbol</th>
                  <th className="px-4 py-3 font-medium">Price</th>
                  <th className="px-4 py-3 font-medium">Change</th>
                  <th className="px-4 py-3 font-medium">Market cap</th>
                  <th className="px-4 py-3 font-medium">P/E</th>
                  <th className="px-4 py-3 font-medium">Div yield</th>
                  <th className="px-4 py-3 font-medium">Volume</th>
                  <th className="px-4 py-3 font-medium">52-wk range</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 bg-white">
                {stocks.map((stock) => (
                  <tr key={stock.symbol} className="transition-colors hover:bg-neutral-50">
                    <td className="px-4 py-4">
                      <Link href={`/stocks/${stock.symbol}`} className="group">
                        <p className="font-mono font-semibold text-neutral-900 group-hover:text-emerald-700">
                          {stock.symbol}
                        </p>
                        <p className="text-xs text-neutral-500">{stock.name}</p>
                      </Link>
                    </td>
                    <td className="px-4 py-4 font-medium tabular-nums text-neutral-900">
                      {formatCurrency(stock.price)}
                    </td>
                    <td className="px-4 py-4">
                      <ChangePill value={stock.changePercent} compact />
                    </td>
                    <td className="px-4 py-4 tabular-nums text-neutral-600">
                      {formatCompactNumber(stock.marketCap)}
                    </td>
                    <td className="px-4 py-4 tabular-nums text-neutral-600">
                      {stock.peRatio > 0 ? stock.peRatio.toFixed(1) : "\u2014"}
                    </td>
                    <td className="px-4 py-4 tabular-nums text-neutral-600">
                      {stock.dividendYield > 0
                        ? formatPercent(stock.dividendYield, 2).replace("+", "")
                        : "\u2014"}
                    </td>
                    <td className="px-4 py-4 tabular-nums text-neutral-600">
                      {formatCompactNumber(stock.volume)}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <span className="text-xs tabular-nums text-neutral-400">
                          {formatCurrency(stock.week52Low)}
                        </span>
                        <div className="relative h-1.5 w-16 rounded-full bg-neutral-200">
                          <div
                            className="absolute inset-y-0 left-0 rounded-full bg-emerald-500"
                            style={{
                              width: `${Math.min(
                                100,
                                Math.max(
                                  0,
                                  stock.week52High === stock.week52Low
                                    ? 0
                                    : ((stock.price - stock.week52Low) /
                                        (stock.week52High - stock.week52Low)) *
                                        100,
                                ),
                              )}%`,
                            }}
                          />
                        </div>
                        <span className="text-xs tabular-nums text-neutral-400">
                          {formatCurrency(stock.week52High)}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SurfaceCard>
      </div>
    </FinanceShell>
  );
}
