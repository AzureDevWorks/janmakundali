/**
 * Sidebar navigation structure. Order matters ? groups render top to bottom,
 * items render in array order within each group.
 */
export interface NavItem {
  key: string;
  label: string;
  hint?: string;
}

export interface NavGroup {
  key: string;
  label: string;
  icon: string;      // unicode glyph, use \u escapes
  items: NavItem[];
}

export const NAV_GROUPS: NavGroup[] = [
  {
    key: 'chart',
    label: 'Chart',
    icon: '\u0950',                    // OM symbol
    items: [
      { key: 'overview', label: 'Overview',            hint: 'Lagna, Sun, Moon & key details' },
      { key: 'vargas',   label: 'Divisional Charts',   hint: 'All 20 vargas (D1-D60)' },
      { key: 'planets',  label: 'Planets & Houses',    hint: 'Grahas, bhavas, aspects' },
    ],
  },
  {
    key: 'time',
    label: 'Time',
    icon: '\u23F3',                    // hourglass
    items: [
      { key: 'dashas', label: 'Vimshottari Dasha', hint: 'Maha, Antar, Pratyantar' },
      { key: 'gochar', label: 'Live Transits',     hint: 'Current planetary positions' },
      { key: 'panchang', label: 'Panchang & Muhurta', hint: 'Daily almanac & auspicious windows' },
      { key: 'transit-calendar', label: 'Transit Calendar', hint: 'Upcoming planetary events' },
    ],
  },
  {
    key: 'strength',
    label: 'Strength',
    icon: '\u26A1',                    // lightning
    items: [
      { key: 'ashtakavarga', label: 'Ashtakavarga', hint: 'Bindu grids & house strengths' },
    ],
  },
  {
    key: 'jaimini',
    label: 'Jaimini',
    icon: '\uD83D\uDD2E',              // crystal ball
    items: [
      { key: 'chalit', label: 'Chalit & Arudha', hint: 'Bhava shifts & reflected images' },
    ],
  },
  {
    key: 'kp',
    label: 'KP',
    icon: '\uD83D\uDD2F',              // om symbol alternative
    items: [
      { key: 'kp', label: 'KP System', hint: 'Cusps, sub-lords, significators' },
    ],
  },
  {
    key: 'guidance',
    label: 'Guidance',
    icon: '\uD83D\uDCD6',              // book
    items: [
      { key: 'predictions', label: 'Life Predictions', hint: 'Career, wealth, marriage' },
      { key: 'report',      label: 'Full Report',      hint: 'Complete multi-system reading' },
    ],
  },
];

/** Flat lookup: section key -> group. Used for breadcrumbs. */
export function groupOf(sectionKey: string): NavGroup | undefined {
  return NAV_GROUPS.find((g) => g.items.some((i) => i.key === sectionKey));
}

export function labelOf(sectionKey: string): string {
  for (const g of NAV_GROUPS) {
    const item = g.items.find((i) => i.key === sectionKey);
    if (item) return item.label;
  }
  return sectionKey;
}