/**
 * Classical Jyotish references for the six special lagnas.
 *
 * ZERO non-ASCII characters in this file. Every Devanagari glyph and
 * punctuation mark is built from numeric code points via deva(). This
 * is bulletproof against editor, terminal, or PS encoding corruption.
 */

/** Build a string from Unicode code points. Pure ASCII source. */
const deva = (...codes: number[]) => String.fromCharCode(...codes);

/* Devanagari strings ? built from code points, never from raw characters. */
const DEVANAGARI = {
  // vishesha lagna = "special lagna"
  visheshaLagna: deva(0x0935, 0x093F, 0x0936, 0x0947, 0x0937, 0x0020, 0x0932, 0x0917, 0x094D, 0x0928),
  ghatika:       deva(0x0918, 0x091F, 0x093F, 0x0915, 0x093E),
  hora:          deva(0x0939, 0x094B, 0x0930, 0x093E),
  bhava:         deva(0x092D, 0x093E, 0x0935),
  shree:         deva(0x0936, 0x094D, 0x0930, 0x0940),
  indu:          deva(0x0907, 0x0928, 0x094D, 0x0926, 0x0941),
  pranapada:     deva(0x092A, 0x094D, 0x0930, 0x093E, 0x0923, 0x092A, 0x0926),
  om:            deva(0x0950),
  dot:           deva(0x00B7),
  emDash:        deva(0x2014),
};

export const SANSKRIT_TITLE = DEVANAGARI.visheshaLagna;
export const OM = DEVANAGARI.om;
export const DOT = DEVANAGARI.dot;

/* ------------------------------------------------------------------ *
 * Special lagna metadata
 * ------------------------------------------------------------------ */

export interface SpecialLagnaMeta {
  key: string;
  name: string;
  sanskrit: string;
  tag: string;
  meaning: string;
  citation: string;
  motion: string;
}

export const SPECIAL_LAGNA_META: SpecialLagnaMeta[] = [
  {
    key: 'ghatikaLagna',
    name: 'Ghatika',
    sanskrit: DEVANAGARI.ghatika,
    tag: 'Power and authority',
    meaning:
      'Executive authority, bureaucratic power, political favour, and high fame. A strong Ghatika Lagna in a royal or political chart indicates access to positions of institutional command. Planets in the 1st, 4th, 7th, or 10th from Ghatika strengthen political fortune.',
    citation: 'BPHS Ch. 5',
    motion: 'One sign per 24 minutes (1 ghati) from the Sun',
  },
  {
    key: 'horaLagna',
    name: 'Hora',
    sanskrit: DEVANAGARI.hora,
    tag: 'Wealth',
    meaning:
      'Financial riches, wealth preservation, and liquid cash. The premier lagna for wealth. Where the 2nd house shows accumulated resources, Hora Lagna shows money as flow. Planets in kendras from the Hora Lagna strengthen financial prospects.',
    citation: 'BPHS Ch. 6 / Brihat Jataka Ch. 3',
    motion: 'One sign per 60 minutes (2.5 ghatis) from the Sun',
  },
  {
    key: 'bhavaLagna',
    name: 'Bhava',
    sanskrit: DEVANAGARI.bhava,
    tag: 'Vitality',
    meaning:
      'Physical foundation, health, and bodily vitality. Represents the material substrate of the body - bone, blood, tissue. Where Lagna shows appearance, Bhava Lagna shows physiological resilience. Planets in the 6th, 8th, or 12th from Bhava Lagna indicate chronic vulnerabilities.',
    citation: 'BPHS Ch. 5 / Phaladeepika Ch. 6',
    motion: 'One sign per 120 minutes (5 ghatis) from the Sun',
  },
  {
    key: 'shreeLagna',
    name: 'Shree',
    sanskrit: DEVANAGARI.shree,
    tag: 'Prosperity',
    meaning:
      'Divine fortune, Lakshmi grace, marital wealth, and ancestral blessing. Indicates grace that arrives without effort. Planets in the 2nd from Shree Lagna augment wealth; planets in the 8th from it indicate financial loss through marriage or inheritance.',
    citation: 'Jaimini Sutras / Saravali',
    motion: 'From the Moon nakshatra traversal, projected to the Lagna',
  },
  {
    key: 'induLagna',
    name: 'Indu',
    sanskrit: DEVANAGARI.indu,
    tag: 'Dhana yoga',
    meaning:
      'Wealth potential and financial dharma. Sum of rays (kalas) of the 9th lords from Lagna and Moon, counted from the Moon. A classical test for Dhana Yoga. A stronger kala sum indicates higher wealth potential. Planets in the 2nd, 5th, 9th, and 11th from Indu are the wealth-giving planets.',
    citation: 'Jataka Parijata Ch. 12',
    motion: 'Computed from rays of the 9th lords from Lagna and Moon',
  },
  {
    key: 'pranapadaLagna',
    name: 'Pranapada',
    sanskrit: DEVANAGARI.pranapada,
    tag: 'Rectification',
    meaning:
      'The seat of the life force (prana). Used for birth-time rectification - when natal data is uncertain, the Pranapada reveals the true moment of birth. Classical practice moves the birth time in small increments until Pranapada aligns with known life events.',
    citation: 'BPHS Ch. 5 / Muhurta Chintamani Ch. 3',
    motion: 'From elapsed vighatis from sunrise, mapped to the Sun sign modality',
  },
];

