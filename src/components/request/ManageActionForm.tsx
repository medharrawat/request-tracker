"use client";

import { useState, type FormEvent } from "react";
import type { ManageAction } from "@/lib/types";
import type { ManageActionPayload } from "@/lib/manage-actions";

type ManageActionFormProps = {
  action: ManageAction;
  sourceLabel?: string;
  onSubmit: (payload: ManageActionPayload[ManageAction]) => void;
  onCancel: () => void;
};

export function ManageActionForm({
  action,
  sourceLabel,
  onSubmit,
  onCancel,
}: ManageActionFormProps) {
  const [note, setNote] = useState("");
  const [followUpMessage, setFollowUpMessage] = useState("");

  function handleSubmit(event: FormEvent) {
    event.preventDefault();

    if (action === "add_note") {
      const trimmed = note.trim();
      if (!trimmed) return;
      onSubmit({ note: trimmed });
      return;
    }

    if (action === "follow_up") {
      onSubmit({ message: followUpMessage.trim() });
      return;
    }

    onSubmit({});
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-spacing-3 p-spacing-3">
      {action === "add_note" && (
        <>
          <label className="block text-xs font-medium text-text-secondary">
            Note
          </label>
          <textarea
            value={note}
            onChange={(event) => setNote(event.target.value)}
            rows={3}
            placeholder="Add a note to the activity log…"
            className="w-full resize-none rounded-radius-md border border-border bg-surface px-spacing-3 py-spacing-2 text-sm text-text-primary placeholder:text-text-tertiary focus:border-brand focus:outline-none focus:ring-3 focus:ring-brand-muted"
            autoFocus
          />
        </>
      )}

      {action === "follow_up" && (
        <>
          <p className="text-sm text-text-secondary">
            Send a follow-up
            {sourceLabel ? ` to ${sourceLabel}` : ""}.
          </p>
          <label className="block text-xs font-medium text-text-secondary">
            Message (optional)
          </label>
          <textarea
            value={followUpMessage}
            onChange={(event) => setFollowUpMessage(event.target.value)}
            rows={2}
            placeholder="Include details for the activity log…"
            className="w-full resize-none rounded-radius-md border border-border bg-surface px-spacing-3 py-spacing-2 text-sm text-text-primary placeholder:text-text-tertiary focus:border-brand focus:outline-none focus:ring-3 focus:ring-brand-muted"
            autoFocus
          />
        </>
      )}

      {action === "mark_received" && (
        <p className="text-sm text-text-secondary">
          Mark this request as received? This will update the status and add an
          entry to the activity log.
        </p>
      )}

      <div className="flex justify-end gap-spacing-2">
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex h-button-sm items-center rounded-radius-md px-spacing-3 text-sm font-medium text-text-secondary hover:bg-surface-hover"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="inline-flex h-button-sm items-center rounded-radius-md bg-brand px-spacing-3 text-sm font-medium text-text-inverse hover:bg-brand-hover"
        >
          {action === "add_note"
            ? "Add note"
            : action === "follow_up"
              ? "Send follow-up"
              : "Mark received"}
        </button>
      </div>
    </form>
  );
}
