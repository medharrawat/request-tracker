import { AppShell } from "@/components/layout/AppShell";
import { DashboardContent } from "@/components/dashboard/DashboardContent";
import { fetchCaseGroups } from "@/lib/mock-data";

export default async function DashboardPage() {
  const groups = await fetchCaseGroups();

  return (
    <AppShell>
      <DashboardContent groups={groups} />
    </AppShell>
  );
}