/* ------------------------------------------------------------------ *
 * Classical sources
 * ------------------------------------------------------------------ */

export interface SpecialLagnaSource {
  abbr: string;
  title: string;
  author: string;
  period: string;
  chapter: string;
  covers: string;
}

export const SPECIAL_LAGNA_SOURCES: SpecialLagnaSource[] = [
  {
    abbr: 'BPHS-5',
    title: 'Brihat Parashara Hora Shastra',
    author: 'Sage Parashara',
    period: 'Classical',
    chapter: 'Chapter 5 - Special Ascendants',
    covers:
      'Primary source for Ghatika, Hora, Bhava, and Pranapada lagnas. Defines their rates of motion from the Sun: Ghatika covers one sign per 24 minutes, Hora one sign per 60 minutes, Bhava one sign per 120 minutes.',
  },
  {
    abbr: 'BPHS-6',
    title: 'Brihat Parashara Hora Shastra',
    author: 'Sage Parashara',
    period: 'Classical',
    chapter: 'Chapter 6 - Evaluation of Divisional Charts',
    covers:
      'Expands on the Hora division and the Hora Lagna. Explains that Hora Lagna is the premier indicator of liquid wealth, cash flow, and financial reserves.',
  },
  {
    abbr: 'BJ',
    title: 'Brihat Jataka',
    author: 'Varahamihira',
    period: '6th century CE',
    chapter: 'Chapter 3 - Viyoni Janma',
    covers:
      'Early reference to the Hora Lagna for wealth analysis. Correlates the Hora Lagna with the Sun and Moon hora divisions to refine financial predictions.',
  },
  {
    abbr: 'JS',
    title: 'Jaimini Sutras',
    author: 'Sage Jaimini',
    period: 'Classical',
    chapter: 'Pada 1, Adhyaya 2',
    covers:
      'Introduces the Shree Lagna as the indicator of Lakshmi grace, divine fortune, and marital wealth. Calculated from the Moon nakshatra projected to the Lagna.',
  },
  {
    abbr: 'SV',
    title: 'Saravali',
    author: 'Kalyana Varma',
    period: 'Classical',
    chapter: 'Multiple Adhyayas',
    covers:
      'Elaborates Shree Lagna role in prosperity and marital harmony. Describes how planets in the 2nd from Shree Lagna augment wealth.',
  },
  {
    abbr: 'JP',
    title: 'Jataka Parijata',
    author: 'Vaidyanatha Dikshita',
    period: 'Classical',
    chapter: 'Chapter 12 - Indu Lagna',
    covers:
      'Defines the Indu Lagna calculation using the rays (kalas) of the 9th lords from Lagna and Moon, counted from the Moon. The primary classical test for Dhana Yoga.',
  },
  {
    abbr: 'PD',
    title: 'Phaladeepika',
    author: 'Mantreswara',
    period: 'Classical',
    chapter: 'Chapter 6 - Bhava Lagna',
    covers:
      'Bhava Lagna as the foundation of physical vitality, health, and the material body. Used alongside the Lagna for physiological analysis.',
  },
  {
    abbr: 'MC',
    title: 'Muhurta Chintamani',
    author: 'Rama Daivajna',
    period: 'Classical',
    chapter: 'Chapter 3',
    covers:
      'Pranapada Lagna usage in birth-time rectification. The Pranapada traverses one sign per 90 minutes from the Sun, mapped to the Sun modality.',
  },
];