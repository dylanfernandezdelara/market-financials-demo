export default function EarningsCalendarPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <h1 className="text-2xl font-semibold text-neutral-900">Earnings calendar</h1>
      <p className="mt-2 text-sm text-neutral-600">Upcoming reports for watchlist names.</p>
      <div className="mt-8 rounded-xl border border-dashed border-neutral-300 bg-neutral-50 p-8 text-center text-sm text-neutral-500">
        No upcoming earnings reports to display.
      </div>
    </div>
  );
}
