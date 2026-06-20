"use client";

import { usePathname } from "next/navigation";
import { LayoutGrid, UserCircle } from "lucide-react";
import Link from "next/link";

type SidebarProps = {
  open: boolean;
  expanded: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
};

export function Sidebar({
  open,
  expanded,
  onMouseEnter,
  onMouseLeave,
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
      className={`fixed bottom-0 left-0 top-0 z-sidebar flex flex-col overflow-hidden border-r border-border-subtle bg-surface transition-[width] duration-normal ease-in-out ${
        expanded ? "w-sidebar-expanded" : "w-sidebar"
      }`}
    >
      <nav className="flex flex-1 flex-col gap-spacing-1 px-spacing-2 py-spacing-3">
        {items.map(({ href, label, icon: Icon, active }) => (
          <Link key={href} href={href}>
            <span
              className={`flex h-button-md items-center gap-spacing-3 rounded-radius-md px-spacing-2 text-sm font-medium whitespace-nowrap transition-colors ${
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
