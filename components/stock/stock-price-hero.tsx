import { Star } from "lucide-react";
import {
  formatCurrency,
  formatPercent,
  formatSignedCurrency,
} from "@/lib/utils";
import { sessionExtension } from "@/lib/stock-details";
import type { StockProfile } from "@/types/finance";

type StockPriceHeroProps = {
  stock: StockProfile;
  closeTimeLabel: string;
};

export function StockPriceHero({ stock, closeTimeLabel }: StockPriceHeroProps) {
  const ah = sessionExtension(stock);
  const sessionDown = stock.changePercent < 0;
  const ahUp = ah.afterHoursChangePercent >= 0;

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="rounded-xl border border-[#ebebeb] bg-[#fafafa] px-4 py-4">
        <p className="text-[11px] font-medium uppercase tracking-wide text-neutral-500">
          At close
        </p>
        <p className="mt-1 text-3xl font-semibold tabular-nums tracking-tight text-[#1a1a1a]">
          {formatCurrency(stock.price)}
        </p>
        <div className="mt-1 flex flex-wrap items-baseline gap-2 text-[13px] font-medium">
          <span className={sessionDown ? "text-rose-600" : "text-emerald-600"}>
            {formatSignedCurrency(stock.change)}
          </span>
          <span className={sessionDown ? "text-rose-600" : "text-emerald-600"}>
            {formatPercent(stock.changePercent)}
          </span>
        </div>
        <p className="mt-3 text-[12px] text-neutral-500">{closeTimeLabel}</p>
      </div>
      <div className="rounded-xl border border-[#ebebeb] bg-[#fafafa] px-4 py-4">
        <p className="text-[11px] font-medium uppercase tracking-wide text-neutral-500">
          After hours
        </p>
        <p className="mt-1 text-3xl font-semibold tabular-nums tracking-tight text-[#1a1a1a]">
          {formatCurrency(ah.afterHoursPrice)}
        </p>
        <div className="mt-1 flex flex-wrap items-baseline gap-2 text-[13px] font-medium">
          <span className={ahUp ? "text-emerald-600" : "text-rose-600"}>
            {formatSignedCurrency(ah.afterHoursChange)}
          </span>
          <span className={ahUp ? "text-emerald-600" : "text-rose-600"}>
            {formatPercent(ah.afterHoursChangePercent)}
          </span>
        </div>
        <p className="mt-3 text-[12px] text-neutral-500">Extended session · indicative</p>
      </div>
    </div>
  );
}

export function StockFollowRow() {
  return (
    <button
      type="button"
      className="inline-flex items-center gap-1.5 rounded-lg border border-[#e5e5e5] bg-white px-3 py-2 text-[13px] font-medium text-neutral-800 shadow-sm transition-colors hover:bg-neutral-50"
    >
      <Star className="size-4 text-neutral-500" strokeWidth={1.75} />
      Follow
    </button>
  );
}
