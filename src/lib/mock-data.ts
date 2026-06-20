import type { Case, CaseGroup, Request } from "./types";
import { deriveCaseStatus, parseRequestStatus } from "./request-status";
import caseDocuments from "../../case-documents.json";

type RawActivity = { at: string; text: string };

type RawRequest = {
  id: string;
  category: string;
  document_type: string;
  source: string;
  status: string;
  assignee: string;
  requested_at: string | null;
  due_at: string | null;
  updated_at: string;
  action_required?: string;
  reason?: string;
  pages_received?: number;
  pages_expected?: number;
  activity?: RawActivity[];
};

type RawCaseDocuments = {
  case: {
    id: string;
    matter_name: string;
    client_name: string;
    matter_type: string;
    date_of_incident: string;
    assigned_paralegal: string;
    opened_at: string;
  };
  requests: RawRequest[];
};

const raw = caseDocuments as RawCaseDocuments;

function toIsoDate(date: string | null, fallback = ""): string {
  if (!date) return fallback;
  return date + "T12:00:00.000Z";
}

function mapRequest(rawRequest: RawRequest): Request {
  const status = parseRequestStatus(rawRequest.status);
  const needsAction =
    status === "needs_action" || Boolean(rawRequest.action_required);

  return {
    id: rawRequest.id,
    displayName: rawRequest.document_type,
    category: rawRequest.category,
    documentType: rawRequest.document_type,
    source: rawRequest.source,
    assignee: rawRequest.assignee,
    requested: toIsoDate(rawRequest.requested_at, rawRequest.updated_at),
    dueAt: toIsoDate(rawRequest.due_at, rawRequest.updated_at),
    updatedAt: toIsoDate(rawRequest.updated_at),
    pagesReceived: rawRequest.pages_received,
    pagesExpected: rawRequest.pages_expected,
    status,
    needsAction,
    needsActionMessage: rawRequest.action_required ?? rawRequest.reason,
    activity: (rawRequest.activity ?? []).map((entry, index) => ({
      id: rawRequest.id + "-act-" + index,
      timestamp: toIsoDate(entry.at),
      message: entry.text,
    })),
  };
}

function formatOpenedLabel(openedAt: string): string {
  const date = new Date(openedAt + "T12:00:00");
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
  }).format(date);
}

function buildCase(): Case {
  const { case: caseInfo, requests } = raw;
  const mappedRequests = requests.map(mapRequest);

  return {
    id: caseInfo.id,
    title: caseInfo.matter_name,
    clientName: caseInfo.client_name,
    matterType: caseInfo.matter_type,
    dateOfIncident: caseInfo.date_of_incident,
    openedAt: caseInfo.opened_at,
    assignees: [caseInfo.assigned_paralegal, caseInfo.client_name],
    scheduledDate: caseInfo.opened_at,
    requests: mappedRequests,
    status: deriveCaseStatus(mappedRequests),
  };
}

const delgadoCase = buildCase();

const nguyenCase: Case = {
  id: "case_b3c1",
  title: "Nguyen v. Bay Area Transit",
  clientName: "Lin Nguyen",
  matterType: "Personal Injury",
  dateOfIncident: "2026-06-10",
  openedAt: "2026-06-19",
  assignees: ["Jordan Reyes", "Lin Nguyen"],
  scheduledDate: "2026-06-19",
  requests: [],
  status: "open",
};

export const mockCases: CaseGroup[] = [
  {
    label: formatOpenedLabel("2026-06-19"),
    cases: [nguyenCase],
  },
  {
    label: formatOpenedLabel(raw.case.opened_at),
    cases: [delgadoCase],
  },
];

export function getAllOpenCases(): Case[] {
  return mockCases.flatMap((group) => group.cases);
}

export function getCaseById(id: string): Case | undefined {
  return getAllOpenCases().find((c) => c.id === id);
}

export async function fetchCaseGroups(): Promise<CaseGroup[]> {
  await new Promise((resolve) => setTimeout(resolve, 600));
  return mockCases;
}

export async function fetchCase(id: string): Promise<Case | null> {
  await new Promise((resolve) => setTimeout(resolve, 600));
  return getCaseById(id) ?? null;
}
