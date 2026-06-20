"use client";

import type { ActivityEntry } from "@/lib/types";
import { formatDate } from "@/lib/format";
import { TableHeader } from "@/components/ui/TableHeader";
import { ACTIVITY_ROW_GRID_CLASS } from "@/lib/layout";

type ActivityHistoryProps = {
  entries: ActivityEntry[];
};

export function ActivityHistory({ entries }: ActivityHistoryProps) {
  return (
    <div className="border-t border-border-subtle bg-surface">
      <TableHeader className={`${ACTIVITY_ROW_GRID_CLASS} border-b-0`}>
        <span className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
          Date
        </span>
        <span className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
          Activity
        </span>
      </TableHeader>
      {entries.map((entry) => (
        <div
          key={entry.id}
          className={`${ACTIVITY_ROW_GRID_CLASS} border-b border-border-subtle px-spacing-6 py-spacing-3 last:border-b-0`}
        >
          <span className="text-sm text-text-secondary">
            {formatDate(entry.timestamp)}
          </span>
          <span className="text-sm text-text-primary">
            {entry.message}
            {entry.actor ? (
              <span className="text-text-tertiary"> · {entry.actor}</span>
            ) : null}
          </span>
        </div>
      ))}
    </div>
  );
}
