import { FilePlus, FolderX } from "lucide-react";

type EmptyStateProps = {
  title: string;
  description: string;
  primaryAction?: { label: string; onClick?: () => void };
  secondaryAction?: { label: string; onClick?: () => void };
};

export function EmptyState({
  title,
  description,
  primaryAction,
  secondaryAction,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-radius-lg border border-border bg-surface px-spacing-8 py-spacing-12 text-center shadow-card">
      <div className="mb-spacing-4 flex size-spacing-12 items-center justify-center rounded-radius-full bg-surface-muted">
        <FolderX className="size-spacing-6 text-text-secondary" />
      </div>

      <h3 className="text-lg font-semibold text-text-primary">{title}</h3>
      <p className="mt-spacing-2 max-w-prose text-base text-text-secondary">
        {description}
      </p>

      <div className="mt-spacing-6 flex flex-wrap items-center justify-center gap-spacing-3">
        {primaryAction && (
          <button
            type="button"
            onClick={primaryAction.onClick}
            className="inline-flex items-center gap-spacing-2 rounded-radius-md bg-brand px-spacing-5 py-spacing-3 text-md font-medium text-text-inverse hover:bg-brand-hover"
          >
            <FilePlus className="size-spacing-4" />
            {primaryAction.label}
          </button>
        )}
        {secondaryAction && (
          <button
            type="button"
            onClick={secondaryAction.onClick}
            className="inline-flex items-center gap-spacing-2 rounded-radius-md border border-border bg-surface px-spacing-5 py-spacing-3 text-md font-medium text-text-primary hover:bg-surface-hover"
          >
            {secondaryAction.label}
          </button>
        )}
      </div>
    </div>
  );
}
