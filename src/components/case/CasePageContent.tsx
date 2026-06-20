"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ChevronLeft, Plus } from "lucide-react";
import type { Case, ManageAction, Request, RequestStatus } from "@/lib/types";
import {
  applyManageAction,
  type ManageActionPayload,
} from "@/lib/manage-actions";
import { FilterBar } from "@/components/ui/FilterBar";
import { FiltersPanel } from "@/components/ui/FiltersPanel";
import { TableHeader } from "@/components/ui/TableHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { NewRequestModal } from "@/components/case/NewRequestModal";
import { RequestRow } from "@/components/request/RequestRow";
import {
  createRequestFromInput,
  type NewRequestInput,
} from "@/lib/create-request";
import {
  arraysEqual,
  DEFAULT_REQUEST_SORT_ORDER,
  getDefaultSelectedStatuses,
  matchesStatusFilter,
  sortRequests,
  toggleValue,
  type RequestSortOrder,
} from "@/lib/filters";
import { getStatusLabel } from "@/lib/request-status";
import { formatDate } from "@/lib/format";
import {
  BLOCKED_REQUEST_TABLE_HEADER_CLASS,
  CASE_REQUEST_TABLE_HEADER_CLASS,
  TABLE_HEADER_CELL_CLASS,
} from "@/lib/layout";

type CasePageContentProps = {
  caseData: Case;
  referenceDate: string;
};

function collectCaseStatusOptions(requests: Request[]): RequestStatus[] {
  const statuses = new Set<RequestStatus>();
  for (const request of requests) {
    if (request.needsAction || request.status === "needs_action") {
      continue;
    }
    statuses.add(request.status);
  }
  return [...statuses].sort((a, b) =>
    getStatusLabel(a).localeCompare(getStatusLabel(b)),
  );
}

