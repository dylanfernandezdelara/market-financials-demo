import { ResponsiveTable } from "@/components/ui/responsive-table";

type Invoice = {
  id: string;
  date: string;
  description: string;
  amount: string;
  status: string;
};

const columns = [
  { key: "date" as const, label: "Date" },
  { key: "description" as const, label: "Description" },
  { key: "amount" as const, label: "Amount" },
  {
    key: "status" as const,
    label: "Status",
    render: (value: unknown) => (
      <span className="inline-flex rounded-full border border-neutral-200 bg-neutral-50 px-2.5 py-0.5 text-xs font-medium text-neutral-600">
        {String(value)}
      </span>
    ),
  },
];

const invoices: Invoice[] = [];

export default function BillingPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-10">
      <h1 className="text-2xl font-semibold text-neutral-900">Billing</h1>
      <p className="mt-2 text-sm text-neutral-600">Invoices and payment methods.</p>
      <div className="mt-6">
        <ResponsiveTable<Invoice>
          columns={columns}
          rows={invoices}
          rowKey="id"
          emptyMessage="No invoices on file."
        />
      </div>
    </div>
  );
}
