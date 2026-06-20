import { notFound } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { CasePageContent } from "@/components/case/CasePageContent";
import { fetchCase } from "@/lib/mock-data";

type CasePageProps = {
  params: Promise<{ id: string }>;
};

export default async function CasePage({ params }: CasePageProps) {
  const { id } = await params;
  const caseData = await fetchCase(id);

  if (!caseData) {
    notFound();
  }

  return (
    <AppShell>
      <CasePageContent key={caseData.id} caseData={caseData} />
    </AppShell>
  );
}
