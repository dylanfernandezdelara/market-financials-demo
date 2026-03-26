import type { StockProfile } from "@/types/finance";
import {
  formatCurrency,
  formatCompactNumber,
  formatPercent,
} from "@/lib/utils";
import { epsFromPe, formatCompactTraded } from "@/lib/stock-details";

type CompareMetricsTableProps = {
  stocks: StockProfile[];
};

type MetricRow = {
  label: string;
  values: string[];
};

function buildMetricRows(stocks: StockProfile[]): MetricRow[] {
  return [
    {
      label: "Price",
      values: stocks.map((s) => formatCurrency(s.price)),
    },
    {
      label: "Change",
      values: stocks.map((s) => formatPercent(s.changePercent)),
    },
    {
      label: "Market cap",
      values: stocks.map((s) => `$${formatCompactTraded(s.marketCap)}`),
    },
    {
      label: "P/E ratio",
      values: stocks.map((s) => (s.peRatio > 0 ? s.peRatio.toFixed(2) : "\u2014")),
    },
    {
      label: "EPS (ttm)",
      values: stocks.map((s) => {
        const eps = epsFromPe(s);
        return eps === null ? "\u2014" : eps.toFixed(2);
      }),
    },
    {
      label: "Dividend yield",
      values: stocks.map((s) => `${s.dividendYield.toFixed(2)}%`),
    },
    {
      label: "52W low",
      values: stocks.map((s) => formatCurrency(s.week52Low, { maximumFractionDigits: 2 })),
    },
    {
      label: "52W high",
      values: stocks.map((s) => formatCurrency(s.week52High, { maximumFractionDigits: 2 })),
    },
    {
      label: "Volume",
      values: stocks.map((s) => formatCompactNumber(s.volume)),
    },
    {
      label: "Avg volume",
      values: stocks.map((s) => formatCompactNumber(s.averageVolume)),
    },
    {
      label: "Beta",
      values: stocks.map((s) => s.beta.toFixed(2)),
    },
    {
      label: "Sector",
      values: stocks.map((s) => s.sector),
    },
    {
      label: "Industry",
      values: stocks.map((s) => s.industry),
    },
    {
      label: "Exchange",
      values: stocks.map((s) => s.exchange),
    },
  ];
}

export function CompareMetricsTable({ stocks }: CompareMetricsTableProps) {
  const rows = buildMetricRows(stocks);

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-[13px]">
        <thead>
          <tr className="border-b border-[#ebebeb]">
            <th className="py-3 pr-4 text-left text-[11px] font-medium uppercase tracking-wide text-neutral-500">
              Metric
            </th>
            {stocks.map((stock) => (
              <th
                key={stock.symbol}
                className="px-4 py-3 text-right text-[13px] font-semibold text-[#1a1a1a]"
              >
                {stock.symbol}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.label} className="border-b border-[#f0f0f0]">
              <td className="py-2.5 pr-4 text-[11px] font-medium uppercase tracking-wide text-neutral-500">
                {row.label}
              </td>
              {row.values.map((value, index) => (
                <td
                  key={stocks[index].symbol}
                  className="px-4 py-2.5 text-right font-semibold tabular-nums text-[#1a1a1a]"
                >
                  {value}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
