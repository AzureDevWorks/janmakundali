import {
  ICONS,
  DIGNITY_COLORS,
  colorForPlanet as themeColorForPlanet,
  colorForRashi as themeColorForRashi,
  type ColorSet,
} from '@/theme';

export interface RashiEntry {
  index: number;
  name: string;
  english: string;
  symbol: string;
  element: 'Fire' | 'Earth' | 'Air' | 'Water';
  lord: string;
}

export const RASHIS: RashiEntry[] = [
  { index: 0,  name: 'Mesha',     english: 'Aries',       symbol: ICONS.zodiac.Mesha,     element: 'Fire',  lord: 'Mars'    },
  { index: 1,  name: 'Vrishabha', english: 'Taurus',      symbol: ICONS.zodiac.Vrishabha, element: 'Earth', lord: 'Venus'   },
  { index: 2,  name: 'Mithuna',   english: 'Gemini',      symbol: ICONS.zodiac.Mithuna,   element: 'Air',   lord: 'Mercury' },
  { index: 3,  name: 'Karka',     english: 'Cancer',      symbol: ICONS.zodiac.Karka,     element: 'Water', lord: 'Moon'    },
  { index: 4,  name: 'Simha',     english: 'Leo',         symbol: ICONS.zodiac.Simha,     element: 'Fire',  lord: 'Sun'     },
  { index: 5,  name: 'Kanya',     english: 'Virgo',       symbol: ICONS.zodiac.Kanya,     element: 'Earth', lord: 'Mercury' },
  { index: 6,  name: 'Tula',      english: 'Libra',       symbol: ICONS.zodiac.Tula,      element: 'Air',   lord: 'Venus'   },
  { index: 7,  name: 'Vrischika', english: 'Scorpio',     symbol: ICONS.zodiac.Vrischika, element: 'Water', lord: 'Mars'    },
  { index: 8,  name: 'Dhanus',    english: 'Sagittarius', symbol: ICONS.zodiac.Dhanus,    element: 'Fire',  lord: 'Jupiter' },
  { index: 9,  name: 'Makara',    english: 'Capricorn',   symbol: ICONS.zodiac.Makara,    element: 'Earth', lord: 'Saturn'  },
  { index: 10, name: 'Kumbha',    english: 'Aquarius',    symbol: ICONS.zodiac.Kumbha,    element: 'Air',   lord: 'Saturn'  },
  { index: 11, name: 'Meena',     english: 'Pisces',      symbol: ICONS.zodiac.Meena,     element: 'Water', lord: 'Jupiter' },
];

export const PLANET_ABBR: Record<string, string> = {
  Sun: 'Su', Moon: 'Mo', Mars: 'Ma', Mercury: 'Me',
  Jupiter: 'Ju', Venus: 'Ve', Saturn: 'Sa', Rahu: 'Ra', Ketu: 'Ke',
  Uranus: 'Ur', Neptune: 'Ne', Pluto: 'Pl',
};

export const PLANET_GLYPH: Record<string, string> = {
  Sun:     ICONS.planet.Sun,
  Moon:    ICONS.planet.Moon,
  Mars:    ICONS.planet.Mars,
  Mercury: ICONS.planet.Mercury,
  Jupiter: ICONS.planet.Jupiter,
  Venus:   ICONS.planet.Venus,
  Saturn:  ICONS.planet.Saturn,
  Rahu:    ICONS.planet.Rahu,
  Ketu:    ICONS.planet.Ketu,
  Uranus:  ICONS.outer.Uranus,
  Neptune: ICONS.outer.Neptune,
  Pluto:   ICONS.outer.Pluto,
};

export const CLASSICAL_PLANETS = [
  'Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu',
];
export const OUTER_PLANETS = ['Uranus', 'Neptune', 'Pluto'];
export const ALL_PLANETS = [...CLASSICAL_PLANETS, ...OUTER_PLANETS];

