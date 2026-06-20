"use client";

type SegmentedControlProps = {
  options: string[];
  value: string;
  onChange: (value: string) => void;
};

export function SegmentedControl({
  options,
  value,
  onChange,
}: SegmentedControlProps) {
  return (
    <div
      role="tablist"
      className="inline-flex items-center rounded-radius-lg border border-border bg-surface p-spacing-1"
    >
      {options.map((option) => {
        const isActive = option === value;

        return (
          <button
            key={option}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(option)}
            className={`flex h-button-sm items-center rounded-radius-md px-spacing-4 text-sm font-medium transition-colors ${
              isActive
                ? "bg-pill-default-bg text-pill-default-text shadow-segment"
                : "text-text-secondary hover:text-text-primary"
            }`}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}
