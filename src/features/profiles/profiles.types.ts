import type { BirthProfile } from '@/features/birth/birthStore';

/** A row from the Supabase `public.profiles` table (snake_case). */
export interface StoredProfile {
  id: string;
  user_id: string;
  name: string;
  relation: string | null;
  birth_date: string;
  birth_time: string;
  latitude: number;
  longitude: number;
  place_name: string;
  timezone: string;
  utc_offset: string;
  ayanamsa: string;
  house_system: string;
  created_at: string;
  updated_at: string;
}

/** Convert a DB row to the app's BirthProfile shape. */
export function storedToBirthProfile(s: StoredProfile): BirthProfile {
  return {
    name: s.name,
    birthDate: s.birth_date,
    birthTime: s.birth_time.slice(0, 5),
    place: {
      displayName: s.place_name,
      latitude: s.latitude,
      longitude: s.longitude,
      timezone: s.timezone,
      utcOffset: s.utc_offset,
    },
    ayanamsa: s.ayanamsa as any,
    houseSystem: s.house_system as any,
  };
}

/** Convert a BirthProfile to an insert/update payload. */
export function birthProfileToRow(p: BirthProfile, userId: string) {
  return {
    user_id: userId,
    name: p.name,
    birth_date: p.birthDate,
    birth_time: p.birthTime.length === 5 ? p.birthTime + ':00' : p.birthTime,
    latitude: p.place.latitude,
    longitude: p.place.longitude,
    place_name: p.place.displayName,
    timezone: p.place.timezone,
    utc_offset: p.place.utcOffset,
    ayanamsa: p.ayanamsa,
    house_system: p.houseSystem,
  };
}