"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
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
  getDueDateTextClass,
  getDueDateUrgency,
} from "@/lib/format";
import { getStatusLabel } from "@/lib/request-status";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { ManageDropdown } from "@/components/request/ManageDropdown";
import { ActivityHistory } from "./ActivityHistory";
import { NeedsActionMessage } from "@/components/request/NeedsActionMessage";
import { getActivityDisplayEntries } from "@/lib/request-dates";
import {
  BLOCKED_REQUEST_TABLE_ROW_CLASS,
  CASE_REQUEST_TABLE_ROW_CLASS,
  DASHBOARD_ROW_GRID_CLASS,
} from "@/lib/layout";

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
  referenceDate?: string;
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

  const pages =
    request.status === "partially_received"
      ? formatPagesProgress(request.pagesReceived, request.pagesExpected)
      : null;
  if (pages) {
    parts.push(pages);
  }

  return parts.join(" · ");
}

function DueDateCell({
  dueAt,
  referenceDate,
}: {
  dueAt?: string | null;
  referenceDate?: string;
}) {
  if (!dueAt) {
    return (
      <span className="min-w-0 text-sm text-text-tertiary" aria-hidden="true">
        —
      </span>
    );
  }

  const urgency = getDueDateUrgency(dueAt, referenceDate);

  return (
    <span
      className={`min-w-0 truncate text-sm tabular-nums ${getDueDateTextClass(urgency)}`}
    >
      {formatDaysUntilDue(dueAt, referenceDate)}
    </span>
  );
}

function AssigneeCell({ assignee }: { assignee: string }) {
  return (
    <span className="min-w-0 truncate text-sm text-text-secondary">
      {assignee}
    </span>
  );
}

function RequestStatusText({ status }: { status: RequestStatus }) {
  return (
    <span className="min-w-0 truncate text-sm text-text-secondary">
      {getStatusLabel(status)}
    </span>
  );
}

function RequestHeading({
  title,
  status,
  showBadge,
  assignee,
  date,
  showSubtitle,
  headerPill,
  subtitle,
}: {
  title: string;
  status: RequestStatus;
  showBadge: boolean;
  assignee: string;
  date?: string;
  showSubtitle: boolean;
  headerPill?: ReactNode;
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
        {headerPill}
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
      className="inline-flex size-button-sm items-center justify-center rounded-radius-md text-text-secondary hover:bg-surface-hover hover:text-text-primary"
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
  referenceDate,
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
  const casePageSubtitle = buildCasePageSubtitle(request);
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

  const blockedPill =
    blockedCount > 0 ? (
      <span className="rounded-radius-full bg-pill-action-bg px-spacing-2 py-spacing-1 text-xs font-medium text-pill-action-text">
        {blockedCount} blocked
      </span>
    ) : undefined;

  const rowActions = (
    <div
      className="flex shrink-0 items-center justify-end gap-spacing-2"
      onClick={(event) => event.stopPropagation()}
      onKeyDown={(event) => event.stopPropagation()}
    >
      {isDashboard && caseType && (
        <StatusBadge variant="case-type" label={caseType} />
      )}

      {isCasePage && (
        <ManageDropdown
          sourceLabel={request.source}
          variant={isBlocked ? "follow-up" : "default"}
          onAction={onManageAction}
        />
      )}

      {isDashboard && caseStatus === "scheduled" && (
        <>
          <button
            type="button"
            className="inline-flex h-button-sm items-center gap-spacing-2 rounded-radius-md bg-brand px-spacing-4 text-sm font-medium text-text-inverse hover:bg-brand-hover"
          >
            <Video className="size-spacing-4" />
            Start
          </button>
          <button
            type="button"
            className="inline-flex size-button-sm items-center justify-center rounded-radius-md text-text-secondary hover:bg-surface-hover hover:text-text-primary"
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
      className={`relative ${isBlocked ? BLOCKED_REQUEST_TABLE_ROW_CLASS : CASE_REQUEST_TABLE_ROW_CLASS} cursor-pointer transition-colors hover:bg-surface-hover`}
    >
      {!activityExpanded && rowHovered && (
        <div
          role="tooltip"
          className="pointer-events-none absolute bottom-0 left-1/2 z-tooltip -translate-x-1/2 whitespace-nowrap rounded-radius-md border border-border-subtle bg-surface px-spacing-2 py-spacing-1 text-xs text-text-secondary"
        >
          Expand
        </div>
      )}

      <div className="flex min-w-0 items-center gap-spacing-2">
        <ActivityChevron
          expanded={activityExpanded}
          onToggle={toggleActivityExpanded}
        />

        <div className="min-w-0">
          <p className="truncate text-base font-medium text-text-primary">{title}</p>
          {casePageSubtitle && (
            <p className="truncate text-sm text-text-secondary">
              {casePageSubtitle}
            </p>
          )}
          {request.needsActionMessage && isBlocked && (
            <div className="mt-spacing-2">
              <NeedsActionMessage message={request.needsActionMessage} />
            </div>
          )}
        </div>
      </div>

      {!isBlocked && <DueDateCell dueAt={request.dueAt} referenceDate={referenceDate} />}
      {!isBlocked && <AssigneeCell assignee={request.assignee} />}
      {!isBlocked && <RequestStatusText status={request.status} />}
      <div className="flex min-w-0 justify-end">{rowActions}</div>
    </div>
  );

  const dashboardRowGrid = `${DASHBOARD_ROW_GRID_CLASS} px-spacing-6 py-spacing-4 transition-colors hover:bg-surface-hover`;

  const dashboardRowContent = (
    <>
      <div className="flex min-w-0 items-center gap-spacing-4">
        {request.time && (
          <time className="w-time-column shrink-0 text-base tabular-nums text-text-secondary">
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
          headerPill={blockedPill}
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
                  <time className="w-time-column shrink-0 text-base tabular-nums text-text-secondary">
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
                  headerPill={blockedPill}
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
