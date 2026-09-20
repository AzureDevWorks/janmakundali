import { Card } from '@/components/ui/Card';
import { cn } from '@/lib/utils';
import {
  CLASSICAL_PLANETS, PLANET_GLYPH, DIGNITY_TONE,
  rashiByName, rashiByIndex, housesByPlanet, fmtDMS, planetColor,
} from '@/lib/astro';

const DOT = '\u00B7';

export function PlanetTable({ kundli }: { kundli: any }) {
  const planets = kundli?.planets ?? {};
  const houseOf = housesByPlanet(kundli);

  return (
    <Card title="Grahas" subtitle="Sidereal / Lahiri ayanamsa" bodyClass="p-0">
      <ul className="divide-y divide-amber-100">
        {CLASSICAL_PLANETS.map((name) => {
          const p = planets[name];
          if (!p) return null;

          const rashi = p.rashiName
            ? rashiByName(p.rashiName)
            : rashiByIndex((p.rashi ?? 1) - 1);

          const color = planetColor(name);
          const house = houseOf[name];
          const dignity = p.dignity && p.dignity !== 'neutral' ? p.dignity : null;

          return (
            <li
              key={name}
              className="relative flex items-center gap-3 px-4 py-3 transition-colors hover:bg-amber-50/50"
            >
              <span className={cn('absolute left-0 top-0 h-full w-1', color.dot)} />

              <span className={cn('w-9 shrink-0 text-center text-2xl leading-none', color.text)}>
                {PLANET_GLYPH[name] ?? '\u25CF'}
              </span>

              <div className="flex min-w-0 flex-1 flex-col">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="font-serif text-base font-semibold text-amber-950">{name}</span>
                  {p.isRetrograde && <Badge tone="red">Retro</Badge>}
                  {p.isCombust && <Badge tone="orange">Combust</Badge>}
                  {p.isVargottama && <Badge tone="violet">Vargottama</Badge>}
                  {dignity && (
                    <span className={cn('rounded px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide ring-1 ring-inset', DIGNITY_TONE[dignity])}>
                      {dignity}
                    </span>
                  )}
                </div>
                <div className="mt-0.5 flex items-center gap-1.5 text-[11px] text-muted-foreground">
                  <span>{p.nakshatra}</span>
                  <span className="opacity-40">{DOT}</span>
                  <span>pada {p.pada}</span>
                  {p.nakshatraLord && (
                    <>
                      <span className="opacity-40">{DOT}</span>
                      <span>lord {p.nakshatraLord}</span>
                    </>
                  )}
                </div>
              </div>

              <div className="flex shrink-0 flex-col items-end text-right">
                <span className="flex items-center gap-1.5 text-sm font-medium">
                  <span className="text-lg leading-none">{rashi.symbol}</span>
                  <span>{rashi.name}</span>
                </span>
                <span className="font-mono text-[11px] text-muted-foreground tabular-nums">
                  {fmtDMS(p.degree, p.minute, p.second)}
                </span>
              </div>

              <span className="inline-flex h-9 min-w-9 shrink-0 items-center justify-center rounded-lg border border-amber-300 bg-gradient-to-br from-amber-100 to-amber-50 px-2 font-mono text-sm font-bold text-amber-900 shadow-sm">
                {house ?? '?'}
              </span>
            </li>
          );
        })}
      </ul>
      <footer className="border-t border-amber-100 bg-amber-50/30 px-4 py-2 text-[10px] text-muted-foreground">
        Only the 9 classical grahas are shown. Uranus, Neptune, and Pluto are excluded from
        Jyotish charts.
      </footer>
    </Card>
  );
}

function Badge({ tone, children }: { tone: 'red' | 'orange' | 'violet'; children: React.ReactNode }) {
  const toneClass = {
    red:    'bg-red-100 text-red-800 ring-red-200',
    orange: 'bg-orange-100 text-orange-800 ring-orange-200',
    violet: 'bg-violet-100 text-violet-800 ring-violet-200',
  }[tone];
  return (
    <span className={cn('rounded px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide ring-1 ring-inset', toneClass)}>
      {children}
    </span>
  );
}