import { ReactNode } from "react";

type SurfaceCardProps = {
  children: ReactNode;
  className?: string;
};

export function SurfaceCard({ children, className = "" }: SurfaceCardProps) {
  return (
    <section
      className={`relative overflow-hidden rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm ${className}`}
    >
      {children}
    </section>
  );
}
