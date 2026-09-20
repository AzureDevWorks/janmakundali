import { PLANET_GLYPH, planetColor } from '@/lib/astro';
import { cn } from '@/lib/utils';

function timeOf(v: unknown): string {
  if (!v) return '--';
  try {
    const d = v instanceof Date ? v : new Date(v as string);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } catch {
    return '--';
  }
}

interface HoraSlot {
  lord?: string;
  start?: unknown;
  end?: unknown;
}

export function HoraCard({ p }: { p: any }) {
  if (!p) return null;

  const currentLord = p.currentHora?.lord;
  const slots: HoraSlot[] = Array.isArray(p.hora)
    ? p.hora
    : Array.isArray(p.horaSlots)
      ? p.horaSlots
      : [];

  if (!currentLord && slots.length === 0) return null;

  const now = Date.now();

  return (
    <section className="overflow-hidden rounded-2xl border border-amber-200 bg-card shadow-sm">
      <header className="flex items-baseline justify-between gap-3 border-b border-amber-200 bg-gradient-to-r from-amber-50 to-transparent px-5 py-3">
        <div className="flex items-baseline gap-2">
          <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-amber-800">
            Hora
          </span>
          <span className="font-serif text-[11px] text-amber-700/70" lang="sa">
            होरा
          </span>
        </div>
        {currentLord && (
          <span className="flex items-center gap-1.5 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-900 ring-1 ring-inset ring-amber-200">
            Current:
            <span className={cn('text-base leading-none', planetColor(currentLord).text)}>
              {PLANET_GLYPH[currentLord] ?? '●'}
            </span>
            {currentLord}
          </span>
        )}
      </header>

      {slots.length === 0 ? (
        <p className="px-5 py-4 text-xs italic text-muted-foreground">
          Hora slot timings not available.
        </p>
      ) : (
        <ul className="divide-y divide-amber-100 max-h-[320px] overflow-y-auto">
          {slots.map((h, i) => {
            const lord = h.lord ?? '--';
            const color = planetColor(lord);
            const start = h.start ? new Date(h.start as any).getTime() : 0;
            const end   = h.end   ? new Date(h.end as any).getTime()   : 0;
            const isActive = now >= start && now < end;

            return (
              <li
                key={i}
                className={cn(
                  'flex items-center gap-3 px-5 py-2 text-xs transition-colors',
                  isActive ? 'bg-amber-50' : 'hover:bg-amber-50/40',
                )}
              >
                <span className={cn('w-6 text-center text-lg leading-none', color.text)}>
                  {PLANET_GLYPH[lord] ?? '●'}
                </span>
                <span className="flex-1 font-serif text-sm font-semibold text-amber-950">
                  {lord}
                </span>
                {isActive && (
                  <span className="rounded-full bg-amber-500 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wider text-white">
                    Now
                  </span>
                )}
                <span className="font-mono text-[10px] text-muted-foreground tabular-nums">
                  {timeOf(h.start)} - {timeOf(h.end)}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}