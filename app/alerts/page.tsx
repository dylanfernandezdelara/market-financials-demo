import Link from "next/link";
import { PriceAlertDialog } from "@/components/features/price-alert-dialog";
import { EmptyState } from "@/components/ui/empty-state";

export default function AlertsPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="text-2xl font-semibold text-neutral-900">Price alerts</h1>
      <p className="mt-2 text-sm text-neutral-600">
        Create rules for price crosses, volume spikes, and headline keywords.
      </p>
      <div className="mt-4">
        <PriceAlertDialog />
      </div>
      <EmptyState message="No active alerts" className="mt-6" />
      <Link href="/stocks/NVDA" className="mt-6 inline-block text-sm text-neutral-900 underline">
        Open a symbol
      </Link>
    </div>
  );
}
