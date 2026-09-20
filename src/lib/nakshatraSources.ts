/**
 * Classical Jyotish references for Janma Nakshatra.
 * Each entry cites a primary source text, its chapter, and what it covers.
 * Used by <JanmaNakshatraCard /> to show users the scriptural basis.
 *
 * All non-ASCII glyphs use JavaScript \u escapes so the source file
 * remains pure ASCII and cannot be corrupted by editor encodings.
 */

export interface NakshatraSource {
  /** Short abbreviation for badge display. */
  abbr: string;
  /** Full title of the classical text. */
  title: string;
  /** Author or attributed sage. */
  author: string;
  /** Approximate period. */
  period: string;
  /** Chapter reference. */
  chapter: string;
  /** What this source says about Janma Nakshatra. */
  covers: string;
}

export const NAKSHATRA_SOURCES: NakshatraSource[] = [
  {
    abbr: 'BPHS',
    title: 'Brihat Parashara Hora Shastra',
    author: 'Sage Parashara',
    period: 'Classical',
    chapter: 'Chapter 46 \u2014 Vimshottari Dasha',
    covers:
      'Establishes that the Moon\u2019s nakshatra at birth determines the starting lord and balance of the Vimshottari dasha sequence. The 27 nakshatras are distributed among 9 planetary lords (3 each).',
  },
  {
    abbr: 'BJ',
    title: 'Brihat Jataka',
    author: 'Varahamihira',
    period: '6th century CE',
    chapter: 'Chapter 16 \u2014 Riksha-siladhyaya (Nakshatras)',
    covers:
      'Describes the results of births in each of the 27 nakshatras \u2014 personality, temperament, career inclination, and life themes arising from the Moon\u2019s asterism.',
  },
  {
    abbr: 'BS',
    title: 'Brihat Samhita',
    author: 'Varahamihira',
    period: '6th century CE',
    chapter: 'Chapter 15 \u2014 Nakshatra-vyuha (Array of Nakshatras)',
    covers:
      'Classifies the 27 nakshatras by deity, nature (sattvic/rajasic/tamasic), and quality (fixed/movable/dual) for use in muhurta and natal interpretation.',
  },
  {
    abbr: 'PD',
    title: 'Phaladeepika',
    author: 'Mantreswara',
    period: 'Classical',
    chapter: 'Multiple Adhyayas',
    covers:
      'Uses nakshatra padas for finer predictions of profession, wealth, and longevity. The nakshatra lord of a planet refines its expression in the chart.',
  },
  {
    abbr: 'SV',
    title: 'Saravali',
    author: 'Kalyana Varma',
    period: 'Classical',
    chapter: 'Nakshatra Dasas',
    covers:
      'Documents Moola Dasa and other nakshatra-based dasha systems that supplement Vimshottari for specific life-area analysis.',
  },
  {
    abbr: 'JP',
    title: 'Jataka Parijata',
    author: 'Vaidyanatha Dikshita',
    period: 'Classical',
    chapter: 'Chapter 18 \u2014 Nakshatra Jataka',
    covers:
      'Hints on Udu Dasa (nakshatra dasha) and how the birth star shapes the opening phase of life.',
  },
  {
    abbr: 'MC',
    title: 'Muhurta Chintamani',
    author: 'Rama Daivajna',
    period: 'Classical',
    chapter: 'Chapter 2 \u2014 Constellations',
    covers:
      'The Janma Nakshatra is used to determine auspicious timing for marriage, travel, and sacred rituals. Nakshatra virtue is central to electional astrology.',
  },
  {
    abbr: 'HS',
    title: 'Hora Sara',
    author: 'Prithuyasas (son of Varahamihira)',
    period: 'Classical',
    chapter: 'Chapter 31 \u2014 Nakshatra Jataka',
    covers:
      'Dasha calculations derived from the birth nakshatra, including the two additional factors for determining the opening dasha.',
  },
];

/** The three roles of Janma Nakshatra, each with a citation. */
export interface NakshatraRole {
  title: string;
  description: string;
  citation: string;
}

export const NAKSHATRA_ROLES: NakshatraRole[] = [
  {
    title: 'Dasha sequence',
    description:
      'The Moon\u2019s nakshatra at birth sets the Vimshottari starting lord and its remaining balance.',
    citation: 'BPHS Ch. 46',
  },
  {
    title: 'Gochar reference',
    description:
      'Transit houses are counted from the Janma Rashi (Moon sign), which is derived from the birth nakshatra.',
    citation: 'Classical transit rules',
  },
  {
    title: 'Ashtakoota compatibility',
    description:
      'Nadi, Yoni, and Gana kootas \u2014 three of the eight \u2014 are computed directly from the birth nakshatra.',
    citation: 'Ashtakoota Milan',
  },
];