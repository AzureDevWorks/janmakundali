import { useQuery } from '@tanstack/react-query';
import { getComprehensiveReport } from '@prisri/jyotish';

/**
 * Single source of truth for every prediction.
 * getComprehensiveReport() returns career / wealth / marriage / remedies /
 * chalitAnalysis / kpAnalysis / lalKitabAnalysis / jaiminiKarakas as nested
 * sub-objects, plus a top-level summary and formattedMarkdown. One call,
 * one computation, eight cards read from it.
 */
export interface AllPredictions {
  summary: string;
  career: any;
  wealth: any;
  marriage: any;
  remedies: any;
  chalitAnalysis: any;
  kpAnalysis: any;
  lalKitabAnalysis: any;
  jaiminiKarakas: any;
  formattedMarkdown: string;
}

export function useAllPredictions(kundli: any) {
  return useQuery<AllPredictions>({
    enabled: !!kundli,
    queryKey: ['predictions', kundli?.birthDetails?.rawDate?.toString?.() ?? 'x'],
    queryFn: () => getComprehensiveReport(kundli) as AllPredictions,
    staleTime: 10 * 60_000,
  });
}