function timeOf(v: unknown): string {
  if (!v) return '--';
  try {
    const d = v instanceof Date ? v : new Date(v as string);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } catch {
    return '--';
  }
}

interface Period {
  start?: unknown;
  end?: unknown;
}

function periodOf(v: any): Period | null {
  if (!v) return null;
  if (v.start || v.end) return v;
  return null;
}

const INAUSPICIOUS = [
  { key: 'rahuKalam',    name: 'Rahu Kalam',    hint: 'Avoid new ventures' },
  { key: 'gulikaKalam',  name: 'Gulika Kalam',  hint: 'Avoid important work' },
  { key: 'yamaganda',    name: 'Yamaganda',     hint: 'Avoid travel & deals' },
  { key: 'durMuhurta',   name: 'Dur Muhurta',   hint: 'Avoid beginnings' },
];

export function InauspiciousCard({ p }: { p: any }) {
  if (!p) return null;

  const rows = INAUSPICIOUS
    .map((a) => ({ ...a, period: periodOf(p[a.key]) }))
    .filter((x) => x.period);

  if (rows.length === 0) return null;

  const now = Date.now();

  return (
    <section className="overflow-hidden rounded-2xl border border-red-200 bg-card shadow-sm">
      <header className="flex items-baseline gap-2 border-b border-red-200 bg-gradient-to-r from-red-50 to-transparent px-5 py-3">
        <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-red-800">
          Inauspicious Periods
        </span>
      </header>

      <ul className="divide-y divide-red-100">
        {rows.map((row) => {
          const start = row.period?.start ? new Date(row.period.start as any).getTime() : 0;
          const end   = row.period?.end   ? new Date(row.period.end as any).getTime()   : 0;
          const isActive = now >= start && now < end;

          return (
            <li
              key={row.key}
              className={
                'flex items-center gap-3 px-5 py-2.5 text-xs transition-colors ' +
                (isActive ? 'bg-red-50' : 'hover:bg-red-50/40')
              }
            >
              <span className="h-8 w-0.5 shrink-0 rounded-full bg-red-400" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <p className="font-serif text-sm font-semibold text-red-950">{row.name}</p>
                  {isActive && (
                    <span className="rounded-full bg-red-600 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wider text-white">
                      Now
                    </span>
                  )}
                </div>
                <p className="text-[10px] text-muted-foreground">{row.hint}</p>
              </div>
              <span className="shrink-0 font-mono text-[11px] text-red-900 tabular-nums">
                {timeOf(row.period?.start)} - {timeOf(row.period?.end)}
              </span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}