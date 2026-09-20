import { rashiByName, PLANET_GLYPH, PLANET_ABBR, planetColor } from '@/lib/astro';
import { cn } from '@/lib/utils';

interface Props {
  chart: any;
  housesByPlanet: Record<string, number>;
}

export function PlanetLegendPanel({ chart, housesByPlanet }: Props) {
  const lagnaRashi = rashiByName(chart?.ascendant?.rashiName);
  const planets = chart?.planets ?? {};

  return (
    <div className="space-y-4">
      {/* Lagna banner */}
      <div className="rounded-2xl border-2 border-red-200 bg-gradient-to-br from-red-50 to-red-100/50 p-5 shadow-sm">
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
      <div className="overflow-hidden rounded-2xl border bg-card shadow-sm">
        <div className="border-b bg-muted/30 px-4 py-3">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Grahas · {Object.keys(planets).length} planets
          </p>
        </div>
        <ul className="divide-y">
          {Object.entries(planets).map(([name, p]: [string, any]) => {
            const color = planetColor(name);
            const glyph = PLANET_GLYPH[name] ?? '●';
            const house = housesByPlanet[name];
            const rashi = rashiByName(p.rashiName);

            return (
              <li key={name} className="flex items-center gap-3 px-4 py-2.5 hover:bg-muted/30">
                <span className={cn('w-6 text-center text-xl leading-none', color.text)}>
                  {glyph}
                </span>
                <span className={cn('w-8 shrink-0 text-center text-[10px] font-bold', color.text)}>
                  {PLANET_ABBR[name]}
                </span>
                <div className="flex-1">
                  <p className="text-sm font-semibold">{name}</p>
                  <p className="text-[10px] text-muted-foreground">
                    {rashi.symbol} {rashi.name} · pada {p.pada}
                  </p>
                </div>
                {house && (
                  <span className="rounded bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-900 ring-1 ring-inset ring-amber-200">
                    H{house}
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}