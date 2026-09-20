/**
 * ==================================================================
 *   THE MASTER THEME FILE
 * ==================================================================
 * Change ANY icon, color, or font in this ONE file.
 * All non-ASCII glyphs are built from numeric Unicode code points.
 * ==================================================================
 */

const ch = (...codes: number[]) => String.fromCharCode(...codes);

/* ------------------------------------------------------------------ *
 * ICONS
 * ------------------------------------------------------------------ */

export const ICONS = {
  zodiac: {
    Mesha:     ch(0x2648),
    Vrishabha: ch(0x2649),
    Mithuna:   ch(0x264A),
    Karka:     ch(0x264B),
    Simha:     ch(0x264C),
    Kanya:     ch(0x264D),
    Tula:      ch(0x264E),
    Vrischika: ch(0x264F),
    Dhanus:    ch(0x2650),
    Makara:    ch(0x2651),
    Kumbha:    ch(0x2652),
    Meena:     ch(0x2653),
  },
  planet: {
    Sun:     ch(0x2609),
    Moon:    ch(0x263D),
    Mars:    ch(0x2642),
    Mercury: ch(0x263F),
    Jupiter: ch(0x2643),
    Venus:   ch(0x2640),
    Saturn:  ch(0x2644),
    Rahu:    ch(0x260A),
    Ketu:    ch(0x260B),
  },
  outer: {
    Uranus:  ch(0x2645),
    Neptune: ch(0x2646),
    Pluto:   ch(0x2647),
  },
  ui: {
    om:         ch(0x0950),
    dot:        ch(0x00B7),
    emDash:     ch(0x2014),
    check:      ch(0x2705),
    cross:      ch(0x274C),
    warn:       ch(0x26A0, 0xFE0F),
    arrow:      ch(0x2192),
    biArrow:    ch(0x2194),
    triRight:   ch(0x25B8),
    triDown:    ch(0x25BE),
    triUp:      ch(0x25B4),
    diamond:    ch(0x25C6),
    bullet:     ch(0x25CF),
    doubleDanda: ch(0x0965),
  },
} as const;

/* ------------------------------------------------------------------ *
 * COLORS
 * ------------------------------------------------------------------ */

export interface ColorSet {
  text: string;
  bg: string;
  border: string;
  chip: string;
  dot: string;
}

