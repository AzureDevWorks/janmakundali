import { useKundli } from '@/features/kundli/useKundli';
import { ChalitCard } from '@/components/cards/ChalitCard';
import { ArudhaPadasCard } from '@/components/cards/ArudhaPadasCard';

export function ChalitTab() {
  const { data: kundli } = useKundli();

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <ChalitCard kundli={kundli} />
      <ArudhaPadasCard kundli={kundli} />
    </div>
  );
}