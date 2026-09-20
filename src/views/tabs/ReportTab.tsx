import { useKundli } from '@/features/kundli/useKundli';
import { ComprehensiveReportCard } from '@/components/cards/ComprehensiveReportCard';

export function ReportTab() {
  const { data: kundli } = useKundli();

  return <ComprehensiveReportCard kundli={kundli} />;
}