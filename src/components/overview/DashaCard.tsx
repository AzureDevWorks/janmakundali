import { useState } from 'react';
import { PLANET_GLYPH, planetColor } from '@/lib/astro';
import { SANSKRIT, DOT } from '@/lib/text';
import { cn } from '@/lib/utils';
import { VimshottariDasha } from '@/components/dashas/VimshottariDasha';

interface Props {
  kundli: any;
}

export function DashaCard({ kundli }: Props) {
  const d = kundli?.dasha;
  const [expanded, setExpanded] = useState(false);

  if (!d) return null;

  const levels = [
    { key: 'maha',  label: 'Mahadasha',  sanskrit: SANSKRIT.mahadasha,  period: d.currentMahadasha },
    { key: 'antar', label: 'Antardasha', sanskrit: SANSKRIT.antardasha, period: d.currentAntar },
    { key: 'prat',  label: 'Pratyantar', sanskrit: SANSKRIT.pratyantar, period: d.currentPratyantar },
  ].filter((l) => l.period?.planet);

  if (levels.length === 0) return null;

  const trail = levels.map((l) => l.period.planet).join('  >  ');

  return (
    <section className="overflow-hidden rounded-2xl border border-amber-200 bg-card shadow-sm">
      {/* Header */}
      <header className="flex items-center justify-between gap-3 border-b border-amber-200 bg-gradient-to-r from-amber-50 to-transparent px-5 py-3">
        <div className="flex items-baseline gap-2">
          <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-amber-800">
            Current Dasha
          </span>
          <span className="font-serif text-[11px] text-amber-700/70" lang="sa">
            {SANSKRIT.dasha}
          </span>
        </div>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-1.5 w-1.5 animate-pulse-soft rounded-full bg-red-500" />
          <span className="font-serif text-xs font-semibold text-amber-950">{trail}</span>
        </span>
      </header>

      {/* Three levels */}
      <ol className="divide-y divide-amber-100">
        {levels.map((l, i) => {
          const planet = l.period.planet;
          const color = planetColor(planet);
          const glyph = PLANET_GLYPH[planet] ?? 'o';
          const start = l.period.startTime ? new Date(l.period.startTime) : null;
          const end   = l.period.endTime   ? new Date(l.period.endTime)   : null;
          const progress = Math.max(0, Math.min(100, l.period.progressPercent ?? 0));

          return (
            <li key={l.key} className="flex items-center gap-4 px-5 py-3">
              <span
                className={cn(
                  'flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold',
                  i === 0 ? 'bg-amber-500 text-white'
                  : i === 1 ? 'bg-amber-300 text-amber-950'
                  : 'bg-amber-100 text-amber-800 ring-1 ring-inset ring-amber-200',
                )}
              >
                {i + 1}
              </span>

              <div className="flex shrink-0 items-center gap-2">
                <span className={cn('text-xl leading-none', color.text)}>{glyph}</span>
                <div className="leading-tight">
                  <p className={cn('font-serif text-sm font-bold', color.text)}>{planet}</p>
                  <p className="text-[9px] uppercase tracking-wider text-muted-foreground">
                    {l.label}
                  </p>
                  <p className="font-serif text-[9px] text-amber-700/60" lang="sa">
                    {l.sanskrit}
                  </p>
                </div>
              </div>

              <div className="flex min-w-0 flex-1 flex-col gap-1">
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-amber-100">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-500 transition-all"
                    style={{ width: progress + '%' }}
                  />
                </div>
                <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                  <span className="font-mono">
                    {start ? start.toLocaleDateString([], { year: 'numeric', month: 'short' }) : '-'}
                  </span>
                  <span className="font-mono font-semibold tabular-nums">
                    {progress.toFixed(0)}%
                  </span>
                  <span className="font-mono">
                    {end ? end.toLocaleDateString([], { year: 'numeric', month: 'short' }) : '-'}
                  </span>
                </div>
              </div>
            </li>
          );
        })}
      </ol>

      {/* Toggle for full tree */}
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="flex w-full items-center justify-between gap-2 border-t border-amber-200 bg-amber-50/40 px-5 py-2.5 text-left text-[11px] font-semibold text-amber-900 transition-colors hover:bg-amber-50"
      >
        <span>Full 120-year tree {expanded ? '(hide)' : '(show)'}</span>
        <span className="text-[10px] text-amber-700/70">
          {expanded ? 'collapse' : 'expand'}
        </span>
      </button>

      {expanded && (
        <div className="border-t border-amber-100 p-3">
          <VimshottariDasha kundli={kundli} />
        </div>
      )}
    </section>
  );
}