import { EmptyState } from "@/components/ui/empty-state";

export default function EarningsCalendarPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <h1 className="text-2xl font-semibold text-neutral-900">Earnings calendar</h1>
      <p className="mt-2 text-sm text-neutral-600">Upcoming reports for watchlist names.</p>
      <EmptyState message="No upcoming earnings to display." className="mt-6" />
    </div>
  );
}
