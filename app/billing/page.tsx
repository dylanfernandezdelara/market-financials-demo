import { EmptyState } from "@/components/ui/empty-state";

export default function BillingPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-10">
      <h1 className="text-2xl font-semibold text-neutral-900">Billing</h1>
      <p className="mt-2 text-sm text-neutral-600">Invoices and payment methods.</p>
      <EmptyState message="No invoices on file." className="mt-6" />
    </div>
  );
}
