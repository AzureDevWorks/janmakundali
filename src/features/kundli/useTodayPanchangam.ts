import { useQuery } from '@tanstack/react-query';
import { getPanchangamDetails, Observer } from '@prisri/jyotish';

/**
 * Panchang for "now" at whatever coordinates are passed in.
 * Location detection lives in useCurrentLocation — this hook just queries.
 */
export function useTodayPanchangam(coords: { latitude: number; longitude: number } | null) {
  // Round now to the nearest hour for cache stability
  const hourKey = Math.floor(Date.now() / 3_600_000);

  return useQuery({
    enabled: !!coords,
    queryKey: coords
      ? ['panchang-today', hourKey, coords.latitude, coords.longitude]
      : ['panchang-today', 'none'],
    queryFn: () => {
      const observer = new Observer(coords!.latitude, coords!.longitude, 0);
      return getPanchangamDetails(new Date(), observer);
    },
    staleTime: 55 * 60_000,
  });
}