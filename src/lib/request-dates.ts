import type { ActivityEntry } from "@/lib/types";
import { formatRequestedActivityMessage } from "@/lib/format";

export function getLastUpdatedAt(request: {
  activity: ActivityEntry[];
  updatedAt: string;
}): string {
  if (request.activity.length === 0) {
    return request.updatedAt;
  }

  return request.activity.reduce((latest, entry) => {
    return new Date(entry.timestamp) > new Date(latest)
      ? entry.timestamp
      : latest;
  }, request.activity[0].timestamp);
}

export function getActivityDisplayEntries(request: {
  activity: ActivityEntry[];
  requested: string;
  source?: string;
  updatedAt: string;
}): ActivityEntry[] {
  if (request.activity.length > 0) {
    return request.activity;
  }

  return [
    {
      id: "requested",
      timestamp: request.requested,
      message: formatRequestedActivityMessage(request.source),
    },
    {
      id: "last-updated",
      timestamp: getLastUpdatedAt(request),
      message: "Last updated",
    },
  ];
}
