import { CLASSICAL_PLANETS, RASHIS, PLANET_GLYPH, planetColor, rashiByName } from '@/lib/astro';
import { cn } from '@/lib/utils';

interface Props {
  chart: any;
  housesByPlanet: Record<string, number>;
}

export function PlanetLegend({ chart, housesByPlanet }: Props) {
  const lagnaRashi = rashiByName(chart?.ascendant?.rashiName);
  const lagnaIdx = lagnaRashi.index;

  const planets = chart?.planets ?? {};

  return (
    <div className="space-y-4">
      {/* Lagna banner */}
      <div className="overflow-hidden rounded-xl border-2 border-red-300 bg-gradient-to-br from-red-50 to-red-100/50 p-4 shadow-sm">
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-red-700">
          Lagna · Ascendant
        </p>
        <div className="mt-2 flex items-baseline gap-3">
          <span className="text-4xl leading-none">{lagnaRashi.symbol}</span>
          <div>
            <p className="text-xl font-bold leading-tight text-red-950">{lagnaRashi.name}</p>
            <p className="text-xs text-red-800/80">{lagnaRashi.english}</p>
          </div>
        </div>
      </div>

      {/* Planets list */}
      <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
        <div className="border-b bg-muted/30 px-3 py-2">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Grahas · {CLASSICAL_PLANETS.length} planets
          </p>
        </div>
        <ul className="divide-y">
          {CLASSICAL_PLANETS.map((name) => {
            const p = planets[name];
            if (!p) return null;
            const color = planetColor(name);
            const glyph = PLANET_GLYPH[name] ?? '●';
            const house = housesByPlanet[name];
            const rashiIdx = typeof p.rashi === 'number' ? p.rashi : rashiByName(p.rashiName).index;
            const rashi = RASHIS[((rashiIdx % 12) + 12) % 12];

            return (
              <li key={name} className="flex items-center gap-2 px-3 py-2 hover:bg-muted/30">
                {/* Glyph */}
                <span className={cn('w-6 text-center text-lg leading-none', color.text)}>
                  {glyph}
                </span>

                {/* Abbreviation chip */}
                <span
                  className={cn(
                    'inline-flex w-8 shrink-0 items-center justify-center rounded border px-1 py-0.5 text-[10px] font-bold leading-none',
                    color.chip,
                  )}
                >
                  {name.slice(0, 2)}
                </span>

                {/* Name + rashi */}
                <div className="flex flex-1 flex-col leading-tight">
                  <span className={cn('text-xs font-semibold', color.text)}>
                    {name}
                    {p.isRetrograde && <span className="ml-1 text-[9px] opacity-70">R</span>}
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    {rashi.symbol} {rashi.name} · pada {p.pada ?? '—'}
                  </span>
                </div>

                {/* House badge */}
                {house != null && (
                  <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold tabular-nums text-amber-900 ring-1 ring-inset ring-amber-200">
                    H{house}
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      </div>

      {/* Rashis legend */}
      <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
        <div className="border-b bg-muted/30 px-3 py-2">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Rashis · {RASHIS.length} signs
          </p>
        </div>
        <ul className="grid grid-cols-2 gap-x-1 gap-y-0.5 p-2 text-[11px]">
          {RASHIS.map((r) => {
            const isLagna = r.index === lagnaIdx;
            return (
              <li
                key={r.index}
                className={cn(
                  'flex items-center gap-1.5 rounded px-1.5 py-0.5',
                  isLagna && 'bg-red-100 ring-1 ring-inset ring-red-300',
                )}
              >
                <span className="w-3 text-center text-sm leading-none">{r.symbol}</span>
                <span className={cn('truncate font-medium', isLagna && 'text-red-900')}>
                  {r.name}
                </span>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Markers */}
      <div className="rounded-xl border bg-card p-3 text-[11px] shadow-sm">
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          Markers
        </p>
        <ul className="space-y-1">
          <li className="flex items-center gap-2">
            <span className="inline-flex w-8 items-center justify-center rounded bg-red-600 px-1 text-[8px] font-extrabold uppercase text-white">
              ASC
            </span>
            <span className="text-muted-foreground">Ascendant · house 1</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="w-8 text-center font-mono text-xs font-bold text-amber-800">1</span>
            <span className="text-muted-foreground">House number</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="w-8 text-center text-[10px] font-bold opacity-70">R</span>
            <span className="text-muted-foreground">Retrograde</span>
          </li>
        </ul>
      </div>
    </div>
  );
}