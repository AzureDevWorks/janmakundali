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
  setProfile: (p: BirthProfile) => void;
  reset: () => void;
}

export const useBirthStore = create<State>()(
  persist(
    (set) => ({
      profile: null,
      setProfile: (p) => set({ profile: p }),
      reset: () => set({ profile: null }),
    }),
    { name: 'janmakundali:profile', storage: createJSONStorage(() => localStorage) },
  ),
);