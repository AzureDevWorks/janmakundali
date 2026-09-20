import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { cn } from '@/lib/utils';

export function DashaCard({ kundli }: { kundli: any }) {
  const d = kundli?.dasha;
  if (!d) return null;
  const mds = d.mahadashas ?? [];
  const [open, setOpen] = useState<number | null>(null);
  const now = Date.now();
  const total = mds.reduce((s: number, m: any) => s + (m.durationYears ?? 0), 0) || 1;

  return (
    <Card title="Vimshottari Dasha"
      right={
        <span className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
          <span className="inline-block h-1.5 w-1.5 animate-pulse-soft rounded-full bg-amber-600" />
          {d.currentMahadasha?.planet}
          {d.currentAntar ? ' / ' + d.currentAntar.planet : ''}
          {d.currentPratyantar ? ' / ' + d.currentPratyantar.planet : ''}
        </span>
      }
      bodyClass="p-0">
      <div className="flex h-2 w-full overflow-hidden">
        {mds.map((m: any, i: number) => (
          <div key={i}
            style={{ width: ((m.durationYears ?? 0) / total) * 100 + '%' }}
            className="h-full bg-gradient-to-r from-amber-400 to-amber-600" />
        ))}
      </div>
      <ol className="divide-y max-h-[500px] overflow-y-auto">
        {mds.map((m: any, i: number) => {
          const start = new Date(m.startTime).getTime();
          const end = new Date(m.endTime).getTime();
          const current = now >= start && now < end;
          const expanded = open === i;
          return (
            <li key={i} className={cn('text-sm', current && 'bg-amber-50/70')}>
              <button type="button" onClick={() => setOpen(expanded ? null : i)}
                className="flex w-full items-center gap-3 px-4 py-2 text-left hover:bg-muted/40">
                <span className="w-4 text-[10px] text-muted-foreground">{expanded ? '▾' : '▸'}</span>
                <span className={cn('flex-1 font-semibold', current && 'text-amber-900')}>
                  {m.planet}
                </span>
                <span className="font-mono text-[11px] text-muted-foreground">
                  {new Date(m.startTime).getFullYear()}–{new Date(m.endTime).getFullYear()}
                </span>
                <span className="rounded bg-muted/60 px-1.5 py-0.5 text-[10px] font-semibold">
                  {m.durationYears}y
                </span>
                {current && (
                  <span className="rounded-full bg-amber-600 px-2 py-0.5 text-[9px] font-bold text-white">
                    NOW
                  </span>
                )}
              </button>
              {expanded && m.antars && (
                <ol className="border-t bg-muted/20">
                  {m.antars.map((a: any, j: number) => (
                    <li key={j} className="flex items-center justify-between gap-3 border-b border-dashed px-10 py-1.5 text-xs last:border-0">
                      <span className="text-muted-foreground">
                        {m.planet} → <span className="font-medium text-foreground">{a.planet}</span>
                      </span>
                      <span className="font-mono text-[10px] text-muted-foreground">
                        {new Date(a.startTime).toLocaleDateString()} – {new Date(a.endTime).toLocaleDateString()}
                      </span>
                    </li>
                  ))}
                </ol>
              )}
            </li>
          );
        })}
      </ol>
    </Card>
  );
}