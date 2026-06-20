"use client";

import type { ReactNode } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { SegmentedControl } from "@/components/ui/SegmentedControl";

type FilterBarProps = {
  searchPlaceholder: string;
  searchValue: string;
  onSearchChange: (value: string) => void;
  segments?: string[];
  activeSegment?: string;
  onSegmentChange?: (segment: string) => void;
  filterPanel?: ReactNode;
  hasActiveFilters?: boolean;
};

export function FilterBar({
  searchPlaceholder,
  searchValue,
  onSearchChange,
  segments,
  activeSegment,
  onSegmentChange,
  filterPanel,
  hasActiveFilters = false,
}: FilterBarProps) {
  const showSegments =
    segments && segments.length > 0 && activeSegment && onSegmentChange;

  return (
    <div className="flex flex-wrap items-center gap-spacing-2">
      <div className="flex h-button-md w-filter-search shrink-0 items-center gap-spacing-2 rounded-radius-md border border-border bg-surface px-spacing-3 focus-within:border-border-focus focus-within:ring-3 focus-within:ring-brand-muted">
        <Search className="size-spacing-4 shrink-0 text-text-secondary" />
        <input
          type="search"
          value={searchValue}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder={searchPlaceholder}
          aria-label={searchPlaceholder}
          className="min-w-0 flex-1 border-0 bg-transparent p-0 text-sm text-text-primary placeholder:text-text-secondary focus:outline-none"
        />
      </div>

      {filterPanel && (
        <div className="group/filter relative">
          <button
            type="button"
            aria-haspopup="true"
            className="inline-flex h-button-md items-center gap-spacing-2 rounded-radius-md border border-border bg-surface px-spacing-4 text-sm font-medium text-text-primary hover:border-border-focus hover:bg-surface-hover group-hover/filter:border-border-focus group-hover/filter:bg-brand-muted group-focus-within/filter:border-border-focus group-focus-within/filter:bg-brand-muted data-[active=true]:border-border-focus data-[active=true]:bg-brand-muted"
            data-active={hasActiveFilters || undefined}
          >
            <SlidersHorizontal className="size-spacing-4 text-text-secondary" />
            Filters
          </button>

          <div className="invisible absolute right-0 top-full z-dropdown pt-spacing-2 opacity-0 transition-opacity group-hover/filter:visible group-hover/filter:opacity-100 group-focus-within/filter:visible group-focus-within/filter:opacity-100">
            <div className="w-filter-panel rounded-radius-lg border border-border bg-surface p-spacing-4 shadow-dropdown">
              {filterPanel}
            </div>
          </div>
        </div>
      )}

      {showSegments && (
        <SegmentedControl
          options={segments}
          value={activeSegment}
          onChange={onSegmentChange}
        />
      )}
    </div>
  );
}
