import type { Case, Request, RequestStatus } from "@/lib/types";
import { getCaseBlockedCount } from "@/lib/request-status";

export type RequestSortOrder = "oldest" | "newest" | "due_soonest";

export type CaseSortOrder = "most_blocked" | "recently_created";

export const DEFAULT_REQUEST_SORT_ORDER: RequestSortOrder = "due_soonest";

export const DEFAULT_CASE_SORT_ORDER: CaseSortOrder = "most_blocked";

export const DEFAULT_EXCLUDED_REQUEST_STATUSES: RequestStatus[] = [
  "canceled",
  "received",
];

function toggleValue(values: string[], value: string): string[] {
  return values.includes(value)
    ? values.filter((item) => item !== value)
    : [...values, value];
}

export function getDefaultSelectedStatuses(
  statuses: RequestStatus[],
): RequestStatus[] {
  return statuses.filter(
    (status) =>
      !DEFAULT_EXCLUDED_REQUEST_STATUSES.includes(status) &&
      status !== "needs_action",
  );
}

export function matchesStatusFilter(
  status: RequestStatus,
  selectedStatuses: RequestStatus[],
): boolean {
  return selectedStatuses.includes(status);
}

export function arraysEqual(a: string[], b: string[]): boolean {
  if (a.length !== b.length) return false;
  const sortedA = [...a].sort();
  const sortedB = [...b].sort();
  return sortedA.every((value, index) => value === sortedB[index]);
}

function sortCases(
  cases: Case[],
  order: CaseSortOrder = DEFAULT_CASE_SORT_ORDER,
): Case[] {
  return [...cases].sort((a, b) => {
    switch (order) {
      case "recently_created":
        return (
          new Date(b.openedAt ?? 0).getTime() -
          new Date(a.openedAt ?? 0).getTime()
        );
      case "most_blocked":
      default: {
        const blockedDiff =
          getCaseBlockedCount(b) - getCaseBlockedCount(a);
        if (blockedDiff !== 0) return blockedDiff;
        return (
          new Date(b.openedAt ?? 0).getTime() -
          new Date(a.openedAt ?? 0).getTime()
        );
      }
    }
  });
}

function sortRequests(
  requests: Request[],
  order: RequestSortOrder = DEFAULT_REQUEST_SORT_ORDER,
): Request[] {
  return [...requests].sort((a, b) => {
    switch (order) {
      case "newest":
        return new Date(b.requested).getTime() - new Date(a.requested).getTime();
      case "due_soonest":
        return new Date(a.dueAt).getTime() - new Date(b.dueAt).getTime();
      case "oldest":
      default:
        return new Date(a.requested).getTime() - new Date(b.requested).getTime();
    }
  });
}

export { toggleValue, sortRequests, sortCases };