export function CasePageContent({
  caseData,
  referenceDate,
}: CasePageContentProps) {
  const [search, setSearch] = useState("");
  const [selectedAssignees, setSelectedAssignees] = useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<RequestStatus[]>(() =>
    getDefaultSelectedStatuses(collectCaseStatusOptions(caseData.requests)),
  );
  const [sortOrder, setSortOrder] = useState<RequestSortOrder>(
    DEFAULT_REQUEST_SORT_ORDER,
  );
  const [requests, setRequests] = useState(caseData.requests);
  const [newRequestOpen, setNewRequestOpen] = useState(false);

  const assigneeOptions = useMemo(() => {
    const assignees = new Set<string>(caseData.assignees);
    for (const request of requests) {
      assignees.add(request.assignee);
    }
    return [...assignees].sort();
  }, [caseData.assignees, requests]);

  const statusOptions = useMemo(
    () => collectCaseStatusOptions(requests),
    [requests],
  );

  const defaultSelectedStatuses = useMemo(
    () => getDefaultSelectedStatuses(statusOptions),
    [statusOptions],
  );

  const statusFilters =
    selectedStatuses.length > 0 ? selectedStatuses : defaultSelectedStatuses;

  const blockedRequests = useMemo(() => {
    const blocked = requests.filter((req) => req.needsAction);
    const filtered = blocked.filter(
      (request) =>
        selectedAssignees.length === 0 ||
        selectedAssignees.includes(request.assignee),
    );
    return sortRequests(filtered, sortOrder);
  }, [requests, selectedAssignees, sortOrder]);

  const generalRequests = useMemo(
    () => requests.filter((req) => !req.needsAction),
    [requests],
  );

  const filteredGeneral = useMemo(() => {
    const filtered = filterRequests(
      generalRequests,
      search,
      selectedAssignees,
      statusFilters,
    );
    return sortRequests(filtered, sortOrder);
  }, [generalRequests, search, selectedAssignees, statusFilters, sortOrder]);

  const defaultAssignee = caseData.assignees[0];

  function toggleAssignee(assignee: string) {
    setSelectedAssignees((current) => toggleValue(current, assignee));
  }

  function toggleStatus(status: RequestStatus) {
    setSelectedStatuses((current) =>
      toggleValue(current, status) as RequestStatus[],
    );
  }

  function handleManageAction(
    requestId: string,
    action: ManageAction,
    payload: ManageActionPayload[ManageAction],
  ) {
    setRequests((current) =>
      current.map((request) =>
        request.id === requestId
          ? applyManageAction(request, action, payload)
          : request,
      ),
    );
  }

  function handleCreateRequest(input: NewRequestInput) {
    setRequests((current) => {
      const next = [...current, createRequestFromInput(input)];
      if (current.length === 0) {
        setSelectedStatuses(
          getDefaultSelectedStatuses(collectCaseStatusOptions(next)),
        );
      }
      return next;
    });
  }

  function openNewRequestModal() {
    setNewRequestOpen(true);
  }

  return (
    <div className="space-y-spacing-6">
      <CaseHeader caseData={caseData} onNewRequest={openNewRequestModal} />

      {requests.length === 0 ? (
        <EmptyState
          title="No requests yet"
          description="Add a request to start tracking documents for this case, or close the case if nothing is outstanding."
          primaryAction={{
            label: "Add request",
            onClick: openNewRequestModal,
          }}
          secondaryAction={{ label: "Close case" }}
        />
      ) : (
        <>
          {blockedRequests.length > 0 && (
            <section>
              <div className="rounded-radius-xl border border-border">
                <CaseRequestTableHeader layout="blocked" />
                {blockedRequests.map((request) => (
                  <RequestRow
                    key={request.id}
                    request={request}
                    variant="case-blocked"
                    referenceDate={referenceDate}
                    onManageAction={(action, payload) =>
                      handleManageAction(request.id, action, payload)
                    }
                  />
                ))}
              </div>
            </section>
          )}

          <FilterBar
            searchPlaceholder="Search all requests"
            searchValue={search}
            onSearchChange={setSearch}
            hasActiveFilters={
              selectedAssignees.length > 0 ||
              !arraysEqual(selectedStatuses, defaultSelectedStatuses) ||
              sortOrder !== DEFAULT_REQUEST_SORT_ORDER
            }
            filterPanel={
              <FiltersPanel
                title="Filter requests"
                groups={[
                  {
                    label: "Sort by",
                    mode: "single",
                    defaultValue: DEFAULT_REQUEST_SORT_ORDER,
                    options: [
                      { value: "oldest", label: "Oldest requested" },
                      { value: "newest", label: "Newest requested" },
                      { value: "due_soonest", label: "Due soonest" },
                    ],
                    selected: [sortOrder],
                    onToggle: (value) =>
                      setSortOrder(value as RequestSortOrder),
                  },
                  {
                    label: "Status",
                    options: statusOptions.map((status) => ({
                      value: status,
                      label: getStatusLabel(status),
                    })),
                    selected: selectedStatuses,
                    defaultSelected: defaultSelectedStatuses,
                    onToggle: (value) => toggleStatus(value as RequestStatus),
                  },
                  {
                    label: "Assignee",
                    options: assigneeOptions.map((assignee) => ({
                      value: assignee,
                      label: assignee,
                    })),
                    selected: selectedAssignees,
                    onToggle: toggleAssignee,
                  },
                ]}
                onClear={() => {
                  setSelectedAssignees([]);
                  setSelectedStatuses(defaultSelectedStatuses);
                  setSortOrder(DEFAULT_REQUEST_SORT_ORDER);
                }}
              />
            }
          />

          <section>
            <div className="rounded-radius-xl border border-border">
              <CaseRequestTableHeader />

              {filteredGeneral.length === 0 ? (
                <div className="rounded-b-radius-xl px-spacing-6 py-spacing-12 text-center">
                  <p className="text-sm text-text-secondary">
                    No requests match your filters.
                  </p>
                </div>
              ) : (
                filteredGeneral.map((request) => (
                  <RequestRow
                    key={request.id}
                    request={request}
                    variant="case-list"
                    referenceDate={referenceDate}
                    onManageAction={(action, payload) =>
                      handleManageAction(request.id, action, payload)
                    }
                  />
                ))
              )}
            </div>
          </section>
        </>
      )}

      <NewRequestModal
        open={newRequestOpen}
        assigneeOptions={assigneeOptions}
        defaultAssignee={defaultAssignee}
        onClose={() => setNewRequestOpen(false)}
        onSubmit={handleCreateRequest}
      />
    </div>
  );
}

