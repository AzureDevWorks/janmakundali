import { getPanchangamDetails, Observer } from '@prisri/jyotish';

export type EventKind = 'rashi' | 'nakshatra' | 'aspect';

export interface PlanetaryEvent {
  id: string;
  kind: EventKind;
  planet: string;
  planet2?: string;
  label: string;
  detail: string;
  at: Date;
  daysAway: number;
}

/* Classical Parashari + common aspects to detect */
const ASPECT_ANGLES = [0, 30, 45, 60, 90, 120, 135, 150, 180];

/* Which planet pairs to check for aspects (Moon excluded - too fast) */
const ASPECT_PAIRS: [string, string][] = [
  ['Sun', 'Mercury'], ['Sun', 'Venus'],  ['Sun', 'Mars'],
  ['Sun', 'Jupiter'], ['Sun', 'Saturn'],
  ['Mercury', 'Venus'],   ['Mercury', 'Mars'],
  ['Mercury', 'Jupiter'], ['Mercury', 'Saturn'],
  ['Venus', 'Mars'],      ['Venus', 'Jupiter'], ['Venus', 'Saturn'],
  ['Mars', 'Jupiter'],    ['Mars', 'Saturn'],
  ['Jupiter', 'Saturn'],
];

/* The 9 planets we track. Keys are the library's lowercase names. */
const PLANET_KEYS = ['sun', 'moon', 'mars', 'mercury', 'jupiter', 'venus', 'saturn', 'rahu', 'ketu'];

const PLANET_LABELS: Record<string, string> = {
  sun: 'Sun', moon: 'Moon', mars: 'Mars', mercury: 'Mercury',
  jupiter: 'Jupiter', venus: 'Venus', saturn: 'Saturn',
  rahu: 'Rahu', ketu: 'Ketu',
};

/* Which nakshatra indices map to rashi indices (each rashi has ~2.25 nakshatras) */
function angularDiff(a: number, b: number): number {
  const d = Math.abs(((a - b) % 360 + 360) % 360);
  return d > 180 ? 360 - d : d;
}

function crossed(prev: number, now: number, target: number): boolean {
  // Handle wrap-around (e.g. from 359 to 1 crossing 0)
  const p = prev, n = now;
  if (Math.abs(p - n) > 180) {
    // Crossing wrapped
    if (p > n) {
      return (p >= target && target >= 0) || (target <= n && target >= 0) ||
             (p >= target && n <= target + 360);
    } else {
      return (p <= target && target <= n) || (target <= p || target >= n);
    }
  }
  // No wrap
  const lo = Math.min(p, n);
  const hi = Math.max(p, n);
  // Tolerate targets close to 0 or 360
  return (lo <= target && target <= hi) ||
         (lo <= target - 360 && target - 360 <= hi) ||
         (lo <= target + 360 && target + 360 <= hi);
}

function daysAway(from: Date, at: Date): number {
  return Math.max(0, Math.round((at.getTime() - from.getTime()) / 86_400_000));
}

interface PositionSnapshot {
  rashi: number;
  nakshatra: number;
  longitude: number;
}

function extractPositions(panchang: any): Record<string, PositionSnapshot> {
  const out: Record<string, PositionSnapshot> = {};
  const pp = panchang?.planetaryPositions;
  if (!pp) return out;

  for (const key of PLANET_KEYS) {
    const p = pp[key];
    if (!p) continue;
    out[PLANET_LABELS[key]] = {
      rashi: typeof p.rashi === 'number' ? p.rashi
           : typeof p.rashiIndex === 'number' ? p.rashiIndex : 0,
      nakshatra: typeof p.nakshatra === 'number' ? p.nakshatra
               : typeof p.nakshatraIndex === 'number' ? p.nakshatraIndex : 0,
      longitude: p.longitude ?? p.siderealLongitude ?? 0,
    };
  }
  return out;
}

/** Human-readable rashi name for a given index 0..11 */
const RASHI_NAMES = [
  'Mesha', 'Vrishabha', 'Mithuna', 'Karka', 'Simha', 'Kanya',
  'Tula', 'Vrischika', 'Dhanus', 'Makara', 'Kumbha', 'Meena',
];
const RASHI_ENGLISH = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces',
];
const NAKSHATRA_NAMES = [
  'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra',
  'Punarvasu', 'Pushya', 'Ashlesha', 'Magha', 'Purva Phalguni',
  'Uttara Phalguni', 'Hasta', 'Chitra', 'Swati', 'Vishakha',
  'Anuradha', 'Jyeshtha', 'Mula', 'Purva Ashadha', 'Uttara Ashadha',
  'Shravana', 'Dhanishta', 'Shatabhisha', 'Purva Bhadrapada',
  'Uttara Bhadrapada', 'Revati',
];

