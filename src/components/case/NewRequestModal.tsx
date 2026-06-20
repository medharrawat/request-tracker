"use client";

import { useEffect, useId, useState, type FormEvent } from "react";
import { X } from "lucide-react";
import type { NewRequestInput } from "@/lib/create-request";
import { MODAL_FORM_ROW_GRID_CLASS } from "@/lib/layout";

const REQUEST_CATEGORIES = [
  { value: "police", label: "Police" },
  { value: "medical", label: "Medical" },
  { value: "insurance", label: "Insurance" },
] as const;

const fieldClassName =
  "w-full rounded-radius-md border border-border bg-surface px-spacing-3 py-spacing-2 text-sm text-text-primary placeholder:text-text-tertiary focus:border-brand focus:outline-none focus:ring-3 focus:ring-brand-muted";

type NewRequestModalProps = {
  open: boolean;
  assigneeOptions: string[];
  defaultAssignee?: string;
  onClose: () => void;
  onSubmit: (input: NewRequestInput) => void;
};

export function NewRequestModal({
  open,
  assigneeOptions,
  defaultAssignee,
  onClose,
  onSubmit,
}: NewRequestModalProps) {
  if (!open) {
    return null;
  }

  return (
    <NewRequestModalForm
      assigneeOptions={assigneeOptions}
      defaultAssignee={defaultAssignee}
      onClose={onClose}
      onSubmit={onSubmit}
    />
  );
}

function NewRequestModalForm({
  assigneeOptions,
  defaultAssignee,
  onClose,
  onSubmit,
}: Omit<NewRequestModalProps, "open">) {
  const titleId = useId();
  const [documentType, setDocumentType] = useState("");
  const [category, setCategory] = useState<string>(REQUEST_CATEGORIES[0].value);
  const [source, setSource] = useState("");
  const [assignee, setAssignee] = useState(
    defaultAssignee ?? assigneeOptions[0] ?? "",
  );
  const [dueAt, setDueAt] = useState("");

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();

    const trimmedDocumentType = documentType.trim();
    if (!trimmedDocumentType || !assignee) {
      return;
    }

    onSubmit({
      documentType: trimmedDocumentType,
      category,
      source,
      assignee,
      dueAt,
    });
    onClose();
  }

  return (
    <div className="fixed inset-0 z-dropdown flex items-center justify-center p-spacing-4">
      <button
        type="button"
        aria-label="Close dialog"
        className="absolute inset-0 bg-overlay"
        onClick={onClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative w-modal rounded-radius-xl border border-border bg-surface shadow-dropdown"
      >
        <div className="flex items-center justify-between border-b border-border px-spacing-6 py-spacing-4">
          <h2 id={titleId} className="text-lg font-semibold text-text-primary">
            New Request
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="inline-flex size-button-sm items-center justify-center rounded-radius-md text-text-secondary hover:bg-surface-hover hover:text-text-primary"
          >
            <X className="size-spacing-4" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-spacing-4 px-spacing-6 py-spacing-5"
        >
          <div className="space-y-spacing-2">
            <label
              htmlFor="document-type"
              className="block text-xs font-medium text-text-secondary"
            >
              Document type
            </label>
            <input
              id="document-type"
              type="text"
              value={documentType}
              onChange={(event) => setDocumentType(event.target.value)}
              placeholder="e.g. Medical Records — Emergency Dept."
              className={fieldClassName}
              autoFocus
              required
            />
          </div>

          <div className="space-y-spacing-2">
            <label
              htmlFor="category"
              className="block text-xs font-medium text-text-secondary"
            >
              Category
            </label>
            <select
              id="category"
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className={fieldClassName}
            >
              {REQUEST_CATEGORIES.map(({ value, label }) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-spacing-2">
            <label
              htmlFor="source"
              className="block text-xs font-medium text-text-secondary"
            >
              Source
            </label>
            <input
              id="source"
              type="text"
              value={source}
              onChange={(event) => setSource(event.target.value)}
              placeholder="e.g. Kaiser Permanente, Oakland"
              className={fieldClassName}
            />
          </div>

          <div className={`${MODAL_FORM_ROW_GRID_CLASS} gap-spacing-4`}>
            <div className="space-y-spacing-2">
              <label
                htmlFor="assignee"
                className="block text-xs font-medium text-text-secondary"
              >
                Assignee
              </label>
              <select
                id="assignee"
                value={assignee}
                onChange={(event) => setAssignee(event.target.value)}
                className={fieldClassName}
                required
              >
                {assigneeOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-spacing-2">
              <label
                htmlFor="due-at"
                className="block text-xs font-medium text-text-secondary"
              >
                Due date
              </label>
              <input
                id="due-at"
                type="date"
                value={dueAt}
                onChange={(event) => setDueAt(event.target.value)}
                className={fieldClassName}
              />
            </div>
          </div>

          <div className="flex justify-end gap-spacing-2 pt-spacing-2">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-button-md items-center rounded-radius-md px-spacing-4 text-sm font-medium text-text-secondary hover:bg-surface-hover"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex h-button-md items-center rounded-radius-md bg-brand px-spacing-4 text-sm font-medium text-text-inverse hover:bg-brand-hover"
            >
              Create request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
