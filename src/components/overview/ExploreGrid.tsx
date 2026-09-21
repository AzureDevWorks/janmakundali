import { cn } from '@/lib/utils';

interface Props {
  onNavigate?: (key: string) => void;
}

const TILES: {
  key: string;
  icon: string;
  title: string;
  sub: string;
  tone: string;
}[] = [
  {
    key: 'vargas',
    icon: '\u0950',
    title: 'Divisional Charts',
    sub: '20 vargas, D1 to D60',
    tone: 'from-amber-100 to-amber-50',
  },
  {
    key: 'dashas',
    icon: '\u23F3',
    title: 'Vimshottari Dasha',
    sub: '3-level cascade',
    tone: 'from-orange-100 to-orange-50',
  },
  {
    key: 'gochar',
    icon: '\u2604',
    title: 'Live Transits',
    sub: 'Gochar & Sade Sati',
    tone: 'from-red-100 to-red-50',
  },
  {
    key: 'report',
    icon: '\uD83D\uDCD6',
    title: 'Full Report',
    sub: 'Multi-system reading',
    tone: 'from-emerald-100 to-emerald-50',
  },
];

export function ExploreGrid({ onNavigate }: Props) {
  return (
    <section>
      <p className="mb-3 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-amber-800">
        <span className="inline-block h-2 w-2 rotate-45 bg-gradient-to-br from-amber-400 to-orange-600" />
        Explore More
      </p>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {TILES.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => onNavigate?.(t.key)}
            className={cn(
              'group flex flex-col items-start gap-2 rounded-2xl border border-amber-200 bg-gradient-to-br p-4 text-left shadow-sm transition-all',
              t.tone,
              'hover:-translate-y-0.5 hover:shadow-md',
            )}
          >
            <span
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/70 text-lg text-amber-800 shadow-sm"
              aria-hidden="true"
            >
              {t.icon}
            </span>
            <span className="font-serif text-sm font-bold leading-tight text-amber-950">
              {t.title}
            </span>
            <span className="text-[10px] text-muted-foreground">{t.sub}</span>
          </button>
        ))}
      </div>
    </section>
  );
}