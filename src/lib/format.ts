const MS_PER_DAY = 1000 * 60 * 60 * 24;

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function daysSince(iso: string): number {
  const then = startOfDay(new Date(iso));
  const now = startOfDay(new Date());
  return Math.max(0, Math.floor((now.getTime() - then.getTime()) / MS_PER_DAY));
}

export function daysUntil(iso: string): number {
  const due = startOfDay(new Date(iso));
  const now = startOfDay(new Date());
  return Math.floor((due.getTime() - now.getTime()) / MS_PER_DAY);
}

export function formatDaysSinceRequested(iso: string): string {
  const days = daysSince(iso);
  if (days === 0) return "Today";
  return `${days} day${days === 1 ? "" : "s"}`;
}

export function formatDaysUntilDue(iso: string): string {
  const days = daysUntil(iso);
  if (days === 0) return "Due today";
  if (days < 0) {
    const overdue = Math.abs(days);
    return `${overdue} day${overdue === 1 ? "" : "s"} overdue`;
  }
  return `${days} day${days === 1 ? "" : "s"}`;
}

export function formatRequestedActivityMessage(source?: string): string {
  if (source) {
    return `Requested from ${source}`;
  }
  return "Requested";
}

export function formatPagesProgress(
  pagesReceived?: number,
  pagesExpected?: number,
): string | null {
  if (pagesReceived === undefined || pagesExpected === undefined) {
    return null;
  }

  return `${pagesReceived}/${pagesExpected} pages`;
}

export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(iso));
}

export function formatRelativeTime(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const hours = Math.floor(diffMs / (1000 * 60 * 60));

  if (hours < 1) return "sent just now";
  if (hours < 24) return `sent about ${hours} hour${hours === 1 ? "" : "s"} ago`;

  const days = Math.floor(hours / 24);
  return `sent ${days} day${days === 1 ? "" : "s"} ago`;
}
