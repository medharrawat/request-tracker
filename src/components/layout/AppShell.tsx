"use client";

import { useEffect, useRef, useState } from "react";
import { Sidebar } from "./Sidebar";

type AppShellProps = {
  children: React.ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const sidebarHoveredRef = useRef(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!sidebarHoveredRef.current) {
        setSidebarOpen(false);
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-page text-text-primary">
      <div className="flex">
        <Sidebar
          open={sidebarOpen}
          onMouseEnter={() => {
            sidebarHoveredRef.current = true;
            setSidebarOpen(true);
          }}
          onMouseLeave={() => {
            sidebarHoveredRef.current = false;
            setSidebarOpen(false);
          }}
          expanded={sidebarOpen}
        />

        <main
          className="min-w-0 flex-1 bg-page px-spacing-6 py-spacing-8 transition-[margin-left] duration-normal ease-in-out"
          style={{
            marginLeft: sidebarOpen
              ? "var(--width-sidebar-expanded)"
              : "var(--width-sidebar)",
          }}
        >
          <div className="w-full">{children}</div>
        </main>
      </div>
    </div>
  );
}
