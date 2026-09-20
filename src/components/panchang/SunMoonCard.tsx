import { ch } from '@/lib/text';

const SUN = ch(0x2609);
const MOON = ch(0x263D);

function timeOf(v: unknown): string {
  if (!v) return '--';
  try {
    const d = v instanceof Date ? v : new Date(v as string);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } catch {
    return '--';
  }
}

function durationLabel(start: unknown, end: unknown): string | null {
  if (!start || !end) return null;
  try {
    const s = new Date(start as any).getTime();
    const e = new Date(end as any).getTime();
    const mins = Math.round((e - s) / 60_000);
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return h + 'h ' + String(m).padStart(2, '0') + 'm';
  } catch {
    return null;
  }
}

export function SunMoonCard({ p }: { p: any }) {
  if (!p) return null;

  const dayDur = durationLabel(p.sunrise, p.sunset);
  const nightDur = durationLabel(p.sunset, p.nextSunrise);

  return (
    <section className="overflow-hidden rounded-2xl border border-amber-200 bg-card shadow-sm">
      <header className="flex items-baseline gap-2 border-b border-amber-200 bg-gradient-to-r from-amber-50 to-transparent px-5 py-3">
        <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-amber-800">
          Sun & Moon
        </span>
      </header>

      <div className="grid grid-cols-2 divide-x divide-amber-100">
        {/* Sun */}
        <div className="p-4">
          <div className="flex items-center gap-2">
            <span className="text-3xl leading-none text-amber-600">{SUN}</span>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-amber-700">
              Surya
            </p>
          </div>
          <dl className="mt-3 space-y-1.5 text-xs">
            <Row label="Sunrise"      value={timeOf(p.sunrise)} />
            <Row label="Sunset"       value={timeOf(p.sunset)} />
            {dayDur && <Row label="Day length"   value={dayDur} />}
            {nightDur && <Row label="Night length" value={nightDur} />}
          </dl>
        </div>

        {/* Moon */}
        <div className="p-4">
          <div className="flex items-center gap-2">
            <span className="text-3xl leading-none text-slate-600">{MOON}</span>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-600">
              Chandra
            </p>
          </div>
          <dl className="mt-3 space-y-1.5 text-xs">
            <Row label="Moonrise" value={timeOf(p.moonrise)} />
            <Row label="Moonset"  value={timeOf(p.moonset)} />
            {p.moonPhase && <Row label="Phase" value={String(p.moonPhase)} />}
          </dl>
        </div>
      </div>
    </section>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-2">
      <dt className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</dt>
      <dd className="font-mono text-[11px] font-medium tabular-nums text-amber-950">{value}</dd>
    </div>
  );
}