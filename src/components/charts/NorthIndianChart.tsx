import { RASHIS, PLANET_ABBR, planetColor, rashiByName, planetsByRashi } from '@/lib/astro';

/* Fixed house positions: H1 is top-center diamond. */
const POLYGONS: [string, number, number][] = [
  ['100,0 150,50 100,100 50,50', 100, 55],
  ['0,0 100,0 50,50', 42, 22],
  ['0,0 50,50 0,100', 20, 55],
  ['0,100 50,50 100,100 50,150', 50, 100],
  ['0,100 0,200 50,150', 20, 155],
  ['0,200 100,200 50,150', 42, 185],
  ['100,200 150,150 100,100 50,150', 100, 155],
  ['100,200 200,200 150,150', 158, 185],
  ['200,200 200,100 150,150', 180, 155],
  ['200,100 150,50 100,100 150,150', 150, 100],
  ['200,0 200,100 150,50', 180, 55],
  ['200,0 100,0 150,50', 158, 22],
];

const HOUSE_NUM_POS: [number, number, 'start' | 'end'][] = [
  [100, 12, 'start'],
  [6, 9, 'start'],
  [4, 42, 'start'],
  [4, 98, 'start'],
  [4, 162, 'start'],
  [6, 196, 'start'],
  [100, 196, 'start'],
  [194, 196, 'end'],
  [196, 162, 'end'],
  [196, 98, 'end'],
  [196, 42, 'end'],
  [194, 9, 'end'],
];

export function NorthIndianChart({ chart }: { chart: any }) {
  const byRashi = planetsByRashi(chart);
  const lagnaRashi = rashiByName(chart?.ascendant?.rashiName);
  const lagnaIdx = lagnaRashi.index;

  const houseRashi: number[] = [];
  for (let h = 1; h <= 12; h++) houseRashi[h] = (lagnaIdx + h - 1) % 12;

  return (
    <div className="relative mx-auto aspect-square w-full max-w-[560px]">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute -inset-6 rounded-3xl bg-gradient-to-br from-amber-200/30 via-transparent to-red-200/20 blur-2xl" />

      <div className="relative aspect-square w-full overflow-hidden rounded-2xl border-2 border-amber-300 bg-gradient-to-br from-amber-50 via-white to-amber-50/50 p-1.5 shadow-[0_0_60px_-15px_rgba(251,191,36,0.5)]">
        <svg viewBox="0 0 200 200" className="h-full w-full">
          {/* Luminous amber background */}
          <defs>
            <radialGradient id="northLagnaGlow" cx="50%" cy="8%" r="40%">
              <stop offset="0%" stopColor="rgb(254 202 202 / 0.6)" />
              <stop offset="100%" stopColor="rgb(254 202 202 / 0)" />
            </radialGradient>
          </defs>
          <rect x="0" y="0" width="200" height="200" fill="rgb(255 251 235)" />
          <rect x="0" y="0" width="200" height="200" fill="url(#northLagnaGlow)" />

          {POLYGONS.map(([points, cx, cy], i) => {
            const houseNo = i + 1;
            const rashiIdx = houseRashi[houseNo];
            const rashi = RASHIS[rashiIdx];
            const occupants = byRashi[rashiIdx] ?? [];
            const isLagna = houseNo === 1;

            const [lx, ly, anchor] = HOUSE_NUM_POS[i];

            return (
              <g key={houseNo}>
                <polygon
                  points={points}
                  fill={isLagna ? 'rgb(254 202 202 / 0.5)' : 'transparent'}
                  stroke={isLagna ? 'rgb(239 68 68)' : 'rgb(252 211 77)'}
                  strokeWidth={isLagna ? 0.9 : 0.5}
                />

                {/* House number */}
                <text
                  x={lx} y={ly}
                  fontSize="5.5"
                  textAnchor={anchor}
                  fontFamily="monospace"
                  fontWeight={700}
                  fill={isLagna ? 'rgb(127 29 29)' : 'rgb(146 64 14 / 0.6)'}
                >
                  {houseNo}
                </text>

                {/* ASC marker */}
                {isLagna && (
                  <>
                    <rect
                      x={92} y={2} width="16" height="6" rx="1"
                      fill="rgb(220 38 38)"
                    />
                    <text
                      x={100} y={6.4}
                      fontSize="4.5"
                      textAnchor="middle"
                      fontWeight={800}
                      fill="white"
                    >
                      ASC
                    </text>
                  </>
                )}

                {/* Rashi symbol */}
                <text
                  x={cx} y={cy - 6}
                  fontSize="10"
                  textAnchor="middle"
                  fill={isLagna ? 'rgb(153 27 27)' : 'rgb(120 53 15)'}
                >
                  {rashi.symbol}
                </text>

                {/* Planet chips */}
                {occupants.slice(0, 4).map((name, idx) => {
                  const color = planetColor(name);
                  const abbr = PLANET_ABBR[name] ?? name.slice(0, 2);
                  const cols = occupants.length <= 2 ? occupants.length : 2;
                  const col = idx % cols;
                  const row = Math.floor(idx / cols);
                  const xOff = (col - (cols - 1) / 2) * 13;
                  return (
                    <text
                      key={name}
                      x={cx + xOff}
                      y={cy + 4 + row * 6.5}
                      fontSize="5.8"
                      textAnchor="middle"
                      fontWeight={700}
                      className={color.text}
                      style={{ fill: 'currentColor' }}
                    >
                      {abbr}
                    </text>
                  );
                })}
                {occupants.length > 4 && (
                  <text
                    x={cx} y={cy + 18}
                    fontSize="5"
                    textAnchor="middle"
                    fontWeight={700}
                    fill="rgb(120 53 15)"
                  >
                    +{occupants.length - 4}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}