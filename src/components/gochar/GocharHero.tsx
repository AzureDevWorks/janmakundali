import { rashiByName } from '@/lib/astro';
import { cn } from '@/lib/utils';

interface Props {
  gochar: any;
}

function verdictTone(verdict: string): { bg: string; ring: string; text: string; label: string } {
  const v = (verdict ?? '').toLowerCase();
  if (v.includes('favorable') || v.includes('excellent'))
    return { bg: 'from-emerald-100 via-emerald-50 to-transparent', ring: 'border-emerald-300', text: 'text-emerald-900', label: 'Favorable' };
  if (v.includes('caution') || v.includes('mixed'))
    return { bg: 'from-amber-100 via-amber-50 to-transparent', ring: 'border-amber-300', text: 'text-amber-900', label: 'Caution' };
  if (v.includes('challenging') || v.includes('unfavorable'))
    return { bg: 'from-orange-100 via-orange-50 to-transparent', ring: 'border-orange-300', text: 'text-orange-900', label: 'Challenging' };
  if (v.includes('severe') || v.includes('difficult'))
    return { bg: 'from-red-100 via-red-50 to-transparent', ring: 'border-red-300', text: 'text-red-900', label: 'Difficult' };
  return { bg: 'from-amber-100 via-amber-50 to-transparent', ring: 'border-amber-300', text: 'text-amber-900', label: verdict ?? 'Neutral' };
}

export function GocharHero({ gochar }: Props) {
  if (!gochar) return null;

  const moonRashi = rashiByName(gochar.natalMoonRashiName);
  const lagnaRashi = rashiByName(gochar.natalLagnaRashiName);
  const pct = gochar.overallFavorablePercentage ?? 0;
  const tone = verdictTone(gochar.overallVerdict);

  return (
    <section
      className={cn(
        'relative overflow-hidden rounded-2xl border-2 bg-gradient-to-br p-6 shadow-sm',
        tone.bg,
        tone.ring,
      )}
    >
      <div className="grid gap-6 md:grid-cols-[1fr_auto]">
        {/* Left: verdict */}
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-amber-800">
            Live Transit Analysis
          </p>
          <h2 className="mt-2 flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <span className={cn('font-serif text-4xl font-bold tracking-tight', tone.text)}>
              {gochar.overallVerdict}
            </span>
            <span className={cn('text-2xl font-bold tabular-nums', tone.text)}>
              {pct}%
            </span>
          </h2>
          <p className="mt-1 text-xs text-amber-900/70">
            Overall transit strength relative to your natal chart
          </p>

          {/* Reference chips */}
          <div className="mt-4 flex flex-wrap gap-2 text-xs">
            <RefChip
              label="Janma Rashi"
              symbol={moonRashi.symbol}
              name={moonRashi.name}
            />
            <RefChip
              label="Natal Lagna"
              symbol={lagnaRashi.symbol}
              name={lagnaRashi.name}
            />
            <span className="rounded-full border border-amber-300 bg-white/60 px-3 py-1 text-[10px] font-medium text-amber-900">
              As of {new Date(gochar.transitDate).toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* Right: gauge */}
        <div className="flex items-center justify-center">
          <Gauge pct={pct} tone={tone.text} />
        </div>
      </div>
    </section>
  );
}

function RefChip({ label, symbol, name }: { label: string; symbol: string; name: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-300 bg-white/70 px-3 py-1">
      <span className="text-[9px] uppercase tracking-wider text-muted-foreground">{label}</span>
      <span className="text-sm leading-none">{symbol}</span>
      <span className="text-[11px] font-semibold text-amber-950">{name}</span>
    </span>
  );
}

function Gauge({ pct, tone }: { pct: number; tone: string }) {
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const dash = (pct / 100) * circumference;

  return (
    <div className="relative h-32 w-32">
      <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
        <circle
          cx="60" cy="60" r={radius}
          fill="none" stroke="rgb(251 191 36 / 0.15)" strokeWidth="8"
        />
        <circle
          cx="60" cy="60" r={radius}
          fill="none" stroke="currentColor" strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - dash}
          className={tone}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={cn('font-serif text-3xl font-bold tabular-nums', tone)}>{pct}</span>
        <span className="text-[9px] uppercase tracking-widest text-muted-foreground">Percent</span>
      </div>
    </div>
  );
}