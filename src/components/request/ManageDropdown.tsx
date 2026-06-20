"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, FileText, MessageSquare, RefreshCw } from "lucide-react";
import type { ManageAction } from "@/lib/types";
import type { ManageActionPayload } from "@/lib/manage-actions";
import { ManageActionForm } from "@/components/request/ManageActionForm";

type ManageDropdownProps = {
  sourceLabel?: string;
  onAction?: (
    action: ManageAction,
    payload: ManageActionPayload[ManageAction],
  ) => void;
};

const actions: { id: ManageAction; label: string; icon: typeof FileText }[] = [
  { id: "add_note", label: "Add note", icon: MessageSquare },
  { id: "follow_up", label: "Follow up", icon: RefreshCw },
  { id: "mark_received", label: "Mark received", icon: FileText },
];

export function ManageDropdown({ sourceLabel, onAction }: ManageDropdownProps) {
  const [open, setOpen] = useState(false);
  const [activeAction, setActiveAction] = useState<ManageAction | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
        setActiveAction(null);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function closePanel() {
    setOpen(false);
    setActiveAction(null);
  }

  function handleSubmit(payload: ManageActionPayload[ManageAction]) {
    if (!activeAction) return;
    onAction?.(activeAction, payload);
    closePanel();
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => {
          setOpen((prev) => !prev);
          if (open) setActiveAction(null);
        }}
        className="inline-flex h-8 items-center gap-spacing-2 rounded-radius-md border border-border bg-surface px-spacing-3 text-sm font-medium text-text-primary hover:bg-surface-hover"
        aria-expanded={open}
        aria-haspopup="menu"
      >
        Manage
        <ChevronDown className="size-spacing-3 text-text-secondary" />
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-spacing-2 w-dropdown overflow-hidden rounded-radius-lg border border-border bg-surface shadow-dropdown">
          {activeAction ? (
            <ManageActionForm
              action={activeAction}
              sourceLabel={sourceLabel}
              onSubmit={handleSubmit}
              onCancel={() => setActiveAction(null)}
            />
          ) : (
            <div role="menu">
              {actions.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  type="button"
                  role="menuitem"
                  onClick={() => setActiveAction(id)}
                  className="flex w-full items-center gap-spacing-2 px-spacing-4 py-spacing-2 text-sm text-text-secondary hover:bg-surface-hover"
                >
                  <Icon className="size-spacing-4 text-text-secondary" />
                  {label}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
