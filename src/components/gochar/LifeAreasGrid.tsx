import { cn } from '@/lib/utils';

const ICONS: Record<string, string> = {
  career:        '\uD83D\uDCBC',       /* briefcase */
  wealth:        '\uD83D\uDCB0',       /* money bag */
  relationships: '\uD83D\uDC9E',       /* sparkling heart */
  health:        '\uD83E\uDE7A',       /* stethoscope */
  marriage:      '\uD83D\uDC8D',       /* ring */
  family:        '\uD83C\uDFE0',       /* house */
  education:     '\uD83D\uDCDA',       /* books */
  spiritual:     '\uD83D\uDD49',       /* om */
};

const LABELS: Record<string, string> = {
  career: 'Career',
  wealth: 'Wealth',
  relationships: 'Relationships',
  health: 'Health',
  marriage: 'Marriage',
  family: 'Family',
  education: 'Education',
  spiritual: 'Spiritual',
};

interface Area {
  rating: string;
  summary: string;
}

function ratingTone(rating: string): { chip: string; bar: string; border: string } {
  const r = (rating ?? '').toLowerCase();
  if (r.includes('favorable') || r.includes('good') || r.includes('excellent'))
    return {
      chip: 'bg-emerald-100 text-emerald-800 ring-emerald-200',
      bar: 'bg-emerald-500',
      border: 'border-emerald-200',
    };
  if (r.includes('mixed') || r.includes('average') || r.includes('moderate'))
    return {
      chip: 'bg-amber-100 text-amber-800 ring-amber-200',
      bar: 'bg-amber-500',
      border: 'border-amber-200',
    };
  if (r.includes('challenging') || r.includes('caution'))
    return {
      chip: 'bg-orange-100 text-orange-800 ring-orange-200',
      bar: 'bg-orange-500',
      border: 'border-orange-200',
    };
  if (r.includes('difficult') || r.includes('unfavorable') || r.includes('severe'))
    return {
      chip: 'bg-red-100 text-red-800 ring-red-200',
      bar: 'bg-red-500',
      border: 'border-red-200',
    };
  return {
    chip: 'bg-muted text-muted-foreground ring-border',
    bar: 'bg-muted-foreground',
    border: 'border-border',
  };
}

export function LifeAreasGrid({ areas }: { areas: Record<string, Area | undefined> }) {
  if (!areas) return null;

  const entries = Object.entries(areas ?? {}).filter((e): e is [string, Area] => !!(e[1] && typeof e[1] === 'object'));

  return (
    <section>
      <h3 className="mb-3 flex items-center gap-2 font-serif text-lg font-bold tracking-tight text-amber-950">
        <span className="inline-block h-2 w-2 rotate-45 bg-gradient-to-br from-amber-400 to-orange-600" />
        Life Areas
      </h3>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {entries.map(([key, area]) => {
          const tone = ratingTone(area.rating);
          const icon = ICONS[key] ?? '\u2728';
          const label = LABELS[key] ?? key;

          return (
            <div
              key={key}
              className={cn(
                'overflow-hidden rounded-xl border bg-card p-4 shadow-sm transition-shadow hover:shadow-md',
                tone.border,
              )}
            >
              <div className="flex items-start justify-between">
                <span className="text-2xl leading-none" aria-hidden="true">{icon}</span>
                <span className={cn(
                  'rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide ring-1 ring-inset',
                  tone.chip,
                )}>
                  {area.rating}
                </span>
              </div>

              <p className="mt-2 font-serif text-base font-bold text-amber-950">{label}</p>

              {/* Visual strength bar */}
              <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className={cn('h-full rounded-full', tone.bar)}
                  style={{ width: (key === 'career' || key === 'wealth') && area.rating === 'Challenging' ? '35%'
                    : area.rating === 'Mixed' ? '55%'
                    : area.rating === 'Favorable' ? '85%'
                    : '50%' }}
                />
              </div>

              <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">
                {area.summary}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}