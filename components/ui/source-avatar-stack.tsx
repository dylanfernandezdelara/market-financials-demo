type SourceAvatarStackProps = {
  count?: number;
};

export function SourceAvatarStack({ count = 3 }: SourceAvatarStackProps) {
  return (
    <div className="flex -space-x-1" aria-hidden>
      {Array.from({ length: count }, (_, i) => (
        <span
          key={i}
          className="inline-block size-5 rounded-full border border-white bg-gradient-to-br from-neutral-200 to-neutral-300"
        />
      ))}
    </div>
  );
}
