import { useQuery } from '@tanstack/react-query';
import { Observer } from '@prisri/jyotish';
import { useCurrentLocation } from '@/features/location/useCurrentLocation';
import { useBirthStore } from '@/features/birth/birthStore';
import { findUpcomingEvents, type PlanetaryEvent } from './events';

export interface UpcomingEventsResult {
  events: PlanetaryEvent[];
  /** IANA timezone of the observer, e.g. 'America/New_York' */
  timezone: string | null;
  /** Human label for the observer location */
  locationLabel: string;
  /** Where the observer came from */
  source: 'gps' | 'ip' | 'profile' | 'manual';
}

export function useUpcomingEvents(daysAhead = 60) {
  const { location } = useCurrentLocation();
  const profile = useBirthStore((s) => s.profile);

  const coords = location
    ? { latitude: location.latitude, longitude: location.longitude }
    : profile
      ? { latitude: profile.place.latitude, longitude: profile.place.longitude }
      : null;

  const timezone = location?.timezone ?? profile?.place.timezone ?? null;
  const locationLabel = location
    ? [location.city, location.region, location.country].filter(Boolean).join(', ')
    : profile?.place.displayName ?? 'Birth place';

  const dayKey = new Date().toISOString().slice(0, 10);

  const q = useQuery<PlanetaryEvent[]>({
    enabled: !!coords,
    queryKey: coords
      ? ['upcoming-events', dayKey, coords.latitude, coords.longitude, daysAhead]
      : ['upcoming-events', 'none'],
    queryFn: async () => {
      const observer = new Observer(coords!.latitude, coords!.longitude, 0);
      return findUpcomingEvents(new Date(), daysAhead, observer);
    },
    staleTime: 12 * 60 * 60 * 1000,
    gcTime:    24 * 60 * 60 * 1000,
  });

  return {
    ...q,
    data: q.data
      ? {
          events: q.data,
          timezone,
          locationLabel,
          source: location?.source ?? 'profile',
        }
      : undefined,
  };
}