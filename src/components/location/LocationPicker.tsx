import { useEffect, useRef, useState } from 'react';
import { searchPlaces, type Place } from '@/lib/geocoding';
import { cn } from '@/lib/utils';

interface Props {
  /** Current location label, e.g. "Columbia, South Carolina, United States" */
  currentLabel?: string | null;
  isManual: boolean;
  /** Called when the user picks a place from the suggestions */
  onPick: (place: Place) => void;
  /** Called when the user wants to go back to auto-detection */
  onClearManual: () => void;
}

export function LocationPicker({
  currentLabel, isManual, onPick, onClearManual,
}: Props) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Place[]>([]);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const debounceRef = useRef<number | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Debounced search
  useEffect(() => {
    if (!open) return;
    const q = query.trim();
    if (debounceRef.current) window.clearTimeout(debounceRef.current);
    if (abortRef.current) abortRef.current.abort();

    if (q.length < 2) {
      setResults([]);
      setSearching(false);
      setError(null);
      return;
    }

    setSearching(true);
    setError(null);

    debounceRef.current = window.setTimeout(async () => {
      const ctrl = new AbortController();
      abortRef.current = ctrl;
      try {
        const places = await searchPlaces(q, ctrl.signal);
        if (ctrl.signal.aborted) return;
        setResults(places);
        if (places.length === 0) setError('No matches. Try a different spelling.');
      } catch (e: any) {
        if (e?.name === 'AbortError') return;
        setError('Search failed. Please try again.');
        setResults([]);
      } finally {
        if (!ctrl.signal.aborted) setSearching(false);
      }
    }, 350);

    return () => {
      if (debounceRef.current) window.clearTimeout(debounceRef.current);
      if (abortRef.current) abortRef.current.abort();
    };
  }, [query, open]);

  // Click outside closes the popover
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      const c = containerRef.current;
      if (c && !c.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('pointerdown', onDown);
    return () => document.removeEventListener('pointerdown', onDown);
  }, [open]);

  const handlePick = (place: Place) => {
    onPick(place);
    setQuery('');
    setResults([]);
    setOpen(false);
  };

  return (
    <div className="relative" ref={containerRef}>
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          'group flex w-full items-center gap-2 rounded-lg border px-3 py-1.5 text-left text-xs transition-colors',
          isManual
            ? 'border-amber-300 bg-amber-50/60 hover:bg-amber-50'
            : 'border-amber-200 bg-background hover:bg-amber-50/40',
        )}
      >
        <span className="text-base leading-none" aria-hidden="true">
          {'\uD83D\uDCCD'}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">
            {isManual ? 'Manual location' : 'Detected location'}
          </span>
          <span className="block truncate font-medium text-amber-950">
            {currentLabel ?? 'Detecting...'}
          </span>
        </span>
        <span className="shrink-0 text-[10px] text-amber-700/70">
          {open ? 'close' : 'change'}
        </span>
      </button>

      {/* Popover */}
      {open && (
        <div className="absolute right-0 top-full z-40 mt-1 w-80 max-w-[calc(100vw-2rem)] rounded-xl border border-amber-200 bg-card p-3 shadow-xl">
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-amber-800">
            Search for a city
          </p>

          <div className="relative">
            <input
              autoFocus
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. Chennai, London, New York"
              className="w-full rounded-md border border-amber-200 bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
            {searching && (
              <span className="absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 animate-spin rounded-full border-2 border-amber-200 border-t-amber-500" />
            )}
          </div>

          {error && (
            <p className="mt-2 text-[11px] text-destructive">{error}</p>
          )}

          {results.length > 0 && (
            <ul className="mt-2 max-h-56 divide-y divide-amber-100 overflow-y-auto rounded-md border border-amber-100">
              {results.map((r) => (
                <li key={r.placeId}>
                  <button
                    type="button"
                    onClick={() => handlePick(r)}
                    className="flex w-full flex-col items-start gap-0.5 px-3 py-2 text-left text-sm transition-colors hover:bg-amber-50"
                  >
                    <span className="font-medium text-amber-950">{r.name}</span>
                    <span className="text-[10px] text-muted-foreground">
                      {[r.region, r.country].filter(Boolean).join(', ')}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}

          {isManual && (
            <button
              type="button"
              onClick={() => {
                onClearManual();
                setOpen(false);
              }}
              className="mt-3 w-full rounded-md border border-amber-300 bg-amber-50 px-3 py-1.5 text-[11px] font-semibold text-amber-900 transition-colors hover:bg-amber-100"
            >
              Switch back to auto-detect
            </button>
          )}

          <p className="mt-2 text-[9px] leading-relaxed text-muted-foreground">
            Location is only used to compute the panchang for the current moment.
            It is never sent to our servers.
          </p>
        </div>
      )}
    </div>
  );
}