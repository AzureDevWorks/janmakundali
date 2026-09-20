import { useKundli } from '@/features/kundli/useKundli';
import { PlanetTable } from '@/components/cards/PlanetTable';
import { HouseTable } from '@/components/cards/HouseTable';
import { DrishtiCard } from '@/components/cards/DrishtiCard';

export function PlanetsTab() {
  const { data: kundli } = useKundli();

  return (
    <div className="space-y-4">
      <PlanetTable kundli={kundli} />
      <div className="grid gap-4 lg:grid-cols-2">
        <HouseTable kundli={kundli} />
        <DrishtiCard kundli={kundli} />
      </div>
    </div>
  );
}