export const RASHI_ELEMENT_COLORS: Record<string, ColorSet> = {
  Fire:  { text: 'text-red-600',     bg: 'bg-red-50',     border: 'border-red-200',     chip: 'bg-red-100 border-red-300 text-red-950',         dot: 'bg-red-500'     },
  Earth: { text: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200', chip: 'bg-emerald-100 border-emerald-300 text-emerald-950', dot: 'bg-emerald-500' },
  Air:   { text: 'text-sky-600',     bg: 'bg-sky-50',     border: 'border-sky-200',     chip: 'bg-sky-100 border-sky-300 text-sky-950',         dot: 'bg-sky-500'     },
  Water: { text: 'text-blue-600',    bg: 'bg-blue-50',    border: 'border-blue-200',    chip: 'bg-blue-100 border-blue-300 text-blue-950',      dot: 'bg-blue-500'    },
};

export const RASHI_COLOR_OVERRIDES: Partial<Record<string, ColorSet>> = {
  Mesha: {
    text:   'text-purple-700',
    bg:     'bg-purple-50',
    border: 'border-purple-200',
    chip:   'bg-purple-100 border-purple-300 text-purple-950',
    dot:    'bg-purple-500',
  },
};

export const PLANET_COLORS: Record<string, ColorSet> = {
  Sun:     { text: 'text-amber-700',   bg: 'bg-amber-50',   border: 'border-amber-200',   chip: 'bg-amber-100 border-amber-300 text-amber-950',       dot: 'bg-amber-500'   },
  Moon:    { text: 'text-slate-700',   bg: 'bg-slate-50',   border: 'border-slate-200',   chip: 'bg-slate-100 border-slate-300 text-slate-900',       dot: 'bg-slate-400'   },
  Mars:    { text: 'text-red-700',     bg: 'bg-red-50',     border: 'border-red-200',     chip: 'bg-red-100 border-red-300 text-red-950',             dot: 'bg-red-500'     },
  Mercury: { text: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200', chip: 'bg-emerald-100 border-emerald-300 text-emerald-950', dot: 'bg-emerald-500' },
  Jupiter: { text: 'text-yellow-700',  bg: 'bg-yellow-50',  border: 'border-yellow-200',  chip: 'bg-yellow-100 border-yellow-300 text-yellow-950',    dot: 'bg-yellow-500'  },
  Venus:   { text: 'text-pink-700',    bg: 'bg-pink-50',    border: 'border-pink-200',    chip: 'bg-pink-100 border-pink-300 text-pink-950',          dot: 'bg-pink-500'    },
  Saturn:  { text: 'text-indigo-700',  bg: 'bg-indigo-50',  border: 'border-indigo-200',  chip: 'bg-indigo-100 border-indigo-300 text-indigo-950',    dot: 'bg-indigo-500'  },
  Rahu:    { text: 'text-violet-700',  bg: 'bg-violet-50',  border: 'border-violet-200',  chip: 'bg-violet-100 border-violet-300 text-violet-950',    dot: 'bg-violet-500'  },
  Ketu:    { text: 'text-stone-700',   bg: 'bg-stone-50',   border: 'border-stone-200',   chip: 'bg-stone-100 border-stone-300 text-stone-900',       dot: 'bg-stone-500'   },
  Uranus:  { text: 'text-cyan-700',    bg: 'bg-cyan-50',    border: 'border-cyan-200',    chip: 'bg-cyan-100 border-cyan-300 text-cyan-950',          dot: 'bg-cyan-500'    },
  Neptune: { text: 'text-blue-700',    bg: 'bg-blue-50',    border: 'border-blue-200',    chip: 'bg-blue-100 border-blue-300 text-blue-950',          dot: 'bg-blue-500'    },
  Pluto:   { text: 'text-fuchsia-700', bg: 'bg-fuchsia-50', border: 'border-fuchsia-200', chip: 'bg-fuchsia-100 border-fuchsia-300 text-fuchsia-950', dot: 'bg-fuchsia-500' },
};

export const DIGNITY_COLORS: Record<string, string> = {
  exalted:      'bg-emerald-100 text-emerald-800 ring-emerald-200',
  moolatrikona: 'bg-lime-100 text-lime-800 ring-lime-200',
  own:          'bg-sky-100 text-sky-800 ring-sky-200',
  friendly:     'bg-teal-100 text-teal-800 ring-teal-200',
  neutral:      'bg-stone-100 text-stone-700 ring-stone-200',
  enemy:        'bg-orange-100 text-orange-800 ring-orange-200',
  debilitated:  'bg-red-100 text-red-800 ring-red-200',
};

export const SEMANTIC_COLORS = {
  shubha:  'bg-emerald-100 text-emerald-800 ring-emerald-200',
  ashubha: 'bg-red-100 text-red-800 ring-red-200',
  neutral: 'bg-stone-100 text-stone-700 ring-stone-200',
  lagna:   'bg-red-600 text-white',
} as const;

/* ------------------------------------------------------------------ *
 * TYPOGRAPHY
 * ------------------------------------------------------------------ */

export const TYPOGRAPHY = {
  heading: 'font-serif',
  body:    'font-sans',
  mono:    'font-mono',
  sizes: {
    hero:    'text-3xl',
    heading: 'text-2xl',
    subhead: 'text-lg',
    body:    'text-sm',
    small:   'text-xs',
    tiny:    'text-[10px]',
  },
} as const;

/* ------------------------------------------------------------------ *
 * HELPERS
 * ------------------------------------------------------------------ */

export function iconForRashi(name: string): string {
  return ICONS.zodiac[name as keyof typeof ICONS.zodiac] ?? ch(0x25CB);
}

export function iconForPlanet(name: string): string {
  return (
    ICONS.planet[name as keyof typeof ICONS.planet] ??
    ICONS.outer[name as keyof typeof ICONS.outer] ??
    ch(0x25CF)
  );
}

export function colorForRashi(
  element: 'Fire' | 'Earth' | 'Air' | 'Water',
  rashiName?: string,
): ColorSet {
  if (rashiName && RASHI_COLOR_OVERRIDES[rashiName]) {
    return RASHI_COLOR_OVERRIDES[rashiName]!;
  }
  return RASHI_ELEMENT_COLORS[element];
}

export function colorForPlanet(name: string): ColorSet {
  return PLANET_COLORS[name] ?? PLANET_COLORS.Sun;
}

/* ------------------------------------------------------------------ *
 * HOUSE COLORS
 * 12 distinct colors, one per house (1-indexed: HOUSE_COLORS[0] = H1).
 * Each set provides Tailwind classes for HTML cells and raw values
 * for SVG rendering (North Indian chart).
 * ------------------------------------------------------------------ */

export interface HouseColorSet {
  name: string;
  bgGrad: string;
  border: string;
  text: string;
  symbol: string;
  numBg: string;
  numText: string;
  chip: string;
  fill: string;
  stroke: string;
  svgText: string;
}

export const HOUSE_COLORS: HouseColorSet[] = [
  // H1 - Lagna (red)
  { name: 'Red',     bgGrad: 'from-red-50 via-red-50/40 to-red-100/40',         border: 'border-red-200',     text: 'text-red-950',     symbol: 'text-red-600',     numBg: 'bg-red-500',     numText: 'text-white', chip: 'border-red-200 bg-red-100/80 text-red-950',         fill: '#fef2f2', stroke: '#ef4444', svgText: '#7f1d1d' },
  // H2 - Dhana (orange)
  { name: 'Orange',  bgGrad: 'from-orange-50 via-orange-50/40 to-orange-100/40', border: 'border-orange-200', text: 'text-orange-950', symbol: 'text-orange-600', numBg: 'bg-orange-500', numText: 'text-white', chip: 'border-orange-200 bg-orange-100/80 text-orange-950',   fill: '#fff7ed', stroke: '#f97316', svgText: '#7c2d12' },
  // H3 - Sahaja (amber)
  { name: 'Amber',   bgGrad: 'from-amber-50 via-amber-50/40 to-amber-100/40',   border: 'border-amber-200',   text: 'text-amber-950',  symbol: 'text-amber-600',  numBg: 'bg-amber-500',  numText: 'text-white', chip: 'border-amber-200 bg-amber-100/80 text-amber-950',     fill: '#fffbeb', stroke: '#f59e0b', svgText: '#78350f' },
  // H4 - Sukha (yellow)
  { name: 'Yellow',  bgGrad: 'from-yellow-50 via-yellow-50/40 to-yellow-100/40', border: 'border-yellow-200', text: 'text-yellow-950', symbol: 'text-yellow-600', numBg: 'bg-yellow-500', numText: 'text-white', chip: 'border-yellow-200 bg-yellow-100/80 text-yellow-950',   fill: '#fefce8', stroke: '#eab308', svgText: '#713f12' },
  // H5 - Putra (lime)
  { name: 'Lime',    bgGrad: 'from-lime-50 via-lime-50/40 to-lime-100/40',     border: 'border-lime-200',   text: 'text-lime-950',   symbol: 'text-lime-600',   numBg: 'bg-lime-500',   numText: 'text-white', chip: 'border-lime-200 bg-lime-100/80 text-lime-950',         fill: '#f7fee7', stroke: '#84cc16', svgText: '#3f6212' },
  // H6 - Ripu (emerald)
  { name: 'Emerald', bgGrad: 'from-emerald-50 via-emerald-50/40 to-emerald-100/40', border: 'border-emerald-200', text: 'text-emerald-950', symbol: 'text-emerald-600', numBg: 'bg-emerald-500', numText: 'text-white', chip: 'border-emerald-200 bg-emerald-100/80 text-emerald-950', fill: '#ecfdf5', stroke: '#10b981', svgText: '#064e3b' },
  // H7 - Kalatra (teal)
  { name: 'Teal',    bgGrad: 'from-teal-50 via-teal-50/40 to-teal-100/40',     border: 'border-teal-200',   text: 'text-teal-950',   symbol: 'text-teal-600',   numBg: 'bg-teal-500',   numText: 'text-white', chip: 'border-teal-200 bg-teal-100/80 text-teal-950',         fill: '#f0fdfa', stroke: '#14b8a6', svgText: '#134e4a' },
  // H8 - Randhra (sky)
  { name: 'Sky',     bgGrad: 'from-sky-50 via-sky-50/40 to-sky-100/40',         border: 'border-sky-200',    text: 'text-sky-950',    symbol: 'text-sky-600',    numBg: 'bg-sky-500',    numText: 'text-white', chip: 'border-sky-200 bg-sky-100/80 text-sky-950',           fill: '#f0f9ff', stroke: '#0ea5e9', svgText: '#0c4a6e' },
  // H9 - Dharma (blue)
  { name: 'Blue',    bgGrad: 'from-blue-50 via-blue-50/40 to-blue-100/40',     border: 'border-blue-200',   text: 'text-blue-950',   symbol: 'text-blue-600',   numBg: 'bg-blue-500',   numText: 'text-white', chip: 'border-blue-200 bg-blue-100/80 text-blue-950',         fill: '#eff6ff', stroke: '#3b82f6', svgText: '#1e3a8a' },
  // H10 - Karma (indigo)
  { name: 'Indigo',  bgGrad: 'from-indigo-50 via-indigo-50/40 to-indigo-100/40', border: 'border-indigo-200', text: 'text-indigo-950', symbol: 'text-indigo-600', numBg: 'bg-indigo-500', numText: 'text-white', chip: 'border-indigo-200 bg-indigo-100/80 text-indigo-950',   fill: '#eef2ff', stroke: '#6366f1', svgText: '#312e81' },
  // H11 - Labha (violet)
  { name: 'Violet',  bgGrad: 'from-violet-50 via-violet-50/40 to-violet-100/40', border: 'border-violet-200', text: 'text-violet-950', symbol: 'text-violet-600', numBg: 'bg-violet-500', numText: 'text-white', chip: 'border-violet-200 bg-violet-100/80 text-violet-950',   fill: '#f5f3ff', stroke: '#8b5cf6', svgText: '#4c1d95' },
  // H12 - Vyaya (pink)
  { name: 'Pink',    bgGrad: 'from-pink-50 via-pink-50/40 to-pink-100/40',     border: 'border-pink-200',   text: 'text-pink-950',   symbol: 'text-pink-600',   numBg: 'bg-pink-500',   numText: 'text-white', chip: 'border-pink-200 bg-pink-100/80 text-pink-950',         fill: '#fdf2f8', stroke: '#ec4899', svgText: '#831843' },
];

/** Convenience helper: house numbers are 1-indexed */
export function colorForHouse(houseNumber: number): HouseColorSet {
  return HOUSE_COLORS[((houseNumber - 1) % 12 + 12) % 12];
}