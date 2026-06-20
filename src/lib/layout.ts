export const DASHBOARD_ROW_GRID_CLASS =
  "grid grid-cols-[1fr_var(--width-blockers-column)] items-center gap-spacing-4";

export const CASE_REQUEST_ROW_GRID_CLASS =
  "grid grid-cols-[minmax(0,1fr)_var(--width-request-due-column)_var(--width-request-assignee-column)_var(--width-request-status-column)_var(--width-request-actions-column)] items-center gap-spacing-4";

export const CASE_REQUEST_TABLE_HEADER_CLASS = `${CASE_REQUEST_ROW_GRID_CLASS} px-spacing-6 py-spacing-3`;

export const CASE_REQUEST_TABLE_ROW_CLASS = `${CASE_REQUEST_ROW_GRID_CLASS} px-spacing-6 py-spacing-4`;

export const BLOCKED_REQUEST_ROW_GRID_CLASS =
  "grid grid-cols-[minmax(0,1fr)_var(--width-request-actions-column)] items-center gap-spacing-4";

export const BLOCKED_REQUEST_TABLE_HEADER_CLASS = `${BLOCKED_REQUEST_ROW_GRID_CLASS} px-spacing-6 py-spacing-3`;

export const BLOCKED_REQUEST_TABLE_ROW_CLASS = `${BLOCKED_REQUEST_ROW_GRID_CLASS} px-spacing-6 py-spacing-4`;

export const TABLE_HEADER_CELL_CLASS =
  "text-xs font-medium uppercase tracking-wide text-text-secondary";

export const ACTIVITY_ROW_GRID_CLASS =
  "grid grid-cols-[var(--width-activity-date)_1fr] items-center gap-spacing-4";

export const MODAL_FORM_ROW_GRID_CLASS = "grid grid-cols-2";
