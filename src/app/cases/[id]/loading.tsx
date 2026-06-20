import { AppShell } from "@/components/layout/AppShell";
import { PageLoadingSkeleton } from "@/components/ui/PageLoadingSkeleton";

export default function CaseLoading() {
  return (
    <AppShell>
      <PageLoadingSkeleton />
    </AppShell>
  );
}
