"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ChevronDown,
  ChevronRight,
  MoreVertical,
  Video,
} from "lucide-react";
import type { ManageAction, Request, RequestStatus } from "@/lib/types";
import type { ManageActionPayload } from "@/lib/manage-actions";
import {
  formatDate,
  formatDaysUntilDue,
  formatPagesProgress,
} from "@/lib/format";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { ManageDropdown } from "@/components/request/ManageDropdown";
import { ActivityHistory } from "./ActivityHistory";
import { NeedsActionMessage } from "@/components/request/NeedsActionMessage";
import { getActivityDisplayEntries } from "@/lib/request-dates";
import { DASHBOARD_ROW_GRID_CLASS } from "@/lib/layout";

type RequestRowVariant = "dashboard" | "case-blocked" | "case-list";

type RequestRowProps = {
  request: Request;
  variant?: RequestRowVariant;
  caseId?: string;
  caseStatus?: RequestStatus;
  caseType?: string;
  openedAt?: string;
  blockedCount?: number;
  showStatusBadge?: boolean;
  expandAllActivity?: boolean;
  dashboardSubtitle?: string;
  onManageAction?: (
    action: ManageAction,
    payload: ManageActionPayload[ManageAction],
  ) => void;
};

function requestTitle(request: Request) {
  return request.displayName ?? request.documentType;
}

function buildCasePageSubtitle(request: Request): string {
  const parts: string[] = [];
  if (request.source) {
    parts.push(request.source);
  }
  parts.push(formatDaysUntilDue(request.dueAt));

  const pages =
    request.status === "partially_received"
      ? formatPagesProgress(request.pagesReceived, request.pagesExpected)
      : null;
  if (pages) {
    parts.push(pages);
  }

  return parts.join(" · ");
}

function RequestHeading({
  title,
  status,
  showBadge,
  assignee,
  date,
  showSubtitle,
  caseType,
  subtitle,
}: {
  title: string;
  status: RequestStatus;
  showBadge: boolean;
  assignee: string;
  date?: string;
  showSubtitle: boolean;
  caseType?: string;
  subtitle?: string;
}) {
  const subtitleParts = [assignee];
  if (date) {
    subtitleParts.push(formatDate(`${date}T12:00:00.000Z`));
  }
  const subtitleText = subtitle ?? subtitleParts.filter(Boolean).join(" · ");

  return (
    <div className="min-w-0">
      <div className="flex flex-wrap items-center gap-x-spacing-2 gap-y-spacing-1">
        <p className="truncate text-base font-medium text-text-primary">
          {title}
        </p>
        {caseType && (
          <StatusBadge variant="case-type" label={caseType} />
        )}
        {showBadge && <StatusBadge status={status} />}
      </div>
      {showSubtitle && subtitleText && (
        <p className="truncate text-sm text-text-secondary">
          {subtitleText}
        </p>
      )}
    </div>
  );
}

function ActivityChevron({
  expanded,
  onToggle,
}: {
  expanded: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={(event) => {
        event.stopPropagation();
        onToggle();
      }}
      aria-expanded={expanded}
      aria-label={expanded ? "Hide activity" : "Show activity"}
      className="inline-flex size-8 items-center justify-center rounded-radius-md text-text-secondary hover:bg-surface-hover hover:text-text-primary"
    >
      {expanded ? (
        <ChevronDown className="size-spacing-4" />
      ) : (
        <ChevronRight className="size-spacing-4" />
      )}
    </button>
  );
}

