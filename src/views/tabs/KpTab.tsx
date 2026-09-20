import { useKundli } from '@/features/kundli/useKundli';
import { KpCard } from '@/components/cards/KpCard';
import { KpSignificatorsCard } from '@/components/cards/KpSignificatorsCard';

export function KpTab() {
  const { data: kundli } = useKundli();

  return (
    <div className="space-y-4">
      <KpCard kundli={kundli} />
      <KpSignificatorsCard kundli={kundli} />
    </div>
  );
}