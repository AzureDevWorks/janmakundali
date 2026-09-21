import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type HouseSystem = 'whole_sign' | 'equal_house' | 'sripati' | 'placidus';
export type Ayanamsa = 'lahiri' | 'kp' | 'raman';

export interface BirthProfile {
  name: string;
  birthDate: string;
  birthTime: string;
  place: {
    displayName: string;
    latitude: number;
    longitude: number;
    timezone: string;
    utcOffset: string;
  };
  houseSystem: HouseSystem;
  ayanamsa: Ayanamsa;
}

interface State {
  profile: BirthProfile | null;
  /** Supabase row id when the current profile is a saved one, else null. */
  currentProfileId: string | null;

  setProfile: (p: BirthProfile) => void;
  setProfileWithId: (id: string, p: BirthProfile) => void;
  setCurrentProfileId: (id: string | null) => void;

  reset: () => void;
  resetProfile: () => void;
}

export const useBirthStore = create<State>()(
  persist(
    (set) => ({
      profile: null,
      currentProfileId: null,

      setProfile: (p) => set({ profile: p, currentProfileId: null }),
      setProfileWithId: (id, p) => set({ profile: p, currentProfileId: id }),
      setCurrentProfileId: (id) => set({ currentProfileId: id }),

      reset: () => set({ profile: null, currentProfileId: null }),
      resetProfile: () => set({ profile: null, currentProfileId: null }),
    }),
    {
      name: 'janmakundali:profile',
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({
        profile: s.profile,
        currentProfileId: s.currentProfileId,
      } as any),
    },
  ),
);