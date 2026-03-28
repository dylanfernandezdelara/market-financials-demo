import { Skeleton } from "@/components/ui/skeleton";

type TableSkeletonProps = {
  /** Number of columns */
  columns?: number;
  /** Number of body rows */
  rows?: number;
  className?: string;
};

export function TableSkeleton({
  columns = 5,
  rows = 4,
  className = "",
}: TableSkeletonProps) {
  return (
    <div
      className={`overflow-hidden rounded-2xl border border-neutral-200 ${className}`}
    >
      <table className="min-w-full divide-y divide-neutral-200 text-sm">
        <thead className="bg-neutral-50">
          <tr>
            {Array.from({ length: columns }).map((_, i) => (
              <th key={i} className="px-4 py-3">
                <Skeleton className="h-3 w-16" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-100 bg-white">
          {Array.from({ length: rows }).map((_, rowIdx) => (
            <tr key={rowIdx}>
              {Array.from({ length: columns }).map((_, colIdx) => (
                <td key={colIdx} className="px-4 py-4">
                  <Skeleton
                    className="h-4"
                    style={{ width: colIdx === 0 ? "80%" : "60%" }}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
