import { RASHIS, PLANET_ABBR, rashiByName, planetsByRashi } from '@/lib/astro';

const POLYGONS: [string, number, number][] = [
  ['100,0 150,50 100,100 50,50', 100, 50],
  ['0,0 100,0 50,50', 38, 20],
  ['0,0 50,50 0,100', 16, 50],
  ['0,100 50,50 100,100 50,150', 48, 100],
  ['0,100 0,200 50,150', 16, 152],
  ['0,200 100,200 50,150', 38, 180],
  ['100,200 150,150 100,100 50,150', 100, 150],
  ['100,200 200,200 150,150', 162, 180],
  ['200,200 200,100 150,150', 184, 152],
  ['200,100 150,50 100,100 150,150', 152, 100],
  ['200,0 200,100 150,50', 184, 50],
  ['200,0 100,0 150,50', 162, 20],
];

export function NorthChart({ chart }: { chart: any }) {
  const byRashi = planetsByRashi(chart);
  const lagnaIdx = rashiByName(chart?.ascendant?.rashiName).index;
  const lagnaRashi = rashiByName(chart?.ascendant?.rashiName);

  const houseRashi: number[] = [];
  for (let h = 1; h <= 12; h++) houseRashi[h] = (lagnaIdx + h - 1) % 12;

  return (
    <div className="aspect-square w-full overflow-hidden rounded-2xl border-2 border-amber-300 bg-amber-100 p-1 shadow-md">
      <svg viewBox="0 0 200 200" className="h-full w-full">
        <rect x="0" y="0" width="200" height="200" fill="rgb(255 251 235)" stroke="rgb(252 211 77)" strokeWidth="0.5" />
        {POLYGONS.map(([points, cx, cy], i) => {
          const h = i + 1;
          const rashiIdx = houseRashi[h];
          const rashi = RASHIS[rashiIdx];
          const occupants = byRashi[rashiIdx] ?? [];
          const isLagna = h === 1;
          return (
            <g key={h}>
              <polygon points={points}
                fill={isLagna ? 'rgb(254 202 202 / 0.75)' : 'transparent'}
                stroke={isLagna ? 'rgb(239 68 68)' : 'rgb(252 211 77)'}
                strokeWidth={isLagna ? 0.9 : 0.5} />
              <text x={cx - 18} y={cy - 18} fontSize="5" fill="rgb(146 64 14)"
                fontFamily="monospace" fontWeight={700}>{h}</text>
              <text x={cx} y={cy - 6} fontSize="10" textAnchor="middle" fill="rgb(120 53 15)">
                {rashi.symbol}
              </text>
              {occupants.map((name, idx) => (
                <text key={name}
                  x={cx + (idx % 2) * 12 - 12}
                  y={cy + 4 + Math.floor(idx / 2) * 7}
                  fontSize="6" fill="rgb(120 53 15)" fontWeight={700}>
                  {PLANET_ABBR[name] ?? name.slice(0, 2)}
                </text>
              ))}
              {isLagna && (
                <text x={cx + 8} y={cy - 12} fontSize="4.5" fill="rgb(185 28 28)" fontWeight={800}>
                  ASC
                </text>
              )}
            </g>
          );
        })}
      </svg>
      <p className="sr-only">Lagna {lagnaRashi.name}</p>
    </div>
  );
}