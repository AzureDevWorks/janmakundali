import { RASHIS, rashiByName, planetsByRashi } from '@/lib/astro';
import { colorForHouse, HOUSE_COLORS } from '@/theme';
import { cn } from '@/lib/utils';

const LAYOUT: (number | null)[][] = [
  [11, 0, 1, 2],
  [10, null, null, 3],
  [9, null, null, 4],
  [8, 7, 6, 5],
];

/* Depth recipe: inset top highlight + inset bottom shade + soft outer shadow. */
const CELL_DEPTH =
  'shadow-[inset_0_1px_0_rgba(255,255,255,0.95),inset_0_-1px_0_rgba(0,0,0,0.04),0_1px_2px_rgba(0,0,0,0.05),0_2px_4px_rgba(0,0,0,0.03)]';

const CELL_DEPTH_HOVER =
  'hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.95),inset_0_-1px_0_rgba(0,0,0,0.04),0_6px_14px_-4px_rgba(0,0,0,0.15),0_2px_4px_rgba(0,0,0,0.06)]';

export function ModernSouthChart({ chart }: { chart: any }) {
  const byRashi = planetsByRashi(chart);
  const lagnaRashi = rashiByName(chart?.ascendant?.rashiName);
  const lagnaIdx = lagnaRashi.index;

  return (
    <div className="relative aspect-square w-full">
      <div className="pointer-events-none absolute -inset-4 rounded-[2.5rem] bg-gradient-to-br from-amber-300/25 via-transparent to-red-300/15 blur-3xl" />

      <div className="relative grid h-full w-full grid-cols-4 grid-rows-4 gap-1.5 rounded-[2rem] border border-amber-200/70 bg-gradient-to-br from-amber-100/40 via-white to-amber-50/50 p-2.5 shadow-[0_20px_50px_-20px_rgba(180,83,9,0.25),inset_0_1px_0_rgba(255,255,255,0.9),inset_0_-1px_2px_rgba(180,83,9,0.06)]">
        {LAYOUT.flat().map((signIndex, i) => {
          if (signIndex === null) {
            if (i === 5) {
              return (
                <div
                  key={i}
                  className="col-span-2 row-span-2 flex flex-col items-center justify-center gap-1.5 rounded-xl bg-gradient-to-br from-amber-50/80 via-white to-amber-100/40 shadow-[inset_0_1px_0_rgba(255,255,255,0.95),inset_0_-1px_2px_rgba(180,83,9,0.08)]"
                >
                  <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-amber-700/70">
                    Lagna
                  </p>
                  <span className="text-4xl leading-none">{lagnaRashi.symbol}</span>
                  <p className="font-serif text-base font-bold leading-tight text-amber-950">
                    {lagnaRashi.name}
                  </p>
                  <p className="text-[10px] text-muted-foreground">{lagnaRashi.english}</p>
                </div>
              );
            }
            return null;
          }

          const rashi = RASHIS[signIndex];
          const occupants = byRashi[signIndex] ?? [];
          const isLagna = signIndex === lagnaIdx;
          const houseNo = ((signIndex - lagnaIdx + 12) % 12) + 1;
          const hc = colorForHouse(houseNo);

          return (
            <div
              key={i}
              className={cn(
                'group relative flex flex-col rounded-xl border p-2 transition-all duration-200 hover:-translate-y-0.5',
                hc.border,
                'bg-gradient-to-br',
                hc.bgGrad,
                CELL_DEPTH,
                CELL_DEPTH_HOVER,
                isLagna && 'ring-2 ring-inset ring-red-400/50',
              )}
            >
              {/* Header: house number + rashi */}
              <div className="flex items-start justify-between leading-none">
                <span
                  className={cn(
                    'flex h-4 w-4 items-center justify-center rounded font-mono text-[9px] font-bold tabular-nums shadow-sm',
                    hc.numBg,
                    hc.numText,
                  )}
                >
                  {houseNo}
                </span>
                <span
                  className={cn('text-lg leading-none', hc.symbol)}
                  title={rashi.name + ' - ' + rashi.english}
                >
                  {rashi.symbol}
                </span>
              </div>

              {/* ASC pill for lagna cell */}
              {isLagna && (
                <span className="mt-1 w-fit rounded bg-red-600 px-1 py-0.5 text-[7px] font-extrabold uppercase tracking-wider text-white shadow-[0_1px_2px_rgba(220,38,38,0.35)]">
                  ASC
                </span>
              )}

              {/* Planet chips */}
              <div className="mt-auto flex flex-wrap gap-0.5">
                {occupants.map((name) => (
                  <span
                    key={name}
                    title={name}
                    className={cn(
                      'inline-flex items-center rounded border px-1 py-0.5 text-[9px] font-bold leading-none shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]',
                      hc.chip,
                    )}
                  >
                    {name.slice(0, 2)}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}