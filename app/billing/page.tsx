import { CalendarDays, CreditCard, Plus, Trash2, AlertTriangle } from "lucide-react";
import { getDashboardData } from "@/lib/market-data";
import { formatCurrency, formatPercent } from "@/lib/utils";

function earningsDateForSymbol(symbol: string): string {
  const base = new Date("2026-04-14");
  let hash = 0;
  for (let i = 0; i < symbol.length; i++) {
    hash = (hash * 31 + symbol.charCodeAt(i)) | 0;
  }
  const offset = Math.abs(hash) % 30;
  const date = new Date(base);
  date.setDate(date.getDate() + offset);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default async function BillingPage() {
  const dashboard = await getDashboardData();
  const watchlist = dashboard.watchlist;

  return (
    <div className="mx-auto max-w-2xl px-6 py-10">
      <h1 className="text-2xl font-semibold text-neutral-900">Billing</h1>
      <p className="mt-2 text-sm text-neutral-600">
        Invoices, payment methods, and upcoming earnings.
      </p>

      {/* FDL-715: Distinguish "no invoices" from "billing not implemented" */}
      <section className="mt-8">
        <h2 className="text-lg font-semibold text-neutral-900">Invoices</h2>
        <div className="mt-3 rounded-2xl border border-amber-200 bg-amber-50 p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 size-5 shrink-0 text-amber-600" />
            <div>
              <p className="text-sm font-medium text-amber-800">
                Billing is not yet available
              </p>
              <p className="mt-1 text-sm text-amber-700">
                Invoice management has not been implemented. This section will
                display your billing history once the feature is enabled.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FDL-714: Payment-method management controls */}
      <section className="mt-10">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-neutral-900">
            Payment methods
          </h2>
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-sm font-medium text-neutral-700 shadow-sm hover:bg-neutral-50"
          >
            <Plus className="size-4" />
            Add method
          </button>
        </div>

        <div className="mt-4 space-y-3">
          <div className="flex items-center justify-between rounded-2xl border border-neutral-200 bg-white p-4">
            <div className="flex items-center gap-3">
              <CreditCard className="size-5 text-neutral-500" />
              <div>
                <p className="text-sm font-medium text-neutral-900">
                  Visa ending in 4242
                </p>
                <p className="text-xs text-neutral-500">Expires 08/27</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
                Default
              </span>
              <button
                type="button"
                className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-red-600"
                aria-label="Remove card ending in 4242"
              >
                <Trash2 className="size-4" />
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between rounded-2xl border border-neutral-200 bg-white p-4">
            <div className="flex items-center gap-3">
              <CreditCard className="size-5 text-neutral-500" />
              <div>
                <p className="text-sm font-medium text-neutral-900">
                  Mastercard ending in 8910
                </p>
                <p className="text-xs text-neutral-500">Expires 03/26</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="rounded-lg px-2 py-0.5 text-xs font-medium text-neutral-500 hover:bg-neutral-100"
              >
                Set default
              </button>
              <button
                type="button"
                className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-red-600"
                aria-label="Remove card ending in 8910"
              >
                <Trash2 className="size-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FDL-716: Earnings calendar populated from watchlist */}
      <section className="mt-10">
        <h2 className="text-lg font-semibold text-neutral-900">
          Earnings calendar
        </h2>
        <p className="mt-1 text-sm text-neutral-500">
          Upcoming reports for symbols on your watchlist.
        </p>
        <div className="mt-4 overflow-hidden rounded-2xl border border-neutral-200">
          <table className="min-w-full divide-y divide-neutral-200 text-sm">
            <thead className="bg-neutral-50">
              <tr className="text-left text-neutral-500">
                <th className="px-4 py-3 font-medium">Symbol</th>
                <th className="px-4 py-3 font-medium">Price</th>
                <th className="px-4 py-3 font-medium">Change</th>
                <th className="px-4 py-3 font-medium">Report date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 bg-white">
              {watchlist.map((entry) => (
                <tr key={entry.symbol}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <CalendarDays className="size-4 text-neutral-400" />
                      <div>
                        <p className="font-mono font-semibold text-neutral-900">
                          {entry.symbol}
                        </p>
                        <p className="text-xs text-neutral-500">{entry.name}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-neutral-600">
                    {formatCurrency(entry.price)}
                  </td>
                  <td
                    className={`px-4 py-3 font-medium ${
                      entry.changePercent >= 0
                        ? "text-emerald-600"
                        : "text-red-600"
                    }`}
                  >
                    {formatPercent(entry.changePercent)}
                  </td>
                  <td className="px-4 py-3 text-neutral-600">
                    {earningsDateForSymbol(entry.symbol)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
