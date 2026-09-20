import { useUpcomingEvents } from '@/features/events/useUpcomingEvents';
import type { PlanetaryEvent, EventKind } from '@/features/events/events';
import { PLANET_GLYPH, planetColor } from '@/lib/astro';
import { cn } from '@/lib/utils';

interface KindStyle {
  label: string;
  chip: string;
  bar: string;
}

const KIND_STYLES: Record<EventKind, KindStyle> = {
  rashi: {
    label: 'Rashi',
    chip: 'bg-amber-100 text-amber-900 ring-amber-200',
    bar:  'bg-amber-500',
  },
  nakshatra: {
    label: 'Nakshatra',
    chip: 'bg-violet-100 text-violet-900 ring-violet-200',
    bar:  'bg-violet-500',
  },
  aspect: {
    label: 'Aspect',
    chip: 'bg-sky-100 text-sky-900 ring-sky-200',
    bar:  'bg-sky-500',
  },
};

/**
 * Format a Date in a specific IANA timezone. Falls back to the browser's
 * timezone if the target zone is invalid or unavailable.
 */
function fmtInZone(
  d: Date,
  timeZone: string | null,
  opts: Intl.DateTimeFormatOptions,
): string {
  try {
    return new Intl.DateTimeFormat(undefined, {
      ...opts,
      timeZone: timeZone ?? undefined,
    }).format(d);
  } catch {
    return new Intl.DateTimeFormat(undefined, opts).format(d);
  }
}

function shortZoneLabel(timeZone: string | null): string | null {
  if (!timeZone) return null;
  // Try to get a friendly abbreviation like "EDT" or "IST"
  try {
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone,
      timeZoneName: 'short',
    }).formatToParts(new Date());
    const tzPart = parts.find((p) => p.type === 'timeZoneName');
    return tzPart?.value ?? null;
  } catch {
    return null;
  }
}

function relDays(days: number): string {
  if (days === 0) return 'Today';
  if (days === 1) return '1 Day';
  return days + ' Days';
}

export function UpcomingEventsCard() {
  const { data, isLoading, error } = useUpcomingEvents(60);

  const events = data?.events ?? [];
  const timezone = data?.timezone ?? null;
  const locationLabel = data?.locationLabel ?? 'your location';
  const zoneAbbr = shortZoneLabel(timezone);

  return (
    <section className="overflow-hidden rounded-2xl border border-amber-200 bg-card shadow-sm">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-amber-200 bg-gradient-to-r from-amber-50 to-transparent px-5 py-3">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-amber-800">
            Upcoming Planetary Events
          </p>
          <p className="text-[10px] text-muted-foreground">
            Next 60 days
            {timezone && (
              <>
                {' '}· times shown in <span className="font-medium text-amber-900">{locationLabel}</span>
                {zoneAbbr && <> ({zoneAbbr})</>}
              </>
            )}
          </p>
        </div>
        {events.length > 0 && (
          <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-900 ring-1 ring-inset ring-amber-200">
            {events.length} events
          </span>
        )}
      </header>

      {isLoading && (
        <div className="flex flex-col items-center justify-center gap-2 px-6 py-10 text-xs text-muted-foreground">
          <span className="h-5 w-5 animate-spin rounded-full border-2 border-amber-200 border-t-amber-500" />
          Scanning the next 60 days... (this takes a few seconds)
        </div>
      )}

      {error && (
        <p className="px-5 py-6 text-xs text-destructive">
          Failed to compute events: {(error as Error).message}
        </p>
      )}

      {!isLoading && events.length === 0 && !error && (
        <p className="px-5 py-6 text-xs text-muted-foreground">
          No events detected in the next 60 days.
        </p>
      )}

      {events.length > 0 && (
        <ul className="divide-y divide-amber-100 max-h-[600px] overflow-y-auto">
          {events.map((ev) => (
            <EventRow key={ev.id} event={ev} timezone={timezone} />
          ))}
        </ul>
      )}

      <p className="border-t border-amber-100 bg-amber-50/30 px-5 py-2 text-[10px] text-muted-foreground">
        Detected by scanning 6-hourly snapshots of the sky. Times are shown in the
        {timezone ? ' observer’s timezone' : ' browser’s timezone'}.
      </p>
    </section>
  );
}

function EventRow({ event, timezone }: { event: PlanetaryEvent; timezone: string | null }) {
  const style = KIND_STYLES[event.kind];
  const planet = event.planet;
  const planet2 = event.planet2;

  const color1 = planetColor(planet);
  const glyph1 = PLANET_GLYPH[planet] ?? planet.slice(0, 2);
  const color2 = planet2 ? planetColor(planet2) : null;
  const glyph2 = planet2 ? PLANET_GLYPH[planet2] ?? planet2.slice(0, 2) : null;

  const urgent = event.daysAway <= 1;

  const dateStr = fmtInZone(event.at, timezone, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const timeStr = fmtInZone(event.at, timezone, {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <li className="flex items-stretch gap-3 px-5 py-3 transition-colors hover:bg-amber-50/40">
      <span className={cn('w-1 shrink-0 rounded-full', style.bar)} />

      <div className="flex w-12 shrink-0 items-center justify-center gap-0.5">
        <span className={cn('text-2xl leading-none', color1.text)} title={planet}>
          {glyph1}
        </span>
        {planet2 && glyph2 && color2 && (
          <>
            <span className="text-xs text-muted-foreground">&</span>
            <span className={cn('text-xl leading-none', color2.text)} title={planet2}>
              {glyph2}
            </span>
          </>
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex flex-wrap items-center gap-1.5">
          <p className="font-serif text-sm font-bold leading-tight text-amber-950">
            {event.label}
          </p>
          <span className={cn(
            'rounded-full px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wider ring-1 ring-inset',
            style.chip,
          )}>
            {style.label}
          </span>
        </div>
        <p className="mt-0.5 text-[10px] text-muted-foreground">{event.detail}</p>
      </div>

      <div className="flex shrink-0 flex-col items-end justify-center leading-tight">
        <span className={cn(
          'rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider',
          urgent
            ? 'bg-red-100 text-red-800 ring-1 ring-inset ring-red-200'
            : 'bg-amber-100/60 text-amber-800',
        )}>
          {relDays(event.daysAway)}
        </span>
        <span className="mt-0.5 font-serif text-[11px] font-medium text-amber-950">
          {dateStr}
        </span>
        <span className="font-mono text-[10px] text-muted-foreground tabular-nums">
          at {timeStr}
        </span>
      </div>
    </li>
  );
}