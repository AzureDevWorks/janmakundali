import { useState } from 'react';
import { useKundli } from '@/features/kundli/useKundli';
import { ModernSouthChart } from './ModernSouthChart';
import { ModernNorthChart } from './ModernNorthChart';
import { PlanetLegendPanel } from './PlanetLegendPanel';
import { housesByPlanet } from '@/lib/astro';
import { cn } from '@/lib/utils';

const VARGA_KEYS = [
  'd1', 'd2', 'd3', 'd4', 'd5', 'd6', 'd7', 'd8', 'd9', 'd10',
  'd11', 'd12', 'd16', 'd20', 'd24', 'd27', 'd30', 'd40', 'd45', 'd60',
];

const VARGA_LABELS: Record<string, string> = {
  d1: 'Rashi', d2: 'Hora', d3: 'Drekkana', d4: 'Chaturthamsa',
  d5: 'Panchamsa', d6: 'Shashthamsa', d7: 'Saptamsa', d8: 'Ashtamsa',
  d9: 'Navamsa', d10: 'Dasamsa', d11: 'Rudramsa', d12: 'Dwadasamsa',
  d16: 'Shodasamsa', d20: 'Vimsamsa', d24: 'Siddhamsa', d27: 'Bhamsa',
  d30: 'Trimsamsa', d40: 'Khavedamsa', d45: 'Akshavedamsa', d60: 'Shashtiamsa',
};

export function ChartSection() {
  const { data: kundli } = useKundli();
  const [varga, setVarga] = useState('d1');
  const [style, setStyle] = useState<'north' | 'south'>('south');

  if (!kundli) return null;

  const chart = varga === 'd1' ? (kundli.vargas?.d1 ?? kundli) : kundli.vargas?.[varga];
  if (!chart) return null;

  const houses = housesByPlanet(chart);

  return (
    <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
      {/* Left: Chart */}
      <div className="space-y-4">
        {/* Varga tabs */}
        <div className="flex flex-wrap gap-1.5">
          {VARGA_KEYS.map((k) => (
            <button
              key={k}
              onClick={() => setVarga(k)}
              className={cn(
                'rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all',
                varga === k
                  ? 'border-amber-400 bg-amber-100 text-amber-900 shadow-sm'
                  : 'bg-muted/40 text-muted-foreground hover:bg-amber-50',
              )}
            >
              {k.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Chart style toggle */}
        <div className="flex justify-end gap-2">
          <button
            onClick={() => setStyle('north')}
            className={cn(
              'rounded-lg px-4 py-2 text-sm font-semibold transition-colors',
              style === 'north' ? 'bg-amber-500 text-white shadow-sm' : 'bg-muted/50 hover:bg-amber-50',
            )}
          >
            North
          </button>
          <button
            onClick={() => setStyle('south')}
            className={cn(
              'rounded-lg px-4 py-2 text-sm font-semibold transition-colors',
              style === 'south' ? 'bg-amber-500 text-white shadow-sm' : 'bg-muted/50 hover:bg-amber-50',
            )}
          >
            South
          </button>
        </div>

        {/* Chart rendering */}
        <div className="rounded-2xl border border-amber-200/60 bg-gradient-to-br from-amber-50/40 via-white to-amber-50/30 p-4 shadow-lg">
          {style === 'south' ? (
            <ModernSouthChart chart={chart} />
          ) : (
            <ModernNorthChart chart={chart} />
          )}
        </div>
      </div>

      {/* Right: Legend */}
      <aside className="lg:sticky lg:top-24 lg:self-start">
        <PlanetLegendPanel chart={chart} housesByPlanet={houses} />
      </aside>
    </section>
  );
}