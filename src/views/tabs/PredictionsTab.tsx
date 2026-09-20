import { useKundli } from '@/features/kundli/useKundli';
import {
  CareerCard, WealthCard, MarriageCard,
  RemediesCard, JaiminiKarakasCard,
  ChalitAnalysisCard, KpAnalysisCard,
} from '@/components/cards/PredictionCards';
import { LalKitabCard } from '@/components/cards/LalKitabCard';

export function PredictionsTab() {
  const { data: kundli } = useKundli();

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <CareerCard kundli={kundli} />
      <WealthCard kundli={kundli} />
      <MarriageCard kundli={kundli} />
      <JaiminiKarakasCard kundli={kundli} />
      <ChalitAnalysisCard kundli={kundli} />
      <KpAnalysisCard kundli={kundli} />
      <div className="lg:col-span-2">
        <LalKitabCard kundli={kundli} />
      </div>
      <div className="lg:col-span-2">
        <RemediesCard kundli={kundli} />
      </div>
    </div>
  );
}