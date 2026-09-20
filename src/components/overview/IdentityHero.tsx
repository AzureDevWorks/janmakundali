import { rashiByName, fmtDMS } from '@/lib/astro';
import { SANSKRIT } from '@/lib/text';
import { cn } from '@/lib/utils';

interface Props {
  kundli: any;
}

export function IdentityHero({ kundli }: Props) {
  const asc  = kundli?.ascendant;
  const sun  = kundli?.planets?.Sun;
  const moon = kundli?.planets?.Moon;
  if (!asc || !sun || !moon) return null;

  return (
    <section className="overflow-hidden rounded-3xl border border-amber-200 bg-card shadow-sm">
      <div className="grid md:grid-cols-3">
        <Pillar
          tag="Lagna"
          tagSanskrit={SANSKRIT.lagna}
          accent="amber"
          rashiName={asc.rashiName}
          degree={asc.degree} minute={asc.minute} second={asc.second}
          nakshatra={asc.nakshatra}
          pada={asc.pada}
          lord={asc.rashiLord}
          isFirst
        />
        <Pillar
          tag="Surya"
          tagSanskrit={SANSKRIT.surya}
          accent="orange"
          rashiName={sun.rashiName}
          degree={sun.degree} minute={sun.minute} second={sun.second}
          nakshatra={sun.nakshatra}
          pada={sun.pada}
          lord={sun.rashiLord}
          dignity={sun.dignity}
        />
        <Pillar
          tag="Chandra"
          tagSanskrit={SANSKRIT.chandra}
          accent="slate"
          rashiName={moon.rashiName}
          degree={moon.degree} minute={moon.minute} second={moon.second}
          nakshatra={moon.nakshatra}
          pada={moon.pada}
          lord={moon.rashiLord}
          dignity={moon.dignity}
        />
      </div>
    </section>
  );
}

const ACCENT = {
  amber:  { tag: 'text-amber-800',  rashi: 'text-amber-950',  bar: 'from-amber-300 to-amber-500',   bg: 'hover:bg-amber-50/40' },
  orange: { tag: 'text-orange-800', rashi: 'text-orange-950', bar: 'from-orange-300 to-orange-500', bg: 'hover:bg-orange-50/40' },
  slate:  { tag: 'text-slate-700',  rashi: 'text-slate-900',  bar: 'from-slate-300 to-slate-500',   bg: 'hover:bg-slate-50/60' },
} as const;

function Pillar({
  tag, tagSanskrit, accent, rashiName,
  degree, minute, second, nakshatra, pada, lord, dignity, isFirst,
}: {
  tag: string; tagSanskrit: string; accent: keyof typeof ACCENT; rashiName: string;
  degree?: number; minute?: number; second?: number;
  nakshatra?: string; pada?: number; lord?: string; dignity?: string; isFirst?: boolean;
}) {
  const meta = ACCENT[accent];
  const rashi = rashiByName(rashiName);

  return (
    <div
      className={cn(
        'relative flex flex-col gap-3 p-6 transition-colors',
        meta.bg,
        !isFirst && 'md:border-l md:border-amber-100',
      )}
    >
      <span
        className={cn('absolute left-0 top-0 h-full w-1 bg-gradient-to-b', meta.bar)}
        aria-hidden="true"
      />

      <div className="flex items-baseline justify-between">
        <span className={cn('text-[10px] font-semibold uppercase tracking-[0.22em]', meta.tag)}>
          {tag}
        </span>
        <span className="font-serif text-[10px] text-muted-foreground" lang="sa">
          {tagSanskrit}
        </span>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-5xl leading-none" aria-hidden="true">{rashi.symbol}</span>
        <div>
          <p className={cn('font-serif text-2xl font-bold leading-tight tracking-tight', meta.rashi)}>
            {rashi.name}
          </p>
          <p className="text-[11px] text-muted-foreground">{rashi.english}</p>
        </div>
      </div>

      <dl className="mt-1 space-y-1.5 text-xs">
        <Row label="Degree" value={fmtDMS(degree, minute, second)} mono />
        <Row label="Nakshatra" value={nakshatra ? (nakshatra + ' p' + (pada ?? '?')) : '-'} />
        <Row label="Rashi lord" value={lord ?? '-'} />
      </dl>

      {dignity && dignity !== 'neutral' && (
        <span
          className={cn(
            'mt-1 inline-flex w-fit items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide ring-1 ring-inset',
            dignity === 'exalted' || dignity === 'moolatrikona' || dignity === 'own'
              ? 'bg-emerald-100 text-emerald-800 ring-emerald-200'
              : dignity === 'debilitated'
                ? 'bg-red-100 text-red-800 ring-red-200'
                : 'bg-amber-100 text-amber-800 ring-amber-200',
          )}
        >
          {dignity}
        </span>
      )}
    </div>
  );
}

function Row({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <dt className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </dt>
      <dd className={cn('text-right font-medium text-foreground', mono && 'font-mono text-[11px]')}>
        {value}
      </dd>
    </div>
  );
}