import { BrokerSyncCard } from "@/components/features/broker-sync-card";

export default function IntegrationsPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="text-2xl font-semibold text-neutral-900">Integrations</h1>
      <p className="mt-2 text-sm text-neutral-600">Connect brokerage and data feeds.</p>
      <ul className="mt-6 space-y-3 text-sm">
        <BrokerSyncCard />
        <li className="flex justify-between rounded-lg border border-neutral-200 px-4 py-3">
          <span>News wire</span>
          <span className="text-neutral-400">Not connected</span>
        </li>
      </ul>
    </div>
  );
}
