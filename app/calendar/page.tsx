export default function EarningsCalendarPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <h1 className="text-2xl font-semibold text-neutral-900">Earnings calendar</h1>
      <p className="mt-2 text-sm text-neutral-600">Upcoming reports for watchlist names.</p>
      <table className="mt-6 w-full text-left text-sm">
        <thead>
          <tr className="border-b border-neutral-200 text-neutral-500">
            <th className="py-2">Symbol</th>
            <th className="py-2">Date</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="py-3">—</td>
            <td className="py-3">—</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
