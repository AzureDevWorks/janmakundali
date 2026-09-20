import { useCallback, useEffect, useRef, useState } from 'react';
import { searchPlaces, type Place } from '@/lib/geocoding';

export function usePlaceSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Place[]>([]);
  const [searching, setSearching] = useState(false);
  const [selected, setSelected] = useState<Place | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const timerRef = useRef<number | null>(null);
  const latest = useRef('');

  useEffect(() => {
    if (selected && query !== selected.displayName) setSelected(null);
  }, [query, selected]);

  useEffect(() => {
    latest.current = query;
    const q = query.trim();
    if (timerRef.current) window.clearTimeout(timerRef.current);
    if (abortRef.current) abortRef.current.abort();
    if (q.length < 2) { setResults([]); setSearching(false); return; }
    setSearching(true);
    timerRef.current = window.setTimeout(async () => {
      const ctrl = new AbortController();
      abortRef.current = ctrl;
      try {
        const places = await searchPlaces(q, ctrl.signal);
        if (latest.current.trim() !== q || ctrl.signal.aborted) return;
        setResults(places);
      } catch (e: any) {
        if (e?.name === 'AbortError') return;
        setResults([]);
      } finally { if (!ctrl.signal.aborted) setSearching(false); }
    }, 400);
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
      if (abortRef.current) abortRef.current.abort();
    };
  }, [query]);

  const pick = useCallback((p: Place) => {
    setSelected(p); setQuery(p.displayName); setResults([]); setSearching(false);
  }, []);
  const clear = useCallback(() => { setQuery(''); setSelected(null); setResults([]); }, []);

  return { query, setQuery, results, searching, selected, pick, clear };
}