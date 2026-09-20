import { useEffect, useMemo, useState } from 'react';
import { PLANET_ABBR, PLANET_GLYPH, planetColor } from '@/lib/astro';
import { SANSKRIT, DOT } from '@/lib/text';
import { cn } from '@/lib/utils';

/* ------------------------------------------------------------------ *
 * Types
 * ------------------------------------------------------------------ */
interface DashaPeriod {
  planet: string;
  startTime: string | Date;
  endTime: string | Date;
  durationYears?: number;
  antars?: DashaPeriod[];
  pratyantars?: DashaPeriod[];
  progressPercent?: number;
}

/* ------------------------------------------------------------------ *
 * Helpers
 * ------------------------------------------------------------------ */
function ts(v: string | Date | undefined): number {
  if (!v) return 0;
  return v instanceof Date ? v.getTime() : Date.parse(v);
}

function isCurrent(p: DashaPeriod | undefined): boolean {
  if (!p) return false;
  const now = Date.now();
  return now >= ts(p.startTime) && now < ts(p.endTime);
}

function yearOf(v: string | Date | undefined): string {
  if (!v) return '--';
  const d = v instanceof Date ? v : new Date(v);
  return String(d.getFullYear());
}

/** Humanise a duration from real dates. Avoids floating-point noise like "4.306540521023704y". */
function fmtDuration(start: string | Date | undefined, end: string | Date | undefined): string {
  if (!start || !end) return '--';
  const s = ts(start);
  const e = ts(end);
  const days = (e - s) / 86_400_000;

  if (days >= 365) {
    const years = Math.floor(days / 365.25);
    const remMonths = Math.round((days - years * 365.25) / 30.44);
    if (remMonths >= 12) return (years + 1) + 'y';
    if (remMonths > 0) return years + 'y ' + remMonths + 'm';
    return years + 'y';
  }
  if (days >= 30) {
    const months = Math.floor(days / 30.44);
    const remDays = Math.round(days - months * 30.44);
    if (remDays > 0) return months + 'mo ' + remDays + 'd';
    return months + 'mo';
  }
  return Math.round(days) + 'd';
}

function fmtDateShort(v: string | Date | undefined): string {
  if (!v) return '--';
  const d = v instanceof Date ? v : new Date(v);
  return d.toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: '2-digit' });
}

/* ------------------------------------------------------------------ *
 * Main component
 * ------------------------------------------------------------------ */
export function VimshottariDasha({ kundli }: { kundli: any }) {
  const dasha = kundli?.dasha;
  if (!dasha) return null;

  const mds: DashaPeriod[] = dasha.mahadashas ?? [];
  const currentMahaIdx = useMemo(
    () => mds.findIndex((m) => isCurrent(m)),
    [mds],
  );

  const [mahaIdx, setMahaIdx] = useState(currentMahaIdx >= 0 ? currentMahaIdx : 0);
  const maha = mds[mahaIdx];
  const antars: DashaPeriod[] = maha?.antars ?? [];

  const currentAntarIdx = useMemo(
    () => antars.findIndex((a) => isCurrent(a)),
    [antars],
  );

  const [antarIdx, setAntarIdx] = useState(currentAntarIdx >= 0 ? currentAntarIdx : 0);

  // Auto-select the current antar when the maha changes
  useEffect(() => {
    const idx = antars.findIndex((a) => isCurrent(a));
    setAntarIdx(idx >= 0 ? idx : 0);
  }, [mahaIdx, antars.length]);

  const antar = antars[antarIdx];
  const pratyantars: DashaPeriod[] = antar?.pratyantars ?? [];

  const currentPratyantarIdx = useMemo(
    () => pratyantars.findIndex((p) => isCurrent(p)),
    [pratyantars],
  );

  const trail = [
    maha?.planet,
    antar?.planet,
    currentPratyantarIdx >= 0 ? pratyantars[currentPratyantarIdx]?.planet : undefined,
  ]
    .filter(Boolean)
    .join('  >  ');

  return (
    <section className="overflow-hidden rounded-2xl border border-amber-200 bg-card shadow-sm">
      {/* Header */}
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-amber-200 bg-gradient-to-r from-amber-50 to-transparent px-5 py-3">
        <div className="flex items-baseline gap-2">
          <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-amber-800">
            Vimshottari Dasha
          </span>
          <span className="font-serif text-[11px] text-amber-700/70" lang="sa">
            {SANSKRIT.dasha}
          </span>
        </div>
        {trail && (
          <span className="flex items-center gap-1.5 rounded-full bg-red-100 px-3 py-1 text-[10px] font-semibold text-red-900 ring-1 ring-inset ring-red-200">
            <span className="inline-block h-1.5 w-1.5 animate-pulse-soft rounded-full bg-red-500" />
            {trail}
          </span>
        )}
      </header>

      {/* Timeline strip */}
      <TimelineStrip mds={mds} selected={mahaIdx} current={currentMahaIdx} onSelect={setMahaIdx} />

      {/* 3-column cascading tree */}
      <div className="grid divide-y divide-amber-100 lg:grid-cols-3 lg:divide-x lg:divide-y-0">
        <MahaColumn
          mds={mds}
          current={currentMahaIdx}
          selected={mahaIdx}
          onSelect={setMahaIdx}
        />
        <AntarColumn
          antars={antars}
          current={currentAntarIdx}
          selected={antarIdx}
          onSelect={setAntarIdx}
          parent={maha?.planet}
        />
        <PratyantarColumn
          pratyantars={pratyantars}
          current={currentPratyantarIdx}
          parent={antar?.planet}
        />
      </div>

      {/* Footer */}
      <footer className="border-t border-amber-100 bg-amber-50/40 px-5 py-2.5 text-[10px] leading-relaxed text-muted-foreground">
        Vimshottari spans 120 years across 9 grahas. Click a mahadasha to explore its
        {' '}antardashas, then an antardasha to see its pratyantardashas.
      </footer>
    </section>
  );
}

