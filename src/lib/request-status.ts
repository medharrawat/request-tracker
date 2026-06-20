import type { Case, RequestStatus } from "@/lib/types";

type StatusStyle = {
  className: string;
  label: string;
  icon?: boolean;
};

export const REQUEST_STATUSES = [
  "requested",
  "in_progress",
  "needs_action",
  "partially_received",
  "received",
  "rejected",
  "on_hold",
  "draft",
  "canceled",
  "open",
  "completed",
  "invite_sent",
  "expired",
  "scheduled",
] as const satisfies readonly RequestStatus[];

const REQUEST_STATUS_SET = new Set<string>(REQUEST_STATUSES);

export const OPEN_REQUEST_STATUSES = [
  "requested",
  "in_progress",
  "needs_action",
  "partially_received",
  "on_hold",
  "draft",
  "rejected",
  "open",
  "invite_sent",
  "scheduled",
  "expired",
] as const satisfies readonly RequestStatus[];

export const CLOSED_REQUEST_STATUSES = [
  "completed",
  "received",
  "canceled",
] as const satisfies readonly RequestStatus[];

export const OPEN_CASE_STATUSES = OPEN_REQUEST_STATUSES;
export const CLOSED_CASE_STATUSES = CLOSED_REQUEST_STATUSES;

export function isRequestStatus(value: string): value is RequestStatus {
  return REQUEST_STATUS_SET.has(value);
}

export function parseRequestStatus(status: string): RequestStatus {
  if (isRequestStatus(status)) {
    return status;
  }

  throw new Error(`Unknown request status: ${status}`);
}

export function isOpenRequestStatus(status: RequestStatus): boolean {
  return (OPEN_REQUEST_STATUSES as readonly RequestStatus[]).includes(status);
}

export function isOpenCaseStatus(status: RequestStatus): boolean {
  return (OPEN_CASE_STATUSES as readonly RequestStatus[]).includes(status);
}

export function isClosedCaseStatus(status: RequestStatus): boolean {
  return (CLOSED_CASE_STATUSES as readonly RequestStatus[]).includes(status);
}

export function deriveCaseStatus(requests: { status: RequestStatus }[]): RequestStatus {
  if (requests.length === 0) {
    return "open";
  }

  if (requests.some((request) => isOpenRequestStatus(request.status))) {
    return "open";
  }

  return "received";
}

export function getCaseBlockedCount(caseItem: Case): number {
  return caseItem.requests.filter((request) => request.needsAction).length;
}

export const requestStatusConfig: Record<RequestStatus | "urgent", StatusStyle> =
  {
    requested: {
      className: "bg-status-requested-bg text-status-requested-text",
      label: "Requested",
    },
    in_progress: {
      className: "bg-status-in-progress-bg text-status-in-progress-text",
      label: "In progress",
    },
    needs_action: {
      className: "bg-status-needs-action-bg text-status-needs-action-text",
      label: "Needs action",
    },
    partially_received: {
      className: "bg-status-partial-bg text-status-partial-text",
      label: "Partially received",
    },
    received: {
      className: "bg-status-received-bg text-status-received-text",
      label: "Received",
    },
    rejected: {
      className: "bg-status-rejected-bg text-status-rejected-text",
      label: "Rejected",
    },
    on_hold: {
      className: "bg-status-on-hold-bg text-status-on-hold-text",
      label: "On hold",
    },
    draft: {
      className: "bg-status-draft-bg text-status-draft-text",
      label: "Draft",
    },
    canceled: {
      className: "bg-status-canceled-bg text-status-canceled-text",
      label: "Canceled",
    },
    open: {
      className: "bg-status-open-bg text-status-open-text",
      label: "Open",
    },
    scheduled: {
      className: "bg-status-scheduled-bg text-status-scheduled-text",
      label: "Scheduled",
    },
    completed: {
      className: "bg-status-completed-bg text-status-completed-text",
      label: "Completed",
    },
    invite_sent: {
      className: "bg-status-invite-bg text-status-invite-text",
      label: "Invite sent",
    },
    expired: {
      className: "bg-status-expired-bg text-status-expired-text",
      label: "Expired",
      icon: true,
    },
    urgent: {
      className: "bg-status-needs-action-bg text-status-needs-action-text",
      label: "Action required",
    },
  };

export function getStatusLabel(status: RequestStatus): string {
  return requestStatusConfig[status]?.label ?? status;
}
