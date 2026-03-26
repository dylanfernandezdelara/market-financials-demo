import { Skeleton } from "@/components/ui/skeleton";

type CardSkeletonProps = {
  /** Number of text lines to render below the header area */
  lines?: number;
  className?: string;
};

export function CardSkeleton({ lines = 3, className = "" }: CardSkeletonProps) {
  return (
    <section
      className={`relative overflow-hidden rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm ${className}`}
    >
      {/* Eyebrow */}
      <Skeleton className="h-3 w-20" />
      {/* Title */}
      <Skeleton className="mt-3 h-6 w-48" />
      {/* Description */}
      <Skeleton className="mt-2 h-4 w-72" />

      {/* Body lines */}
      <div className="mt-6 space-y-3">
        {Array.from({ length: lines }).map((_, i) => (
          <Skeleton
            key={i}
            className="h-4"
            style={{ width: `${85 - i * 10}%` }}
          />
        ))}
      </div>
    </section>
  );
}
