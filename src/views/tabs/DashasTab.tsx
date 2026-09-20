import { useKundli } from '@/features/kundli/useKundli';
import { VimshottariDasha } from '@/components/dashas/VimshottariDasha';

export function DashasTab() {
  const { data: kundli } = useKundli();

  return (
    <div className="space-y-5">
      <VimshottariDasha kundli={kundli} />
    </div>
  );
}