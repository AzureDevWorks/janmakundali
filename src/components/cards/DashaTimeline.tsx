import { useEffect, useMemo, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { cn } from '@/lib/utils';
import { PLANET_ABBR, PLANET_GLYPH, planetColor } from '@/lib/astro';

/* ------------------------------------------------------------------ *
 * Types matching @prisri/jyotish dasha shape
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

interface Props {
  kundli: any;
}

/* ------------------------------------------------------------------ *
 * Root component
 * ------------------------------------------------------------------ */
export function DashaTimeline({ kundli }: Props) {
  const dasha = kundli?.dasha;
  if (!dasha) return null;

  const mds: DashaPeriod[] = dasha.mahadashas ?? [];
  const now = Date.now();

  const currentMahaIdx = useMemo(
    () => mds.findIndex((m) => now >= ts(m.startTime) && now < ts(m.endTime)),
    [mds, now],
  );

  // Auto-select the current maha on first render
  const [mahaIdx, setMahaIdx] = useState(currentMahaIdx >= 0 ? currentMahaIdx : 0);

  const maha = mds[mahaIdx];
  const antars = maha?.antars ?? [];

  const currentAntarIdx = useMemo(
    () => antars.findIndex((a) => now >= ts(a.startTime) && now < ts(a.endTime)),
    [antars, now],
  );

  const [antarIdx, setAntarIdx] = useState(currentAntarIdx >= 0 ? currentAntarIdx : 0);

  // Reset antar index when maha changes
  useEffect(() => {
    const idx = antars.findIndex((a) => now >= ts(a.startTime) && now < ts(a.endTime));
    setAntarIdx(idx >= 0 ? idx : 0);
  }, [mahaIdx]);

  const antar = antars[antarIdx];
  const pratyantars = antar?.pratyantars ?? [];

  const currentPratyantarIdx = useMemo(
    () => pratyantars.findIndex((p) => now >= ts(p.startTime) && now < ts(p.endTime)),
    [pratyantars, now],
  );

  return (
    <Card
      tone="amber"
      title="Vimshottari Dasha"
      subtitle="Maha · Antar · Pratyantar"
      right={
        <div className="flex items-center gap-2 rounded-full bg-red-100 px-2.5 py-0.5 text-[10px] font-semibold text-red-900 ring-1 ring-inset ring-red-200">
          <span className="inline-block h-1.5 w-1.5 animate-pulse-soft rounded-full bg-red-600" />
          {dasha.currentMahadasha?.planet} / {dasha.currentAntar?.planet}
          {dasha.currentPratyantar?.planet ? ' / ' + dasha.currentPratyantar.planet : ''}
        </div>
      }
      bodyClass="p-0"
    >
      {/* Birth star banner */}
      {dasha.birthNakshatra && (
        <div className="flex items-center justify-between border-b bg-gradient-to-r from-amber-50/60 to-transparent px-4 py-2 text-[11px]">
          <span className="text-muted-foreground">
            Janma Nakshatra ·{' '}
            <span className="font-semibold text-foreground">{dasha.birthNakshatra}</span>
            {dasha.nakshatraPada != null && (
              <span className="text-muted-foreground"> pada {dasha.nakshatraPada}</span>
            )}
          </span>
          <span className="text-[10px] text-muted-foreground">120-year cycle</span>
        </div>
      )}

      {/* Proportional strip across all 9 mahadashas */}
      <MahaStrip mds={mds} currentIdx={currentMahaIdx} onSelect={setMahaIdx} selectedIdx={mahaIdx} />

      {/* 3-column cascading view */}
      <div className="grid min-h-[420px] divide-y lg:grid-cols-3 lg:divide-x lg:divide-y-0">
        <MahaColumn mds={mds} selected={mahaIdx} currentIdx={currentMahaIdx} onSelect={setMahaIdx} />
        <AntarColumn antars={antars} selected={antarIdx} currentIdx={currentAntarIdx} onSelect={setAntarIdx} maha={maha} />
        <PratyantarColumn pratyantars={pratyantars} currentIdx={currentPratyantarIdx} antar={antar} />
      </div>

      {/* Footer */}
      <footer className="border-t bg-gradient-to-r from-amber-50/40 to-transparent px-4 py-2 text-[10px] text-muted-foreground">
        Vimshottari dasha spans 120 years across the 9 grahas. The Moon's birth nakshatra sets the starting
        balance — 3 levels are shown: Mahadasha → Antardasha → Pratyantardasha.
      </footer>
    </Card>
  );
}

/* ------------------------------------------------------------------ *
 * Proportional strip across the whole 120-year cycle
 * ------------------------------------------------------------------ */
function MahaStrip({
  mds, currentIdx, selectedIdx, onSelect,
}: {
  mds: DashaPeriod[];
  currentIdx: number;
  selectedIdx: number;
  onSelect: (i: number) => void;
}) {
  const total = mds.reduce((s, m) => s + (m.durationYears ?? 0), 0) || 1;
  const now = Date.now();

  return (
    <div className="border-b bg-muted/20 px-4 py-3">
      <div className="mb-1.5 flex items-center justify-between text-[10px] text-muted-foreground">
        <span className="font-semibold uppercase tracking-wider">120-year timeline</span>
        <span>{new Date().getFullYear()}</span>
      </div>
      <div className="flex h-6 w-full overflow-hidden rounded-md ring-1 ring-inset ring-amber-200">
        {mds.map((m, i) => {
          const color = planetColor(m.planet);
          const active = i === currentIdx;
          const selected = i === selectedIdx;
          return (
            <button
              key={i}
              onClick={() => onSelect(i)}
              title={m.planet + ' · ' + m.durationYears + 'y'}
              style={{ width: ((m.durationYears ?? 0) / total) * 100 + '%' }}
              className={cn(
                'relative flex items-center justify-center text-[9px] font-bold text-white transition-all',
                color.dot,
                active && 'ring-2 ring-inset ring-red-500',
                selected && !active && 'ring-2 ring-inset ring-amber-600',
                !selected && !active && 'opacity-75 hover:opacity-100',
              )}
            >
              <span className="pointer-events-none drop-shadow-sm">
                {PLANET_ABBR[m.planet] ?? m.planet.slice(0, 2)}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Column 1 — Mahadashas
 * ------------------------------------------------------------------ */
function MahaColumn({
  mds, selected, currentIdx, onSelect,
}: {
  mds: DashaPeriod[];
  selected: number;
  currentIdx: number;
  onSelect: (i: number) => void;
}) {
  return (
    <div className="lg:max-h-[520px] lg:overflow-y-auto">
      <ColumnHeader label="Mahadasha" sanskrit="महादशा" count={mds.length} />
      <ul className="divide-y">
        {mds.map((m, i) => {
          const color = planetColor(m.planet);
          const isSelected = i === selected;
          const isCurrent = i === currentIdx;
          return (
            <li key={i}>
              <button
                onClick={() => onSelect(i)}
                className={cn(
                  'flex w-full items-center gap-2 px-3 py-2 text-left transition-colors',
                  isSelected && 'bg-amber-50/80',
                  !isSelected && 'hover:bg-muted/40',
                )}
              >
                <span
                  className={cn('h-6 w-1 shrink-0 rounded-full', color.dot)}
                  aria-hidden="true"
                />
                <span className={cn('w-6 text-center text-base leading-none', color.text)}>
                  {PLANET_GLYPH[m.planet] ?? '●'}
                </span>
                <div className="flex flex-1 flex-col leading-tight">
                  <span className={cn('text-sm font-semibold', isSelected && 'text-amber-900')}>
                    {m.planet}
                    {isCurrent && (
                      <span className="ml-2 rounded-full bg-red-600 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wider text-white">
                        Now
                      </span>
                    )}
                  </span>
                  <span className="font-mono text-[10px] text-muted-foreground">
                    {year(m.startTime)}–{year(m.endTime)} · {m.durationYears}y
                  </span>
                </div>
                <span className={cn(
                  'rounded px-1.5 py-0.5 text-[10px] font-bold tabular-nums',
                  color.chip,
                )}>
                  {m.durationYears}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Column 2 — Antardashas of the selected maha
 * ------------------------------------------------------------------ */
function AntarColumn({
  antars, selected, currentIdx, onSelect, maha,
}: {
  antars: DashaPeriod[];
  selected: number;
  currentIdx: number;
  onSelect: (i: number) => void;
  maha?: DashaPeriod;
}) {
  return (
    <div className="lg:max-h-[520px] lg:overflow-y-auto">
      <ColumnHeader
        label="Antardasha"
        sanskrit="अन्तर्दशा"
        count={antars.length}
        parent={maha?.planet}
      />
      {antars.length === 0 ? (
        <p className="px-4 py-6 text-xs text-muted-foreground">No antardashas for this period.</p>
      ) : (
        <ul className="divide-y">
          {antars.map((a, i) => {
            const color = planetColor(a.planet);
            const isSelected = i === selected;
            const isCurrent = i === currentIdx;
            return (
              <li key={i}>
                <button
                  onClick={() => onSelect(i)}
                  className={cn(
                    'flex w-full items-center gap-2 px-3 py-2 text-left transition-colors',
                    isSelected && 'bg-amber-50/80',
                    !isSelected && 'hover:bg-muted/40',
                  )}
                >
                  <span className={cn('w-5 text-center text-sm leading-none', color.text)}>
                    {PLANET_GLYPH[a.planet] ?? '●'}
                  </span>
                  <div className="flex flex-1 flex-col leading-tight">
                    <span className="text-xs font-semibold">
                      <span className="text-muted-foreground">{maha?.planet}</span>
                      <span className="mx-1 text-muted-foreground/60">→</span>
                      <span className={cn(isSelected && 'text-amber-900')}>{a.planet}</span>
                      {isCurrent && (
                        <span className="ml-2 rounded-full bg-red-600 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wider text-white">
                          Now
                        </span>
                      )}
                    </span>
                    <span className="font-mono text-[10px] text-muted-foreground">
                      {dateShort(a.startTime)} → {dateShort(a.endTime)}
                    </span>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Column 3 — Pratyantardashas of the selected antar
 * ------------------------------------------------------------------ */
function PratyantarColumn({
  pratyantars, currentIdx, antar,
}: {
  pratyantars: DashaPeriod[];
  currentIdx: number;
  antar?: DashaPeriod;
}) {
  return (
    <div className="lg:max-h-[520px] lg:overflow-y-auto">
      <ColumnHeader
        label="Pratyantar"
        sanskrit="प्रत्यन्तर"
        count={pratyantars.length}
        parent={antar?.planet}
      />
      {pratyantars.length === 0 ? (
        <p className="px-4 py-6 text-xs text-muted-foreground">
          No pratyantardashas for this antar.
        </p>
      ) : (
        <ul className="divide-y">
          {pratyantars.map((p, i) => {
            const color = planetColor(p.planet);
            const isCurrent = i === currentIdx;
            return (
              <li
                key={i}
                className={cn(
                  'flex items-center gap-2 px-3 py-1.5 text-xs',
                  isCurrent && 'bg-red-50/70',
                )}
              >
                <span className={cn('w-4 text-center leading-none', color.text)}>
                  {PLANET_ABBR[p.planet] ?? p.planet.slice(0, 2)}
                </span>
                <div className="flex flex-1 flex-col leading-tight">
                  <span className="font-medium">
                    {antar?.planet} → {p.planet}
                    {isCurrent && (
                      <span className="ml-2 rounded-full bg-red-600 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wider text-white">
                        Now
                      </span>
                    )}
                  </span>
                  <span className="font-mono text-[10px] text-muted-foreground">
                    {dateShort(p.startTime)} → {dateShort(p.endTime)}
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Column header
 * ------------------------------------------------------------------ */
function ColumnHeader({
  label, sanskrit, count, parent,
}: {
  label: string; sanskrit: string; count: number; parent?: string;
}) {
  return (
    <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-gradient-to-r from-amber-50 to-amber-50/40 px-3 py-2 backdrop-blur">
      <div>
        <p className="font-serif text-sm font-semibold text-amber-900">{label}</p>
        <p className="text-[10px] text-amber-700/80">{sanskrit}</p>
      </div>
      <div className="flex flex-col items-end">
        {parent && <p className="text-[9px] text-muted-foreground">of {parent}</p>}
        <span className="rounded-full bg-amber-100 px-1.5 py-0.5 text-[9px] font-bold tabular-nums text-amber-800">
          {count}
        </span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Helpers
 * ------------------------------------------------------------------ */
function ts(v: string | Date | undefined): number {
  if (!v) return 0;
  return v instanceof Date ? v.getTime() : Date.parse(v);
}

function year(v: string | Date | undefined): number {
  if (!v) return 0;
  const d = v instanceof Date ? v : new Date(v);
  return d.getFullYear();
}

function dateShort(v: string | Date | undefined): string {
  if (!v) return '—';
  const d = v instanceof Date ? v : new Date(v);
  return d.toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: '2-digit' });
}