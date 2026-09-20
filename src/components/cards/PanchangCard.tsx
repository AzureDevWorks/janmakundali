import { usePanchangam } from '@/features/kundli/usePanchangam';
import { Card } from '@/components/ui/Card';
import {
  TITHI_NAMES, NAKSHATRA_NAMES, YOGA_NAMES, VARA_NAMES, VARA_ENGLISH,
} from '@/lib/astro';

/** Coerce whatever the library returns (number / string / object) into a display name. */
function nameOf(v: unknown, table: string[]): string {
  if (v == null) return '--';
  if (typeof v === 'number') {
    return table[v] ?? table[((v % table.length) + table.length) % table.length] ?? String(v);
  }
  if (typeof v === 'string') return v;
  if (typeof v === 'object' && 'name' in (v as any)) return String((v as any).name);
  return String(v);
}

function pakshaOf(p: any): string | undefined {
  if (typeof p.paksha === 'string') return p.paksha;
  if (typeof p.tithi === 'number') return p.tithi < 15 ? 'Shukla' : 'Krishna';
  return undefined;
}

export function PanchangCard() {
  const { data: p, isLoading, error } = usePanchangam();

  if (isLoading) {
    return (
      <Card title="Panchang at Birth">
        <p className="text-sm text-muted-foreground">Loading...</p>
      </Card>
    );
  }
  if (error || !p) return null;

  const tithiName     = nameOf(p.tithi,     TITHI_NAMES);
  const nakshatraName = nameOf(p.nakshatra, NAKSHATRA_NAMES);
  const yogaName      = nameOf(p.yoga,      YOGA_NAMES);
  const karanaName    = nameOf(p.karana,    []);

  const varaNum = typeof p.vara === 'number'
    ? p.vara
    : typeof p.varaName === 'number' ? p.varaName : undefined;

  const varaLabel = varaNum != null
    ? ((VARA_NAMES[varaNum] ?? '') + ' (' + (VARA_ENGLISH[varaNum] ?? '') + ')').trim()
    : (typeof p.varaName === 'string' ? p.varaName : '--');

  const paksha = pakshaOf(p);

  const sunrise = p.sunrise ? new Date(p.sunrise) : null;
  const sunset  = p.sunset  ? new Date(p.sunset)  : null;

  return (
    <Card
      title="Panchang at Birth"
      right={varaLabel !== '--' ? (
        <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-800">
          {varaLabel}
        </span>
      ) : null}
    >
      <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
        <Cell label="Tithi" v={tithiName} sub={paksha} />
        <Cell
          label="Nakshatra"
          v={nakshatraName}
          sub={p.nakshatraPada ? 'pada ' + p.nakshatraPada : undefined}
        />
        <Cell label="Yoga"   v={yogaName} />
        <Cell label="Karana" v={karanaName} />
      </dl>

      {(sunrise || sunset) && (
        <p className="mt-3 border-t pt-2 text-[10px] text-muted-foreground">
          {sunrise && <>Sunrise {sunrise.toLocaleTimeString()} </>}
          {sunset  && <>· Sunset {sunset.toLocaleTimeString()}</>}
        </p>
      )}
    </Card>
  );
}

function Cell({ label, v, sub }: { label: string; v: string; sub?: string }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="font-semibold">{v}</p>
      {sub && <p className="text-[10px] text-muted-foreground">{sub}</p>}
    </div>
  );
}