import { useState } from 'react';
import { usePanchangam } from '@/features/kundli/usePanchangam';
import { useTodayPanchangam } from '@/features/kundli/useTodayPanchangam';
import { useCurrentLocation } from '@/features/location/useCurrentLocation';
import { useBirthStore } from '@/features/birth/birthStore';
import { PanchangHero } from '@/components/panchang/PanchangHero';
import { SunMoonCard } from '@/components/panchang/SunMoonCard';
import { MuhurtaCard } from '@/components/panchang/MuhurtaCard';
import { InauspiciousCard } from '@/components/panchang/InauspiciousCard';
import { HoraCard } from '@/components/panchang/HoraCard';
import { ChoghadiyaCard } from '@/components/panchang/ChoghadiyaCard';
import { LocationPicker } from '@/components/location/LocationPicker';
import { cn } from '@/lib/utils';

type Mode = 'birth' | 'today';

export function PanchangTab() {
  const [mode, setMode] = useState<Mode>('today');
  const profile = useBirthStore((s) => s.profile);

  // 1. Location — the ONE instance for this tab
  const {
    location,
    loading: locLoading,
    isManual,
    setManual,
    clearManualOverride,
    label: locLabel,
  } = useCurrentLocation();

  // 2. Birth panchang
  const { data: birthPanchang, isLoading: loadingBirth } = usePanchangam();

  // 3. Today panchang — computed for whatever coords we have
  const birthFallback = profile
    ? { latitude: profile.place.latitude, longitude: profile.place.longitude }
    : null;

  const activeCoords = location
    ? { latitude: location.latitude, longitude: location.longitude }
    : birthFallback;

  const { data: todayPanchang, isLoading: loadingToday } = useTodayPanchangam(activeCoords);

  const p = mode === 'birth' ? birthPanchang : todayPanchang;
  const loading = mode === 'birth' ? loadingBirth : (loadingToday || locLoading);

  // What to display in the header for "today" mode
  const displayLocation = (() => {
    if (isManual && locLabel) return locLabel;
    if (locLabel) return locLabel;
    if (profile?.place.displayName) return profile.place.displayName;
    return 'Detecting...';
  })();

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 rounded-2xl border border-amber-200 bg-gradient-to-r from-amber-50/60 via-amber-50/30 to-transparent px-5 py-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0 flex-1">
          <p className="font-serif text-lg font-bold tracking-tight text-amber-950">
            Panchangam &amp; Muhurta
          </p>
          <p className="truncate text-[11px] text-muted-foreground">
            {mode === 'birth' ? (
              <>
                Computed for{' '}
                <span className="font-medium text-amber-900">
                  {profile?.place.displayName ?? '--'}
                </span>{' '}
                at your birth moment
              </>
            ) : (
              <>
                Computed for{' '}
                <span className="font-medium text-amber-900">{displayLocation}</span>{' '}
                right now
              </>
            )}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {mode === 'today' && (
            <LocationPicker
              currentLabel={displayLocation}
              isManual={isManual}
              onPick={(place) => {
                setManual({
                  latitude: place.latitude,
                  longitude: place.longitude,
                  city: place.name,
                  region: place.region,
                  country: place.country,
                  countryCode: (place as any).countryCode,
                  timezone: place.timezone,
                });
              }}
              onClearManual={clearManualOverride}
            />
          )}

          <div className="inline-flex overflow-hidden rounded-lg border border-amber-200 bg-background shadow-sm">
            <button
              onClick={() => setMode('birth')}
              className={cn(
                'px-4 py-1.5 text-xs font-semibold transition-colors',
                mode === 'birth' ? 'bg-amber-500 text-white' : 'hover:bg-amber-50',
              )}
            >
              At Birth
            </button>
            <button
              onClick={() => setMode('today')}
              className={cn(
                'border-l border-amber-200 px-4 py-1.5 text-xs font-semibold transition-colors',
                mode === 'today' ? 'bg-amber-500 text-white' : 'hover:bg-amber-50',
              )}
            >
              Today
            </button>
          </div>
        </div>
      </div>

      {loading && (
        <div className="rounded-2xl border bg-muted/30 p-8 text-center text-sm text-muted-foreground">
          {locLoading && mode === 'today'
            ? 'Detecting your location...'
            : 'Computing panchangam...'}
        </div>
      )}

      {!loading && !p && (
        <div className="rounded-2xl border bg-muted/30 p-8 text-center text-sm text-muted-foreground">
          Panchang data unavailable for this mode.
        </div>
      )}

      {p && (
        <div className="space-y-5">
          <PanchangHero p={p} />

          <div className="grid gap-5 lg:grid-cols-2">
            <SunMoonCard p={p} />
            <HoraCard p={p} />
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            <MuhurtaCard p={p} />
            <InauspiciousCard p={p} />
          </div>

          <ChoghadiyaCard p={p} />

          <p className="text-center text-[10px] text-muted-foreground">
            {mode === 'birth'
              ? 'Panchang as of your birth moment. Times are in your birth-place timezone.'
              : 'Panchang as of now, computed for the current location.'}
          </p>
        </div>
      )}
    </div>
  );
}