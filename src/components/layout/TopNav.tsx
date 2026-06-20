import { Bell, Building2, ChevronDown, User } from "lucide-react";

export function TopNav() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border/60 bg-surface">
      <div className="flex h-topnav items-center justify-between gap-spacing-4 px-spacing-5">
        <span className="text-lg font-semibold tracking-tight text-text-primary">
          AndCo
        </span>

        <div className="flex items-center gap-spacing-2">
          <button
            type="button"
            className="inline-flex size-9 items-center justify-center rounded-radius-md text-text-secondary hover:bg-surface-hover hover:text-text-primary"
            aria-label="Notifications"
          >
            <Bell className="size-spacing-4" />
          </button>

          <button
            type="button"
            className="inline-flex h-9 max-w-topnav-org items-center gap-spacing-2 rounded-radius-md border border-border px-spacing-3 text-sm font-medium text-text-primary hover:bg-surface-hover"
          >
            <Building2 className="size-spacing-4 shrink-0 text-text-secondary" />
            <span className="truncate">Paralegal Or...</span>
            <ChevronDown className="size-spacing-3 shrink-0 text-text-secondary" />
          </button>

          <button
            type="button"
            className="inline-flex size-7 items-center justify-center rounded-radius-full text-text-primary hover:bg-surface-hover"
            aria-label="User profile"
          >
            <User className="size-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
}
