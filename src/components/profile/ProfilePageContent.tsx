"use client";

import { useState } from "react";
import { TableHeader } from "@/components/ui/TableHeader";

const mockProfile = {
  name: "Jordan Reyes",
  email: "jordan.reyes@andco.com",
  role: "Paralegal",
  organization: "Paralegal Organization",
  timeZone: "Pacific Time (US & Canada)",
};

function SettingsSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-radius-xl border border-border bg-surface">
      <TableHeader>
        <h2 className="text-xs font-semibold uppercase tracking-wide text-text-primary">
          {title}
        </h2>
      </TableHeader>
      <div className="divide-y divide-border-subtle">{children}</div>
    </section>
  );
}

function SettingsRow({
  label,
  value,
  action,
}: {
  label: string;
  value?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-spacing-4 px-spacing-6 py-spacing-4">
      <div className="min-w-0">
        <p className="text-sm font-medium text-text-primary">{label}</p>
        {value && (
          <p className="mt-spacing-1 text-sm text-text-secondary">{value}</p>
        )}
      </div>
      {action}
    </div>
  );
}

function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 shrink-0 rounded-radius-full border transition-colors ${
        checked
          ? "border-brand bg-brand"
          : "border-border bg-surface-hover"
      }`}
    >
      <span
        className={`mt-0.5 inline-block size-5 rounded-radius-full bg-surface transition-transform ${
          checked ? "translate-x-5" : "translate-x-0.5"
        }`}
      />
    </button>
  );
}

export function ProfilePageContent() {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(false);

  return (
    <div className="mx-auto max-w-content space-y-spacing-6">
      <header>
        <h1 className="text-xl font-semibold tracking-tight text-text-primary">
          Profile
        </h1>
        <p className="mt-spacing-1 text-base text-text-secondary">
          Manage your personal settings.
        </p>
      </header>

      <SettingsSection title="Personal information">
        <SettingsRow label="Full name" value={mockProfile.name} />
        <SettingsRow label="Email" value={mockProfile.email} />
        <SettingsRow label="Role" value={mockProfile.role} />
        <SettingsRow label="Organization" value={mockProfile.organization} />
      </SettingsSection>

      <SettingsSection title="Preferences">
        <SettingsRow
          label="Email notifications"
          value="Get updates when requests need action."
          action={
            <Toggle
              checked={emailNotifications}
              onChange={setEmailNotifications}
              label="Email notifications"
            />
          }
        />
        <SettingsRow
          label="Weekly digest"
          value="Summary of case activity every Monday."
          action={
            <Toggle
              checked={weeklyDigest}
              onChange={setWeeklyDigest}
              label="Weekly digest"
            />
          }
        />
        <SettingsRow label="Time zone" value={mockProfile.timeZone} />
      </SettingsSection>

      <SettingsSection title="Account">
        <SettingsRow
          label="Password"
          value="Last changed 3 months ago"
          action={
            <button
              type="button"
              className="text-sm font-medium text-brand hover:text-brand-hover"
            >
              Update
            </button>
          }
        />
        <SettingsRow
          label="Sign out"
          value="Sign out of AndCo on this device."
          action={
            <button
              type="button"
              className="inline-flex h-button-md items-center rounded-radius-md border border-border px-spacing-4 text-sm font-medium text-text-primary hover:bg-surface-hover"
            >
              Sign out
            </button>
          }
        />
      </SettingsSection>
    </div>
  );
}
