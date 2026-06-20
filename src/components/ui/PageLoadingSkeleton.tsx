export function PageLoadingSkeleton() {
  return (
    <div className="space-y-spacing-8">
      <div className="max-w-xl space-y-spacing-2">
        <div className="flex items-center gap-spacing-2">
          <h1 className="text-xl font-semibold tracking-tight text-text-primary">
            Loading your information
          </h1>
          <span
            className="inline-flex gap-1"
            aria-hidden="true"
          >
            {[0, 1, 2].map((dot) => (
              <span
                key={dot}
                className="size-1.5 animate-pulse rounded-radius-full bg-brand"
                style={{ animationDelay: `${dot * 180}ms` }}
              />
            ))}
          </span>
        </div>
        <p className="text-base text-text-secondary">
          Thank you for using AndCo. Built in Seattle Summer!
        </p>
      </div>

      <div className="animate-pulse space-y-spacing-6">
        <div className="flex gap-spacing-3">
          <div className="h-spacing-10 flex-1 rounded-radius-lg bg-surface-muted" />
          <div className="h-spacing-10 w-48 rounded-radius-lg bg-surface-muted" />
          <div className="h-spacing-10 w-24 rounded-radius-lg bg-surface-muted" />
        </div>

        <div className="overflow-hidden rounded-radius-xl border border-border bg-surface">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="flex items-center gap-spacing-4 border-b border-border-subtle px-spacing-6 py-spacing-4 last:border-b-0"
            >
              <div className="h-spacing-4 w-16 rounded-radius-sm bg-surface-muted" />
              <div className="flex-1 space-y-spacing-2">
                <div className="h-spacing-4 w-40 rounded-radius-sm bg-surface-muted" />
                <div className="h-spacing-3 w-56 rounded-radius-sm bg-surface-muted" />
              </div>
              <div className="h-spacing-6 w-20 rounded-radius-full bg-surface-muted" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
