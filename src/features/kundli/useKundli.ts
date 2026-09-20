import { useQuery } from '@tanstack/react-query';
import { getKundli, Observer } from '@prisri/jyotish';
import { useBirthStore } from '@/features/birth/birthStore';

export function buildBirthDate(profile: any) {
  return new Date(profile.birthDate + 'T' + profile.birthTime + ':00' + profile.place.utcOffset);
}

export function buildObserver(profile: any) {
  return new Observer(profile.place.latitude, profile.place.longitude, 0);
}

export function useKundli() {
  const profile = useBirthStore((s) => s.profile);
  return useQuery({
    enabled: !!profile,
    queryKey: profile
      ? ['kundli', profile.birthDate, profile.birthTime,
         profile.place.latitude, profile.place.longitude,
         profile.houseSystem, profile.ayanamsa]
      : ['kundli', 'none'],
    queryFn: () => getKundli(buildBirthDate(profile!), buildObserver(profile!), {
      ayanamsa: profile!.ayanamsa,
      houseSystem: profile!.houseSystem,
      includeChalit: true,
      includeKp: true,
      includeSpecialLagnas: true,
      includeArudhas: true,
      includeReferenceCharts: true,
    }),
  });
}