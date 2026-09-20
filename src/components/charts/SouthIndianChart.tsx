import { RASHIS, rashiByName, planetsByRashi } from '@/lib/astro';
import { PlanetChip } from './PlanetChip';
import { cn } from '@/lib/utils';

const LAYOUT: (number | null)[][] = [
  [11, 0,    1,    2],
  [10, null, null, 3],
  [9,  null, null, 4],
  [8,  7,    6,    5],
];

interface Props {
  chart: any;
}

export function SouthIndianChart({ chart }: Props) {
  const byRashi = planetsByRashi(chart);
  const lagnaRashi = rashiByName(chart?.ascendant?.rashiName);
  const lagnaIdx = lagnaRashi.index;

  return (
    <div className="relative mx-auto aspect-square w-full max-w-[560px]">
      {/* Ambient glow behind chart */}
      <div className="pointer-events-none absolute -inset-6 rounded-3xl bg-gradient-to-br from-amber-200/30 via-transparent to-red-200/20 blur-2xl" />

      <div className="relative aspect-square w-full overflow-hidden rounded-2xl border-2 border-amber-300 bg-gradient-to-br from-amber-50 via-white to-amber-50/50 p-1.5 shadow-[0_0_60px_-15px_rgba(251,191,36,0.5)]">
        <div className="grid h-full w-full grid-cols-4 grid-rows-4 gap-[3px] bg-amber-300/60">
          {LAYOUT.flat().map((signIndex, i) => {
            if (signIndex === null) {
              if (i === 5) {
                return <CenterCell key={i} lagnaRashi={lagnaRashi} />;
              }
              return null;
            }
            return (
              <Cell
                key={i}
                signIndex={signIndex}
                lagnaIdx={lagnaIdx}
                occupants={byRashi[signIndex] ?? []}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */

function Cell({ signIndex, lagnaIdx, occupants }: {
  signIndex: number; lagnaIdx: number; occupants: string[];
}) {
  const rashi = RASHIS[signIndex];
  const isLagna = signIndex === lagnaIdx;
  const houseNo = ((signIndex - lagnaIdx + 12) % 12) + 1;

  return (
    <div
      className={cn(
        'group relative flex flex-col overflow-hidden rounded-[6px] p-1.5 transition-all',
        isLagna
          ? 'bg-gradient-to-br from-red-50 via-red-50 to-red-100 ring-2 ring-inset ring-red-400'
          : 'bg-white hover:bg-amber-50/80 hover:shadow-md',
      )}
    >
      {/* Top row: house number + rashi */}
      <div className="flex items-start justify-between leading-none">
        <span
          className={cn(
            'font-mono text-[10px] font-bold tabular-nums',
            isLagna ? 'text-red-800' : 'text-amber-700/60',
          )}
        >
          {houseNo}
        </span>
        <span
          className={cn(
            'text-base leading-none',
            isLagna ? 'text-red-700' : 'text-amber-700/70',
          )}
          title={rashi.name + ' · ' + rashi.english}
        >
          {rashi.symbol}
        </span>
      </div>

      {/* ASC badge */}
      {isLagna && (
        <div className="mt-0.5 flex">
          <span className="rounded-sm bg-red-600 px-1 text-[7px] font-extrabold uppercase leading-tight tracking-wide text-white shadow-sm">
            ASC
          </span>
        </div>
      )}

      {/* Planet chips */}
      <div className="mt-auto flex flex-wrap content-end gap-[3px]">
        {occupants.slice(0, 4).map((name) => (
          <PlanetChip key={name} name={name} />
        ))}
        {occupants.length > 4 && (
          <span className="inline-flex items-center rounded border border-amber-300 bg-amber-50 px-1 py-[3px] text-[9px] font-bold leading-none text-amber-900">
            +{occupants.length - 4}
          </span>
        )}
      </div>
    </div>
  );
}

function CenterCell({ lagnaRashi }: { lagnaRashi: any }) {
  return (
    <div className="col-span-2 row-span-2 flex flex-col items-center justify-center gap-2 rounded-[6px] bg-gradient-to-br from-amber-100 via-amber-50 to-white p-4">
      <div className="flex items-center gap-2">
        <span className="text-3xl leading-none">{lagnaRashi.symbol}</span>
        <div className="text-center">
          <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-amber-800">
            Lagna
          </p>
          <p className="text-base font-bold leading-tight text-amber-950">{lagnaRashi.name}</p>
          <p className="text-[10px] leading-tight text-amber-700">{lagnaRashi.english}</p>
        </div>
      </div>
      <span className="rounded-full bg-red-600 px-2.5 py-0.5 text-[8px] font-extrabold uppercase tracking-wider text-white shadow-sm">
        Ascendant
      </span>
    </div>
  );
}