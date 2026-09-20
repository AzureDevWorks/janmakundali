import { useKundli } from '@/features/kundli/useKundli';
import { AshtakavargaCard } from '@/components/cards/AshtakavargaCard';

export function AshtakavargaTab() {
  const { data: kundli } = useKundli();

  return <AshtakavargaCard kundli={kundli} />;
}