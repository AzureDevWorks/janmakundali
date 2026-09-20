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

interface Slot {
  name?: string;
  lord?: string;
  quality?: string;
  start?: unknown;
  end?: unknown;
}

function qualityTone(q?: string): string {
  const s = (q ?? '').toLowerCase();
  if (s.includes('very good') || s.includes('amrit') || s.includes('shubh'))
    return 'bg-emerald-100 text-emerald-800 ring-emerald-200';
  if (s.includes('good') || s.includes('labh') || s.includes('char'))
    return 'bg-sky-100 text-sky-800 ring-sky-200';
  if (s.includes('bad') || s.includes('udveg') || s.includes('rog'))
    return 'bg-red-100 text-red-800 ring-red-200';
  return 'bg-stone-100 text-stone-700 ring-stone-200';
}

function SlotList({ slots, title }: { slots: Slot[]; title: string }) {
  if (!slots || slots.length === 0) return null;
  const now = Date.now();

  return (
    <div>
      <p className="border-b border-amber-100 bg-amber-50/30 px-5 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-amber-800">
        {title}
      </p>
      <ul className="divide-y divide-amber-100">
        {slots.map((s, i) => {
          const start = s.start ? new Date(s.start as any).getTime() : 0;
          const end   = s.end   ? new Date(s.end as any).getTime()   : 0;
          const isActive = now >= start && now < end;
          return (
            <li
              key={i}
              className={cn(
                'flex items-center gap-3 px-5 py-1.5 text-xs',
                isActive && 'bg-amber-50',
              )}
            >
              <span className={cn(
                'inline-flex min-w-[60px] justify-center rounded px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide ring-1 ring-inset',
                qualityTone(s.quality),
              )}>
                {s.quality ?? 'neutral'}
              </span>
              <span className="flex-1 font-medium text-amber-950">{s.name ?? '--'}</span>
              {isActive && (
                <span className="rounded-full bg-amber-500 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wider text-white">
                  Now
                </span>
              )}
              <span className="font-mono text-[10px] text-muted-foreground tabular-nums">
                {timeOf(s.start)} - {timeOf(s.end)}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function ChoghadiyaCard({ p }: { p: any }) {
  if (!p) return null;

  const day   = Array.isArray(p.choghadiya?.day)   ? p.choghadiya.day   : [];
  const night = Array.isArray(p.choghadiya?.night) ? p.choghadiya.night : [];

  if (day.length === 0 && night.length === 0) return null;

  return (
    <section className="overflow-hidden rounded-2xl border border-amber-200 bg-card shadow-sm">
      <header className="flex items-baseline gap-2 border-b border-amber-200 bg-gradient-to-r from-amber-50 to-transparent px-5 py-3">
        <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-amber-800">
          Choghadiya
        </span>
        <span className="font-serif text-[11px] text-amber-700/70" lang="sa">
          चौघड़िया
        </span>
      </header>

      {day.length > 0 && <SlotList slots={day} title="Day slots" />}
      {night.length > 0 && <SlotList slots={night} title="Night slots" />}
    </section>
  );
}