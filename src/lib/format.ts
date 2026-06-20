const MS_PER_DAY = 1000 * 60 * 60 * 24;

type ReferenceDate = string | Date;

function toUtcDay(date: Date): number {
  return Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
}

function resolveReferenceDate(referenceDate?: ReferenceDate): Date {
  return referenceDate ? new Date(referenceDate) : new Date();
}

export function daysSince(iso: string, referenceDate?: ReferenceDate): number {
  const then = toUtcDay(new Date(iso));
  const now = toUtcDay(resolveReferenceDate(referenceDate));
  return Math.max(0, Math.floor((now - then) / MS_PER_DAY));
}

export function daysUntil(iso: string, referenceDate?: ReferenceDate): number {
  const due = toUtcDay(new Date(iso));
  const now = toUtcDay(resolveReferenceDate(referenceDate));
  return Math.floor((due - now) / MS_PER_DAY);
}

export function formatDaysSinceRequested(
  iso: string,
  referenceDate?: ReferenceDate,
): string {
  const days = daysSince(iso, referenceDate);
  if (days === 0) return "Today";
  return `${days} day${days === 1 ? "" : "s"}`;
}

export function formatDaysUntilDue(
  iso: string,
  referenceDate?: ReferenceDate,
): string {
  const days = daysUntil(iso, referenceDate);
  if (days === 0) return "Due today";
  if (days < 0) {
    const overdue = Math.abs(days);
    return `${overdue} day${overdue === 1 ? "" : "s"} overdue`;
  }
  return `${days} day${days === 1 ? "" : "s"}`;
}

export type DueDateUrgency = "critical" | "warning" | "default";

export function getDueDateUrgency(
  dueAt: string,
  referenceDate?: ReferenceDate,
): DueDateUrgency {
  const days = daysUntil(dueAt, referenceDate);
  if (days >= 0) {
    return "default";
  }

  const overdue = Math.abs(days);
  if (overdue >= 50) {
    return "critical";
  }
  if (overdue >= 10) {
    return "warning";
  }

  return "default";
}

export function getDueDateTextClass(urgency: DueDateUrgency): string {
  switch (urgency) {
    case "critical":
      return "text-pill-action-text";
    case "warning":
      return "text-status-partial-text";
    default:
      return "text-text-secondary";
  }
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
