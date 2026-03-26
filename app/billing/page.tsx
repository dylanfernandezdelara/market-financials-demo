import { cacheLife } from "next/cache";

export default async function BillingPage() {
  "use cache";
  cacheLife("max");
  return (
    <div className="mx-auto max-w-2xl px-6 py-10">
      <h1 className="text-2xl font-semibold text-neutral-900">Billing</h1>
      <p className="mt-2 text-sm text-neutral-600">Invoices and payment methods.</p>
      <p className="mt-6 text-sm text-neutral-500">No invoices on file.</p>
    </div>
  );
}
