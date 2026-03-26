import type { StockProfile } from "@/types/finance";

type StockCompanySidebarProps = {
  stock: StockProfile;
};

const countryByExchange: Record<string, string> = {
  NASDAQ: "United States",
  NYSE: "United States",
  ARCA: "United States",
  CRYPTO: "Global",
};

function analystCoverage(price: number, week52Low: number, week52High: number) {
  const range = week52High - week52Low;
  const analystCount = Math.round(14 + (range / price) * 40);
  const targetLow = +(week52Low + range * 0.25).toFixed(2);
  const targetHigh = +(week52High + range * 0.1).toFixed(2);
  const targetMean = +((targetLow + targetHigh) / 2).toFixed(2);

  return { analystCount, targetLow, targetHigh, targetMean };
}

export function StockCompanySidebar({ stock }: StockCompanySidebarProps) {
  const country = countryByExchange[stock.exchange] ?? stock.exchange;
  const coverage = analystCoverage(stock.price, stock.week52Low, stock.week52High);

  return (
    <div className="space-y-4">
      <section className="rounded-xl border border-[#ebebeb] bg-white p-4">
        <h3 className="text-[15px] font-semibold text-[#1a1a1a]">Company information</h3>
        <dl className="mt-3 space-y-2.5 text-[13px]">
          <div className="flex justify-between gap-4">
            <dt className="text-neutral-500">Symbol</dt>
            <dd className="font-medium text-[#1a1a1a]">{stock.symbol}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-neutral-500">Sector</dt>
            <dd className="text-right font-medium text-[#1a1a1a]">{stock.sector}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-neutral-500">Industry</dt>
            <dd className="text-right font-medium text-[#1a1a1a]">{stock.industry}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-neutral-500">Exchange</dt>
            <dd className="font-medium text-[#1a1a1a]">{stock.exchange}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-neutral-500">Country</dt>
            <dd className="font-medium text-[#1a1a1a]">{country}</dd>
          </div>
        </dl>
        <p className="mt-4 text-[13px] leading-relaxed text-neutral-600">{stock.description}</p>
      </section>

      <section className="rounded-xl border border-[#ebebeb] bg-white p-4">
        <h3 className="text-[15px] font-semibold text-[#1a1a1a]">Analyst consensus</h3>
        <p className="mt-1 text-[12px] text-neutral-500">
          Based on {coverage.analystCount} analyst estimates
        </p>
        <div className="mt-4 flex items-center gap-2">
          <span className="rounded-md bg-emerald-50 px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-emerald-800">
            Buy lean
          </span>
          <span className="text-[12px] text-neutral-500">Illustrative only</span>
        </div>
        <div className="mt-4 space-y-2">
          <div className="flex h-2 overflow-hidden rounded-full bg-neutral-100">
            <span className="w-[8%] bg-red-400" title="Bearish" />
            <span className="w-[12%] bg-amber-400" title="Hold" />
            <span className="w-[80%] bg-emerald-500" title="Bullish" />
          </div>
          <div className="flex justify-between text-[11px] text-neutral-500">
            <span>Bearish</span>
            <span>Hold</span>
            <span>Bullish</span>
          </div>
        </div>
        <div className="mt-4 rounded-lg bg-[#fafafa] px-3 py-3 text-[12px] text-neutral-600">
          <p className="font-medium text-[#1a1a1a]">Price context</p>
          <p className="mt-1 tabular-nums">
            Current {stock.price.toFixed(2)} vs. range {stock.week52Low.toFixed(0)} –{" "}
            {stock.week52High.toFixed(0)}
          </p>
          <p className="mt-1.5 font-medium text-[#1a1a1a]">Target range</p>
          <p className="mt-0.5 tabular-nums">
            {coverage.targetLow.toFixed(2)} – {coverage.targetHigh.toFixed(2)} (avg{" "}
            {coverage.targetMean.toFixed(2)})
          </p>
        </div>
      </section>
    </div>
  );
}
