"use client";

type SegmentedControlItem<K extends string> = {
  key: K;
  label: string;
};

type SegmentedControlProps<K extends string> = {
  items: SegmentedControlItem<K>[];
  value: K;
  onValueChange: (value: K) => void;
  variant?: "pill" | "underline";
  ariaLabel?: string;
};

const pillContainerClass =
  "inline-flex rounded-full border border-neutral-200 bg-neutral-100/80 p-0.5";
const underlineContainerClass =
  "flex flex-wrap gap-1 border-b border-[#ebebeb]";

function pillButtonClass(active: boolean) {
  return `rounded-full px-3 py-1.5 text-[13px] font-medium transition-colors ${
    active
      ? "bg-white text-neutral-900 shadow-sm"
      : "text-neutral-600 hover:text-neutral-900"
  }`;
}

function underlineButtonClass(active: boolean) {
  return `relative px-3 pb-2.5 pt-1 text-[13px] font-medium transition-colors ${
    active ? "text-[#1a1a1a]" : "text-neutral-500 hover:text-neutral-800"
  }`;
}

export function SegmentedControl<K extends string>({
  items,
  value,
  onValueChange,
  variant = "pill",
  ariaLabel,
}: SegmentedControlProps<K>) {
  const isPill = variant === "pill";

  return (
    <div
      className={isPill ? pillContainerClass : underlineContainerClass}
      role="tablist"
      aria-label={ariaLabel}
    >
      {items.map((item) => {
        const active = value === item.key;
        return (
          <button
            key={item.key}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onValueChange(item.key)}
            className={
              isPill ? pillButtonClass(active) : underlineButtonClass(active)
            }
          >
            {item.label}
            {!isPill && active ? (
              <span className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full bg-[#1a1a1a]" />
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
