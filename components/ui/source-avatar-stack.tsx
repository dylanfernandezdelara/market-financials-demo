type SourceAvatarStackProps = {
  count?: number;
  variant?: "overlap" | "spaced";
};

const colors = ["bg-neutral-200", "bg-neutral-300", "bg-neutral-200"];

export function SourceAvatarStack({
  count = 3,
  variant = "overlap",
}: SourceAvatarStackProps) {
  const isOverlap = variant === "overlap";

  return (
    <div className={`flex ${isOverlap ? "-space-x-1" : "gap-1"}`} aria-hidden>
      {Array.from({ length: count }, (_, i) => (
        <span
          key={i}
          className={`inline-block size-5 rounded-full ${
            isOverlap
              ? "border border-white bg-gradient-to-br from-neutral-200 to-neutral-300"
              : colors[i % colors.length]
          }`}
        />
      ))}
    </div>
  );
}
