import Link from "next/link";
import { PriceAlertDialog } from "@/components/features/price-alert-dialog";
import { PortfolioAlertSuggestions } from "@/components/features/portfolio-alert-suggestions";
import { getAlertSuggestions } from "@/lib/market-data";

export default async function AlertsPage() {
  const suggestions = await getAlertSuggestions();

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="text-2xl font-semibold text-neutral-900">Price alerts</h1>
      <p className="mt-2 text-sm text-neutral-600">
        Create rules for price crosses, volume spikes, and headline keywords.
      </p>
      <div className="mt-4">
        <PriceAlertDialog />
      </div>
      {suggestions.length > 0 && (
        <div className="mt-6">
          <PortfolioAlertSuggestions suggestions={suggestions} />
        </div>
      )}
      <ul className="mt-6 space-y-2 text-sm text-neutral-500">
        <li>No active alerts</li>
      </ul>
      <Link href="/stocks/NVDA" className="mt-6 inline-block text-sm text-neutral-900 underline">
        Open a symbol
      </Link>
    </div>
  );
}
