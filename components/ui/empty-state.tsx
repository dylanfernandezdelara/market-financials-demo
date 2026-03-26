import { ReactNode } from "react";

type EmptyStateProps = {
  message: string;
  icon?: ReactNode;
  className?: string;
};

export function EmptyState({ message, icon, className = "" }: EmptyStateProps) {
  return (
    <div
      className={`rounded-xl border border-dashed border-neutral-300 bg-neutral-50 p-8 text-center text-sm text-neutral-500 ${className}`}
    >
      {icon ? <div className="mb-2 flex justify-center">{icon}</div> : null}
      {message}
    </div>
  );
}
