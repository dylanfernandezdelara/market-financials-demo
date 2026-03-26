export default function IntegrationsPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="text-2xl font-semibold text-neutral-900">Integrations</h1>
      <p className="mt-2 text-sm text-neutral-600">Connect brokerage and data feeds.</p>
      <div className="mt-6 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
        This demo uses mock data providers instead of live integrations.
        The connections below are placeholders showing where real feeds would
        appear once configured against a brokerage or data vendor.
      </div>
      <ul className="mt-4 space-y-3 text-sm">
        <li className="flex items-start justify-between rounded-lg border border-neutral-200 px-4 py-3">
          <div>
            <span className="font-medium text-neutral-900">Broker sync</span>
            <p className="mt-1 text-xs text-neutral-500">
              Live brokerage sync is outside the scope of this demo.
            </p>
          </div>
          <span className="shrink-0 rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs text-neutral-500">
            Demo only
          </span>
        </li>
        <li className="flex items-start justify-between rounded-lg border border-neutral-200 px-4 py-3">
          <div>
            <span className="font-medium text-neutral-900">News wire</span>
            <p className="mt-1 text-xs text-neutral-500">
              Real-time news ingestion is outside the scope of this demo.
            </p>
          </div>
          <span className="shrink-0 rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs text-neutral-500">
            Demo only
          </span>
        </li>
      </ul>
    </div>
  );
}
