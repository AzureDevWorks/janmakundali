import { useKundli } from '@/features/kundli/useKundli';
import { IdentityHero } from '@/components/overview/IdentityHero';
import { PanchangCard } from '@/components/overview/PanchangCard';
import { DashaCard } from '@/components/overview/DashaCard';
import { JanmaNakshatraCard } from '@/components/overview/JanmaNakshatraCard';
import { SpecialLagnasCard } from '@/components/overview/SpecialLagnasCard';
import { BirthSnapshotCard } from '@/components/overview/BirthSnapshotCard';

export function OverviewTab() {
  const { data: kundli } = useKundli();

  return (
    <div className="space-y-5">
      {/* 1. Three pillars ? Lagna / Sun / Moon */}
      <IdentityHero kundli={kundli} />

      {/* 2. Panchang + Current Dasha side by side */}
      <div className="grid gap-5 lg:grid-cols-2">
        <PanchangCard />
        <DashaCard kundli={kundli} />
      </div>

      {/* 3. Janma Nakshatra + Special Lagnas */}
      <div className="grid gap-5 lg:grid-cols-2">
        <JanmaNakshatraCard kundli={kundli} />
        <SpecialLagnasCard kundli={kundli} />
      </div>

      {/* 4. Birth details footer */}
      <BirthSnapshotCard />
    </div>
  );
}