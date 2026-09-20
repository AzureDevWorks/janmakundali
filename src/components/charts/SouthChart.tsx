import { RASHIS, PLANET_ABBR, rashiByName, planetsByRashi } from '@/lib/astro';

const LAYOUT: (number | null)[][] = [
  [11, 0,    1,    2],
  [10, null, null, 3],
  [9,  null, null, 4],
  [8,  7,    6,    5],
];

export function SouthChart({ chart }: { chart: any }) {
  const byRashi = planetsByRashi(chart);
  const lagnaIdx = rashiByName(chart?.ascendant?.rashiName).index;
  const lagnaRashi = rashiByName(chart?.ascendant?.rashiName);

  return (
    <div className="aspect-square w-full overflow-hidden rounded-2xl border-2 border-amber-300 bg-amber-100 p-1 shadow-md">
      <div className="grid h-full w-full grid-cols-4 grid-rows-4 gap-px bg-amber-300">
        {LAYOUT.flat().map((signIndex, i) => {
          if (signIndex === null) {
            if (i === 5) {
              return (
                <div key={i} className="col-span-2 row-span-2 flex flex-col items-center justify-center gap-1 bg-amber-50">
                  <span className="rounded-full bg-red-600 px-2 py-0.5 text-[9px] font-extrabold uppercase text-white">
                    ASC {lagnaRashi.name}
                  </span>
                  <span className="text-2xl leading-none">{lagnaRashi.symbol}</span>
                </div>
              );
            }
            return null;
          }
          const rashi = RASHIS[signIndex];
          const occupants = byRashi[signIndex] ?? [];
          const isLagna = signIndex === lagnaIdx;
          const houseNo = ((signIndex - lagnaIdx + 12) % 12) + 1;
          return (
            <div key={i}
              className={
                'relative flex flex-col gap-0.5 p-1.5 ' +
                (isLagna ? 'bg-red-100 ring-2 ring-inset ring-red-500' : 'bg-amber-50')
              }>
              <div className="flex items-start justify-between leading-none">
                <span className={
                  'text-[10px] font-bold tabular-nums ' +
                  (isLagna ? 'text-red-900' : 'text-amber-800/70')
                }>{houseNo}</span>
                {isLagna && (
                  <span className="rounded-sm bg-red-600 px-1 text-[7px] font-extrabold uppercase text-white">
                    ASC
                  </span>
                )}
              </div>
              <div className="flex flex-1 items-center justify-center text-lg leading-none">
                {rashi.symbol}
              </div>
              <div className="flex flex-wrap justify-center gap-px">
                {occupants.map((name) => (
                  <span key={name}
                    className={
                      'inline-flex items-center rounded border px-1 text-[9px] font-bold leading-tight ' +
                      (isLagna
                        ? 'border-red-300 bg-red-50 text-red-950'
                        : 'border-amber-300 bg-amber-100 text-amber-950')
                    }>
                    {PLANET_ABBR[name] ?? name.slice(0, 2)}
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