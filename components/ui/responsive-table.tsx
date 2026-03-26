import { ReactNode } from "react";

type Column<T> = {
  key: keyof T & string;
  label: string;
  className?: string;
  render?: (value: T[keyof T], row: T) => ReactNode;
};

type ResponsiveTableProps<T> = {
  columns: Column<T>[];
  rows: T[];
  rowKey: keyof T & string;
  emptyMessage?: string;
};

export function ResponsiveTable<T extends Record<string, unknown>>({
  columns,
  rows,
  rowKey,
  emptyMessage = "No data available.",
}: ResponsiveTableProps<T>) {
  if (rows.length === 0) {
    return (
      <p className="py-6 text-center text-sm text-neutral-500">
        {emptyMessage}
      </p>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-neutral-200">
      {/* Desktop table */}
      <div className="hidden overflow-x-auto md:block">
        <table className="min-w-full divide-y divide-neutral-200 text-sm">
          <thead className="bg-neutral-50">
            <tr className="text-left text-neutral-500">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`px-4 py-3 font-medium ${col.className ?? ""}`}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100 bg-white">
            {rows.map((row) => (
              <tr key={String(row[rowKey])}>
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={`px-4 py-4 text-neutral-600 ${col.className ?? ""}`}
                  >
                    {col.render
                      ? col.render(row[col.key], row)
                      : String(row[col.key] ?? "")}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile stacked cards */}
      <div className="divide-y divide-neutral-100 md:hidden">
        {rows.map((row) => (
          <div key={String(row[rowKey])} className="space-y-2 bg-white px-4 py-4">
            {columns.map((col) => (
              <div key={col.key} className="flex items-baseline justify-between gap-4 text-sm">
                <span className="shrink-0 text-neutral-500">{col.label}</span>
                <span className="text-right text-neutral-900">
                  {col.render
                    ? col.render(row[col.key], row)
                    : String(row[col.key] ?? "")}
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
