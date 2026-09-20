import { ChartSection } from '@/components/charts/ChartSection';
import { ChandraSuryaSection } from '@/components/reference/ChandraSuryaSection';

export function ChartsTab() {
  return (
    <div className="space-y-8">
      {/* Divisional charts D1 through D60 — modern renderer with depth + 12 colors */}
      <ChartSection />

      {/* Reference charts — Chandra & Surya Kundli */}
      <ChandraSuryaSection />
    </div>
  );
}