export interface Place {
  placeId: string;
  name: string;
  displayName: string;
  latitude: number;
  longitude: number;
  timezone: string;
  country?: string;
  region?: string;
}

export async function searchPlaces(query: string, signal?: AbortSignal): Promise<Place[]> {
  const url = new URL('https://geocoding-api.open-meteo.com/v1/search');
  url.searchParams.set('name', query);
  url.searchParams.set('count', '10');
  url.searchParams.set('language', 'en');
  const res = await fetch(url.toString(), { signal });
  if (!res.ok) throw new Error('Geocoding failed');
  const data = await res.json();
  if (!Array.isArray(data.results)) return [];
  return data.results.map((r: any) => ({
    placeId: String(r.id),
    name: r.name,
    displayName: [r.name, r.admin1, r.country].filter(Boolean).join(', '),
    latitude: r.latitude,
    longitude: r.longitude,
    timezone: r.timezone,
    country: r.country,
    region: r.admin1,
  }));
}

/* Resolve UTC offset for a wall-clock time at a given IANA timezone. */
export function utcOffsetFor(timezone: string, dateStr: string, timeStr: string): string | null {
  try {
    const [y, mo, d] = dateStr.split('-').map(Number);
    const [h, mi] = timeStr.split(':').map(Number);
    if ([y, mo, d, h, mi].some(Number.isNaN)) return null;
    let offset = 0;
    for (let i = 0; i < 3; i++) {
      const guess = new Date(Date.UTC(y, mo - 1, d, h, mi) - offset * 60_000);
      const parts = new Intl.DateTimeFormat('en-US', {
        timeZone: timezone, year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit', hour12: false,
      }).formatToParts(guess);
      const g = (t: string) => Number(parts.find((p) => p.type === t)?.value);
      const localMs = Date.UTC(g('year'), g('month') - 1, g('day'), g('hour'), g('minute'));
      const newOffset = Math.round((localMs - guess.getTime()) / 60_000);
      if (newOffset === offset) break;
      offset = newOffset;
    }
    const sign = offset >= 0 ? '+' : '-';
    const abs = Math.abs(offset);
    return sign + String(Math.floor(abs / 60)).padStart(2, '0') + ':' + String(abs % 60).padStart(2, '0');
  } catch { return null; }
}