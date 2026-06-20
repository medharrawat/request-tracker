import type { ReactNode } from "react";

type TableHeaderProps = {
  children: ReactNode;
  className?: string;
  variant?: "default" | "blocked";
};

export function TableHeader({
  children,
  className = "",
  variant = "default",
}: TableHeaderProps) {
  const background =
    variant === "blocked"
      ? "bg-status-needs-action-bg/40"
      : "bg-table-header";

  return (
    <div
      className={`border-b border-border ${background} px-spacing-6 py-spacing-2 ${className}`.trim()}
    >
      {children}
    </div>
  );
}
