import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { RASHIS, CLASSICAL_PLANETS } from '@/lib/astro';
import { cn } from '@/lib/utils';

function tone(v: number, max: number) {
  const r = v / max;
  if (r >= 0.75) return 'bg-emerald-500 text-white';
  if (r >= 0.55) return 'bg-emerald-300 text-emerald-950';
  if (r >= 0.40) return 'bg-amber-200 text-amber-950';
  if (r >= 0.25) return 'bg-orange-300 text-orange-950';
  return 'bg-red-300 text-red-950';
}

export function AshtakavargaCard({ kundli }: { kundli: any }) {
  const av = kundli?.ashtakavarga;
  const [tab, setTab] = useState<'sav' | 'bav'>('sav');
  if (!av) return null;

  const sav = av.sav;
  const bav = av.bav ?? {};

  return (
    <Card title="Ashtakavarga" subtitle="Bindu grids"
      right={
        <div className="inline-flex overflow-hidden rounded-md border text-[10px]">
          <button onClick={() => setTab('sav')}
            className={cn('px-2 py-1 font-semibold', tab === 'sav' ? 'bg-amber-500 text-white' : 'hover:bg-amber-50')}>
            SAV
          </button>
          <button onClick={() => setTab('bav')}
            className={cn('border-l px-2 py-1 font-semibold', tab === 'bav' ? 'bg-amber-500 text-white' : 'hover:bg-amber-50')}>
            BAV
          </button>
        </div>
      }>

      {tab === 'sav' && sav && (
        <>
          <div className="mb-3 flex items-center gap-4 text-xs text-muted-foreground">
            <span>Total <strong className="text-foreground">{sav.totalBindus}</strong></span>
            <span>Average <strong className="text-foreground">{sav.averageBindus?.toFixed?.(1) ?? sav.averageBindus}</strong></span>
            <span>Strong H<strong className="text-foreground">{sav.strongestHouse}</strong></span>
            <span>Weak H<strong className="text-foreground">{sav.weakestHouse}</strong></span>
          </div>
          <div className="grid grid-cols-12 gap-px overflow-hidden rounded-md border bg-border text-xs">
            {RASHIS.map((r, i) => {
              const b = sav.byRashi?.[i] ?? 0;
              return (
                <div key={i} className={cn('flex flex-col items-center justify-center p-2 tabular-nums', tone(b, 40))}>
                  <span className="text-[9px] font-medium opacity-80">{r.symbol}</span>
                  <span className="text-sm font-bold">{b}</span>
                </div>
              );
            })}
          </div>
        </>
      )}

      {tab === 'bav' && (
        <div className="space-y-3">
          {CLASSICAL_PLANETS.filter((p) => bav[p]).map((p) => {
            const grid = bav[p];
            const max = Math.max(...(grid.byRashi ?? []), 8);
            return (
              <div key={p}>
                <p className="mb-1 text-[10px] uppercase tracking-wider text-muted-foreground">
                  {p} · total {grid.totalBindus}
                </p>
                <div className="grid grid-cols-12 gap-px overflow-hidden rounded border bg-border text-xs">
                  {RASHIS.map((r, i) => {
                    const b = grid.byRashi?.[i] ?? 0;
                    return (
                      <div key={i} className={cn('flex flex-col items-center justify-center p-1.5 tabular-nums', tone(b, max))}>
                        <span className="text-[8px] font-medium opacity-70">{r.symbol}</span>
                        <span className="text-[11px] font-bold">{b}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}