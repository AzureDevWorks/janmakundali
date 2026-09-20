import { DOT } from '@/lib/text';

function timeLocal(v: unknown): string {
  if (!v) return '--';
  try {
    const d = v instanceof Date ? v : new Date(v as string);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } catch {
    return '--';
  }
}

/**
 * Reads names directly from @prisri/jyotish. The library provides
 * tithiName, nakshatraName, yogaName, varaName as ready-to-display
 * strings, so we do no index lookup or name resolution ourselves.
 */
export function PanchangHero({ p }: { p: any }) {
  if (!p) return null;

  const tithiName     = p.tithiName     ?? '--';
  const nakshatraName = p.nakshatraName ?? '--';
  const yogaName      = p.yogaName      ?? '--';
  const karanaName    = p.karana        ?? '--';
  const varaName      = p.varaName      ?? '--';
  const paksha        = p.paksha        ?? '--';

  return (
    <section className="overflow-hidden rounded-2xl border-2 border-amber-300 bg-gradient-to-br from-amber-50 via-amber-50/60 to-background shadow-sm">
      <header className="border-b border-amber-200 bg-gradient-to-r from-amber-100/80 to-amber-50 px-6 py-4">
        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-amber-800">
          Pancha Anga
        </p>
        <h2 className="mt-1 flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <span className="font-serif text-3xl font-bold tracking-tight text-amber-950">
            {tithiName}
          </span>
          {paksha !== '--' && (
            <span className="rounded-full bg-amber-200 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-900">
              {paksha} paksha
            </span>
          )}
        </h2>
        {varaName !== '--' && (
          <p className="mt-1 text-sm text-amber-800/80">{varaName}</p>
        )}
      </header>

      <div className="grid grid-cols-2 divide-x divide-amber-100 sm:grid-cols-4">
        <Tile
          label="Tithi"
          value={tithiName}
          sub={paksha !== '--' ? paksha + ' paksha' : undefined}
          endTime={p.tithiEndTime}
        />
        <Tile
          label="Nakshatra"
          value={nakshatraName}
          sub={p.nakshatraPada != null ? 'pada ' + p.nakshatraPada : undefined}
          endTime={p.nakshatraEndTime}
        />
        <Tile
          label="Yoga"
          value={yogaName}
          endTime={p.yogaEndTime}
        />
        <Tile
          label="Karana"
          value={karanaName}
        />
      </div>
    </section>
  );
}

function Tile({
  label, value, sub, endTime,
}: {
  label: string;
  value: string;
  sub?: string;
  endTime?: unknown;
}) {
  const endLabel = endTime ? timeLocal(endTime) : null;
  return (
    <div className="px-4 py-4">
      <p className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 truncate font-serif text-base font-bold leading-tight text-amber-950">
        {value}
      </p>
      {sub && <p className="text-[10px] text-muted-foreground">{sub}</p>}
      {endLabel && (
        <p className="mt-0.5 text-[9px] text-muted-foreground/70">
          until {endLabel}
        </p>
      )}
    </div>
  );
}