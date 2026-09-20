export interface ReferenceMeta {
  key: 'chandra' | 'surya';
  title: string;
  sanskrit: string;
  reference: string;
  referenceSanskrit: string;
  meaning: string;
  purpose: string[];
  classicalRef: string;
  tone: 'moon' | 'sun';
}

export const CHANDRA_META: ReferenceMeta = {
  key: 'chandra',
  title: 'Chandra Kundli',
  sanskrit: '\u091A\u0928\u094D\u0926\u094D\u0930 \u0915\u0941\u0923\u094D\u0921\u0932\u0940',
  reference: 'Moon',
  referenceSanskrit: '\u091A\u0928\u094D\u0926\u094D\u0930',
  meaning:
    'The Moon\u2019s natal sign becomes the first house. This chart reveals the mind, emotional patterns, and inner psychological world.',
  purpose: [
    'Assesses mental peace and emotional resilience',
    'Primary reference for all transit (gochar) predictions',
    'Reveals how the world feels rather than how it looks',
    'Foundation for Chandra Balam and Sade Sati analysis',
  ],
  classicalRef: 'BPHS Ch. 6 \u00B7 Used universally in gochar analysis',
  tone: 'moon',
};

export const SURYA_META: ReferenceMeta = {
  key: 'surya',
  title: 'Surya Kundli',
  sanskrit: '\u0938\u0942\u0930\u094D\u092F \u0915\u0941\u0923\u094D\u0921\u0932\u0940',
  reference: 'Sun',
  referenceSanskrit: '\u0938\u0942\u0930\u094D\u092F',
  meaning:
    'The Sun\u2019s natal sign becomes the first house. This chart reveals the soul, vitality, and relationship with authority.',
  purpose: [
    'Reveals soul purpose and life direction',
    'Indicates relationship with father and mentors',
    'Reflects executive authority and government relations',
    'Used alongside Janam Kundli for spiritual analysis',
  ],
  classicalRef: 'BPHS Ch. 6 \u00B7 Brihat Jataka Ch. 1',
  tone: 'sun',
};