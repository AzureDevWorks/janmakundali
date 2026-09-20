import { Card } from '@/components/ui/Card';
import { cn } from '@/lib/utils';
import {
  CLASSICAL_PLANETS, PLANET_GLYPH, rashiByName, planetColor,
} from '@/lib/astro';

const DOT = '\u00B7';
const CHECK = '\u2705';
const CROSS = '\u274C';
const WARN = '\u26A0\uFE0F';

function statusStyle(netStatus: string): { chip: string; icon: string } {
  const s = (netStatus ?? '').toLowerCase();
  if (s.includes('favorable') && !s.includes('un'))
    return { chip: 'bg-emerald-100 text-emerald-800 ring-emerald-200', icon: CHECK };
  if (s.includes('obstructed'))
    return { chip: 'bg-violet-100 text-violet-800 ring-violet-200', icon: WARN };
  if (s.includes('unfavorable'))
    return { chip: 'bg-red-100 text-red-800 ring-red-200', icon: CROSS };
  return { chip: 'bg-muted text-muted-foreground ring-border', icon: DOT };
}

export function PlanetTransitTable({ gochar }: { gochar: any }) {
  if (!gochar?.planets) return null;

  return (
    <Card
      title="Transiting Grahas"
      subtitle="All 9 planets today"
      bodyClass="p-0"
    >
      <ul className="divide-y divide-amber-100">
        {CLASSICAL_PLANETS.map((name) => {
          const t = gochar.planets[name];
          if (!t) return null;

          const color = planetColor(name);
          const glyph = PLANET_GLYPH[name] ?? '\u25CF';
          const rashi = rashiByName(t.rashiName);
          const style = statusStyle(t.netStatus);

          return (
            <li
              key={name}
              className={cn(
                'relative flex flex-col gap-2 px-4 py-3 transition-colors hover:bg-amber-50/40',
              )}
            >
              {/* Left color bar */}
              <span className={cn('absolute left-0 top-0 h-full w-1', color.dot)} />

              <div className="flex items-center gap-3">
                {/* Glyph */}
                <span className={cn('w-8 shrink-0 text-center text-2xl leading-none', color.text)}>
                  {glyph}
                </span>

                {/* Name + rashi */}
                <div className="flex min-w-0 flex-1 flex-col">
                  <div className="flex items-center gap-2">
                    <span className="font-serif text-base font-semibold text-amber-950">{name}</span>
                    {t.isRetrograde && (
                      <span className="rounded bg-red-100 px-1.5 py-0.5 text-[9px] font-bold uppercase text-red-800 ring-1 ring-inset ring-red-200">
                        Retro
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    <span className="text-sm leading-none">{rashi.symbol}</span>{' '}
                    {rashi.name}
                    {t.nakshatra && (
                      <>
                        <span className="mx-1 opacity-40">{DOT}</span>
                        {t.nakshatra}
                        <span className="mx-1 opacity-40">{DOT}</span>
                        pada {t.pada}
                      </>
                    )}
                  </p>
                </div>

                {/* House chips */}
                <div className="flex shrink-0 flex-col items-end gap-1">
                  <span className="inline-flex items-center gap-1 rounded bg-amber-100 px-1.5 py-0.5 font-mono text-[10px] font-bold text-amber-900 ring-1 ring-inset ring-amber-200">
                    Moon H{t.houseFromMoon ?? '?'}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded bg-stone-100 px-1.5 py-0.5 font-mono text-[10px] font-bold text-stone-800 ring-1 ring-inset ring-stone-200">
                    Lagna H{t.houseFromLagna ?? '?'}
                  </span>
                </div>

                {/* Verdict */}
                <span className={cn(
                  'inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ring-1 ring-inset',
                  style.chip,
                )}>
                  <span aria-hidden="true">{style.icon}</span>
                  {t.netStatus}
                </span>
              </div>

              {/* Prediction */}
              {t.prediction && (
                <p className="ml-11 text-[11px] leading-relaxed text-muted-foreground">
                  {t.prediction}
                </p>
              )}

              {/* Vedha warning */}
              {t.hasVedha && t.vedhaCausedBy && (
                <p className="ml-11 flex items-start gap-1.5 rounded border border-violet-200 bg-violet-50/60 px-2 py-1 text-[10px] text-violet-900">
                  <span className="shrink-0">{WARN}</span>
                  <span>{t.vedhaCausedBy}</span>
                </p>
              )}

              {/* SAV bindus mini-bar */}
              {typeof t.savBindusInHouse === 'number' && (
                <div className="ml-11 flex items-center gap-2 text-[10px] text-muted-foreground">
                  <span className="shrink-0 font-mono">SAV</span>
                  <div className="h-1 w-24 overflow-hidden rounded-full bg-muted">
                    <div
                      className={cn(
                        'h-full rounded-full',
                        t.savBindusInHouse >= 28 ? 'bg-emerald-500'
                        : t.savBindusInHouse >= 22 ? 'bg-amber-500'
                        : 'bg-red-500',
                      )}
                      style={{ width: Math.min(100, (t.savBindusInHouse / 40) * 100) + '%' }}
                    />
                  </div>
                  <span className="font-mono font-bold tabular-nums">{t.savBindusInHouse}</span>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </Card>
  );
}