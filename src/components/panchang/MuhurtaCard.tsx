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

const AUSPICIOUS = [
  { key: 'brahmaMuhurta',   name: 'Brahma Muhurta',   hint: 'Ideal for meditation & study' },
  { key: 'abhijitMuhurta',  name: 'Abhijit Muhurta',  hint: 'Universal victory window' },
  { key: 'vijayaMuhurta',   name: 'Vijaya Muhurta',   hint: 'Success in undertakings' },
  { key: 'godhuliMuhurta',  name: 'Godhuli Muhurta',  hint: 'Auspicious for travel & meetings' },
  { key: 'nishitaMuhurta',  name: 'Nishita Muhurta',  hint: 'Deep midnight practice' },
  { key: 'madhyahnaMuhurta', name: 'Madhyahna',       hint: 'Midday auspicious window' },
  { key: 'pratahSandhya',   name: 'Pratah Sandhya',   hint: 'Dawn junction' },
  { key: 'sayahnaSandhya',  name: 'Sayahna Sandhya',  hint: 'Dusk junction' },
];

export function MuhurtaCard({ p }: { p: any }) {
  if (!p) return null;

  const rows = AUSPICIOUS
    .map((a) => ({ ...a, period: periodOf(p[a.key]) }))
    .filter((x) => x.period);

  if (rows.length === 0) return null;

  const now = Date.now();

  return (
    <section className="overflow-hidden rounded-2xl border border-emerald-200 bg-card shadow-sm">
      <header className="flex items-baseline gap-2 border-b border-emerald-200 bg-gradient-to-r from-emerald-50 to-transparent px-5 py-3">
        <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-emerald-800">
          Auspicious Muhurtas
        </span>
      </header>

      <ul className="divide-y divide-emerald-100">
        {rows.map((row) => {
          const start = row.period?.start ? new Date(row.period.start as any).getTime() : 0;
          const end   = row.period?.end   ? new Date(row.period.end as any).getTime()   : 0;
          const isActive = now >= start && now < end;

          return (
            <li
              key={row.key}
              className={
                'flex items-center gap-3 px-5 py-2.5 text-xs transition-colors ' +
                (isActive ? 'bg-emerald-50' : 'hover:bg-emerald-50/40')
              }
            >
              <span className="h-8 w-0.5 shrink-0 rounded-full bg-emerald-400" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <p className="font-serif text-sm font-semibold text-emerald-950">{row.name}</p>
                  {isActive && (
                    <span className="rounded-full bg-emerald-600 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wider text-white">
                      Now
                    </span>
                  )}
                </div>
                <p className="text-[10px] text-muted-foreground">{row.hint}</p>
              </div>
              <span className="shrink-0 font-mono text-[11px] text-emerald-900 tabular-nums">
                {timeOf(row.period?.start)} - {timeOf(row.period?.end)}
              </span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}