export function RequestRow({
  request,
  variant = "case-list",
  caseId,
  caseStatus,
  caseType,
  openedAt,
  blockedCount = 0,
  showStatusBadge = true,
  expandAllActivity = false,
  dashboardSubtitle,
  onManageAction,
}: RequestRowProps) {
  const [activityExpanded, setActivityExpanded] = useState(expandAllActivity);
  const [rowHovered, setRowHovered] = useState(false);
  const previousActivityCount = useRef(request.activity.length);

  useEffect(() => {
    if (request.activity.length > previousActivityCount.current) {
      setActivityExpanded(true);
    }
    previousActivityCount.current = request.activity.length;
  }, [request.activity.length]);

  const title = requestTitle(request);
  const isDashboard = variant === "dashboard";
  const isBlocked = variant === "case-blocked";
  const isCasePage = isBlocked || variant === "case-list";
  const requestDate = request.requested.split("T")[0];
  const statusForBadge = isDashboard ? (caseStatus ?? request.status) : request.status;
  const showBadge =
    showStatusBadge && isDashboard && Boolean(caseStatus) && blockedCount > 0;
  const caseHref = caseId ? `/cases/${caseId}` : undefined;
  const subtitleDate = isDashboard ? openedAt : requestDate;

  function toggleActivityExpanded() {
    setActivityExpanded((open) => !open);
  }

  const rowActions = (
    <div
      className="flex shrink-0 items-center justify-end gap-spacing-2"
      onClick={(event) => event.stopPropagation()}
      onKeyDown={(event) => event.stopPropagation()}
    >
      {isDashboard && blockedCount > 0 && (
        <span className="rounded-radius-full bg-pill-action-bg px-spacing-2 py-0.5 text-xs font-medium text-pill-action-text">
          {blockedCount} blocked
        </span>
      )}

      {isCasePage && (
        <ManageDropdown
          sourceLabel={request.source}
          onAction={onManageAction}
        />
      )}

      {isDashboard && caseStatus === "scheduled" && (
        <>
          <button
            type="button"
            className="inline-flex h-8 items-center gap-spacing-2 rounded-radius-md bg-brand px-spacing-4 text-sm font-medium text-text-inverse hover:bg-brand-hover"
          >
            <Video className="size-spacing-4" />
            Start
          </button>
          <button
            type="button"
            className="inline-flex size-8 items-center justify-center rounded-radius-md text-text-secondary hover:bg-surface-hover hover:text-text-primary"
            aria-label="More options"
          >
            <MoreVertical className="size-spacing-4" />
          </button>
        </>
      )}
    </div>
  );

  const casePageRow = (
    <div
      role="button"
      tabIndex={0}
      aria-expanded={activityExpanded}
      onClick={toggleActivityExpanded}
      onMouseEnter={() => setRowHovered(true)}
      onMouseLeave={() => setRowHovered(false)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          toggleActivityExpanded();
        }
      }}
      className="relative flex cursor-pointer items-center gap-spacing-2 px-spacing-6 py-spacing-4 transition-colors hover:bg-surface-hover"
    >
      {!activityExpanded && rowHovered && (
        <div
          role="tooltip"
          className="pointer-events-none absolute bottom-spacing-2 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-radius-md border border-border-subtle bg-surface px-spacing-2 py-0.5 text-xs text-text-secondary"
        >
          Expand
        </div>
      )}

      <div className="flex w-row-chevron shrink-0 items-center justify-center">
        <ActivityChevron
          expanded={activityExpanded}
          onToggle={toggleActivityExpanded}
        />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-spacing-2 gap-y-spacing-1">
          <p className="truncate text-base font-medium text-text-primary">{title}</p>
          {!isBlocked && <StatusBadge status={request.status} />}
        </div>
        <p className="truncate text-sm text-text-secondary">
          {buildCasePageSubtitle(request)}
        </p>
        {request.needsActionMessage && isBlocked && (
          <div className="mt-spacing-2">
            <NeedsActionMessage message={request.needsActionMessage} />
          </div>
        )}
      </div>

      {rowActions}
    </div>
  );

  const dashboardRowGrid = `${DASHBOARD_ROW_GRID_CLASS} px-spacing-6 py-spacing-4 transition-colors hover:bg-surface-hover`;

  const dashboardRowContent = (
    <>
      <div className="flex min-w-0 items-center gap-spacing-4">
        {request.time && (
          <time className="w-16 shrink-0 text-base tabular-nums text-text-secondary">
            {request.time}
          </time>
        )}

        <RequestHeading
          title={title}
          status={statusForBadge}
          showBadge={showBadge}
          assignee={request.assignee}
          date={subtitleDate}
          showSubtitle
          caseType={caseType}
          subtitle={dashboardSubtitle}
        />
      </div>

      <div className="flex justify-end">{rowActions}</div>
    </>
  );

  return (
    <article className="overflow-visible border-b border-border bg-surface last:rounded-b-radius-xl last:border-b-0">
      {isCasePage ? (
        casePageRow
      ) : isDashboard && caseHref ? (
        caseStatus === "scheduled" ? (
          <div className={`${dashboardRowGrid} hover:bg-surface-hover`}>
            <Link href={caseHref} className="flex min-w-0 items-center gap-spacing-4">
              <div className="flex min-w-0 items-center gap-spacing-4">
                {request.time && (
                  <time className="w-16 shrink-0 text-base tabular-nums text-text-secondary">
                    {request.time}
                  </time>
                )}
                <RequestHeading
                  title={title}
                  status={statusForBadge}
                  showBadge={showBadge}
                  assignee={request.assignee}
                  date={openedAt}
                  showSubtitle
                  caseType={caseType}
                  subtitle={dashboardSubtitle}
                />
              </div>
            </Link>
            <div className="flex justify-end">{rowActions}</div>
          </div>
        ) : (
          <Link href={caseHref} className={dashboardRowGrid}>
            {dashboardRowContent}
          </Link>
        )
      ) : null}

      {isCasePage && activityExpanded && (
        <ActivityHistory entries={getActivityDisplayEntries(request)} />
      )}
    </article>
  );
}
