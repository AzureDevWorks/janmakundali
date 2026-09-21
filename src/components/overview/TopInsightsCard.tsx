import { PLANET_GLYPH, planetColor } from '@/lib/astro';
import { cn } from '@/lib/utils';

interface Insight {
  kind: 'caution' | 'positive' | 'neutral';
  icon: string;
  title: string;
  detail: string;
}

function buildInsights(kundli: any): Insight[] {
  const out: Insight[] = [];

  // 1. Sade Sati / Dhaiya
  const moonLon = kundli?.planets?.Moon?.longitude ?? 0;
  const saturnLon = kundli?.planets?.Saturn?.longitude ?? 0;
  const moonSign = Math.floor((((moonLon % 360) + 360) % 360) / 30);
  const saturnSign = Math.floor((((saturnLon % 360) + 360) % 360) / 30);
  const rel = ((saturnSign - moonSign + 12) % 12) + 1;

  if (rel === 12 || rel === 1 || rel === 2) {
    out.push({
      kind: 'caution',
      icon: '\u26A0\uFE0F',
      title: 'Sade Sati Active',
      detail: 'Saturn is transiting your natal Moon sign\u2019s 12th, 1st, or 2nd house.',
    });
  } else if (rel === 8) {
    out.push({
      kind: 'caution',
      icon: '\u26A0\uFE0F',
      title: 'Ashtama Shani',
      detail: 'Saturn in the 8th from Moon. A period of transformation and testing.',
    });
  } else if (rel === 4) {
    out.push({
      kind: 'caution',
      icon: '\u26A0\uFE0F',
      title: 'Kantaka Shani',
      detail: 'Saturn in the 4th from Moon. Domestic and career recalibration.',
    });
  }

  // 2. Yogas (prioritized by type)
  const order: Record<string, number> = {
    raja: 1, dhana: 2, special: 3, cancellation: 4,
    solar: 5, lunar: 6,
  };
  const yogas = (kundli?.yogas ?? [])
    .slice()
    .sort((a: any, b: any) => (order[a.type] ?? 99) - (order[b.type] ?? 99));

  for (const y of yogas.slice(0, 2)) {
    const isCancellation = y.type === 'cancellation';
    out.push({
      kind: isCancellation ? 'positive' : 'positive',
      icon: isCancellation ? '\u267B\uFE0F' : '\uD83C\uDFC6',
      title: y.name,
      detail: y.reasons?.[0] ?? y.type,
    });
  }

  // 3. Strongest planet
  const top = kundli?.shadbala?.ranked?.[0];
  if (top) {
    const c = planetColor(top.planet);
    out.push({
      kind: 'neutral',
      icon: PLANET_GLYPH[top.planet] ?? '\u25CF',
      title: `Strongest Planet: ${top.planet}`,
      detail: `Shadbala total ${top.total.toFixed(1)} virupas \u2014 dominant influence in the chart.`,
    });
  }

  return out.slice(0, 5);
}

export function TopInsightsCard({ kundli }: { kundli: any }) {
  const insights = buildInsights(kundli);
  if (insights.length === 0) return null;

  return (
    <section className="overflow-hidden rounded-2xl border border-amber-200 bg-card shadow-sm">
      <header className="flex items-baseline justify-between gap-3 border-b border-amber-200 bg-gradient-to-r from-amber-50 to-transparent px-5 py-2.5">
        <div className="flex items-baseline gap-2">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-amber-800">
            Top Insights
          </p>
          <span className="font-serif text-[10px] text-amber-700/70" lang="sa">
            {'\u0935\u093F\u0936\u0947\u0937'}
          </span>
        </div>
        <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[9px] font-bold text-amber-800">
          {insights.length}
        </span>
      </header>

      <ul className="divide-y divide-amber-100">
        {insights.map((ins, i) => (
          <li key={i} className="flex items-start gap-3 px-5 py-3">
            <span
              className={cn(
                'flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-base',
                ins.kind === 'caution'
                  ? 'bg-red-50 text-red-700'
                  : ins.kind === 'positive'
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'bg-amber-50 text-amber-800',
              )}
              aria-hidden="true"
            >
              {ins.icon}
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-serif text-sm font-bold leading-tight text-amber-950">
                {ins.title}
              </p>
              <p className="mt-0.5 text-[11px] leading-relaxed text-muted-foreground">
                {ins.detail}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}