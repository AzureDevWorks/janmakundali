import { useState } from 'react';
import { SouthIndianChart } from './SouthIndianChart';
import { NorthIndianChart } from './NorthIndianChart';
import { PlanetLegend } from './PlanetLegend';
import { Card } from '@/components/ui/Card';
import { cn } from '@/lib/utils';
import { housesByPlanet } from '@/lib/astro';

const VARGA_KEYS = [
  'd1','d2','d3','d4','d5','d6','d7','d8','d9','d10','d11','d12',
  'd16','d20','d24','d27','d30','d40','d45','d60',
];

const VARGA_META: Record<string, { code: string; name: string; short: string }> = {
  d1:  { code: 'D1',  name: 'Rashi',        short: 'Body & overall life' },
  d2:  { code: 'D2',  name: 'Hora',         short: 'Wealth & resources' },
  d3:  { code: 'D3',  name: 'Drekkana',     short: 'Siblings & courage' },
  d4:  { code: 'D4',  name: 'Chaturthamsa', short: 'Property & fortune' },
  d5:  { code: 'D5',  name: 'Panchamsa',    short: 'Fame & authority' },
  d6:  { code: 'D6',  name: 'Shashthamsa',  short: 'Health & disease' },
  d7:  { code: 'D7',  name: 'Saptamsa',     short: 'Children & progeny' },
  d8:  { code: 'D8',  name: 'Ashtamsa',     short: 'Longevity & troubles' },
  d9:  { code: 'D9',  name: 'Navamsa',      short: 'Marriage & dharma' },
  d10: { code: 'D10', name: 'Dasamsa',      short: 'Career & status' },
  d11: { code: 'D11', name: 'Rudramsa',     short: 'Gains & income' },
  d12: { code: 'D12', name: 'Dwadasamsa',   short: 'Parents & lineage' },
  d16: { code: 'D16', name: 'Shodasamsa',   short: 'Vehicles & comforts' },
  d20: { code: 'D20', name: 'Vimsamsa',     short: 'Spiritual practice' },
  d24: { code: 'D24', name: 'Siddhamsa',    short: 'Learning & education' },
  d27: { code: 'D27', name: 'Bhamsa',       short: 'Strengths & stamina' },
  d30: { code: 'D30', name: 'Trimsamsa',    short: 'Misfortunes & adversity' },
  d40: { code: 'D40', name: 'Khavedamsa',   short: 'Maternal legacy' },
  d45: { code: 'D45', name: 'Akshavedamsa', short: 'Paternal legacy' },
  d60: { code: 'D60', name: 'Shashtiamsa',  short: 'Past-life karma' },
};

type Style = 'north' | 'south';

export function ChartPanel({ kundli }: { kundli: any }) {
  const [varga, setVarga] = useState('d1');
  const [style, setStyle] = useState<Style>('south');

  const chart = varga === 'd1'
    ? (kundli?.vargas?.d1 ?? kundli)
    : kundli?.vargas?.[varga];
  if (!chart) return null;

  const available = VARGA_KEYS.filter((k) => kundli?.vargas?.[k]);
  const meta = VARGA_META[varga] ?? { code: varga.toUpperCase(), name: varga, short: '' };

  // For D1, use root housesByPlanet; for others, derive from varga chart.
  const houses = varga === 'd1' && kundli?.houses
    ? housesByPlanet(kundli)
    : housesByPlanet(chart);

  return (
    <Card tone="amber" bodyClass="p-5">
      {/* Header */}
      <header className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-amber-700">
            Vargas · Divisional Charts
          </p>
          <h2 className="mt-1 flex items-baseline gap-2 text-2xl font-bold tracking-tight">
            <span className="font-mono text-amber-700">{meta.code}</span>
            <span className="text-amber-400">·</span>
            <span>{meta.name}</span>
          </h2>
          <p className="text-xs text-muted-foreground">{meta.short}</p>
        </div>
        <div className="inline-flex overflow-hidden rounded-lg border border-amber-200 bg-background shadow-sm">
          <button
            onClick={() => setStyle('north')}
            className={cn(
              'px-3.5 py-1.5 text-xs font-semibold transition-colors',
              style === 'north' ? 'bg-amber-500 text-white' : 'hover:bg-amber-50',
            )}
          >
            North
          </button>
          <button
            onClick={() => setStyle('south')}
            className={cn(
              'border-l border-amber-200 px-3.5 py-1.5 text-xs font-semibold transition-colors',
              style === 'south' ? 'bg-amber-500 text-white' : 'hover:bg-amber-50',
            )}
          >
            South
          </button>
        </div>
      </header>

      {/* Varga tabs */}
      <nav className="mb-5 flex flex-wrap gap-1.5">
        {available.map((k) => {
          const m = VARGA_META[k];
          const active = varga === k;
          return (
            <button
              key={k}
              onClick={() => setVarga(k)}
              title={m?.name + ' · ' + m?.short}
              className={cn(
                'flex flex-col items-center rounded-md border px-2.5 py-1 text-[10px] font-bold transition-all',
                active
                  ? 'border-amber-400 bg-amber-100 text-amber-900 shadow-sm'
                  : 'bg-muted/40 text-muted-foreground hover:bg-amber-50 hover:text-foreground',
              )}
            >
              <span className="font-mono">{m?.code ?? k.toUpperCase()}</span>
              <span className="text-[8px] font-medium opacity-70">{m?.name.slice(0, 8) ?? ''}</span>
            </button>
          );
        })}
      </nav>

      {/* Chart + Legend split */}
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        {/* Left: Chart */}
        <div key={varga + style} className="animate-fade-in flex items-start justify-center">
          {style === 'south' ? <SouthIndianChart chart={chart} /> : <NorthIndianChart chart={chart} />}
        </div>

        {/* Right: Legend */}
        <aside className="lg:sticky lg:top-32 lg:self-start">
          <PlanetLegend chart={chart} housesByPlanet={houses} />
        </aside>
      </div>
    </Card>
  );
}