/**
 * Scan the next `daysAhead` days for planetary events.
 * Steps at 6-hour intervals. Each step recomputes the panchang.
 *
 * Returns the next ~25 events sorted chronologically.
 */
export async function findUpcomingEvents(
  from: Date,
  daysAhead: number,
  observer: Observer,
  onProgress?: (done: number, total: number) => void,
): Promise<PlanetaryEvent[]> {
  const STEP_MS = 6 * 60 * 60 * 1000;   // 6 hours
  const endMs = from.getTime() + daysAhead * 86_400_000;
  const totalSteps = Math.ceil((endMs - from.getTime()) / STEP_MS);

  const events: PlanetaryEvent[] = [];
  const seen = new Set<string>();

  // First snapshot
  let prev: Record<string, PositionSnapshot>;
  try {
    prev = extractPositions(getPanchangamDetails(from, observer));
  } catch {
    return [];
  }

  // We need the actual panchang at each step to know the *name* of the
  // rashi/nakshatra entered. But we can compute that from the index.
  let t = from.getTime() + STEP_MS;
  let step = 0;

  while (t <= endMs) {
    step++;
    const at = new Date(t);
    let snap: Record<string, PositionSnapshot>;
    try {
      snap = extractPositions(getPanchangamDetails(at, observer));
    } catch {
      t += STEP_MS;
      continue;
    }

    // ---- Rashi & Nakshatra ingresses ----
    for (const planet of Object.keys(snap)) {
      const p0 = prev[planet];
      const p1 = snap[planet];
      if (!p0 || !p1) continue;

      // Skip Moon for nakshatra notifications (too frequent)
      const isMoon = planet === 'Moon';

      if (p0.rashi !== p1.rashi) {
        const rashiName = RASHI_NAMES[p1.rashi] ?? '?';
        const rashiEn = RASHI_ENGLISH[p1.rashi] ?? '';
        const id = planet + '-rashi-' + p1.rashi;
        if (!seen.has(id)) {
          seen.add(id);
          events.push({
            id,
            kind: 'rashi',
            planet,
            label: planet + ' enters ' + rashiName,
            detail: planet + ' enters ' + rashiName + ' (' + rashiEn + ')',
            at,
            daysAway: daysAway(from, at),
          });
        }
      }

      if (!isMoon && p0.nakshatra !== p1.nakshatra) {
        const nakName = NAKSHATRA_NAMES[p1.nakshatra] ?? '?';
        const id = planet + '-nak-' + p1.nakshatra;
        if (!seen.has(id)) {
          seen.add(id);
          events.push({
            id,
            kind: 'nakshatra',
            planet,
            label: planet + ' enters ' + nakName,
            detail: planet + ' enters ' + nakName + ' nakshatra',
            at,
            daysAway: daysAway(from, at),
          });
        }
      }
    }

    // ---- Aspect crossings ----
    for (const [a, b] of ASPECT_PAIRS) {
      const a0 = prev[a], a1 = snap[a];
      const b0 = prev[b], b1 = snap[b];
      if (!a0 || !a1 || !b0 || !b1) continue;

      const angle0 = angularDiff(a0.longitude, b0.longitude);
      const angle1 = angularDiff(a1.longitude, b1.longitude);

      for (const target of ASPECT_ANGLES) {
        if (crossed(angle0, angle1, target)) {
          const id = a + '-' + b + '-' + target;
          if (seen.has(id)) continue;
          seen.add(id);
          const label = a + ' & ' + b + ' at ' + target + '\u00B0';
          events.push({
            id,
            kind: 'aspect',
            planet: a,
            planet2: b,
            label,
            detail: a + ' and ' + b + ' form a ' + target + '\u00B0 aspect',
            at,
            daysAway: daysAway(from, at),
          });
        }
      }
    }

    prev = snap;
    t += STEP_MS;

    if (onProgress && step % 20 === 0) onProgress(step, totalSteps);

    // Yield to the event loop every 40 steps so the UI stays responsive
    if (step % 40 === 0) {
      await new Promise((r) => setTimeout(r, 0));
    }
  }

  // Sort chronologically and dedupe by (kind + time + planets)
  events.sort((x, y) => x.at.getTime() - y.at.getTime());

  // Limit events within 60 days, keep the next 25
  return events.slice(0, 25);
}