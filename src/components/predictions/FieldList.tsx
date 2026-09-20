import { cn } from '@/lib/utils';
import { TONE_CLASSES, toneForScore, type Field } from './fieldTypes';

export function FieldList({ fields }: { fields: Field[] }) {
  return (
    <div className="space-y-3">
      {fields.map((f, i) => <FieldRow key={i} field={f} />)}
    </div>
  );
}

function FieldRow({ field }: { field: Field }) {
  switch (field.kind) {
    case 'score':
      return <ScoreRow field={field} />;
    case 'badge':
      return (
        <div>
          <Label>{field.label}</Label>
          <span className={cn('mt-0.5 inline-flex rounded-md px-2 py-0.5 text-xs font-semibold ring-1 ring-inset',
            TONE_CLASSES[field.tone ?? 'amber'])}>
            {field.value}
          </span>
        </div>
      );
    case 'text':
      return (
        <div>
          <Label>{field.label}</Label>
          <p className="mt-0.5 text-sm leading-relaxed">{field.value || '—'}</p>
        </div>
      );
    case 'paragraph':
      return (
        <div>
          <Label>{field.label}</Label>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{field.value}</p>
        </div>
      );
    case 'bullets':
      if (!field.items || field.items.length === 0) return null;
      return (
        <div>
          <Label>{field.label}</Label>
          <ul className="mt-1 space-y-1">
            {field.items.map((item, i) => (
              <li key={i} className="flex gap-2 text-sm leading-relaxed">
                <span className="mt-1.5 inline-block h-1 w-1 shrink-0 rounded-full bg-amber-500" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      );
    case 'kv':
      return (
        <div>
          <Label>{field.label}</Label>
          <dl className="mt-1 grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
            {field.pairs.map(([k, v], i) => (
              <div key={i} className="flex items-baseline justify-between gap-2 border-b border-dashed py-0.5">
                <dt className="text-[11px] text-muted-foreground">{k}</dt>
                <dd className="text-right font-medium">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      );
    case 'lalKitabRemedies':
      if (!field.items?.length) return null;
      return (
        <div>
          <Label>{field.label}</Label>
          <ul className="mt-1.5 space-y-2">
            {field.items.map((r, i) => (
              <li key={i} className="rounded-lg border border-amber-200 bg-amber-50/60 p-3">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-amber-800">
                  {r.area}
                </p>
                <p className="mt-1 text-sm leading-relaxed">{r.remedy}</p>
                {r.caution && (
                  <p className="mt-1.5 flex gap-1.5 border-t border-amber-200 pt-1.5 text-[11px] leading-relaxed text-amber-900">
                    <span className="shrink-0">⚠️</span>
                    <span>{r.caution.replace(/^[⚠️\s]*Caution:\s*/i, '')}</span>
                  </p>
                )}
              </li>
            ))}
          </ul>
        </div>
      );
    case 'mantras':
      if (!field.items?.length) return null;
      return (
        <div>
          <Label>{field.label}</Label>
          <ul className="mt-1.5 space-y-2">
            {field.items.map((m, i) => (
              <li key={i} className="rounded-lg border bg-muted/30 p-3">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  {m.deity}{m.count ? ' · ' + m.count : ''}
                </p>
                <p className="mt-1 font-serif text-base leading-relaxed text-amber-900">{m.mantra}</p>
                {m.benefit && (
                  <p className="mt-1 text-[11px] italic text-muted-foreground">{m.benefit}</p>
                )}
              </li>
            ))}
          </ul>
        </div>
      );
    case 'dosDonts':
      return (
        <div className="grid gap-3 sm:grid-cols-2">
          {field.dos?.length > 0 && (
            <div className="rounded-lg border border-emerald-200 bg-emerald-50/60 p-3">
              <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-emerald-800">
                ✅ Do
              </p>
              <ul className="space-y-1 text-sm">
                {field.dos.map((d, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-emerald-600">·</span>
                    <span>{d}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {field.donts?.length > 0 && (
            <div className="rounded-lg border border-red-200 bg-red-50/60 p-3">
              <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-red-800">
                ❌ Don't
              </p>
              <ul className="space-y-1 text-sm">
                {field.donts.map((d, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-red-600">·</span>
                    <span>{d}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      );
    case 'karmicDebts':
      if (!field.items?.length) return null;
      return (
        <div>
          <Label>{field.label}</Label>
          <ul className="mt-1.5 space-y-2">
            {field.items.map((d, i) => (
              <li key={i} className={cn('rounded-lg border p-3',
                d.isAfflicted ? 'border-red-200 bg-red-50/50' : 'border-emerald-200 bg-emerald-50/50')}>
                <div className="flex items-baseline gap-2">
                  <span className="text-sm font-semibold">{d.debtType}</span>
                  <span className={cn('rounded px-1.5 py-0.5 text-[9px] font-bold uppercase ring-1 ring-inset',
                    d.isAfflicted
                      ? 'bg-red-100 text-red-800 ring-red-200'
                      : 'bg-emerald-100 text-emerald-800 ring-emerald-200')}>
                    {d.isAfflicted ? 'Afflicted' : 'Clear'}
                  </span>
                </div>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{d.description}</p>
                {d.remedy && (
                  <p className="mt-1.5 border-t border-dashed pt-1.5 text-xs leading-relaxed">
                    <span className="font-semibold">Remedy: </span>{d.remedy}
                  </p>
                )}
              </li>
            ))}
          </ul>
        </div>
      );
    case 'specialYogas':
      if (!field.items?.length) return null;
      return (
        <div>
          <Label>{field.label}</Label>
          <ul className="mt-1.5 space-y-2">
            {field.items.map((y, i) => (
              <li key={i} className="rounded-lg border border-violet-200 bg-violet-50/50 p-3">
                <div className="flex items-baseline gap-2">
                  <span className="text-sm font-semibold text-violet-900">{y.name}</span>
                  <span className="rounded bg-violet-200 px-1.5 py-0.5 text-[9px] font-bold uppercase text-violet-900">
                    H{y.house}
                  </span>
                </div>
                <p className="mt-1 text-xs text-violet-800">
                  Planets · {y.planets.join(', ')}
                </p>
                <p className="mt-1 text-xs leading-relaxed">{y.effect}</p>
              </li>
            ))}
          </ul>
        </div>
      );
    case 'remedyList':
      if (!field.items?.length) return null;
      return (
        <div>
          <Label>{field.label}</Label>
          <ul className="mt-1.5 space-y-2">
            {field.items.map((r, i) => (
              <li key={i} className="rounded-lg border bg-card p-3">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="text-sm font-semibold">{r.title}</span>
                  {r.house && (
                    <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[9px] font-bold uppercase text-amber-800">
                      H{r.house}
                    </span>
                  )}
                </div>
                {r.reason && <p className="mt-1 text-[11px] italic text-muted-foreground">{r.reason}</p>}
                <p className="mt-1 text-xs leading-relaxed">{r.instructions}</p>
              </li>
            ))}
          </ul>
        </div>
      );
    default:
      return null;
  }
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
      {children}
    </p>
  );
}

function ScoreRow({ field }: { field: Extract<Field, { kind: 'score' }> }) {
  const max = field.max ?? 100;
  const pct = Math.max(0, Math.min(100, (field.value / max) * 100));
  const tone = field.tone === 'good' ? 'green'
    : field.tone === 'bad' ? 'red'
    : toneForScore(field.value, max);
  const bg = tone === 'green' ? 'bg-emerald-500'
    : tone === 'amber' ? 'bg-amber-500'
    : tone === 'red' ? 'bg-red-500'
    : 'bg-stone-400';
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <Label>{field.label}</Label>
        <span className="font-mono text-xs font-semibold tabular-nums">
          {field.value}<span className="text-muted-foreground">/{max}</span>
        </span>
      </div>
      <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <div className={cn('h-full rounded-full transition-all', bg)} style={{ width: pct + '%' }} />
      </div>
    </div>
  );
}