import type { ReactNode } from "react";

type TableHeaderProps = {
  children: ReactNode;
  className?: string;
};

export function TableHeader({ children, className = "" }: TableHeaderProps) {
  return (
    <div
      className={`border-b border-border bg-table-header px-spacing-6 py-spacing-2 ${className}`.trim()}
    >
      {children}
    </div>
  );
}