/* ------------------------------------------------------------------ *
 * Timeline strip — proportional across all 9 mahadashas
 * ------------------------------------------------------------------ */
function TimelineStrip({
  mds, selected, current, onSelect,
}: {
  mds: DashaPeriod[];
  selected: number;
  current: number;
  onSelect: (i: number) => void;
}) {
  const total = mds.reduce((s, m) => s + (m.durationYears ?? 0), 0) || 1;

  return (
    <div className="border-b border-amber-100 bg-gradient-to-r from-amber-50/40 to-transparent px-5 py-3">
      <div className="mb-1.5 flex items-center justify-between text-[10px] text-muted-foreground">
        <span className="font-semibold uppercase tracking-wider">120-year timeline</span>
        <span className="font-mono">{new Date().getFullYear()}</span>
      </div>
      <div className="flex h-7 w-full overflow-hidden rounded-md ring-1 ring-inset ring-amber-200">
        {mds.map((m, i) => {
          const color = planetColor(m.planet);
          const isCurrent = i === current;
          const isSelected = i === selected;
          const width = ((m.durationYears ?? 0) / total) * 100;

          return (
            <button
              key={i}
              onClick={() => onSelect(i)}
              title={m.planet + ' - ' + (m.durationYears ?? 0).toFixed(1) + 'y'}
              style={{ width: width + '%' }}
              className={cn(
                'relative flex items-center justify-center text-[9px] font-bold text-white transition-all',
                color.dot,
                isCurrent && 'ring-2 ring-inset ring-red-600',
                isSelected && !isCurrent && 'ring-2 ring-inset ring-amber-600',
                !isSelected && !isCurrent && 'opacity-70 hover:opacity-100',
              )}
            >
              <span className="pointer-events-none drop-shadow-sm">
                {PLANET_ABBR[m.planet] ?? m.planet.slice(0, 2)}
              </span>
              {isCurrent && (
                <span className="absolute -bottom-0.5 left-1/2 h-0.5 w-3 -translate-x-1/2 rounded-full bg-red-600" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Column 1 — Mahadasha
 * ------------------------------------------------------------------ */
function MahaColumn({
  mds, current, selected, onSelect,
}: {
  mds: DashaPeriod[];
  current: number;
  selected: number;
  onSelect: (i: number) => void;
}) {
  return (
    <div className="flex flex-col">
      <ColumnHeader
        label="Mahadasha"
        sanskrit={SANSKRIT.mahadasha}
        count={mds.length}
      />
      <ul className="max-h-[420px] divide-y divide-amber-100 overflow-y-auto">
        {mds.map((m, i) => (
          <PlanetRow
            key={i}
            period={m}
            current={i === current}
            selected={i === selected}
            onSelect={() => onSelect(i)}
          />
        ))}
      </ul>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Column 2 — Antardasha
 * ------------------------------------------------------------------ */
function AntarColumn({
  antars, current, selected, onSelect, parent,
}: {
  antars: DashaPeriod[];
  current: number;
  selected: number;
  onSelect: (i: number) => void;
  parent?: string;
}) {
  return (
    <div className="flex flex-col">
      <ColumnHeader
        label="Antardasha"
        sanskrit={SANSKRIT.antardasha}
        count={antars.length}
        parent={parent}
      />
      {antars.length === 0 ? (
        <p className="px-4 py-6 text-xs italic text-muted-foreground">
          No antardashas available for this period.
        </p>
      ) : (
        <ul className="max-h-[420px] divide-y divide-amber-100 overflow-y-auto">
          {antars.map((a, i) => (
            <PlanetRow
              key={i}
              period={a}
              parentPlanet={parent}
              current={i === current}
              selected={i === selected}
              onSelect={() => onSelect(i)}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Column 3 — Pratyantardasha
 * ------------------------------------------------------------------ */
function PratyantarColumn({
  pratyantars, current, parent,
}: {
  pratyantars: DashaPeriod[];
  current: number;
  parent?: string;
}) {
  return (
    <div className="flex flex-col">
      <ColumnHeader
        label="Pratyantar"
        sanskrit={SANSKRIT.pratyantar}
        count={pratyantars.length}
        parent={parent}
      />
      {pratyantars.length === 0 ? (
        <p className="px-4 py-6 text-xs italic text-muted-foreground">
          No pratyantardashas available for this antardasha.
        </p>
      ) : (
        <ul className="max-h-[420px] divide-y divide-amber-100 overflow-y-auto">
          {pratyantars.map((p, i) => {
            const color = planetColor(p.planet);
            const isCurrent = i === current;
            return (
              <li
                key={i}
                className={cn(
                  'relative flex items-center gap-2 px-4 py-2 text-xs transition-colors',
                  isCurrent ? 'bg-red-50/70' : 'hover:bg-amber-50/40',
                )}
              >
                {isCurrent && (
                  <span className="absolute left-0 top-0 h-full w-0.5 bg-red-500" />
                )}
                <span className={cn('w-5 shrink-0 text-center text-sm leading-none', color.text)}>
                  {PLANET_ABBR[p.planet] ?? p.planet.slice(0, 2)}
                </span>
                <div className="flex min-w-0 flex-1 flex-col leading-tight">
                  <span className="truncate font-medium">
                    <span className="text-muted-foreground">{parent}</span>
                    <span className="mx-1 text-muted-foreground/50">{'>'}</span>
                    <span>{p.planet}</span>
                    {isCurrent && (
                      <span className="ml-1.5 rounded-full bg-red-600 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wider text-white">
                        Now
                      </span>
                    )}
                  </span>
                  <span className="font-mono text-[9px] text-muted-foreground">
                    {fmtDateShort(p.startTime)} - {fmtDateShort(p.endTime)}
                  </span>
                </div>
                <span className="shrink-0 font-mono text-[9px] text-muted-foreground">
                  {fmtDuration(p.startTime, p.endTime)}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Column header (sticky)
 * ------------------------------------------------------------------ */
function ColumnHeader({
  label, sanskrit, count, parent,
}: {
  label: string;
  sanskrit: string;
  count: number;
  parent?: string;
}) {
  return (
    <div className="sticky top-0 z-10 flex items-center justify-between gap-2 border-b border-amber-200 bg-gradient-to-r from-amber-50 to-amber-50/40 px-4 py-2 backdrop-blur">
      <div>
        <p className="font-serif text-sm font-semibold leading-tight text-amber-900">
          {label}
        </p>
        <p className="font-serif text-[10px] leading-tight text-amber-700/70" lang="sa">
          {sanskrit}
        </p>
      </div>
      <div className="flex flex-col items-end gap-0.5">
        {parent && (
          <span className="text-[9px] text-muted-foreground">of {parent}</span>
        )}
        <span className="rounded-full bg-amber-100 px-2 py-0.5 font-mono text-[9px] font-bold tabular-nums text-amber-800 ring-1 ring-inset ring-amber-200">
          {count}
        </span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Planet row (used for both maha and antar columns)
 * ------------------------------------------------------------------ */
function PlanetRow({
  period, parentPlanet, current, selected, onSelect,
}: {
  period: DashaPeriod;
  parentPlanet?: string;
  current: boolean;
  selected: boolean;
  onSelect: () => void;
}) {
  const color = planetColor(period.planet);

  return (
    <li>
      <button
        type="button"
        onClick={onSelect}
        className={cn(
          'relative flex w-full items-center gap-2 px-4 py-2 text-left text-xs transition-colors',
          selected && 'bg-amber-50/80',
          !selected && 'hover:bg-muted/40',
          current && 'font-semibold',
        )}
      >
        {/* Current indicator */}
        {current && (
          <span className="absolute left-0 top-0 h-full w-0.5 bg-red-500" />
        )}

        {/* Planet glyph */}
        <span className={cn('w-6 shrink-0 text-center text-lg leading-none', color.text)}>
          {PLANET_GLYPH[period.planet] ?? period.planet.slice(0, 2)}
        </span>

        {/* Planet name + dates */}
        <div className="flex min-w-0 flex-1 flex-col leading-tight">
          <div className="flex items-center gap-1.5">
            <span className={cn('text-sm', selected && 'text-amber-950')}>
              {parentPlanet && (
                <>
                  <span className="text-muted-foreground">{parentPlanet}</span>
                  <span className="mx-1 text-muted-foreground/50">{'>'}</span>
                </>
              )}
              <span>{period.planet}</span>
            </span>
            {current && (
              <span className="rounded-full bg-red-600 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wider text-white">
                Now
              </span>
            )}
          </div>
          <span className="font-mono text-[9px] text-muted-foreground">
            {fmtDateShort(period.startTime)} - {fmtDateShort(period.endTime)}
          </span>
        </div>

        {/* Duration chip */}
        <span className={cn(
          'shrink-0 rounded px-1.5 py-0.5 font-mono text-[9px] font-bold tabular-nums',
          color.chip,
        )}>
          {fmtDuration(period.startTime, period.endTime)}
        </span>
      </button>
    </li>
  );
}