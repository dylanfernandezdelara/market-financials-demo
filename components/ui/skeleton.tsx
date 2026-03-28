import { CSSProperties } from "react";

type SkeletonProps = {
  className?: string;
  style?: CSSProperties;
};

export function Skeleton({ className = "", style }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse rounded-md bg-neutral-200/70 ${className}`}
      style={style}
    />
  );
}
