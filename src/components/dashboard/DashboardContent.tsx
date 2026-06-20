"use client";

import { useMemo, useState } from "react";
import type { Case, CaseGroup, Request } from "@/lib/types";
import { FilterBar } from "@/components/ui/FilterBar";
import { FiltersPanel } from "@/components/ui/FiltersPanel";
import { TableHeader } from "@/components/ui/TableHeader";
import { RequestRow } from "@/components/request/RequestRow";
import {
  DEFAULT_CASE_SORT_ORDER,
  sortCases,
  toggleValue,
  type CaseSortOrder,
} from "@/lib/filters";
import {
  getCaseBlockedCount,
  isClosedCaseStatus,
  isOpenCaseStatus,
} from "@/lib/request-status";

type DashboardContentProps = {
  groups: CaseGroup[];
};

const SEGMENTS = ["Open", "Closed", "All"];

export function DashboardContent({ groups }: DashboardContentProps) {
  const [search, setSearch] = useState("");
  const [segment, setSegment] = useState("Open");
  const [selectedAssignees, setSelectedAssignees] = useState<string[]>([]);
  const [selectedMatterTypes, setSelectedMatterTypes] = useState<string[]>([]);
  const [sortOrder, setSortOrder] = useState<CaseSortOrder>(
    DEFAULT_CASE_SORT_ORDER,
  );

  const filterOptions = useMemo(() => {
    const assignees = new Set<string>();
    const matterTypes = new Set<string>();

    for (const group of groups) {
      for (const caseItem of group.cases) {
        caseItem.assignees.forEach((assignee) => assignees.add(assignee));
        if (caseItem.matterType) matterTypes.add(caseItem.matterType);
      }
    }

    return {
      assignees: [...assignees].sort(),
      matterTypes: [...matterTypes].sort(),
    };
  }, [groups]);

  const filteredCases = useMemo(() => {
    const query = search.toLowerCase().trim();

    const filtered = groups
      .flatMap((group) => group.cases)
      .filter((caseItem) => {
        const matchesSearch =
          !query ||
          caseItem.title.toLowerCase().includes(query) ||
          caseItem.clientName?.toLowerCase().includes(query) ||
          caseItem.matterType?.toLowerCase().includes(query) ||
          caseItem.assignees.some((a) => a.toLowerCase().includes(query)) ||
          caseItem.requests.some(
            (req) =>
              req.category.toLowerCase().includes(query) ||
              req.documentType.toLowerCase().includes(query) ||
              req.source?.toLowerCase().includes(query) ||
              req.assignee.toLowerCase().includes(query),
          );

        const status = caseItem.status ?? "open";

        const matchesSegment =
          segment === "All" ||
          (segment === "Open" && isOpenCaseStatus(status)) ||
          (segment === "Closed" && isClosedCaseStatus(status));

        const matchesAssignee =
          selectedAssignees.length === 0 ||
          caseItem.assignees.some((assignee) =>
            selectedAssignees.includes(assignee),
          );

        const matchesMatterType =
          selectedMatterTypes.length === 0 ||
          (caseItem.matterType &&
            selectedMatterTypes.includes(caseItem.matterType));

        return (
          matchesSearch &&
          matchesSegment &&
          matchesAssignee &&
          matchesMatterType
        );
      });

    return sortCases(filtered, sortOrder);
  }, [groups, search, segment, selectedAssignees, selectedMatterTypes, sortOrder]);

  function toggleAssignee(assignee: string) {
    setSelectedAssignees((current) => toggleValue(current, assignee));
  }

  function toggleMatterType(matterType: string) {
    setSelectedMatterTypes((current) => toggleValue(current, matterType));
  }

  return (
    <div className="space-y-spacing-6">
      <header>
        <h1 className="text-xl font-semibold tracking-tight text-text-primary">
          Dashboard
        </h1>
        <p className="mt-spacing-1 text-base text-text-secondary">
          Manage all open cases.
        </p>
      </header>

      <FilterBar
        searchPlaceholder="Search case"
        searchValue={search}
        onSearchChange={setSearch}
        segments={SEGMENTS}
        activeSegment={segment}
        onSegmentChange={setSegment}
        hasActiveFilters={
          selectedAssignees.length > 0 ||
          selectedMatterTypes.length > 0 ||
          sortOrder !== DEFAULT_CASE_SORT_ORDER
        }
        filterPanel={
          <FiltersPanel
            title="Filter cases"
            groups={[
              {
                label: "Sort by",
                mode: "single",
                defaultValue: DEFAULT_CASE_SORT_ORDER,
                options: [
                  { value: "most_blocked", label: "Most blocked" },
                  { value: "recently_created", label: "Recently created" },
                ],
                selected: [sortOrder],
                onToggle: (value) => setSortOrder(value as CaseSortOrder),
              },
              {
                label: "Assignee",
                options: filterOptions.assignees.map((assignee) => ({
                  value: assignee,
                  label: assignee,
                })),
                selected: selectedAssignees,
                onToggle: toggleAssignee,
              },
              {
                label: "Case type",
                options: filterOptions.matterTypes.map((matterType) => ({
                  value: matterType,
                  label: matterType,
                })),
                selected: selectedMatterTypes,
                onToggle: toggleMatterType,
              },
            ]}
            onClear={() => {
              setSelectedAssignees([]);
              setSelectedMatterTypes([]);
              setSortOrder(DEFAULT_CASE_SORT_ORDER);
            }}
          />
        }
      />

      {filteredCases.length === 0 ? (
        <div className="rounded-radius-xl border border-border px-spacing-6 py-spacing-12 text-center">
          <p className="text-base text-text-secondary">
            No cases match your filters.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-radius-xl border border-border">
          <TableHeader className="rounded-t-radius-xl">
            <span className="text-xs font-semibold uppercase tracking-wide text-text-primary">
              Case title
            </span>
          </TableHeader>
          {filteredCases.map((caseItem) => (
            <CaseDashboardRow key={caseItem.id} caseItem={caseItem} />
          ))}
        </div>
      )}
    </div>
  );
}

function CaseDashboardRow({ caseItem }: { caseItem: Case }) {
  const primaryRequest = caseItem.requests[0];
  const blockedCount = getCaseBlockedCount(caseItem);
  const assignee = caseItem.assignees[0];

  const request: Request = primaryRequest
    ? {
        ...primaryRequest,
        displayName: caseItem.title,
        category: caseItem.matterType ?? primaryRequest.category,
        assignee: assignee ?? primaryRequest.assignee,
      }
    : {
        id: `${caseItem.id}-empty`,
        displayName: caseItem.title,
        category: caseItem.matterType ?? "",
        documentType: "",
        assignee: assignee ?? "",
        requested: caseItem.openedAt ?? "",
        dueAt: caseItem.openedAt ?? "",
        updatedAt: caseItem.openedAt ?? "",
        activity: [],
        status: caseItem.status ?? "open",
      };

  return (
    <RequestRow
      request={request}
      variant="dashboard"
      caseId={caseItem.id}
      caseStatus={caseItem.status}
      caseType={caseItem.matterType}
      openedAt={caseItem.openedAt}
      blockedCount={blockedCount}
      showStatusBadge={false}
      dashboardSubtitle={
        primaryRequest ? undefined : "No requests created yet"
      }
    />
  );
}
