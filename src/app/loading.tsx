import { AppShell } from "@/components/layout/AppShell";
import { PageLoadingSkeleton } from "@/components/ui/PageLoadingSkeleton";

export default function DashboardLoading() {
  return (
    <AppShell>
      <PageLoadingSkeleton />
    </AppShell>
  );
}