function CaseRequestTableHeader({
  layout = "full",
}: {
  layout?: "full" | "blocked";
}) {
  const headerClass =
    layout === "blocked"
      ? BLOCKED_REQUEST_TABLE_HEADER_CLASS
      : CASE_REQUEST_TABLE_HEADER_CLASS;

  return (
    <TableHeader className={`${headerClass} rounded-t-radius-xl`}>
      <span className={`${TABLE_HEADER_CELL_CLASS} min-w-0`}>
        {layout === "blocked" ? "Blocked Requests" : "Request"}
      </span>
      {layout === "full" && (
        <>
          <span className={`${TABLE_HEADER_CELL_CLASS} min-w-0`}>Due</span>
          <span className={`${TABLE_HEADER_CELL_CLASS} min-w-0`}>
            Assignee
          </span>
          <span className={`${TABLE_HEADER_CELL_CLASS} min-w-0`}>Status</span>
        </>
      )}
      <span aria-hidden="true" />
    </TableHeader>
  );
}

function CaseHeader({
  caseData,
  onNewRequest,
}: {
  caseData: Case;
  onNewRequest: () => void;
}) {
  const subtitleParts: string[] = [];

  if (caseData.matterType) {
    subtitleParts.push(caseData.matterType);
  }
  if (caseData.openedAt) {
    subtitleParts.push(`Opened ${formatCaseDate(caseData.openedAt)}`);
  }

  return (
    <div className="space-y-spacing-4">
      <Link
        href="/"
        className="inline-flex items-center gap-spacing-1 text-sm font-medium text-text-secondary transition-colors hover:text-text-primary"
      >
        <ChevronLeft className="size-spacing-4" aria-hidden="true" />
        Dashboard
      </Link>

      <header className="flex flex-wrap items-start justify-between gap-spacing-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-text-primary">
            {caseData.title}
          </h1>
          {subtitleParts.length > 0 && (
            <p className="mt-spacing-1 text-base text-text-secondary">
              {subtitleParts.join(" · ")}
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={onNewRequest}
          className="inline-flex h-button-md items-center gap-spacing-2 rounded-radius-md border border-border bg-surface px-spacing-4 text-sm font-medium text-text-primary hover:bg-surface-hover"
        >
          <Plus className="size-spacing-4" />
          New Request
        </button>
      </header>
    </div>
  );
}

function filterRequests(
  requests: Request[],
  search: string,
  selectedAssignees: string[],
  selectedStatuses: RequestStatus[],
): Request[] {
  const query = search.toLowerCase().trim();

  return requests.filter((request) => {
    const displayName = request.displayName ?? request.documentType;

    const matchesSearch =
      !query ||
      displayName.toLowerCase().includes(query) ||
      request.category.toLowerCase().includes(query) ||
      request.documentType.toLowerCase().includes(query) ||
      (request.source?.toLowerCase().includes(query) ?? false) ||
      request.assignee.toLowerCase().includes(query);

    const matchesAssignee =
      selectedAssignees.length === 0 ||
      selectedAssignees.includes(request.assignee);

    const matchesStatus = matchesStatusFilter(request.status, selectedStatuses);

    return matchesSearch && matchesAssignee && matchesStatus;
  });
}

function formatCaseDate(date: string) {
  return formatDate(`${date}T12:00:00.000Z`);
}
