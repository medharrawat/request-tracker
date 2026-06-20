"use client";

import type { CSSProperties } from "react";
import { usePathname } from "next/navigation";
import { LayoutGrid, UserCircle } from "lucide-react";
import Link from "next/link";

type SidebarProps = {
  open: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  style?: CSSProperties;
};

export function Sidebar({
  open,
  onMouseEnter,
  onMouseLeave,
  style,
}: SidebarProps) {
  const pathname = usePathname();
  const isDashboard = pathname === "/";
  const isProfile = pathname === "/profile";

  const items = [
    { href: "/", label: "Dashboard", icon: LayoutGrid, active: isDashboard },
    {
      href: "/profile",
      label: "Profile",
      icon: UserCircle,
      active: isProfile,
    },
  ];

  return (
    <aside
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={style}
      className="fixed bottom-0 left-0 z-40 flex flex-col overflow-hidden border-r border-border/60 bg-surface transition-[width] duration-200 ease-in-out"
    >
      <nav className="flex flex-1 flex-col gap-spacing-1 px-spacing-2 py-spacing-3">
        {items.map(({ href, label, icon: Icon, active }) => (
          <Link key={href} href={href}>
            <span
              className={`flex h-9 items-center gap-spacing-3 rounded-radius-md px-spacing-2 text-sm font-medium whitespace-nowrap transition-colors ${
                active
                  ? "bg-pill-default-bg text-pill-default-text"
                  : "text-text-secondary hover:bg-surface-hover hover:text-text-primary"
              }`}
            >
              <Icon className="size-spacing-4 shrink-0" />
              <span className={open ? "inline" : "hidden"}>{label}</span>
            </span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}
