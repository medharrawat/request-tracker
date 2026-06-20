export type RequestStatus =
  | "requested"
  | "in_progress"
  | "needs_action"
  | "partially_received"
  | "received"
  | "rejected"
  | "on_hold"
  | "draft"
  | "canceled"
  | "open"
  | "completed"
  | "invite_sent"
  | "expired"
  | "scheduled";

export type ManageAction = "add_note" | "follow_up" | "mark_received";

export type ActivityEntry = {
  id: string;
  timestamp: string;
  message: string;
  actor?: string;
};

export type Request = {
  id: string;
  displayName?: string;
  category: string;
  documentType: string;
  source?: string;
  assignee: string;
  requested: string;
  dueAt: string;
  updatedAt: string;
  pagesReceived?: number;
  pagesExpected?: number;
  activity: ActivityEntry[];
  status: RequestStatus;
  needsAction?: boolean;
  needsActionMessage?: string;
  time?: string;
};

export type Case = {
  id: string;
  title: string;
  clientName?: string;
  matterType?: string;
  dateOfIncident?: string;
  openedAt?: string;
  assignees: string[];
  requests: Request[];
  scheduledDate?: string;
  scheduledTime?: string;
  status?: RequestStatus;
  hideStatusBadge?: boolean;
};

export type CaseGroup = {
  label: string;
  cases: Case[];
};
