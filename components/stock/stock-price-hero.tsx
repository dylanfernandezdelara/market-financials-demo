"use client";

import { useState, useEffect } from "react";
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
};

/**
 * Return a label anchored to the most recent regular-session close (4:00 PM ET)
 * rather than the current request time.
 */
function lastSessionCloseLabel(): string {
  const now = new Date();
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    weekday: "short",
    hourCycle: "h23",
    hour: "numeric",
  }).formatToParts(now);

  const weekday = parts.find((p) => p.type === "weekday")?.value ?? "";
  const hour = Number(parts.find((p) => p.type === "hour")?.value ?? "0");

  let daysBack = 0;
  if (weekday === "Sun") daysBack = 2;
  else if (weekday === "Sat") daysBack = 1;
  else if (hour < 16) {
    daysBack = weekday === "Mon" ? 3 : 1;
  }

  const closeDate = new Date(now.getTime() - daysBack * 86_400_000);

  const dateLabel = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "America/New_York",
  }).format(closeDate);

  const tzName =
    new Intl.DateTimeFormat("en-US", {
      timeZone: "America/New_York",
      timeZoneName: "short",
    })
      .formatToParts(closeDate)
      .find((p) => p.type === "timeZoneName")?.value ?? "ET";

  return `At close: ${dateLabel}, 4:00 PM ${tzName}`;
}

export function StockPriceHero({ stock }: StockPriceHeroProps) {
  const closeTimeLabel = lastSessionCloseLabel();
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
          <span className={sessionDown ? "text-red-600" : "text-emerald-600"}>
            {formatSignedCurrency(stock.change)}
          </span>
          <span className={sessionDown ? "text-red-600" : "text-emerald-600"}>
            {formatPercent(stock.changePercent)}
          </span>
        </div>
        <p className="mt-3 text-[12px] text-neutral-500">{closeTimeLabel}</p>
      </div>
      <div className="rounded-xl border border-dashed border-[#d4d4d4] bg-[#fafafa] px-4 py-4">
        <p className="text-[11px] font-medium uppercase tracking-wide text-neutral-500">
          After hours{" "}
          <span className="ml-1 rounded bg-neutral-200 px-1.5 py-0.5 text-[10px] font-semibold normal-case tracking-normal text-neutral-500">
            Simulated
          </span>
        </p>
        <p className="mt-1 text-3xl font-semibold tabular-nums tracking-tight text-[#1a1a1a]">
          {formatCurrency(ah.afterHoursPrice)}
        </p>
        <div className="mt-1 flex flex-wrap items-baseline gap-2 text-[13px] font-medium">
          <span className={ahUp ? "text-emerald-600" : "text-red-600"}>
            {formatSignedCurrency(ah.afterHoursChange)}
          </span>
          <span className={ahUp ? "text-emerald-600" : "text-red-600"}>
            {formatPercent(ah.afterHoursChangePercent)}
          </span>
        </div>
        <p className="mt-3 text-[12px] text-neutral-500">
          Synthetic estimate · not a live quote
        </p>
      </div>
    </div>
  );
}

export function StockFollowRow() {
  const [followed, setFollowed] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    if (feedback) {
      const timer = setTimeout(() => setFeedback(null), 2000);
      return () => clearTimeout(timer);
    }
  }, [feedback]);

  function toggle() {
    const next = !followed;
    setFollowed(next);
    setFeedback(next ? "Added to watchlist" : "Removed from watchlist");
  }

  return (
    <div className="inline-flex items-center gap-2">
      <button
        type="button"
        onClick={toggle}
        className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-[13px] font-medium shadow-sm transition-colors ${
          followed
            ? "border-amber-300 bg-amber-50 text-amber-700 hover:bg-amber-100"
            : "border-[#e5e5e5] bg-white text-neutral-800 hover:bg-neutral-50"
        }`}
      >
        <Star
          className={`size-4 ${followed ? "fill-amber-400 text-amber-400" : "text-neutral-500"}`}
          strokeWidth={1.75}
        />
        {followed ? "Following" : "Follow"}
      </button>
      {feedback && (
        <span className="text-[12px] font-medium text-emerald-600">
          {feedback}
        </span>
      )}
    </div>
  );
}
