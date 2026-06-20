import type { ActivityEntry, ManageAction, Request } from "@/lib/types";

export type ManageActionPayload = {
  add_note: { note: string };
  follow_up: { message: string };
  mark_received: Record<string, never>;
};

export function createActivityEntry(
  requestId: string,
  message: string,
  actor?: string,
): ActivityEntry {
  return {
    id: `${requestId}-act-${Date.now()}`,
    timestamp: new Date().toISOString(),
    message,
    actor,
  };
}

export function buildManageActivityMessage(
  action: ManageAction,
  payload: ManageActionPayload[ManageAction],
  request: Request,
): string {
  switch (action) {
    case "add_note":
      return (payload as ManageActionPayload["add_note"]).note;
    case "follow_up": {
      const message = (payload as ManageActionPayload["follow_up"]).message.trim();
      const target = request.source ?? request.assignee;
      return message
        ? `Follow-up sent to ${target}: ${message}`
        : `Follow-up sent to ${target}`;
    }
    case "mark_received":
      return "Request marked as received";
  }
}

export function applyManageAction(
  request: Request,
  action: ManageAction,
  payload: ManageActionPayload[ManageAction],
  actor?: string,
): Request {
  const message = buildManageActivityMessage(action, payload, request);
  const now = new Date().toISOString();
  const activity = [
    ...request.activity,
    createActivityEntry(request.id, message, actor ?? request.assignee),
  ];
  const withUpdate = { ...request, activity, updatedAt: now };

  switch (action) {
    case "add_note":
      return withUpdate;
    case "follow_up":
      return {
        ...withUpdate,
        status:
          request.status === "requested" || request.status === "draft"
            ? "in_progress"
            : request.status,
      };
    case "mark_received":
      return {
        ...withUpdate,
        status: "received",
        needsAction: false,
        needsActionMessage: undefined,
      };
  }
}
