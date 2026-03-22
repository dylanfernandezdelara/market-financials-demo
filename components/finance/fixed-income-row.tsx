import Link from "next/link";
import { changeTextClass, formatCurrency, formatPercent } from "@/lib/utils";
import type { FixedIncomeRow } from "@/types/finance";

type FixedIncomeRowProps = {
  rows: FixedIncomeRow[];
};

export function FixedIncomeRow({ rows }: FixedIncomeRowProps) {
  return (
    <section className="scroll-mt-28" aria-labelledby="fixed-heading">
      <h2 id="fixed-heading" className="mb-3 text-[17px] font-semibold text-neutral-900">
        Fixed Income
      </h2>
      <div className="grid gap-1.5 sm:grid-cols-2 lg:grid-cols-3">
        {rows.map((row) => (
          <Link
            key={row.symbol}
            href={`/stocks/${row.symbol}`}
            className="flex items-center justify-between gap-3 rounded-lg border border-neutral-200 bg-white px-3 py-2.5 shadow-sm transition-shadow hover:shadow-md"
          >
            <span className="text-[13px] font-medium text-neutral-800">{row.name}</span>
            <span className="text-right">
              <span className="block text-[13px] tabular-nums text-neutral-800">
                {formatCurrency(row.price)}
              </span>
              <span className={`text-xs font-semibold tabular-nums ${changeTextClass(row.changePercent)}`}>
                {formatPercent(row.changePercent)}
              </span>
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
