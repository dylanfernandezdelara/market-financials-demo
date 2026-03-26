import { getAccountPlan, hasFeature, planLabel } from "@/lib/feature-gates";

export default function BillingPage() {
  const plan = getAccountPlan();

  return (
    <div className="mx-auto max-w-2xl px-6 py-10">
      <h1 className="text-2xl font-semibold text-neutral-900">Billing</h1>
      <p className="mt-2 text-sm text-neutral-600">Invoices and payment methods.</p>
      <p className="mt-4 text-sm text-neutral-500">
        Current plan: <span className="font-medium text-neutral-700">{planLabel(plan)}</span>
      </p>
      {hasFeature(plan, "billing") ? (
        <p className="mt-6 text-sm text-neutral-500">No invoices on file.</p>
      ) : (
        <div className="mt-8 rounded-xl border border-dashed border-neutral-300 bg-neutral-50 p-8 text-center text-sm text-neutral-500">
          <p>Upgrade to a paid plan to manage invoices and payment methods.</p>
        </div>
      )}
    </div>
  );
}
