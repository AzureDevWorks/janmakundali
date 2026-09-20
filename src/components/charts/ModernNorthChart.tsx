import { RASHIS, PLANET_ABBR, rashiByName, planetsByRashi } from '@/lib/astro';
import { colorForHouse } from '@/theme';

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

export function ModernNorthChart({ chart }: { chart: any }) {
  const byRashi = planetsByRashi(chart);
  const lagnaRashi = rashiByName(chart?.ascendant?.rashiName);
  const lagnaIdx = lagnaRashi.index;

  const houseRashi: number[] = [];
  for (let h = 1; h <= 12; h++) houseRashi[h] = (lagnaIdx + h - 1) % 12;

  return (
    <div className="relative aspect-square w-full">
      <div className="pointer-events-none absolute -inset-4 rounded-[2.5rem] bg-gradient-to-br from-amber-300/25 via-transparent to-red-300/15 blur-3xl" />

      <div className="relative aspect-square w-full rounded-[2rem] border border-amber-200/70 bg-gradient-to-br from-amber-50 via-white to-amber-50/40 p-3 shadow-[0_20px_50px_-20px_rgba(180,83,9,0.25),inset_0_1px_0_rgba(255,255,255,0.9),inset_0_-1px_2px_rgba(180,83,9,0.06)]">
        <svg viewBox="0 0 200 200" className="h-full w-full overflow-visible">
          <defs>
            <filter id="houseShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur in="SourceAlpha" stdDeviation="0.6" />
              <feOffset dx="0" dy="0.6" result="offsetblur" />
              <feComponentTransfer>
                <feFuncA type="linear" slope="0.2" />
              </feComponentTransfer>
              <feMerge>
                <feMergeNode />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            <filter id="lagnaShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur in="SourceAlpha" stdDeviation="1.2" />
              <feOffset dx="0" dy="1" result="offsetblur" />
              <feComponentTransfer>
                <feFuncA type="linear" slope="0.3" />
              </feComponentTransfer>
              <feMerge>
                <feMergeNode />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* One gradient per house - light from top-left */}
            {Array.from({ length: 12 }, (_, idx) => {
              const hc = colorForHouse(idx + 1);
              return (
                <linearGradient
                  key={idx}
                  id={'houseGrad-' + (idx + 1)}
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="rgb(255 255 255)" />
                  <stop offset="45%" stopColor={hc.fill} />
                  <stop offset="100%" stopColor={hc.fill} stopOpacity="0.65" />
                </linearGradient>
              );
            })}

            <radialGradient id="panelGlow" cx="50%" cy="0%" r="60%">
              <stop offset="0%" stopColor="rgb(254 243 199 / 0.4)" />
              <stop offset="100%" stopColor="rgb(254 243 199 / 0)" />
            </radialGradient>
          </defs>

          <rect x="0" y="0" width="200" height="200" fill="url(#panelGlow)" />

          {POLYGONS.map(([points, cx, cy], i) => {
            const houseNo = i + 1;
            const rashiIdx = houseRashi[houseNo];
            const rashi = RASHIS[rashiIdx];
            const occupants = byRashi[rashiIdx] ?? [];
            const isLagna = houseNo === 1;
            const hc = colorForHouse(houseNo);

            return (
              <g key={houseNo} filter={isLagna ? 'url(#lagnaShadow)' : 'url(#houseShadow)'}>
                <polygon
                  points={points}
                  fill={'url(#houseGrad-' + houseNo + ')'}
                  stroke={hc.stroke}
                  strokeOpacity={isLagna ? 1 : 0.55}
                  strokeWidth={isLagna ? 0.9 : 0.45}
                  strokeLinejoin="round"
                />

                {/* Top highlight line - subtle ridge of light */}
                <polygon
                  points={points}
                  fill="none"
                  stroke="rgb(255 255 255 / 0.55)"
                  strokeWidth="0.3"
                  transform="translate(0, 0.4)"
                />

                {/* House number */}
                <text
                  x={cx - 18}
                  y={cy - 18}
                  fontSize="4.5"
                  fill={hc.svgText}
                  fontFamily="monospace"
                  fontWeight={700}
                >
                  {houseNo}
                </text>

                {/* ASC badge */}
                {isLagna && (
                  <text
                    x={cx + 8}
                    y={cy - 6}
                    fontSize="5"
                    fill={hc.svgText}
                    fontWeight={800}
                  >
                    ASC
                  </text>
                )}

                {/* Rashi symbol */}
                <text
                  x={cx}
                  y={cy - 6}
                  fontSize="10"
                  textAnchor="middle"
                  fill={hc.svgText}
                >
                  {rashi.symbol}
                </text>

                {/* Planet abbreviations */}
                {occupants.map((name, idx) => {
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
                      fill={hc.svgText}
                    >
                      {PLANET_ABBR[name] ?? name.slice(0, 2)}
                    </text>
                  );
                })}
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}