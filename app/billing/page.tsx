import { CreditCard, FileText } from "lucide-react";
import { getBillingData } from "@/lib/market-data";
import { formatCurrency } from "@/lib/utils";

const statusClasses: Record<string, string> = {
  paid: "border-emerald-300 bg-emerald-50 text-emerald-700",
  pending: "border-amber-300 bg-amber-50 text-amber-700",
  overdue: "border-rose-300 bg-rose-50 text-rose-700",
};

export default async function BillingPage() {
  const { invoices, paymentMethods } = await getBillingData();

  return (
    <div className="mx-auto max-w-2xl px-6 py-10">
      <h1 className="text-2xl font-semibold text-neutral-900">Billing</h1>
      <p className="mt-2 text-sm text-neutral-600">Invoices and payment methods.</p>

      {/* Payment methods */}
      <section className="mt-8">
        <h2 className="flex items-center gap-2 text-sm font-medium text-neutral-700">
          <CreditCard className="size-4" />
          Payment methods
        </h2>
        <div className="mt-3 space-y-3">
          {paymentMethods.map((method) => (
            <div
              key={method.id}
              className="flex items-center justify-between rounded-lg border border-neutral-200 bg-white px-4 py-3 text-sm"
            >
              <div className="flex items-center gap-3">
                <span className="font-medium text-neutral-900">
                  {method.label} •••• {method.last4}
                </span>
                <span className="text-neutral-500">Exp {method.expiry}</span>
                {method.isDefault ? (
                  <span className="rounded-full border border-emerald-300 bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
                    Default
                  </span>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Invoices */}
      <section className="mt-10">
        <h2 className="flex items-center gap-2 text-sm font-medium text-neutral-700">
          <FileText className="size-4" />
          Invoices
        </h2>
        <div className="mt-3 overflow-hidden rounded-lg border border-neutral-200">
          <table className="min-w-full divide-y divide-neutral-200 text-sm">
            <thead className="bg-neutral-50">
              <tr className="text-left text-neutral-500">
                <th className="px-4 py-3 font-medium">Invoice</th>
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium">Amount</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 bg-white">
              {invoices.map((invoice) => (
                <tr key={invoice.id}>
                  <td className="px-4 py-3">
                    <p className="font-medium text-neutral-900">{invoice.description}</p>
                    <p className="text-xs text-neutral-500">{invoice.id}</p>
                  </td>
                  <td className="px-4 py-3 text-neutral-600">{invoice.date}</td>
                  <td className="px-4 py-3 font-medium text-neutral-900">
                    {formatCurrency(invoice.amount)}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block rounded-full border px-2 py-0.5 text-xs font-medium capitalize ${statusClasses[invoice.status] ?? ""}`}
                    >
                      {invoice.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
