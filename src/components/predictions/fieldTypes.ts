export type Tone = 'amber' | 'green' | 'red' | 'stone' | 'violet';

export type Field =
  | { kind: 'score'; label: string; value: number; max?: number; tone?: 'good' | 'bad' | 'neutral' }
  | { kind: 'badge'; label: string; value: string; tone?: Tone }
  | { kind: 'text'; label: string; value: string }
  | { kind: 'bullets'; label: string; items: string[] }
  | { kind: 'paragraph'; label: string; value: string }
  | { kind: 'kv'; label: string; pairs: [string, string][] }
  | { kind: 'lalKitabRemedies'; label: string; items: { area: string; remedy: string; caution?: string }[] }
  | { kind: 'mantras'; label: string; items: { deity: string; mantra: string; count?: string; benefit?: string }[] }
  | { kind: 'dosDonts'; label: string; dos: string[]; donts: string[] }
  | { kind: 'karmicDebts'; label: string; items: { debtType: string; isAfflicted: boolean; description: string; remedy: string }[] }
  | { kind: 'specialYogas'; label: string; items: { name: string; planets: string[]; house: number; effect: string }[] }
  | { kind: 'remedyList'; label: string; items: { area: string; house?: number; reason?: string; title: string; instructions: string }[] };

export const TONE_CLASSES: Record<Tone, string> = {
  amber:  'bg-amber-100 text-amber-900 ring-amber-200',
  green:  'bg-emerald-100 text-emerald-900 ring-emerald-200',
  red:    'bg-red-100 text-red-900 ring-red-200',
  stone:  'bg-stone-100 text-stone-800 ring-stone-200',
  violet: 'bg-violet-100 text-violet-900 ring-violet-200',
};

export function toneForScore(v: number, max = 100): Tone {
  const r = v / max;
  if (r >= 0.75) return 'green';
  if (r >= 0.5)  return 'amber';
  if (r >= 0.25) return 'stone';
  return 'red';
}