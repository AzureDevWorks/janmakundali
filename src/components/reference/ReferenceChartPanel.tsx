import { useState } from 'react';
import { rashiByName, PLANET_ABBR, planetColor, PLANET_GLYPH, CLASSICAL_PLANETS } from '@/lib/astro';
import { ModernSouthChart } from '@/components/charts/ModernSouthChart';
import { ModernNorthChart } from '@/components/charts/ModernNorthChart';
import { cn } from '@/lib/utils';
import type { ReferenceMeta } from './referenceMeta';

interface Props {
  meta: ReferenceMeta;
  chart: any;
  style: 'north' | 'south';
}

export function ReferenceChartPanel({ meta, chart, style }: Props) {
  const [showDetail, setShowDetail] = useState(false);

  if (!chart) return null;

  const rashiName = chart?.ascendant?.rashiName;
  const rashi = rashiByName(rashiName);

  // Find planets in angular houses (1, 4, 7, 10) from the reference
  const angularHouses = new Set([1, 4, 7, 10]);
  const angularPlanets: { planet: string; house: number }[] = [];
  const allPlanets: { planet: string; house: number; rashiName: string }[] = [];

  (chart?.houses ?? []).forEach((h: any) => {
    const isAngular = angularHouses.has(h.number);
    (h.planets ?? []).forEach((p: string) => {
      if (!CLASSICAL_PLANETS.includes(p)) return;
      const entry = { planet: p, house: h.number, rashiName: h.rashi ?? '' };
      allPlanets.push(entry);
      if (isAngular) angularPlanets.push({ planet: p, house: h.number });
    });
  });

  const tone = meta.tone === 'moon'
    ? { bg: 'from-slate-50 via-slate-50/60 to-white', border: 'border-slate-200', accent: 'text-slate-700' }
    : { bg: 'from-orange-50 via-orange-50/60 to-white', border: 'border-orange-200', accent: 'text-orange-700' };

  return (
    <section className={cn(
      'overflow-hidden rounded-3xl border bg-gradient-to-br shadow-sm',
      tone.border,
      tone.bg,
    )}>
      {/* Header */}
      <header className={cn(
        'flex items-center justify-between gap-3 border-b px-5 py-3',
        tone.border,
        'bg-white/40',
      )}>
        <div className="flex items-baseline gap-2">
          <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
            {meta.title}
          </span>
          <span className="font-serif text-[11px] text-muted-foreground" lang="sa">
            {meta.sanskrit}
          </span>
        </div>
        <span className={cn('flex items-center gap-1.5 text-xs font-semibold', tone.accent)}>
          <span className="text-lg leading-none">{rashi.symbol}</span>
          {rashi.name}
        </span>
      </header>

      {/* Chart */}
      <div className="p-4">
        {style === 'south'
          ? <ModernSouthChart chart={chart} />
          : <ModernNorthChart chart={chart} />}
      </div>

      {/* Quick summary */}
      <div className="grid grid-cols-3 divide-x divide-border/60 border-t border-border/60 bg-white/40">
        <Stat
          label={meta.reference + ' sign'}
          value={rashi.name}
          sub={rashi.english}
        />
        <Stat
          label="Angular planets"
          value={String(angularPlanets.length)}
          sub={angularPlanets.length > 0
            ? angularPlanets.map((a) => PLANET_ABBR[a.planet]).join(' ')
            : 'none'}
        />
        <Stat
          label="Rashi lord"
          value={rashi.lord}
          sub={'\u2014'}
        />
      </div>

      {/* Toggle for detail */}
      <button
        type="button"
        onClick={() => setShowDetail((v) => !v)}
        className="flex w-full items-center justify-between gap-2 border-t border-border/60 bg-white/50 px-5 py-2.5 text-left text-[11px] font-semibold transition-colors hover:bg-white/80"
      >
        <span className={tone.accent}>
          {showDetail ? 'Hide details' : 'Show meaning & observations'}
        </span>
        <span className="text-[10px] text-muted-foreground">
          {showDetail ? '\u25B4' : '\u25BE'}
        </span>
      </button>

      {showDetail && (
        <div className="space-y-4 border-t border-border/60 bg-white/40 px-5 py-4">
          {/* Meaning */}
          <div>
            <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              What this chart reveals
            </p>
            <p className="text-[11px] leading-relaxed text-muted-foreground">
              {meta.meaning}
            </p>
          </div>

          {/* Purpose */}
          <div>
            <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Classical uses
            </p>
            <ul className="space-y-1">
              {meta.purpose.map((p, i) => (
                <li key={i} className="flex items-start gap-2 text-[11px] leading-relaxed text-muted-foreground">
                  <span className="mt-1.5 inline-block h-1 w-1 shrink-0 rotate-45 bg-amber-500" />
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Planet placement table */}
          {allPlanets.length > 0 && (
            <div>
              <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Planets by house from {meta.reference}
              </p>
              <div className="flex flex-wrap gap-1">
                {allPlanets.map((p) => {
                  const c = planetColor(p.planet);
                  const isAngular = angularHouses.has(p.house);
                  return (
                    <span
                      key={p.planet + '-' + p.house}
                      title={p.planet + ' in house ' + p.house + ' from ' + meta.reference}
                      className={cn(
                        'inline-flex items-center gap-1 rounded border px-1.5 py-0.5 text-[10px] font-bold',
                        c.chip,
                        isAngular && 'ring-1 ring-inset ring-amber-400',
                      )}
                    >
                      <span>{PLANET_ABBR[p.planet]}</span>
                      <span className="rounded bg-white/60 px-1 text-[9px] tabular-nums">
                        H{p.house}
                      </span>
                    </span>
                  );
                })}
              </div>
              <p className="mt-2 text-[9px] italic text-muted-foreground">
                Houses with amber ring are angular (1, 4, 7, 10) — strong placement from the reference.
              </p>
            </div>
          )}

          {/* Classical citation */}
          <p className="border-t border-border/40 pt-2 text-[10px] italic text-muted-foreground">
            {meta.classicalRef}
          </p>
        </div>
      )}
    </section>
  );
}

function Stat({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="px-4 py-3 text-center">
      <p className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <p className="mt-0.5 font-serif text-sm font-bold text-amber-950">{value}</p>
      {sub && <p className="mt-0.5 truncate text-[10px] text-muted-foreground">{sub}</p>}
    </div>
  );
}