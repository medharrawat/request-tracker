import type { Request } from "@/lib/types";
import { formatRequestedActivityMessage } from "@/lib/format";

export type NewRequestInput = {
  documentType: string;
  category: string;
  source: string;
  assignee: string;
  dueAt: string;
};

export function createRequestFromInput(input: NewRequestInput): Request {
  const now = new Date().toISOString();
  const id = `req_${Date.now()}`;
  const source = input.source.trim() || undefined;

  return {
    id,
    displayName: input.documentType.trim(),
    documentType: input.documentType.trim(),
    category: input.category,
    source,
    assignee: input.assignee,
    requested: now,
    dueAt: input.dueAt ? `${input.dueAt}T12:00:00.000Z` : now,
    updatedAt: now,
    status: "requested",
    activity: [
      {
        id: `${id}-act-0`,
        timestamp: now,
        message: formatRequestedActivityMessage(source),
      },
    ],
  };
}