const ENGLISH_TO_CANONICAL: Record<string, string> = {
  Aries: 'Mesha', Taurus: 'Vrishabha', Gemini: 'Mithuna', Cancer: 'Karka',
  Leo: 'Simha', Virgo: 'Kanya', Libra: 'Tula', Scorpio: 'Vrischika',
  Sagittarius: 'Dhanus', Capricorn: 'Makara', Aquarius: 'Kumbha', Pisces: 'Meena',
};

export function rashiByName(name?: string): RashiEntry {
  if (!name) return RASHIS[0];
  const canonical = ENGLISH_TO_CANONICAL[name] ?? name;
  return RASHIS.find((r) => r.name === canonical) ?? RASHIS[0];
}

export function rashiByIndex(i: number): RashiEntry {
  return RASHIS[((i % 12) + 12) % 12];
}

export const DIGNITY_TONE = DIGNITY_COLORS;
export const planetColor = themeColorForPlanet;
export const rashiColor = themeColorForRashi;
export type { ColorSet };

export function housesByPlanet(kundli: any): Record<string, number> {
  const map: Record<string, number> = {};
  (kundli?.houses ?? []).forEach((h: any) => {
    (h.planets ?? []).forEach((p: string) => { map[p] = h.number; });
  });
  return map;
}

export function planetsByRashi(chart: any): Record<number, string[]> {
  const out: Record<number, string[]> = {};
  const planets = chart?.planets ?? {};
  for (const [name, p] of Object.entries<any>(planets)) {
    if (!CLASSICAL_PLANETS.includes(name)) continue;
    const rashiName = p?.rashiName;
    if (!rashiName) continue;
    const idx = rashiByName(rashiName).index;
    (out[idx] ??= []).push(name);
  }
  return out;
}

export function fmtDMS(d?: number, m?: number, s?: number): string {
  const dd = d ?? 0;
  const mm = String(m ?? 0).padStart(2, '0');
  const ss = String(s ?? 0).padStart(2, '0');
  return dd + '\u00B0 ' + mm + "' " + ss + '"';
}

export const TITHI_NAMES: string[] = [
  'Pratipada', 'Dwitiya', 'Tritiya', 'Chaturthi', 'Panchami',
  'Shashthi', 'Saptami', 'Ashtami', 'Navami', 'Dashami',
  'Ekadashi', 'Dwadashi', 'Trayodashi', 'Chaturdashi', 'Purnima',
  'Pratipada', 'Dwitiya', 'Tritiya', 'Chaturthi', 'Panchami',
  'Shashthi', 'Saptami', 'Ashtami', 'Navami', 'Dashami',
  'Ekadashi', 'Dwadashi', 'Trayodashi', 'Chaturdashi', 'Amavasya',
];

export const NAKSHATRA_NAMES: string[] = [
  'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra',
  'Punarvasu', 'Pushya', 'Ashlesha', 'Magha', 'Purva Phalguni',
  'Uttara Phalguni', 'Hasta', 'Chitra', 'Swati', 'Vishakha',
  'Anuradha', 'Jyeshtha', 'Mula', 'Purva Ashadha', 'Uttara Ashadha',
  'Shravana', 'Dhanishta', 'Shatabhisha', 'Purva Bhadrapada',
  'Uttara Bhadrapada', 'Revati',
];

export const YOGA_NAMES: string[] = [
  'Vishkambha', 'Priti', 'Ayushman', 'Saubhagya', 'Shobhana',
  'Atiganda', 'Sukarma', 'Dhriti', 'Shula', 'Ganda',
  'Vriddhi', 'Dhruva', 'Vyaghata', 'Harshana', 'Vajra',
  'Siddhi', 'Vyatipata', 'Variyana', 'Parigha', 'Shiva',
  'Siddha', 'Sadhya', 'Shubha', 'Shukla', 'Brahma',
  'Indra', 'Vaidhriti',
];

export const VARA_NAMES: string[] = [
  'Ravivara', 'Somavara', 'Mangalavara', 'Budhavara',
  'Guruvara', 'Shukravara', 'Shanivara',
];

export const VARA_ENGLISH: string[] = [
  'Sunday', 'Monday', 'Tuesday', 'Wednesday',
  'Thursday', 'Friday', 'Saturday',
];