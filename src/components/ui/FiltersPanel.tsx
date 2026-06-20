"use client";

import { arraysEqual } from "@/lib/filters";

type FilterOption = {
  value: string;
  label: string;
};

export type FilterGroup = {
  label: string;
  options: FilterOption[];
  selected: string[];
  onToggle: (value: string) => void;
  mode?: "multiple" | "single";
  defaultValue?: string;
  defaultSelected?: string[];
};

type FiltersPanelProps = {
  title: string;
  groups: FilterGroup[];
  onClear: () => void;
};

export function FiltersPanel({ title, groups, onClear }: FiltersPanelProps) {
  const visibleGroups = groups.filter((group) => group.options.length > 0);
  const hasActiveFilters = visibleGroups.some((group) => {
    if (group.mode === "single") {
      const selected = group.selected[0];
      return (
        selected !== undefined &&
        (group.defaultValue === undefined || selected !== group.defaultValue)
      );
    }

    return (
      group.defaultSelected === undefined ||
      !arraysEqual(group.selected, group.defaultSelected)
    );
  });

  if (visibleGroups.length === 0) return null;

  return (
    <div className="space-y-spacing-3">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
          {title}
        </p>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={onClear}
            className="text-xs font-medium text-brand hover:text-brand-hover"
          >
            Clear
          </button>
        )}
      </div>

      {visibleGroups.map((group) => (
        <div key={group.label}>
          <p className="mb-spacing-2 text-xs text-text-tertiary">{group.label}</p>
          <div className="flex flex-wrap gap-spacing-2">
            {group.options.map((option) => {
              const selected = group.selected.includes(option.value);

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    if (group.mode === "single") {
                      if (!selected) {
                        group.onToggle(option.value);
                      }
                      return;
                    }

                    group.onToggle(option.value);
                  }}
                  aria-pressed={selected}
                  className="rounded-radius-full border border-border-subtle px-spacing-3 py-spacing-1 text-sm text-text-secondary transition-colors hover:border-border-focus hover:bg-surface-hover data-[selected=true]:border-border-focus data-[selected=true]:bg-brand-muted data-[selected=true]:text-brand"
                  data-selected={selected || undefined}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
