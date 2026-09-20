import { usePanchangam } from '@/features/kundli/usePanchangam';
import { SANSKRIT } from '@/lib/text';

function timeLocal(v: unknown): string {
  if (!v) return '--';
  try {
    const d = v instanceof Date ? v : new Date(v as string);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } catch {
    return '--';
  }
}

export function PanchangCard() {
  const { data: p, isLoading } = usePanchangam();

  if (isLoading) {
    return (
      <Card>
        <p className="text-sm text-muted-foreground">Loading panchang...</p>
      </Card>
    );
  }
  if (!p) return null;

  const tithiName     = p.tithiName     ?? '--';
  const nakshatraName = p.nakshatraName ?? '--';
  const yogaName      = p.yogaName      ?? '--';
  const karanaName    = p.karana        ?? '--';
  const varaName      = p.varaName      ?? '--';
  const paksha        = p.paksha        ?? undefined;

  return (
    <Card>
      <CardTitle
        tag="Panchang"
        sanskrit={SANSKRIT.panchang}
        right={varaName !== '--' ? varaName : undefined}
      />

      <div className="border-b border-amber-100 px-5 py-4">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-amber-700">
          Tithi
        </p>
        <p className="mt-1 font-serif text-2xl font-bold leading-tight text-amber-950">
          {tithiName}
        </p>
        {paksha && (
          <p className="mt-0.5 text-[11px] text-muted-foreground">{paksha} paksha</p>
        )}
        {p.tithiEndTime && (
          <p className="mt-0.5 text-[10px] text-muted-foreground/70">
            until {timeLocal(p.tithiEndTime)}
          </p>
        )}
      </div>

      <div className="grid grid-cols-3 divide-x divide-amber-100">
        <Tile
          label="Nakshatra"
          value={nakshatraName}
          sub={p.nakshatraPada != null ? 'pada ' + p.nakshatraPada : undefined}
          endTime={p.nakshatraEndTime}
        />
        <Tile label="Yoga"   value={yogaName}   endTime={p.yogaEndTime} />
        <Tile label="Karana" value={karanaName} />
      </div>

      {(p.sunrise || p.sunset) && (
        <div className="flex items-center justify-between border-t border-amber-100 bg-amber-50/30 px-5 py-2.5 text-[10px] text-muted-foreground">
          {p.sunrise && <span>Sunrise {timeLocal(p.sunrise)}</span>}
          {p.sunset  && <span>Sunset  {timeLocal(p.sunset)}</span>}
        </div>
      )}
    </Card>
  );
}

function Tile({ label, value, sub, endTime }: {
  label: string; value: string; sub?: string; endTime?: unknown;
}) {
  const endLabel = endTime ? timeLocal(endTime) : null;
  return (
    <div className="px-4 py-3">
      <p className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 truncate font-serif text-sm font-semibold leading-tight text-amber-950">
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

function Card({ children }: { children: React.ReactNode }) {
  return (
    <section className="overflow-hidden rounded-2xl border border-amber-200 bg-card shadow-sm">
      {children}
    </section>
  );
}

function CardTitle({ tag, sanskrit, right }: {
  tag: string; sanskrit: string; right?: string;
}) {
  return (
    <header className="flex items-center justify-between gap-3 border-b border-amber-200 bg-gradient-to-r from-amber-50 to-transparent px-5 py-3">
      <div className="flex items-baseline gap-2">
        <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-amber-800">
          {tag}
        </span>
        <span className="font-serif text-[11px] text-amber-700/70" lang="sa">
          {sanskrit}
        </span>
      </div>
      {right && (
        <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-900 ring-1 ring-inset ring-amber-200">
          {right}
        </span>
      )}
    </header>
  );
}