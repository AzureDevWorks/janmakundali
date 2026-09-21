import { useKundli } from '@/features/kundli/useKundli';
import { WelcomeBanner } from '@/components/overview/WelcomeBanner';
import { IdentityHero } from '@/components/overview/IdentityHero';
import { RunningNowBanner } from '@/components/overview/RunningNowBanner';
import { KeyMarkersGrid } from '@/components/overview/KeyMarkersGrid';
import { TopInsightsCard } from '@/components/overview/TopInsightsCard';
import { ExploreGrid } from '@/components/overview/ExploreGrid';

interface Props {
  onNavigate?: (key: string) => void;
}

export function OverviewTab({ onNavigate }: Props = {}) {
  const { data: kundli, isLoading, error } = useKundli();

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50/40 p-8 text-center text-sm text-amber-900">
        Computing your kundali...
      </div>
    );
  }
  if (error) {
    return (
      <div className="rounded-2xl border border-red-300 bg-red-50 p-4 text-sm text-red-800">
        Failed to compute: {(error as Error).message}
      </div>
    );
  }
  if (!kundli) return null;

  return (
    <div className="space-y-6">
      {/* 1. Big welcome — name, age, place */}
      <WelcomeBanner kundli={kundli} />

      {/* 2. Three pillars — Lagna / Sun / Moon */}
      <IdentityHero kundli={kundli} />

      {/* 3. What's running right now */}
      <RunningNowBanner kundli={kundli} />

      {/* 4. Two-column: key markers on left, insights on right */}
      <div className="grid gap-5 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <KeyMarkersGrid kundli={kundli} />
        </div>
        <div className="lg:col-span-3">
          <TopInsightsCard kundli={kundli} />
        </div>
      </div>

      {/* 5. Quick navigation */}
      <ExploreGrid onNavigate={onNavigate} />
    </div>
  );
}