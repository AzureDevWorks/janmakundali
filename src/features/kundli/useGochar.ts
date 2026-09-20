import { useQuery } from '@tanstack/react-query';
import { getGocharAnalysis } from '@prisri/jyotish';

/**
 * Live transit analysis. Recomputed each time the browser loads a fresh
 * page or the kundli changes. `staleTime` is short because transits move
 * slowly (Saturn ~2.5yr / sign) but Moon changes sign every 2.5 days.
 */
export function useGochar(kundli: any) {
  return useQuery({
    enabled: !!kundli,
    queryKey: ['gochar', kundli?.birthDetails?.rawDate?.toString?.() ?? 'x',
              new Date().toDateString()],
    queryFn: () => getGocharAnalysis(kundli, new Date()),
    staleTime: 30 * 60_000,
  });
}