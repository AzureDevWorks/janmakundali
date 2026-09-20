import { useQuery } from '@tanstack/react-query';
import { getPanchangamDetails } from '@prisri/jyotish';
import { useBirthStore } from '@/features/birth/birthStore';
import { buildBirthDate, buildObserver } from './useKundli';

export function usePanchangam() {
  const profile = useBirthStore((s) => s.profile);
  return useQuery({
    enabled: !!profile,
    queryKey: profile
      ? ['panchang', profile.birthDate, profile.birthTime,
         profile.place.latitude, profile.place.longitude]
      : ['panchang', 'none'],
    queryFn: () => getPanchangamDetails(buildBirthDate(profile!), buildObserver(profile!)),
  });
}