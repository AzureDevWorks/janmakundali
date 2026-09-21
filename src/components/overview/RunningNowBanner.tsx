import { PLANET_GLYPH, planetColor } from '@/lib/astro';
import { cn } from '@/lib/utils';

interface Props {
  kundli: any;
}

export function RunningNowBanner({ kundli }: Props) {
  const d = kundli?.dasha;
  if (!d) return null;

  const maha = d.currentMahadasha;
  const antar = d.currentAntar;
  const prat = d.currentPratyantar;
  if (!maha) return null;

  // Progress within the mahadasha
  const start = maha.startTime ? new Date(maha.startTime).getTime() : 0;
  const end = maha.endTime ? new Date(maha.endTime).getTime() : 0;
  const now = Date.now();
  const progress = end > start ? Math.max(0, Math.min(100, ((now - start) / (end - start)) * 100)) : 0;

  const mahaColor = planetColor(maha.planet);
  const mahaGlyph = PLANET_GLYPH[maha.planet] ?? '\u25CF';

  // Sade Sati / Dhaiya status
  const moonLon = kundli?.planets?.Moon?.longitude ?? 0;
  const saturnLon = kundli?.planets?.Saturn?.longitude ?? 0;
  let sadeStatus: { label: string; tone: 'ok' | 'warn' | 'danger' } = {
    label: 'No Saturn transit alerts',
    tone: 'ok',
  };

  try {
    // Both longitude diffs measured as whole-sign counts
    const moonSign = Math.floor((((moonLon % 360) + 360) % 360) / 30);
    const saturnSign = Math.floor((((saturnLon % 360) + 360) % 360) / 30);
    const rel = ((saturnSign - moonSign + 12) % 12) + 1;
    if (rel === 12 || rel === 1 || rel === 2) {
      sadeStatus = { label: 'Sade Sati active', tone: 'danger' };
    } else if (rel === 8) {
      sadeStatus = { label: 'Ashtama Shani (8th from Moon)', tone: 'warn' };
    } else if (rel === 4) {
      sadeStatus = { label: 'Kantaka Shani (4th from Moon)', tone: 'warn' };
    }
  } catch { /* ignore */ }

  const statusTone =
    sadeStatus.tone === 'danger'
      ? 'bg-red-100 text-red-800 ring-red-200'
      : sadeStatus.tone === 'warn'
        ? 'bg-amber-100 text-amber-800 ring-amber-200'
        : 'bg-emerald-100 text-emerald-800 ring-emerald-200';

  return (
    <section className="overflow-hidden rounded-2xl border border-amber-200 bg-card shadow-sm">
      <header className="flex items-center justify-between gap-3 border-b border-amber-200 bg-gradient-to-r from-amber-50 to-transparent px-5 py-2.5">
        <div className="flex items-center gap-2">
          <span className="inline-block h-1.5 w-1.5 animate-pulse-soft rounded-full bg-red-500" />
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-amber-800">
            Running Now
          </p>
        </div>
        <span className={cn(
          'rounded-full px-2.5 py-0.5 text-[10px] font-semibold ring-1 ring-inset',
          statusTone,
        )}>
          {sadeStatus.label}
        </span>
      </header>

      <div className="grid gap-4 p-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        {/* Vimshottari dasha */}
        <div>
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Vimshottari Dasha
          </p>

          <div className="flex items-center gap-3">
            <span className={cn('text-3xl leading-none', mahaColor.text)}>
              {mahaGlyph}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate font-serif text-base font-bold text-amber-950">
                {maha.planet}
                {antar && <span className="text-muted-foreground"> {'\u203A'} {antar.planet}</span>}
                {prat && <span className="text-muted-foreground"> {'\u203A'} {prat.planet}</span>}
              </p>
              <p className="text-[10px] text-muted-foreground">
                Mahadasha {'\u00B7'} Antardasha {'\u00B7'} Pratyantar
              </p>
            </div>
          </div>

          <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-amber-100">
            <div
              className="h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-500 transition-all"
              style={{ width: progress + '%' }}
            />
          </div>
          <div className="mt-1 flex items-center justify-between text-[10px] text-muted-foreground">
            <span className="font-mono">
              {maha.startTime ? new Date(maha.startTime).getFullYear() : '\u2014'}
            </span>
            <span className="font-mono font-semibold tabular-nums">
              {progress.toFixed(0)}%
            </span>
            <span className="font-mono">
              {maha.endTime ? new Date(maha.endTime).getFullYear() : '\u2014'}
            </span>
          </div>
        </div>

        {/* Running yogas */}
        <div className="border-t border-amber-100 pt-4 lg:border-l lg:border-t-0 lg:pl-5 lg:pt-0">
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Active Yogas
          </p>
          {(kundli.yogas ?? []).slice(0, 3).map((y: any) => (
            <div key={y.name} className="mb-1.5 flex items-start gap-2 last:mb-0">
              <span className="mt-1.5 inline-block h-1 w-1 shrink-0 rounded-full bg-amber-500" />
              <div className="min-w-0">
                <p className="text-xs font-semibold text-amber-950">{y.name}</p>
                <p className="text-[10px] leading-snug text-muted-foreground">
                  {y.reasons?.[0] ?? y.type}
                </p>
              </div>
            </div>
          ))}
          {(!kundli.yogas || kundli.yogas.length === 0) && (
            <p className="text-xs italic text-muted-foreground">No major yogas detected.</p>
          )}
        </div>
      </div>
    </section>
  );
}