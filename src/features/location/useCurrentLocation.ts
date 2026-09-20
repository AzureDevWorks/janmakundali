import { useCallback, useEffect, useRef, useState } from 'react';

export interface CurrentLocation {
  latitude: number;
  longitude: number;
  city?: string;
  region?: string;
  country?: string;
  countryCode?: string;
  timezone?: string;
  source: 'gps' | 'ip' | 'profile' | 'manual';
}

interface State {
  location: CurrentLocation | null;
  loading: boolean;
  error: string | null;
}

const LS_KEY = 'janmakundali:current-location';
const LS_MANUAL_KEY = 'janmakundali:manual-location';
const CACHE_MS = 15 * 60 * 1000;

interface Cached {
  location: CurrentLocation;
  timestamp: number;
}

function readCache(): CurrentLocation | null {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Cached;
    if (Date.now() - parsed.timestamp > CACHE_MS) return null;
    return parsed.location;
  } catch {
    return null;
  }
}

function writeCache(location: CurrentLocation) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify({ location, timestamp: Date.now() }));
  } catch { /* ignore */ }
}

function readManual(): CurrentLocation | null {
  try {
    const raw = localStorage.getItem(LS_MANUAL_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as CurrentLocation;
  } catch {
    return null;
  }
}

function writeManual(location: CurrentLocation) {
  try {
    localStorage.setItem(LS_MANUAL_KEY, JSON.stringify(location));
  } catch { /* ignore */ }
}

function clearManual() {
  try { localStorage.removeItem(LS_MANUAL_KEY); } catch { /* ignore */ }
}

async function reverseGeocode(lat: number, lon: number) {
  try {
    const url = new URL('https://geocoding-api.open-meteo.com/v1/search');
    url.searchParams.set('latitude', String(lat));
    url.searchParams.set('longitude', String(lon));
    url.searchParams.set('count', '1');
    url.searchParams.set('language', 'en');
    const res = await fetch(url.toString());
    if (!res.ok) return null;
    const data = await res.json();
    const first = data?.results?.[0];
    if (!first) return null;
    return {
      city: first.name as string,
      region: first.admin1 as string | undefined,
      country: first.country as string | undefined,
      countryCode: first.country_code as string | undefined,
      timezone: first.timezone as string | undefined,
    };
  } catch { return null; }
}

async function ipLookup(): Promise<CurrentLocation | null> {
  try {
    const res = await fetch('https://ipwho.is/');
    if (!res.ok) return null;
    const data = await res.json();
    if (!data.success) return null;
    return {
      latitude: data.latitude,
      longitude: data.longitude,
      city: data.city,
      region: data.region,
      country: data.country,
      countryCode: data.country_code,
      timezone: data.timezone?.id,
      source: 'ip',
    };
  } catch { return null; }
}

async function gpsLookup(): Promise<CurrentLocation | null> {
  if (!('geolocation' in navigator)) return null;
  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const meta = await reverseGeocode(latitude, longitude);
        resolve({ latitude, longitude, ...(meta ?? {}), source: 'gps' });
      },
      () => resolve(null),
      { enableHighAccuracy: false, timeout: 8000, maximumAge: CACHE_MS },
    );
  });
}

export function useCurrentLocation() {
  // Manual override always wins if set
  const [manual, setManualState] = useState<CurrentLocation | null>(() => readManual());

  const [state, setState] = useState<State>(() => {
    const m = readManual();
    if (m) return { location: m, loading: false, error: null };
    const cached = readCache();
    return { location: cached, loading: !cached, error: null };
  });

  const initRef = useRef(false);

  useEffect(() => {
    if (manual) return;              // skip auto-detect when manual is set
    if (initRef.current) return;
    initRef.current = true;
    if (state.location) return;

    (async () => {
      try {
        const gps = await gpsLookup();
        if (gps) {
          writeCache(gps);
          setState({ location: gps, loading: false, error: null });
          return;
        }
        const ip = await ipLookup();
        if (ip) {
          writeCache(ip);
          setState({ location: ip, loading: false, error: null });
          return;
        }
        setState({ location: null, loading: false, error: 'Could not determine location.' });
      } catch (e) {
        setState({
          location: null,
          loading: false,
          error: (e as Error).message ?? 'Location lookup failed.',
        });
      }
    })();
  }, [state.location, manual]);

  /** Set a manual location; overrides auto-detection until cleared. */
  const setManual = useCallback((loc: Omit<CurrentLocation, 'source'>) => {
    const withSource: CurrentLocation = { ...loc, source: 'manual' };
    writeManual(withSource);
    setManualState(withSource);
    setState({ location: withSource, loading: false, error: null });
  }, []);

  /** Clear manual override and re-run auto-detection. */
  const clearManualOverride = useCallback(async () => {
    clearManual();
    setManualState(null);
    localStorage.removeItem(LS_KEY);
    setState({ location: null, loading: true, error: null });
    const gps = await gpsLookup();
    if (gps) {
      writeCache(gps);
      setState({ location: gps, loading: false, error: null });
      return;
    }
    const ip = await ipLookup();
    if (ip) {
      writeCache(ip);
      setState({ location: ip, loading: false, error: null });
      return;
    }
    setState({ location: null, loading: false, error: 'Could not determine location.' });
  }, []);

  /** Force re-detect (clears cache but not manual override). */
  const refresh = useCallback(async () => {
    if (manual) return;              // manual override in effect; do nothing
    localStorage.removeItem(LS_KEY);
    setState({ location: null, loading: true, error: null });
    const gps = await gpsLookup();
    if (gps) {
      writeCache(gps);
      setState({ location: gps, loading: false, error: null });
      return;
    }
    const ip = await ipLookup();
    if (ip) {
      writeCache(ip);
      setState({ location: ip, loading: false, error: null });
      return;
    }
    setState({ location: null, loading: false, error: 'Could not determine location.' });
  }, [manual]);

  return {
    ...state,
    refresh,
    setManual,
    clearManualOverride,
    isManual: !!manual,
    label: state.location
      ? [state.location.city, state.location.region, state.location.country]
          .filter(Boolean)
          .join(', ')
      : null,
  };
}