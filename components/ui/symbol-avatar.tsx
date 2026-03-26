type SymbolAvatarProps = {
  symbol: string;
  size?: "sm" | "md";
};

const sizeClasses: Record<SymbolAvatarProps["size"] & string, string> = {
  sm: "size-9 text-xs text-neutral-700",
  md: "size-10 text-sm text-neutral-800",
};

export function SymbolAvatar({ symbol, size = "sm" }: SymbolAvatarProps) {
  return (
    <span
      className={`flex shrink-0 items-center justify-center rounded-md bg-neutral-100 font-semibold ${sizeClasses[size]}`}
    >
      {symbol.slice(0, 1)}
    </span>
  );
}
