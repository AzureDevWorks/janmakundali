import { Card } from '@/components/ui/Card';
import { cn } from '@/lib/utils';
import {
  CLASSICAL_PLANETS, PLANET_GLYPH, PLANET_ABBR, planetColor,
} from '@/lib/astro';

export function DrishtiCard({ kundli }: { kundli: any }) {
  const d = kundli?.drishti;
  if (!d) return null;

  const mutual = d.mutualAspects ?? [];
  const pa = d.planetAspects ?? {};

  return (
    <Card
      title="Drishti"
      subtitle="Graha aspects / Parashari rules"
      right={
        <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-900 ring-1 ring-inset ring-amber-200">
          {mutual.length} mutual
        </span>
      }
      bodyClass="p-0"
    >
      <ul className="divide-y divide-amber-100">
        {CLASSICAL_PLANETS.map((p) => {
          const a = pa[p];
          if (!a) return null;

          const color = planetColor(p);
          const glyph = PLANET_GLYPH[p] ?? '\u25CF';

          const houses: number[] = (a.aspectedHouses ?? []).map((h: any) =>
            typeof h === 'number' ? h : h.house,
          );
          const planets: string[] = (a.aspectedPlanets ?? [])
            .map((x: any) => x.planet)
            .filter((n: string) => CLASSICAL_PLANETS.includes(n));

          return (
            <li key={p} className="flex items-start gap-3 px-4 py-3">
              <span className={cn('w-8 shrink-0 pt-0.5 text-center text-xl leading-none', color.text)}>
                {glyph}
              </span>

              <div className="flex w-36 shrink-0 flex-col">
                <span className="font-serif text-sm font-semibold text-amber-950">{p}</span>
                <div className="mt-1 flex flex-wrap gap-1">
                  {houses.length === 0 ? (
                    <span className="text-[10px] italic text-muted-foreground/60">{'\u2014'}</span>
                  ) : (
                    houses.map((hn) => (
                      <span
                        key={hn}
                        className="rounded bg-amber-100 px-1.5 py-0.5 font-mono text-[10px] font-bold text-amber-900 ring-1 ring-inset ring-amber-200"
                      >
                        H{hn}
                      </span>
                    ))
                  )}
                </div>
              </div>

              <div className="flex flex-1 flex-wrap items-center gap-1.5">
                {planets.length === 0 ? (
                  <span className="text-[10px] italic text-muted-foreground/60">no planets</span>
                ) : (
                  planets.map((name) => {
                    const c = planetColor(name);
                    const abbr = PLANET_ABBR[name] ?? name.slice(0, 2);
                    return (
                      <span
                        key={name}
                        title={name}
                        className={cn(
                          'inline-flex items-center rounded border px-1.5 py-0.5 text-[10px] font-bold leading-none',
                          c.chip,
                        )}
                      >
                        {abbr}
                      </span>
                    );
                  })
                )}
              </div>
            </li>
          );
        })}
      </ul>

      {mutual.length > 0 && (
        <div className="border-t border-amber-200 bg-amber-50/30 px-4 py-3">
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-amber-800">
            Mutual aspects
          </p>
          <ul className="space-y-1">
            {mutual.map((m: any, i: number) => (
              <li key={i} className="flex flex-wrap items-center gap-1.5 text-[11px]">
                <span className="font-semibold">{m.planet1}</span>
                <span className="text-muted-foreground">{'\u2194'}</span>
                <span className="font-semibold">{m.planet2}</span>
                <span className="text-[10px] text-muted-foreground">
                  ({m.planet1AspectOnPlanet2})
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <footer className="border-t border-amber-100 bg-amber-50/20 px-4 py-2 text-[10px] text-muted-foreground">
        All grahas aspect the 7th house fully. Mars adds 4th and 8th; Jupiter adds 5th and 9th;
        Saturn adds 3rd and 10th; Rahu/Ketu aspect 5th, 7th, and 9th (KP extension).
      </footer>
    </Card>
  );
}