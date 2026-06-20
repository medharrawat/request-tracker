import type { RequestStatus } from "@/lib/types";
import { Clock } from "lucide-react";
import { requestStatusConfig } from "@/lib/request-status";

type StatusBadgeProps = {
  status?: RequestStatus | "urgent";
  label?: string;
  variant?: "status" | "case-type";
};

const caseTypeStyle = {
  className: "bg-status-requested-bg text-status-requested-text",
  icon: false as const,
};

export function StatusBadge({
  status = "open",
  label,
  variant = "status",
}: StatusBadgeProps) {
  const config =
    variant === "case-type"
      ? caseTypeStyle
      : (requestStatusConfig[status] ?? requestStatusConfig.open);

  return (
    <span
      className={`inline-flex shrink-0 items-center gap-spacing-1 rounded-radius-full border border-border-subtle px-spacing-3 py-spacing-1 text-sm font-medium ${config.className}`}
    >
      {"icon" in config && config.icon && (
        <Clock className="size-spacing-3" />
      )}
      {label ?? ("label" in config ? config.label : "")}
    </span>
  );
}
