"use client";

import { useEffect, useRef, useState } from "react";
import { TopNav } from "./TopNav";
import { Sidebar } from "./Sidebar";

const HEADER_HEIGHT = 49;
const SIDEBAR_COLLAPSED = 56;
const SIDEBAR_EXPANDED = 200;

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

  const sidebarWidth = sidebarOpen ? SIDEBAR_EXPANDED : SIDEBAR_COLLAPSED;

  return (
    <div className="min-h-screen bg-page text-text-primary">
      <TopNav />

      <div className="flex" style={{ paddingTop: HEADER_HEIGHT }}>
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
          style={{
            width: sidebarWidth,
            top: HEADER_HEIGHT,
          }}
        />

        <main
          className="min-w-0 flex-1 bg-page px-spacing-6 py-spacing-8 transition-[margin-left] duration-200 ease-in-out"
          style={{ marginLeft: sidebarWidth }}
        >
          <div className="w-full">{children}</div>
        </main>
      </div>
    </div>
  );
}
