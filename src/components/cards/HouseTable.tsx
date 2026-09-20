import { Card } from '@/components/ui/Card';
import { cn } from '@/lib/utils';
import {
  CLASSICAL_PLANETS, PLANET_ABBR, rashiByIndex, planetColor,
} from '@/lib/astro';

const DOT = '\u00B7';

const HOUSE_MEANINGS: Record<number, { en: string; sanskrit: string }> = {
  1:  { en: 'Self \u00B7 body \u00B7 identity',       sanskrit: 'Tanu' },
  2:  { en: 'Wealth \u00B7 family \u00B7 speech',     sanskrit: 'Dhana' },
  3:  { en: 'Siblings \u00B7 courage \u00B7 effort',  sanskrit: 'Sahaja' },
  4:  { en: 'Mother \u00B7 home \u00B7 emotions',     sanskrit: 'Sukha' },
  5:  { en: 'Children \u00B7 intellect \u00B7 merit', sanskrit: 'Putra' },
  6:  { en: 'Health \u00B7 enemies \u00B7 service',   sanskrit: 'Ripu' },
  7:  { en: 'Spouse \u00B7 partners \u00B7 public',   sanskrit: 'Kalatra' },
  8:  { en: 'Longevity \u00B7 occult \u00B7 depth',   sanskrit: 'Randhra' },
  9:  { en: 'Fortune \u00B7 dharma \u00B7 mentors',   sanskrit: 'Dharma' },
  10: { en: 'Career \u00B7 status \u00B7 action',     sanskrit: 'Karma' },
  11: { en: 'Gains \u00B7 friends \u00B7 hopes',      sanskrit: 'Labha' },
  12: { en: 'Loss \u00B7 liberation \u00B7 foreign',  sanskrit: 'Vyaya' },
};

export function HouseTable({ kundli }: { kundli: any }) {
  const houses = kundli?.houses ?? [];

  return (
    <Card
      title="Bhavas"
      subtitle="12 houses from the Lagna"
      right={<span className="text-[10px] text-muted-foreground">D1 whole-sign</span>}
      bodyClass="p-0"
    >
      <ul className="divide-y divide-amber-100">
        {houses.map((h: any) => {
          // Library returns rashi as 1-indexed; our table is 0-indexed.
          const rashiIdx = typeof h.rashi === 'number' ? h.rashi - 1 : 0;
          const rashi = rashiByIndex(rashiIdx);
          const meaning = HOUSE_MEANINGS[h.number];

          // Filter to classical 9 only - outer planets excluded.
          const rawPlanets: string[] = Array.isArray(h.planets) ? h.planets : [];
          const planets = rawPlanets.filter((n) => CLASSICAL_PLANETS.includes(n));

          const isLagna = h.number === 1;

          return (
            <li
              key={h.number}
              className={cn(
                'relative flex items-center gap-3 px-4 py-2.5 transition-colors',
                isLagna ? 'bg-gradient-to-r from-red-50 to-transparent' : 'hover:bg-amber-50/40',
              )}
            >
              {isLagna && <span className="absolute left-0 top-0 h-full w-1 bg-red-500" />}

              {/* House number badge */}
              <span
                className={cn(
                  'inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 font-mono text-sm font-bold',
                  isLagna
                    ? 'border-red-400 bg-red-100 text-red-900'
                    : 'border-amber-300 bg-amber-50 text-amber-900',
                )}
              >
                {h.number}
              </span>

              {/* Rashi + meaning */}
              <div className="flex min-w-0 flex-1 flex-col leading-tight">
                <div className="flex items-baseline gap-2">
                  <span className="text-lg leading-none">{rashi.symbol}</span>
                  <span className="font-serif text-sm font-semibold text-amber-950">
                    {rashi.name}
                  </span>
                  {isLagna && (
                    <span className="rounded-sm bg-red-600 px-1.5 py-0.5 text-[8px] font-extrabold uppercase tracking-wider text-white">
                      ASC
                    </span>
                  )}
                </div>
                <div className="mt-0.5 flex items-baseline gap-1.5 text-[10px] text-muted-foreground">
                  <span className="font-semibold uppercase tracking-wider text-amber-700/80">
                    {meaning?.sanskrit}
                  </span>
                  <span className="opacity-40">{DOT}</span>
                  <span className="truncate">{meaning?.en}</span>
                </div>
              </div>

              {/* Planet chips */}
              <div className="flex max-w-[42%] shrink-0 flex-wrap items-center justify-end gap-1">
                {planets.length === 0 ? (
                  <span className="text-[10px] italic text-muted-foreground/60">empty</span>
                ) : (
                  planets.map((name) => {
                    const color = planetColor(name);
                    const abbr = PLANET_ABBR[name] ?? name.slice(0, 2);
                    return (
                      <span
                        key={name}
                        title={name}
                        className={cn(
                          'inline-flex items-center rounded border px-1.5 py-0.5 text-[10px] font-bold leading-none',
                          color.chip,
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
      <footer className="border-t border-amber-100 bg-amber-50/30 px-4 py-2 text-[10px] text-muted-foreground">
        Houses are whole-sign from the Lagna. Only the 9 classical grahas are shown; outer
        planets are excluded per Parashari convention.
      </footer>
    </Card>
  );
}